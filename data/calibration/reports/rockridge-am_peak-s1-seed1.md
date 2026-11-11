# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 7183 veh/h x scale 1 = 7183 veh/h. Run took 1.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 7 | FAIL |
| Backlog / spawned | < 2% | 1.0% (71 of 7246) | pass |
| Arterial mean speed (run) | > 4 m/s | 4.20 m/s (last 15 min 3.36) | pass |

Overall: **NOT STABLE**. Mean trip delay 307 s, mean trip time 526 s, completed 5689, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 517 | 3 | 84 | 0 | 7.48 |
| 10 | 703 | 1 | 513 | 0 | 6.06 |
| 15 | 760 | 2 | 1026 | 0 | 5.78 |
| 20 | 874 | 33 | 1521 | 0 | 5.71 |
| 25 | 997 | 25 | 2017 | 0 | 4.65 |
| 30 | 1090 | 34 | 2527 | 1 | 4.26 |
| 35 | 1180 | 40 | 3049 | 3 | 3.80 |
| 40 | 1276 | 29 | 3585 | 3 | 3.68 |
| 45 | 1366 | 54 | 4095 | 3 | 3.75 |
| 50 | 1461 | 25 | 4621 | 3 | 3.65 |
| 55 | 1502 | 51 | 5166 | 5 | 3.39 |
| 60 | 1550 | 71 | 5689 | 7 | 3.04 |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 198 trips (137 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (667 m)), 319 trips (263 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 214 trips (168 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (667 m)), 432 trips (301 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 37% | -10 | 198 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 198 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 7% | +1 | 198 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 55% | +28 | 198 |  |
| Colby Street NB | from | freeway | 47% | 37% | -10 | 319 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 44% | -4 | 319 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 61% | +36 | 319 |  |
| Colby Street NB | to | College Avenue | 3% | 6% | +3 | 319 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 12% | -34 | 214 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 0% | -26 | 214 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 7% | -9 | 214 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 41% | -16 | 214 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 48% | +5 | 432 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 14% | -32 | 432 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 57% | +35 | 432 |  |
| Colby Street SB | to | freeway | 45% | 44% | -1 | 432 | within |
| Colby Street SB | to | Forest Street | 34% | 25% | -9 | 432 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 11% | 630 |
| onto freeway | Hillegass Avenue | 12% | 11% | 630 |
| onto freeway | Martin Street | 10% | 13% | 630 |
| onto freeway | Colby Street | 8% | 22% | 630 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 55% | 630 |
| onto freeway | Benvenue Avenue | 5% | 0% | 630 |
| from freeway | College Avenue | 10% | 14% | 812 |
| from freeway | Martin Street | 10% | 21% | 812 |
| from freeway | Colby Street | 8% | 13% | 812 |
| from freeway | Hillegass Avenue | 5% | 9% | 812 |
| from freeway | Benvenue Avenue | 3% | 0% | 812 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 379 | (unnamed) | Motorway | 2 | 188 | signal | 31.75 | 26.55 | 26.5 | 542 |
| 497 | Telegraph Avenue | Secondary | 2 | 94 | signal | 19.44 | 17.27 | 17.3 | 406 |
| 602 | Claremont Avenue | Secondary | 2 | 194 | signal | 18.14 | 12.35 | 12.4 | 773 |
| 381 | (unnamed) | Motorway | 2 | 112 | signal | 13.32 | 10.06 | 10.1 | 773 |
| 723 | Claremont Avenue | Secondary | 2 | 150 | signal | 12.74 | 10.83 | 10.8 | 541 |
| 595 | Claremont Avenue | Secondary | 2 | 182 | signal | 11.61 | 9.20 | 9.2 | 556 |
| 657 | 51st Street | Secondary | 3 | 64 | signal | 10.28 | 9.31 | 9.3 | 354 |
| 876 | (unnamed) | Motorway | 1 | 293 | uncontrolled | 9.61 | 5.94 | 5.9 | 796 |
| 50 | Colby Street | Residential | 1 | 158 | signal | 8.42 | 6.98 | 7.0 | 162 |
| 777 | Claremont Avenue | Secondary | 2 | 90 | two_way_stop | 8.28 | 6.29 | 6.3 | 734 |
| 617 | Telegraph Avenue | Secondary | 3 | 46 | signal | 8.04 | 5.49 | 5.5 | 944 |
| 496 | Telegraph Avenue | Secondary | 2 | 61 | signal | 8.01 | 6.92 | 6.9 | 332 |
| 621 | (unnamed) | Motorway | 1 | 194 | uncontrolled | 7.43 | 5.36 | 5.4 | 568 |
| 295 | Carberry Avenue | Residential | 1 | 140 | all_way_stop | 6.97 | 3.84 | 3.8 | 281 |
| 494 | Telegraph Avenue | Secondary | 2 | 94 | signal | 6.77 | 4.17 | 4.2 | 760 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space |
| --- | --- | --- | --- | --- | --- |
| 310 | Alcatraz Avenue / Telegraph Avenue | signal |  | 4.68 | 0.20 |
| 38 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.87 | 0.03 |
| 284 | 51st Street / Telegraph Avenue | signal |  | 3.69 | 0.19 |
| 226 | Aileen Street / Telegraph Avenue | signal |  | 3.29 | 0.68 |
| 273 | 56th Street / Telegraph Avenue | signal |  | 3.07 | 0.02 |
| 48 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 3.02 | 0.32 |
| 70 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.99 | 0.19 |
| 213 | Claremont Avenue / Hudson Street | signal |  | 2.48 | 0.21 |
| 234 | Claremont Avenue / Clifton Street | signal |  | 2.28 | 0.23 |
| 265 | College Avenue / Hudson Street / Manila Avenue | signal |  | 2.08 | 0.05 |
| 253 | Alcatraz Avenue / College Avenue | signal |  | 2.02 | 0.07 |
| 211 | 55th Street / Telegraph Avenue | signal |  | 1.60 | 0.58 |
| 281 | College Avenue / Keith Avenue / Shafter Avenue | signal |  | 1.38 | 0.07 |
| 120 | 63rd Street / Telegraph Avenue | two_way_stop |  | 1.25 | 0.03 |
| 151 | 59th Street / Telegraph Avenue | signal |  | 1.25 | 0.06 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 722 | (unnamed) | Telegraph Avenue | uncontrolled | 1 | 29.5 |
| 617 | Telegraph Avenue | 55th Street / Telegraph Avenue | signal | 1 | 33.0 |
| 863 | Cavour Street | Cavour Street / Claremont Avenue | two_way_stop | 1 | 33.8 |
| 606 | Telegraph Avenue | Telegraph Avenue | uncontrolled | 1 | 54.3 |
| 604 | Telegraph Avenue | Telegraph Avenue | uncontrolled | 1 | 54.5 |
| 112 | Clarke Street | Clarke Street / Redondo Avenue | uncontrolled | 1 | 55.6 |
| 897 | Grove Shafter Freeway | Grove Shafter Freeway | uncontrolled | 1 | 58.8 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 290 | Telegraph Avenue | 57 | 953 |
| 374 | Grove Shafter Freeway | 7 | 875 |
| 317 | Telegraph Avenue | 6 | 1217 |
| 351 | Claremont Avenue | 1 | 653 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1189 | 1278 |
| Telegraph | S | 10 | 595 | 673 |
| College | N | 3 | 252 | 254 |
| College | S | 3 | 702 | 706 |
| Claremont | N | 6 | 498 | 734 |
| Claremont | S | 7 | 590 | 1043 |
| Alcatraz | E | 7 | 672 | 691 |
| Alcatraz | W | 7 | 374 | 428 |
| Hillegass | N | 4 | 74 | 166 |
| Hillegass | S | 4 | 122 | 150 |
| Colby | N | 7 | 166 | 181 |
| Colby | S | 7 | 173 | 250 |
| Martin | E | 2 | 132 | 132 |
| Martin | W | 2 | 218 | 218 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 317 | Telegraph Avenue | 1217 |
| 290 | Telegraph Avenue | 953 |
| 374 | Grove Shafter Freeway | 875 |
| 351 | Claremont Avenue | 653 |
| 363 | Alcatraz Avenue | 624 |
| 227 | Grove Shafter Freeway | 548 |
| 266 | Broadway / Manila Avenue | 219 |
| 298 | Broadway | 219 |
| 213 | Claremont Avenue / Hudson Street | 182 |
| 276 | Broadway / College Avenue | 170 |
