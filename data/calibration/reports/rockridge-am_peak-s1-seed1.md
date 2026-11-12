# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20342 veh/h x scale 1 = 20342 veh/h. Run took 19.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 5 | FAIL |
| Backlog / spawned | < 2% | 0.7% (134 of 20144) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.88 m/s (last 15 min 7.06) | pass |

Overall: **NOT STABLE**. Mean trip delay 195 s, mean trip time 531 s, completed 16549, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1518 | 1 | 144 | 0 | 10.43 |
| 10 | 2395 | 2 | 973 | 0 | 9.15 |
| 15 | 2693 | 1 | 2313 | 0 | 8.56 |
| 20 | 2908 | 1 | 3754 | 0 | 8.40 |
| 25 | 2981 | 1 | 5353 | 0 | 8.21 |
| 30 | 3098 | 3 | 6905 | 2 | 7.82 |
| 35 | 3160 | 71 | 8507 | 2 | 8.17 |
| 40 | 3214 | 70 | 10135 | 2 | 8.19 |
| 45 | 3476 | 14 | 11667 | 2 | 7.28 |
| 50 | 3495 | 13 | 13407 | 2 | 7.29 |
| 55 | 3472 | 77 | 15035 | 2 | 7.11 |
| 60 | 3590 | 134 | 16549 | 5 | 6.77 |
## Per-mode results

Offered: 20342 car veh/h; 1500 bicycle flows (1056/h); 2000 pedestrian flows (1541/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3590 | 16549 | 531 | |
| Bicycle | 102 | 943 | 351 | |
| Pedestrian | 209 | 1232 | 502 | mean crossing delay 6.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 299, bicycle conflicts 1216, close passes 852, pedestrian injury-risk index 0.039, bicycle injury-risk index 0.048 (proxy), mean vehicle speed at pedestrian encounters 2.27 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 108 trips (95 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 93 trips (77 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 218 trips (155 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 321 trips (252 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 77% | +30 | 108 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 5% | -16 | 108 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 6% | -0 | 108 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 25% | -2 | 108 |  |
| Colby Street NB | from | freeway | 47% | 41% | -6 | 93 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 29% | -19 | 93 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 42% | +17 | 93 |  |
| Colby Street NB | to | College Avenue | 3% | 10% | +7 | 93 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 29% | -17 | 218 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 11% | -15 | 218 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 17% | +1 | 218 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 41% | -16 | 218 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 41% | -2 | 321 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 34% | -12 | 321 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 74% | +52 | 321 |  |
| Colby Street SB | to | freeway | 45% | 14% | -31 | 321 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 71% | +37 | 321 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 6% | 507 |
| onto freeway | Hillegass Avenue | 12% | 8% | 507 |
| onto freeway | Martin Street | 10% | 28% | 507 |
| onto freeway | Colby Street | 8% | 8% | 507 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 52% | 507 |
| onto freeway | Benvenue Avenue | 5% | 1% | 507 |
| from freeway | College Avenue | 10% | 7% | 848 |
| from freeway | Martin Street | 10% | 32% | 848 |
| from freeway | Colby Street | 8% | 13% | 848 |
| from freeway | Hillegass Avenue | 5% | 7% | 848 |
| from freeway | Benvenue Avenue | 3% | 1% | 848 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4221 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 43.31 | 31.38 | 31.4 | 625 |
| 4220 | 45th Street | Residential | 1 | 363 | uncontrolled | 17.60 | 13.21 | 13.2 | 316 |
| 4236 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 16.08 | 0.98 | 1.0 | 1588 |
| 1690 | 52nd Street | Secondary | 4 | 53 | signal | 14.94 | 12.82 | 12.8 | 751 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 13.09 | 9.86 | 9.9 | 578 |
| 1697 | 52nd Street | Tertiary | 2 | 111 | uncontrolled | 10.21 | 9.65 | 9.7 | 134 |
| 4195 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 9.77 | 5.42 | 5.4 | 1609 |
| 4228 | (unnamed) | Motorway | 3 | 72 | uncontrolled | 8.88 | 2.69 | 2.7 | 2228 |
| 1098 | Aileen Street | Residential | 1 | 248 | two_way_stop | 8.62 | 7.99 | 8.0 | 72 |
| 4204 | Adeline Street | Secondary | 3 | 185 | signal | 8.50 | 7.05 | 7.0 | 355 |
| 4196 | 54th Street | Residential | 1 | 233 | two_way_stop | 7.89 | 6.72 | 6.7 | 139 |
| 4466 | Ashby Avenue | Primary | 2 | 96 | signal | 7.75 | 6.65 | 6.6 | 326 |
| 1145 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 7.47 | 5.57 | 5.6 | 364 |
| 744 | 56th Street | Residential | 1 | 243 | two_way_stop | 7.34 | 6.41 | 6.4 | 92 |
| 787 | Martin Luther King Junior Way | Secondary | 4 | 48 | signal | 6.60 | 5.21 | 5.2 | 869 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 694 | 52nd Street / Shattuck Avenue | signal |  | 5.38 | 0.32 | 75 s: 32/33 |
| 458 | Market Street / Stanford Avenue | signal |  | 4.64 | 0.19 | 75 s: 50/15 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 3.89 | 0.19 | 75 s: 29/36 |
| 343 | 55th Street / Martin Luther King Junior Way | signal |  | 3.33 | 0.18 | 75 s: 29/36 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.20 | 0.03 | 75 s: 41/24 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.13 | 0.02 | 75 s: 39/26 |
| 874 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.04 | 0.05 | 75 s: 36/29 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.94 | 0.15 | 75 s: 29/16/15 |
| 627 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.76 | 0.16 | 75 s: 15/14/31 |
| 1438 | Ashby Avenue / Claremont Avenue | signal |  | 2.74 | 0.01 | 75 s: 46/19 |
| 342 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.69 | 0.06 | 60 s: 60 |
| 687 | 55th Street / Telegraph Avenue | signal |  | 2.65 | 0.17 | 75 s: 15/50 |
| 491 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.52 | 0.00 | 75 s: 15/30/15 |
| 1107 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.41 | 0.00 | 75 s: 17/28/15 |
| 513 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.40 | 0.06 | 75 s: 26/39 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 595 | Martin Luther King Junior Way | 45th Street / Martin Luther King Junior Way | signal | 2 | 27.6 |
| 1624 | 52nd Street | 52nd Street / Dover Street | two_way_stop | 1 | 59.1 |
| 1765 | Dover Street | 52nd Street / Dover Street | two_way_stop | 1 | 59.3 |
| 1621 | 52nd Street | 52nd Street / Dover Street | two_way_stop | 1 | 59.8 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1769 | (unnamed) | 133 | 2494 |
| 344 | 56th Street / Martin Luther King Junior Way | 1 | 6 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 988 | 1044 |
| Telegraph | S | 10 | 634 | 718 |
| College | N | 3 | 258 | 262 |
| College | S | 3 | 418 | 422 |
| Claremont | N | 6 | 385 | 696 |
| Claremont | S | 7 | 524 | 932 |
| Alcatraz | E | 6 | 418 | 462 |
| Alcatraz | W | 6 | 458 | 492 |
| Hillegass | N | 4 | 70 | 106 |
| Hillegass | S | 4 | 170 | 174 |
| Colby | N | 7 | 37 | 43 |
| Colby | S | 7 | 211 | 236 |
| Martin | E | 2 | 140 | 140 |
| Martin | W | 2 | 283 | 283 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 1769 | (unnamed) | 2494 |
| 269 | Ashby Avenue | 1242 |
| 966 | Telegraph Avenue / Ward Street | 1122 |
| 615 | Grove Shafter Freeway | 814 |
| 617 | (unnamed) | 799 |
| 104 | San Pablo Avenue | 770 |
| 183 | San Pablo Avenue | 709 |
| 1753 | Grove Shafter Freeway | 682 |
| 1743 | Grove Shafter Freeway | 622 |
| 286 | Market Street | 613 |
