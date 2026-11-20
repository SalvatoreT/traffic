## i1-shipped-build (rockridge.fit.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2034 stations; 0 above ceiling; excess 0 veh/h; offered car 23202 to 21527 veh/h.

Offered car veh/h by flow type, static fit then final: through 3745, local 9586, ramp 9871; through 3558, local 8208, ramp 9761.

Hard projection am_peak: removed 78 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 154 and after 150 of 278.

Ceiling stations by kind am_peak: gate 217 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 44 veh/h; non-gate 1817 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 34 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 612 to 522, outside 7488 to 6472; destinations inside 528 to 433, outside 8211 to 6986.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 1672 | Warren Freeway | entering | 821 | 831 | 821 | 9 |
| 1719 | Grove Shafter Freeway | entering | 337 | 342 | 337 | 5 |
| 183 | San Pablo Avenue | entering | 824 | 828 | 824 | 4 |
| 133 | 62nd Street | entering | 47 | 50 | 47 | 3 |
| 1756 | Claremont Avenue | entering | 487 | 490 | 487 | 3 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1991 stations; 0 above ceiling; excess 0 veh/h; offered car 27609 to 24550 veh/h.

Offered car veh/h by flow type, static fit then final: through 5907, local 10360, ramp 11342; through 4943, local 8283, ramp 11324.

Hard projection pm_peak: removed 107 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 186 and after 187 of 343.

Ceiling stations by kind pm_peak: gate 216 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 66 veh/h; non-gate 1775 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 40 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 951 to 777, outside 9523 to 7862; destinations inside 734 to 513, outside 7901 to 6227.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 3944 | 3961 | 3942 | 17 |
| 1398 | Claremont Boulevard | entering | 357 | 363 | 357 | 6 |
| 1756 | Claremont Avenue | leaving | 567 | 574 | 567 | 6 |
| 183 | San Pablo Avenue | entering | 1023 | 1028 | 1021 | 4 |
| 275 | Market Street | entering | 308 | 312 | 308 | 4 |



## i1-training-build (rockridge.fit.cv.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2022 stations; 0 above ceiling; excess 0 veh/h; offered car 20582 to 18988 veh/h.

Offered car veh/h by flow type, static fit then final: through 2455, local 8314, ramp 9813; through 2526, local 6673, ramp 9789.

Hard projection am_peak: removed 96 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 124 and after 126 of 205.

Ceiling stations by kind am_peak: gate 223 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 69 veh/h; non-gate 1799 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 27 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 1040 to 885, outside 7095 to 6033; destinations inside 735 to 578, outside 5907 to 4920.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 184 | Alcatraz Avenue | entering | 217 | 230 | 217 | 13 |
| 265 | Ashby Avenue | entering | 143 | 148 | 142 | 5 |
| 104 | San Pablo Avenue | entering | 128 | 132 | 127 | 5 |
| 288 | Adeline Street | leaving | 27 | 32 | 27 | 4 |
| 974 | Broadway | entering | 724 | 727 | 723 | 3 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1959 stations; 0 above ceiling; excess 0 veh/h; offered car 25042 to 22797 veh/h.

Offered car veh/h by flow type, static fit then final: through 2785, local 10873, ramp 11384; through 2809, local 8612, ramp 11375.

Hard projection pm_peak: removed 178 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 146 and after 146 of 260.

Ceiling stations by kind pm_peak: gate 222 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 141 veh/h; non-gate 1737 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 37 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 1387 to 1073, outside 8768 to 7493; destinations inside 881 to 643, outside 6740 to 5367.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 4112 | 4166 | 4109 | 53 |
| 763 | Telegraph Avenue | entering | 1359 | 1373 | 1355 | 13 |
| 675 | (unnamed) | leaving | 4156 | 4179 | 4152 | 12 |
| 1644 | Broadway Terrace | leaving | 188 | 193 | 188 | 5 |
| 1655 | Duncan Way | leaving | 154 | 158 | 154 | 4 |



## i2-shipped-build (rockridge.fit.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2034 stations; 0 above ceiling; excess 0 veh/h; offered car 23202 to 21449 veh/h.

Offered car veh/h by flow type, static fit then final: through 3745, local 9586, ramp 9871; through 3546, local 8154, ramp 9749.

Hard projection am_peak: removed 100 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 144 and after 144 of 278.

Ceiling stations by kind am_peak: gate 217 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 54 veh/h; non-gate 1817 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 47 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 612 to 536, outside 7488 to 6442; destinations inside 528 to 452, outside 8211 to 6947.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 1672 | Warren Freeway | entering | 821 | 831 | 821 | 8 |
| 1719 | Grove Shafter Freeway | entering | 337 | 343 | 337 | 6 |
| 577 | Martin Luther King Junior Way | entering | 198 | 202 | 198 | 4 |
| 1756 | Claremont Avenue | entering | 487 | 492 | 487 | 4 |
| 1398 | Claremont Boulevard | entering | 364 | 367 | 364 | 3 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1991 stations; 0 above ceiling; excess 0 veh/h; offered car 27609 to 25017 veh/h.

Offered car veh/h by flow type, static fit then final: through 5907, local 10360, ramp 11342; through 5209, local 8495, ramp 11312.

Hard projection pm_peak: removed 171 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 165 and after 159 of 343.

Ceiling stations by kind pm_peak: gate 216 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 105 veh/h; non-gate 1775 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 66 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 951 to 743, outside 9523 to 8228; destinations inside 734 to 445, outside 7901 to 6447.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 3944 | 3973 | 3940 | 28 |
| 1756 | Claremont Avenue | leaving | 567 | 583 | 567 | 14 |
| 1398 | Claremont Boulevard | entering | 357 | 366 | 357 | 9 |
| 1756 | Claremont Avenue | entering | 412 | 419 | 412 | 6 |
| 1219 | College Avenue | entering | 300 | 307 | 300 | 6 |



## i2-training-build (rockridge.fit.cv.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2022 stations; 0 above ceiling; excess 0 veh/h; offered car 20582 to 18873 veh/h.

Offered car veh/h by flow type, static fit then final: through 2455, local 8314, ramp 9813; through 2441, local 6631, ramp 9800.

Hard projection am_peak: removed 83 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 113 and after 113 of 205.

Ceiling stations by kind am_peak: gate 223 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 53 veh/h; non-gate 1799 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 30 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 1040 to 852, outside 7095 to 5991; destinations inside 735 to 570, outside 5907 to 4810.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 1672 | Warren Freeway | entering | 444 | 451 | 444 | 6 |
| 1719 | Grove Shafter Freeway | entering | 376 | 382 | 376 | 5 |
| 602 | Grove Shafter Freeway | entering | 3696 | 3702 | 3695 | 5 |
| 763 | Telegraph Avenue | entering | 1053 | 1057 | 1052 | 4 |
| 184 | Alcatraz Avenue | entering | 217 | 221 | 217 | 4 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1959 stations; 0 above ceiling; excess 0 veh/h; offered car 25042 to 22718 veh/h.

Offered car veh/h by flow type, static fit then final: through 2785, local 10873, ramp 11384; through 2851, local 8493, ramp 11374.

Hard projection pm_peak: removed 236 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 133 and after 132 of 260.

Ceiling stations by kind pm_peak: gate 222 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 190 veh/h; non-gate 1737 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 45 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 1387 to 1035, outside 8768 to 7454; destinations inside 881 to 592, outside 6740 to 5271.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 4112 | 4181 | 4109 | 68 |
| 763 | Telegraph Avenue | entering | 1359 | 1381 | 1356 | 21 |
| 675 | (unnamed) | leaving | 4156 | 4194 | 4148 | 21 |
| 1644 | Broadway Terrace | leaving | 188 | 194 | 188 | 6 |
| 275 | Market Street | entering | 358 | 363 | 358 | 5 |



## final-shipped-build (rockridge.fit.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2034 stations; 0 above ceiling; excess 0 veh/h; offered car 23202 to 21428 veh/h.

Offered car veh/h by flow type, static fit then final: through 3745, local 9586, ramp 9871; through 3482, local 8215, ramp 9731.

Hard projection am_peak: removed 111 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 143 and after 143 of 278.

Ceiling stations by kind am_peak: gate 217 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 61 veh/h; non-gate 1817 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 50 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 612 to 529, outside 7488 to 6455; destinations inside 528 to 439, outside 8211 to 6963.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 1672 | Warren Freeway | entering | 821 | 833 | 821 | 10 |
| 1719 | Grove Shafter Freeway | entering | 337 | 344 | 337 | 6 |
| 577 | Martin Luther King Junior Way | entering | 198 | 203 | 198 | 4 |
| 1756 | Claremont Avenue | entering | 487 | 492 | 487 | 4 |
| 971 | Pleasant Valley Avenue | entering | 553 | 557 | 553 | 3 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1991 stations; 0 above ceiling; excess 0 veh/h; offered car 27609 to 24953 veh/h.

Offered car veh/h by flow type, static fit then final: through 5907, local 10360, ramp 11342; through 5049, local 8596, ramp 11309.

Hard projection pm_peak: removed 181 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 172 and after 167 of 343.

Ceiling stations by kind pm_peak: gate 216 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 112 veh/h; non-gate 1775 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 69 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 951 to 743, outside 9523 to 8202; destinations inside 734 to 445, outside 7901 to 6434.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 3944 | 3979 | 3940 | 34 |
| 1756 | Claremont Avenue | leaving | 567 | 583 | 567 | 15 |
| 1398 | Claremont Boulevard | entering | 357 | 366 | 357 | 9 |
| 1756 | Claremont Avenue | entering | 412 | 420 | 412 | 8 |
| 275 | Market Street | entering | 308 | 313 | 307 | 5 |



## final-training-build (rockridge.fit.cv.md)


In a period whose stations take simulated membership, the fit first runs as the baseline does (static membership, no ceilings). Each node direction (every origin or destination of a car flow, gates and non-gate nodes) that no gate count holds in the period (no gate station in the fit names it) then has a one-sided ceiling: its car total in that static fit plus 0%, weight 10. The ceiling acts only while the gate's assigned total is above it, reads no count value, and does not change how flows that touch no count are treated. After the fit (median rule and guard cut included) a hard projection scales the flows of every ceiling gate direction still more than 0.1% above its ceiling down to it, so the ceilings hold on the final flows; the cost to the count fit is the change in fitted stations within their tolerance. A regularizer toward the static fit; the tolerance and the weight are assumptions, not data. Excess = final total above the ceiling (more than 0.5 veh/h). Periods without simulated membership have no ceilings.

Gate prior ceilings am_peak: 2022 stations; 0 above ceiling; excess 0 veh/h; offered car 20582 to 18895 veh/h.

Offered car veh/h by flow type, static fit then final: through 2455, local 8314, ramp 9813; through 2436, local 6666, ramp 9793.

Hard projection am_peak: removed 93 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 114 and after 113 of 205.

Ceiling stations by kind am_peak: gate 223 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 62 veh/h; non-gate 1799 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 30 veh/h.

Non-gate node trip ends am_peak (veh/h, static fit to final): origins inside the study area 1040 to 866, outside 7095 to 6051; destinations inside 735 to 561, outside 5907 to 4799.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 184 | Alcatraz Avenue | entering | 217 | 224 | 217 | 7 |
| 602 | Grove Shafter Freeway | entering | 3696 | 3703 | 3695 | 6 |
| 1719 | Grove Shafter Freeway | entering | 376 | 383 | 376 | 6 |
| 763 | Telegraph Avenue | entering | 1053 | 1058 | 1052 | 5 |
| 1672 | Warren Freeway | entering | 444 | 449 | 444 | 5 |

Gate prior ceilings midday: none (static membership in this period).

Gate prior ceilings pm_peak: 1959 stations; 1 above ceiling; excess 1 veh/h; offered car 25042 to 22543 veh/h.

Offered car veh/h by flow type, static fit then final: through 2785, local 10873, ramp 11384; through 2744, local 8425, ramp 11373.

Hard projection pm_peak: removed 257 veh/h from ceiling nodes (worst five below); fitted stations within their tolerance before 132 and after 126 of 260.

Ceiling stations by kind pm_peak: gate 222 stations, 1 above ceiling, excess 1 veh/h, removed by the projection 209 veh/h; non-gate 1737 stations, 0 above ceiling, excess 0 veh/h, removed by the projection 47 veh/h.

Non-gate node trip ends pm_peak (veh/h, static fit to final): origins inside the study area 1387 to 1005, outside 8768 to 7388; destinations inside 881 to 565, outside 6740 to 5222.

| Node | Street | Direction | Static fit (ceiling) | Total before the projection | Final | Removed |
| --- | --- | --- | --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | entering | 4112 | 4185 | 4109 | 72 |
| 763 | Telegraph Avenue | entering | 1359 | 1384 | 1357 | 24 |
| 675 | (unnamed) | leaving | 4156 | 4197 | 4147 | 21 |
| 275 | Market Street | entering | 358 | 364 | 358 | 6 |
| 276 | Martin Luther King Junior Way | entering | 361 | 367 | 360 | 6 |



