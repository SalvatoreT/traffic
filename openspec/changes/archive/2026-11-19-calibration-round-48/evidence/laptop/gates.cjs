// Round 48: gates of the network with and without a count target (a gate station in the stations file, or a gate whose count the fit report
// says is already another station), and their PM origin and destination totals (car veh/h) in the baseline and the final shipped demand.
const fs = require('fs');
const P = process.argv[2] ?? 'pm_peak';
const net = JSON.parse(fs.readFileSync('target/r48/network.base.json', 'utf8'));
const st = JSON.parse(fs.readFileSync('target/r48/stations.base.json', 'utf8')).stations;
const fit = fs.readFileSync('openspec/changes/calibration-round-48/evidence/fit/rockridge.fit.md', 'utf8');
const counted = {}; // node -> {in: why, out: why}
const mark = (n, dir, why) => { counted[n] ??= {}; counted[n][dir] = why; };
for (const s of st) if (s.kind === 'gate') { const m = s.id.match(/^gate (\d+) (in|out)$/); mark(+m[1], m[2], `gate station (${s.source})`); }
for (const l of fit.split('\n')) { const m = l.match(/^- gates? ([\d +]+) .*? (entering|leaving): dropped, its count \((.+?)\) is already the station (.+?);/); if (!m) continue; for (const n of m[1].split('+').map((x) => +x.trim())) mark(n, m[2] === 'entering' ? 'in' : 'out', `via ${m[4].replace(/ \(.*$/, '')}`); }
const mw = new Set(); for (const l of net.links) if (l.class === 'motorway') { mw.add(l.from); mw.add(l.to); }
const name = (n) => [...new Set(net.links.filter((l) => (l.from === n || l.to === n) && l.name).map((l) => l.name))].join(' / ') || '(unnamed)';
const tot = (file) => { const d = JSON.parse(fs.readFileSync(file, 'utf8')); const fl = d.periods.find((x) => x.id === P).flows; const o = {}, de = {}; for (const f of fl) { o[f.origin] = (o[f.origin] ?? 0) + f.vehPerHour; de[f.destination] = (de[f.destination] ?? 0) + f.vehPerHour; } return { o, de }; };
const b = tot('target/r48/demand.base.json'), c = tot('target/r48/demand.cand.json');
const rows = [];
for (const n of net.nodes.filter((x) => x.gate)) {
  const r = { n: n.id, name: name(n.id), mainline: mw.has(n.id), canIn: n.canEnter, canOut: n.canExit, ob: b.o[n.id] ?? 0, oc: c.o[n.id] ?? 0, db: b.de[n.id] ?? 0, dc: c.de[n.id] ?? 0, cin: counted[n.id]?.in, cout: counted[n.id]?.out };
  rows.push(r);
}
const f0 = (x) => Math.round(x).toString();
const fd = (x) => (x >= 0 ? '+' : '') + Math.round(x);
const sum = (rs, k) => rs.reduce((a, r) => a + r[k], 0);
const groups = { 'no count either direction': rows.filter((r) => !r.cin && !r.cout), 'counted one direction only': rows.filter((r) => !!r.cin !== !!r.cout), 'counted both directions': rows.filter((r) => r.cin && r.cout) };
console.log(`GATES, ${P}, shipped demand, car veh/h: baseline 9cdebdabf05c -> final 1771a9c4a519. ${rows.length} gate nodes; counted = a gate station, or the fit report's "dropped, its count is already the station" note.`);
console.log('\n| Group | Gates | Origin base | Origin final | Change | Destination base | Destination final | Change |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const [g, rs] of Object.entries(groups)) console.log(`| ${g} | ${rs.length} | ${f0(sum(rs, 'ob'))} | ${f0(sum(rs, 'oc'))} | ${fd(sum(rs, 'oc') - sum(rs, 'ob'))} | ${f0(sum(rs, 'db'))} | ${f0(sum(rs, 'dc'))} | ${fd(sum(rs, 'dc') - sum(rs, 'db'))} |`);
console.log(`| all gates | ${rows.length} | ${f0(sum(rows, 'ob'))} | ${f0(sum(rows, 'oc'))} | ${fd(sum(rows, 'oc') - sum(rows, 'ob'))} | ${f0(sum(rows, 'db'))} | ${f0(sum(rows, 'dc'))} | ${fd(sum(rows, 'dc') - sum(rows, 'db'))} |`);
const show = (title, rs) => {
  console.log(`\n${title}`);
  console.log('| Node | Street | Kind | Origin base | Origin final | Change | Destination base | Destination final | Change | Counted |');
  console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of rs.sort((a, z) => Math.abs(z.oc - z.ob) + Math.abs(z.dc - z.db) - Math.abs(a.oc - a.ob) - Math.abs(a.dc - a.db))) {
    if (r.ob + r.oc + r.db + r.dc < 0.5) continue;
    console.log(`| ${r.n} | ${r.name} | ${r.mainline ? 'freeway mainline' : 'surface'} | ${r.canIn ? f0(r.ob) : '-'} | ${r.canIn ? f0(r.oc) : '-'} | ${r.canIn ? fd(r.oc - r.ob) : ''} | ${r.canOut ? f0(r.db) : '-'} | ${r.canOut ? f0(r.dc) : '-'} | ${r.canOut ? fd(r.dc - r.db) : ''} | ${[r.cin && `in: ${r.cin}`, r.cout && `out: ${r.cout}`].filter(Boolean).join('; ') || 'none'} |`);
  }
};
show('GATES WITHOUT A COUNT TARGET IN EITHER DIRECTION (largest change first; gates with nothing in either demand left out)', groups['no count either direction']);
show('GATES COUNTED IN ONE DIRECTION ONLY', groups['counted one direction only']);
show('GATES COUNTED IN BOTH DIRECTIONS', groups['counted both directions']);
