// Round 53 (design D6): car trip ends (veh/h, origins and destinations) at the interior nodes of the Colby Street and Hillegass Avenue runs, per demand file.
// Colby Street interior nodes 786, 793, 799, 819, 828, 1070, 1071 (819, 1071 and 793 are the upper ones); Hillegass Avenue 1085, 1086, 1090. Read-only; prints Markdown.
// usage: node node-ends.cjs <period> <label>=<demand.json> [<label>=<demand.json> ...] [--nodes 1,2,3]
const fs = require('fs');
const argv = process.argv.slice(2);
const ni = argv.indexOf('--nodes');
const nodes = ni >= 0 ? argv.splice(ni, 2)[1].split(',').map(Number) : [819, 1071, 793, 786, 1070, 799, 828, 1085, 1086, 1090];
const [period, ...args] = argv;
if (!period || !args.length) { console.error('usage: node node-ends.cjs <period> <label>=<demand.json> ... [--nodes a,b]'); process.exit(2); }
const sets = args.map((a) => { const i = a.indexOf('='); const d = JSON.parse(fs.readFileSync(a.slice(i + 1), 'utf8')); return [a.slice(0, i), d.periods.find((p) => p.id === period)]; });
for (const [l, p] of sets) if (!p) throw new Error(`${l} has no period ${period}`);
const ends = (p) => { const o = {}, d = {}; for (const f of p.flows.filter((q) => !q.mode)) { o[f.origin] = (o[f.origin] ?? 0) + f.vehPerHour; d[f.destination] = (d[f.destination] ?? 0) + f.vehPerHour; } return { o, d }; };
const E = sets.map(([l, p]) => [l, ends(p)]);
console.log(`## Car trip ends at the interior nodes of the Colby Street and Hillegass Avenue runs, ${period} (veh/h)\n`);
console.log(`| Node | ${E.map(([l]) => `${l} origins | ${l} destinations`).join(' | ')} |\n| --- | ${E.map(() => '--- | ---').join(' | ')} |`);
for (const n of nodes) console.log(`| ${n} | ${E.map(([, e]) => `${(e.o[n] ?? 0).toFixed(1)} | ${(e.d[n] ?? 0).toFixed(1)}`).join(' | ')} |`);
const sum = (e, k) => nodes.reduce((a, n) => a + (e[k][n] ?? 0), 0);
console.log(`| all of these | ${E.map(([, e]) => `${sum(e, 'o').toFixed(1)} | ${sum(e, 'd').toFixed(1)}`).join(' | ')} |`);
console.log(`\nOffered car demand: ${sets.map(([l, p]) => `${l} ${Math.round(p.flows.filter((q) => !q.mode).reduce((a, f) => a + f.vehPerHour, 0))} veh/h`).join('; ')}`);
