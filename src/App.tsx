import { lazy, Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ScrollRow } from './components/ScrollRow';
import { NavContext, NavLink, type Nav } from './components/Anchor';
import { scrollToAnchor } from './lib/anchor-scroll';
import { canonicalAnchor, parseLocation, scenarioOnly, titleFor, urlFor, VIEWS, type View } from './lib/route';
import type { AreaBundle, Intervention, Metrics, ModeVisibility, Overlay, Theme } from './types';
import { loadArea, type LoadProgress } from './data';
import { Loading, LoadError } from './components/Loading';
import { DEFAULT_SPEED, INSTANT, isInstant, nextSpeedShown } from './lib/speed';
import { SOURCE_REPO_URL } from './config';
import { SimClient, type StatsMsg } from './sim/client';
import { buildIndex } from './lib/naming';
import { buildRegion } from './lib/region';
import { decodeMeta, decodeScenario, encodeScenario, nearestStreetName, type Unplaced } from './lib/hash';
import { interventionTypeLabel } from './lib/describe';
import { addInterventions } from './lib/scenario';
import { selectionForIntervention, type Selection } from './lib/selection';
import { interventionPoint } from './lib/describe';
import { overlayTop, resolveMode } from './lib/ramps';
import { defaultPeriod, initialRun, isEarly, RUN_SECONDS, runReducer } from './lib/run';
import { SelectionMenu, type Change, type Placement } from './components/SelectionMenu';
import { Sheet } from './components/Sheet';
import { Playback, Legend } from './components/Toolbar';
import type { ImageFormat } from './lib/mapexport';
import { InterventionPanel } from './components/InterventionPanel';
import { hasModes } from './lib/metrics';
import { Comparison } from './components/Comparison';
import type { Hover } from './lib/highlight';
import { StreetsTable } from './components/StreetsTable';
import { Proposals, useProposals } from './components/Proposals';
import { fetchProposals, hashLoaded, linkHash, proposalsUrl, type LoadedHashes, type Proposal } from './lib/proposals';
import { findBySlug, findPublished, pathOfSlug, slugFromPath, slugOf } from './lib/share-path';
import { fetchResult, resultKey, STORED_NOTE, toStatsMsg, verdict, type StoredResult } from './lib/stored-results';
import { IntentPanel } from './components/IntentPanel';
import { intentPaths, rampOfIntent, rampPoint, segmentWidths } from './lib/intents';
import { baselineCheck, checkThroughRoutes, routeHeadline } from './lib/throughroutes';
import { effectiveView, initViewState, viewReducer } from './lib/change';
import { showCalibrationBanner } from './lib/caveat';
import { mapSymbols } from './lib/legend';
import { symbolOf } from './lib/signs';
import type { RedistRequest } from './components/Redistribution';
import { canTrace } from './lib/redistribution-view';
const MapView = lazy(() => import('./components/MapView').then((m) => ({ default: m.MapView })));
const Sources = lazy(() => import('./components/Sources').then((m) => ({ default: m.Sources })));
const Methodology = lazy(() => import('./components/Methodology').then((m) => ({ default: m.Methodology })));
const Assumptions = lazy(() => import('./components/Assumptions').then((m) => ({ default: m.Assumptions })));
const Redistribution = lazy(() => import('./components/Redistribution').then((m) => ({ default: m.Redistribution })));

const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* unavailable */ } },
};
const query = new URLSearchParams(location.search);
const NO_HASHES: LoadedHashes = { network: null, demand: null };
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
    loadArea(decodeMeta(scenarioOnly(location.hash)).area, query.get('fixture') === '1', (p) => { if (live) setProgress(p); })
      .then((b) => { if (live) setBundle(b); }, (e) => { if (live) setErr(e instanceof Error ? e.message : String(e)); });
    return () => { live = false; };
  }, [attempt]);
  // A proposal's share path (`/p/<slug>`) is looked up in the area's proposals file before the map starts, so the page opens as that proposal's own link would.
  const slug = useMemo(() => slugFromPath(location.pathname), []);
  const [start, setStart] = useState<Start | null>(null);
  useEffect(() => {
    if (!bundle || slug === null) return;
    let live = true;
    void fetchProposals(proposalsUrl(bundle.entry)).then((file) => {
      if (!live) return;
      const hit = file && !bundle.synthetic ? findBySlug(file, slug) : null;
      setStart(hit ? { hash: linkHash(hit.proposal.link), gone: false } : { hash: null, gone: true });
    });
    return () => { live = false; };
  }, [bundle, slug]);
  if (err) return <LoadError title="Could not load the study area." message={err} onRetry={() => setAttempt((a) => a + 1)} />;
  if (!bundle || (slug !== null && start === null)) return <Loading label="Loading study area data…" progress={progress} />;
  return <Simulator key={attempt} bundle={bundle} start={start ?? NO_START} onRestart={() => setAttempt((a) => a + 1)} />;
}

/** Where a page opened from a share path starts: the proposal's scenario link, or a notice that the proposal is gone. */
interface Start { hash: string | null; gone: boolean }
const NO_START: Start = { hash: null, gone: false };
export const GONE_NOTICE = 'That proposal is no longer published.';

function Simulator({ bundle, start, onRestart }: { bundle: AreaBundle; start: Start; onRestart(): void }) {
  const { network, demand } = bundle;
  const index = useMemo(() => buildIndex(network), [network]);
  const region = useMemo(() => buildRegion(network), [network]);
  const todayRoutes = useMemo(() => baselineCheck(network, index), [network, index]);
  // Read once: the hash is rewritten as soon as the scenario loads, so later renders must not decode it again.
  const [initial] = useState(() => { const h = start.hash ?? scenarioOnly(location.hash); return { ...decodeMeta(h), ...decodeScenario(network, h) }; });
  const [place] = useState(() => { const p = parseLocation(location.pathname, location.hash); return start.gone ? { ...p, view: 'proposals' as View } : p; });
  const [goneNotice, setGoneNotice] = useState(start.gone);

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

  const [view, setView] = useState<View>(place.view);
  // The section anchor the address bar shows in place of the scenario, if any. The scenario stays in app state meanwhile.
  const [anchor, setAnchor] = useState<string | null>(place.fragment.kind === 'anchor' ? place.fragment.id : null);
  const [scrollTo, setScrollTo] = useState<{ id: string; n: number } | null>(place.fragment.kind === 'anchor' ? { id: place.fragment.id, n: 0 } : null);
  const viewRef = useRef(view); viewRef.current = view;
  const anchorRef = useRef(anchor); anchorRef.current = anchor;
  const skipHash = useRef<string | null>(null);
  const [panelTab, setPanelTab] = useState<'scenario' | 'results'>('scenario');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerBtn = useRef<HTMLButtonElement>(null);
  const closeDrawer = useCallback(() => { setDrawerOpen(false); drawerBtn.current?.focus(); }, []);
  const [showService, setShowService] = useState(false);
  const calStatus = bundle.entry.calibration?.status ?? 'uncalibrated';
  const calNote = bundle.entry.calibration?.note ?? 'Treat results as illustrations, not forecasts.';
  // Dismissal is remembered per note text, so a changed note shows again.
  const calKey = `calnote:${bundle.entry.id}:${calNote.length}:${calNote.slice(0, 24)}:${calNote.slice(-24)}`;
  const [calDismissed, setCalDismissed] = useState(() => store.get(calKey) === '1');
  const [calClosing, setCalClosing] = useState(false);
  const showCal = showCalibrationBanner(bundle.entry.calibration) && !calDismissed && !bundle.synthetic;
  const dismissCal = () => { setCalClosing(true); store.set(calKey, '1'); window.setTimeout(() => setCalDismissed(true), reduced ? 0 : 200); };

  const fallbackPeriod = defaultPeriod(bundle.entry, demand.periods);
  const periodId = demand.periods.some((p) => p.id === initial.period) ? initial.period! : fallbackPeriod;
  const [period, setPeriod] = useState(periodId);
  const [scale, setScale] = useState(initial.demandScale ?? 1);
  const [redist, setRedist] = useState<RedistRequest | null>(null);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  // A link that carries a scenario waits for the stored-result lookup; a miss then starts the run at Max.
  const hasLinkScenario = initial.interventions.length > 0;
  const [run, dispatchRun] = useReducer(runReducer, !reduced && !hasLinkScenario, initialRun);
  const { running, finished } = run;
  const runRef = useRef(run);
  runRef.current = run;
  const [interventions, setInterventions] = useState<Intervention[]>(initial.interventions);
  const routeCheck = useMemo(() => (interventions.length === 0 ? todayRoutes : checkThroughRoutes(network, index, interventions)), [network, index, interventions, todayRoutes]);
  const [showRoutes, setShowRoutes] = useState(false);
  const [hotRoute, setHotRoute] = useState<string | null>(null);
  const [hoverPlace, setHoverPlace] = useState<Hover | null>(null);
  // Said once per change in the count, after the first render, in its own polite region so it does not replace other messages.
  const [routeNote, setRouteNote] = useState('');
  const lastTotal = useRef(routeCheck.total);
  useEffect(() => {
    if (lastTotal.current === routeCheck.total) return;
    lastTotal.current = routeCheck.total;
    const id = window.setTimeout(() => setRouteNote(routeHeadline(routeCheck.total, todayRoutes.total, interventions.length > 0)), 600);
    return () => window.clearTimeout(id);
  }, [routeCheck.total, todayRoutes.total, interventions.length]);
  const [overlay, setOverlay] = useState<Overlay>('cutthrough');
  const [modes, setModes] = useState<ModeVisibility>(() => {
    const all: ModeVisibility = { car: true, bicycle: true, pedestrian: true };
    try {
      const saved = JSON.parse(store.get('modes') ?? '{}');
      return { car: saved.car ?? true, bicycle: saved.bicycle ?? true, pedestrian: saved.pedestrian ?? true };
    } catch { return all; }
  });
  // Key versioned (bikeNet2): the layer was on by default-ish before it was made quiet, so older saved choices are ignored.
  const [bikeNet, setBikeNet] = useState(() => store.get('bikeNet2') === '1');
  useEffect(() => { store.set('modes', JSON.stringify(modes)); }, [modes]);
  useEffect(() => { store.set('bikeNet2', bikeNet ? '1' : '0'); }, [bikeNet]);
  const hasBikeNet = useMemo(() => network.links.some((l) => l.bikeLane || l.bikeRoute), [network]);
  const [notice, setNotice] = useState<{ unplaced: Unplaced[]; invalid: boolean }>({ unplaced: [], invalid: false });
  // Set after mount so the polite live region exists before its content changes.
  useEffect(() => { setNotice({ unplaced: initial.unplaced, invalid: initial.invalid }); }, [initial]);
  const [source, setSource] = useState<'scenario' | 'baseline'>('scenario');
  const [intentSel, setIntentSel] = useState<string | null>(null);
  const [viewState, dispatchView] = useReducer(viewReducer, undefined, () => initViewState(initial.interventions.length, store.get('changeView')));
  useEffect(() => { dispatchView({ type: 'count', count: interventions.length }); }, [interventions.length]);
  useEffect(() => { if (viewState.remembered) store.set('changeView', viewState.remembered); }, [viewState.remembered]);
  const mapView = effectiveView(viewState);

  const [engine, setEngine] = useState<{ kind: 'wasm' | 'mock'; reason?: string } | null>(null);
  const [simError, setSimError] = useState('');
  const [building, setBuilding] = useState(true);
  const [liveStats, setStats] = useState<StatsMsg | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null | undefined>(undefined);
  const [hashes, setHashes] = useState<LoadedHashes | null>(null);
  // A stored result is tied to the exact scenario list, period and demand it was matched for; any change makes it stop applying at once.
  const [storedFor, setStoredFor] = useState<{ result: StoredResult; interventions: Intervention[]; period: string; scale: number } | null>(null);
  const stored = storedFor && storedFor.interventions === interventions && storedFor.period === period && storedFor.scale === scale ? storedFor.result : null;
  const storedRef = useRef<StoredResult | null>(null);
  storedRef.current = stored;
  const storedMsg = useMemo(() => (stored ? toStatsMsg(stored) : null), [stored]);
  const stats = storedMsg ?? liveStats;
  const openedByLink = useRef(hasLinkScenario);
  const [slowSpeed, setSlowSpeed] = useState<number | null>(null);
  const [client, setClient] = useState<SimClient | null>(null);
  const exportRef = useRef<((fmt: ImageFormat) => Promise<void>) | null>(null);
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
    c.onBusy = setBuilding;
    c.onVersion = setFingerprint;
    c.onStats = (s) => { setStats(s); if (storedRef.current) return; dispatchRun({ type: 'time', time: s.time }); setSlowSpeed((prev) => (isInstant(first.current.speed) ? null : nextSpeedShown(prev, first.current.speed, s.achievedSpeed))); };
    c.onProgress = (time) => { if (!storedRef.current) dispatchRun({ type: 'time', time }); };
    c.onError = (m) => setSimError(m);
    const f = first.current;
    c.send({
      t: 'init', network: bundle.raw?.simNetwork ?? bundle.raw?.network ?? JSON.stringify(network), demand: bundle.raw?.demand ?? JSON.stringify(demand), mock: FORCE_MOCK,
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
  // Counts the user's own run controls, so a stored result that arrives late does not replace a run they started.
  const userRuns = useRef(0);
  const runAgain = useCallback(() => { userRuns.current++; setStoredFor(null); client?.send({ t: 'reset' }); dispatchRun({ type: 'restart' }); }, [client]);
  useEffect(() => { client?.send({ t: 'speed', speed }); setSlowSpeed(null); }, [speed, client]);
  const sentPeriod = useRef(period);
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    dispatchRun({ type: 'restart' });
    setStats(null);
    // A period change goes out at once. Only the demand slider is debounced, and until its config is sent the client drops the old run's reports.
    if (period !== sentPeriod.current) { sentPeriod.current = period; client?.send({ t: 'config', period, demandScale: scale }); return; }
    client?.hold();
    const id = window.setTimeout(() => client?.send({ t: 'config', period, demandScale: scale }), 250);
    return () => window.clearTimeout(id);
  }, [period, scale]); // eslint-disable-line
  const ivFirst = useRef(true);
  useEffect(() => {
    if (ivFirst.current) { ivFirst.current = false; return; }
    dispatchRun({ type: 'restart' });
    client?.setInterventions(interventions);
  }, [interventions]); // eslint-disable-line

  // --- stored results
  useEffect(() => {
    let live = true;
    void hashLoaded(bundle.raw).then((h) => { if (live) setHashes(h); });
    return () => { live = false; };
  }, [bundle.raw]);
  const startMax = useCallback(() => {
    setSpeed(INSTANT);
    if (!runRef.current.running && !runRef.current.finished) dispatchRun({ type: 'toggle' });
  }, []);
  useEffect(() => {
    const opened = openedByLink.current;
    if (bundle.synthetic) { if (opened && interventions.length > 0) { openedByLink.current = false; startMax(); } return; }
    if (fingerprint === undefined || !hashes) return;
    if (interventions.length === 0 || scale !== 1) { if (opened && interventions.length > 0) { openedByLink.current = false; startMax(); } return; }
    let live = true;
    const started = userRuns.current;
    void (async () => {
      const key = await resultKey(network, interventions, period);
      const r = await fetchResult(bundle.entry.id, key, network);
      if (!live) return;
      if (userRuns.current !== started) { openedByLink.current = false; return; }
      const loaded = { area: bundle.entry.id, networkHash: hashes.network, demandHash: hashes.demand, simulator: fingerprint };
      if (r && verdict(r, { key, period, demandScale: scale }, loaded) === 'ok') {
        openedByLink.current = false;
        wasFinished.current = true;
        setStoredFor({ result: r, interventions, period, scale });
        dispatchRun({ type: 'time', time: RUN_SECONDS });
        say(STORED_NOTE);
      } else if (opened) { openedByLink.current = false; startMax(); }
    })();
    return () => { live = false; };
  }, [fingerprint, hashes, bundle.synthetic, bundle.entry.id, network, interventions, period, scale, startMax, say]);

  // --- URL: the path is the tab; the fragment is the scenario, or a section anchor while one is showing
  const scenHash = useMemo(
    () => encodeScenario(network, interventions, { area: bundle.synthetic ? null : bundle.entry.id, period: interventions.length === 0 && period === fallbackPeriod ? undefined : period, demandScale: scale }),
    [bundle, network, period, fallbackPeriod, scale, interventions],
  );
  const scenHashRef = useRef(scenHash);
  scenHashRef.current = scenHash;
  const lastScen = useRef(scenHash);
  useEffect(() => {
    if (lastScen.current === scenHash) return;
    lastScen.current = scenHash;
    setAnchor(null);
  }, [scenHash]);
  useEffect(() => {
    const next = `${urlFor(view, scenHash, anchor, location.search)}`;
    if (next !== `${location.pathname}${location.search}${location.hash}`) history.replaceState(null, '', next);
  }, [view, anchor, scenHash]);
  useEffect(() => { document.title = titleFor(view, bundle.entry.name); }, [view, bundle.entry.name]);
  const aim = useCallback((id: string) => setScrollTo((s) => ({ id, n: (s?.n ?? 0) + 1 })), []);
  const go = useCallback((v: View, a: string | null = null, scroll = true) => {
    const id = a ? canonicalAnchor(v, a) : null;
    const url = urlFor(v, scenHashRef.current, id, location.search);
    if (url !== `${location.pathname}${location.search}${location.hash}`) history.pushState(null, '', url);
    setView(v);
    setAnchor(id);
    if (id && scroll) aim(id);
  }, [aim]);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  useEffect(() => {
    if (!scrollTo) return;
    return scrollToAnchor(scrollTo.id, reducedRef.current);
  }, [scrollTo]);
  useEffect(() => {
    // Back and Forward across tabs, or off an anchor, keep the scenario the app holds; the hashchange that follows must not reload it from the old entry.
    const onPop = () => {
      const p = parseLocation(location.pathname, location.hash);
      if (p.view !== viewRef.current || anchorRef.current !== null) {
        skipHash.current = location.href;
        window.setTimeout(() => { skipHash.current = null; }, 200);
      }
      setView(p.view);
      const id = p.fragment.kind === 'anchor' ? p.fragment.id : null;
      setAnchor(id);
      if (id) aim(id);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [aim]);
  useEffect(() => {
    const f = (e: HashChangeEvent) => {
      if (skipHash.current !== null && skipHash.current === e.newURL) { skipHash.current = null; return; }
      const p = parseLocation(location.pathname, location.hash);
      if (p.fragment.kind === 'anchor') { setAnchor(p.fragment.id); aim(p.fragment.id); return; }
      setAnchor(null);
      const h = scenarioOnly(location.hash);
      const st = decodeScenario(network, h);
      const meta = decodeMeta(h);
      setNotice({ unplaced: st.unplaced, invalid: st.invalid });
      const pr = meta.period && demand.periods.some((x) => x.id === meta.period) ? meta.period : fallbackPeriod;
      const d = meta.demandScale ?? 1;
      const changed = JSON.stringify(st.interventions) !== JSON.stringify(first.current.interventions);
      if (pr !== first.current.period) setPeriod(pr);
      if (d !== first.current.scale) setScale(d);
      if (changed) { openedByLink.current = true; setInterventions(st.interventions); }
    };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, [network, demand, fallbackPeriod, aim]);
  const nav = useMemo<Nav>(() => ({
    view,
    hrefFor: (v, a) => urlFor(v, scenHash, a ? canonicalAnchor(v, a) : null, location.search),
    go: (v, a) => go(v, a),
    copyAnchor: (id) => {
      go(view, id, false);
      navigator.clipboard?.writeText(location.href).then(() => say('Link copied'), () => say('Copy failed. The address bar already holds the link.'));
    },
  }), [view, scenHash, go, say]);

  // --- proposals
  // Loaded at start, not only on the Proposals tab, so the map can tell when its scenario is a published proposal.
  // What the proposal figures are checked against: the loaded data and the engine in use. Until the engine reports its version the simulator is unchecked.
  const evidenceInputs = useMemo<LoadedHashes | null>(() => (hashes ? { ...hashes, simulator: fingerprint } : null), [hashes, fingerprint]);
  const proposals = useProposals(bundle, true, evidenceInputs);
  useEffect(() => { if (view !== 'proposals') setGoneNotice(false); }, [view]);
  const published = useMemo(
    () => (proposals.status === 'ready' && evidenceInputs ? findPublished(network, proposals.file, evidenceInputs, interventions, period, scale, fallbackPeriod) : null),
    [proposals, evidenceInputs, network, interventions, period, scale, fallbackPeriod],
  );
  const copyLink = useCallback((url: string, ok: string) => {
    navigator.clipboard?.writeText(url).then(() => say(ok), () => say('Copy failed. The address bar already holds the link.'));
  }, [say]);
  const focusAfterOpen = useRef(false);
  const onOpenProposal = useCallback((p: Proposal) => {
    const d = decodeScenario(network, linkHash(p.link));
    const wanted = p.picture?.period ?? decodeMeta(linkHash(p.link)).period;
    if (wanted && demand.periods.some((x) => x.id === wanted)) setPeriod(wanted);
    setScale(1);
    openedByLink.current = true;
    setInterventions(d.interventions);
    setNotice({ unplaced: d.unplaced, invalid: d.invalid });
    go('map');
    focusAfterOpen.current = true;
    say(`Opened ${p.title} on the map.`);
  }, [network, demand, say, go]);
  useEffect(() => {
    if (view !== 'map' || !focusAfterOpen.current) return;
    focusAfterOpen.current = false;
    const h = document.getElementById('scenario-h');
    const el = h && h.getClientRects().length > 0 ? h : document.getElementById('main');
    el?.focus();
  }, [view]);

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

  // --- overlay values (fixed color scale, see OVERLAY_TOP)
  const withheld = running && isInstant(speed) && !finished;
  const shownStats = source === 'baseline' && stats?.comparing ? stats.baseline : stats?.scenario;
  const linkStats = withheld ? null : shownStats?.linkStats ?? null;
  const overlayMax = overlayTop(overlay);
  const baseStats = withheld ? null : stats?.baseline.linkStats ?? null;

  const base: Metrics | null = withheld ? null : stats?.baseline.metrics ?? null;
  const scen: Metrics | null = withheld ? null : stats?.scenario.metrics ?? null;
  const comparing = !!stats?.comparing;
  const early = !!stats && !withheld && isEarly(finished, run.time);
  const multimodal = hasModes(stats?.scenario.metrics ?? null);
  const intentDefs = demand.intents;
  const intentRun = comparing && source === 'baseline' ? stats?.baseline : stats?.scenario;
  const intentPathsShown = useMemo(() => {
    const slot = intentSel && intentDefs ? intentDefs.findIndex((d) => d.id === intentSel) : -1;
    const m = withheld ? null : intentRun?.metrics;
    if (slot < 0 || !m?.cutThrough.byIntent) return null;
    return intentPaths(intentRun?.intentLinks, slot, intentSel!, m.time, m.cutThrough.byIntent[slot]?.vehiclesPerHour ?? 0);
  }, [intentSel, intentDefs, intentRun, withheld]);
  const intentRamp = useMemo(() => {
    const d = intentSel ? intentDefs?.find((x) => x.id === intentSel) : undefined;
    const r = d ? rampOfIntent(d, demand.ramps) : null;
    return r ? rampPoint(bundle.network, r) : null;
  }, [intentSel, intentDefs, demand.ramps, bundle.network]);
  const mapVisible = view === 'map';
  const symbols = useMemo(() => mapSymbols(interventions.map((iv) => symbolOf(iv, network)), view === 'map' && !!intentPathsShown), [interventions, network, view, intentPathsShown]);
  useEffect(() => setHoverPlace(null), [view]);
  // On phones the Streets tab is a full-height table; each row's Show on map button opens the Map tab on that block.
  const mapShown = mapVisible || (view === 'streets' && !phone);
  const showPanel = view === 'map' || view === 'streets';
  const placement: Placement | null = !selection ? null : selection.via === 'search' || !mapVisible ? 'inline' : phone ? 'sheet' : 'popover';
  const menu = selection && placement ? (
    <SelectionMenu bundle={bundle} index={index} selection={selection} interventions={interventions} placement={placement}
      onApply={onApply} onRemove={onRemove} onClose={clearSelection}
      readout={comparing && !withheld ? { overlay, scen: stats?.scenario.linkStats ?? null, base: baseStats, early } : null} />
  ) : null;

  const shareButton = (
    <button type="button" className="btn" onClick={() => copyLink(`${location.origin}${published ? pathOfSlug(published.slug) : urlFor(view, scenHash, null, location.search)}`, 'Link to this scenario copied.')}>Copy link to this scenario</button>
  );
  const scenarioPanel = (
    <>
      <InterventionPanel bundle={bundle} index={index} region={region} showService={showService} onShowService={setShowService} interventions={interventions}
        onRemove={onRemove} onClear={onClear} onChoose={select} onHover={setHoverPlace} onSelectIntervention={onSelectIntervention}
        onTrace={(i) => setRedist({ package: interventions, closure: i, source: 'scenario', title: 'your scenario' })}
        menuTop={placement === 'sheet' ? menu : null} menuInline={placement === 'inline' ? menu : null} shareSlot={shareButton}
        routes={{ check: routeCheck, today: todayRoutes.total, show: showRoutes, onShow: setShowRoutes, onHighlight: setHotRoute, mode }} />
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
    <Comparison base={base} scen={scen} comparing={comparing} finished={finished} withheld={withheld} scenarioCount={interventions.length}
      intents={intentDefs?.length ? (
        <IntentPanel defs={intentDefs} ramps={demand.ramps} base={base} scen={scen} comparing={comparing} net={bundle.network} idx={index} selected={intentSel} onSelect={setIntentSel}
          paths={intentPathsShown} pathsFrom={comparing ? source : 'scenario'} phone={phone} running={running} early={early} />
      ) : undefined} />
  );

  return (
    <NavContext.Provider value={nav}>
    <div className={`app layout-${layout}`} data-view={view}>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to main content</a>
      <p className="sr-only" role="status" aria-live="polite">{toast}</p>
      <p className="sr-only" role="status" aria-live="polite">{routeNote}</p>
      <header className="top">
        <div className="brand">
          <h1>Traffic <span className="area">{bundle.entry.name}</span></h1>
        </div>
        <ScrollRow aria-label="Views">
          {VIEWS.map((v) => (
            <NavLink key={v.id} view={v.id} className="navbtn" aria-current={view === v.id ? 'page' : undefined} onClick={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' })}>
              {v.label}
            </NavLink>
          ))}
        </ScrollRow>
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
              <h2 id="scenario-h" tabIndex={-1}>Scenario</h2>
              {layout === 'medium' && <button type="button" className="btn small-btn" onClick={closeDrawer}>Close</button>}
            </div>
            <div className="side-body">{scenarioPanel}</div>
          </aside>
        )}
        <div key="stage" className="stage">
          {(bundle.synthetic || engine?.kind === 'mock' || (simError && engine) || showCal || stored) && (
            <div className="banners">
              {showCal && (
                <div className={`cal-collapse ${calClosing ? 'closing' : ''}`}>
                  <p className="notice calm cal-line" role="note">
                    <span className="cal-text" title={calNote}>
                      <strong>{calStatus === 'calibrated' ? 'Calibrated, with limits.' : 'Preview, not yet calibrated.'}</strong>{' '}{calNote}
                    </span>
                    <button type="button" className="link" onClick={() => go('sources', 'calibration')}>Details</button>
                    <button type="button" className="btn small-btn" onClick={dismissCal}>Dismiss</button>
                  </p>
                </div>
              )}
              {bundle.synthetic && <p className="notice" role="note">Showing a synthetic fixture area because the study-area data files were not found.</p>}
              {engine?.kind === 'mock' && <p className="notice" role="note">Using the built-in mock simulation ({engine.reason}). Vehicle behavior and metrics are illustrative only.</p>}
              {simError && engine && <p className="notice err" role="alert">{simError}</p>}
              {stored && <p className="notice calm" role="note">{STORED_NOTE} Cars are not drawn in a stored result.</p>}
            </div>
          )}
          {showPanel && (
            <Playback
              running={running} finished={finished} onToggle={() => { userRuns.current++; if (finished) runAgain(); else dispatchRun({ type: 'toggle' }); }}
              onReset={() => { userRuns.current++; setStoredFor(null); client?.send({ t: 'reset' }); dispatchRun({ type: 'restart' }); say('Simulation reset.'); }}
              entry={bundle.entry}
              onExport={() => { void exportRef.current?.('png'); }}
              speed={speed} onSpeed={setSpeed} periods={demand.periods} period={period} onPeriod={setPeriod}
              scale={scale} onScale={setScale} time={run.time} reducedMotion={reduced}
              achieved={running ? slowSpeed : null}
            />
          )}
          <div className="map-area" hidden={!mapShown}>
            <Suspense fallback={<p className="boot" role="status">Loading map…</p>}>
            <MapView
              bundle={bundle} index={index} region={region} mode={mode} overlay={overlay} overlayMax={overlayMax} linkStats={mapView === 'change' ? (withheld ? null : stats?.scenario.linkStats ?? null) : linkStats} baseStats={baseStats} view={mapView}
              client={client} still={!!stored} interventions={interventions} selection={mapVisible ? selection : null} onHit={onHit} hover={hoverPlace} interactive={mapVisible}
              routes={{ check: routeCheck, show: showRoutes, highlight: hotRoute }}
              intentPaths={view === 'map' && intentPathsShown ? segmentWidths(intentPathsShown) : null}
              intentRamp={view === 'map' && intentPathsShown ? intentRamp : null}
              popover={placement === 'popover' ? menu : null}
              visible={mapShown} reducedMotion={reduced}
              modes={multimodal ? modes : { ...modes, bicycle: false, pedestrian: false }} showBikeNet={bikeNet && multimodal}
              early={early} source={source} periodLabel={demand.periods.find((x) => x.id === period)?.label ?? period} exportRef={exportRef} onAnnounce={say}
            />
            </Suspense>
            <Legend overlay={overlay} onOverlay={setOverlay} mode={mode} 
              source={source} onSource={setSource} canCompare={comparing}
              view={mapView} onView={(v) => dispatchView({ type: 'choose', view: v })} canChange={interventions.length > 0} early={early}
              symbols={symbols} multimodal={multimodal} modes={modes} onModes={setModes} hasBikeNet={hasBikeNet} bikeNet={bikeNet} onBikeNet={setBikeNet} />
            {(!engine || building) && (!stored || simError) && (
              <div className="map-cover">
                {simError
                  ? <LoadError title="The simulation could not start." message={simError} onRetry={onRestart} />
                  : <Loading label={building ? "Putting today's traffic on the streets…" : 'Starting the simulation engine…'} />}
              </div>
            )}
          </div>
          {view === 'streets' && (
            <StreetsTable bundle={bundle} index={index} showService={showService} onShowService={setShowService}
              scen={withheld ? null : stats?.scenario.linkStats ?? null} base={baseStats} comparing={comparing} overlay={overlay} withheld={withheld} early={early}
              baseMetrics={base} scenMetrics={scen} onHover={setHoverPlace}
              phone={phone} onShowOnMap={(block) => { setHoverPlace(null); select({ kind: 'block', block, point: null, nearLink: null, via: 'list' }); go('map'); }} />
          )}
          {view === 'proposals' && <Proposals bundle={bundle} index={index} today={todayRoutes.total} state={proposals} loaded={evidenceInputs ?? NO_HASHES} mode={mode} current={interventions} onOpen={onOpenProposal}
            onTrace={(p, ivs) => { const i = ivs.findIndex(canTrace); if (i >= 0) setRedist({ package: ivs, closure: i, source: 'proposal', title: p.title }); }} notice={goneNotice ? GONE_NOTICE : null} onCopyLink={(p, g) => copyLink(`${location.origin}${pathOfSlug(slugOf(g, p.link))}`, 'Link to this proposal copied.')} />}
          {view === 'methodology' && <Suspense fallback={<p className="boot" role="status">Loading methodology…</p>}><Methodology area={bundle.entry} /></Suspense>}
          {view === 'assumptions' && <Suspense fallback={<p className="boot" role="status">Loading assumptions…</p>}><Assumptions bundle={bundle} index={index} mode={mode} hashes={hashes} fingerprint={fingerprint} /></Suspense>}
          {redist && (
            <Suspense fallback={null}>
              <Redistribution bundle={bundle} index={index} period={period} periodLabel={demand.periods.find((x) => x.id === period)?.label ?? period} demandScale={scale}
                hashes={hashes} fingerprint={fingerprint} request={redist} onClose={() => setRedist(null)} />
            </Suspense>
          )}
          {view === 'sources' && <Suspense fallback={<p className="boot" role="status">Loading sources…</p>}><Sources demand={demand} synthetic={bundle.synthetic} calibration={bundle.synthetic ? undefined : { status: calStatus, note: bundle.entry.calibration?.note }} /></Suspense>}
        </div>

        {showPanel && !phone && (
          <aside key="right" id="results-panel" className="side side-right" aria-labelledby="results-h">
            <div className="side-head"><h2 id="results-h">Results</h2></div>
            <div className="side-body">{resultsPanel}</div>
          </aside>
        )}
        {view === 'map' && phone && (
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
          <button type="button" className="link" onClick={() => go('sources')}>Sources &amp; assumptions</button>
        </span>
        <span className="foot-right"><a href="/llms.txt">For AI agents</a>{' · '}<a href={SOURCE_REPO_URL} target="_blank" rel="noopener noreferrer">Source on GitHub</a></span>
      </footer>
    </div>
    </NavContext.Provider>
  );
}
