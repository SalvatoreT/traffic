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
  /** Id of the corridor (`corridors`) whose street the movement turns from or onto; absent when the area defines no corridors or none fits. */
  corridor?: string;
}
/**
 * Stations whose hourly target is a daily total times assumed factors (AADT or ramp ADT): in the fit as inputs, never held out, not judged (change derived-targets-not-judged).
 * Absent in a file made before the change, and then the Assumptions tab shows no section for them.
 */
export interface DerivedTargetsView {
  /** Assumed peak-hour share of the daily total, for streets and for ramps (fractions), and the assumed inbound share of each period. */
  kFactor: number; rampKFactor: number; inboundShare: Record<string, number>;
  stations: { id: string; label: string; kind: string; source: string; year: number | null; targets: Record<string, number> }[];
}
export interface AssumptionsFile {
  version: typeof ASSUMPTIONS_VERSION;
  area: string; generated: string;
  inputs: { demandHash: string };
  /** What the counted numbers come from and which periods they were measured in; the others are scaled from them. */
  count: { label: string; measured: string[]; scaled: string[] };
  movements: AssumedMovementView[];
  /** The corridors the movements are grouped under, in the area's order (area config `cutThroughCorridors`). */
  corridors?: { id: string; name: string }[];
  derivedTargets?: DerivedTargetsView;
}

export const assumptionsUrl = (area: string) => `/data/${area}.assumptions.json`;

export function parseAssumptions(text: string): AssumptionsFile | null {
  try {
    const r = JSON.parse(text) as AssumptionsFile;
    const ok = r?.version === ASSUMPTIONS_VERSION && typeof r.area === 'string' && typeof r.inputs?.demandHash === 'string'
      && typeof r.count?.label === 'string' && Array.isArray(r.count.measured) && Array.isArray(r.count.scaled)
      && (r.corridors === undefined || (Array.isArray(r.corridors) && r.corridors.every((c) => typeof c.id === 'string' && typeof c.name === 'string')))
      && (r.derivedTargets === undefined || (typeof r.derivedTargets.kFactor === 'number' && typeof r.derivedTargets.rampKFactor === 'number' && Array.isArray(r.derivedTargets.stations)))
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

/** The two assumed factors in one sentence, from the numbers the data file carries, with the period names people see. */
export function derivedFactorsSentence(d: DerivedTargetsView, pm: string, name: (id: string) => string): string {
  const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;
  const inbound = d.inboundShare[pm];
  return `Assumed peak-hour share of the daily total (K): ${pct(d.kFactor)} for streets and ${pct(d.rampKFactor)} for ramps.${inbound === undefined ? '' : ` Assumed split on a two-way street in the ${name(pm)}: ${pct(inbound)} inbound and ${pct(1 - inbound)} outbound.`} The other periods take the ${name(pm)} figure times an assumed period factor.`;
}

/** The movements with their intents as plain sentences: "about half (47%)" style shares, from the assigned volumes of one period. */
export function intentShares(m: AssumedMovementView, period: string): { id: string; label: string; through: boolean; vph: number; pct: number }[] {
  const total = m.intents.reduce((s, i) => s + (i.vph[period] ?? 0), 0);
  return m.intents.filter((i) => (i.vph[period] ?? 0) > 0).map((i) => ({ id: i.id, label: i.label, through: i.through, vph: i.vph[period], pct: total > 0 ? Math.round((100 * i.vph[period]) / total) : 0 }));
}

/** The below-threshold note with period ids replaced by the names people see, and a typographic apostrophe. */
export function belowThresholdText(note: string, periodIds: string[], name: (id: string) => string): string {
  let out = note.replace(/'/g, '’');
  for (const id of periodIds) out = out.split(id).join(name(id));
  return out;
}

export const MAP_UNAVAILABLE: Record<'loading' | 'pending' | 'missing' | 'stale', string> = {
  loading: 'Map loading.',
  pending: 'Map loading: it appears once the simulation engine has started.',
  missing: 'Map not available yet: the stored traffic for this model is being updated.',
  stale: 'Map not available yet: the stored traffic for this version of the model is being updated.',
};
