# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 17333 veh/h x scale 1 = 17333 veh/h. Run took 25.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 13 | FAIL |
| Backlog / spawned | < 2% | 0.0% (3 of 17422) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.03 m/s (last 15 min 6.02) | pass |

Overall: **NOT STABLE**. Mean trip delay 291 s, mean trip time 712 s, completed 12859, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1391 | 1 | 78 | 0 | 10.14 |
| 10 | 2371 | 0 | 549 | 0 | 8.82 |
| 15 | 2970 | 1 | 1402 | 0 | 7.71 |
| 20 | 3319 | 3 | 2501 | 0 | 7.70 |
| 25 | 3535 | 3 | 3761 | 0 | 7.28 |
| 30 | 3731 | 5 | 5027 | 1 | 7.08 |
| 35 | 3838 | 0 | 6398 | 1 | 7.78 |
| 40 | 3820 | 2 | 7822 | 1 | 7.12 |
| 45 | 3823 | 3 | 9232 | 3 | 6.61 |
| 50 | 4069 | 2 | 10443 | 5 | 6.24 |
| 55 | 4305 | 3 | 11699 | 8 | 6.07 |
| 60 | 4550 | 3 | 12859 | 13 | 5.73 |
## Per-mode results

Offered: 17333 car veh/h; 528 bicycle flows (580/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 4550 | 12859 | 712 | |
| Bicycle | 57 | 542 | 304 | |
| Pedestrian | 245 | 1504 | 480 | mean crossing delay 6.2 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 415, bicycle conflicts 672, close passes 377, pedestrian injury-risk index 0.044, bicycle injury-risk index 0.046 (proxy), mean vehicle speed at pedestrian encounters 2.47 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 205 trips (156 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 279 trips (211 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 397 trips (285 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 495 trips (338 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 62% | +15 | 205 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 205 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 6% | +0 | 205 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 44% | +17 | 205 |  |
| Colby Street NB | from | freeway | 47% | 39% | -8 | 279 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 45% | -3 | 279 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 32% | +7 | 279 |  |
| Colby Street NB | to | College Avenue | 3% | 13% | +10 | 279 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 397 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 8% | -18 | 397 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 24% | +8 | 397 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 62% | +5 | 397 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 49% | +6 | 495 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 24% | -22 | 495 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 53% | +31 | 495 |  |
| Colby Street SB | to | freeway | 45% | 33% | -12 | 495 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 46% | +12 | 495 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 10% | 628 |
| onto freeway | Hillegass Avenue | 12% | 16% | 628 |
| onto freeway | Martin Street | 10% | 19% | 628 |
| onto freeway | Colby Street | 8% | 7% | 628 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 56% | 628 |
| onto freeway | Benvenue Avenue | 5% | 2% | 628 |
| from freeway | College Avenue | 10% | 10% | 966 |
| from freeway | Martin Street | 10% | 28% | 966 |
| from freeway | Colby Street | 8% | 11% | 966 |
| from freeway | Hillegass Avenue | 5% | 12% | 966 |
| from freeway | Benvenue Avenue | 3% | 2% | 966 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4221 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 26.12 | 14.25 | 14.2 | 841 |
| 1982 | (unnamed) | Motorway | 2 | 188 | signal | 21.49 | 16.97 | 17.0 | 740 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 16.95 | 12.74 | 12.7 | 524 |
| 1635 | Telegraph Avenue | Secondary | 2 | 94 | signal | 16.23 | 14.39 | 14.4 | 378 |
| 4220 | 45th Street | Residential | 1 | 363 | uncontrolled | 14.34 | 7.97 | 8.0 | 466 |
| 4291 | Grove Shafter Freeway | Motorway | 4 | 645 | uncontrolled | 12.39 | 8.72 | 8.7 | 745 |
| 1145 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 11.61 | 8.12 | 8.1 | 596 |
| 3785 | Tunnel Road | Tertiary | 1 | 1310 | two_way_stop | 11.55 | 8.85 | 8.8 | 218 |
| 1697 | 52nd Street | Tertiary | 2 | 111 | uncontrolled | 10.92 | 10.23 | 10.2 | 144 |
| 1690 | 52nd Street | Secondary | 4 | 53 | signal | 10.11 | 8.21 | 8.2 | 970 |
| 4077 | Broadway Terrace | Tertiary | 2 | 154 | uncontrolled | 9.77 | 7.08 | 7.1 | 755 |
| 2060 | Claremont Avenue | Secondary | 2 | 194 | signal | 9.64 | 5.10 | 5.1 | 986 |
| 1916 | 58th Street | Residential | 1 | 221 | two_way_stop | 9.24 | 7.92 | 7.9 | 143 |
| 736 | 55th Street | Tertiary | 1 | 221 | uncontrolled | 9.18 | 6.14 | 6.1 | 474 |
| 1606 | 55th Street | Tertiary | 1 | 198 | uncontrolled | 9.11 | 6.31 | 6.3 | 497 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 458 | Market Street / Stanford Avenue | signal |  | 4.34 | 0.18 | 75 s: 50/15 |
| 1107 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 4.25 | 0.04 | 75 s: 22/18/20 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 4.15 | 0.33 | 75 s: 30/35 |
| 343 | 55th Street / Martin Luther King Junior Way | signal |  | 3.99 | 0.36 | 75 s: 20/45 |
| 694 | 52nd Street / Shattuck Avenue | signal |  | 3.88 | 0.63 | 75 s: 45/20 |
| 874 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.44 | 0.09 | 75 s: 21/44 |
| 627 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 3.07 | 0.11 | 75 s: 15/15/30 |
| 716 | 56th Street / Telegraph Avenue | signal |  | 2.96 | 0.05 | 75 s: 21/44 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.94 | 0.04 | 75 s: 50/15 |
| 687 | 55th Street / Telegraph Avenue | signal |  | 2.91 | 0.42 | 75 s: 15/50 |
| 1438 | Ashby Avenue / Claremont Avenue | signal |  | 2.75 | 0.02 | 75 s: 48/17 |
| 967 | Ashby Avenue / Shattuck Avenue | signal |  | 2.72 | 0.01 | 75 s: 40/25 |
| 513 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.62 | 0.06 | 75 s: 35/30 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.57 | 0.14 | 75 s: 30/15/15 |
| 491 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.52 | 0.00 | 75 s: 15/30/15 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 857 | Martin Luther King Junior Way | 55th Street / Martin Luther King Junior Way | signal | 3 | 53.9 |
| 595 | Martin Luther King Junior Way | 45th Street / Martin Luther King Junior Way | signal | 2 | 26.3 |
| 1697 | 52nd Street | 52nd Street | uncontrolled | 2 | 59.3 |
| 1777 | 52nd Street | 52nd Street | uncontrolled | 1 | 41.5 |
| 758 | Martin Luther King Junior Way | Martin Luther King Junior Way | uncontrolled | 1 | 42.2 |
| 592 | Martin Luther King Junior Way | 45th Street / Martin Luther King Junior Way | signal | 1 | 46.3 |
| 2063 | Telegraph Avenue | 57th Street / Telegraph Avenue | two_way_stop | 1 | 54.3 |
| 757 | Martin Luther King Junior Way | 56th Street / Martin Luther King Junior Way | uncontrolled | 1 | 56.5 |
| 1705 | Telegraph Avenue | 55th Street / Telegraph Avenue | signal | 1 | 58.1 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 674 | Aileen Street / Carberry Avenue | 2 | 18 |
| 406 | 65th Street / Shattuck Avenue | 1 | 17 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 515 | 586 |
| Telegraph | S | 10 | 455 | 538 |
| College | N | 3 | 416 | 418 |
| College | S | 3 | 398 | 400 |
| Claremont | N | 6 | 626 | 919 |
| Claremont | S | 7 | 712 | 1138 |
| Alcatraz | E | 6 | 521 | 577 |
| Alcatraz | W | 6 | 722 | 788 |
| Hillegass | N | 4 | 110 | 176 |
| Hillegass | S | 4 | 292 | 313 |
| Colby | N | 7 | 136 | 155 |
| Colby | S | 7 | 250 | 283 |
| Martin | E | 2 | 132 | 132 |
| Martin | W | 2 | 308 | 308 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 1769 | (unnamed) | 1808 |
| 269 | Ashby Avenue | 779 |
| 966 | Telegraph Avenue / Ward Street | 709 |
| 615 | Grove Shafter Freeway | 581 |
| 617 | (unnamed) | 581 |
| 104 | San Pablo Avenue | 517 |
| 183 | San Pablo Avenue | 479 |
| 1753 | Grove Shafter Freeway | 438 |
| 1704 | Warren Freeway | 405 |
| 1793 | Claremont Avenue | 395 |
