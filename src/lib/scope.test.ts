import { describe, expect, it } from 'vitest';
import { blockMeasured, linkMeasured } from './scope';

describe('measured streets', () => {
  it('are the residential and service streets inside the study area', () => {
    expect(linkMeasured({ inStudyArea: true, class: 'residential' })).toBe(true);
    expect(linkMeasured({ inStudyArea: true, class: 'service' })).toBe(true);
    expect(linkMeasured({ inStudyArea: true, class: 'secondary' })).toBe(false);
    expect(linkMeasured({ inStudyArea: false, class: 'residential' })).toBe(false);
    expect(blockMeasured({ inStudyArea: true, cls: 'tertiary' })).toBe(false);
    expect(blockMeasured({ inStudyArea: true, cls: 'residential' })).toBe(true);
  });
});
