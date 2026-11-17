import { type ReactNode, useId } from 'react';
import type { AreaBundle, Intervention } from '../types';
import type { NetIndex } from '../lib/naming';
import { interventionInRegion, type Region } from '../lib/region';
import { describeIntervention } from '../lib/describe';
import { filterSentence, filterText } from '../lib/blocked';
import { BADGE_TEXT, isSignType, type LetteredType } from '../lib/mapexport';
import { speedSign } from '../lib/slowstreet';
import { speedSignElement } from '../lib/speedsign';
import type { Selection } from '../lib/selection';
import type { Hover } from '../lib/highlight';
import { PlaceSearch } from './PlaceSearch';
import { ThroughRoutes } from './ThroughRoutes';
import type { RouteCheck } from '../lib/throughroutes';
import type { Mode } from '../lib/ramps';
import { canTrace } from '../lib/redistribution-view';

interface Props {
  bundle: AreaBundle; index: NetIndex;
  showService: boolean; onShowService(v: boolean): void;
  region: Region;
  interventions: Intervention[];
  onRemove(i: number): void;
  onClear(): void;
  onChoose(s: Selection): void;
  onHover(h: Hover | null): void;
  onSelectIntervention(i: number): void;
  /** Open "Where traffic goes" for intervention `i` inside the current scenario. */
  onTrace?(i: number): void;
  /** Menu for the selected place when it lives in the panel: above everything on a phone, under the search box otherwise. */
  menuTop?: ReactNode;
  menuInline?: ReactNode;
  /** Rendered next to Clear all, only when the scenario has interventions. */
  shareSlot?: ReactNode;
  routes: { check: RouteCheck; today: number; show: boolean; onShow(v: boolean): void; onHighlight(id: string | null): void; mode: Mode };
}

export function InterventionPanel(p: Props) {
  const { bundle: B, index: X } = p;
  const listId = useId();
  return (
    <div className="iv-panel">
      {p.menuTop}
      {p.interventions.length === 0 ? (
        <p className="muted scn-empty">No interventions yet. Select a street or intersection on the map, or search for one.</p>
      ) : (
        <section className="scn-top" aria-labelledby={`${listId}-scn`}>
          <h3 className="scn-h" id={`${listId}-scn`}>Scenario <span className="count">{p.interventions.length}</span></h3>
          <ol className="scn-list">
            {p.interventions.map((iv, i) => {
              const d = describeIntervention(iv, B.network, X);
              const ft = filterText(iv, B.network, X);
              const sign = speedSign(B.network, iv);
              return (
                <li key={i}>
                  {sign ? <span className="iv-sign static" aria-hidden="true" dangerouslySetInnerHTML={{ __html: speedSignElement(sign.mph, 24) }} /> : <span className={`iv-badge static iv-${iv.type}`} aria-hidden="true">{isSignType(iv.type) ? '' : BADGE_TEXT[iv.type as LetteredType]}</span>}
                  <span className="desc">
                    <button type="button" className="desc-btn" title="Select this place" onClick={() => p.onSelectIntervention(i)}>{d}</button>
                    {!interventionInRegion(iv, B.network, p.region) && <>{' '}<span className="tag">outside the map</span></>}
                    {ft && <span className="iv-more">{filterSentence(ft)}</span>}
                    {p.onTrace && canTrace(iv) && (
                      <button type="button" className="link-btn small" onClick={() => p.onTrace!(i)}>Where traffic goes<span className="sr-only">: {d}</span></button>
                    )}
                  </span>
                  <button type="button" className="btn small-btn" onClick={() => p.onRemove(i)} aria-label={`Remove: ${d}`}>Remove</button>
                </li>
              );
            })}
          </ol>
          <div className="scn-actions">
            <button type="button" className="btn" onClick={p.onClear}>Clear all</button>
            {p.shareSlot}
          </div>
        </section>
      )}
      <ThroughRoutes check={p.routes.check} today={p.routes.today} hasScenario={p.interventions.length > 0} show={p.routes.show} onShow={p.routes.onShow}
        onHighlight={p.routes.onHighlight} mode={p.routes.mode} />
      <PlaceSearch bundle={B} index={X} showService={p.showService} onShowService={p.onShowService} onChoose={p.onChoose} onHover={p.onHover} />
      {p.menuInline}
    </div>
  );
}
