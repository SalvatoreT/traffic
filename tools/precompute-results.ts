// Precomputes the finished hour of every published proposal, for each demand period, so a shared link opens already at the end of the run.
//   npm run data:results [-- --area rockridge] [--periods pm_peak,am_peak,midday] [--only <proposal id or key>] [--force] [--jobs 2]
// Needs the WASM build (`npm run wasm`): the runs use the same simulator code the app runs. Writes public/data/results/<area>/<key>.json
// and an index.json beside them. A file is reused when its network hash, demand hash and simulator fingerprint match the current ones.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import type { AreaEntry, Demand, Intervention, Network } from '../src/types';
import { decodeScenario } from '../src/lib/hash';
import { straightenJunctionEnds } from '../src/lib/junctionends';
import { hashText, linkHash, parseProposals, proposalsUrl } from '../src/lib/proposals';
import { RESULT_SEED, RESULT_VERSION, canonicalItems, encodeStats, parseResult, resultKey, type StoredIndex, type StoredIndexEntry, type StoredResult } from '../src/lib/stored-results';
import { RUN_SECONDS } from '../src/lib/run';
import { loadEngine, runHour, type HourStats } from './lib/run-result';

const root = resolve(import.meta.dirname, '..');
const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const flag = (k: string) => process.argv.includes(k);

interface Job { key: string | null; period: string; interventions: Intervention[] }
interface Payload { network: string; demand: string; jobs: Job[] }

if (!isMainThread) {
  const { network, demand, jobs } = workerData as Payload;
  const e = await loadEngine();
  for (const j of jobs) {
    const t0 = Date.now();
    const s = runHour(e, network, demand, j.period, j.interventions);
    const stats = { metrics: s.metrics, linkStats: s.linkStats, intentLinks: s.intentLinks };
    parentPort!.postMessage({ job: j, stats, ms: Date.now() - t0 });
  }
  process.exit(0);
}

const area = arg('--area', 'rockridge');
const jobsN = Math.max(1, Number(arg('--jobs', '2')));
const only = process.argv.includes('--only') ? arg('--only', '') : null;
const force = flag('--force');
const dataDir = resolve(root, 'public/data');
const outDir = join(dataDir, 'results', area);

const entry = (JSON.parse(readFileSync(join(dataDir, 'areas.json'), 'utf8')) as AreaEntry[]).find((a) => a.id === area);
if (!entry) throw new Error(`No area ${area} in public/data/areas.json`);
const file = (u: string) => join(dataDir, u.replace(/^\/data\//, ''));
const networkText = readFileSync(file(entry.network), 'utf8');
const demandText = readFileSync(file(entry.demand), 'utf8');
const network = JSON.parse(networkText) as Network;
const demand = JSON.parse(demandText) as Demand;
const simNetwork = (() => { const { network: n, changed } = straightenJunctionEnds(network); return changed > 0 ? JSON.stringify(n) : networkText; })();
const periods = arg('--periods', demand.periods.map((p) => p.id).join(',')).split(',').filter(Boolean);
for (const p of periods) if (!demand.periods.some((d) => d.id === p)) throw new Error(`Unknown period ${p}`);

const proposalsPath = file(proposalsUrl(entry));
const proposals = existsSync(proposalsPath) ? parseProposals(readFileSync(proposalsPath, 'utf8')) : null;
if (!proposals) throw new Error(`No proposals file at ${proposalsPath}; nothing to precompute.`);

const engine = await loadEngine();
const inputs = { networkHash: await hashText(networkText), demandHash: await hashText(demandText), simulator: engine.fingerprint };

// One entry per distinct (scenario, period); proposals that share a scenario share a file.
interface Want { key: string; period: string; items: string; interventions: Intervention[]; proposals: { group: string; id: string }[] }
const wants = new Map<string, Want>();
for (const g of proposals.groups) for (const p of g.proposals) {
  const d = decodeScenario(network, linkHash(p.link));
  if (d.invalid || d.unplaced.length) { console.warn(`skip ${g.id}/${p.id}: its link no longer places on this network`); continue; }
  if (only && p.id !== only) continue;
  for (const period of periods) {
    const key = await resultKey(network, d.interventions, period);
    const w = wants.get(key) ?? { key, period, items: canonicalItems(network, d.interventions), interventions: d.interventions, proposals: [] };
    w.proposals.push({ group: g.id, id: p.id });
    wants.set(key, w);
  }
}
if (only && wants.size === 0) throw new Error(`No proposal with id ${only}`);

mkdirSync(outDir, { recursive: true });
const pathOf = (key: string) => join(outDir, `${key}.json`);
const readResult = (key: string): StoredResult | null => { const p = pathOf(key); return existsSync(p) ? parseResult(readFileSync(p, 'utf8')) : null; };
const current = (r: StoredResult | null) => !!r && r.inputs.networkHash === inputs.networkHash && r.inputs.demandHash === inputs.demandHash && r.inputs.simulator === inputs.simulator;

// Baselines are shared: today's traffic does not depend on the scenario.
const todo = [...wants.values()].filter((w) => force || !current(readResult(w.key)));
const basePeriods = [...new Set(todo.map((w) => w.period))];
const jobs: Job[] = [...basePeriods.map((period) => ({ key: null, period, interventions: [] as Intervention[] })), ...todo.map((w) => ({ key: w.key, period: w.period, interventions: w.interventions }))];
console.log(`${wants.size} results wanted, ${wants.size - todo.length} already current, ${todo.length} to run (${jobs.length} simulations, ${jobsN} at a time)`);

const done = new Map<string, HourStats>(); // key or `base:<period>`
const t0 = Date.now();
await new Promise<void>((resolveAll, reject) => {
  const queues: Job[][] = Array.from({ length: Math.min(jobsN, Math.max(1, jobs.length)) }, () => []);
  jobs.forEach((j, i) => queues[i % queues.length].push(j));
  let live = queues.length, finished = 0;
  for (const q of queues) {
    const w = new Worker(new URL(import.meta.url), { workerData: { network: simNetwork, demand: demandText, jobs: q } as Payload, execArgv: process.execArgv });
    w.on('message', (m: { job: Job; stats: HourStats; ms: number }) => {
      done.set(m.job.key ?? `base:${m.job.period}`, m.stats);
      console.log(`  ${++finished}/${jobs.length} ${m.job.key ?? 'baseline'} ${m.job.period} (${(m.ms / 1000).toFixed(0)} s)`);
    });
    w.on('error', reject);
    w.on('exit', () => { if (--live === 0) resolveAll(); });
  }
});

const computed = new Date().toISOString();
const sizes: { key: string; raw: number; gz: number }[] = [];
for (const w of todo) {
  const sc = done.get(w.key), base = done.get(`base:${w.period}`);
  if (!sc || !base) throw new Error(`Missing run for ${w.key}`);
  const r: StoredResult = {
    version: RESULT_VERSION, area, period: w.period, key: w.key, items: w.items, inputs, seed: RESULT_SEED, demandScale: 1, seconds: RUN_SECONDS, computed,
    scenario: encodeStats(sc), baseline: encodeStats(base),
  };
  const text = JSON.stringify(r);
  writeFileSync(pathOf(w.key), text);
  sizes.push({ key: w.key, raw: text.length, gz: gzipSync(text).length });
}

// A full run drops files for scenarios that are no longer published; a partial run leaves them.
if (!only && periods.length === demand.periods.length) {
  for (const f of readdirSync(outDir)) if (f.endsWith('.json') && f !== 'index.json' && !wants.has(f.slice(0, -5))) { rmSync(join(outDir, f)); console.log(`removed ${f}`); }
}
const entries: StoredIndexEntry[] = [];
for (const f of readdirSync(outDir).sort()) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  const r = parseResult(readFileSync(join(outDir, f), 'utf8'));
  if (!r || !current(r)) continue;
  const w = wants.get(r.key);
  entries.push({ key: r.key, period: r.period, items: r.items, proposals: w?.proposals ?? [] });
}
const index: StoredIndex = { version: RESULT_VERSION, area, inputs, computed, results: entries };
writeFileSync(join(outDir, 'index.json'), JSON.stringify(index, null, 1) + '\n');

const total = readdirSync(outDir).filter((f) => f !== 'index.json').reduce((t, f) => t + statSync(join(outDir, f)).size, 0);
console.log(`\nwrote ${sizes.length} files in ${((Date.now() - t0) / 1000).toFixed(0)} s; ${entries.length} in the index; directory ${(total / 1024).toFixed(0)} KB`);
if (sizes.length) console.log(`size per file: raw ${Math.max(...sizes.map((s) => s.raw)) >> 10} KB max, gzipped ${Math.max(...sizes.map((s) => s.gz)) >> 10} KB max, ${(sizes.reduce((t, s) => t + s.gz, 0) / sizes.length / 1024).toFixed(0)} KB mean`);
