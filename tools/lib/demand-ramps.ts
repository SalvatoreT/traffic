// Freeway-ramp topology discovery and ramp-volume matching for build-demand.ts. Node built-ins only.
// A ramp is a surface node touched by both freeway-class and surface links; direction follows the freeway links:
// 'off' = a freeway link arrives (freeway -> surface), 'on' = a freeway link leaves (surface -> freeway).
export interface RNode { id: number; gate: boolean }
export interface RLink { id: number; from: number; to: number; name: string; class: string }
export interface Ramp {
  kind: 'off' | 'on';
  surface: number;
  gates: number[]; // freeway gates feeding (off) or fed by (on) this ramp: pure sources (off) / pure sinks (on)
  streets: string[]; // distinct surface street names at the ramp's surface node
  path: number[]; // freeway-class node ids from the surface node to the gate(s), for reporting
}
export interface RampRow { route: string; postmile: string; desc: string; adt: Record<string, number> }
export interface RampVolume { adt: number; kind: 'DATA' | 'ASSUMPTION'; source: string }

export function discoverRamps(nodes: RNode[], links: RLink[], freeway: Set<string>): { ramps: Ramp[]; freewayGates: Set<number> } {
  const fw = links.filter((l) => freeway.has(l.class));
  const surf = links.filter((l) => !freeway.has(l.class));
  const fwIn = new Map<number, RLink[]>(), fwOut = new Map<number, RLink[]>(), surfAt = new Map<number, RLink[]>();
  const push = (m: Map<number, RLink[]>, k: number, l: RLink) => (m.get(k) ?? m.set(k, []).get(k)!).push(l);
  for (const l of fw) { push(fwOut, l.from, l); push(fwIn, l.to, l); }
  for (const l of surf) { push(surfAt, l.from, l); push(surfAt, l.to, l); }
  const freewayGates = new Set(nodes.filter((n) => n.gate && ((fwIn.get(n.id)?.length ?? 0) + (fwOut.get(n.id)?.length ?? 0)) > 0 && !(surfAt.get(n.id)?.length)).map((n) => n.id));
  const walk = (start: number, next: (id: number) => number[], stop: (id: number) => boolean) => {
    const seen = new Set<number>([start]), q = [start], hit: number[] = [];
    while (q.length) for (const n of next(q.shift()!)) if (!seen.has(n)) { seen.add(n); q.push(n); if (stop(n)) hit.push(n); }
    return { hit, seen: [...seen] };
  };
  const ramps: Ramp[] = [];
  for (const n of nodes) {
    const s = surfAt.get(n.id);
    if (!s?.length) continue;
    const streets = [...new Set(s.map((l) => l.name).filter(Boolean))];
    if (fwIn.get(n.id)?.length) {
      const w = walk(n.id, (id) => (fwIn.get(id) ?? []).map((l) => l.from), (id) => freewayGates.has(id) && !fwIn.get(id)?.length);
      if (w.hit.length) ramps.push({ kind: 'off', surface: n.id, gates: w.hit, streets, path: w.seen });
    }
    if (fwOut.get(n.id)?.length) {
      const w = walk(n.id, (id) => (fwOut.get(id) ?? []).map((l) => l.to), (id) => freewayGates.has(id) && !fwOut.get(id)?.length);
      if (w.hit.length) ramps.push({ kind: 'on', surface: n.id, gates: w.hit, streets, path: w.seen });
    }
  }
  return { ramps, freewayGates };
}

// Match published ramp ADT rows to ramps and sum them. Two routes, in order:
//  1. aliases: a ramp whose surface street names contain `street` (lower case) and whose kind equals `kind` takes the rows whose
//     description contains `row` (upper case). Used where the network street name differs from the Caltrans description.
//  2. street keys: config.streetMatch patterns found in the row description, and the ramp type ('OFF TO' / 'ON FR').
// Rows for the same group are summed and shared by the ramps of the group. 'SEG' (segment) rows count only when they name exactly one
// street key, so a combined row and its per-street rows are never both used; `exclude` drops rows by description substring.
export interface RampAlias { street: string; kind: 'off' | 'on'; row: string; /** Optional location filter (metres, network frame): the ramp's surface node must lie within `maxM` of `at`. */ at?: [number, number]; maxM?: number }
export function matchRampVolumes(
  ramps: Ramp[], rows: RampRow[], streetMatch: Record<string, string[]>, streetKey: (name: string) => string | null, defaultAdt: number, rowsLabel: string,
  aliases: RampAlias[] = [], exclude: string[] = [], locate: (id: number) => [number, number] = () => [0, 0],
): Map<Ramp, RampVolume & { street: string | null }> {
  const keys = Object.keys(streetMatch).filter((k) => k[0] !== '_');
  const latest = (r: RampRow) => { const y = Math.max(...Object.keys(r.adt).map(Number)); return { year: y, adt: r.adt[y] }; };
  const keyOf = (r: Ramp) => r.streets.map(streetKey).find((k) => k && keys.includes(k)) ?? null;
  const usable = rows.filter((r) => !exclude.some((x) => r.desc.toUpperCase().includes(x.toUpperCase())));
  const typeOf = (d: string) => (/^DUM\b/.test(d) ? null : /\bOFF\b/.test(d) ? 'off' : /\bON\b/.test(d) ? 'on' : null);
  const seg = (d: string) => /^SEG\b/.test(d);
  const keyHits = (desc: string) => keys.filter((k) => streetMatch[k].some((p) => desc.toLowerCase().includes(p)));
  const describe = (hit: RampRow[]) => hit.map((h) => ({ h, ...latest(h) }));
  const label = (parts: ReturnType<typeof describe>) => parts.map((p) => `${p.h.route} PM ${p.h.postmile} "${p.h.desc}" ${p.adt} (${p.year})`).join('; ');
  const out = new Map<Ramp, RampVolume & { street: string | null }>();
  const groups = new Map<string, { ramps: Ramp[]; rows: RampRow[]; street: string | null }>();
  for (const r of ramps) {
    const al = aliases.find((a) => a.kind === r.kind && r.streets.some((s) => s.toLowerCase().includes(a.street)) && (!a.at || Math.hypot(locate(r.surface)[0] - a.at[0], locate(r.surface)[1] - a.at[1]) <= (a.maxM ?? 150)));
    if (al) {
      const g = groups.get(`alias|${al.street}|${al.kind}|${al.row}|${al.at?.join(',') ?? ''}`) ?? groups.set(`alias|${al.street}|${al.kind}|${al.row}|${al.at?.join(',') ?? ''}`, { ramps: [], rows: usable.filter((x) => x.desc.toUpperCase().includes(al.row.toUpperCase())), street: al.street }).get(`alias|${al.street}|${al.kind}|${al.row}|${al.at?.join(',') ?? ''}`)!;
      g.ramps.push(r);
      continue;
    }
    const k = keyOf(r);
    if (!k) continue;
    const g = groups.get(`key|${k}|${r.kind}`) ?? groups.set(`key|${k}|${r.kind}`, { ramps: [], rows: usable.filter((x) => { const d = x.desc.toUpperCase(); const hits = keyHits(x.desc); return typeOf(d.replace(/^SEG\s+/, '')) === r.kind && hits.includes(k) && (!seg(d) || hits.length === 1); }), street: k }).get(`key|${k}|${r.kind}`)!;
    g.ramps.push(r);
  }
  for (const g of groups.values()) {
    if (!g.rows.length) continue;
    const parts = describe(g.rows);
    const total = parts.reduce((a, p) => a + p.adt, 0);
    for (const r of g.ramps) out.set(r, { adt: total / g.ramps.length, kind: 'DATA', street: g.street, source: `${rowsLabel}: ${label(parts)}${g.ramps.length > 1 ? `, shared by ${g.ramps.length} ramps` : ''}` });
  }
  for (const r of ramps) if (!out.has(r)) out.set(r, { adt: defaultAdt, kind: 'ASSUMPTION', street: keyOf(r), source: `no published ramp count matched; default ADT ${defaultAdt}` });
  return out;
}
