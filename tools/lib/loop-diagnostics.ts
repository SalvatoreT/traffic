// Per-pass diagnostics of the membership loop (calibration round 55). Report only: nothing here feeds a build, a pool or the stop rule. No I/O.
// The simulated figure of a station is the loop's own select-link export (trips counted at the station's detectors, mean over the pass's seeds), which can differ slightly
// from the assessment's link flow; the counts within GEH 5 are therefore a progress signal, and the ten-seed assessment stays the judge.
import { GEH_GOOD, geh } from './acceptance';
import { isDerivedTarget } from './derived-targets';
import { exportOf, iterationStats, type StationRec } from './membership-loop';
import type { SelectOd } from './through-membership';

export interface StationInfo extends StationRec { label?: string; year?: number | null; derived?: string[] }
export interface WatchEntry { id: string; period: string; note?: string }
/** Stations to follow pass by pass, named by id in a data file (the study area's, not the code's): the judged held-out misses and a group whose simulated sum is compared with its counted sum. */
export interface WatchFile { heldOutMisses: WatchEntry[]; diagonal: WatchEntry[] }
export interface Recency { referenceYear: number; recentYears: number }

export interface GehTally { n: number; ok: number; unmeasured: number }
export interface WatchRow { group: 'held-out miss' | 'diagonal'; id: string; label: string; period: string; counted: number; /** The shipped fit's final value for the station, when the view's fit report lists it. */ fit: number | null; /** Seed mean of the pass's own runs, or null when the runs did not export the station. */ sim: number | null }
export interface PassDiag { pass: number; view: string; period: string; /** Recent judged stations within GEH 5 on this pass's seeds: the fitted side in the shipped view, the held-out side in the training view. Null without a recency rule. */ geh: GehTally | null; watch: WatchRow[] }

const num = (x: string): number | null => { const v = Number(x.replace(/,/g, '')); return x.trim() !== '' && Number.isFinite(v) ? v : null; };

/** Target and final value per station label, from a fit report's station table (columns Station, Basis, Target, Assigned before, Ratio, After fit, Ratio, Final). */
export function fitFinalsFromReport(text: string): Map<string, { target: number; final: number }> {
  const out = new Map<string, { target: number; final: number }>();
  for (const line of text.split('\n')) {
    if (!line.startsWith('| ')) continue;
    const c = line.split('|').slice(1, -1).map((x) => x.trim());
    if (c.length < 8) continue;
    const target = num(c[2]), final = num(c[7]);
    if (target !== null && final !== null) out.set(c[0], { target, final });
  }
  return out;
}

/** The stations the station rule judges in a period: link stations the runs export, with an hourly count (not a daily total, not a scaled copy of another period) of a recent year. */
export function judgedLinkStations(stations: StationInfo[], period: string, recency: Recency): StationInfo[] {
  return stations.filter((s) => s.links.length > 0 && (s.target[period] ?? 0) > 0 && !isDerivedTarget(s) && !s.derived?.includes(period) && s.year != null && recency.referenceYear - s.year <= recency.recentYears);
}

export function diagnose(o: { pass: number; view: string; period: string; runs: SelectOd[]; stations: StationInfo[]; held: Set<string>; recency: Recency | null; watch: WatchFile | null; fit: Map<string, { target: number; final: number }> | null }): PassDiag {
  const entries = [...(o.watch?.heldOutMisses ?? []).map((w) => ({ w, group: 'held-out miss' as const })), ...(o.watch?.diagonal ?? []).map((w) => ({ w, group: 'diagonal' as const }))].filter((x) => x.w.period === o.period);
  const judged = o.recency ? judgedLinkStations(o.stations, o.period, o.recency) : [];
  const ids = new Set([...judged.map((s) => s.id), ...entries.map((x) => x.w.id)]);
  const stats = ids.size ? iterationStats(o.runs, ids) : null;
  let tally: GehTally | null = null;
  if (o.recency && stats) {
    tally = { n: 0, ok: 0, unmeasured: 0 };
    for (const s of judged) {
      if ((o.view === 'training') !== o.held.has(s.id)) continue;
      const via = exportOf(s);
      const m = stats.flow[s.id];
      if (!('via' in via) || via.via !== 'link' || !m) { tally.unmeasured++; continue; }
      tally.n++;
      if (geh(m.mean, s.target[o.period]) < GEH_GOOD) tally.ok++;
    }
  }
  const byId = new Map(o.stations.map((s) => [s.id, s]));
  const watch: WatchRow[] = entries.flatMap(({ w, group }) => {
    const s = byId.get(w.id);
    if (!s) return [];
    const label = s.label ?? s.id;
    return [{ group, id: w.id, label, period: o.period, counted: s.target[o.period] ?? 0, fit: o.fit?.get(label)?.final ?? null, sim: stats?.flow[w.id]?.mean ?? null }];
  });
  return { pass: o.pass, view: o.view, period: o.period, geh: tally, watch };
}

const f0 = (x: number | null) => (x === null || !Number.isFinite(x) ? '-' : String(Math.round(x)));

export interface DiagContext { reports: { pass: number; view: string; period: string; offered: number; shift: { flowRatio: number; membershipRatio: number } | null; ceiling?: { staticTotal: number; finalTotal: number } }[] }

/** The diagnostics as Markdown: convergence by pass, judged counts within GEH 5, and the watched stations (fitted value and simulated mean by pass). */
export function renderDiagnostics(diags: PassDiag[], ctx: DiagContext): string {
  const L = ['## Per-pass diagnostics (report only)', '', 'Nothing here feeds a build or the stop rule. Simulated figures are the loop\'s select-link exports on the pass\'s own seeds; the assessment is the judge.', '',
    '### Convergence and offered demand', '', '| Pass | View | Period | Flow change / seed SE | Membership change / seed SE | Offered car veh/h | Offered / static fit |', '| --- | --- | --- | --- | --- | --- | --- |',
    ...ctx.reports.map((x) => `| ${x.pass} | ${x.view} | ${x.period} | ${x.shift ? x.shift.flowRatio.toFixed(2) : '-'} | ${x.shift ? x.shift.membershipRatio.toFixed(2) : '-'} | ${x.offered} | ${x.ceiling && x.ceiling.staticTotal > 0 ? `${(100 * x.ceiling.finalTotal / x.ceiling.staticTotal).toFixed(1)}%` : '-'} |`), ''];
  const tallies = diags.filter((d) => d.geh);
  if (tallies.length) L.push('### Recent judged stations within GEH 5 on the pass\'s seeds', '', 'Shipped view: stations the fit used. Training view: stations it held out. "Not measured": judged stations the runs do not export a flow for.', '', '| Pass | View | Period | Within GEH 5 | Not measured |', '| --- | --- | --- | --- | --- |',
    ...tallies.map((d) => `| ${d.pass} | ${d.view} | ${d.period} | ${d.geh!.ok} of ${d.geh!.n} | ${d.geh!.unmeasured} |`), '');
  const rows = diags.flatMap((d) => d.watch.map((w) => ({ d, w })));
  if (rows.length) {
    const keys = [...new Set(rows.map(({ w }) => `${w.group}|${w.period}|${w.id}`))];
    L.push('### Watched stations', '', 'Counted, then per pass: the shipped fit\'s final value, the simulated mean on the shipped demand, the simulated mean on the training demand (the held-out reading).', '', '| Group | Period | Station | Counted | Pass | Shipped fit | Shipped simulated | Training simulated |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const key of keys) {
      const mine = rows.filter(({ w }) => `${w.group}|${w.period}|${w.id}` === key);
      for (const pass of [...new Set(mine.map(({ d }) => d.pass))].sort((a, b) => a - b)) {
        const sh = mine.find(({ d }) => d.pass === pass && d.view === 'shipped')?.w, tr = mine.find(({ d }) => d.pass === pass && d.view === 'training')?.w, any = (sh ?? tr)!;
        L.push(`| ${any.group} | ${any.period} | ${any.label} | ${f0(any.counted)} | ${pass} | ${f0(sh?.fit ?? null)} | ${f0(sh?.sim ?? null)} | ${f0(tr?.sim ?? null)} |`);
      }
    }
    L.push('');
    const periods = [...new Set(rows.filter(({ w }) => w.group === 'diagonal').map(({ w }) => w.period))];
    for (const period of periods) {
      L.push(`### Diagonal stations, ${period}: sum`, '', '| Pass | Counted | Shipped fit | Shipped simulated | Training simulated |', '| --- | --- | --- | --- | --- |');
      for (const pass of [...new Set(diags.map((d) => d.pass))].sort((a, b) => a - b)) {
        const pick = (view: string) => diags.find((d) => d.pass === pass && d.view === view && d.period === period)?.watch.filter((w) => w.group === 'diagonal');
        const sh = pick('shipped'), tr = pick('training');
        const sum = (ws: WatchRow[] | undefined, f: (w: WatchRow) => number | null) => (ws && ws.length && ws.every((w) => f(w) !== null) ? ws.reduce((a, w) => a + f(w)!, 0) : null);
        const any = sh ?? tr;
        if (!any) continue;
        L.push(`| ${pass} | ${f0(sum(any, (w) => w.counted))} | ${f0(sum(sh, (w) => w.fit))} | ${f0(sum(sh, (w) => w.sim))} | ${f0(sum(tr, (w) => w.sim))} |`);
      }
      L.push('');
    }
  }
  return L.join('\n');
}
