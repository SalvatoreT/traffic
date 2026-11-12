// Count-constrained adjustment of an origin-destination table by static assignment. No I/O.
// Method family: estimating a trip matrix from traffic counts by multiplicative scaling of the flows that use counted links
// [VanZuylen1980], [Willumsen1981]. The update below (geometric mean over the counted links of a flow's paths, per-flow bounds, a
// median rule for flows that touch no count) is our implementation of that idea, not a transcription of either paper's equations.
import type { Assignment } from './assign';

export type FlowType = 'through' | 'local' | 'ramp';

/**
 * A count expressed as a target volume on a directed link or a screenline of directed links (indices into the link list). A gate count
 * can instead name `origins` (node ids whose generated trips are counted) or `destinations`: the volume entering or leaving the model there,
 * whatever else passes the gate node.
 */
export interface Constraint { id: string; kind: string; label: string; links: number[]; target: number; weight?: number; origins?: number[]; destinations?: number[] }

export interface FitOptions {
  /** Bounds on a flow's cumulative factor relative to its starting volume. */
  lo: number; hi: number;
  /** Own bounds for flows of a type (default: lo, hi). */
  byType?: Partial<Record<FlowType, { lo: number; hi: number }>>;
  maxIter: number;
  /** Stop when every reachable constraint is within exp(tol) of its target (log ratio). */
  tol: number;
  /** Exponent on each iteration's log step (1 = full step). */
  damping: number;
  /** Factor for flows that touch no counted link: the median of the counted flows of the same type, the median of all counted flows, or 1. */
  uncounted: 'medianOfType' | 'medianAll' | 'one';
  /** Weight the median by starting volume. */
  volumeWeightedMedian: boolean;
  /** Stop also when no flow factor changes by more than this between iterations (the fit is at its bounds or in conflict). */
  stationary: number;
}
export const DEFAULT_FIT: FitOptions = { lo: 0.1, hi: 3, maxIter: 400, tol: 0.01, damping: 1, uncounted: 'medianOfType', volumeWeightedMedian: true, stationary: 1e-4 };

/** Capacity guard as soft upper limits inside the fit: links with a finite `limit` whose volume exceeds it pull their flows down with `weight` (counts have weight 1 by default, so counts win a conflict). */
export interface Guard { limit: ArrayLike<number>; weight: number }

export interface FitResult {
  /** Factor per flow relative to the starting volume. */
  g: Float64Array;
  counted: Uint8Array;
  iterations: number;
  /** Station errors below tolerance, or no factor still moving. */
  converged: boolean;
  stationary?: boolean;
  /** Volume (veh/h) the guard removed from flows that touch no count, after the median rule. */
  freeCut?: number;
  maxLogErr: number;
  atLo: number; atHi: number;
  /** Constraints no flow passes (assigned 0): cannot be fitted by scaling. */
  unreachable: string[];
  medians: Record<string, number>;
}

/** Sparse (flow, constraint, proportion) triples: the share of flow k's assigned paths that crosses constraint c. */
function membership(a: Assignment, cons: Constraint[], nLinks: number) {
  const inCons: number[][] = Array.from({ length: nLinks }, () => []);
  const byOrigin = new Map<number, number[]>(), byDest = new Map<number, number[]>();
  cons.forEach((c, i) => {
    if (!(c.target > 0)) return;
    for (const l of c.links) inCons[l].push(i);
    for (const o of c.origins ?? []) (byOrigin.get(o) ?? byOrigin.set(o, []).get(o)!).push(i);
    for (const d of c.destinations ?? []) (byDest.get(d) ?? byDest.set(d, []).get(d)!).push(i);
  });
  const kk: number[] = [], cc: number[] = [], pp: number[] = [];
  for (let k = 0; k < a.routable.length; k++) {
    if (!a.routable[k]) continue;
    const acc = new Map<number, number>();
    for (let i = a.start[k]; i < a.start[k + 1]; i++) for (const c of inCons[a.link[i]]) acc.set(c, (acc.get(c) ?? 0) + a.share[i]);
    for (const c of byOrigin.get(a.origin[k]) ?? []) acc.set(c, (acc.get(c) ?? 0) + 1);
    for (const c of byDest.get(a.destination[k]) ?? []) acc.set(c, (acc.get(c) ?? 0) + 1);
    for (const [c, p] of acc) { kk.push(k); cc.push(c); pp.push(Math.min(p, 1)); }
  }
  return { kk, cc, pp };
}

export const assigned = (a: Assignment, f: ArrayLike<number>, cons: Constraint[], nLinks: number): number[] => {
  const v = new Float64Array(nLinks);
  for (let k = 0; k < a.routable.length; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) v[a.link[i]] += f[k] * a.share[i];
  const { kk, cc, pp } = membership(a, cons.map((c) => ({ ...c, links: [] })), nLinks);
  const out = cons.map((c) => c.links.reduce((s, l) => s + v[l], 0));
  // origin / destination constraints are exact sums over the flows (no assignment share)
  for (let i = 0; i < kk.length; i++) { const c = cons[cc[i]]; if (!c.links.length) out[cc[i]] += f[kk[i]] * pp[i]; }
  return out;
};

export function weightedMedian(vals: number[], w: number[]): number {
  if (!vals.length) return 1;
  const idx = vals.map((_, i) => i).sort((x, y) => vals[x] - vals[y]);
  const tot = idx.reduce((s, i) => s + w[i], 0);
  let acc = 0;
  for (const i of idx) { acc += w[i]; if (acc >= tot / 2) return vals[i]; }
  return vals[idx[idx.length - 1]];
}

/**
 * Scale flows so assigned volumes match the targets. Each iteration multiplies flow k by exp(damping x weighted mean over the
 * constraints c on its paths of log(target_c / assigned_c)), the weights being the constraint weight times the share of the flow
 * crossing c, then clamps the cumulative factor to [lo, min(hi, ceil_k)]. Flows crossing no constraint get the `uncounted` rule after
 * the loop (they cannot change any count).
 */
export function fitToCounts(a: Assignment, v0: ArrayLike<number>, types: FlowType[], cons: Constraint[], nLinks: number, opt: FitOptions = DEFAULT_FIT, ceil?: ArrayLike<number>, guard?: Guard): FitResult {
  const n = a.routable.length;
  const { kk, cc, pp } = membership(a, cons, nLinks);
  const counted = new Uint8Array(n);
  for (const k of kk) counted[k] = 1;
  const f = Float64Array.from({ length: n }, (_, k) => v0[k]);
  const loB = (k: number) => opt.byType?.[types[k]]?.lo ?? opt.lo, hiB = (k: number) => opt.byType?.[types[k]]?.hi ?? opt.hi;
  const lo = (k: number) => loB(k) * v0[k], hi = (k: number) => Math.min(hiB(k), ceil ? ceil[k] : Infinity) * v0[k];
  const w = cons.map((c) => c.weight ?? 1);
  let it = 0, maxErr = Infinity, stationary = false;
  const unreachable = new Set<number>();
  const V = new Float64Array(nLinks);
  for (; it < opt.maxIter; it++) {
    const A = new Float64Array(cons.length);
    for (let i = 0; i < kk.length; i++) A[cc[i]] += f[kk[i]] * pp[i];
    const lr = cons.map((c, i) => (c.target > 0 && A[i] > 1e-9 ? Math.log(c.target / A[i]) : 0));
    maxErr = 0;
    cons.forEach((c, i) => { if (c.target > 0 && A[i] > 1e-9) maxErr = Math.max(maxErr, Math.abs(lr[i])); });
    const num = new Float64Array(n), den = new Float64Array(n);
    for (let i = 0; i < kk.length; i++) {
      if (A[cc[i]] <= 1e-9) continue;
      const wt = w[cc[i]] * pp[i];
      num[kk[i]] += wt * lr[cc[i]]; den[kk[i]] += wt;
    }
    if (guard) {
      V.fill(0);
      for (let k = 0; k < n; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) V[a.link[i]] += f[k] * a.share[i];
      for (let k = 0; k < n; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) {
        const l = a.link[i];
        if (V[l] > guard.limit[l]) { const wt = guard.weight * a.share[i]; num[k] += wt * Math.log(guard.limit[l] / V[l]); den[k] += wt; }
      }
    }
    if (maxErr < opt.tol && !guard) break;
    let change = 0;
    for (let k = 0; k < n; k++) if (den[k] > 0) {
      const nf = Math.min(Math.max(f[k] * Math.exp((opt.damping * num[k]) / den[k]), lo(k)), hi(k));
      change = Math.max(change, Math.abs(Math.log(nf / Math.max(f[k], 1e-12))));
      f[k] = nf;
    }
    if (change < opt.stationary) { stationary = true; break; }
  }
  {
    const A = new Float64Array(cons.length);
    for (let i = 0; i < kk.length; i++) A[cc[i]] += f[kk[i]] * pp[i];
    cons.forEach((c, i) => { if (c.target > 0 && A[i] <= 1e-9) unreachable.add(i); });
  }
  // Median factor of counted flows, by type.
  const medians: Record<string, number> = {};
  const med = (sel: (k: number) => boolean) => {
    const ks = [...Array(n).keys()].filter((k) => counted[k] && a.routable[k] && v0[k] > 0 && sel(k));
    return weightedMedian(ks.map((k) => f[k] / v0[k]), ks.map((k) => (opt.volumeWeightedMedian ? v0[k] : 1)));
  };
  for (const t of ['through', 'local', 'ramp'] as FlowType[]) medians[t] = med((k) => types[k] === t);
  medians.all = med(() => true);
  for (let k = 0; k < n; k++) {
    if (counted[k] || !a.routable[k]) continue;
    const m = opt.uncounted === 'one' ? 1 : opt.uncounted === 'medianAll' ? medians.all : medians[types[k]];
    f[k] = Math.min(Math.max(v0[k] * m, lo(k)), hi(k));
  }
  // Flows that touch no count are free to follow the guard exactly: scale them down until no guarded link is over its limit (counted flows stay).
  let freeCut = 0;
  if (guard) {
    const free = Uint8Array.from(counted, (c) => 1 - c);
    const before = f.reduce((s, x, k) => s + (free[k] ? x : 0), 0);
    const m = capacityGuard(a, f, guard.limit, nLinks, 100, free).m;
    for (let k = 0; k < n; k++) if (free[k]) f[k] *= m[k];
    freeCut = before - f.reduce((s, x, k) => s + (free[k] ? x : 0), 0);
  }
  const g = Float64Array.from(f, (x, k) => (v0[k] > 0 ? x / v0[k] : 1));
  let atLo = 0, atHi = 0;
  for (let k = 0; k < n; k++) if (counted[k] && v0[k] > 0) { if (g[k] <= loB(k) * (1 + 1e-6)) atLo++; else if (g[k] >= hiB(k) * (1 - 1e-6)) atHi++; }
  return { g, counted, iterations: it, converged: maxErr < opt.tol || stationary, stationary, maxLogErr: maxErr, atLo, atHi, unreachable: [...unreachable].map((i) => cons[i].id), medians, freeCut };
}

export interface GuardLink { link: number; before: number; after: number; limit: number }
export interface GuardResult { /** Multiplier per flow (<= 1). */ m: Float64Array; bound: GuardLink[]; passes: number; flowsReduced: number }

/**
 * Capacity sanity guard: for every link with a finite `limit` (exempt links carry Infinity) whose assigned volume exceeds it, scale
 * the flows using that link down by limit / volume; a flow on several such links takes the smallest ratio. Repeats until none exceeds. With `scalable`, only flows marked 1 move.
 */
export function capacityGuard(a: Assignment, f: ArrayLike<number>, limit: ArrayLike<number>, nLinks: number, maxPass = 100, scalable?: ArrayLike<number>): GuardResult {
  const n = a.routable.length;
  const cur = Float64Array.from({ length: n }, (_, k) => f[k]);
  const m = new Float64Array(n).fill(1);
  const first = new Map<number, GuardLink>();
  let pass = 0;
  for (; pass < maxPass; pass++) {
    const V = new Float64Array(nLinks);
    for (let k = 0; k < n; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) V[a.link[i]] += cur[k] * a.share[i];
    const ratio = new Float64Array(nLinks).fill(1);
    let any = false;
    for (let l = 0; l < nLinks; l++) if (V[l] > limit[l] * (1 + 1e-6)) { ratio[l] = limit[l] / V[l]; any = true; if (!first.has(l)) first.set(l, { link: l, before: V[l], after: V[l], limit: limit[l] }); }
    if (!any) break;
    let moved = false;
    for (let k = 0; k < n; k++) {
      if (scalable && !scalable[k]) continue;
      let r = 1;
      for (let i = a.start[k]; i < a.start[k + 1]; i++) r = Math.min(r, ratio[a.link[i]]);
      if (r < 1) { cur[k] *= r; m[k] *= r; moved = true; }
    }
    if (!moved) break;
  }
  const V = new Float64Array(nLinks);
  for (let k = 0; k < n; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) V[a.link[i]] += cur[k] * a.share[i];
  for (const b of first.values()) b.after = V[b.link];
  let flowsReduced = 0;
  for (let k = 0; k < n; k++) if (m[k] < 1 - 1e-9) flowsReduced++;
  return { m, bound: [...first.values()].sort((x, y) => y.before / y.limit - x.before / x.limit), passes: pass, flowsReduced };
}
