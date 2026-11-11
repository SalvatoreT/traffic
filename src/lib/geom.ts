import type { Network, NetLink } from '../types';

export interface SegHit { dist: number; along: number; side: number }

/** Distance from point to polyline; `along` = distance along line to the foot; `side` > 0 means right of travel. */
export function nearestOnPolyline(g: [number, number][], px: number, py: number): SegHit {
  let best: SegHit = { dist: Infinity, along: 0, side: 0 };
  let acc = 0;
  for (let i = 0; i + 1 < g.length; i++) {
    const [ax, ay] = g[i];
    const [bx, by] = g[i + 1];
    const dx = bx - ax, dy = by - ay;
    const l2 = dx * dx + dy * dy;
    const len = Math.sqrt(l2);
    let t = l2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    const fx = ax + t * dx, fy = ay + t * dy;
    const d = Math.hypot(px - fx, py - fy);
    if (d < best.dist) {
      const cross = dx * (py - ay) - dy * (px - ax); // >0 = left of travel
      best = { dist: d, along: acc + t * len, side: -cross };
    }
    acc += len;
  }
  return best;
}

export function pointAlong(g: [number, number][], s: number): { x: number; y: number; heading: number } {
  let acc = 0;
  for (let i = 0; i + 1 < g.length; i++) {
    const dx = g[i + 1][0] - g[i][0], dy = g[i + 1][1] - g[i][1];
    const len = Math.hypot(dx, dy);
    if (s <= acc + len || i + 2 === g.length) {
      const t = len > 0 ? Math.max(0, Math.min(1, (s - acc) / len)) : 0;
      return { x: g[i][0] + dx * t, y: g[i][1] + dy * t, heading: Math.atan2(dy, dx) };
    }
    acc += len;
  }
  return { x: g[0][0], y: g[0][1], heading: 0 };
}

export function polylineLength(g: [number, number][]): number {
  let s = 0;
  for (let i = 0; i + 1 < g.length; i++) s += Math.hypot(g[i + 1][0] - g[i][0], g[i + 1][1] - g[i][1]);
  return s;
}

/**
 * Nearest directed link to a point (local metres) within tolerance. Where a street has two directions the
 * link on whose right-hand side the point lies wins (links are drawn offset to the right).
 */
export function pickLink(net: Network, x: number, y: number, tol: number): NetLink | null {
  let best: NetLink | null = null;
  let bestScore = Infinity;
  for (const l of net.links) {
    const h = nearestOnPolyline(l.geometry, x, y);
    if (h.dist > tol) continue;
    const score = h.dist + (l.reverse !== null && h.side < 0 ? tol * 0.01 : 0);
    if (score < bestScore) { bestScore = score; best = l; }
  }
  return best;
}

export function pickNode(net: Network, x: number, y: number, tol: number): number | null {
  let best: number | null = null;
  let bd = tol;
  for (const n of net.nodes) {
    const d = Math.hypot(n.x - x, n.y - y);
    if (d <= bd) { bd = d; best = n.id; }
  }
  return best;
}
