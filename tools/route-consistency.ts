// Consistency of the router's penalties with what the simulator imposes: for links grouped by the control at their end (and by hump), the routing constant
// (control delay, hump penalty) against the simulator's mean delay per vehicle (flow-weighted over the seeds), and the free-flow, routing-cost and simulated time along
// the select-link blocks of the targets file (street hierarchy factor included). Reads kept seed reports with per-link delays (calibrate --seeds ... --keep-seeds DIR).
//   npx tsx tools/route-consistency.ts --dir DIR [--period pm_peak] [--seeds 1-10] [--area rockridge]
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readSeeds } from './lib/assess';
import { resolveBlock, type ShareLink, type ShareNode } from './lib/share-targets';
import { SIM_ROUTE_PARAMS } from './lib/assign';

const root = resolve(import.meta.dirname, '..');
const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const area = arg('--area', 'rockridge'), period = arg('--period', 'pm_peak'), dir = resolve(root, arg('--dir', ''));
const seeds = arg('--seeds', '1-10').split('-').map(Number);
const runs = readSeeds(dir, area, period, Array.from({ length: seeds[1] - seeds[0] + 1 }, (_, i) => seeds[0] + i));
if (!runs.length || !runs[0].linkMeanDelayS) { console.error('route-consistency: no seed reports with link delays in --dir'); process.exit(1); }
const net = JSON.parse(readFileSync(resolve(root, `public/data/${area}.network.json`), 'utf8')) as { nodes: (ShareNode & { control: string })[]; links: (ShareLink & { humps: number[]; speedLimit: number; stopAtEnd?: boolean; to: number })[] };
const targets = JSON.parse(readFileSync(resolve(root, `data/calibration/${area}.targets.json`), 'utf8'));
const P = SIM_ROUTE_PARAMS;
const nodeBy = new Map(net.nodes.map((n) => [n.id, n]));
const nL = net.links.length;
const flow = new Float64Array(nL), dsum = new Float64Array(nL);
for (const r of runs) for (let l = 0; l < nL; l++) { flow[l] += r.linkFlowVehPerHour![l]; dsum[l] += r.linkFlowVehPerHour![l] * r.linkMeanDelayS![l]; }
const delay = (l: number) => (flow[l] > 0 ? dsum[l] / flow[l] : 0);
const local = (c: string) => c === 'residential' || c === 'service';

const L: string[] = [`# Routing penalties against simulated delay: ${area}, ${period}`, '', `Seeds ${seeds.join(' to ')}, links with at least 20 veh/h (mean). Simulated delay = time lost against the speed limit on the link, per vehicle, including the stop at its end and the hump; routing constant = the value the router adds (\`params.rs\`; \`SIM_ROUTE_PARAMS\` in \`tools/lib/assign.ts\`).`, ''];
type Acc = { n: number; w: number; d: number };
const groups = new Map<string, { acc: Acc; route: number }>();
const add = (key: string, route: number, l: number) => { const g = groups.get(key) ?? groups.set(key, { acc: { n: 0, w: 0, d: 0 }, route }).get(key)!; g.acc.n++; g.acc.w += flow[l]; g.acc.d += flow[l] * delay(l); };
for (let l = 0; l < nL; l++) {
  if (flow[l] / runs.length < 20) continue;
  const k = net.links[l], c = nodeBy.get(k.to)!.control, cls = local(k.class) ? 'local street' : 'collector or arterial';
  const hump = k.humps.length;
  const route = (c === 'signal' ? P.delaySignalS : c === 'all_way_stop' ? P.delayAllwayS : c === 'traffic_circle' ? P.delayCircleS : c === 'two_way_stop' ? P.delayMinorS : 0) + hump * 3;
  add(`${cls}, ends at ${c.replace(/_/g, ' ')}${hump ? `, ${hump} hump(s)` : ''}`, route, l);
}
L.push('| Link group | Links | Routing constant (s) | Simulated delay (s, flow-weighted) |', '| --- | --- | --- | --- |');
for (const [k, g] of [...groups].sort((a, b) => b[1].acc.w - a[1].acc.w).slice(0, 18)) L.push(`| ${k} | ${g.acc.n} | ${g.route.toFixed(1)} | ${(g.acc.d / g.acc.w).toFixed(1)} |`);
L.push('', 'Two-way stop rows: the routing constant applies to the minor approach only; the table groups all links that end at such a node, so a major-street link has a constant of 0 in the router.', '');

L.push('## Travel time along the select-link blocks', '', 'Free-flow = length / speed limit. Routing cost = free-flow + control delay and hump penalty at the end of each link, local-street links x the hierarchy factor. Simulated = free-flow + mean simulated delay.', '', '| Block | Length (m) | Free-flow (s) | Routing cost (s) | Simulated (s) | Simulated / routing |', '| --- | --- | --- | --- | --- | --- |');
for (const t of targets.selectLink ?? []) {
  const blk = resolveBlock(net.links, new Map(net.nodes.map((n) => [n.id, n])), t.street, t.direction, t.between ?? []);
  let len = 0, ff = 0, rc = 0, sim = 0;
  for (const l of blk.links) {
    const k = net.links[l], c = nodeBy.get(k.to)!.control;
    const f = k.length / k.speedLimit, ctrl = (c === 'signal' ? P.delaySignalS : c === 'all_way_stop' ? P.delayAllwayS : c === 'traffic_circle' ? P.delayCircleS : c === 'two_way_stop' ? P.delayMinorS * 0 : 0) + k.humps.length * 3;
    len += k.length; ff += f; rc += (f + ctrl) * (local(k.class) ? P.localCostFactor : 1); sim += f + delay(l);
  }
  L.push(`| ${t.street} ${t.direction} (${t.between?.join(' to ')}) | ${len.toFixed(0)} | ${ff.toFixed(0)} | ${rc.toFixed(0)} | ${sim.toFixed(0)} | ${rc > 0 ? (sim / rc).toFixed(2) : '-'} |`);
}
// The bypass pairs of the targets file: the arterial between the same cross streets as the bypass's select-link blocks.
for (const b of targets.patterns?.bypass ?? []) {
  for (const t of (targets.selectLink ?? []).filter((q: { street: string }) => q.street.toLowerCase().startsWith(b.bypass.toLowerCase().split(' ')[0]))) {
    const arterial = resolveBlock(net.links, new Map(net.nodes.map((n) => [n.id, n])), b.arterial, t.direction, t.between ?? []);
    let len = 0, ff = 0, rc = 0, sim = 0;
    for (const l of arterial.links) {
      const k = net.links[l], c = nodeBy.get(k.to)!.control;
      const f = k.length / k.speedLimit, ctrl = (c === 'signal' ? P.delaySignalS : c === 'all_way_stop' ? P.delayAllwayS : c === 'traffic_circle' ? P.delayCircleS : 0) + k.humps.length * 3;
      len += k.length; ff += f; rc += (f + ctrl) * (local(k.class) ? P.localCostFactor : 1); sim += f + delay(l);
    }
    L.push(`| ${b.arterial} ${t.direction} (same cross streets as ${t.street}) | ${len.toFixed(0)} | ${ff.toFixed(0)} | ${rc.toFixed(0)} | ${sim.toFixed(0)} | ${rc > 0 ? (sim / rc).toFixed(2) : '-'} |`);
  }
}
L.push('', 'Two-way stop controls at the end of a major-street link add no routing constant (only the minor approach does), which this table follows.');
writeFileSync(resolve(root, arg('--out', `data/calibration/${area}.route-consistency.md`)), L.join('\n') + '\n');
console.log(L.join('\n'));
