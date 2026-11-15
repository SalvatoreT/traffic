import { describe, expect, it } from 'vitest';
import type { Network } from '../types';
import { nearestOnPolyline } from './geom';
import { buildOverview, buildTurnMap, shortStreet, turnGeometry, turnWords } from './turnmap';
import type { BaseMap } from './picture';

type XY = [number, number];
const link = (id: number, name: string, from: number, to: number, geometry: XY[]) => ({
  id, name, from, to, geometry, length: geometry.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - geometry[i - 1][0], p[1] - geometry[i - 1][1]) : 0), 0), class: 'residential', reverse: null,
});
// A cross at the origin: Main St runs north (y up) into the junction; Cross St runs west and east from it.
const net = {
  links: [
    link(0, 'Main Street', 0, 1, [[0, -120], [0, 0]]),
    link(1, 'Cross Street', 1, 2, [[0, 0], [-120, 0]]),
    link(2, 'Cross Street', 1, 3, [[0, 0], [120, 0]]),
    link(3, 'Cross Street', 4, 1, [[-120, 0], [0, 0]]),
    link(4, 'Main Street', 1, 5, [[0, 0], [0, -120]]),
  ],
} as unknown as Network;
const base = { view: { x: -200, y: -200, w: 400, h: 400 }, unit: 1, outline: '', major: '', minor: '', names: [] } as BaseMap;

describe('turn geometry', () => {
  it('leaves the approach link and enters the exit link', () => {
    const g = turnGeometry(net, 0, 1, 50);
    expect(nearestOnPolyline(net.links[0].geometry, g.start[0], g.start[1]).dist).toBeLessThan(0.5);
    expect(nearestOnPolyline(net.links[1].geometry, g.end[0], g.end[1]).dist).toBeLessThan(0.5);
    expect(g.start[1]).toBeLessThan(g.corner[1]);
    expect(g.end[0]).toBeLessThan(g.corner[0]);
  });
  it('curves left for a left turn and right for a right turn', () => {
    expect(turnGeometry(net, 0, 1, 50).turn).toBe('left');
    expect(turnGeometry(net, 0, 2, 50).turn).toBe('right');
    expect(turnGeometry(net, 3, 4, 50).turn).toBe('right');
  });
  it('tells straight on from a turn', () => {
    expect(turnGeometry(net, 3, 2, 50).turn).toBe('straight');
  });
  it('never reaches past a short link', () => {
    const g = turnGeometry(net, 0, 1, 500);
    expect(Math.hypot(g.start[0] - g.corner[0], g.start[1] - g.corner[1])).toBeLessThanOrEqual(0.8 * 120 + 1e-6);
  });
});

describe('turn map', () => {
  it('names both streets with their direction and carries the arrow into the exit', () => {
    const m = buildTurnMap(net, 0, 1, base);
    expect(m.turn).toBe('left');
    expect(m.words).toBe('Main Street northbound, left onto Cross Street westbound');
    expect(m.labels.map((l) => l.text)).toEqual(['Main St northbound', 'Cross St westbound']);
    expect(Math.abs(m.arrow.head.angle)).toBeCloseTo(180, 0);
    expect(m.view.w).toBeGreaterThan(0);
  });
  it('words a right turn', () => {
    expect(turnWords(net, 0, 2, 'right')).toBe('Main Street northbound, right onto Cross Street eastbound');
  });
  it('shortens street types', () => {
    expect(shortStreet('Colby Street')).toBe('Colby St');
    expect(shortStreet('Alcatraz Avenue')).toBe('Alcatraz Ave');
  });
});

describe('overview', () => {
  it('numbers every turn once and groups them by junction', () => {
    const o = buildOverview(net, [{ n: 1, from: 0, to: 1 }, { n: 2, from: 0, to: 2 }, { n: 3, from: 3, to: 4 }], base);
    expect(o.markers.map((m) => m.n).sort()).toEqual([1, 2, 3]);
    expect(o.junctions).toHaveLength(1);
    expect(o.junctions[0].lines).toEqual(['Main St', 'and Cross St']);
  });
});
