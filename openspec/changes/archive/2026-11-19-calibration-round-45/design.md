## Context

Baseline for this round: the published model of 2026-11-18 (commit b1ff0ef, assessment ff5d667). Network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9. Ten seeds per period: PM fitted 74 of 92 recent stations within GEH 5, PM held out 14 of 24, AM fitted 70 of 77, AM held out 14 of 19, D5 4 of 4, whole-street traversals 8 of 8, D16 holds, validation 67 of 74. Round 44 failed its keep rule and left these as they were.

The signal at Claremont Ave / Colby St / Forest St has three phases in the model (Claremont Ave, Colby St, Forest St; the two Forest St legs share one). The volunteer count of 2025-02-25 gave the cycle (79 s) and the Colby St green (4 s, 3.3 cars per cycle). Nothing observed gives the Forest St green. The PM plan the simulator builds is Claremont Ave 24.7 s, Colby St 4.0 s, Forest St 35.3 s, with 5 s of clearance after each phase (YELLOW 3.5 s plus ALL_RED 1.5 s, both assumptions in `crates/sim/src/params.rs`). The Forest St share comes from the flow-based split of [Webster1958] and grows with the cars that cut through to it.

## Decisions

D1. Project lead, 2026-11-18: trial a shorter Forest St green as a labeled assumption, as a calibration round. A candidate is kept only under the keep rule of D4.

D2. Mechanism: none is added. The area config's `signalObservations` already sets the cycle and the green of one approach by street names and, with `heading`, by side of the street. The importer writes it to the node as `signalTiming` (`tools/lib/signal-obs.ts`), and `plan_with_observation` in `crates/sim/src/eff.rs` holds an observed green fixed and shares the rest of the cycle among the other phases by flow ratio [Webster1958], with a floor of 5 s of green per phase (an assumption of the allocator). An observed timing is not pinned the way a `signal_timing` intervention is, but its observed greens stay fixed when the splits adapt every five minutes. Nothing in the simulator changes, so the fingerprint stays d45a275dd7be0713cec6a64394b7d8a9, and the published proposals are untouched until a candidate is adopted. The existing Colby St entries and the new Forest St entries have the same periods and cycle, so the importer writes them as one timing.

D3. Candidates. Each sets the Forest St eastbound approach (link 2697, `heading` 123, the arrival bearing of 122.9 degrees) to one green in the AM and PM peaks, in the 79 s cycle of the volunteer count with Colby St at its observed 4 s. The Forest St legs share one phase, so the green applies to both legs. The source of each entry states ASSUMPTION. The fragments are `candidates/forest-25.json`, `forest-18.json` and `forest-12.json`, and `apply-candidate.py` inserts one into `data/areas/rockridge.json`.

| Candidate | Forest St | Colby St | Claremont Ave (rest of the cycle, after 3 x 5 s of clearance) |
| --- | --- | --- | --- |
| baseline, PM | 35.3 s | 4 s | 24.7 s |
| forest-25 | 25 s | 4 s | 35 s |
| forest-18 | 18 s | 4 s | 42 s |
| forest-12 | 12 s | 4 s | 48 s |

The values are a ladder from the simulator's own split toward the 10 s that the probe tested and above the 4 s that round 40 rejected. 25 s is about 30% less than the model's 35 s, 18 s about half, 12 s is near the probe. The signal model allows all three: each leaves Claremont Ave at least 5 s, and `plan_with_observation` returns an issue instead of stretching a plan that does not fit. No value below the 5 s floor is possible. The removed green goes to Claremont Ave because the other phase is Colby St, whose green is observed. The midday timing (147 s cycle, Colby St 10 s) is left as it is, because the count has no midday hour and no candidate was designed for it; midday still has to hold D16. No signal-timing rule beyond [Webster1958] (flow-ratio split, already in the model) is relied on. No entry of `docs/references.md` gives a Forest St or Claremont Ave green, so the values carry no citation and are labeled assumptions.

D4. Keep rule, written before any run of a candidate and the same as round 44's D3. Against the baseline assessment above, a candidate is adopted only if none of these is worse:

- recent PM fitted stations within GEH 5: at least 74 of 92
- PM held out: at least 14 of 24
- AM fitted: at least 70 of 77
- AM held out: at least 14 of 19
- the baseline-calibration decision D5 holds, with 4 of 4 headline shares within 10 points
- all 8 whole-street traversal counts within GEH 5
- the baseline-calibration decision D16 (stability) holds in every period
- the validation suite still passes 67 of 74 at the same fingerprint

One figure below its line fails the candidate. The rule is not loosened after a result. The table the round reports also shows the Howell-area stations and Forest St eastbound, but they are reports, not conditions.

D5. Screen. A candidate gets the ten-seed assessment only if a three-seed diagnostic (seeds 1 to 3, AM and PM, no verdict) is no more than 3 stations below the baseline's own three-seed diagnostic on each of the four station counts and shows no car cleared from gridlock in the judged zone. The screen only decides whether to spend the full run. It does not replace D4, and a candidate that passes the screen can still fail D4. The tolerance of 3 stations is an assumption about seed noise (round 44's laptop run found stations flipping both ways by 4 to 10 between near-identical builds); it is written here before any screen ran.

D6. Demand. The demand fit uses static membership and reads no signal timing, so a candidate's rebuilt demand should carry the same flows as the baseline's, with a new network hash in its provenance, and the fit stays a refit only in the sense that the build is rerun. The runbook checks that the flows are identical. If they are not, the candidate changed more than the signal and the round stops.

D7. If more than one candidate passes D4, the runbook reports all of them and the lead recommends the mildest (the longest Forest St green), since every value is an assumption and a smaller departure from the simulator's own split is the smaller claim. Which one to adopt, if any, is the project lead's decision. Adopting one changes the published network, so it also means a new demand build, a new proposal search and new results, and the area note and caveat would need rewriting (the caveat now calls the Forest St green an assumption).

D8. The heavy runs (demand builds, validation, screens, assessments) run on the user's laptop from `runbook.md`, as in round 44. This change was prepared in a cloud container: no candidate demand was built and no assessment was run there.

## Checked in the container

- The importer reproduces network 53c823f20d9165ed from the 2026-11-11 OSM extract in the main checkout, so that extract is the one behind the baseline.
- With forest-25 applied, the importer builds a network that differs from the baseline in one node (id 1069, the signal): its `signalTiming` gains the Forest St eastbound link 2697 at 25 s in the AM and PM entries, beside Colby St link 2592 at 4 s. Every link is identical, so no link id moves. Network hash 176cc2f5263d5faf. No new importer warning.
- The simulator fingerprint is d45a275dd7be0713cec6a64394b7d8a9, and the change touches nothing under `crates/`.
- Whether the simulator builds the plan without an issue for each candidate was reasoned from `plan_with_observation` (required time 15 + 4 + green + 5 s, at most 79 s for all three) and not run, because no demand file was built in the container.

## What is not known

- Whether the Forest St eastbound approach really gets a shorter green than the flow split gives it. A field reading of the green and of the Forest St approach queue would settle it.
- Whether a shorter Forest St green moves cars onto other routes through the grid, as the 4 s trial of round 40 did (Hillegass Ave and Colby St). The keep rule checks the four through shares (D5) and the eight whole-street counts for that.
- The adaptive split reads measured flows, and Forest St's green is now fixed. Whether Claremont Ave's larger share is used is not known until a run.

## Risks

- All three candidates may fail. Then the record says so and nothing published changes.
- A candidate may pass the station counts by moving cars to places no count covers. D5 and the whole-street rows are the check; the through-car figures are model output with no counted range.

## Outcome

The laptop run of 2026-11-18 (about 8:05 PM to 9:06 PM Pacific, M3 Pro, 12 jobs) reproduced the baseline hashes (network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, fingerprint d45a275dd7be0713cec6a64394b7d8a9 unchanged). Each candidate differed from the baseline in node 1069 only and its fitted demand periods equalled the baseline's (D6). All three passed the screen (D5) and went to ten seeds. The evidence is in this change's `evidence/` folder after archive.

| Candidate | PM fitted | PM held out | AM fitted | AM held out | D5 | Whole-street | D16 | Validation | D4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| forest-25 | 74 | 14 | 71 | 14 | 4 of 4 (mean error 4.9) | 8 of 8 | holds | 67 | passes |
| forest-18 | 75 | 14 | 71 | 13 | 4 of 4 (4.2) | 8 of 8 | holds | 67 | fails on AM held out |
| forest-12 | 77 | 14 | 69 | 13 | 3 of 4 (Hillegass Ave SB to freeway, 10.2 points off) | 8 of 8 | holds | 67 | fails on AM fitted, AM held out and D5 |

D9. User decision, 2026-11-18: forest-25 is not adopted, although it passes D4. It sits exactly on three lines (PM fitted, PM held out, AM held out) and changes no status. The one gain is an AM location, the Forest St timing is unobserved, and adopting it would need a new demand build, proposal search and republish for no change in status. The published network stays 53c823f20d9165ed. A field timing of the Forest St green would reopen the question. Under D7 forest-25 was the only candidate to choose among. The shorter greens move Forest St eastbound, Ayala Ave northbound and McAuley St eastbound toward their counts, and they make the AM held-out Colby St SB station and the Hillegass Ave SB share to the freeway worse.

The proposed spec delta (an assumed signal timing is labeled ASSUMPTION) was dropped before archive. Nothing shipped carries an assumed signal timing and no check enforces the label, so the requirement would not describe the shipped system. The candidate fragments keep their ASSUMPTION source and a test (`tools/signal-obs.test.ts`) checks them. The change archives without spec updates.

The record entry is in `data/calibration/rockridge.record.md`, and the area caveat gained one sentence. That text goes to `areas.json` only; it is not part of the network or demand hashes.

