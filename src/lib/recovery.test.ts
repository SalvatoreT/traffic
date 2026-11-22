import { describe, expect, it } from 'vitest';
import { recoverySummary } from './recovery';
import type { Metrics } from '../types';

const reason = (admissions: number) => ({ invokedS: 0, blockedS: 0, admissions, initAdmissions: 0 });
const m = (policy: string, o: { c?: number; y?: number; b?: number; held?: number; time?: number } = {}) => ({
  time: o.time ?? 3600,
  junctionRecovery: { policy, crossings: 517146, courtesy: reason(o.c ?? 17), yieldFallback: reason(o.y ?? 7), conflictBypass: reason(o.b ?? 0), heldRemovals: o.held ?? 0 },
}) as Pick<Metrics, 'junctionRecovery' | 'time'>;

describe('recoverySummary', () => {
  it('reports a physical run with zero bypass as valid and gives hourly counts', () => {
    const s = recoverySummary(m('physical'));
    expect(s.physicallyValid).toBe(true);
    expect(s.text).toContain('policy physical');
    expect(s.text).toContain('Courtesy admitted 17 an hour and the yield fallback 7 an hour');
    expect(s.text).toContain('517,146 node entries');
    expect(s.text).toContain('assumptions');
    expect(s.text).not.toContain('Cars cleared');
  });
  it('scales a partial run to an hour', () => {
    expect(recoverySummary(m('physical', { c: 5, time: 1800 })).text).toContain('Courtesy admitted 10 an hour');
  });
  it('qualifies the historical policy and any bypass admission', () => {
    const h = recoverySummary(m('historical', { b: 13.3 }));
    expect(h.physicallyValid).toBe(false);
    expect(h.text).toContain('does not pass the physical junction check');
    expect(h.text).toContain('13.3 vehicles an hour');
    expect(recoverySummary(m('physical', { b: 2 })).physicallyValid).toBe(false);
  });
  it('says courtesy was off for no_behavioral and names cars cleared from gridlock', () => {
    const s = recoverySummary(m('no_behavioral', { held: 3 }));
    expect(s.text).toContain('switched off');
    expect(s.text).toContain('Cars cleared from gridlock while held in a junction: 3.');
  });
  it('handles a result without the object', () => {
    const s = recoverySummary({ time: 3600 } as Metrics);
    expect(s.text).toContain('no figures');
  });
});
