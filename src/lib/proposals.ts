import type { AreaEntry, Intervention } from '../types';
import { interventionKey } from './scenario';

/**
 * What a seed interval says about the sign of an effect. `increase` and `decrease` are resolved: the 95% interval over seeds lies on one side of
 * zero. `unresolved`: it includes zero. `insufficient`: fewer than 10 seed pairs, so no statement.
 */
export type EffectStatus = 'increase' | 'decrease' | 'unresolved' | 'insufficient';
/** A paired effect (scenario minus baseline on the same period and seed): mean, spread, runs and the interval over seeds. Cars an hour unless stated. */
export interface Effect { n: number; mean: number; sd: number; interval?: [number, number]; status: EffectStatus }
/** One side-street block and its increase, averaged over the stated runs. `effect` is absent in files written before intervals were recorded. */
export interface BlockIncrease {
  block: string; baselineVehPerHour: number; scenarioVehPerHour: number; increaseVehPerHour: number;
  /** All-traffic rows only: the part of the change that is through cars. */
  throughIncreaseVehPerHour?: number; effect?: Effect;
}
/**
 * The block behind the search's ranking penalty: its largest increase past an assumed noise band. It is not "the block that gains the most":
 * a block with a wide band can have a smaller raw increase. `penaltyVehPerHour` is null in version 4 files, which recorded only this block.
 */
export interface AdjustedPenalty {
  block: string | null; penaltyVehPerHour: number | null;
  /** Version 4 only: what the file recorded on that block. */
  baselineVehPerHour?: number; scenarioVehPerHour?: number; increaseVehPerHour?: number; throughIncreaseVehPerHour?: number;
}
export interface ThroughHarm {
  /** Absent in version 4 files, whose single worst block was chosen by the noise rule. */
  largestIncrease?: BlockIncrease;
  adjustedPenalty: AdjustedPenalty;
  /** Blocks past the assumed noise band. */
  blocksAboveBand: number;
  /** Blocks whose seed interval is above zero. Absent in version 4 files. */
  blocksResolvedIncrease?: number;
}
/**
 * A near-duplicate of a published option that the search folded into it: a tweak the card offers. `differs` says in plain lines what changes
 * against the option. `cutThrough` comes from the runs that chose it, which are not the option's own runs when the option was confirmed.
 */
export interface Variant {
  link: string; differs: string[]; why?: string; origin?: { kind: string };
  cutThrough?: { baselineVehPerHour: number; scenarioVehPerHour: number; changePct: number; role?: string; seeds?: number[] };
}
export interface Proposal {
  id: string; title: string; summary: string;
  /** Tweaks of this option, opened by their scenario link and run live. Not stored results, not share paths. */
  variants?: Variant[];
  /** Absent means "search". Reference entries are hand-defined packages evaluated with the same metrics. */
  kind?: 'search' | 'reference'; note?: string;
  link: string;
  interventions: { type: string; label: string }[];
  /** Through cars an hour across the area's side streets, averaged over the searched periods and the seeds. */
  cutThrough: CutThrough;
  /** Through cars only, averaged over the same periods and seeds. */
  harm: { through: ThroughHarm };
  context: {
    boundingStreets: { name: string; flowChangePct: number; speedChangeMph: number }[];
    insideTripTimeChangePct: number;
    pedConflictsChangePct: number; bikeConflictsChangePct: number;
  };
  byPeriod: Record<string, PeriodResult>;
  /** The runs behind the figures. Absent in files written before it was recorded. */
  evidence?: ProposalEvidence;
  /** Per-link through cars for the card's picture. Absent in files written before pictures; the card then shows none. */
  picture?: ProposalPicture;
}
/**
 * `selection`: the runs that chose this option also estimate it, so the intervals are exploratory. `confirmation`: a frozen shortlist rerun on seeds
 * that took no part in choosing. `reference`: a hand-defined package, not a candidate for the options.
 */
export interface ProposalEvidence {
  role: 'selection' | 'confirmation' | 'reference'; seeds: number[];
  /** Through cars an hour per seed, by period. */
  baselineVehPerHour: Record<string, number[]>; scenarioVehPerHour: Record<string, number[]>;
}
/**
 * Through cars an hour on the links that carry any, in one period, averaged over the search's seeds: today (`base`) and with the package (`scen`),
 * parallel to `links` (link ids). Links with no through cars in either column are left out.
 */
export interface ProposalPicture { period: string; links: number[]; base: number[]; scen: number[] }
export interface CutThrough {
  baselineVehPerHour: number; scenarioVehPerHour: number; changePct: number;
  /** Scenario minus baseline in through cars an hour, paired by seed. */
  effect?: Effect;
  /** The same change in percent of the baseline mean. */
  changePctEffect?: Effect | null;
}
/** One period. `allTraffic` counts every car on the one block with the largest raw increase, local trips included. */
export interface PeriodResult {
  cutThrough: CutThrough;
  allTraffic: { largestIncrease?: BlockIncrease; adjustedPenalty: AdjustedPenalty; blocksAboveBand: number };
}
/** How an option's cut in through cars compares with the next simpler option's on the same seeds, in points of the baseline. */
export type ComparisonStatus = 'better' | 'worse' | 'unresolved' | 'insufficient';
export interface ComparisonEffect extends Omit<Effect, 'status'> { status: ComparisonStatus }
export interface OptionComparison { option: string; against: string; extraCutVehPerHour: ComparisonEffect; extraCutPoints?: ComparisonEffect }
/** What a group records about how its figures were made. Every field after `calibration` is absent in version 4 files. */
export interface Computed {
  date: string; periods: string[]; seeds: number[]; minutes?: number; networkHash: string; demandHash: string; calibration: string;
  simulator?: string; reportMethod?: string; sourceRevision?: string;
  settings?: Record<string, unknown>;
  estimation?: {
    method: string; level: number; minPairs: number; aggregation: string; scope: string; maximum: string; practicalFloors: string;
    selection: { estimates: 'exploratory' | 'confirmation'; discoverySeeds: number[]; confirmationSeeds: number[]; shortlist: string[] };
  };
}
/** One search's list of packages. Files written before 2026-11-15 hold several (one per set of limits); the reader shows their options as one list. */
export interface ProposalGroup {
  id: string; title: string; note: string;
  computed: Computed;
  baseline: { cutThroughVehPerHour: Record<string, number> };
  optionComparisons?: OptionComparison[];
  proposals: Proposal[];
  /** Computed with an earlier measure (vehicle-miles, or an all-traffic worst block beside through cars). Its options are not shown; they need to be computed again. */
  legacy?: boolean;
}
/** Version 5 records provenance and paired intervals. Version 4 is still read: its figures are shown and marked as lacking that evidence. */
export interface Proposals { version: 4 | 5; area: string; groups: ProposalGroup[]
  /** Set when the published options were taken down: the reason, shown in place of the list. */
  withdrawn?: string;
}

export const UNCONSTRAINED_GROUP = { id: 'unconstrained', title: 'Proposals', note: '' };

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
 * so it reads as out of date instead of failing. A version 4 group (like-for-like, but no provenance, intervals or raw maximum) is read into the
 * current shape: its one worst block becomes the adjusted-penalty block, and it has no largest-increase block, so no reader can present it as one.
 */
const finite = (x: unknown) => typeof x === 'number' && Number.isFinite(x);
const hasCount = (c: CutThrough | undefined) => finite(c?.baselineVehPerHour) && finite(c?.scenarioVehPerHour) && finite(c?.changePct);
interface V4Harm { worstBlock?: unknown; increaseVehPerHour?: unknown; blocksAboveNoise?: unknown }
interface V4All { worstBlock?: unknown; baselineVehPerHour?: unknown; scenarioVehPerHour?: unknown; throughIncreaseVehPerHour?: unknown; blocksAboveNoise?: unknown }
const isBlockIncrease = (b: BlockIncrease | undefined) => !!b && typeof b.block === 'string' && finite(b.baselineVehPerHour) && finite(b.scenarioVehPerHour) && finite(b.increaseVehPerHour);
const isV5Through = (t: ThroughHarm | undefined) => isBlockIncrease(t?.largestIncrease) && finite(t?.blocksAboveBand) && typeof t?.adjustedPenalty === 'object';
const isV4Through = (t: V4Harm | undefined) => finite(t?.increaseVehPerHour) && finite(t?.blocksAboveNoise);
const isV5All = (a: PeriodResult['allTraffic'] | undefined) => !!a && isBlockIncrease(a.largestIncrease) && finite(a.blocksAboveBand);
const isV4All = (a: V4All | undefined) => finite(a?.baselineVehPerHour) && finite(a?.scenarioVehPerHour) && finite(a?.throughIncreaseVehPerHour) && finite(a?.blocksAboveNoise);
const isCurrent = (p: Proposal) => {
  if (!hasCount(p?.cutThrough)) return false;
  const t = p.harm?.through;
  const v5 = isV5Through(t);
  if (!v5 && !isV4Through(t as V4Harm)) return false;
  return Object.values(p.byPeriod ?? {}).every((v) => hasCount(v?.cutThrough) && (v5 ? isV5All(v?.allTraffic) : isV4All(v?.allTraffic as V4All)));
};
/** A version 4 summary calls the search's flagged block "the block that gains the most"; say what it was. */
export const legacySummary = (t: string): string => t
  .replace('The side-street block that gains the most through traffic is', "The side-street block the search flagged for through traffic with its noise band, which need not have the largest increase, is")
  .replace('No side-street block gains through traffic beyond normal run-to-run variation.', "No side-street block passes the search's assumed noise band for through traffic.");
const fromV4 = (p: Proposal): Proposal => {
  if (isV5Through(p.harm.through)) return p;
  const t = p.harm.through as unknown as V4Harm;
  const byPeriod: Record<string, PeriodResult> = {};
  for (const [id, v] of Object.entries(p.byPeriod)) {
    const a = v.allTraffic as unknown as V4All;
    byPeriod[id] = { cutThrough: v.cutThrough, allTraffic: {
      adjustedPenalty: { block: typeof a.worstBlock === 'string' ? a.worstBlock : null, penaltyVehPerHour: null, baselineVehPerHour: a.baselineVehPerHour as number, scenarioVehPerHour: a.scenarioVehPerHour as number, throughIncreaseVehPerHour: a.throughIncreaseVehPerHour as number },
      blocksAboveBand: a.blocksAboveNoise as number,
    } };
  }
  return { ...p, summary: legacySummary(p.summary), byPeriod, harm: { through: {
    adjustedPenalty: { block: typeof t.worstBlock === 'string' ? t.worstBlock : null, penaltyVehPerHour: null, increaseVehPerHour: t.increaseVehPerHour as number },
    blocksAboveBand: t.blocksAboveNoise as number,
  } } };
};
const isPicture = (x: unknown): x is ProposalPicture => {
  const q = x as ProposalPicture | undefined;
  const nums = (a: unknown) => Array.isArray(a) && a.every(finite);
  return typeof q?.period === 'string' && nums(q.links) && nums(q.base) && nums(q.scen) && q.links.length === q.base.length && q.links.length === q.scen.length;
};
const isVariant = (v: unknown): v is Variant => {
  const q = v as Variant | undefined;
  const c = q?.cutThrough;
  return typeof q?.link === 'string' && Array.isArray(q.differs) && q.differs.length > 0 && q.differs.every((d) => typeof d === 'string')
    && (c === undefined || (finite(c.baselineVehPerHour) && finite(c.scenarioVehPerHour) && finite(c.changePct)));
};
/** Variants that cannot be read are dropped one by one; the option keeps the rest. */
const withValidVariants = (p: Proposal): Proposal => {
  if (p.variants === undefined) return p;
  const { variants, ...rest } = p;
  const ok = Array.isArray(variants) ? variants.filter(isVariant) : [];
  return ok.length > 0 ? { ...rest, variants: ok } : rest;
};
/** A malformed picture is dropped, so the card shows none instead of a broken one. */
const withValidPicture = (p: Proposal): Proposal => {
  if (p.picture === undefined || isPicture(p.picture)) return p;
  const { picture: _dropped, ...rest } = p;
  return rest;
};
function normalizeGroup(g: ProposalGroup): ProposalGroup {
  if (g.proposals.every(isCurrent)) return { ...g, proposals: g.proposals.map((p) => withValidVariants(withValidPicture(fromV4(p)))) };
  return { ...g, legacy: true, proposals: [], baseline: { cutThroughVehPerHour: {} } };
}

export function parseProposals(text: string): Proposals | null {
  try {
    const f = JSON.parse(text) as { version?: number; area?: string; withdrawn?: string; groups?: ProposalGroup[]; computed?: ProposalGroup['computed']; baseline?: ProposalGroup['baseline']; proposals?: Proposal[] };
    if (f?.version === 1 && Array.isArray(f.proposals) && f.computed) {
      return { version: 4, area: f.area ?? '', groups: [normalizeGroup({ ...UNCONSTRAINED_GROUP, computed: f.computed, baseline: f.baseline ?? { cutThroughVehPerHour: {} }, proposals: f.proposals })] };
    }
    if (!(f?.version === 2 || f?.version === 3 || f?.version === 4 || f?.version === 5) || !Array.isArray(f.groups)) return null;
    const groups = f.groups.filter((g) => g && typeof g.id === 'string' && Array.isArray(g.proposals) && g.computed)
      .map((g) => normalizeGroup({ ...g, title: g.title || g.id, note: g.note ?? '' }));
    return { version: f.version === 5 ? 5 : 4, area: f.area ?? '', groups, ...(typeof f.withdrawn === 'string' && f.withdrawn ? { withdrawn: f.withdrawn } : {}) };
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

/** What the reader has loaded. `simulator` is the fingerprint of the engine in use; absent or null means the reader could not read it. */
export interface LoadedHashes { network: string | null; demand: string | null; simulator?: string | null }
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

/** The version of the reporting method this reader understands: the pairing, the interval and the selection rules. Written by the search as `computed.reportMethod`. */
export const REPORT_METHOD = 'paired-t-2';

export type EvidenceState = 'current' | 'stale' | 'unverified';
export interface EvidenceStatus {
  state: EvidenceState;
  /** What differs from the reader's current inputs: the figures describe other runs. */
  stale: ('network' | 'demand' | 'simulator' | 'method')[];
  /** Provenance the group does not record. The current engine's is never assumed for it. */
  missing: ('simulator' | 'method' | 'settings')[];
  /** Recorded provenance the reader could not check, because it does not know the simulator in use. */
  unchecked: 'simulator'[];
}

/**
 * The one definition of "may these figures be shown as current": the app's cards, the text pages, the preview cards and the exported pictures all
 * ask it. The Rust annotator applies the same rule (`explore/provenance.rs`). Stale wins over unverified: a mismatch is a known difference.
 */
export function evidenceStatus(computed: ProposalGroup['computed'], loaded: LoadedHashes): EvidenceStatus {
  const stale: EvidenceStatus['stale'] = [...staleInputs(computed, loaded)];
  const missing: EvidenceStatus['missing'] = [];
  const unchecked: EvidenceStatus['unchecked'] = [];
  if (!computed.simulator) missing.push('simulator');
  else if (typeof loaded.simulator === 'string' && loaded.simulator !== computed.simulator) stale.push('simulator');
  else if (typeof loaded.simulator !== 'string') unchecked.push('simulator');
  if (!computed.reportMethod) missing.push('method');
  else if (computed.reportMethod !== REPORT_METHOD) stale.push('method');
  if (!computed.settings || typeof computed.settings !== 'object') missing.push('settings');
  return { state: stale.length > 0 ? 'stale' : missing.length > 0 || unchecked.length > 0 ? 'unverified' : 'current', stale, missing, unchecked };
}

export interface Notices { exploratory: boolean; stale: boolean; staleText: string; unverified: boolean; unverifiedText: string; evidence: EvidenceStatus }
const STALE_WORDS: Record<EvidenceStatus['stale'][number], string> = { network: 'street network', demand: 'demand', simulator: 'simulator code', method: 'reporting method' };
const listWords = (a: string[]) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);
export function staleSentence(e: EvidenceStatus): string {
  if (e.stale.length === 0) return '';
  const what = listWords(e.stale.map((k) => STALE_WORDS[k]));
  return `The ${what} ${e.stale.length > 1 ? 'have' : 'has'} changed since these options were computed, so the numbers are out of date.`;
}
export function unverifiedSentence(e: EvidenceStatus): string {
  if (e.missing.length > 0) {
    return 'These figures were computed before the simulator version, reporting method and run settings were recorded, and they carry no uncertainty intervals. They cannot be checked against the simulator in use. Compute them again before relying on them.';
  }
  if (e.unchecked.length > 0) return 'The simulator version in use could not be read here, so these figures could not be checked against it.';
  return '';
}
export function proposalNotices(computed: ProposalGroup['computed'], loaded: LoadedHashes): Notices {
  const evidence = evidenceStatus(computed, loaded);
  return {
    exploratory: computed.calibration !== 'calibrated',
    stale: evidence.state === 'stale',
    staleText: staleSentence(evidence),
    unverified: evidence.state === 'unverified',
    unverifiedText: unverifiedSentence(evidence),
    evidence,
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

/** Fewest seed pairs for which the file makes a statement about an effect. Mirrors `MIN_PAIRS` in `explore/paired.rs`. */
export const MIN_RUNS = 10;
const runsWord = (n: number) => `${n} ${n === 1 ? 'run' : 'runs'}`;
const sg = (x: number, dp = 0, unit = '') => (isZero(x, dp) ? `0${unit}` : `${x < 0 ? MINUS : '+'}${num(x, dp)}${unit}`);

/**
 * One sentence on a paired effect: its 95% interval over seeds and what that resolves. `unit` is appended to each end ("%" or " through cars an hour").
 * A missing effect says no interval was recorded; fewer than ten runs say so and make no claim.
 */
export function intervalText(e: Effect | null | undefined, unit = ' through cars an hour', dp = 0): string {
  if (!e) return 'No uncertainty interval was recorded for this figure.';
  if (e.status === 'insufficient' || !e.interval) {
    return `${runsWord(e.n)} ${e.n === 1 ? 'is' : 'are'} too few for an interval (at least ${MIN_RUNS} are needed), so this figure does not say whether the change is more than run-to-run variation.`;
  }
  const [lo, hi] = e.interval;
  const range = `95% interval ${sg(lo, dp, unit)} to ${sg(hi, dp, unit)} over ${runsWord(e.n)}`;
  const verdict = e.status === 'decrease' ? 'the fall is resolved from run-to-run variation' : e.status === 'increase' ? 'the rise is resolved from run-to-run variation' : 'the interval includes zero, so the sign of the change is not resolved';
  return `${range}: ${verdict}.`;
}

/** "mean of 10 runs (seeds 1 to 10)" for a seed list; a single run is said to be one run. */
export function seedsPhrase(seeds: number[]): string {
  const n = seeds.length;
  if (n === 0) return 'an unrecorded number of runs';
  if (n === 1) return `one run (seed ${seeds[0]})`;
  const consecutive = seeds.every((x, i) => i === 0 || x === seeds[i - 1] + 1);
  return `mean of ${n} runs (${consecutive ? `seeds ${seeds[0]} to ${seeds[n - 1]}` : `seeds ${seeds.join(', ')}`})`;
}

/**
 * Figure 1: through cars an hour across the area's side streets, before and after. `when` is a `periodsPhrase`, `runs` the seeds behind the
 * mean and `area` the study area's name; `scope` says what the figure counts, for which periods and from how many runs.
 */
export function cutThroughHeadline(c: CutThrough, when = 'the searched periods', runs?: number[], area?: string): { figure: string; label: string; change: string; scope: string; interval: string } {
  const b = Math.round(c.baselineVehPerHour), s = Math.round(c.scenarioVehPerHour);
  const d = s - b;
  const pct = signedPct(c.changePct);
  const basis = runs && runs.length > 0 ? `${seedsPhrase(runs)} per period` : 'averaged over the runs';
  return {
    figure: `${b} → ${s}`,
    label: 'through cars an hour',
    change: d === 0 ? `No change (${pct})` : `${d < 0 ? MINUS : '+'}${Math.abs(d)} cars an hour (${pct})`,
    scope: `Cars crossing ${area ? `${area}'s` : "the area's"} side streets without a trip that starts or ends there, each counted once. ${when[0].toUpperCase()}${when.slice(1)}; ${basis}.`,
    interval: c.changePctEffect !== undefined || c.effect !== undefined ? intervalText(c.changePctEffect ?? undefined, '%', 1) : intervalText(undefined),
  };
}

/**
 * Figure 2: the same kind of car as figure 1 (through cars an hour, same averaging), on the one side-street block with the largest raw increase.
 * A raw maximum is never turned into "none": with no gain it says so, and an increase the seeds do not resolve is shown with that status.
 * A version 4 file recorded only the block the search's noise rule picked, which can differ from the largest increase, and says so.
 */
export function harmHeadline(h: Proposal['harm'], when = 'the searched periods'): { none: boolean; figure: string; label: string; definition: string; status: 'resolved' | 'unresolved' | 'insufficient' | 'unrecorded' | 'none' } {
  const t = h.through;
  const big = t.largestIncrease;
  const scope = `Through cars only, both directions of that one block, for ${when}.`;
  if (!big) {
    const pen = t.adjustedPenalty;
    const inc = pen.increaseVehPerHour ?? 0;
    const flagged = t.blocksAboveBand > 0 && Math.round(inc) > 0 && pen.block;
    const note = 'This file predates the block with the largest increase: its one block is the one the search flagged with an assumed noise band, so another block may have gained more through cars. No interval was recorded.';
    if (!flagged) {
      return { none: true, status: 'unrecorded', figure: '', label: 'No block passes the search\'s noise band for through cars', definition: `${scope} The band is an assumed dead band, not a measured uncertainty. ${note}` };
    }
    return {
      none: false, status: 'unrecorded', figure: `+${Math.round(inc)} through ${carsWord(Math.round(inc))} an hour`, label: `on one block: ${pen.block}, flagged by the search's noise rule`,
      definition: `${scope} ${note}`,
    };
  }
  const inc = Math.round(big.increaseVehPerHour);
  const e = big.effect;
  const resolved = t.blocksResolvedIncrease ?? 0;
  const status = !e ? 'unrecorded' : e.status === 'increase' ? 'resolved' : e.status === 'insufficient' ? 'insufficient' : 'unresolved';
  const tail = e && e.n >= MIN_RUNS && resolved > 0 ? ` ${resolved} ${resolved === 1 ? 'block has' : 'blocks have'} a rise resolved from run-to-run variation.` : '';
  const choice = ' The block was picked after looking at all of them, so its interval is not adjusted for that choice.';
  if (inc <= 0) {
    return {
      none: true, status: 'none', figure: '', label: `No block gains through cars on average; the largest change is ${sg(big.increaseVehPerHour, 0)} on ${big.block}`,
      definition: `${scope} This compares averages only.${tail}`,
    };
  }
  const interval = e ? ` ${intervalText(e)}` : ' No interval was recorded.';
  return {
    none: false, status,
    figure: `+${inc} through ${carsWord(inc)} an hour`,
    label: `on one block: ${big.block}, the block with the largest increase`,
    definition: `Cars that still cut through take other streets, so one block can gain while the area total falls. ${scope}${interval}${e ? choice : ''}${tail}`,
  };
}

/** "128 → 101 (−21%)": cars an hour first, the percentage second. */
export function beforeAfterPct(c: CutThrough): string {
  return `${Math.round(c.baselineVehPerHour)} → ${Math.round(c.scenarioVehPerHour)} (${signedPct(c.changePct)})`;
}

export interface AllTrafficRow {
  period: string;
  /** The block with the largest raw all-traffic increase in the period. Null for a version 4 file whose noise rule flagged no block. */
  block: string | null;
  /** Cars an hour on that block, all trips together. */
  before: number; after: number;
  /** Change in all cars, and its split into through cars and local trips (all cars minus through cars). */
  change: number; through: number; local: number;
  /** Blocks past the assumed noise band. */
  blocksAbove: number;
  /** The paired interval of the change, when the file records one. */
  interval: string;
  /** The block behind the search's ranking penalty and what the penalty is after its noise band. */
  penaltyBlock: string | null; penalty: number | null;
  /** The row is a version 4 figure: its block is the one the noise rule flagged. */
  flagged: boolean;
}
/** One row per period for the details table. */
export function allTrafficRows(p: Proposal, periodLabel: (id: string) => string): AllTrafficRow[] {
  return Object.entries(p.byPeriod).map(([id, v]) => {
    const a = v.allTraffic;
    const big = a.largestIncrease;
    const pen = a.adjustedPenalty;
    if (big) {
      const through = big.throughIncreaseVehPerHour ?? 0;
      return {
        period: periodLabel(id), block: big.block, before: big.baselineVehPerHour, after: big.scenarioVehPerHour,
        change: big.scenarioVehPerHour - big.baselineVehPerHour, through, local: big.scenarioVehPerHour - big.baselineVehPerHour - through,
        blocksAbove: a.blocksAboveBand, interval: intervalText(big.effect, ' cars an hour'), penaltyBlock: pen.block, penalty: pen.penaltyVehPerHour, flagged: false,
      };
    }
    const above = a.blocksAboveBand > 0;
    const before = pen.baselineVehPerHour ?? 0, after = pen.scenarioVehPerHour ?? 0, through = pen.throughIncreaseVehPerHour ?? 0;
    const change = after - before;
    return {
      period: periodLabel(id), block: above ? pen.block : null, before, after, change, through, local: change - through, blocksAbove: a.blocksAboveBand,
      interval: intervalText(undefined), penaltyBlock: pen.block, penalty: pen.penaltyVehPerHour, flagged: true,
    };
  });
}

/**
 * The card's all-traffic headline: the largest rise in all cars on one side-street block over the searched periods, with its through and
 * local parts and its interval, so a cut in through cars is never read as the whole effect. `attribution` says that the card's figures do
 * not tell which trips moved: that needs the route diagnostic, and its absence is not a finding of no diversion.
 */
export function allTrafficHeadline(rows: AllTrafficRow[]): { none: boolean; figure: string; label: string; split: string; interval: string; attribution: string } {
  const attribution = 'Which trips moved, and by which streets, is not part of these figures: open Where traffic goes to trace them. Until then no diversion has been ruled out.';
  const r = rows.filter((x) => x.block !== null && !x.flagged).sort((a, b) => b.change - a.change)[0];
  if (!r) {
    const old = rows.some((x) => x.flagged);
    return { none: true, figure: '', label: old ? 'All traffic: this file records only the block the search flagged, not the largest rise in all cars.' : 'All traffic: not recorded in this file.', split: '', interval: '', attribution };
  }
  const n = Math.round(r.change);
  return {
    none: false,
    figure: n > 0 ? `+${n}` : n < 0 ? `${MINUS}${-n}` : '0',
    label: `all cars an hour on ${r.block} (${r.period}), ${Math.round(r.before)} → ${Math.round(r.after)}: the largest rise on any side-street block inside the study area`,
    split: `Through cars ${signedNum(r.through, '', 0).trim()}, local trips ${signedNum(r.local, '', 0).trim()}.`,
    interval: r.interval, attribution,
  };
}

/**
 * The one sentence on what the extra cars are, built from the numbers: over the periods where the named block gains, the share of
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

/** What the runs behind a card's figures were for: choosing the option too (exploratory), a confirmation on unused seeds, or a reference. */
export function evidenceNote(p: Proposal, g: Pick<ProposalGroup, 'computed'>): string {
  const role = p.evidence?.role;
  const sel = g.computed.estimation?.selection;
  if (role === 'confirmation') return `Confirmation: a shortlist frozen before these runs, rerun on seeds ${seedRange(p.evidence?.seeds ?? [])} that took no part in choosing the options.`;
  if (role === 'reference') return 'A hand-defined package, not a candidate for the options. It was run on the same seeds as the search.';
  if (role === 'selection' || sel?.estimates === 'exploratory') return 'Exploratory estimate: the same runs that chose this option produced these figures, so the intervals are not an independent confirmation.';
  return 'It is not recorded whether the runs that produced these figures also chose the option.';
}
const seedRange = (s: number[]) => (s.length === 0 ? '(not recorded)' : s.every((x, i) => i === 0 || x === s[i - 1] + 1) ? `${s[0]} to ${s[s.length - 1]}` : s.join(', '));

/** The scope every interval carries. */
export const INTERVAL_SCOPE = 'Intervals cover run-to-run variation (random seeds) with the network, demand and model fixed. They do not cover calibration error, demand error or day-to-day variation in real traffic.';

/** How option `c.option` compares with the next simpler option: points of through cars cut, paired on the same seeds. */
export function comparisonText(c: OptionComparison, label: (id: string) => string): string {
  const e = c.extraCutPoints;
  const who = `${label(c.option)} against ${label(c.against)}`;
  if (!e || e.status === 'insufficient' || !e.interval) return `${who}: not enough runs to compare (at least ${MIN_RUNS} paired runs are needed).`;
  const [lo, hi] = e.interval;
  const range = `95% interval ${sg(lo, 1)} to ${sg(hi, 1)} points over ${runsWord(e.n)}`;
  if (e.status === 'unresolved') return `${who}: the difference in through cars cut is not resolved (${sg(e.mean, 1)} points; ${range}).`;
  return `${who}: cuts ${num(e.mean, 1)} ${e.mean >= 0 ? 'more' : 'fewer'} points of through cars (${range}).`;
}

export function formatComputed(c: ProposalGroup['computed'], periodLabel: (id: string) => string): string {
  const d = new Date(c.date);
  const when = Number.isNaN(d.getTime()) ? c.date : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  const periods = c.periods.map(periodLabel);
  const list = periods.length <= 1 ? periods.join('') : `${periods.slice(0, -1).join(', ')} and ${periods[periods.length - 1]}`;
  const n = c.seeds.length;
  return `Computed ${when} for ${list || 'the searched periods'}: ${seedsPhrase(c.seeds)} of the simulation per period${n > 1 ? ', each run with a different random seed' : ''}${c.minutes ? `, ${c.minutes} simulated minutes each` : ''}.`;
}

/** The recorded provenance of a group on one line, for the text pages and the card's detail. Absent fields are said to be absent. */
export function provenanceLine(c: ProposalGroup['computed']): string {
  const rev = c.sourceRevision ? `, source revision ${c.sourceRevision}` : '';
  return c.simulator && c.reportMethod
    ? `Simulator ${c.simulator.slice(0, 12)}, reporting method ${c.reportMethod}${rev}.`
    : 'Simulator version, reporting method and run settings were not recorded for this group.';
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

/** The link as one comparable string: period, demand scale and the items in sorted order, so item order and token order do not matter. */
export function linkKey(link: string): string {
  const tokens = linkHash(link).slice(1).split(';');
  const get = (k: string) => tokens.find((t) => t.startsWith(`${k}=`))?.slice(k.length + 1) ?? '';
  return `${get('p')}|${get('d')}|${get('s').split('~').filter(Boolean).sort().join('~')}`;
}

const tenths = (x: number) => Math.round(x * 10);
/** Through cars an hour a package removes, as published to one decimal. */
export const throughRemoved = (p: Pick<Proposal, 'cutThrough'>): number => tenths(p.cutThrough.baselineVehPerHour - p.cutThrough.scenarioVehPerHour) / 10;
/** The largest rise in all cars on one side-street block in any period (0 when none rises; a version 4 file's flagged block counts as recorded). */
export function largestAllCarRise(p: Pick<Proposal, 'byPeriod'>): number {
  let m = 0;
  for (const v of Object.values(p.byPeriod)) {
    const a = v.allTraffic;
    const d = a.largestIncrease ? a.largestIncrease.increaseVehPerHour : (a.adjustedPenalty.scenarioVehPerHour ?? 0) - (a.adjustedPenalty.baselineVehPerHour ?? 0);
    if (d > m) m = d;
  }
  return m;
}
/** The published order: most through cars removed first; ties go to fewer changes, then the smaller largest all-car rise. Mirrors `order_options` in `explore/similar.rs`. */
export function compareOptions(a: Proposal, b: Proposal): number {
  return tenths(throughRemoved(b)) - tenths(throughRemoved(a))
    || a.interventions.length - b.interventions.length
    || tenths(largestAllCarRise(a)) - tenths(largestAllCarRise(b));
}

export interface Listed { group: ProposalGroup; proposal: Proposal }
/**
 * The file's options as one list in the published order, whatever order and however many groups the file has. A package that two groups
 * both list (the same scenario link) is shown once. Reference entries are listed apart, in file order.
 */
export function listOptions(file: Pick<Proposals, 'groups'>): { search: Listed[]; reference: Listed[] } {
  const all: Listed[] = file.groups.filter((g) => !g.legacy).flatMap((group) => group.proposals.map((proposal) => ({ group, proposal })));
  const once = (list: Listed[]) => {
    const seen = new Set<string>();
    return list.filter((x) => { const k = linkKey(x.proposal.link); if (seen.has(k)) return false; seen.add(k); return true; });
  };
  const search = all.filter((x) => x.proposal.kind !== 'reference');
  return {
    search: once(search.map((x, i) => ({ x, i })).sort((a, b) => compareOptions(a.x.proposal, b.x.proposal) || a.i - b.i).map((e) => e.x)),
    reference: once(all.filter((x) => x.proposal.kind === 'reference')),
  };
}

export const allProposals = (file: Proposals): Proposal[] => file.groups.flatMap((g) => g.proposals);

