// Assumed movement flows for the demand builder (calibration round 20; ASSUMPTION, decision recorded in the OpenSpec design of change assumed-movement-flows). No I/O.
// Round 21 (change through-trip-intents): a movement can carry `intents`, each a named origin group, destination group and volume ("Southbound Telegraph Ave traffic using Colby St to reach SR-24").
// The candidates of an intent are the candidate flows whose origin and destination lie in its groups, so through cars are placed by where drivers come from and go to, not spread over the seed table by volume.
// A turning movement that a count shows and that the trip table cannot reach (the router prefers other routes, so the multiplicative fit has nothing to scale)
// gets seed flows that must make it. The pairs come from the trip table: a flow whose route through the movement costs at most `maxDetour` times its best route
// (free-flow generalized cost of the simulator's router) is a plausible user. The counted volume is split over those flows in proportion to their seed volume,
// `throughShare` of it over flows with no end in the study area and the rest over flows with an end inside. The flows carry `via` (the movement), which the
// simulator honors and the fit pins at this volume.
import { costToGo, treeFrom, type Graph } from './assign';
import type { FlowIn } from './demand-fit';
import { STUDY_GROUP } from './approach-groups';

export interface AssumedMovementCfg {
  id: string; label: string;
  /** A movement of the volunteer count file (junction names, approach, exit text) the movement is read from; its station targets give the volume per period. */
  count: { at: string[]; from: string; to: string };
  /** Share of the volume given to flows with no end in the study area (through cars). ASSUMPTION; the data say how many cars drive the whole street. */
  throughShare: number;
  /** A flow is a candidate when its route through the movement costs at most this multiple of its best route (ASSUMPTION). */
  maxDetour: number;
  /** Assumed flows below this volume (veh/h) are dropped and their volume shared by the others. */
  minFlowVehPerHour: number;
  /** Share of the counted volume the flows carry (1 = the whole count; the natural flows through the movement fall to their lower bound in the fit). */
  countShare?: number;
  /** Where the cars that make the movement come from and go to. When present they replace `throughShare`: only flows between the groups of an intent are candidates. */
  intents?: IntentCfg[];
}

/** One intent of an assumed movement (ASSUMPTION unless `basis` says the volume is read from a count). Group ids, set ids or the reserved `study-area` (see tools/lib/approach-groups.ts). */
export interface IntentCfg {
  id: string; label: string;
  fromGroup: string | string[]; toGroup: string | string[];
  /** Share of the movement's counted volume (every period). */
  share?: number;
  /** Veh/h in the PM peak; other periods scale with the movement's counted volume. */
  vehPerHour?: number;
  basis: string;
}

/** What the intent code needs to know about groups. */
export interface GroupCtx { groupOf: (node: number) => string; expand: (ref: string | string[]) => string[] }

export interface IntentReport { id: string; label: string; volume: number; candidates: number; flows: number; assigned: number; carved: number; note?: string }

export interface AssumedReport {
  id: string; label: string; period: string; target: number; candidates: number; candidateVeh: number; throughCandidates: number; localCandidates: number;
  throughVeh: number; localVeh: number; flows: number; medianDetour: number; maxDetourUsed: number;
  topOrigins: { id: number; veh: number }[]; topDestinations: { id: number; veh: number }[];
  note?: string;
  intents?: IntentReport[];
}

/** Volume to take off each seed flow (index into the seed list) because an assumed flow of the same pair now carries those trips. */
export type Carve = Map<number, number>;

/** True when the shortest way on from link `b` to node `dest` (descending the cost-to-go `h`) enters a node of `seen` (the first leg), that is, the route through the movement loops. */
function loops(g: Graph, h: Float64Array, b: number, dest: number, seen: Set<number>): boolean {
  let l = b;
  for (let steps = 0; steps < 4000; steps++) {
    if (g.to[l] === dest) return false;
    if (seen.has(g.to[l])) return true;
    let nb = -1, bc = Infinity;
    for (let m = g.mvStart[l]; m < g.mvStart[l + 1]; m++) { const c = g.mvCost[m] + h[g.mvTo[m]]; if (c < bc) { bc = c; nb = g.mvTo[m]; } }
    if (nb < 0 || !isFinite(bc)) return true;
    l = nb;
  }
  return true;
}

/** The flows that make movement a -> b (link positions) with `target` veh/h in total, chosen from `seed`, and a report of the choice. */
export function assumedMovementFlows(cfg: AssumedMovementCfg, a: number, b: number, target: number, period: string, seed: FlowIn[], g: Graph, inStudy: (node: number) => boolean, grp?: GroupCtx, ratio = 1): { flows: FlowIn[]; report: AssumedReport; carve: Carve } {
  const carve: Carve = new Map();
  let mvCost = Infinity;
  for (let m = g.mvStart[a]; m < g.mvStart[a + 1]; m++) if (g.mvTo[m] === b) mvCost = g.mvCost[m];
  const report: AssumedReport = { id: cfg.id, label: cfg.label, period, target, candidates: 0, candidateVeh: 0, throughCandidates: 0, localCandidates: 0, throughVeh: 0, localVeh: 0, flows: 0, medianDetour: NaN, maxDetourUsed: 0, topOrigins: [], topDestinations: [] };
  if (!isFinite(mvCost)) { report.note = 'the movement does not exist in this period (turn ban or missing link)'; return { flows: [], report, carve }; }
  const byOrigin = new Map<number, number[]>();
  seed.forEach((f, k) => { if (f.mode || f.vehPerHour <= 0) return; (byOrigin.get(f.origin) ?? byOrigin.set(f.origin, []).get(f.origin)!).push(k); });
  const toGo = new Map<number, Float64Array>();
  const cand: { k: number; detour: number; through: boolean }[] = [];
  for (const [o, ks] of byOrigin) {
    const { dist, pred } = treeFrom(g, o, null);
    if (!isFinite(dist[a])) continue;
    // Nodes of the first leg (origin to the movement's approach link): a route that comes back to one of them loops.
    const leg1 = new Set<number>();
    for (let l = a; l >= 0; l = pred[l]) leg1.add(g.from[l]);
    for (const k of ks) {
      const f = seed[k];
      const d = f.destination;
      let h = toGo.get(d);
      if (!h) { h = costToGo(g, d, g.cost); toGo.set(d, h); }
      if (!isFinite(h[b])) continue;
      let direct = Infinity;
      for (const l of g.inLinks.get(d) ?? []) if (dist[l] < direct) direct = dist[l];
      if (!isFinite(direct) || direct <= 0) continue;
      const via = dist[a] + mvCost + h[b];
      const detour = via / direct;
      if (detour > cfg.maxDetour || loops(g, h, b, d, leg1)) continue;
      cand.push({ k, detour, through: !inStudy(o) && !inStudy(d) });
    }
  }
  report.candidates = cand.length;
  report.candidateVeh = cand.reduce((s, c) => s + seed[c.k].vehPerHour, 0);
  report.throughCandidates = cand.filter((c) => c.through).length;
  report.localCandidates = cand.length - report.throughCandidates;
  const ds = cand.map((c) => c.detour).sort((x, y) => x - y);
  report.medianDetour = ds.length ? ds[Math.floor(ds.length / 2)] : NaN;
  const total = target * (cfg.countShare ?? 1);
  if (cfg.intents?.length) {
    if (!grp) throw new Error(`assumed movement ${cfg.id}: intents need approach groups`);
    return { flows: intentFlows(cfg, cfg.intents, cand, seed, grp, total, ratio, a, b, report, carve), report, carve };
  }
  const wT = cand.filter((c) => c.through).reduce((s, c) => s + seed[c.k].vehPerHour, 0), wL = report.candidateVeh - wT;
  // With no candidate of one kind its share goes to the other, and the report says so.
  let sT = cfg.throughShare;
  if (wT <= 0) sT = 0;
  if (wL <= 0) sT = 1;
  if (sT !== cfg.throughShare && total > 0) report.note = `no ${wT <= 0 ? 'through' : 'local'} candidates: the whole volume went to the other kind`;
  let keep = cand.filter((c) => (c.through ? sT * total * seed[c.k].vehPerHour / wT : (1 - sT) * total * seed[c.k].vehPerHour / wL) >= cfg.minFlowVehPerHour);
  // Drop the small flows, then restore each kind's total over the flows that stay.
  const wTk = keep.filter((c) => c.through).reduce((s, c) => s + seed[c.k].vehPerHour, 0), wLk = keep.filter((c) => !c.through).reduce((s, c) => s + seed[c.k].vehPerHour, 0);
  keep = keep.filter((c) => (c.through ? wTk > 0 : wLk > 0));
  const flows: FlowIn[] = keep.map((c) => {
    const f = seed[c.k];
    const v = c.through ? sT * total * f.vehPerHour / wTk : (1 - sT) * total * f.vehPerHour / wLk;
    return { origin: f.origin, destination: f.destination, vehPerHour: Math.round(v * 1000) / 1000, via: { a, b } };
  });
  report.flows = flows.length;
  report.throughVeh = keep.reduce((s, c, i) => s + (c.through ? flows[i].vehPerHour : 0), 0);
  report.localVeh = flows.reduce((s, f) => s + f.vehPerHour, 0) - report.throughVeh;
  report.maxDetourUsed = keep.reduce((m, c) => Math.max(m, c.detour), 0);
  const top = (key: 'origin' | 'destination') => { const m = new Map<number, number>(); for (const f of flows) m.set(f[key], (m.get(f[key]) ?? 0) + f.vehPerHour); return [...m].sort((x, y) => y[1] - x[1]).slice(0, 6).map(([id, veh]) => ({ id, veh })); };
  report.topOrigins = top('origin');
  report.topDestinations = top('destination');
  return { flows, report, carve };
}

/** Intent flows: each intent takes the candidates between its groups and splits its volume over them in proportion to their seed volume. A pair that two intents share is one flow. */
function intentFlows(cfg: AssumedMovementCfg, intents: IntentCfg[], cand: { k: number; detour: number; through: boolean }[], seed: FlowIn[], grp: GroupCtx, total: number, ratio: number, a: number, b: number, report: AssumedReport, carve: Carve): FlowIn[] {
  const volumes = intents.map((it) => {
    if ((it.share === undefined) === (it.vehPerHour === undefined)) throw new Error(`assumed movement ${cfg.id}, intent ${it.id}: give exactly one of share and vehPerHour`);
    return it.share !== undefined ? it.share * total : it.vehPerHour! * ratio;
  });
  const sum = volumes.reduce((x, y) => x + y, 0);
  if (sum > total + 1e-6) throw new Error(`assumed movement ${cfg.id}: the intents add up to ${sum.toFixed(1)} veh/h, more than the ${total.toFixed(1)} veh/h counted`);
  const byPair = new Map<number, number>();
  const detourOf = new Map<number, number>();
  report.intents = [];
  intents.forEach((it, i) => {
    const from = new Set(grp.expand(it.fromGroup)), to = new Set(grp.expand(it.toGroup));
    const c = cand.filter((x) => from.has(grp.groupOf(seed[x.k].origin)) && to.has(grp.groupOf(seed[x.k].destination)));
    const ir: IntentReport = { id: it.id, label: it.label, volume: volumes[i], candidates: c.length, flows: 0, assigned: 0, carved: 0 };
    report.intents!.push(ir);
    if (volumes[i] <= 0) return;
    if (!c.length) { ir.note = 'no candidate flow between these groups within the detour limit: the volume is not assigned'; return; }
    // Flows below the minimum drop out and the volume is restored over those that stay.
    const w = (x: { k: number }) => seed[x.k].vehPerHour;
    let keep = c;
    for (let pass = 0; pass < 4; pass++) {
      const t = keep.reduce((acc, x) => acc + w(x), 0);
      const next = keep.filter((x) => volumes[i] * w(x) / t >= cfg.minFlowVehPerHour);
      if (next.length === keep.length || !next.length) break;
      keep = next;
    }
    const t = keep.reduce((acc, x) => acc + w(x), 0);
    for (const x of keep) {
      const v = volumes[i] * w(x) / t;
      byPair.set(x.k, (byPair.get(x.k) ?? 0) + v);
      detourOf.set(x.k, x.detour);
      ir.assigned += v;
      ir.carved += Math.min(v, 0.8 * seed[x.k].vehPerHour);
    }
    ir.flows = keep.length;
  });
  const flows: FlowIn[] = [];
  let through = 0;
  for (const [k, v] of byPair) {
    const f = seed[k];
    const vv = Math.round(v * 1000) / 1000;
    if (vv <= 0) continue;
    flows.push({ origin: f.origin, destination: f.destination, vehPerHour: vv, via: { a, b } });
    if (grp.groupOf(f.origin) !== STUDY_GROUP && grp.groupOf(f.destination) !== STUDY_GROUP) through += vv;
    // The assumed flow now carries these trips: the plain flow of the same pair gives them up, at most 80% of it.
    carve.set(k, Math.min(vv, 0.8 * f.vehPerHour));
  }
  report.flows = flows.length;
  report.throughVeh = through;
  report.localVeh = flows.reduce((x, f) => x + f.vehPerHour, 0) - through;
  report.maxDetourUsed = [...detourOf.values()].reduce((m, d) => Math.max(m, d), 0);
  const top = (key: 'origin' | 'destination') => { const m = new Map<number, number>(); for (const f of flows) m.set(f[key], (m.get(f[key]) ?? 0) + f.vehPerHour); return [...m].sort((x, y) => y[1] - x[1]).slice(0, 6).map(([id, veh]) => ({ id, veh })); };
  report.topOrigins = top('origin');
  report.topDestinations = top('destination');
  return flows;
}

export function assumedReportLines(rs: AssumedReport[], nodeLabel: (id: number) => string): string[] {
  const L = ['', '## Assumed movement flows (ASSUMPTION)', '', 'A counted turning movement that the trip table cannot reach gets flows that must make it. Candidates are the flows of the seed table whose route through the movement costs at most the detour limit times their best route; the counted volume is split over them in proportion to their seed volume, with the stated share over flows that have no end in the study area (through cars). Their volume is pinned in the fit.', '',
    '| Movement | Period | Counted (veh/h) | Candidate flows (through / local) | Candidate volume | Assumed flows | Through (veh/h) | Local (veh/h) | Median detour | Largest detour used |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  for (const r of rs) L.push(`| ${r.label} | ${r.period} | ${r.target.toFixed(0)} | ${r.candidates} (${r.throughCandidates} / ${r.localCandidates}) | ${r.candidateVeh.toFixed(0)} | ${r.flows} | ${r.throughVeh.toFixed(0)} | ${r.localVeh.toFixed(0)} | ${Number.isFinite(r.medianDetour) ? r.medianDetour.toFixed(2) : '-'} | ${r.maxDetourUsed.toFixed(2)} |`);
  const withIntents = rs.filter((r) => r.intents?.length);
  if (withIntents.length) {
    L.push('', '### Intents of the assumed movements (ASSUMPTION)', '', 'An intent names where the cars that make the movement come from and go to (approach groups of the area config). Its candidates are the candidate flows between those groups; its volume is split over them in proportion to their seed volume. The plain flow of each pair gives up the trips the assumed flow carries (at most 80% of it) before the fit, and the fit then rescales it to the counts.', '',
      '| Movement | Period | Intent | Volume (veh/h) | Candidate flows | Flows kept | Assigned (veh/h) | Taken from plain flows (veh/h) |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const r of withIntents) for (const i of r.intents!) L.push(`| ${r.label} | ${r.period} | ${i.label} | ${i.volume.toFixed(1)} | ${i.candidates} | ${i.flows} | ${i.assigned.toFixed(1)} | ${i.carved.toFixed(1)} |`);
    for (const r of withIntents) for (const i of r.intents!) if (i.note) L.push('', `${r.label}, ${r.period}, ${i.label}: ${i.note}.`);
  }
  for (const r of rs) {
    if (r.note) L.push('', `${r.label}, ${r.period}: ${r.note}.`);
    if (r.topOrigins.length) L.push('', `${r.label}, ${r.period}: largest origins ${r.topOrigins.map((o) => `${nodeLabel(o.id)} ${o.veh.toFixed(0)}`).join(', ')}; largest destinations ${r.topDestinations.map((o) => `${nodeLabel(o.id)} ${o.veh.toFixed(0)}`).join(', ')}.`);
  }
  return L;
}
