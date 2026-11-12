import { describe, expect, it } from 'vitest';
import { assign, buildGraph, linkVolumes, type ALink, type ANode } from './lib/assign';
import { assigned, capacityGuard, DEFAULT_FIT, fitToCounts, type Constraint, type FlowType } from './lib/fit-counts';

// Toy cross: west gate W(0), center C(1), east gate E(2), north gate N(3), 500 m legs on residential-free arterials (secondary, 13.4 m/s).
const nodes: ANode[] = [
  { id: 0, x: -500, y: 0, control: 'uncontrolled' }, { id: 1, x: 0, y: 0, control: 'uncontrolled' },
  { id: 2, x: 500, y: 0, control: 'uncontrolled' }, { id: 3, x: 0, y: 500, control: 'uncontrolled' },
];
const mk = (id: number, from: number, to: number, cls = 'secondary', limit = 13.4): ALink => {
  const a = nodes[from], b = nodes[to];
  return { id, from, to, length: Math.hypot(b.x - a.x, b.y - a.y), speedLimit: limit, class: cls, geometry: [[a.x, a.y], [b.x, b.y]] };
};
// ids: 0 W>C, 1 C>W, 2 C>E, 3 E>C, 4 N>C, 5 C>N
const links: ALink[] = [mk(0, 0, 1), mk(1, 1, 0), mk(2, 1, 2), mk(3, 2, 1), mk(4, 3, 1), mk(5, 1, 3)];

describe('static assignment', () => {
  it('routes through the center and respects one-way links', () => {
    const g = buildGraph(nodes, links, [], null);
    const a = assign(g, [{ origin: 0, destination: 2 }, { origin: 3, destination: 0 }]);
    expect([...a.link.slice(a.start[0], a.start[1])].sort()).toEqual([0, 2]);
    expect([...a.link.slice(a.start[1], a.start[2])].sort()).toEqual([1, 4]);
    // remove C>E: E becomes unreachable
    const g2 = buildGraph(nodes, links.filter((l) => l.id !== 2), [], null);
    expect(assign(g2, [{ origin: 0, destination: 2 }]).routable[0]).toBe(0);
  });

  it('honors turn bans for the period they apply to', () => {
    const ban = [{ from: 0, to: 2, periods: ['pm'] }];
    const path = (period: string) => { const a = assign(buildGraph(nodes, links, ban, period), [{ origin: 0, destination: 2 }]); return [...a.link.slice(a.start[0], a.start[1])].sort(); };
    expect(path('am')).toEqual([0, 2]);
    // banned in the PM: the only way is the dead-end turn-around at the north gate
    expect(path('pm')).toEqual([0, 2, 4, 5]);
  });

  it('prefers the arterial over a shorter residential route (class weight) and the left-turn penalty counts', () => {
    // A (0,0) -> B (1000,0): direct residential 1000 m at 11.18 m/s weight 1.25 = 111.8 s; detour on a secondary road 1100 m at 13.4 = 82 s + turns
    const ns: ANode[] = [{ id: 0, x: 0, y: 0, control: 'uncontrolled' }, { id: 1, x: 1000, y: 0, control: 'uncontrolled' }, { id: 2, x: 500, y: 50, control: 'uncontrolled' }];
    const L = (id: number, f: number, t: number, cls: string, lim: number, geom: [number, number][]): ALink => ({ id, from: f, to: t, length: geom.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - geom[i - 1][0], p[1] - geom[i - 1][1]) : 0), 0), speedLimit: lim, class: cls, geometry: geom });
    const ls = [L(0, 0, 1, 'residential', 11.18, [[0, 0], [1000, 0]]), L(1, 0, 2, 'secondary', 13.4, [[0, 0], [500, 50]]), L(2, 2, 1, 'secondary', 13.4, [[500, 50], [1000, 0]])];
    const a = assign(buildGraph(ns, ls, [], null), [{ origin: 0, destination: 1 }]);
    expect([...a.link.slice(a.start[0], a.start[1])].sort()).toEqual([1, 2]);
    // at equal class and speed the direct link is shorter and wins
    const a2 = assign(buildGraph(ns, ls.map((l) => ({ ...l, class: 'secondary', speedLimit: 13.4 })), [], null), [{ origin: 0, destination: 1 }]);
    expect([...a2.link.slice(a2.start[0], a2.start[1])]).toEqual([0]);
  });

  it('splits a flow over perturbed draws when two routes are equal', () => {
    const ns: ANode[] = [{ id: 0, x: 0, y: 0, control: 'uncontrolled' }, { id: 1, x: 500, y: 100, control: 'uncontrolled' }, { id: 2, x: 500, y: -100, control: 'uncontrolled' }, { id: 3, x: 1000, y: 0, control: 'uncontrolled' }];
    const e = (id: number, f: number, t: number): ALink => ({ id, from: f, to: t, length: Math.hypot(ns[t].x - ns[f].x, ns[t].y - ns[f].y), speedLimit: 13, class: 'secondary', geometry: [[ns[f].x, ns[f].y], [ns[t].x, ns[t].y]] });
    const ls = [e(0, 0, 1), e(1, 1, 3), e(2, 0, 2), e(3, 2, 3)];
    const a = assign(buildGraph(ns, ls, [], null), [{ origin: 0, destination: 3 }], 40, 0.08);
    const v = linkVolumes(a, [100], 4);
    expect(v[0] + v[2]).toBeCloseTo(100, 6);
    expect(v[0]).toBeGreaterThan(20);
    expect(v[2]).toBeGreaterThan(20);
  });
});

describe('count fitting', () => {
  const g = buildGraph(nodes, links, [], null);
  // f0 W>E, f1 N>E, f2 W>N, f3 N>W (uncounted: uses N>C and C>W only)
  const od = [{ origin: 0, destination: 2 }, { origin: 3, destination: 2 }, { origin: 0, destination: 3 }, { origin: 3, destination: 0 }];
  const a = assign(g, od);
  const v0 = [100, 100, 100, 100];
  const types: FlowType[] = ['through', 'through', 'through', 'through'];
  // stations: C>E (links index 2) carries f0+f1; W>C (index 0) carries f0+f2
  const cons: Constraint[] = [
    { id: 'east', kind: 'tmc', label: 'C>E', links: [2], target: 150 },
    { id: 'west', kind: 'tmc', label: 'W>C', links: [0], target: 250 },
  ];

  it('converges to two consistent station targets', () => {
    const r = fitToCounts(a, v0, types, cons, 6, { ...DEFAULT_FIT, tol: 1e-6 });
    expect(r.converged).toBe(true);
    const f = v0.map((v, k) => v * r.g[k]);
    const A = assigned(a, f, cons, 6);
    expect(A[0]).toBeCloseTo(150, 0);
    expect(A[1]).toBeCloseTo(250, 0);
    expect(r.atLo + r.atHi).toBe(0);
    // N>W touches no station: it takes the median factor of the counted through flows
    expect(r.counted[3]).toBe(0);
    expect(r.g[3]).toBeCloseTo(r.medians.through, 9);
  });

  it('stops at the per-flow bounds and reports how many flows hit them', () => {
    const hi = fitToCounts(a, v0, types, [{ id: 'big', kind: 'tmc', label: 'C>E', links: [2], target: 2000 }], 6, { ...DEFAULT_FIT, hi: 3 });
    expect(hi.maxLogErr).toBeGreaterThan(1); // 2000 asked, 600 reachable
    expect(hi.atHi).toBe(2);
    expect(hi.g[0]).toBeCloseTo(3, 9);
    const lo = fitToCounts(a, v0, types, [{ id: 'small', kind: 'tmc', label: 'C>E', links: [2], target: 5 }], 6, { ...DEFAULT_FIT, lo: 0.1 });
    expect(lo.atLo).toBe(2);
    expect(lo.g[1]).toBeCloseTo(0.1, 9);
  });

  it('takes the geometric mean when counted links on one path disagree', () => {
    // f0 crosses both stations: east asks 2x, west asks 0.5x; f0 stays near 1 while f1 (east only) and f2 (west only) move fully
    const c2: Constraint[] = [
      { id: 'east', kind: 'tmc', label: '', links: [2], target: 400 },
      { id: 'west', kind: 'tmc', label: '', links: [0], target: 100 },
    ];
    const r = fitToCounts(a, v0, types, c2, 6, { ...DEFAULT_FIT, maxIter: 1 });
    expect(r.g[0]).toBeCloseTo(1, 6);
    expect(r.g[1]).toBeCloseTo(2, 6);
    expect(r.g[2]).toBeCloseTo(0.5, 6);
  });

  it('reports a station no flow crosses', () => {
    const r = fitToCounts(a, v0, types, [{ id: 'none', kind: 'tmc', label: '', links: [3], target: 50 }, ...cons], 6);
    expect(r.unreachable).toContain('none');
  });

  it('can leave uncounted flows at 1', () => {
    const r = fitToCounts(a, v0, types, cons, 6, { ...DEFAULT_FIT, uncounted: 'one' });
    expect(r.g[3]).toBe(1);
  });
});

describe('capacity guard', () => {
  const g = buildGraph(nodes, links, [], null);
  const a = assign(g, [{ origin: 0, destination: 2 }, { origin: 3, destination: 2 }, { origin: 0, destination: 3 }]);
  it('scales the flows on an over-capacity link down proportionally and leaves exempt links alone', () => {
    const limit = new Float64Array(6).fill(Infinity);
    limit[2] = 110; // C>E carries f0 + f1 = 200 starting
    const r = capacityGuard(a, [100, 100, 100], limit, 6);
    expect(r.bound).toHaveLength(1);
    expect(r.bound[0].link).toBe(2);
    expect(r.m[0]).toBeCloseTo(0.55, 6);
    expect(r.m[1]).toBeCloseTo(0.55, 6);
    expect(r.m[2]).toBe(1);
    expect(r.bound[0].after).toBeCloseTo(110, 6);
    const exempt = new Float64Array(6).fill(Infinity);
    expect(capacityGuard(a, [100, 100, 100], exempt, 6).bound).toHaveLength(0);
  });
});

describe('guard inside the fit', () => {
  const g = buildGraph(nodes, links, [], null);
  const od = [{ origin: 0, destination: 2 }, { origin: 3, destination: 2 }, { origin: 3, destination: 0 }];
  const a = assign(g, od);
  const v0 = [100, 100, 100];
  const types: FlowType[] = ['through', 'through', 'through'];
  const limit = new Float64Array(6).fill(Infinity);
  limit[2] = 110; // C>E: f0 + f1

  it('keeps an uncounted link under its limit by scaling the flows that touch no count', () => {
    // a count on W>C (f0 only) is met; f1 (N>C>E) and f2 (N>C>W) touch only the guarded link or nothing
    const cons: Constraint[] = [{ id: 'west', kind: 'tmc', label: '', links: [0], target: 100 }];
    const r = fitToCounts(a, v0, types, cons, 6, { ...DEFAULT_FIT, tol: 1e-6 }, undefined, { limit, weight: 0.5 });
    const f = v0.map((v, k) => v * r.g[k]);
    expect(assigned(a, f, cons, 6)[0]).toBeCloseTo(100, 0);
    expect(f[0] + f[1]).toBeLessThanOrEqual(110.5);
  });

  it('lets a count win when it conflicts with the guard', () => {
    // the count on C>E asks 300 through a link the guard limits to 110: the weighted mean tilts to the count but cannot reach it
    const cons: Constraint[] = [{ id: 'east', kind: 'tmc', label: '', links: [2], target: 300 }];
    const lim = new Float64Array(6).fill(Infinity);
    lim[5] = 60; // an uncounted link on f0? no: C>N is used by nobody here; the guard on W>C hits f0 (a counted flow)
    lim[0] = 110;
    const r = fitToCounts(a, v0, types, cons, 6, { ...DEFAULT_FIT, tol: 1e-6 }, undefined, { limit: lim, weight: 0.5 });
    const f = v0.map((v, k) => v * r.g[k]);
    const east = f[0] + f[1];
    expect(east).toBeGreaterThan(200); // far above what a weight-1 guard would allow (110 on f0 alone)
    expect(f[0]).toBeGreaterThan(110); // the guarded link is exceeded: the count won
  });
});

describe('gate counts by origin and destination', () => {
  it('fits generated and absorbed volume regardless of transit through the gate node', () => {
    const g = buildGraph(nodes, links, [], null);
    const od = [{ origin: 0, destination: 2 }, { origin: 3, destination: 2 }, { origin: 0, destination: 3 }];
    const a = assign(g, od);
    const cons: Constraint[] = [
      { id: 'in-W', kind: 'gate', label: '', links: [], origins: [0], target: 300 },
      { id: 'out-E', kind: 'gate', label: '', links: [], destinations: [2], target: 100 },
    ];
    const r = fitToCounts(a, [100, 100, 100], ['through', 'through', 'through'], cons, 6, { ...DEFAULT_FIT, tol: 1e-6, hi: 10 });
    const f = [100, 100, 100].map((v, k) => v * r.g[k]);
    const A = assigned(a, f, cons, 6);
    expect(A[0]).toBeCloseTo(300, 2);
    expect(A[1]).toBeCloseTo(100, 2);
  });
});
