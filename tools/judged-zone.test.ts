import { describe, expect, it } from 'vitest';
import { computeStability, judgedClearings, stabilityRule, type StabilityRun, type ZoneSplit } from './lib/verdict';
import { keptIteration, type LoopScore } from './lib/acceptance';
import { farSites, zoneLines, type SeedRun } from './lib/assess';

const rule = stabilityRule({});
const zone = (near: number, far: number, farLinked: number, sens?: [number, number][]): ZoneSplit => ({
  bufferM: 200, total: near + far, near, far, farLinked, judged: near + farLinked,
  sensitivity: [[100, ...(sens?.[0] ?? [near, farLinked])], [200, near, farLinked], [400, ...(sens?.[1] ?? [near, farLinked])]].map(([b, n, l]) => ({ bufferM: b, near: n, far: near + far - n, farLinked: l, judged: n + l })),
});
const run = (seed: number, removed: number, z?: ZoneSplit | null): StabilityRun => ({ seed, minutes: 60, health: { gridlockRemoved: removed, backlogPct: 0.5, arterialMeanSpeed: 6, spawned: 20000 }, series: [], gridlockZone: z });

describe('near and far cars cleared from gridlock (D16, round 37)', () => {
  it('judges the near ones and the far ones linked to the zone', () => {
    expect(judgedClearings(run(1, 12, zone(0, 12, 0)))).toBe(0);
    expect(judgedClearings(run(1, 12, zone(1, 11, 2)))).toBe(3);
  });
  it('counts every clearing when the split is missing or does not add up', () => {
    expect(judgedClearings(run(1, 7))).toBe(7);
    expect(judgedClearings(run(1, 7, zone(1, 5, 0)))).toBe(7);
    expect(judgedClearings(run(1, 6, { ...zone(1, 5, 0), judged: 0 }))).toBe(6);
  });
  it('passes a period whose gridlock is far from the study area and fails one with far gridlock chained into it', () => {
    const far = computeStability([run(1, 14, zone(0, 14, 0)), run(2, 12, zone(1, 11, 0))], rule);
    expect(far.holds).toBe(true);
    expect([far.removalsPerHourMean, far.allPerHourMean, far.nearPerHourMean, far.farPerHourMean]).toEqual([0.5, 13, 0.5, 12.5]);
    const linked = computeStability([run(1, 14, zone(0, 14, 2)), run(2, 12, zone(1, 11, 0))], rule);
    expect(linked.removalsPerHourMean).toBe(1.5);
    expect(linked.holds).toBe(false);
  });
  it('falls back to every clearing when one run has no split', () => {
    const s = computeStability([run(1, 14, zone(0, 14, 0)), run(2, 3)], rule);
    expect(s.zoneScoped).toBe(false);
    expect(s.removalsPerHourMean).toBe(1.5);
    expect(Number.isNaN(s.nearPerHourMean)).toBe(true);
  });
  it('reports the verdict at half and double the buffer', () => {
    const s = computeStability([run(1, 4, zone(0, 4, 0, [[0, 0], [3, 0]])), run(2, 2, zone(0, 2, 0, [[0, 0], [2, 0]]))], rule);
    expect(s.sensitivity.map((q) => [q.bufferM, q.perHourMean, q.ok])).toEqual([[100, 0, true], [200, 0, true], [400, 2.5, false]]);
  });
});

describe('cost-loop acceptance on the judged figure', () => {
  const base: LoopScore = { k: 0, stable: false, meanRemovals: 1.1, backlogMean: 0.7, headErr: 7.5, fittedGeh: 0.66, intFitGeh: 0.82, rampCountErr: 114 };
  it('keeps no iteration that is worse on the judged removals or the backlog', () => {
    expect(keptIteration([base, { ...base, k: 1, meanRemovals: 1.2, headErr: 4 }, { ...base, k: 2, meanRemovals: 0.4, backlogMean: 1.8, headErr: 4 }])).toBe(0);
  });
  it('keeps the passing iteration with the least judged removals plus backlog', () => {
    expect(keptIteration([base, { ...base, k: 1, meanRemovals: 0.9, backlogMean: 0.7, headErr: 6 }, { ...base, k: 2, meanRemovals: 0.5, backlogMean: 0.6, headErr: 7.9 }, { ...base, k: 3, meanRemovals: 0.2, backlogMean: 0.6, headErr: 8.5 }])).toBe(2);
  });
  it('requires a stable iteration once the baseline is stable, and keeps the fitted GEH guard', () => {
    const b = { ...base, stable: true, meanRemovals: 0.6 };
    expect(keptIteration([b, { ...b, k: 1, stable: false, meanRemovals: 0.5 }])).toBe(0);
    expect(keptIteration([b, { ...b, k: 1, meanRemovals: 0.5, fittedGeh: 0.6 }])).toBe(0);
    expect(keptIteration([b, { ...b, k: 1, meanRemovals: 0.5 }])).toBe(1);
  });
});

describe('assessment text on the judged zone', () => {
  const seedRun = (z: Partial<SeedRun['gridlockZone']>) => ({ seed: 1, minutes: 60, period: 'pm_peak', health: { gridlockRemoved: 3, backlogPct: 0.5, completed: 1, arterialMeanSpeed: 6, spawned: 100 }, shares: [], rampShares: [], linkFlowVehPerHour: null, linkMeanDelayS: null, gridlockZone: { ...zone(1, 2, 0), farSites: [{ node: 9, streets: 'Russell Street / Claremont Avenue', distM: 1500, cleared: 2, linked: 0 }], backlog: { zoneTrips: 4, allTrips: 10 }, boundingStreets: [{ street: 'College Avenue', links: 20, maxQueueM: 120, link: 5, linkLengthM: 150, tMin: 30, fullShare: 0.01 }], ...z } }) as SeedRun;
  it('names the far places, the zone backlog and the bounding-street queues', () => {
    const runs = [seedRun({}), seedRun({})];
    expect(farSites(runs)).toEqual([{ node: 9, streets: 'Russell Street / Claremont Avenue', distM: 1500, cleared: 4, linked: 0 }]);
    const text = zoneLines(runs, computeStability(runs, rule), 1).join('\n');
    expect(text).toMatch(/1\.00 near the study area/);
    expect(text).toMatch(/\| 9 \| Russell Street \/ Claremont Avenue \| 1500 \| 4 \| 0 \|/);
    expect(text).toMatch(/4\.0 trips on average, of 10\.0/);
    expect(text).toMatch(/\| College Avenue \| 20 \| 120 \| 120 \| 5 \(150\) \| 1\.0% \|/);
  });
});
