import { describe, expect, it } from 'vitest';
import { metricRows } from './lib/simulate-report';
import { MockSimulation } from '../src/sim/mock';
import { buildFixture } from '../src/fixtures/area';
import type { Metrics } from '../src/types';

const bundle = buildFixture();
function run(): Metrics {
  const sim = new MockSimulation(JSON.stringify(bundle.network), JSON.stringify(bundle.demand), JSON.stringify({ seed: 1, period: bundle.demand.periods[0].id, demandScale: 1 }));
  sim.setInterventions('[]');
  sim.step(60);
  return JSON.parse(sim.metrics()) as Metrics;
}

describe('headless metric rows', () => {
  const m = run();
  it('list only the figures on the side streets inside the study area', () => {
    const rows = metricRows(m, m);
    expect(rows.map((r) => r.id)).toEqual(['ctVeh', 'ctShare', 'ttc']);
    expect(rows.every((r) => !/speed|trip|walking|biking/i.test(r.label))).toBe(true);
  });
});
