// Diagnostic only (router-diagnosis): score one-seed PM runs the way the audit did.
// usage: tsx tools/diag/router-score.ts <runs-dir-prefix> [more prefixes...]   (prefix has _ship and _cv directories)
import { readFileSync } from 'node:fs';
import { readSeeds, scoreStations, shareStats, type StationFile } from '../lib/assess';
const area = 'rockridge', p = 'pm_peak';
const stations: StationFile = JSON.parse(readFileSync(`data/demand/${area}.stations.json`, 'utf8'));
const rec = JSON.parse(readFileSync(`data/demand/${area}.config.json`, 'utf8')).countFit.recency;
const DIAG: Record<string, string> = { '2697': 'Forest EB', '1933': 'McAuley EB H-C(h)', '1868': '60th EB H-C(h)', '1831': 'Ayala NB M-H(h)', '2055': 'Howell SB 59-McA', '1870': '60th EB C-T', '1935': 'McAuley EB C-T', '2057': 'Howell SB McA-60', '1931': 'McAuley EB A-H', '2801': 'Ayala SB F-McA', '1832': 'Ayala SB M-H(h)' };
const COLBY_NB = ['2591', '2593', '2595', '2597', '2599', '2605'];
const OTHER: Record<string, string> = { 'Dana SB 63-N': '1925', 'Dana SB N-Alc': '1927', 'Canning NB 62-63': '1904', 'Canning NB McA-60': '1898' };
for (const pref of process.argv.slice(2)) {
  const ship = scoreStations(readSeeds(`${pref}_ship`, area, p, [1]), stations, p).cases as any[];
  const cvm = new Map((scoreStations(readSeeds(`${pref}_cv`, area, p, [1]), stations, p).cases as any[]).map((c) => [c.stationId, c]));
  const t: Record<string, [number, number]> = {};
  const by = new Map<string, any>();
  for (const c of ship) {
    const j = c.held ? cvm.get(c.stationId) : c;
    by.set(String(c.stationId).replace('count block ', ''), j);
    const recent = !c.derived && c.year != null && rec.referenceYear - c.year <= rec.recentYears;
    const k = `${recent ? 'recent' : 'older'}-${c.held ? 'held' : 'fit'}`;
    t[k] ??= [0, 0]; t[k][1]++; if (j.gehOk) t[k][0]++;
  }
  const g = (id: string) => { const j = by.get(id); return j ? `${Math.round(j.modeled)}/${Math.round(j.counted)}` : '?'; };
  const run = readSeeds(`${pref}_ship`, area, p, [1])[0] as any;
  const head = shareStats([run], true).filter((q: any) => q.headline).map((q: any) => `${q.block} ${q.side} ${Math.round(100 * q.mean)}(${Math.round(100 * (q.observedPm ?? q.observed))})`);
  console.log(`== ${pref.split('/').pop()}`);
  console.log(' pass fit/held (recent):', JSON.stringify(t['recent-fit']), JSON.stringify(t['recent-held']), ' older', JSON.stringify(t['older-fit']), JSON.stringify(t['older-held']));
  console.log(' diag sim/count:', Object.entries(DIAG).map(([id, n]) => `${n} ${g(id)}`).join('; '));
  const cn = COLBY_NB.map((id) => by.get(id)).filter(Boolean);
  const cs = cn.reduce((a, j) => a + j.modeled, 0), cc = cn.reduce((a, j) => a + j.counted, 0);
  console.log(` Colby NB (6 blocks) sim/count ${Math.round(cs)}/${Math.round(cc)} = ${(cs / cc).toFixed(2)}; others:`, Object.entries(OTHER).map(([n, id]) => `${n} ${g(id)}`).join('; '));
  const d5ids = ['2697', '1933', '1868', '1831', '2055'];
  console.log(` DIAG5 sum sim/count ${Math.round(d5ids.reduce((a, id) => a + by.get(id).modeled, 0))}/${Math.round(d5ids.reduce((a, id) => a + by.get(id).counted, 0))}`);
  console.log(' D5 shares model(obs):', head.join('; '));
  console.log(' health: completed', Math.round(run.health.completed), 'backlog%', run.health.backlogPct?.toFixed?.(1), 'arterial speed', run.health.arterialMeanSpeed?.toFixed?.(2));
}
