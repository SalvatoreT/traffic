import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { PEEK_PX, SNAP_LABELS, cycleSnap, decideSnap, snapHeights, stepSnap, type Snap } from '../lib/sheet';

const KEY = 'sheetSnap';
const DRAG_THRESHOLD = 6;

function loadSnap(): Snap {
  try { const v = localStorage.getItem(KEY); if (v === '0' || v === '1' || v === '2') return Number(v) as Snap; } catch { /* unavailable */ }
  return 0;
}

interface Drag { id: number; y0: number; h0: number; active: boolean; samples: { t: number; h: number }[] }

/** Phone bottom sheet with three snap positions, dragged from the handle, the header or (below full) the content. */
export function Sheet({ label, tabs, children }: { label: string; tabs: ReactNode; children: ReactNode }) {
  const [snap, setSnapState] = useState<Snap>(loadSnap);
  const [dragH, setDragH] = useState<number | null>(null);
  const [vh, setVh] = useState(() => window.innerHeight);
  const bodyRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const suppress = useRef(false);
  const heights = snapHeights(vh);
  const full = heights[2];

  const setSnap = useCallback((s: Snap) => {
    setSnapState(s);
    try { localStorage.setItem(KEY, String(s)); } catch { /* unavailable */ }
  }, []);

  useEffect(() => {
    const on = () => setVh(window.innerHeight);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  useEffect(() => { if (bodyRef.current) bodyRef.current.inert = snap === 0; }, [snap]);
  // The map area keeps clear of the sheet at peek and half; at full the sheet covers it anyway.
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--sheet-h', `${Math.min(heights[snap], heights[1])}px`);
    return () => { r.style.removeProperty('--sheet-h'); };
  }, [snap, vh]); // eslint-disable-line

  const height = dragH ?? heights[snap];
  const down = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { id: e.pointerId, y0: e.clientY, h0: height, active: false, samples: [{ t: e.timeStamp, h: height }] };
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = d.y0 - e.clientY;
    if (!d.active) {
      if (Math.abs(dy) < DRAG_THRESHOLD) return;
      d.active = true; suppress.current = true;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    }
    const h = Math.max(PEEK_PX, Math.min(full, d.h0 + dy));
    d.samples.push({ t: e.timeStamp, h });
    while (d.samples.length > 2 && e.timeStamp - d.samples[1].t > 100) d.samples.shift();
    setDragH(h);
  };
  const up = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.active) return;
    const a = d.samples[0], b = d.samples[d.samples.length - 1];
    const v = b.t > a.t ? (b.h - a.h) / (b.t - a.t) : 0;
    setSnap(e.type === 'pointercancel' ? decideSnap(b.h, 0, heights) : decideSnap(b.h, v, heights));
    setDragH(null);
    setTimeout(() => { suppress.current = false; }, 0);
  };
  const handlers = { onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSnap(cycleSnap(snap)); return; }
    const n = stepSnap(snap, e.key);
    if (n !== snap || ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) { e.preventDefault(); setSnap(n); }
  };

  return (
    <aside className={`sheet ${dragH !== null ? 'dragging' : ''}`} aria-label={label}
      style={{ height: full, transform: `translateY(${full - height}px)` }}>
      <div className="sheet-head" {...handlers}
        onClickCapture={(e) => {
          if (suppress.current) { e.preventDefault(); e.stopPropagation(); return; }
          if (snap === 0 && (e.target as HTMLElement).closest('[role="tab"]')) setSnap(1);
        }}>
        <div role="slider" tabIndex={0} className="sheet-handle" aria-label="Panel height" aria-orientation="vertical"
          aria-valuemin={0} aria-valuemax={2} aria-valuenow={snap} aria-valuetext={SNAP_LABELS[snap]}
          onKeyDown={onKey} onClick={() => setSnap(cycleSnap(snap))}>
          <span aria-hidden="true" className="grip" />
        </div>
        {tabs}
      </div>
      <div id="panel-body" ref={bodyRef} className={`sheet-body ${snap < 2 ? 'draggable' : ''}`} {...(snap < 2 ? handlers : {})}
        onClickCapture={(e) => { if (suppress.current) { e.preventDefault(); e.stopPropagation(); } }}
        style={{ paddingBottom: `calc(1.5rem + ${full - heights[snap]}px)` }}>
        {children}
      </div>
    </aside>
  );
}
