import { describe, expect, it } from 'vitest';
import {
  aggregate, changeIntensity, changeTicks, CHANGE_TOP, compareRows, DEAD_BAND, diffValue, effectiveView, formatSigned, initViewState, linkChangeIntensity,
  NO_DATA, readoutText, viewReducer,
} from './change';
import { linkStatsView } from '../types';

const A = (flow: number, cut: number, speed = 8) => ({ flow, cut, speed });
const stats = (...rows: number[][]) => linkStatsView(new Float32Array(rows.flat()));

describe('difference', () => {
  it('is scenario minus baseline per metric', () => {
    expect(diffValue('cutthrough', A(100, 62), A(80, 18))).toBe(-44);
    expect(diffValue('flow', A(100, 62), A(180, 18))).toBe(80);
    expect(diffValue('speed', A(100, 0, 10), A(100, 0, 10 + 4.4704))).toBeCloseTo(10, 5);
  });
  it('has no speed difference when either run is empty', () => {
    expect(diffValue('speed', A(0, 0, 0), A(50, 0, 8))).toBeNull();
  });
  it('reads link stats the same way as the overlay (4 floats per link)', () => {
    const b = stats([100, 8, 60, 0]), s = stats([40, 8, 10, 0]);
    expect(linkChangeIntensity('cutthrough', b, s, 0)).toBeCloseTo(-50 / 150, 6);
    expect(aggregate(b, [0]).cut).toBe(60);
  });
  it('flow-weights speed over both directions of a block', () => {
    const v = stats([100, 10, 0, 0], [300, 6, 0, 0]);
    expect(aggregate(v, [0, 1]).speed).toBeCloseTo(7, 6);
  });
});

describe('dead band and clamping', () => {
  it('draws small differences as no change', () => {
    expect(changeIntensity('flow', A(500, 0), A(500 + DEAD_BAND.flow - 1, 0))).toBe(0);
    expect(changeIntensity('cutthrough', A(50, 50), A(50, 50 - 7))).toBe(0);
    expect(changeIntensity('cutthrough', A(50, 50), A(50, 50 + 7))).toBe(0);
    expect(changeIntensity('cutthrough', A(50, 50), A(50, 50 + 8))).toBeCloseTo(8 / 150, 6);
  });
  it('clamps to the fixed top on both sides', () => {
    expect(changeIntensity('cutthrough', A(500, 400), A(500, 0))).toBe(-1);
    expect(changeIntensity('flow', A(0, 0), A(2000, 0))).toBe(1);
    expect(CHANGE_TOP.flow).toBe(800);
  });
  it('marks streets with no traffic in either run', () => {
    expect(changeIntensity('flow', A(0, 0), A(0, 0))).toBe(NO_DATA);
    expect(changeIntensity('speed', A(0, 0), A(0, 0))).toBe(NO_DATA);
    expect(changeIntensity('flow', A(0, 0), A(300, 0))).toBeGreaterThan(0);
  });
  it('is symmetric about zero', () => {
    expect(changeIntensity('flow', A(400, 0), A(600, 0))).toBeCloseTo(-changeIntensity('flow', A(600, 0), A(400, 0)), 9);
  });
});

describe('signed labels', () => {
  it('uses a true minus and an explicit plus', () => {
    expect(formatSigned(-44.2, 'cutthrough')).toBe('−44');
    expect(formatSigned(18.6, 'flow')).toBe('+19');
    expect(formatSigned(-3.14, 'speed')).toBe('−3.1');
    expect(formatSigned(0.2, 'flow')).toBe('0');
    expect(formatSigned(-0.4, 'cutthrough')).toBe('0');
    expect(formatSigned(null, 'speed')).toBe('—');
    expect(formatSigned(1234, 'flow')).toBe('+1,234');
  });
  it('builds legend ticks and the readout', () => {
    expect(changeTicks('cutthrough')).toEqual(['−150+', '−75', '0', '+75', '+150+']);
    expect(changeTicks('speed')[4]).toBe('+10+');
    expect(readoutText('cutthrough', A(80, 62), A(40, 18))).toBe('Cut-through: 62 → 18 veh/h (−44)');
  });
});

describe('view reducer', () => {
  it('switches to change on the first intervention', () => {
    let s = initViewState(0, null);
    expect(effectiveView(s)).toBe('scenario');
    s = viewReducer(s, { type: 'count', count: 1 });
    expect(s.view).toBe('change');
    s = viewReducer(s, { type: 'count', count: 2 });
    expect(s.view).toBe('change');
  });
  it('remembers a manual choice and lets it win', () => {
    let s = initViewState(2, null);
    s = viewReducer(s, { type: 'choose', view: 'scenario' });
    s = viewReducer(s, { type: 'count', count: 0 });
    expect(effectiveView(s)).toBe('scenario');
    s = viewReducer(s, { type: 'count', count: 1 });
    expect(s.view).toBe('scenario');
    expect(s.remembered).toBe('scenario');
  });
  it('returns to the scenario view when cleared, and keeps a remembered change choice', () => {
    let s = initViewState(1, 'change');
    s = viewReducer(s, { type: 'count', count: 0 });
    expect(effectiveView(s)).toBe('scenario');
    s = viewReducer(s, { type: 'count', count: 1 });
    expect(s.view).toBe('change');
  });
  it('ignores junk in storage', () => {
    expect(initViewState(1, 'x').view).toBe('change');
  });
});

describe('table sorting', () => {
  const rows = [
    { label: 'B', chg: -5, ctS: 1 }, { label: 'A', chg: 40, ctS: 2 }, { label: 'C', chg: -44, ctS: 3 }, { label: 'D', chg: null, ctS: 4 }, { label: 'E', chg: 0, ctS: 5 },
  ];
  it('sorts by absolute change, largest first', () => {
    expect([...rows].sort(compareRows('chg', -1)).map((r) => r.label)).toEqual(['C', 'A', 'B', 'E', 'D']);
  });
  it('reverses and sorts other keys', () => {
    expect([...rows].sort(compareRows('chg', 1)).map((r) => r.label)).toEqual(['D', 'E', 'B', 'A', 'C']);
    expect([...rows].sort(compareRows('ctS', -1))[0].label).toBe('E');
  });
});
