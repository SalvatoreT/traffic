# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 14802 veh/h x scale 1 = 14802 veh/h. Run took 15.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 14799) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.03 m/s (last 15 min 10.03) | pass |

Overall: **STABLE**. Mean trip delay 81 s, mean trip time 382 s, completed 14943, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1745 | 1 | 1230 | 0 | 9.33 |
| 10 | 1754 | 0 | 2497 | 0 | 9.78 |
| 15 | 1601 | 0 | 3842 | 0 | 10.28 |
| 20 | 1544 | 0 | 5110 | 0 | 10.01 |
| 25 | 1571 | 2 | 6302 | 0 | 10.43 |
| 30 | 1621 | 0 | 7501 | 0 | 10.10 |
| 35 | 1573 | 0 | 8782 | 0 | 9.87 |
| 40 | 1547 | 1 | 10025 | 0 | 10.44 |
| 45 | 1554 | 0 | 11229 | 0 | 10.24 |
| 50 | 1654 | 0 | 12417 | 0 | 10.09 |
| 55 | 1664 | 0 | 13641 | 0 | 9.79 |
| 60 | 1593 | 0 | 14943 | 0 | 10.22 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 13687 | 0.01 | 0.5% | 1.101 | 1.062 | 6.7% | 0.1% | 1.034 | 2.5% | 0.0% | 6.5% | 1777 | 13.7% |
| gate to gate | 7420 | 0.01 | 0.6% | 1.102 | 1.075 | 5.1% | 0.1% | 1.031 | 1.9% | 0.0% | 10.2% | 719 | 11.7% |
| with a local end | 6267 | 0.00 | 0.4% | 1.101 | 1.043 | 8.6% | 0.2% | 1.037 | 3.3% | 0.0% | 2.1% | 1057 | 15.0% |
| guided drivers | 6257 | 0.01 | 1.2% | 1.102 | 1.061 | 7.1% | 0.1% | 1.033 | 2.7% | 0.0% | 6.8% | 831 | 14.9% |
| other drivers | 7430 | 0.00 | 0.0% | 1.101 | 1.063 | 6.4% | 0.2% | 1.034 | 2.4% | 0.0% | 6.2% | 945 | 12.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (309 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 929 | 10.5 | 3% |
| freeway to the surface gates | 1072 | 13.6 | 4% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 925 | 1% | 8% | 91% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 806 | 1% | 15% | 84% | 0.0 |

## Per-mode results

Offered: 14802 car veh/h; 532 bicycle flows (583/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1593 | 14943 | 382 | |
| Bicycle | 52 | 597 | 298 | |
| Pedestrian | 221 | 1726 | 481 | mean crossing delay 5.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 422, bicycle conflicts 547, close passes 450, pedestrian injury-risk index 0.054, bicycle injury-risk index 0.062 (proxy), mean vehicle speed at pedestrian encounters 2.70 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 81 trips (74 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 105 trips (100 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 122 trips (118 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 170 trips (159 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 48% | +1 | 81 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 7% | -14 | 81 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 11% | +5 | 81 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 23% | -4 | 81 |  |
| Colby Street NB | from | freeway | 47% | 65% | +18 | 105 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 11% | -37 | 105 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 33% | +8 | 105 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 105 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 13% | -33 | 122 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 4% | -22 | 122 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 6% | -10 | 122 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 77% | +20 | 122 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 10% | -33 | 170 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 18% | -28 | 170 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 20% | -2 | 170 |  |
| Colby Street SB | to | freeway | 45% | 76% | +31 | 170 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 17% | -17 | 170 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 12% | 682 | 12% | 656 |
| onto freeway | Hillegass Avenue | 12% | 12% | 682 | 12% | 656 |
| onto freeway | Martin Street | 10% | 14% | 682 | 14% | 656 |
| onto freeway | Colby Street | 8% | 14% | 682 | 14% | 656 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 682 | 12% | 656 |
| onto freeway | Benvenue Avenue | 5% | 4% | 682 | 4% | 656 |
| from freeway | College Avenue | 10% | 6% | 959 | 6% | 856 |
| from freeway | Martin Street | 10% | 18% | 959 | 20% | 856 |
| from freeway | Colby Street | 8% | 8% | 959 | 9% | 856 |
| from freeway | Hillegass Avenue | 5% | 4% | 959 | 5% | 856 |
| from freeway | Benvenue Avenue | 3% | 2% | 959 | 3% | 856 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 7.71 | 6.86 | 6.9 | 342 |
| 1125 | Market Street | Secondary | 4 | 36 | signal | 4.38 | 3.87 | 3.9 | 660 |
| 1768 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 4.00 | 3.02 | 3.0 | 494 |
| 778 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 3.48 | 2.95 | 3.0 | 1168 |
| 4165 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 3.42 | 2.53 | 2.5 | 1172 |
| 1623 | Telegraph Avenue | Secondary | 2 | 61 | signal | 3.40 | 2.59 | 2.6 | 703 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 3.35 | 2.28 | 2.3 | 444 |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 3.35 | 1.59 | 1.6 | 832 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 3.33 | 2.52 | 2.5 | 677 |
| 1770 | Shattuck Avenue | Tertiary | 1 | 86 | two_way_stop | 3.15 | 2.08 | 2.1 | 498 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.15 | 2.46 | 2.5 | 222 |
| 536 | Ashby Avenue | Primary | 2 | 210 | signal | 3.14 | 1.86 | 1.9 | 852 |
| 1066 | Adeline Street | Secondary | 4 | 43 | signal | 3.10 | 2.58 | 2.6 | 576 |
| 2032 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 2.72 | 1.67 | 1.7 | 542 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 2.71 | 1.44 | 1.4 | 1319 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 4.30 | 0.06 | 75 s: 49/16 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 3.91 | 0.18 | 75 s: 15/50 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.85 | 0.14 | 75 s: 47/18 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 3.12 | 0.01 | 75 s: 22/43 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.71 | 0.01 | 75 s: 23/22/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.63 | 0.00 | 75 s: 28/37 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.43 | 0.01 | 75 s: 26/39 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.31 | 0.01 | 75 s: 31/34 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.27 | 0.04 | 75 s: 26/39 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.11 | 0.02 | 75 s: 41/24 |
| 592 | Adeline Street / Ashby Avenue | signal |  | 2.06 | 0.00 | 75 s: 46/19 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 1.99 | 0.00 | 75 s: 19/26/15 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 1.98 | 0.02 | 75 s: 47/18 |
| 346 | 55th Street / Shattuck Avenue | signal |  | 1.97 | 0.05 | 75 s: 27/38 |
| 1084 | Claremont Avenue / Colby Street / Forest Street | signal |  | 1.85 | 0.00 | 147 s: 93/10/29 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 49 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 16 s: Market Street 4L [1125], Market Street 3L [1128]
- node 688: 15 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 50 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 339: 47 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 18 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 455: 22 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 43 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 30: 23 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 22 s: Market Street 2L [772], Market Street 2L [1130]; 15 s: 57th Street 1L [44], 57th Street 1L [1168]

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 706 | 767 |
| Telegraph | S | 10 | 734 | 761 |
| College | N | 3 | 149 | 150 |
| College | S | 3 | 304 | 306 |
| Claremont | N | 6 | 401 | 655 |
| Claremont | S | 7 | 480 | 755 |
| Alcatraz | E | 6 | 360 | 370 |
| Alcatraz | W | 6 | 272 | 277 |
| Hillegass | N | 4 | 48 | 54 |
| Hillegass | S | 4 | 79 | 104 |
| Colby | N | 7 | 54 | 65 |
| Colby | S | 7 | 82 | 109 |
| Martin | E | 2 | 116 | 116 |
| Martin | W | 2 | 178 | 178 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 2995 |
| 955 | Telegraph Avenue / Ward Street | 1501 |
| 1688 | Warren Freeway | 973 |
| 183 | San Pablo Avenue | 837 |
| 266 | Ashby Avenue | 781 |
| 1774 | Claremont Avenue | 342 |
| 771 | Telegraph Avenue | 340 |
| 104 | San Pablo Avenue | 298 |
| 986 | Broadway | 285 |
| 283 | Market Street | 267 |
