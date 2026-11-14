// Assumed movement flows for the demand builder (calibration round 20; ASSUMPTION, decision recorded in the OpenSpec design of change assumed-movement-flows). No I/O.
// A turning movement that a count shows and that the trip table cannot reach (the router prefers other routes, so the multiplicative fit has nothing to scale)
// gets seed flows that must make it. The pairs come from the trip table: a flow whose route through the movement costs at most `maxDetour` times its best route
// (free-flow generalized cost of the simulator's router) is a plausible user. The counted volume is split over those flows in proportion to their seed volume,
// `throughShare` of it over flows with no end in the study area and the rest over flows with an end inside. The flows carry `via` (the movement), which the
// simulator honors and the fit pins at this volume.
import { costToGo, treeFrom, type Graph } from './assign';
import type { FlowIn } from './demand-fit';

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
}

export interface AssumedReport {
  id: string; label: string; period: string; target: number; candidates: number; candidateVeh: number; throughCandidates: number; localCandidates: number;
  throughVeh: number; localVeh: number; flows: number; medianDetour: number; maxDetourUsed: number;
  topOrigins: { id: number; veh: number }[]; topDestinations: { id: number; veh: number }[];
  note?: string;
}

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
export function assumedMovementFlows(cfg: AssumedMovementCfg, a: number, b: number, target: number, period: string, seed: FlowIn[], g: Graph, inStudy: (node: number) => boolean): { flows: FlowIn[]; report: AssumedReport } {
  let mvCost = Infinity;
  for (let m = g.mvStart[a]; m < g.mvStart[a + 1]; m++) if (g.mvTo[m] === b) mvCost = g.mvCost[m];
  const report: AssumedReport = { id: cfg.id, label: cfg.label, period, target, candidates: 0, candidateVeh: 0, throughCandidates: 0, localCandidates: 0, throughVeh: 0, localVeh: 0, flows: 0, medianDetour: NaN, maxDetourUsed: 0, topOrigins: [], topDestinations: [] };
  if (!isFinite(mvCost)) { report.note = 'the movement does not exist in this period (turn ban or missing link)'; return { flows: [], report }; }
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
  return { flows, report };
}

export function assumedReportLines(rs: AssumedReport[], nodeLabel: (id: number) => string): string[] {
  const L = ['', '## Assumed movement flows (ASSUMPTION)', '', 'A counted turning movement that the trip table cannot reach gets flows that must make it. Candidates are the flows of the seed table whose route through the movement costs at most the detour limit times their best route; the counted volume is split over them in proportion to their seed volume, with the stated share over flows that have no end in the study area (through cars). Their volume is pinned in the fit.', '',
    '| Movement | Period | Counted (veh/h) | Candidate flows (through / local) | Candidate volume | Assumed flows | Through (veh/h) | Local (veh/h) | Median detour | Largest detour used |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  for (const r of rs) L.push(`| ${r.label} | ${r.period} | ${r.target.toFixed(0)} | ${r.candidates} (${r.throughCandidates} / ${r.localCandidates}) | ${r.candidateVeh.toFixed(0)} | ${r.flows} | ${r.throughVeh.toFixed(0)} | ${r.localVeh.toFixed(0)} | ${Number.isFinite(r.medianDetour) ? r.medianDetour.toFixed(2) : '-'} | ${r.maxDetourUsed.toFixed(2)} |`);
  for (const r of rs) {
    if (r.note) L.push('', `${r.label}, ${r.period}: ${r.note}.`);
    if (r.topOrigins.length) L.push('', `${r.label}, ${r.period}: largest origins ${r.topOrigins.map((o) => `${nodeLabel(o.id)} ${o.veh.toFixed(0)}`).join(', ')}; largest destinations ${r.topDestinations.map((o) => `${nodeLabel(o.id)} ${o.veh.toFixed(0)}`).join(', ')}.`);
  }
  return L;
}
