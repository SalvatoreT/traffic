## Context

The Rockridge audit used the volunteer route diagrams, the Oakland intersection counts and paired runs of the simulator. Calibration rounds 39–42 also used a range inferred from a block count to fit unique drivers anywhere on a street. A driver who uses one block can count in that total without driving the whole street. This change supersedes round 39’s inferred corridor range as a fitting and acceptance rule.

## Goals / Non-Goals

Align modeled events with observations. Make missing evidence visible. Keep the frozen validation split and retain the records from earlier calibration rounds.

## Decisions

1. A traffic count carries its direction, detector location and source into scoring. An intersection departure, an intersection arrival, a midblock estimate, any use of a corridor and driving its entire length are separate events. Use the project's existing GEH criterion for a directly comparable count [WebTAG-M3.1]. The median block count cannot bound the number of unique drivers who use any block.
2. Apply the frozen observation split before deriving trip ends and priors. Use intersections of events on the same sampled path for ramp shares, and reroute the demand that the fit actually returns. A share measured on earlier volumes can change when queues make a different route attractive.
3. Count crosswalk traversals along the pedestrian route. Record unroutable demand and compare planned crossings with simulated crossings at the count location. A walker may use zero, one or two crosswalks during a visit to an intersection.
4. For a node-only local car trip, use a legal baseline route to select its curb blocks. The request's random draw locates it on those blocks across scenarios. For the detour metric, a completed request contributes its actual time and any request still unserved contributes time to the common cutoff. Report how many completed. This measures delay within the run.
5. Charge a turn on the link approaching it and charge the terminal link once. Preserve a marked left lane when a junction changes control [OSMTurnLanes]. Allocate generic green floors before distributing spare cycle time [Webster1958]. Keep observed timings, including verified short greens.
6. Test access in each requested period, against access in the same baseline period. Keep the confirmation shortlist frozen and retain failures when ranking options.
7. A study owns its immutable network and demand. Search workers share only the baseline's measured link and turning times for the same period and seed. Each package constructs its own drivers, random state, queues, signal plans and settling run.

## Data and verification

The demand builder and simulator produce new fingerprints and reports. Calibration verdicts and confirmed proposal rankings require runs on those inputs. The earlier assessment remains the record for its original inputs.

A four-evaluation Rockridge search check on the previously published inputs used one worker and PM seed 1. It ran a five-minute full window and a two-minute screen. Sharing baseline costs reduced the probes from four to one. Process CPU time fell from 41.44 to 32.72 seconds. Elapsed time was 66.81 seconds with fresh probes and 68.37 seconds with reuse on the shared machine. The full evaluation outputs matched byte for byte, including link arrays and select-link records.

The rebuilt Rockridge shipped demand has SHA-256 prefix `e4f199391682`, and the training demand has `e480933c18b9`. Both kept the frozen split and reproduced 150.49 planned crossings per hour at Telegraph and Alcatraz against 150.5 observed. In five-minute PM runs on seed 1, the shipped simulator counted 13 crossings and the training simulator counted 11. Each run's OD records reproduced all 248 link stations, all 103 movement and route stations, and the four directional whole-street rows. These short checks establish which events the instruments count. Calibration of the baseline and ranking of proposals require separate multi-seed runs.

The native and browser builds agreed on the rebuilt PM demand for 300 seconds on seed 1, including request traces and link statistics. Of the 74 primitive cases, the same 12 as in the prior validation ran outside their reference ranges. Five still lack a reviewed exception.
