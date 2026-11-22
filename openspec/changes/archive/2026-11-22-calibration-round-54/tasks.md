## 1. Preparation (container)

- [x] 1.1 Read the router's cost code (`sim.rs` `update_costs`, `apply_mv_times`, `eff.rs` `mv_static`) and the scratch branch `router-diagnosis`; confirm the double charge
- [x] 1.2 Option `Config::single_control_charge` with the default `params::SINGLE_CONTROL_CHARGE` (false); `Eff::mv_ctrl` and `link_ctrl`; link cost and movement cost in `sim.rs` and `sim/initial.rs`; `calibrate --single-control-charge` and `--no-single-control-charge`
- [x] 1.3 Rust unit tests of the cost function in both modes (`crates/sim/src/tests/control_charge.rs`)
- [x] 1.4 Bit identity with the option off: PM seeds 1 and 2, native, against the build of e644ed9 (design D1)
- [x] 1.5 `cargo test -p traffic-sim --release`
- [x] 1.6 Stage 1 scoring script `tools/diag/control-charge-score.ts`, written and run on existing report folders
- [x] 1.7 Write the stage 1 bar and the keep rule (design D2, D4) before any run
- [x] 1.8 Record the fingerprints with the option off and, with the default flipped, on
- [x] 1.9 Spec delta (`specs/traffic-simulation/spec.md`), `runbook.md` and the scripts (`stage1.zsh`, `adopt.zsh`, `loop.zsh`, `assess.zsh`, `search.zsh`, `restore.zsh`, `pack.zsh`, `check-option.cjs`, `keep-rule.cjs`, `validation-diff.cjs`); `bash -n` on every script
- [x] 1.10 `npx vitest run tools/ worker/ src/lib`

## 2. Stage 1 (laptop, runbook.md)

- [x] 2.1 `stage1.zsh`: PM and AM, seeds 1 to 10, option off and on, shipped and cross-validation demand (laptop, 2026-11-21; the first run reused one folder for both periods, fixed in `evidence/laptop-stage1/laptop-fixes.diff`, and the second run reproduced it)
- [x] 2.2 Score under the judged scope and apply the bar (design D2): not met in either period (`evidence/stage1/score-*.md`)
- [x] 2.3 Pack the evidence on the development branch (`pack.zsh`, STAGE=stage1; `evidence/laptop-stage1/`)

## 3. Stage 2 (laptop, only if the bar is met and the project lead says go)

Not run: the stage 1 bar was not met. Every task in this section stays unticked on purpose.

- [ ] 3.1 Fill the baseline cells (design D4, runbook A)
- [ ] 3.2 `adopt.zsh`: flip the default, build, test, WASM, fingerprint
- [ ] 3.3 `loop.zsh`: the membership loop on the new router
- [ ] 3.4 `assess.zsh`: screen, validation suite, ten seeds, fresh seeds, keep rule
- [ ] 3.5 Reported lines (runbook F)
- [ ] 3.6 `search.zsh`, only if the keep rule passes
- [ ] 3.7 `restore.zsh`, then `pack.zsh` (STAGE=stage2)

## 4. Verdict (project lead)

- [x] 4.1 Leave the option off and do not merge the simulator code (design, "Outcome"). The published model stays round 52; no new proposals, results or redistribution set
