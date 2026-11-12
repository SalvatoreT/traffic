import { describe, expect, it } from 'vitest';
import { decodeGeohash, encodeGeohash, isGeohash } from './geohash';

const metersApart = (a: [number, number], b: [number, number]) => {
  const k = 111320;
  return Math.hypot((a[0] - b[0]) * k, (a[1] - b[1]) * k * Math.cos((a[0] * Math.PI) / 180));
};

describe('geohash', () => {
  it('matches known vectors', () => {
    expect(encodeGeohash(57.64911, 10.40744, 11)).toBe('u4pruydqqvj');
    const d = decodeGeohash('ezs42')!;
    expect(d.lat).toBeCloseTo(42.6, 1);
    expect(d.lon).toBeCloseTo(-5.6, 1);
    expect(encodeGeohash(42.6, -5.6, 5)).toBe('ezs42');
  });
  it('round-trips within 1 m at 10 characters', () => {
    for (let i = 0; i < 200; i++) {
      const lat = 37.83 + (i % 17) * 0.0007, lon = -122.26 - ((i * 7) % 23) * 0.0006;
      const d = decodeGeohash(encodeGeohash(lat, lon))!;
      expect(metersApart([lat, lon], [d.lat, d.lon])).toBeLessThan(1);
    }
  });
  it('rejects invalid strings', () => {
    expect(decodeGeohash('')).toBeNull();
    expect(decodeGeohash('ezs4a')).toBeNull();
    expect(isGeohash('9q9p3y')).toBe(true);
    expect(isGeohash('a')).toBe(false);
  });
});
