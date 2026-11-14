import { useEffect, useRef } from 'react';
import refs from '../../docs/references.md?raw';
import type { Calibration, Demand } from '../types';
import { Markdown } from './Markdown';
import { calibrationCaveat } from '../lib/caveat';

export function Sources({ demand, synthetic, focusRef, calibration }: { demand: Demand; synthetic: boolean; focusRef?: string | null; calibration?: Calibration }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusRef) root.current?.querySelector<HTMLElement>(`#ref-${CSS.escape(focusRef)}`)?.scrollIntoView({ block: 'start' });
  }, [focusRef]);
  const caveat = calibrationCaveat(calibration);
  return (
    <div className="sources-view" ref={root}>
      <h2>Sources</h2>
      {calibration && (
        <section id="ref-calibration" aria-labelledby="cal-h" tabIndex={-1}>
          <h3 id="cal-h">Calibration</h3>
          <p>{calibration.status === 'calibrated' ? 'The baseline meets the calibration rules against observed traffic, with the limits below.' : 'The baseline is not yet calibrated against observed traffic, so treat results as illustrations and compare scenarios rather than reading absolute numbers.'}</p>
          {calibration.note && <p className="muted">{calibration.note}</p>}
          {caveat && <p>{caveat}</p>}
        </section>
      )}
      <section aria-labelledby="prov-h">
        <h3 id="prov-h">Data provenance{synthetic ? ' (synthetic development data)' : ''}</h3>
        <ul className="prov">
          {demand.provenance.map((p, i) => (
            <li key={i}>
              <strong>{p.source}</strong>
              {/^https?:\/\//.test(p.url) && <>, <a href={p.url} target="_blank" rel="noopener noreferrer">{p.url}</a></>}
              <br /><span className="muted">{p.note}</span>
            </li>
          ))}
        </ul>
        <p className="muted small">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> (ODbL).</p>
      </section>
      <section aria-labelledby="bib-h">
        <h3 id="bib-h">Research references</h3>
        <Markdown source={refs} offset={3} />
      </section>
    </div>
  );
}
