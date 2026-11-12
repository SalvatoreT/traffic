# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 23944 veh/h x scale 1 = 23944 veh/h. Run took 42.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 1.3% (309 of 23682) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.74 m/s (last 15 min 8.05) | pass |

Overall: **STABLE**. Mean trip delay 153 s, mean trip time 456 s, completed 20392, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1756 | 6 | 277 | 0 | 11.46 |
| 10 | 2631 | 2 | 1429 | 0 | 9.76 |
| 15 | 2912 | 7 | 3114 | 0 | 9.05 |
| 20 | 2961 | 64 | 5021 | 0 | 8.86 |
| 25 | 3024 | 70 | 6931 | 0 | 9.19 |
| 30 | 3130 | 30 | 8878 | 0 | 8.73 |
| 35 | 3078 | 77 | 10841 | 0 | 8.41 |
| 40 | 2979 | 163 | 12821 | 0 | 8.91 |
| 45 | 3121 | 126 | 14685 | 0 | 8.89 |
| 50 | 3286 | 159 | 16507 | 0 | 7.87 |
| 55 | 3328 | 295 | 18387 | 0 | 8.11 |
| 60 | 3290 | 309 | 20392 | 0 | 8.16 |
## Per-mode results

Offered: 23944 car veh/h; 1500 bicycle flows (1148/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3290 | 20392 | 456 | |
| Bicycle | 118 | 1006 | 363 | |
| Pedestrian | 276 | 1605 | 477 | mean crossing delay 7.3 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 438, bicycle conflicts 1698, close passes 761, pedestrian injury-risk index 0.044, bicycle injury-risk index 0.046 (proxy), mean vehicle speed at pedestrian encounters 2.44 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 91 trips (86 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 82 trips (75 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 141 trips (128 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 158 trips (145 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 58% | +11 | 91 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 5% | -28 | 91 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 9% | +3 | 91 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 37% | +10 | 91 |  |
| Colby Street NB | from | freeway | 47% | 37% | -10 | 82 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 17% | -31 | 82 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 28% | +3 | 82 |  |
| Colby Street NB | to | College Avenue | 3% | 9% | +6 | 82 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 141 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 3% | -23 | 141 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 9% | -7 | 141 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 69% | +1 | 141 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 18% | -25 | 158 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 38% | -8 | 158 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 40% | +18 | 158 |  |
| Colby Street SB | to | freeway | 45% | 22% | -23 | 158 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 43% | +9 | 158 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 892 | 14% | 797 |
| onto freeway | Hillegass Avenue | 12% | 12% | 892 | 14% | 797 |
| onto freeway | Martin Street | 10% | 7% | 892 | 6% | 797 |
| onto freeway | Colby Street | 8% | 5% | 892 | 6% | 797 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 892 | 9% | 797 |
| onto freeway | Benvenue Avenue | 5% | 4% | 892 | 4% | 797 |
| from freeway | College Avenue | 10% | 7% | 1386 | 8% | 993 |
| from freeway | Martin Street | 10% | 11% | 1386 | 16% | 993 |
| from freeway | Colby Street | 8% | 9% | 1386 | 12% | 993 |
| from freeway | Hillegass Avenue | 5% | 4% | 1386 | 5% | 993 |
| from freeway | Benvenue Avenue | 3% | 1% | 1386 | 2% | 993 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4236 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 28.92 | 12.98 | 13.0 | 2384 |
| 4219 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 19.78 | 12.80 | 12.8 | 590 |
| 4234 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 15.53 | 0.79 | 0.8 | 1620 |
| 1689 | 52nd Street | Secondary | 4 | 53 | signal | 11.72 | 9.61 | 9.6 | 788 |
| 4226 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 11.57 | 3.59 | 3.6 | 2243 |
| 4464 | Ashby Avenue | Primary | 2 | 96 | signal | 10.48 | 9.16 | 9.2 | 307 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 8.01 | 6.29 | 6.3 | 653 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 7.88 | 7.41 | 7.4 | 58 |
| 315 | Stanford Avenue | Secondary | 2 | 354 | uncontrolled | 6.92 | 2.54 | 2.5 | 1460 |
| 341 | San Pablo Avenue | Primary | 2 | 75 | uncontrolled | 6.74 | 4.98 | 5.0 | 659 |
| 338 | San Pablo Avenue | Primary | 3 | 37 | two_way_stop | 6.60 | 4.68 | 4.7 | 1298 |
| 2290 | Telegraph Avenue | Secondary | 2 | 104 | signal | 6.09 | 3.41 | 3.4 | 1870 |
| 1145 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 6.08 | 4.59 | 4.6 | 316 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 5.89 | 4.69 | 4.7 | 347 |
| 4224 | (unnamed) | Motorway | 2 | 690 | uncontrolled | 5.76 | 0.03 | 0.0 | 1158 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 693 | 52nd Street / Shattuck Avenue | signal |  | 5.14 | 0.28 | 75 s: 35/30 |
| 458 | Market Street / Stanford Avenue | signal |  | 4.09 | 0.19 | 75 s: 48/17 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.70 | 0.07 | 75 s: 16/49 |
| 1436 | Ashby Avenue / Claremont Avenue | signal |  | 3.14 | 0.17 | 75 s: 41/24 |
| 968 | Ashby Avenue / Telegraph Avenue | signal |  | 2.99 | 0.01 | 75 s: 19/46 |
| 872 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.88 | 0.03 | 75 s: 42/23 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 2.80 | 0.06 | 75 s: 33/32 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.69 | 0.04 | 75 s: 39/26 |
| 1403 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.66 | 0.20 | 75 s: 30/15/15 |
| 1105 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.59 | 0.01 | 75 s: 23/22/15 |
| 131 | 61st Street / San Pablo Avenue | two_way_stop |  | 2.56 | 0.69 |  |
| 965 | Ashby Avenue / Shattuck Avenue | signal |  | 2.39 | 0.01 | 75 s: 50/15 |
| 342 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.34 | 0.03 | 60 s: 60 |
| 513 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.31 | 0.04 | 75 s: 19/46 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.21 | 0.02 | 75 s: 39/26 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 693: 35 s: 52nd Street 4L [1689], 52nd Street 4L [1693]; 30 s: Shattuck Avenue 2L [1680], Shattuck Avenue 2L [1732]
- node 458: 48 s: Stanford Avenue 1L [964], Stanford Avenue 3L [1078]; 17 s: Market Street 4L [1131], Market Street 3L [1134]
- node 37: 16 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 49 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4168]
- node 1436: 41 s: Ashby Avenue 1L [3454], Ashby Avenue 2L [3485]; 24 s: Claremont Avenue 3L [3506], Claremont Avenue 2L [4394]
- node 968: 19 s: Ashby Avenue 3L [2287], Ashby Avenue 2L [4251]; 46 s: Telegraph Avenue 3L [2314], Telegraph Avenue 3L [2361]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 183 | San Pablo Avenue | 174 | 1417 |
| 615 | Grove Shafter Freeway | 83 | 4854 |
| 964 | Telegraph Avenue / Ward Street | 18 | 2143 |
| 133 | 62nd Street | 17 | 73 |
| 132 | 62nd Street / San Pablo Avenue | 8 | 53 |
| 157 | 59th Street | 6 | 92 |
| 68 | 59th Street / San Pablo Avenue | 2 | 34 |
| 1389 | Chabot Road / Golden Gate Avenue | 1 | 18 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 949 | 1037 |
| Telegraph | S | 10 | 1021 | 1153 |
| College | N | 3 | 241 | 241 |
| College | S | 3 | 426 | 426 |
| Claremont | N | 6 | 565 | 836 |
| Claremont | S | 7 | 602 | 900 |
| Alcatraz | E | 6 | 469 | 476 |
| Alcatraz | W | 6 | 424 | 430 |
| Hillegass | N | 4 | 54 | 72 |
| Hillegass | S | 4 | 79 | 113 |
| Colby | N | 7 | 26 | 34 |
| Colby | S | 7 | 74 | 86 |
| Martin | E | 2 | 79 | 79 |
| Martin | W | 2 | 181 | 181 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 615 | Grove Shafter Freeway | 4854 |
| 964 | Telegraph Avenue / Ward Street | 2143 |
| 1702 | Warren Freeway | 1431 |
| 183 | San Pablo Avenue | 1417 |
| 269 | Ashby Avenue | 1132 |
| 776 | Telegraph Avenue | 550 |
| 995 | Broadway | 512 |
| 1788 | Claremont Avenue | 478 |
| 104 | San Pablo Avenue | 443 |
| 1749 | Grove Shafter Freeway | 398 |
