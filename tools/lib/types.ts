export type NodeControl = 'signal' | 'all_way_stop' | 'two_way_stop' | 'uncontrolled' | 'traffic_circle';
export type LinkClass = 'motorway' | 'primary' | 'secondary' | 'tertiary' | 'residential' | 'service';

export interface NetNode {
  id: number;
  osmId: number;
  x: number;
  y: number;
  control: NodeControl;
  gate: boolean;
  inStudyArea: boolean;
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

export interface BoundingStreets {
  west: string;
  east: string;
  south: string;
  north: string;
}

export interface AreaConfig {
  id: string;
  name: string;
  extract: string;
  bbox: [number, number, number, number];
  boundingStreets?: BoundingStreets;
  studyArea: [number, number][];
  center?: [number, number];
  zoom?: number;
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
export interface Overpass {
  elements: (OsmNode | OsmWay)[];
}
