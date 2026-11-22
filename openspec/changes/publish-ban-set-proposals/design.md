## Decision (project lead, 2026-11-22)

From a question card, the option chosen, verbatim: "Both families (Recommended): Rerun the search so the list keeps the best package without turn bans (today's six-filter option) next to the ban packages, then publish. About 40 min on the laptop plus a small search change. Bans cost residents ~25 s per trip in a model with no resident exemption, so a filter-only option stays useful."

This authorizes publishing the resulting list, a changed top proposal, once the run is done and verified. The lead session does the `data:push`; the container and the laptop do not.

## Context

`turn-ban-set-candidates` (Outcome in its design) found, through cars an hour, mean of three periods, baseline 522.5, seeds 101 to 110: published p1 135.7 (-74.0%, residents +16.0 s per request); a ban-set package with five other changes and no closure 80.4 (-84.6%, +27.4 s); `all-turns-access` and one filter 142.4 (-72.7%, +25.4 s); an earlier four-closure package 266.8 (-48.9%, +3.4 s); left turns alone 313.8 (-39.9%, +8.1 s). The search's list had four options and none of the published six. The list dropped p1 because a ban package removed more, rose less on one block and had no more changes: that is the domination rule working as designed, and it hides the family without bans.

## Decisions

### D1: A fifth objective, chosen inside its own family

`Objective::NoTurnBans` (id `no-turn-bans`, label "no turn restrictions") picks the best package that holds no turn ban at all (`Final::has_bans` is false: no `ban_set` and no `turn_ban` candidate). It is the same score as the main objective, inside a pool that holds only packages without bans, so the filters of the choice (established reduction, the stability rule, domination, simpler packages, near-duplicate folding) apply within that family. A package with bans cannot dominate, fold or displace the winner. Goal winners are never dropped by the displacement rule, and the confirmation stage keeps them as it keeps every goal winner. It is in `--objectives all`, the default.

It has its own beam: candidates that are turn bans or ban sets are not allowed (`objectives::allowed`), and the beam shares the screening cache, so it costs a few minutes and not a second search. The old p1 also comes in through the seeds file, which is rechecked in full; the beam means the list does not depend on that seed being there.

The tag appears on the option's card as "Best for: no turn restrictions". When the best package overall has no bans, it is the same option and carries both tags, and no duplicate appears. When no option in the finished list holds a ban, the tag is left off: it would say nothing on a list without a contrast. A package that wins only this objective and then loses the tag, in that case, is listed as "next best by through cars removed".

The benchmark's recorded cases keep their four objectives (`objectives::BENCHMARK`), so `search_bench` replays stay comparable.

### D2: What was checked about the selection

A unit test in miniature of the run of 2026-11-22 (a ban package that dominates the six-filter package on every axis): the filter package is listed with the `no-turn-bans` tag, the left-turns package stays, a larger filter package does not displace it, and the coincidence case lists one option with two tags. On the real network, a reduced search (one period, one seed, 10-minute runs, 5-minute screens, beam 2, depth 6, 10 locations, `--ban-sets`, a scratch seeds file holding only the published p1): the list had three options, two with the 41-ban set and the third, tagged `no-turn-bans`, equal to published p1's six interventions, with fewer changes and more through cars removed in each of the other two. What this does not show is the figure 135.7 on ten seeds and the full finalist pool; the laptop run does, and `scripts/verify.cjs` checks both (the interventions equal the old p1's, and its through cars an hour reproduce 135.7 within one car).

### D3: The published command includes `--ban-sets`, still explicit

The published search command is the round 52 command plus `--ban-sets`. The flag stays explicit and off by default, so a proposals file written before it reproduces from its recorded settings and `explore` without the flag makes the candidate list of those files. The README's published command and the runbook say so.

### D4: The card makes the scale obvious

A package with turn bans shows, in the visible part of its card and not behind a disclosure, "N turn restrictions around the edge of the area" (N from `turnBans`, or the count of single bans) and the standing caveat, "Turn bans apply to every driver, residents included, all day, and assume full compliance (ASSUMPTION)." The disclosure "Every turn restriction, by the street it starts on" lists all of them, grouped by the street each starts on, in the app's words ("Left turn onto Colby Street"), so a reader can find the one in front of their house. Every card, with or without bans, shows the resident detour beside the headline ("Resident detour: +27.4 s per requested resident trip"); the Context disclosure keeps the explanation and the interval. The sticky head carries the detour line and not the caveat, to stay short on a phone; the caveat sits right under it, in the first screen of the card.

### D5: One mark for each intersection

41 bans start at about 14 intersections, and a mark for each ban would stack up to six signs on one spot. From six turn bans in a package the picture draws one mark for each intersection where bans start: the left-turn sign when every ban there is a left turn, the right-turn sign for right turns, and a new sign, left and right arrows in a red slashed circle, when both occur (`turn_ban_both` in `signs.ts` and the legend). The mark answers for the first ban at the place, so hovering it names the ban set. Below six bans each ban keeps its own sign, as before. At card size the marks do not hide the street lines; checked at 1300 px and 375 px.

### D6: One scenario entry for many bans

The Map tab's scenario panel folds six or more turn bans into one entry, "41 turn bans", with one "Remove all 41" button, and an expander that lists them by street (each selects its place). The count in the panel's heading stays the number of interventions, so it does not understate. Fewer than six bans are listed one by one, as before. The link for the 41 bans and five other changes is 964 characters, under the length browsers and chat apps handle; links written before this change decode as they did, since the format did not change.

### D7: Text pages and previews

`proposals.md` gives each option a resident-detour line, the turn-restriction line with the caveat, and for a ban set "(ban_set, 41 individual turn bans)". The preview card's second line says "N turn bans" next to the change count, and its alt text carries the caveat.

### D8: Limits

As `turn-ban-set-candidates` D8: a ban applies to every vehicle in every period, no resident exemption, full compliance is an ASSUMPTION, the model is not calibrated, and the intervals cover seed variability only. A ban package is a search result on a model that treats a ban as a closed movement; it says nothing about signs, enforcement or what residents would do.

## Risks

- The new beam may find a better package without bans than published p1; if so the list shows it, and the verify script reports that the option is not the old p1 (a failed check, to be read, not hidden).
- The first screen of a ban card is now taller; on a phone the caveat and scale line come before the map.
- The redistribution step for a package with 41 bans is untested on the laptop; its time is the main unknown (runbook).
