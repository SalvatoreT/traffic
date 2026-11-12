import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AreaBundle, Intervention, Metrics, Overlay, Theme } from './types';
import { loadArea } from './data';
import { SOURCE_REPO_URL } from './config';
import { SimClient, type StatsMsg } from './sim/client';
import { buildIndex } from './lib/naming';
import { decodeMeta, decodeScenario, encodeScenario, nearestStreetName, type Unplaced } from './lib/hash';
import { interventionTypeLabel } from './lib/describe';
import { addInterventions } from './lib/scenario';
import { niceMax, percentile, resolveMode } from './lib/ramps';
import { linkStatsView } from './types';
import type { PickKind } from './components/MapView';
import { Playback, Legend } from './components/Toolbar';
import { InterventionPanel, type PickHandlers } from './components/InterventionPanel';
import { Comparison } from './components/Comparison';
import { StreetsTable } from './components/StreetsTable';
const MapView = lazy(() => import('./components/MapView').then((m) => ({ default: m.MapView })));
const Sources = lazy(() => import('./components/Sources').then((m) => ({ default: m.Sources })));

type View = 'map' | 'streets' | 'sources';
const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* unavailable */ } },
};
const query = new URLSearchParams(location.search);
const FORCE_MOCK = query.get('mock') === '1';

function useMedia(q: string): boolean {
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const f = () => setM(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, [q]);
  return m;
}

export function App() {
  const [bundle, setBundle] = useState<AreaBundle | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    loadArea(decodeMeta(location.hash).area, query.get('fixture') === '1').then(setBundle, (e) => setErr(String(e)));
  }, []);
  if (err) return <p role="alert" className="boot">Could not load the study area: {err}</p>;
  if (!bundle) return <p className="boot" role="status">Loading study area…</p>;
  return <Simulator bundle={bundle} />;
}

function Simulator({ bundle }: { bundle: AreaBundle }) {
  const { network, demand } = bundle;
  const index = useMemo(() => buildIndex(network), [network]);
  // Read once: the hash is rewritten as soon as the scenario loads, so later renders must not decode it again.
  const [initial] = useState(() => ({ ...decodeMeta(location.hash), ...decodeScenario(network, location.hash) }));

  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const prefersDark = useMedia('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState<Theme>(() => (store.get('theme') as Theme) || 'auto');
  const phone = useMedia('(max-width: 719.98px)');
  const medium = useMedia('(max-width: 1099.98px)');
  const layout = phone ? 'phone' : medium ? 'medium' : 'wide';
  const mode = resolveMode(theme, prefersDark);
  useEffect(() => {
    const r = document.documentElement;
    if (theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', theme);
    store.set('theme', theme);
  }, [theme]);

  const [view, setView] = useState<View>('map');
  const [panelTab, setPanelTab] = useState<'scenario' | 'results'>('scenario');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerBtn = useRef<HTMLButtonElement>(null);
  const closeDrawer = useCallback(() => { setDrawerOpen(false); drawerBtn.current?.focus(); }, []);
  const [showService, setShowService] = useState(false);
  const calStatus = bundle.entry.calibration?.status ?? 'uncalibrated';
  const calKey = `calnote:${bundle.entry.id}`;
  const [calDismissed, setCalDismissed] = useState(() => store.get(calKey) === '1');
  const showCal = calStatus !== 'calibrated' && !calDismissed && !bundle.synthetic;
  const [sourceRef, setSourceRef] = useState<string | null>(null);

  const periodId = demand.periods.some((p) => p.id === initial.period) ? initial.period! : demand.periods[0]?.id ?? '';
  const [period, setPeriod] = useState(periodId);
  const [scale, setScale] = useState(initial.demandScale ?? 1);
  const [speed, setSpeed] = useState(5);
  const [running, setRunning] = useState(!reduced);
  const [interventions, setInterventions] = useState<Intervention[]>(initial.interventions);
  const [overlay, setOverlay] = useState<Overlay>('cutthrough');
  const [notice, setNotice] = useState<{ unplaced: Unplaced[]; legacy: boolean }>({ unplaced: [], legacy: false });
  // Set after mount so the polite live region exists before its content changes.
  useEffect(() => { setNotice({ unplaced: initial.unplaced, legacy: initial.legacy }); }, [initial]);
  const [source, setSource] = useState<'scenario' | 'baseline'>('scenario');

  const [engine, setEngine] = useState<{ kind: 'wasm' | 'mock'; reason?: string } | null>(null);
  const [simError, setSimError] = useState('');
  const [stats, setStats] = useState<StatsMsg | null>(null);
  const [clock, setClock] = useState(0);
  const [client, setClient] = useState<SimClient | null>(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number>(0);
  const say = useCallback((m: string) => {
    setToast(m); window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 6000);
  }, []);

  // --- worker lifecycle
  const first = useRef({ period, scale, speed, running, interventions });
  first.current = { period, scale, speed, running, interventions };
  useEffect(() => {
    const c = new SimClient();
    c.onReady = (kind, reason) => setEngine({ kind, reason });
    c.onStats = (s) => { setStats(s); setClock(s.time); };
    c.onError = (m) => setSimError(m);
    const f = first.current;
    c.send({
      t: 'init', network: JSON.stringify(network), demand: JSON.stringify(demand), transit: transitJson, mock: FORCE_MOCK,
      period: f.period, demandScale: f.scale, seed: 1, interventions: f.interventions, speed: f.speed, running: f.running,
    });
    setClient(c);
    return () => { c.terminate(); setClient(null); };
  }, [network, demand]);
  const firstRun = useRef(true);
  useEffect(() => { client?.send({ t: 'run', running }); }, [running, client]);
  useEffect(() => { client?.send({ t: 'speed', speed }); }, [speed, client]);
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    const id = window.setTimeout(() => client?.send({ t: 'config', period, demandScale: scale }), 250);
    return () => window.clearTimeout(id);
  }, [period, scale]); // eslint-disable-line
  const ivFirst = useRef(true);
  useEffect(() => {
    if (ivFirst.current) { ivFirst.current = false; return; }
    client?.setInterventions(interventions);
  }, [interventions]); // eslint-disable-line

  // --- URL hash
  useEffect(() => {
    const h = encodeScenario(network, interventions, { area: bundle.synthetic ? null : bundle.entry.id, period, demandScale: scale });
    history.replaceState(null, '', `${location.pathname}${location.search}${h}`);
  }, [bundle, network, period, scale, interventions]);
  useEffect(() => {
    const f = () => {
      const st = decodeScenario(network, location.hash);
      setNotice({ unplaced: st.unplaced, legacy: st.legacy });
      if (JSON.stringify(st.interventions) !== JSON.stringify(first.current.interventions)) setInterventions(st.interventions);
    };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, [network]);

  // --- interventions API
  const onAdd = useCallback((list: Intervention[], msg: string) => {
    if (list.length) setInterventions((cur) => addInterventions(cur, list));
    say(msg);
  }, [say]);
  const onRemove = useCallback((i: number) => { setInterventions((c) => c.filter((_, j) => j !== i)); say('Intervention removed.'); }, [say]);
  const onClear = useCallback(() => { setInterventions([]); say('All interventions cleared.'); }, [say]);
  const [pick, setPick] = useState<{ kind: PickKind; dir: boolean }>({ kind: null, dir: false });
  const pickHandlers = useRef<PickHandlers | null>(null);
  const registerPick = useCallback((h: PickHandlers | null) => { pickHandlers.current = h; }, []);
  const onPickMode = useCallback((kind: PickKind, dir: boolean) => setPick({ kind, dir }), []);

  // --- overlay scale (latched so the legend does not jitter)
  const shownStats = source === 'baseline' && stats?.comparing ? stats.baseline : stats?.scenario;
  const linkStats = shownStats?.linkStats ?? null;
  const maxRef = useRef({ flow: 0, cutthrough: 0 });
  const overlayMax = useMemo(() => {
    if (overlay === 'speed') return 1;
    const v = linkStatsView(linkStats);
    const vals: number[] = [];
    for (let i = 0; i < network.links.length; i++) vals.push(overlay === 'flow' ? v.flow(i) : v.cut(i));
    const m = niceMax(percentile(vals, 0.98));
    const cur = maxRef.current[overlay];
    if (m > cur || m < cur / 4) maxRef.current[overlay] = m;
    return maxRef.current[overlay] || m;
  }, [linkStats, overlay, network]);

  const base: Metrics | null = stats?.baseline.metrics ?? null;
  const scen: Metrics | null = stats?.scenario.metrics ?? null;
  const comparing = !!stats?.comparing;
  const mapVisible = view === 'map';
  const showPanel = view !== 'sources';

  const scenarioPanel = (
    <>
      <InterventionPanel bundle={bundle} index={index} showService={showService} onShowService={setShowService} interventions={interventions}
        onAdd={onAdd} onRemove={onRemove} onClear={onClear} onPickMode={onPickMode} registerPick={registerPick} />
      <div className="scn-notices" role="status" aria-live="polite">
        {notice.legacy && (
          <p className="notice" key="legacy">
            <span>This link was made before a map update and can't be restored. Starting from today's baseline.</span>
            <button type="button" className="btn small-btn" onClick={() => setNotice((n) => ({ ...n, legacy: false }))}>Dismiss</button>
          </p>
        )}
        {notice.unplaced.length > 0 && (
          <div className="notice" key="unplaced">
            <p>{notice.unplaced.length === 1 ? '1 intervention' : `${notice.unplaced.length} interventions`} couldn't be placed on the current map and {notice.unplaced.length === 1 ? 'was' : 'were'} left out:</p>
            <ul>
              {notice.unplaced.map((u, i) => {
                const street = nearestStreetName(network, u.lon, u.lat);
                return <li key={i}>{interventionTypeLabel(u.type)}{street ? `, near ${street}` : ''}. {u.reason}</li>;
              })}
            </ul>
            <button type="button" className="btn small-btn" onClick={() => setNotice((n) => ({ ...n, unplaced: [] }))}>Dismiss</button>
          </div>
        )}
      </div>
      <div className="share">
        <button type="button" className="btn" onClick={() => { navigator.clipboard?.writeText(location.href).then(() => say('Link to this scenario copied.'), () => say('Copy failed. The address bar already holds the link.')); }}>Copy link to this scenario</button>
      </div>
      <p className="toast" role="status">{toast}</p>
    </>
  );
  const resultsPanel = (
    <Comparison base={base} scen={scen} comparing={comparing} scenarioCount={interventions.length} onRef={(k) => { setSourceRef(k); setView('sources'); }} />
  );

  return (
    <div className={`app layout-${layout}`} data-view={view}>
      <a className="skip" href="#main">Skip to main content</a>
      <header className="top">
        <div className="brand">
          <h1>Traffic <span className="area">{bundle.entry.name}</span></h1>
        </div>
        <nav aria-label="Views">
          {(['map', 'streets', 'sources'] as View[]).map((v) => (
            <button key={v} type="button" className="navbtn" aria-current={view === v ? 'page' : undefined} onClick={() => setView(v)}>
              {v === 'map' ? 'Map' : v === 'streets' ? 'Streets' : 'Sources'}
            </button>
          ))}
        </nav>
        <div className="prefs">
          {showPanel && layout === 'medium' && (
            <button ref={drawerBtn} type="button" className="btn drawer-toggle" aria-expanded={drawerOpen} aria-controls="scenario-panel" onClick={() => setDrawerOpen((o) => !o)}>
              Scenario ({interventions.length})
            </button>
          )}
          <label className="inline"><span className="lbl">Theme</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
              <option value="auto">System</option><option value="light">Light</option><option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </header>

      <main id="main" tabIndex={-1} className={`layout-${layout}`}>
        {showPanel && !phone && (
          <aside key="left" id="scenario-panel" className={`side side-left ${drawerOpen ? 'open' : ''}`} aria-labelledby="scenario-h"
            onKeyDown={(e) => { if (e.key === 'Escape' && layout === 'medium' && drawerOpen) { e.stopPropagation(); closeDrawer(); } }}>
            <div className="side-head">
              <h2 id="scenario-h">Scenario</h2>
              {layout === 'medium' && <button type="button" className="btn small-btn" onClick={closeDrawer}>Close</button>}
            </div>
            <div className="side-body">{scenarioPanel}</div>
          </aside>
        )}
        <div key="stage" className="stage">
          {(bundle.synthetic || engine?.kind === 'mock' || simError || showCal) && (
            <div className="banners">
              {showCal && (
                <p className="notice calm" role="note">
                  <span>Preview: the baseline is not yet calibrated against observed traffic, so treat results as illustrations.
                    {bundle.entry.calibration?.note ? ` ${bundle.entry.calibration.note}` : ''}</span>
                  <button type="button" className="btn small-btn" onClick={() => { setCalDismissed(true); store.set(calKey, '1'); }}>Dismiss</button>
                </p>
              )}
              {bundle.synthetic && <p className="notice" role="note">Showing a synthetic fixture area because the study-area data files were not found.</p>}
              {engine?.kind === 'mock' && <p className="notice" role="note">Using the built-in mock simulation ({engine.reason}). Vehicle behavior and metrics are illustrative only.</p>}
              {simError && <p className="notice err" role="alert">{simError}</p>}
            </div>
          )}
          {view !== 'sources' && (
            <Playback
              running={running} onToggle={() => setRunning((r) => !r)}
              onReset={() => { client?.send({ t: 'reset' }); say('Simulation reset.'); }}
              speed={speed} onSpeed={setSpeed} periods={demand.periods} period={period} onPeriod={setPeriod}
              scale={scale} onScale={setScale} time={clock} reducedMotion={reduced}
            />
          )}
          <div className="map-area" hidden={!mapVisible}>
            <Suspense fallback={<p className="boot" role="status">Loading map…</p>}>
            <MapView
              bundle={bundle} index={index} mode={mode} overlay={overlay} overlayMax={overlayMax} linkStats={linkStats}
              client={client} interventions={interventions} pick={mapVisible ? pick.kind : null} pickDirectional={pick.dir}
              onPickLink={(id) => pickHandlers.current?.link(id)} onPickNode={(id) => pickHandlers.current?.node(id)}
              visible={mapVisible} reducedMotion={reduced}
            />
            </Suspense>
            <Legend overlay={overlay} onOverlay={setOverlay} max={overlayMax} mode={mode} 
              source={source} onSource={setSource} canCompare={comparing} />
          </div>
          {view === 'streets' && (
            <StreetsTable bundle={bundle} index={index} showService={showService} onShowService={setShowService}
              scen={stats?.scenario.linkStats ?? null} base={stats?.baseline.linkStats ?? null} comparing={comparing} />
          )}
          {view === 'sources' && <Suspense fallback={<p className="boot" role="status">Loading sources…</p>}><Sources demand={demand} synthetic={bundle.synthetic} focusRef={sourceRef} /></Suspense>}
        </div>

        {showPanel && !phone && (
          <aside key="right" id="results-panel" className="side side-right" aria-labelledby="results-h">
            <div className="side-head"><h2 id="results-h">Results</h2></div>
            <div className="side-body">{resultsPanel}</div>
          </aside>
        )}
        {showPanel && phone && (
          <aside key="sheet" className={`panel ${sheetOpen ? 'open' : ''}`} aria-label="Scenario and results">
            <button type="button" className="sheet-handle" aria-expanded={sheetOpen} aria-controls="panel-body" onClick={() => setSheetOpen((o) => !o)}>
              <span aria-hidden="true" className="grip" />
              {sheetOpen ? 'Hide panel' : `Scenario & results (${interventions.length})`}
            </button>
            <div id="panel-body" className="panel-body">
              <h2 className="sr-only">Scenario and results</h2>
              <div className="tabs" role="tablist" aria-label="Panel sections">
                {(['scenario', 'results'] as const).map((t) => (
                  <button key={t} type="button" role="tab" id={`tab-${t}`} aria-selected={panelTab === t} aria-controls={`tabpanel-${t}`}
                    tabIndex={panelTab === t ? 0 : -1} onClick={() => setPanelTab(t)}
                    onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = panelTab === 'scenario' ? 'results' : 'scenario'; setPanelTab(n); document.getElementById(`tab-${n}`)?.focus(); } }}>
                    {t === 'scenario' ? 'Scenario' : 'Results'}
                  </button>
                ))}
              </div>
              <div role="tabpanel" id="tabpanel-scenario" aria-labelledby="tab-scenario" hidden={panelTab !== 'scenario'}>{scenarioPanel}</div>
              <div role="tabpanel" id="tabpanel-results" aria-labelledby="tab-results" hidden={panelTab !== 'results'}>{resultsPanel}</div>
            </div>
          </aside>
        )}
      </main>
      <footer className="foot">
        <span className="foot-left">
          <span>Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>.</span>{' '}
          <button type="button" className="link" onClick={() => { setSourceRef(null); setView('sources'); }}>Sources &amp; assumptions</button>
        </span>
        <a className="foot-right" href={SOURCE_REPO_URL} target="_blank" rel="noopener noreferrer">Source on GitHub</a>
      </footer>
    </div>
  );
}
