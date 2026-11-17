import { describe, expect, it } from 'vitest';
import type { FoundRun } from './lib/assess';
import { pedestrianCountLines, type PedestrianSeedCount } from './lib/pedestrian-count';

const station = { node: 12, period: 'pm', observedPerHour: 80, plannedPerHour: 75 };
function reading(seed: number, count: number, overrides: Partial<PedestrianSeedCount> = {}): FoundRun {
  return {
    seed, reportSeed: seed,
    manifest: { run: { seed, measurementWindow: { fromMin: 10, toMin: 40 } } },
    run: { pedestrianCount: { node: 12, fromMin: 10, toMin: 40, completedCrossings: count,
      simulatedPerHour: 2 * count, observedPerHour: 80, plannedPerHourAtScale1: 75, ...overrides } },
  } as FoundRun;
}

describe('pedestrian crossing assessment', () => {
  it('includes measured zeros and identifies missing, mislocated and inconsistent readings', () => {
    const reports = [reading(1, 0), reading(2, 20), reading(4, 500, { node: 11 }), reading(5, 5, { simulatedPerHour: 99 }),
      reading(6, 12, { plannedPerHourAtScale1: 78 })];
    const [line] = pedestrianCountLines('shipped', 'pm', station, reports, [1, 2, 3, 4, 5, 6]);
    expect(line).toContain('Observed 80.0, planned at scale 1 75.0, seed-mean completed 20.0 (2 of 6 requested seeds)');
    expect(line).toContain('Missing readings for seeds 3.');
    expect(line).toContain('Mismatched readings for seeds 4, 5, 6.');
  });

  it('distinguishes an unavailable plan or seed mean from a measured zero and keeps periods separate', () => {
    const unscaled = { ...station, plannedPerHour: null };
    expect(pedestrianCountLines('training', 'pm', unscaled, [reading(1, 0, { plannedPerHourAtScale1: null })], [1])[0])
      .toContain('planned at scale 1 unavailable, seed-mean completed 0.0 (1 of 1 requested seed)');
    expect(pedestrianCountLines('training', 'pm', station, [], [7])[0])
      .toContain('seed-mean completed unavailable (0 of 1 requested seed). Missing readings for seeds 7.');
    expect(pedestrianCountLines('training', 'am', station, [], [7])).toEqual([]);
    expect(pedestrianCountLines('training', 'am', station, [reading(7, 1)], [7])[0]).toContain('No matching observation');
  });

  it('declines to average different measurement windows even if each reading is internally consistent', () => {
    const short = reading(2, 10, { fromMin: 20, simulatedPerHour: 30 });
    short.manifest!.run.measurementWindow.fromMin = 20;
    const [line] = pedestrianCountLines('shipped', 'pm', station, [reading(1, 10), short], [1, 2]);
    expect(line).toContain('seed-mean completed unavailable (0 of 2 requested seeds)');
    expect(line).toContain('different windows');
  });
});
