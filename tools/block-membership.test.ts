import { describe, expect, it } from 'vitest';
import { fitPeriod, fitReport, measuredShare, type FitConfig, type Station, type ThroughMeasured } from './lib/demand-fit';
import { DEFAULT_FIT } from './lib/fit-counts';
import { assertNoWithheld, blockSwitches, checkFitReport, membershipFile, poolBlocks, shareLinesFromReport, throughLinesFromReport, type RunSet } from './lib/membership-loop';
import { routeShareTally } from './lib/share-targets';
import type { SelectOd } from './lib/through-membership';

// Round 51: through targets and select-link shares take simulated membership from the block export of `calibrate --select-od`.
// Main Street runs north through nodes 1, 2, 3 (links 1 and 2, the block). Node 10 and node 40 are freeway ends (a motorway link touches them).
const nodes = [[10, 0, -100], [1, 0, 0], [2, 0, 100], [3, 0, 200], [20, 100, 0], [40, 0, 300], [30, 100, 200], [50, 200, 0]].map(([id, x, y]) => ({ id, x, y }));
const road = (id: number, from: number, to: number, name: string, cls = 'primary') => ({ id, from, to, name, class: cls, length: 100, inStudyArea: true });
const links = [road(0, 10, 1, 'Ramp', 'motorway'), road(1, 1, 2, 'Main Street'), road(2, 2, 3, 'Main Street'), road(3, 20, 1, 'Side Street'), road(4, 3, 40, 'Exit', 'motorway'), road(5, 3, 30, 'North Street'), road(6, 20, 50, 'East Street')];
const flows = [{ origin: 10, destination: 30, vehPerHour: 100 }, { origin: 20, destination: 30, vehPerHour: 100 }, { origin: 20, destination: 40, vehPerHour: 100 }, { origin: 20, destination: 50, vehPerHour: 100 }];
const routes = [[0, 1, 2, 5], [3, 1, 2, 5], [3, 1, 2, 4], [6]];
const targets = { selectLink: [{ street: 'Main Street', direction: 'NB', from: [{ via: 'freeway', share: 0.5 }], to: [{ via: 'freeway', share: 0.5 }] }] };
// Over 2 runs: pair 10>30 had 120 of its 200 offered trips on the block, 20>30 60, 20>40 20, and 20>50 (whose static routes miss the block) 40.
const blocks: ThroughMeasured = { runs: 2, source: 'test', hits: { 'through Main Street NB': { '10>30': 120, '20>30': 60, '20>40': 20, '20>50': 40 } }, trips: { '10>30': 200, '20>30': 200, '20>40': 200, '20>50': 200 } };
const member = (stat: Float64Array) => measuredShare(stat, flows, blocks, 'through Main Street NB', 5, () => false, () => false);

function tally() {
  const t = routeShareTally(nodes, links, targets, flows, 'pm', 'pm', 3);
  routes.forEach((r, k) => t.onRoute(k, r));
  return t;
}

describe('select-link shares on simulated membership', () => {
  it('static routes: the numerator is the denominator for pairs with a freeway end and 0 for the rest', () => {
    const [from, to] = tally().constraints();
    expect([...from.ratio.flows]).toEqual([0, 1, 2]);
    expect([...from.ratio.den]).toEqual([1, 1, 1]);
    expect([...from.ratio.num]).toEqual([1, 0, 0]);
    expect([...to.ratio.num]).toEqual([0, 0, 1]);
    expect(from.simulated).toBeUndefined();
  });

  it('simulated: the denominator is each pair\'s share of trips on the block with the static fraction as a prior', () => {
    const [from] = tally().constraints((_, stat) => member(stat));
    expect(from.simulated).toBe(true);
    expect([...from.ratio.flows]).toEqual([0, 1, 2, 3]);
    expect(from.ratio.den[0]).toBeCloseTo((120 + 5) / (200 + 5), 10);
    expect(from.ratio.den[1]).toBeCloseTo((60 + 5) / 205, 10);
    expect(from.ratio.den[2]).toBeCloseTo((20 + 5) / 205, 10);
    // 20>50 misses the block in the static routes and has simulated trips on it, so it enters with its simulated share and no prior.
    expect(from.ratio.den[3]).toBeCloseTo(40 / 205, 10);
  });

  it('the numerator keeps the pairs whose origin ("from") or destination ("to") is a freeway node', () => {
    const [from, to] = tally().constraints((_, stat) => member(stat));
    expect([...from.ratio.num]).toEqual([from.ratio.den[0], 0, 0, 0]);
    expect([...to.ratio.num]).toEqual([0, 0, to.ratio.den[2], 0]);
    expect(from.ratio.num[0] / [...from.ratio.den].reduce((a, b) => a + b, 0)).toBeGreaterThan(0.4);
  });

  it('keeps the static version beside the simulated one for the report', () => {
    const [from] = tally().constraints((_, stat) => member(stat));
    expect([...from.staticRatio!.flows]).toEqual([0, 1, 2]);
    expect([...from.staticRatio!.num]).toEqual([1, 0, 0]);
  });

  it('a block without a simulated hit keeps static routes and is not marked simulated', () => {
    const specs = tally().constraints(() => undefined);
    const plain = tally().constraints();
    for (const [a, b] of specs.map((s, i) => [s, plain[i]] as const)) {
      expect(a.simulated).toBeUndefined();
      expect([...a.ratio.den]).toEqual([...b.ratio.den]);
      expect([...a.ratio.num]).toEqual([...b.ratio.num]);
    }
  });

  it('shrinks toward the static fraction when the pair has few simulated trips (prior of 5 trips)', () => {
    const few: ThroughMeasured = { runs: 1, source: 't', hits: { 'through Main Street NB': { '10>30': 0 } }, trips: { '10>30': 1 } };
    const [from] = tally().constraints((b, stat) => measuredShare(stat, flows, few, `through ${b}`, 5, () => false, () => false));
    // 0 simulated hits of 1 offered trip, static fraction 1: (0 + 5 * 1) / (1 + 5)
    expect(from.ratio.den[0]).toBeCloseTo(5 / 6, 10);
  });
});

describe('the fit with the sub-switches', () => {
  const types = ['through', 'local', 'through', 'local'] as const;
  const base: Omit<FitConfig, 'through'> = { fit: DEFAULT_FIT, draws: 1, dispersion: 0, shares: { targets, weight: 3, pmPeriod: 'pm' }, guard: { enabled: false, weight: 0, excessShare: 0, capacity: { uncontrolled: { perLane: 1000, source: 'fixture' }, motorway: { perLane: 2000, source: 'fixture' } } } };
  const tnodes = nodes.map((n) => ({ ...n, control: 'uncontrolled' }));
  const tlinks = links.map((l) => ({ ...l, speedLimit: 10 }));
  const tt = (id: string) => ({ id, label: 'Main Street NB, through cars', links: [1, 2], target: { pm: 120 }, lo: { pm: 120 }, hi: { pm: 120 }, ceiling: [], derived: [], weight: 2, basis: 'test' });
  const count: Station = { id: 'main', label: 'Main St', kind: 'count', basis: 'test', records: [], links: [1], target: { pm: 300 }, weight: 1, tolPct: 5 };
  const run = (through?: object) => fitPeriod('pm', flows, [...types], [count], tnodes, tlinks, [], { ...base, ...(through ? { through: { targets: [tt('through Main Street NB')], inStudy: new Set<number>(), priorTrips: 5, ...through } as never } : {}) });
  const measured = (extra: object = {}) => ({ pm: { runs: 2, source: 'test', hits: { 'through Main Street NB': { '10>30': 120, '20>30': 60 } }, trips: { '10>30': 200, '20>30': 200 }, blocks, ...extra } });
  const text = (r: ReturnType<typeof run>) => fitReport('t', [r], { pm: flows }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], []);

  it('without the sub-switches (rounds 48 to 50) shares stay static even when the file carries block pairs', () => {
    const none = run({ measured: undefined }), off = run({ measured: measured(), simulated: { throughTargets: false, shares: false } });
    expect(off.volume).toEqual(none.volume);
    expect(off.shareRows.every((q) => !q.simulated)).toBe(true);
    expect(off.throughRows[0].measured).toBe(false);
    expect(text(off)).not.toMatch(/^Share pm /m);
    expect(off.notes.join('\n')).not.toMatch(/select-link shares take simulated/);
  });

  it('shares: the constraint reads the simulated pairs, the report gives both versions and the note names the blocks', () => {
    const r = run({ measured: measured(), simulated: { throughTargets: false, shares: true } });
    expect(r.shareRows.map((q) => q.simulated)).toEqual([true, true]);
    const q = r.shareRows[0];
    expect(q.staticOffered).toBeCloseTo(1 / 3, 6);
    expect(q.offered).toBeGreaterThan(0.3);
    expect(q.offered).not.toBeCloseTo(q.staticOffered!, 3);
    expect(r.throughRows[0].measured).toBe(false);
    expect(r.notes.join('\n')).toMatch(/select-link shares take simulated membership \(2 runs; 2 of 2 share constraints;/);
    const lines = shareLinesFromReport(text(r));
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatchObject({ period: 'pm', membership: 'simulated', target: 50 });
    expect(lines[0].label).toBe('Main Street NB, trips from the freeway');
    expect(Number.isFinite(lines[0].final) && Number.isFinite(lines[0].staticFinal)).toBe(true);
  });

  it('through targets: the hits are used when the sub-switch is on and ignored when it is off', () => {
    const on = run({ measured: measured(), simulated: { throughTargets: true, shares: false } });
    expect(on.throughRows[0].measured).toBe(true);
    expect(on.shareRows.every((q) => !q.simulated)).toBe(true);
    expect(on.throughRows[0].offered).not.toBeCloseTo(on.throughRows[0].staticOffered, 3);
    const off = run({ measured: measured(), simulated: { throughTargets: false, shares: true } });
    expect(off.throughRows[0].offered).toBeCloseTo(off.throughRows[0].staticOffered, 6);
    const lines = throughLinesFromReport(text(on));
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ period: 'pm', membership: 'simulated', target: 120 });
    expect(on.notes.join('\n')).toMatch(/through targets take simulated membership \(2 runs; 1 of 1 targets/);
  });

  it('a block with no simulated hit stays static and is listed in the note', () => {
    const empty = { ...blocks, hits: {}, zeroHit: ['Main Street NB'] };
    const r = run({ measured: measured({ blocks: empty }), simulated: { throughTargets: false, shares: true } });
    expect(r.shareRows.every((q) => !q.simulated)).toBe(true);
    expect(r.notes.join('\n')).toMatch(/0 of 2 share constraints;.*keep static routes: Main Street NB, trips from the freeway, Main Street NB, trips to the freeway/);
  });

  it('the static fit that anchors the ceilings ignores the block pairs', () => {
    const a = run({ measured: measured(), simulated: { throughTargets: true, shares: true } });
    expect(a.shareRows[0].simulated).toBe(true);
    const anchor = fitPeriod('pm', flows, [...types], [count], tnodes, tlinks, [], { ...base, through: { targets: [tt('through Main Street NB')], inStudy: new Set<number>(), priorTrips: 5, simulated: { throughTargets: true, shares: true } } });
    expect(anchor.shareRows.every((q) => !q.simulated)).toBe(true);
    expect(anchor.throughRows[0].measured).toBe(false);
  });
});

const sod = (seed: number, blocksIn: SelectOd['blocks'], minutes = 60): SelectOd => ({ period: 'pm_peak', seed, minutes, blocks: blocksIn, stationCountVersion: 2 });
const runSet = (label: string, n: number, blocksIn: SelectOd['blocks']): RunSet => ({ label, flows: [{ origin: 1, destination: 2, vehPerHour: 100 }, { origin: 3, destination: 4, vehPerHour: 50 }, { origin: 5, destination: 6, vehPerHour: 30 }], sod: Array.from({ length: n }, (_, i) => sod(i + 1, blocksIn)) });
const blockOf = (label: string, trips: [number, number, number][]) => ({ label, links: [1], trips });

describe('pooling the block export', () => {
  const b = [blockOf('Main Street NB', [[1, 2, 10], [3, 4, 5], [5, 6, 2]]), blockOf('Quiet Street SB', [])];
  it('equal-weight pool over iterations, hits summed over runs and offered trips as station pooling does', () => {
    const p = poolBlocks([runSet('i0', 2, b), runSet('i1', 2, b)], new Set());
    expect(p.measured.runs).toBe(4);
    expect(p.measured.hits['through Main Street NB']['1>2']).toBe(40);
    expect(p.measured.trips['1>2']).toBe(400);
    expect(p.measured.hits['through Main Street NB']['1>2'] / p.measured.trips['1>2']).toBeCloseTo(0.1, 10);
  });
  it('the through pool leaves out trips with an end in the study area, the share pool does not', () => {
    const through = poolBlocks([runSet('i0', 2, b), runSet('i1', 2, b)], new Set([3]));
    expect(Object.keys(through.measured.hits['through Main Street NB']).sort()).toEqual(['1>2', '5>6']);
    expect(through.measured.trips['3>4']).toBeUndefined();
    const shares = poolBlocks([runSet('i0', 2, b), runSet('i1', 2, b)], new Set());
    expect(Object.keys(shares.measured.hits['through Main Street NB']).sort()).toEqual(['1>2', '3>4', '5>6']);
  });
  it('lists a block with no counted trip, writes nothing for it, and lists a block whose trips are all filtered', () => {
    const p = poolBlocks([runSet('i0', 2, b), runSet('i1', 2, b)], new Set());
    expect(p.zeroHit).toEqual(['Quiet Street SB']);
    expect(p.measured.hits['through Quiet Street SB']).toBeUndefined();
    const only = [blockOf('Study Street NB', [[3, 4, 5]])];
    const q = poolBlocks([runSet('i0', 2, only), runSet('i1', 2, only)], new Set([3]));
    expect(q.zeroHit).toEqual(['Study Street NB']);
    expect(q.measured.hits).toEqual({});
    expect(q.measured.trips).toEqual({});
  });
  it('refuses runs without a block export, unequal iterations and a single seed', () => {
    expect(() => poolBlocks([{ ...runSet('i0', 2, b), sod: [{ ...sod(1, b), blocks: undefined as never }, sod(2, b)] }, runSet('i1', 2, b)], new Set())).toThrow(/no block export/);
    expect(() => poolBlocks([runSet('i0', 2, b), runSet('i1', 3, b)], new Set())).toThrow(/same number of seeds/);
  });
});

describe('the membership file', () => {
  const pooled = (extra: object = {}) => ({ measured: { runs: 2, source: 's', hits: { a: { '1>2': 3 } }, trips: { '1>2': 9 } }, zeroHit: [], absent: [], dropped: [], ...extra });
  const through = { measured: { runs: 4, source: 't', hits: { 'through Main Street NB': { '1>2': 40 } }, trips: { '1>2': 400 } }, zeroHit: ['Quiet Street SB'] };
  const blocksPool = { measured: { runs: 4, source: 't', hits: { 'through Main Street NB': { '1>2': 40, '3>4': 20 } }, trips: { '1>2': 400, '3>4': 200 } }, zeroHit: ['Quiet Street SB'] };
  const input = (v: object) => ({ area: 'a', networkId: 'n', evidence: {} as never, setups: {}, periods: { pm_peak: v as never }, iterations: 2, view: 'training' });
  it('switches absent: the period keeps the empty top level of rounds 48 to 50', () => {
    const f = membershipFile(input(pooled())) as { periods: Record<string, Record<string, unknown>> };
    expect(f.periods.pm_peak).toEqual({ runs: 0, source: '', hits: {}, trips: {}, stations: { runs: 2, source: 's', hits: { a: { '1>2': 3 } }, trips: { '1>2': 9 }, zeroHit: [] } });
  });
  it('through hits fill the period level the fit reads, and the block pairs go under blocks', () => {
    const f = membershipFile(input(pooled({ through, blocks: blocksPool }))) as { periods: Record<string, any> };
    const p = f.periods.pm_peak;
    expect(p.runs).toBe(4);
    expect(p.hits['through Main Street NB']).toEqual({ '1>2': 40 });
    expect(p.trips).toEqual({ '1>2': 400 });
    expect(p.throughZeroHit).toEqual(['Quiet Street SB']);
    expect(p.blocks.hits['through Main Street NB']).toEqual({ '1>2': 40, '3>4': 20 });
    expect(p.blocks.zeroHit).toEqual(['Quiet Street SB']);
    expect(p.stations.hits.a).toBeDefined();
  });
  it('the leak guard also reads the through and block entries', () => {
    const ok = membershipFile(input(pooled({ through, blocks: blocksPool }))) as never;
    expect(() => assertNoWithheld(ok, new Set(['count block 9']))).not.toThrow();
    const bad = membershipFile(input(pooled({ through: { ...through, measured: { ...through.measured, hits: { 'count block 9': { '1>2': 1 } } } }, blocks: blocksPool }))) as never;
    expect(() => assertNoWithheld(bad, new Set(['count block 9']))).toThrow(/withheld/);
    const bad2 = membershipFile(input(pooled({ blocks: { ...blocksPool, zeroHit: ['count block 9'] } }))) as never;
    expect(() => assertNoWithheld(bad2, new Set(['count block 9']))).toThrow(/withheld/);
  });
  it('reads the sub-switches only when they are true', () => {
    expect(blockSwitches(undefined)).toEqual({ throughTargets: false, shares: false });
    expect(blockSwitches({ throughTargets: true })).toEqual({ throughTargets: true, shares: false });
    expect(blockSwitches({ throughTargets: 'yes', shares: true })).toEqual({ throughTargets: false, shares: true });
  });
});

describe('fit report check and report lines of the sub-switches', () => {
  const head = '- Simulated membership from target/m.json (shipped view)\n- pm_peak: stations whose membership comes from simulated trips (20 runs; 2 of 8 fitted stations; their assigned volumes in the station tables use it): a, b\n';
  const base = { view: 'shipped', file: 'target/m.json', runs: { pm_peak: 20 }, minStations: { pm_peak: 2 } };
  const note = (runs: number, n: number) => `- pm_peak: select-link shares take simulated membership (${runs} runs; ${n} of 2 share constraints; blocks without a simulated trip keep static routes)\n`;
  it('needs the shares note when the file has simulated block trips, with the run count', () => {
    expect(checkFitReport(head + note(20, 2), { ...base, blocks: { pm_peak: { runs: 20, blocks: 1 } } }).problems).toEqual([]);
    expect(checkFitReport(head, { ...base, blocks: { pm_peak: { runs: 20, blocks: 1 } } }).problems.join(' ')).toMatch(/no "select-link shares take simulated membership" note/);
    expect(checkFitReport(head + note(10, 2), { ...base, blocks: { pm_peak: { runs: 20, blocks: 1 } } }).problems.join(' ')).toMatch(/pooled 10 runs, expected 20/);
    expect(checkFitReport(head + note(20, 0), { ...base, blocks: { pm_peak: { runs: 20, blocks: 1 } } }).problems.join(' ')).toMatch(/no share constraint took simulated membership/);
    expect(checkFitReport(head + note(20, 0), { ...base, blocks: { pm_peak: { runs: 20, blocks: 0 } } }).problems).toEqual([]);
  });
  it('without the option the check is the round 48 check', () => {
    expect(checkFitReport(head, base).problems).toEqual([]);
  });
  it('parses the share and through lines and reads nothing from a round 50 report', () => {
    const t = 'Share pm_peak Hillegass Avenue SB, trips to the freeway: simulated; target 68%; offered 40% (35%); final 52% (48%); 210 flows.\nShare am_peak Colby Street SB, trips to the freeway: static; target 45%; offered n/a (n/a); final n/a (n/a); 0 flows.\nThrough target pm_peak Colby Street NB, through cars (A to B): simulated; target 90; offered 70 (static routes 60); final 88 (static routes 75).\n';
    expect(shareLinesFromReport(t)).toEqual([
      { period: 'pm_peak', label: 'Hillegass Avenue SB, trips to the freeway', membership: 'simulated', target: 68, offered: 40, staticOffered: 35, final: 52, staticFinal: 48, flows: 210 },
      { period: 'am_peak', label: 'Colby Street SB, trips to the freeway', membership: 'static', target: 45, offered: NaN, staticOffered: NaN, final: NaN, staticFinal: NaN, flows: 0 },
    ]);
    expect(throughLinesFromReport(t)).toEqual([{ period: 'pm_peak', label: 'Colby Street NB, through cars (A to B)', membership: 'simulated', target: 90, offered: 70, staticOffered: 60, final: 88, staticFinal: 75 }]);
    expect(shareLinesFromReport('| pm_peak | x | 1% |\n')).toEqual([]);
  });
});
