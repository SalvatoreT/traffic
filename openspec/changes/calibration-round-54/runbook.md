# Round 54 runbook: the router charges control delay once, on a laptop

Base: `origin/calibration-round-54` (branches from `origin/derived-targets-not-judged`, e644ed9, which sits on main c9ad585 and does not judge targets derived from a daily total). Run every command from the repository root of a checkout of that branch; stage 1 needs nothing else. Commit results on branch `salvatoret/peaceful-fermi-dlwt0u` through `scripts/pack.zsh`, never on `main`.

Status of each step in the container that wrote this file: RAN (run there), UNTESTED (written from reading the tools, never run). What ran there: `cargo test -p traffic-sim`, the bit-identity check of design D1, a single-seed PM run with the option on, `tools/diag/control-charge-score.ts` and `scripts/keep-rule.cjs` on existing assessment output, `bash -n` on every script. Not run there: every script (`stage1.zsh`, `adopt.zsh`, `loop.zsh`, `assess.zsh`, `search.zsh`, `restore.zsh`, `pack.zsh`), the membership loop, `assess`, `explore`, the demand builds, the WASM build.

Never: push to `main`, `npm run data:push`, `npm run data:split`, any request to `https://traffic.transit.directory/api/*`, an upload token or any secret in a message or a file, `--publish` on an assessment, marking a validation deviation reviewed (only the project lead does), editing a membership file, the demand config or the keep rule after a run has started, loosening the bar or the keep rule after a result. Reports, assessments and the per-seed folders are variant output sets (`--suffix`).

## What this round decides

The router option `single_control_charge` (design D1) charges each junction's control delay once. Stage 1 asks whether the direction is right on the published model; stage 2 asks whether a model refitted on the new router beats the published one under the judged scope. The bar and the keep rule are in design.md D2 and D4 and are not repeated here.

## Time

Stage 1: 5 minutes. Stage 2: about 1 hour 35 minutes to the keep rule (adoption build and tests 10 minutes, loop 65 to 75, validation, screen and the two assessments 5), and, only if the keep rule passes, 55 minutes more (search 46, redistribution and results 6, text pages, previews and packing 3). Basis: design.md D6.

## Stage 1: the cheap diagnostic

Needs the git-ignored data in the checkout: `data/osm/*`, `public/data/rockridge.network.json` (53c823f20d9165ed) and `public/data/rockridge.demand.json` (2d16d8f8eb0950ca), `target/membership/*`, and the cross-validation demand of the derived-targets job (its `target/validation/rockridge.demand.json`).

```
git fetch origin
git checkout calibration-round-54
npm install
CV=<derived-targets worktree>/target/validation/rockridge.demand.json JOBS=12 zsh openspec/changes/calibration-round-54/scripts/stage1.zsh
```

Set `CV_HASH` to the first 16 characters of that file's SHA-256 once the project lead has it (the script prints it either way). The script builds `calibrate`, checks the network and shipped demand, and for PM and AM runs seeds 1 to 10 on the shipped and the cross-validation demand with `--no-single-control-charge` and `--single-control-charge`, confirms with `scripts/check-option.cjs` that every report says which it was, and scores each period with `tools/diag/control-charge-score.ts`. It writes nothing under `public/data` or `data/`. Output: `openspec/changes/calibration-round-54/evidence/stage1/score-pm_peak.md` and `score-am_peak.md`; the four bar lines of design D2 are printed at the end and in `target/r54-stage1/chain.log`.

Read the bar for both periods: the diagonal criterion is read for PM; the pass-count, Colby St NB and Telegraph criteria in each period. The shipped and cross-validation demands were fitted with the router that charges twice, so a result is a direction. Report the full tables, not only the bar lines: the five diagonal stations each, all eight whole-street values, D5 shares, travel times, backlog, cars cleared from gridlock, through cars an hour.

Then, always:

```
STAGE=stage1 W=$PWD DEV=<checkout of salvatoret/peaceful-fermi-dlwt0u> zsh openspec/changes/calibration-round-54/scripts/pack.zsh
```

Restore after stage 1: nothing under `public/data`, `data/` or `target/membership` was written, so there is nothing to restore; `git status --short` must show nothing under `data/` or `public/`. If the bar is not met, stop here and report.

## Stage 2: the full round (only if stage 1 met the bar and the project lead says go)

### A. Baseline figures to fill in (project lead)

Before the run, fill the PLACEHOLDER cells of design.md D4 from the derived-targets job's assessments and pass them as `EXPECT` to the keep rule so that a wrong file shows. Expected from arithmetic: PM fitted 79 of 89, PM held out 14 of 18, AM fitted 72 of 77, AM held out 15 of 19, the last two before the new cross-validation demand.

| Cell | Value (PLACEHOLDER: fill in) |
| --- | --- |
| Baseline file, seeds 1-10 | `<derived worktree>/data/calibration/rockridge.assessment-derived.md` |
| Baseline file, seeds 11-20 | `<derived worktree>/data/calibration/rockridge.assessment-derived-fresh.md` |
| PM recent fitted, seeds 1-10 / 11-20 | PLACEHOLDER |
| PM recent held out, seeds 1-10 / 11-20 | PLACEHOLDER |
| AM recent fitted, seeds 1-10 / 11-20 | PLACEHOLDER |
| AM recent held out, seeds 1-10 / 11-20 | PLACEHOLDER |
| Derived job's per-seed folders (for step F) | PLACEHOLDER (`target/assess-seeds/` names, shipped and cross-validation, seeds 1-10 and 11-20) |

### B. Adopt in code

```
zsh openspec/changes/calibration-round-54/scripts/adopt.zsh
```

It checks that `SINGLE_CONTROL_CHARGE` is false, records the fingerprint, flips it to true, builds, runs `cargo test -p traffic-sim --release`, builds the WASM and runs `npm run check:wasm`, writes `evidence/fingerprints.txt` (old and new) and commits on the checked-out branch. Tests that fail with the option on are reported and not edited: stop and send back `target/r54/cargo-test.log`. From here every tool routes with the control delay charged once and needs no flag.

### C. The membership loop

```
JOBS=12 zsh openspec/changes/calibration-round-54/scripts/loop.zsh
```

It checks the published inputs (config 2405ff02c92b2837, network 53c823f20d9165ed, shipped demand 2d16d8f8eb0950ca, shipped membership 56e688e7e5749d23), copies the published local data to `target/r54/saved/` (byte copies with hashes), moves the published membership files aside, prints the dry run and runs `tools/membership-loop.ts` (three passes at most, PM and AM, both views). The dry-run counts to compare: shipped PM 337 selected (245 link, 92 movement or route), AM 272 (200, 72), six gate stations static; training PM 267 (198, 69), 2 static, 74 withheld; AM 212 (159, 53), 2 static, 64 withheld (derived-targets runbook). Pass 0 builds without membership, so its periods must equal the published demand's; the script prints "equal" or "DIFFERENT". On any stop or abort of the loop (offered demand above +3% of the static fit), send back `target/r54/loop.log`, `target/membership-loop/logs/` and `data/demand/rockridge.fit*.md` and do nothing else: no `--resume`, no config change.

When the loop ends, the candidate demand is in `public/data/rockridge.demand.json`, its cross-validation demand in `target/validation/rockridge.demand.json`, and its membership files in `target/membership/`; copies are in `target/r54/cand/` and the hashes in `evidence/candidate-hashes.txt`.

### D. Validation, screen and assessments

```
BASE1=<derived worktree>/data/calibration/rockridge.assessment-derived.md BASE2=<derived worktree>/data/calibration/rockridge.assessment-derived-fresh.md EXPECT="pm_fitted=...,pm_held=...,am_fitted=...,am_held=..." JOBS=12 zsh openspec/changes/calibration-round-54/scripts/assess.zsh
```

Steps: three-seed screen (diagnostic, no verdict), `validate` (the suite writes `data/calibration/validation.json` and `.md`; the script compares them with the committed ones with `validation-diff.cjs`, keeps the output in `evidence/` and checks the committed files back out), the ten-seed assessment `--suffix r54 --noise` and the fresh-seed assessment `--seeds 11-20 --suffix r54-fresh`, then `keep-rule.cjs`. Outputs: `data/calibration/rockridge.assessment-r54.md`, `...-r54-fresh.md`, `evidence/keep-rule.md` (it ends "Keep rule: PASSES" or "Keep rule: FAILS", with the line that failed), `evidence/validation-diff.txt` (whether any primitive changed; no deviation is marked reviewed). Per-seed reports are in `target/assess-seeds/` under the names the suffix gives (`60r54`, `60r54-cv`, `60r54-fresh`, `60r54-fresh-cv` if the earlier pattern holds; if they differ, say so).

`EXPECT` is optional. A baseline file that does not match it is printed as DIFFERS; the keep rule still compares candidate with file.

### E. The keep rule

Read `evidence/keep-rule.md`. It lists the baseline and candidate values side by side with the files' input hashes, compares each line on the same seeds and ends with the verdict. A failing line fails the candidate; the evidence is the result. Put the published data back (step H) and report. If it passes, go to step G.

### F. Reported, not conditions

For both periods and both seed sets, baseline against candidate, from the per-seed folders (the derived job's for the baseline, step A):

```
for p in pm_peak am_peak; do
  npx tsx tools/diag/control-charge-score.ts --period $p --seeds 1-10 --set base=<derived ship dir>,<derived cv dir> --set cand=target/assess-seeds/60r54,target/assess-seeds/60r54-cv | tee openspec/changes/calibration-round-54/evidence/score-$p-1-10.md
  npx tsx tools/diag/control-charge-score.ts --period $p --seeds 11-20 --set base=<derived fresh ship dir>,<derived fresh cv dir> --set cand=target/assess-seeds/60r54-fresh,target/assess-seeds/60r54-fresh-cv | tee openspec/changes/calibration-round-54/evidence/score-$p-11-20.md
done
```

The five diagonal stations (sum and each), Colby St NB whole street and six blocks, all eight whole-street values, D5 shares, arterial travel times (Telegraph especially), backlog, cars cleared from gridlock and through cars an hour. The script's last section applies the stage 1 bar to these pairs; it is not part of the keep rule.

### G. The staged search, redistribution and results (only if the keep rule passed)

```
JOBS=12 zsh openspec/changes/calibration-round-54/scripts/search.zsh
```

It refuses to run unless `evidence/keep-rule.md` says "Keep rule: PASSES". It copies `public/data` aside, seeds the search as round 52 did (`target/batches/search-c5/{proposals.json,report.md}`, the committed `data/proposals/rockridge.seeds.json`), runs `explore` with round 52's flags (`--periods pm_peak,am_peak,midday --seeds 1-3 --confirm-seeds 101-110 --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60`), then `data:redistribution`, `data:results`, `data:assumptions`, `data:llms` and `data:previews`, copies the outputs to `target/r54/staged/` and puts `public/data` back. Nothing is published.

### H. Put the published local data back, then pack

```
zsh openspec/changes/calibration-round-54/scripts/restore.zsh
STAGE=stage2 W=$PWD DEV=<checkout of salvatoret/peaceful-fermi-dlwt0u> zsh openspec/changes/calibration-round-54/scripts/pack.zsh
```

`restore.zsh` copies the saved published files back and checks their hashes (network 53c823f20d9165ed, shipped demand 2d16d8f8eb0950ca, shipped membership 56e688e7e5749d23, config 2405ff02c92b2837) and `git status --short`. It is a copy, not a rebuild: after the fingerprint changes, `npm run data` stops on the published membership files. The adoption commit stays on the round branch; the project lead decides what happens to it.

## What to report

- Stage 1: every table of both scores, the four bar lines, and the wall time of the script against 5 minutes.
- Stage 2: the fingerprints (`evidence/fingerprints.txt`), the loop's pass lines and wall time against 65 to 75 minutes, `keep-rule.md`, `validation-diff.txt`, step F, and, if it ran, the staged search's report and wall times against 46 minutes (search) and 6 (redistribution and results).
- Any stop, any difference from the identity checks, and every place a script did not do what this file says.
