# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 7183 veh/h x scale 1 = 7183 veh/h. Run took 1.7 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 7 | FAIL |
| Backlog / spawned | < 2% | 1.0% (76 of 7241) | pass |
| Arterial mean speed (run) | > 4 m/s | 4.39 m/s (last 15 min 3.63) | pass |

Overall: **NOT STABLE**. Mean trip delay 320 s, mean trip time 539 s, completed 5712, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 526 | 3 | 75 | 0 | 7.16 |
| 10 | 733 | 5 | 479 | 0 | 5.79 |
| 15 | 800 | 8 | 980 | 0 | 5.37 |
| 20 | 823 | 71 | 1534 | 0 | 5.71 |
| 25 | 966 | 33 | 2040 | 0 | 5.38 |
| 30 | 1100 | 20 | 2532 | 0 | 4.26 |
| 35 | 1205 | 33 | 3030 | 4 | 3.64 |
| 40 | 1325 | 32 | 3532 | 4 | 4.41 |
| 45 | 1380 | 91 | 4043 | 4 | 3.89 |
| 50 | 1386 | 92 | 4627 | 5 | 3.65 |
| 55 | 1457 | 78 | 5184 | 5 | 3.94 |
| 60 | 1522 | 76 | 5712 | 7 | 3.30 |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 159 trips (131 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (667 m)), 336 trips (270 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 310 trips (232 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (667 m)), 556 trips (448 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 25% | -22 | 159 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 159 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 9% | +3 | 159 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 38% | +11 | 159 |  |
| Colby Street NB | from | freeway | 47% | 31% | -16 | 336 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 39% | -9 | 336 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 48% | +23 | 336 |  |
| Colby Street NB | to | College Avenue | 3% | 12% | +9 | 336 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 12% | -34 | 310 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 310 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 3% | -13 | 310 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 42% | -15 | 310 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 56% | +13 | 556 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 556 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 55% | +33 | 556 |  |
| Colby Street SB | to | freeway | 45% | 43% | -2 | 556 | within |
| Colby Street SB | to | Forest Street | 34% | 21% | -13 | 556 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 12% | 633 |
| onto freeway | Hillegass Avenue | 12% | 16% | 633 |
| onto freeway | Martin Street | 10% | 10% | 633 |
| onto freeway | Colby Street | 8% | 29% | 633 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 50% | 633 |
| onto freeway | Benvenue Avenue | 5% | 0% | 633 |
| from freeway | College Avenue | 10% | 10% | 840 |
| from freeway | Martin Street | 10% | 27% | 840 |
| from freeway | Colby Street | 8% | 10% | 840 |
| from freeway | Hillegass Avenue | 5% | 4% | 840 |
| from freeway | Benvenue Avenue | 3% | 0% | 840 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 602 | Claremont Avenue | Secondary | 2 | 194 | signal | 17.07 | 11.55 | 11.6 | 767 |
| 497 | Telegraph Avenue | Secondary | 2 | 94 | signal | 17.01 | 14.78 | 14.8 | 439 |
| 381 | (unnamed) | Motorway | 2 | 112 | signal | 11.97 | 8.51 | 8.5 | 824 |
| 379 | (unnamed) | Motorway | 2 | 188 | signal | 11.06 | 8.13 | 8.1 | 594 |
| 888 | Telegraph Avenue | Secondary | 3 | 81 | signal | 9.44 | 8.11 | 8.1 | 500 |
| 617 | Telegraph Avenue | Secondary | 3 | 46 | signal | 8.40 | 5.79 | 5.8 | 912 |
| 496 | Telegraph Avenue | Secondary | 2 | 61 | signal | 7.88 | 6.85 | 6.8 | 310 |
| 494 | Telegraph Avenue | Secondary | 2 | 94 | signal | 7.79 | 5.63 | 5.6 | 658 |
| 50 | Colby Street | Residential | 1 | 158 | signal | 7.54 | 5.77 | 5.8 | 230 |
| 777 | Claremont Avenue | Secondary | 2 | 90 | two_way_stop | 7.42 | 5.42 | 5.4 | 800 |
| 295 | Carberry Avenue | Residential | 1 | 140 | all_way_stop | 7.00 | 3.52 | 3.5 | 318 |
| 657 | 51st Street | Secondary | 3 | 64 | signal | 6.52 | 5.78 | 5.8 | 326 |
| 595 | Claremont Avenue | Secondary | 2 | 182 | signal | 6.24 | 4.49 | 4.5 | 707 |
| 723 | Claremont Avenue | Secondary | 2 | 150 | signal | 6.02 | 4.77 | 4.8 | 560 |
| 46 | Martin Street | Residential | 1 | 110 | two_way_stop | 5.98 | 5.23 | 5.2 | 88 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 310 | Alcatraz Avenue / Telegraph Avenue | signal |  | 5.39 | 0.25 | 75 s: 43/22 |
| 48 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 4.60 | 0.06 | 100 s: 30/16/38 |
| 70 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 4.43 | 0.06 | 75 s: 24/19/17 |
| 284 | 51st Street / Telegraph Avenue | signal |  | 3.11 | 0.14 | 75 s: 46/19 |
| 38 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.00 | 0.05 | 75 s: 34/31 |
| 226 | Aileen Street / Telegraph Avenue | signal |  | 2.99 | 0.46 | 75 s: 28/37 |
| 273 | 56th Street / Telegraph Avenue | signal |  | 2.99 | 0.04 | 75 s: 36/29 |
| 265 | College Avenue / Hudson Street / Manila Avenue | signal |  | 2.73 | 0.03 | 75 s: 27/15/18 |
| 234 | Claremont Avenue / Clifton Street | signal |  | 2.54 | 0.19 | 75 s: 44/21 |
| 213 | Claremont Avenue / Hudson Street | signal |  | 2.52 | 0.14 | 75 s: 44/21 |
| 211 | 55th Street / Telegraph Avenue | signal |  | 1.55 | 0.56 | 75 s: 50/15 |
| 57 | Auburn Avenue / Claremont Avenue / Mystic Street | signal |  | 1.51 | 0.00 | 75 s: 30/15/15 |
| 281 | College Avenue / Keith Avenue / Shafter Avenue | signal |  | 1.49 | 0.14 | 75 s: 47/18 |
| 253 | Alcatraz Avenue / College Avenue | signal |  | 1.47 | 0.04 | 75 s: 32/33 |
| 172 | 57th Street / Telegraph Avenue | two_way_stop |  | 1.41 | 0.79 |  |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 605 | Telegraph Avenue | 57th Street / Telegraph Avenue | two_way_stop | 1 | 30.9 |
| 607 | Telegraph Avenue | Telegraph Avenue | uncontrolled | 1 | 31.0 |
| 622 | Telegraph Avenue | 57th Street / Telegraph Avenue | two_way_stop | 1 | 32.7 |
| 617 | Telegraph Avenue | 55th Street / Telegraph Avenue | signal | 1 | 33.8 |
| 742 | Howell Street | 59th Street / Howell Street | uncontrolled | 1 | 49.9 |
| 279 | 57th Street | 57th Street / Telegraph Avenue | two_way_stop | 1 | 56.0 |
| 112 | Clarke Street | Clarke Street / Redondo Avenue | uncontrolled | 1 | 59.5 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 317 | Telegraph Avenue | 72 | 1217 |
| 110 | Alcatraz Avenue / Benvenue Avenue | 2 | 87 |
| 226 | Aileen Street / Telegraph Avenue | 1 | 162 |
| 351 | Claremont Avenue | 1 | 653 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1217 | 1259 |
| Telegraph | S | 10 | 637 | 731 |
| College | N | 3 | 289 | 289 |
| College | S | 3 | 463 | 464 |
| Claremont | N | 6 | 445 | 800 |
| Claremont | S | 7 | 709 | 1027 |
| Alcatraz | E | 7 | 595 | 706 |
| Alcatraz | W | 7 | 366 | 433 |
| Hillegass | N | 4 | 74 | 107 |
| Hillegass | S | 4 | 178 | 181 |
| Colby | N | 7 | 142 | 149 |
| Colby | S | 7 | 242 | 308 |
| Martin | E | 2 | 89 | 89 |
| Martin | W | 2 | 256 | 256 |

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
