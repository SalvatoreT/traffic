# Perimeter turn bans runbook: entry turn bans on the published model, on the laptop

Base: `origin/perimeter-turn-bans`, which has to be pushed from the container's checkout before step A (the container did not push). The model is the published one: network `53c823f20d9165ed`, shipped demand `2d16d8f8eb0950ca`, proposals file `c5cbe25f39e61414`, seeds file `e464cc90ca3e1472`, simulator `6b886c8f52ee07397773ddd0ebbcb447`, baseline 522.5 through cars an hour, top option p1 at 135.7 (-74.0%). The question is the project lead's of 2026-11-22: "Have you searched for the best proposals? I'd expect restricting turns into streets from outside the Trapezoid to be helpful." The design is in `design.md`; the decision rule is D7 and was written before any run.

Status in the container that wrote this file. RAN: `npx vitest run tools/ worker/ src/lib`, the typecheck, `tools/turn-ban-sets.ts` on the real network, `zsh -n` on every script, `explore --check` of two packages and `explore --check-singles` at a reduced size (one seed, three-minute runs) with the release binary, `b.zsh` and `d.zsh` end to end at that size (`PERIODS=pm_peak CHECK_SEEDS=101 CHECK_MINUTES=3 JOBS=4`), the seeding steps of `c.zsh` (scratch copy, cap, `pick-seeds.cjs`, `--add-seed`), and the start of a reduced search against the scratch seeds, which reported the known packages (23 to recheck, 2 dropped for having more interventions than the depth) and was stopped before it finished. UNTESTED: `a.zsh` and `pack.zsh` (they need the laptop's worktree layout), `c.zsh` as a whole, every full-size check and search. No full-size simulation of any package ran in that container, so no package has a result yet. The access check is a graph test and does not depend on the run length, so the access results in the smoke are real: `all-entries` strands 37 nodes, `all-turns` and `street-telegraph-avenue` strand one node (an unnamed junction off Telegraph Avenue), and the other packages pass.

Never: push to `main`, `npm run data:push`, a request to `https://traffic.transit.directory/api/*`, an upload token or any secret in a message or a file, `--publish` on an assessment or a search, a write to `public/data/rockridge.proposals.json`, `data/proposals/rockridge.seeds.json`, `data/proposals/rockridge.md` or `data/proposals/rockridge.references.json`, a change to a threshold of `design.md` D7 after a result, and a write into the main checkout.

All work is in a second worktree (`traffic-tb`) with its own byte copies of the published data. The scripts read the published hashes from `laptop/env.zsh` (environment variables `EXP_*` override them) and stop on the first mismatch, saying why in `target/tb/chain.log` of the worktree. Every step ends by checking that the proposals file, the seeds file and the tracked data are as they were.

## Steps

`MAIN` is the checkout whose `node_modules` the worktree links to (default: the checkout you run from). `BATCH` is the worktree that holds the published `public/data` (default `$MAIN/.claude/worktrees/batch`). Quote any argument that holds a link or a glob: links contain `#`, `;` and `~`, which zsh reads as syntax. The scripts write `${VAR}` for every expansion.

1. `MAIN=... BATCH=... zsh openspec/changes/perimeter-turn-bans/laptop/a.zsh` (about 15 minutes). Checks the published hashes in `BATCH`, fetches the branch (`git fetch origin ${BR}`), makes the worktree, copies the ignored data, builds the release binaries in the worktree (the binary reads the data of the checkout it was built in) and checks the fingerprint, runs the TypeScript tests and the typecheck, scores every search candidate alone (`explore --check-singles`, all three periods, seed 1, 60 minutes: the settings that make the search's candidate list) and requires the first 223 candidates of `data/proposals/rockridge.md`, then runs the generator with that ranking and requires the container's package counts. Output: `target/turn-bans/{packages.json,packages.md,packages.tsv,singles.log}`.

   If the SSH agent is locked and `git fetch origin ${BR}` fails, fetching over HTTPS with the gh login works: `git -c credential.helper='!gh auth git-credential' fetch https://github.com/<account>/traffic.git ${BR}:refs/remotes/origin/${BR}`.
2. `W=... zsh openspec/changes/perimeter-turn-bans/laptop/b.zsh` (about 40 minutes). `explore --check` of published p1 and of every package, each to `target/tb/check/<id>.log`, with the published settings: `--periods pm_peak,am_peak,midday --seeds 101-110 --no-confirm --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs 12 --no-known`. A check prints and writes nothing, and the seeds file is never read. An interrupted run resumes; `FORCE=1` redoes every package. The p1 re-check must reproduce the published figures (522.5 to 135.7, interval -407.65 to -365.95 cars an hour): the script logs both side by side.
3. `W=... [DEPTH=6] zsh openspec/changes/perimeter-turn-bans/laptop/c.zsh` (about 60 minutes at depth 6). Copies the seeds file to `target/turn-bans/seeds.json`, raises its `cap`, adds as hand seeds the packages that were not rejected, passed the access check and have at most DEPTH bans, then runs the published search command (diffed against round 52's `command.txt`) with `--out target/turn-bans/proposals.json --report target/turn-bans/report.md --known target/turn-bans/seeds.json`. It stops if no package qualifies; `ALLOW_EMPTY=1` runs the search with the published seeds only, as a control. A second run with `DEPTH=<n>` larger than 6 seeds the larger packages and writes `proposals-depth<n>.json`; it changes the beam as well (design D5), so run it only if step B shows a large package is worth growing, and expect two to three times the time.
4. `W=... zsh openspec/changes/perimeter-turn-bans/laptop/d.zsh` (seconds). `scripts/summary.cjs` writes one table to `target/tb/summary.md` (copied to `target/turn-bans/summary.md`): per package the bans, through cars an hour (mean of periods and PM, AM, midday), the change against baseline with its 95% interval, the largest through-car rise on one block, the largest all-traffic rise on one block with its period, the rejection or access failure, and the change minus p1's change on the same seeds. Then the search's options against the published ones: same top proposal or not, and which options hold turn bans. It also lists what `--check` cannot report.
5. `W=... DEV=... zsh openspec/changes/perimeter-turn-bans/laptop/pack.zsh [--no-push]` (about 1 minute). Packs `target/tb`, the check logs and `target/turn-bans` as `gzip -9 -n` ustar parts of at most 190,000 bytes with `FILES.txt`, `SHA256SUMS` and a README, checks the round trip, and with no `--no-push` copies the folder into `DEV` (the laptop's checkout of `salvatoret/peaceful-fermi-dlwt0u`), commits it there and pushes that branch only, never `main`. The commit has no model name and no session link.

If a step stops, send back `target/tb/chain.log` and the log it names, and do not edit a threshold or a package to get past it.

## Rules written before the run

`design.md` D7 and D8. In short: nothing is published from this change; a search top option that differs from p1, a package that alone removes more than 15% of through cars, or a top option more than 15 points away from the published -74.0% goes to the project lead; a package that is rejected or fails the access check is reported with its reason and is no candidate. Bans apply to every vehicle in every period and compliance is assumed complete (ASSUMPTION). The model is not calibrated.

## What to report

From `target/tb/chain.log`, `summary.md` and `target/turn-bans/packages.md`:

- The p1 re-check against the published figures, and any stop.
- The table of `summary.md` as it is, then in words: which packages pass the access check, which are rejected and why, the reduction of each against p1's, and where the displaced traffic shows up (the all-traffic worst block per package).
- The search: same top proposal or not, options that hold turn bans, the known-package lines (which seeds were rechecked or dropped), and the wall time against 2,736 s.
- Wall-clock times of each step against the estimate below.

## Time estimate

Laptop, 12 jobs. One simulated PM hour is about 20.5 s native; the last published search took 2,736 s.

| Step | Minutes |
| --- | --- |
| a.zsh: worktree, release build, tests, singles ranking (7), packages | 15 |
| b.zsh: 14 to 15 checks at about 2.5 each (baseline 30 hours and package 30 hours per check) | about 40 |
| c.zsh at depth 6: published search 46, plus about 1 per seed and its sub-package screens | 60 |
| c.zsh at a larger depth | not measured: 120 to 180 |
| d.zsh, pack.zsh | 2 |

A to E at depth 6: about 2 hours. Putting every link in one `--check` invocation would share the baseline and save about 18 minutes of b.zsh, at the cost of one log for all packages; the scripts keep one log per package so that a failure names its package.
