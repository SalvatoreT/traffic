# Round 55 runbook: iterate the membership loop to its stop rule on the laptop

Base: `origin/calibration-round-55` (branches from `origin/main` at 3e493a6, which has the derived-targets scope). The baseline is the published model under that scope: shipped demand `2d16d8f8eb0950ca`, cross-validation demand `e1a9d4bd50539355`, membership files `56e688e7e5749d23` (shipped) and `969794a26ac14f84` (training), simulator `6b886c8f52ee07397773ddd0ebbcb447`, config `2405ff02c92b2837`, split `be72380b485ec5fc`, stations `c9db41c930acf37d`, network `53c823f20d9165ed`.

Status of each part in the container that wrote this file. RAN: `npx vitest run tools/membership-loop.test.ts` (45 tests), `membership-loop.ts --dry-run` with no option, with `--iterations 3` (identical output) and with `--iterations 8 --watch`, `zsh -n` on every script, `keep-rule.cjs` and `headline.cjs` on the committed assessment and the published proposals file. UNTESTED: every zsh script run, the loop itself, `identity.cjs` on real loop folders, `calibrate --select-od` diagnostics on real runs, the assessments and the search. No simulation ran in that container.

Never: push to `main`, `npm run data:push`, `npm run data:split`, any request to `https://traffic.transit.directory/api/*`, an upload token or any secret in a message or a file, `--publish` on an assessment, an edit to the calibration note or caveat in `data/areas/rockridge.json`, loosening the keep rule, the improvement test or the stop limit after a result, editing a membership file or the demand config after the loop has started, writing into the main checkout.

All work is in a second worktree (`traffic-r55`) with its own byte copies of the published data. The scripts read the published hashes from `laptop/env.zsh` (environment variables `EXP_*` override them) and stop on the first mismatch, saying why in `target/r55/chain.log` of the worktree.

## Steps

`MAIN` is the checkout that holds the published shipped data. `DER` is the derived-targets worktree (default `$MAIN/.claude/worktrees/traffic-derived`): its `target/validation/rockridge.demand.json` is the published cross-validation demand, its `target/membership/rockridge.membership-training.json` the published training membership, and its `target/membership-loop/` the published loop for the identity check. Override `CV`, `MS`, `MT` if the published copies live elsewhere. The scripts sit in `openspec/changes/calibration-round-55/laptop/`; run them from the checkout that has this branch, or from the worktree once `a.zsh` has made it.

1. `MAIN=... zsh .../laptop/a.zsh` (about 15 minutes). Checks the published hashes in `MAIN` and `DER`, makes the worktree from `origin/calibration-round-55`, copies the ignored data and the published membership files aside (the loop needs `target/membership` empty), builds the release binaries and checks the fingerprint, builds the WASM, runs the TypeScript tests and the typecheck, runs the three dry runs (default equals `--iterations 3`; a cap of 8 only adds passes; the selection counts are those of the derived-targets run), and assesses the published model on seeds 1 to 10 and 11 to 20 under the derived-targets scope. It stops unless the baseline counts are PM fitted 79/89, PM held out 15/18, AM fitted 72/77, AM held out 15/19 on seeds 1 to 10 and 80/89, 15/18, 74/77, 15/19 on seeds 11 to 20.
2. `W=... zsh .../laptop/b.zsh` (46 to 142 minutes, below). Runs `membership-loop.ts --iterations 8 --jobs 12 --watch .../watch.json`. Read `target/membership-loop/diagnostics.md` between passes: it is rewritten after each one. Afterwards it compares passes 0 to 2 with the published loop (`identity.cjs`: every demand byte for byte, the loop's own figures equal), compares the pool after pass 2 with the published membership files ignoring the recorded run path, saves the candidate under `target/r55/cand/`, and checks that the stations, split, groups, config and area files are unchanged. It stops on any difference. If the final demands are the published ones it says so and there is nothing more to run.
3. `W=... zsh .../laptop/c.zsh` (about 4 minutes). Validation suite (67 of 74 expected, `validation.json` identical apart from the revision), the candidate's assessments (`--suffix r55 --seeds 1-10`, `--suffix r55-fresh --seeds 11-20`), then `scripts/keep-rule.cjs` against the baseline assessments of step 1, which writes `target/r55/keep-rule.md` and the summary. Exit status 0 only when the keep rule and the improvement test both pass.
4. Only if step 3 exits 0: `W=... zsh .../laptop/d.zsh` (about 58 minutes). The staged search with round 52's flags, redistribution, results, assumptions, text pages and previews into `target/r55/staged`, then `scripts/headline.cjs`. `public/data` is copied aside first and put back at the end.
5. `W=... DEV=... zsh .../laptop/pack.zsh [--no-push]` (about 1 minute). Packs the evidence as `gzip -9 -n` ustar parts of at most 190,000 bytes with `FILES.txt` and `SHA256SUMS`, checks the round trip, and with no `--no-push` copies the folder into `DEV` and pushes `PUSH_BRANCH` only (default `salvatoret/peaceful-fermi-dlwt0u`). The commit has no model name and no session link.
6. `W=... zsh .../laptop/restore.zsh` readies the worktree for another run (published data back, loop folder moved to `target/r55/loop-run`). Optional; the main checkout was never touched.

If the loop aborts (offered demand more than 3% over the static fit, or a failed build check), send back `target/r55/loop.log`, `target/membership-loop/logs/` and `data/demand/rockridge.fit*.md`, and do nothing else: no `--resume`, no config change. `RESUME=1 zsh .../b.zsh` is only for an interruption such as the laptop sleeping.

## Rules written before the run

Keep rule and improvement test: design.md D4, implemented in `scripts/keep-rule.cjs` (the floors are in the script). Stop rule: `STOP_RATIO` 1 in every view and period after pass 1 or later, cap 8, unchanged. A run that does not stop by pass 8 ends at the cap and is the candidate; its pool is the pool of eight passes.

## What to report

From `target/r55/chain.log`, `diagnostics.md`, `keep-rule.md` and `headline.md`:

- The identity checks, and any stop.
- Pass by pass, for PM and AM in both views: the flow and membership change over the seed standard error, the flow change beyond noise, the offered demand as a share of the static fit.
- The pass at which the stop rule fired, or the lines that blocked it at the cap.
- For the seven judged held-out misses and the five diagonal stations, per pass: counted, shipped fit, simulated on the shipped demand, simulated on the training demand; the diagonal sum against 178. The reading at pass 3 is the published model's, the last pass is the candidate's.
- The count of judged fitted and held-out stations within GEH 5 per pass.
- The keep rule and the improvement test, line by line, on both seed sets.
- If the search ran: through cars per hour at baseline by period, published against staged, the change in percent, and the top proposal's options (the same list the published top proposal has, or the differences). The standing publish authorization needs the change to be at most 15% with the same top proposal; `headline.md` says whether it holds.
- Wall-clock times of each step against the estimate below.

## Time estimate

Laptop, 12 jobs. Round 52's loop took 3,777 s for three passes and the final builds, and 3,790 s on 2026-11-21. A pass is two demand builds and 40 seed runs: about 16 minutes by an estimate that assumes 7 minutes a build (the log keeps only the total); the project lead's 20 minutes a pass is used as the upper figure. The final builds are about 14 minutes.

| Step | Minutes |
| --- | --- |
| a.zsh: worktree, release build, WASM, tests, dry runs, two baseline assessments | 15 |
| b.zsh, loop stopping after pass 1 (two passes, final builds) | 46 |
| b.zsh, stop after pass 2 (the published three passes; identical to the published model) | 62 |
| b.zsh, stop after pass 3 (four passes) | 78 |
| b.zsh, all eight passes | 142 (20 a pass: 174) |
| c.zsh: validation, two assessments, keep rule | 4 |
| d.zsh: search 46, redistribution 5, results 1, assumptions, text pages, previews 5 | 58 |
| pack.zsh | 1 |

Totals without the search: early stop after pass 1, about 66 minutes; eight passes, about 162 minutes (2.7 hours, 3.2 at 20 minutes a pass). With a passing round add 58 minutes for `d.zsh`: about 3.7 hours for eight passes. A stop after pass 2 reproduces the published model and ends after b.zsh (about 77 minutes).
