import { Fragment } from 'react';
import type { DemandIntent } from '../types';
import type { BaselineIntents } from '../lib/baseline-intents';
import { FOLD_SHARE, CORRIDOR_INTRO, CORRIDOR_TABLE_NOTE, corridorRule, multiSentence, carsText, corridorView, crossingLines, crossingSentences, percentText, reasonsOf, type CorridorDefs, type CorridorPeriod, type CorridorView, type FlowRow } from '../lib/corridors';
import { BASIS_HELP, BASIS_TEXT } from '../lib/intents';
import { AnchorHeading } from './Anchor';

export const CORRIDORS_ID = 'where-cars-cut-through';

export type CorridorStatus = 'loading' | 'missing' | 'pending' | 'stale' | 'ok';
const STATUS_NOTE: Record<Exclude<CorridorStatus, 'ok'>, string> = {
  loading: 'Loading today’s through cars by corridor…',
  pending: 'Today’s through cars by corridor appear once the simulation engine has started.',
  missing: 'The stored traffic is not available, so the table of corridors is not shown.',
  stale: 'The stored traffic was computed for a different version of the model than the one loaded, so the table of corridors is not shown.',
};

interface Props {
  defs: DemandIntent[];
  file: BaselineIntents | null;
  status: CorridorStatus;
  order: string[];
  first: string | undefined;
  periodName: (id: string) => string;
}

const streetList = (defs: CorridorDefs, id: string): string => {
  const c = defs.corridors.find((x) => x.id === id);
  return c ? c.streets.map((s) => (s.part ? `${s.name} (part)` : s.name)).join(', ') : '';
};

function Reasons({ intents, byIntent, order, periodName }: { intents: DemandIntent[]; byIntent: Record<string, number[]>; order: string[]; periodName: (id: string) => string }) {
  return (
    <ul className="flow-reasons">
      {reasonsOf(intents, byIntent, order).map((r) => (
        <li key={r.id}>
          <span className="flow-reason-name">{r.label}</span>
          {r.def && <span className={`badge badge-${r.def.basis}`} title={BASIS_HELP[r.def.basis]}>{BASIS_TEXT[r.def.basis]}</span>}
          <span className="flow-reason-nums"> {order.map((p) => `${periodName(p)} ${carsText(r.vph[p])}`).join(', ')} an hour.</span>
          {r.def?.avoids && <span className="flow-reason-avoids"> Would otherwise use {r.def.avoids}, by the model’s shortest route with the side streets closed.</span>}
        </li>
      ))}
    </ul>
  );
}

/** The section "Where cars cut through": today's through cars by corridor and direction, heaviest first, with the reasons behind each flow in a closed disclosure. */
export function Corridors({ defs, file, status, order, first, periodName }: Props) {
  const lead = first ?? order[0];
  const cdefs = file?.corridorDefs;
  const periods = file ? Object.fromEntries(Object.entries(file.periods).map(([p, v]) => [p, v.corridors])) : {};
  const view: CorridorView | null = cdefs && lead ? corridorView(cdefs, periods, order, lead) : null;
  const shown = view ? order.filter((p) => periods[p]) : order;
  const named = (r: FlowRow) => (r.direction ? r.direction : '');
  return (
    <section aria-labelledby={CORRIDORS_ID}>
      <AnchorHeading id={CORRIDORS_ID} className="sticky-h" label="Where cars cut through">Where cars cut through</AnchorHeading>
      <p>{CORRIDOR_INTRO}</p>
      <p>{corridorRule()}</p>
      {status !== 'ok' && <p className="muted" role="status">{STATUS_NOTE[status]}</p>}
      {status === 'ok' && !view && <p className="muted">This stored traffic has no table of corridors yet.</p>}
      {view && cdefs && (
        <>
          <table className="flow-table" role="table">
            <caption className="sr-only">Through cars on the side streets by corridor and direction, cars an hour and share of all through cars, today’s traffic</caption>
            <thead>
              <tr role="row"><th scope="col">Corridor and direction</th>{shown.map((p) => <th scope="col" key={p}>{periodName(p)}<span className="sr-only"> cars an hour and share</span></th>)}</tr>
            </thead>
            <tbody>
              {view.rows.map((r) => (
                <tr role="row" key={r.key} className="flow-row">
                  <th scope="row">
                    <span className="flow-corridor">{r.corridorName}</span>
                    {named(r) && <span className="flow-direction">{named(r)}</span>}
                    <details className="flow-why">
                      <summary>Why these cars are here</summary>
                      <p className="flow-streets"><strong>Streets in this corridor:</strong> {streetList(cdefs, r.corridor)}.</p>
                      <Reasons intents={defs} byIntent={r.byIntent} order={shown} periodName={periodName} />
                    </details>
                  </th>
                  {shown.map((p) => <td key={p} data-label={periodName(p)} className="flow-num"><span className="flow-cars">{carsText(r.vph[p] ?? 0)}</span> <span className="flow-pct">{percentText(r.share[p] ?? 0)}</span></td>)}
                </tr>
              ))}
              {view.folded.length > 0 && (
                <tr role="row" className="flow-row flow-folded">
                  <th scope="row">
                    <span className="flow-corridor">Smaller flows</span>
                    <span className="flow-direction">{view.folded.length} {view.folded.length === 1 ? 'flow' : 'flows'}, each under {Math.round(FOLD_SHARE * 100)}% of through cars</span>
                    <details className="flow-why">
                      <summary>What is in the smaller flows</summary>
                      <ul className="flow-small">
                        {view.folded.map((r) => (
                          <li key={r.key}>
                            <strong>{r.corridorName}{named(r) ? `, ${named(r)}` : ''}:</strong> {shown.map((p) => `${periodName(p)} ${carsText(r.vph[p] ?? 0)}`).join(', ')} an hour.
                            <Reasons intents={defs} byIntent={r.byIntent} order={shown} periodName={periodName} />
                          </li>
                        ))}
                      </ul>
                    </details>
                  </th>
                  {shown.map((p) => <td key={p} data-label={periodName(p)} className="flow-num"><span className="flow-cars">{carsText(view.foldedVph[p] ?? 0)}</span> <span className="flow-pct">{percentText(view.foldedShare[p] ?? 0)}</span></td>)}
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr role="row">
                <th scope="row">All through cars</th>
                {shown.map((p) => <td key={p} data-label={periodName(p)} className="flow-num"><span className="flow-cars">{carsText(view.totals[p] ?? 0)}</span> <span className="flow-pct">100%</span></td>)}
              </tr>
            </tfoot>
          </table>
          <p className="muted small">{CORRIDOR_TABLE_NOTE}</p>
          <Notes cdefs={cdefs} order={shown} lead={lead!} periodName={periodName} periods={periods} />
        </>
      )}
    </section>
  );
}

function Notes({ cdefs, order, lead, periodName, periods }: { cdefs: CorridorDefs; order: string[]; lead: string; periodName: (id: string) => string; periods: Record<string, CorridorPeriod | undefined> }) {
  const lines = crossingSentences(crossingLines(cdefs, periods, order, lead), order, lead, periodName);
  const multi = multiSentence(cdefs, periods[lead], periodName(lead));
  return (
    <Fragment>
      {multi && <p>{multi}</p>}
      {lines.length > 0 && (
        <div>
          <p>Crossing the study area east to west:</p>
          <ul className="flow-cross">{lines.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      )}
    </Fragment>
  );
}
