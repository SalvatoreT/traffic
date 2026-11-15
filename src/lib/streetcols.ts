import type { Overlay } from '../types';

export type StreetKey = 'name' | 'cls' | 'chg' | 'flowB' | 'flowS' | 'speedB' | 'speedS' | 'ctB' | 'ctS';
export interface SortChoice { key: StreetKey; label: string }

/** Sort used until a header is chosen: biggest change with a scenario, else most through cars. */
export function defaultSort(comparing: boolean): { key: StreetKey; dir: 1 | -1 } {
  return comparing ? { key: 'chg', dir: -1 } : { key: 'ctB', dir: -1 };
}

export const changeUnit = (o: Overlay): string => (o === 'cutthrough' ? 'through cars an hour' : o === 'flow' ? 'all cars an hour' : 'mph');

/** Sort choices for the phone's sort menu: the same columns the table shows. */
export function sortChoices(comparing: boolean, overlay: Overlay): SortChoice[] {
  const base: SortChoice[] = [{ key: 'name', label: 'Street name' }, { key: 'cls', label: 'Class' }];
  if (!comparing) {
    return [...base, { key: 'flowB', label: 'All cars, cars an hour' }, { key: 'speedB', label: 'Mean speed, mph' }, { key: 'ctB', label: 'Through cars, cars an hour' }];
  }
  return [
    { key: 'chg', label: `Change, ${changeUnit(overlay)}` }, ...base,
    { key: 'flowB', label: 'All cars, base' }, { key: 'flowS', label: 'All cars, scenario' },
    { key: 'speedB', label: 'Mean speed, base' }, { key: 'speedS', label: 'Mean speed, scenario' },
    { key: 'ctB', label: 'Through cars, base' }, { key: 'ctS', label: 'Through cars, scenario' },
  ];
}
