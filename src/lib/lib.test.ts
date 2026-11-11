import { describe, expect, it } from 'vitest';
import { makeProjection, metresPerPixel } from './projection';
import { decodeHash, encodeHash } from './hash';
import { buildIndex, directedLabel } from './naming';
import { formatDiff, formatValue, formatClock } from './format';
import { addInterventions } from './scenario';
import { nearestOnPolyline, pickLink } from './geom';
import { buildFixture } from '../fixtures/area';
import { networkHealth } from './metrics';
import type { Intervention, Metrics, Network } from '../types';

const fx = buildFixture().network;

describe('projection', () => {
  const p = makeProjection({ lon: -122.256, lat: 37.8455 });
  it('maps origin to zero and round-trips', () => {
    expect(p.toLocal(-122.256, 37.8455)).toEqual([0, 0]);
    const [lon, lat] = p.toLonLat(123.4, -456.7);
    const [x, y] = p.toLocal(lon, lat);
    expect(x).toBeCloseTo(123.4, 6); expect(y).toBeCloseTo(-456.7, 6);
  });
  it('has sensible scale', () => {
    const [, y] = p.toLocal(-122.256, 37.8455 + 1);
    expect(y).toBeGreaterThan(111000); expect(y).toBeLessThan(111400);
    const [x] = p.toLocal(-122.256 + 1, 37.8455);
    expect(x / y).toBeCloseTo(Math.cos((37.8455 * Math.PI) / 180), 5);
    expect(metresPerPixel(15, 37.8)).toBeCloseTo(1.887, 2);
  });
});

describe('hash', () => {
  const lim = { nodes: 36, links: 120 };
  const list: Intervention[] = [
    { type: 'modal_filter', link: 5 }, { type: 'modal_filter', node: 7 }, { type: 'speed_limit', link: 3, speed: 8.9 },
    { type: 'speed_hump', link: 4, position: 60 }, { type: 'traffic_circle', node: 9 },
    { type: 'control', node: 8, control: 'signal' }, { type: 'signal_timing', node: 8, cycle: 80 },
    { type: 'one_way', link: 10 }, { type: 'turn_ban', fromLink: 1, toLink: 2 },
  ];
  it('round-trips a scenario', () => {
    const h = encodeHash({ area: 'rockridge', period: 'pm_peak', demandScale: 1.2, interventions: list });
    expect(h.startsWith('#')).toBe(true);
    expect(decodeHash(h, lim)).toEqual({ area: 'rockridge', period: 'pm_peak', demandScale: 1.2, interventions: list });
  });
  it('empty state gives empty hash', () => {
    expect(encodeHash({ interventions: [] })).toBe('');
    expect(decodeHash('', lim).interventions).toEqual([]);
  });
  it('drops invalid and out-of-range entries, tolerates garbage', () => {
    const h = encodeHash({ interventions: [{ type: 'modal_filter', link: 999 }, { type: 'one_way', link: 2 }] });
    expect(decodeHash(h, lim).interventions).toEqual([{ type: 'one_way', link: 2 }]);
    expect(decodeHash('#i=%%%notbase64&d=9', lim)).toEqual({ interventions: [] });
  });
});

describe('naming', () => {
  const idx = buildIndex(fx);
  it('names intersections by their streets', () => {
    const n = fx.nodes.find((x) => x.inStudyArea)!;
    expect(idx.nodeName[n.id]).toMatch(/ & /);
  });
  it('builds one block per street segment pair with "between" labels', () => {
    expect(idx.blocks.length).toBe(fx.links.length / 2);
    const b = idx.blocks.find((x) => x.name === 'Cedar St' && x.inStudyArea)!;
    expect(b.links).toHaveLength(2);
    expect(b.label).toMatch(/^Cedar St between .+ and .+$/);
    expect(idx.blockOfLink[b.links[1]]).toBe(idx.blockOfLink[b.links[0]]);
  });
  it('directed label and intersections', () => {
    expect(directedLabel(fx, idx, 0)).toMatch(/ toward /);
    expect(idx.intersections.length).toBeGreaterThan(10);
  });
});

describe('diff formatting', () => {
  it('describes decreases as better when lower is better', () => {
    const d = formatDiff(10, 6, 'dist', true);
    expect(d.verdict).toBe('better'); expect(d.arrow).toBe('↓'); expect(d.pct).toBeCloseTo(-40);
    expect(d.text).toContain('40% lower'); expect(d.text).toContain('better');
  });
  it('flags increases as worse and treats tiny changes as same', () => {
    expect(formatDiff(5, 6, 'count', true).verdict).toBe('worse');
    expect(formatDiff(100, 100.2, 'count', true).direction).toBe('same');
    expect(formatDiff(100, 120, 'count', false).verdict).toBe('better');
    expect(formatDiff(undefined, 1, 'count', true).verdict).toBe('n/a');
  });
  it('converts units', () => {
    expect(formatValue('speed', 11.176)).toBe('25 mph');
    expect(formatValue('share', 0.123)).toBe('12.3%');
    expect(formatValue('minutes', 150)).toBe('2.5 min');
    expect(formatDiff(0.2, 0.1, 'share', true).text).toContain('pp');
    expect(formatClock(3725)).toBe('1:02:05');
  });
});

describe('scenario + geometry', () => {
  it('replaces duplicates and competing node control', () => {
    let l: Intervention[] = [{ type: 'speed_limit', link: 1, speed: 5 }];
    l = addInterventions(l, [{ type: 'speed_limit', link: 1, speed: 8 }]);
    expect(l).toEqual([{ type: 'speed_limit', link: 1, speed: 8 }]);
    l = addInterventions(l, [{ type: 'control', node: 3, control: 'signal' }]);
    l = addInterventions(l, [{ type: 'traffic_circle', node: 3 }]);
    expect(l.filter((x) => 'node' in x)).toHaveLength(1);
  });
  it('hit-tests links and prefers the right-hand direction', () => {
    const g: [number, number][] = [[0, 0], [100, 0]];
    const h = nearestOnPolyline(g, 50, -3);
    expect(h.dist).toBeCloseTo(3); expect(h.along).toBeCloseTo(50); expect(h.side).toBeGreaterThan(0);
    const a = fx.links.find((l) => l.geometry[0][1] === l.geometry[1][1] && l.geometry[1][0] > l.geometry[0][0] && l.inStudyArea)!;
    const mx = (a.geometry[0][0] + a.geometry[1][0]) / 2, y = a.geometry[0][1];
    expect(pickLink(fx, mx, y - 2, 10)!.id).toBe(a.id); // south of an eastbound link is its right side
    expect(pickLink(fx, mx, y + 2, 10)!.id).toBe(a.reverse);
    expect(pickLink(fx, 5000, 5000, 10)).toBeNull();
  });
});

describe('network health', () => {
  const m = (o: Partial<Metrics>) => ({ spawned: 1000, backlog: 0, unroutableTrips: 0, vehiclesInNetwork: 100, ...o }) as Metrics;
  it('is calm by default and when the field is absent', () => {
    expect(networkHealth(m({})).oversaturated).toBe(false);
  });
  it('flags gridlock removals and large backlogs', () => {
    expect(networkHealth(m({ gridlockRemoved: 1 })).oversaturated).toBe(true);
    expect(networkHealth(m({ backlog: 60 })).oversaturated).toBe(true);
    expect(networkHealth(m({ backlog: 10 })).oversaturated).toBe(false);
  });
});

describe('friendly street names', () => {
  it('names unnamed service roads after a neighbouring street and tags cul-de-sac ends', () => {
    const net: Network = JSON.parse(JSON.stringify(fx));
    const l = net.links.find((x) => x.inStudyArea && x.name)!;
    const tail = net.nodes.length;
    net.nodes.push({ id: tail, osmId: 9e6, x: 0, y: 0, control: 'uncontrolled', gate: false, inStudyArea: true });
    const a = net.links.length;
    const mk = (id: number, from: number, to: number, reverse: number) => ({ ...l, id, from, to, reverse, name: '', class: 'service' as const, geometry: [[0, 0], [10, 0]] as [number, number][] });
    net.links.push(mk(a, l.to, tail, a + 1), mk(a + 1, tail, l.to, a));
    const idx = buildIndex(net);
    expect(idx.linkName[a]).toMatch(/^Unnamed service road off /);
    expect(idx.blocks[idx.blockOfLink[a]].label).toMatch(/\(cul-de-sac end\)$/);
  });
});
