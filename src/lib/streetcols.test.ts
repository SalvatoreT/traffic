import { describe, expect, it } from 'vitest';
import { defaultSort, sortChoices } from './streetcols';

describe('street columns', () => {
  it('hides scenario and change without a scenario', () => {
    const keys = sortChoices(false, 'cutthrough').map((c) => c.key);
    expect(keys).not.toContain('chg');
    expect(keys.some((k) => k.endsWith('S'))).toBe(false);
    expect(defaultSort(false)).toEqual({ key: 'ctB', dir: -1 });
  });
  it('shows them with a scenario and sorts by change first', () => {
    const c = sortChoices(true, 'speed');
    expect(c[0]).toEqual({ key: 'chg', label: 'Change, mph' });
    expect(c.map((x) => x.key)).toEqual(expect.arrayContaining(['flowS', 'speedS', 'ctS']));
    expect(defaultSort(true).key).toBe('chg');
  });
});
