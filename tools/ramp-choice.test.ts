import { describe, expect, it } from 'vitest';
import type { Assignment } from './lib/assign';
import { offRampLinks, splitByRamp, type RampFlow } from './lib/ramp-choice';

// Links: 0 mainline gate -> diverge node 1; 1 and 2 are two off-ramps (1 -> 2, 1 -> 3); 5 enters node 6 (a second diverge) which has ramp 6.
const linkFrom = [0, 1, 1, 6, 6], linkTo = [1, 2, 3, 6, 7];
const asg = (rows: [number, number][][]): Assignment => {
  const start = [0], link: number[] = [], share: number[] = [];
  for (const r of rows) { for (const [l, s] of r) { link.push(l); share.push(s); } start.push(link.length); }
  return { start: Int32Array.from(start), link: Int32Array.from(link), share: Float64Array.from(share), routable: rows.map(() => true) } as unknown as Assignment;
};
const cfg = { enabled: true, maxDetour: 1.3, minShare: 0.1 };
const ramps = [{ b: 1, from: 1 }, { b: 2, from: 1 }];

describe('ramp choice made upstream', () => {
  it('divides a flow over the ramps its assignment uses, in proportion to the shares, and names the other ramp as the alternative', () => {
    const flows: RampFlow[] = [{ origin: 0, destination: 9, vehPerHour: 100 }];
    const r = splitByRamp(flows, [80], asg([[[0, 1], [1, 0.75], [2, 0.25]]]), () => true, ramps, linkFrom, linkTo, cfg);
    expect(r.flows).toHaveLength(2);
    expect(r.flows.map((f) => f.vehPerHour)).toEqual([60, 20]);
    expect(r.flows[0].via).toEqual({ a: 0, b: 1, maxDetour: 1.3, alternatives: [{ a: 0, b: 2 }] });
    expect(r.flows[1].via).toEqual({ a: 0, b: 2, maxDetour: 1.3, alternatives: [{ a: 0, b: 1 }] });
    expect(r.divided).toBe(1);
    expect(r.byRamp.get(1)).toBeCloseTo(60);
  });
  it('drops a ramp below the minimum share and gives its trips to the others', () => {
    const r = splitByRamp<RampFlow>([{ origin: 0, destination: 9, vehPerHour: 1 }], [50], asg([[[0, 1], [1, 0.95], [2, 0.05]]]), () => true, ramps, linkFrom, linkTo, cfg);
    expect(r.flows).toHaveLength(1);
    expect(r.flows[0]).toMatchObject({ vehPerHour: 50, via: { a: 0, b: 1 } });
    expect(r.flows[0].via!.alternatives).toBeUndefined();
  });
  it('leaves other flows, flows with a movement and flows that use no ramp unchanged except for the fitted volume', () => {
    const flows: RampFlow[] = [{ origin: 5, destination: 9, vehPerHour: 10 }, { origin: 0, destination: 9, vehPerHour: 10, via: { a: 7, b: 8 } }, { origin: 0, destination: 4, vehPerHour: 10 }];
    const r = splitByRamp(flows, [11, 12, 13], asg([[[0, 1], [1, 1]], [[0, 1], [1, 1]], [[0, 1]]]), (k) => k > 0, ramps, linkFrom, linkTo, cfg);
    expect(r.flows.map((f) => [f.vehPerHour, f.via?.b])).toEqual([[11, undefined], [12, 8], [13, undefined]]);
    expect(r.forced).toBe(0);
  });
  it('finds the freeway-class link that ends at each ramp surface node', () => {
    const links = [{ id: 0, from: 10, to: 1, class: 'motorway' }, { id: 1, from: 1, to: 2, class: 'motorway' }, { id: 2, from: 2, to: 3, class: 'primary' }];
    expect(offRampLinks([2], links, new Set(['motorway']))).toEqual([{ b: 1, from: 1 }]);
  });
  it('does not take a ramp link that starts at a surface node, and takes the first of two chained ramps on a path', () => {
    const links = [{ id: 0, from: 10, to: 1, class: 'motorway' }, { id: 1, from: 1, to: 2, class: 'motorway' }, { id: 2, from: 2, to: 3, class: 'motorway' }, { id: 3, from: 2, to: 4, class: 'residential' }, { id: 4, from: 3, to: 5, class: 'residential' }];
    expect(offRampLinks([2, 3], links, new Set(['motorway']))).toEqual([{ b: 1, from: 1 }]);
  });
  it('treats ramp links chained on one path as one physical ramp', () => {
    // 0 -> 1 -> (ramp link 1 ends at 2) -> (ramp link 2 ends at 3): the second link starts where the first ends
    const lf = [0, 1, 2], lt = [1, 2, 3];
    const chained = [{ b: 1, from: 1 }, { b: 2, from: 2 }];
    const r = splitByRamp<RampFlow>([{ origin: 0, destination: 9, vehPerHour: 10 }], [40], asg([[[0, 1], [1, 1], [2, 1]]]), () => true, chained, lf, lt, cfg);
    expect(r.flows).toHaveLength(1);
    expect(r.flows[0].via).toEqual({ a: 0, b: 1, maxDetour: 1.3 });
    expect(r.divided).toBe(0);
    expect(r.byRamp.get(2)).toBeUndefined();
  });
});
