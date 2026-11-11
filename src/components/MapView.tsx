import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { AreaBundle, Intervention, Overlay } from '../types';
import { makeProjection, metresPerPixel } from '../lib/projection';
import { pickLink, pickNode, pointAlong } from '../lib/geom';
import { intensity, rampStops, WIDTH_MAX, WIDTH_MIN, type Mode } from '../lib/ramps';
import { directedLabel, linkStreet, type NetIndex } from '../lib/naming';
import type { SimClient } from '../sim/client';

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

export function describeIntervention(iv: Intervention, net: AreaBundle['network'], idx: NetIndex, mph = true): string {
  const ln = (id: number) => idx.blocks[idx.blockOfLink[id]]?.label ?? `link ${id}`;
  const nn = (id: number) => idx.nodeName[id] ?? `node ${id}`;
  switch (iv.type) {
    case 'modal_filter': return 'link' in iv ? `Modal filter on ${ln(iv.link)}` : `Modal filter at ${nn(iv.node)}`;
    case 'speed_limit': return `Speed limit ${mph ? Math.round(iv.speed * 2.23694) + ' mph' : Math.round(iv.speed * 3.6) + ' km/h'} on ${ln(iv.link)}`;
    case 'speed_hump': return `Speed hump on ${directedLabel(net, idx, iv.link)}`;
    case 'traffic_circle': return `Traffic circle at ${nn(iv.node)}`;
    case 'control': return `${iv.control.replace(/_/g, ' ')} at ${nn(iv.node)}`;
    case 'signal_timing': return `Signal cycle ${iv.cycle} s at ${nn(iv.node)}`;
    case 'one_way': { const l = net.links[iv.link]; return `One-way on ${ln(iv.link)}, keeping ${l ? linkStreet(l) : ''} toward ${idx.nodeName[l?.to ?? 0]}`; }
    case 'turn_ban': {
      const a = net.links[iv.fromLink], b = net.links[iv.toLink];
      return `Turn ban at ${a ? nn(a.to) : '?'}: ${a ? linkStreet(a) : '?'} to ${b ? linkStreet(b) : '?'}`;
    }
  }
}
export function interventionPoint(iv: Intervention, net: AreaBundle['network']): [number, number] {
  const node = (id: number): [number, number] => [net.nodes[id]?.x ?? 0, net.nodes[id]?.y ?? 0];
  const mid = (id: number, pos?: number): [number, number] => {
    const l = net.links[id];
    if (!l) return [0, 0];
    const p = pointAlong(l.geometry, pos ?? l.length / 2);
    return [p.x, p.y];
  };
  switch (iv.type) {
    case 'modal_filter': return 'link' in iv ? mid(iv.link) : node(iv.node);
    case 'speed_hump': return mid(iv.link, iv.position);
    case 'speed_limit': case 'one_way': return mid(iv.link);
    case 'turn_ban': return node(net.links[iv.fromLink]?.to ?? 0);
    default: return node(iv.node);
  }
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
      center: b.entry.center, zoom: b.entry.zoom, minZoom: 12, maxZoom: 19.5,
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
    const cv = map.getCanvas();
    cv.setAttribute('aria-label', `Map of ${b.network.name}. Streets, vehicles and signals. The same information and actions are available in the side panel and the Streets table.`);

    map.on('load', () => {
      const pr = makeProjection(b.network.origin);
      map.addSource('basemap', { type: 'geojson', data: b.basemap });
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
      const major = ['match', ['get', 'kind'], ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'], true, false];
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
      setReady(true);
    });
    map.on('move', schedule);
    map.on('resize', schedule);
    const ro = new ResizeObserver(() => { map.resize(); schedule(); });
    ro.observe(el);
    return () => { ro.disconnect(); markers.current.forEach((m) => m.remove()); map.remove(); mapRef.current = null; setReady(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle]);

  // ---- theme
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const K = KIND_STYLE[mode];
    const major = ['match', ['get', 'kind'], ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'], true, false];
    map.setPaintProperty('bg', 'background-color', K.bg);
    map.setPaintProperty('base-paths', 'line-color', K.path);
    map.setPaintProperty('base-lines', 'line-color', ['case', major, K.major, K.minor]);
    map.setPaintProperty('study-fill', 'fill-color', K.study);
    map.setPaintProperty('study-line', 'line-color', K.study);
    map.setPaintProperty('hover', 'line-color', K.study);
    map.setPaintProperty('links-casing', 'line-color', mode === 'dark' ? '#0b1118' : '#ffffff');
    map.setPaintProperty('links', 'line-color', ramp(mode) as never);
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
      const mpp = metresPerPixel(map.getZoom(), lngLat.lat);
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
      const feats: GeoJSON.Feature[] = [];
      let text = '';
      if (f.link !== null) {
        const l = net.links[f.link];
        const ids = live.current.pickDirectional || l.reverse === null ? [l.id] : [l.id, l.reverse];
        for (const id of ids) feats.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: net.links[id].geometry.map(([a, b]) => live.current.proj.toLonLat(a, b)) } });
        text = live.current.pickDirectional ? `${linkStreet(l)} → ${live.current.index.nodeName[l.to]}` : live.current.index.blocks[live.current.index.blockOfLink[f.link]]?.label ?? '';
      } else if (f.node !== null) {
        const n = net.nodes[f.node];
        feats.push({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: live.current.proj.toLonLat(n.x, n.y) } });
        text = live.current.index.nodeName[f.node];
      }
      src?.setData({ type: 'FeatureCollection', features: feats });
      setHoverText(text);
    };
    const click = (e: maplibregl.MapMouseEvent) => {
      if (!live.current.pick) return;
      const f = find(e.lngLat);
      if (f.link !== null) live.current.onPickLink(f.link);
      else if (f.node !== null) live.current.onPickNode(f.node);
    };
    map.on('mousemove', move); map.on('click', click);
    return () => {
      map.off('mousemove', move); map.off('click', click);
      (map.getSource('hover') as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: [] });
      setHoverText('');
    };
  }, [p.pick, ready]);

  return (
    <div className="map-wrap" hidden={!p.visible}>
      <div ref={box} className="map" role="group" aria-label={`Interactive map of ${bundle.network.name}`} />
      <canvas ref={canvas} className="map-overlay" aria-hidden="true" />
      {p.pick && <div className="map-hint" aria-hidden="true">{hoverText || (p.pick === 'node' ? 'Click an intersection' : 'Click a street')}</div>}
    </div>
  );
}

