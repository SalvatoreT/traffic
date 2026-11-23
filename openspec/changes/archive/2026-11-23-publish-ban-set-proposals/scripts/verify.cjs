#!/usr/bin/env node
// Checks a freshly searched proposals file against the published model and prints the headline table for the project lead.
//   node verify.cjs --file public/data/rockridge.proposals.json --old-p1 laptop/old-p1.link --out target/publish-bs/headline.md
//     [--fingerprint 6b886c8f52ee07397773ddd0ebbcb447 --network 53c823f20d9165ed --demand 2d16d8f8eb0950ca] [--p1-through 135.7] [--p1-tolerance 1]
// Exit 0: every check passed. Exit 1: a check failed (the table is still written). Reads only; writes the --out file.
const fs = require('fs');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const file = arg('--file');
const oldP1 = fs.readFileSync(arg('--old-p1'), 'utf8').trim();
const out = arg('--out');
const FP = arg('--fingerprint', '6b886c8f52ee07397773ddd0ebbcb447');
const NET = arg('--network', '53c823f20d9165ed');
const DEM = arg('--demand', '2d16d8f8eb0950ca');
const P1 = Number(arg('--p1-through', '135.7'));
const TOL = Number(arg('--p1-tolerance', '1'));
const d = JSON.parse(fs.readFileSync(file, 'utf8'));
const items = (link) => (link.split(';s=')[1] || '').split('~').filter(Boolean).sort().join('~');
const checks = [];
const check = (name, ok, detail) => checks.push({ name, ok, detail });

const groups = d.groups || [];
const all = groups.flatMap((g) => g.proposals.map((p) => ({ g, p })));
const options = all.filter(({ p }) => p.kind !== 'reference');
const refs = all.filter(({ p }) => p.kind === 'reference');
const closures = (p) => p.interventions.filter((i) => i.type === 'modal_filter' || i.type === 'diagonal_diverter').length;
const bans = (p) => p.turnBans ?? p.interventions.filter((i) => i.type === 'turn_ban').length;
const through = (p) => p.cutThrough.scenarioVehPerHour;
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : 'n/a');
const iv = (e) => (e && e.interval ? `${f1(e.interval[0])} to ${f1(e.interval[1])}` : 'no interval');

check('file version 5', d.version === 5, `version ${d.version}`);
check('option count', options.length >= 4 && options.length <= 7, `${options.length} options (a list holds up to 6 plus the references)`);
for (const g of groups) {
  const c = g.computed || {};
  check(`group ${g.id}: network hash`, c.networkHash === NET, `${c.networkHash} (expected ${NET})`);
  check(`group ${g.id}: demand hash`, c.demandHash === DEM, `${c.demandHash} (expected ${DEM})`);
  check(`group ${g.id}: simulator fingerprint`, c.simulator === FP, `${c.simulator} (expected ${FP})`);
  check(`group ${g.id}: reporting method`, typeof c.reportMethod === 'string' && c.reportMethod.length > 0, String(c.reportMethod));
  check(`group ${g.id}: confirmation seeds`, JSON.stringify(c.seeds) === JSON.stringify([101, 102, 103, 104, 105, 106, 107, 108, 109, 110]), JSON.stringify(c.seeds));
  for (const id of ['no-turn-bans', 'most-removed-no-turn-bans']) check(`group ${g.id}: ${id} objective listed`, (c.objectives?.list || []).some((o) => o.id === id), (c.objectives?.list || []).map((o) => o.id).join(', '));
}
for (const { p } of options) {
  check(`${p.id}: no rejection`, !p.simulationProblem && !p.accessProblem, p.simulationProblem || p.accessProblem || 'none');
  check(`${p.id}: confirmed on the fresh seeds`, p.evidence?.role === 'confirmation', String(p.evidence?.role));
  check(`${p.id}: resident detour recorded`, p.residentsDetour && p.residentsDetour.secondsPerTrip != null, JSON.stringify(p.residentsDetour?.secondsPerTrip));
  check(`${p.id}: a picture for the card`, !!p.picture, p.picture ? 'yes' : 'no');
}
const sorted = [...options].sort((a, b) => through(a.p) - through(b.p));
const top = sorted[0]?.p;
const withTag = (tag) => options.filter(({ p }) => (p.objectives || []).includes(tag));
const noBan = withTag('no-turn-bans');
check('exactly one option carries the no-turn-bans tag', noBan.length === 1, noBan.map(({ p }) => p.id).join(', ') || 'none');
const nb = noBan[0]?.p;
if (nb) check('the no-turn-bans option holds no turn ban', bans(nb) === 0, `${nb.id}: ${bans(nb)} bans, ${nb.interventions.length} interventions, ${closures(nb)} closures, ${f1(through(nb))} through cars an hour`);
const mostNoBan = withTag('most-removed-no-turn-bans');
check('exactly one option carries the most-removed-no-turn-bans tag', mostNoBan.length === 1, mostNoBan.map(({ p }) => p.id).join(', ') || 'none');
const mb = mostNoBan[0]?.p;
if (mb) {
  check('the most-removed-no-turn-bans option holds no turn ban', bans(mb) === 0, `${bans(mb)} bans`);
  check("the most-removed-no-turn-bans option equals the old p1's interventions", items(mb.link) === items(oldP1) && mb.interventions.length === 6, `${mb.id}: ${mb.interventions.length} interventions, ${closures(mb)} closures`);
  check(`the most-removed-no-turn-bans option reproduces ${P1} through cars an hour within ${TOL}`, Math.abs(through(mb) - P1) <= TOL, `${f1(through(mb))} (published ${P1})`);
}
if (nb && mb) {
  const same = nb.id === mb.id;
  checks.push({ name: 'no-turn-bans and most-removed-no-turn-bans options', ok: true, warn: same, detail: same ? `one option (${nb.id}) carries both tags` : `${nb.id} (${f1(through(nb))}) and ${mb.id} (${f1(through(mb))})` });
  check('most-removed-no-turn-bans removes at least as many through cars as no-turn-bans', through(mb) <= through(nb) + 1e-9, `${f1(through(mb))} vs ${f1(through(nb))}`);
}
check('no duplicate: each link appears once', new Set(options.map(({ p }) => items(p.link))).size === options.length, `${options.length} options`);
const leftOnly = options.find(({ p }) => p.interventions.length === 1 && p.interventions[0].type === 'ban_set' && p.interventions[0].bans === 21);
const detail = leftOnly ? `kept as ${leftOnly.p.id}: ${f1(through(leftOnly.p))} through cars an hour` : 'not in the list (the earlier run listed it as option 4)';
checks.push({ name: 'left turns alone (21 bans) is in the list', ok: true, warn: !leftOnly, detail });

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
lines.push(`File: ${file}. Baseline ${f1(options[0]?.p.cutThrough.baselineVehPerHour)} through cars an hour. ${options.length} options, ${refs.length} references. Intervals are paired 95% over seeds 101 to 110 and cover seed variability only. Through cars an hour, not all cars.`, '');
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
