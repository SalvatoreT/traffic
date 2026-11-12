import { lazy, Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { AreaBundle, Intervention, Metrics, ModeVisibility, Overlay, Theme } from './types';
import { loadArea, type LoadProgress } from './data';
import { Loading, LoadError } from './components/Loading';
import { nextSpeedShown } from './lib/speed';
import { SOURCE_REPO_URL } from './config';
import { SimClient, type StatsMsg } from './sim/client';
import { buildIndex } from './lib/naming';
import { decodeMeta, decodeScenario, encodeScenario, nearestStreetName, type Unplaced } from './lib/hash';
import { interventionTypeLabel } from './lib/describe';
import { addInterventions } from './lib/scenario';
import { selectionForIntervention, type Selection } from './lib/selection';
import { interventionPoint } from './lib/describe';
import { nextOverlayMax, OVERLAY_FLOOR, resolveMode, type MaxState } from './lib/ramps';
import { defaultPeriod, initialRun, runReducer } from './lib/run';
import { linkStatsView } from './types';
import { SelectionMenu, type Change, type Placement } from './components/SelectionMenu';
import { Sheet } from './components/Sheet';
import { Playback, Legend } from './components/Toolbar';
import { InterventionPanel } from './components/InterventionPanel';
import { hasModes } from './lib/metrics';
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
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let live = true;
    setErr(''); setBundle(null); setProgress(null);
    loadArea(decodeMeta(location.hash).area, query.get('fixture') === '1', (p) => { if (live) setProgress(p); })
      .then((b) => { if (live) setBundle(b); }, (e) => { if (live) setErr(e instanceof Error ? e.message : String(e)); });
    return () => { live = false; };
  }, [attempt]);
  if (err) return <LoadError title="Could not load the study area." message={err} onRetry={() => setAttempt((a) => a + 1)} />;
  if (!bundle) return <Loading label="Loading study area data…" progress={progress} />;
  return <Simulator key={attempt} bundle={bundle} onRestart={() => setAttempt((a) => a + 1)} />;
}

function Simulator({ bundle, onRestart }: { bundle: AreaBundle; onRestart(): void }) {
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerBtn = useRef<HTMLButtonElement>(null);
  const closeDrawer = useCallback(() => { setDrawerOpen(false); drawerBtn.current?.focus(); }, []);
  const [showService, setShowService] = useState(false);
  const [showOutside, setShowOutside] = useState(false);
  const calStatus = bundle.entry.calibration?.status ?? 'uncalibrated';
  const calNote = bundle.entry.calibration?.note ?? 'Treat results as illustrations, not forecasts.';
  // Dismissal is remembered per note text, so a changed note shows again.
  const calKey = `calnote:${bundle.entry.id}:${calNote.length}:${calNote.slice(0, 24)}:${calNote.slice(-24)}`;
  const [calDismissed, setCalDismissed] = useState(() => store.get(calKey) === '1');
  const [calClosing, setCalClosing] = useState(false);
  const showCal = calStatus !== 'calibrated' && !calDismissed && !bundle.synthetic;
  const dismissCal = () => { setCalClosing(true); store.set(calKey, '1'); window.setTimeout(() => setCalDismissed(true), reduced ? 0 : 200); };
  const [sourceRef, setSourceRef] = useState<string | null>(null);

  const periodId = demand.periods.some((p) => p.id === initial.period) ? initial.period! : defaultPeriod(bundle.entry, demand.periods);
  const [period, setPeriod] = useState(periodId);
  const [scale, setScale] = useState(initial.demandScale ?? 1);
  const [speed, setSpeed] = useState(5);
  const [run, dispatchRun] = useReducer(runReducer, !reduced, initialRun);
  const { running, finished } = run;
  const [interventions, setInterventions] = useState<Intervention[]>(initial.interventions);
  const [overlay, setOverlay] = useState<Overlay>('cutthrough');
  const [modes, setModes] = useState<ModeVisibility>(() => {
    const all: ModeVisibility = { car: true, bicycle: true, pedestrian: true };
    try {
      const saved = JSON.parse(store.get('modes') ?? '{}');
      return { car: saved.car ?? true, bicycle: saved.bicycle ?? true, pedestrian: saved.pedestrian ?? true };
    } catch { return all; }
  });
  const [bikeNet, setBikeNet] = useState(() => store.get('bikeNet') === '1');
  useEffect(() => { store.set('modes', JSON.stringify(modes)); }, [modes]);
  useEffect(() => { store.set('bikeNet', bikeNet ? '1' : '0'); }, [bikeNet]);
  const hasBikeNet = useMemo(() => network.links.some((l) => l.bikeLane || l.bikeRoute), [network]);
  const [notice, setNotice] = useState<{ unplaced: Unplaced[]; invalid: boolean }>({ unplaced: [], invalid: false });
  // Set after mount so the polite live region exists before its content changes.
  useEffect(() => { setNotice({ unplaced: initial.unplaced, invalid: initial.invalid }); }, [initial]);
  const [source, setSource] = useState<'scenario' | 'baseline'>('scenario');

  const [engine, setEngine] = useState<{ kind: 'wasm' | 'mock'; reason?: string } | null>(null);
  const [simError, setSimError] = useState('');
  const [stats, setStats] = useState<StatsMsg | null>(null);
  const [slowSpeed, setSlowSpeed] = useState<number | null>(null);
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
    c.onStats = (s) => { setStats(s); dispatchRun({ type: 'time', time: s.time }); setSlowSpeed((prev) => nextSpeedShown(prev, first.current.speed, s.achievedSpeed)); };
    c.onError = (m) => setSimError(m);
    const f = first.current;
    c.send({
      t: 'init', network: bundle.raw?.network ?? JSON.stringify(network), demand: bundle.raw?.demand ?? JSON.stringify(demand), mock: FORCE_MOCK,
      period: f.period, demandScale: f.scale, seed: 1, interventions: f.interventions, speed: f.speed, running: f.running,
    });
    setClient(c);
    return () => { c.terminate(); setClient(null); };
  }, [network, demand, bundle.raw]);
  const firstRun = useRef(true);
  useEffect(() => { client?.send({ t: 'run', running }); setSlowSpeed(null); }, [running, client]);
  const wasFinished = useRef(false);
  useEffect(() => {
    if (finished && !wasFinished.current) say('Run finished.');
    wasFinished.current = finished;
  }, [finished, say]);
  const runAgain = useCallback(() => { client?.send({ t: 'reset' }); dispatchRun({ type: 'restart' }); }, [client]);
  useEffect(() => { client?.send({ t: 'speed', speed }); setSlowSpeed(null); }, [speed, client]);
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    dispatchRun({ type: 'restart' });
    const id = window.setTimeout(() => client?.send({ t: 'config', period, demandScale: scale }), 250);
    return () => window.clearTimeout(id);
  }, [period, scale]); // eslint-disable-line
  const ivFirst = useRef(true);
  useEffect(() => {
    if (ivFirst.current) { ivFirst.current = false; return; }
    dispatchRun({ type: 'restart' });
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
      setNotice({ unplaced: st.unplaced, invalid: st.invalid });
      if (JSON.stringify(st.interventions) !== JSON.stringify(first.current.interventions)) setInterventions(st.interventions);
    };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, [network]);

  // --- interventions API
  const onApply = useCallback((change: Change, msg: string) => {
    setInterventions((cur) => addInterventions(change.remove ? cur.filter((x) => !change.remove!(x)) : cur, change.add));
    say(msg);
  }, [say]);
  const onRemove = useCallback((i: number) => { setInterventions((c) => c.filter((_, j) => j !== i)); say('Intervention removed.'); }, [say]);
  const onClear = useCallback(() => { setInterventions([]); say('All interventions cleared.'); }, [say]);

  // --- selection: pick a place first, then act on it
  const [selection, setSelection] = useState<Selection | null>(null);
  const selRef = useRef<Selection | null>(null);
  selRef.current = selection;
  const opener = useRef<HTMLElement | null>(null);
  const [raiseSheet, setRaiseSheet] = useState(0);
  const select = useCallback((s: Selection, from?: HTMLElement | null) => {
    if (!selRef.current) opener.current = from ?? (document.activeElement as HTMLElement | null);
    setSelection(s);
    if (s.via !== 'search') {
      setPanelTab('scenario');
      setRaiseSheet((n) => n + 1);
      if (s.via === 'map') setDrawerOpen(false);
    }
  }, []);
  const clearSelection = useCallback(() => {
    if (!selRef.current) return;
    setSelection(null);
    window.setTimeout(() => {
      const el = opener.current;
      const active = document.activeElement;
      if (active && active !== document.body && !active.closest('.sel-menu')) return;
      if (el?.isConnected && !el.closest('[inert]')) el.focus();
      if (document.activeElement === document.body || document.activeElement?.closest('.sel-menu')) drawerBtn.current?.focus();
    }, 0);
  }, []);
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape' && !e.defaultPrevented) clearSelection(); };
    document.addEventListener('keydown', f);
    return () => document.removeEventListener('keydown', f);
  }, [clearSelection]);
  const onHit = useCallback((s: Selection | null) => { if (s) select(s); else clearSelection(); }, [select, clearSelection]);
  const onSelectIntervention = useCallback((i: number) => {
    const iv = first.current.interventions[i];
    if (!iv) return;
    const pt = iv.type === 'speed_hump' ? interventionPoint(iv, network) : null;
    const s = selectionForIntervention(network, index, iv, pt, 'list');
    if (s) select(s, layout === 'medium' ? drawerBtn.current : undefined);
  }, [network, index, select, layout]);

  // --- overlay scale (latched so the legend does not jitter)
  const shownStats = source === 'baseline' && stats?.comparing ? stats.baseline : stats?.scenario;
  const linkStats = shownStats?.linkStats ?? null;
  const maxRef = useRef<{ flow: MaxState; cutthrough: MaxState }>({ flow: { max: 0, changedAt: 0 }, cutthrough: { max: 0, changedAt: 0 } });
  const overlayMax = useMemo(() => {
    if (overlay === 'speed') return 1;
    const v = linkStatsView(linkStats);
    const vals: number[] = [];
    for (let i = 0; i < network.links.length; i++) {
      const x = overlay === 'flow' ? v.flow(i) : v.cut(i);
      if (x > 0) vals.push(x); // links with no traffic are not drawn, so they must not set the scale
    }
    const next = nextOverlayMax(vals, OVERLAY_FLOOR[overlay], maxRef.current[overlay], performance.now());
    maxRef.current[overlay] = next;
    return next.max;
  }, [linkStats, overlay, network]);

  const base: Metrics | null = stats?.baseline.metrics ?? null;
  const scen: Metrics | null = stats?.scenario.metrics ?? null;
  const comparing = !!stats?.comparing;
  const multimodal = hasModes(scen);
  const mapVisible = view === 'map';
  const showPanel = view !== 'sources';
  const placement: Placement | null = !selection ? null : selection.via === 'search' || !mapVisible ? 'inline' : phone ? 'sheet' : 'popover';
  const menu = selection && placement ? (
    <SelectionMenu bundle={bundle} index={index} selection={selection} interventions={interventions} placement={placement}
      onApply={onApply} onRemove={onRemove} onClose={clearSelection} />
  ) : null;

  const shareButton = (
    <button type="button" className="btn" onClick={() => { navigator.clipboard?.writeText(location.href).then(() => say('Link to this scenario copied.'), () => say('Copy failed. The address bar already holds the link.')); }}>Copy link to this scenario</button>
  );
  const scenarioPanel = (
    <>
      <InterventionPanel bundle={bundle} index={index} showService={showService} onShowService={setShowService} showOutside={showOutside} onShowOutside={setShowOutside} interventions={interventions}
        onRemove={onRemove} onClear={onClear} onChoose={select} onSelectIntervention={onSelectIntervention}
        menuTop={placement === 'sheet' ? menu : null} menuInline={placement === 'inline' ? menu : null} shareSlot={shareButton} />
      <div className="scn-notices" role="status" aria-live="polite">
        {notice.invalid && (
          <p className="notice" key="invalid">
            <span>This link couldn't be read, so the baseline is shown.</span>
            <button type="button" className="btn small-btn" onClick={() => setNotice((n) => ({ ...n, invalid: false }))}>Dismiss</button>
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
      {interventions.length === 0 && <div className="share">{shareButton}</div>}
      <p className="toast" aria-hidden="true">{toast}</p>
    </>
  );
  const resultsPanel = (
    <Comparison base={base} scen={scen} comparing={comparing} finished={finished} scenarioCount={interventions.length} onRef={(k) => { setSourceRef(k); setView('sources'); }} />
  );

  return (
    <div className={`app layout-${layout}`} data-view={view}>
      <a className="skip" href="#main">Skip to main content</a>
      <p className="sr-only" role="status" aria-live="polite">{toast}</p>
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
          {(bundle.synthetic || engine?.kind === 'mock' || (simError && engine) || showCal) && (
            <div className="banners">
              {showCal && (
                <div className={`cal-collapse ${calClosing ? 'closing' : ''}`}>
                  <p className="notice calm cal-line" role="note">
                    <span className="cal-text" title={calNote}>
                      <strong>Preview, not yet calibrated.</strong>{' '}{calNote}
                    </span>
                    <button type="button" className="link" onClick={() => { setSourceRef('calibration'); setView('sources'); }}>Details</button>
                    <button type="button" className="btn small-btn" onClick={dismissCal}>Dismiss</button>
                  </p>
                </div>
              )}
              {bundle.synthetic && <p className="notice" role="note">Showing a synthetic fixture area because the study-area data files were not found.</p>}
              {engine?.kind === 'mock' && <p className="notice" role="note">Using the built-in mock simulation ({engine.reason}). Vehicle behavior and metrics are illustrative only.</p>}
              {simError && engine && <p className="notice err" role="alert">{simError}</p>}
            </div>
          )}
          {view !== 'sources' && (
            <Playback
              running={running} finished={finished} onToggle={() => (finished ? runAgain() : dispatchRun({ type: 'toggle' }))}
              onReset={() => { client?.send({ t: 'reset' }); dispatchRun({ type: 'restart' }); say('Simulation reset.'); }}
              entry={bundle.entry}
              speed={speed} onSpeed={setSpeed} periods={demand.periods} period={period} onPeriod={setPeriod}
              scale={scale} onScale={setScale} time={run.time} reducedMotion={reduced}
              achieved={running ? slowSpeed : null}
            />
          )}
          <div className="map-area" hidden={!mapVisible}>
            <Suspense fallback={<p className="boot" role="status">Loading map…</p>}>
            <MapView
              bundle={bundle} index={index} mode={mode} overlay={overlay} overlayMax={overlayMax} linkStats={linkStats}
              client={client} interventions={interventions} selection={mapVisible ? selection : null} onHit={onHit}
              popover={placement === 'popover' ? menu : null}
              visible={mapVisible} reducedMotion={reduced}
              modes={multimodal ? modes : { ...modes, bicycle: false, pedestrian: false }} showBikeNet={bikeNet && multimodal}
            />
            </Suspense>
            <Legend overlay={overlay} onOverlay={setOverlay} max={overlayMax} mode={mode} 
              source={source} onSource={setSource} canCompare={comparing}
              multimodal={multimodal} modes={modes} onModes={setModes} hasBikeNet={hasBikeNet} bikeNet={bikeNet} onBikeNet={setBikeNet} />
            {!engine && (
              <div className="map-cover">
                {simError
                  ? <LoadError title="The simulation could not start." message={simError} onRetry={onRestart} />
                  : <Loading label="Starting the simulation engine…" />}
              </div>
            )}
          </div>
          {view === 'streets' && (
            <StreetsTable bundle={bundle} index={index} showService={showService} onShowService={setShowService} showOutside={showOutside} onShowOutside={setShowOutside}
              scen={stats?.scenario.linkStats ?? null} base={stats?.baseline.linkStats ?? null} comparing={comparing}
              baseMetrics={base} scenMetrics={scen} />
          )}
          {view === 'sources' && <Suspense fallback={<p className="boot" role="status">Loading sources…</p>}><Sources demand={demand} synthetic={bundle.synthetic} focusRef={sourceRef} calibration={bundle.synthetic ? undefined : { status: calStatus, note: bundle.entry.calibration?.note }} /></Suspense>}
        </div>

        {showPanel && !phone && (
          <aside key="right" id="results-panel" className="side side-right" aria-labelledby="results-h">
            <div className="side-head"><h2 id="results-h">Results</h2></div>
            <div className="side-body">{resultsPanel}</div>
          </aside>
        )}
        {showPanel && phone && (
          <Sheet key="sheet" label="Scenario and results" raise={raiseSheet}
            tabs={
              <div className="tabs" role="tablist" aria-label="Panel sections">
                {(['scenario', 'results'] as const).map((t) => (
                  <button key={t} type="button" role="tab" id={`tab-${t}`} aria-selected={panelTab === t} aria-controls={`tabpanel-${t}`}
                    tabIndex={panelTab === t ? 0 : -1} onClick={() => setPanelTab(t)}
                    onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = panelTab === 'scenario' ? 'results' : 'scenario'; setPanelTab(n); document.getElementById(`tab-${n}`)?.focus(); } }}>
                    {t === 'scenario' ? `Scenario${interventions.length ? ` (${interventions.length})` : ''}` : 'Results'}
                  </button>
                ))}
              </div>
            }>
            <h2 className="sr-only">Scenario and results</h2>
            <div role="tabpanel" id="tabpanel-scenario" aria-labelledby="tab-scenario" hidden={panelTab !== 'scenario'}>{scenarioPanel}</div>
            <div role="tabpanel" id="tabpanel-results" aria-labelledby="tab-results" hidden={panelTab !== 'results'}>{resultsPanel}</div>
          </Sheet>
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
