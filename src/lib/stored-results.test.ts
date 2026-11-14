import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import type { Intervention } from '../types';
import { base64ToF32, canonicalItems, f32ToBase64, parseResult, resultKey, RESULT_VERSION, toStatsMsg, verdict, type Loaded, type StoredResult } from './stored-results';
import { hashText } from './proposals';

const net = buildFixture().network;
const a: Intervention = { type: 'modal_filter', link: 0 };
const b: Intervention = { type: 'speed_limit', link: 6, speed: 8.9 };
const metrics = { time: 3600 } as unknown as StoredResult['scenario']['metrics'];
const stats = (v: number[]) => ({ metrics, linkStats: f32ToBase64(new Float32Array(v)) });

const result = (over: Partial<StoredResult> = {}): StoredResult => ({
  version: RESULT_VERSION, area: net.id, period: 'pm_peak', key: 'k1', items: 'x', seed: 1, demandScale: 1, seconds: 3600, computed: '2026-11-14T00:00:00Z',
  inputs: { networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), simulator: 'c'.repeat(32) },
  scenario: stats([1, 2, 3, 4]), baseline: stats([4, 3, 2, 1]), ...over,
});
const loaded: Loaded = { area: net.id, networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), simulator: 'c'.repeat(32) };
const want = { key: 'k1', period: 'pm_peak', demandScale: 1 };

describe('scenario keys', () => {
  it('do not depend on the order of the interventions', async () => {
    expect(canonicalItems(net, [a, b])).toBe(canonicalItems(net, [b, a]));
    expect(await resultKey(net, [a, b], 'pm_peak')).toBe(await resultKey(net, [b, a], 'pm_peak'));
  });
  it('differ by scenario and by period', async () => {
    const k = await resultKey(net, [a], 'pm_peak');
    expect(k).toMatch(/^[0-9a-f]{16}$/);
    expect(await resultKey(net, [a, b], 'pm_peak')).not.toBe(k);
    expect(await resultKey(net, [a], 'am_peak')).not.toBe(k);
  });
  it('use the link encoding, so a link round trip keeps the key', async () => {
    expect(canonicalItems(net, [a])).toMatch(/^mf,[0-9b-hjkmnp-z]{10}$/);
    expect(await hashText('x')).toHaveLength(64);
  });
});

describe('encoding', () => {
  it('round trips float32 values exactly', () => {
    const v = new Float32Array([0, 1.5, -0, 1e-7, 3.4e38, 0.1, 12345.678]);
    expect(Array.from(base64ToF32(f32ToBase64(v)))).toEqual(Array.from(v));
  });
  it('builds the message the live run posts', () => {
    const m = toStatsMsg(result({ scenario: { ...stats([1, 2]), intentLinks: f32ToBase64(new Float32Array([0, 5, 9])) } }));
    expect(m.time).toBe(3600);
    expect(m.comparing).toBe(true);
    expect(Array.from(m.scenario.linkStats!)).toEqual([1, 2]);
    expect(Array.from(m.scenario.intentLinks!)).toEqual([0, 5, 9]);
    expect(m.baseline.intentLinks).toBeNull();
  });
});

describe('verdict', () => {
  it('accepts a result for this scenario whose inputs all match', () => {
    expect(verdict(result(), want, loaded)).toBe('ok');
  });
  it('accepts a truncated recorded hash like the proposals file does', () => {
    expect(verdict(result({ inputs: { ...result().inputs, networkHash: 'a'.repeat(16) } }), want, loaded)).toBe('ok');
  });
  it('rejects each input that differs', () => {
    expect(verdict(result(), want, { ...loaded, networkHash: 'd'.repeat(64) })).toBe('network');
    expect(verdict(result(), want, { ...loaded, demandHash: 'd'.repeat(64) })).toBe('demand');
    expect(verdict(result(), want, { ...loaded, simulator: 'd'.repeat(32) })).toBe('simulator');
  });
  it('rejects when an input could not be computed, such as the mock engine', () => {
    expect(verdict(result(), want, { ...loaded, simulator: null })).toBe('simulator');
    expect(verdict(result(), want, { ...loaded, networkHash: null })).toBe('network');
    expect(verdict(result(), want, { ...loaded, demandHash: null })).toBe('demand');
  });
  it('rejects another scenario, period, area, demand level or run', () => {
    expect(verdict(result(), { ...want, key: 'k2' }, loaded)).toBe('key');
    expect(verdict(result(), { ...want, period: 'am_peak' }, loaded)).toBe('period');
    expect(verdict(result({ area: 'elsewhere' }), want, loaded)).toBe('area');
    expect(verdict(result(), { ...want, demandScale: 1.1 }, loaded)).toBe('run');
    expect(verdict(result({ seed: 2 }), want, loaded)).toBe('run');
    expect(verdict(result({ seconds: 1800 }), want, loaded)).toBe('run');
    expect(verdict(result({ version: 2 as 1 }), want, loaded)).toBe('version');
  });
});

describe('parseResult', () => {
  it('reads a stored result and nothing else', () => {
    expect(parseResult(JSON.stringify(result()))?.key).toBe('k1');
    expect(parseResult('<!doctype html><title>app</title>')).toBeNull();
    expect(parseResult('{}')).toBeNull();
    expect(parseResult(JSON.stringify({ ...result(), scenario: { metrics: null, linkStats: 1 } }))).toBeNull();
  });
});
