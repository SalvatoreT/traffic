// Round 51 staged search: option table and comparison with the published search-c5 set (matched by intervention tokens in the link).
const fs = require('fs');
const load = (f) => JSON.parse(fs.readFileSync(f, 'utf8')).groups[0];
const N = load('target/r51-search/proposals.json'), O = load('target/batches/search-c5/proposals.json');
const P = ['pm_peak', 'am_peak', 'midday'];
const toks = (p) => new Set(p.link.split(';s=')[1].split('~'));
const key = (p) => [...toks(p)].sort().join('~');
const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1), iv = (e) => `[${f1(e.interval[0])}, ${f1(e.interval[1])}]`;
const spread = (p, per) => { const b = p.evidence.baselineVehPerHour[per], s = p.evidence.scenarioVehPerHour[per]; const d = b.map((x, i) => s[i] - x); return `${Math.min(...d)}..${Math.max(...d)}`; };
const goals = (p) => (p.objectives ?? []).join(', ') || (p.kind === 'reference' ? 'reference' : '(none)');
const short = (l) => l.replace(/, connecting .*$/, '').replace(/^Modal filter/, 'MF').replace(/^Diagonal diverter/, 'DD').replace(/^One-way/, 'OW').replace(/^Slow Street/, 'SS').replace(/^Traffic circle/, 'TC').replace(/ Street/g, ' St').replace(/ Avenue/g, ' Ave');
const base = (g) => { const b = g.baseline.cutThroughVehPerHour; return `${P.map((k) => `${k} ${b[k]}`).join(', ')}; mean ${f1(P.reduce((a, k) => a + b[k], 0) / 3)}`; };
const out = [];
const w = (s = '') => out.push(s);
w('# Round 51 staged proposal search: options and comparison with search-c5\n');
w(`Baseline through cars per hour (confirmation seeds 101-110): round 51 candidate ${base(N)}; published search-c5 ${base(O)}.\n`);
const table = (g, label) => {
  w(`## ${label}\n`);
  w('| Option | Goal | Changes | Overall veh/h (baseline -> scenario) | Overall change veh/h, 95% CI, sd | PM change [CI] (per-seed range) | AM change [CI] (per-seed range) | Midday change [CI] (per-seed range) | Largest through rise (block, veh/h) | Resident detour s/trip |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const p of g.proposals) {
    const c = p.cutThrough, per = P.map((k) => { const e = p.byPeriod[k].cutThrough.effect; return `${f1(e.mean)} ${iv(e)} (${spread(p, k)}), ${p.byPeriod[k].cutThrough.changePct}%`; });
    const h = p.harm.through.largestIncrease;
    w(`| ${p.id} | ${goals(p)} | ${p.interventions.map((i) => short(i.label)).join('; ')} | ${c.baselineVehPerHour} -> ${c.scenarioVehPerHour} (${c.changePct}%) | ${f1(c.effect.mean)} ${iv(c.effect)}, sd ${c.effect.sd} | ${per.join(' | ')} | ${h ? `${h.block.replace(/ Street/g, ' St').replace(/ Avenue/g, ' Ave')}: +${h.increaseVehPerHour}` : '-'} | ${p.residentsDetour.secondsPerTrip} |`);
  }
  w();
  w(`Displacement rule: dropped ${g.computed.displacement.dropped.length} option(s)${g.computed.displacement.dropped.length ? ': ' + JSON.stringify(g.computed.displacement.dropped) : ''}.`);
  w(`Option comparisons (each option against the next): ${g.optionComparisons.map((c) => `${c.option} vs ${c.against} +${f1(c.extraCutVehPerHour.mean)} ${iv(c.extraCutVehPerHour)} ${c.extraCutVehPerHour.status}`).join('; ')}.\n`);
};
table(N, 'Round 51 candidate (this search)');
table(O, 'Published search-c5');
w('## Largest all-car rise on one block, by period (displacement view)\n');
w('| Set | Option | PM | AM | Midday | Through-car blocks with a resolved rise |\n| --- | --- | --- | --- | --- | --- |');
for (const [lab, g] of [['round 51', N], ['search-c5', O]]) for (const p of g.proposals) w(`| ${lab} | ${p.id} | ${P.map((k) => { const a = p.byPeriod[k].allTraffic.largestIncrease; return `+${a.increaseVehPerHour} ${a.block.replace(/ Street/g, ' St').replace(/ Avenue/g, ' Ave')} (${p.byPeriod[k].allTraffic.blocksAboveBand} above band)`; }).join(' | ')} | ${p.harm.through.blocksResolvedIncrease} |`);
w();
w('## By goal\n');
w('| Goal | Round 51 | search-c5 | Same changes? |\n| --- | --- | --- | --- |');
for (const gid of ['most-removed', 'no-closures', 'least-detour', 'fewest-changes']) { const a = N.proposals.find((p) => (p.objectives ?? []).includes(gid)), b = O.proposals.find((p) => (p.objectives ?? []).includes(gid)); w(`| ${gid} | ${a.id}: ${f1(a.cutThrough.effect.mean)} veh/h, ${a.residentsDetour.secondsPerTrip} s/trip | ${b.id}: ${f1(b.cutThrough.effect.mean)} veh/h, ${b.residentsDetour.secondsPerTrip} s/trip | ${key(a) === key(b) ? 'yes' : 'no'} |`); }
w();
w('## Where each option went (exact intervention sets)\n');
const where = (G, link) => { const K = key({ link }); const r = []; for (const p of G.proposals) { if (key(p) === K) r.push(`option ${p.id}`); for (const v of p.variants ?? []) if (key(v) === K) r.push(`variant of ${p.id} (${v.why})`); } for (const f of G.computed.similarity.folded) if (key({ link: f.from }) === K) r.push(`folded (${f.why})`); return [...new Set(r)].join('; ') || 'not published (see the finalist table in report.md)'; };
w('| search-c5 option | Goal | In the round 51 set |\n| --- | --- | --- |');
for (const q of O.proposals) w(`| ${q.id} | ${goals(q)} | ${where(N, q.link)} |`);
w();
w('| Round 51 option | Goal | Source | In the search-c5 set |\n| --- | --- | --- | --- |');
for (const p of N.proposals) w(`| ${p.id} | ${goals(p)} | ${p.origin.kind}${p.origin.added ? ' ' + p.origin.added : ''} | ${where(O, p.link)} |`);
w();
w('Tokens: mn modal filter, dd diagonal diverter, ow one-way, ss Slow Street, ct traffic circle, tb turn ban; geohash, then heading(s).');
fs.writeFileSync('target/r51-search/compare.md', out.join('\n') + '\n');
console.log(out.join('\n'));
