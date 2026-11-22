// Where in the study area through cars cut through, by corridor and direction, and which of those flows the Assumptions tab shows as headlines.
// The corridors are data in the area config (`cutThroughCorridors`); the table is computed by `tools/lib/cut-corridors.ts` from the traced baseline run and stored in baseline-intents.json.
import type { DemandIntent } from '../types';

export const OTHER_CORRIDOR = 'other';
/** The id the simulator gives the reason slot after the demand's own. */
export const OTHER_REASON = 'other';

export interface CorridorStreet { name: string; /** Only some of this street's blocks lie in the corridor. */ part: boolean }
export interface CorridorDef {
  id: string; name: string;
  /** How a flow is named: `compass` by where the cars head along the corridor (Northbound), `ends` by the bounding streets they enter and leave by. */
  directionBy: 'compass' | 'ends';
  streets: CorridorStreet[];
}
/** Cars an hour through one corridor in one direction, and how many of them each reason accounts for (one entry per demand intent, then `other`). */
export interface CorridorFlow { corridor: string; direction: string; vph: number; byIntent: number[] }
/** Cars an hour that enter on one side of the study area and leave on the other, by the bounding streets, and the corridor that carries most of their side-street distance. */
export interface CorridorCrossing { from: string; to: string; corridor: string; vph: number }
export interface CorridorPeriod {
  flows: CorridorFlow[];
  crossing: CorridorCrossing[];
  /** Through cars an hour, and how many of them drive at least `secondShare` of their side-street distance in a second corridor. */
  multi: { vph: number; second: number };
}
export interface CorridorDefs {
  corridors: CorridorDef[];
  /** Name of the corridor that takes every side street no corridor holds. */
  otherName: string;
  secondShare: number;
  /** Bounding streets on each side, for the crossing count. */
  sides: { west: string[]; east: string[] } | null;
}

/** A flow is a headline when it carries at least this share of the area's through cars in some period; the rest are listed together as smaller flows. ASSUMPTION: presentation only, it hides nothing from the totals. */
export const FOLD_SHARE = 0.05;

export interface FlowRow {
  key: string; corridor: string; corridorName: string; direction: string;
  vph: Record<string, number>; share: Record<string, number>;
  byIntent: Record<string, number[]>;
}
export interface CorridorView {
  rows: FlowRow[]; folded: FlowRow[];
  /** Through cars an hour per period: the sum of every flow. */
  totals: Record<string, number>;
  foldedVph: Record<string, number>; foldedShare: Record<string, number>;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** The flows of every period as rows ordered by cars an hour in the lead period, with the ones below the fold share in every period set apart. Null when the file has no flows for the lead period. */
export function corridorView(defs: CorridorDefs, periods: Record<string, CorridorPeriod | undefined>, order: string[], lead: string, fold = FOLD_SHARE): CorridorView | null {
  const have = order.filter((p) => periods[p]);
  if (!periods[lead] || !have.includes(lead)) return null;
  const name = (id: string) => (id === OTHER_CORRIDOR ? defs.otherName : defs.corridors.find((c) => c.id === id)?.name ?? id);
  const totals: Record<string, number> = {};
  for (const p of have) totals[p] = sum(periods[p]!.flows.map((f) => f.vph));
  const byKey = new Map<string, FlowRow>();
  for (const p of have) for (const f of periods[p]!.flows) {
    const key = `${f.corridor}|${f.direction}`;
    const r = byKey.get(key) ?? { key, corridor: f.corridor, corridorName: name(f.corridor), direction: f.direction, vph: {}, share: {}, byIntent: {} };
    r.vph[p] = (r.vph[p] ?? 0) + f.vph;
    r.byIntent[p] = f.byIntent.map((v, i) => (r.byIntent[p]?.[i] ?? 0) + v);
    byKey.set(key, r);
  }
  const all = [...byKey.values()];
  for (const r of all) for (const p of have) { r.vph[p] ??= 0; r.byIntent[p] ??= []; r.share[p] = totals[p] > 0 ? r.vph[p] / totals[p] : 0; }
  const corridorIndex = (id: string) => { const i = defs.corridors.findIndex((c) => c.id === id); return i < 0 ? defs.corridors.length : i; };
  all.sort((a, b) => b.vph[lead] - a.vph[lead]
    || sum(have.map((p) => b.vph[p])) - sum(have.map((p) => a.vph[p]))
    || corridorIndex(a.corridor) - corridorIndex(b.corridor) || a.direction.localeCompare(b.direction));
  const heavy = (r: FlowRow) => have.some((p) => r.share[p] >= fold - 1e-9);
  const rows = all.filter(heavy), folded = all.filter((r) => !heavy(r));
  const foldedVph: Record<string, number> = {}, foldedShare: Record<string, number> = {};
  for (const p of have) { foldedVph[p] = sum(folded.map((r) => r.vph[p])); foldedShare[p] = totals[p] > 0 ? foldedVph[p] / totals[p] : 0; }
  return { rows, folded, totals, foldedVph, foldedShare };
}

/** Whole cars an hour from a table that already holds whole numbers; kept as a function so the page and the text page round the same way. */
export const carsText = (n: number): string => String(Math.round(n));
export const percentText = (share: number): string => (share > 0 && share < 0.005 ? '<1%' : `${Math.round(share * 100)}%`);

export interface ReasonRow { id: string; label: string; def: DemandIntent | null; vph: Record<string, number> }

/** The reasons behind one flow: every reason with cars in some period, most cars first in the lead period (the first of `order`), then most overall, with the demand's own order breaking ties. */
export function reasonsOf(defs: DemandIntent[], byIntent: Record<string, number[]>, order: string[]): ReasonRow[] {
  const slots = [...defs.map((d) => ({ id: d.id, label: d.label, def: d as DemandIntent | null })), { id: OTHER_REASON, label: 'Other through cars (no listed reason fits)', def: null as DemandIntent | null }];
  const rows = slots.map((s, i) => ({ s, i, vph: Object.fromEntries(order.map((p) => [p, byIntent[p]?.[i] ?? 0])) as Record<string, number> }));
  const total = (v: Record<string, number>) => sum(order.map((p) => v[p]));
  return rows.filter((r) => total(r.vph) > 0)
    .sort((a, b) => b.vph[order[0]] - a.vph[order[0]] || total(b.vph) - total(a.vph) || a.i - b.i)
    .map((r) => ({ ...r.s, vph: r.vph }));
}

export interface CrossingLine {
  /** The bounding street on the east side and the ones on the west side it is paired with. */
  east: string; west: string[];
  vph: Record<string, number>; share: Record<string, number>;
  /** The corridor with most of these cars in the lead period, and its share of them. */
  top: { name: string; share: number } | null;
  /** Under the fold share of the area's through cars in every period. */
  small: boolean;
}

/** Cars an hour that enter on the west side of the study area and leave on the east side, or the reverse, one line per east-side bounding street, biggest first in the lead period. Empty when the area names no sides. */
export function crossingLines(defs: CorridorDefs, periods: Record<string, CorridorPeriod | undefined>, order: string[], lead: string, fold = FOLD_SHARE): CrossingLine[] {
  if (!defs.sides) return [];
  const have = order.filter((p) => periods[p]);
  const total: Record<string, number> = {};
  for (const p of have) total[p] = sum(periods[p]!.flows.map((f) => f.vph));
  const name = (id: string) => (id === OTHER_CORRIDOR ? defs.otherName : defs.corridors.find((c) => c.id === id)?.name ?? id);
  const west = defs.sides.west;
  const lines = defs.sides.east.map((east) => {
    const hit = (c: CorridorCrossing) => (west.includes(c.from) && c.to === east) || (c.from === east && west.includes(c.to));
    const vph: Record<string, number> = {}, share: Record<string, number> = {};
    for (const p of have) { vph[p] = sum(periods[p]!.crossing.filter(hit).map((c) => c.vph)); share[p] = total[p] > 0 ? vph[p] / total[p] : 0; }
    const by = new Map<string, number>();
    for (const c of periods[lead]?.crossing.filter(hit) ?? []) by.set(c.corridor, (by.get(c.corridor) ?? 0) + c.vph);
    const best = [...by].sort((a, b) => b[1] - a[1])[0];
    const top = best && vph[lead] > 0 ? { name: name(best[0]), share: best[1] / vph[lead] } : null;
    return { east, west, vph, share, top, small: have.every((p) => share[p] < fold - 1e-9) };
  });
  return lines.sort((a, b) => (b.vph[lead] ?? 0) - (a.vph[lead] ?? 0) || a.east.localeCompare(b.east));
}

const listOf = (xs: string[]): string => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** One sentence per crossing line, with the period names people see; the page and the text page use the same words. */
export function crossingSentences(lines: CrossingLine[], order: string[], lead: string, periodName: (id: string) => string): string[] {
  return lines.map((l) => {
    const rest = order.filter((p) => p !== lead && l.vph[p] !== undefined).map((p) => `${periodName(p)} ${carsText(l.vph[p])}`);
    const head = `Between ${listOf(l.west)} and ${l.east}, in either direction: ${carsText(l.vph[lead] ?? 0)} an hour in the ${periodName(lead)} (${percentText(l.share[lead] ?? 0)} of through cars)${rest.length ? `, ${rest.join(', ')}` : ''}.`;
    const where = l.top && l.vph[lead] > 0 ? ` ${percentText(l.top.share)} of the ${periodName(lead)} cars are in ${l.top.name}.` : '';
    return `${head}${where}${l.small ? ' This is a small flow.' : ''}`;
  });
}

export const CORRIDOR_INTRO = "These are hypotheses about how cars cross the study area without an end in it. They are not what drivers said. The table sorts today's through cars by the part of the side streets they use and the way they go, heaviest first. Under each row, Why these cars are here lists the reasons the model gives for that flow and the streets in its corridor.";
export const corridorRule = (fold = FOLD_SHARE): string => `The grouping is an assumption. Each through car is counted once, under the corridor where it drives the most side-street distance, and a side street that no corridor names goes with the nearest corridor. A flow under ${Math.round(fold * 100)}% of the through cars in every period is listed in Smaller flows. That limit only decides what the page shows. The totals include every flow.`;
export const CORRIDOR_TABLE_NOTE = 'Cars an hour, with the share of all through cars beside each figure. Each period is one simulated hour of today\'s traffic, so small flows move from run to run. The rows add up to the through cars counted for that period.';

/** How many through cars also use a second corridor, in words. Null when the period has none. */
export function multiSentence(defs: CorridorDefs, p: CorridorPeriod | undefined, periodName: string): string | null {
  if (!p || !(p.multi.vph > 0)) return null;
  return `In the ${periodName}, ${carsText(p.multi.second)} of ${carsText(p.multi.vph)} through cars an hour (${percentText(p.multi.second / p.multi.vph)}) drive at least ${Math.round(defs.secondShare * 100)}% of their side-street distance in a second corridor. Each is counted once, in the corridor with more of its distance, so a row shows where most of a trip's side-street driving happens.`;
}
