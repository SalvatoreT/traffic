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
    /// Additive (baseline-calibration, twelfth round): signal timing observed in the field (DATA from the area config `signalObservations`), per demand period.
    #[serde(default)]
    pub signal_timing: Vec<SignalTiming>,
}

/// An observed signal timing: in the listed periods the cycle is `cycle_s` and each listed approach group gets `green_s` (the other phases share the rest of the cycle by flow).
/// An observation of the phasing alone (a protected left seen in the field, no timing sheet) leaves `cycle_s` and every `green_s` at 0: the phase structure applies
/// and the cycle and greens follow the flows as at any other signal.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignalTiming {
    pub periods: Vec<String>,
    #[serde(default)]
    pub cycle_s: f32,
    pub greens: Vec<ApproachGreen>,
    #[serde(default)]
    pub source: String,
    /// Clearance interval (yellow and all-red) after each phase, when the source gives one; the plan uses `YELLOW + ALL_RED` otherwise.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub clearance_s: Option<f32>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApproachGreen {
    /// Incoming links of the approach.
    pub links: Vec<u32>,
    /// Observed green (s); 0 when only the phasing was observed.
    #[serde(default)]
    pub green_s: f32,
    /// The approach runs in a phase of its own (observed split phasing or protected left turn), so nothing opposes its left turns.
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub own_phase: bool,
    /// Incoming links of an approach this one also has green with (a leading protected left or a lagging through: the approach runs alone first, then with that opposing approach).
    /// `green_s` is then the approach's whole through green and the phase it has alone lasts `green_s` less the partner's green.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub runs_with: Vec<u32>,
    /// Clearance interval (yellow and all-red) after the phase that holds this approach, when the source gives one per phase; else the timing's `clearance_s`.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub clearance_s: Option<f32>,
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
    /// Additive: the approach has no left-turn lane (an observed lane coding, `signalObservations` `noLeftTurnLane`), so the class-rule pocket is not added.
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub no_pocket: bool,
    /// Additive: direction (degrees clockwise from north) in which the link leaves its start node, and in which it arrives at its end
    /// node, as a driver experiences the street. The importer measures them on the way geometry before a junction join moved the link end to the
    /// cluster centroid, so a side street of a merged staggered junction does not read as running along the through street. Missing: the
    /// chord over the first / last `LEG_PROBE_M` of the geometry (`Network::leg_bearing`).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub from_bearing: Option<f64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub to_bearing: Option<f64>,
}

/// Distance along a link used to measure how it leaves or reaches a node (m): beyond the footprint of a merged staggered junction.
pub const LEG_PROBE_M: f64 = 25.0;

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

impl Network {
    /// Bearing (degrees clockwise from north, [0, 360)) of link `l` as it leaves its start node (`start`) or, reversed, as it leaves its
    /// end node: the direction from the node along the street. Uses the importer's `from_bearing` / `to_bearing` when present; else the chord
    /// from the node to the point `LEG_PROBE_M` along the geometry (or to its far end if shorter).
    pub fn leg_bearing(&self, l: u32, start: bool) -> f64 {
        let k = &self.links[l as usize];
        if start {
            if let Some(b) = k.from_bearing {
                return b.rem_euclid(360.0);
            }
        } else if let Some(b) = k.to_bearing {
            return (b + 180.0).rem_euclid(360.0);
        }
        let mut pts: Vec<[f64; 2]> = k.geometry.clone();
        if pts.len() < 2 {
            let (a, b) = (&self.nodes[k.from as usize], &self.nodes[k.to as usize]);
            pts = vec![[a.x, a.y], [b.x, b.y]];
        }
        if !start {
            pts.reverse();
        }
        let mut left = LEG_PROBE_M;
        let mut q = *pts.last().unwrap();
        for w in pts.windows(2) {
            let d = libm::hypot(w[1][0] - w[0][0], w[1][1] - w[0][1]);
            if d >= left && d > 1e-9 {
                let u = left / d;
                q = [w[0][0] + (w[1][0] - w[0][0]) * u, w[0][1] + (w[1][1] - w[0][1]) * u];
                break;
            }
            left -= d;
        }
        libm::atan2(q[0] - pts[0][0], q[1] - pts[0][1]).to_degrees().rem_euclid(360.0)
    }
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
    /// Additive (calibration round 20, ASSUMPTION): the trips of this flow make the movement from link `from` onto link `to` on the way. Their route runs to `from`, takes the movement, then runs to the destination. Dropped when the movement is not usable.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub via: Option<Via>,
    /// Additive (cut-through intent view): index into `Demand::intents` of the intent a through trip of this flow serves. Absent: the trip counts under "other".
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub intent: Option<u32>,
}

/// A movement a flow must make: link ids (equal to link positions).
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct ViaMove {
    pub from: u32,
    pub to: u32,
}

/// An assumed movement a flow makes while its detour stays within `max_detour` times the plain route in the current network (ASSUMPTION).
/// `alternatives` are the movements of the same turn family on parallel streets (ASSUMPTION), tried in the order given by cost when the primary fails.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Via {
    pub from: u32,
    pub to: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_detour: Option<f64>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub alternatives: Vec<ViaMove>,
    /// A second movement made after this one (ASSUMPTION: a freeway ramp, then the assumed turn). Each stage keeps its own tolerance and alternatives and falls back on its own.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub then: Option<Box<Via>>,
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
    /// Additive (cut-through intent view): the named reasons through cars are tallied under, in the order flows index them.
    #[serde(default)]
    pub intents: Vec<IntentDef>,
    /// Additive: the freeway ramps the intents' `onRamp` / `offRamp` refer to.
    #[serde(default)]
    pub ramps: Vec<RampDef>,
}

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct IntentDef {
    pub id: String,
    /// Matches a through car whose planned route enters this on-ramp (a `ramps` id), or any on-ramp no intent lists (`"other"`).
    pub on_ramp: Option<String>,
    /// Matches a through car that has driven this off-ramp (a `ramps` id), or any off-ramp no intent lists (`"other"`).
    pub off_ramp: Option<String>,
}

/// A freeway ramp, derived from the network by the builder: the freeway-class links of one chain, entered from (`on`) or ending at (`off`) a surface street.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct RampDef {
    pub id: String,
    pub kind: String,
    pub links: Vec<u32>,
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
    /// Route-choice dispersion (s) in place of `ROUTE_DISPERSION_S`.
    pub route_dispersion: Option<f64>,
    /// Additive: record every completed car trip (`Simulation::trip_records`) for the wandering metrics. Default false.
    pub record_trips: bool,
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
    /// Additive: how waiting at a junction is relieved (default `physical`). `historical` and `no_behavioral` exist for sensitivity checks.
    pub junction_recovery: JunctionRecovery,
    /// Additive: record requests and link exits for the redistribution diagnostic (`Simulation::trace_requests`). Default false; it
    /// changes nothing a run computes.
    pub trace: bool,
    /// Additive: bound on stored trace events (default `sim::trace::TRACE_DETAIL_MAX`).
    pub trace_detail_max: Option<u64>,
    /// Additive: lane changes along a link (MOBIL, `Simulation::change_lanes`). Default on; false keeps each vehicle in the lane it entered by (diagnostic).
    pub lane_changes: Option<bool>,
    /// Additive: longest link (m) joining two signals that run one cycle with offsets by travel time (default `params::COORD_MAX_M`; 0 turns it off).
    pub coord_max_m: Option<f64>,
    /// Permissive left turns at a signal by the queue-first gap model [Fambro1991]: a conflicting car starting from the line counts as
    /// arriving by its acceleration, the critical gap is `TC_PERMITTED_LEFT`, and the left-turner gets no courtesy or yield fallback.
    /// Default on (change repair-permissive-left-and-gate-fork); `Some(false)` restores the earlier rule for A/B checks. Validation cases
    /// p1 to p3 measure it.
    pub queue_first_left: Option<bool>,
    /// Router option (default `params::SINGLE_CONTROL_CHARGE`, off until a round adopts it; `calibrate --single-control-charge` and `--no-single-control-charge`): the expected control delay of `NodeDelays` is charged once.
    /// The link's cost becomes `max(ff + control delay at its end, measured time)` and the movement's cost drops the constant, so a measured
    /// link time, which already holds the queue, signal and stop wait, is not charged the constant again. Unmeasured or lightly loaded links
    /// keep the constant as a floor. Initial placement (`initial_times`) keeps the static prior. See change calibration-round-54.
    pub single_control_charge: Option<bool>,
}

/// Junction recovery policy. Every policy except `historical` keeps physical conflict exclusion regardless of the wait.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum JunctionRecovery {
    /// Production: courtesy (`YIELD_COURTESY_S`) and the approach-gap/stop-order fallback (`YIELD_FALLBACK_S`) change priority only; a
    /// crossing never starts while a vehicle in the node occupies the conflict point; a vehicle held in the node by a full exit for
    /// `GRIDLOCK_REMOVE_S` is removed and counted (ASSUMPTION, the gridlock breaker's rule applied inside the node).
    #[default]
    Physical,
    /// `Physical` without the courtesy and approach-gap/stop-order fallback (diagnostic).
    NoBehavioral,
    /// The engine before 2026-11-15 (diagnostic): the in-node conflict check is skipped after `CONFLICT_FALLBACK_S`, a vehicle held at
    /// its exit counts as gone once its planned crossing time has passed, and nothing removes it.
    Historical,
}

impl Default for Config {
    fn default() -> Self {
        Config { seed: 1, period: String::new(), demand_scale: 1.0, select_links: Vec::new(), local_cost_factor: None, guided_share: None, switch_band: None, route_dispersion: None, record_trips: false, signal_adapt_min: None, motorway_gridlock_removal: false, ped_yield_marked: None, ped_yield_unmarked: None, lane_width_m: None, no_right_turn_on_red: false, initial_load: true, interventions: Vec::new(), junction_recovery: JunctionRecovery::Physical, trace: false, trace_detail_max: None, lane_changes: None, coord_max_m: None, queue_first_left: None, single_control_charge: None }
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
    /// Node `modal_filter` only: links on the closed legs. Cars cannot enter or leave the node on them; other movements stay open. Absent: every leg.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub legs: Option<Vec<u32>>,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CutThrough {
    /// Through vehicles (gate-to-gate trips) that have exited at least one local link since t = 0, each counted once.
    pub vehicles: u64,
    pub vehicles_per_hour: f64,
    pub veh_km: f64,
    pub share_of_local_veh_km: f64,
    /// Additive (cut-through intent view): the same through vehicles split by the intent of their flow, one entry per demand intent and a last entry `other`. Empty when the demand has no intents.
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub by_intent: Vec<IntentCount>,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IntentCount {
    pub id: String,
    pub vehicles: u64,
    pub vehicles_per_hour: f64,
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
    /// Additive: use of the junction recovery rules (see `JunctionRecoveryStats`).
    pub junction_recovery: JunctionRecoveryStats,
    /// Additive: signals whose observed timing for the period is replaced by a `signal_timing` intervention (the scenario retimes them).
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub retimed_signals: Vec<u32>,
}

/// How often junction recovery rules decided an entry. Head-seconds and admissions count from t = 0; `init_*` count the settle interval
/// before it. A reason is invoked when the head's wait has reached its threshold and the ordinary rule would refuse entry.
#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct JunctionRecoveryStats {
    pub policy: String,
    /// Node entries by cars and cyclists: the denominator of the admission shares.
    pub crossings: u64,
    pub init_crossings: u64,
    /// After `YIELD_COURTESY_S`: entry ahead of a conflicting vehicle slower than `QUEUE_V`.
    pub courtesy: RecoveryReason,
    /// After `YIELD_FALLBACK_S`: entry without the approach-gap and stop-order checks.
    pub yield_fallback: RecoveryReason,
    /// After `CONFLICT_FALLBACK_S`: entry while a vehicle in the node still occupies the conflict point. Admissions occur only under `historical`.
    pub conflict_bypass: RecoveryReason,
    /// Vehicles removed after being held in a node by a full exit for `GRIDLOCK_REMOVE_S` (included in `gridlock_removed` for cars).
    pub held_removals: u64,
    pub init_held_removals: u64,
    /// Detailed events beyond the stored limit (`Simulation::recovery_events`).
    pub events_dropped: u64,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecoveryReason {
    /// Head-seconds with the reason invoked.
    pub invoked_s: f64,
    /// Part of `invoked_s` in which the head still could not enter.
    pub blocked_s: f64,
    /// Entries the ordinary rule would have refused, each counted once when the crossing starts.
    pub admissions: u64,
    pub init_admissions: u64,
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

/// Version of the safety output's meaning. 2: pedestrian and cyclist severity reported apart with encounter counts; cyclist severity from
/// closing speed in supported geometry only. Stored results without it carry the old car-speed score and are legacy.
pub const SAFETY_VERSION: u32 = 2;

/// Conditional severity of one mode's encounters: the mean over supported encounters of the source's injury probability, not a crash probability.
#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Severity {
    pub endpoint: &'static str,
    pub source: &'static str,
    pub encounters: u64,
    pub supported: u64,
    pub unsupported: u64,
    /// None when no supported encounter occurred (not a measured zero); `unavailable` says why.
    pub mean_severity: Option<f64>,
    pub unavailable: Option<&'static str>,
}

impl Severity {
    /// "mean 0.047 (AIS4+, 120 supported of 120)" or "unavailable: no encounters (AIS4+)".
    pub fn describe(&self) -> String {
        match self.mean_severity {
            Some(m) => format!("mean {:.3} ({}, {} supported of {} encounters)", m, self.endpoint, self.supported, self.encounters),
            None => format!("unavailable: {} ({}, {} encounters)", self.unavailable.unwrap_or("no supported encounters"), self.endpoint, self.encounters),
        }
    }
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Passes {
    pub count: u64,
    pub mean_vehicle_speed: Option<f64>,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CyclistSeverity {
    #[serde(flatten)]
    pub severity: Severity,
    pub passes: Passes,
}

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Vulnerable {
    pub safety_version: u32,
    pub ped_conflicts: u64,
    pub bike_conflicts: u64,
    pub close_passes: u64,
    pub pedestrian: Severity,
    pub cyclist: CyclistSeverity,
    pub mean_vehicle_speed_at_ped_encounter: Option<f64>,
}
