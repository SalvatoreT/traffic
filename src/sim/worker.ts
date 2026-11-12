/// <reference lib="webworker" />
import * as pkg from './pkg/traffic_sim.js';
import { MockSimulation } from './mock';
import type { FromWorker, SimCtor, SimLike, SimStats, ToWorker } from './protocol';
import type { Intervention, Metrics } from '../types';

const ctx = self as unknown as DedicatedWorkerGlobalScope;
const post = (m: FromWorker, tr: Transferable[] = []) => ctx.postMessage(m, tr);

const STEP = 0.25;
let Ctor: SimCtor | null = null;
let network = '', demand = '';
let cfg = { seed: 1, period: '', demandScale: 1 };
let interventions: Intervention[] = [];
let scenario: SimLike | null = null;
let baseline: SimLike | null = null; // only created while interventions exist (else scenario == baseline)
let speed = 1;
let running = false;
let pending = 0;
let lastTick = 0;
let lastStats = 0;
let winStart = 0;
let winSim = 0;
const resetWindow = () => { winStart = performance.now(); winSim = 0; };
let timer: ReturnType<typeof setTimeout> | null = null;

const make = (): SimLike => new Ctor!(network, demand, JSON.stringify(cfg));
const dispose = (s: SimLike | null) => { try { s?.free?.(); } catch { /* ignore */ } };

function rebuild() {
  dispose(scenario); dispose(baseline); baseline = null;
  scenario = make();
  applyInterventions();
}
function applyInterventions() {
  if (!scenario) return;
  scenario.setInterventions(JSON.stringify(interventions));
  if (interventions.length) {
    if (!baseline) baseline = make();
  } else { dispose(baseline); baseline = null; }
}
/** Restart both runs from t=0 so elapsed time stays identical for the comparison. */
function restart() {
  if (!scenario) return;
  scenario.reset();
  scenario.setInterventions(JSON.stringify(interventions));
  if (interventions.length) {
    if (baseline) baseline.reset(); else baseline = make();
  } else { dispose(baseline); baseline = null; }
  pending = 0; resetWindow();
  postFrame(); postStats();
}

function parseMetrics(s: SimLike): Metrics | null {
  try { return JSON.parse(s.metrics()) as Metrics; } catch { return null; }
}
function statsOf(s: SimLike | null): SimStats {
  return s ? { metrics: parseMetrics(s), linkStats: s.linkStats() } : { metrics: null, linkStats: null };
}
function postFrame() {
  if (!scenario) return;
  const vehicles = scenario.vehicles();
  const signals = scenario.signals();
  post({ t: 'frame', time: scenario.time(), vehicles, signals, wall: performance.timeOrigin + performance.now(), rate: running ? speed : 0 }, [vehicles.buffer as ArrayBuffer, signals.buffer as ArrayBuffer]);
}
function postStats() {
  if (!scenario) return;
  const sc = statsOf(scenario);
  const comparing = baseline !== null;
  const base = comparing ? statsOf(baseline) : sc;
  const now = performance.now();
  const achievedSpeed = running && now - winStart >= 900 ? winSim / ((now - winStart) / 1000) : null;
  resetWindow();
  const buffers = new Set<ArrayBuffer>();
  for (const s of [sc, base]) if (s.linkStats) buffers.add(s.linkStats.buffer as ArrayBuffer);
  post({ t: 'stats', time: scenario.time(), comparing, scenario: sc, baseline: base, achievedSpeed }, [...buffers]);
  lastStats = now;
}

/** At low multipliers one step is due every STEP/speed seconds; step on that steady cadence instead of in bursts. */
const STEADY_MAX_SPEED = 7.5;
let due = 0;
function tick() {
  timer = null;
  const now = performance.now();
  const dtWall = Math.min(0.1, (now - lastTick) / 1000);
  lastTick = now;
  let wait = 33;
  if (scenario && running) {
    const steady = speed <= STEADY_MAX_SPEED;
    const interval = (STEP / speed) * 1000;
    let secs = 0;
    if (steady) {
      if (due === 0 || now - due > 4 * interval) due = now;
      if (now >= due - 1) { secs = STEP; due += interval; }
      wait = Math.max(1, due - performance.now());
    } else {
      due = 0;
      pending += dtWall * speed;
      const n = Math.floor(pending / STEP);
      if (n > 0) { secs = n * STEP; pending -= secs; }
    }
    if (secs > 0) {
      try {
        scenario.step(secs);
        baseline?.step(secs);
        winSim += secs;
        postFrame();
      } catch (e) {
        running = false;
        post({ t: 'error', message: `Simulation error: ${(e as Error).message ?? e}` });
      }
    }
    if (now - lastStats >= 1000) postStats();
  } else due = 0;
  timer = setTimeout(tick, wait);
}

async function init(msg: Extract<ToWorker, { t: 'init' }>) {
  network = msg.network; demand = msg.demand;
  cfg = { seed: msg.seed, period: msg.period, demandScale: msg.demandScale };
  interventions = msg.interventions; speed = msg.speed; running = msg.running;
  let engine: 'wasm' | 'mock' = 'mock';
  let reason: string | undefined;
  Ctor = MockSimulation as unknown as SimCtor;
  if (!msg.mock) {
    try {
      const mod = pkg as unknown as Record<string, unknown>;
      const key = 'Simulation';
      if (typeof mod[key] !== 'function') throw new Error('WASM package does not export Simulation yet');
      await (mod.default as () => Promise<unknown>)();
      Ctor = mod[key] as SimCtor;
      // Smoke-test the constructor so a broken build falls back instead of failing mid-run.
      const probe = new Ctor(network, demand, JSON.stringify(cfg));
      probe.step(STEP);
      // An older build reports no `modes`; the UI hides mode sections then.
      probe.metrics();
      (probe as SimLike).free?.();
      engine = 'wasm';
    } catch (e) {
      reason = (e as Error).message ?? String(e);
      Ctor = MockSimulation as unknown as SimCtor;
    }
  } else reason = 'mock requested';
  rebuild();
  post({ t: 'ready', engine, reason });
  lastTick = performance.now(); resetWindow();
  postFrame(); postStats();
  if (!timer) timer = setTimeout(tick, 33);
}

ctx.onmessage = (ev: MessageEvent<ToWorker>) => {
  const m = ev.data;
  try {
    switch (m.t) {
      case 'init': void init(m); break;
      case 'run': running = m.running; lastTick = performance.now(); due = 0; resetWindow(); postFrame(); break;
      case 'speed': speed = m.speed; due = 0; pending = 0; resetWindow(); postFrame(); break;
      case 'config':
        cfg = { ...cfg, period: m.period, demandScale: m.demandScale };
        rebuild(); pending = 0; resetWindow(); postFrame(); postStats(); break;
      case 'interventions': interventions = m.list; restart(); break;
      case 'reset': restart(); break;
    }
  } catch (e) {
    post({ t: 'error', message: `Worker error: ${(e as Error).message ?? e}` });
  }
};
