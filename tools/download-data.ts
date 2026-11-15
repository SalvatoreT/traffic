// Downloads the study-area files the site publishes, with plain HTTPS GETs and no credentials, into public/data/.
//   npm run data:download [-- --area rockridge] [--all] [--dir public/data] [--site https://...]
// Core: areas.json plus the area's network and demand files, enough to run `npm run simulate`.
// --all: also the proposals, assumptions, basemap, noise and stored results, enough to regenerate the text pages (`npm run data:llms`).
// Only GET, only paths under /data/. The site comes from src/config.ts (SITE_URL) or TRAFFIC_SITE_URL; behind a proxy set NODE_USE_ENV_PROXY=1.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { AreaEntry } from '../src/types';
import { SITE_URL } from '../src/config';
import { CliError, DEFAULT_DATA_DIR } from './lib/agent-area';
import { getData, wanted, type Fetched } from './lib/download';

const arg = (k: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : undefined; };
const all = process.argv.includes('--all');
const dir = resolve(arg('--dir') ?? DEFAULT_DATA_DIR);
const site = (arg('--site') ?? process.env.TRAFFIC_SITE_URL ?? SITE_URL).replace(/\/$/, '');
const only = arg('--area');

const fetcher = (url: string, init: { method: 'GET'; headers: Record<string, string> }) => fetch(url, init);
const show = (f: Fetched) => console.log(`${f.status.padEnd(9)} ${f.path}${f.bytes ? ` (${(f.bytes / 1024).toFixed(0)} KB)` : ''}`);

try {
  const index = await getData(site, '/data/areas.json', dir, fetcher);
  show(index);
  const areas = JSON.parse(readFileSync(resolve(dir, 'areas.json'), 'utf8')) as AreaEntry[];
  for (const entry of areas.filter((a) => !only || a.id === only)) {
    for (const path of wanted(entry, all)) show(await getData(site, path, dir, fetcher, all && !/\.(network|demand)\.json$/.test(path)));
    if (all) {
      const idx = await getData(site, `/data/results/${entry.id}/index.json`, dir, fetcher, true);
      show(idx);
      if (idx.status !== 'missing') {
        const list = JSON.parse(readFileSync(resolve(dir, `results/${entry.id}/index.json`), 'utf8')) as { results: { key: string }[] };
        for (const r of list.results) show(await getData(site, `/data/results/${entry.id}/${r.key}.json`, dir, fetcher, true));
        show(await getData(site, `/data/results/${entry.id}/baseline-intents.json`, dir, fetcher, true));
      }
    }
  }
  if (only && !areas.some((a) => a.id === only)) throw new CliError(`${site} lists no area "${only}": ${areas.map((a) => a.id).join(', ')}.`, 2);
  console.log(`Done. Files are in ${dir}. Next: npm run simulate -- --help`);
} catch (err) {
  console.error(`error: ${(err as Error).message}`);
  process.exit(err instanceof CliError ? err.code : 1);
}
