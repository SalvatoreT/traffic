import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildActiveFlows, parseActiveCounts, type ActiveCfg, type ActiveInput, type ALink, type ANode } from './lib/demand-active';

const root = resolve(import.meta.dirname, '..');

const cfg: ActiveCfg = {
  pedestrian: { modeShare: 0.1, meanTripM: 300, maxTripM: 1000, gateShare: 0.2, gateMaxM: 800, commercialShare: 0.3, transitAccessShare: 0.1, maxWalkToStopM: 400, stopDecayM: 200, periodVolume: { am: 1, pm: 1 } },
  bicycle: { modeShare: 0.05, meanTripM: 1000, maxTripM: 3000, gateShare: 0.4, gateMaxM: 3000, throughFactor: 0.5, throughMinM: 300, routeBonus: 3, laneRouteCostFactor: 0.8, periodVolume: { am: 1, pm: 1 } },
  countScaling: { enabled: true, clampMin: 0.1, clampMax: 10 },
  commercialClasses: ['primary', 'secondary'],
  commercialJobsRadiusM: 150,
  minFlowPerHour: 0.01,
  maxFlows: { pedestrian: 50, bicycle: 50 },
};

// A 5x4 grid, 100 m spacing. Row y=0 is a secondary street with a bike lane in both directions; gates at the four
// west and east ends; node 99 is a freeway gate.
const W = 5;
const H = 4;
const nodes: ANode[] = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) nodes.push({ id: y * W + x, x: x * 100, y: y * 100, gate: x === 0 || x === W - 1, canEnter: true, canExit: true, inStudyArea: x > 0 && x < W - 1 });
nodes.push({ id: 99, x: -100, y: 0, gate: true, canEnter: true, canExit: true, inStudyArea: false });
const links: ALink[] = [];
let lid = 0;
const add = (a: number, b: number, cls: string, bike: boolean) => {
  for (const [f, t] of [[a, b], [b, a]]) links.push({ id: lid++, from: f, to: t, class: cls, length: 100, inStudyArea: true, ...(bike ? { bikeLane: true } : {}) });
};
for (let y = 0; y < H; y++) for (let x = 0; x < W - 1; x++) add(y * W + x, y * W + x + 1, y === 0 ? 'secondary' : 'residential', y === 0);
for (let y = 0; y < H - 1; y++) for (let x = 0; x < W; x++) add(y * W + x, (y + 1) * W + x, 'residential', false);
add(99, 0, 'motorway', false);

const input = (over: Partial<ActiveInput> = {}): ActiveInput => ({
  nodes, links,
  locals: [{ node: 6, res: 200, jobs: 20 }, { node: 8, res: 100, jobs: 300 }, { node: 11, res: 150, jobs: 30 }, { node: 13, res: 80, jobs: 10 }],
  freewayGates: new Set([99]),
  stops: [{ node: 7, freq: { am: 6, pm: 6 } }],
  periodIds: ['am', 'pm'], scalePeriod: 'pm',
  originShare: { am: 0.7, pm: 0.3 }, destShare: { am: 0.7, pm: 0.3 },
  tripsPerResident: 3.2, tripsPerJob: 3.5, cfg,
  count: { node: 7, pedestrian: 40, bicycle: 12 },
  ...over,
});

describe('walking and biking flows', () => {
  const r = buildActiveFlows(input());
  const all = Object.values(r.flows).flat();
  it('emits only pedestrian and bicycle flows between existing nodes, never at the freeway gate', () => {
    expect(all.length).toBeGreaterThan(0);
    for (const f of all) {
      expect(['pedestrian', 'bicycle']).toContain(f.mode);
      expect(f.origin).not.toBe(f.destination);
      expect(f.vehPerHour).toBeGreaterThan(0);
      expect(nodes.some((n) => n.id === f.origin)).toBe(true);
      expect(f.origin).not.toBe(99);
      expect(f.destination).not.toBe(99);
    }
  });
  it('scales each mode to the observed count at the counted node', () => {
    for (const rep of r.reports) {
      expect(rep.observed).not.toBeNull();
      expect(rep.prior! * rep.factor).toBeCloseTo(rep.observed!, 5);
    }
  });
  it('sends walking trips to bus stops, commercial streets and gates', () => {
    const ped = r.flows.pm.filter((f) => f.mode === 'pedestrian');
    expect(ped.some((f) => f.destination === 7 || f.origin === 7)).toBe(true);
    expect(r.reports[0].perPeriod.pm.toStops).toBeGreaterThan(0);
    expect(r.reports[0].perPeriod.pm.toCommercial).toBeGreaterThan(0);
    expect(r.reports[0].perPeriod.pm.toGates).toBeGreaterThan(0);
    expect(ped.every((f) => Math.hypot(nodes[f.origin].x - nodes[f.destination].x, nodes[f.origin].y - nodes[f.destination].y) <= 1000 + 1e-6)).toBe(true);
  });
  it('has gate-to-gate bicycle trips and respects the flow cap', () => {
    const gate = (id: number) => nodes.find((n) => n.id === id)!.gate;
    expect(r.flows.pm.some((f) => f.mode === 'bicycle' && gate(f.origin) && gate(f.destination))).toBe(true);
    for (const p of ['am', 'pm']) {
      expect(r.flows[p].filter((f) => f.mode === 'pedestrian').length).toBeLessThanOrEqual(50);
      expect(r.flows[p].filter((f) => f.mode === 'bicycle').length).toBeLessThanOrEqual(50);
    }
  });
  it('skips bus-stop trips without stops and leaves volumes unscaled without counts', () => {
    const q = buildActiveFlows(input({ stops: [], count: null }));
    expect(q.reports.every((x) => x.factor === 1)).toBe(true);
    expect(q.reports[0].perPeriod.pm.toStops).toBe(0);
  });
  it('is deterministic', () => {
    expect(JSON.stringify(buildActiveFlows(input()).flows)).toBe(JSON.stringify(r.flows));
  });
});

const raw = resolve(root, 'data/demand/raw/oakland-multimodal');
describe('Oakland count parsing', () => {
  it.skipIf(!existsSync(raw))('reads pedestrian crosswalk and bicycle movement totals from the real reports', () => {
    const f = (n: string) => parseActiveCounts(readFileSync(resolve(raw, n), 'utf8'));
    expect(f('2018_2018.09.11-TelegraphAve_AlcatrazAve-pm.csv')).toEqual({ pedestrian: 152, bicycle: 95 });
    expect(f('2019_TelegraphAve_AlcatrazAve_2019-09-10_PM.csv')).toEqual({ pedestrian: 178, bicycle: 99 });
    expect(f('2021_TelegraphAve_AlcatrazAve_PM_2021.csv')).toEqual({ pedestrian: 109, bicycle: 62 });
  });
});

const demandPath = resolve(root, 'public/data/rockridge.demand.json');
const netPath = resolve(root, 'public/data/rockridge.network.json');
describe('generated demand file', () => {
  it.skipIf(!existsSync(demandPath) || !existsSync(netPath))('follows the Flow contract and stays under 6,000 flows per period', () => {
    const d = JSON.parse(readFileSync(demandPath, 'utf8')) as { periods: { id: string; flows: { origin: number; destination: number; vehPerHour: number; mode?: string }[] }[]; provenance: { source: string; note: string }[] };
    const net = JSON.parse(readFileSync(netPath, 'utf8')) as { nodes: { id: number }[] };
    const ids = new Set(net.nodes.map((n) => n.id));
    for (const p of d.periods) {
      expect(p.flows.length).toBeLessThan(6000);
      for (const f of p.flows) {
        expect([undefined, 'car', 'bicycle', 'pedestrian']).toContain(f.mode);
        expect(ids.has(f.origin) && ids.has(f.destination)).toBe(true);
        expect(f.vehPerHour).toBeGreaterThan(0);
      }
      expect(p.flows.some((f) => f.mode === 'pedestrian')).toBe(true);
      expect(p.flows.some((f) => f.mode === 'bicycle')).toBe(true);
    }
    expect(d.provenance.some((x) => /ASSUMPTION/.test(x.note) && /Walking and biking/.test(x.source))).toBe(true);
  });
});
