import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { bestForText, detourText, objectiveTags, parseProposals, allProposals } from './proposals';
import { methodologyText } from './methodology';

describe('objective tags', () => {
  it('lists the goals in a fixed order, whatever order the file wrote', () => {
    expect(objectiveTags({ objectives: ['fewest-changes', 'most-removed'] })).toEqual(['most cut-through removed', 'fewest changes']);
    expect(bestForText({ objectives: ['no-closures', 'least-detour'] })).toBe('Best for: no street closures, most removed after counting residents\' detour');
  });
  it('shows nothing for an option with no tag, and ignores an id it does not know', () => {
    expect(objectiveTags({})).toEqual([]);
    expect(bestForText({})).toBe('');
    expect(objectiveTags({ objectives: ['something-new'] })).toEqual([]);
  });
  it('reads a file written before objectives as options with no tags and no detour', () => {
    const file = parseProposals(readFileSync(new URL('../fixtures/explore-v5-sample.json', import.meta.url), 'utf8'));
    expect(file).not.toBeNull();
    for (const p of allProposals(file!)) {
      expect(objectiveTags(p)).toEqual([]);
      expect(detourText(p.residentsDetour)).toBeNull();
    }
  });
});

describe('residents detour', () => {
  it('says seconds per resident trip with the interval and the total', () => {
    const d = detourText({ secondsPerTrip: 3.46, vehicleMinutesPerHour: 41.2, effect: { n: 10, mean: 3.46, sd: 1, interval: [2.5, 4.4], status: 'increase' } })!;
    expect(d.figure).toBe('+3.5 s');
    expect(d.label).toBe('per resident trip');
    expect(d.detail).toContain('+41 vehicle-minutes an hour');
    expect(d.detail).toContain('95% interval +2.5 s to +4.4 s over 10 runs');
  });
  it('writes a shorter trip with a minus sign', () => {
    expect(detourText({ secondsPerTrip: -1.2, vehicleMinutesPerHour: -5, effect: { n: 3, mean: -1.2, sd: 1, status: 'insufficient' } })!.figure).toBe('−1.2 s');
  });
});

describe('methodology copy for objectives', () => {
  it('says options are chosen for different goals and tagged', () => {
    const t = methodologyText('Area', { status: 'uncalibrated', note: 'n' });
    expect(t).toContain('chosen for different goals');
    expect(t).toContain('tags each option');
  });
});
