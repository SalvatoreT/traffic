// Audit probe. Run from the repository root with node --import tsx.
// Reads project inputs; synthetic assessment outputs stay in a fresh temp directory.
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, copyFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { countStations, overlapsHeld } from '../../../tools/lib/volunteer-count.ts';
import { readSeeds } from '../../../tools/lib/assess.ts';

const root = resolve(fileURLToPath(new URL('../../..', import.meta.url)));
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const stations = read('data/demand/rockridge.stations.json').stations;
const cfg = read('data/demand/rockridge.config.json');
const net = read('public/data/rockridge.network.json');
for (const p of ['public/data/rockridge.network.json', 'data/demand/rockridge.stations.json', 'data/demand/rockridge.config.json']) console.log('SHA256', p, createHash('sha256').update(readFileSync(join(root, p))).digest('hex'));
console.log('Directional pairs from one source observation:');
for (const s of stations.filter((s) => /^caltrans (ashby|tunnel|sanpablo)/.test(s.id) || /^gate 265 /.test(s.id))) {
  console.log(s.id, JSON.stringify({ held: s.held, pm: s.target.pm_peak }));
}
const vc = cfg.volunteerCount;
const counted = countStations(read(vc.file), net, vc, vc.periods, Object.fromEntries(Object.entries(cfg.periodFactors).map(([p, v]) => [p, v.volume])));
const held = new Set(counted.stations.filter((s) => s.family === 'block' && s.held).map((s) => s.links[0]));
const links = new Map(net.links.map((l) => [l.id, l]));
console.log('Whole-street spatial dependencies (street path, not every path the feature may match):');
for (const s of counted.stations.filter((s) => s.family === 'route')) {
  const first = links.get(s.feature.first), last = links.get(s.feature.last);
  const queue = [[first.to, [first.id]]], seen = new Set();
  let path = [];
  while (queue.length) {
    const [node, prefix] = queue.shift();
    if (node === last.from) { path = [...prefix, last.id]; break; }
    if (seen.has(node)) continue;
    seen.add(node);
    for (const l of net.links) if (l.name === first.name && l.from === node) queue.push([l.to, [...prefix, l.id]]);
  }
  console.log(s.id, JSON.stringify({ excludedByEndpoints: (s.touches ?? []).some((l) => held.has(l)), excludedBySupport: overlapsHeld(s, held), heldOnStreetPath: path.filter((l) => held.has(l)) }));
}

const seeds = Array.from({ length: 10 }, (_, i) => i + 1);
const source = join(root, 'data/calibration/reports');
console.log('Seeds requested:', seeds, 'loaded from checked-in reports:', readSeeds(source, 'rockridge', 'pm_peak', seeds).map((r) => r.seed));

const temp = mkdtempSync(join(tmpdir(), 'traffic-assessment-audit-'));
mkdirSync(join(temp, 'tools'));
mkdirSync(join(temp, 'data/calibration'), { recursive: true });
mkdirSync(join(temp, 'reuse'));
copyFileSync(join(root, 'tools/assess.ts'), join(temp, 'tools/assess.ts'));
writeFileSync(join(temp, 'package.json'), '{"type":"module"}\n');
for (const p of ['tools/lib', 'node_modules', 'data/demand', 'data/areas', 'public']) symlinkSync(join(root, p), join(temp, p), 'dir');
copyFileSync(join(root, 'data/calibration/rockridge.targets.json'), join(temp, 'data/calibration/rockridge.targets.json'));
const run = read('data/calibration/reports/rockridge-pm_peak-s1-seed1.json');
run.health.gridlockRemoved = 9999;
writeFileSync(join(temp, 'reuse/rockridge-pm_peak-s1-seed1.json'), JSON.stringify(run));
// After the fix the reused run set is rejected (exit 3, missing seeds named); a diagnostic reports one sample and no verdict.
const base = ['--import', 'tsx', join(temp, 'tools/assess.ts'), '--periods', 'pm_peak', '--reuse', join(temp, 'reuse'), '--suffix', 'audit'];
const result = spawnSync(process.execPath, [...base], { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
console.log('Synthetic reuse probe exit:', result.status, '(3 = rejected, nothing written)');
for (const line of (result.stderr ?? '').split('\n')) if (/assess:|pm_peak/.test(line)) console.log(line);
const diag = spawnSync(process.execPath, [...base, '--diagnostic'], { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
console.log('Diagnostic probe exit:', diag.status);
const output = diag.status === 0 ? readFileSync(join(temp, 'data/calibration/rockridge.assessment-audit.md'), 'utf8') : (diag.stdout ?? '') + (diag.stderr ?? '');
writeFileSync(join(temp, 'output.txt'), output);
for (const line of output.split('\n')) if (/DIAGNOSTIC OUTPUT|Stability rule \(D16\):|Suggested status|No status is suggested/.test(line)) console.log(line.slice(0, 220));
