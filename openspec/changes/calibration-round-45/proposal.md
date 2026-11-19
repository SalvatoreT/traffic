## Why

Round 44 left an open item on the diagonal that carries the PM held-out misses. A trace of McAuley St and 60th St eastbound found that 83% of their through cars take Telegraph Ave, McAuley St or 60th St, Ayala Ave or Howell St, Forest St, Claremont Ave. Forest St eastbound ends at the signal at Claremont Ave / Colby St / Forest St. The volunteer count timed only the Colby St approach (79 s cycle, 4 s green). The simulator gives Forest St about 35 to 38 s of that cycle from its flow-based split, and nothing observed supports that value. In a two-seed probe a 10 s Forest St green cut Forest St eastbound from 448 to 142 and McAuley St eastbound from 158 to 94. Round 40 had also tried 4 s (its S-c) and rejected it: fitted stations rose to 80, but cars moved to Hillegass Ave and Colby St and two freeway shares fell out of their ten points.

On 2026-11-18 the project lead decided to trial a shorter Forest St green as a labeled assumption, as a calibration round, and to keep a candidate only under the keep rule of rounds 43 and 44.

## What changes

- Three candidate Forest St eastbound greens, 25 s, 18 s and 12 s of the 79 s cycle in the AM and PM peaks, each entered as a `signalObservations` entry that states it is an ASSUMPTION. The simulator gives the rest of the cycle to Claremont Ave. Midday is left as it is.
- No code changes. The area config already carries an observed green per approach (`signalObservations`, with `heading` to pick one side of a street), the importer already writes it to the network, and the simulator already holds an observed green fixed and splits the rest by flow. The candidates are data fragments applied to the config by a script on the laptop. The shipped config is not edited in this change.
- A runbook for the user's laptop session: build network and demand for each candidate, a cheap three-seed screen, and the full ten-seed assessment for the candidates that pass the screen.

## Impact

Data only. The simulator fingerprint stays d45a275dd7be0713cec6a64394b7d8a9. A candidate changes one node of the network (the signal timing at Claremont Ave / Colby St / Forest St), so the network hash changes and no link id moves, and the frozen split stands. If a candidate is adopted, the published proposals, results and redistribution files were computed on the old network and need a new search. If every candidate fails, nothing published changes.
