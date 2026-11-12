import { type ReactNode, useId } from 'react';
import type { AreaBundle, Intervention } from '../types';
import type { NetIndex } from '../lib/naming';
import { interventionInRegion, type Region } from '../lib/region';
import { describeIntervention } from '../lib/describe';
import type { Selection } from '../lib/selection';
import { PlaceSearch } from './PlaceSearch';
import { ThroughRoutes } from './ThroughRoutes';
import type { RouteCheck } from '../lib/throughroutes';
import type { Mode } from '../lib/ramps';

interface Props {
  bundle: AreaBundle; index: NetIndex;
  showService: boolean; onShowService(v: boolean): void;
  region: Region;
  interventions: Intervention[];
  onRemove(i: number): void;
  onClear(): void;
  onChoose(s: Selection): void;
  onSelectIntervention(i: number): void;
  /** Menu for the selected place when it lives in the panel: above everything on a phone, under the search box otherwise. */
  menuTop?: ReactNode;
  menuInline?: ReactNode;
  /** Rendered next to Clear all, only when the scenario has interventions. */
  shareSlot?: ReactNode;
  routes: { check: RouteCheck; today: number; show: boolean; onShow(v: boolean): void; onHighlight(id: string | null): void; mode: Mode };
}

const BADGE: Record<Intervention['type'], string> = {
  modal_filter: 'MF', speed_hump: 'SH', speed_limit: '', traffic_circle: 'TC', control: 'IC', signal_timing: 'ST', one_way: '1W', turn_ban: 'TB', diagonal_diverter: 'DD',
};

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
              return (
                <li key={i}>
                  <span className={`iv-badge static iv-${iv.type}`} aria-hidden="true">{iv.type === 'speed_limit' ? Math.round(iv.speed * 2.23694) : BADGE[iv.type]}</span>
                  <span className="desc">
                    <button type="button" className="desc-btn" title="Select this place" onClick={() => p.onSelectIntervention(i)}>{d}</button>
                    {!interventionInRegion(iv, B.network, p.region) && <>{' '}<span className="tag">outside the map</span></>}
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
      <PlaceSearch bundle={B} index={X} showService={p.showService} onShowService={p.onShowService} onChoose={p.onChoose} />
      {p.menuInline}
    </div>
  );
}
