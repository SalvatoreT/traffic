# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 22203 veh/h x scale 1 = 22203 veh/h. Run took 20.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (3 of 22322) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.67 m/s (last 15 min 9.73) | pass |

Overall: **STABLE**. Mean trip delay 121 s, mean trip time 412 s, completed 21988, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2535 | 5 | 1850 | 0 | 9.86 |
| 10 | 2580 | 1 | 3635 | 0 | 9.36 |
| 15 | 2721 | 3 | 5363 | 0 | 9.30 |
| 20 | 2690 | 3 | 7252 | 0 | 9.59 |
| 25 | 2721 | 5 | 9090 | 0 | 9.81 |
| 30 | 2742 | 3 | 10913 | 0 | 9.66 |
| 35 | 2756 | 2 | 12758 | 0 | 9.63 |
| 40 | 2823 | 2 | 14650 | 0 | 9.74 |
| 45 | 2838 | 3 | 16517 | 0 | 9.91 |
| 50 | 2800 | 4 | 18399 | 0 | 9.77 |
| 55 | 2838 | 5 | 20140 | 0 | 9.70 |
| 60 | 2824 | 3 | 21988 | 0 | 9.72 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20224 | 0.01 | 0.5% | 1.090 | 1.051 | 4.8% | 0.0% | 1.025 | 1.7% | 0.0% | 4.9% | 1880 | 8.7% |
| gate to gate | 7913 | 0.01 | 0.6% | 1.091 | 1.057 | 3.5% | 0.0% | 1.021 | 1.6% | 0.0% | 7.1% | 357 | 10.5% |
| with a local end | 12311 | 0.00 | 0.5% | 1.088 | 1.048 | 5.7% | 0.0% | 1.028 | 1.8% | 0.0% | 3.6% | 1523 | 8.3% |
| guided drivers | 9232 | 0.01 | 1.1% | 1.089 | 1.051 | 4.9% | 0.0% | 1.025 | 1.6% | 0.0% | 5.1% | 859 | 9.0% |
| other drivers | 10992 | 0.00 | 0.0% | 1.090 | 1.051 | 4.8% | 0.0% | 1.025 | 1.8% | 0.0% | 4.8% | 1021 | 8.5% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (369 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1196 | 6.4 | 2% |
| freeway to the surface gates | 1023 | 8.2 | 2% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 928 | 2% | 13% | 84% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1072 | 1% | 23% | 77% | 0.0 |

## Per-mode results

Offered: 22203 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2824 | 21988 | 412 | |
| Bicycle | 50 | 707 | 244 | |
| Pedestrian | 173 | 1282 | 469 | mean crossing delay 8.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 250, bicycle conflicts 425, close passes 578, pedestrian injury-risk index 0.052, bicycle injury-risk index 0.069 (proxy), mean vehicle speed at pedestrian encounters 2.61 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 164 trips (153 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 229 trips (213 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 96 trips (87 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 232 trips (213 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 63% | +16 | 164 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -21 | 164 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 2% | -4 | 164 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 29% | +2 | 164 |  |
| Colby Street NB | from | freeway | 47% | 45% | -2 | 229 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 55% | +7 | 229 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 31% | +6 | 229 |  |
| Colby Street NB | to | College Avenue | 3% | 3% | +0 | 229 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 9% | -37 | 96 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 96 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 5% | -11 | 96 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 68% | +11 | 96 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 15% | -28 | 232 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 8% | -38 | 232 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 18% | -4 | 232 |  |
| Colby Street SB | to | freeway | 45% | 53% | +8 | 232 | within |
| Colby Street SB | to | Forest Street | 34% | 9% | -25 | 232 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 665 | 14% | 600 |
| onto freeway | Hillegass Avenue | 12% | 11% | 665 | 12% | 600 |
| onto freeway | Martin Street | 10% | 14% | 665 | 15% | 600 |
| onto freeway | Colby Street | 8% | 15% | 665 | 16% | 600 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 665 | 10% | 600 |
| onto freeway | Benvenue Avenue | 5% | 5% | 665 | 5% | 600 |
| from freeway | College Avenue | 10% | 8% | 792 | 10% | 636 |
| from freeway | Martin Street | 10% | 10% | 792 | 13% | 636 |
| from freeway | Colby Street | 8% | 12% | 792 | 16% | 636 |
| from freeway | Hillegass Avenue | 5% | 7% | 792 | 8% | 636 |
| from freeway | Benvenue Avenue | 3% | 2% | 792 | 3% | 636 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 20.66 | 13.44 | 13.4 | 968 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 9.33 | 6.69 | 6.7 | 368 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 6.34 | 5.14 | 5.1 | 840 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 6.30 | 5.16 | 5.2 | 746 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 5.23 | 3.17 | 3.2 | 1526 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.08 | 4.05 | 4.0 | 1238 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.05 | 3.01 | 3.0 | 1390 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 4.94 | 3.90 | 3.9 | 889 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.84 | 3.75 | 3.8 | 1075 |
| 4192 | Ashby Avenue | Primary | 2 | 99 | signal | 4.83 | 3.95 | 4.0 | 186 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 4.57 | 4.09 | 4.1 | 854 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 4.41 | 3.36 | 3.4 | 432 |
| 2248 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.33 | 2.24 | 2.2 | 1633 |
| 2303 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.29 | 2.69 | 2.7 | 1261 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 4.20 | 3.60 | 3.6 | 890 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.73 | 0.09 | 105 s: 71/24 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.54 | 0.03 | 90 s: 22/19/34 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.35 | 0.10 | 75 s: 24/41 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.39 | 0.02 | 75 s: 35/30 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.25 | 0.00 | 75 s: 24/41 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.20 | 0.01 | 75 s: 20/25/15 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.98 | 0.00 | 75 s: 42/23 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.95 | 0.01 | 75 s: 18/47 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.74 | 0.06 | 75 s: 40/25 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.48 | 0.10 | 75 s: 50/15 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.48 | 0.00 | 75 s: 24/41 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.45 | 0.04 | 75 s: 32/33 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.40 | 0.00 | 75 s: 33/32 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.27 | 0.00 | 75 s: 49/16 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.24 | 0.00 | 75 s: 42/23 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 71 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 24 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 22 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 24 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 41 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 35 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 30 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 37: 24 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 41 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4109]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 183 | San Pablo Avenue | 1 | 994 |
| 395 | 65th Street / Shattuck Avenue | 1 | 6 |
| 1128 | Alcatraz Avenue / Benvenue Avenue | 1 | 27 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 737 | 810 |
| Telegraph | S | 10 | 619 | 690 |
| College | N | 3 | 223 | 226 |
| College | S | 3 | 364 | 365 |
| Claremont | N | 6 | 388 | 672 |
| Claremont | S | 7 | 396 | 734 |
| Alcatraz | E | 6 | 343 | 368 |
| Alcatraz | W | 6 | 403 | 530 |
| Hillegass | N | 4 | 84 | 109 |
| Hillegass | S | 4 | 58 | 70 |
| Colby | N | 7 | 116 | 138 |
| Colby | S | 7 | 130 | 149 |
| Martin | E | 2 | 104 | 104 |
| Martin | W | 2 | 131 | 131 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3716 |
| 943 | Telegraph Avenue / Ward Street | 1775 |
| 265 | Ashby Avenue | 1242 |
| 1672 | Warren Freeway | 1168 |
| 183 | San Pablo Avenue | 994 |
| 763 | Telegraph Avenue | 525 |
| 275 | Market Street | 489 |
| 184 | Alcatraz Avenue | 442 |
| 971 | Pleasant Valley Avenue | 353 |
| 1756 | Claremont Avenue | 332 |
