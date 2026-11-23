# Laptop run of the publish chain for the ban-set proposals

Made by `openspec/changes/publish-ban-set-proposals/laptop` on 2026-11-22, simulator 6b886c8f52ee07397773ddd0ebbcb447, from `739517b`. Nothing here was pushed to the data bucket, and no upload token or /api/ request was used.

- `publish-data.tar.gz.part-*`: the files to publish (paths relative to the repository root). `publish-evidence.tar.gz.part-*`: logs, `headline.md`, the search output and command.
- Both are ustar archives compressed with `gzip -9 -n` and split with `split -b 190000`. `FILES.txt`: path, size, SHA-256 and which archive. `SHA256SUMS`: every file, both reassembled archives and every part.
- Install with `openspec/changes/publish-ban-set-proposals/install.md`. Start with `target/publish-bs/headline.md` in the evidence archive.

## Laptop notes

Times are Pacific. From step B on, the laptop's clock was set to Central time, so `chain.log` shows those steps in CST.

- **Step A**, 7:01 to 7:04 AM, at `c068ed3`. It ran from the copy `a.laptop.zsh`, which changes one line (`laptop-fixes.diff`). The worktree's `node_modules` is a link to the main checkout, so the original `npm install` would have written into the main checkout. The copy copies the humanizer skill from the main checkout instead; no test reads it. Results: fingerprint 6b886c8f, check:wasm ok, cargo test 352 passed, vitest 1239 passed and 1 skipped, typecheck ok, ban sets identical to `expected-sets.tsv`. The run was then paused while the laptop was packed up.
- **Run 1**, at `c068ed3`, not packed. B ran 3:21 to 4:29 PM (4052 s) and wrote proposals 2b408c19ecfcc280. Its `no-turn-bans` pick was a new five-closure package (173.6 through cars an hour, -66.8%), not the published six-change package (135.7, -74.0%). C ran 4:29 to 4:35 PM. Verify failed on those two checks, plus a counting fault that counted `baseline-intents.json` as a result. Its headline table is `run1-headline.md`. The project lead decided to publish both packages, which led to the sixth objective in `739517b`. Run 1's full outputs stay on the laptop in `target/publish-bs-run1`.
- **Run 2**, at `739517b`, packed here. Before it, the three published inputs were restored (proposals c5cbe25f39e61414, report bb0af630991924a4, seeds e464cc90ca3e1472). The rebuild kept fingerprint 6b886c8f, and the objectives test passed 23 of 23. B ran 5:23 to 6:11 PM (2846 s) with 3088 screening runs; its finalist table matches run 1's. C ran 6:11 to 6:20 PM (redistribution 225 s, results 316 s). Verify passed every check at 6:20 PM, with one NOTE: left turns alone is not in the list. The pack followed at 6:20 PM.
- `chain.log` in the evidence archive holds step A, run 1 and run 2, in that order. `add-seeds.log` holds both runs' seed additions.
- `chain.laptop.zsh` holds the two driver scripts. B, C, verify and pack ran from the worktree unmodified, with `pack.zsh --no-push`. This commit was made by hand on the dev branch.
