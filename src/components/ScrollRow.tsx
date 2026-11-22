import { useEffect, useRef, type HTMLAttributes } from 'react';
import { centeredScroll, moreSides } from '../lib/overflow';

/**
 * A nav row that scrolls sideways when it does not fit. The wrapper's `data-more` says which edges hide more tabs, and its edge fades
 * and arrows (styles.css) show only on those edges. `current` is the active tab's key: when it changes, that tab is scrolled to the middle.
 */
export function ScrollRow({ current, ...props }: HTMLAttributes<HTMLElement> & { current?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = nav.current, box = wrap.current;
    if (!el || !box) return;
    const set = () => { box.dataset.more = moreSides(el.scrollLeft, el.clientWidth, el.scrollWidth); };
    set();
    el.addEventListener('scroll', set, { passive: true });
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', set); ro.disconnect(); };
  }, []);
  useEffect(() => {
    const el = nav.current;
    const item = el?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el || !item) return;
    el.scrollLeft = centeredScroll(item.offsetLeft - el.offsetLeft, item.offsetWidth, el.clientWidth, el.scrollWidth);
  }, [current]);
  return <div ref={wrap} className="navwrap" data-more="none"><nav ref={nav} {...props} /></div>;
}
