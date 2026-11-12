import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildRegion, FADE_TIERS } from './region';
import { computeFocus, REGION_BUFFER_M, ringLocal, distToRing, inRing } from './area';

const net = buildFixture().network;
const region = buildRegion(net);
const ring = ringLocal(net);
const sd = (x: number, y: number) => (inRing(ring, x, y) ? -1 : 1) * distToRing(ring, x, y);

describe('visible region', () => {
  it('is the study area buffered by the named constant', () => {
    expect(REGION_BUFFER_M).toBe(250);
    const [x, y] = ring[0];
    expect(region.contains(x, y)).toBe(true);
    // Walk outward from a vertex until the test flips; the flip is at the buffer distance.
    let r = 0;
    while (region.contains(x - r, y - r)) r += 1;
    expect(sd(x - r, y - r)).toBeGreaterThanOrEqual(REGION_BUFFER_M - 2);
    expect(sd(x - r, y - r)).toBeLessThan(REGION_BUFFER_M + 4);
  });
  it('grid tiers agree with the exact test away from the edge and fade near it', () => {
    for (const [x, y] of ring) expect(region.tier(x, y)).toBe(FADE_TIERS);
    const [x, y] = ring[0];
    expect(region.tier(x - 1000, y - 1000)).toBe(0);
    let seen = new Set<number>();
    for (let r = 0; r < 400; r += 4) seen.add(region.tier(x - r, y - r));
    expect([...seen].sort()).toEqual([0, 1, 2, 3, 4].filter((t) => seen.has(t)));
    expect(seen.size).toBeGreaterThan(2);
  });
  it('clips lines at the edge and keeps interior ones whole', () => {
    const [x, y] = ring[0];
    const long: [number, number][] = [[x, y], [x - 2000, y - 2000]];
    const parts = region.clipLine(long);
    expect(parts).toHaveLength(1);
    const end = parts[0][parts[0].length - 1];
    expect(Math.abs(sd(end[0], end[1]) - REGION_BUFFER_M)).toBeLessThan(1);
    expect(region.clipLine([[x - 3000, y - 3000], [x - 2000, y - 2000]])).toEqual([]);
    const inside: [number, number][] = [ring[0], ring[1]];
    expect(region.clipLine(inside)).toEqual([inside]);
    // A line that crosses the whole region enters and leaves.
    const cross = region.clipLine([[x - 2000, y], [x + 2000, y]]);
    expect(cross.length).toBe(1);
  });
  it('contour rings lie at the requested distance', () => {
    const rings = region.contour(REGION_BUFFER_M);
    expect(rings.length).toBe(1);
    for (const [px, py] of rings[0]) expect(Math.abs(sd(px, py) - REGION_BUFFER_M)).toBeLessThan(3);
    expect(rings[0][0]).toEqual(rings[0][rings[0].length - 1]);
  });
  it('matches the picker focus when nothing is flagged beyond the buffer', () => {
    const f = computeFocus(net);
    net.nodes.forEach((n) => { if (region.contains(n.x, n.y)) expect(f.node[n.id]).toBe(true); });
  });
});
