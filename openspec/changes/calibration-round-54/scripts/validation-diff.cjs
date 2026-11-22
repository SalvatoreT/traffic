// Round 54: the validation suite run in the working tree against the committed (published) data/calibration/validation.json. Prints the pass counts, every case whose verdict or simulated
// value changed (a primitive that moved), and any case that passed and now fails. Reads only; marks nothing as reviewed.
// usage: node validation-diff.cjs [NEW_JSON]   (default data/calibration/validation.json in the working tree; the old one is `git show HEAD:data/calibration/validation.json`)
const fs = require('fs');
const { execFileSync } = require('child_process');
const newFile = process.argv[2] ?? 'data/calibration/validation.json';
const cur = JSON.parse(fs.readFileSync(newFile, 'utf8'));
const old = JSON.parse(execFileSync('git', ['show', 'HEAD:data/calibration/validation.json'], { encoding: 'utf8', maxBuffer: 1 << 26 }));
const by = (v) => new Map(v.cases.map((c) => [c.id, c]));
const o = by(old), n = by(cur);
const passes = (v) => v.cases.filter((c) => c.pass).length;
console.log(`Validation suite: published ${passes(old)} of ${old.cases.length} cases pass, this run ${passes(cur)} of ${cur.cases.length}.`);
const lost = [], moved = [];
for (const [id, c] of n) {
  const p = o.get(id);
  if (!p) { moved.push(`${id}: new case`); continue; }
  if (p.pass && !c.pass) lost.push(`${id} (${c.name}): sim ${p.sim} -> ${c.sim}, range ${c.lo} to ${c.hi}`);
  if (p.sim !== c.sim || p.pass !== c.pass) moved.push(`${id}: sim ${p.sim} -> ${c.sim}, pass ${p.pass} -> ${c.pass}`);
}
for (const id of o.keys()) if (!n.has(id)) moved.push(`${id}: case missing`);
console.log(lost.length ? `PASS LOST in ${lost.length} case(s):\n${lost.map((x) => '- ' + x).join('\n')}` : 'No pass lost.');
console.log(moved.length ? `Primitives that changed (${moved.length}):\n${moved.map((x) => '- ' + x).join('\n')}` : 'No primitive changed: every simulated value equals the published one.');
console.log(`Known deviations are in data/calibration/validation.deviations.json; this script marks none as reviewed.`);
process.exit(lost.length ? 1 : 0);
