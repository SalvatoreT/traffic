import { useEffect, useMemo, useReducer, useState, type FocusEvent } from 'react';
import { GRACE_MS, initPeek, isOpen, isPeeking, peekReducer } from '../lib/peek';

const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

function useCanHover(): boolean {
  const [on, setOn] = useState(() => { try { return window.matchMedia(HOVER_QUERY).matches; } catch { return false; } });
  useEffect(() => {
    let mq: MediaQueryList;
    try { mq = window.matchMedia(HOVER_QUERY); } catch { return; }
    const f = () => setOn(mq.matches);
    f(); mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return on;
}

/** Hover (fine pointers only) and keyboard focus peek a collapsed bar open; the toggle pins it. */
export function usePeek(initialPinned = false) {
  const [s, dispatch] = useReducer(peekReducer, initialPinned, initPeek);
  const canHover = useCanHover();
  useEffect(() => {
    if (!s.leaving) return;
    const t = setTimeout(() => dispatch({ type: 'grace' }), GRACE_MS);
    return () => clearTimeout(t);
  }, [s.leaving]);
  const handlers = useMemo(() => ({
    onMouseEnter: canHover ? () => dispatch({ type: 'hoverIn' }) : undefined,
    onMouseLeave: canHover ? () => dispatch({ type: 'hoverOut' }) : undefined,
    // Only keyboard focus peeks; a tap or click on a control inside must not.
    onFocus: (e: FocusEvent<HTMLElement>) => { if (e.target.matches(':focus-visible')) dispatch({ type: 'focusIn' }); },
    onBlur: (e: FocusEvent<HTMLElement>) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) dispatch({ type: 'focusOut' }); },
  }), [canHover]);
  return { state: s, dispatch, open: isOpen(s), peeking: isPeeking(s), pinned: s.pinned, handlers };
}
