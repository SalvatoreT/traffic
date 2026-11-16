import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { AreaBundle, Intervention } from '../types';
import { directedLabel, type NetIndex } from '../lib/naming';
import { describeIntervention } from '../lib/describe';
import { encodeScenario } from '../lib/hash';
import type { LoadedHashes } from '../lib/proposals';
import { checkStored, COMPARISONS, OUTCOMES, type Comparison, type GraphQuery, type RedistributionResult } from '../lib/redistribution';
import { canTrace, cohortRoutes, effectStatus, isFar, LAYER_LABEL, linksD, mapFrame, MAP_MAX, midpoint, netBlocks, possiblePaths, ROLE_LABEL, round, signed, type Layer } from '../lib/redistribution-view';
import type { RedistFromWorker, RedistToWorker } from '../sim/redistribution.worker';
import { blockMeasured } from '../lib/scope';

/** What the view is asked to explain: one closure inside a package (the package may be the closure alone). */
export interface RedistRequest { package: Intervention[]; closure: number; source: 'scenario' | 'proposal'; title: string }

interface Props {
  bundle: AreaBundle; index: NetIndex; period: string; periodLabel: string; demandScale: number;
  hashes: LoadedHashes | null; fingerprint: string | null | undefined;
  request: RedistRequest; onClose(): void;
}

const OUTCOME_LABEL: Record<(typeof OUTCOMES)[number], string> = {
  completed: 'Finished the trip', active: 'Still driving at the end of the hour', pending: 'Still waiting to start', unroutable: 'Found no route',
  removed: 'Removed to clear gridlock', unmatched: 'Not requested in this run', mismatched: 'Requested with other attributes',
};

export function Redistribution({ bundle, index, period, periodLabel, demandScale, hashes, fingerprint, request, onClose }: Props) {
  const id = useId();
  const dlg = useRef<HTMLDialogElement>(null);
  const net = bundle.network;
  const choices = request.package.map((iv, i) => ({ i, iv })).filter((x) => canTrace(x.iv));
  const [pick, setPick] = useState(request.closure);
  const closure = request.package[pick];
  const [graph, setGraph] = useState<{ closure: GraphQuery; package: GraphQuery } | null>(null);
  const [result, setResult] = useState<RedistributionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number; label: string } | null>(null);
  const [cmp, setCmp] = useState<Comparison>(request.package.length > 1 ? 'package' : 'closure');
  const [layers, setLayers] = useState<Record<Layer, boolean>>({ possible: true, cohort: true, net: true });
  const [seeds, setSeeds] = useState(1);
  const [stored, setStored] = useState<{ used: boolean; reason: string | null } | null>(null);
  const worker = useRef<Worker | null>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const d = dlg.current;
    if (d && !d.open) d.showModal();
    return () => { worker.current?.terminate(); worker.current = null; opener?.focus(); };
  }, []);
  const simNetwork = bundle.raw?.simNetwork ?? bundle.raw?.network ?? JSON.stringify(net);
  const demandText = bundle.raw?.demand ?? JSON.stringify(bundle.demand);
  const fresh = () => {
    worker.current?.terminate();
    const w = new Worker(new URL('../sim/redistribution.worker.ts', import.meta.url), { type: 'module' });
    w.onmessage = (ev: MessageEvent<RedistFromWorker>) => {
      const m = ev.data;
      if (m.t === 'graph') setGraph({ closure: m.closure, package: m.package });
      else if (m.t === 'progress') setProgress(m);
      else if (m.t === 'result') { setResult(m.result); setProgress(null); }
      else setError(m.message);
    };
    w.onerror = (e) => setError(`The diagnostic failed: ${e.message}`);
    worker.current = w;
    return w;
  };
  useEffect(() => {
    setGraph(null); setResult(null); setError(null); setProgress(null); setStored(null);
    if (!closure) return;
    fresh().postMessage({ t: 'graph', simNetwork, period, closure: [closure], package: request.package } satisfies RedistToWorker);
    // A diagnostic computed beforehand (`simulate --redistribution --out`) is used only when it was made on these inputs and this simulator.
    let live = true;
    void fetch(`/data/${bundle.entry.id}.redistribution.json`).then((r) => (r.ok && (r.headers.get('content-type') ?? '').includes('json') ? r.json() : null)).then((x: unknown) => {
      if (!live || !x) return;
      const want = { network: hashes?.network ?? null, demand: hashes?.demand ?? null, simulator: fingerprint ?? null, period, closure: [closure], package: request.package };
      let reason: string | null = null;
      for (const c of Array.isArray(x) ? x : [x]) {
        const v = checkStored(c, want);
        if (v.ok) { setResult(v.result); setStored({ used: true, reason: null }); return; }
        reason ??= v.reason;
      }
      setStored({ used: false, reason });
    }).catch(() => { /* none stored */ });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pick, period]);

  const link = (ivs: Intervention[]) => encodeScenario(net, ivs, { area: bundle.entry.id, period, demandScale });
  const run = () => {
    if (!closure) return;
    setError(null); setResult(null); setProgress({ done: 0, total: seeds * 3, label: 'starting' });
    const seconds = 3600;
    const seedList = Array.from({ length: seeds }, (_, k) => k + 1);
    const cal = bundle.entry.calibration;
    fresh().postMessage({
      t: 'run', simNetwork, demand: demandText, net, period, demandScale, seeds: seedList, seconds, closure: [closure], package: request.package,
      calibration: { status: cal?.status ?? 'uncalibrated', note: cal?.note ?? '' },
      identity: {
        area: bundle.entry.id, period, seeds: seedList, seconds, demandScale, initialLoad: true, mode: 'car',
        window: { fromS: 0, toS: seconds, counting: 'link exits at or after time zero and before the end of the run, after initial loading and its settle interval' },
        hashes: { network: (hashes?.network ?? '').slice(0, 16), demand: (hashes?.demand ?? '').slice(0, 16), simulator: fingerprint ?? '' },
        scenarios: [{ role: 'baseline', link: link([]), interventions: [] }, { role: 'closure', link: link([closure]), interventions: [closure] }, { role: 'package', link: link(request.package), interventions: request.package }],
        closureItem: link([closure]).split('s=')[1] ?? '', selector: 'direct', localRadiusM: 400, traceDetailMax: null,
      },
    } satisfies RedistToWorker);
  };
  const cancel = () => { worker.current?.terminate(); worker.current = null; setProgress(null); };


  const paths = useMemo(() => {
    if (!graph) return null;
    const mv = (a: number, b: number) => `${directedLabel(net, index, a)}, then ${directedLabel(net, index, b)}`;
    return { closure: possiblePaths(net, graph.closure, mv), package: possiblePaths(net, graph.package, mv) };
  }, [graph, net, index]);
  const shownPaths = paths ? (cmp === 'closure' ? paths.closure : paths.package).items.slice(0, MAP_MAX) : [];
  const routes = result ? cohortRoutes(result, cmp).filter((r) => r.counts[cmp] > 0 && !isFar(r) && r.sample?.length) : [];
  const shownRoutes = routes.slice(0, MAP_MAX);
  const frame = useMemo(() => (graph && graph.closure.nodes.length ? mapFrame(net, graph.closure.nodes) : null), [graph, net]);
  const blocks = result ? netBlocks(result, cmp) : [];
  // Labels only on the largest changes so they stay legible; every block is in the table.
  const nearClosure = (b: (typeof blocks)[number]) => !!frame && (graph?.closure.nodes ?? []).some((n) => {
    const [x, y] = midpoint(net, b.links, frame);
    return Math.hypot(x - (net.nodes[n].x - frame.minX), y - (frame.maxY - net.nodes[n].y)) < 90;
  });
  const labeled = new Set([...blocks].filter((b) => !nearClosure(b)).sort((a, b) => Math.abs(b.change[cmp].all.mean) - Math.abs(a.change[cmp].all.mean)).slice(0, 6).map((b) => b.key));
  const nSeeds = result?.identity.seeds.length ?? 0;
  const title = closure ? describeIntervention(closure, net, index) : 'this change';
  const multi = request.package.length > 1;
  const capId = `${id}-cap`;
  const toggle = (k: Layer) => setLayers((x) => ({ ...x, [k]: !x[k] }));

  const mapText = [
    layers.possible ? `${shownPaths.length} possible path${shownPaths.length === 1 ? '' : 's'} drawn dashed and labeled P1 to P${shownPaths.length}` : null,
    layers.cohort && result ? `${shownRoutes.length} simulated cohort route${shownRoutes.length === 1 ? '' : 's'} drawn solid with arrows and labeled R1 to R${shownRoutes.length}` : null,
    layers.net && result ? `net all-car change on ${blocks.length} block${blocks.length === 1 ? '' : 's'}, line width growing with the change, the ${labeled.size} largest labeled with signed cars an hour and an up or down triangle` : null,
  ].filter(Boolean).join('; ');

  return (
    <dialog ref={dlg} className="redist" aria-labelledby={`${id}-h`} onCancel={(e) => { e.preventDefault(); onClose(); }}>
      <div className="redist-head">
        <h2 id={`${id}-h`}>Where traffic goes</h2>
        <button type="button" className="btn" onClick={onClose}>Close<span className="sr-only"> where traffic goes</span></button>
      </div>
      <p className="redist-scope">
        <strong>{title}</strong>{multi ? <>, inside {request.title} ({request.package.length} changes)</> : null}. {periodLabel}, one simulated hour after the network is loaded.
      </p>
      <p className="notice small" role="note">
        This model is not calibrated against observed traffic. Three kinds of evidence are kept apart here: possible paths are legal routes and carry no traffic; simulated cohort routes are what the trips that used the closed movements today drove in the model; net change counts every car on a block, through trips and local trips together.
      </p>
      {choices.length > 1 && (
        <label className="redist-pick">
          <span>Closure to follow</span>
          <select value={pick} onChange={(e) => setPick(Number(e.target.value))}>
            {choices.map((c) => <option key={c.i} value={c.i}>{describeIntervention(c.iv, net, index)}</option>)}
          </select>
        </label>
      )}
      {multi && (
        <fieldset className="seg redist-cmp">
          <legend>Compare today with</legend>
          {COMPARISONS.map((c) => (
            <label key={c}><input type="radio" name={`${id}-cmp`} checked={cmp === c} onChange={() => setCmp(c)} /> {ROLE_LABEL[c]}</label>
          ))}
        </fieldset>
      )}
      {error && <p className="notice err" role="alert">{error}</p>}

      <section aria-labelledby={`${id}-map`} className="redist-map-sec">
        <h3 id={`${id}-map`}>Map</h3>
        <fieldset className="redist-layers">
          <legend className="sr-only">Layers</legend>
          {(Object.keys(LAYER_LABEL) as Layer[]).map((k) => (
            <label key={k}><input type="checkbox" checked={layers[k]} onChange={() => toggle(k)} /> <LayerSwatch k={k} /> {LAYER_LABEL[k]}</label>
          ))}
        </fieldset>
        {!frame ? <p className="muted" role="status">{graph ? 'This change removes no car movement, so nothing is displaced.' : 'Finding legal paths…'}</p> : (
          <figure className="redist-fig">
            <svg viewBox={`0 0 ${frame.w} ${frame.h}`} role="img" aria-labelledby={capId} className="redist-svg">
              <defs>
                <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" className="redist-arrow" /></marker>
              </defs>
              {frame.links.map((l) => <path key={l.id} d={l.d} className={l.major ? 'redist-st major' : 'redist-st'} />)}
              {layers.net && result && blocks.map((b) => {
                const d = b.change[cmp].all.mean;
                const [x, y] = midpoint(net, b.links, frame);
                return (
                  <g key={b.key} className={d > 0 ? 'redist-net up' : 'redist-net down'}>
                    <path d={linksD(net, [b.links[0]], frame)} style={{ strokeWidth: Math.min(10, 2 + Math.abs(d) / 25) }} />
                    {labeled.has(b.key) && <text x={x} y={y - 8} className="redist-lbl">{d > 0 ? '▲' : '▼'}{signed(d)}</text>}
                  </g>
                );
              })}
              {layers.possible && shownPaths.map((p, i) => {
                const [x, y] = midpoint(net, p.links, frame);
                return (
                  <g key={p.id} className="redist-possible">
                    <path d={linksD(net, p.links, frame, -6 - 4 * i)} />
                    <text x={x - 14} y={y + 18 + 14 * i} className="redist-lbl">P{i + 1}</text>
                  </g>
                );
              })}
              {layers.cohort && shownRoutes.map((r, i) => {
                const [x, y] = midpoint(net, r.sample!, frame);
                return (
                  <g key={r.key} className="redist-route">
                    <path d={linksD(net, r.sample!, frame, 6 + 4 * i)} markerEnd={`url(#${id}-arrow)`} />
                    <text x={x + 10} y={y - 18 - 14 * i} className="redist-lbl">R{i + 1}</text>
                  </g>
                );
              })}
              {graph!.closure.nodes.map((n) => {
                const x = net.nodes[n].x - frame.minX, y = frame.maxY - net.nodes[n].y;
                return <g key={n} className="redist-closure"><rect x={x - 9} y={y - 9} width="18" height="18" /><text x={x - 14} y={y - 16} textAnchor="end" className="redist-lbl">Closure</text></g>;
              })}
            </svg>
            <figcaption id={capId} className="small muted">
              About 900 m across, centered on the closure; north is up. {mapText || 'No layer is shown.'} The tables below hold the same evidence, including paths and blocks outside this square.
            </figcaption>
          </figure>
        )}
      </section>

      <section aria-labelledby={`${id}-pp`}>
        <h3 id={`${id}-pp`}><LayerSwatch k="possible" /> {LAYER_LABEL.possible} <span className="muted small">(legal, no traffic)</span></h3>
        {!paths ? <p className="muted" role="status">Finding legal paths…</p> : (
          <>
            <p className="small muted">
              Legal routes around the closed movements on the simulator's own turn rules for {periodLabel}, cars only. The search is exhaustive; up to three paths per movement are listed. A path says a driver could go that way, not that anyone does.
            </p>
            <PathTable paths={(cmp === 'closure' ? paths.closure : paths.package).items} cap={(cmp === 'closure' ? paths.closure : paths.package).capped} />
            {(cmp === 'closure' ? paths.closure : paths.package).disconnected.length > 0 && <p className="small">No legal path remains for: {(cmp === 'closure' ? paths.closure : paths.package).disconnected.join('; ')}.</p>}
          </>
        )}
      </section>

      <section aria-labelledby={`${id}-cr`}>
        <h3 id={`${id}-cr`}><LayerSwatch k="cohort" /> {LAYER_LABEL.cohort}</h3>
        {!result && !progress && (
          <div className="redist-run">
            <p className="small">
              Not computed yet: no route has been attributed, which is not the same as no diversion. Running it simulates today, the closure alone and the whole package with every trip recorded, in your browser.
            </p>
            <label className="redist-seeds">Runs <select value={seeds} onChange={(e) => setSeeds(Number(e.target.value))}>{[1, 3, 10].map((n) => <option key={n} value={n}>{n} (about {n * 3} simulated hours)</option>)}</select></label>
            <button type="button" className="btn primary" onClick={run} disabled={!closure}>Run the comparison</button>
            <p className="small muted">One or three runs describe; ten are needed before an interval can say whether a change is more than run-to-run variation.</p>
          </div>
        )}
        {progress && (
          <div className="redist-run">
            <p role="status" aria-live="polite">Simulating: {progress.done} of {progress.total} runs done ({progress.label}).</p>
            <progress max={progress.total} value={progress.done} aria-label="Runs done" />
            <button type="button" className="btn" onClick={cancel}>Cancel</button>
          </div>
        )}
        {stored?.used && result && <p className="small muted">Computed beforehand on the same network, demand and simulator, {result.identity.seeds.length} run{result.identity.seeds.length === 1 ? '' : 's'}.</p>}
        {stored && !stored.used && stored.reason && !result && <p className="small muted">A stored diagnostic was not used: {stored.reason}.</p>}
        {result && <CohortTables r={result} cmp={cmp} routes={cohortRoutes(result, cmp)} drawn={shownRoutes.map((r) => r.key)} />}
      </section>

      <section aria-labelledby={`${id}-nc`}>
        <h3 id={`${id}-nc`}><LayerSwatch k="net" /> {LAYER_LABEL.net}</h3>
        {!result ? <p className="small muted">Shown after the comparison has run.</p> : <BlockTable r={result} cmp={cmp} nSeeds={nSeeds} />}
      </section>
      {result && (
        <section aria-labelledby={`${id}-ev`} className="small">
          <h3 id={`${id}-ev`}>About these runs</h3>
          <ul>
            {result.notes.map((n) => <li key={n}>{n}</li>)}
            <li>Seeds {result.identity.seeds.join(', ')}; simulator {result.identity.hashes.simulator || 'unknown'}; network {result.identity.hashes.network || 'unknown'}, demand {result.identity.hashes.demand || 'unknown'}.</li>
            <li>Cars cleared from gridlock per run: today {result.health.baseline.map((h) => h.gridlockRemoved).join(', ')}; closure {result.health.closure.map((h) => h.gridlockRemoved).join(', ')}; package {result.health.package.map((h) => h.gridlockRemoved).join(', ')}.</li>
            <li>Route detail kept for {result.coverage.baseline.map((c) => `${c.requestsWithDetail} of ${c.requests}`).join(', ')} trips today.</li>
          </ul>
        </section>
      )}
    </dialog>
  );
}

function LayerSwatch({ k }: { k: Layer }) {
  return (
    <svg width="34" height="12" aria-hidden="true" className={`redist-sw sw-${k}`} focusable="false">
      {k === 'possible' && <line x1="1" y1="6" x2="33" y2="6" />}
      {k === 'cohort' && <><line x1="1" y1="6" x2="27" y2="6" /><path d="M26 1 L33 6 L26 11 z" /></>}
      {k === 'net' && <><line x1="1" y1="6" x2="22" y2="6" /><text x="24" y="10">▲</text></>}
    </svg>
  );
}

const FIRST_ROWS = 6;
function PathTable({ paths, cap }: { paths: ReturnType<typeof possiblePaths>['items']; cap: boolean }) {
  if (!paths.length) return <p className="small">No legal path was found around these movements. The search covered the whole network.</p>;
  const table = (rows: typeof paths, from: number, label: string) => (
    <div className="table-scroll" role="region" aria-label={`${label}, scrollable`} tabIndex={0}>
      <table>
        <caption className="sr-only">{label}: legal routes around the closed movements, with the free-flow time they add. No traffic volumes.</caption>
        <thead><tr><th scope="col">Path</th><th scope="col">Streets</th><th scope="col">Instead of the closed movement</th><th scope="col">Extra time at free flow</th></tr></thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={p.id}><th scope="row">P{from + i + 1}</th><td>{p.streets}</td><td>{p.movement}</td><td>{p.extraS === null ? '—' : `${signed(p.extraS)} s`}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return (
    <>
      {table(paths.slice(0, FIRST_ROWS), 0, 'Possible paths')}
      {paths.length > FIRST_ROWS && <details><summary>All {paths.length} possible paths</summary>{table(paths.slice(FIRST_ROWS), FIRST_ROWS, 'More possible paths')}</details>}
      {cap && <p className="small muted">More paths exist than are listed; the list is capped, so a missing street here is not proof that it is unreachable.</p>}
    </>
  );
}

function CohortTables({ r, cmp, routes, drawn }: { r: RedistributionResult; cmp: Comparison; routes: RedistributionResult['cohort']['routes']; drawn: string[] }) {
  const n = r.identity.seeds.length;
  const out = r.cohort.outcomes[cmp];
  const ch = r.cohort.routeChanged[cmp];
  const routeTable = (rows: typeof routes, label: string) => (
    <div className="table-scroll" role="region" aria-label={`${label}, scrollable`} tabIndex={0}>
      <table>
        <caption className="sr-only">{label}: how many of the followed trips drove each route near the closure, today and with the change, summed over the runs</caption>
        <thead><tr><th scope="col">Route near the closure</th><th scope="col">{ROLE_LABEL.baseline}</th><th scope="col">{ROLE_LABEL.closure}</th><th scope="col">{ROLE_LABEL.package}</th><th scope="col">Unfinished at the end of the hour ({ROLE_LABEL[cmp].toLowerCase()})</th></tr></thead>
        <tbody>
          {rows.map((x) => {
            const k = drawn.indexOf(x.key);
            return (
              <tr key={x.key}>
                <th scope="row">{k >= 0 ? <span className="tag">R{k + 1}</span> : null} {x.key}</th>
                <td>{x.counts.baseline}</td><td>{x.counts.closure}</td><td>{x.counts.package}</td><td>{x.partial[cmp]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  return (
    <>
      <p className="small">
        {r.cohort.total} trip{r.cohort.total === 1 ? '' : 's'} over {n} run{n === 1 ? '' : 's'} drove a movement this closure removes, today, during the hour ({(r.cohort.total / n).toFixed(n === 1 ? 0 : 1)} a run). The same requested trips are followed in the {ROLE_LABEL[cmp].toLowerCase()} run{n === 1 ? '' : 's'}: {ch.changed} took another route near the closure, {ch.same} the same, and {ch.unknown} cannot be told. {r.cohort.initialTraversals} more were already on the streets when the run started and are not followed.
      </p>
      {routeTable(routes.slice(0, 10), 'Simulated cohort routes')}
      {routes.length > 10 && <details><summary>All {routes.length} routes</summary>{routeTable(routes.slice(10), 'More simulated cohort routes')}</details>}
      <h4>Where the followed trips stand at the end of the hour ({ROLE_LABEL[cmp].toLowerCase()})</h4>
      <ul className="small redist-out">
        {OUTCOMES.map((o) => <li key={o}>{OUTCOME_LABEL[o]}: {out[o]}</li>)}
      </ul>
    </>
  );
}

function BlockTable({ r, cmp, nSeeds }: { r: RedistributionResult; cmp: Comparison; nSeeds: number }) {
  return (
    <>
      <p className="small muted">
        Blocks inside the study area only. Every car on the block in the hour, both directions, mean of {nSeeds} run{nSeeds === 1 ? '' : 's'}. Through trips have neither end in the study area; local trips start or end in it. The last column splits the net change: followed trips, other trips, and cars already on the streets at the start. A small net change can hide trips moving onto a block while others leave it.
      </p>
      <div className="table-scroll" role="region" aria-label="Net change by block, scrollable" tabIndex={0}>
        <table className="wide">
          <caption className="sr-only">Net change in all cars an hour by block inside the study area, with one line for everything else: today, with the closure alone and with the whole package, the through and local parts, and where the change comes from</caption>
          <thead>
            <tr>
              <th scope="col">Block</th><th scope="col">{ROLE_LABEL.baseline}</th><th scope="col">{ROLE_LABEL.closure}</th><th scope="col">{ROLE_LABEL.package}</th>
              <th scope="col">Change ({ROLE_LABEL[cmp].toLowerCase()}): all, through, local</th><th scope="col">Interval</th><th scope="col">Of the change: followed trips (gross in, out), others, cars present at start</th>
            </tr>
          </thead>
          <tbody>
            {r.blocks.filter((b) => blockMeasured(b)).map((b) => {
              const c = b.change[cmp];
              const rc = b.reconcile[cmp];
              return (
                <tr key={b.key}>
                  <th scope="row">{b.label}{b.why.includes('witness') ? <span className="muted small"> (on a possible path)</span> : null}</th>
                  <td>{round(b.baseline.all)}</td><td>{round(b.closure.all)}</td><td>{round(b.package.all)}</td>
                  <td>{c.all.mean > 0 ? '▲ ' : c.all.mean < 0 ? '▼ ' : ''}{signed(c.all.mean)}; {c.through ? signed(c.through.mean) : 'n/a'}; {c.local ? signed(c.local.mean) : 'n/a'}</td>
                  <td>{effectStatus(c.all)}</td>
                  <td>{signed(rc.cohort)} ({signed(rc.cohortAdded)}, {signed(rc.cohortRemoved)}); {signed(rc.other + rc.unpaired + rc.noDetail)}; {signed(rc.initial)}</td>
                </tr>
              );
            })}
            {r.outside && (
              <tr>
                <th scope="row">Bounding streets and outside <span className="muted small">(net change on all other streets together; not listed)</span></th>
                <td>—</td><td>—</td><td>—</td>
                <td>{r.outside.change[cmp].mean > 0 ? '▲ ' : r.outside.change[cmp].mean < 0 ? '▼ ' : ''}{signed(r.outside.change[cmp].mean)}; n/a; n/a</td>
                <td>{effectStatus(r.outside.change[cmp])}</td>
                <td>n/a</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
