## Finding

The published model comes from three passes of the membership loop (round 48 on, the stop rule never fired). Nothing in the repository says the three passes reached the fixed point the method is after, and the evidence points the other way: the flow change between passes was still 1.46 and 1.56 seed standard errors after pass 2 (PM, shipped and training views), and the simulator overshoots the fit on the residential diagonal.

Reading the loop turned up two facts.

- Pooling already is successive averaging. Pass k pools the runs of passes 0 to k with equal weight, so the last pass is one of k+1 and no pass is ever dropped. No option for averaging across passes is needed, and none is added (D2).
- The stop rule can fire only when the change between passes is at the level of seed noise, and at a true fixed point it fires about half the time on each of its four lines. A synthetic check is in "Noise floor of the stop rule" below. The rule is kept as it is, as the project lead asked, and the cap decides the length of the run when the rule does not fire.

## Decisions

### D1: How the loop decides today

All line numbers are at `origin/main` 3e493a6, before this change.

| Piece | Where | What it does |
| --- | --- | --- |
| Passes | `tools/membership-loop.ts:23`, `tools/lib/membership-loop-run.ts:120` | `--iterations`, default 3, is the number of passes and the cap. Pass k builds both views, simulates seeds 1 to 10 for PM and AM on each view, and pools. The final build comes after the last pass. |
| Pooling | `membership-loop-run.ts:141` and `:155`, `tools/lib/membership-loop.ts:125` and `:137` | After pass k, for every view and period, the runs of every pass j from 0 to k are pooled with `poolStations`, with equal weight (`assertEqualWeight`: every pass has the same number of seeds, at least two). The membership file records `iterations: k + 1` (`membership-loop-run.ts:161`). The build of pass k+1 reads that file. |
| Comparison | `membership-loop-run.ts:152` and `:159`, `membership-loop.ts:101` to `:119` | `iterationShift` compares pass k with pass k-1 on raw single-pass seed means, not on pools, over the stations the view selects: flow per station, and membership as the sum over pairs of the pair-flow differences, each as a root mean square against the root mean square of the combined seed standard error. |
| Stop rule | `membership-loop.ts:94` (`STOP_RATIO = 1`), `:119` (`converged`), `membership-loop-run.ts:168` and `:170` | From pass 1 on, stop when every report of the pass (both views, both periods) has flow ratio and membership ratio at or below 1. The final build then uses the pool of passes 0 to k, and `passes = k + 1` (`:172`). |
| Threshold | `membership-loop.ts:93` and `:94` | 1 is labeled ASSUMPTION, written before any run: the change is no larger than its standard error. It has no source. |
| Abort | `membership-loop.ts:261` (`CEILING_ABORT_SHARE = 0.03`), `membership-loop-run.ts:101` and `:102` | After any build from pass 1 on, offered car demand more than 3% above the static fit's stops the loop before that pass's seed runs. ASSUMPTION, round 49. It applies to every later pass and to the final build. |
| Low-demand line | `membership-loop.ts:263` (`CEILING_LOW_SHARE = 0.10`), `membership-loop-run.ts:80` | After the final build, offered demand more than 10% below the static fit's is logged as a WARNING. Report only (lead decision of 2026-11-19, kept in round 52). |

The stop rule already requires both views for PM and AM, so D2 needs no change to what it demands. Station choice and the stop rule read stations, the frozen split and simulated flows only, which the demand-model spec requires.

### D2: More passes, the same rule, no new averaging

The run for this round uses `--iterations 8`. That is the whole change to loop control. The rule, the limit of 1 and the pooling are as they are. The new `stopDecision` (`tools/lib/membership-loop.ts`) is the old expression `k >= 1 && reports.every(x => x.shift?.converged)` as a function that also names the blocking lines for the log.

Why 8: the 2026-11-21 loop took 3,790 s for three passes and the final builds. A pass is two demand builds and 40 seed runs. Taking about 7 minutes a build and 2 minutes of seed runs a pass (an estimate, not a measurement: the log keeps only the total), a pass is near 16 minutes and the final builds near 14. The project lead's figure of about 20 minutes a pass is the safe side. Eight passes are about 2.4 hours (2.9 at 20 minutes a pass). In the evidence the flow change fell by a factor 2.5 from pass 1 to pass 2 (3.65 to 1.46, shipped PM), so eight passes are a long enough test of whether it keeps falling.

Why no averaging option. The loop pools all earlier passes with equal weight. That is the method of successive averages with step 1/n [PowellSheffi1982], applied here to a fixed point of estimation and assignment, where the reference treats equilibrium assignment. The application is an ASSUMPTION already labeled in `tools/lib/membership-loop.ts`, and the paper was not opened (see `docs/references.md`). [Frederix2013] says congested assignment makes bi-level OD estimation prone to bias and local minima, which is a reason to read convergence from the runs and not to assume it. No reference in the list says how to average the iterates of a bi-level OD estimation, so an alternative weighting would be a second assumption with no support. The equal weight keeps the influence of pass 0 (static membership) at 1/n, which falls as passes are added.

The cap does not touch what a pass does. What a pass builds depends on the config, the stations, the split and the membership file written by the pool of the passes before it, none of which depends on the cap.

Default identity. With no `--iterations` the loop runs at most three passes and writes the same demands and membership files as before. The proof for the laptop, in the order the scripts run it:

1. `a.zsh` runs the dry run with no option and with `--iterations 3` and requires identical output, then the dry run with a cap of 8 and requires that the plan steps of passes 0 to 2 and the final builds are the same lines.
2. `b.zsh` runs the loop with the cap of 8 and compares it with the published loop of the derived-targets job (`traffic-derived/target/membership-loop`): the demand of every pass in common (0 to 2) and view byte for byte, and the loop's own per-pass figures equal (`scripts/identity.cjs`). Passes 0 to 2 of the candidate are the published passes, because only the cap and the report changed. The build of pass 3 reads the pool of passes 0 to 2, which is the file the published run's final build read, so its demands are the published shipped demand `2d16d8f8eb0950ca` and cross-validation demand `e1a9d4bd50539355`.
3. The loop keeps `pools/i<k>-<view>.json`. `b.zsh` compares the pools of pass 2 with the published membership files (shipped `56e688e7e5749d23`, training `969794a26ac14f84`) with `jdiff.cjs`, ignoring `periods.*.source`. Those files record the absolute path of the loop folder they were pooled in (for example `/Users/.../worktrees/traffic-derived/target/membership-loop/iter0/training (10 seeds)`), so they are byte-identical only when the loop runs at the same path. Passes in a different worktree can match everywhere else, and the check says so.
4. If the stop rule fires after pass 1 or 2, the run ends the way the default run would: after pass 2 with the published pool (identical to the published model, nothing to assess), after pass 1 with a two-pass pool.

If averaging had changed pass 2 onward the identity would hold only for the default run. It does not, so the first three passes of any run equal the published ones.

The unit tests check the parts that do not need the laptop: the default plan is the three-pass plan of rounds 48 to 53 (step ids); a run with a cap of 8 and flows that keep moving builds, before pass 3, exactly what a cap of 3 builds (the membership file each build sees, run paths set aside); the stop decision needs every view and period; the cap ends the run with the rule unmet; eight passes pool with weight 1/8 each.

### D3: Diagnostics, report only

`tools/lib/loop-diagnostics.ts` and the pool step of `runLoop`. Written after every pass to `target/membership-loop/diagnostics.md` and logged:

- Flow and membership change per seed standard error by pass, view and period, and a column for the flow change beyond noise, `sqrt(max(0, ratio^2 - 1))` in standard errors. At a fixed point the ratio is about 1 because the noise of the two passes is in it, so the column shows how far the passes still move when the noise is taken out.
- Offered car demand and its share of the static fit, from the build of the same pass.
- The watch file `openspec/changes/calibration-round-55/watch.json`: the seven judged held-out misses (PM: link 1933 McAuley Street EB, 1868 60th Street EB, 1897 Canning Street SB; AM: 1933, 1868, 1990 58th Street EB, 1858 63rd Street EB) and the five PM diagonal stations (Forest Street EB 66, McAuley Street EB 12, 60th Street EB 23, Ayala Avenue NB 60, Howell Street SB 17 counted, sum 178), named by station id so that the code names no street. For each, per pass: counted value, the shipped fit's final value (from the pass's own fit report), the simulated seed mean on the shipped demand and on the training demand (the held-out reading). A test checks the ids against the committed stations file, the targets and the counted sum of 178.
- The recent judged stations within GEH 5 on the pass's own seeds: fitted stations in the shipped view, held-out stations in the training view. Judged means what `assess` judges: link stations with an hourly count of the last five years, not a daily total, not a scaled copy of another period. The held side is the effective held set (`heldStationIds`, with the derived-target rule). Simulated flow is the loop's select-link export, trips counted at the station's detectors, which can differ slightly from the assessment's link flow, so the counts are a progress signal and `assess` stays the judge. Stations the runs do not export are counted as not measured.

The reading at pass 3 is the published model's own: the pass-3 runs are made on the demand built from the pool of passes 0 to 2, which is the published demand. The diagnostics at pass 3 therefore give the baseline's figures on the same code, and the last pass gives the candidate's.

Failure to compute a diagnostic logs a WARNING and the loop carries on. The diagnostics read count values, which the spec forbids only for choosing stations and for stopping; they do neither.

### D4: Keep rule and improvement test

Written before any run, and not changed after a result. Baseline: the published model under the derived-targets scope, scored by `a.zsh` on the same code and seeds. The baseline files must reproduce the counts below or `a.zsh` stops.

| Line | Seeds 1 to 10 | Seeds 11 to 20 |
| --- | --- | --- |
| PM fitted | at least 79 of 89 | at least 80 of 89 |
| PM held out | at least 15 of 18 | at least 15 of 18 |
| AM fitted | at least 72 of 77 | at least 74 of 77 |
| AM held out | at least 15 of 19 | at least 15 of 19 |
| D5 headline shares | 4 of 4 | 4 of 4 |
| Whole-street traversals | 8 of 8 | 8 of 8 |
| D16 stability, every period | holds | holds |
| Validation suite | 67 of 74, identical to the committed report apart from the revision | same run |
| Any judged line | no worse than the baseline on the same seeds | same |

Improvement test: at least one judged held-out line, PM held out or AM held out, is higher than the baseline on both seed sets. Otherwise the round is recorded as no improvement. "Line" is read as one of these two counts, and "higher" as at least one more station on each set; the brief did not define either, so this reading is stated here before the run and is an open question below.

If the keep rule and the improvement test pass on both seed sets, `d.zsh` runs the staged proposal search with the flags of round 52 (search-c5: `--beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60`, seeds 1 to 3, confirmation seeds 101 to 110, the committed seeds file), then redistribution, results, assumptions, text pages and previews, all into `target/r55/staged`. Nothing is published from the laptop. The standing publish authorization covers a round that passes all of that and whose headline through cars per hour change is at most 15% with the same top proposal. `scripts/headline.cjs` prints through cars per hour at baseline by period for the published and the staged set, the change in percent, and the top proposal's options, so the lead can check both in one read.

### D5: Runbook and scripts

`runbook.md` and `laptop/`. Modeled on the derived-targets scripts and round 54's. Separate worktree `traffic-r55` with byte copies of the published data, so the main checkout is never written. The published hashes are read from `laptop/env.zsh`, which the environment can override. Each period has its own files throughout: the loop names every seed export by period (`sod-<period>-<seed>.json`), the diagnostics and the assessment variants are per period, and no script writes two periods into one folder, which is the fault that bit round 54's first stage. `pack.zsh` takes `--no-push`, and its commit has no model name and no session link.

### D6: Tests

`tools/membership-loop.test.ts`: stop in both views (one line above the limit blocks it), cap, the missing comparison at pass 0, eight-pass weights, default plan, a larger cap leaves the first passes unchanged, diagnostics (GEH tallies, watch rows, fit parsing, rendering, loop wiring, no change to pooled files, the committed watch file).

## Noise floor of the stop rule

A synthetic check with the repository's own `iterationShift`: 300 stations, 10 seeds, independent seed noise in the two passes, two pair flows per station. Two passes drawn from the same distribution give a flow ratio with median 0.997 (5% to 95%: 0.92 to 1.08), and the rule fires on 107 of 200 draws. A drift of 1% of station flow gives a median of 1.02 and 77 of 200 fires, 2% gives 1.07 and 16 of 200, 4% gives 1.27 and none. The membership ratio sits near 0.9 on noise alone and rarely blocks.

So with seeds that are independent between passes, the flow line fires about half the time at an exact fixed point and the four lines together (shipped and training, PM and AM) far less often, and a flow drift of 2% already blocks it. The loop reuses seeds 1 to 10 in every pass, which may correlate the two passes and make the rule easier to meet; the diagnostics will show the ratios. The limit of 1 is an ASSUMPTION with no source and the lead asked that it not be loosened to make it fire, so it stays. Reading the run: if the rule does not fire by pass 8, look at the "beyond noise" column before calling the loop unconverged. A flow change beyond noise that keeps falling pass over pass is convergence at the cap, and one that stops falling is a loop that settles away from its fixed point or oscillates.

## References

All in `docs/references.md`, verification status as there.

- [PowellSheffi1982]: a predetermined step sequence in a descent direction converges to the equilibrium assignment under regularity conditions; the paper was not opened, so the 1/n step is the standard choice, not a quotation. Supports the equal-weight pool as successive averages, applied to this fixed point as an ASSUMPTION.
- [Cascetta1993]: OD estimation as an optimization that combines counts with an outdated matrix as prior. Supports the estimation step of the loop.
- [Toledo2013]: iterating a count fit with assignment matrices from a simulator, with historical demand as an input. Supports the shape of the loop. Its abstract reports no convergence or prior-weight findings.
- [Frederix2013]: assignment proportions taken from a congested simulation can bias the estimate and create local minima. Supports reading convergence from the runs and not assuming a unique fixed point.
- [Marzano2008]: a count fit with more OD pairs than counted links is under-determined, so a fit that meets its counts says little about the matrix. Supports expecting that convergence of the loop does not by itself put the diagonal right; the held-out counts stay the check.
- [WebTAG-M3.1] section 3.4 sets convergence criteria for assignment (a relative gap, the share of links whose cost changed by under 1%); the loop's limit of 1 standard error is not taken from it.

## Deviations from the brief

- No averaging option was added: pooling already averages all passes with equal weight (D1, D2).
- The brief's "stop rule fires in both views for PM and AM" is what the existing rule already requires, so the rule's code is unchanged in effect. The only change is that it is a function that names the blocking lines.
- Added beyond the brief: the loop copies each pass's pooled files into the loop folder (`pools/`), which makes the identity check of the pool after pass 2 possible without running a default loop; and a "flow change beyond noise" column in the diagnostics, because of the noise floor above. Both write only into the loop folder.
- The brief says the first three passes of the candidate "should equal the published loop's". They do, except that the membership files record the absolute run path, so byte identity of those two files needs the same path; the check ignores the `source` field and says so (D2).

## Open questions for the project lead

1. The improvement test reading in D4 (same held-out line higher on both sets, by at least one station).
2. The stop rule's four-line condition at a limit of 1 may rarely fire even at the fixed point (above). Keep it as the stop and treat the cap as the usual end, or add a noise-corrected rule in a later round?
3. The pack script pushes to `salvatoret/peaceful-fermi-dlwt0u` by default, as the earlier rounds did. `PUSH_BRANCH` overrides it.
4. The membership files record absolute paths in `source`. Recording paths relative to the repository would make them reproducible across worktrees, but it changes their bytes, so it is not in this round.
