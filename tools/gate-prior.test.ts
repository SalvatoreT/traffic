import { describe, expect, it } from 'vitest';
import { fitPeriod, fitReport, gatePriorStations, type FitConfig, type Station } from './lib/demand-fit';
import { DEFAULT_FIT } from './lib/fit-counts';
import { gatePriorFromReport } from './lib/membership-loop';

// Gates 0 and 3 feed node 1, link 2 carries both to gate 2. Flows 0>2 and 3>2 offer 100 veh/h each.
const nodes = [0, 1, 2, 3].map((id) => ({ id, x: id * 100, y: 0, control: 'uncontrolled' }));
const road = (id: number, from: number, to: number, name: string) => ({ id, from, to, name, class: 'primary', speedLimit: 10, length: 100 });
const links = [road(0, 0, 1, 'Alpha St'), road(1, 3, 1, 'Beta St'), road(2, 1, 2, 'Gamma St')];
const flows = [{ origin: 0, destination: 2, vehPerHour: 100 }, { origin: 3, destination: 2, vehPerHour: 100 }];
const base: Omit<FitConfig, 'gatePrior'> = { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guard: { enabled: false, weight: 0, excessShare: 0, capacity: { uncontrolled: { perLane: 100, source: 'fixture' } } } };
const count: Station = { id: 'link2', label: 'Gamma St', kind: 'count', basis: 'test', records: [], links: [2], target: { pm: 300 }, weight: 1, tolPct: 15 };
const gateStation = (o: Partial<Station>): Station => ({ id: 'g', label: 'g', kind: 'gate', basis: 'test', records: [], links: [], target: { pm: 100 }, weight: 1, tolPct: 10, ...o });
const prior = { tolerancePct: 10, weight: 10, gateIds: [0, 2, 3] };
const run = (stations: Station[], gatePrior?: typeof prior) => fitPeriod('pm', flows, ['through', 'through'], stations, nodes, links, [], { ...base, ...(gatePrior ? { gatePrior } : {}) });
const total = (r: ReturnType<typeof run>, pick: (k: number) => boolean) => r.volume.reduce((a, v, k) => a + (pick(k) ? v : 0), 0);

describe('gate prior ceiling stations', () => {
  it('adds no station and no report when the switch is off', () => {
    const r = run([count]);
    expect(r.gatePrior).toBeUndefined();
    expect(fitReport('t', [r], { pm: flows }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], [])).not.toMatch(/Gate prior/);
    expect(r.volume[0]).toBeCloseTo(150, 0);
  });

  it('makes a station only for gate directions no gate station covers, with the pre-fit total plus the tolerance as ceiling', () => {
    const covered = [gateStation({ id: 'in0', origins: [0] }), gateStation({ id: 'out2', destinations: [2] })];
    const some = gatePriorStations('pm', flows, covered, prior, (n) => `n${n}`);
    expect(some.map((s) => s.id)).toEqual(['gate-prior origin 3']);
    expect(some[0]).toMatchObject({ kind: 'gate-prior', links: [], origins: [3], weight: 10 });
    expect(some[0].ceiling).toBeCloseTo(110);
    expect(some[0].target.pm).toBe(some[0].ceiling);
    const none = gatePriorStations('pm', flows, [], prior, (n) => `n${n}`);
    expect(none.map((s) => s.id)).toEqual(['gate-prior origin 0', 'gate-prior destination 2', 'gate-prior origin 3']);
    expect(none.find((s) => s.id === 'gate-prior destination 2')!.ceiling).toBeCloseTo(220);
    expect(none.every((s) => !s.destinations?.includes(0) && !s.origins?.includes(2))).toBe(true);
  });

  it('counts a gate whose gate station was dropped as uncovered, and ignores non-gate stations', () => {
    expect(gatePriorStations('pm', flows, [count], prior, (n) => `n${n}`)).toHaveLength(3);
    expect(gatePriorStations('pm', flows, [], { ...prior, gateIds: [1] }, (n) => `n${n}`)).toHaveLength(0);
  });

  it('does not pull a gate below its ceiling up toward it', () => {
    const r = run([], prior);
    expect(r.volume[0]).toBeCloseTo(100);
    expect(r.volume[1]).toBeCloseTo(100);
    expect(r.gatePrior!.rows.map((x) => x.final)).toEqual([100, 200, 100]);
  });

  it('holds gates near their ceilings when a count would grow them', () => {
    const off = run([count]);
    expect(total(off, (k) => k === 0)).toBeCloseTo(150, 0);
    const on = run([count], prior);
    for (const k of [0, 1]) { expect(on.volume[k]).toBeGreaterThan(105); expect(on.volume[k]).toBeLessThan(110 * 1.05); }
    expect(on.gatePrior!.rows).toHaveLength(3);
    expect(on.gatePrior!.rows.every((x) => x.final < x.ceiling * 1.05)).toBe(true);
    expect(on.gatePrior!.offeredBefore).toBeCloseTo(200);
    expect(on.gatePrior!.offeredAfter).toBeCloseTo(on.volume[0] + on.volume[1]);
  });

  it('leaves a covered gate to its gate station', () => {
    const on = run([count, gateStation({ id: 'in0', origins: [0], target: { pm: 140 } })], prior);
    expect(on.gatePrior!.rows.map((x) => `${x.direction} ${x.node}`)).toEqual(['destination 2', 'origin 3']);
    expect(on.volume[0]).toBeGreaterThan(110);
  });

  it('keeps the ceiling stations out of the scored stations and the station list', () => {
    const stations = [count];
    const on = run(stations, prior);
    expect(stations).toHaveLength(1);
    expect(on.stationRows.map((x) => x.st.id)).toEqual(['link2']);
    expect(on.heldRows).toHaveLength(0);
    expect(on.cons).toBe(1);
  });

  it('reports the ceiling stations per period and the loop reads the line', () => {
    const on = run([count], { ...prior, tolerancePct: 0 });
    const text = fitReport('t', [on], { pm: flows }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], []);
    expect(text).toMatch(/## Gate prior ceilings \(ASSUMPTION\)/);
    const got = gatePriorFromReport(text).pm;
    expect(got.stations).toBe(3);
    expect(got.above).toBeGreaterThan(0);
    expect(text).toMatch(/\| Gate node \| Street \|/);
    expect(gatePriorFromReport('no section')).toEqual({});
  });
});
