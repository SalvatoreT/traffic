## Decisions

Project lead, 2026-11-16: a Slow Street is one intervention, a 15 mph limit on every block of one named street inside the study area; the search offers Slow Streets only and drops per-block 15 and 20 mph; a Slow Street may share a street with a filter or a one-way; say honestly what a 15 mph limit does in the model.

### D1. Link form: a compact item, expanded for the engine

Chosen: `ss,<geohash>` with no parameter. The other option was to write one `sl` item per block and make every reader group them. Grouping needs a rule that decides which `sl` items belong to one street, and a hand-edited link would break it. The compact item also keeps the link short for a street with twenty blocks.

Stored-result keys and share paths hold. The key hashes the canonical link items. A Slow Street is always written at the middle of the lowest-numbered block of its run, so every block of the street gives the same item, the same key and the same share link. Old links keep their `sl` items and their keys. Nothing already stored is renamed.

The engine never sees `slow_street`. `explore::street::expand` turns each one into a `speed_limit` of 6.71 m/s on every block of the run that is faster than that, and the engine already applies those. It is called where the app builds the simulation (`wasm.rs`, for the config, `setInterventions` and the redistribution graph) and where the search runs and checks a package. `wasm.rs` and `explore/` are outside the simulator fingerprint (`crates/sim/fingerprint.rs`), so the fingerprint does not change. The TypeScript mirror (`src/lib/slowstreet.ts`) is used for labels, the editor, the map badge and the mock engine; a shared fixture (`links.json`) checks that the two sides write the same links and labels.

### D2. A street, and its run

A street is its trimmed link name. The run is the set of blocks with that name that lie in the study area (any link flagged `inStudyArea`) and connect to the chosen block through shared intersections. Blocks of the same name that the run does not reach make the label say "this connected stretch only, the street has another stretch in the study area". Unnamed links have no street, so a Slow Street cannot be placed on them. The two ends are the most distant pair of intersections that one block of the run touches; each is named by its cross streets, "the study-area edge" or "a dead end", and the pair is ordered by that text so both sides agree. Nothing here names a place: any area and any street works.

### D3. What a 15 mph limit does in the model

Read from `eff.rs` and `sim.rs`. The limit replaces the link's limit in both directions of a block. It does three things and nothing else:

- Desired speed. A driver's desired speed on the link is the limit times a personal factor drawn once from a normal distribution with mean 1 and standard deviation 0.12, clamped to 0.75 to 1.4. Drivers follow it with the usual car-following rules, so a Slow Street lowers the speed of cars on it to about 15 mph on average, and the fastest few percent of drivers still want 19 to 21 mph.
- Routing cost. The free-flow time of the link is length over the limit, so the route choice sees the street as slower and some trips divert. This is the only way traffic leaves a Slow Street.
- Turning and entry speeds. A movement is capped by the lower of the limits of its two links, and a car enters the link at no more than its desired speed.

ASSUMPTION, not calibrated and not sourced: full compliance on average. Every driver's desired speed scales with the signed limit, with no enforcement, no sign effect that differs from a posted limit and no physical measure (no humps, chicanes, narrowing). Observed speeds on streets that only change the sign are often well above the new limit; the model has no such lag. No transfer is claimed from any study: `[Grundy2009]` is about 20 mph zones that mostly include physical calming and reports injuries, not speeds, so it is not used to set this effect. No verified source in `docs/references.md` gives a compliance rate for signed slow streets, and none was added.

A block already at or below 15 mph keeps its limit; a Slow Street never raises a speed.

Modeling concerns for the project lead, none changed here:

1. Full compliance overstates how much a sign alone slows cars and how much traffic diverts. A partial-compliance factor needs a verified source before it enters the engine.
2. The speed spread (0.12 of the limit) is the same at every limit, so at 15 mph it is narrower in absolute terms than real speed spread on a signed street.
3. Diversion rests on free-flow time alone. A 100 m block at 15 mph costs a trip about 7 s more than at 25 mph, and the router weighs that against delay elsewhere, so small effects can sit below the noise band.
4. Speed limits in the extract come from OpenStreetMap tags (29 percent of ways tagged), so a street with no tag starts at a class default.
5. Walking, biking and crash effects of lower speeds are not modeled; the figures are cars only.

### D4. Candidates and places

Per-block 15 and 20 mph candidates are gone from candidate generation. A speed limit does not need one of the few locations that get filters and diverters, so the search looks at every street. A street becomes one candidate when its busiest block carries at least `SLOW_STREET_MIN_SHARE` (0.25, an assumption) of the through traffic of the busiest block in the baseline, every block of its run is a residential or service street in the study area, and at least one block is faster than 15 mph. It is ranked by that busiest block, so it sorts with the other candidates. A street with a non-local block (a collector or arterial piece) is not offered; the limit would reach it.

A Slow Street's place is `s:<street name>`, and a per-block speed limit adopted from a seeds file takes the same place. So:

- A Slow Street and a filter or one-way on the same street do not conflict and do not share a place: a filter on a Slow Street is a package.
- A Slow Street and a per-block limit on its street conflict, and two packages that differ only by that choice share their places, so the existing similarity rule folds them.
- Two separate stretches of one street name share a place. That is a simplification.

### D5. `--check-singles`

`explore --check-singles` (and `--check-subsets`) enter check mode even with no `--check LINK`. Singles scoring runs every candidate alone over all of `--periods` and `--seeds` at the screening length, paired with baseline runs of the same period, seed and length, and prints a header saying what was run. Any check flag with `--out` or `--report` is a usage error, and check mode never writes either file.

### D6. First measurement (not published)

Run with the published inputs, no demand rebuild, on the three periods (PM peak, AM peak, midday), seeds 1 to 3, 30 minute runs (the search's screening length). Through cars an hour on the side streets, mean of the three periods, baseline 542.2. Three seeds are too few for an interval (the method asks for ten), so these are screening-grade figures. The all-car rise is the largest on one block in any period, and the score is the search's (reduction in points less 0.1 times the ranking penalty).

| Package | Through cars an hour, before to after | PM peak | Largest all-car rise (block, period) | Score |
| --- | --- | --- | --- | --- |
| Slow Street on Colby Street | 542.2 to 482.0 (-11.1%) | 743 to 693 | +66, Hillegass Avenue 61st to 60th (PM) | +6.4 |
| Slow Street on Hillegass Avenue | 542.2 to 507.6 (-6.4%) | 743 to 711 | +39, Colby Street 60th to 61st (PM) | +5.8 |
| Slow Street on Forest Street | 542.2 to 533.6 (-1.6%) | 743 to 754 | +21, 62nd Street (PM) | +0.9 |
| Slow Street on Martin Street | 542.2 to 519.6 (-4.2%) | 743 to 711 | +38, Forest Street (PM) | +4.2 |
| Slow Street on Ayala Avenue | 542.2 to 524.4 (-3.3%) | 743 to 737 | +37, Martin Street (PM) | +2.5 |
| Slow Street on 57th Street | 542.2 to 530.0 (-2.3%) | 743 to 737 | +29, 58th Street (PM) | +2.3 |
| Slow Street on 62nd Street | 542.2 to 517.3 (-4.6%) | 743 to 709 | +18, Colby Street (PM) | +4.5 |
| Colby Street and Hillegass Avenue together | 542.2 to 428.7 (-20.9%) | 743 to 609 | +25, 62nd Street (PM) | +19.9 |
| Best single filter, 62nd Street and Hillegass Avenue | 542.2 to 473.1 (-12.7%) | 743 to 636 | +84, Colby Street 61st to 62nd (PM) | +7.5 |

The pair removes more than any single filter here, with a third of the filter's largest rise. One street alone mostly sends cars to its twin (Colby to Hillegass and back), which is why the pair does far better than either. Forest Street is within noise of zero.
