# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 14888 veh/h x scale 1 = 14888 veh/h. Run took 20.3 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 15103) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.88 m/s (last 15 min 9.73) | pass |

Overall: **STABLE**. Mean trip delay 85 s, mean trip time 390 s, completed 15144, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1679 | 1 | 1350 | 0 | 9.89 |
| 10 | 1669 | 0 | 2602 | 0 | 9.95 |
| 15 | 1664 | 0 | 3890 | 0 | 10.00 |
| 20 | 1584 | 2 | 5169 | 0 | 10.29 |
| 25 | 1704 | 0 | 6367 | 0 | 9.77 |
| 30 | 1746 | 1 | 7589 | 0 | 9.53 |
| 35 | 1660 | 0 | 8871 | 0 | 9.70 |
| 40 | 1613 | 0 | 10178 | 0 | 10.26 |
| 45 | 1653 | 0 | 11414 | 0 | 10.07 |
| 50 | 1696 | 0 | 12624 | 0 | 10.13 |
| 55 | 1783 | 0 | 13863 | 0 | 9.44 |
| 60 | 1753 | 0 | 15144 | 0 | 9.61 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 13814 | 0.00 | 0.4% | 1.097 | 1.057 | 6.5% | 0.2% | 1.034 | 2.8% | 0.0% | 6.2% | 1703 | 12.4% |
| gate to gate | 7544 | 0.01 | 0.6% | 1.100 | 1.072 | 5.4% | 0.2% | 1.036 | 2.9% | 0.0% | 9.5% | 837 | 9.2% |
| with a local end | 6270 | 0.00 | 0.3% | 1.094 | 1.040 | 7.8% | 0.1% | 1.032 | 2.7% | 0.0% | 2.3% | 867 | 15.5% |
| guided drivers | 6286 | 0.01 | 1.0% | 1.097 | 1.057 | 6.4% | 0.2% | 1.034 | 2.9% | 0.0% | 6.2% | 777 | 12.7% |
| other drivers | 7528 | 0.00 | 0.0% | 1.097 | 1.057 | 6.5% | 0.2% | 1.034 | 2.8% | 0.0% | 6.3% | 927 | 12.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (285 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 838 | 14.0 | 5% |
| freeway to the surface gates | 981 | 3.4 | 1% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 929 | 1% | 5% | 94% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 780 | 1% | 15% | 84% | 0.1 |

## Per-mode results

Offered: 14888 car veh/h; 532 bicycle flows (583/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1753 | 15144 | 390 | |
| Bicycle | 46 | 613 | 305 | |
| Pedestrian | 253 | 1719 | 486 | mean crossing delay 5.5 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 368, bicycle conflicts 457, close passes 444, pedestrian injury-risk index 0.056, bicycle injury-risk index 0.060 (proxy), mean vehicle speed at pedestrian encounters 2.82 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 109 trips (105 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 119 trips (114 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 125 trips (121 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 175 trips (158 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 69% | +22 | 109 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 109 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 5% | -1 | 109 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 21% | -6 | 109 |  |
| Colby Street NB | from | freeway | 47% | 82% | +35 | 119 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 7% | -41 | 119 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 14% | -11 | 119 |  |
| Colby Street NB | to | College Avenue | 3% | 0% | -3 | 119 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 12% | -34 | 125 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 125 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 6% | -10 | 125 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 78% | +21 | 125 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 10% | -33 | 175 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 22% | -24 | 175 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 28% | +6 | 175 |  |
| Colby Street SB | to | freeway | 45% | 63% | +18 | 175 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 9% | -25 | 175 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 627 | 15% | 606 |
| onto freeway | Hillegass Avenue | 12% | 16% | 627 | 17% | 606 |
| onto freeway | Martin Street | 10% | 16% | 627 | 17% | 606 |
| onto freeway | Colby Street | 8% | 14% | 627 | 14% | 606 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 627 | 10% | 606 |
| onto freeway | Benvenue Avenue | 5% | 3% | 627 | 3% | 606 |
| from freeway | College Avenue | 10% | 4% | 886 | 5% | 748 |
| from freeway | Martin Street | 10% | 13% | 886 | 16% | 748 |
| from freeway | Colby Street | 8% | 10% | 886 | 12% | 748 |
| from freeway | Hillegass Avenue | 5% | 7% | 886 | 9% | 748 |
| from freeway | Benvenue Avenue | 3% | 2% | 886 | 2% | 748 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 8.03 | 6.91 | 6.9 | 500 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 5.95 | 4.49 | 4.5 | 404 |
| 1768 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 4.01 | 2.98 | 3.0 | 577 |
| 1125 | Market Street | Secondary | 4 | 36 | signal | 3.96 | 3.51 | 3.5 | 718 |
| 4366 | Claremont Avenue | Secondary | 2 | 113 | signal | 3.78 | 2.43 | 2.4 | 620 |
| 2032 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.59 | 2.45 | 2.5 | 482 |
| 778 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 3.37 | 2.89 | 2.9 | 1159 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 3.33 | 2.25 | 2.2 | 444 |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 3.30 | 1.57 | 1.6 | 977 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.28 | 2.41 | 2.4 | 288 |
| 498 | Sacramento Street | Tertiary | 3 | 55 | signal | 3.21 | 2.06 | 2.1 | 775 |
| 4165 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 3.15 | 2.30 | 2.3 | 1168 |
| 1066 | Adeline Street | Secondary | 4 | 43 | signal | 3.15 | 2.71 | 2.7 | 528 |
| 2064 | Telegraph Avenue | Secondary | 3 | 57 | signal | 3.02 | 1.86 | 1.9 | 780 |
| 3426 | Ashby Avenue | Primary | 1 | 129 | signal | 3.00 | 1.78 | 1.8 | 620 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 4.47 | 0.09 | 75 s: 46/19 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.31 | 0.24 | 75 s: 20/45 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.53 | 0.11 | 75 s: 40/25 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.23 | 0.02 | 75 s: 26/17/17 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 3.02 | 0.00 | 75 s: 16/49 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.78 | 0.01 | 75 s: 23/42 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.50 | 0.05 | 75 s: 27/38 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.35 | 0.04 | 75 s: 24/41 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.31 | 0.10 | 75 s: 42/23 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.28 | 0.00 | 75 s: 26/19/15 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.27 | 0.12 | 75 s: 42/23 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.13 | 0.02 | 75 s: 40/25 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.09 | 0.00 | 75 s: 32/33 |
| 346 | 55th Street / Shattuck Avenue | signal |  | 1.97 | 0.03 | 75 s: 27/38 |
| 1236 | Ashby Avenue / College Avenue | signal |  | 1.92 | 0.03 | 75 s: 40/25 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 46 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 19 s: Market Street 4L [1125], Market Street 3L [1128]
- node 688: 20 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 45 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 339: 40 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 25 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 30: 26 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 17 s: Market Street 2L [772], Market Street 2L [1130]; 17 s: 57th Street 1L [44], 57th Street 1L [1168]
- node 455: 16 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 49 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 653 | 672 |
| Telegraph | S | 10 | 630 | 643 |
| College | N | 3 | 160 | 161 |
| College | S | 3 | 319 | 319 |
| Claremont | N | 6 | 558 | 772 |
| Claremont | S | 7 | 480 | 730 |
| Alcatraz | E | 6 | 395 | 409 |
| Alcatraz | W | 6 | 283 | 323 |
| Hillegass | N | 4 | 60 | 84 |
| Hillegass | S | 4 | 92 | 107 |
| Colby | N | 7 | 72 | 94 |
| Colby | S | 7 | 98 | 119 |
| Martin | E | 2 | 114 | 114 |
| Martin | W | 2 | 124 | 124 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 2973 |
| 955 | Telegraph Avenue / Ward Street | 1458 |
| 1688 | Warren Freeway | 901 |
| 266 | Ashby Avenue | 781 |
| 183 | San Pablo Avenue | 659 |
| 283 | Market Street | 400 |
| 771 | Telegraph Avenue | 340 |
| 104 | San Pablo Avenue | 317 |
| 1774 | Claremont Avenue | 309 |
| 1735 | Grove Shafter Freeway | 263 |
