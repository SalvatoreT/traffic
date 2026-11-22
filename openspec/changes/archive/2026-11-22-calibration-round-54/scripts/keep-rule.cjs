// Round 54 keep rule (design D4, written before any run): the candidate is no worse than the baseline on every line, on seeds 1-10 and on seeds 11-20, each against the baseline
// on the same seeds. The baseline is the published model scored under the judged scope by the derived-targets laptop job; its figures are READ from that job's assessment files, not typed here.
// usage: node keep-rule.cjs BASE_1-10.md CAND_1-10.md BASE_11-20.md CAND_11-20.md [validation-diff.txt]
// Optional EXPECT="pm_fitted=79,pm_held=14,am_fitted=72,am_held=15" (PLACEHOLDER: the project lead fills it from the derived job's figures) checks the baseline files against the numbers
// the keep rule was written with, so that a wrong file shows.
const fs = require('fs');
const [b1, c1, b2, c2, valFile] = process.argv.slice(2);
if (!c2) { console.error('usage: node keep-rule.cjs BASE_1-10.md CAND_1-10.md BASE_11-20.md CAND_11-20.md [validation-diff.txt]'); process.exit(2); }
const sets = [['Baseline, seeds 1-10', b1], ['Candidate, seeds 1-10', c1], ['Baseline, seeds 11-20', b2], ['Candidate, seeds 11-20', c2]];
const P = ['am_peak', 'midday', 'pm_peak'];
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
const R = sets.map(([name, f]) => ({ name, ...parse(f) }));
const out = []; const w = (s = '') => out.push(s);
w('# Round 54 keep rule\n');
w('Rule (project lead brief 2026-11-22, written before any run): the candidate is no worse than the baseline, on seeds 1-10 and on seeds 11-20, on every line below; the baseline is the published model under the judged scope, from the derived-targets job. One line worse fails the candidate. The rule is not loosened after a result.\n');
for (const r of R) w(`- ${r.name}: seeds ${r.seeds}; ${r.inputs}`);
w();
const exp = Object.fromEntries((process.env.EXPECT ?? '').split(',').filter(Boolean).map((x) => x.split('=')));
const get = (r, p, k) => r.station[p]?.[k];
const checks = [];
if (Object.keys(exp).length) {
  for (const [key, p, k] of [['pm_fitted', 'pm_peak', 'fitted'], ['pm_held', 'pm_peak', 'held'], ['am_fitted', 'am_peak', 'fitted'], ['am_held', 'am_peak', 'held']]) {
    const x = get(R[0], p, k);
    if (exp[key] !== undefined) checks.push(`${key}: baseline seeds 1-10 reads ${x ? x[0] : '-'}, expected ${exp[key]}: ${x && x[0] === +exp[key] ? 'as expected' : 'DIFFERS (check the baseline file; the expectation is the project lead\'s PLACEHOLDER)'}`);
  }
  for (const c of checks) w(`- ${c}`);
  w();
}
w(`| Line | ${R.map((r) => r.name).join(' | ')} | 1-10 no worse? | 11-20 no worse? |`);
w(`| --- | ${R.map(() => '---').join(' | ')} | --- | --- |`);
const verdicts = [];
const row = (label, vals) => {
  const ok1 = vals[1].v >= vals[0].v, ok2 = vals[3].v >= vals[2].v;
  verdicts.push([label + ', seeds 1-10', ok1], [label + ', seeds 11-20', ok2]);
  w(`| ${label} | ${vals.map((x) => x.s).join(' | ')} | ${ok1 ? 'yes' : 'NO'} | ${ok2 ? 'yes' : 'NO'} |`);
};
for (const [p, k, lab] of [['pm_peak', 'fitted', 'PM recent fitted'], ['pm_peak', 'held', 'PM recent held out'], ['am_peak', 'fitted', 'AM recent fitted'], ['am_peak', 'held', 'AM recent held out']]) {
  const vals = R.map((r) => { const x = r.station[p]?.[k]; return { v: x ? x[0] : NaN, n: x?.[1], s: x ? `${x[0]} of ${x[1]}` : '-' }; });
  if (new Set(vals.map((x) => x.n)).size !== 1) w(`| (the station sets differ for ${lab}: ${vals.map((x) => x.n).join(', ')}; a count of a different size is not comparable, read it by hand) |`);
  row(lab, vals);
}
row('D5 headline shares, PM (within 10 points)', R.map((r) => ({ v: r.d5.pm_peak?.k ?? NaN, s: r.d5.pm_peak ? `${r.d5.pm_peak.k} of ${r.d5.pm_peak.n} (MAE ${r.d5.pm_peak.mae})` : '-' })));
row('Whole-street traversals (GEH < 5)', R.map((r) => ({ v: r.whole.filter((x) => x.ok).length, s: `${r.whole.filter((x) => x.ok).length} of ${r.whole.length}` })));
for (const p of P) row(`D16, ${p}`, R.map((r) => ({ v: r.d16[p] === 'holds' ? 1 : 0, s: r.d16[p] })));
let val = 'not given';
if (valFile && fs.existsSync(valFile)) { const t = fs.readFileSync(valFile, 'utf8'); val = /No pass lost\./.test(t) ? 'no pass lost' : 'PASS LOST'; verdicts.push(['Validation suite', val === 'no pass lost']); w(`| Validation suite | ${t.split('\n')[0]} | | | | no pass lost? ${val === 'no pass lost' ? 'yes' : 'NO'} |`); }
else { verdicts.push(['Validation suite (not given)', false]); w('| Validation suite | not given | | | | NO |'); }
w();
const bad = verdicts.filter(([, ok]) => !ok).map(([l]) => l);
w(`Keep rule: ${bad.length ? 'FAILS' : 'PASSES'} (${bad.join('; ') || 'no line worse on either seed set'}).`);
w();
w('The whole-street line and the fitted counts are fitted quantities in the shipped view: passing them shows the fit meets its own targets in the simulator. The training view never sees a held station, so the held-out counts remain the independent check.');
w('The held-out baselines come from a cross-validation demand fitted on the router that charged twice; the candidate\'s is fitted on the router that charges once.');
w();
w('## Watched lines (reported, not conditions)\n');
w(`| Line | ${R.map((r) => r.name).join(' | ')} |`);
w(`| --- | ${R.map(() => '---').join(' | ')} |`);
for (const [p, s] of [['pm_peak', 'Colby Street SB'], ['pm_peak', 'Colby Street NB'], ['pm_peak', 'Hillegass Avenue SB'], ['pm_peak', 'Hillegass Avenue NB'], ['am_peak', 'Colby Street NB']]) {
  w(`| ${p} ${s} whole street | ${R.map((r) => { const x = r.whole.find((q) => q.p === p && q.street === s); return x ? `${x.modeled} (se ${x.se}) vs ${x.observed}, GEH ${x.geh}` : '-'; }).join(' | ')} |`);
}
for (const p of P) w(`| ${p} backlog under 2% (seeds), mean, max | ${R.map((r) => { const b = r.backlog[p]; return b ? `${b.k} of ${b.n}, ${b.mean}%, ${b.max}%` : '-'; }).join(' | ')} |`);
w();
w('The five diagonal stations, Colby St NB blocks, arterial travel times and through cars an hour are read from the per-seed reports with `tools/diag/control-charge-score.ts` (runbook, step F).');
fs.writeFileSync(process.env.KEEP_OUT ?? '/dev/stdout', out.join('\n') + '\n');
process.exit(bad.length ? 1 : 0);
