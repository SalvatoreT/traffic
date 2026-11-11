import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { deriveStudyArea } from './lib/derive-study-area';
import { dist, makeProjection, pointInPolygon, type Pt } from './lib/geo';
import type { AreaConfig, OsmNode, Overpass } from './lib/types';

const root = resolve(import.meta.dirname, '..');
const cfg: AreaConfig = JSON.parse(readFileSync(resolve(root, 'data/areas/rockridge.json'), 'utf8'));
const osm: Overpass = JSON.parse(readFileSync(resolve(root, cfg.extract), 'utf8'));
const proj = makeProjection((cfg.bbox[0] + cfg.bbox[2]) / 2, (cfg.bbox[1] + cfg.bbox[3]) / 2);
const nodes = new Map<number, OsmNode>();
for (const e of osm.elements) if (e.type === 'node') nodes.set(e.id, e);
const south = cfg.boundingStreets!.south;
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
    expect(edge.length).toBeGreaterThanOrEqual(12);
    const xs = edge.map((p) => p[0]).sort((a, b) => a - b);
    for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1]).toBeLessThan(300);
  });

  it('ends the east edge at the freeway and does not continue south of it', () => {
    const minY = Math.min(...ring.map((p) => p[1]));
    const fwMinY = Math.min(...fwSegments.flatMap(([a, b]) => [a[1], b[1]]));
    expect(minY).toBeGreaterThan(fwMinY);
    const ne = ring.filter((p) => p[0] > 500);
    for (const p of ne) expect(p[1]).toBeGreaterThanOrEqual(northY(p[0])! - 3);
  });

  it('is reproduced by the derivation', () => {
    const again = deriveStudyArea(osm, cfg.boundingStreets!, cfg.bbox);
    expect(again.length).toBe(cfg.studyArea.length);
    again.forEach((p, i) => expect(dist(proj.fwd(p[0], p[1]), proj.fwd(cfg.studyArea[i][0], cfg.studyArea[i][1]))).toBeLessThan(1));
  });

  it('contains the center of the area', () => {
    expect(pointInPolygon([0, 0], ring)).toBe(true);
  });
});
