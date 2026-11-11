import { readFileSync, writeFileSync } from 'node:fs';
import { bufferPolygon, dist, makeProjection, round6, simplify, type Pt } from './geo';
import type { AreaConfig, BoundingStreets, OsmNode, OsmWay, Overpass } from './types';

// Bounding streets are matched by `name` or `ref` (an unnamed-in-places motorway can be given by its ref).
const DRIVABLE = /^(motorway|primary|secondary|tertiary|residential|unclassified|living_street)(_link)?$/;

export function deriveStudyArea(osm: Overpass, streets: BoundingStreets, bbox: AreaConfig['bbox'], bufferM = 15): [number, number][] {
  const nodes = new Map<number, OsmNode>();
  const ways: OsmWay[] = [];
  for (const e of osm.elements) {
    if (e.type === 'node') nodes.set(e.id, e);
    else if (DRIVABLE.test(e.tags?.highway ?? '')) ways.push(e);
  }
  const proj = makeProjection((bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2);
  const xy = (id: number): Pt => proj.fwd(nodes.get(id)!.lon, nodes.get(id)!.lat);

  const graphFor = (name: string) => {
    const adj = new Map<number, Map<number, number>>();
    const add = (a: number, b: number) => {
      if (!adj.has(a)) adj.set(a, new Map());
      adj.get(a)!.set(b, dist(xy(a), xy(b)));
    };
    for (const w of ways) {
      if (w.tags.name !== name && w.tags.ref !== name) continue;
      for (let i = 1; i < w.nodes.length; i++) {
        add(w.nodes[i - 1], w.nodes[i]);
        add(w.nodes[i], w.nodes[i - 1]);
      }
    }
    return adj;
  };
  const G = {
    west: graphFor(streets.west),
    east: graphFor(streets.east),
    south: graphFor(streets.south),
    north: graphFor(streets.north),
  };

  const shared = (a: Map<number, unknown>, b: Map<number, unknown>) => [...a.keys()].filter((k) => b.has(k));
  const pick = (c: number[], label: string) => {
    if (c.length === 0) throw new Error(`no shared node for ${label}`);
    return c[0];
  };
  // Corner between two bounding streets: a shared node, or, when they only cross without a junction (a freeway
  // grade-separated from a street), the closest pair of nodes, one on each street.
  const corner = (a: Map<number, unknown>, b: Map<number, unknown>, label: string): [number, number] => {
    const sh = shared(a, b);
    if (sh.length) return [sh[0], sh[0]];
    let best: [number, number] | null = null;
    let bd = Infinity;
    for (const p of a.keys()) for (const q of b.keys()) {
      const d = dist(xy(p), xy(q));
      if (d < bd) (bd = d), (best = [p, q]);
    }
    if (!best || bd > 60) throw new Error(`no shared or nearby node for ${label}`);
    return best;
  };
  void pick;
  const [sw, swS] = corner(G.west, G.south, 'west/south');
  const [nw] = corner(G.west, G.north, 'west/north');
  const [ne] = corner(G.east, G.north, 'east/north');
  const [se, seS] = corner(G.east, G.south, 'east/south');

  const path = (adj: Map<number, Map<number, number>>, from: number, to: number): number[] => {
    const d = new Map<number, number>([[from, 0]]);
    const prev = new Map<number, number>();
    const todo = new Set<number>([from]);
    while (todo.size) {
      let u = -1;
      for (const c of todo) if (u < 0 || d.get(c)! < d.get(u)!) u = c;
      todo.delete(u);
      if (u === to) break;
      for (const [v, w] of adj.get(u) ?? []) {
        const nd = d.get(u)! + w;
        if (nd < (d.get(v) ?? Infinity)) {
          d.set(v, nd);
          prev.set(v, u);
          todo.add(v);
        }
      }
    }
    if (!d.has(to)) throw new Error('bounding street not connected between corners');
    const out = [to];
    while (out[0] !== from) out.unshift(prev.get(out[0])!);
    return out;
  };

  const loop = [
    ...path(G.west, sw, nw),
    ...path(G.north, nw, ne).slice(1),
    ...path(G.east, ne, se).slice(1),
    ...path(G.south, seS, swS),
  ];
  const ring = simplify([...loop.map(xy), xy(sw)], 4).slice(0, -1);
  const buffered = bufferPolygon(ring, bufferM);
  const ll = buffered.map(([x, y]) => proj.inv(x, y).map(round6) as [number, number]);
  return [...ll, ll[0]];
}

if (process.argv[1]?.endsWith('derive-study-area.ts')) {
  const cfgPath = process.argv[2];
  const cfg: AreaConfig = JSON.parse(readFileSync(cfgPath, 'utf8'));
  if (!cfg.boundingStreets) throw new Error('config has no boundingStreets');
  const osm: Overpass = JSON.parse(readFileSync(cfg.extract, 'utf8'));
  cfg.studyArea = deriveStudyArea(osm, cfg.boundingStreets, cfg.bbox);
  writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n');
  console.log(`wrote ${cfg.studyArea.length - 1}-vertex study area to ${cfgPath}`);
}
