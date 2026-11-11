import { useState } from 'react';
import type { AreaBundle, Overlay, Units } from '../types';
import { formatClock } from '../lib/format';
import { rampStops, type Mode } from '../lib/ramps';

export const SPEEDS = [1, 5, 20, 60];

interface PlaybackProps {
  running: boolean; onToggle(): void; onReset(): void;
  speed: number; onSpeed(s: number): void;
  periods: AreaBundle['demand']['periods']; period: string; onPeriod(id: string): void;
  scale: number; onScale(v: number): void; time: number; reducedMotion: boolean;
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
  overlay: Overlay; onOverlay(o: Overlay): void; max: number; mode: Mode; units: Units;
  source: 'scenario' | 'baseline'; onSource(s: 'scenario' | 'baseline'): void; canCompare: boolean;
}

const OVERLAYS: { id: Overlay; label: string }[] = [
  { id: 'flow', label: 'Flow' }, { id: 'speed', label: 'Speed' }, { id: 'cutthrough', label: 'Cut-through' },
];

export function Legend(p: LegendProps) {
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
        <div className="muted small">{p.overlay === 'speed' ? 'Slower = darker/wider (more congested).' : 'Higher = wider line.'} Grey thin = no vehicles.</div>
      </div>
      <ul className="keys" aria-label="Map symbols">
        <li><svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="var(--veh)" stroke="var(--veh-ring)" /></svg> Vehicle</li>
        <li><svg width="16" height="16" aria-hidden="true"><path d="M8 1 L15 8 L8 15 L1 8Z" fill="var(--thru)" stroke="var(--thru-ring)" strokeWidth="1.6" /></svg> Through trip (cut-through)</li>
        <li><svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="var(--surface)" stroke="#1f9d55" strokeWidth="2" /></svg> Signal green (ring)</li>
        <li><svg width="14" height="14" aria-hidden="true"><path d="M7 1 L13 12 L1 12Z" fill="#f5c400" stroke="var(--text)" /></svg> Yellow (triangle)</li>
        <li><svg width="14" height="14" aria-hidden="true"><rect x="2" y="2" width="10" height="10" fill="#d62728" stroke="var(--text)" /></svg> Red (square)</li>
      </ul>
    </div>
  );
}
