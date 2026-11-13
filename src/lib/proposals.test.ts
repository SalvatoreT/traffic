import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildMockProposals } from '../fixtures/proposals';
import { decodeScenario } from './hash';
import {
  allProposals, allTrafficNote, allTrafficRows, beforeAfterPct, cutThroughHeadline, hashMatches, hashText, harmHeadline, linkHash, needsConfirm,
  openReducer, parseProposals, periodsPhrase, proposalNotices, signedPct, splitProposals, staleInputs,
} from './proposals';

const net = buildFixture().network;
const file = buildMockProposals(net, { networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), calibration: 'uncalibrated' });
const [charter, unc] = file.groups;

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
    const n = proposalNotices(unc.computed, { network: 'c'.repeat(64), demand: hashes.demand });
    expect(n.stale).toBe(true);
    expect(n.staleText).toMatch(/street network has changed/);
  });
});

describe('headline figures', () => {
  const when = 'the average of the AM peak, PM peak and Midday';
  it('formats the cut-through change and defines it', () => {
    const h = cutThroughHeadline({ baselineVehPerHour: 118.4, scenarioVehPerHour: 73.1, changePct: -38.27 }, when);
    expect(h).toMatchObject({ figure: '−45 cars an hour', label: 'cutting through', detail: '118 → 73 through cars an hour (−38%)' });
    expect(h.definition).toMatch(/Through cars on all of the area's side streets/);
    expect(h.definition).toContain(when);
    expect(cutThroughHeadline({ baselineVehPerHour: 70, scenarioVehPerHour: 70, changePct: 0 }).figure).toBe('No change');
  });
  it('words the no-gain case without a number', () => {
    const h = harmHeadline({ through: { worstBlock: 'X', increaseVehPerHour: 3, blocksAboveNoise: 0 } }, when);
    expect(h).toMatchObject({ none: true, figure: '', label: 'No block gains through traffic beyond run-to-run variation' });
    expect(h.definition).toMatch(/^Through cars only/);
  });
  it('names the block, counts through cars, and says what is counted', () => {
    const h = harmHeadline({ through: { worstBlock: 'Colby Street between 63rd Street and North Street', increaseVehPerHour: 12.4, blocksAboveNoise: 3 } }, when);
    expect(h).toMatchObject({ none: false, figure: '+12 through cars an hour', label: 'on Colby Street between 63rd Street and North Street, the block that gains the most' });
    expect(h.definition).toContain('Through cars only, both directions of that one block');
    expect(h.definition).toContain(when);
    expect(h.definition).toContain('2 other blocks also gain through cars beyond run-to-run variation');
    expect(harmHeadline({ through: { worstBlock: 'X', increaseVehPerHour: 11, blocksAboveNoise: 1 } }).definition).toContain('No other block');
  });
  it('never shows a figure without naming what it counts', () => {
    for (const p of allProposals(file)) {
      const c = cutThroughHeadline(p.cutThrough, when), h = harmHeadline(p.harm, when);
      expect(c.detail).toContain('through cars an hour');
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
    const row = (change: number, through: number) => ({ period: 'PM', block: 'B', before: 100, after: 100 + change, change, through, local: change - through, blocksAbove: 1 });
    expect(allTrafficNote([row(37, 12)])).toMatch(/^Mostly local trips: about 68% .* about 32% are through cars/);
    expect(allTrafficNote([row(40, 30)])).toMatch(/^About 75% of the extra cars on these blocks are through cars and about 25% are local trips/);
    expect(allTrafficNote([row(40, 30)])).not.toMatch(/Mostly/);
    expect(allTrafficNote([row(37, 12)])).toMatch(/number of trips fixed/);
  });
  it('makes no claim when no block gains beyond noise', () => {
    expect(allTrafficNote([{ period: 'PM', block: null, before: 1, after: 2, change: 1, through: 0, local: 1, blocksAbove: 0 }])).toBe('');
    expect(allTrafficNote([])).toBe('');
    const none = { ...p, byPeriod: { pm: { ...p.byPeriod['pm-peak'], allTraffic: { ...p.byPeriod['pm-peak'].allTraffic, blocksAboveNoise: 0 } } } };
    expect(allTrafficRows(none, label)[0]).toMatchObject({ block: null, blocksAbove: 0 });
  });
});

describe('sections', () => {
  it('lists search options in file order, reference entries apart', () => {
    const { search, reference } = splitProposals(unc);
    expect(search.map((p) => p.id)).toEqual(['one-filter', 'two-filters-hump', 'filters-limit', 'filters-diverter', 'widest']);
    expect(reference.map((p) => p.id)).toEqual(['earlier-62nd-diverters']);
    expect(reference[0].interventions).toHaveLength(2);
  });
  it('treats an absent kind as search', () => {
    const f = { proposals: [{ ...unc.proposals[0], kind: undefined }] };
    expect(splitProposals(f).search).toHaveLength(1);
  });
  it('rejects files that are not proposals', () => {
    expect(parseProposals('<html>')).toBeNull();
    expect(parseProposals('{"version":5}')).toBeNull();
  });
});

describe('groups', () => {
  it('keeps the file order, charter first', () => {
    const f = parseProposals(JSON.stringify(file))!;
    expect(f.groups.map((g) => g.id)).toEqual(['charter', 'unconstrained']);
    expect(f.groups.map((g) => g.proposals.length)).toEqual([2, 6]);
    expect(allProposals(f)).toHaveLength(8);
  });
  it('charter holds no hump or circle', () => {
    for (const p of charter.proposals) for (const iv of p.interventions) expect(['speed_hump', 'traffic_circle']).not.toContain(iv.type);
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
