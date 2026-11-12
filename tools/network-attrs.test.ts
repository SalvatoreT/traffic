import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { bikeTags, hasSidewalk, isMarkedCrossing } from './lib/attrs';
import { buildNetwork } from './lib/network';
import type { AreaConfig, Network, Overpass } from './lib/types';

const root = resolve(import.meta.dirname, '..');

describe('tag parsing', () => {
  it('puts a right-side lane on the forward direction and a left-side lane on the backward one', () => {
    expect(bikeTags({ 'cycleway:right': 'lane' }, true, true)).toMatchObject({ laneF: true, laneB: false });
    expect(bikeTags({ 'cycleway:left': 'lane' }, true, true)).toMatchObject({ laneF: false, laneB: true });
    expect(bikeTags({ 'cycleway:both': 'lane' }, true, true)).toMatchObject({ laneF: true, laneB: true });
    expect(bikeTags({ cycleway: 'track' }, true, true)).toMatchObject({ laneF: true, laneB: true });
    expect(bikeTags({ 'cycleway:right:lane': 'exclusive' }, true, true)).toMatchObject({ laneF: true, laneB: false });
  });
  it('handles one-way streets and contraflow lanes', () => {
    expect(bikeTags({ 'cycleway:left': 'lane' }, true, false)).toMatchObject({ laneF: true, laneB: false });
    expect(bikeTags({ 'cycleway:right': 'lane' }, false, true)).toMatchObject({ laneF: false, laneB: true });
    expect(bikeTags({ 'cycleway:left': 'opposite_lane' }, true, false)).toMatchObject({ laneF: false, laneB: false });
  });
  it('does not count shared lanes, separate cycleways or no as lanes', () => {
    for (const v of ['shared_lane', 'separate', 'no']) expect(bikeTags({ 'cycleway:both': v }, true, true).laneF).toBe(false);
    expect(bikeTags({ cycleway: 'shared_lane' }, true, true).route).toBe(true);
    expect(bikeTags({ 'cycleway:right': 'share_busway' }, true, true).route).toBe(true);
    expect(bikeTags({ bicycle: 'designated' }, true, true).route).toBe(true);
    expect(bikeTags({ lcn: 'yes' }, true, true).route).toBe(true);
    expect(bikeTags({ bicycle: 'yes' }, true, true).route).toBe(false);
  });
  it('defaults sidewalks to true except motorway and explicit no', () => {
    expect(hasSidewalk({}, 'residential')).toBe(true);
    expect(hasSidewalk({}, 'motorway')).toBe(false);
    expect(hasSidewalk({ sidewalk: 'no' }, 'residential')).toBe(false);
    expect(hasSidewalk({ foot: 'no' }, 'residential')).toBe(false);
    expect(hasSidewalk({ 'sidewalk:left': 'no', 'sidewalk:right': 'no' }, 'residential')).toBe(false);
    expect(hasSidewalk({ 'sidewalk:left': 'no' }, 'residential')).toBe(true);
  });
  it('recognizes marked crossings', () => {
    const c = (t: Record<string, string>) => isMarkedCrossing({ highway: 'crossing', ...t });
    expect(c({ crossing: 'marked' })).toBe(true);
    expect(c({ crossing: 'zebra' })).toBe(true);
    expect(c({ crossing: 'uncontrolled' })).toBe(true);
    expect(c({ crossing: 'unmarked' })).toBe(false);
    expect(c({ crossing: 'unmarked', 'crossing:markings': 'no' })).toBe(false);
    expect(c({ 'crossing:markings': 'ladder' })).toBe(true);
    expect(c({})).toBe(false);
  });
});

describe('importer attributes (synthetic)', () => {
  const lat0 = 37.84;
  const lon0 = -122.26;
  const d = 0.0001;
  const nd = (id: number, dx: number, dy: number, tags?: Record<string, string>) => ({
    type: 'node' as const, id, lon: lon0 + dx * d, lat: lat0 + dy * d, ...(tags ? { tags } : {}),
  });
  const way = (id: number, name: string, nodes: number[], extra: Record<string, string> = {}) => ({
    type: 'way' as const, id, nodes, tags: { highway: 'residential', name, ...extra },
  });
  const cfg: AreaConfig = {
    id: 't', name: 't', extract: '', bbox: [lon0 - 40 * d, lat0 - 40 * d, lon0 + 40 * d, lat0 + 40 * d],
    studyArea: [[lon0 - 20 * d, lat0 - 20 * d], [lon0 + 20 * d, lat0 - 20 * d], [lon0 + 20 * d, lat0 + 25 * d], [lon0 - 20 * d, lat0 + 25 * d], [lon0 - 20 * d, lat0 - 20 * d]],
  };
  const zebra = { highway: 'crossing', crossing: 'zebra' };
  // Main St from x=-30 to 30 with junctions at x=-15 and x=15; a zebra at x=-14 (about 9 m from the first junction)
  // and one at x=0 (about 130 m from both).
  const elements: Overpass['elements'] = [
    nd(1, -30, 0), nd(2, -15, 0), nd(8, -14, 0, zebra), nd(3, 0, 0, zebra), nd(4, 15, 0), nd(5, 30, 0), nd(6, -15, 20), nd(7, 15, 20),
    way(10, 'Main Street', [1, 2, 8, 3, 4, 5], { 'cycleway:right': 'lane' }),
    way(11, 'North Street', [6, 2], { sidewalk: 'no' }),
    way(12, 'East Street', [7, 4]),
    { type: 'relation', id: 900, tags: { route: 'bicycle' }, members: [{ type: 'way', ref: 12, role: '' }] },
  ];
  const net: Network = buildNetwork(cfg, { elements }).network;
  const between = (a: string, b: string) => {
    const pick = (n: Network, x: number) => n.nodes.reduce((best, q) => (Math.abs(q.x - x) < Math.abs(best.x - x) && Math.abs(q.y) < 3 ? q : best), n.nodes[0]);
    const na = pick(net, a === 'W' ? -15 * 8.8 : 15 * 8.8);
    const nb = pick(net, b === 'W' ? -15 * 8.8 : 15 * 8.8);
    return net.links.find((l) => l.from === na.id && l.to === nb.id)!;
  };

  it('flags the lane only in the right-hand direction', () => {
    expect(between('W', 'E').bikeLane).toBe(true);
    expect(between('E', 'W').bikeLane).toBeUndefined();
  });
  it('keeps mid-block crossings on the link and junction crossings on the node', () => {
    const f = between('W', 'E');
    const r = between('E', 'W');
    expect(f.crossings).toHaveLength(1);
    expect(f.crossings![0] + r.crossings![0]).toBeCloseTo(f.length, 0);
    expect(f.crossings![0]).toBeGreaterThan(100);
    const west = net.nodes.find((n) => Math.abs(n.x + 15 * 8.8) < 3 && Math.abs(n.y) < 3)!;
    const east = net.nodes.find((n) => Math.abs(n.x - 15 * 8.8) < 3 && Math.abs(n.y) < 3)!;
    expect(west.markedCrossing).toBe(true);
    expect(east.markedCrossing).toBeUndefined();
  });
  it('uses relations for bike routes and tags for sidewalks', () => {
    const byWay = (id: number) => net.links.filter((l) => l.osmWayId === id);
    expect(byWay(12).length).toBeGreaterThan(0);
    expect(byWay(12).every((l) => l.bikeRoute === true)).toBe(true);
    expect(byWay(10).every((l) => l.bikeRoute === undefined)).toBe(true);
    expect(byWay(11).every((l) => l.sidewalk === false)).toBe(true);
    expect(byWay(10).every((l) => l.sidewalk === true)).toBe(true);
  });
  it('is tolerant of an extract without relations', () => {
    const n = buildNetwork(cfg, { elements: elements.filter((e) => e.type !== 'relation') }).network;
    expect(n.links.length).toBe(net.links.length);
    expect(n.links.every((l) => l.bikeRoute === undefined)).toBe(true);
  });
});

describe('rockridge network contract', () => {
  const path = resolve(root, 'public/data/rockridge.network.json');
  it.skipIf(!existsSync(path))('has valid optional fields', () => {
    const net: Network = JSON.parse(readFileSync(path, 'utf8'));
    for (const l of net.links) {
      for (const k of ['bikeLane', 'bikeRoute', 'sidewalk'] as const) if (l[k] !== undefined) expect(typeof l[k]).toBe('boolean');
      if (l.class === 'motorway') expect(l.sidewalk).toBe(false);
      for (const c of l.crossings ?? []) {
        expect(c).toBeGreaterThan(0);
        expect(c).toBeLessThan(l.length);
      }
      expect(l.crossings ?? []).toEqual([...(l.crossings ?? [])].sort((a, b) => a - b));
    }
    for (const n of net.nodes) if (n.markedCrossing !== undefined) expect(n.markedCrossing).toBe(true);
    expect(net.links.some((l) => l.bikeLane)).toBe(true);
    expect(net.links.some((l) => l.crossings?.length)).toBe(true);
  });
});
