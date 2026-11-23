## Finding

`perimeter-turn-bans` (Outcome section of its design) found that left turns carry the effect and that the leak in the large sets is one street. Ban sets plus a few filters are the untested idea. This is a new change and not a second phase of `perimeter-turn-bans`: that change is a measurement that stays open for the project lead's verdict (its tasks 3.2 and 3.3), while this one changes the search.

## Decisions

### D1: A ban set is one intervention that expands to turn bans

A set travels through the search as an `Intervention` of type `ban_set` whose `legs` hold the banned movements as `from, to` link pairs, sorted. It follows the Slow Street precedent (`explore/street.rs`): the simulator never sees it. `street::expand`, which every run and the access check already call, writes it out as one `turn_ban` per pair, and `link::encode_scenario` writes one `tb` item per pair, so the scenario link lists every ban and opens in the app as plain turn bans. No field is added to `Intervention` (`model.rs`), which is inside the simulator fingerprint; `legs` is the existing optional list of link ids, used by `modal_filter` on a node and left unused by this type.

A set is one `Cand` of kind `ban_set`. Depth, beam width, `Family`, the fewest-changes objective and the displacement rule count `set.len()` of candidate indices, so a set is one. `closes_nothing` includes it, so the no-closures objective may use it.

### D2: The sets, derived from the network

`bansets::analyze` lists the entry movements by the definition of `perimeter-turn-bans` (D1 there): a turn from a link that is not a residential or service link inside the study area onto one that is, from a bounding street (the in-study links that are not residential or service, with their continuation outside the area by name) or from outside, never a U-turn. Left and right are the app's classes (`turnKindOf`, cut-offs 25 and 155 degrees, reach 30 m), ported exactly so the counts equal the TypeScript generator's; the simulator's own cut-offs (30 and 149) differ on one movement. A movement banned in the base network in every searched period, or whose single ban does not survive a link round trip, is left out.

`bansets::generate` builds, in this order: `left-turns`, `right-turns`, `all-turns`, `all-turns-access`, `through-streets` (turns onto the interior streets that touch two bounding streets), then for each bounding street `from-<street>` and `from-<street>-left`, then for each interior street (a run of local links with one name that share intersections) `onto-<street>-<run>` and `onto-<street>-<run>-left`. A set holds left and right turns only; straight-across movements stay open. `all-turns-access` is `all-turns` less the turns onto the street next to the lowest-numbered node that `all-turns` would strand, repeated until no node is stranded, using the search's own reachability test. No street is named in code.

Each set then goes through three rules: fewer than two bans means it is a single ban, not a set, and is not generated (the ten heaviest single movements are already candidates); a set equal to an earlier one is dropped as "same bans as" it; a set that fails the access check in any searched period is dropped with the reason, like any other invalid candidate. Sets are appended after the generated candidates, so the single candidates keep their indices.

On the Rockridge network, over the three periods: 53 entry movements, 21 left and 22 right turns usable (none banned in the base network), 30 sets and 3 dropped.

| Set | Bans | Label |
| --- | ---: | --- |
| `left-turns` | 21 | No left turns from the bounding streets onto side streets |
| `right-turns` | 22 | No right turns from the bounding streets and streets outside the area onto side streets |
| `all-turns-access` | 41 | No turns from the bounding streets and streets outside the area onto side streets |
| `through-streets` | 19 | No turns from the bounding streets and streets outside the area onto the through side streets |
| `from-alcatraz-avenue`, `-left` | 6, 3 | No (left) turns from Alcatraz Avenue onto side streets |
| `from-claremont-avenue`, `-left` | 12, 6 | No (left) turns from Claremont Avenue onto side streets |
| `from-college-avenue`, `-left` | 4, 2 | No (left) turns from College Avenue onto side streets |
| `from-telegraph-avenue-left` | 10 | No left turns from Telegraph Avenue onto side streets |
| 19 interior-street sets | 2 to 6 | for example No turns onto Hillegass Avenue (4 turns), No left turns onto 62nd Street (3 turns) |

Dropped: `all-turns` (43 bans) and `from-telegraph-avenue` (20) and `onto-unnamed-road-15` (2) strand one node, an unnamed junction off Telegraph Avenue that only turns from Telegraph Avenue reach. `explore --list-ban-sets` prints the full list. `scripts/parity.cjs` compares the sets with the TypeScript packages movement by movement (left, right, all-turns-access, through-streets and the bounding-street sets are identical), and `tests/ban_sets.rs` holds the counts 53, 21, 22, 41, 19, 6, 12, 4 and the Telegraph drop.

### D3: Labels

A label is made from the movements alone (`bansets::label`): the kind of turn (left, right, or both), where they start (all the bounding streets, a street, or "N streets"; "and streets outside the area" when a movement comes from an outside street that is not on a bounding street) and where they end (one street, or "side streets"), then the count: "No left turns from the bounding streets onto side streets (21 turns)", "No turns from Claremont Avenue onto side streets (12 turns)". A set onto one street from several leaves out the start: "No turns onto Colby Street (5 turns)". The title of a package that holds a set leads with the set's label. `describe` in `naming.rs` uses the same function, so a set adopted from a seed that was not generated still reads the same way.

### D4: Counting and reporting individual bans

The proposals JSON stays as it was for a package without a set. For a package that holds one, each `interventions` entry of type `ban_set` gets `bans` (its size) and the proposal gets `turnBans` (individual bans in the package: singles and set members). Both fields are optional in `src/lib/proposals.ts`, and a file without them reads as before. The report's summary sentence says "The package holds 41 individual turn bans in all", and the finalists table appends the same count to the interventions cell. The card's changes list shows each set as "One change, N individual turn bans", and its heading or disclosure reads "Changes in this package (2, holding 22 turn bans)". The structure of the redesigned tab (headline visible, the rest in disclosures) is unchanged. `ProposalMap` maps the decoded interventions of a link to changes with `changeAt`, because a set decodes to one intervention per ban.

### D5: Seeds and `--check` read a set back

A link has no notion of a set. `bansets::collapse` folds the decoded turn bans of a link into the largest generated set they contain in full, repeated for what is left, so the hand packages `left-turns` and `all-turns-access` (links of 21 and 41 bans) enter the search as one intervention and fit a depth of 6. A link that holds the bans of a set reads as the set whether or not it was made from it, because the scenario is the same. Bans that are not part of a whole set stay single. It runs only with `--ban-sets`, for the seeds file (`seeds::prepare_with`) and for `--check`. Without the flag a 21-ban seed is dropped as before.

### D6: Behind a flag; the default is unchanged

`Params::ban_sets`, set by `--ban-sets`, is false by default. `cands::generate_search` is the one place the three call sites use (`search::make_cands`, `report::explore`, `check::check_links`); without the flag it returns what `generate_for` returned. What the flag changes is the candidate list and everything downstream of it. The evidence that the default is unchanged is a test that the candidate list is identical without the flag, and a reduced search (one period and seed, 4-minute runs, beam 2, depth 3, 10 locations) run with the binary built before the change and with the one built after: the proposals JSON is byte-identical, and the report differs only in elapsed seconds. The full published search takes 46 minutes on the laptop; it was not repeated.

A ban-set package also changes beam behavior. The repair moves add a candidate when one of its nodes is next to a block that a package pushed traffic onto, and a set touches many nodes, so sets are tried more often than singles (design D9).

### D7: Decision rule, written before any run

- Nothing is published from this change: not `public/data/rockridge.proposals.json`, the seeds file, the references file, the report, results, text pages or previews.
- The project lead decides whenever (a) the search's top option has a different set of interventions from published p1, (b) the top option's through-car change differs from the published -74.0% by more than 15 points, or (c) any checked package or option removes more through cars than p1 on the same seeds.
- The re-check of p1 must equal the published figure within one car an hour, or the inputs or the build are not the published ones, and that is reported before anything else.
- Thresholds are not changed after results are seen. A package that is rejected or fails the access check is reported with its reason and is no candidate.
- The hand combinations are checked even when the search also published them, so every figure comes from one method.

### D8: Limits

As `perimeter-turn-bans` D8: a ban applies to every vehicle in every period (no resident exemption, no time of day), full compliance is an ASSUMPTION, the model is not calibrated, and the intervals cover seed variability on a fixed network and demand only. The search selects on seeds 1 to 3 and confirms on 101 to 110, as the published one does. A package of a set and filters is a search result on a model that treats a ban as a closed movement; it says nothing about how many signs would be needed or obeyed.

### D9: Time

About 65 minutes on the laptop at 12 jobs for the search (range 55 to 90; the run took 36 minutes), against 46 for the published one, from 3,207 screening runs in the published search and the following changes. The candidate list grows by 30, so the singles screen is 13% longer. Sets enter the repair moves of the beam, which the reduced search shows: with the flag it simulated 145 screening runs against 98 without, at settings that are not the same (expand 4 and 4 finalists, one hand seed). The two hand seeds are rechecked in full (about 1 to 2 minutes each at three periods and three seeds) with their sub-package screens. The confirmation is as long as before. A check is about 2.5 minutes. A to E: about 2 hours.

## Risks

- A set is one candidate and a one-seed 20-minute screen sees its first-order effect on a single period. A large set can look better than its three-period recheck. The recheck and the confirmation seeds are the same as for any option.
- Sets enter more beams than singles do, which may crowd out singles at a fixed beam width. The comparison of the options against the published ones shows whether the published options survive (D7).
- A set that passes the access check in the model can still leave a street hard to enter in practice.
- The TypeScript and Rust turn classes are ported with the same cut-offs, but a network with a link whose geometry the two read differently could differ. `parity.cjs` runs in step A.

## Outcome (laptop run of 2026-11-22)

The laptop ran steps A to E between 1:03 and 2:00 AM Pacific on `d13b44e`, simulator `6b886c8f52ee07397773ddd0ebbcb447`, seeds 101 to 110, three periods. The search (`--ban-sets`, published settings) took 2,146 s, against the 65 minutes planned in D9. It loaded 22 known packages, rechecked 22 and dropped none. The evidence archive is on the dev branch at commit `2aa765f` (`evidence/README.md`). Nothing was pushed to the data bucket and nothing was published by the run.

Through cars an hour, mean of the three periods, baseline 522.5:

| Package | Interventions | Individual bans | Closures | Through cars an hour | Change vs today | Residents, seconds per request |
| --- | ---: | ---: | ---: | --- | --- | ---: |
| Published p1 (five modal filters and a diverter), re-checked | 6 | 0 | 6 | 135.7 | -74.0% | +16.0 |
| Search option 1: `all-turns-access`, traffic circle at 60th Street & Colby Street, one-way northbound on Colby Street (North Street to Alcatraz Avenue), one-way eastbound on Forest Street (Claremont Avenue / Colby Street to Ayala Avenue), Slow Streets on Colby Street and Hillegass Avenue | 6 | 41 | 0 | 80.4 | -84.6% (-462 to -422 cars an hour) | +27.4 |
| Search option 2: `all-turns-access` and a modal filter on Forest Street at Ayala Avenue | 2 | 41 | 1 | 142.4 | -72.7% | +25.4 |
| Search option 3: an earlier four-closure package, no bans | 6 | 0 | 4 | 266.8 | -48.9% | +3.4 |
| Search option 4: `left-turns` alone | 1 | 21 | 0 | 313.8 | -39.9% | +8.1 |
| Hand check: `left-turns` and the Forest Street filter | 2 | 21 | 1 | 306.3 | -41.4% | |
| Hand check: `left-turns` and two 63rd Street filters | 3 | 21 | 2 | 213.7 | -59.1% | |

The re-check of p1 equals the published figure, so the inputs and the build are the published ones (D7). Option 1 removes 462 to 422 through cars an hour. No block gains through cars. Its worst block for all traffic is 57th Street between Vicente Street and Telegraph Avenue, which rises from 71 to 166 cars an hour at midday. The hand check with two 63rd Street filters puts 30 more through cars an hour on North Street. The search returned four options, and none of the six published ones survived: p1 is dropped because option 1 removes more through cars, rises less on one block and has no more changes.

D7 triggers: (a) the top option differs from published p1, and (c) a checked package removes more through cars than p1 on the same seeds (option 1, by 10.6 points). (b) is not triggered: 10.6 points is under the 15 points of the rule.

The cost sits in the residents' column. A ban applies to every driver in the model, residents included, so option 1 adds 27.4 s per request for trips that start or end in the area, against 16.0 s for p1.

### Decision (project lead, 2026-11-22)

The project lead chose, from a question card: "Both families (Recommended): Rerun the search so the list keeps the best package without turn bans (today's six-filter option) next to the ban packages, then publish. About 40 min on the laptop plus a small search change. Bans cost residents ~25 s per trip in a model with no resident exemption, so a filter-only option stays useful."

The follow-on change is `publish-ban-set-proposals`: a "no turn restrictions" objective, the card and map for ban packages, and the laptop publish chain. The lead session publishes; this change publishes nothing. The label wording the laptop noticed is settled: the three sets say "streets outside the area", as `laptop/expected-sets.tsv` does.
