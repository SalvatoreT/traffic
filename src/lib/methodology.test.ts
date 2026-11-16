import { describe, expect, it } from 'vitest';
import { BUILD_STEPS, CUT_TRIPS, PROPOSAL_STEPS, methodologyText } from './methodology';

const cal = { status: 'uncalibrated' as const, note: 'Not calibrated: an example note.' };

describe('methodology copy', () => {
  const text = methodologyText('Example Area', cal);
  it('stays short enough to read in a few minutes', () => {
    const words = text.split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(450);
    expect(words).toBeLessThanOrEqual(650);
  });
  it('names the area it is given and no equations or private names', () => {
    expect(text).toContain('Example Area');
    expect(text).not.toMatch(/owner|=|Rockridge/i);
  });
  it('reads the calibration status from the area entry', () => {
    expect(text).toContain('Preview, not yet calibrated.');
    expect(text).toContain('an example note');
    expect(methodologyText('A', { status: 'calibrated' })).toContain('Calibrated, with limits.');
  });
  it('has the steps each diagram draws', () => {
    expect(BUILD_STEPS).toHaveLength(4);
    expect(PROPOSAL_STEPS).toHaveLength(5);
    expect(CUT_TRIPS.map((t) => t.n)).toEqual([1, 2, 3]);
  });
});
