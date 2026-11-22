// Sorts the through cars of a traced baseline hour by where in the study area they cut through (a corridor), which way they go, and why (the simulator's reason slot).
// Corridors are data in the area config (`cutThroughCorridors`, data/areas/README.md); nothing here names a street. No I/O.
import type { NetLink, NetNode } from '../../src/types';
import { OTHER_CORRIDOR, type CorridorCrossing, type CorridorDef, type CorridorDefs, type CorridorFlow, type CorridorPeriod } from '../../src/lib/corridors';
import { shortStreet } from '../../src/lib/turnmap';
import type { ThroughTrip } from './corridor-trace';

export interface CorridorCfg {
  id: string; name: string;
  /** Street names (as in the network). Every block of a named street belongs to the corridor. */
  streets: string[];
  directionBy: 'compass' | 'ends';
}
export interface CutCorridorsCfg {
  corridors: CorridorCfg[];
  /** Name of the corridor for side streets that no corridor holds and none is near. */
  otherName: string;
  /** A side street no corridor names takes the corridor of the nearest listed street, if one is within this many meters of the block's midpoint (ASSUMPTION: modeling choice for blocks the lists leave out). */
  nearestM: number;
  /** A trip counts as using a second corridor when it drives at least this share of its side-street distance there. */
  secondShare: number;
  /** Bounding streets on each side of the study area, to count trips that cross from one side to the other. */
  sides?: { west: string[]; east: string[] };
  /** Streets that bound the study area (the area config's `boundary`, surface streets only): a trip's ends are named by the last of these it drove before the side streets and the first after. */
  bounding: string[];
}

export interface NetView { nodes: NetNode[]; links: NetLink[] }
export const isLocalLink = (l: NetLink): boolean => l.inStudyArea && (l.class === 'residential' || l.class === 'service');

type XY = [number, number];
const midpoint = (g: XY[]): XY => {
  let total = 0;
  for (let i = 0; i + 1 < g.length; i++) total += Math.hypot(g[i + 1][0] - g[i][0], g[i + 1][1] - g[i][1]);
  let at = total / 2;
  for (let i = 0; i + 1 < g.length; i++) {
    const d = Math.hypot(g[i + 1][0] - g[i][0], g[i + 1][1] - g[i][1]);
    if (at <= d && d > 0) { const f = at / d; return [g[i][0] + f * (g[i + 1][0] - g[i][0]), g[i][1] + f * (g[i + 1][1] - g[i][1])]; }
    at -= d;
  }
  return g[0];
};
const segDist = (p: XY, a: XY, b: XY): number => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
  const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
};
const lineDist = (p: XY, g: XY[]): number => { let m = Infinity; for (let i = 0; i + 1 < g.length; i++) m = Math.min(m, segDist(p, g[i], g[i + 1])); return g.length === 1 ? Math.hypot(p[0] - g[0][0], p[1] - g[0][1]) : m; };

export interface Assignment {
  /** Corridor index per link id (`corridors.length` for the remainder); -1 for links that are not side streets. */
  corridorOf: Int16Array;
  /** The axis each corridor's named streets mostly run along: `ns` (north-south) or `ew`. A flow along the other axis is named as running on cross streets. */
  axis: ('ns' | 'ew')[];
  /** Bounding streets that meet each node, for naming where a trip came in and went out. */
  boundingAt: Map<number, string[]>;
  defs: CorridorDefs;
}

/** Corridor of every side street: the corridor that names its street, else the corridor of the nearest named block within `nearestM`, else the remainder. Throws on a street two corridors name or a corridor naming no street in the network. */
export function assignCorridors(net: NetView, cfg: CutCorridorsCfg): Assignment {
  const ids = new Set<string>();
  const owner = new Map<string, number>();
  cfg.corridors.forEach((c, i) => {
    if (!c.id || c.id === OTHER_CORRIDOR || ids.has(c.id)) throw new Error(`cutThroughCorridors: missing, repeated or reserved id ${c.id}`);
    ids.add(c.id);
    if (c.directionBy !== 'compass' && c.directionBy !== 'ends') throw new Error(`cutThroughCorridors ${c.id}: directionBy must be compass or ends`);
    for (const s of c.streets) {
      if (owner.has(s)) throw new Error(`cutThroughCorridors: ${s} is in both ${cfg.corridors[owner.get(s)!].id} and ${c.id}`);
      owner.set(s, i);
    }
  });
  const local = net.links.filter(isLocalLink);
  for (const [s, i] of owner) if (!local.some((l) => l.name.trim() === s)) throw new Error(`cutThroughCorridors ${cfg.corridors[i].id}: no side street named ${s} in the study area`);
  const corridorOf = new Int16Array(net.links.length).fill(-1);
  const named = local.filter((l) => owner.has(l.name.trim()));
  for (const l of named) corridorOf[l.id] = owner.get(l.name.trim())!;
  for (const l of local) {
    if (corridorOf[l.id] >= 0) continue;
    const m = midpoint(l.geometry as XY[]);
    let best = Infinity, at = cfg.corridors.length;
    for (const n of named) {
      const d = lineDist(m, n.geometry as XY[]);
      if (d < best - 1e-9 || (Math.abs(d - best) <= 1e-9 && corridorOf[n.id] < at)) { best = d; at = corridorOf[n.id]; }
    }
    corridorOf[l.id] = best <= cfg.nearestM ? at : cfg.corridors.length;
  }
  const axis = cfg.corridors.map((_, i) => {
    let ns = 0, ew = 0;
    for (const l of named) if (corridorOf[l.id] === i) { const g = l.geometry as XY[]; for (let k = 0; k + 1 < g.length; k++) { ns += Math.abs(g[k + 1][1] - g[k][1]); ew += Math.abs(g[k + 1][0] - g[k][0]); } }
    return ns >= ew ? 'ns' as const : 'ew' as const;
  });
  const defs: CorridorDefs = {
    corridors: cfg.corridors.map((c, i) => ({ id: c.id, name: c.name, directionBy: c.directionBy, streets: streetsOf(local, corridorOf, i) })),
    otherName: cfg.otherName, secondShare: cfg.secondShare,
    sides: cfg.sides ? { west: cfg.sides.west.map(shortStreet), east: cfg.sides.east.map(shortStreet) } : null,
  };
  const boundingAt = new Map<number, string[]>();
  const bset = new Set(cfg.bounding);
  for (const l of net.links) {
    const n = l.name.trim();
    if (!bset.has(n) || l.class === 'motorway') continue;
    for (const node of [l.from, l.to]) { const v = boundingAt.get(node) ?? []; if (!v.includes(n)) boundingAt.set(node, [...v, n].sort()); }
  }
  return { corridorOf, axis, boundingAt, defs };
}

/** The street names in a corridor, longest first, each marked when only some of its blocks are here. */
function streetsOf(local: NetLink[], corridorOf: Int16Array, index: number): CorridorDef['streets'] {
  const len = new Map<string, number>(), all = new Map<string, number>();
  for (const l of local) {
    const n = l.name.trim() || 'Unnamed service road';
    all.set(n, (all.get(n) ?? 0) + 1);
    if (corridorOf[l.id] === index) len.set(n, (len.get(n) ?? 0) + l.length);
  }
  const count = new Map<string, number>();
  for (const l of local) if (corridorOf[l.id] === index) { const n = l.name.trim() || 'Unnamed service road'; count.set(n, (count.get(n) ?? 0) + 1); }
  return [...len].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name]) => ({ name, part: (count.get(name) ?? 0) < (all.get(name) ?? 0) }));
}

const WORD = ['Northbound', 'Eastbound', 'Southbound', 'Westbound'];
const bearing = (dx: number, dy: number) => ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
const compassWord = (dx: number, dy: number) => WORD[Math.round(bearing(dx, dy) / 90) % 4];

/** How far back or ahead of the side streets a trip's route is searched for the bounding street it came by or left by. */
const LOOK = 4;

export interface TripReading {
  corridor: number; direction: string;
  /** Bounding streets the trip entered and left the side streets by. */
  from: string; to: string; fromRaw: string; toRaw: string;
  /** Share of the trip's side-street distance in the corridor with the second most, and that corridor. */
  secondShare: number;
}

/** One through trip's corridor (the one with the most of its side-street distance, the lowest index among equals), its direction there, and its bounding streets. Null when it used no side street. */
export function readTrip(net: NetView, a: Assignment, cfg: CutCorridorsCfg, links: number[]): TripReading | null {
  const nC = cfg.corridors.length;
  const dist = new Array(nC + 1).fill(0);
  let first = -1, last = -1, total = 0;
  links.forEach((id, k) => {
    const c = a.corridorOf[id];
    if (c < 0) return;
    dist[c] += net.links[id].length; total += net.links[id].length;
    if (first < 0) first = k;
    last = k;
  });
  if (first < 0) return null;
  let corridor = 0;
  for (let c = 1; c <= nC; c++) if (dist[c] > dist[corridor] + 1e-9) corridor = c;
  const second = Math.max(0, ...dist.map((d, c) => (c === corridor ? 0 : d)));
  const nameOf = (l: NetLink) => (l.name.trim() ? l.name.trim() : l.class === 'motorway' ? 'the freeway' : 'an unnamed road');
  const endOf = (node: number, next: number, step: 1 | -1): string => {
    const bounding = new Set(cfg.bounding);
    const at = a.boundingAt.get(node) ?? [];
    const adjacent = next >= 0 && next < links.length ? nameOf(net.links[links[next]]) : '';
    if (bounding.has(adjacent)) return adjacent;
    if (at.length) return at[0];
    let near = '';
    for (let k = next, n = 0; k >= 0 && k < links.length && n < LOOK; k += step, n++) {
      const l = net.links[links[k]];
      if (isLocalLink(l)) continue;
      const name = nameOf(l);
      if (!near) near = name;
      if (bounding.has(name)) return name;
    }
    return near;
  };
  const fromRaw = first > 0 ? endOf(net.links[links[first]].from, first - 1, -1) : '', toRaw = last + 1 < links.length ? endOf(net.links[links[last]].to, last + 1, 1) : '';
  const from = fromRaw ? shortStreet(fromRaw) : 'the start', to = toRaw ? shortStreet(toRaw) : '';
  let direction: string;
  const own = links.filter((id) => a.corridorOf[id] === corridor);
  if (corridor < nC && cfg.corridors[corridor].directionBy === 'ends') direction = toRaw ? `${from} to ${to}` : `From ${from}, still driving`;
  else {
    const p = net.nodes[net.links[own[0]].from], q = net.nodes[net.links[own[own.length - 1]].to];
    let dx = q.x - p.x, dy = q.y - p.y;
    if (Math.hypot(dx, dy) < 1) { const g = net.links[own[0]].geometry as XY[]; dx = g[g.length - 1][0] - g[0][0]; dy = g[g.length - 1][1] - g[0][1]; }
    direction = compassWord(dx, dy);
    const along = corridor < nC ? a.axis[corridor] : null;
    if (along && (along === 'ns') !== (direction === 'Northbound' || direction === 'Southbound')) direction += ' on cross streets';
  }
  return { corridor, direction, from, to, fromRaw, toRaw, secondShare: total > 0 ? second / total : 0 };
}

export interface PeriodReading { period: CorridorPeriod; trips: number; noLocal: number }

/** The corridor table of one hour: cars an hour (counts over the elapsed hours) by corridor, direction and reason, the crossing count and the share of trips that use a second corridor. */
export function corridorPeriod(net: NetView, a: Assignment, cfg: CutCorridorsCfg, trips: ThroughTrip[], nSlots: number, hours: number): PeriodReading {
  const flows = new Map<string, { corridor: string; direction: string; n: number; by: number[] }>();
  const cross = new Map<string, CorridorCrossing & { n: number }>();
  const west = new Set(cfg.sides?.west ?? []), east = new Set(cfg.sides?.east ?? []);
  const sideOf = (s: string) => (west.has(s) ? 'w' : east.has(s) ? 'e' : '');
  let multi = 0, noLocal = 0;
  const idOf = (c: number) => (c < cfg.corridors.length ? cfg.corridors[c].id : OTHER_CORRIDOR);
  for (const t of trips) {
    const r = readTrip(net, a, cfg, t.links);
    if (!r) { noLocal++; continue; }
    const id = idOf(r.corridor), key = `${id}|${r.direction}`;
    const f = flows.get(key) ?? { corridor: id, direction: r.direction, n: 0, by: new Array(nSlots).fill(0) };
    f.n++; f.by[t.slot]++;
    flows.set(key, f);
    if (r.secondShare >= cfg.secondShare - 1e-9) multi++;
    const sf = sideOf(r.fromRaw), st = sideOf(r.toRaw);
    if (sf && st && sf !== st) {
      const ck = `${r.from}|${r.to}|${id}`;
      const c = cross.get(ck) ?? { from: r.from, to: r.to, corridor: id, vph: 0, n: 0 };
      c.n++; cross.set(ck, c);
    }
  }
  const out: CorridorFlow[] = [...flows.values()].map((f) => ({ corridor: f.corridor, direction: f.direction, vph: f.n / hours, byIntent: f.by.map((v) => v / hours) }))
    .sort((x, y) => y.vph - x.vph || x.corridor.localeCompare(y.corridor) || x.direction.localeCompare(y.direction));
  const crossing = [...cross.values()].map((c) => ({ from: c.from, to: c.to, corridor: c.corridor, vph: c.n / hours }))
    .sort((x, y) => y.vph - x.vph || x.from.localeCompare(y.from) || x.to.localeCompare(y.to));
  const used = trips.length - noLocal;
  return { period: { flows: out, crossing, multi: { vph: used / hours, second: multi / hours } }, trips: trips.length, noLocal };
}

/** The corridor settings of an area config, with the bounding streets taken from its `boundary` (surface streets only). Null when the area defines none. */
export function corridorCfgOf(area: { cutThroughCorridors?: Omit<CutCorridorsCfg, 'bounding'>; boundary?: (string | { name?: string; ref?: string; class?: string })[] }): CutCorridorsCfg | null {
  const c = area.cutThroughCorridors;
  if (!c) return null;
  if (!c.corridors?.length) throw new Error('cutThroughCorridors: at least one corridor is required');
  if (!c.otherName) throw new Error('cutThroughCorridors: otherName is required');
  if (!(c.nearestM > 0) || !(c.secondShare > 0 && c.secondShare <= 1)) throw new Error('cutThroughCorridors: nearestM must be positive and secondShare in (0, 1]');
  const bounding = (area.boundary ?? []).flatMap((b) => (typeof b === 'string' ? [b] : b.class === 'motorway' ? [] : [b.name ?? b.ref ?? '']).filter(Boolean));
  return { ...c, bounding };
}
