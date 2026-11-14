import type { Demand } from '../types';
import { BASIS_HELP, BASIS_TEXT } from '../lib/intents';

/** The reasons the "Why cars cut through" table uses, with what each rests on. */
export function IntentSources({ demand }: { demand: Demand }) {
  const intents = demand.intents;
  if (!intents?.length) return null;
  return (
    <section id="ref-intents" aria-labelledby="intents-h" tabIndex={-1}>
      <h3 id="intents-h">Why cars cut through: the reasons the model tallies</h3>
      <p>
        These are hypotheses about why drivers cross the study area without an end in it. A through trip that uses a residential or service street is filed under the first reason whose
        origin and destination fit; any other goes under Other. {BASIS_TEXT.observed}: {BASIS_HELP.observed} {BASIS_TEXT.assumed}: {BASIS_HELP.assumed}
      </p>
      <ul className="prov">
        {intents.map((i) => (
          <li key={i.id}>
            <strong>{i.label}</strong> ({BASIS_TEXT[i.basis]})
            {i.avoids && <><br /><span className="muted">Would otherwise use: {i.avoids} (the model's shortest free-flow route with the side streets closed).</span></>}
            <br /><span className="muted">{i.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
