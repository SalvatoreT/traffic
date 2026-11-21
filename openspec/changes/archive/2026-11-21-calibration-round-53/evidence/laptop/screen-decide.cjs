// Round 53 screen rule (design D5, as round 52): node screen-decide.cjs <base.json> <cand.json> <per-seed dir of the candidate screen>
// Each of the four counts no more than 3 stations below the baseline screen, no car cleared from gridlock in the judged zone, backlog under 2% in 3 of 3 seeds in AM and PM.
const fs = require('fs');
const [bf, cf, dir] = process.argv.slice(2);
const b = JSON.parse(fs.readFileSync(bf)), c = JSON.parse(fs.readFileSync(cf));
const fails = [];
for (const p of ['pm_peak', 'am_peak']) for (const k of ['fitted', 'held']) {
  if (!c.counts[p]) { fails.push(p + ' missing'); continue; }
  if (c.counts[p][k] - b.counts[p][k] < -3) fails.push(`${p} ${k} ${c.counts[p][k]} vs ${b.counts[p][k]}`);
}
for (const p of ['pm_peak', 'am_peak']) { const g = c.gridlock[p]; if (!g || g.scope !== 'judged zone' || g.max > 0) fails.push(`${p} gridlock ${JSON.stringify(g)}`); }
for (const p of ['pm_peak', 'am_peak']) {
  let bl = c.backlog[p];
  if (!bl) {
    const v = [];
    for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) if (f.startsWith('rockridge-' + p + '-') && f.endsWith('.json')) v.push(JSON.parse(fs.readFileSync(dir + '/' + f)).health.backlogPct);
    bl = { k: v.filter((x) => x < 2).length, n: v.length, mean: v.reduce((a, x) => a + x, 0) / (v.length || 1), max: Math.max(...v), from: 'seed files' };
    console.error(`${p} backlog line missing, from seed files: ${JSON.stringify(bl)}`);
  }
  if (!(bl.n === 3 && bl.k === 3)) fails.push(`${p} backlog under 2% in ${bl.k} of ${bl.n} seeds (mean ${bl.mean}%, max ${bl.max}%)`);
}
console.log(fails.length ? 'FAIL ' + fails.join('; ') : 'PASS');
