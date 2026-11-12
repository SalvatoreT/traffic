//! Model constants. Each carries a citation key from docs/references.md or an `ASSUMPTION` tag.

pub const DT: f64 = 0.25; // fixed step [Treiber2015] (h <= 0.5 s)
pub const IDM_DELTA: f32 = 4.0; // [Treiber2000] Table I
pub const B_MAX: f32 = 9.0; // ASSUMPTION: physical braking limit (m/s^2)
pub const MIN_GAP: f32 = 0.1; // hard overlap guard (m)

// --- signals [Webster1958] ---
pub const YELLOW: f32 = 3.5; // ASSUMPTION: within 3-4 s
pub const ALL_RED: f32 = 1.5; // ASSUMPTION
pub const SAT_FLOW: f32 = 1800.0; // veh/h/lane, [Webster1958] era value (unchecked in references.md)
pub const CYCLE_MIN: f32 = 75.0; // ASSUMPTION: adaptive cycle range 60-120 s (urban arterial plans)
pub const CYCLE_MAX: f32 = 120.0; // ASSUMPTION
pub const MIN_GREEN: f32 = 15.0; // ASSUMPTION
pub const MAX_PHASES: usize = 4; // ASSUMPTION: phases per junction; streets beyond this share a phase with the closest axis
pub const PHASE_AXIS_DEG: f64 = 30.0; // ASSUMPTION: approaches of different or unnamed streets on one axis within this angle share a phase
pub const PHASE_SAME_NAME_DEG: f64 = 80.0; // ASSUMPTION: approaches with the same street name share a phase within this axis angle
pub const ADAPT_INTERVAL_S: f64 = 300.0; // ASSUMPTION: signal splits are recomputed from measured flows every 5 min (approximates actuated/coordinated control)
pub const ADAPT_SPILL_HOPS: usize = 3; // ASSUMPTION: links upstream that count toward a spilled-back queue
pub const ADAPT_SMOOTH: f32 = 0.5; // ASSUMPTION: weight of the newest window in the smoothed approach flow
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
pub const REROUTE_SHARE: u32 = 800; // per mille. ASSUMPTION: 80% re-route each epoch (calibration step I, was 30%: raising it cut PM gridlock removals from 30 to 10 per run)
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

// --- multimodal agents (change multimodal-agents). Values without a verified source in docs/references.md are ASSUMPTION. ---
pub const KIND_CAR: u8 = 0;
pub const KIND_BUS: u8 = 1;
pub const KIND_BIKE: u8 = 2;
pub const KIND_PED: u8 = 3;

// Buses (D2). Heavy-vehicle IDM values are the truck column of [Kesting2010] Table 1 (T = 2.0 s, s0 = 4.0 m, a = 0.7, b = 2.0).
pub const BUS_LEN: f32 = 12.0; // m, design decision D2
pub const BUS_A: f32 = 0.7; // [Kesting2010] Table 1 trucks; ASSUMPTION: a bus behaves like a heavy vehicle
pub const BUS_B: f32 = 2.0; // [Kesting2010] Table 1 trucks
pub const BUS_T: f32 = 2.0; // s, [Kesting2010] Table 1 trucks
pub const BUS_S0: f32 = 4.0; // m, [Kesting2010] Table 1 trucks
pub const BUS_DWELL_DEFAULT_S: f32 = 20.0; // ASSUMPTION: used when a stop carries no dwell time
pub const BUS_SETTLE_M: f32 = 2.5; // ASSUMPTION: a bus within this distance of its stop mark and stopped begins dwelling

// Bicycles (D3). [Twaddle2016] is the parameter source named in D3 but its values are not recorded in docs/references.md.
pub const BIKE_LEN: f32 = 1.8; // ASSUMPTION
pub const BIKE_A_RANGE: (f64, f64) = (0.8, 1.4); // ASSUMPTION m/s^2
pub const BIKE_B_RANGE: (f64, f64) = (1.5, 2.5); // ASSUMPTION m/s^2
pub const BIKE_T_RANGE: (f64, f64) = (0.9, 1.4); // ASSUMPTION s
pub const BIKE_S0: f32 = 1.0; // ASSUMPTION m
pub const BIKE_V_MEAN: f64 = 4.5; // ASSUMPTION m/s (16 km/h) desired speed
pub const BIKE_V_SD: f64 = 0.8; // ASSUMPTION m/s
pub const BIKE_V_MIN: f64 = 2.5; // ASSUMPTION m/s
pub const BIKE_V_MAX: f64 = 7.0; // ASSUMPTION m/s
pub const V_BIKE_RIGHT: f32 = 3.0; // ASSUMPTION m/s node crossing
pub const V_BIKE_LEFT: f32 = 3.5; // ASSUMPTION
pub const V_BIKE_UTURN: f32 = 2.0; // ASSUMPTION
pub const V_BIKE_CIRCLE: f32 = 4.0; // ASSUMPTION
pub const BIKE_COST_LANE: f32 = 0.7; // ASSUMPTION: perceived-cost weight on a bike lane link
pub const BIKE_COST_ROUTE: f32 = 0.85; // ASSUMPTION: signed bike route
pub const BIKE_COST_PRIMARY: f32 = 1.6; // ASSUMPTION: cyclists avoid busy roads without a lane
pub const BIKE_COST_SECONDARY: f32 = 1.3; // ASSUMPTION
pub const BIKE_COST_TERTIARY: f32 = 1.1; // ASSUMPTION
pub const BIKE_COST_V: f32 = 4.5; // ASSUMPTION m/s: nominal speed for routing time

// Passing a cyclist on a shared link (D3). All ASSUMPTION.
pub const LANE_WIDTH_M: f64 = 3.3; // lane width (also used for crossing width, D4)
pub const CAR_WIDTH_M: f32 = 1.8;
pub const BIKE_WIDTH_M: f32 = 0.7;
pub const PASS_DECISION_GAP: f32 = 60.0; // m: distance at which a driver notices a cyclist ahead and decides to pass or follow
pub const PASS_MIN_DV: f32 = 1.5; // m/s: desired-speed advantage that makes a driver want to pass
pub const PASS_TIME_S: f32 = 5.0; // s: oncoming vehicle must be at least this far in time
pub const PASS_MIN_CLEAR_M: f32 = 40.0; // m: and at least this far away, to pass using the opposing lane
pub const PASS_MIN_LATERAL_M: f32 = 0.5; // m: least lateral room for passing inside one lane (one-way street)
pub const CLOSE_PASS_CLEAR_M: f32 = 1.0; // m: lateral clearance below this is a close pass
pub const CLOSE_PASS_DV: f32 = 6.0; // m/s: speed difference above this is a close pass

// Pedestrians (D4). Values below are ASSUMPTION: docs/references.md has no verified walking speed or yielding rate.
pub const PED_V_MEAN: f64 = 1.3; // m/s
pub const PED_V_SD: f64 = 0.25; // m/s
pub const PED_V_MIN: f64 = 0.7;
pub const PED_V_MAX: f64 = 1.9;
pub const PED_YIELD_MARKED: f64 = 0.6; // probability a driver yields to a waiting pedestrian, marked crossing
pub const PED_YIELD_UNMARKED: f64 = 0.3; // unmarked (intersection without a marked crosswalk)
pub const PED_LANE_W: f32 = 3.3; // m per lane: crossing width = lanes (both directions) x this
pub const PED_GAP_MARGIN_S: f32 = 2.0; // s added to width / speed for the critical gap
pub const PED_GAP_SIGMA: f64 = 0.3; // lognormal heterogeneity of the margin (some pedestrians accept short gaps)
pub const PED_B_COMF: f32 = 3.0; // m/s^2: comfortable braking that decides whether a driver can still yield
pub const PED_MIN_DECIDE_M: f32 = 6.0; // m
pub const XW_STOP_M: f32 = 2.0; // m: vehicles stop this far before a mid-block crosswalk
pub const PED_STANDING_V: f32 = 0.3; // m/s: a vehicle slower than this is treated as standing
pub const PED_MIDBLOCK_BONUS_M: f32 = 0.1; // m: tie-break that makes pedestrians use a marked mid-block crossing
pub const PED_CORNER_M: f32 = 3.0; // m: corner walking distance at a node
pub const PED_OFFSET_M: f64 = 3.8; // m beyond the outer lane center (rendering only)

// Safety (D5)
pub const PET_THRESHOLD: f32 = 1.5; // s. ASSUMPTION: same adjustable value as the TTC threshold; PET definition [Mahmud2017]
pub const PET_ENCOUNTER_S: f32 = 5.0; // ASSUMPTION: an encounter is a vehicle passing a conflict point within this PET
/// Severe-injury (AIS 4+) risk of a struck pedestrian against impact speed (mph), the points reported in the abstract of
/// [Tefft2013]. Between points the index interpolates linearly; below the first point it falls linearly to zero at 0 mph and
/// above the last it extends along the last segment, capped at 1 (interpolation choices are ours, not the paper's).
pub const TEFFT_AIS4: [(f32, f32); 5] = [(17.1, 0.10), (24.9, 0.25), (33.0, 0.50), (40.8, 0.75), (48.1, 0.90)];
pub const PED_EMERGENCY_B: f32 = 8.0; // ASSUMPTION m/s^2: hardest braking a driver uses to stop for a pedestrian already crossing
pub const LC_GAP_M: f32 = 5.0; // ASSUMPTION: gap needed ahead of and behind a vehicle that changes lane around a dwelling bus
