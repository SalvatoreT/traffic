export type ControlType = 'signal' | 'all_way_stop' | 'two_way_stop' | 'uncontrolled' | 'traffic_circle';
export type RoadClass = 'motorway' | 'primary' | 'secondary' | 'tertiary' | 'residential' | 'service';

export interface NetNode {
  id: number; osmId: number; x: number; y: number;
  control: ControlType; gate: boolean; inStudyArea: boolean;
  /** Gate nodes only: whether traffic can enter / leave the study area here (absent = both). */
  canEnter?: boolean; canExit?: boolean;
  markedCrossing?: boolean;
}
export interface NetLink {
  id: number; osmWayId: number; from: number; to: number; reverse: number | null;
  name: string; class: RoadClass; lanes: number; speedLimit: number; length: number;
  geometry: [number, number][]; stopAtEnd: boolean; humps: number[]; inStudyArea: boolean;
  /** Dedicated bike lane or track in this direction. */
  bikeLane?: boolean;
  /** Signed bike route or bike boulevard. */
  bikeRoute?: boolean;
  /** Walkable alongside (default true except motorway). */
  sidewalk?: boolean;
  /** Marked mid-block crossings, meters from link start. */
  crossings?: number[];
}
export interface Network {
  version: 1; id: string; name: string;
  origin: { lon: number; lat: number };
  bbox: [number, number, number, number];
  studyArea: [number, number][];
  nodes: NetNode[]; links: NetLink[];
}
export interface DemandPeriod {
  id: string; label: string;
  flows: { origin: number; destination: number; vehPerHour: number; mode?: 'car' | 'bicycle' | 'pedestrian' }[];
}
export interface Provenance { source: string; url: string; note: string }
export interface Demand { version: 1; area: string; periods: DemandPeriod[]; provenance: Provenance[] }

export interface Calibration { status: 'uncalibrated' | 'calibrated'; note?: string; defaultPeriod?: string; experimentalPeriods?: string[] }
export interface AreaEntry {
  id: string; name: string; network: string; demand: string; basemap: string;
  center: [number, number]; zoom: number;
  /** Absent means uncalibrated. */
  calibration?: Calibration;
  /** Period id selected on first load. */
  defaultPeriod?: string;
  /** Period ids shown as experimental (not calibrated). */
  experimentalPeriods?: string[];
  /** Proposals file; defaults to `/data/<id>.proposals.json`. */
  proposals?: string;
}

export type Intervention =
  | { type: 'modal_filter'; link: number }
  | { type: 'modal_filter'; node: number }
  | { type: 'speed_limit'; link: number; speed: number }
  | { type: 'speed_hump'; link: number; position: number }
  | { type: 'traffic_circle'; node: number }
  | { type: 'control'; node: number; control: ControlType }
  | { type: 'signal_timing'; node: number; cycle: number }
  | { type: 'one_way'; link: number }
  | { type: 'turn_ban'; fromLink: number; toLink: number }
  /** Barrier line through a four-leg intersection, degrees clockwise from north in [0, 180). Cars may only turn between legs on the same side. */
  | { type: 'diagonal_diverter'; node: number; bearing: number };

export interface Metrics {
  time: number; vehiclesInNetwork: number; spawned: number; completedTrips: number;
  backlog: number; unroutableTrips: number; meanTripTime: number; meanTripDelay: number;
  vehKm: number;
  cutThrough: { vehKm: number; shareOfLocalVehKm: number };
  safety: {
    localMeanSpeed: number; localP85Speed: number; shareAbove20mph: number;
    shareAbove25mph: number; ttcConflicts: number;
  };
  arterialMeanSpeed: number;
  /** Vehicles removed by the sim's gridlock breaker (absent in older sim builds). */
  gridlockRemoved?: number;
  /** Interventions the sim skipped as invalid, such as a diverter at a node that is not a four-leg intersection (absent when none). */
  invalidInterventions?: number;
  /** Per-mode results (absent in sim builds without multimodal support). */
  modes?: ModeMetrics;
  vulnerable?: VulnerableMetrics;
}

export interface ModeMetrics {
  car: { inNetwork: number; completedTrips: number; meanTripTime: number };
  bicycle: { inNetwork: number; completedTrips: number; meanTripTime: number };
  pedestrian: { inNetwork: number; completedTrips: number; meanTripTime: number; meanCrossingDelay: number };
}
export interface VulnerableMetrics {
  pedConflicts: number; bikeConflicts: number; closePasses: number;
  pedInjuryRiskIndex: number; bikeInjuryRiskIndex: number;
  meanVehicleSpeedAtPedEncounter: number;
}

/** Agent kind codes in the vehicle buffer (slot 4). Code 1 is retired and unused. */
export const KIND_CAR = 0, KIND_BIKE = 2, KIND_PED = 3;
export type ModeKey = 'car' | 'bicycle' | 'pedestrian';
export type ModeVisibility = Record<ModeKey, boolean>;

export type Overlay = 'flow' | 'speed' | 'cutthrough';
export type Theme = 'auto' | 'light' | 'dark';

export interface AreaBundle {
  entry: AreaEntry; network: Network; demand: Demand;
  basemap: GeoFC; synthetic: boolean;
  /** Source JSON text, handed to the worker as is so the main thread need not serialize it again. */
  raw?: { network: string; demand: string };
}

/** Link stats from the sim: stride 4 per link. */
export interface LinkStatsView {
  flow(i: number): number; speed(i: number): number; cut(i: number): number; density(i: number): number;
}
export function linkStatsView(a: Float32Array | null): LinkStatsView {
  const g = (i: number, o: number) => (a && a.length > i * 4 + o ? a[i * 4 + o] : 0);
  return { flow: (i) => g(i, 0), speed: (i) => g(i, 1), cut: (i) => g(i, 2), density: (i) => g(i, 3) };
}

export interface GeoFC {
  type: 'FeatureCollection';
  features: { type: 'Feature'; properties: Record<string, unknown> | null; geometry: { type: string; coordinates: unknown } }[];
}
