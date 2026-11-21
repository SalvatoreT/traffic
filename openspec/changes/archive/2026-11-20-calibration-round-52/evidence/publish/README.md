# Round 52 public data files for the publish

These are the files under `public/data` that change when round 52 is adopted. The laptop made them on 2026-11-20 for the cloud session, which publishes them with `data:push`. The laptop ran no `data:push`, made no `/api/` request, used no upload token and wrote nothing to main.

## What is here

- `public-data.tar.gz.part-aa` to `public-data.tar.gz.part-av`: 22 parts of one tar archive (ustar, paths relative to `public/data`), compressed with `gzip -9 -n` and split with `split -b 190000`. The reassembled `public-data.tar.gz` is 4,070,253 bytes.
- `FILES.txt`: the 65 paths the archive unpacks to, each with its size in bytes and its sha256.
- `SHA256SUMS`: every raw file, the reassembled `public-data.tar.gz` and every part.
- `UNCHANGED.txt`: the hashes of the `public/data` files this adoption does not change (the network, the basemap and the compact network and basemap), to check the copies already in place.
- `keep-rule.md`: the keep-rule table of the published assessment.
- `laptop/`: the scripts that made the files, and the chain log, with local paths replaced by `<worktree>` and `~`.

| Path under `public/data` | Files | Raw bytes |
| --- | --- | --- |
| `rockridge.demand.json` | 1 | 2,334,060 |
| `rockridge.proposals.json` | 1 | 127,186 |
| `rockridge.noise.json` | 1 | 35,401 |
| `rockridge.assumptions.json` | 1 | 6,550 |
| `areas.json` | 1 | 6,295 |
| `results/rockridge/` | 26 | 6,688,590 |
| `og/` | 15 | 1,856,564 |
| `llms/` | 11 | 483,137 |
| `redistribution/rockridge/` | 8 | 33,540 |
| Total | 65 | 11,571,323 |

`results/rockridge/` holds 24 finished hours (8 proposals in 3 periods), `baseline-intents.json` and `index.json`. `og/` holds 14 cards and `index.json`.

## Unpack and check

Run this from the repository root. It clears the four generated folders first, so the push walks only the new files and the manifest lists only them.

```bash
D=openspec/changes/calibration-round-52/evidence/publish
grep '  openspec/' $D/SHA256SUMS | shasum -a 256 -c
rm -rf public/data/results public/data/og public/data/llms public/data/redistribution
cat $D/public-data.tar.gz.part-* | tar -xzf - -C public/data
grep '  public/data/' $D/SHA256SUMS | shasum -a 256 -c
shasum -a 256 -c $D/UNCHANGED.txt
```

## How they were made

The laptop merged `adopt-round-52` (`fd8c0fe`) into the development branch as `dd87d88` and placed `evidence/search/proposals.json` at `public/data/rockridge.proposals.json`.

| Input | Hash |
| --- | --- |
| Config | `2405ff02c92b2837` |
| Network, demand, cross-validation demand | `53c823f20d9165ed`, `2d16d8f8eb0950ca`, `1c3b1666f24156f1` |
| Membership (shipped, training) | `3d639670c1feb38f`, `c1cd4ce96fb28791` |
| Proposals | `197a99cdafc026f8` |
| Seeds file | `e464cc90ca3e1472` |
| Simulator fingerprint | `d45a275dd7be0713cec6a64394b7d8a9` |

The steps ran from 8:06 to 8:38 AM PST (`laptop/chain.log.txt`):

1. The release build and `npm run wasm`. The WASM parity check found native and WASM runs identical (PM peak, 300 s, seed 1).
2. `npm run data` (17 minutes) rebuilt the three hashes above. The fit reports, the audit and the area config came out identical to the committed files.
3. `validate`: 67 of 74 cases pass. In `validation.json` only `manifest.simulator.revision` changed, and `validation.md` did not change.
4. `npm run assess -- --publish --noise --jobs 12` (148 s, seeds 1 to 10). The verdict is "Suggested status: uncalibrated", the same as round 52's ten-seed assessment. The keep-rule table, the whole-street rows, the verdict section and the noise file are all identical to round 52's.
5. `data:redistribution --jobs 8` (567 s), `data:results --jobs 6` (140 s), then `data:assumptions`, `data:llms` and `data:previews`. The previews skipped nothing.

The assessment, its reports and `validation.json` are committed on the development branch next to this folder.
