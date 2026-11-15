## Why

The assessment calls its held-out scores out of sample, but some held-out targets are algebraic transformations of observations still used for fitting. The same observations also enter the demand prior before the split. Separately, reusing seed reports can combine one run's measurements with another run's stability verdict. These defects weaken the evidence for the baseline and any comparison made from it.

## What Changes

- Split validation data by source-observation dependencies before constructing count-derived demand, with a recorded split manifest.
- Keep every derivative of a withheld observation out of fitting and count-derived preprocessing. Declare spatially overlapping constraints and the limits of a diagnostic holdout.
- Require complete, compatible run manifests before an assessment can issue a calibration or stability verdict. Recompute verdicts from the runs being assessed.
- Put variant summaries, noise files, and assessments in a separate output set; make replacement of published evidence explicit.
- Carry the current primitive-validation results and known deviations into the assessment, with their implications for the intended comparisons.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `calibration`: observation lineage, assessment provenance, output isolation, and primitive-evidence coverage.

## Impact

Code: `tools/build-demand.ts`, `tools/lib/{demand-fit,acceptance,volunteer-count,assess,verdict}.ts`, `tools/assess.ts`, and native calibration/validation report producers. Data: observation and run manifests, assessment reports, and calibration claims.

The user requested proposals for later implementation on 2026-11-15. This change remains open; implementation tasks are unchecked. Out of scope: retuning demand, changing numerical acceptance thresholds, collecting new counts, fixing simulator physics, or claiming the current model is independently validated.
