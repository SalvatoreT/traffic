import { useEffect, useState } from 'react';

/** True once the element nears the screen: a map is a few hundred SVG paths, and a proposals file can hold dozens of cards. */
export function useNear(ref: React.RefObject<Element | null>): boolean {
  const [near, setNear] = useState(typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    const el = ref.current;
    if (near || !el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); } }, { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [near, ref]);
  return near;
}
