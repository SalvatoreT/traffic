import { describe, expect, it } from 'vitest';
import { fitPeriod, fitReport, type FitConfig, type Station } from './lib/demand-fit';
import { DEFAULT_FIT } from './lib/fit-counts';
import { routeWeightLinesFromReport, routeWeightSwitch } from './lib/membership-loop';

// Round 52: a whole-street route count with simulated membership weighs its own weight times the fitted block stations on its path.
// Colby runs through links 1 and 2 (nodes 1, 2, 3). Flow A (0>4) drives the whole street, B (0>2) only the first block, C (5>4) only the second.
const nodes = [0, 1, 2, 3, 4, 5].map((id) => ({ id, x: id * 100, y: 0, control: 'uncontrolled' }));
const road = (id: number, from: number, to: number, name: string) => ({ id, from, to, name, class: 'primary', speedLimit: 10, length: 100 });
const links = [road(0, 0, 1, 'Gate Road'), road(1, 1, 2, 'Colby Street'), road(2, 2, 3, 'Colby Street'), road(3, 3, 4, 'Exit Road'), road(4, 5, 2, 'Side Street')];
const flows = [{ origin: 0, destination: 4, vehPerHour: 100 }, { origin: 0, destination: 2, vehPerHour: 100 }, { origin: 5, destination: 4, vehPerHour: 100 }];
const types = ['through', 'local', 'local'] as const;
const base: Omit<FitConfig, 'through'> = { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guard: { enabled: false, weight: 0, excessShare: 0, capacity: { uncontrolled: { perLane: 1000, source: 'fixture' } } } };
const block = (link: number, target: Record<string, number>, o: Partial<Station> = {}): Station => ({ id: `count block ${link}`, label: `Colby block ${link}`, kind: 'count', basis: 'test', records: [], links: [link], target, weight: 1, tolPct: 15, ...o });
const route = (o: Partial<Station> = {}): Station => ({ id: 'count route 1>2', label: 'Colby Street NB, whole street', kind: 'count', basis: 'test', records: [], links: [], feature: { kind: 'path', first: 1, last: 2, links: [1, 2] }, target: { pm: 20 }, weight: 1, tolPct: 30, ...o });
const stations = (o: { b2?: Station; r?: Station } = {}) => [block(1, { pm: 200 }), o.b2 ?? block(2, { pm: 200 }), o.r ?? route()];
// Pair 0>4 is the only one that uses the whole street, so a simulated trip of it is a hit; the others have none.
const withPairs = (hits = true) => ({ pm: { runs: 1, source: 'test', hits: {}, trips: {}, stations: { runs: 1, source: 'test', hits: hits ? { 'count route 1>2': { '0>4': 10 } } : { 'count block 1': { '0>4': 10 } }, trips: { '0>4': 10, '0>2': 10, '5>4': 10 } } } });
const run = (st: Station[], o: { simulated?: object; pairs?: boolean } = {}) => fitPeriod('pm', flows, [...types], st, nodes, links, [], { ...base, through: { targets: [], inStudy: new Set<number>(), measured: withPairs(o.pairs ?? true), priorTrips: 5, measuredStations: 'all', ...(o.simulated ? { simulated: o.simulated } : {}) } as never });
const on = { throughTargets: false, shares: false, routeWeightPerBlock: true };
const text = (r: ReturnType<typeof run>) => fitReport('t', [r], { pm: flows }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], []);
const finalOf = (r: ReturnType<typeof run>, id: string) => r.stationRows.find((x) => x.st.id === id)!.final;

describe('route weight per block', () => {
  it('absent or false: nothing changes and the report has no route weight', () => {
    const none = run(stations()), off = run(stations(), { simulated: { throughTargets: false, shares: false } }), no = run(stations(), { simulated: { ...on, routeWeightPerBlock: false } });
    for (const r of [off, no]) {
      expect(r.volume).toEqual(none.volume);
      expect(r.routeWeights).toBeUndefined();
      expect(text(r)).not.toMatch(/Route weight/);
      expect(r.notes.join('\n')).not.toMatch(/weighted by the blocks/);
    }
  });

  it('with simulated membership the weight is the route weight times the blocks it spans', () => {
    const r = run(stations(), { simulated: on });
    expect(r.routeWeights).toEqual([{ id: 'count route 1>2', label: 'Colby Street NB, whole street', simulated: true, base: 1, blocks: 2, weight: 2 }]);
    expect(r.notes.join('\n')).toMatch(/count route 1>2 1 x 2 = 2/);
    const heavier = run([block(1, { pm: 200 }), block(2, { pm: 200 }), route({ weight: 1.5 })], { simulated: on });
    expect(heavier.routeWeights![0]).toMatchObject({ base: 1.5, blocks: 2, weight: 3 });
  });

  it('moves the whole-street figure toward its target when the blocks pull it up', () => {
    const plain = run(stations(), { simulated: { throughTargets: false, shares: false } }), scaled = run(stations(), { simulated: on });
    const gap = (r: ReturnType<typeof run>) => Math.abs(finalOf(r, 'count route 1>2') - 20);
    expect(finalOf(plain, 'count route 1>2')).toBeGreaterThan(20);
    expect(gap(scaled)).toBeLessThan(gap(plain));
  });

  it('static membership keeps the route weight', () => {
    const r = run(stations(), { simulated: on, pairs: false });
    expect(r.routeWeights).toEqual([{ id: 'count route 1>2', label: 'Colby Street NB, whole street', simulated: false, base: 1, blocks: 2, weight: 1 }]);
    const plain = run(stations(), { simulated: { throughTargets: false, shares: false }, pairs: false });
    expect(r.volume).toEqual(plain.volume);
  });

  it('counts only blocks that are fitted with a target in the period', () => {
    expect(run(stations({ b2: block(2, { pm: 200 }, { held: true }) }), { simulated: on }).routeWeights![0]).toMatchObject({ blocks: 1, weight: 1 });
    expect(run(stations({ b2: block(2, { am: 200 }) }), { simulated: on }).routeWeights![0]).toMatchObject({ blocks: 1, weight: 1 });
    expect(run(stations({ b2: block(2, { pm: 0 }) }), { simulated: on }).routeWeights![0]).toMatchObject({ blocks: 1, weight: 1 });
    const other = block(4, { pm: 50 });
    expect(run([...stations(), other], { simulated: on }).routeWeights![0].blocks).toBe(2);
    expect(run([block(1, { pm: 200 }), route()], { simulated: on }).routeWeights![0].blocks).toBe(1);
  });

  it('a route with no fitted block keeps its weight, and a station that is not a whole-street count is left alone', () => {
    expect(run([route()], { simulated: on }).routeWeights![0]).toMatchObject({ blocks: 1, weight: 1 });
    const move = route({ id: 'count move 1>2', label: 'a movement' });
    expect(run([...stations({ r: move })], { simulated: on }).routeWeights).toBeUndefined();
  });

  it('the report lines parse and a round 51 report has none', () => {
    const lines = routeWeightLinesFromReport(text(run(stations(), { simulated: on })));
    expect(lines).toEqual([{ period: 'pm', id: 'count route 1>2', membership: 'simulated', base: 1, blocks: 2, weight: 2, label: 'Colby Street NB, whole street' }]);
    expect(routeWeightLinesFromReport(text(run(stations(), { simulated: { throughTargets: false, shares: false } })))).toEqual([]);
    const stat = routeWeightLinesFromReport(text(run(stations(), { simulated: on, pairs: false })));
    expect(stat[0]).toMatchObject({ membership: 'static', blocks: 2, weight: 1 });
  });

  it('reads the sub-switch only when it is true', () => {
    expect(routeWeightSwitch(undefined)).toBe(false);
    expect(routeWeightSwitch({})).toBe(false);
    expect(routeWeightSwitch({ routeWeightPerBlock: 'yes' })).toBe(false);
    expect(routeWeightSwitch({ routeWeightPerBlock: true })).toBe(true);
  });
});
