// Published acceptance statistics, hold-out selection, seed summaries and the damped cost average used by the calibration tools.
//
// Flow criteria, as stated in docs/simulator-audit.md "Standard acceptance criteria, as published":
//  - GEH = sqrt(2 (M - C)^2 / (M + C)) for hourly flows M (modeled) and C (counted) [TfL-TMG4] appendix II; GEH below 5 in more than 85% of cases [WebTAG-M3.1] 3.3.10 to 3.3.12.
//  - Size bands: within 100 veh/h below 700 veh/h; within 15% from 700 to 2,700; within 400 above 2,700; in more than 85% of cases [WebTAG-M3.1] table 2.
//  - Vendor bands: 0 to 5 good, 5 to 10 investigate, above 10 unacceptable [Aimsun-Manual] (calibration page).
//  - Cost feedback: method of successive averages with weight 1/n (or 2/(n+1)), stopped on a relative gap or on the share of links whose cost changed
//    by under 1% [WebTAG-M3.1] 3.4 and table 4; [Aimsun-Manual] DUE page; [SUMO-Docs] dynamic user assignment page.

export const GEH_GOOD = 5;
export const GEH_UNACCEPTABLE = 10;
export const SHARE_REQUIRED = 0.85;

/** GEH of hourly flows. Zero when both are zero. */
export function geh(modeled: number, counted: number): number {
  const s = modeled + counted;
  return s > 0 ? Math.sqrt((2 * (modeled - counted) ** 2) / s) : 0;
}

export type Band = 'below 700' | '700 to 2700' | 'above 2700';

export function bandOf(counted: number): Band {
  return counted < 700 ? 'below 700' : counted <= 2700 ? '700 to 2700' : 'above 2700';
}

/** The permitted difference (veh/h) for a counted flow under the WebTAG size bands. */
export function bandLimit(counted: number): number {
  return counted < 700 ? 100 : counted <= 2700 ? 0.15 * counted : 400;
}

export const withinBand = (modeled: number, counted: number): boolean => Math.abs(modeled - counted) <= bandLimit(counted);

export type GehClass = 'good' | 'investigate' | 'unacceptable';
export const gehClass = (g: number): GehClass => (g < GEH_GOOD ? 'good' : g <= GEH_UNACCEPTABLE ? 'investigate' : 'unacceptable');

export interface FlowCase { id: string; modeled: number; counted: number; held?: boolean }
export interface CaseResult extends FlowCase { geh: number; gehOk: boolean; bandOk: boolean; gehClass: GehClass; band: Band }

export function evaluateCases(cases: FlowCase[]): CaseResult[] {
  return cases.map((c) => { const g = geh(c.modeled, c.counted); return { ...c, geh: g, gehOk: g < GEH_GOOD, bandOk: withinBand(c.modeled, c.counted), gehClass: gehClass(g), band: bandOf(c.counted) }; });
}

export interface AcceptanceSummary { n: number; gehOk: number; bandOk: number; either: number; both: number; gehShare: number; bandShare: number; meets: boolean; meanGeh: number }

/** Share of cases passing each criterion; `meets` when GEH passes in more than 85% of cases or the bands do (the guidance says either suffices; both are reported). */
export function summarizeCases(rs: CaseResult[]): AcceptanceSummary {
  const n = rs.length;
  const c = (f: (r: CaseResult) => boolean) => rs.filter(f).length;
  const gehOk = c((r) => r.gehOk), bandOk = c((r) => r.bandOk);
  return { n, gehOk, bandOk, either: c((r) => r.gehOk || r.bandOk), both: c((r) => r.gehOk && r.bandOk), gehShare: n ? gehOk / n : 0, bandShare: n ? bandOk / n : 0, meets: n > 0 && (gehOk / n > SHARE_REQUIRED || bandOk / n > SHARE_REQUIRED), meanGeh: n ? rs.reduce((a, r) => a + r.geh, 0) / n : 0 };
}

// ---------- hold-out selection ----------
export interface HoldoutStation { id: string; corridor: string; target: number }
export interface HoldoutOptions { /** Share of each corridor's stations held out (default 0.25). */ fraction?: number; /** Every corridor keeps at least this many held-out stations (default 1). */ minPerCorridor?: number }

/**
 * Deterministic validation set: within each corridor the stations are ordered by descending target (ties by id) and every k-th one is held out, k = round(1 / fraction),
 * starting at position 1 so the largest count of a corridor stays in the fit; a corridor with a single station gives it up (so every corridor is covered at least once).
 * No random draw, so the same stations are held out whenever the station list is the same.
 */
export function selectHoldout(stations: HoldoutStation[], opt: HoldoutOptions = {}): Set<string> {
  const k = Math.max(2, Math.round(1 / (opt.fraction ?? 0.25)));
  const min = opt.minPerCorridor ?? 1;
  const by = new Map<string, HoldoutStation[]>();
  for (const s of stations) (by.get(s.corridor) ?? by.set(s.corridor, []).get(s.corridor)!).push(s);
  const out = new Set<string>();
  for (const [, list] of by) {
    list.sort((a, b) => b.target - a.target || a.id.localeCompare(b.id));
    const picked = list.filter((_, i) => i % k === 1);
    for (let i = list.length - 1; picked.length < Math.min(min, list.length) && i >= 0; i--) if (!picked.includes(list[i])) picked.push(list[i]);
    for (const s of picked) out.add(s.id);
  }
  return out;
}

export function corridors(stations: HoldoutStation[]): string[] { return [...new Set(stations.map((s) => s.corridor))].sort(); }

// ---------- seed summaries ----------
const T975 = [12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145, 2.131, 2.120, 2.110, 2.101, 2.093, 2.086, 2.080, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045, 2.042];
/** Two-sided 97.5% quantile of Student's t (table values for 1 to 30 degrees of freedom, 1.96 beyond 120). */
export const t975 = (df: number): number => (df < 1 ? NaN : df <= 30 ? T975[df - 1] : df <= 60 ? 2.0 : df <= 120 ? 1.98 : 1.96);

export interface SeedStat { n: number; mean: number; sd: number; min: number; max: number; lo: number; hi: number }
export function seedStat(xs: number[]): SeedStat {
  const v = xs.filter((x) => Number.isFinite(x));
  const n = v.length;
  if (!n) return { n: 0, mean: NaN, sd: NaN, min: NaN, max: NaN, lo: NaN, hi: NaN };
  const mean = v.reduce((a, b) => a + b, 0) / n;
  const sd = n > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : 0;
  const half = n > 1 ? (t975(n - 1) * sd) / Math.sqrt(n) : 0;
  return { n, mean, sd, min: Math.min(...v), max: Math.max(...v), lo: mean - half, hi: mean + half };
}

/** Per-link standard deviation over seeds (sample, n - 1) of flows given as one array per seed. */
export function linkSpread(perSeed: ArrayLike<number>[]): { mean: Float64Array; sd: Float64Array } {
  const n = perSeed.length, L = n ? perSeed[0].length : 0;
  const mean = new Float64Array(L), sd = new Float64Array(L);
  for (let l = 0; l < L; l++) {
    let s = 0;
    for (let k = 0; k < n; k++) s += perSeed[k][l];
    mean[l] = s / n;
    let q = 0;
    for (let k = 0; k < n; k++) q += (perSeed[k][l] - mean[l]) ** 2;
    sd[l] = n > 1 ? Math.sqrt(q / (n - 1)) : 0;
  }
  return { mean, sd };
}

/** Compact integer encoding for the noise file: value in `unit` steps, capped at the Uint16 range. */
export function encodeUint16(xs: ArrayLike<number>, unit: number): number[] {
  const out: number[] = new Array(xs.length);
  for (let i = 0; i < xs.length; i++) out[i] = Math.max(0, Math.min(65535, Math.round(xs[i] / unit)));
  return out;
}

// ---------- damped cost feedback ----------
/** Method of successive averages on a cost vector: new = (1 - 1/n) previous + (1/n) measured, n counted from 1 (the first iteration takes the measurement as it is). */
export function msaAverage(previous: ArrayLike<number> | null, measured: ArrayLike<number>, n: number, weight: 'mean' | 'twoOverNPlusOne' = 'mean'): Float64Array {
  const out = new Float64Array(measured.length);
  const w = n <= 1 || !previous ? 1 : weight === 'mean' ? 1 / n : 2 / (n + 1);
  for (let i = 0; i < out.length; i++) out[i] = previous ? (1 - w) * previous[i] + w * measured[i] : measured[i];
  return out;
}

/** Relative gap of the cost vector: sum |new - old| over sum of old plus a small floor (0 when both are zero). */
export function relativeGap(oldCost: ArrayLike<number>, newCost: ArrayLike<number>): number {
  let d = 0, s = 0;
  for (let i = 0; i < oldCost.length; i++) { d += Math.abs(newCost[i] - oldCost[i]); s += Math.abs(oldCost[i]); }
  return s > 0 ? d / s : d > 0 ? Infinity : 0;
}

/** Share of links whose cost changed by less than `threshold` (relative, or under `floorS` seconds, the rounding of the delay file). */
export function shareUnchanged(oldCost: ArrayLike<number>, newCost: ArrayLike<number>, threshold = 0.01, floorS = 0.1): number {
  let ok = 0;
  const n = oldCost.length;
  for (let i = 0; i < n; i++) if (Math.abs(newCost[i] - oldCost[i]) <= Math.max(threshold * Math.abs(oldCost[i]), floorS)) ok++;
  return n ? ok / n : 1;
}
