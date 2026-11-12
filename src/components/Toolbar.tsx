import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { AreaBundle, ModeKey, ModeVisibility, Overlay } from '../types';
import { formatClock } from '../lib/format';
import { rampStops, type Mode } from '../lib/ramps';
import { speedNoteText } from '../lib/speed';

export const SPEEDS = [1, 5, 20, 60];

interface PlaybackProps {
  running: boolean; onToggle(): void; onReset(): void;
  speed: number; onSpeed(s: number): void;
  periods: AreaBundle['demand']['periods']; period: string; onPeriod(id: string): void;
  scale: number; onScale(v: number): void; time: number; reducedMotion: boolean;
  /** Achieved speed to report when the sim runs well below the requested one; null otherwise. */
  achieved?: number | null;
}

function initialCompact(): boolean {
  try { const v = localStorage.getItem('toolbarCompact'); if (v === '1' || v === '0') return v === '1'; } catch { /* unavailable */ }
  try { return window.matchMedia('(max-width: 1099.98px)').matches; } catch { return false; }
}

/** Closes a popup on Escape or when focus or a press lands outside it. */
function useDismiss(open: boolean, close: () => void, root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const out = (e: Event) => { if (root.current && !root.current.contains(e.target as Node)) close(); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); close(); } };
    document.addEventListener('pointerdown', out, true);
    document.addEventListener('focusin', out, true);
    root.current?.addEventListener('keydown', key);
    const el = root.current;
    return () => { document.removeEventListener('pointerdown', out, true); document.removeEventListener('focusin', out, true); el?.removeEventListener('keydown', key); };
  }, [open, close, root]);
}

const Chevron = ({ up }: { up?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={up ? 'M2 8l4-4 4 4' : 'M2 4l4 4 4-4'} />
  </svg>
);

export function Playback(p: PlaybackProps) {
  const [compact, setCompactState] = useState(initialCompact);
  const setCompact = (v: boolean) => { setCompactState(v); try { localStorage.setItem('toolbarCompact', v ? '1' : '0'); } catch { /* unavailable */ } };
  const [more, setMore] = useState(false);
  const [speedMenu, setSpeedMenu] = useState(false);
  const moreRoot = useRef<HTMLDivElement>(null);
  const speedRoot = useRef<HTMLDivElement>(null);
  const closeMore = useCallback(() => setMore(false), []);
  const closeSpeed = useCallback(() => setSpeedMenu(false), []);
  useDismiss(more && compact, closeMore, moreRoot);
  useDismiss(speedMenu, closeSpeed, speedRoot);
  const moreId = useId(), speedId = useId();
  const note = speedNoteText(p.speed, p.achieved ?? null);
  const periodSelect = (
    <label className="inline">Period
      <select value={p.period} onChange={(e) => p.onPeriod(e.target.value)}>
        {p.periods.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
      </select>
    </label>
  );
  const demand = (
    <label className="inline">Demand <output>{Math.round(p.scale * 100)}%</output>
      <input type="range" min={0.5} max={1.5} step={0.05} value={p.scale} onChange={(e) => p.onScale(Number(e.target.value))} aria-valuetext={`${Math.round(p.scale * 100)} percent of estimated demand`} />
    </label>
  );
  const playLabel = p.running ? 'Pause simulation' : 'Play simulation';

  if (compact) {
    return (
      <div className="toolbar compact" role="group" aria-label="Simulation playback">
        <button type="button" className="btn primary icon-btn" onClick={p.onToggle} aria-label={playLabel} title={playLabel}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">{p.running ? <path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" /> : <path d="M4 2l10 6-10 6z" />}</svg>
        </button>
        <div className="pb-pop-wrap" ref={speedRoot}>
          <button type="button" className="btn speed-btn" aria-expanded={speedMenu} aria-controls={speedId} aria-label={`Simulation speed ${p.speed} times`} title="Simulation speed" onClick={() => setSpeedMenu((o) => !o)}>
            {p.speed}× <Chevron up={speedMenu} />
          </button>
          <div id={speedId} className={`pb-menu ${speedMenu ? 'open' : ''}`} inert={!speedMenu} role="group" aria-label="Simulation speed">
            {SPEEDS.map((s) => (
              <button key={s} type="button" className={`pb-menu-item ${p.speed === s ? 'on' : ''}`} aria-pressed={p.speed === s}
                onClick={() => { p.onSpeed(s); setSpeedMenu(false); (speedRoot.current?.querySelector('.speed-btn') as HTMLElement | null)?.focus(); }}>{s}×</button>
            ))}
          </div>
        </div>
        <span className="clock" aria-label={`Simulated time ${formatClock(p.time)}`}><span aria-hidden="true">⏱</span> {formatClock(p.time)}</span>
        <span className="speed-note small" role="status">{note}</span>
        <div className="pb-pop-wrap more-wrap" ref={moreRoot}>
          <button type="button" className="btn more-btn" aria-expanded={more} aria-controls={moreId} onClick={() => setMore((m) => !m)}>
            More <Chevron up={more} />
          </button>
          <div id={moreId} className={`pb-more ${more ? 'open' : ''}`} inert={!more}>
            <div className="pb-more-in">
              {periodSelect}
              {demand}
              <div className="pb-more-actions">
                <button type="button" className="btn" onClick={p.onReset}>Reset</button>
                <button type="button" className="btn" onClick={() => { setMore(false); setCompact(false); }}>Show full controls</button>
              </div>
            </div>
          </div>
        </div>
        {p.reducedMotion && <span className="muted small pb-rm">Paused at start (reduced motion preference).</span>}
      </div>
    );
  }
  return (
    <div className="toolbar" role="group" aria-label="Simulation playback">
      <button type="button" className="btn primary" onClick={p.onToggle} aria-label={playLabel}>
        <span aria-hidden="true">{p.running ? '❚❚' : '▶'}</span> {p.running ? 'Pause' : 'Play'}
      </button>
      <button type="button" className="btn" onClick={p.onReset}>Reset</button>
      <div className="seg" role="group" aria-label="Simulation speed">
        {SPEEDS.map((s) => (
          <button key={s} type="button" className={p.speed === s ? 'on' : ''} aria-pressed={p.speed === s} onClick={() => p.onSpeed(s)}>{s}×</button>
        ))}
      </div>
      <span className="speed-note small" role="status">{note}</span>
      {periodSelect}
      {demand}
      <span className="clock" aria-label={`Simulated time ${formatClock(p.time)}`}><span aria-hidden="true">⏱</span> {formatClock(p.time)}</span>
      <button type="button" className="btn icon-btn" aria-label="Collapse playback controls" title="Collapse playback controls" onClick={() => setCompact(true)}><Chevron up /></button>
      {p.reducedMotion && <span className="muted small">Paused at start (reduced motion preference).</span>}
    </div>
  );
}

interface LegendProps {
  overlay: Overlay; onOverlay(o: Overlay): void; max: number; mode: Mode;
  source: 'scenario' | 'baseline'; onSource(s: 'scenario' | 'baseline'): void; canCompare: boolean;
  /** False when the sim build has no multimodal agents: only the car key is shown then. */
  multimodal: boolean;
  modes: ModeVisibility; onModes(m: ModeVisibility): void;
  hasBikeNet: boolean; bikeNet: boolean; onBikeNet(v: boolean): void;
}

const MODE_KEYS: { id: ModeKey; label: string }[] = [
  { id: 'car', label: 'Cars' }, { id: 'bus', label: 'Buses' }, { id: 'bicycle', label: 'Bikes' }, { id: 'pedestrian', label: 'People walking' },
];
function ModeSymbol({ id }: { id: ModeKey }) {
  const c = `var(--${id === 'car' ? 'veh' : id === 'bus' ? 'bus' : id === 'bicycle' ? 'bike' : 'ped'})`;
  switch (id) {
    case 'car': return <svg width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="4.5" fill={c} stroke="var(--veh-ring)" /></svg>;
    case 'bus': return <svg width="22" height="16" aria-hidden="true"><rect x="1.5" y="4" width="19" height="8" rx="3" fill={c} stroke="var(--veh-ring)" strokeWidth="1.2" /></svg>;
    case 'bicycle': return <svg width="16" height="16" aria-hidden="true"><path d="M8 2 L14 12.5 L2 12.5Z" fill={c} stroke="var(--veh-ring)" strokeLinejoin="round" /></svg>;
    case 'pedestrian': return <svg width="16" height="16" aria-hidden="true"><rect x="4.5" y="4.5" width="7" height="7" fill={c} stroke="var(--veh-ring)" /></svg>;
  }
}

const OVERLAYS: { id: Overlay; label: string }[] = [
  { id: 'cutthrough', label: 'Cut-through' }, { id: 'speed', label: 'Speed' }, { id: 'flow', label: 'Flow' },
];

/** Docked legend row along the bottom of the map. Collapsed it names the metric and shows the ramp ends; expanded it adds layers and symbols. */
export function Legend(p: LegendProps) {
  const [open, setOpen] = useState(false);
  const [tipOn, setTipOn] = useState(false);
  const [hush, setHush] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const extraId = useId(), tipId = useId();
  const stops = rampStops(p.mode);
  const grad = `linear-gradient(to right, ${stops.join(', ')})`;
  const ticks = p.overlay === 'speed'
    ? ['100%', '75%', '50%', '25%', '0%']
    : [0, 0.25, 0.5, 0.75, 1].map((f) => (p.max < 8 ? String(Math.round(p.max * f * 100) / 100) : String(Math.round(p.max * f))));
  const name = p.overlay === 'speed' ? 'Speed, % of limit' : p.overlay === 'flow' ? 'Flow, veh/h' : 'Cut-through, veh/h';
  const help = `${p.overlay === 'speed' ? 'Slower is darker and wider (more congested).' : 'Higher is a wider line.'} Thin gray lines carry no vehicles.`;

  // Keep the map's attribution just above the row, whatever its height.
  useEffect(() => {
    const el = root.current, host = el?.parentElement;
    if (!el || !host) return;
    const set = () => host.style.setProperty('--legend-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => { ro.disconnect(); host.style.removeProperty('--legend-h'); };
  }, []);
  // Interacting with anything else folds the legend back to its row.
  useEffect(() => {
    if (!open) return;
    const out = (e: Event) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    const evts = ['pointerdown', 'focusin', 'wheel'] as const;
    evts.forEach((n) => document.addEventListener(n, out, { capture: true, passive: true }));
    return () => evts.forEach((n) => document.removeEventListener(n, out, { capture: true }));
  }, [open]);

  const tipShown = tipOn;
  return (
    <div ref={root} className={`legend ${open ? 'open' : ''}`} role="group" aria-label="Map legend"
      onKeyDown={(e) => {
        if (e.key !== 'Escape') return;
        if (tipOn || document.querySelector('.legend-tip-wrap:hover, .legend-tip-wrap:focus-within')) { e.stopPropagation(); setTipOn(false); setHush(true); }
        else if (open) { e.stopPropagation(); setOpen(false); (root.current?.querySelector('.legend-toggle') as HTMLElement | null)?.focus(); }
      }}>
      <div id={extraId} className={`legend-extras ${open ? 'open' : ''}`} inert={!open}>
        <div className="legend-extras-in">
          <div className="legend-line">
            <div className="seg" role="group" aria-label="Map overlay">
              {OVERLAYS.map((o) => (
                <button key={o.id} type="button" className={p.overlay === o.id ? 'on' : ''} aria-pressed={p.overlay === o.id} onClick={() => p.onOverlay(o.id)}>{o.label}</button>
              ))}
            </div>
            {p.canCompare && (
              <div className="seg" role="group" aria-label="Overlay source">
                {(['scenario', 'baseline'] as const).map((s) => (
                  <button key={s} type="button" className={p.source === s ? 'on' : ''} aria-pressed={p.source === s} onClick={() => p.onSource(s)}>{s === 'scenario' ? 'Scenario' : 'Baseline'}</button>
                ))}
              </div>
            )}
          </div>
          <div className="modes" role="group" aria-labelledby={`${tipId}-m`}>
            <span className="modes-label" id={`${tipId}-m`}>Show on map</span>
            {MODE_KEYS.filter((m) => p.multimodal || m.id === 'car').map((m) => (
              <label key={m.id} className={`check mode ${p.modes[m.id] ? '' : 'off'}`}>
                <input type="checkbox" checked={p.modes[m.id]} onChange={(e) => p.onModes({ ...p.modes, [m.id]: e.target.checked })} />
                <ModeSymbol id={m.id} /> {m.label}
              </label>
            ))}
            {p.multimodal && p.hasBikeNet && (
              <label className="check mode">
                <input type="checkbox" checked={p.bikeNet} onChange={(e) => p.onBikeNet(e.target.checked)} />
                <svg width="22" height="16" aria-hidden="true"><line x1="1" y1="8" x2="21" y2="8" stroke="var(--bike)" strokeWidth="4" strokeDasharray="5 3" /></svg> Bike network
              </label>
            )}
          </div>
          <ul className="keys" aria-label="Map symbols">
            {p.multimodal && <li><svg width="14" height="14" aria-hidden="true"><rect x="2" y="2" width="10" height="10" rx="2" fill="var(--surface)" stroke="var(--bus)" strokeWidth="2" /></svg> Bus stop</li>}
            {p.multimodal && <li><svg width="14" height="14" aria-hidden="true"><line x1="7" y1="1" x2="7" y2="13" stroke="var(--text)" strokeWidth="2" /></svg> Crossing (zoomed in)</li>}
            <li><svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="var(--surface)" stroke="#1f9d55" strokeWidth="2" /></svg> Signal green (ring)</li>
            <li><svg width="14" height="14" aria-hidden="true"><path d="M7 1 L13 12 L1 12Z" fill="#f5c400" stroke="var(--text)" /></svg> Yellow (triangle)</li>
            <li><svg width="14" height="14" aria-hidden="true"><rect x="2" y="2" width="10" height="10" fill="#d62728" stroke="var(--text)" /></svg> Red (square)</li>
          </ul>
        </div>
      </div>
      <div className="legend-row">
        <div className="legend-name">
          <span className="legend-title" id={`${tipId}-n`}>{name}</span>
          <span className={`legend-tip-wrap ${hush ? 'hush' : ''}`} onMouseLeave={() => { setHush(false); setTipOn(false); }} onBlur={() => { setHush(false); setTipOn(false); }}>
            <button type="button" className="legend-info" aria-label="About this legend" aria-describedby={tipId} aria-expanded={tipShown} onClick={() => { setHush(false); setTipOn((o) => !o); }}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="6" /><path d="M7 6.2v3.8M7 3.8v.1" strokeLinecap="round" /></svg>
            </button>
            <span id={tipId} role="tooltip" className={`legend-tip ${tipOn ? 'on' : ''}`}>{help}</span>
          </span>
        </div>
        <div className="legend-ramp" role="img" aria-label={`${name}: from ${ticks[0]} to ${ticks[4]}`}>
          <span className="ramp-end">{ticks[0]}</span>
          <div className="ramp-col">
            <div className="ramp-bar" style={{ background: grad }} />
            <div className={`ramp-mid ${open ? 'open' : ''}`} aria-hidden="true"><div className="ramp-mid-in"><div className="ramp-mid-pad">{[1, 2, 3].map((i) => <span key={i} style={{ left: `${i * 25}%` }}>{ticks[i]}</span>)}</div></div></div>
          </div>
          <span className="ramp-end">{ticks[4]}</span>
        </div>
        <button type="button" className="btn legend-toggle icon-btn" aria-expanded={open} aria-controls={extraId} aria-label="Legend and layers" title="Legend and layers" onClick={() => setOpen((o) => !o)}>
          <Chevron up={open} />
        </button>
      </div>
    </div>
  );
}
