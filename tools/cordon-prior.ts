// Cordon prior of a sub-area model (change compact-model-extent, design D8). An area whose `extent.parent` names another area takes its demand
// prior from that parent: the parent's car flows are assigned on the parent's own fit costs (the capacity-restrained probit assignment of
// tools/lib/assign.ts with the parent demand config's settings [PowellSheffi1982] [Sheffi1985], loaded at the flows' own volumes) and every route
// is cut where it crosses the child's extent (tools/lib/cordon.ts). Writes target/cordon/<child>.<view>.prior.json for tools/build-demand.ts:
// `shipped` from the parent's shipped demand, `training` from the parent's cross-validation demand.
//   npx tsx tools/cordon-prior.ts [child area id ...]   (default: every area with extent.parent)
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { assignMsa, buildGraph, type ALink, type ANode, type OdFlow } from './lib/assign';
import { linkCapacity, type NetLinkIn } from './lib/demand-fit';
import { buildCordon, cutRoute, type CNet } from './lib/cordon';
import { writeFileAtomic } from './lib/atomic';

const root = resolve(import.meta.dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const sha = (p: string) => createHash('sha256').update(readFileSync(resolve(root, p))).digest('hex');

interface WireVia { from: number; to: number; then?: WireVia }
interface WireFlow { origin: number; destination: number; vehPerHour: number; mode?: string; via?: WireVia }
interface Net extends CNet { links: (CNet['links'][number] & NetLinkIn & ALink)[]; nodes: (CNet['nodes'][number] & ANode)[]; turnBans?: { from: number; to: number; periods?: string[] }[] }

export function priorFor(childId: string) {
  const area = JSON.parse(read(`data/areas/${childId}.json`));
  const parentId: string | undefined = area.extent?.parent;
  if (!parentId) throw new Error(`${childId}: the area's extent names no parent`);
  const pcfg = JSON.parse(read(`data/demand/${parentId}.config.json`));
  const parentNet: Net = JSON.parse(read(pcfg.network));
  const childNetPath = `public/data/${childId}.network.json`;
  const childNet: Net = JSON.parse(read(childNetPath));
  const cordon = buildCordon(parentNet, childNet, area.extent.polygon ?? null);
  const fwChild = new Set<number>();
  const touch = new Map<number, string[]>();
  for (const l of childNet.links) for (const n of [l.from, l.to]) (touch.get(n) ?? touch.set(n, []).get(n)!).push(l.class);
  for (const n of childNet.nodes) if (n.gate && (touch.get(n.id) ?? []).every((c) => c === 'motorway')) fwChild.add(n.id);
  const as = pcfg.countFit.assignment;
  const capTable = pcfg.countFit.capacityGuard.capacity;
  const nodeBy = new Map(parentNet.nodes.map((n) => [n.id, n]));
  const views: [string, string][] = [['shipped', pcfg.output], ['training', pcfg.countFit.validation.demandOutput]];
  mkdirSync(resolve(root, 'target/cordon'), { recursive: true });
  for (const [view, demandPath] of views) {
    if (!existsSync(resolve(root, demandPath))) { console.warn(`${childId} ${view}: no parent demand at ${demandPath}; skipped`); continue; }
    const demand = JSON.parse(read(demandPath));
    const periods: Record<string, { flows: [number, number, number][]; stats: Record<string, number> }> = {};
    for (const per of demand.periods as { id: string; flows: WireFlow[] }[]) {
      const cars = per.flows.filter((f) => !f.mode);
      // Flows pinned to a counted turn (assumed movements: a `via` on a surface link) are left out; the child build makes its own from the same counts.
      // Ramp-choice flows (a `via` on a freeway link) stay, routed through their ramp, and come out as plain trips; the child build chooses ramps again.
      const assumed = (f: WireFlow) => { for (let v = f.via; v; v = v.then) if (parentNet.links[v.from].class !== 'motorway') return true; return false; };
      const kept = cars.filter((f) => !assumed(f));
      const stats: Record<string, number> = { parentCars: cars.reduce((a, f) => a + f.vehPerHour, 0), assumedLeftOut: cars.filter(assumed).reduce((a, f) => a + f.vehPerHour, 0), crossing: 0, lostGate: 0, lostNode: 0, freewayToFreeway: 0, routes: 0 };
      const od: OdFlow[] = kept.map((f) => ({ origin: f.origin, destination: f.destination, ...(f.via ? { via: { a: f.via.from, b: f.via.to } } : {}) }));
      const g = buildGraph(parentNet.nodes, parentNet.links, parentNet.turnBans ?? [], per.id);
      const capacity = parentNet.links.map((l, i) => linkCapacity(l, nodeBy.get(l.to)!, g.minor[i], capTable).cap);
      const nRoutes = new Float64Array(kept.length);
      const cuts: Map<string, number>[] = kept.map(() => new Map());
      const lost: { gate: number; node: number }[] = kept.map(() => ({ gate: 0, node: 0 }));
      assignMsa(g, od, kept.map((f) => f.vehPerHour), {
        iterations: as.iterations, drawsPerPass: as.drawsPerPass, alpha: as.alpha, beta: as.beta, dispersion: as.dispersion, capacity,
        onRoute: (k, route) => {
          nRoutes[k]++;
          for (const c of cutRoute(cordon, parentNet.links, route, kept[k].origin, kept[k].destination)) {
            if ('lost' in c) { lost[k][c.lost]++; continue; }
            const key = `${c.o}>${c.d}`;
            cuts[k].set(key, (cuts[k].get(key) ?? 0) + 1);
          }
        },
      });
      const table = new Map<string, number>();
      kept.forEach((f, k) => {
        if (!nRoutes[k]) return;
        const w = f.vehPerHour / nRoutes[k];
        stats.lostGate += lost[k].gate * w; stats.lostNode += lost[k].node * w;
        for (const [key, n] of cuts[k]) {
          const [o, d] = key.split('>').map(Number);
          if (fwChild.has(o) && fwChild.has(d)) { stats.freewayToFreeway += n * w; continue; }
          table.set(key, (table.get(key) ?? 0) + n * w);
        }
      });
      stats.routes = [...nRoutes].reduce((a, b) => a + b, 0);
      stats.crossing = [...table.values()].reduce((a, b) => a + b, 0);
      periods[per.id] = { flows: [...table].map(([key, v]) => { const [o, d] = key.split('>').map(Number); return [o, d, Math.round(v * 1000) / 1000] as [number, number, number]; }).filter((r) => r[2] > 0).sort((a, b) => a[0] - b[0] || a[1] - b[1]), stats: Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, Math.round(v * 10) / 10])) };
      console.log(`${childId} ${view} ${per.id}: parent cars ${stats.parentCars.toFixed(0)} veh/h (assumed movement flows left out ${stats.assumedLeftOut.toFixed(0)}); prior ${stats.crossing.toFixed(0)} veh/h in ${periods[per.id].flows.length} pairs; freeway to freeway left out ${stats.freewayToFreeway.toFixed(0)}; lost at an unmatched gate ${stats.lostGate.toFixed(1)}, at an unmatched node ${stats.lostNode.toFixed(1)}`);
    }
    const out = { version: 1, area: childId, parent: parentId, view, inputs: { parentNetwork: sha(pcfg.network), parentDemand: sha(demandPath), childNetwork: sha(childNetPath), parentConfig: sha(`data/demand/${parentId}.config.json`) }, assignment: { method: 'msa', iterations: as.iterations, drawsPerPass: as.drawsPerPass, alpha: as.alpha, beta: as.beta, dispersion: as.dispersion }, periods };
    writeFileAtomic(resolve(root, `target/cordon/${childId}.${view}.prior.json`), JSON.stringify(out));
  }
}

if (process.argv[1]?.endsWith('cordon-prior.ts')) {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(resolve(root, 'data/areas')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).filter((id) => JSON.parse(read(`data/areas/${id}.json`)).extent?.parent);
  for (const id of ids) priorFor(id);
}
