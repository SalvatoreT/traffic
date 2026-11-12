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
  it('reports an observation that matches no signal', () => {
    expect(applySignalObservations(nodes, links, [{ ...obs, at: ['Pine Street', 'Elm Street'] }])).toHaveLength(1);
  });
});
