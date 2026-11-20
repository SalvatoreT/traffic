# Round 51 fresh-seed confirmation

The lead asked on 2026-11-19 for a check on independent seeds, because three of round 51's keep-rule lines sat at or near their limits.

**The rule** was written before the run. On seeds 11 to 20, the candidate must be no worse than the baseline on every keep-rule line, with both computed on the same seeds. The lines are:

- PM fitted
- PM held out
- AM fitted
- AM held out
- D5 headline shares within 10 points (4 of 4)
- whole-street traversals (8 of 8)
- D16 in every period

The rule confirms the keep rule on fresh seeds; it does not replace it, and nothing in it is loosened.

## Runs

Both runs used `tools/assess.ts` in verdict mode for a non-published set: `--suffix` with no `--diagnostic`, `--publish` or `--noise`. Each covered seeds 11 to 20 in all three periods with `--jobs 12`.

- **Baseline:** `--suffix r51-confirm-base`.
  - Config `505dd0f032fc7ae8`, network `53c823f20d9165ed`.
  - Demand `9cdebdabf05c4460`, cross-validation demand `2f9ae152b9bbf78e`.
  - Ran 8:30 to 8:32 PM PST, exit 0.
- **Candidate:** `--suffix r51-confirm`.
  - Config `1080597767aac58c`.
  - Demand `5d6be8a70618e905`, cross-validation demand `7164fa2ab08f612a`.
  - Membership `74a88c864d406903` and `7d0fdb063236304d`.
  - Stations file identical to the baseline's.
  - Ran 8:32 to 8:35 PM PST, exit 0.
- **Simulator:** fingerprint `d45a275dd7be0713cec6a64394b7d8a9`, code at `90e655b`.
- **Seed reports:** `target/assess-seeds/60r51-confirm-base(-cv)` and `60r51-confirm(-cv)` on the laptop.
- **Restore:** finished at 8:44 PM PST, exit 0. Afterwards the hashes were `53c823f20d9165ed 9cdebdabf05c4460 2f9ae152b9bbf78e`, the config was `505dd0f032fc7ae8`, and the status was clean.

## Result

The confirmation does not hold. On seeds 11 to 20 the candidate passes 7 of 8 whole-street traversals and the baseline passes 8 of 8. The failing street is Colby Street southbound in the PM peak: 78 cars an hour simulated (standard error 4.4) against 39 counted, GEH 5.0, which the report marks as failing. On seeds 1 to 10 the same line was 75 against 39, GEH 4.8. Every other line is no worse for the candidate than for the baseline. Some are also below their keep-rule line on these seeds for the baseline itself: PM held out 13 and AM held out 13.

`confirm.md` holds the four columns side by side: baseline and candidate on seeds 1 to 10 and on seeds 11 to 20. It also has the watched lines: PM Colby Street southbound whole street, Hillegass Avenue southbound to-freeway share with its interval, and backlog and gridlock clearances by period. `confirm.cjs` reads them from the four assessment reports.

## Files

- `rockridge.assessment-r51-confirm-base.md` and `rockridge.assessment-r51-confirm.md`: the two assessment reports.
- `assess-base.txt` and `assess-cand.txt`: the tool output.
- `run.zsh`, `chain.log.txt`: the run script and its log.
