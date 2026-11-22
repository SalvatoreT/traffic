import { describe, expect, it } from 'vitest';
import { buildAssumptions, derivedTargetsView, parseFitReport, type AssumptionsCfg } from './lib/assumptions-data';
import { intentShares, parseAssumptions } from '../src/lib/assumptions';

const fit = `# Fit

## Other
| a | b |

## Assumed movement flows (ASSUMPTION)

Text.

| Movement | Period | Counted (veh/h) | Candidate flows (through / local) | Candidate volume | Assumed flows | Through (veh/h) | Local (veh/h) | Median detour | Largest detour used |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Main St north, left onto Cross St | am_peak | 78 | 853 (777 / 76) | 2347 | 29 | 48 | 30 | 1.20 | 1.29 |
| Main St north, left onto Cross St | pm_peak | 131 | 1092 (990 / 102) | 3728 | 41 | 81 | 50 | 1.20 | 1.29 |
| Main St north, right onto Cross St | am_peak | 20 | 0 (0 / 0) | 0 | 0 | 0 | 0 | - | 0.00 |

Main St north, right onto Cross St, am_peak: counted 20 veh/h, below the count fit's minimum of 25 veh/h for a turning movement, so the fit has no station for it and no trips are assigned to it in this period.

### Intents of the assumed movements (ASSUMPTION)

Text.

| Movement | Period | Intent | Volume (veh/h) | Candidate flows | Flows kept | Assigned (veh/h) | Taken from plain flows (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Main St north, left onto Cross St | am_peak | Ramp traffic | 36.7 | 3 | 2 | 36.7 | 36.7 |
| Main St north, left onto Cross St | am_peak | Residents | 41.3 | 3 | 2 | 41.3 | 36.7 |
| Main St north, left onto Cross St | pm_peak | Ramp traffic | 61.6 | 3 | 2 | 61.6 | 61.6 |
| Main St north, left onto Cross St | pm_peak | Residents | 69.4 | 3 | 2 | 69.4 | 36.7 |

## Later section
| x |
`;
const cfg: AssumptionsCfg = {
  assumedMovementFlows: { movements: [{ id: 'm1', label: 'Main St north, left onto Cross St', maxDetour: 1.3, intents: [
    { id: 'ramp', label: 'Ramp traffic', fromGroup: 'ramp', toGroup: 'west' }, { id: 'res', label: 'Residents', fromGroup: 'study-area', toGroup: 'west' },
  ] }] },
  volunteerCount: { periods: { am: 'am_peak', pm: 'pm_peak', midday: 'midday' }, middayFromPm: true },
};

describe('a movement counted below the fit minimum', () => {
  it('keeps the count, drops the assigned cars and says why', () => {
    const c2: AssumptionsCfg = { ...cfg, assumedMovementFlows: { movements: [{ id: 'r', label: 'Main St north, right onto Cross St', maxDetour: 1.3, intents: [] }] } };
    const m = buildAssumptions(c2, fit, { area: 'a', demandHash: 'h', countSourceId: '', generated: 'g' }).movements[0];
    expect(m.counted).toEqual({ am_peak: 20 });
    expect(m.assigned).toEqual({});
    expect(m.belowThreshold).toEqual({ am_peak: 20 });
    expect(m.belowThresholdNote).toMatch(/fewer than the count fit's minimum/);
  });
});

describe('map fields', () => {
  it('carries the links and junction of a movement when given, and omits them otherwise', () => {
    const o = { area: 'a', demandHash: 'h', countSourceId: '', generated: 'g' };
    const f = buildAssumptions(cfg, fit, { ...o, links: { m1: { from: 4, to: 7, node: 2 } } });
    expect(f.movements[0]).toMatchObject({ from: 4, to: 7, node: 2 });
    expect(parseAssumptions(JSON.stringify(f))).not.toBeNull();
    const bare = buildAssumptions(cfg, fit, o).movements[0];
    expect('from' in bare).toBe(false);
    expect(parseAssumptions(JSON.stringify({ ...f, movements: [{ ...f.movements[0], from: 'x' }] }))).toBeNull();
  });
});

describe('the assumptions data', () => {
  it('reads both tables of the fit report', () => {
    const r = parseFitReport(fit);
    expect(r.movements).toEqual([
      { movement: 'Main St north, left onto Cross St', period: 'am_peak', counted: 78, through: 48, local: 30 },
      { movement: 'Main St north, left onto Cross St', period: 'pm_peak', counted: 131, through: 81, local: 50 },
      { movement: 'Main St north, right onto Cross St', period: 'am_peak', counted: 20, through: 0, local: 0 },
    ]);
    expect(r.belowMin).toEqual([{ movement: 'Main St north, right onto Cross St', period: 'am_peak', counted: 20 }]);
    expect(r.intents).toHaveLength(4);
    expect(r.intents[2]).toMatchObject({ intent: 'Ramp traffic', period: 'pm_peak', assigned: 61.6 });
  });
  it('fails loudly when the report has no section or no row for a movement', () => {
    expect(() => parseFitReport('# nothing')).toThrow(/no "Assumed movement flows"/);
    const other: AssumptionsCfg = { ...cfg, assumedMovementFlows: { movements: [{ id: 'x', label: 'Elsewhere', maxDetour: 1.3 }] } };
    expect(() => buildAssumptions(other, fit, { area: 'a', demandHash: 'h', countSourceId: '', generated: 'g' })).toThrow(/Elsewhere/);
  });
  it('joins config and report: counted, assigned, through, and which intents have no end in the study area', () => {
    const f = buildAssumptions(cfg, fit, { area: 'a', demandHash: 'abc', countSourceId: 'volunteer-count-2025-02-25', generated: 'g' });
    const m = f.movements[0];
    expect(m.counted).toEqual({ am_peak: 78, pm_peak: 131 });
    expect(m.assigned.pm_peak).toEqual({ total: 131, through: 81 });
    expect(m.intents.map((i) => [i.id, i.through])).toEqual([['ramp', true], ['res', false]]);
    expect(f.count).toEqual({ label: 'the resident volunteer count of February 25, 2025', measured: ['am_peak', 'pm_peak'], scaled: ['midday'] });
    expect(parseAssumptions(JSON.stringify(f))).not.toBeNull();
    expect(parseAssumptions('{"version":2}')).toBeNull();
    expect(intentShares(m, 'pm_peak').map((s) => s.pct)).toEqual([47, 53]);
    expect(intentShares(m, 'midday')).toEqual([]);
  });
});

describe('targets derived from daily totals', () => {
  const st = (id: string, source: string | null, target: Record<string, number>) => ({ id, kind: 'caltrans', label: id, source, year: 2024 as number | null, target });
  const factors = { kFactor: 0.09, ramps: { kFactor: 0.09 }, periodFactors: { pm_peak: { inboundShare: 0.45 }, am_peak: { inboundShare: 0.58 } } };
  it('lists the stations made from an AADT or ramp ADT with the factors, and nothing else', () => {
    const v = derivedTargetsView([st('a', 'caltrans-aadt', { pm_peak: 951.6 }), st('b', 'volunteer-count', { pm_peak: 50 }), st('c', 'caltrans-ramp', { pm_peak: 12.2 }), st('d', null, {})], factors)!;
    expect(v.stations.map((s) => s.id)).toEqual(['a', 'c']);
    expect(v.stations[0].targets).toEqual({ pm_peak: 952 });
    expect(v.inboundShare).toEqual({ pm_peak: 0.45, am_peak: 0.58 });
    expect(derivedTargetsView([st('b', 'volunteer-count', {})], factors)).toBeNull();
  });
  it('is carried in the assumptions file only when there is something to show', () => {
    const o = { area: 'a', demandHash: 'h', countSourceId: '', generated: 'g' };
    const v = derivedTargetsView([st('a', 'caltrans-aadt', { pm_peak: 900 })], factors);
    expect(buildAssumptions(cfg, fit, { ...o, derivedTargets: v }).derivedTargets?.stations).toHaveLength(1);
    expect('derivedTargets' in buildAssumptions(cfg, fit, { ...o, derivedTargets: null })).toBe(false);
    expect('derivedTargets' in buildAssumptions(cfg, fit, o)).toBe(false);
  });
});
