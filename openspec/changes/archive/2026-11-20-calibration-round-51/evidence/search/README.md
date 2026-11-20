# Round 51 staged proposal search

The lead asked on 2026-11-19 for the proposal search to run on the round 51 candidate, in the same shape as search-c5, with the outputs kept staged. Nothing in this folder is published. Nobody ran `data:redistribution`, `data:results`, `data:llms`, `data:previews` or `data:push`, and nothing was written to `public/data/rockridge.proposals.json` or `data/proposals/`.

## Inputs

- Candidate config `1080597767aac58c`. Network `53c823f20d9165ed`, demand `5d6be8a70618e905`, cross-validation demand `7164fa2ab08f612a`, membership `74a88c864d406903` (shipped) and `7d0fdb063236304d` (training).
- Simulator fingerprint `d45a275dd7be0713cec6a64394b7d8a9`, code at `d4b2095`.
- The stations file was identical to the baseline's.
- `--out` started as a copy of the search-c5 output, which is the published set (`3822705a26ca879d`). `--known` started as a copy of `data/proposals/rockridge.seeds.json` (`fbcf6d37a7e8cad3`).
- The flags match search-c5's (`command.txt`).

## Run

Explore ran from 6:50 PM to 8:12 PM PST on 2026-11-19 and took 4903 s; search-c5 took 5384 s. It exited 0. The restore then rebuilt the baseline (network `53c823f20d9165ed`, demand `9cdebdabf05c4460`, cross-validation demand `2f9ae152b9bbf78e`) and left a clean status. The worktree's `public/data/rockridge.proposals.json` was `388c91f025dafd55` before and after.

## Files

- `proposals.json` and `report.md` are the explore output for the candidate: one group, `unconstrained`.
- `seeds.after.json` is the seeds file explore rewrote. It is the staged copy, not `data/proposals/rockridge.seeds.json`.
- `compare.md` is written by `compare.cjs`. It has, for both sets:
  - each option's changes, with per-period effects, confirmation-seed intervals and per-seed ranges
  - the largest all-car rise per period
  - the winner of each goal
  - where each option ended up in the other set
- `command.txt`, `run.zsh`, `chain.log.txt` and `search.log.txt` record how the run was made.

## Findings

All figures are means over confirmation seeds 101 to 110.

**Baseline through cars per hour.**

| Period | Candidate | search-c5 |
| --- | --- | --- |
| PM peak | 806.9 | 709.2 |
| AM peak | 414.0 | 429.1 |
| Midday | 386.8 | 386.8 |
| Mean | 535.9 | 508.4 |

The candidate's midday demand is byte-identical to the baseline's. For options with the same changes, the midday figures match search-c5 exactly. Gate-to-gate (through) demand in the candidate is lower: 5021 against 5908 cars an hour in the PM peak, and 3506 against 3745 in the AM peak. Even so, the simulated PM through count on side streets rose.

**Displacement.** The displacement rule dropped no option in either set. Option p1 still has the largest all-car rise on one block: +200.7 cars an hour on 60th Street between Claremont / Hillegass and Colby in the PM peak (search-c5: +207.5).

**Option set compared with search-c5.**

- Same changes:
  - p1
  - p3
  - the no-closures option (search-c5 p4, now p5)
  - both reference packages
- Changed winners:
  - Most removed: a new package found by this search (p2) replaces search-c5 p2, which is now listed as a same-picture variant of p2.
  - Fewest changes: the diagonal diverter at 63rd and Hillegass replaces the modal filter there (p6). search-c5 p6 is listed on it as a same-places variant.
  - Least detour: p4 is a known package first recorded on 2026-11-18. search-c5's least-detour package (search-c5 p5) is finalist 26 here. On the discovery seeds it added 1.7 s per trip against p4's 3.5 s. It was folded into finalist 10 as the same picture, and finalist 10 was not chosen.
- The finalist screens rejected 8 packages: 7 for unroutable trips and 1 for gridlock clearances (search-c5 rejected 8, all for unroutable trips).
