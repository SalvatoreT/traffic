import { useEffect, useMemo, useRef, useState } from 'react';
import type { AreaBundle, Overlay } from '../types';
import { linkStatsView } from '../types';
import type { Block, NetIndex } from '../lib/naming';
import { matchesQuery } from '../lib/naming';
import { blockVisible } from '../lib/picker';
import { hoverHandlers, type Hover } from '../lib/highlight';
import { rovingTarget, tabStop } from '../lib/roving';
import { formatValue } from '../lib/format';
import { vulnerableSentence } from '../lib/metrics';
import type { Metrics } from '../types';
import { aggregate, CHANGE_NAME, CHANGE_UNIT, compareRows, diffValue, formatSigned } from '../lib/change';

type Key = 'name' | 'cls' | 'chg' | 'flowB' | 'flowS' | 'speedB' | 'speedS' | 'ctB' | 'ctS';
interface Row {
  key: number; block: Block; name: string; label: string; cls: string;
  flowB: number; flowS: number; speedB: number; speedS: number; ctB: number; ctS: number;
  /** Scenario minus baseline for the selected metric, display units; null when not comparable. */
  chg: number | null;
}

interface Props {
  bundle: AreaBundle; index: NetIndex;
  scen: Float32Array | null; base: Float32Array | null; comparing: boolean;
  showService: boolean; onShowService(v: boolean): void;
  overlay: Overlay;
  baseMetrics?: Metrics | null; scenMetrics?: Metrics | null;
  onHover(h: Hover | null): void;
}

export function StreetsTable({ index, scen, base, comparing, overlay, showService, onShowService, baseMetrics, scenMetrics, onHover }: Props) {
  const walkBike = comparing && baseMetrics && scenMetrics ? vulnerableSentence(baseMetrics, scenMetrics) : '';
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 } | null>(null);
  // Until a header is chosen: largest absolute change first when a scenario exists, else largest scenario cut-through.
  const active: { key: Key; dir: 1 | -1 } = sort ?? (comparing ? { key: 'chg', dir: -1 } : { key: 'ctS', dir: -1 });
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('all');
  const [limit, setLimit] = useState(150);
  const PAGE = 200;
  const [stop, setStop] = useState<number | null>(null);
  // First newly revealed row: animated in and focused, then forgotten.
  const [reveal, setReveal] = useState<number | null>(null);
  const [revealNote, setRevealNote] = useState('');
  const rowEls = useRef(new Map<number, HTMLTableRowElement>());

  const rows = useMemo<Row[]>(() => {
    const S = linkStatsView(scen), B = linkStatsView(base ?? scen);
    return index.blocks.map((b) => {
      const s = aggregate(S, b.links), bs = aggregate(B, b.links);
      return {
        key: b.key, block: b, name: b.name, label: b.label, cls: b.cls, flowB: bs.flow, flowS: s.flow, speedB: bs.speed, speedS: s.speed, ctB: bs.cut, ctS: s.cut,
        chg: comparing ? diffValue(overlay, bs, s) : null,
      };
    });
  }, [index, scen, base, overlay, comparing]);

  const classes = useMemo(() => ['all', ...Array.from(new Set(index.blocks.map((b) => b.cls)))], [index]);
  const shown = useMemo(() => {
    const f = rows.filter((r) => blockVisible(r.block, { showService }, cls) && (cls === 'all' || r.cls === cls) && matchesQuery(r.label, q));
    return f.sort(compareRows<Row>(active.key, active.dir));
  }, [rows, q, cls, active.key, active.dir, showService]);

  const visible = shown.slice(0, limit);
  const rowStop = tabStop(visible.map((r) => r.key), stop);

  useEffect(() => {
    if (reveal === null) return;
    const first = visible[reveal];
    if (first) { setStop(first.key); rowEls.current.get(first.key)?.focus(); }
    const t = window.setTimeout(() => setReveal(null), 500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal]);

  const showMore = () => {
    const next = Math.min(shown.length, limit + PAGE);
    setRevealNote(`${next - limit} more streets shown, ${shown.length - next} remaining.`);
    setReveal(limit);
    setLimit(next);
  };
  const onRowKey = (e: React.KeyboardEvent<HTMLTableRowElement>, i: number) => {
    if (e.target !== e.currentTarget || e.altKey || e.ctrlKey || e.metaKey) return;
    const to = rovingTarget(e.key, i, visible.length);
    if (to === null) return;
    e.preventDefault();
    const r = visible[to];
    setStop(r.key);
    rowEls.current.get(r.key)?.focus();
  };

  const th = (key: Key, label: string, sub?: string, rowSpan?: number) => (
    <th scope="col" rowSpan={rowSpan} aria-sort={active.key === key ? (active.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="sort" onClick={() => setSort({ key, dir: active.key === key ? (active.dir === 1 ? -1 : 1) : key === 'name' || key === 'cls' ? 1 : -1 })}>
        {label}{sub && <span className="sub"> {sub}</span>}
        <span aria-hidden="true">{active.key === key ? (active.dir === 1 ? ' ▲' : ' ▼') : ''}</span>
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
        speed in mph, flow-weighted. The Change column is the scenario minus the baseline for the metric chosen on the map, and sorts by size of change. {comparing ? '' : 'Scenario columns fill in once an intervention is added.'}
      </p>
      {walkBike && <p className="small">{walkBike}</p>}
      <div className="filters">
        <label>Search streets <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Oak" /></label>
        <label>Class <select value={cls} onChange={(e) => setCls(e.target.value)}>{classes.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
        <label className="check"><input type="checkbox" checked={showService} onChange={(e) => onShowService(e.target.checked)} /> Show service roads</label>
        <span role="status" className="muted small">{shown.length} match{shown.length === 1 ? '' : 'es'}</span>
      </div>
      <div className="table-scroll" role="region" aria-label="Streets table, scrollable">
        <table className="streets">
          <caption className="sr-only">Street blocks with flow, mean speed and cut-through flow, baseline versus scenario</caption>
          <thead>
            <tr>
              <th rowSpan={2} scope="col" aria-sort={active.key === 'name' ? (active.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                <button type="button" className="sort" onClick={() => setSort({ key: 'name', dir: active.key === 'name' && active.dir === 1 ? -1 : 1 })}>Street block{active.key === 'name' ? (active.dir === 1 ? ' ▲' : ' ▼') : ''}</button>
              </th>
              {th('cls', 'Class', undefined, 2)}
              <th colSpan={2} scope="colgroup">Flow (veh/h)</th>
              <th colSpan={2} scope="colgroup">Mean speed (mph)</th>
              <th colSpan={2} scope="colgroup">Cut-through (veh/h)</th>
              {th('chg', 'Change', `${CHANGE_NAME[overlay].toLowerCase()}, ${CHANGE_UNIT[overlay]}`, 2)}
            </tr>
            <tr>
              {th('flowB', 'Base')}{th('flowS', 'Scen.')}{th('speedB', 'Base')}{th('speedS', 'Scen.')}{th('ctB', 'Base')}{th('ctS', 'Scen.')}
            </tr>
          </thead>
          <tbody>
            {visible.map((r, i) => (
              <tr
                key={r.key} ref={(el) => { if (el) rowEls.current.set(r.key, el); else rowEls.current.delete(r.key); }}
                tabIndex={r.key === rowStop ? 0 : -1} aria-label={r.label} className={reveal !== null && i >= reveal ? 'row-new' : undefined}
                onKeyDown={(e) => onRowKey(e, i)}
                {...hoverHandlers(onHover, { kind: 'block', block: index.blockOfLink[r.key] })}
                onFocus={() => { setStop(r.key); onHover({ kind: 'block', block: index.blockOfLink[r.key] }); }}
              >
                <th scope="row">{r.label}</th>
                <td>{r.cls}</td>
                {cell(r.flowB, r.flowS, 'flow')}
                {cell(r.speedB, r.speedS, 'speed')}
                {cell(r.ctB, r.ctS, 'flow')}
                <td className="chg">{comparing ? formatSigned(r.chg, overlay) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span role="status" className="sr-only">{revealNote}</span>
      {shown.length > limit && <button type="button" className="btn" onClick={showMore}>Show more ({shown.length - limit} remaining)</button>}
    </div>
  );
}
