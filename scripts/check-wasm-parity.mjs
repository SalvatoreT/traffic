// Runs a short simulation natively and in the WASM build (Node) on the same inputs and requires identical output.
// Needs `npm run wasm` and the generated data. Usage: node scripts/check-wasm-parity.mjs [period] [seconds] [seed]
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const [period = 'pm_peak', secs = '300', seed = '1'] = process.argv.slice(2);
const dir = process.env.PARITY_DATA ?? resolve(root, 'public/data');
const netPath = resolve(dir, 'rockridge.network.json');
const demPath = resolve(dir, 'rockridge.demand.json');

const native = JSON.parse(
  execFileSync('cargo', ['run', '--release', '-q', '-p', 'traffic-sim', '--bin', 'parity', '--', netPath, demPath, period, secs, seed], { cwd: root, maxBuffer: 1 << 28 }).toString(),
);

const pkgDir = process.env.PARITY_PKG ?? resolve(root, 'src/sim/pkg');
const pkg = await import(resolve(pkgDir, 'traffic_sim.js'));
pkg.initSync({ module: readFileSync(resolve(pkgDir, 'traffic_sim_bg.wasm')) });
const sim = new pkg.Simulation(readFileSync(netPath, 'utf8'), readFileSync(demPath, 'utf8'), JSON.stringify({ seed: Number(seed), period }));
while (sim.time() < Number(secs) - 1e-9) sim.step(Math.min(5, Number(secs) - sim.time()));
const bits = (a) => Array.from(a, (x) => new DataView(new Float32Array([x]).buffer).getUint32(0, true).toString(16).padStart(8, '0')).join('');
const traced = new pkg.Simulation(readFileSync(netPath, 'utf8'), readFileSync(demPath, 'utf8'), JSON.stringify({ seed: Number(seed), period, trace: true }));
while (traced.time() < Number(secs) - 1e-9) traced.step(Math.min(5, Number(secs) - traced.time()));
const fnv = (s) => { let h = 0xcbf29ce484222325n; for (const b of Buffer.from(s, 'utf8')) h = BigInt.asUintN(64, (h ^ BigInt(b)) * 0x100000001b3n); return h.toString(16).padStart(16, '0'); };
const hex64 = (a) => { const v = new DataView(new Float64Array(a).buffer); let s = ''; for (let i = 0; i < a.length; i++) s += v.getBigUint64(i * 8, true).toString(16).padStart(16, '0'); return s; };
const ivs = process.env.PARITY_IVS ?? '[{"type":"modal_filter","node":0}]';
const wasm = {
  metrics: sim.metrics(), vehicles: bits(sim.vehicles()), linkStats: bits(sim.linkStats()), intentLinks: bits(sim.intentLinks()),
  tracedMetrics: traced.metrics() === sim.metrics(),
  traceRequests: fnv(hex64(traced.traceRequests())),
  traceEvents: fnv(Array.from(traced.traceEvents(), (x) => x.toString(16).padStart(8, '0')).join('')),
  traceSummary: traced.traceSummary(),
  graph: pkg.redistributionGraph(readFileSync(netPath, 'utf8'), period, 'car', '[]', ivs),
};

let bad = 0;
for (const k of Object.keys(native)) {
  const same = k === 'tracedMetrics' ? native[k] === true && wasm[k] === true : native[k] === wasm[k];
  if (!same) bad++;
  console.log(`${k}: ${same ? 'identical' : 'DIFFERENT'}`);
}
if (bad) {
  console.error('native and WASM results differ');
  process.exit(1);
}
console.log(`native and WASM agree (${period}, ${secs} s, seed ${seed})`);
