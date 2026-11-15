import { describe, expect, it } from 'vitest';
import { analyzeSeed, checkStored, COMPARISONS, localRoute, OUTCOMES, REQ_STRIDE, REDISTRIBUTION_SCHEMA, DIAGNOSTIC_METHOD, type Geo, type Role, type TraceRun } from './redistribution';

// Six links on a small graph: nodes 0, 4 and 5 are gates outside the study area, 1 to 3 inside. Link i runs from linkFrom[i] to linkTo[i].
const geo: Geo = {
  nodeXY: [[0, 0], [100, 0], [200, 0], [300, 0], [400, 0], [200, 100]],
  linkFrom: [0, 1, 2, 3, 1, 5], linkTo: [1, 2, 3, 4, 5, 3],
  linkName: ['Gate Rd', 'Main St', 'Main St', 'East Rd', 'Side St', 'Side St'],
  inStudy: [false, true, true, true, false, false],
};
const N = geo.linkFrom.length;

interface R { src: number; ord: number; stratum?: number; uid: number; origin: number; dest: number; tArr?: number; attr?: number; state: number; detail?: boolean; cur?: number; path: [number, number][] }
const f32bits = (x: number) => new Uint32Array(new Float32Array([x]).buffer)[0];

function run(rs: R[]): TraceRun {
  const requests = new Float64Array(rs.length * REQ_STRIDE);
  const ev: number[] = [];
  const exitsRequested = new Array(N).fill(0), exitsInitial = new Array(N).fill(0);
  rs.forEach((r, i) => {
    requests.set([r.src, r.ord, r.stratum ?? 0, r.uid, r.origin, r.dest, r.tArr ?? 5, r.attr ?? 7, 0, NaN, r.state, r.detail === false ? 0 : 1, r.path[0]?.[0] ?? -1, r.cur ?? -1], i * REQ_STRIDE);
    for (const [l, t] of r.path) {
      if (t >= 0) (r.stratum === 1 ? exitsInitial : exitsRequested)[l]++;
      if (r.detail !== false) ev.push(i, l, f32bits(t));
    }
  });
  const stored = ev.length / 3;
  return {
    requests, events: new Uint32Array(ev), metrics: { gridlockRemoved: 0, unroutableTrips: 0, backlog: 0, vehiclesInNetwork: 1, completedTrips: 1 },
    summary: { schema: 1, mode: 'car', time: 600, requests: { requested: { pending: 0, active: 0, completed: 0, unroutable: 0, removed: 0 }, initial: { pending: 0, active: 0, completed: 0, unroutable: 0, removed: 0 } },
      detail: { maxEvents: 100, storedEvents: stored, skippedEvents: 0, requestsWithDetail: 0, requests: rs.length }, exitsRequested, exitsInitial },
  };
}

const COMPLETED = 2, ACTIVE = 1;
const baseline = run([
  { src: 0, ord: 0, uid: 0, origin: 0, dest: 4, state: COMPLETED, path: [[0, 10], [1, 20], [2, 30], [3, 40]] }, // through car, crosses Main St 1 > 2
  { src: 0, ord: 1, uid: 1, origin: 1, dest: 4, state: COMPLETED, path: [[1, 50], [2, 60], [3, 70]] },          // local end, crosses
  { src: 1, ord: 0, uid: 2, origin: 0, dest: 3, state: COMPLETED, path: [[0, 15], [4, 25], [5, 35]] },          // never crosses
  { src: 1, ord: 0, stratum: 1, uid: 2 ** 31, origin: 1, dest: 4, state: COMPLETED, path: [[1, 5], [2, 9], [3, 20]] }, // placed at the start
  { src: 2, ord: 0, uid: 3, origin: 0, dest: 4, state: ACTIVE, cur: 2, path: [[0, 400], [1, 590]] },          // on 2 at the horizon
  { src: 3, ord: 0, uid: 4, origin: 0, dest: 4, state: COMPLETED, path: [[0, -30], [1, -20], [2, -10], [3, 2]] }, // crossed before the window
  { src: 4, ord: 0, uid: 5, origin: 0, dest: 4, state: COMPLETED, detail: false, path: [[0, 100], [1, 110], [2, 120], [3, 130]] }, // no detail
]);
const closure = run([
  { src: 0, ord: 0, uid: 0, origin: 0, dest: 4, state: COMPLETED, path: [[0, 10], [4, 30], [5, 45], [3, 60]] },
  { src: 0, ord: 1, uid: 1, origin: 1, dest: 4, attr: 99, state: COMPLETED, path: [[4, 50], [5, 60], [3, 70]] }, // other driver attributes
  { src: 1, ord: 0, uid: 2, origin: 0, dest: 3, state: COMPLETED, path: [[0, 15], [4, 25], [5, 35]] },
  { src: 1, ord: 0, stratum: 1, uid: 2 ** 31, origin: 1, dest: 4, state: COMPLETED, path: [[4, 5], [5, 9], [3, 20]] },
  { src: 2, ord: 0, uid: 3, origin: 0, dest: 4, state: ACTIVE, cur: 5, path: [[0, 400], [4, 590]] },
  { src: 3, ord: 0, uid: 4, origin: 0, dest: 4, state: COMPLETED, path: [[0, -30], [4, -20], [5, -10], [3, 2]] },
  { src: 4, ord: 0, uid: 5, origin: 0, dest: 4, state: COMPLETED, detail: false, path: [[0, 100], [4, 110], [5, 120], [3, 130]] },
  { src: 5, ord: 0, uid: 6, origin: 1, dest: 3, state: COMPLETED, path: [[4, 100], [5, 110], [3, 120], [5, 300]] }, // not requested in the baseline; a repeat on 5
]);
// In the package the first cohort car is still on its detour at the horizon.
const pkg = run([
  { src: 0, ord: 0, uid: 0, origin: 0, dest: 4, state: ACTIVE, cur: 5, path: [[0, 10], [4, 30]] },
  { src: 0, ord: 1, uid: 1, origin: 1, dest: 4, state: COMPLETED, path: [[4, 50], [5, 60], [3, 70]] },
  { src: 1, ord: 0, uid: 2, origin: 0, dest: 3, state: COMPLETED, path: [[0, 15], [4, 25], [5, 35]] },
  { src: 1, ord: 0, stratum: 1, uid: 2 ** 31, origin: 1, dest: 4, state: COMPLETED, path: [[4, 5], [5, 9], [3, 20]] },
  { src: 4, ord: 0, uid: 5, origin: 0, dest: 4, state: COMPLETED, detail: false, path: [[0, 100], [4, 110], [5, 120], [3, 130]] },
]);

const runs: Record<Role, TraceRun> = { baseline, closure, package: pkg };
const a = analyzeSeed({ seed: 1, seconds: 600, runs, selector: { kind: 'direct', movements: [[1, 2]], links: [] }, centers: [[200, 0]], geo });

describe('redistribution accounting', () => {
  it('selects the baseline requests that made the closed movement in the window, initial agents apart', () => {
    expect(a.cohort.size).toBe(3);
    expect(a.cohort.initialTraversals).toBe(1);
    expect(a.cohort.baselineNoDetail).toBe(1);
  });

  it('puts every cohort request in exactly one outcome bin', () => {
    for (const c of COMPARISONS) expect(OUTCOMES.reduce((s, o) => s + a.outcomes[c][o], 0)).toBe(a.cohort.size);
    expect(a.outcomes.closure).toMatchObject({ completed: 1, mismatched: 1, active: 1 });
    // The delayed car is active, not completed and not a zero diversion; the request missing from the package is unmatched.
    expect(a.outcomes.package).toMatchObject({ active: 1, completed: 1, unmatched: 1 });
  });

  it('reconciles each link exactly: cohort, other, unpaired, initial and no-detail passages add up to all cars', () => {
    for (const c of COMPARISONS) for (const side of ['baseline', 'scenario'] as const) {
      const s = a.split[c][side];
      const all = a.counts[side === 'baseline' ? 'baseline' : c].all;
      for (let l = 0; l < N; l++) expect(s.cohort[l] + s.other[l] + s.unpaired[l] + s.initial[l] + s.noDetail[l]).toBe(all[l]);
    }
  });

  it('counts a repeated passage twice in the link flow', () => {
    expect(a.counts.closure.all[5]).toBe(7);
    // The new request passes twice; the request with other driver attributes is not paired either.
    expect(a.split.closure.scenario.unpaired[5]).toBe(3);
  });

  it('keeps gross cohort additions apart from the net change', () => {
    const g = a.split.closure.gross;
    expect(g.added[4]).toBe(2); // two cohort cars moved onto Side St
    expect(g.removed[1]).toBe(-2); // the matched through car and the one active at the horizon both left Main St
    expect(g.removed[2]).toBe(-1);
  });

  it('classifies through and local passages by trip ends on every link and leaves undetailed ones unclassified', () => {
    // Link 0 is a boundary link: its two external-to-external cars are counted as through, never as local; the car bound for node 3 is local.
    expect(a.counts.baseline.through[0]).toBe(2);
    expect(a.counts.baseline.local[0]).toBe(1);
    expect(a.counts.baseline.unclassified[0]).toBe(1);
  });

  it('describes routes near the closure street by street and keeps unfinished paths partial', () => {
    expect(localRoute(geo, [[200, 0]], [0, 1, 2, 3])).toBe('Gate Rd → Main St → East Rd');
    const side = a.routes.find((r) => r.key === 'Gate Rd → Side St');
    expect(side?.partial.closure).toBe(1);
    expect(side?.partial.package).toBe(1);
    expect(a.routeChanged.closure).toEqual({ changed: 2, same: 0, unknown: 1 });
  });
});

describe('stored diagnostics', () => {
  const want = { network: 'abcdef0123456789', demand: '0123456789abcdef', simulator: 'f1', period: 'pm_peak', closure: '#c', package: '#p' };
  const ok = { kind: 'redistribution', schema: REDISTRIBUTION_SCHEMA, method: DIAGNOSTIC_METHOD, identity: { period: 'pm_peak', hashes: { network: 'abcdef01', demand: '01234567', simulator: 'f1' }, scenarios: [{ role: 'closure', link: '#c' }, { role: 'package', link: '#p' }] } };
  it('reuses a result only for the inputs, simulator, schema and method it was made with', () => {
    expect(checkStored(ok, want).ok).toBe(true);
    expect(checkStored({ ...ok, schema: 99 }, want)).toMatchObject({ ok: false });
    expect(checkStored({ ...ok, method: 'old' }, want)).toMatchObject({ ok: false });
    expect(checkStored(ok, { ...want, simulator: 'f2' })).toMatchObject({ ok: false, reason: 'made by another simulator version' });
    expect(checkStored(ok, { ...want, network: 'ffff0000ffff' })).toMatchObject({ ok: false });
    expect(checkStored(ok, { ...want, package: '#other' })).toMatchObject({ ok: false });
    expect(checkStored({ aggregate: true }, want)).toMatchObject({ ok: false });
  });
});
