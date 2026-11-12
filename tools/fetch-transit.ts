// Downloads the transit agency's GTFS feed into data/transit/raw/. Node built-ins only (global fetch).
// Usage: npx tsx tools/fetch-transit.ts [config.json] [--force] [--file <local.zip>] [--url <url>]
// The download URL and token variable come from the config; --file stores a zip fetched another way.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { readZip } from './lib/zip';

const args = process.argv.slice(2);
const flag = (n: string) => args.indexOf(n);
const val = (n: string) => (flag(n) >= 0 ? args[flag(n) + 1] : undefined);
const cfg = JSON.parse(readFileSync(args.find((a) => a.endsWith('.json')) ?? 'data/transit/rockridge.config.json', 'utf8'));
const out: string = cfg.raw.gtfs;
const force = args.includes('--force');

function check(path: string) {
  const files = readZip(path, (n) => n === 'feed_info.txt' || n === 'routes.txt');
  if (!files.has('routes.txt')) throw new Error(`${path} has no routes.txt: not a GTFS feed`);
  const info = files.get('feed_info.txt')?.toString('utf8').split(/\r?\n/).slice(0, 2).join(' | ');
  console.log(`GTFS ok${info ? `; feed_info: ${info}` : ''}`);
}

if (existsSync(out) && !force && !val('--file')) {
  console.log(`skip ${out} (use --force to re-download)`);
} else {
  mkdirSync(dirname(out), { recursive: true });
  const file = val('--file');
  if (file) copyFileSync(file, out);
  else {
    let url = val('--url') ?? cfg.feed.downloadUrl;
    const token = process.env[cfg.feed.tokenEnv];
    if (token && !val('--url')) url += `${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`${cfg.feed.downloadUrl}: HTTP ${res.status}. ${cfg.feed.tokenNote ?? ''}`);
      process.exit(1);
    }
    writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  }
  check(out);
  console.log(`wrote ${out}`);
}
