import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseRefLinks, splitRefEntry } from './ref-links';

describe('parseRefLinks', () => {
  it('reads label and url pairs', () => {
    expect(parseRefLinks('Links: Table I (PDF p. 5) → https://example.org/a.pdf#page=5 · DOI → https://doi.org/10.1/x')).toEqual([
      { label: 'Table I (PDF p. 5)', url: 'https://example.org/a.pdf#page=5' },
      { label: 'DOI', url: 'https://doi.org/10.1/x' },
    ]);
  });
  it('ignores other lines and unsafe urls', () => {
    expect(parseRefLinks('Introduces the model.')).toBeNull();
    expect(parseRefLinks('Links: x → javascript:alert(1)')).toBeNull();
  });
});

describe('splitRefEntry', () => {
  it('makes a first label found in the prose the title link', () => {
    const e = splitRefEntry(['**[K]** A. (2000). Big idea. *Journal* 1.', 'Links: Big idea → https://e.org/1 · Eq. 6 → https://e.org/1#page=3']);
    expect(e.title?.url).toBe('https://e.org/1');
    expect(e.more).toEqual([{ label: 'Eq. 6', url: 'https://e.org/1#page=3' }]);
    expect(e.head).toContain('Big idea');
    expect(e.tail).toBe('');
  });
  it('lists every link when the first label is not in the prose', () => {
    const e = splitRefEntry(['**[K]** A. (2000). Big idea.', 'Links: DOI → https://doi.org/10.1/x']);
    expect(e.title).toBeNull();
    expect(e.more).toHaveLength(1);
  });
});

describe('docs/references.md', () => {
  const lines = readFileSync(new URL('../../docs/references.md', import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('Links:'));
  it('has Links lines that all parse, each with a check date', () => {
    expect(lines.length).toBeGreaterThan(100);
    for (const l of lines) {
      expect(parseRefLinks(l), l).not.toBeNull();
      expect(l, l).toMatch(/ · checked \d{4}-\d\d-\d\d$/);
    }
  });
  it('writes every pair with a label and a URL that has no raw parentheses', () => {
    for (const l of lines) for (const p of parseRefLinks(l)!) expect(p.url, l).not.toMatch(/[()]/);
  });
});
