import { describe, expect, it } from 'vitest';
import type { NetLink, NetNode } from '../src/types';
import { assignCorridors, corridorCfgOf, corridorPeriod, readTrip, type CutCorridorsCfg, type NetView } from './lib/cut-corridors';

const P: Record<number, [number, number]> = { 0: [0, 500], 1: [0, 400], 2: [0, 200], 3: [0, 0], 4: [0, -100], 5: [-100, 200], 6: [-300, 200], 7: [-300, 0], 8: [-400, 0] };
const nodes = Object.entries(P).map(([id, [x, y]]) => ({ id: Number(id), x, y, osmId: 0, control: 'none', gate: false, inStudyArea: true }) as unknown as NetNode);
const mk = (id: number, name: string, cls: string, inside: boolean, from: number, to: number): NetLink => ({
  id, name, class: cls, inStudyArea: inside, from, to, length: Math.hypot(P[to][0] - P[from][0], P[to][1] - P[from][1]), geometry: [P[from], P[to]],
}) as unknown as NetLink;
const links = [
  mk(0, 'North Rd', 'primary', false, 0, 1), mk(1, 'Spine Ave', 'residential', true, 1, 2), mk(2, 'Spine Ave', 'residential', true, 2, 3), mk(3, 'South Rd', 'primary', false, 3, 4),
  mk(4, 'Cross St', 'residential', true, 2, 5), mk(5, 'Cross St', 'residential', true, 5, 6), mk(6, 'Wide St', 'residential', true, 6, 7), mk(7, 'West Rd', 'primary', false, 7, 8),
  mk(8, 'Spine Ave', 'residential', true, 3, 2), mk(9, 'Spine Ave', 'residential', true, 2, 1), mk(10, 'South Rd', 'primary', false, 4, 3), mk(11, 'North Rd', 'primary', false, 1, 0),
];
const net: NetView = { nodes, links };
const cfg: CutCorridorsCfg = {
  corridors: [
    { id: 'spine', name: 'Spine Ave', streets: ['Spine Ave'], directionBy: 'compass' },
    { id: 'west', name: 'West streets', streets: ['Wide St'], directionBy: 'ends' },
  ],
  otherName: 'Other side streets', nearestM: 400, secondShare: 0.3,
  sides: { west: ['West Rd'], east: ['North Rd', 'South Rd'] },
  bounding: ['North Rd', 'South Rd', 'West Rd'],
};

describe('assigning side streets to corridors', () => {
  const a = assignCorridors(net, cfg);
  it('gives a named street to its corridor, an unnamed one to the nearest named block, and leaves arterials out', () => {
    expect([...a.corridorOf]).toEqual([-1, 0, 0, -1, 0, 1, 1, -1, 0, 0, -1, -1]);
  });
  it('lists each corridor’s streets and marks streets shared between corridors as partial', () => {
    expect(a.defs.corridors[0].streets).toEqual([{ name: 'Spine Ave', part: false }, { name: 'Cross St', part: true }]);
    expect(a.defs.corridors[1].streets).toEqual([{ name: 'Cross St', part: true }, { name: 'Wide St', part: false }]);
  });
  it('sends a block beyond the nearest distance to the remainder', () => {
    expect(assignCorridors(net, { ...cfg, nearestM: 30 }).corridorOf[5]).toBe(2);
  });
  it('stops on a street in two corridors, a street that is not there, and a reserved id', () => {
    expect(() => assignCorridors(net, { ...cfg, corridors: [cfg.corridors[0], { ...cfg.corridors[1], streets: ['Spine Ave'] }] })).toThrow(/both/);
    expect(() => assignCorridors(net, { ...cfg, corridors: [{ ...cfg.corridors[0], streets: ['Nowhere St'] }] })).toThrow(/no side street/);
    expect(() => assignCorridors(net, { ...cfg, corridors: [{ ...cfg.corridors[0], id: 'other' }] })).toThrow(/reserved/);
  });
});

describe('reading one trip', () => {
  const a = assignCorridors(net, cfg);
  it('names a compass direction along a corridor and the bounding streets the trip used', () => {
    const south = readTrip(net, a, cfg, [0, 1, 2, 3])!;
    expect(south).toMatchObject({ corridor: 0, direction: 'Southbound', from: 'North Rd', to: 'South Rd' });
    expect(readTrip(net, a, cfg, [10, 8, 9, 11])).toMatchObject({ corridor: 0, direction: 'Northbound', from: 'South Rd', to: 'North Rd' });
  });
  it('files a trip under the corridor with most of its side-street distance and names an ends corridor by its bounding streets', () => {
    const r = readTrip(net, a, cfg, [0, 1, 4, 5, 6, 7])!;
    expect(r.corridor).toBe(1);
    expect(r.direction).toBe('North Rd to West Rd');
    expect(r.secondShare).toBeCloseTo(300 / 700);
  });
  it('says so when the trip was still on the side streets at the end of the hour', () => {
    expect(readTrip(net, a, cfg, [0, 1, 4, 5, 6])!.direction).toBe('From North Rd, still driving');
  });
  it('names a flow along the other axis as running on cross streets', () => {
    const r = readTrip(net, a, { ...cfg, corridors: [cfg.corridors[0], { ...cfg.corridors[1], directionBy: 'compass' }] }, [0, 1, 4, 5, 6, 7])!;
    expect(r.direction).toBe('Westbound on cross streets');
  });
  it('has no reading for a trip on no side street', () => {
    expect(readTrip(net, a, cfg, [3])).toBeNull();
  });
});

describe('the table of one hour', () => {
  const a = assignCorridors(net, cfg);
  const trips = [
    { slot: 0, origin: 0, dest: 0, links: [0, 1, 2, 3] }, { slot: 1, origin: 0, dest: 0, links: [0, 1, 2, 3] }, { slot: 2, origin: 0, dest: 0, links: [0, 1, 2, 3] },
    { slot: 1, origin: 0, dest: 0, links: [10, 8, 9, 11] },
    { slot: 2, origin: 0, dest: 0, links: [0, 1, 4, 5, 6, 7] },
    { slot: 0, origin: 0, dest: 0, links: [3] },
  ];
  const r = corridorPeriod(net, a, cfg, trips, 3, 1);
  it('adds up: every trip with a side street is in exactly one flow, and each flow’s reasons add up to it', () => {
    expect(r.noLocal).toBe(1);
    expect(r.period.flows.reduce((s, f) => s + f.vph, 0)).toBe(5);
    for (const f of r.period.flows) expect(f.byIntent.reduce((s, v) => s + v, 0)).toBeCloseTo(f.vph);
    expect(r.period.flows.map((f) => `${f.corridor}|${f.direction}|${f.vph}`)).toEqual(['spine|Southbound|3', 'spine|Northbound|1', 'west|North Rd to West Rd|1']);
  });
  it('turns counts into cars an hour over the elapsed hours', () => {
    const half = corridorPeriod(net, a, cfg, trips, 3, 0.5);
    expect(half.period.flows[0].vph).toBe(6);
  });
  it('counts trips that use a second corridor and the ones that cross from one side to the other', () => {
    expect(r.period.multi).toEqual({ vph: 5, second: 1 });
    expect(r.period.crossing).toEqual([
      { from: 'North Rd', to: 'West Rd', corridor: 'west', vph: 1 },
    ]);
  });
});

describe('corridor settings of an area config', () => {
  it('takes the bounding streets from the boundary and leaves the freeway out', () => {
    const c = corridorCfgOf({ cutThroughCorridors: { ...cfg }, boundary: ['A Ave', { ref: 'CA 24', class: 'motorway' }, { name: 'B St' }] })!;
    expect(c.bounding).toEqual(['A Ave', 'B St']);
  });
  it('is null without the field and stops on a malformed one', () => {
    expect(corridorCfgOf({})).toBeNull();
    expect(() => corridorCfgOf({ cutThroughCorridors: { ...cfg, secondShare: 0 } })).toThrow(/secondShare/);
    expect(() => corridorCfgOf({ cutThroughCorridors: { ...cfg, corridors: [] } })).toThrow(/at least one/);
  });
});
