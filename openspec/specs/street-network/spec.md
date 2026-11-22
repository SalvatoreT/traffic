# street-network Specification

## Purpose
How a study area's street network is imported from OpenStreetMap and what the network file contains.

## Requirements

### Requirement: Import from OpenStreetMap
The system SHALL generate a study area's network file from an OpenStreetMap extract and a study-area polygon, with no area-specific code, following the Network contract (version 1).

#### Scenario: Rockridge import
- **WHEN** the importer runs on the Rockridge extract
- **THEN** it writes a network whose drivable links are directed, connected, and carry class, lanes, speed limit, length and geometry

#### Scenario: Missing tags
- **WHEN** an OSM way lacks `lanes` or `maxspeed`
- **THEN** the importer applies documented per-class defaults (25 mph on residential streets per California prima facie limits)

### Requirement: Intersection control from map data
The importer SHALL derive each node's control type from OSM signal, stop-sign and mini-roundabout tags, and mark which approaches face a stop sign. The area config MAY list stop exemptions (`stopExemptions`), each naming a junction node, a way and a direction of travel along the way's node order, with a source; the importer SHALL clear the stop on that approach and keep the stops of the other approaches. An exemption that matches no stopped approach, or that names a junction tagged `stop=all`, SHALL change nothing and SHALL be reported by the importer.

#### Scenario: Stop signs on the minor street only
- **WHEN** only some approaches to an intersection have stop signs
- **THEN** the node is `two_way_stop` and only those approach links have `stopAtEnd`

#### Scenario: One approach exempted at a junction tagged on its node
- **WHEN** the map tags `highway=stop` on the node where two through ways cross and the area config exempts one approach
- **THEN** the node is `two_way_stop`, the exempted approach link has no `stopAtEnd` and the other three keep it

#### Scenario: Exemption that cannot apply
- **WHEN** an exemption names an approach that does not stop, a way that does not reach the node, or a junction tagged `stop=all`
- **THEN** the network is unchanged and the importer lists the exemption as not applied

### Requirement: Gates and study area
The importer SHALL mark nodes where drivable links cross the model boundary as gates and flag nodes and links inside the study-area polygon.

#### Scenario: Arterial leaving the model
- **WHEN** Telegraph Ave continues beyond the model bounding box
- **THEN** its last node inside the box is a gate

### Requirement: Existing traffic calming
The importer SHALL carry existing speed humps and bumps onto links as positions along the link.

#### Scenario: Mapped hump
- **WHEN** OSM has a `traffic_calming=hump` node on a way
- **THEN** the corresponding links list a hump at that distance from their start

### Requirement: Attributes for walking and biking
The importer SHALL record, from OpenStreetMap, which links have bike lanes or are bike routes, which have sidewalks, where marked crossings are, and SHALL keep these as optional fields so existing files remain valid.

#### Scenario: Street with a bike lane
- **WHEN** OpenStreetMap tags a street with a bike lane in one direction
- **THEN** the link in that direction is flagged as having a bike lane

#### Scenario: Marked crossing
- **WHEN** OpenStreetMap has a marked crossing on a street between intersections
- **THEN** the link lists a crossing at that distance from its start

### Requirement: Roundabout rings collapse to one node
The importer SHALL represent a roundabout or traffic circle mapped as a ring of ways as a single `traffic_circle` node.

#### Scenario: Ring in the extract
- **WHEN** OSM maps a traffic circle as a closed ring with four arms
- **THEN** the network has one traffic-circle node with four approaches

### Requirement: Gate direction flags
The importer SHALL record for each gate whether trips can enter and whether they can leave through it.

#### Scenario: One-way exit
- **WHEN** a gate lies on a one-way street leaving the model
- **THEN** it is flagged as exit-only

### Requirement: Junction joining
The importer SHALL join graph nodes that form one real intersection into a single node at their centroid when they lie within `junctionJoinRadius` (default 20 m), or within `signalJoinRadius` (default 40 m) for a cluster of two or more signals, are connected by short non-freeway links, and share a street name or are both signals.

#### Scenario: Offset signalized crossing
- **WHEN** two signal-tagged nodes 10 m apart on one street carry the north and south legs of one crossing
- **THEN** the network has one signal node with four approaches and no link between the former nodes

#### Scenario: Offset signals on a wide junction
- **WHEN** two signal nodes 33 m apart are joined by two-way links and carry the two halves of one junction
- **THEN** the network has one signal node

#### Scenario: Signals at the extract edge
- **WHEN** a signal pair lies within the former 60 m edge margin but neither node is a gate
- **THEN** it is joined like any other pair

#### Scenario: One-way chain of signals
- **WHEN** two signals are joined only by a one-way link
- **THEN** they stay separate nodes

#### Scenario: Distinct intersections on a longer block
- **WHEN** two intersections are more than the join radius apart
- **THEN** they stay separate nodes

#### Scenario: Control and approaches of a joined node
- **WHEN** a cluster is joined
- **THEN** the node is a signal if any member is a signal and an all-way stop only if every remaining approach has a stop, the internal links are dropped, and the remaining approaches keep their stop flags, humps and gates

#### Scenario: No new movements
- **WHEN** the members of a cluster are not strongly connected by their internal links, or the cluster contains a freeway link, a gate or a traffic circle
- **THEN** those members are not joined

### Requirement: Turn restrictions
The importer SHALL turn OSM `restriction` relations with one `via` node into banned motor-vehicle movements in the network (`turnBans`: link into the junction, link out of it), and the simulator SHALL not route cars through them. A time-conditional restriction SHALL apply only in the demand periods whose hours it overlaps, as given by `periodWindows` in the area config.

#### Scenario: No left turn
- **WHEN** an OSM relation bans the left turn from one way onto another at a junction
- **THEN** the network has a ban from the link of the first way into the junction to the link of the second way out of it

#### Scenario: Peak-hour ban
- **WHEN** a relation carries `restriction:conditional=no_left_turn @ (Mo-Fr 16:00-18:00)`
- **THEN** the ban applies in the `pm_peak` period and not in `am_peak` or `midday`

#### Scenario: Only a straight movement
- **WHEN** a relation says `only_straight_on`
- **THEN** every other movement from that link at the junction is banned except the U-turn

#### Scenario: Unsupported relation
- **WHEN** a relation has a `via` way, several `via` members or exempts motor cars
- **THEN** it is skipped and counted

### Requirement: Marked left-turn lanes
The importer SHALL record, for the end of each link, the number of lanes that OSM `turn:lanes` marks as left-turn only, and the simulator SHALL build the left-turn pocket from one of those lanes instead of adding a lane.

#### Scenario: Tagged left lane
- **WHEN** a signalized approach has `lanes=3` and `turn:lanes=left|through|through;right`
- **THEN** the link has three lanes in total, one of them the left pocket

### Requirement: Study area from boundary streets
The importer SHALL derive the study-area polygon from an ordered list of boundary streets, following each street's way geometry between the crossings with its neighbors in the list, and SHALL treat links lying on a boundary street as inside the study area, except motorway-class links.

#### Scenario: Freeway edge
- **WHEN** a boundary street is a dual-carriageway freeway
- **THEN** the polygon edge follows the carriageway nearest the area and no vertex lies beyond it

### Requirement: Gates sit mid-block
The importer SHALL warn about every gate that lies within `gateSignalWarnM` (default 60 m) of a signalized junction, so that the model-area edges can be chosen where corridors leave the model mid-block, and the Rockridge model area SHALL have at most 3% of its gates on that list.

#### Scenario: Gate next to a signal
- **WHEN** a gate lies 22 m from a signalized junction
- **THEN** the importer prints the gate, its street and the distance, and the network statistics list it

#### Scenario: Edge through a junction
- **WHEN** the model-area edge would cut a signalized junction or leave a gate inside one
- **THEN** the area configuration moves the edge, and the area README gives the candidate edges that were compared

### Requirement: Freeway-edge stubs are one gate
Mainline gates of one freeway direction that lie within `freewayGateMergeM` (default 80 m) of each other, with similar bearings and only freeway-class links, SHALL be merged into one gate at their centroid, and parallel stub links between the same two nodes SHALL become one link with the lanes added. The importer SHALL list each merge.

#### Scenario: A carriageway cut into two stubs
- **WHEN** one freeway carriageway forks just inside the model edge and both branches leave through the edge 26 m apart
- **THEN** the network has one exit gate with both branches ending in it, and an on-ramp onto either branch reaches it

### Requirement: Every ramp reaches the mainline
The importer SHALL check that every on-ramp reaches a mainline exit gate and every off-ramp is reachable from a mainline entry gate over freeway-class links, and SHALL warn and list each ramp that fails. A freeway-class link between two surface nodes is a connector and not a ramp.

#### Scenario: Rockridge
- **WHEN** the Rockridge network is imported
- **THEN** the list of violating ramps is empty

### Requirement: Staggered T-junctions of one cross street are one intersection
Two T-junctions on an undivided street SHALL be joined into one node when their side-street legs carry the same name, leave on opposite sides of the through street, and their junction points lie within `staggeredJoinRadius` (default 35 m) along it, whatever the control. The general join radius is unchanged.

#### Scenario: Same cross street, 29 m apart
- **WHEN** a street named Cross Street meets Main Street from the north at one point and from the south 29 m along it
- **THEN** the two junctions are one node with two Main Street and two Cross Street legs

#### Scenario: Different names or 60 m apart
- **WHEN** the two side streets have different names, or the same name at 60 m
- **THEN** the junctions stay separate

### Requirement: Observed signal timing from the area config
The importer SHALL attach `signalObservations` of the area config (street names that meet at the junction, the approach street, periods, cycle, green, source) to the signalized node where all the streets meet, listing the incoming links of the approach, and SHALL warn about an observation that matches no signal or approach.

#### Scenario: Colby Street at Claremont Avenue
- **WHEN** the config names Claremont Avenue, Colby Street and Forest Street with approach Colby Street
- **THEN** the node carries the timing with the incoming Colby Street link, and an unmatched observation is reported

### Requirement: An observed timing can name one side of a street and give it its own phase
A signal observation in the area config MAY carry the compass heading of the approach it is about, so that it applies to the links of the street that arrive on that heading only, and MAY mark the approach as running in a phase of its own. Observations of one signal with the same periods and cycle SHALL be written to the network as one timing with several approaches.

#### Scenario: Two sides of one street
- **WHEN** two observations name the same street at one signal with headings 80 and 260 degrees and their own greens
- **THEN** the node carries one timing whose two approaches hold the eastbound and the westbound link and their greens

### Requirement: Drive-through ways are not streets
The importer SHALL leave out service ways tagged as parking aisles, driveways or drive-through lanes [OSMService].

#### Scenario: A drive-through between two streets
- **WHEN** a way tagged `service=drive-through` connects two streets
- **THEN** the network has no link for it and no route can pass through it

### Requirement: An observation can name the approach it runs with
An observation of the area config MAY give `runsWithHeading`, the compass direction of travel of another approach of the same street at the same signal. The importer SHALL list that approach's incoming links as `runsWith` in the approach's green, and SHALL warn about an observation whose partner matches no link.

#### Scenario: Partner found
- **WHEN** two observations of one street at a signal have headings 80 and 260 and the first gives `runsWithHeading` 260
- **THEN** the first approach's green lists the links of the second as `runsWith`

#### Scenario: No partner
- **WHEN** no incoming link of the street travels in the named direction
- **THEN** the observation is reported as not applied

### Requirement: Block names at a node where no other street meets
A block's name SHALL call an end "a dead end" only when the street ends there. When no other street meets an end and the same street goes on, the end SHALL be named by the cross streets reached by following that street, without passing the block's own ends. The app and the proposal search SHALL name blocks identically.

#### Scenario: A loop around a park
- **WHEN** a street has two parallel arcs between two junctions where no other street meets, and cross streets at the far side of each
- **THEN** no block of the street is named with "a dead end", and each is named by the cross streets beyond the loop

#### Scenario: A real dead end
- **WHEN** a street ends at a node with no other link
- **THEN** that end is named "a dead end"

### Requirement: Posted speed limit on part of a way

The area config MAY specify a posted speed in mph, its source, an OSM way ID and two OSM junction IDs. The importer SHALL support ways whose surviving junctions form a linear sequence without revisits. It SHALL apply the limit to the matching links between the named ends in each direction and preserve speeds on adjacent blocks. It SHALL report and skip any correction it cannot resolve.

#### Scenario: Speed zone ends before the OSM way ends

- **WHEN** two junctions on a longer two-way OSM way delimit a 30 mph zone with an intervening junction
- **THEN** all four directed links between the ends carry 30 mph and adjacent links retain their previous limit

#### Scenario: The extent cannot be resolved

- **WHEN** a named end is missing or the matching way offers multiple paths between the ends
- **THEN** the importer reports the source entry and preserves the imported limits for that entry

#### Scenario: The way returns to a junction outside the posted zone

- **WHEN** the way passes through one surviving junction, passes through a different one, then returns to the first anywhere on the way
- **THEN** the importer reports and skips the whole correction, even if the requested stretch lies away from the repeated junction

#### Scenario: Overlapping corrections

- **WHEN** two entries claim the same link
- **THEN** the importer reports both entries and skips both corrections in full

#### Scenario: Existing area with no speed override

- **WHEN** a study area specifies no posted speed correction
- **THEN** links take their limits from the map tags or the documented street-class defaults

### Requirement: All-way stop recorded by the road authority

The importer SHALL honor a sourced area tag override identifying an all-way stop. The junction SHALL have all-way stop control and each incoming link SHALL carry a stop sign.

#### Scenario: Three approaches to an all-way stop

- **WHEN** the area config sets an all-way stop at a T-junction with three approaching streets or street segments
- **THEN** cars face a stop on each of those three approaches

### Requirement: OSM tag corrections from the area config
The importer SHALL apply `osmTagOverrides` of the area config, keyed `way/<id>` or `node/<id>`, before it builds the network: each entry sets the listed tags (an empty value removes the tag) and carries a `source`. A correction that is not observed SHALL say ASSUMPTION in its source. No correction SHALL exempt a node from the gridlock rule.

#### Scenario: A lane count that cannot be right
- **WHEN** the area config sets `lanes` and `lanes:backward` on a way whose northbound lane count drops from two to one for 30 m after a signal
- **THEN** the network carries the corrected lane counts on that way and the importer output is otherwise unchanged

### Requirement: Lanes from turn lanes when the lane count is missing
For a chain of one-way ways with no `lanes` tag whose last way lists its lanes in `turn:lanes` [OSMTurnLanes], the link SHALL have as many lanes as that list has entries (at least the default). The rule SHALL be applied to finished links so chain merging, and with it every link id, is unchanged.

#### Scenario: A one-way approach tagged only with turn lanes
- **WHEN** a one-way secondary way has `turn:lanes=left||` and no `lanes` tag
- **THEN** its link has 3 lanes and one left-turn lane, and no other link id changes

### Requirement: Observed timing carries a clearance per approach and the lane coding
An observation in `signalObservations` MAY give `clearanceSeconds` that differs from another observation of the same timing; the importer SHALL then write it on that approach's green (`clearanceS`) and keep the timing's clearance from the first observation. An observation that leaves its clearance out while the timing has one SHALL be reported as unmatched. An observation MAY set `noLeftTurnLane`; the importer SHALL then mark the approach links `noPocket`.

#### Scenario: Synchro worksheet with different clearances
- **WHEN** a worksheet gives 4.5 s of clearance after two split phases and 6.0 s after the arterial phase
- **THEN** the node's timing has `clearanceS` 4.5 and the arterial approach's green has `clearanceS` 6

#### Scenario: Approach coded with no left-turn lane
- **WHEN** an observation sets `noLeftTurnLane`
- **THEN** the approach links carry `noPocket: true` in the network file
