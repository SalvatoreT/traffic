import { readFileSync, writeFileSync } from 'node:fs';
import { dist, makeProjection, round6, simplify, type Pt } from './geo';
import type { AreaConfig, BoundaryStreet, OsmNode, OsmWay, Overpass } from './types';

// Bounding streets are matched by `name` or `ref` (an unnamed-in-places motorway can be given by its ref).
const DRIVABLE = /^(motorway|primary|secondary|tertiary|residential|unclassified|living_street)(_link)?$/;

/** True if the way belongs to the boundary street: a string matches `name` or `ref`; an object matches the fields it gives. */
export function matchesBoundary(tags: Record<string, string>, b: BoundaryStreet): boolean {
  if (typeof b === 'string') return tags.name === b || tags.ref === b;
  if (b.name !== undefined && tags.name !== b.name) return false;
  if (b.ref !== undefined && tags.ref !== b.ref) return false;
  if (b.class !== undefined && !(tags.highway === b.class || tags.highway === `${b.class}_link`)) return false;
  return true;
}

/**
 * Study-area polygon from an ordered list of boundary streets. Consecutive streets (and the last with the first) meet at
 * the geometric crossing of their centerlines (a shared node, or a grade-separated crossing; with several crossings, as at a
 * dual carriageway, the one nearest the area center). Each edge follows the way geometry vertex by vertex.
 */
export function deriveStudyArea(osm: Overpass, boundary: BoundaryStreet[], bbox: AreaConfig['bbox']): [number, number][] {
  const nodes = new Map<number, OsmNode>();
  const ways: OsmWay[] = [];
  for (const e of osm.elements) {
    if (e.type === 'node') nodes.set(e.id, e);
    else if (e.type === 'way' && DRIVABLE.test(e.tags?.highway ?? '')) ways.push(e);
  }
  const proj = makeProjection((bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2);
  const synth = new Map<number, Pt>();
  let nextId = -1;
  const xy = (id: number): Pt => synth.get(id) ?? proj.fwd(nodes.get(id)!.lon, nodes.get(id)!.lat);
  const center: Pt = [0, 0];

  type Graph = Map<number, Map<number, number>>;
  const graphFor = (b: BoundaryStreet): Graph => {
    const adj: Graph = new Map();
    const add = (a: number, b: number) => {
      if (!adj.has(a)) adj.set(a, new Map());
      adj.get(a)!.set(b, dist(xy(a), xy(b)));
    };
    for (const w of ways) {
      if (!matchesBoundary(w.tags, b)) continue;
      for (let i = 1; i < w.nodes.length; i++) {
        add(w.nodes[i - 1], w.nodes[i]);
        add(w.nodes[i], w.nodes[i - 1]);
      }
    }
    if (adj.size === 0) throw new Error(`no ways match boundary street ${JSON.stringify(b)}`);
    return adj;
  };
  const isFreeway = (b: BoundaryStreet) => {
    const ws = ways.filter((w) => matchesBoundary(w.tags, b));
    return ws.length > 0 && ws.every((w) => /^motorway/.test(w.tags.highway));
  };
  const graphs = boundary.map(graphFor);

  const segments = (g: Graph) => {
    const out: [number, number][] = [];
    for (const [a, m] of g) for (const b of m.keys()) if (a < b) out.push([a, b]);
    return out;
  };
  const cross = (p: Pt, q: Pt, r: Pt, t: Pt): Pt | null => {
    const d = (q[0] - p[0]) * (t[1] - r[1]) - (q[1] - p[1]) * (t[0] - r[0]);
    if (Math.abs(d) < 1e-9) return null;
    const u = ((r[0] - p[0]) * (t[1] - r[1]) - (r[1] - p[1]) * (t[0] - r[0])) / d;
    const v = ((r[0] - p[0]) * (q[1] - p[1]) - (r[1] - p[1]) * (q[0] - p[0])) / d;
    const e = 1e-6;
    if (u < -e || u > 1 + e || v < -e || v > 1 + e) return null;
    return [p[0] + u * (q[0] - p[0]), p[1] + u * (q[1] - p[1])];
  };
  // Put point `c` on segment (a, b) of graph `g` as a vertex (reusing an endpoint when it is within 0.05 m).
  const insert = (g: Graph, a: number, b: number, c: Pt): number => {
    for (const id of [a, b]) if (dist(xy(id), c) < 0.05) return id;
    const id = nextId--;
    synth.set(id, c);
    g.get(a)!.delete(b);
    g.get(b)!.delete(a);
    g.set(id, new Map());
    for (const e of [a, b]) {
      g.get(id)!.set(e, dist(c, xy(e)));
      g.get(e)!.set(id, dist(c, xy(e)));
    }
    return id;
  };
  // Corner between two bounding streets: the geometric crossing of their centerlines (grade-separated streets
  // cross without a shared node). With several crossings, as with a dual carriageway, the one nearest the area
  // center is used, which is the carriageway on the inside. If the lines never cross, the closest pair of
  // vertices within 60 m is used.
  const corner = (ga: Graph, gb: Graph, label: string): [number, number] => {
    let best: { c: Pt; sa: [number, number]; sb: [number, number] } | null = null;
    for (const sa of segments(ga)) {
      for (const sb of segments(gb)) {
        const c = cross(xy(sa[0]), xy(sa[1]), xy(sb[0]), xy(sb[1]));
        if (c && (!best || dist(c, center) < dist(best.c, center))) best = { c, sa, sb };
      }
    }
    if (best) {
      const ia = insert(ga, best.sa[0], best.sa[1], best.c);
      return [ia, insert(gb, best.sb[0], best.sb[1], best.c)];
    }
    let pair: [number, number] | null = null;
    let bd = Infinity;
    for (const p of ga.keys()) for (const q of gb.keys()) {
      const d = dist(xy(p), xy(q));
      if (d < bd) (bd = d), (pair = [p, q]);
    }
    if (!pair || bd > 60) throw new Error(`no crossing or nearby vertex for ${label}`);
    return pair;
  };
  const n = boundary.length;
  const corners = boundary.map((_, i) => corner(graphs[i], graphs[(i + 1) % n], `${i}/${(i + 1) % n}`));

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

  // Surface edges are simplified on their own (tolerance 3 m); a freeway edge keeps every vertex of the carriageway.
  const ring: Pt[] = [];
  boundary.forEach((b, i) => {
    const from = corners[(i + n - 1) % n][1];
    const to = corners[i][0];
    const pts = path(graphs[i], from, to).map(xy);
    const edge = isFreeway(b) ? pts : simplify(pts, 3);
    for (const p of i === 0 ? edge : edge.slice(1)) ring.push(p);
  });
  if (dist(ring[0], ring.at(-1)!) < 0.5) ring.pop();
  const buffered = ring;
  const ll = buffered.map(([x, y]) => proj.inv(x, y).map(round6) as [number, number]);
  return [...ll, ll[0]];
}

if (process.argv[1]?.endsWith('derive-study-area.ts')) {
  const cfgPath = process.argv[2];
  const cfg: AreaConfig = JSON.parse(readFileSync(cfgPath, 'utf8'));
  if (!cfg.boundary) throw new Error('config has no boundary');
  const osm: Overpass = JSON.parse(readFileSync(cfg.extract, 'utf8'));
  cfg.studyArea = deriveStudyArea(osm, cfg.boundary, cfg.bbox);
  writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n');
  console.log(`wrote ${cfg.studyArea.length - 1}-vertex study area to ${cfgPath}`);
}
