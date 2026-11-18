import { describe, expect, it } from 'vitest';
import { PICTO_PX, pictoGeometry, pictoOf, pictoSvg, rotationOfHeading, symbolOf, type PictoId } from './signs';
import { turnKindOf } from './turnkind';
import { buildFixture } from '../fixtures/area';
import type { ControlType } from '../types';

const MAP: PictoId[] = ['stop', 'all_way_stop', 'signal', 'uncontrolled', 'signal_timing', 'speed_hump', 'traffic_circle', 'one_way', 'turn_ban_left', 'turn_ban_right', 'turn_ban'];

describe('pictures', () => {
  it('picks the picture from the type and, for a control, its value', () => {
    const c = (control: ControlType) => pictoOf({ type: 'control', control });
    expect([c('two_way_stop'), c('all_way_stop'), c('signal'), c('uncontrolled'), c('traffic_circle')]).toEqual(['stop', 'all_way_stop', 'signal', 'uncontrolled', 'traffic_circle']);
    expect(pictoOf({ type: 'signal_timing' })).toBe('signal_timing');
    expect(pictoOf({ type: 'speed_limit' })).toBeNull();
    expect(pictoOf({ type: 'slow_street' })).toBeNull();
  });
  it('draws every picture with shapes and no two with the same geometry', () => {
    const seen = new Set<string>();
    for (const id of MAP) {
      const g = pictoGeometry(id, PICTO_PX);
      expect(g.shapes.length).toBeGreaterThan(1);
      seen.add(JSON.stringify(g));
    }
    expect(seen.size).toBe(MAP.length);
  });
  it('leaves the word off a stop sign drawn too small to read it', () => {
    expect(pictoGeometry('stop', PICTO_PX).texts.map((t) => t.text)).toEqual(['STOP']);
    expect(pictoGeometry('stop', 20).texts).toEqual([]);
    expect(pictoGeometry('all_way_stop', 20).texts.map((t) => t.text)).toEqual(['ALL']);
  });
  it('writes SVG that carries the title and the turn', () => {
    const s = pictoSvg('one_way', 28, { title: 'One-way <street>', rotate: 90 });
    expect(s).toContain('rotate(90)');
    expect(s).toContain('<title>One-way &lt;street&gt;</title>');
  });
  it('turns a heading east to 0 and north to -90 degrees on the page', () => {
    expect(rotationOfHeading(0)).toBe(0);
    expect(rotationOfHeading(Math.PI / 2)).toBe(-90);
  });
  it('draws a turn ban as a left, right or fallback sign from the geometry of its two links', () => {
    const net = buildFixture().network;
    const seen = new Map<string, PictoId | null>();
    for (const a of net.links) for (const b of net.links.filter((l) => l.from === a.to)) {
      const kind = turnKindOf(net, a.id, b.id);
      if (kind) seen.set(kind, pictoOf(symbolOf({ type: 'turn_ban', fromLink: a.id, toLink: b.id }, net)));
    }
    expect(seen.get('left')).toBe('turn_ban_left');
    expect(seen.get('right')).toBe('turn_ban_right');
    for (const k of ['u-turn', 'straight']) if (seen.has(k)) expect(seen.get(k)).toBe('turn_ban');
  });
});
