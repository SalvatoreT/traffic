# Membership loop (calibration rounds 48 to 51)

Seeds 1 to 10 per pass, periods pm_peak, am_peak. Passes run: 3. Pooled with equal weight over passes (successive averages, step 1/n, ASSUMPTION for this fixed point).

| Pass | View | Period | Offered car veh/h | Selected | With pairs | Zero hits | Not exported | Flow change / seed SE | Membership change / seed SE | Ceiling stations | Above ceiling | Excess veh/h | Offered / static fit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | shipped | pm_peak | 27612 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | - | - | - | - | - | - |
| 0 | shipped | am_peak | 23204 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | - | - | - | - | - | - |
| 0 | training | pm_peak | 25044 | 256 | 256 | - | - | - | - | - | - | - | - |
| 0 | training | am_peak | 20584 | 201 | 201 | - | - | - | - | - | - | - | - |
| 1 | shipped | pm_peak | 24637 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | 3.65 | 3.33 | 1878 | 0 | 0 | 89.2% |
| 1 | shipped | am_peak | 21575 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | 3.92 | 2.57 | 1923 | 0 | 0 | 93.0% |
| 1 | training | pm_peak | 22912 | 256 | 256 | - | - | 3.57 | 3.01 | 1846 | 0 | 0 | 91.5% |
| 1 | training | am_peak | 19194 | 201 | 201 | - | - | 3.40 | 2.69 | 1909 | 0 | 0 | 93.3% |
| 2 | shipped | pm_peak | 24888 | 337 | 335 | ix sr24-clifton-claremont move 1600>1771, ix telegraph-51st move 1629>1764 | - | 1.46 | 1.84 | 1878 | 1 | 1 | 90.1% |
| 2 | shipped | am_peak | 21536 | 272 | 271 | ix telegraph-51st move 1629>1764 | - | 1.40 | 1.43 | 1923 | 1 | 1 | 92.8% |
| 2 | training | pm_peak | 22760 | 256 | 256 | - | - | 1.56 | 1.56 | 1846 | 1 | 1 | 90.9% |
| 2 | training | am_peak | 19085 | 201 | 201 | - | - | 2.51 | 1.71 | 1909 | 0 | 0 | 92.7% |

## Static membership

- shipped:pm_peak: gate 265 in (no links and no movement or route feature (a gate total)); gate 265 out (no links and no movement or route feature (a gate total)); gate 295 in (no links and no movement or route feature (a gate total)); gate 295 out (no links and no movement or route feature (a gate total)); gate 763 in (no links and no movement or route feature (a gate total)); gate 1735 out (no links and no movement or route feature (a gate total))
- shipped:am_peak: gate 265 in (no links and no movement or route feature (a gate total)); gate 265 out (no links and no movement or route feature (a gate total)); gate 295 in (no links and no movement or route feature (a gate total)); gate 295 out (no links and no movement or route feature (a gate total)); gate 763 in (no links and no movement or route feature (a gate total)); gate 1735 out (no links and no movement or route feature (a gate total))
- training:pm_peak: none
- training:am_peak: none

## Gate prior ceilings, by build

- shipped:1 am_peak: 1923 stations, 0 above ceiling, excess 0 veh/h; offered 93.0% of the static fit; gate 217 (0 above, removed 49), non-gate 1706 (0 above, removed 25); non-gate ends origins inside 612 to 674, outside 7488 to 6377, destinations inside 528 to 510, outside 8211 to 6966
- shipped:1 pm_peak: 1878 stations, 0 above ceiling, excess 0 veh/h; offered 89.2% of the static fit; gate 216 (0 above, removed 73), non-gate 1662 (0 above, removed 33); non-gate ends origins inside 951 to 868, outside 9523 to 7854, destinations inside 734 to 733, outside 7901 to 6144
- training:1 am_peak: 1909 stations, 0 above ceiling, excess 0 veh/h; offered 93.3% of the static fit; gate 223 (0 above, removed 61), non-gate 1686 (0 above, removed 16); non-gate ends origins inside 1040 to 1213, outside 7095 to 5895, destinations inside 735 to 812, outside 5907 to 4838
- training:1 pm_peak: 1846 stations, 0 above ceiling, excess 0 veh/h; offered 91.5% of the static fit; gate 222 (0 above, removed 140), non-gate 1624 (0 above, removed 29); non-gate ends origins inside 1387 to 1226, outside 8768 to 7439, destinations inside 881 to 839, outside 6740 to 5307
- shipped:2 am_peak: 1923 stations, 1 above ceiling, excess 1 veh/h; offered 92.8% of the static fit; gate 217 (1 above, removed 54), non-gate 1706 (0 above, removed 34); non-gate ends origins inside 612 to 722, outside 7488 to 6336, destinations inside 528 to 481, outside 8211 to 6986
- shipped:2 pm_peak: 1878 stations, 1 above ceiling, excess 1 veh/h; offered 90.1% of the static fit; gate 216 (1 above, removed 100), non-gate 1662 (0 above, removed 50); non-gate ends origins inside 951 to 803, outside 9523 to 8082, destinations inside 734 to 634, outside 7901 to 6306
- training:2 am_peak: 1909 stations, 0 above ceiling, excess 0 veh/h; offered 92.7% of the static fit; gate 223 (0 above, removed 34), non-gate 1686 (0 above, removed 19); non-gate ends origins inside 1040 to 1209, outside 7095 to 5872, destinations inside 735 to 793, outside 5907 to 4757
- training:2 pm_peak: 1846 stations, 1 above ceiling, excess 1 veh/h; offered 90.9% of the static fit; gate 222 (1 above, removed 190), non-gate 1624 (0 above, removed 39); non-gate ends origins inside 1387 to 1152, outside 8768 to 7447, destinations inside 881 to 762, outside 6740 to 5168
- shipped:3 am_peak: 1923 stations, 1 above ceiling, excess 2 veh/h; offered 92.7% of the static fit; gate 217 (1 above, removed 58), non-gate 1706 (0 above, removed 38); non-gate ends origins inside 612 to 752, outside 7488 to 6286, destinations inside 528 to 489, outside 8211 to 6953
- shipped:3 pm_peak: 1878 stations, 0 above ceiling, excess 0 veh/h; offered 89.7% of the static fit; gate 216 (0 above, removed 117), non-gate 1662 (0 above, removed 56); non-gate ends origins inside 951 to 794, outside 9523 to 8040, destinations inside 734 to 614, outside 7901 to 6256
- training:3 am_peak: 1909 stations, 1 above ceiling, excess 3 veh/h; offered 92.9% of the static fit; gate 223 (1 above, removed 42), non-gate 1686 (0 above, removed 20); non-gate ends origins inside 1040 to 1213, outside 7095 to 5882, destinations inside 735 to 765, outside 5907 to 4773
- training:3 pm_peak: 1846 stations, 1 above ceiling, excess 1 veh/h; offered 90.5% of the static fit; gate 222 (1 above, removed 199), non-gate 1624 (0 above, removed 41); non-gate ends origins inside 1387 to 1173, outside 8768 to 7372, destinations inside 881 to 763, outside 6740 to 5138

## Share and through targets, by build

Each target against the fit's own figure on the membership it used and on the static routes (calibration round 51). Shares in percent, through figures in cars per hour.

- shipped:0 am_peak route weight count route 2591>2605 (static): base 1, 7 blocks, weight 1
- shipped:0 am_peak route weight count route 2606>2592 (static): base 1, 7 blocks, weight 1
- shipped:0 am_peak route weight count route 2676>2670 (static): base 1, 4 blocks, weight 1
- shipped:0 am_peak route weight count route 2669>2675 (static): base 1, 4 blocks, weight 1
- shipped:0 pm_peak route weight count route 2591>2605 (static): base 1, 7 blocks, weight 1
- shipped:0 pm_peak route weight count route 2606>2592 (static): base 1, 7 blocks, weight 1
- shipped:0 pm_peak route weight count route 2676>2670 (static): base 1, 4 blocks, weight 1
- shipped:0 pm_peak route weight count route 2669>2675 (static): base 1, 4 blocks, weight 1
- shipped:1 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 48%), offered 64% (static routes 60%), 487 flows
- shipped:1 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 49% (static routes 49%), offered 68% (static routes 70%), 373 flows
- shipped:1 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 57% (static routes 55%), offered 88% (static routes 83%), 164 flows
- shipped:1 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 41% (static routes 38%), offered 80% (static routes 82%), 525 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 16% (static routes 16%), offered 24% (static routes 24%), 243 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 12% (static routes 12%), offered 9% (static routes 9%), 243 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 12% (static routes 12%), offered 27% (static routes 27%), 243 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 11% (static routes 11%), offered 17% (static routes 17%), 243 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 7% (static routes 7%), offered 15% (static routes 15%), 243 flows
- shipped:1 am_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 243 flows
- shipped:1 am_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 12% (static routes 12%), offered 34% (static routes 34%), 221 flows
- shipped:1 am_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 14% (static routes 14%), offered 18% (static routes 18%), 221 flows
- shipped:1 am_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 11% (static routes 11%), offered 10% (static routes 10%), 221 flows
- shipped:1 am_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 7% (static routes 7%), offered 10% (static routes 10%), 221 flows
- shipped:1 am_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 2% (static routes 2%), offered 2% (static routes 2%), 221 flows
- shipped:1 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 47% (static routes 46%), offered 70% (static routes 64%), 568 flows
- shipped:1 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 47% (static routes 50%), offered 65% (static routes 69%), 612 flows
- shipped:1 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 65% (static routes 64%), offered 84% (static routes 82%), 211 flows
- shipped:1 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 48% (static routes 60%), offered 84% (static routes 86%), 551 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 17% (static routes 17%), offered 32% (static routes 32%), 234 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 14% (static routes 14%), offered 11% (static routes 11%), 234 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 23% (static routes 23%), 234 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 13% (static routes 13%), offered 15% (static routes 15%), 234 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 9% (static routes 9%), offered 14% (static routes 14%), 234 flows
- shipped:1 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 4% (static routes 4%), offered 1% (static routes 1%), 234 flows
- shipped:1 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 234 flows
- shipped:1 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 18% (static routes 18%), 234 flows
- shipped:1 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 14% (static routes 14%), offered 15% (static routes 15%), 234 flows
- shipped:1 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 6% (static routes 6%), offered 9% (static routes 9%), 234 flows
- shipped:1 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 234 flows
- shipped:1 am_peak route weight count route 2591>2605 (simulated): base 1, 7 blocks, weight 7
- shipped:1 am_peak route weight count route 2606>2592 (simulated): base 1, 7 blocks, weight 7
- shipped:1 am_peak route weight count route 2676>2670 (simulated): base 1, 4 blocks, weight 4
- shipped:1 am_peak route weight count route 2669>2675 (simulated): base 1, 4 blocks, weight 4
- shipped:1 pm_peak route weight count route 2591>2605 (simulated): base 1, 7 blocks, weight 7
- shipped:1 pm_peak route weight count route 2606>2592 (simulated): base 1, 7 blocks, weight 7
- shipped:1 pm_peak route weight count route 2676>2670 (simulated): base 1, 4 blocks, weight 4
- shipped:1 pm_peak route weight count route 2669>2675 (simulated): base 1, 4 blocks, weight 4
- training:1 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 42%), offered 56% (static routes 57%), 536 flows
- training:1 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 43%), offered 62% (static routes 62%), 414 flows
- training:1 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 57% (static routes 50%), offered 78% (static routes 73%), 204 flows
- training:1 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 41% (static routes 42%), offered 73% (static routes 77%), 674 flows
- training:1 am_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 16% (static routes 16%), offered 23% (static routes 23%), 227 flows
- training:1 am_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 12% (static routes 12%), offered 9% (static routes 9%), 227 flows
- training:1 am_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 28% (static routes 28%), 227 flows
- training:1 am_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 11% (static routes 11%), offered 17% (static routes 17%), 227 flows
- training:1 am_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 7% (static routes 7%), offered 14% (static routes 14%), 227 flows
- training:1 am_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 227 flows
- training:1 am_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 11% (static routes 11%), offered 35% (static routes 35%), 210 flows
- training:1 am_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 19% (static routes 19%), 210 flows
- training:1 am_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 9% (static routes 9%), offered 8% (static routes 8%), 210 flows
- training:1 am_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 6% (static routes 6%), offered 10% (static routes 10%), 210 flows
- training:1 am_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 210 flows
- training:1 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 43%), offered 56% (static routes 58%), 585 flows
- training:1 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 42% (static routes 45%), offered 68% (static routes 73%), 599 flows
- training:1 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 66% (static routes 74%), offered 78% (static routes 79%), 371 flows
- training:1 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 42% (static routes 56%), offered 66% (static routes 75%), 827 flows
- training:1 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 17% (static routes 17%), offered 31% (static routes 31%), 217 flows
- training:1 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 13% (static routes 13%), offered 11% (static routes 11%), 217 flows
- training:1 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 217 flows
- training:1 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 15% (static routes 15%), 217 flows
- training:1 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 8% (static routes 8%), offered 13% (static routes 13%), 217 flows
- training:1 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 217 flows
- training:1 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 204 flows
- training:1 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 19% (static routes 19%), 204 flows
- training:1 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 10% (static routes 10%), offered 12% (static routes 12%), 204 flows
- training:1 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 5% (static routes 5%), offered 9% (static routes 9%), 204 flows
- training:1 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 1% (static routes 1%), 204 flows
- shipped:2 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 48%), offered 64% (static routes 60%), 524 flows
- shipped:2 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 48% (static routes 50%), offered 69% (static routes 70%), 417 flows
- shipped:2 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 56% (static routes 56%), offered 87% (static routes 83%), 203 flows
- shipped:2 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 40% (static routes 42%), offered 78% (static routes 82%), 584 flows
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
- shipped:2 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 47% (static routes 50%), offered 71% (static routes 64%), 620 flows
- shipped:2 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 48% (static routes 49%), offered 66% (static routes 69%), 656 flows
- shipped:2 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 64% (static routes 68%), offered 82% (static routes 82%), 306 flows
- shipped:2 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 47% (static routes 60%), offered 78% (static routes 86%), 705 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 18% (static routes 18%), offered 32% (static routes 32%), 234 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 15% (static routes 15%), offered 11% (static routes 11%), 234 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 23% (static routes 23%), 234 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 13% (static routes 13%), offered 15% (static routes 15%), 234 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 9% (static routes 9%), offered 14% (static routes 14%), 234 flows
- shipped:2 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 4% (static routes 4%), offered 1% (static routes 1%), 234 flows
- shipped:2 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 234 flows
- shipped:2 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 12% (static routes 12%), offered 18% (static routes 18%), 234 flows
- shipped:2 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 15% (static routes 15%), offered 15% (static routes 15%), 234 flows
- shipped:2 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 7% (static routes 7%), offered 9% (static routes 9%), 234 flows
- shipped:2 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 234 flows
- shipped:2 am_peak route weight count route 2591>2605 (simulated): base 1, 7 blocks, weight 7
- shipped:2 am_peak route weight count route 2606>2592 (simulated): base 1, 7 blocks, weight 7
- shipped:2 am_peak route weight count route 2676>2670 (simulated): base 1, 4 blocks, weight 4
- shipped:2 am_peak route weight count route 2669>2675 (simulated): base 1, 4 blocks, weight 4
- shipped:2 pm_peak route weight count route 2591>2605 (simulated): base 1, 7 blocks, weight 7
- shipped:2 pm_peak route weight count route 2606>2592 (simulated): base 1, 7 blocks, weight 7
- shipped:2 pm_peak route weight count route 2676>2670 (simulated): base 1, 4 blocks, weight 4
- shipped:2 pm_peak route weight count route 2669>2675 (simulated): base 1, 4 blocks, weight 4
- training:2 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 41%), offered 55% (static routes 57%), 567 flows
- training:2 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 43%), offered 61% (static routes 62%), 456 flows
- training:2 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 57% (static routes 54%), offered 79% (static routes 73%), 261 flows
- training:2 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 41% (static routes 45%), offered 70% (static routes 77%), 770 flows
- training:2 am_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 16% (static routes 16%), offered 23% (static routes 23%), 227 flows
- training:2 am_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 12% (static routes 12%), offered 9% (static routes 9%), 227 flows
- training:2 am_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 28% (static routes 28%), 227 flows
- training:2 am_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 11% (static routes 11%), offered 17% (static routes 17%), 227 flows
- training:2 am_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 7% (static routes 7%), offered 14% (static routes 14%), 227 flows
- training:2 am_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 227 flows
- training:2 am_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 11% (static routes 11%), offered 35% (static routes 35%), 210 flows
- training:2 am_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 19% (static routes 19%), 210 flows
- training:2 am_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 9% (static routes 9%), offered 8% (static routes 8%), 210 flows
- training:2 am_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 6% (static routes 6%), offered 10% (static routes 10%), 210 flows
- training:2 am_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 210 flows
- training:2 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 45%), offered 56% (static routes 58%), 646 flows
- training:2 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 42% (static routes 46%), offered 65% (static routes 73%), 669 flows
- training:2 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 65% (static routes 77%), offered 76% (static routes 79%), 480 flows
- training:2 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 43% (static routes 59%), offered 64% (static routes 75%), 980 flows
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
- shipped:3 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 47%), offered 64% (static routes 60%), 550 flows
- shipped:3 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 48% (static routes 49%), offered 69% (static routes 70%), 442 flows
- shipped:3 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 57% (static routes 55%), offered 87% (static routes 83%), 228 flows
- shipped:3 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 40% (static routes 42%), offered 77% (static routes 82%), 616 flows
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
- shipped:3 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 46% (static routes 51%), offered 71% (static routes 64%), 646 flows
- shipped:3 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 48% (static routes 49%), offered 66% (static routes 69%), 681 flows
- shipped:3 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 64% (static routes 68%), offered 81% (static routes 82%), 343 flows
- shipped:3 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 47% (static routes 61%), offered 78% (static routes 86%), 779 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 18% (static routes 18%), offered 32% (static routes 32%), 234 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 15% (static routes 15%), offered 11% (static routes 11%), 234 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 23% (static routes 23%), 234 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 13% (static routes 13%), offered 15% (static routes 15%), 234 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 9% (static routes 9%), offered 14% (static routes 14%), 234 flows
- shipped:3 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 4% (static routes 4%), offered 1% (static routes 1%), 234 flows
- shipped:3 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 234 flows
- shipped:3 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 12% (static routes 12%), offered 18% (static routes 18%), 234 flows
- shipped:3 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 15% (static routes 15%), offered 15% (static routes 15%), 234 flows
- shipped:3 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 7% (static routes 7%), offered 9% (static routes 9%), 234 flows
- shipped:3 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 234 flows
- shipped:3 am_peak route weight count route 2591>2605 (simulated): base 1, 7 blocks, weight 7
- shipped:3 am_peak route weight count route 2606>2592 (simulated): base 1, 7 blocks, weight 7
- shipped:3 am_peak route weight count route 2676>2670 (simulated): base 1, 4 blocks, weight 4
- shipped:3 am_peak route weight count route 2669>2675 (simulated): base 1, 4 blocks, weight 4
- shipped:3 pm_peak route weight count route 2591>2605 (simulated): base 1, 7 blocks, weight 7
- shipped:3 pm_peak route weight count route 2606>2592 (simulated): base 1, 7 blocks, weight 7
- shipped:3 pm_peak route weight count route 2676>2670 (simulated): base 1, 4 blocks, weight 4
- shipped:3 pm_peak route weight count route 2669>2675 (simulated): base 1, 4 blocks, weight 4
- training:3 am_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 40%), offered 55% (static routes 57%), 598 flows
- training:3 am_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 45% (static routes 42%), offered 60% (static routes 62%), 491 flows
- training:3 am_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 57%, fit 57% (static routes 55%), offered 79% (static routes 73%), 286 flows
- training:3 am_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 40% (static routes 47%), offered 69% (static routes 77%), 818 flows
- training:3 am_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 16% (static routes 16%), offered 23% (static routes 23%), 227 flows
- training:3 am_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 12% (static routes 12%), offered 9% (static routes 9%), 227 flows
- training:3 am_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 28% (static routes 28%), 227 flows
- training:3 am_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 11% (static routes 11%), offered 17% (static routes 17%), 227 flows
- training:3 am_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 7% (static routes 7%), offered 14% (static routes 14%), 227 flows
- training:3 am_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 5% (static routes 5%), offered 1% (static routes 1%), 227 flows
- training:3 am_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 11% (static routes 11%), offered 35% (static routes 35%), 210 flows
- training:3 am_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 11% (static routes 11%), offered 19% (static routes 19%), 210 flows
- training:3 am_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 9% (static routes 9%), offered 8% (static routes 8%), 210 flows
- training:3 am_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 6% (static routes 6%), offered 10% (static routes 10%), 210 flows
- training:3 am_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 2% (static routes 2%), 210 flows
- training:3 pm_peak share Hillegass Avenue NB, trips from the freeway (simulated): target 47%, fit 44% (static routes 45%), offered 55% (static routes 58%), 667 flows
- training:3 pm_peak share Colby Street NB, trips from the freeway (simulated): target 47%, fit 42% (static routes 48%), offered 62% (static routes 73%), 703 flows
- training:3 pm_peak share Hillegass Avenue SB, trips to the freeway (simulated): target 68%, fit 65% (static routes 75%), offered 76% (static routes 79%), 519 flows
- training:3 pm_peak share Colby Street SB, trips to the freeway (simulated): target 45%, fit 44% (static routes 59%), offered 63% (static routes 75%), 1062 flows
- training:3 pm_peak share Onto the freeway at the ramps, via College Avenue (static): target 16%, fit 17% (static routes 17%), offered 31% (static routes 31%), 217 flows
- training:3 pm_peak share Onto the freeway at the ramps, via Hillegass Avenue (static): target 12%, fit 14% (static routes 14%), offered 11% (static routes 11%), 217 flows
- training:3 pm_peak share Onto the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 217 flows
- training:3 pm_peak share Onto the freeway at the ramps, via Colby Street (static): target 8%, fit 12% (static routes 12%), offered 15% (static routes 15%), 217 flows
- training:3 pm_peak share Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue (static): target 8%, fit 8% (static routes 8%), offered 13% (static routes 13%), 217 flows
- training:3 pm_peak share Onto the freeway at the ramps, via Benvenue Avenue (static): target 5%, fit 4% (static routes 4%), offered 1% (static routes 1%), 217 flows
- training:3 pm_peak share From the freeway at the ramps, via College Avenue (static): target 10%, fit 10% (static routes 10%), offered 24% (static routes 24%), 204 flows
- training:3 pm_peak share From the freeway at the ramps, via Martin Street (static): target 10%, fit 10% (static routes 10%), offered 19% (static routes 19%), 204 flows
- training:3 pm_peak share From the freeway at the ramps, via Colby Street (static): target 8%, fit 9% (static routes 9%), offered 12% (static routes 12%), 204 flows
- training:3 pm_peak share From the freeway at the ramps, via Hillegass Avenue (static): target 5%, fit 6% (static routes 6%), offered 9% (static routes 9%), 204 flows
- training:3 pm_peak share From the freeway at the ramps, via Benvenue Avenue (static): target 3%, fit 3% (static routes 3%), offered 1% (static routes 1%), 204 flows

## Files

- shipped demand: 2d16d8f8eb0950ca
- shipped membership file: 3d639670c1feb38f
- training demand: 1c3b1666f24156f1
- training membership file: c1cd4ce96fb28791
