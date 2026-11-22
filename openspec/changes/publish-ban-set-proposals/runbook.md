# Publish ban-set proposals: laptop runbook

Base: the branch `publish-ban-set-proposals` (default `BR`), which the lead session has to push before step A; the container that wrote it did not push. The model is the published one: network `53c823f20d9165ed`, shipped demand `2d16d8f8eb0950ca`, proposals file `c5cbe25f39e61414`, seeds file `e464cc90ca3e1472`, simulator `6b886c8f52ee07397773ddd0ebbcb447` (this change touches only `crates/sim/src/explore/` and `bin/`, outside the fingerprint), baseline 522.5 through cars an hour.

What the run does: the published search command of round 52 plus `--ban-sets`, with the new objective `no-turn-bans` active (it is in `--objectives all`, the default). It writes the real `public/data/rockridge.proposals.json`, `data/proposals/rockridge.md` and `data/proposals/rockridge.seeds.json` in the laptop worktree only, then the redistribution and the stored results, verifies the list and packs everything for the dev branch. The decision to publish both families was made by the project lead on 2026-11-22 (`design.md`); the lead session does the data push after reading the headline table.

Never: push to `main`, `npm run data:push`, a request to `https://traffic.transit.directory/api/*`, an upload token or any secret in a message or a file, `npm run deploy`, a change to the published local data in `BATCH` (it is only read), a threshold in `design.md`. The scripts hold the worktree `traffic-pub` and write nothing outside it except the pack step's commit on the dev branch.

## Steps

`MAIN` is the checkout whose `node_modules` the worktree links to (default: the checkout you run from). `BATCH` is the worktree that holds the published `public/data` (default `${MAIN}/.claude/worktrees/batch`). Quote any argument that holds a link: links contain `#`, `;` and `~`, which zsh reads as syntax. Every script writes its log to `target/publish-bs/chain.log` in the worktree and stops on the first mismatch, saying why. If the SSH agent is locked, `a.zsh` and `pack.zsh` give `git fetch` and `git push` 60 seconds, then retry over HTTPS with the `gh` login (the lesson of the run of 2026-11-22).

| Step | Command | Wall time |
| --- | --- | --- |
| A. Worktree, gates, build, tests, ban-set list | `MAIN=... BATCH=... zsh openspec/changes/publish-ban-set-proposals/laptop/a.zsh` | about 12 min: build 4, Rust tests 4, TypeScript tests 2, rest under 2 |
| B. The search, writing the real files in the worktree | `W=... zsh openspec/changes/publish-ban-set-proposals/laptop/b.zsh` | about 45 min (35 to 65); the search of 2026-11-22 took 36 |
| C. Redistribution, stored results | `W=... zsh openspec/changes/publish-ban-set-proposals/laptop/c.zsh` | about 20 min (10 to 45); redistribution is the unknown, results about 2 |
| D. Verification and the headline table | `W=... zsh openspec/changes/publish-ban-set-proposals/laptop/verify.zsh` | seconds |
| E. Pack for the dev branch | `W=... DEV=... zsh openspec/changes/publish-ban-set-proposals/laptop/pack.zsh [--no-push]` | about 1 min |

A to E: about 1 hour 20 minutes, range 1 hour to 2 hours. Run them in order and stop at the first failure. `SMOKE=1 zsh .../b.zsh` shrinks the search to a few minutes to test the scripts; do not use it for the real run.

1. **A** checks the published hashes in `BATCH`, fetches the branch, makes the worktree, copies the ignored data and keeps a copy of the published files in `target/publish-bs/published/`, builds the release binaries and requires the fingerprint, runs `npm run check:wasm`, `cargo test --release -p traffic-sim`, `npx vitest run tools/ worker/ src` and the typecheck, then lists the ban-set candidates (`explore --list-ban-sets`) and requires the ids, counts and labels of `laptop/expected-sets.tsv`.
2. **B** raises the `cap` of the seeds file in the worktree, adds the hand packages `left-turns` and `all-turns-access` (one ban-set intervention each), checks that the flags equal round 52's apart from files, `--jobs` and `--ban-sets`, and runs `explore --area rockridge --periods pm_peak,am_peak,midday --seeds 1-3 --confirm-seeds 101-110 --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs 12 --ban-sets`. The pictures for the cards come with it.
3. **C** empties `public/data/results` and `public/data/redistribution` in the worktree, runs `npm run data:redistribution -- --jobs 12` and `npm run data:results -- --jobs 4`.
4. **D** runs `scripts/verify.cjs` and writes `target/publish-bs/headline.md`. It checks: the file version, the option count (4 to 7), the three provenance hashes and the fingerprint on every group, the confirmation seeds 101 to 110, the `no-turn-bans` objective in the list, no rejected option, every option confirmed with a resident detour and a picture, exactly one option tagged `no-turn-bans`, that it holds no turn ban, that its interventions equal the old p1's (`laptop/old-p1.link`) and that its through cars an hour reproduce 135.7 within one car. It notes whether left turns alone (21 bans) stayed in the list. It then checks that stored results cover every proposal and period.
5. **E** packs the data files and the evidence as gzip parts of at most 190,000 bytes with `FILES.txt` and `SHA256SUMS`, checks the round trip, and with no `--no-push` commits them on the branch `DEV` is on (never `main`) and pushes that branch only. It refuses to pack when D failed unless `FORCE=1`.

## What to report

From `target/publish-bs/chain.log` and `headline.md`: any stop; the headline table as it is; in words, the top option, the option tagged `no-turn-bans` and whether it equals the old p1 and reproduces 135.7, the options that hold a ban set, whether left turns alone stayed, the known-package lines, and the wall time of each step against the table above.

## Limits

A ban applies to every vehicle in every period and full compliance is an ASSUMPTION; the model is not calibrated; the intervals cover seed variability only. If the search returns a different list than the run of 2026-11-22 apart from the added filter-only option, that is expected to be small noise from the extra beam; a different top option is reported, not hidden.
