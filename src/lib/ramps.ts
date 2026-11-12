import type { Overlay, Theme } from '../types';

/** Viridis-derived sequential ramp (color-blind safe). Light theme: dark = high; dark theme: bright = high. */
const VIRIDIS = ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'];
const VIRIDIS_ON_DARK = ['#3b528b', '#21918c', '#5ec962', '#bddf26', '#fde725'];
export type Mode = 'light' | 'dark';
export function rampStops(mode: Mode): string[] {
  return mode === 'dark' ? VIRIDIS_ON_DARK : [...VIRIDIS].reverse().map((c, i) => (i === 0 ? '#b8d82c' : c));
}
export const resolveMode = (t: Theme, prefersDark: boolean): Mode => (t === 'auto' ? (prefersDark ? 'dark' : 'light') : t);

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

/**
 * Fixed top of the flow and cut-through ramps, veh/h. Values above it clamp to the top color and the widest line, so colors and widths do not rescale as traffic changes.
 * Flow: one signalized lane carries about 740 to 840 veh/h at a 0.5 green share (cases b1 and b2 in data/calibration/validation.md, citing [FHWA-SIG2004]); 800 is the round number near that.
 * Cut-through: 100 veh/h, both directions together. [NACTO-AAA2017] gives about 50 motor vehicles per hour per direction at the peak hour for a bicycle boulevard; ASSUMPTION: doubled for a two-way block, and used here as a through-traffic bound although the source sets it for bicycle comfort.
 */
export const OVERLAY_TOP = { flow: 800, cutthrough: 100 } as const;

/** Top-of-scale value for the overlay; speed is a fixed 0 to 100% of the limit. */
export const overlayTop = (o: Overlay): number => (o === 'speed' ? 1 : OVERLAY_TOP[o]);

/** Five legend labels from the low to the high end. The last carries a plus sign for flow and cut-through because larger values clamp to it. */
export function rampTicks(overlay: Overlay): string[] {
  if (overlay === 'speed') return ['100%', '75%', '50%', '25%', '0%'];
  const top = OVERLAY_TOP[overlay];
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => String(Math.round(top * f)));
  ticks[4] = `${ticks[4]}+`;
  return ticks;
}

export const TOP_NOTE: Record<'flow' | 'cutthrough', string> = {
  flow: 'Top of the scale: 800 vehicles an hour, about what one signalized lane carries in the model.',
  cutthrough: 'Top of the scale: 100 through vehicles an hour, both directions together. Bikeway guidance for shared streets gives about 50 an hour each way at the peak; using it as a limit for through traffic is an assumption.',
};

/**
 * Diverging ramp for change from baseline: decrease blue, increase orange (a blue-orange pair stays distinguishable under deuteranopia and protanopia).
 * Stops are [t, color] for t in 0..1 of the magnitude; zero is neutral gray, drawn thin. Hues are design choices, not calibrated values.
 */
const DIV = {
  light: { neg: ['#6baed6', '#2171b5', '#08458a'], pos: ['#f5a05a', '#e0630f', '#a63a00'], zero: '#a8a291' },
  dark: { neg: ['#3a74ad', '#5aa5ea', '#a6d3ff'], pos: ['#a8601f', '#f08a3c', '#ffc08a'], zero: '#4a5463' },
};
export const DIV_BAND_T = 0.05;
export interface DivStop { t: number; color: string }
/** Signed stops from -1 to 1. */
export function divergingStops(mode: Mode): DivStop[] {
  const d = DIV[mode];
  const pos: DivStop[] = [{ t: DIV_BAND_T, color: d.pos[0] }, { t: 0.5, color: d.pos[1] }, { t: 1, color: d.pos[2] }];
  const neg: DivStop[] = [{ t: -1, color: d.neg[2] }, { t: -0.5, color: d.neg[1] }, { t: -DIV_BAND_T, color: d.neg[0] }];
  return [...neg, { t: 0, color: d.zero }, ...pos];
}
export const divergingGradient = (mode: Mode): string =>
  `linear-gradient(to right, ${divergingStops(mode).map((s) => `${s.color} ${((s.t + 1) * 50).toFixed(1)}%`).join(', ')})`;
