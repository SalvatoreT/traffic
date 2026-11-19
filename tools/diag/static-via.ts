// Diagnostic only (router-diagnosis): extra static cost (s) of forcing the best route through a given link, for the trips of an od-costs file.
// usage: tsx tools/diag/static-via.ts <od-costs.json> <block-substring> <linkId> [linkId...]
import { readFileSync } from 'node:fs';
import { buildGraph, treeFrom } from '../lib/assign';
const net = JSON.parse(readFileSync('public/data/rockridge.network.json', 'utf8'));
const od = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const sub = process.argv[3];
const vias = process.argv.slice(4).map(Number);
const g = buildGraph(net.nodes, net.links, net.turnBans ?? [], 'pm_peak');
const idx = new Map<number, number>(net.links.map((l: any, i: number) => [l.id, i]));
const trips = (od.trips as any[]).filter((t) => t.blocks.some((b: string) => b.includes(sub)));
const treeFromLink = (v: number) => {
  const dist = new Float64Array(g.nLinks).fill(Infinity);
  const pred = new Int32Array(g.nLinks).fill(-1);
  const q: [number, number][] = [];
  for (let m = g.mvStart[v]; m < g.mvStart[v + 1]; m++) { const b = g.mvTo[m]; dist[b] = g.mvCost[m] + g.cost[b]; q.push([dist[b], b]); }
  // simple Dijkstra with array scan heap
  const done = new Uint8Array(g.nLinks);
  while (q.length) {
    let bi = 0; for (let i = 1; i < q.length; i++) if (q[i][0] < q[bi][0]) bi = i;
    const [d, a] = q.splice(bi, 1)[0];
    if (done[a] || d > dist[a]) continue; done[a] = 1;
    for (let m = g.mvStart[a]; m < g.mvStart[a + 1]; m++) { const b = g.mvTo[m], nd = d + g.mvCost[m] + g.cost[b]; if (nd < dist[b]) { dist[b] = nd; q.push([nd, b]); } }
  }
  return dist;
};
const fromV = new Map<number, Float64Array>();
for (const v of vias) fromV.set(v, treeFromLink(idx.get(v)!));
const trees = new Map<number, any>();
const out: Record<number, number[]> = {};
for (const v of vias) out[v] = [];
for (const t of trips) {
  let tr = trees.get(t.origin); if (!tr) { tr = treeFrom(g, t.origin, null); trees.set(t.origin, tr); }
  const best = Math.min(...(g.inLinks.get(t.dest) ?? []).map((l: number) => tr.dist[l]));
  for (const v of vias) {
    const vi = idx.get(v)!, d0 = tr.dist[vi];
    const dv = fromV.get(v)!;
    const tail = Math.min(...(g.inLinks.get(t.dest) ?? []).map((l: number) => dv[l]));
    out[v].push(d0 + tail - best);
  }
}
const q = (a: number[], p: number) => a.slice().sort((x, y) => x - y)[Math.floor(p * (a.length - 1))];
console.log('trips', trips.length);
for (const v of vias) console.log('link', v, net.links[idx.get(v)!].name, 'extra static s over best: min', q(out[v], 0).toFixed(0), 'p10', q(out[v], 0.1).toFixed(0), 'median', q(out[v], 0.5).toFixed(0), 'p90', q(out[v], 0.9).toFixed(0), 'share within 15 s', (out[v].filter((x) => x <= 15).length / out[v].length).toFixed(2));
