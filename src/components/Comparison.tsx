import { useEffect, useRef, useState } from 'react';
import type { Metrics } from '../types';
import { CARDS, MODE_CARDS, emptyMode, hasModes, networkHealth, summarize, type CardDef, type ModeCardId } from '../lib/metrics';
import { formatClock, formatDiff, formatValue } from '../lib/format';

interface Props {
  base: Metrics | null; scen: Metrics | null; comparing: boolean; scenarioCount: number; onRef(key: string): void;
}

export function Comparison({ base, scen, comparing, scenarioCount, onRef }: Props) {
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
        Baseline and scenario run side by side from the same seed, period and demand, so both show the same elapsed time
        {scen ? <> (<strong>{formatClock(elapsed)}</strong> simulated)</> : null}. Editing the scenario restarts both runs.
      </p>
      {!comparing && (
        <p className="notice" role="note">
          No interventions yet, so the scenario is the baseline. Add an intervention to see the differences.
        </p>
      )}
      {comparing && elapsed < 600 && (
        <p className="notice" role="note">Early results are noisy: let both runs reach at least 10 simulated minutes (use a faster speed).</p>
      )}
      {scen && <HealthLine scen={scen} base={comparing ? base : null} />}
      {CARDS.map((c) => <CardTable key={c.id} c={c} base={base} scen={scen} comparing={comparing} />)}
      {scen && !hasModes(scen) && (
        <section className="card" aria-labelledby="card-modes-na">
          <h3 id="card-modes-na">Walking, biking and buses</h3>
          <p className="muted small">Not available: this simulation build has no walking, biking or bus agents.</p>
        </section>
      )}
      {hasModes(scen) && MODE_CARDS.map((c) => (
        <CardTable key={c.id} c={c} base={base} scen={scen} comparing={comparing} empty={emptyMode(c.id as ModeCardId, [base, scen])} />
      ))}
      <aside className="caveat" aria-label="Caveat about fixed demand">
        Trip demand is fixed in this version: the same trips are made before and after
        every change. Real schemes also remove some traffic. A meta-analysis of London low-traffic neighborhoods found traffic
        inside the schemes fell by about 47% on average while boundary roads were on average roughly unchanged (with wide variation
        between schemes) [<button type="button" className="link" onClick={() => onRef('Thomas2024')}>Thomas2024</button>]. These results show a fixed set of trips redistributed, not a forecast.
        {scenarioCount === 0 ? '' : ' Model parameters are uncalibrated assumptions unless the Sources page says otherwise.'}
      </aside>
      <div className="sr-only" aria-live="polite" role="status">{announce}</div>
    </div>
  );
}

function CardTable({ c, base, scen, comparing, empty }: { c: CardDef; base: Metrics | null; scen: Metrics | null; comparing: boolean; empty?: string | null }) {
  return (
    <section className="card" aria-labelledby={`card-${c.id}`}>
      <h3 id={`card-${c.id}`}>{c.title}</h3>
      {c.note && <p className="muted small">{c.note}</p>}
      {empty ? <p className="notice" role="note">{empty}</p> : (
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
      )}
    </section>
  );
}

function HealthLine({ scen, base }: { scen: Metrics; base: Metrics | null }) {
  const h = networkHealth(scen);
  const hb = base ? networkHealth(base) : null;
  const n = (v: number) => Math.round(v).toLocaleString('en-US');
  const bad = h.oversaturated || !!hb?.oversaturated;
  return (
    <section className="health" aria-labelledby="health-h">
      <h3 id="health-h">Network health</h3>
      <p className="small" aria-label="Network health summary">
        {n(h.inNetwork)} vehicles on the network · {n(h.backlog)} trips waiting to enter · {n(h.gridlockRemoved)} cleared from gridlock · {n(h.unroutable)} unroutable
        {hb ? <span className="muted"> (baseline: {n(hb.backlog)} waiting, {n(hb.gridlockRemoved)} cleared)</span> : null}
      </p>
      {bad && (
        <p className="notice" role="note">
          <strong>The network is oversaturated at this demand level.</strong>{' '}
          {h.oversaturated ? 'In the scenario' : 'In the baseline'}, {(h.oversaturated ? h : hb!).gridlockRemoved > 0
            ? `${n((h.oversaturated ? h : hb!).gridlockRemoved)} vehicles had to be removed to clear gridlock`
            : `${n((h.oversaturated ? h : hb!).backlog)} trips are queued outside waiting to enter`}.
          Delay and speed figures understate real congestion, so treat comparisons with care. Try a lower demand setting or another period.
        </p>
      )}
    </section>
  );
}
