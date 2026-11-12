// Count-constrained demand: count stations as link constraints, static assignment, matrix adjustment and the capacity guard
// (baseline-calibration, seventh round). Orchestration and report for tools/build-demand.ts. No I/O.
import { geh, withinBand, selectHoldout, corridors, evaluateCases, summarizeCases, type HoldoutOptions } from './acceptance';
import { SIM_ROUTE_PARAMS, assign, assignMsa, buildGraph, linkVolumes, type ALink, type ANode, type ATurnBan, type Assignment, type Feature, type Graph } from './assign';
import { assigned, fitToCounts, type Constraint, type FitOptions, type FlowType } from './fit-counts';
import { buildShareConstraints, impliedVolumes, type ImpliedVolume, type ShareLink, type ShareSpec, type Targets } from './share-targets';

export interface NetLinkIn extends ALink { name: string; lanes?: number; inStudyArea?: boolean }
export interface FlowIn { origin: number; destination: number; vehPerHour: number; mode?: string }

export interface Station {
  id: string;
  kind: 'gate' | 'tmc' | 'caltrans' | 'ramp' | 'count';
  label: string;
  /** DATA, or DATA with an ASSUMPTION factor (what the factor is). */
  basis: string;
  links: number[];
  /** Gate counts: node ids whose generated (origins) or absorbed (destinations) trips the count covers; `links` is then empty. */
  origins?: number[]; destinations?: number[];
  target: Record<string, number>;
  weight: number;
  /** Tolerance class for the report (percent): gates and ramps have their own, set by config. */
  tolPct: number;
  /** The source records the target is derived from: a key per record and direction, and the share of that record this station carries (a record split over several stations carries shares that add to at most 1). */
  records: { key: string; share: number }[];
  /** Validation-only: not a fit constraint, reported separately (design D17). */
  held?: boolean;
  /** Left out of the cross-validation fit without being scored as held out (a movement or route count that touches a held-out block). */
  cvExclude?: boolean;
  /** A turning movement or path count: constrains the share of routes that have the feature, `links` is empty. */
  feature?: Feature;
  /** Weight in a period where it differs from `weight`. */
  weightByPeriod?: Record<string, number>;
  /** Corridor for the hold-out and the corridor ratios, when the station brings its own (volunteer-count blocks: their street). */
  corridor?: string;
}

export interface GateIn { id: number; kind: string; street: string | null; source: string; /** Source record of the count (TMC leg or Caltrans station) and the share of it this gate takes in each direction. */ record?: string; shareIn?: number; shareOut?: number; inT: Record<string, number>; outT: Record<string, number>; /** Gates that split one count (same street, close together, same source) share a group key. */ group?: string }
export interface TmcIn { id: string; x: number; y: number; legs: Record<string, { entering: number; leaving: number }>; legStreets: Record<string, string> }
export interface RampIn { kind: 'off' | 'on'; surface: number; streets: string[]; adt: number; adtKind: string; source: string }
export interface OverrideIn { street: string; adt: number; factor?: number; x: number; y: number; source: string }

export interface StationInputs {
  nodes: (ANode & { gate: boolean })[];
  links: NetLinkIn[];
  periodIds: string[];
  lastPeriod: string;
  periodFactors: Record<string, { volume: number; inboundShare: number }>;
  kFactor: number;
  rampKFactor: number;
  center: [number, number];
  inBbox: (x: number, y: number) => boolean;
  streetKey: (name: string) => string | null;
  gates: GateIn[];
  tmcs: TmcIn[];
  ramps: RampIn[];
  overrides: OverrideIn[];
  cfg: { tmcNodeMaxM: number; stationRadiusM: number; weights: Record<string, number>; tolerancePct: Record<string, number>; maxTmcProxyDistM?: number };
}

const bearing = (x: number, y: number, cx: number, cy: number) => ((Math.atan2(x - cx, y - cy) * 180) / Math.PI + 360) % 360;
const legOf = (deg: number) => ['N', 'E', 'S', 'W'][Math.round(deg / 90) % 4];
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function distToPolyline(px: number, py: number, pts: [number, number][]): number {
  let best = Infinity;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    const t = L2 > 0 ? clamp(((px - ax) * dx + (py - ay) * dy) / L2, 0, 1) : 0;
    best = Math.min(best, Math.hypot(px - (ax + t * dx), py - (ay + t * dy)));
  }
  return best;
}

/** Every count the pipeline holds, as a target volume on directed links, per period. */
export function buildStations(s: StationInputs, notes: string[]): Station[] {
  const out: Station[] = [];
  const nodeBy = new Map(s.nodes.map((n) => [n.id, n]));
  const pfPm = s.periodFactors[s.lastPeriod];
  const outIdx = new Map<number, number[]>(), inIdx = new Map<number, number[]>();
  s.links.forEach((l, i) => { (outIdx.get(l.from) ?? outIdx.set(l.from, []).get(l.from)!).push(i); (inIdx.get(l.to) ?? inIdx.set(l.to, []).get(l.to)!).push(i); });
  const per = (f: (p: string) => number) => Object.fromEntries(s.periodIds.map((p) => [p, f(p)]));
  const W = s.cfg.weights, T = s.cfg.tolerancePct;

  // 1. Gates with count data: the volume entering / leaving the model at the gate is the volume on its outgoing / incoming links.
  // Gates that split one count (the build gives each its share of the street volume) are one station on the group: the fit may move volume
  // between them, and the station keeps the count whole.
  const groups = new Map<string, GateIn[]>();
  for (const g of s.gates) if (g.kind !== 'ASSUMPTION') (groups.get(g.group ?? String(g.id)) ?? groups.set(g.group ?? String(g.id), []).get(g.group ?? String(g.id))!).push(g);
  for (const [key, gs] of groups) {
    const ids = gs.map((g) => g.id);
    const first = gs[0];
    const o = gs.filter((g) => (outIdx.get(g.id) ?? []).length), i = gs.filter((g) => (inIdx.get(g.id) ?? []).length);
    const sumT = (list: GateIn[], dir: 'inT' | 'outT') => per((p) => list.reduce((a, g) => a + g[dir][p], 0));
    const tag = gs.length > 1 ? `gates ${ids.join(' + ')}` : `gate ${first.id}`;
    const basis = `DATA (${first.source})`;
    const inT = sumT(o, 'inT'), outT = sumT(i, 'outT');
    const rec = (list: GateIn[], dir: 'entering' | 'leaving') => (first.record ? [{ key: `${first.record}|${dir}`, share: list.reduce((a, g) => a + ((dir === 'entering' ? g.shareIn : g.shareOut) ?? 1), 0) }] : []);
    if (o.length && s.periodIds.some((p) => inT[p] > 0)) out.push({ id: gs.length > 1 ? `gate group ${key} in` : `gate ${first.id} in`, kind: 'gate', label: `${tag} ${nameOf(s, (outIdx.get(o[0].id) ?? [])[0])} entering`, basis, links: [], origins: o.map((g) => g.id), target: inT, weight: W.gate ?? 1, tolPct: T.gate ?? 10, records: rec(o, 'entering') });
    if (i.length && s.periodIds.some((p) => outT[p] > 0)) out.push({ id: gs.length > 1 ? `gate group ${key} out` : `gate ${first.id} out`, kind: 'gate', label: `${tag} ${nameOf(s, (inIdx.get(i[0].id) ?? [])[0])} leaving`, basis, links: [], destinations: i.map((g) => g.id), target: outT, weight: W.gate ?? 1, tolPct: T.gate ?? 10, records: rec(i, 'leaving') });
  }

  // 2. Turning-movement count legs at counted intersections inside the model: entering = incoming links of the leg, leaving = outgoing.
  for (const c of s.tmcs) {
    let node: (typeof s.nodes)[number] | null = null, nd = Infinity;
    for (const n of s.nodes) { if (n.gate) continue; const d = Math.hypot(n.x - c.x, n.y - c.y); if (d < nd) { nd = d; node = n; } }
    if (!node || nd > s.cfg.tmcNodeMaxM) { notes.push(`TMC ${c.id}: no junction within ${s.cfg.tmcNodeMaxM} m (nearest ${Math.round(nd)} m); represented by its gates only`); continue; }
    for (const leg of ['N', 'E', 'S', 'W']) {
      const v = c.legs[leg];
      const st = c.legStreets[leg];
      if (!v || !st) continue;
      const pick = (idx: number[] | undefined, end: 'from' | 'to') => (idx ?? []).filter((i) => {
        const l = s.links[i];
        if (s.streetKey(l.name) !== st) return false;
        const far = nodeBy.get(l[end])!;
        return legOf(bearing(far.x, far.y, node!.x, node!.y)) === leg;
      });
      const ins = pick(inIdx.get(node.id), 'from'), outs = pick(outIdx.get(node.id), 'to');
      if (!ins.length || !outs.length) { notes.push(`TMC ${c.id} leg ${leg}: ${ins.length} incoming and ${outs.length} outgoing link(s) of "${st}" at junction ${node.id}; ${ins.length || outs.length ? 'only one side used' : 'skipped'}`); }
      const far = ins.length ? nodeBy.get(s.links[ins[0]].from)! : outs.length ? nodeBy.get(s.links[outs[0]].to)! : null;
      if (!far) continue;
      const enterInward = (node.x - far.x) * (s.center[0] - node.x) + (node.y - far.y) * (s.center[1] - node.y) > 0 ? 1 : -1;
      const sPm = v.entering / (v.entering + v.leaving || 1);
      const shares = (p: string) => (p === s.lastPeriod ? sPm : clamp(sPm + enterInward * (s.periodFactors[p].inboundShare - pfPm.inboundShare), 0.2, 0.8));
      const tot = (p: string) => (v.entering + v.leaving) * (s.periodFactors[p].volume / pfPm.volume);
      const basis = `DATA (Oakland TMC ${c.id}, ${leg}-leg at junction ${node.id})`;
      if (ins.length) out.push({ id: `tmc ${c.id} ${leg} entering`, kind: 'tmc', label: `${c.id} ${leg} leg entering`, basis, links: ins, target: per((p) => tot(p) * shares(p)), weight: W.tmc ?? 1, tolPct: T.tmc ?? 15, records: [{ key: `tmc ${c.id}|${leg}|entering`, share: 1 }] });
      if (outs.length) out.push({ id: `tmc ${c.id} ${leg} leaving`, kind: 'tmc', label: `${c.id} ${leg} leg leaving`, basis, links: outs, target: per((p) => tot(p) * (1 - shares(p))), weight: W.tmc ?? 1, tolPct: T.tmc ?? 15, records: [{ key: `tmc ${c.id}|${leg}|leaving`, share: 1 }] });
    }
  }

  // 3. Caltrans AADT stations inside the model area: the link of the street nearest the station in each direction. Stations outside it
  // are represented by their gates (section 1). K and the directional split are the gate rules (kFactor, period inboundShare).
  for (const o of s.overrides) {
    if (!s.inBbox(o.x, o.y)) { notes.push(`Caltrans station "${o.source.slice(0, 60)}" lies outside the model area; represented by its gates`); continue; }
    const best: Record<'in' | 'out', { i: number; d: number } | null> = { in: null, out: null };
    s.links.forEach((l, i) => {
      if (s.streetKey(l.name) !== o.street || l.class === 'motorway') return;
      const a = nodeBy.get(l.from)!, b = nodeBy.get(l.to)!;
      const pts = (l.geometry?.length ? l.geometry : [[a.x, a.y], [b.x, b.y]]) as [number, number][];
      const d = distToPolyline(o.x, o.y, pts);
      if (d > s.cfg.stationRadiusM) return;
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const inward = (b.x - a.x) * (s.center[0] - mx) + (b.y - a.y) * (s.center[1] - my) > 0;
      const k = inward ? 'in' : 'out';
      if (!best[k] || d < best[k]!.d) best[k] = { i, d };
    });
    const factor = o.factor ?? 1;
    for (const k of ['in', 'out'] as const) {
      const b = best[k];
      if (!b) { notes.push(`Caltrans station ${o.street}: no ${k}bound link within ${s.cfg.stationRadiusM} m`); continue; }
      const share = (p: string) => (k === 'in' ? clamp(s.periodFactors[p].inboundShare, 0.2, 0.8) : 1 - clamp(s.periodFactors[p].inboundShare, 0.2, 0.8));
      out.push({
        id: `caltrans ${o.street} ${Math.round(o.x)},${Math.round(o.y)} ${k}`, kind: 'caltrans', label: `${o.street} station, link ${s.links[b.i].id} ${k}ward (${Math.round(b.d)} m from the station)`,
        basis: `DATA (Caltrans AADT ${Math.round(o.adt)}${factor !== 1 ? `, x ${factor} ASSUMPTION attenuation` : ''})`,
        links: [b.i], target: per((p) => o.adt * factor * s.kFactor * s.periodFactors[p].volume * share(p)), weight: W.caltrans ?? 1, tolPct: T.caltrans ?? 15,
        records: [{ key: `ov ${o.source}|${k === 'in' ? 'entering' : 'leaving'}`, share: 1 }],
      });
    }
  }

  // 4. Ramps with a published ADT: the freeway-class link at the ramp's surface node.
  for (const r of s.ramps) {
    if (r.adtKind !== 'DATA') continue;
    const idx = (r.kind === 'off' ? inIdx : outIdx).get(r.surface) ?? [];
    const ls = idx.filter((i) => s.links[i].class === 'motorway');
    if (!ls.length) continue;
    out.push({ id: `ramp ${r.kind} ${r.surface}`, kind: 'ramp', label: `${r.kind}-ramp at node ${r.surface} (${r.streets.join(' / ') || 'unnamed'})`, basis: `DATA (Caltrans ramp ADT ${Math.round(r.adt)}; ${r.source})`, links: ls, target: per((p) => r.adt * s.rampKFactor * s.periodFactors[p].volume), weight: W.ramp ?? 1, tolPct: T.ramp ?? 5, records: [{ key: `ramp ${r.kind} ${r.surface}`, share: 1 }] });
  }
  return dedupeStations(out, notes);
}

/**
 * A count is used once. Two stations that carry the same source record in the same direction (a gate group fed by a Caltrans station or by a
 * turning-movement leg, and the link station at that same station or leg) are one constraint: the station on the link, which measures every trip
 * at that place, is kept and the gate station is dropped (the gate's offered volume keeps the record as its start value).
 */
/** The corridor a station belongs to, for the hold-out: the street of a gate, the intersection of a turning-movement count, the street of a Caltrans station, all freeway ramps together. */
export function corridorOf(st: Station): string {
  if (st.corridor) return st.corridor;
  if (st.kind === 'ramp') return 'freeway ramps';
  if (st.kind === 'tmc') return st.label.split(' ')[0];
  if (st.kind === 'caltrans') return st.label.split(' station,')[0];
  return st.label.replace(/^gates? [\d +]+ /, '').replace(/ (entering|leaving)$/, '');
}

/** Mark the validation stations (design D17). Selection is deterministic: see `selectHoldout`. Returns the corridors and the held-out ids. */
export function markHoldout(stations: Station[], periodId: string, opt: HoldoutOptions): { corridors: string[]; held: string[] } {
  // Count stations come with their own validation set (every fourth block along a street): not ranked here.
  const items = stations.filter((s) => s.kind !== 'count').map((s) => ({ id: s.id, corridor: corridorOf(s), target: s.target[periodId] ?? 0 }));
  const h = selectHoldout(items, opt);
  for (const s of stations) if (s.kind !== 'count') s.held = h.has(s.id);
  return { corridors: corridors(items), held: [...h] };
}

export function dedupeStations(stations: Station[], notes: string[]): Station[] {
  const byKey = new Map<string, Station[]>();
  for (const st of stations) for (const r of st.records) (byKey.get(r.key) ?? byKey.set(r.key, []).get(r.key)!).push(st);
  const drop = new Set<Station>();
  for (const [key, sts] of byKey) {
    if (sts.length < 2) continue;
    const share = sts.reduce((a, st) => a + st.records.find((r) => r.key === key)!.share, 0);
    if (share <= 1 + 1e-6) continue;
    const link = sts.filter((st) => st.kind !== 'gate');
    if (!link.length) continue;
    for (const st of sts.filter((x) => x.kind === 'gate')) {
      drop.add(st);
      notes.push(`${st.label}: dropped, its count (${key.replace(/\|.*$/, '').slice(0, 60)}) is already the station ${link[0].label}; a count is used once`);
    }
  }
  return stations.filter((st) => !drop.has(st));
}

/** Source records used by more than one station beyond their whole share (empty when every count is used once). */
export function overusedRecords(stations: Station[]): string[] {
  const sum = new Map<string, { share: number; ids: string[] }>();
  for (const st of stations) for (const r of st.records) {
    const e = sum.get(r.key) ?? sum.set(r.key, { share: 0, ids: [] }).get(r.key)!;
    e.share += r.share;
    e.ids.push(st.id);
  }
  return [...sum].filter(([, e]) => e.share > 1 + 1e-6).map(([k, e]) => `${k}: ${e.ids.join(', ')}`);
}

const nameOf = (s: StationInputs, i: number) => s.links[i].name || '(unnamed)';

// ---------- capacity table ----------
export interface CapEntry { perLane?: number; perApproach?: number; source: string }
export type CapTable = Record<string, CapEntry>;

/** Capacity of a link from its end-node control (validation suite measurements through the config table). */
export function linkCapacity(l: NetLinkIn, node: ANode, minor: boolean, cap: CapTable): { cap: number; rule: string } {
  const lanes = Math.max(1, l.lanes ?? 1);
  let rule: string;
  if (l.class === 'motorway') rule = node.control === 'signal' ? 'motorway_signal' : 'motorway';
  else if (node.control === 'signal') rule = 'signal';
  else if (node.control === 'all_way_stop') rule = 'all_way_stop';
  else if (node.control === 'two_way_stop') rule = minor ? 'two_way_stop_minor' : 'two_way_stop_major';
  else if (node.control === 'traffic_circle') rule = 'traffic_circle';
  else rule = 'uncontrolled';
  const e = cap[rule];
  return { cap: e.perApproach !== undefined ? e.perApproach : (e.perLane ?? 0) * lanes, rule };
}

// ---------- the fit ----------
export interface AssignConfig {
  /** 'free': free-flow all-or-nothing paths over perturbed link costs; 'msa': stochastic capacity-restrained assignment by successive averages. */
  method: 'free' | 'msa';
  /** msa: passes, driver walks per flow and pass, BPR alpha and beta, walk noise, and how often the table is refitted and reassigned at its own volumes. */
  iterations: number; drawsPerPass: number; alpha: number; beta: number; noise: number; rounds: number;
}

export interface FitConfig {
  fit: FitOptions;
  assignment?: AssignConfig;
  /** Observed route shares as soft ratio constraints (weight below the counts: they come from a device sample); omitted or `weight` 0 leaves them out. */
  shares?: { targets: Targets; weight: number; pmPeriod: string };
  /** Peak-hour volumes on the select-link blocks implied by the ramp counts and the observed shares (DERIVED), as soft volume constraints; weight below the counts. */
  implied?: { weight: number };
  /** Measured mean delay per vehicle (s) on every link, per period, from a simulator run (`tools/cost-loop.ts`); omitted: free-flow and BPR costs only. */
  measured?: { delayS: Record<string, number[]>; alpha: number; source: string };
  draws: number; noise: number;
  guard: { enabled: boolean; excessShare: number; weight: number; capacity: CapTable };
}

export interface PeriodResult {
  id: string;
  /** New volume per input flow (same order). */
  volume: number[];
  totals: Record<string, { start: number; afterFit: number; final: number }>;
  stationRows: { st: Station; target: number; before: number; afterFit: number; final: number }[];
  fit: ReturnType<typeof fitToCounts>;
  gFinal: number[];
  counted: Uint8Array;
  types: FlowType[];
  guardBound: { link: number; name: string; rule: string; cap: number; before: number; after: number }[];
  guardRemoved: number;
  guardFlows: number;
  residualOver: { link: number; name: string; vol: number; limit: number }[];
  /** Share constraints: target, share of the offered table, after the count-only fit, final. */
  /** Validation-only stations: assigned volume before, after the count fit and final (never fitted). */
  heldRows: { st: Station; target: number; before: number; afterFit: number; final: number }[];
  impliedRows: { iv: ImpliedVolume; before: number; afterFit: number; final: number }[];
  shareRows: { spec: ShareSpec; offered: number; afterFit: number; final: number; n: number }[];
  unroutable: number;
  graphBans: number;
  cons: number;
  notes: string[];
  /** The assignment the table was last fitted to (flow k loads links `link[start[k] .. start[k+1]]` with `share`). */
  assignment: Assignment;
}

export function fitPeriod(
  id: string, flows: FlowIn[], types: FlowType[], stations: Station[], nodes: ANode[], links: NetLinkIn[], bans: ATurnBan[], cfg: FitConfig,
): PeriodResult {
  const g: Graph = buildGraph(nodes, links, bans, id);
  const nodeBy = new Map(nodes.map((n) => [n.id, n]));
  const v0 = flows.map((f) => f.vehPerHour);
  const nL = links.length;
  const ruleOf: { cap: number; rule: string }[] = links.map((l, i) => linkCapacity(l, nodeBy.get(l.to)!, g.minor[i], cfg.guard.capacity));
  const as = cfg.assignment ?? { method: 'free' as const, iterations: 1, drawsPerPass: cfg.draws, alpha: 0, beta: 4, noise: cfg.noise, rounds: 1 };
  // Measured delay: the simulator's mean time lost per vehicle on a link. The control delay the router already adds at the end of the link
  // (signal 10 s, all-way stop 6 s, minor stop approach 5 s, circle 3 s) is taken out so a queue at a signal is not counted twice (ASSUMPTION).
  const dl = cfg.measured?.delayS[id];
  const ctrlS = (l: number) => { const c = nodeBy.get(links[l].to)!.control; return c === 'signal' ? SIM_ROUTE_PARAMS.delaySignalS : c === 'all_way_stop' ? SIM_ROUTE_PARAMS.delayAllwayS : c === 'two_way_stop' ? (g.minor[l] ? SIM_ROUTE_PARAMS.delayMinorS : 0) : c === 'traffic_circle' ? SIM_ROUTE_PARAMS.delayCircleS : 0; };
  const extra = dl && dl.length === nL ? links.map((l, i) => Math.max(0, dl[i] - ctrlS(i)) * (l.class === 'residential' || l.class === 'service' ? SIM_ROUTE_PARAMS.localCostFactor : 1)) : undefined;
  const alphaUse = extra && cfg.measured ? cfg.measured.alpha : as.alpha;
  const assignAt = (vol: ArrayLike<number>): Assignment => (as.method === 'msa'
    ? assignMsa(g, flows, vol, { iterations: as.iterations, drawsPerPass: as.drawsPerPass, alpha: alphaUse, beta: as.beta, noise: as.noise, capacity: ruleOf.map((r) => r.cap), extraCost: extra, features })
    : assign(g, flows, cfg.draws, cfg.noise, features));
  const features: Feature[] = [], featOf = new Map<string, number>();
  for (const s of stations) if (s.feature && (s.target[id] ?? 0) > 0) { featOf.set(s.id, features.length); features.push(s.feature); }
  const toCons = (s: Station): Constraint => ({ id: s.id, kind: s.kind, label: s.label, links: s.links, origins: s.origins, destinations: s.destinations, target: s.target[id], weight: s.weightByPeriod?.[id] ?? s.weight, feature: featOf.get(s.id) });
  const heldCons: Constraint[] = stations.filter((s) => s.held && (s.target[id] ?? 0) > 0).map(toCons);
  const countCons: Constraint[] = stations.filter((s) => !s.held && !s.cvExclude && (s.target[id] ?? 0) > 0).map(toCons);
  const sumBy = (f: ArrayLike<number>) => { const o: Record<string, number> = { through: 0, local: 0, ramp: 0 }; for (let k = 0; k < f.length; k++) o[types[k]] += f[k]; return o; };
  const exempt = new Set<number>();
  for (const c of countCons) for (const l of c.links) exempt.add(l);
  const limit = new Float64Array(nL).fill(Infinity);
  links.forEach((_, l) => { if (!exempt.has(l)) limit[l] = (1 + cfg.guard.excessShare) * ruleOf[l].cap; });
  const rounds = as.method === 'msa' ? Math.max(1, as.rounds) : 1;
  let a = assignAt(v0);
  let cons: Constraint[] = countCons, specs: ShareSpec[] = [];
  let implied: ImpliedVolume[] = [];
  let r1!: ReturnType<typeof fitToCounts>, rFinal!: ReturnType<typeof fitToCounts>, f1: number[] = [], fFinal: number[] = [];
  let before: number[] = [], afterFit: number[] = [], V1!: Float64Array;
  for (let round = 1; round <= rounds; round++) {
    if (round > 1) a = assignAt(fFinal.map((x, k) => (a.routable[k] ? x : v0[k])));
    specs = cfg.shares && cfg.shares.weight > 0 ? buildShareConstraints(nodes, links as ShareLink[], cfg.shares.targets, a, id, cfg.shares.pmPeriod, cfg.shares.weight) : [];
    const shareCons: Constraint[] = specs.map((q) => ({ id: q.id, kind: 'share', label: q.label, links: [], target: q.target, weight: q.weight, ratio: q.ratio }));
    const rampTargets = stations.filter((q) => q.kind === 'ramp' && (q.target[id] ?? 0) > 0).map((q) => ({ links: q.links, target: q.target[id] }));
    implied = cfg.shares && cfg.implied && cfg.implied.weight > 0 ? impliedVolumes(nodes, links as ShareLink[], cfg.shares.targets, a, v0, id, cfg.shares.pmPeriod, rampTargets) : [];
    const impliedCons: Constraint[] = implied.map((q) => ({ id: q.id, kind: 'derived', label: q.label, links: [q.link], target: q.target, weight: cfg.implied!.weight }));
    cons = [...countCons, ...impliedCons, ...shareCons];
    before = assigned(a, v0, cons, nL);
    // Counts only (no guard, no shares): the "after count fit" column.
    r1 = fitToCounts(a, v0, types, countCons, nL, cfg.fit);
    f1 = v0.map((v, k) => v * r1.g[k]);
    afterFit = assigned(a, f1, cons, nL);
    V1 = linkVolumes(a, f1, nL);
    // Counts, guard and shares together. The guard is a set of soft upper limits with weight < 1 on uncounted links, so a count wins any conflict.
    if (cfg.guard.enabled || shareCons.length) rFinal = fitToCounts(a, v0, types, cons, nL, cfg.fit, undefined, cfg.guard.enabled ? { limit, weight: cfg.guard.weight } : undefined);
    else rFinal = r1;
    fFinal = v0.map((v, k) => v * rFinal.g[k]);
  }
  const guardBound: PeriodResult['guardBound'] = [];
  const notes: string[] = [];
  let residualOver: PeriodResult['residualOver'] = [];
  if (extra && cfg.measured) notes.push(`link costs include the simulator's measured delay per vehicle (${cfg.measured.source}; mean ${(extra.reduce((x, y) => x + y, 0) / nL).toFixed(1)} s per link after the control delay is removed, BPR alpha ${cfg.measured.alpha})`);
  if (as.method === 'msa') notes.push(`assignment by successive averages (${as.iterations} passes x ${as.drawsPerPass} driver walks, BPR alpha ${as.alpha} beta ${as.beta}, noise ${(as.noise * 100).toFixed(0)}%), ${rounds} round(s) with the table refitted and reassigned at its own volumes; relative link-volume change at the last pass ${(a as ReturnType<typeof assignMsa>).relChange?.toFixed(3)}`);
  if (cfg.guard.enabled) {
    const V2 = linkVolumes(a, fFinal, nL);
    for (let l = 0; l < nL; l++) if (V1[l] > limit[l]) guardBound.push({ link: l, name: links[l].name || '(unnamed)', rule: ruleOf[l].rule, cap: ruleOf[l].cap, before: V1[l], after: V2[l] });
    guardBound.sort((x, y) => y.before / y.cap - x.before / x.cap);
    residualOver = [...V2.keys()].filter((l) => V2[l] > limit[l] * (1 + 1e-3)).map((l) => ({ link: l, name: links[l].name || '(unnamed)', vol: V2[l], limit: limit[l] })).sort((x, y) => y.vol / y.limit - x.vol / x.limit);
    notes.push(`the guard cut ${rFinal.freeCut?.toFixed(0) ?? 0} veh/h from flows that touch no count (after the median rule)`);
  }
  let guardFlows = 0;
  for (let k = 0; k < flows.length; k++) if (fFinal[k] < f1[k] * 0.999) guardFlows++;
  const final = assigned(a, fFinal, cons, nL);
  const volume = fFinal.map((x, k) => (a.routable[k] ? x : v0[k]));
  const t0 = sumBy(v0), t1 = sumBy(f1), t2 = sumBy(volume);
  const totals: PeriodResult['totals'] = {};
  for (const t of ['through', 'local', 'ramp']) totals[t] = { start: t0[t], afterFit: t1[t], final: t2[t] };
  const byId = new Map(cons.map((c, i) => [c.id, i]));
  const shareRows = specs.map((q) => { const i = byId.get(q.id)!; return { spec: q, offered: before[i], afterFit: afterFit[i], final: final[i], n: q.ratio.flows.length }; });
  const impliedRows = implied.map((iv) => { const i = byId.get(iv.id)!; return { iv, before: before[i], afterFit: afterFit[i], final: final[i] }; });
  const heldIdx = heldCons.length ? { b: assigned(a, v0, heldCons, nL), f1: assigned(a, f1, heldCons, nL), f: assigned(a, fFinal, heldCons, nL) } : null;
  const heldRows = heldCons.map((c, i) => ({ st: stations.find((q) => q.id === c.id)!, target: c.target, before: heldIdx!.b[i], afterFit: heldIdx!.f1[i], final: heldIdx!.f[i] }));
  const stationRows = stations.filter((s) => byId.has(s.id)).map((s) => { const i = byId.get(s.id)!; return { st: s, target: cons[i].target, before: before[i], afterFit: afterFit[i], final: final[i] }; });
  const guardRemoved = Object.values(totals).reduce((x, q) => x + q.afterFit - q.final, 0);
  return { id, volume, totals, stationRows, fit: rFinal, gFinal: [...rFinal.g], counted: rFinal.counted, types, guardBound, guardRemoved, guardFlows, residualOver, shareRows, heldRows, impliedRows, unroutable: [...a.routable].filter((x) => !x).length, graphBans: g.banned, cons: countCons.length, notes, assignment: a };
}

// ---------- report ----------
const f0 = (v: number) => Math.round(v).toLocaleString('en-US').replace(/,/g, '');
const pctOf = (a: number, b: number) => (b > 0 ? `${((100 * a) / b).toFixed(0)}%` : '-');
export function percentiles(vals: number[], w: number[], ps: number[]): number[] {
  return ps.map((p) => {
    if (!vals.length) return NaN;
    const idx = vals.map((_, i) => i).sort((x, y) => vals[x] - vals[y]);
    const tot = idx.reduce((s, i) => s + w[i], 0);
    let acc = 0;
    for (const i of idx) { acc += w[i]; if (acc >= (p / 100) * tot) return vals[i]; }
    return vals[idx[idx.length - 1]];
  });
}

export function fitReport(area: string, results: PeriodResult[], flowsBy: Record<string, FlowIn[]>, opt: { fit: FitOptions; draws: number; noise: number; guardExcess: number; guardWeight: number; guardOn: boolean; tolOk: number; shareWeight?: number; assignment?: AssignConfig; links?: { name: string; fromBearing?: number; inStudyArea?: boolean }[]; composition?: string[] }, stationNotes: string[], extra: string[]): string {
  const L: string[] = [];
  L.push(`# Count-constrained demand fit: ${area}`, '', 'Generated by `tools/build-demand.ts` (do not edit). Car trips only, veh/h. Method and assumptions: `data/demand/README.md`, section "Count-constrained demand".', '');
  const asg = opt.assignment?.method === 'msa' ? `capacity-restrained assignment by successive averages (${opt.assignment.iterations} passes x ${opt.assignment.drawsPerPass} driver walks, BPR alpha ${opt.assignment.alpha} beta ${opt.assignment.beta}, walk noise +/-${(opt.assignment.noise * 100).toFixed(0)}%, ${opt.assignment.rounds} round(s))` : `static assignment over ${opt.draws} perturbed free-flow shortest paths (cost noise +/-${(opt.noise * 100).toFixed(0)}%)`;
  L.push(`Settings: factor bounds ${opt.fit.lo} to ${opt.fit.hi}, damping ${opt.fit.damping}, tolerance ${(100 * (Math.exp(opt.fit.tol) - 1)).toFixed(1)}% on the unblocked count stations, at most ${opt.fit.maxIter} iterations; flows that touch no count take the ${opt.fit.uncounted} factor${opt.fit.volumeWeightedMedian ? ' (volume-weighted median)' : ''}; ${asg}; route-share constraints ${opt.shareWeight ? `on, weight ${opt.shareWeight} (counts 1 to 2)` : 'off'}; capacity guard ${opt.guardOn ? `on (limit = capacity x ${(1 + opt.guardExcess).toFixed(2)}, uncounted links only; an ASSUMPTION-labeled sanity rule, not data)` : 'off'}.`, '');
  L.push('## Offered car trips, before and after', '', '| Period | Type | Offered (build) | After count fit | After guard (final) | Removed by fit | Removed by guard | Final / offered |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of results) {
    let s0 = 0, s1 = 0, s2 = 0;
    for (const t of ['through', 'local', 'ramp']) {
      const q = r.totals[t];
      s0 += q.start; s1 += q.afterFit; s2 += q.final;
      L.push(`| ${r.id} | ${t} | ${f0(q.start)} | ${f0(q.afterFit)} | ${f0(q.final)} | ${f0(q.start - q.afterFit)} | ${f0(q.afterFit - q.final)} | ${pctOf(q.final, q.start)} |`);
    }
    L.push(`| ${r.id} | **all** | ${f0(s0)} | ${f0(s1)} | ${f0(s2)} | ${f0(s0 - s1)} | ${f0(s1 - s2)} | ${pctOf(s2, s0)} |`);
  }
  L.push('', '## Fit status and per-flow factors', '', 'Factor = final volume / offered volume of a flow. Percentiles are volume-weighted over the offered volume. "At bound" counts flows on a counted link whose factor sits on the lower or upper bound.', '');
  L.push('| Period | Flows | Touch a count | Iterations | Stopped by | Worst error, unblocked stations | Worst error, all stations | Stations outside tolerance | Flows at lower bound | Flows at upper bound | Stations no flow crosses | Unroutable flows |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  const stopText = (x: PeriodResult['fit']) => (x.stoppedBy === 'tolerance' ? 'tolerance (blocked and tense stations excluded)' : x.stoppedBy === 'stalled' ? 'stalled (no gain over the window)' : x.stoppedBy === 'stationary' ? 'no factor moving' : 'iteration limit');
  const rel = (e: number) => `${(100 * (Math.exp(Math.abs(e)) - 1)).toFixed(1)}%`;
  for (const r of results) L.push(`| ${r.id} | ${flowsBy[r.id].length} | ${[...r.counted].filter(Boolean).length} | ${r.fit.iterations} | ${stopText(r.fit)} | ${rel(r.fit.maxLogErr)} | ${rel(r.fit.maxLogErrAll)} | ${r.fit.conflicts.length} | ${r.fit.atLo} | ${r.fit.atHi} | ${r.fit.unreachable.length ? r.fit.unreachable.join('; ') : 'none'} | ${r.unroutable} |`);
  L.push('', 'Errors are relative (assigned / target - 1 in size). "Unblocked" leaves out stations that cannot move (their flows sit on a bound) or are in tension with another station; both kinds are listed under "Stations that cannot be met" below.');
  L.push('', '| Period | Group | Flows | p5 | p25 | median | p75 | p95 |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of results) {
    const fl = flowsBy[r.id];
    for (const grp of ['counted', 'uncounted'] as const) for (const t of ['through', 'local', 'ramp']) {
      const ks = fl.map((_, k) => k).filter((k) => (r.counted[k] ? 'counted' : 'uncounted') === grp && r.types[k] === t && fl[k].vehPerHour > 0);
      if (!ks.length) continue;
      const p = percentiles(ks.map((k) => r.volume[k] / fl[k].vehPerHour), ks.map((k) => fl[k].vehPerHour), [5, 25, 50, 75, 95]);
      L.push(`| ${r.id} | ${grp} ${t} | ${ks.length} | ${p.map((x) => x.toFixed(2)).join(' | ')} |`);
    }
  }
  L.push('', `Uncounted-flow rule medians (factor given to flows touching no count, by type): ${results.map((r) => `${r.id} ${['through', 'local', 'ramp'].map((t) => `${t} ${r.fit.medians[t].toFixed(2)}`).join(', ')}`).join('; ')}. These are the medians of the counted flows before the guard's ceilings apply to them.`);
  if (results.some((r) => r.shareRows.length)) {
    L.push('', '## Route shares', '', 'Observed shares are StreetLight device-sample estimates (`data/calibration/README.md`). Modeled = share in the static assignment: offered table, after the count-only fit, final (counts, guard and shares together). "Flows" = flows that cross the select link or use the ramp. Select link: share of the link\'s volume from trips with a freeway end. Ramp: share of the volume using the ramp that also uses the named street (the shares are for trips from / to the north of the ramps).', '');
    L.push('| Period | Share | Observed | Offered | Count-only fit | Final | Flows |', '| --- | --- | --- | --- | --- | --- | --- |');
    const pc = (x: number) => (Number.isNaN(x) ? 'n/a' : `${(100 * x).toFixed(0)}%`);
    for (const r of results) for (const q of r.shareRows) L.push(`| ${r.id} | ${q.spec.label} | ${pc(q.spec.target)} | ${pc(q.offered)} | ${pc(q.afterFit)} | ${pc(q.final)} | ${q.n} |`);
  }
  L.push('', '## Station fit by family', '', 'Within own tolerance = gates 10%, ramps 5%, turning-movement legs and Caltrans stations 15%. Ramp totals are the sums over counted ramps of the assigned freeway-link volume against ADT x K (off = freeway to surface, on = surface to freeway).', '');
  L.push('| Period | Family | Stations | Within own tolerance | Within +/-' + opt.tolOk + '% | Sum of targets | Sum assigned before | Sum assigned after the fit | Sum assigned final | Final / target |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of results) {
    const fam = (x: (typeof r.stationRows)[number]) => (x.st.kind === 'count' ? x.st.id.split(' ').slice(0, 2).join(' ') : x.st.kind === 'ramp' ? (x.st.id.startsWith('ramp off') ? 'ramp off' : 'ramp on') : x.st.kind === 'gate' ? (x.st.id.endsWith(' in') ? 'gate entering' : 'gate leaving') : x.st.kind);
    for (const name of [...new Set(r.stationRows.map(fam))].sort()) {
      const rows = r.stationRows.filter((x) => fam(x) === name);
      const sum = (f: (x: (typeof rows)[number]) => number) => rows.reduce((a, x) => a + f(x), 0);
      L.push(`| ${r.id} | ${name} | ${rows.length} | ${rows.filter((x) => Math.abs(x.final / x.target - 1) * 100 <= x.st.tolPct).length} | ${rows.filter((x) => Math.abs(x.final / x.target - 1) * 100 <= opt.tolOk).length} | ${f0(sum((x) => x.target))} | ${f0(sum((x) => x.before))} | ${f0(sum((x) => x.afterFit))} | ${f0(sum((x) => x.final))} | ${(sum((x) => x.final) / sum((x) => x.target)).toFixed(2)} |`);
    }
  }
  for (const r of results) {
    const rows = r.stationRows;
    const tol = (x: (typeof rows)[number]) => Math.abs(x.final / x.target - 1) * 100 <= x.st.tolPct;
    const okAll = rows.filter((x) => Math.abs(x.final / x.target - 1) * 100 <= opt.tolOk).length;
    L.push('', `## Stations, ${r.id}`, '', `${rows.length} stations with a target. Within +/-${opt.tolOk}%: before ${rows.filter((x) => Math.abs(x.before / x.target - 1) * 100 <= opt.tolOk).length}, after the fit ${rows.filter((x) => Math.abs(x.afterFit / x.target - 1) * 100 <= opt.tolOk).length}, final ${okAll}. Within their own tolerance (gates 10%, ramps 5%, others 15%): final ${rows.filter(tol).length}.`, '');
    L.push('| Station | Basis | Target | Assigned before | Ratio | After fit | Ratio | Final | Ratio | Own tolerance | GEH | GEH < 5 | Size band |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const x of rows.sort((p, q) => (p.st.kind === q.st.kind ? q.target - p.target : p.st.kind < q.st.kind ? -1 : 1))) L.push(`| ${x.st.label} | ${x.st.kind}${x.st.basis.includes('ASSUMPTION') ? ' (factor ASSUMPTION)' : ''} | ${f0(x.target)} | ${f0(x.before)} | ${(x.before / x.target).toFixed(2)} | ${f0(x.afterFit)} | ${(x.afterFit / x.target).toFixed(2)} | ${f0(x.final)} | ${(x.final / x.target).toFixed(2)} | ${tol(x) ? 'ok' : `OUTSIDE (${x.st.tolPct}%)`} | ${geh(x.final, x.target).toFixed(1)} | ${geh(x.final, x.target) < 5 ? 'yes' : 'NO'} | ${withinBand(x.final, x.target) ? 'yes' : 'NO'} |`);
    const fitted = evaluateCases(rows.map((x) => ({ id: x.st.id, modeled: x.final, counted: x.target })));
    const fs = summarizeCases(fitted);
    L.push('', `Fitted stations: GEH below 5 at ${fs.gehOk} of ${fs.n} (${(fs.gehShare * 100).toFixed(0)}%), size bands met at ${fs.bandOk} of ${fs.n} (${(fs.bandShare * 100).toFixed(0)}%); the published rule asks for more than 85% of cases (${fs.meets ? 'met' : 'not met'}). This is the static assignment against the counts it was fitted to, so it shows how far the fit could go; the simulator's own flows are scored in the calibration report.`);
    {
      const isBlock = (x: { st: Station }) => x.st.id.startsWith('count block');
      const sp = (xs: { st: Station; final: number; target: number }[]) => summarizeCases(evaluateCases(xs.map((x) => ({ id: x.st.id, modeled: x.final, counted: x.target }))));
      const fi = sp(rows.filter(isBlock)), fo = sp(rows.filter((x) => !isBlock(x)));
      const hi = sp(r.heldRows.filter(isBlock)), ho = sp(r.heldRows.filter((x) => !isBlock(x)));
      L.push('', `Split by kind, GEH below 5 (size bands): interior blocks of the volunteer count fitted ${fi.gehOk} of ${fi.n} (${(fi.gehShare * 100).toFixed(0)}%; bands ${(fi.bandShare * 100).toFixed(0)}%), held out ${hi.gehOk} of ${hi.n} (${(hi.gehShare * 100).toFixed(0)}%; bands ${(hi.bandShare * 100).toFixed(0)}%, mean GEH ${hi.meanGeh.toFixed(1)}); other stations (gates, ramps, Caltrans, turning-movement legs, movements and routes of the volunteer count) fitted ${fo.gehOk} of ${fo.n} (${(fo.gehShare * 100).toFixed(0)}%; bands ${(fo.bandShare * 100).toFixed(0)}%), held out ${ho.gehOk} of ${ho.n} (${(ho.gehShare * 100).toFixed(0)}%; bands ${(ho.bandShare * 100).toFixed(0)}%, mean GEH ${ho.meanGeh.toFixed(1)}).`);
    }
    if (r.heldRows.length) {
      const hr = evaluateCases(r.heldRows.map((x) => ({ id: x.st.label, modeled: x.final, counted: x.target })));
      const hs = summarizeCases(hr);
      L.push('', `### Held-out stations, ${r.id}`, '', `${hs.n} validation stations, not in the fit: GEH below 5 at ${hs.gehOk} (${(hs.gehShare * 100).toFixed(0)}%), size bands met at ${hs.bandOk} (${(hs.bandShare * 100).toFixed(0)}%), mean GEH ${hs.meanGeh.toFixed(1)} (fitted stations ${fs.meanGeh.toFixed(1)}). Required: more than 85% of cases (${hs.meets ? 'met' : 'not met'}).`, '', '| Station | Corridor | Target | Assigned before | Final | Ratio | GEH | GEH < 5 | Size band |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
      for (const x of [...r.heldRows].sort((p, q) => q.target - p.target)) L.push(`| ${x.st.label} | ${corridorOf(x.st)} | ${f0(x.target)} | ${f0(x.before)} | ${f0(x.final)} | ${(x.final / x.target).toFixed(2)} | ${geh(x.final, x.target).toFixed(1)} | ${geh(x.final, x.target) < 5 ? 'yes' : 'NO'} | ${withinBand(x.final, x.target) ? 'yes' : 'NO'} |`);
    }
  }
  if (results.some((r) => r.impliedRows.length)) {
    L.push('', '## Volumes implied by the ramp counts and the observed shares (DERIVED)', '', 'Freeway-related volume on a street = ramp volume x the street\'s share of the ramp trips; total volume = that / the share of the street\'s traffic that is freeway-related. The ramp via-street shares are of the trips from (to) the north side or of all ramp trips; the file does not say, so both readings are computed (B: side fraction from the offered table, A: all) and the soft target is the midpoint. Only the named ramps feed the numerator, so the totals are lower bounds when other ramps feed the street. Weight below the counts.', '');
    for (const r of results) {
      if (!r.impliedRows.length) continue;
      L.push(`### ${r.id}`, '', '| Block | Arithmetic | Implied (B to A) | Target | Assigned before | After the count fit | Final |', '| --- | --- | --- | --- | --- | --- | --- |');
      for (const x of r.impliedRows) L.push(`| ${x.iv.label} | ${x.iv.arithmetic} | ${f0(x.iv.volumeB)} to ${f0(x.iv.volumeA)} | ${f0(x.iv.target)} | ${f0(x.before)} | ${f0(x.afterFit)} | ${f0(x.final)} |`);
      L.push('');
    }
  }
  if (opt.composition?.length && opt.links) {
    L.push('', '## Who uses the interior streets: composition of the assigned traffic', '', 'Mean assigned volume per block (veh/h) on the links of a street inside the study area, by the kind of trip that loads it: local-end (one end at a block of the area or the model, the other at a gate), through (gate to gate, no local end) and freeway-related (one end on the freeway). Offered = the table before the fit, final = the table that ships. Directions by link bearing (north half or south half).', '', '| Period | Street | Direction | Links | Offered local-end | Offered through | Offered freeway | Offered total | Final local-end | Final through | Final freeway | Final total |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const r of results) {
      const a = r.assignment, fl = flowsBy[r.id];
      for (const street of opt.composition) for (const dir of ['N', 'S'] as const) {
        const ls = opt.links.map((l, i) => ({ l, i })).filter(({ l }) => l.name === street && l.inStudyArea !== false && ((((l.fromBearing ?? 0) + 90) % 360 < 180) === (dir === 'N'))).map(({ i }) => i);
        if (!ls.length) continue;
        const set = new Set(ls);
        const off: Record<string, number> = { local: 0, through: 0, ramp: 0 }, fin: Record<string, number> = { local: 0, through: 0, ramp: 0 };
        for (let k = 0; k < fl.length; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) if (set.has(a.link[i])) { off[r.types[k]] += fl[k].vehPerHour * a.share[i]; fin[r.types[k]] += r.volume[k] * a.share[i]; }
        const n = ls.length, sum = (o: Record<string, number>) => o.local + o.through + o.ramp;
        L.push(`| ${r.id} | ${street} | ${dir === 'N' ? 'north half' : 'south half'} | ${n} | ${f0(off.local / n)} | ${f0(off.through / n)} | ${f0(off.ramp / n)} | ${f0(sum(off) / n)} | ${f0(fin.local / n)} | ${f0(fin.through / n)} | ${f0(fin.ramp / n)} | ${f0(sum(fin) / n)} |`);
      }
    }
    L.push('');
  }
  L.push('', '## Stations that cannot be met', '', 'A station is listed when it ends more than 5% off its target. Pinned = share of its assigned volume on flows sitting on the bound it would need to move (lower bound when it is too high, upper bound when too low). Opposing = stations that pull the same flows the other way (size of the error, volume the two share).', '');
  for (const r of results) {
    const rows = r.fit.conflicts.filter((c) => Math.abs(Math.exp(c.logErr) - 1) > 0.05);
    L.push(`### ${r.id}`, '');
    if (!rows.length) { L.push('None.', ''); continue; }
    L.push(`${rows.length} stations; the ${Math.min(rows.length, 20)} furthest from their target are listed (the full list of every station is in the table of its period above).`, '', '| Station | Target | Assigned | Error | Pinned | Opposing stations |', '| --- | --- | --- | --- | --- | --- |');
    for (const c of rows.slice(0, 20)) L.push(`| ${c.label} | ${f0(c.target)} | ${f0(c.assigned)} | ${(100 * (c.assigned / c.target - 1)).toFixed(0)}% | ${c.bound === 'none' ? `${(100 * c.pinned).toFixed(0)}%` : `${(100 * c.pinned).toFixed(0)}% at the ${c.bound === 'hi' ? 'upper' : 'lower'} bound`} | ${c.opposing.slice(0, 2).map((o) => `${o.label.slice(0, 70)} (${Number.isNaN(o.logErr) ? 'guard' : `${(100 * (Math.exp(-o.logErr) - 1)).toFixed(0)}%`}, ${f0(o.sharedVeh)} veh/h)`).join('; ') || '-'} |`);
    L.push('');
  }
  L.push('', '## Capacity guard', '');
  for (const r of results) {
    L.push(`### ${r.id}`, '', `The guard removed ${f0(r.guardRemoved)} veh/h net compared with the count-only fit; ${r.guardFlows} flows are more than 0.1% smaller. Links the count-only solution puts above capacity x ${(1 + opt.guardExcess).toFixed(2)} (${r.guardBound.length}), worst first, up to 20, with the volume after the guard:`, '');
    if (r.guardBound.length) {
      L.push('| Link | Street | Rule | Capacity | Assigned before | After |', '| --- | --- | --- | --- | --- | --- |');
      for (const b of r.guardBound.slice(0, 20)) L.push(`| ${b.link} | ${b.name} | ${b.rule} | ${f0(b.cap)} | ${f0(b.before)} | ${f0(b.after)} |`);
    }
    L.push('', `After the final count refit ${r.residualOver.length} uncounted link(s) remain above their limit${r.residualOver.length ? ` (worst: ${r.residualOver.slice(0, 5).map((x) => `link ${x.link} ${x.name} ${f0(x.vol)} against ${f0(x.limit)}`).join('; ')})` : ''}; counted flows use them and the counts (weight 1) won over the guard (weight ${opt.guardWeight}).`, '');
  }
  L.push('## Notes', '', ...stationNotes.map((n) => `- ${n}`), ...results.flatMap((r) => r.notes.map((n) => `- ${r.id}: ${n}`)), '', ...extra);
  return L.join('\n') + '\n';
}
