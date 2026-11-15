import { describe, expect, it } from 'vitest';
import { badgeKey, mapSymbols } from './legend';
import { BADGE_NAME, BADGE_STYLE, BADGE_TEXT } from './mapexport';

describe('map symbols', () => {
  it('lists a key for each mark the scenario draws, and none for the rest', () => {
    expect(mapSymbols([], false)).toEqual({ bar: false, diverter: false, badges: [], reason: false });
    const s = mapSymbols([{ type: 'modal_filter' }, { type: 'diagonal_diverter' }, { type: 'speed_hump' }, { type: 'control' }, { type: 'speed_hump' }], true);
    expect(s).toEqual({ bar: true, diverter: true, badges: ['speed_hump', 'control'], reason: true });
  });
  it('names each badge with the one set of letters', () => {
    expect(badgeKey('turn_ban')).toEqual({ text: BADGE_TEXT.turn_ban, name: BADGE_NAME.turn_ban });
    for (const t of mapSymbols([{ type: 'speed_limit' }, { type: 'one_way' }, { type: 'traffic_circle' }, { type: 'signal_timing' }, { type: 'turn_ban' }], false).badges) expect(BADGE_STYLE[t]).toBeDefined();
  });
});
