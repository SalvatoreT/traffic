# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.60 (min 0.00, max 5.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.32 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 1 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 2.00 | 1.63 | 0.00 | 5.00 | 0.83 to 3.17 |
| health | gridlock removals per hour | veh/h | 2.00 | 1.63 | 0.00 | 5.00 | 0.83 to 3.17 |
| health | entry backlog | % of spawned | 0.68 | 0.21 | 0.36 | 0.89 | 0.54 to 0.83 |
| health | backlog growth in the second half of the run | points of spawned | 0.39 | 0.19 | 0.07 | 0.70 | 0.25 to 0.52 |
| health | completed trips | trips | 25878.10 | 181.20 | 25574.00 | 26136.00 | 25748.49 to 26007.71 |
| health | arterial mean speed | m/s | 8.32 | 0.12 | 8.19 | 8.56 | 8.24 to 8.41 |
| health | arterial mean speed, last 15 min | m/s | 8.10 | 0.20 | 7.84 | 8.49 | 7.96 to 8.24 |
| junction recovery | courtesy admissions per hour | veh/h | 278.40 | 27.75 | 237.00 | 331.00 | 258.55 to 298.25 |
| junction recovery | yield fallback admissions per hour | veh/h | 110.00 | 12.63 | 84.00 | 130.00 | 100.96 to 119.04 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.20 | 0.63 | 0.00 | 2.00 | -0.25 to 0.65 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.60 | 1.58 | 0.00 | 5.00 | -0.53 to 1.73 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.60 | 1.58 | 0.00 | 5.00 | -0.53 to 1.73 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 1.40 | 1.17 | 0.00 | 3.00 | 0.56 to 2.24 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 1.80 | 1.14 | 0.00 | 4.00 | 0.99 to 2.61 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 40.88 | 5.27 | 33.50 | 49.56 | 37.11 to 44.65 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.5 | 1.1 | 6.5 | 10.6 | 7.7 to 9.3 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 33.96 | 3.79 | 28.47 | 39.21 | 31.25 to 36.67 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.1 | 1.0 | 5.9 | 8.8 | 6.4 to 7.8 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 42.00 | 5.58 | 38.00 | 57.00 | 38.01 to 45.99 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1506.90 | 21.71 | 1463.00 | 1551.00 | 1491.37 to 1522.43 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 72.40 | 8.15 | 58.00 | 86.00 | 66.57 to 78.23 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1324.00 | 30.70 | 1278.00 | 1371.00 | 1302.04 to 1345.96 |
| headline share | Hillegass Avenue NB from freeway | % | 52.8 | 3.5 | 46.3 | 58.8 | 50.3 to 55.3 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.9 | 1.2 | 2.1 | 6.0 | 3.0 to 4.8 |
| share | Hillegass Avenue NB to College Avenue | % | 15.8 | 1.3 | 12.9 | 17.6 | 14.8 to 16.7 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 27.7 | 2.5 | 23.8 | 31.2 | 26.0 to 29.5 |
| headline share | Colby Street NB from freeway | % | 50.1 | 3.2 | 46.1 | 54.2 | 47.8 to 52.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 45.5 | 4.0 | 39.3 | 51.9 | 42.7 to 48.4 |
| share | Colby Street NB to Telegraph Avenue | % | 33.7 | 2.8 | 29.9 | 36.9 | 31.7 to 35.7 |
| share | Colby Street NB to College Avenue | % | 5.7 | 1.4 | 3.5 | 8.7 | 4.7 to 6.7 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 33.6 | 3.0 | 27.0 | 37.6 | 31.5 to 35.8 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 7.1 | 2.1 | 4.0 | 10.9 | 5.6 to 8.6 |
| share | Hillegass Avenue SB from College Avenue | % | 21.1 | 3.5 | 17.7 | 27.6 | 18.6 to 23.6 |
| headline share | Hillegass Avenue SB to freeway | % | 59.8 | 4.9 | 50.9 | 66.0 | 56.3 to 63.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 23.2 | 2.0 | 20.2 | 25.9 | 21.8 to 24.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 12.9 | 2.4 | 9.9 | 17.8 | 11.2 to 14.6 |
| share | Colby Street SB from Telegraph Avenue | % | 21.5 | 1.8 | 19.5 | 24.7 | 20.2 to 22.8 |
| headline share | Colby Street SB to freeway | % | 38.6 | 3.2 | 32.9 | 42.7 | 36.4 to 40.9 |
| share | Colby Street SB to Forest Street | % | 22.8 | 3.2 | 18.9 | 27.5 | 20.5 to 25.1 |
| ramp share | onto freeway via College Avenue | % | 15.0 | 1.6 | 11.7 | 17.2 | 13.9 to 16.1 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.5 | 1.2 | 13.0 | 16.9 | 14.6 to 16.4 |
| ramp share | onto freeway via Martin Street | % | 12.5 | 2.6 | 8.2 | 16.0 | 10.6 to 14.4 |
| ramp share | onto freeway via Colby Street | % | 11.3 | 1.4 | 9.8 | 14.5 | 10.3 to 12.4 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 11.7 | 1.2 | 9.6 | 13.4 | 10.9 to 12.5 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.9 | 0.7 | 4.0 | 6.6 | 4.4 to 5.4 |
| ramp share | from freeway via College Avenue | % | 9.2 | 1.1 | 7.1 | 11.1 | 8.5 to 10.0 |
| ramp share | from freeway via Martin Street | % | 11.6 | 0.9 | 10.2 | 12.6 | 11.0 to 12.2 |
| ramp share | from freeway via Colby Street | % | 13.0 | 1.5 | 10.9 | 15.4 | 11.9 to 14.1 |
| ramp share | from freeway via Hillegass Avenue | % | 8.5 | 1.1 | 7.1 | 10.3 | 7.7 to 9.2 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.7 | 1.3 | 3.4 | 1.9 to 2.9 |
| corridor flow | Telegraph N median link flow | veh/h | 1041.12 | 47.49 | 951.60 | 1106.40 | 1007.15 to 1075.09 |
| corridor flow | Telegraph S median link flow | veh/h | 1139.16 | 50.66 | 1078.80 | 1248.00 | 1102.92 to 1175.40 |
| corridor flow | College N median link flow | veh/h | 415.44 | 34.11 | 370.80 | 469.20 | 391.04 to 439.84 |
| corridor flow | College S median link flow | veh/h | 559.20 | 32.71 | 508.80 | 604.80 | 535.80 to 582.60 |
| corridor flow | Claremont N median link flow | veh/h | 466.44 | 49.29 | 384.00 | 582.00 | 431.18 to 501.70 |
| corridor flow | Claremont S median link flow | veh/h | 345.60 | 34.57 | 296.40 | 415.20 | 320.87 to 370.33 |
| corridor flow | Alcatraz E median link flow | veh/h | 501.36 | 30.88 | 446.40 | 541.20 | 479.27 to 523.45 |
| corridor flow | Alcatraz W median link flow | veh/h | 345.00 | 16.92 | 314.40 | 367.20 | 332.90 to 357.10 |
| corridor flow | Hillegass N median link flow | veh/h | 125.16 | 7.90 | 116.40 | 141.60 | 119.51 to 130.81 |
| corridor flow | Hillegass S median link flow | veh/h | 130.20 | 14.35 | 111.60 | 163.20 | 119.94 to 140.46 |
| corridor flow | Colby N median link flow | veh/h | 172.80 | 7.50 | 159.60 | 186.00 | 167.43 to 178.17 |
| corridor flow | Colby S median link flow | veh/h | 158.64 | 16.46 | 135.60 | 189.60 | 146.87 to 170.41 |
| corridor flow | Martin E median link flow | veh/h | 119.52 | 21.31 | 93.60 | 152.40 | 104.28 to 134.76 |
| corridor flow | Martin W median link flow | veh/h | 144.60 | 31.88 | 105.60 | 213.60 | 121.80 to 167.40 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 150 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 64 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 30 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 12 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 40 | above |
| Intents listed, together | | 101 (71 to 131) | 145 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 31 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 64.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 33.7 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 6.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.7 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.8 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.4 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| other pairs | | 8.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 123 veh/h; Claremont Avenue 10 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; SR-24 2 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 92 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 25 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 32 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 26 | above |
| Intents listed, together | | 43 (20 to 68) | 89 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 18.8 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 18.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.4 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.7 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.8 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.7 | none near the study area |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.5 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.5 | SR-24 |
| other pairs | | 14.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 43 veh/h; SR-24 20 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 119 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 40 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 55 | within |
| Intents listed, together | | 87 (78 to 110) | 96 | |
| Other through cars (no intent listed) | | | 23 | |

Model through cars by origin and destination group (largest 12 of 32 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.8 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.8 | Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 13.2 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.5 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.3 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.2 | Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.8 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.8 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.6 | none near the study area |
| other pairs | | 4.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 70 veh/h; Claremont Avenue then SR-24 17 veh/h; Alcatraz Avenue then College Avenue 13 veh/h; College Avenue then Claremont Avenue then SR-24 10 veh/h; Claremont Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 111 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 15 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 38 | above |
| Intents listed, together | | 46 (39 to 72) | 71 | |
| Other through cars (no intent listed) | | | 40 | |

Model through cars by origin and destination group (largest 12 of 51 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 14.2 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.1 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.4 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.2 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.7 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.3 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.6 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 2.4 | Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.1 | SR-24 |
| other pairs | | 17.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 49 veh/h; Alcatraz Avenue then College Avenue 14 veh/h; none near the study area 12 veh/h; Claremont Avenue then SR-24 11 veh/h; SR-24 9 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h.

### Study area, all residential and service streets

Model: 746 through cars per hour.

Model through cars by origin and destination group (largest 12 of 96 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 92.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 78.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 75.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 48.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 48.2 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 31.8 | Alcatraz Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.6 | Telegraph Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.0 | Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.1 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.5 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 19.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 18.9 | Claremont Avenue |
| other pairs | | 239.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 437 veh/h; none near the study area 67 veh/h; Claremont Avenue 60 veh/h; Alcatraz Avenue then College Avenue 32 veh/h; SR-24 30 veh/h; Telegraph Avenue then Claremont Avenue 30 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 157; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 141; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 124; Telegraph Ave from the north (Berkeley) 68; West Oakland to the southwest (Adeline St, Market St) 44; Ashby Ave from the west (Emeryville and I-80) 41; Emeryville and West Oakland streets (55th to 67th Streets) 38; Telegraph Ave to the south (downtown Oakland) 30; Claremont Ave and Tunnel Rd toward the hills 25; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 23.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 211; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 134; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 118; Telegraph Ave from the north (Berkeley) 104; Claremont Ave and Tunnel Rd toward the hills 47; College Ave from the north (Berkeley) 46; Emeryville and West Oakland streets (55th to 67th Streets) 19; Shattuck Ave from the north (Berkeley) 19; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 10; Telegraph Ave to the south (downtown Oakland) 10.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
