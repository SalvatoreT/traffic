import { describe, expect, it } from 'vitest';
import { allCarsByBlock, allCarsFromFile, allCarsShort, ALL_CARS_MISSING, blockFigures, blockTip, changeTip, mostlyVisible, noiseNote, signedCars, streetsThatChange, throughLine } from './proposal-map';
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
    expect(noiseNote(30, 40)).toMatch(/about 40 cars/);
    expect(noiseNote(-246, 40)).toBeNull();
  });
  it('gives all cars only for the block the file records them for', () => {
    const p = { byPeriod: { pm: { allTraffic: { largestIncrease: { block: 'North St', baselineVehPerHour: 36, scenarioVehPerHour: 151, increaseVehPerHour: 115, throughIncreaseVehPerHour: 52 }, adjustedPenalty: { block: null, penaltyVehPerHour: null }, blocksAboveBand: 0 } } } } as unknown as Proposal;
    const pic = { period: 'pm', links: [], base: [], scen: [] } as ProposalPicture;
    expect(allCarsFromFile(p, pic, 'North St')).toEqual({ base: 36, scen: 151 });
    expect(allCarsFromFile(p, pic, 'Other St')).toBeNull();
  });
  it('reads all cars per block from pictureAll, both directions together, and says nothing when the file has none', () => {
    const index = { blockOfLink: [0, 0, 1, -1], blocks: [{ label: 'North St' }, { label: 'Dana St' }] } as unknown as NetIndex;
    const pictureAll: ProposalPicture = { period: 'pm', links: [0, 1, 2, 3], base: [40, 30, 10, 99], scen: [150, 128, 12, 99] };
    const by = allCarsByBlock({ pictureAll }, index)!;
    expect([...by.keys()]).toEqual([0, 1]);
    expect(by.get(0)).toMatchObject({ label: 'North St', base: 70, scen: 278, delta: 208 });
    expect(allCarsByBlock({}, index)).toBeNull();
  });
  it('gives one row of whole cars for through cars alone when the file has no all-car figures', () => {
    expect(blockFigures({ base: 207.6, scen: 0.2 }, null)).toEqual([{ label: 'Through cars', today: 208, withProposal: 0, change: -208 }]);
  });
  it('splits all cars into through cars and local trips so each row adds up', () => {
    const rows = blockFigures({ base: 5, scen: 99 }, { base: 70, scen: 278 });
    expect(rows.map((r) => r.label)).toEqual(['Through cars', 'Local trips', 'All cars']);
    expect(rows[1]).toEqual({ label: 'Local trips', today: 65, withProposal: 179, change: 114 });
    expect(rows[2]).toEqual({ label: 'All cars', today: 70, withProposal: 278, change: 208 });
    for (const r of rows) expect(r.withProposal - r.today).toBe(r.change);
    expect(blockFigures({ base: 5, scen: 0 }, { base: 70, scen: 60 })[1].change).toBe(-5);
  });
  it('writes changes with the real minus sign and no unit', () => {
    expect(signedCars(-208)).toBe('−208');
    expect(signedCars(29)).toBe('+29');
    expect(signedCars(0.2)).toBe('0');
  });
  it('keeps the old wording when the file has no all-car picture', () => {
    expect(ALL_CARS_MISSING).toMatch(/not in the published file/);
  });
});

describe('map tooltip', () => {
  it('puts all cars on a second line only when the file has them', () => {
    expect(blockTip('A St', '5 → 9 through cars', null).lines).toEqual(['5 → 9 through cars']);
    expect(blockTip('A St', '5 → 9 through cars', '10 → 20 all cars an hour').lines).toEqual(['10 → 20 all cars an hour', '5 → 9 through cars']);
  });
  it('has no line for a change whose redirect data has not loaded', () => {
    expect(changeTip('One-way', null)).toEqual({ title: 'One-way', lines: [] });
    expect(changeTip('One-way', 'About 9 used this.').lines).toEqual(['About 9 used this.']);
  });
  it('knows when the map is already in view', () => {
    const view = { left: 0, top: 0, right: 400, bottom: 800 };
    expect(mostlyVisible({ left: 8, top: 100, right: 392, bottom: 500 }, view)).toBe(true);
    expect(mostlyVisible({ left: 8, top: 600, right: 392, bottom: 1000 }, view)).toBe(false);
    expect(mostlyVisible({ left: 8, top: -300, right: 392, bottom: 50 }, view)).toBe(false);
  });
});
