import { describe, expect, it } from 'vitest';
import { hasModes, summarize } from './metrics';
import { MockSimulation } from '../sim/mock';
import { buildFixture } from '../fixtures/area';
import type { Metrics } from '../types';

const bundle = buildFixture();
function run(seconds: number, ivs: unknown[] = []): Metrics {
  const sim = new MockSimulation(JSON.stringify(bundle.network), JSON.stringify(bundle.demand), JSON.stringify({ seed: 1, period: bundle.demand.periods[0].id, demandScale: 1 }));
  sim.setInterventions(JSON.stringify(ivs));
  sim.step(seconds);
  return JSON.parse(sim.metrics()) as Metrics;
}

describe('mock multimodal output', () => {
  const m = run(120);
  it('has car, bicycle and pedestrian kinds in the vehicle buffer', () => {
    const sim = new MockSimulation(JSON.stringify(bundle.network), JSON.stringify(bundle.demand), JSON.stringify({ seed: 1, period: bundle.demand.periods[0].id, demandScale: 1 }));
    const v = sim.vehicles();
    const kinds = new Set<number>();
    for (let i = 4; i < v.length; i += 6) kinds.add(v[i]);
    expect([...kinds].sort()).toEqual([0, 2, 3]);
  });
  it('reports modes and vulnerable metrics', () => {
    expect(hasModes(m)).toBe(true);
    expect(m.modes!.pedestrian.inNetwork).toBeGreaterThan(0);
    expect(m.vulnerable!.pedConflicts).toBeGreaterThanOrEqual(0);
  });
  it('closing streets cuts pedestrian conflicts', () => {
    const base = run(600);
    const closed = run(600, bundle.network.links.filter((l) => l.class === 'residential').map((l) => ({ type: 'modal_filter', link: l.id })));
    expect(closed.vulnerable!.pedConflicts).toBeLessThan(base.vulnerable!.pedConflicts);
  });
});

describe('results summary', () => {
  it('names the through cars and conflicts on the side streets inside the study area, and no network-wide figure', () => {
    const t = summarize(run(60), run(60));
    expect(t).toContain('side streets inside the study area only');
    expect(t).toContain('Through cars on all side streets');
    expect(t).not.toMatch(/trip time|walking and biking|speed/i);
  });
});
