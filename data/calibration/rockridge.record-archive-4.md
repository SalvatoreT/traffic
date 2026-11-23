# Rockridge baseline calibration record: archive, part 4

The forty-eighth round and the router diagnosis for the diagonal, moved unchanged from `rockridge.record.md` when the turn-restriction proposals were published (2026-11-22).

## Forty-eighth round: simulated membership for every exported station (not adopted) (2026-11-19)

Fails the keep rule, not adopted (change calibration-round-48, archived). The published network 53c823f20d9165ed, demand 9cdebdabf05c4460 and cross-validation demand 2f9ae152b9bbf78e stand. Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 throughout. Nothing under `data/` or `public/data/` changed apart from this record. The evidence is in `openspec/changes/archive/2026-11-19-calibration-round-48/evidence/` (laptop commits 534e31d and 71ce359), and the numbers below come from the laptop's report.

### What was tried

The demand fit decides which origin-destination pairs count toward each station from a static route assignment. This round used the simulator's own route choice instead. A loop runs the simulator for ten seeds, records which pairs actually pass each exported station, and refits demand with those pairs as the membership. The switch is `countFit.throughTargets.simulatedMembership` (`tools/membership-loop.ts`, `tools/lib/membership-loop.ts`). It is absent from the shipped config, so it is off by default. The through-car targets and the hand-picked `measuredStations` list stay as they are while the entry is present (design D12). The keep rule (D7), the screen and the stop rule (D11) were written before any run.

The run was on the project lead's laptop session on 2026-11-19, runbook steps A to G, 8:29 to 9:43 AM Pacific, starting at 816c7b5. Step H (the loop again with the prior worth 20 trips) was not run. During the run HEAD moved to 5cebe93 through round 47 evidence commits and a re-sign; no code changed.

### Hashes

- Baseline (the round 47 ten-seed set 60r47-base, inputs identical to this round's baseline): network 53c823f20d91, demands 9cdebdabf05c and 2f9ae152b9bb, stations c9db41c930ac, split be72380b485e, targets 9d1d593d3d35, simulator d45a275dd7be. It reproduces 74 of 92, 14 of 24, 70 of 77 and 14 of 19, and D5 at 4 of 4 (mean error 4.6).
- Gate checks: fingerprint d45a275dd7be0713cec6a64394b7d8a9; `npx vitest run tools/membership-loop.test.ts` 20 of 20; baseline hashes 53c823f20d9165ed, 9cdebdabf05c4460 and 2f9ae152b9bbf78e; nothing changed under `data/`.
- Config with the entry: b74e86f898dd3a8f.
- Candidate: network 53c823f20d9165ed (identical); shipped demand 1771a9c4a51968c6; training demand 83396aeb2a4b1b63; membership files shipped 8f11b43838d3134d, training b99c26686c4c0cfc. After the run both views were rebuilt from the saved membership files with the same config hash and gave 1771a9c4a51968c6 and 83396aeb2a4b1b63 again.

### Loop behavior

The dry run matched the runbook. The split withholds 91 of 357 stations. Shipped view: PM 337 stations (245 link, 92 movement or route), AM 272 (200, 72), with the six gate stations static in each. Training view: PM 256 (187, 69), AM 201 (148, 53), none static.

Three passes ran (0, 1, 2). The stop rule did not fire: after pass 2 the ratios of change to standard error are still 1.74 to 2.87 in every view and period, against a threshold of 1. Every build after pass 0 printed the simulated-membership note, and no station lacked an export in any pass. The final fit reports say "30 runs": shipped PM 336 of 343 stations, shipped AM 271 of 278, training PM 256 of 260, training AM 201 of 205. Those counts are what is left after the zero-hit stations are removed. Pass 0 reproduced the baseline demand periods in both views.

Per pass: offered car demand in veh/h; stations with pairs; stations with zero hits; then, from pass 1, the change in flow and in membership per station as a ratio to its standard error (flow / membership).

| View, period | Pass 0 | Pass 1 | Pass 2 |
| --- | --- | --- | --- |
| Shipped PM | 27612; 335 of 337; zero hits: sr24-clifton-claremont move 1600>1771, telegraph-51st move 1629>1764 | 28169; 335 of 337; same two; 3.84 / 3.79 | 29107; 336 of 337; telegraph-51st; 2.17 / 2.80 |
| Shipped AM | 23204; 271 of 272; telegraph-51st | 24819; 271 of 272; telegraph-51st; 4.44 / 3.68 | 24861; 271 of 272; telegraph-51st; 2.25 / 2.22 |
| Training PM | 25044; 256 of 256; none | 25428; 256 of 256; none; 3.74 / 3.82 | 26455; 256 of 256; none; 1.86 / 2.87 |
| Training AM | 20584; 201 of 201; none | 21407; 201 of 201; none; 2.77 / 3.45 | 21755; 201 of 201; none; 1.74 / 2.60 |

### Keep rule, ten seeds

"Fitted" stations are in the demand fit. "Held out" stations are withheld by the frozen split and scored on the cross-validation demand. Each count is the number of stations that pass GEH on the ten-seed mean. D5 is the four headline freeway shares for Hillegass St and Colby St. Whole-street traversals are the eight street runs checked end to end. D16 is the stability check: backlog under 2% of trips, no backlog growth, and cars cleared from gridlock in the judged zone within the limit.

| Line | Baseline | Candidate | Line to meet | Result |
| --- | --- | --- | --- | --- |
| PM fitted | 74 of 92 | 78 of 92 | 74 | pass |
| PM held out | 14 of 24 | 13 of 24 | 14 | fail |
| AM fitted | 70 of 77 | 72 of 77 | 70 | pass |
| AM held out | 14 of 19 | 15 of 19 | 14 | pass |
| D5 headline shares | 4 of 4, mean error 4.6 | 2 of 4, mean error 12.5 | 4 of 4 | fail |
| Whole-street traversals | 8 of 8 | 8 of 8 | 8 of 8 | pass |
| D16 stability, every period | holds | fails in AM and PM (midday holds) | holds | fail |
| Validation suite | 67 of 74 | 67 of 74 | 67 | pass |

D5 detail, observed / baseline / candidate: Hillegass St southbound to the freeway 68 / 58.1 / 43.8 (fails); Colby St southbound to the freeway 45 / 41.4 / 29.0 (fails); Hillegass St northbound from the freeway 47 / 48.4 / 52.7; Colby St northbound from the freeway 47 / 50.5 / 51.3.

D16 detail. The failure is backlog, not gridlock.

- PM: backlog under 2% in 0 of 10 seeds (mean 2.97%, max 3.36%), baseline 10 of 10 (mean 0.28%, max 0.49%). Backlog growth fails in seeds 3 and 9. Cars cleared from gridlock in the judged zone: 0.50 per hour (max 3), under the limit; in all zones 29.0 per hour against 4.8. Arterial speed 6.71 against 7.94 m/s.
- AM: backlog under 2% in 7 of 10 seeds (mean 1.87%, max 2.35%), baseline 10 of 10 (mean 0.11%). Arterial speed 7.72 against 8.97 m/s.

Trips still waiting at the end of the run, seed mean, baseline to candidate:

| Period | Where | Baseline | Candidate |
| --- | --- | --- | --- |
| PM | all | 78 | 830 |
| PM | SR-24 eastbound entry (node 602) | 46 | 270 |
| PM | San Pablo Ave (node 183) | 14 | 229 |
| PM | Claremont Ave (node 1756) | about 0 | 142 |
| PM | Claremont Blvd (node 1398) | about 0 | 55 |
| AM | all | 27 | 464 |
| AM | Claremont Blvd (node 1398) | about 0 | 219 |
| AM | Claremont Ave (node 1756) | 18 | 178 |

Screen, three seeds: baseline PM 73 of 92 and 14 of 24, AM 70 of 77 and 14 of 19, judged gridlock 0 and 0; candidate PM 80 of 92 and 12 of 24, AM 73 of 77 and 15 of 19, judged gridlock 0 and 0. The screen passed (PM held out down 2, within the allowed 3). It does not measure backlog, so it could not show the failure the ten-seed run found.

### Why it failed

The loop added 1,200 to 2,100 veh/h of car demand at gates that have no count. Offered demand in the demand files, car veh/h, baseline to final candidate:

| Period, view | Total | SR-24 EB entry (602), origin | SR-24 WB entry (1719), origin | SR-24 WB exit (675), destination | SR-24 EB exit (1726), destination | Surface gates, origin | Surface gates, destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PM shipped | 27612 to 28816 (+4.4%) | 3945 to 4114 | 947 to 1232 | 3778 to 3949 | 709 to 854 | 11585 to 12174 | 13184 to 13819 |
| PM training | 25044 to 26891 (+7.4%) | 4112 to 4368 | 753 to 700 | 4156 to 4331 | 891 to 1119 | 9453 to 10210 | 11473 to 12390 |
| AM shipped | 23204 to 25301 (+9.0%) | 3656 to 3676 | 337 to 844 | 3159 to 3366 | 818 to 831 | 10289 to 11362 | 9406 to 10846 |
| AM training | 20584 to 21936 (+6.6%) | 3696 to 3730 | 376 to 746 | 3859 to 4147 | 765 to 834 | 7930 to 9132 | 8644 to 9411 |

The fit report's counted gate families stay on target: in the PM, gate entering is 2214 to 2213 against a target of 2200, and gate leaving is 2111 to 2121 against 2076. The extra demand sits at gates with no count: the SR-24 mainline entries and exits, San Pablo Ave, and Claremont Ave and Blvd.

The SR-24 eastbound entry (node 602) cannot carry it. Its simulated PM flow went from 3896 to 3819 veh/h (shipped) and from 4050 to 3994 (training), while trips waiting there rose from 46 to 270 and from 48 to 338. The mainline takes no more than about 3,900 veh/h, so the extra offered demand queues. In the AM the flow there was 3670 to 3680 and the wait 4 to 12. The Claremont gates queue the same way. The backlog fails D16 in both peaks, slows Telegraph Ave southbound (PM 335 to 510 s, observed 300 to 376) and College Ave southbound (PM 216 to 323 s, observed 202 to 293), and moves the two southbound freeway shares out of D5.

Mean through cars per hour on the study area's residential and service streets (per-seed calibrate report): PM shipped 729 to 944, training 1019 to 1080; AM shipped 447 to 466, training 549 to 532.

### What improved

- Fitted counts: PM 74 to 78 of 92, AM 70 to 72 of 77. Older counts, which are not conditions: AM fitted 35 to 40 of 48, AM held out 8 to 14 of 16, PM fitted 55 to 65 of 95, PM held out 16 to 12 of 34.
- The diagonal. Five diagonal stations, PM, counted 178 (Forest St EB 66, McAuley St EB 12, 60th St EB 23, Ayala Ave NB 60, Howell St SB 17). The simulated sum went from 495 to 462 in the shipped view and from 1234 to 651 in the training view. Per station, baseline shipped and training, then candidate shipped and training: Forest St 183, 516 then 151, 260; McAuley St 83, 183 then 78, 99; 60th St 76, 162 then 80, 83; Ayala Ave 81, 212 then 73, 129; Howell St 72, 162 then 80, 80. AM, four stations, counted 110: 206 and 428 (baseline shipped, training) to 165 and 341.
- Colby St northbound, simulated over counted, on the seven northbound blocks with counts (2591, 2593, 2595, 2597, 2599, 2601, 2605; the runbook said six): PM shipped 0.75 to 0.81, training 0.77 to 0.87; AM shipped 0.73 to 0.79, training 0.87 to 0.88. Whole-street PM Colby St northbound: 73 to 83, observed 102.
- SR-24 ramps, PM, target; baseline shipped, training; candidate shipped, training: Claremont on (833) 598; 773, 975; 690, 850. Clifton off (683) 617; 697, 943; 750, 905. 52nd on (725) 996; 968, 1054; 923, 975. 52nd off (727) 1024; 1029, 1013; 1054, 1040. MLK on (679) 1547; 1266, 1014; 1513, 1175. MLK off (719) 1614; 1512, 1519; 1526, 1481. MLK Grove St on (280) 190; 282, 532; 240, 633. Telegraph on (701) 657; 906, 1272; 1068, 1305. Aileen off (702) 621; 724, 646; 733, 721. The other 13 ramps and the AM table are in the archived evidence.

### Also reported

- Travel times inside the observed range: 7 of 12 to 4 of 12. PM College Ave NB 236 to 295 s and Telegraph Ave NB 321 to 338 s stay inside the range; Shattuck Ave NB 266 to 279 s and SB 272 to 280 s were too slow before and after. AM: College Ave NB 275 to 312 s and SB 181 to 209 s are now too slow; Telegraph Ave SB 287 to 315 s; Shattuck Ave NB 205 to 230 s.
- Flips: PM 8 fail to pass and 5 pass to fail; AM 4 and 1. The PM held-out net of minus 1 comes from three flips: 2601 Colby St 63rd to 63rd NB (fail to pass); 1897 Canning St 59th to McAuley St SB, 21 to 10 against 49 counted (pass to fail); 1867 60th St Howell to Canning WB, 55 to 64 against 25 counted (pass to fail).

### Verdict

Fails the keep rule on three lines: PM held out 13 of 24 (line 14), D5 2 of 4 (line 4), and D16 in the AM and PM. Not adopted. The code stays on main with the switch off, and the shipped config has no `simulatedMembership` entry. The published data are unchanged. Step H was not run. The change is archived with its evidence.

### Next lead

Run the same loop with the totals of the uncounted gates held fixed, so that offered demand cannot grow at gates with no count. The loop then keeps what helped (fitted counts and the diagonal) without the added load on the SR-24 eastbound entry and the Claremont gates. The screen should also add a backlog line, since it passed this candidate.

## Router diagnosis for the diagonal (diagnostic, nothing adopted) (2026-11-19)

Nothing shipped changed. Published network 53c823f2, demand 9cdebdab. Every run was a single seed (seed 1, PM peak, 60 min) in the cloud container, so every figure below is a diagnostic, not an assessment result. One seed moves the fitted-station pass count by about 3 and the diagonal sum by 10 to 15% between neighboring settings. The runs used the throwaway branch `router-diagnosis` (6bf5f6a), which adds environment switches to `eff.rs` and `sim.rs` plus scoring scripts under `tools/diag/`. It changes the simulator fingerprint source and is not for merge. The Shattuck tests changed network data only and ran on the original binary (fingerprint d45a275dd7be0713cec6a64394b7d8a9).

Metrics. DIAG5 is the sum of the simulated flow at the five diagonal stations, in cars per hour, against the counted 178 (Forest St EB 66, McAuley St EB 12, 60th St EB 23, Ayala Ave NB 60, Howell St SB 17). The pass counts are stations within GEH 5, as fitted/held out (base 70 of 92 and 14 of 24 PM). Colby St NB is the sim/count ratio of six block stations (base 742/1046 = 0.71). Travel times are seconds.

### What was asked

The audit above found the simulation carrying 2 to 5 times the count on the diagonal Telegraph Ave, McAuley St or 60th St, Ayala Ave or Howell St, Forest St, Claremont Ave, while the demand fit matches the counts. This diagnosis asked whether the router's cost model sends those trips there, and whether a router change would fix it.

### How route cost is built

A route costs the sum over its arcs of link cost times a class weight, plus a movement cost, each arc perceived with a per-driver normal error.

- Link cost is the larger of free-flow time (length over speed limit, plus 3 s per hump, HUMP_FF_PENALTY, ASSUMPTION) and a moving average of measured link times (alpha 0.3, refreshed every 60 s). The measured time includes queue and signal wait.
- Movement cost is static (turn penalty, control constant, crossing time at the turn speed) plus the measured movement time minus the measured link time.
- Class weight LOCAL_COST_FACTOR is 1.25 on residential and service links (ASSUMPTION, no source) and 1.0 elsewhere.
- Turn penalties: right 1 s, left 4 s, U-turn 25 s (ASSUMPTION). Turn speeds: right 4, left 5, U-turn 3 m/s, through 1.4 times the limit, circle 5 m/s (ASSUMPTION).
- Control constants from `crates/sim/data/node-delays.json`: signal 10 s, all-way stop 8 s, minor stop 14 s, circle 4 s, uncontrolled 0 (round 12).
- Perception is probit [DaganzoSheffi1977][Sheffi1985 eq 11.12] with variance ROUTE_DISPERSION_S = 2.0 (ASSUMPTION, chosen by sweep in round 31) times the arc cost, drawn once per driver and arc.
- GUIDED_SHARE 0.46 [Guin2021] (transfer ASSUMPTION) re-plans each epoch. Others keep the departure route unless blocked. SWITCH_BAND 0.2, SWITCH_MIN_GAIN_S 30, MAX_SWITCHES 2, MIN_SWITCH_GAP_S 120, BLOCKED_REROUTE_S 60 (ASSUMPTION) [Mahmassani1987][Srinivasan2000][Di2016]. INITIAL_CONGESTION 1.3 (ASSUMPTION).

The demand fit's static assignment uses the same local factor, turn penalties, constants and dispersion, but link time is free flow plus BPR (alpha 0.15, beta 4) with control delay subtracted, and it has no measured movement times and no live queues.

### The diagonal is the router's own cheapest path

Of 198 through trips that used a diagonal link, 80 went to south Oakland, 61 to the SR-24 westbound on-ramps, 22 to the hills via Claremont Ave, 11 to Telegraph Ave south and 24 elsewhere. With dispersion 0 (137 trips, 115 of which drive the router's best route), the diagonal beats the arterial alternative (all study-area locals closed) by 49 s mean and 24 s median of perceived cost (583 against 631 s). Measured link plus movement time is 373 against 442 s, and the route is 3,184 against 3,408 m.

For the ramp-bound trips (Berkeley north and west streets to the Claremont Ave/Hudson St ramp), the diagonal is 1,498 m with perceived cost 282 s. The arterial route (Telegraph Ave, Alcatraz Ave, College Ave, Claremont Ave) is 2,159 m at 397 s: 660 m (30%) longer, with 15 to 34 s of delay on each of four approaches. The fit's static assignment sends the same pairs to the 52nd St ramps and puts only 13 of the 198 trips on the diagonal. In the simulator the Telegraph Ave approaches to those ramps carry 20 to 40 s per signal, so drivers pick the Claremont ramp. The diagonal has almost no control (uncontrolled junctions at Ayala/McAuley, Ayala/Howell, Howell/59th/60th, per the imagery survey) and the simulation drives it near the 25 mph limit.

### Variants tried (PM seed 1; DIAG5 base 901 against 178)

- Local factor (all drivers): 1.6 gives 866, 2.0 gives 953, 3.0 gives 812; Colby St NB falls to 0.48, 0.42, 0.15 and fitted passes to 67, 62, 57. At 3.0 the arterial alternative saturates (measured 380 to 560 s) and the perceived costs equalize (752 against 760 s). Unguided drivers at 2.0: 671, Colby NB 0.63.
- Arterial weight 0.8 gives 679 and 0.6 gives 659 (Colby NB 0.55 and 0.43). Dispersion 0 gives 885 and 8 gives 935. Guided share 0 gives 993 and 1 gives 845.
- Turn penalties (left/right, seconds): 7/3 gives 771; 10/5 gives 609 (fitted 75, held 12, Colby NB 0.72); 15/8 gives 850; 20/10 gives 594 (Colby NB 0.58). Left 10 alone gives 742 and right 8 alone gives 815. The results are not monotone (609, 850, 594), so no trend is claimed.
- Extra seconds per local-to-local movement at uncontrolled or two-way-stop nodes: 10 s gives 645, 30 s gives 456, but Colby NB falls to 0.30 and 0.08 and fitted passes to 58 and 47. This is the lowest diagonal flow reached, and it costs counted flow elsewhere.
- Double-charged control delay (below): drop the constant once the link is measured gives 863; link cost as the larger of free flow plus constant and measurement, with the constant dropped from the movement cost, gives 767 (Colby NB 0.74, fitted 72).
- Residential speed limit scaled 0.85, 0.75, 0.65 (physics and routing): 782, 946, 994, with Colby NB 0.60, 0.48, 0.43. A scale below 1 is not supported by the speed literature records seen (search records only, no values read).
- Combinations: turn 10/5 with unguided local factor 2.0 gives 633; 10 s crossing with arterial weight 0.85 and unguided factor 1.6 gives 602 (Colby NB 0.29, fitted 58); control fix with 0.85 speed gives 644; with turn 7/3 added, 741; control fix with turn 7/3, 702. AM (four stations, counted 110) ranged 173 to 332 across five variants, against a baseline of 291.
- Shattuck Ave capacity (data-only): a lane added on the Shattuck approaches at 55th St and Alcatraz Ave gives 844; the signals at 55th St and Alcatraz Ave removed gives 1,202; the lane plus the 55th St approaches gives 794.

No variant brought DIAG5 near 178. The ones that cut it by half or more also cut flow at Colby St NB, a station group that was close to its count. Its through cars are mostly SR-24 off-ramp traffic to Telegraph Ave north (45 of 97).

### Confirmed double charge of control delay

The link cost already contains queue and signal wait from the measured times, and `eff.rs` adds the 10, 14 and 8 s constants to the movement cost on top, so control delay is counted twice at signals and stops. The constants were written in round 12 from simulated time lost against the limit (flow-weighted median), and they were the free-flow prior of the static router. No decision to charge both is recorded, and the demand fit (round 44) subtracts control delay so queues count once. Removing it is principled and matches the fit, but it moved DIAG5 only from 901 to 767 or 863, and it changes the route cost code and so the simulator fingerprint.

### Shattuck Ave travel time

Shattuck Ave is the one arterial that fails against observed travel times: NB 268 s against 144 to 178 s, SB 316 s against 158 to 221 s. Telegraph Ave (314 and 351 s against 302 to 420 and 300 to 376 s) and College Ave (223 and 206 s against 188 to 318 and 202 to 293 s) are inside the range. The cause is the signals: NB loses 116 s at 52nd St, 55th St and Alcatraz Ave, and SB queues 600 m behind 55th St (cycle 79 s, 31 s green for Shattuck Ave). The 2013 EIR PM entering counts at Shattuck Ave/55th St show the simulation carrying about 260 veh/h too many on the cross street and about 30% too few on Shattuck Ave. This matters only to the trips that use Shattuck Ave as their alternative. No observed time exists for Alcatraz Ave or Claremont Ave.

### Conclusion

The diagonal is the cheapest path under the router as built, and no single parameter family removes it without damaging stations that now pass. No router change was sent on for a ten-seed assessment.

### Open leads

- The ramp peak-hour factor. Config `ramps.kFactor` 0.09 is an unsourced ASSUMPTION. Counted ramps give 0.0571 to 0.0877 (pooled 0.0734); this is round 46 (`calibration-round-46`). The simulated Claremont Ave ramp carries 740 to 898 veh/h against a count of 598, and ramp-bound trips are 61 of the 198 diagonal trips. Not tested here.
- The Caldecott Lane pair-sum fit (design D9 of round 46): one Caltrans row split 50/50 over two ramps. Its own round.
- Fitting demand to simulated routes, so that the fit's static assignment and the simulator's router agree on which ramp and which street these trips use.
