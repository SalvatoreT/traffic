import type { Intervention, Metrics, Network } from '../types';
import type { StatsMsg } from '../sim/client';
import { encodeScenario } from './hash';
import { RUN_SECONDS } from './run';
import { hashMatches, hashText } from './proposals';

/** A finished hour of one scenario in one period, with today's baseline beside it, as the app would show it after running to the end itself. */
export const RESULT_VERSION = 1;
/** The seed the app runs with. */
export const RESULT_SEED = 1;

/** Link stats are stride 4 and intent links stride 3, both Float32: stored as base64 of the little-endian bytes so values round-trip exactly. */
export interface StoredStats { metrics: Metrics; linkStats: string; intentLinks?: string }
export interface StoredInputs { networkHash: string; demandHash: string; simulator: string }
export interface StoredResult {
  version: typeof RESULT_VERSION;
  area: string; period: string; key: string;
  /** The canonical scenario: its link items, sorted and joined by `~`. */
  items: string;
  inputs: StoredInputs;
  seed: number; demandScale: 1; seconds: number;
  computed: string;
  scenario: StoredStats; baseline: StoredStats;
}
export interface StoredIndexEntry { key: string; period: string; items: string; proposals: { group: string; id: string }[] }
export interface StoredIndex { version: typeof RESULT_VERSION; area: string; inputs: StoredInputs; computed: string; results: StoredIndexEntry[] }

/** What the app has loaded and is running, to compare a stored result against. `simulator` is null on the mock engine. */
export interface Loaded { area: string; networkHash: string | null; demandHash: string | null; simulator: string | null }

export const STORED_NOTE = 'Showing the stored result of this simulation. Run again to watch it.';

export const resultsBase = (area: string) => `/data/results/${area}`;
export const resultUrl = (area: string, key: string) => `${resultsBase(area)}/${key}.json`;

/** Order-independent form of a scenario, as the link encodes its interventions. */
export function canonicalItems(net: Network, interventions: Intervention[]): string {
  const hash = encodeScenario(net, interventions, { area: null });
  const s = hash.split(';').find((t) => t.startsWith('s='));
  return s ? s.slice(2).split('~').sort().join('~') : '';
}

/** Stable name of one (scenario, period): the first 16 hex characters of the SHA-256 of the canonical scenario and the period. */
export async function resultKey(net: Network, interventions: Intervention[], period: string): Promise<string> {
  return (await hashText(`${canonicalItems(net, interventions)}|${period}`)).slice(0, 16);
}

export function f32ToBase64(a: Float32Array): string {
  const bytes = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
export function base64ToF32(b64: string): Float32Array {
  const s = atob(b64);
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return new Float32Array(bytes.buffer, 0, Math.floor(bytes.length / 4));
}

export const encodeStats = (s: { metrics: Metrics; linkStats: Float32Array; intentLinks?: Float32Array | null }): StoredStats => ({
  metrics: s.metrics,
  linkStats: f32ToBase64(s.linkStats),
  ...(s.intentLinks && s.intentLinks.length ? { intentLinks: f32ToBase64(s.intentLinks) } : {}),
});

/** The message the live simulation would have posted at the end of the hour. */
export function toStatsMsg(r: StoredResult): StatsMsg {
  const side = (s: StoredStats) => ({ metrics: s.metrics, linkStats: base64ToF32(s.linkStats), intentLinks: s.intentLinks ? base64ToF32(s.intentLinks) : null });
  return { time: r.seconds, comparing: true, scenario: side(r.scenario), baseline: side(r.baseline), achievedSpeed: null };
}

export type Verdict = 'ok' | 'version' | 'area' | 'period' | 'key' | 'network' | 'demand' | 'simulator' | 'run';

/**
 * A stored result applies only when it is for this scenario and period at the app's seed, demand level and run length, and all three
 * inputs match what is loaded: the network, the demand and the simulator code. An input the app could not compute never matches.
 */
export function verdict(r: StoredResult, want: { key: string; period: string; demandScale: number }, loaded: Loaded): Verdict {
  if (r.version !== RESULT_VERSION) return 'version';
  if (r.area !== loaded.area) return 'area';
  if (r.period !== want.period) return 'period';
  if (r.key !== want.key) return 'key';
  if (want.demandScale !== 1 || r.demandScale !== 1 || r.seed !== RESULT_SEED || r.seconds !== RUN_SECONDS) return 'run';
  if (loaded.networkHash === null || !hashMatches(r.inputs.networkHash, loaded.networkHash)) return 'network';
  if (loaded.demandHash === null || !hashMatches(r.inputs.demandHash, loaded.demandHash)) return 'demand';
  if (loaded.simulator === null || r.inputs.simulator !== loaded.simulator) return 'simulator';
  return 'ok';
}

const isStats = (s: unknown): s is StoredStats => {
  const x = s as StoredStats | undefined;
  return !!x && typeof x.metrics === 'object' && x.metrics !== null && typeof x.linkStats === 'string' && (x.intentLinks === undefined || typeof x.intentLinks === 'string');
};
/** Anything that is not a well-formed result of this version (a missing file served as the app page, an older format) reads as none. */
export function parseResult(text: string): StoredResult | null {
  try {
    const r = JSON.parse(text) as StoredResult;
    const ok = r?.version === RESULT_VERSION && typeof r.key === 'string' && typeof r.period === 'string' && typeof r.area === 'string'
      && typeof r.inputs?.networkHash === 'string' && typeof r.inputs?.demandHash === 'string' && typeof r.inputs?.simulator === 'string'
      && typeof r.seconds === 'number' && isStats(r.scenario) && isStats(r.baseline);
    return ok ? r : null;
  } catch { return null; }
}

export async function fetchResult(area: string, key: string): Promise<StoredResult | null> {
  try {
    const r = await fetch(resultUrl(area, key));
    if (!r.ok) return null;
    return parseResult(await r.text());
  } catch { return null; }
}
