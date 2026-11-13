import { describe, expect, it } from 'vitest';
import { intersectionStations, mapLeg, type IxConfig, type IxFile, type IxNet } from './lib/intersection-counts';

// A cross with invented names: Oak Road runs north-south and Fig Lane east-west through node 0; a freeway ramp arrives at node 5, 10 m west of node 0 on Fig Lane.
function cross(): IxNet {
  const nodes = [{ id: 0, x: 0, y: 0 }, { id: 1, x: 0, y: 100 }, { id: 2, x: 100, y: 0 }, { id: 3, x: 0, y: -100 }, { id: 4, x: -100, y: 0 }, { id: 5, x: -10, y: 0 }, { id: 6, x: -60, y: -80 }];
  const links: IxNet['links'] = [];
  const add = (from: number, to: number, name: string, brg: number, cls = 'tertiary') => links.push({ id: links.length, from, to, name, class: cls, fromBearing: brg, toBearing: brg });
  add(1, 0, 'Oak Road', 180); add(0, 1, 'Oak Road', 0);
  add(2, 0, 'Fig Lane', 270); add(0, 2, 'Fig Lane', 90);
  add(3, 0, 'Oak Road', 0); add(0, 3, 'Oak Road', 180);
  add(4, 5, 'Fig Lane', 90); add(5, 4, 'Fig Lane', 270);
  add(5, 0, 'Fig Lane', 90); add(0, 5, 'Fig Lane', 270);
  add(6, 5, '', 32, 'motorway');
  return { nodes, links };
}
const cfg: IxConfig = { file: '', periods: { am: 'am_peak', pm: 'pm_peak', midday: 'midday' }, weight: 1, rampWeight: 2, movementWeight: 0.5, minMovementVeh: 25, tolerancePct: 15, nodeMaxM: 80, bearingTolDeg: 60, middayFromPm: true, middayWeightFactor: 0.5, freewayClass: 'motorway' };
const toXY = (lat: number, lon: number): [number, number] => [lon, lat];
const file = (): IxFile => ({
  sources: { doc: { citation: '[Doc]', document: 'a report', url: 'https://example.org', counts: 'peak hour' } },
  intersections: [
    { id: 'oak-fig', label: 'Oak Rd and Fig Ln', source: 'doc', date: '2020-01-01', lat: 0, lon: 0, legs: { N: { street: 'Oak Road', bearing: 0 }, E: { street: 'Fig Lane', bearing: 90 }, S: { street: 'Oak Road', bearing: 180 }, W: { street: 'Fig Lane', bearing: 270 } },
      volumes: { pm: { SB: { L: 40, T: 300, R: 10 }, EB: { L: 100, T: 200, R: 30, U: 5 }, NB: { T: 250 } }, am: { SB: { T: 280 } } } },
    { id: 'ramp', label: 'ramp at Fig Ln', source: 'doc', date: '2020-01-01', lat: 0, lon: -10, legs: { S: { ramp: true, bearing: 212 }, E: { street: 'Fig Lane', bearing: 90 } }, volumes: { pm: { NB: { R: 500 } } } },
  ],
});

describe('published intersection counts', () => {
  const net = cross(), nodes = new Map(net.nodes.map((n) => [n.id, n]));
  it('places a leg on the links of its street that end and start nearest the point, by bearing', () => {
    const w = mapLeg({ street: 'Fig Lane', bearing: 270 }, [0, 0], net, nodes, cfg);
    expect(w).toEqual({ in: [8], out: [9] });
    const r = mapLeg({ ramp: true, bearing: 212 }, [-10, 0], net, nodes, cfg);
    expect(r).toEqual({ in: [10], out: [] });
    expect(mapLeg({ street: 'Elm Way', bearing: 0 }, [0, 0], net, nodes, cfg)).toEqual({ in: [], out: [] });
  });
  it('turns movements into leg volumes and turn constraints, per counted period', () => {
    const { stations, report } = intersectionStations(file(), net, cfg, toXY, 0.6);
    const by = new Map(stations.map((s) => [s.id, s]));
    // W leg: EB approach 100 + 200 + 30 + 5 enters; SB right 10 and the EB U-turn 5 leave on it.
    expect(by.get('ix oak-fig W entering')).toMatchObject({ links: [8], target: { pm_peak: 335, midday: 201 }, weight: 1, weightByPeriod: { midday: 0.5 } });
    expect(by.get('ix oak-fig W leaving')!.target.pm_peak).toBe(15);
    // N leg: SB approach enters in both periods; EB left 100 and NB through 250 leave on it in the PM only.
    expect(by.get('ix oak-fig N entering')!.target).toEqual({ pm_peak: 350, am_peak: 280, midday: 210 });
    expect(by.get('ix oak-fig N leaving')!.target).toEqual({ pm_peak: 350, midday: 210 });
    // Left and right turns of at least 25 veh/h are movement constraints; through movements and small turns are not.
    expect(by.get('ix oak-fig move 8>1')).toMatchObject({ feature: { kind: 'move', a: 8, b: 1 }, target: { pm_peak: 100, midday: 60 }, weight: 0.5 });
    expect(by.get('ix oak-fig move 0>3')!.target.pm_peak).toBe(40);
    expect(by.has('ix oak-fig move 0>9')).toBe(false);
    expect(stations.filter((s) => s.feature && s.id.startsWith('ix oak-fig')).length).toBe(3);
    expect(report.intersections).toBe(2);
  });
  it('marks a counted ramp leg so it can replace the ramp ADT station', () => {
    const { stations, report } = intersectionStations(file(), net, cfg, toXY, null);
    const r = stations.find((s) => s.id === 'ix ramp S entering')!;
    expect(r).toMatchObject({ links: [10], rampLinks: [10], weight: 2, target: { pm_peak: 500 } });
    expect(r.target.midday).toBeUndefined();
    expect(stations.find((s) => s.id === 'ix ramp move 10>8')).toMatchObject({ feature: { kind: 'move', a: 10, b: 8 } });
    expect(report.ramps).toBe(1);
  });
  it('reports a leg with no link', () => {
    const f = file();
    f.intersections[0].legs.N = { street: 'Elm Way', bearing: 0 };
    const { report, stations } = intersectionStations(f, net, cfg, toXY, null);
    expect(report.notes.some((n) => /no entering link for the N leg \(Elm Way\)/.test(n))).toBe(true);
    expect(stations.some((s) => s.id === 'ix oak-fig N entering')).toBe(false);
  });
});
