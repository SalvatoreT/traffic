import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildStations, splitStationOf, stationObservations, applySplit, type Station, type StationInputs } from './lib/demand-fit';
import { checkManifest, dependencyGroups, freezeSplit, heldStationIds, observationOfKey, routeSupportLinks, selectGroupHoldout, withheldObservations, withheldStationIds, DEFAULT_RULE, type SplitStation } from './lib/lineage';
import { countStations, overlapsHeld, type CountConfig, type CountFile } from './lib/volunteer-count';

const mk = (id: string, kind: Station['kind'], label: string, keys: string[], pm: number): Station => ({ id, kind, label, basis: 'DATA', links: [], target: { pm_peak: pm }, weight: 1, tolPct: 10, records: keys.map((key) => ({ key, share: 1 })) });

// The audit pairs (C1): both directions of one AADT record, with an assumed split.
const aadt = (street: string, at: string, pm: number): Station[] => [
  mk(`caltrans ${street} ${at} in`, 'caltrans', `${street} station, link 1 inward`, [`ov ${street} ${at}|entering`], pm * 0.45),
  mk(`caltrans ${street} ${at} out`, 'caltrans', `${street} station, link 2 outward`, [`ov ${street} ${at}|leaving`], pm * 0.55),
];
const fixture = (scale = 1): Station[] => [
  ...aadt('ashby', '544,1277', 23500 * 0.09 * scale), ...aadt('tunnel', '734,1282', 27000 * 0.09 * scale), ...aadt('sanpablo', '-2703,-608', 21700 * 0.09 * scale),
  mk('tmc A N entering', 'tmc', 'A N leg entering', ['tmc A|N|entering'], 1064 * scale), mk('tmc A N leaving', 'tmc', 'A N leg leaving', ['tmc A|N|leaving'], 900 * scale),
  mk('tmc A S entering', 'tmc', 'A S leg entering', ['tmc A|S|entering'], 1093 * scale), mk('tmc A S leaving', 'tmc', 'A S leg leaving', ['tmc A|S|leaving'], 880 * scale),
  mk('tmc A E entering', 'tmc', 'A E leg entering', ['tmc A|E|entering'], 500 * scale), mk('tmc A W leaving', 'tmc', 'A W leg leaving', ['tmc A|W|leaving'], 623 * scale),
  mk('ramp off 1', 'ramp', 'off-ramp at node 1', ['ramp off 1'], 600 * scale), mk('ramp off 2', 'ramp', 'off-ramp at node 2', ['ramp off 2'], 300 * scale),
  mk('ramp on 3', 'ramp', 'on-ramp at node 3', ['ramp on 3'], 400 * scale),
];

describe('observation lineage (C1)', () => {
  it('strips the direction from a record key', () => {
    expect(observationOfKey('tmc A|N|entering')).toBe('tmc A|N');
    expect(observationOfKey('ov SR-13 at X|leaving')).toBe('ov SR-13 at X');
    expect(observationOfKey('ramp off 702')).toBe('ramp off 702');
  });

  it('puts both directions of one AADT record and a TMC leg into one group', () => {
    const g = dependencyGroups(fixture().map((s) => ({ id: s.id, observations: stationObservations(s) })));
    const together = (a: string, b: string) => [...g.values()].some((ids) => ids.includes(a) && ids.includes(b));
    expect(together('caltrans ashby 544,1277 in', 'caltrans ashby 544,1277 out')).toBe(true);
    expect(together('caltrans tunnel 734,1282 in', 'caltrans tunnel 734,1282 out')).toBe(true);
    expect(together('tmc A N entering', 'tmc A N leaving')).toBe(true);
    expect(together('tmc A N entering', 'tmc A S entering')).toBe(false);
  });

  it('shares a group between ramps that carry one published row', () => {
    const a = mk('ramp off 1', 'ramp', 'x', ['ramp off 1'], 1), b = mk('ramp on 3', 'ramp', 'y', ['ramp on 3'], 1);
    a.observations = ['ramp-row R PM 1 "X"']; b.observations = ['ramp-row R PM 1 "X"'];
    const g = dependencyGroups([a, b].map((s) => ({ id: s.id, observations: stationObservations(s) })));
    expect(g.size).toBe(1);
  });

  it('never leaves a held station with a fitted sibling', () => {
    const sts = fixture();
    const m = freezeSplit('t', sts.map(splitStationOf));
    const held = heldStationIds(m);
    for (const g of m.groups) for (const id of g.stations) expect(held.has(id)).toBe(g.held);
    // the four source locations of the audit: in and out are on the same side
    for (const s of ['ashby 544,1277', 'tunnel 734,1282', 'sanpablo -2703,-608']) expect(held.has(`caltrans ${s} in`)).toBe(held.has(`caltrans ${s} out`));
    expect(held.size).toBeGreaterThan(0);
  });

  it('every corridor has a held group', () => {
    const sts = fixture();
    const m = freezeSplit('t', sts.map(splitStationOf));
    for (const c of new Set(m.groups.map((g) => g.corridor))) expect(m.groups.some((g) => g.corridor === c && g.held)).toBe(true);
  });
});

describe('frozen split ignores values (D1)', () => {
  it('gives the same split whatever the counts are', () => {
    const a = freezeSplit('t', fixture(1).map(splitStationOf)), b = freezeSplit('t', fixture(3.7).map(splitStationOf));
    expect(b).toEqual(a);
  });

  it('is independent of station order', () => {
    const a = freezeSplit('t', fixture().map(splitStationOf)), b = freezeSplit('t', [...fixture()].reverse().map(splitStationOf));
    expect(b).toEqual(a);
  });

  it('detects a manifest that no longer matches the stations', () => {
    const sts = fixture().map(splitStationOf);
    const m = freezeSplit('t', sts);
    expect(checkManifest(m, sts)).toEqual([]);
    expect(checkManifest(m, sts.slice(0, -1)).length).toBeGreaterThan(0);
    expect(checkManifest({ ...m, groups: m.groups.map((g, i) => (i === 0 ? { ...g, held: !g.held } : g)) }, sts).length).toBeGreaterThan(0);
  });

  it('applies the manifest to the stations', () => {
    const sts = fixture();
    const m = freezeSplit('t', sts.map(splitStationOf));
    const held = applySplit(sts, m);
    expect(sts.filter((s) => s.held).map((s) => s.id).sort()).toEqual([...held].sort());
  });

  it('removes every observation of a held group from training', () => {
    const m = freezeSplit('t', fixture().map(splitStationOf));
    const obs = withheldObservations(m);
    for (const g of m.groups) for (const o of g.observations) expect(obs.has(o)).toBe(g.held);
    expect(withheldStationIds(m).size).toBeGreaterThanOrEqual(heldStationIds(m).size);
  });

  it('selects by group id and corridor only', () => {
    const groups = Array.from({ length: 9 }, (_, i) => ({ id: `g${i}`, corridor: i < 8 ? 'A' : 'B' }));
    const held = selectGroupHoldout(groups, DEFAULT_RULE);
    expect(held.has('g8')).toBe(true);
    expect([...held].filter((x) => x !== 'g8').length).toBe(2);
    expect([...selectGroupHoldout([...groups].reverse(), DEFAULT_RULE)].sort()).toEqual([...held].sort());
  });
});

describe('training view inputs do not move when held values change (1.4)', () => {
  // Gate totals, TMC legs and Caltrans stations all enter buildStations; withheld observations are removed from its inputs.
  const inputs = (scale: number, withheld: Set<string>): StationInputs => {
    const nodes = [{ id: 1, x: 0, y: 0, gate: false }, { id: 2, x: 100, y: 0, gate: false }];
    const links = [{ id: 1, from: 1, to: 2, name: 'Alder St', class: 'secondary' }, { id: 2, from: 2, to: 1, name: 'Alder St', class: 'secondary' }];
    const ov = (source: string, adt: number, x: number) => ({ street: 'alder', adt: adt * scale, x, y: 0, source, year: 2024 });
    const overrides = [ov('R1', 20000, 30), ov('R2', 30000, 70)].filter((o) => !withheld.has(`ov ${o.source}`));
    return {
      nodes, links, periodIds: ['pm_peak'], lastPeriod: 'pm_peak', periodFactors: { pm_peak: { volume: 1, inboundShare: 0.45 } }, kFactor: 0.09, rampKFactor: 0.09, center: [0, 0], inBbox: () => true, streetKey: () => 'alder',
      gates: [], tmcs: [], ramps: [], overrides, cfg: { tmcNodeMaxM: 100, stationRadiusM: 500, weights: {}, tolerancePct: {} },
    } as unknown as StationInputs;
  };
  it('builds identical training stations whatever the withheld values are, and different scoring targets', () => {
    const m = freezeSplit('t', buildStations(inputs(1, new Set()), []).map(splitStationOf));
    const w = withheldObservations(m);
    expect(w.size).toBeGreaterThan(0);
    const a = buildStations(inputs(1, w), []), b = buildStations(inputs(1.6, w), []);
    const held = buildStations(inputs(1, new Set()), []).filter((s) => heldStationIds(m).has(s.id)), heldPerturbed = buildStations(inputs(1.6, new Set()), []).filter((s) => heldStationIds(m).has(s.id));
    // the perturbation here scales every raw value, so only the training stations that remain must stay equal in structure; held ones are gone
    expect(a.map((s) => s.id)).toEqual(b.map((s) => s.id));
    expect(a.some((s) => heldStationIds(m).has(s.id))).toBe(false);
    expect(held.map((s) => s.id)).toEqual(heldPerturbed.map((s) => s.id));
    expect(heldPerturbed[0].target.pm_peak).not.toBeCloseTo(held[0].target.pm_peak);
  });
});

describe('whole-street dependency (C3)', () => {
  // A street with a bypass loop of the same name: 1 -> 2 -> 3 -> 4 on the street, and 2 -> 5 -> 3 on a loop named the same.
  const net = { links: [
    { id: 10, from: 1, to: 2, name: 'Pine' }, { id: 11, from: 2, to: 3, name: 'Pine' }, { id: 12, from: 3, to: 4, name: 'Pine' },
    { id: 13, from: 2, to: 5, name: 'Pine' }, { id: 14, from: 5, to: 3, name: 'Pine' }, { id: 15, from: 4, to: 9, name: 'Pine' },
    { id: 20, from: 2, to: 6, name: 'Elm' }, { id: 21, from: 6, to: 3, name: 'Elm' },
  ] };
  it('covers every block between the ends, detours of the same street included', () => {
    expect(routeSupportLinks(net, 10, 12)).toEqual([10, 11, 12, 13, 14]);
  });
  it('does not include a cross street or links beyond the ends', () => {
    const s = routeSupportLinks(net, 10, 12);
    expect(s).not.toContain(20);
    expect(s).not.toContain(15);
  });
  it('marks a route whose interior block is held, and withholds it from training', () => {
    const sts: SplitStation[] = [
      { id: 'b11', corridor: 'Pine (count)', observations: ['count block 11'], preset: true, blockLink: 11 },
      { id: 'b13', corridor: 'Pine (count)', observations: ['count block 13'], preset: false, blockLink: 13 },
      { id: 'route 10>12', corridor: 'routes', observations: ['route'], aggregate: { supportLinks: routeSupportLinks(net, 10, 12), reason: 'whole street' } },
      { id: 'route 12>12', corridor: 'routes', observations: ['route2'], aggregate: { supportLinks: [12], reason: 'whole street' } },
    ];
    const m = freezeSplit('t', sts);
    expect(m.withheldAggregates).toEqual([{ station: 'route 10>12', reason: 'whole street', blocks: [11] }]);
    expect(withheldStationIds(m).has('route 10>12')).toBe(true);
    expect(withheldStationIds(m).has('route 12>12')).toBe(false);
    expect(withheldStationIds(m).has('b13')).toBe(false);
  });
});

describe('Rockridge whole-street routes (C3, real network)', () => {
  const root = new URL('..', import.meta.url).pathname;
  const net = JSON.parse(readFileSync(`${root}public/data/rockridge.network.json`, 'utf8'));
  const cfg = JSON.parse(readFileSync(`${root}data/demand/rockridge.config.json`, 'utf8'));
  const vc = cfg.volunteerCount as CountConfig & { file: string; periods: { am: string; pm: string; midday?: string } };
  const file = JSON.parse(readFileSync(`${root}${vc.file}`, 'utf8')) as CountFile;
  const res = countStations(file, net, vc, vc.periods, Object.fromEntries(cfg.periods.map((p: { id: string }) => [p.id, cfg.periodFactors[p.id].volume])));
  const held = new Set(res.stations.filter((s) => s.family === 'block' && s.held).map((s) => s.links[0]));
  const routes = res.stations.filter((s) => s.family === 'route');
  it('finds the held blocks on the four whole-street routes that the endpoint rule missed', () => {
    const want: Record<string, number[]> = { 'count route 2591>2605': [2593, 2601], 'count route 2606>2592': [2602, 2594], 'count route 2676>2670': [2674], 'count route 2669>2675': [2673] };
    for (const [id, blocks] of Object.entries(want)) {
      const s = routes.find((r) => r.id === id)!;
      expect(s, id).toBeTruthy();
      expect(overlapsHeld(s, held), id).toBe(true);
      expect(s.support!.filter((l) => held.has(l))).toEqual(expect.arrayContaining(blocks));
      expect((s.touches ?? []).some((l) => held.has(l)), `${id} endpoints`).toBe(false);
    }
  });
  it('drops withheld blocks and overlapping aggregates from the training station set only', () => {
    const m = freezeSplit('rockridge', res.stations.map((s) => ({ id: s.id, corridor: s.corridor, observations: [s.id], ...(s.family === 'block' ? { preset: s.held, blockLink: s.links[0] } : { aggregate: { supportLinks: s.support ?? [], reason: s.family } }) })));
    const out = withheldStationIds(m);
    const train = countStations(file, net, vc, vc.periods, Object.fromEntries(cfg.periods.map((p: { id: string }) => [p.id, cfg.periodFactors[p.id].volume])), out);
    expect(train.stations.some((s) => out.has(s.id))).toBe(false);
    expect(train.stations.length).toBe(res.stations.length - out.size);
    for (const s of res.stations.filter((x) => !out.has(x.id))) expect(train.stations.find((t) => t.id === s.id)!.target).toEqual(s.target);
  });
});
