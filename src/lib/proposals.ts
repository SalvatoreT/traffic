import type { AreaEntry, Intervention } from '../types';
import { interventionKey } from './scenario';

/** Published by the proposals search tool. Shape is the contract in openspec/changes/proposals/design.md. */
export interface Proposal {
  id: string; title: string; summary: string;
  /** Absent means "search". Reference entries are hand-defined packages evaluated with the same metrics. */
  kind?: 'search' | 'reference'; note?: string;
  link: string;
  interventions: { type: string; label: string }[];
  cutThrough: { baselineVehMi: number; scenarioVehMi: number; changePct: number };
  harm: { worstBlock: string; worstIncreaseVehPerHour: number; blocksAboveNoise: number };
  context: {
    boundingStreets: { name: string; flowChangePct: number; speedChangeMph: number }[];
    insideTripTimeChangePct: number;
    pedConflictsChangePct: number; bikeConflictsChangePct: number;
  };
  byPeriod: Record<string, { cutThroughChangePct: number; worstIncreaseVehPerHour: number }>;
}
export interface Proposals {
  version: 1; area: string;
  computed: { date: string; periods: string[]; seeds: number[]; networkHash: string; demandHash: string; calibration: string };
  baseline: { cutThroughVehMi: Record<string, number> };
  proposals: Proposal[];
}

export type ProposalsState =
  | { status: 'idle' | 'loading' }
  | { status: 'none' }
  | { status: 'ready'; file: Proposals };

export const proposalsUrl = (entry: Pick<AreaEntry, 'id' | 'proposals'>): string =>
  entry.proposals ? (entry.proposals.startsWith('/') || entry.proposals.startsWith('http') ? entry.proposals : `/data/${entry.proposals}`) : `/data/${entry.id}.proposals.json`;

/** A missing file, an SPA fallback page or a file of another version all mean "none computed yet". */
export function parseProposals(text: string): Proposals | null {
  try {
    const f = JSON.parse(text) as Proposals;
    if (f?.version !== 1 || !Array.isArray(f.proposals) || !f.computed) return null;
    return f;
  } catch { return null; }
}

export async function fetchProposals(url: string): Promise<Proposals | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return parseProposals(await r.text());
  } catch { return null; }
}

/**
 * The one place that decides how the file's hashes are computed: SHA-256 hex of the UTF-8 bytes of the
 * network and demand JSON text as served. If the search tool records a different recipe, change only this.
 */
export async function hashText(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const d = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(d), (b) => b.toString(16).padStart(2, '0')).join('');
}

export interface LoadedHashes { network: string | null; demand: string | null }
export async function hashLoaded(raw: { network: string; demand: string } | undefined): Promise<LoadedHashes> {
  if (!raw || !globalThis.crypto?.subtle) return { network: null, demand: null };
  try { return { network: await hashText(raw.network), demand: await hashText(raw.demand) }; } catch { return { network: null, demand: null }; }
}

/** The file may record a truncated digest, so compare by prefix. An empty or very short record never matches. */
export function hashMatches(recorded: string, actual: string): boolean {
  const r = recorded.trim().toLowerCase();
  return r.length >= 8 && actual.toLowerCase().startsWith(r);
}

/** Which inputs differ from what the file was computed on. An unknown actual hash is not treated as a difference. */
export function staleInputs(computed: Pick<Proposals['computed'], 'networkHash' | 'demandHash'>, loaded: LoadedHashes): ('network' | 'demand')[] {
  const out: ('network' | 'demand')[] = [];
  if (loaded.network !== null && !hashMatches(computed.networkHash, loaded.network)) out.push('network');
  if (loaded.demand !== null && !hashMatches(computed.demandHash, loaded.demand)) out.push('demand');
  return out;
}

export interface Notices { exploratory: boolean; stale: boolean; staleText: string }
export function proposalNotices(computed: Proposals['computed'], loaded: LoadedHashes): Notices {
  const s = staleInputs(computed, loaded);
  const what = s.length === 2 ? 'street network and demand have' : s[0] === 'network' ? 'street network has' : 'demand has';
  return {
    exploratory: computed.calibration !== 'calibrated',
    stale: s.length > 0,
    staleText: s.length ? `The ${what} changed since these options were computed, so the numbers are out of date.` : '',
  };
}

// --- formatting

const MINUS = '−';
const num = (x: number, dp = 1) => Math.abs(x).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: dp });
/** Whole percent from 10 up, one decimal below. */
const pctDigits = (x: number) => (Math.abs(x) < 10 ? 1 : 0);
const isZero = (x: number, dp: number) => +Math.abs(x).toFixed(dp) === 0;

export function signedPct(x: number): string {
  const dp = pctDigits(x);
  if (!Number.isFinite(x)) return '—';
  if (isZero(x, dp)) return '0%';
  return `${x < 0 ? MINUS : '+'}${num(x, dp)}%`;
}
export function signedNum(x: number, unit: string, dp = 1): string {
  if (!Number.isFinite(x)) return '—';
  if (isZero(x, dp)) return `0 ${unit}`;
  return `${x < 0 ? MINUS : '+'}${num(x, dp)} ${unit}`;
}

export function cutThroughHeadline(c: Proposal['cutThrough']): { figure: string; label: string; detail: string } {
  const dp = pctDigits(c.changePct);
  const zero = isZero(c.changePct, dp);
  return {
    figure: zero ? 'No change' : `${c.changePct < 0 ? MINUS : '+'}${num(c.changePct, dp)}%`,
    label: 'cut-through',
    detail: `${c.baselineVehMi.toFixed(1)} → ${c.scenarioVehMi.toFixed(1)} veh-mi`,
  };
}

export function harmHeadline(h: Proposal['harm']): { figure: string; label: string; none: boolean; blocks: string } {
  const none = !(h.worstIncreaseVehPerHour > 0);
  const n = h.blocksAboveNoise;
  return {
    none,
    figure: none ? 'None' : `+${num(h.worstIncreaseVehPerHour, 0)} veh/h`,
    label: none ? 'No street gains traffic beyond normal variation' : `on ${h.worstBlock}`,
    blocks: n > 0 ? (n === 1 ? '1 block gains traffic' : `${n} blocks gain traffic`) : '',
  };
}

export function formatComputed(c: Proposals['computed'], periodLabel: (id: string) => string): string {
  const d = new Date(c.date);
  const when = Number.isNaN(d.getTime()) ? c.date : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  const periods = c.periods.map(periodLabel);
  const list = periods.length <= 1 ? periods.join('') : `${periods.slice(0, -1).join(', ')} and ${periods[periods.length - 1]}`;
  const n = c.seeds.length;
  return `Computed ${when} for ${list || 'the searched periods'}, averaged over ${n} simulation ${n === 1 ? 'run' : 'runs'} with different random seeds.`;
}

// --- opening on the map

const sameSet = (a: Intervention[], b: Intervention[]) => {
  const k = new Set(a.map(interventionKey));
  return a.length === b.length && b.every((x) => k.has(interventionKey(x)));
};
/** Replacing a scenario the user built is the only case that needs a confirmation. */
export function needsConfirm(current: Intervention[], next: Intervention[]): boolean {
  return current.length > 0 && !sameSet(current, next);
}

export type OpenState = { step: 'idle' } | { step: 'confirm'; id: string };
export type OpenAction = { type: 'ask'; id: string } | { type: 'cancel' } | { type: 'done' };
export function openReducer(s: OpenState, a: OpenAction): OpenState {
  switch (a.type) {
    case 'ask': return { step: 'confirm', id: a.id };
    case 'cancel': case 'done': return s.step === 'idle' ? s : { step: 'idle' };
  }
}
/** Links are stored as scenario-link fragments; accept them with or without the leading `#`. */
export const linkHash = (link: string) => (link.startsWith('#') ? link : `#${link}`);

/** Search options keep file order (fewest interventions to greatest reduction); reference entries are listed apart. */
export function splitProposals(file: Proposals): { search: Proposal[]; reference: Proposal[] } {
  const reference = file.proposals.filter((p) => p.kind === 'reference');
  return { search: file.proposals.filter((p) => p.kind !== 'reference'), reference };
}
