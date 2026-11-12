import { describe, expect, it } from 'vitest';
import { initPeek, isOpen, isPeeking, peekReducer as r, type PeekAction, type PeekState } from './peek';

const run = (s: PeekState, ...a: PeekAction[]) => a.reduce(r, s);

describe('peek and pin', () => {
  it('starts collapsed', () => expect(isOpen(initPeek())).toBe(false));
  it('hover in opens as a peek', () => {
    const s = run(initPeek(), { type: 'hoverIn' });
    expect(isOpen(s)).toBe(true); expect(isPeeking(s)).toBe(true); expect(s.pinned).toBe(false);
  });
  it('hover out waits for the grace delay', () => {
    const s = run(initPeek(), { type: 'hoverIn' }, { type: 'hoverOut' });
    expect(isOpen(s)).toBe(true);
    expect(isOpen(r(s, { type: 'grace' }))).toBe(false);
  });
  it('re-entering during grace cancels the collapse', () => {
    const s = run(initPeek(), { type: 'hoverIn' }, { type: 'hoverOut' }, { type: 'hoverIn' }, { type: 'grace' });
    expect(isOpen(s)).toBe(true);
  });
  it('a stray grace tick does nothing', () => expect(run(initPeek(), { type: 'grace' })).toEqual(initPeek()));
  it('focus in opens and focus out closes', () => {
    const s = run(initPeek(), { type: 'focusIn' });
    expect(isPeeking(s)).toBe(true);
    expect(isOpen(r(s, { type: 'focusOut' }))).toBe(false);
  });
  it('pin keeps it open after hover and focus end', () => {
    const s = run(initPeek(), { type: 'hoverIn' }, { type: 'toggle' }, { type: 'hoverOut' }, { type: 'grace' }, { type: 'focusIn' }, { type: 'focusOut' });
    expect(s.pinned).toBe(true); expect(isOpen(s)).toBe(true); expect(isPeeking(s)).toBe(false);
  });
  it('unpin collapses even while hovered or focused', () => {
    const s = run(initPeek(true), { type: 'hoverIn' }, { type: 'focusIn' }, { type: 'toggle' });
    expect(s.pinned).toBe(false); expect(isOpen(s)).toBe(false);
  });
  it('a peek does not change the pinned preference', () => {
    expect(run(initPeek(), { type: 'hoverIn' }, { type: 'hoverOut' }, { type: 'grace' }).pinned).toBe(false);
    expect(run(initPeek(true), { type: 'hoverIn' }, { type: 'hoverOut' }, { type: 'grace' }).pinned).toBe(true);
  });
  it('an open child popover keeps the bar open after the pointer leaves', () => {
    const s = run(initPeek(), { type: 'hoverIn' }, { type: 'child', open: true }, { type: 'hoverOut' }, { type: 'grace' });
    expect(isOpen(s)).toBe(true);
    const closed = r(s, { type: 'child', open: false });
    expect(isOpen(closed)).toBe(false);
  });
  it('closing a child while still hovered starts the grace delay', () => {
    const s = run(initPeek(), { type: 'hoverIn' }, { type: 'child', open: true }, { type: 'child', open: false });
    expect(isOpen(s)).toBe(true);
    expect(isOpen(r(s, { type: 'grace' }))).toBe(false);
  });
  it('dismiss closes a peek but keeps a pin', () => {
    expect(isOpen(run(initPeek(), { type: 'hoverIn' }, { type: 'dismiss' }))).toBe(false);
    expect(isOpen(run(initPeek(true), { type: 'dismiss' }))).toBe(true);
  });
  it('unpin (outside interaction) collapses a pinned bar', () => {
    expect(isOpen(run(initPeek(), { type: 'toggle' }, { type: 'unpin' }))).toBe(false);
  });
});
