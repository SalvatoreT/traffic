import { describe, expect, it } from 'vitest';
import { assignMsa, buildGraph, linkVolumes } from './lib/assign';
import { fitPeriod, type Station } from './lib/demand-fit';
import { DEFAULT_FIT } from './lib/fit-counts';
import { routeShareTally } from './lib/share-targets';

describe('sampled route shares', () => {
  const nodes = [0, 1, 2, 3, 4].map((id) => ({ id, x: 0, y: 500 - id * 100 }));
  const road = (id: number, from: number, to: number, name: string, cls = 'primary') =>
    ({ id, from, to, name, class: cls, length: 100, inStudyArea: true });
  const links = [road(0, 0, 1, 'Junction'), road(1, 1, 4, 'Freeway', 'motorway'),
    road(2, 0, 2, 'Side Street'), road(3, 2, 3, 'Side Street'), road(4, 3, 4, 'Outlet'), road(5, 3, 1, 'Connector')];
  const targets = {
    selectLink: [{ street: 'Side Street', direction: 'SB', to: [{ via: 'freeway', share: 0.2 }] }],
    freewayRamp: { location: 'Junction', side: 'north', ontoFreewayFromNorth: [{ via: 'Side Street', share: 0.2 }] },
  };
  it('keeps disjoint street and ramp events separate, and counts a multi-block visit once', () => {
    const tally = routeShareTally(nodes, links, targets, [{ origin: 0, destination: 4 }], 'pm', 'pm', 1);
    tally.onRoute(0, [0, 1]);
    tally.onRoute(0, [2, 3, 4]);
    const [select, ramp] = tally.constraints();
    expect(select.ratio.den[0]).toBe(0.5);
    expect(select.ratio.num[0]).toBe(0.5);
    expect(ramp.ratio.den[0]).toBe(0.5);
    expect(ramp.ratio.num[0]).toBe(0);
    tally.onRoute(0, [2, 3, 5, 1]);
    expect(tally.constraints()[1].ratio.num[0]).toBeCloseTo(1 / 3);
    expect(tally.constraints()[1].ratio.den[0]).toBeCloseTo(2 / 3);
  });
});

describe('final capacity-restrained assignment', () => {
  it('scores station counts and exports ramp-choice memberships on the fitted demand', () => {
    const nodes = [0, 1].map((id) => ({ id, x: id * 100, y: 0, control: 'uncontrolled' }));
    const links = [100, 130].map((length, id) => ({ id, from: 0, to: 1, name: 'Road ' + id, class: 'primary', speedLimit: 10, length }));
    const flows = [{ origin: 0, destination: 1, vehPerHour: 100 }];
    const station: Station = { id: 'short', label: 'Short road', kind: 'count', basis: 'test', records: [], links: [0], target: { pm: 150 }, weight: 1, tolPct: 15 };
    const options = { method: 'msa' as const, iterations: 10, drawsPerPass: 2, alpha: 0.15, beta: 4, dispersion: 0, rounds: 2 };
    const result = fitPeriod('pm', flows, ['local'], [station], nodes, links, [], {
      fit: DEFAULT_FIT, assignment: options, draws: 1, dispersion: 0,
      guard: { enabled: false, weight: 0, excessShare: 0, capacity: { uncontrolled: { perLane: 100, source: 'fixture' } } },
    });
    const reloaded = assignMsa(buildGraph(nodes, links, [], 'pm'), flows, result.volume, { ...options, capacity: [100, 100] });
    expect(result.stationRows[0].before).toBeCloseTo(100);
    expect(result.stationRows[0].final).toBeCloseTo(112.5);
    expect(result.stationRows[0].final).toBeCloseTo(linkVolumes(reloaded, result.volume, 2)[0]);
    expect(result.assignment.share).toEqual(reloaded.share);
  });
});
