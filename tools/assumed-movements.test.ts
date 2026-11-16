import { describe, expect, it } from 'vitest';
import { assignMsa, buildGraph, type ALink, type ANode } from './lib/assign';
import { assumedMovementFlows, belowMinReport, withAlternatives, type IntentCfg } from './lib/assumed-movements';
import { fitToCounts, type Constraint, type FlowType } from './lib/fit-counts';

// Two ways from O (0) to D (1): the direct arterial (links 0 and 1 through X) and a slightly longer way over Y (links 2 and 3, the movement 2 -> 3).
const nodes: ANode[] = [
  { id: 0, x: 0, y: 0, control: 'uncontrolled' }, { id: 1, x: 400, y: 0, control: 'uncontrolled' },
  { id: 2, x: 200, y: 0, control: 'uncontrolled' }, { id: 3, x: 200, y: 60, control: 'uncontrolled' },
];
const mk = (id: number, from: number, to: number): ALink => {
  const a = nodes[from], b = nodes[to];
  return { id, from, to, length: Math.hypot(b.x - a.x, b.y - a.y), speedLimit: 13.4, class: 'secondary', geometry: [[a.x, a.y], [b.x, b.y]] };
};
const links: ALink[] = [mk(0, 0, 2), mk(1, 2, 1), mk(2, 0, 3), mk(3, 3, 1)];
const cfg = { id: 'm', label: 'test movement', count: { at: [], from: '', to: '' }, maxDetour: 1.3, minFlowVehPerHour: 0.5, intents: [] as IntentCfg[] };
const oneGroup = { groupOf: (n: number) => (n === 0 ? 'north' : n === 1 ? 'fw' : 'study-area'), expand: (r: string | string[]) => (Array.isArray(r) ? r : [r]) };
const toFw = [{ id: 'a', label: 'north to freeway', fromGroup: 'north', toGroup: 'fw', share: 1, basis: 'test' }];

describe('assumed movement flows', () => {
  const g = buildGraph(nodes, links, [], null);
  it('splits the count over the candidate flows of an intent and reports the movement as through when neither end is in the study area', () => {
    const seed = [{ origin: 0, destination: 1, vehPerHour: 80 }, { origin: 1, destination: 0, vehPerHour: 80 }];
    const r = assumedMovementFlows({ ...cfg, intents: toFw }, 2, 3, 60, 'pm', seed, g, () => false, oneGroup);
    expect(r.flows).toHaveLength(1);
    expect(r.flows[0]).toMatchObject({ origin: 0, destination: 1, via: { a: 2, b: 3 } });
    expect(r.flows[0].vehPerHour).toBeCloseTo(60, 1);
    expect(r.report.throughVeh).toBeCloseTo(60, 1);
    expect(() => assumedMovementFlows(cfg, 2, 3, 60, 'pm', seed, g, () => false, oneGroup)).toThrow(/at least one intent/);
  });
  it('drops pairs whose detour exceeds the limit', () => {
    const r = assumedMovementFlows({ ...cfg, maxDetour: 1.0, intents: toFw }, 2, 3, 60, 'pm', [{ origin: 0, destination: 1, vehPerHour: 80 }], g, () => false, oneGroup);
    expect(r.flows).toHaveLength(0);
  });
  it('cuts plain flows of other pairs that make the turn on their best route to what the pinned flows leave of the count', () => {
    const seed = [{ origin: 0, destination: 1, vehPerHour: 80 }, { origin: 1, destination: 0, vehPerHour: 80 }];
    const half = assumedMovementFlows({ ...cfg, naturalDetour: 1.2, intents: [{ ...toFw[0], share: 0.5 }] }, 2, 3, 60, 'pm', seed, g, () => false, oneGroup);
    // the pair's own plain flow keeps 80 - 30 = 50, the count leaves room for 30: 20 veh/h more come off
    expect(half.carve.get(0)).toBeCloseTo(30, 2);
    expect(half.hardCarve.get(0)).toBeCloseTo(20, 2);
    expect(half.report.natural).toMatchObject({ flows: 1 });
    expect(half.report.natural!.after).toBeCloseTo(30, 2);
    const full = assumedMovementFlows({ ...cfg, naturalDetour: 1.2, intents: toFw }, 2, 3, 60, 'pm', seed, g, () => false, oneGroup);
    expect(full.report.natural!.after).toBe(0);
    expect(full.hardCarve.get(0)).toBeCloseTo(80 - (full.carve.get(0) ?? 0), 2);
  });
  it('leaves a flow alone whose best route is not through the turn (detour above the natural limit)', () => {
    const r = assumedMovementFlows({ ...cfg, intents: [{ ...toFw[0], share: 0.5 }] }, 2, 3, 60, 'pm', [{ origin: 0, destination: 1, vehPerHour: 80 }], g, () => false, oneGroup);
    expect(r.hardCarve.size).toBe(0);
  });
  it('leaves the plain flows alone when the count has room for them', () => {
    const seed = [{ origin: 0, destination: 1, vehPerHour: 10 }];
    const r = assumedMovementFlows({ ...cfg, naturalDetour: 1.2, intents: [{ ...toFw[0], share: 0.2 }] }, 2, 3, 60, 'pm', seed, g, () => false, oneGroup);
    expect(r.hardCarve.size).toBe(0);
  });
  it('reports a movement counted below the minimum as counted, with no trips assigned', () => {
    const r = belowMinReport(cfg, 'am', 20, 25);
    expect(r).toMatchObject({ target: 20, flows: 0, belowMin: 20 });
    expect(r.note).toMatch(/counted 20 veh\/h, below .* 25 veh\/h/);
  });
  it('routes a via flow through the movement in the assignment and holds its volume in the fit', () => {
    const flows = [{ origin: 0, destination: 1, via: { a: 2, b: 3 } }, { origin: 0, destination: 1 }];
    const v = [50, 50];
    const a = assignMsa(g, flows, v, { iterations: 2, drawsPerPass: 1, alpha: 0, beta: 4, dispersion: 0, capacity: new Float64Array(4).fill(Infinity) });
    const used = (k: number) => [...a.link.slice(a.start[k], a.start[k + 1])].sort();
    expect(used(0)).toEqual([2, 3]);
    expect(used(1)).toEqual([0, 1]);
    const cons: Constraint[] = [{ id: 'c', kind: 'x', label: 'x', links: [0], target: 20, weight: 1 }, { id: 'd', kind: 'x', label: 'x', links: [2], target: 20, weight: 1 }];
    const types: FlowType[] = ['through', 'through'];
    const r = fitToCounts(a, v, types, cons, 4, { lo: 0.1, hi: 3, maxIter: 100, tol: 0.01, damping: 1, uncounted: 'one', volumeWeightedMedian: true, stationary: 1e-4, softStep: 1e-3, stallWindow: 25, stallGain: 0.002, blockedShare: 0.8, band: 0, shareTol: 0.02, pinned: [1, 0] });
    expect(r.g[0]).toBe(1);
    expect(r.g[1]).toBeCloseTo(0.4, 2);
  });

  describe('intents', () => {
    // Origins 0 (group "north") and 5 (group "south"), destination 1 (group "fw") and 6 (group "west"); every pair can use the movement 2 -> 3.
    const nodes2: ANode[] = [...nodes, { id: 4, x: 200, y: -60, control: 'uncontrolled' }, { id: 5, x: -100, y: 0, control: 'uncontrolled' }, { id: 6, x: 400, y: 60, control: 'uncontrolled' }];
    const mk2 = (id: number, from: number, to: number): ALink => {
      const a = nodes2[from], b = nodes2[to];
      return { id, from, to, length: Math.hypot(b.x - a.x, b.y - a.y), speedLimit: 13.4, class: 'secondary', geometry: [[a.x, a.y], [b.x, b.y]] };
    };
    const links2: ALink[] = [mk2(0, 0, 2), mk2(1, 2, 1), mk2(2, 0, 3), mk2(3, 3, 1), mk2(4, 5, 0), mk2(5, 3, 6)];
    const g2 = buildGraph(nodes2, links2, [], null);
    const group = (n: number) => ({ 0: 'north', 5: 'south', 1: 'fw', 6: 'west' } as Record<number, string>)[n] ?? 'study-area';
    const grp = { groupOf: group, expand: (r: string | string[]) => (Array.isArray(r) ? r : [r]).flatMap((x) => (x === 'any' ? ['north', 'south'] : [x])) };
    const seed = [{ origin: 0, destination: 1, vehPerHour: 80 }, { origin: 5, destination: 1, vehPerHour: 40 }, { origin: 0, destination: 6, vehPerHour: 40 }];
    const base = { ...cfg, maxDetour: 3 };
    it('restricts candidates to flows between the groups of an intent and splits the volume by seed volume', () => {
      const intents = [{ id: 'a', label: 'north to freeway', fromGroup: 'north', toGroup: 'fw', share: 0.5, basis: 'test' }, { id: 'b', label: 'any to freeway', fromGroup: 'any', toGroup: 'fw', vehPerHour: 20, basis: 'test' }];
      const r = assumedMovementFlows({ ...base, intents }, 2, 3, 60, 'pm', seed, g2, () => false, grp);
      const by = (o: number, d: number) => r.flows.filter((f) => f.origin === o && f.destination === d).reduce((s, f) => s + f.vehPerHour, 0);
      expect(by(0, 6)).toBe(0);
      // intent a: 30 veh/h, all on 0 -> 1 (the only flow between its groups); intent b: 20 veh/h over 0 -> 1 and 5 -> 1 in proportion 80 : 40
      expect(by(0, 1)).toBeCloseTo(30 + 20 * 80 / 120, 2);
      expect(by(5, 1)).toBeCloseTo(20 * 40 / 120, 2);
      expect(r.flows.every((f) => f.via?.a === 2 && f.via?.b === 3)).toBe(true);
      expect(r.report.intents!.map((i) => i.flows)).toEqual([1, 2]);
      expect(r.report.throughVeh).toBeCloseTo(50, 2);
    });
    it('takes the assumed trips off the plain flow of the same pair, at most 80% of it', () => {
      const intents = [{ id: 'a', label: 'north to freeway', fromGroup: 'north', toGroup: 'fw', share: 1, basis: 'test' }];
      const r = assumedMovementFlows({ ...base, intents }, 2, 3, 100, 'pm', seed, g2, () => false, grp);
      expect(r.flows).toHaveLength(1);
      expect(r.flows[0].vehPerHour).toBeCloseTo(100, 2);
      expect(r.carve.get(0)).toBeCloseTo(64, 2);
    });
    it('refuses intents that add up to more than the counted movement, or that set both share and volume', () => {
      const big = [{ id: 'a', label: 'a', fromGroup: 'north', toGroup: 'fw', share: 0.7, basis: 't' }, { id: 'b', label: 'b', fromGroup: 'south', toGroup: 'fw', share: 0.5, basis: 't' }];
      expect(() => assumedMovementFlows({ ...base, intents: big }, 2, 3, 60, 'pm', seed, g2, () => false, grp)).toThrow(/more than/);
      const both = [{ id: 'a', label: 'a', fromGroup: 'north', toGroup: 'fw', share: 0.1, vehPerHour: 5, basis: 't' }];
      expect(() => assumedMovementFlows({ ...base, intents: both }, 2, 3, 60, 'pm', seed, g2, () => false, grp)).toThrow(/exactly one/);
    });
    it('takes only candidates that enter the whole-street route at its first link when the intent asks for it', () => {
      const intents = [{ id: 'a', label: 'any to freeway', fromGroup: 'any', toGroup: 'fw', share: 1, basis: 't', wholeStreet: true }];
      // link 4 (5 -> 0) is the first link of the route: only the flow from 5 reaches the movement 2 -> 3 over it
      const r = assumedMovementFlows({ ...base, intents }, 2, 3, 60, 'pm', seed, g2, () => false, grp, 1, 4);
      expect(r.flows.map((f) => [f.origin, f.destination])).toEqual([[5, 1]]);
      expect(r.flows[0].vehPerHour).toBeCloseTo(60, 2);
      const none = assumedMovementFlows({ ...base, intents }, 2, 3, 60, 'pm', seed, g2, () => false, grp, 1, 99);
      expect(none.flows).toHaveLength(0);
      expect(none.report.intents![0].note).toMatch(/whole street/);
    });
    it('scales a volume given in veh/h with the movement count of the period, and reports an intent with no candidate flow', () => {
      const intents = [{ id: 'a', label: 'a', fromGroup: 'north', toGroup: 'fw', vehPerHour: 20, basis: 't' }, { id: 'b', label: 'b', fromGroup: 'south', toGroup: 'west', share: 0.1, basis: 't' }];
      const r = assumedMovementFlows({ ...base, intents }, 2, 3, 30, 'am', seed, g2, () => false, grp, 0.5);
      expect(r.report.intents![0].assigned).toBeCloseTo(10, 2);
      expect(r.report.intents![1].note).toMatch(/no candidate flow/);
    });
  });

  describe('alternatives (ASSUMPTION)', () => {
    const grp = { groupOf: (n: number) => (n === 0 ? 'north' : n === 1 ? 'fw' : 'other'), expand: (r: string | string[]) => (Array.isArray(r) ? r : [r]) };
    const it1 = { id: 'a', label: 'a', fromGroup: 'north', toGroup: 'fw', share: 0.5, basis: 't' };
    const mvA = { cfg: { ...cfg, id: 'A', intents: [it1] }, a: 2, b: 3 };
    const mvB = { cfg: { ...cfg, id: 'B', intents: [{ ...it1, id: 'b' }] }, a: 4, b: 5 };
    const mvC = { cfg: { ...cfg, id: 'C', intents: [{ ...it1, id: 'c', fromGroup: 'south' }] }, a: 6, b: 7 };
    const flow = { origin: 0, destination: 1, vehPerHour: 10, via: { a: 2, b: 3, maxDetour: 1.3 } };
    it('lists the other movements with an intent of the same groups, in configuration order', () => {
      const r = withAlternatives([flow], mvA, [mvA, mvB, mvC], grp);
      expect(r[0].via).toEqual({ a: 2, b: 3, maxDetour: 1.3, alternatives: [{ a: 4, b: 5 }] });
    });
    it('matches on the pair when the two intents name different sets that overlap', () => {
      const g2 = { groupOf: (n: number) => (n === 0 ? 'tele' : n === 1 ? 'fw' : 'other'), expand: (r: string | string[]) => (r === 'west' ? ['tele', 'oth'] : r === 'west-other' ? ['oth'] : Array.isArray(r) ? r : [r]) };
      const mvW = { cfg: { ...cfg, id: 'W', intents: [{ ...it1, fromGroup: 'west' }] }, a: 2, b: 3 };
      const mvT = { cfg: { ...cfg, id: 'T', intents: [{ ...it1, fromGroup: 'tele' }, { ...it1, id: 'o', fromGroup: 'west-other' }] }, a: 4, b: 5 };
      expect(withAlternatives([flow], mvW, [mvW, mvT], g2)[0].via?.alternatives).toEqual([{ a: 4, b: 5 }]);
      expect(withAlternatives([flow], mvT, [mvW, mvT], g2)[0].via?.alternatives).toEqual([{ a: 2, b: 3 }]);
      expect(withAlternatives([{ ...flow, origin: 2 }], mvW, [mvW, mvT], g2)[0].via?.alternatives).toBeUndefined();
    });
    it('gives no alternative to a trip with an end in the study area', () => {
      const g3 = { groupOf: (n: number) => (n === 0 ? 'study-area' : n === 1 ? 'fw' : 'other'), expand: (r: string | string[]) => (Array.isArray(r) ? r : [r]) };
      const local = { id: 'l', label: 'l', fromGroup: 'study-area', toGroup: 'fw', share: 0.5, basis: 't' };
      const a = { cfg: { ...cfg, id: 'A', intents: [local] }, a: 2, b: 3 }, b = { cfg: { ...cfg, id: 'B', intents: [{ ...local, id: 'l2' }] }, a: 4, b: 5 };
      expect(withAlternatives([flow], a, [a, b], g3)[0].via?.alternatives).toBeUndefined();
    });
    it('leaves a flow outside the intent groups, or a movement without intents, unchanged', () => {
      expect(withAlternatives([{ ...flow, origin: 5 }], mvA, [mvA, mvB], grp)[0].via?.alternatives).toBeUndefined();
      expect(withAlternatives([flow], { ...mvA, cfg: cfg }, [mvA, mvB], grp)[0]).toBe(flow);
    });
  });
});
