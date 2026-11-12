import { describe, expect, it } from 'vitest';
import { ATTRIBUTION, captionOf, exportFileName, wrapText } from './mapexport';
import { legendModel } from './legend';

describe('image caption', () => {
  const base = { area: 'Rockridge Trapezoid', period: 'PM peak', time: 1830, shows: 'scenario' as const, overlayName: 'Flow, veh/h' };
  it('names the area, period, simulated time and scenario', () => {
    const c = captionOf({ ...base, interventions: ['Modal filter on Martin St', 'Speed hump on Ayala Ave'] });
    expect(c.title).toBe('Rockridge Trapezoid, PM peak');
    expect(c.lines[0]).toContain('Simulated time 0:30:30 of 1:00:00');
    expect(c.lines[0]).toContain('Scenario');
    expect(c.lines[1]).toBe('2 interventions: Modal filter on Martin St; Speed hump on Ayala Ave');
  });
  it('says so when there are none, and shortens long lists', () => {
    expect(captionOf({ ...base, interventions: [] }).lines[1]).toMatch(/^No interventions/);
    const six = Array.from({ length: 6 }, (_, i) => `Filter ${i}`);
    expect(captionOf({ ...base, interventions: six }).lines[1]).toContain('and 2 more');
  });
  it('does not read past the end of the hour', () => {
    expect(captionOf({ ...base, time: 5000, interventions: [] }).lines[0]).toContain('1:00:00 of 1:00:00');
  });
  it('keeps the required credit', () => { expect(ATTRIBUTION).toBe('© OpenStreetMap contributors'); });
});

describe('file names and wrapping', () => {
  it('builds a safe name with the clock', () => {
    expect(exportFileName('Rockridge Trapezoid', 'PM peak', 1830, 'png')).toBe('rockridge-trapezoid-pm-peak-0h30m30s.png');
    expect(exportFileName('A', 'B', 9999, 'jpeg')).toBe('a-b-1h00m00s.jpg');
  });
  it('wraps on words and keeps long words whole', () => {
    const m = (s: string) => s.length;
    expect(wrapText(m, 'aaa bbb ccc ddd', 7)).toEqual(['aaa bbb', 'ccc ddd']);
    expect(wrapText(m, 'abcdefghij k', 4)).toEqual(['abcdefghij', 'k']);
  });
});

describe('legend model', () => {
  it('has five ticks and stops from 0 to 1 in both views', () => {
    for (const change of [false, true]) {
      const l = legendModel('flow', 'light', change);
      expect(l.ticks).toHaveLength(5);
      expect(l.stops[0].at).toBeCloseTo(0, 6);
      expect(l.stops.at(-1)!.at).toBeCloseTo(1, 6);
      expect(l.change).toBe(change);
    }
  });
});
