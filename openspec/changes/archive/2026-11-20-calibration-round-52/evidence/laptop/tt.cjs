// Print the arterial travel-time rows (Shattuck, Telegraph, College) of the am_peak and pm_peak sections of one or more assessment files.
// Usage: node target/r46/tt.cjs name=path.md [name=path.md ...]
const fs = require('fs');
for (const arg of process.argv.slice(2)) {
  const [name, file] = arg.split('=');
  let period = null, on = false, header = null;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const h = line.match(/^## (am_peak|pm_peak|midday)\b/); if (h) { period = h[1]; on = false; continue; }
    if (line.startsWith('Arterial travel times')) { on = true; continue; }
    if (!on || period === 'midday') continue;
    if (line.startsWith('| ---')) continue;
    if (!line.startsWith('|')) { if (header) on = line.trim() === '' ? on : false; continue; }
    if (/^\| (Segment|Arterial|Street|Route)/.test(line)) { if (!header) { header = line; console.log(`| Set | Period ${line}`); console.log('| --- | --- ' + line.replace(/[^|]+\|/g, '--- |').replace(/^\|/, '|')); } continue; }
    console.log(`| ${name} | ${period} ${line}`);
  }
}
