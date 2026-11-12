import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildMockProposals } from '../fixtures/proposals';
import { decodeScenario } from './hash';
import {
  cutThroughHeadline, hashMatches, hashText, harmHeadline, linkHash, needsConfirm, openReducer, parseProposals,
  proposalNotices, signedPct, splitProposals, staleInputs,
} from './proposals';

const net = buildFixture().network;
const file = buildMockProposals(net, { networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), calibration: 'uncalibrated' });

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
    expect(proposalNotices({ ...file.computed, calibration: 'uncalibrated' }, hashes).exploratory).toBe(true);
    expect(proposalNotices({ ...file.computed, calibration: 'calibrated' }, hashes)).toMatchObject({ exploratory: false, stale: false });
  });
  it('stale says which input changed', () => {
    const n = proposalNotices(file.computed, { network: 'c'.repeat(64), demand: hashes.demand });
    expect(n.stale).toBe(true);
    expect(n.staleText).toMatch(/street network has changed/);
  });
});

describe('headline figures', () => {
  it('formats the cut-through change', () => {
    expect(cutThroughHeadline({ baselineVehMi: 71.6, scenarioVehMi: 44.2, changePct: -38.27 })).toEqual({ figure: '−38%', label: 'cut-through', detail: '71.6 → 44.2 veh-mi' });
    expect(cutThroughHeadline({ baselineVehMi: 70, scenarioVehMi: 70, changePct: 0 }).figure).toBe('No change');
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
    const { search, reference } = splitProposals(file);
    expect(search.map((p) => p.id)).toEqual(['one-filter', 'two-filters-hump', 'filters-limit', 'filters-diverter', 'widest']);
    expect(reference.map((p) => p.id)).toEqual(['earlier-62nd-diverters']);
    expect(reference[0].interventions).toHaveLength(2);
  });
  it('treats an absent kind as search', () => {
    const f = { ...file, proposals: [{ ...file.proposals[0], kind: undefined }] };
    expect(splitProposals(f).search).toHaveLength(1);
  });
  it('rejects files that are not proposals', () => {
    expect(parseProposals('<html>')).toBeNull();
    expect(parseProposals(JSON.stringify(file))?.proposals).toHaveLength(6);
  });
});

describe('open on the map', () => {
  it('decodes every fixture link against the network', () => {
    for (const p of file.proposals) {
      const d = decodeScenario(net, linkHash(p.link));
      expect(d.invalid).toBe(false);
      expect(d.interventions.length + d.unplaced.length).toBe(p.interventions.length);
    }
  });
  it('asks only when replacing a different, non-empty scenario', () => {
    const a = decodeScenario(net, linkHash(file.proposals[0].link)).interventions;
    const b = decodeScenario(net, linkHash(file.proposals[2].link)).interventions;
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
