# Ban-set candidates: evidence of the laptop run

Made by `openspec/changes/turn-ban-set-candidates/laptop` on 2026-11-22, simulator 6b886c8f52ee07397773ddd0ebbcb447, from `d13b44e`. Nothing here replaces a published file, and nothing was pushed to the data bucket.

- `bs-run.tar.gz.part-*`: one tar archive (ustar, paths relative to the repository root), compressed with `gzip -9 -n` and split with `split -b 190000`.
- `FILES.txt`: every file with its size and SHA-256. `SHA256SUMS`: every file, the reassembled archive and every part.
- Start with `target/ban-sets/chain.log` and `target/ban-sets/summary.md` in the archive.

Unpack into an empty folder, never over the published files, and check:

```bash
D=openspec/changes/turn-ban-set-candidates/evidence/laptop-run
mkdir -p /tmp/bs-run && cat ${D}/bs-run.tar.gz.part-* | tar -xzf - -C /tmp/bs-run
awk -F'	' '{print $3"  /tmp/bs-run/"$1}' ${D}/FILES.txt | shasum -a 256 -c
```

## Laptop notes

- `chain.laptop.zsh` ran the steps in order: `a.laptop.zsh` with `SINGLES=1`, `b.zsh`, `c.zsh`, `d.zsh`, then `pack.zsh --no-push`. The commit and push were made by hand.
- `a.laptop.zsh` is a copy of `a.zsh` with one fix, shown in `laptop-fixes.diff`. While 1Password was locked, SSH to GitHub hung, so the copy puts a 60-second `timeout` on the SSH fetch. Its HTTPS fallback also clears the inherited credential helper before using the gh one. The SSH fetch timed out and the fallback fetched the branch. `b.zsh`, `c.zsh`, `d.zsh` and `pack.zsh` ran unmodified.
- `expected-sets.tsv`: a.zsh compares only the id and bans columns, and those matched. Three labels differ in wording. `right-turns`, `all-turns-access` and `through-streets` read "outside streets" in the binary's output, where the tsv reads "streets outside the area".
- Times in Pacific Standard Time:
  - A: 1:03:36 to 1:12:52 AM.
  - B: to 1:48:38 AM, with a search of 2,146 s.
  - C: to 2:00:06 AM.
  - D and the pack: to 2:00:07 AM.
