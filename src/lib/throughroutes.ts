import type { Intervention, NetLink, Network } from '../types';
import { buildIndex, linkStreet, type NetIndex } from './naming';
import { bannedMoves } from './diverter';

/**
 * Through-route check: a quick screen of the street layout, with no traffic volumes (design D4 of openspec/changes/cell-leak-check).
 * The idea follows low-traffic-neighborhood practice: can a car get from one boundary street to another through the area?
 * The constants below are screening choices (assumptions), not calibrated values.
 */

/** Entering and leaving the same bounding street counts as a bypass only when the two points are at least this far apart (m). ASSUMPTION. */
export const SAME_STREET_MIN_M = 250;
/** Longest path searched through the interior (m). ASSUMPTION: longer detours are not a realistic shortcut. */
export const MAX_ROUTE_M = 2000;
/** Routes between the same two streets that share more than this fraction of their length are one route. ASSUMPTION. */
export const MERGE_OVERLAP = 0.6;
/** Routes kept per pair of bounding streets, and in all. The count reported is taken before these caps. */
export const MAX_PER_PAIR = 3;
export const MAX_ROUTES = 30;

export interface Access {
  /** Street name of the perimeter link. */
  street: string;
  node: number;
  perimeter: number;
  interior: number;
}
export interface Cell {
  id: string;
  name: string;
  links: number[];
  lengthM: number;
  entries: Access[];
  exits: Access[];
}
export interface ThroughRoute {
  id: string;
  /** Ordered link ids, interior links only. */
  links: number[];
  lengthM: number;
  fromStreet: string;
  toStreet: string;
  via: string[];
  description: string;
  cell: string;
}
export interface RouteCheck {
  cells: Cell[];
  /** Representative routes, shortest first, after the caps. */
  routes: ThroughRoute[];
  /** Routes after merging near-duplicates, before the caps. */
  total: number;
  capped: boolean;
}

interface Base {
  interior: boolean[];
  alwaysBans: Set<number>;
  nl: number;
}
const baseCache = new WeakMap<Network, Base>();
const checkCache = new WeakMap<Network, { idx: NetIndex; check: RouteCheck }>();

/** Interior streets are residential and service links inside the study area; every other link is perimeter (design D1). */
export const isInterior = (l: NetLink): boolean => l.inStudyArea && (l.class === 'residential' || l.class === 'service');

function baseOf(net: Network): Base {
  let b = baseCache.get(net);
  if (!b) {
    const nl = net.links.length;
    const alwaysBans = new Set<number>();
    // A time-limited ban leaves the route open at other hours, so only bans without periods count here.
    for (const t of net.turnBans ?? []) if (!t.periods?.length) alwaysBans.add(t.from * nl + t.to);
    b = { interior: net.links.map(isInterior), alwaysBans, nl };
    baseCache.set(net, b);
  }
  return b;
}

/** Today's check, computed once per network. */
export function baselineCheck(net: Network, idx: NetIndex): RouteCheck {
  const hit = checkCache.get(net);
  if (hit && hit.idx === idx) return hit.check;
  const check = checkThroughRoutes(net, idx, []);
  checkCache.set(net, { idx, check });
  return check;
}

interface Graph {
  closed: boolean[];
  banned: Set<number>;
  filteredNode: Set<number>;
  /** Links through which cars may not enter / leave a junction whose filter closes only some legs. */
  legIn: Set<number>;
  legOut: Set<number>;
}
function effective(net: Network, idx: NetIndex, ivs: Intervention[], base: Base): Graph {
  const nl = base.nl, nn = net.nodes.length;
  const closed: boolean[] = new Array(nl).fill(false);
  const banned = new Set(base.alwaysBans);
  const filteredNode = new Set<number>();
  const legIn = new Set<number>(), legOut = new Set<number>();
  for (const iv of ivs) {
    switch (iv.type) {
      case 'modal_filter':
        if ('link' in iv) {
          const l = net.links[iv.link];
          if (l) { closed[l.id] = true; if (l.reverse !== null) closed[l.reverse] = true; }
        } else if (iv.node >= 0 && iv.node < nn) {
          if (iv.legs === undefined) filteredNode.add(iv.node);
          else for (const id of iv.legs) {
            const l = net.links[id];
            if (l?.to === iv.node) legIn.add(id);
            if (l?.from === iv.node) legOut.add(id);
          }
        }
        break;
      case 'one_way': {
        const l = net.links[iv.link];
        if (l && l.reverse !== null) closed[l.reverse] = true;
        break;
      }
      case 'turn_ban':
        if (net.links[iv.fromLink] && net.links[iv.toLink]) banned.add(iv.fromLink * nl + iv.toLink);
        break;
      case 'diagonal_diverter':
        if (iv.node >= 0 && iv.node < nn) for (const m of bannedMoves(net, idx, iv.node, iv.bearing)) {
          const [a, b] = m.split('-');
          banned.add(Number(a) * nl + Number(b));
        }
        break;
      default: break;
    }
  }
  return { closed, banned, filteredNode, legIn, legOut };
}

class Heap {
  private a: [number, number][] = [];
  get size() { return this.a.length; }
  push(k: number, v: number) {
    const a = this.a; a.push([k, v]);
    let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; }
  }
  pop(): [number, number] {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}

const unorderedPair = (a: string, b: string) => (a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`);

function joinNames(n: string[]): string {
  if (n.length <= 1) return n.join('');
  return `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}`;
}

/** Streets a route follows, longest three kept, in the order driven. */
function viaStreets(net: Network, idx: NetIndex, links: number[], skip: string[]): string[] {
  const len = new Map<string, number>(), order: string[] = [];
  for (const id of links) {
    const n = idx.linkName[id];
    if (!len.has(n)) order.push(n);
    len.set(n, (len.get(n) ?? 0) + net.links[id].length);
  }
  const keep = new Set([...order].sort((p, q) => len.get(q)! - len.get(p)!).slice(0, 3));
  return order.filter((n) => keep.has(n) && !skip.includes(n));
}

export function checkThroughRoutes(net: Network, idx: NetIndex, ivs: Intervention[]): RouteCheck {
  const base = baseOf(net);
  const { interior, nl } = base;
  const { closed, banned, filteredNode, legIn, legOut } = effective(net, idx, ivs, base);
  const links = net.links;
  const open = (id: number) => !closed[id];
  /** Can a car go from link a to link b at their shared node? U-turns are left out, as a through route never needs one. */
  const move = (a: number, b: number) =>
    open(a) && open(b) && links[a].reverse !== b && !filteredNode.has(links[a].to) && !legIn.has(a) && !legOut.has(b) && !banned.has(a * nl + b);

  // Cells: interior links joined by any allowed movement, in either direction.
  const parent = new Int32Array(nl).fill(-1);
  const find = (x: number): number => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  const union = (a: number, b: number) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[Math.max(ra, rb)] = Math.min(ra, rb); };
  const members: number[] = [];
  for (const l of links) if (interior[l.id] && open(l.id)) { parent[l.id] = l.id; members.push(l.id); }
  for (const a of members) {
    const r = links[a].reverse;
    if (r !== null && parent[r] >= 0) union(a, r);
    for (const b of idx.outgoingLinks[links[a].to]) if (parent[b] >= 0 && move(a, b)) union(a, b);
  }
  const byRoot = new Map<number, number[]>();
  for (const a of members) { const r = find(a); (byRoot.get(r) ?? byRoot.set(r, []).get(r)!).push(a); }

  // A side street outside the area that meets a bounding street at the same node counts as that bounding street:
  // a driver crossing Telegraph Avenue from the west is entering from Telegraph Avenue.
  const RANK: Record<string, number> = { motorway: 0, primary: 1, secondary: 2, tertiary: 3 };
  const bounding = (node: number): NetLink | null => {
    let best: NetLink | null = null;
    for (const id of [...idx.incomingLinks[node], ...idx.outgoingLinks[node]]) {
      const l = links[id];
      if (!interior[id] && l.class in RANK && (!best || RANK[l.class] < RANK[best.class])) best = l;
    }
    return best;
  };
  const streetOf = (p: number, node: number) => {
    const l = links[p];
    if (l.class in RANK) return linkStreet(l);
    const b = bounding(node);
    return b ? linkStreet(b) : linkStreet(l);
  };

  // Entry and exit points on the perimeter.
  const entries = new Map<number, Access[]>(), exits = new Map<number, Access[]>();
  for (const e of members) {
    const from = links[e].from, to = links[e].to;
    // One access per street, however many arms of it meet the node.
    const add = (m: Map<number, Access[]>, a: Access) => {
      const list = m.get(e) ?? m.set(e, []).get(e)!;
      if (!list.some((x) => x.street === a.street)) list.push(a);
    };
    for (const p of idx.incomingLinks[from]) if (!interior[p] && move(p, e)) add(entries, { street: streetOf(p, from), node: from, perimeter: p, interior: e });
    for (const q of idx.outgoingLinks[to]) if (!interior[q] && move(e, q)) add(exits, { street: streetOf(q, to), node: to, perimeter: q, interior: e });
  }

  const cells: Cell[] = [];
  const cellOf = new Map<number, string>();
  for (const ids of byRoot.values()) {
    ids.sort((p, q) => p - q);
    const id = `c${ids[0]}`;
    const len = new Map<string, number>();
    let total = 0;
    for (const l of ids) {
      cellOf.set(l, id);
      total += links[l].length;
      const n = idx.linkName[l];
      len.set(n, (len.get(n) ?? 0) + links[l].length);
    }
    const main = [...len.entries()].sort((p, q) => q[1] - p[1] || p[0].localeCompare(q[0])).slice(0, 2).map(([n]) => n);
    cells.push({
      id, name: main.join(' and '), links: ids, lengthM: total,
      entries: ids.flatMap((l) => entries.get(l) ?? []), exits: ids.flatMap((l) => exits.get(l) ?? []),
    });
  }
  cells.sort((p, q) => q.lengthM - p.lengthM || p.links[0] - q.links[0]);

  // Shortest interior path from each entry link to every exit link.
  const found: { links: number[]; lengthM: number; from: string; to: string; key: string }[] = [];
  const dist = new Float64Array(nl).fill(Infinity), prev = new Int32Array(nl);
  const seen: number[] = [];
  for (const [start, ins] of entries) {
    for (const s of seen) dist[s] = Infinity;
    seen.length = 0;
    const heap = new Heap();
    dist[start] = links[start].length; prev[start] = -1; seen.push(start);
    heap.push(dist[start], start);
    const reach: number[] = [];
    while (heap.size) {
      const [d, a] = heap.pop();
      if (d > dist[a]) continue;
      reach.push(a);
      for (const b of idx.outgoingLinks[links[a].to]) {
        if (parent[b] < 0 || !move(a, b)) continue;
        const nd = d + links[b].length;
        if (nd > MAX_ROUTE_M) continue;
        if (nd < dist[b]) {
          if (dist[b] === Infinity) seen.push(b);
          dist[b] = nd; prev[b] = a; heap.push(nd, b);
        }
      }
    }
    for (const x of reach) {
      const outs = exits.get(x);
      if (!outs) continue;
      let pick: { from: string; to: string } | null = null;
      for (const i of ins) {
        for (const o of outs) {
          if (i.street !== o.street) { pick = { from: i.street, to: o.street }; break; }
          const a = net.nodes[i.node], b = net.nodes[o.node];
          if (Math.hypot(a.x - b.x, a.y - b.y) >= SAME_STREET_MIN_M) { pick = { from: i.street, to: o.street }; break; }
        }
        if (pick) break;
      }
      if (!pick) continue;
      const path: number[] = [];
      for (let c = x; c !== -1; c = prev[c]) path.push(c);
      path.reverse();
      found.push({ links: path, lengthM: dist[x], from: pick.from, to: pick.to, key: unorderedPair(pick.from, pick.to) });
    }
  }

  // Merge near-duplicates (a route and its reverse are the same route), then cap.
  const blockOf = (l: number) => Math.min(l, links[l].reverse ?? l);
  const blockLen = (b: number) => links[b].length;
  const blocks = (r: { links: number[] }) => new Set(r.links.map(blockOf));
  found.sort((p, q) => p.lengthM - q.lengthM || p.links[0] - q.links[0] || p.links.length - q.links.length);
  const kept: { r: (typeof found)[number]; b: Set<number> }[] = [];
  for (const r of found) {
    const b = blocks(r);
    const dup = kept.some((k) => {
      if (k.r.key !== r.key) return false;
      let inter = 0, mine = 0, theirs = 0;
      for (const x of b) { if (k.b.has(x)) inter += blockLen(x); mine += blockLen(x); }
      for (const x of k.b) theirs += blockLen(x);
      const small = Math.min(mine, theirs);
      return small > 0 && inter / small > MERGE_OVERLAP;
    });
    if (!dup) kept.push({ r, b });
  }
  const perPair = new Map<string, number>();
  const routes: ThroughRoute[] = [];
  for (const { r } of kept) {
    const n = perPair.get(r.key) ?? 0;
    if (n >= MAX_PER_PAIR || routes.length >= MAX_ROUTES) continue;
    perPair.set(r.key, n + 1);
    const via = viaStreets(net, idx, r.links, [r.from, r.to]);
    const head = r.from === r.to ? `${r.from} to ${r.to} (a bypass)` : `${r.from} to ${r.to}`;
    routes.push({
      id: `r${r.links[0]}-${r.links[r.links.length - 1]}-${r.links.length}`, links: r.links, lengthM: r.lengthM, fromStreet: r.from, toStreet: r.to, via,
      description: via.length ? `${head} via ${joinNames(via)}` : head,
      cell: cellOf.get(r.links[0])!,
    });
  }
  return { cells, routes, total: kept.length, capped: routes.length < kept.length };
}

/** Check for a scenario; `idx` defaults to a fresh index, which is slower, so callers that have one should pass it. */
export function throughRoutes(net: Network, ivs: Intervention[], idx: NetIndex = buildIndex(net)): RouteCheck {
  return ivs.length === 0 ? baselineCheck(net, idx) : checkThroughRoutes(net, idx, ivs);
}

// --- wording

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** One sentence for the Scenario panel and the live region. */
export function routeHeadline(total: number, today: number, scenario: boolean): string {
  if (!scenario || total === today) {
    if (total === 0) return scenario ? 'No car can cross the area on side streets, the same as today.' : 'No car can cross the area on side streets today.';
    return scenario
      ? `${plural(total, 'route still lets', 'routes still let')} a car cross the area on side streets, the same as today.`
      : `${plural(total, 'route lets', 'routes let')} a car cross the area on side streets today.`;
  }
  if (total === 0) return `No car can cross the area on side streets, down from ${today} today.`;
  return `${plural(total, 'route still lets', 'routes still let')} a car cross the area on side streets, ${total < today ? 'down' : 'up'} from ${today} today.`;
}

export const ROUTE_CAVEAT = 'A quick check of the street layout. It ignores how much traffic would use each route.';

export function formatRouteLength(m: number): string {
  const ft = m * 3.28084;
  return ft < 1000 ? `${Math.round(ft / 10) * 10} ft` : `${(m / 1609.344).toFixed(2)} mi`;
}
