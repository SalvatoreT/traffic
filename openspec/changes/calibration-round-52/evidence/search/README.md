# Round 52 staged proposal search

On 2026-11-19 the lead asked for the proposal search to run on the round 52 candidate, staged only, the same way as the round 51 run. Nothing in this folder is published. Nobody ran `data:redistribution`, `data:results`, `data:llms`, `data:previews` or `data:push`, and nothing was written to `public/data/rockridge.proposals.json` or `data/proposals/`.

## Inputs

- Candidate config `2405ff02c92b2837`. Network `53c823f20d9165ed`, demand `2d16d8f8eb0950ca`, cross-validation demand `1c3b1666f24156f1`, membership `3d639670c1feb38f` (shipped) and `c1cd4ce96fb28791` (training).
- Simulator fingerprint `d45a275dd7be0713cec6a64394b7d8a9`. Nothing under `crates/` changed since round 51, so the explore binary is the one round 51 used.
- The stations file was identical to the baseline's.
- `--out` started as a copy of the search-c5 output, which is the published set (`3822705a26ca879d`). `--known` started as a copy of `data/proposals/rockridge.seeds.json` (`fbcf6d37a7e8cad3`). The round 51 staged set was never published, so its packages were not in the seeds file.
- The flags match search-c5's (`command.txt`).

## Run

Explore ran from 11:49 PM on 2026-11-19 to 1:22 AM PST on 2026-11-20 and took 5606 s (round 51: 4903 s; search-c5: 5384 s). It exited 0. The restore then rebuilt the baseline (network `53c823f20d9165ed`, demand `9cdebdabf05c4460`, cross-validation demand `2f9ae152b9bbf78e`, config `505dd0f032fc7ae8`) and left a clean status. The worktree's `public/data/rockridge.proposals.json` was `388c91f025dafd55` before and after, and `data/proposals/rockridge.seeds.json` stayed `fbcf6d37a7e8cad3`.

## Files

- `proposals.json` and `report.md` are the explore output for the candidate: one group, `unconstrained`.
- `seeds.after.json` is the seeds file explore rewrote. It is the staged copy, not `data/proposals/rockridge.seeds.json`.
- `compare.md` is written by `compare.cjs`. It covers all three sets (round 52, the round 51 staged set and search-c5):
  - each option's changes, with per-period effects, confirmation-seed intervals and per-seed ranges
  - the largest all-car rise per period
  - the winner of each goal, and where each option ended up in the other sets
  - the finalist row of every option the other set did not publish
  - the ranking score behind the most-removed goal
- `command.txt`, `run.zsh`, `chain.log.txt` and `search.log.txt` record how the run was made.

## Findings

All figures are means over confirmation seeds 101 to 110 unless a line says otherwise.

**Baseline through cars per hour.**

| Period | Round 52 | Round 51 | search-c5 |
| --- | --- | --- | --- |
| PM peak | 793.7 | 806.9 | 709.2 |
| AM peak | 387.0 | 414.0 | 429.1 |
| Midday | 386.8 | 386.8 | 386.8 |
| Mean | 522.5 | 535.9 | 508.4 |

The candidate's midday demand is byte-identical to the baseline's, so options with the same changes have the same midday figures in all three sets. Offered gate-to-gate (through) demand is 4996 cars an hour in the PM peak (baseline 5908, round 51 5021) and 3517 in the AM peak (baseline 3745, round 51 3506). The simulated PM through count is still above search-c5's.

The PM baseline varies more between seeds than before: 706 to 924 cars an hour, sd 63.2 (round 51: sd 37.5; search-c5: sd 35.3). PM intervals in this set are wider for that reason.

**Displacement.** The displacement rule dropped no option in any of the three sets. Option p1 still has the largest all-car rise on one block: +194.3 cars an hour on 60th Street between Claremont / Hillegass and Colby in the PM peak (round 51: +200.7; search-c5: +207.5).

**Options.** Each line gives the overall change in through cars an hour with its 95% interval.

| Option | Goal | Changes | Change | Detour s/trip |
| --- | --- | --- | --- | --- |
| p1 | most removed | filters at 63rd & Colby, 63rd & Hillegass, Colby & McAuley, Ayala & Martin, Forest at Ayala; diverter at 62nd & Hillegass | -386.8 [-407.6, -365.9] | 16.0 |
| p2 | | filters at 63rd & Colby, Ayala & Martin, Ayala & Forest; diverter at 63rd & Hillegass; Slow Street on Colby | -325.2 [-347.7, -302.7] | 12.4 |
| p3 | | filters at 63rd & Colby, 63rd & Hillegass, Ayala & Martin; diverter at 62nd & Hillegass; Forest one-way westbound | -296.6 [-315.3, -277.9] | 10.1 |
| p4 | no closures | five one-way conversions (Colby, Hillegass, Martin, Forest, 62nd); Slow Street on Colby | -208.6 [-226.2, -191.0] | 4.8 |
| p5 | least detour | filter at 63rd & Hillegass; diverter at 62nd & Hillegass; Slow Street on Colby | -185.2 [-206.1, -164.3] | 1.5 |
| p6 | fewest changes | diverter at 63rd & Hillegass; Slow Street on Colby | -170.2 [-184.6, -155.8] | 0.3 |

All five comparisons between neighboring options are resolved (search-c5 left p4 against p5 unresolved).

**Compared with search-c5 and the round 51 set.**

- Same changes in all three sets: p1, p3, the no-closures option (search-c5 p4, round 51 p5, now p4) and both reference packages. p2 is search-c5 p2. Round 51 listed it as a same-picture variant of its own p2.
- Changed winners:
  - Most removed now goes to p1, the six-change package that both earlier sets listed as option 1 without a goal. The goal ranks on through-car reduction minus 0.1 point per car an hour of the worst all-traffic rise past its band. On the discovery seeds p1 scores 73.5 - 19.2 = 54.3 and p2 scores 64.3 - 13.5 = 50.8. In search-c5, p2's worst rise was +71 on 60th Street between Colby and Howell. Here it is +135 on McAuley Street between Colby and Ayala. Round 51's most-removed package (found by that search) was not in the seeds file, and this search did not find it.
  - Least detour goes to p5, a new package this search found. It sat in neither earlier finalist table. It qualifies by a narrow margin: on the discovery seeds it removes 37.4% against a threshold of 36.8% (half of the best, an assumption in the search). On the confirmation seeds it removes 35.5% against p1's 74.0%. search-c5's least-detour package is finalist 27 here, folded into finalist 13. Round 51's is finalist 21, dominated by finalist 7.
  - Fewest changes goes to p6, a known package from 2026-11-17. It was finalist 18 in search-c5 (eligible, not chosen) and finalist 16 in round 51 (dominated). search-c5 p6 is finalist 17 here (eligible, not chosen). Round 51 p6 is finalist 36, kept out because it does not beat p6 on through cars.
- The finalist screens rejected 10 of 39 packages, all for unroutable PM trips (2 to 9 above a baseline of 0). Round 51 rejected 8 of 40 (7 unroutable, 1 gridlock clearances), and search-c5 rejected 8 of 38 (all unroutable, 1 to 7).
