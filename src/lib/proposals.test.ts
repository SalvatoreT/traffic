import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildFixture } from '../fixtures/area';
import { buildMockProposals } from '../fixtures/proposals';
import { decodeScenario } from './hash';
import {
  allProposals, allTrafficHeadline, allTrafficNote, allTrafficRows, beforeAfterPct, comparisonText, cutThroughHeadline, evidenceNote, evidenceStatus, hashMatches, hashText, harmHeadline, intervalText,
  legacyProposalAnchor, linkHash, listOptions, largestAllCarRise, needsConfirm, openReducer, parseProposals, periodsPhrase, proposalAnchor, proposalNotices, REPORT_METHOD, seedsPhrase, signedPct, staleInputs, throughRemoved,
  type ComparisonStatus, type Effect, type Proposal, type ThroughHarm,
} from './proposals';

const net = buildFixture().network;
const file = buildMockProposals(net, { networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), calibration: 'uncalibrated' });
const [unc] = file.groups;
/** An older file's second list, which shares two packages with the first. */
const charter = { ...unc, id: 'charter', title: "Within the 2025 neighborhood pilot's limits", note: 'Nothing on the bounding streets.', proposals: unc.proposals.filter((p) => ['one-filter', 'filters-limit'].includes(p.id)).map((p) => ({ ...p, variants: undefined })) };
const legacyRaw = buildMockProposals(net, { networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), calibration: 'uncalibrated' }, 'legacy');
const legacyFile = parseProposals(JSON.stringify(legacyRaw))!;
const eff = (mean: number, lo: number, hi: number, n = 10): Effect => ({ n, mean, sd: 1, interval: [lo, hi], status: n < 10 ? 'insufficient' : lo > 0 ? 'increase' : hi < 0 ? 'decrease' : 'unresolved' });
const through = (over: Partial<ThroughHarm> = {}): ThroughHarm => ({
  largestIncrease: { block: 'Colby Street between 63rd Street and North Street', baselineVehPerHour: 10, scenarioVehPerHour: 22.4, increaseVehPerHour: 12.4, effect: eff(12.4, 7, 18) },
  adjustedPenalty: { block: 'Hillegass Avenue between 62nd Street and 63rd Street', penaltyVehPerHour: 5 }, blocksAboveBand: 3, blocksResolvedIncrease: 3, ...over,
});

describe('staleness', () => {
  it('matches full and truncated digests, case-insensitively', async () => {
    const h = await hashText('abc');
    expect(h).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(hashMatches(h.slice(0, 16).toUpperCase(), h)).toBe(true);
    expect(hashMatches('deadbeefdeadbeef', h)).toBe(false);
    expect(hashMatches('', h)).toBe(false);
  });
  it('names what differs, and ignores unknown hashes', () => {
    const c = { networkHash: 'aaaaaaaaaa', demandHash: 'bbbbbbbbbb' };
    expect(staleInputs(c, { network: 'aaaaaaaaaaff', demand: 'bbbbbbbbbbff' })).toEqual([]);
    expect(staleInputs(c, { network: 'cc', demand: 'bbbbbbbbbbff' })).toEqual(['network']);
    expect(staleInputs(c, { network: 'cc', demand: 'dd' })).toEqual(['network', 'demand']);
    expect(staleInputs(c, { network: null, demand: null })).toEqual([]);
  });
});

describe('notices', () => {
  const hashes = { network: 'a'.repeat(64), demand: 'b'.repeat(64) };
  it('exploratory unless calibrated', () => {
    expect(proposalNotices({ ...unc.computed, calibration: 'uncalibrated' }, hashes).exploratory).toBe(true);
    expect(proposalNotices({ ...unc.computed, calibration: 'calibrated' }, hashes)).toMatchObject({ exploratory: false, stale: false });
  });
  it('stale says which input changed', () => {
    const n = proposalNotices(unc.computed, { network: 'c'.repeat(64), demand: hashes.demand, simulator: unc.computed.simulator });
    expect(n.stale).toBe(true);
    expect(n.staleText).toMatch(/street network has changed/);
  });
});

/** The audit's R1: network and demand match, but the engine does not. The old reader called this current. */
describe('evidence status', () => {
  const same = { network: 'a'.repeat(64), demand: 'b'.repeat(64) };
  const c = unc.computed;
  it('is stale when only the simulator differs', () => {
    const e = evidenceStatus(c, { ...same, simulator: 'new-engine' });
    expect(e).toMatchObject({ state: 'stale', stale: ['simulator'] });
    const n = proposalNotices(c, { ...same, simulator: 'new-engine' });
    expect(n.stale).toBe(true);
    expect(n.staleText).toBe('The simulator code has changed since these options were computed, so the numbers are out of date.');
  });
  it('is stale when only the reporting method differs', () => {
    expect(evidenceStatus({ ...c, reportMethod: 'paired-t-0' }, { ...same, simulator: c.simulator })).toMatchObject({ state: 'stale', stale: ['method'] });
  });
  it('is current only when every input and the method match', () => {
    expect(evidenceStatus(c, { ...same, simulator: c.simulator })).toMatchObject({ state: 'current', stale: [], missing: [], unchecked: [] });
    expect(c.reportMethod).toBe(REPORT_METHOD);
  });
  it('says which things changed, in words', () => {
    expect(proposalNotices(c, { network: 'c'.repeat(64), demand: 'd'.repeat(64), simulator: 'x' }).staleText).toMatch(/street network, demand and simulator code have changed/);
  });
  it('marks a group with no recorded provenance unverified and never assigns it the current engine', () => {
    const { simulator: _s, reportMethod: _r, settings: _t, ...old } = c;
    const e = evidenceStatus(old, { ...same, simulator: 'the-engine-in-use' });
    expect(e).toMatchObject({ state: 'unverified', stale: [], missing: ['simulator', 'method', 'settings'] });
    const n = proposalNotices(old, { ...same, simulator: 'the-engine-in-use' });
    expect(n).toMatchObject({ stale: false, unverified: true });
    expect(n.unverifiedText).toMatch(/computed before the simulator version, reporting method and run settings were recorded/);
  });
  it('a known difference in network wins over missing provenance', () => {
    const { simulator: _s, ...old } = c;
    expect(evidenceStatus(old, { network: 'c'.repeat(64), demand: same.demand }).state).toBe('stale');
  });
  it('marks recorded provenance unverified when the reader cannot read the simulator in use', () => {
    expect(evidenceStatus(c, same)).toMatchObject({ state: 'unverified', unchecked: ['simulator'] });
    expect(evidenceStatus(c, { ...same, simulator: null }).state).toBe('unverified');
  });
});

describe('headline figures', () => {
  const when = 'the average of the AM peak, PM peak and Midday';
  it('formats the cut-through change and defines it', () => {
    const h = cutThroughHeadline({ baselineVehPerHour: 118.4, scenarioVehPerHour: 73.1, changePct: -38.27 }, when);
    expect(h).toMatchObject({ figure: '118 → 73', label: 'through cars an hour', change: '−45 cars an hour (−38%)' });
    expect(h.scope).toMatch(/^Cars crossing the area's side streets without a trip that starts or ends there/);
    expect(h.scope).toContain(when[0].toUpperCase() + when.slice(1));
    expect(cutThroughHeadline({ baselineVehPerHour: 70, scenarioVehPerHour: 70, changePct: 0 }, when, [1], 'Rockridge Trapezoid')).toMatchObject({ figure: '70 → 70', change: 'No change (0%)' });
    expect(cutThroughHeadline({ baselineVehPerHour: 70, scenarioVehPerHour: 60, changePct: -14 }, when, [1], 'Rockridge Trapezoid').scope).toContain("Rockridge Trapezoid's side streets");
  });
  it('words a decrease with its interval and the runs behind it', () => {
    const h = cutThroughHeadline({ baselineVehPerHour: 118.4, scenarioVehPerHour: 73.1, changePct: -38.27, changePctEffect: eff(-38.3, -45.1, -31.4) }, when, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(h.interval).toBe('95% interval −45.1% to −31.4% over 10 runs: the fall is resolved from run-to-run variation.');
    expect(h.scope).toContain('mean of 10 runs (seeds 1 to 10) per period');
  });
  it('says so when no interval was recorded or the runs are too few', () => {
    expect(cutThroughHeadline({ baselineVehPerHour: 100, scenarioVehPerHour: 90, changePct: -10 }, when).interval).toBe('No uncertainty interval was recorded for this figure.');
    const few = cutThroughHeadline({ baselineVehPerHour: 100, scenarioVehPerHour: 90, changePct: -10, changePctEffect: eff(-10, -14, -6, 3) }, when, [1, 2, 3]);
    expect(few.interval).toMatch(/^3 runs are too few for an interval \(at least 10 are needed\)/);
    expect(few.interval).not.toMatch(/95%/);
  });
  it('words an unresolved effect without calling it zero or resolved', () => {
    expect(intervalText(eff(-3, -9, 4), '%', 1)).toBe('95% interval −9% to +4% over 10 runs: the interval includes zero, so the sign of the change is not resolved.');
  });
  it('lists seeds as a range when consecutive and one run as one run', () => {
    expect(seedsPhrase([1, 2, 3])).toBe('mean of 3 runs (seeds 1 to 3)');
    expect(seedsPhrase([1, 3, 7])).toBe('mean of 3 runs (seeds 1, 3, 7)');
    expect(seedsPhrase([5])).toBe('one run (seed 5)');
  });
  it('names the block with the largest increase, with its interval and the status', () => {
    const h = harmHeadline({ through: through() }, when);
    expect(h).toMatchObject({ none: false, status: 'resolved', figure: '+12 through cars an hour', label: 'on one block: Colby Street between 63rd Street and North Street, the block with the largest increase' });
    expect(h.definition).toContain('Through cars only, both directions of that one block');
    expect(h.definition).toContain(when);
    expect(h.definition).toContain('95% interval +7 through cars an hour to +18 through cars an hour over 10 runs');
    expect(h.definition).toContain('3 blocks have a rise resolved from run-to-run variation');
    expect(h.definition).toContain('not adjusted for that choice');
  });
  it('shows an unresolved increase with its value and says it is unresolved, never "no gain"', () => {
    const t = through({ largestIncrease: { block: 'X', baselineVehPerHour: 10, scenarioVehPerHour: 21, increaseVehPerHour: 11, effect: eff(11, -2, 24) }, blocksResolvedIncrease: 0 });
    const h = harmHeadline({ through: t }, when);
    expect(h).toMatchObject({ none: false, status: 'unresolved', figure: '+11 through cars an hour' });
    expect(h.definition).toContain('the interval includes zero, so the sign of the change is not resolved');
    expect(`${h.label} ${h.definition}`).not.toMatch(/No block/);
  });
  it('shows an increase from too few runs with no interval claim', () => {
    const t = through({ largestIncrease: { block: 'X', baselineVehPerHour: 10, scenarioVehPerHour: 21, increaseVehPerHour: 11, effect: eff(11, 3, 19, 4) } });
    const h = harmHeadline({ through: t }, when);
    expect(h.status).toBe('insufficient');
    expect(h.definition).toMatch(/4 runs are too few for an interval/);
  });
  it('says only that averages fall when the largest change is not an increase', () => {
    const t = through({ largestIncrease: { block: 'X', baselineVehPerHour: 10, scenarioVehPerHour: 7, increaseVehPerHour: -3, effect: eff(-3, -6, 0) }, blocksAboveBand: 0, blocksResolvedIncrease: 0 });
    const h = harmHeadline({ through: t }, when);
    expect(h).toMatchObject({ none: true, figure: '', status: 'none' });
    expect(h.label).toBe('No block gains through cars on average; the largest change is −3 on X');
    expect(h.definition).toContain('compares averages only');
  });
  it('keeps the largest raw increase and the penalty block as different things (the audit\'s R2)', () => {
    // Block A gains 100 with a band of 80; block B gains 50 with a band of 10. The old file named B and called its 50 the largest.
    const t = through({
      largestIncrease: { block: 'A', baselineVehPerHour: 200, scenarioVehPerHour: 300, increaseVehPerHour: 100, effect: eff(100, 60, 140) },
      adjustedPenalty: { block: 'B', penaltyVehPerHour: 40 },
    });
    const h = harmHeadline({ through: t }, when);
    expect(h.figure).toBe('+100 through cars an hour');
    expect(h.label).toContain('A, the block with the largest increase');
    expect(`${h.label} ${h.definition}`).not.toContain('B');
  });
  it('words a version 4 figure as the search\'s flagged block, with no interval, and no number when none is flagged', () => {
    const legacy = legacyFile.groups[0].proposals.find((p) => p.id === 'filters-limit')!;
    const h = harmHeadline(legacy.harm, when);
    expect(h).toMatchObject({ none: false, status: 'unrecorded' });
    expect(h.label).toContain("flagged by the search's noise rule");
    expect(h.label).not.toContain('the block with the largest increase');
    expect(h.definition).toContain('another block may have gained more through cars');
    expect(h.definition).toContain('No interval was recorded');
    const none = legacyFile.groups[0].proposals.find((p) => p.id === 'one-filter')!;
    expect(harmHeadline(none.harm, when)).toMatchObject({ none: true, figure: '', status: 'unrecorded' });
    expect(harmHeadline(none.harm, when).label).toBe("No block passes the search's noise band for through cars");
  });
  it('never shows a figure without naming what it counts', () => {
    for (const p of allProposals(file)) {
      const c = cutThroughHeadline(p.cutThrough, when), h = harmHeadline(p.harm, when);
      expect(c.label).toContain('through cars an hour'); expect(c.figure).toMatch(/^\d+ → \d+$/);
      if (!h.none) { expect(h.figure).toContain('through cars'); expect(`${h.figure} ${h.label}`).not.toMatch(/veh\/h/); }
    }
  });
  it('names the periods averaged', () => {
    const label = (id: string) => ({ am: 'AM peak', pm: 'PM peak', mid: 'Midday' }[id] ?? id);
    expect(periodsPhrase(['pm'], label)).toBe('the PM peak');
    expect(periodsPhrase(['pm', 'am', 'mid'], label)).toBe('the average of the PM peak, AM peak and Midday');
  });
  it('signs percentages', () => {
    expect([signedPct(-2.34), signedPct(4), signedPct(0.01), signedPct(-12.6)]).toEqual(['−2.3%', '+4%', '0%', '−13%']);
  });
});

describe('details tables', () => {
  const label = (id: string) => id.toUpperCase();
  const p = unc.proposals.find((x) => x.id === 'filters-limit')!;
  it('puts cars an hour before the percentage', () => {
    expect(beforeAfterPct({ baselineVehPerHour: 128.2, scenarioVehPerHour: 100.6, changePct: -21.5 })).toBe('128 → 101 (−22%)');
  });
  it('labels every all-traffic row with its period and splits the gain into through and local', () => {
    const rows = allTrafficRows(p, label);
    expect(rows.map((r) => r.period)).toEqual(['AM-PEAK', 'PM-PEAK']);
    for (const r of rows) {
      expect(r.local).toBeCloseTo(r.change - r.through, 9);
      expect(r.block).toBe('Colby Street between 63rd Street and North Street');
    }
  });
  it('says "mostly local trips" only when local trips are most of the gain', () => {
    const row = (change: number, through: number) => ({ period: 'PM', block: 'B', before: 100, after: 100 + change, change, through, local: change - through, blocksAbove: 1, interval: '', penaltyBlock: null, penalty: null, flagged: false });
    expect(allTrafficNote([row(37, 12)])).toMatch(/^Mostly local trips: about 68% .* about 32% are through cars/);
    expect(allTrafficNote([row(40, 30)])).toMatch(/^About 75% of the extra cars on these blocks are through cars and about 25% are local trips/);
    expect(allTrafficNote([row(40, 30)])).not.toMatch(/Mostly/);
    expect(allTrafficNote([row(37, 12)])).toMatch(/number of trips fixed/);
  });
  it('puts the largest all-car rise on the card with its split and says attribution is missing, not zero', () => {
    const row = (period: string, change: number, through: number, flagged = false) => ({ period, block: `B ${period}`, before: 100, after: 100 + change, change, through, local: change - through, blocksAbove: 1, interval: 'iv', penaltyBlock: null, penalty: null, flagged });
    const h = allTrafficHeadline([row('AM', 12, 2), row('PM', 43, -7)]);
    expect(h).toMatchObject({ none: false, figure: '+43', split: 'Through cars −7, local trips +50.' });
    expect(h.label).toMatch(/B PM \(PM\), 100 → 143/);
    expect(h.attribution).toMatch(/no diversion has been ruled out/);
    expect(allTrafficHeadline([row('PM', 5, 1, true)])).toMatchObject({ none: true });
    expect(allTrafficHeadline([]).label).toMatch(/not recorded/);
  });
  it('makes no claim when no block gains beyond noise', () => {
    expect(allTrafficNote([{ period: 'PM', block: null, before: 1, after: 2, change: 1, through: 0, local: 1, blocksAbove: 0, interval: '', penaltyBlock: null, penalty: null, flagged: true }])).toBe('');
    expect(allTrafficNote([])).toBe('');
    const legacy = legacyFile.groups[0].proposals.find((x) => x.id === 'one-filter')!;
    const rows = allTrafficRows({ ...legacy, byPeriod: { pm: { ...legacy.byPeriod['pm-peak'], allTraffic: { ...legacy.byPeriod['pm-peak'].allTraffic, blocksAboveBand: 0 } } } }, label);
    expect(rows[0]).toMatchObject({ block: null, blocksAbove: 0, flagged: true });
  });
  it('shows the largest all-traffic increase and the penalty block as two columns of one row', () => {
    const q: Proposal = { ...p, byPeriod: { pm: { cutThrough: p.byPeriod['pm-peak'].cutThrough, allTraffic: {
      largestIncrease: { block: 'A', baselineVehPerHour: 300, scenarioVehPerHour: 400, increaseVehPerHour: 100, throughIncreaseVehPerHour: 40, effect: eff(100, 70, 130) },
      adjustedPenalty: { block: 'B', penaltyVehPerHour: 40 }, blocksAboveBand: 2,
    } } } };
    const [r] = allTrafficRows(q, label);
    expect(r).toMatchObject({ block: 'A', before: 300, after: 400, change: 100, through: 40, local: 60, penaltyBlock: 'B', penalty: 40, flagged: false });
    expect(r.interval).toContain('95% interval +70 cars an hour to +130 cars an hour over 10 runs');
  });
  it('says what the runs were for, and compares options on the same seeds', () => {
    expect(evidenceNote(p, unc)).toMatch(/^Exploratory estimate: the same runs that chose this option/);
    expect(evidenceNote({ ...p, evidence: { ...p.evidence!, role: 'confirmation', seeds: [101, 102, 103] } }, unc)).toMatch(/^Confirmation: a shortlist frozen before these runs, rerun on seeds 101 to 103/);
    const { evidence: _e, ...bare } = p;
    expect(evidenceNote(bare, { computed: { ...unc.computed, estimation: undefined } })).toMatch(/not recorded whether/);
    const label = (id: string) => id;
    const cmp = (e: { status: ComparisonStatus; mean?: number; interval?: [number, number]; n?: number }) => ({ option: 'b', against: 'a', extraCutVehPerHour: { n: 10, mean: 0, sd: 0, ...e }, extraCutPoints: { n: 10, mean: 0, sd: 0, ...e } });
    expect(comparisonText(cmp({ status: 'better', mean: 6.2, interval: [3.1, 9.3] }), label)).toBe('b against a: cuts 6.2 more points of through cars (95% interval +3.1 to +9.3 points over 10 runs).');
    expect(comparisonText(cmp({ status: 'unresolved', mean: 2, interval: [-3, 7] }), label)).toContain('not resolved (+2 points; 95% interval −3 to +7 points over 10 runs)');
    expect(comparisonText(cmp({ status: 'insufficient', n: 4 }), label)).toBe('b against a: not enough runs to compare (at least 10 paired runs are needed).');
  });
});

describe('sections', () => {
  it('lists search options by through cars removed, largest first, reference entries apart', () => {
    const { search, reference } = listOptions(file);
    expect(search.map((x) => x.proposal.id)).toEqual(['widest', 'filters-diverter', 'filters-limit', 'two-filters-hump', 'one-filter']);
    expect(reference.map((x) => x.proposal.id)).toEqual(['earlier-62nd-diverters']);
    expect(reference[0].proposal.interventions).toHaveLength(2);
  });
  it('orders a file written in any order the same way: ties go to fewer changes, then the smaller largest all-car rise', () => {
    const base = unc.proposals.find((p) => p.id === 'filters-limit')!;
    const mk = (id: string, removed: number, changes: number, rise: number): Proposal => ({
      ...base, id, link: `#v1;a=x;s=${id}`, interventions: base.interventions.slice(0, 1).concat(Array(changes - 1).fill(base.interventions[0])),
      cutThrough: { ...base.cutThrough, baselineVehPerHour: 100, scenarioVehPerHour: 100 - removed },
      byPeriod: { pm: { ...base.byPeriod['pm-peak'], allTraffic: { ...base.byPeriod['pm-peak'].allTraffic, largestIncrease: { block: 'B', baselineVehPerHour: 100, scenarioVehPerHour: 100 + rise, increaseVehPerHour: rise } } } },
    });
    const list = [mk('a', 20, 3, 5), mk('b', 30, 4, 9), mk('c', 20, 2, 9), mk('d', 20, 2, 4), mk('e', 20.04, 3, 5)];
    const order = (l: Proposal[]) => listOptions({ groups: [{ ...unc, proposals: l }] }).search.map((x) => x.proposal.id);
    expect(order(list)).toEqual(['b', 'd', 'c', 'a', 'e']);
    expect(order([...list].reverse())).toEqual(['b', 'd', 'c', 'e', 'a']);
    expect(throughRemoved(list[4])).toBe(20);
    expect(largestAllCarRise(list[0])).toBe(5);
  });
  it('shows an older file\'s several lists as one, each package once, sorted', () => {
    const old = { ...file, groups: [charter, unc] };
    const { search } = listOptions(old);
    expect(search.map((x) => x.proposal.id)).toEqual(['widest', 'filters-diverter', 'filters-limit', 'two-filters-hump', 'one-filter']);
    expect(search.find((x) => x.proposal.id === 'one-filter')!.group.id).toBe('charter');
    expect(search).toHaveLength(5);
  });
  it('reads variants and drops the ones it cannot read', () => {
    const raw = JSON.parse(JSON.stringify(file));
    const p = raw.groups[0].proposals.find((x: Proposal) => x.id === 'one-filter');
    expect(p.variants).toHaveLength(2);
    p.variants.push({ link: 5, differs: ['x'] }, { link: '#v1', differs: [] });
    const got = parseProposals(JSON.stringify(raw))!.groups[0].proposals.find((x) => x.id === 'one-filter')!;
    expect(got.variants).toHaveLength(2);
    expect(got.variants![0]).toMatchObject({ differs: ['Use the filter on the next block instead'], cutThrough: { changePct: -11 } });
    for (const x of listOptions(file).search) expect(x.proposal.variants === undefined || x.proposal.variants.length > 0).toBe(true);
  });
  it('reads a version 4 file whole: figures shown, marked as lacking the new evidence, and the worst block relabeled', () => {
    const f = legacyFile;
    expect(f.version).toBe(4);
    expect(f.groups.every((g) => !g.legacy)).toBe(true);
    const g = f.groups[0];
    expect(g.computed.simulator).toBeUndefined();
    expect(evidenceStatus(g.computed, { network: 'a'.repeat(64), demand: 'b'.repeat(64), simulator: 'x' }).state).toBe('unverified');
    const p = g.proposals.find((x) => x.id === 'filters-limit')!;
    expect(p.harm.through.largestIncrease).toBeUndefined();
    expect(p.harm.through.adjustedPenalty.block).toBe('Colby Street between 63rd Street and North Street');
    const row = allTrafficRows(p, (id) => id)[0];
    expect(row).toMatchObject({ flagged: true, penaltyBlock: 'Colby Street between 63rd Street and North Street', penalty: null });
    expect(p.summary).not.toMatch(/gains the most/);
  });
  it('rewrites the old summary sentence that called the flagged block the one that gains the most', () => {
    const old = JSON.parse(JSON.stringify(legacyRaw));
    old.groups[0].proposals[0].summary = 'It makes one change: X. In the simulation it cuts through traffic. The side-street block that gains the most through traffic is Colby, about 5 more through cars an hour on average.';
    old.groups[0].proposals[1].summary = 'No side-street block gains through traffic beyond normal run-to-run variation.';
    const f = parseProposals(JSON.stringify(old))!;
    expect(f.groups[0].proposals[0].summary).toContain('flagged for through traffic with its noise band, which need not have the largest increase, is Colby');
    expect(f.groups[0].proposals[1].summary).toBe("No side-street block passes the search's assumed noise band for through traffic.");
  });
  it('reads a version 5 file with its intervals and provenance', () => {
    const f = parseProposals(JSON.stringify(file))!;
    expect(f.version).toBe(5);
    const p = f.groups[0].proposals.find((x) => x.id === 'filters-limit')!;
    expect(p.harm.through.largestIncrease?.effect?.status).toBeDefined();
    expect(p.cutThrough.effect?.n).toBe(10);
    expect(f.groups[0].computed.reportMethod).toBe(REPORT_METHOD);
  });
  it('rejects files that are not proposals', () => {
    expect(parseProposals('<html>')).toBeNull();
    expect(parseProposals('{"version":5}')).toBeNull();
  });
});

describe('groups', () => {
  it('a current file holds one list', () => {
    const f = parseProposals(JSON.stringify(file))!;
    expect(f.groups.map((g) => g.id)).toEqual(['unconstrained']);
    expect(allProposals(f)).toHaveLength(6);
  });
  it('keeps the groups of an older file in file order', () => {
    const f = parseProposals(JSON.stringify({ ...file, groups: [charter, unc] }))!;
    expect(f.groups.map((g) => g.id)).toEqual(['charter', 'unconstrained']);
    expect(allProposals(f)).toHaveLength(8);
  });
  it('reads a version 1 file as the unconstrained group', () => {
    const v1 = { version: 1, area: 'x', computed: unc.computed, baseline: unc.baseline, proposals: unc.proposals };
    const f = parseProposals(JSON.stringify(v1))!;
    expect(f.groups).toHaveLength(1);
    expect(f.groups[0]).toMatchObject({ id: 'unconstrained' });
    expect(f.groups[0].title).not.toBe('');
    expect(f.groups[0].proposals).toHaveLength(6);
  });
  it('marks a version 3 group (one all-traffic worst block, no through-car block) out of date', () => {
    const v3 = { ...unc, proposals: unc.proposals.map((p) => ({ ...p, harm: { worstBlock: 'X', worstIncreaseVehPerHour: 37, blocksAboveNoise: 14 }, byPeriod: { pm: { cutThroughChangePct: -20, worstIncreaseVehPerHour: 37 } } })) };
    const f = parseProposals(JSON.stringify({ version: 3, area: 'x', groups: [v3, charter] }))!;
    expect(f.groups[0]).toMatchObject({ id: 'unconstrained', legacy: true, proposals: [] });
    expect(f.groups[1].legacy).toBeUndefined();
    expect(listOptions(f).search.map((x) => x.group.id)).toEqual(['charter', 'charter']);
  });
  it('keeps a group computed in vehicle-miles but marks it out of date', () => {
    const old = { ...unc, proposals: unc.proposals.map((p) => ({ ...p, cutThrough: { baselineVehMi: 70, scenarioVehMi: 40, changePct: -43 } })) };
    const f = parseProposals(JSON.stringify({ version: 2, area: 'x', groups: [old, charter] }))!;
    expect(f.version).toBe(4);
    expect(f.groups[0]).toMatchObject({ id: 'unconstrained', legacy: true, proposals: [] });
    expect(f.groups[1].legacy).toBeUndefined();
    expect(f.groups[1].proposals).toHaveLength(2);
  });
  it('tolerates an empty group and drops malformed ones', () => {
    const f = parseProposals(JSON.stringify({ version: 2, area: 'x', groups: [{ ...charter, proposals: [] }, { id: 'bad' }, { ...unc, title: '' }] }))!;
    expect(f.groups.map((g) => g.id)).toEqual(['charter', 'unconstrained']);
    expect(f.groups[0].proposals).toHaveLength(0);
    expect(f.groups[1].title).toBe('unconstrained');
  });
});

/** A real output of `explore` (one period, small beam, ten seeds, pictures removed): the Rust writer and this reader agree on the version 5 shape. */
describe('a file the search wrote', () => {
  const text = readFileSync(new URL('../fixtures/explore-v5-sample.json', import.meta.url), 'utf8');
  const f = parseProposals(text)!;
  const g = f.groups[0];
  it('reads as version 5, with every group and option kept', () => {
    expect(f.version).toBe(5);
    expect(g.legacy).toBeUndefined();
    expect(g.proposals.length).toBeGreaterThan(1);
    expect(g.optionComparisons?.length).toBe(g.proposals.filter((p) => p.kind !== 'reference').length - 1);
  });
  it('recognizes the legacy reporting method even on the original inputs', () => {
    const c = g.computed;
    const loaded = { network: c.networkHash, demand: c.demandHash };
    expect(evidenceStatus(c, { ...loaded, simulator: c.simulator })).toMatchObject({ state: 'stale', stale: ['method'] });
    expect(evidenceStatus(c, { ...loaded, simulator: 'other' }).state).toBe('stale');
    expect(c.estimation?.selection.estimates).toBe('exploratory');
  });
  it('gives the raw maximum and the penalty block separately, with intervals', () => {
    for (const p of g.proposals) {
      const t = p.harm.through;
      expect(t.largestIncrease?.effect?.n).toBe(10);
      expect(t.largestIncrease?.effect?.interval).toHaveLength(2);
      expect('penaltyVehPerHour' in t.adjustedPenalty).toBe(true);
      const h = harmHeadline(p.harm, 'the PM peak');
      expect(h.label).toMatch(/largest increase|No block gains/);
      expect(p.cutThrough.effect?.status).toMatch(/decrease|increase|unresolved/);
      expect(allTrafficRows(p, (id) => id)[0].flagged).toBe(false);
      expect(p.evidence?.seeds).toHaveLength(10);
    }
  });
});

describe('open on the map', () => {
  it('decodes every fixture link against the network', () => {
    for (const p of allProposals(file)) {
      const d = decodeScenario(net, linkHash(p.link));
      expect(d.invalid).toBe(false);
      expect(d.interventions.length + d.unplaced.length).toBe(p.interventions.length);
    }
  });
  it('asks only when replacing a different, non-empty scenario', () => {
    const a = decodeScenario(net, linkHash(unc.proposals[0].link)).interventions;
    const b = decodeScenario(net, linkHash(unc.proposals[2].link)).interventions;
    expect(needsConfirm([], a)).toBe(false);
    expect(needsConfirm(a, a)).toBe(false);
    expect(needsConfirm(a, b)).toBe(true);
  });
  it('steps through confirmation', () => {
    const s = openReducer({ step: 'idle' }, { type: 'ask', id: 'x' });
    expect(s).toEqual({ step: 'confirm', id: 'x' });
    expect(openReducer(s, { type: 'cancel' })).toEqual({ step: 'idle' });
    expect(openReducer(s, { type: 'done' })).toEqual({ step: 'idle' });
  });
});

describe('card anchors', () => {
  it('names a card proposal-N for the default group, by reference id for a reference, and keeps other groups apart', () => {
    expect(proposalAnchor('unconstrained', 'p1')).toBe('proposal-1');
    expect(proposalAnchor('unconstrained', 'p14')).toBe('proposal-14');
    expect(proposalAnchor('unconstrained', 'earlier-62nd-diverters')).toBe('proposal-earlier-62nd-diverters');
    expect(proposalAnchor('unconstrained', 'colby-hillegass-slow-streets')).toBe('proposal-colby-hillegass-slow-streets');
    expect(proposalAnchor('charter', 'p1')).toBe('proposal-charter-1');
    expect(proposalAnchor('charter', 'p1')).not.toBe(proposalAnchor('unconstrained', 'p1'));
  });
  it('turns an old fragment into the new one and leaves everything else alone', () => {
    expect(legacyProposalAnchor('unconstrained-p1')).toBe('proposal-1');
    expect(legacyProposalAnchor('unconstrained-p3-v2')).toBe('proposal-3');
    expect(legacyProposalAnchor('unconstrained-earlier-62nd-diverters')).toBe('proposal-earlier-62nd-diverters');
    expect(legacyProposalAnchor('charter-p2')).toBe('proposal-charter-2');
    expect(legacyProposalAnchor('proposal-1')).toBeNull();
    expect(legacyProposalAnchor('proposals-for-comparison')).toBeNull();
    expect(legacyProposalAnchor('unconstrained-')).toBeNull();
  });
});
