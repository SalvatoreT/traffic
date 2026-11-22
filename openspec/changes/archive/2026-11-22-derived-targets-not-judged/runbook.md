# Runbook: derived targets on the laptop

Modeled on the round 52 restamp (`openspec/changes/archive/2026-11-21-restamp-round-52/`) and on "When the simulator fingerprint changes" in `data/README.md`. The rule here is the project lead's decision of 2026-11-21: targets derived from daily totals are reported apart and not judged, they stay in the fit, and the published site does not change until the project lead has reviewed the figures. This run produces candidate outputs only.

## What must come out the same, and what may differ

The shipped side is untouched by the rule, so it is the identity check:

| Input or output | Published value | Expected |
| --- | --- | --- |
| Simulator fingerprint | `6b886c8f52ee07397773ddd0ebbcb447` | same |
| Config, split, stations file, groups file | `2405ff02c92b2837`, `be72380b485ec5fc`, `c9db41c930acf37d` | same, no tracked file under `data/demand` or `data/areas` changes except fit reports |
| Network | `53c823f20d9165ed` | same |
| Shipped demand | `2d16d8f8eb0950ca` | same, byte for byte |
| Shipped membership file | `56e688e7e5749d23` | same, byte for byte (its evidence names the same split, stations, config and simulator) |
| Cross-validation demand | `1c3b1666f24156f1` | changes: the 6 AADT link stations, the 2 AADT gate stations and 5 held ramps join the training view, and its `build` gains `withheld` |
| Training membership file | `cf32e3e0d9e6f23e` | changes: its evidence gains `withheld`, and the 11 stations that are now fitted have pairs |
| Assessment, shipped-demand sections (D16, route shares, whole-street traversals) | published | same |
| Assessment, station rule | PM recent held out 14 of 24, fitted 81 of 92 | new scope: PM fitted 79 of 89 on the same shipped runs; held out near 14 of 18 on the new cross-validation demand |

Any other difference on the shipped side means stop and report to the project lead. Do not push and do not replace published local data.

## Rules for the run

- No `data:push`, no upload token on the laptop, no request to `https://traffic.transit.directory/api/*`, nothing written to main.
- The candidate work happens in a second worktree (`a.zsh` makes it) with its own copies of the git-ignored data files. The published copies in the main checkout are never written. "Restore nothing over the published local data until told": the project lead says when, and the cloud session does it from the packed parts.
- The assessments are variant output sets (`--suffix`), never `--publish`.
- Each script stops on the first mismatch and says why in `target/derived/chain.log` of the worktree.

## Steps

Run from the checkout that holds the published local data (`MAIN`); `W` is the candidate worktree (default `../traffic-derived`).

1. `MAIN=... W=... zsh openspec/changes/derived-targets-not-judged/laptop/a.zsh` (about 12 minutes). It reads the published hashes in `MAIN` and stops if they are not the round 52 set; fetches `origin/derived-targets-not-judged` into the worktree; copies the ignored data; builds the release binaries and checks the fingerprint; builds the WASM; runs the TypeScript tests, the typecheck and the `calibrate` unit test; re-freezes the split into a scratch folder and checks that its groups and held flags equal the committed ones (the retained-note sentence may differ, as on main); checks `tools/derived-targets-report.ts` against the committed report; and runs the loop's dry run, expecting the shipped counts of round 52 and the training counts below.
2. `W=... zsh .../laptop/b.zsh` (about 80 minutes; the loop is 63 of them). It runs `tools/membership-loop.ts --jobs 12` with the published membership files moved out of the way, as in round 52; compares the two membership files with the published ones; builds the shipped and the training demand; checks the identity table above; and writes the Assumptions data into the worktree's `public/data`.
3. `W=... zsh .../laptop/c.zsh` (about 5 minutes). It runs the validation suite (67 of 74 cases expected, `validation.json` unchanged apart from the revision) and two ten-seed assessments: `--suffix derived --seeds 1-10` and `--suffix derived-fresh --seeds 11-20`. It writes `target/derived/summary.md` with the verdict rows (D16, D5, the station rule on both scopes, whole-street traversals), the derived-target tables, the held-out misses and a diff of the shipped-demand sections against the published assessment.
4. `W=... DEV=... zsh .../laptop/pack.zsh` (about 1 minute). It packs the candidate outputs as `gzip -9 -n` ustar parts of at most 190,000 bytes with `FILES.txt` and `SHA256SUMS`, checks the round trip, copies the folder to `openspec/changes/derived-targets-not-judged/evidence/laptop-run/` in the development branch checkout, commits and pushes `salvatoret/peaceful-fermi-dlwt0u` only. `--no-push` stops before the copy.

## Expected counts in the dry run

| Line | Round 52 | Now |
| --- | --- | --- |
| Withheld from the training view | 91 | 78 (86 held stations less 13 derived, plus 5 aggregates) |
| shipped pm_peak | 337 selected (245 link, 92 movement or route), 6 static | same |
| shipped am_peak | 272 selected (200 link, 72 movement or route), 6 static | same |
| training pm_peak | 256 selected (187 link, 69 movement or route), 0 static, 87 withheld | 267 selected (198 link, 69), 2 static, 74 withheld |
| training am_peak | 201 selected (148 link, 53 movement or route), 0 static, 77 withheld | 212 selected (159 link, 53), 2 static, 64 withheld |

The 2 static stations are the gate pair of the Ashby Ave edge (`gate 265 in` and `out`): gate stations have no link, so they are in the fit and have no pairs to export.

## What to report

From `target/derived/summary.md` and `chain.log`:

- The identity checks and any stop.
- For PM and AM, seeds 1 to 10 and 11 to 20: the recent fitted and held-out pass counts under both scopes, the verdict, D16, D5, the whole-street traversals.
- The derived-target table for each period, and which held-out misses remain.
- The validation suite result.
- Wall-clock times of each step against the estimate below.

## Time estimate

M3 Pro, 12 jobs, from the round 52 restamp on 2026-11-21 (membership loop 3,777 s, `npm run data` 1,017 s, `validate` 18 s, assessment 70 s):

| Step | Minutes |
| --- | --- |
| a.zsh: worktree, release build (incremental 1 to 5), WASM, tests, freeze, dry run | 12 |
| b.zsh: loop 63, two demand builds 17, assumptions data 1 | 81 |
| c.zsh: validate, two assessments | 5 |
| pack.zsh | 1 |
| Total | about 100, allow 2 hours |

## After the run (cloud session, once the project lead has reviewed the figures)

Files that change if the figures are adopted: `target/membership/rockridge.membership-training.json` (not in git, in the bucket under `demand/membership/`), `target/validation/rockridge.demand.json` (not in git), `data/demand/rockridge.fit.md`, `rockridge.fit.stations-*.md`, `rockridge.fit.cv.md`, `rockridge.fit.cv.stations-*.md`, `data/calibration/rockridge.assessment.md` with its reports and the noise file, `public/data/rockridge.assumptions.json`, the text pages under `public/data/llms/` and, by the documented procedure, the calibration note in `data/areas/rockridge.json`. Files that do not: the shipped demand, the network, the stations, split and groups files, the config, the shipped membership file, the proposals, the stored results, the redistribution files and the preview cards (the Assumptions tab is not a preview card). The order is the one in `data/README.md`: reassemble and verify the parts, clear `public/data/llms`, run `data:llms`, then `data:push` with the network secret, as under "Publishing without a Cloudflare token".
