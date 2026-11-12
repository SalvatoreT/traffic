import { describe, expect, it } from 'vitest';
import { bandLimit, bandOf, corridors, encodeUint16, evaluateCases, geh, gehClass, linkSpread, msaAverage, relativeGap, seedStat, selectHoldout, shareUnchanged, summarizeCases, t975, withinBand } from './lib/acceptance';

describe('GEH', () => {
  it('reproduces the worked values in the London appendix (1000 vs 850 and 100 vs 57 both 4.9)', () => {
    expect(geh(1000, 850)).toBeCloseTo(4.9, 1);
    expect(geh(100, 57)).toBeCloseTo(4.9, 1);
  });
  it('is zero for equal flows and for two zeros, and symmetric', () => {
    expect(geh(500, 500)).toBe(0);
    expect(geh(0, 0)).toBe(0);
    expect(geh(300, 450)).toBeCloseTo(geh(450, 300), 12);
  });
  it('classes follow the 5 and 10 limits', () => {
    expect(gehClass(4.99)).toBe('good');
    expect(gehClass(5)).toBe('investigate');
    expect(gehClass(10)).toBe('investigate');
    expect(gehClass(10.1)).toBe('unacceptable');
  });
});

describe('flow size bands', () => {
  it('uses 100 veh/h below 700, 15% from 700 to 2700, 400 above', () => {
    expect(bandOf(699)).toBe('below 700');
    expect(bandOf(700)).toBe('700 to 2700');
    expect(bandOf(2700)).toBe('700 to 2700');
    expect(bandOf(2701)).toBe('above 2700');
    expect(bandLimit(300)).toBe(100);
    expect(bandLimit(1000)).toBeCloseTo(150);
    expect(bandLimit(3000)).toBe(400);
  });
  it('passes at the limit and fails just past it', () => {
    expect(withinBand(400, 300)).toBe(true);
    expect(withinBand(401, 300)).toBe(false);
    expect(withinBand(1150, 1000)).toBe(true);
    expect(withinBand(1151, 1000)).toBe(false);
    expect(withinBand(3400, 3000)).toBe(true);
    expect(withinBand(3401, 3000)).toBe(false);
  });
  it('a 75% miss at 100 veh/h passes GEH-like leniency but is reported per criterion', () => {
    const r = evaluateCases([{ id: 'a', modeled: 100, counted: 57 }, { id: 'b', modeled: 100, counted: 300 }])!;
    expect(r[0].gehOk).toBe(true);
    expect(r[0].bandOk).toBe(true);
    expect(r[1].gehOk).toBe(false);
    expect(r[1].bandOk).toBe(false);
  });
  it('summary needs more than 85% of cases', () => {
    const mk = (nOk: number, n: number) => summarizeCases(evaluateCases(Array.from({ length: n }, (_, i) => ({ id: String(i), modeled: i < nOk ? 500 : 1500, counted: 500 }))));
    expect(mk(17, 20).meets).toBe(false); // exactly 85% is not "more than"
    expect(mk(18, 20).meets).toBe(true);
    expect(mk(18, 20).gehShare).toBeCloseTo(0.9);
  });
});

describe('hold-out selection', () => {
  const st = (corridor: string, n: number) => Array.from({ length: n }, (_, i) => ({ id: `${corridor}${i}`, corridor, target: 1000 - i * 10 }));
  const all = [...st('A', 8), ...st('B', 2), ...st('C', 1), ...st('D', 5)];
  it('covers every corridor at least once and holds out about a quarter', () => {
    const h = selectHoldout(all);
    for (const c of corridors(all)) expect(all.filter((s) => s.corridor === c && h.has(s.id)).length).toBeGreaterThanOrEqual(1);
    expect(h.size / all.length).toBeGreaterThan(0.15);
    expect(h.size / all.length).toBeLessThan(0.4);
  });
  it('keeps the largest count of a multi-station corridor in the fit and is deterministic', () => {
    const h = selectHoldout(all);
    expect(h.has('A0')).toBe(false);
    expect(h.has('A1')).toBe(true);
    expect([...selectHoldout([...all].reverse())].sort()).toEqual([...h].sort());
  });
});

describe('seed statistics', () => {
  it('mean, sample sd, range and the t interval for ten values', () => {
    const s = seedStat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(s.mean).toBe(5.5);
    expect(s.sd).toBeCloseTo(3.0277, 3);
    expect(s.min).toBe(1);
    expect(s.max).toBe(10);
    expect(s.hi - s.mean).toBeCloseTo((t975(9) * 3.0277) / Math.sqrt(10), 3);
    expect(t975(9)).toBe(2.262);
  });
  it('one value has no spread, none is NaN', () => {
    expect(seedStat([4])).toMatchObject({ mean: 4, sd: 0, lo: 4, hi: 4 });
    expect(Number.isNaN(seedStat([]).mean)).toBe(true);
  });
  it('per-link spread over seeds and compact encoding', () => {
    const { mean, sd } = linkSpread([[10, 100], [12, 100], [14, 100]]);
    expect(mean[0]).toBe(12);
    expect(sd[0]).toBeCloseTo(2);
    expect(sd[1]).toBe(0);
    expect(encodeUint16([0, 2.04, 1e9], 0.1)).toEqual([0, 20, 65535]);
  });
});

describe('successive averages of costs', () => {
  it('first iteration takes the measurement, then 1/n weights give the running mean', () => {
    let c = msaAverage(null, [10, 0], 1);
    expect([...c]).toEqual([10, 0]);
    c = msaAverage(c, [20, 6], 2);
    expect([...c]).toEqual([15, 3]);
    c = msaAverage(c, [30, 0], 3);
    expect(c[0]).toBeCloseTo(20); // mean of 10, 20, 30
    expect(c[1]).toBeCloseTo(2);
  });
  it('2/(n+1) weights move faster than 1/n', () => {
    expect(msaAverage([10], [20], 3, 'twoOverNPlusOne')[0]).toBeCloseTo(15);
    expect(msaAverage([10], [20], 3)[0]).toBeCloseTo(13.333, 2);
  });
  it('relative gap and share of unchanged links', () => {
    expect(relativeGap([10, 10], [10, 10])).toBe(0);
    expect(relativeGap([10, 10], [11, 9])).toBeCloseTo(0.1);
    expect(relativeGap([0], [0])).toBe(0);
    expect(shareUnchanged([100, 100, 100, 0], [100.5, 103, 100, 0.05], 0.01, 0.1)).toBe(0.75);
  });
});
