// Round 52 (design D5): the four whole-street route stations and the Colby Street and Hillegass Avenue block stations, target against the ten-seed simulated mean
// and, for fit reports, against the fit's own "after fit" and "final" values. Read-only; prints Markdown.
// usage: node route-lines.cjs <period> [sim=<label>=<dir> ...] [fit=<label>=<station-report.md> ...]
//   dir holds rockridge-<period>-s1-seed<N>.json for N = 1 to 10 (per-seed calibrate reports); a station report is data/demand/rockridge.fit.stations-<period>.md of a build
const fs = require('fs');
const [p, ...args] = process.argv.slice(2);
if (!p) { console.error('usage: node route-lines.cjs <period> [sim=label=dir ...] [fit=label=file ...]'); process.exit(2); }
const part = (kind) => args.filter((a) => a.startsWith(kind + '=')).map((a) => { const r = a.slice(kind.length + 1), i = r.indexOf('='); return [r.slice(0, i), r.slice(i + 1)]; });
const sims = part('sim'), fits = part('fit');
const st = JSON.parse(fs.readFileSync('data/demand/rockridge.stations.json', 'utf8')).stations;
const streets = /^(Colby Street|Hillegass Avenue) /;
const routes = st.filter((s) => s.id.startsWith('count route ') && s.target[p] > 0);
const blocks = st.filter((s) => s.id.startsWith('count block ') && streets.test(s.label) && s.target[p] > 0);
const geh = (m, c) => (m + c > 0 ? Math.sqrt((2 * (m - c) ** 2) / (m + c)) : 0);
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length, se = (a) => Math.sqrt(a.reduce((x, y) => x + (y - mean(a)) ** 2, 0) / (a.length - 1) / a.length);
const f1 = (x) => x.toFixed(1);
const J = (dir, s) => JSON.parse(fs.readFileSync(`${dir}/rockridge-${p}-s1-seed${s}.json`, 'utf8'));
const runs = sims.map(([label, dir]) => [label, Array.from({ length: 10 }, (_, i) => J(dir, i + 1))]);
const nameOf = (s) => s.label.split(', whole')[0];
if (runs.length) {
  console.log(`## Whole-street route stations, ${p} (ten-seed simulated mean, standard error)\n\n| Station | Observed | ${runs.map(([l]) => l).join(' | ')} |\n| --- | --- | ${runs.map(() => '---').join(' | ')} |`);
  for (const s of routes) console.log(`| ${nameOf(s)} (${s.id}) | ${s.target[p]} | ${runs.map(([, rs]) => { const v = rs.map((r) => r.throughCheck.find((x) => x.block === nameOf(s)).modeledWholeStreet); return `${f1(mean(v))} (se ${f1(se(v))}), GEH ${f1(geh(mean(v), s.target[p]))}`; }).join(' | ')} |`);
  console.log(`\n## Block stations of Colby Street and Hillegass Avenue, ${p} (ten-seed simulated mean)\n\n| Station | Observed | ${runs.map(([l]) => l).join(' | ')} |\n| --- | --- | ${runs.map(() => '---').join(' | ')} |`);
  for (const s of blocks) console.log(`| ${s.label}${s.held ? ' (held out)' : ''} | ${s.target[p]} | ${runs.map(([, rs]) => { const m = mean(rs.map((r) => r.linkFlowVehPerHour[s.links[0]])); return `${f1(m)}, GEH ${f1(geh(m, s.target[p]))}`; }).join(' | ')} |`);
  console.log('\n## Southbound blocks within GEH 5 (ten-seed means)\n\n| Street | Set | Within GEH 5 | Of |\n| --- | --- | --- | --- |');
  for (const street of ['Colby Street', 'Hillegass Avenue']) for (const [l, rs] of runs) {
    const sb = blocks.filter((s) => s.label.startsWith(street) && /, SB \(link/.test(s.label));
    console.log(`| ${street} SB | ${l} | ${sb.filter((s) => geh(mean(rs.map((r) => r.linkFlowVehPerHour[s.links[0]])), s.target[p]) < 5).length} | ${sb.length} |`);
  }
}
if (fits.length) {
  console.log(`\n## The fit's own values, ${p} (target, after the count-only fit, final)\n\n| Station | ${fits.map(([l]) => l).join(' | ')} |\n| --- | ${fits.map(() => '---').join(' | ')} |`);
  const rows = fits.map(([, f]) => new Map(fs.readFileSync(f, 'utf8').split('\n').flatMap((l) => { const c = l.split('|').map((x) => x.trim()); return c.length > 9 && streets.test(c[1]) && /, [NS]B \(link|whole street between/.test(c[1]) ? [[c[1], `${c[3]} / ${c[6]} / ${c[8]}`]] : []; })));
  const labels = [...new Set(rows.flatMap((m) => [...m.keys()]))];
  for (const l of labels) console.log(`| ${l} | ${rows.map((m) => m.get(l) ?? '-').join(' | ')} |`);
}
