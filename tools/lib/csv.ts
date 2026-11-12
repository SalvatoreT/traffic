/** Splits one CSV line (RFC 4180 quoting, no embedded newlines). */
export function splitCsvLine(line: string): string[] {
  if (!line.includes('"')) return line.split(',');
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') {
        if (line[i + 1] === '"') (cur += '"', i++);
        else q = false;
      } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') (out.push(cur), (cur = ''));
    else cur += c;
  }
  out.push(cur);
  return out;
}

/** Calls `row` for every data row of a CSV text with the header as keys. */
export function eachCsvRow(text: string, row: (r: Record<string, string>) => void): void {
  let pos = text.charCodeAt(0) === 0xfeff ? 1 : 0;
  let header: string[] | null = null;
  while (pos < text.length) {
    let end = text.indexOf('\n', pos);
    if (end < 0) end = text.length;
    let line = text.slice(pos, end);
    pos = end + 1;
    if (line.endsWith('\r')) line = line.slice(0, -1);
    if (!line) continue;
    const f = splitCsvLine(line);
    if (!header) {
      header = f.map((h) => h.trim());
      continue;
    }
    const r: Record<string, string> = {};
    for (let i = 0; i < header.length; i++) r[header[i]] = f[i] ?? '';
    row(r);
  }
}
