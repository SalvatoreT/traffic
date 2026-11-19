import { readFileSync } from 'node:fs';
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
  it('carries an observed clearance interval and reports an approach that leaves it out while the timing has one', () => {
    const ns = [node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled')];
    const ls = [{ ...link(0, 1, 0, 'Main Street'), toBearing: 90 }, { ...link(1, 2, 0, 'Main Street'), toBearing: 270 }] as NetLink[];
    const o = { at: ['Main Street'], approach: 'Main Street', periods: ['pm'], cycleSeconds: 50, ownPhase: true, clearanceSeconds: 4, source: 'doc' };
    expect(applySignalObservations(ns, ls, [{ ...o, heading: 90, greenSeconds: 29 }, { ...o, heading: 270, greenSeconds: 13 }])).toEqual([]);
    expect(ns[0].signalTiming).toEqual([{ periods: ['pm'], cycleS: 50, greens: [{ links: [0], greenS: 29, ownPhase: true }, { links: [1], greenS: 13, ownPhase: true }], source: 'doc', clearanceS: 4 }]);
    const ns2 = [node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled')];
    expect(applySignalObservations(ns2, ls, [{ ...o, heading: 90, greenSeconds: 29 }, { ...o, heading: 270, greenSeconds: 13, clearanceSeconds: undefined }])).toHaveLength(1);
  });
  it('keeps a per-phase clearance when the approaches of one timing have different ones, and marks an approach coded with no left-turn lane', () => {
    const ns = [node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled'), node(3, 'uncontrolled')];
    const ls = [{ ...link(0, 1, 0, 'Main Street'), toBearing: 90 }, { ...link(1, 2, 0, 'Main Street'), toBearing: 270 }, { ...link(2, 3, 0, 'Pine Street'), toBearing: 0 }] as NetLink[];
    const o = { at: ['Main Street', 'Pine Street'], periods: ['pm'], cycleSeconds: 100, source: 'doc' };
    expect(applySignalObservations(ns, ls, [{ ...o, approach: 'Main Street', heading: 90, greenSeconds: 17, ownPhase: true, clearanceSeconds: 4.5, noLeftTurnLane: true }, { ...o, approach: 'Main Street', heading: 270, greenSeconds: 17.5, ownPhase: true, clearanceSeconds: 4.5 }, { ...o, approach: 'Pine Street', greenSeconds: 50.5, clearanceSeconds: 6 }])).toEqual([]);
    expect(ns[0].signalTiming).toEqual([{ periods: ['pm'], cycleS: 100, greens: [{ links: [0], greenS: 17, ownPhase: true }, { links: [1], greenS: 17.5, ownPhase: true }, { links: [2], greenS: 50.5, clearanceS: 6 }], source: 'doc', clearanceS: 4.5 }]);
    expect(ls.map((l) => l.noPocket)).toEqual([true, undefined, undefined]);
  });
  it('takes an observed protected phase without timing, and rejects half a timing', () => {
    const ns = [node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled')];
    const ls = [{ ...link(0, 1, 0, 'Main Street'), toBearing: 90 }, { ...link(1, 2, 0, 'Main Street'), toBearing: 270 }] as NetLink[];
    const o = { at: ['Main Street'], approach: 'Main Street', periods: ['am', 'pm'], heading: 90, source: 'field' };
    expect(applySignalObservations(ns, ls, [{ ...o, ownPhase: true }])).toEqual([]);
    expect(ns[0].signalTiming).toEqual([{ periods: ['am', 'pm'], cycleS: 0, greens: [{ links: [0], greenS: 0, ownPhase: true }], source: 'field' }]);
    const ns2 = [node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled')];
    expect(applySignalObservations(ns2, ls, [o, { ...o, ownPhase: true, cycleSeconds: 90 }])).toHaveLength(2);
  });
  it('takes the lane coding alone without attaching a timing', () => {
    const ns = [node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled')];
    const ls = [{ ...link(0, 1, 0, 'Main Street'), toBearing: 90 }, { ...link(1, 2, 0, 'Main Street'), toBearing: 270 }] as NetLink[];
    const o = { at: ['Main Street'], approach: 'Main Street', periods: ['pm'], heading: 90, source: 'sheet' };
    expect(applySignalObservations(ns, ls, [{ ...o, noLeftTurnLane: true }])).toEqual([]);
    expect(ns[0].signalTiming).toBeUndefined();
    expect(ls.map((l) => l.noPocket)).toEqual([true, undefined]);
    expect(applySignalObservations(ns, ls, [{ ...o, noLeftTurnLane: true, clearanceSeconds: 4 }])).toHaveLength(1);
  });
  it('reports an observation that matches no signal', () => {
    expect(applySignalObservations(nodes, links, [{ ...obs, at: ['Pine Street', 'Elm Street'] }])).toHaveLength(1);
  });
});

describe('round 45 candidates for the Forest Street green', () => {
  const dir = 'openspec/changes/calibration-round-45/candidates';
  const area = JSON.parse(readFileSync('data/areas/rockridge.json', 'utf8'));
  const colby = (period: string) => area.signalObservations.find((o: { approach: string; periods: string[] }) => o.approach === 'Colby Street' && o.periods[0] === period);
  const ns = [node(0, 'signal'), node(1, 'uncontrolled'), node(2, 'uncontrolled'), node(3, 'uncontrolled'), node(4, 'uncontrolled')];
  const ls = [{ ...link(0, 1, 0, 'Forest Street'), toBearing: 123 }, { ...link(1, 2, 0, 'Forest Street'), toBearing: 303 }, { ...link(2, 3, 0, 'Colby Street'), toBearing: 182 }, { ...link(3, 4, 0, 'Claremont Avenue'), toBearing: 212 }] as NetLink[];
  for (const g of [25, 18, 12]) {
    it(`forest-${g} joins the Colby Street timing of the same cycle and periods and fits the cycle`, () => {
      const cand = JSON.parse(readFileSync(`${dir}/forest-${g}.json`, 'utf8'));
      expect(cand.map((o: { periods: string[] }) => o.periods[0])).toEqual(['am_peak', 'pm_peak']);
      for (const o of cand) {
        const c = colby(o.periods[0]);
        expect(o.cycleSeconds).toBe(c.cycleSeconds);
        expect(o.greenSeconds).toBe(g);
        expect(o.source).toContain('ASSUMPTION');
        // three phases (Claremont Avenue, Colby Street, Forest Street) with 5 s of clearance each and at least 5 s of green for Claremont Avenue
        expect(o.greenSeconds + c.greenSeconds + 3 * 5 + 5).toBeLessThanOrEqual(o.cycleSeconds);
        const n = ns.map((x) => ({ ...x })), l = ls.map((x) => ({ ...x }));
        expect(applySignalObservations(n, l, [{ ...c, at: ['Forest Street', 'Colby Street', 'Claremont Avenue'] }, { ...o, at: ['Forest Street', 'Colby Street', 'Claremont Avenue'] }].map((x) => ({ ...x })))).toEqual([]);
        expect(n[0].signalTiming).toHaveLength(1);
        expect(n[0].signalTiming![0].greens.map((x) => [x.links, x.greenS])).toEqual([[[2], c.greenSeconds], [[0], g]]);
      }
    });
  }
});
