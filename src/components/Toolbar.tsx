import { useId, useState } from 'react';
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

export function Playback(p: PlaybackProps) {
  const [more, setMore] = useState(false);
  return (
    <div className="toolbar" role="group" aria-label="Simulation playback">
      <button type="button" className="btn primary" onClick={p.onToggle} aria-label={p.running ? 'Pause simulation' : 'Play simulation'}>
        <span aria-hidden="true">{p.running ? '❚❚' : '▶'}</span> {p.running ? 'Pause' : 'Play'}
      </button>
      <button type="button" className="btn" onClick={p.onReset}>Reset</button>
      <div className="seg" role="group" aria-label="Simulation speed">
        {SPEEDS.map((s) => (
          <button key={s} type="button" className={p.speed === s ? 'on' : ''} aria-pressed={p.speed === s} onClick={() => p.onSpeed(s)}>{s}×</button>
        ))}
      </div>
      <span className="speed-note small" role="status">{speedNoteText(p.speed, p.achieved ?? null)}</span>
      <button type="button" className="btn more-btn" aria-expanded={more} aria-controls="pb-extras" onClick={() => setMore((m) => !m)}>
        Period &amp; demand <span aria-hidden="true">{more ? '▴' : '▾'}</span>
      </button>
      <div id="pb-extras" className={`extras ${more ? 'open' : ''}`}>
      <label className="inline">Period
        <select value={p.period} onChange={(e) => p.onPeriod(e.target.value)}>
          {p.periods.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select>
      </label>
      <label className="inline">Demand <output>{Math.round(p.scale * 100)}%</output>
        <input type="range" min={0.5} max={1.5} step={0.05} value={p.scale} onChange={(e) => p.onScale(Number(e.target.value))} aria-valuetext={`${Math.round(p.scale * 100)} percent of estimated demand`} />
      </label>
      </div>
      <span className="clock" aria-label={`Simulated time ${formatClock(p.time)}`}><span aria-hidden="true">⏱</span> {formatClock(p.time)}</span>
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

function initialLegendOpen(): boolean {
  try { const v = localStorage.getItem('legendOpen'); if (v === '1' || v === '0') return v === '1'; } catch { /* unavailable */ }
  try { return window.matchMedia('(min-width: 1100px)').matches; } catch { return true; }
}

export function Legend(p: LegendProps) {
  const [open, setOpen] = useState(initialLegendOpen);
  const moreId = useId();
  const toggle = () => setOpen((o) => { try { localStorage.setItem('legendOpen', o ? '0' : '1'); } catch { /* unavailable */ } return !o; });
  const stops = rampStops(p.mode);
  const grad = `linear-gradient(to right, ${stops.join(', ')})`;
  const ticks = p.overlay === 'speed'
    ? ['100%', '75%', '50%', '25%', '0%']
    : [0, 0.25, 0.5, 0.75, 1].map((f) => (p.max < 8 ? String(Math.round(p.max * f * 100) / 100) : String(Math.round(p.max * f))));
  const title = p.overlay === 'speed' ? 'Mean speed, % of limit' : p.overlay === 'flow' ? 'Flow (veh/h)' : 'Cut-through flow (veh/h)';
  return (
    <div className="legend">
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
      <div className="ramp" role="group" aria-label={`Legend: ${title}`}>
        <div className="ramp-title">{title}</div>
        <div className="ramp-bar" style={{ background: grad }} />
        <div className="ramp-ticks" aria-hidden="false">{ticks.map((t, i) => <span key={i}>{t}</span>)}</div>
        <div className="muted small">{p.overlay === 'speed' ? 'Slower = darker/wider (more congested).' : 'Higher = wider line.'} Gray thin = no vehicles.</div>
      </div>
      <button type="button" className="btn legend-toggle" aria-expanded={open} aria-controls={moreId} onClick={toggle}>
        Legend and layers <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      <div id={moreId} className="legend-more" hidden={!open}>
      <fieldset className="modes">
        <legend>Show on map</legend>
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
      </fieldset>
      <ul className="keys" aria-label="Map symbols">
        {p.multimodal && <li><svg width="14" height="14" aria-hidden="true"><rect x="2" y="2" width="10" height="10" rx="2" fill="var(--surface)" stroke="var(--bus)" strokeWidth="2" /></svg> Bus stop</li>}
        {p.multimodal && <li><svg width="14" height="14" aria-hidden="true"><line x1="7" y1="1" x2="7" y2="13" stroke="var(--text)" strokeWidth="2" /></svg> Crossing (zoomed in)</li>}
        <li><svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="var(--surface)" stroke="#1f9d55" strokeWidth="2" /></svg> Signal green (ring)</li>
        <li><svg width="14" height="14" aria-hidden="true"><path d="M7 1 L13 12 L1 12Z" fill="#f5c400" stroke="var(--text)" /></svg> Yellow (triangle)</li>
        <li><svg width="14" height="14" aria-hidden="true"><rect x="2" y="2" width="10" height="10" fill="#d62728" stroke="var(--text)" /></svg> Red (square)</li>
      </ul>
      </div>
    </div>
  );
}
