# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 23667 veh/h x scale 1 = 23667 veh/h. Run took 29.3 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 1 | FAIL |
| Backlog / spawned | < 2% | 1.7% (389 of 23156) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.74 m/s (last 15 min 8.37) | pass |

Overall: **NOT STABLE**. Mean trip delay 172 s, mean trip time 478 s, completed 19984, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1743 | 1 | 259 | 0 | 11.15 |
| 10 | 2565 | 1 | 1396 | 0 | 9.83 |
| 15 | 2888 | 3 | 3049 | 0 | 9.37 |
| 20 | 3003 | 44 | 4893 | 0 | 9.06 |
| 25 | 3031 | 125 | 6791 | 0 | 8.51 |
| 30 | 3122 | 211 | 8640 | 0 | 8.32 |
| 35 | 3013 | 276 | 10551 | 0 | 8.53 |
| 40 | 3125 | 283 | 12336 | 0 | 8.86 |
| 45 | 3142 | 253 | 14287 | 1 | 8.27 |
| 50 | 3193 | 309 | 16151 | 1 | 8.14 |
| 55 | 3100 | 413 | 18060 | 1 | 8.27 |
| 60 | 3171 | 389 | 19984 | 1 | 8.71 |
## Per-mode results

Offered: 23667 car veh/h; 1500 bicycle flows (1154/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3171 | 19984 | 478 | |
| Bicycle | 117 | 1029 | 360 | |
| Pedestrian | 277 | 1608 | 480 | mean crossing delay 8.2 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 428, bicycle conflicts 1643, close passes 769, pedestrian injury-risk index 0.045, bicycle injury-risk index 0.045 (proxy), mean vehicle speed at pedestrian encounters 2.47 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 78 trips (73 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 82 trips (77 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 153 trips (142 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 133 trips (121 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 55% | +8 | 78 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 12% | -21 | 78 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 6% | +0 | 78 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 35% | +8 | 78 |  |
| Colby Street NB | from | freeway | 47% | 40% | -7 | 82 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 13% | -35 | 82 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 30% | +5 | 82 |  |
| Colby Street NB | to | College Avenue | 3% | 11% | +8 | 82 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 16% | -30 | 153 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 6% | -20 | 153 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 14% | -2 | 153 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 65% | -3 | 153 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 15% | -28 | 133 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 28% | -18 | 133 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 38% | +16 | 133 |  |
| Colby Street SB | to | freeway | 45% | 26% | -19 | 133 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 49% | +15 | 133 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 831 | 15% | 726 |
| onto freeway | Hillegass Avenue | 12% | 13% | 831 | 15% | 726 |
| onto freeway | Martin Street | 10% | 9% | 831 | 9% | 726 |
| onto freeway | Colby Street | 8% | 5% | 831 | 6% | 726 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 12% | 831 | 12% | 726 |
| onto freeway | Benvenue Avenue | 5% | 3% | 831 | 4% | 726 |
| from freeway | College Avenue | 10% | 7% | 1391 | 9% | 963 |
| from freeway | Martin Street | 10% | 9% | 1391 | 13% | 963 |
| from freeway | Colby Street | 8% | 4% | 1391 | 6% | 963 |
| from freeway | Hillegass Avenue | 5% | 4% | 1391 | 6% | 963 |
| from freeway | Benvenue Avenue | 3% | 2% | 1391 | 3% | 963 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 27.08 | 12.07 | 12.1 | 2272 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 18.13 | 0.77 | 0.8 | 1616 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 18.07 | 10.11 | 10.1 | 623 |
| 4198 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 12.04 | 3.78 | 3.8 | 2358 |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 10.66 | 9.35 | 9.3 | 292 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 10.07 | 8.09 | 8.1 | 773 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 9.46 | 8.94 | 8.9 | 59 |
| 4190 | 45th Street | Residential | 1 | 363 | uncontrolled | 8.87 | 6.97 | 7.0 | 228 |
| 315 | Stanford Avenue | Secondary | 2 | 354 | uncontrolled | 8.72 | 4.32 | 4.3 | 1285 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 6.74 | 5.21 | 5.2 | 377 |
| 338 | San Pablo Avenue | Primary | 3 | 37 | two_way_stop | 6.65 | 4.70 | 4.7 | 1289 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 6.31 | 4.77 | 4.8 | 660 |
| 352 | San Pablo Avenue | Primary | 2 | 50 | uncontrolled | 5.63 | 3.04 | 3.0 | 1294 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 5.53 | 3.33 | 3.3 | 1278 |
| 251 | 60th Street | Residential | 1 | 127 | two_way_stop | 5.40 | 5.04 | 5.0 | 60 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.59 | 0.40 | 75 s: 36/29 |
| 454 | Market Street / Stanford Avenue | signal |  | 4.09 | 0.20 | 75 s: 49/16 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.53 | 0.07 | 75 s: 22/43 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.97 | 0.14 | 75 s: 34/31 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 2.94 | 0.07 | 75 s: 25/40 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.73 | 0.01 | 75 s: 23/42 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.72 | 0.03 | 75 s: 42/23 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.68 | 0.00 | 75 s: 24/21/15 |
| 131 | 61st Street / San Pablo Avenue | two_way_stop |  | 2.65 | 0.62 |  |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.59 | 0.20 | 75 s: 28/15/17 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.36 | 0.05 | 75 s: 36/29 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.33 | 0.05 | 75 s: 27/38 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.20 | 0.03 | 75 s: 37/28 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.18 | 0.01 | 75 s: 48/17 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.17 | 0.04 | 60 s: 60 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 36 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 29 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 454: 49 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 16 s: Market Street 4L [1125], Market Street 3L [1128]
- node 37: 22 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 43 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]
- node 1422: 34 s: Ashby Avenue 1L [3426], Ashby Avenue 2L [3457]; 31 s: Claremont Avenue 3L [3478], Claremont Avenue 2L [4366]
- node 455: 25 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 40 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1722 | Shattuck Avenue | 52nd Street / Shattuck Avenue | signal | 1 | 45.0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 610 | Grove Shafter Freeway | 240 | 4842 |
| 183 | San Pablo Avenue | 116 | 1376 |
| 132 | 62nd Street / San Pablo Avenue | 27 | 91 |
| 182 | 61st Street | 3 | 65 |
| 157 | 59th Street | 1 | 66 |
| 283 | Market Street | 1 | 342 |
| 955 | Telegraph Avenue / Ward Street | 1 | 2026 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 972 | 1032 |
| Telegraph | S | 10 | 1032 | 1093 |
| College | N | 3 | 224 | 228 |
| College | S | 3 | 356 | 358 |
| Claremont | N | 6 | 635 | 877 |
| Claremont | S | 7 | 571 | 845 |
| Alcatraz | E | 6 | 486 | 514 |
| Alcatraz | W | 6 | 450 | 474 |
| Hillegass | N | 4 | 44 | 60 |
| Hillegass | S | 4 | 114 | 138 |
| Colby | N | 7 | 37 | 40 |
| Colby | S | 7 | 72 | 85 |
| Martin | E | 2 | 89 | 89 |
| Martin | W | 2 | 142 | 142 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4842 |
| 955 | Telegraph Avenue / Ward Street | 2026 |
| 1688 | Warren Freeway | 1434 |
| 183 | San Pablo Avenue | 1376 |
| 266 | Ashby Avenue | 1133 |
| 771 | Telegraph Avenue | 549 |
| 986 | Broadway | 523 |
| 104 | San Pablo Avenue | 462 |
| 1774 | Claremont Avenue | 438 |
| 1735 | Grove Shafter Freeway | 374 |
