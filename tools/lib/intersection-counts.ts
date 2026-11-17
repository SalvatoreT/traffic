// Published intersection turning-movement counts (environmental review documents, agency studies) as count stations of the demand fit:
// the volume entering and leaving on each leg, the turning movements, and a counted ramp leg in place of the ramp's ADT x K. No I/O, no street names.
import type { DetectorEnd } from './demand-fit';
import type { Feature } from './assign';

export interface IxLeg { /** Exact name of the leg's links; omitted for a ramp. */ street?: string; /** Freeway ramp: the leg's links are of the freeway class. */ ramp?: boolean; /** Compass bearing from the intersection toward the leg, degrees. */ bearing: number }
export type IxTurns = { L?: number; T?: number; R?: number; U?: number };
export interface IxCount {
  id: string; label: string; source: string; date: string; lat: number; lon: number;
  legs: Partial<Record<'N' | 'E' | 'S' | 'W', IxLeg>>;
  /** Peak-hour volumes by approach (SB arrives on the N leg, WB on the E leg, NB on the S leg, EB on the W leg), per count period (`am`, `pm`). */
  volumes: Record<string, Partial<Record<'SB' | 'WB' | 'NB' | 'EB', IxTurns>>>;
  note?: string;
}
export interface IxFile { sources: Record<string, { citation: string; document: string; url: string; counts: string }>; intersections: IxCount[] }
export interface IxConfig {
  file: string; periods: Record<string, string>; weight: number; rampWeight: number; movementWeight: number; minMovementVeh: number; tolerancePct: number;
  nodeMaxM: number; bearingTolDeg: number; middayFromPm?: boolean; middayWeightFactor?: number; freewayClass: string;
}
export interface IxNet { nodes: { id: number; x: number; y: number }[]; links: { id: number; from: number; to: number; name: string; class: string; length?: number; geometry?: [number, number][]; fromBearing?: number; toBearing?: number }[]; turnBans?: { from: number; to: number; periods?: string[] }[] }
/** `in` and `out` hold the leg's links including slip links; `inBase` and `outBase` the links of the leg's own street, and `inSlip` and `outSlip` the slip links added. */
export interface IxLegLinks { in: number[]; out: number[]; inBase: number[]; outBase: number[]; inSlip: number[]; outSlip: number[] }
export interface IxStation {
  id: string; label: string; basis: string; corridor: string; links: number[]; feature?: Feature; target: Record<string, number>; weight: number; weightByPeriod?: Record<string, number>; tolPct: number;
  /** Set on a leg that is a ramp: the links whose ADT-based station this count replaces. */
  rampLinks?: number[];
  detectors?: DetectorEnd[];
  /** Periods whose target is the PM count times a factor, not a count (midday, ASSUMPTION): left out of the station rule. */
  derived?: string[];
  /** Source id and the year of the count date. */
  source: string; year: number | null;
}
export interface IxReport { intersections: number; legs: number; movements: number; ramps: number; notes: string[] }

const APPROACH: Record<string, { leg: 'N' | 'E' | 'S' | 'W'; L: 'N' | 'E' | 'S' | 'W'; T: 'N' | 'E' | 'S' | 'W'; R: 'N' | 'E' | 'S' | 'W' }> = {
  SB: { leg: 'N', L: 'E', T: 'S', R: 'W' }, WB: { leg: 'E', L: 'S', T: 'W', R: 'N' }, NB: { leg: 'S', L: 'W', T: 'N', R: 'E' }, EB: { leg: 'W', L: 'N', T: 'E', R: 'S' },
};
const angDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

/** The links that carry a leg toward (`in`) and away from (`out`) the counted intersection: of the leg's street (or ramps), ending or starting within `maxM` of the point, heading along the leg; the nearest end wins. */
export function mapLeg(leg: IxLeg, p: [number, number], net: IxNet, nodes: Map<number, { x: number; y: number }>, cfg: Pick<IxConfig, 'nodeMaxM' | 'bearingTolDeg' | 'freewayClass'>): IxLegLinks {
  const ok = (l: IxNet['links'][number]) => (leg.ramp ? l.class === cfg.freewayClass : l.class !== cfg.freewayClass && l.name === leg.street);
  const pick = (end: 'to' | 'from') => {
    let best: number[] = [], bd = Infinity, at = -1;
    for (const l of net.links) {
      if (!ok(l)) continue;
      const n = nodes.get(l[end])!, d = Math.hypot(n.x - p[0], n.y - p[1]);
      if (d > cfg.nodeMaxM) continue;
      const brg = end === 'to' ? ((l.toBearing ?? 0) + 180) % 360 : l.fromBearing ?? 0;
      if (angDiff(brg, leg.bearing) > cfg.bearingTolDeg) continue;
      if (l[end] === at) best.push(l.id); else if (d < bd) { bd = d; at = l[end]; best = [l.id]; }
    }
    return best;
  };
  const inBase = pick('to'), outBase = pick('from');
  // Slip links: an unnamed one-way link that leaves the leg's street where its approach link starts (inbound) or joins it where its exit link ends (outbound),
  // with its other end within `nodeMaxM` of the intersection. Its vehicles are counted on the leg but never touch the leg's link at the intersection.
  const oneWay = (l: IxNet['links'][number]) => !net.links.some((o) => o.from === l.to && o.to === l.from);
  const slip = (base: number[], end: 'from' | 'to') => {
    if (leg.ramp || !base.length) return [] as number[];
    const at = new Set(base.map((id) => net.links.find((l) => l.id === id)![end]));
    const other = end === 'from' ? 'to' : 'from';
    return net.links.filter((l) => !base.includes(l.id) && !l.name && l.class !== cfg.freewayClass && at.has(l[end]) && oneWay(l) && (() => { const n = nodes.get(l[other])!; return Math.hypot(n.x - p[0], n.y - p[1]) <= cfg.nodeMaxM; })()).map((l) => l.id);
  };
  const inSlip = slip(inBase, 'from'), outSlip = slip(outBase, 'to');
  return { in: [...inBase, ...inSlip], out: [...outBase, ...outSlip], inBase, outBase, inSlip, outSlip };
}

/** A split-junction count requires one directed path between the two observed legs, wholly within the mapped intersection. */
function junctionMovement(net: IxNet, nodes: Map<number, { x: number; y: number }>, first: IxNet['links'][number], last: IxNet['links'][number], legs: Set<number>, point: [number, number], radius: number, period: string): Feature | null {
  // Adjacent stop and start lines identify the observed turn directly. If the model bans it, its zero flow is a meaningful residual.
  if (first.to === last.from) return { kind: 'move', a: first.id, b: last.id };
  const bans = (net.turnBans ?? []).filter((b) => !b.periods?.length || b.periods.includes(period));
  const legal = (from: number, to: number) => !bans.some((b) => b.from === from && b.to === to);

  const outgoing = new Map<number, IxNet['links']>();
  const inside = (x: number, y: number) => Math.hypot(x - point[0], y - point[1]) <= radius;
  for (const link of net.links) {
    if (legs.has(link.id)) continue;
    const a = nodes.get(link.from)!, b = nodes.get(link.to)!;
    if (!inside(a.x, a.y) || !inside(b.x, b.y) || link.geometry?.some(([x, y]) => !inside(x, y))) continue;
    if (!outgoing.has(link.from)) outgoing.set(link.from, []);
    outgoing.get(link.from)!.push(link);
  }
  const paths: number[][] = [];
  const visited = new Set([first.to]);
  function visit(node: number, path: number[], length: number) {
    if (paths.length > 1) return;
    const previous = path[path.length - 1];
    if (node === last.from) {
      if (legal(previous, last.id)) paths.push([...path, last.id]);
      return;
    }
    for (const link of outgoing.get(node) ?? []) {
      if (visited.has(link.to) || !legal(previous, link.id)) continue;
      const a = nodes.get(node)!, b = nodes.get(link.to)!;
      const distance = length + (link.length ?? Math.hypot(a.x - b.x, a.y - b.y));
      // ASSUMPTION: at most one footprint diameter of interior travel can confidently be attributed to this counted turn.
      if (distance > 2 * radius) continue;
      visited.add(link.to);
      visit(link.to, [...path, link.id], distance);
      visited.delete(link.to);
    }
  }
  visit(first.to, [first.id], 0);
  return paths.length === 1 ? { kind: 'path', first: first.id, last: last.id, links: paths[0], junction: true } : null;
}

/** Count stations of every counted intersection. Periods without a count get no target; midday may take the PM count times `middayFactor` at reduced weight (ASSUMPTION). */
export function intersectionStations(file: IxFile, net: IxNet, cfg: IxConfig, toXY: (lat: number, lon: number) => [number, number], middayFactor: number | null): { stations: IxStation[]; report: IxReport } {
  const nodes = new Map(net.nodes.map((n) => [n.id, n]));
  const linkOf = new Map(net.links.map((l) => [l.id, l]));
  const stations: IxStation[] = [];
  const rep: IxReport = { intersections: 0, legs: 0, movements: 0, ramps: 0, notes: [] };
  const mid = cfg.middayFromPm && middayFactor !== null ? cfg.periods.midday : undefined;
  for (const c of file.intersections) {
    const p = toXY(c.lat, c.lon);
    const legs = Object.fromEntries(Object.entries(c.legs).map(([k, leg]) => [k, mapLeg(leg!, p, net, nodes, cfg)])) as Record<string, IxLegLinks>;
    const src = file.sources[c.source];
    const corridor = `intersection count ${c.id}`;
    const year = /^(\d{4})-/.test(c.date) ? Number(c.date.slice(0, 4)) : null;
    const enter: Record<string, Record<string, number>> = {}, leave: Record<string, Record<string, number>> = {};
    const moves = new Map<string, { a: number; b: number; from: string; to: string; t: Record<string, number> }>();
    for (const [cp, byApproach] of Object.entries(c.volumes)) {
      const period = cfg.periods[cp];
      if (!period) continue;
      for (const [ap, turns] of Object.entries(byApproach)) {
        const A = APPROACH[ap];
        for (const k of ['L', 'T', 'R', 'U'] as const) {
          const v = turns![k] ?? 0;
          if (!v) continue;
          const toLeg = k === 'U' ? A.leg : A[k];
          ((enter[A.leg] ??= {})[period] ??= 0); enter[A.leg][period] += v;
          ((leave[toLeg] ??= {})[period] ??= 0); leave[toLeg][period] += v;
          if (k === 'T' || k === 'U' || v < cfg.minMovementVeh) continue;
          const a = legs[A.leg]?.inBase, b = legs[toLeg]?.outBase;
          if (a?.length !== 1 || b?.length !== 1) continue;
          if (legs[A.leg].inSlip.some((l) => legs[toLeg].outSlip.includes(l))) { rep.notes.push(`intersection count ${c.id}: the ${ap} approach to the ${toLeg} leg (${v} veh/h) can use a slip link, so no movement constraint is made for it; the leg stations carry it`); continue; }
          const key = `${a[0]}>${b[0]}`;
          (moves.get(key) ?? moves.set(key, { a: a[0], b: b[0], from: ap, to: toLeg, t: {} }).get(key)!).t[period] = v;
        }
      }
    }
    const withMid = (t: Record<string, number>) => (mid && t[cfg.periods.pm] ? { ...t, [mid]: t[cfg.periods.pm] * middayFactor! } : t);
    const wMid = (w: number) => (mid ? { [mid]: w * (cfg.middayWeightFactor ?? 1) } : undefined);
    const basis = `DATA (${src?.citation ?? c.source}, ${c.label}, counted ${c.date})`;
    let used = false;
    for (const [k, leg] of Object.entries(c.legs)) {
      const m = legs[k];
      for (const [dir, ls, vol] of [['entering', m.in, enter[k]], ['leaving', m.out, leave[k]]] as const) {
        if (!vol) continue;
        if (!ls.length) { rep.notes.push(`intersection count ${c.id}: no ${dir} link for the ${k} leg (${leg!.ramp ? 'ramp' : leg!.street}) within ${cfg.nodeMaxM} m; its ${dir} volume is not used`); continue; }
        const ramp = !!leg!.ramp;
        // Slip lanes cross the counted leg at the opposite end from its main links.
        const detectors: DetectorEnd[] = dir === 'entering' ? ls.map((l) => m.inSlip.includes(l) ? 'start' : 'stop') : ls.map((l) => m.outSlip.includes(l) ? 'stop' : 'start');
        stations.push({
          id: `ix ${c.id} ${k} ${dir}`, label: `${c.label}, ${ramp ? 'ramp' : leg!.street} (${k} leg) ${dir}`, basis, corridor, links: ls, detectors, target: withMid(vol), derived: mid && vol[cfg.periods.pm] ? [mid] : undefined,
          weight: ramp ? cfg.rampWeight : cfg.weight, weightByPeriod: wMid(ramp ? cfg.rampWeight : cfg.weight), tolPct: cfg.tolerancePct, rampLinks: ramp ? ls : undefined, source: c.source, year,
        });
        rep.legs++; if (ramp) rep.ramps++;
        used = true;
      }
    }
    const boundaryLinks = new Set(Object.values(legs).flatMap((leg) => [...leg.in, ...leg.out]));
    for (const [key, e] of moves) {
      const target: Record<string, number> = {};
      const routes = new Map<string, Feature>();
      for (const [period, count] of Object.entries(withMid(e.t))) {
        const path = junctionMovement(net, nodes, linkOf.get(e.a)!, linkOf.get(e.b)!, boundaryLinks, p, cfg.nodeMaxM, period);
        if (!path) {
          rep.notes.push(`intersection count ${c.id}: no unique legal movement ${key} within the intersection footprint in ${period}. The leg stations retain its volume.`);
          continue;
        }
        routes.set(JSON.stringify(path), path);
        target[period] = count;
      }
      if (routes.size !== 1) {
        if (routes.size > 1) rep.notes.push(`intersection count ${c.id}: the interior path of movement ${key} differs by period. Only the leg stations are used.`);
        continue;
      }
      const [feature] = routes.values();
      stations.push({
        id: `ix ${c.id} move ${key}`, label: `${c.label}, ${e.from} approach to the ${e.to} leg`, basis, corridor, links: [],
        feature, target, derived: mid && target[mid] ? [mid] : undefined, weight: cfg.movementWeight, weightByPeriod: wMid(cfg.movementWeight), tolPct: cfg.tolerancePct * 1.5, source: c.source, year,
      });
      rep.movements++;
    }
    if (used) rep.intersections++;
  }
  return { stations, report: rep };
}
