# Proposal-search benchmark

Finite-space benchmark of the proposal search (change `improve-proposal-search-coverage`; design D6 to D10 hold the method and the frozen comparison protocol). Each case file freezes a small candidate set, a depth and the runs to make. `search_bench table` simulates every conflict-free package of the case once per run setting and writes one results file. Every search method is then replayed against that table, so comparing methods needs no further simulation.

| File | What |
| --- | --- |
| `colby-north-pm.json` | The 2026-11-17 audit's twelve candidates, PM peak. Development case |
| `colby-north-am.json` | The same candidates, AM peak. Held out |
| `second-cluster-pm.json` | Twelve candidates around Ayala/Forest and Colby, PM peak, chosen by `select-cluster.py`. Held out |
| `select-cluster.py` | The structural rule that chose the second cluster from a coverage report |

Results are large and stay out of git: put them under `target/benchmark/`.

## Run the cases (12-core machine)

From a clone of `main` at or after the commit that froze the protocol:

```sh
npm install
npm run data:download
cargo build --release -p traffic-sim --bin search_bench
for c in colby-north-pm colby-north-am second-cluster-pm; do
  target/release/search_bench describe --case data/search-benchmark/$c.json | grep -E '"(inputsMatchCase|legal)"'
done
```

Each case should print `"inputsMatchCase": true`. If it prints `false`, the published data has changed since the case was frozen; the run still works, and its results are labeled as current-input results, separate from the frozen ones.

Then run the tables and the confirmations. Run it in the background; if the machine stops, run the same command again and it continues from its checkpoints:

```sh
mkdir -p target/benchmark
nohup sh -c 'for c in colby-north-pm colby-north-am second-cluster-pm; do
  target/release/search_bench table --case data/search-benchmark/$c.json --out target/benchmark/$c.results.json --jobs 10 &&
  target/release/search_bench confirm --case data/search-benchmark/$c.json --results target/benchmark/$c.results.json --out target/benchmark/$c.confirm.json --jobs 10
done' > target/benchmark/run.log 2>&1 &
tail -n 3 target/benchmark/run.log
```

Each table is about 65,000 simulated minutes (69,000 for the second cluster). On a 12-core machine at `--jobs 10` that is roughly an hour per case; each confirmation adds a few minutes. The outputs are, per case, `<case>.results.json` (about 3 MB), `<case>.confirm.json` and `<case>.confirm.shortlist.json`. The `*.partial.jsonl` checkpoints can be deleted once the results file exists.

`confirm` first writes the frozen shortlist (`<case>.confirm.shortlist.json`) from the table by the preregistered rule, then runs it with the baseline on seeds 301 to 310. It refuses to replace a shortlist file with a different one.

The same runs can go through the bucket instead, one shard per case, with the checks of `docs/sharded-runs.md`:

```sh
npm run shard -- inputs push --job sb1 --for explore                     # lead
npm run shard -- benchmark run --job sb1 --shard pm --case data/search-benchmark/colby-north-pm.json --jobs 10 --confirm
npm run shard -- benchmark fetch --job sb1 --shards pm,am,second         # lead
```

## Analyze and decide (any machine, no simulation)

```sh
for c in colby-north-pm colby-north-am second-cluster-pm; do
  target/release/search_bench verify  --case data/search-benchmark/$c.json --results target/benchmark/$c.results.json
  target/release/search_bench analyze --case data/search-benchmark/$c.json --results target/benchmark/$c.results.json --out target/benchmark/$c.analysis.json
done
target/release/search_bench decide --development colby-north-pm \
  --analyses target/benchmark/colby-north-pm.analysis.json,target/benchmark/colby-north-am.analysis.json,target/benchmark/second-cluster-pm.analysis.json \
  --confirm target/benchmark/colby-north-pm.confirm.json,target/benchmark/colby-north-am.confirm.json,target/benchmark/second-cluster-pm.confirm.json \
  --out target/benchmark/decision.json
```

## Diagnostics

- `search_bench coverage --case FILE` runs one baseline with select-link records and reports, for each case candidate, whether the production generator offers it and why not, plus what the bypass supplement adds (`--locations`, default 40).
- `search_bench evidence --case colby-north-pm.json --projection <change>/evidence/screen-results.projection.json` replays the production beam on the audit's frozen screening table and checks its visited sequences and finalists.
- `search_bench evidence-methods --case colby-north-pm.json --projection ...` replays every method on the audit's screening table (screening measures only).
- `search_bench spot --case colby-north-pm.json --projection ... --sets 1.7.9,2.4.5` reruns a few of the audit's packages and compares the numbers.
- `search_bench reproduce --case colby-north-pm.json --partial target/benchmark/colby-north-pm.results.partial.jsonl --projection ...` compares the whole first screening setting with the audit once the table has run it.
