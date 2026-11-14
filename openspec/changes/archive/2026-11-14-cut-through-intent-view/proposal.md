## Why

The owner asked: "Can you add a way to show modeled cut through intent for the main reasons (we hypothesize) cars are cutting through the Trapezoid?" The round 21 intent map answers this in a calibration report. Residents and the owner need it in the app, live, for baseline and scenario.

## What changes

- The area config gains `throughIntents`: an ordered list of named reasons (label, origin and destination groups, the arterial avoided, a basis of observed or assumed, a note).
- The demand build tags each car flow with the index of the first reason whose groups hold its ends. Volumes do not change.
- The simulator tallies through cars per reason, once per car at the moment the through count counts it, and the links those cars used.
- The Results panel gets a "Why cars cut through" table and a map highlight of a chosen reason's typical path. The Sources page lists the reasons.

## Impact

Demand file gains `intents` and per-flow `intent`; its hash changes, volumes do not. Simulator JSON gains additive fields.
