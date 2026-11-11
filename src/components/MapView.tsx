import { useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import type { AreaBundle, Intervention, Overlay } from '../types';
import { makeProjection, metersPerPixel } from '../lib/projection';
import { pickLink, pickNode, pointAlong } from '../lib/geom';
import { intensity, rampStops, WIDTH_MAX, WIDTH_MIN, type Mode } from '../lib/ramps';
import type { NetIndex } from '../lib/naming';
import { describeIntervention, interventionPoint } from '../lib/describe';
import type { SimClient } from '../sim/client';

maplibregl.setWorkerUrl(workerUrl);

export type PickKind = 'link' | 'node' | null;

interface Props {
  bundle: AreaBundle;
  index: NetIndex;
  mode: Mode;
  overlay: Overlay;
  overlayMax: number;
  linkStats: Float32Array | null;
  client: SimClient | null;
  interventions: Intervention[];
  pick: PickKind;
  pickDirectional: boolean;
  onPickLink(id: number): void;
  onPickNode(id: number): void;
  visible: boolean;
  reducedMotion: boolean;
}

const KIND_STYLE = {
  light: { bg: '#f1efe8', water: '#cfd8e0', minor: '#d8d3c6', major: '#b9b2a0', path: '#cdd5bf', study: '#0b5cad' },
  dark: { bg: '#161b22', water: '#1d2a38', minor: '#2b323c', major: '#3d4654', path: '#27302a', study: '#7db6f5' },
};

function ramp(mode: Mode): unknown[] {
  const s = rampStops(mode);
  const muted = mode === 'dark' ? '#4a5463' : '#a8a291';
  return ['interpolate', ['linear'], ['coalesce', ['feature-state', 't'], -1],
    -1, muted, -0.01, muted, 0, s[0], 0.25, s[1], 0.5, s[2], 0.75, s[3], 1, s[4]];
}
function widthExpr(): unknown[] {
  const w = ['interpolate', ['linear'], ['coalesce', ['feature-state', 't'], -1],
    -1, WIDTH_MIN * 0.8, 0, WIDTH_MIN, 1, WIDTH_MAX];
  return ['interpolate', ['linear'], ['zoom'], 14, ['*', 0.55, w], 18, ['*', 1.5, w]];
}
const casingWidth = (): unknown[] => {
  const w = widthExpr() as unknown[];
  return ['interpolate', ['linear'], ['zoom'], 14, ['+', 1.2, (w[4] as unknown[])], 18, ['+', 1.8, (w[6] as unknown[])]];
};
const OFFSET = ['interpolate', ['linear'], ['zoom'], 14, 1.2, 17, 3.5, 19, 6];

const BADGE: Record<string, string> = {
  modal_filter: 'MF', speed_hump: 'SH', speed_limit: 'SL', traffic_circle: 'TC', control: 'IC',
  signal_timing: 'ST', one_way: '1W', turn_ban: 'TB',
};

function studyBounds(b: AreaBundle): maplibregl.LngLatBoundsLike | null {
  const ring = b.network.studyArea;
  if (!ring || ring.length < 3) return null;
  const bb = new maplibregl.LngLatBounds();
  for (const pt of ring) bb.extend(pt as [number, number]);
  return bb;
}
function fitPadding(map: maplibregl.Map) {
  const c = map.getContainer();
  const cr = c.getBoundingClientRect();
  const w = cr.width;
  const pad = { top: 36, bottom: 36, left: 36, right: 64 };
  const lg = c.closest('.map-area')?.querySelector<HTMLElement>('.legend');
  if (lg) {
    const lr = lg.getBoundingClientRect();
    // Keep the polygon clear of the legend: sidestep it on wide maps, sit above it on narrow ones.
    if (w >= 640) pad.left = Math.max(pad.left, Math.round(lr.right - cr.left) + 16);
    else { pad.bottom = Math.max(pad.bottom, Math.round(cr.bottom - lr.top) + 8); pad.top = 20; pad.left = pad.right = 20; }
  }
  return pad;
}
function fitArea(map: maplibregl.Map, b: AreaBundle, animate: boolean) {
  const bounds = studyBounds(b);
  if (!bounds) return;
  map.fitBounds(bounds, { padding: fitPadding(map), maxZoom: 17.5, animate, duration: 400 });
}
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
  const { bundle, mode } = p;
  const proj = useMemo(() => makeProjection(bundle.network.origin), [bundle]);
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const live = useRef({ ...p, proj });
  live.current = { ...p, proj };
  const drawReq = useRef(0);
  const hoverRef = useRef<{ link: number | null; node: number | null }>({ link: null, node: null });
  const markers = useRef<maplibregl.Marker[]>([]);
  const prevT = useRef<Float32Array>(new Float32Array(0));

  // ---- draw vehicles + signals on overlay canvas
  const draw = () => {
    drawReq.current = 0;
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
    const r = Math.max(2, Math.min(6, 1.2 + pxPerM * 2.2));
    const v = frame.vehicles;
    const normal = dark ? '#7db6f5' : '#1d5fc4';
    g.lineWidth = 1; g.strokeStyle = dark ? '#0b1118' : '#ffffff'; g.fillStyle = normal;
    g.beginPath();
    for (let i = 0; i + 5 < v.length; i += 6) {
      if ((v[i + 5] & 1) === 1) continue;
      const sx = o.x + v[i] * ax + v[i + 1] * bx, sy = o.y + v[i] * ay + v[i + 1] * by;
      if (sx < -10 || sy < -10 || sx > w + 10 || sy > h + 10) continue;
      g.moveTo(sx + r, sy); g.arc(sx, sy, r, 0, Math.PI * 2);
    }
    g.fill(); g.stroke();
    // through trips: diamond with heavy dark outline in orange
    const rr = r * 1.45;
    g.fillStyle = dark ? '#ffa94d' : '#e8590c'; g.strokeStyle = dark ? '#ffffff' : '#1a0f05'; g.lineWidth = 1.6;
    g.beginPath();
    for (let i = 0; i + 5 < v.length; i += 6) {
      if ((v[i + 5] & 1) !== 1) continue;
      const sx = o.x + v[i] * ax + v[i + 1] * bx, sy = o.y + v[i] * ay + v[i + 1] * by;
      if (sx < -10 || sy < -10 || sx > w + 10 || sy > h + 10) continue;
      g.moveTo(sx, sy - rr); g.lineTo(sx + rr, sy); g.lineTo(sx, sy + rr); g.lineTo(sx - rr, sy); g.closePath();
    }
    g.fill(); g.stroke();
    // signals: green = open ring, yellow = triangle, red = filled square
    const net = L.bundle.network, sg = frame.signals;
    const sz = Math.max(4, Math.min(7, 3 + pxPerM * 1.6));
    for (let li = 0; li < sg.length && li < net.links.length; li++) {
      const st = sg[li];
      if (!st) continue;
      const link = net.links[li];
      const pp = pointAlong(link.geometry, Math.max(0, link.length - 5));
      const nx = Math.sin(pp.heading) * 3.5, ny = -Math.cos(pp.heading) * 3.5; // right of travel
      const x = pp.x + nx, y = pp.y + ny;
      const sx = o.x + x * ax + y * bx, sy = o.y + x * ay + y * by;
      g.lineWidth = 2;
      if (st === 1) { g.strokeStyle = '#1f9d55'; g.fillStyle = dark ? '#0b1118' : '#fff'; g.beginPath(); g.arc(sx, sy, sz, 0, 7); g.fill(); g.stroke(); }
      else if (st === 2) { g.strokeStyle = dark ? '#fff' : '#1a1a1a'; g.fillStyle = '#f5c400'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(sx, sy - sz); g.lineTo(sx + sz, sy + sz * 0.8); g.lineTo(sx - sz, sy + sz * 0.8); g.closePath(); g.fill(); g.stroke(); }
      else { g.strokeStyle = dark ? '#fff' : '#1a1a1a'; g.fillStyle = '#d62728'; g.lineWidth = 1.2; g.beginPath(); g.rect(sx - sz * 0.85, sy - sz * 0.85, sz * 1.7, sz * 1.7); g.fill(); g.stroke(); }
    }
  };
  const schedule = () => { if (!drawReq.current) drawReq.current = requestAnimationFrame(draw); };

  // ---- create map once
  useEffect(() => {
    const el = box.current!;
    const b = bundle;
    const map = new maplibregl.Map({
      container: el,
      style: { version: 8, sources: {}, layers: [{ id: 'bg', type: 'background', paint: { 'background-color': KIND_STYLE.light.bg } }] },
      center: b.entry.center, zoom: Math.min(b.entry.zoom, 14.5), minZoom: 12, maxZoom: 19.5,
      attributionControl: false, dragRotate: false, pitchWithRotate: false, fadeDuration: 0,
      canvasContextAttributes: { antialias: true },
    } as maplibregl.MapOptions);
    mapRef.current = map;
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.AttributionControl({
      compact: false,
      customAttribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>',
    }), 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new FitControl(() => { userMoved = false; fitArea(map, b, !reduce); }), 'top-right');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let userMoved = false;
    map.on('dragstart', () => { userMoved = true; });
    map.on('zoomstart', (e) => { if ((e as { originalEvent?: unknown }).originalEvent) userMoved = true; });
    fitArea(map, b, false);
    const cv = map.getCanvas();
    cv.setAttribute('aria-label', `Map of ${b.network.name}. Streets, vehicles and signals. The same information and actions are available in the side panel and the Streets table.`);

    map.on('load', () => {
      const pr = makeProjection(b.network.origin);
      map.addSource('basemap', { type: 'geojson', data: b.basemap as never });
      map.addSource('study', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [b.network.studyArea] } } });
      map.addSource('links', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: b.network.links.map((l) => ({
            type: 'Feature', id: l.id, properties: { id: l.id },
            geometry: { type: 'LineString', coordinates: l.geometry.map(([x, y]) => pr.toLonLat(x, y)) },
          })),
        },
      });
      map.addSource('hover', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      const K = KIND_STYLE.light;
      const major = ['match', ['get', 'kind'], ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'], true, false] as never;
      map.addLayer({ id: 'base-paths', type: 'line', source: 'basemap', filter: ['match', ['get', 'kind'], ['footway', 'path', 'cycleway', 'steps', 'pedestrian', 'track'], true, false],
        paint: { 'line-color': K.path, 'line-width': 1, 'line-dasharray': [2, 2] } });
      map.addLayer({ id: 'base-lines', type: 'line', source: 'basemap', filter: ['!', ['match', ['get', 'kind'], ['footway', 'path', 'cycleway', 'steps', 'pedestrian', 'track'], true, false]],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['case', major, K.major, K.minor], 'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.6, 18, ['case', major, 9, 5]] } });
      map.addLayer({ id: 'study-fill', type: 'fill', source: 'study', paint: { 'fill-color': K.study, 'fill-opacity': 0.05 } });
      map.addLayer({ id: 'study-line', type: 'line', source: 'study', paint: { 'line-color': K.study, 'line-width': 2, 'line-dasharray': [4, 3] } });
      map.addLayer({ id: 'links-casing', type: 'line', source: 'links', layout: { 'line-cap': 'butt', 'line-join': 'round' },
        paint: { 'line-color': mode === 'dark' ? '#0b1118' : '#ffffff', 'line-opacity': 0.85, 'line-width': casingWidth() as never, 'line-offset': OFFSET as never } });
      map.addLayer({ id: 'links', type: 'line', source: 'links', layout: { 'line-cap': 'butt', 'line-join': 'round' },
        paint: { 'line-color': ramp(mode) as never, 'line-width': widthExpr() as never, 'line-offset': OFFSET as never } });
      map.addLayer({ id: 'hover', type: 'line', source: 'hover', layout: { 'line-cap': 'round' },
        paint: { 'line-color': K.study, 'line-width': 7, 'line-opacity': 0.55, 'line-offset': OFFSET as never } });
      map.once('idle', () => setReady(true));
    });
    map.on('move', schedule);
    map.on('resize', schedule);
    const ro = new ResizeObserver(() => { map.resize(); if (!userMoved && el.clientWidth > 0) fitArea(map, b, false); schedule(); });
    ro.observe(el);
    return () => { ro.disconnect(); markers.current.forEach((m) => m.remove()); map.remove(); mapRef.current = null; setReady(false); };
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
    map.setPaintProperty('study-fill', 'fill-color', K.study);
    map.setPaintProperty('study-line', 'line-color', K.study);
    map.setPaintProperty('hover', 'line-color', K.study);
    map.setPaintProperty('links-casing', 'line-color', mode === 'dark' ? '#0b1118' : '#ffffff');
    map.setPaintProperty('links', 'line-color', ramp(mode) as never);
    };
    try { apply(); } catch { map.once('idle', () => { try { apply(); } catch { /* theme applies on next change */ } }); }
    schedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, ready]);

  // ---- overlay values -> feature-state
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const links = bundle.network.links;
    const ls = p.linkStats;
    if (prevT.current.length !== links.length) prevT.current = new Float32Array(links.length).fill(-2);
    for (const l of links) {
      const i = l.id;
      const t = ls ? intensity(p.overlay, ls[i * 4] ?? 0, ls[i * 4 + 1] ?? 0, ls[i * 4 + 2] ?? 0, l.speedLimit, p.overlayMax) : -1;
      if (Math.abs(prevT.current[i] - t) > 0.004) {
        prevT.current[i] = t;
        map.setFeatureState({ source: 'links', id: i }, { t });
      }
    }
  }, [p.linkStats, p.overlay, p.overlayMax, ready, bundle]);

  // ---- redraw on frames
  useEffect(() => {
    if (!p.client) return;
    p.client.onFrame = schedule;
    schedule();
    return () => { if (p.client) p.client.onFrame = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.client]);
  useEffect(() => { schedule(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [mode, p.visible]);
  useEffect(() => { if (p.visible) mapRef.current?.resize(); }, [p.visible]);

  // ---- intervention markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    markers.current.forEach((m) => m.remove());
    markers.current = p.interventions.map((iv) => {
      const [x, y] = interventionPoint(iv, bundle.network);
      const el = document.createElement('div');
      el.className = `iv-badge iv-${iv.type}`;
      el.textContent = iv.type === 'speed_limit' ? String(Math.round(iv.speed * 2.23694)) : BADGE[iv.type];
      el.setAttribute('aria-hidden', 'true');
      el.title = describeIntervention(iv, bundle.network, p.index);
      return new maplibregl.Marker({ element: el }).setLngLat(proj.toLonLat(x, y)).addTo(map);
    });
  }, [p.interventions, ready, bundle, proj, p.index]);

  // ---- picking
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const cvs = map.getCanvas();
    cvs.style.cursor = p.pick ? 'crosshair' : '';
    const find = (lngLat: maplibregl.LngLat) => {
      const L = live.current;
      const [x, y] = L.proj.toLocal(lngLat.lng, lngLat.lat);
      const mpp = metersPerPixel(map.getZoom(), lngLat.lat);
      if (L.pick === 'node') return { node: pickNode(L.bundle.network, x, y, 18 * mpp), link: null as number | null };
      const l = pickLink(L.bundle.network, x, y, 12 * mpp);
      return { node: null, link: l ? l.id : null };
    };
    const move = (e: maplibregl.MapMouseEvent) => {
      if (!live.current.pick) return;
      const f = find(e.lngLat);
      hoverRef.current = f;
      const src = map.getSource('hover') as maplibregl.GeoJSONSource | undefined;
      const net = live.current.bundle.network;
      const feats: unknown[] = [];
      let text = '';
      if (f.link !== null) {
        const l = net.links[f.link];
        const ids = live.current.pickDirectional || l.reverse === null ? [l.id] : [l.id, l.reverse];
        for (const id of ids) feats.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: net.links[id].geometry.map(([a, b]) => live.current.proj.toLonLat(a, b)) } });
        text = live.current.pickDirectional ? `${live.current.index.linkName[l.id]} → ${live.current.index.nodeName[l.to]}` : live.current.index.blocks[live.current.index.blockOfLink[f.link]]?.label ?? '';
      } else if (f.node !== null) {
        const n = net.nodes[f.node];
        feats.push({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: live.current.proj.toLonLat(n.x, n.y) } });
        text = live.current.index.nodeName[f.node];
      }
      src?.setData({ type: 'FeatureCollection', features: feats } as never);
      setHoverText(text);
    };
    const click = (e: maplibregl.MapMouseEvent) => {
      if (!live.current.pick) return;
      const f = find(e.lngLat);
      if (f.link !== null) live.current.onPickLink(f.link);
      else if (f.node !== null) live.current.onPickNode(f.node);
    };
    const leave = () => { (map.getSource('hover') as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: [] }); setHoverText(''); };
    map.on('mousemove', move); map.on('click', click); cvs.addEventListener('mouseleave', leave);
    return () => {
      map.off('mousemove', move); map.off('click', click); cvs.removeEventListener('mouseleave', leave);
      (map.getSource('hover') as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: [] });
      setHoverText('');
    };
  }, [p.pick, ready]);

  return (
    <div className="map-wrap" hidden={!p.visible}>
      <div ref={box} className="map" role="group" aria-label={`Interactive map of ${bundle.network.name}`} />
      <canvas ref={canvas} className="map-overlay" aria-hidden="true" />
      {p.pick && hoverText && <div className="map-hint" aria-hidden="true">{hoverText}</div>}
    </div>
  );
}

