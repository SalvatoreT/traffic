// One drawn path per street label, taken from the lowest seed that has one, so the stored sample does not depend on worker finishing order.
export function mergeSamples(bySeed: Iterable<[number, Map<string, number[]>]>): Map<string, number[]> {
  const out = new Map<string, number[]>();
  for (const [, samples] of [...bySeed].sort((a, b) => a[0] - b[0])) for (const [label, links] of samples) if (!out.has(label)) out.set(label, links);
  return out;
}
