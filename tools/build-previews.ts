// Writes the link-preview cards and their index: public/data/og/<name>-<hash>.jpg (1200x630) and public/data/og/index.json, published like the other
// data files with `npm run data:push` and read by the Worker, which puts the tags in the page head (worker/og.ts).
//   npm run data:previews [-- --area rockridge] [--data-dir public/data] [--out public/data/og] [--site https://...] [--quality 82]
// Reads files already in public/data: run it after `npm run data`, `npm run data:results` and the proposal search, before `npm run data:push`.
// A proposals group computed on other inputs than the files served now, or one with no picture, gets no card of its own and is listed as skipped.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { SITE_URL } from '../src/config';
import { PREVIEW_INDEX_FILE, PREVIEW_PREFIX, type PreviewIndex, type PreviewPage } from '../src/lib/previews';
import { parseProposals, proposalsUrl, hashMatches } from '../src/lib/proposals';
import { defaultPeriod } from '../src/lib/run';
import { base64ToF32, parseResult, type StoredIndex } from '../src/lib/stored-results';
import { CliError, DEFAULT_DATA_DIR, fileOf, loadAreaFiles } from './lib/agent-area';
import { writeFileAtomic } from './lib/atomic';
import { buildCard, CARD_H, CARD_W, MIN_TEXT_PX } from './lib/og-card';
import { planPreviews, type BaselineInput, type Plan } from './lib/previews';
import { fontMeasure, svgToJpeg } from './lib/raster';
import { loadEngine } from './lib/run-result';

const arg = (k: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : undefined; };
const area = arg('--area') ?? 'rockridge';
const dataDir = resolve(arg('--data-dir') ?? DEFAULT_DATA_DIR);
const outDir = resolve(arg('--out') ?? join(dataDir, 'og'));
const site = (arg('--site') ?? SITE_URL).replace(/\/$/, '');
const quality = Number(arg('--quality') ?? 82);
const readIf = (path: string) => (existsSync(path) ? readFileSync(path, 'utf8') : null);

try {
  const files = await loadAreaFiles(dataDir, area);
  const proposalsText = readIf(fileOf(dataDir, proposalsUrl(files.entry)));
  const skipped: string[] = [];

  let baseline: BaselineInput | null = null;
  const period = defaultPeriod(files.entry, files.demand.periods);
  const resultsDir = join(dataDir, 'results', area);
  const indexText = readIf(join(resultsDir, 'index.json'));
  const entry = indexText ? (JSON.parse(indexText) as StoredIndex).results.filter((e) => e.period === period).sort((a, b) => a.key.localeCompare(b.key))[0] : undefined;
  const result = entry ? parseResult(readIf(join(resultsDir, `${entry.key}.json`)) ?? '', files.network) : null;
  if (result && hashMatches(result.inputs.networkHash, files.hashes.network) && hashMatches(result.inputs.demandHash, files.hashes.demand)) {
    baseline = { period, linkStats: base64ToF32(result.baseline.linkStats), throughVph: result.baseline.metrics.cutThrough.vehiclesPerHour };
  } else skipped.push(`today's map: no stored ${period} baseline computed on the current network and demand, so the cards show streets without through-car shading`);

  let simulator: string | null = null;
  try { simulator = (await loadEngine()).fingerprint; } catch { skipped.push('simulator: the WASM build is not present, so proposal groups are not checked against the current simulator (run `npm run wasm` first)'); }
  const { plans, fallback, skipped: planSkipped } = planPreviews({
    siteHost: new URL(site).host, area: files.entry, network: files.network, demand: files.demand, hashes: files.hashes, simulator,
    proposals: proposalsText ? parseProposals(proposalsText) : null, baseline,
  });
  skipped.push(...planSkipped);
  if (!proposalsText) skipped.push('proposals: no proposals file');

  const measure = fontMeasure();
  mkdirSync(outDir, { recursive: true });
  for (const f of readdirSync(outDir)) if (f.endsWith('.jpg') || f === PREVIEW_INDEX_FILE) rmSync(join(outDir, f));

  const pageOf = (plan: Plan, file: string): PreviewPage => ({ title: plan.meta.title, description: plan.meta.description, image: `${PREVIEW_PREFIX}${file}`, imageAlt: plan.meta.imageAlt, imageWidth: CARD_W, imageHeight: CARD_H });
  const files_ = new Map<string, string>();
  const render = (plan: Plan): string => {
    const card = buildCard(plan.card, measure);
    const small = card.texts.filter((t) => t.size < MIN_TEXT_PX);
    if (!card.fits) throw new CliError(`The card for ${plan.path} does not fit: content ends at ${Math.round(card.contentBottom)} px, footer starts at ${Math.round(card.footerTop)} px.`);
    if (small.length > 0) throw new CliError(`The card for ${plan.path} has text under ${MIN_TEXT_PX} px: "${small[0].text}".`);
    const r = svgToJpeg(card.svg, quality);
    if (r.width !== CARD_W || r.height !== CARD_H) throw new CliError(`The card for ${plan.path} rendered at ${r.width}x${r.height}.`);
    const hash = createHash('sha256').update(r.jpeg).digest('hex').slice(0, 8);
    const file = `${plan.name}-${hash}.jpg`;
    writeFileAtomic(join(outDir, file), r.jpeg);
    files_.set(file, `${(r.jpeg.length / 1024).toFixed(0)} KB`);
    return file;
  };
  const pages: Record<string, PreviewPage> = {};
  for (const plan of plans) pages[plan.path] = pageOf(plan, render(plan));
  const fallbackPage = pageOf(fallback, [...files_.keys()].find((f) => f.startsWith('home-')) ?? render(fallback));
  const index: PreviewIndex = { version: 1, site, siteName: 'Traffic', fallback: fallbackPage, pages };
  writeFileAtomic(join(outDir, PREVIEW_INDEX_FILE), `${JSON.stringify(index, null, 2)}\n`);

  for (const [f, size] of files_) console.log(`wrote ${join(outDir, f)} (${size})`);
  console.log(`wrote ${join(outDir, PREVIEW_INDEX_FILE)}: ${Object.keys(pages).length} paths, ${files_.size} images`);
  const big = [...files_].filter(([, s]) => Number.parseInt(s, 10) > 300);
  if (big.length) console.warn(`over 300 KB: ${big.map(([f]) => f).join(', ')}`);
  for (const s of skipped) console.log(`skipped ${s}`);
} catch (err) {
  console.error(`error: ${(err as Error).message}`);
  process.exit(err instanceof CliError ? err.code : 1);
}
