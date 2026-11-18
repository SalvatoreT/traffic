## Context

Validation fails five primitives with no reviewed exception: p2, p3, l1, b13 and h4. Two behaviors lie behind three of them. Permissive left turns at signals are served too fast against moderate and heavy opposing flow (p2, p3; l1 is the same behavior on a two-lane approach). And a gate whose first link forks holds trips for the free branch behind trips for the queued one (h4). The queue-first left-turn model of round 33 follows the cited method and brings p2 and p3 into their ranges, but round 33 measured it as less stable on the Rockridge PM peak and left it off. The round 38 gate fix raised h4 from 0.43 to 0.64 and was not landed, to keep the fingerprint. Simulator fingerprint at the start 4fba23cc4474ee85c5e37d26b57fa4af; network f9fa09a57266, demand e4f199391682 and cross-validation demand e480933c18b9 throughout. The work ran on 2026-11-18.

## Decisions

D1. Decisions by the project lead, 2026-11-18 (by card). p2 and p3 stay unreviewed and get a repair. l1 and b13 stay unreviewed. The h4 fix lands together with the next simulator change, so that proposals are searched once. No validation deviation is marked reviewed in this change: that is the lead's call.

D2. Reproduction. The published inputs were downloaded over HTTPS (the download stopped at a 404 for a file of another area; the rest was copied from the main checkout). The baseline binary has fingerprint 4fba23cc4474ee85c5e37d26b57fa4af, and its ten-seed runs reproduce the published assessment: PM judged clearings 0.10 an hour, fitted stations 78 of 92, held out 12 of 24; AM fitted 66 of 77, held out 14 of 19; validation 62 of 74. The cross-validation demand was taken from the main checkout's `target/validation`; its `build` record matches the shipped demand's (split be72380b, config, network and count file), and it was not rebuilt.

D3. Why the queue-first model looked unstable. PM seeds 1 to 10 on the baseline binary with `--queue-first-left`, against the same seeds without it:

| PM, seeds 1 to 10 | Earlier rule | Queue-first |
| --- | --- | --- |
| Cars cleared from gridlock near the study area (judged, D16) | 0.10 an hour | 0.00 |
| Cars cleared from gridlock in all | 3.4 an hour | 3.9 |
| Of them at Adeline St / Alcatraz Ave (total over ten seeds) | 4 | 10 |
| Entry backlog | 0.27% | 0.32% |
| Courtesy admissions an hour | 352 | 258 |
| Adeline St northbound / southbound into Alcatraz Ave, veh/h | 1,572 / 1,218 | 1,385 / 1,405 |

Round 33 counted every car cleared from gridlock on an older network and demand. Under the judged rule of round 37 the queue-first model is not less stable near the study area: every added clearing is far, the nearest 645 m from the judged zone (Ashby Ave / College Ave). A diagnostic build (not kept) printed, for each car cleared, its movement, the control, its total wait and the time it had been held by a full exit. Over the ten seeds (with the gate fix of D6 in both runs) 31 cars were cleared with the earlier rule and 52 with queue-first. The added clearings are of two kinds:
- Permissive left-turners at signals, cleared after more than 180 s of waiting although a full exit had held them for only 6 to 16 s; they had waited 57 to 80 s of green for gaps. Four of them were Adeline St northbound at Alcatraz Ave (link 1051, from the pocket), one Ashby Ave at College Ave. The gridlock breaker removes a car that has waited `GRIDLOCK_REMOVE_S` in all and finds its exit full at that moment, so a left-turner starved of gaps over several cycles counts as gridlock.
- Spillback upstream of such approaches into the unsignalized grid around 59th to 61st St, San Pablo Ave, Genoa St and Adeline St, where clearings at two-way stops and uncontrolled nodes held by a full exit for the whole wait increase. That grid already has the most far clearings with the earlier rule.

The mechanism at Adeline St / Alcatraz Ave: with the earlier rule, northbound left-turners went ahead of the starting southbound queue (a starting car counted as 4 to 6 s away) and after 45 s took courtesy entries, so the southbound approach carried less than it was offered. With queue-first the southbound approach gets its green back (1,218 to 1,405 veh/h) and the northbound left waits for gaps in it; northbound carries 1,385 instead of 1,572. The model gives Adeline St four lanes each way there, and the left-turn phasing guideline of [FHWA-STM2008] (Figure 4-11, re-read: a left-turn phase where the opposing approach has four or more through lanes, or where the product of left-turn and opposing volume exceeds 50,000 with one opposing lane or 100,000 with two or three) would give that left a protected phase. Whether the field signal has one is not known. Of the mechanisms the brief named, the evidence supports three: the courtesy rule, whose removal gives the opposing queue its green back; permissive lefts starved of gaps where the guideline would give a protected phase; and the spillback upstream of them. It does not point at shared lanes without a pocket: both starved approaches have one. The sneaker rule is the same under both rules; whether sneakers clear on every cycle at these approaches was not traced.

D4. Queue-first becomes the default. `Config::queue_first_left` is now on unless set to `Some(false)`; `calibrate --no-queue-first-left` restores the earlier rule and the manifest records `queueFirstLeft`. Every part of the rule traces to a verified key: the left turn waits for the opposing queue and then uses gaps [Fambro1991], critical gap 4.5 s (`TC_PERMITTED_LEFT`) [Fambro1991], at most two sneakers a cycle (`SNEAKERS`) [Fambro1991] [FHWA-STM2008] 4.8.4, no courtesy or fallback for a permissive left at a signal (its way out is the gap after the queue or the change interval [FHWA-STM2008] 4.8.4). The arrival estimate (`approach_time`) uses each driver's acceleration parameter of the car-following model [Treiber2000]; it adds no parameter. Nothing was tuned to buy stability: no parameter was changed from round 33's model. Still labeled ASSUMPTION and unchanged: the sneakers wait at the stop line rather than inside the junction; the 3-vehicle class-rule pocket; the 180 s gridlock breaker.

D5. Not changed: the gridlock breaker. D3 shows that the breaker counts a permissive left-turner starved of gaps as gridlock. Counting only the time a car has been held by a full exit would match the stated rule of `GRIDLOCK_REMOVE_S` ("blocked by no downstream space this long") more closely, but it changes the D16 count for every run and every period. It is a decision for the lead and is left out of this change.

D6. Gate fork. The round 38 patch was re-applied by hand to the current code (the spawn loop had moved): a waiting trip waits only behind trips with the same first link and fork branch (`fork_band`). It reproduces round 38: h4 0.43 to 0.64, every other case unchanged. The remaining gap is the scan limit. In h4 the queued branch is offered 3,000 veh/h and passes about 1,500, so its waiting trips pile up at about 1,500 an hour; after about 20 minutes more than 512 of them stand ahead of any trip for the free branch, and the gate examines only the first 512 waiting trips in a step, so the free branch's trips are never reached. With the limit lifted h4 is exactly 1.00 (897 against 897 veh/h). The fix keeps the limit (ASSUMPTION) but no longer counts a trip whose route is already planned and whose first link and branch are already blocked in the step, so trips passed over behind a blocked branch do not use up the limit. h4 is 1.00 and no other case changes; h4 alone runs in 0.4 s. The range of h4 is an ASSUMPTION (a gate stands for a multilane road whose vehicles arrive side by side). The lane drop on the Martin Luther King Jr Way off-ramp (case i5) is not changed.

D7. Validation, seed 1, before (fingerprint 4fba23cc) and after (d45a275d). Every case whose value moved:

| Case | Before | After | Range after | Result |
| --- | --- | --- | --- | --- |
| p1, permissive left, opposing 200 | 444 | 411 | 364 to 497 | pass, pass |
| p2, opposing 400 | 402 | 246 | 190 to 339 | FAIL, pass |
| p3, opposing 600 | 369 | 120 | 32 to 170 | FAIL, pass |
| h4, gate fork, free branch | 0.43 | 1.00 | 0.90 to 1.10 | FAIL, pass |
| b4, 1 lane, 20% left, pocket, opposing 500 | 924 | 837 | 918 to 1,211 | pass, FAIL |
| l1, 2 lanes, 20% left, overflowing pocket | 792 | 646 | 835 to 1,044 | FAIL, FAIL |
| b3, 1 lane, 10% left, pocket | 915 | 888 | 813 to 1,073 | pass, pass |
| b9, 2 lanes, 10% left, pocket | 870 | 821 | 809 to 1,067 | pass, pass |
| b5, 1 lane, 10% left, no pocket | 543 | 420 | 301 to 722 | pass, pass |
| b6, 1 lane, 20% left, no pocket | 489 | 420 | 242 to 686 | pass, pass |
| b12, all left, no opposing | 837 | 846 | 645 to 1,012 | pass, pass |
| i2, off-ramp flaring at a signal | 446 | 444 | 417 to 556 | pass, pass |
| j3, signal with 600 pedestrians/h | 0.79 | 0.74 | 0.60 to 1.00 | pass, pass |
| j4, signal with 50 cyclists/h | 0.87 | 0.81 | 0.70 to 1.00 | pass, pass |
| j6, signal with 300 cyclists/h | 0.63 | 0.62 | 0.70 to 1.00 | FAIL (reviewed), FAIL |

64 of 74 pass (62 before). The ranges of the b and p cases move a little because each is a formula of the green share, which the adaptive plan sets from the flows it measures; `cases.json` carries the new bounds, sources and units unchanged. b4 passed before and fails now. It falls only with opposing flow: 993 veh/h with none under either rule, 951 at 250 veh/h (1,005 before), 837 at 500. Left-turners now wait for the opposing queue, so the assumed 3-vehicle pocket fills and the next left-turner most likely holds the through lane (inferred, not traced); the range assumes the left turns never hold it. b4 is listed as a deviation, not reviewed. l1 is still outside its range but now inside the 364 to 682 per lane that the [Fambro1991] method gives for it. p2, p3 and h4 pass and leave the deviation list, as the regression test requires. b13 and the reviewed failures are unchanged.

D8. Ten seeds, all three periods, before and after, on the shipped demand (fitted stations) and the cross-validation demand (held-out stations, out of sample), `tools/assess.ts --suffix` on the two binaries:

| | PM before | PM after | AM before | AM after | Midday before | Midday after |
| --- | --- | --- | --- | --- | --- | --- |
| D16: cars cleared from gridlock near the study area, an hour | 0.10 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| Cars cleared from gridlock in all, an hour (far) | 3.4 | 5.2 | 0.9 | 1.8 | 0.0 | 0.0 |
| Entry backlog, mean (max) | 0.27% (0.73%) | 0.24% (0.54%) | 0.21% (0.74%) | 0.26% (0.69%) | 0.01% | 0.01% |
| D5 headline shares within 10 points, error | 4 of 4, 2.6 | 4 of 4, 3.7 | | | | |
| Station rule, recent counts, fitted | 78 of 92 | 78 of 92 | 66 of 77 | 67 of 77 | no counts | |
| Station rule, recent counts, held out (out of sample) | 12 of 24 | 13 of 24 | 14 of 19 | 14 of 19 | no counts | |
| Older counts, fitted / held out | 64 of 95 / 15 of 34 | 59 of 95 / 14 of 34 | 33 of 48 / 8 of 16 | 33 of 48 / 10 of 16 | | |
| Whole street Hillegass Ave NB / Colby St NB (counted 48 / 102 PM, 34 / 33 AM) | 63 / 86 | 65 / 85 | 47 / 53 | 51 / 54 | | |
| Whole street Hillegass Ave SB / Colby St SB (counted 79 / 39 PM, 36 / 46 AM) | 77 / 59 | 81 / 56 | 36 / 26 | 38 / 24 | | |
| Telegraph Ave NB / SB, s (observed PM 302-420 / 300-376, AM 280-315 / 245-285) | 321 / 313 | 321 / 339 | 300 / 279 | 302 / 286 | | |
| Trips waiting at the SR-24 mainline gate at the end, seed mean | 54 | 33 | 1.7 | 2.1 | 0.1 | 0.1 |
| Through cars Hillegass Ave NB / Colby St NB / Hillegass Ave SB / Colby St SB | 99 / 148 / 123 / 140 | 109 / 150 / 128 / 135 | 76 / 90 / 67 / 66 | 86 / 89 / 70 / 67 | 62 / 82 / 88 / 88 | 65 / 83 / 87 / 88 |

All eight whole-street traversals stay within GEH 5 (largest 3.7, AM Colby St SB). The gate figure is read from each seed's table of the ten origins with most trips waiting; a seed where the gate is not in it counts as 0 (fewer trips wait there than at the tenth origin). AM Telegraph Ave southbound moves from 279 s to 286 s and leaves its observed range (245 to 285 s) by 1 s. Counted PM left turns (35 turning-movement stations whose approach and leg make a left, at signals and elsewhere; 4,329 veh/h counted) fall from 3,937 to 3,756 veh/h in the model and pass GEH 5 at 22 rather than 21; the other 38 movements do not change in sum.

PM seeds 11 to 20 (calibrate `--seeds 11-20` on each binary, shipped demand): cars cleared from gridlock near the study area 0.00 before and after; in all 1.7 and 4.3 an hour, all far, 10 of the 43 after at Adeline St / Alcatraz Ave; backlog 0.24% and 0.21%; through cars Hillegass Ave NB / Colby St NB / Hillegass Ave SB / Colby St SB 93 / 143 / 119 / 133 and 102 / 137 / 120 / 136; whole-street traversals 56 / 81 / 74 / 57 and 58 / 80 / 74 / 53 (Hillegass Ave NB, Colby St NB, Hillegass Ave SB, Colby St SB).

Tests: `cargo test --release --workspace` passes. Two unit tests changed: the golden metrics of the signalized cross move in the third digit (the south-to-west left now waits for the opposing queue), and the permissive-left capacity test now checks the [Fambro1991] band (279 veh/h against about 237 to 406), with a second test that the earlier rule (`Some(false)`) still serves more than 350. `npx vitest run` passes (93 files) once the OSM extract `data/osm/rockridge.overpass.json` is present; without it two files that read it fail, as on any checkout without the extract. `npx tsc --noEmit` passes. WASM parity and trace identity hold (`npm run check:wasm`, PM seed 1, 300 s: every field identical).

D9. No demand refit in this change, and none is clearly needed. D16 holds in every period on both PM seed sets, D5 holds, the fitted station rule is the same in the PM peak (78 of 92) and one station better in the AM peak, the held-out PM figure gains one station, and every whole-street traversal stays within GEH 5. Against that, the network-wide count of cars cleared from gridlock far from the study area rises (PM 3.4 to 5.2 and 1.7 to 4.3 an hour on the two seed sets, AM 0.9 to 1.8), PM older counts lose five fitted stations, and the counted left turns, already 9% under their counts, lose another 5%. The demand fit assigns with its own cost model, not the simulator's left-turn rule, so a refit would not by itself put the left turns back. The lead decides whether the far clearings call for one.

D10. What remains open, for the lead:
- b4 fails (new) and l1 fails; both ranges take the left-turn limit from the unsignalized gap formula on the hourly opposing flow and assume left-turners never hold the through lane. A range from the [Fambro1991] method with pocket storage would judge them against the rule now in the simulator. Not changed here: ranges are not moved to make a case pass.
- The gridlock breaker counts permissive left-turners starved of gaps as gridlock (D5).
- Signals with heavy permissive lefts where [FHWA-STM2008] Figure 4-11 would put a left-turn phase (Adeline St at Alcatraz Ave with four modeled opposing lanes) have no protected phase unless one is observed. Applying the guideline to unobserved signals would be an ASSUMPTION about the field; it needs the lead's decision or timing sheets.
- AM Telegraph Ave southbound is 1 s above its observed range.
- Stored proposal results, text pages and previews are out of date with the new fingerprint; proposals are searched again in the next change, by the lead's decision.
