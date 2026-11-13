# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15672 veh/h x scale 1 = 15672 veh/h. Run took 17.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 15766) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.88 m/s (last 15 min 9.74) | pass |

Overall: **STABLE**. Mean trip delay 84 s, mean trip time 384 s, completed 15841, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1703 | 2 | 1439 | 0 | 9.98 |
| 10 | 1656 | 0 | 2782 | 0 | 10.07 |
| 15 | 1670 | 0 | 4081 | 0 | 10.10 |
| 20 | 1705 | 1 | 5338 | 0 | 10.32 |
| 25 | 1700 | 0 | 6655 | 0 | 9.96 |
| 30 | 1731 | 2 | 7911 | 0 | 9.65 |
| 35 | 1792 | 4 | 9189 | 0 | 9.62 |
| 40 | 1813 | 0 | 10539 | 0 | 9.69 |
| 45 | 1766 | 0 | 11889 | 0 | 10.00 |
| 50 | 1755 | 1 | 13209 | 0 | 9.95 |
| 55 | 1799 | 2 | 14520 | 0 | 9.74 |
| 60 | 1806 | 0 | 15841 | 0 | 9.53 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14463 | 0.01 | 0.8% | 1.096 | 1.055 | 6.5% | 0.1% | 1.035 | 2.8% | 0.0% | 6.4% | 1634 | 14.8% |
| gate to gate | 7603 | 0.01 | 1.2% | 1.098 | 1.072 | 5.3% | 0.0% | 1.035 | 2.3% | 0.0% | 9.7% | 681 | 11.9% |
| with a local end | 6860 | 0.00 | 0.4% | 1.093 | 1.037 | 8.0% | 0.1% | 1.034 | 3.4% | 0.0% | 2.7% | 953 | 16.9% |
| guided drivers | 6628 | 0.02 | 1.7% | 1.095 | 1.054 | 6.2% | 0.0% | 1.033 | 2.5% | 0.0% | 6.6% | 732 | 14.4% |
| other drivers | 7835 | 0.00 | 0.2% | 1.096 | 1.055 | 6.8% | 0.1% | 1.036 | 3.0% | 0.0% | 6.2% | 902 | 15.1% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (308 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 770 | 9.3 | 3% |
| freeway to the surface gates | 999 | 4.8 | 2% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 789 | 2% | 7% | 91% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 763 | 1% | 15% | 84% | 0.1 |

## Per-mode results

Offered: 15672 car veh/h; 532 bicycle flows (583/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1806 | 15841 | 384 | |
| Bicycle | 40 | 582 | 297 | |
| Pedestrian | 262 | 1741 | 475 | mean crossing delay 7.9 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 301, bicycle conflicts 496, close passes 469, pedestrian injury-risk index 0.050, bicycle injury-risk index 0.063 (proxy), mean vehicle speed at pedestrian encounters 2.59 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 99 trips (92 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 122 trips (119 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 150 trips (138 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 183 trips (160 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 64% | +17 | 99 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 99 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 6% | +0 | 99 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 34% | +7 | 99 |  |
| Colby Street NB | from | freeway | 47% | 78% | +31 | 122 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 2% | -46 | 122 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 13% | -12 | 122 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 122 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 7% | -39 | 150 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 150 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 5% | -11 | 150 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 75% | +18 | 150 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 14% | -29 | 183 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 22% | -24 | 183 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 27% | +5 | 183 |  |
| Colby Street SB | to | freeway | 45% | 69% | +24 | 183 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 9% | -25 | 183 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 610 | 15% | 583 |
| onto freeway | Hillegass Avenue | 12% | 16% | 610 | 16% | 583 |
| onto freeway | Martin Street | 10% | 19% | 610 | 20% | 583 |
| onto freeway | Colby Street | 8% | 16% | 610 | 17% | 583 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 17% | 610 | 10% | 583 |
| onto freeway | Benvenue Avenue | 5% | 2% | 610 | 2% | 583 |
| from freeway | College Avenue | 10% | 5% | 939 | 6% | 796 |
| from freeway | Martin Street | 10% | 16% | 939 | 19% | 796 |
| from freeway | Colby Street | 8% | 9% | 939 | 11% | 796 |
| from freeway | Hillegass Avenue | 5% | 7% | 939 | 8% | 796 |
| from freeway | Benvenue Avenue | 3% | 2% | 939 | 2% | 796 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 8.39 | 7.36 | 7.4 | 472 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 6.86 | 4.51 | 4.5 | 396 |
| 1768 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 4.74 | 3.59 | 3.6 | 582 |
| 1594 | 55th Street | Tertiary | 1 | 198 | signal | 4.22 | 3.39 | 3.4 | 259 |
| 1128 | Market Street | Tertiary | 3 | 31 | signal | 3.95 | 3.57 | 3.6 | 367 |
| 1770 | Shattuck Avenue | Tertiary | 1 | 86 | two_way_stop | 3.79 | 2.46 | 2.5 | 593 |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 3.71 | 1.71 | 1.7 | 1026 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.61 | 2.78 | 2.8 | 220 |
| 1054 | Sacramento Street | Tertiary | 3 | 40 | signal | 3.33 | 2.66 | 2.7 | 1038 |
| 1133 | Market Street | Tertiary | 2 | 87 | uncontrolled | 3.28 | 2.60 | 2.6 | 386 |
| 1066 | Adeline Street | Secondary | 4 | 43 | signal | 3.27 | 2.74 | 2.7 | 653 |
| 1774 | Shattuck Avenue | Tertiary | 1 | 98 | two_way_stop | 3.22 | 1.88 | 1.9 | 595 |
| 2032 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.10 | 2.01 | 2.0 | 550 |
| 1125 | Market Street | Secondary | 4 | 36 | signal | 3.07 | 2.67 | 2.7 | 743 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 3.02 | 1.68 | 1.7 | 1340 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 4.37 | 0.14 | 75 s: 50/15 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 3.99 | 0.18 | 75 s: 21/44 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 3.53 | 0.01 | 75 s: 21/44 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.97 | 0.03 | 75 s: 16/29/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.81 | 0.08 | 75 s: 29/36 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.58 | 0.00 | 75 s: 20/45 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.40 | 0.00 | 75 s: 38/27 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.23 | 0.02 | 75 s: 36/29 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.21 | 0.01 | 75 s: 50/15 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.16 | 0.04 | 75 s: 18/47 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.10 | 0.01 | 75 s: 23/22/15 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.08 | 0.05 | 75 s: 46/19 |
| 592 | Adeline Street / Ashby Avenue | signal |  | 2.07 | 0.00 | 75 s: 49/16 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.06 | 0.03 | 75 s: 49/16 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 1.94 | 0.02 | 75 s: 38/27 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 688: 21 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 44 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 455: 21 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 44 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 30: 16 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 29 s: Market Street 2L [772], Market Street 2L [1130]; 15 s: 57th Street 1L [44], 57th Street 1L [1168]
- node 185: 29 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1179]; 36 s: Sacramento Street 3L [1053], Sacramento Street 3L [1054]

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 559 | 580 |
| Telegraph | S | 10 | 624 | 667 |
| College | N | 3 | 156 | 156 |
| College | S | 3 | 293 | 293 |
| Claremont | N | 6 | 461 | 726 |
| Claremont | S | 7 | 455 | 738 |
| Alcatraz | E | 6 | 391 | 433 |
| Alcatraz | W | 6 | 320 | 340 |
| Hillegass | N | 4 | 68 | 80 |
| Hillegass | S | 4 | 95 | 124 |
| Colby | N | 7 | 83 | 91 |
| Colby | S | 7 | 112 | 125 |
| Martin | E | 2 | 151 | 151 |
| Martin | W | 2 | 154 | 154 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 3015 |
| 955 | Telegraph Avenue / Ward Street | 1498 |
| 1688 | Warren Freeway | 965 |
| 266 | Ashby Avenue | 782 |
| 183 | San Pablo Avenue | 639 |
| 283 | Market Street | 366 |
| 104 | San Pablo Avenue | 346 |
| 771 | Telegraph Avenue | 341 |
| 1774 | Claremont Avenue | 324 |
| 284 | Martin Luther King Junior Way | 269 |
