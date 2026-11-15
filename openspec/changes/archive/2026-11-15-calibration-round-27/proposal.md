## Why

The simulator fixes of round 26 landed (libm parity, start-up agents honor `via`, a stale-via fix, per-intent tally by ramp, two-stage `via` for the mainline-gate assumed flows) and the demand was rebuilt on the final tree. The round 26 numbers were measured on an earlier binary, and two findings were open: Colby St northbound had 151 through cars against 102 to 145, and the PM held-out stations passed 17 of 22.

## What changes

- The full assessment is rerun on the final tree, all three periods, ten seeds, with the cross-validation demand for the held-out column.
- The assessment lists the recent held-out stations that fail out of sample, with the same station on the shipped demand, so a failing held-out figure comes with its causes.
- The causes of the two findings are recorded. No model or demand change was made.
- `calibration.note` and `caveat` carry the numbers of this run. `data/calibration/README.md` no longer mentions `--legacy-reroute`.
