// The calibration status rule of the assessment (design D16 to D18, round 26): what each period must show for `calibrated`. No I/O.
export interface PeriodVerdict {
  stable: boolean;
  /** Headline shares within tolerance (PM peak only; null elsewhere). */
  d5: boolean | null;
  /** Through-car check: true inside every observed range, false outside, null with no rows (no data). */
  through: boolean | null;
  /** Station rule on recent counts: true met, false not met or too few to judge, null when the period has no counts of its own (midday). */
  stations: boolean | null;
}

/**
 * `calibrated` needs every period stable, the PM headline shares (D5) and through cars right, and the station rule met in every period that has counts.
 * A missing through-car check (no rows) fails: it never passes by default. A period with no counts is judged on stability only.
 */
export function suggestStatus(periods: Record<string, PeriodVerdict>, pmPeriod = 'pm_peak', primitives?: PrimitiveVerdict): { calibrated: boolean; experimental: string[]; reasons: string[]; qualifications: string[] } {
  const reasons: string[] = [];
  const qualifications: string[] = [];
  const ids = Object.keys(periods);
  const experimental = ids.filter((p) => !periods[p].stable);
  if (experimental.length) reasons.push(`not stable: ${experimental.join(', ')}`);
  const pm = periods[pmPeriod];
  if (!pm) reasons.push('no PM peak run');
  else {
    if (pm.d5 !== true) reasons.push('headline shares (D5) not met');
    if (pm.through === null) reasons.push('no through-car rows: the check has no data');
    else if (!pm.through) reasons.push('through cars outside the observed range');
  }
  for (const p of ids) if (periods[p].stations === false) reasons.push(`station rule not met or not judgeable in ${p}`);
  if (primitives) {
    if (primitives.state !== 'present') reasons.push(`primitive validation ${primitives.state === 'missing' ? 'evidence is missing' : 'evidence does not match these runs'}: no unqualified validity claim`);
    else {
      if (primitives.unreviewed.length) reasons.push(`primitive validation fails ${primitives.unreviewed.length} case(s) with no reviewed exception: ${primitives.unreviewed.join(', ')}`);
      for (const r of primitives.reviewed) qualifications.push(`limited use: ${r}`);
    }
  }
  return { calibrated: reasons.length === 0, experimental, reasons, qualifications };
}

/** What the primitive-validation evidence allows the assessment to claim (tools/lib/primitive-evidence.ts). */
export interface PrimitiveVerdict { state: 'present' | 'missing' | 'incompatible'; /** Failed cases with no reviewed exception. */ unreviewed: string[]; /** Failed cases with a reviewed limited-use exception, as `id: limit`. */ reviewed: string[] }

// ---------- stability from the selected runs ----------
/** Thresholds of design decision D16, read from `acceptance.stability` of the targets file. Defaults are the same as the native summary's. */
export interface StabilityRule { maxMeanRemovalsPerHour: number; backlogPct: number; minSeedsShare: number; maxSecondHalfBacklogGrowthPct: number; minArterialSpeed: number }
export const stabilityRule = (targets: { acceptance?: { stability?: Partial<StabilityRule> } }): StabilityRule => {
  const r = targets.acceptance?.stability ?? {};
  return { maxMeanRemovalsPerHour: r.maxMeanRemovalsPerHour ?? 1, backlogPct: r.backlogPct ?? 2, minSeedsShare: r.minSeedsShare ?? 0.9, maxSecondHalfBacklogGrowthPct: r.maxSecondHalfBacklogGrowthPct ?? 2, minArterialSpeed: r.minArterialSpeed ?? 4 };
};

/** Where the cars cleared from gridlock in one run were held (calibrate's `gridlockZone`, change calibration-round-37): near the study area or farther out. */
export interface ZoneCounts { near: number; far: number; farLinked: number; judged: number }
export interface ZoneSplit extends ZoneCounts { bufferM: number; total: number; sensitivity?: (ZoneCounts & { bufferM: number })[] }

export interface StabilityRun { seed: number; minutes: number; health: { gridlockRemoved: number; backlogPct: number; arterialMeanSpeed: number; spawned: number }; series?: { tMin: number; backlog: number }[]; gridlockZone?: ZoneSplit | null }

/**
 * Cars cleared from gridlock that count against D16 (round 37): those held in the judged zone (the study area, its bounding streets and the junctions on
 * them, plus the area's buffer) and far ones whose blocking chain reaches the zone. A run without the split, or one whose split does not add up to its
 * total, counts every clearing. `factor` picks the buffer of the sensitivity rows (0.5, 1 or 2 times the area's buffer).
 */
export function judgedClearings(r: StabilityRun, factor = 1): number {
  const z = r.gridlockZone;
  if (!zoneConsistent(r)) return r.health.gridlockRemoved;
  if (factor === 1) return z!.judged;
  const row = z!.sensitivity?.find((q) => Math.abs(q.bufferM - z!.bufferM * factor) < 1e-6);
  return row && row.near + row.far === z!.total ? row.judged : r.health.gridlockRemoved;
}

/** The run carries a near/far split that adds up to its total. */
export const zoneConsistent = (r: StabilityRun): boolean => {
  const z = r.gridlockZone;
  return !!z && z.total === r.health.gridlockRemoved && z.near + z.far === z.total && z.farLinked <= z.far && z.judged === z.near + z.farLinked;
};

/** Backlog added between the sample nearest the middle of the run and the last sample, in points of spawned trips (the native summary's definition). */
export function backlogGrowth(run: StabilityRun): number {
  const s = run.series ?? [];
  if (s.length < 2) return 0;
  const half = run.minutes / 2;
  const at = s.reduce((best, x) => (Math.abs(x.tMin - half) < Math.abs(best.tMin - half) ? x : best), s[0]);
  return (100 * (s[s.length - 1].backlog - at.backlog)) / Math.max(1, run.health.spawned);
}

export interface Stability {
  holds: boolean; n: number; seeds: number[];
  /** Judged cars cleared from gridlock per hour (`judgedClearings`); `zoneScoped` is false when some run has no near/far split, and then every clearing counts. */
  removalsPerHourMean: number; removalsPerHourMin: number; removalsPerHourMax: number;
  zoneScoped: boolean; bufferM: number | null;
  /** Per hour, seed means: every clearing, near the study area, farther out, and far with a chain into the zone (NaN unless zone-scoped). */
  allPerHourMean: number; nearPerHourMean: number; farPerHourMean: number; farLinkedPerHourMean: number;
  /** The removals check at half, the same and double the buffer. */
  sensitivity: { factor: number; bufferM: number | null; perHourMean: number; ok: boolean }[];
  backlogSeedsOk: number; growthSeeds: number[]; arterialSpeedMean: number; oldRuleSeedsPassing: number[];
  checks: { removals: boolean; backlog: boolean; growth: boolean; speed: boolean };
}

/** The stability verdict of D16 computed from the runs being assessed, never from a summary file written for other runs. */
export function computeStability(runs: StabilityRun[], rule: StabilityRule): Stability {
  const n = runs.length;
  const hourly = (r: StabilityRun, x: number) => x * (60 / Math.max(1, r.minutes));
  const perHour = runs.map((r) => hourly(r, judgedClearings(r)));
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
  const removalsPerHourMean = mean(perHour);
  const zoneScoped = n > 0 && runs.every(zoneConsistent);
  const zMean = (g: (z: ZoneSplit) => number) => (zoneScoped ? mean(runs.map((r) => hourly(r, g(r.gridlockZone!)))) : NaN);
  const sensitivity = [0.5, 1, 2].map((factor) => {
    const m = mean(runs.map((r) => hourly(r, judgedClearings(r, factor))));
    return { factor, bufferM: zoneScoped ? runs[0].gridlockZone!.bufferM * factor : null, perHourMean: m, ok: n > 0 && m < rule.maxMeanRemovalsPerHour };
  });
  const backlogSeedsOk = runs.filter((r) => r.health.backlogPct < rule.backlogPct).length;
  const growthSeeds = runs.filter((r) => backlogGrowth(r) > rule.maxSecondHalfBacklogGrowthPct).map((r) => r.seed);
  const arterialSpeedMean = mean(runs.map((r) => r.health.arterialMeanSpeed));
  const checks = {
    removals: n > 0 && removalsPerHourMean < rule.maxMeanRemovalsPerHour,
    backlog: n > 0 && backlogSeedsOk >= Math.ceil(rule.minSeedsShare * n) - 1e-9,
    growth: n > 0 && growthSeeds.length === 0,
    speed: n > 0 && arterialSpeedMean > rule.minArterialSpeed,
  };
  return {
    holds: checks.removals && checks.backlog && checks.growth && checks.speed, n, seeds: runs.map((r) => r.seed),
    removalsPerHourMean, removalsPerHourMin: n ? Math.min(...perHour) : NaN, removalsPerHourMax: n ? Math.max(...perHour) : NaN,
    zoneScoped, bufferM: zoneScoped ? runs[0].gridlockZone!.bufferM : null,
    allPerHourMean: mean(runs.map((r) => hourly(r, r.health.gridlockRemoved))), nearPerHourMean: zMean((z) => z.near), farPerHourMean: zMean((z) => z.far), farLinkedPerHourMean: zMean((z) => z.farLinked),
    sensitivity,
    backlogSeedsOk, growthSeeds, arterialSpeedMean,
    oldRuleSeedsPassing: runs.filter((r) => r.health.gridlockRemoved === 0 && r.health.backlogPct < 2 && r.health.arterialMeanSpeed > 4).map((r) => r.seed),
    checks,
  };
}
