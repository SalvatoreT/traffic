// Mean trips waiting at the end of the run by origin node (top-10 table of each seed's report; a node missing from a seed's table counts 0), ten seeds.
const fs = require('fs');
for (const [name, dir] of [['baseline', 'target/assess-seeds/60'], ['candidate', 'target/assess-seeds/60r53']]) for (const p of ['pm_peak', 'am_peak']) {
  const acc = {}, label = {}; let total = 0;
  for (let s = 1; s <= 10; s++) {
    const t = fs.readFileSync(`${dir}/rockridge-${p}-s1-seed${s}.md`, 'utf8');
    total += +(t.match(/Entry backlog at the end of the run: \d+ trips waiting at origins in the zone, of (\d+) in all/)?.[1] ?? NaN);
    const i = t.indexOf('## Entry backlog by origin node'); const sec = t.slice(i, t.indexOf('\n## ', i + 5));
    for (const l of sec.split('\n')) { const c = l.split('|').map((x) => x.trim()); if (/^\d+$/.test(c[1] ?? '')) { acc[c[1]] = (acc[c[1]] ?? 0) + +c[3]; label[c[1]] = c[2]; } }
  }
  const top = Object.entries(acc).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([n, v]) => `${n} ${label[n]} ${(v / 10).toFixed(0)}`).join('; ');
  console.log(`| ${p} | ${name} | ${(total / 10).toFixed(0)} | ${top} |`);
}
