import { describe, expect, it } from 'vitest';
import { mergeSamples } from './lib/redistribution-samples';

describe('stored route samples', () => {
  const s1 = new Map([['Telegraph Avenue', [1, 2, 3]], ['Alcatraz Avenue', [7, 8]]]);
  const s2 = new Map([['Telegraph Avenue', [3, 2, 1]], ['College Avenue', [4, 5]]]);
  const s3 = new Map([['College Avenue', [5, 4]]]);

  it('gives the same samples for any arrival order, from the lowest seed', () => {
    const a = mergeSamples([[1, s1], [2, s2], [3, s3]]);
    const b = mergeSamples([[3, s3], [2, s2], [1, s1]]);
    expect([...a]).toEqual([...b]);
    expect(a.get('Telegraph Avenue')).toEqual([1, 2, 3]);
    expect(a.get('College Avenue')).toEqual([4, 5]);
    expect(a.get('Alcatraz Avenue')).toEqual([7, 8]);
  });
});
