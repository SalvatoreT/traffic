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

describe('headless metric rows for safety', () => {
  const m = run();
  const ids = (rows: ReturnType<typeof metricRows>) => rows.map((r) => r.id);
  it('lists each mode separately with its counts and no combined row', () => {
    const rows = metricRows(m, m);
    expect(ids(rows)).toEqual(expect.arrayContaining(['pedSev', 'bikeSev', 'pedEnc', 'bikeEnc', 'bikeUnsup']));
    expect(rows.some((r) => /combined/i.test(r.label))).toBe(false);
  });
  it('reports an unscored severity mean as null with its reason, not zero', () => {
    const empty = { ...m, vulnerable: { ...m.vulnerable!, cyclist: { ...m.vulnerable!.cyclist, supported: 0, unsupported: 3, encounters: 3, meanSeverity: null, unavailable: 'no encounters in the supported crash geometry' } } };
    const row = metricRows(empty, empty).find((r) => r.id === 'bikeSev')!;
    expect(row.baseline).toBeNull();
    expect(row.unavailable?.baseline).toMatch(/supported crash geometry/);
  });
  it('keeps three decimals for a 0..1 severity', () => {
    const a = { ...m, vulnerable: { ...m.vulnerable!, pedestrian: { ...m.vulnerable!.pedestrian, supported: 9, meanSeverity: 0.0476 } } };
    expect(metricRows(a, a).find((r) => r.id === 'pedSev')!.baseline).toBe(0.048);
  });
});
