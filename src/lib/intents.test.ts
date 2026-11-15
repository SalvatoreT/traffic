import { endsSentence, rampOfIntent, rampPoint } from './intents';
import { describe, expect, it } from 'vitest';
import { apportion, describePaths, intentPaths, intentTable, pathWidth, MAX_PX, MIN_PX } from './intents';
import { buildIndex } from './naming';
import type { DemandIntent, Metrics, NetLink, Network } from '../types';

const defs: DemandIntent[] = [
  { id: 'a', label: 'A', basis: 'observed', note: '' },
  { id: 'b', label: 'B', basis: 'assumed', note: '' },
];
const metrics = (by: number[], total: number): Metrics => ({ cutThrough: { vehicles: 0, vehiclesPerHour: total, vehKm: 0, shareOfLocalVehKm: 0, byIntent: by.map((v, i) => ({ id: String(i), vehicles: 0, vehiclesPerHour: v })) } } as unknown as Metrics);

describe('apportion', () => {
  it('keeps the rounded total', () => {
    const v = [10.4, 20.4, 30.4, 40.4];
    const r = apportion(v, 101.6);
    expect(r.reduce((a, b) => a + b, 0)).toBe(102);
    r.forEach((x, i) => expect(Math.abs(x - v[i])).toBeLessThan(1));
  });
  it('is exact for whole numbers', () => expect(apportion([1, 2, 3], 6)).toEqual([1, 2, 3]));
});

describe('intentTable', () => {
  it('adds the rows to the total for each run and subtracts like for like', () => {
    const t = intentTable(defs, metrics([10.4, 20.4, 5.3], 36.1), metrics([8.6, 20.5, 4.9], 34))!;
    expect(t.rows.map((r) => r.id)).toEqual(['a', 'b', 'other']);
    expect(t.rows.reduce((s, r) => s + r.base!, 0)).toBe(t.baseTotal);
    expect(t.rows.reduce((s, r) => s + r.scen!, 0)).toBe(t.scenTotal);
    expect(t.baseTotal).toBe(36);
    expect(t.scenTotal).toBe(34);
    expect(t.rows.every((r) => r.change === r.scen! - r.base!)).toBe(true);
    expect(t.changeTotal).toBe(-2);
  });
  it('reports nothing for a build without intents or a mismatched list', () => {
    expect(intentTable(undefined, null, metrics([1], 1))).toBeNull();
    expect(intentTable(defs, null, metrics([1, 2], 3))).toBeNull();
  });
  it('works with no baseline yet', () => {
    const t = intentTable(defs, null, metrics([1, 2, 3], 6))!;
    expect(t.rows[0].base).toBeNull();
    expect(t.changeTotal).toBeNull();
  });
});

describe('intentPaths', () => {
  it('turns cumulative counts into cars an hour and drops light links', () => {
    // Over 1800 s a count of 30 is 60 cars an hour.
    const links = new Float32Array([0, 5, 30, 0, 6, 1, 1, 5, 99]);
    const p = intentPaths(links, 0, 'a', 1800, 60);
    expect(p.segments).toEqual([{ link: 5, vph: 60 }]);
    expect(p.maxVph).toBe(60);
  });
  it('width grows with flow within bounds', () => {
    expect(pathWidth(1)).toBe(MIN_PX);
    expect(pathWidth(40)).toBeGreaterThan(pathWidth(10));
    expect(pathWidth(10000)).toBe(MAX_PX);
  });
});

describe('describePaths', () => {
  const nodes = [0, 1, 2, 3].map((id) => ({ id, osmId: id, x: 0, y: -id * 100, control: 'uncontrolled', gate: false, inStudyArea: id > 0 && id < 3 })) as unknown as Network['nodes'];
  const mk = (id: number, from: number, to: number, name: string, cls: string, inStudy: boolean): NetLink => ({
    id, from, to, name, class: cls, inStudyArea: inStudy, reverse: null, lanes: 1, speedLimit: 11, length: 100, geometry: [[0, -from * 100], [0, -to * 100]],
    fromBearing: 180, toBearing: 180,
  }) as unknown as NetLink;
  const net = { nodes, links: [mk(0, 0, 1, 'Alcatraz Avenue', 'secondary', false), mk(1, 1, 2, 'Hillegass Avenue', 'residential', true), mk(2, 2, 3, 'Claremont Avenue', 'secondary', false)], bbox: [0, 0, 0, 0], studyArea: [] } as unknown as Network;
  it('names where cars turn off, the street they use and where they rejoin', () => {
    const idx = buildIndex(net);
    const text = describePaths(net, idx, { id: 'a', total: 50, maxVph: 50, segments: [{ link: 0, vph: 50 }, { link: 1, vph: 48 }, { link: 2, vph: 47 }] });
    expect(text).toBe('Mostly turns off Alcatraz Avenue, uses Hillegass Avenue southbound, and rejoins Claremont Avenue.');
  });
  it('says so when no side street is on the path', () => {
    const idx = buildIndex(net);
    expect(describePaths(net, idx, { id: 'a', total: 50, maxVph: 50, segments: [{ link: 0, vph: 50 }] })).toMatch(/No typical path/);
  });
});

describe('describePaths stability', () => {
  const nodes = [0, 1, 2, 3, 4].map((id) => ({ id, osmId: id, x: 0, y: -id * 100, control: 'uncontrolled', gate: false, inStudyArea: id > 0 && id < 4 })) as unknown as Network['nodes'];
  const mk = (id: number, from: number, to: number, name: string, cls: string, inStudy: boolean): NetLink => ({
    id, from, to, name, class: cls, inStudyArea: inStudy, reverse: null, lanes: 1, speedLimit: 11, length: 100, geometry: [[0, -from * 100], [0, -to * 100]],
    fromBearing: 180, toBearing: 180,
  }) as unknown as NetLink;
  const net = { nodes, links: [mk(0, 0, 1, 'Alcatraz Avenue', 'secondary', false), mk(1, 1, 2, 'Hillegass Avenue', 'residential', true), mk(2, 2, 3, 'Ashby Street', 'residential', true), mk(3, 3, 4, 'Claremont Avenue', 'secondary', false)], bbox: [0, 0, 0, 0], studyArea: [] } as unknown as Network;
  const idx = buildIndex(net);
  const say = (a: number, b: number) => describePaths(net, idx, { id: 'a', total: 60, maxVph: 60, segments: [{ link: 0, vph: 60 }, { link: 1, vph: a }, { link: 2, vph: b }, { link: 3, vph: 55 }] });
  it('keeps the same sentence when two streets trade places by a small margin', () => {
    expect(say(50, 48)).toBe(say(48, 50));
    expect(say(50, 50)).toBe(say(50, 49));
  });
  it('lists the stronger street first once the difference is material', () => {
    expect(say(60, 20)).toMatch(/uses Hillegass Avenue southbound and Ashby Street southbound/);
    expect(say(20, 60)).toMatch(/uses Ashby Street southbound and Hillegass Avenue southbound/);
  });
});

describe('freeway ramp reasons', () => {
  const ramps = [{ id: 'on-1', kind: 'on' as const, node: 1, links: [3], label: 'To SR-9 by the Main St on-ramp' }];
  const defs = [
    { id: 'a', label: 'To SR-9 by the Main St on-ramp', section: 'To the freeway, by on-ramp', onRamp: 'on-1', basis: 'observed' as const, note: 'x' },
    { id: 'b', label: 'Other on-ramps', section: 'To the freeway, by on-ramp', onRamp: 'other', basis: 'assumed' as const, note: 'y' },
    { id: 'c', label: 'Cross-town', section: 'Not using the freeway', basis: 'assumed' as const, note: 'z' },
  ];
  it('rows carry the section heading of their reason', () => {
    const m = (v: number[]) => ({ cutThrough: { vehiclesPerHour: v.reduce((x, y) => x + y, 0), byIntent: [...v.map((x, i) => ({ id: String(i), vehicles: x, vehiclesPerHour: x })), { id: 'other', vehicles: 0, vehiclesPerHour: 0 }] } }) as never;
    const t = intentTable(defs, null, m([5, 3, 2]))!;
    expect(t.rows.map((r) => r.section)).toEqual(['To the freeway, by on-ramp', 'To the freeway, by on-ramp', 'Not using the freeway', undefined]);
  });
  it('finds the ramp a reason is keyed by, and none for other', () => {
    expect(rampOfIntent(defs[0], ramps)?.id).toBe('on-1');
    expect(rampOfIntent(defs[1], ramps)).toBeNull();
    expect(rampOfIntent(defs[2], ramps)).toBeNull();
    expect(rampOfIntent(defs[0], undefined)).toBeNull();
  });
  it('places the ramp point at its surface node', () => {
    const net = { nodes: [{ x: 0, y: 0 }, { x: 12, y: -7 }] } as never;
    expect(rampPoint(net, ramps[0])).toEqual({ x: 12, y: -7, label: 'To SR-9 by the Main St on-ramp' });
  });
  it('says where cars start for an on-ramp reason and where they are bound for an off-ramp reason', () => {
    const ends = { from: [{ label: 'Berkeley', share: 62 }, { label: 'Telegraph Ave north', share: 30 }], to: [{ label: 'SR-24', share: 100 }] };
    expect(endsSentence({ onRamp: 'on-1' }, ends)).toBe('In the model these cars mostly start in Berkeley (62%) and Telegraph Ave north (30%).');
    expect(endsSentence({ offRamp: 'off-1' }, { from: [{ label: 'SR-24', share: 100 }], to: [{ label: 'Berkeley', share: 70 }] })).toBe('In the model these cars mostly are bound for Berkeley (70%).');
    expect(endsSentence({}, ends)).toContain('start in Berkeley');
    expect(endsSentence({}, ends)).toContain('are bound for SR-24');
    expect(endsSentence({ onRamp: 'x' }, null)).toBe('');
  });
});
