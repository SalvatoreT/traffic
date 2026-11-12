import { describe, expect, it } from 'vitest';
import { linkChangeIntensity, NO_DATA } from './change';
import { linkStatsView } from '../types';

/** Deterministic arrivals on one link: one vehicle every `gap` seconds on average, jittered. */
function arrivals(gap: number, seconds: number, seed: number): number[] {
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const out: number[] = [];
  for (let t = rnd() * gap; t < seconds; t += gap * (0.4 + 1.2 * rnd())) out.push(t);
  return out;
}
const cumulative = (a: number[], t: number) => (a.filter((x) => x <= t).length * 3600) / Math.max(t, 1);
const rolling = (a: number[], t: number, win = 300) => (a.filter((x) => x <= t && x > t - win).length * 3600) / Math.min(win, Math.max(t, 1));
const view = (cut: number) => linkStatsView(new Float32Array([cut, 8, cut, 0]));

/** Cut-through intensity of the same street in baseline and scenario at each sample time. */
function series(rate: (a: number[], t: number) => number, gapBase: number, gapScen: number) {
  const base = arrivals(gapBase, 3600, 7), scen = arrivals(gapScen, 3600, 11);
  const out: number[] = [];
  for (let t = 900; t <= 3600; t += 15) out.push(linkChangeIntensity('cutthrough', view(rate(base, t)), view(rate(scen, t)), 0));
  return out;
}
const maxStep = (v: number[]) => v.reduce((m, x, i) => (i ? Math.max(m, Math.abs(x - v[i - 1])) : m), 0);

describe('street colors hold steady', () => {
  // A street near the noise band: about 14 vs 20 veh/h of cut-through (gaps of 257 s and 180 s).
  it('a 5-minute window blinks near the noise band (the old behavior)', () => {
    const v = series(rolling, 257, 180);
    expect(maxStep(v)).toBeGreaterThan(0.1);
  });
  it('the run-so-far average moves in small steps', () => {
    const v = series(cumulative, 257, 180);
    expect(maxStep(v)).toBeLessThan(0.05);
  });
  it('a street with traffic never goes back to "no data"', () => {
    const v = series(cumulative, 257, 180);
    expect(v.every((x) => x > NO_DATA + 0.5)).toBe(true);
  });
  it('changes color continuously across the noise band', () => {
    const v = series(cumulative, 120, 100);
    expect(maxStep(v)).toBeLessThan(0.05);
  });
});
