// Numerators and denominators of the southbound route shares and the whole-street traversals, ten-seed means from the per-seed calibrate reports
// (60-minute runs at scale 1, so trips per run read as cars per hour). Read-only; prints Markdown.
// usage: node shares.cjs <period> <label=dir> [<label=dir> ...]     (dir holds rockridge-<period>-s1-seed<N>.json for N = 1 to 10)
// Round 50, PM: node openspec/changes/archive/2026-11-19-calibration-round-50/scripts/shares.cjs pm_peak baseline=target/assess-seeds/60r47-base candidate=target/assess-seeds/60r50 'baseline cv=target/assess-seeds/60r47-base-cv' 'candidate cv=target/assess-seeds/60r50-cv'
const fs = require('fs');
const [p = 'pm_peak', ...args] = process.argv.slice(2);
if (!args.length) { console.error('usage: node shares.cjs <period> <label=dir> [<label=dir> ...]'); process.exit(2); }
const sets = args.map((a) => { const i = a.indexOf('='); return [a.slice(0, i), a.slice(i + 1)]; });
const blocks = ['Hillegass Avenue SB', 'Colby Street SB', 'Hillegass Avenue NB', 'Colby Street NB'];
const m = (a) => a.reduce((x, y) => x + y, 0) / a.length, f1 = (x) => x.toFixed(1);
const J = (dir, s) => JSON.parse(fs.readFileSync(`${dir}/rockridge-${p}-s1-seed${s}.json`, 'utf8'));
console.log(`Check: minutes ${J(sets[0][1], 1).minutes}, scale ${J(sets[0][1], 1).scale}`);
console.log(`\n## Shares, ${p} (ten-seed means; n = trips on the block's links in the run; hits = n x share)\n\n| Block | Side | Via | Observed | Set | n | hits | share (mean of seeds) |\n| --- | --- | --- | --- | --- | --- | --- | --- |`);
const toFreeway = [];
for (const b of blocks) {
  const rows0 = J(sets[0][1], 1).shares.filter((r) => r.block === b);
  for (const r0 of rows0) for (const [name, dir] of sets) {
    const v = []; for (let s = 1; s <= 10; s++) { const r = J(dir, s).shares.find((x) => x.block === b && x.side === r0.side && x.via === r0.via); v.push(r); }
    const obs = p === 'pm_peak' && r0.observedPm != null ? r0.observedPm : r0.observed;
    const n = m(v.map((r) => r.n)), hits = m(v.map((r) => r.n * r.modelled));
    console.log(`| ${b} | ${r0.side} | ${r0.via}${r0.headline ? ' (headline)' : ''} | ${obs} | ${name} | ${f1(n)} | ${f1(hits)} | ${f1(100 * m(v.map((r) => r.modelled)))}% |`);
    if (r0.side === 'to' && r0.via === 'freeway') toFreeway.push({ b, name, n, hits });
  }
}
console.log(`\n## To-freeway shares of the southbound blocks, ${p} (cars per hour, ten-seed means)\n\n| Block | Set | To freeway | Not to freeway | All cars on the block |\n| --- | --- | --- | --- | --- |`);
for (const r of toFreeway.filter((x) => /SB$/.test(x.b))) console.log(`| ${r.b} | ${r.name} | ${f1(r.hits)} | ${f1(r.n - r.hits)} | ${f1(r.n)} |`);
console.log(`\n## Whole-street check, ${p} (ten-seed means)\n\n| Block | Set | Observed whole street | Modeled whole street | Through trips on any link | Freeway trips on any link | Observed block veh/h |\n| --- | --- | --- | --- | --- | --- | --- |`);
for (const b of blocks) for (const [name, dir] of sets) {
  const v = []; for (let s = 1; s <= 10; s++) v.push(J(dir, s).throughCheck.find((x) => x.block === b));
  console.log(`| ${b} | ${name} | ${v[0].observedWholeStreet} | ${f1(m(v.map((r) => r.modeledWholeStreet)))} | ${f1(m(v.map((r) => r.modeledThrough)))} | ${f1(m(v.map((r) => r.modeledFreewayTrips)))} | ${v[0].observedVehPerHour} |`);
}
