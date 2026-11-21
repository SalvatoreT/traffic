import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [pkg, data, rawSeed] = process.argv.slice(2);
const wasm = await import(resolve(pkg, 'traffic_sim.js'));
wasm.initSync({ module: readFileSync(resolve(pkg, 'traffic_sim_bg.wasm')) });

const network = readFileSync(resolve(data, 'rockridge.network.json'), 'utf8');
const demand = readFileSync(resolve(data, 'rockridge.demand.json'), 'utf8');
const seed = Number(rawSeed);
const config = { seed, period: 'pm_peak', demandScale: 1, initialLoad: true };
const sim = new wasm.Simulation(network, demand, JSON.stringify(config));
for (let step = 0; step < 720; step++) sim.step(5);

const metrics = sim.metrics();
const hash = createHash('sha256').update(metrics);
for (const array of [sim.vehicles(), sim.linkStats(), sim.intentLinks(), sim.intentTrips(), sim.signals()]) {
  hash.update(Buffer.from(array.buffer, array.byteOffset, array.byteLength));
}
console.log(JSON.stringify({
  seed,
  seconds: sim.time(),
  completed: JSON.parse(metrics).completedTrips,
  outputHash: hash.digest('hex'),
  fingerprint: wasm.simulatorFingerprint(),
}));
