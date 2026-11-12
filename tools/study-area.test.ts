import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { deriveStudyArea } from './lib/derive-study-area';
import { buildNetwork } from './lib/network';
import { dist, makeProjection, pointInPolygon, type Pt } from './lib/geo';
import type { AreaConfig, OsmNode, Overpass } from './lib/types';

const root = resolve(import.meta.dirname, '..');
const cfg: AreaConfig = JSON.parse(readFileSync(resolve(root, 'data/areas/rockridge.json'), 'utf8'));
const osm: Overpass = JSON.parse(readFileSync(resolve(root, cfg.extract), 'utf8'));
const proj = makeProjection((cfg.bbox[0] + cfg.bbox[2]) / 2, (cfg.bbox[1] + cfg.bbox[3]) / 2);
const nodes = new Map<number, OsmNode>();
for (const e of osm.elements) if (e.type === 'node') nodes.set(e.id, e);
const south = 'CA 24';
const fwSegments: [Pt, Pt][] = [];
for (const e of osm.elements) {
  if (e.type !== 'way' || e.tags.highway !== 'motorway' || (e.tags.name !== south && e.tags.ref !== south)) continue;
  for (let i = 1; i < e.nodes.length; i++) {
    const a = nodes.get(e.nodes[i - 1])!;
    const b = nodes.get(e.nodes[i])!;
    fwSegments.push([proj.fwd(a.lon, a.lat), proj.fwd(b.lon, b.lat)]);
  }
}
// Northern edge of the freeway at x: the highest carriageway crossing the vertical line through x.
const northY = (x: number): number | null => {
  let best: number | null = null;
  for (const [a, b] of fwSegments) {
    if ((a[0] - x) * (b[0] - x) > 0 || a[0] === b[0]) continue;
    const y = a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
    if (best === null || y > best) best = y;
  }
  return best;
};

describe('study area outline', () => {
  const ring = cfg.studyArea.slice(0, -1).map(([lon, lat]) => proj.fwd(lon, lat));

  it('is closed', () => {
    expect(cfg.studyArea[0]).toEqual(cfg.studyArea.at(-1));
  });

  it('keeps every vertex on the north side of the freeway', () => {
    for (const p of ring) {
      const y = northY(p[0]);
      if (y !== null) expect(p[1]).toBeGreaterThanOrEqual(y - 3);
    }
  });

  it('has a dense south edge that follows the northern carriageway', () => {
    const edge = ring.filter((p) => {
      const y = northY(p[0]);
      return y !== null && Math.abs(p[1] - y) < 5;
    });
    expect(edge.length).toBeGreaterThanOrEqual(6);
    const xs = edge.map((p) => p[0]).sort((a, b) => a - b);
    for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1]).toBeLessThan(300);
  });

  it('has no vertex south-east of Claremont Avenue', () => {
    // Line through the College/Claremont corner and the Claremont/freeway crossing (both polygon vertices).
    const corners = ring.filter((p) => dist(p, ring[5]) < 1 || dist(p, ring[9]) < 20);
    expect(corners.length).toBeGreaterThanOrEqual(2);
    const [a, b] = [ring[5], ring[8]];
    const side = (p: Pt) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
    const interior = side(proj.fwd(cfg.center![0], cfg.center![1]));
    for (const p of ring) {
      const off = (side(p) / dist(a, b)) * Math.sign(interior);
      expect(off).toBeGreaterThan(-15);
    }
  });

  it('puts the corners where the boundary streets cross', () => {
    const near = (lon: number, lat: number, tol: number) => ring.some((p) => dist(p, proj.fwd(lon, lat)) < tol);
    expect(near(-122.2523, 37.84943, 30)).toBe(true);
    expect(near(-122.25754, 37.84281, 40)).toBe(true);
    expect(near(-122.2618, 37.84148, 40)).toBe(true);
  });

  it('flags membership by street: local streets inside, south-east of Claremont outside', () => {
    const net = buildNetwork(cfg, osm).network;
    const inside = new Set(net.links.filter((l) => l.inStudyArea).map((l) => l.name));
    for (const n of ['Hillegass Avenue', 'Colby Street', 'Martin Street', '63rd Street', 'Telegraph Avenue', 'Alcatraz Avenue', 'Claremont Avenue']) {
      expect(inside.has(n), n).toBe(true);
    }
    for (const n of ['Lawton Avenue', 'Manila Avenue', 'Miles Avenue', 'Hudson Street', 'Clifton Street']) expect(inside.has(n), n).toBe(false);
    expect(net.links.filter((l) => l.class === 'motorway').every((l) => !l.inStudyArea)).toBe(true);
  });

  it('is reproduced by the derivation', () => {
    const again = deriveStudyArea(osm, cfg.boundary!, cfg.bbox);
    expect(again.length).toBe(cfg.studyArea.length);
    again.forEach((p, i) => expect(dist(proj.fwd(p[0], p[1]), proj.fwd(cfg.studyArea[i][0], cfg.studyArea[i][1]))).toBeLessThan(1));
  });

  it('contains the center of the area', () => {
    expect(pointInPolygon(proj.fwd(cfg.center![0], cfg.center![1]), ring)).toBe(true);
  });
});
