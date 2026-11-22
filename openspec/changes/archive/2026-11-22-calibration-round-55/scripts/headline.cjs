// What the project lead checks before a publish (design D4): through cars an hour at baseline by period, the change from the published set, and the top proposal's options.
// Standing authorization covers a round whose headline through-car change is at most 15% with the same top proposal; this prints both so that the check is a read, not a computation.
//   node headline.cjs PUBLISHED_proposals.json STAGED_proposals.json
const fs = require('fs');
const [pubFile, newFile] = process.argv.slice(2);
if (!newFile) { console.error('usage: node headline.cjs PUBLISHED_proposals.json STAGED_proposals.json'); process.exit(2); }
const LIMIT = 15;
const load = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const pub = load(pubFile), cand = load(newFile);
const out = []; const w = (s = '') => out.push(s);
const pct = (a, b) => (a > 0 ? (100 * (b - a)) / a : NaN);
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : '-');
const labels = (p) => (p?.interventions ?? []).map((i) => i.label).sort();
let worst = 0, same = true;
w('# Headline check for a publish\n');
w(`Published: demand ${pub.groups[0]?.computed?.demandHash}, computed ${pub.groups[0]?.computed?.date}. Staged: demand ${cand.groups[0]?.computed?.demandHash}, computed ${cand.groups[0]?.computed?.date}.\n`);
for (const g of cand.groups) {
  const h = pub.groups.find((x) => x.id === g.id);
  w(`## Group ${g.id}\n`);
  if (!h) { w('Not in the published file.\n'); same = false; continue; }
  w('Through cars an hour at baseline (all periods, the search baseline on the confirmation seeds):\n');
  w('| Period | Published | Staged | Change % |');
  w('| --- | --- | --- | --- |');
  for (const p of Object.keys(g.baseline.cutThroughVehPerHour)) {
    const a = h.baseline.cutThroughVehPerHour[p], b = g.baseline.cutThroughVehPerHour[p], c = pct(a, b);
    if (Number.isFinite(c)) worst = Math.max(worst, Math.abs(c));
    w(`| ${p} | ${f1(a)} | ${f1(b)} | ${f1(c)} |`);
  }
  const a = h.proposals[0]?.cutThrough?.baselineVehPerHour, b = g.proposals[0]?.cutThrough?.baselineVehPerHour, c = pct(a, b);
  if (Number.isFinite(c)) worst = Math.max(worst, Math.abs(c));
  w(`| mean of the periods (top proposal's baseline) | ${f1(a)} | ${f1(b)} | ${f1(c)} |`);
  w();
  const t0 = h.proposals[0], t1 = g.proposals[0];
  const same1 = JSON.stringify(labels(t0)) === JSON.stringify(labels(t1));
  if (!same1) same = false;
  w(`Top proposal (${t0?.id}, ${t0?.kind}) published: ${t0?.title}; staged: ${t1?.title}. Same options: ${same1 ? 'yes' : 'NO'}.\n`);
  w('| | Options | Through cars removed an hour (change %) | Largest rise in through cars on one block |');
  w('| --- | --- | --- | --- |');
  for (const [name, t] of [['Published', t0], ['Staged', t1]]) {
    const big = t?.harm?.through?.largestIncrease;
    w(`| ${name} | ${labels(t).join('; ')} | ${f1(t?.cutThrough?.effect?.mean)} (${f1(t?.cutThrough?.changePct)}%) | ${big ? `${big.block ?? ''}, +${f1(big.increaseVehPerHour)}` : '-'} |`);
  }
  w();
  w(`Proposals: published ${h.proposals.length}, staged ${g.proposals.length}. Same ids and option sets in order: ${JSON.stringify(h.proposals.map((p) => labels(p))) === JSON.stringify(g.proposals.map((p) => labels(p))) ? 'yes' : 'no'}.\n`);
}
const ok = worst <= LIMIT && same;
w(`Largest change in baseline through cars an hour: ${f1(worst)}% (limit ${LIMIT}%). Same top proposal in every group: ${same ? 'yes' : 'NO'}.`);
w(`Standing publish authorization applies: ${ok ? 'yes, if every other step passed' : 'NO: the project lead decides'}.`);
fs.writeFileSync(process.env.HEADLINE_OUT ?? '/dev/stdout', out.join('\n') + '\n');
process.exit(ok ? 0 : 1);
