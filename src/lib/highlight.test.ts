import { describe, expect, it, vi } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildIndex } from './naming';
import { hoverHandlers, hoverTargets, sameHover, type Hover } from './highlight';
import { listDismissed, listOpen } from './picker';

const idx = buildIndex(buildFixture().network);

describe('hover highlight plumbing', () => {
  it('maps a block to its links and a node to a ring, nothing for null', () => {
    expect(hoverTargets(idx, { kind: 'block', block: 0 })).toEqual({ links: idx.blocks[0].links, node: null });
    expect(hoverTargets(idx, { kind: 'node', node: idx.intersections[0] })).toEqual({ links: [], node: idx.intersections[0] });
    expect(hoverTargets(idx, null)).toEqual({ links: [], node: null });
  });
  it('sets on pointer enter or focus and clears on leave or blur', () => {
    const set = vi.fn<(h: Hover | null) => void>();
    const h: Hover = { kind: 'block', block: 2 };
    const hs = hoverHandlers(set, h);
    hs.onMouseEnter(); hs.onMouseLeave(); hs.onFocus(); hs.onBlur();
    expect(set.mock.calls).toEqual([[h], [null], [h], [null]]);
  });
  it('compares highlights by kind and id', () => {
    expect(sameHover({ kind: 'block', block: 1 }, { kind: 'block', block: 1 })).toBe(true);
    expect(sameHover({ kind: 'block', block: 1 }, { kind: 'node', node: 1 })).toBe(false);
    expect(sameHover(null, null)).toBe(true);
  });
});

describe('search result list persistence', () => {
  it('survives focus and blur and closes only on Escape or choosing', () => {
    let d = false;
    d = listDismissed(d, 'type');
    expect(listOpen('oak', d, 5)).toBe(true);
    d = listDismissed(d, 'blur');
    expect(listOpen('oak', d, 5)).toBe(true);
    d = listDismissed(d, 'focus');
    expect(listOpen('oak', d, 5)).toBe(true);
    expect(listOpen('oak', listDismissed(d, 'escape'), 5)).toBe(false);
    expect(listOpen('oak', listDismissed(d, 'choose'), 5)).toBe(false);
  });
  it('reopens on typing, and is closed for an empty query or no results', () => {
    expect(listOpen('oak', listDismissed(true, 'type'), 5)).toBe(true);
    expect(listOpen('  ', false, 5)).toBe(false);
    expect(listOpen('zzz', false, 0)).toBe(false);
  });
});
