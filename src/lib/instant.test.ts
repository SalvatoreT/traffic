import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { MockSimulation } from '../sim/mock';
import { clampStep, isFinishedAt, RUN_SECONDS } from './run';
import { DEFAULT_SPEED, INSTANT, isInstant, speedLabel } from './speed';
import { SPEEDS } from '../components/Toolbar';

const make = () => {
  const b = buildFixture();
  return new MockSimulation(JSON.stringify(b.network), JSON.stringify(b.demand), JSON.stringify({ seed: 1, period: b.demand.periods[0].id, demandScale: 1 }));
};

/** Steps like the worker: slices of `chunk` seconds, never past the end of the run. */
function runTo(sim: ReturnType<typeof make>, chunk: number, end = RUN_SECONDS) {
  while (sim.time() < end - 1e-6) sim.step(Math.min(clampStep(sim.time(), chunk), end - sim.time()));
}

describe('speeds', () => {
  it('keeps 1, 5, 20 and 60 and adds Instant; opens at 20', () => {
    expect(SPEEDS).toEqual([1, 5, 20, 60, INSTANT]);
    expect(DEFAULT_SPEED).toBe(20);
    expect(isInstant(INSTANT)).toBe(true);
    expect(isInstant(60)).toBe(false);
    expect(speedLabel(INSTANT)).toBe('Instant');
    expect(speedLabel(20)).toBe('20×');
  });
});

describe('instant run', () => {
  it('ends at exactly the end of the period', { timeout: 30000 }, () => {
    const a = make();
    runTo(a, 15);
    expect(a.time()).toBe(RUN_SECONDS);
    expect(isFinishedAt(a.time())).toBe(true);
  });
  it('gives the same results as a run played in small steps, and when paused and resumed', { timeout: 30000 }, () => {
    const slow = make(), fast = make(), paused = make();
    runTo(slow, 0.25, 900);
    runTo(fast, 15, 900);
    paused.step(433.5); paused.step(0.25);
    runTo(paused, 15, 900);
    expect(fast.metrics()).toBe(slow.metrics());
    expect(Array.from(fast.linkStats())).toEqual(Array.from(slow.linkStats()));
    expect(paused.metrics()).toBe(slow.metrics());
  });
});
