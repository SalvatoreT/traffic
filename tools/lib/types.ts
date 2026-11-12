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
  /**
   * Direction (degrees clockwise from north) in which the link leaves its start node and arrives at its end node, as a driver
   * experiences the street: the chord over the first / last 45 m of the way geometry, measured from where the link met the street
   * before a junction join moved its end to the cluster centroid (ignoring the internal connector). Always written by the importer.
   */
  fromBearing?: number;
  toBearing?: number;
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
  /** Lanes marked left-turn only in the OSM `turn:lanes` tag at the end of this link (already counted in `lanes`). */
  leftLanes?: number;
}

/** A motor-vehicle movement banned by an OSM turn restriction: `from` is the link into the junction, `to` the link out of it. `periods` lists the demand periods of a time-conditional ban. */
export interface TurnBan {
  from: number;
  to: number;
  periods?: string[];
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
  turnBans?: TurnBan[];
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
  /** Staggered T-junctions of a same-named cross street on opposite sides within this distance (m) along the through street are joined (default 35; 0 turns it off). */
  staggeredJoinRadius?: number;
  /** Join radius (m) for clusters of two or more signal nodes; default 40. */
  signalJoinRadius?: number;
  /** Importer warning distance (m, default 60): gates closer than this to a signalized junction are listed. */
  gateSignalWarnM?: number;
  /** Freeway mainline gates of one direction whose stub ends lie within this distance (m, default 80) are merged into one gate; 0 turns it off. */
  freewayGateMergeM?: number;
  /** Hours of day (start, end) of each demand period, used to apply time-conditional turn restrictions (e.g. `no_left_turn @ (Mo-Fr 16:00-18:00)`). */
  periodWindows?: Record<string, [number, number]>;
  /**
   * Baseline calibration status shown in the UI. `defaultPeriod` is the demand period the app opens with; `experimentalPeriods` lists the
   * periods whose baseline fails the stability criterion (D4), which the app labels experimental. The importer copies the object into areas.json.
   */
  calibration?: { status: 'uncalibrated' | 'calibrated'; note?: string; defaultPeriod?: string; experimentalPeriods?: string[] };
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
