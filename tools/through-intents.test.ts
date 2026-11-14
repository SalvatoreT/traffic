import { describe, expect, it } from 'vitest';
import { annotateFlows, intentOf, resolveIntents, type IntentFlow, type ThroughIntentsCfg } from './lib/through-intents';

const groups = { groups: ['n', 's', 'w', 'fw'].map((id) => ({ id, label: id, gates: [], nodes: [] })), sets: { south: ['s'] } };
const mk = (over: Partial<ThroughIntentsCfg['intents'][number]> = {}): ThroughIntentsCfg => ({
  intents: [
    { id: 'a', label: 'A', fromGroups: ['n'], toGroups: ['fw'], basis: 'observed', note: 'x' },
    { id: 'b', label: 'B', fromGroups: ['n', 'w'], toGroups: ['south', 'fw'], avoids: 'Main', basis: 'assumed', note: 'y', ...over },
  ],
});

describe('through intents', () => {
  it('the first matching reason wins and sets expand', () => {
    const r = resolveIntents(mk(), groups);
    expect(intentOf(r, 'n', 'fw')).toBe(0);
    expect(intentOf(r, 'n', 's')).toBe(1);
    expect(intentOf(r, 'w', 'fw')).toBe(1);
    expect(intentOf(r, 's', 'n')).toBe(-1);
  });
  it('tags car flows, leaves volumes and other modes alone, and never tags a trip with an end in the study area', () => {
    const r = resolveIntents(mk(), groups);
    const of: Record<number, string> = { 1: 'n', 2: 'fw', 3: 's', 4: 'study-area' };
    const flows = [
      { origin: 1, destination: 2, vehPerHour: 10 }, { origin: 1, destination: 3, vehPerHour: 5 },
      { origin: 1, destination: 4, vehPerHour: 7 }, { origin: 1, destination: 2, vehPerHour: 3, mode: 'bicycle' },
    ] as (IntentFlow & { vehPerHour: number })[];
    const vol = annotateFlows(flows, r, (id) => of[id]);
    expect(flows.map((f) => f.intent)).toEqual([0, 1, undefined, undefined]);
    expect(vol).toEqual([10, 5, 7]);
  });
  it('stops on a bad config', () => {
    expect(() => resolveIntents(mk({ fromGroups: ['nowhere'] }), groups)).toThrow(/unknown/);
    expect(() => resolveIntents(mk({ id: 'a' }), groups)).toThrow(/repeated/);
    expect(() => resolveIntents(mk({ fromGroups: ['study-area'] }), groups)).toThrow(/study area/);
    expect(() => resolveIntents(mk({ basis: 'guess' as never }), groups)).toThrow(/basis/);
  });
});
