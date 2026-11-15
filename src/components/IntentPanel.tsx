import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { DemandIntent, Metrics, Network } from '../types';
import type { NetIndex } from '../lib/naming';
import { EARLY_NOTE } from '../lib/run';
import { BASIS_HELP, BASIS_TEXT, OTHER_ID, describePaths, intentTable, type IntentPaths } from '../lib/intents';

interface Props {
  defs: DemandIntent[];
  base: Metrics | null; scen: Metrics | null; comparing: boolean;
  net: Network; idx: NetIndex;
  selected: string | null; onSelect(id: string | null): void;
  /** The paths drawn on the map: the run the map shows. */
  paths: IntentPaths | null;
  pathsFrom: 'scenario' | 'baseline';
  phone: boolean;
  /** The run is playing: the path sentence is held so it does not change under the reader. */
  running: boolean;
  /** Figures are scaled up from the first few simulated minutes. */
  early: boolean;
  onAbout(): void;
}

const signed = (n: number | null): string => (n === null ? '—' : n === 0 ? '0' : `${n > 0 ? '+' : '−'}${Math.abs(n)}`);
const num = (n: number | null): string => (n === null ? '—' : String(n));

export function IntentPanel({ defs, base, scen, comparing, net, idx, selected, onSelect, paths, pathsFrom, phone, running, early, onAbout }: Props) {
  const id = useId();
  const table = useMemo(() => intentTable(defs, base, scen), [defs, base, scen]);
  const def = selected ? defs.find((d) => d.id === selected) : undefined;
  const live = useMemo(() => (paths && def ? describePaths(net, idx, paths) : ''), [paths, def, net, idx]);
  const held = useRef<{ key: string; text: string } | null>(null);
  const key = `${selected}|${pathsFrom}`;
  let text = live;
  if (running && held.current?.key === key && held.current.text) text = held.current.text;
  else held.current = { key, text: live };
  // Said once when a reason is chosen or cleared. The figures and the path sentence change as the run goes on and stay out of the live region.
  const [said, setSaid] = useState('');
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setSaid(def ? `${def.label} is shown on the map.` : 'Map highlight turned off.');
  }, [selected]); // eslint-disable-line
  if (!table) return null;
  const run = comparing ? (pathsFrom === 'scenario' ? 'the scenario' : 'the baseline') : 'today’s traffic';
  return (
    <section className="card intents" aria-labelledby={`${id}-h`}>
      <h3 id={`${id}-h`}>Why cars cut through</h3>
      <p className="small">
        These are the model's hypotheses about why drivers cut through, not what drivers said. Reasons marked <strong>Observed counts</strong> are limited by a
        turning-movement or freeway-share count; where those cars come from and why they pick side streets is still an assumption. Reasons marked
        <strong> Assumed</strong> come from the trip table with no count behind them.{' '}
        <button type="button" className="link" onClick={onAbout}>About these reasons</button>
      </p>
      <p className="muted small">
        Cars an hour, averaged over the simulated time so far: the same window as the through cars counted above. Every through car is in one row, so the rows add up to the total.
      </p>
      {early && <p className="notice" role="note">{EARLY_NOTE}</p>}
      <table className="intent-table" role="table">
        <caption className="sr-only">Through cars on side streets by reason, cars an hour</caption>
        <thead className="sr-only">
          <tr><th scope="col">Reason</th><th scope="col">Baseline</th><th scope="col">Scenario</th><th scope="col">Change</th></tr>
        </thead>
        <tbody>
          {table.rows.map((r) => {
            const d = defs.find((x) => x.id === r.id);
            const on = selected === r.id;
            return (
              <tr key={r.id} role="row" className={on ? 'intent-on' : undefined}>
                <th scope="row">
                  {r.id === OTHER_ID ? <span>{r.label}</span> : (
                    <button type="button" className="intent-btn" aria-pressed={on} onClick={() => onSelect(on ? null : r.id)}>{r.label}</button>
                  )}
                  {d && <span className={`badge badge-${d.basis}`} title={BASIS_HELP[d.basis]}>{BASIS_TEXT[d.basis]}</span>}
                  {on && <span className="sr-only"> (shown on the map)</span>}
                </th>
                <td data-label="Baseline">{num(r.base)}</td>
                <td data-label="Scenario">{num(r.scen)}</td>
                <td data-label="Change" className="chg neutral">{comparing ? signed(r.change) : '—'}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">All through cars, as counted above</th>
            <td data-label="Baseline">{num(table.baseTotal)}</td><td data-label="Scenario">{num(table.scenTotal)}</td><td data-label="Change" className="chg neutral">{comparing ? signed(table.changeTotal) : '—'}</td>
          </tr>
        </tfoot>
      </table>
      <p className="muted small">Rows are rounded to whole cars so they add up to the rounded total. Press a reason to draw its typical path on the map.</p>
      <p className="sr-only" role="status" aria-live="polite">{said}</p>
      <div className="intent-show">
        {def && (
          <div className="intent-card">
            <p className="intent-title"><strong>On the map:</strong> {def.label}</p>
            <p>{paths && paths.segments.length ? <>{text} <span className="muted">(for {run})</span></> : 'No typical path: few or none of these cars have crossed the side streets in this run.'}</p>
            {paths && paths.maxVph > 0 && (
              <p className="muted small">
                Drawn as a dashed violet line, which no traffic color uses. Line width shows cars an hour of this reason on each street: the widest line is {Math.round(paths.maxVph)} an hour. Only streets with at least 8% of this reason's cars are drawn.
                {def.avoids ? ` Cars of this kind would otherwise use ${def.avoids}, by the model's shortest route.` : ''}
                {phone ? ' Drag the sheet down to see the map.' : ''}
              </p>
            )}
            <p className="muted small">{def.note}</p>
            <button type="button" className="btn" onClick={() => onSelect(null)}>Turn off the map highlight</button>
          </div>
        )}
      </div>
    </section>
  );
}
