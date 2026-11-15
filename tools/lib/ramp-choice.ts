// Ramp choice made upstream (calibration round 25, ASSUMPTION). No I/O, no street names.
// The simulator picks the off-ramp of a trip from the mainline gate by its own costs, and two ramps whose paths to a destination differ by seconds split such trips on noise and queue
// length. The count fit already decided how each flow divides over the ramps (its static assignment meets the ramp counts and the counts downstream of each ramp terminal), so the builder
// splits every off-ramp flow by those shares and writes the ramp movement as the flow's `via`. The simulator keeps the movement while it costs at most `maxDetour` times the plain route
// and falls back on the flow's other ramps, then on the plain route (see via-detour-fallback). A flow from a mainline gate that already makes an assumed movement makes the ramp first and the
// movement second (`via.then`); the simulator honors each in order with its own tolerance and fallback.
import type { Assignment } from './assign';

/** An off-ramp: `b` is its last freeway-class link (it ends at the surface node), `from` the node it leaves. */
export interface OffRamp { b: number; from: number }
export interface RampChoiceCfg { enabled: boolean; /** The simulator keeps the ramp while its route costs at most this multiple of the plain route (ASSUMPTION). */ maxDetour: number; /** A ramp that carries less than this share of a flow's trips is ignored and its trips go to the others (ASSUMPTION). */ minShare: number }
/** A movement a flow makes, and the movement it makes after it (two-stage via: the ramp, then the assumed turn). */
export interface RampVia { a: number; b: number; maxDetour?: number; alternatives?: { a: number; b: number }[]; then?: RampVia }
export interface RampFlow { origin: number; destination: number; vehPerHour: number; mode?: string; via?: RampVia }

export interface RampSplit<T> { flows: T[]; /** Flows divided over two ramps or more. */ divided: number; /** Flows that got a ramp movement (divided or not). */ forced: number; /** Volume (veh/h) per ramp link. */ byRamp: Map<number, number> }

/**
 * Splits each flow `k` for which `isOffRamp(k)` holds over the off-ramps its final assignment uses. `volume[k]` is the fitted volume; `linkFrom[l]` and `linkTo[l]` the end nodes of link `l`.
 * A flow whose assignment uses no ramp is returned as it is. A flow that already has a `via` (an assumed movement) gets the ramp as its first movement and keeps its own as the one after it.
 */
export function splitByRamp<T extends RampFlow>(flows: T[], volume: number[], a: Assignment, isOffRamp: (k: number) => boolean, ramps: OffRamp[], linkFrom: ArrayLike<number>, linkTo: ArrayLike<number>, cfg: RampChoiceCfg): RampSplit<T> {
  const rampOf = new Map(ramps.map((r) => [r.b, r]));
  const out: T[] = [];
  const byRamp = new Map<number, number>();
  let divided = 0, forced = 0;
  flows.forEach((f, k) => {
    const v = volume[k];
    if (!isOffRamp(k) || !a.routable[k]) { out.push({ ...f, vehPerHour: v }); return; }
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
    // A ramp whose feeder chain, upstream on the same path, passes through another ramp's last link is a continuation of that ramp (a freeway-class link that passes a surface node), not a second exit.
    const feederOf = (l: number): number | null => { for (const m of onPath) if (m !== l && linkTo[m] === linkFrom[l]) return m; return null; };
    const continuation = (b: number): boolean => {
      const seen = new Set<number>([b]);
      for (let l = feederOf(b); l !== null && !seen.has(l); l = feederOf(l)) { if (rampOf.has(l)) return true; seen.add(l); }
      return false;
    };
    const kept = [...use].filter(([b, u]) => u.share >= cfg.minShare && !continuation(b));
    const sum = kept.reduce((s, [, u]) => s + u.share, 0);
    if (!kept.length || sum <= 0) { out.push({ ...f, vehPerHour: v }); return; }
    forced++;
    if (kept.length > 1) divided++;
    for (const [b, u] of kept) {
      const part = (v * u.share) / sum;
      const alternatives = kept.filter(([b2]) => b2 !== b).map(([b2, u2]) => ({ a: u2.feeder!, b: b2 }));
      out.push({ ...f, vehPerHour: part, via: { a: u.feeder!, b, maxDetour: cfg.maxDetour, ...(alternatives.length ? { alternatives } : {}), ...(f.via ? { then: f.via } : {}) } });
      byRamp.set(b, (byRamp.get(b) ?? 0) + part);
    }
  });
  return { flows: out, divided, forced, byRamp };
}

/**
 * The off-ramps of a network: the freeway-class link that ends at the surface node of each off-ramp, with the node it leaves. A freeway-class link that starts at a surface node is
 * the continuation of another ramp (the ramp passes a surface node and goes on), not an exit from the mainline, so it is not an off-ramp.
 */
export function offRampLinks(rampSurfaces: number[], links: { id: number; from: number; to: number; class: string }[], freeway: Set<string>): OffRamp[] {
  const out: OffRamp[] = [];
  const at = new Set(rampSurfaces);
  const surface = new Set<number>();
  for (const l of links) if (!freeway.has(l.class)) { surface.add(l.from); surface.add(l.to); }
  for (const l of links) if (freeway.has(l.class) && at.has(l.to) && !surface.has(l.from)) out.push({ b: l.id, from: l.from });
  return out;
}
