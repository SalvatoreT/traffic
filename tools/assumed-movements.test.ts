import { describe, expect, it } from 'vitest';
import { assignMsa, buildGraph, type ALink, type ANode } from './lib/assign';
import { assumedMovementFlows } from './lib/assumed-movements';
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
const cfg = { id: 'm', label: 'test movement', count: { at: [], from: '', to: '' }, throughShare: 0.5, maxDetour: 1.3, minFlowVehPerHour: 0.5 };

describe('assumed movement flows', () => {
  const g = buildGraph(nodes, links, [], null);
  it('splits the count over candidate flows by detour, through and local', () => {
    const seed = [{ origin: 0, destination: 1, vehPerHour: 80 }, { origin: 1, destination: 0, vehPerHour: 80 }];
    const r = assumedMovementFlows(cfg, 2, 3, 60, 'pm', seed, g, (n) => n === 0);
    expect(r.flows).toHaveLength(1);
    expect(r.flows[0]).toMatchObject({ origin: 0, destination: 1, via: { a: 2, b: 3 } });
    // the only candidate has an end inside, so the whole volume is local and the report says so
    expect(r.flows[0].vehPerHour).toBeCloseTo(60, 1);
    expect(r.report.localVeh).toBeCloseTo(60, 1);
    expect(r.report.note).toMatch(/no through candidates/);
    const t = assumedMovementFlows(cfg, 2, 3, 60, 'pm', seed, g, () => false);
    expect(t.report.throughVeh).toBeCloseTo(60, 1);
  });
  it('drops pairs whose detour exceeds the limit', () => {
    const r = assumedMovementFlows({ ...cfg, maxDetour: 1.0 }, 2, 3, 60, 'pm', [{ origin: 0, destination: 1, vehPerHour: 80 }], g, () => false);
    expect(r.flows).toHaveLength(0);
  });
  it('routes a via flow through the movement in the assignment and holds its volume in the fit', () => {
    const flows = [{ origin: 0, destination: 1, via: { a: 2, b: 3 } }, { origin: 0, destination: 1 }];
    const v = [50, 50];
    const a = assignMsa(g, flows, v, { iterations: 2, drawsPerPass: 1, alpha: 0, beta: 4, noise: 0, capacity: new Float64Array(4).fill(Infinity) });
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
    it('scales a volume given in veh/h with the movement count of the period, and reports an intent with no candidate flow', () => {
      const intents = [{ id: 'a', label: 'a', fromGroup: 'north', toGroup: 'fw', vehPerHour: 20, basis: 't' }, { id: 'b', label: 'b', fromGroup: 'south', toGroup: 'west', share: 0.1, basis: 't' }];
      const r = assumedMovementFlows({ ...base, intents }, 2, 3, 30, 'am', seed, g2, () => false, grp, 0.5);
      expect(r.report.intents![0].assigned).toBeCloseTo(10, 2);
      expect(r.report.intents![1].note).toMatch(/no candidate flow/);
    });
  });
});
