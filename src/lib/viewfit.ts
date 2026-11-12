/**
 * Camera math for fitting the study area into the part of the map canvas that no overlay covers,
 * and for the soft pan limit that eases the camera back when the region has been dragged mostly away.
 * Pure: no map or DOM access. Spherical-Mercator world pixels with 512 px tiles, as MapLibre uses.
 * The acceptance thresholds are UI design choices, not calibrated values.
 */

export type LngLat = [number, number];
/** A geographic box in degrees: west, south, east, north. */
export interface GeoBox { w: number; s: number; e: number; n: number }
export interface Rect { left: number; top: number; right: number; bottom: number }
export interface Size { w: number; h: number }
export type Edge = 'top' | 'bottom' | 'left' | 'right';
/** An overlay on the canvas, attached to the canvas edge it grows from. */
export interface Obstacle { rect: Rect; edge: Edge }
export interface Camera { center: LngLat; zoom: number }

const TILE = 512;
/** Smallest unobscured size worth fitting into; below it the whole canvas is used. */
export const MIN_UNOBSCURED_PX = 48;
export const FIT_MARGIN_PX = 24;
export const FIT_MAX_ZOOM = 17.5;
/** Zoom-out allowance beyond the zoom that shows the whole buffered region. */
export const MIN_ZOOM_SLACK = 0.35;
export const MIN_ZOOM_FLOOR = 8;
/** Share of the unobscured rectangle that must still show the region. */
export const MIN_OVERLAP = 0.25;
/** How far past the region's bounding box the unobscured center may sit, as a share of the smaller unobscured side. */
export const CENTER_TOLERANCE = 0.15;

const worldSize = (z: number) => TILE * 2 ** z;
export const worldX = (lng: number, z: number) => ((lng + 180) / 360) * worldSize(z);
export const worldY = (lat: number, z: number) => {
  const s = Math.sin((Math.max(-85.0511, Math.min(85.0511, lat)) * Math.PI) / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * worldSize(z);
};
export const lngOfX = (x: number, z: number) => (x / worldSize(z)) * 360 - 180;
export const latOfY = (y: number, z: number) => {
  const yy = 180 - (y / worldSize(z)) * 360;
  return (360 / Math.PI) * Math.atan(Math.exp((yy * Math.PI) / 180)) - 90;
};

export function boxOfPoints(pts: LngLat[]): GeoBox | null {
  if (!pts.length) return null;
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const [x, y] of pts) { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); }
  return { w, s, e, n };
}

/** Canvas-relative rectangle left free by the overlays: each edge moves in by the deepest overlay attached to it. */
export function unobscuredRect(canvas: Rect, obstacles: Obstacle[]): Rect {
  const W = canvas.right - canvas.left, H = canvas.bottom - canvas.top;
  const inset = { top: 0, bottom: 0, left: 0, right: 0 };
  for (const { rect, edge } of obstacles) {
    const d = edge === 'top' ? rect.bottom - canvas.top
      : edge === 'bottom' ? canvas.bottom - rect.top
      : edge === 'left' ? rect.right - canvas.left
      : canvas.right - rect.left;
    if (Number.isFinite(d)) inset[edge] = Math.max(inset[edge], Math.min(d, edge === 'top' || edge === 'bottom' ? H : W));
  }
  const r = { left: inset.left, top: inset.top, right: W - inset.right, bottom: H - inset.bottom };
  if (r.right - r.left < MIN_UNOBSCURED_PX || r.bottom - r.top < MIN_UNOBSCURED_PX) return { left: 0, top: 0, right: W, bottom: H };
  return r;
}

const rw = (r: Rect) => r.right - r.left;
const rh = (r: Rect) => r.bottom - r.top;
const offset = (r: Rect, size: Size) => ({ x: (r.left + r.right) / 2 - size.w / 2, y: (r.top + r.bottom) / 2 - size.h / 2 });

/** Camera that fits `box` into `unob` (canvas-relative) with a margin, never closer than `maxZoom`. */
export function fitCamera(box: GeoBox, size: Size, unob: Rect, opts: { margin?: number; maxZoom?: number } = {}): Camera {
  const m = opts.margin ?? FIT_MARGIN_PX, maxZoom = opts.maxZoom ?? FIT_MAX_ZOOM;
  const bw0 = Math.max(1e-9, worldX(box.e, 0) - worldX(box.w, 0)), bh0 = Math.max(1e-9, worldY(box.s, 0) - worldY(box.n, 0));
  const aw = Math.max(1, rw(unob) - 2 * m), ah = Math.max(1, rh(unob) - 2 * m);
  const zoom = Math.min(maxZoom, Math.log2(Math.min(aw / bw0, ah / bh0)));
  const u = offset(unob, size);
  const cx = (worldX(box.w, zoom) + worldX(box.e, zoom)) / 2 - u.x;
  const cy = (worldY(box.n, zoom) + worldY(box.s, zoom)) / 2 - u.y;
  return { center: [lngOfX(cx, zoom), latOfY(cy, zoom)], zoom };
}

/** Lowest zoom to allow: the one that shows the whole buffered region in the unobscured rectangle, less some slack. */
export function minZoomFor(region: GeoBox, size: Size, unob: Rect, slack = MIN_ZOOM_SLACK): number {
  return Math.max(MIN_ZOOM_FLOOR, fitCamera(region, size, unob, { margin: 0, maxZoom: 22 }).zoom - slack);
}

/** Generous outer limit: the region box grown by one canvas on every side, measured at the lowest zoom. */
export function hardBounds(region: GeoBox, minZoom: number, size: Size): GeoBox {
  const z = minZoom;
  return {
    w: lngOfX(worldX(region.w, z) - size.w, z), e: lngOfX(worldX(region.e, z) + size.w, z),
    n: latOfY(worldY(region.n, z) - size.h, z), s: latOfY(worldY(region.s, z) + size.h, z),
  };
}

/** Camera center that puts `point` in the middle of the unobscured rectangle at `zoom`. */
export function centerToShow(point: LngLat, zoom: number, size: Size, unob: Rect): LngLat {
  const u = offset(unob, size);
  return [lngOfX(worldX(point[0], zoom) - u.x, zoom), latOfY(worldY(point[1], zoom) - u.y, zoom)];
}

interface Frame { bx0: number; bx1: number; by0: number; by1: number; uw: number; uh: number; px: number; py: number; tol: number; need: number }
function frame(cam: Camera, size: Size, unob: Rect, box: GeoBox, tolFrac: number, minOverlap: number): Frame {
  const z = cam.zoom, u = offset(unob, size);
  const bx0 = worldX(box.w, z), bx1 = worldX(box.e, z), by0 = worldY(box.n, z), by1 = worldY(box.s, z);
  const uw = rw(unob), uh = rh(unob);
  // Capped by the region's own size so a region smaller than the rectangle can still pass.
  const need = Math.min(minOverlap * uw * uh, 0.5 * (bx1 - bx0) * (by1 - by0));
  return { bx0, bx1, by0, by1, uw, uh, px: worldX(cam.center[0], z) + u.x, py: worldY(cam.center[1], z) + u.y, tol: tolFrac * Math.min(uw, uh), need };
}
const overlapArea = (f: Frame, px: number, py: number) =>
  Math.max(0, Math.min(px + f.uw / 2, f.bx1) - Math.max(px - f.uw / 2, f.bx0)) * Math.max(0, Math.min(py + f.uh / 2, f.by1) - Math.max(py - f.uh / 2, f.by0));
const okAt = (f: Frame, px: number, py: number) =>
  px >= f.bx0 - f.tol && px <= f.bx1 + f.tol && py >= f.by0 - f.tol && py <= f.by1 + f.tol && overlapArea(f, px, py) >= f.need;

/** The camera is acceptable when the unobscured center is within the region box (plus tolerance) and enough of the rectangle still shows the region. */
export function isAcceptable(cam: Camera, size: Size, unob: Rect, box: GeoBox, tolFrac = CENTER_TOLERANCE, minOverlap = MIN_OVERLAP): boolean {
  const f = frame(cam, size, unob, box, tolFrac, minOverlap);
  return okAt(f, f.px, f.py);
}

/** The nearest acceptable camera at the same zoom: unchanged when already acceptable. */
export function correctedCamera(cam: Camera, size: Size, unob: Rect, box: GeoBox, tolFrac = CENTER_TOLERANCE, minOverlap = MIN_OVERLAP): Camera {
  const f = frame(cam, size, unob, box, tolFrac, minOverlap);
  if (okAt(f, f.px, f.py)) return cam;
  let qx = Math.max(f.bx0 - f.tol, Math.min(f.bx1 + f.tol, f.px));
  let qy = Math.max(f.by0 - f.tol, Math.min(f.by1 + f.tol, f.py));
  if (!okAt(f, qx, qy)) {
    // Slide toward the region's center until the overlap rule holds.
    const cx = (f.bx0 + f.bx1) / 2, cy = (f.by0 + f.by1) / 2;
    let lo = 0, hi = 1;
    for (let k = 0; k < 24; k++) {
      const t = (lo + hi) / 2;
      if (okAt(f, qx + (cx - qx) * t, qy + (cy - qy) * t)) hi = t; else lo = t;
    }
    qx += (cx - qx) * hi; qy += (cy - qy) * hi;
  }
  const z = cam.zoom, u = offset(unob, size);
  return { center: [lngOfX(qx - u.x, z), latOfY(qy - u.y, z)], zoom: z };
}

/** Where a point lands on the canvas for a camera, in canvas pixels. */
export function screenOf(cam: Camera, size: Size, p: LngLat): { x: number; y: number } {
  const z = cam.zoom;
  return { x: size.w / 2 + worldX(p[0], z) - worldX(cam.center[0], z), y: size.h / 2 + worldY(p[1], z) - worldY(cam.center[1], z) };
}

export const insideRect = (p: { x: number; y: number }, r: Rect, tol = 0.5) =>
  p.x >= r.left - tol && p.x <= r.right + tol && p.y >= r.top - tol && p.y <= r.bottom + tol;
