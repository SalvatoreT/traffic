import { describe, expect, it } from 'vitest';
import { PEEK_PX, cycleSnap, decideSnap, fitSheetRect, nearestSnap, snapHeights, stepSnap } from './sheet';

const H = snapHeights(800); // 96, 400, 720
describe('bottom sheet snapping', () => {
  it('computes heights', () => { expect(H).toEqual([96, 400, 720]); });
  it('snaps to the nearest position when slow', () => {
    expect(decideSnap(200, 0.1, H)).toBe(0);
    expect(decideSnap(300, -0.2, H)).toBe(1);
    expect(decideSnap(600, 0, H)).toBe(2);
    expect(nearestSnap(580, H)).toBe(2);
  });
  it('flick goes to the next position in its direction', () => {
    expect(decideSnap(110, 0.9, H)).toBe(1);
    expect(decideSnap(410, 0.9, H)).toBe(2);
    expect(decideSnap(400, -0.9, H)).toBe(0);
    expect(decideSnap(700, -0.9, H)).toBe(1);
  });
  it('flick past the nearest position uses it', () => {
    expect(decideSnap(300, 0.9, H)).toBe(1);
    expect(decideSnap(200, -0.9, H)).toBe(0);
  });
  it('clamps at the ends', () => {
    expect(decideSnap(720, 2, H)).toBe(2);
    expect(decideSnap(96, -2, H)).toBe(0);
  });
  it('keys and cycling', () => {
    expect(stepSnap(0, 'ArrowUp')).toBe(1);
    expect(stepSnap(0, 'ArrowDown')).toBe(0);
    expect(stepSnap(1, 'End')).toBe(2);
    expect(stepSnap(2, 'Home')).toBe(0);
    expect(cycleSnap(2)).toBe(0);
  });
});

describe('fitSheetRect', () => {
  it('always covers the collapsed height', () => {
    expect(fitSheetRect(0, 390, 844)).toEqual({ left: 0, right: 390, top: 844 - PEEK_PX, bottom: 844 });
  });
});
