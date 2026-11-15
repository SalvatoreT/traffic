import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { belowThresholdText, MAP_UNAVAILABLE, parseAssumptions } from './assumptions';

describe('assumptions file', () => {
  it('keeps the counted turns that are below the fit threshold, with their number and the note that no trips are assigned', () => {
    const text = JSON.stringify({
      version: 1, area: 'x', inputs: { demandHash: 'h' }, count: { label: 'c', measured: ['am_peak'], scaled: [] },
      movements: [{ id: 'm', label: 'M', maxDetour: 1.3, counted: { am_peak: 23 }, assigned: {}, intents: [], belowThreshold: { am_peak: 23 }, belowThresholdNote: 'No trips are assigned.' }],
    });
    const f = parseAssumptions(text.replace('"version":1', '"version":' + (JSON.parse(readFileSync('public/data/rockridge.assumptions.json', 'utf8')).version as number)));
    expect(f?.movements[0].belowThreshold).toEqual({ am_peak: 23 });
    expect(f?.movements[0].belowThresholdNote).toBe('No trips are assigned.');
  });
});

describe('belowThresholdText', () => {
  it('names periods in words', () => {
    const t = belowThresholdText("fit's minimum, no trips to it in am_peak and midday.", ['am_peak', 'midday'], (id) => (id === 'am_peak' ? 'AM peak' : 'Midday'));
    expect(t).toBe('fit’s minimum, no trips to it in AM peak and Midday.');
  });
  it('has a sentence for every unavailable status', () => {
    for (const s of ['loading', 'pending', 'missing', 'stale'] as const) expect(MAP_UNAVAILABLE[s]).toMatch(/^Map /);
  });
});

describe('Assumptions page layout', () => {
  const tsx = readFileSync('src/components/Assumptions.tsx', 'utf8');
  const css = readFileSync('src/components/assumptions.css', 'utf8');
  it('lists the reasons before the movements', () => {
    expect(tsx.indexOf('<Reasons defs=')).toBeGreaterThan(0);
    expect(tsx.indexOf('<Reasons defs=')).toBeLessThan(tsx.indexOf('<Movements file='));
  });
  it('makes both section headings sticky, below the top bar offset, and clears anchors and focus', () => {
    expect(tsx.match(/className="sticky-h"/g)).toHaveLength(2);
    expect(css).toMatch(/h3\.sticky-h \{[^}]*position: sticky; top: var\(--sticky-top\)/);
    expect(css).toMatch(/\.stage \{ scroll-padding-top: calc\(var\(--sticky-top\) \+ var\(--sticky-h\)/);
  });
});
