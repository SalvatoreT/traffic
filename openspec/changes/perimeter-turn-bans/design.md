## Finding

The project lead asked on 2026-11-22: "Have you searched for the best proposals? I'd expect restricting turns into streets from outside the Trapezoid to be helpful."

The published search has not tried it. Its turn-ban candidates are single movements, the ten heaviest cut-through movements from a primary, secondary or tertiary street onto a local street (`crates/sim/src/explore/cands.rs`, "Turn bans"). A search package holds at most `--depth` interventions, 6 in the published run, and a seed with more is dropped with that reason (`explore/report.rs`, `adopt_packages`; proposals spec, "Packages are no larger than the search depth"). A set that bans every entry turn around the area has 20 to 53 bans, so the search cannot build it, cannot recheck it as a seed, and cannot combine it with filters.

The two earlier hand packages, on an older demand (baseline 508.4), banned the four turns onto Hillegass Avenue (-5.7%) and the eight turns onto Hillegass Avenue and Colby Street (-12.6%). Through traffic moved to the next street in both. The lead's hypothesis is that a ban on every entry turn at once leaves no next street. This change prepares the measurement. It does not run it.

## Decisions

### D1: What counts as an entry movement

An entry movement is a turn at a node, from link `a` to link `b`, where

- `b` is a residential or service link inside the study area (the search's `is_local`, `explore/mod.rs`);
- `a` is not such a link, and either lies inside the study area (then it is a bounding street link: the search's `is_boundary`, an in-study link that is not residential or service) or lies outside it;
- `b` does not lead back to the node `a` came from (a U-turn is not an entry).

The bounding streets are read from the network: the names of the in-study links that are not residential or service. An outside link counts as "on a bounding street" when it carries one of those names, so a street's continuation beyond the area edge belongs to it. An outside link with another name is "outside". The Rockridge result is Alcatraz Avenue, Claremont Avenue, College Avenue and Telegraph Avenue, which are the named streets of the area config's `boundary`; the config's freeway entry has no surface links. Nothing names a place in code. A sanity test checks the derived names against the config's.

This differs from the search's candidate generator in two ways. The generator takes only movements from primary, secondary or tertiary links and ranks them by baseline cut-through; the experiment takes every movement of the definition above, whatever its class, and does not drop the ones with no baseline use. The generator also leaves out movements already banned in the OSM data; the experiment lists those as `baseBan` and leaves them out of the packages.

Each movement is classified by:

| Field | Values | Source |
| --- | --- | --- |
| Bounding street | name, or none for an outside street | link names |
| Kind | `bounding` or `outside` | in-study non-local link, or an outside link with a bounding street's name |
| Side | north, east, south, west | the node's direction from the centroid of the study-area outline, by the larger axis |
| Turn | left, right, straight | `turnKindOf` in `src/lib/turnkind.ts`, the function the app draws its turn-ban symbols with |
| Interior street | name, and the run it belongs to | link names and shared intersections |
| Base ban | none, all periods, some periods | `turnBans` of the network file |
| Encodes | the link item decodes to this movement | the repo's encoder and decoder |

The simulator classifies turns with cut-offs of 30 and 149 degrees (`topo.rs`) and the app with 25 and 155 (`turnkind.ts`). On the Rockridge network the two agree on 52 of the 53 movements by their cut-offs. The 53rd turns by about 149 degrees from Claremont Avenue onto Colby Street; the app calls it a right turn, and the simulator's rule for sharp turns between differently named streets keeps it from being a U-turn as well.

Interior streets are runs: local links with the same name that share intersections. A run is a through street when its intersections touch two different bounding streets. Unnamed links form runs of their own and are never through streets.

### D2: The packages

Bans apply to every vehicle in every period (the scenario link carries no resident exemption or time of day). Straight-across movements stay open in every package except `all-entries` and `through-streets-all`, because they are the movements residents use to get in.

| Package | Bans |
| --- | --- |
| `all-entries` | every entry movement, turns and straight-across. Expected to fail the access check; it is measured so that the result is on record. |
| `all-turns` | every entry left and right turn |
| `all-turns-access` | `all-turns` without the turns onto any interior street that would leave a node with no way in. The tool predicts that with its own reachability test, which follows the search's access check and reproduces it on Rockridge in all three periods. |
| `left-turns`, `right-turns` | the left and the right turns of `all-turns` |
| `street-<name>` | every entry turn from one bounding street (its in-study links and its outside continuation) |
| `through-streets` | every entry turn onto the through streets; dead-end and short streets stay open |
| `through-streets-all` | every entry movement, straight-across included, onto the same through streets |
| `top-3`, `top-5`, `top-10` | the entry movements with the most baseline cut-through, only when the ranking is available |

The ranking for `top-k` comes from the search's own candidate list, which orders turn-ban candidates by the baseline cut-through trips that use them. It needs no new Rust: `explore --check-singles` prints every candidate with its scenario link in that order, and the generator reads the turn-ban rows (`--ranked FILE`). `a.zsh` runs it on the settings that build the published candidate list (all three periods, seed 1, 60 minutes) and requires the same first 223 candidates as `data/proposals/rockridge.md`. Without the file the generator writes no `top-k` package and says so. The list holds at most 10 turn-ban candidates (`n_loc / 4`, with 40 candidate locations), so `top-10` is the largest.

A package leaves out a movement that is banned in the base network in every period, and one whose link item does not decode to itself. The tool reports both.

### D3: Link format

A ban is the item `tb,<geohash>,<arriving bearing>,<leaving bearing>` (`docs/scenario-links.md`). The generator does not write it: it builds `{ type: 'turn_ban', fromLink, toLink }` and calls `encodeScenario` from `src/lib/hash.ts` on the network as `loadAreaFiles` returns it, the same one the app and `npm run simulate` use. It then decodes with `decodeScenario` and requires the same set of bans, no unplaced item and no more than 200 items, the limit of a link. Where two links leave one intersection at nearly the same bearing, a bearing could match the wrong one; such a movement fails the round trip and stays out of every package. On Rockridge none does. The Rust side decodes the same strings (`explore/decode.rs`, tested against `links.json`); the summary flags a package for which `--check` lists or rechecks fewer bans than the package has.

### D3a: What the access check already says

The access check is a graph test (every in-study node keeps a way in from a gate and a way out to one), so it does not depend on run length or seeds, and a reduced smoke of the command line shows it exactly. On the network of this study, in all three periods: `all-entries` strands 37 nodes; `all-turns` strands one node, an unnamed junction off Telegraph Avenue that only turns from Telegraph Avenue reach; `street-telegraph-avenue` strands the same node; the other packages strand none. The two turns onto that unnamed street are the whole difference between the lead's perimeter package and one the search would accept. The generator therefore writes `all-turns-access`, `all-turns` without the turns onto any street next to a stranded node (two bans here), using its own reachability test (`strandedNodes`), which follows `stranded_nodes` and the movement rule of `eff.rs` and gives the same counts as the Rust check on this network (a unit test holds them). `b.zsh` runs the real check on it.

### D4: Measuring with `explore --check`

`explore --check LINK` runs the search's own code on one scenario link and prints; it writes no proposals, report or seeds file and returns before the seeds file is read (`bin/explore.rs`). What it runs, from `explore/check.rs` and `explore/report.rs`:

- The profile test and the candidate-list test per intervention (informational: a ban that is not among the candidates says "NOT in the candidate list").
- The access check, in every searched period. A failure is printed (`access check: fails, ...`) and the recheck still runs, so a package that fails access still gets its figures. The search itself would drop such a package.
- `recheck`: the scenario and the baseline over every period and every seed in `--seeds`, at `--minutes`. It is the function the confirmation uses, with `--seeds` where the confirmation uses `--confirm-seeds`. It applies the rejection rules (unroutable trips above baseline, gridlock removals and entry backlog beyond the 20% plus 10 vehicles and 5% limits) and prints `REJECTED, <period>: <reason>`.
- It prints: through cars an hour, mean of periods, baseline to scenario and percent; the search penalty and its block (all traffic, after the noise band); the block with the largest through-car increase with its figure and the paired interval; the paired 95% interval of the overall through-car change in cars an hour (Student t on per-seed differences, periods averaged within each seed first [NIST-Handbook]); per period, through cars baseline to scenario and percent, and the all-traffic block with the largest increase with its baseline and scenario flow; elapsed time of residents' trips.

The published settings, from `calibration-round-52/evidence/search/command.txt`, with the confirmation seeds passed as `--seeds`:

```
explore --area rockridge --periods pm_peak,am_peak,midday --seeds 101-110 --no-confirm --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs 12 --no-known --check '<link>'
```

`--no-confirm` is needed because `--confirm-seeds` defaults to 101-110 and may not overlap `--seeds`. `--beam`, `--depth`, `--expand`, `--finalists` and `--options` do not affect a check and are passed so the line is the published one. `--no-known` is redundant for a check and makes the point that no seeds file is touched.

What `--check` cannot report, and what the summary does instead:

| Needed | Status |
| --- | --- |
| Through cars an hour by period | printed as whole cars and percent |
| Paired 95% interval against baseline | printed for the mean of the periods only, in cars an hour; the percent bounds are computed by the summary |
| Per-period interval | not printed (the data are in the code, `PeriodRes.effect`, not in the output) |
| Worst block, through cars, with interval | printed, mean of periods |
| Worst block, all traffic | printed per period, not as one figure; the summary takes the largest rise of the three. Its split into through cars and local trips (`block_through_inc`) is not printed |
| Rejection and access reasons | printed |
| Paired interval of a package against p1 | not available: no per-seed values are printed. The summary shows the two changes side by side without an interval |
| Machine-readable output | none; the summary parses the text lines |

Adding any of this means editing Rust in `explore/check.rs`. That is not done here.

### D5: Searching with the packages as seeds

The search combines interventions up to its depth, and a seed is a package the search rechecks in full and extends with one intervention at a time (proposals spec, "Seeds start a beam"). Three facts shape step C.

1. A seed with more interventions than `--depth` is dropped with a reason (`explore/report.rs`, `adopt_packages`). With the published depth of 6, the packages of up to 6 bans are seeded (`street-alcatraz-avenue`, `street-college-avenue`, `top-3`, `top-5`, and any ranked smaller set) and the large ones are measured only in step B.
2. `explore --add-seed` ends by cutting the seeds file to its `cap` (20), and the published file holds exactly 20 seeds, so adding to a copy as it is would drop published seeds. `c.zsh` raises `cap` in the scratch copy first.
3. Raising `--depth` seeds the large packages and lets the beam grow them with filters, but it also gives the beam more levels and spreads the harm-weight ramp over more steps (`explore/search.rs`). It is therefore a second experiment. `c.zsh` takes `DEPTH`; with the default 6 the command is the published one apart from the paths (the script diffs it against the round 52 `command.txt` and stops on any other difference), and with another value only `--depth` differs and the outputs get a `-depthN` suffix.

Only packages that were not rejected and passed the access check are seeded, because the search would drop the others. They enter as hand seeds, so the scratch file never loses them. Output goes to `target/turn-bans/proposals.json`, `report.md` and `seeds.json`. Nothing writes `public/data/rockridge.proposals.json`, `data/proposals/rockridge.md` or `data/proposals/rockridge.seeds.json`, and each script checks their hashes at the end.

Whether the packages beat p1 once filters can join them is what the search answers. The check answers whether a package alone does.

### D6: No new Rust

The fingerprint (`6b886c8f52ee07397773ddd0ebbcb447`) covers the simulator. The explore module is outside it, but this change does not touch it. If the check shows that a large ban set is worth searching, the next step is a candidate type for "every entry turn onto street X" that counts as one intervention, in `explore/cands.rs`. That is a separate change and the project lead's call.

### D7: Decision rule, written before any run

- Results are reported to the project lead as a table: each package against baseline with its interval, against p1 on the same seeds, with the worst blocks and any rejection.
- The figures of p1 re-checked here are the like-for-like reference. The published p1 is 522.5 to 135.7 (-74.0%, interval -407.65 to -365.95 cars an hour). A re-check that differs by more than one car an hour is reported before anything else, because it means the inputs or the build are not the published ones.
- Nothing is published from this change. That covers `public/data/rockridge.proposals.json`, the seeds file, the references file, the report, results, text pages and previews.
- The project lead decides whenever (a) the search's top option has a different set of interventions from published p1, or (b) a headline figure changes by more than 15%: a package alone that removes more than 15% of through cars, or a top option whose through-car change differs from the published -74.0% by more than 15 percentage points.
- Thresholds are not changed after results are seen. A package that fails the access check or is rejected is reported with that reason and its recheck figures and is not a candidate for publication.
- The earlier hand packages (-5.7% and -12.6% on an older demand) were not re-measured on the round 52 demand; the experiment's `street-alcatraz-avenue` and `through-streets` packages include their movements, and the summary reports the new figures as such.

### D8: Limits

- No resident exemption. The model has no per-vehicle exemption, so a ban stops residents' cars, delivery vehicles and everyone else, and a package that strands a street's residents fails the access check. Real schemes use signs with exemptions or camera enforcement that the model does not represent.
- All-day. A ban applies in every period (and in the periods the experiment does not simulate). Time-of-day restrictions are not expressed.
- Compliance is assumed to be 100% (ASSUMPTION). No source gives a compliance rate for entry-turn restrictions, and the model applies a ban as a closed movement.
- Fixed demand: the same trips are made before and after and they reroute. Nothing disappears or shifts to other modes or times, so a ban that would make some people stop driving here shows as longer trips. The London monitoring study [Thomas2024] is context only: it counts all traffic at monitoring sites, and this model counts distinct through cars.
- The model is not calibrated (`public/data/areas.json`). Read results as comparisons with the baseline.
- The intervals cover seed variability on a fixed network, demand and model. They do not cover calibration error, demand error or day-to-day variation, and ten seeds is the starting point the reporting method gives, not a proof of precision [WebTAG-M3.1].

### D9: Time

Laptop, 12 jobs; one simulated PM hour is about 20.5 s native, and the last published search took 2,736 s.

| Step | Estimate |
| --- | --- |
| A: worktree, release build, tests, single-candidate ranking (231 candidates times 3 periods at 20 minutes, about 7 minutes), packages | 15 minutes |
| B: each `--check` simulates the baseline (30 hours plus 10 screening runs) and the package (30 hours) again, about 2.5 minutes; 14 packages (13 without a ranking) and p1 | about 40 minutes |
| C at depth 6: the published search (46 minutes) plus one full recheck of about a minute for each seed and the screens of its sub-packages | about 60 minutes |
| C at a larger depth | not measured; plan on two to three times C at depth 6 |
| D, E | 2 minutes |

About 2 hours for A to E at depth 6. Checking all links in one invocation would save the repeated baseline (about 18 minutes), at the price of one log for all packages; the scripts keep one log each.

## Risks

- A package that passes the access check in the model can still fail in the street: the check asks only that every in-study node has a path in and out.
- The Rust and TypeScript turn classifications and decoders could differ on a network other than Rockridge. The round trip test is in TypeScript; the summary checks the Rust side by counting the bans `--check` lists.
- A package is measured with ten seeds on the same seeds as the published confirmation. The packages were not chosen on those seeds, so they are not selection-biased, but the search in step C selects on seeds 1 to 3 and confirms on 101 to 110 as the published one does.
