import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { DemandIntent } from '../types';
import { Corridors } from '../components/Corridors';
import { buildFixture } from '../fixtures/area';
import { corridorLines } from '../../tools/lib/llms-docs';
import type { BaselineIntents } from './baseline-intents';
import { corridorView, crossingLines, crossingSentences, FOLD_SHARE, reasonsOf, type CorridorDefs, type CorridorPeriod } from './corridors';

const defs: CorridorDefs = {
  corridors: [
    { id: 'a', name: 'Alpha St', directionBy: 'compass', streets: [{ name: 'Alpha Street', part: false }, { name: '1st Street', part: true }] },
    { id: 'b', name: 'Beta Ave', directionBy: 'ends', streets: [{ name: 'Beta Avenue', part: false }] },
  ],
  otherName: 'Other side streets', secondShare: 0.3, sides: { west: ['West Rd'], east: ['East Rd'] },
};
const intents: DemandIntent[] = [
  { id: 'r1', label: 'To the freeway', basis: 'observed', note: 'n', avoids: 'Main St' },
  { id: 'r2', label: 'Across town', basis: 'assumed', note: 'n' },
];
// Two periods; 100 and 50 through cars an hour.
const pm: CorridorPeriod = {
  flows: [
    { corridor: 'a', direction: 'Northbound', vph: 50, byIntent: [30, 20, 0] },
    { corridor: 'b', direction: 'West Rd to East Rd', vph: 30, byIntent: [0, 25, 5] },
    { corridor: 'a', direction: 'Southbound', vph: 14, byIntent: [14, 0, 0] },
    { corridor: 'other', direction: 'Eastbound', vph: 4, byIntent: [0, 0, 4] },
    { corridor: 'b', direction: 'Other way', vph: 2, byIntent: [0, 2, 0] },
  ],
  crossing: [{ from: 'West Rd', to: 'East Rd', corridor: 'b', vph: 30 }],
  multi: { vph: 100, second: 10 },
};
const am: CorridorPeriod = {
  flows: [
    { corridor: 'a', direction: 'Northbound', vph: 20, byIntent: [10, 10, 0] },
    { corridor: 'b', direction: 'West Rd to East Rd', vph: 10, byIntent: [0, 10, 0] },
    { corridor: 'a', direction: 'Southbound', vph: 2, byIntent: [2, 0, 0] },
    { corridor: 'other', direction: 'Eastbound', vph: 8, byIntent: [0, 0, 8] },
    { corridor: 'b', direction: 'Other way', vph: 10, byIntent: [0, 10, 0] },
  ],
  crossing: [], multi: { vph: 50, second: 5 },
};

describe('headline flows and smaller flows', () => {
  const v = corridorView(defs, { pm_peak: pm, am_peak: am }, ['pm_peak', 'am_peak'], 'pm_peak')!;
  it('orders the flows by cars an hour in the lead period', () => {
    expect(v.rows.map((r) => r.key)).toEqual(['a|Northbound', 'b|West Rd to East Rd', 'a|Southbound', 'other|Eastbound', 'b|Other way'].filter((k) => v.rows.some((r) => r.key === k)));
    expect(v.rows[0].vph.pm_peak).toBe(50);
  });
  it('folds a flow only when it is under the fold share in every period', () => {
    expect(FOLD_SHARE).toBe(0.05);
    expect(v.rows.map((r) => r.key)).toContain('other|Eastbound');
    expect(v.rows.map((r) => r.key)).toContain('b|Other way');
    expect(v.folded).toHaveLength(0);
    const small = corridorView(defs, { pm_peak: pm, am_peak: am }, ['pm_peak', 'am_peak'], 'pm_peak', 0.1)!;
    expect(small.folded.map((r) => r.key)).toEqual([]);
    const one = corridorView(defs, { pm_peak: pm, am_peak: am }, ['pm_peak'], 'pm_peak')!;
    expect(one.folded.map((r) => r.key)).toEqual(['other|Eastbound', 'b|Other way']);
    expect(one.foldedVph.pm_peak).toBe(6);
  });
  it('keeps the rows and the folded flows adding up to the total of every period', () => {
    for (const p of ['pm_peak', 'am_peak']) expect(v.rows.reduce((s, r) => s + r.vph[p], 0) + v.foldedVph[p]).toBe(v.totals[p]);
    expect(v.totals).toEqual({ pm_peak: 100, am_peak: 50 });
  });
  it('is null when the lead period has no table', () => {
    expect(corridorView(defs, { am_peak: am }, ['am_peak'], 'pm_peak')).toBeNull();
  });
  it('lists the reasons with cars, most in the lead period first', () => {
    const r = reasonsOf(intents, { pm_peak: [30, 20, 0], am_peak: [10, 10, 0] }, ['pm_peak', 'am_peak']);
    expect(r.map((x) => x.id)).toEqual(['r1', 'r2']);
    expect(r[0].vph).toEqual({ pm_peak: 30, am_peak: 10 });
  });
});

describe('east-west crossing', () => {
  it('counts cars between the west and east bounding streets, with the corridor that carries them', () => {
    const lines = crossingLines(defs, { pm_peak: pm, am_peak: am }, ['pm_peak', 'am_peak'], 'pm_peak');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ east: 'East Rd', vph: { pm_peak: 30, am_peak: 0 }, small: false, top: { name: 'Beta Ave', share: 1 } });
    const s = crossingSentences(lines, ['pm_peak', 'am_peak'], 'pm_peak', (p) => (p === 'pm_peak' ? 'PM peak' : 'AM peak'));
    expect(s[0]).toBe('Between West Rd and East Rd, in either direction: 30 an hour in the PM peak (30% of through cars), AM peak 0. 100% of the PM peak cars are in Beta Ave.');
  });
  it('calls a flow under the fold share small', () => {
    const tiny: CorridorPeriod = { ...pm, crossing: [{ from: 'West Rd', to: 'East Rd', corridor: 'a', vph: 2 }] };
    expect(crossingLines(defs, { pm_peak: tiny }, ['pm_peak'], 'pm_peak')[0].small).toBe(true);
  });
});

const file = (): BaselineIntents => ({
  version: 1, area: 'x', inputs: { networkHash: 'n', demandHash: 'd', simulator: 's' }, seed: 1, seconds: 3600, computed: 't',
  periods: {
    pm_peak: { totalVph: 100, byIntent: [], intentLinks: '', corridors: pm },
    am_peak: { totalVph: 50, byIntent: [], intentLinks: '', corridors: am },
  },
  corridorDefs: { ...defs, configHash: 'h' },
});

describe('the Where cars cut through section', () => {
  const props = { defs: intents, file: file(), status: 'ok' as const, order: ['pm_peak', 'am_peak'], first: 'pm_peak', periodName: (p: string) => (p === 'pm_peak' ? 'PM peak' : 'AM peak') };
  const html = renderToStaticMarkup(createElement(Corridors, props));
  it('shows real table markup with a row per headline flow and the total', () => {
    expect(html).toContain('<table');
    expect(html).toContain('scope="col"');
    expect(html).toContain('scope="row"');
    expect(html).toContain('Alpha St');
    expect(html).toContain('Northbound');
    expect(html).toContain('All through cars');
    expect(html).toContain('hypotheses');
  });
  it('keeps the reasons, the evidence labels and the streets inside closed disclosures, not at the top level', () => {
    expect(html).not.toContain('<details open');
    const outside = html.replace(/<details[\s\S]*?<\/details>/g, '');
    expect(outside).not.toContain('Observed counts');
    expect(outside).not.toContain('To the freeway');
    expect(html).toContain('Why these cars are here');
    expect(html).toContain('Observed counts');
    expect(html).toContain('Would otherwise use Main St');
    expect(html).toContain('Alpha Street, 1st Street (part)');
  });
  it('folds small flows into one line with a disclosure', () => {
    const one = renderToStaticMarkup(createElement(Corridors, { ...props, order: ['pm_peak'] }));
    expect(one).toContain('Smaller flows');
    expect(one).toContain('What is in the smaller flows');
    const outside = one.replace(/<details[\s\S]*?<\/details>/g, '');
    expect(outside).not.toContain('Other way');
  });
  it('says why there is no table when the stored traffic is stale or missing', () => {
    expect(renderToStaticMarkup(createElement(Corridors, { ...props, file: null, status: 'stale' }))).not.toContain('<table');
    expect(renderToStaticMarkup(createElement(Corridors, { ...props, file: null, status: 'missing' }))).toContain('not available');
  });
});

describe('the text page', () => {
  const bundle = buildFixture();
  const id = bundle.demand.periods[0].id;
  const f = file();
  f.periods = { [id]: { ...f.periods.pm_peak } };
  f.inputs = { networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), simulator: 's' };
  const lines = corridorLines({
    site: 'https://site.test', area: bundle.entry, demand: { ...bundle.demand, intents }, hashes: { network: 'a'.repeat(64), demand: 'b'.repeat(64) }, simulator: null, baselineIntents: f,
  } as never).join('\n');
  it('mirrors the tab: headline rows with cars and shares, reasons under each, the folded flows and the notes', () => {
    expect(lines).toContain('## Where cars cut through');
    expect(lines).toContain('| Alpha St | Northbound | 50 (50%) |');
    expect(lines).toContain('| All through cars |  | 100 (100%) |');
    expect(lines).toContain('### Alpha St, Northbound');
    expect(lines).toContain('Streets in this corridor: Alpha Street, 1st Street (part).');
    expect(lines).toContain('To the freeway (Observed counts)');
    expect(lines).toContain('Crossing the study area east to west:');
  });
});
