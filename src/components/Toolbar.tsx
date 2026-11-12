import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { AreaBundle, AreaEntry, ModeKey, ModeVisibility, Overlay } from '../types';
import { formatClock } from '../lib/format';
import { divergingGradient, rampStops, rampTicks, TOP_NOTE, type Mode } from '../lib/ramps';
import { changeLabel, changeTicks, CHANGE_UNIT, DEAD_BAND, type MapView } from '../lib/change';
import { EXPERIMENTAL_NOTE, isExperimentalPeriod, RUN_SECONDS } from '../lib/run';
import { speedNoteText } from '../lib/speed';
import { usePeek } from './usePeek';

export const SPEEDS = [1, 5, 20, 60];

interface PlaybackProps {
  running: boolean; finished: boolean; entry: Pick<AreaEntry, 'experimentalPeriods' | 'calibration'>; onToggle(): void; onReset(): void;
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
  const peek = usePeek(!initialCompact());
  const { open, pinned, dispatch } = peek;
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    try { localStorage.setItem('toolbarCompact', pinned ? '0' : '1'); } catch { /* unavailable */ }
  }, [pinned]);
  const [speedMenu, setSpeedMenu] = useState(false);
  const speedRoot = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const closeSpeed = useCallback(() => setSpeedMenu(false), []);
  useDismiss(speedMenu, closeSpeed, speedRoot);
  useEffect(() => { dispatch({ type: 'child', open: speedMenu }); }, [speedMenu, dispatch]);
  const speedId = useId(), extraId = useId();
  const note = speedNoteText(p.speed, p.achieved ?? null);
  // The collapsed row's height is what the layout reserves; the extras overlay the map when peeking.
  useEffect(() => {
    const el = row.current, host = slot.current;
    if (!el || !host) return;
    const set = () => host.style.setProperty('--bar-row-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const playLabel = p.finished ? 'Run again' : p.running ? 'Pause simulation' : 'Play simulation';
  const shownTime = Math.min(RUN_SECONDS, p.time);
  const progressText = `${formatClock(shownTime)} of ${formatClock(RUN_SECONDS)}`;
  const experimental = isExperimentalPeriod(p.entry, p.period);

  return (
    <div className="bar-slot" ref={slot}>
      <div className={`toolbar ${open ? 'open' : ''} ${pinned ? 'pinned' : ''}`} role="group" aria-label="Simulation playback" {...peek.handlers}
        onKeyDown={(e) => { if (e.key === 'Escape' && !pinned && !speedMenu && open) { e.stopPropagation(); dispatch({ type: 'dismiss' }); } }}>
        <div className="toolbar-row" ref={row}>
          <button type="button" className="btn bar-toggle icon-btn" aria-expanded={open} aria-controls={extraId} aria-label="Playback controls" title="Playback controls" onClick={() => dispatch({ type: 'toggle' })}>
            <Chevron up={open} />
          </button>
          <button type="button" className={`btn primary ${p.finished ? 'again' : 'icon-btn'}`} onClick={p.onToggle} aria-label={playLabel} title={playLabel}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
              {p.finished ? <path d="M8 2a6 6 0 1 0 5.7 7.9l-1.9-.6A4 4 0 1 1 8 4v2.5l4-3.3L8 0z" /> : p.running ? <path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" /> : <path d="M4 2l10 6-10 6z" />}
            </svg>
            {p.finished && <span>Run again</span>}
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
          <span className="speed-note small" role="status">{note}</span>
          <span className="clock">
            <span className="sr-only">Simulated time {progressText}</span>
            <span aria-hidden="true">{formatClock(shownTime)} / {formatClock(RUN_SECONDS)}</span>
          </span>
          <div className="run-progress" role="progressbar" aria-label="Run progress" aria-valuemin={0} aria-valuemax={RUN_SECONDS}
            aria-valuenow={Math.floor(shownTime)} aria-valuetext={progressText}>
            <div className="run-progress-fill" style={{ width: `${(shownTime / RUN_SECONDS) * 100}%` }} />
          </div>
        </div>
        <div id={extraId} className={`toolbar-extras ${open ? 'open' : ''}`} inert={!open}>
          <div className="toolbar-extras-in">
            <label className="inline">Period
              <select value={p.period} onChange={(e) => p.onPeriod(e.target.value)}>
                {p.periods.map((x) => <option key={x.id} value={x.id}>{x.label}{isExperimentalPeriod(p.entry, x.id) ? ' (experimental)' : ''}</option>)}
              </select>
            </label>
            <label className="inline">Demand <output>{Math.round(p.scale * 100)}%</output>
              <input type="range" min={0.5} max={1.5} step={0.05} value={p.scale} onChange={(e) => p.onScale(Number(e.target.value))} aria-valuetext={`${Math.round(p.scale * 100)} percent of estimated demand`} />
            </label>
            <button type="button" className="btn" onClick={p.onReset}>Reset</button>
            {experimental && <p className="small period-note" role="note">{EXPERIMENTAL_NOTE}</p>}
            {p.reducedMotion && <span className="muted small">Paused at start (reduced motion preference).</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LegendProps {
  overlay: Overlay; onOverlay(o: Overlay): void; mode: Mode;
  source: 'scenario' | 'baseline'; onSource(s: 'scenario' | 'baseline'): void; canCompare: boolean;
  /** False when the sim build has no multimodal agents: only the car key is shown then. */
  multimodal: boolean;
  modes: ModeVisibility; onModes(m: ModeVisibility): void;
  hasBikeNet: boolean; bikeNet: boolean; onBikeNet(v: boolean): void;
  /** Map view: scenario values or change from baseline. The switch shows only when the scenario has interventions. */
  view: MapView; onView(v: MapView): void; canChange: boolean;
  /** First 10 simulated minutes of a comparison: differences are noisy. */
  early: boolean;
}

const MODE_KEYS: { id: ModeKey; label: string }[] = [
  { id: 'car', label: 'Cars' }, { id: 'bicycle', label: 'Bikes' }, { id: 'pedestrian', label: 'People walking' },
];
function ModeSymbol({ id }: { id: ModeKey }) {
  const c = `var(--${id === 'car' ? 'veh' : id === 'bicycle' ? 'bike' : 'ped'})`;
  switch (id) {
    case 'car': return <svg width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="4.5" fill={c} stroke="var(--veh-ring)" /></svg>;
    case 'bicycle': return <svg width="16" height="16" aria-hidden="true"><path d="M8 2 L14 12.5 L2 12.5Z" fill={c} stroke="var(--veh-ring)" strokeLinejoin="round" /></svg>;
    case 'pedestrian': return <svg width="16" height="16" aria-hidden="true"><rect x="4.5" y="4.5" width="7" height="7" fill={c} stroke="var(--veh-ring)" /></svg>;
  }
}

const OVERLAYS: { id: Overlay; label: string }[] = [
  { id: 'cutthrough', label: 'Cut-through' }, { id: 'speed', label: 'Speed' }, { id: 'flow', label: 'Flow' },
];

/** Docked legend row along the bottom of the map. Collapsed it names the metric and shows the ramp ends; expanded it adds layers and symbols. */
export function Legend(p: LegendProps) {
  const peek = usePeek(false);
  const { open, dispatch } = peek;
  const [tipOn, setTipOn] = useState(false);
  const [hush, setHush] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const extraId = useId(), tipId = useId();
  const change = p.canChange && p.view === 'change';
  const stops = rampStops(p.mode);
  const grad = change ? divergingGradient(p.mode) : `linear-gradient(to right, ${stops.join(', ')})`;
  const ticks = change ? changeTicks(p.overlay) : rampTicks(p.overlay);
  const name = change ? changeLabel(p.overlay) : p.overlay === 'speed' ? 'Speed, % of limit' : p.overlay === 'flow' ? 'Flow, veh/h' : 'Cut-through, veh/h';
  const band = DEAD_BAND[p.overlay];
  const help = change
    ? `Blue lines carry less than today; orange lines carry more. Dashed lines mark large decreases; solid lines are increases. Wider means a bigger change. Differences under ${band} ${CHANGE_UNIT[p.overlay]} count as noise and are shown as no change, in thin gray, as are streets with no traffic in either run. Colors show less and more, not better and worse. The scale tops out at ${changeTicks(p.overlay)[4].slice(1)} ${CHANGE_UNIT[p.overlay]}.`
    : `${p.overlay === 'speed' ? 'Slower is darker and wider (more congested).' : `Higher is a wider line. ${TOP_NOTE[p.overlay]}`} Thin gray lines carry no vehicles.`;

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
  const pinned = peek.pinned;
  useEffect(() => {
    if (!pinned) return;
    const out = (e: Event) => { if (root.current && !root.current.contains(e.target as Node)) dispatch({ type: 'unpin' }); };
    const evts = ['pointerdown', 'focusin', 'wheel'] as const;
    evts.forEach((n) => document.addEventListener(n, out, { capture: true, passive: true }));
    return () => evts.forEach((n) => document.removeEventListener(n, out, { capture: true }));
  }, [pinned, dispatch]);

  const tipShown = tipOn;
  return (
    <div ref={root} className={`legend ${open ? 'open' : ''}`} role="group" aria-label="Map legend" {...peek.handlers}
      onKeyDown={(e) => {
        if (e.key !== 'Escape') return;
        if (tipOn || document.querySelector('.legend-tip-wrap:hover, .legend-tip-wrap:focus-within')) { e.stopPropagation(); setTipOn(false); setHush(true); }
        else if (open) { e.stopPropagation(); dispatch({ type: pinned ? 'unpin' : 'dismiss' }); (root.current?.querySelector('.bar-toggle') as HTMLElement | null)?.focus(); }
      }}>
      <div id={extraId} className={`legend-extras ${open ? 'open' : ''}`} inert={!open}>
        <div className="legend-extras-in">
          <div className="legend-line">
            <div className="seg" role="group" aria-label="Map overlay">
              {OVERLAYS.map((o) => (
                <button key={o.id} type="button" className={p.overlay === o.id ? 'on' : ''} aria-pressed={p.overlay === o.id} onClick={() => p.onOverlay(o.id)}>{o.label}</button>
              ))}
            </div>
            {p.canChange && (
              <div className="seg" role="group" aria-label="Map view">
                {([['scenario', 'Scenario'], ['change', 'Change from baseline']] as const).map(([v, l]) => (
                  <button key={v} type="button" className={p.view === v ? 'on' : ''} aria-pressed={p.view === v} onClick={() => p.onView(v)}>{l}</button>
                ))}
              </div>
            )}
            {p.canCompare && !change && (
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
                <svg width="30" height="16" aria-hidden="true"><line x1="1" y1="5" x2="29" y2="5" stroke="var(--bikenet)" strokeWidth="2" /><line x1="1" y1="11" x2="29" y2="11" stroke="var(--bikenet)" strokeWidth="2" strokeDasharray="4 3" /></svg> Bike network (lanes solid, routes dashed)
              </label>
            )}
          </div>
          <ul className="keys" aria-label="Map symbols">
            {p.multimodal && <li><svg width="14" height="14" aria-hidden="true"><line x1="7" y1="1" x2="7" y2="13" stroke="var(--text)" strokeWidth="2" /></svg> Crossing (zoomed in)</li>}
            {change && <li><svg width="30" height="14" aria-hidden="true"><line x1="1" y1="4" x2="29" y2="4" stroke="var(--text)" strokeWidth="3" /><line x1="1" y1="10" x2="29" y2="10" stroke="var(--text)" strokeWidth="3" strokeDasharray="4 4" /></svg> Solid: increase. Dashed: large decrease.</li>}
            <li><svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="var(--surface)" stroke="#1f9d55" strokeWidth="2" /></svg> Signal green (ring)</li>
            <li><svg width="14" height="14" aria-hidden="true"><path d="M7 1 L13 12 L1 12Z" fill="#f5c400" stroke="var(--text)" /></svg> Yellow (triangle)</li>
            <li><svg width="14" height="14" aria-hidden="true"><rect x="2" y="2" width="10" height="10" fill="#d62728" stroke="var(--text)" /></svg> Red (square)</li>
          </ul>
        </div>
      </div>
      <div className="legend-row">
        <button type="button" className="btn bar-toggle icon-btn" aria-expanded={open} aria-controls={extraId} aria-label="Legend and layers" title="Legend and layers" onClick={() => dispatch({ type: 'toggle' })}>
          <Chevron up={!open} />
        </button>
        <div className="legend-name">
          <span className="legend-title" id={`${tipId}-n`}>{name}</span>
          {change && p.early && <span className="legend-early" title="Early results are noisy: wait for 10 simulated minutes.">Early, noisy</span>}
          <span className={`legend-tip-wrap ${hush ? 'hush' : ''}`} onMouseLeave={() => { setHush(false); setTipOn(false); }} onBlur={() => { setHush(false); setTipOn(false); }}>
            <button type="button" className="legend-info" aria-label="About this legend" aria-describedby={tipId} aria-expanded={tipShown} onClick={() => { setHush(false); setTipOn((o) => !o); }}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="6" /><path d="M7 6.2v3.8M7 3.8v.1" strokeLinecap="round" /></svg>
            </button>
            <span id={tipId} role="tooltip" className={`legend-tip ${tipOn ? 'on' : ''}`}>{help}</span>
          </span>
        </div>
        <div className="legend-ramp" role="img" aria-label={`${name}: from ${ticks[0]} to ${ticks[4]}${change ? ', zero is no change' : ''}`}>
          <span className="ramp-end">{ticks[0]}</span>
          <div className="ramp-col">
            <div className="ramp-bar" style={{ background: grad }} />
            {change ? (
              <div className="ramp-zero" aria-hidden="true">
                <i className="ramp-zero-tick" />
                {[1, 2, 3].map((i) => <span key={i} className={i === 2 ? '' : `extra ${open ? 'open' : ''}`} style={{ left: `${i * 25}%` }}>{ticks[i]}</span>)}
              </div>
            ) : (
              <div className={`ramp-mid ${open ? 'open' : ''}`} aria-hidden="true"><div className="ramp-mid-in"><div className="ramp-mid-pad">{[1, 2, 3].map((i) => <span key={i} style={{ left: `${i * 25}%` }}>{ticks[i]}</span>)}</div></div></div>
            )}
          </div>
          <span className="ramp-end">{ticks[4]}</span>
        </div>
      </div>
    </div>
  );
}
