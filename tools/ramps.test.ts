import { describe, expect, it } from 'vitest';
import { deriveRamps, rampLabel } from './lib/ramps';

const fw = new Set(['motorway']);
const node = (id: number, x: number, y: number, gate = false) => ({ id, osmId: 1000 + id, x, y, gate });
let nextId = 0;
const link = (from: number, to: number, cls: string, name: string, pts: [number, number][]) => ({ id: nextId++, from, to, name, class: cls, length: Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), geometry: pts });

describe('freeway ramps', () => {
  // Surface street S1-S2 (Main St). Freeway runs west to east through gates G0 -> M1 -> M2 -> G3. The off-ramp leaves M1 via two links to S1;
  // the on-ramp enters from S2 via two links to M2.
  nextId = 0;
  const nodes = [node(0, 0, 0, true), node(1, 100, 0), node(2, 200, 0), node(3, 300, 0, true), node(10, 100, 100), node(11, 100, 60), node(20, 200, 100), node(21, 200, 60), node(30, 150, 200)];
  const links = [
    link(0, 1, 'motorway', '', [[0, 0], [100, 0]]),
    link(1, 2, 'motorway', '', [[100, 0], [200, 0]]),
    link(2, 3, 'motorway', '', [[200, 0], [300, 0]]),
    // off-ramp: M1 -> n11 -> S1 (n10)
    link(1, 11, 'motorway', '', [[100, 0], [100, 60]]),
    link(11, 10, 'motorway', '', [[100, 60], [100, 100]]),
    // on-ramp: S2 (n20) -> n21 -> M2 (n2)
    link(20, 21, 'motorway', '', [[200, 100], [200, 60]]),
    link(21, 2, 'motorway', '', [[200, 60], [200, 0]]),
    // surface
    link(10, 20, 'secondary', 'Main St', [[100, 100], [200, 100]]),
    link(10, 30, 'residential', 'Oak St', [[100, 100], [150, 200]]),
  ];
  it('chains the links of one ramp and tells on from off', () => {
    const r = deriveRamps(nodes, links, fw, { freewayName: 'SR-9' });
    expect(r.map((x) => [x.kind, x.node, x.links])).toEqual([
      ['off', 10, [3, 4]],
      ['on', 20, [5, 6]],
    ]);
    expect(r.map((x) => x.id)).toEqual(['off-1010', 'on-1020']);
  });
  it('names the freeway direction where the ramp joins it, and the streets at the terminal', () => {
    const [off, on] = deriveRamps(nodes, links, fw, { freewayName: 'SR-9' });
    expect(off.direction).toBe('eastbound');
    expect(on.direction).toBe('eastbound');
    expect(off.streets).toEqual(['Main St', 'Oak St']);
    expect(off.label).toBe('From the SR-9 eastbound off-ramp at Main St / Oak St');
    expect(on.label).toBe('To SR-9 eastbound by the Main St on-ramp');
  });
  it('uses a label override when the area config has one', () => {
    const [off] = deriveRamps(nodes, links, fw, { labels: { 'off-1010': 'From the freeway at Main St' } });
    expect(off.label).toBe('From the freeway at Main St');
  });
  it('leaves out a connector that runs from one surface street to another', () => {
    nextId = 100;
    const extra = [...links, link(30, 20, 'motorway', '', [[150, 200], [200, 100]])];
    expect(deriveRamps(nodes, extra, fw).filter((r) => r.links.includes(108))).toEqual([]);
  });
  it('builds the plain label shapes', () => {
    expect(rampLabel({ kind: 'on', streets: ['Claremont Ave', 'Hudson St'], direction: 'westbound' }, 'SR-24')).toBe('To SR-24 westbound by the Claremont Ave on-ramp at Hudson St');
    expect(rampLabel({ kind: 'off', streets: [], direction: null })).toBe('From the freeway off-ramp');
  });
});
