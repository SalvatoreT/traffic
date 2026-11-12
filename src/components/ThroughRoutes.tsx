import { useId, useState } from 'react';
import { CELL_COLORS, CELL_DASHES } from '../lib/routestyle';
import type { Mode } from '../lib/ramps';
import { formatRouteLength, ROUTE_CAVEAT, routeHeadline, type RouteCheck } from '../lib/throughroutes';

interface Props {
  check: RouteCheck;
  /** Routes in today's street network. */
  today: number;
  hasScenario: boolean;
  show: boolean; onShow(v: boolean): void;
  onHighlight(id: string | null): void;
  mode: Mode;
}

/** Line sample in the cell's hue and dash pattern. The legend repeats the map's two cues. */
function Swatch({ i, mode }: { i: number; mode: Mode }) {
  const dash = CELL_DASHES[i % CELL_DASHES.length];
  const w = 6;
  return (
    <svg className="cell-swatch" width="40" height="12" viewBox="0 0 40 12" aria-hidden="true" focusable="false">
      <line x1="0" y1="6" x2="40" y2="6" stroke={CELL_COLORS[mode][i % CELL_COLORS[mode].length]} strokeWidth={w * 1.5} opacity=".8"
        strokeDasharray={dash[1] === 0 ? undefined : dash.map((d) => d * w).join(' ')} />
    </svg>
  );
}

export function ThroughRoutes({ check, today, hasScenario, show, onShow, onHighlight, mode }: Props) {
  const id = useId();
  const [hot, setHot] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const push = (h: string | null, p: string | null) => onHighlight(h ?? p);
  const hover = (r: string | null) => { setHot(r); push(r, pinned); };
  const pin = (r: string) => { const n = pinned === r ? null : r; setPinned(n); push(hot, n); };
  // A pinned route that no longer exists is dropped silently; the map ignores unknown ids.
  const shownCells = check.cells.filter((c) => c.links.length > 1);
  return (
    <section className="routes" aria-labelledby={`${id}-h`}>
      <h3 className="scn-h" id={`${id}-h`}>Through routes</h3>
      <p className="routes-head" data-testid="routes-headline">{routeHeadline(check.total, today, hasScenario)}</p>
      <p className="muted small">{ROUTE_CAVEAT}</p>
      <label className="routes-toggle">
        <input type="checkbox" checked={show} onChange={(e) => onShow(e.target.checked)} />
        <span>Show on map</span>
      </label>
      {show && (
        <div className="routes-key">
          <p className="small muted">
            Routes are the solid pink lines. Cells are groups of side streets a car can drive between without using a bounding street; each has its own tint and line pattern.
          </p>
          <ul className="cell-list" aria-label="Cells">
            {shownCells.map((c) => (
              <li key={c.id}>
                <Swatch i={check.cells.indexOf(c)} mode={mode} />
                <span>{c.name || 'Unnamed streets'}<span className="muted small">, {c.links.length} street segments</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {check.routes.length > 0 && (
        <details className="routes-more">
          <summary>Show routes ({check.routes.length}{check.capped ? ` of ${check.total}` : ''})</summary>
          {check.capped && <p className="muted small">The shortest few for each pair of bounding streets are listed.</p>}
          <ul className="route-list">
            {check.routes.map((r) => (
              <li key={r.id}>
                <button type="button" className="route-item" aria-pressed={pinned === r.id}
                  onMouseEnter={() => hover(r.id)} onMouseLeave={() => hover(null)}
                  onFocus={() => hover(r.id)} onBlur={() => hover(null)}
                  onClick={() => pin(r.id)}>
                  <span className="route-desc">{r.description}</span>
                  <span className="muted small route-len">{formatRouteLength(r.lengthM)}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="muted small">Hover over, focus or press a route to highlight it on the map.</p>
        </details>
      )}
    </section>
  );
}
