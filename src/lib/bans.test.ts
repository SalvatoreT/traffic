import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildIndex } from './naming';
import { decodeScenario, encodeScenario } from './hash';
import { banMarks, GROUP_BANS_MIN, groupBans, scenarioEntries } from './bans';
import { banCount, banHeadline, BAN_CAVEAT, detourHeadline, objectiveTags } from './proposals';
import type { Intervention } from '../types';

const net = buildFixture().network;
const idx = buildIndex(net);

/** Every legal movement (no U-turn) of the fixture, as turn bans. */
const movements: Intervention[] = net.links.flatMap((a) =>
  net.links.filter((b) => b.from === a.to && b.to !== a.from).map((b): Intervention => ({ type: 'turn_ban', fromLink: a.id, toLink: b.id })));

describe('a scenario with many turn bans', () => {
  it('has enough movements to test with', () => {
    expect(movements.length).toBeGreaterThanOrEqual(41);
  });

  it('lists a few bans one by one and folds many into one entry at the first one', () => {
    const few = movements.slice(0, GROUP_BANS_MIN - 1);
    expect(scenarioEntries(few).every((e) => e.kind === 'one')).toBe(true);
    const filter: Intervention = { type: 'speed_hump', link: 0, position: 5 };
    const many = [filter, ...movements.slice(0, 41), filter];
    const entries = scenarioEntries(many);
    expect(entries).toHaveLength(3);
    expect(entries[0]).toEqual({ kind: 'one', index: 0 });
    expect(entries[1]).toEqual({ kind: 'bans', indices: Array.from({ length: 41 }, (_, i) => i + 1) });
    expect(entries[2]).toEqual({ kind: 'one', index: 42 });
  });

  it('groups every ban by the street it starts on, each once', () => {
    const ivs = movements.slice(0, 41);
    const groups = groupBans(ivs, net, idx);
    expect(groups.flatMap((g) => g.bans)).toHaveLength(41);
    expect(new Set(groups.flatMap((g) => g.bans.map((b) => b.index))).size).toBe(41);
    expect(groups.map((g) => g.street)).toEqual([...groups.map((g) => g.street)].sort((a, b) => a.localeCompare(b)));
  });

  it('draws one mark for each intersection a ban starts at, and none merged below the threshold', () => {
    expect(banMarks(movements.slice(0, 3), net)).toBeNull();
    const ivs = movements.slice(0, 41);
    const marks = banMarks(ivs, net)!;
    const nodes = new Set(ivs.map((iv) => (iv.type === 'turn_ban' ? net.links[iv.fromLink].to : -1)));
    expect(marks).toHaveLength(nodes.size);
    expect(marks.reduce((s, m) => s + m.count, 0)).toBe(41);
  });

  it('round trips through a scenario link with 41 bans, with a link of modest length', () => {
    const ivs = movements.slice(0, 41);
    const link = encodeScenario(net, ivs);
    const back = decodeScenario(net, link);
    expect(back.interventions).toHaveLength(41);
    expect(back.interventions.map((iv) => (iv.type === 'turn_ban' ? `${iv.fromLink}-${iv.toLink}` : '')).sort())
      .toEqual(ivs.map((iv) => (iv.type === 'turn_ban' ? `${iv.fromLink}-${iv.toLink}` : '')).sort());
    expect(link.length).toBeLessThan(1500);
  });
});

describe('the card text for turn bans', () => {
  const set = [{ type: 'ban_set', label: 'No turns (41 turns)', bans: 41 }, { type: 'one_way', label: 'One-way' }];
  it('says the scale in the visible part and carries the standing caveat', () => {
    const h = banHeadline({ interventions: set, turnBans: 41 })!;
    expect(h.text).toBe('41 turn restrictions around the edge of the area');
    expect(h.caveat).toBe(BAN_CAVEAT);
    expect(BAN_CAVEAT).toMatch(/every driver, residents included, all day/);
    expect(BAN_CAVEAT).toMatch(/full compliance/);
  });
  it('counts single bans and shows nothing for a package without any', () => {
    const singles = [{ type: 'turn_ban', label: 'a' }, { type: 'turn_ban', label: 'b' }];
    expect(banCount({ interventions: singles })).toBe(2);
    expect(banHeadline({ interventions: [{ type: 'modal_filter', label: 'f' }] })).toBeNull();
    expect(banHeadline({ interventions: [{ type: 'turn_ban', label: 'a' }] })!.text).toBe('1 turn restriction around the edge of the area');
  });
  it('promotes the resident detour with its unit, and says so when it is unavailable', () => {
    const d = { method: 'requested-elapsed-to-cutoff', secondsPerTrip: 27.4, vehicleMinutesPerHour: 100, effect: { n: 10, mean: 27.4, sd: 1, half: 1 } } as never;
    expect(detourHeadline(d)).toEqual({ lead: 'Resident detour:', figure: '+27.4 s', label: 'per requested resident trip' });
    expect(detourHeadline(undefined)).toBeNull();
    expect(detourHeadline({ method: 'requested-elapsed-to-cutoff', secondsPerTrip: null } as never)!.figure).toBe('unavailable');
  });
  it('names the no-turn-restrictions objective after the others', () => {
    expect(objectiveTags({ objectives: ['no-turn-bans', 'most-removed'] })).toEqual(['most cut-through removed', 'no turn restrictions']);
  });
});
