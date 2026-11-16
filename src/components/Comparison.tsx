import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Metrics } from '../types';
import { NavLink } from './Anchor';
import { CARDS, networkHealth, summarize, type CardDef } from '../lib/metrics';
import { EARLY_NOTE, isEarly, RUN_SECONDS } from '../lib/run';
import { formatDiff, formatValue } from '../lib/format';

interface Props {
  base: Metrics | null; scen: Metrics | null; comparing: boolean; finished: boolean; withheld?: boolean; scenarioCount: number;
  /** Rendered after the through-traffic card. */
  intents?: ReactNode;
}

export function Comparison({ base, scen, comparing, finished, withheld = false, scenarioCount, intents }: Props) {
  // Throttled polite announcement: at most once per 20 s of wall time, only while a scenario exists.
  const [announce, setAnnounce] = useState('');
  const last = useRef(0);
  useEffect(() => {
    if (!base || !scen || !comparing) { setAnnounce(''); return; }
    const now = Date.now();
    if (now - last.current > 20000 && scen.time >= 120) { last.current = now; setAnnounce(summarize(base, scen)); }
  }, [base, scen, comparing]);

  const elapsed = scen?.time ?? 0;
  return (
    <div className="results">
      <p className="muted small">
        Baseline and scenario run side by side from the same seed, period and demand, so both cover the same simulated time.
        {scen && !withheld ? (
          finished
            ? <> Results are for the <strong>full hour</strong>.</>
            : <> Results are <strong>so far ({formatShort(elapsed)} of {formatShort(RUN_SECONDS)})</strong>.</>
        ) : null}{' '}
        Editing the scenario restarts both runs.
      </p>
      <div role="status" className="results-wait">
        {withheld && <p className="notice">Results appear when the run finishes. At Max speed the run goes straight to the end of the hour, so there are no partial figures to show.</p>}
      </div>
      {withheld ? null : <>
      {!comparing && (
        <p className="notice" role="note">
          No interventions yet, so the scenario is the baseline. Add an intervention to see the differences.
        </p>
      )}
      {scen && isEarly(finished, elapsed) && <p className="notice" role="note">{EARLY_NOTE}</p>}
      {scen && <HealthLine scen={scen} base={comparing ? base : null} />}
      {CARDS.map((c) => <Fragment key={c.id}><CardTable c={c} base={base} scen={scen} comparing={comparing} />{c.id === 'cut' && intents}</Fragment>)}
      <p className="muted small" role="note">
        Figures are for the side streets inside the study area. Bounding streets and everything outside it are not measured.
      </p>
      </>}
      <aside className="caveat" aria-label="Caveat about fixed demand">
        Trip demand is fixed in this version: the same trips are made before and after every change, so these results are conditional
        simulations of those trips, not forecasts. Real schemes can also remove some traffic, and this calculation has no behavioral demand
        response. For context only, a meta-analysis of monitoring counts at London low-traffic neighborhoods found traffic inside the
        schemes fell by about 47% on average while boundary roads were on average roughly unchanged, with wide variation between schemes
        [<NavLink view="sources" anchor="Thomas2024" className="link">Thomas2024</NavLink>]. Those are counts of all traffic at monitoring
        locations in London; this app counts distinct through cars on study-area side streets, so the figures are not comparable, and a
        result here that differs from that average does not show the model is right or wrong.
        {scenarioCount === 0 ? '' : ' Model parameters are uncalibrated assumptions unless the Sources page says otherwise.'}
      </aside>
      <div className="sr-only" aria-live="polite" role="status">{announce}</div>
    </div>
  );
}

/** Hours and minutes, e.g. 0:12 or 1:00. */
function formatShort(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}

function CardTable({ c, base, scen, comparing }: { c: CardDef; base: Metrics | null; scen: Metrics | null; comparing: boolean }) {
  return (
    <section className="card" aria-labelledby={`card-${c.id}`}>
      <h3 id={`card-${c.id}`}>{c.title}</h3>
      {c.note && <p className="muted small">{c.note}</p>}
      <table className="cmp">
        <thead>
          <tr><th scope="col">Metric</th><th scope="col">Baseline</th><th scope="col">Scenario</th><th scope="col">Change</th></tr>
        </thead>
        <tbody>
          {c.metrics.map((d) => {
            const b = base ? d.get(base) : undefined, s = scen ? d.get(scen) : undefined;
            const df = formatDiff(b, s, d.kind, d.lowerIsBetter);
            return (
              <tr key={d.id}>
                <th scope="row">{d.label}</th>
                <td>{formatValue(d.kind, b)}</td>
                <td>{formatValue(d.kind, s)}</td>
                <td className={`chg ${comparing ? df.verdict.replace(/ /g, '-') : 'neutral'}`}>{comparing ? df.text : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

/** Only the caveat shows: the counts of vehicles, backlog and gridlock cover the whole network. */
function HealthLine({ scen, base }: { scen: Metrics; base: Metrics | null }) {
  const bad = networkHealth(scen).oversaturated || (!!base && networkHealth(base).oversaturated);
  if (!bad) return null;
  return (
    <p className="notice" role="note">
      <strong>The simulated network is oversaturated at this demand level.</strong>{' '}
      Real congestion is worse than the model shows, so treat comparisons with care. Try a lower demand setting or another period.
    </p>
  );
}
