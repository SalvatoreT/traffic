## ADDED Requirements

### Requirement: Route-choice validation cases
The validation suite SHALL include route-choice cases that need no traffic: two routes of equal cost where one offers 1 or 20 side links onto the other (the share that stays on it SHALL be between 0.45 and 0.55), and two routes with no link in common where the costlier one is 15, 30, 60 and 120 s costlier (the share on it SHALL be within 0.03 of the probit prediction [Sheffi1985] eq. 11.20). Each case SHALL report what the per-node rule used before round 31 gives.

#### Scenario: The old rule on many junctions
- **WHEN** the suite runs case r2
- **THEN** its note gives the share the per-node rule keeps on the route with 20 junctions beside the share of the perceived-cost model

### Requirement: Route dispersion can be swept
`calibrate` SHALL accept `--route-dispersion <s>` and run with that dispersion in place of `ROUTE_DISPERSION_S`, recording it in the run manifest.

#### Scenario: Sweep
- **WHEN** a contributor runs `calibrate --seeds 1-4 --route-dispersion 4`
- **THEN** every seed runs with a dispersion of 4 s and the summary's manifest records it
