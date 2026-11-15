## Context

Pilot-limits search, final model (demand 8ef2c6578dfbb9fc, network 5fe8241a6ba1e306), 5,003 s, beam 5, depth 6, expand 12, 40 locations, 20-minute screening on the PM peak at seed 1. Its best option had six changes and cut through cars from 464 to 113 an hour (-76%). An earlier round had published six whole-junction and block filters (63rd & Hillegass, Colby & North, 60th & Colby, Ayala & Martin, Howell & McAuley, and the block of Ayala between Howell and Forest). On the same model that package cuts them from 622 to 42 in the PM peak at seed 1.

## Diagnosis

Measured with `explore --check` on the final model, pilot-limits profile, all periods and seeds 1 to 3:

- Candidate list. All six interventions are candidates (numbers 1, 18, 6, 83, 105 and 100 of 179). The cap of 40 locations did not drop any of them.
- Limits and access. The profile allows all six, and the package passes the access check.
- Full recheck. Through cars 464.3 to 38.3 an hour (-91.7%; PM -92.1%, AM -90.9%, midday -92.0%), no rejection, score +86.1 against +65.6 for the search's best screening result. The ranking penalty is 56 cars an hour (61st Street between Hillegass and Colby, 70 to 120 in the PM peak). No block gains through cars beyond noise.
- Screening. The whole package screens at +93.4 (-95.9%, penalty 25).
- Subsets. Of its 62 smaller subsets, 40 carry a penalty above 80 cars an hour, and none of the six single filters scores above +4.3 (screening, one seed). Ranks among the 177 valid single interventions: by score 175, 136, 31, 123, 135 and 122; by reduction 52, 2, 18, 48, 145 and 120.
- Termination. The "stop when a level does not beat the best" rule never fired in that search: it ended at the depth limit with the best still rising at every level.

So the beam dropped the way to it. The first level took the five best singles by score and the second level extended them with the 12 best singles by score (no single of the package ranks within the best 30). Those are all-way stops, one-way blocks and slow limits that displace almost nothing and cut 7 to 10%. The filters that cut through cars most displace the most when they stand alone, because the other filters of the package are what absorb the traffic they send next door. The six filters work together: the whole package has a penalty of 25 where its subsets have 80 to 220. Ranking partial packages by the full penalty put every path to it below paths that cut less. Three of the five best singles by reduction were variants of one junction (the whole junction, one street, the block beside it), so a beam that ranked by reduction alone would also have been crowded.

The candidate cap, the per-street variants taken by themselves, the block filter on Ayala and the access check are not the cause. A search without the seeds file can lose any package of this kind, so the seeds file is the guard and the beam change makes the search less likely to need it.

## Decisions

D1. Seeds file. `data/proposals/<area>.seeds.json`, in git, small: `{ version, area, cap, seeds: [{ link, source, note, added, lastPublished, group, size, changePct, score }] }`. A package is identified by the sorted items of its link, so order, period and the `a=` part do not matter. Every run appends the options it published (a package already there keeps its first date, source and note and takes the new figures). Cap 20 by default, because each seed costs a full recheck (nine one-hour runs on the Rockridge model, about 65 s with four jobs). Over the cap the search-published entries that the run did not publish go first, the oldest by last publication and the weakest score first among equals. Entries added by hand never go.

D2. Using the seeds. They are decoded with the decoder the warm start uses and adopted onto the candidate list (a seed outside the 40 locations adds its own candidates). A seed the profile forbids, that fails the access check, that puts two interventions at one place, that repeats another, or that does not decode is dropped with its reason; the run counts them in `computed.knownPackages`. Every remaining seed is rechecked in full whatever screening or the budget said, like a warm-start package, but unlike one it is not exempt from being dropped as within noise of a simpler option ("equal terms"). The warm start from another group stays as it was.

D3. Starting the beam. Every seed and each of its sub-packages (one intervention removed) is screened. The best of them, taken in turn from each seed's family, as many as the beam is wide, start a beam beside the main one. The sub-packages are what finds a smaller good option near a known good package, and replacements for the removed intervention come from the repair moves. A seed family costs about six screening runs, so 20 seeds cost about 400 s, and the first extension of the known beam about 500 s.

D4. Partial packages are ranked with a phased harm weight (ASSUMPTION: linear ramp). Inside the beam, a package of `k` interventions is ranked by reduction minus `w * min(1, (k-1)/(depth-1))` times harm, with `w` the harm weight, so singles rank by reduction alone and packages of `depth` interventions by the full score. The ramp rests on the diagnosis above: later interventions repair what earlier ones displace, so the harm of a partial package overstates the harm of the package it grows into. The score that is published, the finalists and the choice of options use the full weight, so a package with high harm cannot win by this ramp. A line stops when no package of the next level beats the previous level's best at the new level's weight; the old rule compared full scores across levels, which would stop a line whose partial packages carry harm that later levels repair.

D5. One package per set of places in the beam and in the list of singles an extension tries. A whole-junction filter, a filter on one street, a diverter and an all-way stop at one junction are variants of one place; they all stay candidates and all get screened, but only the best-ranked fills a beam slot or an expansion slot. Repair moves still try every variant near a block that gained traffic.

D6. Stable options. When a new package is within the noise band on through cars of one an earlier search published (a seed with a `lastPublished` date), has no more harm (within the 10 cars an hour floor) and no more interventions, the earlier one stays and the new one is dropped, with a note. A published package falls to dominance only when the new package beats it by more than the noise band. The noise band is twice the standard error of the seed mean of the baseline's cut-through, at least 1%, about 8 points here. When the published package is larger than the new one and within noise, the simpler rule applies and the new one is kept. The listed ladder always starts with its lightest option (the best single intervention when one is listed), then the best overall, then options spread between them.

D7. Provenance. Each published option has `origin: { kind: search | seed | hand, added?, note? }`. `seed` means the package came from the seeds file with source `search` (a run published it), `hand` that a person added it. A package the search also found itself still reads `seed` or `hand` because the seeds file had it first. `computed.knownPackages` has `loaded`, `rechecked`, `dropped`, `droppedBy` (reason and count) and `droppedPackages` (link and reason). The report adds a Known packages section and a Source column.

D8. Tools. `explore --check LINK` scores a package with the search's own code (profile, candidate list, access check, full recheck, and with `--check-subsets` or `--check-singles` the screening picture a beam sees). `--add-seed`, `--seed-proposals` and `--seed-labels` fill the seeds file. `--seed-labels` takes the intervention labels an old report lists and matches them against the labels of every intervention the generator offers on the current network; labels in the old wording that no longer exist are skipped with a line.

D9. Candidate cap and termination left as they were. The cap of 40 locations did not lose any intervention of the package, and the line-stop rule never fired. The depth stays an input: a depth below the size of the best package still limits it, and the run says so by ending at the depth with the best rising.

## Risks

- Run time. Each seed adds a full recheck and the beam has a second lineage. The seeds cap and `--beam`/`--expand` bound it.
- The ramp is an assumption. If a model change made harm a better guide for partial packages, the seeds file would still hold the good packages.
- Seeds from an older network that still decode may no longer be good; they are rechecked on the current model, so they publish only if they are.
