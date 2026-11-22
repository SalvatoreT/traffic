## Why

The published demand (round 52, shipped `2d16d8f8eb0950ca`, cross-validation `e1a9d4bd50539355` under the derived-targets scope) is fitted on the simulator's own route choice by a loop: build the demand, simulate seeds 1 to 10, pool each pair's simulated membership at the stations, refit. The loop has always run exactly three passes. Its stop rule has never fired. On the run of 2026-11-21 the flow change between passes was 3.65 seed standard errors after pass 1 and 1.46 after pass 2 for the shipped PM view, and 3.82 then 1.56 for the training view.

The method claims to compute a fixed point of estimation and assignment, the bi-level formulation of the OD-estimation papers in `docs/references.md` ([Cascetta1993], [Toledo2013], [Frederix2013]). Stopping at three passes with the rule unmet has no basis in the method. The simulator still overshoots the fit on the residential diagonal west of Colby Street even on fitted blocks (PM proxies: fit 42, simulated 60 on McAuley Street EB; the five diagonal stations count 178 and simulate 349 on the shipped demand and 453 on the training demand), and the remaining judged held-out misses are on that diagonal. Whether further passes move the diagonal, and which way, is open.

## What changes

- The loop's cap on passes is raised from three to eight for this round, behind the existing `--iterations` option whose default stays three. The stop rule, its limit (1 standard error) and the equal-weight pooling of all earlier passes are unchanged: pooling already is the method of successive averages, so no averaging option is added (design D1, D2).
- After each pass the loop names the views and periods that block the stop, says at the cap whether the rule was met, and writes a diagnostics report: flow and membership change, offered demand against the static fit, the seven judged held-out misses and the five diagonal stations (fitted value and simulated ten-seed mean), and the count of judged stations within GEH 5 on the pass's own seeds. All of it is report only (design D3).
- The loop keeps a copy of each pass's pooled files so that the pool after pass 2 can be compared with the published membership files (design D2).
- A runbook, zsh scripts and a keep-rule script for the laptop: baseline assessments, the loop with identity checks against the published loop, the candidate's assessments on seeds 1 to 10 and 11 to 20, the staged proposal search if the round passes, and a headline check for the standing publish authorization (design D4, D5).

No simulator change (fingerprint `6b886c8f52ee07397773ddd0ebbcb447`), no change to stations, split, scope or config. This change prepares code, runbook and scripts; no loop, assessment or search ran in the container that wrote it.

## Impact

- Code: `tools/lib/membership-loop.ts` (`stopDecision`), `tools/lib/membership-loop-run.ts`, `tools/membership-loop.ts` (`--watch`, the stop-rule line in the dry run), `tools/lib/loop-diagnostics.ts` (new). Tests in `tools/membership-loop.test.ts`.
- With the default options the loop builds the same demands, files and membership pools as before. Its log, its report and its loop folder gain lines, a diagnostics file and `pools/`.
- Spec: `demand-model` (four added requirements).
- If the round passes the keep rule and the improvement test on both seed sets, the staged proposal search, redistribution, results, text pages and previews run on the laptop into a staging folder. Nothing is published from the laptop.
