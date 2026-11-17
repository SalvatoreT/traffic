import refs from '../../docs/references.md?raw';
import type { Calibration, Demand } from '../types';
import { Markdown } from './Markdown';
import { calibrationCaveat } from '../lib/caveat';
import { AnchorHeading, NavLink } from './Anchor';

const RESERVED = ['sources', 'calibration', 'data-provenance', 'research-references'];

/** Provenance entries the Assumptions tab replaces: the demand file written before that tab carries a long paragraph for them. */
const onAssumptionsTab = (source: string) => /^Assumed movement flows/.test(source);

export function Sources({ demand, synthetic, calibration }: { demand: Demand; synthetic: boolean; calibration?: Calibration }) {
  const caveat = calibrationCaveat(calibration);
  return (
    <div className="sources-view">
      <AnchorHeading as="h2" id="sources" label="Sources">Sources</AnchorHeading>
      <p className="assume-pointer">
        The judgment calls in the model, the assumed movement flows and the reasons cars cut through, are on the <NavLink view="assumptions" className="link">Assumptions</NavLink> tab.
      </p>
      {calibration && (
        <section aria-labelledby="calibration">
          <AnchorHeading id="calibration" label="Calibration">Calibration</AnchorHeading>
          <p>{calibration.status === 'calibrated' ? 'The baseline meets the calibration rules against observed traffic, with the limits below.' : 'The baseline is not yet calibrated against observed traffic, so treat results as illustrations and compare scenarios rather than reading absolute numbers.'}</p>
          {calibration.note && <p className="muted">{calibration.note}</p>}
          {caveat && <p>{caveat}</p>}
        </section>
      )}
      <section aria-labelledby="data-provenance">
        <AnchorHeading id="data-provenance" label="Data provenance">Data provenance{synthetic ? ' (synthetic development data)' : ''}</AnchorHeading>
        <ul className="prov">
          {demand.provenance.filter((p) => !onAssumptionsTab(p.source)).map((p, i) => (
            <li key={i}>
              <strong>{/^https?:\/\//.test(p.url) ? <a href={p.url}>{p.source}</a> : p.source}</strong>
              <br /><span className="muted">{p.note}</span>
            </li>
          ))}
        </ul>
        <p className="muted small">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> (ODbL).</p>
      </section>
      <section aria-labelledby="research-references">
        <AnchorHeading id="research-references" label="Research references">Research references</AnchorHeading>
        <div className="refs-cols"><Markdown source={refs} offset={3} anchors={RESERVED} /></div>
      </section>
    </div>
  );
}
