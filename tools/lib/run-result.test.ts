import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildFixture } from '../../src/fixtures/area';
import type { Intervention } from '../../src/types';
import { encodeStats, parseResult, toStatsMsg, RESULT_SEED } from '../../src/lib/stored-results';
import { build, loadEngine, runHour, runToEnd, type Engine } from './run-result';

const wasm = resolve(import.meta.dirname, '../../src/sim/pkg/traffic_sim_bg.wasm');
const built = existsSync(wasm) && readFileSync(resolve(import.meta.dirname, '../../src/sim/pkg/traffic_sim.js'), 'utf8').includes('simulatorFingerprint');
const d = built ? describe : describe.skip;

d('a stored result is what a run from zero produces', () => {
  const bundle = buildFixture();
  const network = JSON.stringify(bundle.network), demand = JSON.stringify(bundle.demand);
  const period = bundle.demand.periods[0].id;
  const ivs: Intervention[] = [{ type: 'modal_filter', link: 0 }];
  let e: Engine;
  const engine = async () => (e ??= await loadEngine());

  it('equals a fresh run, and survives encoding', async () => {
    const eng = await engine();
    const stored = runHour(eng, network, demand, period, ivs);
    const again = runHour(eng, network, demand, period, ivs);
    expect(Array.from(again.linkStats)).toEqual(Array.from(stored.linkStats));
    expect(again.metrics).toEqual(stored.metrics);
    expect(stored.metrics.time).toBe(3600);
    const json = JSON.stringify({
      version: 1, area: 'x', period, key: 'k', items: '', seed: RESULT_SEED, demandScale: 1, seconds: 3600, computed: '',
      inputs: { networkHash: 'a', demandHash: 'b', simulator: eng.fingerprint }, scenario: encodeStats(stored), baseline: encodeStats(again),
    });
    const msg = toStatsMsg(parseResult(json)!);
    expect(Array.from(msg.scenario.linkStats!)).toEqual(Array.from(stored.linkStats));
    expect(msg.scenario.metrics).toEqual(stored.metrics);
  }, 120_000);

  it('equals "Run again": the live worker resets the same simulation with the scenario set', async () => {
    const eng = await engine();
    const stored = runHour(eng, network, demand, period, ivs);
    const s = build(eng, network, demand, period, []);
    s.step(600);
    s.setInterventions(JSON.stringify(ivs));
    s.reset();
    const rerun = runToEnd(s);
    expect(Array.from(rerun.linkStats)).toEqual(Array.from(stored.linkStats));
    expect(rerun.metrics).toEqual(stored.metrics);
  }, 120_000);

  it('does not depend on the step size', async () => {
    const eng = await engine();
    const stored = runHour(eng, network, demand, period, ivs);
    const s = build(eng, network, demand, period, ivs);
    while (s.time() < 3600 - 1e-6) s.step(0.25);
    expect(Array.from(s.linkStats())).toEqual(Array.from(stored.linkStats));
  }, 120_000);

  it('records a fingerprint that is 32 hex characters', async () => {
    expect((await engine()).fingerprint).toMatch(/^[0-9a-f]{32}$/);
  });
});
