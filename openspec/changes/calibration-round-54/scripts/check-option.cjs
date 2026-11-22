// Round 54: confirm that every seed report in the given folders was run with the router option the set is named for.
// usage: node check-option.cjs DIR [DIR...] on|off PERIOD [--seeds 1-10]
// A report records `run.settings.singleControlCharge: true` when the option was on and no such key when it was off.
const fs = require('fs');
const args = process.argv.slice(2);
const si = args.indexOf('--seeds');
const spec = si >= 0 ? args.splice(si, 2)[1] : '1-10';
const period = args.pop();
const want = args.pop();
if (!['on', 'off'].includes(want) || !args.length) { console.error('usage: check-option.cjs DIR... on|off PERIOD [--seeds A-B]'); process.exit(2); }
const [a, b] = spec.split('-').map(Number);
const seeds = Array.from({ length: (b ?? a) - a + 1 }, (_, i) => a + i);
let bad = 0;
for (const dir of args) {
  for (const s of seeds) {
    const f = `${dir}/rockridge-${period}-s1-seed${s}.json`;
    if (!fs.existsSync(f)) { console.error(`missing ${f}`); bad++; continue; }
    const r = JSON.parse(fs.readFileSync(f, 'utf8'));
    const on = r.manifest?.run?.settings?.singleControlCharge === true;
    if (on !== (want === 'on')) { console.error(`${f}: option ${on ? 'on' : 'off'}, expected ${want}`); bad++; }
  }
}
if (bad) { console.error(`check-option: ${bad} report(s) do not match`); process.exit(1); }
console.log(`check-option: ${args.length} folder(s) x ${seeds.length} seeds, ${period}: option ${want} in every report`);
