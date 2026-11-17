#!/usr/bin/env node
// Test stand-in for target/release/search_bench: `table` and `confirm` write a results file whose identity names the inputs under the working
// directory, the case's hash and STUB_FINGERPRINT.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const a = process.argv.slice(2);
const get = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
const sha = (p) => (existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex') : '');
const area = JSON.parse(readFileSync(get('--case'), 'utf8')).area;
const identity = { simulator: process.env.STUB_FINGERPRINT ?? 'f'.repeat(32), caseSha256: sha(get('--case')), inputs: { network: sha(`public/data/${area}.network.json`), demand: sha(`public/data/${area}.demand.json`), areas: sha('public/data/areas.json') } };
const out = get('--out');
if (a[0] === 'table') writeFileSync(out, JSON.stringify({ schema: 'search-benchmark-results-1', identity, packages: [] }));
else if (a[0] === 'confirm') {
  writeFileSync(out.replace(/\.json$/, '.shortlist.json'), JSON.stringify({ packages: [] }));
  writeFileSync(out, JSON.stringify({ identity, packages: [] }));
} else process.exit(2);
