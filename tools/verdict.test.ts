import { describe, expect, it } from 'vitest';
import { suggestStatus, type PeriodVerdict } from './lib/verdict';

const ok: PeriodVerdict = { stable: true, d5: true, through: true, stations: true };
describe('status rule', () => {
  it('is calibrated when every period is stable, PM shares and through cars pass, and stations pass where counted', () => {
    expect(suggestStatus({ am_peak: { ...ok, d5: null, through: null }, midday: { ...ok, d5: null, through: null, stations: null }, pm_peak: ok }).calibrated).toBe(true);
  });
  it('fails when the through-car check has no rows', () => {
    const r = suggestStatus({ pm_peak: { ...ok, through: null } });
    expect(r.calibrated).toBe(false);
    expect(r.reasons.join(' ')).toMatch(/no through-car rows/);
  });
  it('fails on a station rule that is not met or cannot be judged, and lists unstable periods as experimental', () => {
    const r = suggestStatus({ am_peak: { ...ok, d5: null, stations: false, stable: false }, pm_peak: ok });
    expect(r.calibrated).toBe(false);
    expect(r.experimental).toEqual(['am_peak']);
  });
});
