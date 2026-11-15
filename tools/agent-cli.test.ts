import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildFixture } from '../src/fixtures/area';
import { buildIndex } from '../src/lib/naming';
import { decodeScenario, encodeScenario } from '../src/lib/hash';
import { CliError, loadAreaFiles } from './lib/agent-area';
import { findPlaces, linkFor, queryParts, words } from './lib/describe-network';
import { INTERVENTION_TYPES, codesMatchGrammar } from './lib/intervention-types';
import { blockRows, linkFragment, parseArgs, parseInterventionsJson, resolvePeriod, scenarioFromLink } from './lib/simulate-report';
import { loadEngine, runFor } from './lib/run-result';

const bundle = buildFixture();
const net = bundle.network;
const idx = buildIndex(net);

function dataDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'traffic-agent-'));
  writeFileSync(join(dir, 'areas.json'), JSON.stringify([{ id: 'fixture', name: 'Fixture grid', network: '/data/fixture.network.json', demand: '/data/fixture.demand.json', basemap: '/data/x.json', center: [0, 0], zoom: 15 }]));
  writeFileSync(join(dir, 'fixture.network.json'), JSON.stringify(net));
  writeFileSync(join(dir, 'fixture.demand.json'), JSON.stringify(bundle.demand));
  return dir;
}

describe('argument parsing', () => {
  it('reads values with a space or =, and the output flags', () => {
    const a = parseArgs(['--link', '#v1;a=x', '--seed=3', '--minutes', '30', '--blocks', 'all', '--json']);
    expect(a).toMatchObject({ link: '#v1;a=x', seed: 3, minutes: 30, blocks: 'all', pretty: false, area: 'rockridge' });
  });
  it('rejects unknown options, bad numbers and both inputs at once, with exit code 2', () => {
    for (const argv of [['--nope'], ['--seed', 'x'], ['--minutes', '0'], ['--blocks', 'some'], ['--link'], ['--link', 'a', '--interventions', 'b']]) {
      try { parseArgs(argv); expect.fail(argv.join(' ')); } catch (e) { expect(e).toBeInstanceOf(CliError); expect((e as CliError).code).toBe(2); }
    }
  });
});

describe('scenario links', () => {
  const ivs = [{ type: 'modal_filter' as const, link: 40 }, { type: 'traffic_circle' as const, node: 14 }];
  const hash = encodeScenario(net, ivs, { area: 'fixture', period: 'pm' });
  it('accepts a full URL, a fragment or a bare form, escaped or not', () => {
    const frag = hash.slice(1);
    expect(linkFragment(`https://example.test/${hash}`)).toBe(frag);
    expect(linkFragment(hash)).toBe(frag);
    expect(linkFragment(frag)).toBe(frag);
    expect(linkFragment(`https://example.test/#${encodeURIComponent(frag)}`)).toBe(frag);
  });
  it('decodes to the same interventions and the link\'s period', () => {
    const s = scenarioFromLink(net, `https://example.test/${hash}`, 'fixture');
    expect(s.interventions).toEqual(decodeScenario(net, hash).interventions);
    expect(s.interventions).toHaveLength(2);
    expect(s.period).toBe('pm');
  });
  it('explains a link it cannot decode', () => {
    expect(() => scenarioFromLink(net, '#v2;s=mf,9q9p3cz9dy', 'fixture')).toThrow(/does not start with "#v1;"/);
    expect(() => scenarioFromLink(net, '#v1;a=other;s=mf,9q9p3cz9dy', 'fixture')).toThrow(/area "other"/);
    expect(() => scenarioFromLink(net, '#v1;a=fixture;s=zz,9q9p3cz9dy', 'fixture')).toThrow(/not an intervention code/);
    expect(() => scenarioFromLink(net, '#v1;a=fixture;s=mf,short', 'fixture')).toThrow(/10-character geohash/);
    expect(() => scenarioFromLink(net, '#v1;a=fixture;s=sl,9q9p3cz9dy,500', 'fixture')).toThrow(/out of range/);

  });
  it('reports an item that matches no street instead of failing', () => {
    const s = scenarioFromLink(net, '#v1;a=fixture;s=mf,9q9p3cz9dy', 'fixture');
    expect(s.interventions).toHaveLength(0);
    expect(s.unplaced).toHaveLength(1);
  });
});

describe('interventions file', () => {
  it('accepts a list and an object, and checks ids against the network', () => {
    const list = JSON.stringify([{ type: 'modal_filter', link: 3 }, { type: 'control', node: 14, control: 'all_way_stop' }, { type: 'modal_filter', node: 14, legs: [1, 2] }]);
    expect(parseInterventionsJson(net, list)).toHaveLength(3);
    expect(parseInterventionsJson(net, JSON.stringify({ interventions: [{ type: 'one_way', link: 2 }] }))).toHaveLength(1);
    expect(() => parseInterventionsJson(net, '[{"type":"modal_filter","link":99999}]')).toThrow(/link id from 0/);
    expect(() => parseInterventionsJson(net, '[{"type":"dance"}]')).toThrow(/not an intervention type/);
    expect(() => parseInterventionsJson(net, '{"a":1}')).toThrow(/must be a JSON list/);
    expect(() => parseInterventionsJson(net, 'nope')).toThrow(/not valid JSON/);
    expect(() => parseInterventionsJson(net, '[{"type":"control","node":1,"control":"roundabout"}]')).toThrow(/"control" is one of/);
  });
});

describe('periods', () => {
  it('prefers the first given, falls back to the area default, and names the choices when unknown', () => {
    expect(resolvePeriod(bundle.entry, bundle.demand, undefined, 'pm').id).toBe('pm');
    expect(resolvePeriod(bundle.entry, bundle.demand).id).toBe('am');
    expect(() => resolvePeriod(bundle.entry, bundle.demand, 'night')).toThrow(/am, pm/);
  });
});

describe('finding places', () => {
  it('spells out abbreviations and splits a query into street fragments', () => {
    expect(words('Colby St.')).toEqual(['colby', 'street']);
    expect(queryParts('Ayala Ave & Martin St')).toEqual([['ayala', 'avenue'], ['martin', 'street']]);
    expect(queryParts('Colby St at 60th St')).toEqual([['colby', 'street'], ['60th', 'street']]);
  });
  it('finds an intersection by its two streets and gives items that decode back to it', () => {
    const [p] = findPlaces(net, idx, 'Birch St & Grove Way');
    expect(p.kind).toBe('node');
    const mn = p.options.find((o) => o.item.startsWith('mn,') && o.item.split(',').length === 2)!;
    const decoded = decodeScenario(net, linkFor('fixture', 'am', [mn.item])).interventions;
    expect(decoded).toEqual([p.options.find((o) => o.item === mn.item)!.intervention]);
  });
  it('finds blocks by street and returns options valid for the block', () => {
    const places = findPlaces(net, idx, 'Cedar St');
    expect(places.length).toBeGreaterThan(0);
    const b = places.find((x) => x.kind === 'block')!;
    expect(b.options.map((o) => o.type)).toEqual(expect.arrayContaining(['modal_filter', 'speed_hump', 'speed_limit', 'one_way']));
    for (const o of b.options) expect(decodeScenario(net, linkFor('fixture', undefined, [o.item])).unplaced).toHaveLength(0);
  });
  it('finds nothing for an unknown street', () => {
    expect(findPlaces(net, idx, 'Nowhere Blvd')).toEqual([]);
  });
});

describe('the intervention catalogue', () => {
  it('lists every code the link grammar accepts', () => {
    expect(codesMatchGrammar()).toBe(true);
    expect(INTERVENTION_TYPES.length).toBeGreaterThanOrEqual(9);
  });
});

describe('per-block rows', () => {
  it('sum both directions, keep side streets, and drop blocks without cars', () => {
    const n = net.links.length;
    const base = new Float32Array(n * 4), scen = new Float32Array(n * 4);
    const link = net.links.find((l) => l.inStudyArea && l.class === 'residential')!;
    base[link.id * 4] = 100; base[link.id * 4 + 2] = 40; scen[link.id * 4] = 130; scen[link.id * 4 + 2] = 70;
    const rows = blockRows(net, idx, base, scen, 'side');
    expect(rows).toHaveLength(1);
    expect(rows[0].throughCars).toMatchObject({ baseline: 40, scenario: 70, change: 30, beyondNoise: true });
    expect(rows[0].allCars.change).toBe(30);
  });
});

describe('data files', () => {
  it('load from a directory and say how to get them when missing', async () => {
    const files = await loadAreaFiles(dataDir(), 'fixture');
    expect(files.hashes.network).toMatch(/^[0-9a-f]{64}$/);
    await expect(loadAreaFiles(dataDir(), 'nowhere')).rejects.toThrow(/No area "nowhere"/);
    const empty = mkdtempSync(join(tmpdir(), 'traffic-empty-'));
    await expect(loadAreaFiles(empty, 'fixture')).rejects.toThrow(/npm run data:download/);
    const bad = dataDir();
    writeFileSync(join(bad, 'fixture.network.json'), '{"version":');
    await expect(loadAreaFiles(bad, 'fixture')).rejects.toMatchObject({ code: 3 });
  });
});

const pkg = resolve(import.meta.dirname, '../src/sim/pkg');
const built = existsSync(join(pkg, 'traffic_sim_bg.wasm')) && readFileSync(join(pkg, 'traffic_sim.js'), 'utf8').includes('simulatorFingerprint');
(built ? describe : describe.skip)('a tiny end-to-end run on the fixture area', () => {
  it('runs a scenario for a few minutes and the filter changes the block it sits on', async () => {
    const e = await loadEngine();
    const files = await loadAreaFiles(dataDir(), 'fixture');
    const link = net.links.find((l) => l.inStudyArea && l.class === 'residential')!;
    const common = { period: 'am', seed: 1, seconds: 300 };
    const base = runFor(e, files.simNetwork, files.demandText, { ...common, interventions: [] });
    const scen = runFor(e, files.simNetwork, files.demandText, { ...common, interventions: [{ type: 'modal_filter', link: link.id }] });
    expect(base.metrics.time).toBeGreaterThanOrEqual(300);
    const again = runFor(e, files.simNetwork, files.demandText, { ...common, interventions: [] });
    expect(Array.from(again.linkStats)).toEqual(Array.from(base.linkStats));
    expect(scen.linkStats[link.id * 4]).toBe(0);
  }, 120_000);
});

