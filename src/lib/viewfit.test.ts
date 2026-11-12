import { describe, expect, it } from 'vitest';
import {
  boxOfPoints, centerToShow, correctedCamera, fitCamera, hardBounds, insideRect, isAcceptable, minZoomFor, screenOf, unobscuredRect,
  type GeoBox, type Rect,
} from './viewfit';

const size = { w: 390, h: 844 };
const canvas: Rect = { left: 0, top: 50, right: 390, bottom: 894 };
const study: GeoBox = { w: -122.2625, s: 37.8395, e: -122.2475, n: 37.8505 };
const region: GeoBox = { w: -122.2655, s: 37.8372, e: -122.2445, n: 37.8528 };
const unobPhone = unobscuredRect(canvas, [
  { rect: { left: 0, top: 758, right: 390, bottom: 894 }, edge: 'bottom' },
  { rect: { left: 330, top: 60, right: 380, bottom: 160 }, edge: 'right' },
]);

describe('unobscuredRect', () => {
  it('is the whole canvas without overlays, in canvas coordinates', () => {
    expect(unobscuredRect(canvas, [])).toEqual({ left: 0, top: 0, right: 390, bottom: 844 });
  });
  it('insets each edge by the deepest overlay on it', () => {
    const r = unobscuredRect(canvas, [
      { rect: { left: 0, top: 40, right: 390, bottom: 140 }, edge: 'top' },
      { rect: { left: 0, top: 800, right: 390, bottom: 894 }, edge: 'bottom' },
      { rect: { left: 0, top: 700, right: 390, bottom: 894 }, edge: 'bottom' },
      { rect: { left: 340, top: 60, right: 380, bottom: 150 }, edge: 'right' },
    ]);
    expect(r).toEqual({ left: 0, top: 90, right: 340, bottom: 650 });
  });
  it('ignores an overlay that does not reach the canvas and falls back when nothing is left', () => {
    expect(unobscuredRect(canvas, [{ rect: { left: 0, top: 0, right: 390, bottom: 40 }, edge: 'top' }])).toEqual({ left: 0, top: 0, right: 390, bottom: 844 });
    expect(unobscuredRect(canvas, [{ rect: { left: 0, top: 60, right: 390, bottom: 894 }, edge: 'bottom' }])).toEqual({ left: 0, top: 0, right: 390, bottom: 844 });
  });
});

describe('fitCamera', () => {
  it('places every corner of the box inside the unobscured rectangle', () => {
    const cam = fitCamera(study, size, unobPhone);
    for (const p of [[study.w, study.s], [study.e, study.s], [study.e, study.n], [study.w, study.n]] as [number, number][]) {
      expect(insideRect(screenOf(cam, size, p), unobPhone)).toBe(true);
    }
  });
  it('centers the box in the rectangle, not the canvas', () => {
    const cam = fitCamera(study, size, unobPhone);
    const c = screenOf(cam, size, [(study.w + study.e) / 2, (study.n + study.s) / 2]);
    expect(c.x).toBeCloseTo((unobPhone.left + unobPhone.right) / 2, 0);
    expect(c.y).toBeCloseTo((unobPhone.top + unobPhone.bottom) / 2, 0);
  });
  it('never zooms past the cap', () => {
    const tiny: GeoBox = { w: -122.26, s: 37.84, e: -122.2599, n: 37.8401 };
    expect(fitCamera(tiny, size, unobPhone).zoom).toBe(17.5);
  });
});

describe('minZoomFor and hardBounds', () => {
  it('allows zooming out past the study fit', () => {
    expect(minZoomFor(region, size, unobPhone)).toBeLessThan(fitCamera(study, size, unobPhone).zoom);
  });
  it('shows the whole buffered region at the minimum zoom', () => {
    const z = minZoomFor(region, size, unobPhone, 0);
    const cam = fitCamera(region, size, unobPhone, { margin: 0, maxZoom: 22 });
    expect(cam.zoom).toBeCloseTo(z, 6);
  });
  it('grows the region by a canvas each way', () => {
    const z = 13, b = hardBounds(region, z, size);
    expect(b.w).toBeLessThan(region.w); expect(b.e).toBeGreaterThan(region.e);
    expect(b.s).toBeLessThan(region.s); expect(b.n).toBeGreaterThan(region.n);
    const cam = { center: [(b.w + b.e) / 2, (b.n + b.s) / 2] as [number, number], zoom: z };
    expect(screenOf(cam, size, [b.w, b.n]).x).toBeCloseTo(size.w / 2 - (screenOf(cam, size, [b.e, b.n]).x - size.w / 2), 3);
  });
});

describe('soft bounds', () => {
  const fit = fitCamera(study, size, unobPhone);
  const shift = (cam: { center: [number, number]; zoom: number }, dlng: number, dlat: number) => ({ center: [cam.center[0] + dlng, cam.center[1] + dlat] as [number, number], zoom: cam.zoom });
  it('accepts the fitted view and returns the same camera', () => {
    expect(isAcceptable(fit, size, unobPhone, region)).toBe(true);
    expect(correctedCamera(fit, size, unobPhone, region)).toBe(fit);
  });
  it('leaves a moderate pan alone', () => {
    const c = shift(fit, 0.002, -0.002);
    expect(isAcceptable(c, size, unobPhone, region)).toBe(true);
    expect(correctedCamera(c, size, unobPhone, region)).toBe(c);
  });
  it('accepts the region dragged up under the sheet while the rectangle still shows enough of it', () => {
    const c = shift(fit, 0, -0.004);
    expect(isAcceptable(c, size, unobPhone, region)).toBe(true);
  });
  it.each([[0.05, 0], [-0.05, 0], [0, 0.05], [0, -0.05], [0.03, -0.03]])('pulls a far pan (%d, %d) back to an acceptable camera at the same zoom', (dx, dy) => {
    const far = shift(fit, dx, dy);
    expect(isAcceptable(far, size, unobPhone, region)).toBe(false);
    const fixed = correctedCamera(far, size, unobPhone, region);
    expect(fixed.zoom).toBe(far.zoom);
    expect(isAcceptable(fixed, size, unobPhone, region)).toBe(true);
    // Nearest: the correction moves along the way back, not past the fitted center.
    expect(Math.abs(fixed.center[0] - fit.center[0])).toBeLessThanOrEqual(Math.abs(far.center[0] - fit.center[0]) + 1e-6);
    expect(Math.abs(fixed.center[1] - fit.center[1])).toBeLessThanOrEqual(Math.abs(far.center[1] - fit.center[1]) + 1e-6);
  });
  it('accepts a region smaller than the rectangle when fully visible', () => {
    const out = { center: fit.center, zoom: fit.zoom - 2 };
    expect(isAcceptable(out, size, unobPhone, region)).toBe(true);
  });
  it('shows a point at the center of the unobscured rectangle', () => {
    const p: [number, number] = [-122.255, 37.845];
    const c = centerToShow(p, 16, size, unobPhone);
    const s = screenOf({ center: c, zoom: 16 }, size, p);
    expect(s.x).toBeCloseTo((unobPhone.left + unobPhone.right) / 2, 3);
    expect(s.y).toBeCloseTo((unobPhone.top + unobPhone.bottom) / 2, 3);
  });
  it('boxOfPoints', () => {
    expect(boxOfPoints([])).toBeNull();
    expect(boxOfPoints([[1, 2], [3, -1]])).toEqual({ w: 1, s: -1, e: 3, n: 2 });
  });
});
