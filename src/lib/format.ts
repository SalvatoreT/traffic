export const MPS_TO_MPH = 2.2369362920544;
export const KM_TO_MI = 0.621371192;

export type Kind = 'speed' | 'dist' | 'share' | 'minutes' | 'seconds' | 'count' | 'flow' | 'index';

export const speedValue = (mps: number): number => mps * MPS_TO_MPH;

/** Convert an SI-ish metric (speed m/s, dist km, share 0..1, time s) to a display number (mph, miles). */
export function displayValue(kind: Kind, v: number): number {
  switch (kind) {
    case 'speed': return speedValue(v);
    case 'dist': return v * KM_TO_MI;
    case 'share': return v * 100;
    case 'minutes': return v / 60;
    default: return v;
  }
}
export function unitLabel(kind: Kind): string {
  switch (kind) {
    case 'speed': return 'mph';
    case 'dist': return 'veh-mi';
    case 'share': return '%';
    case 'minutes': return 'min';
    case 'seconds': return 's';
    case 'flow': return 'veh/h';
    default: return '';
  }
}
function digits(kind: Kind, x: number): number {
  if (kind === 'index') return Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : 2;
  if (kind === 'count' || kind === 'flow') return Math.abs(x) >= 100 || Number.isInteger(x) ? 0 : 1;
  return Math.abs(x) >= 100 ? 0 : 1;
}
export function formatValue(kind: Kind, v: number | undefined | null, withUnit = true): string {
  if (v === undefined || v === null || !Number.isFinite(v)) return '—';
  const d = displayValue(kind, v);
  const s = d.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: digits(kind, d) });
  const unit = unitLabel(kind);
  if (!withUnit || !unit) return s;
  return kind === 'share' ? `${s}%` : `${s} ${unit}`;
}

export interface Diff {
  direction: 'up' | 'down' | 'same';
  verdict: 'better' | 'worse' | 'about the same' | 'n/a';
  arrow: '↑' | '↓' | '→';
  abs: number;      // display units (signed)
  pct: number | null;
  text: string;
}

/** Describe the change scenario vs baseline in words. `lowerIsBetter` null = neutral. */
export function formatDiff(
  base: number | undefined, scen: number | undefined, kind: Kind, lowerIsBetter: boolean | null,
): Diff {
  if (base === undefined || scen === undefined || !Number.isFinite(base) || !Number.isFinite(scen)) {
    return { direction: 'same', verdict: 'n/a', arrow: '→', abs: 0, pct: null, text: 'not available yet' };
  }
  const b = displayValue(kind, base), s = displayValue(kind, scen);
  const abs = s - b;
  const pct = b !== 0 ? (abs / Math.abs(b)) * 100 : null;
  const tiny = pct !== null ? Math.abs(pct) < 0.5 : Math.abs(abs) < 1e-9;
  const direction = tiny ? 'same' : abs > 0 ? 'up' : 'down';
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';
  let verdict: Diff['verdict'] = 'about the same';
  if (direction !== 'same') {
    verdict = lowerIsBetter === null ? 'about the same' : (direction === 'down') === lowerIsBetter ? 'better' : 'worse';
  }
  const unit = kind === 'share' ? 'pp' : unitLabel(kind);
  const absTxt = `${abs > 0 ? '+' : abs < 0 ? '−' : ''}${Math.abs(abs).toLocaleString('en-US', {
    maximumFractionDigits: digits(kind, abs),
  })}${unit ? (kind === 'share' ? ' pp' : ` ${unit}`) : ''}`;
  let text: string;
  if (direction === 'same') text = `${arrow} about the same`;
  else {
    const pctTxt = pct === null ? '' : `${Math.abs(pct) < 10 ? Math.abs(pct).toFixed(1) : Math.abs(pct).toFixed(0)}% `;
    const word = direction === 'up' ? 'higher' : 'lower';
    text = `${arrow} ${pctTxt}${word} (${absTxt})${lowerIsBetter === null ? '' : `, ${verdict}`}`;
  }
  return { direction, verdict, arrow, abs, pct, text };
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
