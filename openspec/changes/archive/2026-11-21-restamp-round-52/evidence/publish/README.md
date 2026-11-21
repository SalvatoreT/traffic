# Restamped round 52 files for the publish

These are the round 52 files remade on simulator `6b886c8f52ee07397773ddd0ebbcb447`, packed on 2026-11-21 for the cloud session, which publishes them with `data:push`. The lead chose option A: publish the step 5 set as it came out, `areas.json` with the noise pointer included (see `../README.md`). The laptop ran no `data:push`, made no `/api/` request, used no upload token and wrote nothing to main.

## What is here

- `public-data.tar.gz.part-aa` to `-au`: 21 parts of one tar archive (ustar, paths relative to `public/data`), compressed with `gzip -9 -n` and split with `split -b 190000`. The reassembled `public-data.tar.gz` is 3,839,813 bytes.
- `membership.tar.gz.part-aa` to `-af`: 6 parts of the two membership files (paths relative to `target/membership`), packed the same way. The reassembled `membership.tar.gz` is 1,133,577 bytes.
- `FILES.txt`: the 65 files the two archives unpack to, each with its size in bytes, its sha256 and how it compares with the published file: `identical`, `stamps` (simulator fingerprint, revision, dates only) or `content` (the three files the lead accepted).
- `SHA256SUMS`: every raw file, both reassembled archives and every part.
- `UNCHANGED.txt`: the hashes of the `public/data` files this restamp does not change (network, demand, noise, basemap and the compact network and basemap), to check the copies already in place.

| Path | Files | Raw bytes | Compared with the published files |
| --- | --- | --- | --- |
| `public/data/rockridge.proposals.json` | 1 | 127,186 | stamps |
| `public/data/rockridge.assumptions.json` | 1 | 6,550 | stamps |
| `public/data/areas.json` | 1 | 6,338 | content: adds `"noise": "/data/rockridge.noise.json"` |
| `public/data/results/rockridge/` | 26 | 6,688,590 | stamps |
| `public/data/redistribution/rockridge/` | 8 | 33,560 | 6 stamps; p1 and p3 content (route paths only) |
| `public/data/llms/` | 11 | 483,137 | 10 stamps, 1 identical |
| `public/data/og/` | 15 | 1,856,564 | identical |
| `target/membership/` | 2 | 4,635,825 | stamps (`evidence.simulator`) |
| Total | 65 | 13,837,750 | |

The membership files are shipped `56e688e7e5749d23` and training `cf32e3e0d9e6f23e`.

## Unpack and check

Run this from the repository root. It clears the four generated folders first, so the push walks only the new files and the manifest lists only them.

```bash
D=openspec/changes/restamp-round-52/evidence/publish
grep '  openspec/' $D/SHA256SUMS | shasum -a 256 -c
rm -rf public/data/results public/data/og public/data/llms public/data/redistribution
cat $D/public-data.tar.gz.part-* | tar -xzf - -C public/data
mkdir -p target/membership
cat $D/membership.tar.gz.part-* | tar -xzf - -C target/membership
grep -E '  (public/data|target/membership)/' $D/SHA256SUMS | shasum -a 256 -c
shasum -a 256 -c $D/UNCHANGED.txt
```

## How they were made

From the development branch at `dd0be1e` (main `9686996` merged), the laptop ran the steps in `../laptop/` from 8:20 to 10:37 AM PST. The membership loop, `npm run data`, `validate` and the ten-seed assessment ran first, then the proposal search with round 52's flags and seeding inputs, which put proposals `c5cbe25f39e61414` in place. Last came `data:redistribution --jobs 8`, `data:results --jobs 6`, `data:assumptions`, `data:llms` and `data:previews`. `../README.md` gives the result of every check. `../laptop/pack.zsh` made this folder; its round trip found every file intact, and there were no stale files in `results` or `og`.

| Input | Hash |
| --- | --- |
| Config | `2405ff02c92b2837` |
| Network, demand, cross-validation demand | `53c823f20d9165ed`, `2d16d8f8eb0950ca`, `1c3b1666f24156f1` |
| Membership (shipped, training) | `56e688e7e5749d23`, `cf32e3e0d9e6f23e` |
| Proposals | `c5cbe25f39e61414` |
| Simulator fingerprint | `6b886c8f52ee07397773ddd0ebbcb447` |
