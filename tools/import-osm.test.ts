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
