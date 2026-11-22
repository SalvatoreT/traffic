## ADDED Requirements

### Requirement: Circle entries yield by critical headway
At a traffic circle modeled as one node, a vehicle entering from an approach SHALL yield to each circulating vehicle whose path passes its entry for a window of t_c - t_f / 2 seconds that ends when that vehicle's tail has passed the entry, with t_f = 3.19 s and t_c = 5.19 s from the single-lane entry model of [Rodegerdts2007] in the Siegloch form. A circulating vehicle that will pass later than that window SHALL NOT block the entry.

#### Scenario: Entry against circulating traffic
- **WHEN** the validation suite feeds a saturated circle entry with 200, 600 and 1,000 veh/h circulating past it to a later exit
- **THEN** the entry flow lies within 0.8 to 1.2 times 1130 exp(-0.001 v_c) in each case (cases f1 to f3)

#### Scenario: Shared exit reported
- **WHEN** the circulating vehicles leave at the entering vehicles' exit instead
- **THEN** the case note reports that entry flow too, so the merge into one exit lane is visible apart from the entry rule

### Requirement: The historical junction policy keeps the old circle entry
Under the `historical` junction recovery policy a circle entry SHALL keep the earlier rule (blocked until every conflicting circulating vehicle in the node has passed).

#### Scenario: Sensitivity run on the old engine
- **WHEN** a run uses `junctionRecovery: historical`
- **THEN** circle entries behave as before round 29
