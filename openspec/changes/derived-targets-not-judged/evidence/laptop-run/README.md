# Derived targets: candidate outputs of the laptop run

Made by `openspec/changes/derived-targets-not-judged/laptop/{a,b,c}.zsh` on 2026-11-21, simulator 6b886c8f52ee07397773ddd0ebbcb447, from `e644ed9`. A candidate: nothing here replaces a published file, and nothing was pushed to the data bucket.

- `derived-run.tar.gz.part-*`: one tar archive (ustar, paths relative to the repository root), compressed with `gzip -9 -n` and split with `split -b 190000`.
- `FILES.txt`: every file with its size and SHA-256. `SHA256SUMS`: every file, the reassembled archive and every part.
- Start with `target/derived/summary.md` and `target/derived/chain.log` in the archive.

Unpack into an empty folder, never over the published files, and check:

```bash
D=openspec/changes/derived-targets-not-judged/evidence/laptop-run
grep '  openspec/' $D/SHA256SUMS | shasum -a 256 -c
mkdir -p /tmp/derived-run && cat $D/derived-run.tar.gz.part-* | tar -xzf - -C /tmp/derived-run
awk -F'\t' '{print $3"  /tmp/derived-run/"$1}' $D/FILES.txt | shasum -a 256 -c
```

## Laptop notes

- `MAIN` was the batch worktree, which holds the published local data (the 8.7 MB OSM extract among it), and `W` was `.claude/worktrees/traffic-derived`. Every published hash matched before the start, the cross-validation demand `1c3b1666f24156f1` included.
- `b.zsh` stopped right after the loop (3,790 s, exit 0) on its byte check of the shipped membership file. The only differences were six `source` strings that name the worktree folder (`batch` in the published file, `traffic-derived` here). With the folder name set back, the file is byte-identical to the published one (`56e688e7e5749d23`). The archive holds it as produced (`47036a6dd85eb760`). The training membership file's `source` strings also name `traffic-derived`.
- `b2.zsh` (in this folder, not in the archive) ran steps 2 to 5 of `b.zsh` without rerunning the loop. Its one change is that comparison, made after setting the folder name back. The chain log records the stop and the resume.
- Line 22 of `b.zsh` printed a zsh "no matches found" for `ls target/membership/*.json` on the empty folder. The check still passed, because the folder was empty.
- `pack.zsh` ran with `--no-push`. The copy, commit and push to this branch were done by hand, so the commit carries this session's trailer and could fall back to an unsigned commit if signing hung.
