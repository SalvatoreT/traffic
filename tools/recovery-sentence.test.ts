import { describe, expect, it } from 'vitest';
import { recoverySentence, type SeedRun } from './lib/assess';

const run = (minutes: number, courtesy: number, held: number): SeedRun => ({
  seed: 1, minutes, period: 'pm_peak', health: { gridlockRemoved: 0, backlogPct: 0, completed: 0, arterialMeanSpeed: 0, spawned: 0 }, shares: [], rampShares: [], linkFlowVehPerHour: null, linkMeanDelayS: null,
  junctionRecovery: { policy: 'physical', crossings: 1000, courtesy: { admissions: courtesy }, yieldFallback: { admissions: 0 }, conflictBypass: { admissions: 0 }, heldRemovals: held },
});

describe('recoverySentence', () => {
  it('reports admissions and held removals per hour, averaged over seeds', () => {
    const s = recoverySentence([run(60, 10, 1), run(30, 10, 0)]);
    expect(s).toContain('policy physical');
    expect(s).toContain('courtesy 15.0');
    expect(s).toContain('held in a node 0.50 per hour');
  });
  it('says so when the runs predate the figures', () => {
    const r = run(60, 0, 0);
    delete r.junctionRecovery;
    expect(recoverySentence([r])).toMatch(/no junction recovery/);
  });
});
