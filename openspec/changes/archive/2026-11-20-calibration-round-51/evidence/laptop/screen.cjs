// Round 49 (from round 45's): read a three-seed diagnostic assessment and print, per period, the four station counts, the judged-zone gridlock clearances and the D16 backlog line.
const fs = require('fs');
const md = fs.readFileSync(process.argv[2], 'utf8').split('\n');
const out = { counts: {}, gridlock: {}, backlog: {} };
for (const line of md) {
  const m = line.match(/^\| (am_peak|pm_peak) \| [^|]* \| [^|]* \| (\d+) of (\d+)[^|]*\| (\d+) of (\d+)/);
  if (m) out.counts[m[1]] = { fitted: +m[2], fittedOf: +m[3], held: +m[4], heldOf: +m[5] };
}
let period = null;
for (const line of md) {
  const h = line.match(/^#+ .*\b(am_peak|pm_peak|midday)\b/);
  if (h) period = h[1];
  const s = line.match(/Cars cleared from gridlock (near the study area \(judged zone[^)]*\)|\(all of them[^)]*\)) ([\d.]+) per hour \(min ([\d.]+), max ([\d.]+)/);
  if (s && period) out.gridlock[period] = { scope: s[1].startsWith('near') ? 'judged zone' : 'all', mean: +s[2], min: +s[3], max: +s[4] };
  const b = line.match(/backlog under 2% in (\d+) of (\d+) seeds \(mean ([\d.]+)%, max ([\d.]+)%\)/);
  if (b && period && line.includes('Stability rule (D16)')) out.backlog[period] = { k: +b[1], n: +b[2], mean: +b[3], max: +b[4] };
}
console.log(JSON.stringify(out));
