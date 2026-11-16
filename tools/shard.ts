// Splits heavy simulation batches across cloud machines and merges the results (change sharded-batch-runs). Inputs and outputs travel through the data bucket under
// `jobs/<job>/` using the site's authenticated upload endpoint (TRAFFIC_UPLOAD_URL; the session's network proxy adds the credential). See docs/sharded-runs.md.
//   npx tsx tools/shard.ts inputs push   --job ID [--for assess|explore|all] [--allow-dirty] [--replace]        (lead)
//   npx tsx tools/shard.ts inputs pull   --job ID [--force]                                                     (child)
//   npx tsx tools/shard.ts inputs verify --job ID                                                               (any: local check only)
//   npx tsx tools/shard.ts assess run    --job ID --shard NAME --view shipped|cv --periods a,b --seeds 1-3 [--minutes 60] [--jobs 4] [--fresh]
//   npx tsx tools/shard.ts assess fetch  --job ID --shards a,b,c [--periods ...] [--seeds 1-10] [--views shipped,cv] [--minutes 60] [--dest DIR] [--force]
//   npx tsx tools/shard.ts explore run   --job ID --shard NAME -- <explore arguments>
//   npx tsx tools/shard.ts explore fetch --job ID --shards a,b [--out FILE] [--no-seeds] [--no-report]
// Every command takes --area (default rockridge) and --root DIR (a repository root other than this one, for tests).
import { resolve } from 'node:path';
import { assessFetch, assessRun, DEFAULT_PERIODS, type View } from './lib/shard-assess';
import { exploreFetch, exploreRun } from './lib/shard-explore';
import { loadManifest, pullInputs, pushInputs, verifyLocal, type Ctx, type Only } from './lib/shard-inputs';
import { checkName, httpStore } from './lib/shard-store';

const FLAGS = new Set(['--allow-dirty', '--replace', '--force', '--fresh', '--no-seeds', '--no-report']);

function parse(argv: string[]) {
  const dd = argv.indexOf('--');
  const head = dd >= 0 ? argv.slice(0, dd) : argv;
  const rest = dd >= 0 ? argv.slice(dd + 1) : [];
  const pos: string[] = [], opt = new Map<string, string>(), flag = new Set<string>();
  for (let i = 0; i < head.length; i++) {
    const a = head[i];
    if (!a.startsWith('--')) pos.push(a);
    else if (FLAGS.has(a)) flag.add(a);
    else { const v = head[i + 1]; if (v === undefined || v.startsWith('--')) throw new Error(`${a} needs a value`); opt.set(a, v); i++; }
  }
  return { pos, opt, flag, rest };
}

const list = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

async function main(argv: string[]): Promise<void> {
  const { pos, opt, flag, rest } = parse(argv);
  const need = (k: string): string => { const v = opt.get(k); if (!v) throw new Error(`${k} is required`); return v; };
  const root = opt.has('--root') ? resolve(opt.get('--root')!) : resolve(import.meta.dirname, '..');
  const area = opt.get('--area') ?? 'rockridge';
  const known = ['--root', '--area', '--job', '--for', '--shard', '--shards', '--view', '--views', '--periods', '--seeds', '--minutes', '--jobs', '--dest', '--out'];
  for (const k of opt.keys()) if (!known.includes(k)) throw new Error(`unknown option ${k}`);
  const [group, action] = pos;
  const log = (m: string) => console.log(m);
  const make = (): Ctx => ({ root, area, log, env: process.env, store: httpStore(process.env.TRAFFIC_UPLOAD_URL, process.env.TRAFFIC_UPLOAD_TOKEN) });
  const job = () => checkName('job id', need('--job'));
  if (['inputs', 'assess', 'explore'].includes(group ?? '')) job();

  if (group === 'inputs' && action === 'push') {
    const only = (opt.get('--for') ?? 'all') as Only;
    if (!['assess', 'explore', 'all'].includes(only)) throw new Error('--for is assess, explore or all');
    await pushInputs(make(), { job: job(), only, allowDirty: flag.has('--allow-dirty'), replace: flag.has('--replace') });
  } else if (group === 'inputs' && action === 'pull') {
    await pullInputs(make(), { job: job(), force: flag.has('--force') });
  } else if (group === 'inputs' && action === 'verify') {
    const ctx = make();
    const m = await loadManifest(ctx.store, job());
    const problems = verifyLocal(ctx, m);
    if (problems.length) throw new Error(`this checkout does not match job ${m.job}:\n  - ${problems.join('\n  - ')}`);
    log(`job ${m.job}: this checkout matches (simulator ${m.simulator.fingerprint.slice(0, 12)})`);
  } else if (group === 'assess' && action === 'run') {
    const view = need('--view');
    if (view !== 'shipped' && view !== 'cv') throw new Error('--view is shipped or cv');
    await assessRun(make(), { job: job(), shard: need('--shard'), periods: list(need('--periods')), seedSpec: need('--seeds'), view, minutes: Number(opt.get('--minutes') ?? '60'), jobs: opt.get('--jobs') ?? '4', fresh: flag.has('--fresh') });
  } else if (group === 'assess' && action === 'fetch') {
    const views = list(opt.get('--views') ?? 'shipped,cv') as View[];
    if (!views.length || views.some((v) => v !== 'shipped' && v !== 'cv')) throw new Error('--views is shipped, cv or shipped,cv');
    const periods = list(opt.get('--periods') ?? DEFAULT_PERIODS), seedSpec = opt.get('--seeds') ?? '1-10';
    const dest = resolve(root, opt.get('--dest') ?? `target/assess-seeds/shard-${job()}`);
    const r = await assessFetch(make(), { job: job(), shards: list(need('--shards')), periods, seedSpec, views, minutes: Number(opt.get('--minutes') ?? '60'), dest, force: flag.has('--force') });
    const rel = dest.startsWith(`${root}/`) ? dest.slice(root.length + 1) : dest;
    log(`${r.runs} runs are complete and consistent. Next:\n  npm run assess -- --area ${area} --periods ${periods.join(',')} --seeds ${seedSpec}${opt.has('--minutes') ? ` --minutes ${opt.get('--minutes')}` : ''} --reuse ${rel} --publish --noise`);
  } else if (group === 'explore' && action === 'run') {
    if (!rest.length) throw new Error('give the explore arguments after --, for example: explore run --job ID --shard search -- --area rockridge --periods pm_peak,am_peak --seeds 1-3 --confirm-seeds 101-110');
    await exploreRun(make(), { job: job(), shard: need('--shard'), args: rest });
  } else if (group === 'explore' && action === 'fetch') {
    const r = await exploreFetch(make(), { job: job(), shards: list(need('--shards')), out: opt.get('--out') ?? `public/data/${area}.proposals.json`, seeds: !flag.has('--no-seeds'), report: !flag.has('--no-report') });
    log(`merged groups ${r.groups.join(', ')}. Review data/proposals/${area}.md and ${r.seedsMerged ? `data/proposals/${area}.seeds.json` : 'the seeds file (not merged)'}, then commit them; publish the proposals file with the usual data steps.`);
  } else {
    throw new Error('usage: shard <inputs push|pull|verify | assess run|fetch | explore run|fetch> --job ID ... (see the header of tools/shard.ts and docs/sharded-runs.md)');
  }
}

main(process.argv.slice(2)).catch((e: Error) => { console.error(`shard: ${e.message}`); process.exit(1); });
