# Rockridge baseline calibration record: archive, part 3

Rounds thirty to thirty-three, moved unchanged from `rockridge.record.md` in round 43 (2026-11-18); rounds thirty-four to thirty-six, moved unchanged in round 50 (2026-11-19); round thirty-seven, moved unchanged in round 51 (2026-11-19); round thirty-eight, moved unchanged when round 51 closed (2026-11-20); rounds thirty-nine to forty-one, moved unchanged when round 52 was recorded (2026-11-20); round forty-two, moved unchanged when round 52 was adopted (2026-11-20); round forty-three, moved unchanged when round 53 was recorded (2026-11-21). Newer rounds are in `rockridge.record.md`; older ones in `rockridge.record-archive-2.md` and `rockridge.record-archive.md`.

## Forty-third round: stop control at Hillegass Ave / 61st St and Canning St / 62nd St (change calibration-round-43)

Rejected. The two corrections were tried, failed the keep rule (design D11) and were taken out again on the project lead's decision of 2026-11-18 (design D13). The published network f9fa09a5726644d7, demand e4f1993916827e82 and cross-validation demand e480933c18b970f6 stand, and `npm run data` reproduces them after the revert. The assessment files in `data/calibration` are the published ones of 2026-11-17. The figures below are those of the trial.

On 2026-11-18 the project lead compared the stop control of all 36 side-street junctions in the study area with street-level imagery and decided two corrections by card (`openspec/changes/archive/2026-11-18-calibration-round-43/design.md`, D1 to D4). Hillegass Ave at 61st St is an all-way stop (high confidence, DATA); the model stopped 61st St only. At Canning St and 62nd St the eastbound 62nd St approach has no stop (medium confidence, ASSUMPTION pending a field check); the model stopped all four approaches. No other junction differed at medium confidence or better. Nothing was tuned in this round: the network was corrected, the demand rebuilt with `npm run data` on the frozen split, and the result assessed.

### What changed

- Network f9fa09a5726644d7 became 093cbd5469aad29c. Two nodes and three links differ and nothing else: node 53085953 `two_way_stop` to `all_way_stop` with `stopAtEnd` on both Hillegass Ave approaches (links 2673, 2676); node 53088342 `all_way_stop` to `two_way_stop` with `stopAtEnd` cleared on the eastbound 62nd St approach (link 1848). No link id moved, so the frozen split (be72380b485e) and the stations stand.
- The second correction needed a way to free one approach of a junction the map tags on its node: `stopExemptions` in the area config (design D5).
- Demand e4f1993916827e82 became 77ef92449de50092 and cross-validation demand e480933c18b970f6 became 09d3f3d769ead5ec. The fit uses static membership, as the published fit of 2026-11-17 does: since the measurement repair the build rejects the round-42 membership files for lack of matching evidence and says so in `data/demand/rockridge.fit.md`.
- Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9, unchanged. Validation 67 of 74, unchanged.

### Result: ten seeds

`npm run assess -- --publish --noise`, seeds 1 to 10, 60 minutes. The assessment of 2026-11-17 is in brackets.

| | Target | PM | AM | Midday |
| --- | --- | --- | --- | --- |
| D16: cars cleared from gridlock per hour, judged / far | below 1 | 0.00 / 1.10 (0.00 / 5.20), holds | 0.00 / 0.40 (0.00 / 1.80), holds | 0.00 / 0.00 (0.00 / 0.00), holds |
| Entry backlog, mean %, seeds under 2% | below 2% | 0.20, 10 (0.24, 10) | 0.13, 10 (0.26, 10) | 0.01, 10 (0.01, 10) |
| Headline shares HNB from / CNB from / HSB to / CSB to freeway | PM 47 / 47 / 68 / 45 | 51.2 / 45.0 / 51.3 / 42.9, 3 of 4, error 6.3, D5 fails (51.4 / 48.8 / 66.0 / 38.4, 4 of 4, error 3.7) | 3 of 4, error 7.2, not a rule (4 of 4, error 3.1) | 4 of 4, error 5.8 (4 of 4, error 1.8) |
| Recent stations GEH<5, fitted | above 85% | 72 of 92, 78% (78 of 92, 85%) | 69 of 77, 90% (67 of 77, 87%) | no counts |
| Recent stations GEH<5, held out (out of sample) | above 85% | 12 of 24, 50% (13 of 24, 54%) | 15 of 19, 79% (14 of 19, 74%) | no counts |

Whole-street traversals, cars an hour, simulated against counted (all fitted, so in sample):

| | Counted | PM modeled | Counted | AM modeled |
| --- | --- | --- | --- | --- |
| Hillegass Ave SB | 79 | 56 (81) | 36 | 19 (38) |
| Colby St SB | 39 | 58 (56) | 46 | 27 (24) |
| Hillegass Ave NB | 48 | 40 (65) | 34 | 43 (51) |
| Colby St NB | 102 | 84 (85) | 33 | 59 (54) |

All eight stay within GEH 5 (largest 3.9, Colby St NB in the AM).

The PM held-out misses near Howell St and Canning St, cross-validation demand against counted:

| Station | Counted | Modeled |
| --- | --- | --- |
| McAuley St, Howell St to Canning St, EB | 12 | 163 (161) |
| 60th St, Howell St to Canning St, EB | 23 | 136 (130) |
| Ayala Ave, Martin St to Howell St, NB | 60 | 172 (155) |
| 62nd St, Colby St to Canning St, EB | 11 | 22 (41), now within GEH 5 |

Two PM held-out stations are new misses: 62nd St Colby St to Canning St westbound, 1 against 19 counted, and Ayala Ave Martin St to Howell St southbound, 89 against 44.

### What moved

The two extra stops on Hillegass Ave take through cars off it. Whole-street traversals of Hillegass Ave fall by about a third in the PM peak, the fitted block from 63rd St to 62nd St southbound carries 95 against 168 counted (128 before), and the share of Hillegass Ave southbound cars bound for the freeway falls from 66.0% to 51.3% against 68% observed, which is what fails D5. The freed 62nd St approach draws more cars than the count: 62nd St from Canning St to Telegraph Ave eastbound carries 33 against 9 counted (22 in earlier runs on the previous network, made with an older simulator build). The other PM fitted stations that left GEH 5 are small counts on Dana St, 63rd St and Howell St. The AM peak moves the other way on Colby St southbound, where the blocks from 61st St to 63rd St now carry 141 and 150 against 167 and 171 counted (103 and 91 before).

The large held-out misses on McAuley St, 60th St and Ayala Ave did not move, so stop control at these two junctions does not explain them.

### Verdict

Status `uncalibrated`. By the keep rule written before the assessment (design D6) the result is worse than the assessment of 2026-11-17: recent PM fitted stations fall from 78 to 72 of 92, PM held-out stations from 13 to 12 of 24, and D5 fails in the PM peak, where it passed. Stability holds in every period, the eight whole-street counts stay within GEH 5, and the AM station counts rise. Following the project lead's instruction, the area note and caveat in `data/areas/rockridge.json` were not updated and nothing was tuned. The trial's assessment files were committed on the branch and then restored to the published ones with the revert.

### Refit decision (2026-11-18)

After the result above the project lead chose to keep both corrections on the branch, rerun the membership iteration of rounds 39 to 42 on the corrected network, and adopt the result only if it is no worse than the published assessment (design D11, with the keep rule written before any run). The iteration was not run. The published model no longer uses simulated membership: the measurement repair of 2026-11-17 added an evidence check, the round-42 membership files fail it, and both the published fit and this round's fit report "Using static membership". The through targets that rounds 39 and 40 iterated on were retired in the same repair. So the refit on the corrected network with the published procedure is the build already assessed above, and it fails the keep rule. Bringing simulated membership back for the sixteen round-42 blocks would add something the published model does not have, and its seeds, pooling and stopping point would have to be chosen now; that choice is the project lead's (design D12). The project lead then decided to revert and record the discrepancy (design D13).

### Open for the project lead

- The model differs from the street-level imagery at two junctions: the imagery shows an all-way stop at Hillegass Ave and 61st St and no stop for eastbound 62nd St at Canning St, and the model has neither. Coding them made the PM fit worse (78 to 72 of 92 recent fitted stations), so they are left out pending a field check, and the Rockridge caveat says so. `stopExemptions` stays in the importer for when the check is done.
- The imagery shows "Road closed to thru traffic" barricades on Howell St at Ayala Ave, on Forest St at Ayala Ave and on Colby St at 61st St. It is undated and nobody has confirmed they are still there, so the baseline leaves them out (design D4). Update 2026-11-18: the project lead reports the Forest St and Ayala Ave barricade is gone (see the audit entry at the top). If they stand, they bear directly on the held-out misses near Howell St.
- Lower-confidence items from the survey, unchanged: Dana St at North St (the model stops North St; none seen), Canning St at 63rd St (a possible stop on 63rd St), 63rd St at Dana St.

## Forty-second round: the failing count stations (change calibration-round-42)

On 2026-11-17 the project lead decided that the published model is the round-40 demand (through-target weight 2) and that the site keeps "not yet calibrated" until every rule passes, the count-station rule included. This round looked for the causes of the failing count stations and fixed what the diagnosis supported, with the rule and its ranges unchanged. Guard rails R1 to R4 and the keep rule were frozen in `openspec/changes/archive/2026-11-22-calibration-round-42/design.md` (D3, D4) before any changed demand was run; steps S4 and S5 were added there after earlier results and before their own (D9, D11). Simulator fingerprint f0df1aabc323, network f9fa09a5726644d7 and the frozen split are unchanged; `npm run data` reproduced round 40's demand 930a1d90b2d1 and cross-validation demand 738c179defd7 before anything changed. Times Pacific; the round ran on 2026-11-17, 07:59 to 11:19.

### Step 1: diagnosis

Recent stations (count year 2021 or later) failing GEH 5 on round 40's demand. PM: twenty seeds, held-out stations on the cross-validation demand with the same seeds. AM: seeds 1 to 10. Simulated = seed mean (standard error). Fit = the fit's own final assigned flow on the shipped demand. Location: inside the study area, on a bounding street, within the judged zone (200 m along the network) or far. Classes as in design D2: (a) the fit itself misses the count; (b) the fit meets it and the simulator does not, so the two route differently; (c) a queue, signal or stop holds the simulator below a count the fit meets; (d) a doubtful count.

| Period, set | Failing | (a) | (b) | (c) | (d) | Where |
| --- | --- | --- | --- | --- | --- | --- |
| PM fitted | 16 of 92 | 1 | 15 | 0 | 0 | 15 inside, 1 far (Caldecott Lane on-ramp) |
| PM held out | 11 of 24 | 6 | 5 | 0 | 0 | 5 inside, 6 far (the Caltrans stations on San Pablo Ave, Ashby Ave and Tunnel Rd) |
| AM fitted | 10 of 77 | 5 | 5 | 0 | 0 | all inside |
| AM held out | 5 of 19 | 0 | 5 | 0 | 0 | all inside |

No recent station lies on a bounding street. The legs of Telegraph Ave / Alcatraz Ave are counts of 2018 to 2021 with count year 2019, and the other bounding-street junctions are counts of 2010 and 2013, so none of them enters the recent rule. Nearly every PM failure inside the study area is a block of the resident volunteer count west of Colby St with far more simulated cars than counted: Forest St eastbound into Claremont Ave, Ayala Ave, McAuley St, Howell St, and 60th St and 63rd St leaving Telegraph Ave. They form one chain through the grid between Telegraph Ave and Claremont Ave / Colby St / Forest St, and the fit's static routes put close to the counted volume on each of them.

PM:

| Station | Set | Source, year | Location | Counted | Simulated (SE) | GEH | Fit, final (shipped fit) | Class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ayala Avenue Forest Street to McAuley Street, SB, link 2801 | fitted | volunteer-count 2025 | inside | 20 | 110 (3.9) | 11.2 | 22 | b, simulator higher |
| Forest Street Colby Street / Claremont Avenue to Ayala Avenue, EB, link 2697 | fitted | volunteer-count 2025 | inside | 66 | 190 (6.3) | 10.9 | 58 | b, simulator higher |
| on-ramp at node 1711 (Caldecott Lane) | fitted | caltrans-ramp 2024 | far | 61 | 167 (5.9) | 9.9 | 100 | b, simulator higher |
| Howell Street 59th Street to McAuley Street, SB, link 2055 | fitted | volunteer-count 2025 | inside | 17 | 76 (3.1) | 8.7 | 38 | b, simulator higher |
| McAuley Street Ayala Avenue to Howell Street, EB, link 1931 | fitted | volunteer-count 2025 | inside | 15 | 63 (2.4) | 7.7 | 8 | b, simulator higher |
| Dana Street North Street to Alcatraz Avenue, SB, link 1927 | fitted | volunteer-count 2025 | inside | 43 | 6 (0.6) | 7.5 | 4 | a |
| 61st Street Hillegass Avenue to Colby Street, WB, link 2619 | fitted | volunteer-count 2025 | inside | 12 | 53 (1.4) | 7.2 | 24 | b, simulator higher |
| Howell Street McAuley Street to 60th Street, SB, link 2057 | fitted | volunteer-count 2025 | inside | 16 | 59 (2.0) | 7.1 | 23 | b, simulator higher |
| 62nd Street Hillegass Avenue to Colby Street, EB, link 2678 | fitted | volunteer-count 2025 | inside | 16 | 59 (2.3) | 7.0 | 29 | b, simulator higher |
| 63rd Street Canning Street to Telegraph Avenue, EB, link 1860 | fitted | volunteer-count 2025 | inside | 27 | 73 (1.8) | 6.5 | 43 | b, simulator higher |
| 60th Street Canning Street to Telegraph Avenue, EB, link 1870 | fitted | volunteer-count 2025 | inside | 27 | 72 (2.2) | 6.3 | 32 | b, simulator higher |
| McAuley Street Colby Street to Ayala Avenue, WB, link 1928 | fitted | volunteer-count 2025 | inside | 24 | 66 (3.0) | 6.2 | 24 | b, simulator higher |
| 63rd Street Hillegass Avenue to Colby Street, EB, link 2628 | fitted | volunteer-count 2025 | inside | 7 | 36 (1.7) | 6.2 | 18 | b, simulator higher |
| Dana Street 63rd Street to North Street, NB, link 1924 | fitted | volunteer-count 2025 | inside | 11 | 40 (1.7) | 5.7 | 18 | b, simulator higher |
| Ayala Avenue Howell Street to Forest Street, NB, link 2058 | fitted | volunteer-count 2025 | inside | 64 | 117 (2.6) | 5.5 | 64 | b, simulator higher |
| McAuley Street Canning Street to Telegraph Avenue, EB, link 1935 | fitted | volunteer-count 2025 | inside | 14 | 44 (1.9) | 5.5 | 12 | b, simulator higher |
| sanpablo station, link 111 outward (0 m from the station) | held out | caltrans-aadt 2024 | far | 1015 | 306 (4.9) | 27.6 | 1014 | a, cross-validation view (see text) |
| tunnel station, link 3463 inward (5 m from the station) | held out | caltrans-aadt 2024 | far | 1094 | 384 (5.7) | 26.1 | 1000 | a, cross-validation view (see text) |
| ashby station, link 3396 inward (4 m from the station) | held out | caltrans-aadt 2024 | far | 952 | 348 (4.8) | 23.7 | 801 | a, cross-validation view (see text) |
| ashby station, link 3395 outward (4 m from the station) | held out | caltrans-aadt 2024 | far | 1163 | 519 (15.9) | 22.2 | 975 | a, cross-validation view (see text) |
| sanpablo station, link 115 inward (11 m from the station) | held out | caltrans-aadt 2024 | far | 830 | 311 (6.8) | 21.7 | 826 | a, cross-validation view (see text) |
| tunnel station, link 3462 outward (5 m from the station) | held out | caltrans-aadt 2024 | far | 1337 | 859 (10.4) | 14.4 | 1357 | a, cross-validation view (see text) |
| McAuley Street Howell Street to Canning Street, EB, link 1933 | held out | volunteer-count 2025 | inside | 12 | 120 (5.7) | 13.3 | 15 | b, simulator higher |
| Ayala Avenue Martin Street to Howell Street, NB, link 1831 | held out | volunteer-count 2025 | inside | 60 | 167 (5.0) | 10.0 | 73 | b, simulator higher |
| 60th Street Howell Street to Canning Street, EB, link 1868 | held out | volunteer-count 2025 | inside | 23 | 92 (3.8) | 9.1 | 29 | b, simulator higher |
| 60th Street Howell Street to Canning Street, WB, link 1867 | held out | volunteer-count 2025 | inside | 25 | 62 (2.1) | 5.6 | 19 | b, simulator higher |
| 63rd Street Dana Street to Canning Street, WB, link 1857 | held out | volunteer-count 2025 | inside | 64 | 27 (1.5) | 5.5 | 49 | b, simulator lower |

AM:

| Station | Set | Source, year | Location | Counted | Simulated (SE) | GEH | Fit, final (shipped fit) | Class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dana Street 63rd Street to North Street, SB, link 1925 | fitted | volunteer-count 2025 | inside | 62 | 13 (1.4) | 8.0 | 16 | a |
| 60th Street Canning Street to Telegraph Avenue, EB, link 1870 | fitted | volunteer-count 2025 | inside | 8 | 40 (3.4) | 6.5 | 21 | b, simulator higher |
| Dana Street North Street to Alcatraz Avenue, SB, link 1927 | fitted | volunteer-count 2025 | inside | 45 | 12 (1.4) | 6.3 | 14 | a |
| North Street Colby Street to Dana Street, WB, link 1906 | fitted | volunteer-count 2025 | inside | 25 | 2 (0.5) | 6.1 | 1 | a |
| Canning Street 62nd Street to 63rd Street, NB, link 1904 | fitted | volunteer-count 2025 | inside | 34 | 8 (0.9) | 5.7 | 6 | a |
| Martin Street Ayala Avenue to Hermann Street / 58th Street, WB, link 1825 | fitted | volunteer-count 2025 | inside | 150 | 90 (2.7) | 5.5 | 102 | b, simulator lower |
| 58th Street Hermann Street / Martin Street to Canning Street, WB, link 1987 | fitted | volunteer-count 2025 | inside | 150 | 90 (2.7) | 5.5 | 100 | b, simulator lower |
| 63rd Street Canning Street to Telegraph Avenue, EB, link 1860 | fitted | volunteer-count 2025 | inside | 40 | 82 (2.2) | 5.4 | 62 | b, simulator higher |
| Canning Street 61st Street to 62nd Street, NB, link 1902 | fitted | volunteer-count 2025 | inside | 37 | 11 (0.9) | 5.2 | 10 | a |
| Forest Street Colby Street / Claremont Avenue to Ayala Avenue, EB, link 2697 | fitted | volunteer-count 2025 | inside | 50 | 92 (5.3) | 5.0 | 42 | b, simulator higher |
| McAuley Street Howell Street to Canning Street, EB, link 1933 | held out | volunteer-count 2025 | inside | 4 | 84 (6.3) | 12.1 | 10 | b, simulator higher |
| 60th Street Howell Street to Canning Street, EB, link 1868 | held out | volunteer-count 2025 | inside | 6 | 61 (2.2) | 9.5 | 19 | b, simulator higher |
| 58th Street Canning Street to Vicente Street, EB, link 1990 | held out | volunteer-count 2025 | inside | 7 | 50 (2.6) | 8.0 | 13 | b, simulator higher |
| 60th Street Howell Street to Canning Street, WB, link 1867 | held out | volunteer-count 2025 | inside | 19 | 54 (1.7) | 5.8 | 23 | b, simulator higher |
| Ayala Avenue Martin Street to Howell Street, SB, link 1832 | held out | volunteer-count 2025 | inside | 36 | 74 (3.0) | 5.2 | 41 | b, simulator higher |

For held-out stations the fit column is the shipped fit, which saw them; their class rests on it. The six held-out Caltrans stations each carry the only count on a gate at the model's edge (San Pablo Ave, Ashby Ave, Tunnel Rd). The cross-validation demand removes that count, so the gate falls back to its class default and the simulator carries a quarter to two thirds of the count (San Pablo Ave outward 306 against 1,015; the shipped demand puts 1,043 there). That is class (a) in the cross-validation view, and it is set by how the split holds these gates out, not by routing. Nothing in this round changes it.

Classes (c) and (d):
- No failing station is held below a count the fit meets by a queue or signal. One control effect feeds class (b): at Claremont Ave / Colby St / Forest St the simulated PM plan gives Claremont Ave 24.7 s, Colby St the observed 4.0 s and Forest St 35.3 s of the 79 s cycle. OSM has one stop-line signal per approach and no phase tags, and no worksheet in the references covers the junction, so the Forest St green comes from the adaptive split and grows with the cars that cut through to it. A sensitivity test (S-c below) shows it matters.
- At the 18 junctions where every leg is a counted block, inflow and outflow of the volunteer counts agree within GEH 1.8, so no block count is out of balance with its neighbors. No count is listed as doubtful from this check. The doubtful reading named in round 41 (Colby St SB onto Claremont Ave toward the northeast, 75) is a movement station, not part of the rule.

Forest St and 62nd St. Forest St eastbound from Ayala Ave into Claremont Ave / Colby St (count 66, simulated 190, fit 58) is class (b) with the control effect above. Pairs from `calibrate --select-od` (twenty seeds, whole hour, 183 trips an hour): study area to south-east Oakland 37, Berkeley side streets north of Alcatraz Ave to south-east Oakland 33, West Oakland to south-east Oakland 28, Emeryville and West Oakland streets to south-east Oakland 16, Berkeley side streets to the SR-24 westbound on-ramps 16, study area to the SR-24 westbound on-ramps 14, Telegraph Ave from the north to south-east Oakland 10. So the trips cross the grid diagonally from Telegraph Ave and Alcatraz Ave toward Claremont Ave. 62nd St eastbound from Florio St / Claremont Ave to Hillegass Ave (59 counted, 97 simulated) passes GEH 5 (4.3) and is not a failing station; its largest group is Ashby Ave from the west to College Ave north (29 of 96). 62nd St eastbound between Hillegass Ave and Colby St (16 counted, 59 simulated, fit 29) fails and is class (b), fed by the same Ashby Ave group (15) and Emeryville and West Oakland streets to the study area (11). The doubtful Colby St SB turn toward the northeast (75 counted) carries 0.5 in the simulation. The study-area trips to south-east Oakland and the SR-24 westbound on-ramps that use Forest St eastbound (51 an hour) are the trips that would make that turn, so the two are connected: with Colby St held to a 4 s green and Forest St given 35 s, the simulator sends them around through the grid.

AM Telegraph Ave southbound, Russell St to 51st St (300 s against 245 to 285; free flow 185 s, delay 118 s): the delay sits at signals, largest at Telegraph Ave / 52nd St / Claremont Ave (18.6 s) and at 51st St (15.4 s), the closely spaced pair 81 m apart, then Alcatraz Ave 11.8, 59th St 11.1, Aileen St 11.0 and 56th St 9.2. In the PM the same pair costs 11.2 and 4.7 s and the excess sits at the SR-24 interchange pair (Aileen St 12.2, 56th St 15.0). So it is the same kind of closely spaced signals, a different pair. The simulated AM southbound flow into 52nd St is 759 against 931 counted in 2013, so the delay does not come from too many cars. Coordination of such a pair favors its busier direction (`COORD_MAX_M`, ASSUMPTION), and no observed timing exists for either signal, so no sourced change was available and none was made. After S5 the southbound flow into 52nd St rises to 908, the pair costs 9.3 and 3.6 s, and the segment takes 278 s, inside the range. That came from the AM demand change and was not aimed at it.

### Mechanism

`calibrate --select-od` now also writes, for every link station, the pairs of the trips that used its links (a trip counted once per station link it used; report binary only, the engine and fingerprint are unchanged; the runs are identical with and without it). Link stations named in `countFit.throughTargets.measuredStations` take each pair's share from those trips, with the static share as a prior worth 5 trips (ASSUMPTION), as round 41 did for movement stations. The training view takes the pairs from runs of the cross-validation demand (`measuredStationsTraining`), so no run of a demand fitted to held-out counts informs the out-of-sample score.

### Step 2: changes, twenty PM seeds

Kept by D4 only if recent fitted stations rise above 76 of 92 on seeds 1 to 20, neither ten-seed set falls below 75, and R1 to R4 hold. R1: summed through distance at most 12.3 and each figure no more than one standard error further out (Colby St SB at most 120.3). Round 40 on the same seeds in the first row.

| Step | Fitted stations 1-20 (1-10 / 11-20) | Through HNB / CNB / HSB / CSB (48-95 / 102-145 / 79-120 / 39-117), distance | Headline 4 of 4, error 1-10 / 11-20 | Telegraph/Alcatraz legs N / W / S / E, GEH | Result |
| --- | --- | --- | --- | --- | --- |
| Round 40 | 76 (75 / 75) | 92.6 / 150.6 / 122.4 / 111.8, 8.0 | yes, 5.9 / 5.3 | 7.3 / 12.7 / 7.6 / 6.5 | |
| S-c: Forest St green 4 s (ASSUMPTION) | 80 (80 / 78) | 103.8 / 154.5 / 132.0 / 104.3, 30.3 | no (2 of 4), 8.0 / 8.4 | 6.5 / 12.2 / 6.0 / 6.8 | not kept, R1 and R2 |
| S1: bounding-street and Telegraph/Alcatraz stations (24) | 75 (77 / 75) | 95.3 / 150.9 / 123.8 / 111.7, 9.9 | yes, 6.0 / 6.1 | 4.5 / 5.7 / 5.3 / 6.8 | not kept, stations |
| S2: class (b) blocks inside the study area (14) | 81 (77 / 81) | 91.5 / 149.1 / 119.1 / 121.7, 8.8 | yes, 4.1 / 4.3 | 5.3 / 11.7 / 5.6 / 7.8 | not kept, Colby St SB 1.4 over its R1 limit |
| S4: S2 with one more membership iteration (forty runs) | 84 (83 / 84) | 91.8 / 150.4 / 115.8 / 117.5, 5.9 | yes, 4.5 / 4.0 | 6.4 / 12.3 / 6.3 / 8.3 | kept |

S-c gives the Forest St approaches the observed Colby St green. Fitted stations rise to 80, but the cars move onto Hillegass Ave and Colby St: through distance 30.3, and the Hillegass Ave SB and Colby St SB freeway shares fall out of their 10 points. So the Forest St green carries part of the grid traffic, and an observation of it would help; the assumed value was not kept. S1 brings the Telegraph Ave / Alcatraz Ave legs close to their counts (W leg 287 to 423 against 547), but no recent station gains, mean backlog is unchanged and far clearings rise from 1.65 to 4.7 an hour. S2 and S4 thin the pairs that cut through the grid in the simulator. Forest St eastbound falls from 190 to 121 (66 counted), Ayala Ave SB from 110 to 83 (20). S4 recomputes the through targets' membership and the S2 stations' pairs from the round-40 runs and S2's runs together, the round-39/40 procedure, and keeps every rail. S4 was defined after S2's result (design D9); a reader may weigh it accordingly.

S4 in the rails: R1 distance 5.9, every figure inside its limit (Colby St NB 150.4, 5.4 over its range against 5.6 in round 40). R2 4 of 4 on both sets. R3 judged clearings 0.00 on both sets, backlog under 2% in every seed, mean 0.63% and 0.56%. R4 Telegraph Ave PM 340 / 318 s and 340 / 313 s. Not a rail of this round: the held-out east leg of Telegraph Ave / Alcatraz Ave (count 689, year 2019, outside the recent rule) falls from 530 to 487, GEH 6.5 to 8.3, more than round 40's G5 limit of 1.5. Out of sample the recent held-out stations go from 13 to 11 of 24 on twenty seeds: the volunteer-count ones' mean GEH falls from 3.94 to 3.74 and the cut-through blocks among them improve (McAuley St eastbound 120 to 86 against 12, Ayala Ave NB 167 to 122 against 60), but Canning St between 59th St and McAuley St tips over 5 in both directions (4.97 to 5.73 and 3.79 to 5.55).

S5 (design D11) applies the same to five AM class (b) blocks (60th St and 63rd St eastbound to Telegraph Ave, Martin St and 58th St westbound, Forest St eastbound), AM pairs from ten AM runs. AM seeds 1 to 10, round 40 in brackets: recent fitted stations 70 of 77 (67), held out 15 of 19 (14), out of sample; Telegraph Ave 300 / 278 s (296 / 300); D16 holds, no judged clearing. Kept. The PM demand of S5 is that of S4.

### Result

Shipped: S5 (PM demand of S4, AM of S5; midday flows unchanged). Demand 930a1d90b2d1af05 became 36cb33c11df6840f, cross-validation demand 738c179defd714e0 became 74a3d41b5b043b70; the PM through targets' membership and the stations' pairs are in `rockridge.through-membership.json` and, for the training view, `rockridge.station-membership-training.json`. `npm run assess -- --publish --noise` (seeds 1 to 10); PM seeds 11 to 20 run separately on the same flows. Round 40 in brackets.

| | Target | PM 1-10 | PM 11-20 | PM 1-20 (SE) | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB (fitted) | 79-120 / 39-117 / 48-95 / 102-145 | 116 / 122 / 93 / 150 (119 / 111 / 92 / 150) | 116 / 113 / 91 / 151 (126 / 113 / 93 / 151) | 116 (2.5) / 118 (2.3) / 92 (2.0) / 150 (3.5) (122 / 112 / 93 / 151) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.3 / 49.6 / 61.4 / 41.4, 4 of 4, error 4.5 (5.9) | 54.2 / 47.1 / 63.8 / 40.6, 4 of 4, error 4.0 (5.3) | | 4 of 4, error 4.5 (4.6) | error 5.9 (5.9) |
| Cars cleared from gridlock per hour, judged (D16) / far | below 1 | 0.00 / 1.20 (0.60 / 1.40) | 0.00 / 2.10 (0.00 / 1.90) | | 0.00 / 0.30 (0.00 / 0.10) | 0.00 / 0.00 |
| Entry backlog, mean %, seeds under 2% | below 2% | 0.63, 10 (0.68) | 0.56, 10 (0.67) | | 0.02, 10 (0.03) | 0.01, 10 |
| Arterial speed, m/s | above 4 | 8.26 (8.32) | 8.29 (8.29) | | 9.35 (9.32) | 10.06 |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 340 / 318 (342 / 309) | 340 / 313 (348 / 317) | | 300 / 278 (296 / 300) | |
| Telegraph Ave at Alcatraz Ave, N / W / S / E, veh/h (GEH) | 1,064 / 547 / 910 / 689 | 1,280 (6.3) / 304 (11.8) / 1,098 (5.9) / 492 (8.1) (6.7 / 12.5 / 6.7 / 6.3) | 1,287 (6.5) / 285 (12.8) / 1,121 (6.6) / 482 (8.6) (7.9 / 13.0 / 8.4 / 6.6) | | | |
| Recent stations GEH<5, fitted / held out (out of sample) | above 85% | 83 of 92 (90%) / 11 of 24 (46%) (75, 82% / 13, 54%) | 84 of 92 / 11 of 24 (75 / 12) | 84 of 92 (91%) / 11 of 24 (76 / 13) | 70 of 77 (91%) / 15 of 19 (79%) (67, 87% / 14, 74%) | no counts |

Validation: 62 of 74 cases pass, unchanged (engine and suite unchanged; only the revision in `validation.json` moved). `cargo test -p traffic-sim --release`, `npx vitest run` and `npx tsc --noEmit` pass. WASM parity and trace identity hold (`npm run check:wasm`, PM seed 1, 300 s: every field identical).

### Verdict

Status `uncalibrated`, rule by rule, round 40 in brackets; whether to change it is the project lead's decision:
- D16 (stability): passes in every period (passes). Judged clearings in the PM fall to none on both sets.
- D5 (headline shares within 10 points): passes, 4 of 4 on both PM sets (passes).
- Through cars on the four counted blocks, fitted: fail (fail). On twenty seeds Hillegass Ave NB and SB are inside, Colby St SB is 0.5 above (SE 2.3, inside within noise), Colby St NB is 5.4 above (SE 3.5). On seeds 1 to 10 Colby St SB is 122.
- Station rule, recent counts within GEH 5 in more than 85%: PM fitted passes, 84 of 92 on twenty seeds (91%; 83 and 84 on the two sets) (fails, 82%); PM held out fails, 11 of 24 (46%) (fails, 54%); AM fitted passes, 70 of 77 (91%) (passes, 87%); AM held out fails, 15 of 19 (79%) (fails, 74%).
- Telegraph Ave travel times: PM inside (inside); AM inside, southbound 278 s (300 s, outside).
- Primitive validation: p2, p3, b13, l1 and h4 fail with no reviewed exception (same).

### Counts for the project lead

No station count was dropped or down-weighted, and the conservation check found no block count out of balance. Two readings stay open:
- Colby St SB onto Claremont Ave toward the northeast, 75 (movement station, quarter weight since round 41): the exits read 218 against 162 on the feeding block, and the simulator carries 0.2.
- The six held-out Caltrans stations on San Pablo Ave, Ashby Ave and Tunnel Rd are sound counts, but each is the only count on its edge gate, so holding it out leaves the cross-validation demand without anything to place that traffic. They account for six of the thirteen PM held-out failures. Holding out such a station tests the class default of an uncounted gate more than the model's routing; changing that is a change to the split, which is the project lead's decision and was not made.

### What remains off

- PM held-out stations: 11 of 24. Besides the six Caltrans stations, the grid blocks west of Colby St that the fit cannot see (McAuley St, 60th St, Ayala Ave) still carry two to seven times their counts out of sample, and Canning St between 59th St and McAuley St tipped over GEH 5 in both directions.
- The Forest St green at Claremont Ave / Colby St / Forest St is unobserved; the simulator gives it about 37 s of 79. A field reading of that green (and of the Forest St approach queue) would show whether the grid traffic is a signal effect or a demand effect.
- The held-out east leg of Telegraph Ave / Alcatraz Ave fell from 530 to 487 against 689 (GEH +1.9; round 40's G5 limit, not a rail of this round, was 1.5). S1 showed that simulated membership on the Telegraph Ave / Alcatraz Ave legs brings the north, west and south legs near their counts, at a cost in far gridlock and no gain in recent stations.
- Colby St NB through cars (150 against 145) and Telegraph Ave at Alcatraz Ave as before; the SR-24 mainline gate backlog, the far gridlock, l1 and b13. The published proposals need a new search on this demand.

## Forty-first round: Colby St NB and the Forest St turn (change calibration-round-41)

Round 40 traced the remaining Colby St NB excess (150.6 on twenty seeds, SE 3.3, against 102 to 145) to cars that join Colby St partway, mostly from Forest St. This round checked the volunteer count at Claremont Ave / Colby St / Forest St and tried one change. Guard rails G1 to G5 were carried over against the round-40 demand and frozen with the keep rule in `openspec/changes/archive/2026-11-22-calibration-round-41/design.md` before any result. Nothing shipped: demand 930a1d90b2d1af05, network f9fa09a5726644d7, split, cross-validation demand and fingerprint f0df1aabc323 are all unchanged. Times Pacific; the round ran on 2026-11-17, 00:45 to 01:45.

### What the count gives at the junction

PM, route diagrams of Colby St NB and SB:
- Claremont Ave from the southwest onto Colby St NB, 121, and Forest St from the southeast onto Colby St NB, 57: fit stations (weight 0.5), not held out.
- Claremont Ave from the northeast onto Colby St NB, 4: below the 25-vehicle minimum for a constraint; unused.
- Colby St SB onto Claremont Ave toward the southwest, 84: fit station, not held out.
- Colby St SB onto Claremont Ave toward the northeast, 75: fit station with a quarter weight for a doubtful reading (the exits read 218 against 162 on the feeding block); not held out.
- Colby St SB straight onto Forest St, 59: not a movement station; the Forest St eastbound block from the junction (66) covers it. It is southbound traffic and not part of the Colby St NB excess, and a new station would change the station list the frozen split was checked against, so it was not added.

No movement there is both counted and unused, so there was nothing new to add. All four movement stations were already in the fit. Their membership came from the fit's static routes, which send fewer cars from Forest St onto Colby St NB than the simulator does.

### Change tried: simulated membership for the four movement stations

`calibrate --select-od` now also writes the pairs of the trips that made each movement or route station, and `countFit.throughTargets.measuredStations` lets named stations take their membership from those simulated trips (all trips, not only through trips; prior 5 trips at the static share, ASSUMPTION; station weights unchanged; PM only). The pairs came from twenty seeds of the round-40 demand; the through targets kept round 40's membership. PM, round 40 in brackets:

| | 1-10 | 11-20 | 1-20 (SE) |
| --- | --- | --- | --- |
| Through HNB / CNB / HSB / CSB | 96 / 152 / 121 / 120 (92 / 150 / 119 / 111) | 96 / 150 / 123 / 116 (93 / 151 / 126 / 113) | 96.0 (2.7) / 151.3 (3.0) / 122.2 (2.5) / 118.0 (2.4) (92.6 / 150.6 / 122.4 / 111.8) |
| Distance outside the ranges | 12.5 (4.9) | 9.2 (12.0) | 10.5 (8.0) |
| Forest St onto Colby St NB (57) | | | 75.9 (2.7) (81.0) |
| Claremont Ave onto Colby St NB (121) | | | 103.1 (2.7) (106.2) |
| Colby St NB whole street (102) | | | 93.7 (2.1) (93.2) |
| Recent fitted stations | 75 of 92 (75) | 77 of 92 (75) | |
| Headline error, within 10 | 5.6, 4 of 4 (5.9) | 5.6, 4 of 4 (5.3) | |
| Mean backlog | 0.63% (0.68%) | 0.58% (0.67%) | |
| Largest leg GEH rise (limit 1.5) | none | W +0.94 | |

The fit itself could bring the Forest St turn only to 77 under simulated membership (its target is 57), because the same pairs carry the block and gate counts. In the simulation the turn fell from 81 to 76 and Colby St NB did not move. The rails held, but the twenty-seed distance rose from 8.0 to 10.5, so by the frozen rule the change was reverted. The option stays in the code, unused by the shipped build.

### 62nd St and Forest St eastbound today

Twenty seeds on the shipped (round-40) demand, nothing changed: 62nd St eastbound from Florio St / Claremont Ave to Hillegass Ave carries 96.9 (SE 3.0) against 59 counted. Forest St eastbound from Colby St / Claremont Ave to Ayala Ave carries 189.5 (SE 6.3) against 66, 2.9 times its count, while Forest St westbound matches (63.6 against 66). Colby St SB onto Claremont Ave toward the northeast carries 0.5 against 75 counted (the doubtful reading). Where the model sends those cars instead, and how much of the Forest St eastbound excess they explain, was not traced in this round.

### Verdict

Unchanged from round 40: status `uncalibrated`; D16 and D5 pass; the through-car check fails on Colby St NB (150.6, SE 3.3, against 145); the station rule fails in the PM peak fitted (82%) and held out (54%) and in the AM held out (74%); AM Telegraph Ave southbound is 300 s against 245 to 285; p2, p3, b13, l1 and h4 fail with no reviewed exception.

### What remains off

- Colby St NB, the Forest St turn onto it, and Forest St eastbound. A count of the Colby St / Claremont Ave / Forest St junction that settles the doubtful 75 (Colby St SB onto Claremont Ave toward College Ave) would show whether the model's straight-through traffic onto Forest St is wrong.
- Weight 8 of round 40 (all four through figures inside, G5 broken on one seed set) awaits the project lead.

## Fortieth round: twenty seeds, target weight, Colby St NB against the count (change calibration-round-40)

Round 39 left Colby St NB and Hillegass Ave SB above their ranges, and its two ten-seed sets disagreed by up to 13 cars an hour. The project lead asked for four steps in order: judge on twenty seeds, raise the through targets' weight, check Colby St NB against data before constraining any route, and test a second membership iteration. A step is kept only if the summed distance outside the ranges falls on seeds 1 to 10 and on 11 to 20 and the guard rails G1 to G5 of round 39 hold, now measured against the round-39 demand. Rails and rules were frozen in `openspec/changes/archive/2026-11-22-calibration-round-40/design.md` before any new result. Simulator fingerprint f0df1aabc323, network f9fa09a5726644d7, split and cross-validation flows unchanged; demand 86ec26e0a271a7e3 became 930a1d90b2d1af05. Times Pacific; the round ran on 2026-11-16 and 17, 23:45 to 03:00.

### Step 1: noise

Twenty seeds (1 to 20) on the round-39 demand, mean and standard error of the mean (standard deviation over the seeds divided by the square root of 20): Hillegass Ave NB 95.0 (SE 2.0), Colby St NB 154.4 (3.6), Hillegass Ave SB 127.2 (3.2), Colby St SB 118.0 (2.7). The standard deviation over seeds is 9 to 16 cars an hour, so a ten-seed mean carries 3 to 5 of standard error, and round 39's 148 against 161 on Colby St NB is about two standard errors of their difference: noise. From this round the membership pools twenty seeds per demand, the figures are given on 1 to 10, 11 to 20 and 1 to 20, and the assessment's through table shows the standard error. On twenty seeds, round 39 had Hillegass Ave NB at its upper end and Colby St SB 1.0 above it, both inside within one standard error; Colby St NB (+9.4) and Hillegass Ave SB (+7.2) were not.

### Step 3: Colby St NB against the count

Before anything else was changed, the round-39 runs were checked against the counts on Colby St NB. The cars leaving it at Alcatraz Ave match: 130 turning left (131 counted) and 29 right (32). SR-24 off-ramp traffic heading west or north on it is 64 an hour against 52 implied (38 to 62), but that implied value is the counted left turns times an assumed freeway share, so it does not support a route constraint. Two counted figures disagree: whole-street cars are 92 against 102 counted, and the turn from Forest St onto Colby St NB carries 86 against 57 counted (a movement station of weight 0.5 in the fit). So the excess through cars join Colby St partway, mostly from Forest St, instead of driving it from the ramps. No route constraint was added; the through target and its weight are left to deal with it.

### Steps 2 and 4: membership and weight

Membership: round 39 pooled the ten baseline seeds; step A pools forty runs (seeds 1 to 20 on the round-38 and on the round-39 demand). Weights 2, 4 and 8 use the forty-run membership. W2-i2 is a second iteration at weight 2, pooling sixty runs (the forty plus weight 2's twenty). Every row is twenty seeds; figures are the twenty-seed means; distance is the cars an hour outside the ranges, summed over the four runs.

| Step | Weight | HNB / CNB / HSB / CSB, seeds 1-20 (48-95 / 102-145 / 79-120 / 39-117) | Distance 1-10 / 11-20 / 1-20 | G1 fitted stations 1-10 / 11-20 | G2 within 10, error 1-10 / 11-20 | G5 largest GEH rise 1-10 / 11-20 (limit 1.5) | Fit: blocks within tolerance; static freeway shares HNB / CNB / HSB / CSB (47 / 47 / 68 / 45); ramps within tolerance off / on | Kept |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Round 39 | 1 | 95.0 / 154.4 / 127.2 / 118.0 | 8.5 / 29.2 / 17.6 | 75 / 75 | 4 of 4, 6.2 / 5.7 | | 41 of 107; 35 / 45 / 59 / 43; 6 of 7 / 6 of 9 | shipped |
| A, forty runs | 1 | 93.5 / 152.8 / 125.5 / 122.0 | 7.8 / 28.8 / 18.3 | 74 / 74 | 4 of 4, 6.1 / 6.1 | +0.14 / +0.83 | 41; 35 / 45 / 60 / 44; same | no change within noise |
| Weight 2 | 2 | 92.6 / 150.6 / 122.4 / 111.8 | 4.9 / 12.0 / 8.0 | 75 / 75 | 4 of 4, 5.9 / 5.3 | none / +0.77 | 41; 37 / 46 / 61 / 45; same | yes |
| Weight 4 | 4 | 95.1 / 152.0 / 114.0 / 104.3 | 3.8 / 10.7 / 7.1 | 75 / 77 | 4 of 4, 5.7 / 5.1 | +0.68 / +1.54 (E leg) | 43; 39 / 46 / 63 / 47; same | no, G5 |
| Weight 8 | 8 | 90.5 / 137.8 / 109.6 / 98.3 | 0 / 0 / 0 | 76 / 75 | 4 of 4, 6.0 / 4.5 | +1.21 / +1.67 (E leg) | 44; 44 / 49 / 63 / 50; same | no, G5 |
| W2-i2, sixty runs | 2 | 92.4 / 150.5 / 119.5 / 114.3 | 0 / 17.3 / 5.5 | 75 / 75 | 4 of 4, 6.1 / 5.2 | none / +1.23 | 41; 37 / 46 / 61 / 45; same | no, distance rose on 11-20 |

Step A cut the distance on both ten-seed sets by under 1 car an hour and raised it on twenty seeds, so a second iteration at weight 1 changes nothing beyond noise. So round 39's rise from 8.5 to 13.9 at its second iteration was seed noise in the ten-seed shares: with four times as many runs pooled the prior (5 trips, ASSUMPTION) weighs a quarter as much per pair, and the figures did not move. A higher weight costs little in the fit itself. Ramp counts stay inside their tolerance as before, block counts within tolerance rise from 41 to 44 of 107, and the static freeway shares move toward the observed ones. In the simulation the cost falls on the held-out east leg of Telegraph Ave / Alcatraz Ave (Alcatraz Ave leaving eastward, counted 689): 542 an hour on round 39's seeds 11 to 20, 527 at weight 2, 506 at weight 4, 503 at weight 8. Weight 8 brings all four figures inside their ranges on both seed sets. On seeds 11 to 20 it raises that leg's GEH by 1.67, over the frozen limit of 1.5; on twenty seeds the rise is 1.44. Weight 4 misses the limit by 0.04 on the same set. Weight 2 is the highest weight that holds every rail, and W2-i2 is not kept, so the round stops at weight 2 with the forty-run membership.

### Where the trips went

They were again removed from their pairs, not rerouted; at counted gates the fit restored the totals from other pairs (PM car trips 26,349 to 26,371). Largest changes against round 39: West Berkeley to the SR-24 westbound on-ramps -31, Ashby Ave from the west to College Ave north -15 and to the Berkeley hills -14, and up: study-area trips to the hills east +18, Berkeley side streets to south-east Oakland +14. AM and midday demand are within 4 cars an hour of round 39. `calibrate --od-costs`, PM seeds 1 to 4, completed through trips an hour, round 39 to round 40: Hillegass Ave SB 117 to 107 (Ashby Ave from the west to College Ave north 17 to 12), Colby St SB 103 to 96 (same group 17 to 12; Berkeley side streets to south-east Oakland 10 to 5), Hillegass Ave NB 78 to 77, Colby St NB 127 to 127 (SR-24 off-ramp to Telegraph Ave north 53 to 53).

### Result: ten seeds

`npm run assess -- --publish --noise` (PM seeds 1 to 10, AM, midday); PM seeds 11 to 20 run separately on the same demand. Round 39 in brackets.

| | Target | PM 1-10 | PM 11-20 | PM 1-20 (SE) | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB (fitted) | 79-120 / 39-117 / 48-95 / 102-145 | 119 / 111 / 92 / 150 (125 / 116 / 94 / 148) | 126 / 113 / 93 / 151 (129 / 120 / 96 / 161) | 122 (2.8) / 112 (3.3) / 93 (2.0) / 151 (3.3) (127 / 118 / 95 / 154) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.8 / 50.1 / 59.8 / 38.6, 4 of 4, error 5.9 (6.2) | 53.6 / 47.3 / 59.8 / 38.7, 4 of 4, error 5.3 (5.7) | | 50.7 / 43.1 / 59.3 / 47.2, error 3.0 (3.2) | 53.0 / 37.8 / 62.9 / 47.3, error 5.9 (5.4) |
| Cars cleared from gridlock per hour, judged (D16) / far | below 1 | 0.60 / 1.40 (0.10 / 1.90) | 0.00 / 1.90 (0.00 / 1.00) | | 0.00 / 0.10 (0.00 / 0.60) | 0.00 / 0.00 |
| Entry backlog, mean %, seeds under 2% | below 2% | 0.68, 10 (0.70) | 0.67, 10 (0.57) | | 0.03, 10 | 0.01, 10 |
| Arterial speed, m/s | above 4 | 8.32 (8.27) | 8.29 (8.34) | | 9.32 | 10.06 |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 342 / 309 (338 / 307) | 348 / 317 (345 / 313) | | 296 / 300 (296 / 303) | |
| Telegraph Ave at Alcatraz Ave, N / W / S / E, veh/h (GEH) | 1,064 / 547 / 910 / 689 | 1,294 (6.7) / 291 (12.5) / 1,124 (6.7) / 533 (6.3) (GEH 7.6 / 13.2 / 7.5 / 6.6) | 1,339 (7.9) / 283 (13.0) / 1,183 (8.4) / 527 (6.6) (GEH 8.1 / 13.0 / 7.7 / 5.9) | | | |
| Recent stations GEH<5, fitted / held out (out of sample) | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | 75 of 92 (75) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |

The held-out stations are scored on the cross-validation demand, whose flows are still unchanged (the through targets stay out of the training view), so their out-of-sample scores are unchanged by construction; on the shipped demand they are 18 of 24 in sample (18). Validation is unchanged (engine and suite unchanged: 62 of 74). WASM parity and trace identity hold (`npm run check:wasm`).

### Guard rails

- G1: 75 of 92 on both PM sets (75 and 75); AM 67 of 77 (67). Holds.
- G2: 4 of 4 within 10 points on both sets, error 5.9 and 5.3 (6.2 and 5.7). Holds.
- G3: judged clearings 0.60 and 0.00 an hour, backlog under 2% in 10 of 10 seeds on both sets, mean backlog 0.68% and 0.67% (limits 0.85% and 0.72%), arterial speed above 8 m/s. Holds. On seeds 11 to 20 far clearings rose from 1.0 to 1.9 and mean backlog from 0.57% to 0.67%.
- G4: PM inside on both sets; AM northbound 296 s inside, southbound 300 s (303). Holds.
- G5: no leg rises on seeds 1 to 10; on 11 to 20 the S leg rises by 0.77 and the E leg by 0.65 (limit 1.5). Holds.

### Verdict

Status `uncalibrated`, rule by rule, round 39 in brackets; the status is the project lead's decision:
- D16 (stability): passes in every period (passes).
- D5 (headline shares within 10 points): passes in the PM peak, 4 of 4 on both sets (passes).
- Through cars on the four counted blocks, fitted: fail (fail). On twenty seeds Hillegass Ave NB and Colby St SB are inside, Hillegass Ave SB is 2.4 above its range with a standard error of 2.8 (inside within noise), Colby St NB is 5.6 above with a standard error of 3.3. On seeds 1 to 10 three of four are inside (two); on 11 to 20 two of four (none).
- Station rule, recent counts within GEH 5 in at least 85%: PM fails fitted (82%) and held out (54%) (same); AM passes fitted (87%) and fails held out (74%) (same).
- Telegraph Ave travel times: PM inside; AM southbound 300 s against 245 to 285 (303).
- Primitive validation: p2, p3, b13, l1 and h4 fail with no reviewed exception (same).

### What remains off

- Colby St NB stays above its range at weight 2 (150.6 on twenty seeds, SE 3.3), and Hillegass Ave SB is inside within noise (122.4, SE 2.8). Weight 8 brings both inside on both seed sets, but it also lowers Alcatraz Ave eastbound out of the Telegraph Ave junction (a held-out leg) by 1.67 GEH on one seed set, over the limit the rails set. Whether that trade is acceptable is the project lead's decision.
- The excess on Colby St NB enters from Forest St (86 against 57 counted). The fitted movement station there has weight 0.5, and the simulator overshoots it.
- As before: Telegraph Ave at Alcatraz Ave about 22 to 26% over its count, the SR-24 mainline gate backlog, the far gridlock, l1 and b13. The published proposals need a new search on this demand.

## Thirty-ninth round: the four through-car figures become fit targets (change calibration-round-39)

On 2026-11-16 the project lead decided ("Yes, fit to the cut-through counts") that the four counted through-car figures, Hillegass Ave and Colby St in each direction in the PM peak from the resident volunteer count of Feb 25, 2025, become targets of the demand fit. Until now they were only a check. The cost is that they stop being an independent check. The checks that stay independent are the held-out count stations, the headline freeway shares, stability and the arterial travel times. The compact model is shelved: its second round failed the lead's stop rule (`rockridge.extent-comparison.md`). Guard rails and the stopping rule were frozen in `openspec/changes/calibration-round-39/design.md` (D8, D9) before any result of a new demand was seen. Simulator fingerprint f0df1aabc323 and network f9fa09a5726644d7 are unchanged. Demand 1c798217e72fb1ba became 86ec26e0a271a7e3. The cross-validation demand's flows are unchanged (file 9de2bcebd9fb2a34; it differs from a367850a13850985 only in the config hash it records). Frozen split unchanged; no link renumbered. Times Pacific; the round ran on 2026-11-16, 22:00 to 23:59.

### What the four figures are

From the volunteer count (PM, route diagrams and block maps) come the whole-street cars (Hillegass Ave NB 48, Colby St NB 102, Hillegass Ave SB 79, Colby St SB 39), the cars whose trip ended along the street (15, 29, 40, 43) and the block volume, the median of the street's counted blocks (110, 174, 160, 160). Whole-street cars are through cars, so they are a lower bound. The block volume less the cars ending along the street is an upper bound, since it still holds cars that start along the street or end elsewhere in the study area. That gives the ranges 48 to 95, 102 to 145, 79 to 120 and 39 to 117, unchanged since round 19. The count does not say where in the range the true figure lies, so the fit aims at the middle (71.5, 123.5, 99.5, 78; ASSUMPTION) and the range is the tolerance.

The fit already used, from the same count, the block volumes (directed links, every fourth held out), the whole-street route counts (all cars driving the street end to end), the turning movements at the street ends and the assumed movement flows that pin the Alcatraz Ave turn-ins and turn-outs. The pinned flows carry 87 through trips an hour on Hillegass Ave SB, 46 on Colby St SB, 25 on Colby St NB and 7 on Hillegass Ave NB. They stay pinned and count toward the target. No existing station counts through cars on any link of a street run, so nothing is counted twice.

### Mechanism

The target sits inside the count fit and the simulator supplies its membership (design D5, option c). A through flow's proportion on a street run is its pair's share of trips counted on the run over ten seeds (`calibrate --select-od`), less the pinned flows, with the static route share as a prior worth 5 trips (ASSUMPTION). Every other count stays a constraint in the same fit, so gate totals stay with their counts. The simulator's figure counts each car once per run when any link of the run is in its trip and neither trip end is at a study-area node. The fit mirrors that with a new route feature (`any`) on the same links. Pooled over the ten baseline seeds, the select-link files give 97.5, 149.8, 142.5 and 132.1, the report's means exactly.

Two options were not chosen. (a) Static targets only: the fit's own routes already put 80, 135, 104 and 73 on these runs, three of them inside their ranges, against 98, 150, 143 and 132 simulated, so such targets would barely act. (b) A correction outside the fit: scaling flows there moves every count they cross and needs a second balancing step.

AM and midday take the PM range times the period volume factor (0.85, 0.62) as an upper limit only (ASSUMPTION). Their baseline figures are AM 70 / 89 / 70 / 90 and midday 54 / 76 / 70 / 78 (HNB / CNB / HSB / CSB). All are below the limits except midday Colby St SB (78 against 73), and none binds at the end of the fit.

### Iterations

Simulated = mean of PM seeds 1 to 10. Distance = the cars an hour outside the range, summed over the four runs. The fit columns use the simulated membership.

| Iteration | Membership from | Fit HNB / CNB / HSB / CSB | Simulated HNB / CNB / HSB / CSB | Distance |
| --- | --- | --- | --- | --- |
| 0 (shipped) | | 98 / 160 / 143 / 127 (static routes 80 / 135 / 104 / 73) | 97.5 / 149.8 / 142.5 / 132.1 | 44.9 |
| 1 | baseline, 10 runs | 92 / 157 / 125 / 108 | 93.9 / 148.1 / 125.4 / 115.7 | 8.5 |
| 2 | baseline and iteration 1, 20 runs | 93 / 158 / 126 / 111 | 96.4 / 148.6 / 126.9 / 119.0 | 13.9 |

Iteration 2 did not cut the distance, so the loop stopped and iteration 1 is the result (D9). On seeds 11 to 20 it gives 96.1 / 160.8 / 129.0 / 120.3, distance 29.2 against 56.8 for the shipped demand. The fit itself stops about 25% above the middle on Colby St NB and Hillegass Ave SB, because the flows on these runs also carry the ramp counts (weight 2), the freeway shares of the blocks (weight 3), Telegraph Ave and the block counts. On Colby St NB the largest group is SR-24 off-ramp traffic bound for Telegraph Ave north (53 an hour). Only a small part of that pair uses Colby St, so lowering the pair costs counts elsewhere.

### Where the trips taken off these streets went

They were removed from their pairs, not rerouted (D5). PM car trips went from 26,352 to 26,349: at counted gates the fit restored the totals from other pairs. The largest changes by origin and destination group: Ashby Ave from the west to the Berkeley hills -40, West Berkeley to the SR-24 westbound on-ramps -18, College Ave from the north to south-east Oakland -16, Berkeley side streets north of Alcatraz Ave to SR-13 +15. `calibrate --od-costs`, PM seeds 1 to 4, completed through trips an hour before and after: Colby St SB 119 to 103 (Berkeley side streets to south-east Oakland, 13 to 10), Hillegass Ave SB 129 to 117 (same group, 8 to 4), Hillegass Ave NB 86 to 78 (south-east Oakland to the Berkeley side streets, 16 to 11), Colby St NB 125 to 127 (SR-24 off-ramp to Telegraph Ave north, 53 to 53). AM and midday demand moved by at most 6 cars an hour in any group. The limits did not bind there, but the flows they touch no longer take the median factor of untouched flows.

### Result: ten seeds

`npm run assess -- --publish --noise`; PM seeds 11 to 20 run separately on the same demand. Round 38 in brackets.

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB (now fitted) | 79-120 / 39-117 / 48-95 / 102-145 | 125 / 116 / 94 / 148 (143 / 132 / 98 / 150) | 129 / 120 / 96 / 161 (146 / 140 / 96 / 152) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.7 / 59.2 / 38.5, 4 of 4, error 6.2 (52.9 / 50.5 / 55.1 / 37.4, 3 of 4, 7.5) | 53.9 / 46.4 / 59.4 / 38.2, 4 of 4, error 5.7 (52.8 / 47.9 / 56.6 / 38.9, 3 of 4, 6.0) | 50.9 / 42.7 / 60.0 / 46.8, error 3.2 (3.0) | 53.4 / 37.5 / 62.7 / 45.1, error 5.4 (5.4) |
| Cars cleared from gridlock per hour near the study area, judged (D16) | below 1 | 0.10 (0.60) | 0.00 (0.00) | 0.00 (0.00) | 0.00 (0.00) |
| Far | | 1.90 (0.50) | 1.00 (1.30) | 0.60 (0.30) | 0.00 (0.00) |
| Entry backlog, mean %, seeds under 2% | below 2% | 0.70, 10 (0.71, 10) | 0.57, 10 (0.57, 10) | 0.03, 10 (0.03) | 0.01, 10 (0.01) |
| Arterial speed, m/s | above 4 | 8.27 (8.26) | 8.34 (8.34) | 9.32 | 10.06 |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 338 / 307 (345 / 317) | 345 / 313 | 296 / 303 (294 / 299) | |
| Telegraph Ave at Alcatraz Ave, N / W / S / E legs, veh/h (GEH) | 1,064 / 547 / 910 / 689 | 1,327 (7.6) / 279 (13.2) / 1,150 (7.5) / 527 (6.6) (GEH 7.1 / 12.9 / 6.8 / 6.0) | 1,346 (8.1) / 282 (13.0) / 1,157 (7.7) / 542 (5.9) (GEH 8.7 / 12.5 / 8.0 / 5.4) | | |
| Recent stations GEH<5, fitted / held out (out of sample) | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | 75 of 92 | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |
| Held-out stations on the shipped demand (in sample) | | 18 of 24 (same) | 17 of 24 | 17 of 19 | |
| Older counts GEH<5, fitted | | 53 of 95 (48) | 52 of 95 | 25 of 48 | |

The held-out stations are scored out of sample on the cross-validation demand. Its flows did not change, because every street run holds a held-out block and the targets stay out of the training view (design D7), so the out-of-sample scores are round 38's by construction.

Validation: 62 of 74 cases pass, as in round 38; failing a3, e2, e3, j6, j8, j9, j12 (reviewed), l1, p2, p3, b13, h4 (not reviewed). `cargo test -p traffic-sim --release` passes. WASM parity and trace identity hold (`npm run check:wasm`, PM seed 1, 300 s: every field identical).

### Guard rails (design D8)

- G1 station fit: 75 of 92 on both PM sets (75), AM 67 of 77 (67). Holds.
- G2 headline shares: 4 of 4 within 10 points on both sets (3 of 4), error 6.2 and 5.7 (7.5 and 6.0). Holds.
- G3 stability: judged clearings 0.10 and 0.00 an hour, backlog under 2% in 10 of 10 seeds, no runaway growth, arterial speed 8.27 and 8.34 m/s, mean backlog 0.70% and 0.57% (0.71% and 0.57%). Holds. Far clearings rose on seeds 1 to 10 (0.5 to 1.9) and fell on 11 to 20 (1.3 to 1.0).
- G4 Telegraph Ave: PM inside on both sets; AM northbound 296 s inside, southbound 303 s (299, limit 309). Holds.
- G5 Telegraph Ave / Alcatraz Ave legs: the largest GEH rise is 0.64 (S leg, seeds 1 to 10) against the 1.5 allowed. Holds.

### Verdict

Status `uncalibrated`, rule by rule; whether to change it is the project lead's decision:
- D16 (stability): passes in every period.
- D5 (headline shares within 10 points): passes in the PM peak on both seed sets (4 of 4).
- Through cars on the four counted blocks, now fitted and no longer independent: fail. On seeds 1 to 10 Hillegass Ave NB and Colby St SB are inside, Colby St NB (148) and Hillegass Ave SB (125) above; on seeds 11 to 20 none is inside.
- Station rule, recent counts within GEH 5 in at least 85%: PM fails fitted (82%) and held out (54%); AM passes fitted (87%) and fails held out (74%).
- Telegraph Ave travel times: PM inside both ranges; AM southbound 303 s against 245 to 285.
- Primitive validation: p2, p3, b13, l1 and h4 fail with no reviewed exception.

### What remains off

- Colby St NB and Hillegass Ave SB stay above their ranges. The fit holds them about 25% above the middle because the same flows carry ramp counts, the freeway shares and the block counts. A higher weight on the targets, or a route constraint for the SR-24 off-ramp traffic that uses Colby St NB to reach Telegraph Ave, would be the next lever; neither was tried.
- The seed-to-seed spread on these blocks is large (Colby St NB 148 and 161 on the two seed sets), so one seed set can land on either side of a range edge.
- As before: Telegraph Ave at Alcatraz Ave about 25% over its count, the SR-24 mainline gate backlog, the far gridlock, l1 and b13. The published proposals were searched on the round-33 demand and need a new search on this one.

## Thirty-eighth round: Telegraph Ave at Alcatraz Ave, the SR-24 mainline gate (change calibration-round-38)

On 2026-11-16 the project lead kept the current model ("Keep the current model"). The delay-feedback refit is not adopted, because it reached the cut-through ranges partly by sending too little traffic toward the study area (Telegraph Ave at Alcatraz Ave, north leg, 763 veh/h against 1,064 counted) and by leaving 370 to 460 trips waiting at far entries. The entry-backlog check stays network-wide. This round looks at two measured errors of the shipped model: Telegraph Ave carries 1,307 veh/h at the Alcatraz Ave north leg, a fitted station counted at 1,064, and 143 trips per PM seed are still waiting at the SR-24 mainline gate at the end of the hour. Each change is kept only if validation and the network both improve on PM seeds 1 to 10 and 11 to 20. Through-car ranges, headline shares and held-out stations are checks, not targets. Decisions are in `openspec/changes/calibration-round-38/design.md`. Simulator fingerprint f0df1aabc323, network f9fa09a5726644d7, demand 1c798217e72fb1ba and cross-validation demand a367850a13850985, all unchanged. Times Pacific; the round ran on 2026-11-16.

### Reproduction and memory

`npm run data` in a fresh worktree reproduced the network, the demand and the cross-validation demand byte for byte. The container restarted during the round. Run alone with its memory sampled every second, a demand build peaked at 1.8 to 1.9 GB resident (shipped and training views, with and without measured delays) on a 16 GB machine, so the builds do not exhaust memory.

### Step 1: why Telegraph Ave carries too much

Fit = the demand fit's final assigned flow on the shipped demand; simulated = mean of PM seeds 1 to 10 on the shipped demand (seeds 11 to 20 in brackets).

| Station (PM) | Counted | Fit | Simulated |
| --- | --- | --- | --- |
| Telegraph Ave at Alcatraz Ave, N leg entering (fitted) | 1,064 | 1,080 | 1,307 (1,368) |
| Telegraph Ave at Alcatraz Ave, W leg entering (Alcatraz Ave from the west, fitted) | 547 | 569 | 285 (292) |
| Telegraph Ave at Alcatraz Ave, S leg leaving (fitted) | 910 | 891 | 1,128 (1,168) |
| Telegraph Ave at Alcatraz Ave, E leg leaving (held out) | 689 | 605 | 539 (555) |
| SR-24 eastbound on-ramp at Telegraph Ave / 56th St (held out) | 657 | 789 | 979 (992) |
| SR-24 westbound on-ramp at Claremont Ave / Hudson St (held out) | 598 | 727 | 853 (873) |
| Telegraph Ave at 55th St, N leg entering (fitted) | 1,099 | 1,090 | 1,141 (1,162) |
| Telegraph Ave at 52nd St, N leg entering (fitted) | 1,121 | 1,108 | 1,117 (1,187) |

Link by link, Telegraph Ave southbound agrees from the north edge to Ashby Ave (697 assigned, 665 simulated). Past Ashby Ave the fit has 476 and the simulation 628: Ashby Ave westbound brings 466 into the junction against 337 and turns left onto Telegraph Ave. 66th St adds 94 more (131 against 37), and the excess reaches 228 at Alcatraz Ave. Alcatraz Ave eastbound from the west is one lane between Shattuck Ave and Telegraph Ave, with 35, 32 and 33 s of simulated delay per vehicle on the links into Shattuck Ave, Irwin Ct and Telegraph Ave. The excess stays on Telegraph Ave and leaves it at the 56th St on-ramp to SR-24 eastbound. Eastbound on-ramps farther east take less (Broadway, 219 against 359), and Ashby Ave eastbound toward Tunnel Rd carries 474 against 975, with 69 to 76 s of delay at Claremont Ave and at Domingo Ave (round 36's chain).

The candidate causes, measured:
- (a) Same trips, different routes. The shipped PM car flows were assigned again on the fit's own cost model, without a refit, adding the ten-seed simulated delay per vehicle to each link (control delay removed, as in the fit). With the fit's costs the north leg gets 1,082; with all measured delays 1,615; with half of them 1,347; with delays only on links within 200 m or 600 m of the study area, 958 and 1,109. At the W leg the figures are 580, 96, 300, 56 and 58 (simulated 285), and at the 56th St on-ramp 791, 1,266, 935, 753 and 743 (simulated 979). Over all non-freeway links with at least 100 veh/h, the root-mean-square difference from the simulated flows is 169 veh/h for the fit's costs, 171 with all delays, 130 with half and 199 and 203 with the zone-only delays. Half of the measured delay reproduces the simulator's routing best: drivers see delays smoothed per minute, 46% follow live guidance and each draws a perception error once. So the excess is cause (a), and the delays behind it lie mostly outside the judged zone.
- (b) Assumed movements: none is on Telegraph Ave. The volunteer-count movements are about 280 veh/h of turns inside the study area; the large `via` volumes are the SR-24 off-ramp choices.
- (c) Signal coordination: with it off (`--coord-max-m 0`, PM seeds 1 to 3) the north leg carries 1,271 against 1,321, so about 50 of the excess.
- Live guidance: with it off (`--guided-share 0`) the north leg carries 1,350, so en-route switching is not the cause.

### Step 2: the cures

- Delays only in and around the judged zone were not built: at every buffer tried they reproduce the simulation worse than the current costs (step 1).
- Damped feedback, tested. Method of successive averages with step 1/n [PowellSheffi1982]: with the free-flow costs as the first iterate and the simulated delays as the second, the link cost carries half the measured delay, which is also the weight that matched the simulation. `countFit.assignment.measured.weight` (default 1, unused by the shipped build) was added, and a demand built with weight 0.5, BPR alpha 0.15 and the ten-seed delays of the shipped demand in each period.

| PM, seeds 1-10 (11-20) | Shipped | Half-weight delays |
| --- | --- | --- |
| Telegraph Ave at Alcatraz Ave, N leg | 1,307 (1,368) | 1,210 (1,191) |
| Alcatraz Ave W leg / 56th St on-ramp | 285 / 979 (292 / 992) | 352 / 896 (338 / 912) |
| Through cars HSB / CSB / HNB / CNB | 142 / 132 / 97 / 150 (146 / 139 / 96 / 152) | 138 / 134 / 94 / 154 (141 / 150 / 93 / 139) |
| Headline error, shares within 10 points | 7.5, 3 of 4 (6.0, 3 of 4) | 5.5, 4 of 4 (7.0, 3 of 4) |
| Cars cleared from gridlock an hour, all / judged | 1.1 / 0.6 (1.3 / 0.0) | 17.4 / 0.1 (15.2 / 0.2) |
| Arterial speed, m/s | 8.26 (8.34) | 7.27 (7.29) |
| Recent fitted stations GEH<5 | 75 of 92 (75) | 70 of 92 (70) |

The far gridlock is at Avalon Ave / Claremont Blvd, Ashby Ave at Claremont Crescent and Claremont Ave, Martin Luther King Jr Way at 61st and 62nd St, and King St. The step halves the Telegraph Ave excess, but the network gets worse on both seed sets, so it is not kept.

### Step 3: the SR-24 mainline gate

The gate (node 602) has two first links: the four-lane mainline (no delay, all of its demand enters) and a three-lane, 75 m collector. The collector forks into the 52nd St off-ramp and the Martin Luther King Jr Way off-ramp, which drops from two lanes to one. The demand sends 1,630 veh/h to the second ramp and 1,009 to the first. The simulation passes 1,516 and 925 (counted 1,614 and 1,024), with 57 s of delay per vehicle on the two lanes before the drop. Validation case i5 puts the model's lane drop at 0.81 of one lane (1,542 veh/h), below the count on that ramp. That part of the waiting is a capacity limit of the model's lane drop. The backlog grows from minute 25, when the queue reaches the gate. Waiting trips then leave the gate in order per first link, so trips for the 52nd St ramp wait behind trips for the lane drop although they use other lanes. That part is an insertion artifact.

New validation cases (in `validate.rs`, outside the fingerprint): h3, a 3-lane gate link admits 1,922 veh/h per lane (pass); h4, a gate onto a 3-lane fork with one branch queued back to the gate passes 0.43 of the free branch's flow (range 0.90 to 1.10, ASSUMPTION; fail, listed as a deviation, not reviewed). Tested engine fix: a waiting trip waits only behind trips for the same fork branch (fingerprint ba5e76c11ec1). Every other case is unchanged and h4 rises to 0.64. On PM seeds 1 to 10 (11 to 20) the trips waiting at the gate fall from 143 to 84 per seed (68), the backlog from 0.71% to 0.52% (0.57% to 0.44%), and the 52nd St off-ramp carries 990 (996) against 1,024 counted. The study area does not change: Telegraph Ave north leg 1,309 (1,376), through cars 143 / 139 / 97 / 151 (146 / 144 / 97 / 151), recent fitted stations 75 (74) of 92, mean fitted GEH 3.83 (3.78) against 3.73 (3.76). The fix was not landed: the station fit does not improve, the gain lies outside the study area, and a new fingerprint would mark every published proposal out of date. The patch is kept with the round's scratch output (`target/r38/gate-band.patch`).

### Result: ten seeds

The shipped model is unchanged, so `npm run assess -- --publish --noise` reproduced round 37 in every simulated figure, and PM seeds 11 to 20 equal round 37's runs seed for seed. Round 37 in brackets.

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 | 143 / 132 / 98 / 150 (same) | 146 / 140 / 96 / 152 (same) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.5 / 55.1 / 37.4, 3 of 4, error 7.5 (same) | 52.8 / 47.9 / 56.6 / 38.9, 3 of 4 (same) | 50.8 / 43.9 / 59.6 / 47.3 (same) | 52.6 / 37.2 / 62.8 / 45.5 (same) |
| Cars cleared from gridlock per hour near the study area, judged (D16) | below 1 | 0.60 (same) | 0.00 (same) | 0.00 (same) | 0.00 (same) |
| Far, with a chain into the zone | | 0.50, 0 (same) | 1.30, 0 (same) | 0.30, 0 (same) | 0, 0 (same) |
| Entry backlog, mean %; trips waiting at zone origins / all at the end | below 2% | 0.71; 0.9 / 185 (same) | 0.57; 1.5 / 150 (same) | 0.03; 0.4 / 5.6 (same) | 0.01; 0.1 / 0.8 (same) |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 345 / 317 (same) | | 294 / 299 (same) | |
| Recent stations GEH<5, fitted / held out | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |

Validation: 62 of 74 cases pass (61 of 72 in round 37, plus h3 passing and h4 failing). Failing: a3, e2, e3, j6, j8, j9, j12 (reviewed), l1, p2, p3, b13, h4 (not reviewed). WASM parity and trace identity: hold (`npm run check:wasm`, PM seed 1, 300 s: every field identical).

### Verdict

Status `uncalibrated`, rule by rule:
- D16 (stability, judged near the study area, backlog network-wide): passes in every period: PM 0.60 and 0.00 judged cars cleared from gridlock an hour on the two seed sets, backlog under 2% in 10 of 10 seeds; AM and midday 0.00.
- D5 (headline shares within 10 points): fails in the PM peak, 3 of 4 on both seed sets (Hillegass Ave SB 55 to 57 against 68).
- Through cars on the four counted blocks: fail, all four above their ranges except Hillegass Ave NB at the top edge (98 and 96 against 48 to 95).
- Station rule, recent counts within GEH 5 in at least 85%: PM fails fitted (82%) and held out (54%); AM passes fitted (87%) and fails held out (74%).
- Telegraph Ave travel times: PM inside both ranges; AM southbound 299 s against 245 to 285.
- Primitive validation: p2, p3, b13, l1 and h4 fail with no reviewed exception.

### What remains off

- Telegraph Ave at Alcatraz Ave stays 23% over its count, because the simulation routes freeway-bound trips around delays on Alcatraz Ave west of Telegraph Ave and on Ashby Ave toward Tunnel Rd that the fit's costs do not see. The half-weight fit halves it but brings far gridlock. Data that would settle it: a PM turning-movement count with queue lengths at Alcatraz Ave / Shattuck Ave and on the west approach of Alcatraz Ave / Telegraph Ave, a current count of the SR-24 eastbound on-ramp at Telegraph Ave / 56th St (the 2012 figure is held out), and the Claremont Ave / Russell St count named in round 36.
- The SR-24 mainline gate keeps about 143 trips waiting per PM seed: the lane drop on the Martin Luther King Jr Way off-ramp (i5) and the gate order (h4). The tested fix is ready if the lead accepts a fingerprint change.
- As before: the far gridlock, the queue-first left-turn model, the second eastbound lane on Ashby Ave, l1 and b13, the field checks of rounds 30 to 32, and stale stored proposal results, text pages and previews.

## Thirty-seventh round: gridlock judged near the Trapezoid (change calibration-round-37)

Round 36 traced the gridlock that keeps the delay-feedback fit rejected to the all-way stop at Claremont Ave / Russell St and the Berkeley hills streets north of Ashby Ave, a kilometer or more from the study area. On 2026-11-16 the project lead relayed a resident's field observation that Claremont Ave / Russell St is an all-way stop (every approach stops), so the network there is right, and chose "Judge gridlock near the Trapezoid": D16's limit of 1 car an hour cleared from gridlock, and the cost loop's acceptance rule, apply to the study area, its bounding streets and the junctions on them. Gridlock farther out is reported apart as a known weakness at the model's edges. Decisions are in `openspec/changes/archive/2026-11-22-calibration-round-37/design.md`. Simulator fingerprint f0df1aabc323, network f9fa09a5726644d7, demand 1c798217e72fb1ba and cross-validation demand a367850a13850985, all unchanged; frozen split unchanged; no link renumbered. Times Pacific; the round ran on 2026-11-16.

### Reproduction

`npm run data` in a fresh worktree reproduced round 36's network, demand and cross-validation demand byte for byte (the assumptions table differs only in its generation time). PM seed 1 on them, with this round's reporting, equals round 35's stored assessment run in every field but the manifest.

### Step 1: the field observation

`osmTagOverrides` adds `stop=all` to OSM node 53082604 with the observation as its source (DATA). The importer already read the junction-node stop as all-way, so the network file is unchanged. Round 36's open question, whether the junction is a minor-road stop, is closed.

### Step 2: the judged zone

The zone comes from data: the links and nodes the importer marks as in the study area (bounding streets included), both ends of those links, and every node within `judgedZone.bufferM` of them along the network in either direction (area config; 200 m, ASSUMPTION). A car counts as near when the node where it was held (the end of the link it waited on, or the node it was held in) is in the zone. The first non-freeway link beyond a bounding-street junction is 113 m long at the median, 200 m at the 75th percentile and 301 m at most, so 200 m reaches the next junction on three cross streets in four. A far car counts against the rule too when its blocking chain reaches the zone: at the 5 s snapshot before it was cleared, the links joined by vehicles held at least 60 s by a full exit (ASSUMPTION) include one in the zone. Bounding-street travel times were not used as the guard: only Telegraph Ave has observed segments and they stay in the assessment. The zone has 111 nodes and 329 links.

`calibrate` reads the split from the simulation's existing read-only diagnostics between its 5 s steps and writes `gridlockZone` into each seed's report: near, far, far with a chain into the zone, the judged count at 100, 200 and 400 m, far places, trips waiting at origins in the zone, and the longest standing queue on each bounding street. Nothing in the simulator's module tree changed, so the fingerprint and every run are unchanged (every re-run PM seed below matches its stored run). The ten-seed summary, `tools/assess.ts` and `tools/cost-loop.ts` judge D16 on near plus linked far clearings; everything else in both rules is unchanged.

### Step 3: delay-feedback fit

`tools/cost-loop.ts --no-stop` from the shipped demand, resumed from iteration 2 after two container restarts (`--resume 1 --jobs 3`). The runs carry no near/far split in storage, so the PM seeds were simulated again with the new reporting; every PM run of iterations 0 to 3 equals round 33's stored run (round 35's for iteration 0) in every simulated field, apart from the list of observed approaches that round 35 added to one signal. PM seeds 1 to 10, cars cleared from gridlock per hour:

| Iteration | All | Near (judged) | Far | Far, chain into the zone | Where far (seeds total) | PM stable (D16) | Backlog mean %, seeds under 2% | Headline error | Cost gap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | 1.10 | 0.60 | 0.50 | 0 | single events | yes | 0.71, 10 | 7.5 | - |
| 1 | 24.70 | 0.10 | 24.60 | 0 | Ashby Ave / Claremont Crescent 34, Avalon Ave / Claremont Blvd 26, Ashby Ave / Claremont Ave 22 | yes | 1.07, 10 | 5.4 | 0.378 |
| 2 | 13.90 | 0.00 | 13.90 | 0 | Ashby Ave / Claremont Ave 23, Avalon Ave / Claremont Blvd 21, Ashby Ave / Claremont Crescent 10 | no | 1.75, 6 | 3.7 | 0.122 |
| 3 | 10.60 | 0.00 | 10.60 | 0 | Ashby Ave / Claremont Ave 21, Avalon Ave / Claremont Blvd 16, Ashby Ave / Claremont Crescent 16 | no | 1.86, 5 | 5.5 | 0.090 |

Converged at iteration 3. The far gridlock sits 1.0 to 1.4 km from the study area and no chain of it reached the zone. With gridlock judged near the Trapezoid the baseline is stable, so the rule needs a stable iteration with no more backlog than the baseline: iteration 1 is stable but leaves 1.07% of trips waiting against 0.71%, and iterations 2 and 3 fail D16 on backlog (6 and 5 seeds under 2%). Every iteration was rejected and the final build reproduced the shipped demand byte for byte.

### Result: ten seeds

Seeds 1 to 10 (PM also 11 to 20), scale 1.0, 60 minutes, `npm run assess -- --publish --noise`; PM seeds 11 to 20 run separately and identical to round 35's stored runs. Round 36 in brackets; only the gridlock rows changed in meaning.

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 | 143 / 132 / 98 / 150 (same) | 146 / 140 / 96 / 152 (same) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.5 / 55.1 / 37.4, 3 of 4, error 7.5 (same) | 52.8 / 47.9 / 56.6 / 38.9, 3 of 4 (same) | 50.8 / 43.9 / 59.6 / 47.3 (same) | 52.6 / 37.2 / 62.8 / 45.5 (same) |
| Cars cleared from gridlock per hour near the study area, judged (D16) | below 1 | 0.60 (1.10, every one counted) | 0.00 (1.30) | 0.00 (0.30) | 0.00 (0.00) |
| Far, with a chain into the zone | | 0.50, 0 | 1.30, 0 | 0.30, 0 | 0, 0 |
| Judged at 100 m / 400 m buffer | | 0.60 / 0.60 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Entry backlog, mean %; trips waiting at zone origins / all at the end | below 2% | 0.71; 0.9 / 185 (0.71) | 0.57; 1.5 / 150 (0.57) | 0.03; 0.4 / 5.6 (0.03) | 0.01; 0.1 / 0.8 (0.01) |
| Longest queue, seed mean m (share of samples with a full link): Telegraph / Alcatraz / College / Claremont / CA 24 | | 74 (2.9%) / 82 (1.6%) / 87 (3.3%) / 56 (0) / 43 (0) | 70 (1.4%) / 77 (1.2%) / 86 (5.4%) / 59 (0) / 42 (0) | see the assessment | see the assessment |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 345 / 317 (same) | | 294 / 299 (same) | |
| Recent stations GEH<5, fitted / held out | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |

PM near clearings: 6 over ten seeds, all on 55th St approaching its signal at Telegraph Ave by the SR-24 ramps (links 1576 and 1578; 4 of them in seed 6). Far: single events at 61st St / MLK Jr Way, 59th St / Idaho St, Russell St and Pine Ave, and Ashby Ave / Claremont Crescent; on seeds 11 to 20, 7 of 13 on Russell St. `calibrate --od-costs` on PM seeds 1 to 4 gives the same through cars as round 33 (Hillegass Ave SB 128, Colby St SB 118 an hour). Validation: 61 of 72 cases pass, as in round 36; failing a3, e2, e3, j6, j8, j9, j12 (reviewed), l1, p2, p3, b13 (not reviewed). WASM parity and trace identity hold (`npm run check:wasm`).

### Verdict

Status `uncalibrated`. D16 now holds in every period: PM 0.60 and 0.00 judged cars cleared from gridlock an hour on the two seed sets, AM and midday 0.00, at every buffer from 100 to 400 m. The PM peak still fails D5 (3 of 4), the through-car check on all four blocks and the station rule fitted (82%) and held out (54%); the AM peak fails the station rule held out (74%). Primitive validation: p2, p3, b13 and l1 fail with no reviewed exception. Whether to change the status is the project lead's decision.

### What remains off

- Far from the study area the model still clears cars from gridlock: about 1 an hour on the shipped demand and 10 to 25 on the feedback iterations, on Russell St and the hillside streets around Ashby Ave / Claremont Ave. The model has few counts there; the count at Claremont Ave / Russell St named in round 36 would still show what that all-way stop must pass.
- The feedback fit stays rejected, now on entry backlog rather than gridlock near the study area.
- As before: the queue-first left-turn model, the second eastbound lane on Ashby Ave, l1 and b13, the field checks of rounds 30 to 32, and stale stored proposal results, text pages and previews.
## Thirty-sixth round: what limits Ashby Ave / Claremont Ave (change calibration-round-36)

Rounds 33 to 35 changed the phasing, the timing and the eastbound lanes at Ashby Ave / Claremont Ave and none of them reduced the cars cleared from gridlock there. The lead's reading: two northbound lanes with even 17 s of green in 100 s discharge about 600 an hour, yet the model passes 260 to 370, so something else limits the junction. This round looks for that constraint before touching the signal again, checks the data along it, and tries fixes at the source under the step rule. Decisions are in `openspec/changes/calibration-round-36/design.md`. Simulator fingerprint f0df1aabc323, network f9fa09a5726644d7 and demand 1c798217e72fb1ba, all unchanged; frozen split unchanged. Times Pacific; the round ran on 2026-11-16.

### Reproduction

`npm run data` in a fresh worktree reproduced round 35's network and demand byte for byte. PM seed 1 on them matches round 35's stored run in every simulated field.

### Step 1: diagnosis

A read-only probe in `calibrate` wrote, every 0.25 s after the warm-up, the state of each lane on 26 links around the junction: signal state, queue, and the head vehicle's next link, turn, distance to the line, speed, permission and what held it (a full downstream link, a vehicle crossing the junction, a pedestrian, or a priority rule). A probed run equals an unprobed one. The probe was not committed: it sits in the simulator's module tree, and landing it would change the fingerprint on which the published proposals were searched and confirmed. Round 33's iteration-2 demand, PM seeds 1 to 4 (12.3 cars cleared from gridlock an hour); the shipped demand in brackets (1.0). Saturation flow 1,500 to 2,000 vehicles an hour per lane is 0.42 to 0.56 a second [FHWA-SIG2004].

| Link (role) | Green, s/h | Queued at the line on green, s/h per lane | Discharge on queued green, veh/s per lane | Head held by a full downstream link, % of that time | Flow, veh/h |
| --- | --- | --- | --- | --- | --- |
| 4329 Claremont Ave northbound approach (through lane, right lane) | 814 (720) | 445, 656 (239, 393) | 0.17, 0.14 (0.42, 0.28) | 70 by 3446, 75 by 3425 (32, 52) | 317 (363) |
| 3395 Ashby Ave eastbound approach | 1,393 (1,582) | 1,154 (850) | 0.16 (0.47) | 63, by 3425 and 3446 (21) | 301 (506) |
| 3446 Claremont Ave north of the signal (43 m, two lanes) | uncontrolled | 2,728, 2,478 (1,717, 1,530) | 0.06, 0.03 (0.10, 0.07) | 50, 61 by 3431 (51, 61) | 241 (264) |
| 3425 Ashby Ave east of the signal, inner lane (37 m) | uncontrolled | 2,949 (2,141) | 0.09 (0.15) | 63 by the slip lane 3449 (42, half of it by 4397) | 277, 253 of them turning left into the slip lane (317, 176) |
| 3449 westbound right-turn slip lane (45 m) | uncontrolled | 2,305 (1,005) | 0.24 (0.23) | 52, mostly by 3431 (55) | 548 (232) |
| 3431 Claremont Ave north of Claremont Blvd (one lane, 82 m) into the all-way stop at Russell St | all-way stop | 3,387 (3,084) | 0.10 (0.11) | 21; a vehicle in the junction 51 (14; 55) | 338 (345) |
| 4397 Ashby Ave eastbound into Domingo Ave / Tunnel Rd (two lanes into one) | 1,352 (1,410) | 492, 500 (995, 999) | 0.22, 0.16 (0.23, 0.19) | 23, 24; a vehicle in the junction 51, 49 (32, 33; 34, 32) | 203 (449) |
| 3344 Domingo Ave southbound into the same signal | 1,769 (1,714) | 1,096 (930) | 0.40 (0.54) | 14 (4) | 497, 411 of them left onto Tunnel Rd (563, 497) |

The other approaches of the Russell St stop are queued 3,556 (Claremont Ave southbound), 3,369 (Russell St eastbound) and 3,136 s an hour (westbound) (3,523, 3,382, 1,808); the stop passes about 1,370 cars an hour over its four approaches. Claremont Ave southbound into Ashby Ave discharges near saturation flow while green and queued (0.54, 0.50, 0.39 a second) and is short of traffic, not of green.

Routes through the probed links (iteration 2, an hour): of the 411 left turns from Domingo Ave onto Tunnel Rd, about 220 come down Claremont Ave from the north edge and turn left at the Russell St stop and about 90 come along Russell St from Claremont Blvd. The slip lane's eastbound entries are Claremont Ave northbound through traffic that turns right on red onto Ashby Ave and then left across the westbound lanes (a 134 degree turn), and Ashby Ave eastbound left-turners; together about 250.

The chain: Claremont Ave northbound does not reach saturation flow because its head waits for room on Claremont Ave beyond the junction most of the green. That stretch is one lane for 82 m and ends at an all-way stop at Russell St that runs at capacity. Part of that stop's load is a route from the north hills to Tunnel Rd through Russell St and Domingo Ave, which also takes more green at Ashby Ave / Domingo Ave / Tunnel Rd than Ashby Ave gets; the Ashby Ave eastbound queue there reaches back to the slip-lane junction, where cars waiting to turn left into the slip lane hold the inner lane. Ashby Ave eastbound into Claremont Ave then waits for room, and its queue reaches back over Claremont Crescent, where the hillside gridlock starts. On the shipped demand the same chain is present with shorter queues. Signal timing at Ashby Ave / Claremont Ave was not the constraint on the northbound or eastbound approach.

### Step 2: the data along the chain

- Claremont Ave north of Claremont Blvd: OSM ways 201989355 and 201989356 are `lanes=2`, one lane each way, as in the network.
- Claremont Ave / Russell St: OSM node 53082604 is `highway=stop` on the junction node with no `stop` value and no direction. [OSMStop] maps minor-road stops on the approaches and all-way stops on the node with `stop=all`, so the tag does not say which approaches stop; the importer reads it as an all-way stop. The extract has 172 junction-node stops tagged the same way, so the general reading stays. The City of Berkeley's 2026 quick-build slides [BerkeleyClaremontQB2026] list, at Claremont Ave and Russell St, advance yield markings and "Yield to Ped" signs, which are used where approaching traffic is not stopped; they do not state the control. The City's 2025 slides [BerkeleyClaremontQB2025] give Claremont Ave peak-hour volumes of about 600 northbound (15:30 to 16:30) and 400 southbound (17:15 to 18:15), counted on 2025-09-23 along the corridor from Russell St to the southern city limit. The model's all-way stop passes about 340 northbound.
- [SafewayCollege-DEIR2011] does not study Russell St or Ashby Ave / Domingo Ave / Tunnel Rd. At Ashby Ave / Claremont Ave it records eastbound queues that did not clear in the 2010 PM peak and 697 vehicles an hour leaving northward (359 northbound through, 99 eastbound left, 239 westbound right).
- Ashby Ave / Domingo Ave / Tunnel Rd: Tunnel Rd eastbound is one lane (OSM way 517583960, `lanes:forward=1`); Caltrans counts 1,337 an hour there (2024, held out) against about 690 modeled on the iteration-2 demand. Ashby Ave eastbound into the signal is tagged `turn:lanes:forward=none|right`; the importer reads only left-turn lanes, so the model lets through traffic use the right lane. OSM restriction 14485297 (no left from Tunnel Rd westbound onto Domingo Ave, weekdays 16:00 to 18:00) does not reach the network: its `to` way is absorbed by junction joining. Both are importer gaps; neither is on the binding part of the chain.
- The slip lane: [CaltransD4BikeNeeds2025] (item Ala-13-NX04) names a slip lane at Claremont Ave. No source says whether eastbound traffic can enter it.
- Ashby Ave between College Ave and Tunnel Rd: no Caltrans or City of Berkeley source found in this round gives peak-hour tow-away lanes or lane counts.

### Step 3: fixes at the source (scratch networks, not kept)

PM, cars cleared from gridlock per hour, seeds 1 to 4:

| Network | Iteration-2 demand | Shipped demand | Claremont Ave north of the junction, veh/h (iteration 2 / shipped) | Where the gridlock is |
| --- | --- | --- | --- | --- |
| Round 35 | 12.3 | 1.0 | 338 / 345 | hillside streets, the junction |
| A: Claremont Ave / Russell St as a minor-road stop (Russell St stops) | 39.8 | 9.3 | 786 / 834 | Avalon Ave at Claremont Blvd, Russell St, Oak Knoll Ter |
| B: no eastbound left into the slip lane, no U-turn from it onto Claremont Ave southbound | 13.0 | 1.5 | 361 / 369 | as round 35 |
| A and B | 16.0 | 16.3 | 871 / 856 | hillside streets |

Without the all-way stop, Claremont Ave north of the junction carries more than twice as much and the gridlock moves onto the stop-controlled hillside streets that have to enter the heavier Claremont Ave and Claremont Blvd streams. Both changes fail the step rule on seeds 1 to 4, so neither was run on the other seed sets or demands.

### Result

The constraint is the all-way stop at Claremont Ave / Russell St and the traffic that reaches it, and whether the real junction is that limited cannot be settled from the sources: the map data shows an all-way stop, the City's documents point to uncontrolled Claremont Ave approaches without saying so, and nothing counts the route through Russell St and Domingo Ave. Following the lead's instruction, the round stops here. The network, the demand and every published file are round 35's; round 35's fit replay (every iteration rejected) and its assessment stand, as does the verdict: status `uncalibrated`, PM D16 fails (1.10 and 1.30 cars cleared from gridlock an hour), D5 fails (3 of 4), the through-car check fails on all four blocks, the station rule fails fitted (82%) and held out (54%); AM D16 passes, stations pass fitted (87%) and fail held out (74%); midday D16 passes; p2, p3, b13 and l1 fail with no reviewed exception.

### What would settle it

- A weekday PM peak-hour turning-movement count at Claremont Ave / Russell St, noting which approaches have stop signs. It gives the control, the northbound volume the junction must pass, and the southbound left turns onto Russell St that feed the route to Tunnel Rd.
- Second: a PM count of Domingo Ave southbound left turns onto Tunnel Rd at Ashby Ave.
- Then, as before, a current timing sheet for Ashby Ave / Claremont Ave and Ashby Ave / Domingo Ave / Tunnel Rd.

## Thirty-fifth round: field observations at Ashby Ave / Claremont Ave (change calibration-round-35)

On 2026-11-16 the project lead relayed two resident-provided field observations at Ashby Ave / Claremont Ave: (a) Ashby Ave eastbound has two travel lanes in the PM peak; (b) Claremont Ave southbound has a green left arrow, as northbound does (observed 2026-11-15). With the 2010 worksheet in [SafewayCollege-DEIR2011], (b) means both Claremont Ave approaches run as split phases. This round models the junction from them, retests the queue-first left-turn model and redoes the fit, keeping each step only if the validation suite and the network both improve or stay equal. Decisions are in `openspec/changes/calibration-round-35/design.md`. Simulator fingerprint f0df1aabc323 throughout (no simulator change). Network 6a8285d5076f9ddc to f9fa09a5726644d7 (one observed approach added to one signal; no link renumbered, no link changed); demand bef51b684a8c079c to 1c798217e72fb1ba with the same flows (D1 of the design: a provenance URL and the network hash it records). Frozen split unchanged. Times Pacific; the round ran on 2026-11-16.

### Reproduction

`npm run data` in a fresh worktree reproduced the network. The demand differed from bef51b684a8c079c in one field: the provenance URL of the Oakland multimodal counts, which commit debeb6c (bibliography deep links) changed in `build-demand.ts` after round 34 built its data; flows and every other field are identical. PM seed 1 on the published files matches round 34's stored report in every field except the manifest.

### Step 1: the junction from the observations (lanes reverted, phasing kept)

Phasing. Southbound Claremont Ave enters `signalObservations` as an own phase (all periods; DATA for the phasing). The engine already ran it alone: with northbound marked `ownPhase`, the southbound approach was the only one left in the Claremont Ave phase. PM seed 1 is identical apart from the list of observed approaches in the report. Cycle and greens follow the flows (Webster) on the three phases, ASSUMPTION pending a timing sheet; Ashby Ave keeps one phase with permitted lefts, as in the worksheet.

Lanes. The worksheet (PDF page 482) codes Ashby Ave eastbound as one lane group of two lanes (lane utilization 0.95, saturated flow 3,490 veh/h) with its 99 left turns inside it, so no left-turn lane. OSM way 34361024 (checked 2024-03-15) is `lanes=2`, one each way; the network had one eastbound lane on link 3395 (129 m from Claremont Crescent to the signal) plus the class-rule pocket. An `osmTagOverrides` entry (`lanes=3`, `lanes:forward=2`, `lanes:backward=1`) gave the link two eastbound lanes over its whole length, the shortest extent the network holds without splitting a link, in all periods (the network has no lanes by period); both are ASSUMPTIONS. A lane-coding observation removed the pocket; the importer now accepts `noLeftTurnLane` without a timing. The importer's network matched the measured scratch network link for link (4,411 links, only link 3395 changed). Ashby Ave westbound: the worksheet codes two lanes in one shared group (lane utilization 0.95, saturated flow 3,357 veh/h); OSM way 165864174 is `lanes=4` with no direction split and no `turn:lanes`, and the network has two westbound lanes (link 3426, 37 m, too short for a pocket). They agree, so nothing changed.

PM, seeds 1 to 10 / 11 to 20 (round 34, then two eastbound lanes with the worksheet lane coding; the iteration demands are round 33's, as rebuilt in round 34):

| | Shipped demand | Iteration-2 demand | Iteration-3 demand |
| --- | --- | --- | --- |
| Cars cleared from gridlock per hour, round 34 | 1.1 / 1.3 | 13.9 / 13.6 | 10.6 / 16.0 |
| Two eastbound lanes, no pocket | 2.4 / 1.7 | 12.6 / 13.6 | 14.5 / 11.2 |
| Two eastbound lanes with the pocket (diagnostic) | 3.6 / 3.1 | 11.8 / 14.9 | 13.1 / 15.8 |
| Cleared at the junction, total over ten seeds (Ashby Ave eastbound, Claremont Ave northbound), round 34 / two lanes | 0 (0, 0) / 4 (4, 0) | 22 (5, 15) / 26 (18, 7) | 21 (4, 17) / 29 (23, 5) |
| Cleared on the hillside streets (Avalon Ave, Oak Knoll Ter, Claremont Crescent, Ashby Ave west of the junction), round 34 / two lanes | 1 / 2 | 43 / 33 | 48 / 46 |
| Claremont Ave northbound, veh/h (577 counted in 2010) | 373 / 369 | 307 / 321 | 257 / 291 |
| Claremont Ave southbound, veh/h (549 in 2010, 272 of them left) | 437 / 561 | 487 / 556 | 513 / 506 |
| Ashby Ave eastbound, veh/h (1,163 Caltrans 2024) | 474 / 480 | 303 / 325 | 314 / 329 |
| Ashby Ave westbound, veh/h | 608 / 435 | 395 / 318 | 367 / 296 |
| Through cars HSB / CSB / HNB / CNB | 142 / 132 / 98 / 150 to 141 / 135 / 95 / 153 | 129 / 107 / 86 / 124 to 133 / 110 / 83 / 123 | 105 / 93 / 92 / 140 to 103 / 93 / 95 / 141 |
| Headline shares within 10 points, error | 3 of 4, 7.5 to 3 of 4, 7.3 | 4 of 4, 3.7 to 4 of 4, 4.3 | 4 of 4, 5.5 to 4 of 4, 5.4 |

Rows below the first three are seeds 1 to 10; the gridlock counts come from each seed's top-ten table. With two lanes the eastbound flow ratio per lane halves, so Webster gives the Ashby Ave phase less green (29.6 s of a 76.5 s cycle before, 23.7 s of 75 s after; shipped demand, means of the reported plans). Westbound then carries less, southbound more, eastbound about the same, and the gridlock at the junction moves onto the eastbound approach. On the shipped demand the other cars cleared are single events spread over the network (Russell St, 55th St, Pine Ave). The network got worse on the shipped demand on both seed sets, so the lane override and the lane coding were taken out of the area config; validation is unchanged (no case uses the junction). The southbound phase stays (no run changes); so does the importer's lane-coding-only observation, which changes nothing without the field.

### Step 2: queue-first left turns

`--queue-first-left` on the kept network, PM, cars cleared from gridlock per hour, seeds 1 to 10 / 11 to 20: shipped 1.6 / 2.6 against 1.1 / 1.3; iteration 2 16.1 / 17.1 against 13.9 / 13.6; iteration 3 13.8 / 20.2 against 10.6 / 16.0. Worse on every demand and seed set, so it stays off. On the two-lane network (diagnostic): 2.2 / 2.2, 13.3 / 20.4, 14.5 / 14.9.

### Step 3: delay-feedback fit

With step 1's lanes reverted and queue-first off, every run equals round 34's, so `tools/cost-loop.ts --no-stop --resume 3` replayed the stored iterations under the unchanged acceptance rule: removals 1.1, 24.7, 13.9 and 10.6 an hour at iterations 0 to 3, converged at iteration 3 (gap 0.090), every iteration rejected. The final build gave the shipped flows again. The demand keeps its free-flow and BPR costs.

### Result: ten seeds

Seeds 1 to 10 (PM also 11 to 20), scale 1.0, 60 minutes, fingerprint f0df1aabc323, `npm run assess -- --publish --noise`; PM seeds 11 to 20 run separately and identical to round 34's seed for seed. Round 34 in brackets; every figure is unchanged.

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars, all study-area local streets | | 822 (822) | | 466 (466) | 358 (358) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 | 142 / 132 / 98 / 150 (same) | 146 / 140 / 96 / 152 (same) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.5 / 55.1 / 37.4, 3 of 4, error 7.5 (same) | 52.8 / 47.9 / 56.6 / 38.9, 3 of 4, error 6.0 (same) | 50.8 / 43.9 / 59.6 / 47.3 (same) | 52.6 / 37.2 / 62.8 / 45.5 (same) |
| Cars cleared from gridlock per hour (D16) | below 1 | 1.10 (1.10) | 1.30 (1.30) | 0.30 (0.30) | 0.00 (0.00) |
| Entry backlog, mean % | below 2% | 0.71 (0.71) | 0.57 (0.57) | 0.03 (0.03) | 0.01 (0.01) |
| Completed trips | | 25,857 (25,857) | 25,965 (25,965) | 22,628 (22,628) | 16,705 (16,705) |
| Recent stations GEH<5, fitted / held out | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |
| Claremont Ave northbound / southbound at Ashby Ave, veh/h | 577 / 549 (2010) | 373 / 437 (same) | 411 / 432 (same) | | |
| Ashby Ave eastbound / westbound at Claremont Ave, veh/h | 1,163 eastbound (Caltrans 2024) | 474 / 608 (same) | 428 / 598 (same) | | |

Validation: 61 of 72 cases pass, as in round 34. Failing: a3, e2, e3, j6, j8, j9, j12 (reviewed), l1, p2, p3, b13 (not reviewed).

### Verdict

Status `uncalibrated`. PM peak: D16 fails (1.10 and 1.30 cars cleared from gridlock an hour); D5 fails (3 of 4); the through-car check fails on all four blocks; the station rule fails fitted (82%) and held out (54%). AM peak: D16 passes (0.30); stations pass fitted (87%) and fail held out (74%). Midday: D16 passes; no counts. Primitive validation: p2, p3, b13 and l1 fail with no reviewed exception.

### What remains off

- Ashby Ave / Claremont Ave: the observed second eastbound lane is not in the model, because with flow-based greens it takes green from Ashby Ave and the network got worse. The worksheet gives Ashby Ave 50.5 s of 100 s; the model's Webster plan gives it 24 to 30 s of 75 s. A current timing sheet (cycle, greens, minimum greens, whether the arrows are protected-only) would settle whether the two lanes and the plan belong together. Neither plan brings Claremont Ave northbound near the 577 counted in 2010 or Ashby Ave eastbound near the 1,163 Caltrans counted in 2024.
- The queue-first left-turn model fixes p2 and p3 and still makes the network worse.
- As in round 34: l1's range disagrees with the cited method; b13 sits 2 veh/h under its band; field checks of rounds 30 to 32 are open; stored proposal results, text pages and previews are stale.

## Thirty-fourth round: the 2010 worksheet plan at Ashby Ave / Claremont Ave (change calibration-round-34)

The lead's reading after round 33: the resident field observation (a left-turn arrow for northbound Claremont Ave) and the 2010 PM worksheet in [SafewayCollege-DEIR2011] describe the same plan. The worksheet runs the two Claremont Ave approaches as split phases, and under split phasing every movement of an approach, the left included, runs on a green arrow with no opposing traffic. Round 33 had tried that timing only together with the queue-first left-turn model. This round enters it on the default engine, checks the queue-first model again and redoes the fit, keeping each step only if the validation suite and the network both improve or stay equal. Decisions are in `openspec/changes/calibration-round-34/design.md`. Simulator fingerprint cef9506de520 at the start, f0df1aabc323 at the end; on the round 33 network and demand every run is identical to round 33 (seed 1 of each period and PM seeds 11 to 20 checked bit for bit). Network 6a8285d5076f9ddc and demand bef51b684a8c079c unchanged; frozen split unchanged; no link renumbered. Times Pacific; the round ran on 2026-11-16.

### Step 1: the worksheet plan on the default engine (reverted)

The worksheet (PDF page 482, re-read from the stored copy): actuated cycle 100 s; Claremont Ave northbound and southbound as split phases (turn type Split, protected phases 8 and 7), greens 17.0 s and 17.5 s, clearance 4.5 s each; Ashby Ave eastbound and westbound in one phase (phases 2 and 6, permitted lefts), green 50.5 s, clearance 6.0 s; 17.0 + 17.5 + 50.5 + 4.5 + 4.5 + 6.0 = 100 s. Lane coding: northbound one shared lane group of two lanes with no left-turn lane; southbound a left-turn lane beside a shared left-through and through-right group, as in the OSM turn lanes; Ashby Ave eastbound coded as two lanes, where OSM (way 34361024, checked 2024) has one.

The engine took one clearance per plan, so the worksheet's 6.0 s after the Ashby Ave phase and 4.5 s after the Claremont Ave phases could not both hold. An observed approach may now carry its own clearance (`clearanceSeconds` that differs between the observations of one timing; `ApproachGreen::clearance_s`), and the plan check still requires greens plus clearances to equal the cycle (a unit test covers 100 s and the 101 s that 7.0 s would need). An observation may also set `noLeftTurnLane`, which marks the approach `noPocket` so the class-rule pocket is not added. Provenance as entered: phasing, greens, clearances and lane coding DATA (2010 PM), consistent with the field observation; AM and midday ASSUMPTION, the PM plan reused, as the area config already does for the other observed plans without a worksheet for the period (52nd St at Shattuck Ave midday, Colby St at Claremont Ave PM). Ashby Ave keeps its OSM lane count.

PM, cars cleared from gridlock per hour, seeds 1 to 10 / 11 to 20 (round 33's plan, then the worksheet plan). Round 33's iteration-2 and iteration-3 demands were rebuilt from its stored runs (seed 1 of iteration 2 reproduces round 33's stored run bit for bit).

| | Shipped demand | Iteration-2 demand | Iteration-3 demand |
| --- | --- | --- | --- |
| Cleared from gridlock, round 33 plan | 1.1 / 1.3 | 13.9 / 13.6 | 10.6 / 16.0 |
| Worksheet plan | 1.7 / 2.1 | 11.3 / 14.0 | 16.1 / 18.3 |
| At Claremont Ave northbound into Ashby Ave (seeds 1-10, total), round 33 plan / worksheet | 0 / 4 | 15 / 22 | 17 / 32 |
| Claremont Ave northbound, veh/h (577 counted in 2010) | 373 / 333 | 307 / 259 | 257 / 217 |
| Claremont Ave southbound, veh/h (549 counted in 2010, 272 of them left) | 437 / 362 | 487 / 435 | 513 / 420 |
| Ashby Ave eastbound, veh/h (1,163 Caltrans 2024) | 474 / 528 | 303 / 386 | 314 / 318 |
| Ashby Ave westbound, veh/h | 608 / 682 | 395 / 412 | 367 / 402 |
| Through cars HSB / CSB / HNB / CNB, seeds 1-10 | 142 / 132 / 98 / 150 to 133 / 125 / 95 / 150 | 129 / 107 / 86 / 124 to 112 / 103 / 88 / 123 | 105 / 93 / 92 / 140 to 104 / 90 / 90 / 143 |
| Headline error, seeds 1-10 | 7.5 to 6.8 | 3.7 to 3.7 | 5.5 to 5.8 |

Flows are seeds 1 to 10. The rest of the gridlock sits where it did: Avalon Ave at Claremont Blvd, Oak Knoll Ter, Claremont Crescent and Ashby Ave east of the junction, and on the shipped demand scattered single events (Stanford Ave, 63rd St, Russell St). The worksheet gives northbound 17 s, less than the flow-based split gave it, so the approach carries less and its queue reaches back into the hillside streets; Ashby Ave gains a little. A diagnostic with the class-rule pocket kept on northbound (seeds 1 to 10) gave 1.3 on the shipped demand and 13.3 on the iteration-2 demand, so the lane coding is not the main cost. Validation is unchanged (no case uses the plan). The network got worse on the shipped demand on both seed sets and on the iteration-3 demand, so the plan was reverted: the area config keeps round 33's observation and the network file is round 33's again. The engine and importer support for per-approach clearance and the lane coding stays; it changes no run without those fields.

### Step 2: queue-first left turns

Rerun with `--queue-first-left` on the worksheet network (step 1 in place), PM, cleared from gridlock per hour, seeds 1 to 10 / 11 to 20, against the same network without it: shipped 1.3 / 1.5 against 1.7 / 2.1; iteration 2 16.3 / 21.3 against 11.3 / 14.0; iteration 3 16.0 / 19.7 against 16.1 / 18.3. Claremont Ave northbound fell further (iteration 2: 225 and 222 veh/h). Worse on the iteration demands, so it stays off. On round 33's plan round 33 already measured it worse.

### Step 3: delay-feedback fit

With step 1 reverted, the network, the demand and every run are round 33's. `tools/cost-loop.ts --no-stop --resume 3` replayed round 33's stored iterations under the unchanged acceptance rule: same table (removals 1.1, 24.7, 13.9, 10.6 an hour; cost gap 0.090 at iteration 3, converged), every iteration rejected, and the final `build-demand` reproduced the shipped demand byte for byte. The demand keeps its free-flow and BPR costs.

### serde_json float round trip

`float_roundtrip` is on in `crates/sim/Cargo.toml`. Before it, a report rewritten by `calibrate --seeds` differed from a solo run in the last digit of 24 floats (for example backlogPct 0.9312402599870767 against 0.9312402599870768); now the solo seed-1 report and the `--seeds` copy are byte-identical (same revision). Simulation numbers are unchanged (PM seed 1 report identical before and after). Two golden strings in `tests.rs` that pass the metrics through a JSON parse moved in their last digit.

### Result: ten seeds

Seeds 1 to 10 (PM also 11 to 20), scale 1.0, 60 minutes, fingerprint f0df1aabc323, `npm run assess -- --publish --noise`. Every figure equals round 33's (in brackets).

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars, all study-area local streets | | 822 (822) | | 466 (466) | 358 (358) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 | 142 / 132 / 98 / 150 (same) | 146 / 140 / 96 / 152 (same) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.5 / 55.1 / 37.4, 3 of 4, error 7.5 (same) | 52.8 / 47.9 / 56.6 / 38.9, 3 of 4, error 6.0 (same) | 50.8 / 43.9 / 59.6 / 47.3 (same) | 52.6 / 37.2 / 62.8 / 45.5 (same) |
| Cars cleared from gridlock per hour (D16) | below 1 | 1.10 (1.10) | 1.30 (1.30) | 0.30 (0.30) | 0.00 (0.00) |
| Entry backlog, mean % | below 2% | 0.71 (0.71) | 0.57 (0.57) | 0.03 (0.03) | 0.01 (0.01) |
| Completed trips | | 25,857 (25,857) | 25,965 (25,965) | 22,628 (22,628) | 16,705 (16,705) |
| Recent stations GEH<5, fitted / held out | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |
| Claremont Ave northbound at Ashby Ave, veh/h | 577 (2010) | 373 (373) | 411 (411) | | |

Validation: 61 of 72 cases pass, as in round 33. Failing: a3, e2, e3, j6, j8, j9, j12 (reviewed), l1, p2, p3, b13 (not reviewed).

### Verdict

Status `uncalibrated`. PM peak: D16 fails (1.10 and 1.30 cars cleared from gridlock an hour); D5 fails (3 of 4); the through-car check fails on all four blocks; the station rule fails fitted (82%) and held out (54%). AM peak: D16 passes (0.30); stations pass fitted (87%) and fail held out (74%). Midday: D16 passes; no counts. Primitive validation: p2, p3, b13 and l1 fail with no reviewed exception.

### What remains off

- Ashby Ave / Claremont Ave: the 2010 worksheet plan serves northbound Claremont Ave less than round 33's flow-based plan, and neither comes near the 577 counted in 2010. The worksheet codes Ashby Ave eastbound with two lanes where OSM has one; with one lane and about half the cycle the approach cannot carry the 1,163 an hour Caltrans counted in 2024. Whether Ashby Ave has a second eastbound lane in the PM peak (a peak-hour parking restriction, for example) needs a field check. A current timing sheet would settle the phasing.
- The queue-first left-turn model fixes p2 and p3 and still makes the network worse.
- As in round 33: l1's range disagrees with the cited method; b13 sits 2 veh/h under its band; field checks of rounds 30 to 32 are open; stored proposal results, text pages and previews are stale.

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

The question of this round: which trips make up the excess through cars on Hillegass Ave and Colby St southbound, 62nd St eastbound and Forest St eastbound, and which arterial movement or cost term makes the side street win for them? Diagnosis first, on the round 29 engine, network and demand; then the junctions that produce removals, checked against OSM and repaired at the source; then the delay-feedback fit on the repaired engine; then the ten-seed evaluation. Decisions are in `openspec/changes/archive/2026-11-22-calibration-round-30/design.md`. Simulator fingerprint 447ddb0b99a9 at the start; 7b94e620c9d8 after this round's engine edits (a diagnostic view and a reset repair, no change to any run); 169f9cf71eef after the trip-tracing change (explain-traffic-redistribution) merged into main during the round, whose uid repair changes every run; 09963f723083 after a last merge at the end of the round, which leaves the baseline unchanged (PM seed 1 identical to the link). Network a64c2a63399e5423 to 69f62ad981d0b8fa, demand 83bdd362657a2305 to c4420aa7aeecc473, frozen split unchanged.

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

