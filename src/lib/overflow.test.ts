import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { centeredScroll, moreSides } from './overflow';

const css = readFileSync(resolve(import.meta.dirname, '..', 'styles.css'), 'utf8');
const proposals = readFileSync(resolve(import.meta.dirname, '..', 'components', 'Proposals.tsx'), 'utf8');
const app = readFileSync(resolve(import.meta.dirname, '..', 'App.tsx'), 'utf8');

describe('moreSides', () => {
  it('says which edges hide more', () => {
    expect(moreSides(0, 300, 300)).toBe('none');
    expect(moreSides(0, 300, 500)).toBe('end');
    expect(moreSides(100, 300, 500)).toBe('both');
    expect(moreSides(200, 300, 500)).toBe('start');
  });
  it('ignores a pixel of rounding', () => {
    expect(moreSides(0, 300, 300.6)).toBe('none');
    expect(moreSides(0.5, 300, 301)).toBe('none');
    expect(moreSides(199.5, 300, 500)).toBe('start');
  });
});

describe('centeredScroll', () => {
  it('centers an item and stays inside the scrollable range', () => {
    expect(centeredScroll(400, 100, 300, 800)).toBe(300);
    expect(centeredScroll(10, 80, 300, 800)).toBe(0);
    expect(centeredScroll(700, 100, 300, 800)).toBe(500);
    expect(centeredScroll(100, 100, 300, 250)).toBe(0);
  });
});

describe('edge cue and layout rules', () => {
  it('draws the cue on the side that has more tabs, without taking pointer events, and drops it in forced colors', () => {
    expect(css).toMatch(/\.navwrap\[data-more='start'\]::before/);
    expect(css).toMatch(/\.navwrap\[data-more='end'\]::after/);
    expect(css).toMatch(/\.navwrap::before, \.navwrap::after \{[^}]*pointer-events: none/);
    expect(css).toMatch(/@media \(forced-colors: active\) \{ \.navwrap::before, \.navwrap::after \{ display: none/);
  });
  it('shows the footer on phones, where the source link lives', () => {
    expect(css).not.toMatch(/^\s*\.foot \{ display: none; \}/m);
    expect(app).toContain('Source on GitHub');
    expect(app.indexOf('Source on GitHub')).toBeGreaterThan(app.indexOf('<footer'));
    expect(app.indexOf('foot-theme')).toBeGreaterThan(app.indexOf('<footer'));
  });
  it('keeps the page and the stage from panning sideways', () => {
    expect(css).toMatch(/html, body \{ overflow-x: clip/);
    expect(css).toMatch(/\.stage \{[^}]*overflow-x: hidden/);
  });
});

describe('proposal cards', () => {
  it('pin the header under the app chrome, in the same way as the Assumptions headings', () => {
    expect(css).toMatch(/\.prop-head \{ position: sticky; top: var\(--sticky-top\)/);
  });
  it('keep every disclosure closed by default and use real summary elements', () => {
    expect(proposals).not.toMatch(/<details[^>]*\bopen\b/);
    const details = proposals.match(/<details/g)?.length ?? 0;
    const summaries = proposals.match(/<summary>/g)?.length ?? 0;
    expect(details).toBeGreaterThanOrEqual(6);
    expect(summaries).toBe(details);
  });
  it('labels what is inside each disclosure', () => {
    for (const label of ['In words, and where these figures come from', 'Through cars an hour, by period', "All cars on the worst block, and the search's ranking penalty", 'Context: through cars on one block, through routes, resident detour', 'How to read these cards, and where the figures come from']) {
      expect(proposals).toContain(`<summary>${label}</summary>`);
    }
  });
});
