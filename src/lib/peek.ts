/** Peek/pin state for a collapsible bar: hover or keyboard focus expands it temporarily, the toggle pins it. */
export interface PeekState {
  pinned: boolean; hover: boolean; focus: boolean; child: boolean;
  /** Pointer has left; hover clears when the grace delay elapses. */
  leaving: boolean;
}
export type PeekAction =
  | { type: 'hoverIn' } | { type: 'hoverOut' } | { type: 'grace' }
  | { type: 'focusIn' } | { type: 'focusOut' }
  | { type: 'child'; open: boolean }
  | { type: 'toggle' } | { type: 'unpin' } | { type: 'dismiss' };

export const GRACE_MS = 250;

export const initPeek = (pinned = false): PeekState => ({ pinned, hover: false, focus: false, child: false, leaving: false });
const CLEAR = { hover: false, focus: false, child: false, leaving: false };

export function peekReducer(s: PeekState, a: PeekAction): PeekState {
  switch (a.type) {
    case 'hoverIn': return { ...s, hover: true, leaving: false };
    case 'hoverOut': return s.hover ? { ...s, leaving: true } : s;
    case 'grace': return s.leaving ? { ...s, hover: false, leaving: false } : s;
    case 'focusIn': return s.focus ? s : { ...s, focus: true };
    case 'focusOut': return s.focus ? { ...s, focus: false } : s;
    // A popover that belongs to the bar counts as inside; closing it starts the same grace delay.
    case 'child': return a.open ? { ...s, child: true, leaving: false } : { ...s, child: false, leaving: s.hover };
    case 'toggle': return s.pinned ? { ...s, ...CLEAR, pinned: false } : { ...s, pinned: true };
    case 'unpin': return { ...s, ...CLEAR, pinned: false };
    case 'dismiss': return { ...s, ...CLEAR };
  }
}

export const isOpen = (s: PeekState) => s.pinned || s.hover || s.focus || s.child;
export const isPeeking = (s: PeekState) => !s.pinned && isOpen(s);
