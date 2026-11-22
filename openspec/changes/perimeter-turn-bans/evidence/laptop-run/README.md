# Perimeter turn bans: evidence of the laptop run

Made by `openspec/changes/perimeter-turn-bans/laptop` on 2026-11-22, simulator 6b886c8f52ee07397773ddd0ebbcb447, from `7c2c522`. Nothing here replaces a published file, and nothing was pushed to the data bucket.

- `tb-run.tar.gz.part-*`: one tar archive (ustar, paths relative to the repository root), compressed with `gzip -9 -n` and split with `split -b 190000`.
- `FILES.txt`: every file with its size and SHA-256. `SHA256SUMS`: every file, the reassembled archive and every part.
- Start with `target/tb/chain.log`, `target/tb/summary.md` and `target/turn-bans/packages.md` in the archive.

Unpack into an empty folder, never over the published files, and check:

```bash
D=openspec/changes/perimeter-turn-bans/evidence/laptop-run
mkdir -p /tmp/tb-run && cat ${D}/tb-run.tar.gz.part-* | tar -xzf - -C /tmp/tb-run
awk -F'	' '{print $3"  /tmp/tb-run/"$1}' ${D}/FILES.txt | shasum -a 256 -c
```

## Laptop notes

The laptop ran the branch's scripts unmodified. `chain.laptop.zsh` is the wrapper that ran them in order: a.zsh, b.zsh, d.zsh on B's output, c.zsh with DEPTH=6, d.zsh again, and pack.zsh with `--no-push`. The second d.zsh run overwrote B's `summary.md`, which differs only in its search section. The commit and push were made by hand. Times are in Pacific Standard Time:

- A: 11:03:00 PM to 11:09:28 PM.
- B: until 11:37:53 PM.
- C: until 12:26:17 AM, with a search of 2,903 s.
