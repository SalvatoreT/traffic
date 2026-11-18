## Why

Validation cases b3, b4, b9 and l1 judge a pocketed signal approach with permissive left turns against a range built from the unsignalized gap formula of [Brilon1999] applied to the hourly opposing flow, and the range assumes left turns never hold the through lane. The simulator now uses the queue-first rule of [Fambro1991]. b4 and l1 fail against ranges that describe a different rule. b4 also asks a pocketed approach to carry more than a plain through lane: its lower bound was 918 veh/h while case b1 (one through lane, no lefts) gives 837, the same as b4 gave at seed 1. The project lead decided on 2026-11-18 (by card): re-base the ranges now, bundle the simulator fix later.

## What changes

- The range of b3, b4, b9 and l1 becomes min(permitted-left capacity over the left share, s x green share over the through share), with `permitted_left_cap` and the parameter band of p1 to p3. The case source becomes [Fambro1991].
- b4 and l1 report the mean of seeds 1 to 10 (seed 1 alone swings about 5% over 12 cycles).
- The 0.8 lower factor and the assumption that the 3-vehicle class-rule pocket does not push capacity below the band are labeled ASSUMPTION in code, case notes and report text, with a plain statement that the band is wide and would also have passed the earlier left-turn rule.
- `cases.json` bounds, `validation.md` and `validation.json` are regenerated. b4 and l1 leave the deviation list because they now pass. Nothing is marked reviewed.
- No simulator behavior change: fingerprint d45a275dd7be0713cec6a64394b7d8a9 before and after.

## Capabilities

### New Capabilities

### Modified Capabilities

- `traffic-simulation`: expected range of the pocketed permissive-left validation cases.
