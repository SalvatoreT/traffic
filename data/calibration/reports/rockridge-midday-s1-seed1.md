# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15880 veh/h x scale 1 = 15880 veh/h. Run took 16.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 15973) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.02 m/s (last 15 min 9.90) | pass |

Overall: **STABLE**. Mean trip delay 73 s, mean trip time 366 s, completed 16087, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1698 | 0 | 1382 | 0 | 10.12 |
| 10 | 1614 | 0 | 2751 | 0 | 10.01 |
| 15 | 1556 | 0 | 4108 | 0 | 10.17 |
| 20 | 1636 | 2 | 5357 | 0 | 10.04 |
| 25 | 1711 | 2 | 6648 | 0 | 9.91 |
| 30 | 1711 | 1 | 8002 | 0 | 9.95 |
| 35 | 1733 | 2 | 9366 | 0 | 10.14 |
| 40 | 1662 | 0 | 10737 | 0 | 10.08 |
| 45 | 1646 | 2 | 12088 | 0 | 10.11 |
| 50 | 1685 | 0 | 13390 | 0 | 9.89 |
| 55 | 1695 | 4 | 14714 | 0 | 9.76 |
| 60 | 1634 | 1 | 16087 | 0 | 10.05 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14836 | 0.00 | 0.1% | 1.092 | 1.057 | 4.6% | 0.0% | 1.029 | 1.6% | 0.0% | 5.5% | 1368 | 9.7% |
| gate to gate | 5931 | 0.00 | 0.1% | 1.090 | 1.056 | 3.2% | 0.1% | 1.024 | 1.4% | 0.0% | 8.0% | 320 | 11.5% |
| with a local end | 8905 | 0.00 | 0.1% | 1.093 | 1.057 | 5.5% | 0.0% | 1.032 | 1.8% | 0.0% | 3.9% | 1048 | 9.2% |
| guided drivers | 6750 | 0.00 | 0.2% | 1.093 | 1.057 | 4.9% | 0.0% | 1.030 | 1.8% | 0.0% | 5.3% | 610 | 10.8% |
| other drivers | 8086 | 0.00 | 0.0% | 1.091 | 1.056 | 4.3% | 0.0% | 1.028 | 1.5% | 0.0% | 5.7% | 758 | 8.8% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (257 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1061 | 2.8 | 1% |
| freeway to the surface gates | 784 | 7.0 | 3% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 942 | 1% | 16% | 82% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 947 | 1% | 26% | 74% | 0.0 |

## Per-mode results

Offered: 15880 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (1582/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1634 | 16087 | 366 | |
| Bicycle | 14 | 409 | 159 | |
| Pedestrian | 184 | 1536 | 435 | mean crossing delay 7.5 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 230, bicycle conflicts 143, close passes 173, pedestrian injury-risk index 0.048, bicycle injury-risk index 0.069 (proxy), mean vehicle speed at pedestrian encounters 2.48 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 114 trips (110 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 152 trips (141 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 123 trips (114 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 149 trips (137 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 54% | +7 | 114 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -19 | 114 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 4% | -2 | 114 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 25% | -2 | 114 |  |
| Colby Street NB | from | freeway | 47% | 39% | -8 | 152 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 61% | +13 | 152 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 39% | +14 | 152 |  |
| Colby Street NB | to | College Avenue | 3% | 3% | +0 | 152 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 5% | -41 | 123 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 123 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 2% | -14 | 123 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 55% | -2 | 123 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 13% | -30 | 149 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 149 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 15% | -7 | 149 |  |
| Colby Street SB | to | freeway | 45% | 42% | -3 | 149 | within |
| Colby Street SB | to | Forest Street | 34% | 17% | -17 | 149 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 17% | 467 | 20% | 405 |
| onto freeway | Hillegass Avenue | 12% | 14% | 467 | 16% | 405 |
| onto freeway | Martin Street | 10% | 13% | 467 | 15% | 405 |
| onto freeway | Colby Street | 8% | 9% | 467 | 11% | 405 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 6% | 467 | 5% | 405 |
| onto freeway | Benvenue Avenue | 5% | 3% | 467 | 4% | 405 |
| from freeway | College Avenue | 10% | 7% | 600 | 8% | 488 |
| from freeway | Martin Street | 10% | 12% | 600 | 15% | 488 |
| from freeway | Colby Street | 8% | 9% | 600 | 11% | 488 |
| from freeway | Hillegass Avenue | 5% | 6% | 600 | 7% | 488 |
| from freeway | Benvenue Avenue | 3% | 2% | 600 | 2% | 488 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.77 | 4.74 | 4.7 | 754 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 4.55 | 3.12 | 3.1 | 457 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 4.34 | 3.56 | 3.6 | 978 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 4.32 | 3.56 | 3.6 | 595 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 3.54 | 1.86 | 1.9 | 686 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 3.27 | 2.10 | 2.1 | 943 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 3.13 | 2.31 | 2.3 | 521 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 2.99 | 2.20 | 2.2 | 722 |
| 3463 | Tunnel Road | Primary | 2 | 52 | signal | 2.77 | 2.31 | 2.3 | 725 |
| 535 | Ashby Avenue | Primary | 2 | 210 | signal | 2.68 | 1.43 | 1.4 | 780 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 2.53 | 2.19 | 2.2 | 664 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 2.51 | 2.05 | 2.1 | 438 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 2.48 | 2.16 | 2.2 | 676 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 2.47 | 1.63 | 1.6 | 392 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 2.34 | 1.98 | 2.0 | 379 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.08 | 0.01 | 110 s: 34/28/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.16 | 0.02 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.60 | 0.00 | 75 s: 16/49 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.13 | 0.01 | 75 s: 38/27 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.70 | 0.01 | 75 s: 19/26/15 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.38 | 0.00 | 75 s: 16/29/15 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.37 | 0.02 | 75 s: 30/35 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.32 | 0.01 | 75 s: 41/24 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.31 | 0.00 | 75 s: 26/39 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.24 | 0.00 | 75 s: 27/38 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.02 | 0.00 | 75 s: 19/46 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 1.99 | 0.00 | 75 s: 37/28 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 1.97 | 0.01 | 75 s: 50/15 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 1.88 | 0.00 | 75 s: 36/29 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 1.88 | 0.00 | 147 s: 92/10/30 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 16 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 49 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 38 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 27 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 30: 19 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 26 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 859 | 65th Street / Telegraph Avenue | 1 | 66 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 575 | 608 |
| Telegraph | S | 10 | 404 | 419 |
| College | N | 3 | 218 | 222 |
| College | S | 3 | 398 | 398 |
| Claremont | N | 6 | 313 | 472 |
| Claremont | S | 7 | 240 | 428 |
| Alcatraz | E | 6 | 382 | 394 |
| Alcatraz | W | 6 | 218 | 293 |
| Hillegass | N | 4 | 67 | 74 |
| Hillegass | S | 4 | 65 | 78 |
| Colby | N | 7 | 61 | 103 |
| Colby | S | 7 | 71 | 91 |
| Martin | E | 2 | 107 | 107 |
| Martin | W | 2 | 98 | 98 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2531 |
| 1672 | Warren Freeway | 826 |
| 265 | Ashby Avenue | 781 |
| 943 | Telegraph Avenue / Ward Street | 733 |
| 183 | San Pablo Avenue | 608 |
| 974 | Broadway | 469 |
| 763 | Telegraph Avenue | 391 |
| 184 | Alcatraz Avenue | 380 |
| 275 | Market Street | 330 |
| 1756 | Claremont Avenue | 300 |
