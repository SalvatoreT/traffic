import { describe, expect, it } from 'vitest';
import { fitPeriod, fitReport, gatePriorStations, type FitConfig, type Station } from './lib/demand-fit';
import { assigned, DEFAULT_FIT, fitToCounts, type Constraint } from './lib/fit-counts';
import { gatePriorFromReport } from './lib/membership-loop';

// Gates 0 and 3 feed node 1, link 2 carries both to gate 2. Flows 0>2 and 3>2 offer 100 veh/h each.
const nodes = [0, 1, 2, 3].map((id) => ({ id, x: id * 100, y: 0, control: 'uncontrolled' }));
const road = (id: number, from: number, to: number, name: string) => ({ id, from, to, name, class: 'primary', speedLimit: 10, length: 100 });
const links = [road(0, 0, 1, 'Alpha St'), road(1, 3, 1, 'Beta St'), road(2, 1, 2, 'Gamma St')];
const flows = [{ origin: 0, destination: 2, vehPerHour: 100 }, { origin: 3, destination: 2, vehPerHour: 100 }];
const base: Omit<FitConfig, 'gatePrior'> = { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guard: { enabled: false, weight: 0, excessShare: 0, capacity: { uncontrolled: { perLane: 100, source: 'fixture' } } } };
const count: Station = { id: 'link2', label: 'Gamma St', kind: 'count', basis: 'test', records: [], links: [2], target: { pm: 300 }, weight: 1, tolPct: 15 };
const gateStation = (o: Partial<Station>): Station => ({ id: 'g', label: 'g', kind: 'gate', basis: 'test', records: [], links: [], target: { pm: 100 }, weight: 1, tolPct: 10, ...o });
const prior = { tolerancePct: 0, weight: 10, gateIds: [0, 2, 3] };
// Simulated membership at link 2: pair 0>2 always uses it, pair 3>2 never does in the runs (so its membership falls to the prior of 5 trips, a third).
const measured = { pm: { runs: 1, source: 'test', hits: {}, trips: {}, stations: { runs: 1, source: 'test', hits: { link2: { '0>2': 10 } }, trips: { '0>2': 10, '3>2': 10 } } } };
const through = { targets: [], inStudy: new Set<number>(), measured, priorTrips: 5, measuredStations: 'all' as const };
const run = (stations: Station[], opt: { gatePrior?: typeof prior; membership?: boolean } = {}) =>
  fitPeriod('pm', flows, ['through', 'through'], stations, nodes, links, [], { ...base, ...(opt.gatePrior ? { gatePrior: opt.gatePrior } : {}), ...(opt.membership ? { through } : {}) });

describe('gate prior ceiling stations', () => {
  it('adds no station and no report when the switch is off', () => {
    const r = run([count], { membership: true });
    expect(r.gatePrior).toBeUndefined();
    expect(fitReport('t', [r], { pm: flows }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], [])).not.toMatch(/Gate prior/);
  });

  it('runs no second fit and applies no ceiling without simulated membership', () => {
    const off = run([count]), on = run([count], { gatePrior: prior });
    expect(on.gatePrior).toBeUndefined();
    expect(on.volume).toEqual(off.volume);
    expect(on.fit.iterations).toBe(off.fit.iterations);
  });

  it('makes a station only for gate directions no gate station covers, at the anchor total', () => {
    const anchor = [{ origin: 0, destination: 2, vehPerHour: 150 }, { origin: 3, destination: 2, vehPerHour: 150 }];
    const covered = [gateStation({ id: 'in0', origins: [0] }), gateStation({ id: 'out2', destinations: [2] })];
    const some = gatePriorStations('pm', anchor, covered, prior, (n) => `n${n}`);
    expect(some.map((s) => s.id)).toEqual(['gate-prior origin 3']);
    expect(some[0]).toMatchObject({ kind: 'gate-prior', links: [], origins: [3], weight: 10, ceiling: 150, target: { pm: 150 } });
    const none = gatePriorStations('pm', anchor, [], { ...prior, tolerancePct: 10 }, (n) => `n${n}`);
    expect(none.map((s) => s.id)).toEqual(['gate-prior origin 0', 'gate-prior destination 2', 'gate-prior origin 3']);
    expect(none.find((s) => s.id === 'gate-prior destination 2')!.ceiling).toBeCloseTo(330);
    expect(gatePriorStations('pm', anchor, [count], prior, (n) => `n${n}`)).toHaveLength(3);
    expect(gatePriorStations('pm', anchor, [], { ...prior, gateIds: [1] }, (n) => `n${n}`)).toHaveLength(0);
  });

  it('anchors the ceilings on the static fit and holds the gates there under simulated membership', () => {
    const stat = run([count]);
    expect(stat.volume[0]).toBeCloseTo(150, 0);
    const free = run([count], { membership: true });
    expect(free.volume[0]).toBeGreaterThan(200);
    const on = run([count], { gatePrior: prior, membership: true });
    expect(on.gatePrior!.rows).toHaveLength(3);
    expect(on.gatePrior!.rows.map((x) => Math.round(x.anchor))).toEqual([150, 300, 150]);
    for (const k of [0, 1]) { expect(on.volume[k]).toBeLessThan(150 * 1.05); expect(on.volume[k]).toBeGreaterThan(140); }
    expect(on.gatePrior!.staticTotal).toBeCloseTo(300, 0);
    expect(on.gatePrior!.finalTotal).toBeCloseTo(on.volume[0] + on.volume[1]);
    expect(on.gatePrior!.finalByType.through).toBeCloseTo(on.gatePrior!.finalTotal);
  });

  it('does not pull a gate below its ceiling up toward it', () => {
    const on = run([], { gatePrior: prior, membership: true });
    expect(on.gatePrior).toBeUndefined();
    const c: Constraint = { id: 'p', kind: 'gate-prior', label: 'p', links: [], origins: [0], target: 150, ceiling: 150, ceilingOnly: true };
    const a = { start: Int32Array.from([0, 1]), link: Int32Array.from([0, 2]), share: Float32Array.from([1, 1]), routable: Uint8Array.from([1, 1]), origin: Int32Array.from([0, 3]), destination: Int32Array.from([2, 2]) };
    const r = fitToCounts(a, [100, 100], ['through', 'through'], [c], 3, DEFAULT_FIT);
    expect(r.g[0]).toBeCloseTo(1);
  });

  it('leaves the treatment of unconstrained flows unchanged: a ceiling station does not make a flow count', () => {
    const a = { start: Int32Array.from([0, 1, 2]), link: Int32Array.from([0, 1]), share: Float32Array.from([1, 1]), routable: Uint8Array.from([1, 1, 1]), origin: Int32Array.from([0, 3, 5]), destination: Int32Array.from([2, 2, 6]) };
    const count: Constraint = { id: 'c', kind: 'count', label: 'c', links: [1], target: 50 };
    const cap: Constraint = { id: 'p', kind: 'gate-prior', label: 'p', links: [], origins: [0], target: 500, ceiling: 500, ceilingOnly: true };
    const base = fitToCounts(a, [100, 100, 100], ['through', 'through', 'through'], [count], 2, { ...DEFAULT_FIT, uncounted: 'medianAll' });
    const withCap = fitToCounts(a, [100, 100, 100], ['through', 'through', 'through'], [count, cap], 2, { ...DEFAULT_FIT, uncounted: 'medianAll' });
    expect([...withCap.counted]).toEqual([...base.counted]);
    expect(withCap.counted[0]).toBe(0);
    expect([...withCap.g]).toEqual([...base.g]);
    const plain: Constraint = { ...cap, ceilingOnly: false };
    expect(fitToCounts(a, [100, 100, 100], ['through', 'through', 'through'], [count, plain], 2, DEFAULT_FIT).counted[0]).toBe(1);
    expect(assigned(a, [100, 100, 100], [cap], 2)[0]).toBeCloseTo(100);
  });

  it('keeps the ceiling stations out of the scored stations and the station list', () => {
    const stations = [count];
    const on = run(stations, { gatePrior: prior, membership: true });
    expect(stations).toHaveLength(1);
    expect(on.stationRows.map((x) => x.st.id)).toEqual(['link2']);
    expect(on.heldRows).toHaveLength(0);
    expect(on.cons).toBe(1);
  });

  it('reports the ceiling stations and the flow types, and the loop reads the line', () => {
    const on = run([count], { gatePrior: { ...prior, weight: 0.001 }, membership: true });
    const text = fitReport('t', [on], { pm: flows }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], []);
    expect(text).toMatch(/## Gate prior ceilings \(ASSUMPTION\)/);
    expect(text).toMatch(/Offered car veh\/h by flow type, static fit then final: through 300, local 0, ramp 0; through \d+, local 0, ramp 0\./);
    const got = gatePriorFromReport(text).pm;
    expect(got.stations).toBe(3);
    expect(got.above).toBeGreaterThan(0);
    expect(text).toMatch(/\| Gate node \| Street \|/);
    expect(gatePriorFromReport('no section')).toEqual({});
  });
});
