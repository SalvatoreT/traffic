import type { Intervention, Overlay } from '../types';
import { BADGE_NAME, BADGE_TEXT, type BadgedType } from './mapexport';
import { changeLabel, changeTicks } from './change';
import { STUDY_ONLY } from './scope';
import { divergingStops, rampStops, rampTicks, type Mode } from './ramps';

export interface LegendModel {
  name: string;
  /** Five labels, low to high. */
  ticks: string[];
  /** Colors along the bar from 0 to 1. */
  stops: { at: number; color: string }[];
  /** Two-sided scale centered on no change. */
  change: boolean;
}

/** What the legend row says for the current overlay and view, shared by the on-screen legend and the exported image. */
export function legendModel(overlay: Overlay, mode: Mode, change: boolean): LegendModel {
  if (change) {
    return { name: `${changeLabel(overlay)} (${STUDY_ONLY})`, ticks: changeTicks(overlay), change: true, stops: divergingStops(mode).map((s) => ({ at: (s.t + 1) / 2, color: s.color })) };
  }
  const colors = rampStops(mode);
  const name = overlay === 'flow' ? 'Flow: all cars in each direction, cars an hour' : 'Cut-through: through cars on a block, both directions, cars an hour';
  return { name: `${name} (${STUDY_ONLY})`, ticks: rampTicks(overlay), change: false, stops: colors.map((color, i) => ({ at: i / Math.max(1, colors.length - 1), color })) };
}

/** What the map draws besides the colored streets, so the legend can say what each mark means. */
export interface MapSymbols {
  /** Yellow and black bar across a street: a modal filter. */
  bar: boolean;
  diverter: boolean;
  /** Types drawn as a lettered badge, in a fixed order. */
  badges: BadgedType[];
  /** The violet dashed line of a chosen reason cars cut through. */
  reason: boolean;
}
const BADGED: BadgedType[] = ['speed_hump', 'speed_limit', 'slow_street', 'traffic_circle', 'control', 'signal_timing', 'one_way', 'turn_ban'];

export function mapSymbols(ivs: readonly Pick<Intervention, 'type'>[], reason: boolean): MapSymbols {
  const types = new Set(ivs.map((iv) => iv.type));
  return { bar: types.has('modal_filter'), diverter: types.has('diagonal_diverter'), badges: BADGED.filter((t) => types.has(t)), reason };
}
export const badgeKey = (t: BadgedType): { text: string; name: string } => ({ text: BADGE_TEXT[t], name: BADGE_NAME[t] });
