import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import type { AreaBundle, Intervention, ModeVisibility, Overlay } from '../types';
import { KIND_BIKE, KIND_PED } from '../types';
import { makeProjection, metersPerPixel } from '../lib/projection';
import { pointAlong } from '../lib/geom';
import { hitTest, selectionAnchor, type Selection } from '../lib/selection';
import { PopoverFrame } from './Popover';
import { FADE_TIERS, interventionInRegion, REGION_FEATHER_M, type Region } from '../lib/region';
import { REGION_BUFFER_M } from '../lib/area';
import { advance, elapsedSim } from '../lib/extrapolate';
import { divergingStops, intensity, rampStops, WIDTH_MAX, WIDTH_MIN, type Mode } from '../lib/ramps';
import { linkChangeIntensity, NO_DATA, type MapView as ChangeView } from '../lib/change';
import { linkStatsView } from '../types';
import type { NetIndex } from '../lib/naming';
import { describeIntervention, interventionPoint } from '../lib/describe';
import type { SimClient } from '../sim/client';
import {
  boxOfPoints, centerToShow, correctedCamera, fitCamera, hardBounds, insideRect, isAcceptable, minZoomFor, MIN_ZOOM_FLOOR,
  unobscuredRect, type Camera, type GeoBox, type LngLat, type Obstacle, type Rect, type Size,
} from '../lib/viewfit';

maplibregl.setWorkerUrl(workerUrl);

interface Props {
  bundle: AreaBundle;
  index: NetIndex;
  /** The study area plus its buffer: everything the map draws or picks lies inside it. */
  region: Region;
  mode: Mode;
  overlay: Overlay;
  overlayMax: number;
  linkStats: Float32Array | null;
  /** Baseline link stats, used by the change view. */
  baseStats: Float32Array | null;
  view: ChangeView;
  client: SimClient | null;
  interventions: Intervention[];
  selection: Selection | null;
  /** A place chosen on the map, or null for empty map. */
  onHit(s: Selection | null): void;
  /** Menu shown as a pop-up tied to the selection (wide and mid-width layouts). */
  popover: ReactNode | null;
  visible: boolean;
  reducedMotion: boolean;
  modes: ModeVisibility;
  showBikeNet: boolean;
}

const KIND_STYLE = {
  light: { bg: '#f1efe8', water: '#cfd8e0', minor: '#d8d3c6', major: '#b9b2a0', path: '#cdd5bf', study: '#0b5cad' },
  dark: { bg: '#161b22', water: '#1d2a38', minor: '#2b323c', major: '#3d4654', path: '#27302a', study: '#7db6f5' },
};

const mutedFor = (mode: Mode) => (mode === 'dark' ? '#4a5463' : '#a8a291');
function ramp(mode: Mode, view: ChangeView = 'scenario'): unknown[] {
  const muted = mutedFor(mode);
  if (view === 'change') {
    const stops = divergingStops(mode).filter((x) => x.t !== 0).flatMap((x) => [x.t, x.color]);
    // Streets with no traffic (-2) and the dead band (0) both draw as thin neutral gray.
    const i0 = stops.indexOf(-0.05);
    stops.splice(i0 + 2, 0, 0, muted);
    return ['interpolate', ['linear'], ['coalesce', ['feature-state', 't'], NO_DATA], NO_DATA, muted, -1.01, muted, ...stops];
  }
  const s = rampStops(mode);
  return ['interpolate', ['linear'], ['coalesce', ['feature-state', 't'], -1],
    -1, muted, -0.01, muted, 0, s[0], 0.25, s[1], 0.5, s[2], 0.75, s[3], 1, s[4]];
}
function lineWidth(view: ChangeView): unknown[] {
  if (view === 'change') {
    return ['interpolate', ['linear'], ['abs', ['coalesce', ['feature-state', 't'], NO_DATA]], 0, WIDTH_MIN, 1, WIDTH_MAX, 1.001, WIDTH_MIN * 0.8];
  }
  return ['interpolate', ['linear'], ['coalesce', ['feature-state', 't'], -1], -1, WIDTH_MIN * 0.8, 0, WIDTH_MIN, 1, WIDTH_MAX];
}
function widthExpr(view: ChangeView = 'scenario'): unknown[] {
  const w = lineWidth(view);
  return ['interpolate', ['linear'], ['zoom'], 14, ['*', 0.55, w], 18, ['*', 1.5, w]];
}
const casingWidth = (view: ChangeView = 'scenario'): unknown[] => {
  const w = lineWidth(view);
  return ['interpolate', ['linear'], ['zoom'], 14, ['+', 1.2, ['*', 0.55, w]], 18, ['+', 1.8, ['*', 1.5, w]]];
};
/** Large decreases get gaps cut into the line, so direction shows without color. Opacity reads the same feature state as the color. */
const DASH_FROM = -0.3;
const dashOpacity = (): unknown[] => ['case', ['<', ['coalesce', ['feature-state', 't'], 0], DASH_FROM], ['case', ['>', ['coalesce', ['feature-state', 't'], 0], NO_DATA + 0.5], 1, 0], 0];
const SEL_EDGE = { light: '#ffffff', dark: '#0b1118' };
const OFFSET = ['interpolate', ['linear'], ['zoom'], 14, 1.2, 17, 3.5, 19, 6];

/** Colorblind-safe agent palette (Okabe-Ito derived), checked against both map backgrounds. Shape carries the kind too. */
export const AGENT_COLORS = {
  light: { car: '#1d5fc4', bike: '#00785c', ped: '#a85f00', ring: '#ffffff', tick: '#4a4a4a' },
  dark: { car: '#7db6f5', bike: '#3ddbb0', ped: '#f2b84b', ring: '#0b1118', tick: '#d0d6de' },
};

/** Quiet bike-network hue (muted violet): distinct from the viridis overlay ramp, the agent palette and the basemap. Opacities are design choices, not calibrated values. */
export const BIKENET = {
  light: { color: '#8a5a9e', lane: 0.55, route: 0.45 },
  dark: { color: '#b79ac9', lane: 0.6, route: 0.5 },
};
const bikeOpacity = (base: number, from: number, to: number): never =>
  ['interpolate', ['linear'], ['zoom'], from, 0, to, base] as never;

const BADGE: Record<string, string> = {
  modal_filter: 'MF', speed_hump: 'SH', speed_limit: 'SL', traffic_circle: 'TC', control: 'IC',
  signal_timing: 'ST', one_way: '1W', turn_ban: 'TB', diagonal_diverter: 'DD',
};

/** Soft edge: stacked washes of the background color, each a large rectangle with a contour of the region cut out. Their alphas compound to k/N, so the edge goes from clear to opaque over REGION_FEATHER_M. */
const FEATHER_STEPS = 5;
const FADE_ALPHA = [0, 0.3, 0.55, 0.8, 1];
function featherWash(b: AreaBundle, region: Region, k: number) {
  const { lon, lat } = b.network.origin;
  const pr = makeProjection(b.network.origin);
  const d = 0.6;
  const outer: [number, number][] = [[lon - d, lat - d], [lon + d, lat - d], [lon + d, lat + d], [lon - d, lat + d], [lon - d, lat - d]];
  const level = REGION_BUFFER_M - (REGION_FEATHER_M * (FEATHER_STEPS - k)) / FEATHER_STEPS;
  const holes = region.contour(level).map((r) => r.map(([x, y]) => pr.toLonLat(x, y)));
  return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [outer, ...holes] } };
}
const featherAlpha = (k: number) => 1 / (FEATHER_STEPS - k + 1);
/** Basemap and street lines cut to the region once, so nothing outside it is ever drawn. */
function clipData(b: AreaBundle, region: Region) {
  const pr = makeProjection(b.network.origin);
  const toLL = (part: [number, number][]) => part.map(([x, y]) => pr.toLonLat(x, y));
  const base: unknown[] = [];
  for (const f of (b.basemap as unknown as { features: { properties: unknown; geometry: { coordinates: [number, number][] } }[] }).features) {
    const local = f.geometry.coordinates.map(([lo, la]) => pr.toLocal(lo, la));
    for (const part of region.clipLine(local)) base.push({ type: 'Feature', properties: f.properties, geometry: { type: 'LineString', coordinates: toLL(part) } });
  }
  const linkVisible = new Uint8Array(b.network.links.length);
  const links: unknown[] = [];
  for (const l of b.network.links) {
    const parts = region.clipLine(l.geometry);
    if (!parts.length) continue;
    linkVisible[l.id] = 1;
    links.push({
      type: 'Feature', id: l.id, properties: { id: l.id, bikeLane: !!l.bikeLane, bikeRoute: !!l.bikeRoute && !l.bikeLane },
      geometry: parts.length === 1 ? { type: 'LineString', coordinates: toLL(parts[0]) } : { type: 'MultiLineString', coordinates: parts.map(toLL) },
    });
  }
  return { base: { type: 'FeatureCollection', features: base }, links: { type: 'FeatureCollection', features: links }, linkVisible };
}
const lineFeature = (region: Region, pr: ReturnType<typeof makeProjection>, g: [number, number][]) => {
  const parts = region.clipLine(g).map((pt) => pt.map(([x, y]) => pr.toLonLat(x, y)));
  return parts.map((c) => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: c } }));
};
const FRAME_MS = 32; // without extrapolation the vehicle layer redraws at most ~30 Hz
/** Above this multiplier sim frames arrive often enough that extrapolating is unnecessary. */
const EXTRAPOLATE_MAX_RATE = 5;
interface DebugHook { signalBuf?: Uint8Array; signals: number; signalsDrawn: number; positions: Float32Array; draws: number; drawMs: number; frameTime: number; extrapolated: boolean }

/** The region's bounding box as a geographic box. */
function regionGeoBox(region: Region, pr: ReturnType<typeof makeProjection>): GeoBox {
  const { minX, minY, maxX, maxY } = region.bbox;
  const [w, s] = pr.toLonLat(minX, minY), [e, n] = pr.toLonLat(maxX, maxY);
  return { w, s, e, n };
}
const toBounds = (b: GeoBox) => new maplibregl.LngLatBounds([b.w, b.s], [b.e, b.n]);
const PHONE_Q = '(max-width: 719.98px)';
/** Settling waits this long after a gesture or layout change ends, so a new gesture can cancel it. */
const SETTLE_MS = 140;
const GLIDE_MS = 350;
class FitControl implements maplibregl.IControl {
  private el: HTMLDivElement | null = null;
  constructor(private onFit: () => void) {}
  onAdd() {
    const el = document.createElement('div');
    el.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'fit-btn';
    btn.title = 'Fit area'; btn.setAttribute('aria-label', 'Fit area');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6V2h4M12 2h4v4M16 12v4h-4M6 16H2v-4"/></svg>';
    btn.addEventListener('click', this.onFit);
    el.appendChild(btn);
    this.el = el;
    return el;
  }
  onRemove() { this.el?.remove(); this.el = null; }
}

export function MapView(p: Props) {
  const { bundle, mode, region } = p;
  const proj = useMemo(() => makeProjection(bundle.network.origin), [bundle]);
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const userMoved = useRef(false);
  const reveal = useRef<(force: boolean) => void>(() => {});
  const live = useRef({ ...p, proj });
  live.current = { ...p, proj };
  const drawReq = useRef(0);
  const hoverRef = useRef<{ link: number | null; node: number | null }>({ link: null, node: null });
  const markers = useRef<maplibregl.Marker[]>([]);
  const prevT = useRef<Float32Array>(new Float32Array(0));
  const prevView = useRef<ChangeView>('scenario');
  const lastDraw = useRef(0);
  const drawn = useRef<Float32Array>(new Float32Array(0));
  const drawTimer = useRef(0);
  // Marked crossings and signal heads in local meters, computed once per area. Those outside the region are dropped.
  const fixtures = useMemo(() => {
    const net = bundle.network;
    const ticks: [number, number, number, number][] = [];
    for (const l of net.links) for (const c of l.crossings ?? []) {
      const p = pointAlong(l.geometry, Math.min(c, l.length));
      const tr = region.tier(p.x, p.y);
      if (tr) ticks.push([p.x, p.y, p.heading, tr]);
    }
    const sig = new Float32Array(net.links.length * 2);
    const sigTier = new Uint8Array(net.links.length);
    for (const l of net.links) {
      const pp = pointAlong(l.geometry, Math.max(0, l.length - 5));
      sig[l.id * 2] = pp.x + Math.sin(pp.heading) * 3.5; // right of travel
      sig[l.id * 2 + 1] = pp.y - Math.cos(pp.heading) * 3.5;
      sigTier[l.id] = region.tier(sig[l.id * 2], sig[l.id * 2 + 1]);
    }
    return { ticks, sig, sigTier };
  }, [bundle, region]);
  const clipped = useMemo(() => clipData(bundle, region), [bundle, region]);

  // ---- draw vehicles + signals on overlay canvas
  const draw = () => {
    drawReq.current = 0;
    const t0 = performance.now();
    lastDraw.current = t0;
    const map = mapRef.current, cv = canvas.current, L = live.current;
    if (!map || !cv) return;
    const g = cv.getContext('2d');
    if (!g) return;
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const frame = L.client?.frame;
    if (!frame || !L.visible) return;
    const P = L.proj;
    const o = map.project(P.toLonLat(0, 0)), ex = map.project(P.toLonLat(100, 0)), ey = map.project(P.toLonLat(0, 100));
    const ax = (ex.x - o.x) / 100, bx = (ey.x - o.x) / 100, ay = (ex.y - o.y) / 100, by = (ey.y - o.y) / 100;
    const pxPerM = Math.hypot(ax, ay);
    const dark = L.mode === 'dark';
    const C = AGENT_COLORS[L.mode];
    const r = Math.max(2, Math.min(6, 1.2 + pxPerM * 2.2));
    let v = frame.vehicles;
    const animate = !L.reducedMotion && frame.rate > 0 && frame.rate <= EXTRAPOLATE_MAX_RATE;
    if (animate) {
      if (drawn.current.length !== v.length) drawn.current = new Float32Array(v.length);
      advance(v, drawn.current, elapsedSim(performance.timeOrigin + t0, frame.wall, frame.rate));
      v = drawn.current;
    }
    const M = L.modes;
    // One path per kind and fade tier, so each is a single fill and stroke.
    const mk = () => Array.from({ length: FADE_TIERS + 1 }, () => null as Path2D | null);
    const pCar = mk(), pBike = mk(), pPed = mk();
    const path = (set: (Path2D | null)[], t: number) => (set[t] ??= new Path2D());
    const rb = r * 1.25, rp = Math.max(1.3, r * 0.6);
    const bb = L.region.bbox;
    for (let i = 0; i + 5 < v.length; i += 6) {
      const kind = v[i + 4];
      if (kind === KIND_BIKE ? !M.bicycle : kind === KIND_PED ? !M.pedestrian : !M.car) continue;
      const lx = v[i], ly = v[i + 1];
      if (lx < bb.minX || lx > bb.maxX || ly < bb.minY || ly > bb.maxY) continue;
      const sx = o.x + lx * ax + ly * bx, sy = o.y + lx * ay + ly * by;
      if (sx < -10 || sy < -10 || sx > w + 10 || sy > h + 10) continue;
      const tr = L.region.tier(lx, ly);
      if (!tr) continue;
      if (kind === KIND_BIKE) {
        const pp = path(pBike, tr);
        pp.moveTo(sx, sy - rb); pp.lineTo(sx + rb * 0.95, sy + rb * 0.7); pp.lineTo(sx - rb * 0.95, sy + rb * 0.7); pp.closePath();
      } else if (kind === KIND_PED) {
        path(pPed, tr).rect(sx - rp, sy - rp, rp * 2, rp * 2);
      } else {
        const pp = path(pCar, tr);
        pp.moveTo(sx + r, sy); pp.arc(sx, sy, r, 0, Math.PI * 2);
      }
    }
    for (let t = 1; t <= FADE_TIERS; t++) {
      g.globalAlpha = FADE_ALPHA[t];
      g.strokeStyle = C.ring;
      if (pCar[t]) { g.lineWidth = 1; g.fillStyle = C.car; g.fill(pCar[t]!); g.stroke(pCar[t]!); }
      if (pBike[t]) { g.lineWidth = 1; g.fillStyle = C.bike; g.fill(pBike[t]!); g.stroke(pBike[t]!); }
      if (pPed[t]) { g.fillStyle = C.ped; g.lineWidth = 0.8; g.fill(pPed[t]!); g.stroke(pPed[t]!); }
    }
    g.globalAlpha = 1;
    // marked crossings: short ticks across the street, only when zoomed in
    if (M.pedestrian && pxPerM >= 0.8 && fixtures.ticks.length) {
      g.strokeStyle = C.tick; g.lineWidth = 2; g.beginPath();
      const half = Math.max(4, 4 * pxPerM);
      for (const [x, y, hd, tk] of fixtures.ticks) {
        if (tk < 2) continue;
        const sx = o.x + x * ax + y * bx, sy = o.y + x * ay + y * by;
        if (sx < -10 || sy < -10 || sx > w + 10 || sy > h + 10) continue;
        // Across the street: local direction (-sin, cos) mapped to screen.
        const ux = -Math.sin(hd), uy = Math.cos(hd);
        const dx = ux * ax + uy * bx, dy = ux * ay + uy * by;
        const n = Math.hypot(dx, dy) || 1;
        g.moveTo(sx - (dx / n) * half, sy - (dy / n) * half); g.lineTo(sx + (dx / n) * half, sy + (dy / n) * half);
      }
      g.stroke();
    }
    // signals: green = open ring, yellow = triangle, red = filled square
    const net = L.bundle.network, sg = frame.signals;
    const sz = Math.max(4, Math.min(7, 3 + pxPerM * 1.6));
    let sigDrawn = 0, sigTotal = 0;
    for (let li = 0; li < sg.length && li < net.links.length; li++) {
      const st = sg[li];
      if (!st) continue;
      sigTotal++;
      const stier = fixtures.sigTier[li];
      if (!stier) continue;
      const x = fixtures.sig[li * 2], y = fixtures.sig[li * 2 + 1];
      const sx = o.x + x * ax + y * bx, sy = o.y + x * ay + y * by;
      if (sx < -10 || sy < -10 || sx > w + 10 || sy > h + 10) continue;
      sigDrawn++;
      g.globalAlpha = FADE_ALPHA[stier];
      g.lineWidth = 2;
      if (st === 1) { g.strokeStyle = '#1f9d55'; g.fillStyle = dark ? '#0b1118' : '#fff'; g.beginPath(); g.arc(sx, sy, sz, 0, 7); g.fill(); g.stroke(); }
      else if (st === 2) { g.strokeStyle = dark ? '#fff' : '#1a1a1a'; g.fillStyle = '#f5c400'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(sx, sy - sz); g.lineTo(sx + sz, sy + sz * 0.8); g.lineTo(sx - sz, sy + sz * 0.8); g.closePath(); g.fill(); g.stroke(); }
      else { g.strokeStyle = dark ? '#fff' : '#1a1a1a'; g.fillStyle = '#d62728'; g.lineWidth = 1.2; g.beginPath(); g.rect(sx - sz * 0.85, sy - sz * 0.85, sz * 1.7, sz * 1.7); g.fill(); g.stroke(); }
    }
    g.globalAlpha = 1;
    if (new URLSearchParams(location.search).has('debug')) {
      const dbg = ((window as unknown as { __trafficDebug?: DebugHook }).__trafficDebug ??= { signals: 0, signalsDrawn: 0, positions: v, draws: 0, drawMs: 0, frameTime: 0, extrapolated: false });
      dbg.positions = v; dbg.signalBuf = sg; dbg.signals = sigTotal; dbg.signalsDrawn = sigDrawn; dbg.draws++; dbg.drawMs += performance.now() - t0; dbg.frameTime = frame.time; dbg.extrapolated = animate;
    }
    if (animate) schedule();
  };
  const schedule = () => { if (!drawReq.current) drawReq.current = requestAnimationFrame(draw); };
  // New sim frames arrive faster than a map needs; map moves still redraw at once through `schedule`.
  const scheduleFrame = () => {
    const f = live.current.client?.frame;
    if (f && !live.current.reducedMotion && f.rate > 0 && f.rate <= EXTRAPOLATE_MAX_RATE) { schedule(); return; }
    const wait = FRAME_MS - (performance.now() - lastDraw.current);
    if (wait <= 0) schedule();
    else if (!drawTimer.current) drawTimer.current = window.setTimeout(() => { drawTimer.current = 0; schedule(); }, wait);
  };

  // ---- create map once
  useEffect(() => {
    const el = box.current!;
    const b = bundle;
    const map = new maplibregl.Map({
      container: el,
      style: { version: 8, sources: {}, layers: [{ id: 'bg', type: 'background', paint: { 'background-color': KIND_STYLE.light.bg } }] },
      center: b.entry.center, zoom: Math.min(b.entry.zoom, 14.5), minZoom: MIN_ZOOM_FLOOR, maxZoom: 19.5,
      attributionControl: false, dragRotate: false, pitchWithRotate: false, fadeDuration: 0,
      canvasContextAttributes: { antialias: true },
    } as maplibregl.MapOptions);
    mapRef.current = map;
    if (new URLSearchParams(location.search).has('debug')) (window as unknown as { __trafficMap?: unknown }).__trafficMap = map;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ring = (b.network.studyArea ?? []) as LngLat[];
    const studyBox = ring.length >= 3 ? boxOfPoints(ring) : null;
    const regionBox = regionGeoBox(region, proj);
    const originalOf = (e: unknown) => (e as { originalEvent?: unknown }).originalEvent;

    // The part of the canvas no overlay covers right now. Bars that grow with their content count at their current size;
    // the legend counts at its collapsed row so expanding it does not move the view.
    const measure = (sheetOverride?: number): { size: Size; unob: Rect } | null => {
      const cr = el.getBoundingClientRect();
      if (cr.width < 50 || cr.height < 50) return null;
      const obs: Obstacle[] = [];
      const area = el.parentElement;
      const bar = document.querySelector('.toolbar')?.getBoundingClientRect();
      if (bar && bar.height && bar.bottom > cr.top + 1 && bar.top < cr.bottom) obs.push({ rect: bar, edge: 'top' });
      const row = area?.querySelector('.legend-row')?.getBoundingClientRect();
      let rowTop = cr.bottom;
      if (row && row.height) { rowTop = row.top; obs.push({ rect: row, edge: 'bottom' }); }
      const attr = el.querySelector('.maplibregl-ctrl-attrib')?.getBoundingClientRect();
      if (attr && attr.height) obs.push({ rect: { left: cr.left, right: cr.right, top: rowTop - attr.height, bottom: rowTop }, edge: 'bottom' });
      const ctrls = el.querySelector('.maplibregl-ctrl-top-right')?.getBoundingClientRect();
      if (ctrls && ctrls.width) obs.push({ rect: ctrls, edge: 'right' });
      if (window.matchMedia(PHONE_Q).matches) {
        const h = sheetOverride ?? (parseFloat(document.documentElement.style.getPropertyValue('--sheet-h')) || 96);
        obs.push({ rect: { left: cr.left, right: cr.right, top: window.innerHeight - h, bottom: window.innerHeight }, edge: 'bottom' });
      }
      return { size: { w: cr.width, h: cr.height }, unob: unobscuredRect(cr, obs) };
    };
    const camera = (): Camera => ({ center: [map.getCenter().lng, map.getCenter().lat], zoom: map.getZoom() });
    // Zoom range and the generous outer limit follow the layout; the soft limit itself is applied when a gesture ends.
    const applyLimits = (m: { size: Size; unob: Rect }) => {
      const minZ = minZoomFor(regionBox, m.size, m.unob);
      map.setMinZoom(minZ);
      map.setMaxBounds(toBounds(hardBounds(regionBox, minZ, m.size)));
      map.fire('zoom'); // refreshes the zoom buttons' disabled state
    };
    let fitted = false, lastSize = '';
    const fitTo = (m: { size: Size; unob: Rect }, animate: boolean) => {
      applyLimits(m);
      if (!studyBox) return;
      const cam = fitCamera(studyBox, m.size, m.unob);
      fitted = true;
      userMoved.current = false;
      if (animate && !reduce) map.easeTo({ center: cam.center, zoom: cam.zoom, duration: 400, essential: false });
      else map.jumpTo({ center: cam.center, zoom: cam.zoom });
    };
    const fitNow = (animate: boolean) => { const m = measure(); if (m) fitTo(m, animate); };
    const hiddenNow = (m: { unob: Rect }) => ring.some((pt) => !insideRect(map.project(pt as [number, number]), m.unob, 1));

    let down = 0, userGesture = false, gliding = false, timer = 0;
    const gestureActive = () => down > 0 || userGesture || !!document.querySelector('.sheet.dragging');
    const cancelSettle = () => { window.clearTimeout(timer); timer = 0; if (gliding) { gliding = false; map.stop(); } };
    const settle = () => {
      const m = measure();
      if (!m) return;
      const c = camera(), t = correctedCamera(c, m.size, m.unob, regionBox);
      if (t === c) return;
      if (reduce) { map.jumpTo({ center: t.center }); return; }
      gliding = true;
      map.easeTo({ center: t.center, duration: GLIDE_MS, essential: false });
    };
    const later = (fn: () => void) => { window.clearTimeout(timer); timer = window.setTimeout(fn, SETTLE_MS); };
    const onSettled = () => {
      if (gestureActive()) { later(onSettled); return; }
      settle();
    };
    const onLayout = () => {
      if (gestureActive()) { later(onLayout); return; }
      const m = measure();
      if (!m) return;
      const key = `${Math.round(m.size.w)}x${Math.round(m.size.h)}`;
      const resized = key !== lastSize;
      lastSize = key;
      applyLimits(m);
      if (!userMoved.current && (resized || !fitted || hiddenNow(m))) fitTo(m, false);
      else settle();
    };
    const layoutLater = () => later(onLayout);
    if (new URLSearchParams(location.search).has('debug')) {
      (window as unknown as { __trafficView?: unknown }).__trafficView = {
        measure: () => measure(), ring, regionBox, minZoom: () => map.getMinZoom(),
        acceptable: () => { const m = measure(); return !!m && isAcceptable(camera(), m.size, m.unob, regionBox); },
        userMoved: () => userMoved.current,
        project: (p: [number, number]) => { const q = map.project(p); return { x: q.x, y: q.y }; },
      };
    }
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.AttributionControl({
      compact: false,
      customAttribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>',
    }), 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new FitControl(() => { cancelSettle(); fitNow(true); }), 'top-right');
    map.on('movestart', (e) => { if (originalOf(e)) { userMoved.current = true; userGesture = true; cancelSettle(); } });
    // A pop-up whose place has been dragged out of view closes rather than clinging to the edge.
    map.on('moveend', (e) => {
      gliding = false;
      if (originalOf(e)) userGesture = false;
      else if (userGesture && !map.isMoving()) userGesture = false;
      later(onSettled);
      const L = live.current;
      if (!originalOf(e) || !L.selection || !L.popover) return;
      const [x, y] = selectionAnchor(L.bundle.network, L.index, L.selection);
      const pt = map.project(L.proj.toLonLat(x, y)), c = map.getContainer();
      if (pt.x < 0 || pt.y < 0 || pt.x > c.clientWidth || pt.y > c.clientHeight) L.onHit(null);
    });
    const press = () => { down++; cancelSettle(); };
    const release = () => { down = Math.max(0, down - 1); };
    el.addEventListener('pointerdown', press, { capture: true });
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    reveal.current = (force) => {
      const L = live.current;
      if (!L.selection) return;
      const [x, y] = selectionAnchor(L.bundle.network, L.index, L.selection);
      const ll = L.proj.toLonLat(x, y);
      const m = measure(L.selection.via !== 'search' ? Math.round(window.innerHeight * 0.5) : undefined);
      if (!m) return;
      const pt = map.project(ll), inset = 56, u = m.unob;
      const inside = pt.x >= u.left + inset && pt.y >= u.top + inset && pt.x <= u.right - inset && pt.y <= u.bottom - inset;
      if (force || !inside) {
        userMoved.current = true;
        map.easeTo({ center: centerToShow(ll, map.getZoom(), m.size, m.unob), duration: reduce ? 0 : 350, essential: false });
      }
    };
    fitNow(false);
    lastSize = (() => { const m = measure(); return m ? `${Math.round(m.size.w)}x${Math.round(m.size.h)}` : ''; })();
    const cv = map.getCanvas();
    cv.setAttribute('aria-label', `Map of ${b.network.name}. Streets, cars, bicycles, pedestrians and signals. Select a street or an intersection by clicking it, or find it by name in the Scenario panel. The same information is available in the Streets table.`);

    map.on('load', () => {
      const pr = makeProjection(b.network.origin);
      map.addSource('basemap', { type: 'geojson', data: clipped.base as never });
      map.addSource('study', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [b.network.studyArea] } } });
      map.addSource('links', { type: 'geojson', data: clipped.links as never });
      map.addSource('hover', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addSource('selection', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      const K = KIND_STYLE.light;
      const major = ['match', ['get', 'kind'], ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'], true, false] as never;
      map.addLayer({ id: 'base-paths', type: 'line', source: 'basemap', filter: ['match', ['get', 'kind'], ['footway', 'path', 'cycleway', 'steps', 'pedestrian', 'track'], true, false],
        paint: { 'line-color': K.path, 'line-width': 1, 'line-dasharray': [2, 2] } });
      map.addLayer({ id: 'base-lines', type: 'line', source: 'basemap', filter: ['!', ['match', ['get', 'kind'], ['footway', 'path', 'cycleway', 'steps', 'pedestrian', 'track'], true, false]],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['case', major, K.major, K.minor], 'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.6, 18, ['case', major, 9, 5]] } });
      map.addLayer({ id: 'study-fill', type: 'fill', source: 'study', paint: { 'fill-color': K.study, 'fill-opacity': 0.05 } });
      map.addLayer({ id: 'study-line', type: 'line', source: 'study', paint: { 'line-color': K.study, 'line-width': 2, 'line-dasharray': [4, 3] } });
      // Selected block: a wide outline plus accent band under the street, so the street's own color stays readable.
      map.addLayer({ id: 'sel-edge', type: 'line', source: 'selection', filter: ['==', ['geometry-type'], 'LineString'], layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': SEL_EDGE[mode], 'line-width': ['interpolate', ['linear'], ['zoom'], 14, 13, 18, 22] as never, 'line-offset': OFFSET as never } });
      map.addLayer({ id: 'sel-band', type: 'line', source: 'selection', filter: ['==', ['geometry-type'], 'LineString'], layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': K.study, 'line-width': ['interpolate', ['linear'], ['zoom'], 14, 9, 18, 17] as never, 'line-offset': OFFSET as never } });
      map.addLayer({ id: 'links-casing', type: 'line', source: 'links', layout: { 'line-cap': 'butt', 'line-join': 'round' },
        paint: { 'line-color': mode === 'dark' ? '#0b1118' : '#ffffff', 'line-opacity': 0.85, 'line-width': casingWidth(live.current.view) as never, 'line-offset': OFFSET as never } });
      const bikeVis = live.current.showBikeNet ? 'visible' : 'none';
      const BN = BIKENET[live.current.mode];
      map.addLayer({ id: 'bike-route', type: 'line', source: 'links', filter: ['get', 'bikeRoute'] as never,
        layout: { 'line-cap': 'butt', 'line-join': 'round', visibility: bikeVis },
        paint: { 'line-color': BN.color, 'line-opacity': bikeOpacity(BN.route, 13, 14.5), 'line-dasharray': [2.5, 2.5], 'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1.3, 18, 2.6] as never, 'line-offset': OFFSET as never } });
      map.addLayer({ id: 'bike-lane', type: 'line', source: 'links', filter: ['get', 'bikeLane'] as never,
        layout: { 'line-cap': 'butt', 'line-join': 'round', visibility: bikeVis },
        paint: { 'line-color': BN.color, 'line-opacity': bikeOpacity(BN.lane, 11.5, 14), 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.6, 14, 1.5, 18, 3] as never, 'line-offset': OFFSET as never } });
      map.addLayer({ id: 'links', type: 'line', source: 'links', layout: { 'line-cap': 'butt', 'line-join': 'round' },
        paint: { 'line-color': ramp(mode, live.current.view) as never, 'line-width': widthExpr(live.current.view) as never, 'line-offset': OFFSET as never } });
      map.addLayer({ id: 'links-decrease', type: 'line', source: 'links', layout: { 'line-cap': 'butt', 'line-join': 'round', visibility: live.current.view === 'change' ? 'visible' : 'none' },
        paint: { 'line-color': mode === 'dark' ? '#0b1118' : '#ffffff', 'line-opacity': dashOpacity() as never, 'line-dasharray': [1.4, 1.4], 'line-width': widthExpr('change') as never, 'line-offset': OFFSET as never } });
      for (let k = 1; k <= FEATHER_STEPS; k++) {
        map.addSource(`feather-${k}`, { type: 'geojson', data: featherWash(b, region, k) as never });
        map.addLayer({ id: `feather-${k}`, type: 'fill', source: `feather-${k}`, paint: { 'fill-color': K.bg, 'fill-opacity': featherAlpha(k), 'fill-antialias': false } });
      }
      map.addLayer({ id: 'sel-node-edge', type: 'circle', source: 'selection', filter: ['==', ['geometry-type'], 'Point'],
        paint: { 'circle-radius': 15, 'circle-color': K.study, 'circle-opacity': 0.18, 'circle-stroke-color': SEL_EDGE[mode], 'circle-stroke-width': 9 } });
      map.addLayer({ id: 'sel-node', type: 'circle', source: 'selection', filter: ['==', ['geometry-type'], 'Point'],
        paint: { 'circle-radius': 15, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': K.study, 'circle-stroke-width': 4 } });
      map.addLayer({ id: 'hover-node', type: 'circle', source: 'hover', filter: ['==', ['geometry-type'], 'Point'],
        paint: { 'circle-radius': 13, 'circle-color': K.study, 'circle-opacity': 0.25, 'circle-stroke-color': K.study, 'circle-stroke-width': 2, 'circle-stroke-opacity': 0.7 } });
      map.addLayer({ id: 'hover', type: 'line', source: 'hover', layout: { 'line-cap': 'round' },
        paint: { 'line-color': K.study, 'line-width': 7, 'line-opacity': 0.55, 'line-offset': OFFSET as never } });
      map.once('idle', () => setReady(true));
    });
    map.on('move', schedule);
    map.on('resize', schedule);
    const ro = new ResizeObserver(() => { map.resize(); layoutLater(); schedule(); });
    ro.observe(el);
    const watched = ['.toolbar', '.legend-row', '.maplibregl-ctrl-top-right', '.maplibregl-ctrl-attrib']
      .map((q) => (q === '.toolbar' ? document : el.parentElement ?? document).querySelector(q)).filter((n): n is Element => !!n);
    watched.forEach((n) => ro.observe(n));
    // The sheet publishes its height as a root style property.
    const mo = new MutationObserver(layoutLater);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    return () => {
      ro.disconnect(); mo.disconnect(); window.clearTimeout(timer);
      el.removeEventListener('pointerdown', press, { capture: true });
      window.removeEventListener('pointerup', release); window.removeEventListener('pointercancel', release);
      markers.current.forEach((m) => m.remove()); map.remove(); mapRef.current = null; setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle]);

  // ---- theme
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const apply = () => {
    const K = KIND_STYLE[mode];
    const major = ['match', ['get', 'kind'], ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'], true, false] as never;
    map.setPaintProperty('bg', 'background-color', K.bg);
    map.setPaintProperty('base-paths', 'line-color', K.path);
    map.setPaintProperty('base-lines', 'line-color', ['case', major, K.major, K.minor]);
    for (let k = 1; k <= FEATHER_STEPS; k++) map.setPaintProperty(`feather-${k}`, 'fill-color', K.bg);
    map.setPaintProperty('study-fill', 'fill-color', K.study);
    map.setPaintProperty('study-line', 'line-color', K.study);
    map.setPaintProperty('hover', 'line-color', K.study);
    map.setPaintProperty('hover-node', 'circle-color', K.study);
    map.setPaintProperty('hover-node', 'circle-stroke-color', K.study);
    map.setPaintProperty('sel-band', 'line-color', K.study);
    map.setPaintProperty('sel-edge', 'line-color', SEL_EDGE[mode]);
    map.setPaintProperty('sel-node', 'circle-stroke-color', K.study);
    map.setPaintProperty('sel-node-edge', 'circle-color', K.study);
    map.setPaintProperty('sel-node-edge', 'circle-stroke-color', SEL_EDGE[mode]);
    map.setPaintProperty('links-casing', 'line-color', mode === 'dark' ? '#0b1118' : '#ffffff');
    map.setPaintProperty('links', 'line-color', ramp(mode, live.current.view) as never);
    map.setPaintProperty('links-decrease', 'line-color', mode === 'dark' ? '#0b1118' : '#ffffff');
    map.setPaintProperty('bike-lane', 'line-color', BIKENET[mode].color);
    map.setPaintProperty('bike-route', 'line-color', BIKENET[mode].color);
    map.setPaintProperty('bike-lane', 'line-opacity', bikeOpacity(BIKENET[mode].lane, 11.5, 14));
    map.setPaintProperty('bike-route', 'line-opacity', bikeOpacity(BIKENET[mode].route, 13, 14.5));
    };
    try { apply(); } catch { map.once('idle', () => { try { apply(); } catch { /* theme applies on next change */ } }); }
    schedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, ready]);

  // ---- bike network layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    for (const id of ['bike-lane', 'bike-route']) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', p.showBikeNet ? 'visible' : 'none');
  }, [p.showBikeNet, ready]);

  // ---- overlay values -> feature-state
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const links = bundle.network.links;
    const ls = p.linkStats;
    const vis = clipped.linkVisible;
    const change = p.view === 'change';
    const S = linkStatsView(ls), B = linkStatsView(p.baseStats);
    if (prevView.current !== p.view) { prevView.current = p.view; prevT.current = new Float32Array(0); }
    if (prevT.current.length !== links.length) prevT.current = new Float32Array(links.length).fill(-3);
    for (let i = 0; i < links.length; i++) {
      if (!vis[i]) continue;
      const l = links[i];
      const t = change ? (ls && p.baseStats ? linkChangeIntensity(p.overlay, B, S, i) : NO_DATA)
        : ls ? intensity(p.overlay, ls[i * 4] ?? 0, ls[i * 4 + 1] ?? 0, ls[i * 4 + 2] ?? 0, l.speedLimit, p.overlayMax) : -1;
      if (Math.abs(prevT.current[i] - t) > 0.004) {
        prevT.current[i] = t;
        map.setFeatureState({ source: 'links', id: i }, { t });
      }
    }
  }, [p.linkStats, p.baseStats, p.view, p.overlay, p.overlayMax, ready, bundle, clipped]);

  // ---- view switch: swap paint expressions once, not per update
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const v = p.view;
    map.setPaintProperty('links', 'line-color', ramp(mode, v) as never);
    map.setPaintProperty('links', 'line-width', widthExpr(v) as never);
    map.setPaintProperty('links-casing', 'line-width', casingWidth(v) as never);
    map.setLayoutProperty('links-decrease', 'visibility', v === 'change' ? 'visible' : 'none');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.view, ready]);

  // ---- redraw on frames
  useEffect(() => {
    if (!p.client) return;
    p.client.onFrame = scheduleFrame;
    schedule();
    return () => { if (p.client) p.client.onFrame = null; window.clearTimeout(drawTimer.current); drawTimer.current = 0; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.client]);
  useEffect(() => { schedule(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [mode, p.visible, p.modes]);
  useEffect(() => { if (p.visible) mapRef.current?.resize(); }, [p.visible]);

  // ---- intervention markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    markers.current.forEach((m) => m.remove());
    markers.current = p.interventions.filter((iv) => interventionInRegion(iv, bundle.network, region)).map((iv) => {
      const [x, y] = interventionPoint(iv, bundle.network);
      const el = document.createElement('div');
      if (iv.type === 'diagonal_diverter') {
        // A thick barrier line along the diagonal, outlined in the opposite tone so it reads on light and dark basemaps.
        el.className = 'iv-diverter';
        el.innerHTML = `<svg width="44" height="44" viewBox="-22 -22 44 44" focusable="false"><g transform="rotate(${iv.bearing})"><line x1="0" y1="-17" x2="0" y2="17" class="iv-dd-halo"/><line x1="0" y1="-17" x2="0" y2="17" class="iv-dd-out"/><line x1="0" y1="-17" x2="0" y2="17" class="iv-dd-in"/></g></svg>`;
      } else {
        el.className = `iv-badge iv-${iv.type}`;
        el.textContent = iv.type === 'speed_limit' ? String(Math.round(iv.speed * 2.23694)) : BADGE[iv.type];
      }
      el.setAttribute('aria-hidden', 'true');
      el.title = describeIntervention(iv, bundle.network, p.index);
      return new maplibregl.Marker({ element: el }).setLngLat(proj.toLonLat(x, y)).addTo(map);
    });
  }, [p.interventions, ready, bundle, proj, p.index, region]);

  // ---- selection highlight and keeping it in view
  const selKey = p.selection ? `${p.selection.kind}-${p.selection.kind === 'block' ? p.selection.block : p.selection.node}-${p.selection.via}` : '';
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const src = map.getSource('selection') as maplibregl.GeoJSONSource | undefined;
    const net = bundle.network, sel = p.selection;
    const feats: unknown[] = [];
    if (sel?.kind === 'block') {
      for (const id of p.index.blocks[sel.block].links) feats.push(...lineFeature(region, proj, net.links[id].geometry));
    } else if (sel) {
      const n = net.nodes[sel.node];
      feats.push({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: proj.toLonLat(n.x, n.y) } });
    }
    src?.setData({ type: 'FeatureCollection', features: feats } as never);
    if (sel) {
      if (sel.via === 'map' && window.matchMedia('(max-width: 719.98px)').matches) userMoved.current = true;
      reveal.current(sel.via !== 'map');
    }
  }, [selKey, ready]); // eslint-disable-line

  // ---- picking
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const cvs = map.getCanvas();
    const nodeIds = new Set(p.index.intersections);
    const find = (lngLat: maplibregl.LngLat) => {
      const L = live.current;
      const [x, y] = L.proj.toLocal(lngLat.lng, lngLat.lat);
      if (!L.region.contains(x, y)) return { hit: null, x, y };
      const mpp = metersPerPixel(map.getZoom(), lngLat.lat);
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const hit = hitTest(L.bundle.network, x, y, { nodeTolM: (coarse ? 22 : 14) * mpp, linkTolM: (coarse ? 16 : 10) * mpp, nodeIds });
      return { hit, x, y };
    };
    const hoverSrc = () => map.getSource('hover') as maplibregl.GeoJSONSource | undefined;
    const clearHover = () => { hoverSrc()?.setData({ type: 'FeatureCollection', features: [] }); setHoverText(''); cvs.style.cursor = ''; };
    const move = (e: maplibregl.MapMouseEvent) => {
      if ((e.originalEvent as MouseEvent).buttons) return;
      const L = live.current, net = L.bundle.network;
      const { hit } = find(e.lngLat);
      const feats: unknown[] = [];
      let text = '';
      if (hit?.kind === 'link') {
        const blk = L.index.blocks[L.index.blockOfLink[hit.link]];
        for (const id of blk.links) feats.push(...lineFeature(L.region, L.proj, net.links[id].geometry));
        text = blk.label;
      } else if (hit) {
        const n = net.nodes[hit.node];
        feats.push({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: L.proj.toLonLat(n.x, n.y) } });
        text = L.index.nodeName[hit.node];
      }
      hoverSrc()?.setData({ type: 'FeatureCollection', features: feats } as never);
      setHoverText(text);
      cvs.style.cursor = hit ? 'pointer' : '';
    };
    // A click that ends a drag or pan is not a selection.
    let down: { x: number; y: number } | null = null;
    const press = (e: { point: { x: number; y: number } }) => { down = { x: e.point.x, y: e.point.y }; };
    const click = (e: maplibregl.MapMouseEvent) => {
      if (down && Math.hypot(e.point.x - down.x, e.point.y - down.y) > 6) return;
      const L = live.current;
      const { hit, x, y } = find(e.lngLat);
      if (!hit) return L.onHit(null);
      if (hit.kind === 'node') return L.onHit({ kind: 'node', node: hit.node, via: 'map' });
      L.onHit({ kind: 'block', block: L.index.blockOfLink[hit.link], point: [x, y], nearLink: hit.link, via: 'map' });
    };
    map.on('mousemove', move); map.on('mousedown', press); map.on('touchstart', press); map.on('click', click); cvs.addEventListener('mouseleave', clearHover);
    return () => {
      map.off('mousemove', move); map.off('mousedown', press); map.off('touchstart', press); map.off('click', click); cvs.removeEventListener('mouseleave', clearHover);
      clearHover();
    };
  }, [ready]); // eslint-disable-line

  const anchor = useMemo(() => {
    if (!p.selection) return null;
    const [x, y] = selectionAnchor(bundle.network, p.index, p.selection);
    return proj.toLonLat(x, y);
  }, [selKey, p.selection && p.selection.kind === 'block' ? p.selection.point : null, bundle, proj, p.index]); // eslint-disable-line

  return (
    <div className="map-wrap" hidden={!p.visible}>
      <div ref={box} className="map" role="group" aria-label={`Interactive map of ${bundle.network.name}`} />
      <canvas ref={canvas} className="map-overlay" aria-hidden="true" />
      {hoverText && !p.popover && <div className="map-hint" aria-hidden="true">{hoverText}</div>}
      {p.popover && anchor && ready && mapRef.current && <PopoverFrame map={mapRef.current} anchor={anchor}>{p.popover}</PopoverFrame>}
    </div>
  );
}

