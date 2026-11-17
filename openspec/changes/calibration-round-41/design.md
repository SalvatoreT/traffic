## Context

Round 40 shipped through targets at weight 2 (demand 930a1d90b2d1). On twenty PM seeds Colby St NB is 150.6 (SE 3.3) against 102 to 145; the other three figures are inside or within one standard error. Round 40 traced the excess to cars joining Colby St partway: the turn from Forest St onto Colby St NB carries 86 an hour against 57 counted, while whole-street cars are 92 against 102. Times are Pacific; the round ran on 2026-11-17.

## Decisions

D1. Lead direction (2026-11-17, relayed): one narrow round on the Colby St NB excess. Check the volunteer count at Claremont Ave / Colby St / Forest St; a counted movement the fit does not use may be added as a target unless its station group is held out (the frozen split must not change). Movements are fitted with the simulated membership built for the street runs. Keep the change only if the distance outside the four ranges falls on twenty seeds and no rail breaks; otherwise revert. Also report 62nd St and Forest St eastbound blocks without changing anything.

D2. What the count gives at the junction (PM; route diagrams pages 26 and 27, `turningMovements` of the count file):
- Claremont Ave from the southwest onto Colby St NB, 121: fit station `count move 2776>2591`, weight 0.5, not held out.
- Forest St from the southeast onto Colby St NB, 57: fit station `count move 2730>2591`, weight 0.5, not held out.
- Claremont Ave from the northeast onto Colby St NB, 4: below the 25-vehicle minimum for a constraint (`minMovementVeh`, Poisson noise, ASSUMPTION); unused, and left so.
- Colby St from the north onto Claremont Ave toward the southwest, 84: fit station `count move 2592>2777`, not held out.
- Colby St from the north onto Claremont Ave toward the northeast, 75: fit station `count move 2592>2750`, weight cut to a quarter for a doubtful reading (notes, "Not readable"), not held out.
- Colby St from the north straight onto Forest St, 59: not a movement station (the reader leaves straight movements to the block counts); the Forest St eastbound block from the junction (`count block 2697`, 66) carries it. Not added: it is southbound traffic, not part of the Colby St NB excess, and adding a station would change the station list the frozen split was checked against.
- Blocks: Colby St 2591 (NB, 189) and 2592 (SB, 162) and Forest St 2696/2697 are fit stations, none held out.
So no counted movement there is unused that could be added. The data are already in the fit; what differs is how the fit counts them. Their membership comes from the fit's static routes, which send fewer cars from Forest St onto Colby St NB than the simulator does.

D3. Change tested: the four movement stations at the junction (`countFit.throughTargets.measuredStations`) take their membership from simulated trips, as the through targets do. The share of a pair's trips that make the movement is counted on twenty seeds of the round-40 demand (`calibrate --select-od` now writes the movement and route stations' pairs too). All trips count, not only through trips, because the count is of every car. The prior is the static share worth 5 trips (ASSUMPTION), and the weights are unchanged (0.5, 0.125 for the doubtful reading). PM only: the AM and midday runs on file carry no movement pairs, and the midday targets are scaled PM counts. The through targets keep round 40's forty-run membership, so only the movement membership changes.

D4. Guard rails, carried over from round 40 and frozen before results; baseline = the round-40 demand on the same seeds:
- G1: recent fitted stations within GEH 5 no more than 2 fewer than 75 of 92 on either PM set; AM no fewer than 65 of 77.
- G2: 4 of 4 shares within 10 points on either set; error no more than 1.5 above 5.9 (seeds 1 to 10) and 5.3 (11 to 20).
- G3: D16 holds on both sets; mean entry backlog no more than 0.15 points above 0.68% and 0.67%.
- G4: PM Telegraph Ave times inside their ranges; AM northbound inside, AM southbound no more than 10 s above 300 s.
- G5: per Telegraph Ave / Alcatraz Ave leg the GEH rises by no more than 1.5 over round 40 on the same set (1 to 10: N 6.70, W 12.50, S 6.72, E 6.31; 11 to 20: 7.93, 12.98, 8.44, 6.59).

D5. Keep rule, frozen with D4: the summed distance outside the four ranges on seeds 1 to 20 must fall and every rail must hold on both sets. One build, no iteration. Otherwise the change is reverted (config off, demand 930a1d90b2d1 stays) and reported.
