import type { AreaEntry, Intervention } from '../types';
import { interventionKey } from './scenario';

/** Published by the proposals search tool. Shape is the contract in openspec/changes/proposals/design.md. */
export interface Proposal {
  id: string; title: string; summary: string;
  /** Absent means "search". Reference entries are hand-defined packages evaluated with the same metrics. */
  kind?: 'search' | 'reference'; note?: string;
  link: string;
  interventions: { type: string; label: string }[];
  /** Through cars an hour across the area's side streets, averaged over the searched periods. */
  cutThrough: CutThrough;
  /** The side-street block that gains the most THROUGH cars an hour (both directions), averaged over the same periods. */
  harm: { through: { worstBlock: string; increaseVehPerHour: number; blocksAboveNoise: number } };
  context: {
    boundingStreets: { name: string; flowChangePct: number; speedChangeMph: number }[];
    insideTripTimeChangePct: number;
    pedConflictsChangePct: number; bikeConflictsChangePct: number;
  };
  byPeriod: Record<string, PeriodResult>;
}
export interface CutThrough { baselineVehPerHour: number; scenarioVehPerHour: number; changePct: number }
/** One period. `allTraffic` counts every car on the one block that gains the most, local trips included. */
export interface PeriodResult {
  cutThrough: CutThrough;
  allTraffic: { worstBlock: string; baselineVehPerHour: number; scenarioVehPerHour: number; throughIncreaseVehPerHour: number; blocksAboveNoise: number };
}
/** One ranked list: the packages found under one set of limits. */
export interface ProposalGroup {
  id: string; title: string; note: string;
  computed: { date: string; periods: string[]; seeds: number[]; networkHash: string; demandHash: string; calibration: string };
  baseline: { cutThroughVehPerHour: Record<string, number> };
  proposals: Proposal[];
  /** Computed with an earlier measure (vehicle-miles, or an all-traffic worst block beside through cars). Its options are not shown; they need to be computed again. */
  legacy?: boolean;
}
export interface Proposals { version: 4; area: string; groups: ProposalGroup[] }

export const UNCONSTRAINED_GROUP = {
  id: 'unconstrained', title: 'Without limits',
  note: 'Every tool except new traffic lights, anywhere in the area. Shown for comparison.',
};

export type ProposalsState =
  | { status: 'idle' | 'loading' }
  | { status: 'none' }
  | { status: 'ready'; file: Proposals };

export const proposalsUrl = (entry: Pick<AreaEntry, 'id' | 'proposals'>): string =>
  entry.proposals ? (entry.proposals.startsWith('/') || entry.proposals.startsWith('http') ? entry.proposals : `/data/${entry.proposals}`) : `/data/${entry.id}.proposals.json`;

/**
 * A missing file, an SPA fallback page or a file of another version all mean "none computed yet".
 * A version 1 file (one list, no groups) is read as the single unconstrained group. A group computed before the figures were like-for-like
 * (no through-car count, or no through-car worst block, or no per-period all-traffic entry) is kept but marked `legacy` with no options,
 * so it reads as out of date instead of failing.
 */
const finite = (x: unknown) => typeof x === 'number' && Number.isFinite(x);
const hasCount = (c: CutThrough | undefined) => finite(c?.baselineVehPerHour) && finite(c?.scenarioVehPerHour) && finite(c?.changePct);
const isCurrent = (p: Proposal) => hasCount(p?.cutThrough) && finite(p?.harm?.through?.increaseVehPerHour) && finite(p?.harm?.through?.blocksAboveNoise)
  && Object.values(p.byPeriod ?? {}).every((v) => hasCount(v?.cutThrough) && finite(v?.allTraffic?.baselineVehPerHour) && finite(v?.allTraffic?.scenarioVehPerHour) && finite(v?.allTraffic?.throughIncreaseVehPerHour) && finite(v?.allTraffic?.blocksAboveNoise));
function normalizeGroup(g: ProposalGroup): ProposalGroup {
  if (g.proposals.every(isCurrent)) return g;
  return { ...g, legacy: true, proposals: [], baseline: { cutThroughVehPerHour: {} } };
}

export function parseProposals(text: string): Proposals | null {
  try {
    const f = JSON.parse(text) as { version?: number; area?: string; groups?: ProposalGroup[]; computed?: ProposalGroup['computed']; baseline?: ProposalGroup['baseline']; proposals?: Proposal[] };
    if (f?.version === 1 && Array.isArray(f.proposals) && f.computed) {
      return { version: 4, area: f.area ?? '', groups: [normalizeGroup({ ...UNCONSTRAINED_GROUP, computed: f.computed, baseline: f.baseline ?? { cutThroughVehPerHour: {} }, proposals: f.proposals })] };
    }
    if (!(f?.version === 2 || f?.version === 3 || f?.version === 4) || !Array.isArray(f.groups)) return null;
    const groups = f.groups.filter((g) => g && typeof g.id === 'string' && Array.isArray(g.proposals) && g.computed)
      .map((g) => normalizeGroup({ ...g, title: g.title || g.id, note: g.note ?? '' }));
    return { version: 4, area: f.area ?? '', groups };
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
export function staleInputs(computed: Pick<ProposalGroup['computed'], 'networkHash' | 'demandHash'>, loaded: LoadedHashes): ('network' | 'demand')[] {
  const out: ('network' | 'demand')[] = [];
  if (loaded.network !== null && !hashMatches(computed.networkHash, loaded.network)) out.push('network');
  if (loaded.demand !== null && !hashMatches(computed.demandHash, loaded.demand)) out.push('demand');
  return out;
}

export interface Notices { exploratory: boolean; stale: boolean; staleText: string }
export function proposalNotices(computed: ProposalGroup['computed'], loaded: LoadedHashes): Notices {
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

/** "the PM peak", or "the average of the AM peak, PM peak and midday" when more than one period was searched. */
export function periodsPhrase(periods: string[], periodLabel: (id: string) => string): string {
  const names = periods.map(periodLabel);
  if (names.length === 0) return 'the searched periods';
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  return names.length === 1 ? `the ${list}` : `the average of the ${list}`;
}

const carsWord = (n: number) => (n === 1 ? 'car' : 'cars');

/** Figure 1: through cars an hour across all the area's side streets. `when` is a `periodsPhrase`. */
export function cutThroughHeadline(c: CutThrough, when = 'the searched periods'): { figure: string; label: string; detail: string; definition: string } {
  const b = Math.round(c.baselineVehPerHour), s = Math.round(c.scenarioVehPerHour);
  const d = s - b;
  const dp = pctDigits(c.changePct);
  const pct = isZero(c.changePct, dp) ? '0%' : `${c.changePct < 0 ? MINUS : '+'}${num(c.changePct, dp)}%`;
  return {
    figure: d === 0 ? 'No change' : `${d < 0 ? MINUS : '+'}${Math.abs(d)} cars an hour`,
    label: 'cutting through',
    detail: `${b} → ${s} through cars an hour (${pct})`,
    definition: `Through cars on all of the area's side streets together: cars that cross the area without a trip that starts or ends in it. Each car is counted once. Shown for ${when}.`,
  };
}

/**
 * Figure 2: the same kind of car as figure 1 (through cars an hour, same averaging), on the one side-street block that gains the most.
 * It is shown only when the gain is past run-to-run variation.
 */
export function harmHeadline(h: Proposal['harm'], when = 'the searched periods'): { none: boolean; figure: string; label: string; definition: string } {
  const t = h.through;
  const n = t.blocksAboveNoise;
  const none = !(n > 0 && Math.round(t.increaseVehPerHour) > 0);
  const scope = `Through cars only, both directions of that one block, for ${when}.`;
  if (none) {
    return { none, figure: '', label: 'No block gains through traffic beyond run-to-run variation', definition: `Through cars only, counted block by block, for ${when}.` };
  }
  const others = n - 1;
  const tail = others === 0 ? 'No other block gains beyond run-to-run variation.' : `${others} other ${others === 1 ? 'block' : 'blocks'} also ${others === 1 ? 'gains' : 'gain'} through cars beyond run-to-run variation.`;
  return {
    none,
    figure: `+${Math.round(t.increaseVehPerHour)} through ${carsWord(Math.round(t.increaseVehPerHour))} an hour`,
    label: `on ${t.worstBlock}, the block that gains the most`,
    definition: `${scope} ${tail}`,
  };
}

/** "128 → 101 (−21%)": cars an hour first, the percentage second. */
export function beforeAfterPct(c: CutThrough): string {
  return `${Math.round(c.baselineVehPerHour)} → ${Math.round(c.scenarioVehPerHour)} (${signedPct(c.changePct)})`;
}

export interface AllTrafficRow {
  period: string; block: string | null;
  /** Cars an hour on that block, all trips together. */
  before: number; after: number;
  /** Change in all cars, and its split into through cars and local trips (all cars minus through cars). */
  change: number; through: number; local: number;
  blocksAbove: number;
}
/** One row per period for the details table. A period with no block past run-to-run variation names none. */
export function allTrafficRows(p: Proposal, periodLabel: (id: string) => string): AllTrafficRow[] {
  return Object.entries(p.byPeriod).map(([id, v]) => {
    const a = v.allTraffic;
    const above = a.blocksAboveNoise > 0;
    const change = a.scenarioVehPerHour - a.baselineVehPerHour;
    return {
      period: periodLabel(id), block: above ? a.worstBlock : null,
      before: a.baselineVehPerHour, after: a.scenarioVehPerHour,
      change, through: a.throughIncreaseVehPerHour, local: change - a.throughIncreaseVehPerHour,
      blocksAbove: a.blocksAboveNoise,
    };
  });
}

/**
 * The one sentence on what the extra cars are, built from the numbers: over the periods where a block gains beyond noise, the share of
 * its gain that is through cars and the share that is local trips. It says "mostly local trips" only when local trips are most of the gain.
 * The model holds the number of trips fixed, so a rise in local trips on a block is trips moving, not new traffic.
 */
export function allTrafficNote(rows: AllTrafficRow[]): string {
  const r = rows.filter((x) => x.block !== null && x.change > 0);
  const gain = r.reduce((t, x) => t + x.change, 0);
  if (!(gain > 0)) return '';
  const through = Math.round(100 * Math.min(1, Math.max(0, r.reduce((t, x) => t + x.through, 0) / gain)));
  const local = 100 - through;
  const lead = local >= 50
    ? `Mostly local trips: about ${local}% of the extra cars on these blocks are local trips (people who start or end a trip in the area) taking another way around, and about ${through}% are through cars.`
    : `About ${through}% of the extra cars on these blocks are through cars and about ${local}% are local trips (people who start or end a trip in the area).`;
  return `${lead} The simulation keeps the number of trips fixed, so these are trips moving from one street to another, not new traffic.`;
}

export function formatComputed(c: ProposalGroup['computed'], periodLabel: (id: string) => string): string {
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
export function splitProposals(file: Pick<ProposalGroup, 'proposals'>): { search: Proposal[]; reference: Proposal[] } {
  const reference = file.proposals.filter((p) => p.kind === 'reference');
  return { search: file.proposals.filter((p) => p.kind !== 'reference'), reference };
}

export const allProposals = (file: Proposals): Proposal[] => file.groups.flatMap((g) => g.proposals);
