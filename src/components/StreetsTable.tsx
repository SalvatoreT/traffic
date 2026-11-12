import { useMemo, useState } from 'react';
import type { AreaBundle } from '../types';
import { linkStatsView } from '../types';
import type { Block, NetIndex } from '../lib/naming';
import { matchesQuery } from '../lib/naming';
import { blockVisible } from '../lib/picker';
import { formatValue } from '../lib/format';
import { vulnerableSentence } from '../lib/metrics';
import type { Metrics } from '../types';

type Key = 'name' | 'cls' | 'flowB' | 'flowS' | 'speedB' | 'speedS' | 'ctB' | 'ctS';
interface Row {
  key: number; block: Block; name: string; label: string; cls: string;
  flowB: number; flowS: number; speedB: number; speedS: number; ctB: number; ctS: number;
}

interface Props {
  bundle: AreaBundle; index: NetIndex;
  scen: Float32Array | null; base: Float32Array | null; comparing: boolean;
  showService: boolean; onShowService(v: boolean): void;
  baseMetrics?: Metrics | null; scenMetrics?: Metrics | null;
}

export function StreetsTable({ index, scen, base, comparing, showService, onShowService, baseMetrics, scenMetrics }: Props) {
  const walkBike = comparing && baseMetrics && scenMetrics ? vulnerableSentence(baseMetrics, scenMetrics) : '';
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'ctS', dir: -1 });
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('all');
  const [limit, setLimit] = useState(150);

  const rows = useMemo<Row[]>(() => {
    const S = linkStatsView(scen), B = linkStatsView(base ?? scen);
    return index.blocks.map((b) => {
      const agg = (v: ReturnType<typeof linkStatsView>) => {
        let flow = 0, ct = 0, sp = 0, w = 0;
        for (const id of b.links) { const f = v.flow(id); flow += f; ct += v.cut(id); sp += v.speed(id) * Math.max(f, 0.001); w += Math.max(f, 0.001); }
        return { flow, ct, speed: w > 0 ? sp / w : 0 };
      };
      const s = agg(S), bs = agg(B);
      return { key: b.key, block: b, name: b.name, label: b.label, cls: b.cls, flowB: bs.flow, flowS: s.flow, speedB: bs.speed, speedS: s.speed, ctB: bs.ct, ctS: s.ct };
    });
  }, [index, scen, base]);

  const classes = useMemo(() => ['all', ...Array.from(new Set(index.blocks.map((b) => b.cls)))], [index]);
  const shown = useMemo(() => {
    const f = rows.filter((r) => blockVisible(r.block, { showService }, cls) && (cls === 'all' || r.cls === cls) && matchesQuery(r.label, q));
    const { key, dir } = sort;
    return f.sort((a, b) => {
      const av = a[key], bv = b[key];
      const c = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return (c || a.label.localeCompare(b.label)) * dir;
    });
  }, [rows, q, cls, sort, showService]);

  const th = (key: Key, label: string, sub?: string, rowSpan?: number) => (
    <th scope="col" rowSpan={rowSpan} aria-sort={sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="sort" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : key === 'name' || key === 'cls' ? 1 : -1 }))}>
        {label}{sub && <span className="sub"> {sub}</span>}
        <span aria-hidden="true">{sort.key === key ? (sort.dir === 1 ? ' ▲' : ' ▼') : ''}</span>
      </button>
    </th>
  );
  const cell = (b: number, s: number, kind: 'flow' | 'speed') => (
    <>
      <td>{formatValue(kind, b, false)}</td>
      <td>{comparing ? formatValue(kind, s, false) : '—'}</td>
    </>
  );
  return (
    <div className="streets-view">
      <h2>Streets</h2>
      <p className="muted">
        A text alternative to the map: one row per street block (both directions combined), limited to the study area and the streets around it that the map shows. Flow and cut-through in veh/h,
        speed in mph, flow-weighted. {comparing ? '' : 'Scenario columns fill in once an intervention is added.'}
      </p>
      {walkBike && <p className="small">{walkBike}</p>}
      <div className="filters">
        <label>Search streets <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Oak" /></label>
        <label>Class <select value={cls} onChange={(e) => setCls(e.target.value)}>{classes.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
        <label className="check"><input type="checkbox" checked={showService} onChange={(e) => onShowService(e.target.checked)} /> Show service roads</label>
        <span role="status" className="muted small">{shown.length} match{shown.length === 1 ? '' : 'es'}</span>
      </div>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Streets table, scrollable">
        <table className="streets">
          <caption className="sr-only">Street blocks with flow, mean speed and cut-through flow, baseline versus scenario</caption>
          <thead>
            <tr>
              <th rowSpan={2} scope="col" aria-sort={sort.key === 'name' ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                <button type="button" className="sort" onClick={() => setSort((s) => ({ key: 'name', dir: s.key === 'name' && s.dir === 1 ? -1 : 1 }))}>Street block{sort.key === 'name' ? (sort.dir === 1 ? ' ▲' : ' ▼') : ''}</button>
              </th>
              {th('cls', 'Class', undefined, 2)}
              <th colSpan={2} scope="colgroup">Flow (veh/h)</th>
              <th colSpan={2} scope="colgroup">Mean speed (mph)</th>
              <th colSpan={2} scope="colgroup">Cut-through (veh/h)</th>
            </tr>
            <tr>
              {th('flowB', 'Base')}{th('flowS', 'Scen.')}{th('speedB', 'Base')}{th('speedS', 'Scen.')}{th('ctB', 'Base')}{th('ctS', 'Scen.')}
            </tr>
          </thead>
          <tbody>
            {shown.slice(0, limit).map((r) => (
              <tr key={r.key}>
                <th scope="row">{r.label}</th>
                <td>{r.cls}</td>
                {cell(r.flowB, r.flowS, 'flow')}
                {cell(r.speedB, r.speedS, 'speed')}
                {cell(r.ctB, r.ctS, 'flow')}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {shown.length > limit && <button type="button" className="btn" onClick={() => setLimit((l) => l + 200)}>Show more ({shown.length - limit} remaining)</button>}
    </div>
  );
}
