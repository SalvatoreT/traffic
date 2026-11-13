import { describe, expect, it } from 'vitest';
import { linkStatsView } from '../types';
import { hoverLine, type HoverLineInput } from './hoverline';
import { divergingStops, mutedColor, rampStops } from './ramps';

const stats = (flow: number, speed: number, cut: number) => linkStatsView(new Float32Array([flow, speed, cut, 0]));
const base: HoverLineInput = { overlay: 'flow', change: false, mode: 'light', max: 800, link: { id: 0, speedLimit: 11.176 }, stats: stats(400, 8.9408, 50), base: null };

describe('hover line', () => {
  it('shows flow and cut-through with units and the ramp color at that value', () => {
    const f = hoverLine(base);
    expect(f.text).toBe('All cars on this block: 400 cars an hour');
    expect(f.color).toBe(rampStops('light')[2]);
    expect(hoverLine({ ...base, overlay: 'cutthrough', max: 100 }).text).toBe('Through cars on this block: 50 cars an hour');
    expect(hoverLine({ ...base, overlay: 'flow', max: 800, stats: stats(800, 5, 0) }).color).toBe(rampStops('light')[4]);
  });
  it('shows speed as the legend does, percent of limit, with mph', () => {
    const l = hoverLine({ ...base, overlay: 'speed', max: 1 });
    expect(l.text).toBe('Speed: 80% of limit (20 mph)');
  });
  it('uses the muted color for streets with no traffic, in both themes', () => {
    expect(hoverLine({ ...base, stats: stats(0, 0, 0) })).toEqual({ color: mutedColor('light'), text: 'All cars on this block: 0 cars an hour' });
    expect(hoverLine({ ...base, mode: 'dark', overlay: 'speed', stats: stats(0, 0, 0) })).toEqual({ color: mutedColor('dark'), text: 'Speed: no traffic' });
  });
  it('says no data yet when there are no stats, or no baseline in the change view', () => {
    expect(hoverLine({ ...base, stats: null })).toEqual({ color: null, text: 'All cars on this block: No data yet' });
    expect(hoverLine({ ...base, change: true, stats: stats(1, 1, 1), base: null }).text).toBe('All cars on this block: No data yet');
  });
  it('shows signed change and before and after in the change view with the diverging color', () => {
    const l = hoverLine({ ...base, change: true, base: stats(600, 8, 0), stats: stats(100, 8, 0) });
    expect(l.text).toBe('All cars on this block: 600 → 100 cars an hour (−500)');
    const top = divergingStops('light');
    expect(l.color).not.toBe(mutedColor('light'));
    expect(top.map((s) => s.color)).toContain(hoverLine({ ...base, change: true, base: stats(1000, 8, 0), stats: stats(0, 8, 0) }).color);
  });
  it('draws a change inside the noise band, or on a street with no traffic, in muted gray', () => {
    expect(hoverLine({ ...base, change: true, base: stats(400, 8, 0), stats: stats(410, 8, 0) }).color).toBe(mutedColor('light'));
    expect(hoverLine({ ...base, change: true, mode: 'dark', base: stats(0, 0, 0), stats: stats(0, 0, 0) }).color).toBe(mutedColor('dark'));
  });
  it('names the direction for a two-way block', () => {
    expect(hoverLine({ ...base, direction: 'toward Elm St' }).text).toBe('All cars on this block: 400 cars an hour, toward Elm St');
  });
});
