import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { AreaBundle, Intervention } from '../types';
import { decodeScenario } from '../lib/hash';
import type { NetIndex } from '../lib/naming';
import { checkThroughRoutes, ROUTE_CAVEAT } from '../lib/throughroutes';
import { buildMockProposals } from '../fixtures/proposals';
import {
  allTrafficNote, allTrafficRows, beforeAfterPct, cutThroughHeadline, fetchProposals, formatComputed, harmHeadline, periodsPhrase, hashLoaded, linkHash, needsConfirm, openReducer,
  proposalNotices, proposalsUrl, signedNum, signedPct, splitProposals,
  type LoadedHashes, type Proposal, type ProposalGroup, type ProposalsState,
} from '../lib/proposals';

const mockParam = new URLSearchParams(location.search).get('mockProposals');

/** Fetched once, the first time the tab is open. A missing file is the normal "none yet" state. */
export function useProposals(bundle: AreaBundle, active: boolean): { state: ProposalsState; loaded: LoadedHashes } {
  const [state, setState] = useState<ProposalsState>({ status: 'idle' });
  const [loaded, setLoaded] = useState<LoadedHashes>({ network: null, demand: null });
  const started = useRef(false);
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    setState({ status: 'loading' });
    (async () => {
      const hashes = await hashLoaded(bundle.raw);
      setLoaded(hashes);
      if (mockParam) {
        const file = buildMockProposals(bundle.network, {
          networkHash: hashes.network ?? 'unknown', demandHash: hashes.demand ?? 'unknown',
          calibration: bundle.entry.calibration?.status ?? 'uncalibrated',
        }, mockParam === 'stale' ? 'stale' : 'fresh');
        setState({ status: 'ready', file });
        return;
      }
      const file = bundle.synthetic ? null : await fetchProposals(proposalsUrl(bundle.entry));
      setState(file ? { status: 'ready', file } : { status: 'none' });
    })();
  }, [active, bundle]);
  return { state, loaded };
}

interface Props {
  bundle: AreaBundle; index: NetIndex; today: number; state: ProposalsState; loaded: LoadedHashes;
  current: Intervention[];
  onOpen(p: Proposal): void;
}

export function Proposals({ bundle, index, today, state, loaded, current, onOpen }: Props) {
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
  const routeCounts = useMemo(() => {
    const m = new Map<string, number>();
    if (ready) for (const g of ready.groups) for (const p of g.proposals) {
      try { m.set(`${g.id}-${p.id}`, checkThroughRoutes(bundle.network, index, decodeScenario(bundle.network, linkHash(p.link)).interventions).total); } catch { /* left out */ }
    }
    return m;
  }, [ready, bundle.network, index]);
  const card = (g: ProposalGroup, p: Proposal, n: number | null) => (
    <Card key={p.id} p={p} when={periodsPhrase(g.computed.periods, periodLabel)} hid={`prop-${gid(g, p)}`} n={n} routes={routeCounts.get(gid(g, p)) ?? null} today={today} periodLabel={periodLabel} confirming={open.step === 'confirm' && open.id === gid(g, p)}
      onRequest={() => request(g, p)} onCancel={() => dispatch({ type: 'cancel' })} onConfirm={() => { dispatch({ type: 'done' }); onOpen(p); }} />
  );

  return (
    <div className="proposals-view">
      <h2>Proposals</h2>
      <p className="lead">
        These are packages of changes found by searching the simulation for the most through traffic removed from the area's
        side streets with the least traffic added to any one of them. The cards compare through cars with through cars:
        the first figure is all the side streets together, the second is the one block that gains the most. The search
        itself penalizes the largest rise in all traffic (through cars and local trips together) on any one block,
        because residents experience all the cars on their street. Those all-traffic changes are in More detail on each card,
        counted only when they exceed normal variation between runs.
      </p>
      {state.status === 'ready' && <p className="muted small">Through routes: {ROUTE_CAVEAT}</p>}
      {state.status === 'idle' || state.status === 'loading' ? <p role="status" className="muted">Loading proposals…</p> : null}
      {state.status === 'none' && (
        <div className="empty" role="status">
          <p><strong>No proposals have been computed for {bundle.entry.name} yet.</strong></p>
          <p className="muted">Until then, you can try interventions yourself on the Map.</p>
        </div>
      )}
      {ready && ready.groups.length === 0 && <p className="muted" role="status">This file holds no options.</p>}
      {ready && ready.groups.map((g) => {
        const notices = proposalNotices(g.computed, loaded);
        const parts = splitProposals(g);
        const hid = `prop-g-${g.id}`;
        return (
          <section key={g.id} aria-labelledby={`${hid}-h`} className="prop-group">
            <h3 id={`${hid}-h`} className="prop-group-h">{g.title}</h3>
            {g.note && <p className="prop-group-note">{g.note}</p>}
            <div className="prop-status">
              <p className="muted">{formatComputed(g.computed, periodLabel)}</p>
              {notices.exploratory && (
                <p className="notice" role="note">
                  <strong>Exploratory.</strong> The baseline these were computed on is not calibrated against observed traffic yet, so read the figures as relative comparisons, not forecasts.
                </p>
              )}
              {notices.stale && <p className="notice err" role="note"><strong>Out of date.</strong> {notices.staleText}</p>}
            </div>
            {parts.search.length > 0 && (
              <ol className="prop-list" aria-label={`${g.title}: options, from fewest changes to greatest reduction`}>
                {parts.search.map((p, i) => card(g, p, i + 1))}
              </ol>
            )}
            {parts.reference.length > 0 && (
              <section aria-labelledby={`${hid}-ref`} className="prop-ref">
                <h4 id={`${hid}-ref`} className="sec-h">For comparison</h4>
                <ol className="prop-list">{parts.reference.map((p) => card(g, p, null))}</ol>
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

function Card({ p, when, hid, n, routes, today, periodLabel, confirming, onRequest, onCancel, onConfirm }: {
  p: Proposal; when: string; hid: string; n: number | null; routes: number | null; today: number; periodLabel(id: string): string; confirming: boolean;
  onRequest(): void; onCancel(): void; onConfirm(): void;
}) {
  const cut = cutThroughHeadline(p.cutThrough, when);
  const harm = harmHeadline(p.harm, when);
  const allRows = allTrafficRows(p, periodLabel);
  const allNote = allTrafficNote(allRows);
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
  return (
    <li className="prop-card" aria-labelledby={`${hid}-h`}>
      <div className="prop-head">
        <h4 id={`${hid}-h`}>{n !== null && <span className="prop-n">{n}. </span>}{p.title}</h4>
        {isRef && <span className="tag">Earlier proposal</span>}
      </div>
      {isRef && p.note && <p className="muted prop-note">{p.note}</p>}
      <p className="prop-sum">{p.summary}</p>
      <div className="prop-figs">
        <div className="fig">
          <p className="fig-main"><span className="fig-num">{cut.figure}</span> {cut.label}</p>
          <p className="fig-sub">{cut.detail}</p>
          <p className="fig-sub">{cut.definition}</p>
        </div>
        <div className="fig">
          <p className="fig-main">{harm.none ? harm.label : <><span className="fig-num">{harm.figure}</span> {harm.label}</>}</p>
          <p className="fig-sub">{harm.definition}</p>
        </div>
      </div>
      {routes !== null && <p className="prop-routes">Through routes: <strong>{routes}</strong> ({today} today)</p>}
      <h5 className="sr-only">Changes</h5>
      <ul className="prop-ivs">{p.interventions.map((iv, i) => <li key={i}>{iv.label}</li>)}</ul>
      <details className="prop-more">
        <summary>More detail</summary>
        <h5>Through cars an hour, by period</h5>
        <p className="muted small">Through cars on all the area's side streets together: before → after today's streets, with the change in parentheses.</p>
        <div className="table-scroll" role="region" aria-label="Through cars by period, scrollable" tabIndex={0}>
          <table>
            <caption className="sr-only">Through cars an hour on the area's side streets, by period</caption>
            <thead><tr><th scope="col">Period</th><th scope="col">Through cars an hour, before → after (change)</th></tr></thead>
            <tbody>
              {periods.map(([id, v]) => (
                <tr key={id}><th scope="row">{periodLabel(id)}</th><td>{beforeAfterPct(v.cutThrough)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <h5>All traffic on side-street blocks (through and local trips together)</h5>
        <p className="muted small">
          Every car on one block, both directions, including the local trips of people who start or end a trip in the area. For each period, the block that gains the most is named. This is the kind of change the search penalizes.
        </p>
        <div className="table-scroll" role="region" aria-label="All traffic on side-street blocks by period, scrollable" tabIndex={0}>
          <table>
            <caption className="sr-only">All cars an hour on the side-street block that gains the most, by period, split into through cars and local trips</caption>
            <thead>
              <tr>
                <th scope="col">Period</th><th scope="col">Block that gains the most all traffic</th><th scope="col">All cars an hour, before → after</th>
                <th scope="col">Of the change: through cars</th><th scope="col">Of the change: local trips</th><th scope="col">Blocks gaining all traffic beyond run-to-run variation</th>
              </tr>
            </thead>
            <tbody>
              {allRows.map((r) => (
                <tr key={r.period}>
                  <th scope="row">{r.period}</th>
                  {r.block === null
                    ? <><td>None beyond run-to-run variation</td><td>—</td><td>—</td><td>—</td></>
                    : <><td>{r.block}</td><td>{Math.round(r.before)} → {Math.round(r.after)} ({signedNum(r.change, 'cars an hour', 0)})</td><td>{signedNum(r.through, 'cars an hour', 0)}</td><td>{signedNum(r.local, 'cars an hour', 0)}</td></>}
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
      {confirming ? (
        <div className="prop-confirm" role="group" aria-label="Replace current scenario?">
          <p><strong>Replace current scenario?</strong> Your interventions on the map will be swapped for this package.</p>
          <button ref={confirmBtn} type="button" className="btn primary" onClick={onConfirm}>Replace and open</button>{' '}
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        </div>
      ) : (
        <button ref={openBtn} type="button" className="btn primary" onClick={onRequest}>Open on the map<span className="sr-only">: {p.title}</span></button>
      )}
    </li>
  );
}
