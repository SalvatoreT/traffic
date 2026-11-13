//! Model constants. Each carries a citation key from docs/references.md or an `ASSUMPTION` tag.

pub const DT: f64 = 0.25; // fixed step [Treiber2015] (h <= 0.5 s)
pub const IDM_DELTA: f32 = 4.0; // [Treiber2000] Table I
pub const B_MAX: f32 = 9.0; // ASSUMPTION: physical braking limit (m/s^2)
pub const MIN_GAP: f32 = 0.1; // hard overlap guard (m)

// --- signals [Webster1958] ---
pub const YELLOW: f32 = 3.5; // ASSUMPTION: within 3-4 s
pub const ALL_RED: f32 = 1.5; // ASSUMPTION
pub const SAT_FLOW: f32 = 1800.0; // veh/h/lane, Webster-era value for the signal plan flow ratios; the ideal HCM value is 1,900 and the observed range 1,500 to 2,000 [FHWA-SIG2004]
pub const CYCLE_MIN: f32 = 75.0; // ASSUMPTION: adaptive cycle range 60-120 s (urban arterial plans)
pub const CYCLE_MAX: f32 = 120.0; // ASSUMPTION
pub const MIN_GREEN: f32 = 15.0; // ASSUMPTION
pub const MAX_PHASES: usize = 6; // ASSUMPTION: phases per junction; legs beyond this share a phase with the closest axis (only then can crossing movements share green)
pub const PHASE_AXIS_DEG: f64 = 30.0; // ASSUMPTION: approaches share a phase only when every pair is on one axis within this angle (crossing movements never share green)
pub const ADAPT_INTERVAL_S: f64 = 300.0; // ASSUMPTION: signal splits are recomputed from measured flows every 5 min (approximates actuated/coordinated control)
pub const ADAPT_SPILL_HOPS: usize = 3; // ASSUMPTION: links upstream that count toward a spilled-back queue
pub const ADAPT_SMOOTH: f32 = 0.5; // ASSUMPTION: weight of the newest window in the smoothed approach flow
pub const YELLOW_DECEL: f32 = 4.0; // ASSUMPTION: go on yellow if v^2/(2*4) > distance to line

// --- capacity realism (all ASSUMPTION: not sourced in docs/references.md) ---
pub const NODE_CROSS_S: f32 = 2.0; // ASSUMPTION: s of leader motion credited when checking downstream room before a node crossing (crossing takes ~2-3 s)
pub const NODE_SAFE_S: f32 = 0.5; // ASSUMPTION: s to spare when an entering vehicle will reach a conflict point just after a crossing one has cleared it
pub const POCKET_VEH: usize = 3; // ASSUMPTION: left-turn pocket storage, vehicles (~20 m); more lefts queue in the through lane
pub const POCKET_LEN: f32 = 20.0; // ASSUMPTION: pocket storage length (m); a through-lane queue longer than this blocks pocket entry
pub const POCKET_MIN_LINK_M: f32 = 40.0; // ASSUMPTION: shortest approach link that can hold a pocket
pub const SNEAKERS: u8 = 2; // ASSUMPTION: permissive left-turners that may clear per signal cycle on yellow/all-red (HCM practice; [HCM7] value not verified in references.md)
pub const SHARP_TURN_MAX: f64 = 2.88; // ASSUMPTION: rad (165 degrees); a turn between 149 and 165 degrees onto a street of another name is a sharp turn at an acute junction, not a U-turn
pub const SPAWN_SCAN: usize = 512; // ASSUMPTION: a gate stands for a multilane road whose vehicles arrive side by side, so a waiting trip whose first link has no room does not hold back the trips behind it that use another first link; at most this many waiting trips are scanned per step, in order, and a trip never passes another on the same first link
pub const FORK_LANES: bool = true; // ASSUMPTION: lanes of a link that forks into several straight-ahead branches are shared out by branch, left branch in the left lanes (OSM `turn:lanes` is not read for this)
pub const LOCAL_COST_FACTOR: f32 = 1.25; // ASSUMPTION: perceived-cost multiplier for residential/service links in route choice (street hierarchy preference)

// --- gap acceptance (s) [Brilon1999], [HCM7] via FHWA HPMS Table 11 in references.md 3.3 ---
pub const TC_MINOR_RIGHT: f32 = 6.2;
pub const TC_MINOR_THROUGH: f32 = 6.5;
pub const TC_MINOR_LEFT: f32 = 7.1;
pub const TC_MAJOR_LEFT: f32 = 4.1;
pub const TC_UNCONTROLLED: f32 = 3.5; // ASSUMPTION: "short" critical gap, yield-to-right junctions
pub const GAP_SIGMA: f64 = 0.15; // ASSUMPTION: lognormal heterogeneity of critical gap [Brilon1999] design choice
pub const MIN_APPROACH_SPEED: f32 = 2.0; // ASSUMPTION: floor in arrival-time estimate (m/s)
pub const QUEUE_V: f32 = 2.0; // ASSUMPTION: a vehicle following another below this speed (m/s) is in a queue and rolls up to a stop line without a second full stop
pub const STOP_DWELL: f32 = 1.0; // ASSUMPTION: s stopped before a stop-sign driver may go (discharge headway 3-4 s [HCM7] UNVERIFIED)
pub const YIELD_COURTESY_S: f32 = 45.0; // ASSUMPTION: after this wait a driver enters ahead of conflicting vehicles slower than `QUEUE_V` (drivers in a crawling queue let one in), and a driver yielding to a pedestrian who does not step off moves on
pub const YIELD_FALLBACK_S: f32 = 90.0; // ASSUMPTION: bounded-wait deadlock guard: drop approach-gap/FIFO checks. It puts a floor of 3600 / this value (40 veh/h) under every yielding lane; at 45 s the floor of 80 veh/h was above the published capacity at heavy cross flow (validation cases e6, e9 against [Brilon1999])
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
/// Share of drivers that follow live guidance (a navigation app) and so re-evaluate their route at every epoch, per mille. The others keep
/// the route chosen at departure unless it is blocked. 46% of surveyed drivers used navigation apps on regular commute trips, 74 to 78% on
/// infrequent and first-time trips [Guin2021] (Atlanta, N = 237; transfer to this area is an ASSUMPTION).
pub const GUIDED_SHARE: u32 = 460;
/// Indifference band [Mahmassani1987], [Srinivasan2000], [Di2016]: a driver changes route en route only if the new remaining route is cheaper
/// than the current one by more than this fraction. The sources establish the mechanism, not a value for neighborhood trips ([Guin2021] reports
/// that a 3 to 5 min saving was needed to accept a routing change, on trips much longer than these), so the fraction is an ASSUMPTION.
pub const SWITCH_BAND: f32 = 0.2;
/// ASSUMPTION: absolute floor on the saving (s) that a switch needs, so short remaining routes do not flip on a few seconds.
pub const SWITCH_MIN_GAIN_S: f32 = 30.0;
/// ASSUMPTION: most voluntary route changes per trip, and least time between two (s).
pub const MAX_SWITCHES: u16 = 2;
pub const MIN_SWITCH_GAP_S: f64 = 120.0;
/// ASSUMPTION: a driver whose next link has had no room for this long (s) re-routes whatever its class, backtracking allowed.
pub const BLOCKED_REROUTE_S: f32 = 60.0;
pub const EMA_ALPHA: f32 = 0.3; // ASSUMPTION
pub const ROUTE_NOISE: f32 = 0.08; // ASSUMPTION: per-driver perceived-cost noise (+-8%)
pub const TURN_RIGHT_S: f32 = 1.0; // ASSUMPTION: turn penalties for routing (s)
pub const TURN_LEFT_S: f32 = 4.0; // ASSUMPTION
pub const TURN_U_S: f32 = 25.0; // ASSUMPTION
/// Expected control delay (s) per movement at the end of a link, by control type: the router's constants. They live in `data/node-delays.json`, which the demand
/// fit's static assignment (`tools/lib/assign.ts`) reads too, and which `tools/node-delays.ts` rewrites from delays measured in simulation runs.
#[derive(Clone, Copy, Debug)]
pub struct NodeDelays {
    pub signal: f32,
    pub all_way_stop: f32,
    pub minor_stop: f32,
    pub circle: f32,
}
pub fn node_delays() -> NodeDelays {
    static D: std::sync::OnceLock<NodeDelays> = std::sync::OnceLock::new();
    *D.get_or_init(|| {
        let v: serde_json::Value = serde_json::from_str(include_str!("../data/node-delays.json")).expect("data/node-delays.json");
        let g = |k: &str| v[k].as_f64().unwrap_or_else(|| panic!("data/node-delays.json: missing {k}")) as f32;
        NodeDelays { signal: g("signal"), all_way_stop: g("allWayStop"), minor_stop: g("minorStop"), circle: g("circle") }
    })
}

// --- safety surrogates ---
pub const TTC_THRESHOLD: f32 = 1.5; // s, SSAM default [FHWA-SSAM2008]; [Hayward1972], [Mahmud2017] (adjustable)
pub const TTC_CLEAR: f32 = 3.0; // ASSUMPTION: hysteresis so one pair episode is counted once
pub const MPH20: f32 = 8.9408;
pub const MPH25: f32 = 11.176;

// --- stats windows ---
pub const NBINS: usize = 10; // rolling window = 10 bins x 30 s = 5 min
pub const BIN_S: f64 = 30.0;
pub const HIST_BINS: usize = 160; // speed histogram, 0.25 m/s bins

// --- multimodal agents (change multimodal-agents). Values without a verified source in docs/references.md are ASSUMPTION. Sources: [Fitzpatrick2006], [OBrien2022], [Bertulis2014], [Twaddle2016], [Beck2019], [CVC21760], [Lubbe2022]. ---
// Kind code 1 was the bus, which was withdrawn from the simulation; it stays unused so the codes of the other kinds do not change.
pub const KIND_CAR: u8 = 0;
pub const KIND_BIKE: u8 = 2;
pub const KIND_PED: u8 = 3;

// Bicycles (D3). [Twaddle2016] is sourced for desired speed only; its acceleration findings do not map onto the IDM parameters below.
pub const BIKE_LEN: f32 = 1.8; // ASSUMPTION
pub const BIKE_A_RANGE: (f64, f64) = (0.8, 1.4); // ASSUMPTION m/s^2
pub const BIKE_B_RANGE: (f64, f64) = (1.5, 2.5); // ASSUMPTION m/s^2
pub const BIKE_T_RANGE: (f64, f64) = (0.9, 1.4); // ASSUMPTION s
pub const BIKE_S0: f32 = 1.0; // ASSUMPTION m
pub const BIKE_V_MEAN: f64 = 5.23; // m/s, was 4.5. [Twaddle2016] Table 2: unhindered cyclists on green through four Munich junctions (N = 466); literature range of means 3.2-6.9 m/s
pub const BIKE_V_SD: f64 = 1.25; // m/s, was 0.8. [Twaddle2016] Table 2
pub const BIKE_V_MIN: f64 = 2.5; // ASSUMPTION m/s: clip about 2.2 SD below the mean
pub const BIKE_V_MAX: f64 = 8.0; // m/s, was 7.0. ASSUMPTION: clip about 2.2 SD above the mean
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

// Passing a cyclist on a shared link (D3). ASSUMPTION unless a key is given.
pub const LANE_WIDTH_M: f64 = 3.3; // ASSUMPTION: lane width (also used for crossing width, D4); no published urban residential value was read (10-12 ft ranges seen in secondary summaries only)
pub const CAR_WIDTH_M: f32 = 1.8;
pub const BIKE_WIDTH_M: f32 = 0.7;
pub const PASS_DECISION_GAP: f32 = 60.0; // m: distance at which a driver notices a cyclist ahead and decides to pass or follow
pub const PASS_MIN_DV: f32 = 1.5; // m/s: desired-speed advantage that makes a driver want to pass
pub const PASS_TIME_S: f32 = 5.0; // s: oncoming vehicle must be at least this far in time. ASSUMPTION: [Rasch2020] tested 6 s and 9 s gaps on a test track and reports no acceptance threshold
pub const PASS_MIN_CLEAR_M: f32 = 40.0; // m: and at least this far away, to pass using the opposing lane
pub const PASS_MIN_LATERAL_M: f32 = 0.5; // m: least lateral room for passing inside one lane (one-way street)
pub const CLOSE_PASS_CLEAR_M: f32 = 0.9144; // m, was 1.0: three feet, the legal minimum in [CVC21760]. [Beck2019] counts passes under 100 cm (5.9% of 18,527); [Hamm2026] measured mean clearances of 2.2-3.0 m
pub const CLOSE_PASS_DV: f32 = 8.0; // ASSUMPTION m/s: speed difference above this (about 18 mph) is a close pass; [Hamm2026] mean passing speeds are 10 m/s (residential) to 15 m/s but give no threshold

// Pedestrians (D4).
pub const PED_V_MEAN: f64 = 1.44; // m/s, was 1.3. [Fitzpatrick2006] Table 18: median walking speed of 2430 crossing pedestrians
pub const PED_V_SD: f64 = 0.30; // m/s, was 0.25. Derived, not tabulated: normal with median 1.44 and 15th percentile 1.13 m/s ([Fitzpatrick2006] Table 18) gives (1.44 - 1.13) / 1.036
pub const PED_V_MIN: f64 = 0.7; // ASSUMPTION: clip about 2.5 SD below the mean
pub const PED_V_MAX: f64 = 2.2; // was 1.9. ASSUMPTION: clip about 2.5 SD above the mean
// One probability per crossing kind, from staged-pedestrian counts at uncontrolled two-lane 25 mph crossings. Yielding falls with speed
// and lane count ([Bertulis2014]: 75% at 20 mph to 17% at 37 mph on two-lane streets, 9% on one four-lane street; [Fitzpatrick2006]
// Tables 21-22: 61% at one 25 mph site, 17% on average at two 35 mph sites), which this single value does not capture.
pub const PED_YIELD_MARKED: f64 = 0.33; // was 0.6. [OBrien2022] Tables 4-1 to 4-3: 189 yields in 579 events at marked crosswalks, 25 mph (our pooling)
pub const PED_YIELD_UNMARKED: f64 = 0.08; // was 0.3. [OBrien2022] Tables 4-1 to 4-3: 38 yields in 475 events at unmarked crossings, 25 mph (our pooling)
pub const PED_LANE_W: f32 = 3.3; // ASSUMPTION: m per lane: crossing width = lanes (both directions) x this ([Fitzpatrick2006] Table 11 uses 12 ft = 3.66 m for HCM examples)
pub const PED_GAP_MARGIN_S: f32 = 3.0; // s, was 2.0. Start-up time of the HCM pedestrian critical gap, width / speed + 3 s ([Fitzpatrick2006] Table 11, HCM Eq. 18-17)
pub const PED_GAP_SIGMA: f64 = 0.3; // ASSUMPTION: lognormal heterogeneity of the margin (some pedestrians accept short gaps); [Brewer2006] saw 85th percentile accepted gaps of 5.3-9.4 s, below the critical gap for 3.5 ft/s
pub const PED_B_COMF: f32 = 3.0; // m/s^2: comfortable braking that decides whether a driver can still yield
pub const PED_MIN_DECIDE_M: f32 = 6.0; // m
pub const XW_STOP_M: f32 = 2.0; // m: vehicles stop this far before a mid-block crosswalk
pub const PED_WALK_MIN_S: f32 = 7.0; // s: walk interval at typical pedestrian volume ([FHWA-STM2008] Table 5-8)
pub const PED_CLEAR_V: f32 = 1.22; // m/s (4.0 ft/s): pedestrian clearance time = crossing distance / this ([FHWA-STM2008] section 5.3.3)
pub const PED_STANDING_V: f32 = 0.3; // m/s: a vehicle slower than this is treated as standing
pub const PED_MIDBLOCK_BONUS_M: f32 = 0.1; // m: tie-break that makes pedestrians use a marked mid-block crossing
pub const PED_CORNER_M: f32 = 3.0; // m: corner walking distance at a node
pub const PED_OFFSET_M: f64 = 3.8; // m beyond the outer lane center (rendering only)

// Safety (D5)
pub const PET_THRESHOLD: f32 = 1.5; // s. ASSUMPTION: same adjustable value as the TTC threshold; no PET threshold for pedestrian or bicycle encounters was found. PET definition [FHWA-SSAM2008], [Mahmud2017]
pub const PET_MOVING_V: f32 = 2.0; // m/s ASSUMPTION: a user who enters a conflict point slower than this had stopped for the other, which is yielding, not a conflict
pub const PET_ENCOUNTER_S: f32 = 5.0; // ASSUMPTION: an encounter is a vehicle passing a conflict point within this PET
/// Severe-injury (AIS 4+) risk of a struck pedestrian against impact speed (mph), the points reported in the abstract of
/// [Tefft2013]. Between points the index interpolates linearly; below the first point it falls linearly to zero at 0 mph and
/// above the last it extends along the last segment, capped at 1 (interpolation choices are ours, not the paper's).
pub const TEFFT_AIS4: [(f32, f32); 5] = [(17.1, 0.10), (24.9, 0.25), (33.0, 0.50), (40.8, 0.75), (48.1, 0.90)];
/// At-least-serious (MAIS3+F) injury risk of a cyclist impacting the front of a car against closing speed (mph), from the logistic
/// model of [Lubbe2022] Table 3 (intercept -7.467, 0.079 per km/h, 0.047 per year) evaluated at the median cyclist age of 39, at the
/// same five risk levels as `TEFFT_AIS4` and with the same interpolation rules. The severity class is AIS 3+, not AIS 4+, and the
/// data are German.
pub const LUBBE_BIKE_MAIS3: [(f32, f32); 5] = [(27.03, 0.10), (35.67, 0.25), (44.31, 0.50), (52.96, 0.75), (61.60, 0.90)];
pub const PED_EMERGENCY_B: f32 = 8.0; // ASSUMPTION m/s^2: hardest braking a driver uses to stop for a pedestrian already crossing

// --- initial loading (change baseline-calibration). A run starts with agents already en route and a short settle interval before time zero. ---
/// ASSUMPTION: simulated seconds stepped before time zero so signals hold queues and speeds are consistent with the placed agents.
pub const INITIAL_SETTLE_S: f64 = 120.0;
/// ASSUMPTION: expected trip time at time zero is the free-flow route time (including the expected control delay at each node, `DELAY_*`) times this factor.
/// One value for all periods and modes, tuned so that the vehicles on the network at time zero match a 15-minute cold warm-up on the Rockridge network.
pub const INITIAL_CONGESTION: f64 = 1.3;
/// ASSUMPTION: least bumper gap (m) beyond the driver's standstill gap s0 when placing agents; an agent that does not fit behind its leader is shifted back, or skipped.
pub const INITIAL_GAP_EXTRA_M: f32 = 0.5;
/// ASSUMPTION: expected wait (s) at each crosswalk, added to the walking time of a pedestrian trip for the initial count; placed pedestrians that fall on a crossing step wait there.
pub const INITIAL_PED_WAIT_S: f64 = 10.0;
/// Sub-stream tag so the placement draws never touch the per-flow demand streams.
pub const INITIAL_STREAM: u64 = 0x1A17_10AD_5EED_u64;
