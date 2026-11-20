# Membership loop (calibration rounds 48 to 51)

Seeds 1 to 10 per pass, periods pm_peak, am_peak. Passes run: 3. Pooled with equal weight over passes (successive averages, step 1/n, ASSUMPTION for this fixed point).

| Pass | View | Period | Offered car veh/h | Selected | With pairs | Zero hits | Not exported | Flow change / seed SE | Membership change / seed SE | Ceiling stations | Above ceiling | Excess veh/h | Offered / static fit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | shipped | pm_peak | 27612 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | - | - | - | - | - | - |
| 0 | shipped | am_peak | 23204 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | - | - | - | - | - | - |
| 0 | training | pm_peak | 25044 | 256 | 256 | - | - | - | - | - | - | - | - |
| 0 | training | am_peak | 20584 | 201 | 201 | - | - | - | - | - | - | - | - |
| 1 | shipped | pm_peak | 24523 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | 3.67 | 3.25 | 1991 | 0 | 0 | 88.8% |
| 1 | shipped | am_peak | 21520 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | 4.40 | 2.48 | 2034 | 0 | 0 | 92.7% |
| 1 | training | pm_peak | 22742 | 256 | 256 | - | - | 3.69 | 3.00 | 1959 | 1 | 1 | 90.8% |
| 1 | training | am_peak | 18985 | 201 | 201 | - | - | 3.64 | 2.67 | 2022 | 0 | 0 | 92.2% |
| 2 | shipped | pm_peak | 24768 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | 1.78 | 1.72 | 1991 | 0 | 0 | 89.7% |
| 2 | shipped | am_peak | 21395 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | 1.55 | 1.41 | 2034 | 0 | 0 | 92.2% |
| 2 | training | pm_peak | 22713 | 256 | 256 | - | - | 1.67 | 1.66 | 1959 | 0 | 0 | 90.7% |
| 2 | training | am_peak | 18893 | 201 | 201 | - | - | 1.33 | 1.60 | 2022 | 0 | 0 | 91.8% |

## Static membership

- shipped:pm_peak: gate 265 in (no links and no movement or route feature (a gate total)); gate 265 out (no links and no movement or route feature (a gate total)); gate 295 in (no links and no movement or route feature (a gate total)); gate 295 out (no links and no movement or route feature (a gate total)); gate 763 in (no links and no movement or route feature (a gate total)); gate 1735 out (no links and no movement or route feature (a gate total))
- shipped:am_peak: gate 265 in (no links and no movement or route feature (a gate total)); gate 265 out (no links and no movement or route feature (a gate total)); gate 295 in (no links and no movement or route feature (a gate total)); gate 295 out (no links and no movement or route feature (a gate total)); gate 763 in (no links and no movement or route feature (a gate total)); gate 1735 out (no links and no movement or route feature (a gate total))
- training:pm_peak: none
- training:am_peak: none

## Gate prior ceilings, by build

- shipped:1 am_peak: 2034 stations, 0 above ceiling, excess 0 veh/h; offered 92.7% of the static fit; gate 217 (0 above, removed 48), non-gate 1817 (0 above, removed 32); non-gate ends origins inside 612 to 510, outside 7488 to 6465, destinations inside 528 to 447, outside 8211 to 6988
- shipped:1 pm_peak: 1991 stations, 0 above ceiling, excess 0 veh/h; offered 88.8% of the static fit; gate 216 (0 above, removed 67), non-gate 1775 (0 above, removed 40); non-gate ends origins inside 951 to 760, outside 9523 to 7850, destinations inside 734 to 512, outside 7901 to 6212
- training:1 am_peak: 2022 stations, 0 above ceiling, excess 0 veh/h; offered 92.2% of the static fit; gate 223 (0 above, removed 60), non-gate 1799 (0 above, removed 28); non-gate ends origins inside 1040 to 886, outside 7095 to 6039, destinations inside 735 to 588, outside 5907 to 4896
- training:1 pm_peak: 1959 stations, 1 above ceiling, excess 1 veh/h; offered 90.8% of the static fit; gate 222 (1 above, removed 140), non-gate 1737 (0 above, removed 36); non-gate ends origins inside 1387 to 1060, outside 8768 to 7464, destinations inside 881 to 628, outside 6740 to 5358
- shipped:2 am_peak: 2034 stations, 0 above ceiling, excess 0 veh/h; offered 92.2% of the static fit; gate 217 (0 above, removed 54), non-gate 1817 (0 above, removed 42); non-gate ends origins inside 612 to 513, outside 7488 to 6439, destinations inside 528 to 449, outside 8211 to 6883
- shipped:2 pm_peak: 1991 stations, 0 above ceiling, excess 0 veh/h; offered 89.7% of the static fit; gate 216 (0 above, removed 106), non-gate 1775 (0 above, removed 58); non-gate ends origins inside 951 to 722, outside 9523 to 8009, destinations inside 734 to 461, outside 7901 to 6382
- training:2 am_peak: 2022 stations, 0 above ceiling, excess 0 veh/h; offered 91.8% of the static fit; gate 223 (0 above, removed 68), non-gate 1799 (0 above, removed 29); non-gate ends origins inside 1040 to 854, outside 7095 to 5976, destinations inside 735 to 562, outside 5907 to 4810
- training:2 pm_peak: 1959 stations, 0 above ceiling, excess 0 veh/h; offered 90.7% of the static fit; gate 222 (0 above, removed 165), non-gate 1737 (0 above, removed 47); non-gate ends origins inside 1387 to 994, outside 8768 to 7490, destinations inside 881 to 596, outside 6740 to 5275
- shipped:3 am_peak: 2034 stations, 0 above ceiling, excess 0 veh/h; offered 92.4% of the static fit; gate 217 (0 above, removed 60), non-gate 1817 (0 above, removed 46); non-gate ends origins inside 612 to 528, outside 7488 to 6448, destinations inside 528 to 441, outside 8211 to 6933
- shipped:3 pm_peak: 1991 stations, 1 above ceiling, excess 1 veh/h; offered 89.4% of the static fit; gate 216 (1 above, removed 112), non-gate 1775 (0 above, removed 61); non-gate ends origins inside 951 to 727, outside 9523 to 8040, destinations inside 734 to 451, outside 7901 to 6349
- training:3 am_peak: 2022 stations, 0 above ceiling, excess 0 veh/h; offered 91.5% of the static fit; gate 223 (0 above, removed 48), non-gate 1799 (0 above, removed 29); non-gate ends origins inside 1040 to 865, outside 7095 to 5976, destinations inside 735 to 556, outside 5907 to 4767
- training:3 pm_peak: 1959 stations, 1 above ceiling, excess 1 veh/h; offered 90.1% of the static fit; gate 222 (1 above, removed 211), non-gate 1737 (0 above, removed 53); non-gate ends origins inside 1387 to 975, outside 8768 to 7445, destinations inside 881 to 567, outside 6740 to 5210

## Share and through targets, by build

Each target against the fit's own figure on the membership it used and on the static routes (calibration round 51). Shares in percent, through figures in cars per hour.

- shipped:1 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 47%), offered 64% (static routes 60%), 487 flows
- shipped:1 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 46% (static routes 48%), offered 68% (static routes 70%), 373 flows
- shipped:1 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 57% (static routes 55%), offered 88% (static routes 83%), 164 flows
- shipped:1 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 41% (static routes 38%), offered 80% (static routes 82%), 525 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 16% (static routes 16%), offered 24% (static routes 24%), 243 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 12% (static routes 12%), offered 9% (static routes 9%), 243 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 12% (static routes 12%), offered 27% (static routes 27%), 243 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 11% (static routes 11%), offered 17% (static routes 17%), 243 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 8% (static routes 8%), offered 15% (static routes 15%), 243 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 243 flows
- shipped:1 am_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 12% (static routes 12%), offered 34% (static routes 34%), 221 flows
- shipped:1 am_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 14% (static routes 14%), offered 18% (static routes 18%), 221 flows
- shipped:1 am_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 11% (static routes 11%), offered 10% (static routes 10%), 221 flows
- shipped:1 am_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 7% (static routes 7%), offered 10% (static routes 10%), 221 flows
- shipped:1 am_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 2% (static routes 2%), offered 2% (static routes 2%), 221 flows
- shipped:1 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 47% (static routes 46%), offered 70% (static routes 64%), 568 flows
- shipped:1 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 46% (static routes 48%), offered 65% (static routes 69%), 612 flows
- shipped:1 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 65% (static routes 66%), offered 84% (static routes 82%), 211 flows
- shipped:1 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 49% (static routes 59%), offered 84% (static routes 86%), 551 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 18% (static routes 18%), offered 32% (static routes 32%), 234 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 14% (static routes 14%), offered 11% (static routes 11%), 234 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 23% (static routes 23%), 234 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 15% (static routes 15%), 234 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 9% (static routes 9%), offered 14% (static routes 14%), 234 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 4% (static routes 4%), offered 1% (static routes 1%), 234 flows
- shipped:1 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 234 flows
- shipped:1 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 18% (static routes 18%), 234 flows
- shipped:1 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 14% (static routes 14%), offered 15% (static routes 15%), 234 flows
- shipped:1 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 7% (static routes 7%), offered 9% (static routes 9%), 234 flows
- shipped:1 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 234 flows
- training:1 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 42%), offered 56% (static routes 57%), 536 flows
- training:1 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 43%), offered 62% (static routes 62%), 414 flows
- training:1 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 57% (static routes 51%), offered 78% (static routes 73%), 204 flows
- training:1 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 43% (static routes 45%), offered 73% (static routes 77%), 674 flows
- training:1 am_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 16% (static routes 16%), offered 23% (static routes 23%), 227 flows
- training:1 am_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 12% (static routes 12%), offered 9% (static routes 9%), 227 flows
- training:1 am_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 28% (static routes 28%), 227 flows
- training:1 am_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 11% (static routes 11%), offered 17% (static routes 17%), 227 flows
- training:1 am_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 7% (static routes 7%), offered 14% (static routes 14%), 227 flows
- training:1 am_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 227 flows
- training:1 am_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 11% (static routes 11%), offered 35% (static routes 35%), 210 flows
- training:1 am_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 19% (static routes 19%), 210 flows
- training:1 am_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 9% (static routes 9%), offered 8% (static routes 8%), 210 flows
- training:1 am_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 6% (static routes 6%), offered 10% (static routes 10%), 210 flows
- training:1 am_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 210 flows
- training:1 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 43%), offered 56% (static routes 58%), 585 flows
- training:1 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 42% (static routes 44%), offered 68% (static routes 73%), 599 flows
- training:1 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 66% (static routes 75%), offered 78% (static routes 79%), 371 flows
- training:1 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 43% (static routes 57%), offered 66% (static routes 75%), 827 flows
- training:1 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 17% (static routes 17%), offered 31% (static routes 31%), 217 flows
- training:1 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 13% (static routes 13%), offered 11% (static routes 11%), 217 flows
- training:1 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 217 flows
- training:1 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 15% (static routes 15%), 217 flows
- training:1 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 8% (static routes 8%), offered 13% (static routes 13%), 217 flows
- training:1 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 217 flows
- training:1 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 204 flows
- training:1 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 19% (static routes 19%), 204 flows
- training:1 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 9% (static routes 9%), offered 12% (static routes 12%), 204 flows
- training:1 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 6% (static routes 6%), offered 9% (static routes 9%), 204 flows
- training:1 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 1% (static routes 1%), 204 flows
- shipped:2 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 43% (static routes 47%), offered 63% (static routes 60%), 527 flows
- shipped:2 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 47%), offered 69% (static routes 70%), 416 flows
- shipped:2 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 56% (static routes 56%), offered 88% (static routes 83%), 194 flows
- shipped:2 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 39% (static routes 40%), offered 77% (static routes 82%), 589 flows
- shipped:2 am_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 16% (static routes 16%), offered 24% (static routes 24%), 243 flows
- shipped:2 am_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 12% (static routes 12%), offered 9% (static routes 9%), 243 flows
- shipped:2 am_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 12% (static routes 12%), offered 27% (static routes 27%), 243 flows
- shipped:2 am_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 17% (static routes 17%), 243 flows
- shipped:2 am_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 7% (static routes 7%), offered 15% (static routes 15%), 243 flows
- shipped:2 am_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 243 flows
- shipped:2 am_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 12% (static routes 12%), offered 34% (static routes 34%), 221 flows
- shipped:2 am_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 14% (static routes 14%), offered 18% (static routes 18%), 221 flows
- shipped:2 am_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 11% (static routes 11%), offered 10% (static routes 10%), 221 flows
- shipped:2 am_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 7% (static routes 7%), offered 10% (static routes 10%), 221 flows
- shipped:2 am_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 2% (static routes 2%), offered 2% (static routes 2%), 221 flows
- shipped:2 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 46% (static routes 49%), offered 69% (static routes 64%), 617 flows
- shipped:2 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 47%), offered 66% (static routes 69%), 669 flows
- shipped:2 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 64% (static routes 71%), offered 82% (static routes 82%), 306 flows
- shipped:2 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 46% (static routes 65%), offered 80% (static routes 86%), 700 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 18% (static routes 18%), offered 32% (static routes 32%), 234 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 15% (static routes 15%), offered 11% (static routes 11%), 234 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 23% (static routes 23%), 234 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 15% (static routes 15%), 234 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 9% (static routes 9%), offered 14% (static routes 14%), 234 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 4% (static routes 4%), offered 1% (static routes 1%), 234 flows
- shipped:2 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 234 flows
- shipped:2 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 18% (static routes 18%), 234 flows
- shipped:2 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 14% (static routes 14%), offered 15% (static routes 15%), 234 flows
- shipped:2 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 7% (static routes 7%), offered 9% (static routes 9%), 234 flows
- shipped:2 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 234 flows
- training:2 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 40%), offered 56% (static routes 57%), 593 flows
- training:2 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 44%), offered 61% (static routes 62%), 462 flows
- training:2 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 57% (static routes 56%), offered 79% (static routes 73%), 259 flows
- training:2 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 42% (static routes 47%), offered 70% (static routes 77%), 761 flows
- training:2 am_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 16% (static routes 16%), offered 23% (static routes 23%), 227 flows
- training:2 am_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 12% (static routes 12%), offered 9% (static routes 9%), 227 flows
- training:2 am_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 28% (static routes 28%), 227 flows
- training:2 am_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 17% (static routes 17%), 227 flows
- training:2 am_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 7% (static routes 7%), offered 14% (static routes 14%), 227 flows
- training:2 am_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 227 flows
- training:2 am_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 11% (static routes 11%), offered 35% (static routes 35%), 210 flows
- training:2 am_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 19% (static routes 19%), 210 flows
- training:2 am_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 10% (static routes 10%), offered 8% (static routes 8%), 210 flows
- training:2 am_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 6% (static routes 6%), offered 10% (static routes 10%), 210 flows
- training:2 am_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 210 flows
- training:2 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 44%), offered 56% (static routes 58%), 643 flows
- training:2 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 42% (static routes 46%), offered 65% (static routes 73%), 680 flows
- training:2 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 66% (static routes 74%), offered 77% (static routes 79%), 456 flows
- training:2 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 43% (static routes 59%), offered 64% (static routes 75%), 960 flows
- training:2 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 17% (static routes 17%), offered 31% (static routes 31%), 217 flows
- training:2 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 14% (static routes 14%), offered 11% (static routes 11%), 217 flows
- training:2 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 217 flows
- training:2 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 15% (static routes 15%), 217 flows
- training:2 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 8% (static routes 8%), offered 13% (static routes 13%), 217 flows
- training:2 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 4% (static routes 4%), offered 1% (static routes 1%), 217 flows
- training:2 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 204 flows
- training:2 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 19% (static routes 19%), 204 flows
- training:2 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 9% (static routes 9%), offered 12% (static routes 12%), 204 flows
- training:2 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 6% (static routes 6%), offered 9% (static routes 9%), 204 flows
- training:2 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 1% (static routes 1%), 204 flows
- shipped:3 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 46%), offered 65% (static routes 60%), 559 flows
- shipped:3 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 46%), offered 68% (static routes 70%), 442 flows
- shipped:3 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 57% (static routes 56%), offered 88% (static routes 83%), 208 flows
- shipped:3 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 39% (static routes 41%), offered 78% (static routes 82%), 616 flows
- shipped:3 am_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 16% (static routes 16%), offered 24% (static routes 24%), 243 flows
- shipped:3 am_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 12% (static routes 12%), offered 9% (static routes 9%), 243 flows
- shipped:3 am_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 12% (static routes 12%), offered 27% (static routes 27%), 243 flows
- shipped:3 am_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 17% (static routes 17%), 243 flows
- shipped:3 am_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 7% (static routes 7%), offered 15% (static routes 15%), 243 flows
- shipped:3 am_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 243 flows
- shipped:3 am_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 12% (static routes 12%), offered 34% (static routes 34%), 221 flows
- shipped:3 am_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 14% (static routes 14%), offered 18% (static routes 18%), 221 flows
- shipped:3 am_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 11% (static routes 11%), offered 10% (static routes 10%), 221 flows
- shipped:3 am_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 7% (static routes 7%), offered 10% (static routes 10%), 221 flows
- shipped:3 am_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 2% (static routes 2%), offered 2% (static routes 2%), 221 flows
- shipped:3 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 47% (static routes 47%), offered 70% (static routes 64%), 642 flows
- shipped:3 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 46% (static routes 47%), offered 66% (static routes 69%), 701 flows
- shipped:3 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 63% (static routes 71%), offered 82% (static routes 82%), 336 flows
- shipped:3 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 46% (static routes 66%), offered 79% (static routes 86%), 767 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 18% (static routes 18%), offered 32% (static routes 32%), 234 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 15% (static routes 15%), offered 11% (static routes 11%), 234 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 23% (static routes 23%), 234 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 15% (static routes 15%), 234 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 9% (static routes 9%), offered 14% (static routes 14%), 234 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 4% (static routes 4%), offered 1% (static routes 1%), 234 flows
- shipped:3 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 234 flows
- shipped:3 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 18% (static routes 18%), 234 flows
- shipped:3 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 14% (static routes 14%), offered 15% (static routes 15%), 234 flows
- shipped:3 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 7% (static routes 7%), offered 9% (static routes 9%), 234 flows
- shipped:3 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 234 flows
- training:3 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 39%), offered 56% (static routes 57%), 607 flows
- training:3 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 43%), offered 60% (static routes 62%), 500 flows
- training:3 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 57% (static routes 56%), offered 78% (static routes 73%), 291 flows
- training:3 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 41% (static routes 49%), offered 70% (static routes 77%), 813 flows
- training:3 am_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 16% (static routes 16%), offered 23% (static routes 23%), 227 flows
- training:3 am_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 12% (static routes 12%), offered 9% (static routes 9%), 227 flows
- training:3 am_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 28% (static routes 28%), 227 flows
- training:3 am_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 17% (static routes 17%), 227 flows
- training:3 am_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 7% (static routes 7%), offered 14% (static routes 14%), 227 flows
- training:3 am_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 227 flows
- training:3 am_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 11% (static routes 11%), offered 35% (static routes 35%), 210 flows
- training:3 am_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 19% (static routes 19%), 210 flows
- training:3 am_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 10% (static routes 10%), offered 8% (static routes 8%), 210 flows
- training:3 am_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 6% (static routes 6%), offered 10% (static routes 10%), 210 flows
- training:3 am_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 210 flows
- training:3 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 45%), offered 55% (static routes 58%), 678 flows
- training:3 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 42% (static routes 48%), offered 63% (static routes 73%), 722 flows
- training:3 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 65% (static routes 74%), offered 76% (static routes 79%), 507 flows
- training:3 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 44% (static routes 58%), offered 63% (static routes 75%), 1041 flows
- training:3 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 17% (static routes 17%), offered 31% (static routes 31%), 217 flows
- training:3 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 14% (static routes 14%), offered 11% (static routes 11%), 217 flows
- training:3 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 217 flows
- training:3 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 15% (static routes 15%), 217 flows
- training:3 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 9% (static routes 9%), offered 13% (static routes 13%), 217 flows
- training:3 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 4% (static routes 4%), offered 1% (static routes 1%), 217 flows
- training:3 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 204 flows
- training:3 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 19% (static routes 19%), 204 flows
- training:3 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 9% (static routes 9%), offered 12% (static routes 12%), 204 flows
- training:3 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 5% (static routes 5%), offered 9% (static routes 9%), 204 flows
- training:3 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 1% (static routes 1%), 204 flows

## Files

- shipped demand: 5d6be8a70618e905
- shipped membership file: 74a88c864d406903
- training demand: 7164fa2ab08f612a
- training membership file: 7d0fdb063236304d
