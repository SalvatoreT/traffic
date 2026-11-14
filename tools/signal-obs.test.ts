import { describe, expect, it } from 'vitest';
import { applySignalObservations } from './lib/signal-obs';
import type { NetLink, NetNode } from './lib/types';

const node = (id: number, control: NetNode['control']): NetNode => ({ id, osmId: id, x: 0, y: 0, control, gate: false, inStudyArea: true });
const link = (id: number, from: number, to: number, name: string): NetLink => ({ id, osmWayId: id, from, to, name, class: 'residential', lanes: 1, speedLimit: 11, length: 50, geometry: [[0, 0], [1, 1]], reverse: null, stopAtEnd: false, humps: [], inStudyArea: true } as unknown as NetLink);

describe('signal observations', () => {
  const nodes = [node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled'), node(3, 'signal')];
  const links = [link(0, 1, 0, 'Pine Street'), link(1, 0, 1, 'Pine Street'), link(2, 2, 0, 'Main Street'), link(3, 0, 2, 'Main Street'), link(4, 1, 3, 'Pine Street')];
  const obs = { at: ['Pine Street', 'Main Street'], approach: 'Pine Street', periods: ['am'], cycleSeconds: 79, greenSeconds: 4, source: 'test' };
  it('attaches the timing to the signal where the streets meet, with the incoming links of the approach', () => {
    expect(applySignalObservations(nodes, links, [obs])).toEqual([]);
    expect(nodes[0].signalTiming).toEqual([{ periods: ['am'], cycleS: 79, greens: [{ links: [0], greenS: 4 }], source: 'test' }]);
    expect(nodes[3].signalTiming).toBeUndefined();
  });
  it('keeps to one side of a street by heading and merges approaches of one signal into one timing', () => {
    const ns = [node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled'), node(3, 'uncontrolled')];
    const ls = [{ ...link(0, 1, 0, 'Main Street'), toBearing: 90 }, { ...link(1, 2, 0, 'Main Street'), toBearing: 270 }, { ...link(2, 3, 0, 'Pine Street'), toBearing: 0 }] as NetLink[];
    const o = { at: ['Pine Street', 'Main Street'], approach: 'Main Street', periods: ['pm'], cycleSeconds: 110, source: 'doc' };
    expect(applySignalObservations(ns, ls, [{ ...o, heading: 80, greenSeconds: 33.5, ownPhase: true }, { ...o, heading: 260, greenSeconds: 27.6, ownPhase: true }])).toEqual([]);
    expect(ns[0].signalTiming).toEqual([{ periods: ['pm'], cycleS: 110, greens: [{ links: [0], greenS: 33.5, ownPhase: true }, { links: [1], greenS: 27.6, ownPhase: true }], source: 'doc' }]);
  });
  it('resolves the approach an approach runs with and reports a missing partner', () => {
    const ns = [node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled'), node(3, 'uncontrolled')];
    const ls = [{ ...link(0, 1, 0, 'Main Street'), toBearing: 90 }, { ...link(1, 2, 0, 'Main Street'), toBearing: 270 }, { ...link(2, 3, 0, 'Pine Street'), toBearing: 0 }] as NetLink[];
    const o = { at: ['Pine Street', 'Main Street'], approach: 'Main Street', periods: ['pm'], cycleSeconds: 110, source: 'doc' };
    expect(applySignalObservations(ns, ls, [{ ...o, heading: 80, greenSeconds: 57.2, ownPhase: true, runsWithHeading: 260 }, { ...o, heading: 260, greenSeconds: 27.6, ownPhase: true }])).toEqual([]);
    expect(ns[0].signalTiming?.[0].greens).toEqual([{ links: [0], greenS: 57.2, ownPhase: true, runsWith: [1] }, { links: [1], greenS: 27.6, ownPhase: true }]);
    expect(applySignalObservations([node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled')], ls.slice(0, 1), [{ ...o, heading: 80, greenSeconds: 57.2, runsWithHeading: 260 }])).toHaveLength(1);
  });
  it('picks the nearest of several matching signals when the observation gives a location', () => {
    const ns = [{ ...node(0, 'signal'), x: 0, y: 0 }, { ...node(1, 'signal'), x: 0, y: 500 }, node(2, 'uncontrolled')];
    const ls = [{ ...link(0, 2, 0, 'Main Street'), toBearing: 180 }, { ...link(1, 2, 1, 'Main Street'), toBearing: 0 }] as NetLink[];
    const o = { at: ['Main Street'], approach: 'Main Street', periods: ['pm'], cycleSeconds: 50, greenSeconds: 29, source: 'doc' };
    expect(applySignalObservations(ns, ls, [o])).toHaveLength(1);
    expect(applySignalObservations(ns, ls, [{ ...o, near: [490, 0] }], (lat, lon) => [lon, lat])).toEqual([]);
    expect(ns[1].signalTiming?.[0].greens[0].links).toEqual([1]);
    expect(ns[0].signalTiming).toBeUndefined();
  });
  it('reports an observation that matches no signal', () => {
    expect(applySignalObservations(nodes, links, [{ ...obs, at: ['Pine Street', 'Elm Street'] }])).toHaveLength(1);
  });
});
