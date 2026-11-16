import { describe, expect, it } from 'vitest';
import { formatDiff, formatValue } from './format';
import { MODE_CARDS, emptyMode, hasModes, isLegacySafety, summarize, vulnerableSentence } from './metrics';
import { MockSimulation } from '../sim/mock';
import { buildFixture } from '../fixtures/area';
import type { Metrics, SeveritySummary } from '../types';

const bundle = buildFixture();
function run(seconds: number, ivs: unknown[] = []): Metrics {
  const sim = new MockSimulation(JSON.stringify(bundle.network), JSON.stringify(bundle.demand), JSON.stringify({ seed: 1, period: bundle.demand.periods[0].id, demandScale: 1 }));
  sim.setInterventions(JSON.stringify(ivs));
  sim.step(seconds);
  return JSON.parse(sim.metrics()) as Metrics;
}
const withModes = (m: Metrics, over: Partial<NonNullable<Metrics['vulnerable']>>): Metrics => ({ ...m, vulnerable: { ...m.vulnerable!, ...over } });

describe('mode formatting', () => {
  it('formats seconds and index values', () => {
    expect(formatValue('seconds', 12.34)).toBe('12.3 s');
    expect(formatValue('index', 0.456)).toBe('0.46');
    expect(formatValue('index', 123.4)).toBe('123');
  });
  it('treats NaN from a build without modes as unavailable', () => {
    expect(formatValue('count', NaN)).toBe('—');
    expect(formatDiff(NaN, 3, 'count', true).verdict).toBe('n/a');
  });
  it('decides direction per metric', () => {
    const delay = MODE_CARDS[0].metrics.find((d) => d.id === 'xdelay')!;
    const trips = MODE_CARDS[1].metrics.find((d) => d.id === 'carTrips')!;
    expect(formatDiff(10, 8, delay.kind, delay.lowerIsBetter).verdict).toBe('better');
    expect(formatDiff(5, 4, trips.kind, trips.lowerIsBetter).verdict).toBe('worse');
  });
});

describe('mock multimodal output', () => {
  const m = run(120);
  it('has car, bicycle and pedestrian kinds in the vehicle buffer', () => {
    const sim = new MockSimulation(JSON.stringify(bundle.network), JSON.stringify(bundle.demand), JSON.stringify({ seed: 1, period: bundle.demand.periods[0].id, demandScale: 1 }));
    const v = sim.vehicles();
    const kinds = new Set<number>();
    for (let i = 4; i < v.length; i += 6) kinds.add(v[i]);
    expect([...kinds].sort()).toEqual([0, 2, 3]);
  });
  it('reports modes and vulnerable metrics', () => {
    expect(hasModes(m)).toBe(true);
    expect(m.modes!.pedestrian.inNetwork).toBeGreaterThan(0);
    expect(m.vulnerable!.pedConflicts).toBeGreaterThanOrEqual(0);
  });
  it('closing streets cuts pedestrian conflicts', () => {
    const base = run(600);
    const closed = run(600, bundle.network.links.filter((l) => l.class === 'residential').map((l) => ({ type: 'modal_filter', link: l.id })));
    expect(closed.vulnerable!.pedConflicts).toBeLessThan(base.vulnerable!.pedConflicts);
  });
});

describe('walking and biking summary', () => {
  const sevOf = (endpoint: 'AIS4+' | 'MAIS3+F', supported: number, mean: number | null, unsupported = 0): SeveritySummary => ({
    endpoint, source: 'x', encounters: supported + unsupported, supported, unsupported, meanSeverity: mean, unavailable: mean === null ? 'no encounters' : null,
  });
  const b = withModes(run(60), { pedConflicts: 10, bikeConflicts: 4, pedestrian: sevOf('AIS4+', 100, 0.2), cyclist: { ...sevOf('MAIS3+F', 50, 0.1, 5), passes: { count: 5, meanVehicleSpeed: 8 } } });
  it('states the change in words', () => {
    const s = withModes(b, { pedConflicts: 5, bikeConflicts: 4, pedestrian: sevOf('AIS4+', 100, 0.1) });
    const t = vulnerableSentence(b, s);
    expect(t).toContain('pedestrian conflicts down 50%, better');
    expect(t).toContain('cyclist conflicts about the same');
    expect(t).not.toMatch(/combined (injury|risk)/);
    expect(summarize(b, s)).toContain('inside the study area only');
    expect(summarize(b, s)).not.toContain('walking and biking');
  });
  it('reports each endpoint with its own change and support, and no sum', () => {
    const s = withModes(b, { pedestrian: sevOf('AIS4+', 100, 0.4), cyclist: { ...b.vulnerable!.cyclist, ...sevOf('MAIS3+F', 50, 0.05, 5) } });
    const t = vulnerableSentence(b, s);
    expect(t).toContain('walking severity per scored encounter (AIS 4+) up 100% (baseline 100 scored, scenario 100 scored encounters)');
    expect(t).toContain('biking severity per scored encounter (MAIS 3+) down 50%');
  });
  it('equal means with different exposure keep both visible', () => {
    const s = withModes(b, { pedestrian: sevOf('AIS4+', 1000, 0.2) });
    const row = MODE_CARDS[0].metrics;
    const mean = row.find((d) => d.id === 'pedSev')!, n = row.find((d) => d.id === 'pedEnc')!;
    expect(mean.get(b)).toBe(mean.get(s));
    expect([n.get(b), n.get(s)]).toEqual([100, 1000]);
  });
  it('an empty supported sample is unavailable, with its reason, not zero', () => {
    const s = withModes(b, { cyclist: { ...b.vulnerable!.cyclist, ...sevOf('MAIS3+F', 0, null, 7) } });
    const d = MODE_CARDS[0].metrics.find((x) => x.id === 'bikeSev')!;
    expect(d.get(s)).toBeNaN();
    expect(d.why!(s)).toBe('no encounters');
    expect(vulnerableSentence(b, s)).toContain('biking severity (MAIS 3+) unavailable');
    expect(MODE_CARDS[0].metrics.find((x) => x.id === 'bikeUnsup')!.get(s)).toBe(7);
  });
  it('identifies a result with the old safety meaning instead of reading it', () => {
    const { safetyVersion: _v, pedestrian: _p, cyclist: _c, ...rest } = b.vulnerable!;
    const old = { ...b, vulnerable: { ...rest, pedInjuryRiskIndex: 0.05, bikeInjuryRiskIndex: 0.07 } } as unknown as Metrics;
    expect(isLegacySafety(old)).toBe(true);
    expect(vulnerableSentence(old, old)).toBe('');
    const d = MODE_CARDS[0].metrics.find((x) => x.id === 'bikeSev')!;
    expect(d.get(old)).toBeNaN();
    expect(d.why!(old)).toMatch(/older safety definition/);
  });
  it('is empty without multimodal data', () => {
    const old = { ...b, modes: undefined, vulnerable: undefined } as Metrics;
    expect(vulnerableSentence(old, old)).toBe('');
    expect(hasModes(old)).toBe(false);
  });
  it('flags empty modes', () => {
    const zero = { inNetwork: 0, completedTrips: 0, meanTripTime: 0 };
    const none = { ...b, modes: { ...b.modes!, bicycle: zero, pedestrian: { ...zero, meanCrossingDelay: 0 } } };
    expect(emptyMode('vulnerable', [none, none])).toMatch(/No people walking or biking/);
    expect(emptyMode('vulnerable', [b, b])).toBeNull();
  });
});
