## Context

Baseline for this round: the published model (round 52, republished on the faster simulator 2026-11-21), scored under the judged scope of change `derived-targets-not-judged` (origin/derived-targets-not-judged, e644ed9: targets derived from a daily total are in the fit and not judged). Network 53c823f20d9165ed, demand config 2405ff02c92b2837, shipped demand 2d16d8f8eb0950ca. The simulator fingerprint of that branch is 6b886c8f52ee07397773ddd0ebbcb447.

Evidence read in the code before writing this design (crates/sim):

- `sim.rs` `update_costs`: the measured time of a link is an exponential moving average (`EMA_ALPHA` 0.3) of the times of vehicles that left it, refreshed every 60 s epoch. It includes queue, signal and stop wait. The link cost is `max(ff, ema)`.
- `eff.rs`: the movement cost `mv_static` is the turn penalty, the crossing time and a control constant from `crates/sim/data/node-delays.json` (signal 10 s, all-way stop 8, minor stop 14, circle 4).
- `sim.rs` `apply_mv_times`: the movement's cost is `mv_static` plus the excess of the movement's measured time over the link's, weighted by the link's class weight.
- So, once a link is measured, its cost holds the control wait and its movement cost adds the constant again. The constant is the free-flow prior of the static router (round 12); no record shows a decision to charge both.
- The double charge favors the residential diagonal over the arterial route to the SR-24 ramps (four signal approaches against one stop and one signal). The five diagonal stations in the PM peak count 178 veh/h; the simulator carries 349 on the shipped demand and 453 on the training view. The calibration record's "Router diagnosis for the diagonal" entry measured 901 on one seed with the constant charged twice and 767 with it charged once (single seed, cloud container, scratch branch `router-diagnosis`), with Colby St NB at 0.74 of its count against 0.71 and fitted passes 72 against 70.

The archived design of `ramp-and-colby-calibration` calls the double count "the same on every route"; the station counts above show it is not. The spec requirements "The router's control delays are measured in simulation and kept in one file" and "Route costs by turning movement" were never reconciled; the delta in this change does that.

## Decisions

D1 to D6 are the project lead's brief of 2026-11-22. The bar and the keep rule are written here before any run and are not to be changed after a result.

### D1: The option, off by default, selected as the other candidate options are

`Config::single_control_charge: Option<bool>` (JSON `singleControlCharge`) with the default `params::SINGLE_CONTROL_CHARGE` (false). `calibrate --single-control-charge` and `--no-single-control-charge` select it, as `--queue-first-left` and `--no-queue-first-left` select the queue-first rule; multi-seed runs pass the flag to their child processes. The repository's convention for a candidate simulator option is a `Config` field with a `calibrate` flag, and a round that adopts it flips the default (`queue_first_left` was adopted that way). The scratch branch's environment switch `ROUTER_CTRL_MODE` is therefore not used. The consequence for the other tools: `assess`, the membership loop and `explore` run `calibrate` or the library with default settings, so they see the option only after the default is flipped. Stage 1 uses the flag; stage 2 begins by flipping the default in one reviewed line (`scripts/adopt.zsh`) and then runs every tool unchanged. The report written by `calibrate` records `singleControlCharge: true` under `run.settings` when the option is on, and writes nothing new when it is off, so reports with the option off are unchanged.

Semantics (mode 2 of the scratch branch): the link cost is `max(ff + control constant at the link's end, ema)` and the movement cost is `mv_static - constant + excess`. The constant belongs to the link because it depends on the node's control and the approach, never on the exit. `Eff` carries `mv_ctrl` and `link_ctrl`; they are rebuilt with the interventions. The excess is computed against `max(ff, ema)`, as before, so a movement's measured excess does not change. A movement nobody takes in an epoch drifts toward the link's measured time (`max(ff, ema)`) and not toward the link cost, which with the option on already holds the floor; drifting toward the floor would put part of the constant back into the movement's excess. The scratch branch left that line alone, so its single-seed figures include the effect. The constant weighted by the class weight on the link side (1.25 on residential links, ASSUMPTION `LOCAL_COST_FACTOR`) and unweighted before: for an unmeasured residential link the total differs from the static prior by 0.25 times the constant. That follows from the brief and is listed under open questions. `initial_times` (initial placement) reads `mv_static` and `ff` and is untouched. The router's free-flow tables (`car_modal_static`) are untouched.

Bit identity with the option off, native, PM peak, seeds 1 and 2, the benchmark driver of `openspec/changes/archive/2026-11-20-accelerate-simulator-step/` (`bench/rockridge_hour.rs`, kept in this change's `bench/`), published network 53c823f20d9165ed and demand 2d16d8f8eb0950ca, 3,600 s, the same output file hashed with SHA-256: the reference build of e644ed9 and the new build give the same hashes, equal to the prefixes recorded by that change (`c1f58215af6c`, `7cde99a47415`). The proof is repeated in `evidence/identity.md` with the full hashes. With the option on, the hashes differ.

Fingerprint: the fingerprint hashes every `.rs` source, so it changes with this change: `54d3481e9681cd76489a3ff7611a6ebc` with the option off by default, against `6b886c8f52ee07397773ddd0ebbcb447` before. Flipping `SINGLE_CONTROL_CHARGE` at adoption changes it again, to `a4015e1a1343bec96e3f58995b2d6017` (`evidence/fingerprints.txt`).

The demand fit's static assignment (`tools/lib/assign.ts`) already counts control delay once (it subtracts the constant from the loaded link time), so the option brings the simulator's router in line with it. The constants file is unchanged.

### D2: Stage 1, the cheap diagnostic (laptop, about 5 minutes)

Inputs: the published shipped demand (2d16d8f8eb0950ca) and the cross-validation demand built by the derived-targets job (the training view that withholds 78 stations). Both were fitted with the router that charges twice, so stage 1 shows direction only: a demand refit on the new router (stage 2) can move every figure.

Runs: `calibrate` PM and AM, seeds 1 to 10, shipped and cross-validation demand, option off and on (`scripts/stage1.zsh`). Scoring: `tools/diag/control-charge-score.ts`, under the judged scope, per period and per view as `assess` scores them: fitted and held-out pass counts (recent, older and all) with fitted on the shipped demand and held out on the cross-validation demand; the five diagonal stations, sum and each, mean and standard error over seeds; Colby St NB, six blocks and whole street; all eight whole-street values (four per period); the D5 headline shares; the six arterial travel times; backlog; cars cleared from gridlock; through cars an hour.

Bar to proceed to stage 2, all of it, written before any run:

1. PM: the sum of the five diagonal stations on the shipped demand falls with the option on by more than twice its standard error. The standard error is that of the difference of the two ten-seed means (Welch: the square root of the sum of the squared standard errors of the two means).
2. No judged pass count falls by more than 1 with the option on, in either period and either view: the recent, older and all counts, fitted and held out, the D5 shares within 10 points, and the whole-street traversals within GEH 5.
3. Colby St NB whole street stays inside GEH 5 in PM and AM (option on).
4. Telegraph Ave NB and SB travel times stay in the observed range wherever the option-off time is inside it; where the option-off time is outside, the option-on time is no more than 10 s farther out. Shattuck Ave is outside its range in the baseline and is reported only.

The script prints each criterion as MET or NOT MET. Stage 2 is the project lead's call even when the bar is met; a bar that is not met ends the round and the evidence is the result.

### D3: Stage 2, the full round, only if stage 1 meets the bar

The fingerprint and the router both change, so the demand is rebuilt on the new router, not carried over. Order (`runbook.md`):

1. Adopt in code: flip `SINGLE_CONTROL_CHARGE` (`scripts/adopt.zsh`), build, run the Rust tests, build the WASM, record the fingerprint. From here every tool uses the new router with no flags.
2. Membership loop, three passes, both views, as in round 53 (`tools/membership-loop.ts`), with the published membership files moved aside. Pass 0 builds without membership and must equal the baseline's pass 0.
3. Three-seed screen, validation suite (`cargo run --release -p traffic-sim --bin validate`: record whether any primitive changes; no deviation is to be marked reviewed by anyone but the project lead), ten-seed assessment on seeds 1 to 10 (`--suffix r54 --noise`, no `--publish`), fresh-seed assessment on seeds 11 to 20.
4. The keep rule below, by `scripts/keep-rule.cjs`.
5. Only if the keep rule passes on both seed sets: the proposal search with the flags of round 52 (the search-c5 shape), `data:redistribution`, `data:results`, `data:assumptions`, `data:llms`, `data:previews`, all into a staging copy. Nothing is published from the laptop and no file under `public/data` outside the staging copy is left changed.

The simulator's router is used by the demand fit only through the membership loop (the pairs each simulated trip used). A candidate that passes needs its own proposals, results and redistribution, because their stamps carry the fingerprint and the demand hash.

### D4: The keep rule, written before any run

The baseline is the published model scored under the judged scope by the derived-targets laptop job, read from that job's assessment outputs for seeds 1 to 10 and 11 to 20 (`data/calibration/rockridge.assessment-derived.md` and `rockridge.assessment-derived-fresh.md` in its worktree; `scripts/keep-rule.cjs` reads them from paths given on the command line). The candidate is judged on the same seeds. The candidate passes only if no line is worse than the baseline on either seed set:

| Line | Baseline, seeds 1-10 | Baseline, seeds 11-20 |
| --- | --- | --- |
| PM recent fitted stations, GEH < 5 | PLACEHOLDER (expected 79 of 89) | PLACEHOLDER |
| PM recent held out | PLACEHOLDER (expected 14 of 18 before the new cross-validation demand) | PLACEHOLDER |
| AM recent fitted | PLACEHOLDER (expected 72 of 77) | PLACEHOLDER |
| AM recent held out | PLACEHOLDER (expected 15 of 19 before the new cross-validation demand) | PLACEHOLDER |
| D5 headline shares within 10 points | 4 of 4 | 4 of 4 |
| Whole-street traversals, GEH < 5 | 8 of 8 | 8 of 8 |
| D16 stability, every period | holds | holds |
| Validation suite | no pass lost against the published `validation.json` (67 of 74); the container saw case l1 fail with the default flipped (open question 1) | same |

The project lead fills the PLACEHOLDER cells from the derived-targets assessments before stage 2 starts. `keep-rule.cjs` also prints what it reads, so a wrong cell shows. The held-out baselines come from the derived job's cross-validation demand, which was fitted on the old router; the candidate's own cross-validation demand is fitted on the new one. That is the same arrangement as every earlier round. One figure below its baseline fails the candidate. The rule is not loosened after a result. The whole-street line and the fitted counts are fitted quantities in the shipped view; the held-out counts are the independent check, and the verdict says so.

Reported, not conditions: the five diagonal stations (sum and each), Colby St NB whole street and six blocks, the arterial travel times (Telegraph especially), through cars an hour, cars cleared from gridlock, backlog, every primitive of the validation suite, and the figures of stage 1 for comparison.

### D5: Transport and limits

Evidence goes to the development branch `salvatoret/peaceful-fermi-dlwt0u` as gzip parts of at most 190,000 bytes with `SHA256SUMS` (`scripts/pack.zsh`, modeled on the derived-targets pack). No `data:push`, no upload token on the laptop, no request to `https://traffic.transit.directory/api/*`, nothing to `main`. After each stage the published local data is put back from copies taken before the stage (the demand files and membership files are byte copies, because after the fingerprint changes `npm run data` stops on the published membership files); the scripts verify the hashes.

### D6: Time

Measured on the laptop on 2026-11-21 (round 52 restamp, M3 Pro): membership loop 3,777 s, `npm run data` 1,017 s, `validate` 18 s, a ten-seed `assess` of three periods and both views 70 s, the proposal search 2,736 s, redistribution 266 s, results 66 s. Estimates:

- Stage 1: eight ten-seed `calibrate` batches (PM and AM, two views, option off and on), about 12 s each with 12 jobs, so about 2 minutes of simulation plus the scoring and builds: 5 minutes.
- Stage 2: adoption build, tests and WASM 10 minutes; loop 65 to 75 minutes; validation, screen, ten seeds and fresh seeds 5 minutes; the keep rule at once. About 1 hour 35 minutes to the keep rule. If it passes, search 46 minutes, redistribution and results 6 minutes, text pages, previews and packing 3 minutes: about 2 hours 30 minutes in all. A stop after loop pass 1 saves about a quarter of the loop.

## Checked in the container (no simulation beyond what is listed)

- `cargo test -p traffic-sim --release` on the committed code (option off): 345 tests pass, 0 fail (the lib tests include seven new ones for the cost function).
- Bit identity with the option off, PM seeds 1 and 2, native (D1, `evidence/identity.md`); the option on gives different hashes (`bcb038abb261fe6b` and `114b8bc8ad77dc6f` on seeds 1 and 2).
- Single seed (PM, seed 1, shipped demand, a wiring check and not a result; `evidence/single-seed-sanity-pm.md`): the five diagonal stations sum to 456 veh/h with the option off and 306 on, against 178 counted; recent fitted passes 75 and 82 of 89; Colby St NB six blocks 0.85 and 0.84 of the count; whole-street traversals inside GEH 5 on 4 of 4 off and 4 of 4 on, but Colby St SB at GEH 4.7 and 5.0; Telegraph Ave SB travel time 434 s off and 473 s on (observed 300 to 376); cars cleared from gridlock 7 and 12 an hour; backlog 0.9% and 1.1%. Seed 1 alone cannot decide any bar line.
- With the default flipped in the working tree (not committed), `cargo test` fails one test, `validation_suite_has_no_new_failures`, and `validate` gives 66 of 74: case l1 (saturated signalized approach, 2 lanes, 20% left, 4,000 veh/h per lane offered) moves from 675.9 to 687.15 veh/h/lane, above the top of its range (680.66), so a pass is lost. The other 73 cases and every other test are unchanged. Cars in that fixture reroute on measured link times, so the case is sensitive to the router. See open question 1.
- `control-charge-score.ts` on an existing ten-seed report set used twice as both sets: the tables print and the bar lines report no change. The stage 1 numbers themselves are not known.

## Validation case l1

What it is. A four-leg cross with two lanes on every approach, a signal pinned to a 100 s cycle and 300 m legs ending at gate nodes. The west approach is offered 8,000 veh/h (80% through, 20% left into the north leg), the south and north approaches 8,000 veh/h through, the east approach 1,000 veh/h through (500 per lane opposing). The case measures the west approach's stop-line discharge per lane over 1,200 s after 300 s of warm-up, as the mean of seeds 1 to 10, against a band built from the permitted-left capacity model [Fambro1991] with the p1 to p3 parameters (top of the band 680.79 in the committed `validation.json`). Its cars use the router like any other: they carry perceived link and movement costs and re-plan.

Why a route cost can matter in a one-path fixture. A left-turner has a second path: through the signal, a U-turn at the dead-end east gate node, then back and right into the north leg. When the 3-vehicle pocket overflows, the left movement's measured time rises and some drivers take that detour. Counting completed trips over seeds 1 to 10 (`bench/l1_probe.rs`, `evidence/l1-probe.txt`), of about 1,010 west-to-north trips 101 detoured with the option off and 130 with it on (per seed 0 to 38 off and 0 to 42 on, set by each driver's perception draw). A detouring car crosses the west stop line as a through movement, free of the permitted-left gap rule, and no longer waits in the pocket queue that blocks the lane behind it, so the approach discharge rises with the detour share.

Size against the seed spread. Per-lane discharge, seeds 1 to 10, option off and on: mean 675.90 and 687.15 (+11.25); standard deviation of one seed 40.2 and 31.0; standard error of a mean 12.7 and 9.8, so about 16 for the difference. Seeds 2 and 9 are identical off and on, seeds 1, 4, 6 and 10 rise, seed 5 falls. The green share is the same (0.4929 both). The change is about 0.7 standard errors of the difference. Neighboring settings move the off figure as much: route dispersion 0 gives 678.8 off and 686.4 on, guided share 0 gives 687.2 off and 687.6 on, both 0 give 681.6 and 689.3. The case's mean therefore sits between about 676 and 689 under small, unrelated perturbations, around a top of 680.8.

Real or artifact. It is not a capacity increase in the primitive. The figure counts every car that crosses the west stop line, so a change in how many left-turners take the detour changes the movement mix being counted, while the band assumes every left-turner turns left at that approach [Fambro1991]. The on-figure is no less consistent with the reference than the off-figure: both have a detour share of 10 to 13%, and neither follows the reference's fixed-turn assumption. I did not find a lane-sorting effect and did not trace lane choice; the detour counts above are the mechanism shown.

Other cases. With the default flipped, `validate` (before and after the drift change) differs from the committed run in case l1 only: the simulated value of each of the other 73 cases is identical, so none moves by 1% or more.

Is there a principled change that keeps single charging and keeps l1 inside its range? No bug in what was built explains the move, and nothing was changed. The extra 0.25 times the constant on unmeasured residential links does not apply: every link in the fixture is Secondary class, route weight 1. The honest position is that l1 sits at the edge of its band (675.9 against a top of 680.8, with a standard error of 10 to 13 on the mean) and that the option, like several unrelated perturbations, tips it over. Whether to accept the loss, change the fixture so that left-turners have no detour, or review the band is the project lead's call. `validate.rs` and the deviations file are untouched.

## Deviations from the brief

- The option is selected by a `Config` field and a `calibrate` flag, not by an environment variable (D1). Stage 2 adopts it by flipping the default, because `assess`, the loop, `explore` and the WASM build take no simulator flags. A wrapper script as `CALIBRATE_BIN` would reach `calibrate` only, not `explore` or the WASM build.
- Stage 2's "restore the published local data" is a copy of saved files, not a rebuild, because after the fingerprint changes `npm run data` stops on the published membership files.
- Unused movements drift toward the measured link time, not the link cost (D1), which differs from mode 2 of the scratch branch.

## Open questions

- Validation case l1 loses its pass when the default is flipped (container check above, and section "Validation case l1": a sampling-edge effect through left-turn detours), so the keep-rule line "validation suite: no pass lost" fails at adoption unless the project lead decides otherwise. Options: accept l1 as a loss and say so in the verdict; pin `validate`'s configuration to the option off, since the suite tests primitives (a change to `validate.rs` that is the project lead's to make); or review the case. `adopt.zsh` stops on the failing test and does not edit it. No deviation is marked reviewed here.
- Whether the project lead wants the 0.25 times the constant that the class weight adds to unmeasured residential links (D1) removed, by charging the constant on the movement side for unmeasured links. The brief fixes mode 2, so it is as the scratch branch had it.
- The baseline cells (D4) need the derived-targets job's figures.
