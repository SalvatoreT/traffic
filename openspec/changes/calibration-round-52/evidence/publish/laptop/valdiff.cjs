// After validate: is the change to data/calibration/validation.{json,md} the simulator revision alone? Prints a summary; exit 1 if anything else differs.
const { execSync } = require('child_process');
const fs = require('fs');
const old = JSON.parse(execSync('git show HEAD:data/calibration/validation.json', { encoding: 'utf8' }));
const cur = JSON.parse(fs.readFileSync('data/calibration/validation.json', 'utf8'));
const diffs = [];
const walk = (a, b, p) => {
  if (a && b && typeof a === 'object' && typeof b === 'object') { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], p ? `${p}.${k}` : k); return; }
  if (JSON.stringify(a) !== JSON.stringify(b)) diffs.push({ p, a, b });
};
walk(old, cur, '');
const allowed = (p) => /^manifest\.simulator\.(revision)$/.test(p);
const bad = diffs.filter((d) => !allowed(d.p));
const md = execSync('git diff --unified=0 -- data/calibration/validation.md', { encoding: 'utf8' }).split('\n').filter((l) => /^[-+]/.test(l) && !/^(---|\+\+\+) /.test(l));
console.log(`validation.json differing paths: ${diffs.map((d) => `${d.p} ${JSON.stringify(d.a)} -> ${JSON.stringify(d.b)}`).join('; ') || 'none'}`);
console.log(`validation.md changed lines: ${md.length}`);
for (const l of md.slice(0, 20)) console.log(`  ${l.slice(0, 200)}`);
if (bad.length || md.length) { console.log(`VALIDATION DIFF NOT REVISION-ONLY: ${bad.map((d) => d.p).join(', ')}${md.length ? ' validation.md' : ''}`); process.exit(1); }
console.log('VALIDATION DIFF REVISION-ONLY');
