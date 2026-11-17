import { describe, expect, it } from 'vitest';
import { limitMph, signLayout, signNumber, signOffset, speedSignSvg, SIGN_ASPECT, SIGN_WORDS_MIN_H } from './speedsign';

describe('speed-limit sign', () => {
  it('takes its number from the limit, converting m/s to mph', () => {
    expect(limitMph(6.7)).toBe(15);
    expect(limitMph(11.176)).toBe(25);
    expect(signNumber(14.6)).toBe('15');
    expect(speedSignSvg(25, 30)).toContain('>25</text>');
    expect(speedSignSvg(15, 30)).not.toContain('>25<');
  });
  it('is an upright white sign with a black number', () => {
    const L = signLayout(15, 30);
    expect(L.w / L.h).toBeCloseTo(SIGN_ASPECT);
    const svg = speedSignSvg(15, 30);
    expect(svg).toContain('fill="#fff"');
    expect(svg).toContain('font-weight="700" fill="#111">15<');
  });
  it('drops the words SPEED LIMIT at small sizes and keeps the number', () => {
    expect(signLayout(15, SIGN_WORDS_MIN_H).words?.lines).toEqual(['SPEED', 'LIMIT']);
    expect(speedSignSvg(15, 30)).toContain('>SPEED<');
    for (const h of [14, 18, SIGN_WORDS_MIN_H - 1]) {
      expect(signLayout(15, h).words).toBeNull();
      const svg = speedSignSvg(15, h);
      expect(svg).not.toContain('SPEED');
      expect(svg).toContain('>15<');
    }
  });
  it('adds an accessible name as a title', () => {
    expect(speedSignSvg(15, 30, { title: 'Slow Street, 15 mph speed limit, on Colby Street' })).toContain('<title>Slow Street, 15 mph speed limit, on Colby Street</title>');
  });
  it('sits beside the street, on the upper side, clear of the street line', () => {
    const o = signOffset(0, 30);
    expect(o.dy).toBeLessThan(0);
    expect(Math.hypot(o.dx, o.dy)).toBeGreaterThan(15);
    expect(signOffset(Math.PI / 2, 30).dx).toBeGreaterThanOrEqual(0);
  });
});
