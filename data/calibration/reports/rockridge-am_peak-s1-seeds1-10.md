# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.59 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.03 | 0.00 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.01 | -0.01 | 0.03 | -0.00 to 0.01 |
| health | completed trips | trips | 21801.50 | 164.36 | 21480.00 | 22130.00 | 21683.93 to 21919.07 |
| health | arterial mean speed | m/s | 9.59 | 0.06 | 9.50 | 9.72 | 9.55 to 9.64 |
| health | arterial mean speed, last 15 min | m/s | 9.61 | 0.12 | 9.49 | 9.82 | 9.53 to 9.70 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 19.70 | 2.84 | 14.95 | 23.90 | 17.66 to 21.73 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.0 | 0.8 | 4.7 | 7.2 | 5.4 to 6.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.14 | 3.15 | 17.21 | 27.46 | 18.88 to 23.39 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.4 | 0.8 | 5.1 | 8.0 | 5.8 to 7.0 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 34.20 | 5.18 | 28.00 | 43.00 | 30.49 to 37.91 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1079.20 | 30.49 | 1021.00 | 1117.00 | 1057.39 to 1101.01 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 31.30 | 6.78 | 21.00 | 41.00 | 26.45 to 36.15 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1232.10 | 42.37 | 1168.00 | 1290.00 | 1201.79 to 1262.41 |
| headline share | Hillegass Avenue NB from freeway | % | 54.1 | 3.0 | 48.5 | 59.4 | 51.9 to 56.2 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 8.2 | 1.8 | 6.0 | 11.4 | 6.9 to 9.5 |
| share | Hillegass Avenue NB to College Avenue | % | 13.0 | 2.5 | 7.3 | 15.8 | 11.2 to 14.8 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 29.4 | 3.6 | 24.7 | 35.9 | 26.8 to 32.0 |
| headline share | Colby Street NB from freeway | % | 45.6 | 3.4 | 40.0 | 53.0 | 43.1 to 48.0 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 47.2 | 2.5 | 43.9 | 51.2 | 45.4 to 49.0 |
| share | Colby Street NB to Telegraph Avenue | % | 37.3 | 3.7 | 31.9 | 42.6 | 34.6 to 39.9 |
| share | Colby Street NB to College Avenue | % | 2.9 | 1.1 | 0.4 | 4.8 | 2.1 to 3.7 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 22.0 | 3.9 | 17.8 | 27.8 | 19.2 to 24.8 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.4 | 1.1 | 0.0 | 4.0 | 0.6 to 2.2 |
| share | Hillegass Avenue SB from College Avenue | % | 9.5 | 2.7 | 5.0 | 13.1 | 7.6 to 11.4 |
| headline share | Hillegass Avenue SB to freeway | % | 65.2 | 3.2 | 60.7 | 70.4 | 62.9 to 67.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 19.4 | 2.8 | 16.3 | 23.8 | 17.4 to 21.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 7.0 | 1.4 | 5.0 | 9.3 | 6.0 to 7.9 |
| share | Colby Street SB from Telegraph Avenue | % | 14.0 | 2.5 | 9.5 | 17.5 | 12.2 to 15.8 |
| headline share | Colby Street SB to freeway | % | 54.7 | 2.3 | 50.9 | 57.8 | 53.1 to 56.4 |
| share | Colby Street SB to Forest Street | % | 9.9 | 1.4 | 8.2 | 11.8 | 8.9 to 10.8 |
| ramp share | onto freeway via College Avenue | % | 16.6 | 1.5 | 13.5 | 18.6 | 15.5 to 17.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.0 | 0.9 | 12.6 | 15.9 | 13.4 to 14.7 |
| ramp share | onto freeway via Martin Street | % | 13.9 | 2.0 | 9.9 | 16.3 | 12.4 to 15.3 |
| ramp share | onto freeway via Colby Street | % | 15.5 | 1.7 | 12.4 | 18.1 | 14.3 to 16.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 7.6 | 1.3 | 4.8 | 9.4 | 6.7 to 8.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.9 | 0.9 | 2.9 | 6.2 | 4.3 to 5.6 |
| ramp share | from freeway via College Avenue | % | 11.3 | 1.5 | 8.9 | 13.8 | 10.3 to 12.4 |
| ramp share | from freeway via Martin Street | % | 13.0 | 0.9 | 11.9 | 14.6 | 12.3 to 13.6 |
| ramp share | from freeway via Colby Street | % | 12.1 | 1.1 | 10.9 | 13.9 | 11.3 to 12.8 |
| ramp share | from freeway via Hillegass Avenue | % | 6.8 | 1.2 | 4.5 | 8.3 | 5.9 to 7.7 |
| ramp share | from freeway via Benvenue Avenue | % | 2.9 | 0.6 | 2.1 | 3.8 | 2.5 to 3.3 |
| corridor flow | Telegraph N median link flow | veh/h | 798.60 | 43.41 | 728.40 | 854.40 | 767.55 to 829.65 |
| corridor flow | Telegraph S median link flow | veh/h | 667.32 | 37.87 | 618.00 | 738.00 | 640.23 to 694.41 |
| corridor flow | College N median link flow | veh/h | 209.88 | 14.91 | 193.20 | 232.80 | 199.22 to 220.54 |
| corridor flow | College S median link flow | veh/h | 362.52 | 22.78 | 324.00 | 398.40 | 346.23 to 378.81 |
| corridor flow | Claremont N median link flow | veh/h | 404.40 | 18.12 | 362.40 | 429.60 | 391.44 to 417.36 |
| corridor flow | Claremont S median link flow | veh/h | 374.04 | 20.86 | 340.80 | 406.80 | 359.12 to 388.96 |
| corridor flow | Alcatraz E median link flow | veh/h | 378.72 | 35.30 | 325.20 | 433.20 | 353.47 to 403.97 |
| corridor flow | Alcatraz W median link flow | veh/h | 398.40 | 18.87 | 368.40 | 424.80 | 384.90 to 411.90 |
| corridor flow | Hillegass N median link flow | veh/h | 96.60 | 10.65 | 85.20 | 115.20 | 88.98 to 104.22 |
| corridor flow | Hillegass S median link flow | veh/h | 71.16 | 7.25 | 57.60 | 82.80 | 65.98 to 76.34 |
| corridor flow | Colby N median link flow | veh/h | 117.72 | 9.34 | 104.40 | 134.40 | 111.04 to 124.40 |
| corridor flow | Colby S median link flow | veh/h | 120.84 | 9.26 | 105.60 | 136.80 | 114.22 to 127.46 |
| corridor flow | Martin E median link flow | veh/h | 93.36 | 13.28 | 66.00 | 114.00 | 83.86 to 102.86 |
| corridor flow | Martin W median link flow | veh/h | 104.88 | 7.55 | 91.20 | 120.00 | 99.48 to 110.28 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 36 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 19 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 2 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 19 | above |
| Intents listed, together | | 101 (71 to 131) | 75 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 35 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 35.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.0 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.5 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.8 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.6 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.4 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.4 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.3 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 0.8 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 0.5 | College Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Ashby Ave from the west (Emeryville and I-80) | 0.2 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 2.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 48 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 17 veh/h; Claremont Avenue 8 veh/h; College Avenue 2 veh/h; College Avenue then Alcatraz Avenue 0 veh/h; Claremont Avenue then Alcatraz Avenue 0 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 15 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 8 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 12 | within |
| Intents listed, together | | 43 (20 to 68) | 60 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 49 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.7 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 8.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.1 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.8 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.2 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.9 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.7 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.2 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | Telegraph Avenue |
| other pairs | | 12.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 19 veh/h; SR-24 15 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue 4 veh/h; none near the study area 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 23 | below |
| Intents listed, together | | 87 (78 to 110) | 38 | |
| Other through cars (no intent listed) | | | 27 | |

Model through cars by origin and destination group (largest 12 of 29 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 18.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.6 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.6 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.2 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.8 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.4 | College Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.4 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 0.3 | Telegraph Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 0.3 | SR-24 |
| other pairs | | 1.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 38 veh/h; Claremont Avenue then SR-24 17 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Claremont Avenue 1 veh/h; SR-24 1 veh/h; Alcatraz Avenue then College Avenue 0 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 17 | within |
| Intents listed, together | | 46 (39 to 72) | 48 | |
| Other through cars (no intent listed) | | | 32 | |

Model through cars by origin and destination group (largest 12 of 45 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.7 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.3 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 4.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.9 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.4 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.2 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.7 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.4 | none near the study area |
| other pairs | | 9.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 51 veh/h; none near the study area 10 veh/h; SR-24 10 veh/h; Claremont Avenue 3 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; College Avenue then Claremont Avenue 1 veh/h.

### Study area, all residential and service streets

Model: 407 through cars per hour.

Model through cars by origin and destination group (largest 12 of 111 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 45.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 36.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 30.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 19.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.7 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.6 | Claremont Avenue then SR-24 |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 12.2 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 9.6 | Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.4 | none near the study area |
| other pairs | | 143.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 241 veh/h; Claremont Avenue 38 veh/h; SR-24 35 veh/h; none near the study area 17 veh/h; Claremont Avenue then SR-24 14 veh/h; Telegraph Avenue then Claremont Avenue 12 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 94; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 85; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 71; Telegraph Ave from the north (Berkeley) 32; Telegraph Ave to the south (downtown Oakland) 29; West Oakland to the southwest (Adeline St, Market St) 22; Claremont Ave and Tunnel Rd toward the hills 20; Shattuck Ave from the north (Berkeley) 11; College Ave from the north (Berkeley) 8; Ashby Ave from the west (Emeryville and I-80) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 101; Telegraph Ave from the north (Berkeley) 64; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 61; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 56; Claremont Ave and Tunnel Rd toward the hills 26; College Ave from the north (Berkeley) 15; Shattuck Ave from the north (Berkeley) 13; Ashby Ave from the west (Emeryville and I-80) 13; Emeryville and West Oakland streets (55th to 67th Streets) 11; Telegraph Ave to the south (downtown Oakland) 10.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
