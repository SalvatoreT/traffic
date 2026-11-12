import { describe, expect, it } from 'vitest';
import { clampStep, defaultPeriod, initialRun, isExperimentalPeriod, RUN_SECONDS, runReducer, type RunState } from './run';
import { OVERLAY_TOP, overlayTop, rampTicks, intensity } from './ramps';

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
  it('prefers a non-experimental area default, then the first non-experimental period, then the first', () => {
    expect(defaultPeriod({ defaultPeriod: 'midday', experimentalPeriods: ['am_peak', 'pm_peak'] }, ps)).toBe('midday');
    expect(defaultPeriod({ defaultPeriod: 'pm_peak', experimentalPeriods: ['am_peak', 'pm_peak'] }, ps)).toBe('midday');
    expect(defaultPeriod({ experimentalPeriods: ['am_peak'] }, ps)).toBe('midday');
    expect(defaultPeriod({ experimentalPeriods: ['am_peak', 'midday'] }, ps)).toBe('pm_peak');
    expect(defaultPeriod({ calibration: { status: 'uncalibrated', defaultPeriod: 'am_peak' } }, [{ id: 'am_peak' }, { id: 'noon' }])).toBe('noon');
    expect(defaultPeriod({ experimentalPeriods: ['am_peak', 'pm_peak'] }, [{ id: 'am_peak' }, { id: 'pm_peak' }])).toBe('am_peak');
    expect(defaultPeriod({ defaultPeriod: 'gone', experimentalPeriods: [] }, ps)).toBe('am_peak');
  });
  it('labels experimental periods', () => {
    expect(isExperimentalPeriod({ experimentalPeriods: ['pm_peak'] }, 'pm_peak')).toBe(true);
    expect(isExperimentalPeriod({ experimentalPeriods: ['pm_peak'] }, 'am_peak')).toBe(false);
    expect(isExperimentalPeriod({ calibration: { status: 'uncalibrated' } }, 'am_peak')).toBe(true);
    expect(isExperimentalPeriod({}, 'midday')).toBe(false);
    expect(isExperimentalPeriod({ calibration: { status: 'calibrated' } }, 'am_peak')).toBe(false);
  });
});

describe('fixed overlay scale', () => {
  it('clamps values above the top to the top color and below zero to no data', () => {
    expect(intensity('cutthrough', 0, 0, OVERLAY_TOP.cutthrough * 5, 11, overlayTop('cutthrough'))).toBe(1);
    expect(intensity('flow', OVERLAY_TOP.flow / 2, 0, 0, 11, overlayTop('flow'))).toBe(0.5);
    expect(intensity('flow', OVERLAY_TOP.flow * 3, 0, 0, 11, overlayTop('flow'))).toBe(1);
    expect(intensity('flow', 0, 0, 0, 11, overlayTop('flow'))).toBe(-1);
  });
  it('labels the top of the flow and cut-through scales with a plus sign', () => {
    expect(rampTicks('cutthrough')).toEqual(['0', '38', '75', '113', '150+']);
    expect(rampTicks('flow')).toEqual(['0', '200', '400', '600', '800+']);
    expect(rampTicks('speed')).toEqual(['100%', '75%', '50%', '25%', '0%']);
  });
});
