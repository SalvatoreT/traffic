# Round 53 evidence (laptop run, 2026-11-21)

The laptop ran the runbook from 1:24 to 3:11 PM PST on the development branch at `2fdd5f7`, simulator fingerprint `6b886c8f52ee07397773ddd0ebbcb447`. The candidate failed one line of the keep rule on seeds 1 to 10. So, as the runbook says, the fresh-seed confirmation (step G) and the proposal search did not run, and the published model was restored. Nothing was published, and the laptop made no `/api/` request and used no upload token.

## Result

- **Gate (step B).** `npm run data` (1,024 s) rebuilt the published model: network `53c823f20d9165ed`, demand `2d16d8f8eb0950ca`, cross-validation demand `1c3b1666f24156f1`, config `2405ff02c92b2837`. Nothing under `data/` changed.
- **Baseline screen (step C).** PM 82 of 92 fitted and 12 of 24 held out, AM 72 of 77 and 14 of 19. No car was cleared from gridlock in the judged zone. Backlog was under 2% in 3 of 3 seeds in both periods (AM mean 0.43%, max 0.64%; PM mean 1.13%, max 1.37%).
- **Loop (step D).** `apply-candidate.py end-along` gave config `19b6d2c3957f4f56`, and the dry-run counts match the runbook. The loop took 3,969 s and exited 0 after passes 0, 1 and 2 and the final build. Neither the abort nor the early stop fired. The one warning is the report-only one: in the final shipped PM build, offered car demand is 10.1% below the static fit. Candidate hashes: network `53c823f20d9165ed` (identical), demand `a009d7bb4722a7c9`, cross-validation demand `afbe8635af49dc7f`, membership shipped `87b61668bfa7781d` and training `196188c75964afa8`. All four end-along lines read `simulated` in both periods from pass 1. The training view left out all four end-along targets, because each run holds a held-out block (`fit/rockridge.fit.cv.md`).
- **Screen (step E).** Passed: PM 81 of 92 and 12 of 24, AM 72 of 77 and 14 of 19, no gridlock clearances, backlog 3 of 3 in both periods (AM mean 0.30%, PM mean 1.22%).
- **Keep rule (step F).** Fails on one line (`keep-rule.md`). D5 headline shares: 3 of 4 within 10 points, mean error 6.2 (baseline 4 of 4, 3.8). Hillegass Avenue SB to the freeway is 53.5% against 68% observed (baseline 60.0%). The other seven lines hold, and validation is 67 of 74.
- **Improvement test, seeds 1 to 10 only.** PM Colby Street SB whole street went from 74.5 to 62.6 cars an hour (observed 39), a fall of 11.9 against the 15 required. Seeds 11 to 20 did not run.
- **Restore (step I).** The published membership files are back (`56e688e7e5749d23`, `cf32e3e0d9e6f23e`), and the rebuild was verified: demand `2d16d8f8eb0950ca`, cross-validation demand `1c3b1666f24156f1`, config `2405ff02c92b2837`.

## Why the share fell

Seeding added trips that end along the southbound streets: in PM, 38.8 cars an hour on Hillegass Avenue SB and 46.0 on Colby Street SB. In the simulation these trips end along the street (PM Colby Street SB 0.0 to 56.7 against a target of 43; Hillegass Avenue SB 3.3 to 41.4 against 40). By design, none of them reach the freeway. On the Hillegass Avenue SB block the trips grew from 197.1 to 219.9, while those that went on to the freeway stayed at 118, so the to-freeway share dropped from 60.0% to 53.5% (`shares-pm.md`). Colby Street SB to the freeway fell the same way, from 42.8% to 37.7%, which is still inside its 10 points.

## Notes and deviations

- This morning's restamp loop folder moved to `target/restamp52-loop`, because `target/r52-loop` already holds round 52's loop.
- `pass0-check.txt` reads `false` for pass 0 against `demand.base*.json`. The runbook's comparison comes from round 52, when the baseline was a static build. Here the baseline is the published simulated-membership model, so pass 0 cannot equal it. Pass 0 does equal the restamp's pass 0, the static build of the committed config, in both views (`JSON.stringify(periods)` identical). The final training demand's periods equal the published cross-validation demand's. Only the `build` stamp differs, which carries the config hash.
- The baseline per-seed directories on the laptop are `target/assess-seeds/60` and `60-cv`, from the restamp's `assess --publish`.

## Files

- `keep-rule.md`, `rockridge.assessment-r53.md`, `assess-r53.txt`, `validate-r53.txt`: step F.
- `screen-base.json`, `rockridge.assessment-r53-base-screen.md`, `screen-base.txt`; `screen-r53.json`, `rockridge.assessment-r53-screen.md`, `screen-r53.txt`, `decision-r53.txt`: steps C and E.
- `dry-run.txt`, `loop.txt`, `membership-loop.md`, `state.json`, `baseline-hashes.txt`, `candidate-hashes.txt`, `pass0-check.txt`, `fit/` (final fit reports and stations file), `build-logs/` (last 40 lines of each build), `node-prior-csv/` (ceiling stations of the final builds): step D.
- `seeding.md`, `end-along-fit-*.md`, `route-fit-*.md`, `node-ends-*.md`, `node-ends-cv-*.md`: the fit's own figures per build.
- `route-sim-*.md`, `end-along-sim-*.md`, `shares-pm.md`, `colby-sb-shares.md`: ten-seed simulated figures, baseline against candidate.
- `reported/`: the round 52 step F lists (`compare.md`: station lines, diagonal stations, Colby Street NB blocks, SR-24 ramps, flips, through cars, mainline gates; `gates-*.md`; `gate-totals.txt`; `nodes-shipped.md`, `nodes-training.md`; `backlog.md`; `tt.md`).
- `laptop/`: the chain script, its log and the helper scripts.
