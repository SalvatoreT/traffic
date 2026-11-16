import { describe, expect, it } from 'vitest';
import { blockMeasured, linkMeasured, scopeFromSearch } from './scope';
import { boundingMeanSpeed } from './metrics';
import { buildFixture } from '../fixtures/area';

describe('measured scope', () => {
  it('reads the preview switch', () => {
    expect(scopeFromSearch('')).toBe('study');
    expect(scopeFromSearch('?shade=interior')).toBe('interior');
  });
  it('shades study-area streets only, or only their side streets in interior scope', () => {
    expect(linkMeasured({ inStudyArea: false, class: 'residential' }, 'study')).toBe(false);
    expect(linkMeasured({ inStudyArea: true, class: 'secondary' }, 'study')).toBe(true);
    expect(linkMeasured({ inStudyArea: true, class: 'secondary' }, 'interior')).toBe(false);
    expect(linkMeasured({ inStudyArea: true, class: 'service' }, 'interior')).toBe(true);
    expect(blockMeasured({ inStudyArea: true, cls: 'tertiary' }, 'interior')).toBe(false);
    expect(blockMeasured({ inStudyArea: false, cls: 'residential' }, 'study')).toBe(false);
  });
  it('has no bounding speed without stats', () => {
    expect(boundingMeanSpeed(buildFixture().network, null)).toBeNaN();
  });
});
