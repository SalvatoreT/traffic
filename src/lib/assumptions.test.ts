import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseAssumptions } from './assumptions';

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
