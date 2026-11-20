import { describe, expect, it } from 'vitest';
import { fitPeriod, fitReport, gatePriorStations, type FitConfig, type GatePriorConfig, type Station } from './lib/demand-fit';
import { DEFAULT_FIT } from './lib/fit-counts';

// Round 52: scope "outsideStudyArea" (node 1 is inside the study area). Fixture of round 50. Gates 0 and 3 feed node 1 (a non-gate node), link 2 carries node 1 to node 2 (also non-gate in this fixture).
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

const outside: GatePriorConfig = { ...gates, scope: 'outsideStudyArea' };
const sum = (v: number[]) => v.reduce((a, b) => a + b, 0);

describe('node prior ceilings (scope outsideStudyArea)', () => {
  it('caps gates and non-gate nodes outside the study area and leaves the inside nodes free', () => {
    const anchor = [{ origin: 0, destination: 2, vehPerHour: 150 }, { origin: 3, destination: 2, vehPerHour: 150 }, { origin: 1, destination: 2, vehPerHour: 150 }];
    expect(gatePriorStations('pm', anchor, [], outside, (n) => `n${n}`).map((s) => s.id)).toEqual(['gate-prior origin 0', 'gate-prior destination 2', 'gate-prior origin 3']);
    expect(gatePriorStations('pm', anchor, [], all, (n) => `n${n}`).map((s) => s.id)).toContain('gate-prior origin 1');
    expect(gatePriorStations('pm', anchor, [], { ...outside, studyIds: undefined }, (n) => `n${n}`).map((s) => s.id)).toContain('gate-prior origin 1');
  });

  it('lets the inside node grow where allNodes holds it, and holds the gates and the outside destination', () => {
    const a = run(all), o = run(outside);
    expect(o.gatePrior!.scope).toBe('outsideStudyArea');
    expect(o.gatePrior!.rows.map((x) => `${x.direction} ${x.node}`)).toEqual(['origin 0', 'destination 2', 'origin 3']);
    expect(a.volume[2]).toBeLessThanOrEqual(150 * 1.001);
    expect(o.volume[2]).toBeGreaterThan(a.volume[2] + 1);
    expect(o.volume[0]).toBeLessThanOrEqual(150 * 1.001);
    expect(o.volume[1]).toBeLessThanOrEqual(150 * 1.001);
    expect(sum(o.volume)).toBeLessThanOrEqual(450 * 1.001);
  });

  it('the projection never touches the inside node and the report counts inside nodes that grew', () => {
    const o = run(outside);
    expect(o.gatePrior!.projection.worst.every((x) => x.node !== 1)).toBe(true);
    expect(o.gatePrior!.rows.some((x) => x.node === 1)).toBe(false);
    expect(o.gatePrior!.insideGrew).toEqual({ origin: [1, 1], destination: [0, 0] });
    expect(o.gatePrior!.nonGateEnds.origin.inside[1]).toBeGreaterThan(o.gatePrior!.nonGateEnds.origin.inside[0]);
    expect(text(o)).toMatch(/^Inside-study-area nodes that grew pm: origins 1 of 1, destinations 0 of 0\.$/m);
    expect(text(o)).toMatch(/non-gate nodes inside the study area have no ceiling/);
    expect(text(run(all))).not.toMatch(/Inside-study-area nodes that grew/);
  });
});
