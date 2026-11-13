import type { LinkStatsView, Overlay } from '../types';
import { aggregate, CHANGE_NAME, CHANGE_UNIT, linkChangeIntensity, readoutText } from './change';
import { colorForIntensity, intensity, quantizeIntensity, type Mode } from './ramps';
import { MPS_TO_MPH } from './format';

export interface HoverLine {
  /** Swatch color, or null when there is nothing to color. */
  color: string | null;
  text: string;
}

export interface HoverLineInput {
  overlay: Overlay;
  change: boolean;
  mode: Mode;
  /** Top of the one-sided scale, as drawn on the map. */
  max: number;
  link: { id: number; speedLimit: number };
  stats: LinkStatsView | null;
  base: LinkStatsView | null;
  /** "toward Elm St" for a street drawn as two directions, so the number belongs to the direction the swatch shows. */
  direction?: string | null;
}

const num = (v: number, digits = 0) => v.toLocaleString('en-US', { maximumFractionDigits: digits });

/** The line under a hovered street's name: the metric the legend shows, its value and a swatch in the color the map draws for that link. */
export function hoverLine(i: HoverLineInput): HoverLine {
  const { overlay: o, link, stats: S, base: B } = i;
  if (!S || (i.change && !B)) return { color: null, text: `${CHANGE_NAME[o]}: No data yet` };
  const suffix = i.direction ? `, ${i.direction}` : '';
  const id = link.id;
  const s = aggregate(S, [id]);
  if (i.change) {
    const t = quantizeIntensity(linkChangeIntensity(o, B as LinkStatsView, S, id));
    return { color: colorForIntensity(t, i.mode, true), text: readoutText(o, aggregate(B as LinkStatsView, [id]), s) + suffix };
  }
  const t = quantizeIntensity(intensity(o, s.flow, S.speed(id), s.cut, link.speedLimit, i.max));
  const color = colorForIntensity(t, i.mode, false);
  if (o === 'speed') {
    const body = s.flow <= 0 && S.speed(id) <= 0 ? 'no traffic'
      : `${num(link.speedLimit > 0 ? (S.speed(id) / link.speedLimit) * 100 : 100)}% of limit (${num(S.speed(id) * MPS_TO_MPH)} ${CHANGE_UNIT.speed})`;
    return { color, text: `Speed: ${body}${suffix}` };
  }
  return { color, text: `${CHANGE_NAME[o]}: ${num(o === 'flow' ? s.flow : s.cut)} ${CHANGE_UNIT[o]}${suffix}` };
}

