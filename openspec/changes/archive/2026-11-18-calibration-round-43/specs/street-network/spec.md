## MODIFIED Requirements

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
