// One table for the project lead: every turn-ban package against baseline and against published p1, on the same seeds, read from the `explore --check` logs of b.zsh,
// then (if c.zsh ran) the options of the search with turn-ban seeds against the published ones.
//   node summary.cjs --packages target/turn-bans/packages.json --checks target/tb/check [--published public/data/rockridge.proposals.json]
//        [--search target/turn-bans/proposals.json] [--out target/tb/summary.md]
// `--check` prints text, so this reads text. What it cannot read is listed at the end of the output (no per-period interval, no per-seed values, no paired difference
// between two packages).
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };
const packagesFile = opt('packages', 'target/turn-bans/packages.json');
const checkDir = opt('checks', 'target/tb/check');
const publishedFile = opt('published', 'public/data/rockridge.proposals.json');
const searchFile = opt('search', 'target/turn-bans/proposals.json');
const outFile = opt('out', 'target/tb/summary.md');

const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : '-');
const f0 = (x) => (Number.isFinite(x) ? Math.round(x).toString() : '-');
const signed = (x, d = 1) => (Number.isFinite(x) ? `${x >= 0 ? '+' : ''}${x.toFixed(d)}` : '-');

const { parseCheck, num } = require('./parse-check.cjs');

const worstAll = (r) => r.periods.reduce((w, p) => (p.blockScen - p.blockBase > (w ? w.inc : -Infinity) ? { inc: p.blockScen - p.blockBase, block: p.block, period: p.period, base: p.blockBase, scen: p.blockScen } : w), null);

const pk = JSON.parse(fs.readFileSync(packagesFile, 'utf8'));
const files = fs.existsSync(checkDir) ? fs.readdirSync(checkDir).filter((f) => f.endsWith('.log')) : [];
const parsed = {};
for (const f of files) parsed[path.basename(f, '.log')] = parseCheck(fs.readFileSync(path.join(checkDir, f), 'utf8'));
const p1 = parsed.p1;
const ids = ['p1', ...pk.packages.map((p) => p.id)];
const bans = { p1: p1 && p1.n, ...Object.fromEntries(pk.packages.map((p) => [p.id, p.bans])) };

const out = [];
const w = (s = '') => out.push(s);
w('# Turn-ban packages, one table');
w();
w(`Packages from \`${packagesFile}\` (network ${pk.hashes.network.slice(0, 16)}). Every figure below is from \`explore --check\` on the same seeds, periods and run length as the published confirmation; through cars an hour are the mean of the periods and seeds. Interval: the paired 95% interval of the through-car change over seeds (calibration error, demand error and compliance are not in it). The model is not calibrated. Bans apply to every vehicle in every period and are assumed obeyed in full (ASSUMPTION).`);
w();
if (p1 && p1.rechecked) w(`Reference p1 (published package) re-checked here: ${f1(p1.base)} -> ${f1(p1.scen)} (${signed(p1.pct)}%); published figure: 522.5 -> 135.7 (-74.0%).`);
else w('Reference p1 was not checked (no `p1.log`).');
w();
w('| Package | Bans | Through cars an hour, mean of periods | Change vs baseline (95% interval) | PM | AM | Midday | Worst block, through cars | Worst block, all traffic | Rejected or fails access | Change minus the change of p1 (points; positive is a smaller reduction) |');
w('| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
const rows = [];
for (const id of ids) {
  const r = parsed[id];
  if (!r) { w(`| \`${id}\` | ${bans[id] ?? '-'} | not run | | | | | | | | |`); continue; }
  const per = (n) => { const p = r.periods.find((x) => x.period === n); return p ? `${f0(p.base)} -> ${f0(p.scen)} (${signed(p.pct)}%)` : '-'; };
  const diff = r.scen - r.base;
  const interval = Number.isFinite(r.lo) ? `${signed(diff, 1)} cars/h (${signed(r.pct)}%; ${signed(r.lo, 0)} to ${signed(r.hi, 0)} cars/h, ${signed((100 * r.lo) / r.base)}% to ${signed((100 * r.hi) / r.base)}%)` : `${signed(diff, 1)} cars/h (${signed(r.pct)}%; ${r.noInterval ?? 'no interval'})`;
  const wa = worstAll(r);
  const why = [r.reject ? `rejected: ${r.reject}` : null, r.access && r.access !== 'passes' ? `access ${r.access}` : null, r.decode ? `does not decode: ${r.decode}` : null,
    r.allowLines !== bans[id] || r.n !== bans[id] ? `--check listed ${r.allowLines} and rechecked ${r.n} of ${bans[id]} bans` : null].filter(Boolean).join('; ') || 'none';
  const vs = id === 'p1' || !p1 || !Number.isFinite(p1.pct) ? '' : `${signed(r.pct - p1.pct)} points`;
  w(`| \`${id}\` | ${bans[id] ?? '-'} | ${f1(r.base)} -> ${f1(r.scen)} | ${interval} | ${per('pm_peak')} | ${per('am_peak')} | ${per('midday')} | ${r.throughBlock ? `${r.throughBlock}: ${signed(r.throughInc, 0)} (${r.throughIntervalText})` : '-'} | ${wa ? `${wa.block}, ${wa.period}: ${f0(wa.base)} -> ${f0(wa.scen)} (${signed(wa.inc, 0)})` : '-'} | ${why} | ${vs} |`);
  rows.push({ id, bans: bans[id], base: r.base, scen: r.scen, pct: r.pct, lo: r.lo, hi: r.hi, reject: r.reject, access: r.access, worstAll: wa, throughBlock: r.throughBlock, throughInc: r.throughInc });
}
w();
const ok = rows.filter((r) => r.id !== 'p1' && !r.reject && r.access === 'passes');
const best = ok.sort((a, b) => a.pct - b.pct)[0];
w(`Packages with no rejection and a passing access check: ${ok.map((r) => r.id).join(', ') || 'none'}. Largest reduction among them: ${best ? `\`${best.id}\`, ${signed(best.pct)}% against ${p1 ? `${signed(p1.pct)}% for p1` : 'p1 not checked'}` : 'none'}.`);
const headline = rows.filter((r) => r.id !== 'p1' && Math.abs(r.pct) > 15);
const tag = (r) => (r.reject ? ' (rejected)' : r.access !== 'passes' ? ' (access check fails)' : '');
w(`Headline over 15% (project lead's decision, nothing is published without it): ${headline.map((r) => `\`${r.id}\` ${signed(r.pct)}%${tag(r)}`).join(', ') || 'no package'}.`);
w();

if (fs.existsSync(searchFile) && fs.existsSync(publishedFile)) {
  const pub = JSON.parse(fs.readFileSync(publishedFile, 'utf8')), cand = JSON.parse(fs.readFileSync(searchFile, 'utf8'));
  const g0 = pub.groups[0], g1 = cand.groups[0];
  const labels = (p) => (p?.interventions ?? []).map((i) => i.label).sort();
  const hasBan = (p) => labels(p).some((l) => /^Turn ban/.test(l));
  w('## Search with turn-ban seeds against the published search');
  w();
  const t0 = g0.proposals[0], t1 = g1.proposals[0];
  const same = JSON.stringify(labels(t0)) === JSON.stringify(labels(t1));
  w(`Baseline through cars an hour: published ${f1(t0.cutThrough.baselineVehPerHour)}, this search ${f1(t1.cutThrough.baselineVehPerHour)}.`);
  w(`Top proposal: published \`${t0.id}\` (${f1(t0.cutThrough.changePct)}%), this search \`${t1.id}\` (${f1(t1.cutThrough.changePct)}%). Same interventions: ${same ? 'yes' : 'NO'}.`);
  const k = g1.computed?.knownPackages;
  if (k) w(`Known packages in this search: ${k.loaded} loaded, ${k.rechecked} rechecked, ${k.dropped} dropped${(k.droppedPackages ?? []).length ? ` (${k.droppedPackages.map((d) => d.reason).join('; ')})` : ''}.`);
  w();
  w('| Set | Id | Kind | Interventions | Through cars an hour | Change (95% interval, cars/h) | Largest through-car rise on one block | Includes turn bans |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const [name, g] of [['Published', g0], ['This search', g1]]) {
    for (const p of g.proposals) {
      const e = p.cutThrough.effect ?? {}, b = p.harm?.through?.largestIncrease;
      w(`| ${name} | ${p.id} | ${p.kind} | ${(p.interventions ?? []).length} (${labels(p).slice(0, 3).join('; ')}${labels(p).length > 3 ? '; ...' : ''}) | ${f1(p.cutThrough.baselineVehPerHour)} -> ${f1(p.cutThrough.scenarioVehPerHour)} | ${f1(p.cutThrough.changePct)}% (${e.interval ? `${f0(e.interval[0])} to ${f0(e.interval[1])}` : 'no interval'}) | ${b ? `${b.block}, +${f1(b.increaseVehPerHour)}` : '-'} | ${hasBan(p) ? 'yes' : 'no'} |`);
    }
  }
  w();
  const same2 = g0.proposals.map((p) => JSON.stringify(labels(p))), same3 = g1.proposals.map((p) => JSON.stringify(labels(p)));
  w(`Options of this search that the published list also holds: ${same3.filter((x) => same2.includes(x)).length} of ${same3.length}. New options with turn bans: ${g1.proposals.filter(hasBan).map((p) => p.id).join(', ') || 'none'}.`);
  w();
} else {
  w('## Search');
  w();
  w(`No search output at \`${searchFile}\` or no published file: c.zsh has not run, or it failed.`);
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
fs.writeFileSync(outFile.replace(/\.md$/, '.json'), JSON.stringify({ rows }, null, 1) + '\n');
console.log(out.join('\n'));
