// Round 47: read a station-table.ts output and print, per period, the recent fitted and held-out counts of its head line and whether each named station passes (GEH < 5).
// Usage: node target/r47/common.cjs <station-table.md> "ramp on 1695" "ramp on 1711" ...
const fs = require('fs');
const [file, ...ids] = process.argv.slice(2);
const out = {}; let p = null;
for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
  const h = line.match(/^## (\w+): (\d+) seeds\. Recent fitted (\d+) of (\d+); recent held out (\d+) of (\d+)/);
  if (h) { p = h[1]; out[p] = { seeds: +h[2], fitted: +h[3], fittedN: +h[4], held: +h[5], heldN: +h[6], stations: {} }; continue; }
  if (!p || !line.startsWith('| ')) continue;
  const c = line.split(' | ').map((x) => x.replace(/^\| /, '').replace(/ \|$/, ''));
  if (ids.includes(c[0])) out[p].stations[c[0]] = { held: c[2], year: c[3], derived: c[4], counted: +c[5], modeled: +c[6], geh: +c[7], ok: c[8] === 'yes' };
}
console.log(JSON.stringify(out));
