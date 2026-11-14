import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildIndex } from './naming';
import { describeIntervention } from './describe';

describe('one-way labels', () => {
  const { network: net } = buildFixture();
  const idx = buildIndex(net);
  const label = (link: number) => describeIntervention({ type: 'one_way', link }, net, idx);

  it('say the compass direction of travel and the street it heads to', () => {
    for (const l of net.links.filter((k) => k.name).slice(0, 40)) {
      const text = label(l.id);
      expect(text).toMatch(/^One-way (north|east|south|west)bound on /);
      expect(text).not.toContain('keeping');
    }
  });

  it('read in plain words', () => {
    const texts = net.links.filter((k) => k.name).map((k) => label(k.id));
    expect(texts).toContain('One-way eastbound on Cedar St between Fir Way and Grove Way (toward Grove Way)');
    expect(texts.some((t) => t.includes('Unnamed road)') || t.includes('and Unnamed road'))).toBe(false);
  });

  it('name the same block in both directions with opposite compass words', () => {
    const l = net.links.find((k) => k.name && k.reverse !== null && k.reverse !== k.id)!;
    const a = label(l.id), b = label(l.reverse!);
    expect(a.replace(/ on .*/, '')).not.toBe(b.replace(/ on .*/, ''));
    expect(a.split(' on ')[1].split(' (')[0]).toBe(b.split(' on ')[1].split(' (')[0]);
  });
});
