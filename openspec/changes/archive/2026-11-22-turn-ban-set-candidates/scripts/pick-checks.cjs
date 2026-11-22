// Chooses what c.zsh checks with `explore --check` on the confirmation seeds: published p1 (the reference), the search's first three options that hold a ban set, and the hand
// combinations of a ban set with filters taken from p1. Prints `id<TAB>link` for each and writes `checks.json` (id, title, link, the counts the summary needs).
//   node pick-checks.cjs --search target/ban-sets/proposals.json --sets target/ban-sets/sets.json --published public/data/rockridge.proposals.json --out target/ban-sets/checks.json
// A hand combination is written even when the search listed the same package, so every figure comes from the same method (confirmation seeds, a check's recheck); the note says so.
// Every filter is found in p1 by its label, so no place is named here beyond the three the project lead asked about: the Forest Street filter and the two 63rd Street filters of p1.
const fs = require('fs');

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };
const search = JSON.parse(fs.readFileSync(opt('search', 'target/ban-sets/proposals.json'), 'utf8'));
const sets = JSON.parse(fs.readFileSync(opt('sets', 'target/ban-sets/sets.json'), 'utf8'));
const published = JSON.parse(fs.readFileSync(opt('published', 'public/data/rockridge.proposals.json'), 'utf8'));
const outFile = opt('out', 'target/ban-sets/checks.json');

const items = (link) => (link.split(';').find((t) => t.startsWith('s=')) ?? 's=').slice(2).split('~').filter(Boolean);
const header = (link) => link.split(';').filter((t) => !t.startsWith('s=')).join(';');
const key = (link) => items(link).sort().join('~');
const code = (item) => item.split(',')[0];
const counts = (link) => {
  const its = items(link);
  return { items: its.length, bans: its.filter((i) => code(i) === 'tb').length, closures: its.filter((i) => ['mf', 'mn', 'dd'].includes(code(i))).length };
};

const p1 = published.groups[0].proposals.find((p) => p.id === 'p1');
if (!p1) { console.error('no p1 in the published proposals file'); process.exit(1); }
const p1Items = items(p1.link);
if (p1Items.length !== p1.interventions.length) { console.error('p1 has a different number of link items and interventions'); process.exit(1); }
const p1Item = (re) => {
  const hits = p1.interventions.map((iv, i) => (re.test(iv.label) ? p1Items[i] : null)).filter(Boolean);
  if (hits.length === 0) { console.error(`no intervention of p1 matches ${re}`); process.exit(1); }
  return hits;
};
const forest = p1Item(/^Modal filter on Forest Street at Ayala Avenue/);
const r63 = p1Item(/^Modal filter at 63rd Street & (Colby Street|Hillegass Avenue)$/);
if (r63.length !== 2) { console.error('expected two 63rd Street filters in p1'); process.exit(1); }

const set = (id) => { const s = sets.sets.find((x) => x.id === id); if (!s) { console.error(`no ban set ${id}`); process.exit(1); } return s; };
const header0 = header(p1.link);
const make = (id, title, parts, note) => {
  const link = `${header0};s=${parts.flatMap((p) => (Array.isArray(p) ? p : items(p))).join('~')}`;
  return { id, title, link, note, ...counts(link) };
};
const out = [];
out.push({ id: 'p1', title: 'Published p1', link: p1.link, note: 'the like-for-like reference', ...counts(p1.link) });

const hasSet = (p) => (p.interventions ?? []).some((iv) => iv.type === 'ban_set');
const g = search.groups?.[0];
const mine = (g?.proposals ?? []).filter((p) => p.kind === 'search' && hasSet(p)).slice(0, 3);
mine.forEach((p, i) => out.push({ id: `search-set-${i + 1}`, title: `Search option ${p.id} with a ban set: ${p.title}`, link: p.link, note: `option ${p.id} of the search with --ban-sets`, ...counts(p.link) }));
if (mine.length === 0) console.error('the search has no option that holds a ban set');

const left = set('left-turns'), access = set('all-turns-access');
const combos = [
  make('left-turns', 'All left turns alone', [left.link], 'the 21 left-turn bans, no other change'),
  make('left-turns+forest-filter', 'All left turns and the modal filter on Forest Street at Ayala Avenue', [left.link, forest], 'p1\'s Forest Street filter'),
  make('left-turns+63rd-filters', 'All left turns and the two 63rd Street filters of p1', [left.link, r63], 'p1\'s two 63rd Street filters'),
  make('all-turns-access+forest-filter', 'All turns (access-safe) and the modal filter on Forest Street at Ayala Avenue', [access.link, forest], 'p1\'s Forest Street filter'),
];
const listed = new Set((g?.proposals ?? []).map((p) => key(p.link)));
for (const c of combos) { c.note += listed.has(key(c.link)) ? '; the search also published this package' : '; not among the search\'s options'; out.push(c); }

fs.writeFileSync(outFile, JSON.stringify({ checks: out }, null, 1) + '\n');
for (const c of out) console.log(`${c.id}\t${c.link}`);
