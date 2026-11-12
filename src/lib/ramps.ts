import type { Overlay, Theme } from '../types';

/** Viridis-derived sequential ramp (color-blind safe). Light theme: dark = high; dark theme: bright = high. */
const VIRIDIS = ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'];
const VIRIDIS_ON_DARK = ['#3b528b', '#21918c', '#5ec962', '#bddf26', '#fde725'];
export type Mode = 'light' | 'dark';
export function rampStops(mode: Mode): string[] {
  return mode === 'dark' ? VIRIDIS_ON_DARK : [...VIRIDIS].reverse().map((c, i) => (i === 0 ? '#b8d82c' : c));
}
export const resolveMode = (t: Theme, prefersDark: boolean): Mode => (t === 'auto' ? (prefersDark ? 'dark' : 'light') : t);

export function niceMax(v: number): number {
  if (!(v > 0)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

export function percentile(values: number[], p: number): number {
  if (!values.length) return 0;
  const a = [...values].sort((x, y) => x - y);
  return a[Math.min(a.length - 1, Math.floor(p * (a.length - 1)))];
}

/** Normalized intensity 0..1 for a link given overlay. `limit` in m/s. Returns -1 for "no data". */
export function intensity(overlay: Overlay, flow: number, speed: number, cut: number, limit: number, max: number): number {
  if (overlay === 'speed') {
    if (flow <= 0 && speed <= 0) return -1;
    const ratio = limit > 0 ? speed / limit : 1;
    return Math.max(0, Math.min(1, 1 - ratio));
  }
  const v = overlay === 'flow' ? flow : cut;
  return v <= 0 ? -1 : Math.min(1, v / max);
}

export const WIDTH_MIN = 1.2;
export const WIDTH_MAX = 9;
export const widthFor = (t: number) => (t < 0 ? WIDTH_MIN * 0.8 : WIDTH_MIN + t * (WIDTH_MAX - WIDTH_MIN));

/** Smallest upper bound per overlay, so a quiet network does not stretch the ramp to tiny values. */
export const OVERLAY_FLOOR = { flow: 50, cutthrough: 20 } as const;
export const SHRINK_EVERY_MS = 5000;
export interface MaxState { max: number; changedAt: number }

/**
 * Upper bound for the flow and cut-through ramps: 95th percentile of link values rounded up to a nice number.
 * Grows at once; shrinks at most once per SHRINK_EVERY_MS so the legend does not flicker.
 */
export function nextOverlayMax(values: number[], floor: number, prev: MaxState, now: number): MaxState {
  const target = Math.max(floor, niceMax(percentile(values, 0.95)));
  if (prev.max === 0 || target > prev.max) return { max: target, changedAt: now };
  if (target < prev.max && now - prev.changedAt >= SHRINK_EVERY_MS) return { max: target, changedAt: now };
  return prev;
}
