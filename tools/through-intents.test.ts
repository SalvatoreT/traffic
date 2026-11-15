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

describe('reasons keyed by a freeway ramp', () => {
  const ramps = [{ id: 'on-1', kind: 'on' as const, label: 'To SR-9 by the Main St on-ramp' }, { id: 'off-2', kind: 'off' as const, label: 'From the SR-9 off-ramp at Oak St' }];
  const cfg: ThroughIntentsCfg = {
    sections: [{ id: 'on', title: 'To the freeway, by on-ramp' }, { id: 'none', title: 'Not using the freeway' }],
    intents: [
      { id: 'to-1', section: 'on', onRamp: 'on-1', basis: 'observed', note: 'x' },
      { id: 'to-other', section: 'on', onRamp: 'other', label: 'Other on-ramps', basis: 'assumed', note: 'y' },
      { id: 'from-2', offRamp: 'off-2', basis: 'assumed', note: 'z' },
      { id: 'od', section: 'none', label: 'Cross-town', fromGroups: ['s'], toGroups: ['n'], basis: 'assumed', note: 'w' },
    ],
  };
  it('takes the ramp label and the section title, and leaves group matching to the other reasons', () => {
    const r = resolveIntents(cfg, groups, ramps);
    expect(r.map((x) => x.out.label)).toEqual(['To SR-9 by the Main St on-ramp', 'Other on-ramps', 'From the SR-9 off-ramp at Oak St', 'Cross-town']);
    expect(r.map((x) => x.out.section)).toEqual(['To the freeway, by on-ramp', 'To the freeway, by on-ramp', undefined, 'Not using the freeway']);
    expect(r[0].out.onRamp).toBe('on-1');
    expect(r[2].out.offRamp).toBe('off-2');
    expect(intentOf(r, 's', 'n')).toBe(3);
    const flows = [{ origin: 1, destination: 2, vehPerHour: 4 }] as (IntentFlow & { vehPerHour: number })[];
    annotateFlows(flows, r, (id) => (id === 1 ? 's' : 'n'));
    expect(flows[0].intent).toBe(3);
  });
  it('stops on a ramp the network does not have, a wrong kind or a missing label', () => {
    expect(() => resolveIntents({ intents: [{ id: 'a', onRamp: 'off-2', basis: 'assumed', note: 'x' }] }, groups, ramps)).toThrow(/no on-ramp/);
    expect(() => resolveIntents({ intents: [{ id: 'a', onRamp: 'nope', basis: 'assumed', note: 'x' }] }, groups, ramps)).toThrow(/no on-ramp/);
    expect(() => resolveIntents({ intents: [{ id: 'a', onRamp: 'other', basis: 'assumed', note: 'x' }] }, groups, ramps)).toThrow(/label/);
    expect(() => resolveIntents({ intents: [{ id: 'a', section: 'zz', onRamp: 'on-1', basis: 'assumed', note: 'x' }] }, groups, ramps)).toThrow(/section/);
  });
});
