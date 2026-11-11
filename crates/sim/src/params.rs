//! Model constants. Each carries a citation key from docs/references.md or an `ASSUMPTION` tag.

pub const DT: f64 = 0.25; // fixed step [Treiber2015] (h <= 0.5 s)
pub const IDM_DELTA: f32 = 4.0; // [Treiber2000] Table I
pub const B_MAX: f32 = 9.0; // ASSUMPTION: physical braking limit (m/s^2)
pub const MIN_GAP: f32 = 0.1; // hard overlap guard (m)

// --- signals [Webster1958] ---
pub const YELLOW: f32 = 3.5; // ASSUMPTION: within 3-4 s
pub const ALL_RED: f32 = 1.5; // ASSUMPTION
pub const SAT_FLOW: f32 = 1800.0; // veh/h/lane, [Webster1958] era value (unchecked in references.md)
pub const CYCLE_MIN: f32 = 75.0; // ASSUMPTION: default plan range 60-90 s
pub const CYCLE_MAX: f32 = 90.0; // ASSUMPTION
pub const MIN_GREEN: f32 = 15.0; // ASSUMPTION
pub const YELLOW_DECEL: f32 = 4.0; // ASSUMPTION: go on yellow if v^2/(2*4) > distance to line

// --- capacity realism (all ASSUMPTION: not sourced in docs/references.md) ---
pub const NODE_CROSS_S: f32 = 2.0; // ASSUMPTION: s of leader motion credited when checking downstream room before a node crossing (crossing takes ~2-3 s)
pub const POCKET_VEH: usize = 3; // ASSUMPTION: left-turn pocket storage, vehicles (~20 m); more lefts queue in the through lane
pub const POCKET_LEN: f32 = 20.0; // ASSUMPTION: pocket storage length (m); a through-lane queue longer than this blocks pocket entry
pub const POCKET_MIN_LINK_M: f32 = 40.0; // ASSUMPTION: shortest approach link that can hold a pocket
pub const SNEAKERS: u8 = 2; // ASSUMPTION: permissive left-turners that may clear per signal cycle on yellow/all-red (HCM practice; [HCM7] value not verified in references.md)
pub const LOCAL_COST_FACTOR: f32 = 1.25; // ASSUMPTION: perceived-cost multiplier for residential/service links in route choice (street hierarchy preference)

// --- gap acceptance (s) [Brilon1999], [HCM7] via FHWA HPMS Table 11 in references.md 3.3 ---
pub const TC_MINOR_RIGHT: f32 = 6.2;
pub const TC_MINOR_THROUGH: f32 = 6.5;
pub const TC_MINOR_LEFT: f32 = 7.1;
pub const TC_MAJOR_LEFT: f32 = 4.1;
pub const TC_UNCONTROLLED: f32 = 3.5; // ASSUMPTION: "short" critical gap, yield-to-right junctions
pub const GAP_SIGMA: f64 = 0.15; // ASSUMPTION: lognormal heterogeneity of critical gap [Brilon1999] design choice
pub const MIN_APPROACH_SPEED: f32 = 2.0; // ASSUMPTION: floor in arrival-time estimate (m/s)
pub const STOP_DWELL: f32 = 1.0; // ASSUMPTION: s stopped before a stop-sign driver may go (discharge headway 3-4 s [HCM7] UNVERIFIED)
pub const YIELD_FALLBACK_S: f32 = 45.0; // ASSUMPTION: bounded-wait deadlock guard: drop approach-gap/FIFO checks
pub const CONFLICT_FALLBACK_S: f32 = 120.0; // ASSUMPTION: drop in-node conflict check as well
pub const GRIDLOCK_REMOVE_S: f32 = 180.0; // ASSUMPTION: remove vehicle blocked by no downstream space this long
pub const DECISION_HORIZON: f32 = 100.0; // m: heads farther than this ignore node control

// --- node crossing (m/s) ---
pub const V_RIGHT: f32 = 4.0; // ASSUMPTION: a_lat ~ 2 m/s^2, r ~ 8 m
pub const V_LEFT: f32 = 5.0; // ASSUMPTION: a_lat ~ 2 m/s^2, r ~ 12 m
pub const V_UTURN: f32 = 3.0; // ASSUMPTION
pub const V_CIRCLE: f32 = 5.0; // ASSUMPTION: 18 km/h, within the 15-25 km/h negotiation range; [Rodegerdts2010] (value not sourced)
pub const R_CIRCLE: f64 = 7.0; // ASSUMPTION: central-island + circulating radius of a neighborhood circle (m)

// --- speed humps ---
pub const HUMP_V: f32 = 5.5; // ASSUMPTION: crossing speed (~12 mph); no peer-reviewed value in references.md 5.2
pub const HUMP_ZONE: f32 = 60.0; // m: influence-zone cut-off (cap formula reaches v0 earlier)
pub const HUMP_FF_PENALTY: f32 = 3.0; // ASSUMPTION: s added to routing free-flow time per hump

// --- routing [Wardrop1952], [Peeta2001] ---
pub const EPOCH_S: f64 = 60.0; // cost-update / re-route period
pub const REROUTE_SHARE: u32 = 300; // per mille. ASSUMPTION: 30% re-route each epoch
pub const EMA_ALPHA: f32 = 0.3; // ASSUMPTION
pub const ROUTE_NOISE: f32 = 0.08; // ASSUMPTION: per-driver perceived-cost noise (+-8%)
pub const TURN_RIGHT_S: f32 = 1.0; // ASSUMPTION: turn penalties for routing (s)
pub const TURN_LEFT_S: f32 = 4.0; // ASSUMPTION
pub const TURN_U_S: f32 = 25.0; // ASSUMPTION
pub const DELAY_SIGNAL_S: f32 = 10.0; // ASSUMPTION: expected control delay at node (s)
pub const DELAY_ALLWAY_S: f32 = 6.0; // ASSUMPTION
pub const DELAY_MINOR_S: f32 = 5.0; // ASSUMPTION
pub const DELAY_CIRCLE_S: f32 = 3.0; // ASSUMPTION

// --- safety surrogates ---
pub const TTC_THRESHOLD: f32 = 1.5; // s [Hayward1972], [Mahmud2017] (adjustable)
pub const TTC_CLEAR: f32 = 3.0; // ASSUMPTION: hysteresis so one pair episode is counted once
pub const MPH20: f32 = 8.9408;
pub const MPH25: f32 = 11.176;

// --- stats windows ---
pub const NBINS: usize = 10; // rolling window = 10 bins x 30 s = 5 min
pub const BIN_S: f64 = 30.0;
pub const HIST_BINS: usize = 160; // speed histogram, 0.25 m/s bins
