// Recency of count sources: weight bands by the age of a station's count year, an optional held-out-only band, and an optional growth rate per source.
// No I/O, no street names. Every number comes from the area's config (`countFit.recency`); the weights and rates there are ASSUMPTIONs.
import { DERIVED_TARGET_PHRASE } from './derived-targets';

export interface RecencyBand { /** Upper age limit in years (inclusive); omitted on the last band. */ maxAgeYears?: number; /** Multiplier of the station weight; 0 takes the station out of the fit and reports it as held out. */ weight: number }
export interface RecencyConfig {
  enabled: boolean;
  /** Year the demand stands for; ages are counted from it. */
  referenceYear: number;
  /** Bands in order of age. A station with no known year takes the last band (treated as old). */
  bands: RecencyBand[];
  /** A station counts as recent in the report when its age is at most this many years. */
  recentYears: number;
  /** Annual growth rate by source id applied to the target from the count year to the reference year; absent or 0 leaves the count as published. */
  growthPerYear?: Record<string, number>;
  /** Ramp stations (Caltrans ramp rows and the ramp legs of intersection counts) keep full weight whatever their age: for the off-ramps they are the only evidence of the split (ASSUMPTION, round 25). */
  exemptRamps?: boolean;
}
export interface Dated { id: string; kind?: string; ramp?: boolean; source?: string; year?: number | null; weight: number; weightByPeriod?: Record<string, number>; target: Record<string, number>; held?: boolean; outOfFit?: boolean }

export const ageOf = (year: number | null | undefined, referenceYear: number): number | null => (year == null ? null : Math.max(0, referenceYear - year));

export function bandWeight(age: number | null, bands: RecencyBand[]): number {
  if (age === null) return bands[bands.length - 1].weight;
  for (const b of bands) if (b.maxAgeYears === undefined || age <= b.maxAgeYears) return b.weight;
  return bands[bands.length - 1].weight;
}

export const growthFactor = (age: number | null, rate: number): number => (age === null || !rate ? 1 : Math.pow(1 + rate, age));

export interface RecencySummary { sources: { source: string; year: number | null; stations: number; weight: number; growth: number; /** Ramp stations that kept full weight (`exemptRamps`). */ exempt: boolean }[] }

/** Applies the weights, the growth and the held-out band to the stations in place; returns what was done per source and year. */
export function applyRecency(stations: Dated[], cfg: RecencyConfig): RecencySummary {
  const rows = new Map<string, RecencySummary['sources'][number]>();
  for (const st of stations) {
    const age = ageOf(st.year, cfg.referenceYear);
    const exempt = !!cfg.exemptRamps && (st.ramp === true || st.kind === 'ramp');
    const w = exempt ? 1 : bandWeight(age, cfg.bands);
    const g = growthFactor(age, cfg.growthPerYear?.[st.source ?? ''] ?? 0);
    if (g !== 1) for (const p of Object.keys(st.target)) st.target[p] *= g;
    if (w === 0) { st.held = true; st.outOfFit = true; }
    else if (w !== 1) { st.weight *= w; if (st.weightByPeriod) for (const p of Object.keys(st.weightByPeriod)) st.weightByPeriod[p] *= w; }
    const isExempt = exempt && bandWeight(age, cfg.bands) !== 1;
    const key = `${st.source ?? 'unknown'}|${st.year ?? ''}|${w}|${isExempt ? 'exempt' : ''}`;
    const r = rows.get(key) ?? rows.set(key, { source: st.source ?? 'unknown', year: st.year ?? null, stations: 0, weight: w, growth: g, exempt: isExempt }).get(key)!;
    r.stations++;
  }
  return { sources: [...rows.values()].sort((a, b) => a.source.localeCompare(b.source) || (a.year ?? 0) - (b.year ?? 0) || a.weight - b.weight) };
}

/** Year label for reports: whole years as is, means of several count years to one decimal, "unknown" when null. */
export const yearLabel = (y: number | null | undefined): string => (y == null ? 'unknown' : Number.isInteger(y) ? String(y) : y.toFixed(1));

/** `held` is the side a station is scored on (held out of the cross-validation fit or fitted). `drawnHeld` is the frozen draw before the derived-target rule; it equals `held` for every station that is not a derived target. */
export interface CaseLike { gehOk: boolean; held?: boolean; drawnHeld?: boolean; /** The target is derived from a daily total (derived-targets.ts): reported apart, not judged. */ dailyTotal?: boolean }
export interface GroupRow { source: string; year: number | null; fitted: { n: number; ok: number }; held: { n: number; ok: number } }

/** GEH below 5 counts per source and count year, fitted and held out. */
export function groupBySourceYear<T extends CaseLike>(items: { source?: string; year?: number | null; c: T }[]): GroupRow[] {
  const m = new Map<string, GroupRow>();
  for (const { source, year, c } of items) {
    const key = `${source ?? 'unknown'}|${year ?? ''}`;
    const r = m.get(key) ?? m.set(key, { source: source ?? 'unknown', year: year ?? null, fitted: { n: 0, ok: 0 }, held: { n: 0, ok: 0 } }).get(key)!;
    const b = c.held ? r.held : r.fitted;
    b.n++; if (c.gehOk) b.ok++;
  }
  return [...m.values()].sort((a, b) => a.source.localeCompare(b.source) || (a.year ?? 0) - (b.year ?? 0));
}

/** Pass counts of the stations that are recent (age at most `recentYears`) and of those that are not, all sets together. */
export function recentSplit<T extends CaseLike>(items: { year?: number | null; c: T }[], referenceYear: number, recentYears: number): { recent: { n: number; ok: number }; older: { n: number; ok: number } } {
  const out = { recent: { n: 0, ok: 0 }, older: { n: 0, ok: 0 } };
  for (const { year, c } of items) {
    const age = ageOf(year, referenceYear);
    const b = age !== null && age <= recentYears ? out.recent : out.older;
    b.n++; if (c.gehOk) b.ok++;
  }
  return out;
}

const pct = (a: number, n: number) => (n ? `${Math.round((100 * a) / n)}%` : '-');
const cell = (b: { n: number; ok: number }) => (b.n ? `${b.ok} of ${b.n} (${pct(b.ok, b.n)})` : '-');

export interface RuleSplit {
  all: { fitted: Tally; held: Tally }; recent: { fitted: Tally; held: Tally }; older: { fitted: Tally; held: Tally };
  /** Validation stations scored on the shipped demand, which was fitted with them: in sample, shown for comparison only. */
  heldInFit?: { recent: Tally; older: Tally; all: Tally };
  /** Stations whose target is a scaled copy of another period's count (midday): not counts, left out of the three groups above. */
  derived: Tally;
  /** Stations whose target is derived from a daily total (AADT or ramp ADT times assumed factors), in every period: not hourly counts, left out of the groups above and of `derived`. They are fitted in both views. */
  dailyTotal: Tally;
  /** The same three groups under the scope before derived targets were set apart: every station that is not a scaled copy of another period's count, on the side the frozen draw gives it. For comparison with earlier assessments. */
  legacy: { all: { fitted: Tally; held: Tally }; recent: { fitted: Tally; held: Tally }; older: { fitted: Tally; held: Tally } };
}
export type Tally = { n: number; ok: number };

/**
 * Pass counts of the stations of a period: all, recent (age at most `recentYears`) and older, each fitted and held out. A station with no year is older. A station whose
 * target is derived from a daily total goes to `dailyTotal` (it is in the fit in both views and is not judged); one whose target in the period is a scaled copy of another
 * period's count is not a count either and goes to `derived`. `legacy` holds the counts under the scope before derived targets were set apart.
 */
export function ruleSplit<T extends CaseLike & { derived?: boolean }>(items: { year?: number | null; c: T }[], cfg: { referenceYear: number; recentYears: number }): RuleSplit {
  const t = (): { fitted: Tally; held: Tally } => ({ fitted: { n: 0, ok: 0 }, held: { n: 0, ok: 0 } });
  const out: RuleSplit = { all: t(), recent: t(), older: t(), derived: { n: 0, ok: 0 }, dailyTotal: { n: 0, ok: 0 }, legacy: { all: t(), recent: t(), older: t() } };
  const add = (b: Tally, ok: boolean) => { b.n++; if (ok) b.ok++; };
  for (const { year, c } of items) {
    const age = ageOf(year, cfg.referenceYear);
    const recent = age !== null && age <= cfg.recentYears;
    if (!c.derived) for (const g of [out.legacy.all, recent ? out.legacy.recent : out.legacy.older]) add((c.drawnHeld ?? c.held) ? g.held : g.fitted, c.gehOk);
    if (c.dailyTotal) { add(out.dailyTotal, c.gehOk); continue; }
    if (c.derived) { add(out.derived, c.gehOk); continue; }
    for (const g of [out.all, recent ? out.recent : out.older]) add(c.held ? g.held : g.fitted, c.gehOk);
  }
  return out;
}

/** The split with the held-out column taken from a cross-validation run: `main` scores every station on the shipped demand, `cv` on a demand fitted without the held-out stations. */
export function outOfSampleSplit(main: RuleSplit, cv: RuleSplit | null): RuleSplit {
  return {
    all: { fitted: main.all.fitted, held: cv ? cv.all.held : { n: 0, ok: 0 } },
    recent: { fitted: main.recent.fitted, held: cv ? cv.recent.held : { n: 0, ok: 0 } },
    older: { fitted: main.older.fitted, held: cv ? cv.older.held : { n: 0, ok: 0 } },
    heldInFit: { recent: main.recent.held, older: main.older.held, all: main.all.held },
    derived: main.derived,
    dailyTotal: main.dailyTotal,
    legacy: {
      all: { fitted: main.legacy.all.fitted, held: cv ? cv.legacy.all.held : { n: 0, ok: 0 } },
      recent: { fitted: main.legacy.recent.fitted, held: cv ? cv.legacy.recent.held : { n: 0, ok: 0 } },
      older: { fitted: main.legacy.older.fitted, held: cv ? cv.legacy.older.held : { n: 0, ok: 0 } },
    },
  };
}

/**
 * The pass counts of the station rule under both scopes, side by side, so that an assessment can be compared with earlier ones (change derived-targets-not-judged). New scope:
 * hourly counts only. Old scope: derived targets counted too, on the side the frozen draw gives them (on a cross-validation demand that now fits them, their held-out
 * figures are no longer out of sample). Thresholds are the same in both.
 */
export function scopeComparisonLines(rows: { period: string; split: RuleSplit | null }[], rule = 0.85, minHeld = MIN_HELD_RECENT): string[] {
  const L = ['| Period | New scope, recent, fitted | New scope, recent, held out | Old scope, recent, fitted | Old scope, recent, held out | Derived targets (not judged) |', '| --- | --- | --- | --- | --- | --- |'];
  for (const { period, split } of rows) {
    if (!split) { L.push(`| ${period} | - | - | - | - | - |`); continue; }
    const v = (b: Tally, minN: number) => (b.n ? `${cell(b)}, ${judge(b, rule, minN) === 'met' ? 'pass' : 'FAIL'}` : '-');
    L.push(`| ${period} | ${v(split.recent.fitted, 1)} | ${v(split.recent.held, minHeld)} | ${v(split.legacy.recent.fitted, 1)} | ${v(split.legacy.recent.held, minHeld)} | ${split.dailyTotal.n ? `${cell(split.dailyTotal)} GEH below 5` : 'none'} |`);
  }
  return L;
}

/** Fewest recent held-out stations on which the rule is judged (ASSUMPTION: below it a pass rate is two or three stations). */
export const MIN_HELD_RECENT = 10;

export type RuleVerdict = 'met' | 'not met' | 'too few' | 'no counts';
const judge = (b: Tally, rule: number, minN: number): RuleVerdict => (b.n === 0 ? 'no counts' : b.n < minN ? 'too few' : b.ok / b.n > rule ? 'met' : 'not met');

/** Verdict of the station rule on the recent counts of a period: fitted (in the shipped fit) and held out (out of sample). A period with no counts of its own (midday) is `no counts`; too few held-out stations is `too few`, which is not a pass. */
export function ruleVerdicts(r: RuleSplit, rule = 0.85, minHeld = MIN_HELD_RECENT): { fitted: RuleVerdict; held: RuleVerdict; met: boolean | null } {
  const fitted = judge(r.recent.fitted, rule, 1), held = judge(r.recent.held, rule, minHeld);
  if (fitted === 'no counts' && r.recent.held.n === 0 && r.older.fitted.n === 0) return { fitted, held: 'no counts', met: null };
  return { fitted, held, met: fitted === 'met' && held === 'met' };
}

/** True when the station rule is met on the recent counts, fitted and held out (see `ruleVerdicts`). */
export const recentRuleMet = (r: RuleSplit, rule = 0.85, minHeld = MIN_HELD_RECENT): boolean => ruleVerdicts(r, rule, minHeld).met === true;

/** Report lines: GEH below 5 per source and count year, fitted and held out, then the station rule judged on recent counts with the pass rate of older counts beside it. */
export function sourceYearLines<T extends CaseLike>(items: { source?: string; year?: number | null; c: T }[], cfg: { referenceYear: number; recentYears: number; rule?: number }): string[] {
  const rule = cfg.rule ?? 0.85;
  const L = ['| Source | Count year | Age (years) | Fitted: GEH < 5 | Held out: GEH < 5 |', '| --- | --- | --- | --- | --- |'];
  for (const r of groupBySourceYear(items)) L.push(`| ${r.source} | ${yearLabel(r.year)} | ${r.year == null ? 'unknown, treated as old' : (cfg.referenceYear - r.year).toFixed(1).replace(/\.0$/, '')} | ${cell(r.fitted)} | ${cell(r.held)} |`);
  const rv = (b: Tally, minN: number) => judge(b, rule, minN);
  const r = ruleSplit(items, cfg);
  const both = (g: { fitted: Tally; held: Tally }, minHeld = 1) => `fitted ${cell(g.fitted)} (${rv(g.fitted, 1)}), held out ${cell(g.held)} (${rv(g.held, minHeld)})`;
  L.push('', `Station rule (GEH below 5 at more than ${Math.round(rule * 100)}% of stations), judged on counts from the last ${cfg.recentYears} years, scores on the shipped demand (the held-out column here is in the shipped fit): ${both(r.recent)}. Older counts, reported beside it: ${both(r.older)}. All counts: ${both(r.all)}.${r.dailyTotal.n ? ` Targets ${DERIVED_TARGET_PHRASE} (a Caltrans AADT or ramp ADT times assumed factors, fitted in both views): ${cell(r.dailyTotal)}.` : ''}${r.derived.n ? ` Scaled copies of another period's count (not counts, not judged): ${cell(r.derived)}.` : ''}`);
  if (r.dailyTotal.n) L.push('', `Under the scope before derived targets were set apart, on the side the frozen draw gives each station: recent ${both(r.legacy.recent)}; older ${both(r.legacy.older)}; all ${both(r.legacy.all)}.`);
  return L;
}
