import { describe, expect, it } from 'vitest';
import { badgeKey, mapSymbols } from './legend';
import { BADGE_NAME } from './mapexport';

describe('map symbols', () => {
  it('lists a key for each mark the scenario draws, and none for the rest', () => {
    expect(mapSymbols([], false)).toEqual({ bar: false, diverter: false, badges: [], reason: false });
    const s = mapSymbols([{ type: 'modal_filter' }, { type: 'diagonal_diverter' }, { type: 'speed_hump' }, { type: 'control', control: 'signal' }, { type: 'speed_hump' }], true);
    expect(s).toEqual({ bar: true, diverter: true, badges: ['speed_hump', 'signal'], reason: true });
  });
  it('keys each control value by its own picture and shows only those present', () => {
    const controls = (['two_way_stop', 'all_way_stop', 'signal', 'uncontrolled', 'traffic_circle'] as const).map((control) => ({ type: 'control' as const, control }));
    expect(mapSymbols(controls, false).badges).toEqual(['traffic_circle', 'stop', 'all_way_stop', 'signal', 'uncontrolled']);
    expect(mapSymbols(controls.slice(1, 2), false).badges).toEqual(['all_way_stop']);
    expect(mapSymbols([{ type: 'traffic_circle' }, { type: 'control', control: 'traffic_circle' }], false).badges).toEqual(['traffic_circle']);
  });
  it('names each picture in words and never in letters', () => {
    expect(badgeKey('turn_ban_left').label).toBe('Left-turn arrow in a red slashed circle: left turn banned');
    expect(badgeKey('turn_ban_right').label).toBe('Right-turn arrow in a red slashed circle: right turn banned');
    expect(badgeKey('stop').label).toBe('Red stop sign: intersection changed to a two-way stop');
    expect(badgeKey('all_way_stop').label).toContain('ALL plaque');
    expect(badgeKey('signal').label).toMatch(/^Traffic light:/);
    expect(badgeKey('signal_timing').label).toMatch(/^Traffic light with a clock:/);
    const all = mapSymbols([{ type: 'one_way' }, { type: 'traffic_circle' }, { type: 'signal_timing' }, { type: 'turn_ban', turn: 'right' }, { type: 'speed_hump' }, { type: 'control', control: 'uncontrolled' }], false).badges;
    expect(all).toHaveLength(6);
    for (const t of all) { expect(badgeKey(t).picto).toBe(t); expect(badgeKey(t).label).not.toMatch(/\b(IC|ST|SH|TC|1W|TB)\b/); }
    expect(badgeKey('speed_hump').label).toContain(BADGE_NAME.speed_hump);
  });
  it('keys a Slow Street as a 15 mph sign, not letters', () => {
    const k = badgeKey('slow_street');
    expect(k.sign).toBe(15);
    expect(k.label).toBe('15 mph sign: Slow Street (speed limit 15 mph on the whole street)');
    expect(JSON.stringify(k)).not.toContain('SS');
    expect(badgeKey('speed_limit').sign).toBeDefined();
  });
});
