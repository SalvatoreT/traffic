import { describe, expect, it } from 'vitest';
import { parseSeeds } from './lib/redistribution-cli';
import { parseArgs } from './lib/simulate-report';

describe('simulate --redistribution arguments', () => {
  it('reads seed lists and ranges', () => {
    expect(parseSeeds('1-10')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(parseSeeds('3,1,3')).toEqual([3, 1]);
    expect(() => parseSeeds('a')).toThrow(/--seeds/);
    expect(() => parseSeeds('5-1')).toThrow(/range/);
  });

  it('accepts the diagnostic options only with --redistribution', () => {
    const a = parseArgs(['--redistribution', '--closure', 'mn,9q9p3fr7b5', '--seeds', '1-10', '--jobs', '2', '--cohort', 'crossings', '--streets', '63rd Street, Dana Street']);
    expect(a).toMatchObject({ redistribution: true, closure: 'mn,9q9p3fr7b5', seeds: '1-10', jobs: 2, cohort: 'crossings', streets: ['63rd Street', 'Dana Street'] });
    expect(() => parseArgs(['--closure', 'mn,9q9p3fr7b5'])).toThrow(/go with --redistribution/);
    expect(() => parseArgs(['--redistribution', '--cohort', 'all'])).toThrow(/direct or crossings/);
    expect(() => parseArgs(['--redistribution', '--interventions', 'x.json'])).toThrow(/--link/);
  });
});
