import type { DemandIntent } from '../types';
import { intentPaths, type IntentPaths } from './intents';
import type { CorridorDefs, CorridorPeriod } from './corridors';
import type { IntentEnds } from '../../tools/lib/intent-ends';
import { hashMatches } from './proposals';
import { RUN_SECONDS } from './run';
import { base64ToF32, f32ToBase64, resultsBase, RESULT_SEED, type Loaded, type StoredInputs } from './stored-results';
import type { Metrics } from '../types';

/** Today's traffic, one finished hour per period, kept apart by reason: cars an hour for each reason and the links they used, so the Assumptions tab draws each reason's path without simulating. */
export const BASELINE_INTENTS_VERSION = 1;

export interface BaselineIntentsPeriod {
  /** Through cars an hour on the side streets, all reasons. */
  totalVph: number;
  /** One entry per demand intent in order, then `other`. */
  byIntent: { id: string; vehiclesPerHour: number }[];
  /** Float32 stride 3 (slot, link, vehicles), as base64 of the little-endian bytes. */
  intentLinks: string;
  /** Where each reason's cars start and end by approach group, computed from the run (one entry per demand intent in order, then `other`). Absent in older files. */
  ends?: IntentEnds[];
  /** The same through cars sorted by corridor, direction and reason (see `corridors.ts`). Absent in older files and for areas that define no corridors. */
  corridors?: CorridorPeriod;
}
export interface BaselineIntents {
  version: typeof BASELINE_INTENTS_VERSION;
  area: string; inputs: StoredInputs; seed: number; seconds: number; computed: string;
  periods: Record<string, BaselineIntentsPeriod>;
  /** The corridors the periods' `corridors` tables use, and a hash of the settings they were made from. */
  corridorDefs?: CorridorDefs & { configHash: string };
}

export const baselineIntentsUrl = (area: string) => `${resultsBase(area)}/baseline-intents.json`;

export function encodeBaselinePeriod(metrics: Metrics, intentLinks: Float32Array | null, ends?: IntentEnds[], corridors?: CorridorPeriod): BaselineIntentsPeriod | null {
  const by = metrics.cutThrough.byIntent;
  if (!by || !intentLinks) return null;
  return { totalVph: metrics.cutThrough.vehiclesPerHour, byIntent: by.map((b) => ({ id: b.id, vehiclesPerHour: b.vehiclesPerHour })), intentLinks: f32ToBase64(intentLinks), ...(ends ? { ends } : {}), ...(corridors ? { corridors } : {}) };
}

export type BaselineVerdict = 'ok' | 'version' | 'area' | 'run' | 'network' | 'demand' | 'simulator';
/** The same validity the stored results have: this area, the app's seed and run length, and all three inputs equal to what is loaded. */
export function baselineVerdict(f: BaselineIntents, loaded: Loaded): BaselineVerdict {
  if (f.version !== BASELINE_INTENTS_VERSION) return 'version';
  if (f.area !== loaded.area) return 'area';
  if (f.seed !== RESULT_SEED || f.seconds !== RUN_SECONDS) return 'run';
  if (loaded.networkHash === null || !hashMatches(f.inputs.networkHash, loaded.networkHash)) return 'network';
  if (loaded.demandHash === null || !hashMatches(f.inputs.demandHash, loaded.demandHash)) return 'demand';
  if (loaded.simulator === null || f.inputs.simulator !== loaded.simulator) return 'simulator';
  return 'ok';
}

const validCorridors = (c: CorridorPeriod): boolean => !!c && Array.isArray(c.flows) && c.flows.every((f) => typeof f.corridor === 'string' && typeof f.direction === 'string' && typeof f.vph === 'number' && Array.isArray(f.byIntent))
  && Array.isArray(c.crossing) && typeof c.multi?.vph === 'number' && typeof c.multi?.second === 'number';
const validDefs = (d: CorridorDefs): boolean => !!d && Array.isArray(d.corridors) && d.corridors.every((c) => typeof c.id === 'string' && typeof c.name === 'string' && Array.isArray(c.streets))
  && typeof d.otherName === 'string' && typeof d.secondShare === 'number';

export function parseBaselineIntents(text: string): BaselineIntents | null {
  try {
    const r = JSON.parse(text) as BaselineIntents;
    const ok = r?.version === BASELINE_INTENTS_VERSION && typeof r.area === 'string' && typeof r.seconds === 'number' && typeof r.seed === 'number'
      && typeof r.inputs?.networkHash === 'string' && typeof r.inputs?.demandHash === 'string' && typeof r.inputs?.simulator === 'string'
      && typeof r.periods === 'object' && r.periods !== null
      && Object.values(r.periods).every((p) => typeof p.totalVph === 'number' && Array.isArray(p.byIntent) && typeof p.intentLinks === 'string' && (p.corridors === undefined || validCorridors(p.corridors)))
      && (r.corridorDefs === undefined || validDefs(r.corridorDefs));
    return ok ? r : null;
  } catch { return null; }
}

export async function fetchBaselineIntents(area: string): Promise<BaselineIntents | null> {
  try {
    const r = await fetch(baselineIntentsUrl(area));
    return r.ok ? parseBaselineIntents(await r.text()) : null;
  } catch { return null; }
}

/** One reason's typical path in one period's baseline, and its cars an hour; null when the file has no such period or reason. */
export function baselineIntent(f: BaselineIntents, period: string, defs: DemandIntent[], id: string): { vph: number; paths: IntentPaths; ends: IntentEnds | null } | null {
  const p = f.periods[period];
  const slot = defs.findIndex((d) => d.id === id);
  if (!p || slot < 0 || p.byIntent[slot]?.id !== id) return null;
  const vph = p.byIntent[slot].vehiclesPerHour;
  return { vph, paths: intentPaths(base64ToF32(p.intentLinks), slot, id, f.seconds, vph), ends: p.ends?.find((e) => e.id === id) ?? null };
}
