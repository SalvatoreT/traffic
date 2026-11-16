import { describe, expect, it } from 'vitest';
import { buildFixture } from '../src/fixtures/area';
import { buildMockProposals } from '../src/fixtures/proposals';
import { parseProposals } from '../src/lib/proposals';
import { pathOfSlug, slugOf } from '../src/lib/share-path';
import { decodeScenario } from '../src/lib/hash';
import { buildIndex } from '../src/lib/naming';
import { buildPages, currency, demote, examplesMd, linkRefs, section, streetsMd, table, type LlmsInput } from './lib/llms-docs';

const bundle = buildFixture();
const entry = { ...bundle.entry, calibration: { status: 'uncalibrated' as const, note: 'Not calibrated: a test note.', defaultPeriod: 'am' } };
const HASHES = { network: 'a'.repeat(64), demand: 'b'.repeat(64) };

function input(over: Partial<LlmsInput> = {}, mock: 'fresh' | 'stale' | 'legacy' = 'fresh'): LlmsInput {
  return {
    site: 'https://site.test', repo: 'https://example.test/repo', generated: '2026-01-02T03:04:05Z',
    area: entry, network: bundle.network, demand: bundle.demand, hashes: HASHES, simulator: null, boundary: ['North Edge Ave', { ref: 'CA 1', class: 'motorway' }].map((b) => (typeof b === 'string' ? b : `${b.ref} freeway`)),
    proposals: parseProposals(JSON.stringify(buildMockProposals(bundle.network, { networkHash: HASHES.network.slice(0, 16), demandHash: HASHES.demand.slice(0, 16), calibration: 'uncalibrated' }, mock))),
    assumptions: null, baselines: {}, baselineIntents: null, resultsIndex: null, dataFiles: [],
    docs: { scenarioLinks: '# Scenario links\n\n## Form\n\ntext\n', dataFiles: '# Data files\n\n## Licenses\n\nODbL text.\n', runLocally: '# Run\n\nrun text\n', references: '# Bibliography\n\n## Part\n\n[Key2000] A paper.\n', readme: '# R\n\n## What is and is not calibrated\n\nStated limits.\n\n## Next\n', proposalsReadme: '# P\n\n## What it measures\n\nMeasures.\n\n## Reading the file\n\nReading.\n', license: 'MIT' },
    ...over,
  };
}

describe('markdown helpers', () => {
  it('takes the text under a heading up to the next one of the same level, and demotes headings outside code', () => {
    const md = '# T\n\n## A\n\none\n\n### A1\n\ntwo\n\n## B\n\nthree\n';
    expect(section(md, 'A')).toBe('one\n\n### A1\n\ntwo');
    expect(section(md, 'Missing')).toBe('');
    expect(demote('# H\n```\n# not a heading\n```\n## K', 2)).toBe('### H\n```\n# not a heading\n```\n#### K');
    expect(demote('###### deep', 3)).toBe('###### deep');
  });
  it('writes bibliography Links lines as markdown links and leaves other lines alone', () => {
    const md = '**[K]** A (2000). Title.\nLinks: Title → https://e.org/a#page=2 · DOI → https://doi.org/10.1/x · checked 2026-11-16\nText.';
    expect(linkRefs(md)).toBe('**[K]** A (2000). Title.\nLinks: [Title](https://e.org/a#page=2) · [DOI](https://doi.org/10.1/x)\nText.');
  });
  it('escapes pipes in table cells', () => {
    expect(table(['a'], [['x|y']])).toContain('x\\|y');
  });
});

describe('currency of stored numbers', () => {
  const i = input();
  it('matches by prefix and names what changed', () => {
    expect(currency({ networkHash: HASHES.network, demandHash: HASHES.demand, simulator: 's' }, i)).toEqual({ current: true, reasons: [] });
    expect(currency({ networkHash: 'c'.repeat(64), demandHash: HASHES.demand, simulator: 's' }, i).reasons).toEqual(['the street network has changed']);
    expect(currency({ networkHash: HASHES.network, demandHash: 'c'.repeat(64), simulator: 's' }, { ...i, simulator: 'other' }).reasons).toEqual(['the demand has changed', 'the simulator has changed']);
  });
});

describe('generated pages', () => {
  const pages = buildPages(input());
  it('writes every page', () => {
    expect(Object.keys(pages).sort()).toEqual(['assumptions.md', 'data-files.md', 'index.md', 'llms-full.txt', 'llms.txt', 'methodology.md', 'proposals.md', 'run-locally.md', 'scenario-links.md', 'sources.md', 'streets.md']);
  });
  it('follows the llms.txt layout: H1, blockquote summary, sections of links with descriptions', () => {
    const t = pages['llms.txt'];
    expect(t.startsWith('# Traffic: ')).toBe(true);
    expect(t.split('\n')[2].startsWith('> ')).toBe(true);
    expect(t).toMatch(/^## Read first$/m);
    expect(t).toMatch(/^- \[Overview\]\(https:\/\/site\.test\/index\.md\): /m);
    expect(t).toContain('no server-side API');
    expect(t).toContain('https://example.test/repo');
  });
  it('carries the calibration status and the not-a-forecast statement on every page', () => {
    for (const [name, text] of Object.entries(pages)) {
      if (name.endsWith('.md') && ['scenario-links.md', 'data-files.md', 'run-locally.md'].includes(name)) { expect(text).toContain('not a forecast'); continue; }
      expect(text, name).toContain('Preview, not yet calibrated.');
      expect(text, name).toContain('not a forecast');
    }
  });
  it('states what it was generated from and links to the human page and the JSON', () => {
    const p = pages['proposals.md'];
    expect(p).toContain('Generated 2026-01-02');
    expect(p).toContain('`aaaaaaaaaaaaaaaa`');
    expect(p).toContain('<https://site.test/proposals>');
    expect(p).toContain(`<https://site.test/data/${entry.id}.proposals.json>`);
  });
  it('lists every proposal with its labels, link and figures', () => {
    const p = pages['proposals.md'];
    const file = input().proposals!;
    for (const g of file.groups) {
      for (const pr of g.proposals) {
        expect(p).toContain(pr.title);
        expect(p).toContain(`https://site.test/${pr.link.startsWith('#') ? pr.link : `#${pr.link}`}`);
        expect(p).toContain(`Share link: <https://site.test${pathOfSlug(slugOf(g.id, pr.link))}>`);
        for (const iv of pr.interventions) expect(p).toContain(iv.label);
      }
    }
    expect(p).not.toContain('**Out of date.**');
    expect(p).not.toMatch(/pilot|limits\)/);
  });
  it('numbers the options by through cars removed, largest first, and lists variants under their option', () => {
    const p = pages['proposals.md'];
    const heads = [...p.matchAll(/^### (\d+)\. (.+)$/gm)].map((m) => [Number(m[1]), m[2]]);
    expect(heads.map((h) => h[0])).toEqual([1, 2, 3, 4, 5]);
    expect(heads.map((h) => h[1])).toEqual(['Six changes across the interior', 'Four filters and one diverter', 'Three filters and a lower speed limit', 'Two filters and a speed hump', 'One filter on the busiest cut-through block']);
    const one = p.slice(p.indexOf('### 5. '));
    expect(one).toContain('Variants (tweaks of this proposal');
    expect(one).toContain('- Use the filter on the next block instead — through cars an hour 118 → 105 (−11%; mean of 10 runs');
  });
  it('says "Out of date" for a proposals file computed on other inputs, and still shows the numbers', () => {
    const stale = buildPages(input({}, 'stale'))['proposals.md'];
    expect(stale).toContain('**Out of date.**');
    expect(stale).toContain('through cars an hour');
    const changed = buildPages(input({ hashes: { network: 'd'.repeat(64), demand: HASHES.demand } }))['proposals.md'];
    expect(changed).toContain('The street network has changed');
  });
  it('says what each figure is: runs, seeds, the interval, and the largest-increase block apart from the penalty block', () => {
    const p = buildPages(input({ simulator: 'mocksimulator0001' }))['proposals.md'];
    expect(p).not.toContain('**Not verified.**');
    expect(p).toContain('mean of 10 runs (seeds 1 to 10)');
    expect(p).toContain('95% interval');
    expect(p).toContain('the block with the largest increase');
    expect(p).toContain("the block behind the search's ranking penalty");
    expect(p).toContain('Exploratory estimate');
    expect(p).not.toMatch(/block that gains the most/);
  });
  it('is out of date when only the simulator differs, and unverified when the simulator cannot be read or was never recorded', () => {
    expect(buildPages(input({ simulator: 'another-engine' }))['proposals.md']).toContain('The simulator code has changed');
    expect(buildPages(input({ simulator: null }))['proposals.md']).toContain('could not be read here');
    const legacy = buildPages(input({ simulator: 'mocksimulator0001' }, 'legacy'))['proposals.md'];
    expect(legacy).toContain('**Not verified.**');
    expect(legacy).toContain('computed before the simulator version, reporting method and run settings were recorded');
    expect(legacy).toContain('flagged by the search');
    expect(legacy).toContain('No uncertainty interval was recorded');
  });
  it('says so when there is nothing to show', () => {
    const none = buildPages(input({ proposals: null }));
    expect(none['proposals.md']).toContain('No proposals have been computed');
    expect(none['streets.md']).toContain('No stored baseline results');
    expect(none['index.md']).toContain('No stored baseline results');
    expect(none['assumptions.md']).toContain('not available for this area');
  });
  it('keeps the guide documents verbatim in the full text', () => {
    const full = pages['llms-full.txt'];
    expect(full).toContain('Stated limits.');
    expect(full).toContain('ODbL text.');
    expect(full).toContain('run text');
    expect(full).toContain('## Intervention types');
    expect(full).toContain('No server-side scenario API');
  });
  it('never uses the word owner or a private name', () => {
    for (const text of Object.values(pages)) expect(text).not.toMatch(/\bowner\b/i);
  });
});

describe('worked examples', () => {
  it('are valid for the area: every item decodes and places', () => {
    const md = examplesMd(input());
    const items = [...md.matchAll(/\| ([a-z]{2},[0-9a-z]{10}[^ |]*) \|/g)].map((m) => m[1]);
    expect(items.length).toBeGreaterThanOrEqual(6);
    for (const item of items) {
      const d = decodeScenario(bundle.network, `#v1;a=${bundle.network.id};s=${item}`);
      expect(d.invalid, item).toBe(false);
      expect(d.unplaced, item).toHaveLength(0);
    }
    const link = /`(#v1;[^`]+)`/.exec(md)![1];
    expect(decodeScenario(bundle.network, link).interventions).toHaveLength(2);
  });
});

describe('streets', () => {
  it('lists blocks with cars an hour from a stored baseline, and marks stale ones', () => {
    const n = bundle.network.links.length;
    const stats = new Float32Array(n * 4);
    const link = bundle.network.links.find((l) => l.inStudyArea)!;
    stats[link.id * 4] = 120; stats[link.id * 4 + 1] = 8; stats[link.id * 4 + 2] = 30;
    const metrics = { time: 3600, cutThrough: { vehiclesPerHour: 5 } } as never;
    const set = (inputs: { networkHash: string; demandHash: string; simulator: string }) => ({ am: { period: 'am', metrics, linkStats: stats, key: 'k', computed: '2026-01-01T00:00:00Z', inputs, seed: 1, seconds: 3600 } });
    const fresh = streetsMd(input({ baselines: set({ networkHash: HASHES.network, demandHash: HASHES.demand, simulator: 's' }) }));
    expect(fresh).toContain('| 120 | 30 |');
    expect(fresh).not.toContain('**Out of date.**');
    const old = streetsMd(input({ baselines: set({ networkHash: HASHES.network, demandHash: 'e'.repeat(64), simulator: 's' }) }));
    expect(old).toContain('**Out of date.**');
    expect(buildIndex(bundle.network).blocks.length).toBeGreaterThan(0);
  });
});
