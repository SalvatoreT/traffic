# Membership loop (calibration round 48)

Seeds 1 to 10 per pass, periods pm_peak, am_peak. Passes run: 3. Pooled with equal weight over passes (successive averages, step 1/n, ASSUMPTION for this fixed point).

| Pass | View | Period | Offered car veh/h | Selected | With pairs | Zero hits | Not exported | Flow change / seed SE | Membership change / seed SE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | shipped | pm_peak | 27612 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | - | - |
| 0 | shipped | am_peak | 23204 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | - | - |
| 0 | training | pm_peak | 25044 | 256 | 256 | - | - | - | - |
| 0 | training | am_peak | 20584 | 201 | 201 | - | - | - | - |
| 1 | shipped | pm_peak | 28169 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | 3.84 | 3.79 |
| 1 | shipped | am_peak | 24819 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | 4.44 | 3.68 |
| 1 | training | pm_peak | 25428 | 256 | 256 | - | - | 3.74 | 3.82 |
| 1 | training | am_peak | 21407 | 201 | 201 | - | - | 2.77 | 3.45 |
| 2 | shipped | pm_peak | 29107 | 337 | 336 | ix telegraph-51st move 1629>1764 | - | 2.17 | 2.80 |
| 2 | shipped | am_peak | 24861 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | 2.25 | 2.22 |
| 2 | training | pm_peak | 26455 | 256 | 256 | - | - | 1.86 | 2.87 |
| 2 | training | am_peak | 21755 | 201 | 201 | - | - | 1.74 | 2.60 |

## Static membership

- shipped:pm_peak: gate 265 in (no links and no movement or route feature (a gate total)); gate 265 out (no links and no movement or route feature (a gate total)); gate 295 in (no links and no movement or route feature (a gate total)); gate 295 out (no links and no movement or route feature (a gate total)); gate 763 in (no links and no movement or route feature (a gate total)); gate 1735 out (no links and no movement or route feature (a gate total))
- shipped:am_peak: gate 265 in (no links and no movement or route feature (a gate total)); gate 265 out (no links and no movement or route feature (a gate total)); gate 295 in (no links and no movement or route feature (a gate total)); gate 295 out (no links and no movement or route feature (a gate total)); gate 763 in (no links and no movement or route feature (a gate total)); gate 1735 out (no links and no movement or route feature (a gate total))
- training:pm_peak: none
- training:am_peak: none

## Files

- shipped demand: 1771a9c4a51968c6
- shipped membership file: 8f11b43838d3134d
- training demand: 83396aeb2a4b1b63
- training membership file: b99c26686c4c0cfc
