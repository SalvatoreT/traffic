import { describe, expect, it } from 'vitest';
import { recentRuleMet, ruleSplit, ageOf, applyRecency, bandWeight, groupBySourceYear, growthFactor, recentSplit, sourceYearLines, type Dated, type RecencyConfig } from './lib/recency';

const cfg: RecencyConfig = { enabled: true, referenceYear: 2026, recentYears: 5, bands: [{ maxAgeYears: 10, weight: 1 }, { weight: 0.5 }] };
const st = (id: string, source: string, year: number | null, weight = 1): Dated => ({ id, source, year, weight, target: { pm_peak: 100 } });

describe('recency of count sources', () => {
  it('takes the band of the age and the last band when the year is unknown', () => {
    expect(ageOf(2013, 2026)).toBe(13);
    expect(ageOf(null, 2026)).toBeNull();
    expect(bandWeight(1, cfg.bands)).toBe(1);
    expect(bandWeight(10, cfg.bands)).toBe(1);
    expect(bandWeight(13, cfg.bands)).toBe(0.5);
    expect(bandWeight(null, cfg.bands)).toBe(0.5);
  });
  it('scales the weights of old stations, including the weight of a period, and leaves recent ones alone', () => {
    const a = st('a', 'volunteer', 2025), b = st('b', 'eir', 2013, 0.5), c = st('c', 'unknown', null);
    b.weightByPeriod = { midday: 0.25 };
    const sum = applyRecency([a, b, c], cfg);
    expect([a.weight, b.weight, c.weight]).toEqual([1, 0.25, 0.5]);
    expect(b.weightByPeriod).toEqual({ midday: 0.125 });
    expect(sum.sources.map((r) => [r.source, r.weight])).toEqual([['eir', 0.5], ['unknown', 0.5], ['volunteer', 1]]);
  });
  it('holds a weight of 0 out of every fit', () => {
    const b = st('b', 'eir', 2010);
    applyRecency([b], { ...cfg, bands: [{ maxAgeYears: 10, weight: 1 }, { weight: 0 }] });
    expect(b).toMatchObject({ held: true, outOfFit: true, weight: 1 });
  });
  it('grows a count from its year to the reference year only for a source with a rate', () => {
    expect(growthFactor(10, 0.01)).toBeCloseTo(1.1046, 4);
    expect(growthFactor(null, 0.01)).toBe(1);
    const a = st('a', 'eir', 2016), b = st('b', 'volunteer', 2016);
    applyRecency([a, b], { ...cfg, growthPerYear: { eir: 0.02 } });
    expect(a.target.pm_peak).toBeCloseTo(121.9, 1);
    expect(b.target.pm_peak).toBe(100);
  });
  it('scores per source and year and splits the rule into recent and older sources', () => {
    const items: { source?: string; year?: number | null; c: { gehOk: boolean; held?: boolean } }[] = [
      { source: 'v', year: 2025, c: { gehOk: true } }, { source: 'v', year: 2025, c: { gehOk: false, held: true } },
      { source: 'eir', year: 2013, c: { gehOk: false } }, { source: 'eir', year: 2013, c: { gehOk: true } }, { source: 'x', year: null, c: { gehOk: false } },
    ];
    const g = groupBySourceYear(items);
    expect(g.map((r) => [r.source, r.fitted.n, r.fitted.ok, r.held.n, r.held.ok])).toEqual([['eir', 2, 1, 0, 0], ['v', 1, 1, 1, 0], ['x', 1, 0, 0, 0]]);
    const sp = recentSplit(items, 2026, 5);
    expect(sp.recent).toEqual({ n: 2, ok: 1 });
    expect(sp.older).toEqual({ n: 3, ok: 1 });
    const text = sourceYearLines(items, { referenceYear: 2026, recentYears: 5 }).join('\n');
    expect(text).toContain('| eir | 2013 | 13 | 1 of 2 (50%) | - |');
    expect(text).toContain('unknown, treated as old');
    expect(text).toContain('judged on counts from the last 5 years: fitted 1 of 1 (100%) (met), held out 1 of 1 (0%)'.replace('1 of 1 (0%)', '0 of 1 (0%)'));
    expect(text).toContain('Older counts, reported beside it: fitted 1 of 3 (33%) (not met)');
  });
  it('judges the station rule on recent counts, both sets', () => {
    const mk = (year: number, ok: boolean, held = false) => ({ year, c: { gehOk: ok, held } });
    const good = [mk(2025, true), mk(2025, true, true), mk(2013, false), mk(2013, false, true)];
    expect(recentRuleMet(ruleSplit(good, { referenceYear: 2026, recentYears: 5 }))).toBe(true);
    expect(recentRuleMet(ruleSplit([mk(2025, true), mk(2025, false, true)], { referenceYear: 2026, recentYears: 5 }))).toBe(false);
    expect(recentRuleMet(ruleSplit([mk(2013, true)], { referenceYear: 2026, recentYears: 5 }))).toBe(false);
  });
});
