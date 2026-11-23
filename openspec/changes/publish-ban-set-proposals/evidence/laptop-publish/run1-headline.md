# Headline table for the project lead

File: public/data/rockridge.proposals.json. Baseline 522.5 through cars an hour. 5 options, 2 references. Intervals are paired 95% over seeds 101 to 110 and cover seed variability only. Through cars an hour, not all cars.

| Option | Interventions | Count | Bans | Closures | Through cars an hour, mean of periods and seeds | By period (through cars an hour) | Worst block, all traffic | Worst block, through cars | Residents, per requested trip | Best for |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| p1 | Traffic circle at 60th Street & Colby Street; One-way northbound on Colby Street between North Street and Alcatraz Avenue ; One-way eastboun | 6 | 41 | 0 | 522.5 to 80.4 (-84.6%; interval -461.8 to -422.5 cars/h) | pm 794 to 160 (-79.8%); am 387 to 42 (-89.0%); midday 387 to 38 (-90.1%) | 57th Street between Vicente Street and Telegraph Avenue, midday: 71 to 166 (+96) | Unnamed service road off Telegraph Avenue (cul-de-sac end): +0.4 (-0.9 to 1.7) | +27.4 s (25.3 to 29.4) | most-removed, no-closures |
| p2 | Modal filter on Forest Street at Ayala Avenue; No turns from the bounding streets and streets outside the area onto side streets  | 2 | 41 | 1 | 522.5 to 142.4 (-72.7%; interval -400.5 to -359.6 cars/h) | pm 794 to 266 (-66.5%); am 387 to 82 (-78.8%); midday 387 to 80 (-79.4%) | 57th Street between Vicente Street and Telegraph Avenue, midday: 71 to 157 (+86) | Unnamed service road off Telegraph Avenue (cul-de-sac end): +0.6 (-1.3 to 2.5) | +25.4 s (23.9 to 26.9) | fewest-changes |
| p3 | Modal filter at 63rd Street & Colby Street; Diagonal diverter at 60th Street & Colby Street; Diagonal diverter at 63rd Street & Hillegass Av | 6 | 0 | 5 | 522.5 to 173.6 (-66.8%; interval -371.6 to -326.1 cars/h) | pm 794 to 290 (-63.5%); am 387 to 116 (-69.9%); midday 387 to 115 (-70.4%) | McAuley Street between Colby Street and Ayala Avenue, pm_peak: 40 to 143 (+104) | North Street between Colby Street and Dana Street: +26.3 (22.4 to 30.2) | +14.2 s (11.8 to 16.7) | no-turn-bans |
| p4 | Modal filter at 63rd Street & Colby Street; Modal filter on 63rd Street at Hillegass Avenue; Modal filter at 62nd Street & Hillegass Avenue; | 6 | 0 | 4 | 522.5 to 266.8 (-48.9%; interval -279.2 to -232.3 cars/h) | pm 794 to 441 (-44.4%); am 387 to 190 (-51.0%); midday 387 to 169 (-56.2%) | North Street between Colby Street and Dana Street, pm_peak: 11 to 80 (+69) | North Street between Colby Street and Dana Street: +40.2 (37.8 to 42.5) | +3.4 s (1.4 to 5.4) | least-detour |
| p5 | No left turns from the bounding streets onto side streets  | 1 | 21 | 0 | 522.5 to 313.8 (-39.9%; interval -228.6 to -188.8 cars/h) | pm 794 to 494 (-37.8%); am 387 to 215 (-44.4%); midday 387 to 232 (-39.9%) | 57th Street between Vicente Street and Telegraph Avenue, pm_peak: 93 to 123 (+30) | North Street between Colby Street and Dana Street: +2.8 (1.6 to 4.0) | +8.1 s (6.4 to 9.9) | - |

## Checks

- PASS: file version 5: version 5
- PASS: option count: 5 options (a list holds up to 6 plus the references)
- PASS: group unconstrained: network hash: 53c823f20d9165ed (expected 53c823f20d9165ed)
- PASS: group unconstrained: demand hash: 2d16d8f8eb0950ca (expected 2d16d8f8eb0950ca)
- PASS: group unconstrained: simulator fingerprint: 6b886c8f52ee07397773ddd0ebbcb447 (expected 6b886c8f52ee07397773ddd0ebbcb447)
- PASS: group unconstrained: reporting method: paired-t-3
- PASS: group unconstrained: confirmation seeds: [101,102,103,104,105,106,107,108,109,110]
- PASS: group unconstrained: no-turn-bans objective listed: most-removed, no-closures, least-detour, fewest-changes, no-turn-bans
- PASS: p1: no rejection: none
- PASS: p1: confirmed on the fresh seeds: confirmation
- PASS: p1: resident detour recorded: 27.4
- PASS: p1: a picture for the card: yes
- PASS: p2: no rejection: none
- PASS: p2: confirmed on the fresh seeds: confirmation
- PASS: p2: resident detour recorded: 25.4
- PASS: p2: a picture for the card: yes
- PASS: p3: no rejection: none
- PASS: p3: confirmed on the fresh seeds: confirmation
- PASS: p3: resident detour recorded: 14.2
- PASS: p3: a picture for the card: yes
- PASS: p4: no rejection: none
- PASS: p4: confirmed on the fresh seeds: confirmation
- PASS: p4: resident detour recorded: 3.4
- PASS: p4: a picture for the card: yes
- PASS: p5: no rejection: none
- PASS: p5: confirmed on the fresh seeds: confirmation
- PASS: p5: resident detour recorded: 8.1
- PASS: p5: a picture for the card: yes
- PASS: exactly one option carries the no-turn-bans tag: p3
- PASS: the no-turn-bans option holds no turn ban: 0 bans
- FAIL: the no-turn-bans option equals the old p1's interventions: p3: 6 interventions, 5 closures
- FAIL: the no-turn-bans option reproduces 135.7 through cars an hour within 1: 173.6 (published 135.7)
- PASS: no duplicate: each link appears once: 5 options
- PASS: left turns alone (21 bans) is in the list: kept as p5: 313.8 through cars an hour

RESULT: 2 check(s) failed.
