// Round 53 (design D6): each end-along target against the fit's own figure, per build, read from the "End along" lines of the fit reports
// (a pass's report is kept by the loop under target/membership-loop/fits/<step id>/rockridge.fit.md). Read-only; prints Markdown.
// A build without membership (pass 0) has no such line: it shows "-". "Static routes" is the same figure on the static route shares at the same volumes.
// usage: node end-along-lines.cjs <period> <label>=<fit report> [<label>=<fit report> ...]
const fs = require('fs');
const [period, ...args] = process.argv.slice(2);
if (!period || !args.length) { console.error('usage: node end-along-lines.cjs <period> <label>=<fit.md> ...'); process.exit(2); }
const reports = args.map((a) => { const i = a.indexOf('='); return [a.slice(0, i), fs.readFileSync(a.slice(i + 1), 'utf8')]; });
const re = new RegExp(`^End along ${period} (.+?): (simulated|static); target (\\S+); weight (\\S+); offered (\\S+) \\(static routes (\\S+)\\); after fit (\\S+) \\(static routes (\\S+)\\); final (\\S+) \\(static routes (\\S+)\\); (\\d+) flows; (\\d+) nodes \\(([\\d ]*)\\)\\.$`, 'gm');
const parsed = reports.map(([l, t]) => [l, new Map([...t.matchAll(re)].map((m) => [m[1], m]))]);
const labels = [...new Set(parsed.flatMap(([, m]) => [...m.keys()]))];
console.log(`## End-along targets, ${period}: target, then per build offered / after the count-only fit / final (the same on static routes in brackets)\n`);
console.log(`| Run | Target | ${parsed.map(([l]) => l).join(' | ')} |\n| --- | --- | ${parsed.map(() => '---').join(' | ')} |`);
for (const lab of labels) {
  const any = parsed.map(([, m]) => m.get(lab)).find(Boolean);
  console.log(`| ${lab} | ${any[3]} | ${parsed.map(([, m]) => { const x = m.get(lab); return x ? `${x[2]}: ${x[5]} / ${x[7]} / ${x[9]} (${x[6]} / ${x[8]} / ${x[10]}), ${x[11]} flows` : '-'; }).join(' | ')} |`);
}
const nodes = parsed.map(([, m]) => m.values().next().value).find(Boolean);
if (nodes) console.log(`\nInterior nodes counted: ${labels.map((lab) => `${lab} ${(parsed.map(([, m]) => m.get(lab)).find(Boolean)[13] || '').trim()}`).join('; ')}.`);
