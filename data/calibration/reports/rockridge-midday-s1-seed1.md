# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 4888 veh/h x scale 1 = 4888 veh/h. Run took 0.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 5002) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.01 m/s (last 15 min 6.96) | pass |

Overall: **STABLE**. Mean trip delay 114 s, mean trip time 318 s, completed 4488, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 327 | 1 | 60 | 0 | 7.31 |
| 10 | 455 | 2 | 386 | 0 | 7.08 |
| 15 | 435 | 4 | 802 | 0 | 6.75 |
| 20 | 449 | 4 | 1180 | 0 | 7.17 |
| 25 | 446 | 0 | 1620 | 0 | 7.27 |
| 30 | 441 | 2 | 2041 | 0 | 6.99 |
| 35 | 461 | 3 | 2455 | 0 | 6.86 |
| 40 | 424 | 4 | 2883 | 0 | 7.13 |
| 45 | 460 | 2 | 3271 | 0 | 6.92 |
| 50 | 457 | 1 | 3680 | 0 | 6.66 |
| 55 | 468 | 0 | 4096 | 0 | 7.21 |
| 60 | 514 | 1 | 4488 | 0 | 7.01 |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 59 trips (54 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (667 m)), 141 trips (133 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 178 trips (158 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (667 m)), 304 trips (266 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 46% | -1 | 59 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -21 | 59 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 2% | -4 | 59 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 32% | +5 | 59 |  |
| Colby Street NB | from | freeway | 47% | 38% | -9 | 141 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 48% | -0 | 141 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 48% | +23 | 141 |  |
| Colby Street NB | to | College Avenue | 3% | 4% | +1 | 141 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 16% | -30 | 178 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 0% | -26 | 178 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 1% | -15 | 178 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 47% | -10 | 178 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 62% | +19 | 304 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 12% | -34 | 304 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 56% | +34 | 304 |  |
| Colby Street SB | to | freeway | 45% | 53% | +8 | 304 | within |
| Colby Street SB | to | Forest Street | 34% | 20% | -14 | 304 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 2% | 535 |
| onto freeway | Hillegass Avenue | 12% | 13% | 535 |
| onto freeway | Martin Street | 10% | 21% | 535 |
| onto freeway | Colby Street | 8% | 24% | 535 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 61% | 535 |
| onto freeway | Benvenue Avenue | 5% | 0% | 535 |
| from freeway | College Avenue | 10% | 5% | 663 |
| from freeway | Martin Street | 10% | 27% | 663 |
| from freeway | Colby Street | 8% | 6% | 663 |
| from freeway | Hillegass Avenue | 5% | 4% | 663 |
| from freeway | Benvenue Avenue | 3% | 0% | 663 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 497 | Telegraph Avenue | Secondary | 2 | 94 | signal | 10.28 | 8.50 | 8.5 | 460 |
| 602 | Claremont Avenue | Secondary | 2 | 194 | signal | 5.80 | 3.06 | 3.1 | 787 |
| 494 | Telegraph Avenue | Secondary | 2 | 94 | signal | 5.08 | 3.24 | 3.2 | 623 |
| 888 | Telegraph Avenue | Secondary | 3 | 81 | signal | 4.43 | 3.47 | 3.5 | 545 |
| 381 | (unnamed) | Motorway | 2 | 112 | signal | 3.85 | 2.45 | 2.4 | 658 |
| 379 | (unnamed) | Motorway | 2 | 188 | signal | 3.26 | 2.19 | 2.2 | 394 |
| 50 | Colby Street | Residential | 1 | 158 | signal | 3.00 | 1.99 | 2.0 | 246 |
| 46 | Martin Street | Residential | 1 | 110 | two_way_stop | 2.97 | 2.09 | 2.1 | 168 |
| 844 | 56th Street | Residential | 1 | 84 | signal | 2.96 | 2.53 | 2.5 | 158 |
| 493 | Telegraph Avenue | Secondary | 2 | 57 | signal | 2.88 | 1.43 | 1.4 | 839 |
| 633 | Telegraph Avenue | Secondary | 3 | 50 | signal | 2.81 | 2.01 | 2.0 | 1031 |
| 740 | Claremont Avenue | Secondary | 2 | 213 | signal | 2.73 | 2.12 | 2.1 | 295 |
| 617 | Telegraph Avenue | Secondary | 3 | 46 | signal | 2.63 | 1.50 | 1.5 | 850 |
| 637 | Telegraph Avenue | Secondary | 2 | 112 | signal | 2.55 | 1.64 | 1.6 | 605 |
| 887 | Telegraph Avenue | Secondary | 2 | 81 | signal | 2.20 | 1.32 | 1.3 | 492 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 48 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 3.00 | 0.01 | 75 s: 16/15/29 |
| 310 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.84 | 0.03 | 75 s: 47/18 |
| 70 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.39 | 0.00 | 75 s: 29/16/15 |
| 273 | 56th Street / Telegraph Avenue | signal |  | 2.30 | 0.00 | 75 s: 43/22 |
| 38 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.28 | 0.00 | 75 s: 30/35 |
| 265 | College Avenue / Hudson Street / Manila Avenue | signal |  | 1.84 | 0.01 | 75 s: 30/15/15 |
| 226 | Aileen Street / Telegraph Avenue | signal |  | 1.63 | 0.04 | 75 s: 25/40 |
| 234 | Claremont Avenue / Clifton Street | signal |  | 1.59 | 0.04 | 75 s: 29/36 |
| 284 | 51st Street / Telegraph Avenue | signal |  | 1.54 | 0.05 | 75 s: 50/15 |
| 57 | Auburn Avenue / Claremont Avenue / Mystic Street | signal |  | 1.47 | 0.00 | 75 s: 30/15/15 |
| 213 | Claremont Avenue / Hudson Street | signal |  | 1.20 | 0.00 | 75 s: 50/15 |
| 211 | 55th Street / Telegraph Avenue | signal |  | 0.88 | 0.28 | 75 s: 50/15 |
| 151 | 59th Street / Telegraph Avenue | signal |  | 0.83 | 0.00 | 75 s: 50/15 |
| 253 | Alcatraz Avenue / College Avenue | signal |  | 0.67 | 0.00 | 75 s: 50/15 |
| 327 | Claremont Avenue / The Uplands | signal |  | 0.64 | 0.00 | 75 s: 50/15 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 351 | Claremont Avenue | 1 | 413 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1036 | 1099 |
| Telegraph | S | 10 | 587 | 643 |
| College | N | 3 | 118 | 118 |
| College | S | 3 | 181 | 182 |
| Claremont | N | 6 | 422 | 694 |
| Claremont | S | 7 | 527 | 940 |
| Alcatraz | E | 7 | 346 | 418 |
| Alcatraz | W | 7 | 166 | 211 |
| Hillegass | N | 4 | 41 | 42 |
| Hillegass | S | 4 | 152 | 160 |
| Colby | N | 7 | 74 | 115 |
| Colby | S | 7 | 211 | 246 |
| Martin | E | 2 | 168 | 168 |
| Martin | W | 2 | 210 | 210 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 317 | Telegraph Avenue | 798 |
| 290 | Telegraph Avenue | 705 |
| 374 | Grove Shafter Freeway | 650 |
| 351 | Claremont Avenue | 413 |
| 227 | Grove Shafter Freeway | 402 |
| 363 | Alcatraz Avenue | 395 |
| 298 | Broadway | 137 |
| 266 | Broadway / Manila Avenue | 137 |
| 226 | Aileen Street / Telegraph Avenue | 132 |
| 276 | Broadway / College Avenue | 124 |
