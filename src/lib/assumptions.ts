import { hashMatches } from './proposals';

export const ASSUMPTIONS_VERSION = 1;

/** One group of cars an assumed movement is made of, in cars an hour assigned in each period. */
export interface AssumedIntentView { id: string; label: string; through: boolean; vph: Record<string, number> }
export interface AssumedMovementView {
  id: string; label: string;
  /** The link the cars arrive on, the link they leave on and the junction between them (network ids); absent in a file made before the maps. */
  from?: number; to?: number; node?: number;
  /** A trip joins the movement only when its route through it costs at most this multiple of its best route. */
  maxDetour: number;
  /** Cars an hour the count shows making the movement; midday is scaled from the others (see `count.scaled`). */
  counted: Record<string, number>;
  /** Cars an hour the model assigns to the movement, and how many of those have no end in the study area. */
  assigned: Record<string, { total: number; through: number }>;
  intents: AssumedIntentView[];
  /** Periods in which the count is below the count fit's minimum for a turn: the number is the count, and the model assigns no trips to it. */
  belowThreshold?: Record<string, number>;
  /** Why no trips are assigned in those periods. */
  belowThresholdNote?: string;
}
export interface AssumptionsFile {
  version: typeof ASSUMPTIONS_VERSION;
  area: string; generated: string;
  inputs: { demandHash: string };
  /** What the counted numbers come from and which periods they were measured in; the others are scaled from them. */
  count: { label: string; measured: string[]; scaled: string[] };
  movements: AssumedMovementView[];
}

export const assumptionsUrl = (area: string) => `/data/${area}.assumptions.json`;

export function parseAssumptions(text: string): AssumptionsFile | null {
  try {
    const r = JSON.parse(text) as AssumptionsFile;
    const ok = r?.version === ASSUMPTIONS_VERSION && typeof r.area === 'string' && typeof r.inputs?.demandHash === 'string'
      && typeof r.count?.label === 'string' && Array.isArray(r.count.measured) && Array.isArray(r.count.scaled)
      && Array.isArray(r.movements) && r.movements.every((m) => typeof m.id === 'string' && typeof m.label === 'string' && [m.from, m.to, m.node].every((v) => v === undefined || Number.isInteger(v)) && Array.isArray(m.intents) && typeof m.assigned === 'object' && typeof m.counted === 'object');
    return ok ? r : null;
  } catch { return null; }
}

export async function fetchAssumptions(area: string): Promise<AssumptionsFile | null> {
  try {
    const r = await fetch(assumptionsUrl(area));
    return r.ok ? parseAssumptions(await r.text()) : null;
  } catch { return null; }
}

/** True when the file was made for the demand data that is loaded. An unknown loaded hash is not a difference. */
export const assumptionsCurrent = (f: AssumptionsFile, demandHash: string | null): boolean => demandHash === null || hashMatches(f.inputs.demandHash, demandHash);

/** The movements with their intents as plain sentences: "about half (47%)" style shares, from the assigned volumes of one period. */
export function intentShares(m: AssumedMovementView, period: string): { id: string; label: string; through: boolean; vph: number; pct: number }[] {
  const total = m.intents.reduce((s, i) => s + (i.vph[period] ?? 0), 0);
  return m.intents.filter((i) => (i.vph[period] ?? 0) > 0).map((i) => ({ id: i.id, label: i.label, through: i.through, vph: i.vph[period], pct: total > 0 ? Math.round((100 * i.vph[period]) / total) : 0 }));
}
