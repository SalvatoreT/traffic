#!/usr/bin/env node
// Test stand-in for target/release/explore: writes one group per requested profile into --out (keeping the other groups), a report with profile sections, and the seeds file;
// `--seed-proposals FILE` adds that file's search options to data/proposals/<area>.seeds.json under the working directory.
// Environment: STUB_FINGERPRINT, STUB_METHOD (reporting-method version).
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const a = process.argv.slice(2);
const get = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
const area = get('--area') ?? 'rockridge';
const h16 = (p) => (existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 16) : null);
const read = (p) => (p && existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const keyOf = (l) => (l.split(';').find((t) => t.startsWith('s=')) ?? '').slice(2).split('~').sort().join('~');
if (get('--seed-proposals')) {
  const path = `data/proposals/${area}.seeds.json`;
  const f = read(path) ?? { version: 1, area, cap: 20, seeds: [] };
  for (const g of read(get('--seed-proposals')).groups) for (const p of g.proposals.filter((q) => q.kind === 'search')) {
    if (!f.seeds.some((s) => keyOf(s.link) === keyOf(p.link))) f.seeds.push({ link: p.link, source: 'search', note: `group ${g.id}`, added: g.computed.date, lastPublished: g.computed.date, group: g.id, size: 1, changePct: null, score: null });
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(f, null, 2) + '\n');
  process.exit(0);
}
const out = get('--out'), report = get('--report'), known = get('--known');
const ids = (get('--profile') ?? 'unconstrained').split(',');
const file = read(out) ?? { version: 5, area, groups: [] };
let text = existsSync(report) ? readFileSync(report, 'utf8') : `# Proposals report: ${area}\n\n`;
for (const id of ids) {
  const group = {
    id, title: id, note: '',
    computed: { date: '2026-11-15', networkHash: h16(`public/data/${area}.network.json`), demandHash: h16(`public/data/${area}.demand.json`), simulator: process.env.STUB_FINGERPRINT ?? 'f'.repeat(32), reportMethod: process.env.STUB_METHOD ?? 'm1', settings: { profile: id }, minutes: 60, seeds: [1, 2, 3], periods: ['pm_peak'] },
    baseline: {}, proposals: [{ id: `${id}-1`, kind: 'search', link: `#v1;a=${area};p=pm_peak;s=mn,${id}~mf,b`, cutThrough: { changePct: -10 } }],
  };
  const i = file.groups.findIndex((g) => g.id === id);
  if (i >= 0) file.groups[i] = group; else file.groups.push(group);
  const marker = `<!-- profile:${id} -->`;
  const sec = `${marker}\n## ${id}\n\nresult of ${id}\n`;
  text = text.includes(marker) ? text.replace(new RegExp(`${marker}[\\s\\S]*?(?=<!-- profile:|$)`), `${sec}\n`) : `${text.trimEnd()}\n\n${sec}`;
}
mkdirSync(dirname(out), { recursive: true });
file.version = 5;
writeFileSync(out, JSON.stringify(file));
writeFileSync(report, text);
const seeds = read(known) ?? { version: 1, area, cap: 20, seeds: [] };
writeFileSync(known, JSON.stringify(seeds));
