import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { mergeLinkGroups } from './lib/link-groups';
import { applySplit, corridorOf, splitStationOf, type Station } from './lib/demand-fit';
import { checkManifest, freezeSplit, heldStationIds, DEFAULT_RULE } from './lib/lineage';
import { assign, buildGraph, type ALink, type ANode } from './lib/assign';
import { assigned, DEFAULT_FIT, fitToCounts, type Constraint, type FlowType } from './lib/fit-counts';
import { scoreStations } from './lib/assess';

const P = ['am_peak', 'pm_peak'];
const ramp = (id: string, link: number, t: [number, number], extra: Partial<Station> = {}): Station => ({
  id, kind: 'ramp', label: `on-ramp ${id}`, basis: 'DATA (ramp ADT 675)', links: [link], detectors: ['start'], target: { am_peak: t[0], pm_peak: t[1] }, weight: 2, tolPct: 5,
  records: [{ key: id, share: 1 }], source: 'caltrans-ramp', year: 2024, derived: ['am_peak'], observations: ['row A'], ...extra,
});
const other = (id: string): Station => ({ ...ramp(id, 9, [10, 20]), observations: ['row B'] });
const group = [{ stations: ['ramp on 1', 'ramp on 2'] }];

describe('link groups', () => {
  it('changes nothing without a group', () => {
    const s = [ramp('ramp on 1', 1, [50, 60]), ramp('ramp on 2', 2, [50, 60])];
    expect(mergeLinkGroups(s, undefined, P)).toEqual({ stations: s, notes: [] });
    expect(mergeLinkGroups(s, [], P).stations).toBe(s);
  });

  it('merges two stations of one row into one over the sum of their links', () => {
    const s = [other('x'), ramp('ramp on 1', 1, [52, 61]), other('y'), ramp('ramp on 2', 2, [51, 60])];
    const r = mergeLinkGroups(s, group, P);
    expect(r.stations.map((q) => q.id)).toEqual(['x', 'ramp on 1 + ramp on 2', 'y']);
    const m = r.stations[1];
    expect(m.links).toEqual([1, 2]);
    expect(m.detectors).toEqual(['start', 'start']);
    expect(m.target).toEqual({ am_peak: 103, pm_peak: 121 });
    expect(m.weight).toBe(2);
    expect(m.kind).toBe('ramp');
    expect(m.records.map((q) => q.key)).toEqual(['ramp on 1', 'ramp on 2']);
    expect(m.observations).toEqual(['row A']);
    expect(m.derived).toEqual(['am_peak']);
    expect(m.source).toBe('caltrans-ramp');
    expect(m.year).toBe(2024);
    expect(m.held).toBeUndefined();
    expect(corridorOf(m)).toBe('freeway ramps');
    expect(r.notes[0]).toMatch(/^link group ramp on 1 \+ ramp on 2: 2 stations of one source row become one station over links 1, 2; the target is the sum \(am_peak 103, pm_peak 121 veh\/h/);
    expect(s).toHaveLength(4);
  });

  it('takes the id from the config, the larger weight and the union of derived periods', () => {
    const s = [ramp('ramp on 1', 1, [50, 60], { weight: 1, derived: [] }), ramp('ramp on 2', 2, [50, 60], { weight: 3, tolPct: 8 })];
    const m = mergeLinkGroups(s, [{ ...group[0], id: 'pair' }], P).stations[0];
    expect(m.id).toBe('pair');
    expect(m.weight).toBe(3);
    expect(m.tolPct).toBe(8);
    expect(m.derived).toEqual(['am_peak']);
  });

  it('leaves a group out when no member is in the view and stops when only some are', () => {
    const none = mergeLinkGroups([other('x')], group, P);
    expect(none.stations.map((q) => q.id)).toEqual(['x']);
    expect(none.notes[0]).toMatch(/none of its stations is in this view; left out/);
    expect(() => mergeLinkGroups([ramp('ramp on 1', 1, [1, 1])], group, P)).toThrow(/ramp on 2 is missing while ramp on 1 is present/);
  });

  it('stops when the members are on different sides of the split', () => {
    const s = [ramp('ramp on 1', 1, [1, 1], { held: true }), ramp('ramp on 2', 2, [1, 1], { held: false })];
    expect(() => mergeLinkGroups(s, group, P)).toThrow(/different sides of the split.*ramp on 1 held out, ramp on 2 fitted.*not re-frozen/);
  });

  it('keeps the held flag when both members are held out', () => {
    const s = [ramp('ramp on 1', 1, [1, 1], { held: true }), ramp('ramp on 2', 2, [1, 1], { held: true })];
    expect(mergeLinkGroups(s, group, P).stations[0].held).toBe(true);
  });

  it('refuses members that cannot be one count', () => {
    expect(() => mergeLinkGroups([ramp('ramp on 1', 1, [1, 1]), ramp('ramp on 2', 1, [1, 1])], group, P)).toThrow(/a link is in two members/);
    expect(() => mergeLinkGroups([ramp('ramp on 1', 1, [1, 1]), ramp('ramp on 2', 2, [1, 1], { observations: ['row B'] })], group, P)).toThrow(/do not share a source observation/);
    expect(() => mergeLinkGroups([ramp('ramp on 1', 1, [1, 1]), ramp('ramp on 2', 2, [1, 1], { year: 2012 })], group, P)).toThrow(/differ in source or count year/);
    expect(() => mergeLinkGroups([ramp('ramp on 1', 1, [1, 1]), ramp('ramp on 2', 2, [1, 1], { feature: { kind: 'move', a: 1, b: 2 } as never })], group, P)).toThrow(/every member must be a link station/);
    expect(() => mergeLinkGroups([ramp('ramp on 1', 1, [1, 1]), ramp('ramp on 2', 2, [1, 1])], [{ stations: ['ramp on 1'] }], P)).toThrow(/at least two stations/);
    expect(() => mergeLinkGroups([ramp('ramp on 1', 1, [1, 1]), ramp('ramp on 2', 2, [1, 1])], [group[0], group[0]], P)).toThrow(/is in two groups/);
  });
});

describe('the frozen split and the merged station', () => {
  const stations = [ramp('ramp on 1', 1, [1, 1]), ramp('ramp on 2', 2, [1, 1]), other('x'), { ...other('y'), observations: ['row C'] }];
  const split = freezeSplit('toy', stations.map(splitStationOf), DEFAULT_RULE);

  it('names both members in one group, so the manifest still matches the stations before the merge and the merge does not touch it', () => {
    expect(split.groups.find((g) => g.observations.includes('row A'))!.stations).toEqual(['ramp on 1', 'ramp on 2']);
    expect(checkManifest(split, stations.map(splitStationOf))).toEqual([]);
    const before = JSON.stringify(split);
    const fresh = stations.map((s) => ({ ...s, target: { ...s.target } }));
    applySplit(fresh, split);
    expect(fresh[0].held).toBe(fresh[1].held);
    const merged = mergeLinkGroups(fresh, group, P).stations;
    expect(merged.find((s) => s.id === 'ramp on 1 + ramp on 2')!.held).toBe(fresh[0].held);
    expect(JSON.stringify(split)).toBe(before);
    expect(heldStationIds(split).has('ramp on 1')).toBe(heldStationIds(split).has('ramp on 2'));
  });

  it('would fail the manifest check if the members were merged before it, which is why the merge runs after the split', () => {
    const merged = mergeLinkGroups(stations, group, P).stations;
    expect(checkManifest(split, merged.map(splitStationOf)).some((p) => /different stations/.test(p))).toBe(true);
  });
});

describe('the fit and the scoring read a link group as one count over the sum', () => {
  // Toy cross as in fit-counts.test.ts: link 2 is C>E, link 5 is C>N. Only W>E (links 0, 2) is routed; nothing can use link 5.
  const nodes: ANode[] = [{ id: 0, x: -500, y: 0, control: 'uncontrolled' }, { id: 1, x: 0, y: 0, control: 'uncontrolled' }, { id: 2, x: 500, y: 0, control: 'uncontrolled' }, { id: 3, x: 0, y: 500, control: 'uncontrolled' }];
  const mk = (id: number, from: number, to: number): ALink => ({ id, from, to, length: 500, speedLimit: 13.4, class: 'secondary', geometry: [[nodes[from].x, nodes[from].y], [nodes[to].x, nodes[to].y]] });
  const links = [mk(0, 0, 1), mk(1, 1, 0), mk(2, 1, 2), mk(3, 2, 1), mk(4, 3, 1), mk(5, 1, 3)];
  const a = assign(buildGraph(nodes, links, [], null), [{ origin: 0, destination: 2 }]);
  const types: FlowType[] = ['through'];

  it('meets the row total on the reachable link, where two halves leave one half unmet', () => {
    const halves: Constraint[] = [{ id: 'on A', kind: 'ramp', label: '', links: [2], target: 61 }, { id: 'on B', kind: 'ramp', label: '', links: [5], target: 61 }];
    const split = fitToCounts(a, [100], types, halves, 6, { ...DEFAULT_FIT, tol: 1e-6 });
    expect(split.unreachable).toContain('on B');
    const sum: Constraint[] = [{ id: 'on A + on B', kind: 'ramp', label: '', links: [2, 5], target: 122 }];
    const r = fitToCounts(a, [100], types, sum, 6, { ...DEFAULT_FIT, tol: 1e-6 });
    expect(r.unreachable).toEqual([]);
    expect(r.converged).toBe(true);
    expect(assigned(a, [100 * r.g[0]], sum, 6)[0]).toBeCloseTo(122, 0);
  });

  it('scores the merged station on the sum of its links, mean over seeds', () => {
    const m = mergeLinkGroups([ramp('ramp on 1', 1, [52, 61]), ramp('ramp on 2', 2, [51, 61])], group, P).stations;
    const file = { area: 'toy', stations: m.map((s) => ({ id: s.id, kind: s.kind, label: s.label, corridor: 'freeway ramps', held: false, year: s.year, derived: s.derived, links: s.links, detectors: s.detectors, target: s.target })) } as never;
    const run = (v1: number, v2: number) => ({ linkStartVehPerHour: { 1: v1, 2: v2 } }) as never;
    const sc = scoreStations([run(103, 0), run(151, 0)], file, 'pm_peak');
    expect(sc.cases).toHaveLength(1);
    expect(sc.cases[0].modeled).toBeCloseTo(127, 6);
    expect(sc.cases[0].counted).toBe(122);
    expect(sc.cases[0].gehOk).toBe(true);
    expect(scoreStations([run(103, 151)], file, 'pm_peak').cases[0].gehOk).toBe(false);
  });
});

describe('the candidate fragment', () => {
  const dir = 'openspec/changes/archive/2026-11-19-calibration-round-47/candidates';
  it('is labeled ASSUMPTION and names two stations the config produces', () => {
    expect(readdirSync(dir)).toEqual(['caldecott-pair-sum.json']);
    const c = JSON.parse(readFileSync(`${dir}/caldecott-pair-sum.json`, 'utf8'));
    expect(c).toHaveLength(1);
    expect(c[0]._note).toMatch(/^ASSUMPTION/);
    const st = JSON.parse(readFileSync('data/demand/rockridge.stations.json', 'utf8')).stations;
    const ms = c[0].stations.map((id: string) => st.find((q: { id: string }) => q.id === id));
    expect(ms.every(Boolean)).toBe(true);
    expect(ms.map((q: { held: boolean }) => q.held)).toEqual([false, false]);
    const split = JSON.parse(readFileSync('data/demand/rockridge.split.json', 'utf8'));
    const g = split.groups.filter((x: { stations: string[] }) => x.stations.includes(c[0].stations[0]));
    expect(g).toHaveLength(1);
    expect(g[0].stations).toEqual(c[0].stations);
    expect(g[0].held).toBe(false);
  });
  it('is off in the committed config', () => {
    expect(JSON.parse(readFileSync('data/demand/rockridge.config.json', 'utf8')).countFit.linkGroups).toBeUndefined();
  });
});
