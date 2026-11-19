// Diagnostic only: per-link table of the travel-time segments of the targets file for one run report.
// usage: tsx tools/diag/seg-links.ts <run.json> [period] [segment substring]
import { readFileSync } from 'node:fs';
import { streetPath } from '../lib/assess';
const run = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const period = process.argv[3] ?? 'pm_peak';
const sub = process.argv[4] ?? '';
const net = JSON.parse(readFileSync('public/data/rockridge.network.json', 'utf8'));
const targets = JSON.parse(readFileSync('data/calibration/rockridge.targets.json', 'utf8'));
const nodes = new Map<number, any>(net.nodes.map((n: any) => [n.id, n]));
for (const q of targets.travelTimes.segments) {
  if (!q.id.includes(sub)) continue;
  const path = streetPath(net, q.street, q.from, q.to);
  if (!path) { console.log(q.id, 'no path'); continue; }
  let tot = 0;
  console.log('==', q.id, 'obs mph', JSON.stringify(q.observedMph[period]));
  for (const i of path) {
    const l = net.links[i];
    const d = run.linkMeanDelayS[i];
    tot += d;
    console.log(` link ${l.id} ${l.name} ${l.class} lanes ${l.lanes} lim ${l.speedLimit.toFixed(1)} len ${Math.round(l.length)} -> ${nodes.get(l.to).control} node ${l.to}  flow ${Math.round(run.linkFlowVehPerHour[i])}  delay ${d.toFixed(1)}`);
  }
  console.log(' total delay', tot.toFixed(0));
}
