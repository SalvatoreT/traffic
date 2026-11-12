import { describe, expect, it } from 'vitest';
import { formatDiff, formatValue } from './format';
import { MODE_CARDS, emptyMode, hasModes, summarize, vulnerableSentence } from './metrics';
import { MockSimulation } from '../sim/mock';
import { buildFixture } from '../fixtures/area';
import type { Metrics } from '../types';

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
    const speed = MODE_CARDS[1].metrics.find((d) => d.id === 'busSpeed')!;
    expect(formatDiff(10, 8, delay.kind, delay.lowerIsBetter).verdict).toBe('better');
    expect(formatDiff(5, 4, speed.kind, speed.lowerIsBetter).verdict).toBe('worse');
  });
});

describe('mock multimodal output', () => {
  const m = run(120);
  it('has all four kinds in the vehicle buffer', () => {
    const sim = new MockSimulation(JSON.stringify(bundle.network), JSON.stringify(bundle.demand), JSON.stringify({ seed: 1, period: bundle.demand.periods[0].id, demandScale: 1 }));
    const v = sim.vehicles();
    const kinds = new Set<number>();
    for (let i = 4; i < v.length; i += 6) kinds.add(v[i]);
    expect([...kinds].sort()).toEqual([0, 1, 2, 3]);
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
  const b = withModes(run(60), { pedConflicts: 10, bikeConflicts: 4, pedInjuryRiskIndex: 2, bikeInjuryRiskIndex: 1 });
  it('states the change in words', () => {
    const s = withModes(b, { pedConflicts: 5, bikeConflicts: 4, pedInjuryRiskIndex: 1, bikeInjuryRiskIndex: 1 });
    const t = vulnerableSentence(b, s);
    expect(t).toContain('pedestrian conflicts down 50%, better');
    expect(t).toContain('cyclist conflicts about the same');
    expect(summarize(b, s)).toContain('people walking and biking');
  });
  it('is empty without multimodal data', () => {
    const old = { ...b, modes: undefined, vulnerable: undefined } as Metrics;
    expect(vulnerableSentence(old, old)).toBe('');
    expect(hasModes(old)).toBe(false);
  });
  it('flags empty modes', () => {
    const none = { ...b, modes: { ...b.modes!, bus: { inNetwork: 0, completedRuns: 0, meanRunTime: 0, meanSpeed: 0 } } };
    expect(emptyMode('bus', [none, none])).toMatch(/No buses/);
    expect(emptyMode('bus', [b, b])).toBeNull();
  });
});
