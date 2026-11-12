import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { AreaConfig } from './lib/types';

const root = resolve(import.meta.dirname, '..');
const cfg: AreaConfig = JSON.parse(readFileSync(resolve(root, 'data/areas/rockridge.json'), 'utf8'));

describe('area calibration entry', () => {
  const cal = cfg.calibration!;
  const periods = Object.keys(cfg.periodWindows ?? {});
  it('has a one-sentence note of at most 160 characters', () => {
    expect(cal.note!.length).toBeLessThanOrEqual(160);
    expect(cal.note!.match(/[.!?](\s|$)/g)!.length).toBe(1);
  });
  it('names real demand periods for the default and the experimental ones', () => {
    expect(periods).toContain(cal.defaultPeriod);
    for (const p of cal.experimentalPeriods ?? []) expect(periods).toContain(p);
    expect(cal.experimentalPeriods).not.toContain(cal.defaultPeriod);
  });
  it('is calibrated only when no period is experimental', () => {
    if (cal.status === 'calibrated') expect(cal.experimentalPeriods ?? []).toHaveLength(0);
  });
});
