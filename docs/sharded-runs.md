# Sharded batch runs

A heavy batch can be split across separate cloud sessions (children, each a fresh clone of `main` with four cores) and merged in the lead session. `npm run shard` moves the inputs and the results through the data bucket, under `jobs/<job-id>/`, using the site's authenticated upload endpoint. Nothing under `jobs/` is served at `/data`. The credential is added by the session's network proxy, so no token is kept in a variable or a file. Every command that talks to the bucket needs:

```sh
export NODE_USE_ENV_PROXY=1 TRAFFIC_UPLOAD_URL=<site>
```

Results are only mergeable when every shard ran the same simulator on the same inputs. `inputs push` records the SHA-256 of each input file, of the git-tracked files the runs read, the simulator fingerprint of the lead's build and its git revision. Children and the merge check against that record and stop with a message that names the difference.

## Lead, before the children start

1. Commit and push `main`, including any change to the simulator sources, targets, stations, demand config, area config and the proposal seeds. Children clone `main`, so an uncommitted engine change gives them another fingerprint. `inputs push` refuses when `crates/`, `Cargo.toml` or `Cargo.lock` have uncommitted changes.
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

The search is one shard. It is a single run, so it is started once and left in the background; there is no resume, and `--budget-evals` bounds its length. The run searches on seeds 1 to 3 and then confirms the frozen shortlist on ten seeds that took no part in the search, both inside the one process. Those are the defaults, so the arguments only name the area and periods.

```sh
nohup npm run shard -- explore run --job r2 --shard search -- \
  --area rockridge --periods pm_peak,am_peak --seeds 1-3 \
  --confirm-seeds 101-110 --jobs 4 > shard-search.log 2>&1 &
```

Everything after `--` goes to `target/release/explore`. The shard tool sets `--out`, `--report` and `--known` to shard-local copies (under `target/shard/<job>/<shard>/explore/`) so the repository files are untouched, and refuses `--profiles`, `--references` and the modes that are not a search (`--check`, `--add-seed`, `--annotate`). It uploads the group the run wrote, the report and the seeds file, after checking that each group carries the job's network hash, demand hash and simulator fingerprint.

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
npm run shard -- explore fetch --job r2 --shards search
```

The merge writes the produced list to `public/data/<area>.proposals.json` (version 5) in place of what was there, replaces `data/proposals/<area>.md`, and adds the shards' search options to `data/proposals/<area>.seeds.json` by running `explore --seed-proposals`, which applies the seeds file's own dedupe and cap. An option already in the seeds file keeps its earlier figures and dates; a search run on one machine would refresh them. It refuses a list produced by two shards and any difference in network hash, demand hash, simulator fingerprint or reporting-method version, and writes nothing in that case. Commit the report and the seeds file, then continue with the usual data steps (`data:results`, `data:llms`, `data:previews`, `data:push`).

## Benchmark cases

The proposal-search benchmark (`data/search-benchmark/README.md`) runs one case per shard. The inputs are the search's, so push them with `--for explore`:

```sh
npm run shard -- inputs push --job sb1 --for explore                    # lead
nohup npm run shard -- benchmark run --job sb1 --shard pm \
  --case data/search-benchmark/colby-north-pm.json --jobs 4 --confirm > shard-pm.log 2>&1 &   # child
npm run shard -- benchmark fetch --job sb1 --shards pm,am,second         # lead
```

`benchmark run` calls `target/release/search_bench table` (and `confirm` with `--confirm`) on shard-local files under `target/shard/<job>/<shard>/benchmark/`, which keep their checkpoints: run the same command again after a restart and it continues. It uploads the results only after checking that they carry the job's simulator fingerprint, network and demand hashes and the case file's hash. `benchmark fetch` downloads every shard's files, checks them against their index and the job again, refuses a case run by two shards, and writes nothing when a check fails; the default destination is `target/benchmark/<job>/`. A case table is about 65,000 simulated minutes, so on a four-core child it takes several hours.

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

The search is one shard on one machine. Its confirmation runs use its own cores, so give it `--jobs` for the whole machine.
