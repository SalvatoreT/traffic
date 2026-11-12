import { describe, expect, it } from 'vitest';
import { rovingTarget, tabStop } from './roving';

describe('rovingTarget', () => {
  it('moves one row and stops at the ends', () => {
    expect(rovingTarget('ArrowDown', 2, 5)).toBe(3);
    expect(rovingTarget('ArrowDown', 4, 5)).toBe(4);
    expect(rovingTarget('ArrowUp', 0, 5)).toBe(0);
    expect(rovingTarget('ArrowUp', 3, 5)).toBe(2);
  });
  it('jumps by page, to the start and to the end', () => {
    expect(rovingTarget('PageDown', 2, 50)).toBe(12);
    expect(rovingTarget('PageDown', 45, 50)).toBe(49);
    expect(rovingTarget('PageUp', 4, 50)).toBe(0);
    expect(rovingTarget('Home', 30, 50)).toBe(0);
    expect(rovingTarget('End', 3, 50)).toBe(49);
  });
  it('ignores other keys and empty lists', () => {
    expect(rovingTarget('a', 1, 5)).toBeNull();
    expect(rovingTarget('Tab', 1, 5)).toBeNull();
    expect(rovingTarget('ArrowDown', 0, 0)).toBeNull();
  });
});

describe('tabStop', () => {
  it('keeps the remembered row while it is listed', () => {
    expect(tabStop([4, 7, 9], 7)).toBe(7);
  });
  it('falls back to the first row when it is gone or never set', () => {
    expect(tabStop([4, 7, 9], 3)).toBe(4);
    expect(tabStop([4, 7, 9], null)).toBe(4);
    expect(tabStop([], 3)).toBeNull();
  });
});
