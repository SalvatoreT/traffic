const SUFFIX: Record<string, string> = {
  Street: 'St', Avenue: 'Ave', Boulevard: 'Blvd', Road: 'Rd', Drive: 'Dr', Place: 'Pl', Court: 'Ct', Lane: 'Ln', Terrace: 'Ter', Highway: 'Hwy', Parkway: 'Pkwy',
};
const RE = new RegExp(`(?<=(?:\\b[A-Z][\\w'.]*|\\b\\d+(?:st|nd|rd|th)) )(${Object.keys(SUFFIX).join('|')})\\b`, 'g');

/** Shortens street-type words that follow a name ("63rd Street" → "63rd St"), for display only: data keeps the full names. */
export function shortStreets(s: string): string {
  return s.replace(RE, (m) => SUFFIX[m]);
}

/** A copy with every string shortened, except under `skip` keys (links, ids and anything matched against other data). */
export function shortStreetsDeep<T>(v: T, skip: ReadonlySet<string> = new Set()): T {
  if (typeof v === 'string') return shortStreets(v) as T;
  if (Array.isArray(v)) return v.map((x) => shortStreetsDeep(x, skip)) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, skip.has(k) ? x : shortStreetsDeep(x, skip)])) as T;
  return v;
}
