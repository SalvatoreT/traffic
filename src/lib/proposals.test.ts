import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildMockProposals } from '../fixtures/proposals';
import { decodeScenario } from './hash';
import {
  cutThroughHeadline, hashMatches, hashText, harmHeadline, linkHash, needsConfirm, openReducer, parseProposals,
  allProposals, proposalNotices, signedPct, splitProposals, staleInputs,
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
  it('formats the cut-through change', () => {
    expect(cutThroughHeadline({ baselineVehPerHour: 118.4, scenarioVehPerHour: 73.1, changePct: -38.27 })).toEqual({ figure: '−45 cars an hour', label: 'cutting through', detail: '118 → 73 through cars an hour (−38%)' });
    expect(cutThroughHeadline({ baselineVehPerHour: 70, scenarioVehPerHour: 70, changePct: 0 }).figure).toBe('No change');
  });
  it('words the zero-harm case', () => {
    const h = harmHeadline({ worstBlock: '', worstIncreaseVehPerHour: 0, blocksAboveNoise: 0 });
    expect(h).toMatchObject({ none: true, label: 'No street gains traffic beyond normal variation', blocks: '' });
  });
  it('names the worst block and counts blocks', () => {
    const h = harmHeadline({ worstBlock: 'Colby Street between 62nd Street and 63rd Street', worstIncreaseVehPerHour: 22.4, blocksAboveNoise: 3 });
    expect(h).toMatchObject({ figure: '+22 veh/h', label: 'on Colby Street between 62nd Street and 63rd Street', blocks: '3 blocks gain traffic' });
    expect(harmHeadline({ worstBlock: 'X', worstIncreaseVehPerHour: 5, blocksAboveNoise: 1 }).blocks).toBe('1 block gains traffic');
  });
  it('signs percentages', () => {
    expect([signedPct(-2.34), signedPct(4), signedPct(0.01), signedPct(-12.6)]).toEqual(['−2.3%', '+4%', '0%', '−13%']);
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
    expect(parseProposals('{"version":4}')).toBeNull();
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
  it('keeps a group computed in vehicle-miles but marks it out of date', () => {
    const old = { ...unc, proposals: unc.proposals.map((p) => ({ ...p, cutThrough: { baselineVehMi: 70, scenarioVehMi: 40, changePct: -43 } })) };
    const f = parseProposals(JSON.stringify({ version: 2, area: 'x', groups: [old, charter] }))!;
    expect(f.version).toBe(3);
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
