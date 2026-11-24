# Cap turn bans: laptop runbook

Base: the branch `cap-turn-bans` (default `BR`), which the lead session pushes before step A. The model is the published one: network `53c823f20d9165ed`, shipped demand `2d16d8f8eb0950ca`, simulator `6b886c8f52ee07397773ddd0ebbcb447` (this change touches only `crates/sim/src/explore/`, `bin/`, tests, tools, docs and openspec, outside the fingerprint), baseline 522.5 through cars an hour. The seeds file is `1e837cb5ccb4346d` (`EXP_SEEDS` in `laptop/env.zsh`; the lead confirms it). The proposals file is not a gate: the lead republishes a trimmed one before the run and the search replaces it.

What the run does: the published search command of round 52 plus `--ban-sets --max-turn-bans 5`, with all six objectives active. A package holds at most 5 individual turn bans (project lead, 2026-11-23; `design.md` D1). It writes the real `public/data/rockridge.proposals.json`, `data/proposals/rockridge.md` and `data/proposals/rockridge.seeds.json` in the laptop worktree only, then the redistribution and the stored results, verifies the list and packs everything for the dev branch. The lead session does the data push after reading the headline table.

The command the search runs, in the worktree:

```
target/release/explore --area rockridge --periods pm_peak,am_peak,midday --seeds 1-3 --confirm-seeds 101-110 --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs 12 --ban-sets --max-turn-bans 5
```

Never: push to `main`, `npm run data:push`, a request to `https://traffic.transit.directory/api/*`, an upload token or any secret in a message or a file, `npm run deploy`, a change to the published local data in `BATCH` (it is only read), a threshold in `design.md`. The scripts hold the worktree `traffic-cap` and write nothing outside it except the pack step's commit on the dev branch `salvatoret/peaceful-fermi-dlwt0u`.

## Steps

`MAIN` is the checkout whose `node_modules` the worktree links to (default: the checkout you run from). `BATCH` is the worktree that holds the published `public/data` (default `${MAIN}/.claude/worktrees/batch`). Quote any argument that holds a link: links contain `#`, `;` and `~`, which zsh reads as syntax. Every script writes its log to `target/cap-bans/chain.log` in the worktree and stops on the first mismatch, saying why. If the SSH agent is locked, `a.zsh` and `pack.zsh` give `git fetch` and `git push` 60 seconds, then retry over HTTPS with the `gh` login (the lesson of the run of 2026-11-22). Step A copies the humanizer skill from `MAIN` or `BATCH` and does not run `npm install`.

| Step | Command | Wall time |
| --- | --- | --- |
| A. Worktree, gates, build, tests, ban-set list | `MAIN=... BATCH=... zsh openspec/changes/cap-turn-bans/laptop/a.zsh` | about 12 min: build 4, Rust tests 4, TypeScript tests 2, rest under 2 |
| B. The search, writing the real files in the worktree | `W=... zsh openspec/changes/cap-turn-bans/laptop/b.zsh` | about 40 min (30 to 60); the search of 2026-11-22 took 36 |
| C. Redistribution, stored results | `W=... zsh openspec/changes/cap-turn-bans/laptop/c.zsh` | about 15 min (10 to 40); results about 2 |
| D. Verification and the headline table | `W=... zsh openspec/changes/cap-turn-bans/laptop/verify.zsh` | seconds |
| E. Pack for the dev branch | `W=... DEV=... zsh openspec/changes/cap-turn-bans/laptop/pack.zsh [--no-push]` | about 1 min |

A to E: about 1 hour 10 minutes, range 1 hour to 2 hours. Run them in order and stop at the first failure. `SMOKE=1 zsh .../b.zsh` shrinks the search to a few minutes to test the scripts; do not use it for the real run.

1. **A** checks the network and demand hashes in `BATCH`, fetches the branch, makes the worktree, copies the ignored data and keeps a copy of the published files in `target/cap-bans/published/`, requires the seeds file hash, builds the release binaries and requires the fingerprint, runs `npm run check:wasm`, `cargo test --release -p traffic-sim`, `npx vitest run tools/ worker/ src` and the typecheck, then lists the ban-set candidates under the cap (`explore --ban-sets --max-turn-bans 5 --list-ban-sets`) and requires that none holds more than 5 bans and that the ids, counts and labels equal `laptop/expected-sets.tsv`: the 21 sets of the run of 2026-11-22 that hold at most 5 bans. The `top-2` to `top-5` sets are built from the baseline ranking during the search and are not in this list.
2. **B** raises the `cap` of the seeds file in the worktree, logs how many known packages hold more than 5 bans (they are skipped), checks that the flags equal round 52's apart from files, `--jobs`, `--ban-sets` and `--max-turn-bans`, and runs the command above. The pictures for the cards come with it.
3. **C** empties `public/data/results` and `public/data/redistribution` in the worktree, runs `npm run data:redistribution -- --jobs 12` and `npm run data:results -- --jobs 4`.
4. **D** runs `scripts/verify.cjs` and writes `target/cap-bans/headline.md`. It checks: the file version, the option count (3 to 7), the three provenance hashes and the fingerprint on every group, the cap recorded in `computed.turnBanCap`, the confirmation seeds 101 to 110, no rejected option, every option confirmed with a resident detour and a picture, no option with more than 5 turn bans (in the file and in its link), each objective tag that appears on exactly one option, and the no-ban tags consistent with the list (both on one option each when some option holds a ban, neither when none does). It looks for the six-change package of `laptop/old-p1.link`: when it is listed it must hold no ban and reproduce 135.7 through cars an hour within one car, and when it is not listed that is a NOTE and not a failure. It checks that every option has a redistribution file and three stored result files, and that no link appears twice. The table keeps the columns of the earlier run: option, interventions, count, bans, closures, through cars with interval, by period, worst all-traffic block, worst through block, residents, tags.
5. **E** packs the data files and the evidence as gzip parts of at most 190,000 bytes with `FILES.txt` and `SHA256SUMS`, checks the round trip, and with no `--no-push` commits them on the dev branch (`DEV` must be on `salvatoret/peaceful-fermi-dlwt0u`; never `main`) under `openspec/changes/cap-turn-bans/evidence/laptop-publish/` and pushes that branch only, with an unsigned commit. It refuses to pack when D failed unless `FORCE=1`.

## What to report

From `target/cap-bans/chain.log` and `headline.md`: any stop; the headline table as it is; in words, the top option, whether any option holds turn bans and how many, the options tagged `no-turn-bans` and `most-removed-no-turn-bans` (or that neither is listed), whether the old six-change package is listed and its figure, the known-package lines (how many were skipped over the cap), the `top-2` to `top-5` candidates in `search.log` and what became of them, and the wall time of each step against the table above.

## Limits

A ban applies to every vehicle in every period and full compliance is an ASSUMPTION; the model is not calibrated; the intervals cover seed variability only. The cap of 5 is the project lead's judgment, not a model result. If the list differs from the run of 2026-11-22 beyond the removal of the 41-ban options, that is reported, not hidden.
