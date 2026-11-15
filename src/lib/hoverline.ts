import type { LinkStatsView, Overlay } from '../types';
import { aggregate, CHANGE_NAME, CHANGE_UNIT, linkChangeIntensity, linkIntensity, readoutText } from './change';
import { colorForIntensity, quantizeIntensity, type Mode } from './ramps';
import { MPS_TO_MPH } from './format';

export interface HoverLine {
  /** Swatch color, or null when there is nothing to color. */
  color: string | null;
  text: string;
  /** What is counted, and its value with unit and any suffix: `text` is `${name}: ${value}`. */
  name: string;
  value: string;
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
  /** Every link of the block. Cut-through takes its color from all of them together, as the map does. */
  block?: readonly number[];
  /** Show the whole block, both directions, instead of this link alone. */
  total?: boolean;
}

const num = (v: number, digits = 0) => v.toLocaleString('en-US', { maximumFractionDigits: digits });

/** The line under a hovered street's name: the metric the legend shows, its value and a swatch in the color the map draws for that link. */
export function hoverLine(i: HoverLineInput): HoverLine {
  const { overlay: o, link, stats: S, base: B } = i;
  const none = (name: string): HoverLine => ({ color: null, text: `${name}: No data yet`, name, value: 'No data yet' });
  if (!S || (i.change && !B)) return none(CHANGE_NAME[o]);
  const suffix = i.total ? ', both directions' : i.direction ? `, ${i.direction}` : '';
  const id = link.id;
  const shown = i.total && o === 'cutthrough' && i.block ? i.block : [id];
  const s = aggregate(S, shown);
  const done = (color: string | null, name: string, value: string): HoverLine => ({ color, name, value: value + suffix, text: `${name}: ${value}${suffix}` });
  if (i.change) {
    const t = quantizeIntensity(linkChangeIntensity(o, B as LinkStatsView, S, id, i.block));
    const text = readoutText(o, aggregate(B as LinkStatsView, shown), s);
    const cut = text.indexOf(': ');
    return done(colorForIntensity(t, i.mode, true), text.slice(0, cut), text.slice(cut + 2));
  }
  const t = quantizeIntensity(linkIntensity(o, S, id, link.speedLimit, i.max, i.block));
  const color = colorForIntensity(t, i.mode, false);
  if (o === 'speed') {
    const body = s.flow <= 0 && S.speed(id) <= 0 ? 'no traffic'
      : `${num(link.speedLimit > 0 ? (S.speed(id) / link.speedLimit) * 100 : 100)}% of limit (${num(S.speed(id) * MPS_TO_MPH)} ${CHANGE_UNIT.speed})`;
    return done(color, 'Speed', body);
  }
  return done(color, CHANGE_NAME[o], `${num(o === 'flow' ? s.flow : s.cut)} ${CHANGE_UNIT[o]}`);
}
