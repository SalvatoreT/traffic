# Round 52 evidence (laptop run, 2026-11-19)

This round ran the runbook as written. The run went from 9:59 PM to 11:43 PM PST, with code at `4f5a783`. Simulator fingerprint `d45a275dd7be0713cec6a64394b7d8a9`.

## Result

- **Gate (step B).** The baseline rebuilt to `53c823f20d9165ed 9cdebdabf05c4460 2f9ae152b9bbf78e`, and nothing under `data/` changed.
- **Loop (step D).** The loop ran passes 0, 1 and 2 and then the final build. Neither the abort nor the early stop fired.
  - Candidate config: `2405ff02c92b2837`.
  - Candidate demand: `2d16d8f8eb0950ca`. Cross-validation demand: `1c3b1666f24156f1`.
  - Membership files: `3d639670c1feb38f` and `c1cd4ce96fb28791`.
  - In the final shipped PM build, offered car demand was 10.3% below the static fit. In this round that figure is reported, not a stop.
- **Screen (step E).** Passed.
- **Keep rule (step F).** All eight lines pass on seeds 1 to 10 (`keep-rule.md`). Validation is 67 of 74.
- **Fresh-seed confirmation (step G).** It holds: on seeds 11 to 20 the candidate is no worse than the baseline on any keep-rule line (`confirm/confirm.md`).
- **Restore.** After each run the baseline was back: hashes `53c823f20d9165ed 9cdebdabf05c4460 2f9ae152b9bbf78e`, config `505dd0f032fc7ae8`, clean status.

Adopting the candidate is the lead's and the project lead's decision.

## Files

- `baseline/`, `baseline-hashes.txt`: the step B and C outputs.
- `dry-run.txt`, `loop.txt`, `membership-loop.md`, `state.json`, `candidate-hashes.txt`, `low-demand.txt`, `gate-totals.txt`: the loop's output.
- `fit/`: the final build's fit reports and the stations file.
- `build-logs/`: the last 40 lines of each build log.
- `node-prior-csv/`: the ceiling stations of the final builds.
- `route-fit-*.md`: the fit's own route and block values for each build.
- `nodes-*.md`: where the offered demand changed, by node.
- `screen-r52.*`, `decision-r52.txt`: the candidate screen.
- `rockridge.assessment-r52.md`, `assess-r52.txt`, `validate-r52.txt`, `keep-rule.md`: the ten-seed assessment and the keep rule.
- `route-sim-*.md`, `shares-pm.md`: the ten-seed route and block values, and the PM shares.
- `reported/`: the reported lists of design D5, baseline against candidate:
  - diagonal stations, Colby Street NB blocks, SR-24 ramps
  - station flips, through cars, SR-24 mainline gates, demand by gate
  - backlog by gate
  - arterial travel times
- `confirm/`: the fresh-seed confirmation.
- `membership/`: the candidate's membership files, split into parts (see its README).
- `laptop/`: the scripts that drove the run and the chain log, with local paths replaced by `<worktree>` and `~`.
