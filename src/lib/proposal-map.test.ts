import { describe, expect, it } from 'vitest';
import { allCarsByBlock, allCarsLine, allCarsPictureLine, allCarsShort, ALL_CARS_MISSING, noiseNote, streetsThatChange, throughLine } from './proposal-map';
import type { NetIndex } from './naming';
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
  it('reads all cars per block from pictureAll, both directions together, and says nothing when the file has none', () => {
    const index = { blockOfLink: [0, 0, 1, -1], blocks: [{ label: 'North St' }, { label: 'Dana St' }] } as unknown as NetIndex;
    const pictureAll: ProposalPicture = { period: 'pm', links: [0, 1, 2, 3], base: [40, 30, 10, 99], scen: [150, 128, 12, 99] };
    const by = allCarsByBlock({ pictureAll }, index)!;
    expect([...by.keys()]).toEqual([0, 1]);
    expect(by.get(0)).toMatchObject({ label: 'North St', base: 70, scen: 278, delta: 208 });
    expect(allCarsByBlock({}, index)).toBeNull();
  });
  it('splits the all-car change into through cars and local trips', () => {
    const line = allCarsPictureLine({ base: 70, scen: 278 }, { base: 5, scen: 99 }, 'PM peak');
    expect(line).toBe('All cars on this block, PM peak: 70 → 278 an hour (+208 cars an hour): through cars +94, local trips +114.');
    expect(allCarsPictureLine({ base: 70, scen: 60 }, { base: 5, scen: 0 }, 'PM peak')).toContain('local trips −5');
    expect(allCarsShort({ base: 70.4, scen: 277.6 })).toBe('70 → 278 all cars an hour');
  });
  it('keeps the old wording when the file has no all-car picture', () => {
    expect(ALL_CARS_MISSING).toMatch(/not in the published file/);
  });
});
