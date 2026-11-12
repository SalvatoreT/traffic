import type { Overlay } from '../types';
import type { LinkStatsView } from '../types';
import { MPS_TO_MPH } from './format';

/** Marks a link with no traffic in the baseline or the scenario. */
export const NO_DATA = -2;

/** Fixed top of the two-sided scale, in display units (veh/h; mph for speed). Cut-through and flow match the one-sided tops in ramps.ts [see OVERLAY_TOP]. Speed: ASSUMPTION, 10 mph. */
export const CHANGE_TOP: Record<Overlay, number> = { cutthrough: 150, flow: 800, speed: 10 };

/** Dead band half-width, display units. ASSUMPTION: 5% of the top, since seeded runs reshuffle arrivals and small differences are noise (design D4). */
export const DEAD_BAND_CUTTHROUGH = 7.5;
export const DEAD_BAND_FLOW = 40;
export const DEAD_BAND_SPEED = 0.5;
export const DEAD_BAND: Record<Overlay, number> = { cutthrough: DEAD_BAND_CUTTHROUGH, flow: DEAD_BAND_FLOW, speed: DEAD_BAND_SPEED };

export const CHANGE_UNIT: Record<Overlay, string> = { cutthrough: 'veh/h', flow: 'veh/h', speed: 'mph' };
export const CHANGE_NAME: Record<Overlay, string> = { cutthrough: 'Cut-through', flow: 'Flow', speed: 'Mean speed' };

export interface Agg { flow: number; cut: number; speed: number }

/** Flow and cut-through summed, speed flow-weighted, over a set of directed links. */
export function aggregate(v: LinkStatsView, links: readonly number[]): Agg {
  let flow = 0, cut = 0, sp = 0, w = 0;
  for (const id of links) { const f = v.flow(id); flow += f; cut += v.cut(id); sp += v.speed(id) * Math.max(f, 0.001); w += Math.max(f, 0.001); }
  return { flow, cut, speed: w > 0 && flow > 0 ? sp / w : 0 };
}

/** The selected metric in display units, or null when it is undefined (speed with no traffic). */
export function metricValue(o: Overlay, a: Agg): number | null {
  if (o === 'flow') return a.flow;
  if (o === 'cutthrough') return a.cut;
  return a.flow > 0 ? a.speed * MPS_TO_MPH : null;
}

/** Scenario minus baseline in display units, or null when either side has no value to compare. */
export function diffValue(o: Overlay, base: Agg, scen: Agg): number | null {
  if (o === 'speed') {
    const b = metricValue(o, base), s = metricValue(o, scen);
    return b === null || s === null ? null : s - b;
  }
  return (metricValue(o, scen) as number) - (metricValue(o, base) as number);
}

/** Signed map intensity in -1..1 (clamped, dead band to 0), or NO_DATA for streets with no traffic in either run. */
export function changeIntensity(o: Overlay, base: Agg, scen: Agg): number {
  if (base.flow <= 0 && scen.flow <= 0 && base.cut <= 0 && scen.cut <= 0) return NO_DATA;
  const d = diffValue(o, base, scen);
  if (d === null) return NO_DATA;
  if (Math.abs(d) < DEAD_BAND[o]) return 0;
  return Math.max(-1, Math.min(1, d / CHANGE_TOP[o]));
}

/** Per-link difference for one link id. */
export function linkChangeIntensity(o: Overlay, base: LinkStatsView, scen: LinkStatsView, id: number): number {
  return changeIntensity(o, aggregate(base, [id]), aggregate(scen, [id]));
}

const MINUS = '−';
/** "+44", "−44", "0". Rounds first, so a change that rounds to zero carries no sign. */
export function formatSigned(v: number | null | undefined, o: Overlay): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return '—';
  const r = o === 'speed' ? Math.round(v * 10) / 10 : Math.round(v);
  if (r === 0) return '0';
  const s = Math.abs(r).toLocaleString('en-US', { maximumFractionDigits: o === 'speed' ? 1 : 0 });
  return `${r < 0 ? MINUS : '+'}${s}`;
}
const plain = (v: number | null, o: Overlay): string => (v === null ? '—' : v.toLocaleString('en-US', { maximumFractionDigits: o === 'speed' ? 1 : 0 }));

/** Five legend labels, low to high; the ends carry a plus because larger changes clamp. */
export function changeTicks(o: Overlay): string[] {
  const t = CHANGE_TOP[o];
  return [`${MINUS}${t}+`, `${MINUS}${t / 2}`, '0', `+${t / 2}`, `+${t}+`];
}

/** "Cut-through: 62 → 18 veh/h (−44)". */
export function readoutText(o: Overlay, base: Agg, scen: Agg): string {
  const b = metricValue(o, base), s = metricValue(o, scen);
  return `${CHANGE_NAME[o]}: ${plain(b, o)} → ${plain(s, o)} ${CHANGE_UNIT[o]} (${formatSigned(diffValue(o, base, scen), o)})`;
}

export const changeLabel = (o: Overlay): string => `Change in ${o === 'cutthrough' ? 'cut-through' : o === 'flow' ? 'flow' : 'speed'}, ${CHANGE_UNIT[o]}`;

/** Sort key helper: 'chg' orders by absolute change, other numeric keys by value. */
export function compareRows<T extends { label: string; chg: number | null }>(key: keyof T | 'chg', dir: 1 | -1) {
  return (a: T, b: T): number => {
    let c: number;
    if (key === 'chg') c = Math.abs(a.chg ?? 0) - Math.abs(b.chg ?? 0);
    else {
      const av = a[key as keyof T], bv = b[key as keyof T];
      c = typeof av === 'string' ? (av as string).localeCompare(bv as unknown as string) : (av as unknown as number) - (bv as unknown as number);
    }
    return (c || a.label.localeCompare(b.label)) * dir;
  };
}

export type MapView = 'scenario' | 'change';
export interface ViewState { view: MapView; count: number; remembered: MapView | null }
export type ViewAction = { type: 'count'; count: number } | { type: 'choose'; view: MapView };

export const initViewState = (count: number, remembered: string | null): ViewState => {
  const r = remembered === 'scenario' || remembered === 'change' ? remembered : null;
  return { view: count > 0 ? r ?? 'change' : 'scenario', count, remembered: r };
};
/** First intervention switches to the change view unless the person chose before; clearing returns to the scenario view. */
export function viewReducer(s: ViewState, a: ViewAction): ViewState {
  if (a.type === 'choose') return { ...s, view: a.view, remembered: a.view };
  if (a.count === 0) return { ...s, count: 0, view: 'scenario' };
  if (s.count === 0) return { ...s, count: a.count, view: s.remembered ?? 'change' };
  return { ...s, count: a.count };
}
export const effectiveView = (s: ViewState): MapView => (s.count === 0 ? 'scenario' : s.view);
