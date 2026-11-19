// Peak-hour factor of freeway ramp ADT, estimated from the ramps that have both a counted peak hour and a published ADT (round 46). No I/O, no street names.
// The hourly target of a ramp without a counted hour is ADT x K x period volume factor. K was an assumed 0.09; this derives it from the counted ramps a view may see.

export interface RampKConfig {
  method: 'counted-ramps';
  /** K used when the view sees fewer than `minRamps` usable counted ramps. */
  fallback: number;
  /** Fewest counted ramps for an estimate (ASSUMPTION; a ratio of fewer ramps is not a distribution). */
  minRamps: number;
}

export interface RampKPair {
  ramp: string;
  /** Counted peak hour of the ramp leg (veh/h) and the year of the count. */
  count: number;
  countYear: number | null;
  /** ADT of the ramp by year, one entry per Caltrans row the ramp's volume sums. */
  adtByRow: Record<string, number>[];
  /** Ramps that share the ADT rows. The ADT of a shared row cannot be assigned to one ramp, so these are not used. */
  sharedBy: number;
  /** Station id of the counted leg, for the held-out check. */
  station: string;
}

export interface RampKUsed { ramp: string; count: number; countYear: number | null; adt: number; adtYear: number | null; k: number }
export interface RampKResult {
  k: number;
  estimated: boolean;
  /** Why the fallback was used, when it was. */
  reason?: string;
  used: RampKUsed[];
  skipped: { ramp: string; why: string }[];
  /** Median of the per-ramp ratios, reported beside the pooled value. */
  median: number | null;
}

/** ADT of one row at the year nearest to `year` (the later year on a tie, the latest when the count has no year). */
export function nearestYear(row: Record<string, number>, year: number | null): { year: number; adt: number } | null {
  const ys = Object.keys(row).map(Number).filter((y) => Number.isFinite(y));
  if (!ys.length) return null;
  const best = year === null ? Math.max(...ys) : ys.reduce((a, y) => (Math.abs(y - year) < Math.abs(a - year) || (Math.abs(y - year) === Math.abs(a - year) && y > a) ? y : a));
  return { year: best, adt: row[best] };
}

/** Pooled ratio of counted peak hours to ADT: sum of counts over sum of the nearest-year ADTs. Pairs that share an ADT row are skipped. */
export function estimateRampK(pairs: RampKPair[], cfg: RampKConfig): RampKResult {
  const used: RampKUsed[] = [], skipped: { ramp: string; why: string }[] = [];
  for (const p of pairs) {
    if (p.sharedBy > 1) { skipped.push({ ramp: p.ramp, why: `its ADT row is shared by ${p.sharedBy} ramps` }); continue; }
    if (!(p.count > 0)) { skipped.push({ ramp: p.ramp, why: 'no counted peak hour' }); continue; }
    const rows = p.adtByRow.map((r) => nearestYear(r, p.countYear));
    if (!rows.length || rows.some((r) => !r)) { skipped.push({ ramp: p.ramp, why: 'no ADT' }); continue; }
    const adt = rows.reduce((a, r) => a + r!.adt, 0);
    if (!(adt > 0)) { skipped.push({ ramp: p.ramp, why: 'no ADT' }); continue; }
    const adtYear = Math.round(rows.reduce((a, r) => a + r!.year * r!.adt, 0) / adt);
    used.push({ ramp: p.ramp, count: p.count, countYear: p.countYear, adt, adtYear, k: p.count / adt });
  }
  const ks = used.map((u) => u.k).sort((a, b) => a - b);
  const median = ks.length ? (ks.length % 2 ? ks[(ks.length - 1) / 2] : (ks[ks.length / 2 - 1] + ks[ks.length / 2]) / 2) : null;
  if (used.length < cfg.minRamps) return { k: cfg.fallback, estimated: false, reason: `${used.length} usable counted ramp${used.length === 1 ? '' : 's'}, fewer than the ${cfg.minRamps} required`, used, skipped, median };
  return { k: used.reduce((a, u) => a + u.count, 0) / used.reduce((a, u) => a + u.adt, 0), estimated: true, used, skipped, median };
}

/** The lines the fit report carries for the estimate. */
export function rampKNotes(r: RampKResult, cfg: RampKConfig, view: string, assumed: number): string[] {
  const lines = [`ramp K (round 46, ${view} view): ${r.estimated ? `${r.k.toFixed(4)} from ${r.used.length} counted ramps (pooled ratio; median ${r.median!.toFixed(4)}), against the assumed ${assumed}` : `${cfg.fallback} (fallback): ${r.reason}`}`];
  for (const u of r.used) lines.push(`ramp K input: ${u.ramp}: counted ${Math.round(u.count)} veh/h (${u.countYear ?? 'year unknown'}) over ADT ${Math.round(u.adt)} (${u.adtYear}) = ${u.k.toFixed(4)}`);
  for (const s of r.skipped) lines.push(`ramp K skipped: ${s.ramp}: ${s.why}`);
  if (r.estimated) lines.push('ramp K is an ASSUMPTION-grade estimate: it mixes count years with ADT years of other dates (the nearest year of each row), the counts are one PM hour of environmental-review studies, and the other periods take the PM value times the period volume factors. A ramp without a counted hour is assumed to have the same K as the counted ones.');
  return lines;
}
