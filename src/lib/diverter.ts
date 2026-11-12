import type { Network } from '../types';
import type { NetIndex } from './naming';
import { linkStreet } from './naming';

/**
 * Diagonal diverter geometry. A barrier line through an intersection leaves two legs on each side; motor vehicles may only turn
 * between the two legs of a side. These helpers mirror the simulation's leg classification (`crates/sim/src/diverter.rs`):
 * a leg's direction is measured from the node along the first stretch of its link, so staggered legs classify by how they leave.
 */

/** Distance along a link used to measure how a leg leaves the node (m). Same value as the simulation. */
const PROBE_M = 15;
/** A leg this close to the barrier line has no clear side (degrees). Same value as the simulation. */
const ON_LINE_DEG = 2;

export interface Leg {
  /** Links entering and leaving the node on this street approach (a two-way street is one leg). */
  ins: number[]; outs: number[];
  street: string;
  /** Degrees clockwise from north, in [0, 360). */
  bearing: number;
}

export interface DiverterOption {
  /** Barrier line, whole degrees clockwise from north in [0, 180). */
  bearing: number;
  /** Text for the two pairs that stay connected. */
  label: string;
  /** Which legs share a side, as a stable key (to tell the two options apart). */
  key: string;
}

const norm360 = (d: number) => ((d % 360) + 360) % 360;
const bearingOf = (dx: number, dy: number) => norm360((Math.atan2(dx, dy) * 180) / Math.PI);

function pointAt(g: [number, number][], dist: number): [number, number] {
  let left = dist;
  for (let i = 0; i + 1 < g.length; i++) {
    const d = Math.hypot(g[i + 1][0] - g[i][0], g[i + 1][1] - g[i][1]);
    if (d >= left && d > 1e-9) {
      const u = left / d;
      return [g[i][0] + (g[i + 1][0] - g[i][0]) * u, g[i][1] + (g[i + 1][1] - g[i][1]) * u];
    }
    left -= d;
  }
  return g[g.length - 1];
}

function linkBearing(net: Network, node: number, link: number, outgoing: boolean): number {
  const l = net.links[link];
  let g: [number, number][] = l.geometry.length >= 2 ? l.geometry : [[net.nodes[l.from].x, net.nodes[l.from].y], [net.nodes[l.to].x, net.nodes[l.to].y]];
  if (!outgoing) g = [...g].reverse();
  const n = net.nodes[node];
  let probe = PROBE_M;
  for (;;) {
    const p = pointAt(g, probe);
    const dx = p[0] - n.x, dy = p[1] - n.y;
    if (Math.hypot(dx, dy) >= 3 || probe >= 4 * PROBE_M) return bearingOf(dx, dy);
    probe *= 2;
  }
}

/** The street approaches of a node, merging the two directions of a two-way street. A one-way street counts once. */
export function nodeLegs(net: Network, idx: Pick<NetIndex, 'incomingLinks' | 'outgoingLinks'>, node: number): Leg[] {
  const ins = idx.incomingLinks[node], outs = idx.outgoingLinks[node];
  const legs: Leg[] = [];
  const used = new Set<number>();
  for (const a of ins) {
    const rev = net.links[a].reverse;
    let pair = rev !== null && outs.includes(rev) ? rev : undefined;
    if (pair === undefined) pair = outs.find((o) => !used.has(o) && net.links[o].to === net.links[a].from);
    if (pair !== undefined) used.add(pair);
    legs.push({
      ins: [a], outs: pair === undefined ? [] : [pair], street: linkStreet(net.links[pair ?? a]),
      bearing: linkBearing(net, node, pair ?? a, pair !== undefined),
    });
  }
  for (const o of outs) {
    if (!used.has(o)) legs.push({ ins: [], outs: [o], street: linkStreet(net.links[o]), bearing: linkBearing(net, node, o, true) });
  }
  return legs;
}

/** Side of the barrier a leg lies on: true, false, or null when it lies on the line. */
function sideOf(leg: number, barrier: number): boolean | null {
  const s = Math.sin(((leg - barrier) * Math.PI) / 180);
  return Math.abs(s) < Math.sin((ON_LINE_DEG * Math.PI) / 180) ? null : s > 0;
}

/** Leg indexes grouped into the two sides, or null when the barrier does not leave two legs on each side. */
export function sidesOf(legs: Leg[], barrier: number): [number[], number[]] | null {
  if (legs.length !== 4) return null;
  const a: number[] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const s = sideOf(legs[i].bearing, barrier);
    if (s === null) return null;
    (s ? a : b).push(i);
  }
  return a.length === 2 ? [a, b] : null;
}

const CARD4 = ['north', 'east', 'south', 'west'];
const CARD8 = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
/** Compass names for the legs: four points, or eight when two legs would share a name. */
function legDirections(legs: Leg[]): string[] {
  const four = legs.map((l) => CARD4[Math.floor(((l.bearing + 45) % 360) / 90)]);
  if (new Set(four).size === legs.length) return four;
  return legs.map((l) => CARD8[Math.floor(((l.bearing + 22.5) % 360) / 45)]);
}

/** "Hillegass Avenue (north) with 62nd Street (west), and Hillegass Avenue (south) with 62nd Street (east)". */
function pairsLabel(legs: Leg[], sides: [number[], number[]]): string {
  const dir = legDirections(legs);
  // The street running nearer north-south leads each pair, so labels read the same way round; ties go to the first name alphabetically.
  const ns = new Map<string, number[]>();
  legs.forEach((l) => ns.set(l.street, [...(ns.get(l.street) ?? []), Math.abs(Math.sin((l.bearing * Math.PI) / 180))]));
  const score = (s: string) => ns.get(s)!.reduce((a, b) => a + b, 0) / ns.get(s)!.length;
  const lead = [...ns.keys()].sort((p, q) => score(p) - score(q) || p.localeCompare(q))[0];
  const text = (i: number) => `${legs[i].street} (${dir[i]})`;
  const pairs = sides.map(([x, y]) => {
    const first = legs[y].street === lead && legs[x].street !== lead ? y : x;
    const second = first === x ? y : x;
    return { first, second };
  });
  pairs.sort((p, q) => ((legs[p.first].bearing + 45) % 360) - ((legs[q.first].bearing + 45) % 360));
  return pairs.map((p) => `${text(p.first)} with ${text(p.second)}`).join(', and ');
}

const sideKey = (sides: [number[], number[]]) => sides.map((s) => [...s].sort().join('+')).sort().join('|');

/** What stays connected under a diverter with this barrier line, or null when the node does not have a usable four-leg shape. */
export function connectedLabel(net: Network, idx: NetIndex, node: number, bearing: number): string | null {
  const legs = nodeLegs(net, idx, node);
  const sides = sidesOf(legs, norm360(bearing) % 180);
  return sides ? pairsLabel(legs, sides) : null;
}

/** The two ways to place a diverter at a four-leg intersection, or none at nodes with another leg count. */
export function diverterOptions(net: Network, idx: NetIndex, node: number): DiverterOption[] {
  const legs = nodeLegs(net, idx, node);
  if (legs.length !== 4) return [];
  const order = [0, 1, 2, 3].sort((a, b) => legs[a].bearing - legs[b].bearing);
  const out: DiverterOption[] = [];
  for (let k = 0; k < 2; k++) {
    // Pair the legs (k, k+1) and (k+2, k+3) in circular order; the barrier runs through the two gaps between the pairs.
    const gap = (from: number, to: number) => {
      const a = legs[order[from % 4]].bearing, b = legs[order[to % 4]].bearing;
      const d = norm360(b - a);
      return ((a + d / 2) * Math.PI) / 180;
    };
    const g1 = gap(k + 1, k + 2), g2 = gap(k + 3, k + 4);
    const vx = Math.sin(g1) - Math.sin(g2), vy = Math.cos(g1) - Math.cos(g2);
    if (Math.hypot(vx, vy) < 1e-6) continue;
    const bearing = Math.round(bearingOf(vx, vy) / 5) * 5 % 180;
    const sides = sidesOf(legs, bearing);
    if (!sides) continue;
    out.push({ bearing, label: pairsLabel(legs, sides), key: sideKey(sides) });
  }
  return out.length === 2 && out[0].key !== out[1].key ? out.sort((p, q) => p.bearing - q.bearing) : [];
}

/** Key of the pairing a placed diverter makes, to tell which option it is. */
export function pairingKey(net: Network, idx: NetIndex, node: number, bearing: number): string | null {
  const legs = nodeLegs(net, idx, node);
  const sides = sidesOf(legs, norm360(bearing) % 180);
  return sides ? sideKey(sides) : null;
}

/** Movements `from-to` (link ids) a diverter at `node` forbids for cars; empty when the node does not fit. */
export function bannedMoves(net: Network, idx: Pick<NetIndex, 'incomingLinks' | 'outgoingLinks'>, node: number, bearing: number): Set<string> {
  const legs = nodeLegs(net, idx, node);
  const sides = sidesOf(legs, norm360(bearing) % 180);
  const out = new Set<string>();
  if (!sides) return out;
  const side = (i: number) => sides[0].includes(i);
  legs.forEach((la, i) => legs.forEach((lb, j) => {
    if (i !== j && side(i) === side(j)) return;
    for (const a of la.ins) for (const b of lb.outs) out.add(`${a}-${b}`);
  }));
  // Same-leg U-turns are always out; they are not a movement the mock offers anyway.
  return out;
}

/** Barrier line of a placed diverter in map terms: two points `halfM` either side of the node. */
export function barrierEnds(net: Network, node: number, bearing: number, halfM: number): [[number, number], [number, number]] {
  const n = net.nodes[node];
  const r = (bearing * Math.PI) / 180;
  const dx = Math.sin(r) * halfM, dy = Math.cos(r) * halfM;
  return [[n.x - dx, n.y - dy], [n.x + dx, n.y + dy]];
}
