// Closure sweep (change explain-traffic-redistribution): for the side-street blocks with the most through cars today, close each one with a
// modal filter and report where its through cars go. Uses the WASM build and the traced runs of `simulate --redistribution`.
//
//   npx tsx tools/redistribution-sweep.ts [--period pm_peak] [--seeds 1-3] [--top 12] [--jobs 4] [--out sweep.json]
import { writeFileSync } from 'node:fs';
import { Worker } from 'node:worker_threads';
import type { Intervention } from '../src/types';
import { buildIndex } from '../src/lib/naming';
import { displacement, geoOf, parseTrace, type GraphQuery, type TraceRun, type TraceSummary } from '../src/lib/redistribution';
import { DEFAULT_DATA_DIR, loadAreaFiles } from './lib/agent-area';
import { defaultJobs, parseSeeds } from './lib/redistribution-cli';

const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const period = arg('--period', 'pm_peak');
const seeds = parseSeeds(arg('--seeds', '1-3'));
const top = Number(arg('--top', '12'));
const jobs = Number(arg('--jobs', String(defaultJobs())));
const out = arg('--out', '');
const SECONDS = 3600;
/** ASSUMPTION: a bypass "exists" when a legal path through other local streets costs at most the via flows' tolerance (1.3) times
 *  the baseline path between the same links at free flow; it "gains little" when fewer than a quarter of the displaced through cars
 *  newly drive a local block. */
const TOLERANCE = 1.3;
const LITTLE = 0.25;
const log = (s: string) => process.stderr.write(`${s}\n`);

async function pool(files: Awaited<ReturnType<typeof loadAreaFiles>>, tasks: { key: string; config: Record<string, unknown> }[], done: (key: string, run: TraceRun) => void) {
  let next = 0, n = 0;
  const t0 = Date.now();
  const workers = Array.from({ length: Math.min(jobs, tasks.length) }, () => new Worker(new URL('./lib/redistribution-worker.ts', import.meta.url), { workerData: { network: files.simNetwork, demand: files.demandText }, execArgv: ['--import', 'tsx'] }));
  await new Promise<void>((resolve, reject) => {
    const feed = (w: Worker) => { if (next >= tasks.length) return; const id = next++; w.postMessage({ id, config: tasks[id].config, seconds: SECONDS }); };
    for (const w of workers) {
      w.on('message', (m: { id: number; error?: string; requests: Float64Array; events: Uint32Array; summary: string; metrics: string }) => {
        if (m.error) { reject(new Error(m.error)); return; }
        done(tasks[m.id].key, { requests: m.requests, events: m.events, summary: JSON.parse(m.summary) as TraceSummary, metrics: JSON.parse(m.metrics) as Record<string, unknown> });
        log(`  ${++n}/${tasks.length} runs, ${Math.round((Date.now() - t0) / 1000)} s`);
        if (n === tasks.length) resolve(); else feed(w);
      });
      w.on('error', reject);
      feed(w);
    }
  });
  await Promise.all(workers.map((w) => w.terminate()));
}

async function main() {
  const files = await loadAreaFiles(DEFAULT_DATA_DIR, 'rockridge');
  const net = files.network;
  const index = buildIndex(net);
  const geo = geoOf(net);
  const isLocal = net.links.map((l) => l.inStudyArea && (l.class === 'residential' || l.class === 'service'));
  const pkg = (await import('../src/sim/pkg/traffic_sim.js')) as unknown as { initSync(o: { module: BufferSource }): unknown; redistributionGraph(n: string, p: string, m: string, b: string, s: string): string; simulatorFingerprint(): string };
  const { readFileSync } = await import('node:fs');
  pkg.initSync({ module: readFileSync(new URL('../src/sim/pkg/traffic_sim_bg.wasm', import.meta.url)) });

  log(`Baseline: ${seeds.length} seeds...`);
  const base = new Map<number, TraceRun>();
  await pool(files, seeds.map((seed) => ({ key: String(seed), config: { seed, period, interventions: [] } })), (k, r) => base.set(Number(k), r));
  // Through passages per local block today, over the window.
  const through = new Map<number, number>();
  for (const run of base.values()) {
    const p = parseTrace(run);
    p.reqs.forEach((r, i) => {
      if (r.stratum !== 0 || geo.inStudy[r.origin] || geo.inStudy[r.dest]) return;
      for (let k = p.off[i]; k < p.off[i + 1]; k++) {
        const l = p.links[k];
        if (p.times[k] >= 0 && isLocal[l]) through.set(index.blockOfLink[l], (through.get(index.blockOfLink[l]) ?? 0) + 1);
      }
    });
  }
  const chosen = [...through.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]).slice(0, top).map(([b]) => b);
  log(`Closures: ${chosen.map((b) => index.blocks[b].label).join('; ')}`);
  const ivs = new Map<number, Intervention[]>(chosen.map((b) => [b, [{ type: 'modal_filter', link: index.blocks[b].links[0] }]]));
  const runs = new Map<string, TraceRun>();
  const rows: unknown[] = [];
  const analyze = (b: number) => {
    const g = JSON.parse(pkg.redistributionGraph(files.simNetwork, period, 'car', '[]', JSON.stringify(ivs.get(b)))) as GraphQuery;
    const block = index.blocks[b];
    const centers = block.links.map((l) => [net.nodes[net.links[l].from].x, net.nodes[net.links[l].from].y] as [number, number]);
    const sel = { kind: 'direct' as const, movements: g.closed.map((m) => [m[0], m[1]] as [number, number]), links: g.closedLinks };
    const tot = { displaced: 0, local: 0, arterialOnly: 0, pending: 0, removed: 0, unroutable: 0, unmatched: 0 };
    const byBlock = new Map<number, number>(), routes = new Map<string, number>();
    for (const seed of seeds) {
      const d = displacement({ baseline: base.get(seed)!, scenario: runs.get(`${b}:${seed}`)!, selector: sel, seconds: SECONDS, geo, centers, isLocal, blockOf: index.blockOfLink });
      for (const k of Object.keys(tot) as (keyof typeof tot)[]) tot[k] += d[k] as number;
      for (const [x, n] of d.byBlock) byBlock.set(x, (byBlock.get(x) ?? 0) + n);
      for (const [x, n] of d.routes) routes.set(x, (routes.get(x) ?? 0) + n);
    }
    // Legal local bypasses: witness paths that use another local street, within the tolerance.
    const bypasses: { streets: string; ratio: number; extraS: number }[] = [];
    for (const w of g.witnesses) for (const p of w.paths) {
      if (p.baselineCostS === null || !p.links.some((l) => isLocal[l] && !block.links.includes(l))) continue;
      const ratio = p.costS / Math.max(p.baselineCostS, 1);
      const streets = [...new Set(p.links.map((l) => geo.linkName[l]))].join(' → ');
      if (!bypasses.some((x) => x.streets === streets)) bypasses.push({ streets, ratio: Math.round(ratio * 100) / 100, extraS: Math.round(p.costS - p.baselineCostS) });
    }
    bypasses.sort((x, y) => x.ratio - y.ratio);
    const within = bypasses.filter((x) => x.ratio <= TOLERANCE);
    const n = seeds.length;
    const share = tot.displaced ? tot.local / tot.displaced : 0;
    const row = {
      closure: block.label, intervention: ivs.get(b)![0], throughTodayPerHour: Math.round((through.get(b) ?? 0) / n),
      displacedPerHour: +(tot.displaced / n).toFixed(1),
      perHour: { newLocalStreets: +(tot.local / n).toFixed(1), arterialsOrSameStreets: +(tot.arterialOnly / n).toFixed(1), pending: +(tot.pending / n).toFixed(1), removed: +(tot.removed / n).toFixed(1), unroutable: +(tot.unroutable / n).toFixed(1), unmatched: +(tot.unmatched / n).toFixed(1) },
      shareOnNewLocalStreets: +share.toFixed(2),
      receivingBlocks: [...byBlock.entries()].sort((x, y) => y[1] - x[1]).slice(0, 4).map(([x, c]) => ({ block: index.blocks[x].label, perHour: +(c / n).toFixed(1) })),
      topRoutes: [...routes.entries()].sort((x, y) => y[1] - x[1]).slice(0, 4).map(([k, c]) => ({ nearClosure: k, perHour: +(c / n).toFixed(1) })),
      legalLocalBypasses: bypasses.slice(0, 3), bypassWithinTolerance: within.length > 0,
      flagged: within.length > 0 && share < LITTLE,
    };
    rows.push(row);
    log(`${row.flagged ? 'FLAG ' : ''}${block.label}: displaced ${row.displacedPerHour}/h, new local ${row.perHour.newLocalStreets}, arterial ${row.perHour.arterialsOrSameStreets}`);
    for (const seed of seeds) runs.delete(`${b}:${seed}`);
  };
  const pending = new Map(chosen.map((b) => [b, seeds.length]));
  await pool(files, chosen.flatMap((b) => seeds.map((seed) => ({ key: `${b}:${seed}`, config: { seed, period, interventions: ivs.get(b) } }))), (k, r) => {
    runs.set(k, r);
    const b = Number(k.split(':')[0]);
    pending.set(b, pending.get(b)! - 1);
    if (pending.get(b) === 0) analyze(b);
  });
  const result = {
    kind: 'redistribution-sweep', status: 'Model output of an uncalibrated simulation, not a forecast.', period, seeds, seconds: SECONDS,
    hashes: { network: files.hashes.network.slice(0, 16), demand: files.hashes.demand.slice(0, 16), simulator: pkg.simulatorFingerprint() },
    rule: { closure: 'one modal filter on the block (both directions)', displaced: 'baseline through trips (neither end in the study area) that drove the closed block in the hour', tolerance: TOLERANCE, littleGain: LITTLE },
    rows,
  };
  const text = JSON.stringify(result, null, 1);
  if (out) writeFileSync(out, `${text}\n`); else process.stdout.write(`${text}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
