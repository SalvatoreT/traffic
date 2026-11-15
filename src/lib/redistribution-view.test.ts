import { describe, expect, it } from 'vitest';
import type { Network } from '../types';
import type { GraphQuery } from './redistribution';
import { canTrace, effectStatus, linksD, mapFrame, possiblePaths, signed, streetsOf } from './redistribution-view';

const node = (id: number, x: number, y: number) => ({ id, osmId: id, x, y, control: 'uncontrolled' as const, gate: false, inStudyArea: true });
const link = (id: number, from: number, to: number, name: string, g: [number, number][]) => ({
  id, osmWayId: id, from, to, reverse: null, name, class: 'residential' as const, lanes: 1, speedLimit: 11, length: 100, geometry: g, stopAtEnd: false, humps: [], inStudyArea: true,
});
const net = {
  version: 1, id: 't', name: 't', origin: { lon: 0, lat: 0 }, bbox: [0, 0, 0, 0], studyArea: [],
  nodes: [node(0, 0, 0), node(1, 100, 0), node(2, 100, 100), node(3, 2000, 0)],
  links: [link(0, 0, 1, 'Main St', [[0, 0], [100, 0]]), link(1, 1, 2, 'Side St', [[100, 0], [100, 100]]), link(2, 2, 0, 'Side St', [[100, 100], [0, 0]]), link(3, 1, 3, 'Far Rd', [[100, 0], [2000, 0]])],
} as unknown as Network;

describe('redistribution view', () => {
  it('offers the view only for changes that can remove movements', () => {
    expect(canTrace({ type: 'modal_filter', node: 1 })).toBe(true);
    expect(canTrace({ type: 'turn_ban', fromLink: 0, toLink: 1 })).toBe(true);
    expect(canTrace({ type: 'speed_hump', link: 0, position: 3 })).toBe(false);
  });

  it('lists each possible path once, smallest detour first, and reports caps and disconnection', () => {
    const w = (paths: { links: number[]; costS: number; baselineCostS: number }[], status: 'found' | 'disconnected' = 'found', found = paths.length) => ({ movement: [0, 3] as [number, number], node: 1, starts: [], targets: [], status, servedPairs: 1, exhaustive: true, listed: paths.length, found, cap: 3, paths });
    const g = { witnesses: [w([{ links: [0, 1, 2], costS: 40, baselineCostS: 10 }, { links: [0, 1], costS: 15, baselineCostS: 10 }], 'found', 5), w([{ links: [0, 1], costS: 15, baselineCostS: 10 }]), w([], 'disconnected')] } as unknown as GraphQuery;
    const p = possiblePaths(net, g);
    expect(p.items.map((x) => x.streets)).toEqual(['Main St → Side St', 'Main St → Side St']);
    expect(p.items.map((x) => x.extraS)).toEqual([5, 30]);
    expect(p.capped).toBe(true);
    expect(p.disconnected).toEqual(['Main St → Far Rd']);
  });

  it('frames the closure and keeps links that reach into the square', () => {
    const f = mapFrame(net, [1], 450);
    expect(f.w).toBe(900);
    expect(f.links.map((l) => l.id)).toEqual([0, 1, 2, 3]);
    expect(linksD(net, [0, 1], f)).toBe('M350.0 450.0 L450.0 450.0 L450.0 350.0');
    expect(streetsOf(net, [1, 2, 3])).toBe('Side St → Far Rd');
  });

  it('says what an interval resolves and never reads too few runs as no change', () => {
    expect(effectStatus({ n: 1, mean: 5, sd: 0, status: 'insufficient' })).toMatch(/too few/);
    expect(effectStatus({ n: 10, mean: 5, sd: 1, interval: [3.2, 6.8], status: 'increase' })).toBe('95% interval +3 to +7, a resolved increase');
    expect(effectStatus({ n: 10, mean: 1, sd: 3, interval: [-1.1, 3.1], status: 'unresolved' })).toMatch(/includes zero/);
    expect(effectStatus(null)).toBe('not available');
    expect(signed(-2.4)).toBe('−2');
  });
});
