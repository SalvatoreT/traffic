// Observed route shares (select-link and ramp via-street shares from the targets file) as ratio constraints over assigned flows. No I/O.
// The definitions mirror crates/sim/src/bin/calibrate.rs so the static assignment and the simulator report the same quantity:
//  - select link: (volume on the block from trips with a freeway origin or destination) / (volume on the block);
//  - ramp via-street: (volume that uses the ramp and the named street) / (volume that uses the ramp).
// A node is a freeway end when a motorway-class link touches it. Street names and blocks come from the targets file; nothing here names a street.
import type { Assignment } from './assign';
import type { Constraint } from './fit-counts';

export interface ShareLink { id: number; from: number; to: number; name: string; class: string; length: number; geometry?: [number, number][]; inStudyArea?: boolean }
export interface ShareNode { id: number; x: number; y: number }

export interface Targets {
  selectLink?: { street: string; direction: string; between?: string[]; observedVehPerHour?: Record<string, number>; from?: { via: string; share: number; pmPeakShare?: number }[]; to?: { via: string; share: number; pmPeakShare?: number }[] }[];
  freewayRamp?: { location?: string; side?: string; ontoFreewayFromNorth?: { via: string; share: number }[]; fromFreewayGoingNorth?: { via: string; share: number }[] };
}

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const DIRS = ['N', 'E', 'S', 'W'];
const WANT: Record<string, number> = { NB: 0, EB: 90, SB: 180, WB: 270 };
const angDiff = (a: number, b: number) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

function bearingOf(l: ShareLink, nodes: Map<number, ShareNode>): number {
  const a = l.geometry?.length ? l.geometry[0] : [nodes.get(l.from)!.x, nodes.get(l.from)!.y];
  const b = l.geometry?.length ? l.geometry[l.geometry.length - 1] : [nodes.get(l.to)!.x, nodes.get(l.to)!.y];
  return (((Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI) % 360 + 360) % 360;
}
/** Nearest compass axis of travel on the link (the simulator's StreetVisit direction). */
export const compassOf = (brg: number) => DIRS[Math.floor((brg + 45) / 90) % 4];

/** Links of the named street between two cross streets in the stated direction of travel (the report's `resolve_block`), as indices into `links`. */
export function resolveBlock(links: ShareLink[], nodes: Map<number, ShareNode>, street: string, dir: string, between: string[]): { links: number[]; note: string } {
  const want = WANT[dir] ?? 270;
  const streetLinks = links.map((_, i) => i).filter((i) => same(links[i].name, street) && links[i].class !== 'motorway' && angDiff(bearingOf(links[i], nodes), want) <= 75);
  const fallback = (why: string) => ({ links: streetLinks.filter((i) => links[i].inStudyArea), note: `FALLBACK (${why}): all study-area ${street} ${dir} links` });
  if (between.length !== 2) return fallback('no between pair');
  const incident = new Map<number, number[]>();
  links.forEach((l, i) => { for (const n of [l.from, l.to]) (incident.get(n) ?? incident.set(n, []).get(n)!).push(i); });
  const crossNodes = (x: string) => [...incident].filter(([, ls]) => ls.some((i) => same(links[i].name, x)) && ls.some((i) => same(links[i].name, street))).map(([n]) => n);
  const out = new Map<number, number[]>();
  for (const i of streetLinks) (out.get(links[i].from) ?? out.set(links[i].from, []).get(links[i].from)!).push(i);
  for (const [p, q] of [[0, 1], [1, 0]]) {
    const a = crossNodes(between[p]), b = crossNodes(between[q]);
    if (!a.length || !b.length) continue;
    const dist = new Map<number, number>(), prev = new Map<number, number>();
    for (const s of a) dist.set(s, 0);
    const queue = [...a];
    // Bellman-Ford style relaxation over the street's own directed links (the street graph is small).
    while (queue.length) {
      const n = queue.shift()!;
      for (const i of out.get(n) ?? []) {
        const m = links[i].to, nd = dist.get(n)! + links[i].length;
        if (nd < (dist.get(m) ?? Infinity) - 1e-9) { dist.set(m, nd); prev.set(m, i); queue.push(m); }
      }
    }
    let best: number | null = null;
    for (const n of b) if (dist.has(n) && !a.includes(n) && (best === null || dist.get(n)! < dist.get(best)!)) best = n;
    if (best !== null) {
      const path: number[] = [];
      let n = best;
      while (prev.has(n)) { const i = prev.get(n)!; path.push(i); n = links[i].from; if (a.includes(n)) break; }
      return { links: path.reverse(), note: `path ${between[p]} -> ${between[q]} (${dist.get(best)!.toFixed(0)} m)` };
    }
  }
  return fallback('no path between the cross streets');
}

/** "Telegraph Avenue north of Alcatraz Avenue" -> "Telegraph Avenue"; a trailing NB / SB / EB / WB gives the direction. */
export function parseVia(s: string): { freeway: boolean; name: string; dir?: string } {
  if (same(s, 'freeway')) return { freeway: true, name: '' };
  let base = s;
  const low = s.toLowerCase();
  for (const q of [' north of ', ' south of ', ' east of ', ' west of ']) { const i = low.indexOf(q); if (i >= 0) { base = s.slice(0, i); break; } }
  for (const [suf, c] of [[' NB', 'N'], [' SB', 'S'], [' EB', 'E'], [' WB', 'W']] as const) if (base.endsWith(suf)) return { freeway: false, name: base.slice(0, -suf.length), dir: c };
  return { freeway: false, name: base };
}

/** "Telegraph Avenue north of Alcatraz Avenue" -> { side: 'N', cross: 'Alcatraz Avenue' }. */
export function viaQualifier(s: string): { side: string; cross: string } | null {
  const low = s.toLowerCase();
  for (const [q, c] of [[' north of ', 'N'], [' south of ', 'S'], [' east of ', 'E'], [' west of ', 'W']] as const) { const i = low.indexOf(q); if (i >= 0) return { side: c, cross: s.slice(i + q.length) }; }
  return null;
}

/** Links of `street` on side `side` of its crossing with `cross` (link midpoint beyond the crossing node along that compass axis). */
export function qualifiedLinks(links: ShareLink[], nodes: Map<number, ShareNode>, street: string, side: string, cross: string): Set<number> {
  const at = new Map<number, number[]>();
  links.forEach((l, i) => { for (const n of [l.from, l.to]) (at.get(n) ?? at.set(n, []).get(n)!).push(i); });
  let px: number | null = null, py = 0;
  for (const [n, ls] of at) if (ls.some((i) => same(links[i].name, street)) && ls.some((i) => same(links[i].name, cross))) { px = nodes.get(n)!.x; py = nodes.get(n)!.y; break; }
  const out = new Set<number>();
  if (px === null) return out;
  links.forEach((l, i) => {
    if (l.class === 'motorway' || !same(l.name, street)) return;
    const a = nodes.get(l.from)!, b = nodes.get(l.to)!, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    if (side === 'N' ? my > py : side === 'S' ? my < py : side === 'E' ? mx > px! : mx < px!) out.add(i);
  });
  return out;
}


export interface RampNode { node: number; on: boolean; links: number[] }
/** Freeway ramp nodes (a motorway link meeting a surface link) at a location named in the targets file: a surface link name that the location text contains. */
export function findRamps(links: ShareLink[], location: string): RampNode[] {
  const loc = location.toLowerCase();
  const incident = new Map<number, number[]>();
  links.forEach((l, i) => { for (const n of [l.from, l.to]) (incident.get(n) ?? incident.set(n, []).get(n)!).push(i); });
  const ramps: RampNode[] = [];
  for (const [n, ls] of incident) {
    const fw = ls.filter((i) => links[i].class === 'motorway');
    if (!fw.length || !ls.some((i) => links[i].class !== 'motorway')) continue;
    if (!ls.some((i) => links[i].name && loc.includes(links[i].name.toLowerCase()))) continue;
    const on = fw.filter((i) => links[i].from === n), off = fw.filter((i) => links[i].to === n);
    if (on.length) ramps.push({ node: n, on: true, links: on });
    if (off.length) ramps.push({ node: n, on: false, links: off });
  }
  return ramps;
}

export interface ShareSpec { id: string; label: string; target: number; weight: number; kind: 'select' | 'ramp'; note: string; ratio: NonNullable<Constraint['ratio']> }

/**
 * Ratio constraints for one period. `weight` applies to every share (they come from a device sample, so it is set below the counts).
 * `period` selects `pmPeakShare` when the target has one and the period is `pmPeriod`.
 */
export function buildShareConstraints(
  nodes: ShareNode[], links: ShareLink[], targets: Targets, a: Assignment, period: string, pmPeriod: string, weight: number,
): ShareSpec[] {
  const nodeBy = new Map(nodes.map((n) => [n.id, n]));
  const nFlows = a.routable.length;
  const fwNode = new Set<number>();
  for (const l of links) if (l.class === 'motorway') { fwNode.add(l.from); fwNode.add(l.to); }
  const sumOver = (set: Set<number>): Float64Array => {
    const d = new Float64Array(nFlows);
    for (let k = 0; k < nFlows; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) if (set.has(a.link[i])) d[k] += a.share[i];
    for (let k = 0; k < nFlows; k++) d[k] = Math.min(d[k], 1);
    return d;
  };
  const out: ShareSpec[] = [];
  const pack = (den: Float64Array, num: Float64Array) => {
    const flows: number[] = [], dd: number[] = [], nn: number[] = [];
    for (let k = 0; k < nFlows; k++) if (den[k] > 0) { flows.push(k); dd.push(den[k]); nn.push(Math.min(num[k], den[k])); }
    return { flows: Int32Array.from(flows), den: Float64Array.from(dd), num: Float64Array.from(nn) };
  };
  for (const t of targets.selectLink ?? []) {
    const blk = resolveBlock(links, nodeBy, t.street, t.direction, t.between ?? []);
    if (!blk.links.length) continue;
    const den = sumOver(new Set(blk.links));
    for (const side of ['from', 'to'] as const) for (const e of t[side] ?? []) {
      if (!parseVia(e.via).freeway) continue;
      const num = new Float64Array(nFlows);
      for (let k = 0; k < nFlows; k++) if (den[k] > 0 && fwNode.has(side === 'from' ? a.origin[k] : a.destination[k])) num[k] = den[k];
      const target = period === pmPeriod && e.pmPeakShare !== undefined ? e.pmPeakShare : e.share;
      out.push({ id: `share ${t.street} ${t.direction} ${side} freeway`, label: `${t.street} ${t.direction}, trips ${side === 'from' ? 'from' : 'to'} the freeway`, target, weight, kind: 'select', note: `block: ${blk.note}`, ratio: pack(den, num) });
    }
  }
  const fr = targets.freewayRamp;
  if (fr) {
    const ramps = findRamps(links, fr.location ?? '');
    const sideKey = fr.side ? fr.side[0].toUpperCase() : null;
    // Per flow, the share of its paths on a ramp of this direction, kept only when the flow's surface end (origin for the on-ramp, destination for the off-ramp)
    // lies on the stated side of that ramp's node.
    const rampDen = (onRamp: boolean): Float64Array => {
      const d = new Float64Array(nFlows);
      for (const r of ramps.filter((q) => q.on === onRamp)) {
        const set = new Set(r.links), dr = sumOver(set), rn = nodeBy.get(r.node)!;
        for (let k = 0; k < nFlows; k++) {
          if (!(dr[k] > 0)) continue;
          if (sideKey) {
            const e = nodeBy.get(onRamp ? a.origin[k] : a.destination[k]);
            if (!e || !(sideKey === 'N' ? e.y > rn.y : sideKey === 'S' ? e.y < rn.y : sideKey === 'E' ? e.x > rn.x : e.x < rn.x)) continue;
          }
          d[k] = Math.min(1, d[k] + dr[k]);
        }
      }
      return d;
    };
    for (const [key, onRamp] of [['ontoFreewayFromNorth', true], ['fromFreewayGoingNorth', false]] as const) {
      if (!ramps.some((r) => r.on === onRamp)) continue;
      const den = rampDen(onRamp);
      for (const e of fr[key] ?? []) {
        const v = parseVia(e.via);
        if (v.freeway) continue;
        const q = viaQualifier(e.via);
        const street = new Set<number>();
        if (q) for (const i of qualifiedLinks(links, nodeBy, v.name, q.side, q.cross)) street.add(i);
        else links.forEach((l, i) => { if (l.class !== 'motorway' && same(l.name, v.name) && (!v.dir || compassOf(bearingOf(l, nodeBy)) === v.dir)) street.add(i); });
        const ds = sumOver(street);
        const num = new Float64Array(nFlows);
        for (let k = 0; k < nFlows; k++) num[k] = Math.min(den[k], ds[k]);
        out.push({ id: `share ramp ${onRamp ? 'onto' : 'from'} via ${e.via}`, label: `${onRamp ? 'Onto' : 'From'} the freeway at the ramps, via ${e.via}`, target: e.share, weight, kind: 'ramp', note: `${ramps.filter((r) => r.on === onRamp).length} ramp node(s) at "${fr.location}"${sideKey ? `, trips ${onRamp ? 'from' : 'to'} the ${fr.side}` : ''}; street used anywhere on the path (joint use taken as the smaller of the two path shares)`, ratio: pack(den, num) });
      }
    }
  }
  return out;
}

// ---------- volumes implied by the shares and the ramp counts (DERIVED) ----------
export interface ImpliedVolume {
  id: string; label: string; street: string; direction: string; ramp: 'onto' | 'from'; link: number;
  /** Ramp volume (veh/h, sum of the counted ramps in that direction at the location), listed share of the ramp trips, share of the street's traffic that is freeway-related. */
  rampVolume: number; viaShare: number; freewayShare: number;
  /** Fraction of the ramp trips whose surface end is on the stated side, from the offered table (reading B of the ramp share's denominator). */
  sideFraction: number;
  /** Street volume implied: reading A (the share is of all ramp trips) and reading B (the share is of the trips from the stated side). */
  volumeA: number; volumeB: number; target: number;
  arithmetic: string;
}

/**
 * Peak-hour volume on a select-link block implied by two published numbers: freeway-related volume = ramp volume x via-street share, and total
 * volume = freeway-related volume / freeway share of the street's traffic. The ramp via shares are shares of ramp trips from (to) the stated side, or of
 * all ramp trips: the file does not say, so both readings are computed and the target is their midpoint. The freeway-related volume counts only trips through the
 * named ramps, so the implied total is a lower bound if other ramps feed the street.
 * `rampTargets` lists the counted ramps (links of the ramp station and its target in this period). DERIVED, not DATA: its weight is set below the counts.
 */
export function impliedVolumes(
  nodes: ShareNode[], links: ShareLink[], targets: Targets, a: Assignment, volume: ArrayLike<number>, period: string, pmPeriod: string,
  rampTargets: { links: number[]; target: number }[],
): ImpliedVolume[] {
  const fr = targets.freewayRamp;
  if (!fr) return [];
  const nodeBy = new Map(nodes.map((n) => [n.id, n]));
  const nFlows = a.routable.length;
  const ramps = findRamps(links, fr.location ?? '');
  const sumOver = (set: Set<number>): Float64Array => {
    const d = new Float64Array(nFlows);
    for (let k = 0; k < nFlows; k++) { for (let i = a.start[k]; i < a.start[k + 1]; i++) if (set.has(a.link[i])) d[k] += a.share[i]; d[k] = Math.min(d[k], 1); }
    return d;
  };
  const sideKey = fr.side ? fr.side[0].toUpperCase() : null;
  const out: ImpliedVolume[] = [];
  for (const [key, onRamp] of [['ontoFreewayFromNorth', true], ['fromFreewayGoingNorth', false]] as const) {
    const rs = ramps.filter((r) => r.on === onRamp);
    if (!rs.length) continue;
    const rampLinks = new Set(rs.flatMap((r) => r.links));
    const rv = rampTargets.filter((q) => q.links.some((l) => rampLinks.has(l))).reduce((x, q) => x + q.target, 0);
    if (!(rv > 0)) continue;
    // Trips on the ramps, all and from the stated side (volume-weighted over the offered table).
    let all = 0, side = 0;
    for (const r of rs) {
      const dr = sumOver(new Set(r.links)), rn = nodeBy.get(r.node)!;
      for (let k = 0; k < nFlows; k++) {
        if (!(dr[k] > 0)) continue;
        const w = volume[k] * dr[k];
        all += w;
        const e = nodeBy.get(onRamp ? a.origin[k] : a.destination[k]);
        if (!sideKey || (e && (sideKey === 'N' ? e.y > rn.y : sideKey === 'S' ? e.y < rn.y : sideKey === 'E' ? e.x > rn.x : e.x < rn.x))) side += w;
      }
    }
    const f = all > 0 ? side / all : 1;
    for (const e of fr[key] ?? []) {
      const v = parseVia(e.via);
      if (v.freeway || viaQualifier(e.via)) continue;
      for (const t of targets.selectLink ?? []) {
        if (!same(t.street.replace(/\s+(avenue|street)$/i, ''), v.name.replace(/\s+(avenue|street)$/i, '')) && !same(t.street, v.name)) continue;
        const entries = (onRamp ? t.to : t.from) ?? [];
        const fw = entries.find((q) => parseVia(q.via).freeway);
        if (!fw) continue;
        const blk = resolveBlock(links, nodeBy, t.street, t.direction, t.between ?? []);
        if (!blk.links.length) continue;
        const fwShare = period === pmPeriod && fw.pmPeakShare !== undefined ? fw.pmPeakShare : fw.share;
        const mid = blk.links.reduce((b, l) => (links[l].length > links[b].length ? l : b), blk.links[0]);
        const volumeA = (rv * e.share) / fwShare, volumeB = (rv * f * e.share) / fwShare;
        out.push({
          id: `implied ${t.street} ${t.direction}`, label: `${t.street} ${t.direction}, implied volume`, street: t.street, direction: t.direction, ramp: onRamp ? 'onto' : 'from', link: mid,
          rampVolume: rv, viaShare: e.share, freewayShare: fwShare, sideFraction: f, volumeA, volumeB, target: (volumeA + volumeB) / 2,
          arithmetic: `${rv.toFixed(0)} veh/h ${onRamp ? 'on' : 'off'}-ramps x ${(e.share * 100).toFixed(0)}% via ${v.name}${f < 1 ? ` (x ${(f * 100).toFixed(0)}% from the ${fr.side ?? ''} side, reading B)` : ''} = ${(rv * e.share * f).toFixed(0)} to ${(rv * e.share).toFixed(0)} freeway-related; / ${(fwShare * 100).toFixed(0)}% freeway share = ${volumeB.toFixed(0)} to ${volumeA.toFixed(0)} veh/h`,
        });
      }
    }
  }
  return out;
}
