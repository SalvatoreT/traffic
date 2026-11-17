// What the card's map says when a street or a change is hovered, focused or tapped. Kept out of the component so it can be tested.
import { DEAD_BAND_CUTTHROUGH } from './change';
import { blockChanges, type BlockChange } from './picture';
import type { NetIndex } from './naming';
import { signedNum, type Proposal, type ProposalPicture } from './proposals';

const round = Math.round;

/** The blocks whose through cars change by at least one car an hour, biggest change first. */
export function streetsThatChange(changes: BlockChange[]): BlockChange[] {
  return changes.filter((c) => round(c.delta) !== 0).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.label.localeCompare(b.label));
}

/** "5 → 34 through cars an hour in the PM peak (+29 cars an hour)". */
export function throughLine(c: { base: number; scen: number; delta: number }, when: string): string {
  return `${round(c.base)} → ${round(c.scen)} through cars an hour in the ${when} (${signedNum(round(c.scen) - round(c.base), 'cars an hour', 0)})`;
}

/** Said when the change is inside the dead band the map draws as thin gray. */
export function noiseNote(delta: number): string | null {
  return Math.abs(delta) < DEAD_BAND_CUTTHROUGH ? `Within normal run-to-run variation (about ${round(DEAD_BAND_CUTTHROUGH)} cars an hour), so the map draws it thin and gray.` : null;
}

/** All cars on the block, for the one block per period the file records them for; null for every other block. */
export function allCarsLine(p: Proposal, pic: ProposalPicture, blockLabel: string, when: string): string | null {
  const b = p.byPeriod[pic.period]?.allTraffic.largestIncrease;
  if (!b || b.block !== blockLabel) return null;
  const through = b.throughIncreaseVehPerHour;
  const split = through === undefined ? '' : `: through cars ${signedNum(through, '', 0).trim()}, local trips ${signedNum(b.increaseVehPerHour - through, '', 0).trim()}`;
  return `All cars on this block, ${when}: ${round(b.baselineVehPerHour)} → ${round(b.scenarioVehPerHour)} an hour (${signedNum(b.increaseVehPerHour, 'cars an hour', 0)}${split}). The file records all cars for this block only.`;
}

/** All cars per block (both directions together) from the file's `pictureAll`, keyed by block; null when the file has none. */
export function allCarsByBlock(p: Pick<Proposal, 'pictureAll'>, index: NetIndex): Map<number, BlockChange> | null {
  return p.pictureAll ? new Map(blockChanges(p.pictureAll, index).map((c) => [c.block, c])) : null;
}

/** "All cars on this block, PM peak: 120 → 328 an hour (+208 cars an hour): through cars +94, local trips +114." `all` is the block's all-car change, `through` its through-car change. */
export function allCarsPictureLine(all: { base: number; scen: number }, through: { base: number; scen: number }, when: string): string {
  const total = round(all.scen) - round(all.base);
  const t = round(through.scen) - round(through.base);
  return `All cars on this block, ${when}: ${round(all.base)} → ${round(all.scen)} an hour (${signedNum(total, 'cars an hour', 0)}): through cars ${signedNum(t, '', 0).trim()}, local trips ${signedNum(total - t, '', 0).trim()}.`;
}

/** The short form for the hover tip: "120 → 328 all cars an hour". */
export function allCarsShort(all: { base: number; scen: number }): string {
  return `${round(all.base)} → ${round(all.scen)} all cars an hour`;
}

export const ALL_CARS_MISSING = 'All cars on this block (through cars and local trips) are not in the published file; it records them only for the block with the largest rise.';

export interface TipText { title: string; lines: string[] }

/** The essential line for a street: its name, through cars today and with the proposal, and all cars when the file has them. */
export function blockTip(label: string, through: string, allShort: string | null): TipText {
  return { title: label, lines: allShort ? [through, allShort] : [through] };
}

/** The essential line for a drawn change; null for `summary` while the redirect data has not loaded. */
export function changeTip(label: string, summary: string | null): TipText {
  return { title: label, lines: summary ? [summary] : [] };
}

export interface Box { left: number; top: number; right: number; bottom: number }

/** Where a tooltip of `size` goes beside `anchor`: below and right by `gap`, flipped to the other side when it would cross `bounds`, then clamped inside them. Everything is in the same coordinate space. */
export function placeTip(anchor: { x: number; y: number }, size: { w: number; h: number }, bounds: Box, gap = 12): { x: number; y: number } {
  const room = (lo: number, hi: number, a: number, len: number) => {
    let v = a + gap;
    if (v + len > hi) v = a - gap - len;
    return Math.max(lo, Math.min(v, hi - len));
  };
  return { x: room(bounds.left, bounds.right, anchor.x, size.w), y: room(bounds.top, bounds.bottom, anchor.y, size.h) };
}

/** True when at least `min` of the box's height and all of its width lies inside the viewport, so selecting a row needs no scroll. */
export function mostlyVisible(box: Box, view: Box, min = 0.9): boolean {
  const h = box.bottom - box.top;
  if (h <= 0) return false;
  const seen = Math.min(box.bottom, view.bottom) - Math.max(box.top, view.top);
  return seen / h >= min && box.left >= view.left - 1 && box.right <= view.right + 1;
}
