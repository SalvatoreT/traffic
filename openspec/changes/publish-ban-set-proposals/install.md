# Install checklist (lead session)

For the lead session, after the laptop run of `runbook.md` is packed on the dev branch. Nothing here is run by the laptop. The decision to publish both families is the project lead's of 2026-11-22 (`design.md`); read `headline.md` first and stop if a check failed.

1. **Get the parts, outside the repository.** Fetch the dev branch and read `openspec/changes/publish-ban-set-proposals/evidence/laptop-publish/` from it into an empty scratch folder (`git show` or `git archive`; do not copy the parts into `main`).
   ```bash
   D=<scratch>/parts; X=<scratch>/unpacked; mkdir -p $X
   awk '/part-/ {n=split($2,a,"/"); print $1"  "a[n]}' $D/SHA256SUMS | (cd $D && shasum -a 256 -c)   # every part
   cat $D/publish-data.tar.gz.part-* | shasum -a 256; cat $D/publish-evidence.tar.gz.part-* | shasum -a 256   # the two archives
   cat $D/publish-data.tar.gz.part-* | tar -xzf - -C $X
   cat $D/publish-evidence.tar.gz.part-* | tar -xzf - -C $X
   awk -F'\t' '{print $3"  '$X'/"$1}' $D/FILES.txt | shasum -a 256 -c    # every file
   ```
   The two archive sums must equal the lines of `SHA256SUMS` named `publish-data.tar.gz` and `publish-evidence.tar.gz`.
2. **Read the result.** `$X/target/publish-bs/headline.md` must end with `RESULT: every check passed.` Read the table: the top option, the option tagged `no-turn-bans` (the old p1 at 135.7 through cars an hour), option count, bans, closures, intervals, worst blocks and resident detour. `chain.log`: every step exit 0, fingerprint `6b886c8f52ee07397773ddd0ebbcb447`, no stop.
3. **Branch.** On `publish-ban-set-proposals` (or a branch with it merged into `main`), with the git-ignored data in place. Empty the four generated folders so the manifest lists only new files: `rm -rf public/data/{results,redistribution,llms,og}`.
4. **Install.** From `$X`: copy `public/data/rockridge.proposals.json`, `public/data/results/` and `public/data/redistribution/` into `public/data/`, and `data/proposals/rockridge.md` and `data/proposals/rockridge.seeds.json` into `data/proposals/`. `shasum -a 256` the five against `FILES.txt`.
5. **Text pages and previews.** `npm run data:llms`, then `npm run data:previews`. Check `public/data/llms/proposals.md` carries "turn restrictions around the edge of the area" and the standing caveat for the ban options and a resident detour line for every option, and that `public/data/og/index.json` lists a card for each option and none was skipped.
6. **Tests.** `npx vitest run tools/ worker/ src`, `npm run -s typecheck`, `cargo test --release -p traffic-sim` (the fingerprint must still print `6b886c8f52ee07397773ddd0ebbcb447`).
7. **Commit** the tracked files with Conventional Commits and the usual trailers: `data/proposals/rockridge.md`, `data/proposals/rockridge.seeds.json` (cap raised, two hand seeds added, options recorded), the README, the OpenSpec change; push `main`. The data files are not committed (the hook blocks files over 200 KB).
8. **Deploy the app first.** The new card (turn-restriction line, caveat, resident detour beside the headline, every ban by street) and the grouped scenario entry are code: `npm run deploy` before the data goes up, so that nobody sees a ban package in the old card. The old app reads the new file without error (an unknown objective id is ignored), so the order is a courtesy and not a hazard.
9. **Publish.** `NODE_USE_ENV_PROXY=1 TRAFFIC_UPLOAD_URL=https://traffic.transit.directory npm run data:push` (the upload secret is a network secret; never a variable or a file).
10. **Read the site back.** Fetch and hash, and compare with the local files:
    - `/data/rockridge.proposals.json`: SHA-256 equal to the local file; `computed.simulator` `6b886c8f52ee07397773ddd0ebbcb447`, `networkHash` `53c823f20d9165ed`, `demandHash` `2d16d8f8eb0950ca`; the option ids and titles match `headline.md`.
    - `/data/results/rockridge/index.json` and one results file per option; `/data/redistribution/rockridge/` one file per option that has a traced change.
    - `/data/llms/proposals.md`, `/data/llms/llms.txt` and `/data/og/index.json` equal the local copies.
    - `/proposals` in a browser at 1300 px and 375 px: the ban option shows the scale line, the caveat and the resident detour; the `no-turn-bans` option shows "Best for: no turn restrictions"; "Open on the map" on the ban option shows one grouped scenario entry; a share link of an option opens at the end of the hour.
    - The Assumptions and Comparison tabs still show their figures (no "Out of date" notice).
11. **Record entry.** The lead writes the entry in `data/calibration/rockridge.record.md` after step 10: the date, the list (what replaced the six published options), the figures of the headline table, the hashes read back, the decision of 2026-11-22 and the limits (bans for every driver, full compliance assumed, model not calibrated).
12. **Close the change.** Tick the unticked tasks in `tasks.md` (laptop, install, publish, record), `npx openspec validate publish-ban-set-proposals --strict --no-interactive`, then `OPENSPEC_TELEMETRY=0 npx openspec archive publish-ban-set-proposals --yes`.
