// Default-identity check of a round 55 loop run against the published run of the derived-targets job (design D2). With only the cap and the diagnostics changed, the first three passes must
// be the published loop's: the demand of each pass and view byte for byte, and the loop's own per-pass figures (offered demand, stations with pairs, flow and membership change) equal.
//   node identity.cjs CAND_LOOP_DIR PUBLISHED_LOOP_DIR   (each is a target/membership-loop folder)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const [cand, pub] = process.argv.slice(2);
if (!pub) { console.error('usage: node identity.cjs CAND_LOOP_DIR PUBLISHED_LOOP_DIR'); process.exit(2); }
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 16);
let bad = 0;
const say = (s) => console.log(s);
const state = (d) => JSON.parse(fs.readFileSync(path.join(d, 'state.json'), 'utf8'));
const cs = state(cand), ps = state(pub);
const passesRun = (s) => Math.max(...s.reports.map((r) => r.pass)) + 1;
const upto = Math.min(3, passesRun(cs), passesRun(ps));
say(`passes in common: ${upto} (candidate ${passesRun(cs)}, published ${passesRun(ps)})`);
for (let k = 0; k < upto; k++) for (const v of ['shipped', 'training']) {
  const a = path.join(cand, `iter${k}`, v, 'demand.json'), b = path.join(pub, `iter${k}`, v, 'demand.json');
  if (!fs.existsSync(a) || !fs.existsSync(b)) { say(`pass ${k} ${v}: demand missing (${fs.existsSync(a) ? 'published' : 'candidate'} side)`); bad++; continue; }
  const same = sha(a) === sha(b);
  say(`pass ${k} ${v} demand: ${sha(a)} ${same ? '==' : '!='} ${sha(b)}`);
  if (!same) bad++;
}
const strip = (r) => JSON.stringify(r);
for (const r of cs.reports.filter((x) => x.pass < upto)) {
  const q = ps.reports.find((x) => x.pass === r.pass && x.view === r.view && x.period === r.period);
  const same = q && strip(q) === strip(r);
  if (!same) { say(`pass ${r.pass} ${r.view} ${r.period}: the loop's figures differ from the published run's`); bad++; }
}
say(bad ? `IDENTITY FAILED: ${bad} difference(s)` : `identity holds for passes 0 to ${upto - 1}: every demand is byte-identical and the loop's own figures are equal`);
process.exit(bad ? 1 : 0);
