## MODIFIED Requirements

### Requirement: Station results are reported by source and count year
The demand fit report and the assessment SHALL list, for each period, the number of stations below GEH 5 per source and count year, fitted and held out. The station rule (more than 85% below GEH 5) SHALL be judged on the hourly counts of the last `recentYears` years before `referenceYear` (both from the area's demand config). The held-out stations SHALL be scored on the cross-validation demand, a fit that left them out, run with the same simulator, seeds and period as the shipped demand, so that their pass rate is out of sample; their pass rate on the shipped demand SHALL be reported as "validation stations, in the shipped fit" and SHALL NOT be judged. The rule SHALL NOT pass on fewer than 10 recent held-out stations; the report SHALL say they are too few to judge. A station target that is a scaled copy of another period's count SHALL NOT be judged, a station target derived from a daily total SHALL NOT be judged (see "Derived targets are left out of the pass counts"), and a period with no hourly counts of its own SHALL be judged on stability only, with the report saying so. The pass rate of older counts and of all counts SHALL be reported beside the recent ones. The calibration note and the Sources page SHALL state that the recent set rests mostly on one source when it does, with the numbers, and SHALL NOT quote pass rates of derived targets as counts.

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

#### Scenario: A period whose only targets are derived
- **WHEN** every target of a period is a scaled copy of another period's count or is derived from a daily total
- **THEN** the verdict says the period has no hourly counts and judges it on stability only

## ADDED Requirements

### Requirement: A derived target is found from its provenance
A station whose hourly target is a daily total (a Caltrans AADT or a published ramp ADT) times an assumed peak-hour factor and directional split SHALL be a derived target. The demand build SHALL record the source kind of every station, and the station SHALL be recognized from that kind, never from a list of streets.

#### Scenario: Caltrans AADT station
- **WHEN** a station's source is `caltrans-aadt`
- **THEN** it is a derived target, whether it is on a link or is a gate

#### Scenario: Counted ramp
- **WHEN** a ramp's peak hour is counted by an intersection count that replaces its ADT station
- **THEN** the replacement is an hourly count and is judged

### Requirement: Derived targets are left out of the pass counts
In every period, the assessment, the demand fit report and the status rule SHALL leave derived targets out of the fitted and held-out pass counts. The thresholds SHALL NOT change: GEH below 5 at more than 85% of stations, with at least 10 recent held-out stations [WebTAG-M3.1] [TfL-TMG4].

#### Scenario: A derived target misses on the cross-validation demand
- **WHEN** a derived target is at GEH 5 or more
- **THEN** it is not in the list of failing held-out stations and no pass count changes

#### Scenario: Status
- **WHEN** the suggested status is computed
- **THEN** it reads the pass counts of hourly counts only

### Requirement: Derived targets have a table of their own
Each period's section of the assessment SHALL list the link-based derived targets in a table with the hourly-equivalent target, the simulated mean on the shipped and on the cross-validation demand and GEH, and SHALL mark each "derived from a daily total, not judged". A closing sentence SHALL count the derived-target gate stations, which have no link and are scored only in the demand fit report.

#### Scenario: Table
- **WHEN** a period has derived targets on links
- **THEN** the assessment has the table and a sentence with their count and how many are below GEH 5 on each demand

#### Scenario: Wording
- **WHEN** the assessment, the fit report, the text pages or the Assumptions tab mention a derived target
- **THEN** they call it "derived from a daily total, not judged" and do not describe its pass rate as a count's

### Requirement: The assessment prints both scopes
The verdict of the assessment SHALL have a table that gives, for each period, the recent fitted and held-out pass counts under the new scope, the same under the scope before derived targets were set apart (derived targets counted, on the side the frozen draw gives them), and the derived targets below GEH 5. It SHALL say that on a cross-validation demand that fits the derived targets the old-scope held-out figure is no longer out of sample.

#### Scenario: Both scopes printed
- **WHEN** the assessment is generated
- **THEN** the table is present for every period, with the same thresholds in both scopes
