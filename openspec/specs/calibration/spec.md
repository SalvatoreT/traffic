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
The published baseline SHALL be judged over the fixed seed list 1 to 10 on each period's 60-minute run at full demand, with the thresholds read from the area's targets file. It is stable when the mean gridlock removals are below 1.0 per hour, the entry backlog is below 2% of spawned trips in at least 9 of 10 seeds, no seed adds more than 2.0 points of spawned trips to the backlog in the second half, and the seed mean of the arterial speed is above 4 m/s.

#### Scenario: Full-demand runs over ten seeds
- **WHEN** the baseline runs for 60 simulated minutes at demand scale 1.0 with seeds 1 to 10
- **THEN** the report states, per check, the result and whether the rule holds, and one removal in one seed does not by itself change the verdict

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
The headline select-link shares SHALL be judged on the seed means (within 10 points of observed) with their 95% intervals shown. The area status SHALL be `calibrated` only when, in every period, the stability rule holds and the station rule holds on counts from the last `recentYears` years, fitted and held out, and, in the PM peak, the headline shares are within the tolerance and the modeled through cars are inside the observed range on every counted block. `experimentalPeriods` SHALL list the periods that fail the stability rule.

#### Scenario: One failing period
- **WHEN** the stability rule fails in the PM peak and holds in the others
- **THEN** the status is `uncalibrated` and `experimentalPeriods` is the PM peak

#### Scenario: Every rule holds
- **WHEN** every period is stable, the recent-count station rule holds fitted and held out in every period, and the PM shares and through cars are within their tolerances
- **THEN** the assessment prescribes `calibrated` and `experimentalPeriods` is empty

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
For each select-link target that lists `observedVehPerHour` for the period and a freeway share, the calibration report SHALL list the observed volume, the observed freeway share, the observed freeway-end trips (their product), the modeled through cars per hour (neither trip end in the study area) and the modeled trips per hour with a freeway end, and write the same in the JSON as `throughCheck`. When the target also lists `wholeStreetVehPerHour` the report SHALL give an observed through range from that value up to the block volume less `endAlongVehPerHour`, and say whether the modeled through cars are inside it.

#### Scenario: Colby Street northbound
- **WHEN** the targets file gives Colby Street northbound 174 veh/h, a freeway share of 0.47, 102 whole-street cars and 29 end-along cars
- **THEN** the report row shows 82 observed freeway-end trips, an observed through range of 102 to 145 and the modeled figures

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
The demand fit report and the assessment SHALL list, for each period, the number of stations below GEH 5 per source and count year, fitted and held out. The station rule (more than 85% below GEH 5) SHALL be judged on the counts of the last `recentYears` years before `referenceYear` (both from the area's demand config), and the pass rate of older counts and of all counts SHALL be reported beside it in the assessment, the fit report and the Sources page. The calibration note and the Sources page SHALL state that the recent set rests mostly on one source when it does, with the numbers.

#### Scenario: Recent sources
- **WHEN** a period's stations are scored
- **THEN** the report gives the pass counts of the recent stations, fitted and held out, with the verdict, and the pass counts of older stations and of all stations beside them

#### Scenario: One dominant source
- **WHEN** most recent stations come from one source counted on one day
- **THEN** the assessment names the source and the count of its stations among the recent ones
