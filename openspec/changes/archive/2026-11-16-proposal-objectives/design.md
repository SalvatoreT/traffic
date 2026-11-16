## Decisions

Project lead, 2026-11-16: "You can have different proposals that optimize for different things." The cost of closures counts "Light." Every weight and threshold below is an ASSUMPTION: no published value exists for them.

### D1. One list, several goals

The list stays one list sorted by through cars removed. What changes is how options get in. Four objectives each pick a winner, and an option says which objectives it won. The rest of the list, up to six options, is the best remaining by through cars removed that is not similar to an option already chosen. The old rules (best single, lightest, spread by reduction) are replaced: the single-change and light packages now come from the objectives that ask for them.

### D2. The objectives

1. Most cut-through removed: the search score, through cars removed less the existing light penalty for the largest all-car rise on one block.
2. No street closures: the same score among packages made only of Slow Streets, one-ways, all-way stops, traffic circles, speed humps and turn bans, as the lead listed them. Modal filters and diverters are out. A one-way does close one direction of a block to cars; the lead's list counts it as not closing the street, and the label says "no street closures".
3. Least detour for residents: the same score less `DETOUR_WEIGHT_PTS_PER_S` points per second of added resident trip time.
4. Fewest changes: the same score among packages of at most two changes (`FEWEST_MAX_CHANGES`).

Residents' detour is the mean trip time of completed car trips with an origin or destination inside the study area, scenario minus baseline on the same seed, averaged over the searched periods. It uses the simulator's existing split (`inside_trip_stats`: completed trips with an end inside the study area and their summed time), so the simulator and its fingerprint are unchanged. The total is the same trips' summed added time as vehicle-minutes an hour. Limits: only trips that complete inside the run are timed, so a package that leaves trips unfinished at the end of the run looks better than it is on this figure; the access and run checks (unroutable, gridlock, backlog) still reject packages that strand traffic.

### D3. The beams

Each objective runs its own beam (`beam_search_in`) over one shared screening cache and one candidate list, so a package screened for one objective is free for the others. The no-closures beam may combine only candidates that close nothing (the same restriction the profile mechanism's `exclude_types` makes at generation, applied as a mask so candidate numbers stay valid). The fewest-changes beam stops at depth two. The least-detour beam ranks by the screening score less the weight times the one-seed detour of the screening run. Known and warm-start packages join a beam only when all their interventions are allowed in it. Finalists of each beam (a third of `--finalists`, at least three) join the main finalists; all are rechecked once.

### D4. Choosing

The main choice's filters (established reduction, stability against churn, domination, simpler packages, the Pareto-consistent listing, near-duplicate folding) run once over all finalists and once inside each objective's pool of eligible packages. Without that, a filter package that dominates every closure-free package would remove them all before the no-closures objective could pick one. For least detour, domination and the simpler-package rule also compare the detour, so a package with a longer detour does not dominate one with a shorter one. An objective's winner has the highest score for that objective among its pool, then fewer changes. Least detour excludes packages that remove less than half (`DETOUR_REDUCTION_FLOOR`) of the most removed in its pool, which is the guarantee that the weight stays light. A package that wins several objectives is one option with all its tags; similar winners of different objectives stay separate options because each is the best for something different, and a winner folded into a similar package is replaced by that package only inside its own pool.

### D5. The detour weight

`DETOUR_WEIGHT_PTS_PER_S` is 0.5 points of through-car reduction (percent of the baseline) per second of added trip time per resident trip. "Light" was taken to mean: on the finalists of a search, the weight reorders packages whose reductions are within about 10 points and never lifts one with less than half the best reduction above the best. The second part holds by construction (`DETOUR_REDUCTION_FLOOR`). The first was checked on a small search (one period, three seeds, 10 minute runs, confirmation on three more seeds, 12 rechecked finalists). The best packages showed +3 to +5 s per resident trip, so 0.5 points per second costs them 2 points of a 17 to 19 point reduction, about a tenth. At half the weight (0.25) the winner was a package with 17.5% removed and +4.5 s; at 0.5 and at double (1.0) it was a package with 19.3% removed and +3.6 s. The winners differ by under 2 points of reduction. The detour itself is noisy at three seeds (a 95% interval of about -8 to +10 s on one option), which is why the figure carries its interval and the weight is kept small. The report prints this half, one and double table for every search (`Residents' detour weight`), so the weight can be revisited on a full search. The smoke search is a check that the machinery runs end to end, not a result to publish.

### D6. File and reader

The file stays version 5 with optional fields: `objectives` (ids) and `residentsDetour` (`secondsPerTrip`, `effect`, `vehicleMinutesPerHour`) on an option, and `computed.objectives` (the list with each rule, the weight and the floor) on a group. Older files have none and the app shows no tags and no detour line. The reader knows four ids and ignores others.
