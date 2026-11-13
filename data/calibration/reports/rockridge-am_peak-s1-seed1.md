# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21934 veh/h x scale 1 = 21934 veh/h. Run took 23.7 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (3 of 22150) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.54 m/s (last 15 min 8.37) | pass |

Overall: **STABLE**. Mean trip delay 140 s, mean trip time 436 s, completed 21885, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2607 | 1 | 1854 | 0 | 9.52 |
| 10 | 2633 | 1 | 3649 | 0 | 8.87 |
| 15 | 2599 | 1 | 5500 | 0 | 8.61 |
| 20 | 2721 | 0 | 7254 | 0 | 8.65 |
| 25 | 2659 | 1 | 9121 | 0 | 8.55 |
| 30 | 2819 | 4 | 10818 | 0 | 8.09 |
| 35 | 2896 | 4 | 12571 | 0 | 8.13 |
| 40 | 2961 | 2 | 14325 | 0 | 8.64 |
| 45 | 2933 | 11 | 16217 | 0 | 8.43 |
| 50 | 2945 | 22 | 18136 | 0 | 8.38 |
| 55 | 2887 | 5 | 20047 | 0 | 8.48 |
| 60 | 2838 | 3 | 21885 | 0 | 8.26 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19995 | 0.04 | 3.9% | 1.106 | 1.070 | 7.0% | 0.2% | 1.042 | 3.6% | 0.0% | 6.2% | 1967 | 10.6% |
| gate to gate | 7490 | 0.06 | 5.7% | 1.109 | 1.083 | 5.8% | 0.0% | 1.040 | 3.7% | 0.0% | 9.3% | 446 | 11.6% |
| with a local end | 12505 | 0.03 | 2.8% | 1.104 | 1.059 | 7.8% | 0.3% | 1.043 | 3.6% | 0.0% | 4.3% | 1521 | 10.3% |
| guided drivers | 9232 | 0.09 | 8.0% | 1.108 | 1.071 | 7.5% | 0.2% | 1.044 | 3.9% | 0.0% | 6.4% | 905 | 10.5% |
| other drivers | 10763 | 0.00 | 0.3% | 1.104 | 1.068 | 6.7% | 0.2% | 1.040 | 3.4% | 0.0% | 6.0% | 1062 | 10.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (404 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1189 | 17.3 | 4% |
| freeway to the surface gates | 736 | 3.5 | 1% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1011 | 1% | 12% | 87% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 941 | 2% | 22% | 76% | 0.1 |

## Per-mode results

Offered: 21934 car veh/h; 1500 bicycle flows (1076/h); 2000 pedestrian flows (1544/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2838 | 21885 | 436 | |
| Bicycle | 98 | 1084 | 341 | |
| Pedestrian | 184 | 1487 | 481 | mean crossing delay 7.6 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 240, bicycle conflicts 1289, close passes 1212, pedestrian injury-risk index 0.047, bicycle injury-risk index 0.061 (proxy), mean vehicle speed at pedestrian encounters 2.40 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 156 trips (149 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 226 trips (218 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 120 trips (117 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 255 trips (239 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 59% | +12 | 156 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 3% | -18 | 156 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 7% | +1 | 156 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 12% | -15 | 156 |  |
| Colby Street NB | from | freeway | 47% | 55% | +8 | 226 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 11% | -37 | 226 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 18% | -7 | 226 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 226 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 8% | -38 | 120 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 120 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 6% | -10 | 120 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 52% | -5 | 120 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 11% | -32 | 255 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 21% | -25 | 255 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 20% | -2 | 255 |  |
| Colby Street SB | to | freeway | 45% | 59% | +14 | 255 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 10% | -24 | 255 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 676 | 17% | 589 |
| onto freeway | Hillegass Avenue | 12% | 10% | 676 | 12% | 589 |
| onto freeway | Martin Street | 10% | 24% | 676 | 25% | 589 |
| onto freeway | Colby Street | 8% | 19% | 676 | 22% | 589 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 24% | 676 | 21% | 589 |
| onto freeway | Benvenue Avenue | 5% | 3% | 676 | 4% | 589 |
| from freeway | College Avenue | 10% | 6% | 898 | 7% | 668 |
| from freeway | Martin Street | 10% | 17% | 898 | 23% | 668 |
| from freeway | Colby Street | 8% | 11% | 898 | 15% | 668 |
| from freeway | Hillegass Avenue | 5% | 9% | 898 | 12% | 668 |
| from freeway | Benvenue Avenue | 3% | 2% | 898 | 2% | 668 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 28.34 | 23.06 | 23.1 | 560 |
| 4160 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 11.37 | 8.70 | 8.7 | 577 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 10.38 | 8.65 | 8.6 | 875 |
| 1001 | Adeline Street | Secondary | 3 | 121 | two_way_stop | 8.87 | 6.87 | 6.9 | 673 |
| 1002 | Adeline Street | Secondary | 3 | 71 | uncontrolled | 8.55 | 6.97 | 7.0 | 595 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 8.37 | 6.90 | 6.9 | 286 |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 7.46 | 0.47 | 0.5 | 1525 |
| 1116 | Market Street | Tertiary | 2 | 87 | uncontrolled | 7.40 | 6.42 | 6.4 | 323 |
| 1843 | 61st Street | Residential | 1 | 277 | two_way_stop | 7.31 | 6.13 | 6.1 | 125 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.13 | 5.96 | 6.0 | 596 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 7.11 | 6.03 | 6.0 | 1115 |
| 999 | Sacramento Street | Tertiary | 2 | 102 | two_way_stop | 6.62 | 4.38 | 4.4 | 1054 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 6.59 | 5.33 | 5.3 | 712 |
| 1123 | Alcatraz Avenue | Tertiary | 1 | 299 | two_way_stop | 6.49 | 5.02 | 5.0 | 287 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 6.23 | 4.42 | 4.4 | 218 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.44 | 0.06 | 90 s: 22/19/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 5.28 | 0.15 | 120 s: 95/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.78 | 0.88 | 75 s: 41/24 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.83 | 0.08 | 75 s: 23/42 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.62 | 0.02 | 75 s: 15/30/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.06 | 0.08 | 75 s: 32/33 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 3.04 | 0.03 | 75 s: 44/21 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.61 | 0.00 | 75 s: 19/46 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.60 | 0.14 | 75 s: 50/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.59 | 0.00 | 75 s: 32/33 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.53 | 0.01 | 75 s: 43/22 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 2.45 | 0.02 | 75 s: 34/31 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.40 | 0.00 | 75 s: 50/15 |
| 584 | Adeline Street / Ashby Avenue | signal |  | 2.35 | 0.00 | 75 s: 46/19 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.31 | 0.02 | 75 s: 48/17 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 22 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 95 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 41 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 24 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 479: 23 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 42 s: Stanford Avenue 1L [4139]
- node 30: 15 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 30 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1672 | Warren Freeway | 2 | 1253 |
| 1756 | Claremont Avenue | 1 | 393 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 844 | 883 |
| Telegraph | S | 10 | 840 | 1038 |
| College | N | 3 | 186 | 186 |
| College | S | 3 | 526 | 526 |
| Claremont | N | 6 | 360 | 640 |
| Claremont | S | 7 | 403 | 762 |
| Alcatraz | E | 6 | 385 | 479 |
| Alcatraz | W | 6 | 324 | 398 |
| Hillegass | N | 4 | 92 | 118 |
| Hillegass | S | 4 | 79 | 80 |
| Colby | N | 7 | 118 | 138 |
| Colby | S | 7 | 139 | 160 |
| Martin | E | 2 | 190 | 190 |
| Martin | W | 2 | 185 | 185 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3661 |
| 943 | Telegraph Avenue / Ward Street | 1852 |
| 1672 | Warren Freeway | 1253 |
| 265 | Ashby Avenue | 1242 |
| 183 | San Pablo Avenue | 1011 |
| 763 | Telegraph Avenue | 483 |
| 974 | Broadway | 463 |
| 1756 | Claremont Avenue | 393 |
| 275 | Market Street | 356 |
| 104 | San Pablo Avenue | 331 |
