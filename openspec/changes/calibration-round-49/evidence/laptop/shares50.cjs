// Round 49, for the round 50 design: numerators and denominators of the PM southbound shares and the whole-street traversals,
// ten-seed means from the per-seed calibrate reports (60-minute runs at scale 1, so trips per run read as cars per hour).
const fs = require('fs');
const sets = [['baseline', 'target/assess-seeds/60r47-base'], ['candidate', 'target/assess-seeds/60r49'], ['baseline cv', 'target/assess-seeds/60r47-base-cv'], ['candidate cv', 'target/assess-seeds/60r49-cv']];
const p = process.argv[2] ?? 'pm_peak';
const blocks = ['Hillegass Avenue SB', 'Colby Street SB', 'Hillegass Avenue NB', 'Colby Street NB'];
const m = (a) => a.reduce((x, y) => x + y, 0) / a.length, f1 = (x) => x.toFixed(1);
const J = (dir, s) => JSON.parse(fs.readFileSync(`${dir}/rockridge-${p}-s1-seed${s}.json`, 'utf8'));
console.log(`Check: minutes ${J(sets[0][1], 1).minutes}, scale ${J(sets[0][1], 1).scale}`);
console.log(`\n## Shares, ${p} (ten-seed means; n = trips on the block's links in the run; hits = n x share)\n\n| Block | Side | Via | Observed | Set | n | hits | share (mean of seeds) |\n| --- | --- | --- | --- | --- | --- | --- | --- |`);
for (const b of blocks) {
  const rows0 = J(sets[0][1], 1).shares.filter((r) => r.block === b);
  for (const r0 of rows0) for (const [name, dir] of sets) {
    const v = []; for (let s = 1; s <= 10; s++) { const r = J(dir, s).shares.find((x) => x.block === b && x.side === r0.side && x.via === r0.via); v.push(r); }
    const obs = p === 'pm_peak' && r0.observedPm != null ? r0.observedPm : r0.observed;
    console.log(`| ${b} | ${r0.side} | ${r0.via}${r0.headline ? ' (headline)' : ''} | ${obs} | ${name} | ${f1(m(v.map((r) => r.n)))} | ${f1(m(v.map((r) => r.n * r.modelled)))} | ${f1(100 * m(v.map((r) => r.modelled)))}% |`);
  }
}
console.log(`\n## Whole-street check, ${p} (ten-seed means)\n\n| Block | Set | Observed whole street | Modeled whole street | Through trips on any link | Freeway trips on any link | Observed block veh/h |\n| --- | --- | --- | --- | --- | --- | --- |`);
for (const b of blocks) for (const [name, dir] of sets) {
  const v = []; for (let s = 1; s <= 10; s++) v.push(J(dir, s).throughCheck.find((x) => x.block === b));
  console.log(`| ${b} | ${name} | ${v[0].observedWholeStreet} | ${f1(m(v.map((r) => r.modeledWholeStreet)))} | ${f1(m(v.map((r) => r.modeledThrough)))} | ${f1(m(v.map((r) => r.modeledFreewayTrips)))} | ${v[0].observedVehPerHour} |`);
}
