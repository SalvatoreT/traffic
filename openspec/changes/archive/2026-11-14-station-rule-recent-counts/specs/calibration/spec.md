## MODIFIED Requirements

### Requirement: Fit rule on seed means
The headline select-link shares SHALL be judged on the seed means (within 10 points of observed) with their 95% intervals shown. The area status SHALL be `calibrated` only when, in every period, the stability rule holds and the station rule holds on counts from the last `recentYears` years, fitted and held out, and, in the PM peak, the headline shares are within the tolerance and the modeled through cars are inside the observed range on every counted block. `experimentalPeriods` SHALL list the periods that fail the stability rule.

#### Scenario: One failing period
- **WHEN** the stability rule fails in the PM peak and holds in the others
- **THEN** the status is `uncalibrated` and `experimentalPeriods` is the PM peak

#### Scenario: Every rule holds
- **WHEN** every period is stable, the recent-count station rule holds fitted and held out in every period, and the PM shares and through cars are within their tolerances
- **THEN** the assessment prescribes `calibrated` and `experimentalPeriods` is empty

### Requirement: Period status in the area manifest
The area config SHALL be able to name the demand period the app opens with (`defaultPeriod`), the periods whose baseline fails the stability criterion (`experimentalPeriods`) and the limits of the calibration (`caveat`), and the importer SHALL copy them into `areas.json`; the calibration status SHALL follow the assessment rules above. The app SHALL keep its banner and the Sources page text visible for a calibrated area that has a caveat.

#### Scenario: A period fails stability
- **WHEN** the PM peak run at full demand fails the stability criterion
- **THEN** the area config lists `pm_peak` under `experimentalPeriods` and the status stays `uncalibrated`

#### Scenario: Calibrated with a caveat
- **WHEN** the status is `calibrated` and the area has a caveat
- **THEN** the app shows its banner with the note and the Sources page shows the caveat

### Requirement: Station results are reported by source and count year
The demand fit report and the assessment SHALL list, for each period, the number of stations below GEH 5 per source and count year, fitted and held out. The station rule (more than 85% below GEH 5) SHALL be judged on the counts of the last `recentYears` years before `referenceYear` (both from the area's demand config), and the pass rate of older counts and of all counts SHALL be reported beside it in the assessment, the fit report and the Sources page. The calibration note and the Sources page SHALL state that the recent set rests mostly on one source when it does, with the numbers.

#### Scenario: Recent sources
- **WHEN** a period's stations are scored
- **THEN** the report gives the pass counts of the recent stations, fitted and held out, with the verdict, and the pass counts of older stations and of all stations beside them

#### Scenario: One dominant source
- **WHEN** most recent stations come from one source counted on one day
- **THEN** the assessment names the source and the count of its stations among the recent ones
