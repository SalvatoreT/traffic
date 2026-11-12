import { describe, expect, it } from 'vitest';
import { changeWidthFor, divergingStops, WIDTH_MAX, WIDTH_MIN } from './ramps';

const lum = (h: string) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a: string, b: string) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const BG = { light: '#f1efe8', dark: '#161b22' };

describe('change ramp', () => {
  for (const mode of ['light', 'dark'] as const) {
    it(`keeps every non-zero step at 3:1 against the ${mode} basemap`, () => {
      for (const s of divergingStops(mode).filter((x) => x.t !== 0)) expect(contrast(s.color, BG[mode])).toBeGreaterThanOrEqual(3);
    });
    it(`grows in contrast with size of change in the ${mode} theme`, () => {
      const pos = divergingStops(mode).filter((x) => x.t > 0).map((x) => contrast(x.color, BG[mode]));
      const neg = divergingStops(mode).filter((x) => x.t < 0).reverse().map((x) => contrast(x.color, BG[mode]));
      for (const c of [pos, neg]) for (let i = 1; i < c.length; i++) expect(c[i]).toBeGreaterThan(c[i - 1]);
    });
  }
  it('is symmetric in position and ends at plus and minus one', () => {
    const t = divergingStops('light').map((s) => s.t);
    expect(t[0]).toBe(-1);
    expect(t[t.length - 1]).toBe(1);
    expect(t.filter((x) => x > 0)).toEqual(t.filter((x) => x < 0).map((x) => -x).reverse());
  });
});

describe('change width', () => {
  it('is thin at zero, thick at either end and larger for mid-size changes than a linear scale', () => {
    expect(changeWidthFor(0)).toBe(WIDTH_MIN);
    expect(changeWidthFor(1)).toBe(WIDTH_MAX);
    expect(changeWidthFor(-1)).toBe(WIDTH_MAX);
    expect(changeWidthFor(0.25)).toBeGreaterThan(WIDTH_MIN + 0.25 * (WIDTH_MAX - WIDTH_MIN));
  });
});
