// What the card's detail box says when a street or a change is hovered, focused or tapped. Kept out of the component so it can be tested.
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
export function noiseNote(delta: number, band = DEAD_BAND_CUTTHROUGH): string | null {
  return Math.abs(delta) < band ? `Within normal run-to-run variation (about ${round(band)} cars an hour), so the map draws it thin and gray.` : null;
}

/** All cars on the block from the file's single recorded block per period (the one with the largest rise); null for every other block. */
export function allCarsFromFile(p: Proposal, pic: ProposalPicture, blockLabel: string): { base: number; scen: number } | null {
  const b = p.byPeriod[pic.period]?.allTraffic.largestIncrease;
  return b && b.block === blockLabel ? { base: b.baselineVehPerHour, scen: b.scenarioVehPerHour } : null;
}

/** All cars per block (both directions together) from the file's `pictureAll`, keyed by block; null when the file has none. */
export function allCarsByBlock(p: Pick<Proposal, 'pictureAll'>, index: NetIndex): Map<number, BlockChange> | null {
  return p.pictureAll ? new Map(blockChanges(p.pictureAll, index).map((c) => [c.block, c])) : null;
}

/** A change in whole cars with the real minus sign: "+29", "−208", "0". */
export const signedCars = (n: number): string => signedNum(n, '', 0).trim();

export interface FigureRow { label: string; today: number; withProposal: number; change: number }

/** The rows of a street's table, in whole cars an hour: through cars, then local trips and all cars when `all` is known. Local trips are all cars minus through cars, so each row adds up as shown. */
export function blockFigures(through: { base: number; scen: number }, all: { base: number; scen: number } | null): FigureRow[] {
  const row = (label: string, today: number, withProposal: number): FigureRow => ({ label, today, withProposal, change: withProposal - today });
  const tb = round(through.base), ts = round(through.scen);
  const rows = [row('Through cars', tb, ts)];
  if (all) {
    const ab = round(all.base), as = round(all.scen);
    rows.push(row('Local trips', Math.max(0, ab - tb), Math.max(0, as - ts)), row('All cars', ab, as));
  }
  return rows;
}

/** The short form for the hover tip: "120 → 328 all cars an hour". */
export function allCarsShort(all: { base: number; scen: number }): string {
  return `${round(all.base)} → ${round(all.scen)} all cars an hour`;
}

export const ALL_CARS_MISSING = 'All cars on this block (through cars and local trips) are not in the published file; it records them only for the block with the largest rise.';

export interface TipText { title: string; lines: string[] }

/** The one-line form of a street, for the bar that offers the map when it is scrolled away: its name, through cars today and with the proposal, and all cars when the file has them. */
export function blockTip(label: string, through: string, allShort: string | null): TipText {
  return { title: label, lines: allShort ? [allShort, through] : [through] };
}

/** The essential line for a drawn change; null for `summary` while the redirect data has not loaded. */
export function changeTip(label: string, summary: string | null): TipText {
  return { title: label, lines: summary ? [summary] : [] };
}

export interface Box { left: number; top: number; right: number; bottom: number }

/** True when at least `min` of the box's height and all of its width lies inside the viewport, so selecting a row needs no scroll. */
export function mostlyVisible(box: Box, view: Box, min = 0.9): boolean {
  const h = box.bottom - box.top;
  if (h <= 0) return false;
  const seen = Math.min(box.bottom, view.bottom) - Math.max(box.top, view.top);
  return seen / h >= min && box.left >= view.left - 1 && box.right <= view.right + 1;
}
