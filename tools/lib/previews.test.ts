import jpeg from 'jpeg-js';
import { describe, expect, it } from 'vitest';
import { buildFixture } from '../../src/fixtures/area';
import { buildMockProposals } from '../../src/fixtures/proposals';
import type { Proposals } from '../../src/lib/proposals';
import { VIEWS } from '../../src/lib/route';
import { publishedList } from '../../src/lib/share-path';
import { buildCard, CARD_H, CARD_W, MIN_TEXT_PX } from './og-card';
import { bigPct, changesSentence, firstClause, numberWord, planPreviews, proposalFigure, shortPeriod, type PreviewInput } from './previews';
import { fontMeasure, svgToJpeg } from './raster';

const bundle = buildFixture();
const hashes = { network: 'a'.repeat(64), demand: 'b'.repeat(64) };
const SIM = 'mocksimulator0001';
const measure = fontMeasure();

function withPictures(file: Proposals): Proposals {
  const f: Proposals = JSON.parse(JSON.stringify(file));
  const ids = bundle.network.links.filter((l) => l.inStudyArea).map((l) => l.id);
  for (const g of f.groups) for (const p of g.proposals) {
    p.picture = { period: 'pm-peak', links: ids.slice(0, 12), base: ids.slice(0, 12).map(() => 40), scen: ids.slice(0, 12).map((_, i) => (i % 3 === 0 ? 5 : i % 3 === 1 ? 70 : 40)) };
  }
  return f;
}
const file = withPictures(buildMockProposals(bundle.network, { networkHash: hashes.network, demandHash: hashes.demand, calibration: 'uncalibrated' }));
const input = (over: Partial<PreviewInput> = {}): PreviewInput => ({
  siteHost: 'site.example', area: { ...bundle.entry, calibration: { status: 'uncalibrated', note: '' } }, network: bundle.network, demand: bundle.demand, hashes, simulator: SIM, proposals: file, baseline: null, ...over,
});

describe('words', () => {
  it('spells small numbers and names the change count', () => {
    expect([1, 2, 6, 10, 11].map(numberWord)).toEqual(['one', 'two', 'six', 'ten', '11']);
    expect(changesSentence(['A'])).toBe('One change: A.');
    expect(changesSentence(['A', 'B'])).toBe('Two changes: A; B.');
  });
  it('counts what does not fit and always names the first change', () => {
    const labels = Array.from({ length: 6 }, (_, i) => `Modal filter at Street ${i} & Avenue ${i}`);
    const s = changesSentence(labels, 100);
    expect(s).toMatch(/^Six changes: Modal filter at Street 0 & Avenue 0; /);
    expect(s).toMatch(/; and \d+ more\.$/);
    expect(s.length).toBeLessThanOrEqual(100);
    expect(changesSentence(['A very long label '.repeat(20)], 40)).toContain('A very long label');
  });
  it('keeps the first clause of a long label and the short period name', () => {
    expect(firstClause('Diagonal diverter at A & B, connecting A (north) with B (east)')).toBe('Diagonal diverter at A & B');
    expect(shortPeriod('PM peak (16:00-18:00 weekday, hourly rate)')).toBe('PM peak');
  });
  it('prints the headline figure with a real minus sign, and says no change', () => {
    expect(bigPct(-15.7, 630, 531)).toBe('−16%');
    expect(bigPct(3.2, 100, 103)).toBe('+3.2%');
    expect(bigPct(0, 100, 100)).toBe('No change');
  });
  it('takes the figure from the picture\'s period, else the average', () => {
    const p = file.groups[0].proposals[0];
    expect(proposalFigure(p).averaged).toBe(false);
    expect(proposalFigure(p).before).toBe(Math.round(p.byPeriod['pm-peak'].cutThrough.baselineVehPerHour));
    const { picture: _gone, ...bare } = p;
    expect(proposalFigure(bare).averaged).toBe(true);
    expect(proposalFigure(bare).before).toBe(Math.round(p.cutThrough.baselineVehPerHour));
  });
});

describe('planned previews', () => {
  const { plans, fallback, skipped } = planPreviews(input());
  const byPath = new Map(plans.map((p) => [p.path, p]));

  it('has one plan for each tab and one for each published proposal', () => {
    for (const v of VIEWS) expect(byPath.has(v.path)).toBe(true);
    const slugs = publishedList(file).map((x) => `/p/${x.slug}`);
    expect(slugs.length).toBeGreaterThan(3);
    for (const s of slugs) expect(byPath.has(s)).toBe(true);
    expect(plans).toHaveLength(VIEWS.length + slugs.length);
    expect(new Set(plans.map((p) => p.name)).size).toBe(plans.length);
    expect(skipped).toEqual([]);
    expect(fallback.meta.title).toBe(byPath.get('/')!.meta.title);
  });
  it('writes a proposal\'s title, like-for-like figures, changes and status from the data', () => {
    const x = publishedList(file)[0];
    const plan = byPath.get(`/p/${x.slug}`)!;
    const p = x.proposal;
    expect(plan.meta.title).toBe(p.title);
    const c = p.byPeriod['pm-peak'].cutThrough;
    expect(plan.meta.description).toContain(`${Math.round(c.baselineVehPerHour)} → ${Math.round(c.scenarioVehPerHour)} an hour`);
    expect(plan.meta.description).toContain('Simulation, not a forecast. Preview, not yet calibrated.');
    expect(plan.meta.description).toContain(p.interventions[0].label.replace(/,.*$/, ''));
    expect(plan.meta.imageAlt).toContain(p.title);
    expect(plan.meta.imageAlt).toContain('Simulation, not a forecast.');
    expect(plan.card.big?.figure).toMatch(/^[−+]\d/);
  });
  it('says calibrated limits only when the area is calibrated, and never "validated"', () => {
    const cal = planPreviews(input({ area: { ...bundle.entry, calibration: { status: 'calibrated', note: '' } } }));
    expect(cal.plans[0].meta.description).toContain('Calibrated, with limits.');
    for (const p of [...plans, ...cal.plans]) expect(`${p.meta.title} ${p.meta.description} ${p.meta.imageAlt}`).not.toMatch(/validated|forecast that/i);
  });
  it('keeps descriptions short enough to read in a chat', () => {
    for (const p of plans) expect(p.meta.description.length).toBeLessThanOrEqual(270);
  });
  it('describes the Proposals tab from the published packages', () => {
    const d = byPath.get('/proposals')!.meta.description;
    expect(d).toMatch(/^\d+ packages of street changes, from one change to six, with simulated cut-through before and after\./);
  });
  it('gives today\'s figure on the Map when a current baseline is supplied', () => {
    const n = bundle.network.links.length;
    const stats = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) stats[i * 4 + 2] = i % 2 === 0 ? 30 : 0;
    const home = planPreviews(input({ baseline: { period: 'pm-peak', linkStats: stats, throughVph: 632.4 } })).plans[0];
    expect(home.meta.description).toContain('about 632 through cars an hour');
    expect(home.card.big?.figure).toBe('632');
    expect(home.card.map.model.blocks.length).toBeGreaterThan(0);
    expect(byPath.get('/')!.meta.description).not.toContain('about');
  });
  it('writes nothing as current for a group computed on other inputs, and says what it skipped', () => {
    for (const other of [{ network: 'c'.repeat(64), demand: hashes.demand }, { network: hashes.network, demand: 'c'.repeat(64) }]) {
      const r = planPreviews(input({ hashes: other }));
      expect(r.plans.filter((p) => p.path.startsWith('/p/'))).toEqual([]);
      expect(r.skipped.length).toBe(publishedList(file).length);
      expect(r.skipped[0]).toMatch(/computed on another (network|demand)/);
      expect(r.plans.find((p) => p.path === '/proposals')!.meta.description).toContain('None are published right now');
    }
  });
  it('writes nothing as current when only the simulator or the reporting method changed (the audit\'s R1)', () => {
    const r = planPreviews(input({ simulator: 'another-engine' }));
    expect(r.plans.filter((p) => p.path.startsWith('/p/'))).toEqual([]);
    expect(r.skipped[0]).toMatch(/computed on another simulator/);
    const old: Proposals = JSON.parse(JSON.stringify(file));
    for (const g of old.groups) g.computed.reportMethod = 'paired-t-0';
    expect(planPreviews(input({ proposals: old })).skipped[0]).toMatch(/computed on another method/);
  });
  it('still draws a group with no recorded provenance, and says in its description that it is not verified', () => {
    const legacy = withPictures(buildMockProposals(bundle.network, { networkHash: hashes.network, demandHash: hashes.demand, calibration: 'uncalibrated' }, 'legacy'));
    const r = planPreviews(input({ proposals: legacy }));
    const cards = r.plans.filter((p) => p.path.startsWith('/p/'));
    expect(cards.length).toBe(publishedList(legacy).length);
    expect(cards[0].meta.description).toContain('not verified');
    expect(cards[0].meta.description).toContain('mean of 4 runs');
    expect(cards[0].meta.description.length).toBeLessThanOrEqual(300);
  });
  it('names the number of runs in a card\'s figure', () => {
    const r = planPreviews(input());
    expect(r.plans.find((p) => p.path.startsWith('/p/'))!.meta.description).toContain('mean of 10 runs');
  });
  it('skips only the stale group, and a proposal with no picture', () => {
    const mixed: Proposals = JSON.parse(JSON.stringify(file));
    mixed.groups.push({ ...JSON.parse(JSON.stringify(mixed.groups[0])), id: 'other' });
    mixed.groups[1].computed.networkHash = 'deadbeefdeadbeef';
    delete mixed.groups[0].proposals[0].picture;
    const r = planPreviews(input({ proposals: mixed }));
    const paths = r.plans.filter((p) => p.path.startsWith('/p/')).length;
    expect(paths).toBe(mixed.groups[0].proposals.length - 1);
    expect(r.skipped.some((s) => /no picture/.test(s))).toBe(true);
    expect(r.skipped.filter((s) => /another network/.test(s))).toHaveLength(mixed.groups[1].proposals.length);
  });
  it('copes with no proposals file at all', () => {
    const r = planPreviews(input({ proposals: null }));
    expect(r.plans).toHaveLength(VIEWS.length);
  });
  it('is deterministic', () => {
    expect(JSON.stringify(planPreviews(input()).plans.map((p) => [p.path, p.meta, p.card.title, p.card.big]))).toBe(JSON.stringify(plans.map((p) => [p.path, p.meta, p.card.title, p.card.big])));
  });
});

describe('cards', () => {
  const { plans } = planPreviews(input());

  it('fit, never set text under 28 px and keep text inside the left panel', () => {
    for (const p of plans) {
      const c = buildCard(p.card, measure);
      expect(c.fits, p.path).toBe(true);
      for (const t of c.texts) {
        expect(t.size, `${p.path}: ${t.text}`).toBeGreaterThanOrEqual(MIN_TEXT_PX);
        expect(t.y, t.text).toBeLessThanOrEqual(CARD_H - 20);
      }
      for (const t of c.texts.filter((x) => x.x < 560)) expect(t.x + t.width, `${p.path}: ${t.text}`).toBeLessThanOrEqual(560 - 16);
    }
  });
  it('shrinks and then cuts a very long title instead of overflowing', () => {
    const plan = plans.find((p) => p.path.startsWith('/p/'))!;
    const c = buildCard({ ...plan.card, title: 'A very long proposal title with many words that keeps going '.repeat(8) }, measure);
    expect(c.fits).toBe(true);
    expect(c.texts.some((t) => t.text.endsWith('…'))).toBe(true);
  });
  it('escapes markup in anything it draws', () => {
    const plan = plans[0];
    const c = buildCard({ ...plan.card, title: '<script>alert(1)</script> & "q"', kicker: '</text><g onload=x>' }, measure);
    expect(c.svg).not.toContain('<script>');
    expect(c.svg).not.toContain('<g onload');
    expect(c.svg).toContain('&lt;script&gt;');
  });
  it('rasterizes to a 1200 x 630 JPEG under 300 KB with text actually drawn and the same bytes each time', () => {
    const plan = plans.find((p) => p.path.startsWith('/p/'))!;
    const svg = buildCard(plan.card, measure).svg;
    const a = svgToJpeg(svg), b = svgToJpeg(svg);
    expect([a.width, a.height]).toEqual([CARD_W, CARD_H]);
    expect([...a.jpeg.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
    expect(a.jpeg.length).toBeLessThan(300 * 1024);
    expect(a.jpeg.equals(b.jpeg)).toBe(true);
    const px = jpeg.decode(a.jpeg, { useTArray: true });
    let dark = 0;
    for (let y = 36; y < 130; y++) for (let x = 40; x < 520; x++) if (px.data[(y * px.width + x) * 4] < 110) dark++;
    expect(dark).toBeGreaterThan(1500);
  });
});
