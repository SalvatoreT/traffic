## Context

Owner report, 2026-11-14, on a scenario of four interventions (modal filters at Martin St and Ayala Ave and at Ayala Ave and Forest St; diagonal diverters, barrier bearing 41, at 62nd St and Colby St and at 63rd St and Hillegass Ave): "why would 63rd street get so popular? It doesn't make sense to me."

Diagnosis (PM peak, seeds 1 to 3, 60 minutes, network c05a22fc9ebe8816, demand 67f09a8c56c92603). The diverters allow only turns, so Colby St is cut straight through at 62nd St and Hillegass Ave at 63rd St. 63rd St rose from 1,073 to 1,556 veh/h, mostly through cars on the blocks from Telegraph Ave to Hillegass Ave. About 80% of the added trips belonged to pairs with a `via` flow (the Colby St and Hillegass Ave turn-outs and turn-ins at Alcatraz Ave, rounds 20 and 21). Those trips kept making their movement: only 2 or 3 fewer trips per run used each movement than in the baseline. The simulator drops a `via` only when the movement is closed or its entry link is unreachable. When the entry link was reachable by any path, drivers took it, so a car that turned from Alcatraz Ave into Hillegass Ave found Hillegass Ave closed at 63rd St, turned onto 63rd St, went around Colby St and came back up to Alcatraz Ave. The share of `via` trips that passed a node twice rose from 1% to 54% on the Hillegass Ave turn-out. With every `via` stripped from the demand, 63rd St rose by 44 veh/h instead of 483.

## Decisions

D1. Owner decision, lead session 2026-11-14. An assumed movement is honored only while its detour in the current effective network (after interventions) stays within the tolerance that built the flows. The tolerance is `via.maxDetour` in the demand file, written by the builder from the movement's `maxDetour`, so no Rust constant carries it; 1.3 applies when the field is absent (ASSUMPTION, `VIA_MAX_DETOUR`). The check runs when a trip starts and at every re-plan before the movement is made. A trip that has made its movement is plain from then on.

D2. Alternatives (ASSUMPTION, same decision). A driver who finds the movement blocked may make the same kind of turn on the parallel street, such as the Hillegass Ave turn-out instead of the Colby St one. The builder writes `via.alternatives` per flow: the other configured movements that have an intent with the same `fromGroup` and `toGroup` as an intent of the flow's movement that the flow's pair belongs to, in configuration order. The simulator takes the primary when it counts, else the cheapest alternative that counts, else the plain route. Config and intents are the only inputs; no street name is in code. In the PM peak 445 of 455 assumed flows have one alternative (Colby St and Hillegass Ave turn-outs for each other, and the southbound turn-ins from the east and west). The other 10 flows, 38 + 28 veh/h of southbound turn-ins from the west, have none because their intents name different groups on the two streets (`west-side` against `telegraph-north` and `west-side-other`); they take the plain route when blocked. Merging those groups is a config choice left open.

D3. Loop rule. A via route fails the check when it passes a node twice that the plain route does not also pass twice. The first version rejected any repeated node. About 5% of plain through trips in the baseline already repeat a node (ramp and hill loops far from the study area), and the strict rule dropped baseline via trips for reasons unrelated to the movement.

D4. Free-flow basis. The check compares the route through the movement with the plain route on free-flow link times and static movement costs, from a second router that is rebuilt when the effective network changes (an intervention or a signal re-plan). The first version used the live costs of the router and dropped 24 of 353 baseline via movements per hour (7%); through cars on Colby St northbound fell from 149 to 136 veh/h in the PM peak ten-seed run. The builder chose the flows on free-flow costs, and the counted movements include whatever queues the drivers met, so congestion alone must not drop a counted movement. With the free-flow basis the baseline loses 9 of 353.

D5. Tried and not kept: rejecting any via route with a repeated node, and judging the tolerance on live costs. Both are in D3 and D4.

## Results

Baseline, PM peak, ten seeds (round 21 in brackets): through cars Hillegass Ave SB 112 (111), Colby St SB 107 (109), Hillegass Ave NB 73 (72), Colby St NB 144 (149); headline shares 48.0 / 37.9 / 60.7 / 41.9 (46.8 / 37.0 / 61.7 / 42.6). AM removals 0.10 per hour, midday 0.00. PM removals 1.10 per hour (round 21 0.40): see D6. The round 21 simulator run on this demand file reproduces the round 21 through cars and shares exactly (149 / 72 / 111 / 109; 46.8 / 37.0 / 61.7 / 42.6).

Owner's scenario, PM peak, seeds 1 to 3, before and after the fix:

63rd St blocks (veh/h, baseline to scenario; through cars are those with no end in the study area):

| Block (63rd St) | Before: veh/h | Before: through | After: veh/h | After: through |
| --- | --- | --- | --- | --- |
| Telegraph to Canning (EB) | 60 to 146 | 38 to 111 | 65 to 109 | 42 to 74 |
| Canning to Dana (EB) | 53 to 149 | 33 to 114 | 58 to 97 | 36 to 64 |
| Dana to Colby (EB) | 41 to 116 | 22 to 88 | 41 to 66 | 20 to 42 |
| Colby to Hillegass (EB) | 26 to 110 | 5 to 51 | 29 to 19 | 3 to 10 |
| Hillegass to Colby (WB) | 42 to 125 | 8 to 97 | 42 to 43 | 8 to 2 |
| Colby to Dana (WB) | 40 to 104 | 13 to 56 | 37 to 51 | 10 to 7 |
| Dana to Canning (WB) | 52 to 126 | 14 to 62 | 49 to 70 | 11 to 12 |
| Canning to Telegraph (WB) | 40 to 45 | 11 to 6 | 39 to 46 | 8 to 6 |
| College to Hillegass (WB) | 73 to 16 | 18 to 1 | 69 to 17 | 18 to 1 |
| Hillegass to College (EB) | 34 to 27 | 12 to 2 | 38 to 17 | 12 to 2 |

Other figures, before and after:

| | Before | After |
| --- | --- | --- |
| 63rd St, all blocks (veh/h) | 1,073 to 1,556 | 1,063 to 1,115 |
| Through trips on local streets (per run) | 579 to 363 | 574 to 210 |
| Trips of `via` pairs that make a `via` movement (per run) | 353 to 334 | 344 to 116 |
| `via` trips with a repeated node, one end inside | 4% to 35% | 2% to 2% |
| `via` trips with a repeated node, through | 8.5% to 11.6% | 8.5% to 8.6% |

Where the displaced cars go: Colby St loses 112 veh-km/h and Hillegass Ave 69, Ayala Ave 62, Martin St 43, 57th St 24, 58th St 22 and Forest St 17. The local streets that gain are 61st St (+23), 60th St (+16), McAuley St (+10), Canning St (+2), Dana St (+2) and 63rd St (+2). Most of the rest goes to the arterials: Telegraph Ave between 52nd and 58th St gains 170 to 250 veh/h in each of the three seeds (it is real), while Claremont Ave loses 140 to 170. The Adeline St rows of the diagnosis (+120 to +170) were seed noise: the sign flips between seeds, and with the fix they are within 15 veh/h.

The remaining rise on 63rd St west of Colby St is plain-local trips whose block lost its way south (about 30 trips per run, legitimate), and Telegraph Ave traffic that turns onto 63rd St to make the Colby St turn onto Alcatraz Ave (about 13 per run; the route costs under 1.3 times the plain one on a trip of several kilometers).

D6. The PM removals of 1.10 per hour (11 over ten seeds, interval 0.12 to 2.08) exceed the stability rule of 1.0. The removals sit at nodes in the hills (Glenwood Glade, Margarido Dr) that assumed trips hardly use: 4 of about 660 trips per hour through the busiest of them are `via`, in the baseline of both simulators. Seeds 11 to 20 give 0.40 with the change and 0.60 with the round 21 simulator; the round 21 simulator on seeds 1 to 10 gives 0.40, and 0.50 at scale 1.001. The ten-seed mean moves by this much when the demand scale changes by a tenth of a percent, so the 1.10 is noise and not an effect of the check. The stability rule still reads it as a fail, and the owner may want to rule on that.
