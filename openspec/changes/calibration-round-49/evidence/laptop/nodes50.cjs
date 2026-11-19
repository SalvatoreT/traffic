// Round 49, for the round 50 design: non-gate origin and destination nodes that gained car trips (final shipped demand vs baseline),
// and where the local flow type's growth lies (study area or outside). Flow types as tools/build-demand.ts typeOf: ramp touches a
// freeway gate (a gate on a motorway link), through is gate to gate, local is the rest.
const fs = require('fs');
const net = JSON.parse(fs.readFileSync('target/r49/network.base.json', 'utf8'));
const node = new Map(net.nodes.map((n) => [n.id, n]));
const mw = new Set(); for (const l of net.links) if (l.class === 'motorway') { mw.add(l.from); mw.add(l.to); }
const isGate = (n) => !!node.get(n)?.gate, isFw = (n) => isGate(n) && mw.has(n), inSA = (n) => !!node.get(n)?.inStudyArea;
const name = (n) => [...new Set(net.links.filter((l) => (l.from === n || l.to === n) && l.name).map((l) => l.name))].join(' / ') || '(unnamed)';
const type = (o, d) => (isFw(o) || isFw(d) ? 'ramp' : isGate(o) && isGate(d) ? 'through' : 'local');
const load = (f, p) => JSON.parse(fs.readFileSync(f, 'utf8')).periods.find((x) => x.id === p).flows.filter((q) => !q.mode);
const f0 = (x) => Math.round(x).toString(), fd = (x) => (x >= 0 ? '+' : '') + Math.round(x);
const view = process.argv[2] ?? 'shipped';
const [fb, fc] = view === 'shipped' ? ['target/r49/demand.base.json', 'target/r49/demand.cand.json'] : ['target/r49/demand.base.cv.json', 'target/r49/demand.cand.cv.json'];
for (const p of ['pm_peak', 'am_peak']) {
  const B = load(fb, p), C = load(fc, p);
  const tt = (fl) => { const t = { through: 0, local: 0, ramp: 0 }; for (const q of fl) t[type(q.origin, q.destination)] += q.vehPerHour; return t; };
  const tb = tt(B), tc = tt(C);
  console.log(`\n## ${p}, ${view} view (car veh/h, baseline -> final)\n`);
  console.log(`Flow types (check against the fit report): through ${f0(tb.through)} -> ${f0(tc.through)}, local ${f0(tb.local)} -> ${f0(tc.local)} (${fd(tc.local - tb.local)}), ramp ${f0(tb.ramp)} -> ${f0(tc.ramp)}.`);
  const tot = (fl) => { const o = new Map(), d = new Map(); for (const q of fl) { o.set(q.origin, (o.get(q.origin) ?? 0) + q.vehPerHour); d.set(q.destination, (d.get(q.destination) ?? 0) + q.vehPerHour); } return { o, d }; };
  const b = tot(B), c = tot(C);
  for (const [k, lab] of [['o', 'origin'], ['d', 'destination']]) {
    const ids = new Set([...b[k].keys(), ...c[k].keys()].filter((n) => !isGate(n)));
    const rows = [...ids].map((n) => ({ n, b: b[k].get(n) ?? 0, c: c[k].get(n) ?? 0 })).map((r) => ({ ...r, g: r.c - r.b }));
    const inS = rows.filter((r) => inSA(r.n)), out = rows.filter((r) => !inSA(r.n)), s = (rs, f) => rs.reduce((a, r) => a + r[f], 0);
    console.log(`\nNon-gate ${lab} nodes: ${rows.length}; total ${f0(s(rows, 'b'))} -> ${f0(s(rows, 'c'))} (${fd(s(rows, 'g'))}); in the study area ${inS.length} nodes ${f0(s(inS, 'b'))} -> ${f0(s(inS, 'c'))} (${fd(s(inS, 'g'))}); outside ${out.length} nodes ${f0(s(out, 'b'))} -> ${f0(s(out, 'c'))} (${fd(s(out, 'g'))}).`);
    console.log(`\nTop 15 non-gate ${lab} nodes by gain:\n\n| Node | Street | Study area | Baseline | Final | Change |\n| --- | --- | --- | --- | --- | --- |`);
    for (const r of rows.sort((x, y) => y.g - x.g).slice(0, 15)) console.log(`| ${r.n} | ${name(r.n)} | ${inSA(r.n) ? 'in' : 'out'} | ${f0(r.b)} | ${f0(r.c)} | ${fd(r.g)} |`);
  }
  // Local flow growth by where its ends are: gate or non-gate, and for non-gate ends, in or outside the study area.
  const cat = (o, d) => { const e = (n) => (isGate(n) ? 'gate' : inSA(n) ? 'in' : 'out'); return `${e(o)} -> ${e(d)}`; };
  const acc = new Map();
  for (const [fl, sgn] of [[B, -1], [C, 1]]) for (const q of fl) { if (type(q.origin, q.destination) !== 'local') continue; const k = cat(q.origin, q.destination); acc.set(k, (acc.get(k) ?? 0) + sgn * q.vehPerHour); }
  const base = new Map(); for (const q of B) { if (type(q.origin, q.destination) !== 'local') continue; const k = cat(q.origin, q.destination); base.set(k, (base.get(k) ?? 0) + q.vehPerHour); }
  console.log(`\nLocal flows by their ends (gate, non-gate in the study area "in", non-gate outside "out"):\n\n| Ends | Baseline | Change |\n| --- | --- | --- |`);
  for (const [k, v] of [...acc.entries()].sort((x, y) => y[1] - x[1])) console.log(`| ${k} | ${f0(base.get(k) ?? 0)} | ${fd(v)} |`);
}
