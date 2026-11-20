// Observed route shares (select-link and ramp via-street shares from the targets file) as ratio constraints over assigned flows. No I/O.
// The definitions mirror crates/sim/src/bin/calibrate.rs so the static assignment and the simulator report the same quantity:
//  - select link: (volume on the block from trips with a freeway origin or destination) / (volume on the block);
//  - ramp via-street: (volume that uses the ramp and the named street) / (volume that uses the ramp).
// A node is a freeway end when a motorway-class link touches it. Street names and blocks come from the targets file; nothing here names a street.
import type { OdFlow } from './assign';
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

type Ratio = NonNullable<Constraint['ratio']>;
/** `simulated`: the ratio takes its membership from simulated block trips (round 51); `staticRatio` is the same share on the static routes, kept for the report. */
export interface ShareSpec { id: string; label: string; target: number; weight: number; kind: 'select' | 'ramp'; note: string; ratio: Ratio; simulated?: boolean; staticRatio?: Ratio; block?: string }

/** Simulated denominator membership of a select-link block: per flow, the share of its trips on the block, from the static fraction `stat` as a prior; undefined keeps static routes. */
export type BlockMembership = (block: string, stat: Float64Array) => Float64Array | undefined;

/** Tally route events before sampled paths are reduced to per-link marginal shares. */
export function routeShareTally(
  nodes: ShareNode[], links: ShareLink[], targets: Targets, flows: OdFlow[], period: string, pmPeriod: string, weight: number,
) {
  const nodeBy = new Map(nodes.map((n) => [n.id, n]));
  const freeway = new Set<number>();
  for (const l of links) if (l.class === 'motorway') { freeway.add(l.from); freeway.add(l.to); }
  const samples = new Uint32Array(flows.length);
  const groupsByLink = links.map((): number[] => []);
  let groupCount = 0;
  const group = (members: Iterable<number>) => {
    const id = groupCount++;
    for (const l of members) groupsByLink[l].push(id);
    return id;
  };
  type Hit = (k: number, visited: Set<number>) => boolean;
  const totals: { matches: Hit; counts: Uint32Array }[] = [];
  const total = (matches: Hit) => {
    const counts = new Uint32Array(flows.length);
    totals.push({ matches, counts });
    return counts;
  };
  const rules: { spec: Omit<ShareSpec, 'ratio'>; denominator: Uint32Array; numerator: Uint32Array; block?: string; end?: Uint8Array }[] = [];
  for (const t of targets.selectLink ?? []) {
    const block = resolveBlock(links, nodeBy, t.street, t.direction, t.between ?? []);
    if (!block.links.length) continue;
    const blockId = group(block.links);
    const den = total((_, visited) => visited.has(blockId));
    for (const side of ['from', 'to'] as const) for (const e of t[side] ?? []) {
      if (!parseVia(e.via).freeway) continue;
      const num = total((k, visited) => visited.has(blockId) && freeway.has(side === 'from' ? flows[k].origin : flows[k].destination));
      rules.push({ denominator: den, numerator: num, block: `${t.street} ${t.direction}`, end: Uint8Array.from(flows, (f) => (freeway.has(side === 'from' ? f.origin : f.destination) ? 1 : 0)), spec: {
        id: `share ${t.street} ${t.direction} ${side} freeway`, label: `${t.street} ${t.direction}, trips ${side} the freeway`,
        target: period === pmPeriod && e.pmPeakShare !== undefined ? e.pmPeakShare : e.share, weight, kind: 'select', note: `block: ${block.note}`,
      } });
    }
  }
  const fr = targets.freewayRamp;
  const rampTotals = new Map<boolean, { all: Uint32Array; eligible: Uint32Array }>();
  if (fr) {
    const ramps = findRamps(links, fr.location ?? '');
    const side = fr.side?.[0]?.toUpperCase();
    for (const [key, on] of [['ontoFreewayFromNorth', true], ['fromFreewayGoingNorth', false]] as const) {
      const directed = ramps.filter((r) => r.on === on).map((r) => ({ id: group(r.links), node: nodeBy.get(r.node)! }));
      if (!directed.length) continue;
      const eligible = flows.map((f) => {
        const end = nodeBy.get(on ? f.origin : f.destination);
        return directed.filter(({ node }) => !side || (end && (side === 'N' ? end.y > node.y : side === 'S' ? end.y < node.y : side === 'E' ? end.x > node.x : end.x < node.x))).map((r) => r.id);
      });
      const onRamp: Hit = (k, visited) => eligible[k].some((id) => visited.has(id));
      const den = total(onRamp);
      rampTotals.set(on, { all: total((_, visited) => directed.some((r) => visited.has(r.id))), eligible: den });
      for (const e of fr[key] ?? []) {
        const via = parseVia(e.via);
        if (via.freeway) continue;
        const q = viaQualifier(e.via);
        const street = q ? qualifiedLinks(links, nodeBy, via.name, q.side, q.cross)
          : links.flatMap((l, i) => l.class !== 'motorway' && same(l.name, via.name) && (!via.dir || compassOf(bearingOf(l, nodeBy)) === via.dir) ? [i] : []);
        const streetId = group(street);
        const num = total((k, visited) => visited.has(streetId) && onRamp(k, visited));
        rules.push({ denominator: den, numerator: num, spec: {
          id: `share ramp ${on ? 'onto' : 'from'} via ${e.via}`, label: `${on ? 'Onto' : 'From'} the freeway at the ramps, via ${e.via}`,
          target: e.share, weight, kind: 'ramp', note: `${directed.length} ramp node(s) at "${fr.location}"${side ? `, trips ${on ? 'from' : 'to'} the ${fr.side}` : ''}; street and ramp visited on the same sampled path`,
        } });
      }
    }
  }
  const visited = new Set<number>();
  return {
    onRoute(k: number, route: number[]) {
      samples[k]++;
      visited.clear();
      for (const link of route) for (const id of groupsByLink[link]) visited.add(id);
      if (visited.size) for (const { matches, counts } of totals) if (matches(k, visited)) counts[k]++;
    },
    /**
     * With `member`, a select-link share whose block has simulated trips takes them as membership (round 51): the denominator is each pair's simulated share of trips on the
     * block (the static fraction as a prior), the numerator is the same where the pair's origin ("from") or destination ("to") is a freeway node and 0 elsewhere, the definition the
     * simulator's report uses. Ramp via-street shares and blocks without a simulated hit keep static routes.
     */
    constraints(member?: BlockMembership): ShareSpec[] {
      const cache = new Map<string, Float64Array | undefined>();
      return rules.map(({ spec, denominator, numerator, block, end }) => {
        const members: number[] = [], den: number[] = [], num: number[] = [];
        for (let k = 0; k < flows.length; k++) if (denominator[k]) {
          members.push(k); den.push(denominator[k] / samples[k]); num.push(numerator[k] / samples[k]);
        }
        const staticRatio: Ratio = { flows: Int32Array.from(members), den: Float64Array.from(den), num: Float64Array.from(num) };
        let sim: Float64Array | undefined;
        if (member && block !== undefined && end) {
          if (!cache.has(block)) cache.set(block, member(block, Float64Array.from(flows, (_, k) => (samples[k] ? denominator[k] / samples[k] : 0))));
          sim = cache.get(block);
        }
        if (!sim) return { ...spec, ratio: staticRatio };
        const sm: number[] = [], sd: number[] = [], sn: number[] = [];
        for (let k = 0; k < flows.length; k++) if (sim[k] > 0) { sm.push(k); sd.push(sim[k]); sn.push(end![k] ? sim[k] : 0); }
        return { ...spec, ratio: { flows: Int32Array.from(sm), den: Float64Array.from(sd), num: Float64Array.from(sn) }, staticRatio, simulated: true, block };
      });
    },
    sideFraction(on: boolean, volume: ArrayLike<number>) {
      const ramp = rampTotals.get(on);
      let all = 0, side = 0;
      if (ramp) for (let k = 0; k < flows.length; k++) if (samples[k]) {
        all += volume[k] * ramp.all[k] / samples[k];
        side += volume[k] * ramp.eligible[k] / samples[k];
      }
      return all > 0 ? side / all : 1;
    },
  };
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
  nodes: ShareNode[], links: ShareLink[], targets: Targets, sideFraction: (on: boolean) => number, period: string, pmPeriod: string,
  rampTargets: { links: number[]; target: number }[],
): ImpliedVolume[] {
  const fr = targets.freewayRamp;
  if (!fr) return [];
  const nodeBy = new Map(nodes.map((n) => [n.id, n]));
  const ramps = findRamps(links, fr.location ?? '');
  const out: ImpliedVolume[] = [];
  for (const [key, onRamp] of [['ontoFreewayFromNorth', true], ['fromFreewayGoingNorth', false]] as const) {
    const rs = ramps.filter((r) => r.on === onRamp);
    if (!rs.length) continue;
    const rampLinks = new Set(rs.flatMap((r) => r.links));
    const rv = rampTargets.filter((q) => q.links.some((l) => rampLinks.has(l))).reduce((x, q) => x + q.target, 0);
    if (!(rv > 0)) continue;
    const f = sideFraction(onRamp);
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
