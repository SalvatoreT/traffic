import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { menuSymbol, menuSymbolHtml } from './menusymbols';
import { CONTROL_CHOICES } from './selection';

const net = buildFixture().network;
const link = net.links.find((l) => l.inStudyArea)!;

describe('add-intervention menu pictures', () => {
  it('shows each control choice by its own sign', () => {
    const got = Object.fromEntries(CONTROL_CHOICES.map((c) => [c.value, menuSymbol({ type: 'control', node: 0, control: c.value }, net)]));
    expect(got).toEqual({ all_way_stop: { picto: 'all_way_stop' }, two_way_stop: { picto: 'stop' }, signal: { picto: 'signal' }, uncontrolled: { picto: 'uncontrolled' } });
  });
  it('shows the other choices by the mark they place', () => {
    expect(menuSymbol({ type: 'modal_filter', link: link.id }, net)).toEqual({ picto: 'modal_filter' });
    expect(menuSymbol({ type: 'speed_hump', link: link.id, position: 5 }, net)).toEqual({ picto: 'speed_hump' });
    expect(menuSymbol({ type: 'traffic_circle', node: 0 }, net)).toEqual({ picto: 'traffic_circle' });
    expect(menuSymbol({ type: 'signal_timing', node: 0, cycle: 90 }, net)).toEqual({ picto: 'signal_timing' });
    expect(menuSymbol({ type: 'diagonal_diverter', node: 0, bearing: 45 }, net)).toEqual({ picto: 'diagonal_diverter' });
    expect(menuSymbol({ type: 'speed_limit', link: link.id, speed: 8.94 }, net)).toEqual({ mph: 20 });
    expect(menuSymbol({ type: 'slow_street', link: link.id }, net)).toEqual({ mph: 15 });
  });
  it('turns a one-way choice to the direction it opens', () => {
    const s = menuSymbol({ type: 'one_way', link: link.id }, net);
    expect(s).toMatchObject({ picto: 'one_way' });
    expect(Number.isFinite((s as { rotate: number }).rotate)).toBe(true);
  });
  it('writes decorative SVG', () => {
    const html = menuSymbolHtml({ picto: 'stop' });
    expect(html).toContain('aria-hidden="true"');
    expect(menuSymbolHtml({ mph: 20 })).toContain('<svg');
  });
});
