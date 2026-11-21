// Round 53 (design D6): the simulated figure that matches each end-along target, from the per-seed `calibrate --select-od` files of a demand: the trips that used a link of the
// select-link run and ended at a node strictly between the run's ends, in cars an hour (trips x 60 / minutes, the pooling's convention), over the seeds.
// Read-only; prints Markdown. Needs the network (for the links' end nodes), the targets file and, per label, a directory of sod-<period>-<seed>.json files.
// usage: node end-along-sim.cjs <period> <label>=<dir> [<label>=<dir> ...]     (run from the repository root)
const fs = require('fs');
const [period, ...args] = process.argv.slice(2);
if (!period || !args.length) { console.error('usage: node end-along-sim.cjs <period> <label>=<dir> ...'); process.exit(2); }
const sets = args.map((a) => { const i = a.indexOf('='); return [a.slice(0, i), a.slice(i + 1)]; });
const net = JSON.parse(fs.readFileSync('public/data/rockridge.network.json', 'utf8'));
const targets = JSON.parse(fs.readFileSync('data/calibration/rockridge.targets.json', 'utf8')).selectLink;
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const se = (a) => (a.length > 1 ? Math.sqrt(a.reduce((x, y) => x + (y - mean(a)) ** 2, 0) / (a.length - 1) / a.length) : NaN);
const f1 = (x) => x.toFixed(1);
const geh = (m, c) => (m + c > 0 ? Math.sqrt((2 * (m - c) ** 2) / (m + c)) : 0);
// the heads of the run's links that are also the tail of another link of the run (tools/lib/share-targets.ts interiorNodes)
const interior = (links) => { const tails = new Set(links.map((i) => net.links[i].from)); return [...new Set(links.map((i) => net.links[i].to).filter((n) => tails.has(n)))].sort((a, b) => a - b); };
const files = (dir) => fs.readdirSync(dir).filter((f) => f.startsWith(`sod-${period}-`) && f.endsWith('.json')).sort((a, b) => a.match(/-(\d+)\.json$/)[1] - b.match(/-(\d+)\.json$/)[1]);
const runs = sets.map(([label, dir]) => [label, files(dir).map((f) => JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8')))]);
const rows = [];
console.log(`## Trips that ended along the street, ${period} (seed mean over the runs of each demand, standard error)\n`);
console.log(`| Run | Target | ${runs.map(([l, rs]) => `${l} (${rs.length} seeds)`).join(' | ')} |\n| --- | --- | ${runs.map(() => '---').join(' | ')} |`);
for (const t of targets) {
  const target = t.endAlongVehPerHour?.[period];
  if (!(target > 0)) continue;
  const label = `${t.street} ${t.direction}`;
  const cells = runs.map(([, rs]) => {
    const per = rs.map((r) => {
      const b = r.blocks.find((x) => x.label === label);
      if (!b) throw new Error(`no block ${label} in the seed ${r.seed} file`);
      const nodes = new Set(interior(b.links)), perH = 60 / r.minutes;
      let hit = 0, end = 0;
      for (const [, d, n] of b.trips) { hit += n * perH; if (nodes.has(d)) end += n * perH; }
      return { hit, end, nodes: [...nodes], byNode: b.trips.filter(([, d]) => nodes.has(d)).reduce((m, [, d, n]) => m.set(d, (m.get(d) ?? 0) + n * perH), new Map()) };
    });
    return { per, end: per.map((x) => x.end), hit: per.map((x) => x.hit) };
  });
  rows.push([label, target, cells]);
  console.log(`| ${label} | ${target} | ${cells.map((c) => `${f1(mean(c.end))} (se ${f1(se(c.end))}), GEH ${f1(geh(mean(c.end), target))}; all trips on the run ${f1(mean(c.hit))}`).join(' | ')} |`);
}
for (const [label, , cells] of rows) {
  console.log(`\n### ${label}: where the trips end (cars an hour, seed mean)\n\n| Node | ${runs.map(([l]) => l).join(' | ')} |\n| --- | ${runs.map(() => '---').join(' | ')} |`);
  const nodes = [...new Set(cells.flatMap((c) => c.per.flatMap((x) => x.nodes)))].sort((a, b) => a - b);
  for (const n of nodes) console.log(`| ${n} | ${cells.map((c) => f1(mean(c.per.map((x) => x.byNode.get(n) ?? 0)))).join(' | ')} |`);
}
