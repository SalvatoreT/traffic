## Why

The bicycle severity index uses motor vehicle speed where its cited study uses closing speed, then applies that curve to passing encounters without establishing that their geometry matches the study. The UI also adds pedestrian AIS4+ and cyclist MAIS3+ average scores into one "combined injury-risk index." These are different injury endpoints. A surrogate label does not explain either transformation.

Two methodological statements also exceed their evidence: the bibliography treats a London mean traffic reduction as a target for this simulator, and the prior audit calls fixed-demand displacement an upper bound. Neither establishes an expected value or a bound for an individual Rockridge result.

## What changes

- Define the safety score's supported kinematics and crash geometry, and disclose where an encounter falls outside them.
- Report pedestrian and cyclist scores separately, with their injury endpoint, encounter count, and averaging rule. Remove the combined score.
- Replace unsupported transfer and bound claims with the scope of the calculation and the cited observations.
- Add regression cases for equal car speeds with different cyclist speeds, empty encounter samples, and mixed injury endpoints.

## Capabilities

### Modified capabilities
- `traffic-simulation`: safety metrics retain their source's endpoint and input meaning.
- `simulator-ui`: safety summaries report separate measures with their exposure support.
- `interventions`: the fixed-demand caveat states the limits of comparison with external evidence.

## Impact

Implementation touches `crates/sim/src/sim/modes.rs`, the safety output contract, `src/lib/metrics.ts`, shared explanatory copy, generated reports, and the affected bibliography and audit paragraphs. Stored safety results require a version change or explicit legacy handling when their meaning changes.

## Out of scope

This change does not estimate crash reductions, choose or rank local traffic schemes, fit a new injury model, introduce behavioral demand response, or set new intervention effect targets. It is a proposal for later implementation, as requested on 2026-11-15; the present audit changes no simulator behavior.
