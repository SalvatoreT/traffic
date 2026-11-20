## i1-shipped-build (rockridge.fit.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2034 stations; 0 above ceiling; excess 0 veh/h; offered car 23202 to 21519 veh/h.

Offered car veh/h by flow type, static fit then final: through 3745, local 9586, ramp 9871; through 3545, local 8219, ramp 9755.

Hard projection am_peak: removed 80 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 154 and after 149 of 278.

Ceiling stations by kind am_peak: gate 217 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 48 veh/h; non-gate 1817 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 32 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 612 to 510, outside 7488 to 6465; destinations inside 528 to 447, outside 8211 to 6988.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 1672 | Warren Freeway | entering | 821 | 831 | 821 | 9 |
| 1719 | Grove Shafter Freeway | entering | 337 | 342 | 337 | 5 |
| 183 | San Pablo Avenue | entering | 824 | 828 | 824 | 4 |
| 602 | Grove Shafter Freeway | entering | 3656 | 3660 | 3654 | 4 |
| 133 | 62nd Street | entering | 47 | 50 | 47 | 3 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1991 stations; 0 above ceiling; excess 0 veh/h; offered car 27609 to 24521 veh/h.

Offered car veh/h by flow type, static fit then final: through 5907, local 10360, ramp 11342; through 4944, local 8253, ramp 11324.

Hard projection pm_peak: removed 107 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 184 and after 187 of 343.

Ceiling stations by kind pm_peak: gate 216 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 67 veh/h; non-gate 1775 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 40 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 951 to 760, outside 9523 to 7850; destinations inside 734 to 512, outside 7901 to 6212.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 3944 | 3961 | 3942 | 17 |
| 1398 | Claremont Boulevard | entering | 357 | 364 | 357 | 7 |
| 1756 | Claremont Avenue | leaving | 567 | 574 | 567 | 6 |
| 183 | San Pablo Avenue | entering | 1023 | 1028 | 1021 | 4 |
| 275 | Market Street | entering | 308 | 312 | 308 | 4 |



Share am_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 64% (60%); final 44% (47%); 487 flows.
Share am_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 68% (70%); final 46% (48%); 373 flows.
Share am_peak Hillegass Avenue SB, trips to the freeway: simulated; target 57%; offered 88% (83%); final 57% (55%); 164 flows.
Share am_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 80% (82%); final 41% (38%); 525 flows.
Share am_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 24% (24%); final 16% (16%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 9% (9%); final 12% (12%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 27% (27%); final 12% (12%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 11% (11%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 15% (15%); final 8% (8%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 5% (5%); 243 flows.
Share am_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 34% (34%); final 12% (12%); 221 flows.
Share am_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 18% (18%); final 14% (14%); 221 flows.
Share am_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 10% (10%); final 11% (11%); 221 flows.
Share am_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 10% (10%); final 7% (7%); 221 flows.
Share am_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 2% (2%); 221 flows.
Share midday Hillegass Avenue NB, trips from the freeway: static; target 47%; offered 64% (64%); final 47% (47%); 448 flows.
Share midday Colby Street NB, trips from the freeway: static; target 47%; offered 67% (67%); final 46% (46%); 415 flows.
Share midday Hillegass Avenue SB, trips to the freeway: static; target 57%; offered 88% (88%); final 53% (53%); 81 flows.
Share midday Colby Street SB, trips to the freeway: static; target 45%; offered 85% (85%); final 42% (42%); 316 flows.
Share midday Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 29% (29%); final 17% (17%); 244 flows.
Share midday Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 12% (12%); final 15% (15%); 244 flows.
Share midday Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 11% (11%); 244 flows.
Share midday Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 10% (10%); 244 flows.
Share midday Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 14% (14%); final 9% (9%); 244 flows.
Share midday Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 2% (2%); final 4% (4%); 244 flows.
Share midday From the freeway at the ramps, via College Avenue: static; target 10%; offered 30% (30%); final 11% (11%); 222 flows.
Share midday From the freeway at the ramps, via Martin Street: static; target 10%; offered 13% (13%); final 10% (10%); 222 flows.
Share midday From the freeway at the ramps, via Colby Street: static; target 8%; offered 14% (14%); final 13% (13%); 222 flows.
Share midday From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 11% (11%); final 8% (8%); 222 flows.
Share midday From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 222 flows.
Share pm_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 70% (64%); final 47% (46%); 568 flows.
Share pm_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 65% (69%); final 46% (48%); 612 flows.
Share pm_peak Hillegass Avenue SB, trips to the freeway: simulated; target 68%; offered 84% (82%); final 65% (66%); 211 flows.
Share pm_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 84% (86%); final 49% (59%); 551 flows.
Share pm_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 32% (32%); final 18% (18%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 11% (11%); final 14% (14%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 23% (23%); final 11% (11%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 15% (15%); final 12% (12%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 14% (14%); final 9% (9%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 4% (4%); 234 flows.
Share pm_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 24% (24%); final 10% (10%); 234 flows.
Share pm_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 18% (18%); final 11% (11%); 234 flows.
Share pm_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 15% (15%); final 14% (14%); 234 flows.
Share pm_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 9% (9%); final 7% (7%); 234 flows.
Share pm_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 234 flows.
- am_peak: select-link shares take simulated membership (10 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)
- pm_peak: select-link shares take simulated membership (10 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)

## i1-training-build (rockridge.fit.cv.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2022 stations; 0 above ceiling; excess 0 veh/h; offered car 20582 to 18984 veh/h.

Offered car veh/h by flow type, static fit then final: through 2455, local 8314, ramp 9813; through 2516, local 6675, ramp 9793.

Hard projection am_peak: removed 88 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 126 and after 126 of 205.

Ceiling stations by kind am_peak: gate 223 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 60 veh/h; non-gate 1799 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 28 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 1040 to 886, outside 7095 to 6039; destinations inside 735 to 588, outside 5907 to 4896.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 184 | Alcatraz Avenue | entering | 217 | 229 | 217 | 11 |
| 265 | Ashby Avenue | entering | 143 | 147 | 142 | 5 |
| 104 | San Pablo Avenue | entering | 128 | 131 | 127 | 4 |
| 288 | Adeline Street | leaving | 27 | 31 | 27 | 3 |
| 763 | Telegraph Avenue | entering | 1053 | 1056 | 1052 | 3 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1959 stations; 1 above ceiling; excess 1 veh/h; offered car 25042 to 22741 veh/h.

Offered car veh/h by flow type, static fit then final: through 2785, local 10873, ramp 11384; through 2810, local 8555, ramp 11376.

Hard projection pm_peak: removed 176 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 150 and after 146 of 260.

Ceiling stations by kind pm_peak: gate 222 stations, 1 above ceiling, excess 1 veh/h, removed by the projection 140 veh/h; non-gate 1737 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 36 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 1387 to 1060, outside 8768 to 7464; destinations inside 881 to 628, outside 6740 to 5358.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 4112 | 4166 | 4109 | 53 |
| 763 | Telegraph Avenue | entering | 1359 | 1373 | 1355 | 13 |
| 675 | (unnamed) | leaving | 4156 | 4178 | 4151 | 12 |
| 1655 | Duncan Way | leaving | 154 | 158 | 154 | 4 |
| 275 | Market Street | entering | 358 | 362 | 358 | 4 |



Share am_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 56% (57%); final 45% (42%); 536 flows.
Share am_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 62% (62%); final 45% (43%); 414 flows.
Share am_peak Hillegass Avenue SB, trips to the freeway: simulated; target 57%; offered 78% (73%); final 57% (51%); 204 flows.
Share am_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 73% (77%); final 43% (45%); 674 flows.
Share am_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 23% (23%); final 16% (16%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 9% (9%); final 12% (12%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 28% (28%); final 10% (10%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 11% (11%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 14% (14%); final 7% (7%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 5% (5%); 227 flows.
Share am_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 35% (35%); final 11% (11%); 210 flows.
Share am_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 10% (10%); 210 flows.
Share am_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 8% (8%); final 9% (9%); 210 flows.
Share am_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 10% (10%); final 6% (6%); 210 flows.
Share am_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 210 flows.
Share midday Hillegass Avenue NB, trips from the freeway: static; target 47%; offered 59% (59%); final 46% (46%); 454 flows.
Share midday Colby Street NB, trips from the freeway: static; target 47%; offered 70% (70%); final 46% (46%); 376 flows.
Share midday Hillegass Avenue SB, trips to the freeway: static; target 57%; offered 76% (76%); final 53% (53%); 117 flows.
Share midday Colby Street SB, trips to the freeway: static; target 45%; offered 75% (75%); final 41% (41%); 444 flows.
Share midday Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 28% (28%); final 16% (16%); 212 flows.
Share midday Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 11% (11%); final 14% (14%); 212 flows.
Share midday Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 10% (10%); 212 flows.
Share midday Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 10% (10%); 212 flows.
Share midday Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 13% (13%); final 8% (8%); 212 flows.
Share midday Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 5% (5%); 212 flows.
Share midday From the freeway at the ramps, via College Avenue: static; target 10%; offered 30% (30%); final 10% (10%); 203 flows.
Share midday From the freeway at the ramps, via Martin Street: static; target 10%; offered 14% (14%); final 10% (10%); 203 flows.
Share midday From the freeway at the ramps, via Colby Street: static; target 8%; offered 9% (9%); final 8% (8%); 203 flows.
Share midday From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 11% (11%); final 6% (6%); 203 flows.
Share midday From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 203 flows.
Share pm_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 56% (58%); final 45% (43%); 585 flows.
Share pm_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 68% (73%); final 42% (44%); 599 flows.
Share pm_peak Hillegass Avenue SB, trips to the freeway: simulated; target 68%; offered 78% (79%); final 66% (75%); 371 flows.
Share pm_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 66% (75%); final 43% (57%); 827 flows.
Share pm_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 31% (31%); final 17% (17%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 11% (11%); final 13% (13%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 24% (24%); final 10% (10%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 15% (15%); final 12% (12%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 13% (13%); final 8% (8%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 5% (5%); 217 flows.
Share pm_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 24% (24%); final 10% (10%); 204 flows.
Share pm_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 10% (10%); 204 flows.
Share pm_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 12% (12%); final 9% (9%); 204 flows.
Share pm_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 9% (9%); final 6% (6%); 204 flows.
Share pm_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 1% (1%); final 3% (3%); 204 flows.
- am_peak: select-link shares take simulated membership (10 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)
- pm_peak: select-link shares take simulated membership (10 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)

## i2-shipped-build (rockridge.fit.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2034 stations; 0 above ceiling; excess 0 veh/h; offered car 23202 to 21394 veh/h.

Offered car veh/h by flow type, static fit then final: through 3745, local 9586, ramp 9871; through 3521, local 8088, ramp 9785.

Hard projection am_peak: removed 96 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 148 and after 147 of 278.

Ceiling stations by kind am_peak: gate 217 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 54 veh/h; non-gate 1817 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 42 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 612 to 513, outside 7488 to 6439; destinations inside 528 to 449, outside 8211 to 6883.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 1672 | Warren Freeway | entering | 821 | 832 | 821 | 9 |
| 1719 | Grove Shafter Freeway | entering | 337 | 344 | 337 | 6 |
| 577 | Martin Luther King Junior Way | entering | 198 | 202 | 198 | 4 |
| 1756 | Claremont Avenue | entering | 487 | 492 | 487 | 4 |
| 183 | San Pablo Avenue | entering | 824 | 828 | 824 | 3 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1991 stations; 0 above ceiling; excess 0 veh/h; offered car 27609 to 24767 veh/h.

Offered car veh/h by flow type, static fit then final: through 5907, local 10360, ramp 11342; through 5105, local 8346, ramp 11316.

Hard projection pm_peak: removed 164 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 164 and after 157 of 343.

Ceiling stations by kind pm_peak: gate 216 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 106 veh/h; non-gate 1775 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 58 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 951 to 722, outside 9523 to 8009; destinations inside 734 to 461, outside 7901 to 6382.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 3944 | 3972 | 3940 | 27 |
| 1756 | Claremont Avenue | leaving | 567 | 581 | 567 | 12 |
| 675 | (unnamed) | leaving | 3777 | 3794 | 3767 | 10 |
| 1398 | Claremont Boulevard | entering | 357 | 366 | 357 | 9 |
| 1219 | College Avenue | entering | 300 | 307 | 300 | 7 |



Share am_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 63% (60%); final 43% (47%); 527 flows.
Share am_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 69% (70%); final 45% (47%); 416 flows.
Share am_peak Hillegass Avenue SB, trips to the freeway: simulated; target 57%; offered 88% (83%); final 56% (56%); 194 flows.
Share am_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 77% (82%); final 39% (40%); 589 flows.
Share am_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 24% (24%); final 16% (16%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 9% (9%); final 12% (12%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 27% (27%); final 12% (12%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 12% (12%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 15% (15%); final 7% (7%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 5% (5%); 243 flows.
Share am_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 34% (34%); final 12% (12%); 221 flows.
Share am_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 18% (18%); final 14% (14%); 221 flows.
Share am_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 10% (10%); final 11% (11%); 221 flows.
Share am_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 10% (10%); final 7% (7%); 221 flows.
Share am_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 2% (2%); 221 flows.
Share midday Hillegass Avenue NB, trips from the freeway: static; target 47%; offered 64% (64%); final 47% (47%); 448 flows.
Share midday Colby Street NB, trips from the freeway: static; target 47%; offered 67% (67%); final 46% (46%); 415 flows.
Share midday Hillegass Avenue SB, trips to the freeway: static; target 57%; offered 88% (88%); final 53% (53%); 81 flows.
Share midday Colby Street SB, trips to the freeway: static; target 45%; offered 85% (85%); final 42% (42%); 316 flows.
Share midday Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 29% (29%); final 17% (17%); 244 flows.
Share midday Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 12% (12%); final 15% (15%); 244 flows.
Share midday Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 11% (11%); 244 flows.
Share midday Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 10% (10%); 244 flows.
Share midday Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 14% (14%); final 9% (9%); 244 flows.
Share midday Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 2% (2%); final 4% (4%); 244 flows.
Share midday From the freeway at the ramps, via College Avenue: static; target 10%; offered 30% (30%); final 11% (11%); 222 flows.
Share midday From the freeway at the ramps, via Martin Street: static; target 10%; offered 13% (13%); final 10% (10%); 222 flows.
Share midday From the freeway at the ramps, via Colby Street: static; target 8%; offered 14% (14%); final 13% (13%); 222 flows.
Share midday From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 11% (11%); final 8% (8%); 222 flows.
Share midday From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 222 flows.
Share pm_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 69% (64%); final 46% (49%); 617 flows.
Share pm_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 66% (69%); final 45% (47%); 669 flows.
Share pm_peak Hillegass Avenue SB, trips to the freeway: simulated; target 68%; offered 82% (82%); final 64% (71%); 306 flows.
Share pm_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 80% (86%); final 46% (65%); 700 flows.
Share pm_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 32% (32%); final 18% (18%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 11% (11%); final 15% (15%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 23% (23%); final 11% (11%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 15% (15%); final 12% (12%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 14% (14%); final 9% (9%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 4% (4%); 234 flows.
Share pm_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 24% (24%); final 10% (10%); 234 flows.
Share pm_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 18% (18%); final 11% (11%); 234 flows.
Share pm_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 15% (15%); final 14% (14%); 234 flows.
Share pm_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 9% (9%); final 7% (7%); 234 flows.
Share pm_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 234 flows.
- am_peak: select-link shares take simulated membership (20 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)
- pm_peak: select-link shares take simulated membership (20 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)

## i2-training-build (rockridge.fit.cv.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2022 stations; 0 above ceiling; excess 0 veh/h; offered car 20582 to 18892 veh/h.

Offered car veh/h by flow type, static fit then final: through 2455, local 8314, ramp 9813; through 2479, local 6614, ramp 9799.

Hard projection am_peak: removed 97 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 113 and after 111 of 205.

Ceiling stations by kind am_peak: gate 223 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 68 veh/h; non-gate 1799 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 29 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 1040 to 854, outside 7095 to 5976; destinations inside 735 to 562, outside 5907 to 4810.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 3696 | 3708 | 3695 | 11 |
| 1672 | Warren Freeway | entering | 444 | 451 | 444 | 6 |
| 184 | Alcatraz Avenue | entering | 217 | 223 | 217 | 6 |
| 763 | Telegraph Avenue | entering | 1053 | 1058 | 1052 | 5 |
| 1719 | Grove Shafter Freeway | entering | 376 | 381 | 376 | 5 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1959 stations; 0 above ceiling; excess 0 veh/h; offered car 25042 to 22712 veh/h.

Offered car veh/h by flow type, static fit then final: through 2785, local 10873, ramp 11384; through 2809, local 8530, ramp 11373.

Hard projection pm_peak: removed 211 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 131 and after 130 of 260.

Ceiling stations by kind pm_peak: gate 222 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 165 veh/h; non-gate 1737 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 47 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 1387 to 994, outside 8768 to 7490; destinations inside 881 to 596, outside 6740 to 5275.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 4112 | 4175 | 4110 | 62 |
| 763 | Telegraph Avenue | entering | 1359 | 1382 | 1357 | 22 |
| 675 | (unnamed) | leaving | 4156 | 4189 | 4148 | 14 |
| 275 | Market Street | entering | 358 | 363 | 358 | 5 |
| 276 | Martin Luther King Junior Way | entering | 361 | 366 | 360 | 5 |



Share am_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 56% (57%); final 45% (40%); 593 flows.
Share am_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 61% (62%); final 44% (44%); 462 flows.
Share am_peak Hillegass Avenue SB, trips to the freeway: simulated; target 57%; offered 79% (73%); final 57% (56%); 259 flows.
Share am_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 70% (77%); final 42% (47%); 761 flows.
Share am_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 23% (23%); final 16% (16%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 9% (9%); final 12% (12%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 28% (28%); final 10% (10%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 12% (12%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 14% (14%); final 7% (7%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 5% (5%); 227 flows.
Share am_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 35% (35%); final 11% (11%); 210 flows.
Share am_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 11% (11%); 210 flows.
Share am_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 8% (8%); final 10% (10%); 210 flows.
Share am_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 10% (10%); final 6% (6%); 210 flows.
Share am_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 210 flows.
Share midday Hillegass Avenue NB, trips from the freeway: static; target 47%; offered 59% (59%); final 46% (46%); 454 flows.
Share midday Colby Street NB, trips from the freeway: static; target 47%; offered 70% (70%); final 46% (46%); 376 flows.
Share midday Hillegass Avenue SB, trips to the freeway: static; target 57%; offered 76% (76%); final 53% (53%); 117 flows.
Share midday Colby Street SB, trips to the freeway: static; target 45%; offered 75% (75%); final 41% (41%); 444 flows.
Share midday Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 28% (28%); final 16% (16%); 212 flows.
Share midday Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 11% (11%); final 14% (14%); 212 flows.
Share midday Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 10% (10%); 212 flows.
Share midday Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 10% (10%); 212 flows.
Share midday Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 13% (13%); final 8% (8%); 212 flows.
Share midday Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 5% (5%); 212 flows.
Share midday From the freeway at the ramps, via College Avenue: static; target 10%; offered 30% (30%); final 10% (10%); 203 flows.
Share midday From the freeway at the ramps, via Martin Street: static; target 10%; offered 14% (14%); final 10% (10%); 203 flows.
Share midday From the freeway at the ramps, via Colby Street: static; target 8%; offered 9% (9%); final 8% (8%); 203 flows.
Share midday From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 11% (11%); final 6% (6%); 203 flows.
Share midday From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 203 flows.
Share pm_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 56% (58%); final 44% (44%); 643 flows.
Share pm_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 65% (73%); final 42% (46%); 680 flows.
Share pm_peak Hillegass Avenue SB, trips to the freeway: simulated; target 68%; offered 77% (79%); final 66% (74%); 456 flows.
Share pm_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 64% (75%); final 43% (59%); 960 flows.
Share pm_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 31% (31%); final 17% (17%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 11% (11%); final 14% (14%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 24% (24%); final 10% (10%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 15% (15%); final 12% (12%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 13% (13%); final 8% (8%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 4% (4%); 217 flows.
Share pm_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 24% (24%); final 10% (10%); 204 flows.
Share pm_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 10% (10%); 204 flows.
Share pm_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 12% (12%); final 9% (9%); 204 flows.
Share pm_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 9% (9%); final 6% (6%); 204 flows.
Share pm_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 1% (1%); final 3% (3%); 204 flows.
- am_peak: select-link shares take simulated membership (20 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)
- pm_peak: select-link shares take simulated membership (20 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)

## final-shipped-build (rockridge.fit.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2034 stations; 0 above ceiling; excess 0 veh/h; offered car 23202 to 21440 veh/h.

Offered car veh/h by flow type, static fit then final: through 3745, local 9586, ramp 9871; through 3506, local 8172, ramp 9762.

Hard projection am_peak: removed 106 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 144 and after 145 of 278.

Ceiling stations by kind am_peak: gate 217 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 60 veh/h; non-gate 1817 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 46 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 612 to 528, outside 7488 to 6448; destinations inside 528 to 441, outside 8211 to 6933.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 1672 | Warren Freeway | entering | 821 | 832 | 821 | 9 |
| 1719 | Grove Shafter Freeway | entering | 337 | 344 | 337 | 6 |
| 1756 | Claremont Avenue | entering | 487 | 492 | 487 | 5 |
| 577 | Martin Luther King Junior Way | entering | 198 | 203 | 198 | 4 |
| 1398 | Claremont Boulevard | entering | 364 | 367 | 364 | 3 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1991 stations; 1 above ceiling; excess 1 veh/h; offered car 27609 to 24688 veh/h.

Offered car veh/h by flow type, static fit then final: through 5907, local 10360, ramp 11342; through 5021, local 8355, ramp 11313.

Hard projection pm_peak: removed 173 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 169 and after 160 of 343.

Ceiling stations by kind pm_peak: gate 216 stations, 1 above ceiling, excess 1 veh/h, removed by the projection 112 veh/h; non-gate 1775 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 61 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 951 to 727, outside 9523 to 8040; destinations inside 734 to 451, outside 7901 to 6349.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 3944 | 3978 | 3940 | 33 |
| 1756 | Claremont Avenue | leaving | 567 | 583 | 567 | 15 |
| 1398 | Claremont Boulevard | entering | 357 | 367 | 357 | 9 |
| 1756 | Claremont Avenue | entering | 412 | 420 | 412 | 8 |
| 1219 | College Avenue | entering | 300 | 305 | 300 | 5 |



Share am_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 65% (60%); final 44% (46%); 559 flows.
Share am_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 68% (70%); final 45% (46%); 442 flows.
Share am_peak Hillegass Avenue SB, trips to the freeway: simulated; target 57%; offered 88% (83%); final 57% (56%); 208 flows.
Share am_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 78% (82%); final 39% (41%); 616 flows.
Share am_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 24% (24%); final 16% (16%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 9% (9%); final 12% (12%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 27% (27%); final 12% (12%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 12% (12%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 15% (15%); final 7% (7%); 243 flows.
Share am_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 5% (5%); 243 flows.
Share am_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 34% (34%); final 12% (12%); 221 flows.
Share am_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 18% (18%); final 14% (14%); 221 flows.
Share am_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 10% (10%); final 11% (11%); 221 flows.
Share am_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 10% (10%); final 7% (7%); 221 flows.
Share am_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 2% (2%); 221 flows.
Share midday Hillegass Avenue NB, trips from the freeway: static; target 47%; offered 64% (64%); final 47% (47%); 448 flows.
Share midday Colby Street NB, trips from the freeway: static; target 47%; offered 67% (67%); final 46% (46%); 415 flows.
Share midday Hillegass Avenue SB, trips to the freeway: static; target 57%; offered 88% (88%); final 53% (53%); 81 flows.
Share midday Colby Street SB, trips to the freeway: static; target 45%; offered 85% (85%); final 42% (42%); 316 flows.
Share midday Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 29% (29%); final 17% (17%); 244 flows.
Share midday Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 12% (12%); final 15% (15%); 244 flows.
Share midday Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 11% (11%); 244 flows.
Share midday Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 10% (10%); 244 flows.
Share midday Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 14% (14%); final 9% (9%); 244 flows.
Share midday Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 2% (2%); final 4% (4%); 244 flows.
Share midday From the freeway at the ramps, via College Avenue: static; target 10%; offered 30% (30%); final 11% (11%); 222 flows.
Share midday From the freeway at the ramps, via Martin Street: static; target 10%; offered 13% (13%); final 10% (10%); 222 flows.
Share midday From the freeway at the ramps, via Colby Street: static; target 8%; offered 14% (14%); final 13% (13%); 222 flows.
Share midday From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 11% (11%); final 8% (8%); 222 flows.
Share midday From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 222 flows.
Share pm_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 70% (64%); final 47% (47%); 642 flows.
Share pm_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 66% (69%); final 46% (47%); 701 flows.
Share pm_peak Hillegass Avenue SB, trips to the freeway: simulated; target 68%; offered 82% (82%); final 63% (71%); 336 flows.
Share pm_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 79% (86%); final 46% (66%); 767 flows.
Share pm_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 32% (32%); final 18% (18%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 11% (11%); final 15% (15%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 23% (23%); final 10% (10%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 15% (15%); final 12% (12%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 14% (14%); final 9% (9%); 234 flows.
Share pm_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 4% (4%); 234 flows.
Share pm_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 24% (24%); final 10% (10%); 234 flows.
Share pm_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 18% (18%); final 11% (11%); 234 flows.
Share pm_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 15% (15%); final 14% (14%); 234 flows.
Share pm_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 9% (9%); final 7% (7%); 234 flows.
Share pm_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 234 flows.
- am_peak: select-link shares take simulated membership (30 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)
- pm_peak: select-link shares take simulated membership (30 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)

## final-training-build (rockridge.fit.cv.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2022 stations; 0 above ceiling; excess 0 veh/h; offered car 20582 to 18834 veh/h.

Offered car veh/h by flow type, static fit then final: through 2455, local 8314, ramp 9813; through 2459, local 6585, ramp 9789.

Hard projection am_peak: removed 78 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 109 and after 112 of 205.

Ceiling stations by kind am_peak: gate 223 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 48 veh/h; non-gate 1799 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 29 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 1040 to 865, outside 7095 to 5976; destinations inside 735 to 556, outside 5907 to 4767.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 1719 | Grove Shafter Freeway | entering | 376 | 384 | 376 | 8 |
| 763 | Telegraph Avenue | entering | 1053 | 1059 | 1053 | 6 |
| 184 | Alcatraz Avenue | entering | 217 | 222 | 217 | 5 |
| 1672 | Warren Freeway | entering | 444 | 448 | 444 | 4 |
| 265 | Ashby Avenue | entering | 143 | 146 | 143 | 3 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1959 stations; 1 above ceiling; excess 1 veh/h; offered car 25042 to 22569 veh/h.

Offered car veh/h by flow type, static fit then final: through 2785, local 10873, ramp 11384; through 2717, local 8479, ramp 11372.

Hard projection pm_peak: removed 263 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 126 and after 125 of 260.

Ceiling stations by kind pm_peak: gate 222 stations, 1 above ceiling, excess 1 veh/h, removed by the projection 211 veh/h; non-gate 1737 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 53 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 1387 to 975, outside 8768 to 7445; destinations inside 881 to 567, outside 6740 to 5210.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 4112 | 4189 | 4110 | 76 |
| 763 | Telegraph Avenue | entering | 1359 | 1386 | 1357 | 26 |
| 675 | (unnamed) | leaving | 4156 | 4196 | 4146 | 17 |
| 276 | Martin Luther King Junior Way | entering | 361 | 367 | 360 | 6 |
| 275 | Market Street | entering | 358 | 364 | 358 | 6 |



Share am_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 56% (57%); final 45% (39%); 607 flows.
Share am_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 60% (62%); final 44% (43%); 500 flows.
Share am_peak Hillegass Avenue SB, trips to the freeway: simulated; target 57%; offered 78% (73%); final 57% (56%); 291 flows.
Share am_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 70% (77%); final 41% (49%); 813 flows.
Share am_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 23% (23%); final 16% (16%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 9% (9%); final 12% (12%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 28% (28%); final 10% (10%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 12% (12%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 14% (14%); final 7% (7%); 227 flows.
Share am_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 5% (5%); 227 flows.
Share am_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 35% (35%); final 11% (11%); 210 flows.
Share am_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 11% (11%); 210 flows.
Share am_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 8% (8%); final 10% (10%); 210 flows.
Share am_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 10% (10%); final 6% (6%); 210 flows.
Share am_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 210 flows.
Share midday Hillegass Avenue NB, trips from the freeway: static; target 47%; offered 59% (59%); final 46% (46%); 454 flows.
Share midday Colby Street NB, trips from the freeway: static; target 47%; offered 70% (70%); final 46% (46%); 376 flows.
Share midday Hillegass Avenue SB, trips to the freeway: static; target 57%; offered 76% (76%); final 53% (53%); 117 flows.
Share midday Colby Street SB, trips to the freeway: static; target 45%; offered 75% (75%); final 41% (41%); 444 flows.
Share midday Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 28% (28%); final 16% (16%); 212 flows.
Share midday Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 11% (11%); final 14% (14%); 212 flows.
Share midday Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 10% (10%); 212 flows.
Share midday Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 17% (17%); final 10% (10%); 212 flows.
Share midday Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 13% (13%); final 8% (8%); 212 flows.
Share midday Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 5% (5%); 212 flows.
Share midday From the freeway at the ramps, via College Avenue: static; target 10%; offered 30% (30%); final 10% (10%); 203 flows.
Share midday From the freeway at the ramps, via Martin Street: static; target 10%; offered 14% (14%); final 10% (10%); 203 flows.
Share midday From the freeway at the ramps, via Colby Street: static; target 8%; offered 9% (9%); final 8% (8%); 203 flows.
Share midday From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 11% (11%); final 6% (6%); 203 flows.
Share midday From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 2% (2%); final 3% (3%); 203 flows.
Share pm_peak Hillegass Avenue NB, trips from the freeway: simulated; target 47%; offered 55% (58%); final 44% (45%); 678 flows.
Share pm_peak Colby Street NB, trips from the freeway: simulated; target 47%; offered 63% (73%); final 42% (48%); 722 flows.
Share pm_peak Hillegass Avenue SB, trips to the freeway: simulated; target 68%; offered 76% (79%); final 65% (74%); 507 flows.
Share pm_peak Colby Street SB, trips to the freeway: simulated; target 45%; offered 63% (75%); final 44% (58%); 1041 flows.
Share pm_peak Onto the freeway at the ramps, via College Avenue: static; target 16%; offered 31% (31%); final 17% (17%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Hillegass Avenue: static; target 12%; offered 11% (11%); final 14% (14%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Martin Street: static; target 10%; offered 24% (24%); final 10% (10%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Colby Street: static; target 8%; offered 15% (15%); final 12% (12%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Telegraph Avenue north of Alcatraz Avenue: static; target 8%; offered 13% (13%); final 9% (9%); 217 flows.
Share pm_peak Onto the freeway at the ramps, via Benvenue Avenue: static; target 5%; offered 1% (1%); final 4% (4%); 217 flows.
Share pm_peak From the freeway at the ramps, via College Avenue: static; target 10%; offered 24% (24%); final 10% (10%); 204 flows.
Share pm_peak From the freeway at the ramps, via Martin Street: static; target 10%; offered 19% (19%); final 10% (10%); 204 flows.
Share pm_peak From the freeway at the ramps, via Colby Street: static; target 8%; offered 12% (12%); final 9% (9%); 204 flows.
Share pm_peak From the freeway at the ramps, via Hillegass Avenue: static; target 5%; offered 9% (9%); final 5% (5%); 204 flows.
Share pm_peak From the freeway at the ramps, via Benvenue Avenue: static; target 3%; offered 1% (1%); final 3% (3%); 204 flows.
- am_peak: select-link shares take simulated membership (30 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)
- pm_peak: select-link shares take simulated membership (30 runs; 4 of 4 share constraints; the denominator is each pair's simulated share of trips on the block with the static fraction as a prior of 5 trips, the numerator the same for pairs with a freeway end; blocks without a simulated trip keep static routes; ramp via-street shares keep static routes)

