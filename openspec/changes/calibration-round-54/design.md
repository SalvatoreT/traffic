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

Semantics (mode 2 of the scratch branch): the link cost is `max(ff + control constant at the link's end, ema)` and the movement cost is `mv_static - constant + excess`. The constant belongs to the link because it depends on the node's control and the approach, never on the exit. `Eff` carries `mv_ctrl` and `link_ctrl`; they are rebuilt with the interventions. The excess is computed against `max(ff, ema)`, as before, so a movement's measured excess does not change. The constant weighted by the class weight on the link side (1.25 on residential links, ASSUMPTION `LOCAL_COST_FACTOR`) and unweighted before: for an unmeasured residential link the total differs from the static prior by 0.25 times the constant. That follows from the brief and is listed under open questions. `initial_times` (initial placement) reads `mv_static` and `ff` and is untouched. The router's free-flow tables (`car_modal_static`) are untouched.

Bit identity with the option off, native, PM peak, seeds 1 and 2, the benchmark driver of `openspec/changes/archive/2026-11-20-accelerate-simulator-step/` (`bench/rockridge_hour.rs`, kept in this change's `bench/`), published network 53c823f20d9165ed and demand 2d16d8f8eb0950ca, 3,600 s, the same output file hashed with SHA-256: the reference build of e644ed9 and the new build give the same hashes, equal to the prefixes recorded by that change (`c1f58215af6c`, `7cde99a47415`). The proof is repeated in `evidence/identity.md` with the full hashes. With the option on, the hashes differ.

Fingerprint: the fingerprint hashes every `.rs` source, so it changes with this change (values in tasks 1.8). Flipping `SINGLE_CONTROL_CHARGE` at adoption changes it again, because `params.rs` changes.

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
| Validation suite | no pass lost against the published `validation.json` (67 of 74) | same |

The project lead fills the PLACEHOLDER cells from the derived-targets assessments before stage 2 starts. `keep-rule.cjs` also prints what it reads, so a wrong cell shows. The held-out baselines come from the derived job's cross-validation demand, which was fitted on the old router; the candidate's own cross-validation demand is fitted on the new one. That is the same arrangement as every earlier round. One figure below its baseline fails the candidate. The rule is not loosened after a result. The whole-street line and the fitted counts are fitted quantities in the shipped view; the held-out counts are the independent check, and the verdict says so.

Reported, not conditions: the five diagonal stations (sum and each), Colby St NB whole street and six blocks, the arterial travel times (Telegraph especially), through cars an hour, cars cleared from gridlock, backlog, every primitive of the validation suite, and the figures of stage 1 for comparison.

### D5: Transport and limits

Evidence goes to the development branch `salvatoret/peaceful-fermi-dlwt0u` as gzip parts of at most 190,000 bytes with `SHA256SUMS` (`scripts/pack.zsh`, modeled on the derived-targets pack). No `data:push`, no upload token on the laptop, no request to `https://traffic.transit.directory/api/*`, nothing to `main`. After each stage the published local data is put back from copies taken before the stage (the demand files and membership files are byte copies, because after the fingerprint changes `npm run data` stops on the published membership files); the scripts verify the hashes.

### D6: Time

Measured on the laptop on 2026-11-21 (round 52 restamp, M3 Pro): membership loop 3,777 s, `npm run data` 1,017 s, `validate` 18 s, a ten-seed `assess` of three periods and both views 70 s, the proposal search 2,736 s, redistribution 266 s, results 66 s. Estimates:

- Stage 1: eight ten-seed `calibrate` batches (PM and AM, two views, option off and on), about 12 s each with 12 jobs, so about 2 minutes of simulation plus the scoring and builds: 5 minutes.
- Stage 2: adoption build, tests and WASM 10 minutes; loop 65 to 75 minutes; validation, screen, ten seeds and fresh seeds 5 minutes; the keep rule at once. About 1 hour 35 minutes to the keep rule. If it passes, search 46 minutes, redistribution and results 6 minutes, text pages, previews and packing 3 minutes: about 2 hours 30 minutes in all. A stop after loop pass 1 saves about a quarter of the loop.

## Checked in the container (no simulation beyond what is listed)

- `cargo test -p traffic-sim --release`: the lib tests (including six new ones for the cost function), the integration tests and the doc tests pass.
- Bit identity with the option off, PM seeds 1 and 2, native (D1); the option on gives different hashes (`7611f06cc05654a0` and `7fed48e4d573fc07` on seeds 1 and 2).
- `control-charge-score.ts` on an existing ten-seed report set used twice as both sets: the tables print and the bar lines report no change. The stage 1 numbers themselves are not known.

## Deviations from the brief

- The option is selected by a `Config` field and a `calibrate` flag, not by an environment variable (D1). Stage 2 adopts it by flipping the default, because `assess`, the loop, `explore` and the WASM build take no simulator flags. A wrapper script as `CALIBRATE_BIN` would reach `calibrate` only, not `explore` or the WASM build.
- Stage 2's "restore the published local data" is a copy of saved files, not a rebuild, because after the fingerprint changes `npm run data` stops on the published membership files.

## Open questions

- Whether the project lead wants the 0.25 times the constant that the class weight adds to unmeasured residential links (D1) removed, by charging the constant on the movement side for unmeasured links. The brief fixes mode 2, so it is as the scratch branch had it.
- The baseline cells (D4) need the derived-targets job's figures.
