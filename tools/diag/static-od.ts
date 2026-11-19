// Diagnostic only (router-diagnosis): the demand fit's static free-flow cost of the through trips that drove the diagonal in a simulated run,
// diagonal-allowed best against the best route with the study area's local streets closed.
// usage: tsx tools/diag/static-od.ts <od-costs.json> [local-factor]
import { readFileSync } from 'node:fs';
import { buildGraph, SIM_ROUTE_PARAMS, treeFrom } from '../lib/assign';
const net = JSON.parse(readFileSync('public/data/rockridge.network.json', 'utf8'));
const od = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const lf = process.argv[3] ? Number(process.argv[3]) : SIM_ROUTE_PARAMS.localCostFactor;
const g = buildGraph(net.nodes, net.links, net.turnBans ?? [], 'pm_peak', { ...SIM_ROUTE_PARAMS, localCostFactor: lf });
const links = net.links as any[];
const banned = links.map((l) => l.inStudyArea && (l.class === 'residential' || l.class === 'service'));
const costBan = Float64Array.from(g.cost, (c, i) => (banned[i] ? Infinity : c));
const ff = (l: number) => g.length[l] / Math.max(links[l].speedLimit, 1);
const diag = (od.trips as any[]).filter((t) => t.blocks.some((b: string) => ['link 1933', 'link 1868', 'link 2697', 'link 1831'].includes(b)));
const names = (p: number[]) => { const o: string[] = []; for (const l of p) { const n = links[l].name ?? '?'; if (o[o.length - 1] !== n) o.push(n); } return o; };
const rows: any[] = [];
const cache = new Map<string, any>();
for (const t of diag) {
  const key = `${t.origin}`;
  let tr = cache.get(key);
  if (!tr) { tr = { all: treeFrom(g, t.origin, null), ban: treeFrom(g, t.origin, null, costBan) }; cache.set(key, tr); }
  const best = (tree: any) => { let b = -1, bd = Infinity; for (const l of g.inLinks.get(t.dest) ?? []) if (tree.dist[l] < bd) { bd = tree.dist[l]; b = l; } const p: number[] = []; for (let l = b; l >= 0; l = tree.pred[l]) p.push(l); return { d: bd, p: p.reverse() }; };
  const a = best(tr.all), b = best(tr.ban);
  const useDiag = a.p.some((l) => [1933, 1868, 2697, 1831, 2055].includes(l)) || a.p.some((l) => banned[l] && ['McAuley Street', '60th Street', 'Ayala Avenue', 'Howell Street', 'Forest Street'].includes(links[l].name));
  rows.push({ og: t.og, dg: t.dg, staticBest: a.d, staticArt: b.d, gap: b.d - a.d, bestUsesDiag: useDiag, bestStreets: names(a.p).join('>'), artStreets: names(b.p).join('>'), simGap: t.alt?.terms.perceived - t.drove.terms.perceived });
}
const mean = (x: number[]) => x.reduce((s, v) => s + v, 0) / (x.length || 1);
console.log('local factor', lf, 'diag trips', rows.length);
console.log('static: best route uses the diagonal for', rows.filter((r) => r.bestUsesDiag).length, 'of', rows.length, '; mean gap (arterial - best) s', mean(rows.map((r) => r.gap)).toFixed(1), 'sim mean gap', mean(rows.map((r) => r.simGap).filter((x) => isFinite(x))).toFixed(1));
const by = new Map<string, any[]>();
for (const r of rows) (by.get(`${r.og}>${r.dg}`) ?? by.set(`${r.og}>${r.dg}`, []).get(`${r.og}>${r.dg}`)!).push(r);
for (const [k, v] of [...by].sort((a, b) => b[1].length - a[1].length).slice(0, 10)) console.log(k, v.length, 'static gap', mean(v.map((r) => r.gap)).toFixed(0), 'static best', mean(v.map((r) => r.staticBest)).toFixed(0), 'art', mean(v.map((r) => r.staticArt)).toFixed(0), 'sim gap', mean(v.map((r) => r.simGap).filter((x) => isFinite(x))).toFixed(0), 'diag in static best', v.filter((r) => r.bestUsesDiag).length, '|', v[0].bestStreets, '||', v[0].artStreets);
