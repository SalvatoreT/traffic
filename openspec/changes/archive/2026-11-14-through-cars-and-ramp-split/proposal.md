## Why

The owner's use of the model is cut-through traffic on Hillegass Ave and Colby St. The round 18 through check compared modeled through cars with observed volume times freeway share, which is not a through count: freeway trips that end inside the study area are in the share. The volunteer count holds a better reading (cars that drove the whole street, cars whose trip ended along it). The demand also loaded census blocks across the study-area boundary onto the boundary corners, which are study-area nodes, so cars bound for places across Alcatraz Ave ended at the corner and were neither through cars nor turning cars. Headline freeway shares were 16 points off.

## What Changes

- The calibrate report states an observed through range per block (whole-street cars up to block volume less end-along cars) and keeps the old product as observed freeway-end trips.
- The demand build loads a census block only onto nodes on its own side of the study-area boundary (`local.sideRule`).
- The through share of the counted whole streets is applied to the entries of four streets with no whole-street count, which lowers the count-implied study-area trip ends from 927 and 940 to 804 and 817 (PM). The scale cap on local trip rates rises from 4 to 8.
- Route-share targets weigh 3 in the fit (was 0.5) and whole-street counts 1 (was 0.5).
- An optional cap on the freeway pairing of study-area ends (`ramps.studyEndFreewayCap`) is added and left off.

## Impact

- `crates/sim/src/bin/calibrate.rs`, `data/calibration/rockridge.targets.json`
- `tools/build-demand.ts`, `tools/lib/volunteer-count.ts`, `data/demand/rockridge.config.json`
- Demand changes; the network does not.
