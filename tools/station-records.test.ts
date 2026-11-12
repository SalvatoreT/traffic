import { describe, expect, it } from 'vitest';
import { buildStations, dedupeStations, overusedRecords, type StationInputs } from './lib/demand-fit';

// A Caltrans station on a link of Tunnel Road, 100 m from the gate that takes the same AADT: one count, one station.
const nodes = [
  { id: 0, x: 0, y: 0, control: 'uncontrolled', gate: true },
  { id: 1, x: 100, y: 0, control: 'uncontrolled', gate: false },
  { id: 2, x: 200, y: 0, control: 'uncontrolled', gate: false },
];
const links = [
  { id: 0, from: 0, to: 1, length: 100, speedLimit: 13, class: 'secondary', name: 'Tunnel Road', geometry: [[0, 0], [100, 0]] as [number, number][] },
  { id: 1, from: 1, to: 0, length: 100, speedLimit: 13, class: 'secondary', name: 'Tunnel Road', geometry: [[100, 0], [0, 0]] as [number, number][] },
  { id: 2, from: 1, to: 2, length: 100, speedLimit: 13, class: 'secondary', name: 'Tunnel Road', geometry: [[100, 0], [200, 0]] as [number, number][] },
  { id: 3, from: 2, to: 1, length: 100, speedLimit: 13, class: 'secondary', name: 'Tunnel Road', geometry: [[200, 0], [100, 0]] as [number, number][] },
];
const src = 'SR-13 at Domingo Ave';
const inputs = (stationInside: boolean): StationInputs => ({
  nodes, links, periodIds: ['pm'], lastPeriod: 'pm', periodFactors: { pm: { volume: 0.1, inboundShare: 0.5 } }, kFactor: 0.1, rampKFactor: 0.1, center: [200, 0],
  inBbox: () => stationInside, streetKey: (n) => (n.startsWith('Tunnel') ? 'tunnel' : null),
  gates: [{ id: 0, kind: 'DATA(adt)', street: 'tunnel', source: `Caltrans AADT: ${src}`, record: `ov ${src}`, shareIn: 1, shareOut: 1, inT: { pm: 500 }, outT: { pm: 500 } }],
  tmcs: [], ramps: [], overrides: [{ street: 'tunnel', adt: 10000, x: 50, y: 0, source: src }],
  cfg: { tmcNodeMaxM: 300, stationRadiusM: 150, weights: {}, tolerancePct: {} },
});

describe('a count is used once', () => {
  it('keeps the link station and drops the gate station that carries the same Caltrans record', () => {
    const notes: string[] = [];
    const st = buildStations(inputs(true), notes);
    expect(st.map((s) => s.kind).sort()).toEqual(['caltrans', 'caltrans']);
    expect(notes.some((n) => n.includes('a count is used once'))).toBe(true);
    expect(overusedRecords(st)).toEqual([]);
  });

  it('keeps the gate station when the Caltrans station lies outside the model', () => {
    const st = buildStations(inputs(false), []);
    expect(st.map((s) => s.kind).sort()).toEqual(['gate', 'gate']);
  });

  it('reports two stations that still carry the whole of one record', () => {
    const mk = (id: string) => ({ id, kind: 'gate' as const, label: id, basis: '', links: [], target: {}, weight: 1, tolPct: 10, records: [{ key: 'r|entering', share: 1 }] });
    const two = [mk('a'), mk('b')];
    expect(dedupeStations(two, [])).toHaveLength(2);
    expect(overusedRecords(two)).toHaveLength(1);
  });

  it('lets a record split into shares that add to one', () => {
    const mk = (id: string) => ({ id, kind: 'gate' as const, label: id, basis: '', links: [], target: {}, weight: 1, tolPct: 10, records: [{ key: 'r|entering', share: 0.5 }] });
    expect(overusedRecords([mk('a'), mk('b')])).toEqual([]);
  });
});
