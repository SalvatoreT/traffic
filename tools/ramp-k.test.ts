import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { estimateRampK, nearestYear, rampKNotes, type RampKPair } from './lib/ramp-k';
import { matchRampVolumes } from './lib/demand-ramps';

const cfg = { method: 'counted-ramps' as const, fallback: 0.09, minRamps: 3 };
const pair = (ramp: string, count: number, countYear: number | null, adt: Record<string, number>, sharedBy = 1): RampKPair => ({ ramp, count, countYear, adtByRow: [adt], sharedBy, station: ramp });

describe('ramp K from counted ramps', () => {
  it('takes the ADT of the year nearest to the count, the later year on a tie', () => {
    expect(nearestYear({ 2012: 100, 2019: 90 }, 2013)).toEqual({ year: 2012, adt: 100 });
    expect(nearestYear({ 2012: 100, 2019: 90 }, 2016)).toEqual({ year: 2019, adt: 90 });
    expect(nearestYear({ 2012: 100, 2014: 90 }, 2013)).toEqual({ year: 2014, adt: 90 });
    expect(nearestYear({ 2012: 100, 2019: 90 }, null)).toEqual({ year: 2019, adt: 90 });
    expect(nearestYear({}, 2013)).toBeNull();
  });
  it('pools counts over ADTs and reports the median beside it', () => {
    const r = estimateRampK([pair('a', 60, 2010, { 2012: 1000 }), pair('b', 100, 2013, { 2012: 1000, 2019: 2000 }), pair('c', 300, 2013, { 2016: 3000 })], cfg);
    expect(r.estimated).toBe(true);
    expect(r.k).toBeCloseTo(460 / 5000, 10);
    expect(r.median).toBeCloseTo(0.1, 10);
    expect(r.used.map((u) => [u.ramp, u.adt, u.adtYear])).toEqual([['a', 1000, 2012], ['b', 1000, 2012], ['c', 3000, 2016]]);
  });
  it('keeps the fallback below the required number of ramps and says why', () => {
    const r = estimateRampK([pair('a', 60, 2010, { 2012: 1000 }), pair('b', 100, 2013, { 2012: 1000 })], cfg);
    expect(r.k).toBe(0.09);
    expect(r.estimated).toBe(false);
    expect(r.reason).toMatch(/2 usable counted ramps, fewer than the 3 required/);
    expect(estimateRampK([pair('a', 60, 2010, { 2012: 1000 }), pair('b', 100, 2013, { 2012: 1000 })], { ...cfg, minRamps: 2 }).k).toBeCloseTo(160 / 2000, 10);
  });
  it('skips a ramp whose ADT row is shared, has no count or has no ADT', () => {
    const r = estimateRampK([pair('shared', 900, 2013, { 2012: 1000 }, 2), pair('nocount', 0, 2013, { 2012: 1000 }), pair('noadt', 50, 2013, {}), pair('ok', 50, 2013, { 2012: 1000 })], { ...cfg, minRamps: 1 });
    expect(r.used.map((u) => u.ramp)).toEqual(['ok']);
    expect(r.skipped.map((s) => s.ramp)).toEqual(['shared', 'nocount', 'noadt']);
  });
  it('sums the rows of a ramp with several rows, each at its own nearest year', () => {
    const p: RampKPair = { ramp: 'two', count: 100, countYear: 2013, adtByRow: [{ 2012: 400, 2019: 300 }, { 2016: 600 }], sharedBy: 1, station: 'two' };
    const r = estimateRampK([p], { ...cfg, minRamps: 1 });
    expect(r.used[0].adt).toBe(1000);
    expect(r.k).toBeCloseTo(0.1, 10);
  });
  it('writes the estimate, its inputs and the label as report lines', () => {
    const r = estimateRampK([pair('a', 60, 2010, { 2012: 1000 }), pair('b', 100, 2013, { 2012: 1000 }), pair('c', 300, 2013, { 2016: 3000 })], cfg);
    const lines = rampKNotes(r, cfg, 'shipped', 0.09);
    expect(lines[0]).toBe('ramp K (round 46, shipped view): 0.0920 from 3 counted ramps (pooled ratio; median 0.1000), against the assumed 0.09');
    expect(lines.some((l) => l.startsWith('ramp K input: a: counted 60 veh/h (2010) over ADT 1000 (2012)'))).toBe(true);
    expect(lines[lines.length - 1]).toMatch(/ASSUMPTION/);
    expect(rampKNotes(estimateRampK([], cfg), cfg, 'training', 0.09)[0]).toMatch(/^ramp K \(round 46, training view\): 0\.09 \(fallback\): 0 usable counted ramps/);
  });
});

describe('ramp volumes keep the ADT rows by year', () => {
  const ramps = [{ kind: 'on' as const, surface: 1, gates: [9], streets: ['Main Street'], path: [] }, { kind: 'on' as const, surface: 2, gates: [9], streets: ['Main Street'], path: [] }];
  const rows = [{ route: 'r', postmile: '1', desc: 'WB ON FR MAIN', adt: { 2012: 1000, 2019: 900 } }];
  it('reports the rows and how many ramps share them', () => {
    const v = matchRampVolumes(ramps, rows, { main: ['main'] }, (n) => (n.toLowerCase().startsWith('main') ? 'main' : null), 500, 'rows');
    expect(v.get(ramps[0])!.adtByRow).toEqual([{ 2012: 1000, 2019: 900 }]);
    expect(v.get(ramps[0])!.sharedBy).toBe(2);
  });
});

describe('the candidate fragments', () => {
  const dir = 'openspec/changes/archive/2026-11-19-calibration-round-46/candidates';
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  it('are labeled ASSUMPTION and fall back to the assumed K', () => {
    const base = JSON.parse(readFileSync('data/demand/rockridge.config.json', 'utf8'));
    expect(files.sort()).toEqual(['ramp-k-counted-min2.json', 'ramp-k-counted.json']);
    for (const f of files) {
      const c = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
      expect(c._note).toMatch(/^ASSUMPTION/);
      expect(c.method).toBe('counted-ramps');
      expect(c.fallback).toBe(base.ramps.kFactor);
    }
  });
  it('leave the shipped config without a rampK entry', () => {
    expect(JSON.parse(readFileSync('data/demand/rockridge.config.json', 'utf8')).countFit.rampK).toBeUndefined();
  });
});
