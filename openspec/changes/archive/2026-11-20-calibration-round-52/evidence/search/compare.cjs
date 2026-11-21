// Round 52 staged search: option tables and comparison with the published search-c5 set and the round 51 staged set
// (matched by the exact intervention tokens in each link).
const fs = require('fs');
const load = (f) => JSON.parse(fs.readFileSync(f, 'utf8')).groups[0];
const SETS = [
  ['round 52', load('target/r52-search/proposals.json')],
  ['round 51', load('target/r51-search/proposals.json')],
  ['search-c5', load('target/batches/search-c5/proposals.json')],
];
const [N] = SETS.map((s) => s[1]);
const P = ['pm_peak', 'am_peak', 'midday'];
const toks = (p) => new Set(p.link.split(';s=')[1].split('~'));
const key = (p) => [...toks(p)].sort().join('~');
const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1), iv = (e) => `[${f1(e.interval[0])}, ${f1(e.interval[1])}]`;
const spread = (p, per) => { const b = p.evidence.baselineVehPerHour[per], s = p.evidence.scenarioVehPerHour[per]; const d = b.map((x, i) => s[i] - x); return `${Math.min(...d)}..${Math.max(...d)}`; };
const goals = (p) => (p.objectives ?? []).join(', ') || (p.kind === 'reference' ? 'reference' : '(none)');
const st = (s) => s.replace(/ Street/g, ' St').replace(/ Avenue/g, ' Ave');
const short = (l) => st(l.replace(/, connecting .*$/, '').replace(/^Modal filter/, 'MF').replace(/^Diagonal diverter/, 'DD').replace(/^One-way/, 'OW').replace(/^Slow Street/, 'SS').replace(/^Traffic circle/, 'TC'));
const base = (g) => { const b = g.baseline.cutThroughVehPerHour; return `${P.map((k) => `${k} ${b[k]}`).join(', ')}; mean ${f1(P.reduce((a, k) => a + b[k], 0) / 3)}`; };
const out = [];
const w = (s = '') => out.push(s);
w('# Round 52 staged proposal search: options and comparison with search-c5 and the round 51 staged set\n');
w('Baseline through cars per hour (confirmation seeds 101-110):\n');
for (const [lab, g] of SETS) w(`- ${lab}: ${base(g)}`);
w();
const table = (g, label) => {
  w(`## ${label}\n`);
  w('| Option | Goal | Changes | Overall veh/h (baseline -> scenario) | Overall change veh/h, 95% CI, sd | PM change [CI] (per-seed range) | AM change [CI] (per-seed range) | Midday change [CI] (per-seed range) | Largest through rise (block, veh/h) | Resident detour s/trip |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const p of g.proposals) {
    const c = p.cutThrough, per = P.map((k) => { const e = p.byPeriod[k].cutThrough.effect; return `${f1(e.mean)} ${iv(e)} (${spread(p, k)}), ${p.byPeriod[k].cutThrough.changePct}%`; });
    const h = p.harm.through.largestIncrease;
    w(`| ${p.id} | ${goals(p)} | ${p.interventions.map((i) => short(i.label)).join('; ')} | ${c.baselineVehPerHour} -> ${c.scenarioVehPerHour} (${c.changePct}%) | ${f1(c.effect.mean)} ${iv(c.effect)}, sd ${c.effect.sd} | ${per.join(' | ')} | ${h ? `${st(h.block)}: +${h.increaseVehPerHour}` : '-'} | ${p.residentsDetour.secondsPerTrip} |`);
  }
  w();
  w(`Displacement rule: dropped ${g.computed.displacement.dropped.length} option(s)${g.computed.displacement.dropped.length ? ': ' + JSON.stringify(g.computed.displacement.dropped) : ''}.`);
  w(`Option comparisons (each option against the next): ${g.optionComparisons.map((c) => `${c.option} vs ${c.against} +${f1(c.extraCutVehPerHour.mean)} ${iv(c.extraCutVehPerHour)} ${c.extraCutVehPerHour.status}`).join('; ')}.\n`);
};
for (const [lab, g] of SETS) table(g, lab === 'round 52' ? 'Round 52 candidate (this search)' : lab === 'round 51' ? 'Round 51 staged set' : 'Published search-c5');
w('## Largest all-car rise on one block, by period (displacement view)\n');
w('| Set | Option | PM | AM | Midday | Through-car blocks with a resolved rise |\n| --- | --- | --- | --- | --- | --- |');
for (const [lab, g] of SETS) for (const p of g.proposals) w(`| ${lab} | ${p.id} | ${P.map((k) => { const a = p.byPeriod[k].allTraffic.largestIncrease; return `+${a.increaseVehPerHour} ${st(a.block)} (${p.byPeriod[k].allTraffic.blocksAboveBand} above band)`; }).join(' | ')} | ${p.harm.through.blocksResolvedIncrease} |`);
w();
w('## By goal\n');
w(`| Goal | ${SETS.map((s) => s[0]).join(' | ')} | Same changes as round 52? |\n| --- | ${SETS.map(() => '---').join(' | ')} | --- |`);
for (const gid of ['most-removed', 'no-closures', 'least-detour', 'fewest-changes']) {
  const ps = SETS.map(([, g]) => g.proposals.find((p) => (p.objectives ?? []).includes(gid)));
  w(`| ${gid} | ${ps.map((a) => (a ? `${a.id}: ${f1(a.cutThrough.effect.mean)} veh/h, ${a.residentsDetour.secondsPerTrip} s/trip` : '-')).join(' | ')} | ${SETS.slice(1).map(([lab], i) => `${lab} ${ps[0] && ps[i + 1] && key(ps[0]) === key(ps[i + 1]) ? 'yes' : 'no'}`).join(', ')} |`);
}
w();
w('## Where each option went (exact intervention sets)\n');
const where = (G, link) => { const K = key({ link }); const r = []; for (const p of G.proposals) { if (key(p) === K) r.push(`option ${p.id}`); for (const v of p.variants ?? []) if (key(v) === K) r.push(`variant of ${p.id} (${v.why})`); } for (const f of G.computed.similarity.folded) if (key({ link: f.from }) === K) r.push(`folded (${f.why})`); return [...new Set(r)].join('; ') || 'not published (see the finalist table in report.md)'; };
w('| Round 52 option | Goal | Source | In the round 51 set | In the search-c5 set |\n| --- | --- | --- | --- | --- |');
for (const p of N.proposals) w(`| ${p.id} | ${goals(p)} | ${p.origin.kind}${p.origin.added ? ' ' + p.origin.added : ''} | ${where(SETS[1][1], p.link)} | ${where(SETS[2][1], p.link)} |`);
w();
for (const [lab, g] of SETS.slice(1)) {
  w(`| ${lab} option | Goal | In the round 52 set |\n| --- | --- | --- |`);
  for (const q of g.proposals) w(`| ${q.id} | ${goals(q)} | ${where(N, q.link)} |`);
  w();
}
const REPORTS = { 'round 52': 'target/r52-search/report.md', 'round 51': 'target/r51-search/report.md', 'search-c5': 'target/batches/search-c5/report.md' };
const norm = (s) => s.trim().toLowerCase();
const finalists = (lab) => {
  const L = fs.readFileSync(REPORTS[lab], 'utf8').split('\n');
  const i = L.findIndex((l) => l.startsWith('### Finalists'));
  const rows = [];
  for (let j = i + 1; j < L.length && !L[j].startsWith('### '); j++) {
    const c = L[j].split(' | ');
    if (!/^\| \d+$/.test(c[0])) continue;
    rows.push({ n: c[0].slice(2), set: c[1].split('; ').map(norm).sort().join('|'), source: c[2], change: c[3], pen: c[8], detour: c[9], outcome: c[10].replace(/ \|$/, '') });
  }
  return rows;
};
const FIN = Object.fromEntries(Object.keys(REPORTS).map((k) => [k, finalists(k)]));
const lset = (p) => p.interventions.map((i) => norm(i.label)).sort().join('|');
const fin = (lab, p) => { const r = FIN[lab].find((r) => r.set === lset(p)); return r ? `finalist ${r.n} (${r.source}, ${r.change}, detour ${r.detour}): ${r.outcome.trim() || 'eligible, not chosen (the report gives no reason)'}` : 'not among the finalists'; };
w('## Options not published in the other set: their finalist rows\n');
w('Matched by the exact set of intervention labels in each report\'s finalist table (3 discovery seeds, 60 min).\n');
w('| Option | Goal | Finalist table | Row |\n| --- | --- | --- | --- |');
for (const p of N.proposals) for (const [lab, g] of SETS.slice(1)) if (!g.proposals.some((q) => key(q) === key(p))) w(`| round 52 ${p.id} | ${goals(p)} | ${lab} | ${fin(lab, p)} |`);
for (const [lab, g] of SETS.slice(1)) for (const q of g.proposals) if (!N.proposals.some((p) => key(p) === key(q))) w(`| ${lab} ${q.id} | ${goals(q)} | round 52 | ${fin('round 52', q)} |`);
w();
w('## Most-removed goal: ranking score of options 1 and 2\n');
w('The search ranks on through-car reduction (percent, 3 discovery seeds) minus 0.1 point per car an hour of the ranking penalty (largest all-traffic rise on one block past its band, worst period).\n');
w('| Set | Finalist | Option | Reduction | Penalty block (cars an hour) | Score | Outcome |\n| --- | --- | --- | --- | --- | --- | --- |');
for (const lab of Object.keys(REPORTS)) for (const r of FIN[lab].filter((r) => /option [12]:/.test(r.outcome))) { const red = -parseFloat(r.change), pen = parseFloat(r.pen.match(/\(\+([\d.]+)\)\s*$/)[1]); w(`| ${lab} | ${r.n} | ${r.outcome.match(/option \d/)[0]} | ${f1(red)} | ${st(r.pen)} | ${f1(red - 0.1 * pen)} | ${r.outcome.replace(/^chosen as option \d: /, '')} |`); }
w();
w('Tokens: mn modal filter, dd diagonal diverter, ow one-way, ss Slow Street, ct traffic circle, tb turn ban; geohash, then heading(s).');
fs.writeFileSync('target/r52-search/compare.md', out.join('\n') + '\n');
console.log(out.join('\n'));
