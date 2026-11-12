# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20167 veh/h x scale 1 = 20167 veh/h. Run took 41.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (2 of 20167) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.95 m/s (last 15 min 9.83) | pass |

Overall: **STABLE**. Mean trip delay 96 s, mean trip time 394 s, completed 17785, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1433 | 1 | 252 | 0 | 11.72 |
| 10 | 2006 | 1 | 1316 | 0 | 10.39 |
| 15 | 2175 | 0 | 2801 | 0 | 10.16 |
| 20 | 2166 | 0 | 4443 | 0 | 10.11 |
| 25 | 2197 | 1 | 6089 | 0 | 10.11 |
| 30 | 2289 | 1 | 7725 | 0 | 9.73 |
| 35 | 2319 | 6 | 9383 | 0 | 9.69 |
| 40 | 2363 | 0 | 11059 | 0 | 9.66 |
| 45 | 2321 | 2 | 12749 | 0 | 9.69 |
| 50 | 2294 | 1 | 14477 | 0 | 10.07 |
| 55 | 2342 | 1 | 16120 | 0 | 9.86 |
| 60 | 2382 | 2 | 17785 | 0 | 9.57 |
## Per-mode results

Offered: 20167 car veh/h; 1500 bicycle flows (1056/h); 2000 pedestrian flows (1541/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2382 | 17785 | 394 | |
| Bicycle | 95 | 944 | 342 | |
| Pedestrian | 200 | 1242 | 480 | mean crossing delay 6.4 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 286, bicycle conflicts 1177, close passes 725, pedestrian injury-risk index 0.048, bicycle injury-risk index 0.048 (proxy), mean vehicle speed at pedestrian encounters 2.62 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 95 trips (88 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 79 trips (72 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 118 trips (111 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 141 trips (126 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 46% | -1 | 95 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 6% | -15 | 95 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 4% | -2 | 95 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 23% | -4 | 95 |  |
| Colby Street NB | from | freeway | 47% | 38% | -9 | 79 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 23% | -25 | 79 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 20% | -5 | 79 |  |
| Colby Street NB | to | College Avenue | 3% | 13% | +10 | 79 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 16% | -30 | 118 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 8% | -18 | 118 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 11% | -5 | 118 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 60% | +3 | 118 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 13% | -30 | 141 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 45% | -1 | 141 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 35% | +13 | 141 |  |
| Colby Street SB | to | freeway | 45% | 30% | -15 | 141 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 45% | +11 | 141 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 22% | 715 | 22% | 668 |
| onto freeway | Hillegass Avenue | 12% | 11% | 715 | 12% | 668 |
| onto freeway | Martin Street | 10% | 9% | 715 | 9% | 668 |
| onto freeway | Colby Street | 8% | 6% | 715 | 6% | 668 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 715 | 11% | 668 |
| onto freeway | Benvenue Avenue | 5% | 6% | 715 | 7% | 668 |
| from freeway | College Avenue | 10% | 8% | 1269 | 6% | 926 |
| from freeway | Martin Street | 10% | 10% | 1269 | 14% | 926 |
| from freeway | Colby Street | 8% | 7% | 1269 | 9% | 926 |
| from freeway | Hillegass Avenue | 5% | 3% | 1269 | 4% | 926 |
| from freeway | Benvenue Avenue | 3% | 2% | 1269 | 2% | 926 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1689 | 52nd Street | Secondary | 4 | 53 | signal | 9.93 | 8.21 | 8.2 | 619 |
| 4464 | Ashby Avenue | Primary | 2 | 96 | signal | 8.53 | 7.43 | 7.4 | 288 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.16 | 3.66 | 3.7 | 841 |
| 4219 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 4.82 | 2.50 | 2.5 | 479 |
| 2290 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.37 | 2.27 | 2.3 | 1714 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 4.27 | 2.57 | 2.6 | 1165 |
| 4224 | (unnamed) | Motorway | 2 | 690 | uncontrolled | 4.25 | 0.03 | 0.0 | 1006 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 4.00 | 3.54 | 3.5 | 61 |
| 2046 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.93 | 2.71 | 2.7 | 636 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 3.92 | 2.94 | 2.9 | 390 |
| 784 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 3.88 | 2.93 | 2.9 | 1494 |
| 225 | 61st Street | Residential | 1 | 137 | two_way_stop | 3.79 | 2.64 | 2.6 | 228 |
| 1778 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 3.75 | 2.58 | 2.6 | 768 |
| 2345 | Telegraph Avenue | Secondary | 2 | 104 | signal | 3.71 | 2.26 | 2.3 | 1326 |
| 3506 | Claremont Avenue | Secondary | 3 | 43 | signal | 3.64 | 3.00 | 3.0 | 613 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 693 | 52nd Street / Shattuck Avenue | signal |  | 4.27 | 0.21 | 75 s: 28/37 |
| 458 | Market Street / Stanford Avenue | signal |  | 2.74 | 0.07 | 75 s: 43/22 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.72 | 0.04 | 75 s: 27/38 |
| 872 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.71 | 0.05 | 75 s: 41/24 |
| 1436 | Ashby Avenue / Claremont Avenue | signal |  | 2.58 | 0.03 | 75 s: 38/27 |
| 1403 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.46 | 0.17 | 75 s: 30/15/15 |
| 513 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.40 | 0.03 | 75 s: 26/39 |
| 968 | Ashby Avenue / Telegraph Avenue | signal |  | 2.28 | 0.00 | 75 s: 17/48 |
| 965 | Ashby Avenue / Shattuck Avenue | signal |  | 2.18 | 0.01 | 75 s: 43/22 |
| 1105 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.16 | 0.00 | 75 s: 28/17/15 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 2.03 | 0.02 | 75 s: 24/41 |
| 342 | 52nd Street / Martin Luther King Junior Way | signal |  | 1.98 | 0.01 | 60 s: 60 |
| 352 | 55th Street / Market Street | signal |  | 1.90 | 0.04 | 75 s: 40/25 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 1.76 | 0.03 | 75 s: 38/27 |
| 1249 | Ashby Avenue / College Avenue | signal |  | 1.75 | 0.01 | 75 s: 39/26 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 693: 28 s: 52nd Street 4L [1689], 52nd Street 4L [1693]; 37 s: Shattuck Avenue 2L [1680], Shattuck Avenue 2L [1732]
- node 458: 43 s: Stanford Avenue 1L [964], Stanford Avenue 3L [1078]; 22 s: Market Street 4L [1131], Market Street 3L [1134]
- node 37: 27 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 38 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4168]
- node 872: 41 s: Telegraph Avenue 3L [2077], Telegraph Avenue 3L [2078]; 24 s: Alcatraz Avenue 2L [2071], Alcatraz Avenue 2L [2104]
- node 1436: 38 s: Ashby Avenue 1L [3454], Ashby Avenue 2L [3485]; 27 s: Claremont Avenue 3L [3506], Claremont Avenue 2L [4394]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 133 | 62nd Street | 1 | 40 |
| 868 | Fairview Street / Shattuck Avenue | 1 | 11 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 785 | 809 |
| Telegraph | S | 10 | 955 | 1037 |
| College | N | 3 | 182 | 182 |
| College | S | 3 | 262 | 262 |
| Claremont | N | 6 | 622 | 847 |
| Claremont | S | 7 | 542 | 766 |
| Alcatraz | E | 6 | 367 | 389 |
| Alcatraz | W | 6 | 462 | 474 |
| Hillegass | N | 4 | 64 | 83 |
| Hillegass | S | 4 | 80 | 95 |
| Colby | N | 7 | 34 | 36 |
| Colby | S | 7 | 73 | 79 |
| Martin | E | 2 | 79 | 79 |
| Martin | W | 2 | 143 | 143 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 615 | Grove Shafter Freeway | 4110 |
| 964 | Telegraph Avenue / Ward Street | 1946 |
| 1702 | Warren Freeway | 1368 |
| 183 | San Pablo Avenue | 1314 |
| 269 | Ashby Avenue | 1222 |
| 104 | San Pablo Avenue | 550 |
| 1788 | Claremont Avenue | 516 |
| 776 | Telegraph Avenue | 467 |
| 286 | Market Street | 437 |
| 1749 | Grove Shafter Freeway | 398 |
