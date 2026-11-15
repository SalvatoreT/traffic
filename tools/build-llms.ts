// Writes the text pages that let a language model read the site without running JavaScript: llms.txt, llms-full.txt, index.md, proposals.md, streets.md,
// assumptions.md, sources.md and copies of the three guide documents, into public/data/llms/ (published like the other data files, with `npm run data:push`).
//   npm run data:llms [-- --area rockridge] [--data-dir public/data] [--out public/data/llms] [--site https://...] [--date 2026-11-15T00:00:00Z]
// Everything comes from files already in public/data and docs/: run it after `npm run data`, `npm run data:results` and the proposal search, and before data:push.
// With the WASM build present it also checks whether stored results came from the current simulator; without it, that check is skipped and the pages say so.
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { SITE_URL, SOURCE_REPO_URL } from '../src/config';
import { parseProposals, proposalsUrl } from '../src/lib/proposals';
import { parseAssumptions } from '../src/lib/assumptions';
import { parseBaselineIntents } from '../src/lib/baseline-intents';
import { base64ToF32, parseResult, type StoredIndex } from '../src/lib/stored-results';
import { CliError, DEFAULT_DATA_DIR, fileOf, loadAreaFiles, repoRoot } from './lib/agent-area';
import { buildPages, type BaselineSet, type LlmsInput } from './lib/llms-docs';
import { loadEngine } from './lib/run-result';
import { writeFileAtomic } from './lib/atomic';

const arg = (k: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : undefined; };
const area = arg('--area') ?? 'rockridge';
const dataDir = resolve(arg('--data-dir') ?? DEFAULT_DATA_DIR);
const outDir = resolve(arg('--out') ?? join(dataDir, 'llms'));
const site = (arg('--site') ?? SITE_URL).replace(/\/$/, '');
const generated = arg('--date') ?? new Date().toISOString();

const readIf = (path: string) => (existsSync(path) ? readFileSync(path, 'utf8') : null);
const doc = (name: string) => {
  const t = readIf(join(repoRoot, 'docs', name));
  if (t === null) throw new CliError(`Missing docs/${name}.`);
  return t;
};

try {
  const files = await loadAreaFiles(dataDir, area);
  const proposalsText = readIf(fileOf(dataDir, proposalsUrl(files.entry)));
  const assumptions = readIf(join(dataDir, `${area}.assumptions.json`));
  const resultsDir = join(dataDir, 'results', area);
  const indexText = readIf(join(resultsDir, 'index.json'));
  const resultsIndex = indexText ? (JSON.parse(indexText) as StoredIndex) : null;
  const baselineIntents = readIf(join(resultsDir, 'baseline-intents.json'));

  let simulator: string | null = null;
  try { simulator = (await loadEngine()).fingerprint; } catch { console.warn('The WASM build is not present, so stored results are not checked against the current simulator. Run `npm run wasm` first for that check.'); }

  const baselines: Record<string, BaselineSet> = {};
  if (resultsIndex) {
    const entries = [...resultsIndex.results].sort((a, b) => a.key.localeCompare(b.key));
    for (const e of entries) {
      if (baselines[e.period]) continue;
      const text = readIf(join(resultsDir, `${e.key}.json`));
      const r = text ? parseResult(text, files.network) : null;
      if (!r) continue;
      baselines[e.period] = { period: r.period, metrics: r.baseline.metrics, linkStats: base64ToF32(r.baseline.linkStats), key: r.key, computed: r.computed, inputs: r.inputs, seed: r.seed, seconds: r.seconds };
    }
  }

  const config = readIf(join(repoRoot, 'data/areas', `${area}.json`));
  const boundary = config ? ((JSON.parse(config).boundary ?? []) as (string | { ref: string; class: string })[]).map((b) => (typeof b === 'string' ? b : b.class === 'motorway' ? `${b.ref} freeway` : b.ref)) : null;

  const input: LlmsInput = {
    site, repo: SOURCE_REPO_URL, generated, area: files.entry, network: files.network, demand: files.demand, hashes: files.hashes, simulator, boundary,
    proposals: proposalsText ? parseProposals(proposalsText) : null,
    assumptions: assumptions ? parseAssumptions(assumptions) : null,
    baselines, baselineIntents: baselineIntents ? parseBaselineIntents(baselineIntents) : null, resultsIndex,
    dataFiles: [] as string[],
    docs: {
      scenarioLinks: doc('scenario-links.md'), dataFiles: doc('data-files.md'), runLocally: doc('run-locally.md'), references: doc('references.md'),
      readme: readIf(join(repoRoot, 'README.md')) ?? '', proposalsReadme: readIf(join(repoRoot, 'data/proposals/README.md')) ?? '', license: readIf(join(repoRoot, 'LICENSE')) ?? '',
    },
  };
  const listing = readdirSync(dataDir).map((f) => `/data/${f}`);
  if (existsSync(resultsDir)) listing.push(...readdirSync(resultsDir).filter((f) => f === 'index.json' || f === 'baseline-intents.json').map((f) => `/data/results/${area}/${f}`));
  input.dataFiles = listing;

  const pages = buildPages(input);
  mkdirSync(outDir, { recursive: true });
  for (const [name, text] of Object.entries(pages)) {
    writeFileAtomic(join(outDir, name), text);
    console.log(`wrote ${join(outDir, name)} (${(text.length / 1024).toFixed(1)} KB)`);
  }
  const state = Object.values(baselines)[0];
  console.log(`inputs: network ${files.hashes.network.slice(0, 16)}, demand ${files.hashes.demand.slice(0, 16)}, simulator ${simulator ? simulator.slice(0, 8) : 'unknown'}; stored baseline ${state ? `${state.key} (network ${state.inputs.networkHash.slice(0, 16)}, demand ${state.inputs.demandHash.slice(0, 16)})` : 'none'}`);
} catch (err) {
  console.error(`error: ${(err as Error).message}`);
  process.exit(err instanceof CliError ? err.code : 1);
}
