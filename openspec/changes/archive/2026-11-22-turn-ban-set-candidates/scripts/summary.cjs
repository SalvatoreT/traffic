// One table for the project lead: the checked packages (published p1, the search's options with a ban set, the hand combinations) against baseline and against p1 on the same seeds, read
// from the `explore --check` logs of c.zsh, then the options of the search with --ban-sets against the published ones.
//   node summary.cjs --checks target/ban-sets/check --list target/ban-sets/checks.json [--published public/data/rockridge.proposals.json] [--search target/ban-sets/proposals.json]
//        [--out target/ban-sets/summary.md]
// `--check` prints text, so this reads text. What it cannot read is listed at the end of the output. Each package shows three counts: interventions (a ban set is one), individual turn bans
// (a set counts every ban) and physical closures (modal filters and diagonal diverters).
const fs = require('fs');
const path = require('path');
const { parseCheck } = require('./parse-check.cjs');

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };
const checkDir = opt('checks', 'target/ban-sets/check');
const listFile = opt('list', 'target/ban-sets/checks.json');
const publishedFile = opt('published', 'public/data/rockridge.proposals.json');
const searchFile = opt('search', 'target/ban-sets/proposals.json');
const outFile = opt('out', 'target/ban-sets/summary.md');

const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : '-');
const f0 = (x) => (Number.isFinite(x) ? Math.round(x).toString() : '-');
const signed = (x, d = 1) => (Number.isFinite(x) ? `${x >= 0 ? '+' : ''}${x.toFixed(d)}` : '-');
const pctBound = (x, base) => signed(Math.max(-100, (100 * x) / base));
const worstAll = (r) => r.periods.reduce((w, p) => (p.blockScen - p.blockBase > (w ? w.inc : -Infinity) ? { inc: p.blockScen - p.blockBase, block: p.block, period: p.period, base: p.blockBase, scen: p.blockScen } : w), null);
const items = (link) => (link.split(';').find((t) => t.startsWith('s=')) ?? 's=').slice(2).split('~').filter(Boolean);
const countsOf = (link) => { const i = items(link).map((x) => x.split(',')[0]); return { bans: i.filter((c) => c === 'tb').length, closures: i.filter((c) => c === 'mf' || c === 'mn' || c === 'dd').length }; };

const list = JSON.parse(fs.readFileSync(listFile, 'utf8')).checks;
const parsed = {};
for (const c of list) {
  const file = path.join(checkDir, `${c.id}.log`);
  if (fs.existsSync(file)) parsed[c.id] = parseCheck(fs.readFileSync(file, 'utf8'));
}
const p1 = parsed.p1;

const out = [];
const w = (s = '') => out.push(s);
w('# Ban sets and filters, one table');
w();
w('Every figure below is from `explore --check` on the same seeds (101 to 110), periods and run length as the published confirmation; through cars an hour are the mean of the periods and seeds. Interval: the paired 95% interval of the through-car change over seeds (calibration error, demand error and compliance are not in it). The model is not calibrated. Bans apply to every vehicle in every period and are assumed obeyed in full (ASSUMPTION). Counts: interventions (a ban set is one), individual turn bans, physical closures (modal filters and diagonal diverters).');
w();
if (p1 && p1.rechecked) w(`Reference p1 (published package) re-checked here: ${f1(p1.base)} -> ${f1(p1.scen)} (${signed(p1.pct)}%); published figure: 522.5 -> 135.7 (-74.0%).${Math.abs(p1.scen - 135.7) > 1 ? ' THE RE-CHECK DIFFERS FROM THE PUBLISHED FIGURE BY MORE THAN ONE CAR AN HOUR: report this first, the inputs or the build are not the published ones.' : ''}`);
else w('Reference p1 was not checked (no `p1.log`).');
w();
w('| Package | Interventions | Individual bans | Physical closures | Through cars an hour, mean of periods | Change vs baseline (95% interval) | PM | AM | Midday | Worst block, through cars | Worst block, all traffic | Rejected or fails access | Change minus the change of p1 (points; positive is a smaller reduction) |');
w('| --- | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
const rows = [];
for (const c of list) {
  const r = parsed[c.id];
  if (!r) { w(`| \`${c.id}\` | - | ${c.bans} | ${c.closures} | not run | | | | | | | | |`); continue; }
  const per = (n) => { const p = r.periods.find((x) => x.period === n); return p ? `${f0(p.base)} -> ${f0(p.scen)} (${signed(p.pct)}%)` : '-'; };
  const diff = r.scen - r.base;
  const interval = Number.isFinite(r.lo) ? `${signed(diff, 1)} cars/h (${signed(r.pct)}%; ${signed(r.lo, 0)} to ${signed(r.hi, 0)} cars/h, ${pctBound(r.lo, r.base)}% to ${pctBound(r.hi, r.base)}%)` : `${signed(diff, 1)} cars/h (${signed(r.pct)}%; ${r.noInterval ?? 'no interval'})`;
  const wa = worstAll(r);
  const why = [r.reject ? `rejected: ${r.reject}` : null, r.access && r.access !== 'passes' ? `access ${r.access}` : null, r.decode ? `does not decode: ${r.decode}` : null].filter(Boolean).join('; ') || 'none';
  const vs = c.id === 'p1' || !p1 || !Number.isFinite(p1.pct) ? '' : `${signed(r.pct - p1.pct)} points`;
  w(`| \`${c.id}\` | ${r.n ?? '-'} | ${c.bans} | ${c.closures} | ${f1(r.base)} -> ${f1(r.scen)} | ${interval} | ${per('pm_peak')} | ${per('am_peak')} | ${per('midday')} | ${r.throughBlock ? `${r.throughBlock}: ${signed(r.throughInc, 0)} (${r.throughIntervalText})` : '-'} | ${wa ? `${wa.block}, ${wa.period}: ${f0(wa.base)} -> ${f0(wa.scen)} (${signed(wa.inc, 0)})` : '-'} | ${why} | ${vs} |`);
  rows.push({ id: c.id, title: c.title, interventions: r.n, bans: c.bans, closures: c.closures, base: r.base, scen: r.scen, pct: r.pct, lo: r.lo, hi: r.hi, reject: r.reject, access: r.access, worstAll: wa, throughBlock: r.throughBlock, throughInc: r.throughInc });
}
w();
w('Titles: ' + list.map((c) => `\`${c.id}\` ${c.title} (${c.note})`).join('; ') + '.');
w();
const ok = rows.filter((r) => r.id !== 'p1' && !r.reject && r.access === 'passes');
const best = [...ok].sort((a, b) => a.pct - b.pct)[0];
w(`Packages with no rejection and a passing access check: ${ok.map((r) => r.id).join(', ') || 'none'}. Largest reduction among them: ${best ? `\`${best.id}\`, ${signed(best.pct)}% against ${p1 ? `${signed(p1.pct)}% for p1` : 'p1 not checked'}` : 'none'}.`);
const beats = ok.filter((r) => p1 && r.pct < p1.pct);
w(`Packages that remove more through cars than p1 on the same seeds: ${beats.map((r) => `\`${r.id}\` ${signed(r.pct)}% with ${r.interventions} interventions, ${r.bans} bans, ${r.closures} closures`).join('; ') || 'none'}. Rule: a package or option that beats p1 is the project lead's decision; nothing is published.`);
w();

let changed = null;
if (fs.existsSync(searchFile) && fs.existsSync(publishedFile)) {
  const pub = JSON.parse(fs.readFileSync(publishedFile, 'utf8')), cand = JSON.parse(fs.readFileSync(searchFile, 'utf8'));
  const g0 = pub.groups[0], g1 = cand.groups[0];
  const labels = (p) => (p?.interventions ?? []).map((i) => i.label).sort();
  const hasSet = (p) => (p.interventions ?? []).some((i) => i.type === 'ban_set');
  const bansOf = (p) => (p.turnBans !== undefined ? p.turnBans : countsOf(p.link).bans);
  const closuresOf = (p) => countsOf(p.link).closures;
  w('## Search with ban sets against the published search');
  w();
  const t0 = g0.proposals[0], t1 = g1.proposals[0];
  const same = JSON.stringify(labels(t0)) === JSON.stringify(labels(t1));
  const drop = t1.cutThrough.changePct - t0.cutThrough.changePct;
  changed = { sameTop: same, points: drop };
  w(`Baseline through cars an hour: published ${f1(t0.cutThrough.baselineVehPerHour)}, this search ${f1(t1.cutThrough.baselineVehPerHour)}.`);
  w(`Top proposal: published \`${t0.id}\` (${f1(t0.cutThrough.changePct)}%), this search \`${t1.id}\` (${f1(t1.cutThrough.changePct)}%, ${t1.interventions.length} interventions, ${bansOf(t1)} individual bans, ${closuresOf(t1)} physical closures). Same interventions: ${same ? 'yes' : 'NO'}. Top option holds a ban set: ${hasSet(t1) ? 'yes' : 'no'}. Headline change against the published top option: ${signed(drop)} points${Math.abs(drop) > 15 ? ' (MORE THAN 15 POINTS: the project lead decides)' : ''}.`);
  if (!same) w('The top option differs from published p1: the project lead decides (design D7).');
  const k = g1.computed?.knownPackages;
  if (k) w(`Known packages in this search: ${k.loaded} loaded, ${k.rechecked} rechecked, ${k.dropped} dropped${(k.droppedPackages ?? []).length ? ` (${k.droppedPackages.map((d) => d.reason).join('; ')})` : ''}.`);
  w();
  w('| Set | Id | Kind | Interventions | Individual bans | Physical closures | Through cars an hour | Change (95% interval, cars/h) | Largest through-car rise on one block | Includes a ban set |');
  w('| --- | --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |');
  for (const [name, g] of [['Published', g0], ['This search', g1]]) {
    for (const p of g.proposals) {
      const e = p.cutThrough.effect ?? {}, b = p.harm?.through?.largestIncrease;
      w(`| ${name} | ${p.id} | ${p.kind} | ${(p.interventions ?? []).length} | ${bansOf(p)} | ${closuresOf(p)} | ${f1(p.cutThrough.baselineVehPerHour)} -> ${f1(p.cutThrough.scenarioVehPerHour)} | ${f1(p.cutThrough.changePct)}% (${e.interval ? `${f0(e.interval[0])} to ${f0(e.interval[1])}` : 'no interval'}) | ${b ? `${b.block}, +${f1(b.increaseVehPerHour)}` : '-'} | ${hasSet(p) ? 'yes' : 'no'} |`);
    }
  }
  w();
  w('Titles of the options of this search:');
  w();
  for (const p of g1.proposals) w(`- \`${p.id}\`: ${p.title}. ${(p.interventions ?? []).map((i) => i.label).join('; ')}`);
  w();
  const same2 = g0.proposals.map((p) => JSON.stringify(labels(p))), same3 = g1.proposals.map((p) => JSON.stringify(labels(p)));
  w(`Options of this search that the published list also holds: ${same3.filter((x) => same2.includes(x)).length} of ${same3.length}. Options with a ban set: ${g1.proposals.filter(hasSet).map((p) => p.id).join(', ') || 'none'}.`);
  w();
} else {
  w('## Search');
  w();
  w(`No search output at \`${searchFile}\` or no published file: b.zsh has not run, or it failed.`);
  w();
}

w('## What `explore --check` does not report');
w();
w('- Per-period intervals: the interval is on the mean of the periods only. Per-period lines give means and percent.');
w('- Per-seed values and any paired difference between two packages: "change vs p1" is a difference of two changes, each against its own baseline run on the same seeds, shown without an interval.');
w('- The through-car and local-trip split of the all-traffic worst block, the other blocks past the noise band by name, and gridlock and backlog counts unless a package is rejected for them.');
w('- Machine-readable output: figures come from the text lines, through cars per period rounded to whole cars an hour.');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, out.join('\n') + '\n');
fs.writeFileSync(outFile.replace(/\.md$/, '.json'), JSON.stringify({ rows, search: changed }, null, 1) + '\n');
console.log(out.join('\n'));
