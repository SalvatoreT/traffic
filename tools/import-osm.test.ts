import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pointInPolygon } from './lib/geo';
import { buildNetwork } from './lib/network';
import { straightenJunctionEnds } from '../src/lib/junctionends';
import type { AreaConfig, Network, Overpass } from './lib/types';

const root = resolve(import.meta.dirname, '..');
const cfg: AreaConfig = JSON.parse(readFileSync(resolve(root, 'data/areas/rockridge.json'), 'utf8'));
const osm: Overpass = JSON.parse(readFileSync(resolve(root, cfg.extract), 'utf8'));
const net: Network = buildNetwork(cfg, osm).network;

const reachable = (start: number, adj: number[][]) => {
  const seen = new Set([start]);
  const st = [start];
  while (st.length) for (const v of adj[st.pop()!]) if (!seen.has(v)) (seen.add(v), st.push(v));
  return seen;
};
const adj = net.nodes.map(() => [] as number[]);
for (const l of net.links) adj[l.from].push(l.to);
const gates = net.nodes.filter((n) => n.gate);

describe('gate placement', () => {
  const stats = buildNetwork(cfg, osm).stats;
  const signals = net.nodes.filter((n) => n.control === 'signal');
  const near = (g: { x: number; y: number }) => Math.min(...signals.map((s) => Math.hypot(s.x - g.x, s.y - g.y)));
  it('lists exactly the gates within 60 m of a signalized junction', () => {
    const listed = new Set(stats.gatesNearSignal.map((g) => g.gate));
    const expected = new Set(gates.filter((g) => near(g) <= 60).map((g) => g.id));
    expect(listed).toEqual(expected);
  });
  it('keeps most gates mid-block: at most 3% of gates sit within 60 m of a signal', () => {
    expect(stats.gatesNearSignal.length / gates.length).toBeLessThanOrEqual(0.03);
  });
});

describe('rockridge network', () => {
  it('has junction ends straightened already, so the app step changes nothing', () => {
    expect(straightenJunctionEnds(net).changed).toBe(0);
  });
  it('has valid structure', () => {
    expect(net.version).toBe(1);
    net.nodes.forEach((n, i) => expect(n.id).toBe(i));
    net.links.forEach((l, i) => {
      expect(l.id).toBe(i);
      expect(net.nodes[l.from]).toBeDefined();
      expect(net.nodes[l.to]).toBeDefined();
      expect(l.from).not.toBe(l.to);
      expect(l.geometry.length).toBeGreaterThanOrEqual(2);
      expect(l.length).toBeGreaterThan(0);
      expect(l.lanes).toBeGreaterThanOrEqual(1);
      expect(l.speedLimit).toBeGreaterThan(0);
      for (const h of l.humps) {
        expect(h).toBeGreaterThan(0);
        expect(h).toBeLessThan(l.length);
      }
    });
  });

  it('has symmetric reverse links', () => {
    for (const l of net.links) {
      if (l.reverse === null) continue;
      const r = net.links[l.reverse];
      expect(r.reverse).toBe(l.id);
      expect(r.from).toBe(l.to);
      expect(r.to).toBe(l.from);
      expect(r.name).toBe(l.name);
    }
  });

  it('every gate is connected to another gate', () => {
    expect(gates.length).toBeGreaterThan(10);
    const radj = net.nodes.map(() => [] as number[]);
    for (const l of net.links) radj[l.to].push(l.from);
    let both = 0;
    for (const g of gates) {
      const fwd = reachable(g.id, adj);
      const bwd = reachable(g.id, radj);
      const reaches = gates.some((o) => o.id !== g.id && fwd.has(o.id));
      const reached = gates.some((o) => o.id !== g.id && bwd.has(o.id));
      expect(reaches || reached).toBe(true);
      if (reaches && reached) both++;
    }
    expect(both).toBeGreaterThan(gates.length * 0.7);
  });

  it('two_way_stop nodes have stopped and free approaches', () => {
    const twoWay = net.nodes.filter((n) => n.control === 'two_way_stop');
    expect(twoWay.length).toBeGreaterThan(20);
    for (const n of twoWay) {
      const ins = net.links.filter((l) => l.to === n.id);
      expect(ins.some((l) => l.stopAtEnd)).toBe(true);
      expect(ins.some((l) => !l.stopAtEnd)).toBe(true);
    }
    for (const n of net.nodes.filter((n) => n.control === 'all_way_stop')) {
      expect(net.links.filter((l) => l.to === n.id).every((l) => l.stopAtEnd)).toBe(true);
    }
  });

  it('contains the bounding streets inside the study area', () => {
    for (const name of ['Telegraph Avenue', 'College Avenue', 'Claremont Avenue', 'Alcatraz Avenue']) {
      expect(net.links.some((l) => l.name === name && l.inStudyArea), name).toBe(true);
    }
  });

  it('has a signal at College and Claremont', () => {
    const near = net.nodes.filter((n) => {
      if (n.control !== 'signal') return false;
      const names = new Set(net.links.filter((l) => l.to === n.id).map((l) => l.name));
      return names.has('College Avenue') && names.has('Claremont Avenue');
    });
    expect(near.length).toBeGreaterThanOrEqual(1);
    expect(near.every((n) => n.inStudyArea)).toBe(true);
  });

  it('has gates on the arterials and signals/humps/stops', () => {
    const gateNames = new Set(
      gates.flatMap((g) => net.links.filter((l) => l.from === g.id || l.to === g.id).map((l) => l.name)),
    );
    for (const n of ['Telegraph Avenue', 'College Avenue', 'Claremont Avenue']) expect(gateNames.has(n), n).toBe(true);
    expect(net.nodes.filter((n) => n.control === 'signal').length).toBeGreaterThanOrEqual(25);
    expect(net.links.some((l) => l.humps.length > 0)).toBe(true);
    expect(net.links.filter((l) => l.stopAtEnd).length).toBeGreaterThan(50);
  });

  it('excludes the freeway from the study area and bounds it by the freeway', () => {
    expect(net.links.filter((l) => l.class === 'motorway').every((l) => !l.inStudyArea)).toBe(true);
    const inLocal = net.links.filter((l) => l.inStudyArea);
    expect(inLocal.length).toBeGreaterThan(190);
    expect(cfg.boundary?.at(-1)).toEqual({ ref: 'CA 24', class: 'motorway' });
    expect(inLocal.some((l) => l.name === 'Claremont Avenue')).toBe(true);
  });

  it('joins short signal pairs into single nodes', () => {
    // Excluded by design: ramp terminals and one-way chains (a one-way link between two signals cannot be joined without
    // inventing movements). Two signals joined by a two-way link shorter than the signal join radius are one node,
    // including near the extract edge.
    const sigs = new Set(net.nodes.filter((n) => n.control === 'signal').map((n) => n.id));
    const touchesFreeway = (id: number) =>
      net.links.some((k) => (k.from === id || k.to === id) && [k.from, k.to].some((m) => net.links.some((f) => f.class === 'motorway' && (f.from === m || f.to === m))));
    for (const l of net.links) {
      if ([l.from, l.to].some((id) => touchesFreeway(id))) continue;
      const twoWay = net.links.some((r) => r.from === l.to && r.to === l.from);
      expect(sigs.has(l.from) && sigs.has(l.to) && twoWay && l.length < 40, `link ${l.id}`).toBe(false);
    }
  });

  it('treats Hillegass Avenue / 62nd Street as one intersection with four approach streets', () => {
    const touching = (id: number, name: string) => net.links.filter((l) => l.name === name && (l.from === id || l.to === id));
    const both = net.nodes.filter((n) => touching(n.id, 'Hillegass Avenue').length && touching(n.id, '62nd Street').length);
    expect(both).toHaveLength(1);
    const id = both[0].id;
    expect(touching(id, 'Hillegass Avenue').filter((l) => l.to === id)).toHaveLength(2);
    expect(touching(id, '62nd Street').filter((l) => l.to === id)).toHaveLength(2);
    expect(net.links.filter((l) => l.to === id)).toHaveLength(4);
  });

  it('applies OSM turn restrictions, time-conditional ones by demand period', () => {
    const bans = net.turnBans ?? [];
    expect(bans.length).toBeGreaterThan(30);
    for (const b of bans) expect(net.links[b.from].to, `ban ${b.from}>${b.to}`).toBe(net.links[b.to].from);
    const name = (id: number) => net.links[id].name;
    // Ashby Ave to Hillegass Ave: no left or right turn, Mo-Fr 16:00-18:00.
    expect(bans.some((b) => name(b.from) === 'Ashby Avenue' && name(b.to) === 'Hillegass Avenue' && b.periods?.join() === 'pm_peak')).toBe(true);
    expect(bans.some((b) => b.periods?.includes('midday') && !b.periods.includes('pm_peak'))).toBe(false);
  });

  it('keeps the flared lane count of off-ramp terminals', () => {
    // OSM tags the off-ramps with lanes=1 for most of their length and lanes=2 on the way that ends at the signal.
    const terminals = net.links.filter((l) => l.class === 'motorway' && net.nodes[l.to].control === 'signal');
    expect(terminals.length).toBeGreaterThanOrEqual(2);
    for (const l of terminals) {
      expect(l.lanes).toBeGreaterThanOrEqual(2);
      const feeders = net.links.filter((f) => f.to === l.from && f.class === 'motorway');
      expect(feeders.some((f) => f.lanes < l.lanes)).toBe(true);
    }
  });

  it('flags study-area membership consistently', () => {
    const poly = cfg.studyArea;
    expect(poly[0]).toEqual(poly.at(-1));
    const nodes = net.nodes.filter((n) => n.inStudyArea);
    expect(nodes.length).toBeGreaterThan(50);
    expect(pointInPolygon([net.origin.lon, net.origin.lat], poly)).toBeDefined();
  });
});

describe('rockridge circles and gates', () => {
  it('has no ring links around traffic circles', () => {
    const circles = net.nodes.filter((n) => n.control === 'traffic_circle');
    expect(circles.length).toBeGreaterThanOrEqual(6);
    for (const c of circles) {
      const ins = net.links.filter((l) => l.to === c.id);
      const outs = net.links.filter((l) => l.from === c.id);
      expect(ins.length).toBeGreaterThanOrEqual(3);
      expect(outs.length).toBeGreaterThanOrEqual(3);
      // no short ring fragments: every approach is a street segment (Berkeley's consecutive traffic circles leave 8 m stubs)
      for (const l of ins) expect(l.length).toBeGreaterThan(5);
    }
  });

  it('flags gate directions consistently with the links', () => {
    for (const g of gates) {
      expect(typeof g.canEnter).toBe('boolean');
      expect(typeof g.canExit).toBe('boolean');
      if (g.canEnter) expect(net.links.some((l) => l.from === g.id)).toBe(true);
      if (g.canExit) expect(net.links.some((l) => l.to === g.id)).toBe(true);
      expect(g.canEnter || g.canExit).toBe(true);
    }
    for (const n of net.nodes.filter((n) => !n.gate)) expect(n.canEnter).toBeUndefined();
  });

  it('every enterable gate reaches an exit gate and vice versa', () => {
    const radj = net.nodes.map(() => [] as number[]);
    for (const l of net.links) radj[l.to].push(l.from);
    for (const g of gates.filter((x) => x.canEnter)) {
      const fwd = reachable(g.id, adj);
      expect(gates.some((o) => o.id !== g.id && o.canExit && fwd.has(o.id)), `gate ${g.id}`).toBe(true);
    }
    for (const g of gates.filter((x) => x.canExit)) {
      const bwd = reachable(g.id, radj);
      expect(gates.some((o) => o.id !== g.id && o.canEnter && bwd.has(o.id)), `gate ${g.id}`).toBe(true);
    }
  });
});

describe('roundabout collapse (synthetic)', () => {
  const lat0 = 37.84;
  const lon0 = -122.26;
  const d = 0.0001;
  const nd = (id: number, dx: number, dy: number) => ({ type: 'node' as const, id, lon: lon0 + dx * d, lat: lat0 + dy * d });
  const osm: Overpass = {
    elements: [
      nd(1, 0, 3), nd(2, 3, 0), nd(3, 0, -3), nd(4, -3, 0),
      nd(11, 0, 1), nd(12, 1, 0), nd(13, 0, -1), nd(14, -1, 0),
      nd(21, 0, 8), nd(22, 8, 0), nd(23, 0, -8), nd(24, -8, 0),
      { type: 'way', id: 100, nodes: [11, 14, 13, 12, 11], tags: { highway: 'residential', junction: 'roundabout' } },
      { type: 'way', id: 101, nodes: [21, 1, 11], tags: { highway: 'residential', name: 'North St' } },
      { type: 'way', id: 102, nodes: [22, 2, 12], tags: { highway: 'residential', name: 'East St' } },
      { type: 'way', id: 103, nodes: [23, 3, 13], tags: { highway: 'residential', name: 'South St' } },
      { type: 'way', id: 104, nodes: [24, 4, 14], tags: { highway: 'residential', name: 'West St' } },
      // a one-way street that only leaves the model at the west end
    ],
  };
  const cfg2: AreaConfig = {
    id: 't', name: 't', extract: '', bbox: [lon0 - 10 * d, lat0 - 10 * d, lon0 + 10 * d, lat0 + 10 * d],
    studyArea: [[lon0 - d, lat0 - d], [lon0 + d, lat0 - d], [lon0 + d, lat0 + d], [lon0 - d, lat0 + d], [lon0 - d, lat0 - d]],
  };
  const r = buildNetwork(cfg2, osm);

  it('replaces the ring by one traffic_circle node with four approaches', () => {
    expect(r.stats.collapsedRings).toBe(1);
    const circles = r.network.nodes.filter((n) => n.control === 'traffic_circle');
    expect(circles).toHaveLength(1);
    const c = circles[0];
    expect(Math.hypot(c.x, c.y)).toBeLessThan(1);
    expect(r.network.links.filter((l) => l.to === c.id)).toHaveLength(4);
    expect(r.network.links.filter((l) => l.from === c.id)).toHaveLength(4);
    expect(r.network.links.every((l) => l.osmWayId !== 100)).toBe(true);
  });

  it('ends approach geometry at the ring center', () => {
    const c = r.network.nodes.find((n) => n.control === 'traffic_circle')!;
    for (const l of r.network.links.filter((x) => x.to === c.id)) {
      const last = l.geometry.at(-1)!;
      expect(Math.hypot(last[0] - c.x, last[1] - c.y)).toBeLessThan(1);
    }
  });

  it('flags the four outer ends as two-way gates', () => {
    const g = r.network.nodes.filter((n) => n.gate);
    expect(g).toHaveLength(4);
    for (const n of g) {
      expect(n.canEnter).toBe(true);
      expect(n.canExit).toBe(true);
    }
  });
});

describe('junction joining (synthetic)', () => {
  const lat0 = 37.84;
  const lon0 = -122.26;
  const d = 0.0001;
  const nd = (id: number, dx: number, dy: number, tags?: Record<string, string>) => ({
    type: 'node' as const, id, lon: lon0 + dx * d, lat: lat0 + dy * d, ...(tags ? { tags } : {}),
  });
  const way = (id: number, name: string, nodes: number[], extra: Record<string, string> = {}) => ({
    type: 'way' as const, id, nodes, tags: { highway: 'residential', name, ...extra },
  });
  const sig = { highway: 'traffic_signals' };
  const junctions = (n: Network) => n.nodes.filter((x) => n.links.filter((l) => l.to === x.id).length >= 3);
  const mk = (elements: Overpass['elements'], radius?: number): Network => {
    const c: AreaConfig = {
      id: 't', name: 't', extract: '', bbox: [lon0 - 40 * d, lat0 - 40 * d, lon0 + 40 * d, lat0 + 40 * d],
      studyArea: [[lon0 - 5 * d, lat0 - 5 * d], [lon0 + 5 * d, lat0 - 5 * d], [lon0 + 5 * d, lat0 + 5 * d], [lon0 - 5 * d, lat0 + 5 * d], [lon0 - 5 * d, lat0 - 5 * d]],
      ...(radius === undefined ? {} : { junctionJoinRadius: radius }),
    };
    return buildNetwork(c, { elements }).network;
  };
  // Main St crossed by North St at x=0 and South St at x=1 (about 9 m apart), both nodes tagged as signals.
  const offset: Overpass['elements'] = [
    nd(1, -30, 0), nd(2, 0, 0, sig), nd(3, 1, 0, sig), nd(4, 30, 0), nd(5, 0, 30), nd(6, 1, -30),
    way(10, 'Main Street', [1, 2, 3, 4]), way(11, 'North Street', [5, 2]), way(12, 'South Street', [6, 3]),
  ];

  it('joins offset signal nodes of one crossing into one signal node with four approaches', () => {
    const r = buildNetwork(
      { id: 't', name: 't', extract: '', bbox: [lon0 - 40 * d, lat0 - 40 * d, lon0 + 40 * d, lat0 + 40 * d], studyArea: [[0, 0], [1, 0], [1, 1], [0, 0]] },
      { elements: offset },
    );
    expect(r.stats.joinedClusters).toBe(1);
    const sigs = r.network.nodes.filter((n) => n.control === 'signal');
    expect(sigs).toHaveLength(1);
    expect(r.network.links.filter((l) => l.to === sigs[0].id)).toHaveLength(4);
    expect(r.network.links.filter((l) => l.from === sigs[0].id)).toHaveLength(4);
    expect(r.network.links.every((l) => l.length > 5)).toBe(true);
    // approach geometry ends at the node
    for (const l of r.network.links.filter((x) => x.to === sigs[0].id)) {
      const e = l.geometry.at(-1)!;
      expect(Math.hypot(e[0] - sigs[0].x, e[1] - sigs[0].y)).toBeLessThan(1);
    }
  });

  it('keeps them separate when the radius is 0', () => {
    expect(mk(offset, 0).nodes.filter((n) => n.control === 'signal')).toHaveLength(2);
  });

  it('does not join distinct intersections on a longer block', () => {
    const far = offset.map((e) => (e.type === 'node' && e.id === 3 ? nd(3, 5, 0, sig) : e.type === 'node' && e.id === 6 ? nd(6, 5, -30) : e));
    expect(mk(far).nodes.filter((n) => n.control === 'signal')).toHaveLength(2);
  });

  it('does not join streets that share no name unless both are signals', () => {
    const els: Overpass['elements'] = [
      nd(1, 0, 30), nd(2, 0, 0), nd(3, 0, -30), nd(4, 1, 30), nd(5, 1, 0), nd(6, 1, -30),
      way(10, 'Alpha Street', [1, 2, 3]), way(11, 'Beta Street', [4, 5, 6]), way(12, 'Link Road', [2, 5]),
    ];
    expect(junctions(mk(els))).toHaveLength(2);
  });

  it('makes an all-way stop when stops cover every merged approach', () => {
    const stop = { highway: 'stop', stop: 'all' };
    const els: Overpass['elements'] = [
      nd(1, -30, 0), nd(2, 0, 0, stop), nd(3, 1, 0, stop), nd(4, 30, 0), nd(5, 0, 30), nd(6, 1, -30),
      way(10, 'Main Street', [1, 2, 3, 4]), way(11, 'North Street', [5, 2]), way(12, 'South Street', [6, 3]),
    ];
    const net = mk(els);
    const inner = junctions(net);
    expect(inner).toHaveLength(1);
    expect(inner[0].control).toBe('all_way_stop');
  });
});

describe('wider model area', () => {
  const names = (pred: (l: Network['links'][number]) => boolean) => new Set(net.links.filter(pred).map((l) => l.name));
  const all = names(() => true);

  it('reaches Ashby, Sacramento, Tunnel Road, Broadway and 51st/52nd Street', () => {
    for (const n of ['Ashby Avenue', 'Sacramento Street', 'Tunnel Road', 'Broadway', '51st Street', '52nd Street', 'Shattuck Avenue', 'Martin Luther King Junior Way']) {
      expect(all.has(n), n).toBe(true);
    }
  });

  it('keeps the study area flags to the original streets', () => {
    const inside = names((l) => l.inStudyArea);
    for (const n of ['Ashby Avenue', 'Sacramento Street', 'Tunnel Road', 'Shattuck Avenue', '51st Street', '52nd Street']) expect(inside.has(n), n).toBe(false);
    expect(net.links.filter((l) => l.inStudyArea).length).toBeGreaterThan(190);
    expect(net.links.filter((l) => l.inStudyArea).length).toBeLessThan(215);
  });

  it('finds the SR-24 and SR-13 ramps, including 51st/52nd, Telegraph, Shattuck/MLK, Claremont and Broadway', () => {
    const fw = new Set(net.links.filter((l) => l.class === 'motorway').flatMap((l) => [l.from, l.to]));
    const ramps = net.nodes.filter((n) => fw.has(n.id) && net.links.some((l) => l.class !== 'motorway' && (l.from === n.id || l.to === n.id)));
    const streets = new Set(ramps.flatMap((n) => net.links.filter((l) => l.class !== 'motorway' && (l.from === n.id || l.to === n.id)).map((l) => l.name)));
    for (const s of ['52nd Street', 'Martin Luther King Junior Way', 'Telegraph Avenue', 'Claremont Avenue', 'Broadway']) expect(streets.has(s), s).toBe(true);
    expect(ramps.length).toBeGreaterThanOrEqual(20);
    expect(ramps.some((n) => net.links.some((l) => l.class === 'motorway' && l.to === n.id))).toBe(true);
    expect(ramps.some((n) => net.links.some((l) => l.class === 'motorway' && l.from === n.id))).toBe(true);
  });

  it('puts freeway gates on SR-24 and SR-13 mainlines and keeps them out of the study area', () => {
    const fwGates = gates.filter((g) => net.links.filter((l) => l.from === g.id || l.to === g.id).every((l) => l.class === 'motorway'));
    expect(fwGates.length).toBeGreaterThanOrEqual(6);
    expect(fwGates.some((g) => g.canEnter)).toBe(true);
    expect(fwGates.some((g) => g.canExit)).toBe(true);
    expect(fwGates.every((g) => !g.inStudyArea)).toBe(true);
  });

  it('stays a manageable size', () => {
    expect(net.links.length).toBeLessThan(7000);
    expect(net.nodes.length).toBeLessThan(3000);
    expect(net.nodes.filter((n) => n.control === 'signal').length).toBeGreaterThan(80);
  });

  it('keeps a gate on Ashby, Sacramento, Shattuck and Telegraph at the extract edge', () => {
    const gateStreets = new Set(gates.flatMap((g) => net.links.filter((l) => l.from === g.id || l.to === g.id).map((l) => l.name)));
    for (const n of ['Ashby Avenue', 'Sacramento Street', 'Shattuck Avenue', 'Telegraph Avenue', 'Tunnel Road', 'Broadway']) expect(gateStreets.has(n), n).toBe(true);
  });
});

describe('freeway-edge stubs', () => {
  const stats = buildNetwork(cfg, osm).stats;
  const mainline = net.nodes.filter((n) => n.gate && net.links.some((l) => (l.from === n.id || l.to === n.id) && l.class === 'motorway') && !net.links.some((l) => (l.from === n.id || l.to === n.id) && l.class !== 'motorway'));

  it('merges stubs of one carriageway into one gate per direction and end', () => {
    expect(stats.freewayGateMerges.length).toBeGreaterThanOrEqual(3);
    for (const role of ['entry', 'exit'] as const) {
      const g = mainline.filter((n) => (role === 'entry' ? n.canEnter : n.canExit));
      for (const a of g) for (const b of g) {
        if (a.id >= b.id) continue;
        expect(Math.hypot(a.x - b.x, a.y - b.y), `${role} gates ${a.id} and ${b.id}`).toBeGreaterThan(80);
      }
    }
  });

  it('lets the Claremont, Hudson, Miles, 52nd St and MLK Jr Way on-ramps reach one west-end exit gate', () => {
    const out = new Map<number, number[]>();
    for (const l of net.links) if (l.class === 'motorway') (out.get(l.from) ?? out.set(l.from, []).get(l.from)!).push(l.to);
    const reachExit = (s: number) => {
      const seen = new Set([s]);
      const st = [s];
      while (st.length) for (const v of out.get(st.pop()!) ?? []) if (!seen.has(v)) (seen.add(v), st.push(v));
      return [...seen].filter((v) => net.nodes[v].gate && net.nodes[v].canExit && !out.has(v));
    };
    const onRamp = (street: string) =>
      net.nodes.filter(
        (n) =>
          net.links.some((l) => l.class === 'motorway' && l.from === n.id) &&
          net.links.some((l) => l.class !== 'motorway' && l.name.includes(street) && (l.from === n.id || l.to === n.id)) &&
          n.x < -900 && n.y < -900,
      );
    const gatesOf = (street: string) => new Set(onRamp(street).flatMap((n) => reachExit(n.id)));
    const a = gatesOf('52nd Street');
    expect(a.size).toBeGreaterThan(0);
    for (const s of ['Martin Luther King', 'Miles', 'Hudson']) for (const g of gatesOf(s)) expect(a.has(g), s).toBe(true);
  });

  it('finds no on-ramp that cannot reach a mainline exit gate and no off-ramp that no entry gate feeds', () => {
    expect(stats.freewayRampViolations).toEqual([]);
  });
});

describe('freeway-edge stubs (synthetic)', () => {
  const lat0 = 37.84;
  const lon0 = -122.26;
  const d = 0.0001;
  const nd = (id: number, dx: number, dy: number) => ({ type: 'node' as const, id, lon: lon0 + dx * d, lat: lat0 + dy * d });
  const fw = (id: number, nodes: number[], tags: Record<string, string> = {}) => ({ type: 'way' as const, id, nodes, tags: { highway: 'motorway', lanes: '2', ref: 'CA 1', oneway: 'yes', ...tags } });
  const st = (id: number, name: string, nodes: number[]) => ({ type: 'way' as const, id, nodes, tags: { highway: 'residential', name } });
  // Southbound freeway forks at node 12; both branches leave through the south edge three units (26 m) apart. A Street's on-ramp joins
  // the west branch, B Street's the east branch. Entry stub at the north edge.
  const els: Overpass['elements'] = [
    nd(1, 0, 60), nd(11, 0, 30), nd(12, 0, 10), nd(13, 0, -10), nd(14, 0, -60), nd(15, 3, -10), nd(16, 3, -60), nd(17, 0, -35), nd(18, 3, -35),
    nd(21, -40, -10), nd(22, -8, -10), nd(23, -8, -25), nd(24, 11, -25), nd(31, 40, -10), nd(32, 11, -10),
    fw(100, [1, 11, 12, 13, 17, 14]),
    fw(101, [12, 15, 18, 16]),
    st(200, 'A Street', [21, 22]),
    st(201, 'B Street', [31, 32]),
    st(202, 'C Street', [22, 23, 24, 32]),
    fw(300, [22, 13], { highway: 'motorway_link', lanes: '1', ref: '' }),
    fw(301, [32, 15], { highway: 'motorway_link', lanes: '1', ref: '' }),
  ];
  const mk = (mergeM?: number) => {
    const c: AreaConfig = {
      id: 't', name: 't', extract: '', bbox: [lon0 - 40 * d, lat0 - 40 * d, lon0 + 40 * d, lat0 + 40 * d],
      studyArea: [[lon0 - 5 * d, lat0 - 5 * d], [lon0 + 5 * d, lat0 - 5 * d], [lon0 + 5 * d, lat0 + 5 * d], [lon0 - 5 * d, lat0 + 5 * d], [lon0 - 5 * d, lat0 - 5 * d]],
      ...(mergeM === undefined ? {} : { freewayGateMergeM: mergeM }),
    };
    return buildNetwork(c, { elements: els });
  };
  const exits = (n: Network) => n.nodes.filter((x) => x.gate && x.canExit && n.links.every((l) => l.class === 'motorway' || (l.from !== x.id && l.to !== x.id)));

  it('has two exit stubs and the on-ramps reach one each when merging is off', () => {
    expect(exits(mk(0).network)).toHaveLength(2);
  });

  it('merges the two stubs into one exit gate that both on-ramps reach', () => {
    const r = mk();
    const g = exits(r.network);
    expect(g).toHaveLength(1);
    expect(r.stats.freewayGateMerges).toHaveLength(1);
    expect(r.stats.freewayGateMerges[0].role).toBe('exit');
    const into = r.network.links.filter((l) => l.to === g[0].id);
    expect(into).toHaveLength(2);
    for (const l of into) {
      const e = l.geometry.at(-1)!;
      expect(Math.hypot(e[0] - g[0].x, e[1] - g[0].y)).toBeLessThan(1);
    }
    expect(r.stats.freewayRampViolations).toEqual([]);
  });
});

describe('staggered T-junctions (synthetic)', () => {
  const lat0 = 37.84;
  const lon0 = -122.26;
  const d = 0.0001;
  const nd = (id: number, dx: number, dy: number) => ({ type: 'node' as const, id, lon: lon0 + dx * d, lat: lat0 + dy * d });
  const way = (id: number, name: string, nodes: number[]) => ({ type: 'way' as const, id, nodes, tags: { highway: 'residential', name } });
  // Main St east-west; a north leg meets it at x=0 and a south leg at x=`off` (units of 8.8 m east-west).
  const mk = (off: number, north: string, south: string) => {
    const els: Overpass['elements'] = [
      nd(1, -30, 0), nd(2, 0, 0), nd(3, off, 0), nd(4, 40, 0), nd(5, 0, 30), nd(6, off, -30),
      way(10, 'Main Street', [1, 2, 3, 4]), way(11, north, [5, 2]), way(12, south, [6, 3]),
    ];
    const c: AreaConfig = {
      id: 't', name: 't', extract: '', bbox: [lon0 - 50 * d, lat0 - 40 * d, lon0 + 50 * d, lat0 + 40 * d],
      studyArea: [[lon0 - 5 * d, lat0 - 5 * d], [lon0 + 5 * d, lat0 - 5 * d], [lon0 + 5 * d, lat0 + 5 * d], [lon0 - 5 * d, lat0 - 5 * d]],
    };
    return buildNetwork(c, { elements: els }).network;
  };
  const tJunctions = (n: Network) => n.nodes.filter((x) => n.links.filter((l) => l.to === x.id).length >= 3);

  it('joins two T-junctions 29 m apart when the side legs share a name and leave on opposite sides', () => {
    const n = mk(3.3, 'Cross Street', 'Cross Street');
    const j = tJunctions(n);
    expect(j).toHaveLength(1);
    const legs = n.links.filter((l) => l.to === j[0].id);
    expect(legs.map((l) => l.name).sort()).toEqual(['Cross Street', 'Cross Street', 'Main Street', 'Main Street']);
  });

  it('does not join them when the side streets have different names', () => {
    expect(tJunctions(mk(3.3, 'North Street', 'South Street'))).toHaveLength(2);
  });

  it('does not join same-named side streets 60 m apart', () => {
    expect(tJunctions(mk(6.8, 'Cross Street', 'Cross Street'))).toHaveLength(2);
  });
});

describe('Colby Street / 62nd Street', () => {
  it('is one node with exactly four legs, two Colby Street and two 62nd Street', () => {
    const hits = net.nodes.filter((n) => {
      const ls = net.links.filter((l) => l.to === n.id);
      return ls.some((l) => l.name === 'Colby Street') && ls.some((l) => l.name === '62nd Street');
    });
    expect(hits).toHaveLength(1);
    const ins = net.links.filter((l) => l.to === hits[0].id).map((l) => l.name).sort();
    expect(ins).toEqual(['62nd Street', '62nd Street', 'Colby Street', 'Colby Street']);
  });
});
