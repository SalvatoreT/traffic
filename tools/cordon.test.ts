import { describe, expect, it } from 'vitest';
import { buildCordon, cutRoute, type CNet } from './lib/cordon';
import { makeProjection } from './lib/geo';

// A straight east-west street of five nodes 100 m apart (parent); the child keeps the middle stretch from x = 50 to x = 250, cut at both ends.
const origin = { lon: -122.25, lat: 37.84 };
const proj = makeProjection(origin.lon, origin.lat);
const ll = (x: number, y: number) => proj.inv(x, y) as [number, number];
const pNodes = [0, 100, 200, 300, 400].map((x, id) => ({ id, x, y: 0, gate: id === 0 || id === 4 }));
const pLinks = pNodes.slice(1).flatMap((n, i) => [
  { id: 2 * i, from: i, to: i + 1, class: 'residential', geometry: [[pNodes[i].x, 0], [n.x, 0]] as [number, number][] },
  { id: 2 * i + 1, from: i + 1, to: i, class: 'residential', geometry: [[n.x, 0], [pNodes[i].x, 0]] as [number, number][] },
]);
const parent: CNet = { origin, nodes: pNodes, links: pLinks };
const child: CNet = {
  origin,
  nodes: [
    { id: 0, x: 50, y: 0, gate: true, canEnter: true, canExit: true },
    { id: 1, x: 100, y: 0, gate: false },
    { id: 2, x: 200, y: 0, gate: false },
    { id: 3, x: 250, y: 0, gate: true, canEnter: true, canExit: true },
  ],
  links: [],
};
const polygon = [ll(50, -50), ll(250, -50), ll(250, 50), ll(50, 50), ll(50, -50)];

describe('cordon extraction', () => {
  const c = buildCordon(parent, child, polygon);
  it('marks the parent nodes inside the extent', () => {
    expect([...c.inside]).toEqual([0, 1, 1, 0, 0]);
  });
  it('turns a route across the extent into a gate-to-gate trip', () => {
    expect(cutRoute(c, pLinks, [0, 2, 4, 6], 0, 4)).toEqual([{ o: 0, d: 3 }]);
  });
  it('keeps an inside origin as a node and cuts at the exit gate', () => {
    expect(cutRoute(c, pLinks, [2, 4, 6], 1, 4)).toEqual([{ o: 1, d: 3 }]);
  });
  it('gives nothing for a route that stays outside', () => {
    expect(cutRoute(c, pLinks, [6], 3, 4)).toEqual([]);
  });
});
