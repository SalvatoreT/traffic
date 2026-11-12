import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface MenuItem { id: string; label: string; onSelect(): void }

const MARGIN = 8;

/** Pop-up menu at a screen point. Arrow keys, Home and End move; Escape, Tab or an outside press close it; focus goes back to where it was. */
export function MapMenu({ at, label, items, onClose }: { at: { x: number; y: number }; label: string; items: MenuItem[]; onClose(): void }) {
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null));
  const [pos, setPos] = useState(at);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: Math.max(MARGIN, Math.min(at.x, window.innerWidth - r.width - MARGIN)), y: Math.max(MARGIN, Math.min(at.y, window.innerHeight - r.height - MARGIN)) });
    el.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [at]);
  const close = (restore: boolean) => {
    onClose();
    if (restore) opener.current?.focus?.();
  };
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const out = (e: Event) => { if (root.current && !root.current.contains(e.target as Node)) closeRef.current(false); };
    document.addEventListener('pointerdown', out, true);
    window.addEventListener('blur', () => closeRef.current(false), { once: true });
    return () => document.removeEventListener('pointerdown', out, true);
  }, []);
  const onKey = (e: React.KeyboardEvent) => {
    const els = Array.from(root.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const i = els.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => { e.preventDefault(); els[(n + els.length) % els.length]?.focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(els.length - 1);
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
    else if (e.key === 'Tab') { e.preventDefault(); close(true); }
  };
  return (
    <div ref={root} className="map-menu" role="menu" aria-label={label} style={{ left: pos.x, top: pos.y }} onKeyDown={onKey}>
      {items.map((it) => (
        <button key={it.id} type="button" role="menuitem" tabIndex={-1} className="map-menu-item" onClick={() => { close(true); it.onSelect(); }}>{it.label}</button>
      ))}
    </div>
  );
}
