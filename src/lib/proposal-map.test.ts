import { describe, expect, it } from 'vitest';
import { allCarsLine, noiseNote, streetsThatChange, throughLine } from './proposal-map';
import type { Proposal, ProposalPicture } from './proposals';

const c = (block: number, label: string, base: number, scen: number) => ({ block, label, base, scen, delta: scen - base });

describe('proposal map readouts', () => {
  it('lists blocks that change by a whole car, largest first, and drops the rest', () => {
    const out = streetsThatChange([c(1, 'B', 10, 12), c(2, 'A', 5, 5.2), c(3, 'C', 40, 0), c(4, 'D', 0, 30)]);
    expect(out.map((x) => x.label)).toEqual(['C', 'D', 'B']);
  });
  it('says through cars, the period and the change in cars an hour', () => {
    expect(throughLine(c(1, 'A', 5, 34), 'PM peak')).toBe('5 → 34 through cars an hour in the PM peak (+29 cars an hour)');
  });
  it('flags changes inside the dead band', () => {
    expect(noiseNote(3)).toMatch(/run-to-run/);
    expect(noiseNote(-40)).toBeNull();
  });
  it('gives all cars only for the block the file records them for', () => {
    const p = { byPeriod: { pm: { allTraffic: { largestIncrease: { block: 'North St', baselineVehPerHour: 36, scenarioVehPerHour: 151, increaseVehPerHour: 115, throughIncreaseVehPerHour: 52 }, adjustedPenalty: { block: null, penaltyVehPerHour: null }, blocksAboveBand: 0 } } } } as unknown as Proposal;
    const pic = { period: 'pm', links: [], base: [], scen: [] } as ProposalPicture;
    expect(allCarsLine(p, pic, 'North St', 'PM peak')).toContain('36 → 151');
    expect(allCarsLine(p, pic, 'North St', 'PM peak')).toContain('local trips +63');
    expect(allCarsLine(p, pic, 'Other St', 'PM peak')).toBeNull();
  });
});
