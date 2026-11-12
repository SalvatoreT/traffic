# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15301 veh/h x scale 1 = 15301 veh/h. Run took 23.4 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 15472) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.41 m/s (last 15 min 9.43) | pass |

Overall: **STABLE**. Mean trip delay 114 s, mean trip time 436 s, completed 13556, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1181 | 0 | 141 | 0 | 11.21 |
| 10 | 1751 | 4 | 871 | 0 | 9.61 |
| 15 | 1957 | 1 | 1994 | 0 | 9.08 |
| 20 | 1970 | 0 | 3290 | 0 | 9.54 |
| 25 | 1910 | 0 | 4646 | 0 | 9.42 |
| 30 | 1932 | 0 | 5873 | 0 | 9.24 |
| 35 | 1988 | 1 | 7111 | 0 | 9.10 |
| 40 | 1917 | 1 | 8410 | 0 | 9.31 |
| 45 | 1891 | 0 | 9693 | 0 | 9.40 |
| 50 | 1916 | 0 | 10956 | 0 | 9.20 |
| 55 | 1979 | 2 | 12211 | 0 | 9.41 |
| 60 | 1916 | 0 | 13556 | 0 | 9.67 |
## Per-mode results

Offered: 15301 car veh/h; 528 bicycle flows (580/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1916 | 13556 | 436 | |
| Bicycle | 61 | 533 | 283 | |
| Pedestrian | 230 | 1515 | 484 | mean crossing delay 5.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 385, bicycle conflicts 580, close passes 282, pedestrian injury-risk index 0.049, bicycle injury-risk index 0.053 (proxy), mean vehicle speed at pedestrian encounters 2.67 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 60 trips (56 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 55 trips (51 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 104 trips (97 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 106 trips (94 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 52% | +5 | 60 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 7% | -14 | 60 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 7% | +1 | 60 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 28% | +1 | 60 |  |
| Colby Street NB | from | freeway | 47% | 40% | -7 | 55 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 31% | -17 | 55 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 36% | +11 | 55 |  |
| Colby Street NB | to | College Avenue | 3% | 9% | +6 | 55 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 34% | -12 | 104 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 19% | -7 | 104 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 31% | +15 | 104 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 41% | -16 | 104 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 17% | -26 | 106 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 53% | +7 | 106 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 41% | +19 | 106 |  |
| Colby Street SB | to | freeway | 45% | 16% | -29 | 106 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 52% | +18 | 106 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 7% | 478 | 14% | 205 |
| onto freeway | Hillegass Avenue | 12% | 7% | 478 | 16% | 205 |
| onto freeway | Martin Street | 10% | 30% | 478 | 12% | 205 |
| onto freeway | Colby Street | 8% | 3% | 478 | 6% | 205 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 26% | 478 | 5% | 205 |
| onto freeway | Benvenue Avenue | 5% | 3% | 478 | 7% | 205 |
| from freeway | College Avenue | 10% | 8% | 582 | 9% | 457 |
| from freeway | Martin Street | 10% | 13% | 582 | 17% | 457 |
| from freeway | Colby Street | 8% | 6% | 582 | 8% | 457 |
| from freeway | Hillegass Avenue | 5% | 3% | 582 | 4% | 457 |
| from freeway | Benvenue Avenue | 3% | 2% | 582 | 3% | 457 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1690 | 52nd Street | Secondary | 4 | 53 | signal | 8.68 | 6.63 | 6.6 | 1073 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 5.96 | 4.69 | 4.7 | 355 |
| 1916 | 58th Street | Residential | 1 | 221 | two_way_stop | 5.88 | 5.26 | 5.3 | 96 |
| 4466 | Ashby Avenue | Primary | 2 | 96 | signal | 5.46 | 4.50 | 4.5 | 329 |
| 1060 | Sacramento Street | Tertiary | 3 | 40 | signal | 4.28 | 3.54 | 3.5 | 464 |
| 1688 | Shattuck Avenue | Tertiary | 1 | 101 | signal | 3.86 | 2.62 | 2.6 | 676 |
| 3523 | Tunnel Road | Primary | 2 | 52 | signal | 3.79 | 3.00 | 3.0 | 695 |
| 1840 | 56th Street | Residential | 1 | 168 | two_way_stop | 3.59 | 3.25 | 3.2 | 54 |
| 1779 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 3.57 | 2.44 | 2.4 | 742 |
| 2047 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.33 | 2.22 | 2.2 | 601 |
| 1781 | Shattuck Avenue | Tertiary | 1 | 86 | two_way_stop | 3.14 | 1.73 | 1.7 | 725 |
| 4221 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 3.08 | 0.83 | 0.8 | 726 |
| 1145 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.08 | 2.32 | 2.3 | 271 |
| 1601 | (unnamed) | Motorway | 2 | 112 | signal | 2.99 | 2.06 | 2.1 | 601 |
| 2044 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 2.98 | 2.03 | 2.0 | 671 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 458 | Market Street / Stanford Avenue | signal |  | 3.81 | 0.18 | 75 s: 46/19 |
| 694 | 52nd Street / Shattuck Avenue | signal |  | 3.49 | 0.30 | 75 s: 41/24 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.68 | 0.01 | 75 s: 46/19 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.47 | 0.09 | 75 s: 29/15/16 |
| 627 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.40 | 0.09 | 75 s: 29/15/16 |
| 513 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.39 | 0.03 | 75 s: 16/49 |
| 1438 | Ashby Avenue / Claremont Avenue | signal |  | 2.33 | 0.00 | 75 s: 46/19 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.24 | 0.01 | 75 s: 37/28 |
| 874 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.22 | 0.02 | 75 s: 38/27 |
| 687 | 55th Street / Telegraph Avenue | signal |  | 2.11 | 0.09 | 75 s: 18/47 |
| 967 | Ashby Avenue / Shattuck Avenue | signal |  | 1.99 | 0.00 | 75 s: 31/34 |
| 349 | 55th Street / Shattuck Avenue | signal |  | 1.98 | 0.03 | 115 s: 41/64 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 1.88 | 0.02 | 75 s: 15/50 |
| 343 | 55th Street / Martin Luther King Junior Way | signal |  | 1.87 | 0.00 | 75 s: 36/29 |
| 1251 | Ashby Avenue / College Avenue | signal |  | 1.85 | 0.01 | 75 s: 42/23 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 569 | 602 |
| Telegraph | S | 10 | 496 | 546 |
| College | N | 3 | 168 | 168 |
| College | S | 3 | 226 | 227 |
| Claremont | N | 6 | 342 | 456 |
| Claremont | S | 7 | 334 | 586 |
| Alcatraz | E | 6 | 337 | 358 |
| Alcatraz | W | 6 | 282 | 304 |
| Hillegass | N | 4 | 43 | 53 |
| Hillegass | S | 4 | 84 | 92 |
| Colby | N | 7 | 19 | 24 |
| Colby | S | 7 | 59 | 68 |
| Martin | E | 2 | 192 | 192 |
| Martin | W | 2 | 107 | 107 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 1769 | (unnamed) | 1819 |
| 269 | Ashby Avenue | 781 |
| 966 | Telegraph Avenue / Ward Street | 722 |
| 1743 | Grove Shafter Freeway | 709 |
| 617 | (unnamed) | 614 |
| 104 | San Pablo Avenue | 588 |
| 615 | Grove Shafter Freeway | 580 |
| 183 | San Pablo Avenue | 568 |
| 1704 | Warren Freeway | 433 |
| 893 | Colby Street | 423 |
