import type { Intervention, NetLink, Network } from '../../src/types';
import { decodeScenario, encodeScenario } from '../../src/lib/hash';
import { makeProjection } from '../../src/lib/projection';
import { turnKindOf } from '../../src/lib/turnkind';

/**
 * Entry movements and named turn-ban packages. An entry movement is a turn at a node from a bounding street (a non-local link inside the
 * study area, or an outside link that carries a bounding street's name) or from any other outside link, onto a residential or service
 * link inside the study area. The boundary notion is the proposal search's (`is_boundary` in `crates/sim/src/explore/mod.rs`): a link
 * inside the study area that is not residential or service. Nothing here names a place; the area is data.
 */

export type EntryTurn = 'left' | 'right' | 'straight';
export type EntrySide = 'north' | 'east' | 'south' | 'west';
export type FromKind = 'bounding' | 'outside';
export type BaseBan = 'none' | 'all-periods' | 'some-periods';

export interface EntryMovement {
  index: number;
  fromLink: number;
  toLink: number;
  node: number;
  fromStreet: string;
  fromClass: NetLink['class'];
  fromKind: FromKind;
  /** The bounding street the movement comes from, or null for an outside link that is not on one. */
  boundingStreet: string | null;
  side: EntrySide;
  turn: EntryTurn;
  toStreet: string;
  /** The connected run of the entered street inside the study area (same name, shared intersections). */
  run: number;
  baseBan: BaseBan;
  /** The scenario link item for this one ban decodes to this movement on the network. */
  encodes: boolean;
}

export interface InteriorRun {
  id: number;
  street: string;
  links: number;
  /** Bounding streets the run touches at its intersections. */
  touches: string[];
  through: boolean;
}

export interface Analysis {
  area: string;
  boundingStreets: string[];
  runs: InteriorRun[];
  /** Interior run of each local link, by link id. */
  runOf: Map<number, number>;
  movements: EntryMovement[];
  /** Movements found and skipped by every package, with the reason. */
  skipped: { fromLink: number; toLink: number; reason: string }[];
}

const UNNAMED = 'Unnamed road';
const nameOf = (l: NetLink) => l.name.trim();
const streetOf = (l: NetLink) => nameOf(l) || UNNAMED;
export const isLocal = (l: NetLink) => l.inStudyArea && (l.class === 'residential' || l.class === 'service');
export const isBoundaryLink = (l: NetLink) => l.inStudyArea && !isLocal(l);

const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** The bounding streets of a network: names of the study area's non-local links. */
export function boundingStreetNames(net: Network): string[] {
  return [...new Set(net.links.filter(isBoundaryLink).map(nameOf).filter(Boolean))].sort(cmp);
}

function interiorRuns(net: Network, bounding: Set<string>): { runOf: Map<number, number>; runs: InteriorRun[] } {
  const local = net.links.filter(isLocal);
  const parent = new Map<number, number>(local.map((l) => [l.id, l.id]));
  const find = (x: number): number => { let r = x; while (parent.get(r) !== r) r = parent.get(r)!; parent.set(x, r); return r; };
  const atNode = new Map<string, number[]>();
  for (const l of local) {
    if (!nameOf(l)) continue;
    for (const n of [l.from, l.to]) { const k = `${n}|${nameOf(l)}`; (atNode.get(k) ?? atNode.set(k, []).get(k)!).push(l.id); }
  }
  for (const ids of atNode.values()) for (const id of ids.slice(1)) parent.set(find(id), find(ids[0]));
  const incident = new Map<number, Set<string>>();
  for (const l of net.links) {
    const t = nameOf(l);
    if (!t || !bounding.has(t)) continue;
    for (const n of [l.from, l.to]) (incident.get(n) ?? incident.set(n, new Set()).get(n)!).add(t);
  }
  const groups = new Map<number, NetLink[]>();
  for (const l of local) (groups.get(find(l.id)) ?? groups.set(find(l.id), []).get(find(l.id))!).push(l);
  const runOf = new Map<number, number>();
  const runs: InteriorRun[] = [];
  for (const [, ls] of [...groups].sort((a, b) => a[0] - b[0])) {
    const touches = new Set<string>();
    for (const l of ls) for (const n of [l.from, l.to]) for (const t of incident.get(n) ?? []) touches.add(t);
    const id = runs.length;
    runs.push({ id, street: streetOf(ls[0]), links: ls.length, touches: [...touches].sort(cmp), through: touches.size >= 2 });
    for (const l of ls) runOf.set(l.id, id);
  }
  return { runOf, runs };
}

/** Compass side of the study area a node lies on, from the centroid of the study-area outline. */
function sideFinder(net: Network): (x: number, y: number) => EntrySide {
  const proj = makeProjection(net.origin);
  const pts = net.studyArea.length > 0 ? net.studyArea.map(([lon, lat]) => proj.toLocal(lon, lat)) : net.nodes.filter((n) => n.inStudyArea).map((n): [number, number] => [n.x, n.y]);
  const cx = pts.reduce((s, p) => s + p[0], 0) / Math.max(1, pts.length);
  const cy = pts.reduce((s, p) => s + p[1], 0) / Math.max(1, pts.length);
  return (x, y) => {
    const dx = x - cx, dy = y - cy;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'east' : 'west') : dy > 0 ? 'north' : 'south';
  };
}

/** Every entry movement of the network, classified, with the check that its link item decodes to itself. */
export function analyze(net: Network, period?: string): Analysis {
  const bounding = new Set(boundingStreetNames(net));
  const { runOf, runs } = interiorRuns(net, bounding);
  const side = sideFinder(net);
  const bans = new Map<string, BaseBan>();
  for (const b of net.turnBans ?? []) {
    const k = `${b.from}-${b.to}`;
    bans.set(k, !b.periods || b.periods.length === 0 ? 'all-periods' : bans.get(k) === 'all-periods' ? 'all-periods' : 'some-periods');
  }
  const out: EntryMovement[] = [];
  const skipped: Analysis['skipped'] = [];
  const outsAt = new Map<number, NetLink[]>();
  for (const l of net.links) (outsAt.get(l.from) ?? outsAt.set(l.from, []).get(l.from)!).push(l);
  for (const a of net.links) {
    if (isLocal(a)) continue;
    const onBounding = a.inStudyArea || bounding.has(nameOf(a));
    for (const b of outsAt.get(a.to) ?? []) {
      if (!isLocal(b) || b.to === a.from) continue;
      const turn = turnKindOf(net, a.id, b.id);
      if (turn === null || turn === 'u-turn') { skipped.push({ fromLink: a.id, toLink: b.id, reason: 'a U-turn' }); continue; }
      const node = net.nodes[a.to];
      out.push({
        index: -1, fromLink: a.id, toLink: b.id, node: a.to,
        fromStreet: streetOf(a), fromClass: a.class, fromKind: onBounding ? 'bounding' : 'outside',
        boundingStreet: onBounding ? (nameOf(a) || null) : null,
        side: side(node.x, node.y), turn, toStreet: streetOf(b), run: runOf.get(b.id) ?? -1,
        baseBan: bans.get(`${a.id}-${b.id}`) ?? 'none', encodes: true,
      });
    }
  }
  out.sort((p, q) => cmp(p.boundingStreet ?? `~${p.fromStreet}`, q.boundingStreet ?? `~${q.fromStreet}`) || cmp(p.toStreet, q.toStreet) || p.node - q.node || p.fromLink - q.fromLink || p.toLink - q.toLink);
  out.forEach((m, i) => { m.index = i; });
  for (const m of out) {
    const back = decodeScenario(net, encodeScenario(net, [turnBan(m)], { area: net.id, period })).interventions;
    m.encodes = back.length === 1 && back[0].type === 'turn_ban' && back[0].fromLink === m.fromLink && back[0].toLink === m.toLink;
    if (!m.encodes) skipped.push({ fromLink: m.fromLink, toLink: m.toLink, reason: 'its link item does not decode to this movement' });
  }
  return { area: net.id, boundingStreets: [...bounding].sort(cmp), runs, runOf, movements: out, skipped };
}

export const turnBan = (m: Pick<EntryMovement, 'fromLink' | 'toLink'>): Intervention => ({ type: 'turn_ban', fromLink: m.fromLink, toLink: m.toLink });

export interface Package {
  id: string;
  title: string;
  note: string;
  movements: EntryMovement[];
  /** Movements taken out of the package so that no node loses its way in (`keepAccess`). */
  exempt?: EntryMovement[];
}

/**
 * In-study nodes that cannot be entered from a gate or left to one when the movements in `banned` (as `from-to` keys) are closed, besides the
 * base network's own bans for the period. It follows `stranded_nodes` in `crates/sim/src/explore/mod.rs` and the movement rule of
 * `crates/sim/src/eff.rs` (a U-turn is allowed only at a dead end), with U-turns found by the link coming back to its start or by `turnKindOf`.
 * An approximation of the search's access check, for choosing packages; `explore --check` runs the real one.
 */
export function strandedNodes(net: Network, banned: Set<string>, period?: string): Set<number> {
  const osm = new Set((net.turnBans ?? []).filter((b) => !b.periods || b.periods.length === 0 || (period !== undefined && b.periods.includes(period))).map((b) => `${b.from}-${b.to}`));
  const outs = new Map<number, NetLink[]>(), ins = new Map<number, NetLink[]>();
  for (const l of net.links) {
    (outs.get(l.from) ?? outs.set(l.from, []).get(l.from)!).push(l);
    (ins.get(l.to) ?? ins.set(l.to, []).get(l.to)!).push(l);
  }
  const next: number[][] = net.links.map(() => []), prev: number[][] = net.links.map(() => []);
  for (const a of net.links) {
    const cands = outs.get(a.to) ?? [];
    for (const b of cands) {
      const k = `${a.id}-${b.id}`;
      const uturn = b.to === a.from || turnKindOf(net, a.id, b.id) === 'u-turn';
      if (osm.has(k) || banned.has(k) || (uturn && cands.length > 1)) continue;
      next[a.id].push(b.id);
      prev[b.id].push(a.id);
    }
  }
  const reach = (seed: number[], edges: number[][]) => {
    const seen = new Set<number>(seed);
    const stack = [...seed];
    for (let l = stack.pop(); l !== undefined; l = stack.pop()) for (const m of edges[l]) if (!seen.has(m)) { seen.add(m); stack.push(m); }
    return seen;
  };
  const gates = net.nodes.filter((n) => n.gate);
  const fwd = reach(gates.flatMap((n) => (outs.get(n.id) ?? []).map((l) => l.id)), next);
  const bwd = reach(gates.flatMap((n) => (ins.get(n.id) ?? []).map((l) => l.id)), prev);
  const out = new Set<number>();
  for (const n of net.nodes) {
    if (!n.inStudyArea) continue;
    const enter = n.gate || (ins.get(n.id) ?? []).some((l) => fwd.has(l.id));
    const leave = n.gate || (outs.get(n.id) ?? []).some((l) => bwd.has(l.id));
    if (!(enter && leave)) out.add(n.id);
  }
  return out;
};

/**
 * Takes entry movements out of a package until it strands no node the base network does not already strand: for the lowest-numbered stranded
 * node, every movement of the package onto the interior street (run) next to that node. `unresolved` lists nodes left stranded when no movement
 * of the package leads onto the street next to them.
 */
export function keepAccess(net: Network, a: Analysis, ms: EntryMovement[], period?: string): { kept: EntryMovement[]; exempt: EntryMovement[]; unresolved: number[] } {
  const base = strandedNodes(net, new Set(), period);
  let kept = ms;
  const exempt: EntryMovement[] = [];
  for (let i = 0; i < 50; i++) {
    const bad = [...strandedNodes(net, new Set(kept.map((m) => `${m.fromLink}-${m.toLink}`)), period)].filter((n) => !base.has(n)).sort((p, q) => p - q);
    if (bad.length === 0) return { kept, exempt, unresolved: [] };
    const runs = new Set(net.links.filter((l) => l.from === bad[0] || l.to === bad[0]).map((l) => a.runOf.get(l.id)).filter((r): r is number => r !== undefined));
    const drop = kept.filter((m) => runs.has(m.run));
    if (drop.length === 0) return { kept, exempt, unresolved: bad };
    exempt.push(...drop);
    kept = kept.filter((m) => !runs.has(m.run));
  }
  return { kept, exempt, unresolved: [] };
}

const usable = (m: EntryMovement) => m.encodes && m.baseBan !== 'all-periods';
const isTurn = (m: EntryMovement) => m.turn !== 'straight';
export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unnamed';

export interface RankedMovement { fromLink: number; toLink: number; rank: number }

/** Per bounding street, how many of its top-ranked movements make a package when a cap is set (`--max-bans`). */
export const STREET_TOP_K = 3;

/** The top-k sizes a cap allows: 2 up to the cap (one ban is a single turn ban, not a set). */
export const topKUnder = (maxBans: number): number[] => Array.from({ length: Math.max(0, maxBans - 1) }, (_, i) => i + 2);

/**
 * The packages, each as a set of movements that exist, are not banned in the base network and survive a link round trip. With `maxBans` (the
 * cap on individual turn bans in a package, change `cap-turn-bans`) a package with more bans is left out, and each bounding street also gets a
 * `street-<name>-top-3` package of its three highest-ranked movements; the ranking is always the caller's (the `explore --check-singles` log).
 */
export function buildPackages(a: Analysis, ranked: RankedMovement[] = [], topK: number[] = [3, 5, 10], access?: { net: Network; period?: string }, maxBans?: number): Package[] {
  const ok = a.movements.filter(usable);
  const pk: Package[] = [];
  const add = (id: string, title: string, note: string, ms: EntryMovement[]) => { if (ms.length > 0) pk.push({ id, title, note, movements: ms }); };
  add('all-entries', 'Every entry movement', 'Every movement from a bounding street or from outside the area onto a residential or service street inside it, turns and straight-across. Expected to fail the access check.', ok);
  add('all-turns', 'Every entry turn', 'Every left and right turn onto an interior street; straight-across movements stay open.', ok.filter(isTurn));
  if (access) {
    const k = keepAccess(access.net, a, ok.filter(isTurn), access.period);
    if (k.unresolved.length === 0 && k.exempt.length > 0 && k.kept.length > 0) {
      const names = [...new Set(k.exempt.map((m) => m.toStreet))].sort(cmp);
      add('all-turns-access', 'Every entry turn that leaves every node a way in', `The entry turns of \`all-turns\`, except the turns onto ${names.join(', ')}, which would leave a node with no way in (the access check the search applies, as far as the tool can predict it).`, k.kept);
      pk[pk.length - 1].exempt = k.exempt;
    }
  }
  add('left-turns', 'Every entry left turn', 'Left turns onto interior streets only.', ok.filter((m) => m.turn === 'left'));
  add('right-turns', 'Every entry right turn', 'Right turns onto interior streets only.', ok.filter((m) => m.turn === 'right'));
  const names = [...new Set(a.movements.map((m) => m.boundingStreet).filter((n): n is string => n !== null))].sort(cmp);
  for (const n of names) add(`street-${slug(n)}`, `Every entry turn from ${n}`, `Left and right turns onto interior streets from ${n} (the study area's link and its outside continuation).`, ok.filter((m) => isTurn(m) && m.boundingStreet === n));
  const through = new Set(a.runs.filter((r) => r.through).map((r) => r.id));
  add('through-streets', 'Every entry turn onto the through streets', 'Left and right turns onto interior streets whose run touches two different bounding streets; dead-end and short streets stay open.', ok.filter((m) => isTurn(m) && through.has(m.run)));
  add('through-streets-all', 'Every entry movement onto the through streets', 'Every movement, straight-across included, onto the same through streets.', ok.filter((m) => through.has(m.run)));
  const byKey = new Map(ok.map((m) => [`${m.fromLink}-${m.toLink}`, m]));
  const order = ranked.filter((r) => byKey.has(`${r.fromLink}-${r.toLink}`)).sort((p, q) => p.rank - q.rank).map((r) => byKey.get(`${r.fromLink}-${r.toLink}`)!);
  for (const k of topK) if (order.length >= k) add(`top-${k}`, `The ${k} entry movements with the most baseline cut-through`, 'Ranked by the search candidate list, which orders turn-ban candidates by the baseline cut-through trips that use them.', order.slice(0, k));
  if (maxBans === undefined) return pk;
  const sig = (ms: EntryMovement[]) => ms.map((m) => `${m.fromLink}-${m.toLink}`).sort().join(',');
  const seen = new Set(pk.map((p) => sig(p.movements)));
  for (const n of names) {
    const top = order.filter((m) => m.boundingStreet === n).slice(0, STREET_TOP_K);
    if (top.length < STREET_TOP_K || top.length > maxBans || seen.has(sig(top))) continue;
    add(`street-${slug(n)}-top-${STREET_TOP_K}`, `The ${STREET_TOP_K} entry movements from ${n} with the most baseline cut-through`, `The ${STREET_TOP_K} highest-ranked movements that start on ${n}, in the ranking of the search candidate list.`, top);
    seen.add(sig(top));
  }
  return pk.filter((p) => p.movements.length <= maxBans);
}

export interface PackageLink { link: string; items: number; roundTrip: boolean; problem?: string }

/** The scenario link of a package, written by the repo's encoder, and whether the repo's decoder gives the same bans back. */
export function packageLink(net: Network, p: Package, period?: string): PackageLink {
  const link = encodeScenario(net, p.movements.map(turnBan), { area: net.id, period });
  const d = decodeScenario(net, link);
  const want = new Set(p.movements.map((m) => `${m.fromLink}-${m.toLink}`));
  const got = new Set(d.interventions.flatMap((iv) => (iv.type === 'turn_ban' ? [`${iv.fromLink}-${iv.toLink}`] : [])));
  const same = want.size === got.size && [...want].every((k) => got.has(k));
  const problem = d.invalid ? 'the link does not decode (more than 200 items?)' : d.unplaced.length > 0 ? `${d.unplaced.length} item(s) unplaced` : !same ? 'the decoded bans differ from the package' : undefined;
  return { link, items: link.split('~').length, roundTrip: problem === undefined, problem };
}

export const countBy = <T>(xs: T[], key: (x: T) => string): [string, number][] => {
  const m = new Map<string, number>();
  for (const x of xs) m.set(key(x), (m.get(key(x)) ?? 0) + 1);
  return [...m].sort((p, q) => q[1] - p[1] || cmp(p[0], q[0]));
};

/** Parses `explore --check-singles` output: the turn-ban rows in candidate order, each with the link it printed. */
export function parseSinglesLog(text: string): { candidate: number; link: string }[] {
  const rows: { candidate: number; link: string }[] = [];
  for (const line of text.split('\n')) {
    const m = /^\s*#(\d+) turn_ban \| .*? \| (#v1;[^\s|]+) \|/.exec(line);
    if (m) rows.push({ candidate: Number(m[1]), link: m[2] });
  }
  return rows.sort((a, b) => a.candidate - b.candidate);
}

/** Ranked movements from the turn-ban rows of a singles log (rank 1 first). Rows that are not entry movements on this network are returned apart. */
export function rankFromLinks(net: Network, rows: { candidate: number; link: string }[]): { ranked: RankedMovement[]; unmatched: string[] } {
  const ranked: RankedMovement[] = [];
  const unmatched: string[] = [];
  for (const r of rows) {
    const ivs = decodeScenario(net, r.link).interventions;
    const iv = ivs.length === 1 ? ivs[0] : undefined;
    if (iv && iv.type === 'turn_ban') ranked.push({ fromLink: iv.fromLink, toLink: iv.toLink, rank: ranked.length + 1 });
    else unmatched.push(r.link);
  }
  return { ranked, unmatched };
}
