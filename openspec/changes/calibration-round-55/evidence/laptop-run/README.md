# Calibration round 55: evidence of the laptop run

Made by `openspec/changes/calibration-round-55/laptop` on 2026-11-21, simulator 6b886c8f52ee07397773ddd0ebbcb447, from `2999e09`. Candidate outputs: nothing here replaces a published file, and nothing was pushed to the data bucket.

- `r55-run.tar.gz.part-*`: one tar archive (ustar, paths relative to the repository root), compressed with `gzip -9 -n` and split with `split -b 190000`.
- `FILES.txt`: every file with its size and SHA-256. `SHA256SUMS`: every file, the reassembled archive and every part.
- Start with `target/r55/chain.log`, `target/r55/keep-rule.md`, `target/r55/diagnostics.md` and `target/r55/headline.md` in the archive.

Unpack into an empty folder, never over the published files, and check:

```bash
D=openspec/changes/calibration-round-55/evidence/laptop-run
mkdir -p /tmp/r55-run && cat $D/r55-run.tar.gz.part-* | tar -xzf - -C /tmp/r55-run
awk -F'	' '{print $3"  /tmp/r55-run/"$1}' $D/FILES.txt | shasum -a 256 -c
```

## Laptop notes

The scripts ran from these folders: MAIN was `.claude/worktrees/batch` (the published shipped demand and shipped membership), DER was `.claude/worktrees/traffic-derived` (the published cross-validation demand and training membership), and W was `.claude/worktrees/traffic-r55`. `chain.zsh` ran a, b, c and d in order. `chain2.zsh` resumed after the fix to b.zsh below.

Two script faults were fixed on the laptop; `laptop-fixes.diff` has both.

1. `a.zsh` fetched the round branch over SSH, which fails while the 1Password agent is locked. The laptop copy, `a.laptop.zsh`, fetches over HTTPS with the gh login into `refs/remotes/origin/calibration-round-55`. The first try wrote `$BR:r...` and zsh read `:r` as a modifier, so it uses `${BR}`. Nothing else changed.
2. `b.zsh` line 48 passed `--ignore periods.*.source` (and the two other patterns) unquoted. zsh expanded them as file globs, stopped with "no matches found" and never ran jdiff, so the script stopped with an empty diff after the loop had finished. `b2.zsh` is b.zsh steps 2 to 4 with those three patterns quoted and nothing else changed. It ran at 9:16 PM without rerunning the loop. Both pass 2 pools then matched the published membership files apart from the six recorded run paths (`target/r55/pool2-*-diff.txt`).

The keep rule and the improvement test both failed, so d.zsh did not run and there is no `headline.md` or staged search output. restore.zsh was not run: W still holds the candidate.
