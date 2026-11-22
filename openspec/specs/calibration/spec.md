# calibration Specification

## Purpose
TBD - created by archiving change baseline-calibration. Update Purpose after archive.

## Requirements

### Requirement: Headless calibration run
The project SHALL provide a command that runs the baseline simulation natively for a chosen period and duration and writes a report comparing modeled select-link shares with the observed targets for the area.

#### Scenario: Running calibration
- **WHEN** a contributor runs the calibration command for Rockridge
- **THEN** a report lists each observed share, the modeled value and the difference, plus network-health indicators

### Requirement: Select-link analysis
The simulation SHALL be able to record, for nominated links, the origins, destinations and upstream/downstream streets of trips traversing them.

#### Scenario: Freeway share on a residential street
- **WHEN** select-link analysis is enabled for a block of Hillegass Avenue
- **THEN** the share of traversing trips that originated at a freeway gate is reported

### Requirement: Stable baseline
The published baseline SHALL be judged over the fixed seed list 1 to 10 on each period's 60-minute run at full demand, with the thresholds read from the area's targets file. It is stable when the mean of the judged cars cleared from gridlock is below 1.0 per hour, the entry backlog is below 2% of spawned trips in at least 9 of 10 seeds, no seed adds more than 2.0 points of spawned trips to the backlog in the second half, and the seed mean of the arterial speed is above 4 m/s. The judged cars cleared from gridlock are those held in the area's judged zone (the study area, its bounding streets and the junctions on them, and every node within the area config's buffer distance of them along the network) and those held farther out whose chain of vehicles held by a full exit reaches a link in the zone. When the area config has no judged zone, or a run carries no near and far split, every car cleared from gridlock is judged.

#### Scenario: Full-demand runs over ten seeds
- **WHEN** the baseline runs for 60 simulated minutes at demand scale 1.0 with seeds 1 to 10
- **THEN** the report states, per check, the result and whether the rule holds, and one removal in one seed does not by itself change the verdict

#### Scenario: Gridlock far from the study area
- **WHEN** cars are cleared from gridlock only at nodes outside the judged zone and no blocking chain of theirs reaches the zone
- **THEN** they do not count against the rule, and the report lists them separately, with their places, as a weakness at the model's edges

#### Scenario: Far gridlock that reaches the study area
- **WHEN** a car cleared from gridlock outside the judged zone was held in a chain of blocked vehicles that includes a link in the zone
- **THEN** it counts against the rule as a near one

### Requirement: Judged zone reported beside the stability rule
Every per-seed report, ten-seed summary, assessment and cost-loop table SHALL report the cars cleared from gridlock near the study area and farther out separately, the far ones with a chain into the zone, the verdict at half and double the buffer distance, the entry backlog at origins in the zone, and the longest standing queue on each bounding street. The split SHALL be computed by observing the simulation between steps, so a run with it equals a run without it.

#### Scenario: Buffer sensitivity
- **WHEN** an assessment is written for an area with a judged zone
- **THEN** it states the judged mean per hour and whether the rule holds at half, the same and double the buffer

### Requirement: Old stability rule stays visible
Every report SHALL show how many seeds pass the old rule (zero removals, backlog under 2%, arterial speed above 4 m/s in every seed).

#### Scenario: Comparison
- **WHEN** a multi-seed summary is written
- **THEN** it states the number of seeds that pass the old rule beside the verdict of the new one

### Requirement: Multi-seed reports
`calibrate --seeds <list> --jobs <n>` SHALL run the seeds as parallel processes and write a summary report (markdown and JSON) with, for removals, backlog, backlog growth, completed trips, arterial speed, cut-through vehicle-miles, each route share, each ramp share and each corridor flow, the mean, sample standard deviation, minimum, maximum and the 95% interval of the mean, plus the first seed's full report. `--keep-seeds <dir>` SHALL keep every seed's own report with per-link flows and delays.

#### Scenario: Seed list
- **WHEN** the binary is started with `--seeds 1-10`
- **THEN** it reports ten seeds, lists them, and a failed seed is named on standard error and left out of the statistics

### Requirement: Published flow criteria
The assessment SHALL compute GEH, GEH below 5 in more than 85% of cases, and the flow size bands (within 100 veh/h below 700 veh/h, within 15% from 700 to 2,700, within 400 above 2,700) for every count station, in the demand fit report (static assignment) and in the assessment of the simulator's link flows, with pass or fail per station and the share passing, fitted and held-out reported separately.

#### Scenario: Station table
- **WHEN** the fit report or the assessment is generated
- **THEN** every station row has its GEH, GEH pass and size-band pass, and each period states the share of fitted and of held-out stations passing

### Requirement: Fit rule on seed means
Calibrated status SHALL require stability in every period, the recent fitted and held-out station rules, PM whole-street counts, current primitive validation and PM headline shares within ten percentage points of the observed values on seed means. Show their 95% intervals. Missing, mismatched or nonfinite evidence for a required seed, detector or primitive SHALL block a pass. List periods failing stability in `experimentalPeriods`.

#### Scenario: One failing period
- **WHEN** stability fails only in the PM peak
- **THEN** the area stays uncalibrated and the manifest lists that period

#### Scenario: Every rule holds
- **WHEN** complete current evidence passes each applicable rule
- **THEN** the assessment recommends calibrated status and lists no experimental periods

#### Scenario: Missing measurement
- **WHEN** a required detector has no finite measurement on one expected seed
- **THEN** the station and run set cannot supply passing evidence, and the assessment identifies the missing measurement

#### Scenario: Incomplete primitive report
- **WHEN** the primitive report omits a required case or belongs to a different simulator
- **THEN** it cannot support a calibrated verdict

### Requirement: Link-flow noise file
The assessment SHALL write the per-link sample standard deviation of flow over the seeds, per period, to `public/data/<area>.noise.json` as integers in a stated unit, under 200 KB, and the importer SHALL list the file as `noise` in `areas.json` when it exists.

#### Scenario: Compact file
- **WHEN** the noise file is written for the Rockridge network
- **THEN** it holds one integer per link per period and is smaller than 200 KB

### Requirement: Recorded fit
Calibration results and every tuned parameter SHALL be recorded in the repository with the value before and after and the reason, and the UI SHALL state the baseline's calibration status.

#### Scenario: Reading the calibration record
- **WHEN** someone opens the calibration record
- **THEN** they see the fit to each observed share and the list of adjustments made

### Requirement: Primitive validation suite
The project SHALL provide a command that runs benchmark cases on small synthetic networks with saturated demand, each measuring one simulator primitive, and prints the simulated value, expected range, source key, ratio and result for every case. Each expected range SHALL cite a verified key of the bibliography or be labeled an assumption.

#### Scenario: Running the validation suite
- **WHEN** a contributor runs the validation command
- **THEN** a table lists each case with its simulated value, expected range, source, ratio and result, and `validation.md` is written

#### Scenario: A capacity rule regresses
- **WHEN** a change to the car-following, junction or signal rules moves a case outside its range and the case is not a known deviation
- **THEN** the regression test fails and names the case and its range

#### Scenario: Known deviations are listed
- **WHEN** a case is outside its range
- **THEN** the regression test passes only if the case is on the documented list of known deviations

### Requirement: Period status in the area manifest
The area config SHALL be able to name the demand period the app opens with (`defaultPeriod`), the periods whose baseline fails the stability criterion (`experimentalPeriods`) and the limits of the calibration (`caveat`), and the importer SHALL copy them into `areas.json`; the calibration status SHALL follow the assessment rules above. The app SHALL keep its banner and the Sources page text visible for a calibrated area that has a caveat.

#### Scenario: A period fails stability
- **WHEN** the PM peak run at full demand fails the stability criterion
- **THEN** the area config lists `pm_peak` under `experimentalPeriods` and the status stays `uncalibrated`

#### Scenario: Calibrated with a caveat
- **WHEN** the status is `calibrated` and the area has a caveat
- **THEN** the app shows its banner with the note and the Sources page shows the caveat

### Requirement: Ramp shares use the side and qualifier of the targets file
The calibration report SHALL compute a ramp via-street share both over all trips on the ramps and over the trips whose surface end lies on the side of the ramp named in the targets file, and a via street with a qualifier ("north of X") SHALL count only its links on that side of X.

#### Scenario: Telegraph Avenue north of Alcatraz Avenue
- **WHEN** the report resolves the via street "Telegraph Avenue north of Alcatraz Avenue"
- **THEN** only Telegraph Avenue links north of its crossing with Alcatraz Avenue count as a visit

### Requirement: Link delays and select-link pairs in the run output
With `--link-flows` the run SHALL write the mean delay per exiting vehicle on every link after the warm-up (`linkMeanDelayS`), and with `--select-od PATH` the origin-destination pairs and trip counts of every headline select-link block. The report SHALL list the green and approach links of each phase of the five most blocked signals.

#### Scenario: Cost loop
- **WHEN** `tools/cost-loop.ts` runs with `--evaluate`
- **THEN** it prints the headline-share error and PM stability after each outer iteration and stops when the share error improves by less than half a point

### Requirement: Wandering and reported-pattern diagnostics
The calibration report SHALL include the wandering metrics of completed car trips (route switches, detour ratios, loops, reversals, study-area vehicle-miles by detour) by trip type and guidance class, and the diagnostics configured under `patterns` in the targets file, with no street name in code. Each diagnostic SHALL say whether an observed counterpart exists.

#### Scenario: Freeway through trips
- **WHEN** the targets file names a surface side of the ramps
- **THEN** the report gives the local-street vehicle-miles of trips between the surface gates on that side and the freeway mainline gates

#### Scenario: Bypass and arterial
- **WHEN** the targets file lists a bypass street, its arterial and a block count N
- **THEN** the report gives, by direction, the share of corridor trips that use the bypass for at least N blocks

#### Scenario: No observed counterpart
- **WHEN** the targets file has no observed value for a diagnostic
- **THEN** the report prints the modeled value and says that no observed counterpart exists

### Requirement: Interior streets are scored apart from the arterials
The assessment SHALL score the count stations on the simulator's flows in two groups, interior blocks of the volunteer count and all other stations, each fitted and held out, and SHALL list the modeled and counted volume of every counted block of the streets named in the select-link targets, the entries by side against the counted entries, and the modeled volume of the counted turning movements and whole-street routes (select-link counts).

#### Scenario: Colby Street block by block
- **WHEN** the assessment is written
- **THEN** it has a table with one row per counted block of Colby Street and Hillegass Avenue, with counted, modeled, ratio, GEH and whether the block was held out

### Requirement: Observed arterial travel times in the assessment
The targets file MAY list arterial segments by street and the two cross streets, with their published length and observed peak-period speeds by year. For each listed segment the assessment SHALL report the free-flow time, the simulated time (free-flow time plus the mean delay per vehicle on each link, seed mean with its interval, scaled to the published length), the observed speeds and whether the simulated time lies inside the range of the observed years.

#### Scenario: Telegraph Avenue
- **WHEN** the targets file lists Telegraph Avenue from 51st Street to Russell Street with four observed PM speeds
- **THEN** the PM section of the assessment has a row with the simulated seconds and speed, the four observed speeds and yes or no for the range

### Requirement: Through cars on the counted blocks
The calibration report SHALL keep observed block volumes and freeway shares separate from simulated unique vehicles using any part of the corridor. When an observation counts vehicles traveling a whole street in one direction, the model SHALL count continuous traversals in that direction between the recorded endpoints. Counts of vehicles ending along a street and summaries across blocks SHALL NOT supply an upper bound on unique users of a corridor.

#### Scenario: Colby Street northbound
- **WHEN** the observation counts 102 drivers traveling the full street northbound
- **THEN** the report compares it with simulated continuous northbound traversals

#### Scenario: Fitted through figure
- **WHEN** a legacy fit inferred corridor-wide traffic from block volumes and cars ending along the street
- **THEN** those figures remain historical evidence and cannot serve as a measured corridor-wide target

#### Scenario: Vehicle leaves after one block
- **WHEN** a driver uses the first counted block and turns off before the last one
- **THEN** it counts toward its block and any-use metrics and contributes zero whole-street traversals

### Requirement: Through figures carry their standard error
The assessment SHALL report the modeled mean and its standard error across seeds beside each observed whole-street count. It SHALL identify the detector or corridor and compare like quantities in vehicles per hour.

#### Scenario: Twenty seeds
- **WHEN** the standard deviation for a direction is 16 cars an hour over twenty seeds
- **THEN** the table shows a standard error of about 3.6 beside its mean

### Requirement: Intent map of through cars
The calibrate report SHALL list, for each counted block and for the study area's residential and service streets, the through cars per hour (neither trip end in the study area) by origin group and destination group, with the arterial each trip would otherwise use on the shortest free-flow path that avoids the study area's local streets, where that path runs on a boundary street near the study area. The ten-seed summary SHALL give the mean over the seeds.

#### Scenario: Block table
- **WHEN** the calibrate binary runs a PM peak with the groups file present
- **THEN** the report has a table per counted block of through cars per hour by (origin group, destination group)

#### Scenario: No groups file
- **WHEN** the groups file is absent
- **THEN** the report omits the intent map and says so

### Requirement: Intents the counts imply
The targets file MAY list, per counted block, the intents the volunteer count and the headline shares imply, each with origin and destination groups, a range and a basis marked OBSERVED or ASSUMPTION. The report SHALL show each intent's implied veh/h next to the model's and say whether the model is within, below or above the range, and SHALL show the model's through cars that no listed intent covers.

#### Scenario: Intent below its range
- **WHEN** the model carries 26 veh/h on an intent implied at 38 to 62
- **THEN** the report marks it below

### Requirement: Station results are reported by source and count year
The demand fit report and the assessment SHALL list, for each period, the number of stations below GEH 5 per source and count year, fitted and held out. The station rule (more than 85% below GEH 5) SHALL be judged on the counts of the last `recentYears` years before `referenceYear` (both from the area's demand config). The held-out stations SHALL be scored on the cross-validation demand, a fit that left them out, run with the same simulator, seeds and period as the shipped demand, so that their pass rate is out of sample; their pass rate on the shipped demand SHALL be reported as "validation stations, in the shipped fit" and SHALL NOT be judged. The rule SHALL NOT pass on fewer than 10 recent held-out stations; the report SHALL say they are too few to judge. A station target that is a scaled copy of another period's count SHALL NOT be judged, and a period with no counts of its own SHALL be judged on stability only, with the report saying so. The pass rate of older counts and of all counts SHALL be reported beside the recent ones. The calibration note and the Sources page SHALL state that the recent set rests mostly on one source when it does, with the numbers, and SHALL NOT quote pass rates of derived targets as counts.

#### Scenario: Recent sources
- **WHEN** a period's stations are scored
- **THEN** the report gives the pass counts of the recent stations, fitted on the shipped demand and held out on the cross-validation demand, with the verdict, and the pass counts of older stations and of all stations beside them

#### Scenario: One dominant source
- **WHEN** most recent stations come from one source counted on one day
- **THEN** the assessment names the source and the count of its stations among the recent ones

#### Scenario: Too few held-out stations
- **WHEN** a period has fewer than 10 recent held-out stations
- **THEN** the report says they are too few to judge and the status is not `calibrated`

#### Scenario: Midday
- **WHEN** every midday target is the PM count times a factor
- **THEN** the verdict says there are no midday counts and midday is checked for stability only

### Requirement: The assessment does not overwrite the main report by accident
`tools/assess.ts` SHALL refuse `--demand` and `--reuse` without `--suffix` unless `--no-write` or `--overwrite-main` is given. A PM peak with no through-car rows SHALL fail the through-car check and the status SHALL NOT be `calibrated`.

#### Scenario: Variant demand without a suffix
- **WHEN** `--demand FILE` is given without `--suffix`
- **THEN** the tool stops with an error and writes nothing

#### Scenario: No rows
- **WHEN** the simulator reports no `throughCheck` rows for the PM peak
- **THEN** the verdict shows the check as failed because it has no data

### Requirement: Observed values in reports come from data
The assessment and the cost loop SHALL read observed values (cars per cycle of an observed signal, observed headline shares) from the area config and the targets file, print them only where they apply, and hold no area-specific number in code. The count of stations without a link SHALL be given by kind (gates; movements and routes).

#### Scenario: Signal without a reading
- **WHEN** an observed signal has no `observedCarsPerCycle` for the period
- **THEN** the report line gives the modeled figures only

### Requirement: Failing held-out stations are listed
For each period, the assessment SHALL list the recent held-out stations that are at GEH 5 or more on the cross-validation demand, with their counted and modeled flows and GEH there and the same station's modeled flow and GEH on the shipped demand.

#### Scenario: Held-out station fails out of sample
- **WHEN** a recent held-out station scores GEH 5 or more on the cross-validation demand
- **THEN** the verdict section has a row with its counted flow, its cross-validation and shipped flows and both GEH values

### Requirement: Calibration runs can select the junction recovery policy
The calibration command SHALL accept `--junction-recovery physical|no_behavioral|historical` (default `physical`), pass it to every seed of a multi-seed run, and record it in the run settings of the report manifest. Under `historical` the end-of-run node invariant check SHALL be skipped, because that policy lets vehicles share a conflict point by design.

#### Scenario: Comparing the repaired and the old junction engine
- **WHEN** a contributor runs `calibrate --seeds 1-4 --junction-recovery historical`
- **THEN** every seed runs under the historical policy, the reports carry the policy in their settings and junction recovery section, and the run is not stopped by the conflict-point invariant

### Requirement: Route costs of through trips can be written for diagnosis
The calibration command SHALL accept `--od-costs PATH` (with optional `--od-links` naming extra links) and write every completed through trip that uses a counted select-link block or a named link, with its origin and destination groups and its times. Trip records and timings SHALL be matched by trip id.

#### Scenario: Who are the through cars on a block
- **WHEN** a contributor runs `calibrate --seed 1 --od-costs out.json --od-links 2622,2697`
- **THEN** `out.json` lists each through trip on the counted blocks and on links 2622 and 2697 with its groups and times

### Requirement: The diagnostic costs the driven and the arterial route by term
For each trip the diagnostic SHALL cost the surface part of the route it drove and the cheapest route avoiding the study area's residential and service streets, on the router's costs at departure, each split into measured time, traversal, turn penalty, control constant and local-street weight. It SHALL also give the cheapest unrestricted route at entry and whether the trip drove it.

#### Scenario: A trip on a costlier route
- **WHEN** a trip drove a side-street route whose cost at departure exceeds the router's best route
- **THEN** its entry shows both costs by term, the links where measured time exceeds free-flow time by more than 5 s, and that it did not drive the best route

### Requirement: The delay-feedback loop does not select on held-out stations
`tools/cost-loop.ts` SHALL decide whether to keep an iteration from removals, backlog, the headline-share error and the fitted station GEH shares only. It SHALL report the held-out GEH shares in its table without using them in the decision.

#### Scenario: An iteration that only helps held-out stations
- **WHEN** an iteration raises the held-out GEH share but fails the rule on removals
- **THEN** the loop does not keep it, and the held-out share appears only as a reported column

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

### Requirement: Lane-change validation cases
The validation suite SHALL include case l1, a saturated two-lane signal approach with 20% left turns, a pocket that overflows every cycle and 500 veh/h per opposing lane, judged against the permitted-left method [Fambro1991] as set out in the requirement on pocketed permissive-left approaches, and case l2, a two-lane link 600 m long whose left lane is blocked by a standing vehicle with 1,200 veh/h offered, where the flow past the obstruction SHALL be 0.9 to 1.1 of the offered flow. Each note SHALL give the value without lane changes along a link.

#### Scenario: Effect of lane changes
- **WHEN** the suite runs l2
- **THEN** its note gives the vehicles left standing behind the obstruction with and without lane changes

### Requirement: Calibration diagnostics for capacity deficits
`calibrate` SHALL accept `--node-report <file>` and write, for one seed, every link's exits, standing vehicles and the share of 5 s samples near jam density after the warm-up, every signal's mean plan (cycle, greens and phase links, sampled every 5 minutes), and the gridlock removals with their links. It SHALL accept `--no-lane-changes` and `--coord-max-m <m>` and record both in the run manifest. None of them changes a run.

#### Scenario: A/B of lane changes
- **WHEN** a contributor runs `calibrate --seeds 1-10 --no-lane-changes`
- **THEN** every seed runs without lane changes along a link and the manifest says so

### Requirement: Permissive left-turn validation cases
The validation suite SHALL include cases p1 to p3, a saturated left-only lane against 200, 400 and 600 veh/h of opposing flow, judged against the permitted-left method of [Fambro1991]: left turns only after the opposing queue clears, Drew's gap model, then sneakers. Each note SHALL give the value with the rule before the queue-first model (`queue_first_left` off).

#### Scenario: Permissive left against heavy opposing flow
- **WHEN** the suite runs p3
- **THEN** the table shows the simulator's left turns, the band of the method and the value with the earlier rule

### Requirement: Protected left-turn validation case
The validation suite SHALL include case b13, a one-lane all-left approach in an observed phase of its own (phasing without timing) against 500 veh/h opposing, judged against s x green share with s 1,500 to 2,000 veh/h [FHWA-SIG2004], with the permissive value in its note.

#### Scenario: Opposing flow does not matter
- **WHEN** the suite runs b13
- **THEN** the left turns discharge at a saturation flow over the green of their own phase

### Requirement: l1 shows the cited method
The note of case l1 SHALL give the capacity the [Fambro1991] method sets for its range and the value with the rule before the queue-first model beside it.

#### Scenario: Reading l1
- **WHEN** a reviewer reads l1
- **THEN** the note shows the range, the method's capacity and the value with the earlier rule

### Requirement: Approach discharge is measured before a signal change
Before a calibration round changes the phasing, timing or lanes of a signal to reduce the cars cleared from gridlock at it, the round SHALL record for each approach the green it received and its discharge rate per lane while green and queued, against a cited saturation flow, with the shares of that time in which the head vehicle was held by a full downstream link (named), a vehicle in the junction, pedestrians or a priority rule.

#### Scenario: Approach limited by its green
- **WHEN** an approach discharges near saturation flow whenever it is green and queued
- **THEN** a change to its phasing, timing or lanes may be tried under the round's step rule

### Requirement: Spillback is followed to its cause
When an approach discharges well below saturation flow while green and queued because its head waits for a full downstream link, the round SHALL follow that link to the control at its far end and name the cause there, and SHALL NOT change the signal on that evidence.

#### Scenario: Approach held by spillback
- **WHEN** an approach's head is held by a full downstream link most of its queued green
- **THEN** the record names the chain of full links to the control that limits them
