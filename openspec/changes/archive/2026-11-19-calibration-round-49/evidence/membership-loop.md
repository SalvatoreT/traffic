# Membership loop (calibration round 48)

Seeds 1 to 10 per pass, periods pm_peak, am_peak. Passes run: 3. Pooled with equal weight over passes (successive averages, step 1/n, ASSUMPTION for this fixed point).

| Pass | View | Period | Offered car veh/h | Selected | With pairs | Zero hits | Not exported | Flow change / seed SE | Membership change / seed SE | Gate ceiling stations | Above ceiling | Excess veh/h |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | shipped | pm_peak | 27612 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | - | - | - | - | - |
| 0 | shipped | am_peak | 23204 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | - | - | - | - | - |
| 0 | training | pm_peak | 25044 | 256 | 256 | - | - | - | - | - | - | - |
| 0 | training | am_peak | 20584 | 201 | 201 | - | - | - | - | - | - | - |
| 1 | shipped | pm_peak | 26349 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | 4.24 | 3.55 | 216 | 0 | 0 |
| 1 | shipped | am_peak | 22926 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | 4.23 | 3.45 | 217 | 1 | 1 |
| 1 | training | pm_peak | 24623 | 256 | 256 | - | - | 3.87 | 3.40 | 222 | 0 | 0 |
| 1 | training | am_peak | 20026 | 201 | 201 | - | - | 3.32 | 3.25 | 223 | 0 | 0 |
| 2 | shipped | pm_peak | 26917 | 337 | 336 | ix telegraph-51st move 1629>1764 | - | 1.91 | 2.32 | 216 | 0 | 0 |
| 2 | shipped | am_peak | 23130 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | 2.62 | 1.97 | 217 | 0 | 0 |
| 2 | training | pm_peak | 24903 | 256 | 256 | - | - | 1.72 | 2.05 | 222 | 0 | 0 |
| 2 | training | am_peak | 19999 | 201 | 201 | - | - | 1.79 | 1.95 | 223 | 0 | 0 |

## Static membership

- shipped:pm_peak: gate 265 in (no links and no movement or route feature (a gate total)); gate 265 out (no links and no movement or route feature (a gate total)); gate 295 in (no links and no movement or route feature (a gate total)); gate 295 out (no links and no movement or route feature (a gate total)); gate 763 in (no links and no movement or route feature (a gate total)); gate 1735 out (no links and no movement or route feature (a gate total))
- shipped:am_peak: gate 265 in (no links and no movement or route feature (a gate total)); gate 265 out (no links and no movement or route feature (a gate total)); gate 295 in (no links and no movement or route feature (a gate total)); gate 295 out (no links and no movement or route feature (a gate total)); gate 763 in (no links and no movement or route feature (a gate total)); gate 1735 out (no links and no movement or route feature (a gate total))
- training:pm_peak: none
- training:am_peak: none

## Gate prior ceilings, by build

- shipped:1 am_peak: 217 stations, 1 above ceiling, excess 1 veh/h
- shipped:1 pm_peak: 216 stations, 0 above ceiling, excess 0 veh/h
- training:1 am_peak: 223 stations, 0 above ceiling, excess 0 veh/h
- training:1 pm_peak: 222 stations, 0 above ceiling, excess 0 veh/h
- shipped:2 am_peak: 217 stations, 0 above ceiling, excess 0 veh/h
- shipped:2 pm_peak: 216 stations, 0 above ceiling, excess 0 veh/h
- training:2 am_peak: 223 stations, 0 above ceiling, excess 0 veh/h
- training:2 pm_peak: 222 stations, 0 above ceiling, excess 0 veh/h
- shipped:3 am_peak: 217 stations, 0 above ceiling, excess 0 veh/h
- shipped:3 pm_peak: 216 stations, 0 above ceiling, excess 0 veh/h
- training:3 am_peak: 223 stations, 0 above ceiling, excess 0 veh/h
- training:3 pm_peak: 222 stations, 1 above ceiling, excess 1 veh/h

## Files

- shipped demand: 93b8cef7ecaa5df5
- shipped membership file: b625cdb060d12258
- training demand: 0dc1dbdeefa03203
- training membership file: a6bc6aff8bdbaeed
