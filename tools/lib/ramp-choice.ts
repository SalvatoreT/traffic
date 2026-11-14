// Ramp choice made upstream (calibration round 25, ASSUMPTION). No I/O, no street names.
// The simulator picks the off-ramp of a trip from the mainline gate by its own costs, and two ramps whose paths to a destination differ by seconds split such trips on noise and queue
// length. The count fit already decided how each flow divides over the ramps (its static assignment meets the ramp counts and the counts downstream of each ramp terminal), so the builder
// splits every off-ramp flow by those shares and writes the ramp movement as the flow's `via`. The simulator keeps the movement while it costs at most `maxDetour` times the plain route
// and falls back on the flow's other ramps, then on the plain route (see via-detour-fallback).
import type { Assignment } from './assign';

/** An off-ramp: `b` is its last freeway-class link (it ends at the surface node), `from` the node it leaves. */
export interface OffRamp { b: number; from: number }
export interface RampChoiceCfg { enabled: boolean; /** The simulator keeps the ramp while its route costs at most this multiple of the plain route (ASSUMPTION). */ maxDetour: number; /** A ramp that carries less than this share of a flow's trips is ignored and its trips go to the others (ASSUMPTION). */ minShare: number }
export interface RampFlow { origin: number; destination: number; vehPerHour: number; mode?: string; via?: { a: number; b: number; maxDetour?: number; alternatives?: { a: number; b: number }[] } }

export interface RampSplit<T> { flows: T[]; /** Flows divided over two ramps or more. */ divided: number; /** Flows that got a ramp movement (divided or not). */ forced: number; /** Volume (veh/h) per ramp link. */ byRamp: Map<number, number> }

/**
 * Splits each flow `k` for which `isOffRamp(k)` holds over the off-ramps its final assignment uses. `volume[k]` is the fitted volume; `linkFrom[l]` and `linkTo[l]` the end nodes of link `l`.
 * A flow whose assignment uses no ramp, or that already has a `via`, is returned as it is.
 */
export function splitByRamp<T extends RampFlow>(flows: T[], volume: number[], a: Assignment, isOffRamp: (k: number) => boolean, ramps: OffRamp[], linkFrom: ArrayLike<number>, linkTo: ArrayLike<number>, cfg: RampChoiceCfg): RampSplit<T> {
  const rampOf = new Map(ramps.map((r) => [r.b, r]));
  const out: T[] = [];
  const byRamp = new Map<number, number>();
  let divided = 0, forced = 0;
  flows.forEach((f, k) => {
    const v = volume[k];
    if (!isOffRamp(k) || f.via || !a.routable[k]) { out.push({ ...f, vehPerHour: v }); return; }
    const use = new Map<number, { share: number; feeder: number | null }>();
    const onPath = new Set<number>();
    for (let i = a.start[k]; i < a.start[k + 1]; i++) onPath.add(a.link[i]);
    for (let i = a.start[k]; i < a.start[k + 1]; i++) {
      const r = rampOf.get(a.link[i]);
      if (!r) continue;
      let feeder: number | null = null;
      for (const l of onPath) if (l !== r.b && linkTo[l] === r.from) { feeder = l; break; }
      if (feeder === null) continue;
      use.set(r.b, { share: (use.get(r.b)?.share ?? 0) + a.share[i], feeder });
    }
    const kept = [...use].filter(([, u]) => u.share >= cfg.minShare);
    const sum = kept.reduce((s, [, u]) => s + u.share, 0);
    if (!kept.length || sum <= 0) { out.push({ ...f, vehPerHour: v }); return; }
    forced++;
    if (kept.length > 1) divided++;
    for (const [b, u] of kept) {
      const part = (v * u.share) / sum;
      const alternatives = kept.filter(([b2]) => b2 !== b).map(([b2, u2]) => ({ a: u2.feeder!, b: b2 }));
      out.push({ ...f, vehPerHour: part, via: { a: u.feeder!, b, maxDetour: cfg.maxDetour, ...(alternatives.length ? { alternatives } : {}) } });
      byRamp.set(b, (byRamp.get(b) ?? 0) + part);
    }
  });
  return { flows: out, divided, forced, byRamp };
}

/** The off-ramps of a network: the freeway-class link that ends at the surface node of each off-ramp, with the node it leaves. */
export function offRampLinks(rampSurfaces: number[], links: { id: number; from: number; to: number; class: string }[], freeway: Set<string>): OffRamp[] {
  const out: OffRamp[] = [];
  const at = new Set(rampSurfaces);
  for (const l of links) if (freeway.has(l.class) && at.has(l.to)) out.push({ b: l.id, from: l.from });
  return out;
}
