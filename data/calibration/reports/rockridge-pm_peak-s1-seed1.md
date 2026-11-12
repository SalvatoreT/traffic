# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 24079 veh/h x scale 1 = 24079 veh/h. Run took 40.1 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 5 | FAIL |
| Backlog / spawned | < 2% | 3.0% (699 of 23255) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 7.52 m/s (last 15 min 7.26) | pass |

Overall: **NOT STABLE**. Mean trip delay 239 s, mean trip time 566 s, completed 18931, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1877 | 0 | 199 | 0 | 10.44 |
| 10 | 2888 | 10 | 1206 | 0 | 8.83 |
| 15 | 3319 | 61 | 2735 | 0 | 7.85 |
| 20 | 3495 | 100 | 4446 | 0 | 7.94 |
| 25 | 3668 | 24 | 6344 | 0 | 7.64 |
| 30 | 3779 | 118 | 8087 | 0 | 6.98 |
| 35 | 3930 | 254 | 9833 | 0 | 7.15 |
| 40 | 3990 | 395 | 11719 | 0 | 7.35 |
| 45 | 3952 | 508 | 13586 | 1 | 7.03 |
| 50 | 3950 | 641 | 15433 | 2 | 7.16 |
| 55 | 4096 | 714 | 17190 | 3 | 7.58 |
| 60 | 4319 | 699 | 18931 | 5 | 7.05 |
## Per-mode results

Offered: 24079 car veh/h; 1500 bicycle flows (1148/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 4319 | 18931 | 566 | |
| Bicycle | 125 | 1004 | 366 | |
| Pedestrian | 281 | 1645 | 486 | mean crossing delay 7.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 456, bicycle conflicts 1643, close passes 854, pedestrian injury-risk index 0.041, bicycle injury-risk index 0.042 (proxy), mean vehicle speed at pedestrian encounters 2.34 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 91 trips (82 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 132 trips (115 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 240 trips (206 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 255 trips (216 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 65% | +18 | 91 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 8% | -25 | 91 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 8% | +2 | 91 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 37% | +10 | 91 |  |
| Colby Street NB | from | freeway | 47% | 32% | -15 | 132 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 33% | -15 | 132 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 39% | +14 | 132 |  |
| Colby Street NB | to | College Avenue | 3% | 6% | +3 | 132 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 33% | -13 | 240 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 11% | -15 | 240 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 20% | +4 | 240 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 59% | -9 | 240 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 18% | -25 | 255 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 53% | +7 | 255 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 51% | +29 | 255 |  |
| Colby Street SB | to | freeway | 45% | 25% | -20 | 255 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 53% | +19 | 255 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 9% | 695 | 16% | 359 |
| onto freeway | Hillegass Avenue | 12% | 8% | 695 | 15% | 359 |
| onto freeway | Martin Street | 10% | 19% | 695 | 4% | 359 |
| onto freeway | Colby Street | 8% | 4% | 695 | 8% | 359 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 29% | 695 | 5% | 359 |
| onto freeway | Benvenue Avenue | 5% | 3% | 695 | 6% | 359 |
| from freeway | College Avenue | 10% | 8% | 987 | 8% | 822 |
| from freeway | Martin Street | 10% | 19% | 987 | 23% | 822 |
| from freeway | Colby Street | 8% | 8% | 987 | 10% | 822 |
| from freeway | Hillegass Avenue | 5% | 7% | 987 | 8% | 822 |
| from freeway | Benvenue Avenue | 3% | 3% | 987 | 3% | 822 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4221 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 40.83 | 30.71 | 30.7 | 521 |
| 4236 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 19.35 | 1.03 | 1.0 | 1578 |
| 4220 | 45th Street | Residential | 1 | 363 | uncontrolled | 15.01 | 10.74 | 10.7 | 318 |
| 4228 | (unnamed) | Motorway | 3 | 72 | uncontrolled | 14.66 | 5.17 | 5.2 | 2098 |
| 1690 | 52nd Street | Secondary | 4 | 53 | signal | 13.82 | 11.92 | 11.9 | 714 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 13.41 | 10.59 | 10.6 | 362 |
| 744 | 56th Street | Residential | 1 | 243 | two_way_stop | 10.96 | 10.18 | 10.2 | 85 |
| 4466 | Ashby Avenue | Primary | 2 | 96 | signal | 10.37 | 8.86 | 8.9 | 352 |
| 1916 | 58th Street | Residential | 1 | 221 | two_way_stop | 9.97 | 9.18 | 9.2 | 95 |
| 1098 | Aileen Street | Residential | 1 | 248 | two_way_stop | 9.81 | 8.57 | 8.6 | 113 |
| 1145 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 8.46 | 6.35 | 6.3 | 409 |
| 4196 | 54th Street | Residential | 1 | 233 | two_way_stop | 8.06 | 7.20 | 7.2 | 120 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 7.86 | 6.02 | 6.0 | 742 |
| 1605 | 55th Street | Tertiary | 1 | 198 | signal | 7.54 | 6.06 | 6.1 | 268 |
| 1951 | 57th Street | Residential | 1 | 214 | two_way_stop | 7.39 | 6.86 | 6.9 | 94 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 694 | 52nd Street / Shattuck Avenue | signal |  | 5.37 | 0.64 | 75 s: 37/28 |
| 458 | Market Street / Stanford Avenue | signal |  | 4.55 | 0.15 | 75 s: 50/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.96 | 0.05 | 75 s: 29/36 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 3.95 | 0.52 | 75 s: 33/32 |
| 627 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 3.28 | 0.16 | 75 s: 15/15/30 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 3.26 | 0.20 | 75 s: 30/15/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.25 | 0.05 | 75 s: 46/19 |
| 343 | 55th Street / Martin Luther King Junior Way | signal |  | 3.03 | 0.22 | 75 s: 36/29 |
| 874 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.99 | 0.05 | 75 s: 42/23 |
| 970 | Ashby Avenue / Telegraph Avenue | signal |  | 2.85 | 0.00 | 75 s: 42/23 |
| 17 | 45th Street / San Pablo Avenue | signal |  | 2.79 | 0.08 | 75 s: 29/36 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.78 | 0.13 | 75 s: 31/34 |
| 1107 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.78 | 0.00 | 75 s: 24/21/15 |
| 967 | Ashby Avenue / Shattuck Avenue | signal |  | 2.74 | 0.01 | 75 s: 47/18 |
| 1438 | Ashby Avenue / Claremont Avenue | signal |  | 2.68 | 0.03 | 75 s: 47/18 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1074 | Adeline Street | Adeline Street / Alcatraz Avenue | signal | 1 | 42.1 |
| 787 | Martin Luther King Junior Way | 55th Street / Martin Luther King Junior Way | signal | 1 | 46.4 |
| 1873 | MacCall Street | 57th Street / MacCall Street | uncontrolled | 1 | 52.7 |
| 688 | 46th Street | 46th Street / West Street | two_way_stop | 1 | 57.1 |
| 4183 | West Street | 46th Street / West Street | two_way_stop | 1 | 58.0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1769 | (unnamed) | 611 | 2932 |
| 74 | 43rd Street / San Pablo Avenue | 83 | 403 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | 3 | 258 |
| 1 | Marshall Street | 1 | 11 |
| 286 | Market Street | 1 | 605 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 925 | 1069 |
| Telegraph | S | 10 | 948 | 1018 |
| College | N | 3 | 293 | 293 |
| College | S | 3 | 314 | 317 |
| Claremont | N | 6 | 451 | 710 |
| Claremont | S | 7 | 598 | 964 |
| Alcatraz | E | 6 | 529 | 535 |
| Alcatraz | W | 6 | 389 | 419 |
| Hillegass | N | 4 | 53 | 76 |
| Hillegass | S | 4 | 175 | 208 |
| Colby | N | 7 | 40 | 47 |
| Colby | S | 7 | 149 | 164 |
| Martin | E | 2 | 137 | 137 |
| Martin | W | 2 | 236 | 236 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 1769 | (unnamed) | 2932 |
| 269 | Ashby Avenue | 1126 |
| 1743 | Grove Shafter Freeway | 1115 |
| 966 | Telegraph Avenue / Ward Street | 1064 |
| 615 | Grove Shafter Freeway | 927 |
| 104 | San Pablo Avenue | 922 |
| 617 | (unnamed) | 891 |
| 183 | San Pablo Avenue | 873 |
| 1704 | Warren Freeway | 694 |
| 286 | Market Street | 605 |
