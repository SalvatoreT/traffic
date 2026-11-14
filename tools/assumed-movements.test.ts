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
});
