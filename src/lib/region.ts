import type { Intervention, Network } from '../types';
import { interventionPoint } from './describe';
import { distToRing, inRing, REGION_BUFFER_M, ringLocal } from './area';

/** Width of the soft edge, measured inward from the edge of the visible region. */
export const REGION_FEATHER_M = 80;
/** Fade tiers inside the feather band: 0 is outside, FADE_TIERS is fully visible. */
export const FADE_TIERS = 4;
const CELL_M = 8;

export type Pt = [number, number];
export interface Region {
  /** Bounding box of the visible region in local meters. */
  bbox: { minX: number; minY: number; maxX: number; maxY: number };
  /** Exact test: inside the study area or within the buffer. */
  contains(x: number, y: number): boolean;
  /** Cheap grid lookup for per-frame use: 0 outside, 1..FADE_TIERS inside, FADE_TIERS in the interior. */
  tier(x: number, y: number): number;
  /** Parts of a polyline that lie inside the region. */
  clipLine(line: Pt[]): Pt[][];
  /** Closed rings where the signed distance to the study-area outline equals `levelM` (negative inside). */
  contour(levelM: number): Pt[][];
}

function fallbackRing(net: Network): Pt[] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of net.nodes) { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y); }
  if (!isFinite(minX)) return [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  return [[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]];
}

/** The study area buffered outward by `bufferM`, as a distance field on a grid. Without an outline the region is the node bounding box. */
export function buildRegion(net: Network, bufferM = REGION_BUFFER_M, feather = REGION_FEATHER_M): Region {
  const ring0 = ringLocal(net);
  const ring = ring0.length ? ring0 : fallbackRing(net);
  const sd = (x: number, y: number) => (inRing(ring, x, y) ? -1 : 1) * distToRing(ring, x, y);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of ring) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  const pad = bufferM + 3 * CELL_M;
  const x0 = minX - pad, y0 = minY - pad;
  const W = Math.ceil((maxX - minX + 2 * pad) / CELL_M) + 1, H = Math.ceil((maxY - minY + 2 * pad) / CELL_M) + 1;
  const field = new Float32Array(W * H);
  const tiers = new Uint8Array(W * H);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const d = sd(x0 + i * CELL_M, y0 + j * CELL_M);
    field[j * W + i] = d;
    tiers[j * W + i] = d >= bufferM ? 0 : d <= bufferM - feather ? FADE_TIERS : 1 + Math.floor(((FADE_TIERS - 1) * (bufferM - d)) / feather);
  }
  const bbox = { minX: minX - bufferM, minY: minY - bufferM, maxX: maxX + bufferM, maxY: maxY + bufferM };
  const contains = (x: number, y: number) => x >= bbox.minX && x <= bbox.maxX && y >= bbox.minY && y <= bbox.maxY && sd(x, y) < bufferM;
  const tier = (x: number, y: number) => {
    const i = Math.round((x - x0) / CELL_M), j = Math.round((y - y0) / CELL_M);
    return i < 0 || j < 0 || i >= W || j >= H ? 0 : tiers[j * W + i];
  };

  const clipLine = (line: Pt[]): Pt[][] => {
    const out: Pt[][] = [];
    let cur: Pt[] | null = null;
    const boundary = (a: Pt, b: Pt, aIn: boolean): Pt => {
      let lo = 0, hi = 1;
      for (let k = 0; k < 14; k++) {
        const m = (lo + hi) / 2;
        const inside = contains(a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m);
        if (inside === aIn) lo = m; else hi = m;
      }
      const m = (lo + hi) / 2;
      return [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m];
    };
    if (!line.length) return out;
    let prevIn = contains(line[0][0], line[0][1]);
    if (prevIn) cur = [line[0]];
    for (let s = 0; s + 1 < line.length; s++) {
      const a = line[s], b = line[s + 1];
      const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 25));
      let pIn = prevIn, pPt = a;
      for (let k = 1; k <= n; k++) {
        const q: Pt = k === n ? b : [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n];
        const qIn = k === n ? contains(b[0], b[1]) : contains(q[0], q[1]);
        if (qIn !== pIn) {
          const edge = boundary(pPt, q, pIn);
          if (pIn) { cur!.push(edge); out.push(cur!); cur = null; } else cur = [edge];
        }
        pIn = qIn; pPt = q;
      }
      if (pIn) { if (!cur) cur = []; cur.push(b); }
      prevIn = pIn;
    }
    if (cur && cur.length > 1) out.push(cur);
    return out.filter((l) => l.length > 1);
  };

  const contour = (level: number): Pt[][] => {
    // Marching squares; points are keyed by the grid edge they sit on so segments chain exactly.
    const hKey = (i: number, j: number) => 2 * (j * W + i), vKey = (i: number, j: number) => 2 * (j * W + i) + 1;
    const pts = new Map<number, Pt>();
    const adj = new Map<number, number[]>();
    const at = (k: number): Pt => {
      let p = pts.get(k);
      if (p) return p;
      const v = k & 1, idx = k >> 1, i = idx % W, j = Math.floor(idx / W);
      const [i2, j2] = v ? [i, j + 1] : [i + 1, j];
      const a = field[idx], b = field[j2 * W + i2];
      const t = b === a ? 0.5 : (level - a) / (b - a);
      p = [x0 + (i + (i2 - i) * t) * CELL_M, y0 + (j + (j2 - j) * t) * CELL_M];
      pts.set(k, p);
      return p;
    };
    const link = (a: number, b: number) => {
      at(a); at(b);
      (adj.get(a) ?? adj.set(a, []).get(a)!).push(b);
      (adj.get(b) ?? adj.set(b, []).get(b)!).push(a);
    };
    for (let j = 0; j + 1 < H; j++) for (let i = 0; i + 1 < W; i++) {
      const a = field[j * W + i] < level, b = field[j * W + i + 1] < level, c = field[(j + 1) * W + i + 1] < level, d = field[(j + 1) * W + i] < level;
      const e: number[] = [];
      if (a !== b) e.push(hKey(i, j));
      if (b !== c) e.push(vKey(i + 1, j));
      if (c !== d) e.push(hKey(i, j + 1));
      if (d !== a) e.push(vKey(i, j));
      if (e.length === 2) link(e[0], e[1]);
      else if (e.length === 4) { link(e[0], e[3]); link(e[1], e[2]); }
    }
    const seen = new Set<number>();
    const rings: Pt[][] = [];
    for (const start of adj.keys()) {
      if (seen.has(start)) continue;
      const ring: Pt[] = [];
      let prev = -1, cur = start;
      for (;;) {
        seen.add(cur);
        ring.push(pts.get(cur)!);
        const nb = adj.get(cur)!;
        const next = nb.find((n) => n !== prev && !(seen.has(n) && n !== start)) ?? start;
        if (next === start || next === cur) break;
        prev = cur; cur = next;
      }
      if (ring.length > 2) { ring.push(ring[0]); rings.push(ring); }
    }
    return rings;
  };

  return { bbox, contains, tier, clipLine, contour };
}

/** Whether an intervention's place is on the map. Others still load and apply but get no marker. */
export function interventionInRegion(iv: Intervention, net: Network, region: Region): boolean {
  const [x, y] = interventionPoint(iv, net);
  return region.contains(x, y);
}
