// Count-constrained demand: count stations as link constraints, static assignment, matrix adjustment and the capacity guard
// (baseline-calibration, seventh round). Orchestration and report for tools/build-demand.ts. No I/O.
import { reverseCountDirection, type CountDirection } from './gate-count';
import { geh, withinBand, evaluateCases, summarizeCases } from './acceptance';
import { SIM_ROUTE_PARAMS, assign, assignMsa, buildGraph, linkVolumes, type ALink, type ANode, type ATurnBan, type Assignment, type Feature, type Graph } from './assign';
import { assigned, fitToCounts, type Constraint, type FitOptions, type FlowType } from './fit-counts';
import { controlDelayArray, type ControlDelayFile } from './control-delays';
import { sourceYearLines, type RecencyConfig } from './recency';
import { heldStationIds, observationOfKey, type SplitManifest, type SplitStation } from './lineage';
import { routeShareTally, impliedVolumes, type ImpliedVolume, type ShareSpec, type Targets } from './share-targets';

export interface NetLinkIn extends ALink { name: string; lanes?: number; inStudyArea?: boolean }
/** `via`: an assumed movement flow (link positions a, b); its volume is pinned in the fit. `maxDetour` and `alternatives` are read by the simulator (ASSUMPTION). */
export interface FlowIn { origin: number; destination: number; vehPerHour: number; mode?: string; via?: { a: number; b: number; maxDetour?: number; alternatives?: { a: number; b: number }[] } }

export type DetectorEnd = 'start' | 'stop';

export interface Station {
  id: string;
  kind: 'gate' | 'tmc' | 'caltrans' | 'ramp' | 'count' | 'gate-prior';
  label: string;
  /** DATA, or DATA with an ASSUMPTION factor (what the factor is). */
  basis: string;
  links: number[];
  /** Measurement at each directed link, in the same order as links. Interior block counts use the link-use proxy. */
  detectors?: DetectorEnd[];
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
  /** Periods whose target is a scaled copy of another period's count, not a count (ASSUMPTION); the station rule leaves them out. */
  derived?: string[];
  /** A turning movement or path count: constrains the share of routes that have the feature, `links` is empty. */
  feature?: Feature;
  /** Weight in a period where it differs from `weight`. */
  weightByPeriod?: Record<string, number>;
  /** Corridor for the hold-out and the corridor ratios, when the station brings its own (volunteer-count blocks: their street). */
  corridor?: string;
  /** Source family (id used by the recency rule and the reports) and the count year of the source (mean of its count years); null when the year is not known. */
  source?: string;
  year?: number | null;
  /** The count is of a freeway ramp (Caltrans ramp row or the ramp leg of an intersection count). */
  ramp?: boolean;
  /** Taken out of every fit by the recency rule and scored as held out. */
  outOfFit?: boolean;
  /** Source observations the target derives from (lineage.ts); defaults to the record keys without direction. */
  observations?: string[];
  /** One-sided station: the constraint acts only while the assigned volume is above this value (then it pulls toward `target`). Used by the gate prior ceilings (round 49). */
  ceiling?: number;
}

/** Source observations of a station: stations that share one are one dependency group in the validation split. */
export function stationObservations(st: Pick<Station, 'records' | 'observations'>): string[] {
  return st.observations?.length ? st.observations : [...new Set(st.records.map((r) => observationOfKey(r.key)))];
}

export interface GateIn { id: number; kind: string; street: string | null; source: string; /** Source record of the count (TMC leg or Caltrans station) and the share of it this gate takes in each direction. */ record?: string; inflowDirection?: CountDirection; sourceId?: string; year?: number | null; shareIn?: number; shareOut?: number; inT: Record<string, number>; outT: Record<string, number>; /** Gates that split one count (same street, close together, same source) share a group key. */ group?: string }
export interface TmcIn { id: string; year?: number | null; x: number; y: number; legs: Record<string, { entering: number; leaving: number }>; legStreets: Record<string, string> }
export interface RampIn { kind: 'off' | 'on'; surface: number; streets: string[]; adt: number; adtKind: string; source: string; /** Source-observation ids of the published rows (lineage.ts). */ rows?: string[]; year?: number | null }
export interface OverrideIn { street: string; adt: number; factor?: number; x: number; y: number; source: string; year?: number | null }

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
    const rec = (list: GateIn[], inflow: boolean) => {
      const byRecord = new Map<string, number>();
      for (const g of list) {
        if (!g.record) continue;
        const dir = g.inflowDirection ?? 'entering';
        const key = g.record + '|' + (inflow ? dir : reverseCountDirection(dir));
        const share = (inflow ? g.shareIn : g.shareOut) ?? 1;
        if (share > 0) byRecord.set(key, (byRecord.get(key) ?? 0) + share);
      }
      return [...byRecord].map(([key, share]) => ({ key, share }));
    };
    if (o.length && s.periodIds.some((p) => inT[p] > 0)) out.push({ id: gs.length > 1 ? `gate group ${key} in` : `gate ${first.id} in`, kind: 'gate', label: `${tag} ${nameOf(s, (outIdx.get(o[0].id) ?? [])[0])} entering`, basis, links: [], origins: o.map((g) => g.id), target: inT, weight: W.gate ?? 1, tolPct: T.gate ?? 10, records: rec(o, true), source: first.sourceId, year: first.year });
    if (i.length && s.periodIds.some((p) => outT[p] > 0)) out.push({ id: gs.length > 1 ? `gate group ${key} out` : `gate ${first.id} out`, kind: 'gate', label: `${tag} ${nameOf(s, (inIdx.get(i[0].id) ?? [])[0])} leaving`, basis, links: [], destinations: i.map((g) => g.id), target: outT, weight: W.gate ?? 1, tolPct: T.gate ?? 10, records: rec(i, false), source: first.sourceId, year: first.year });
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
      if (ins.length) out.push({ id: `tmc ${c.id} ${leg} entering`, kind: 'tmc', label: `${c.id} ${leg} leg entering`, basis, links: ins, detectors: ins.map(() => 'stop'), target: per((p) => tot(p) * shares(p)), weight: W.tmc ?? 1, tolPct: T.tmc ?? 15, records: [{ key: `tmc ${c.id}|${leg}|entering`, share: 1 }], source: 'oakland-tmc', year: c.year });
      if (outs.length) out.push({ id: `tmc ${c.id} ${leg} leaving`, kind: 'tmc', label: `${c.id} ${leg} leg leaving`, basis, links: outs, detectors: outs.map(() => 'start'), target: per((p) => tot(p) * (1 - shares(p))), weight: W.tmc ?? 1, tolPct: T.tmc ?? 15, records: [{ key: `tmc ${c.id}|${leg}|leaving`, share: 1 }], source: 'oakland-tmc', year: c.year });
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
        records: [{ key: `ov ${o.source}|${k === 'in' ? 'entering' : 'leaving'}`, share: 1 }], source: 'caltrans-aadt', year: o.year,
      });
    }
  }

  // 4. Ramps with a published ADT: the freeway-class link at the ramp's surface node.
  for (const r of s.ramps) {
    if (r.adtKind !== 'DATA') continue;
    const idx = (r.kind === 'off' ? inIdx : outIdx).get(r.surface) ?? [];
    const ls = idx.filter((i) => s.links[i].class === 'motorway');
    if (!ls.length) continue;
    out.push({ id: `ramp ${r.kind} ${r.surface}`, kind: 'ramp', label: `${r.kind}-ramp at node ${r.surface} (${r.streets.join(' / ') || 'unnamed'})`, basis: `DATA (Caltrans ramp ADT ${Math.round(r.adt)}; ${r.source})`, links: ls, detectors: ls.map(() => r.kind === 'off' ? 'stop' : 'start'), target: per((p) => r.adt * s.rampKFactor * s.periodFactors[p].volume), weight: W.ramp ?? 1, tolPct: T.ramp ?? 5, records: [{ key: `ramp ${r.kind} ${r.surface}`, share: 1 }], source: 'caltrans-ramp', year: r.year, ...(r.rows?.length ? { observations: r.rows } : {}) });
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

/** What the validation split sees of a station: ids, corridor and source observations, never values (lineage.ts). */
export function splitStationOf(st: Station): SplitStation {
  return { id: st.id, corridor: corridorOf(st), observations: stationObservations(st) };
}

/** Mark the validation stations from a frozen split manifest (design D17; protect-calibration-evidence D1). Returns the held ids. */
export function applySplit(stations: Station[], manifest: SplitManifest): string[] {
  const held = heldStationIds(manifest);
  for (const s of stations) s.held = held.has(s.id);
  return stations.filter((s) => s.held).map((s) => s.id);
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
  /** msa: passes, draws of perceived costs per pass, BPR alpha and beta, route-choice dispersion (s), and how often the table is refitted and reassigned at its own volumes. */
  iterations: number; drawsPerPass: number; alpha: number; beta: number; dispersion: number; rounds: number;
}

export interface FitConfig {
  fit: FitOptions;
  assignment?: AssignConfig;
  /** Observed route shares as soft ratio constraints (weight below the counts: they come from a device sample); omitted or `weight` 0 leaves them out. */
  shares?: { targets: Targets; weight: number; pmPeriod: string };
  /** Peak-hour volumes on the select-link blocks implied by the ramp counts and the observed shares (DERIVED), as soft volume constraints; weight below the counts. */
  implied?: { weight: number };
  /** Measured mean delay per vehicle (s) on every link, per period, from a simulator run (`tools/cost-loop.ts`); omitted: free-flow and BPR costs only. */
  /** `weight` scales the measured delay (1 when omitted): a damped step toward the simulator's costs, see `countFit.assignment.measured` in the demand config. */
  measured?: { delayS: Record<string, number[]>; alpha: number; source: string; weight?: number };
  /** Measured control delay per approach link (tools/control-delays.ts), already checked against the build; omitted: the constants of crates/sim/data/node-delays.json. */
  controlDelays?: ControlDelayFile;
  draws: number; dispersion: number;
  guard: { enabled: boolean; excessShare: number; weight: number; capacity: CapTable };
  /** Through-car targets on named street runs (calibration round 39); see `throughConstraints`. */
  through?: ThroughFit;
  /** Ceilings on the car totals of gates that no gate station counts, anchored on the static fit (calibration round 49, `countFit.gatePriorTotals`, off by default); see `gatePriorStations`. */
  gatePrior?: GatePriorConfig;
}

/** `tolerancePct` and `weight` are ASSUMPTIONS (a regularizer toward the static fit, no reference): 0 lets simulated membership move a gate's trips among pairs but add none; weight 10 is five times the ramp weight. `gateIds` are the network's gate nodes (surface gates and freeway mainline gates). */
export interface GatePriorConfig { tolerancePct: number; weight: number; gateIds: number[] }
export interface GatePriorRow { node: number; direction: 'origin' | 'destination'; street: string; anchor: number; ceiling: number; final: number }
export interface GatePriorReport { tolerancePct: number; weight: number; rows: GatePriorRow[]; /** Car veh/h of the static fit of the period (the anchor) and of the final fit, in all and by flow type. */ staticTotal: number; finalTotal: number; staticByType: Record<string, number>; finalByType: Record<string, number> }

/**
 * One-sided ceiling stations for the gate directions that no gate station holds in this period. A direction is covered when a station of kind 'gate'
 * that is in the fit (`counted`) names the node as an origin (entering) or a destination (leaving). For every other direction of every gate with trips,
 * the ceiling is the gate's car total in `flows` (the volumes of the static fit of the same view and period, so no count value is read) times
 * (1 + tolerancePct / 100). The station has no links and static membership 1 (every flow that starts, or ends, at the node), so it only caps the gate's total.
 */
export function gatePriorStations(id: string, flows: { origin: number; destination: number; vehPerHour: number }[], counted: Pick<Station, 'kind' | 'origins' | 'destinations'>[], cfg: GatePriorConfig, streetOf: (node: number) => string): Station[] {
  const coveredO = new Set<number>(), coveredD = new Set<number>();
  for (const q of counted) if (q.kind === 'gate') { for (const o of q.origins ?? []) coveredO.add(o); for (const d of q.destinations ?? []) coveredD.add(d); }
  const gate = new Set(cfg.gateIds), outV = new Map<number, number>(), inV = new Map<number, number>();
  for (const f of flows) {
    if (gate.has(f.origin)) outV.set(f.origin, (outV.get(f.origin) ?? 0) + f.vehPerHour);
    if (gate.has(f.destination)) inV.set(f.destination, (inV.get(f.destination) ?? 0) + f.vehPerHour);
  }
  const out: Station[] = [];
  const make = (node: number, direction: 'origin' | 'destination', total: number) => {
    const ceiling = total * (1 + cfg.tolerancePct / 100);
    out.push({
      id: `gate-prior ${direction} ${node}`, kind: 'gate-prior', label: `gate ${node} ${streetOf(node)} ${direction === 'origin' ? 'entering' : 'leaving'} (ceiling)`, basis: `ASSUMPTION (the gate's total in the static fit plus ${cfg.tolerancePct}%, no count)`,
      links: [], ...(direction === 'origin' ? { origins: [node] } : { destinations: [node] }), target: { [id]: ceiling }, ceiling, weight: cfg.weight, tolPct: cfg.tolerancePct, records: [],
    });
  };
  for (const node of [...cfg.gateIds].sort((x, y) => x - y)) {
    if ((outV.get(node) ?? 0) > 0 && !coveredO.has(node)) make(node, 'origin', outV.get(node)!);
    if ((inV.get(node) ?? 0) > 0 && !coveredD.has(node)) make(node, 'destination', inV.get(node)!);
  }
  return out;
}

/**
 * A through-car target: cars per hour with neither trip end in the study area that use any link of a street run, each car counted once (the calibrate
 * report's through figure). `target` is the central value; `lo` and `hi` bound the tolerance. A period listed in `ceiling` acts only above `hi`.
 */
export interface ThroughTarget { id: string; label: string; links: number[]; target: Record<string, number>; lo: Record<string, number>; hi: Record<string, number>; ceiling: string[]; derived: string[]; weight: number; basis: string }
/** Simulated through trips per origin-destination pair (`tools/through-membership.ts`): over `runs` seed runs, `hits[id]["o>d"]` trips of the pair counted on target `id`, `trips["o>d"]` trips of the pair offered (veh/h summed over the runs; only pairs with a counted trip). */
export interface ThroughMeasured { runs: number; source: string; hits: Record<string, Record<string, number>>; trips: Record<string, number>; /** Movement and route stations' pairs, all trips (round 41). */ stations?: ThroughMeasured }
/** `reportOnly`: the figures are reported, no constraint enters the fit (the table is the one built without targets). */
export interface ThroughFit { targets: ThroughTarget[]; inStudy: Set<number>; measured?: Record<string, ThroughMeasured>; priorTrips: number; reportOnly?: boolean; /** Station ids whose membership comes from the simulated pairs of `measured[period].stations`; 'all' takes every fitted station that has pairs there (calibration round 48). */ measuredStations?: string[] | 'all' }

/**
 * Per-flow proportions of a through target. Static: the share of the flow's assigned routes that use the run (through flows only). Measured: per pair, the
 * simulated through trips on the run over the trips offered, after the pinned flows' static share is taken out; the static share enters as a prior worth
 * `priorTrips` trips (ASSUMPTION), so a pair with few simulated trips stays near its static share.
 */
export function throughMembership(a: Assignment, flows: FlowIn[], feat: number, inStudy: Set<number>, m: ThroughMeasured | undefined, id: string, priorTrips: number, pinned: (k: number) => boolean): { stat: Float64Array; use: Float64Array } {
  const n = flows.length, stat = new Float64Array(n);
  if (a.feat) for (let k = 0; k < n; k++) {
    if (inStudy.has(flows[k].origin) || inStudy.has(flows[k].destination)) continue;
    for (let i = a.feat.start[k]; i < a.feat.start[k + 1]; i++) if (a.feat.id[i] === feat) stat[k] = Math.min(1, a.feat.share[i]);
  }
  return { stat, use: m ? measuredShare(stat, flows, m, id, priorTrips, pinned, (k) => inStudy.has(flows[k].origin) || inStudy.has(flows[k].destination)) : stat };
}

/** Static share of each flow's assigned routes on a link station's links (a route using two of them counts twice, as the link flow does). */
export function linkShare(a: Assignment, n: number, links: number[]): Float64Array {
  const set = new Set(links), stat = new Float64Array(n);
  for (let k = 0; k < n; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) if (set.has(a.link[i])) stat[k] += a.share[i];
  return stat;
}

/** Measured proportions from simulated pairs, with the static share `stat` as a prior worth `priorTrips` trips; flows for which `skip` holds keep `stat`. */
export function measuredShare(stat: Float64Array, flows: FlowIn[], m: ThroughMeasured, id: string, priorTrips: number, pinned: (k: number) => boolean, skip: (k: number) => boolean): Float64Array {
  const n = flows.length;
  const key = (k: number) => `${flows[k].origin}>${flows[k].destination}`;
  const pinVol = new Map<string, number>(), pinThr = new Map<string, number>(), plainVol = new Map<string, number>(), plainThr = new Map<string, number>();
  const add = (mp: Map<string, number>, q: string, v: number) => mp.set(q, (mp.get(q) ?? 0) + v);
  for (let k = 0; k < n; k++) {
    const q = key(k), v = flows[k].vehPerHour;
    if (pinned(k)) { add(pinVol, q, v); add(pinThr, q, v * stat[k]); } else { add(plainVol, q, v); add(plainThr, q, v * stat[k]); }
  }
  const use = Float64Array.from(stat);
  for (let k = 0; k < n; k++) {
    if (pinned(k) || skip(k)) continue;
    const q = key(k), pv = plainVol.get(q) ?? 0;
    const p0 = pv > 0 ? (plainThr.get(q) ?? 0) / pv : 0;
    // A pair with no simulated trip on any run is not in the file: its offered trips are taken as this table's plain volume over the runs.
    const offered = q in m.trips ? Math.max(0, m.trips[q] - m.runs * (pinVol.get(q) ?? 0)) : m.runs * pv;
    const hits = Math.max(0, (m.hits[id]?.[q] ?? 0) - m.runs * (pinThr.get(q) ?? 0));
    use[k] = Math.min(1, (hits + priorTrips * p0) / (offered + priorTrips));
  }
  return use;
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
  /** Through-car targets: the figure under the proportions the fit used (measured or static) and under the static route shares, offered and final. */
  throughRows: { t: ThroughTarget; target: number; lo: number; hi: number; oneSided: boolean; measured: boolean; offered: number; final: number; staticOffered: number; staticFinal: number }[];
  /** Gate prior ceilings (round 49); absent when the switch is off. */
  gatePrior?: GatePriorReport;
  unroutable: number;
  graphBans: number;
  cons: number;
  notes: string[];
  offeredAssignment: Assignment;
  /** Assignment loaded at the fitted volumes, used for the final scores and ramp choice. */
  assignment: Assignment;
}

export function fitPeriod(
  id: string, flows: FlowIn[], types: FlowType[], stations: Station[], nodes: ANode[], links: NetLinkIn[], bans: ATurnBan[], cfg: FitConfig,
): PeriodResult {
  const cdl = controlDelayArray(links, id, cfg.controlDelays);
  const g: Graph = buildGraph(nodes, links, bans, id, SIM_ROUTE_PARAMS, cdl);
  const nodeBy = new Map(nodes.map((n) => [n.id, n]));
  const v0 = flows.map((f) => f.vehPerHour);
  const fitOpt: FitOptions = flows.some((f) => f.via) ? { ...cfg.fit, pinned: flows.map((f) => (f.via ? 1 : 0)) } : cfg.fit;
  const nL = links.length;
  const ruleOf: { cap: number; rule: string }[] = links.map((l, i) => linkCapacity(l, nodeBy.get(l.to)!, g.minor[i], cfg.guard.capacity));
  const as = cfg.assignment ?? { method: 'free' as const, iterations: 1, drawsPerPass: cfg.draws, alpha: 0, beta: 4, dispersion: cfg.dispersion, rounds: 1 };
  // Measured delay: the simulator's mean time lost per vehicle on a link. The control delay the router already adds at the end of the link
  // (signal 10 s, all-way stop 6 s, minor stop approach 5 s, circle 3 s) is taken out so a queue at a signal is not counted twice (ASSUMPTION).
  const dl = cfg.measured?.delayS[id];
  const ctrlS = (l: number) => { const c = nodeBy.get(links[l].to)!.control; return c === 'signal' ? SIM_ROUTE_PARAMS.delaySignalS : c === 'all_way_stop' ? SIM_ROUTE_PARAMS.delayAllwayS : c === 'two_way_stop' ? (g.minor[l] ? SIM_ROUTE_PARAMS.delayMinorS : 0) : c === 'traffic_circle' ? SIM_ROUTE_PARAMS.delayCircleS : 0; };
  const mw = cfg.measured?.weight ?? 1;
  const extra = dl && dl.length === nL ? links.map((l, i) => mw * Math.max(0, dl[i] - ctrlS(i)) * (l.class === 'residential' || l.class === 'service' ? SIM_ROUTE_PARAMS.localCostFactor : 1)) : undefined;
  const alphaUse = extra && cfg.measured ? cfg.measured.alpha : as.alpha;
  const features: Feature[] = [], featOf = new Map<string, number>();
  for (const s of stations) if (s.feature && (s.target[id] ?? 0) > 0) { featOf.set(s.id, features.length); features.push(s.feature); }
  const thr = (cfg.through?.targets ?? []).filter((t) => (t.target[id] ?? 0) > 0 && t.links.length);
  for (const t of thr) { featOf.set(t.id, features.length); features.push({ kind: 'any', links: t.links }); }
  const pinnedK = (k: number) => !!flows[k].via;
  const toCons = (s: Station): Constraint => ({ id: s.id, kind: s.kind, label: s.label, links: s.links, origins: s.origins, destinations: s.destinations, target: s.target[id], weight: s.weightByPeriod?.[id] ?? s.weight, feature: featOf.get(s.id), ...(s.ceiling !== undefined ? { ceiling: s.ceiling, ceilingOnly: true } : {}) });
  const heldCons: Constraint[] = stations.filter((s) => s.held && (s.target[id] ?? 0) > 0).map(toCons);
  const countCons0: Constraint[] = stations.filter((s) => !s.held && (s.target[id] ?? 0) > 0).map(toCons);
  // Named movement and route stations with simulated pairs for this period take a simulated membership (round 41); the others keep their route feature.
  const stMeas = cfg.through?.measured?.[id]?.stations;
  // The loader verifies the station definitions and detector-count version before accepting measured OD fractions.
  const wanted = cfg.through?.measuredStations;
  const measSt = new Set((wanted === 'all' ? countCons0.map((c) => c.id) : wanted ?? []).filter((sid) => stMeas?.hits[sid] && (featOf.has(sid) || countCons0.some((c) => c.id === sid && c.links.length))));
  // Ceilings on the gates no gate station counts (round 49, ASSUMPTION). Only where simulated membership is in use: the fit runs once as the baseline does (static membership, no
  // ceilings), and the fit with simulated membership may not take a gate above that fit's total. They live inside the fit only: not in `stations`, not scored, not in the stations file.
  const incident = (n: number) => links.find((l) => (l.from === n || l.to === n) && l.name)?.name || '(unnamed)';
  let staticFit: PeriodResult | undefined;
  let priorSt: Station[] = [];
  if (cfg.gatePrior && measSt.size) {
    staticFit = fitPeriod(id, flows, types, stations, nodes, links, bans, { ...cfg, gatePrior: undefined, through: cfg.through ? { ...cfg.through, measured: undefined, measuredStations: undefined } : undefined });
    priorSt = gatePriorStations(id, flows.map((f, k) => ({ origin: f.origin, destination: f.destination, vehPerHour: staticFit!.volume[k] })), countCons0 as Pick<Station, 'kind' | 'origins' | 'destinations'>[], cfg.gatePrior, incident);
  }
  const priorCons: Constraint[] = priorSt.map(toCons);
  const stationCons = (aa: Assignment): Constraint[] => {
    if (!measSt.size) return countCons0;
    return countCons0.map((c) => {
      if (!measSt.has(c.id)) return c;
      if (featOf.has(c.id)) {
        const r = throughMembership(aa, flows, featOf.get(c.id)!, new Set(), stMeas, c.id, cfg.through!.priorTrips, pinnedK);
        return { ...c, feature: undefined, member: r.use };
      }
      const member = measuredShare(linkShare(aa, flows.length, c.links), flows, stMeas!, c.id, cfg.through!.priorTrips, pinnedK, () => false);
      return { ...c, links: [], member };
    });
  };

  const sumBy = (f: ArrayLike<number>) => { const o: Record<string, number> = { through: 0, local: 0, ramp: 0 }; for (let k = 0; k < f.length; k++) o[types[k]] += f[k]; return o; };
  const exempt = new Set<number>();
  for (const c of countCons0) for (const l of c.links) exempt.add(l);
  const limit = new Float64Array(nL).fill(Infinity);
  links.forEach((_, l) => { if (!exempt.has(l)) limit[l] = (1 + cfg.guard.excessShare) * ruleOf[l].cap; });
  const rampTargets = stations.filter((q) => q.kind === 'ramp' && (q.target[id] ?? 0) > 0).map((q) => ({ links: q.links, target: q.target[id] }));
  const capacity = ruleOf.map((r) => r.cap);
  const load = (vol: number[]) => {
    const shares = cfg.shares;
    const tally = shares && (shares.weight > 0 || (cfg.implied?.weight ?? 0) > 0)
      ? routeShareTally(nodes, links, shares.targets, flows, id, shares.pmPeriod, shares.weight) : undefined;
    const a = as.method === 'msa'
      ? assignMsa(g, flows, vol, { iterations: as.iterations, drawsPerPass: as.drawsPerPass, alpha: alphaUse, beta: as.beta, dispersion: as.dispersion, capacity, extraCost: extra, features, onRoute: tally?.onRoute })
      : assign(g, flows, cfg.draws, cfg.dispersion, features, tally?.onRoute);
    const specs = shares && shares.weight > 0 ? tally!.constraints() : [];
    const shareCons: Constraint[] = specs.map((q) => ({ id: q.id, kind: 'share', label: q.label, links: [], target: q.target, weight: q.weight, ratio: q.ratio }));
    const implied = shares && cfg.implied && cfg.implied.weight > 0
      ? impliedVolumes(nodes, links, shares.targets, (on) => tally!.sideFraction(on, v0), id, shares.pmPeriod, rampTargets) : [];
    const impliedCons: Constraint[] = implied.map((q) => ({ id: q.id, kind: 'derived', label: q.label, links: [q.link], target: q.target, weight: cfg.implied!.weight }));
    const mem = thr.map((t) => throughMembership(a, flows, featOf.get(t.id)!, cfg.through!.inStudy, cfg.through!.measured?.[id]?.hits[t.id] ? cfg.through!.measured[id] : undefined, t.id, cfg.through!.priorTrips, pinnedK));
    const throughCons: Constraint[] = cfg.through?.reportOnly ? [] : thr.map((t, i) => ({
      id: t.id, kind: 'through', label: t.label, links: [], target: t.target[id], weight: t.weight, member: mem[i].use, ...(t.ceiling.includes(id) ? { ceiling: t.hi[id] } : {}),
    }));
    const counts = [...stationCons(a), ...priorCons, ...throughCons];
    return { a, specs, implied, mem, counts, cons: [...counts, ...impliedCons, ...shareCons] };
  };
  const offered = load(v0);
  const reload = (vol: number[]) => as.method === 'msa' ? load(vol) : offered;
  const rounds = as.method === 'msa' ? Math.max(1, as.rounds) : 1;
  let input = offered;
  let rFinal!: ReturnType<typeof fitToCounts>, f1: number[] = [], volume: number[] = [];
  for (let round = 1; round <= rounds; round++) {
    if (round > 1) input = reload(volume);
    const r1 = fitToCounts(input.a, v0, types, input.counts, nL, fitOpt);
    rFinal = cfg.guard.enabled || input.cons.length > input.counts.length
      ? fitToCounts(input.a, v0, types, input.cons, nL, fitOpt, undefined, cfg.guard.enabled ? { limit, weight: cfg.guard.weight } : undefined) : r1;
    f1 = v0.map((v, k) => input.a.routable[k] ? v * r1.g[k] : v);
    volume = v0.map((v, k) => input.a.routable[k] ? v * rFinal.g[k] : v);
  }
  const shipped = reload(volume);
  const countOnly = f1.every((v, k) => v === volume[k]) ? shipped : reload(f1);
  const { a, specs, cons } = shipped;
  const before = assigned(offered.a, v0, offered.cons, nL);
  const afterFit = assigned(countOnly.a, f1, countOnly.cons, nL);
  const final = assigned(a, volume, cons, nL);
  const guardBound: PeriodResult['guardBound'] = [];
  const notes: string[] = [];
  let residualOver: PeriodResult['residualOver'] = [];
  if (cdl && cfg.controlDelays) {
    const n = cdl.reduce((a, x) => a + (Number.isFinite(x) ? 1 : 0), 0);
    notes.push(`control delay per approach measured on ${cfg.controlDelays.measuredOn.sha256.slice(0, 12)} (${cfg.controlDelays.view} view, seeds ${cfg.controlDelays.seeds[0]} to ${cfg.controlDelays.seeds[cfg.controlDelays.seeds.length - 1]}): ${n} approaches (at least ${cfg.controlDelays.minFlowVehPerHour} veh/h) replace the control-type constants`);
  }
  if (extra && cfg.measured) notes.push(`link costs include the simulator's measured delay per vehicle (${cfg.measured.source}; mean ${(extra.reduce((x, y) => x + y, 0) / nL).toFixed(1)} s per link after the control delay is removed, weight ${mw}, BPR alpha ${cfg.measured.alpha})`);
  if (measSt.size) notes.push(`stations whose membership comes from simulated trips (${stMeas!.runs} runs${wanted === 'all' ? `; ${measSt.size} of ${countCons0.length} fitted stations` : ''}; their assigned volumes in the station tables use it): ${[...measSt].join(', ')}`);
  if (as.method === 'msa') notes.push(`assignment by successive averages (${as.iterations} passes x ${as.drawsPerPass} draws of perceived costs, BPR alpha ${alphaUse} beta ${as.beta}, route-choice dispersion ${as.dispersion} s), ${rounds} round(s) with the table refitted and reassigned at its own volumes; relative link-volume change at the last pass ${(a as ReturnType<typeof assignMsa>).relChange?.toFixed(3)}`);
  if (cfg.guard.enabled) {
    const V1 = linkVolumes(countOnly.a, f1, nL);
    const V2 = linkVolumes(a, volume, nL);
    for (let l = 0; l < nL; l++) if (V1[l] > limit[l]) guardBound.push({ link: l, name: links[l].name || '(unnamed)', rule: ruleOf[l].rule, cap: ruleOf[l].cap, before: V1[l], after: V2[l] });
    guardBound.sort((x, y) => y.before / y.cap - x.before / x.cap);
    residualOver = [...V2.keys()].filter((l) => V2[l] > limit[l] * (1 + 1e-3)).map((l) => ({ link: l, name: links[l].name || '(unnamed)', vol: V2[l], limit: limit[l] })).sort((x, y) => y.vol / y.limit - x.vol / x.limit);
    notes.push(`the guard cut ${rFinal.freeCut?.toFixed(0) ?? 0} veh/h from flows that touch no count (after the median rule)`);
  }
  let guardFlows = 0;
  for (let k = 0; k < flows.length; k++) if (volume[k] < f1[k] * 0.999) guardFlows++;
  const t0 = sumBy(v0), t1 = sumBy(f1), t2 = sumBy(volume);
  const totals: PeriodResult['totals'] = {};
  for (const t of ['through', 'local', 'ramp']) totals[t] = { start: t0[t], afterFit: t1[t], final: t2[t] };
  const byId = new Map(cons.map((c, i) => [c.id, i]));
  const shareRows = specs.map((q) => { const i = byId.get(q.id)!; return { spec: q, offered: before[i], afterFit: afterFit[i], final: final[i], n: q.ratio.flows.length }; });
  const impliedRows = input.implied.map((iv) => { const i = byId.get(iv.id)!; return { iv, before: before[i], afterFit: afterFit[i], final: final[i] }; });
  const dot = (m: ArrayLike<number>, f: ArrayLike<number>) => { let x = 0; for (let k = 0; k < f.length; k++) x += m[k] * f[k]; return x; };
  const throughRows = thr.map((t, i) => ({ t, target: t.target[id], lo: t.lo[id], hi: t.hi[id], oneSided: t.ceiling.includes(id), measured: !!cfg.through?.measured?.[id]?.hits[t.id], offered: dot(offered.mem[i].use, v0), final: dot(shipped.mem[i].use, volume), staticOffered: dot(offered.mem[i].stat, v0), staticFinal: dot(shipped.mem[i].stat, volume) }));
  const gatePrior: GatePriorReport | undefined = cfg.gatePrior && staticFit ? {
    tolerancePct: cfg.gatePrior.tolerancePct, weight: cfg.gatePrior.weight, staticTotal: Object.values(staticFit.totals).reduce((x, q) => x + q.final, 0), finalTotal: t2.through + t2.local + t2.ramp,
    staticByType: Object.fromEntries(Object.entries(staticFit.totals).map(([k, q]) => [k, q.final])), finalByType: { ...t2 },
    rows: priorSt.map((q) => ({ node: (q.origins ?? q.destinations!)[0], direction: q.origins ? 'origin' as const : 'destination' as const, street: incident((q.origins ?? q.destinations!)[0]), anchor: q.ceiling! / (1 + cfg.gatePrior!.tolerancePct / 100), ceiling: q.ceiling!, final: final[byId.get(q.id)!] })),
  } : undefined;
  const heldIdx = heldCons.length ? { b: assigned(offered.a, v0, heldCons, nL), f1: assigned(countOnly.a, f1, heldCons, nL), f: assigned(a, volume, heldCons, nL) } : null;
  const heldRows = heldCons.map((c, i) => ({ st: stations.find((q) => q.id === c.id)!, target: c.target, before: heldIdx!.b[i], afterFit: heldIdx!.f1[i], final: heldIdx!.f[i] }));
  const stationRows = stations.filter((s) => byId.has(s.id)).map((s) => { const i = byId.get(s.id)!; return { st: s, target: cons[i].target, before: before[i], afterFit: afterFit[i], final: final[i] }; });
  const guardRemoved = Object.values(totals).reduce((x, q) => x + q.afterFit - q.final, 0);
  return { id, volume, totals, stationRows, fit: rFinal, gFinal: [...rFinal.g], counted: rFinal.counted, types, guardBound, guardRemoved, guardFlows, residualOver, shareRows, heldRows, impliedRows, throughRows, ...(gatePrior ? { gatePrior } : {}), unroutable: [...a.routable].filter((x) => !x).length, graphBans: g.banned, cons: countCons0.length, notes, offeredAssignment: offered.a, assignment: a };
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

export function fitReport(area: string, results: PeriodResult[], flowsBy: Record<string, FlowIn[]>, opt: { fit: FitOptions; draws: number; dispersion: number; guardExcess: number; guardWeight: number; guardOn: boolean; tolOk: number; shareWeight?: number; assignment?: AssignConfig; links?: { name: string; fromBearing?: number; inStudyArea?: boolean }[]; composition?: string[]; recency?: Pick<RecencyConfig, 'referenceYear' | 'recentYears'> }, stationNotes: string[], extra: string[]): string {
  const L: string[] = [];
  L.push(`# Count-constrained demand fit: ${area}`, '', 'Generated by `tools/build-demand.ts` (do not edit). Car trips only, veh/h. Method and assumptions: `data/demand/README.md`, section "Count-constrained demand".', '');
  const asg = opt.assignment?.method === 'msa' ? `capacity-restrained assignment by successive averages (${opt.assignment.iterations} passes x ${opt.assignment.drawsPerPass} draws of perceived costs, BPR alpha ${opt.assignment.alpha} beta ${opt.assignment.beta}, route-choice dispersion ${opt.assignment.dispersion} s, ${opt.assignment.rounds} round(s))` : `static assignment over ${opt.draws} draws of perceived free-flow costs (route-choice dispersion ${opt.dispersion} s)`;
  L.push(`Settings: factor bounds ${opt.fit.lo} to ${opt.fit.hi}, damping ${opt.fit.damping}, tolerance ${(100 * (Math.exp(opt.fit.tol) - 1)).toFixed(1)}% on the unblocked count stations, at most ${opt.fit.maxIter} iterations; flows that touch no count take the ${opt.fit.uncounted} factor${opt.fit.volumeWeightedMedian ? ' (volume-weighted median)' : ''}; ${asg}; route-share constraints ${opt.shareWeight ? `on, weight ${opt.shareWeight} (counts 1 to 2)` : 'off'}; capacity guard ${opt.guardOn ? `on (limit = capacity x ${(1 + opt.guardExcess).toFixed(2)}, uncounted links only; an ASSUMPTION-labeled sanity rule, not data)` : 'off'}.`, '');
  L.push('## Offered car trips, before and after', '', '| Period | Type | Offered (build) | After count fit | After guard (final) | Removed by the count-only fit | Removed by the share and guard terms (final minus count-only) | Final / offered |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of results) {
    let s0 = 0, s1 = 0, s2 = 0;
    for (const t of ['through', 'local', 'ramp']) {
      const q = r.totals[t];
      s0 += q.start; s1 += q.afterFit; s2 += q.final;
      L.push(`| ${r.id} | ${t} | ${f0(q.start)} | ${f0(q.afterFit)} | ${f0(q.final)} | ${f0(q.start - q.afterFit)} | ${f0(q.afterFit - q.final)} | ${pctOf(q.final, q.start)} |`);
    }
    L.push(`| ${r.id} | **all** | ${f0(s0)} | ${f0(s1)} | ${f0(s2)} | ${f0(s0 - s1)} | ${f0(s1 - s2)} | ${pctOf(s2, s0)} |`);
  }
  if (results.some((r) => r.gatePrior)) {
    const gp = results.find((r) => r.gatePrior)!.gatePrior!;
    L.push('', '## Gate prior ceilings (ASSUMPTION)', '', `In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each gate direction that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus ${gp.tolerancePct}%, weight ${gp.weight}. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.`, '');
    const byType = (o: Record<string, number>) => ['through', 'local', 'ramp'].map((t) => `${t} ${f0(o[t] ?? 0)}`).join(', ');
    for (const r of results) {
      const g = r.gatePrior;
      if (!g) { L.push(`Gate prior ceilings ${r.id}: none (static membership in this period).`, ''); continue; }
      const over = g.rows.filter((x) => x.final > x.ceiling + 0.5), excess = over.reduce((a, x) => a + x.final - x.ceiling, 0);
      L.push(`Gate prior ceilings ${r.id}: ${g.rows.length} stations; ${over.length} above ceiling; excess ${f0(excess)} veh/h; offered car ${f0(g.staticTotal)} to ${f0(g.finalTotal)} veh/h.`, '', `Offered car veh/h by flow type, static fit then final: ${byType(g.staticByType)}; ${byType(g.finalByType)}.`, '');
      if (over.length) {
        L.push('| Gate node | Street | Direction | Static fit | Ceiling | Final | Above the ceiling |', '| --- | --- | --- | --- | --- | --- | --- |');
        for (const x of [...over].sort((p, q) => q.final - q.ceiling - (p.final - p.ceiling)).slice(0, 5)) L.push(`| ${x.node} | ${x.street} | ${x.direction === 'origin' ? 'entering' : 'leaving'} | ${f0(x.anchor)} | ${f0(x.ceiling)} | ${f0(x.final)} | ${f0(x.final - x.ceiling)} |`);
        L.push('');
      }
    }
  }
  L.push('', '## Fit status and per-flow factors', '', 'Stopping errors and conflicts describe the last fitting iteration. The station tables score each resulting demand after routing it at its own volumes. Factor = final volume / offered volume of a flow. Percentiles are volume-weighted over the offered volume. "At bound" counts flows on a counted link whose factor sits on the lower or upper bound.', '');
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
    if (opt.recency) {
      const tag = (x: { st: Station; final: number; target: number }, held: boolean) => ({ source: x.st.source, year: x.st.year, c: { gehOk: geh(x.final, x.target) < 5, held } });
      L.push('', `GEH below 5 by source and count year in the static assignment (${r.id}; fitted = in the fit that ships, held out = scored on the fit without them):`, '', ...sourceYearLines([...rows.map((x) => tag(x, false)), ...r.heldRows.map((x) => tag(x, true))], opt.recency));
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
  if (results.some((r) => r.throughRows.length)) {
    L.push('', '## Through-car targets on street runs', '', 'Cars an hour with neither trip end in the study area that use any link of the street run, each counted once (the calibrate report\'s through figure). Each fitted period has a direct observation of those trips in observedCorridorThroughVehPerHour. "Simulated membership": each pair\'s share of trips on the run comes from seed runs of the simulator (`countFit.throughTargets.measured`); "static": from the fit\'s own route shares.', '', '| Period | Street run | Range | Target | Membership | Offered | Final | Static route shares, offered | Static, final |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const r of results) for (const x of r.throughRows) L.push(`| ${r.id} | ${x.t.label} | ${f0(x.lo)} to ${f0(x.hi)}${x.oneSided ? ' (upper limit only)' : ''} | ${f0(x.target)} | ${x.measured ? 'simulated' : 'static'} | ${f0(x.offered)} | ${f0(x.final)} | ${f0(x.staticOffered)} | ${f0(x.staticFinal)} |`);
    L.push('');
  }
  if (opt.composition?.length && opt.links) {
    L.push('', '## Who uses the interior streets: composition of the assigned traffic', '', 'Mean assigned volume per block (veh/h) on the links of a street inside the study area, by the kind of trip that loads it: local-end (one end at a block of the area or the model, the other at a gate), through (gate to gate, no local end) and freeway-related (one end on the freeway). Offered = the table before the fit, final = the table that ships. Directions by link bearing (north half or south half).', '', '| Period | Street | Direction | Links | Offered local-end | Offered through | Offered freeway | Offered total | Final local-end | Final through | Final freeway | Final total |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const r of results) {
      const fl = flowsBy[r.id];
      for (const street of opt.composition) for (const dir of ['N', 'S'] as const) {
        const ls = opt.links.map((l, i) => ({ l, i })).filter(({ l }) => l.name === street && l.inStudyArea !== false && ((((l.fromBearing ?? 0) + 90) % 360 < 180) === (dir === 'N'))).map(({ i }) => i);
        if (!ls.length) continue;
        const set = new Set(ls);
        const off: Record<string, number> = { local: 0, through: 0, ramp: 0 }, fin: Record<string, number> = { local: 0, through: 0, ramp: 0 };
        for (const [asg, totals, volumes] of [[r.offeredAssignment, off, fl.map((f) => f.vehPerHour)], [r.assignment, fin, r.volume]] as const) {
          for (let k = 0; k < fl.length; k++) for (let i = asg.start[k]; i < asg.start[k + 1]; i++) if (set.has(asg.link[i])) totals[r.types[k]] += volumes[k] * asg.share[i];
        }
        const n = ls.length, sum = (o: Record<string, number>) => o.local + o.through + o.ramp;
        L.push(`| ${r.id} | ${street} | ${dir === 'N' ? 'north half' : 'south half'} | ${n} | ${f0(off.local / n)} | ${f0(off.through / n)} | ${f0(off.ramp / n)} | ${f0(sum(off) / n)} | ${f0(fin.local / n)} | ${f0(fin.through / n)} | ${f0(fin.ramp / n)} | ${f0(sum(fin) / n)} |`);
      }
    }
    L.push('');
  }
  L.push('', '## Stations that cannot be met', '', 'A station is listed when the last fitting iteration ended more than 5% off its target before reloading the fitted demand. Pinned = share of its assigned volume on flows sitting on the bound it would need to move (lower bound when it is too high, upper bound when too low). Opposing = stations that pull the same flows the other way (size of the error, volume the two share).', '');
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
