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
export interface Constraint {
  id: string; kind: string; label: string; links: number[]; target: number; weight?: number; origins?: number[]; destinations?: number[];
  /** A route feature (turning movement or path): index into the feature list the assignment was made with. The flow of the constraint is the sum over flows of volume x the share of the flow's routes that have it. */
  feature?: number;
  /**
   * Share constraint: `target` is a share in (0,1) and the constraint holds when (sum of flow x num) / (sum of flow x den) equals it.
   * `den[i]` is the proportion of flow `flows[i]` that falls in the denominator group (it crosses the select link, uses the ramp), `num[i]` the
   * proportion that is also in the numerator group (freeway end, names the street). Flows in the numerator are scaled by (target / modeled)^w,
   * the rest of the denominator by ((1 - target) / (1 - modeled))^w, w being the constraint weight times the proportion in the denominator.
   */
  ratio?: { flows: ArrayLike<number>; den: ArrayLike<number>; num: ArrayLike<number> };
}

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
  /** With soft terms (guard, share constraints) the fit also needs the volume-weighted mean relative step of the flows below this before it stops on tolerance. */
  softStep: number;
  /** Stop as stalled when the worst log error of the unblocked stations improved by less than `stallGain` (absolute) over `stallWindow` iterations. */
  stallWindow: number; stallGain: number;
  /** A station is blocked when at least this share of the flow it needs to move sits on the bound in the needed direction. */
  blockedShare: number;
  /** Count stations within this log error are left out of the update (their flows follow the stations that are still off); 0 keeps them in. */
  band: number;
  /** Tolerance on a share constraint, in share points (modeled share minus target), for the report only. */
  shareTol: number;
  /** Flows held at their starting volume (1 = pinned): the assumed movement flows, whose volume is a decision and not an estimate (ASSUMPTION, round 20). */
  pinned?: ArrayLike<number>;
}
export const DEFAULT_FIT: FitOptions = { lo: 0.1, hi: 3, maxIter: 400, tol: 0.01, damping: 1, uncounted: 'medianOfType', volumeWeightedMedian: true, stationary: 1e-4, softStep: 1e-3, stallWindow: 25, stallGain: 0.002, blockedShare: 0.8, band: 0, shareTol: 0.02 };

/** Capacity guard as soft upper limits inside the fit: links with a finite `limit` whose volume exceeds it pull their flows down with `weight` (counts have weight 1 by default, so counts win a conflict). */
export interface Guard { limit: ArrayLike<number>; weight: number }

export interface Conflict {
  id: string; label: string; target: number; assigned: number; logErr: number;
  /** Flows pinned on the bound that the station needs to move: share of its assigned volume (0..1), and which bound. */
  pinned: number; bound: 'lo' | 'hi' | 'none';
  /** Stations that pull the same flows the other way, largest shared volume first. */
  opposing: { id: string; label: string; logErr: number; sharedVeh: number }[];
}

export interface FitResult {
  /** Factor per flow relative to the starting volume. */
  g: Float64Array;
  counted: Uint8Array;
  iterations: number;
  /** Station errors below tolerance (blocked stations excluded), or no factor still moving. */
  converged: boolean;
  stationary?: boolean;
  /** Why the loop ended. */
  stoppedBy: 'tolerance' | 'stalled' | 'stationary' | 'iteration limit';
  /** Worst log error over the count stations, blocked ones included, and over the stations that are not blocked. */
  maxLogErrAll: number;
  /** The unblocked station with the worst error at the end. */
  worstFree: { id: string; label: string; logErr: number } | null;
  /** Stations still outside tolerance at the end, with what holds them back. */
  conflicts: Conflict[];
  /** Share constraints at the end: modeled and target share. */
  shares: { id: string; target: number; modeled: number; start: number }[];
  /** Worst log error of the unblocked stations per iteration (every 10th, plus the last). */
  trace: number[];
  /** Largest log step of any flow per iteration (same sampling as `trace`). */
  stepTrace: number[];
  /** Volume (veh/h) the guard removed from flows that touch no count, after the median rule. */
  freeCut?: number;
  maxLogErr: number;
  atLo: number; atHi: number;
  /** Constraints no flow passes (assigned 0): cannot be fitted by scaling. */
  unreachable: string[];
  medians: Record<string, number>;
}

/** Sparse (flow, constraint, proportion) triples: the share of flow k's assigned paths that crosses constraint c (ratio constraints: the denominator proportion, with the numerator fraction in `nf`). */
function membership(a: Assignment, cons: Constraint[], nLinks: number) {
  const inCons: number[][] = Array.from({ length: nLinks }, () => []);
  const byOrigin = new Map<number, number[]>(), byDest = new Map<number, number[]>();
  const ratioOf: Map<number, { den: number; nf: number }>[] = [];
  const ratioCons: number[][] = Array.from({ length: a.routable.length }, () => []);
  cons.forEach((c, i) => {
    if (!(c.target > 0)) return;
    if (c.ratio) {
      const m = new Map<number, { den: number; nf: number }>();
      for (let j = 0; j < c.ratio.flows.length; j++) if (c.ratio.den[j] > 0) { m.set(c.ratio.flows[j], { den: Math.min(c.ratio.den[j], 1), nf: Math.min(c.ratio.num[j] / c.ratio.den[j], 1) }); ratioCons[c.ratio.flows[j]].push(i); }
      ratioOf[i] = m;
      return;
    }
    for (const l of c.links) inCons[l].push(i);
    for (const o of c.origins ?? []) (byOrigin.get(o) ?? byOrigin.set(o, []).get(o)!).push(i);
    for (const d of c.destinations ?? []) (byDest.get(d) ?? byDest.set(d, []).get(d)!).push(i);
  });
  const byFeature = new Map<number, number[]>();
  cons.forEach((c, i) => { if (c.feature !== undefined && c.target > 0 && !c.ratio) (byFeature.get(c.feature) ?? byFeature.set(c.feature, []).get(c.feature)!).push(i); });
  const kk: number[] = [], cc: number[] = [], pp: number[] = [], nf: number[] = [];
  for (let k = 0; k < a.routable.length; k++) {
    if (!a.routable[k]) continue;
    const acc = new Map<number, number>();
    if (a.feat && byFeature.size) for (let i = a.feat.start[k]; i < a.feat.start[k + 1]; i++) for (const c of byFeature.get(a.feat.id[i]) ?? []) acc.set(c, (acc.get(c) ?? 0) + a.feat.share[i]);
    for (let i = a.start[k]; i < a.start[k + 1]; i++) for (const c of inCons[a.link[i]]) acc.set(c, (acc.get(c) ?? 0) + a.share[i]);
    for (const c of byOrigin.get(a.origin[k]) ?? []) acc.set(c, (acc.get(c) ?? 0) + 1);
    for (const c of byDest.get(a.destination[k]) ?? []) acc.set(c, (acc.get(c) ?? 0) + 1);
    for (const [c, p] of acc) { kk.push(k); cc.push(c); pp.push(Math.min(p, 1)); nf.push(0); }
    for (const c of ratioCons[k]) { const r = ratioOf[c].get(k)!; kk.push(k); cc.push(c); pp.push(r.den); nf.push(r.nf); }
  }
  return { kk, cc, pp, nf };
}

/** Assigned volume per constraint: the sum over its links (or origins / destinations); for a share constraint the modeled share. */
export const assigned = (a: Assignment, f: ArrayLike<number>, cons: Constraint[], nLinks: number): number[] => {
  const v = new Float64Array(nLinks);
  for (let k = 0; k < a.routable.length; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) v[a.link[i]] += f[k] * a.share[i];
  const { kk, cc, pp, nf } = membership(a, cons.map((c) => (c.ratio ? c : { ...c, links: [] })), nLinks);
  const out = cons.map((c) => (c.ratio ? 0 : c.links.reduce((s, l) => s + v[l], 0)));
  const num = new Float64Array(cons.length);
  // origin / destination constraints are exact sums over the flows (no assignment share)
  for (let i = 0; i < kk.length; i++) {
    const c = cons[cc[i]];
    if (c.ratio) { out[cc[i]] += f[kk[i]] * pp[i]; num[cc[i]] += f[kk[i]] * pp[i] * nf[i]; } else if (!c.links.length) out[cc[i]] += f[kk[i]] * pp[i];
  }
  cons.forEach((c, i) => { if (c.ratio) out[i] = out[i] > 1e-9 ? num[i] / out[i] : NaN; });
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
 * crossing c, then clamps the cumulative factor to [lo, min(hi, ceil_k)]. A share constraint contributes log(target / modeled) to the flows in
 * its numerator and log((1 - target) / (1 - modeled)) to the rest of its denominator. Flows crossing no constraint get the `uncounted` rule after
 * the loop (they cannot change any count).
 *
 * Stopping: a station is blocked when the flows it needs to move sit on the bound in the needed direction, so no further iteration can help. The loop
 * ends on tolerance when every unblocked count station is within `tol` (log) and, if guard or share terms are present, no flow still steps by more
 * than `softStep`; as stalled when the worst unblocked error stops improving; or when nothing moves. Stations left outside tolerance are returned in
 * `conflicts` with the stations that pull their flows the other way.
 */
export function fitToCounts(a: Assignment, v0: ArrayLike<number>, types: FlowType[], cons: Constraint[], nLinks: number, opt: FitOptions = DEFAULT_FIT, ceil?: ArrayLike<number>, guard?: Guard): FitResult {
  const n = a.routable.length;
  const { kk, cc, pp, nf } = membership(a, cons, nLinks);
  const counted = new Uint8Array(n);
  for (let i = 0; i < kk.length; i++) if (!cons[cc[i]].ratio) counted[kk[i]] = 1;
  const f = Float64Array.from({ length: n }, (_, k) => v0[k]);
  const pin = (k: number) => !!opt.pinned && opt.pinned[k] === 1;
  const loB = (k: number) => (pin(k) ? 1 : opt.byType?.[types[k]]?.lo ?? opt.lo), hiB = (k: number) => (pin(k) ? 1 : opt.byType?.[types[k]]?.hi ?? opt.hi);
  const lo = (k: number) => loB(k) * v0[k], hi = (k: number) => Math.min(hiB(k), ceil ? ceil[k] : Infinity) * v0[k];
  const w = cons.map((c) => c.weight ?? 1);
  const isRatio = cons.map((c) => !!c.ratio);
  const hasSoft = !!guard || isRatio.some(Boolean);
  const nC = cons.length;
  const clampS = (x: number) => Math.min(Math.max(x, 1e-4), 1 - 1e-4);
  let it = 0, maxErrAll = Infinity, maxErrFree = Infinity, stationary = false, stalled = false, stoppedBy: FitResult['stoppedBy'] = 'iteration limit';
  const unreachable = new Set<number>();
  const V = new Float64Array(nLinks);
  const trace: number[] = [], stepTrace: number[] = [];
  const hist: number[] = [];
  const A = new Float64Array(nC), Nn = new Float64Array(nC);
  const startShare = new Float64Array(nC).fill(NaN);
  const pinHi = new Float64Array(nC), pinLo = new Float64Array(nC);
  const aggregate = () => {
    A.fill(0); Nn.fill(0); pinHi.fill(0); pinLo.fill(0);
    for (let i = 0; i < kk.length; i++) {
      const k = kk[i], c = cc[i], x = f[k] * pp[i];
      A[c] += x; Nn[c] += x * nf[i];
      if (f[k] >= hi(k) * (1 - 1e-9)) pinHi[c] += x;
      if (f[k] <= lo(k) * (1 + 1e-9)) pinLo[c] += x;
    }
  };
  const logErr = (c: number) => (!isRatio[c] && cons[c].target > 0 && A[c] > 1e-9 ? Math.log(cons[c].target / A[c]) : 0);
  // Stations in tension: outside tolerance, with other stations outside tolerance the other way (or the capacity guard) on their flows, in volume at least half
  // of their shortfall. Found every 10 iterations from iteration 20 and kept out of the stopping test (they stay in the update and in `conflicts`).
  const tension = new Uint8Array(nC);
  const byFlowT: number[][] = [];
  { for (let k = 0; k < n; k++) byFlowT.push([]); for (let i = 0; i < kk.length; i++) byFlowT[kk[i]].push(i); }
  const triplesT: number[][] = Array.from({ length: nC }, () => []);
  for (let i = 0; i < kk.length; i++) triplesT[cc[i]].push(i);
  /** Flows on a link the guard currently pulls down (volume above its limit). */
  const guardPushed = () => {
    const out = new Uint8Array(n);
    if (!guard) return out;
    V.fill(0);
    for (let k = 0; k < n; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) V[a.link[i]] += f[k] * a.share[i];
    for (let k = 0; k < n; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) if (V[a.link[i]] > guard.limit[a.link[i]]) { out[k] = 1; break; }
    return out;
  };
  const markTension = () => {
    tension.fill(0);
    const pushed = guardPushed();
    const openS = [...Array(nC).keys()].filter((c) => !isRatio[c] && cons[c].target > 0 && A[c] > 1e-9 && Math.abs(logErr(c)) > opt.tol);
    for (const c of openS) {
      const e = logErr(c), shared = new Map<number, number>();
      for (const i of triplesT[c]) for (const j of byFlowT[kk[i]]) {
        const c2 = cc[j];
        if (c2 === c || isRatio[c2] || Math.sign(logErr(c2)) === Math.sign(e) || Math.abs(logErr(c2)) <= opt.tol) continue;
        shared.set(c2, (shared.get(c2) ?? 0) + f[kk[i]] * Math.min(pp[i], pp[j]));
      }
      // The opposing stations, and the guard, pull this station's flows the other way: when that volume covers at least half of its shortfall the
      // residual error is the balance between them, not slow convergence.
      let opp = 0;
      for (const v of shared.values()) opp += v;
      if (e > 0 && guard) for (const i of triplesT[c]) if (pushed[kk[i]]) opp += f[kk[i]] * pp[i];
      if (opp >= 0.5 * Math.abs(cons[c].target - A[c])) tension[c] = 1;
    }
  };
  const blocked = (c: number) => { if (tension[c]) return true; const e = logErr(c); return (e > opt.tol && pinHi[c] >= opt.blockedShare * A[c]) || (e < -opt.tol && pinLo[c] >= opt.blockedShare * A[c]); };
  for (; it < opt.maxIter; it++) {
    aggregate();
    if (it >= 20 && it % 10 === 0) markTension();
    if (it === 0) cons.forEach((c, i) => { if (isRatio[i] && A[i] > 1e-9) startShare[i] = Nn[i] / A[i]; });
    maxErrAll = 0; maxErrFree = 0;
    for (let c = 0; c < nC; c++) {
      if (isRatio[c]) continue;
      const e = Math.abs(logErr(c));
      maxErrAll = Math.max(maxErrAll, e);
      if (!blocked(c)) maxErrFree = Math.max(maxErrFree, e);
    }
    hist.push(maxErrFree);
    if (it % 10 === 0) trace.push(maxErrFree);
    const lrNum = new Float64Array(nC), lrCom = new Float64Array(nC);
    for (let c = 0; c < nC; c++) {
      if (!(cons[c].target > 0) || A[c] <= 1e-9) continue;
      if (isRatio[c]) { const r = clampS(Nn[c] / A[c]), s = clampS(cons[c].target); lrNum[c] = Math.log(s / r); lrCom[c] = Math.log((1 - s) / (1 - r)); } else lrNum[c] = lrCom[c] = Math.log(cons[c].target / A[c]);
    }
    const num = new Float64Array(n), den = new Float64Array(n);
    for (let i = 0; i < kk.length; i++) {
      const c = cc[i];
      if (A[c] <= 1e-9) continue;
      if (opt.band > 0 && !isRatio[c] && Math.abs(lrNum[c]) < opt.band) continue;
      const wt = w[c] * pp[i];
      num[kk[i]] += wt * (nf[i] * lrNum[c] + (1 - nf[i]) * lrCom[c]); den[kk[i]] += wt;
    }
    if (guard) {
      V.fill(0);
      for (let k = 0; k < n; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) V[a.link[i]] += f[k] * a.share[i];
      for (let k = 0; k < n; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) {
        const l = a.link[i];
        if (V[l] > guard.limit[l]) { const wt = guard.weight * a.share[i]; num[k] += wt * Math.log(guard.limit[l] / V[l]); den[k] += wt; }
      }
    }
    if (maxErrFree < opt.tol && !hasSoft) { stoppedBy = 'tolerance'; break; }
    let change = 0, drift = 0, vol = 0;
    for (let k = 0; k < n; k++) if (den[k] > 0) {
      const nfk = Math.min(Math.max(f[k] * Math.exp((opt.damping * num[k]) / den[k]), lo(k)), hi(k));
      change = Math.max(change, Math.abs(Math.log(nfk / Math.max(f[k], 1e-12))));
      drift += Math.abs(nfk - f[k]); vol += f[k];
      f[k] = nfk;
    }
    drift /= Math.max(vol, 1e-9);
    if (it % 10 === 0) stepTrace.push(change);
    if (maxErrFree < opt.tol && drift < opt.softStep) { stoppedBy = 'tolerance'; it++; break; }
    if (change < opt.stationary) { stationary = true; stoppedBy = 'stationary'; it++; break; }
    if (hist.length > opt.stallWindow && maxErrFree >= opt.tol && hist[hist.length - 1 - opt.stallWindow] - maxErrFree < opt.stallGain && change < 0.01) { stalled = true; stoppedBy = 'stalled'; it++; break; }
  }
  aggregate();
  trace.push(hist[hist.length - 1] ?? 0);
  maxErrAll = 0; maxErrFree = 0;
  let worstFree: FitResult['worstFree'] = null;
  for (let c = 0; c < nC; c++) { if (isRatio[c] || !(cons[c].target > 0)) continue; const e = Math.abs(logErr(c)); maxErrAll = Math.max(maxErrAll, e); if (!blocked(c) && e >= maxErrFree) { maxErrFree = e; worstFree = { id: cons[c].id, label: cons[c].label, logErr: logErr(c) }; } }
  for (let c = 0; c < nC; c++) if (cons[c].target > 0 && A[c] <= 1e-9) unreachable.add(c);
  // Stations still outside tolerance and the stations that pull the same flows the other way.
  const conflicts: Conflict[] = [];
  const open = [...Array(nC).keys()].filter((c) => !isRatio[c] && cons[c].target > 0 && A[c] > 1e-9 && Math.abs(logErr(c)) > opt.tol);
  const pushedEnd = guardPushed();
  if (open.length) {
    const byFlow = new Map<number, number[]>();
    for (let i = 0; i < kk.length; i++) (byFlow.get(kk[i]) ?? byFlow.set(kk[i], []).get(kk[i])!).push(i);
    const triplesOf = new Map<number, number[]>();
    for (let i = 0; i < kk.length; i++) (triplesOf.get(cc[i]) ?? triplesOf.set(cc[i], []).get(cc[i])!).push(i);
    for (const c of open) {
      const e = logErr(c);
      const shared = new Map<number, number>();
      for (const i of triplesOf.get(c) ?? []) for (const j of byFlow.get(kk[i]) ?? []) {
        const c2 = cc[j];
        if (c2 === c || isRatio[c2]) continue;
        const e2 = logErr(c2);
        if (Math.sign(e2) === Math.sign(e) || Math.abs(e2) <= opt.tol) continue;
        shared.set(c2, (shared.get(c2) ?? 0) + f[kk[i]] * Math.min(pp[i], pp[j]));
      }
      const pinned = e > 0 ? pinHi[c] / A[c] : pinLo[c] / A[c];
      let gv = 0;
      if (e > 0 && guard) for (const i of triplesOf.get(c) ?? []) if (pushedEnd[kk[i]]) gv += f[kk[i]] * pp[i];
      conflicts.push({
        id: cons[c].id, label: cons[c].label, target: cons[c].target, assigned: A[c], logErr: e, pinned, bound: pinned >= opt.blockedShare ? (e > 0 ? 'hi' : 'lo') : 'none',
        opposing: [...shared.entries(), ...(gv > 0 ? [[-1, gv] as [number, number]] : [])].sort((x, y) => y[1] - x[1]).slice(0, 3).map(([c2, v]) => (c2 < 0 ? { id: 'capacity guard', label: 'uncounted links over their limit', logErr: NaN, sharedVeh: v } : { id: cons[c2].id, label: cons[c2].label, logErr: logErr(c2), sharedVeh: v })),
      });
    }
    conflicts.sort((x, y) => Math.abs(y.logErr) - Math.abs(x.logErr));
  }
  const shares = cons.map((c, i) => ({ c, i })).filter((x) => isRatio[x.i]).map(({ c, i }) => ({ id: c.id, target: c.target, modeled: A[i] > 1e-9 ? Nn[i] / A[i] : NaN, start: startShare[i] }));
  // Median factor of counted flows, by type.
  const medians: Record<string, number> = {};
  const med = (sel: (k: number) => boolean) => {
    const ks = [...Array(n).keys()].filter((k) => counted[k] && !pin(k) && a.routable[k] && v0[k] > 0 && sel(k));
    return weightedMedian(ks.map((k) => f[k] / v0[k]), ks.map((k) => (opt.volumeWeightedMedian ? v0[k] : 1)));
  };
  for (const t of ['through', 'local', 'ramp'] as FlowType[]) medians[t] = med((k) => types[k] === t);
  medians.all = med(() => true);
  const touched = new Uint8Array(n);
  for (const k of kk) touched[k] = 1;
  for (let k = 0; k < n; k++) {
    if (touched[k] || !a.routable[k]) continue;
    const m = opt.uncounted === 'one' ? 1 : opt.uncounted === 'medianAll' ? medians.all : medians[types[k]];
    f[k] = Math.min(Math.max(v0[k] * m, lo(k)), hi(k));
  }
  // Flows that touch no count are free to follow the guard exactly: scale them down until no guarded link is over its limit (counted flows stay).
  let freeCut = 0;
  if (guard) {
    const free = Uint8Array.from(touched, (c, k) => (pin(k) ? 0 : 1 - c));
    const before = f.reduce((s, x, k) => s + (free[k] ? x : 0), 0);
    const m = capacityGuard(a, f, guard.limit, nLinks, 100, free).m;
    for (let k = 0; k < n; k++) if (free[k]) f[k] *= m[k];
    freeCut = before - f.reduce((s, x, k) => s + (free[k] ? x : 0), 0);
  }
  const g = Float64Array.from(f, (x, k) => (v0[k] > 0 ? x / v0[k] : 1));
  let atLo = 0, atHi = 0;
  for (let k = 0; k < n; k++) if (counted[k] && v0[k] > 0) { if (g[k] <= loB(k) * (1 + 1e-6)) atLo++; else if (g[k] >= hiB(k) * (1 - 1e-6)) atHi++; }
  return { g, counted, iterations: it, converged: stoppedBy === 'tolerance' || stationary, stationary, stoppedBy, maxLogErr: maxErrFree, maxLogErrAll: maxErrAll, worstFree, conflicts, shares, trace, stepTrace, atLo, atHi, unreachable: [...unreachable].map((i) => cons[i].id), medians, freeCut };
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
