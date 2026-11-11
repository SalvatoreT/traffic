import type { AreaBundle, GeoFC, Demand, NetLink, NetNode, Network } from '../types';
import { makeProjection } from '../lib/projection';

/** Small synthetic study area used until/unless /data/*.json is available. Not real streets. */
const ORIGIN = { lon: -122.2519, lat: 37.8438 };
const N = 6;
const SP = 120;
const H_NAMES = ['North Edge Ave', 'Birch St', 'Cedar St', 'Dogwood St', 'Elm St', 'South Edge Ave'];
const V_NAMES = ['West Edge Ave', 'Fir Way', 'Grove Way', 'Hazel Way', 'Ivy Way', 'East Edge Ave'];

export function buildFixture(): AreaBundle {
  const proj = makeProjection(ORIGIN);
  const nodes: NetNode[] = [];
  const nid = (i: number, j: number) => j * N + i;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const edge = i === 0 || j === 0 || i === N - 1 || j === N - 1;
      const signal = (i === 1 && j === 1) || (i === 4 && j === 4);
      nodes.push({
        id: nid(i, j), osmId: 1000 + nid(i, j),
        x: (i - (N - 1) / 2) * SP, y: (j - (N - 1) / 2) * SP,
        control: signal ? 'signal' : edge ? 'uncontrolled' : 'two_way_stop',
        gate: edge, inStudyArea: !edge,
      });
    }
  }
  const links: NetLink[] = [];
  const addPair = (a: number, b: number, name: string, arterial: boolean) => {
    const A = nodes[a], B = nodes[b];
    const inside = A.inStudyArea || B.inStudyArea;
    const mk = (from: NetNode, to: NetNode, rev: number): NetLink => ({
      id: links.length, osmWayId: 5000 + Math.floor(links.length / 2), from: from.id, to: to.id, reverse: rev,
      name, class: arterial ? 'secondary' : 'residential', lanes: 1,
      speedLimit: arterial ? 15.6 : 11.2, length: SP, geometry: [[from.x, from.y], [to.x, to.y]],
      stopAtEnd: !arterial && to.control === 'two_way_stop', humps: [], inStudyArea: inside && !arterial,
    });
    const id1 = links.length;
    links.push(mk(A, B, id1 + 1));
    links.push(mk(B, A, id1));
  };
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      if (i + 1 < N) addPair(nid(i, j), nid(i + 1, j), H_NAMES[j], j === 0 || j === N - 1);
      if (j + 1 < N) addPair(nid(i, j), nid(i, j + 1), V_NAMES[i], i === 0 || i === N - 1);
    }
  }
  const half = ((N - 1) / 2 - 1) * SP + 40;
  const studyArea: [number, number][] = [[-half, -half], [half, -half], [half, half], [-half, half], [-half, -half]]
    .map(([x, y]) => proj.toLonLat(x, y));
  const m = (N / 2) * SP;
  const bb0 = proj.toLonLat(-m, -m), bb1 = proj.toLonLat(m, m);
  const network: Network = {
    version: 1, id: 'fixture', name: 'Fixture grid', origin: ORIGIN,
    bbox: [bb0[0], bb0[1], bb1[0], bb1[1]], studyArea, nodes, links,
  };

  const gates = nodes.filter((n) => n.gate).map((n) => n.id);
  let seed = 12345;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const flows = (scale: number) => {
    const out: { origin: number; destination: number; vehPerHour: number }[] = [];
    for (let k = 0; k < 60; k++) {
      const o = gates[Math.floor(rnd() * gates.length)];
      const d = gates[Math.floor(rnd() * gates.length)];
      if (o !== d) out.push({ origin: o, destination: d, vehPerHour: Math.round((20 + rnd() * 80) * scale) });
    }
    return out;
  };
  const demand: Demand = {
    version: 1, area: 'fixture',
    periods: [
      { id: 'am', label: 'AM peak (fixture)', flows: flows(1) },
      { id: 'pm', label: 'PM peak (fixture)', flows: flows(1.2) },
    ],
    provenance: [{
      source: 'Synthetic fixture', url: 'https://www.openstreetmap.org/copyright',
      note: 'Generated grid for UI development only; not real streets or counts.',
    }],
  };

  const basemap: GeoFC = {
    type: 'FeatureCollection',
    features: links.filter((l) => l.id % 2 === 0).map((l) => ({
      type: 'Feature',
      properties: { kind: l.class, name: l.name },
      geometry: { type: 'LineString', coordinates: l.geometry.map(([x, y]) => proj.toLonLat(x, y)) },
    })),
  };
  return {
    entry: { id: 'fixture', name: 'Fixture grid (synthetic)', network: '', demand: '', basemap: '', center: [ORIGIN.lon, ORIGIN.lat], zoom: 16 },
    network, demand, basemap, synthetic: true,
  };
}
