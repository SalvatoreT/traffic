# Simulator audit: ideas from other traffic simulators

Compiled 2026-11-12. Scope: what published documentation, manuals, guidance and papers say about other simulators and about how simulation studies are calibrated and communicated, read against this project's known weak spots. Citation keys resolve in `docs/references.md` (new entries are in section 7.4 there).

## Clean-room rules

These rules held for the whole audit and apply to anything built from it.

1. Sources are limited to published papers, official user and developer documentation, manuals, tutorials, FAQs, conference slides and project web pages. No simulator's source code was opened or read. No repository, code file, issue thread or forum post was opened. Reading documentation prose that sits in a repository was allowed, but none was needed: every page used was served from a project documentation site or a vendor, agency or publisher host.
2. Each idea is written as a behavior: what it does, why it helps, what data it needs. No identifiers, file names, function names, option names, configuration attributes, code or pseudo-code from any source appear here. Where a document gives a numeric default or threshold that is part of published guidance (for example a GEH limit), the number is quoted with its source.
3. The provenance log in Appendix A lists every source consulted: title, URL, date accessed (all 2026-11-12) and kind of document. Appendix B lists what could not be reached.
4. Software licenses are noted for context only, as the project's own page states them.
5. Anything recalled from memory instead of read is marked "unverified" and kept out of the recommendations. There are very few such items; each is flagged where it appears.
6. Documentation pages for several tools include sample configuration files and command lines. They were read to understand behavior and are not reproduced or paraphrased.
7. No person's name appears in this file, following the repository rule. Sources are cited by title and key.

## How to read the entries

Each idea has the same fields: what it is, which tools do it and the source, which of our problems it addresses, what it would take here, risks, and a recommendation. Size is rough: small is days of work, medium is one to three weeks, large is more. "Recommendation" is one of adopt now, adopt later, or skip, with one sentence of reasoning. Evidence is "read" unless the entry says otherwise, meaning the behavior was stated in a document I read in full or in the relevant section.

Our known weak spots, used as the yardstick: route shares on two residential streets (Colby St SB is 18 points under the observed 45%); PM-peak stability within one vehicle of D4; drivers that used to wander; no mid-link lane changing; a static signal phase structure; assumed walking and biking volumes; 60-second calibration runs on a 4,450-link network; one study area.

What the cost-loop record shows, because several entries lean on it: the delay-feedback loop gave headline-share errors of 12.6, 9.9 and 15.1 points over three iterations, and iteration 1 gave back stability (removals 0 to 4.7 an hour). Colby St SB is used by interior trips in the simulator that the static assignment keeps on the arterials, and cost differences of a few seconds decide it.

---

## 1. Route choice and demand

### R1. Damped, monitored cost feedback between simulator and assignment

What it is: when route costs come from simulation and routes come from costs, the loop is fed with a running average of past costs, or only a shrinking fraction of drivers may change route each iteration, and the loop stops on a measured convergence criterion instead of a fixed count. The usual measures are the relative gap between experienced travel time and the time on the best alternative, and the share of links whose flow or cost changed by less than 1% for several consecutive iterations.

Who does it: SUMO's iterative assignment script keeps up to five alternative routes per driver, blends the stored cost of unused routes with the new one, offers a forced-convergence mode that freezes a growing fraction of drivers, and stops on a fixed count or on the relative deviation of average travel time over iterations; it warns that even after 1,000 iterations results can still vary [SUMO-Docs, dynamic user assignment page]. Aimsun's equilibrium mode uses method-of-successive-averages style weights, including a weighted variant that moves 2/(n+1) of demand instead of 1/n, and stops on a relative gap, generally set between 5% and 10%, optionally with the share-of-links criteria [Aimsun-Manual, DTA and DUE pages]. The UK guidance sets the base-model target at a gap under 0.1% for strategic assignment, or at least a stable and documented gap, and four consecutive iterations with over 98% of links changing by less than 1% [WebTAG-M3.1, section 3.4 and table 4]. The FHWA primer notes that feedback schemes between route planner and simulator "may not necessarily converge" [FHWA-HRT13054].

Our problem: the cost loop (step AY) oscillated and was not shipped; D5 stays at 2 of 4 or 3 of 4 headline shares. An undamped update moves trips toward links that were fast in the last run, which the next run then loads, exactly the oscillation that the averaging schemes are built to stop.

What it would take: small. Average the delay file across iterations with a 1/n or 2/(n+1) weight, report the share of links whose cost changed by under 1% and the relative gap in the fit report, and stop on those. No new data. Each iteration is a simulator run per period (60 s), so ten iterations is about ten minutes per period.

Risks: simulator noise sets a floor on the gap, so the stopping rule needs the seed spread (see C3); averaging a noisy jammed run in the PM peak can freeze a bad cost prior (see R2).

Recommendation: adopt now. It is the cheapest documented fix for the specific failure recorded in step AY.

### R2. Cost prior from a stable demand level ("cliff edge")

What it is: congested iterations feed implausible costs, so costs are first collected at a lower demand level where the network still works, converged there, and then reused as the routing prior for the full demand. The UK transport authority's Vissim guidance describes ten-percent volume increments and finding the demand fraction where performance collapses; SUMO's iterative assignment can ramp traffic up over early iterations and can start from a static assignment [TfL-TMG4, appendix IV; SUMO-Docs, dynamic user assignment page].

Our problem: D4 holds at scale 0.4 (PM) and 0.35 (AM) and fails at 1.0, and the delay file from a run near failure is exactly the kind of input that destabilized iteration 1.

What it would take: small. We already have a scale option; run the loop at the largest scale that satisfies D4, then apply those costs at 1.0.

Risks: costs at 0.4 understate delay on the bottleneck links, so the full-demand run may route too many trips onto them, the opposite error. It treats a symptom, since the cause of the jam is capacity, not routing.

Recommendation: adopt later, as an experiment after R1, because it only helps if the loop is first damped.

### R3. Probabilistic choice among a few alternative routes

What it is: instead of a deterministic shortest route with small random noise, each driver picks among a short list of routes with probabilities that fall with cost difference. The variant that corrects for overlap between routes (so two nearly identical routes do not double-count) is common in commercial tools.

Who does it: Aimsun's route-choice module offers binomial, proportional, logit and overlap-corrected logit choice over the set of least-cost routes found in past intervals, with a share of drivers allowed to repeat the choice en route [Aimsun-Manual, DTA and stochastic route choice pages]. SUMO's iterative assignment offers a logit mode and a default mode driven by past route costs [SUMO-Docs, dynamic user assignment page]. The UK guidance accepts either iterated deterministic or stochastic assignment and gives separate convergence rules for the stochastic kind, noting that its convergence is "far more difficult to monitor" [WebTAG-M3.1, 3.4.10].

Our problem: Colby St SB. Cost differences of a few seconds decide the route in the simulator, and the 8% per-driver cost noise reproduces neither the observed split nor the assignment's. A logit split between near-equal routes gives a graded share where our rule flips.

What it would take: medium. A route set per origin-destination pair (we already compute cost-to-go per destination), a probability function with one scale parameter that is an assumption until fitted, and calibration of that parameter against the select-link shares. The data are the select-link shares we already have.

Risks: one more parameter to fit to four numbers invites over-fitting; it moves routing away from the "shortest by cost" semantics that the specs and UI explain; the overlap correction needs a commonality measure that has to be chosen.

Recommendation: adopt later. It targets D5 directly, but only after R1 shows whether damping alone fixes the oscillation.

### R4. Count coverage analysis: where the next count is most valuable

What it is: a tool that takes the fitted trips and the existing counting locations and reports what share of trips pass at least one count, and which candidate locations would observe the most uncovered trips. Aimsun's detector-location tool does this, and its documentation suggests running the network with one trip per origin-destination pair to see routing coverage before collecting data [Aimsun-Manual, calibration and validation page]. SUMO's route sampler flags the opposite problem: when counts are too few or inconsistent the route-selection problem is underdetermined and the result can look implausible, and it recommends looking at where mismatch is high next to locations with no mismatch [SUMO-Docs, route sampling page].

Our problem: counts cover few intersections, ramp counts are old and lack a peak direction, and local trip generation is assumed. We do not know which unobserved movements carry most of the unobserved trips.

What it would take: small. The assignment already yields trips by route; count the share observed per station and the marginal gain of each candidate intersection. No new data. The output is a ranked list that residents can use to plan manual counts.

Risks: coverage says where counts help, not that counts will agree with the model. Candidate locations from the static assignment inherit its route errors.

Recommendation: adopt now. It converts the "few counts" weak spot into a concrete data-collection request at almost no cost.

### R5. Route-sanity indicators in every run report

What it is: report, next to throughput, the quantities that reveal bad routing: vehicles removed from the network, vehicles never loaded (latent demand), vehicles that reach a link end with no route, circular routes, and missed or repeated turns. The UK Vissim guidance lists exactly these as items in the simulator's error output that should be empty or small, and treats removed vehicles as a model defect [TfL-TMG4, section 7.5.2.7]. Aimsun's calibration page lists vehicles lost and missed turns as dynamic checks [Aimsun-Manual, calibration page].

Our problem: drivers that used to wander. D4 counts removals and backlog but not detour factor, loops or switches per trip.

What it would take: small. Per completed trip: path length over shortest-path length, number of repeated links, number of voluntary switches. Report mean, 95th percentile and the count above a cutoff in the calibration report. No data.

Risks: the cutoffs are assumptions until a published detour-factor range is found (not found in this audit).

Recommendation: adopt now. It would have caught the wandering earlier than the removal count did.

### R6. Cheap counts-to-routes sampling with mismatch output (as a cross-check)

What it is: SUMO samples routes from a candidate set so that observed counts, turn counts, origin-destination counts and a total are matched, then optionally solves a relaxed integer program to shrink the remaining mismatch, and writes a mismatch map and per-location GEH statistics [SUMO-Docs, route sampling page]. Its two-step recipe (first place the 80% of traffic on a few important hand-drawn routes, then spread the rest) matches how our observed route shares act as constraints.

Our problem: it is a second, independent way to build the same demand, which would test whether D5 failures come from the fit or from the simulator.

What it would take: large to reimplement, small to borrow the idea of a mismatch map. We keep our fit and add the output only: signed deficit per station on a map layer, and GEH per station.

Risks: a second demand-building method adds maintenance for no gain unless it disagrees with ours.

Recommendation: skip as a method; adopt the mismatch map and per-station GEH under C1 and U1.

### R7. Count-based calibration of agent plans

What it is: MATSim compares simulated hourly link volumes to counts, and lists a separate calibration integration that adjusts agent plan scores so the simulated counts approach the observed ones while the agents keep choosing by utility [MATSim-Guide, section 11.4; the method is in [Flotterod2011], which was not read]. The audited guide describes only the comparison, not the integration.

Our problem: none specific. Our fit is already assignment-based and count-constrained.

What it would take: large; it presumes agent plans with activities.

Recommendation: skip. Evidence of the method is metadata only.

### R8. Origin-destination estimation with confidence weights

What it is: one DTA tool estimates demand by minimizing a weighted sum of the gap to target demands and the gap to observed link flows and densities, with the weights stating how much each source is trusted, while the equilibrium condition is kept as a constraint [NDOT-DTA2017, section 4.8.1].

Our problem: the fit treats station counts, ramp ADT, observed route shares and census-based priors with different reliability (ramp counts from 2012 to 2021, resident-provided shares). Per-source weights are implicit.

What it would take: medium. Make the per-source weights explicit parameters in the fit config, state each as an assumption, and report sensitivity of the headline shares to them.

Risks: the weights are unobservable; an explicit weight can make a judgment look like a measurement.

Recommendation: adopt later. It improves transparency about what the fit trusts, not accuracy.

### R9. Demand response, mode shift and time-of-day change

What it is: MATSim agents replan route, departure time and mode in repeated iterations and keep the best-scoring plans; the audited guide describes the replanning strategies and a plan selection rule over each agent's few stored plans, with a share (often 10%) of agents trying a modified plan each iteration, and a switch-off of innovation at the end [MATSim-Guide, sections 1.4 and 4.6]. BEAM keeps a travel-time-updating physical layer separate from an agent layer that chooses modes within the day [BEAM-Docs]. The UK guidance says model scale and purpose decide whether demand response is needed [WebTAG-M3.1, appendix C].

Our problem: demand is fixed by design, yet real schemes also remove traffic ([Thomas2024] in the README), so our estimate of traffic that moves to neighbors is an upper bound.

What it would take: full agent replanning is large and needs activity chains we do not have. A labeled sensitivity is small: drop a fixed share of car trips on origin-destination pairs whose cost rises by more than a threshold, using a published evaporation share, and show the result as a band beside the fixed-demand result.

Risks: the share is the dominant assumption and must come from cited evidence; showing a band could be read as a prediction.

Recommendation: adopt later (sensitivity band only); skip full replanning.

---

## 2. Calibration and validation practice

### Standard acceptance criteria, as published

The table gathers the numbers read in the guidance. "Cases" means individual link flows or turning movements.

| Check | Criterion | Source |
| --- | --- | --- |
| Link and turn flows, size bands | within 100 veh/h below 700 veh/h; within 15% from 700 to 2,700; within 400 above 2,700; in more than 85% of cases | [WebTAG-M3.1, table 2] |
| Link and turn flows, GEH | GEH below 5 in more than 85% of cases; the guidance says either criterion suffices and both should be reported, and that turn movements may not reach the guideline | [WebTAG-M3.1, 3.3.10 to 3.3.12] |
| Microsimulation, extra | all entry flows within 5% of observed; exit flows GEH below 5 on 85% or more; for turns, practice is GEH below 10 for every movement | [WebTAG-M3.1, C.3.3, C.3.7, C.3.8] |
| Same, London | GEH below 5, below 3 "strongly recommended" on critical links; entry flows within 5%; saturation flows within 10% of observed; demand-dependent signal stages within 10% of observed frequency | [TfL-TMG4, section 7.5.2] |
| Journey times | within 15% of surveyed, or within 1 minute if larger, on more than 85% of routes (strategic); for microsimulation within 15% and within 60 s | [WebTAG-M3.1, table 3, C.3.10]; London: within 15%, averaged over multiple seeds [TfL-TMG4] |
| GEH bands, one vendor | 0 to 5 good; 5 to 10 investigate; above 10 unacceptable | [Aimsun-Manual, calibration page] |
| GEH, one state manual (secondary) | GEH below 3 for state-facility segments, entries, exits and ramps; below 5 for at least 85% of local segments | [TxDOT-TSP13] |
| FHWA 2019 four criteria | (I) 95% of simulated points inside the 95% band of observed day-to-day variation; (II) two thirds inside the one-sigma band, including the two most congested intervals; (III) average absolute error no larger than the average difference between the representative day and the other days of the same travel condition; (IV) mean signed error no more than a third of that | [FHWA-TAT3-2019, chapter 5] |

GEH itself: the square root of twice the squared difference between modeled flow M and counted flow C, divided by their sum, for hourly flows [TfL-TMG4, appendix II]. The same appendix shows why it is lenient at low flows: 1,000 against 850 and 100 against 57 both give 4.9, though the percentage differences are 18% and 75%.

### C1. Adopt the published flow criteria and report GEH with the size bands

What it is: the three flow bands and the GEH test above, evaluated on the fitted stations and on turning movements, each period reported separately, with the count of cases failing and the reason (WebTAG 3.3.12 asks for an explanation of every miss).

Our problem: the fit report says 46 of 50 PM stations are within 15%, but that uses one percentage for every volume. Our residential-street flows are in the 50 to 300 veh/h range, where 15% is tighter than the published 100 veh/h band and GEH is looser (75% error passes at 100 veh/h). The guidance pairs the two for that reason.

What it would take: small. Pure post-processing of the fit report. No new data.

Risks: counts here are single-day or AADT-derived with large uncertainty; the guidance itself says criteria should not be forced when counts are poor (section 3.3.9 and 3.3.12 of the WebTAG unit: explain, do not constrain). A pass on weak counts says little.

Recommendation: adopt now. It gives D5-adjacent reporting a standard that outsiders can check.

### C2. Separate calibration counts from validation counts

What it is: use one set of observations to adjust the model and a different, independent set to judge it. WebTAG says to carry out calibration and validation as two exercises against two independent datasets and describes a hierarchy of screenlines: some used in building the demand, some as constraints, some held back [WebTAG-M3.1, C.3.2 and 4.2.1]. Turn counts should be constraints only if both classified and automatic counts exist (4.2.5).

Our problem: the fit uses all counts and the same counts then "validate" it. We have no estimate of out-of-sample error, which matters for interventions that move traffic to streets with no count.

What it would take: small to medium. Hold out a stratified subset of stations (or leave out one corridor at a time), refit, and report the held-out GEH and percent errors. Data: none new, but it uses up scarce counts in the fit.

Risks: with about 50 stations, a fixed hold-out costs fit quality. Leave-one-corridor-out is more efficient but costs more fits.

Recommendation: adopt now, as leave-one-corridor-out, reported once per calibration round.

### C3. Multiple seeds: how many, which, and how to report

What it is: judge every metric on the average over many runs with consecutive seeds, report the spread and confidence intervals, never choose seeds, and use the same seed set for the base and proposal runs.

Published practice: at least 10 runs as a starting point, document variability, "cherry-picking" of seeds is "strongly discouraged"; and demonstrate that enough runs were done to tell interventions apart [WebTAG-M3.1, C.9.1 and C.3.14]. London: 20 runs "normally sufficient", more for saturated models, seeds in a continuous range with a fixed increment, same seeds carried over to proposed runs, all seeds listed in the report [TfL-TMG4, section 7.5.1]. A contrasting position: the FHWA 2019 update calibrates one run per travel condition because variation across seeds is small compared with variation across days [FHWA-TAT3-2019, chapter 5].

Our problem: D4 is evaluated on seeds 1 to 3 and fails by one removal in some seeds; PM "fails in 2 of 3 seeds by one removal or 0.04 points of backlog". With a zero-removal rule and three seeds, small changes flip the verdict and the record cannot tell noise from effect.

What it would take: small. Run 10 seeds (parallel, about the same wall time) for every calibration state; report mean, standard deviation, and the share of seeds meeting D4; use a fixed seed range recorded in the report.

Risks: ten seeds multiplies compute by about three, though runs are independent and parallel. The FHWA argument is that day-to-day demand variation dominates; our demand is fixed, so seed noise is the only noise we have, which strengthens the case here.

Recommendation: adopt now. It is the one change that makes the PM-peak "within one vehicle" question answerable.

### C4. Compare D4 and D5 with published practice

D4 (60-minute PM run at scale 1.0: zero gridlock removals, backlog below 2% of spawned trips, arterial mean speed above 4 m/s) is a sanity gate, not an accuracy test. The nearest published practice is the "error file should be empty or small" rule for removed vehicles, vehicles not loaded and circular routes [TfL-TMG4, 7.5.2.7], plus network-exit-flow GEH and, in the FHWA 2019 criteria, bottleneck throughput judged against variation bands. No guidance sets a numeric backlog limit. The differences to note: guidance averages over 10 to 20 runs and ours over 3; guidance wants warm-up and cool-down periods outside the judged peak [WebTAG-M3.1, C.2.14], which D4 should state it does or does not have; guidance treats queue lengths as visual evidence, not a strict criterion [WebTAG-M3.1, C.3.6; TfL-TMG4, 7.5.2.5].

D5 (modeled select-link shares within 10 points of observed for four headline shares) has no published counterpart. The closest are flow criteria that gate on a share of cases (more than 85%), never on every case, and that require an explanation of each miss. Our four-of-four gate is stricter in count but uses the weakest data: observed shares are resident-provided percentages from a sampled select-link source. One consequence: a gate on all four headline shares fails on the single worst-measured number.

What it would take: small to restate; the harder part is to avoid choosing a gate that merely passes. If D5 is widened to the eleven via-street shares that are already within 5 points, the headline shares must still be published beside the larger set and Colby St SB named as a failure.

Recommendation (for D4/D5): adopt now for D4 (ten seeds, report mean and spread, add warm-up statement); adopt later for D5 (gate on a share of shares plus a named list of misses), because it needs the observed-share uncertainty first (see C5).

### C5. Tolerance bands from observed variability

What it is: derive each target's tolerance from how much the observed quantity varies from day to day, so that a simulation "within noise of the observation" passes and a strict fixed band is not imposed on a quantity that is itself noisy. The FHWA 2019 criteria build a band around a representative day from the other days in its travel condition and ask 95% of simulated points inside the 1.96-sigma band [FHWA-TAT3-2019, chapter 5].

Our problem: ±10 points on route shares is an arbitrary tolerance for a number whose own sampling error is unknown; counts are single days.

What it would take: medium. The Oakland annual counts [OaklandTMC] include repeat counts at Telegraph Ave and Alcatraz Ave (four reports), which could give a spread at that one station and perhaps a few more. For route shares the sampling error depends on the provider's sample size, which we do not have.

Risks: a band from a few days understates variation; a wide band can hide model error.

Recommendation: adopt later. First get the spread at the few multi-year stations; use it for the band on flows. For route shares, ask the source for sample sizes.

### C6. Journey-time validation

What it is: compare modeled and surveyed route travel times, averaged over seeds, within 15% and 60 s, on routes long enough that junction effects average out, with cumulative segment plots to locate where a route goes wrong [WebTAG-M3.1, C.3.10; TfL-TMG4, 7.5.2.4]. For cyclists London recommends GPS-derived times with the markers placed from the middle of one junction to 10 m before the next stop line, because red-light compliance by cyclists spoils junction-approach comparisons [TfL-TMG4, cyclist validation].

Our problem: we validate flows and shares but have no travel-time check; D4's 4 m/s arterial speed floor is a weak substitute. Queue-at-the-right-place is the visible symptom at the SR-24 west end and 52nd St.

What it would take: small to compute, data collection medium: timed runs along Telegraph, College, Claremont and Alcatraz in the AM, midday and PM, by residents with a phone, or any public speed dataset whose terms allow it (not found in this audit).

Risks: with few runs the "observed" value has a wide interval; the guidance asks for the 95% interval of observed times beside the modeled mean.

Recommendation: adopt later. High value for the PM peak but gated on data.

### C7. Saturation-flow and signal-demand validation

What it is: London requires modeled saturation flow within 10% of observed at stop lines and the frequency of demand-dependent stages within 10% of observed; it allows a modified copy of the model to measure saturation flow where real conditions never saturate the line [TfL-TMG4, 7.5.2.2 and 7.5.2.3].

Our problem: the validation suite already checks saturation flow against published ranges on synthetic networks (cases a1 to a4, 1,682 and 1,754 veh/h per lane), but the adaptive signal's phase frequencies and splits are never compared with the real signals on the arterials.

What it would take: medium. Needs observed cycle length and splits at a few signals (city timing sheets, or timed observation).

Recommendation: adopt later.

### C8. Warm-up and cool-down periods; judge only the peak

What it is: simulate shoulder periods before and after the peak so the network is loaded when the judged period starts and queues clear in the base case; demand in the shoulders should be observed, not guessed [WebTAG-M3.1, C.2.14].

Our problem: 60-minute runs. The record shows the PM entry backlog growing in a 120-minute run (389 trips at 60 min, 1,192 at 120), so a 60-minute window can hide a queue that keeps building.

What it would take: small to check; the run cost rises. State in the calibration record which minutes D4 judges.

Recommendation: adopt now as a documentation and measurement fix (state the judged window); adopt later if the window needs lengthening.

---

## 3. Intersection and lane modeling

### L1. Choose the lane at link entry by the next movement and the shortest eligible queue

What it is: a vehicle that cannot change lanes mid-link still needs a sensible lane when it enters a link. The behavior to copy is that it picks among the lanes that allow its next turn, preferring the one with the shortest queue, and re-checks when the situation changes. The failure to avoid is documented by A/B Street: vehicles stay in the lane they first choose, "sometimes they choose their lane really poorly", wait in a full lane while another lane that allows the same movement is empty, and two turns that end in the same lane conflict "at the granularity of the entire intersection", so one group waits for the other to clear [ABStreet-Docs, project notes on gridlock and the simulation overview].

Who does the opposite: SUMO's default has at most one vehicle per lane position with instant lane changes, and an optional lateral-resolution model; CityFlow keeps per-lane vehicle lists with segments to find neighbors quickly for lane changes [SUMO-Docs, sublane page; Zhang2019CF]. Guidance for microsimulation names lane-changing aggressiveness among the behavior parameters that set junction capacity [WebTAG-M3.1, C.2.16].

Our problem: no mid-link lane changing. Check first whether entry-time lane choice already uses queue length among eligible lanes; if it does not, this is the cheapest part of the weak spot to close. The record does not say.

What it would take: small to check, small to medium to add. Data: lane-use tags from OSM turn lanes where present (we count left-turn-only lanes today).

Risks: shortest-queue choice can overload a lane that must serve a turn two links later; mid-link changes (MOBIL is in `docs/references.md` section 2) remain the large piece.

Recommendation: adopt now (check and, if absent, add eligible-lane choice); adopt later for mid-link lane changes because it needs lane-level geometry and costs per-step compute.

### L2. Let drivers enter a blocked box after a patience time, and count each case

What it is: drivers are normally barred from entering an intersection whose exit is full, so they do not block cross traffic. After a stated waiting time, a driver ignores that rule and enters, which is how real queues resolve a locked junction. SUMO does both: a heuristic that stops vehicles driving onto a junction where they are likely to get stuck, and a per-driver parameter that ignores it after accumulated waiting [SUMO-Docs, intersections page]. A/B Street's gridlock notes say that real drivers "wiggle around partly blocked turns" and that intelligent gridlock avoidance "is not simulated and is extremely hard to simulate", and list block-the-box protection and a locking rule for turn sequences as implemented fixes [ABStreet-Docs, gridlock notes]. SUMO's calibrators go the other way and delete vehicles when jams exceed what the observed flow and speed would give [SUMO-Docs, calibrator page].

Our problem: D4 counts gridlock removals, and a PM peak fails by one removal. Removal is the harshest response and it creates a metric that flips on a single vehicle. A patience-based entry resolves the same lock without deleting a car.

What it would take: small to medium in the signal and node logic. No data.

Risks: this changes what D4 measures. If entries after patience are not reported they hide failures. The remedy is to report patience entries per hour as a new line beside removals and keep removal as the last resort. It must not be adopted to make D4 pass.

Recommendation: adopt later. It improves realism and reduces brittleness only if every use is counted and reported.

### L3. Signal control: phase skipping, extension, coordination, time-of-day plans

What it is: three separate behaviors. First, phases that can be skipped when no demand exists and green that extends while vehicles keep arriving or accumulated delay of queued vehicles stays high (SUMO offers gap-based and delay-based control and a dual-ring standard form; its generated plans keep a fixed phase sequence and vary only timing, with one exception that skips a phase when the only conflict is a pedestrian crossing) [SUMO-Docs, traffic lights page]. Second, coordination: SUMO ships tools that adapt green splits to a demand and shift offsets to make green waves, and an actuated phase can be coordinated by giving it earliest and latest end times within a cycle reference [SUMO-Docs, traffic lights page]. Third, plans that differ by time of day, which A/B Street lists as a limitation of its stage-based signals; its format specifies each stage as a set of protected and permitted movements with a fixed or variable duration, and a leading pedestrian interval is modeled as an extra short crosswalk-only stage [ABStreet-Docs, traffic signal model]. London validates demand-dependent stage frequencies against observation [TfL-TMG4, 7.5.2.3].

Our problem: static signal phase structure; Webster cycle and splits re-estimated every five minutes. Validation case c2 (two signals 100 m apart with the adaptive plan) misses its range at 0.73 against 0.75 to 1.15, and c1 to c4 use uncoordinated offsets by construction.

What it would take: offsets from link travel time on corridors: medium; a skip rule for empty side-street phases: medium; time-of-day plans need observed plans, so data first.

Risks: any rule here is an assumption until compared with a real controller (C7). Oakland's real plans may be fixed-time on residential cross streets; adding actuation there would be wrong.

Recommendation: adopt later: offsets first (corridor signals on Telegraph, Claremont and College), phase skipping second.

### L4. Where the intersection model is deliberately simple

What it is: DTALite uses first-in-first-out through a node, and its own evaluation report notes that adding intersection links to a regional network then spreads a congested right turn onto other approaches [NDOT-DTA2017, section 3.3]. CARLA's traffic manager picks turns at random, applies its own junction priority and, at unsignalized junctions, orders vehicles first-in-first-out with a fixed waiting time; it is built for driving-agent testing and not for traffic assignment [CARLA-TM]. A/B Street's vehicles accelerate and stop instantly and it says not to use it for freeway jam waves [ABStreet-Docs, technical details].

Our problem: none. These are the failure modes that node-based gap acceptance, turn pockets and per-movement conflicts already avoid.

Recommendation: skip. Documented for completeness; nothing to adopt.

### L5. Waiting inside the intersection for a left turn

What it is: a left-turning vehicle on the priority road enters the intersection and waits in the middle for an oncoming gap, so it does not block the through lane behind it; the intersection is split into two parts for this purpose, and the vehicle may not enter if the intersection is blocked or the signal is red [SUMO-Docs, intersections page]. Signals can also allow a right turn on red only after a stop and a gap [SUMO-Docs, traffic lights page].

Our problem: validation case b9 (two lanes, 10% left, with pocket, 788 against 814 to 1,074 veh/h per lane) is below range.

What it would take: small to medium: a "committed" state for a permissive left turn that has entered the node.

Risks: we have a pocket and a node-based model, so part of this is already covered; unclear gain without looking at b9's mechanism.

Recommendation: adopt later, once the cause of b9 is known.

### L6. Turn speed from geometry

What it is: speed through a turn is limited by the curve's radius with a single fixed factor, and never above the mean speed of the entry and exit lanes [SUMO-Docs, intersections page].

Our problem: the record shows a turn-speed limit that held head vehicles at 4 to 5 m/s along a whole link was fixed in round 5.

What it would take: small, if the limit is not already derived from geometry.

Recommendation: skip. Check that the current limit depends on node geometry, but no new source or idea is needed.

---

## 4. Pedestrians and cyclists

### P1. Walking and biking demand from counts with the same machinery as cars

What it is: SUMO's count-based sampler can write pedestrians instead of vehicles from the same kind of count data [SUMO-Docs, pedestrians and route sampling pages]. London models cyclists with fixed demand assignment from turning proportions at junctions, because origin-destination data for cyclists are hard to collect, and validates cyclist flows against counts [WebTAG-M3.1, C.3.12; TfL-TMG4, cyclist validation].

Our problem: assumed walking and biking volumes. `data/demand/README.md` records one source of observed volumes (pedestrian crosswalk and bicycle movement counts at Telegraph Ave and Alcatraz Ave from four reports) and scales to it; there are no others used.

What it would take: small to medium. The Oakland count archive includes a file of bicycle and pedestrian counts at other Oakland locations (the demand README notes it was not read because it holds no vehicle counts) [OaklandTMC]. Use the other locations as holdout checks (C2), not only as a second scale point.

Risks: sparse locations; counts outside peak hours.

Recommendation: adopt later (use the other pedestrian and bicycle locations for validation).

### P2. Conservative pedestrian crossing rule and vehicle blocking at crossings

What it is: SUMO pedestrians cross an unprioritized crossing only when the whole crossing is free of vehicles for the time they need; at prioritized crossings they cross regardless; vehicles may not drive across an occupied crossing; a vehicle and a pedestrian on the same lane yield to each other [SUMO-Docs, pedestrians page].

Our problem: ours gives each crossing a yield probability drawn from observed staged-crossing rates that fall with speed and lane count, a different mechanism with published numbers.

Recommendation: skip. Ours is more empirical; SUMO's rule is a worst-case simplification.

### P3. Cyclist modeling choices in SUMO and the red-light assumption

What it is: SUMO states that it has no dedicated bicycle movement model, so bicycles are slow vehicles with their own parameters or fast pedestrians, and lists the problems with each [SUMO-Docs, bicycles page]. London says to assume red-light compliance in both base and future so the comparison is fair [TfL-TMG4, cyclist section].

Our problem: our cyclists are a separate agent type with crossings. The red-light compliance assumption should be stated in the UI.

What it would take: small (a sentence in the UI and spec).

Recommendation: adopt now, as a stated assumption only.

### P4. Crowd models for sidewalks

What it is: three pedestrian movement models in SUMO, from non-interacting to a striping model to an external crowd simulator [SUMO-Docs, pedestrians page].

Our problem: none; the study area has no sidewalk densities where crowding matters.

Recommendation: skip.

---

## 5. Interventions and scenario comparison

### I1. Cell and leak diagnostics for filters before any simulation

What it is: partition the interior streets into cells, meaning sets of streets reachable by car from each other without using the perimeter road, and mark filters, one-ways and turn bans as barriers. A scheme is "water-tight" when no path across a cell joins two different perimeter roads. A/B Street's neighborhood tool does this by flood-fill, shows cells as colored areas, lists the routes a driver might still take through the area (shortest paths that start and end on the perimeter and that are forced to stay inside, defined as a rat run only if the perimeter road is faster at free flow and the start and end are on different roads), and ranks neighborhoods by the number of internal rat runs; an optional slowdown factor on major roads stands in for peak-hour queues [ABStreet-Docs, LTN technical details; ABStreet-LTN-Talk]. UK design guidance describes the same test by hand: from any boundary road, try to reach another boundary road through the area; two movement types must both be blocked, straight through and cutting a corner between adjacent boundary roads [WWC-LTN-Guide, section 5.2]. The A/B Street tool states that drivers are assumed equally likely to enter and leave through any point on the perimeter and that it "does not try to say anything" about the wider network without its separate impact mode [ABStreet-Docs, LTN tool notes].

Our problem: the app shows a result only after the 60 s run. Interventions that leave an obvious leak (one parallel street open) look as good as a filter pair until the simulation shows the diverted traffic. The Trapezoid's perimeter is already defined by data (Telegraph, Alcatraz, College, Claremont, SR-24).

What it would take: small to medium, graph code on the existing road graph. No new data. Study areas stay data: the perimeter comes from the boundary list in the area file.

Risks: the free-fast-perimeter definition differs from our delay-aware routing, so the list may flag leaks that drivers would not use and miss others; it must be labeled as a screening aid. A/B Street itself reports bugs from bridges, tunnels and edge-of-map blocks.

Recommendation: adopt now. It is instantaneous, explainable on the map, and it feeds the search (S1).

### I2. Paired, trip-level before and after

What it is: compare each trip's time before and after the change instead of only link totals. A/B Street plots per-trip time changes, then sums time saved against time lost, and separates modes; its example shows driving "mostly a wash" with walking and cycling trips substantially faster, and notes that driver times still shift because other modes made different choices [ABStreet-Docs, case study on a filter proposal]. Its map can compare to the state before edits and browse example trips that changed route [ABStreet-Docs, user guide and LTN notes].

Our problem: the UI shows block-level change with a 5% dead band and results by mode; it cannot say how many drivers lose time, who gains, or give a rerouted trip to look at. The harm headline in the proposals rests on blocks.

What it would take: medium. Our demand table has fixed origin, destination and departure, so trips pair across runs with the same seed. Output per trip: time and route. Aggregate by origin-destination group to avoid pairing noise.

Risks: pairing breaks when an intervention changes chaos downstream; individual trips are noisy, so only groups or distributions should be shown.

Recommendation: adopt now for distributions (share of trips slower than 60 s, total hours saved and lost, by mode); adopt later for the browse-an-example-trip view.

### I3. Noise bands from simulated spread, not a fixed percent

What it is: the app draws "no change" when a street's difference is within a fixed 5% of the maximum (design D4 of the UI change). WebTAG asks the analyst to assess the model noise within and between runs and to size the benefit against it; the user benefit as a share of network cost should be at least ten times the convergence gap, though a smaller ratio is not by itself a problem [WebTAG-M3.1, 3.4.14 and 3.4.15]. WebTAG and London both require reporting variation across runs.

Our problem: a fixed 5% is an assumption; the actual seed-to-seed spread of a street's flow differs by street (small streets are noisier in relative terms).

What it would take: small to medium. Precompute, offline, per-link mean and standard deviation of baseline flow across 10 seeds and ship the table (same size class as the delays file, 50 KB); the UI compares scenario flow with the baseline mean and shows "no change" inside a chosen multiple of the standard deviation. For the scenario side, run two or three seeds in parallel workers.

Risks: a baseline envelope assumes the scenario's own spread is similar to the baseline's; stated as an assumption.

Recommendation: adopt now. It replaces an assumption with a measurement at low cost; see C3 for the seeds.

### I4. Scenario against scenario

What it is: save several proposals and flip between them, comparing options to each other and not only to the baseline; the tool also lets users upload a proposal anonymously and share a link [ABStreet-Docs, LTN tool features]. We already encode scenarios in links.

What it would take: medium (stored run results or on-demand runs; UI).

Recommendation: adopt later.

### I5. Exemptions and access in filter design

What it is: UK guidance describes bus gates, camera-enforced filters that exempt chosen vehicle types, and collapsible bollards for emergency vehicles, and says every property must remain reachable by vehicle. It also states that exempting all residents risks nullifying the mode-shift impact, which is an observation in the guidance and not a measured effect [WWC-LTN-Guide, sections 5.1 and 5.2]. A/B Street's cell rule says a cell must touch the perimeter or drivers cannot get in or out [ABStreet-LTN-Talk].

Our problem: our proposals leave "emergency access review" out of scope. A reachability check is much cheaper than a review.

What it would take: small: after interventions, every node of the area must reach the perimeter and be reachable from it by car, honoring one-ways and turn bans; flag nodes that fail.

Risks: it does not model fire-truck turning or bollard keys; label it a check, not a review.

Recommendation: adopt now as a check; skip exemption classes (buses were removed on purpose).

### I6. Safety exposure features per street

What it is: A/B Street scores streets by risk features (wide, fast, many-legged intersections) drawn from a local safety study, and compares totals before and after [ABStreet-Docs, case study]. SUMO's safety device logs time-to-collision, deceleration-to-avoid-collision, post-encroachment time and related measures, and needs the intersection's conflict information to derive some of them [SUMO-Docs, SSM page].

Our problem: we report speeds and time-to-collision conflicts as surrogates, with [FHWA-SSAM2008] thresholds.

Recommendation: skip. Our surrogate measures already cover the same ground, and the risk-feature approach depends on a local crash study we do not have.

---

## 6. Search and optimization of interventions

### S1. Use graph diagnostics to generate and prune candidates

What it is: before spending 60 s per candidate, use the leak and cell analysis (I1) to propose where a filter would split a cell, and to discard sets that leave the same leaks as a cheaper set. A/B Street's team describes greedy placement at the road with the most rat runs, observes the "whack-a-mole" effect of closing one road and sending traffic to the next, and mentions a rule of one entrance per cell with its cost and unpopularity, and "very different results for residents" between layouts [ABStreet-LTN-Talk]. UK guidance gives placement rules: block both straight-through and corner-cutting movements, keep the number of filters low by using severance lines such as railways and parks, put filters toward the middle so residents can reach the nearest boundary road, and use diagonal filters at crossroads so large vehicles do not have to reverse [WWC-LTN-Guide, section 5.2]. No published optimization algorithm for filter placement was found in this audit.

Our problem: the proposals search is a greedy beam over the baseline with a careful recheck (proposals design D3 and D4); the space is large and most of it is bad.

What it would take: medium: the leak analysis as a first-stage score; candidates from the baseline's heaviest cut-through blocks (already done) intersected with those that split cells.

Risks: pruning on a free-flow proxy can discard a package that works because of congestion; keep a sample of pruned candidates through the full simulator to estimate the miss rate.

Recommendation: adopt now, after I1.

### S2. Ranking with enough seeds to separate the options

What it is: WebTAG asks the analyst to show that enough runs were done to differentiate the interventions assessed, and London carries identical seed ranges across base and proposal runs [WebTAG-M3.1, C.3.14; TfL-TMG4, 7.5.1].

Our problem: the proposals list shows about five options from light-touch to strongest, ranked by harm and effect. If two options differ by less than the seed spread, the order is arbitrary.

What it would take: small: evaluate the short list on at least 10 paired seeds and print the mean difference with its interval; where the interval spans zero, say so.

Recommendation: adopt now.

### S3. Fast screening models

What it is: a mesoscopic model for screening and the microscopic model for confirmation. SUMO's mesoscopic mode runs "up to 100 times faster" with a coarser intersection and lane model that "is more tolerant of network modeling errors" [SUMO-Docs, meso page]. MATSim's default queue-based mobility simulation represents each link by capacity and storage and omits car following [MATSim-Guide, sections 1.3 and 4.4.1]. DTALite is a queue-based model that, per its summary, needs only capacity and free-flow speed [NDOT-DTA2017; Zhou2014DTALite, not read].

Our problem: 60 s runs limit the search to tens of minutes of compute per run (the proposals spec).

What it would take: large. A second model needs its own validation against the first.

Risks: a screening model's ranking can disagree with the microsimulation near congestion, where our interventions matter.

Recommendation: skip. A parallel 10-seed run on the existing engine (F2) gives more value per unit of work.

### S4. Signal retiming tools as optimizers

What it is: SUMO includes tools that retime splits for a given demand and set offsets for green waves [SUMO-Docs, traffic lights page].

Our problem: the proposals exclude new signals by user decision. Retiming existing ones remains in scope as "control changes".

What it would take: medium, and depends on L3.

Recommendation: skip for now.

---

## 7. Performance and scale

### F1. Save the network state after warm-up and start every scenario from it

What it is: save a snapshot of the simulation (vehicles, signal state, random-number state) at the time the judged period starts and load it for each variant. SUMO can save state at chosen times or periodically, including random-number generator states, and load it later, adding or removing vehicles on load; vehicles that have not departed yet are not part of the state and come from the input [SUMO-Docs, save and load page]. The UK guidance requires warm-up periods before the peak [WebTAG-M3.1, C.2.14].

Our problem: 60-second runs. If part of a run is warm-up, every candidate in the proposals search repeats it. A shared snapshot also removes warm-up differences between baseline and scenario, which is a source of noise in the comparison.

What it would take: medium. The engine is deterministic and Rust, so serializing its state is feasible, but state includes queues, signal phases, pending departures and the RNG. First measure what share of a run is warm-up.

Risks: an intervention that changes the network at the snapshot time (a filter on a street with cars on it) needs a rule for vehicles already on the changed link; SUMO allows removing and reinserting them, which our UI would have to explain.

Recommendation: adopt later. The gain depends on a measurement we do not have.

### F2. Run seeds in parallel workers

What it is: independent seeds are embarrassingly parallel. CityFlow reaches its reported speed mainly by multithreading a single run and a data layout built for fast neighbor lookup; its authors claim it is more than twenty times faster than SUMO on large networks, a claim the audit did not check [CityFlow-Docs; Zhang2019CF]. SUMO's iterative assignment documentation says parallelizing it is not currently possible [SUMO-Docs, dynamic user assignment page].

Our problem: ten seeds (C3), noise bands (I3) and paired search evaluations (S2) all need many runs.

What it would take: small. The sim runs in a Web Worker; spawn a pool sized to the device's core count for the offline tools (native threads or processes) and a few workers in the browser. No shared-memory threading needed.

Risks: browser memory (each worker holds the network); phones.

Recommendation: adopt now for the offline tools; adopt later in the browser.

### F3. Sampling the population and scaling capacities

What it is: MATSim runs a sample of the population (for example 10%) with link flow capacity and storage capacity multiplied by the same factor, and scales simulated counts back up when comparing [MATSim-Guide, sections 4.4.1 and 11.4].

Our problem: we reach D4 at demand scale 0.4 (PM) but that is not a sample of the same system.

What it would take: not applicable. It works for a queue model whose capacity is a link attribute. In a car-following model with discrete lanes, intersections and pedestrians, scaling capacity does not give the same interactions.

Recommendation: skip.

### F4. Multi-resolution: detailed core, coarse outskirts

What it is: use the detailed model where the study is and a mesoscopic or queue model beyond. SUMO's mesoscopic model uses the same inputs and runs up to 100 times faster [SUMO-Docs, meso page]; BEAM separates an agent layer that moves through travel times from a physical layer that simulates traffic and updates the travel times for the next iteration [BEAM-Docs]; the FHWA agent-based primer describes MATSim in the same two-layer terms [FHWA-HRT13054]. POLARIS describes a mesoscopic traffic flow model inside its agent simulation [Verbas2024, reference list only].

Our problem: the network is wide on purpose (Ashby to 52nd St, Sacramento St to Tunnel Rd), and the freeway and its west-end ramps are where the PM peak jams.

What it would take: large. A coarse model of the outskirts needs its own validation and coupling at the border.

Risks: the SR-24 west-end bottleneck is at the edge of the interior; replacing the area around it with a queue model removes the behavior we are trying to get right.

Recommendation: skip for now. Revisit if the number of study areas or the size of each makes 60 s runs impractical.

---

## 8. Data import and generalizing to new areas

### D1. A shared network and signal-timing schema

What it is: GMNS is an open specification for routable road networks in a human-readable table form: nodes, links, geometry, zones, optional lane, movement, signal controller, phase and timing-plan tables, with time-of-day variants for several of them [GMNS-Spec]. A/B Street can import GMNS signal timing for one intersection at a time, with caveats: some movements fail to match, some are wrongly marked protected, and crosswalks are not imported yet; it also lets a user import a demand scenario created by an external tool [ABStreet-Docs, importing a scenario and signal timing].

Our problem: the next study area. OSM carries no signal timing, so every new area gets uncalibrated adaptive timing unless a city publishes plans. A common format would let a city or a volunteer supply timing and lane tables without touching our importer.

What it would take: medium. A reader for the signal and lane tables, mapping to our node-based movements, with a report of unmatched movements.

Risks: GMNS field details were not read; the signal tables may not carry what our adaptive logic needs; adds a dependency on a specification that a search listing showed at version 0.96 (unverified).

Recommendation: adopt later, when a second study area has timing data.

### D2. A lint report for imported networks

What it is: a list of suspicious spots in the imported network for a person to check, rather than a rule that tries to repair each one in code. A/B Street's development notes conclude that "you can't code your way around all edge cases", that OSM often needs manual fixes, and that effort belongs in tools that detect and fix OSM problems; its gridlock list names short roads, oversized intersection geometry, bad signals at five- and six-way junctions, groups of signals that act as one, uncoordinated corridor signals and illegal turn sequences [ABStreet-Docs, gridlock notes]. Aimsun's model-building step includes a check that flags unconnected sections and conflicting turns [Aimsun-Manual, calibration page]. SUMO joins clusters of junction nodes with a heuristic and warns that complex clusters need a manual check, and can guess signals and lane connections from tagging [SUMO-Docs, OSM import page].

Our problem: the importer already joins junctions (20 m), joins signal clusters (40 m), merges freeway stubs (80 m) and joins staggered T-junctions (35 m), each fixing a defect found during calibration. Each is an assumption-valued threshold per area.

What it would take: small. After import, list: intersections whose geometry exceeds a size, links under a minimum length, signal groups with no joint plan, turn-restriction conflicts, one-way dead ends, and nodes from which a car cannot reach any gate. Report per area, shown to local reviewers.

Risks: none material.

Recommendation: adopt now. It is the generalization step with the lowest cost.

### D3. Regional defaults as data

What it is: SUMO ships alternate type maps that set default speeds and lanes per road class for a region (for example urban 50 km/h), and lets users combine a base map with patches [SUMO-Docs, OSM import page].

Our problem: our per-class defaults (speed, lanes when missing) are already in the area file, so areas can differ without code.

Recommendation: skip. Already done the same way.

### D4. Choosing the model boundary and size

What it is: A/B Street's import guide says official boundaries often miss relevant roads (for example bridges or a neighboring jurisdiction's streets), that a polygon should be drawn to include surrounding context for low-traffic-neighborhood work, that overlapping regions are fine, and that file size around 50 MB uncompressed is a practical target [ABStreet-Docs, importing a city]. London's guidance says to keep all non-local links and rat runs in an assignment network and to include a buffer [TfL-TMG4, section 5.5]; WebTAG likewise tells the analyst to include secondary routes and rat runs that the scheme could attract or repel [WebTAG-M3.1, section 2.4].

Our problem: ours is already a wide network. The matter is documenting the rule for choosing it for the next area.

What it would take: small (a paragraph in `data/areas/README.md`).

Recommendation: adopt later, with the second area.

### D5. A documented demand interchange

What it is: A/B Street documents a scenario file that lists people, each with trips (departure, origin and destination as positions or buildings, mode), so any external demand model can feed the simulator; its Seattle runs use a regional travel-demand model to produce about 75,000 trips for the area [ABStreet-Docs, scenario format and case study].

Our problem: demand synthesis for a new area needs resident counts and census flows we may not have; a documented trip-list format would let others bring demand.

What it would take: small to medium. Our flows are origin, destination, rate and mode per period; a trip list can be aggregated into that.

Recommendation: adopt later.

---

## 9. User interface and communication of uncertainty

### U1. Show where the model fits and where it does not

What it is: WebTAG asks for narrative about fitness for purpose, and for maps that show how the model performs near the scheme and in the wider area, with poorly validating areas called out [WebTAG-M3.1, 3.3.14].

Our problem: the UI labels the baseline "uncalibrated" and the PM peak "experimental". It does not say that Colby St SB carries 27% freeway-end trips where the observed share is 45%, which matters if a user places a filter nearby.

What it would take: small to medium. A map layer from the fit report: per-station GEH and percent error, plus the four headline shares with modeled and observed values, with text equivalents.

Risks: more visible misses may reduce trust, which is the point; the layer must keep the WCAG rules (not color alone).

Recommendation: adopt now.

### U2. State what a result can and cannot say

What it is: A/B Street's neighborhood tool "does not try to say anything" about effects on the wider area and keeps its impact-prediction mode behind multiple warnings; the project describes its stance as prototyping to start conversations and not to compete with calibrated models; and it treats the tool as unopinionated about goals [ABStreet-Docs, project notes]. FHWA's guidance on communicating results says to show comparisons ("compared with what?"), show causality and structure, and prepare to explain results that look inconsistent [FHWA-HRT11064].

Our problem: the UI already marks assumptions and an uncalibrated baseline. It could state at the moment of a result which outputs are robust (connectivity and cells) and which are model-dependent (flows, delays).

What it would take: small (copy and layout, through the humanizer step).

Recommendation: adopt now, together with I1 so that the first thing a user sees is the deterministic result.

### U3. Show spread, not a single run

What it is: report variation across runs beside any difference, and list seeds so a reader can reproduce [WebTAG-M3.1, C.10.1; TfL-TMG4, 7.5.1]. See I3 and C3.

Recommendation: adopt now (same work as I3).

### U4. Example trips and a replay for local reviewers

What it is: A/B Street lets a user follow one person through the day and browse trips whose route changed after an edit [ABStreet-Docs, user guide and LTN features]. WebTAG notes that videos of key areas in the model are common practice so local reviewers can compare with what they know of the street [WebTAG-M3.1, C.10.2].

Our problem: residents can verify behavior at their own intersection only by watching.

What it would take: medium (select a trip, trace it on the map, link from the change view).

Recommendation: adopt later.

---

## 10. Where each audited tool fits (coverage and licenses)

License notes are context only and are what the project's own page states.

| Tool | Read | License as stated | Notes |
| --- | --- | --- | --- |
| SUMO | documentation pages on route sampling, calibrators, assignment, rerouting, intersections, signals, pedestrians, bicycles, sublane, meso, safety device, state saving, OSM import | EPL 2.0 and GPL 2.0 (project home page) | Richest source of documented behavior. |
| MATSim | user-guide extract (traffic flow, replanning, counts, scoring contents) | book CC BY 4.0; software license not stated on pages read | Calibration add-on described only by title and metadata. |
| A/B Street | documentation site, LTN tool pages, slides | Apache 2.0 per `docs/references.md` section 7.1, not restated on the pages read | Closest analogue; simple physics, strong UX and diagnostics. |
| CityFlow | project page, documentation, paper | Apache 2.0 (project page) | Design for speed; little to adopt. |
| Aimsun Next | manual pages on DTA, DUE, stochastic route choice, calibration | commercial (a licenser application is described); terms not read | Useful guidance on information classes and gap criteria. |
| PTV Vissim | no vendor manual page could be read; the London guidance's Vissim chapters and appendix were read | commercial; not verified | Statements here come from [TfL-TMG4], which describes Vissim use, not Vissim itself. |
| VISUM, TransModeler, Paramics | not reached | not verified | See Appendix B. |
| DTALite | agency report with its method; paper PDF returned 403 | not verified on a page read | OD matrix estimation weights; first-in-first-out limitation. |
| DynusT, TRANSIMS | one paragraph in the agency report; federal primer for TRANSIMS | not verified | No manuals reached. |
| POLARIS, BEAM, MOSAIC | preprint (POLARIS); BEAM docs; MOSAIC home page | BEAM described as open source by its lab page; MOSAIC EPL 2.0 (home page); POLARIS not stated in what was read | BEAM's two-layer structure is the only transferable idea found. |
| CARLA traffic manager | architecture page | open-source per the site; code license not read | Random turns and its own junction priority; nothing to adopt. |
| FHWA, TfL, WebTAG | volume III (2019), traffic modelling guidelines v4, M3.1 | public agency documents | Source of every numeric criterion above. |

---

## 11. Ranked top ten

Ranked by expected effect on a weak spot per unit of work, with evidence quality in mind.

1. Ten-seed reporting with intervals, a fixed seed range, and a seed-based noise band in the UI (C3, I3, U3). Why: the PM-peak criterion sits within one vehicle of its threshold, three seeds cannot classify it, and every published guide asks for 10 to 20 runs. Small work, no new data, and everything else in this list is evaluated with it.
2. A damped, monitored cost loop (R1). Why: the recorded loop oscillated, and the documented remedies (averaging, forced convergence, a gap and share-of-links stopping rule) are standard. Small work. It is the most direct route to the D5 miss on Colby St SB.
3. Published flow criteria, GEH with the size bands, and leave-one-corridor-out validation (C1, C2). Why: the fit report uses one percentage for all volumes and has no out-of-sample test; the standard criteria and a held-out set are cheap and let outsiders check the claims.
4. Cell and leak diagnostics, plus a reachability check, shown before any simulation (I1, I5, U2). Why: instant, explainable, matches published design guidance, and gives users a robust result next to the model-dependent ones. Small to medium.
5. Route-sanity indicators in every run report (R5). Why: removals and backlog do not show detours, loops or repeated switches; the wandering defect would have shown up in a detour-factor tail. Small.
6. Count-coverage analysis (R4). Why: it turns "few counts, assumed local volumes" into a ranked list of where the next resident counts help most. Small, no new data.
7. A fit overlay in the UI (U1). Why: the miss on two residential streets is the most decision-relevant caveat and is currently not visible on the map. Small to medium.
8. Trip-level, paired before and after distributions (I2). Why: block-level change with a fixed dead band cannot say how many drivers lose time or whether a gain for one mode costs another; the audited tool with the closest purpose reports exactly this. Medium.
9. Probabilistic choice among a few routes with overlap correction (R3). Why: a few seconds decide Colby St SB today. Medium, and it follows #2, which is why it ranks below it.
10. Check and, if absent, add lane choice at link entry by next movement and shortest eligible queue (L1). Why: the closest documented analogue lists "vehicles wait in a full lane while another sits empty" among its main gridlock causes. Check is small; the remaining lane-change work is large and stays on the later list.

Next in line: a patience-based box entry with every use counted (L2); signal offsets along the corridors (L3); journey-time validation once timed runs exist (C6); a warm-start snapshot (F1); the lint report for imported networks (D2, small and worth doing alongside the second area); an explicit-weights option in the fit (R8).

---

## 12. Ideas we already do better, or differently on purpose

- No flow forcing. SUMO's calibrators insert and delete vehicles to hit a measured flow and clear jams above what the flow and speed imply [SUMO-Docs, calibrator page]. We keep counts as fit targets and report gridlock removals as a failure of the baseline (D4), so a bad network shows up and is not hidden.
- Drivers differ in information. A share of drivers follows live guidance and re-evaluates each epoch, the rest keep their departure route unless blocked, switches need a saving above a band and a floor, and each trip has a switch limit (`params.rs`, [Guin2021], assumptions labeled). Aimsun separates habitual, pre-trip and en-route drivers by different assignment modes and a share of en-route repeats [Aimsun-Manual]; SUMO equips a probability of vehicles with periodic rerouting and uses one exponential or moving average of edge speeds [SUMO-Docs, automatic routing page]. A/B Street has no rerouting and says so. Ours is closer to Aimsun's classes than to a single rerouting probability, with citations for the share.
- Observed route shares as constraints. None of the documentation read describes calibrating to select-link route shares; counts, turn counts and origin-destination totals are what the sampler, the calibrators and the plan-calibration integrations use. We fit to shares as well and report where the simulator disagrees with the static assignment. The cost of this is the D5 problem above.
- A primitives validation suite. London's guidance requires saturation-flow checks on the project model and WebTAG mentions them; we check signal saturation flow, stop and yield capacity, circle entry, link and motorway capacity, and pedestrian and cyclist effects on synthetic networks against published ranges with sources and list 13 failures with their mechanisms (45 of 58 pass). The guidance does not require this and none of the audited tools documents it.
- Right turn on red as gap acceptance with an assumed stop dwell, instead of a node type that permits it (SUMO) [SUMO-Docs, traffic lights page]; ours yields to every conflicting movement and is a labeled assumption.
- Deterministic, seeded and in the browser. Results are identical for identical inputs and seed (traffic-simulation spec). The guidance wants seeds recorded for reproduction [TfL-TMG4, 7.5.1; WebTAG-M3.1, C.10.1]; we also let anyone rerun the exact scenario from a link.
- Demand is fixed on purpose. MATSim and BEAM replan route, time and mode [MATSim-Guide; BEAM-Docs]; we hold demand constant so the before and after compare the same trips, state this, and treat reduced traffic as an upper bound on displacement (R9 is a labeled band, not a change of principle).
- Wide network, narrow map. London's guidance and WebTAG both say to include a buffer and the rat runs; the model area is much larger than the study area for that reason [TfL-TMG4, 5.5; WebTAG-M3.1, 2.4].
- Importer joins as general rules. Junction joining, signal clusters, freeway stubs and staggered T-junctions are the same classes of fix that SUMO's heuristic and A/B Street's consolidation make; ours are area-config thresholds, documented per round.

---

## Appendix A. Provenance log

Every source consulted. Access date for all rows: 2026-11-12. "Used" means the audit relies on it; "context" means read but not relied on. Hosts were fetched with an HTTP client and the text extracted; images and formula glyphs were not available. For the one source whose URL contains a personal account name, the URL is in `docs/references.md` under [ABStreet-LTN-Talk].

| # | Title | URL | Kind | Use |
| --- | --- | --- | --- | --- |
| 1 | SUMO documentation: Tools/Turns (route sampling and turn definitions) | https://sumo.dlr.de/docs/Tools/Turns.html | official documentation | used |
| 2 | SUMO documentation: Tools/Routes | https://sumo.dlr.de/docs/Tools/Routes.html | official documentation | context |
| 3 | SUMO documentation: Tools/Trip (random trip generation) | https://sumo.dlr.de/docs/Tools/Trip.html | official documentation | context |
| 4 | SUMO documentation: Simulation/Calibrator | https://sumo.dlr.de/docs/Simulation/Calibrator.html | official documentation | used |
| 5 | SUMO documentation: Demand/Dynamic User Assignment | https://sumo.dlr.de/docs/Demand/Dynamic_User_Assignment.html | official documentation | used |
| 6 | SUMO documentation: Demand/Automatic Routing | https://sumo.dlr.de/docs/Demand/Automatic_Routing.html | official documentation | used |
| 7 | SUMO documentation: Simulation/Intersections | https://sumo.dlr.de/docs/Simulation/Intersections.html | official documentation | used |
| 8 | SUMO documentation: Simulation/Traffic Lights | https://sumo.dlr.de/docs/Simulation/Traffic_Lights.html | official documentation | used |
| 9 | SUMO documentation: Simulation/Pedestrians | https://sumo.dlr.de/docs/Simulation/Pedestrians.html | official documentation | used |
| 10 | SUMO documentation: Simulation/Bicycles | https://sumo.dlr.de/docs/Simulation/Bicycles.html | official documentation | used |
| 11 | SUMO documentation: Simulation/SublaneModel | https://sumo.dlr.de/docs/Simulation/SublaneModel.html | official documentation | used |
| 12 | SUMO documentation: Simulation/Meso | https://sumo.dlr.de/docs/Simulation/Meso.html | official documentation | used |
| 13 | SUMO documentation: Simulation/Output/SSM Device | https://sumo.dlr.de/docs/Simulation/Output/SSM_Device.html | official documentation | used |
| 14 | SUMO documentation: Simulation/SaveAndLoad | https://sumo.dlr.de/docs/Simulation/SaveAndLoad.html | official documentation | used |
| 15 | SUMO documentation: Networks/Import/OpenStreetMap | https://sumo.dlr.de/docs/Networks/Import/OpenStreetMap.html | official documentation | used |
| 16 | Eclipse SUMO home page | https://eclipse.dev/sumo/ | project web page (license statement) | used |
| 17 | The MATSim Book (page) | https://www.matsim.org/the-book | project web page | context |
| 18 | MATSim user guide extract, compiled 2026-08-25 | https://matsim.org/files/book/partOne-latest.pdf | official manual (PDF, 24 MB) | used |
| 19 | MATSim documentation index and downloads pages | https://matsim.org/docs/ ; https://www.matsim.org/downloads/ | project web pages | context |
| 20 | A/B Street documentation, single-page version | https://a-b-street.github.io/docs/print.html | official documentation | used |
| 21 | A/B Street: Traffic simulation (stub page) | https://a-b-street.github.io/docs/tech/trafficsim/index.html | official documentation | context |
| 22 | A/B Street documentation home | https://a-b-street.github.io/docs/index.html | official documentation | context |
| 23 | A digital twin to design, analyse, and visualise low-traffic neighbourhoods (conference slides) | see `docs/references.md`, [ABStreet-LTN-Talk] | conference talk slides | used |
| 24 | Connected Neighbourhood Tool user guide | https://a-b-street.github.io/ltn/user_guide.html | official user guide (page returned only a title) | context |
| 25 | CityFlow project page | https://cityflow-project.github.io/ | project web page | used |
| 26 | CityFlow documentation: Introduction | https://cityflow.readthedocs.io/en/latest/introduction.html | official documentation | context |
| 27 | CityFlow: a multi-agent reinforcement learning environment for large scale city traffic scenario (WWW 2019 demo), arXiv 1905.05217 | https://arxiv.org/pdf/1905.05217 | published paper | used |
| 28 | Aimsun Next User Manual: Dynamic Traffic Assignment (26.0.0) | https://docs.aimsun.com/next/26.0.0/UsersManual/DynamicTrafficAssignment.html | official manual | used |
| 29 | Aimsun Next User Manual: Stochastic Route Choice (latest) | https://docs.aimsun.com/next/latest/UsersManual/StochasticRouteChoice.html | official manual | used |
| 30 | Aimsun Next User Manual: Dynamic User Equilibrium (22.0.4) | https://docs.aimsun.com/next/22.0.4/UsersManual/DynamicUserEquilibrium.html | official manual | used |
| 31 | Aimsun Next User Manual: Calibration and Validation of Aimsun Models (latest) | https://docs.aimsun.com/next/latest/UsersManual/CalibrationAndValidationOfAimsunModels.html | official manual | used |
| 32 | Aimsun Next User Manual: Calibration and Validation Theory | https://docs.aimsun.com/next/latest/UsersManual/CalibrationAndValidationTheory.html | official manual | context |
| 33 | FHWA Traffic Analysis Toolbox Volume III, 2019 update (FHWA-HOP-18-036) | https://ops.fhwa.dot.gov/publications/fhwahop18036/fhwahop18036.pdf | agency guidance (PDF) | used |
| 34 | FHWA Volume III 2004 version, landing page and short PDF | https://ops.fhwa.dot.gov/trafficanalysistools/tat_vol3/vol3_guidelines.pdf | agency guidance (the PDF fetched had 5 pages; no criteria text) | not used |
| 35 | TxDOT Traffic Simulation Manual, 13.5.2 and 13.5.2.4 | https://www.txdot.gov/manuals/des/tsp/chapter-13-microsimulation-analysis/13-5-calibration/13-5-2-acceptability-criteria.html | state agency manual | used (secondary) |
| 36 | TAG Unit M3.1 Highway Assignment Modelling (version dated May 2026) | https://assets.publishing.service.gov.uk/media/664dad464f29e1d07fadcc39/tag-m3-1-highway-assignment-modelling.pdf | government guidance (PDF) | used |
| 37 | Traffic Modelling Guidelines, Version 4.0 (September 2021) | https://content.tfl.gov.uk/traffic-modelling-guidelines.pdf | agency guidance (PDF, 8 MB) | used |
| 38 | An introductory guide to low traffic neighbourhood design: 5.1 Design tools; 5.2 Filter locations | https://www.walkwheelcycletrust.org.uk/our-services/infrastructure/an-introductory-guide-to-low-traffic-neighbourhood-design/an-introductory-guide-to-low-traffic-neighbourhood-design-contents/52-filter-locations/ | charity design guidance | used |
| 39 | NDOT Research Report 557-14-803: Regional DTA models in Nevada | https://rosap.ntl.bts.gov/view/dot/35062/dot_35062_DS1.pdf | agency research report (PDF, 8.6 MB) | used |
| 40 | FHWA primer for agent-based simulation, chapter 4 (FHWA-HRT-13-054) | https://www.fhwa.dot.gov/publications/research/ear/13054/005.cfm | agency report | used |
| 41 | FHWA Guide on the Consistent Application of Traffic Analysis Tools and Methods, chapter 7 (FHWA-HRT-11-064) | https://www.fhwa.dot.gov/publications/research/operations/11064/007.cfm | agency guidance | used |
| 42 | GMNS specification site | https://zephyr-data-specs.github.io/GMNS/ | open specification | used |
| 43 | CARLA documentation: Traffic Manager | https://carla.readthedocs.io/en/latest/adv_traffic_manager/ | official documentation | used |
| 44 | Eclipse MOSAIC home page | https://eclipse.dev/mosaic/ | project web page | context |
| 45 | BEAM documentation: About BEAM; welcome page | https://beam.readthedocs.io/en/latest/about.html | official documentation | used |
| 46 | BEAM project page (Berkeley Lab) | https://transportation.lbl.gov/beam/ | project web page | context |
| 47 | Modeling transit in a fully integrated agent-based framework (POLARIS), arXiv 2408.05176 | https://arxiv.org/pdf/2408.05176 | preprint | context |
| 48 | Crossref metadata for Bayesian demand calibration (Transportation Science 45(4)), DTALite (Cogent Engineering 1(1)) and the Cadyts chapter | https://api.crossref.org/works | bibliographic database | metadata only |
| 49 | Web search summaries on DTALite, DynusT, TRANSIMS, POLARIS, Vissim, LTN impact tools, GMNS, uncertainty communication | search engine results | search summaries | pointers only; no claim rests on them unless it is also in a row above |

## Appendix B. What could not be reached, and what was left unread

- PTV Vissim and VISUM manuals: the Vissim help site is a framed page whose content URLs were not found by fetch or search; VISUM was not attempted. Vissim statements come from the London guidance. A search summary mentioned a Kirchhoff-exponent route choice for Vissim; it is unverified and unused.
- TransModeler: one vendor URL returned 404; nothing read. Paramics: not attempted.
- DynusT: search found no manual; only a paragraph in an agency report was read. TRANSIMS: the Studio documentation was not found; the federal primer was read. DTALite: the paper PDF returned 403, so only the agency report's description was used; the project user guide is on a host that returned an error through the proxy.
- POLARIS: the 2024 preprint was fetched and read for its introduction and reference list, not for its traffic model. MOSAIC: home page only. CARLA: one page, for intersection behavior.
- FHWA Volume III, 2004 version: not read (the fetched PDF had 5 pages and no criteria). Its per-measure targets in this file come only through the state manual in row 35 and are secondary.
- WebTAG units other than M3.1 (M1.2 data sources, M2.1 variable demand, M2.2 matrices) and the UK road-design manual: not read. Australian guidance: not searched.
- The Cadyts calibration chapter: listed in the MATSim guide, text not read. The Zhou and Taylor DTALite paper: not read.
- A web archive host did not answer. Two Wikipedia mirror pages in search results carried inserted unrelated text and were discarded.
- GEH: the formula in the UK PDF is an image; its form comes from the London guidance's appendix, which prints it as text.
- Items marked "unverified": the Kirchhoff-exponent search summary above; the GMNS version number (from a search listing); the CityFlow speed claim, which is the authors' and was not checked.
