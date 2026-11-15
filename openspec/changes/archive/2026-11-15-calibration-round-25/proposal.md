## Why

Round 24 left three mismatches. Colby St northbound had 80 whole-street cars against 102 counted and a freeway share of 37.7% against 47% (9.3 points, 0.7 inside the limit). The 52nd St and Clifton St off-ramps carried 900 and 883 veh/h against 1,024 and 617 counted. Counts older than five years passed 50% of PM stations (AM 44%, midday 59%) while the fit's median factor on counted flows sat at its lower bound.

The traces say where each comes from. The Colby St through intents reach the Alcatraz Ave turn from 63rd St as often as from the south end, so 29.5 through cars per run joined the street mid-block where the count says the whole-street cars enter at Claremont Ave. The ramp choice was made by the simulator's costs, and the two Claremont Ave ramps differ by seconds for most destinations; the 2010 count at the Clifton St terminal has 67 of 617 cars turning south and the model had 193. The static fit already met the counts on both points. The older counts are met by the static assignment (83% pass) and missed by the simulator, which carries 0.84 of the static volume on the west corridors, so the seed table is not the cause there.

## What Changes

- The demand builder divides every off-ramp flow over the ramps its final static assignment uses and writes the ramp as the flow's `via` (`ramps.choice`). Volumes do not change.
- Ramp counts (Caltrans ramp rows and the ramp legs of intersection counts) keep full weight in the recency rule (`countFit.recency.exemptRamps`).
- An assumed movement can name a whole-street route of the volunteer count, and an intent of it can require that route (`wholeStreet`). The Colby St northbound through intents use it, with 0.47 (off-ramp) and 0.15 (south side) of the exits.
- `calibrate` can write the trails of trips that use given links (`CAL_DUMP_PATH_TRIPS`). The builder skips the cross-validation fit when `SKIP_CV` is set (experiments only).
- The calibration note and caveat of the area carry the new numbers. Tests of a lower fit bound, lower local trip rates, the changes taken apart and the delays against the worksheets are in the record.

## Impact

- `tools/lib/ramp-choice.ts`, `tools/lib/recency.ts`, `tools/lib/assumed-movements.ts`, `tools/lib/demand-fit.ts`, `tools/build-demand.ts` and their tests
- `crates/sim/src/bin/calibrate.rs`
- `data/demand/rockridge.config.json`, `data/areas/rockridge.json`, `data/calibration/*` (record, assessment, reports), `data/demand/*` (fit reports, README)
- Network hash 5fe8241a6ba1e306 (unchanged), demand hash 74a9882dd4286e12 to 8695ddc28b152c35
