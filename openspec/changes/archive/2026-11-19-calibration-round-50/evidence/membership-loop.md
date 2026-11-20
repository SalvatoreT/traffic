# Membership loop (calibration rounds 48 to 50)

Seeds 1 to 10 per pass, periods pm_peak, am_peak. Passes run: 3. Pooled with equal weight over passes (successive averages, step 1/n, ASSUMPTION for this fixed point).

| Pass | View | Period | Offered car veh/h | Selected | With pairs | Zero hits | Not exported | Flow change / seed SE | Membership change / seed SE | Ceiling stations | Above ceiling | Excess veh/h | Offered / static fit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | shipped | pm_peak | 27612 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | - | - | - | - | - | - |
| 0 | shipped | am_peak | 23204 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | - | - | - | - | - | - |
| 0 | training | pm_peak | 25044 | 256 | 256 | - | - | - | - | - | - | - | - |
| 0 | training | am_peak | 20584 | 201 | 201 | - | - | - | - | - | - | - | - |
| 1 | shipped | pm_peak | 24551 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | 3.69 | 3.28 | 1991 | 0 | 0 | 88.9% |
| 1 | shipped | am_peak | 21528 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | 4.40 | 2.48 | 2034 | 0 | 0 | 92.8% |
| 1 | training | pm_peak | 22798 | 256 | 256 | - | - | 3.88 | 3.01 | 1959 | 0 | 0 | 91.0% |
| 1 | training | am_peak | 18989 | 201 | 201 | - | - | 3.79 | 2.69 | 2022 | 0 | 0 | 92.3% |
| 2 | shipped | pm_peak | 25018 | 337 | 336 | ix telegraph-51st move 1629>1764 | - | 1.83 | 1.94 | 1991 | 0 | 0 | 90.6% |
| 2 | shipped | am_peak | 21450 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | 3.08 | 1.35 | 2034 | 0 | 0 | 92.4% |
| 2 | training | pm_peak | 22719 | 256 | 256 | - | - | 1.58 | 1.67 | 1959 | 0 | 0 | 90.7% |
| 2 | training | am_peak | 18874 | 201 | 201 | - | - | 1.92 | 1.62 | 2022 | 0 | 0 | 91.7% |

## Static membership

- shipped:pm_peak: gate 265 in (no links and no movement or route feature (a gate total)); gate 265 out (no links and no movement or route feature (a gate total)); gate 295 in (no links and no movement or route feature (a gate total)); gate 295 out (no links and no movement or route feature (a gate total)); gate 763 in (no links and no movement or route feature (a gate total)); gate 1735 out (no links and no movement or route feature (a gate total))
- shipped:am_peak: gate 265 in (no links and no movement or route feature (a gate total)); gate 265 out (no links and no movement or route feature (a gate total)); gate 295 in (no links and no movement or route feature (a gate total)); gate 295 out (no links and no movement or route feature (a gate total)); gate 763 in (no links and no movement or route feature (a gate total)); gate 1735 out (no links and no movement or route feature (a gate total))
- training:pm_peak: none
- training:am_peak: none

## Gate prior ceilings, by build

- shipped:1 am_peak: 2034 stations, 0 above ceiling, excess 0 veh/h; offered 92.8% of the static fit; gate 217 (0 above, removed 44), non-gate 1817 (0 above, removed 34); non-gate ends origins inside 612 to 522, outside 7488 to 6472, destinations inside 528 to 433, outside 8211 to 6986
- shipped:1 pm_peak: 1991 stations, 0 above ceiling, excess 0 veh/h; offered 88.9% of the static fit; gate 216 (0 above, removed 66), non-gate 1775 (0 above, removed 40); non-gate ends origins inside 951 to 777, outside 9523 to 7862, destinations inside 734 to 513, outside 7901 to 6227
- training:1 am_peak: 2022 stations, 0 above ceiling, excess 0 veh/h; offered 92.3% of the static fit; gate 223 (0 above, removed 69), non-gate 1799 (0 above, removed 27); non-gate ends origins inside 1040 to 885, outside 7095 to 6033, destinations inside 735 to 578, outside 5907 to 4920
- training:1 pm_peak: 1959 stations, 0 above ceiling, excess 0 veh/h; offered 91.0% of the static fit; gate 222 (0 above, removed 141), non-gate 1737 (0 above, removed 37); non-gate ends origins inside 1387 to 1073, outside 8768 to 7493, destinations inside 881 to 643, outside 6740 to 5367
- shipped:2 am_peak: 2034 stations, 0 above ceiling, excess 0 veh/h; offered 92.4% of the static fit; gate 217 (0 above, removed 54), non-gate 1817 (0 above, removed 47); non-gate ends origins inside 612 to 536, outside 7488 to 6442, destinations inside 528 to 452, outside 8211 to 6947
- shipped:2 pm_peak: 1991 stations, 0 above ceiling, excess 0 veh/h; offered 90.6% of the static fit; gate 216 (0 above, removed 105), non-gate 1775 (0 above, removed 66); non-gate ends origins inside 951 to 743, outside 9523 to 8228, destinations inside 734 to 445, outside 7901 to 6447
- training:2 am_peak: 2022 stations, 0 above ceiling, excess 0 veh/h; offered 91.7% of the static fit; gate 223 (0 above, removed 53), non-gate 1799 (0 above, removed 30); non-gate ends origins inside 1040 to 852, outside 7095 to 5991, destinations inside 735 to 570, outside 5907 to 4810
- training:2 pm_peak: 1959 stations, 0 above ceiling, excess 0 veh/h; offered 90.7% of the static fit; gate 222 (0 above, removed 190), non-gate 1737 (0 above, removed 45); non-gate ends origins inside 1387 to 1035, outside 8768 to 7454, destinations inside 881 to 592, outside 6740 to 5271
- shipped:3 am_peak: 2034 stations, 0 above ceiling, excess 0 veh/h; offered 92.4% of the static fit; gate 217 (0 above, removed 61), non-gate 1817 (0 above, removed 50); non-gate ends origins inside 612 to 529, outside 7488 to 6455, destinations inside 528 to 439, outside 8211 to 6963
- shipped:3 pm_peak: 1991 stations, 0 above ceiling, excess 0 veh/h; offered 90.4% of the static fit; gate 216 (0 above, removed 112), non-gate 1775 (0 above, removed 69); non-gate ends origins inside 951 to 743, outside 9523 to 8202, destinations inside 734 to 445, outside 7901 to 6434
- training:3 am_peak: 2022 stations, 0 above ceiling, excess 0 veh/h; offered 91.8% of the static fit; gate 223 (0 above, removed 62), non-gate 1799 (0 above, removed 30); non-gate ends origins inside 1040 to 866, outside 7095 to 6051, destinations inside 735 to 561, outside 5907 to 4799
- training:3 pm_peak: 1959 stations, 1 above ceiling, excess 1 veh/h; offered 90.0% of the static fit; gate 222 (1 above, removed 209), non-gate 1737 (0 above, removed 47); non-gate ends origins inside 1387 to 1005, outside 8768 to 7388, destinations inside 881 to 565, outside 6740 to 5222

## Files

- shipped demand: 0a589118e2ef6719
- shipped membership file: 994662b2f7280647
- training demand: 26f4b0bd65c74a3c
- training membership file: 2854ebafc745f58d
