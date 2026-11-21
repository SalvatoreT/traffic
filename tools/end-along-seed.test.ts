import { describe, expect, it } from 'vitest';
import { fitPeriod, fitReport, type FitConfig, type FlowIn, type Station } from './lib/demand-fit';
import { SEED_TAKE_SHARE, seedEndAlong } from './lib/end-along-seed';
import { DEFAULT_FIT, type FlowType } from './lib/fit-counts';
import { endSeedLinesFromReport, seedPairsSwitch } from './lib/membership-loop';
import { pooledMembership } from './lib/through-membership';

// Round 53 D8: seeding pairs that end along a counted street. Main Street runs north through nodes 1, 2, 3 and 4 (links 1, 2, 3); interior nodes are 2 and 3.
// Flow A (20>40) drives the whole street, so origin 20 loads the first block; B (20>2) and C (10>3) already end along it; D (20>50) never touches it.
const nodes = [[10, 0, -100], [1, 0, 0], [2, 0, 100], [3, 0, 200], [4, 0, 300], [20, 100, 0], [40, 0, 400], [50, 200, 0], [60, 100, 400]].map(([id, x, y]) => ({ id, x, y, control: 'uncontrolled' }));
const road = (id: number, from: number, to: number, name: string, cls = 'primary') => ({ id, from, to, name, class: cls, length: 100, speedLimit: 10, inStudyArea: true });
const links = [road(0, 10, 1, 'Ramp Road'), road(1, 1, 2, 'Main Street'), road(2, 2, 3, 'Main Street'), road(3, 3, 4, 'Main Street'), road(4, 4, 40, 'Exit Road'), road(5, 20, 1, 'Side Street'), road(6, 20, 50, 'East Street'), road(7, 50, 3, 'East Street'), road(8, 50, 2, 'East Street')];
const flows0 = (): FlowIn[] => [{ origin: 20, destination: 40, vehPerHour: 100 }, { origin: 20, destination: 2, vehPerHour: 10 }, { origin: 10, destination: 3, vehPerHour: 30 }, { origin: 20, destination: 50, vehPerHour: 100 }, { origin: 20, destination: 3, vehPerHour: 30 }, { origin: 50, destination: 2, vehPerHour: 30 }];
const types0: FlowType[] = ['through', 'local', 'local', 'through', 'local', 'local'];
const targetsFile = (end: number) => ({ selectLink: [{ street: 'Main Street', direction: 'NB', endAlongVehPerHour: { pm: end }, from: [{ via: 'freeway', share: 0.5 }], to: [{ via: 'freeway', share: 0.5 }] }] });
const blocks = (hits: Record<string, number> | undefined) => ({ runs: 2, source: 'test', hits: hits ? { 'through Main Street NB': hits } : {}, trips: { '20>40': 200, '20>2': 20, '10>3': 60 } });
const base = (end: number, seed = true, skip: string[] = [], hits: Record<string, number> | undefined = { '20>40': 200, '20>2': 20, '10>3': 60 }): FitConfig => ({
  fit: DEFAULT_FIT, draws: 1, dispersion: 0, shares: { targets: targetsFile(end), weight: 3, pmPeriod: 'pm' },
  guard: { enabled: false, weight: 0, excessShare: 0, capacity: { uncontrolled: { perLane: 1000, source: 'fixture' } } },
  through: { targets: [], inStudy: new Set<number>(), measured: { pm: { runs: 2, source: 'test', hits: {}, trips: {}, blocks: blocks(hits) } }, priorTrips: 5, measuredStations: 'all', simulated: { throughTargets: false, shares: true, endAlong: { weight: 2, skip, ...(seed ? { seedPairs: true, seeded: {} } : {}) } } } as never,
});
const typeOf = (o: number, d: number): FlowType => (o === 10 || d === 10 ? 'ramp' : 'local');
const seed = (end: number, o: { seed?: boolean; skip?: string[]; hits?: Record<string, number> } = {}) => seedEndAlong('pm', flows0(), [...types0], nodes, links as never, [], base(end, o.seed ?? true, o.skip ?? [], o.hits), typeOf);
const destTotals = (f: FlowIn[]) => { const m = new Map<number, number>(); for (const x of f) m.set(x.destination, (m.get(x.destination) ?? 0) + x.vehPerHour); return m; };

describe('seeding pairs that end along a street', () => {
  it('shortfall arithmetic: the run starts at its target on static routes', () => {
    const r = seed(70)!;
    const row = r.rows[0];
    expect(row.before).toBeCloseTo(40, 6);
    expect(row.shortfall).toBeCloseTo(30, 6);
    expect(row.capped).toBe(0);
    expect(row.after).toBeCloseTo(70, 3);
    expect(row.added).toBeGreaterThan(0);
    expect(row.pairs).toBeGreaterThan(0);
  });

  it('keeps every node\'s destination total', () => {
    const r = seed(100)!;
    const a = destTotals(flows0()), b = destTotals(r.flows);
    for (const d of [2, 3, 40, 50]) expect(b.get(d)!).toBeCloseTo(a.get(d)!, 9);
    for (const n of r.rows[0].nodes) expect(n.after).toBeCloseTo(n.before, 9);
    expect(r.flows.reduce((x, f) => x + f.vehPerHour, 0)).toBeCloseTo(300, 9);
  });

  it('new pairs come from origins that load the first block, end at interior non-gate nodes, and are listed as new', () => {
    const r = seed(100)!;
    const fresh = r.flows.slice(6);
    expect(fresh.length).toBeGreaterThan(0);
    expect(r.types).toHaveLength(r.flows.length);
    for (const f of fresh) { expect([2, 3]).toContain(f.destination); expect([10, 20]).toContain(f.origin); expect(r.keys.has(`${f.origin}>${f.destination}`)).toBe(true); }
    expect(r.keys.has('20>2')).toBe(false);
  });

  it('caps the addition at the share of the node\'s other inbound volume and reports it', () => {
    const r = seed(10000)!;
    const row = r.rows[0];
    expect(row.capped).toBeGreaterThan(0);
    for (const n of row.nodes) expect(n.added).toBeLessThanOrEqual(SEED_TAKE_SHARE * (n.node === 2 ? 40 : 60) + 1e-9);
    expect(row.after).toBeLessThan(10000);
    for (const n of row.nodes) expect(n.after).toBeCloseTo(n.before, 9);
  });

  it('does nothing when the table already meets the target, or when there is no run, figure or block pairs', () => {
    const r = seed(30)!;
    expect(r.rows[0]).toMatchObject({ added: 0, pairs: 0 });
    expect(r.flows).toEqual(flows0());
    expect(seed(100, { skip: ['Main Street NB'] })).toBeUndefined();
    expect(seed(100, { seed: false })).toBeUndefined();
    expect(seedEndAlong('pm', flows0(), [...types0], nodes, links as never, [], { ...base(100), through: { ...base(100).through!, measured: undefined } }, typeOf)).toBeUndefined();
    expect(seedEndAlong('am', flows0(), [...types0], nodes, links as never, [], base(100), typeOf)).toBeUndefined();
  });

  it('does not touch the caller\'s flows', () => {
    const f = flows0();
    seedEndAlong('pm', f, [...types0], nodes, links as never, [], base(100), typeOf);
    expect(f).toEqual(flows0());
  });

  it('a seeded pair that no simulated run contains keeps its static membership in the fit; the table without the switch is the same table', () => {
    const cfg = base(100);
    const r = seedEndAlong('pm', flows0(), [...types0], nodes, links as never, [], cfg, typeOf)!;
    cfg.through!.simulated!.endAlong!.seeded!.pm = r.keys;
    const count: Station = { id: 'main', label: 'Main St', kind: 'count', basis: 'test', records: [], links: [1], target: { pm: 400 }, weight: 1, tolPct: 5 };
    const fit = fitPeriod('pm', r.flows, r.types, [count], nodes, links, [], cfg);
    const row = fit.endRows![0];
    expect(row.offered).toBeGreaterThan(40);
    expect(row.staticOffered).toBeGreaterThan(80);
    const text = fitReport('t', [{ ...fit, endSeed: r.rows }], { pm: r.flows }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], []);
    const lines = endSeedLinesFromReport(text);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ period: 'pm', label: 'Main Street NB', target: 100 });
    expect(lines[0].added).toBeCloseTo(r.rows[0].added, 0);
    expect(text).toMatch(/## End-along seeding \(round 53, D8; ASSUMPTION/);
    expect(text).toMatch(/End along seed nodes pm Main Street NB: 2 .* to .*, 3 /);
    const off = fitPeriod('pm', flows0(), [...types0], [count], nodes, links, [], base(100, false));
    expect(text).not.toBe(fitReport('t', [off], { pm: flows0() }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], []));
    expect(fitReport('t', [off], { pm: flows0() }, { fit: DEFAULT_FIT, draws: 1, dispersion: 0, guardExcess: 0, guardWeight: 0, guardOn: false, tolOk: 15 }, [], [])).not.toMatch(/End-along seeding|End along seed/);
  });

  it('switch absent: the fit gives the same volumes as without the seed key', () => {
    const count: Station = { id: 'main', label: 'Main St', kind: 'count', basis: 'test', records: [], links: [1], target: { pm: 400 }, weight: 1, tolPct: 5 };
    const a = fitPeriod('pm', flows0(), [...types0], [count], nodes, links, [], base(100, false));
    const noKey = base(100, false); delete (noKey.through!.simulated!.endAlong as { seeded?: unknown }).seeded;
    const b = fitPeriod('pm', flows0(), [...types0], [count], nodes, links, [], noKey);
    expect(a.volume).toEqual(b.volume);
    expect(a.endSeed).toBeUndefined();
  });

  it('pooling: a pair that exists only in a later pass has its trips counted only from that pass', () => {
    const sod = (seed: number, n: number) => ({ period: 'pm', seed, minutes: 60, blocks: [{ label: 'Main Street NB', links: [1], trips: [[20, 2, n] as [number, number, number]] }] });
    const pool = pooledMembership([
      { label: 'i0', flows: [{ origin: 20, destination: 50, vehPerHour: 5 }], sod: [sod(1, 0), sod(2, 0)] },
      { label: 'i1', flows: [{ origin: 20, destination: 2, vehPerHour: 20 }], sod: [sod(1, 20), sod(2, 20)] },
    ], new Set());
    expect(pool.trips['20>2']).toBe(40);
    expect(pool.hits['through Main Street NB']['20>2']).toBe(40);
  });

  it('reads the switch only when it is true', () => {
    expect(seedPairsSwitch(undefined)).toBe(false);
    expect(seedPairsSwitch({ seedPairs: 'yes' })).toBe(false);
    expect(seedPairsSwitch({ seedPairs: true })).toBe(true);
  });
});
