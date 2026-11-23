# Evidence

The archive of the laptop run (2026-11-22, about 1:03 to 2:00 AM Pacific, simulator 6b886c8f52ee07397773ddd0ebbcb447, scripts from `d13b44e`) is not on `main`. It is on the laptop dev branch (the one named in `openspec/changes/archive/2026-11-22-perimeter-turn-bans/evidence/README.md`) at commit `2aa765f`, under `openspec/changes/turn-ban-set-candidates/evidence/laptop-run/`: gzip parts of one tar archive, `FILES.txt`, `SHA256SUMS`, the wrapper `chain.laptop.zsh`, `laptop-fixes.diff` and a README with the unpack and checksum commands. The first experiment of this line of work, the perimeter packages, is at `bd267ca` on the same branch.

Start with `target/ban-sets/chain.log` and `target/ban-sets/summary.md` in the archive. The figures in the design's Outcome section and in `data/proposals/README.md` come from `target/ban-sets/summary.md` and `target/ban-sets/report.md`; the search's options are in `target/ban-sets/proposals.json`.

Nothing from the archive is copied here, and nothing was published or pushed to the data bucket.
