import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { AreaBundle, Intervention } from '../types';
import { decodeScenario } from '../lib/hash';
import { groupBans } from '../lib/bans';
import type { Mode } from '../lib/ramps';
import { DownloadImage } from './DownloadImage';
import { ProposalMap } from './ProposalMap';
import { AnchorHeading } from './Anchor';
import { calibrationStatusText } from '../lib/caveat';
import { pathOfSlug, slugOf } from '../lib/share-path';
import type { NetIndex } from '../lib/naming';
import { checkThroughRoutes, ROUTE_CAVEAT } from '../lib/throughroutes';
import { buildMockProposals } from '../fixtures/proposals';
import { shortStreetsDeep } from '../lib/streets';
import {
  allTrafficHeadline, allTrafficNote, banCount, banHeadline, changesSummary, detourHeadline, allTrafficRows, beforeAfterPct, comparisonText, cutThroughHeadline, detourText, evidenceNote, fetchProposals, formatComputed, harmHeadline, INTERVAL_SCOPE, intervalText, periodsPhrase,
  linkHash, listOptions, needsConfirm, objectiveTags, openReducer, parseProposals, proposalAnchor, provenanceLine, proposalNotices, proposalsUrl, seedsPhrase, signedNum, signedPct,
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
}

export function Proposals({ bundle, index, today, state, loaded, mode, current, onOpen, notice, onCopyLink }: Props) {
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
    <Card key={gid(g, p)} p={p} group={g} evidence={proposalNotices(g.computed, loaded).evidence} comparison={g.optionComparisons?.find((c) => c.option === p.id)} comparisonLabel={(id) => g.proposals.find((x) => x.id === id)?.title ?? id} shareUrl={`${location.origin}${pathOfSlug(slugOf(g.id, p.link))}`} onCopyLink={() => onCopyLink(p, g.id)} when={periodsPhrase(g.computed.periods, periodLabel)} hid={gid(g, p)} anchorId={proposalAnchor(g.id, p.id)} n={n} routes={routeCounts.get(gid(g, p)) ?? null} ivs={decoded.get(gid(g, p)) ?? null} searched={g.computed.periods} bundle={bundle} index={index} mode={mode} loaded={loaded} today={today} periodLabel={periodLabel} confirmId={open.step === 'confirm' && (open.id === gid(g, p) || open.id.startsWith(`${gid(g, p)}-v`)) ? open.id : null}
      onRequest={(v) => request(g, p, v)} onCancel={() => dispatch({ type: 'cancel' })} onConfirm={(v) => { dispatch({ type: 'done' }); onOpen(v === null ? p : variantProposal(p, p.variants![v])); }} />
  );

  const listed = ready && !ready.withdrawn ? listOptions(ready) : { search: [], reference: [] };
  // An older file's lists computed together say the same thing once.
  const statusGroups = (() => {
    const seen = new Set<string>();
    return ready && !ready.withdrawn ? ready.groups.filter((g) => {
      const failed = g.computed.estimation?.selection.failed ?? [];
      if (g.legacy || (g.proposals.length === 0 && !failed.length)) return false;
      const key = JSON.stringify([formatComputed(g.computed, periodLabel), proposalNotices(g.computed, loaded), provenanceLine(g.computed), failed]);
      return seen.has(key) ? false : (seen.add(key), true);
    }) : [];
  })();
  const legacyOnly = ready && !ready.withdrawn && ready.groups.some((g) => g.legacy);

  return (
    <div className="proposals-view">
      <AnchorHeading as="h2" id="proposals" label="Proposals">Proposals</AnchorHeading>
      {notice && <p className="notice" role="status">{notice}</p>}
      <p className="lead">
        Each proposal is a package of changes found by searching the simulation for the most through traffic removed from the area's side streets with the least traffic added to any one of them. They are listed by through cars removed, largest first.
      </p>
      <details className="prop-d prop-howto">
        <summary>How to read these cards, and where the figures come from</summary>
        <p className="small">
          A card shows through cars an hour before and after, the largest rise in all cars on any one block, and a map of the change in all cars on each block (hover, focus or tap a street or a change for its numbers). Everything else is under the sections on each card, closed until you open them, and Download image makes a picture to send. Every figure is a mean over the runs named on its card, with a 95% interval over those runs when the file records one.
        </p>
        {state.status === 'ready' && <p className="muted small">Through routes: {ROUTE_CAVEAT}</p>}
        {statusGroups.map((g) => (
          <div key={g.id}>
            <p className="muted small">{formatComputed(g.computed, periodLabel)}</p>
            {g.computed.simulator && <p className="muted small">{provenanceLine(g.computed)} {INTERVAL_SCOPE}</p>}
          </div>
        ))}
      </details>
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
            {g.computed.estimation?.selection.failed?.map((f) => (
              <p className="notice err" key={f.link}><strong>Failed confirmation.</strong> {f.title}. {f.reason}.</p>
            ))}
            {notices.exploratory && (
              <p className="notice" role="note">
                <strong>Exploratory.</strong> The baseline these were computed on is not calibrated against observed traffic yet, so read the figures as relative comparisons, not forecasts.
              </p>
            )}
            {notices.stale && <p className="notice err" role="note"><strong>Out of date.</strong> {notices.staleText}</p>}
            {!notices.stale && notices.unverified && <p className="notice" role="note"><strong>Not verified.</strong> {notices.unverifiedText}</p>}
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

const SHORT_LIST = 3;
/** Not shortened for display: links, and the map data matched against the network. */
const DISPLAY_SKIP = new Set(['link', 'id', 'picture', 'pictureAll']);

function Card({ p: raw, group, evidence, comparison, comparisonLabel, shareUrl, onCopyLink, when, hid, anchorId, n, routes, ivs, searched, bundle, index, mode, loaded, today, periodLabel, confirmId, onRequest, onCancel, onConfirm }: {
  p: Proposal; group: ProposalGroup; evidence: EvidenceStatus; comparison: OptionComparison | undefined; comparisonLabel(id: string): string; shareUrl: string; onCopyLink(): void; when: string; hid: string; anchorId: string; n: number | null; routes: number | null; ivs: Intervention[] | null; searched: string[]; bundle: AreaBundle; index: NetIndex; mode: Mode; loaded: LoadedHashes; today: number; periodLabel(id: string): string;
  /** The id of what is asking before it replaces the map's scenario: the option (`hid`) or one of its variants (`hid-v<k>`). */
  confirmId: string | null;
  onRequest(variant: number | null): void; onCancel(): void; onConfirm(variant: number | null): void;
}) {
  const p = useMemo(() => shortStreetsDeep(raw, DISPLAY_SKIP), [raw]);
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
  const rd = detourHeadline(p.residentsDetour);
  const ban = banHeadline(p);
  const banGroups = useMemo(() => (ban && ivs ? groupBans(ivs, bundle.network, index) : []), [ban, ivs, bundle.network, index]);
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
        <button type="button" className="btn" onClick={onCopyLink}>Copy link<span className="sr-only"> to {p.title}</span></button>
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
  const headRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const head = headRef.current, card = head?.parentElement;
    if (!head || !card) return;
    const set = () => card.style.setProperty('--prop-head-h', `${head.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(head);
    return () => ro.disconnect();
  }, []);
  const changes = <ul className="prop-ivs">{p.interventions.map((iv, i) => <li key={i}>{iv.label}{iv.bans !== undefined && <span className="muted">. One change, {iv.bans} individual turn bans.</span>}</li>)}</ul>;
  const actionRow = (
      <div className="prop-actions">
        {action}
        {hasPic && confirmId !== hid && <DownloadImage net={bundle.network} index={index} p={raw} ivs={ivs ?? []} areaName={bundle.entry.name} areaId={bundle.entry.id} status={calStatusText} openUrl={shareUrl} periodLabel={periodLabel} searchedPeriods={searched} runs={group.computed.seeds} evidence={evidence} />}
      </div>
  );
  const more = (
    <>
      {p.interventions.length <= SHORT_LIST
        ? <div className="prop-changes"><h4 className="prop-h">Changes{p.turnBans !== undefined ? ` (${changesSummary(p)})` : ''}</h4>{changes}</div>
        : <details className="prop-d"><summary>Changes in this package ({changesSummary(p)})</summary>{changes}</details>}
      {banGroups.length > 0 && (
        <details className="prop-d prop-bans">
          <summary>Every turn restriction, by the street it starts on ({banCount(p)})</summary>
          <p className="muted small">{ban?.caveat}</p>
          {banGroups.map((g) => (
            <section key={g.street} aria-label={`From ${g.street}`}>
              <h4 className="prop-h">From {g.street} <span className="count">{g.bans.length}</span></h4>
              <ul className="prop-banlist">{g.bans.map((b) => <li key={b.index}>{b.text}</li>)}</ul>
            </section>
          ))}
        </details>
      )}
      <details className="prop-d">
        <summary>In words, and where these figures come from</summary>
        <p className="small">{p.summary}</p>
        {tags.length > 0 && <p className="small"><strong>Best for:</strong> {tags.join(', ')}</p>}
        <p className="small">{cut.scope}</p>
        <p className="small">{cut.interval}</p>
        <p className="small">{evidenceNote(p, group)} {group.computed.simulator ? INTERVAL_SCOPE : ''}</p>
        {comparison && <p className="small">{comparisonText(comparison, comparisonLabel)}</p>}
      </details>
      <details className="prop-d">
        <summary>Through cars an hour, by period</summary>
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
      </details>
      <details className="prop-d">
        <summary>All cars on the worst block, and the search's ranking penalty</summary>
        <p className="muted small">
          All traffic on side-street blocks inside the study area, through cars and local trips together. Every car on one block, both directions, including the local trips of people who start or end a trip in the area. For each period, the block with the largest increase in all cars is named. The search itself penalizes the largest rise in all cars on any one block past an assumed noise band, because residents experience all the cars on their street. That block can differ from the one with the largest increase, so it is listed beside it. The penalty is a screening rule, not an uncertainty interval.
        </p>
        {!all.none && <p className="small"><strong>{all.figure}</strong> {all.label}.</p>}
        {!all.none && <p className="small">{all.split} {all.interval}</p>}
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
      <details className="prop-d">
        <summary>Context: through cars on one block, through routes, resident detour</summary>
        <h4>Through cars on one block</h4>
        <p className="small">{harm.none ? harm.label : <><strong>{harm.figure}</strong> {harm.label}</>}</p>
        <p className="muted small">{harm.definition}</p>
        {routes !== null && <p className="small">Through routes: <strong>{routes}</strong> ({today} today)</p>}
        {detour && (
          <>
            <h4>Resident detour, in detail</h4>
            <p className="muted small">{detour.detail}</p>
          </>
        )}
      </details>
      {variants.length > 0 && (
        <details className="prop-d prop-variants">
          <summary>Variants ({variants.length})</summary>
          <p className="muted small">Tweaks of this proposal that the search found to do about the same. Each opens on the map and runs live.</p>
          <ul>{variants.map((v, k) => variantItem(v, k))}</ul>
        </details>
      )}
    </>
  );
  return (
    <li className="prop-card" aria-labelledby={anchorId}>
      <div ref={headRef} className="prop-head">
        <div className="prop-title">
          <AnchorHeading as="h3" id={anchorId} label={p.title}>{n !== null && <span className="prop-n">{n}. </span>}{p.title}</AnchorHeading>
          {isRef && <span className="tag">Earlier proposal</span>}
        </div>
        <p className="prop-headfig"><span className="fig-num">{cut.figure}</span> {cut.label} <span className="fig-pct">{cut.change}</span></p>
        {rd && <p className="prop-headsub"><span className="prop-headsub-lead">{rd.lead}</span> <strong>{rd.figure}</strong>{rd.label && ` ${rd.label}`}</p>}
      </div>
      {isRef && p.note && <p className="muted prop-note">{p.note}</p>}
      <div className="prop-figs">
        {ban && (
          <div className="prop-ban">
            <p className="prop-scale"><strong>{ban.text}</strong></p>
            <p className="notice prop-banwarn" role="note"><strong>Assumption.</strong> {ban.caveat}</p>
          </div>
        )}
        {p.accessProblem && <p className="notice err"><strong>Street access check failed.</strong> {p.accessProblem}.</p>}
        {p.simulationProblem && <p className="notice err"><strong>Simulation validity check failed.</strong> {p.simulationProblem}.</p>}
        <div className="fig fig-cut">
          <p className="fig-main"><span className="fig-lead">{cut.lead}</span> <span className="fig-num">{cut.delta}</span> {cut.label} over all side streets ({cut.figure}) <span className="fig-pct">{cut.pct}</span></p>
        </div>
        <div className="fig fig-all">
          <p className="fig-main">{all.none ? all.label : <><span className="fig-lead">Largest rise on one block:</span> <span className="fig-num">{all.figure}</span> {all.short}</>}</p>
        </div>
      </div>
      {hasPic
        ? <ProposalMap net={bundle.network} index={index} p={raw} group={group} ivs={ivs ?? []} areaId={bundle.entry.id} mode={mode} periodLabel={periodLabel} searchedPeriods={searched} loaded={loaded} actions={actionRow}>{more}</ProposalMap>
        : <>{actionRow}{more}</>}
    </li>
  );
}
