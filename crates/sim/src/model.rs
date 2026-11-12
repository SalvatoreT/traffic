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
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Flow {
    pub origin: u32,
    pub destination: u32,
    pub veh_per_hour: f64,
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
    /// Additive: minutes between signal split adaptations (default `params::ADAPT_INTERVAL_S`; 0 keeps the start-up splits).
    pub signal_adapt_min: Option<f64>,
    /// Additive: apply the gridlock breaker on motorway-class links too (default false: vehicles queued on a ramp or the
    /// freeway stub feeding it wait in the origin backlog).
    pub motorway_gridlock_removal: bool,
}

impl Default for Config {
    fn default() -> Self {
        Config { seed: 1, period: String::new(), demand_scale: 1.0, select_links: Vec::new(), local_cost_factor: None, signal_adapt_min: None, motorway_gridlock_removal: false }
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
}
