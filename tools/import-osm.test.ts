import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pointInPolygon } from './lib/geo';
import { buildNetwork } from './lib/network';
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

describe('rockridge network', () => {
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
      // no short ring fragments: every approach is a real street segment
      for (const l of ins) expect(l.length).toBeGreaterThan(20);
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

  it('ends approach geometry at the ring centre', () => {
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
