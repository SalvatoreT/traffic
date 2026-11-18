# Rockridge baseline calibration record: archive, part 3

Rounds thirty to thirty-three, moved unchanged from `rockridge.record.md` in round 43 (2026-11-18). Newer rounds are in `rockridge.record.md`; older ones in `rockridge.record-archive-2.md` and `rockridge.record-archive.md`.

## Thirty-third round: left turns at signals, Ashby Ave / Claremont Ave (change calibration-round-33)

Round 32 left one junction type between the model and an accepted delay-feedback fit: Ashby Ave / Claremont Ave, where the removals of the iteration-2 demand sat, and validation case l1 failed. This round checks left turns at signals as primitives, then the phasing there, then redoes the fit. Decisions are in `openspec/changes/calibration-round-33/design.md`. Simulator fingerprint 6741b48b6d17 at the start, cef9506de520 at the end. Network 69f62ad981d0b8fa to 6a8285d5076f9ddc (one signal gains an observed phase; no link renumbered). Demand flows unchanged; its file changes only in the network hash it records (edaae9760f406e08 to bef51b684a8c079c). Frozen split unchanged. Rounds 22 to 24 moved to `rockridge.record-archive-2.md`. Times Pacific; the round ran on 2026-11-15 and 2026-11-16.

### Step 1: left turns at signals as primitives

Source. No verified entry covered permissive left capacity. [Fambro1991] (TTI Research Report 0989-1F, read in full) gives the method: left turns use gaps only once the opposing queue has cleared, at the rate of Drew's gap model (the Harders form) with critical gap 4.5 s and turning headway 2.5 s, plus sneakers in the change interval (the 1985 HCM's two a cycle; 0.88 measured at protected-permitted sites, critical gap 5.1 s, turning headways 2.24 to 2.57 s). [FHWA-STM2008] 4.8.4 ("one or two vehicles can be served at the end of the conflicting through phase") was re-read. `SNEAKERS` now cites both.

New cases p1 to p3, a left-only lane against 200, 400 and 600 veh/h opposing, band from the measured to the recommended values:

| Case | Simulator | Band [Fambro1991] | Queue-first model |
| --- | --- | --- | --- |
| p1, opposing 200 | 444 | 351 to 483, pass | 411 |
| p2, opposing 400 | 402 | 157 to 303, FAIL | 246 |
| p3, opposing 600 | 369 | 32 to 167, FAIL | 120 |

Why the simulator is fast: the gap check takes a starting opposing car's arrival as distance over max(speed, 2 m/s), so a car at the green line counts as 4 to 6 s away; and the courtesy wait (45 s) and yield fallback (90 s) count the red, so a left-turner that waited through the red goes ahead of the standing opposing queue, which is then held by the left-turner in the node. In a test with 500 veh/h offered opposing, the opposing approach carried 306. Left-turners wait at the stop line, not inside the junction, and up to two a cycle clear on the yellow and all-red; that matches the method's count per cycle and was left as it is.

The queue-first model (`Config::queue_first_left`, `calibrate --queue-first-left`): a conflicting car below its desired speed arrives by speeding up at its own acceleration, the critical gap at signals is 4.5 s, and permissive left-turners get no courtesy or fallback. Signals only: elsewhere the same estimate pushed case i4 below its range. It brings p1 to p3 into their bands and the test's opposing approach to its 500 veh/h, drops b4 to 837 (range from 918) and l1 to 658. On the network (old network, PM, removals per hour): shipped demand seeds 1 to 10 1.1 against 0.8; round 32's iteration-2 demand 10.9 and 7.2 on seeds 1 to 10 and 11 to 20 against 3.3 and 4.2. Undoing one part at a time gave 6.3 (courtesy kept), 7.4 (old arrival estimate), 6.4 (critical gap 4.1). The network got worse, so the model stays off by default; runs without it are identical to round 32 (seed 1 checked bit for bit). p2 and p3 are listed in `validation.deviations.json` as not reviewed.

l1. Its range applies the unsignalized major-left gap formula (tc 4.1 s, tf 2.2 s) to the hourly opposing flow over the whole cycle. The [Fambro1991] method puts the left-limited approach at 385 to 706 per lane; the simulator gives 792, above the method (658 with the queue-first model). No correct behavior raises it into its range. Range unchanged; still not reviewed, with this comparison in its reason. In the shared lane, a left-turner that does not fit in the full pocket drives to the stop line of the inner lane and turns from there beside the pocket, and through drivers behind it change lanes; physically it would wait at the pocket entrance, which would lower capacity further. Not built.

### Step 1c: phasing at Ashby Ave / Claremont Ave

OSM: northbound Claremont Ave (ways 24501620, 1503817466) is `lanes=4` with no direction split and no `turn:lanes`; southbound (way 435129985) has `turn:lanes:backward=left|left;through|through;right`. The network has northbound two lanes with the class-rule 3-vehicle pocket and southbound three lanes with a marked left lane. The importer decides no left-turn phasing: every left is permissive unless an observed timing gives an approach a phase of its own. The 2010 PM worksheet [SafewayCollege-DEIR2011] (re-read) counts northbound 53 left, 359 through, 165 right (577) and southbound 272 left, 234 through, 43 right, and runs the two Claremont Ave approaches as split phases (17.0 and 17.5 s of 100 s; Ashby Ave 50.5 s), northbound coded with no left-turn lane. The heavy left turns are southbound.

The project lead relayed a resident-provided field observation (2026-11-15): northbound Claremont Ave has a left-turn arrow. It is in `signalObservations` as DATA for the phasing; protected-only, all periods, cycle and greens by flow, pocket length and the other approaches' phasing are ASSUMPTIONS pending a timing sheet. The engine and importer now take an observation of the phasing without timing (cycle and greens 0; the plan keeps the structure with Webster's cycle and splits). New case b13 (one lane, all left, own phase, 500 opposing): 450 against 452 to 602 veh/h [FHWA-SIG2004], 2 veh/h short on seed 1 (456 to 486 on seeds 2 to 5), listed as not reviewed.

The 2010 worksheet timing itself (both Claremont approaches split, fixed greens) was tried on a scratch network with the queue-first model on: shipped demand 1.7 removals an hour, iteration-2 demand 4.5. Not kept.

### Step 2: Ashby Ave / Claremont Ave on round 32's iteration-2 demand

Rebuilt from round 32's stored iteration 0 and 1 runs (seed 1 reproduces round 32's stored run exactly). Default engine, PM:

| Iteration-2 demand | Without the protected left, seeds 1-10 / 11-20 | With it |
| --- | --- | --- |
| Removals per hour | 3.3 / 4.2 | 4.6 / 4.7 |
| Claremont Ave northbound at Ashby Ave, veh/h (577 counted) | 379 / 411 | 437 / 456 |
| Ashby Ave eastbound / westbound into the junction | 499, 529 / 516, 479 | 401, 449 / 406, 443 |
| Through cars HSB / CSB / HNB / CNB, seeds 1-10 | 110 / 94 / 92 / 142 | 111 / 94 / 91 / 142 |
| Headline error, seeds 1-10 | 2.4 | 2.6 |
| Where the removals are (seeds 1-10, total) | Avalon Ave at Claremont Blvd 10, Russell St 2, Claremont Ave northbound at Ashby Ave 2, Claremont Crescent 2 | Avalon Ave at Claremont Blvd 9, Ashby Ave at Claremont Crescent 4, 62nd St at MLK Jr Way 3, Claremont Crescent 2, Ashby Ave eastbound at Claremont Ave 2 |

The protected phase lets more northbound traffic through and takes green from Ashby Ave; the hillside queue moves from Claremont Ave to Ashby Ave and stays. Shipped demand: 1.1 and 1.3 removals an hour on seeds 1 to 10 and 11 to 20 against 0.8 and 1.4. Under the step rule this would be reverted. It is kept because it is an observation of the street, which the lead asked to model; its effect is recorded here.

### Step 3: delay-feedback fit

`npm run data` rebuilt the network (6a8285d5076f9ddc) and the same demand flows. `tools/cost-loop.ts --no-stop` (resumed once after a session fault, from iteration 1), PM seeds 1 to 10 scored:

| Iteration | Removals/h | Headline shares (47 / 47 / 68 / 45), error | Through cars HSB / CSB / HNB / CNB | GEH<5 fitted / held out, all stations | Cost gap |
| --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | 1.1 | 53 / 51 / 55 / 37, 7.5 | 142 / 132 / 98 / 150 | 66% / 57% | - |
| 1 | 24.7 | 53 / 48 / 56 / 43, 5.4 | 134 / 149 / 85 / 130 | 70% / 50% | 0.378 |
| 2 | 13.9 | 53 / 45 / 63 / 47, 3.7 | 129 / 107 / 86 / 124 | 75% / 62% | 0.122 |
| 3 | 10.6 | 55 / 47 / 77 / 50, 5.5 | 105 / 93 / 92 / 140 | 70% / 60% | 0.090 |

Converged at iteration 3 (gap under 0.10). The unchanged acceptance rule rejected every iteration, so the demand keeps its free-flow and BPR costs. At iterations 1 and 2 the removals sit at Ashby Ave / Claremont Ave (Claremont Ave northbound 15 over ten seeds at iteration 2, Ashby Ave eastbound 5 to 16) and the hillside streets behind it (Avalon Ave at Claremont Blvd, Oak Knoll Ter, Claremont Crescent), with Claremont Ave northbound at 307 veh/h and Ashby Ave eastbound at 303: with the third phase and flow-based splits the junction serves less than round 32's two-phase plan under the heavier arterial loads of the fit.

### Result: ten seeds

Seeds 1 to 10 (PM also 11 to 20), scale 1.0, 60 minutes, fingerprint cef9506de520, `npm run assess -- --publish --noise`. Round 32 in brackets.

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars, all study-area local streets | | 822 (793) | | 466 (462) | 358 (361) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 | 142 / 132 / 98 / 150 (137 / 128 / 95 / 148) | 146 / 140 / 96 / 152 (142 / 142 / - / -) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.5 / 55.1 / 37.4, 3 of 4, error 7.5 (53.2 / 50.9 / 56.8 / 38.0, 3 of 4, 7.1) | 52.8 / 47.9 / 56.6 / 38.9, 3 of 4, error 6.0 (error 5.7) | 50.8 / 43.9 / 59.6 / 47.3 (50.5 / 43.3 / 59.0 / 47.4) | 52.6 / 37.2 / 62.8 / 45.5 (53.4 / 37.6 / 62.9 / 45.6) |
| Removals per hour (D16) | below 1 | 1.10, 0 to 5 per seed (0.80) | 1.30 (1.4) | 0.30 (0.00) | 0.00 (0.00) |
| Entry backlog, mean % | below 2% | 0.71 (0.71) | 0.57 | 0.03 (0.01) | 0.01 (0.01) |
| Completed trips | | 25,857 (25,837) | 25,965 | 22,628 (22,663) | 16,705 (16,709) |
| Recent stations GEH<5, fitted / held out | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (83% / 54%) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |
| 62nd St / Forest St eastbound | 59 / 66 counted | 118 / 208 (103 / 192) | 123 / 201 (115 / 208) | 51 / 98 (50 / 107) | |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 345 / 317 (340 / 311) | | 294 / 299 (293 / 299) | |
| Claremont Ave northbound at Ashby Ave, veh/h | 577 (2010) | 373 (367) | 411 | | |

The 2024 Caltrans station on Ashby Ave eastbound into Claremont Ave (link 3395, held out) counts 1,163 an hour; the shipped demand gives 474 there.

Validation: 61 of 72 cases pass. Failing: a3, e2, e3, j6, j8, j9, j12 (reviewed, as before), l1 (not reviewed, as before), and the new p2, p3, b13 (not reviewed).

### Who the through cars are now

`calibrate --od-costs`, PM seeds 1 to 4, classes as in rounds 30 to 32 (round 32 in brackets).

| Through cars an hour | Hillegass Ave SB | Colby St SB | 62nd St EB | Forest St EB |
| --- | --- | --- | --- | --- |
| All | 128 (117) | 118 (104) | 78 (57) | 128 (127) |
| Making an assumed movement | 81 (82) | 31 (29) | 7 (6) | 8 (8) |
| On the router's best route | 4 (1) | 5 (3) | 6 (1) | 20 (21) |
| On a route ranked costlier (median excess) | 43 (34; 48 s, 8%) | 82 (72; 56 s, 10%) | 66 (50; 48 s, 7%) | 100 (98; 36 s, 7%) |

### Verdict

Status `uncalibrated`, as the rules prescribe. PM peak: D16 fails (1.10 removals an hour on seeds 1 to 10, 1.30 on 11 to 20); D5 fails (3 of 4; Hillegass Ave SB to the freeway 55 against 68); the through-car check fails on all four blocks; the station rule fails fitted (82%) and held out (54%). AM peak: D16 passes (0.30), the station rule passes fitted (87%) and fails held out (74%); no share or through-car targets. Midday: D16 passes; no counts. Primitive validation: p2, p3, b13 and l1 fail with no reviewed exception.

### What remains off

- Permissive left turns against heavy oncoming traffic are served up to twice as fast as [Fambro1991] allows, and the oncoming traffic is held back. The queue-first model fixes the primitive and destabilizes the network; switching it on probably needs the protected phases the field has (left-turn arrows) entered first, which needs field checks or timing sheets for the signals with heavy left turns.
- Ashby Ave / Claremont Ave: the protected northbound left is observed; whether it is protected-only, its timing, the southbound phasing, the pocket and the northbound lane use need a timing sheet. The model serves Ashby Ave eastbound far below the 2024 Caltrans count.
- l1's range disagrees with the cited method; b13 sits 2 veh/h under its band (single-lane left turns at the 5 m/s turn speed, ASSUMPTION).
- Field checks of rounds 30 to 32 still open. Stored proposal results, text pages and previews were made on an older engine and are stale.

## Thirty-second round: lane use, closely spaced signals, the arterial deficit (change calibration-round-32)

The lead's reading after round 31 was an arterial capacity deficit: the real arterials carry their counted PM volumes without gridlock, and the model's cannot carry what the delay-feedback fit assigns to them. This round locates the deficit first, then tries each candidate named in rounds 29 and 30 as its own measured step, kept only when the validation suite and the network both improve. Decisions are in `openspec/changes/calibration-round-32/design.md`. Simulator fingerprint 60df28cd94a0 at the start, 6741b48b6d17 at the end. Network 69f62ad981d0b8fa and demand edaae9760f406e08 unchanged (`npm run data` reproduces both), frozen split unchanged, no link renumbered.

### Step 1: where the deficit is

The delay-feedback demand of round 31 at iteration 2 was rebuilt from the stored iteration 0 and 1 runs into a scratch directory (its PM seed 1 reproduces the stored run exactly) and run on PM seeds 1 to 4 with `calibrate --node-report` (new: per-link exits, standing vehicles and time near jam density, mean signal plans, removals) and `--od-costs`. Capacity is lanes x s x the model's mean green share, s from 1,500 to 2,000 veh/h per lane [FHWA-SIG2004]. "Diverted" counts the through cars an hour on the counted Hillegass Ave, Colby St, 62nd St and Forest St blocks whose arterial alternative this location alone slows by more than the margin by which the side street won (a trip can count at several locations). Removals per hour are over ten seeds of the same demand.

| Location (signal unless noted) | Diverted/h | Removals/h | Busiest approach: flow / count / capacity, veh/h | Standing veh, time near jam |
| --- | --- | --- | --- | --- |
| College Ave / Claremont Ave / 62nd St | 174 | 0 | College Ave SB 381 / - / 751-1,001 (51 m link); 62nd St EB 50 / 59 / 299-399 | 3.0, 1% |
| Alcatraz Ave / Telegraph Ave | 159 | 0 | Telegraph Ave SB 794 / 1,064 / 2,174-2,898; NB 922 / 1,093 | 3.0, 0% |
| 56th St / Telegraph Ave (SR-24 ramps) | 146 | 0 | Telegraph Ave SB 1,194 / - / 1,828-2,438 (94 m link) | 3.5, 2% |
| Aileen St / Telegraph Ave (SR-24 ramps) | 142 | 0 | Telegraph Ave SB 792 / - / 1,323-1,764 | 2.4, 2% |
| Claremont Ave / Colby St / Forest St | 141 | 0 | Claremont Ave 668 / - / 1,063-1,418; Colby St SB 131 / 162 / 76-101 (4 s observed green) | 3.2, 0% |
| Alcatraz Ave / College Ave | 136 | 0 | Alcatraz Ave EB 475 / 510 / 650-866; College Ave NB 420 / 423 | 2.2, 2% |
| 55th St / Telegraph Ave | 127 | 0 | Telegraph Ave SB 870 / 1,099 / 1,808-2,410; NB 944 / 1,070 / 2,711-3,615 | 2.2, 0% |
| 52nd St / Claremont Ave / Telegraph Ave | 68 | 0.3 | Telegraph Ave SB 939 / 1,121 / 1,886-2,515 | 4.2, 0% |
| Ashby Ave / Claremont Ave | 43 | 0.3 | Claremont Ave NB 314 / 577 / 723-965 (two lanes, heavy left turns) | 9.0, 10% |
| Claremont Blvd at Avalon Ave and Claremont Crescent at Ashby Ave (east hills, upstream of the row above) | under 36 | 1.0, 0.2 | Claremont Ave at Russell St (all-way stop) 400 veh/h | 6.3, 17% |
| Harmon St circles, Martin Luther King Jr Way at 47th St | 0 | 0.3, 0.3 | west of the study area | |

What it says, plainly. No arterial approach on the through cars' alternatives reaches its saturation-flow capacity: the Telegraph Ave approaches run at 0.3 to 0.65 of it and College Ave southbound at about 0.4 to 0.5, and their throughput is below the counts because less demand reaches them, not because they cap it. What they impose is delay: four uncoordinated signals within 300 m of Telegraph Ave, each with 2 to 4 vehicles standing per approach, and lanes blocked by left-turners. The removals sit at the Ashby Ave / Claremont Ave signal (Claremont Ave northbound carries 314 of the 577 counted, with 9 vehicles standing on a two-lane approach where left-turners wait) and on the hillside streets queued behind it, plus a few west of Telegraph Ave. So the deficit found is delay at closely spaced signals and lane blocking, which steps 2 and 3 address; a shortfall of signal capacity on the arterials was not found.

### Step 2: lane changes along a link (kept)

Cars now move to an adjacent lane by MOBIL [Kesting2007]: the new follower may not have to brake harder than 4 m/s^2, and a discretionary change needs an acceleration gain, including politeness times the followers' gains, above 0.2 m/s^2 (both values from the source; the equations re-read in Kesting, Treiber and Helbing, arXiv 1012.4913, and on Treiber's MOBIL page). A driver whose lane cannot serve its next movement, or a left-turner at a pocket with room, changes whenever it is safe. ASSUMPTIONS: politeness 0.2 (the source gives 0 to 0.5), 3 s between a driver's changes, one check a second, 1 m minimum gap, a missing leader taken as a standing vehicle at the stop line, discretionary changes kept to the side of the road the driver sorts for.

| | Without (round 31 engine) | With |
| --- | --- | --- |
| b9: 2 lanes, 10% left, pocket (815 to 1,075 veh/h per lane) | 814 | 870 |
| l1 (new): 2 lanes, 20% left, pocket overflowing every cycle (851 to 1,064) | 699 | 792, FAIL |
| l2 (new): left lane blocked, 1,200 veh/h offered, flow past it over offered (0.9 to 1.1) | 1.04, 59 vehicles stranded | 1.04, 4 stranded, pass |
| PM shipped demand, seeds 1-10 / 11-20: removals per hour | 1.2 / 1.9 | 1.4 / 2.0 |
| headline error, points | 8.9 / 7.7 | 8.7 / 7.0 |
| through cars HSB / CSB, seeds 1-10 | 155 / 160 | 153 / 148 |
| Forest St eastbound, seeds 1-10 / 11-20 | 275 / 290 | 237 / 247 |
| Telegraph Ave SB, s, seeds 1-10 / 11-20 | 357 / 360 | 334 / 341 |
| PM delay-feedback demand (iteration 2), seeds 1-10: removals, Telegraph Ave SB | 5.4, 361 s | 4.9, 337 s |

l1 still fails because a left-turner that does not fit the 3-vehicle pocket (ASSUMPTION) holds the inner lane at the stop line until it can turn. It is listed in `validation.deviations.json` as not reviewed; the review is the lead's. The removals moved within the spread of ten-seed sets; the rest improved, so the step is kept.

### Step 3: closely spaced signals (kept)

Two signals joined by at most 120 m of road (ASSUMPTION; one link, or links that go straight on through uncontrolled nodes) run the longer of their own cycles, and the downstream green for that road starts one free-flow travel time after the upstream green that feeds it, in the direction with the larger measured approach flow [FHWA-STM2008] 6.3.1, 6.6.2, 6.6.4. At each 5-minute adaptation the new plans keep the common cycle and the offsets. In Rockridge this joins Aileen St, 56th St and 55th St on Telegraph Ave, 52nd St and 51st St, and pairs on Broadway, Shattuck Ave at Adeline St, Martin Luther King Jr Way, Domingo Ave and Tunnel Rd.

Why round 29's version made things worse, as far as can be told without its code: it grouped signals up to 800 m (then 150 m) apart on the longest member cycle, which lengthens queues on 81 to 94 m links, and it used simultaneous offsets, which the manual suggests for oversaturated arterials (6.4.3), while step 1 shows these approaches undersaturated. The first version here joined only single links; that left 55th St out of the interchange group (an uncontrolled node lies between it and 56th St) and gave 10 removals on 55th St westbound over seeds 11 to 20. The version through uncontrolled nodes has none there. Queue-aware gating of the upstream green was not built.

| PM shipped demand | Lane changes only, seeds 1-10 / 11-20 | With coordination |
| --- | --- | --- |
| c1 / c2: two signals 100 m apart over 1,000 m apart (0.75 to 1.15) | 0.78 / 0.76 | 1.03 / 1.03 |
| removals per hour | 1.4 / 2.0 | 0.8 / 1.4 |
| headline error, points | 8.7 / 7.0 | 7.1 / 5.7 |
| through cars HSB / CSB | 153 / 148, 151 / 155 | 137 / 128, 142 / 142 |
| 62nd St / Forest St eastbound | 122 / 237, 127 / 247 | 103 / 192, 115 / 208 |
| Telegraph Ave SB, s | 334 / 341 | 311 / 320 |

### Step 4: College Ave / Claremont Ave / 62nd St observed plan (not kept)

The four 2010 PM observations of round 29 [SafewayCollege-DEIR2011] (110 s, 62nd St 15 s, College Ave 41 s, Claremont Ave 19 s and 19 s as split phases) on a scratch network, with steps 2 and 3, PM seeds 1-10 / 11-20: removals 1.4 / 1.8 an hour against 0.8 / 1.4 without, 8 of them at Ashby Ave / Claremont Ave; headline error 6.0 / 4.9 with all four shares within 10 points; through cars Hillegass Ave SB 134 / 139, Colby St SB 125 / 131, but Hillegass Ave NB 111 / 108 and Colby St NB 161 / 157, above their ranges; 62nd St eastbound 94 / 102. Stability got worse, so the plan stays out of the area config, as in round 29.

### Step 5: delay-feedback fit

`npm run data` reproduced network and demand. The loop on the new engine, PM seeds 1 to 10 scored:

| Iteration | Removals/h | Headline shares (47 / 47 / 68 / 45), error | Through cars HSB / CSB / HNB / CNB | 62nd St / Forest St EB | Telegraph Ave SB, s | GEH<5 fitted / held out, all stations | Cost gap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | 0.8 | 53 / 51 / 57 / 38, 7.1 | 137 / 128 / 95 / 148 | 103 / 192 | 311 | 67% / 59% | - |
| 1 | 12.6 | 54 / 47 / 61 / 53, 5.3 | 116 / 122 / 93 / 127 | 75 / 124 | 351 | 71% / 59% | 0.351 |
| 2 | 3.3 | 53 / 47 / 68 / 49, 2.4 | 110 / 94 / 92 / 142 | 53 / 121 | 303 | 70% / 53% | 0.115 |
| 3 | 5.2 | 57 / 46 / 70 / 45, 3.5 | 108 / 91 / 99 / 157 | 52 / 149 | 319 | 70% / 60% | 0.082 |

The PM peak is now stable on the free-flow costs, so the loop's own rule stopped at iteration 1 (unstable) and restored the demand; it was rerun with `--no-stop` to convergence (gap 0.082 at iteration 3) and its acceptance rule rejected every iteration, so the demand stays edaae9760f406e08. At iteration 2 all four through-car blocks are inside their ranges and all four headline shares within 10 points, at 3.3 removals an hour. About half of those, and most of the 12.6 at iteration 1, are at the Ashby Ave / Claremont Ave signal and on the hillside streets queued behind it (Claremont Blvd at Avalon Ave 1.0 to 2.1 an hour, Avalon Ave at Oak Knoll Ter, Claremont Crescent); the rest are spread west of Telegraph Ave.

### Result: ten seeds

PM, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes, fingerprint 6741b48b6d17, `npm run assess -- --publish --noise`. Round 31 values in brackets.

| Seeds 1 to 10 | Target | PM peak | AM peak | Midday |
| --- | --- | --- | --- | --- |
| Through cars, all study-area local streets (intent tally) | | 793 (931) | 462 (505) | 361 (405) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 (PM) | 137 / 128 / 95 / 148 (155 / 160 / 96 / 147) | no whole-street counts | no whole-street counts |
| Headline shares HNB from / CNB from / HSB to / CSB to | 47 / 47 / 68 / 45 (PM) | 53.2 / 50.9 / 56.8 / 38.0, 3 of 4, error 7.1 (52.9 / 50.7 / 52.8 / 34.1, 2 of 4, error 8.9) | 50.5 / 43.3 / 59.0 / 47.4 (51.4 / 42.3 / 57.6 / 44.6) | 53.4 / 37.6 / 62.9 / 45.6 (53.4 / 37.3 / 60.7 / 43.7) |
| Removals per hour (D16) | below 1 | 0.80, 0 to 2 per seed (1.20) | 0.00 (0.00) | 0.00 (0.00) |
| Entry backlog, mean % of spawned | below 2% | 0.71 (0.67) | 0.01 (0.03) | 0.01 (0.01) |
| Completed trips | | 25,837 (25,788) | 22,663 (22,623) | 16,709 (16,694) |
| Recent stations below GEH 5, fitted / held out | above 85% | 76 of 92 (83%) / 13 of 24 (54%) (71 of 92, 77% / 13 of 24, 54%) | 67 of 77 (87%) / 14 of 19 (74%) (65 of 77, 84% / 14 of 19, 74%) | no counts |
| 62nd St / Forest St eastbound, veh/h | 59 / 66 counted | 103 / 192 (130 / 275) | 50 / 107 (50 / 113) | |
| Telegraph Ave NB / SB, s | 302-420 / 300-376 (PM); 280-315 / 245-285 (AM) | 340 / 311 (345 / 357) | 293 / 299 (305 / 316) | |

Over seeds 11 to 20 the same engine gave 1.4 removals an hour, so the PM D16 pass on seeds 1 to 10 sits close to the limit.

### Who the through cars are now

`calibrate --od-costs`, PM seeds 1 to 4, classes as in rounds 30 and 31 (round 31 engine in brackets, rerun here with `--no-lane-changes --coord-max-m 0`, which reproduces the round 31 table).

| Through cars an hour | Hillegass Ave SB | Colby St SB | 62nd St EB | Forest St EB |
| --- | --- | --- | --- | --- |
| All | 117 (132) | 104 (141) | 57 (74) | 127 (187) |
| Making an assumed movement | 82 (81) | 29 (29) | 6 (7) | 8 (11) |
| On the router's best route | 1 (5) | 3 (5) | 1 (5) | 21 (23) |
| On a route ranked costlier (median excess) | 34 (46; 46 s, 8%) | 72 (107; 61 s, 12%) | 50 (63; 51 s, 8%) | 98 (154; 34 s, 7%) |

The costlier group shrank by 12 to 56 cars an hour on every block: faster arterials widen the gap a driver's misperception has to cross.

### Verdict

Status `uncalibrated`. D16 now holds in all three periods on seeds 1 to 10 (PM 0.80 an hour; 1.4 on seeds 11 to 20). D5 fails: 3 of 4 headline shares within 10 points; Hillegass Ave SB to the freeway is 57 against 68 (mean error 7.1 points against 8.9). The through-car check fails on three PM blocks: Hillegass Ave SB 137 against 79 to 120, Colby St SB 128 against 39 to 117, Colby St NB 148 against 102 to 145; Hillegass Ave NB 95 is at the top of its range. The station rule fails in the PM peak (83% fitted, 54% held out) and, out of sample, in the AM peak (87% fitted passes, 74% held out fails). Validation case l1 fails with no reviewed exception. The PM peak does not pass shares and the through-car check, so the case the lead named (only model-edge stations failing) does not arise.

### What remains off

- With delays fed back (iteration 2) every through-car block and headline share is in range, at 3.3 removals an hour. The removals that stop it sit at Ashby Ave / Claremont Ave and the hillside streets that queue behind its Claremont Ave northbound approach: two lanes with heavy permissive left turns, carrying 314 of 577 counted vehicles an hour. That approach is the l1 case in the field; its pocket length, left-turn phasing and the lanes of Claremont Ave there need a field check or a timing sheet.
- l1: a left-turner that does not fit the 3-vehicle pocket (ASSUMPTION) still blocks the inner lane. Pocket lengths are not in the map data.
- 120 m for closely spaced signals, the politeness and the other lane-change values are ASSUMPTIONS. Queue-aware gating was not built.
- The College Ave / Claremont Ave / 62nd St observed plan improves shares and the southbound blocks but raises removals at Ashby Ave / Claremont Ave and the northbound blocks.
- Telegraph Ave southbound in the AM peak (299 s against 245 to 285) and Shattuck Ave in both peaks stay slower than observed.
- Field checks of rounds 30 and 31 still open. Stored proposal results, text pages and previews were made on an older engine and are stale.

## Thirty-first round: route choice without a junction-count bias (change calibration-round-31)

Round 30 found that most of the excess through cars drive a route the router itself ranked costlier at departure, because the walk scaled each candidate's whole remaining cost by a fresh factor of 1 +/- 8% (`ROUTE_NOISE`, unsourced) at every node. This round replaces that rule with probit route choice from the literature, picks the dispersion by a sweep on fitted evidence, refits the demand and evaluates. Decisions are in `openspec/changes/calibration-round-31/design.md`. Simulator fingerprint 09963f723083 at the start, 60df28cd94a0 at the end. Network 69f62ad981d0b8fa (unchanged, no link renumbered), demand c4420aa7aeecc473 to edaae9760f406e08, frozen split unchanged. Rounds 18 to 21 moved to `rockridge.record-archive-2.md`.

### The model

Probit route choice [DaganzoSheffi1977], [Sheffi1985] ch. 11.2: a driver perceives each arc (a trip's first link, or a movement with the link it enters) as normal with mean its current cost and variance β x that cost, truncated at zero. The standard normal deviate of each arc is fixed for the trip, from a hash of the driver's seed and the arc, so paired scenarios and native and WASM runs agree. The driver takes the exact shortest path on its perceived costs and re-plans on the same perception. A route's perceived variance is β times its cost however many junctions it has (eq. 11.14b). Departure, guided and blocked re-planning, the legs of assumed movements and of cut-turn bypasses and the initial loading all use it; the choice of which assumed movement or bypass a flow keeps stays on mean costs. A waiting trip keeps its route until the costs change. A PM run takes about 39 s instead of 30 s. The demand fit's static assignment loads by the same model (one draw of perceived link and movement costs per pass and draw).

### Validation cases

| Case | Old rule (+/-8% per node) | Probit, β = 2 s | Expected |
| --- | --- | --- | --- |
| r1: equal routes, 1 side link onto the other (+314 s), share staying | 0.418 | 0.496 | 0.45 to 0.55 |
| r2: the same with 20 side links | 0.020 | 0.499 | 0.45 to 0.55 |
| r3: route 15 s (2%) costlier, share on it | 0.369 | 0.382 | 0.381 +/- 0.03 |
| r4: 30 s (5%) | 0.244 | 0.270 | 0.273 +/- 0.03 |
| r5: 60 s (10%) | 0.081 | 0.108 | 0.116 +/- 0.03 |
| r6: 120 s (20%) | 0.000 | 0.012 | 0.010 +/- 0.03 |

r2 is the defect of round 30 in a test: with twenty chances to leave, the old rule kept 2% of drivers on a route as good as the other. The suite now passes 59 of 66 cases (the seven failures are the reviewed ones of earlier rounds).

### Dispersion sweep

No source gives β for urban street networks (Sheffi's examples use 1 time unit for illustration), so β is an ASSUMPTION chosen on fitted evidence only: removals (D16), headline shares (D5), fitted station GEH (all stations) and the six arterial travel times against the ACTC ranges. Each value had its own demand build. Seeds 1 to 4, before the delay-feedback fit. Through cars, held-out stations and 62nd St / Forest St are reported and were not used.

| β (s) | PM removals/h | PM headline error, within 10 | PM GEH<5 fitted | PM travel times in range | AM removals/h | AM headline error | AM GEH<5 fitted | AM travel times in range | Through cars HSB / CSB / HNB / CNB (check) | 62nd / Forest EB | GEH held out PM / AM |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| old rule, round 30 demand | 1.00 | 13.4, 2 | 58% | 4 of 6 | | | | | 203 / 222 / 92 / 159 | 216 / 256 | 60% / - |
| 0.5 | 0.75 | 13.0, 2 | 63% | 3 of 6 | 0 | 1.5 | 67% | 3 of 6 | 173 / 169 / 76 / 147 | 180 / 296 | 57% / 77% |
| 1 | 0.25 | 9.9, 2 | 66% | 4 of 6 | 0 | 4.4 | 70% | 3 of 6 | 143 / 145 / 77 / 134 | 125 / 292 | 55% / 81% |
| 2 | 0.25 | 8.0, 2 | 64% | 4 of 6 | 0 | 2.8 | 69% | 3 of 6 | 152 / 163 / 96 / 147 | 118 / 296 | 55% / 73% |
| 3 | 25.0 | 5.4, 3 | 63% | 4 of 6 | 0 | 1.4 | 73% | 2 of 6 | 166 / 196 / 112 / 177 | 119 / 324 | 60% / 73% |
| 4 | 1.75 | 5.5, 4 | 66% | 4 of 6 | 0 | 2.8 | 74% | 2 of 6 | 152 / 176 / 118 / 170 | 91 / 221 | 64% / 71% |

Chosen: β = 2 s. Stability comes first: 3 and 4 fail D16 in the PM peak (at 3 one seed jams Shattuck Ave). Of the stable values, 2 has the lowest PM headline error; 1 is close (fitted GEH two points higher, headline error two points worse) and is the runner-up. On the through-car check, 1 is the best of the sweep; the choice did not use it.

### Demand

`npm run data` rebuilt the shipped and cross-validation demand on the new assignment (network and split unchanged). The delay-feedback loop ran to its stop rule. PM seeds 1 to 10:

| Iteration | Removals/h | Headline shares (47 / 47 / 68 / 45), error | Through cars HSB / CSB / HNB / CNB | 62nd St / Forest St EB | Telegraph Ave SB, s | GEH<5 fitted / held out, all stations | Cost gap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | 1.2 | 53 / 51 / 53 / 34, 8.9 | 155 / 160 / 96 / 147 | 130 / 275 | 357 | 63% / 57% | - |
| 1 | 6.2 | 56 / 46 / 58 / 44, 5.3 | 123 / 131 / 93 / 141 | 82 / 145 | 370 | 70% / 59% | 0.321 |
| 2 | 5.4 | 57 / 46 / 72 / 46, 4.1 | 110 / 115 / 96 / 152 | 53 / 153 | 361 | 67% / 57% | 0.109 |
| 3 | 8.0 | 56 / 42 / 71 / 39, 5.8 | 114 / 121 / 89 / 144 | 62 / 190 | 372 | 65% / 55% | 0.077 |

Converged at iteration 3. Every iteration has four to seven times the removals of the free-flow costs, so the rule restored the demand (edaae9760f406e08). As in rounds 28 and 30, the measured delays move traffic toward the counts (at iteration 2 the southbound through cars are inside their ranges and three headline shares are within 4 points) by loading the arterials until the PM peak is no longer stable.

### Result: ten seeds

PM, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes, fingerprint 60df28cd94a0, `npm run assess -- --publish --noise`. Round 30 values in brackets.

| Seeds 1 to 10 | Target | PM peak | AM peak | Midday |
| --- | --- | --- | --- | --- |
| Through cars, all study-area local streets (intent tally) | | 931 (1,033) | 505 (502) | 405 (385) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 (PM) | 155 / 160 / 96 / 147 (193 / 213 / 87 / 154) | no whole-street counts | no whole-street counts |
| Headline shares HNB from / CNB from / HSB to / CSB to | 47 / 47 / 68 / 45 (PM) | 52.9 / 50.7 / 52.8 / 34.1, 2 of 4, error 8.9 (52.4 / 38.4 / 46.1 / 30.3, error 12.7) | 51.4 / 42.3 / 57.6 / 44.6 (53.7 / 45.8 / 60.8 / 47.6) | 53.4 / 37.3 / 60.7 / 43.7 (51.6 / 36.0 / 55.0 / 42.6) |
| Removals per hour (D16) | below 1 | 1.20, 0 to 3 per seed (1.60) | 0.00 (0.10) | 0.00 (0.00) |
| Entry backlog, mean % of spawned | below 2% | 0.67 (0.22) | 0.03 (0.02) | 0.01 (0.01) |
| Completed trips | | 25,788 (24,919) | 22,623 (22,200) | 16,694 (16,144) |
| Recent stations below GEH 5, fitted / held out | above 85% | 71 of 92 (77%) / 13 of 24 (54%) (66 of 92, 72% / 11 of 24, 46%) | 65 of 77 (84%) / 14 of 19 (74%) (71 of 77, 92% / 14 of 19, 74%) | no counts |
| 62nd St / Forest St eastbound, veh/h | 59 / 66 counted | 130 / 275 (206 / 241) | 50 / 113 | |
| Telegraph Ave NB / SB, s | 302-420 / 300-376 | 345 / 357 (349 / 378) | 305 / 316 | |

### Who the through cars are now

`calibrate --od-costs` as in round 30, PM seeds 1 to 4, completed through trips, on this round's engine and demand (round 30 in brackets, its own engine and round 29 demand). Classes as in round 30: an assumed movement (more than half of the trip's origin-destination flow carries one), the router's best route on mean costs, or a route the router ranked costlier on mean costs at departure.

| Through cars an hour | Hillegass Ave SB | Colby St SB | 62nd St EB | Forest St EB |
| --- | --- | --- | --- | --- |
| All | 132 (177) | 141 (167) | 74 (96) | 187 (181) |
| Making an assumed movement | 81 (83) | 28 (26) | 7 (7) | 10 (6) |
| On the router's best route | 4 (13) | 5 (8) | 4 (12) | 23 (42) |
| On a route ranked costlier (median excess) | 46 (82; 47 s, 8%) | 107 (134; 53 s, 10%) | 63 (77; 44 s, 7%) | 154 (133; 44 s, 8%) |

The costlier group fell by 36, 27 and 14 cars an hour on Hillegass Ave SB, Colby St SB and 62nd St and rose by 21 on Forest St. Under the new model a driver on a route 8% to 10% costlier on mean costs is an expected outcome: on a 500 s trip at β = 2 the perceived difference of two routes has a standard deviation of about 45 s. What remains is the size of that group on the side streets compared with the arterials, that is, how close the measured costs of the two are. Round 30 found the College Ave southbound approach to College Ave / Claremont Ave / 62nd St to be the largest delay on the arterial alternatives; the fit above shows that loading the arterials with their measured delays brings the southbound through cars into range only at the cost of stability.

### Verdict

Status `uncalibrated`. D16 fails in the PM peak (1.2 an hour against below 1) and holds in the AM peak and midday. D5 fails (2 of 4 headline shares within 10 points; error 8.9 points against 12.7). The through-car check fails on all four PM blocks, but less: Hillegass Ave SB 155 against 79 to 120 (193 before), Colby St SB 160 against 39 to 117 (213), Hillegass Ave NB 96 against 48 to 95, Colby St NB 147 against 102 to 145. The station rule fails in both peaks; the PM fitted share rose from 72% to 77% and the AM share fell from 92% to 84%.

### What remains off

- Southbound through cars on Hillegass Ave and Colby St stay about 1.3 to 1.4 times the top of their ranges, and Forest St eastbound is four times its count. The remaining cause is the measured cost of the arterial alternatives against the side streets: with their measured delays fed back, the fit brings the southbound blocks into range and jams the PM peak. The College Ave / Claremont Ave / 62nd St signal (southbound College Ave) was not attempted in this round.
- β = 2 s is an ASSUMPTION fitted to this area; β = 1 s is close on the fitted evidence.
- Telegraph Ave southbound (316 s) and College Ave northbound are slower than the observed AM range; Shattuck Ave is slower than observed in both peaks.
- Field checks of round 30 still open. Stored proposal results, text pages and previews were made on an older engine and are stale.

## Thirtieth round: who the excess through cars are (change calibration-round-30)

The question of this round: which trips make up the excess through cars on Hillegass Ave and Colby St southbound, 62nd St eastbound and Forest St eastbound, and which arterial movement or cost term makes the side street win for them? Diagnosis first, on the round 29 engine, network and demand; then the junctions that produce removals, checked against OSM and repaired at the source; then the delay-feedback fit on the repaired engine; then the ten-seed evaluation. Decisions are in `openspec/changes/calibration-round-30/design.md`. Simulator fingerprint 447ddb0b99a9 at the start; 7b94e620c9d8 after this round's engine edits (a diagnostic view and a reset repair, no change to any run); 169f9cf71eef after the trip-tracing change (explain-traffic-redistribution) merged into main during the round, whose uid repair changes every run; 09963f723083 after a last merge at the end of the round, which leaves the baseline unchanged (PM seed 1 identical to the link). Network a64c2a63399e5423 to 69f62ad981d0b8fa, demand 83bdd362657a2305 to c4420aa7aeecc473, frozen split unchanged.

### Diagnosis: who the excess through cars are

`calibrate --od-costs` (new) keeps the router's link and movement costs once a minute and, for each through trip on the counted blocks and on links 2622 and 2697 (the counted 62nd St and Forest St eastbound blocks), costs the surface part of the route the trip drove and the cheapest route with the study area's residential and service streets closed, on the costs in force when the trip asked to depart. Each cost splits into the router's terms: measured link and movement time, movement traversal time, turn penalty, control constant and local-street weight. The tool also finds the router's cheapest unrestricted route, so each trip falls in one of three classes: it makes an assumed movement (more than half of its origin-destination flow carries one: the Alcatraz Ave turn-ins and on-ramp choices of the volunteer count), it drives the router's best route, or it drives a route the router ranked costlier at departure. With the route noise off, a copy of the router reproduces the driven route of about 90% of the trips that make no assumed movement, which checks the method. Round 29 network and demand, PM seeds 1 to 4, completed trips.

The first pass gave nonsense (trips crossing 2 km in 4 s). The settle interval cleared the trip records but not the trip timings, so the two lists were out of step. Repaired (both are cleared at time zero; the tool matches by trip id; a test covers it). No run result depends on the timings.

| PM, seeds 1 to 4, through cars an hour (repaired / historical engine) | Hillegass Ave SB | Colby St SB | 62nd St EB | Forest St EB |
| --- | --- | --- | --- | --- |
| All through cars | 177 / 96 | 167 / 85 | 96 / 26 | 181 / 87 |
| Making an assumed movement | 83 / 77 | 26 / 30 | 7 / 4 | 6 / 2 |
| On the router's best route | 13 / 1 | 8 / 4 | 12 / 0 | 42 / 26 |
| On a route the router ranked costlier (median excess) | 82 / 18 (62 s, 10%) | 134 / 51 (74 s, 12%) | 77 / 22 (63 s, 10%) | 133 / 60 (40 s, 8%) |

By origin and destination group (repaired / historical, cars an hour; costs on the repaired engine, side street against arterial, s):

| Group | Hillegass Ave SB | Colby St SB | 62nd St EB | Forest St EB | Router cost at departure | Simulated time along the route |
| --- | --- | --- | --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave to south-east Oakland | 30 / 9 | 55 / 15 | 18 / 5 | 58 / 12 | 653 against 601 (Hillegass Ave), 657 against 597 (Colby St) | 477 against 472, 477 against 470 |
| Telegraph Ave from the north to the SR-24 westbound on-ramps | 33 / 32 | 10 / 12 | 2 / 1 | 2 / 0 | assumed movements (on-ramp choice) | |
| Berkeley side streets to the SR-24 westbound on-ramps | 24 / 21 | 20 / 20 | 0 / 0 | 24 / 10 | 416 against 437 (Colby St), 364 against 442 (Forest St) | 293 against 345, 255 against 355 |
| Ashby Ave from the west to College Ave north, by way of 62nd St | 23 / 2 | 11 / 1 | 34 / 3 | 0 / 0 | 710 against 677 (62nd St) | 561 against 565 |
| West Oakland to south-east Oakland | 0 / 0 | 0 / 0 | 0 / 0 | 34 / 34 | 369 against 432 | 254 against 336 |

What the counts imply: on Hillegass Ave southbound the volunteer count's turn-ins imply 87 (78 to 110) freeway-bound through cars an hour, and the model's assumed movements carry 83; the count's range for all through cars (79 to 120) leaves 0 to 33 for the rest, where the model has 94. On Colby St southbound the turn-ins imply 46 (39 to 72), the assumed movements carry 26, and the rest is 141.

What makes the side street win, plainly:

1. Most of the excess is trips that the router's own costs did not send there. On Colby St southbound 134 of 167 through cars an hour, on Hillegass Ave southbound 82 of 177 and on Forest St eastbound 133 of 181 drove a route that cost 8% to 12% (40 to 75 s) more at departure than the router's best route. The term that sends them is the perceived-cost noise of the route walk: at every node the walk multiplies the whole remaining cost of each candidate by a per-driver factor between 0.92 and 1.08 (`ROUTE_NOISE` 0.08, ASSUMPTION, no source). A long trip meets one such draw per intersection, the side-street grid offers one at every block, and on simulated times the two routes of the largest group are within 10 s of each other. The en-route switch rule perturbs each link's own cost instead, so the two rules disagree on the size of the error.
2. The trips that do take the best route through the side streets win on measured time: their arterial alternatives take 41 to 117 s longer, mostly at the College Ave southbound approach to College Ave / Claremont Ave / 62nd St (20 to 29 s per trip), Claremont Ave at Colby St / Forest St (7 to 10 s), Telegraph Ave southbound at 52nd St, 56th St and Aileen St (5 to 12 s each) and Alcatraz Ave eastbound at College Ave (4 to 10 s). The local-street weight adds 18 to 37 s to the side-street route and the control constants are about even, so neither offsets the measured time.
3. The growth from the historical to the repaired engine is in two groups: Berkeley side streets north of Alcatraz Ave to south-east Oakland (the arterial alternative is Telegraph Ave through the SR-24 interchange to 51st St and Broadway, or Alcatraz Ave and College Ave to Broadway) and Ashby Ave from the west to College Ave north, which loops by way of 62nd St instead of turning left from Alcatraz Ave onto College Ave.

Route-noise sensitivity (PM seeds 1 to 4; Hillegass Ave SB / Colby St SB through cars, 62nd St / Forest St eastbound veh/h, removals per hour, Telegraph Ave SB s): noise 0: 213 / 179, 246 / 324, 9.8, 450; 0.04: 186 / 170, 181 / 296, 4.5, 423; 0.08 (shipped): 204 / 193, 203 / 259, 4.3, 378; 0.16: 264 / 308, 276 / 279, 23.8, 380. Without noise all drivers take the same route, Telegraph Ave southbound slows and the side streets become the best route outright, so the size of the noise is not the lever; its form is. Not changed: a dispersion model drawn once per driver over link costs (as in probit route choice) needs a verified source and its own change.

### Removal hot spots

Removals by the node at the end of the link where the vehicle was removed, round 29 state, seeds 1 to 10 (per hour): PM 62nd St / Martin Luther King Jr Way 0.9, Adeline St / Alcatraz Ave 0.5, 60th St / Market St 0.4, 63rd St / King St 0.4, Ellis St / Harmon St circle 0.4, 62nd St / California St circle 0.3, and 0.1 to 0.3 at nine more nodes; AM Harmon St / King St circle 0.4, Adeline St / Alcatraz Ave 0.4, 62nd St / Martin Luther King Jr Way 0.3, and 0.1 at nine more. All lie west of Telegraph Ave. Each was checked against the OSM tags of its ways and nodes and against the queues in the seed reports.

| Junction | What the seed reports show | OSM check | Class | Action |
| --- | --- | --- | --- | --- |
| Market St / Stanford Ave (signal) and Adeline St / Martin Luther King Jr Way / Stanford Ave (signal) | The adaptive plan gave the Stanford Ave approach 42 to 94 s of green against 15 to 33 s for Martin Luther King Jr Way and Adeline St; Stanford Ave carried about 990 veh/h on one lane | Ways 24606482 (`turn:lanes=left||`) and 198550073 + 416112079 (`||right` on the last) have no `lanes` tag; the importer took the class default of one lane | import | Lane count from `turn:lanes` when `lanes` is missing, one-way chains, after chain merging [OSMTurnLanes]; Stanford Ave 941 and 4139 and 51st St 1699 become 3 lanes; no link id changes |
| 62nd St / Martin Luther King Jr Way, 61st St and 63rd St on the frontage road | Queue on the residential frontage road waiting to join the main northbound carriageway at a stop (node 478), whose own queue backed up from the Stanford Ave signal | Frontage road and stop tagged as modeled (`stop=minor`, way 653922774) | spill-back from the row above | None; gone after the repair (PM 0.9 to 0.1 an hour) |
| 60th St / Market St (two-way stop) | 60th St (11 veh/h) waited for room on the 31 m Market St link into the Market St / Stanford Ave signal | Tags as modeled | spill-back from the first row | None; gone after the repair |
| Adeline St / Alcatraz Ave (signal; two signals of a divided street joined) | Adeline St northbound (about 1,300 veh/h on 3 through lanes, short 50 m approach) queued at the signal; the cause was not isolated | Lanes and turn lanes as tagged | not settled: demand on a model-edge corridor, or the joined signal's plan | None; no removals there after the repair and refit (the change in demand may account for it) |
| 63rd St / King St (two-way stop) | King St (about 285 veh/h) waiting at the stop to cross or join 63rd St | Tags as modeled | demand near the model's west edge | None; no removals there after the repair and refit |
| Harmon St circles (Ellis St, King St, California St) | Entries blocked by circulating traffic | Mini-roundabouts as tagged | primitive (repaired in round 29) and demand | None; 0.1 an hour or less after the repair |
| Idaho St at 59th St and 61st St (two-way stops), 61st St / San Pablo Ave | Minor approaches crossing heavy streets near the model's west edge | Tags as modeled | real over-demand at a model-edge gate | None; 0.5 an hour together after the repair |
| Telegraph Ave north of 55th St, northbound (requested check) | One lane for 30 m after the 55th St signal | Way 416105064: `lanes=3`, `lanes:forward=2` (`left|`), `lanes:backward=1`; the northbound approach south of the signal has two through lanes (`left||`) and the way north has 4 lanes | data (tagging artifact) | `osmTagOverrides` sets 4 lanes, 2 northbound, ASSUMPTION pending a field check; Telegraph Ave northbound 364 to 355 s on PM seeds 1 to 4, the rest within the seed spread |

The first version of the lane repair changed the lane count before chain merging and renumbered 3,123 links. The frozen split names stations by link id, so renumbering would have moved stations between the fitted and held-out sets; the rule now runs on the finished links. No node was exempted from removal and the 180 s hold limit is unchanged.

After both repairs and `npm run data` (network 69f62ad981d0b8fa, demand c4420aa7aeecc473, frozen split unchanged), PM seeds 1 to 10: removals 1.00 an hour (0 to 3 per seed) against 4.50; the nodes left are Idaho St at 59th St (0.3) and 61st St (0.2) and five nodes at 0.1. AM seeds 1 to 3 of the cost loop's first iteration: none.

### Demand on the repaired engine

The network changed, so `npm run data` rebuilt the shipped and the cross-validation demand from the unchanged frozen split. Then the delay-feedback loop (`tools/cost-loop.ts` [PowellSheffi1982]) ran to its own stop rule. Its acceptance rule used to read the held-out GEH shares as a guard; it now decides on removals, backlog, the headline-share error and the fitted GEH shares only, and reports the held-out shares. The through-car ranges are not targets in `rockridge.targets.json` (the calibrate report checks through cars against them beside the headline shares) and played no part.

| Iteration (merged engine 169f9cf71eef, PM seeds 1 to 10) | Removals/h | Headline shares (47 / 47 / 68 / 45), error | Through cars HSB / CSB / HNB / CNB | 62nd St / Forest St EB | Telegraph Ave SB, s (link times summed, not scaled) | GEH<5 fitted / held out, all stations | Cost gap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | 1.6 | 52 / 38 / 46 / 30, 12.7 | 193 / 213 / 87 / 154 | 206 / 241 | 381 | 60% / 60% | - |
| 1 | 7.0 | 49 / 36 / 61 / 41, 6.1 | 155 / 186 / 85 / 165 | 119 / 167 | 406 | 67% / 60% | 0.233 |
| 2 | 14.4 | 57 / 41 / 67 / 37, 6.1 | 151 / 200 / 74 / 143 | 80 / 322 | 477 | 65% / 62% | 0.134 |
| 3 | 5.2 | 55 / 41 / 68 / 45, 3.6 | 134 / 174 / 77 / 131 | 71 / 150 | 394 | 72% / 57% | 0.068 |

The cost gap fell below 0.10 at iteration 3, so the loop stopped converged. Every iteration had three to nine times the removals of the free-flow and BPR costs, so the rule rejected all of them and restored the demand (c4420aa7aeecc473, `rockridge.cost-loop.md`). At iteration 3 all four headline shares are within 10 points, Hillegass Ave and Colby St northbound through cars are inside their ranges and 62nd St eastbound is 71 against 59 counted, but the southbound blocks stay above their ranges (134 and 174) and Telegraph Ave slows. As in round 28, feeding the simulated delays back moves through traffic toward the observed shares by loading Telegraph Ave and the streets west of it until they jam. The same loop run on the round's engine before the trip-tracing change merged (7b94e620c9d8) gave the same verdict: removals 1.0, 8.2, 11.3 and 8.1 an hour, converged at iteration 3 (gap 0.076) with through cars 126 / 164 / 79 / 138.

### Result: ten seeds

PM, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes, merged engine 169f9cf71eef, `npm run assess -- --publish --noise` (reports in `reports/`, `rockridge.assessment.md`). Round 29 values in brackets.

| Seeds 1 to 10 | Target | PM peak | AM peak | Midday |
| --- | --- | --- | --- | --- |
| Through cars, all study-area local streets | | 1,033 (1,081) | 502 (537) | 385 (396) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 (PM) | 193 / 213 / 87 / 154 (192 / 210 / 91 / 159) | no whole-street counts | no whole-street counts |
| Headline shares HNB from / CNB from / HSB to / CSB to | 47 / 47 / 68 / 45 (PM) | 52.4 / 38.4 / 46.1 / 30.3, 2 of 4 (52.9 / 37.6 / 46.1 / 31.6) | 53.7 / 45.8 / 60.8 / 47.6 (52.7 / 45.4 / 58.2 / 48.5) | 51.6 / 36.0 / 55.0 / 42.6 (52.0 / 35.9 / 53.7 / 44.3) |
| Removals per hour (D16) | below 1 | 1.60, 0 to 3 per seed (4.50) | 0.10 (2.00) | 0.00 (0.00) |
| Entry backlog, mean % of spawned | below 2% | 0.22 (0.17) | 0.02 (0.01) | 0.01 (0.01) |
| Completed trips | | 24,919 | 22,200 | 16,144 |
| Recent stations below GEH 5, fitted / held out | above 85% | 66 of 92 (72%) / 11 of 24 (46%) (65 of 92, 71% / 11 of 24, 46%) | 71 of 77 (92%) / 14 of 19 (74%) (70 of 77, 91% / 14 of 19, 74%) | no counts |
| 62nd St / Forest St eastbound, veh/h | 59 / 66 counted | 206 / 241 (196 / 264) | | |
| Telegraph Ave NB / SB, s | 302-420 / 300-376 | 349 / 378 (372 / 375) | | |

The PM removals left are spread over Idaho St at 59th St and 60th St, the Harmon St circles, 62nd St / California St and 63rd St / King St (0.1 to 0.2 an hour each). The AM peak now meets D16. Through cars, headline shares and stations moved by less than the spread between ten-seed sets.

### Verdict

Status `uncalibrated` (no experimental period, as in rounds 28 and 29). D16 holds in the AM peak and midday and fails in the PM peak (1.6 an hour). D5 and the through-car check fail in the PM peak, and the station rule fails in the PM peak and, out of sample, in the AM peak. Hillegass Ave and Colby St southbound through cars stay at about 1.6 and 1.8 times the top of their ranges.

### What remains off

- Route choice. Most of the excess southbound through cars drive a route the router itself ranks costlier at departure. The walk applies the per-driver noise to the whole remaining cost at every node; a dispersion model drawn once per driver over link costs, with a verified source, is the next candidate. It changes model behavior and run time, so it needs its own change.
- The College Ave southbound approach to College Ave / Claremont Ave / 62nd St is the largest single delay on the arterial alternatives (20 to 29 s per diverted trip); 62nd St eastbound enters the same signal on its own phase. Round 29 found that the observed 2010 timing costs stability.
- Telegraph Ave southbound through the SR-24 interchange stays just above the slowest observed year (378 s against 300 to 376). Lane changes along a link (case b9) and offsets at the interchange were not attempted: neither has a verified source yet, and the diagnosis points first at route choice.
- Field checks: Telegraph Ave north of 55th St (lanes in each direction; the override is an ASSUMPTION), Stanford Ave between Market St and Martin Luther King Jr Way and 51st St east of Telegraph Ave (lane counts read from `turn:lanes`).
- Station ids are link ids, so an import repair that renumbers links would break the frozen split; the lane repair of this round avoids that by acting on finished links.
- Stored proposal results, text pages and previews were made on an older engine and are stale.

