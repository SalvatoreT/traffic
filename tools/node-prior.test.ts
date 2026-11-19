import { describe, expect, it } from 'vitest';
import { fitPeriod, fitReport, gatePriorStations, type FitConfig, type GatePriorConfig, type Station } from './lib/demand-fit';
import { DEFAULT_FIT } from './lib/fit-counts';
import { gatePriorFromReport, offeredShare } from './lib/membership-loop';

// Round 50: scope "allNodes". Gates 0 and 3 feed node 1 (a non-gate node), link 2 carries node 1 to node 2 (also non-gate in this fixture).
// Three local flows of 100 veh/h: 0>2, 3>2 and 1>2. A count of 450 on link 2 is met by growing every flow under static membership (to 150 each).
const nodes = [0, 1, 2, 3].map((id) => ({ id, x: id * 100, y: 0, control: 'uncontrolled' }));
const road = (id: number, from: number, to: number, name: string) => ({ id, from, to, name, class: 'primary', speedLimit: 10, length: 100 });
const links = [road(0, 0, 1, 'Alpha St'), road(1, 3, 1, 'Beta St'), road(2, 1, 2, 'Gamma St')];
const flows = [{ origin: 0, destination: 2, vehPerHour: 100 }, { origin: 3, destination: 2, vehPerHour: 100 }, { origin: 1, destination: 2, vehPerHour: 100 }];
const types = ['local', 'local', 'local'] as const;
const base: Omit<FitConfig, 'gatePrior'> = { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guard: { enabled: false, weight: 0, excessShare: 0, capacity: { uncontrolled: { perLane: 100, source: 'fixture' } } } };
const count: Station = { id: 'link2', label: 'Gamma St', kind: 'count', basis: 'test', records: [], links: [2], target: { pm: 450 }, weight: 1, tolPct: 5 };
// Simulated membership: only pair 1>2 is seen at link 2 (full membership); the pairs from gates 0 and 3 fall to a third of the static share.
const measured = { pm: { runs: 1, source: 'test', hits: {}, trips: {}, stations: { runs: 1, source: 'test', hits: { link2: { '1>2': 10 } }, trips: { '0>2': 10, '3>2': 10, '1>2': 10 } } } };
const through = { targets: [], inStudy: new Set<number>(), measured, priorTrips: 5, measuredStations: 'all' as const };
const gates: GatePriorConfig = { tolerancePct: 0, weight: 10, gateIds: [0, 3], studyIds: [1] };
const all: GatePriorConfig = { ...gates, scope: 'allNodes' };
const run = (gatePrior?: GatePriorConfig, membership = true) =>
  fitPeriod('pm', flows, [...types], [count], nodes, links, [], { ...base, ...(gatePrior ? { gatePrior } : {}), ...(membership ? { through } : {}) });
const text = (r: ReturnType<typeof run>) => fitReport('t', [r], { pm: flows }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], []);

describe('node prior ceilings (scope allNodes)', () => {
  it('scope absent and scope "gates" are the round 49 behavior', () => {
    const a = run({ tolerancePct: 0, weight: 10, gateIds: [0, 3] }), b = run({ ...gates, scope: 'gates' });
    expect(b.volume).toEqual(a.volume);
    expect(b.gatePrior!.rows.map((x) => x.node)).toEqual([0, 3]);
    expect(b.gatePrior!.rows.every((x) => x.gate)).toBe(true);
    expect(b.gatePrior!.scope).toBe('gates');
  });

  it('makes a station for every node direction with trips, except directions a gate station covers and zero totals', () => {
    const anchor = [{ origin: 0, destination: 2, vehPerHour: 150 }, { origin: 3, destination: 2, vehPerHour: 150 }, { origin: 1, destination: 2, vehPerHour: 150 }, { origin: 1, destination: 0, vehPerHour: 0 }];
    const st = gatePriorStations('pm', anchor, [], all, (n) => `n${n}`);
    expect(st.map((s) => s.id)).toEqual(['gate-prior origin 0', 'gate-prior origin 1', 'gate-prior destination 2', 'gate-prior origin 3']);
    expect(st.find((s) => s.id === 'gate-prior destination 2')!.ceiling).toBeCloseTo(450);
    const cov = gatePriorStations('pm', anchor, [{ kind: 'gate', origins: [0] }, { kind: 'gate', destinations: [2] }], all, (n) => `n${n}`);
    expect(cov.map((s) => s.id)).toEqual(['gate-prior origin 1', 'gate-prior origin 3']);
    expect(gatePriorStations('pm', anchor, [], gates, (n) => `n${n}`).map((s) => s.id)).toEqual(['gate-prior origin 0', 'gate-prior origin 3']);
  });

  it('holds a pair set that would turn through demand into local demand; the gate scope does not', () => {
    const stat = run();
    expect(run(undefined, false).volume[2]).toBeCloseTo(150, 0);
    const free = run(undefined);
    expect(free.volume[2]).toBeGreaterThan(200);
    const g = run(gates);
    expect(g.volume[2]).toBeGreaterThan(200);
    expect(g.volume[0]).toBeLessThanOrEqual(150 * 1.001);
    const a = run(all);
    for (const k of [0, 1, 2]) { expect(a.volume[k]).toBeLessThanOrEqual(150 * 1.001); expect(a.volume[k]).toBeGreaterThan(140); }
    expect(a.gatePrior!.rows.map((x) => `${x.direction} ${x.node} ${x.gate}`)).toEqual(['origin 0 true', 'origin 1 false', 'destination 2 false', 'origin 3 true']);
    expect(a.gatePrior!.staticTotal).toBeCloseTo(450, 0);
    expect(a.gatePrior!.finalTotal).toBeLessThanOrEqual(450 * 1.001);
    expect(stat.gatePrior).toBeUndefined();
  });

  it('projects non-gate nodes onto their ceilings and counts the projection by kind', () => {
    const a = run({ ...all, weight: 0.001 });
    const rows = a.gatePrior!.rows;
    for (const r of rows) expect(r.final).toBeLessThanOrEqual(r.ceiling * 1.001 + 1e-6);
    expect(rows.some((r) => !r.gate && r.removed > 0)).toBe(true);
    expect(a.gatePrior!.projection.removed).toBeCloseTo(rows.reduce((s, r) => s + r.removed, 0));
    expect(a.gatePrior!.projection.worst.length).toBeGreaterThan(0);
  });

  it('keeps the ceiling stations out of the station list and the scored stations', () => {
    const a = run(all);
    expect(a.stationRows.map((x) => x.st.id)).toEqual(['link2']);
    expect(a.cons).toBe(1);
  });

  it('reports ceiling stations by kind, non-gate trip ends and flow types, and the loop reads them', () => {
    const a = run({ ...all, weight: 0.001 });
    const t = text(a);
    expect(t).toMatch(/Each node direction \(every origin or destination of a car flow/);
    expect(t).toMatch(/Ceiling stations by kind pm: gate 2 stations, \d+ above ceiling, excess \d+ veh\/h, removed by the projection \d+ veh\/h; non-gate 2 stations, \d+ above ceiling, excess \d+ veh\/h, removed by the projection \d+ veh\/h\./);
    expect(t).toMatch(/Non-gate node trip ends pm \(veh\/h, static fit to final\): origins inside the study area 150 to \d+, outside 0 to 0; destinations inside 0 to 0, outside 450 to \d+\./);
    const got = gatePriorFromReport(t).pm;
    expect(got.stations).toBe(4);
    expect(got.gate).toMatchObject({ stations: 2 });
    expect(got.nonGate).toMatchObject({ stations: 2 });
    expect(got.nonGate!.removed).toBeGreaterThan(0);
    expect(got.byType!.static.local).toBe(450);
    expect(got.byType!.final.local).toBe(got.finalTotal);
    expect(got.ends!.originInside[0]).toBe(150);
    expect(got.ends!.destOutside[0]).toBe(450);
    expect(offeredShare(got)).toBeCloseTo(got.finalTotal / 450);
  });

  it('a round 49 style report (no kind lines) still parses', () => {
    const got = gatePriorFromReport('Gate prior ceilings pm: 3 stations; 0 above ceiling; excess 0 veh/h; offered car 300 to 310 veh/h.\n').pm;
    expect(got).toEqual({ stations: 3, above: 0, excess: 0, staticTotal: 300, finalTotal: 310 });
  });
});
