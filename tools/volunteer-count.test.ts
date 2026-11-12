import { describe, expect, it } from 'vitest';
import { assign, buildGraph, type ALink, type ANode } from './lib/assign';
import { assigned, fitToCounts, DEFAULT_FIT } from './lib/fit-counts';
import { countStations, mapBlock, mapMovement, nodeStreets, tripEnds, type CNet, type CountConfig, type CountFile } from './lib/volunteer-count';

// A small grid with invented names: Pine Street runs north-south, crossed by Alder, Birch, Cedar and Dune Streets; Ridge Road is the arterial at its south end, Summit Road at its north end.
// Node ids: 0 = Pine/Ridge, 1 = Pine/Alder, 2 = Pine/Birch, 3 = Pine/Cedar, 4 = Pine/Summit; side nodes 5.. are the other ends of the cross streets.
function grid(): CNet & { nodes: (CNet['nodes'][number] & { control: string })[]; links: (CNet['links'][number] & { speedLimit: number; reverse?: number })[] } {
  const nodes = [0, 1, 2, 3, 4].map((i) => ({ id: i, x: 0, y: i * 100, control: 'uncontrolled' }));
  const links: (CNet['links'][number] & { speedLimit: number; reverse?: number })[] = [];
  const add = (from: number, to: number, name: string, fb: number) => links.push({ id: links.length, from, to, name, class: 'residential', length: 100, fromBearing: fb, toBearing: fb, speedLimit: 11, reverse: links.length % 2 === 0 ? links.length + 1 : links.length - 1 });
  for (let i = 0; i < 4; i++) { add(i, i + 1, 'Pine Street', 0); add(i + 1, i, 'Pine Street', 180); }
  // cross streets: Ridge Road at node 0 and Summit Road at node 4 (east side nodes), Alder at 1, Birch at 2, Cedar at 3
  const cross = [[0, 'Ridge Road'], [1, 'Alder Street'], [2, 'Birch Street'], [3, 'Cedar Street'], [4, 'Summit Road']] as const;
  for (const [i, nm] of cross) {
    nodes.push({ id: 5 + i, x: 100, y: i * 100, control: 'uncontrolled' });
    add(i, 5 + i, nm, 90); add(5 + i, i, nm, 270);
  }
  return { nodes, links };
}

const cfg: CountConfig = { file: '', weight: 1, uncertainFactor: 0.25, tolerancePct: 20, minMovementVeh: 25, movementWeight: 0.5, routeWeight: 0.5, holdoutEvery: 4, fullRouteEnds: ['Ridge Road', 'Summit Road'], arterials: ['Ridge Road', 'Summit Road'], middayFromPm: true, middayWeightFactor: 0.5 };
const names = ['Ridge Road', 'Alder Street', 'Birch Street', 'Cedar Street', 'Summit Road'];
const blocks = (dir: 'NB' | 'SB', period: 'am' | 'pm', v: number[], extra: Record<number, object> = {}) => v.map((x, i) => {
  const [a, b] = dir === 'NB' ? [names[i], names[i + 1]] : [names[3 - i + 1], names[3 - i]];
  return { street: 'Pine Street', between: [a, b] as [string, string], direction: dir, toward: b, period, vehicles: x, ...(extra[i] ?? {}) };
});
const file = (): CountFile => ({
  source: { id: 'test-count' },
  blocks: [...blocks('NB', 'pm', [100, 110, 120, 130]), ...blocks('SB', 'pm', [50, 60, 70, 80]), ...blocks('NB', 'am', [40, 41, 42, 43], { 1: { uncertain: true } })],
  turningMovements: [
    { at: ['Pine Street', 'Ridge Road'], period: 'pm', from: 'Ridge Road from east', to: 'Pine Street toward north', vehicles: 60, kind: 'turnOn' },
    { at: ['Pine Street', 'Ridge Road'], period: 'pm', from: 'Ridge Road from east', to: 'Pine Street toward south', vehicles: 3 },
    { at: ['Pine Street', 'Alder Street'], period: 'pm', from: 'Pine Street from south', to: 'Pine Street toward north', vehicles: 95 },
  ],
  fullRoute: { rows: [{ street: 'Pine Street', direction: 'NB', period: 'pm', vehicles: 40 }, { street: 'Pine Street', direction: 'SB', period: 'pm', vehicles: 20 }] },
});

describe('block mapping', () => {
  const net = grid(), ns = nodeStreets(net), nodes = new Map(net.nodes.map((n) => [n.id, n]));
  it('finds the directed link by street, cross streets and bearing', () => {
    const nb = mapBlock(file().blocks[1], net, ns, nodes), sb = mapBlock(file().blocks[5], net, ns, nodes);
    expect(net.links[nb.link!]).toMatchObject({ from: 1, to: 2 });
    expect(net.links[sb.link!]).toMatchObject({ from: 3, to: 2 });
    expect(nb.approx).toBe(false);
  });
  it('reports a block with no link and says why', () => {
    const r = mapBlock({ street: 'Pine Street', between: ['Alder Street', 'Dune Street'], direction: 'NB', period: 'pm', vehicles: 5 }, net, ns, nodes);
    expect(r.link).toBeNull();
    expect(r.reason).toMatch(/no Pine Street link runs between/);
    expect(mapBlock({ street: 'Elm Street', between: ['A', 'B'], direction: 'NB', period: 'pm', vehicles: 1 }, net, ns, nodes).reason).toMatch(/no link named Elm Street/);
  });
  it('maps a turning movement to its incoming and outgoing link', () => {
    const m = mapMovement(file().turningMovements[0], net, ns, nodes);
    expect(net.links[m.a!]).toMatchObject({ name: 'Ridge Road', to: 0 });
    expect(net.links[m.b!]).toMatchObject({ name: 'Pine Street', from: 0, to: 1 });
  });
});

describe('count stations', () => {
  const net = grid();
  const run = () => countStations(file(), net, cfg, { am: 'am', pm: 'pm', midday: 'mid' }, { am: 0.85, pm: 1, mid: 0.62 });
  it('makes one station per directed link with a target per period, midday scaled from the PM count', () => {
    const { stations, report } = run();
    const blk = stations.filter((s) => s.family === 'block');
    expect(report.blocks).toMatchObject({ total: 12, mapped: 12, unmapped: [] });
    expect(blk).toHaveLength(8);
    const first = blk.find((s) => net.links[s.links[0]].from === 0 && net.links[s.links[0]].name === 'Pine Street')!;
    expect(first.target).toMatchObject({ pm: 100, am: 40 });
    expect(first.target.mid).toBeCloseTo(62, 6);
    expect(first.weightByPeriod!.mid).toBe(0.5);
  });
  it('down-weights uncertain values and never holds them out', () => {
    const { stations } = run();
    const u = stations.find((s) => s.uncertain)!;
    expect(u.weight).toBe(0.25);
    expect(u.held).toBe(false);
  });
  it('holds out every fourth block along a street and direction, deterministically, never the last of a run', () => {
    const a = run().stations.filter((s) => s.held).map((s) => s.id), b = run().stations.filter((s) => s.held).map((s) => s.id);
    expect(a).toEqual(b);
    // a run of four blocks holds out position 1 (the second); the northbound one carries an uncertain AM value and stays in the fit
    expect(a).toHaveLength(1);
    expect(net.links[Number(a[0].replace('count block ', ''))]).toMatchObject({ from: 2, to: 1 });
  });
  it('keeps turn movements of at least the minimum and leaves out small tallies and straight movements', () => {
    const mv = run().stations.filter((s) => s.family === 'movement');
    expect(mv).toHaveLength(1);
    expect(mv[0].target).toMatchObject({ pm: 60 });
  });
  it('builds whole-street route constraints between the two ends', () => {
    const rt = run().stations.filter((s) => s.family === 'route');
    expect(rt).toHaveLength(2);
    const nbRoute = rt.find((s) => s.target.pm === 40)!;
    expect(nbRoute.feature).toMatchObject({ kind: 'path' });
    if (nbRoute.feature?.kind === 'path') { expect(net.links[nbRoute.feature.first].from).toBe(0); expect(net.links[nbRoute.feature.last].to).toBe(4); }
  });
  it('implies trip ends from entries, exits and through cars', () => {
    const f = file();
    f.accessPoints = [{ at: ['Ridge Road', 'Pine Street'], side: 's', period: 'pm', in: 100 }];
    const r = countStations(f, net, cfg, { am: 'am', pm: 'pm', midday: 'mid' }, { am: 0.85, pm: 1, mid: 0.62 });
    const e = tripEnds(f, r, net, { am: 'am', pm: 'pm' });
    expect(e.pm).toMatchObject({ entries: 100, exits: 80, through: 60 });
    expect(e.pm.destinations).toBe(40);
    expect(e.pm.origins).toBe(20);
  });
});

describe('route features in the assignment', () => {
  const net = grid();
  const nodes: ANode[] = net.nodes.map((n) => ({ id: n.id, x: n.x, y: n.y, control: 'uncontrolled' }));
  const links: ALink[] = net.links.map((l) => ({ id: l.id, from: l.from, to: l.to, length: l.length, speedLimit: 11, class: 'residential' }));
  const g = buildGraph(nodes, links, [], null);
  const flows = [{ origin: 5, destination: 9 }, { origin: 0, destination: 4 }];
  const link = (a: number, b: number) => links.findIndex((l) => l.from === a && l.to === b);
  it('records the share of routes with a movement or a path', () => {
    const feats = [{ kind: 'move' as const, a: link(5, 0), b: link(0, 1) }, { kind: 'path' as const, first: link(0, 1), last: link(3, 4) }];
    const a = assign(g, flows, 1, 0, feats);
    const sh = (k: number, f: number) => { for (let i = a.feat!.start[k]; i < a.feat!.start[k + 1]; i++) if (a.feat!.id[i] === f) return a.feat!.share[i]; return 0; };
    expect(sh(0, 0)).toBe(1);
    expect(sh(0, 1)).toBe(1);
    expect(sh(1, 0)).toBe(0);
    expect(sh(1, 1)).toBe(1);
  });
  it('fits a flow to a movement count', () => {
    const feats = [{ kind: 'move' as const, a: link(5, 0), b: link(0, 1) }];
    const a = assign(g, flows, 1, 0, feats);
    const cons = [{ id: 'm', kind: 'count', label: 'm', links: [], target: 30, feature: 0 }];
    expect(assigned(a, [10, 10], cons, links.length)[0]).toBeCloseTo(10, 6);
    const r = fitToCounts(a, [10, 10], ['local', 'local'], cons, links.length, { ...DEFAULT_FIT, hi: 5, uncounted: 'one' });
    expect(r.g[0]).toBeCloseTo(3, 2);
    expect(r.g[1]).toBe(1);
  });
});
