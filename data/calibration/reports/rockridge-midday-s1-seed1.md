# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 4888 veh/h x scale 1 = 4888 veh/h. Run took 0.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 5002) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.13 m/s (last 15 min 6.94) | pass |

Overall: **STABLE**. Mean trip delay 110 s, mean trip time 313 s, completed 4524, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 322 | 1 | 65 | 0 | 7.69 |
| 10 | 443 | 2 | 398 | 0 | 7.25 |
| 15 | 428 | 5 | 808 | 0 | 7.03 |
| 20 | 439 | 6 | 1188 | 0 | 7.25 |
| 25 | 454 | 0 | 1612 | 0 | 7.35 |
| 30 | 438 | 2 | 2044 | 0 | 7.09 |
| 35 | 472 | 3 | 2444 | 0 | 6.88 |
| 40 | 449 | 4 | 2858 | 0 | 7.37 |
| 45 | 464 | 2 | 3267 | 0 | 7.22 |
| 50 | 449 | 1 | 3688 | 0 | 6.75 |
| 55 | 448 | 0 | 4116 | 0 | 6.85 |
| 60 | 478 | 1 | 4524 | 0 | 7.22 |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 73 trips (69 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (667 m)), 161 trips (154 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 141 trips (131 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (667 m)), 247 trips (217 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 42% | -5 | 73 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -21 | 73 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 3% | -3 | 73 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 36% | +9 | 73 |  |
| Colby Street NB | from | freeway | 47% | 38% | -9 | 161 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 46% | -2 | 161 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 41% | +16 | 161 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 161 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 11% | -35 | 141 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 0% | -26 | 141 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 1% | -15 | 141 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 46% | -11 | 141 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 59% | +16 | 247 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 6% | -40 | 247 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 58% | +36 | 247 |  |
| Colby Street SB | to | freeway | 45% | 50% | +5 | 247 | within |
| Colby Street SB | to | Forest Street | 34% | 18% | -16 | 247 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 6% | 541 |
| onto freeway | Hillegass Avenue | 12% | 11% | 541 |
| onto freeway | Martin Street | 10% | 21% | 541 |
| onto freeway | Colby Street | 8% | 19% | 541 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 62% | 541 |
| onto freeway | Benvenue Avenue | 5% | 0% | 541 |
| from freeway | College Avenue | 10% | 4% | 663 |
| from freeway | Martin Street | 10% | 24% | 663 |
| from freeway | Colby Street | 8% | 6% | 663 |
| from freeway | Hillegass Avenue | 5% | 4% | 663 |
| from freeway | Benvenue Avenue | 3% | 0% | 663 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 497 | Telegraph Avenue | Secondary | 2 | 94 | signal | 11.01 | 9.24 | 9.2 | 397 |
| 602 | Claremont Avenue | Secondary | 2 | 194 | signal | 5.60 | 3.14 | 3.1 | 767 |
| 379 | (unnamed) | Motorway | 2 | 188 | signal | 5.43 | 4.03 | 4.0 | 394 |
| 494 | Telegraph Avenue | Secondary | 2 | 94 | signal | 4.89 | 2.84 | 2.8 | 647 |
| 381 | (unnamed) | Motorway | 2 | 112 | signal | 4.17 | 2.74 | 2.7 | 659 |
| 844 | 56th Street | Residential | 1 | 84 | signal | 3.74 | 3.24 | 3.2 | 174 |
| 633 | Telegraph Avenue | Secondary | 3 | 50 | signal | 3.64 | 2.77 | 2.8 | 971 |
| 46 | Martin Street | Residential | 1 | 110 | two_way_stop | 3.40 | 2.56 | 2.6 | 154 |
| 50 | Colby Street | Residential | 1 | 158 | signal | 2.94 | 2.20 | 2.2 | 157 |
| 637 | Telegraph Avenue | Secondary | 2 | 112 | signal | 2.90 | 1.83 | 1.8 | 598 |
| 493 | Telegraph Avenue | Secondary | 2 | 57 | signal | 2.59 | 1.15 | 1.1 | 871 |
| 723 | Claremont Avenue | Secondary | 2 | 150 | signal | 2.55 | 1.79 | 1.8 | 499 |
| 887 | Telegraph Avenue | Secondary | 2 | 81 | signal | 2.48 | 1.38 | 1.4 | 523 |
| 293 | Carberry Avenue | Residential | 1 | 86 | all_way_stop | 2.27 | 1.51 | 1.5 | 179 |
| 530 | Claremont Avenue | Secondary | 2 | 55 | signal | 2.23 | 1.46 | 1.5 | 488 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space |
| --- | --- | --- | --- | --- | --- |
| 310 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.09 | 0.04 |
| 38 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.44 | 0.00 |
| 273 | 56th Street / Telegraph Avenue | signal |  | 2.20 | 0.00 |
| 226 | Aileen Street / Telegraph Avenue | signal |  | 1.74 | 0.10 |
| 48 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 1.69 | 0.01 |
| 234 | Claremont Avenue / Clifton Street | signal |  | 1.63 | 0.05 |
| 284 | 51st Street / Telegraph Avenue | signal |  | 1.47 | 0.05 |
| 70 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 1.41 | 0.01 |
| 213 | Claremont Avenue / Hudson Street | signal |  | 1.33 | 0.00 |
| 265 | College Avenue / Hudson Street / Manila Avenue | signal |  | 1.19 | 0.02 |
| 253 | Alcatraz Avenue / College Avenue | signal |  | 0.92 | 0.01 |
| 151 | 59th Street / Telegraph Avenue | signal |  | 0.78 | 0.00 |
| 211 | 55th Street / Telegraph Avenue | signal |  | 0.70 | 0.20 |
| 327 | Claremont Avenue / The Uplands | signal |  | 0.59 | 0.00 |
| 57 | Auburn Avenue / Claremont Avenue / Mystic Street | signal |  | 0.57 | 0.00 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 351 | Claremont Avenue | 1 | 413 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1009 | 1063 |
| Telegraph | S | 10 | 584 | 649 |
| College | N | 3 | 121 | 121 |
| College | S | 3 | 316 | 319 |
| Claremont | N | 6 | 440 | 667 |
| Claremont | S | 7 | 557 | 984 |
| Alcatraz | E | 7 | 352 | 380 |
| Alcatraz | W | 7 | 170 | 180 |
| Hillegass | N | 4 | 43 | 64 |
| Hillegass | S | 4 | 114 | 120 |
| Colby | N | 7 | 85 | 128 |
| Colby | S | 7 | 148 | 164 |
| Martin | E | 2 | 154 | 154 |
| Martin | W | 2 | 173 | 173 |

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
