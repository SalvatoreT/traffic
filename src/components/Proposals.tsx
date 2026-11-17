import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { AreaBundle, Intervention } from '../types';
import { decodeScenario } from '../lib/hash';
import type { Mode } from '../lib/ramps';
import { DownloadImage } from './DownloadImage';
import { ProposalMap } from './ProposalMap';
import { AnchorHeading } from './Anchor';
import { calibrationStatusText } from '../lib/caveat';
import { pathOfSlug, slugOf } from '../lib/share-path';
import type { NetIndex } from '../lib/naming';
import { checkThroughRoutes, ROUTE_CAVEAT } from '../lib/throughroutes';
import { buildMockProposals } from '../fixtures/proposals';
import { canTrace } from '../lib/redistribution-view';
import {
  allTrafficHeadline, allTrafficNote, allTrafficRows, beforeAfterPct, comparisonText, cutThroughHeadline, detourText, evidenceNote, fetchProposals, formatComputed, harmHeadline, INTERVAL_SCOPE, intervalText, periodsPhrase,
  linkHash, listOptions, needsConfirm, objectiveTags, openReducer, parseProposals, provenanceLine, proposalNotices, proposalsUrl, seedsPhrase, signedNum, signedPct,
  type EvidenceStatus, type Listed, type LoadedHashes, type OptionComparison, type Proposal, type ProposalGroup, type ProposalsState, type Variant,
} from '../lib/proposals';

const mockParam = new URLSearchParams(location.search).get('mockProposals');

/** Fetched once, the first time the tab is open and the app's input hashes are known. A missing file is the normal "none yet" state. */
export function useProposals(bundle: AreaBundle, active: boolean, hashes: LoadedHashes | null): ProposalsState {
  const [state, setState] = useState<ProposalsState>({ status: 'idle' });
  const started = useRef(false);
  useEffect(() => {
    if (!active || started.current || !hashes) return;
    if (mockParam && hashes.simulator === undefined) return;
    started.current = true;
    setState({ status: 'loading' });
    (async () => {
      if (mockParam) {
        const file = buildMockProposals(bundle.network, {
          networkHash: hashes.network ?? 'unknown', demandHash: hashes.demand ?? 'unknown',
          calibration: bundle.entry.calibration?.status ?? 'uncalibrated', simulator: hashes.simulator ?? undefined,
        }, mockParam === 'stale' ? 'stale' : mockParam === 'legacy' ? 'legacy' : 'fresh');
        // Through the reader, so a mock in an older shape is read the way a published file of that version is.
        const read = parseProposals(JSON.stringify(file));
        setState(read ? { status: 'ready', file: read } : { status: 'none' });
        return;
      }
      const file = bundle.synthetic ? null : await fetchProposals(proposalsUrl(bundle.entry));
      setState(file ? { status: 'ready', file } : { status: 'none' });
    })();
  }, [active, bundle, hashes]);
  return state;
}

interface Props {
  bundle: AreaBundle; index: NetIndex; today: number; state: ProposalsState; loaded: LoadedHashes; mode: Mode;
  current: Intervention[];
  onOpen(p: Proposal): void;
  /** Said above the cards when a share path named a proposal that is no longer published. */
  notice?: string | null;
  onCopyLink(p: Proposal, groupId: string): void;
  /** Open "Where traffic goes" for a package. */
  onTrace?(p: Proposal, ivs: Intervention[]): void;
}

export function Proposals({ bundle, index, today, state, loaded, mode, current, onOpen, notice, onCopyLink, onTrace }: Props) {
  const periodLabel = useMemo(() => {
    const m = new Map(bundle.demand.periods.map((p) => [p.id, p.label]));
    return (id: string) => m.get(id) ?? id;
  }, [bundle.demand.periods]);
  const [open, dispatch] = useReducer(openReducer, { step: 'idle' });

  const ready = state.status === 'ready' ? state.file : null;
  const gid = (g: ProposalGroup, p: Proposal) => `${g.id}-${p.id}`;

  const request = (g: ProposalGroup, p: Proposal, v: number | null = null) => {
    const target = v === null ? p : variantProposal(p, p.variants![v]);
    const next = decodeScenario(bundle.network, linkHash(target.link)).interventions;
    if (needsConfirm(current, next)) dispatch({ type: 'ask', id: v === null ? gid(g, p) : `${gid(g, p)}-v${v}` });
    else { dispatch({ type: 'done' }); onOpen(target); }
  };
  // Decoding and checking is a few milliseconds per proposal, so it is done once per file.
  const decoded = useMemo(() => {
    const m = new Map<string, Intervention[]>();
    if (ready) for (const g of ready.groups) for (const p of g.proposals) {
      try { m.set(`${g.id}-${p.id}`, decodeScenario(bundle.network, linkHash(p.link)).interventions); } catch { /* left out */ }
    }
    return m;
  }, [ready, bundle.network]);
  const routeCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const [k, ivs] of decoded) {
      try { m.set(k, checkThroughRoutes(bundle.network, index, ivs).total); } catch { /* left out */ }
    }
    return m;
  }, [decoded, bundle.network, index]);
  const card = ({ group: g, proposal: p }: Listed, n: number | null) => (
    <Card key={gid(g, p)} p={p} group={g} evidence={proposalNotices(g.computed, loaded).evidence} comparison={g.optionComparisons?.find((c) => c.option === p.id)} comparisonLabel={(id) => g.proposals.find((x) => x.id === id)?.title ?? id} shareUrl={`${location.origin}${pathOfSlug(slugOf(g.id, p.link))}`} onCopyLink={() => onCopyLink(p, g.id)} when={periodsPhrase(g.computed.periods, periodLabel)} hid={gid(g, p)} n={n} routes={routeCounts.get(gid(g, p)) ?? null} ivs={decoded.get(gid(g, p)) ?? null} searched={g.computed.periods} bundle={bundle} index={index} mode={mode} loaded={loaded} today={today} periodLabel={periodLabel} confirmId={open.step === 'confirm' && (open.id === gid(g, p) || open.id.startsWith(`${gid(g, p)}-v`)) ? open.id : null}
      onRequest={(v) => request(g, p, v)} onCancel={() => dispatch({ type: 'cancel' })} onConfirm={(v) => { dispatch({ type: 'done' }); onOpen(v === null ? p : variantProposal(p, p.variants![v])); }}
      onTrace={onTrace && decoded.get(gid(g, p))?.some(canTrace) ? () => onTrace(p, decoded.get(gid(g, p))!) : undefined} />
  );

  const listed = ready && !ready.withdrawn ? listOptions(ready) : { search: [], reference: [] };
  // An older file's lists computed together say the same thing once.
  const statusGroups = (() => {
    const seen = new Set<string>();
    return ready && !ready.withdrawn ? ready.groups.filter((g) => {
      if (g.legacy || g.proposals.length === 0) return false;
      const key = JSON.stringify([formatComputed(g.computed, periodLabel), proposalNotices(g.computed, loaded), provenanceLine(g.computed)]);
      return seen.has(key) ? false : (seen.add(key), true);
    }) : [];
  })();
  const legacyOnly = ready && !ready.withdrawn && ready.groups.some((g) => g.legacy);

  return (
    <div className="proposals-view">
      <AnchorHeading as="h2" id="proposals" label="Proposals">Proposals</AnchorHeading>
      {notice && <p className="notice" role="status">{notice}</p>}
      <p className="lead">
        Each proposal is a package of changes found by searching the simulation for the most through traffic removed from the area's side streets with the least traffic added to any one of them. They are listed by through cars removed, largest first. A card shows through cars an hour before and after, then a map of the change on each street (hover, focus or tap a street or a change for its numbers), the largest rise in all cars on any one block, and the changes. Everything else is under More detail, and Download image makes a picture to send. Every figure is a mean over the runs named on its card, with a 95% interval over those runs when the file records one.
      </p>
      {state.status === 'ready' && <p className="muted small">Through routes: {ROUTE_CAVEAT}</p>}
      {state.status === 'idle' || state.status === 'loading' ? <p role="status" className="muted">Loading proposals…</p> : null}
      {state.status === 'none' && (
        <div className="empty" role="status">
          <p><strong>No proposals have been computed for {bundle.entry.name} yet.</strong></p>
          <p className="muted">Until then, you can try interventions yourself on the Map.</p>
        </div>
      )}
      {ready && ready.withdrawn && (
        <div className="empty" role="status">
          <p><strong>The proposals have been withdrawn for now.</strong></p>
          <p>{ready.withdrawn}</p>
          <p className="muted">Until new ones are published, you can try interventions yourself on the Map.</p>
        </div>
      )}
      {ready && !ready.withdrawn && ready.groups.length === 0 && <p className="muted" role="status">This file holds no options.</p>}
      {statusGroups.map((g) => {
        const notices = proposalNotices(g.computed, loaded);
        return (
          <div key={g.id} className="prop-status">
            <p className="muted">{formatComputed(g.computed, periodLabel)}</p>
            {notices.exploratory && (
              <p className="notice" role="note">
                <strong>Exploratory.</strong> The baseline these were computed on is not calibrated against observed traffic yet, so read the figures as relative comparisons, not forecasts.
              </p>
            )}
            {notices.stale && <p className="notice err" role="note"><strong>Out of date.</strong> {notices.staleText}</p>}
            {!notices.stale && notices.unverified && <p className="notice" role="note"><strong>Not verified.</strong> {notices.unverifiedText}</p>}
            {g.computed.simulator && <p className="muted small">{provenanceLine(g.computed)} {INTERVAL_SCOPE}</p>}
          </div>
        );
      })}
      {listed.search.length > 0 && (
        <ol className="prop-list" aria-label="Options, from the most through cars removed to the least">
          {listed.search.map((x, i) => card(x, i + 1))}
        </ol>
      )}
      {listed.reference.length > 0 && (
        <section aria-labelledby="proposals-for-comparison" className="prop-ref">
          <AnchorHeading as="h4" id="proposals-for-comparison" label="For comparison" className="sec-h">For comparison</AnchorHeading>
          <ol className="prop-list">{listed.reference.map((x) => card(x, null))}</ol>
        </section>
      )}
      {legacyOnly && <p className="notice err" role="note"><strong>Out of date.</strong> These options were computed before the figures were made like-for-like (through cars beside through cars), so they are not shown. They need to be computed again.</p>}
      {ready && !ready.withdrawn && ready.groups.length > 0 && listed.search.length === 0 && listed.reference.length === 0 && !legacyOnly && (
        <p className="muted" role="status">No options were found.</p>
      )}
    </div>
  );
}

/** A variant opens as a scenario of its own: its link, with the option's name for the notice. */
function variantProposal(p: Proposal, v: Variant): Proposal {
  const { picture: _p, pictureAll: _a, variants: _v, ...rest } = p;
  return { ...rest, title: `${p.title} (variant)`, link: v.link };
}

const VISIBLE_VARIANTS = 3;

function Card({ p, group, evidence, comparison, comparisonLabel, shareUrl, onCopyLink, when, hid, n, routes, ivs, searched, bundle, index, mode, loaded, today, periodLabel, confirmId, onRequest, onCancel, onConfirm, onTrace }: {
  p: Proposal; group: ProposalGroup; evidence: EvidenceStatus; comparison: OptionComparison | undefined; comparisonLabel(id: string): string; shareUrl: string; onCopyLink(): void; when: string; hid: string; n: number | null; routes: number | null; ivs: Intervention[] | null; searched: string[]; bundle: AreaBundle; index: NetIndex; mode: Mode; loaded: LoadedHashes; today: number; periodLabel(id: string): string;
  /** The id of what is asking before it replaces the map's scenario: the option (`hid`) or one of its variants (`hid-v<k>`). */
  confirmId: string | null;
  onRequest(variant: number | null): void; onCancel(): void; onConfirm(variant: number | null): void; onTrace?(): void;
}) {
  const cut = cutThroughHeadline(p.cutThrough, when, group.computed.seeds, bundle.entry.name);
  const harm = harmHeadline(p.harm, when);
  const allRows = allTrafficRows(p, periodLabel);
  const allNote = allTrafficNote(allRows);
  const all = allTrafficHeadline(allRows);
  const opener = useRef<HTMLElement | null>(null);
  const confirmBtn = useRef<HTMLButtonElement>(null);
  const wasConfirming = useRef(false);
  const confirming = confirmId !== null;
  useEffect(() => {
    if (confirming) confirmBtn.current?.focus();
    else if (wasConfirming.current) opener.current?.focus();
    wasConfirming.current = confirming;
  }, [confirming]);
  const periods = Object.entries(p.byPeriod);
  const isRef = p.kind === 'reference';
  const tags = objectiveTags(p);
  const detour = detourText(p.residentsDetour);
  const calStatusText = calibrationStatusText(bundle.entry.calibration);
  const hasPic = !!p.picture && ivs !== null;
  const variants = p.variants ?? [];
  const confirmBox = (variant: number | null) => (
    <div className="prop-confirm" role="group" aria-label="Replace current scenario?">
      <p><strong>Replace current scenario?</strong> Your interventions on the map will be swapped for {variant === null ? 'this package' : 'this variant'}.</p>
      <button ref={confirmBtn} type="button" className="btn primary" onClick={() => onConfirm(variant)}>Replace and open</button>{' '}
      <button type="button" className="btn" onClick={onCancel}>Cancel</button>
    </div>
  );
  const ask = (variant: number | null) => (e: React.MouseEvent<HTMLElement>) => { opener.current = e.currentTarget; onRequest(variant); };
  const action = (
    confirmId === hid ? confirmBox(null) : (
      <>
        <button type="button" className="btn primary" onClick={ask(null)}>Open on the map<span className="sr-only">: {p.title}</span></button>{' '}
        <button type="button" className="btn" onClick={onCopyLink}>Copy link<span className="sr-only"> to {p.title}</span></button>{' '}
        {onTrace && <button type="button" className="btn" onClick={onTrace}>Where traffic goes<span className="sr-only">: {p.title}</span></button>}
      </>
    )
  );
  const variantItem = (v: Variant, k: number) => (
    <li key={v.link}>
      <span>{v.differs.join('; ')}</span>
      {v.cutThrough && <span className="muted"> — through cars an hour {Math.round(v.cutThrough.baselineVehPerHour)} → {Math.round(v.cutThrough.scenarioVehPerHour)} ({signedPct(v.cutThrough.changePct)}{v.cutThrough.seeds && v.cutThrough.seeds.length > 0 ? `; ${seedsPhrase(v.cutThrough.seeds)}` : ''})</span>}{' '}
      {confirmId === `${hid}-v${k}`
        ? confirmBox(k)
        : <button type="button" className="btn small-btn" onClick={ask(k)}>Open variant on the map<span className="sr-only">: {p.title}, {v.differs.join('; ')}</span></button>}
    </li>
  );
  return (
    <li className="prop-card" aria-labelledby={hid}>
      <div className="prop-head">
        <AnchorHeading as="h4" id={hid} label={p.title}>{n !== null && <span className="prop-n">{n}. </span>}{p.title}</AnchorHeading>
        {isRef && <span className="tag">Earlier proposal</span>}
      </div>
      {tags.length > 0 && <p className="prop-best small"><span className="prop-best-lead">Best for:</span> {tags.join(', ')}</p>}
      {isRef && p.note && <p className="muted prop-note">{p.note}</p>}
      <div className="prop-body">
        <div className="prop-figs">
          <div className="fig">
            <p className="fig-main"><span className="fig-num">{cut.figure}</span> {cut.label} <span className="fig-pct">{cut.change}</span></p>
            <p className="fig-sub">{cut.scope}</p>
            <p className="fig-sub">{cut.interval}</p>
          </div>
          {detour && (
            <div className="fig fig-detour">
              <p className="fig-main"><span className="fig-num">{detour.figure}</span> {detour.label}</p>
              <p className="fig-sub">{detour.detail}</p>
            </div>
          )}
          <div className="fig fig-all">
            <p className="fig-main">{all.none ? all.label : <><span className="fig-num">{all.figure}</span> {all.label}</>}</p>
            {!all.none && <p className="fig-sub">{all.split} {all.interval}</p>}
          </div>
        </div>
        {hasPic && <ProposalMap net={bundle.network} index={index} p={p} group={group} ivs={ivs ?? []} areaId={bundle.entry.id} mode={mode} periodLabel={periodLabel} searchedPeriods={searched} loaded={loaded} onTrace={onTrace} />}
        <div className="prop-extra">
        <div className="prop-changes">
        <h5 className="prop-h">Changes</h5>
        <ul className="prop-ivs">{p.interventions.map((iv, i) => <li key={i}>{iv.label}</li>)}</ul>
        </div>
        {variants.length > 0 && (
          <div className="prop-variants">
            <h5>Variants</h5>
            <p className="muted small">Tweaks of this proposal that the search found to do about the same. Each opens on the map and runs live.</p>
            <ul>{variants.slice(0, VISIBLE_VARIANTS).map((v, k) => variantItem(v, k))}</ul>
            {variants.length > VISIBLE_VARIANTS && (
              <details>
                <summary>{variants.length - VISIBLE_VARIANTS} more {variants.length - VISIBLE_VARIANTS === 1 ? 'variant' : 'variants'}</summary>
                <ul>{variants.slice(VISIBLE_VARIANTS).map((v, k) => variantItem(v, k + VISIBLE_VARIANTS))}</ul>
              </details>
            )}
          </div>
        )}
        </div>
        <div className="prop-actions">
          {action}
          {hasPic && confirmId !== hid && <DownloadImage net={bundle.network} index={index} p={p} ivs={ivs ?? []} areaName={bundle.entry.name} areaId={bundle.entry.id} status={calStatusText} openUrl={shareUrl} periodLabel={periodLabel} searchedPeriods={searched} runs={group.computed.seeds} evidence={evidence} />}
        </div>
      </div>
      <details className="prop-more">
        <summary>More detail</summary>
        <h5>In words</h5>
        <p className="small">{p.summary}</p>
        <h5>Where these figures come from</h5>
        <p className="small">{evidenceNote(p, group)} {group.computed.simulator ? INTERVAL_SCOPE : ''}</p>
        {comparison && <p className="small">{comparisonText(comparison, comparisonLabel)}</p>}
        {routes !== null && <p className="small">Through routes: <strong>{routes}</strong> ({today} today)</p>}
        <h5>Through cars on one block</h5>
        <p className="small">{harm.none ? harm.label : <><strong>{harm.figure}</strong> {harm.label}</>}</p>
        <p className="muted small">{harm.definition}</p>
        <h5>Through cars an hour, by period</h5>
        <p className="muted small">Through cars on all the area's side streets together: before → after today's streets, with the change in parentheses.</p>
        <div className="table-scroll" role="region" aria-label="Through cars by period, scrollable" tabIndex={0}>
          <table>
            <caption className="sr-only">Through cars an hour on the area's side streets, by period</caption>
            <thead><tr><th scope="col">Period</th><th scope="col">Through cars an hour, before → after (change)</th><th scope="col">Interval over runs, cars an hour</th></tr></thead>
            <tbody>
              {periods.map(([id, v]) => (
                <tr key={id}><th scope="row">{periodLabel(id)}</th><td>{beforeAfterPct(v.cutThrough)}</td><td>{intervalText(v.cutThrough.effect, '')}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <h5>All traffic on side-street blocks inside the study area (through and local trips together)</h5>
        <p className="muted small">
          Every car on one block, both directions, including the local trips of people who start or end a trip in the area. For each period, the block with the largest increase in all cars is named. The search itself penalizes the largest rise in all cars on any one block past an assumed noise band, because residents experience all the cars on their street. That block can differ from the one with the largest increase, so it is listed beside it. The penalty is a screening rule, not an uncertainty interval.
        </p>
        <div className="table-scroll" role="region" aria-label="All traffic on side-street blocks by period, scrollable" tabIndex={0}>
          <table className="wide">
            <caption className="sr-only">All cars an hour on the side-street block with the largest increase, by period, split into through cars and local trips, and the block behind the search's ranking penalty</caption>
            <thead>
              <tr>
                <th scope="col">Period</th><th scope="col">Block with the largest increase in all traffic</th><th scope="col">All cars an hour, before → after</th>
                <th scope="col">Of the change: through cars</th><th scope="col">Of the change: local trips</th><th scope="col">Interval over runs</th>
                <th scope="col">Search's ranking penalty: block and cars an hour past its noise band</th><th scope="col">Blocks past the noise band</th>
              </tr>
            </thead>
            <tbody>
              {allRows.map((r) => (
                <tr key={r.period}>
                  <th scope="row">{r.period}</th>
                  {r.block === null
                    ? <><td>None flagged by the noise band</td><td>—</td><td>—</td><td>—</td></>
                    : <><td>{r.block}{r.flagged ? ' (flagged by the search; not necessarily the largest increase)' : ''}</td><td>{Math.round(r.before)} → {Math.round(r.after)} ({signedNum(r.change, 'cars an hour', 0)})</td><td>{signedNum(r.through, 'cars an hour', 0)}</td><td>{signedNum(r.local, 'cars an hour', 0)}</td></>}
                  <td>{r.interval}</td>
                  <td>{r.penaltyBlock === null || r.penalty === 0 ? 'None past its band' : `${r.penaltyBlock}${r.penalty === null ? '' : `: ${signedNum(r.penalty, 'cars an hour', 0)}`}`}</td>
                  <td>{r.blocksAbove}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allNote && <p className="small">{allNote}</p>}
        <p className="muted small">{all.attribution}</p>
      </details>
    </li>
  );
}
