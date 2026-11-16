import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { buildFixture } from '../fixtures/area';
import { decodeScenario, encodeScenario } from './hash';
import { buildIndex } from './naming';
import { describeIntervention } from './describe';
import { addInterventions, interventionKey } from './scenario';
import { blockActions, interventionsAt, type Selection } from './selection';
import { SLOW_STREET_MPS, expandSlowStreets, slowStreetLabel, streetRun } from './slowstreet';
import { canonicalItems } from './stored-results';
import type { Intervention, Network } from '../types';

const clone = (): Network => JSON.parse(JSON.stringify(buildFixture().network));
const nodeAt = (n: Network, i: number, j: number) => n.nodes.find((q) => Math.hypot(q.x - (i - 2.5) * 120, q.y - (j - 2.5) * 120) < 1e-6)!;
const between = (n: Network, a: [number, number], b: [number, number]) => {
  const A = nodeAt(n, ...a), B = nodeAt(n, ...b);
  return n.links.find((l) => l.from === A.id && l.to === B.id)!;
};

describe('Slow Street on the fixture grid', () => {
  const net = clone();
  const first = between(net, [1, 2], [2, 2]);
  const last = between(net, [4, 2], [3, 2]);

  it('takes the whole street whichever block is chosen', () => {
    const a = streetRun(net, first.id)!, b = streetRun(net, last.id)!;
    expect(a).toEqual(b);
    expect(a.name).toBe('Cedar St');
    expect(a.blocks.length).toBe(5);
    expect(a.canonical).toBe(Math.min(...a.blocks.flat()));
    expect(a.split).toBe(false);
    expect(slowStreetLabel(a)).toBe('Slow Street on Cedar St (15 mph, East Edge Ave to West Edge Ave)');
  });

  it('labels through the app description', () => {
    const idx = buildIndex(net);
    expect(describeIntervention({ type: 'slow_street', link: first.id }, net, idx)).toBe('Slow Street on Cedar St (15 mph, East Edge Ave to West Edge Ave)');
  });

  it('round trips, and every block of a street writes the same link', () => {
    const one = encodeScenario(net, [{ type: 'slow_street', link: first.id }]);
    const two = encodeScenario(net, [{ type: 'slow_street', link: last.id }]);
    expect(one).toBe(two);
    expect(one).toMatch(/s=ss,[0-9a-z]{10}$/);
    const back = decodeScenario(net, one);
    expect(back.invalid).toBe(false);
    expect(back.unplaced).toEqual([]);
    expect(back.interventions).toEqual([{ type: 'slow_street', link: streetRun(net, first.id)!.canonical }]);
    expect(encodeScenario(net, back.interventions)).toBe(one);
  });

  it('keeps one stored-result key for one Slow Street', () => {
    expect(canonicalItems(net, [{ type: 'slow_street', link: first.id }])).toBe(canonicalItems(net, [{ type: 'slow_street', link: last.id }]));
  });

  it('rejects a parameter and ignores an unnamed block', () => {
    expect(decodeScenario(net, '#v1;s=ss,9q9p610uux,5').invalid).toBe(true);
    const unnamed = clone();
    unnamed.links.filter((l) => l.name === 'Cedar St').forEach((l) => { l.name = ''; });
    expect(encodeScenario(unnamed, [{ type: 'slow_street', link: first.id }])).toBe('');
    expect(expandSlowStreets(unnamed, [{ type: 'slow_street', link: first.id }])).toEqual([]);
  });

  it('expands to per-block 15 mph limits and never raises a slower block', () => {
    const slowed = clone();
    const k = between(slowed, [2, 2], [3, 2]);
    k.speedLimit = 6; slowed.links[k.reverse!].speedLimit = 6;
    const out = expandSlowStreets(slowed, [{ type: 'slow_street', link: first.id }, { type: 'modal_filter', link: between(slowed, [2, 1], [3, 1]).id }]);
    const limits = out.filter((iv): iv is Extract<Intervention, { type: 'speed_limit' }> => iv.type === 'speed_limit');
    expect(limits.length).toBe(4);
    expect(limits.every((iv) => iv.speed === SLOW_STREET_MPS)).toBe(true);
    expect(limits.some((iv) => iv.link === k.id || iv.link === k.reverse)).toBe(false);
    expect(out.filter((iv) => iv.type === 'modal_filter').length).toBe(1);
  });

  it('is one scenario item that replaces itself and sits on every block of its street', () => {
    const a: Intervention = { type: 'slow_street', link: streetRun(net, first.id)!.canonical };
    expect(addInterventions([a], [a]).length).toBe(1);
    expect(interventionKey(a)).toBe(`ss-${a.link}`);
    const idx = buildIndex(net);
    const sel = (l: number): Selection => ({ kind: 'block', block: idx.blockOfLink[l], point: null, nearLink: null, via: 'list' });
    expect(interventionsAt(net, idx, sel(last.id), [a])).toEqual([0]);
    expect(interventionsAt(net, idx, sel(between(net, [2, 1], [3, 1]).id), [a])).toEqual([]);
  });

  it('is offered first in the editor, until the street is a Slow Street', () => {
    const idx = buildIndex(net);
    const sel: Extract<Selection, { kind: 'block' }> = { kind: 'block', block: idx.blockOfLink[first.id], point: null, nearLink: null, via: 'list' };
    const offer = blockActions(net, idx, sel, []).slowStreet!;
    expect(offer.link).toBe(streetRun(net, first.id)!.canonical);
    expect(offer.label.startsWith('Slow Street on Cedar St')).toBe(true);
    expect(blockActions(net, idx, sel, [{ type: 'slow_street', link: offer.link }]).slowStreet).toBeNull();
  });

  it('opens an old link with per-block limits as before', () => {
    const old = encodeScenario(net, [{ type: 'speed_limit', link: first.id, speed: 6.71 }]);
    expect(old).toMatch(/s=sl,/);
    expect(decodeScenario(net, old).interventions).toEqual([{ type: 'speed_limit', link: first.id, speed: 6.71 }]);
  });
});

describe('a street split by a gap', () => {
  it('takes the connected run that holds the chosen block and says so', () => {
    const net = clone();
    const gapA = between(net, [3, 2], [4, 2]);
    for (const id of [gapA.id, gapA.reverse!]) net.links[id].inStudyArea = false;
    const west = streetRun(net, between(net, [1, 2], [2, 2]).id)!;
    const east = streetRun(net, between(net, [4, 2], [5, 2]).id)!;
    expect(west.blocks.length).toBeGreaterThan(0);
    expect(west.blocks.flat().some((l) => east.blocks.flat().includes(l))).toBe(false);
    expect(west.split && east.split).toBe(true);
    expect(slowStreetLabel(west)).toContain('this connected stretch only');
  });
});

describe('the real network', () => {
  const path = new URL('../../public/data/rockridge.network.json', import.meta.url);
  const real = existsSync(path);
  it.runIf(real)('covers every in-study block of Colby Street and Hillegass Avenue and matches the engine expansion', () => {
    const net = JSON.parse(readFileSync(path, 'utf8')) as Network;
    for (const name of ['Colby Street', 'Hillegass Avenue']) {
      const any = net.links.find((l) => l.name.trim() === name && l.inStudyArea)!;
      const run = streetRun(net, any.id)!;
      const ids = run.blocks.flat();
      expect(ids.length).toBeGreaterThanOrEqual(6);
      expect(ids.every((l) => net.links[l].name.trim() === name && net.links[l].inStudyArea)).toBe(true);
      const link = encodeScenario(net, [{ type: 'slow_street', link: ids[Math.floor(ids.length / 2)] }]);
      expect(decodeScenario(net, link).interventions).toEqual([{ type: 'slow_street', link: run.canonical }]);
      expect(expandSlowStreets(net, [{ type: 'slow_street', link: any.id }]).length).toBe(run.blocks.length);
      expect(slowStreetLabel(run).startsWith(`Slow Street on ${name} (15 mph, `)).toBe(true);
    }
  });
});
