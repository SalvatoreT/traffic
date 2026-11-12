# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15341 veh/h x scale 1 = 15341 veh/h. Run took 16.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 15477) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.94 m/s (last 15 min 10.00) | pass |

Overall: **STABLE**. Mean trip delay 83 s, mean trip time 383 s, completed 15691, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1752 | 1 | 1357 | 0 | 9.27 |
| 10 | 1762 | 1 | 2644 | 0 | 9.68 |
| 15 | 1723 | 0 | 3980 | 0 | 9.82 |
| 20 | 1660 | 2 | 5287 | 0 | 9.98 |
| 25 | 1668 | 2 | 6593 | 0 | 10.41 |
| 30 | 1691 | 0 | 7848 | 0 | 10.20 |
| 35 | 1741 | 1 | 9151 | 0 | 9.85 |
| 40 | 1671 | 0 | 10515 | 0 | 10.07 |
| 45 | 1680 | 0 | 11795 | 0 | 10.17 |
| 50 | 1693 | 0 | 13112 | 0 | 10.08 |
| 55 | 1666 | 0 | 14416 | 0 | 9.97 |
| 60 | 1636 | 0 | 15691 | 0 | 9.96 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14345 | 0.00 | 0.3% | 1.097 | 1.057 | 6.5% | 0.1% | 1.032 | 2.5% | 0.0% | 6.4% | 1765 | 12.9% |
| gate to gate | 7703 | 0.00 | 0.4% | 1.102 | 1.076 | 5.6% | 0.1% | 1.034 | 2.3% | 0.0% | 9.9% | 801 | 13.1% |
| with a local end | 6642 | 0.00 | 0.1% | 1.090 | 1.031 | 7.6% | 0.1% | 1.030 | 2.7% | 0.0% | 2.2% | 964 | 12.8% |
| guided drivers | 6587 | 0.01 | 0.6% | 1.096 | 1.056 | 6.3% | 0.1% | 1.032 | 2.4% | 0.0% | 6.2% | 828 | 12.7% |
| other drivers | 7758 | 0.00 | 0.0% | 1.097 | 1.058 | 6.6% | 0.1% | 1.032 | 2.6% | 0.0% | 6.5% | 938 | 13.1% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (300 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 855 | 8.8 | 3% |
| freeway to the surface gates | 1062 | 11.9 | 4% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 915 | 1% | 5% | 94% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 828 | 2% | 17% | 81% | 0.1 |

## Per-mode results

Offered: 15341 car veh/h; 532 bicycle flows (583/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1636 | 15691 | 383 | |
| Bicycle | 43 | 575 | 290 | |
| Pedestrian | 226 | 1729 | 480 | mean crossing delay 5.4 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 441, bicycle conflicts 490, close passes 387, pedestrian injury-risk index 0.056, bicycle injury-risk index 0.061 (proxy), mean vehicle speed at pedestrian encounters 2.80 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 92 trips (87 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 149 trips (144 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 113 trips (106 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 175 trips (156 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 73% | +26 | 92 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 92 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 3% | -3 | 92 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 26% | -1 | 92 |  |
| Colby Street NB | from | freeway | 47% | 82% | +35 | 149 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 7% | -41 | 149 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 19% | -6 | 149 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 149 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 8% | -38 | 113 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 3% | -23 | 113 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 6% | -10 | 113 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 81% | +24 | 113 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 9% | -34 | 175 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 30% | -16 | 175 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 21% | -1 | 175 |  |
| Colby Street SB | to | freeway | 45% | 67% | +22 | 175 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 10% | -24 | 175 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 616 | 13% | 596 |
| onto freeway | Hillegass Avenue | 12% | 13% | 616 | 14% | 596 |
| onto freeway | Martin Street | 10% | 15% | 616 | 15% | 596 |
| onto freeway | Colby Street | 8% | 15% | 616 | 15% | 596 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 14% | 616 | 10% | 596 |
| onto freeway | Benvenue Avenue | 5% | 4% | 616 | 5% | 596 |
| from freeway | College Avenue | 10% | 4% | 1028 | 4% | 899 |
| from freeway | Martin Street | 10% | 14% | 1028 | 16% | 899 |
| from freeway | Colby Street | 8% | 10% | 1028 | 12% | 899 |
| from freeway | Hillegass Avenue | 5% | 6% | 1028 | 7% | 899 |
| from freeway | Benvenue Avenue | 3% | 1% | 1028 | 1% | 899 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 8.12 | 7.12 | 7.1 | 412 |
| 1125 | Market Street | Secondary | 4 | 36 | signal | 4.96 | 4.45 | 4.4 | 551 |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 3.38 | 1.62 | 1.6 | 904 |
| 2032 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.36 | 2.05 | 2.0 | 601 |
| 778 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 3.29 | 2.81 | 2.8 | 1152 |
| 1066 | Adeline Street | Secondary | 4 | 43 | signal | 3.20 | 2.66 | 2.7 | 582 |
| 498 | Sacramento Street | Tertiary | 3 | 55 | signal | 3.17 | 2.22 | 2.2 | 787 |
| 1768 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 3.13 | 2.05 | 2.1 | 666 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 3.09 | 2.23 | 2.2 | 355 |
| 536 | Ashby Avenue | Primary | 2 | 210 | signal | 3.08 | 1.75 | 1.7 | 827 |
| 1054 | Sacramento Street | Tertiary | 3 | 40 | signal | 3.07 | 2.30 | 2.3 | 827 |
| 1128 | Market Street | Tertiary | 3 | 31 | signal | 3.05 | 2.81 | 2.8 | 354 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 2.99 | 1.64 | 1.6 | 1391 |
| 1623 | Telegraph Avenue | Secondary | 2 | 61 | signal | 2.97 | 2.27 | 2.3 | 605 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.93 | 2.26 | 2.3 | 536 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 4.69 | 0.07 | 75 s: 50/15 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.38 | 0.19 | 75 s: 20/45 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 3.75 | 0.02 | 75 s: 18/47 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.43 | 0.16 | 75 s: 40/25 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.70 | 0.02 | 75 s: 20/25/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.68 | 0.01 | 75 s: 30/35 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.58 | 0.00 | 75 s: 24/41 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.37 | 0.05 | 75 s: 22/43 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.31 | 0.00 | 75 s: 34/31 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.23 | 0.03 | 75 s: 35/30 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.20 | 0.01 | 75 s: 46/19 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.13 | 0.00 | 75 s: 23/22/15 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 1.97 | 0.00 | 75 s: 24/41 |
| 710 | Aileen Street / Telegraph Avenue | signal |  | 1.93 | 0.00 | 75 s: 33/32 |
| 592 | Adeline Street / Ashby Avenue | signal |  | 1.93 | 0.00 | 75 s: 36/29 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 688: 20 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 45 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 455: 18 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 47 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 339: 40 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 25 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 30: 20 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 25 s: Market Street 2L [772], Market Street 2L [1130]; 15 s: 57th Street 1L [44], 57th Street 1L [1168]

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 704 | 743 |
| Telegraph | S | 10 | 646 | 678 |
| College | N | 3 | 132 | 133 |
| College | S | 3 | 294 | 300 |
| Claremont | N | 6 | 439 | 721 |
| Claremont | S | 7 | 451 | 758 |
| Alcatraz | E | 6 | 384 | 389 |
| Alcatraz | W | 6 | 308 | 358 |
| Hillegass | N | 4 | 62 | 66 |
| Hillegass | S | 4 | 83 | 104 |
| Colby | N | 7 | 88 | 120 |
| Colby | S | 7 | 103 | 119 |
| Martin | E | 2 | 106 | 106 |
| Martin | W | 2 | 163 | 163 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 3026 |
| 955 | Telegraph Avenue / Ward Street | 1499 |
| 1688 | Warren Freeway | 945 |
| 266 | Ashby Avenue | 781 |
| 183 | San Pablo Avenue | 719 |
| 1774 | Claremont Avenue | 346 |
| 771 | Telegraph Avenue | 340 |
| 104 | San Pablo Avenue | 336 |
| 283 | Market Street | 326 |
| 986 | Broadway | 270 |
