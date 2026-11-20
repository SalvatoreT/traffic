// Round 52 fresh-seed confirmation: keep-rule lines for the baseline and the candidate on seeds 1-10 and 11-20, read from the four assessment reports.
// Rule (lead, 2026-11-20, written before the run): on seeds 11-20 the candidate is no worse than the baseline on every line, computed on the same seeds.
const fs = require('fs');
const sets = [
  ['Baseline, seeds 1-10', 'openspec/changes/archive/2026-11-19-calibration-round-47/evidence/rockridge.assessment-r47-base.md'],
  ['Candidate, seeds 1-10', 'openspec/changes/calibration-round-52/evidence/rockridge.assessment-r52.md'],
  ['Baseline, seeds 11-20', 'target/r52-confirm/rockridge.assessment-r52-confirm-base.md'],
  ['Candidate, seeds 11-20', 'target/r52-confirm/rockridge.assessment-r52-confirm.md'],
];
const P = ['am_peak', 'midday', 'pm_peak'];
const parse = (file) => {
  const t = fs.readFileSync(file, 'utf8'), L = t.split('\n');
  const sec = {}; let cur = null;
  for (const l of L) { const m = l.match(/^## (\S+)/); if (m) cur = m[1]; if (cur) (sec[cur] ??= []).push(l); }
  const r = { seeds: (t.match(/; seeds ([\d, ]+)\./) ?? [])[1], inputs: (t.match(/Inputs \(SHA-256, first 12\): ([^\n]+)/) ?? [])[1], d16: {}, backlog: {}, gridlock: {}, d5: {}, hill: {}, station: {}, whole: [] };
  for (const p of P) {
    const s = (sec[p] ?? []).join('\n');
    const st = s.match(/\*\*Stability rule \(D16\): ([^.]+)\.\*\*([^\n]*)/);
    r.d16[p] = st ? st[1] : 'missing';
    const b = st && st[2].match(/backlog under 2% in (\d+) of (\d+) seeds \(mean ([\d.]+)%, max ([\d.]+)%\)/);
    r.backlog[p] = b ? { k: +b[1], n: +b[2], mean: +b[3], max: +b[4] } : null;
    const g = st && st[2].match(/included\) ([\d.]+) per hour \(min ([\d.]+), max ([\d.]+)/);
    r.gridlock[p] = g ? { mean: +g[1], max: +g[3] } : null;
    const h = s.match(/Headline shares: mean absolute error ([\d.]+) points; (\d+) of (\d+) within 10 points/);
    r.d5[p] = h ? { mae: +h[1], k: +h[2], n: +h[3] } : null;
    const hs = s.match(/\| \*\*Hillegass Avenue SB to freeway\*\* \| ([\d.]+) \| ([\d.]+) \| ([\d.]+) to ([\d.]+) \| (-?[\d.]+) \| (\w+) \|/);
    r.hill[p] = hs ? { target: +hs[1], sim: +hs[2], lo: +hs[3], hi: +hs[4], diff: +hs[5], ok: hs[6] } : null;
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
const lines = { pm_fitted: 74, pm_held: 14, am_fitted: 70, am_held: 14 };
w('# Round 52 fresh-seed confirmation (seeds 11-20)\n');
w('Rule (lead, 2026-11-20, before any run): on seeds 11-20 the candidate is no worse than the baseline on every keep-rule line computed on the same seeds. A confirmation on independent seeds, not a replacement for the keep rule.\n');
for (const r of R) w(`- ${r.name}: seeds ${r.seeds}; ${r.inputs}`);
w();
w(`| Line | Keep-rule line | ${R.map((r) => r.name).join(' | ')} | Seeds 11-20: candidate no worse? |`);
w(`| --- | --- | ${R.map(() => '---').join(' | ')} | --- |`);
const verdicts = [];
const row = (label, line, vals, better) => { const b = vals[2], c = vals[3]; const ok = better(c.v, b.v); verdicts.push([label, ok]); w(`| ${label} | ${line} | ${vals.map((x) => x.s).join(' | ')} | ${ok ? 'yes' : 'NO'} |`); };
for (const [p, k, key, lab] of [['pm_peak', 'fitted', 'pm_fitted', 'PM fitted'], ['pm_peak', 'held', 'pm_held', 'PM held out'], ['am_peak', 'fitted', 'am_fitted', 'AM fitted'], ['am_peak', 'held', 'am_held', 'AM held out']]) {
  const vals = R.map((r) => { const x = r.station[p]?.[k]; return { v: x ? x[0] : NaN, n: x?.[1], s: x ? `${x[0]} of ${x[1]}` : '-' }; });
  if (new Set(vals.map((x) => x.n)).size !== 1) w(`| (station sets differ for ${lab}: ${vals.map((x) => x.n).join(', ')}) |`);
  row(lab, `${lines[key]}`, vals, (c, b) => c >= b);
}
row('D5 headline shares, PM (within 10 points)', '4 of 4', R.map((r) => ({ v: r.d5.pm_peak?.k ?? NaN, s: r.d5.pm_peak ? `${r.d5.pm_peak.k} of ${r.d5.pm_peak.n} (MAE ${r.d5.pm_peak.mae})` : '-' })), (c, b) => c >= b);
row('Whole-street traversals (GEH < 5)', '8 of 8', R.map((r) => ({ v: r.whole.filter((x) => x.ok).length, s: `${r.whole.filter((x) => x.ok).length} of ${r.whole.length}` })), (c, b) => c >= b);
for (const p of P) row(`D16, ${p}`, 'holds', R.map((r) => ({ v: r.d16[p] === 'holds' ? 1 : 0, s: r.d16[p] })), (c, b) => c >= b);
w();
const all = verdicts.every(([, ok]) => ok);
const d16All = P.every((p) => R[3].d16[p] === 'holds');
w(`Confirmation: ${all ? 'HOLDS' : 'DOES NOT HOLD'} (${verdicts.filter(([, ok]) => !ok).map(([l]) => l).join('; ') || 'no line worse'}). Candidate D16 on seeds 11-20 in every period: ${d16All ? 'holds' : 'NO'}.\n`);
w('## Watched lines\n');
w(`| Line | ${R.map((r) => r.name).join(' | ')} |`);
w(`| --- | ${R.map(() => '---').join(' | ')} |`);
const ws = (p, s) => R.map((r) => { const x = r.whole.find((q) => q.p === p && q.street === s); return x ? `${x.modeled} (se ${x.se}) vs ${x.observed}, GEH ${x.geh}` : '-'; });
w(`| PM Colby Street SB whole street | ${ws('pm_peak', 'Colby Street SB').join(' | ')} |`);
for (const p of ['pm_peak', 'am_peak']) w(`| ${p} Hillegass Ave SB to freeway, share % (target) | ${R.map((r) => { const h = r.hill[p]; return h ? `${h.sim} [${h.lo} to ${h.hi}] vs ${h.target}, ${h.diff > 0 ? '+' : ''}${h.diff} points` : '-'; }).join(' | ')} |`);
for (const p of ['pm_peak', 'am_peak', 'midday']) w(`| ${p} backlog under 2% (seeds), mean, max | ${R.map((r) => { const b = r.backlog[p]; return b ? `${b.k} of ${b.n}, ${b.mean}%, ${b.max}%` : '-'; }).join(' | ')} |`);
for (const p of ['pm_peak', 'am_peak', 'midday']) w(`| ${p} gridlock clearances near the area per hour, mean (max) | ${R.map((r) => { const g = r.gridlock[p]; return g ? `${g.mean} (${g.max})` : '-'; }).join(' | ')} |`);
w();
w('## Whole-street traversals\n');
w(`| Period | Street | ${R.map((r) => r.name).join(' | ')} |`);
w(`| --- | --- | ${R.map(() => '---').join(' | ')} |`);
for (const x of R[0].whole) w(`| ${x.p} | ${x.street} (observed ${x.observed}) | ${ws(x.p, x.street).map((s) => s.replace(/ vs \d+/, '')).join(' | ')} |`);
fs.writeFileSync('target/r52-confirm/confirm.md', out.join('\n') + '\n');
console.log(out.join('\n'));
