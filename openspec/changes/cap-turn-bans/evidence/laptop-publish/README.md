# Laptop run of the publish chain for the capped turn-ban proposals (at most 5 individual turn bans a package)

Made by `openspec/changes/cap-turn-bans/laptop` on 2026-11-23, simulator 6b886c8f52ee07397773ddd0ebbcb447, from `0dfa725`. Nothing here was pushed to the data bucket, and no upload token or /api/ request was used.

- `publish-data.tar.gz.part-*`: the files to publish (paths relative to the repository root). `publish-evidence.tar.gz.part-*`: logs, `headline.md`, the search output and command.
- Both are ustar archives compressed with `gzip -9 -n` and split with `split -b 190000`. `FILES.txt`: path, size, SHA-256 and which archive. `SHA256SUMS`: every file, both reassembled archives and every part.
- Install with `openspec/changes/cap-turn-bans/install.md`. Start with `target/cap-bans/headline.md` in the evidence archive.

## Laptop notes

Times are Pacific, on 2026-11-23. The laptop's clock was set to Central time, so `chain.log` shows CST, two hours later. Every script ran unmodified at `0dfa725`, with `MAIN` and `BATCH` set to the laptop's `batch` worktree. `chain.laptop.zsh` holds the three driver scripts.

- **Step A, first attempt**, 7:56 to 8:01 PM in the worktree `traffic-cap`, stopped. One TypeScript test timed out: "joins short signal pairs into single nodes" in `tools/import-osm.test.ts`, 6705 ms against the 5000 ms limit, with the load average near 20 from other projects. The other 1243 passed and 1 was skipped. Run alone, the same test passed three times out of three (2956, 2768 and 2780 ms). The lead asked for an unmodified rerun. The first attempt's logs are in `target/cap-bans/first-attempt/` in the evidence archive. Its worktree is kept as it stopped.
- **Step A, second attempt**, 8:03 to 8:06 PM in a fresh worktree `traffic-cap2`, passed. Build 40 s, fingerprint 6b886c8f, check:wasm 12 s, cargo test 123 s (360 passed), vitest 10 s (1244 passed, 1 skipped), typecheck 4 s, the 21 ban sets identical to `expected-sets.tsv`.
- **Step B**, 8:06 to 9:19 PM, 4338 s against the runbook's 30 to 60 minutes. It made 4038 screening runs (the report at `0dfa725` says 3088), and other projects loaded the laptop, with a load average of 60 to 78 near the end. The run lengths are simulated minutes, so load changes the wall time and not the results. Proposals a625df58f816a1ff, report 7f5c1052680b64ff, seeds 178302f7d61191c6 (25 packages before, 28 after; the 5 over the cap are still in the file).
- **Step C**, 9:19 to 9:25 PM: redistribution 272 s (8 files), results 85 s (24 result files, plus `index.json` and `baseline-intents.json`).
- **Verify and pack**, 9:25 PM. Verify passed every check. The pack ran with `--no-push`, and its round trip was OK. This commit was made by hand on the dev branch.

Three things to know before publishing. Nothing was changed for them.

1. p2 (173.6) carries `most-removed`, which the app labels "most cut-through removed", and p1 (135.7) removes more. The tag follows the score, which takes off 0.1 points per car an hour of added traffic on one block.
2. The list differs from the run of 2026-11-22 by more than the 41-ban options. The old least-detour option (266.8) is finalist 20, dominated by finalist 3, which is itself not listed because a smaller finalist cuts as much. p5 (332.3) takes the tag.
3. The least-detour floor is half of the most removed, read on the 3 discovery seeds, where p5 clears it (38.9% against 36.75%). On the confirmation seeds p5 is at 36.4% and half of p1 is 37.0%.
