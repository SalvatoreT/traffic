import { useEffect, useRef, type HTMLAttributes } from 'react';

/** A nav row that scrolls sideways when it does not fit; `data-more` says which edges hide more, for the edge fade. */
export function ScrollRow(props: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => {
      const start = el.scrollLeft > 1, end = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      el.dataset.more = start && end ? 'both' : start ? 'start' : end ? 'end' : 'none';
    };
    set();
    el.addEventListener('scroll', set, { passive: true });
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', set); ro.disconnect(); };
  }, []);
  return <nav ref={ref} {...props} />;
}
