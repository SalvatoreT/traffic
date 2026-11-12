//! Serde types for the JSON contracts (network, demand, interventions, config, metrics).

use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Control {
    Signal,
    AllWayStop,
    TwoWayStop,
    Uncontrolled,
    TrafficCircle,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RoadClass {
    Motorway,
    Primary,
    Secondary,
    Tertiary,
    Residential,
    Service,
}

impl RoadClass {
    /// Priority rank, lower = more important.
    pub fn rank(self) -> u8 {
        match self {
            RoadClass::Motorway => 0,
            RoadClass::Primary => 1,
            RoadClass::Secondary => 2,
            RoadClass::Tertiary => 3,
            RoadClass::Residential => 4,
            RoadClass::Service => 5,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Node {
    pub id: u32,
    #[serde(default)]
    pub osm_id: i64,
    pub x: f64,
    pub y: f64,
    pub control: Control,
    #[serde(default)]
    pub gate: bool,
    #[serde(default)]
    pub in_study_area: bool,
    /// Additive (multimodal-agents): a marked pedestrian crossing at this intersection.
    #[serde(default)]
    pub marked_crossing: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Link {
    pub id: u32,
    #[serde(default)]
    pub osm_way_id: i64,
    pub from: u32,
    pub to: u32,
    #[serde(default)]
    pub reverse: Option<u32>,
    #[serde(default)]
    pub name: String,
    pub class: RoadClass,
    pub lanes: u32,
    pub speed_limit: f64,
    pub length: f64,
    pub geometry: Vec<[f64; 2]>,
    #[serde(default)]
    pub stop_at_end: bool,
    #[serde(default)]
    pub humps: Vec<f64>,
    #[serde(default)]
    pub in_study_area: bool,
    /// Additive (multimodal-agents): dedicated bike lane or track in this direction.
    #[serde(default)]
    pub bike_lane: bool,
    /// Additive: signed bike route or bike boulevard.
    #[serde(default)]
    pub bike_route: bool,
    /// Additive: walkable alongside. Missing means true except on motorway-class links.
    #[serde(default)]
    pub sidewalk: Option<bool>,
    /// Additive: marked mid-block crossings, meters from the link start.
    #[serde(default)]
    pub crossings: Vec<f64>,
    /// Additive: lanes marked left-turn only in the OSM `turn:lanes` tag at the end of this link. They are already counted in `lanes`, so the
    /// left-turn pocket uses one of them instead of adding a lane.
    #[serde(default)]
    pub left_lanes: u32,
}

impl Link {
    pub fn has_sidewalk(&self) -> bool {
        self.sidewalk.unwrap_or(self.class != RoadClass::Motorway)
    }
}

/// Additive: a motor-vehicle movement banned by an OSM `restriction` relation (`from` link into the junction, `to` link out of it).
/// `periods` lists the demand periods in which a time-conditional ban applies; empty means always.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TurnBan {
    pub from: u32,
    pub to: u32,
    #[serde(default)]
    pub periods: Vec<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Network {
    #[serde(default)]
    pub version: u32,
    #[serde(default)]
    pub id: String,
    #[serde(default)]
    pub name: String,
    pub nodes: Vec<Node>,
    pub links: Vec<Link>,
    #[serde(default)]
    pub turn_bans: Vec<TurnBan>,
}

/// Mode of a demand flow. Missing means car.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FlowMode {
    #[default]
    Car,
    Bicycle,
    Pedestrian,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Flow {
    pub origin: u32,
    pub destination: u32,
    pub veh_per_hour: f64,
    #[serde(default)]
    pub mode: FlowMode,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Period {
    pub id: String,
    #[serde(default)]
    pub label: String,
    pub flows: Vec<Flow>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demand {
    #[serde(default)]
    pub version: u32,
    #[serde(default)]
    pub area: String,
    pub periods: Vec<Period>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Config {
    pub seed: u64,
    pub period: String,
    pub demand_scale: f64,
    /// Additive: link ids to record select-link analysis for (see `Simulation::select_link_records`).
    /// Empty (default) disables recording entirely.
    pub select_links: Vec<u32>,
    /// Additive: perceived-cost multiplier for residential/service links in route choice (default `params::LOCAL_COST_FACTOR`).
    pub local_cost_factor: Option<f64>,
    /// Additive: share of drivers that follow live guidance (re-evaluate their route every epoch), 0 to 1 (default `params::GUIDED_SHARE`).
    pub guided_share: Option<f64>,
    /// Additive: relative indifference band of route switching, e.g. 0.2 = the new remaining route must be 20% cheaper (default `params::SWITCH_BAND`).
    pub switch_band: Option<f64>,
    /// Additive: record every completed car trip (`Simulation::trip_records`) for the wandering metrics. Default false.
    pub record_trips: bool,
    /// Additive, for A/B runs: the route choice before the commitment rules (80% of drivers re-plan every epoch and take whatever route results).
    pub legacy_reroute: bool,
    /// Additive: minutes between signal split adaptations (default `params::ADAPT_INTERVAL_S`; 0 keeps the start-up splits).
    pub signal_adapt_min: Option<f64>,
    /// Additive: apply the gridlock breaker on motorway-class links too (default false: vehicles queued on a ramp or the
    /// freeway stub feeding it wait in the origin backlog).
    pub motorway_gridlock_removal: bool,
    /// Additive (multimodal-agents): probability a driver yields to a pedestrian waiting at a marked / unmarked crossing
    /// (defaults `params::PED_YIELD_MARKED` / `PED_YIELD_UNMARKED`).
    pub ped_yield_marked: Option<f64>,
    pub ped_yield_unmarked: Option<f64>,
    /// Additive: lane width (m) that decides whether a driver may pass a cyclist on a one-way single-lane street
    /// (default `params::LANE_WIDTH_M`).
    pub lane_width_m: Option<f64>,
    /// Additive: forbid right turns on red (default false: a car that has stopped at a red may turn right when a gap allows, ASSUMPTION, see `Simulation::rtor_candidate`).
    pub no_right_turn_on_red: bool,
    /// Additive: start with agents already en route (placed from the demand rates, then a short settle interval before time zero).
    /// Default true; false starts from an empty network.
    pub initial_load: bool,
    /// Additive: interventions in force from construction, so the initial placement already respects them. `Simulation::reset` keeps the
    /// scenario set by `set_interventions`.
    pub interventions: Vec<Intervention>,
}

impl Default for Config {
    fn default() -> Self {
        Config { seed: 1, period: String::new(), demand_scale: 1.0, select_links: Vec::new(), local_cost_factor: None, guided_share: None, switch_band: None, record_trips: false, legacy_reroute: false, signal_adapt_min: None, motorway_gridlock_removal: false, ped_yield_marked: None, ped_yield_unmarked: None, lane_width_m: None, no_right_turn_on_red: false, initial_load: true, interventions: Vec::new() }
    }
}

/// One intervention; fields not relevant to `type` are absent.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Intervention {
    #[serde(rename = "type")]
    pub ty: String,
    pub link: Option<u32>,
    pub node: Option<u32>,
    pub speed: Option<f64>,
    pub position: Option<f64>,
    pub control: Option<Control>,
    pub cycle: Option<f64>,
    pub from_link: Option<u32>,
    pub to_link: Option<u32>,
    /// Barrier line of a `diagonal_diverter`, degrees clockwise from north.
    pub bearing: Option<f64>,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CutThrough {
    pub veh_km: f64,
    pub share_of_local_veh_km: f64,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Safety {
    pub local_mean_speed: f64,
    pub local_p85_speed: f64,
    pub share_above_20mph: f64,
    pub share_above_25mph: f64,
    pub ttc_conflicts: u64,
}

fn is_zero(n: &u64) -> bool {
    *n == 0
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Metrics {
    pub time: f64,
    pub vehicles_in_network: u64,
    pub spawned: u64,
    pub completed_trips: u64,
    pub backlog: u64,
    pub unroutable_trips: u64,
    pub mean_trip_time: f64,
    pub mean_trip_delay: f64,
    pub veh_km: f64,
    pub cut_through: CutThrough,
    pub safety: Safety,
    pub arterial_mean_speed: f64,
    /// Additive field: vehicles removed by the gridlock breaker (see `sim.rs`, `GRIDLOCK_REMOVE_S`).
    pub gridlock_removed: u64,
    /// Additive: interventions skipped as invalid (a diagonal diverter at a node that is not a four-leg intersection or with a bad bearing).
    #[serde(skip_serializing_if = "is_zero")]
    pub invalid_interventions: u64,
    /// Additive (multimodal-agents): per-mode results.
    pub modes: Modes,
    /// Additive: safety surrogates for people walking and biking.
    pub vulnerable: Vulnerable,
    /// Additive: agents (cars, cyclists, pedestrians) placed on the network at time zero by initial loading, and the ones that found no room.
    pub initial_agents: u64,
    pub initial_skipped: u64,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CarMode {
    pub in_network: u64,
    pub completed_trips: u64,
    pub mean_trip_time: f64,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BikeMode {
    pub in_network: u64,
    pub completed_trips: u64,
    pub mean_trip_time: f64,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PedMode {
    pub in_network: u64,
    pub completed_trips: u64,
    pub mean_trip_time: f64,
    pub mean_crossing_delay: f64,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Modes {
    pub car: CarMode,
    pub bicycle: BikeMode,
    pub pedestrian: PedMode,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Vulnerable {
    pub ped_conflicts: u64,
    pub bike_conflicts: u64,
    pub close_passes: u64,
    pub ped_injury_risk_index: f64,
    pub bike_injury_risk_index: f64,
    pub mean_vehicle_speed_at_ped_encounter: f64,
}
