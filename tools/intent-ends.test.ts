import { describe, expect, it } from 'vitest';
import { summarizeEnds } from './lib/intent-ends';

describe('where a reason\'s cars start and end', () => {
  const groupOf = (n: number) => (n < 10 ? 'north' : n < 20 ? 'west' : 'freeway');
  const label = (g: string) => ({ north: 'Berkeley', west: 'West side', freeway: 'SR-24' })[g] ?? g;
  // slot, origin, destination, cars
  const trips = [0, 1, 30, 60, 0, 12, 30, 30, 0, 2, 30, 5, 1, 30, 3, 40, 1, 30, 15, 2];
  it('groups the trip ends by approach group, biggest first, with whole-percent shares', () => {
    const e = summarizeEnds(trips, ['a', 'b', 'other'], groupOf, label);
    expect(e[0]).toEqual({ id: 'a', from: [{ label: 'Berkeley', share: 68 }, { label: 'West side', share: 32 }], to: [{ label: 'SR-24', share: 100 }] });
    expect(e[1].from).toEqual([{ label: 'SR-24', share: 100 }]);
    expect(e[1].to).toEqual([{ label: 'Berkeley', share: 95 }]);
    expect(e[2]).toEqual({ id: 'other', from: [], to: [] });
  });
  it('leaves out groups under a tenth of the cars', () => {
    const e = summarizeEnds([0, 1, 30, 95, 0, 12, 30, 5], ['a'], groupOf, label);
    expect(e[0].from).toEqual([{ label: 'Berkeley', share: 95 }]);
  });
});
