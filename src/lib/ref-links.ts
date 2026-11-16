export interface RefLink { label: string; url: string }

const SAFE = /^https?:\/\/\S+$/i;

/** One `Links:` line of docs/references.md: `Links: label → url · label → url`. The first pair is the primary link. */
export function parseRefLinks(line: string): RefLink[] | null {
  const m = /^Links:\s+(.+)$/.exec(line.trim());
  if (!m) return null;
  const out: RefLink[] = [];
  for (const part of m[1].split(' · ')) {
    const p = /^(.+?)\s→\s(\S+)$/.exec(part.trim());
    if (p && SAFE.test(p[2])) out.push({ label: p[1].trim(), url: p[2] });
  }
  return out.length ? out : null;
}

/** Splits an entry's text lines into the citation line, the rest of the prose and its links. A first label that occurs verbatim in the citation line is the title link; the others follow it in parentheses. */
export function splitRefEntry(lines: string[]): { head: string; tail: string; title: RefLink | null; more: RefLink[] } {
  const prose: string[] = [];
  let links: RefLink[] = [];
  for (const l of lines) {
    const p = parseRefLinks(l);
    if (p) links = links.concat(p); else prose.push(l);
  }
  const head = prose[0] ?? '';
  const tail = prose.slice(1).join(' ');
  if (links.length && head.includes(links[0].label)) return { head, tail, title: links[0], more: links.slice(1) };
  return { head, tail, title: null, more: links };
}
