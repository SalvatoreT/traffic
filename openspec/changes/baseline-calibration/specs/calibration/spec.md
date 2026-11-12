## ADDED Requirements

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
The published baseline SHALL be judged over the fixed seed list 1 to 10, on each period's 60-minute run at full demand: mean gridlock removals below 1.0 per hour, entry backlog below 2% of spawned trips in at least 9 of 10 seeds, no seed adding more than 2.0 points of spawned trips to the entry backlog in the second half of the run, and the seed mean of the arterial speed above 4 m/s. The thresholds SHALL be read from `acceptance.stability` of the area's targets file, and every report SHALL also show how many seeds pass the first rule (zero removals, backlog under 2%, speed above 4 m/s in every seed).

#### Scenario: Full-demand runs over ten seeds
- **WHEN** the baseline runs for 60 simulated minutes at demand scale 1.0 with seeds 1 to 10
- **THEN** the report states, per check, the result and whether the rule holds, and one removal in one seed does not by itself change the verdict

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
The headline select-link shares SHALL be judged on the seed means (within 10 points of observed) with their 95% intervals shown, and the area status SHALL be `calibrated` only when the stability rule holds in every period, the PM headline shares are within the tolerance and the fitted stations meet the flow criteria on the simulator's flows; `experimentalPeriods` SHALL list the periods that fail the stability rule.

#### Scenario: One failing period
- **WHEN** the stability rule fails in the PM peak and holds in the others
- **THEN** the status is `uncalibrated` and `experimentalPeriods` is the PM peak

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
The area config SHALL be able to name the demand period the app opens with (`defaultPeriod`) and the periods whose baseline fails the stability criterion (`experimentalPeriods`), and the importer SHALL copy both into `areas.json`; the calibration status SHALL be `calibrated` only when the stability criterion and the headline shares hold in every period.

#### Scenario: A period fails stability
- **WHEN** the PM peak run at full demand fails the stability criterion
- **THEN** the area config lists `pm_peak` under `experimentalPeriods` and the status stays `uncalibrated`

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
