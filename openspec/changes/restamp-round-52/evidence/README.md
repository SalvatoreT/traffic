# Round 52 restamp: laptop evidence

On 2026-11-21 the laptop reran the published round 52 set on simulator `6b886c8f52ee07397773ddd0ebbcb447`, following the lead's plan from that morning. That simulator comes from main `1e6b825`, merged into the development branch as `dd0be1e`. Under the lead's rule, every figure had to match the published set; only the simulator fingerprint, the revision and dates could change. Steps 1 to 4 held. Step 5 found three files that differ in more than stamps, so the laptop stopped there and reported. The lead then chose to publish the step 5 set as it came out (option A, `areas.json` with the noise pointer), and the laptop packed it in `publish/`. It ran no `data:push`, made no `/api/` request and used no upload token.

## Results by step

Times are wall-clock seconds on this laptop (M3 Pro); "round 52" means the same step on 2026-11-19 and 2026-11-20 on simulator `d45a275dd7be`.

| Step | Result | Seconds (round 52) |
| --- | --- | --- |
| 1. Release build, `npm run wasm`, `check:wasm` | Fingerprint `6b886c8f52ee07397773ddd0ebbcb447`. Native and WASM runs are identical (PM peak, 300 s, seed 1). | build 37 |
| 2. Membership loop, then `npm run data` | Dry-run counts equal round 52's. The iteration demands, the fit reports after every build and the gate prior dumps are byte-identical to round 52's. Both membership files differ from the published ones only in `evidence.simulator`: shipped `56e688e7e5749d23` (was `3d639670c1feb38f`), training `cf32e3e0d9e6f23e` (was `c1cd4ce96fb28791`). `npm run data` gives network `53c823f20d9165ed`, demand `2d16d8f8eb0950ca` and cross-validation demand `1c3b1666f24156f1`, with fit reports, audit and area config identical to the committed files. | loop 3777 (3992), data 1017 |
| 3. `validate`, `assess --publish --noise`, seeds 1 to 10 | 67 of 74 cases pass. `validation.json` changes only in fingerprint and revision. The assessment is identical once the stamp line is set aside, and the noise file is identical (`4d6850cccc2f43e8`). The reports differ only in stamps, in the run time line of the single-seed reports and in the hashes of the per-seed summaries (`checks/reports-check.txt`). | validate 18, assess 70 (148) |
| 4. Proposal search, round 52 flags and seeding inputs | `proposals.json` differs only in `computed.date`, `computed.simulator` and `computed.sourceRevision`. Every differing word in the report is a stamp or a run time. `seeds.after` differs from the committed `e464cc90ca3e1472` only in dates; the committed seeds file is kept (`checks/search-check.txt`). | 2736 (5606) |
| 5. Redistribution, results, assumptions, text pages, previews | Of the 69 published files, 22 are byte-identical (all 15 preview files among them), 44 differ only in stamps and 3 differ in content (below). | redistribution 266 (567), results 66 (140) |

## The three files that differ

- `redistribution/rockridge/unconstrained.p1.json` and `unconstrained.p3.json`: the drawn path (`links`) of 9 routes. The counts, shares, street labels and receiving streets are identical in all 8 redistribution files. For each street label, `tools/precompute-redistribution.ts` keeps the first route sample it receives, and the seeds run in a worker pool, so the path comes from whichever seed finishes first. On the new binary, two runs of p1 with `--jobs 8` gave identical files, while a run with `--jobs 1` drew a different path for 6 of its 24 routes (`checks/redistribution-check.txt`).
- `areas.json`: it gains `"noise": "/data/rockridge.noise.json"`. `tools/import-osm.ts` writes that field only when the noise file already exists when `npm run data` runs. The published `areas.json` lacks the field, so yesterday's adoption run must have built it before the noise file was in place. No app code reads the field (`checks/areas-diff.txt`).

The text pages count as stamp-only. They differ only in dates (including "November 21, 2026"), the short fingerprint and the source revision (`checks/llms-check.txt`). The comparison script flagged four of them because it did not know those forms.

## Files

- `checks/`: the comparisons, one file per check named above, plus the loop report (`membership-loop.md`), the dry run, and the search's rewritten seeds file (`seeds.after.json`).
- `laptop/`: the scripts (`a.zsh` for steps 1 and 2, `b.zsh` for step 3, `b2.zsh` for step 4, `c.zsh` for step 5), the two comparison helpers and the chain log. `b.zsh` and `b2.zsh` each stopped once on a fault in the script's own check, not in the data; the chain log notes both and the hand rechecks are in `checks/`.
