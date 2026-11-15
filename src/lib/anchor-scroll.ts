/**
 * Brings the element with this id to the top of its scroller once it exists, and moves focus to it. Sections render lazily and after data
 * loads, so it waits for the element, and it scrolls again while the page above it is still changing. Any input from the person stops it.
 * Returns a function that cancels it.
 */
export function scrollToAnchor(id: string, reduced: boolean, opts: { waitMs?: number; settleMs?: number } = {}): () => void {
  const waitMs = opts.waitMs ?? 20000, settleMs = opts.settleMs ?? 6000;
  let stopped = false, found = false;
  let settle = 0;
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
  const el = () => { const e = document.getElementById(id); return e?.isConnected ? e : null; };
  const place = (b: ScrollBehavior) => {
    const e = el();
    if (!e) return false;
    e.scrollIntoView({ block: 'start', behavior: b });
    return true;
  };
  const stop = () => { stopped = true; mo.disconnect(); window.clearTimeout(giveUp); window.clearTimeout(settle); for (const t of INPUTS) window.removeEventListener(t, stop, true); };
  const INPUTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
  const mo = new MutationObserver(() => {
    if (stopped) return;
    if (!found) {
      if (!place(behavior)) return;
      found = true;
      const e = el()!;
      e.tabIndex = -1;
      e.focus({ preventScroll: true });
      window.setTimeout(stop, settleMs);
      return;
    }
    window.clearTimeout(settle);
    settle = window.setTimeout(() => { if (!stopped) place('auto'); }, 200);
  });
  const giveUp = window.setTimeout(stop, waitMs);
  for (const t of INPUTS) window.addEventListener(t, stop, { capture: true, passive: true });
  mo.observe(document.body, { childList: true, subtree: true });
  if (place(behavior)) {
    found = true;
    const e = el()!;
    e.tabIndex = -1;
    e.focus({ preventScroll: true });
    window.setTimeout(stop, settleMs);
  }
  return stop;
}
