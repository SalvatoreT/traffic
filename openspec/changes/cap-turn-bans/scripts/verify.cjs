#!/usr/bin/env node
// Checks a freshly searched proposals file against the published model and the turn-ban cap, and prints the headline table for the project lead.
//   node verify.cjs --file public/data/rockridge.proposals.json --old-p1 laptop/old-p1.link --out target/cap-bans/headline.md
//     [--fingerprint 6b886c8f52ee07397773ddd0ebbcb447 --network 53c823f20d9165ed --demand 2d16d8f8eb0950ca] [--max-bans 5] [--p1-through 135.7] [--p1-tolerance 1]
//     [--results-dir public/data/results/rockridge --redistribution-dir public/data/redistribution/rockridge]
// Exit 0: every check passed. Exit 1: a check failed (the table is still written). Reads only; writes the --out file.
const fs = require('fs');
const path = require('path');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const file = arg('--file');
const oldP1 = fs.readFileSync(arg('--old-p1'), 'utf8').trim();
const out = arg('--out');
const FP = arg('--fingerprint', '6b886c8f52ee07397773ddd0ebbcb447');
const NET = arg('--network', '53c823f20d9165ed');
const DEM = arg('--demand', '2d16d8f8eb0950ca');
const CAP = Number(arg('--max-bans', '5'));
const P1 = Number(arg('--p1-through', '135.7'));
const TOL = Number(arg('--p1-tolerance', '1'));
const resultsDir = arg('--results-dir');
const redistDir = arg('--redistribution-dir');
const d = JSON.parse(fs.readFileSync(file, 'utf8'));
const items = (link) => (link.split(';s=')[1] || '').split('~').filter(Boolean).sort().join('~');
const checks = [];
const check = (name, ok, detail) => checks.push({ name, ok, detail });
const note = (name, detail) => checks.push({ name, ok: true, warn: true, detail });

const groups = d.groups || [];
const all = groups.flatMap((g) => g.proposals.map((p) => ({ g, p })));
const options = all.filter(({ p }) => p.kind !== 'reference');
const refs = all.filter(({ p }) => p.kind === 'reference');
const closures = (p) => p.interventions.filter((i) => i.type === 'modal_filter' || i.type === 'diagonal_diverter').length;
const bans = (p) => p.turnBans ?? p.interventions.filter((i) => i.type === 'turn_ban').length;
const through = (p) => p.cutThrough.scenarioVehPerHour;
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : 'n/a');
const iv = (e) => (e && e.interval ? `${f1(e.interval[0])} to ${f1(e.interval[1])}` : 'no interval');
// Individual turn bans in the link itself, counted from its `tb` items: independent of the file's own `turnBans` field.
const linkBans = (link) => (link.split(';s=')[1] || '').split('~').filter((x) => x.startsWith('tb,')).length;

check('file version 5', d.version === 5, `version ${d.version}`);
check('option count', options.length >= 3 && options.length <= 7, `${options.length} options (a list holds up to 6 plus the references)`);
for (const g of groups) {
  const c = g.computed || {};
  check(`group ${g.id}: network hash`, c.networkHash === NET, `${c.networkHash} (expected ${NET})`);
  check(`group ${g.id}: demand hash`, c.demandHash === DEM, `${c.demandHash} (expected ${DEM})`);
  check(`group ${g.id}: simulator fingerprint`, c.simulator === FP, `${c.simulator} (expected ${FP})`);
  check(`group ${g.id}: reporting method`, typeof c.reportMethod === 'string' && c.reportMethod.length > 0, String(c.reportMethod));
  check(`group ${g.id}: confirmation seeds 101 to 110`, JSON.stringify(c.seeds) === JSON.stringify([101, 102, 103, 104, 105, 106, 107, 108, 109, 110]), JSON.stringify(c.seeds));
  check(`group ${g.id}: the cap is recorded`, c.turnBanCap?.max === CAP, `computed.turnBanCap.max ${c.turnBanCap?.max} (expected ${CAP}); sets dropped ${(c.turnBanCap?.setsDropped || []).length}, known packages skipped ${c.turnBanCap?.knownPackagesSkipped}`);
  for (const id of ['no-turn-bans', 'most-removed-no-turn-bans']) check(`group ${g.id}: ${id} objective listed`, (c.objectives?.list || []).some((o) => o.id === id), (c.objectives?.list || []).map((o) => o.id).join(', '));
}
for (const { p } of options) {
  check(`${p.id}: no rejection`, !p.simulationProblem && !p.accessProblem, p.simulationProblem || p.accessProblem || 'none');
  check(`${p.id}: confirmed on the fresh seeds`, p.evidence?.role === 'confirmation', String(p.evidence?.role));
  check(`${p.id}: resident detour recorded`, p.residentsDetour && p.residentsDetour.secondsPerTrip != null, JSON.stringify(p.residentsDetour?.secondsPerTrip));
  check(`${p.id}: a picture for the card`, !!p.picture, p.picture ? 'yes' : 'no');
  check(`${p.id}: at most ${CAP} individual turn bans`, bans(p) <= CAP && linkBans(p.link) <= CAP, `${bans(p)} in the file, ${linkBans(p.link)} in the link`);
}

// Each objective tag that appears in the list is on exactly one option.
const tagCount = new Map();
for (const { p } of options) for (const t of p.objectives || []) tagCount.set(t, (tagCount.get(t) || 0) + 1);
for (const [t, n] of [...tagCount].sort()) check(`objective tag ${t} is on exactly one option`, n === 1, `${n} option(s): ${options.filter(({ p }) => (p.objectives || []).includes(t)).map(({ p }) => p.id).join(', ')}`);

const sorted = [...options].sort((a, b) => through(a.p) - through(b.p));
const withTag = (tag) => options.filter(({ p }) => (p.objectives || []).includes(tag));
const banOptions = options.filter(({ p }) => bans(p) > 0);
const noBan = withTag('no-turn-bans');
const mostNoBan = withTag('most-removed-no-turn-bans');
if (banOptions.length === 0) {
  // The rule: with no ban in the list the no-ban tags say nothing, so they are left off.
  check('no option holds a turn ban, so neither no-ban tag is listed', noBan.length === 0 && mostNoBan.length === 0, `no-turn-bans on ${noBan.length}, most-removed-no-turn-bans on ${mostNoBan.length}`);
  note('turn-ban options', `none: the list holds no turn restrictions under the cap of ${CAP}`);
} else {
  check('a list with ban options keeps the best package without bans: exactly one option tagged no-turn-bans', noBan.length === 1, noBan.map(({ p }) => p.id).join(', ') || 'none');
  check('a list with ban options names the no-ban package that removes the most: exactly one option tagged most-removed-no-turn-bans', mostNoBan.length === 1, mostNoBan.map(({ p }) => p.id).join(', ') || 'none');
  for (const { p } of [...noBan, ...mostNoBan]) check(`${p.id}: a no-ban tag sits on a package with no turn ban`, bans(p) === 0, `${bans(p)} bans`);
  const nb = noBan[0]?.p;
  const mb = mostNoBan[0]?.p;
  if (nb && mb) {
    const same = nb.id === mb.id;
    checks.push({ name: 'no-turn-bans and most-removed-no-turn-bans options', ok: true, warn: same, detail: same ? `one option (${nb.id}) carries both tags` : `${nb.id} (${f1(through(nb))}) and ${mb.id} (${f1(through(mb))})` });
    check('most-removed-no-turn-bans removes at least as many through cars as no-turn-bans', through(mb) <= through(nb) + 1e-9, `${f1(through(mb))} vs ${f1(through(nb))}`);
  }
  note('turn-ban options', `${banOptions.length} option(s): ${banOptions.map(({ p }) => `${p.id} (${bans(p)} bans, ${f1(through(p))} through cars an hour)`).join('; ')}`);
}

// The six-change package of the old p1: in the list or not, and when it is, the figure of the published model reproduces.
const old = options.find(({ p }) => items(p.link) === items(oldP1));
if (old) {
  check(`the old p1's package is listed as ${old.p.id} with its six changes`, old.p.interventions.length === 6 && bans(old.p) === 0, `${old.p.interventions.length} interventions, ${closures(old.p)} closures, ${bans(old.p)} bans`);
  check(`the old p1's package reproduces ${P1} through cars an hour within ${TOL}`, Math.abs(through(old.p) - P1) <= TOL, `${f1(through(old.p))} (published ${P1}); tags ${(old.p.objectives || []).join(', ') || 'none'}`);
} else {
  note("the old p1's package", `not in the list (published figure ${P1} through cars an hour); the list holds ${options.length} other options`);
}
check('no duplicate: each link appears once', new Set(options.map(({ p }) => items(p.link))).size === options.length, `${options.length} options`);

// Stored results (one per option and period) and the traced redistribution (one per option) are on disk.
if (resultsDir) {
  const idx = JSON.parse(fs.readFileSync(path.join(resultsDir, 'index.json'), 'utf8'));
  const nPeriods = (groups[0]?.computed?.periods || []).length;
  for (const { g, p } of options) {
    const mine = (idx.results || []).filter((r) => (r.proposals || []).some((x) => x.group === g.id && x.id === p.id));
    const present = mine.filter((r) => fs.existsSync(path.join(resultsDir, `${r.key}.json`)));
    check(`${p.id}: ${nPeriods} stored result files`, present.length === nPeriods && mine.length === nPeriods, `${present.length} of ${mine.length} listed present, ${nPeriods} periods`);
  }
}
if (redistDir) {
  for (const { g, p } of options) {
    const f = path.join(redistDir, `${g.id}.${p.id}.json`);
    check(`${p.id}: a redistribution file`, fs.existsSync(f), fs.existsSync(f) ? f : `missing ${f}`);
  }
}

const rows = [];
const periods = ['pm_peak', 'am_peak', 'midday'];
for (const { p } of sorted) {
  const eff = p.cutThrough.effect;
  const byp = periods.map((id) => {
    const v = p.byPeriod[id];
    return v ? `${id.replace('_peak', '')} ${Math.round(v.cutThrough.baselineVehPerHour)} to ${Math.round(v.cutThrough.scenarioVehPerHour)} (${f1(v.cutThrough.changePct)}%)` : '';
  }).join('; ');
  let worst = null;
  for (const id of periods) {
    const a = p.byPeriod[id]?.allTraffic?.largestIncrease;
    if (a && (!worst || a.increaseVehPerHour > worst.rise)) worst = { rise: a.increaseVehPerHour, text: `${a.block}, ${id}: ${Math.round(a.baselineVehPerHour)} to ${Math.round(a.scenarioVehPerHour)} (+${Math.round(a.increaseVehPerHour)})` };
  }
  const t = p.harm?.through?.largestIncrease;
  const rd = p.residentsDetour;
  rows.push([
    p.id,
    (p.interventions.map((i) => i.label.split(/[,.(]/)[0]).join('; ')).slice(0, 140),
    String(p.interventions.length), String(bans(p)), String(closures(p)),
    `${f1(p.cutThrough.baselineVehPerHour)} to ${f1(through(p))} (${f1(p.cutThrough.changePct)}%; interval ${iv(eff)} cars/h)`,
    byp,
    worst ? worst.text : 'none',
    t ? `${t.block}: ${t.increaseVehPerHour >= 0 ? '+' : ''}${f1(t.increaseVehPerHour)} (${iv(t.effect)})` : 'none',
    rd && rd.secondsPerTrip != null ? `${rd.secondsPerTrip >= 0 ? '+' : ''}${f1(rd.secondsPerTrip)} s (${iv(rd.effect)})` : 'n/a',
    (p.objectives || []).join(', ') || '-',
  ]);
}
const head = ['Option', 'Interventions', 'Count', 'Bans', 'Closures', 'Through cars an hour, mean of periods and seeds', 'By period (through cars an hour)', 'Worst block, all traffic', 'Worst block, through cars', 'Residents, per requested trip', 'Best for'];
const lines = [];
lines.push('# Headline table for the project lead', '');
lines.push(`File: ${file}. Baseline ${f1(options[0]?.p.cutThrough.baselineVehPerHour)} through cars an hour. ${options.length} options, ${refs.length} references. Cap: at most ${CAP} individual turn bans a package. Intervals are paired 95% over seeds 101 to 110 and cover seed variability only. Through cars an hour, not all cars.`, '');
lines.push(`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`);
for (const r of rows) lines.push(`| ${r.join(' | ')} |`);
lines.push('', '## Checks', '');
for (const c of checks) lines.push(`- ${c.warn ? 'NOTE' : c.ok ? 'PASS' : 'FAIL'}: ${c.name}: ${c.detail}`);
const failed = checks.filter((c) => !c.ok);
lines.push('', failed.length ? `RESULT: ${failed.length} check(s) failed.` : 'RESULT: every check passed.', '');
const text = lines.join('\n');
if (out) fs.writeFileSync(out, text);
process.stdout.write(text);
process.exit(failed.length ? 1 : 0);
