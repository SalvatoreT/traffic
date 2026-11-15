/**
 * Sentences the pages say once, kept here so the generated text pages (tools/build-llms.ts) read the same words as the app.
 * `src/lib/copy.test.ts` checks that each one still appears in the component that shows it.
 */

export const PROPOSALS_LEAD = "These are packages of changes found by searching the simulation for the most through traffic removed from the area's side streets with the least traffic added to any one of them. The cards compare through cars with through cars: the first figure is all the side streets together, the second is the one block with the largest increase. Every figure is a mean over the runs named on its card, with a 95% interval over those runs when the file records one. The search itself penalizes the largest rise in all traffic (through cars and local trips together) on any one block past an assumed noise band, because residents experience all the cars on their street. That block can differ from the one with the largest increase; both are in More detail on each card.";

export const STREETS_INTRO = "A text alternative to the map: one row per street block (both directions combined), limited to the study area and the streets around it that the map shows. Each count is cars an hour on that one block, both directions: all cars (local trips included) and, separately, only the through cars among them, which cross the area without a trip that starts or ends in it. Through cars are always part of all cars, never added to them. Speed in mph, flow-weighted.";

export const ASSUMPTIONS_INTRO = "These are the judgment calls in the model: the parts that rest on reasoning and not on a count. They are the first things to question, and changing any of them would change the results.";

export const MOVEMENTS_INTRO = "A turn counts as an assumed movement when the volunteer count shows cars making it and the model's routing alone did not send enough cars that way. The counts show cars making each turn listed here. To match them, the model assigns trips to each turn, up to the counted volume. When a change blocks a turn, those trips try the same kind of turn on a parallel street, then their ordinary route.";

export const FIXED_DEMAND_CAVEAT = "Trip demand is fixed in this version: the same trips are made before and after every change, so these results are conditional simulations of those trips, not forecasts. Real schemes can also remove some traffic, and this calculation has no behavioral demand response. For context only, a meta-analysis of monitoring counts at London low-traffic neighborhoods found traffic inside the schemes fell by about 47% on average while boundary roads were on average roughly unchanged, with wide variation between schemes [Thomas2024]. Those are counts of all traffic at monitoring locations in London; this app counts distinct through cars on study-area side streets, so the figures are not comparable, and a result here that differs from that average does not show the model is right or wrong.";

export const EXPLORATORY_NOTE = "The baseline these were computed on is not calibrated against observed traffic yet, so read the figures as relative comparisons, not forecasts.";

export const LEGACY_GROUP_NOTE = "These options were computed before the figures were made like-for-like (through cars beside through cars), so they are not shown. They need to be computed again.";

export const SOURCES_CALIBRATED = 'The baseline meets the calibration rules against observed traffic, with the limits below.';
export const SOURCES_UNCALIBRATED = 'The baseline is not yet calibrated against observed traffic, so treat results as illustrations and compare scenarios rather than reading absolute numbers.';
