import { describe, expect, it } from 'vitest';
import { fitPeriod, fitReport, measuredShare, type FitConfig, type Station, type ThroughMeasured } from './lib/demand-fit';
import { DEFAULT_FIT } from './lib/fit-counts';
import { endAlongLinesFromReport, endAlongSwitch } from './lib/membership-loop';
import { interiorNodes, routeShareTally } from './lib/share-targets';

// Round 53: the count's "ended along the street" figure of a select-link run is a fit target. Main Street runs north through nodes 1, 2, 3 and 4 (links 1, 2, 3).
// Interior nodes of the run are 2 and 3. Flow A (20>2) and B (10>3) use the run and end at an interior node, C (10>40) drives the whole street, D (20>50) never touches it.
const nodes = [[10, 0, -100], [1, 0, 0], [2, 0, 100], [3, 0, 200], [4, 0, 300], [20, 100, 0], [40, 0, 400], [50, 200, 0]].map(([id, x, y]) => ({ id, x, y, control: 'uncontrolled' }));
const road = (id: number, from: number, to: number, name: string, cls = 'primary') => ({ id, from, to, name, class: cls, length: 100, speedLimit: 10, inStudyArea: true });
const links = [road(0, 10, 1, 'Ramp Road'), road(1, 1, 2, 'Main Street'), road(2, 2, 3, 'Main Street'), road(3, 3, 4, 'Main Street'), road(4, 4, 40, 'Exit Road'), road(5, 20, 1, 'Side Street'), road(6, 20, 50, 'East Street')];
const flows = [{ origin: 20, destination: 2, vehPerHour: 100 }, { origin: 10, destination: 3, vehPerHour: 100 }, { origin: 10, destination: 40, vehPerHour: 100 }, { origin: 20, destination: 50, vehPerHour: 100 }];
const types = ['local', 'local', 'through', 'through'] as const;
const runIds = [1, 2, 3];
const targetsFile = (end: Record<string, number> | null = { pm: 40 }) => ({ selectLink: [{ street: 'Main Street', direction: 'NB', ...(end ? { endAlongVehPerHour: end } : {}), from: [{ via: 'freeway', share: 0.5 }], to: [{ via: 'freeway', share: 0.5 }] }] });
const routes = [[5, 1], [0, 1, 2], [0, 1, 2, 3, 4], [6]];
const tally = (end: Record<string, number> | null = { pm: 40 }, skip: string[] = []) => {
  const t = routeShareTally(nodes, links, targetsFile(end), flows, 'pm', 'pm', 3, { skip: new Set(skip) });
  routes.forEach((r, k) => t.onRoute(k, r));
  return t;
};
// Over 2 runs: pair 20>2 had 60 of its 200 offered trips on the run, 10>3 40, 10>40 150, and 20>50 (static routes miss the run) 30.
const blocks: ThroughMeasured & { zeroHit?: string[] } = { runs: 2, source: 'test', hits: { 'through Main Street NB': { '20>2': 60, '10>3': 40, '10>40': 150, '20>50': 30 } }, trips: { '20>2': 200, '10>3': 200, '10>40': 200, '20>50': 200 } };
const memberOf = (stat: Float64Array) => (blocks.hits['through Main Street NB'] ? measuredShare(stat, flows, blocks, 'through Main Street NB', 5, () => false, () => false) : undefined);

describe('the end-along rule of the tally', () => {
  it('interior nodes are the heads of the run\'s links that are also the tail of another one', () => {
    expect(interiorNodes(links, runIds)).toEqual([2, 3]);
    expect(interiorNodes(links, [1])).toEqual([]);
    expect(interiorNodes(links, [3, 2, 1])).toEqual([2, 3]);
  });

  it('static routes: a flow counts its share of routes on the run where its destination is an interior node', () => {
    const [q] = tally().endAlong();
    expect(q).toMatchObject({ id: 'end along Main Street NB', target: 40, simulated: false, nodes: [2, 3], flows: 2 });
    expect(Array.from(q.member)).toEqual([1, 1, 0, 0]);
    expect(Array.from(q.staticMember)).toEqual([1, 1, 0, 0]);
  });

  it('the first node, the last node and the nodes off the run do not count', () => {
    const f = [{ origin: 20, destination: 1, vehPerHour: 1 }, { origin: 20, destination: 4, vehPerHour: 1 }, { origin: 20, destination: 50, vehPerHour: 1 }, { origin: 20, destination: 3, vehPerHour: 1 }];
    const t = routeShareTally(nodes, links, targetsFile(), f, 'pm', 'pm', 3, { skip: new Set() });
    [[5], [5, 1, 2, 3], [6], [5, 1, 2]].forEach((r, k) => t.onRoute(k, r));
    expect(Array.from(t.endAlong()[0].member)).toEqual([0, 0, 0, 1]);
  });

  it('simulated: each pair\'s share of trips on the run, with the static fraction as a prior of 5 trips', () => {
    const [q] = tally().endAlong((_, stat) => memberOf(stat));
    expect(q.simulated).toBe(true);
    expect(q.member[0]).toBeCloseTo((60 + 5) / 205, 10);
    expect(q.member[1]).toBeCloseTo((40 + 5) / 205, 10);
    expect(q.member[2]).toBe(0);
    expect(q.member[3]).toBe(0);
    expect(Array.from(q.staticMember)).toEqual([1, 1, 0, 0]);
  });

  it('a run without a simulated trip keeps static routes', () => {
    const [q] = tally().endAlong(() => undefined);
    expect(q.simulated).toBe(false);
    expect(Array.from(q.member)).toEqual([1, 1, 0, 0]);
  });

  it('no rule without the option, without a target in the period, for a skipped run or when the run has no interior node', () => {
    expect(routeShareTally(nodes, links, targetsFile(), flows, 'pm', 'pm', 3).endAlong()).toEqual([]);
    expect(tally({ am: 9 }).endAlong()).toEqual([]);
    expect(tally(null).endAlong()).toEqual([]);
    expect(tally({ pm: 0 }).endAlong()).toEqual([]);
    expect(tally({ pm: 40 }, ['Main Street NB']).endAlong()).toEqual([]);
    expect(tally({ pm: 40 }, ['Other Street NB']).endAlong()).toHaveLength(1);
  });
});

describe('the fit with the end-along sub-switch', () => {
  const count: Station = { id: 'main', label: 'Main St', kind: 'count', basis: 'test', records: [], links: [1], target: { pm: 400 }, weight: 1, tolPct: 5 };
  const base: Omit<FitConfig, 'through'> = { fit: DEFAULT_FIT, draws: 1, dispersion: 0, shares: { targets: targetsFile({ pm: 80 }), weight: 3, pmPeriod: 'pm' }, guard: { enabled: false, weight: 0, excessShare: 0, capacity: { uncontrolled: { perLane: 1000, source: 'fixture' }, motorway: { perLane: 2000, source: 'fixture' } } } };
  const measured = (b: object | null) => ({ pm: { runs: 2, source: 'test', hits: {}, trips: {}, ...(b ? { blocks: b } : {}) } });
  const on = { throughTargets: false, shares: true, endAlong: { weight: 2, skip: [] as string[] } };
  const run = (o: { simulated?: object; blocks?: object | null; cfg?: Partial<FitConfig>; st?: Station[] } = {}) => fitPeriod('pm', flows, [...types], o.st ?? [count], nodes, links, [], { ...base, ...(o.cfg ?? {}), through: { targets: [], inStudy: new Set<number>(), measured: measured(o.blocks === undefined ? blocks : o.blocks), priorTrips: 5, measuredStations: 'all', ...(o.simulated ? { simulated: o.simulated } : {}) } as never });
  const text = (r: ReturnType<typeof run>) => fitReport('t', [r], { pm: flows }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], []);

  it('absent or false: nothing changes and the report has no end-along section', () => {
    const none = run({ simulated: { throughTargets: false, shares: true } });
    const off = run({ simulated: { ...on, endAlong: undefined } });
    expect(off.volume).toEqual(none.volume);
    for (const r of [none, off]) {
      expect(r.endRows).toBeUndefined();
      expect(text(r)).not.toMatch(/End along|ended along/);
      expect(r.notes.join('\n')).not.toMatch(/ended along/);
    }
    expect(endAlongLinesFromReport(text(none))).toEqual([]);
  });

  it('with the switch the constraint joins the fit and moves the figure toward its target', () => {
    const plain = run({ simulated: { throughTargets: false, shares: true } }), r = run({ simulated: on });
    expect(r.endRows).toHaveLength(1);
    const q = r.endRows![0];
    expect(q.spec.simulated).toBe(true);
    expect(q.weight).toBe(2);
    const at = (v: number[]) => v[0] * q.spec.member[0] + v[1] * q.spec.member[1];
    expect(at(plain.volume)).toBeLessThan(80);
    expect(Math.abs(q.final - 80)).toBeLessThan(Math.abs(at(plain.volume) - 80));
    expect(q.final).toBeCloseTo(at(r.volume), 6);
    expect(r.notes.join('\n')).toMatch(/trips that ended along the street are fit targets \(round 53, ASSUMPTION\): 1 select-link run\(s\), weight 2;.*Main Street NB simulated \(2 nodes\)/);
  });

  it('the report lines parse and give the figure on the membership used and on the static routes', () => {
    const lines = endAlongLinesFromReport(text(run({ simulated: on })));
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ period: 'pm', label: 'Main Street NB', membership: 'simulated', target: 80, weight: 2, flows: 2, nodes: [2, 3] });
    expect(lines[0].staticOffered).toBeCloseTo(200, 1);
    expect(lines[0].offered).toBeCloseTo(100 * (65 / 205) + 100 * (45 / 205), 1);
    expect(Number.isFinite(lines[0].final) && Number.isFinite(lines[0].staticFinal) && Number.isFinite(lines[0].afterFit)).toBe(true);
  });

  it('a run with no simulated hit takes static routes and says so', () => {
    const r = run({ simulated: on, blocks: { ...blocks, hits: {}, zeroHit: ['Main Street NB'] } });
    expect(r.endRows![0].spec.simulated).toBe(false);
    expect(endAlongLinesFromReport(text(r))[0].membership).toBe('static');
    expect(r.notes.join('\n')).toMatch(/Main Street NB static/);
  });

  it('no membership file, a file without block pairs, or the static fit that anchors the ceilings: no end-along constraint', () => {
    const plain = fitPeriod('pm', flows, [...types], [count], nodes, links, [], { ...base, through: { targets: [], inStudy: new Set<number>(), priorTrips: 5, simulated: on } as never });
    expect(plain.endRows).toBeUndefined();
    const noBlocks = run({ simulated: on, blocks: null });
    expect(noBlocks.endRows).toBeUndefined();
    const reference = fitPeriod('pm', flows, [...types], [count], nodes, links, [], { ...base, through: { targets: [], inStudy: new Set<number>(), priorTrips: 5 } as never });
    expect(plain.volume).toEqual(reference.volume);
  });

  it('a skipped run (a held block lies on it in the training view) has no constraint', () => {
    const r = run({ simulated: { ...on, endAlong: { weight: 2, skip: ['Main Street NB'] } } });
    expect(r.endRows).toBeUndefined();
    expect(text(r)).not.toMatch(/End along/);
    expect(r.volume).toEqual(run({ simulated: { throughTargets: false, shares: true } }).volume);
  });

  it('is not counted among the fitted stations within tolerance', () => {
    const withEnd = run({ simulated: on }), without = run({ simulated: { throughTargets: false, shares: true } });
    expect(withEnd.cons).toBe(without.cons);
  });

  it('needs the select-link share targets', () => {
    expect(() => run({ simulated: on, cfg: { shares: undefined } })).toThrow(/needs the select-link share targets/);
  });
});

describe('sub-switch and report parsing', () => {
  it('reads the sub-switch only when it is true', () => {
    expect(endAlongSwitch(undefined)).toBe(false);
    expect(endAlongSwitch({})).toBe(false);
    expect(endAlongSwitch({ endAlong: 'yes' })).toBe(false);
    expect(endAlongSwitch({ endAlong: true })).toBe(true);
  });

  it('parses a report line and nothing else', () => {
    const line = 'End along pm_peak Colby Street SB: simulated; target 43; weight 2; offered 20.5 (static routes 12.0); after fit 38.0 (static routes 15.5); final 41.2 (static routes 16.0); 120 flows; 3 nodes (819 1071 793).';
    expect(endAlongLinesFromReport(`x\n${line}\ny`)).toEqual([{ period: 'pm_peak', label: 'Colby Street SB', membership: 'simulated', target: 43, weight: 2, offered: 20.5, staticOffered: 12, afterFit: 38, staticAfterFit: 15.5, final: 41.2, staticFinal: 16, flows: 120, nodes: [819, 1071, 793] }]);
    expect(endAlongLinesFromReport('Share pm a: simulated; target 5%;')).toEqual([]);
  });
});
