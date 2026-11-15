# Sharded batch runs

A heavy batch can be split across separate cloud sessions (children, each a fresh clone of `main` with four cores) and merged in the lead session. `npm run shard` moves the inputs and the results through the data bucket, under `jobs/<job-id>/`, using the site's authenticated upload endpoint. Nothing under `jobs/` is served at `/data`. The credential is added by the session's network proxy, so no token is kept in a variable or a file. Every command that talks to the bucket needs:

```sh
export NODE_USE_ENV_PROXY=1 TRAFFIC_UPLOAD_URL=<site>
```

Results are only mergeable when every shard ran the same simulator on the same inputs. `inputs push` records the SHA-256 of each input file, of the git-tracked files the runs read, the simulator fingerprint of the lead's build and its git revision. Children and the merge check against that record and stop with a message that names the difference.

## Lead, before the children start

1. Commit and push `main`, including any change to the simulator sources, targets, stations, demand config, area config and proposal profiles or seeds. Children clone `main`, so an uncommitted engine change gives them another fingerprint. `inputs push` refuses when `crates/`, `Cargo.toml` or `Cargo.lock` have uncommitted changes.
2. Build everything the batch uses, including the training-view demand the held-out stations are scored on:

   ```sh
   cargo build --release -p traffic-sim --bins
   npm run data:cv            # target/validation/<area>.demand.json, if it is not current
   ```

3. Upload the inputs under a new job id (`--for assess` or `--for explore` uploads only what that batch reads; the default is both):

   ```sh
   npm run shard -- inputs push --job r1
   ```

   A job id cannot be reused: shards of one job must share its inputs. `--replace` overwrites a job nobody has started.

## Child, from a fresh clone

```sh
npm install
cargo build --release -p traffic-sim --bins        # a few minutes
export NODE_USE_ENV_PROXY=1 TRAFFIC_UPLOAD_URL=<site>
npm run shard -- inputs pull --job r1
```

`inputs pull` writes the files to their repository paths, checks each hash, checks the git-tracked inputs, and fails when the build's fingerprint is not the job's. It does not replace a local file that differs unless you give `--force`. `npm run shard -- inputs verify --job r1` repeats the checks without downloading.

Run the slice in the background and poll, so no single command comes near a two-hour limit and a dropped terminal does not end it:

```sh
nohup npm run shard -- assess run --job r1 --shard s1 --view shipped \
  --periods am_peak,midday,pm_peak --seeds 1-3 > shard-s1.log 2>&1 &
tail -n 5 shard-s1.log
```

`assess run` calls `calibrate` exactly as `tools/assess.ts` does (`--minutes 60 --scale 1 --jobs 4 --keep-seeds`; `--view cv` adds the cross-validation demand and skips the periods that have no counts of their own, which is `midday`). It checks every report against the job before it uploads, and uploads each period as soon as it is done, together with an index. If the session restarts, run the same command again: the reports that are already there and still valid are not run again, and `--fresh` starts over. The shard is marked complete when its last period is uploaded.

A search shard is one profile. The search itself is one run, so it is started once and left in the background; there is no resume, and `--budget-evals` bounds its length. Confirmation happens inside the run after the shortlist is frozen, so `--confirm-seeds` goes in the explore arguments.

```sh
nohup npm run shard -- explore run --job r2 --shard charter -- \
  --area rockridge --periods pm_peak,am_peak --seeds 1-10 --profile charter \
  --confirm-seeds 101-110 --jobs 4 > shard-charter.log 2>&1 &
```

Everything after `--` goes to `target/release/explore`. The shard tool sets `--out`, `--report` and `--known` to shard-local copies (under `target/shard/<job>/<shard>/explore/`) so the repository files are untouched, and refuses `--profiles`, `--references` and the modes that are not a search (`--check`, `--add-seed`, `--annotate`). It uploads the groups the run wrote, the report and the seeds file, after checking that each group carries the job's network hash, demand hash and simulator fingerprint.

## Lead, after the shards finish

Assessment:

```sh
npm run shard -- inputs verify --job r1        # the lead's own files still match the job
npm run shard -- assess fetch --job r1 --shards s1,s2,s3,s4,s5,s6
npm run assess -- --reuse target/assess-seeds/shard-r1 --publish --noise
```

`assess fetch` takes `--periods` (default `am_peak,midday,pm_peak`), `--seeds` (default `1-10`), `--views` (default `shipped,cv`), `--minutes` (default 60) and `--dest`. It succeeds only when every period, seed and view appears exactly once, every report carries the job's fingerprint, input hashes and run settings, and the assessment's own run-set checks pass. Shipped runs go to the directory and cross-validation runs to the same name with `-cv`, which is the layout `--reuse` reads. It prints the `npm run assess` command to run next. Nothing is written when a check fails. `tools/assess.ts` then checks the runs against the files on disk again.

Search:

```sh
npm run shard -- explore fetch --job r2 --shards charter,unconstrained
```

The merge replaces or adds the produced groups in `public/data/<area>.proposals.json` (version 5, groups in the order of the profiles file, other groups kept), replaces the matching sections of `data/proposals/<area>.md`, and adds the shards' search options to `data/proposals/<area>.seeds.json` by running `explore --seed-proposals`, which applies the seeds file's own dedupe and cap. An option already in the seeds file keeps its earlier figures and dates; a search run on one machine would refresh them. It refuses a group produced by two shards and any difference in network hash, demand hash, simulator fingerprint or reporting-method version, and writes nothing in that case. A group kept from before that differs from the new ones is reported as a warning. Commit the report and the seeds file, then continue with the usual data steps (`data:results`, `data:llms`, `data:previews`, `data:push`).

## Suggested shards

At 60 minutes one `calibrate` seed run takes about 30 seconds on one core, so the whole assessment fits one four-core machine in a few minutes; sharding pays off for longer runs. With six children:

| Shard | View | Periods | Seeds | Runs |
| --- | --- | --- | --- | --- |
| s1 | shipped | am_peak,midday,pm_peak | 1-3 | 9 |
| s2 | shipped | am_peak,midday,pm_peak | 4-6 | 9 |
| s3 | shipped | am_peak,midday,pm_peak | 7-9 | 9 |
| s4 | shipped | am_peak,midday,pm_peak | 10 | 3 |
| s5 | cv | am_peak,pm_peak | 1-5 | 10 |
| s6 | cv | am_peak,pm_peak | 6-10 | 10 |

For the search, run one profile per child (`charter`, and the unconstrained group by leaving out `--profile`), each with `--confirm-seeds 101-110`. A profile warm-starts from the other groups of the proposals file that was pushed with the job. Two parallel shards do not warm-start from each other. To keep that, run `charter` first, merge it, and push a new job for the unconstrained shard.
