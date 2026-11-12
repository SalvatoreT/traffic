import type { Overlay } from '../types';
import { changeLabel, changeTicks } from './change';
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
    return { name: changeLabel(overlay), ticks: changeTicks(overlay), change: true, stops: divergingStops(mode).map((s) => ({ at: (s.t + 1) / 2, color: s.color })) };
  }
  const colors = rampStops(mode);
  const name = overlay === 'speed' ? 'Speed, % of limit' : overlay === 'flow' ? 'Flow, veh/h' : 'Cut-through, veh/h';
  return { name, ticks: rampTicks(overlay), change: false, stops: colors.map((color, i) => ({ at: i / Math.max(1, colors.length - 1), color })) };
}
