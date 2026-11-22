// Round 55 keep rule and improvement test (design D4, written before any run). Reads only the Markdown that tools/assess.ts wrote.
//   node keep-rule.cjs BASE_1-10.md CAND_1-10.md BASE_11-20.md CAND_11-20.md [validation.txt]   keep rule and improvement test; exit 0 only when both pass
//   node keep-rule.cjs --counts FILE [pm_fitted=79,pm_held=15,am_fitted=72,am_held=15]          print the four counts of one assessment; with an expectation, exit 1 when they differ
const fs = require('fs');
const P = ['am_peak', 'midday', 'pm_peak'];

// The project lead's lines of 2026-11-22: the baseline is the published model under the derived-targets scope, and the candidate must reach at least these counts on each seed set.
const LINES = {
  '1-10': { pm_fitted: [79, 89], pm_held: [15, 18], am_fitted: [72, 77], am_held: [15, 19] },
  '11-20': { pm_fitted: [80, 89], pm_held: [15, 18], am_fitted: [74, 77], am_held: [15, 19] },
};
const KEYS = [['pm_fitted', 'pm_peak', 'fitted', 'PM recent fitted'], ['pm_held', 'pm_peak', 'held', 'PM recent held out'], ['am_fitted', 'am_peak', 'fitted', 'AM recent fitted'], ['am_held', 'am_peak', 'held', 'AM recent held out']];

const parse = (file) => {
  const t = fs.readFileSync(file, 'utf8'), L = t.split('\n');
  const sec = {}; let cur = null;
  for (const l of L) { const m = l.match(/^## (\S+)/); if (m) cur = m[1]; if (cur) (sec[cur] ??= []).push(l); }
  const r = { seeds: (t.match(/; seeds ([\d, ]+)\./) ?? [])[1], inputs: (t.match(/Inputs \(SHA-256, first 12\): ([^\n]+)/) ?? [])[1], d16: {}, backlog: {}, d5: {}, station: {}, whole: [] };
  for (const p of P) {
    const s = (sec[p] ?? []).join('\n');
    const st = s.match(/\*\*Stability rule \(D16\): ([^.]+)\.\*\*([^\n]*)/);
    r.d16[p] = st ? st[1] : 'missing';
    const b = st && st[2].match(/backlog under 2% in (\d+) of (\d+) seeds \(mean ([\d.]+)%, max ([\d.]+)%\)/);
    r.backlog[p] = b ? { k: +b[1], n: +b[2], mean: +b[3], max: +b[4] } : null;
    const h = s.match(/Headline shares: mean absolute error ([\d.]+) points; (\d+) of (\d+) within 10 points/);
    r.d5[p] = h ? { mae: +h[1], k: +h[2], n: +h[3] } : null;
  }
  const v = L.findIndex((l) => l.startsWith('## Verdict'));
  for (const l of L.slice(v)) {
    const m = l.match(/^\| (am_peak|pm_peak) \| \w+ \| [^|]+ \| (\d+) of (\d+) [^|]*\| (\d+) of (\d+) [^|]*\|/);
    if (m) r.station[m[1]] = { fitted: [+m[2], +m[3]], held: [+m[4], +m[5]] };
    const w = l.match(/^\| (am_peak|pm_peak) \| ((?:Hillegass Avenue|Colby Street) [NS]B) \| ([\d.]+) \| ([\d.]+) \| ([\d.]+) \| ([\d.]+) \| (\w+) \| (\w+) \|/);
    if (w) r.whole.push({ p: w[1], street: w[2], modeled: +w[3], se: +w[4], observed: +w[5], geh: +w[6], ok: w[7] === 'yes' });
  }
  return r;
};
const count = (r, p, k) => r.station[p]?.[k];

if (process.argv[2] === '--counts') {
  const r = parse(process.argv[3]);
  const got = KEYS.map(([key, p, k]) => `${key}=${count(r, p, k)?.[0]}/${count(r, p, k)?.[1]}`).join(' ');
  console.log(got);
  const exp = process.argv[4];
  if (exp) {
    const want = Object.fromEntries(exp.split(',').map((x) => x.split('=')));
    const bad = KEYS.filter(([key, p, k]) => count(r, p, k)?.[0] !== +want[key]).map(([key]) => key);
    if (bad.length) { console.log(`DIFFERS from the expectation ${exp}: ${bad.join(', ')}`); process.exit(1); }
  }
  process.exit(0);
}

const [b1, c1, b2, c2, valFile] = process.argv.slice(2);
if (!c2) { console.error('usage: node keep-rule.cjs BASE_1-10.md CAND_1-10.md BASE_11-20.md CAND_11-20.md [validation.txt]'); process.exit(2); }
const sets = [['Baseline, seeds 1-10', b1], ['Candidate, seeds 1-10', c1], ['Baseline, seeds 11-20', b2], ['Candidate, seeds 11-20', c2]];
const R = sets.map(([name, f]) => ({ name, ...parse(f) }));
const out = []; const w = (s = '') => out.push(s);
w('# Round 55 keep rule and improvement test\n');
w('Rule (project lead brief of 2026-11-22, written before any run; the baseline is the published model under the derived-targets scope):\n');
w('- Seeds 1-10: PM fitted at least 79 of 89, PM held out at least 15 of 18, AM fitted at least 72 of 77, AM held out at least 15 of 19. Seeds 11-20: PM fitted at least 80 of 89, PM held out at least 15 of 18, AM fitted at least 74 of 77, AM held out at least 15 of 19.');
w('- D5 headline shares 4 of 4, whole-street traversals 8 of 8, D16 holds in every period, validation 67 of 74 and identical (the simulator is unchanged).');
w('- No judged line worse than the baseline on either seed set, each against the baseline on the same seeds.');
w('- Improvement test (stated before the run): at least one judged held-out line, PM held out or AM held out, is higher than the baseline on both seed sets. Otherwise the round is recorded as no improvement.\n');
for (const r of R) w(`- ${r.name}: seeds ${r.seeds}; ${r.inputs}`);
w();
const verdicts = [];
w(`| Line | ${R.map((r) => r.name).join(' | ')} | Floor 1-10 / 11-20 | 1-10 ok? | 11-20 ok? |`);
w(`| --- | ${R.map(() => '---').join(' | ')} | --- | --- | --- |`);
const row = (label, vals, floors) => {
  const ok1 = vals[1].v >= vals[0].v && (!floors || vals[1].v >= floors[0]), ok2 = vals[3].v >= vals[2].v && (!floors || vals[3].v >= floors[1]);
  verdicts.push([`${label}, seeds 1-10`, ok1], [`${label}, seeds 11-20`, ok2]);
  w(`| ${label} | ${vals.map((x) => x.s).join(' | ')} | ${floors ? `${floors[0]} / ${floors[1]}` : 'no worse'} | ${ok1 ? 'yes' : 'NO'} | ${ok2 ? 'yes' : 'NO'} |`);
};
for (const [key, p, k, lab] of KEYS) {
  const vals = R.map((r) => { const x = count(r, p, k); return { v: x ? x[0] : NaN, n: x?.[1], s: x ? `${x[0]} of ${x[1]}` : '-' }; });
  if (new Set(vals.map((x) => x.n)).size !== 1) w(`| (the station sets differ for ${lab}: ${vals.map((x) => x.n).join(', ')}; a count of a different size is not comparable, read it by hand) |`);
  row(lab, vals, [LINES['1-10'][key][0], LINES['11-20'][key][0]]);
}
row('D5 headline shares, PM (within 10 points)', R.map((r) => ({ v: r.d5.pm_peak?.k ?? NaN, s: r.d5.pm_peak ? `${r.d5.pm_peak.k} of ${r.d5.pm_peak.n} (MAE ${r.d5.pm_peak.mae})` : '-' })), [4, 4]);
row('Whole-street traversals (GEH < 5)', R.map((r) => ({ v: r.whole.filter((x) => x.ok).length, s: `${r.whole.filter((x) => x.ok).length} of ${r.whole.length}` })), [8, 8]);
for (const p of P) row(`D16, ${p}`, R.map((r) => ({ v: r.d16[p] === 'holds' ? 1 : 0, s: r.d16[p] })), [1, 1]);
let val = 'not given';
if (valFile && fs.existsSync(valFile)) { const t = fs.readFileSync(valFile, 'utf8'); val = /67 of 74 cases pass/.test(t) && /identical/.test(t) && !/DIFFERS/.test(t) ? 'ok' : 'CHANGED'; verdicts.push(['Validation suite', val === 'ok']); w(`| Validation suite | ${t.split('\n')[0]} | - | - | - | 67 of 74, identical | ${val === 'ok' ? 'yes' : 'NO'} | ${val === 'ok' ? 'yes' : 'NO'} |`); }
else { verdicts.push(['Validation suite (not given)', false]); w('| Validation suite | not given | - | - | - | 67 of 74, identical | NO | NO |'); }
w();
const bad = verdicts.filter(([, ok]) => !ok).map(([l]) => l);
w(`Keep rule: ${bad.length ? 'FAILS' : 'PASSES'} (${bad.join('; ') || 'no line worse than its baseline or below its floor on either seed set'}).`);
w();
w('## Improvement test\n');
w('| Held-out line | Baseline 1-10 | Candidate 1-10 | Baseline 11-20 | Candidate 11-20 | Higher on both sets? |');
w('| --- | --- | --- | --- | --- | --- |');
let improved = [];
for (const [, p, , lab] of KEYS.filter((x) => x[2] === 'held')) {
  const v = R.map((r) => count(r, p, 'held')?.[0] ?? NaN);
  const yes = v[1] > v[0] && v[3] > v[2];
  if (yes) improved.push(lab);
  w(`| ${lab} | ${v[0]} | ${v[1]} | ${v[2]} | ${v[3]} | ${yes ? 'yes' : 'no'} |`);
}
w();
w(`Improvement test: ${improved.length ? `PASSES (${improved.join('; ')})` : 'FAILS: the round is recorded as no improvement'}.`);
w();
w('The fitted counts and the whole-street line are fitted quantities in the shipped view: passing them shows the fit meets its own targets in the simulator. The training view never sees a held station, so the held-out counts remain the independent check.');
w();
w('## Watched lines (reported, not conditions)\n');
w(`| Line | ${R.map((r) => r.name).join(' | ')} |`);
w(`| --- | ${R.map(() => '---').join(' | ')} |`);
for (const [p, s] of [['pm_peak', 'Colby Street SB'], ['pm_peak', 'Colby Street NB'], ['pm_peak', 'Hillegass Avenue SB'], ['pm_peak', 'Hillegass Avenue NB'], ['am_peak', 'Colby Street NB']]) {
  w(`| ${p} ${s} whole street | ${R.map((r) => { const x = r.whole.find((q) => q.p === p && q.street === s); return x ? `${x.modeled} (se ${x.se}) vs ${x.observed}, GEH ${x.geh}` : '-'; }).join(' | ')} |`);
}
for (const p of P) w(`| ${p} backlog under 2% (seeds), mean, max | ${R.map((r) => { const b = r.backlog[p]; return b ? `${b.k} of ${b.n}, ${b.mean}%, ${b.max}%` : '-'; }).join(' | ')} |`);
w();
w(`Verdict: keep rule ${bad.length ? 'FAILS' : 'PASSES'}, improvement test ${improved.length ? 'PASSES' : 'FAILS'}. ${!bad.length && improved.length ? 'Both pass on both seed sets: the staged proposal search may run.' : 'The staged proposal search does not run.'}`);
fs.writeFileSync(process.env.KEEP_OUT ?? '/dev/stdout', out.join('\n') + '\n');
process.exit(bad.length || !improved.length ? 1 : 0);
