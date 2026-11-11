import { useEffect, useRef } from 'react';
import refs from '../../docs/references.md?raw';
import type { Demand } from '../types';
import { Markdown } from './Markdown';

export function Sources({ demand, synthetic, focusRef }: { demand: Demand; synthetic: boolean; focusRef?: string | null }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusRef) root.current?.querySelector<HTMLElement>(`#ref-${CSS.escape(focusRef)}`)?.scrollIntoView({ block: 'start' });
  }, [focusRef]);
  return (
    <div className="sources-view" ref={root}>
      <h2>Sources</h2>
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
