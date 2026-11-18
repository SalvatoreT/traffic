import type { ControlType, Intervention, Overlay } from '../types';
import { BADGE_NAME, type SignType } from './mapexport';
import { pictoOf, type MapPicto, type PictoId } from './signs';
import { SLOW_STREET_MPH } from './slowstreet';
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
  /** The pictures and speed-limit signs drawn on the map, one per kind, in a fixed order. */
  badges: LegendSymbol[];
  /** The violet dashed line of a chosen reason cars cut through. */
  reason: boolean;
}
export type LegendSymbol = SignType | MapPicto;
const ORDER: LegendSymbol[] = ['speed_hump', 'speed_limit', 'slow_street', 'traffic_circle', 'stop', 'all_way_stop', 'signal', 'uncontrolled', 'signal_timing', 'one_way', 'turn_ban'];

/** The kinds in the legend's fixed order, each once. */
export const orderSymbols = (kinds: Iterable<LegendSymbol>): LegendSymbol[] => { const s = new Set(kinds); return ORDER.filter((t) => s.has(t)); };

export function mapSymbols(ivs: readonly { type: Intervention['type']; control?: ControlType }[], reason: boolean): MapSymbols {
  const types = new Set(ivs.map((iv) => iv.type));
  const drawn = new Set<string>(ivs.map((iv) => (iv.type === 'speed_limit' || iv.type === 'slow_street' ? iv.type : pictoOf(iv) ?? '')));
  return { bar: types.has('modal_filter'), diverter: types.has('diagonal_diverter'), badges: ORDER.filter((t) => drawn.has(t)), reason };
}

const PICTURE_NAME: Record<MapPicto, string> = {
  speed_hump: 'Yellow diamond with a bump',
  traffic_circle: 'Blue disc with circling arrows',
  stop: 'Red stop sign',
  all_way_stop: 'Red stop sign with an ALL plaque',
  signal: 'Traffic light',
  uncontrolled: 'Gray stop sign with a slash',
  signal_timing: 'Traffic light with a clock',
  one_way: 'Black sign with a white arrow',
  turn_ban: 'Turn arrow in a red slashed circle',
};
const PICTURE_MEANING: Record<MapPicto, string> = {
  speed_hump: 'speed hump',
  traffic_circle: 'traffic circle',
  stop: 'intersection changed to a two-way stop',
  all_way_stop: 'intersection changed to an all-way stop',
  signal: 'intersection changed to a traffic signal',
  uncontrolled: 'stop control removed, intersection uncontrolled',
  signal_timing: 'signal timing changed',
  one_way: 'one-way street, the arrow points the way cars may go',
  turn_ban: 'turn banned',
};
/** `label` is the key's words; `sign` is the mph of a speed-limit sign drawn as the key's symbol, where the kind is one; `picto` names the picture otherwise. */
export function badgeKey(t: LegendSymbol): { name: string; label: string; sign?: number | string; picto?: PictoId } {
  if (t === 'slow_street') return { name: BADGE_NAME[t], label: `${SLOW_STREET_MPH} mph sign: ${BADGE_NAME[t]}`, sign: SLOW_STREET_MPH };
  if (t === 'speed_limit') return { name: BADGE_NAME[t], label: `Speed-limit sign: ${BADGE_NAME[t]}`, sign: 'NN' };
  return { name: PICTURE_MEANING[t], label: `${PICTURE_NAME[t]}: ${PICTURE_MEANING[t]}`, picto: t };
}
