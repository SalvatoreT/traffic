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

/** Intensities are shown in steps of 1/250 of the scale, so a street's drawn value depends only on its stats, not on the updates that came before. */
export const quantizeIntensity = (t: number): number => Math.round(t * 250) / 250;

export const WIDTH_MIN = 1.2;
export const WIDTH_MAX = 9;
/** Line width (px, before zoom scaling) for a change intensity t in -1..1: thin near zero, thick at either end, on the same square-root scale as the colors. */
export const changeWidthFor = (t: number): number => WIDTH_MIN + Math.sqrt(Math.min(1, Math.abs(t))) * (WIDTH_MAX - WIDTH_MIN);
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
 * Intensity grows with size of change: the smallest steps are mid tones, only large changes reach the dark (light theme) or bright (dark theme) ends.
 * Every step is at least 3:1 against the basemap fill (light #f1efe8, dark #161b22; WCAG 1.4.11). Size also shows in line width, so the ramp
 * does not carry it alone. Zero is neutral gray, drawn thin. Hues are design choices, not calibrated values.
 */
const DIV = {
  light: { neg: ['#4a8bc4', '#2a6db0', '#14509a', '#08306b'], pos: ['#c76a14', '#bd5a0a', '#9a4000', '#6e2800'], zero: '#a8a291' },
  dark: { neg: ['#2f6fae', '#4a95dc', '#7db6f5', '#bfe0ff'], pos: ['#a8601f', '#d9792c', '#f59b4c', '#ffc78f'], zero: '#4a5463' },
};
export const DIV_BAND_T = 0.05;
/** Magnitudes (0..1, perceptual) of the steps after the first; stops sit at their squares so mid-size changes spread out [see changeMagnitude]. */
const DIV_STEPS = [0.5, 0.75, 1];
export interface DivStop { t: number; color: string }
/** Signed stops from -1 to 1. */
export function divergingStops(mode: Mode): DivStop[] {
  const d = DIV[mode];
  const ts = [DIV_BAND_T, ...DIV_STEPS.map((m) => m * m)];
  const pos: DivStop[] = ts.map((t, i) => ({ t, color: d.pos[i] }));
  const neg: DivStop[] = ts.map((t, i) => ({ t: -t, color: d.neg[i] })).reverse();
  return [...neg, { t: 0, color: d.zero }, ...pos];
}
export const divergingGradient = (mode: Mode): string =>
  `linear-gradient(to right, ${divergingStops(mode).map((s) => `${s.color} ${((s.t + 1) * 50).toFixed(1)}%`).join(', ')})`;

export const mutedColor = (mode: Mode): string => (mode === 'dark' ? '#4a5463' : '#a8a291');

const hexRgb = (h: string): number[] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lerpStops = (stops: { t: number; color: string }[], t: number): string => {
  if (t <= stops[0].t) return stops[0].color;
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i].t) {
      const a = stops[i - 1], b = stops[i], k = (t - a.t) / (b.t - a.t), ca = hexRgb(a.color), cb = hexRgb(b.color);
      return `#${ca.map((v, j) => Math.round(v + (cb[j] - v) * k).toString(16).padStart(2, '0')).join('')}`;
    }
  }
  return stops[stops.length - 1].color;
};

/** The color the map draws for a quantized intensity: the same stops the paint expressions use, linear in RGB. Negative sequential values and NO_DATA (-2) in the change view are the muted gray. */
export function colorForIntensity(t: number, mode: Mode, change: boolean): string {
  if (change) return t <= -1.5 ? mutedColor(mode) : lerpStops(divergingStops(mode), t);
  if (t < 0) return mutedColor(mode);
  return lerpStops(rampStops(mode).map((color, i) => ({ t: i / 4, color })), t);
}
