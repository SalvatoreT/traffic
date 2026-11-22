import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as copy from './copy';
import { STORED_NOTE } from './stored-results';

const src = (f: string) => readFileSync(resolve(import.meta.dirname, '..', f), 'utf8');
/** Whitespace and JSX line breaks do not matter; a typographic quote counts as the plain one. */
const flat = (s: string) => s.replace(/<\/?(strong|em|code)>/g, '').replace(/&#39;|&apos;/g, "'").replace(/[’]/g, "'").replace(/\s+/g, ' ');
const head = (s: string, n = 90) => flat(s).slice(0, n);
const tail = (s: string, n = 70) => flat(s).slice(-n);

describe('shared copy matches the components that show it', () => {
  const cases: [string, string, string][] = [
    ['PROPOSALS_LEAD', copy.PROPOSALS_LEAD, 'components/Proposals.tsx'],
    ['ASSUMPTIONS_INTRO', copy.ASSUMPTIONS_INTRO, 'components/Assumptions.tsx'],
    ['MOVEMENTS_INTRO', copy.MOVEMENTS_INTRO, 'components/Assumptions.tsx'],
    ['DERIVED_TARGETS_INTRO', copy.DERIVED_TARGETS_INTRO, 'components/Assumptions.tsx'],
    ['FIXED_DEMAND_CAVEAT', copy.FIXED_DEMAND_CAVEAT, 'components/Comparison.tsx'],
    ['EXPLORATORY_NOTE', copy.EXPLORATORY_NOTE, 'components/Proposals.tsx'],
    ['LEGACY_GROUP_NOTE', copy.LEGACY_GROUP_NOTE, 'components/Proposals.tsx'],
    ['SOURCES_CALIBRATED', copy.SOURCES_CALIBRATED, 'components/Sources.tsx'],
    ['SOURCES_UNCALIBRATED', copy.SOURCES_UNCALIBRATED, 'components/Sources.tsx'],
  ];
  for (const [name, text, file] of cases) {
    it(`${name} is in ${file}`, () => {
      const code = flat(src(file));
      expect(code).toContain(head(text));
      expect(code).toContain(tail(text));
    });
  }
  it('has the stored-result note the app shows', () => { expect(STORED_NOTE.length).toBeGreaterThan(10); });
});
