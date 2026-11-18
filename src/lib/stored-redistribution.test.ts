import { describe, expect, it } from 'vitest';
import type { Intervention } from '../types';
import { scenarioKey } from './redistribution';
import { cellCars, connectedRuns, routeProblem, itemFor, redistributionFigures, parseRedistribution, redistributionLine, redistributionRows, redistributionTip, redistributionVerdict, STORED_REDIST_METHOD, STORED_REDIST_VERSION, type StoredItem, type StoredRedistribution } from './stored-redistribution';

const iv = { type: 'modal_filter', link: 7 } as unknown as Intervention;
const item: StoredItem = {
  key: scenarioKey([iv]), index: 0, type: 'modal_filter', label: 'Modal filter on Colby Street', usedPerHour: 42.4,
  perHour: { sideStreets: 20, stayOnArterials: 18, removed: 0, unroutable: 0, waiting: 2.4, unmatched: 2 },
  routes: [{ streets: 'Colby Street → 63rd Street', perHour: 25.2, links: [1, 2] }, { streets: 'Martin Street', perHour: 9, links: [3] }], receiving: [],
};
const file: StoredRedistribution = {
  kind: 'proposal-redistribution', version: STORED_REDIST_VERSION, method: STORED_REDIST_METHOD, area: 'a', group: 'g', proposal: 'p', link: '#v1;x', period: 'pm_peak',
  inputs: { networkHash: 'abcdef0123456789', demandHash: '0123456789abcdef', simulator: 'sim1' }, seeds: [101, 102], seconds: 3600, computed: 'now', calibration: 'uncalibrated', items: [item],
};
const want = { group: 'g', proposal: 'p', link: '#v1;x', period: 'pm_peak', seeds: [101, 102], inputs: { networkHash: 'abcdef0123456789', demandHash: '0123456789abcdef', simulator: 'sim1' as string | undefined }, loaded: { network: 'abcdef0123456789ff', demand: null, simulator: 'sim1' as string | null } };

describe('stored redistribution', () => {
  it('reads only its own form', () => {
    expect(parseRedistribution(JSON.stringify(file))).not.toBeNull();
    expect(parseRedistribution('<html>')).toBeNull();
    expect(parseRedistribution(JSON.stringify({ ...file, version: 99 }))).toBeNull();
    expect(parseRedistribution(JSON.stringify({ ...file, kind: 'other' }))).toBeNull();
  });
  it('is fresh only for the same proposal, link, period, seeds and inputs', () => {
    expect(redistributionVerdict(file, want).ok).toBe(true);
    for (const w of [{ ...want, link: '#v1;y' }, { ...want, period: 'am_peak' }, { ...want, seeds: [1, 2] }, { ...want, proposal: 'q' },
      { ...want, inputs: { ...want.inputs, networkHash: '1111111111111111' } }, { ...want, inputs: { ...want.inputs, simulator: 'sim2' } }, { ...want, loaded: { ...want.loaded, simulator: 'sim3' } }, { ...want, loaded: { ...want.loaded, network: '2222222222222222' } }]) {
      expect(redistributionVerdict(file, w).ok).toBe(false);
    }
  });
  it('finds an intervention by its own key, whatever the order', () => {
    expect(itemFor(file, iv)).toBe(item);
    expect(itemFor(file, { type: 'modal_filter', link: 8 } as unknown as Intervention)).toBeUndefined();
  });
  it('says how many used the movement, where most go and how many do not newly drive a side street', () => {
    const line = redistributionLine(item, 'PM peak');
    expect(line).toContain('About 42 through cars an hour');
    expect(line).toContain('Colby Street → 63rd Street (25 an hour) and Martin Street (9 an hour)');
    expect(line).toContain('18 do not newly drive any side street');
    expect(redistributionLine({ ...item, usedPerHour: 0.2 }, 'PM peak')).toMatch(/Almost no through cars/);
    expect(redistributionRows(item).map((r) => r.label)).toContain('Still waiting to start at the end of the hour');
    expect(redistributionFigures(item).every((r) => typeof r.value === 'number')).toBe(true);
    expect(cellCars(0.3)).toBe('<1');
    expect(cellCars(12.4)).toBe('12');
    expect(cellCars(0)).toBe('0');
  });
  it('gives a short tip with the one route most take', () => {
    expect(redistributionTip(item)).toBe('About 42 through cars an hour used this; most go via Colby Street → 63rd Street (25 an hour).');
    expect(redistributionTip({ ...item, usedPerHour: 0.2 })).toBe('Almost no through cars used this.');
  });
});

describe('route checks', () => {
  const from = [0, 1, 2, 5], to = [1, 2, 3, 6], name = ['A St', 'B St', 'C St', 'D St'];
  it('cuts a link list at every jump between non-adjacent nodes', () => {
    expect(connectedRuns([0, 1, 2], from, to)).toEqual([[0, 1, 2]]);
    expect(connectedRuns([0, 1, 3], from, to)).toEqual([[0, 1], [3]]);
  });
  it('reports a gap and a street missing from the list, and accepts a clean route', () => {
    expect(routeProblem({ streets: 'A St → B St → D St', perHour: 1, links: [0, 1, 3] }, from, to, name)).toMatch(/not connected/);
    expect(routeProblem({ streets: 'A St → B St', perHour: 1, links: [0, 1, 2] }, from, to, name)).toMatch(/C St/);
    expect(routeProblem({ streets: 'A St → B St → C St', perHour: 1, links: [0, 1, 2] }, from, to, name)).toBeNull();
  });
});
