import { describe, expect, it } from 'vitest';
import { featureIndex, routeFeatures, type Assignment, type Feature } from './lib/assign';
import { assigned, DEFAULT_FIT, fitToCounts, type Constraint, type FlowType } from './lib/fit-counts';
import { throughMembership, type ThroughMeasured } from './lib/demand-fit';
import { pooledMembership, throughTargetId, type SelectOd } from './lib/through-membership';

// Three flows on a two-link network: flow 0 uses link 0, flow 1 uses links 0 and 1, flow 2 uses link 1. One assignment, every route share 1.
const asg = (feat?: Assignment['feat']): Assignment => ({
  start: Int32Array.from([0, 1, 3, 4]), link: Int32Array.from([0, 0, 1, 1]), share: Float32Array.from([1, 1, 1, 1]), routable: Uint8Array.from([1, 1, 1]),
  origin: Int32Array.from([10, 11, 12]), destination: Int32Array.from([20, 21, 22]), feat,
});

describe('any-link route feature', () => {
  it('counts a route once however many links of the run it uses', () => {
    const feats: Feature[] = [{ kind: 'any', links: [3, 4, 5] }, { kind: 'move', a: 4, b: 5 }];
    const idx = featureIndex(feats);
    expect(routeFeatures([1, 3, 4, 5, 9], feats, idx)).toEqual([0, 1]);
    expect(routeFeatures([1, 2], feats, idx)).toEqual([]);
    expect(routeFeatures([5], feats, idx)).toEqual([0]);
  });
});

describe('explicit membership and one-sided targets in the fit', () => {
  const types: FlowType[] = ['through', 'through', 'through'];
  it('scales the flows by their proportion on a member constraint', () => {
    const c: Constraint = { id: 't', kind: 'through', label: 't', links: [], target: 30, member: [1, 0.5, 0] };
    const v0 = [40, 40, 40];
    expect(assigned(asg(), v0, [c], 2)[0]).toBeCloseTo(60);
    const r = fitToCounts(asg(), v0, types, [c], 2, { ...DEFAULT_FIT, uncounted: 'one' });
    const f = v0.map((v, k) => v * r.g[k]);
    expect(f[0] + 0.5 * f[1]).toBeCloseTo(30, 0);
    expect(f[2]).toBeCloseTo(40);
  });
  it('leaves a ceiling target idle below its limit', () => {
    const c: Constraint = { id: 't', kind: 'through', label: 't', links: [], target: 30, member: [1, 0, 0], ceiling: 50 };
    const r = fitToCounts(asg(), [40, 40, 40], types, [c], 2, { ...DEFAULT_FIT, uncounted: 'one' });
    expect(r.g[0]).toBeCloseTo(1);
    const c2: Constraint = { ...c, ceiling: 35 };
    const r2 = fitToCounts(asg(), [40, 40, 40], types, [c2], 2, { ...DEFAULT_FIT, uncounted: 'one' });
    expect(40 * r2.g[0]).toBeCloseTo(30, 0);
  });
});

describe('through membership', () => {
  const flows = [{ origin: 10, destination: 20, vehPerHour: 10 }, { origin: 11, destination: 21, vehPerHour: 20 }, { origin: 12, destination: 22, vehPerHour: 5 }];
  // feature 0: flows 0 and 1 have it on every route
  const feat = { start: Int32Array.from([0, 1, 2, 2]), id: Int32Array.from([0, 0]), share: Float32Array.from([1, 1]) };
  it('uses the static route share of through flows only', () => {
    const { stat, use } = throughMembership(asg(feat), flows, 0, new Set([21]), undefined, 'x', 5, () => false);
    expect([...stat]).toEqual([1, 0, 0]);
    expect(use).toBe(stat);
  });
  it('takes simulated shares with the static share as a prior', () => {
    // ten runs: pair 10>20 offered 100 trips, 20 counted; pair 12>22 (static 0) offered 50, 25 counted
    const m: ThroughMeasured = { runs: 10, source: 't', hits: { x: { '10>20': 20, '12>22': 25 } }, trips: { '10>20': 100, '12>22': 50 } };
    const { use } = throughMembership(asg(feat), flows, 0, new Set(), m, 'x', 5, () => false);
    expect(use[0]).toBeCloseTo((20 + 5) / 105);
    expect(use[2]).toBeCloseTo(25 / 55);
    // pair 11>21 has no counted trip: the prior against its offered volume over the runs (200 trips)
    expect(use[1]).toBeCloseTo(5 / 205);
  });
  it('takes the pinned flows of a pair out of its counted trips', () => {
    const fl = [{ origin: 10, destination: 20, vehPerHour: 10 }, { origin: 10, destination: 20, vehPerHour: 4, via: { a: 0, b: 1 } }, { origin: 12, destination: 22, vehPerHour: 5 }];
    const ft = { start: Int32Array.from([0, 0, 1, 1]), id: Int32Array.from([0]), share: Float32Array.from([1]) };
    const m: ThroughMeasured = { runs: 10, source: 't', hits: { x: { '10>20': 60 } }, trips: { '10>20': 140 } };
    const { use } = throughMembership(asg(ft), fl, 0, new Set(), m, 'x', 0, (k) => k === 1);
    expect(use[1]).toBe(1);
    // 60 counted less 40 pinned = 20 over 100 plain trips
    expect(use[0]).toBeCloseTo(0.2);
  });
});

describe('pooled select-od files', () => {
  it('keeps through trips, sums runs and offered trips', () => {
    const sod = (seed: number, n: number): SelectOd => ({ period: 'pm_peak', seed, minutes: 60, blocks: [{ label: 'A St SB', links: [1], trips: [[1, 2, n], [1, 9, 3]] }] });
    const flows = [{ origin: 1, destination: 2, vehPerHour: 7 }, { origin: 1, destination: 9, vehPerHour: 4 }];
    const m = pooledMembership([{ label: 'a', flows, sod: [sod(1, 2), sod(2, 4)] }], new Set([9]));
    expect(m.runs).toBe(2);
    expect(m.hits[throughTargetId('A St SB')]).toEqual({ '1>2': 6 });
    expect(m.trips).toEqual({ '1>2': 14 });
  });
});
