import { describe, expect, it } from 'vitest';
import { advance, elapsedSim, MAX_EXTRAPOLATION_S } from './extrapolate';

describe('elapsedSim', () => {
  it('scales wall time by the rate', () => {
    expect(elapsedSim(1100, 1000, 1)).toBeCloseTo(0.1);
    expect(elapsedSim(1050, 1000, 2)).toBeCloseTo(0.1);
  });
  it('clamps to one step', () => {
    expect(elapsedSim(5000, 1000, 1)).toBe(MAX_EXTRAPOLATION_S);
    expect(elapsedSim(1200, 1000, 5)).toBe(MAX_EXTRAPOLATION_S);
  });
  it('is zero when paused or the frame is in the future', () => {
    expect(elapsedSim(2000, 1000, 0)).toBe(0);
    expect(elapsedSim(900, 1000, 1)).toBe(0);
  });
});

describe('advance', () => {
  it('moves along the heading and keeps other fields', () => {
    const src = new Float32Array([10, 20, Math.PI / 2, 8, 1, 3, 0, 0, 0, 5, 2, 0]);
    const dst = new Float32Array(src.length);
    advance(src, dst, 0.25);
    expect(dst[0]).toBeCloseTo(10, 4);
    expect(dst[1]).toBeCloseTo(22, 4);
    expect(Array.from(dst.slice(2, 6))).toEqual(Array.from(src.slice(2, 6)));
    expect(dst[6]).toBeCloseTo(1.25, 4);
    expect(dst[7]).toBeCloseTo(0, 4);
  });
  it('is a copy at dt = 0', () => {
    const src = new Float32Array([1, 2, 0.3, 4, 0, 0]);
    const dst = new Float32Array(6);
    advance(src, dst, 0);
    expect(Array.from(dst)).toEqual(Array.from(src));
  });
});
