import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { makeProjection, pointInPolygon } from './lib/geo';
import { buildNetwork } from './lib/network';
import type { AreaConfig, OsmNode, OsmWay, Overpass } from './lib/types';

// A 5 x 5 grid of two-way residential streets, 0.002 degrees apart; the study area is the middle cell.
const STEP = 0.002;
const LON0 = -122.26;
const LAT0 = 37.84;
const nid = (i: number, j: number) => 1000 + i * 10 + j;
const grid = (): Overpass => {
  const elements: (OsmNode | OsmWay)[] = [];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) elements.push({ type: 'node', id: nid(i, j), lon: LON0 + i * STEP, lat: LAT0 + j * STEP });
  for (let j = 0; j < 5; j++) elements.push({ type: 'way', id: 100 + j, nodes: [0, 1, 2, 3, 4].map((i) => nid(i, j)), tags: { highway: 'residential', name: `Row ${j}` } });
  for (let i = 0; i < 5; i++) elements.push({ type: 'way', id: 200 + i, nodes: [0, 1, 2, 3, 4].map((j) => nid(i, j)), tags: { highway: 'residential', name: `Column ${i}` } });
  return { elements };
};
const at = (u: number, v: number): [number, number] => [LON0 + u * STEP, LAT0 + v * STEP];
const base: AreaConfig = {
  id: 'grid',
  name: 'Grid',
  extract: '',
  bbox: [LON0 - 0.001, LAT0 - 0.001, LON0 + 4 * STEP + 0.001, LAT0 + 4 * STEP + 0.001],
  studyArea: [at(1.6, 1.6), at(2.4, 1.6), at(2.4, 2.4), at(1.6, 2.4), at(1.6, 1.6)],
  junctionJoinRadius: 0,
};
const ring = [at(0.5, 0.5), at(3.5, 0.5), at(3.5, 3.5), at(0.5, 3.5), at(0.5, 0.5)];

describe('model extent', () => {
  it('leaves the network unchanged without an extent', () => {
    const a = JSON.stringify(buildNetwork(base, grid()).network);
    const b = JSON.stringify(buildNetwork({ ...base }, grid()).network);
    expect(a).toBe(b);
    expect(buildNetwork(base, grid()).network.nodes.filter((n) => n.osmId < 0)).toHaveLength(0);
  });

  it('cuts every street that leaves the polygon at the polygon edge and makes the cut a gate', () => {
    const { network } = buildNetwork({ ...base, extent: { polygon: ring } }, grid());
    const proj = makeProjection(network.origin.lon, network.origin.lat);
    const poly = ring.map(([lon, lat]) => proj.fwd(lon, lat));
    const gates = network.nodes.filter((n) => n.gate);
    // Rows 1 to 3 leave on the west and east, columns 1 to 3 on the south and north: 12 cuts.
    expect(gates).toHaveLength(12);
    for (const g of gates) {
      expect(g.osmId).toBeLessThan(0);
      const [lon, lat] = proj.inv(g.x, g.y);
      const onEdge = [Math.abs(lon - at(0.5, 0)[0]), Math.abs(lon - at(3.5, 0)[0]), Math.abs(lat - at(0, 0.5)[1]), Math.abs(lat - at(0, 3.5)[1])];
      expect(Math.min(...onEdge)).toBeLessThan(1e-6);
    }
    for (const n of network.nodes) if (!n.gate) expect(pointInPolygon([n.x, n.y], poly)).toBe(true);
  });

  it('keeps the nodes within the network buffer of the study area', () => {
    // The study area holds junction (2,2). Its four neighbors are 176 m (east, west) and 222 m (north, south) away along the streets; the diagonal ones 398 m.
    const { network } = buildNetwork({ ...base, extent: { bufferM: 250 } }, grid());
    const ids = new Set(network.nodes.map((n) => n.osmId));
    for (const [i, j] of [[2, 2], [1, 2], [3, 2], [2, 1], [2, 3]]) expect(ids.has(nid(i, j))).toBe(true);
    expect(ids.has(nid(1, 1))).toBe(false);
    expect(network.nodes.filter((n) => n.gate)).toHaveLength(4);
  });

  it('keeps a listed way whole', () => {
    const { network } = buildNetwork({ ...base, extent: { polygon: ring, include: { ways: [100] } } }, grid());
    const ids = new Set(network.nodes.map((n) => n.osmId));
    for (let i = 1; i < 4; i++) expect(ids.has(nid(i, 0))).toBe(true);
  });
});

const root = resolve(import.meta.dirname, '..');
const compactPath = resolve(root, 'data/areas/rockridge-compact.json');
describe.runIf(existsSync(compactPath))('rockridge-compact', () => {
  const cfg: AreaConfig = JSON.parse(readFileSync(compactPath, 'utf8'));
  const full: AreaConfig = JSON.parse(readFileSync(resolve(root, 'data/areas/rockridge.json'), 'utf8'));
  it('shares the study area and settings of rockridge and differs only in id, name, extent and preview', () => {
    const strip = (c: AreaConfig) => { const { id, name, extent, preview, ...rest } = c; void id; void name; void extent; void preview; return rest; };
    expect(strip(cfg)).toEqual(strip(full));
    expect(cfg.preview).toBe(true);
    expect(cfg.extent?.polygon?.length).toBeGreaterThan(3);
  });
  it.runIf(existsSync(resolve(root, cfg.extract)))('builds a network with every ramp reaching the mainline', () => {
    const osm = JSON.parse(readFileSync(resolve(root, cfg.extract), 'utf8'));
    const { network, stats } = buildNetwork(cfg, osm);
    expect(stats.freewayRampViolations).toEqual([]);
    expect(network.nodes.filter((n) => n.inStudyArea).length).toBeGreaterThan(50);
  });
});
