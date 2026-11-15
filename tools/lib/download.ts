import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { writeFileAtomic } from './atomic';

/** A path the downloader may request: under /data/, plain name segments, no query. It never touches /api. */
export function isPublicDataPath(path: string): boolean {
  if (!path.startsWith('/data/') || path.length > 200 || path.includes('?') || path.includes('#')) return false;
  const parts = path.slice(6).split('/');
  return parts.length >= 1 && parts.length <= 3 && parts.every((p) => /^[\w.-]+$/.test(p) && p !== '.' && p !== '..');
}

/** The files an area needs to run the model (`core`) and the ones the text pages are generated from (`all`), as /data paths. */
export function wanted(entry: { network: string; demand: string; basemap?: string; noise?: string; proposals?: string; id: string }, all: boolean): string[] {
  const abs = (u: string) => (u.startsWith('/') ? u : `/data/${u}`);
  const core = [abs(entry.network), abs(entry.demand)];
  if (!all) return core;
  return [...core, ...(entry.basemap ? [abs(entry.basemap)] : []), ...(entry.noise ? [abs(entry.noise)] : []), abs(entry.proposals ?? `/data/${entry.id}.proposals.json`), `/data/${entry.id}.assumptions.json`];
}

export type Fetch = (url: string, init: { method: 'GET'; headers: Record<string, string> }) => Promise<{ ok: boolean; status: number; text(): Promise<string> }>;

export interface Fetched { path: string; status: 'new' | 'updated' | 'unchanged' | 'missing'; bytes: number; sha256?: string }

/** GET one /data file and write it under `dir`, only when its content differs. A 404 on an optional file is `missing`, not an error. */
export async function getData(site: string, path: string, dir: string, fetcher: Fetch, optional = false): Promise<Fetched> {
  if (!isPublicDataPath(path)) throw new Error(`Refusing to request ${path}: only /data/ files are downloaded.`);
  const url = `${site.replace(/\/$/, '')}${path}`;
  const res = await fetcher(url, { method: 'GET', headers: { accept: 'application/json', 'user-agent': 'traffic-data-download' } });
  if (res.status === 404 && optional) return { path, status: 'missing', bytes: 0 };
  if (!res.ok) throw new Error(`GET ${url}: HTTP ${res.status}`);
  const text = await res.text();
  try { JSON.parse(text); } catch { throw new Error(`GET ${url} did not return JSON (the site may have served its app page instead).`); }
  const file = join(dir, path.slice(6));
  const had = existsSync(file);
  if (had && readFileSync(file, 'utf8') === text) return { path, status: 'unchanged', bytes: text.length, sha256: sha(text) };
  mkdirSync(dirname(file), { recursive: true });
  writeFileAtomic(file, text);
  return { path, status: had ? 'updated' : 'new', bytes: text.length, sha256: sha(text) };
}

const sha = (t: string) => createHash('sha256').update(t).digest('hex');
