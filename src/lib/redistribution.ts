/**
 * Redistribution diagnostic (change explain-traffic-redistribution): the comparison contract, the parsing of the simulator's trace, the
 * per-seed accounting and the summary over seeds. The CLI (`npm run simulate -- --redistribution`) and the app share this module, so a
 * stored diagnostic means the same in both.
 *
 * Three evidence types are kept apart throughout: possible paths (legal witnesses on the effective movement graph, no volumes),
 * simulated cohort routes (the routes the selected baseline requests drove in each scenario) and net all-car changes per block.
 */
import type { Intervention, Network } from '../types';
import type { NetIndex } from './naming';
import { directedLabel } from './naming';
import { blockMeasured, linkMeasured } from './scope';

/** Version of the stored result. A reader refuses any other. */
export const REDISTRIBUTION_SCHEMA = 1;
/** Version of the accounting: cohort selection, matching, route grouping and reconciliation. */
export const DIAGNOSTIC_METHOD = 'redistribution-1';
/** Layout of the simulator's trace export this reader understands (`sim::trace::TRACE_SCHEMA`, `REQ_STRIDE`). */
export const TRACE_SCHEMA = 1;
export const REQ_STRIDE = 14;
/** Radius around the closed junctions within which a route is described street by street. ASSUMPTION: about three blocks. */
export const LOCAL_RADIUS_M = 400;
/** Blocks listed besides the ones on a witness path or asked for: the largest net all-car changes. */
export const TOP_BLOCKS = 12;

export type Role = 'baseline' | 'closure' | 'package';
export type Comparison = 'closure' | 'package';
export const COMPARISONS: Comparison[] = ['closure', 'package'];
export const STATES = ['pending', 'active', 'completed', 'unroutable', 'removed'] as const;
export type State = (typeof STATES)[number];
/** Where a cohort request stands at the end of the window in a scenario; the bins partition the cohort. */
export type Outcome = State | 'unmatched' | 'mismatched';
export const OUTCOMES: Outcome[] = [...STATES, 'unmatched', 'mismatched'];
export type SelectorKind = 'direct' | 'crossings';

export interface TraceSummary {
  schema: number; mode: string; time: number;
  requests: { requested: Record<State, number>; initial: Record<State, number> };
  detail: { maxEvents: number; storedEvents: number; skippedEvents: number; requestsWithDetail: number; requests: number };
  exitsRequested: number[]; exitsInitial: number[];
}
export interface TraceRun { requests: Float64Array; events: Uint32Array; summary: TraceSummary; metrics: Record<string, unknown> }

/** Output of the engine's graph query (`redistributionGraph`). */
export interface WitnessPath { links: number[]; costS: number; baselineCostS: number | null }
export interface Witness {
  movement: [number, number]; node: number; starts: number[]; targets: number[];
  status: 'found' | 'disconnected' | 'unused'; servedPairs: number; exhaustive: boolean; listed: number; found: number; cap: number; paths: WitnessPath[];
}
export interface GraphQuery {
  schema: number; mode: string; period: string;
  graph: { links: number; movements: number; baseline: string; scenario: string };
  closed: [number, number, number][]; closedLinks: number[]; nodes: number[]; crossings: [number, number, number][];
  witnesses: Witness[];
  limits: { listPerMovement: number; reachJunctions: number; costs: string };
}

export interface Effect { n: number; mean: number; sd: number; interval?: [number, number]; status: 'increase' | 'decrease' | 'unresolved' | 'insufficient'; method?: string; minPairs?: number }
/** The established paired estimator (the engine's `pairedEffect`), injected so the CLI and the app use the same one. */
export type PairedFn = (diffs: number[]) => Effect;

interface Req {
  src: number; ord: number; stratum: number; uid: number; origin: number; dest: number; tArr: number; attr: number;
  state: State; detail: boolean; cur: number;
}
interface Parsed { reqs: Req[]; off: Int32Array; links: Uint32Array; times: Float32Array; byKey: Map<string, number> }

const key = (r: Req) => `${r.src}:${r.ord}`;
const f32 = new Float32Array(1);
const u32 = new Uint32Array(f32.buffer);
const bitsToF32 = (b: number) => { u32[0] = b; return f32[0]; };

/** Requests and, per request, its link exits in time order. */
export function parseTrace(t: TraceRun): Parsed {
  if (t.summary.schema !== TRACE_SCHEMA) throw new Error(`trace schema ${t.summary.schema}, expected ${TRACE_SCHEMA}`);
  const n = Math.floor(t.requests.length / REQ_STRIDE);
  if (n * REQ_STRIDE !== t.requests.length) throw new Error('trace requests: length is not a multiple of the stride');
  const reqs: Req[] = new Array(n);
  const byKey = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const r = t.requests.subarray(i * REQ_STRIDE, (i + 1) * REQ_STRIDE);
    reqs[i] = { src: r[0], ord: r[1], stratum: r[2], uid: r[3], origin: r[4], dest: r[5], tArr: r[6], attr: r[7], state: STATES[r[10]], detail: r[11] === 1, cur: r[13] };
    if (r[2] === 0) byKey.set(key(reqs[i]), i);
  }
  const ne = Math.floor(t.events.length / 3);
  const off = new Int32Array(n + 1);
  for (let e = 0; e < ne; e++) off[t.events[e * 3] + 1]++;
  for (let i = 0; i < n; i++) off[i + 1] += off[i];
  const fill = off.slice(0, n);
  const links = new Uint32Array(ne);
  const times = new Float32Array(ne);
  for (let e = 0; e < ne; e++) {
    const i = t.events[e * 3];
    const k = fill[i]++;
    links[k] = t.events[e * 3 + 1];
    times[k] = bitsToF32(t.events[e * 3 + 2]);
  }
  return { reqs, off, links, times, byKey };
}

/** The same requested trip: the key matched; these attributes must match too (D2). */
export const sameRequest = (a: Req, b: Req) => a.uid === b.uid && a.origin === b.origin && a.dest === b.dest && a.tArr === b.tArr && a.attr === b.attr;

export interface Selector { kind: SelectorKind; movements: [number, number][]; links: number[] }
export function selectorOf(g: GraphQuery, kind: SelectorKind): Selector {
  return kind === 'direct'
    ? { kind, movements: g.closed.map((m) => [m[0], m[1]]), links: g.closedLinks }
    : { kind, movements: g.crossings.map((m) => [m[0], m[1]]), links: g.closedLinks };
}

/** Did request `i` drive a selected movement or link within the window [0, seconds)? An active car counts its current link as the next one. */
function traverses(p: Parsed, i: number, sel: Set<string>, selLinks: Set<number>, seconds: number): boolean {
  const { off, links, times } = p;
  for (let k = off[i]; k < off[i + 1]; k++) {
    const t = times[k];
    if (t < 0 || t >= seconds) continue;
    if (selLinks.has(links[k])) return true;
    const next = k + 1 < off[i + 1] ? links[k + 1] : p.reqs[i].state === 'active' ? p.reqs[i].cur : -1;
    if (next >= 0 && sel.has(`${links[k]}>${next}`)) return true;
  }
  return false;
}

export interface Geo { nodeXY: [number, number][]; linkFrom: number[]; linkTo: number[]; linkName: string[]; inStudy: boolean[] }
export function geoOf(net: Network): Geo {
  return {
    nodeXY: net.nodes.map((n) => [n.x, n.y]), linkFrom: net.links.map((l) => l.from), linkTo: net.links.map((l) => l.to),
    linkName: net.links.map((l) => l.name.trim() || 'Unnamed road'), inStudy: net.nodes.map((n) => n.inStudyArea),
  };
}

/** The links of a path within `LOCAL_RADIUS_M` of the closed junctions, and their street-by-street description (consecutive repeats merged). */
export function localPart(geo: Geo, centers: [number, number][], path: ArrayLike<number>): { key: string; links: number[] } {
  const near = (n: number) => centers.some(([x, y]) => Math.hypot(geo.nodeXY[n][0] - x, geo.nodeXY[n][1] - y) <= LOCAL_RADIUS_M);
  const out: string[] = [];
  const links: number[] = [];
  for (let k = 0; k < path.length; k++) {
    const l = path[k];
    if (!near(geo.linkFrom[l]) && !near(geo.linkTo[l])) continue;
    links.push(l);
    const s = geo.linkName[l];
    if (out[out.length - 1] !== s) out.push(s);
  }
  return { key: out.join(' → '), links };
}
export const localRoute = (geo: Geo, centers: [number, number][], path: ArrayLike<number>): string => localPart(geo, centers, path).key;
export const FAR_ROUTE = 'Not within 400 m of the closure';

const zeros = (n: number) => new Float64Array(n);
export interface LinkCounts { all: Float64Array; through: Float64Array; local: Float64Array; unclassified: Float64Array }
/** Per-link exits within the window of one comparison side, split by who made them. They add up to `all` exactly. */
export interface Split { cohort: Float64Array; other: Float64Array; unpaired: Float64Array; initial: Float64Array; noDetail: Float64Array }
export interface Health { gridlockRemoved: number; unroutableTrips: number; backlog: number; vehiclesInNetwork: number; completedTrips: number; heldRemoved: number | null }
/** Cohort trips by their route near the closure. `sample`: the local links of the first trip seen on it, for drawing (not a weight). */
export interface RouteRow { key: string; counts: Record<Role, number>; complete: Record<Role, number>; partial: Record<Role, number>; sample?: number[] }

export interface SeedAnalysis {
  seed: number; seconds: number;
  cohort: { size: number; initialTraversals: number; baselineNoDetail: number };
  outcomes: Record<Comparison, Record<Outcome, number>>;
  baselineOutcomes: Record<State, number>;
  routes: RouteRow[];
  routeChanged: Record<Comparison, { changed: number; same: number; unknown: number }>;
  matching: Record<Comparison, { baselineRequested: number; matched: number; unmatched: number; mismatched: number }>;
  counts: Record<Role, LinkCounts>;
  split: Record<Comparison, { baseline: Split; scenario: Split; gross: { added: Float64Array; removed: Float64Array } }>;
  health: Record<Role, Health>;
  coverage: Record<Role, TraceSummary['detail']>;
}

function healthOf(m: Record<string, unknown>): Health {
  const num = (k: string) => (typeof m[k] === 'number' ? (m[k] as number) : 0);
  const jr = m.junctionRecovery as { heldRemovals?: number } | undefined;
  return {
    gridlockRemoved: num('gridlockRemoved'), unroutableTrips: num('unroutableTrips'), backlog: num('backlog'), vehiclesInNetwork: num('vehiclesInNetwork'),
    completedTrips: num('completedTrips'), heldRemoved: typeof jr?.heldRemovals === 'number' ? jr.heldRemovals : null,
  };
}

/** One seed: the cohort selected in the baseline, its outcomes and routes in each scenario, and the per-link accounting. */
export function analyzeSeed(o: { seed: number; seconds: number; runs: Record<Role, TraceRun>; selector: Selector; centers: [number, number][]; geo: Geo }): SeedAnalysis {
  const { seconds, geo } = o;
  const nLinks = geo.linkFrom.length;
  const P: Record<Role, Parsed> = { baseline: parseTrace(o.runs.baseline), closure: parseTrace(o.runs.closure), package: parseTrace(o.runs.package) };
  const sel = new Set(o.selector.movements.map(([a, b]) => `${a}>${b}`));
  const selLinks = new Set(o.selector.links);
  const B = P.baseline;
  const cohort: number[] = [];
  let initialTraversals = 0, baselineNoDetail = 0;
  for (let i = 0; i < B.reqs.length; i++) {
    if (!B.reqs[i].detail) continue;
    if (!traverses(B, i, sel, selLinks, seconds)) continue;
    if (B.reqs[i].stratum === 1) initialTraversals++;
    else cohort.push(i);
  }
  // Requests without detail cannot be tested for membership; they are counted, not guessed.
  for (const r of B.reqs) if (!r.detail && r.stratum === 0) baselineNoDetail++;
  const cohortKeys = new Set(cohort.map((i) => key(B.reqs[i])));

  const counts = {} as Record<Role, LinkCounts>;
  for (const role of ['baseline', 'closure', 'package'] as Role[]) {
    const p = P[role];
    const s = o.runs[role].summary;
    const c: LinkCounts = { all: zeros(nLinks), through: zeros(nLinks), local: zeros(nLinks), unclassified: zeros(nLinks) };
    for (let l = 0; l < nLinks; l++) c.all[l] = (s.exitsRequested[l] ?? 0) + (s.exitsInitial[l] ?? 0);
    for (let i = 0; i < p.reqs.length; i++) {
      const r = p.reqs[i];
      const through = !geo.inStudy[r.origin] && !geo.inStudy[r.dest];
      for (let k = p.off[i]; k < p.off[i + 1]; k++) {
        const t = p.times[k];
        if (t < 0 || t >= seconds) continue;
        (through ? c.through : c.local)[p.links[k]]++;
      }
    }
    for (let l = 0; l < nLinks; l++) c.unclassified[l] = c.all[l] - c.through[l] - c.local[l];
    counts[role] = c;
  }

  const windowPassages = (p: Parsed, i: number, into: Float64Array, sign = 1) => {
    for (let k = p.off[i]; k < p.off[i + 1]; k++) {
      const t = p.times[k];
      if (t >= 0 && t < seconds) into[p.links[k]] += sign;
    }
  };
  const splitOf = (p: Parsed, run: TraceRun, other: Parsed): Split => {
    const s: Split = { cohort: zeros(nLinks), other: zeros(nLinks), unpaired: zeros(nLinks), initial: zeros(nLinks), noDetail: zeros(nLinks) };
    for (let l = 0; l < nLinks; l++) {
      s.initial[l] = run.summary.exitsInitial[l] ?? 0;
      s.noDetail[l] = run.summary.exitsRequested[l] ?? 0;
    }
    for (let i = 0; i < p.reqs.length; i++) {
      const r = p.reqs[i];
      if (r.stratum !== 0 || !r.detail) continue;
      const j = other.byKey.get(key(r));
      const paired = j !== undefined && sameRequest(r, other.reqs[j]);
      const into = !paired ? s.unpaired : cohortKeys.has(key(r)) ? s.cohort : s.other;
      windowPassages(p, i, into);
      windowPassages(p, i, s.noDetail, -1);
    }
    return s;
  };

  const routes = new Map<string, RouteRow>();
  const local = new Map<string, number[]>();
  const routeRow = (k: string) => {
    let r = routes.get(k);
    if (!r) { r = { key: k, counts: { baseline: 0, closure: 0, package: 0 }, complete: { baseline: 0, closure: 0, package: 0 }, partial: { baseline: 0, closure: 0, package: 0 }, sample: local.get(k) }; routes.set(k, r); }
    return r;
  };
  const pathOf = (p: Parsed, i: number) => p.links.subarray(p.off[i], p.off[i + 1]);
  const routeKey = (p: Parsed, i: number) => {
    const path = Array.from(pathOf(p, i));
    if (p.reqs[i].state === 'active' && p.reqs[i].cur >= 0) path.push(p.reqs[i].cur);
    const part = localPart(geo, o.centers, path);
    const k = part.key || FAR_ROUTE;
    if (!local.has(k)) local.set(k, part.links);
    return k;
  };
  const baselineOutcomes = Object.fromEntries(STATES.map((s) => [s, 0])) as Record<State, number>;
  const baseKeyOf = new Map<number, string>();
  for (const i of cohort) {
    const r = B.reqs[i];
    baselineOutcomes[r.state]++;
    const k = routeKey(B, i);
    baseKeyOf.set(i, k);
    const row = routeRow(k);
    row.counts.baseline++;
    (r.state === 'completed' ? row.complete : row.partial).baseline++;
  }

  const outcomes = {} as SeedAnalysis['outcomes'];
  const routeChanged = {} as SeedAnalysis['routeChanged'];
  const matching = {} as SeedAnalysis['matching'];
  const split = {} as SeedAnalysis['split'];
  for (const c of COMPARISONS) {
    const S = P[c];
    const out = Object.fromEntries(OUTCOMES.map((x) => [x, 0])) as Record<Outcome, number>;
    const ch = { changed: 0, same: 0, unknown: 0 };
    const gross = { added: zeros(nLinks), removed: zeros(nLinks) };
    for (const i of cohort) {
      const j = S.byKey.get(key(B.reqs[i]));
      if (j === undefined) { out.unmatched++; ch.unknown++; continue; }
      if (!sameRequest(B.reqs[i], S.reqs[j])) { out.mismatched++; ch.unknown++; continue; }
      const sr = S.reqs[j];
      out[sr.state]++;
      if (!sr.detail || sr.state === 'pending') { ch.unknown++; } else {
        const k = routeKey(S, j);
        const row = routeRow(k);
        row.counts[c]++;
        (sr.state === 'completed' ? row.complete : row.partial)[c]++;
        if (k === baseKeyOf.get(i)) ch.same++; else ch.changed++;
      }
      const d = zeros(nLinks);
      windowPassages(S, j, d);
      windowPassages(B, i, d, -1);
      for (let l = 0; l < nLinks; l++) {
        if (d[l] > 0) gross.added[l] += d[l];
        else if (d[l] < 0) gross.removed[l] += d[l];
      }
    }
    outcomes[c] = out;
    routeChanged[c] = ch;
    let matched = 0, unmatched = 0, mismatched = 0, baselineRequested = 0;
    for (const r of B.reqs) {
      if (r.stratum !== 0) continue;
      baselineRequested++;
      const j = S.byKey.get(key(r));
      if (j === undefined) unmatched++;
      else if (sameRequest(r, S.reqs[j])) matched++;
      else mismatched++;
    }
    matching[c] = { baselineRequested, matched, unmatched, mismatched };
    split[c] = { baseline: splitOf(B, o.runs.baseline, S), scenario: splitOf(S, o.runs[c], B), gross };
  }
  const health = {} as SeedAnalysis['health'];
  const coverage = {} as SeedAnalysis['coverage'];
  for (const role of ['baseline', 'closure', 'package'] as Role[]) {
    health[role] = healthOf(o.runs[role].metrics);
    coverage[role] = o.runs[role].summary.detail;
  }
  return {
    seed: o.seed, seconds, cohort: { size: cohort.length, initialTraversals, baselineNoDetail }, outcomes, baselineOutcomes,
    routes: [...routes.values()], routeChanged, matching, counts, split, health, coverage,
  };
}

// ---------------------------------------------------------------- summary over seeds

export interface Counts3 { all: number; through: number; local: number; unclassified: number }
export interface Reconcile { net: number; cohort: number; cohortAdded: number; cohortRemoved: number; other: number; unpaired: number; initial: number; noDetail: number }
export interface DirRow { link: number; label: string; baseline: number; closure: number; package: number }
export interface BlockRow {
  key: number; label: string; name: string; links: number[]; inStudyArea: boolean; cls: string;
  why: ('witness' | 'requested' | 'largest change')[];
  /** Cars an hour, mean over seeds, both directions summed. */
  baseline: Counts3; closure: Counts3; package: Counts3;
  directions: DirRow[];
  change: Record<Comparison, { all: Effect; through: Effect | null; local: Effect | null }> & { packageVsClosure: { all: Effect } };
  reconcile: Record<Comparison, Reconcile>;
}
export interface ScenarioRef { role: Role; link: string; interventions: Intervention[] }
export interface RedistributionResult {
  schema: number; method: string; reportMethod: string; kind: 'redistribution';
  disclaimer: string;
  identity: {
    area: string; period: string; seeds: number[]; seconds: number; demandScale: number; initialLoad: true; mode: 'car';
    window: { fromS: number; toS: number; counting: string };
    hashes: { network: string; demand: string; simulator: string };
    scenarios: ScenarioRef[]; closureItem: string; selector: SelectorKind; localRadiusM: number; traceDetailMax: number | null;
  };
  calibration: { status: string; note: string };
  graph: { closure: GraphQuery; package: GraphQuery };
  cohort: {
    definition: string; perSeed: number[]; total: number; initialTraversals: number; baselineNoDetail: number;
    baselineOutcomes: Record<State, number>; outcomes: Record<Comparison, Record<Outcome, number>>;
    routeChanged: Record<Comparison, { changed: number; same: number; unknown: number }>;
    routes: RouteRow[];
    matching: Record<Comparison, { baselineRequested: number; matched: number; unmatched: number; mismatched: number }>;
  };
  blocks: BlockRow[];
  /** One summary of every street outside the measured set (bounding streets beyond the study area and the wider network), in place of block rows. */
  outside?: { change: Record<Comparison, Effect> };
  health: Record<Role, Health[]>;
  coverage: Record<Role, TraceSummary['detail'][]>;
  notes: string[];
}

const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const sumLinks = (arr: Float64Array, links: number[]) => links.reduce((s, l) => s + (arr[l] ?? 0), 0);

export interface SummaryInput {
  seeds: SeedAnalysis[]; index: NetIndex; net: Network; paired: PairedFn;
  graph: { closure: GraphQuery; package: GraphQuery };
  identity: RedistributionResult['identity']; calibration: RedistributionResult['calibration'];
  requestedStreets?: string[];
}

/** Blocks to list: those on a witness path, those on a requested street, and the largest net all-car changes. */
function chooseBlocks(s: SummaryInput, perHour: number): Map<number, BlockRow['why']> {
  const byLink = new Map<number, number>();
  s.index.blocks.forEach((b, i) => b.links.forEach((l) => byLink.set(l, i)));
  const why = new Map<number, BlockRow['why']>();
  const add = (b: number | undefined, w: BlockRow['why'][number]) => {
    if (b === undefined) return;
    const cur = why.get(b) ?? [];
    if (!cur.includes(w)) cur.push(w);
    why.set(b, cur);
  };
  for (const g of [s.graph.closure, s.graph.package]) for (const w of g.witnesses) for (const p of w.paths) for (const l of p.links) { const bi = byLink.get(l); if (bi !== undefined && blockMeasured(s.index.blocks[bi])) add(bi, 'witness'); }
  const wanted = (s.requestedStreets ?? []).map((x) => x.toLowerCase());
  if (wanted.length) s.index.blocks.forEach((b, i) => { if (wanted.some((w) => b.name.toLowerCase().includes(w)) && blockMeasured(b)) add(i, 'requested'); });
  const scored = s.index.blocks.map((b, i) => {
    const d = COMPARISONS.map((c) => Math.abs(mean(s.seeds.map((x) => sumLinks(x.counts[c].all, b.links) - sumLinks(x.counts.baseline.all, b.links))) * perHour));
    return { i, d: Math.max(...d), focus: blockMeasured(b) };
  }).filter((x) => x.focus && x.d > 0);
  scored.sort((a, b) => b.d - a.d || a.i - b.i);
  for (const x of scored.slice(0, TOP_BLOCKS)) add(x.i, 'largest change');
  return why;
}

export function summarize(s: SummaryInput): RedistributionResult {
  const seconds = s.identity.seconds;
  const perHour = 3600 / seconds;
  const nSeeds = s.seeds.length;
  const rows = chooseBlocks(s, perHour);
  const per = (f: (x: SeedAnalysis) => number) => s.seeds.map((x) => f(x) * perHour);
  const blocks: BlockRow[] = [...rows.entries()].map(([bi, why]) => {
    const b = s.index.blocks[bi];
    const c3 = (role: Role): Counts3 => {
      const v = (k: keyof LinkCounts) => mean(per((x) => sumLinks(x.counts[role][k], b.links)));
      return { all: v('all'), through: v('through'), local: v('local'), unclassified: v('unclassified') };
    };
    const diffs = (a: Role, z: Role, k: keyof LinkCounts) => per((x) => sumLinks(x.counts[z][k], b.links) - sumLinks(x.counts[a][k], b.links));
    const classified = s.seeds.every((x) => (['baseline', 'closure', 'package'] as Role[]).every((r) => sumLinks(x.counts[r].unclassified, b.links) === 0));
    const change = {} as BlockRow['change'];
    for (const c of COMPARISONS) {
      change[c] = { all: s.paired(diffs('baseline', c, 'all')), through: classified ? s.paired(diffs('baseline', c, 'through')) : null, local: classified ? s.paired(diffs('baseline', c, 'local')) : null };
    }
    change.packageVsClosure = { all: s.paired(diffs('closure', 'package', 'all')) };
    const reconcile = {} as BlockRow['reconcile'];
    for (const c of COMPARISONS) {
      const d = (k: keyof Split) => mean(per((x) => sumLinks(x.split[c].scenario[k], b.links) - sumLinks(x.split[c].baseline[k], b.links)));
      reconcile[c] = {
        net: mean(diffs('baseline', c, 'all')), cohort: d('cohort'), other: d('other'), unpaired: d('unpaired'), initial: d('initial'), noDetail: d('noDetail'),
        cohortAdded: mean(per((x) => sumLinks(x.split[c].gross.added, b.links))), cohortRemoved: mean(per((x) => sumLinks(x.split[c].gross.removed, b.links))),
      };
    }
    const directions: DirRow[] = b.links.map((l) => ({
      link: l, label: directedLabel(s.net, s.index, l),
      baseline: mean(per((x) => x.counts.baseline.all[l])), closure: mean(per((x) => x.counts.closure.all[l])), package: mean(per((x) => x.counts.package.all[l])),
    }));
    return { key: b.key, label: b.label, name: b.name, links: b.links, inStudyArea: b.inStudyArea, cls: b.cls, why, baseline: c3('baseline'), closure: c3('closure'), package: c3('package'), directions, change, reconcile };
  });
  blocks.sort((a, b) => Number(b.why.includes('witness')) - Number(a.why.includes('witness')) || Math.abs(b.change.package.all.mean) - Math.abs(a.change.package.all.mean) || a.key - b.key);

  const routes = new Map<string, RouteRow>();
  for (const x of s.seeds) for (const r of x.routes) {
    const t = routes.get(r.key) ?? { key: r.key, counts: { baseline: 0, closure: 0, package: 0 }, complete: { baseline: 0, closure: 0, package: 0 }, partial: { baseline: 0, closure: 0, package: 0 }, sample: r.sample };
    for (const role of ['baseline', 'closure', 'package'] as Role[]) { t.counts[role] += r.counts[role]; t.complete[role] += r.complete[role]; t.partial[role] += r.partial[role]; }
    routes.set(r.key, t);
  }
  const addRec = <K extends string>(get: (x: SeedAnalysis) => Record<K, number>) => {
    const out = {} as Record<K, number>;
    for (const x of s.seeds) for (const [k, v] of Object.entries(get(x)) as [K, number][]) out[k] = (out[k] ?? 0) + v;
    return out;
  };
  const out = s.net.links.filter((l) => !linkMeasured(l)).map((l) => l.id);
  const outside = {
    change: Object.fromEntries(COMPARISONS.map((c) => [c, s.paired(per((x) => sumLinks(x.counts[c].all, out) - sumLinks(x.counts.baseline.all, out)))])) as Record<Comparison, Effect>,
  };
  const notes: string[] = [];
  if (nSeeds < 10) notes.push(`${nSeeds} seed${nSeeds === 1 ? '' : 's'}: fewer than the 10 pairs the reporting method needs, so every interval status reads insufficient.`);
  const skipped = (['baseline', 'closure', 'package'] as Role[]).some((r) => s.seeds.some((x) => x.coverage[r].skippedEvents > 0));
  if (skipped) notes.push('Route detail was capped in at least one run: requests without detail are counted, not described, and block decompositions that need them are marked unavailable.');
  return {
    schema: REDISTRIBUTION_SCHEMA, method: DIAGNOSTIC_METHOD, reportMethod: 'paired-t-1', kind: 'redistribution',
    disclaimer: 'A simulation of an uncalibrated model, not a forecast or a field measurement. Possible paths are legal routes, not traffic. Cohort routes are what the selected simulated trips drove. Net changes are all cars on a block.',
    identity: s.identity, calibration: s.calibration, graph: s.graph,
    cohort: {
      definition: s.identity.selector === 'direct'
        ? 'Baseline car trips (requested in the period, not placed at the start) that drove a movement or link the closure removes, within the window.'
        : 'Baseline car trips that crossed the closed junctions by any movement within the window (broader selector).',
      perSeed: s.seeds.map((x) => x.cohort.size), total: s.seeds.reduce((a, x) => a + x.cohort.size, 0),
      initialTraversals: s.seeds.reduce((a, x) => a + x.cohort.initialTraversals, 0), baselineNoDetail: s.seeds.reduce((a, x) => a + x.cohort.baselineNoDetail, 0),
      baselineOutcomes: addRec((x) => x.baselineOutcomes),
      outcomes: { closure: addRec((x) => x.outcomes.closure), package: addRec((x) => x.outcomes.package) },
      routeChanged: { closure: addRec((x) => x.routeChanged.closure), package: addRec((x) => x.routeChanged.package) },
      routes: [...routes.values()].sort((a, b) => b.counts.baseline + b.counts.closure + b.counts.package - (a.counts.baseline + a.counts.closure + a.counts.package) || a.key.localeCompare(b.key)),
      matching: { closure: addRec((x) => x.matching.closure), package: addRec((x) => x.matching.package) },
    },
    blocks, outside,
    health: { baseline: s.seeds.map((x) => x.health.baseline), closure: s.seeds.map((x) => x.health.closure), package: s.seeds.map((x) => x.health.package) },
    coverage: { baseline: s.seeds.map((x) => x.coverage.baseline), closure: s.seeds.map((x) => x.coverage.closure), package: s.seeds.map((x) => x.coverage.package) },
    notes,
  };
}

// ---------------------------------------------------------------- stored diagnostics

export type StoredState =
  | { ok: true; result: RedistributionResult }
  | { ok: false; reason: string };

/** Canonical form of a scenario: its interventions in a fixed order, so links that list the same items differently compare equal. */
export const scenarioKey = (ivs: Intervention[]) => ivs.map((iv) => JSON.stringify(Object.fromEntries(Object.entries(iv).sort(([a], [b]) => a.localeCompare(b))))).sort().join('|');

/** A stored diagnostic is reused only for the inputs it was made on: schema, method, hashes, simulator, period and scenarios. */
export function checkStored(x: unknown, want: { network: string | null; demand: string | null; simulator: string | null; period: string; closure: Intervention[]; package: Intervention[] }): StoredState {
  const r = x as RedistributionResult | null;
  if (!r || typeof r !== 'object' || r.kind !== 'redistribution') return { ok: false, reason: 'not a redistribution diagnostic' };
  if (r.schema !== REDISTRIBUTION_SCHEMA) return { ok: false, reason: `schema ${String(r.schema)}; this reader reads ${REDISTRIBUTION_SCHEMA}` };
  if (r.method !== DIAGNOSTIC_METHOD) return { ok: false, reason: `method ${String(r.method)}; this reader uses ${DIAGNOSTIC_METHOD}` };
  const h = r.identity?.hashes;
  const pre = (a: string | null, b: string | undefined) => a === null || (!!b && b.length >= 8 && a.toLowerCase().startsWith(b.toLowerCase()));
  if (!pre(want.network, h?.network)) return { ok: false, reason: 'made on another network file' };
  if (!pre(want.demand, h?.demand)) return { ok: false, reason: 'made on another demand file' };
  if (want.simulator !== null && h?.simulator !== want.simulator) return { ok: false, reason: 'made by another simulator version' };
  if (r.identity.period !== want.period) return { ok: false, reason: `made for period ${r.identity.period}` };
  const ivs = (role: Role) => r.identity.scenarios?.find((x) => x.role === role)?.interventions;
  const c = ivs('closure'), p = ivs('package');
  if (!c || !p || scenarioKey(c) !== scenarioKey(want.closure) || scenarioKey(p) !== scenarioKey(want.package)) return { ok: false, reason: 'made for other scenarios' };
  return { ok: true, result: r };
}

// ---------------------------------------------------------------- where displaced through cars go (closure sweep)

/** Through trips (neither end in the study area) of the baseline that drove the closure in the window, and where they went with it. */
export interface Displacement {
  displaced: number;
  /** Mutually exclusive: drives a study-area residential or service block it did not drive in the baseline; does not (arterials and
   *  streets it already used); still waiting to start; removed; found no route; not paired. */
  local: number; arterialOnly: number; pending: number; removed: number; unroutable: number; unmatched: number;
  /** Followed trips per newly driven local block (block index): the bypasses they took. */
  byBlock: Map<number, number>;
  /** Followed trips per route near the closure in the scenario. */
  routes: Map<string, number>;
}

export function displacement(o: {
  baseline: TraceRun; scenario: TraceRun; selector: Selector; seconds: number; geo: Geo; centers: [number, number][];
  isLocal: boolean[]; blockOf: number[];
}): Displacement {
  const B = parseTrace(o.baseline), S = parseTrace(o.scenario);
  const sel = new Set(o.selector.movements.map(([a, b]) => `${a}>${b}`));
  const selLinks = new Set(o.selector.links);
  const closedBlocks = new Set(o.selector.links.map((l) => o.blockOf[l]));
  const d: Displacement = { displaced: 0, local: 0, arterialOnly: 0, pending: 0, removed: 0, unroutable: 0, unmatched: 0, byBlock: new Map(), routes: new Map() };
  for (let i = 0; i < B.reqs.length; i++) {
    const r = B.reqs[i];
    if (r.stratum !== 0 || !r.detail || o.geo.inStudy[r.origin] || o.geo.inStudy[r.dest]) continue;
    if (!traverses(B, i, sel, selLinks, o.seconds)) continue;
    d.displaced++;
    const j = S.byKey.get(key(r));
    if (j === undefined || !sameRequest(r, S.reqs[j]) || !S.reqs[j].detail) { d.unmatched++; continue; }
    const s = S.reqs[j];
    if (s.state === 'pending') { d.pending++; continue; }
    if (s.state === 'unroutable') { d.unroutable++; continue; }
    const path = Array.from(S.links.subarray(S.off[j], S.off[j + 1]));
    if (s.state === 'active' && s.cur >= 0) path.push(s.cur);
    const k = localPart(o.geo, o.centers, path).key || FAR_ROUTE;
    d.routes.set(k, (d.routes.get(k) ?? 0) + 1);
    // Local blocks the trip drives now and did not drive in the baseline: where it reappears.
    const before = new Set(Array.from(B.links.subarray(B.off[i], B.off[i + 1])).map((l) => o.blockOf[l]));
    const blocks = new Set(path.filter((l) => o.isLocal[l]).map((l) => o.blockOf[l]).filter((b) => b >= 0 && !closedBlocks.has(b) && !before.has(b)));
    if (s.state === 'removed') d.removed++;
    else if (blocks.size) d.local++;
    else d.arterialOnly++;
    if (s.state !== 'removed') for (const b of blocks) d.byBlock.set(b, (d.byBlock.get(b) ?? 0) + 1);
  }
  return d;
}
