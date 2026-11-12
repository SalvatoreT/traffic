// Free-flow routing and relevance of a trip to the study area, used by the demand audit and the peripheral-trip rules (build-demand.ts).
// Geometry is in network meters. No I/O.
import { distToSegment, pointInPolygon, type Pt } from './geo';

export interface RLink { id: number; from: number; to: number; length: number; speedLimit?: number; geometry?: Pt[]; inStudyArea?: boolean }
export interface RNode { id: number; x: number; y: number; inStudyArea?: boolean }

export interface LinkMetrics {
  /** Smallest distance (m) from the link's centerline to the study-area polygon; 0 when it touches or lies inside. */
  area: number;
  /** Largest distance (m) from any point of the link to the model-area rectangle edge. */
  maxEdge: number;
}

const DENSIFY_M = 25;
export const densify = (pts: Pt[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    out.push(pts[i]);
    if (i + 1 < pts.length) {
      const [a, b] = [pts[i], pts[i + 1]];
      const n = Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / DENSIFY_M);
      for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / (n + 1), a[1] + ((b[1] - a[1]) * k) / (n + 1)]);
    }
  }
  return out;
};

export function distToPolygon(p: Pt, poly: Pt[]): number {
  if (pointInPolygon(p, poly)) return 0;
  let d = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) d = Math.min(d, distToSegment(p, poly[j], poly[i]));
  return d;
}

export interface Rect { minX: number; minY: number; maxX: number; maxY: number }
export const edgeDist = (p: Pt, r: Rect) => Math.max(0, Math.min(p[0] - r.minX, r.maxX - p[0], p[1] - r.minY, r.maxY - p[1]));

/** Position (m) of a point projected onto the rectangle perimeter, clockwise from the lower-left corner. */
export function perimeterPos(p: Pt, r: Rect): number {
  const w = r.maxX - r.minX, h = r.maxY - r.minY;
  const d = [p[1] - r.minY, r.maxX - p[0], r.maxY - p[1], p[0] - r.minX]; // bottom, right, top, left
  const k = d.indexOf(Math.min(...d));
  const cx = Math.min(r.maxX, Math.max(r.minX, p[0])), cy = Math.min(r.maxY, Math.max(r.minY, p[1]));
  // clockwise from the lower-left: left edge up, top edge right, right edge down, bottom edge left
  if (k === 3) return cy - r.minY;
  if (k === 2) return h + (cx - r.minX);
  if (k === 1) return h + w + (r.maxY - cy);
  return 2 * h + w + (r.maxX - cx);
}
export const perimeterLength = (r: Rect) => 2 * (r.maxX - r.minX) + 2 * (r.maxY - r.minY);
export const perimeterGap = (a: number, b: number, total: number) => { const d = Math.abs(a - b); return Math.min(d, total - d); };
export const sideOf = (p: Pt, r: Rect): 'north' | 'east' | 'south' | 'west' => {
  const d = { south: p[1] - r.minY, east: r.maxX - p[0], north: r.maxY - p[1], west: p[0] - r.minX };
  return (Object.entries(d).sort((a, b) => a[1] - b[1])[0][0]) as 'north' | 'east' | 'south' | 'west';
};

export function linkMetrics(links: RLink[], nodes: Map<number, RNode>, poly: Pt[], rect: Rect): Map<number, LinkMetrics> {
  const out = new Map<number, LinkMetrics>();
  for (const l of links) {
    const pts = densify(l.geometry?.length ? l.geometry : [[nodes.get(l.from)!.x, nodes.get(l.from)!.y], [nodes.get(l.to)!.x, nodes.get(l.to)!.y]]);
    let area = l.inStudyArea ? 0 : Infinity, maxEdge = 0;
    for (const p of pts) { area = Math.min(area, distToPolygon(p, poly)); maxEdge = Math.max(maxEdge, edgeDist(p, rect)); }
    out.set(l.id, { area, maxEdge });
  }
  return out;
}

/** Free-flow shortest-path trees (cost = length / speed limit), one per origin, computed on demand. */
export class Router {
  private out = new Map<number, RLink[]>();
  private trees = new Map<number, Map<number, RLink>>();
  constructor(links: RLink[]) {
    for (const l of links) (this.out.get(l.from) ?? this.out.set(l.from, []).get(l.from)!).push(l);
  }
  tree(o: number): Map<number, RLink> {
    let t = this.trees.get(o);
    if (t) return t;
    t = new Map();
    const dist = new Map<number, number>([[o, 0]]);
    const heap: [number, number][] = [[0, o]];
    const push = (e: [number, number]) => { heap.push(e); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const top = heap[0], last = heap.pop()!; if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
    while (heap.length) {
      const [d, u] = pop();
      if (d > (dist.get(u) ?? Infinity)) continue;
      for (const l of this.out.get(u) ?? []) {
        const nd = d + l.length / Math.max(1, l.speedLimit ?? 11);
        if (nd < (dist.get(l.to) ?? Infinity)) { dist.set(l.to, nd); t.set(l.to, l); push([nd, l.to]); }
      }
    }
    this.trees.set(o, t);
    return t;
  }
  /** Links of the free-flow route from o to d, or null when d is unreachable. */
  route(o: number, d: number): RLink[] | null {
    const t = this.tree(o);
    if (o === d) return [];
    if (!t.has(d)) return null;
    const r: RLink[] = [];
    for (let n = d; n !== o; ) { const l = t.get(n)!; r.push(l); n = l.from; }
    return r.reverse();
  }
}

export interface RouteStat { area: number; maxEdge: number; length: number }
export function routeStat(links: RLink[], m: Map<number, LinkMetrics>): RouteStat {
  let area = Infinity, maxEdge = 0, length = 0;
  for (const l of links) { const q = m.get(l.id)!; area = Math.min(area, q.area); maxEdge = Math.max(maxEdge, q.maxEdge); length += l.length; }
  return { area, maxEdge, length };
}

export type Relevance = 'touches' | 'near' | 'peripheral';
/** touches: the route uses the study area or a bounding street (within `touchM`, default 10 m); near: within `nearM` (400 m); peripheral: farther. */
export const relevanceOf = (s: RouteStat, nearM: number, touchM = 10): Relevance => (s.area <= touchM ? 'touches' : s.area <= nearM ? 'near' : 'peripheral');
