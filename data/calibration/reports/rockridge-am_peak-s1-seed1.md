# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 23720 veh/h x scale 1 = 23720 veh/h. Run took 57.3 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 152 | FAIL |
| Backlog / spawned | < 2% | 9.5% (2063 of 21796) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 4.29 m/s (last 15 min 3.32) | pass |

Overall: **NOT STABLE**. Mean trip delay 635 s, mean trip time 1041 s, completed 10921, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1882 | 51 | 86 | 0 | 8.47 |
| 10 | 3289 | 147 | 540 | 0 | 7.14 |
| 15 | 4409 | 287 | 1279 | 0 | 6.04 |
| 20 | 5382 | 401 | 2186 | 1 | 5.29 |
| 25 | 6081 | 575 | 3312 | 2 | 5.15 |
| 30 | 6817 | 802 | 4407 | 5 | 4.71 |
| 35 | 7538 | 952 | 5472 | 18 | 4.44 |
| 40 | 8268 | 1114 | 6555 | 31 | 4.09 |
| 45 | 8975 | 1356 | 7609 | 47 | 3.76 |
| 50 | 9569 | 1535 | 8756 | 69 | 3.71 |
| 55 | 10083 | 1734 | 9960 | 110 | 3.28 |
| 60 | 10723 | 2063 | 10921 | 152 | 2.97 |
## Per-mode results

Offered: 23720 car veh/h; 1500 bicycle flows (1479/h); 2000 pedestrian flows (2380/h); 0 bus routes running (0 dropped as unlinked, 0 runs blocked). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 10723 | 10921 | 1041 | |
| Bus | 0 | 0 | 0 | mean speed 0.00 m/s |
| Bicycle | 240 | 1237 | 444 | |
| Pedestrian | 314 | 1864 | 503 | mean crossing delay 9.2 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 358, bicycle conflicts 491, close passes 1452, pedestrian injury-risk index 0.032, bicycle injury-risk index 0.028 (proxy), mean vehicle speed at pedestrian encounters 1.88 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 186 trips (97 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 260 trips (129 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 296 trips (202 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 477 trips (251 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 56% | +9 | 186 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 10% | -11 | 186 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 8% | +2 | 186 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 42% | +15 | 186 |  |
| Colby Street NB | from | freeway | 47% | 40% | -7 | 260 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 44% | -4 | 260 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 60% | +35 | 260 |  |
| Colby Street NB | to | College Avenue | 3% | 11% | +8 | 260 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 19% | -27 | 296 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 296 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 10% | -6 | 296 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 58% | +1 | 296 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 52% | +9 | 477 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 19% | -27 | 477 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 46% | +24 | 477 |  |
| Colby Street SB | to | freeway | 45% | 31% | -14 | 477 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 36% | +2 | 477 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 17% | 746 |
| onto freeway | Hillegass Avenue | 12% | 19% | 746 |
| onto freeway | Martin Street | 10% | 17% | 746 |
| onto freeway | Colby Street | 8% | 12% | 746 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 54% | 746 |
| onto freeway | Benvenue Avenue | 5% | 2% | 746 |
| from freeway | College Avenue | 10% | 7% | 875 |
| from freeway | Martin Street | 10% | 22% | 875 |
| from freeway | Colby Street | 8% | 10% | 875 |
| from freeway | Hillegass Avenue | 5% | 7% | 875 |
| from freeway | Benvenue Avenue | 3% | 1% | 875 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 5179 | Grove Shafter Freeway | Motorway | 4 | 645 | uncontrolled | 63.46 | 52.27 | 52.3 | 862 |
| 4619 | Tunnel Road | Tertiary | 1 | 1309 | two_way_stop | 47.31 | 37.63 | 37.6 | 149 |
| 5103 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 45.75 | 36.30 | 36.3 | 584 |
| 5099 | (unnamed) | Motorway | 2 | 150 | uncontrolled | 33.43 | 24.90 | 24.9 | 670 |
| 2371 | (unnamed) | Motorway | 2 | 188 | signal | 27.81 | 21.54 | 21.5 | 721 |
| 5254 | (unnamed) | Motorway | 1 | 449 | uncontrolled | 22.56 | 9.88 | 9.9 | 422 |
| 5102 | 45th Street | Residential | 1 | 363 | uncontrolled | 21.82 | 20.69 | 20.7 | 107 |
| 5101 | 45th Street | Residential | 1 | 363 | signal | 18.16 | 11.11 | 11.1 | 617 |
| 1049 | 55th Street | Tertiary | 1 | 238 | signal | 18.00 | 13.10 | 13.1 | 607 |
| 1981 | (unnamed) | Motorway | 2 | 112 | signal | 17.50 | 12.05 | 12.0 | 914 |
| 2015 | Telegraph Avenue | Secondary | 2 | 94 | signal | 16.27 | 13.65 | 13.6 | 527 |
| 1849 | 42nd Street | Residential | 1 | 220 | uncontrolled | 16.21 | 15.41 | 15.4 | 95 |
| 4621 | Tunnel Road | Tertiary | 1 | 324 | uncontrolled | 16.00 | 2.09 | 2.1 | 1066 |
| 2449 | Claremont Avenue | Secondary | 2 | 194 | signal | 15.26 | 12.49 | 12.5 | 457 |
| 2305 | 58th Street | Residential | 1 | 221 | two_way_stop | 15.23 | 13.48 | 13.5 | 131 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 855 | 52nd Street / Shattuck Avenue | signal |  | 6.17 | 1.24 | 75 s: 39/26 |
| 17 | 40th Street / San Pablo Avenue | signal |  | 5.66 | 0.77 | 75 s: 33/32 |
| 423 | 40th Street / Market Street | signal |  | 5.07 | 0.50 | 75 s: 36/29 |
| 480 | 55th Street / Martin Luther King Junior Way | signal |  | 4.98 | 0.37 | 75 s: 30/35 |
| 426 | 40th Street / West Street | signal |  | 4.90 | 0.63 | 75 s: 26/39 |
| 599 | Adeline Street / Alcatraz Avenue | signal |  | 4.64 | 0.32 | 75 s: 23/42 |
| 598 | Market Street / Stanford Avenue | signal |  | 4.62 | 0.14 | 75 s: 50/15 |
| 35 | 40th Street / Adeline Street | signal |  | 4.45 | 0.30 | 75 s: 15/50 |
| 790 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 4.17 | 0.29 | 75 s: 17/15/28 |
| 1036 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.92 | 0.16 | 75 s: 28/37 |
| 479 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.81 | 0.78 | 60 s: 60 |
| 147 | Park Avenue / San Pablo Avenue | signal |  | 3.68 | 0.01 | 75 s: 17/48 |
| 486 | 55th Street / Shattuck Avenue | signal |  | 3.51 | 0.06 | 85 s: 50/25 |
| 274 | Alcatraz Avenue / Sacramento Street | signal |  | 3.48 | 0.05 | 75 s: 46/19 |
| 1298 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.42 | 0.05 | 75 s: 15/25/20 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 868 | Martin Luther King Junior Way | 45th Street / Martin Luther King Junior Way | signal | 4 | 49.9 |
| 3523 | College Avenue | College Avenue / Webster Street | two_way_stop | 3 | 35.2 |
| 1173 | (unnamed) | West Street | uncontrolled | 3 | 36.4 |
| 2228 | 56th Street | 56th Street / Telegraph Avenue | signal | 3 | 49.6 |
| 1944 | Carberry Avenue | 56th Street / Carberry Avenue | all_way_stop | 3 | 49.8 |
| 2453 | Telegraph Avenue | Telegraph Avenue | uncontrolled | 3 | 50.5 |
| 2014 | Telegraph Avenue | Aileen Street / Telegraph Avenue | signal | 3 | 51.0 |
| 865 | Martin Luther King Junior Way | 45th Street / Martin Luther King Junior Way | signal | 3 | 51.2 |
| 974 | 45th Street | 45th Street / Adeline Street | two_way_stop | 2 | 31.1 |
| 35 | 40th Street | 40th Street / San Pablo Avenue | signal | 2 | 40.8 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 2123 | (unnamed) | 561 | 1224 |
| 2124 | (unnamed) | 557 | 1224 |
| 775 | Telegraph Avenue | 281 | 619 |
| 2152 | Claremont Avenue | 206 | 641 |
| 1919 | Tunnel Road | 153 | 613 |
| 2114 | Market Street | 120 | 639 |
| 31 | 40th Street | 54 | 720 |
| 1186 | Howe Street | 31 | 115 |
| 29 | San Pablo Avenue | 30 | 715 |
| 425 | West Street | 28 | 426 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 622 | 674 |
| Telegraph | S | 10 | 522 | 642 |
| College | N | 3 | 154 | 154 |
| College | S | 3 | 584 | 587 |
| Claremont | N | 6 | 245 | 344 |
| Claremont | S | 7 | 610 | 874 |
| Alcatraz | E | 7 | 420 | 492 |
| Alcatraz | W | 7 | 395 | 600 |
| Hillegass | N | 4 | 88 | 139 |
| Hillegass | S | 4 | 175 | 181 |
| Colby | N | 7 | 91 | 134 |
| Colby | S | 7 | 227 | 254 |
| Martin | E | 2 | 137 | 137 |
| Martin | W | 2 | 185 | 185 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 373 | Ashby Avenue | 1266 |
| 2124 | (unnamed) | 1224 |
| 2123 | (unnamed) | 1224 |
| 1128 | Telegraph Avenue / Ward Street | 1148 |
| 2120 | Grove Shafter Freeway | 787 |
| 2122 | (unnamed) | 787 |
| 31 | 40th Street | 720 |
| 29 | San Pablo Avenue | 715 |
| 2152 | Claremont Avenue | 641 |
| 2114 | Market Street | 639 |
