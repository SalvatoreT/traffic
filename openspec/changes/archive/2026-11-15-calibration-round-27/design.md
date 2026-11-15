## Decisions

**Colby St northbound through cars: no change.** The intent rows of the PM seeds put the drop from 152 to 140 in the freeway-origin cars (off-ramp to the hills pair 7.5 to 0.2 veh/h). That agrees with the two-stage `via`, which fixes the ramp and then the turn. The AM fill and the natural-flow cut do not act on this figure. The change cannot be isolated from the other simulator fixes, so the record says what the tally supports and no more. The assumed volumes were not touched and stay within the counted movements.

**PM held-out failures: no change to the hold-out.** Four of the five failing stations are Caltrans counts at the edge of the model (three gate-side link counts and one ramp); the fit without them has no other count for those links. Keeping them in the fit would raise the pass rate by construction. The rule is judged out of sample on purpose, so the model and the hold-out are left as they are and the evidence is reported. The status is whatever the rule gives: `uncalibrated`.

**Failing stations in the report.** The assessment prints each recent held-out station that fails out of sample next to its result on the shipped demand. Without that table a reader sees 17 of 22 and cannot tell a model fault from a missing observation.
