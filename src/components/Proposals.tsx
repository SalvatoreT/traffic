import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { AreaBundle, Intervention } from '../types';
import { decodeScenario } from '../lib/hash';
import type { Mode } from '../lib/ramps';
import { ProposalPicture } from './ProposalPicture';
import { AnchorHeading } from './Anchor';
import { calibrationStatusText } from '../lib/caveat';
import { pathOfSlug, slugOf } from '../lib/share-path';
import type { NetIndex } from '../lib/naming';
import { checkThroughRoutes, ROUTE_CAVEAT } from '../lib/throughroutes';
import { buildMockProposals } from '../fixtures/proposals';
import { canTrace } from '../lib/redistribution-view';
import {
  allTrafficHeadline, allTrafficNote, allTrafficRows, beforeAfterPct, comparisonText, cutThroughHeadline, evidenceNote, fetchProposals, formatComputed, harmHeadline, INTERVAL_SCOPE, intervalText, periodsPhrase,
  linkHash, needsConfirm, openReducer, parseProposals, provenanceLine, proposalNotices, proposalsUrl, signedNum, signedPct, splitProposals,
  type EvidenceStatus, type LoadedHashes, type OptionComparison, type Proposal, type ProposalGroup, type ProposalsState,
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

  const request = (g: ProposalGroup, p: Proposal) => {
    const next = decodeScenario(bundle.network, linkHash(p.link)).interventions;
    if (needsConfirm(current, next)) dispatch({ type: 'ask', id: gid(g, p) });
    else { dispatch({ type: 'done' }); onOpen(p); }
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
  const card = (g: ProposalGroup, p: Proposal, n: number | null, evidence: EvidenceStatus) => (
    <Card key={p.id} p={p} group={g} evidence={evidence} comparison={g.optionComparisons?.find((c) => c.option === p.id)} comparisonLabel={(id) => g.proposals.find((x) => x.id === id)?.title ?? id} shareUrl={`${location.origin}${pathOfSlug(slugOf(g.id, p.link))}`} onCopyLink={() => onCopyLink(p, g.id)} when={periodsPhrase(g.computed.periods, periodLabel)} hid={gid(g, p)} n={n} routes={routeCounts.get(gid(g, p)) ?? null} ivs={decoded.get(gid(g, p)) ?? null} searched={g.computed.periods} bundle={bundle} index={index} mode={mode} today={today} periodLabel={periodLabel} confirming={open.step === 'confirm' && open.id === gid(g, p)}
      onRequest={() => request(g, p)} onCancel={() => dispatch({ type: 'cancel' })} onConfirm={() => { dispatch({ type: 'done' }); onOpen(p); }}
      onTrace={onTrace && decoded.get(gid(g, p))?.some(canTrace) ? () => onTrace(p, decoded.get(gid(g, p))!) : undefined} />
  );

  return (
    <div className="proposals-view">
      <AnchorHeading as="h2" id="proposals" label="Proposals">Proposals</AnchorHeading>
      {notice && <p className="notice" role="status">{notice}</p>}
      <p className="lead">
        These are packages of changes found by searching the simulation for the most through traffic removed from the area's
        side streets with the least traffic added to any one of them. The cards compare through cars with through cars:
        the first figure is all the side streets together, the second is the one block with the largest increase. Every figure
        is a mean over the runs named on its card, with a 95% interval over those runs when the file records one. The search itself penalizes the
        largest rise in all traffic (through cars and local trips together) on any one block past an assumed noise band,
        because residents experience all the cars on their street. That block can differ from the one with the largest increase;
        both are in More detail on each card.
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
      {ready && ready.groups.map((g) => {
        const notices = proposalNotices(g.computed, loaded);
        const parts = splitProposals(g);
        const hid = g.id;
        return (
          <section key={g.id} aria-labelledby={hid} className="prop-group">
            <AnchorHeading id={hid} label={g.title} className="prop-group-h">{g.title}</AnchorHeading>
            {g.note && <p className="prop-group-note">{g.note}</p>}
            <div className="prop-status">
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
            {parts.search.length > 0 && (
              <ol className="prop-list" aria-label={`${g.title}: options, from fewest changes to greatest reduction`}>
                {parts.search.map((p, i) => card(g, p, i + 1, notices.evidence))}
              </ol>
            )}
            {parts.reference.length > 0 && (
              <section aria-labelledby={`${hid}-for-comparison`} className="prop-ref">
                <AnchorHeading as="h4" id={`${hid}-for-comparison`} label={`${g.title}: for comparison`} className="sec-h">For comparison</AnchorHeading>
                <ol className="prop-list">{parts.reference.map((p) => card(g, p, null, notices.evidence))}</ol>
              </section>
            )}
            {g.legacy && <p className="notice err" role="note"><strong>Out of date.</strong> These options were computed before the figures were made like-for-like (through cars beside through cars), so they are not shown. They need to be computed again.</p>}
            {!g.legacy && parts.search.length === 0 && parts.reference.length === 0 && (
              <p className="muted" role="status">No options were found under these limits.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function Card({ p, group, evidence, comparison, comparisonLabel, shareUrl, onCopyLink, when, hid, n, routes, ivs, searched, bundle, index, mode, today, periodLabel, confirming, onRequest, onCancel, onConfirm, onTrace }: {
  p: Proposal; group: ProposalGroup; evidence: EvidenceStatus; comparison: OptionComparison | undefined; comparisonLabel(id: string): string; shareUrl: string; onCopyLink(): void; when: string; hid: string; n: number | null; routes: number | null; ivs: Intervention[] | null; searched: string[]; bundle: AreaBundle; index: NetIndex; mode: Mode; today: number; periodLabel(id: string): string; confirming: boolean;
  onRequest(): void; onCancel(): void; onConfirm(): void; onTrace?(): void;
}) {
  const cut = cutThroughHeadline(p.cutThrough, when, group.computed.seeds);
  const harm = harmHeadline(p.harm, when);
  const allRows = allTrafficRows(p, periodLabel);
  const allNote = allTrafficNote(allRows);
  const all = allTrafficHeadline(allRows);
  const openBtn = useRef<HTMLButtonElement>(null);
  const confirmBtn = useRef<HTMLButtonElement>(null);
  const wasConfirming = useRef(false);
  useEffect(() => {
    if (confirming) confirmBtn.current?.focus();
    else if (wasConfirming.current) openBtn.current?.focus();
    wasConfirming.current = confirming;
  }, [confirming]);
  const periods = Object.entries(p.byPeriod);
  const isRef = p.kind === 'reference';
  const calStatusText = calibrationStatusText(bundle.entry.calibration);
  const hasPic = !!p.picture && ivs !== null;
  const action = (
    confirming ? (
      <div className="prop-confirm" role="group" aria-label="Replace current scenario?">
        <p><strong>Replace current scenario?</strong> Your interventions on the map will be swapped for this package.</p>
        <button ref={confirmBtn} type="button" className="btn primary" onClick={onConfirm}>Replace and open</button>{' '}
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    ) : (
      <>
        <button ref={openBtn} type="button" className="btn primary" onClick={onRequest}>Open on the map<span className="sr-only">: {p.title}</span></button>{' '}
        <button type="button" className="btn" onClick={onCopyLink}>Copy link<span className="sr-only"> to {p.title}</span></button>{' '}
        {onTrace && <button type="button" className="btn" onClick={onTrace}>Where traffic goes<span className="sr-only">: {p.title}</span></button>}
      </>
    )
  );
  return (
    <li className="prop-card" aria-labelledby={hid}>
      <div className="prop-head">
        <AnchorHeading as="h4" id={hid} label={p.title}>{n !== null && <span className="prop-n">{n}. </span>}{p.title}</AnchorHeading>
        {isRef && <span className="tag">Earlier proposal</span>}
      </div>
      {isRef && p.note && <p className="muted prop-note">{p.note}</p>}
      <div className={hasPic ? 'prop-body has-pic' : 'prop-body'}>
        {hasPic && (
          <div className="prop-side">
            <ProposalPicture net={bundle.network} index={index} p={p} ivs={ivs ?? []} areaName={bundle.entry.name} areaId={bundle.entry.id} status={calStatusText} openUrl={shareUrl} periodLabel={periodLabel} searchedPeriods={searched} runs={group.computed.seeds} evidence={evidence} />
            {action}
          </div>
        )}
        <p className="prop-sum">{p.summary}</p>
        <div className="prop-main">
          <div className="prop-figs">
            <div className="fig">
              <p className="fig-main"><span className="fig-num">{cut.figure}</span> {cut.label}</p>
              <p className="fig-sub">{cut.detail}</p>
              <p className="fig-sub">{cut.interval}</p>
              <p className="fig-sub">{cut.definition}</p>
            </div>
            <div className="fig">
              <p className="fig-main">{harm.none ? harm.label : <><span className="fig-num">{harm.figure}</span> {harm.label}</>}</p>
              <p className="fig-sub">{harm.definition}</p>
            </div>
            <div className="fig fig-all">
              <p className="fig-main">{all.none ? all.label : <><span className="fig-num">{all.figure}</span> {all.label}</>}</p>
              {!all.none && <p className="fig-sub">{all.split} {all.interval}</p>}
              <p className="fig-sub">{all.attribution}</p>
            </div>
          </div>
          {routes !== null && <p className="prop-routes">Through routes: <strong>{routes}</strong> ({today} today)</p>}
          <h5 className="sr-only">Changes</h5>
          <ul className="prop-ivs">{p.interventions.map((iv, i) => <li key={i}>{iv.label}</li>)}</ul>
        </div>
      </div>
      <details className="prop-more">
        <summary>More detail</summary>
        <h5>Where these figures come from</h5>
        <p className="small">{evidenceNote(p, group)} {group.computed.simulator ? INTERVAL_SCOPE : ''}</p>
        {comparison && <p className="small">{comparisonText(comparison, comparisonLabel)}</p>}
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
        <h5>All traffic on side-street blocks (through and local trips together)</h5>
        <p className="muted small">
          Every car on one block, both directions, including the local trips of people who start or end a trip in the area. For each period, the block with the largest increase in all cars is named, and the block behind the search's ranking penalty is listed beside it because the two can differ: the penalty is the largest increase past an assumed noise band, which is a screening rule, not an uncertainty interval.
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
        <p className="muted small">The figures below are reported for information. They were not part of the search goal.</p>
        <h5>Bounding streets</h5>
        <p className="muted small">All cars on each street inside the area, change from today, average of the periods.</p>
        <table>
          <caption className="sr-only">Change in all cars and in mean speed on the bounding streets, for information</caption>
          <thead><tr><th scope="col">Street</th><th scope="col">All cars, change</th><th scope="col">Mean speed, change</th></tr></thead>
          <tbody>
            {p.context.boundingStreets.map((b) => (
              <tr key={b.name}><th scope="row">{b.name}</th><td>{signedPct(b.flowChangePct)}</td><td>{signedNum(b.speedChangeMph, 'mph')}</td></tr>
            ))}
          </tbody>
        </table>
        <h5>Inside the area</h5>
        <p className="muted small">Change from today, average of the periods.</p>
        <dl className="ctx">
          <div><dt>Trip time for trips starting or ending inside</dt><dd>{signedPct(p.context.insideTripTimeChangePct)}</dd></div>
          <div><dt>Walking conflicts</dt><dd>{signedPct(p.context.pedConflictsChangePct)}</dd></div>
          <div><dt>Biking conflicts</dt><dd>{signedPct(p.context.bikeConflictsChangePct)}</dd></div>
        </dl>
      </details>
      {!hasPic && action}
    </li>
  );
}
