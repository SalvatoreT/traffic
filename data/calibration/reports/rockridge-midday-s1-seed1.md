# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15894 veh/h x scale 1 = 15894 veh/h. Run took 32.4 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (3 of 15782) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.12 m/s (last 15 min 10.17) | pass |

Overall: **STABLE**. Mean trip delay 75 s, mean trip time 374 s, completed 15878, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1776 | 0 | 1347 | 0 | 10.06 |
| 10 | 1740 | 0 | 2691 | 0 | 9.94 |
| 15 | 1672 | 1 | 4086 | 0 | 10.13 |
| 20 | 1723 | 4 | 5414 | 0 | 10.25 |
| 25 | 1683 | 1 | 6745 | 0 | 10.06 |
| 30 | 1628 | 0 | 8081 | 0 | 10.23 |
| 35 | 1584 | 0 | 9404 | 0 | 10.15 |
| 40 | 1708 | 2 | 10624 | 0 | 9.98 |
| 45 | 1690 | 0 | 11940 | 0 | 10.20 |
| 50 | 1672 | 1 | 13280 | 0 | 10.13 |
| 55 | 1651 | 0 | 14627 | 0 | 10.22 |
| 60 | 1746 | 3 | 15878 | 0 | 10.15 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14570 | 0.00 | 0.1% | 1.091 | 1.055 | 4.6% | 0.0% | 1.028 | 1.8% | 0.0% | 5.7% | 1338 | 10.1% |
| gate to gate | 6413 | 0.00 | 0.1% | 1.093 | 1.069 | 3.1% | 0.0% | 1.024 | 1.4% | 0.0% | 8.8% | 420 | 4.6% |
| with a local end | 8157 | 0.00 | 0.1% | 1.089 | 1.046 | 5.7% | 0.0% | 1.031 | 2.2% | 0.0% | 3.2% | 917 | 12.6% |
| guided drivers | 6735 | 0.00 | 0.2% | 1.090 | 1.054 | 4.4% | 0.0% | 1.027 | 1.9% | 0.0% | 5.8% | 602 | 11.0% |
| other drivers | 7835 | 0.00 | 0.0% | 1.091 | 1.055 | 4.7% | 0.0% | 1.028 | 1.7% | 0.0% | 5.6% | 736 | 9.3% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (248 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 902 | 5.9 | 2% |
| freeway to the surface gates | 648 | 6.7 | 3% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 900 | 1% | 13% | 86% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 827 | 1% | 25% | 74% | 0.0 |

## Per-mode results

Offered: 15894 car veh/h; 100 bicycle flows (379/h); 2000 pedestrian flows (1580/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1746 | 15878 | 374 | |
| Bicycle | 18 | 369 | 170 | |
| Pedestrian | 213 | 1465 | 443 | mean crossing delay 6.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 194, bicycle conflicts 123, close passes 170, pedestrian injury-risk index 0.052, bicycle injury-risk index 0.076 (proxy), mean vehicle speed at pedestrian encounters 2.63 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Expected = observed block volume times the observed freeway share of the street (the headline share of the targets file). Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Expected through (veh/h) | Modeled through (veh/h) | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 106 trips (103 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 126 trips (124 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 97 trips (86 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 139 trips (128 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 57% | +10 | 106 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 106 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 6% | -0 | 106 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 28% | +1 | 106 |  |
| Colby Street NB | from | freeway | 47% | 63% | +16 | 126 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 12% | -36 | 126 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 19% | -6 | 126 |  |
| Colby Street NB | to | College Avenue | 3% | 0% | -3 | 126 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 7% | -39 | 97 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 97 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 1% | -15 | 97 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 77% | +20 | 97 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 25% | -18 | 139 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 19% | -27 | 139 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 14% | -8 | 139 |  |
| Colby Street SB | to | freeway | 45% | 67% | +22 | 139 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 12% | -22 | 139 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 18% | 456 | 21% | 346 |
| onto freeway | Hillegass Avenue | 12% | 12% | 456 | 16% | 346 |
| onto freeway | Martin Street | 10% | 17% | 456 | 19% | 346 |
| onto freeway | Colby Street | 8% | 16% | 456 | 21% | 346 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 456 | 8% | 346 |
| onto freeway | Benvenue Avenue | 5% | 4% | 456 | 5% | 346 |
| from freeway | College Avenue | 10% | 8% | 576 | 6% | 438 |
| from freeway | Martin Street | 10% | 16% | 576 | 21% | 438 |
| from freeway | Colby Street | 8% | 12% | 576 | 16% | 438 |
| from freeway | Hillegass Avenue | 5% | 7% | 576 | 9% | 438 |
| from freeway | Benvenue Avenue | 3% | 1% | 576 | 2% | 438 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 4.73 | 2.16 | 2.2 | 919 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.70 | 3.86 | 3.9 | 654 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 3.63 | 2.99 | 3.0 | 628 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.63 | 2.57 | 2.6 | 343 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 3.54 | 2.78 | 2.8 | 1001 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 3.22 | 2.67 | 2.7 | 497 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 3.06 | 2.20 | 2.2 | 582 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 2.98 | 1.96 | 2.0 | 850 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 2.93 | 2.13 | 2.1 | 748 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.90 | 2.37 | 2.4 | 415 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 2.76 | 1.76 | 1.8 | 575 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 2.72 | 2.37 | 2.4 | 600 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 2.61 | 2.22 | 2.2 | 715 |
| 3463 | Tunnel Road | Primary | 2 | 52 | signal | 2.61 | 2.16 | 2.2 | 742 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 2.45 | 1.34 | 1.3 | 1055 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.57 | 0.01 | 110 s: 34/28/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.24 | 0.06 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.77 | 0.01 | 75 s: 16/49 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.90 | 0.01 | 75 s: 33/32 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.72 | 0.01 | 75 s: 15/30/15 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.52 | 0.02 | 75 s: 21/44 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.44 | 0.00 | 75 s: 34/31 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.43 | 0.00 | 75 s: 25/40 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.32 | 0.01 | 75 s: 15/30/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.14 | 0.00 | 75 s: 26/39 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.07 | 0.00 | 75 s: 21/44 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.02 | 0.01 | 75 s: 39/26 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 1.98 | 0.00 | 147 s: 89/10/33 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 1.98 | 0.03 | 75 s: 49/16 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 1.93 | 0.00 | 75 s: 31/34 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 16 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 49 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 33 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 32 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 30: 15 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 30 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 1 | 104 |
| 1089 | 63rd Street / College Avenue | 1 | 78 |
| 1093 | College Avenue / Harwood Avenue | 1 | 21 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 590 | 620 |
| Telegraph | S | 10 | 379 | 396 |
| College | N | 3 | 191 | 191 |
| College | S | 3 | 462 | 463 |
| Claremont | N | 6 | 287 | 440 |
| Claremont | S | 7 | 194 | 389 |
| Alcatraz | E | 6 | 384 | 418 |
| Alcatraz | W | 6 | 276 | 289 |
| Hillegass | N | 4 | 70 | 77 |
| Hillegass | S | 4 | 62 | 71 |
| Colby | N | 7 | 77 | 88 |
| Colby | S | 7 | 84 | 97 |
| Martin | E | 2 | 98 | 98 |
| Martin | W | 2 | 114 | 114 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2641 |
| 943 | Telegraph Avenue / Ward Street | 1157 |
| 1672 | Warren Freeway | 960 |
| 265 | Ashby Avenue | 781 |
| 183 | San Pablo Avenue | 712 |
| 104 | San Pablo Avenue | 417 |
| 763 | Telegraph Avenue | 406 |
| 974 | Broadway | 364 |
| 275 | Market Street | 320 |
| 276 | Martin Luther King Junior Way | 235 |
