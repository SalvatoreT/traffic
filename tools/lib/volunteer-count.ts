// Reader for a manual turning-movement count file (data/calibration/<area>.volunteer-count-*.json): maps counted blocks, turning movements, entry points and
// full-route counts onto directed network links by street name, cross-street names and bearing. No street names live here; the file and the area config carry them.
// No I/O.
import type { Feature } from './assign';

export interface CountBlock { street: string; between: [string, string]; direction: string; toward?: string; period: 'am' | 'pm'; vehicles: number; heading?: string; uncertain?: boolean; note?: string }
export interface CountMovement { source?: string; at: string[]; period: 'am' | 'pm'; from: string; to: string; vehicles: number; kind?: string; route?: string; assumed?: boolean; note?: string }
export interface CountAccessPoint { at: [string, string]; side: string; period: 'am' | 'pm'; in?: number | null; inSource?: string }
export interface CountFullRoute { street: string; direction: string; period: 'am' | 'pm'; vehicles: number; shareOfEntering?: number; note?: string }
export interface CountFile {
  source: { id: string; description?: string };
  entering?: { pm?: { total: number; bySide: { side: string; vehicles: number }[]; fromClaremontOnto?: { street: string; vehicles: number }[] }; am?: { totalCounted: number } };
  fullRoute?: { definition?: string; rows: CountFullRoute[] };
  routeDiagrams?: { street: string; direction: string; period: string; tableTotals: { enteringAtStart: number; drivingEntireRoute: number } }[];
  alcatrazExits?: { towardTelegraph: number; towardCollege: number; straightAcross: number };
  signal?: { at: string[]; approach: string; period: string; cycleSeconds: number; greenSeconds: number; medianCarsPerCycle?: Record<string, number>; maxQueue?: number };
  blocks: CountBlock[];
  accessPoints?: CountAccessPoint[];
  turningMovements: CountMovement[];
}

export interface CNode { id: number; x: number; y: number }
export interface CLink { inStudyArea?: boolean; id: number; from: number; to: number; name: string; class: string; length: number; fromBearing?: number; toBearing?: number; geometry?: [number, number][] }
export interface CNet { nodes: CNode[]; links: CLink[] }

export interface CountConfig {
  file: string;
  /** Weight of a block station (a measured count; 1 is the weight of a turning-movement leg). */
  weight: number;
  /** Factor on the weight of values the transcription flags as uncertain. */
  uncertainFactor: number;
  /** Own tolerance (percent) for the report: one-day sampling error. ASSUMPTION. */
  tolerancePct: number;
  /** Turning movements below this many vehicles in the hour are Poisson noise and are not constraints. ASSUMPTION. */
  minMovementVeh: number;
  movementWeight: number;
  routeWeight: number;
  /** Every `holdoutEvery`-th counted block along each street and direction is validation-only (positions 1, 1 + holdoutEvery, ... along the street; never the last block of a run). */
  holdoutEvery: number;
  /** The street ends the full-route counts run between (the file names them in prose). */
  fullRouteEnds: [string, string];
  /** Surface arterials around the interior: entries are the interior links that start at one of them. */
  arterials: string[];
  /** Movements whose reading is doubtful (the notes say why); their weight takes `uncertainFactor`. */
  lowConfidenceMovements?: { at: string[]; period: 'am' | 'pm'; from: string; to: string; reason: string }[];
  /** Full-route rows to replace, with the reason (the file says its summary table may have the periods swapped). */
  fullRouteOverrides?: { street: string; direction: string; am?: number; pm?: number; reason: string }[];
  /** Midday has no count: its targets are the PM count times this factor (the ratio of the periods' hourly volumes in `periodFactors`). ASSUMPTION. */
  middayFromPm: boolean;
  middayWeightFactor: number;
  /**
   * Entries of streets with no whole-street count take the through share the counted whole streets show (cars that drove the whole street over cars that entered it),
   * so `through` is not only the counted streets. ASSUMPTION (the one other street with a through reading, Martin Street in the AM peak, gives 48% against 40% to 45%).
   * `entries` are substrings of the entry labels in the report; `scale` multiplies the share (1 = the counted streets' share, 0 or the key absent = off).
   */
  otherThrough?: { entries: string[]; scale: number };
}

export interface BlockMapping { block: CountBlock; link: number | null; approx: boolean; reason?: string }

const COMPASS: Record<string, number> = { north: 0, northeast: 45, east: 90, southeast: 135, south: 180, southwest: 225, west: 270, northwest: 315, NB: 0, EB: 90, SB: 180, WB: 270 };
const angDiff = (a: number, b: number) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const opposite = (deg: number) => (deg + 180) % 360;
const BEARING_TOL = 50;

/** Names of the streets at every node (all incident links). */
export function nodeStreets(net: CNet): Map<number, Set<string>> {
  const m = new Map<number, Set<string>>();
  for (const l of net.links) {
    if (!l.name) continue;
    for (const n of [l.from, l.to]) (m.get(n) ?? m.set(n, new Set()).get(n)!).add(l.name);
  }
  return m;
}

const circMean = (a: number, b: number) => { const x = Math.cos((a * Math.PI) / 180) + Math.cos((b * Math.PI) / 180), y = Math.sin((a * Math.PI) / 180) + Math.sin((b * Math.PI) / 180); return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360; };
/** Travel bearing of a link (mean of its entry and exit bearing; from the geometry when the network has none). */
export function linkBearing(l: CLink, nodes?: Map<number, CNode>): number {
  if (l.fromBearing !== undefined && l.toBearing !== undefined) return circMean(l.fromBearing, l.toBearing);
  const a = l.geometry?.[0] ?? (nodes ? [nodes.get(l.from)!.x, nodes.get(l.from)!.y] : [0, 0]);
  const b = l.geometry?.[l.geometry.length - 1] ?? (nodes ? [nodes.get(l.to)!.x, nodes.get(l.to)!.y] : [0, 1]);
  return ((Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI + 360) % 360;
}
/** Bearing of the end of the link where it meets the node it enters, and of its start. */
const inBearing = (l: CLink, nodes?: Map<number, CNode>) => l.toBearing ?? linkBearing(l, nodes);
const outBearing = (l: CLink, nodes?: Map<number, CNode>) => l.fromBearing ?? linkBearing(l, nodes);

/** Cross-street names of a block end as the app prints them ("A / B", "A / B / +n"): the names, without the overflow marker. */
export const endNames = (text: string): Set<string> => new Set(text.split(' / ').map((s) => s.trim()).filter((s) => s && !/^\+\d+$/.test(s)));
const endScore = (want: Set<string>, have: Set<string>): number => {
  if (!want.size || !have.size) return 0;
  const inter = [...want].filter((n) => have.has(n)).length;
  if (!inter) return 0;
  return inter === want.size && inter === have.size ? 2 : 1;
};

function blockBearing(b: CountBlock): number | null {
  const h = b.heading ? COMPASS[b.heading] : undefined;
  if (h !== undefined) return h;
  return COMPASS[b.direction] ?? null;
}

/** Directed link of a counted block: same street name, travel bearing within 50 degrees of the arrow, cross streets of both ends matching (exactly, or sharing a name when the network has merged junctions). */
export function mapBlock(b: CountBlock, net: CNet, ns: Map<number, Set<string>>, nodes?: Map<number, CNode>): BlockMapping {
  const want = blockBearing(b);
  const cand = net.links.filter((l) => l.name === b.street && (want === null || angDiff(linkBearing(l, nodes), want) <= BEARING_TOL));
  if (!cand.length) return { block: b, link: null, approx: false, reason: `no link named ${b.street} runs ${b.heading ?? b.direction}` };
  const [e0, e1] = [endNames(b.between[0]), endNames(b.between[1])];
  const tw = b.toward ? endNames(b.toward) : null;
  // The downstream end is the one `toward` names; when both ends carry the same names the bearing decides.
  const down = tw && endScore(tw, e0) === 2 && endScore(tw, e1) < 2 ? e0 : tw && endScore(tw, e1) === 2 && endScore(tw, e0) < 2 ? e1 : null;
  const up = down === e0 ? e1 : down === e1 ? e0 : null;
  let best: { l: CLink; s: number } | null = null, tie = false;
  for (const l of cand) {
    const sf = new Set([...(ns.get(l.from) ?? [])].filter((n) => n !== b.street)), st = new Set([...(ns.get(l.to) ?? [])].filter((n) => n !== b.street));
    let s: number;
    if (down && up) s = (endScore(up, sf) && endScore(down, st) ? endScore(up, sf) + endScore(down, st) : 0);
    else s = Math.max(endScore(e0, sf) && endScore(e1, st) ? endScore(e0, sf) + endScore(e1, st) : 0, endScore(e1, sf) && endScore(e0, st) ? endScore(e1, sf) + endScore(e0, st) : 0);
    if (!s) continue;
    if (!best || s > best.s) { best = { l, s }; tie = false; } else if (s === best.s) tie = true;
  }
  if (!best) return { block: b, link: null, approx: false, reason: `no ${b.street} link runs between ${b.between[0]} and ${b.between[1]} in this direction (junctions merged or the block is split)` };
  if (tie) {
    const ties = cand.filter((l) => { const sf = ns.get(l.from) ?? new Set<string>(), st = ns.get(l.to) ?? new Set<string>(); return (endScore(e0, new Set([...sf].filter((n) => n !== b.street))) || endScore(e1, new Set([...sf].filter((n) => n !== b.street)))) && (endScore(e0, new Set([...st].filter((n) => n !== b.street))) || endScore(e1, new Set([...st].filter((n) => n !== b.street)))); });
    const pick = ties.sort((p, q) => angDiff(linkBearing(p, nodes), want ?? 0) - angDiff(linkBearing(q, nodes), want ?? 0))[0];
    if (pick) return { block: b, link: pick.id, approx: true, reason: 'several links fit the cross streets; the closest bearing was taken' };
  }
  return { block: b, link: best.l.id, approx: best.s < 4 };
}

export interface MovementMapping { m: CountMovement; a: number | null; b: number | null; reason?: string }
const parseFrom = (s: string) => { const r = s.match(/^(.*?)(?: \([^)]*\))? from (north|south|east|west|northeast|northwest|southeast|southwest)\b/); return r ? { street: r[1], compass: COMPASS[r[2]] } : null; };
const parseTo = (s: string) => { const r = s.match(/^(.*?)(?: \([^)]*\))? toward (north|south|east|west|northeast|northwest|southeast|southwest)\b/); return r ? { street: r[1], compass: COMPASS[r[2]] } : null; };

/** The incoming and outgoing link of a counted turning movement ("X from southwest" to "Y toward north") at the junction named by `at`. */
export function mapMovement(m: CountMovement, net: CNet, ns: Map<number, Set<string>>, nodes?: Map<number, CNode>): MovementMapping {
  const f = parseFrom(m.from), t = parseTo(m.to);
  if (!f || !t) return { m, a: null, b: null, reason: 'the movement text names no approach or exit direction' };
  const want = m.at.flatMap((a) => [...endNames(a)]);
  const junctions = [...ns].filter(([, s]) => want.every((n) => s.has(n))).map(([id]) => id);
  if (!junctions.length) return { m, a: null, b: null, reason: `no junction with ${m.at.join(' and ')}` };
  let best: { a: number; b: number; err: number } | null = null;
  for (const j of junctions) {
    const ins = net.links.filter((l) => l.to === j && l.name === f.street), outs = net.links.filter((l) => l.from === j && l.name === t.street);
    for (const a of ins) for (const b of outs) {
      const e = angDiff(inBearing(a, nodes), opposite(f.compass)) + angDiff(outBearing(b, nodes), t.compass);
      if (angDiff(inBearing(a, nodes), opposite(f.compass)) > BEARING_TOL || angDiff(outBearing(b, nodes), t.compass) > BEARING_TOL) continue;
      if (!best || e < best.err) best = { a: a.id, b: b.id, err: e };
    }
  }
  return best ? { m, a: best.a, b: best.b } : { m, a: null, b: null, reason: `no ${f.street} approach and ${t.street} exit at the junction fit the compass directions` };
}

export interface CountStation {
  id: string; family: 'block' | 'movement' | 'route';
  label: string; basis: string;
  links: number[]; feature?: Feature;
  /** Target per period id (veh/h). */
  target: Record<string, number>;
  weight: number; tolPct: number;
  /** Weight in a period where it differs (midday is the PM count scaled, not measured). */
  weightByPeriod?: Record<string, number>;
  held: boolean;
  /** Source rows (block directions / movement ids) for the report. */
  note?: string;
  corridor: string;
  uncertain?: boolean;
  /** Movement and route stations: the block links they touch (for the cross-validation fit). */
  touches?: number[];
}

export interface CountReport {
  blocks: { total: number; mapped: number; exact: number; approx: number; fitted: number; held: number; unmapped: { street: string; between: string; direction: string; period: string; vehicles: number; reason: string }[]; duplicates: string[] };
  movements: { total: number; mapped: number; used: number; belowMin: number; unmapped: number; straight: number; lowConfidence: number };
  routes: { total: number; used: number; skipped: string[] };
  entries: { side: string; label: string; link: number; counted: Record<string, number | null>; source: string }[];
  notes: string[];
}

/** Period ids the count covers and the period the count hour belongs to. */
export interface PeriodMap { am: string; pm: string; midday?: string }

export function countStations(file: CountFile, net: CNet, cfg: CountConfig, periods: PeriodMap, volume: Record<string, number>): { stations: CountStation[]; report: CountReport } {
  const nodes = new Map(net.nodes.map((n) => [n.id, n]));
  const ns = nodeStreets(net);
  const notes: string[] = [];
  const rep: CountReport = { blocks: { total: 0, mapped: 0, exact: 0, approx: 0, fitted: 0, held: 0, unmapped: [], duplicates: [] }, movements: { total: 0, mapped: 0, used: 0, belowMin: 0, unmapped: 0, straight: 0, lowConfidence: 0 }, routes: { total: 0, used: 0, skipped: [] }, entries: [], notes };
  const per = (p: 'am' | 'pm') => periods[p];
  const mid = periods.midday;
  const midFromPm = mid && cfg.middayFromPm ? volume[mid] / volume[periods.pm] : null;
  const midFromAm = mid && cfg.middayFromPm ? volume[mid] / volume[periods.am] : null;

  // ---- blocks: one station per directed link, targets per period ----
  const byLink = new Map<number, { maps: BlockMapping[]; am?: CountBlock; pm?: CountBlock }>();
  rep.blocks.total = file.blocks.length;
  for (const b of file.blocks) {
    const mm = mapBlock(b, net, ns, nodes);
    if (mm.link === null) { rep.blocks.unmapped.push({ street: b.street, between: b.between.join(' and '), direction: b.direction, period: b.period, vehicles: b.vehicles, reason: mm.reason! }); continue; }
    rep.blocks.mapped++;
    if (mm.approx) rep.blocks.approx++; else rep.blocks.exact++;
    const e = byLink.get(mm.link) ?? byLink.set(mm.link, { maps: [] }).get(mm.link)!;
    e.maps.push(mm);
    if (e[b.period]) { rep.blocks.duplicates.push(`link ${mm.link} ${b.street} ${b.direction} ${b.period}: ${e[b.period]!.between.join('/')} ${e[b.period]!.vehicles} and ${b.between.join('/')} ${b.vehicles}; the larger is kept`); if (b.vehicles > e[b.period]!.vehicles) e[b.period] = b; } else e[b.period] = b;
  }
  const stations: CountStation[] = [];
  const linkOf = new Map(net.links.map((l) => [l.id, l]));
  const blockStations: CountStation[] = [];
  for (const [li, e] of byLink) {
    const l = linkOf.get(li)!;
    const any = (e.pm ?? e.am)!;
    const uncertain = (e.am?.uncertain ?? false) || (e.pm?.uncertain ?? false);
    const target: Record<string, number> = {};
    if (e.am) target[per('am')] = e.am.vehicles;
    if (e.pm) target[per('pm')] = e.pm.vehicles;
    if (mid) { const m = e.pm ? e.pm.vehicles * midFromPm! : e.am ? e.am.vehicles * midFromAm! : 0; if (m > 0) target[mid] = m; }
    const lab = `${l.name} ${any.between.join(' to ')}, ${any.direction} (link ${li})`;
    blockStations.push({
      id: `count block ${li}`, family: 'block', label: `${lab}`, corridor: `${l.name} (volunteer count)`,
      basis: `DATA (volunteer count of ${file.source.id}${e.am ? ` AM ${e.am.vehicles}` : ''}${e.pm ? ` PM ${e.pm.vehicles}` : ''}${mid ? `; ${mid} = PM x ${midFromPm!.toFixed(2)} ASSUMPTION` : ''}${uncertain ? '; reading flagged uncertain' : ''})`,
      links: [li], target, weight: cfg.weight * (uncertain ? cfg.uncertainFactor : 1), tolPct: cfg.tolerancePct, held: false, uncertain,
    });
  }
  if (mid) for (const s of blockStations) s.weightByPeriod = { [mid]: s.weight * cfg.middayWeightFactor };
  // Hold-out: along each street and direction, ordered along the street, every `holdoutEvery`-th block (never the first and last of the run, never an uncertain value).
  const groups = new Map<string, CountStation[]>();
  for (const s of blockStations) {
    const l = linkOf.get(s.links[0])!;
    const b = linkBearing(l, nodes), axis = b < 45 || b >= 315 || (b >= 135 && b < 225) ? 'NS' : 'EW';
    const key = `${l.name}|${angDiff(b, 0) <= 90 ? 'fwd' : 'back'}|${axis}`;
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(s);
  }
  const posOf = (s: CountStation) => { const l = linkOf.get(s.links[0])!, a = nodes.get(l.from)!, c = nodes.get(l.to)!, h = (linkBearing(l, nodes) * Math.PI) / 180; return ((a.x + c.x) / 2) * Math.sin(h) + ((a.y + c.y) / 2) * Math.cos(h); };
  for (const [key, list] of groups) {
    const fwd = key.includes('|fwd|');
    list.sort((p, q) => (fwd ? 1 : -1) * (posOf(p) - posOf(q)));
    list.forEach((s, i) => { if (i % cfg.holdoutEvery === 1 && !s.uncertain && i < list.length - 1) s.held = true; });
  }
  stations.push(...blockStations);
  rep.blocks.fitted = blockStations.filter((s) => !s.held).length;
  rep.blocks.held = blockStations.filter((s) => s.held).length;
  const blockLinks = new Set(blockStations.map((s) => s.links[0]));
  const heldLinks = new Set(blockStations.filter((s) => s.held).map((s) => s.links[0]));

  // ---- turning movements ----
  const mvKey = new Map<string, { a: number; b: number; am?: number; pm?: number; maps: string[]; at: string[]; from: string; to: string; low?: boolean }>();
  const doubtful = /low-confidence|inferred|not legible/;
  rep.movements.total = file.turningMovements.length;
  for (const m of file.turningMovements) {
    const mm = mapMovement(m, net, ns, nodes);
    if (mm.a === null || mm.b === null) { rep.movements.unmapped++; continue; }
    rep.movements.mapped++;
    // A straight movement on one street is the block volume less the turns that left or joined; the block counts carry it.
    if (parseFrom(m.from)!.street === parseTo(m.to)!.street) { rep.movements.straight++; continue; }
    const k = `${mm.a}>${mm.b}`;
    const e = mvKey.get(k) ?? mvKey.set(k, { a: mm.a, b: mm.b, maps: [], at: m.at, from: m.from, to: m.to }).get(k)!;
    e[m.period] = Math.max(e[m.period] ?? 0, m.vehicles);
    if (doubtful.test(m.note ?? '') || (cfg.lowConfidenceMovements ?? []).some((q) => q.period === m.period && q.from === m.from && q.to === m.to && q.at.every((n) => m.at.includes(n)))) e.low = true;
    e.maps.push(`${m.period} ${m.vehicles} (${m.source ?? ''})`);
  }
  for (const [k, e] of mvKey) {
    const target: Record<string, number> = {};
    if ((e.am ?? 0) >= cfg.minMovementVeh) target[per('am')] = e.am!;
    if ((e.pm ?? 0) >= cfg.minMovementVeh) target[per('pm')] = e.pm!;
    if (!Object.keys(target).length) { rep.movements.belowMin++; continue; }
    if (mid && target[per('pm')]) target[mid] = target[per('pm')] * midFromPm!;
    rep.movements.used++;
    if (e.low) rep.movements.lowConfidence++;
    stations.push({
      id: `count move ${k}`, family: 'movement', label: `${e.from} to ${e.to} at ${e.at.join(' / ')}`, corridor: 'turning movements (volunteer count)',
      basis: `DATA (volunteer count of ${file.source.id}, turning movement${e.am ? ` AM ${e.am}` : ''}${e.pm ? ` PM ${e.pm}` : ''})`,
      links: [], feature: { kind: 'move', a: e.a, b: e.b }, target, weight: cfg.movementWeight * (e.low ? cfg.uncertainFactor : 1), tolPct: cfg.tolerancePct, held: false, touches: [e.a, e.b],
    });
  }

  // ---- full routes: trips that drive the whole street between the two ends ----
  const [endA, endB] = cfg.fullRouteEnds;
  const ov = cfg.fullRouteOverrides ?? [];
  rep.routes.total = file.fullRoute?.rows.length ?? 0;
  const routeRows = new Map<string, { street: string; direction: string; am?: number; pm?: number }>();
  for (const r of file.fullRoute?.rows ?? []) {
    if (!['NB', 'SB', 'EB', 'WB'].includes(r.direction)) { rep.routes.skipped.push(`${r.street}, ${r.direction}, ${r.period}: not a whole street between ${endA} and ${endB}`); continue; }
    const k = `${r.street}|${r.direction}`;
    const e = routeRows.get(k) ?? routeRows.set(k, { street: r.street, direction: r.direction }).get(k)!;
    e[r.period] = r.vehicles;
  }
  for (const o of ov) { const e = routeRows.get(`${o.street}|${o.direction}`); if (e) { if (o.am !== undefined) e.am = o.am; if (o.pm !== undefined) e.pm = o.pm; notes.push(`full route ${o.street} ${o.direction}: ${o.reason}`); } }
  for (const e of routeRows.values()) {
    const want = COMPASS[e.direction];
    const cand = net.links.filter((l) => l.name === e.street && angDiff(linkBearing(l, nodes), want) <= BEARING_TOL);
    const first = cand.filter((l) => ns.get(l.from)?.has(endA) || ns.get(l.from)?.has(endB));
    const last = cand.filter((l) => ns.get(l.to)?.has(endA) || ns.get(l.to)?.has(endB));
    const pair = first.flatMap((f) => last.filter((l) => l.id !== f.id && ((ns.get(f.from)?.has(endA) && ns.get(l.to)?.has(endB)) || (ns.get(f.from)?.has(endB) && ns.get(l.to)?.has(endA)))).map((l) => [f, l] as const));
    if (!pair.length) { rep.routes.skipped.push(`${e.street} ${e.direction}: no link of the street starts at ${endA} or ${endB} and a later one ends at the other`); continue; }
    const [f, l] = pair[0];
    const target: Record<string, number> = {};
    if (e.am) target[per('am')] = e.am;
    if (e.pm) target[per('pm')] = e.pm;
    if (mid && e.pm) target[mid] = e.pm * midFromPm!;
    rep.routes.used++;
    stations.push({
      id: `count route ${f.id}>${l.id}`, family: 'route', label: `${e.street} ${e.direction}, whole street between ${endA} and ${endB} (links ${f.id} to ${l.id})`, corridor: 'full routes (volunteer count)',
      basis: `DATA (volunteer count of ${file.source.id}, full-route count${e.am ? ` AM ${e.am}` : ''}${e.pm ? ` PM ${e.pm}` : ''})`,
      links: [], feature: { kind: 'path', first: f.id, last: l.id }, target, weight: cfg.routeWeight, tolPct: cfg.tolerancePct * 1.5, held: false, touches: [f.id, l.id],
    });
  }

  // ---- entries: interior links that start at a surface arterial ----
  const arts = new Set(cfg.arterials);
  for (const a of file.accessPoints ?? []) {
    const [art, st] = arts.has(a.at[0]) ? [a.at[0], a.at[1]] : [a.at[1], a.at[0]];
    let cands = net.links.filter((l) => l.name === st && ns.get(l.from)?.has(art) && !ns.get(l.to)?.has(art));
    if (cands.length > 1 && cands.some((l) => l.inStudyArea)) cands = cands.filter((l) => l.inStudyArea);
    const link = cands.length === 1 ? cands[0].id : null;
    if (link === null) { notes.push(`entry ${a.at.join(' / ')}: ${cands.length ? 'several' : 'no'} link(s) of ${st} start at ${art}`); continue; }
    const hit = rep.entries.find((x) => x.link === link);
    const blk = byLink.get(link);
    const counted: Record<string, number | null> = { [per(a.period)]: a.in ?? (a.period === 'pm' ? blk?.pm?.vehicles ?? null : blk?.am?.vehicles ?? null) };
    if (hit) { Object.assign(hit.counted, counted); continue; }
    rep.entries.push({ side: a.side, label: `${a.at.join(' / ')}`, link, counted, source: a.inSource ?? (a.in == null && blk ? 'block count of the entry block' : '') });
  }
  rep.notes.push(`${blockLinks.size} block stations (${heldLinks.size} held out); movement and route stations whose links lie on a held-out block are left out of the cross-validation fit`);
  return { stations, report: rep };
}

/** Links of a station that lie on a held-out block (for the cross-validation fit). */
export const touchesHeld = (s: CountStation, held: Set<number>): boolean => (s.touches ?? []).some((l) => held.has(l));

/** The count's mapping onto the network as report lines for the demand fit report. */
export function countReportLines(r: CountReport): string[] {
  const L: string[] = ['', '## Resident volunteer count: what was mapped', ''];
  L.push(`Counted block values: ${r.blocks.total}; mapped to a directed link ${r.blocks.mapped} (${r.blocks.exact} with both cross streets matching exactly, ${r.blocks.approx} approximate because the network merged a junction); ${r.blocks.fitted} fitted block stations and ${r.blocks.held} validation-only (every fourth block along each street and direction). Turning movements: ${r.movements.total}; mapped ${r.movements.mapped}; straight movements on one street left to the block counts ${r.movements.straight}; below the minimum ${r.movements.belowMin}; used as constraints ${r.movements.used} (${r.movements.lowConfidence} down-weighted for a doubtful reading); unmapped ${r.movements.unmapped}. Whole-street routes: ${r.routes.used} of ${r.routes.total} rows.`, '');
  if (r.blocks.unmapped.length) {
    L.push('Counted blocks with no directed link:', '', '| Street | Between | Direction | Period | Vehicles | Why |', '| --- | --- | --- | --- | --- | --- |');
    for (const u of r.blocks.unmapped) L.push(`| ${u.street} | ${u.between} | ${u.direction} | ${u.period} | ${u.vehicles} | ${u.reason} |`);
    L.push('');
  }
  if (r.blocks.duplicates.length) L.push('Two counted blocks on one link:', '', ...r.blocks.duplicates.map((d) => `- ${d}`), '');
  if (r.routes.skipped.length) L.push('Route rows not used:', '', ...r.routes.skipped.map((d) => `- ${d}`), '');
  L.push('Entry links (interior links that start at a surface arterial), counted vehicles per period:', '', '| Side | Entry | Link | Counted |', '| --- | --- | --- | --- |');
  for (const e of r.entries) L.push(`| ${e.side} | ${e.label} | ${e.link} | ${Object.entries(e.counted).map(([p, v]) => `${p} ${v ?? 'n/a'}`).join(', ')} |`);
  L.push('', ...r.notes.map((n) => `- ${n}`));
  return L;
}

export interface TripEnds { entries: number; exits: number; through: number; destinations: number; origins: number }

/**
 * Trip ends inside the neighborhood implied by the count, per period id: vehicles entering minus the cars that drive a whole counted street (they enter and leave
 * without stopping, so they are no trip end), and the same for vehicles leaving (volume of the reverse link of every entry link). A lower bound on `through` (only the
 * counted streets), so an upper bound on the ends. Midday has no count: the mean of the two counted periods' ratios to the offered ends is the caller's choice.
 */
export function tripEnds(file: CountFile, res: { stations: CountStation[]; report: CountReport }, net: CNet, periods: PeriodMap, cfg?: Pick<CountConfig, 'otherThrough'>): Record<string, TripEnds> {
  const rev = new Map(net.links.map((l) => [l.id, (l as CLink & { reverse?: number | null }).reverse ?? null]));
  const blk = new Map(res.stations.filter((s) => s.family === 'block').map((s) => [s.links[0], s]));
  const out: Record<string, TripEnds> = {};
  for (const p of ['am', 'pm'] as const) {
    const id = periods[p];
    let entries = 0, exits = 0;
    for (const e of res.report.entries) { entries += e.counted[id] ?? 0; const r = rev.get(e.link); exits += (r !== null && r !== undefined ? blk.get(r)?.target[id] : 0) ?? 0; }
    const counted = res.stations.filter((s) => s.family === 'route').reduce((a, s) => a + (s.target[id] ?? 0), 0);
    let extra = 0;
    const ot = cfg?.otherThrough;
    if (ot && ot.scale > 0 && file.routeDiagrams) {
      const rows = file.routeDiagrams.filter((r) => r.period === p && r.tableTotals.drivingEntireRoute > 0);
      const enter = rows.reduce((a, r) => a + r.tableTotals.enteringAtStart, 0);
      const share = enter > 0 ? rows.reduce((a, r) => a + r.tableTotals.drivingEntireRoute, 0) / enter : 0;
      let base = 0;
      for (const e of res.report.entries) if (ot.entries.some((k) => e.label.includes(k))) base += e.counted[id] ?? 0;
      extra = share * ot.scale * base;
    }
    const through = counted + extra;
    out[id] = { entries, exits, through, destinations: Math.max(0, entries - through), origins: Math.max(0, exits - through) };
  }
  return out;
}
