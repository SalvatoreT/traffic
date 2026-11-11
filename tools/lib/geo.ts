export type Pt = [number, number];

const R = 6371008.8;
const DEG = Math.PI / 180;

export interface Projection {
  fwd(lon: number, lat: number): Pt;
  inv(x: number, y: number): Pt;
}

export function makeProjection(lon0: number, lat0: number): Projection {
  const kx = Math.cos(lat0 * DEG) * R * DEG;
  const ky = R * DEG;
  return {
    fwd: (lon, lat) => [(lon - lon0) * kx, (lat - lat0) * ky],
    inv: (x, y) => [lon0 + x / kx, lat0 + y / ky],
  };
}

export const round1 = (v: number) => Math.round(v * 10) / 10;
export const round6 = (v: number) => Math.round(v * 1e6) / 1e6;

export const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export function cumulative(pts: Pt[]): number[] {
  const out = [0];
  for (let i = 1; i < pts.length; i++) out.push(out[i - 1] + dist(pts[i - 1], pts[i]));
  return out;
}

export const polylineLength = (pts: Pt[]) => cumulative(pts).at(-1) ?? 0;

export function pointAlong(pts: Pt[], d: number): Pt {
  const cum = cumulative(pts);
  if (d <= 0) return pts[0];
  for (let i = 1; i < pts.length; i++) {
    if (d <= cum[i]) {
      const seg = cum[i] - cum[i - 1];
      const t = seg > 0 ? (d - cum[i - 1]) / seg : 0;
      return [pts[i - 1][0] + t * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1])];
    }
  }
  return pts[pts.length - 1];
}

export function pointInPolygon(p: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

export function simplify(pts: Pt[], tol: number): Pt[] {
  if (pts.length < 3) return pts;
  let max = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = distToSegment(pts[i], pts[0], pts[pts.length - 1]);
    if (d > max) {
      max = d;
      idx = i;
    }
  }
  if (max <= tol) return [pts[0], pts[pts.length - 1]];
  const l = simplify(pts.slice(0, idx + 1), tol);
  const r = simplify(pts.slice(idx), tol);
  return [...l.slice(0, -1), ...r];
}

export function signedArea(poly: Pt[]): number {
  let s = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) s += poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1];
  return s / 2;
}

export function bufferPolygon(ring: Pt[], d: number, miterLimit = 3): Pt[] {
  const ccw = signedArea(ring) > 0;
  const n = ring.length;
  const out: Pt[] = [];
  const normal = (a: Pt, b: Pt): Pt => {
    const l = dist(a, b) || 1;
    const tx = (b[0] - a[0]) / l;
    const ty = (b[1] - a[1]) / l;
    return ccw ? [ty, -tx] : [-ty, tx];
  };
  for (let i = 0; i < n; i++) {
    const prev = ring[(i + n - 1) % n];
    const cur = ring[i];
    const next = ring[(i + 1) % n];
    const n1 = normal(prev, cur);
    const n2 = normal(cur, next);
    let mx = n1[0] + n2[0];
    let my = n1[1] + n2[1];
    const ml = Math.hypot(mx, my) || 1;
    mx /= ml;
    my /= ml;
    const cos = mx * n1[0] + my * n1[1];
    const scale = Math.min(d / Math.max(cos, 1e-6), d * miterLimit);
    out.push([cur[0] + mx * scale, cur[1] + my * scale]);
  }
  return out;
}
