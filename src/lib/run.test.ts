import { describe, expect, it } from 'vitest';
import { clampStep, defaultPeriod, initialRun, isExperimentalPeriod, RUN_SECONDS, runReducer, type RunState } from './run';
import { nextOverlayMax, OVERLAY_FLOOR, SHRINK_EVERY_MS } from './ramps';

describe('run state', () => {
  it('runs until the boundary, then finishes and stops', () => {
    let s: RunState = initialRun(true);
    s = runReducer(s, { type: 'time', time: 1800 });
    expect(s).toEqual({ running: true, finished: false, time: 1800 });
    s = runReducer(s, { type: 'time', time: RUN_SECONDS });
    expect(s).toEqual({ running: false, finished: true, time: RUN_SECONDS });
  });
  it('never reports time past the end', () => {
    expect(runReducer(initialRun(true), { type: 'time', time: 4000 }).time).toBe(RUN_SECONDS);
  });
  it('toggle after finishing restarts from zero and runs', () => {
    const done = runReducer(initialRun(true), { type: 'time', time: RUN_SECONDS });
    expect(runReducer(done, { type: 'toggle' })).toEqual({ running: true, finished: false, time: 0 });
  });
  it('toggle pauses and resumes while unfinished', () => {
    const s = runReducer(initialRun(true), { type: 'toggle' });
    expect(s.running).toBe(false);
    expect(runReducer(s, { type: 'toggle' }).running).toBe(true);
  });
  it('restart keeps a paused run paused and revives a finished one', () => {
    expect(runReducer({ running: false, finished: false, time: 900 }, { type: 'restart' })).toEqual({ running: false, finished: false, time: 0 });
    expect(runReducer({ running: false, finished: true, time: RUN_SECONDS }, { type: 'restart' })).toEqual({ running: true, finished: false, time: 0 });
  });
  it('clampStep does not overshoot', () => {
    expect(clampStep(3599.5, 5)).toBe(0.5);
    expect(clampStep(RUN_SECONDS, 5)).toBe(0);
    expect(clampStep(0, 5)).toBe(5);
    let t = 0;
    while (t < RUN_SECONDS) t += clampStep(t, 7.25);
    expect(t).toBe(RUN_SECONDS);
  });
});

describe('periods', () => {
  const ps = [{ id: 'am_peak' }, { id: 'midday' }, { id: 'pm_peak' }];
  it('prefers the area default, then midday, then the first', () => {
    expect(defaultPeriod({ defaultPeriod: 'pm_peak' }, ps)).toBe('pm_peak');
    expect(defaultPeriod({}, ps)).toBe('midday');
    expect(defaultPeriod({}, [{ id: 'am_peak' }, { id: 'pm_peak' }])).toBe('am_peak');
    expect(defaultPeriod({ defaultPeriod: 'gone' }, ps)).toBe('midday');
  });
  it('labels experimental periods', () => {
    expect(isExperimentalPeriod({ experimentalPeriods: ['pm_peak'] }, 'pm_peak')).toBe(true);
    expect(isExperimentalPeriod({ experimentalPeriods: ['pm_peak'] }, 'am_peak')).toBe(false);
    expect(isExperimentalPeriod({ calibration: { status: 'uncalibrated' } }, 'am_peak')).toBe(true);
    expect(isExperimentalPeriod({}, 'midday')).toBe(false);
    expect(isExperimentalPeriod({ calibration: { status: 'calibrated' } }, 'am_peak')).toBe(false);
  });
});

describe('overlay bound', () => {
  const vals = (n: number, hi: number) => Array.from({ length: n }, (_, i) => (i / (n - 1)) * hi);
  it('uses the 95th percentile rounded to a nice number, above the floor', () => {
    expect(nextOverlayMax(vals(101, 1000), 20, { max: 0, changedAt: 0 }, 0).max).toBe(1000);
    expect(nextOverlayMax(vals(101, 130), 20, { max: 0, changedAt: 0 }, 0).max).toBe(200);
  });
  it('applies the floor', () => {
    expect(nextOverlayMax([0, 1, 2], OVERLAY_FLOOR.cutthrough, { max: 0, changedAt: 0 }, 0).max).toBe(20);
  });
  it('grows at once but shrinks at most every few seconds', () => {
    const hi = { max: 1000, changedAt: 0 };
    expect(nextOverlayMax(vals(101, 100), 20, hi, 1000)).toBe(hi);
    expect(nextOverlayMax(vals(101, 100), 20, hi, SHRINK_EVERY_MS).max).toBe(100);
    expect(nextOverlayMax(vals(101, 5000), 20, hi, 1).max).toBe(5000);
  });
});
