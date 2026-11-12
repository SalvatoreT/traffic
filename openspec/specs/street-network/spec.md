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
The importer SHALL derive each node's control type from OSM signal, stop-sign and mini-roundabout tags, and mark which approaches face a stop sign.

#### Scenario: Stop signs on the minor street only
- **WHEN** only some approaches to an intersection have stop signs
- **THEN** the node is `two_way_stop` and only those approach links have `stopAtEnd`

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
