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

// Match published ramp ADT rows to ramps by street key (config.streetMatch patterns found in the row description)
// and type ('OFF TO' / 'ON FR'). Rows for the same street+type are summed and shared by the ramps of that street+type.
export function matchRampVolumes(
  ramps: Ramp[], rows: RampRow[], streetMatch: Record<string, string[]>, streetKey: (name: string) => string | null, defaultAdt: number, rowsLabel: string,
): Map<Ramp, RampVolume & { street: string | null }> {
  const typeOf = (d: string) => (/^(SEG|DUM)\b/.test(d) ? null : /\bOFF TO\b/.test(d) ? 'off' : /\bON FR\b/.test(d) ? 'on' : null);
  const latest = (r: RampRow) => { const y = Math.max(...Object.keys(r.adt).map(Number)); return { year: y, adt: r.adt[y] }; };
  const keyOf = (r: Ramp) => r.streets.map(streetKey).find((k) => k && Object.keys(streetMatch).includes(k)) ?? null;
  const groups = new Map<string, Ramp[]>();
  for (const r of ramps) { const k = keyOf(r); if (k) (groups.get(`${k}|${r.kind}`) ?? groups.set(`${k}|${r.kind}`, []).get(`${k}|${r.kind}`)!).push(r); }
  const out = new Map<Ramp, RampVolume & { street: string | null }>();
  for (const [g, rs] of groups) {
    const [key, kind] = g.split('|');
    const hit = rows.filter((row) => typeOf(row.desc.toUpperCase()) === kind && streetMatch[key].some((p) => row.desc.toLowerCase().includes(p)));
    if (!hit.length) continue;
    const parts = hit.map((h) => ({ h, ...latest(h) }));
    const total = parts.reduce((a, p) => a + p.adt, 0);
    for (const r of rs) out.set(r, { adt: total / rs.length, kind: 'DATA', street: key, source: `${rowsLabel}: ${parts.map((p) => `${p.h.route} PM ${p.h.postmile} "${p.h.desc}" ${p.adt} (${p.year})`).join('; ')}${rs.length > 1 ? `, shared by ${rs.length} ramps` : ''}` });
  }
  for (const r of ramps) if (!out.has(r)) out.set(r, { adt: defaultAdt, kind: 'ASSUMPTION', street: keyOf(r), source: `no published ramp count matched; default ADT ${defaultAdt}` });
  return out;
}
