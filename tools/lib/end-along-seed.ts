// Calibration round 53, D8: seed the origin-destination pairs that end along a counted street. No I/O.
// Where the seed table has fewer cars than the volunteer count's `endAlongVehPerHour` on a select-link run (static routes, before the fit), pairs from the origins that load the run's first
// block to the run's interior nodes are added until the run starts at its target, and the volume is taken from the other inbound pairs of the same node, so no node's destination total changes.
// The proportions (origins by their flow on the first block, destinations by their existing volume) and the 80% cap are ASSUMPTIONS; the targets are DATA. No published reference covers it.
import { assign, buildGraph, SIM_ROUTE_PARAMS, type ANode, type ATurnBan } from './assign';
import { controlDelayArray } from './control-delays';
import { measuredShare, type FitConfig, type FlowIn, type NetLinkIn } from './demand-fit';
import type { FlowType } from './fit-counts';
import { interiorNodes, resolveBlock, type ShareLink, type ShareNode } from './share-targets';
import { throughTargetId } from './through-membership';

/** Most of a node's other inbound volume that seeding may take (ASSUMPTION). */
export const SEED_TAKE_SHARE = 0.8;
/** A candidate pair counts as entering by the run's first block when this share of its static routes does (ASSUMPTION). */
export const SEED_FIRST_BLOCK_SHARE = 0.5;

export interface EndSeedRow {
  run: string; target: number; /** Static-route end-along flow of the seed table before seeding. */ before: number; shortfall: number; added: number; capped: number;
  /** Static-route end-along flow after seeding and taking the volume out of the other pairs. */ after: number; pairs: number; origins: number;
  /** Destination total of each interior node, before and after (equal by construction). */ nodes: { node: number; before: number; after: number; added: number; capped: number }[];
}
export interface EndSeedResult { flows: FlowIn[]; types: FlowType[]; rows: EndSeedRow[]; /** Keys `o>d` of the pairs that did not exist before seeding. */ keys: Set<string> }

export function seedEndAlong(
  id: string, flows0: FlowIn[], types0: FlowType[], nodes: ANode[], links: NetLinkIn[], bans: ATurnBan[], cfg: FitConfig, typeOf: (o: number, d: number) => FlowType,
): EndSeedResult | undefined {
  const sw = cfg.through?.simulated?.endAlong;
  const blockPairs = cfg.through?.measured?.[id]?.blocks;
  if (!sw?.seedPairs || !cfg.shares || !blockPairs) return undefined;
  const nodeBy = new Map(nodes.map((n) => [n.id, n as unknown as ShareNode & { gate?: boolean }]));
  const g = buildGraph(nodes, links, bans, id, SIM_ROUTE_PARAMS, controlDelayArray(links, id, cfg.controlDelays));
  const skip = new Set(sw.skip);
  let flows: FlowIn[] = flows0.map((f) => ({ ...f }));
  const types: FlowType[] = [...types0];
  const key = (o: number, d: number) => `${o}>${d}`;
  const index = new Map(flows.map((f, k) => [key(f.origin, f.destination), k]));
  const keys = new Set<string>();
  const rows: EndSeedRow[] = [];
  // static shares of the first block and of any link of the run, per flow; flows with a pinned via movement are not assigned and count 0
  const shares = (list: FlowIn[], first: number, run: number[]) => {
    const idx = list.map((_, k) => k).filter((k) => !list[k].via);
    const a = assign(g, idx.map((k) => ({ origin: list[k].origin, destination: list[k].destination, vehPerHour: Math.max(list[k].vehPerHour, 1e-6) })), cfg.draws, cfg.dispersion, [{ kind: 'any', links: [first] }, { kind: 'any', links: run }]);
    const f = new Float64Array(list.length), any = new Float64Array(list.length);
    idx.forEach((k, j) => {
      if (!a.routable[j]) return;
      for (let i = a.feat!.start[j]; i < a.feat!.start[j + 1]; i++) { if (a.feat!.id[i] === 0) f[k] = Math.min(1, a.feat!.share[i]); else any[k] = Math.min(1, a.feat!.share[i]); }
    });
    return { f, any, routable: idx.map((_, j) => !!a.routable[j]), idx };
  };
  for (const t of cfg.shares.targets.selectLink ?? []) {
    const target = t.endAlongVehPerHour?.[id], label = `${t.street} ${t.direction}`;
    if (!(target !== undefined && target > 0) || skip.has(label)) continue;
    const run = resolveBlock(links as unknown as ShareLink[], nodeBy as never, t.street, t.direction, t.between ?? []).links;
    if (!run.length) continue;
    const interior = new Set(interiorNodes(links as unknown as ShareLink[], run));
    if (!interior.size) continue;
    const first = run[0];
    const sIn = shares(flows, first, run);
    const endNow = (s: { any: Float64Array }, list: FlowIn[]) => list.reduce((a, f, k) => a + (interior.has(f.destination) && !f.via ? f.vehPerHour * s.any[k] : 0), 0);
    const before = endNow(sIn, flows), shortfall = target - before;
    const destTotal = (list: FlowIn[]) => new Map([...interior].map((d) => [d, list.reduce((a, f) => a + (f.destination === d ? f.vehPerHour : 0), 0)]));
    const nodesBefore = destTotal(flows);
    if (!(shortfall > 1e-9)) { rows.push({ run: label, target, before, shortfall, added: 0, capped: 0, after: before, pairs: 0, origins: 0, nodes: [...interior].map((d) => ({ node: d, before: nodesBefore.get(d)!, after: nodesBefore.get(d)!, added: 0, capped: 0 })) }); continue; }
    // origins by their flow on the first block: the pair's membership on the run (simulated when the file has trips on it, else static) limited by its static first-block share
    const hits = blockPairs.hits[throughTargetId(label)];
    const stat = Float64Array.from(sIn.any);
    const member = hits ? measuredShare(stat, flows, blockPairs, throughTargetId(label), cfg.through!.priorTrips, (k) => !!flows[k].via, () => false) : stat;
    const wO = new Map<number, number>();
    flows.forEach((f, k) => { if (f.via || interior.has(f.origin)) return; const v = f.vehPerHour * Math.min(sIn.f[k], member[k]); if (v > 0) wO.set(f.origin, (wO.get(f.origin) ?? 0) + v); });
    // destinations: interior nodes that are not gates, by their existing destination volume (equal parts when all are zero)
    const dests = [...interior].filter((d) => !nodeBy.get(d)?.gate);
    const dSum = dests.reduce((a, d) => a + nodesBefore.get(d)!, 0);
    const wD = new Map(dests.map((d) => [d, dSum > 0 ? nodesBefore.get(d)! / dSum : 1 / dests.length]));
    const cand: FlowIn[] = [];
    for (const o of wO.keys()) for (const d of dests) if (o !== d) cand.push({ origin: o, destination: d, vehPerHour: 1 });
    const sc = shares(cand, first, run);
    const kept = cand.map((c, k) => ({ c, k })).filter(({ k }) => sc.f[k] >= SEED_FIRST_BLOCK_SHARE && sc.any[k] > 0);
    const wSum = kept.reduce((a, { c }) => a + wO.get(c.origin)! * wD.get(c.destination)!, 0);
    if (!kept.length || !(wSum > 0)) { rows.push({ run: label, target, before, shortfall, added: 0, capped: 0, after: before, pairs: 0, origins: 0, nodes: [...interior].map((d) => ({ node: d, before: nodesBefore.get(d)!, after: nodesBefore.get(d)!, added: 0, capped: 0 })) }); continue; }
    const wt = kept.map(({ c }) => (wO.get(c.origin)! * wD.get(c.destination)!) / wSum);
    // what the other inbound pairs of a node lose when the added volume is taken from them (their own end-along share), so the run starts at its target after the exchange
    const rho = new Map(dests.map((d) => { const inb = flows.map((f, k) => ({ f, k })).filter(({ f }) => f.destination === d && !f.via); const v = inb.reduce((a, { f }) => a + f.vehPerHour, 0); return [d, v > 0 ? inb.reduce((a, { f, k }) => a + f.vehPerHour * sIn.any[k], 0) / v : 0] as const; }));
    const net = kept.reduce((a, { c, k }, j) => a + wt[j] * (sc.any[k] - rho.get(c.destination)!), 0);
    if (!(net > 1e-9)) { rows.push({ run: label, target, before, shortfall, added: 0, capped: 0, after: before, pairs: 0, origins: 0, nodes: [...interior].map((d) => ({ node: d, before: nodesBefore.get(d)!, after: nodesBefore.get(d)!, added: 0, capped: 0 })) }); continue; }
    const V = shortfall / net;
    const addAt = new Map<number, number>();
    kept.forEach(({ c }, j) => addAt.set(c.destination, (addAt.get(c.destination) ?? 0) + V * wt[j]));
    // cap per node, and take the added volume out of the other inbound pairs pro rata
    const cappedBy = new Map<number, number>(), takenBy = new Map<number, number>();
    for (const d of dests) {
      const A = addAt.get(d) ?? 0;
      if (!(A > 0)) continue;
      const base = flows.reduce((a, f) => a + (f.destination === d && !f.via ? f.vehPerHour : 0), 0);
      const take = Math.min(A, SEED_TAKE_SHARE * base);
      cappedBy.set(d, A - take); takenBy.set(d, take);
      if (base > 0) { const keep = 1 - take / base; flows.forEach((f) => { if (f.destination === d && !f.via) f.vehPerHour *= keep; }); }
    }
    let addedTotal = 0;
    kept.forEach(({ c }, j) => {
      const d = c.destination, A = addAt.get(d)!, v = A > 0 ? V * wt[j] * (takenBy.get(d)! / A) : 0;
      if (!(v > 0)) return;
      addedTotal += v;
      const q = key(c.origin, d), at = index.get(q);
      if (at !== undefined) flows[at].vehPerHour += v;
      else { index.set(q, flows.length); flows.push({ origin: c.origin, destination: d, vehPerHour: v }); types.push(typeOf(c.origin, d)); keys.add(q); }
    });
    const sOut = shares(flows, first, run);
    const nodesAfter = destTotal(flows);
    rows.push({
      run: label, target, before, shortfall, added: addedTotal, capped: [...cappedBy.values()].reduce((a, b) => a + b, 0), after: endNow(sOut, flows), pairs: kept.length, origins: new Set(kept.map(({ c }) => c.origin)).size,
      nodes: [...interior].map((d) => ({ node: d, before: nodesBefore.get(d)!, after: nodesAfter.get(d)!, added: takenBy.get(d) ?? 0, capped: cappedBy.get(d) ?? 0 })),
    });
  }
  return rows.length ? { flows, types, rows, keys } : undefined;
}
