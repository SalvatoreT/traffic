// Measured control delay per approach link from kept simulator seed reports (calibrate --seeds ... --keep-seeds DIR), for the static assignment of the demand fit.
//   npx tsx tools/control-delays.ts --dir DIR --demand FILE --view shipped|training --out FILE [--periods am_peak,midday,pm_peak] [--seeds 1-10] [--area rockridge] [--pass N]
// Every report must carry a manifest whose demand and network hashes are those of --demand and the network file, and one simulator fingerprint; anything else stops the tool.
// The file records the network, the demand the runs were made on, the simulator fingerprint, the seeds and the period, so the demand build can refuse a file that does not match.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readSeeds } from './lib/assess';
import { buildGraph } from './lib/assign';
import { approachDelays, MIN_APPROACH_FLOW_VEH_PER_HOUR, type ControlDelayFile } from './lib/control-delays';
import { writeFileAtomic } from './lib/atomic';

const root = resolve(import.meta.dirname, '..');
const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const area = arg('--area', 'rockridge');
const view = arg('--view', 'shipped');
const periods = arg('--periods', 'am_peak,midday,pm_peak').split(',');
const [s0, s1] = arg('--seeds', '1-10').split('-').map(Number);
const seeds = Array.from({ length: s1 - s0 + 1 }, (_, i) => s0 + i);
const dir = resolve(root, arg('--dir', ''));
const demandPath = resolve(root, arg('--demand', ''));
const outPath = resolve(root, arg('--out', ''));
const pass = arg('--pass', '');
if (!process.argv.includes('--dir') || !process.argv.includes('--demand') || !process.argv.includes('--out')) { console.error('control-delays: --dir, --demand and --out are required'); process.exit(2); }
const sha = (p: string) => createHash('sha256').update(readFileSync(p)).digest('hex');
const netPath = resolve(root, `public/data/${area}.network.json`);
const netSha = sha(netPath), demandSha = sha(demandPath);
const net = JSON.parse(readFileSync(netPath, 'utf8'));
const fingerprints = new Set<string>();
const delayS: ControlDelayFile['delayS'] = {}, baseDelayS: ControlDelayFile['baseDelayS'] = {};
let minutes = 0;
for (const period of periods) {
  const runs = readSeeds(dir, area, period, seeds);
  if (runs.length !== seeds.length) { console.error(`control-delays: ${period}: ${runs.length} of ${seeds.length} seed reports in ${dir}`); process.exit(1); }
  for (const r of runs) {
    const m = r.manifest;
    if (!m) { console.error(`control-delays: ${period} seed ${r.seed}: no manifest`); process.exit(1); }
    if (m.inputs.demand.sha256 !== demandSha) { console.error(`control-delays: ${period} seed ${r.seed}: ran on demand ${m.inputs.demand.sha256?.slice(0, 12)}, not ${demandSha.slice(0, 12)}`); process.exit(1); }
    if (m.inputs.network.sha256 !== netSha) { console.error(`control-delays: ${period} seed ${r.seed}: ran on network ${m.inputs.network.sha256?.slice(0, 12)}, not ${netSha.slice(0, 12)}`); process.exit(1); }
    if (!r.linkFlowVehPerHour || !r.linkMeanDelayS) { console.error(`control-delays: ${period} seed ${r.seed}: no per-link flow and delay`); process.exit(1); }
    fingerprints.add(m.simulator.fingerprint);
    minutes = r.minutes;
  }
  const g = buildGraph(net.nodes, net.links, net.turnBans ?? [], period);
  const a = approachDelays(net.nodes, net.links, g.minor, runs.map((r) => ({ flow: r.linkFlowVehPerHour!, delay: r.linkMeanDelayS! })));
  delayS[period] = a.delayS; baseDelayS[period] = a.baseDelayS;
  console.log(`${period}: ${Object.keys(a.delayS).length} approaches measured, base ${a.baseDelayS} s, mean control delay ${(Object.values(a.delayS).reduce((x, y) => x + y, 0) / Math.max(1, Object.keys(a.delayS).length)).toFixed(1)} s`);
}
if (fingerprints.size !== 1) { console.error(`control-delays: runs carry ${fingerprints.size} simulator fingerprints`); process.exit(1); }
const out: ControlDelayFile = {
  schema: 1, area, view, network: netSha, simulator: [...fingerprints][0],
  measuredOn: { file: arg('--demand', ''), sha256: demandSha },
  seeds, minutes, minFlowVehPerHour: MIN_APPROACH_FLOW_VEH_PER_HOUR, baseDelayS, delayS,
  note: `Control delay per approach link (s): flow-weighted mean delay per car over the seeds less the delay of uncontrolled links, approaches under ${MIN_APPROACH_FLOW_VEH_PER_HOUR} veh/h left out.${pass ? ` Pass ${pass}.` : ''} Written by tools/control-delays.ts (do not edit).`,
};
writeFileAtomic(outPath, JSON.stringify(out) + '\n');
console.log(`wrote ${outPath} (sha256 ${sha(outPath)})`);
