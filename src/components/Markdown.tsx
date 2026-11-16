import { Fragment, type ReactNode } from 'react';
import { AnchorHeading, AnchorLink } from './Anchor';
import { splitRefEntry } from '../lib/ref-links';

/** Minimal, safe markdown renderer (no HTML injection: everything becomes React elements). */
const SAFE_URL = /^(https?:\/\/|mailto:)/i;

function slug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

function inline(text: string, keyBase: string, sameTab?: ReadonlySet<string>): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)\s]+\))|(https?:\/\/[^\s)<>\]]+)/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    const tok = m[0];
    if (m[1]) out.push(<code key={k}>{tok.slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={k}>{inline(tok.slice(2, -2), k, sameTab)}</strong>);
    else if (m[3]) out.push(<em key={k}>{inline(tok.slice(1, -1), k, sameTab)}</em>);
    else if (m[4]) {
      const mm = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok)!;
      out.push(SAFE_URL.test(mm[2])
        ? sameTab?.has(mm[2]) ? <a key={k} href={mm[2]}>{mm[1]}</a> : <a key={k} href={mm[2]} target="_blank" rel="noopener noreferrer">{mm[1]}</a>
        : <Fragment key={k}>{mm[1]}</Fragment>);
    } else {
      const url = tok.replace(/[.,;:]+$/, '');
      out.push(<a key={k} href={url} target="_blank" rel="noopener noreferrer">{url}</a>);
      if (url.length < tok.length) out.push(tok.slice(url.length));
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** With `anchors` (the ids already taken on the page), every heading and every `**[Key]**` entry gets a stable id and a link control. */
export function Markdown({ source, offset = 1, anchors }: { source: string; offset?: number; anchors?: readonly string[] }) {
  const taken = new Set(anchors);
  const unique = (base: string) => { let id = base || 'section', n = 2; while (taken.has(id)) id = `${base}-${n++}`; taken.add(id); return id; };
  const lines = source.replace(/\r/g, '').split('\n');
  const nodes: ReactNode[] = [];
  let i = 0, k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { i++; continue; }
    if (/^```/.test(line)) {
      const buf: string[] = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      nodes.push(<pre key={k++} tabIndex={0} role="region" aria-label="Code block, scrollable"><code>{buf.join('\n')}</code></pre>);
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const lvl = Math.min(h[1].length + offset, 6);
      const Tag = `h${lvl}` as 'h2';
      if (anchors) nodes.push(<AnchorHeading key={k++} as={Tag} id={unique(slug(h[2]))} label={h[2].replace(/[*`]/g, '')}>{inline(h[2], `h${k}`)}</AnchorHeading>);
      else nodes.push(<Tag key={k++} id={slug(h[2])}>{inline(h[2], `h${k}`)}</Tag>);
      i++; continue;
    }
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const cells = (l: string) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(line); i += 2;
      const body: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) body.push(cells(lines[i++]));
      nodes.push(
        <div className="table-scroll" key={k++} tabIndex={0} role="region" aria-label="Table, scrollable">
          <table><thead><tr>{head.map((c, j) => <th scope="col" key={j}>{inline(c, `th${k}${j}`)}</th>)}</tr></thead>
            <tbody>{body.map((r, a) => <tr key={a}>{r.map((c, b) => <td key={b}>{inline(c, `td${k}${a}${b}`)}</td>)}</tr>)}</tbody></table>
        </div>,
      );
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const items: { depth: number; text: string }[] = [];
      const ordered = /^\s*\d+\./.test(line);
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        const mm = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(lines[i])!;
        let text = mm[3]; i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) text += ' ' + lines[i++].trim();
        items.push({ depth: Math.floor(mm[1].length / 2), text });
      }
      const Wrap = ordered ? 'ol' : 'ul';
      nodes.push(<Wrap key={k++}>{items.map((it, a) => <li key={a} style={it.depth ? { marginLeft: `${it.depth * 1.2}rem` } : undefined}>{inline(it.text, `li${k}${a}`)}</li>)}</Wrap>);
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      nodes.push(<blockquote key={k++}>{inline(buf.join(' '), `q${k}`)}</blockquote>);
      continue;
    }
    if (/^---+\s*$/.test(line)) { nodes.push(<hr key={k++} />); i++; continue; }
    const buf: string[] = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6}\s|```|\s*\||\s*([-*]|\d+\.)\s+|>)/.test(lines[i])) buf.push(lines[i++]);
    if (!buf.length) { buf.push(lines[i++]); }
    const entry = splitRefEntry(buf);
    const same = new Set<string>();
    let text = entry.head;
    if (entry.title) {
      const t = entry.title;
      same.add(t.url);
      text = text.replace(t.label, `[${t.label}](${t.url})`);
    }
    const ref = /^\*\*\[([A-Za-z0-9-]+)\]\*\*/.exec(text);
    const key = ref && !taken.has(ref[1]) ? ref[1] : undefined;
    if (key && anchors) taken.add(key);
    nodes.push(
      <p key={k++} id={key} className={key && anchors ? 'anchored' : undefined}>
        {inline(text, `p${k}`, same)}
        {entry.more.length > 0 && (
          <span className="ref-links"> (
            {entry.more.map((l, n) => <Fragment key={n}>{n > 0 && '; '}<a href={l.url}>{l.label}</a></Fragment>)}
          )</span>
        )}
        {entry.tail && <> {inline(entry.tail, `t${k}`)}</>}
        {key && anchors && <>{' '}<AnchorLink id={key} label={key} /></>}
      </p>,
    );
  }
  return <div className="md">{nodes}</div>;
}
