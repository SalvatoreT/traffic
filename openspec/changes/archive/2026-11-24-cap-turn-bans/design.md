## Decision (project lead, 2026-11-23)

41 turn-restriction signs are not reasonable. Turn restrictions may go on a few entrances only. The cap the project lead chose: a package holds at most 5 individual turn bans in total.

This is a presentation and feasibility constraint, not a result of the model. The simulator treats a ban as a closed movement and has no view on how many signs a street department would post, what enforcement would take, or how people would take 5 against 7. The number 5 is the project lead's judgment (ASSUMPTION) and is recorded as one in the file and the report. Nothing in the evidence picks 5 over 4 or 6; the packages measured on 2026-11-22 show only what a cap leaves out: 3 bans remove 12.4% of through cars an hour, 5 remove 16.0% (`top-3`, `top-5` in `data/proposals/README.md`), against 63.1% for 41.

## Context

The list published on 2026-11-22 led with a ban set of 41 bans plus five other changes (522.5 to 80.4), next to the six-change filter package (135.7, tag `most-removed-no-turn-bans`), a five-closure package (173.6, `no-turn-bans`) and a least-detour package (266.8). The 41-ban options are being removed from the live list by the lead session. A rerun of the same search would find them again, because the ban-set candidates include sets of 41, 21 and 22 bans, and the seeds file holds three packages with 41 bans.

## Decisions

### D1: What the cap counts

The cap counts individual turn bans in a package. A ban set counts its size, a single turn ban counts 1, and every other change counts 0. A package of a 3-ban set, one single ban and a filter holds 4. Two sets that share a ban conflict already (`cands::conflicts`), so a ban is never counted twice.

It does not limit the number of interventions: `--depth` still does that. A set of 5 bans is one intervention for depth and 5 for the cap.

### D2: Where the cap is enforced

`Params::max_turn_bans` is `None` by default, and every place that reads it falls back to the old code path when it is `None`.

1. Candidates. `bansets::generate_capped` drops a set with more bans than the cap, with the reason `over the turn-ban cap: 21 individual turn bans, more than the cap of 5`, before the access check. `explore --list-ban-sets` prints it in its dropped list. Single turn bans are still candidates, each counting 1.
2. Search. `eval_batch`, through which every package the beam, the supplements and the checks evaluate passes, rejects a package over the cap before the screening table or the access check is asked. It never reaches the simulator and costs no evaluation, and it is cached as an invalid package, so a beam that proposes it again pays nothing. Rejected packages are never finalists, so none is kept or published.
3. Known packages, hand seeds and warm starts. `adopt_packages` checks the cap before the depth, so a 41-ban package is reported as over the cap, not as over the depth. It is skipped without a recheck. The skip is logged (`known package k: not used, over the turn-ban cap: ...`), listed in the report's Known packages section and counted in `computed.knownPackages.droppedBy` and in `computed.turnBanCap.knownPackagesSkipped`.
4. Reference packages (hand-written, located by street names) are not capped; the area's reference file holds none with turn bans.
5. `explore --check` reads the cap too, so a package scored by hand follows the same collapse rule. It does not refuse a package over the cap, because it is an inspection tool.

### D3: Why the cap changes nothing without the flag

`max_turn_bans` is read in `generate_search` (through `generate_capped`), `eval_batch`, `adopt_packages`, `explore --check`, the binary's seed collapse and the report writers, and each reads it as an `Option`. With `None`: `generate_capped(.., None)` is `generate`; `over_cap_reason(_, None)` is `None`, so `eval_batch` and `adopt_packages` take the old branch; the top-k sets are built only inside `if let Some(cap)`; `computed.turnBanCap` and the report paragraph are written only when the cap is set, so a file written without the flag has the same keys as before. Tests: `crates/sim/tests/ban_sets.rs` (a cap drops sets and `None` equals `generate`; top sets only with a cap; a package over the cap is not simulated and not adopted; the file and report carry the cap only when it is given), and the earlier ban-set and search tests run unchanged. The simulator fingerprint is unchanged, since the change lives under `explore/`, `bin/`, tests, tools, docs and openspec.

### D4: The candidate pool under the cap

Candidates are the interventions of the earlier search, with the ban sets reduced to those with at most 5 bans, and with top-k sets added.

- Single turn bans: the heaviest arterial-to-local movements by baseline cut-through, up to 10 (`n_loc / 4`, at least 4), each counting 1.
- Sets from the generator that fit (21 on the Rockridge network, from the list of 2026-11-22): `from-college-avenue` (4), `from-college-avenue-left` (2), `from-alcatraz-avenue-left` (3), the turns onto one side street (`onto-<street>`, 2 to 5 bans: 60th, Colby, Hillegass and the 2-ban pairs onto 57th, 58th, 59th, 61st, 63rd, Dana, Forest, Martin, McAuley and North), and the left turns onto 60th, 62nd, Colby and Hillegass. The sets of 6 or more (`left-turns` 21, `all-turns-access` 41, `through-streets` 19, `from-claremont-avenue` 12, `from-alcatraz-avenue` 6, `onto-62nd-street` 6 and the others) are dropped with the reason.
- Top-k sets: `top-2` to `top-5`, each the k highest-ranked of the single turn-ban candidates above. The ranking is the candidate order, which is the order of the `explore --check-singles` log (both come from the baseline cut-through trips on each movement), so nothing new is ranked. A top set that equals another set is not added twice, and one that fails the access check is dropped with the reason. They exist only with the cap: without it the pool is the old one.

Why top-k and not only the sets already there: the generator's sets follow the street structure (a street's turns, a bounding street's turns). The measured value of a few signs is in the heaviest movements wherever they are (`top-3` and `top-5` beat College Avenue's four turns, 12.4% and 16.0% against 2.5%). A set counts as one intervention for depth, so top-5 leaves 5 slots of a depth of 6 for filters. The set count stays modest: 21 plus at most 4.

What this pool does not have: a top few for each bounding street. The Rust side would rank 1 to 3 movements per street, from the 10 singles. `tools/turn-ban-sets.ts --max-bans N` does it for measurement (D6).

### D5: Tags and the list

The tag rule is unchanged (`Objective::is_no_ban`). The no-ban tags, `no-turn-bans` and `most-removed-no-turn-bans`, are listed when some option in the finished list holds a turn ban, and dropped when none does. With the cap the list may hold ban options of up to 5 bans, or none. In both cases `verify.cjs` checks each objective tag that appears is on exactly one option; with ban options it requires one option each for the two no-ban tags, and with none it requires neither.

### D6: Small sets for measurement

`tools/turn-ban-sets.ts --max-bans N [--ranked LOG]` keeps only packages of at most N bans and makes `top-2` to `top-N` from the ranking in the log, plus `street-<name>-top-3`, the three highest-ranked movements that start on each bounding street. The ranking comes from the `explore --check-singles` log as documented; the script does not rank anything itself. The log is laptop evidence and is not in the repository, so the change is tested on a fixture (`tools/turn-ban-sets.test.ts`) and the runbook does not need it: the search builds its own top sets.

Under the cap this script, run on the Rockridge network, would write the packages of `data/proposals/README.md` that fit (`top-3`, `top-5`, `street-college-avenue`), plus the new `top-2`, `top-4` and the per-street top-3 sets.

### D7: Wording of the card

The scale line said "N turn restrictions around the edge of the area", which suits a perimeter of 41. For 3 signs it reads as if they ring the area. It now says "N turn restrictions at entrances to the area", and the line is true for any count, because the search's turn bans are entry movements onto a side street (`bansets::Movement`; a single turn ban comes from an arterial onto a local street). The standing caveat is unchanged: a ban applies to every driver, residents included, all day, with full compliance assumed. `changesSummary` ("2, holding 22 turn bans") already reads right for 2 to 5, because a ban set has at least 2 bans.

### D8: Laptop gates

The hashes checked before the run are the network (`53c823f20d9165ed`), the demand (`2d16d8f8eb0950ca`), the simulator fingerprint (`6b886c8f52ee07397773ddd0ebbcb447`) and the seeds file (`1e837cb5ccb4346d`, in `laptop/env.zsh` as `EXP_SEEDS`; the lead session confirms it). The proposals file is not a gate: the lead republishes a trimmed one before the run, and the search replaces it. The search command is the published one plus `--ban-sets --max-turn-bans 5`.

### D9: Limits

As `turn-ban-set-candidates` D8: a ban applies to every vehicle in every period, no resident exemption, full compliance is an ASSUMPTION, the model is not calibrated, and the intervals cover seed variability only. The cap is an ASSUMPTION of the project lead. A package under the cap is a search result on a model that treats a ban as a closed movement.

## Risks

- With at most 5 bans the ban packages are weak (16% at best on the measured sets, against 63% to 85% with 41). The list may hold none; then the no-ban tags are dropped by the existing rule and the list is the filter packages. If one is listed, the first lines of the card say how few signs it has.
- A known package of 3 to 5 bans is collapsed into a set only when the set is a candidate. With the cap, `prepare_with` knows the generator's small sets and not the top-k sets, which depend on the baseline; a known package equal to a top set is adopted as single bans, which is the same scenario. A depth of 6 still fits 5 single bans and one filter.
- The seeds file holds 41-ban and 21-ban packages that the cap skips each run. They stay in the file, as history, and each costs one log line.
- The new top sets are untested on the real network in the container (the network files are git-ignored data); the unit tests use a synthetic one. The laptop's step A lists the generator's capped sets against `laptop/expected-sets.tsv`, and the search log shows the `top-k` candidates.

## Label of the score winner (lead, 2026-11-23)

The capped run put the `most-removed` tag on the option that removes fewer through cars than the top one, because the tag follows the search's score (through cars removed less a penalty for the largest all-car rise on one block). The earlier 41-ban option won on both, which hid this. The tag's label is now "best balance of cut-through removed and traffic added to one block", in the app, the text pages and the search's own label. The id `most-removed` and the rule are unchanged, so published files stay readable.
