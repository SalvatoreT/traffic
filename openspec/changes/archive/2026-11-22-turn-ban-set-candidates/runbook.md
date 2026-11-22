# Ban-set candidates runbook: the search with ban sets, on the laptop

Base: the branch `turn-ban-sets-search` (default `BR`), which has to be pushed from the container's checkout before step A; the container did not push. The model is the published one: network `53c823f20d9165ed`, shipped demand `2d16d8f8eb0950ca`, proposals file `c5cbe25f39e61414`, seeds file `e464cc90ca3e1472`, simulator `6b886c8f52ee07397773ddd0ebbcb447`, baseline 522.5 through cars an hour, top option p1 at 135.7 (-74.0%). The question: can a ban set plus one or two filters approach p1 with far fewer physical closures? The finding behind it is in the design of `perimeter-turn-bans` (Outcome): all left turns removed 39.9% with almost no displacement, and the leak in the big sets was Forest Street. The design is in `design.md`; the decision rule is D7 and was written before any run.

Status in the container that wrote this file. RAN: `cargo test --release -p traffic-sim` (new tests in `crates/sim/tests/ban_sets.rs`), `npx vitest run tools/ worker/ src`, the typecheck, `explore --list-ban-sets` and `scripts/parity.cjs` on the real network, a reduced search before and after the change without `--ban-sets` (proposals JSON byte-identical), and a reduced search with `--ban-sets` and a hand seed of the left-turn set and a filter (`--periods pm_peak --seeds 1 --no-confirm --minutes 6 --screen-minutes 3 --beam 2 --depth 3 --candidates 10 --expand 4 --finalists 4 --options 3`, 153 s), which published options that hold ban sets. UNTESTED: `a.zsh` and `pack.zsh` as wholes (they need the laptop's worktree layout), every full-size search and check. The figures of the reduced search come from one seed and a shortened run and are no evidence about the model.

Never: push to `main`, `npm run data:push`, a request to `https://traffic.transit.directory/api/*`, an upload token or any secret in a message or a file, `--publish` on an assessment or a search, a write to `public/data/rockridge.proposals.json`, `data/proposals/rockridge.seeds.json`, `data/proposals/rockridge.md` or `data/proposals/rockridge.references.json`, a change to a threshold of `design.md` D7 after a result, and a write into the main checkout. If a step stops, send back `target/ban-sets/chain.log` and the log it names, and do not edit a threshold or a set to get past it.

All work is in a second worktree (`traffic-bs`) with its own byte copies of the published data. The scripts read the published hashes from `laptop/env.zsh` (environment variables `EXP_*` override them) and stop on the first mismatch, saying why in `target/ban-sets/chain.log` of the worktree. Every step ends by checking that the proposals file, the seeds file and the tracked data are as they were. Scratch outputs are under `target/ban-sets/`.

## Steps

`MAIN` is the checkout whose `node_modules` the worktree links to (default: the checkout you run from). `BATCH` is the worktree that holds the published `public/data` (default `${MAIN}/.claude/worktrees/batch`). Quote any argument that holds a link or a glob: links contain `#`, `;` and `~`, which zsh reads as syntax. The scripts write `${VAR}` for every expansion. If the SSH agent is locked, `a.zsh` and `pack.zsh` retry over HTTPS with the gh login; a commit may be unsigned, and `pack.zsh` commits with signing off.

1. `MAIN=... BATCH=... zsh openspec/changes/turn-ban-set-candidates/laptop/a.zsh` (about 12 minutes). Checks the published hashes in `BATCH`, fetches the branch, makes the worktree, copies the ignored data, builds the release binaries and requires the fingerprint, runs `cargo test --release -p traffic-sim`, `npx vitest run tools/ worker/ src` and the typecheck, then lists the ban-set candidates (`explore --list-ban-sets target/ban-sets/sets.json`, no simulation), requires the 30 sets and 3 drops of the container run (`laptop/expected-sets.tsv`) and the movement-by-movement parity with `tools/turn-ban-sets.ts` (`scripts/parity.cjs`). `SINGLES=1` also scores every default candidate alone (about 8 minutes) and requires the first 223 candidates of `data/proposals/rockridge.md`.
2. `W=... zsh openspec/changes/turn-ban-set-candidates/laptop/b.zsh` (about 65 minutes, range 55 to 90). Copies the seeds file to `target/ban-sets/seeds.json`, raises its `cap`, adds the hand seeds `left-turns` and `all-turns-access` (each one ban-set intervention), and runs the published search command of round 52 plus `--ban-sets` (the script diffs it against `calibration-round-52/evidence/search/command.txt` and stops on any other difference) with `--out target/ban-sets/proposals.json --report target/ban-sets/report.md --known target/ban-sets/seeds.json`. The log gives the wall time against 2,736 s, the candidates and the ban sets among them, the known packages and the screening runs against 3,207.
3. `W=... zsh openspec/changes/turn-ban-set-candidates/laptop/c.zsh` (about 20 minutes). `explore --check` on the published settings (seeds 101 to 110, three periods, 60 minutes, `--no-known`) of: published p1; the search's first three options that hold a ban set; and the hand combinations: `left-turns` alone, `left-turns+forest-filter` (left turns and p1's modal filter on Forest Street at Ayala Avenue), `left-turns+63rd-filters` (left turns and p1's two 63rd Street filters), `all-turns-access+forest-filter`. `scripts/pick-checks.cjs` finds p1's filters by label in the published file. A hand combination is checked even when the search also published it. An interrupted run resumes; `FORCE=1` redoes every check.
4. `W=... zsh openspec/changes/turn-ban-set-candidates/laptop/d.zsh` (seconds). `scripts/summary.cjs` writes `target/ban-sets/summary.md`: per package the interventions, individual bans and physical closures, through cars an hour (mean of periods, and PM, AM, midday), the change with its 95% interval, the worst block for through cars and for all traffic, the rejection or access failure, and the difference from p1 on the same seeds. Then the search's options beside the published ones: whether the top option changed, the options that hold a ban set, and the counts of each.
5. `W=... DEV=... zsh openspec/changes/turn-ban-set-candidates/laptop/pack.zsh [--no-push]` (about 1 minute). Packs `target/ban-sets` as `gzip -9 -n` ustar parts of at most 190,000 bytes with `FILES.txt`, `SHA256SUMS` and a README, checks the round trip, and with no `--no-push` copies the folder into `DEV` (the laptop's checkout of `salvatoret/peaceful-fermi-dlwt0u`), commits it there and pushes that branch only, never `main`. The evidence goes to the dev branch and is never copied to `main`.

## Rules written before the run

`design.md` D7 and D8. In short: nothing is published; a different top option, a top option more than 15 points from the published -74.0%, or any package or option that removes more through cars than p1 on the same seeds goes to the project lead; a package that is rejected or fails the access check is reported with its reason and is no candidate. Bans apply to every vehicle in every period and compliance is assumed complete (ASSUMPTION). The model is not calibrated.

## What to report

From `target/ban-sets/chain.log`, `summary.md` and `report.md`:

- The p1 re-check against the published figures, and any stop.
- The table of `summary.md` as it is, then in words: which packages pass the access check, how each compares with p1 on removed through cars, individual bans and physical closures, and where the displaced traffic shows up (the all-traffic worst block).
- The search: same top proposal or not, the options that hold a ban set, the known-package lines, the screening runs against 3,207 and the wall time against 2,736 s and the 3,900 s estimate.
- Wall-clock times of each step against the estimate below.

## Time estimate

Laptop, 12 jobs. One simulated PM hour is about 20.5 s native; the last published search took 2,736 s and 3,207 screening runs.

| Step | Minutes |
| --- | --- |
| a.zsh: worktree, release build, tests, list and parity | 12 (SINGLES=1 adds 8) |
| b.zsh: the search with 30 more candidates and two hand seeds | 65 (range 55 to 90) |
| c.zsh: 8 checks at about 2.5 each | 20 |
| d.zsh, pack.zsh | 2 |

A to E: about 1 hour 45 minutes to 2 hours 15 minutes.
