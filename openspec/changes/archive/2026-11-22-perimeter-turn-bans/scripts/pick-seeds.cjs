// Chooses the turn-ban packages that c.zsh adds as hand seeds. A package is seeded when its `explore --check` ran, it was not rejected, its access check passed and it has at most DEPTH
// bans (the search drops a seed with more interventions than its depth, proposals spec "Packages are no larger than the search depth"). Prints `id<TAB>link` for the seeded ones and
// says on stderr why each of the others is left out.
//   node pick-seeds.cjs --packages target/turn-bans/packages.json --checks target/tb/check --depth 6
const fs = require('fs');
const path = require('path');
const { parseCheck } = require('./parse-check.cjs');

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };
const pk = JSON.parse(fs.readFileSync(opt('packages', 'target/turn-bans/packages.json'), 'utf8'));
const dir = opt('checks', 'target/tb/check');
const depth = Number(opt('depth', '6'));

for (const p of pk.packages) {
  const file = path.join(dir, `${p.id}.log`);
  const why = (() => {
    if (!p.roundTrip) return `its link does not round-trip (${p.problem})`;
    if (!fs.existsSync(file)) return 'no check log';
    const r = parseCheck(fs.readFileSync(file, 'utf8'));
    if (!r.rechecked) return 'the check did not finish';
    if (r.reject) return `rejected: ${r.reject}`;
    if (r.access !== 'passes') return `access check ${r.access}`;
    if (p.bans > depth) return `${p.bans} bans, more than the search depth of ${depth}`;
    return null;
  })();
  if (why) console.error(`not seeded: ${p.id}: ${why}`);
  else console.log(`${p.id}\t${p.link}`);
}
