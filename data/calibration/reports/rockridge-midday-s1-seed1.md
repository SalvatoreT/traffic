# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15282 veh/h x scale 1 = 15282 veh/h. Run took 16.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 15419) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.00 m/s (last 15 min 9.00) | pass |

Overall: **STABLE**. Mean trip delay 135 s, mean trip time 476 s, completed 13270, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1191 | 0 | 99 | 0 | 10.80 |
| 10 | 1816 | 2 | 746 | 0 | 9.41 |
| 15 | 2039 | 0 | 1828 | 0 | 8.92 |
| 20 | 2118 | 0 | 3025 | 0 | 8.62 |
| 25 | 2133 | 0 | 4269 | 0 | 8.82 |
| 30 | 2134 | 1 | 5599 | 0 | 8.96 |
| 35 | 2099 | 1 | 6854 | 0 | 8.68 |
| 40 | 2132 | 3 | 8109 | 0 | 9.17 |
| 45 | 2077 | 0 | 9437 | 0 | 8.99 |
| 50 | 2126 | 0 | 10656 | 0 | 8.68 |
| 55 | 2215 | 2 | 11916 | 0 | 9.16 |
| 60 | 2149 | 0 | 13270 | 0 | 9.15 |
## Per-mode results

Offered: 15282 car veh/h; 528 bicycle flows (580/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2149 | 13270 | 476 | |
| Bicycle | 51 | 525 | 294 | |
| Pedestrian | 225 | 1485 | 487 | mean crossing delay 4.9 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 355, bicycle conflicts 557, close passes 303, pedestrian injury-risk index 0.047, bicycle injury-risk index 0.053 (proxy), mean vehicle speed at pedestrian encounters 2.59 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 92 trips (84 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 53 trips (49 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 137 trips (124 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 133 trips (117 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 67% | +20 | 92 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 10% | -11 | 92 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 8% | +2 | 92 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 24% | -3 | 92 |  |
| Colby Street NB | from | freeway | 47% | 30% | -17 | 53 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 25% | -23 | 53 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 34% | +9 | 53 |  |
| Colby Street NB | to | College Avenue | 3% | 9% | +6 | 53 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 34% | -12 | 137 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 16% | -10 | 137 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 33% | +17 | 137 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 47% | -10 | 137 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 33% | -10 | 133 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 41% | -5 | 133 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 50% | +28 | 133 |  |
| Colby Street SB | to | freeway | 45% | 12% | -33 | 133 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 50% | +16 | 133 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 10% | 482 |
| onto freeway | Hillegass Avenue | 12% | 11% | 482 |
| onto freeway | Martin Street | 10% | 33% | 482 |
| onto freeway | Colby Street | 8% | 11% | 482 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 60% | 482 |
| onto freeway | Benvenue Avenue | 5% | 3% | 482 |
| from freeway | College Avenue | 10% | 6% | 609 |
| from freeway | Martin Street | 10% | 35% | 609 |
| from freeway | Colby Street | 8% | 14% | 609 |
| from freeway | Hillegass Avenue | 5% | 7% | 609 |
| from freeway | Benvenue Avenue | 3% | 2% | 609 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1690 | 52nd Street | Secondary | 4 | 53 | signal | 12.63 | 10.84 | 10.8 | 691 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 9.81 | 7.47 | 7.5 | 521 |
| 1779 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 4.82 | 3.78 | 3.8 | 647 |
| 4204 | Adeline Street | Secondary | 3 | 185 | signal | 4.53 | 3.81 | 3.8 | 228 |
| 4466 | Ashby Avenue | Primary | 2 | 96 | signal | 4.45 | 3.66 | 3.7 | 334 |
| 4221 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 4.38 | 2.09 | 2.1 | 578 |
| 744 | 56th Street | Residential | 1 | 243 | two_way_stop | 4.33 | 3.93 | 3.9 | 62 |
| 4196 | 54th Street | Residential | 1 | 233 | two_way_stop | 4.23 | 3.06 | 3.1 | 175 |
| 1060 | Sacramento Street | Tertiary | 3 | 40 | signal | 4.17 | 3.52 | 3.5 | 428 |
| 1688 | Shattuck Avenue | Tertiary | 1 | 101 | signal | 4.07 | 3.12 | 3.1 | 553 |
| 4220 | 45th Street | Residential | 1 | 363 | uncontrolled | 3.92 | 1.97 | 2.0 | 382 |
| 787 | Martin Luther King Junior Way | Secondary | 4 | 48 | signal | 3.71 | 2.66 | 2.7 | 836 |
| 1145 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.68 | 2.87 | 2.9 | 288 |
| 1781 | Shattuck Avenue | Tertiary | 1 | 86 | two_way_stop | 3.65 | 2.44 | 2.4 | 596 |
| 2047 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.51 | 2.33 | 2.3 | 539 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 694 | 52nd Street / Shattuck Avenue | signal |  | 4.52 | 0.35 | 75 s: 27/38 |
| 458 | Market Street / Stanford Avenue | signal |  | 3.78 | 0.21 | 75 s: 50/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.89 | 0.02 | 75 s: 50/15 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 2.61 | 0.05 | 75 s: 19/46 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.47 | 0.08 | 75 s: 26/16/18 |
| 343 | 55th Street / Martin Luther King Junior Way | signal |  | 2.42 | 0.02 | 75 s: 33/32 |
| 874 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.27 | 0.01 | 75 s: 43/22 |
| 1438 | Ashby Avenue / Claremont Avenue | signal |  | 2.25 | 0.00 | 75 s: 46/19 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.15 | 0.00 | 75 s: 41/24 |
| 687 | 55th Street / Telegraph Avenue | signal |  | 2.15 | 0.08 | 75 s: 15/50 |
| 627 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.13 | 0.09 | 75 s: 15/15/30 |
| 513 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.11 | 0.02 | 75 s: 20/45 |
| 349 | 55th Street / Shattuck Avenue | signal |  | 2.05 | 0.02 | 120 s: 64/46 |
| 491 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.03 | 0.00 | 75 s: 15/30/15 |
| 1107 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 1.91 | 0.00 | 75 s: 19/26/15 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 751 | 852 |
| Telegraph | S | 10 | 500 | 533 |
| College | N | 3 | 163 | 163 |
| College | S | 3 | 347 | 361 |
| Claremont | N | 6 | 322 | 554 |
| Claremont | S | 7 | 463 | 778 |
| Alcatraz | E | 6 | 382 | 401 |
| Alcatraz | W | 6 | 263 | 295 |
| Hillegass | N | 4 | 72 | 83 |
| Hillegass | S | 4 | 115 | 127 |
| Colby | N | 7 | 14 | 24 |
| Colby | S | 7 | 72 | 85 |
| Martin | E | 2 | 197 | 197 |
| Martin | W | 2 | 236 | 236 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 1769 | (unnamed) | 1819 |
| 269 | Ashby Avenue | 781 |
| 966 | Telegraph Avenue / Ward Street | 721 |
| 617 | (unnamed) | 602 |
| 615 | Grove Shafter Freeway | 578 |
| 104 | San Pablo Avenue | 571 |
| 183 | San Pablo Avenue | 515 |
| 997 | Broadway | 449 |
| 1753 | Grove Shafter Freeway | 446 |
| 1704 | Warren Freeway | 410 |
