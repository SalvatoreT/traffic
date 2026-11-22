# Evidence for calibration round 55

The laptop run's evidence (reports, logs, assessments, the keep-rule output, `laptop-fixes.diff`) is not stored on `main`. It lives on the development branch `salvatoret/peaceful-fermi-dlwt0u`, commit 73e8d5d, under `openspec/changes/calibration-round-55/evidence/laptop-run/`: 132 parts, 462 files, 25,076,720 bytes. Its own `README.md` lists the files and checksums. The parts never go on `main`.

The two script faults the run found (the `a.zsh` fetch and the unquoted `--ignore` patterns in `b.zsh` line 48) are fixed in `../laptop/`.
