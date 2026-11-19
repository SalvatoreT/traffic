import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assign, buildGraph, type ALink, type ANode } from './lib/assign';
import { approachDelays, controlDelayArray, readControlDelays, weightedMedian, type ControlDelayFile } from './lib/control-delays';

// Diamond: 0 -> 1 (signal) -> 3 and 0 -> 2 (no control) -> 3, mirror images of each other, so the control delay alone decides.
const nodes: ANode[] = [
  { id: 0, x: 0, y: 0, control: 'uncontrolled' }, { id: 1, x: 100, y: 40, control: 'signal' },
  { id: 2, x: 100, y: -40, control: 'uncontrolled' }, { id: 3, x: 200, y: 0, control: 'uncontrolled' },
];
const len = Math.hypot(100, 40);
const link = (id: number, from: number, to: number): ALink => ({ id, from, to, length: len, speedLimit: 10, class: 'secondary', name: `S${id}` });
const links = [link(10, 0, 1), link(11, 1, 3), link(12, 0, 2), link(13, 2, 3)];
const routeOf = (delays?: ArrayLike<number>) => {
  const g = buildGraph(nodes, links, [], 'pm', undefined, delays);
  let first: number[] = [];
  assign(g, [{ origin: 0, destination: 3, vehPerHour: 100 }], 1, 0, [], (_k, r) => { first = r; });
  return first.map((i) => links[i].id);
};

describe('measured control delay in the static assignment', () => {
  it('uses the constant of the control type without a measurement', () => {
    expect(routeOf()).toEqual([12, 13]);
    expect(routeOf(Float64Array.of(NaN, NaN, NaN, NaN))).toEqual([12, 13]);
  });
  it('a measured delay on the signal approach changes the assigned path', () => {
    expect(routeOf(Float64Array.of(0, NaN, NaN, NaN))).toEqual([10, 11]);
    expect(routeOf(Float64Array.of(60, NaN, NaN, NaN))).toEqual([12, 13]);
  });
  it('shifts a movement cost by the measured delay less the constant, and leaves unmeasured approaches alone', () => {
    const a = buildGraph(nodes, links, [], 'pm');
    const b = buildGraph(nodes, links, [], 'pm', undefined, Float64Array.of(35, NaN, NaN, NaN));
    const mv = (g: typeof a, from: number) => g.mvCost[g.mvStart[from]];
    expect(mv(b, 0) - mv(a, 0)).toBeCloseTo(35 - 10);
    expect(mv(b, 1)).toBe(mv(a, 1));
    expect(mv(b, 2)).toBe(mv(a, 2));
  });
  it('a measurement on an approach without control changes nothing', () => {
    const a = buildGraph(nodes, links, [], 'pm');
    const b = buildGraph(nodes, links, [], 'pm', undefined, Float64Array.of(NaN, NaN, 40, NaN));
    expect(Array.from(b.mvCost)).toEqual(Array.from(a.mvCost));
  });
});

describe('approach delays from runs', () => {
  const minor = [false, false, false, false];
  it('takes the flow-weighted mean less the uncontrolled baseline, and drops approaches under the minimum flow', () => {
    const runs = [{ flow: [100, 100, 100, 100], delay: [25, 2, 2, 2] }, { flow: [300, 100, 100, 100], delay: [45, 2, 2, 2] }];
    const r = approachDelays(nodes, links, minor, runs);
    expect(r.baseDelayS).toBe(2);
    expect(r.delayS['10']).toBeCloseTo((100 * 25 + 300 * 45) / 400 - 2, 1);
    expect(Object.keys(r.delayS)).toEqual(['10']);
    const few = approachDelays(nodes, links, minor, [{ flow: [10, 100, 100, 100], delay: [25, 2, 2, 2] }]);
    expect(few.delayS['10']).toBeUndefined();
  });
  it('weighted median picks the middle car', () => {
    expect(weightedMedian([1, 5, 9], [1, 1, 10])).toBe(9);
  });
  it('maps link ids to the array the graph reads, NaN where unmeasured', () => {
    const f = { delayS: { pm: { '11': 7 } } } as unknown as ControlDelayFile;
    expect(Array.from(controlDelayArray(links, 'pm', f)!)).toEqual([NaN, 7, NaN, NaN]);
    expect(controlDelayArray(links, 'am', f)).toBeUndefined();
  });
});

describe('provenance of the control delay file', () => {
  const file: ControlDelayFile = {
    schema: 1, area: 'a', view: 'shipped', network: 'n'.repeat(64), simulator: 's'.repeat(32), measuredOn: { file: 'd.json', sha256: 'd'.repeat(64) },
    seeds: [1, 2], minutes: 60, minFlowVehPerHour: 20, baseDelayS: { pm: 1 }, delayS: { pm: { '10': 5 } },
  };
  const dir = mkdtempSync(join(tmpdir(), 'cd-'));
  const write = (f: object) => { const p = join(dir, `f${Math.random()}.json`); writeFileSync(p, JSON.stringify(f)); return p; };
  const expectOf = { area: 'a', view: 'shipped', network: 'n'.repeat(64), simulator: 's'.repeat(32) };
  it('accepts a matching file', () => {
    expect(readControlDelays(write(file), expectOf).used).toBe(true);
  });
  it('is silent when there is no file', () => {
    expect(readControlDelays(join(dir, 'none.json'), expectOf)).toEqual({ used: false, reason: null });
    expect(readControlDelays(undefined, expectOf)).toEqual({ used: false, reason: null });
  });
  it.each([['network', { network: 'x'.repeat(64) }], ['view', { view: 'training' }], ['simulator', { simulator: 'z'.repeat(32) }], ['area', { area: 'b' }]])('falls back loudly on a %s mismatch', (word, change) => {
    const r = readControlDelays(write({ ...file, ...change }), expectOf);
    expect(r.used).toBe(false);
    expect(r.used === false && r.reason).toContain(word);
    expect(r.used === false && r.reason).toContain('fall back to the constants');
  });
});
