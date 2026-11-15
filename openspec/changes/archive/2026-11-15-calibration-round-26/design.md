## Decisions

**Out-of-sample held-out figure.** The held-out column of the station rule is scored on `target/validation/<area>.demand.json`, the demand fitted without those stations, run over the same seeds as the main assessment. The fitted column stays on the shipped demand. The in-sample figure of the validation stations is printed as "validation stations, in the shipped fit" and is not judged. The rule needs at least 10 recent held-out stations (ASSUMPTION; `acceptance.minHeldStations` in the targets file can change it); fewer is "too few to judge", which is not a pass. Alternative considered: judge on in-sample only and label it. Rejected: it cannot show over-fitting, which is what the rule is for. Cost: a second set of ten runs per period.

**Derived targets.** A station with a target that is another period's count times a factor carries `derived: [period]`. The rule skips it. Midday then has no counts and is checked for stability only. `calibration.note` and `calibration.caveat` give no midday pass rates.

**Filled trip ends (ASSUMPTION).** An entry or exit with a count in one period and none in the other takes the other period's count times the ratio over the entries counted in both. Alternative: compute the factor on the common entries only. Rejected: the 5 uncounted entries carry 199 veh/h in the PM, a quarter of the entries, and dropping them would move the factor in the other direction for the same reason.

**Natural flows (ASSUMPTION, `naturalDetour` 1.05).** The fit cannot take a flow below 0.1 of its seed volume, so a plain flow that makes a counted turn on its best route cannot be cut to fit the count. Alternatives: lower the floor for those flows (the multiplicative fit approaches zero only asymptotically and the simulator still routes them through the turn); count minus pinned as the station target (the station already compares total assigned volume to the count, so nothing changes). Chosen: cut their seed volume to what the pinned flows leave of the count (floor 0) before the fit. Cost: the trips of those pairs leave the table, and the fit has to place them elsewhere.

**Ramps.** A freeway-class link that starts at a surface node is the continuation of a ramp. A ramp reached on one path through another ramp's last link is the same physical ramp. Assumed flows from the mainline gates keep the simulator's ramp choice: a two-stage `via` would need a simulator change, and they are 2% of the PM off-ramp volume.

**Alternatives.** Only flows with no end in the study area get alternatives. A resident's trip falls back to its plain route.

**Shares on turning cars.** Intent shares apply to the turning cars of the count. Notes now say so: Hillegass Ave 97 of 109 exits, Colby St 163 of 164.

**Below the fit minimum.** A turn counted below `minMovementVeh` (25) has no station and gets no assumed trips. The report and the Assumptions data show the count and the reason.

Citations: station rule and GEH [WebTAG-M3.1] [TfL-TMG4] as in the earlier rounds; cross-validation by holding out stations (design D17 of baseline-calibration). The parameters above are assumptions.
