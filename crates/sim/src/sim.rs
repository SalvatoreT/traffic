//! Simulation core: microscopic IDM traffic on directed links with node control, routing,
//! interventions and metrics. Pure Rust, deterministic, no I/O.

use crate::eff::{phase_since_green, phase_state, Eff};
use crate::model::*;
use crate::params::*;
use crate::rng::{hash32, Rng};
use crate::route::{self, Router, NO_NOISE};
use crate::topo::*;
use std::collections::VecDeque;

/// Minimum free room (m) between a link's entry point and the tail of its last vehicle before another
/// vehicle may be admitted. ASSUMPTION.
const ROOM_MIN: f32 = 4.0;
const NONE_UID: u32 = u32::MAX;

#[derive(Clone, Copy, Debug)]
struct Drv {
    len: f32,
    fcomp: f32,
    a: f32,
    b: f32,
    t_hw: f32,
    s0: f32,
    gap_f: f32,
}

impl Drv {
    /// Per-driver IDM parameters drawn from urban ranges.
    fn sample(rng: &mut Rng) -> Drv {
        Drv {
            // ASSUMPTION: passenger-car length 4.4-5.0 m.
            len: rng.range(4.4, 5.0) as f32,
            // ASSUMPTION: desired speed = limit x compliance factor ~ N(1.0, 0.12) clipped [0.75, 1.4].
            fcomp: (1.0 + 0.12 * rng.normal()).clamp(0.75, 1.4) as f32,
            // [Kesting2010] Table 1 a=1.4; [references.md 1.1] realistic 0.8-2.5; urban prior 1.0-1.5.
            a: rng.range(1.0, 1.8) as f32,
            // [Kesting2010] b=2.0; urban prior 1.5-2.0.
            b: rng.range(1.5, 2.2) as f32,
            // [Treiber2000] T=1.6, [Kesting2010] T=1.5; urban prior 1.0-1.5.
            t_hw: rng.range(1.0, 1.6) as f32,
            // [Treiber2000] / [Kesting2010] s0 = 2 m.
            s0: rng.range(1.5, 2.5) as f32,
            gap_f: (GAP_SIGMA * rng.normal()).exp() as f32,
        }
    }
}

struct Trip {
    uid: u32,
    origin: u32,
    dest: u32,
    t_arr: f64,
    through: bool,
    noise_seed: u32,
    drv: Drv,
}

struct FlowRt {
    origin: u32,
    dest: u32,
    rate: f64, // veh/s
    rng: Rng,
    next_t: f64,
    through: bool,
}

#[allow(dead_code)]
struct Veh {
    alive: bool,
    in_transit: bool,
    frozen: bool,
    uid: u32,
    link: u32,
    lane: u8,
    pos: f32,
    v: f32,
    acc: f32,
    drv: Drv,
    origin: u32,
    dest: u32,
    through: bool,
    noise_seed: u32,
    route: Vec<u32>,
    ridx: u32,
    t_depart: f64,
    t_enter: f64,
    ff_sum: f32,
    go: bool,
    stop_t: f32,
    wait_t: f32,
    blocked_space: bool,
    registered: bool,
    ttc_leader: u32,
    replan: bool,
    tr_mv: u32,
    tr_frac: f32,
    /// Select-link recording (empty unless enabled): distinct consecutive named streets visited
    /// (name id, direction bucket) and the nominated links traversed as (link, index into the street list).
    sl_streets: Vec<(u32, u8)>,
    sl_hits: Vec<(u32, u32)>,
}

impl Veh {
    fn blank() -> Veh {
        Veh {
            alive: false,
            in_transit: false,
            frozen: false,
            uid: 0,
            link: 0,
            lane: 0,
            pos: 0.0,
            v: 0.0,
            acc: 0.0,
            drv: Drv { len: 4.5, fcomp: 1.0, a: 1.4, b: 2.0, t_hw: 1.3, s0: 2.0, gap_f: 1.0 },
            origin: 0,
            dest: 0,
            through: false,
            noise_seed: 0,
            route: Vec::new(),
            ridx: 0,
            t_depart: 0.0,
            t_enter: 0.0,
            ff_sum: 0.0,
            go: true,
            stop_t: 0.0,
            wait_t: 0.0,
            blocked_space: false,
            registered: false,
            ttc_leader: NONE_UID,
            replan: false,
            tr_mv: 0,
            tr_frac: 0.0,
            sl_streets: Vec::new(),
            sl_hits: Vec::new(),
        }
    }
    #[inline]
    fn next(&self) -> Option<u32> {
        self.route.get(self.ridx as usize).copied()
    }
}

#[derive(Clone, Copy)]
struct Transit {
    veh: u32,
    mv: u32,
    to_link: u32,
    lane: u8,
    t_left: f32,
    t_total: f32,
    v_exit: f32,
}

#[derive(Default)]
struct Stats {
    spawned: u64,
    completed: u64,
    unroutable: u64,
    gridlock_removed: u64,
    trip_time_sum: f64,
    delay_sum: f64,
    veh_m: f64,
    ct_veh_m: f64,
    local_veh_m: f64,
    safety_t: f64,
    safety_vs: f64,
    above20: f64,
    above25: f64,
    hist: Vec<f64>,
    ttc: u64,
    art_t: f64,
    art_vs: f64,
    /// Debug counters (used by tests).
    red_entries: u64,
    clamps: u64,
}

/// A street visited by a recorded trip (consecutive links with the same name collapse into one visit).
#[derive(Clone, Debug, PartialEq)]
pub struct StreetVisit {
    pub name: String,
    /// Travel direction on the first link of the visit: 'N', 'E', 'S' or 'W' (nearest compass axis).
    pub dir: char,
}

/// One trip that traversed at least one nominated link (select-link analysis).
#[derive(Clone, Debug)]
pub struct SelectLinkRecord {
    pub uid: u32,
    pub origin: u32,
    pub dest: u32,
    /// A motorway-class link is attached to the origin / destination node.
    pub origin_freeway: bool,
    pub dest_freeway: bool,
    /// False for trips still in the network: their remaining planned route is appended to `streets`.
    pub completed: bool,
    /// Distinct consecutive named streets over the whole trip, in order (unnamed links are skipped).
    pub streets: Vec<StreetVisit>,
    /// Nominated links traversed in order, with the index in `streets` of the street each lies on.
    pub hits: Vec<(u32, usize)>,
}

struct SelectLinkState {
    is_sel: Vec<bool>,
    street_of: Vec<u32>, // per link: name id, or u32::MAX if unnamed
    dir_of: Vec<u8>,
    names: Vec<String>,
    node_fw: Vec<bool>,
    records: Vec<SelectLinkRecord>,
}

const DIRS: [char; 4] = ['N', 'E', 'S', 'W'];

/// Per-link and per-node diagnostics accumulated over the run (always on; a few adds per step).
pub struct Diagnostics<'a> {
    /// Veh-seconds spent below 1 m/s on each link.
    pub link_stopped_s: &'a [f32],
    /// Excess travel time (s) versus travelling at the effective limit, summed over vehicles.
    pub link_delay_s: &'a [f32],
    /// Vehicles that left each link (cumulative).
    pub link_exits: &'a [u32],
    /// Seconds the head vehicle of some lane waited at the node stop line without permission.
    pub node_wait_s: &'a [f32],
    /// Subset of `node_wait_s` where the only obstacle was no space on the downstream link.
    pub node_space_s: &'a [f32],
    /// Cumulative arterial speed-time and time (s) behind `Metrics::arterial_mean_speed`.
    pub art_t: f64,
    pub art_vs: f64,
    /// Trips waiting to enter the network at each node (entry link full).
    pub node_backlog: Vec<u32>,
}

pub struct Simulation {
    net: Network,
    demand: Demand,
    cfg: Config,
    topo: Topo,
    eff: Eff,
    ivs: Vec<Intervention>,
    flows: Vec<FlowRt>,
    t: f64,
    pending_s: f64,
    step_n: u64,
    vehs: Vec<Veh>,
    free: Vec<u32>,
    uid_next: u32,
    n_alive: usize,
    lanes: Vec<VecDeque<u32>>,
    reserved: Vec<f32>,
    transit: Vec<Vec<Transit>>,
    backlog: Vec<VecDeque<Trip>>,
    awsc: Vec<Vec<u32>>,
    sig_state: Vec<u8>,
    /// Seconds since the green of each signalised approach ended (0 while green).
    sig_since: Vec<f32>,
    /// Permissive lefts that have used the yellow/all-red on each approach this cycle (reset on green).
    sneak: Vec<u8>,
    router: Router,
    link_cost: Vec<f32>,
    ema: Vec<f32>,
    tt_sum: Vec<f32>,
    tt_n: Vec<u32>,
    epoch: u32,
    next_epoch_t: f64,
    st: Stats,
    bin_flow: Vec<f32>,
    bin_ct: Vec<f32>,
    bin_vt: Vec<f32>,
    bin_vs: Vec<f32>,
    cur_bin: usize,
    scratch: Vec<u32>,
    gridlock_log: Vec<(u32, f64)>,
    sl: Option<SelectLinkState>,
    d_link_stopped: Vec<f32>,
    d_link_delay: Vec<f32>,
    d_link_exits: Vec<u32>,
    d_node_wait: Vec<f32>,
    d_node_space: Vec<f32>,
}

fn idm(v: f32, v0: f32, s: f32, dv: f32, a: f32, b: f32, t_hw: f32, s0: f32) -> f32 {
    // [Treiber2000] eq. 6-7 with s1 = 0, delta = 4.
    let v0 = v0.max(0.5);
    let ratio = v / v0;
    let free = 1.0 - ratio * ratio * ratio * ratio; // IDM_DELTA = 4
    let _ = IDM_DELTA;
    let s_star = s0 + (v * t_hw + v * dv / (2.0 * (a * b).sqrt())).max(0.0);
    let s = s.max(0.1);
    let acc = a * (free - (s_star / s) * (s_star / s));
    acc.max(-B_MAX)
}

impl Simulation {
    // ------------------------------------------------------------------ construction

    pub fn new(network_json: &str, demand_json: &str, config_json: &str) -> Result<Simulation, String> {
        let net: Network = serde_json::from_str(network_json).map_err(|e| format!("network: {e}"))?;
        let demand: Demand = serde_json::from_str(demand_json).map_err(|e| format!("demand: {e}"))?;
        let cfg: Config = if config_json.trim().is_empty() {
            Config::default()
        } else {
            serde_json::from_str(config_json).map_err(|e| format!("config: {e}"))?
        };
        Simulation::from_parts(net, demand, cfg)
    }

    pub fn from_parts(net: Network, demand: Demand, cfg: Config) -> Result<Simulation, String> {
        for (i, l) in net.links.iter().enumerate() {
            if l.id as usize != i || l.from as usize >= net.nodes.len() || l.to as usize >= net.nodes.len() {
                return Err(format!("link {i}: bad id or endpoint"));
            }
        }
        for (i, n) in net.nodes.iter().enumerate() {
            if n.id as usize != i {
                return Err(format!("node {i}: id must equal array index"));
            }
        }
        let topo = Topo::new(&net);
        let eff = Eff::derive(&topo, &net, &[]);
        let nl = topo.n_links;
        let nn = topo.n_nodes;
        let mut s = Simulation {
            demand,
            cfg,
            eff,
            ivs: Vec::new(),
            flows: Vec::new(),
            t: 0.0,
            pending_s: 0.0,
            step_n: 0,
            vehs: Vec::new(),
            free: Vec::new(),
            uid_next: 0,
            n_alive: 0,
            lanes: (0..topo.n_lanes).map(|_| VecDeque::new()).collect(),
            reserved: vec![0.0; topo.n_lanes],
            transit: (0..nn).map(|_| Vec::new()).collect(),
            backlog: (0..nn).map(|_| VecDeque::new()).collect(),
            awsc: vec![Vec::new(); nn],
            sig_state: vec![0; nl],
            sig_since: vec![0.0; nl],
            sneak: vec![0; nl],
            router: Router::new(nn),
            link_cost: vec![0.0; nl],
            ema: vec![0.0; nl],
            tt_sum: vec![0.0; nl],
            tt_n: vec![0; nl],
            epoch: 0,
            next_epoch_t: EPOCH_S,
            st: Stats { hist: vec![0.0; HIST_BINS], ..Default::default() },
            bin_flow: vec![0.0; nl * NBINS],
            bin_ct: vec![0.0; nl * NBINS],
            bin_vt: vec![0.0; nl * NBINS],
            bin_vs: vec![0.0; nl * NBINS],
            cur_bin: 0,
            scratch: Vec::new(),
            gridlock_log: Vec::new(),
            sl: None,
            d_link_stopped: vec![0.0; nl],
            d_link_delay: vec![0.0; nl],
            d_link_exits: vec![0; nl],
            d_node_wait: vec![0.0; nn],
            d_node_space: vec![0.0; nn],
            topo,
            net,
        };
        s.init_select_links();
        s.init_flows();
        s.rebuild_effective();
        Ok(s)
    }

    fn init_select_links(&mut self) {
        self.sl = None;
        if self.cfg.select_links.is_empty() {
            return;
        }
        let nl = self.net.links.len();
        let mut is_sel = vec![false; nl];
        for &l in &self.cfg.select_links {
            if (l as usize) < nl {
                is_sel[l as usize] = true;
            }
        }
        let mut names: Vec<String> = Vec::new();
        let mut street_of = Vec::with_capacity(nl);
        let mut dir_of = Vec::with_capacity(nl);
        for l in &self.net.links {
            if l.name.is_empty() {
                street_of.push(u32::MAX);
            } else {
                let id = names.iter().position(|n| *n == l.name).unwrap_or_else(|| {
                    names.push(l.name.clone());
                    names.len() - 1
                });
                street_of.push(id as u32);
            }
            let (a, b) = (l.geometry.first().copied().unwrap_or([0.0, 0.0]), l.geometry.last().copied().unwrap_or([0.0, 1.0]));
            let brg = (b[0] - a[0]).atan2(b[1] - a[1]).to_degrees().rem_euclid(360.0);
            dir_of.push((((brg + 45.0) / 90.0) as usize % 4) as u8);
        }
        let mut node_fw = vec![false; self.net.nodes.len()];
        for l in &self.net.links {
            if l.class == RoadClass::Motorway {
                node_fw[l.from as usize] = true;
                node_fw[l.to as usize] = true;
            }
        }
        self.sl = Some(SelectLinkState { is_sel, street_of, dir_of, names, node_fw, records: Vec::new() });
    }

    /// Select-link hook: vehicle `vid` has just entered link `l`.
    fn sl_enter(&mut self, vid: u32, l: u32) {
        let Some(sl) = &self.sl else { return };
        let sid = sl.street_of[l as usize];
        let is_sel = sl.is_sel[l as usize];
        let dir = sl.dir_of[l as usize];
        let v = &mut self.vehs[vid as usize];
        if sid != u32::MAX && v.sl_streets.last().map_or(true, |s| s.0 != sid) {
            v.sl_streets.push((sid, dir));
        }
        if is_sel {
            let idx = v.sl_streets.len().saturating_sub(1) as u32;
            v.sl_hits.push((l, idx));
        }
    }

    fn sl_record(&self, v: &Veh, completed: bool) -> Option<SelectLinkRecord> {
        let sl = self.sl.as_ref()?;
        if v.sl_hits.is_empty() {
            return None;
        }
        let mut streets: Vec<(u32, u8)> = v.sl_streets.clone();
        if !completed {
            let from = if v.in_transit { (v.ridx as usize).saturating_sub(1) } else { v.ridx as usize };
            for &l in v.route.iter().skip(from) {
                let sid = sl.street_of[l as usize];
                if sid != u32::MAX && streets.last().map_or(true, |s| s.0 != sid) {
                    streets.push((sid, sl.dir_of[l as usize]));
                }
            }
        }
        Some(SelectLinkRecord {
            uid: v.uid,
            origin: v.origin,
            dest: v.dest,
            origin_freeway: sl.node_fw[v.origin as usize],
            dest_freeway: sl.node_fw[v.dest as usize],
            completed,
            streets: streets
                .iter()
                .map(|&(id, d)| StreetVisit { name: sl.names[id as usize].clone(), dir: DIRS[d as usize] })
                .collect(),
            hits: v.sl_hits.iter().map(|&(l, i)| (l, i as usize)).collect(),
        })
    }

    /// Select-link analysis results: one record per trip that traversed a nominated link
    /// (`Config::select_links`), completed trips first (in completion order), then trips still in
    /// the network. Empty when recording is disabled.
    pub fn select_link_records(&self) -> Vec<SelectLinkRecord> {
        let Some(sl) = &self.sl else { return Vec::new() };
        let mut out = sl.records.clone();
        for v in self.vehs.iter().filter(|v| v.alive) {
            if let Some(r) = self.sl_record(v, false) {
                out.push(r);
            }
        }
        out
    }

    /// Fixed-time signal plans: (node, cycle s, sum of critical flow ratios, green s per phase).
    pub fn signal_plans(&self) -> Vec<(u32, f32, f32, Vec<f32>)> {
        self.eff
            .sig
            .iter()
            .enumerate()
            .filter_map(|(n, p)| p.as_ref().map(|p| (n as u32, p.cycle, p.ysum, p.phases.iter().map(|x| x.1).collect())))
            .collect()
    }

    /// Per-link / per-node diagnostics for calibration reports.
    pub fn diagnostics(&self) -> Diagnostics<'_> {
        Diagnostics {
            link_stopped_s: &self.d_link_stopped,
            link_delay_s: &self.d_link_delay,
            link_exits: &self.d_link_exits,
            node_wait_s: &self.d_node_wait,
            node_space_s: &self.d_node_space,
            art_t: self.st.art_t,
            art_vs: self.st.art_vs,
            node_backlog: self.backlog.iter().map(|b| b.len() as u32).collect(),
        }
    }

    fn init_flows(&mut self) {
        self.flows.clear();
        let period = self
            .demand
            .periods
            .iter()
            .find(|p| p.id == self.cfg.period)
            .or_else(|| self.demand.periods.first());
        let nn = self.net.nodes.len() as u32;
        if let Some(p) = period {
            for (k, f) in p.flows.iter().enumerate() {
                let rate = f.veh_per_hour * self.cfg.demand_scale / 3600.0;
                if f.origin >= nn || f.destination >= nn || f.origin == f.destination || rate <= 0.0 {
                    continue;
                }
                let mut rng = Rng::stream(self.cfg.seed, k as u64);
                let next_t = rng.exp(rate);
                let through = self.net.nodes[f.origin as usize].gate && self.net.nodes[f.destination as usize].gate;
                self.flows.push(FlowRt { origin: f.origin, dest: f.destination, rate, rng, next_t, through });
            }
        }
    }

    /// Discard all dynamic state and restart at t = 0, keeping inputs and the current scenario.
    pub fn reset(&mut self) {
        let ivs = self.ivs.clone();
        let net = self.net.clone();
        let demand = self.demand.clone();
        let cfg = self.cfg.clone();
        if let Ok(mut s) = Simulation::from_parts(net, demand, cfg) {
            s.ivs = ivs;
            s.rebuild_effective();
            *self = s;
        }
    }

    /// Replace the scenario with the given interventions JSON (array).
    pub fn set_interventions(&mut self, json: &str) -> Result<(), String> {
        let ivs: Vec<Intervention> = if json.trim().is_empty() {
            Vec::new()
        } else {
            serde_json::from_str(json).map_err(|e| format!("interventions: {e}"))?
        };
        self.ivs = ivs;
        self.rebuild_effective();
        self.reroute_all();
        Ok(())
    }

    fn rebuild_effective(&mut self) {
        let mut eff = Eff::derive(&self.topo, &self.net, &self.ivs);
        if let Some(f) = self.cfg.local_cost_factor {
            eff.set_local_factor(&self.net, f.max(0.1) as f32);
        }
        let has_signal = eff.ctrl.iter().any(|&c| c == Control::Signal);
        if has_signal {
            let est = self.estimate_flows(&eff);
            eff.plan_signals(&self.topo, &self.net, &est);
        }
        self.eff = eff;
        for l in 0..self.topo.n_links {
            self.link_cost[l] = self.eff.ff[l].max(self.ema[l]);
        }
        self.router.invalidate();
        for a in self.awsc.iter_mut() {
            a.clear();
        }
        for v in self.vehs.iter_mut() {
            v.registered = false;
            v.stop_t = 0.0;
        }
        self.update_signals();
    }

    /// All-or-nothing assignment of the demand on free-flow costs, used only for Webster plans.
    fn estimate_flows(&self, eff: &Eff) -> Vec<f32> {
        let mut est = vec![0.0f32; self.topo.n_links];
        let mut r = Router::new(self.topo.n_nodes);
        let mut order: Vec<usize> = (0..self.flows.len()).collect();
        order.sort_by_key(|&i| (self.flows[i].dest, i));
        let mut route = Vec::new();
        let mut last_dest = u32::MAX;
        for i in order {
            let f = &self.flows[i];
            if f.dest != last_dest {
                // Free dest tables from the previous destination to bound memory.
                if last_dest != u32::MAX {
                    r.tables[last_dest as usize] = None;
                }
                r.ensure(f.dest, &self.topo, eff, &eff.ff);
                last_dest = f.dest;
            }
            let table = r.table(f.dest);
            if let Some(b) = route::first_link(table, &self.topo, eff, f.origin, NO_NOISE) {
                route.clear();
                if route::walk(table, &self.topo, eff, b, f.dest, NO_NOISE, &mut route) {
                    let q = (f.rate * 3600.0) as f32;
                    est[b as usize] += q;
                    for &l in &route {
                        est[l as usize] += q;
                    }
                }
            }
        }
        est
    }

    // ------------------------------------------------------------------ accessors

    pub fn time(&self) -> f64 {
        self.t
    }

    pub fn n_links(&self) -> usize {
        self.topo.n_links
    }

    pub fn n_vehicles(&self) -> usize {
        self.n_alive
    }

    /// Per link: 0 n/a, 1 green, 2 yellow, 3 red (state at link end).
    pub fn signals(&self) -> Vec<u8> {
        self.sig_state.clone()
    }

    /// Stride 6: x, y, heading (rad, atan2(dy, dx)), speed (m/s), kind (0 = car), flags (bit0 = through trip).
    pub fn vehicles(&self) -> Vec<f32> {
        let mut out = Vec::with_capacity(self.n_alive * 6);
        for v in self.vehs.iter().filter(|v| v.alive) {
            let (p, h) = if v.in_transit {
                let m = &self.topo.mvs[v.tr_mv as usize];
                let u = v.tr_frac as f64;
                let w0 = (1.0 - u) * (1.0 - u);
                let w1 = 2.0 * u * (1.0 - u);
                let w2 = u * u;
                let x = w0 * m.p0[0] + w1 * m.x[0] + w2 * m.p1[0];
                let y = w0 * m.p0[1] + w1 * m.x[1] + w2 * m.p1[1];
                let dx = 2.0 * (1.0 - u) * (m.x[0] - m.p0[0]) + 2.0 * u * (m.p1[0] - m.x[0]);
                let dy = 2.0 * (1.0 - u) * (m.x[1] - m.p0[1]) + 2.0 * u * (m.p1[1] - m.x[1]);
                ([x, y], dy.atan2(dx))
            } else {
                let off = if (v.lane as usize) >= self.topo.nmain[v.link as usize] { LANE_OFFSET0 - 0.5 * LANE_WIDTH } else { LANE_OFFSET0 + LANE_WIDTH * v.lane as f64 };
                let s = (v.pos - 0.5 * v.drv.len).max(0.0) as f64;
                self.topo.link_point(v.link as usize, s, off)
            };
            out.extend_from_slice(&[p[0] as f32, p[1] as f32, h as f32, v.v, 0.0, if v.through { 1.0 } else { 0.0 }]);
        }
        out
    }

    /// Stride 4 per link: flow veh/h, mean speed m/s, cut-through veh/h (rolling 5 min), density veh/km (instantaneous).
    /// An empty link reports its (effective) speed limit as mean speed.
    pub fn link_stats(&self) -> Vec<f32> {
        let nl = self.topo.n_links;
        let mut out = vec![0.0f32; nl * 4];
        let window = (self.t.min(BIN_S * (NBINS as f64 - 1.0) + (self.t % BIN_S))).max(1.0) as f32;
        for l in 0..nl {
            let (mut f, mut c, mut vt, mut vs) = (0.0, 0.0, 0.0, 0.0);
            for b in 0..NBINS {
                f += self.bin_flow[l * NBINS + b];
                c += self.bin_ct[l * NBINS + b];
                vt += self.bin_vt[l * NBINS + b];
                vs += self.bin_vs[l * NBINS + b];
            }
            let nlanes = self.topo.nlanes(l);
            let mut count = 0usize;
            for k in 0..nlanes {
                count += self.lanes[self.topo.lane_base[l] as usize + k].len();
            }
            out[l * 4] = f * 3600.0 / window;
            out[l * 4 + 1] = if vt > 0.0 { vs / vt } else { self.eff.limit[l] };
            out[l * 4 + 2] = c * 3600.0 / window;
            out[l * 4 + 3] = count as f32 / (self.topo.length[l] / 1000.0);
        }
        out
    }

    pub fn metrics(&self) -> Metrics {
        let st = &self.st;
        let backlog: usize = self.backlog.iter().map(|b| b.len()).sum();
        let mut m = Metrics {
            time: self.t,
            vehicles_in_network: self.n_alive as u64,
            spawned: st.spawned,
            completed_trips: st.completed,
            backlog: backlog as u64,
            unroutable_trips: st.unroutable,
            veh_km: st.veh_m / 1000.0,
            gridlock_removed: st.gridlock_removed,
            ..Default::default()
        };
        if st.completed > 0 {
            m.mean_trip_time = st.trip_time_sum / st.completed as f64;
            m.mean_trip_delay = st.delay_sum / st.completed as f64;
        }
        m.cut_through.veh_km = st.ct_veh_m / 1000.0;
        m.cut_through.share_of_local_veh_km = if st.local_veh_m > 0.0 { st.ct_veh_m / st.local_veh_m } else { 0.0 };
        if st.safety_t > 0.0 {
            m.safety.local_mean_speed = st.safety_vs / st.safety_t;
            m.safety.share_above_20mph = st.above20 / st.safety_t;
            m.safety.share_above_25mph = st.above25 / st.safety_t;
            let target = 0.85 * st.safety_t;
            let mut acc = 0.0;
            for (i, h) in st.hist.iter().enumerate() {
                if acc + h >= target {
                    let frac = if *h > 0.0 { (target - acc) / h } else { 0.0 };
                    m.safety.local_p85_speed = (i as f64 + frac) * 0.25;
                    break;
                }
                acc += h;
            }
        }
        m.safety.ttc_conflicts = st.ttc;
        if st.art_t > 0.0 {
            m.arterial_mean_speed = st.art_vs / st.art_t;
        }
        m
    }

    pub fn metrics_json(&self) -> String {
        serde_json::to_string(&self.metrics()).unwrap_or_else(|_| "{}".into())
    }

    #[doc(hidden)]
    pub fn debug_gridlock(&self) -> &[(u32, f64)] {
        &self.gridlock_log
    }

    /// Diagnostics: head vehicles that have waited longer than `min_wait` seconds.
    #[doc(hidden)]
    pub fn debug_stuck(&self, min_wait: f32) -> Vec<String> {
        let mut out = Vec::new();
        for l in 0..self.topo.n_links {
            for k in 0..self.topo.nlanes(l) {
                if let Some(&id) = self.lanes[self.topo.lane_base[l] as usize + k].front() {
                    let v = &self.vehs[id as usize];
                    if v.wait_t > min_wait {
                        let node = self.topo.link_to[l] as usize;
                        let nxt = v.next();
                        let nxt_room = nxt.map(|b| (0..self.topo.nmain[b as usize]).map(|k| self.lane_room(b, k)).fold(f32::MIN, f32::max));
                        out.push(format!(
                            "link {l} ({} -> {}) len {:.0} lanes {} ctrl {:?} sig {} wait {:.0} next {:?} room {:?} blocked_space {} go {} stop_t {:.1} nq {}",
                            self.topo.link_from[l], node, self.topo.length[l], self.net.links[l].lanes, self.eff.ctrl[node],
                            self.sig_state[l], v.wait_t, nxt, nxt_room, v.blocked_space, v.go, v.stop_t,
                            self.lanes[self.topo.lane_base[l] as usize + k].len()
                        ));
                    }
                }
            }
        }
        out
    }

    /// Check physical invariants: lanes ordered and non-overlapping, node transit bookkeeping consistent.
    pub fn check_invariants(&self) -> Result<(), String> {
        for l in 0..self.topo.n_links {
            let nl = self.topo.nlanes(l);
            for k in 0..nl {
                let q = &self.lanes[self.topo.lane_base[l] as usize + k];
                let mut prev: Option<&Veh> = None;
                for &id in q {
                    let v = &self.vehs[id as usize];
                    if !v.alive || v.in_transit {
                        return Err(format!("link {l}: dead/transit vehicle {id} in lane"));
                    }
                    if v.pos > self.topo.stop_pos[l] + 0.01 {
                        return Err(format!("link {l}: vehicle {id} beyond stop line ({})", v.pos));
                    }
                    if let Some(p) = prev {
                        let gap = p.pos - p.drv.len - v.pos;
                        if gap < -0.01 {
                            return Err(format!("overlap on link {l} lane {k} at t={:.2}: gap {gap:.3}", self.t));
                        }
                    }
                    prev = Some(v);
                }
            }
        }
        Ok(())
    }

    // ------------------------------------------------------------------ stepping

    pub fn step(&mut self, seconds: f64) {
        self.pending_s += seconds;
        while self.pending_s >= DT - 1e-9 {
            self.step_once();
            self.pending_s -= DT;
        }
    }

    fn step_once(&mut self) {
        self.update_signals();
        self.generate_arrivals();
        self.try_spawns();
        self.eval_heads();
        self.compute_accels();
        self.update_vehicles();
        self.update_transit();
        self.t += DT;
        self.step_n += 1;
        let b = ((self.t / BIN_S) as usize) % NBINS;
        if b != self.cur_bin {
            self.cur_bin = b;
            for l in 0..self.topo.n_links {
                let i = l * NBINS + b;
                self.bin_flow[i] = 0.0;
                self.bin_ct[i] = 0.0;
                self.bin_vt[i] = 0.0;
                self.bin_vs[i] = 0.0;
            }
        }
        if self.t >= self.next_epoch_t {
            self.next_epoch_t += EPOCH_S;
            self.epoch_update();
        }
    }

    fn update_signals(&mut self) {
        for n in 0..self.topo.n_nodes {
            if let Some(p) = &self.eff.sig[n] {
                for (ph, links) in p.links.iter().enumerate() {
                    let s = phase_state(p, ph, self.t);
                    let since = phase_since_green(p, ph, self.t);
                    for &l in links {
                        self.sig_state[l as usize] = s;
                        self.sig_since[l as usize] = since;
                        if s == 1 {
                            self.sneak[l as usize] = 0;
                        }
                    }
                }
            }
        }
    }

    // ------------------------------------------------------------------ demand and spawning

    fn generate_arrivals(&mut self) {
        let t_end = self.t + DT;
        for fi in 0..self.flows.len() {
            while self.flows[fi].next_t < t_end {
                let f = &mut self.flows[fi];
                let t_arr = f.next_t;
                f.next_t += f.rng.exp(f.rate);
                let drv = Drv::sample(&mut f.rng);
                let noise_seed = f.rng.u32() & 0x7FFF_FFFF;
                let trip = Trip {
                    uid: self.uid_next,
                    origin: f.origin,
                    dest: f.dest,
                    t_arr,
                    through: f.through,
                    noise_seed,
                    drv,
                };
                self.uid_next += 1;
                self.backlog[trip.origin as usize].push_back(trip);
            }
        }
    }

    fn lane_room(&self, l: u32, lane: usize) -> f32 {
        self.lane_room_ahead(l, lane, 0.0)
    }

    /// Room at the start of a lane, projecting the tail vehicle forward `horizon` s at its current speed (crossing a node takes
    /// a few seconds, during which a moving leader opens up the gap; a standing queue gains nothing).
    fn lane_room_ahead(&self, l: u32, lane: usize, horizon: f32) -> f32 {
        let idx = self.topo.lane_base[l as usize] as usize + lane;
        let tail = match self.lanes[idx].back() {
            Some(&v) => {
                let v = &self.vehs[v as usize];
                v.pos - v.drv.len + v.v * horizon
            }
            None => self.topo.length[l as usize],
        };
        tail - self.topo.emerge_pos[l as usize] - self.reserved[idx]
    }

    /// Room needed on a link before another vehicle may be admitted. Very short links (junction fragments) cannot offer
    /// ROOM_MIN; the requirement scales down to their usable length.
    fn room_need(&self, l: usize) -> f32 {
        ROOM_MIN.min(0.6 * (self.topo.length[l] - self.topo.emerge_pos[l]))
    }

    /// Length (m) of the standing queue at the tail of lane `k` of link `l`, measured back from the stop line.
    fn queue_extent(&self, l: usize, k: usize) -> f32 {
        match self.lanes[self.topo.lane_base[l] as usize + k].back() {
            Some(&v) => {
                let v = &self.vehs[v as usize];
                if v.v < 2.0 {
                    (self.topo.stop_pos[l] - (v.pos - v.drv.len)).max(0.0)
                } else {
                    0.0
                }
            }
            None => 0.0,
        }
    }

    /// Can a left-turner enter the pocket of link `l` now? Storage is limited to POCKET_VEH vehicles, and a standing
    /// queue in the inner through lane longer than the pocket blocks its entrance (ASSUMPTION).
    fn pocket_open(&self, l: usize, need: f32, horizon: f32) -> bool {
        if !self.topo.pocket[l] || self.eff.ctrl[self.topo.link_to[l] as usize] != Control::Signal {
            return false;
        }
        let main = self.topo.nmain[l];
        self.lanes[self.topo.lane_base[l] as usize + main].len() < POCKET_VEH
            && self.lane_room_ahead(l as u32, main, horizon) >= need
            && self.queue_extent(l, 0) <= POCKET_LEN
    }

    /// Lane choice on entering link `l` for a vehicle whose next movement at its far end has kind `kind` [None = unknown/through].
    /// Left-turners use the left lane (or the pocket), right-turners the right lane, through traffic the lane with most room.
    /// Falls back to any lane with room. None only if no lane has room.
    fn pick_lane(&self, l: u32, kind: Option<u8>, horizon: f32) -> Option<usize> {
        let lu = l as usize;
        let main = self.topo.nmain[lu];
        let need = self.room_need(lu);
        if kind == Some(K_LEFT) && self.pocket_open(lu, need, horizon) {
            return Some(main);
        }
        if main >= 2 {
            let pref = match kind {
                Some(K_LEFT) => Some(0),
                Some(K_RIGHT) => Some(main - 1),
                _ => None,
            };
            if let Some(k) = pref {
                if self.lane_room_ahead(l, k, horizon) >= need {
                    return Some(k);
                }
            }
        }
        let mut best: Option<(f32, usize)> = None;
        for k in 0..main {
            let r = self.lane_room_ahead(l, k, horizon);
            if r >= need && best.map_or(true, |(br, _)| r > br + 1e-4) {
                best = Some((r, k));
            }
        }
        best.map(|b| b.1)
    }

    /// Kind of the movement from link `from` onto `to`, if the pair exists.
    fn mv_kind(&self, from: u32, to: Option<u32>) -> Option<u8> {
        let m = self.topo.find_mv(from, to?)?;
        Some(self.topo.mvs[m as usize].kind)
    }

    fn alloc_veh(&mut self) -> u32 {
        self.n_alive += 1;
        if let Some(id) = self.free.pop() {
            id
        } else {
            self.vehs.push(Veh::blank());
            (self.vehs.len() - 1) as u32
        }
    }

    fn remove_vehicle(&mut self, id: u32) {
        let node;
        {
            let v = &mut self.vehs[id as usize];
            if !v.alive {
                return;
            }
            v.alive = false;
            v.route.clear();
            node = self.topo.link_to[v.link as usize] as usize;
        }
        if self.vehs[id as usize].registered {
            self.awsc[node].retain(|&x| x != id);
            self.vehs[id as usize].registered = false;
        }
        self.free.push(id);
        self.n_alive -= 1;
    }

    fn try_spawns(&mut self) {
        for n in 0..self.topo.n_nodes {
            for _ in 0..4 {
                let Some(trip) = self.backlog[n].front() else { break };
                let (dest, seed) = (trip.dest, trip.noise_seed);
                self.router.ensure(dest, &self.topo, &self.eff, &self.link_cost);
                let table = self.router.table(dest);
                let mut route = std::mem::take(&mut self.scratch);
                route.clear();
                let mut first = route::first_link(table, &self.topo, &self.eff, n as u32, seed);
                let mut ok = false;
                if let Some(b) = first {
                    ok = route::walk(table, &self.topo, &self.eff, b, dest, seed, &mut route);
                    if !ok {
                        route.clear();
                        first = route::first_link(table, &self.topo, &self.eff, n as u32, NO_NOISE);
                        if let Some(b2) = first {
                            ok = route::walk(table, &self.topo, &self.eff, b2, dest, NO_NOISE, &mut route);
                            first = Some(b2);
                        }
                    }
                }
                if !ok {
                    self.scratch = route;
                    self.backlog[n].pop_front();
                    self.st.unroutable += 1;
                    continue;
                }
                let b = first.unwrap();
                let Some(lane) = self.pick_lane(b, self.mv_kind(b, route.first().copied()), 0.0) else {
                    self.scratch = route;
                    break;
                };
                let trip = self.backlog[n].pop_front().unwrap();
                let id = self.alloc_veh();
                let v0 = self.eff.limit[b as usize] * trip.drv.fcomp;
                let veh = &mut self.vehs[id as usize];
                let mut old = std::mem::replace(&mut veh.route, route);
                old.clear();
                self.scratch = old;
                *veh = Veh {
                    alive: true,
                    uid: trip.uid,
                    link: b,
                    lane: lane as u8,
                    pos: self.topo.emerge_pos[b as usize],
                    v: v0.min(4.0),
                    drv: trip.drv,
                    origin: trip.origin,
                    dest: trip.dest,
                    through: trip.through,
                    noise_seed: trip.noise_seed,
                    route: std::mem::take(&mut veh.route),
                    t_depart: trip.t_arr,
                    t_enter: self.t,
                    ..Veh::blank()
                };
                let idx = self.topo.lane_base[b as usize] as usize + lane;
                self.lanes[idx].push_back(id);
                self.st.spawned += 1;
                self.sl_enter(id, b);
            }
        }
    }

    // ------------------------------------------------------------------ node permission

    fn eval_heads(&mut self) {
        let nl = self.topo.n_links;
        let rev = self.step_n % 2 == 1;
        for i in 0..nl {
            let l = if rev { nl - 1 - i } else { i };
            let nlanes = self.topo.nlanes(l);
            for k in 0..nlanes {
                let idx = self.topo.lane_base[l] as usize + k;
                if let Some(&vid) = self.lanes[idx].front() {
                    self.eval_head(vid);
                }
            }
        }
    }

    fn eval_head(&mut self, vid: u32) {
        let (l, d, v) = {
            let veh = &self.vehs[vid as usize];
            (veh.link as usize, self.topo.stop_pos[veh.link as usize] - veh.pos, veh.v)
        };
        if d > DECISION_HORIZON {
            let veh = &mut self.vehs[vid as usize];
            veh.go = true;
            veh.stop_t = 0.0;
            veh.wait_t = 0.0;
            veh.blocked_space = false;
            return;
        }
        let node = self.topo.link_to[l] as usize;
        let ctrl = self.eff.ctrl[node];
        let (stopped, waiting) = (v < 0.2 && d < 5.0, v < 0.2 && d < 8.0);
        {
            let veh = &mut self.vehs[vid as usize];
            if stopped {
                veh.stop_t += DT as f32;
            } else {
                veh.stop_t = 0.0;
            }
            if waiting {
                veh.wait_t += DT as f32;
            } else {
                veh.wait_t = 0.0;
            }
        }
        if ctrl == Control::AllWayStop && stopped && !self.vehs[vid as usize].registered {
            self.vehs[vid as usize].registered = true;
            self.awsc[node].push(vid);
        }
        let (go, blocked) = self.permission(vid, l, d, v, ctrl);
        if waiting && !go {
            self.d_node_wait[node] += DT as f32;
            if blocked {
                self.d_node_space[node] += DT as f32;
            }
        }
        let remove = {
            let veh = &mut self.vehs[vid as usize];
            veh.go = go;
            veh.blocked_space = blocked;
            blocked && veh.wait_t > GRIDLOCK_REMOVE_S
        };
        if remove {
            // Gridlock breaker: a vehicle waiting this long for downstream space is removed (counted).
            let idx = self.topo.lane_base[l] as usize + self.vehs[vid as usize].lane as usize;
            self.lanes[idx].pop_front();
            self.remove_vehicle(vid);
            self.st.gridlock_removed += 1;
            self.gridlock_log.push((l as u32, self.t));
        }
    }

    /// (may enter node now, blocked only by downstream space)
    fn permission(&self, vid: u32, l: usize, d: f32, v: f32, ctrl: Control) -> (bool, bool) {
        let veh = &self.vehs[vid as usize];
        match ctrl {
            Control::Signal => {
                let st = self.sig_state[l];
                if st >= 2 && !self.sneaker(veh, l, d, v) {
                    // [Webster1958]-style dilemma rule: continue on yellow only if a comfortable stop is impossible.
                    if st == 3 || !(v * v / (2.0 * YELLOW_DECEL) > d) {
                        return (false, false);
                    }
                }
            }
            Control::AllWayStop | Control::TwoWayStop => {
                if self.eff.must_stop[l] && veh.stop_t < STOP_DWELL {
                    return (false, false);
                }
            }
            _ => {}
        }
        let Some(b) = veh.next() else { return (true, false) };
        let Some(mv) = self.topo.find_mv(l as u32, b) else { return (false, false) };
        if !self.eff.mv_ok[mv as usize] && !veh.replan {
            // Banned/closed after the plan was made; will be re-planned. Hold.
            return (false, false);
        }
        if self.pick_lane(b, None, NODE_CROSS_S).is_none() {
            return (false, true);
        }
        (self.conflict_free(vid, mv, ctrl), false)
    }

    /// Permissive-left "sneaker": a left-turner waiting at the stop line may clear on the yellow or all-red, up to SNEAKERS per
    /// cycle and approach (ASSUMPTION). The in-node and opposing-flow conflict checks still apply.
    fn sneaker(&self, veh: &Veh, l: usize, d: f32, v: f32) -> bool {
        if self.sneak[l] >= SNEAKERS || self.sig_since[l] >= YELLOW + ALL_RED || d > 10.0 || v > 3.0 {
            return false;
        }
        veh.next().and_then(|b| self.topo.find_mv(l as u32, b)).map_or(false, |m| self.topo.mvs[m as usize].kind == K_LEFT)
    }

    fn critical_gap(&self, mv: u32, ctrl: Control, gap_f: f32) -> f32 {
        let m = &self.topo.mvs[mv as usize];
        let base = match ctrl {
            Control::Signal => {
                if m.kind == K_LEFT {
                    TC_MAJOR_LEFT
                } else {
                    TC_UNCONTROLLED
                }
            }
            Control::TwoWayStop => {
                if self.eff.minor[m.a as usize] {
                    match m.kind {
                        K_LEFT | K_UTURN => TC_MINOR_LEFT,
                        K_RIGHT => TC_MINOR_RIGHT,
                        _ => TC_MINOR_THROUGH,
                    }
                } else if m.kind == K_LEFT {
                    TC_MAJOR_LEFT
                } else {
                    TC_UNCONTROLLED
                }
            }
            _ => TC_UNCONTROLLED,
        };
        base * gap_f
    }

    /// Does movement `me` yield to movement `other` (given they conflict)?
    fn yields(&self, me: u32, other: u32, ctrl: Control) -> bool {
        let a = &self.topo.mvs[me as usize];
        let o = &self.topo.mvs[other as usize];
        match ctrl {
            Control::Signal => a.kind == K_LEFT && o.kind != K_LEFT,
            Control::TrafficCircle => self.eff.plevel[o.a as usize] < self.eff.plevel[a.a as usize],
            Control::TwoWayStop | Control::Uncontrolled => {
                let pm = self.eff.plevel[a.a as usize];
                let po = self.eff.plevel[o.a as usize];
                if po < pm {
                    return true;
                }
                if po > pm {
                    return false;
                }
                let rel = norm_angle(o.h_in - a.h_in);
                let opposite = rel.abs() > 2.4;
                if opposite {
                    if a.kind == K_LEFT && o.kind != K_LEFT {
                        return true;
                    }
                    if o.kind == K_LEFT && a.kind != K_LEFT {
                        return false;
                    }
                    return false;
                }
                // Right-before-left: yield to traffic approaching from the right.
                rel > 0.5 && rel < 2.6
            }
            _ => false,
        }
    }

    /// Gap-acceptance / priority / FIFO check for movement `mv` of vehicle `vid`.
    fn conflict_free(&self, vid: u32, mv: u32, ctrl: Control) -> bool {
        let veh = &self.vehs[vid as usize];
        let node = self.topo.mvs[mv as usize].node as usize;
        let circle = ctrl == Control::TrafficCircle && !self.eff.ring_node[node];
        if veh.wait_t < CONFLICT_FALLBACK_S {
            for tr in &self.transit[node] {
                if self.topo.conflicts(mv, tr.mv, circle) {
                    return false;
                }
            }
        }
        if veh.wait_t >= YIELD_FALLBACK_S || (circle && !self.eff.ring_node[node]) {
            return true;
        }
        let l = veh.link;
        if ctrl == Control::AllWayStop {
            for &w in &self.awsc[node] {
                if w == vid {
                    break;
                }
                let wv = &self.vehs[w as usize];
                if let Some(wb) = wv.next() {
                    if let Some(mw) = self.topo.find_mv(wv.link, wb) {
                        if self.topo.conflicts(mv, mw, false) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        let tc = self.critical_gap(mv, ctrl, veh.drv.gap_f);
        for &e in &self.topo.ins[node] {
            if e == l {
                continue;
            }
            if ctrl == Control::Signal && self.sig_state[e as usize] == 3 {
                continue;
            }
            let nlanes = self.topo.nlanes(e as usize);
            for k in 0..nlanes {
                let q = &self.lanes[self.topo.lane_base[e as usize] as usize + k];
                for &x in q.iter().take(4) {
                    let xv = &self.vehs[x as usize];
                    let dx = (self.topo.stop_pos[e as usize] - xv.pos).max(0.0);
                    let tx = dx / xv.v.max(MIN_APPROACH_SPEED);
                    if tx > tc {
                        break;
                    }
                    if ctrl == Control::Signal && self.sig_state[e as usize] == 2 && !(xv.v * xv.v / (2.0 * YELLOW_DECEL) > dx) {
                        continue; // opposing vehicle will stop for the yellow
                    }
                    let Some(xb) = xv.next() else { continue };
                    let Some(mx) = self.topo.find_mv(e, xb) else { continue };
                    if self.topo.conflicts(mv, mx, false) && self.yields(mv, mx, ctrl) {
                        return false;
                    }
                }
            }
        }
        true
    }

    // ------------------------------------------------------------------ dynamics

    fn compute_accels(&mut self) {
        let Simulation { lanes, vehs, eff, topo, st, .. } = self;
        let mut ttc_new = 0u64;
        for l in 0..topo.n_links {
            let nlanes = topo.nlanes(l);
            let stop_pos = topo.stop_pos[l];
            let limit = eff.limit[l];
            let humps = &eff.humps[l];
            let res = topo.is_res_study[l];
            for k in 0..nlanes {
                let q = &lanes[topo.lane_base[l] as usize + k];
                for (i, &vid) in q.iter().enumerate() {
                    let (lead_s, lead_v, lead_uid) = if i > 0 {
                        let ld = &vehs[q[i - 1] as usize];
                        (ld.pos - ld.drv.len, ld.v, ld.uid)
                    } else {
                        (f32::INFINITY, 0.0, NONE_UID)
                    };
                    let veh = &mut vehs[vid as usize];
                    if veh.frozen {
                        veh.acc = 0.0;
                        veh.v = 0.0;
                        continue;
                    }
                    let d = &veh.drv;
                    let mut v0 = (limit * d.fcomp).max(1.0);
                    let mut a_req = f32::INFINITY; // kinematic braking needed to meet a speed constraint ahead
                    for &h in humps.iter() {
                        let dist = h - veh.pos;
                        if dist.abs() > HUMP_ZONE {
                            continue;
                        }
                        // Local desired-speed cap: decelerate at b to the crossing speed, accelerate at a after it.
                        let cap = if dist >= 0.0 {
                            (HUMP_V * HUMP_V + 2.0 * d.b * dist).sqrt()
                        } else {
                            (HUMP_V * HUMP_V + 2.0 * d.a * (-dist)).sqrt()
                        };
                        v0 = v0.min(cap);
                        if dist >= 0.0 && veh.v > HUMP_V {
                            a_req = a_req.min(-(veh.v * veh.v - HUMP_V * HUMP_V) / (2.0 * dist.max(0.5)));
                        }
                    }
                    let (mut s, mut vl) = (f32::INFINITY, 0.0);
                    if i == 0 {
                        if let Some(b) = veh.next() {
                            if let Some(mv) = topo.find_mv(l as u32, b) {
                                let vt = eff.mv_vturn[mv as usize];
                                let dd = (stop_pos - veh.pos).max(0.0);
                                v0 = v0.min((vt * vt + 2.0 * d.b * dd).sqrt());
                                if veh.v > vt {
                                    a_req = a_req.min(-(veh.v * veh.v - vt * vt) / (2.0 * dd.max(0.5)));
                                }
                            }
                        }
                        if !veh.go {
                            s = stop_pos + d.s0 - veh.pos;
                        }
                    } else {
                        s = lead_s - veh.pos;
                        vl = lead_v;
                        let dv = veh.v - vl;
                        if dv > 0.0 && res {
                            let ttc = s / dv;
                            if ttc < TTC_THRESHOLD {
                                if veh.ttc_leader != lead_uid {
                                    veh.ttc_leader = lead_uid;
                                    ttc_new += 1;
                                }
                            } else if ttc >= TTC_CLEAR {
                                veh.ttc_leader = NONE_UID;
                            }
                        } else if dv <= 0.0 {
                            veh.ttc_leader = NONE_UID;
                        }
                    }
                    veh.acc = idm(veh.v, v0, s, veh.v - vl, d.a, d.b, d.t_hw, d.s0).min(a_req).max(-B_MAX);
                }
            }
        }
        st.ttc += ttc_new;
    }

    fn update_vehicles(&mut self) {
        let nl = self.topo.n_links;
        let rev = self.step_n % 2 == 0;
        let dt = DT as f32;
        let cb = self.cur_bin;
        for i in 0..nl {
            let l = if rev { nl - 1 - i } else { i };
            let nlanes = self.topo.nlanes(l);
            let stop_pos = self.topo.stop_pos[l];
            for k in 0..nlanes {
                let qi = self.topo.lane_base[l] as usize + k;
                let mut leader: Option<(f32, f32, f32)> = None; // pos, len, v
                let mut idx = 0usize;
                while idx < self.lanes[qi].len() {
                    let vid = self.lanes[qi][idx];
                    let (mut x, mut v, a) = {
                        let veh = &self.vehs[vid as usize];
                        (veh.pos, veh.v, veh.acc)
                    };
                    let x0 = x;
                    if !self.vehs[vid as usize].frozen {
                        // Ballistic update [Treiber2015] eq. 14-15.
                        if v + a * dt < 0.0 {
                            if a < 0.0 {
                                x += -v * v / (2.0 * a);
                            }
                            v = 0.0;
                        } else {
                            x += v * dt + 0.5 * a * dt * dt;
                            v += a * dt;
                        }
                    }
                    if let Some((lp, ll, lv)) = leader {
                        let maxx = lp - ll - MIN_GAP;
                        if x > maxx {
                            x = if maxx > x0 { maxx } else { x0 };
                            v = v.min(lv);
                            self.st.clamps += 1;
                        }
                    }
                    if idx == 0 {
                        let (go, nxt) = {
                            let veh = &self.vehs[vid as usize];
                            (veh.go, veh.next())
                        };
                        if go && x >= stop_pos - 0.3 {
                            self.vehs[vid as usize].pos = x;
                            self.vehs[vid as usize].v = v;
                            if nxt.is_none() {
                                self.finish_trip(vid, qi);
                                leader = None;
                                continue;
                            }
                            if self.begin_crossing(vid, l, qi) {
                                leader = None;
                                continue;
                            }
                        }
                        if x > stop_pos {
                            x = stop_pos;
                            v = 0.0;
                        }
                    }
                    let dist = (x - x0).max(0.0);
                    {
                        let veh = &mut self.vehs[vid as usize];
                        veh.pos = x;
                        veh.v = v;
                    }
                    // Statistics.
                    let bi = l * NBINS + cb;
                    if v < 1.0 {
                        self.d_link_stopped[l] += dt;
                    }
                    self.d_link_delay[l] += dt * (1.0 - v / self.eff.limit[l]).max(0.0);
                    self.bin_vt[bi] += dt;
                    self.bin_vs[bi] += v * dt;
                    let st = &mut self.st;
                    st.veh_m += dist as f64;
                    let through = self.vehs[vid as usize].through;
                    if self.topo.is_local[l] {
                        st.local_veh_m += dist as f64;
                        if through {
                            st.ct_veh_m += dist as f64;
                        }
                    }
                    if self.topo.is_res_study[l] {
                        let w = DT;
                        st.safety_t += w;
                        st.safety_vs += v as f64 * w;
                        if v > MPH20 {
                            st.above20 += w;
                        }
                        if v > MPH25 {
                            st.above25 += w;
                        }
                        let hb = ((v / 0.25) as usize).min(HIST_BINS - 1);
                        st.hist[hb] += w;
                    }
                    if self.topo.is_arterial[l] {
                        st.art_t += DT;
                        st.art_vs += v as f64 * DT;
                    }
                    leader = Some((x, self.vehs[vid as usize].drv.len, v));
                    idx += 1;
                }
            }
        }
    }

    fn record_link_exit(&mut self, vid: u32, l: usize) {
        let bi = l * NBINS + self.cur_bin;
        self.bin_flow[bi] += 1.0;
        self.d_link_exits[l] += 1;
        let veh = &self.vehs[vid as usize];
        if veh.through && self.topo.is_local[l] {
            self.bin_ct[bi] += 1.0;
        }
        self.tt_sum[l] += (self.t - veh.t_enter) as f32;
        self.tt_n[l] += 1;
    }

    fn link_ff_for(&self, l: usize, fcomp: f32) -> f32 {
        let pen = HUMP_FF_PENALTY * self.eff.humps[l].len() as f32;
        (self.eff.ff[l] - pen) / fcomp + pen
    }

    fn finish_trip(&mut self, vid: u32, qi: usize) {
        let l = self.vehs[vid as usize].link as usize;
        self.record_link_exit(vid, l);
        let ff = self.link_ff_for(l, self.vehs[vid as usize].drv.fcomp);
        let veh = &mut self.vehs[vid as usize];
        veh.ff_sum += ff;
        let tt = self.t - veh.t_depart;
        self.st.trip_time_sum += tt;
        self.st.delay_sum += tt - veh.ff_sum as f64;
        self.st.completed += 1;
        if self.sl.is_some() {
            if let Some(r) = self.sl_record(&self.vehs[vid as usize], true) {
                self.sl.as_mut().unwrap().records.push(r);
            }
        }
        self.lanes[qi].pop_front();
        self.remove_vehicle(vid);
    }

    /// Start crossing the node for the front vehicle of lane `qi` on link `l`. False if conflicts or no space.
    fn begin_crossing(&mut self, vid: u32, l: usize, qi: usize) -> bool {
        let veh = &self.vehs[vid as usize];
        let Some(b) = veh.next() else { return false };
        let Some(mv) = self.topo.find_mv(l as u32, b) else { return false };
        if !self.eff.mv_ok[mv as usize] && !veh.replan {
            return false;
        }
        let node = self.topo.link_to[l] as usize;
        let ctrl = self.eff.ctrl[node];
        if veh.wait_t < CONFLICT_FALLBACK_S {
            for tr in &self.transit[node] {
                if self.topo.conflicts(mv, tr.mv, ctrl == Control::TrafficCircle && !self.eff.ring_node[node]) {
                    return false;
                }
            }
        }
        let after = veh.route.get(veh.ridx as usize + 1).copied();
        let Some(lane) = self.pick_lane(b, self.mv_kind(b, after), NODE_CROSS_S) else { return false };
        if ctrl == Control::Signal && self.sig_state[l] >= 2 && self.topo.mvs[mv as usize].kind == K_LEFT {
            self.sneak[l] = self.sneak[l].saturating_add(1);
        }
        if ctrl == Control::Signal && self.sig_state[l] == 3 {
            self.st.red_entries += 1;
        }
        let m_len = if ctrl == Control::TrafficCircle {
            (self.eff.mv_ff[mv as usize] * self.eff.mv_vturn[mv as usize].min(self.eff.limit[l])).max(4.0)
        } else {
            self.topo.mvs[mv as usize].len
        };
        let vt = self.eff.mv_vturn[mv as usize];
        let (v, a, len, fcomp) = (veh.v, veh.drv.a, veh.drv.len, veh.drv.fcomp);
        let v_exit = vt.min((v * v + 2.0 * a * m_len).sqrt()).max(0.5);
        let t_total = (m_len / (0.5 * (v + v_exit)).max(1.0)).clamp(0.5, 12.0);
        self.record_link_exit(vid, l);
        let ff = self.link_ff_for(l, fcomp) + self.eff.mv_ff[mv as usize];
        self.lanes[qi].pop_front();
        let ridx_next;
        {
            let veh = &mut self.vehs[vid as usize];
            veh.ff_sum += ff;
            veh.ridx += 1;
            veh.in_transit = true;
            veh.tr_mv = mv;
            veh.tr_frac = 0.0;
            veh.v = v_exit;
            veh.stop_t = 0.0;
            veh.wait_t = 0.0;
            veh.ttc_leader = NONE_UID;
            ridx_next = veh.ridx;
        }
        let _ = ridx_next;
        if self.vehs[vid as usize].registered {
            self.awsc[node].retain(|&x| x != vid);
            self.vehs[vid as usize].registered = false;
        }
        let tq = self.topo.lane_base[b as usize] as usize + lane;
        self.reserved[tq] += len + 2.0;
        self.st.veh_m += m_len as f64;
        self.transit[node].push(Transit { veh: vid, mv, to_link: b, lane: lane as u8, t_left: t_total, t_total, v_exit });
        true
    }

    fn update_transit(&mut self) {
        let dt = DT as f32;
        for n in 0..self.topo.n_nodes {
            let mut i = 0;
            while i < self.transit[n].len() {
                let mut tr = self.transit[n][i];
                tr.t_left -= dt;
                let vid = tr.veh;
                if tr.t_left > 0.0 {
                    self.vehs[vid as usize].tr_frac = 1.0 - tr.t_left / tr.t_total;
                    self.transit[n][i] = tr;
                    i += 1;
                    continue;
                }
                // Emerge onto the target lane if there is physical room.
                let qi = self.topo.lane_base[tr.to_link as usize] as usize + tr.lane as usize;
                let len = self.vehs[vid as usize].drv.len;
                // Physical room, plus enough distance to brake at 4 m/s^2 if closing on the new leader.
                let (gap, need) = match self.lanes[qi].back() {
                    Some(&b) => {
                        let bv = &self.vehs[b as usize];
                        let closing = (tr.v_exit - bv.v).max(0.0);
                        (bv.pos - bv.drv.len - self.topo.emerge_pos[tr.to_link as usize], 0.5 + closing * closing / 8.0)
                    }
                    None => (1e9, 0.0),
                };
                if gap < need {
                    self.transit[n][i] = tr;
                    i += 1;
                    continue;
                }
                self.transit[n].remove(i);
                self.reserved[qi] = (self.reserved[qi] - (len + 2.0)).max(0.0);
                {
                    let veh = &mut self.vehs[vid as usize];
                    veh.in_transit = false;
                    veh.link = tr.to_link;
                    veh.lane = tr.lane;
                    veh.pos = self.topo.emerge_pos[tr.to_link as usize];
                    veh.v = tr.v_exit;
                    veh.t_enter = self.t;
                    veh.go = true;
                }
                self.lanes[qi].push_back(vid);
                self.sl_enter(vid, tr.to_link);
                if self.vehs[vid as usize].replan {
                    self.vehs[vid as usize].replan = false;
                    self.replan_vehicle(vid, true);
                }
            }
        }
    }

    // ------------------------------------------------------------------ routing epochs

    /// Re-plan the remaining route of an on-link vehicle. Returns false (and removes the vehicle) if unroutable.
    fn replan_vehicle(&mut self, vid: u32, drop_if_fail: bool) -> bool {
        let (l, dest, seed) = {
            let v = &self.vehs[vid as usize];
            (v.link, v.dest, v.noise_seed)
        };
        self.router.ensure(dest, &self.topo, &self.eff, &self.link_cost);
        let table = self.router.table(dest);
        let mut route = std::mem::take(&mut self.scratch);
        route.clear();
        let mut ok = route::walk(table, &self.topo, &self.eff, l, dest, seed, &mut route);
        if !ok {
            route.clear();
            ok = route::walk(table, &self.topo, &self.eff, l, dest, NO_NOISE, &mut route);
        }
        if ok {
            let veh = &mut self.vehs[vid as usize];
            let mut old = std::mem::replace(&mut veh.route, route);
            veh.ridx = 0;
            old.clear();
            self.scratch = old;
            true
        } else {
            self.scratch = route;
            if drop_if_fail {
                self.drop_vehicle_unroutable(vid);
            }
            false
        }
    }

    fn drop_vehicle_unroutable(&mut self, vid: u32) {
        let (l, lane) = {
            let v = &self.vehs[vid as usize];
            (v.link as usize, v.lane as usize)
        };
        let qi = self.topo.lane_base[l] as usize + lane;
        if let Some(p) = self.lanes[qi].iter().position(|&x| x == vid) {
            self.lanes[qi].remove(p);
        }
        self.remove_vehicle(vid);
        self.st.unroutable += 1;
    }

    fn reroute_all(&mut self) {
        for vid in 0..self.vehs.len() as u32 {
            if !self.vehs[vid as usize].alive {
                continue;
            }
            if self.vehs[vid as usize].in_transit {
                self.vehs[vid as usize].replan = true;
                continue;
            }
            self.replan_vehicle(vid, true);
        }
    }

    fn epoch_update(&mut self) {
        for l in 0..self.topo.n_links {
            if self.tt_n[l] > 0 {
                let obs = self.tt_sum[l] / self.tt_n[l] as f32;
                self.ema[l] = if self.ema[l] <= 0.0 { obs } else { (1.0 - EMA_ALPHA) * self.ema[l] + EMA_ALPHA * obs };
            } else {
                // Nobody left the link this epoch: if vehicles are stuck, cost is at least their age.
                let nlanes = self.topo.nlanes(l);
                let mut age = 0.0f32;
                for k in 0..nlanes {
                    if let Some(&f) = self.lanes[self.topo.lane_base[l] as usize + k].front() {
                        age = age.max((self.t - self.vehs[f as usize].t_enter) as f32);
                    }
                }
                if age > self.ema[l] {
                    self.ema[l] = age;
                } else if self.ema[l] > 0.0 {
                    self.ema[l] = (1.0 - EMA_ALPHA) * self.ema[l] + EMA_ALPHA * self.eff.ff[l];
                }
            }
            self.tt_sum[l] = 0.0;
            self.tt_n[l] = 0;
            self.link_cost[l] = self.eff.ff[l].max(self.ema[l]);
        }
        self.router.invalidate();
        self.epoch += 1;
        for vid in 0..self.vehs.len() as u32 {
            let v = &self.vehs[vid as usize];
            if !v.alive || v.in_transit {
                continue;
            }
            // ASSUMPTION: a deterministic 30% share of en-route vehicles re-plan each epoch.
            if hash32(v.uid, self.epoch) % 1000 < REROUTE_SHARE {
                self.replan_vehicle(vid, true);
            }
        }
    }
}

// ---------------------------------------------------------------------- test hooks

#[cfg(test)]
impl Simulation {
    pub(crate) fn test_place(&mut self, link: u32, lane: usize, pos: f32, v: f32, dest: u32, frozen: bool) -> u32 {
        let id = self.alloc_veh();
        let uid = self.uid_next;
        self.uid_next += 1;
        let mut route = Vec::new();
        self.router.ensure(dest, &self.topo, &self.eff, &self.link_cost);
        let table = self.router.table(dest);
        route::walk(table, &self.topo, &self.eff, link, dest, NO_NOISE, &mut route);
        self.vehs[id as usize] = Veh {
            alive: true,
            uid,
            link,
            lane: lane as u8,
            pos,
            v,
            frozen,
            dest,
            origin: self.topo.link_from[link as usize],
            route,
            t_depart: self.t,
            t_enter: self.t,
            ..Veh::blank()
        };
        let qi = self.topo.lane_base[link as usize] as usize + lane;
        self.lanes[qi].push_back(id);
        self.st.spawned += 1;
        id
    }

    pub(crate) fn test_veh(&self, id: u32) -> (u32, f32, f32, bool) {
        let v = &self.vehs[id as usize];
        (v.link, v.pos, v.v, v.alive)
    }

    pub(crate) fn test_veh_uid(&self, id: u32) -> u32 {
        self.vehs[id as usize].uid
    }

    pub(crate) fn test_set_drv(&mut self, id: u32, fcomp: f32) {
        self.vehs[id as usize].drv.fcomp = fcomp;
    }

    pub(crate) fn test_transit(&self, node: usize) -> Vec<(u32, u32, u32)> {
        self.transit[node]
            .iter()
            .map(|t| (self.vehs[t.veh as usize].uid, self.topo.mvs[t.mv as usize].a, self.topo.mvs[t.mv as usize].b))
            .collect()
    }

    pub(crate) fn test_transit_speeds(&self, node: usize) -> Vec<f32> {
        self.transit[node].iter().map(|t| self.vehs[t.veh as usize].v.max(t.v_exit)).collect()
    }

    pub(crate) fn test_lane_vehicles(&self, link: u32) -> Vec<(u32, f32, f32)> {
        let nl = self.topo.nlanes(link as usize);
        let mut out = Vec::new();
        for k in 0..nl {
            for &id in &self.lanes[self.topo.lane_base[link as usize] as usize + k] {
                let v = &self.vehs[id as usize];
                out.push((v.uid, v.pos, v.v));
            }
        }
        out
    }

    pub(crate) fn test_lanes_of(&self, link: u32) -> Vec<(u32, usize)> {
        let mut out = Vec::new();
        for k in 0..self.topo.nlanes(link as usize) {
            for &id in &self.lanes[self.topo.lane_base[link as usize] as usize + k] {
                out.push((self.vehs[id as usize].uid, k));
            }
        }
        out
    }

    pub(crate) fn test_dest_of_uid(&self, uid: u32) -> Option<u32> {
        self.vehs.iter().find(|v| v.alive && v.uid == uid).map(|v| v.dest)
    }

    pub(crate) fn test_stats(&self) -> (u64, u64) {
        (self.st.red_entries, self.st.clamps)
    }

    pub(crate) fn test_set_ema(&mut self, link: usize, v: f32) {
        self.ema[link] = v;
        self.link_cost[link] = self.eff.ff[link].max(v);
        self.router.invalidate();
    }

    pub(crate) fn test_route_for(&mut self, origin: u32, dest: u32, seed: u32) -> Option<Vec<u32>> {
        self.router.ensure(dest, &self.topo, &self.eff, &self.link_cost);
        let table = self.router.table(dest);
        let b = route::first_link(table, &self.topo, &self.eff, origin, seed)?;
        let mut r = vec![b];
        if route::walk(table, &self.topo, &self.eff, b, dest, seed, &mut r) {
            Some(r)
        } else {
            None
        }
    }

    pub(crate) fn test_topo_stop(&self, l: u32) -> f32 {
        self.topo.stop_pos[l as usize]
    }

    pub(crate) fn test_topo_reverse(&self, l: u32) -> u32 {
        self.net.links[l as usize].reverse.unwrap()
    }

    pub(crate) fn test_topo(&self) -> &Topo {
        &self.topo
    }

    pub(crate) fn test_eff(&self) -> &Eff {
        &self.eff
    }
}
