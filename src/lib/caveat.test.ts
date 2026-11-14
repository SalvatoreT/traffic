import { describe, expect, it } from 'vitest';
import { calibrationCaveat, showCalibrationBanner } from './caveat';

describe('calibration caveat', () => {
  it('reads the caveat and trims it', () => {
    expect(calibrationCaveat({ status: 'calibrated', caveat: '  Limits.  ' } as never)).toBe('Limits.');
    expect(calibrationCaveat({ status: 'calibrated' })).toBeNull();
    expect(calibrationCaveat(undefined)).toBeNull();
  });
  it('keeps the banner for an uncalibrated area and for a calibrated one with a caveat', () => {
    expect(showCalibrationBanner(undefined)).toBe(true);
    expect(showCalibrationBanner({ status: 'uncalibrated' })).toBe(true);
    expect(showCalibrationBanner({ status: 'calibrated' })).toBe(false);
    expect(showCalibrationBanner({ status: 'calibrated', caveat: 'x' } as never)).toBe(true);
  });
});
