// Runs one scenario headless and prints JSON: `npm run simulate -- --link "<url or #v1;...>"`. See `--help` and docs/run-locally.md.
// Uses the WASM build the app runs (`npm run wasm`), so for the same period, seed and demand its numbers equal the app's.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import type { Metrics } from '../src/types';
import { buildIndex } from '../src/lib/naming';
import { base64ToF32, f32ToBase64 } from '../src/lib/stored-results';
import { CliError, DATA_HELP, DEFAULT_DATA_DIR, EXIT, loadAreaFiles, repoRoot, type AreaFiles } from './lib/agent-area';
import { findPlaces, type Place } from './lib/describe-network';
import { buildReport, parseArgs, parseInterventionsJson, resolvePeriod, scenarioFromLink, type Args, type Scenario } from './lib/simulate-report';
import { loadEngine, runFor, type Engine, type HourStats } from './lib/run-result';
import { INTERVENTION_TYPES } from './lib/intervention-types';
import { defaultJobs, parseSeeds, redistribution } from './lib/redistribution-cli';

const HELP = `Usage: npm run simulate -- <what to do> [options]

Run a scenario (needs the WASM build and the data files):
  --link <url|#v1;...>     a scenario link: a full URL, or the part from "#v1;" on
  --interventions <file>   or a JSON list of interventions (see --list-interventions)
  (neither)                the baseline alone
  --area <id>              study area (default rockridge)
  --period <id>            demand period (default: the link's p=, else the area's default)
  --seed <n>               random seed (default 1, the app's)
  --minutes <m>            simulated minutes (default 60, the app's full hour)
  --demand <x>             demand scale 0.1 to 3 (default 1, or the link's d=)
  --blocks side|all|none   per-block changes: study-area side streets (default), every listed block, or none
  --top <n>                blocks per list for --blocks side (default 15)
  --strict                 fail when an item of the link cannot be placed (otherwise it is reported and skipped)
  --json | --pretty        compact or indented JSON (default indented)
  --no-cache               do not reuse a saved baseline

Where traffic goes when a closure is added (needs the WASM build and the data files):
  --redistribution         baseline, the closure alone and the package, traced, for each seed (see docs/run-locally.md)
  --closure <item>         the closure to follow: one link item, e.g. mn,9q9p3fr7b5 (optional when --link has one item)
  --link <url|#v1;...>     the package that contains it (optional: without it the package is the closure alone)
  --seeds <list>           seeds, e.g. 1-10 or 1,2,3 (default 1; the reporting method needs 10 pairs for a statement)
  --jobs <n>               runs at a time, in worker threads (default up to 4)
  --cohort direct|crossings  trips that drove a movement the closure removes (default), or every crossing of its junctions
  --streets "<a>,<b>"      always list the blocks of these streets, e.g. "63rd Street,Dana Street"
  --out <file>             also write the JSON there
  --trace-max <n>          bound on stored route events per run (default 1,500,000; counts stay exact)
  --graph-only             only the legal paths around the closure, no runs (fast)
  --from <file>            print a stored diagnostic if it was made on these inputs and this simulator, else exit 3

Look things up (needs only the data files):
  --find "<streets>"       blocks and intersections that match, with the link item for each intervention, e.g. --find "Colby St & 60th St"
  --limit <n>              most matches printed (default 20)
  --places                 the study area's streets and intersections, names and ids only
  --list-interventions     the intervention types, their link items and JSON forms

  --data-dir <dir>         where areas.json and the area files are (default public/data)
Exit codes: 0 done, 2 bad arguments or link, 3 data files missing or unusable, 4 WASM build missing, 1 anything else.`;

const log = (s: string) => process.stderr.write(`${s}\n`);
const out = (a: Args, v: unknown) => process.stdout.write(`${a.pretty ? JSON.stringify(v, null, 2) : JSON.stringify(v)}\n`);

function studyPlaces(files: AreaFiles) {
  const idx = buildIndex(files.network);
  return {
    area: files.entry.id,
    streets: [...new Set(idx.blocks.filter((b) => b.inStudyArea).map((b) => b.name))].sort(),
    blocks: idx.blocks.map((b, id) => ({ b, id })).filter(({ b }) => b.inStudyArea).map(({ b, id }) => ({ id, label: b.label, class: b.cls, lengthM: Math.round(b.lengthM), links: b.links })),
    intersections: idx.intersections.filter((n) => files.network.nodes[n].inStudyArea).map((n) => ({ id: n, name: idx.nodeName[n], control: files.network.nodes[n].control })),
  };
}

function findOutput(files: AreaFiles, a: Args) {
  const idx = buildIndex(files.network);
  const period = resolvePeriod(files.entry, files.demand, a.period).id;
  const places = findPlaces(files.network, idx, a.find!, { limit: a.limit });
  const shown = (p: Place) => ({
    ...p,
    options: p.options.map((o) => ({ type: o.type, label: o.label, item: o.item, intervention: o.intervention })),
  });
  return {
    query: a.find, area: files.entry.id, period, matches: places.length,
    how: `To combine places, join the chosen items with "~" after "s=": #v1;a=${files.entry.id};p=${period};s=<item>~<item>. The same list in JSON form goes in a file for --interventions.`,
    places: places.map(shown),
    ...(places.length === 0 ? { hint: 'Nothing matched. Try one street name, or run --places to see the names the model uses.' } : {}),
  };
}

const cachePath = (key: string) => join(repoRoot, 'node_modules/.cache/traffic-simulate', `${key}.json`);

function baselineFor(e: Engine, files: AreaFiles, a: { period: string; seed: number; seconds: number; demandScale: number; noCache: boolean }): HourStats {
  const key = createHash('sha256').update([files.hashes.network, files.hashes.demand, e.fingerprint, a.period, a.seed, a.seconds, a.demandScale].join('|')).digest('hex').slice(0, 24);
  const path = cachePath(key);
  if (!a.noCache && existsSync(path)) {
    try {
      const s = JSON.parse(readFileSync(path, 'utf8')) as { metrics: Metrics; linkStats: string };
      log('Baseline: reusing the saved run for these inputs.');
      return { metrics: s.metrics, linkStats: base64ToF32(s.linkStats), intentLinks: null, intentTrips: null };
    } catch { /* run again */ }
  }
  log(`Baseline: simulating ${a.seconds / 60} minutes of ${a.period}...`);
  let s: HourStats;
  try { s = runFor(e, files.simNetwork, files.demandText, { period: a.period, interventions: [], seed: a.seed, seconds: a.seconds, demandScale: a.demandScale }); } catch (err) {
    // The engine refuses network data it cannot run as stated (a signal whose observed greens and clearance do not add up to its cycle).
    throw new CliError(`The baseline cannot run on these data files: ${(err as Error).message ?? err}\n${DATA_HELP}`, EXIT.data);
  }
  if (!a.noCache) {
    try { mkdirSync(join(repoRoot, 'node_modules/.cache/traffic-simulate'), { recursive: true }); writeFileSync(path, JSON.stringify({ metrics: s.metrics, linkStats: f32ToBase64(s.linkStats) })); } catch { /* a read-only checkout is fine */ }
  }
  return s;
}

async function engine(): Promise<Engine> {
  try { return await loadEngine(); } catch (err) {
    const m = (err as Error).message;
    throw new CliError(`The simulator is not built: ${m.split('\n')[0]}\nBuild it once with \`npm run wasm\` (needs a Rust toolchain with the wasm32-unknown-unknown target; see docs/run-locally.md).`, EXIT.wasm);
  }
}

async function simulate(files: AreaFiles, a: Args) {
  let scenario: Scenario = { interventions: [], unplaced: [], source: 'none' };
  if (a.link !== undefined) scenario = scenarioFromLink(files.network, a.link, files.entry.id);
  else if (a.interventions !== undefined) {
    if (!existsSync(a.interventions)) throw new CliError(`No such file: ${a.interventions}`, EXIT.usage);
    scenario = { interventions: parseInterventionsJson(files.network, readFileSync(a.interventions, 'utf8')), unplaced: [], source: 'file' };
  }
  const notes: string[] = [];
  if (scenario.unplaced.length) {
    const msg = `${scenario.unplaced.length} of the link's items could not be placed on this network and were left out: ${scenario.unplaced.map((u) => `${u.type} (${u.reason})`).join('; ')}`;
    if (a.strict) throw new CliError(msg, EXIT.usage);
    notes.push(msg);
  }
  const period = resolvePeriod(files.entry, files.demand, a.period, scenario.period);
  if (a.period && scenario.period && a.period !== scenario.period) notes.push(`--period ${a.period} overrides the link's p=${scenario.period}.`);
  const demandScale = a.demand ?? scenario.demandScale ?? 1;
  const seconds = Math.round(a.minutes * 60);
  if (seconds !== 3600) notes.push(`The run is ${a.minutes} simulated minutes, not the app's full hour. Rates are per hour, but the early part of a run is noisy.`);
  if (demandScale !== 1) notes.push(`Demand is scaled to ${demandScale}. The app's stored results and proposals use 1.`);
  if (a.seed !== 1) notes.push(`Seed ${a.seed}. The app and the stored results use seed 1.`);
  if (scenario.source !== 'none' && scenario.interventions.length === 0) notes.push('No intervention was placed, so the scenario equals the baseline.');

  const e = await engine();
  const params = { period: period.id, seed: a.seed, seconds, demandScale, noCache: a.noCache };
  const base = baselineFor(e, files, params);
  let scen: HourStats = base;
  if (scenario.interventions.length) {
    log(`Scenario: simulating ${scenario.interventions.length} intervention${scenario.interventions.length === 1 ? '' : 's'}...`);
    try { scen = runFor(e, files.simNetwork, files.demandText, { period: period.id, interventions: scenario.interventions, seed: a.seed, seconds, demandScale }); } catch (err) {
      throw new CliError(`The scenario cannot run: ${(err as Error).message ?? err}`, EXIT.usage);
    }
  }
  return buildReport({
    area: files.entry, network: files.network, demand: files.demand, index: buildIndex(files.network), hashes: files.hashes, simulator: e.fingerprint,
    period, seed: a.seed, seconds, demandScale, interventions: scenario.interventions, unplaced: scenario.unplaced, source: scenario.source,
    base, scen, blocks: a.blocks, top: a.top, notes,
  });
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  if (a.help) { console.log(HELP); return; }
  if (a.listInterventions) { out(a, { types: INTERVENTION_TYPES, grammar: 'docs/scenario-links.md' }); return; }
  const files = await loadAreaFiles(a.dataDir ?? DEFAULT_DATA_DIR, a.area);
  if (a.find !== undefined) { out(a, findOutput(files, a)); return; }
  if (a.places) { out(a, studyPlaces(files)); return; }
  if (a.redistribution) {
    out(a, await redistribution(files, {
      link: a.link, closure: a.closure, seeds: parseSeeds(a.seeds ?? String(a.seed)), jobs: a.jobs ?? defaultJobs(), cohort: a.cohort, streets: a.streets,
      out: a.out, traceMax: a.traceMax, graphOnly: a.graphOnly, from: a.from, period: a.period, minutes: a.minutes, demand: a.demand,
    }));
    return;
  }
  out(a, await simulate(files, a));
}

main().catch((err) => {
  if (err instanceof CliError) { console.error(`error: ${err.message}`); process.exit(err.code); }
  console.error(err);
  process.exit(1);
});
