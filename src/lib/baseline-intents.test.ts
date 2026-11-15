import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import type { DemandIntent, Metrics } from '../types';
import { BASELINE_INTENTS_VERSION, baselineIntent, baselineVerdict, encodeBaselinePeriod, parseBaselineIntents, type BaselineIntents } from './baseline-intents';
import { buildIntentMap, keepNames } from './intentmap';
import { pathEnds, type IntentPaths } from './intents';
import { buildIndex } from './naming';
import { RUN_SECONDS } from './run';
import type { Loaded } from './stored-results';

const defs: DemandIntent[] = [{ id: 'a', label: 'A', basis: 'observed', note: '' }, { id: 'b', label: 'B', basis: 'assumed', note: '' }];
const metrics = { cutThrough: { vehiclesPerHour: 30, byIntent: [{ id: 'a', vehicles: 10, vehiclesPerHour: 10 }, { id: 'b', vehicles: 15, vehiclesPerHour: 15 }, { id: 'other', vehicles: 5, vehiclesPerHour: 5 }] } } as unknown as Metrics;
const links = new Float32Array([0, 3, 7200, 0, 4, 3600, 1, 5, 1800]);
const file = (over: Partial<BaselineIntents> = {}): BaselineIntents => ({
  version: BASELINE_INTENTS_VERSION, area: 'x', inputs: { networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), simulator: 'c'.repeat(32) },
  seed: 1, seconds: RUN_SECONDS, computed: 't', periods: { pm_peak: encodeBaselinePeriod(metrics, links)! }, ...over,
});
const loaded: Loaded = { area: 'x', networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), simulator: 'c'.repeat(32) };

describe('baseline intents file', () => {
  it('applies only when every input matches what is loaded', () => {
    expect(baselineVerdict(file(), loaded)).toBe('ok');
    expect(baselineVerdict(file(), { ...loaded, demandHash: 'd'.repeat(64) })).toBe('demand');
    expect(baselineVerdict(file(), { ...loaded, networkHash: null })).toBe('network');
    expect(baselineVerdict(file(), { ...loaded, simulator: null })).toBe('simulator');
    expect(baselineVerdict(file(), { ...loaded, area: 'y' })).toBe('area');
    expect(baselineVerdict(file({ seconds: 60 }), loaded)).toBe('run');
  });
  it('round trips and rejects anything else', () => {
    expect(parseBaselineIntents(JSON.stringify(file()))).not.toBeNull();
    expect(parseBaselineIntents('<html>')).toBeNull();
    expect(parseBaselineIntents(JSON.stringify({ ...file(), version: 9 }))).toBeNull();
  });
  it('gives a reason its cars an hour and its links over the run', () => {
    const r = baselineIntent(file(), 'pm_peak', defs, 'a')!;
    expect(r.vph).toBe(10);
    expect(r.paths.segments.map((s) => [s.link, Math.round(s.vph)])).toEqual([[3, 7200], [4, 3600]].map(([l, v]) => [l, v / (RUN_SECONDS / 3600)]).map(([l, v]) => [l, Math.round(v)]));
    expect(baselineIntent(file(), 'am_peak', defs, 'a')).toBeNull();
    expect(baselineIntent(file(), 'pm_peak', defs, 'zzz')).toBeNull();
  });
  it('writes no entry when the run has no intents', () => {
    expect(encodeBaselinePeriod({ cutThrough: { vehiclesPerHour: 1 } } as unknown as Metrics, links)).toBeNull();
  });
});

describe('the static map of a reason', () => {
  const net = buildFixture().network;
  const idx = buildIndex(net);
  const local = net.links.filter((l) => l.inStudyArea && (l.class === 'residential' || l.class === 'service')).slice(0, 3);
  const paths: IntentPaths = { id: 'a', total: 30, maxVph: 30, segments: local.map((l, i) => ({ link: l.id, vph: 30 - i * 5 })) };
  it('draws every path link wider for more cars, with a direction arrow per long link', () => {
    const m = buildIntentMap(net, idx, paths);
    expect(m.lines.length).toBeLessThanOrEqual(local.length);
    const w = m.lines.map((l) => [l.vph, l.w]).sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < w.length; i++) expect(w[i][1]).toBeGreaterThanOrEqual(w[i - 1][1]);
    expect(m.arrows.length).toBeLessThanOrEqual(m.lines.length);
    expect(m.view.w).toBeGreaterThan(0);
  });
  it('names where a path starts and ends from its arterial crossings', () => {
    const e = pathEnds(net, idx, paths);
    expect(Array.isArray(e.from) && Array.isArray(e.to)).toBe(true);
  });
});

describe('street names on a reason map', () => {
  const end = { kind: 'to' as const, street: 'Alcatraz Avenue', text: 'To Alcatraz Avenue', x: 100, y: 100, anchor: 'start' as const, dot: { x: 90, y: 107 } };
  const name = (text: string, x: number, y: number) => ({ text, x, y, angle: 0 });
  it('drops the name of the street a From or To label already names, wherever it sits', () => {
    expect(keepNames([name('Alcatraz Avenue', 400, 400)], [end], 1, 11)).toEqual([]);
  });
  it('drops a name whose text would run under the label, keeps one clear of it', () => {
    expect(keepNames([name('College Avenue', 140, 100), name('Telegraph Avenue', 300, 300)], [end], 1, 11).map((n) => n.text)).toEqual(['Telegraph Avenue']);
  });
});
