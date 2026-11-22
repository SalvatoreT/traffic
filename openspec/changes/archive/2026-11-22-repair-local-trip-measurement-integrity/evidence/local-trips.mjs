import fs from 'node:fs';
import { initSync, Simulation, simulatorFingerprint } from '../../../../src/sim/pkg/traffic_sim.js';

initSync({ module: fs.readFileSync(new URL('../../../../src/sim/pkg/traffic_sim_bg.wasm', import.meta.url)) });
console.log(JSON.stringify({ simulatorFingerprint: simulatorFingerprint(), seed: 1, seconds: 3600, rate: 10 }));

for (const gate of [false, true]) {
  for (const segments of [1, 2]) {
    const nodes = Array.from({ length: segments + 1 }, (_, id) => ({
      id, x: id * 1000, y: 0, control: 'uncontrolled',
      gate: gate && (id === 0 || id === segments), inStudyArea: true,
    }));
    const links = Array.from({ length: segments }, (_, id) => ({
      id, from: id, to: id + 1, class: 'residential', lanes: 1,
      speedLimit: 10, length: 1000,
      geometry: [[id * 1000, 0], [(id + 1) * 1000, 0]], inStudyArea: true,
    }));
    const network = { version: 1, id: 'probe', name: 'probe', nodes, links, turnBans: [] };
    const demand = { version: 1, area: 'probe', periods: [{
      id: 'p', label: 'p', flows: [{ origin: 0, destination: segments, vehPerHour: 10 }],
    }] };
    const sim = new Simulation(JSON.stringify(network), JSON.stringify(demand), JSON.stringify({ seed: 1, period: 'p', initialLoad: false }));
    sim.step(3600);
    const m = JSON.parse(sim.metrics());
    console.log(JSON.stringify({
      endpoints: gate ? 'gate' : 'local', segments,
      completedTrips: m.completedTrips, meanTripTime: m.meanTripTime,
      meanTripDelay: m.meanTripDelay, vehKm: m.vehKm,
    }));
    sim.free();
  }
}
