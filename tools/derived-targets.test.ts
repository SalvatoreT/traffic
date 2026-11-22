import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DERIVED_TARGET_PHRASE, DAILY_TOTAL_SOURCES, SOURCE_CALTRANS_AADT, SOURCE_CALTRANS_RAMP, derivedGroupProblems, isDerivedTarget } from './lib/derived-targets';
import { buildStations, splitStationOf, type Station, type StationInputs } from './lib/demand-fit';
import { drawnHeldStationIds, freezeSplit, heldStationIds, isDerivedGroup, isHeldGroup, withheldDigest, withheldObservations, withheldStationIds, type SplitManifest } from './lib/lineage';
import { derivedTargetLines, scoreStations, type SeedRun, type StationFile } from './lib/assess';
import { ruleSplit, ruleVerdicts, scopeComparisonLines } from './lib/recency';
import { scopeLines } from './lib/validation-scope';
import { membershipEvidenceMismatches, type MembershipEvidence } from './lib/through-membership';

const root = new URL('..', import.meta.url).pathname;
const mk = (id: string, kind: Station['kind'], source: string, keys: string[], pm: number): Station => ({ id, kind, label: id, basis: 'DATA', links: [], target: { pm_peak: pm }, weight: 1, tolPct: 10, records: keys.map((key) => ({ key, share: 1 })), source, year: 2024 });

describe('classification by provenance', () => {
  it('takes the source kinds that apply an assumed factor to a daily total, and nothing else', () => {
    expect([...DAILY_TOTAL_SOURCES].sort()).toEqual([SOURCE_CALTRANS_AADT, SOURCE_CALTRANS_RAMP].sort());
    for (const source of [SOURCE_CALTRANS_AADT, SOURCE_CALTRANS_RAMP]) expect(isDerivedTarget({ source })).toBe(true);
    for (const source of ['oakland-tmc', 'volunteer-count', 'CHRCO-EIR2014', 'SafewayCollege-DEIR2011', '', null, undefined]) expect(isDerivedTarget({ source })).toBe(false);
  });

  it('is set by the build on the stations it makes from an AADT record and from a ramp ADT row', () => {
    const nodes = [{ id: 1, x: 0, y: 0, gate: false }, { id: 2, x: 100, y: 0, gate: false }, { id: 3, x: 200, y: 0, gate: false }];
    const links = [{ id: 1, from: 1, to: 2, name: 'Alder St', class: 'secondary' }, { id: 2, from: 2, to: 1, name: 'Alder St', class: 'secondary' }, { id: 3, from: 3, to: 2, name: 'Ramp', class: 'motorway' }, { id: 4, from: 2, to: 3, name: 'Ramp', class: 'motorway' }];
    const input = {
      nodes, links, periodIds: ['pm_peak'], lastPeriod: 'pm_peak', periodFactors: { pm_peak: { volume: 1, inboundShare: 0.45 } }, kFactor: 0.09, rampKFactor: 0.09, center: [0, 0], inBbox: () => true, streetKey: () => 'alder',
      gates: [], tmcs: [], ramps: [{ kind: 'off', surface: 2, streets: ['Alder St'], adt: 5000, adtKind: 'DATA', source: 'row', rows: ['ramp-row R'], year: 2012 }],
      overrides: [{ street: 'alder', adt: 20000, x: 30, y: 0, source: 'R1', year: 2024 }], cfg: { tmcNodeMaxM: 100, stationRadiusM: 500, weights: {}, tolerancePct: {} },
    } as unknown as StationInputs;
    const sts = buildStations(input, []);
    expect(sts.filter((s) => s.kind === 'caltrans').length).toBeGreaterThan(0);
    for (const s of sts) expect(isDerivedTarget(s), s.id).toBe(s.kind === 'caltrans' || s.kind === 'ramp');
    expect(sts.filter((s) => s.kind === 'ramp').map((s) => s.source)).toEqual([SOURCE_CALTRANS_RAMP]);
    expect(new Set(sts.filter((s) => s.kind === 'caltrans').map((s) => s.source))).toEqual(new Set([SOURCE_CALTRANS_AADT]));
  });
});

describe('the frozen draw does not move; derived targets are fitted', () => {
  const sts = [
    mk('caltrans a in', 'caltrans', SOURCE_CALTRANS_AADT, ['ov A|entering'], 900), mk('caltrans a out', 'caltrans', SOURCE_CALTRANS_AADT, ['ov A|leaving'], 1100),
    mk('caltrans b in', 'caltrans', SOURCE_CALTRANS_AADT, ['ov B|entering'], 800), mk('caltrans b out', 'caltrans', SOURCE_CALTRANS_AADT, ['ov B|leaving'], 900),
    ...['N', 'S', 'E', 'W', 'NE', 'SW'].map((l, i) => mk(`tmc ${l}`, 'tmc', 'oakland-tmc', [`tmc A|${l}|entering`], 400 + i)),
    { ...mk('ramp on 1', 'ramp', SOURCE_CALTRANS_RAMP, ['ramp on 1'], 300), observations: ['ramp-row R PM 1 "X"'] }, { ...mk('ramp on 2', 'ramp', SOURCE_CALTRANS_RAMP, ['ramp on 2'], 200), observations: ['ramp-row R PM 2 "Y"'] },
  ];
  // freezeSplit knows nothing of the rule, so the draw is what it was before the change; the rule is applied on top by the accessors.
  const m = freezeSplit('t', sts.map(splitStationOf));
  const derivedIds = new Set(sts.filter(isDerivedTarget).map((s) => s.id));

  it('leaves the manifest as drawn and holds out no derived target', () => {
    const drawn = drawnHeldStationIds(m), held = heldStationIds(m);
    expect([...held].filter((id) => derivedIds.has(id))).toEqual([]);
    expect([...drawn].filter((id) => !derivedIds.has(id)).sort()).toEqual([...held].sort());
    expect([...drawn].some((id) => derivedIds.has(id))).toBe(true);
  });

  it('removes only held groups that are not derived from the training view', () => {
    const obs = withheldObservations(m);
    for (const g of m.groups) for (const o of g.observations) expect(obs.has(o)).toBe(isHeldGroup(g));
    expect([...obs].some((o) => o.startsWith('ov ') || o.startsWith('ramp-row '))).toBe(false);
    expect([...withheldStationIds(m)].some((id) => derivedIds.has(id))).toBe(false);
  });

  it('changes the digest of the training view when the rule changes it, and not otherwise', () => {
    const noRule: SplitManifest = { ...m, groups: m.groups.map((g) => ({ ...g, observations: g.observations.map((o) => `x ${o}`) })) };
    expect(isDerivedGroup(noRule.groups[0])).toBe(false);
    expect(withheldDigest(noRule)).not.toBe(withheldDigest(m));
    expect(withheldDigest(m)).toBe(withheldDigest({ ...m }));
  });

  it('stops the build when the groups and the source kinds disagree', () => {
    expect(derivedGroupProblems(m, sts)).toEqual([]);
    const mixed = sts.map((s) => (s.id === 'tmc N' ? { ...s, source: SOURCE_CALTRANS_AADT } : s));
    expect(derivedGroupProblems(m, mixed).length).toBeGreaterThan(0);
    // The training view keeps the ADT station of a ramp whose counted leg it withholds; the frozen groups have no entry for it, and it is fitted.
    expect(derivedGroupProblems(m, [...sts, mk('ramp on 999', 'ramp', SOURCE_CALTRANS_RAMP, ['ramp on 999'], 100)])).toEqual([]);
    const wrongSide = sts.map((s) => (s.id === 'caltrans a in' ? { ...s, source: 'oakland-tmc' } : s));
    expect(derivedGroupProblems(m, wrongSide).length).toBeGreaterThan(0);
  });

  it('holds the committed Rockridge split to the same rule: 13 derived stations move, no other', () => {
    const split = JSON.parse(readFileSync(`${root}data/demand/rockridge.split.json`, 'utf8')) as SplitManifest;
    const file = JSON.parse(readFileSync(`${root}data/demand/rockridge.stations.json`, 'utf8')) as { stations: { id: string; source: string | null; held: boolean }[] };
    expect(derivedGroupProblems(split, file.stations)).toEqual([]);
    const drawn = drawnHeldStationIds(split), held = heldStationIds(split);
    expect(new Set(file.stations.filter((s) => s.held).map((s) => s.id))).toEqual(drawn);
    const moved = [...drawn].filter((id) => !held.has(id));
    expect(moved.length).toBe(13);
    expect(moved.every((id) => isDerivedTarget(file.stations.find((s) => s.id === id)!))).toBe(true);
    expect([...held].every((id) => drawn.has(id))).toBe(true);
    expect(drawn.size - held.size).toBe(13);
  });
});

const run = (flows: number[]) => ({ linkFlowVehPerHour: flows }) as SeedRun;
const st = (id: string, source: string, held: boolean, link: number, target: number, extra: Partial<StationFile['stations'][number]> = {}): StationFile['stations'][number] => ({ id, kind: source === 'volunteer-count' ? 'count' : 'caltrans', label: id, corridor: 'c', held, source, year: 2025, links: [link], target: { pm_peak: target }, ...extra });

describe('scoring leaves derived targets out of the judged counts', () => {
  const file: StationFile = { stations: [
    st('block a', 'volunteer-count', false, 0, 100), st('block b', 'volunteer-count', true, 1, 100), st('block c', 'volunteer-count', true, 2, 100),
    st('station d', SOURCE_CALTRANS_AADT, true, 3, 1000), st('station e', SOURCE_CALTRANS_AADT, true, 4, 1000), st('ramp f', SOURCE_CALTRANS_RAMP, false, 5, 300),
    { id: 'gate g', kind: 'gate', label: 'gate g', corridor: 'c', held: true, source: SOURCE_CALTRANS_AADT, year: 2024, links: [], target: { pm_peak: 500 } },
  ] };
  // Counts met by 100, 100, 100, and the derived ones missed by a wide margin except the ramp.
  const sc = scoreStations([run([100, 100, 100, 300, 400, 300])], file, 'pm_peak');

  it('counts blocks in the fitted and held figures and derived targets in neither', () => {
    expect(sc.fitted.n).toBe(1);
    expect(sc.held.n).toBe(2);
    expect(sc.derivedTargets.n).toBe(3);
    expect(sc.derivedTargets.gehOk).toBe(1);
    expect(sc.other.fitted.n + sc.other.held.n).toBe(0);
  });

  it('records the side a derived target is scored on and the side the draw gave it', () => {
    const d = sc.cases.find((c) => c.stationId === 'station d')!;
    expect(d.dailyTotal).toBe(true);
    expect(d.held).toBe(false);
    expect(d.drawnHeld).toBe(true);
    expect(sc.cases.find((c) => c.stationId === 'block b')!.held).toBe(true);
  });

  it('keeps the figures under the old scope', () => {
    expect(sc.legacy.fitted.n).toBe(2);
    expect(sc.legacy.held.n).toBe(4);
  });

  it('lists derived targets in a table of their own with the words not judged', () => {
    const lines = derivedTargetLines(sc, null, file, 'pm_peak').join('\n');
    expect(lines).toContain(DERIVED_TARGET_PHRASE);
    expect(lines).toContain('| station d |');
    expect(lines).toContain('| ramp f |');
    expect(lines).toContain('1 derived-target gate station has no link');
    expect(lines).not.toContain('| block a |');
    expect(derivedTargetLines(scoreStations([run([100])], { stations: [file.stations[0]] }, 'pm_peak'), null, { stations: [file.stations[0]] }, 'pm_peak')).toEqual([]);
  });
});

describe('the station rule under both scopes', () => {
  const cfg = { referenceYear: 2026, recentYears: 5 };
  // The PM figures of the published assessment: 18 hourly held-out counts of which 14 pass, and 6 recent derived targets that all missed.
  const item = (ok: boolean, held: boolean, dailyTotal = false) => ({ year: 2025, c: { gehOk: ok, held: held && !dailyTotal, drawnHeld: held, dailyTotal } });
  const pm = [...Array.from({ length: 18 }, (_, i) => item(i < 14, true)), ...Array.from({ length: 6 }, () => item(false, true, true)), ...Array.from({ length: 80 }, (_, i) => item(i < 70, false))];
  const split = ruleSplit(pm, cfg);

  it('judges hourly counts only in the new scope and prints the old counts beside it', () => {
    expect(split.recent.held).toEqual({ n: 18, ok: 14 });
    expect(split.dailyTotal).toEqual({ n: 6, ok: 0 });
    expect(split.legacy.recent.held).toEqual({ n: 24, ok: 14 });
    expect(split.legacy.recent.fitted).toEqual({ n: 80, ok: 70 });
    const text = scopeComparisonLines([{ period: 'pm_peak', split }]).join('\n');
    expect(text).toContain('14 of 18 (78%), FAIL');
    expect(text).toContain('14 of 24 (58%), FAIL');
    expect(text).toContain('0 of 6 (0%) GEH below 5');
  });

  it('keeps the threshold: more than 85%, and at least ten recent held-out stations', () => {
    expect(ruleVerdicts(split, 0.85, 10).held).toBe('not met');
    const better = ruleSplit([...Array.from({ length: 12 }, () => item(true, true)), ...Array.from({ length: 6 }, () => item(false, true, true))], cfg);
    expect(ruleVerdicts(better, 0.85, 10).held).toBe('met');
    expect(ruleVerdicts({ ...better, recent: { ...better.recent, held: { n: 9, ok: 9 } } }, 0.85, 10).held).toBe('too few');
    const old = better.legacy.recent.held;
    expect(old.ok / old.n).toBeLessThan(0.85);
  });

  it('counts a scaled copy of another period as before, and a derived target that is also scaled as a derived target', () => {
    const s = ruleSplit([{ year: 2025, c: { gehOk: true, held: false, derived: true } }, { year: 2025, c: { gehOk: false, held: false, derived: true, dailyTotal: true } }], cfg);
    expect(s.derived).toEqual({ n: 1, ok: 1 });
    expect(s.dailyTotal).toEqual({ n: 1, ok: 0 });
    expect(s.legacy.recent.fitted.n).toBe(0);
  });

  it('says in the scope text what a derived target is and that the draw did not change', () => {
    const groups = [{ held: true, stations: ['a', 'b'], observations: ['ov X'] }, { held: true, stations: ['c'], observations: ['tmc Y|N'] }, { held: false, stations: ['d'], observations: ['tmc Z|N'] }];
    const text = scopeLines({ cvDemand: true, splitSha: 'abcdef0123456789', minHeld: 10, split: { groups, withheldAggregates: [], retained: [] } }).join('\n');
    expect(text).toContain('The split holds 1 of 3 dependency groups (1 stations)');
    expect(text).toContain('1 groups (2 stations) of daily-total observations');
    expect(text).toContain('not an hourly count');
  });
});

describe('membership evidence follows the held-out rule', () => {
  const base: MembershipEvidence = { view: 'training', network: 'n', split: 's', config: 'c', countFile: 'f', stations: 'st', targets: 't', simulator: 'sim', stationCountVersion: 2 };
  it('rejects a training file made before the rule and accepts one made under it', () => {
    expect(membershipEvidenceMismatches(base, { ...base, withheld: 'w' })).toEqual(['withheld']);
    expect(membershipEvidenceMismatches({ ...base, withheld: 'w' }, { ...base, withheld: 'w' })).toEqual([]);
    expect(membershipEvidenceMismatches({ ...base, withheld: 'w1' }, { ...base, withheld: 'w2' })).toEqual(['withheld']);
  });
  it('leaves the shipped view, which has no withheld set, as it was', () => {
    const shipped = { ...base, view: 'shipped' };
    expect(membershipEvidenceMismatches(shipped, shipped)).toEqual([]);
  });
});
