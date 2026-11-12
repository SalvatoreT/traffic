import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { AreaBundle, Intervention } from '../types';
import { decodeScenario } from '../lib/hash';
import { buildMockProposals } from '../fixtures/proposals';
import {
  cutThroughHeadline, fetchProposals, formatComputed, harmHeadline, hashLoaded, linkHash, needsConfirm, openReducer,
  proposalNotices, proposalsUrl, signedNum, signedPct, splitProposals,
  type LoadedHashes, type Proposal, type ProposalsState,
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
  bundle: AreaBundle; state: ProposalsState; loaded: LoadedHashes;
  current: Intervention[];
  onOpen(p: Proposal): void;
}

export function Proposals({ bundle, state, loaded, current, onOpen }: Props) {
  const periodLabel = useMemo(() => {
    const m = new Map(bundle.demand.periods.map((p) => [p.id, p.label]));
    return (id: string) => m.get(id) ?? id;
  }, [bundle.demand.periods]);
  const [open, dispatch] = useReducer(openReducer, { step: 'idle' });

  const ready = state.status === 'ready' ? state.file : null;
  const notices = ready ? proposalNotices(ready.computed, loaded) : null;
  const parts = ready ? splitProposals(ready) : null;

  const request = (p: Proposal) => {
    const next = decodeScenario(bundle.network, linkHash(p.link)).interventions;
    if (needsConfirm(current, next)) dispatch({ type: 'ask', id: p.id });
    else { dispatch({ type: 'done' }); onOpen(p); }
  };
  const card = (p: Proposal, n: number | null) => (
    <Card key={p.id} p={p} n={n} periodLabel={periodLabel} confirming={open.step === 'confirm' && open.id === p.id}
      onRequest={() => request(p)} onCancel={() => dispatch({ type: 'cancel' })} onConfirm={() => { dispatch({ type: 'done' }); onOpen(p); }} />
  );

  return (
    <div className="proposals-view">
      <h2>Proposals</h2>
      <p className="lead">
        These are packages of changes found by searching the simulation for the most cut-through traffic removed with the
        least traffic added to any one street inside the area. Harm means more traffic on any single residential or
        service block inside the area, counted only when it exceeds normal variation between runs.
      </p>
      {state.status === 'idle' || state.status === 'loading' ? <p role="status" className="muted">Loading proposals…</p> : null}
      {state.status === 'none' && (
        <div className="empty" role="status">
          <p><strong>No proposals have been computed for {bundle.entry.name} yet.</strong></p>
          <p className="muted">Until then, you can try interventions yourself on the Map.</p>
        </div>
      )}
      {ready && notices && (
        <div className="prop-status">
          <p className="muted">{formatComputed(ready.computed, periodLabel)}</p>
          {notices.exploratory && (
            <p className="notice" role="note">
              <strong>Exploratory.</strong> The baseline these were computed on is not calibrated against observed traffic yet, so read the figures as relative comparisons, not forecasts.
            </p>
          )}
          {notices.stale && <p className="notice err" role="note"><strong>Out of date.</strong> {notices.staleText}</p>}
        </div>
      )}
      {parts && (
        <>
          {parts.search.length > 0 && (
            <ol className="prop-list" aria-label="Options, from fewest changes to greatest reduction">
              {parts.search.map((p, i) => card(p, i + 1))}
            </ol>
          )}
          {parts.reference.length > 0 && (
            <section aria-labelledby="prop-ref-h" className="prop-ref">
              <h3 id="prop-ref-h" className="sec-h">For comparison</h3>
              {parts.search.length === 0 && <p className="muted">The search has not been run yet.</p>}
              <ol className="prop-list">{parts.reference.map((p) => card(p, null))}</ol>
            </section>
          )}
          {parts.search.length === 0 && parts.reference.length === 0 && (
            <p className="muted" role="status">This file holds no options.</p>
          )}
        </>
      )}
    </div>
  );
}

function Card({ p, n, periodLabel, confirming, onRequest, onCancel, onConfirm }: {
  p: Proposal; n: number | null; periodLabel(id: string): string; confirming: boolean;
  onRequest(): void; onCancel(): void; onConfirm(): void;
}) {
  const cut = cutThroughHeadline(p.cutThrough);
  const harm = harmHeadline(p.harm);
  const openBtn = useRef<HTMLButtonElement>(null);
  const confirmBtn = useRef<HTMLButtonElement>(null);
  const wasConfirming = useRef(false);
  useEffect(() => {
    if (confirming) confirmBtn.current?.focus();
    else if (wasConfirming.current) openBtn.current?.focus();
    wasConfirming.current = confirming;
  }, [confirming]);
  const hid = `prop-${p.id}`;
  const periods = Object.entries(p.byPeriod);
  const isRef = p.kind === 'reference';
  return (
    <li className="prop-card" aria-labelledby={`${hid}-h`}>
      <div className="prop-head">
        <h3 id={`${hid}-h`}>{n !== null && <span className="prop-n">{n}. </span>}{p.title}</h3>
        {isRef && <span className="tag">Earlier proposal</span>}
      </div>
      {isRef && p.note && <p className="muted prop-note">{p.note}</p>}
      <p className="prop-sum">{p.summary}</p>
      <div className="prop-figs">
        <div className="fig">
          <p className="fig-main"><span className="fig-num">{cut.figure}</span> {cut.label}</p>
          <p className="fig-sub">{cut.detail}</p>
        </div>
        <div className="fig">
          <p className="fig-main"><span className="fig-num">{harm.none ? '' : harm.figure}</span>{harm.none ? harm.label : ` ${harm.label}`}</p>
          <p className="fig-sub">{harm.none ? 'Worst side effect' : <>Worst side effect{harm.blocks && <>. {harm.blocks}.</>}</>}</p>
        </div>
      </div>
      <h4 className="sr-only">Changes</h4>
      <ul className="prop-ivs">{p.interventions.map((iv, i) => <li key={i}>{iv.label}</li>)}</ul>
      <details className="prop-more">
        <summary>More detail</summary>
        <p className="muted small">Reported for information. These figures were not part of the search goal.</p>
        <table>
          <caption className="sr-only">Cut-through and worst increase by period</caption>
          <thead><tr><th scope="col">Period</th><th scope="col">Cut-through change</th><th scope="col">Worst increase on one block</th></tr></thead>
          <tbody>
            {periods.map(([id, v]) => (
              <tr key={id}><th scope="row">{periodLabel(id)}</th><td>{signedPct(v.cutThroughChangePct)}</td><td>{signedNum(v.worstIncreaseVehPerHour, 'veh/h', 0)}</td></tr>
            ))}
          </tbody>
        </table>
        <h4>Bounding streets</h4>
        <table>
          <caption className="sr-only">Change on the bounding streets, for information</caption>
          <thead><tr><th scope="col">Street</th><th scope="col">Traffic</th><th scope="col">Speed</th></tr></thead>
          <tbody>
            {p.context.boundingStreets.map((b) => (
              <tr key={b.name}><th scope="row">{b.name}</th><td>{signedPct(b.flowChangePct)}</td><td>{signedNum(b.speedChangeMph, 'mph')}</td></tr>
            ))}
          </tbody>
        </table>
        <h4>Inside the area</h4>
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
