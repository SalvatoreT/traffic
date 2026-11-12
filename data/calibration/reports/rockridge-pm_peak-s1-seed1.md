# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 24924 veh/h x scale 1 = 24924 veh/h. Run took 64.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 211 | FAIL |
| Backlog / spawned | < 2% | 12.2% (2726 of 22401) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 4.06 m/s (last 15 min 3.05) | pass |

Overall: **NOT STABLE**. Mean trip delay 642 s, mean trip time 1046 s, completed 10835, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1976 | 82 | 85 | 0 | 8.33 |
| 10 | 3466 | 207 | 550 | 0 | 7.03 |
| 15 | 4587 | 374 | 1326 | 2 | 5.75 |
| 20 | 5547 | 530 | 2313 | 2 | 5.16 |
| 25 | 6371 | 766 | 3348 | 6 | 4.89 |
| 30 | 7049 | 1025 | 4501 | 16 | 4.52 |
| 35 | 7755 | 1269 | 5640 | 30 | 3.78 |
| 40 | 8592 | 1425 | 6677 | 53 | 3.80 |
| 45 | 9397 | 1727 | 7680 | 80 | 3.94 |
| 50 | 10206 | 2023 | 8614 | 112 | 3.35 |
| 55 | 10864 | 2325 | 9675 | 150 | 3.03 |
| 60 | 11355 | 2726 | 10835 | 211 | 2.78 |
## Per-mode results

Offered: 24924 car veh/h; 1500 bicycle flows (1605/h); 2000 pedestrian flows (3066/h); 0 bus routes running (0 dropped as unlinked, 0 runs blocked). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 11355 | 10835 | 1046 | |
| Bus | 0 | 0 | 0 | mean speed 0.00 m/s |
| Bicycle | 254 | 1335 | 466 | |
| Pedestrian | 428 | 2460 | 497 | mean crossing delay 8.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 471, bicycle conflicts 598, close passes 1055, pedestrian injury-risk index 0.031, bicycle injury-risk index 0.024 (proxy), mean vehicle speed at pedestrian encounters 1.88 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 163 trips (87 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 224 trips (113 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 333 trips (156 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 616 trips (294 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 47% | +0 | 163 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 3% | -30 | 163 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 11% | +5 | 163 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 36% | +9 | 163 |  |
| Colby Street NB | from | freeway | 47% | 36% | -11 | 224 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 33% | -15 | 224 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 52% | +27 | 224 |  |
| Colby Street NB | to | College Avenue | 3% | 17% | +14 | 224 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 27% | -19 | 333 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 333 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 17% | +1 | 333 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 64% | -4 | 333 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 50% | +7 | 616 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 20% | -26 | 616 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 56% | +34 | 616 |  |
| Colby Street SB | to | freeway | 45% | 47% | +2 | 616 | within |
| Colby Street SB | to | Forest Street | 34% | 48% | +14 | 616 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 23% | 631 |
| onto freeway | Hillegass Avenue | 12% | 12% | 631 |
| onto freeway | Martin Street | 10% | 13% | 631 |
| onto freeway | Colby Street | 8% | 16% | 631 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 53% | 631 |
| onto freeway | Benvenue Avenue | 5% | 3% | 631 |
| from freeway | College Avenue | 10% | 6% | 839 |
| from freeway | Martin Street | 10% | 14% | 839 |
| from freeway | Colby Street | 8% | 6% | 839 |
| from freeway | Hillegass Avenue | 5% | 10% | 839 |
| from freeway | Benvenue Avenue | 3% | 1% | 839 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 5121 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 108.71 | 83.33 | 83.3 | 1544 |
| 4619 | Tunnel Road | Tertiary | 1 | 1309 | two_way_stop | 65.37 | 60.24 | 60.2 | 109 |
| 5179 | Grove Shafter Freeway | Motorway | 4 | 645 | uncontrolled | 56.57 | 40.44 | 40.4 | 1130 |
| 5103 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 50.79 | 38.80 | 38.8 | 536 |
| 5099 | (unnamed) | Motorway | 2 | 150 | uncontrolled | 33.88 | 25.73 | 25.7 | 640 |
| 2371 | (unnamed) | Motorway | 2 | 188 | signal | 25.01 | 17.21 | 17.2 | 894 |
| 5102 | 45th Street | Residential | 1 | 363 | uncontrolled | 23.27 | 21.74 | 21.7 | 89 |
| 5353 | Warren Freeway | Motorway | 3 | 384 | uncontrolled | 23.12 | 11.37 | 11.4 | 1316 |
| 42 | 40th Street | Secondary | 4 | 77 | signal | 20.96 | 18.90 | 18.9 | 370 |
| 5105 | (unnamed) | Motorway | 1 | 293 | uncontrolled | 20.85 | 12.11 | 12.1 | 848 |
| 1981 | (unnamed) | Motorway | 2 | 112 | signal | 20.01 | 13.68 | 13.7 | 848 |
| 5254 | (unnamed) | Motorway | 1 | 449 | uncontrolled | 19.38 | 5.87 | 5.9 | 433 |
| 48 | San Pablo Avenue | Primary | 4 | 78 | signal | 18.07 | 15.31 | 15.3 | 653 |
| 5069 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 16.79 | 14.29 | 14.3 | 713 |
| 5176 | Grove Shafter Freeway | Motorway | 4 | 835 | uncontrolled | 16.67 | 8.89 | 8.9 | 1663 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 855 | 52nd Street / Shattuck Avenue | signal |  | 6.89 | 1.22 | 75 s: 38/27 |
| 17 | 40th Street / San Pablo Avenue | signal |  | 6.01 | 1.34 | 75 s: 35/30 |
| 426 | 40th Street / West Street | signal |  | 6.00 | 1.17 | 75 s: 28/37 |
| 423 | 40th Street / Market Street | signal |  | 5.10 | 0.75 | 75 s: 26/39 |
| 480 | 55th Street / Martin Luther King Junior Way | signal |  | 5.07 | 0.62 | 75 s: 17/48 |
| 35 | 40th Street / Adeline Street | signal |  | 4.85 | 0.58 | 75 s: 15/50 |
| 599 | Adeline Street / Alcatraz Avenue | signal |  | 4.56 | 0.61 | 75 s: 32/33 |
| 1298 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 4.44 | 0.12 | 75 s: 15/20/25 |
| 598 | Market Street / Stanford Avenue | signal |  | 4.31 | 0.13 | 75 s: 47/18 |
| 790 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 4.05 | 0.28 | 75 s: 15/15/30 |
| 147 | Park Avenue / San Pablo Avenue | signal |  | 4.02 | 0.05 | 75 s: 16/49 |
| 479 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.89 | 1.18 | 60 s: 60 |
| 1036 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.76 | 0.09 | 75 s: 31/34 |
| 486 | 55th Street / Shattuck Avenue | signal |  | 3.58 | 0.05 | 120 s: 67/43 |
| 850 | 55th Street / Telegraph Avenue | signal |  | 3.56 | 0.26 | 75 s: 15/50 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 38 | 40th Street | 40th Street / San Pablo Avenue | signal | 6 | 26.6 |
| 35 | 40th Street | 40th Street / San Pablo Avenue | signal | 6 | 40.5 |
| 1104 | Martin Luther King Junior Way | 55th Street / Martin Luther King Junior Way | signal | 5 | 32.3 |
| 2042 | Martin Luther King Junior Way | 47th Street / Martin Luther King Junior Way | signal | 5 | 42.6 |
| 2228 | 56th Street | 56th Street / Telegraph Avenue | signal | 4 | 45.8 |
| 42 | 40th Street | 40th Street / Adeline Street | signal | 4 | 46.8 |
| 865 | Martin Luther King Junior Way | 45th Street / Martin Luther King Junior Way | signal | 4 | 49.9 |
| 1009 | 46th Street | 46th Street / Adeline Street | two_way_stop | 3 | 24.5 |
| 1110 | Martin Luther King Junior Way | Martin Luther King Junior Way | uncontrolled | 3 | 31.9 |
| 1180 | Martin Luther King Junior Way | 55th Street / Martin Luther King Junior Way | signal | 3 | 32.3 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 2124 | (unnamed) | 768 | 1449 |
| 2123 | (unnamed) | 741 | 1449 |
| 31 | 40th Street | 309 | 848 |
| 775 | Telegraph Avenue | 236 | 560 |
| 29 | San Pablo Avenue | 155 | 842 |
| 432 | 40th Street | 143 | 496 |
| 2114 | Market Street | 105 | 616 |
| 425 | West Street | 101 | 475 |
| 2152 | Claremont Avenue | 90 | 586 |
| 1919 | Tunnel Road | 45 | 561 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 629 | 767 |
| Telegraph | S | 10 | 517 | 734 |
| College | N | 3 | 192 | 194 |
| College | S | 3 | 550 | 559 |
| Claremont | N | 6 | 252 | 314 |
| Claremont | S | 7 | 636 | 766 |
| Alcatraz | E | 7 | 316 | 431 |
| Alcatraz | W | 7 | 293 | 401 |
| Hillegass | N | 4 | 55 | 125 |
| Hillegass | S | 4 | 220 | 220 |
| Colby | N | 7 | 62 | 67 |
| Colby | S | 7 | 298 | 335 |
| Martin | E | 2 | 128 | 128 |
| Martin | W | 2 | 130 | 130 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 2124 | (unnamed) | 1449 |
| 2123 | (unnamed) | 1449 |
| 373 | Ashby Avenue | 1157 |
| 1128 | Telegraph Avenue / Ward Street | 1092 |
| 2120 | Grove Shafter Freeway | 932 |
| 2122 | (unnamed) | 932 |
| 31 | 40th Street | 848 |
| 29 | San Pablo Avenue | 842 |
| 2100 | Grove Shafter Freeway | 702 |
| 2052 | Warren Freeway | 649 |
