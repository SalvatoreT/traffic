// Entry movements and named turn-ban packages for the perimeter-turn-bans experiment (openspec/changes/perimeter-turn-bans).
//   npx tsx tools/turn-ban-sets.ts [--area rockridge] [--data public/data] [--out target/turn-bans] [--period pm_peak] [--ranked singles.log]
// Reads the area's network, writes <out>/packages.json, packages.md and packages.tsv (id, bans, link). Runs nothing and sends nothing.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { loadAreaFiles, repoRoot } from './lib/agent-area';
import { analyze, buildPackages, countBy, packageLink, parseSinglesLog, rankFromLinks, type Analysis, type Package, type PackageLink } from './lib/turn-ban-sets';

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const list = (xs: [string, number][]) => xs.map(([n, c]) => `${n} (${c})`).join('; ');

function markdown(a: Analysis, hashes: { network: string }, rows: { p: Package; l: PackageLink }[], note: string[]): string {
  const L: string[] = [];
  L.push(`# Turn-ban packages, ${a.area}`, '', `Network ${hashes.network.slice(0, 16)}. ${a.movements.length} entry movements, ${a.movements.filter((m) => m.encodes && m.baseBan !== 'all-periods').length} usable by the packages. Bounding streets (the proposal search's boundary notion): ${a.boundingStreets.join(', ')}.`, '');
  for (const n of note) L.push(n, '');
  L.push('| Package | Bans | Left | Right | Straight | From | Onto | Round trip |', '| --- | ---: | ---: | ---: | ---: | --- | --- | --- |');
  for (const { p, l } of rows) {
    const t = (k: string) => p.movements.filter((m) => m.turn === k).length;
    L.push(`| \`${p.id}\` | ${p.movements.length} | ${t('left')} | ${t('right')} | ${t('straight')} | ${list(countBy(p.movements, (m) => m.boundingStreet ?? `${m.fromStreet} (outside)`))} | ${list(countBy(p.movements, (m) => m.toStreet))} | ${l.roundTrip ? 'ok' : l.problem} |`);
  }
  L.push('', '## Packages', '');
  for (const { p, l } of rows) L.push(`### \`${p.id}\`: ${p.title}`, '', p.note, '', `${p.movements.length} bans, ${l.items} link items.${p.exempt ? ` Left open for access: ${p.exempt.length} movements (${list(countBy(p.exempt, (m) => `${m.boundingStreet ?? m.fromStreet} onto ${m.toStreet}`))}).` : ''}`, '', '```', l.link, '```', '');
  L.push('## Interior runs', '', '| Street | Links | Touches | Through |', '| --- | ---: | --- | --- |');
  for (const r of a.runs) L.push(`| ${r.street} | ${r.links} | ${r.touches.join(', ') || 'none'} | ${r.through ? 'yes' : 'no'} |`);
  L.push('', '## Entry movements', '', '| # | From | Kind | Side | Turn | Onto | Base ban | Link item |', '| ---: | --- | --- | --- | --- | --- | --- | --- |');
  for (const m of a.movements) L.push(`| ${m.index} | ${m.fromStreet} (${m.fromClass}) | ${m.fromKind} | ${m.side} | ${m.turn} | ${m.toStreet} (run ${m.run}) | ${m.baseBan} | ${m.encodes ? 'ok' : 'does not decode'} |`);
  return `${L.join('\n')}\n`;
}

async function main() {
  const area = arg('area', 'rockridge');
  const data = resolve(arg('data', join(repoRoot, 'public/data')));
  const out = resolve(arg('out', join(repoRoot, 'target/turn-bans')));
  const period = arg('period', 'pm_peak');
  const rankedFile = arg('ranked', '');
  const files = await loadAreaFiles(data, area);
  const net = files.network;
  const a = analyze(net, period);
  const note: string[] = [];
  let ranked: ReturnType<typeof rankFromLinks>['ranked'] = [];
  if (rankedFile) {
    const r = rankFromLinks(net, parseSinglesLog(readFileSync(resolve(rankedFile), 'utf8')));
    ranked = r.ranked;
    note.push(`Top-k packages are ranked by ${rankedFile} (the turn-ban rows of \`explore --check-singles\`, in candidate order): ${r.ranked.length} ranked, ${r.unmatched.length} not decodable here.`);
  } else {
    note.push('No top-k packages: they need the ranked turn-ban candidates from `explore --check-singles` (pass `--ranked FILE`); the proposal report lists the candidates by name only.');
  }
  const pk = buildPackages(a, ranked, undefined, { net, period });
  const rows = pk.map((p) => ({ p, l: packageLink(net, p, period) }));
  for (const { p, l } of rows) if (!l.roundTrip) console.error(`warning: ${p.id}: ${l.problem}`);
  mkdirSync(out, { recursive: true });
  const json = {
    area, period, hashes: files.hashes, boundingStreets: a.boundingStreets, runs: a.runs, skipped: a.skipped, movements: a.movements,
    packages: rows.map(({ p, l }) => ({
      id: p.id, title: p.title, note: p.note, bans: p.movements.length, link: l.link, items: l.items, roundTrip: l.roundTrip, problem: l.problem ?? null,
      from: countBy(p.movements, (m) => m.boundingStreet ?? `${m.fromStreet} (outside)`), onto: countBy(p.movements, (m) => m.toStreet),
      byTurn: countBy(p.movements, (m) => m.turn), movements: p.movements.map((m) => m.index), exempt: (p.exempt ?? []).map((m) => m.index),
    })),
  };
  writeFileSync(join(out, 'packages.json'), `${JSON.stringify(json, null, 1)}\n`);
  writeFileSync(join(out, 'packages.md'), markdown(a, files.hashes, rows, note));
  writeFileSync(join(out, 'packages.tsv'), rows.map(({ p, l }) => `${p.id}\t${p.movements.length}\t${l.link}`).join('\n') + '\n');
  console.log(`${a.movements.length} entry movements (${a.movements.filter((m) => m.baseBan !== 'none').length} already banned in the base network, ${a.movements.filter((m) => !m.encodes).length} that do not round-trip); bounding streets: ${a.boundingStreets.join(', ')}`);
  for (const { p, l } of rows) console.log(`${p.id}\t${p.movements.length} bans\tfrom ${list(countBy(p.movements, (m) => m.boundingStreet ?? `${m.fromStreet} (outside)`))}\tonto ${list(countBy(p.movements, (m) => m.toStreet))}${l.roundTrip ? '' : `\tPROBLEM ${l.problem}`}`);
  console.log(`wrote ${out}/packages.{json,md,tsv}`);
  if (rows.some(({ l }) => !l.roundTrip)) process.exit(1);
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(e?.code ?? 1); });
