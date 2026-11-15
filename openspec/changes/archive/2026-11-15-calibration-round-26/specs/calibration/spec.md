## MODIFIED Requirements

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

## ADDED Requirements

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
