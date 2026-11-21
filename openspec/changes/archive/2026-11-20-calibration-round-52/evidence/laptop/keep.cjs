// Round 52 keep rule (design D4) on the ten-seed assessment: reads the assessment report and the validate log; prints a table and PASS or FAIL.
const fs = require('fs');
const [md, vlog] = process.argv.slice(2);
const t = fs.readFileSync(md, 'utf8'), L = t.split('\n');
const sec = {}; let cur = null;
for (const l of L) { const m = l.match(/^## (\S+)/); if (m) cur = m[1]; if (cur) (sec[cur] ??= []).push(l); }
const d16 = {}, st = {}; let d5 = null; const whole = [];
for (const p of ['am_peak', 'midday', 'pm_peak']) { const s = (sec[p] ?? []).join('\n'); const m = s.match(/\*\*Stability rule \(D16\): ([^.]+)\.\*\*/); d16[p] = m ? m[1] : 'missing'; if (p === 'pm_peak') { const h = s.match(/Headline shares: mean absolute error ([\d.]+) points; (\d+) of (\d+) within 10 points/); d5 = h ? { mae: +h[1], k: +h[2], n: +h[3] } : null; } }
const v = L.findIndex((l) => l.startsWith('## Verdict'));
for (const l of L.slice(v)) {
  const m = l.match(/^\| (am_peak|pm_peak) \| \w+ \| [^|]+ \| (\d+) of (\d+) [^|]*\| (\d+) of (\d+) [^|]*\|/);
  if (m) st[m[1]] = { fitted: [+m[2], +m[3]], held: [+m[4], +m[5]] };
  const w = l.match(/^\| (am_peak|pm_peak) \| ((?:Hillegass Avenue|Colby Street) [NS]B) \| ([\d.]+) \| ([\d.]+) \| ([\d.]+) \| ([\d.]+) \| (\w+) \| (\w+) \|/);
  if (w) whole.push({ p: w[1], street: w[2], modeled: +w[3], observed: +w[5], geh: +w[6], ok: w[7] === 'yes' });
}
const val = (fs.readFileSync(vlog, 'utf8').match(/(\d+) of (\d+) cases pass/) ?? []).slice(1).map(Number);
const rows = [
  ['PM fitted recent stations, GEH < 5', 'at least 74 of 92', st.pm_peak ? `${st.pm_peak.fitted[0]} of ${st.pm_peak.fitted[1]}` : '-', st.pm_peak && st.pm_peak.fitted[0] >= 74],
  ['PM held out', 'at least 14 of 24', st.pm_peak ? `${st.pm_peak.held[0]} of ${st.pm_peak.held[1]}` : '-', st.pm_peak && st.pm_peak.held[0] >= 14],
  ['AM fitted', 'at least 70 of 77', st.am_peak ? `${st.am_peak.fitted[0]} of ${st.am_peak.fitted[1]}` : '-', st.am_peak && st.am_peak.fitted[0] >= 70],
  ['AM held out', 'at least 14 of 19', st.am_peak ? `${st.am_peak.held[0]} of ${st.am_peak.held[1]}` : '-', st.am_peak && st.am_peak.held[0] >= 14],
  ['D5 headline shares within 10 points', '4 of 4', d5 ? `${d5.k} of ${d5.n} (mean error ${d5.mae})` : '-', d5 && d5.k === 4 && d5.n === 4],
  ['Whole-street traversals, GEH < 5', '8 of 8', `${whole.filter((x) => x.ok).length} of ${whole.length}`, whole.length === 8 && whole.every((x) => x.ok)],
  ['D16 stability in every period', 'holds', Object.entries(d16).map(([p, x]) => `${p} ${x}`).join(', '), Object.values(d16).every((x) => x === 'holds')],
  ['Validation suite', '67 of 74', val.length ? `${val[0]} of ${val[1]}` : '-', val[0] >= 67],
];
console.log('| Criterion | Line to meet | Candidate | Pass |\n| --- | --- | --- | --- |');
for (const [a, b, c, ok] of rows) console.log(`| ${a} | ${b} | ${c} | ${ok ? 'yes' : 'NO'} |`);
console.log(`\nWhole-street rows: ${whole.map((x) => `${x.p} ${x.street} ${x.modeled} vs ${x.observed} GEH ${x.geh}`).join('; ')}`);
console.log(rows.every((r) => r[3]) ? 'KEEP PASS' : `KEEP FAIL: ${rows.filter((r) => !r[3]).map((r) => r[0]).join('; ')}`);
