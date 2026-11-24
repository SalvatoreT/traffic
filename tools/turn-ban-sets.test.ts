import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { NetLink, NetNode, Network } from '../src/types';
import { encodeScenario } from '../src/lib/hash';
import { makeProjection } from '../src/lib/projection';
import { DEFAULT_DATA_DIR, loadAreaFiles, repoRoot } from './lib/agent-area';
import { analyze, boundingStreetNames, buildPackages, keepAccess, packageLink, parseSinglesLog, rankFromLinks, slug, strandedNodes, topKUnder, turnBan } from './lib/turn-ban-sets';

const ORIGIN = { lon: -122.25, lat: 37.84 };

/**
 * A small area. Main St (secondary) runs west to east through A, B, C and on outside to K; Ring Rd (tertiary) runs along the top through
 * F, E, G. North St joins B to E through D, so it touches both. West St leaves A northward and Dead St leaves C northward. Outer Ln and
 * South Ln are outside residential streets that meet West St at A.
 */
function mini(): Network {
  const pts: [number, number][] = [[-200, 0], [0, 0], [200, 0], [0, 100], [0, 200], [-200, 200], [200, 200], [200, 100], [-200, 100], [-400, 0], [400, 0], [-200, -100]];
  const nodes: NetNode[] = pts.map(([x, y], id) => ({ id, osmId: 100 + id, x, y, control: 'uncontrolled', gate: id >= 9 || id === 5 || id === 6, inStudyArea: id < 9 }));
  const links: NetLink[] = [];
  const road = (a: number, b: number, name: string, cls: NetLink['class'], inStudyArea: boolean, oneWay = false) => {
    const mk = (f: number, t: number, rev: number | null): NetLink => ({
      id: links.length, osmWayId: 1000 + links.length, from: f, to: t, reverse: rev, name, class: cls, lanes: 1, speedLimit: 11, length: Math.hypot(pts[t][0] - pts[f][0], pts[t][1] - pts[f][1]),
      geometry: [pts[f], pts[t]], stopAtEnd: false, humps: [], inStudyArea,
    });
    const id = links.length;
    links.push(mk(a, b, oneWay ? null : id + 1));
    if (!oneWay) links.push(mk(b, a, id));
  };
  road(0, 1, 'Main St', 'secondary', true);
  road(1, 2, 'Main St', 'secondary', true);
  road(2, 10, 'Main St', 'secondary', false);
  road(5, 4, 'Ring Rd', 'tertiary', true);
  road(4, 6, 'Ring Rd', 'tertiary', true);
  road(1, 3, 'North St', 'residential', true);
  road(3, 4, 'North St', 'residential', true);
  road(2, 7, 'Dead St', 'residential', true);
  road(0, 8, 'West St', 'residential', true);
  road(9, 0, 'Outer Ln', 'residential', false, true);
  road(11, 0, 'South Ln', 'residential', false, true);
  const p = makeProjection(ORIGIN);
  const ring = [[-250, -50], [250, -50], [250, 250], [-250, 250], [-250, -50]].map(([x, y]) => p.toLonLat(x, y));
  const find = (f: number, t: number) => links.find((l) => l.from === f && l.to === t)!.id;
  return {
    version: 1, id: 'mini', name: 'Mini', origin: ORIGIN, bbox: [0, 0, 0, 0], studyArea: ring, nodes, links,
    turnBans: [{ from: find(0, 1), to: find(1, 3) }, { from: find(2, 1), to: find(1, 3), periods: ['am'] }],
  };
}

const key = (m: { fromLink: number; toLink: number }) => `${m.fromLink}-${m.toLink}`;

describe('entry movements on a small network', () => {
  const net = mini();
  const a = analyze(net, 'pm');
  const find = (f: number, t: number) => net.links.find((l) => l.from === f && l.to === t)!.id;

  it('finds the nine movements and nothing from an interior street', () => {
    expect(a.movements).toHaveLength(9);
    expect(a.movements.every((m) => net.links[m.toLink].class === 'residential' && net.links[m.toLink].inStudyArea)).toBe(true);
    expect(a.movements.every((m) => !(net.links[m.fromLink].class === 'residential' && net.links[m.fromLink].inStudyArea))).toBe(true);
    expect(a.movements.every((m) => m.encodes)).toBe(true);
    expect(a.skipped).toHaveLength(0);
  });

  it('derives the bounding streets from the network, not from a name list', () => {
    expect(boundingStreetNames(net)).toEqual(['Main St', 'Ring Rd']);
    expect(a.boundingStreets).toEqual(['Main St', 'Ring Rd']);
  });

  it('classifies the source, the turn and the side', () => {
    const outer = a.movements.find((m) => m.fromStreet === 'Outer Ln')!;
    expect(outer).toMatchObject({ fromKind: 'outside', boundingStreet: null, turn: 'left', toStreet: 'West St', side: 'west' });
    const south = a.movements.find((m) => m.fromStreet === 'South Ln')!;
    expect(south).toMatchObject({ fromKind: 'outside', turn: 'straight', toStreet: 'West St' });
    const k = a.movements.find((m) => m.fromLink === find(10, 2))!;
    expect(k).toMatchObject({ fromKind: 'bounding', boundingStreet: 'Main St', turn: 'right', toStreet: 'Dead St', side: 'east' });
    const f = a.movements.find((m) => m.fromLink === find(5, 4))!;
    expect(f).toMatchObject({ boundingStreet: 'Ring Rd', turn: 'right', side: 'north' });
    expect(a.movements.find((m) => m.fromLink === find(0, 1))).toMatchObject({ side: 'south' });
  });

  it('marks movements the base network already bans', () => {
    expect(a.movements.find((m) => m.fromLink === find(0, 1))!.baseBan).toBe('all-periods');
    expect(a.movements.find((m) => m.fromLink === find(2, 1))!.baseBan).toBe('some-periods');
    expect(a.movements.filter((m) => m.baseBan === 'none')).toHaveLength(7);
  });

  it('marks only the street that touches two bounding streets as a through street', () => {
    const runs = Object.fromEntries(a.runs.map((r) => [r.street, r]));
    expect(runs['North St']).toMatchObject({ through: true, touches: ['Main St', 'Ring Rd'], links: 4 });
    expect(runs['West St'].through).toBe(false);
    expect(runs['Dead St'].through).toBe(false);
  });

  const pk = buildPackages(a);
  const byId = Object.fromEntries(pk.map((p) => [p.id, p]));

  it('builds the named packages without the movement banned in every period', () => {
    expect(byId['all-entries'].movements).toHaveLength(8);
    expect(byId['all-turns'].movements).toHaveLength(7);
    expect(byId['left-turns'].movements).toHaveLength(3);
    expect(byId['right-turns'].movements).toHaveLength(4);
    expect(byId['street-main-st'].movements).toHaveLength(4);
    expect(byId['street-ring-rd'].movements).toHaveLength(2);
    expect(byId['through-streets'].movements.map((m) => m.toStreet)).toEqual(['North St', 'North St', 'North St']);
    expect(byId['through-streets-all'].movements).toHaveLength(3);
    expect(pk.some((p) => p.id.startsWith('top-'))).toBe(false);
  });

  it('keeps straight-across movements open in every turn package', () => {
    for (const id of ['all-turns', 'left-turns', 'right-turns', 'street-main-st', 'through-streets']) expect(byId[id].movements.some((m) => m.turn === 'straight')).toBe(false);
    expect(byId['all-entries'].movements.some((m) => m.turn === 'straight')).toBe(true);
  });

  it('writes links the repo encoder and decoder agree on', () => {
    for (const p of pk) {
      const l = packageLink(net, p, 'pm');
      expect(l.roundTrip, `${p.id}: ${l.problem}`).toBe(true);
      expect(l.link.startsWith('#v1;a=mini;p=pm;s=tb,')).toBe(true);
      expect(l.items).toBe(p.movements.length);
    }
    expect(packageLink(net, byId['all-entries'], 'pm').link).toBe(encodeScenario(net, byId['all-entries'].movements.map(turnBan), { area: 'mini', period: 'pm' }));
  });

  it('leaves out a movement whose link item does not decode back', () => {
    const b = analyze(net, 'pm');
    b.movements[0].encodes = false;
    expect(buildPackages(b).find((p) => p.id === 'all-entries')!.movements.map(key)).not.toContain(key(b.movements[0]));
  });

  it('makes top-k packages only from a ranking, in rank order, and only when there are k', () => {
    const usable = a.movements.filter((m) => m.baseBan !== 'all-periods').slice(0, 4);
    const log = usable.map((m, i) => `  #${200 + (3 - i)} turn_ban | Turn ban at X | ${encodeScenario(net, [turnBan(m)], { area: 'mini', period: 'pm' })} | through 5.0 -> 3.0 (-40.0%) | largest all-car rise +10 on Y | score +1.0`).join('\nnoise\n');
    const rows = parseSinglesLog(log);
    expect(rows.map((r) => r.candidate)).toEqual([200, 201, 202, 203]);
    const { ranked, unmatched } = rankFromLinks(net, rows);
    expect(unmatched).toHaveLength(0);
    expect(ranked.map(key)).toEqual([...usable].reverse().map(key));
    const withTop = buildPackages(a, ranked, [3, 5]);
    expect(withTop.find((p) => p.id === 'top-3')!.movements.map(key)).toEqual(ranked.slice(0, 3).map(key));
    expect(withTop.find((p) => p.id === 'top-5')).toBeUndefined();
  });

  it('under a cap keeps only packages of at most that many bans, with top-2 to top-k and the top three per bounding street', () => {
    const rank = a.movements.filter((m) => m.baseBan !== 'all-periods').map((m, i) => ({ fromLink: m.fromLink, toLink: m.toLink, rank: i + 1 }));
    expect(rank.length).toBeGreaterThanOrEqual(5);
    const capped = buildPackages(a, rank, topKUnder(4), undefined, 4);
    expect(capped.length).toBeGreaterThan(0);
    expect(capped.every((p) => p.movements.length <= 4)).toBe(true);
    expect(topKUnder(4)).toEqual([2, 3, 4]);
    expect(topKUnder(1)).toEqual([]);
    expect(capped.map((p) => p.id).filter((id) => id.startsWith('top-'))).toEqual(['top-2', 'top-3', 'top-4']);
    expect(capped.find((p) => p.id === 'top-4')!.movements.map(key)).toEqual(rank.slice(0, 4).map(key));
    expect(capped.some((p) => p.id === 'all-turns' || p.id === 'all-entries')).toBe(false);
    // a package the cap allows is the same as without the cap, and the ranking is only ever the caller's
    expect(capped.find((p) => p.id === 'street-ring-rd')!.movements.map(key)).toEqual(byId['street-ring-rd'].movements.map(key));
    expect(buildPackages(a, [], topKUnder(4), undefined, 4).some((p) => p.id.startsWith('top-'))).toBe(false);
    // no cap given: nothing changes
    expect(buildPackages(a, rank).map((p) => p.id)).toEqual(buildPackages(a, rank, [3, 5, 10], undefined, undefined).map((p) => p.id));
    // per street: three of its highest-ranked movements, unless that is a package already there
    const withStreet = buildPackages(a, rank, [], undefined, 5).find((p) => p.id === 'street-main-st-top-3');
    const main = rank.filter((r) => a.movements.find((m) => key(m) === key(r))!.boundingStreet === 'Main St');
    if (main.length >= 3) expect(withStreet!.movements.map(key)).toEqual(main.slice(0, 3).map(key));
    else expect(withStreet).toBeUndefined();
  });

  it('predicts the nodes a package strands and takes out the turns that would', () => {
    const keys = (ms: { fromLink: number; toLink: number }[]) => new Set(ms.map(key));
    expect([...strandedNodes(net, new Set(), 'pm')]).toEqual([]);
    expect([...strandedNodes(net, keys(byId['all-turns'].movements), 'pm')].sort()).toEqual([3, 7]);
    expect([...strandedNodes(net, keys(byId['left-turns'].movements), 'pm')]).toEqual([]);
    const k = keepAccess(net, a, byId['all-turns'].movements, 'pm');
    expect(k.unresolved).toEqual([]);
    expect(k.exempt.map((m) => m.toStreet).sort()).toEqual(['Dead St', 'Dead St', 'North St', 'North St', 'North St']);
    expect(k.kept.map((m) => m.toStreet)).toEqual(['West St', 'West St']);
    const withAccess = buildPackages(a, [], [], { net, period: 'pm' }).find((p) => p.id === 'all-turns-access')!;
    expect(withAccess.movements.map(key)).toEqual(k.kept.map(key));
    expect(withAccess.exempt).toHaveLength(5);
    expect([...strandedNodes(net, keys(withAccess.movements), 'pm')]).toEqual([]);
  });

  it('slugs street names', () => {
    expect(slug('Telegraph Avenue')).toBe('telegraph-avenue');
    expect(slug('CA 24 / ramp')).toBe('ca-24-ramp');
    expect(slug('')).toBe('unnamed');
  });
});

const real = join(DEFAULT_DATA_DIR, 'rockridge.network.json');
describe.skipIf(!existsSync(real) || !existsSync(join(DEFAULT_DATA_DIR, 'areas.json')))('entry movements on the study area network', () => {
  it('is consistent with the proposal search definitions and the area config', async () => {
    const net = (await loadAreaFiles(DEFAULT_DATA_DIR, 'rockridge')).network;
    const a = analyze(net, 'pm_peak');
    expect(a.movements.length).toBeGreaterThan(20);
    for (const m of a.movements) {
      const from = net.links[m.fromLink], to = net.links[m.toLink];
      expect(to.inStudyArea && (to.class === 'residential' || to.class === 'service')).toBe(true);
      expect(from.inStudyArea && (from.class === 'residential' || from.class === 'service')).toBe(false);
      expect(from.to).toBe(to.from);
      expect(m.encodes, `movement ${m.index} does not round-trip`).toBe(true);
    }
    const cfg = JSON.parse(readFileSync(join(repoRoot, 'data/areas/rockridge.json'), 'utf8')) as { boundary: (string | { ref: string })[] };
    for (const name of cfg.boundary.filter((b): b is string => typeof b === 'string')) expect(a.boundingStreets).toContain(name);
    const pk = buildPackages(a);
    const by = Object.fromEntries(pk.map((p) => [p.id, new Set(p.movements.map(key))]));
    expect(by['all-entries'].size).toBeGreaterThan(by['all-turns'].size);
    for (const k of by['all-turns']) expect(by['all-entries'].has(k)).toBe(true);
    for (const k of by['through-streets']) expect(by['all-turns'].has(k)).toBe(true);
    expect(new Set([...by['left-turns'], ...by['right-turns']])).toEqual(by['all-turns']);
    expect(pk.filter((p) => p.id.startsWith('street-')).reduce((s, p) => s + p.movements.length, 0)).toBeLessThanOrEqual(by['all-turns'].size);
    for (const p of pk) expect(packageLink(net, p, 'pm_peak').roundTrip, p.id).toBe(true);
    const base = strandedNodes(net, new Set(), 'pm_peak');
    const strands = (id: string) => [...strandedNodes(net, new Set(pk.find((p) => p.id === id)!.movements.map(key)), 'pm_peak')].filter((n) => !base.has(n)).length;
    expect(base.size).toBe(0);
    expect(['all-entries', 'all-turns', 'street-telegraph-avenue', 'left-turns', 'through-streets'].map(strands)).toEqual([37, 1, 1, 0, 0]);
    const withAccess = buildPackages(a, [], [], { net, period: 'pm_peak' });
    expect(withAccess.find((p) => p.id === 'all-turns-access')!.movements.length).toBe(by['all-turns'].size - 2);
  });
});
