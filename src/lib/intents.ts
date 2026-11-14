import type { DemandIntent, Metrics, NetLink, Network } from '../types';
import { compassWord, type NetIndex, UNNAMED } from './naming';
import type { Mode } from './ramps';

/** The "other" slot the simulator tallies after the demand's intents. */
export const OTHER_ID = 'other';

export const BASIS_TEXT: Record<DemandIntent['basis'], string> = { observed: 'Observed counts', assumed: 'Assumed' };
export const BASIS_HELP: Record<DemandIntent['basis'], string> = {
  observed: 'A volunteer or agency count of a turning movement or of the freeway share limits how many cars the model sends this way. Where the cars come from and why they choose these streets is still an assumption.',
  assumed: 'No count limits this flow. It comes from the trip table and the fit to the arterial counts.',
};

export const INTENT_COLORS: Record<Mode, { line: string; casing: string }> = {
  light: { line: '#d9480f', casing: '#ffffff' },
  dark: { line: '#ffa94d', casing: '#1f1208' },
};

/** The paths are drawn at this many pixels per car an hour (clamped), so a wider line is always a heavier flow, for every intent alike. ASSUMPTION: display scale. */
export const PX_PER_VPH = 0.1;
export const MIN_PX = 2.5;
export const MAX_PX = 15;
/** A link joins the drawn path when it carries at least this share of its intent's cars an hour (and at least MIN_VPH). ASSUMPTION: display threshold. */
export const SHOW_SHARE = 0.08;
export const MIN_VPH = 1;

export const pathWidth = (vph: number): number => Math.min(MAX_PX, Math.max(MIN_PX, MIN_PX + (vph - MIN_VPH) * PX_PER_VPH));

export interface IntentRow {
  id: string;
  label: string;
  basis: DemandIntent['basis'] | null;
  /** Cars an hour, whole numbers that add up to the total's. */
  base: number | null;
  scen: number | null;
  change: number | null;
}
export interface IntentTable { rows: IntentRow[]; baseTotal: number | null; scenTotal: number | null; changeTotal: number | null }

/** Whole numbers that keep the sum of `values` rounded: the largest remainders take the leftover units. */
export function apportion(values: number[], total: number): number[] {
  const t = Math.round(total);
  const floors = values.map((v) => Math.floor(v));
  let left = t - floors.reduce((a, b) => a + b, 0);
  const order = values.map((v, i) => ({ i, r: v - Math.floor(v) })).sort((a, b) => b.r - a.r || a.i - b.i);
  const out = [...floors];
  for (const o of order) { if (left <= 0) break; out[o.i] += 1; left -= 1; }
  return out;
}

function column(defs: DemandIntent[], m: Metrics | null | undefined): number[] | null {
  const by = m?.cutThrough.byIntent;
  if (!m || !by || by.length !== defs.length + 1) return null;
  return apportion(by.map((b) => b.vehiclesPerHour), m.cutThrough.vehiclesPerHour);
}

/** One row per intent and one for the rest, in cars an hour over the same window as the through-car total beside it. Null when this build reports no intents. */
export function intentTable(defs: DemandIntent[] | undefined, base: Metrics | null, scen: Metrics | null): IntentTable | null {
  if (!defs?.length) return null;
  const b = column(defs, base), s = column(defs, scen);
  if (!s) return null;
  const rows: IntentRow[] = [...defs.map((d) => ({ id: d.id, label: d.label, basis: d.basis })), { id: OTHER_ID, label: 'Other through cars (no listed reason fits)', basis: null }]
    .map((d, i) => ({ ...d, base: b ? b[i] : null, scen: s[i], change: b ? s[i] - b[i] : null }));
  const sum = (c: number[] | null) => (c ? c.reduce((x, y) => x + y, 0) : null);
  return { rows, baseTotal: sum(b), scenTotal: sum(s), changeTotal: b ? sum(s)! - sum(b)! : null };
}

export interface Segment { link: number; vph: number }
export interface IntentPaths {
  id: string;
  /** Cars an hour of this intent over the run so far. */
  total: number;
  segments: Segment[];
  maxVph: number;
}

/** The links an intent's through cars used, as cars an hour over the run so far, keeping the ones heavy enough to be the typical path. */
export function intentPaths(links: Float32Array | null | undefined, slot: number, id: string, elapsedS: number, totalVph: number): IntentPaths {
  const hours = Math.max(elapsedS, 1) / 3600;
  const all: Segment[] = [];
  if (links) for (let k = 0; k + 2 < links.length; k += 3) if (links[k] === slot) all.push({ link: links[k + 1], vph: links[k + 2] / hours });
  const floor = Math.max(MIN_VPH, SHOW_SHARE * totalVph);
  const segments = all.filter((s) => s.vph >= floor).sort((a, b) => b.vph - a.vph || a.link - b.link);
  return { id, total: totalVph, segments, maxVph: segments[0]?.vph ?? 0 };
}

export const isLocal = (l: NetLink): boolean => l.inStudyArea && (l.class === 'residential' || l.class === 'service');

const streetName = (net: Network, idx: NetIndex, id: number): string => {
  const n = idx.linkName[id];
  if (n && n !== UNNAMED) return n;
  return net.links[id].class === 'motorway' ? 'the freeway ramp' : 'an unnamed road';
};
const join = (xs: string[]): string => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
/** Names in order of first appearance, each with its heaviest flow, strongest first, up to `n`, dropping the ones under a quarter of the strongest. */
function top(entries: [string, number][], n: number): string[] {
  const best = new Map<string, number>();
  for (const [k, v] of entries) best.set(k, Math.max(best.get(k) ?? 0, v));
  const sorted = [...best].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const lead = sorted[0]?.[1] ?? 0;
  return sorted.filter((e) => e[1] >= lead * 0.25).slice(0, n).map((e) => e[0]);
}

/** Where the typical path of an intent runs, from its heaviest links: the arterials its cars leave to reach the side streets, the side streets, and where they rejoin. */
export function describePaths(net: Network, idx: NetIndex, p: IntentPaths): string {
  const seg = new Map(p.segments.map((s) => [s.link, s.vph]));
  const local = p.segments.filter((s) => isLocal(net.links[s.link]));
  if (!local.length) return 'No typical path: few or none of these cars have crossed the side streets in this run.';
  const streets = top(local.map((s) => [`${streetName(net, idx, s.link)} ${compassWord(net, s.link)}`, s.vph]), 3);
  const enter: [string, number][] = [], leave: [string, number][] = [];
  for (const s of p.segments) {
    const l = net.links[s.link];
    if (isLocal(l)) {
      for (const o of idx.outgoingLinks[l.to]) if (seg.has(o) && !isLocal(net.links[o])) leave.push([streetName(net, idx, o), Math.min(s.vph, seg.get(o)!)]);
    } else {
      for (const o of idx.outgoingLinks[l.to]) if (seg.has(o) && isLocal(net.links[o])) enter.push([streetName(net, idx, s.link), Math.min(s.vph, seg.get(o)!)]);
    }
  }
  const e = top(enter, 2), x = top(leave, 2);
  const parts = [e.length ? `Mostly turns off ${join(e)}` : 'Mostly starts on the side streets', `uses ${join(streets)}`, x.length ? `and rejoins ${join(x)}` : 'and does not clearly rejoin one road'];
  return `${parts.join(', ')}.`;
}

/** The drawn lines, as GeoJSON-ready properties. */
export const segmentWidths = (p: IntentPaths): { link: number; vph: number; w: number }[] => p.segments.map((s) => ({ link: s.link, vph: s.vph, w: pathWidth(s.vph) }));
