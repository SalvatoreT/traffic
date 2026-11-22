# Calibration round 54, stage1: evidence of the laptop run

Made by `openspec/changes/calibration-round-54/scripts` on 2026-11-21, simulator 54d3481e9681cd76489a3ff7611a6ebc, from `1334fec`. Candidate outputs: nothing here replaces a published file, and nothing was pushed to the data bucket.

- `r54-stage1.tar.gz.part-*`: one tar archive (ustar, paths relative to the repository root), compressed with `gzip -9 -n` and split with `split -b 190000`.
- `FILES.txt`: every file with its size and SHA-256. `SHA256SUMS`: every file, the reassembled archive and every part.

Unpack into an empty folder, never over the published files, and check:

```bash
D=openspec/changes/calibration-round-54/evidence/laptop-stage1
mkdir -p /tmp/r54-stage1 && cat $D/r54-stage1.tar.gz.part-* | tar -xzf - -C /tmp/r54-stage1
awk -F'	' '{print $3"  /tmp/r54-stage1/"$1}' $D/FILES.txt | shasum -a 256 -c
```

## Laptop notes

- The run used its own worktree, `.claude/worktrees/r54`, on a local branch `calibration-round-54` at `1334fec`. It held byte copies of the published ignored data from the batch worktree (network `53c823f20d9165ed`, shipped demand `2d16d8f8eb0950ca`, membership `56e688e7e5749d23` / `cf32e3e0d9e6f23e`, the 8.7 MB OSM extract). `CV` pointed at the derived-targets worktree's cross-validation demand, and `CV_HASH=e1a9d4bd50539355` was passed in the environment, which the script reads, so the file stayed unedited.
- First run (`run1-*`, 165 s): `stage1.zsh` reused the same four folders (`off-ship`, `off-cv`, `on-ship`, `on-cv`) for both periods and emptied each one before its run. The AM runs therefore deleted the PM seed reports after the PM score was written. The fix gives each period its own folder (`target/r54-stage1/<period>/...`) in `stage1.zsh` and in the stage 1 file list of `pack.zsh` (`laptop-fixes.diff`).
- Second run (139 s): both score files are byte-identical to the first run's, and the 40 AM seed reports are byte-identical between the two runs.
- `off-identity.md`: all 40 option-off seed reports (PM and AM, shipped and cross-validation) equal the derived-targets job's reports for seeds 1 to 10. The only differences are the fingerprint and revision stamps and, for the cross-validation runs, the path of the demand file, which is a byte copy.
- `extract.md` (made by `extract.ts`, which reads the seed reports with `tools/lib/assess`): the six named stations and the D5 headline shares for each set and view.
- `pack.zsh` ran with `--no-push`, and the copy, commit and push were done by hand, as in the derived-targets run.
