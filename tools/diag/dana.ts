// Diagnostic only (router-diagnosis): static paths of the PM flows that start or end at the Dana St nodes.
import { readFileSync } from 'node:fs';
import { buildGraph, treeFrom } from '../lib/assign';
const net = JSON.parse(readFileSync('public/data/rockridge.network.json', 'utf8'));
const dem = JSON.parse(readFileSync('public/data/rockridge.demand.json', 'utf8'));
const pm = dem.periods.find((p: any) => p.id === 'pm_peak').flows as any[];
const g = buildGraph(net.nodes, net.links, net.turnBans ?? [], 'pm_peak');
const links = net.links as any[];
const S = new Set([Number(process.argv[2] ?? 827), 820, 794]);
const nm = (l: number) => `${links[l].name}#${links[l].id}`;
for (const f of pm) {
  if (!(S.has(f.origin) || S.has(f.destination))) continue;
  const tr = treeFrom(g, f.origin, null);
  let b = -1, bd = Infinity;
  for (const l of g.inLinks.get(f.destination) ?? []) if (tr.dist[l] < bd) { bd = tr.dist[l]; b = l; }
  const p: number[] = []; for (let l = b; l >= 0; l = tr.pred[l]) p.push(l); p.reverse();
  console.log(f.origin, '->', f.destination, f.vehPerHour, 'via' in f ? 'VIA' : '', 'cost', bd.toFixed(0), p.map(nm).join(' ').slice(0, 220));
}
