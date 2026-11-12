export type NodeControl = 'signal' | 'all_way_stop' | 'two_way_stop' | 'uncontrolled' | 'traffic_circle';
export type LinkClass = 'motorway' | 'primary' | 'secondary' | 'tertiary' | 'residential' | 'service';

export interface NetNode {
  id: number;
  osmId: number;
  x: number;
  y: number;
  control: NodeControl;
  gate: boolean;
  /** Gates only: trips can start / end here (additive, see baseline-calibration design). */
  canEnter?: boolean;
  canExit?: boolean;
  inStudyArea: boolean;
  /** A marked crosswalk sits at or within 15 m of this junction. */
  markedCrossing?: boolean;
}

export interface NetLink {
  id: number;
  osmWayId: number;
  from: number;
  to: number;
  reverse: number | null;
  name: string;
  class: LinkClass;
  lanes: number;
  speedLimit: number;
  length: number;
  geometry: [number, number][];
  stopAtEnd: boolean;
  humps: number[];
  inStudyArea: boolean;
  /** Dedicated bike lane or track in this direction. */
  bikeLane?: boolean;
  /** Signed bike route or bike boulevard. */
  bikeRoute?: boolean;
  /** Walkable alongside (default true except motorway). Always written by the importer. */
  sidewalk?: boolean;
  /** Marked mid-block crossings, meters from link start. */
  crossings?: number[];
}

export interface Network {
  version: 1;
  id: string;
  name: string;
  origin: { lon: number; lat: number };
  bbox: [number, number, number, number];
  studyArea: [number, number][];
  nodes: NetNode[];
  links: NetLink[];
}

/** A string matches OSM `name` or `ref`; an object matches the fields it gives (`class` is the OSM highway value). */
export type BoundaryStreet = string | { name?: string; ref?: string; class?: string };

export interface AreaConfig {
  id: string;
  name: string;
  extract: string;
  bbox: [number, number, number, number];
  /** Ordered boundary streets, each meeting the next (the last meets the first). Derives `studyArea`; the streets count as inside. */
  boundary?: BoundaryStreet[];
  studyArea: [number, number][];
  center?: [number, number];
  zoom?: number;
  /** Graph nodes within this distance (m) that form one intersection are joined into one node. Default 20; 0 turns it off. */
  junctionJoinRadius?: number;
  /** Baseline calibration status shown in the UI. */
  calibration?: { status: 'uncalibrated' | 'calibrated'; note?: string };
}

export interface OsmNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}
export interface OsmWay {
  type: 'way';
  id: number;
  nodes: number[];
  tags: Record<string, string>;
}
export interface OsmRelation {
  type: 'relation';
  id: number;
  members?: { type: string; ref: number; role?: string }[];
  tags?: Record<string, string>;
}
export interface Overpass {
  elements: (OsmNode | OsmWay | OsmRelation)[];
}
