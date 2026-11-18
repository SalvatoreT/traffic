//! Validation suite: tiny synthetic networks with saturated demand that measure one primitive each
//! (discharge headway, signal capacity, gap acceptance, link entry, node traversal) against a published range.
//! `cargo run --release -p traffic-sim --bin validate` prints the table and writes `data/calibration/validation.md`.
//! Expected values cite keys of `docs/references.md`; a range without a key is an ASSUMPTION and is labeled so.

use crate::model::*;
use crate::sim::Simulation;

pub const DT_S: f64 = 0.25;

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct Case {
    pub id: String,
    pub name: String,
    pub unit: String,
    pub sim: f64,
    pub lo: f64,
    pub hi: f64,
    pub source: String,
    pub note: String,
}

impl Case {
    pub fn pass(&self) -> bool {
        self.sim >= self.lo && self.sim <= self.hi
    }
    /// Sim value over the midpoint of the expected range.
    pub fn ratio(&self) -> f64 {
        self.sim / (0.5 * (self.lo + self.hi)).max(1e-9)
    }
}

fn case(id: &'static str, name: impl Into<String>, unit: &'static str, sim: f64, lo: f64, hi: f64, source: &'static str, note: impl Into<String>) -> Case {
    Case { id: id.into(), name: name.into(), unit: unit.into(), sim, lo, hi, source: source.into(), note: note.into() }
}

// ---------------------------------------------------------------- builders

#[derive(Default)]
pub struct B {
    pub nodes: Vec<Node>,
    pub links: Vec<Link>,
}

impl B {
    pub fn node(&mut self, x: f64, y: f64, control: Control, gate: bool) -> u32 {
        let id = self.nodes.len() as u32;
        self.nodes.push(Node { id, osm_id: id as i64, x, y, control, gate, in_study_area: true, marked_crossing: false, signal_timing: Vec::new() });
        id
    }

    pub fn link(&mut self, a: u32, b: u32, class: RoadClass, lanes: u32, limit: f64, stop: bool) -> u32 {
        let id = self.links.len() as u32;
        let (pa, pb) = (&self.nodes[a as usize], &self.nodes[b as usize]);
        let len = ((pb.x - pa.x).powi(2) + (pb.y - pa.y).powi(2)).sqrt();
        self.links.push(Link {
            id,
            osm_way_id: id as i64,
            from: a,
            to: b,
            reverse: None,
            name: format!("l{id}"),
            class,
            lanes,
            speed_limit: limit,
            length: len,
            geometry: vec![[pa.x, pa.y], [pb.x, pb.y]],
            stop_at_end: stop,
            humps: vec![],
            in_study_area: true,
            bike_lane: false,
            bike_route: false,
            sidewalk: None,
            crossings: vec![],
            left_lanes: 0,
            no_pocket: false,
            from_bearing: None,
            to_bearing: None,
        });
        id
    }

    /// Two-way street; returns (a->b, b->a). Both directions share one street name.
    pub fn two_way(&mut self, a: u32, b: u32, class: RoadClass, lanes: u32, limit: f64) -> (u32, u32) {
        let f = self.link(a, b, class, lanes, limit, false);
        let r = self.link(b, a, class, lanes, limit, false);
        self.links[f as usize].reverse = Some(r);
        self.links[r as usize].reverse = Some(f);
        self.links[f as usize].name = format!("street{f}");
        self.links[r as usize].name = format!("street{f}");
        (f, r)
    }

    pub fn net(self) -> Network {
        Network { version: 1, id: "v".into(), name: "v".into(), nodes: self.nodes, links: self.links, turn_bans: Vec::new() }
    }
}

/// Four-way junction with 300 m legs. W/E carry `major`, S/N `minor`.
pub struct Cross {
    pub c: u32,
    pub w: u32,
    pub e: u32,
    pub s: u32,
    pub n: u32,
    pub w_in: u32,
    pub e_in: u32,
    pub s_in: u32,
    pub n_in: u32,
    pub w_out: u32,
    pub e_out: u32,
    pub s_out: u32,
    pub n_out: u32,
}

pub const V25: f64 = 11.176; // 25 mph

pub fn cross(ctrl: Control, major: RoadClass, major_lanes: u32, minor: RoadClass, minor_lanes: u32, minor_stop: bool) -> (Network, Cross) {
    cross_lim(ctrl, major, major_lanes, minor, minor_lanes, minor_stop, V25)
}

pub fn cross_lim(ctrl: Control, major: RoadClass, major_lanes: u32, minor: RoadClass, minor_lanes: u32, minor_stop: bool, lim: f64) -> (Network, Cross) {
    let mut b = B::default();
    let c = b.node(0.0, 0.0, ctrl, false);
    let w = b.node(-300.0, 0.0, Control::Uncontrolled, true);
    let e = b.node(300.0, 0.0, Control::Uncontrolled, true);
    let s = b.node(0.0, -300.0, Control::Uncontrolled, true);
    let n = b.node(0.0, 300.0, Control::Uncontrolled, true);
    let (w_in, w_out) = b.two_way(w, c, major, major_lanes, lim);
    let (e_in, e_out) = b.two_way(e, c, major, major_lanes, lim);
    let (s_in, s_out) = b.two_way(s, c, minor, minor_lanes, lim);
    let (n_in, n_out) = b.two_way(n, c, minor, minor_lanes, lim);
    if minor_stop {
        b.links[s_in as usize].stop_at_end = true;
        b.links[n_in as usize].stop_at_end = true;
    }
    (b.net(), Cross { c, w, e, s, n, w_in, e_in, s_in, n_in, w_out, e_out, s_out, n_out })
}

pub fn demand(flows: &[(u32, u32, f64)]) -> Demand {
    demand_m(&flows.iter().map(|&(o, d, v)| (o, d, v, FlowMode::Car)).collect::<Vec<_>>())
}

pub fn demand_m(flows: &[(u32, u32, f64, FlowMode)]) -> Demand {
    Demand {
        version: 1,
        area: "v".into(),
        intents: Vec::new(),
        ramps: Vec::new(),
        periods: vec![Period { id: "p".into(), label: "p".into(), flows: flows.iter().map(|&(o, d, v, m)| Flow { origin: o, destination: d, veh_per_hour: v, mode: m, via: None, intent: None }).collect() }],
    }
}

/// The validation cases measure from an empty network (capacities, discharge, delay of the first vehicles), so they start without initial loading.
pub fn cfg(seed: u64) -> Config {
    Config { seed, period: "p".into(), demand_scale: 1.0, initial_load: false, ..Default::default() }
}

/// A running simulation that records the time of every stop-line crossing per link.
pub struct Run {
    pub sim: Simulation,
    pub t: f64,
    last: Vec<u32>,
    /// Crossing times per link.
    pub exits: Vec<Vec<f64>>,
    /// Signal state of watched links at every step.
    watch: Vec<(u32, Vec<u8>)>,
}

impl Run {
    pub fn new(net: Network, d: Demand, cfg: Config) -> Run {
        let nl = net.links.len();
        let sim = Simulation::from_parts(net, d, cfg).expect("valid network");
        Run { sim, t: 0.0, last: vec![0; nl], exits: vec![Vec::new(); nl], watch: Vec::new() }
    }

    pub fn with_ivs(mut self, json: &str) -> Run {
        self.sim.set_interventions(json).unwrap();
        self
    }

    pub fn watching(mut self, links: &[u32]) -> Run {
        self.watch = links.iter().map(|&l| (l, Vec::new())).collect();
        self
    }

    /// Share of `[t0, t1)` in which the watched link showed green.
    pub fn green_frac(&self, link: u32, t0: f64, t1: f64) -> f64 {
        let Some((_, v)) = self.watch.iter().find(|w| w.0 == link) else { return 0.0 };
        let (a, b) = ((t0 / DT_S) as usize, ((t1 / DT_S) as usize).min(v.len()));
        v[a..b].iter().filter(|&&s| s == 1).count() as f64 / (b - a).max(1) as f64
    }

    pub fn advance(&mut self, secs: f64) {
        let n = (secs / DT_S).round() as usize;
        for _ in 0..n {
            self.sim.step(DT_S);
            self.t += DT_S;
            if !self.watch.is_empty() {
                let sg = self.sim.signals();
                for (l, v) in self.watch.iter_mut() {
                    v.push(sg[*l as usize]);
                }
            }
            let ex = self.sim.diagnostics().link_exits;
            for (l, &c) in ex.iter().enumerate() {
                if c != self.last[l] {
                    for _ in self.last[l]..c {
                        self.exits[l].push(self.t);
                    }
                    self.last[l] = c;
                }
            }
        }
    }

    /// Crossings of `links` in `[t0, t1)` as veh/h.
    pub fn rate(&self, links: &[u32], t0: f64, t1: f64) -> f64 {
        let n: usize = links.iter().map(|&l| self.exits[l as usize].iter().filter(|&&t| t >= t0 && t < t1).count()).sum();
        n as f64 / (t1 - t0) * 3600.0
    }
}

fn pin(node: u32, cycle: f64) -> String {
    format!(r#"[{{"type":"signal_timing","node":{node},"cycle":{cycle}}}]"#)
}

// ---------------------------------------------------------------- shared measurement helpers

const WARM: f64 = 300.0;
const MEAS: f64 = 1200.0;

// ---------------------------------------------------------------- (a) saturation flow at a signal

/// (saturation headway s, start-up lost time s, saturation flow veh/h, bursts) of the west approach, 1 lane, 55 s green.
pub fn sat_flow(seed: u64, lim: f64) -> (f64, f64, f64, f64) {
    let (net, x) = cross_lim(Control::Signal, RoadClass::Secondary, 1, RoadClass::Secondary, 1, false, lim);
    let d = demand(&[(x.w, x.e, 4000.0), (x.e, x.w, 4000.0), (x.s, x.n, 4000.0), (x.n, x.s, 4000.0)]);
    let mut r = Run::new(net, d, Config { signal_adapt_min: Some(0.0), ..cfg(seed) }).with_ivs(&pin(x.c, 120.0));
    let mut onsets: Vec<f64> = Vec::new();
    let mut prev = 0u8;
    for _ in 0..(2400.0 / DT_S) as usize {
        r.advance(DT_S);
        let s = r.sim.signals()[x.w_in as usize];
        if s == 1 && prev != 1 {
            onsets.push(r.t);
        }
        prev = s;
    }
    let ex = &r.exits[x.w_in as usize];
    let (mut hs, mut l1, mut nb) = (0.0, 0.0, 0.0);
    for w in onsets.windows(2).skip(2) {
        let t0 = w[0];
        let burst: Vec<f64> = ex.iter().copied().filter(|&t| t >= t0 && t < t0 + 55.0).collect();
        if burst.len() < 15 {
            continue;
        }
        let h = (burst[burst.len() - 1] - burst[3]) / (burst.len() - 4) as f64;
        hs += h;
        l1 += (burst[3] - t0) - 4.0 * h;
        nb += 1.0;
    }
    if nb == 0.0 {
        return (f64::NAN, f64::NAN, 0.0, 0.0);
    }
    (hs / nb, l1 / nb, 3600.0 * nb / hs, nb)
}

// ---------------------------------------------------------------- (b) signalized approach capacity

#[derive(Clone, Copy)]
pub struct Appr {
    pub lanes: u32,
    pub p_left: f64,
    pub p_right: f64,
    pub pocket: bool,
    /// Opposing through flow per lane (veh/h), 0 for none.
    pub opp: f64,
}

/// Approach capacity (veh/h per lane) of the west approach over whole cycles, plus G/C of the west phase.
pub fn approach_cap(a: Appr, seed: u64, extra: &[(u32, u32, f64, FlowMode)], nodes_fn: impl Fn(&mut Network, &Cross)) -> (f64, f64) {
    approach_cap_cfg(a, cfg(seed), extra, nodes_fn)
}

/// `approach_cap` with a given run configuration.
pub fn approach_cap_cfg(a: Appr, run_cfg: Config, extra: &[(u32, u32, f64, FlowMode)], nodes_fn: impl Fn(&mut Network, &Cross)) -> (f64, f64) {
    let class = if a.pocket { RoadClass::Secondary } else { RoadClass::Residential };
    let (mut net, x) = cross(Control::Signal, class, a.lanes, RoadClass::Secondary, a.lanes, false);
    nodes_fn(&mut net, &x);
    let q = 4000.0 * a.lanes as f64;
    let mut fl = vec![
        (x.w, x.e, (q * (1.0 - a.p_left - a.p_right)).max(1.0), FlowMode::Car),
        (x.s, x.n, q, FlowMode::Car),
        (x.n, x.s, q, FlowMode::Car),
    ];
    if a.p_left > 0.0 {
        fl.push((x.w, x.n, q * a.p_left, FlowMode::Car));
    }
    if a.p_right > 0.0 {
        fl.push((x.w, x.s, q * a.p_right, FlowMode::Car));
    }
    fl.push((x.e, x.w, if a.opp > 0.0 { a.opp * a.lanes as f64 } else { 1.0 }, FlowMode::Car));
    fl.extend_from_slice(extra);
    let mut r = Run::new(net, demand_m(&fl), run_cfg).with_ivs(&pin(x.c, 100.0)).watching(&[x.w_in]);
    r.advance(WARM + MEAS);
    let gc = r.green_frac(x.w_in, WARM, WARM + MEAS);
    (r.rate(&[x.w_in], WARM, WARM + MEAS) / a.lanes as f64, gc)
}

/// `approach_cap` with lane changes along a link switched on or off.
pub fn approach_cap_lc(a: Appr, lane_changes: bool) -> (f64, f64) {
    let class = if a.pocket { RoadClass::Secondary } else { RoadClass::Residential };
    let (net, x) = cross(Control::Signal, class, a.lanes, RoadClass::Secondary, a.lanes, false);
    let q = 4000.0 * a.lanes as f64;
    let fl = vec![(x.w, x.e, q * (1.0 - a.p_left), FlowMode::Car), (x.s, x.n, q, FlowMode::Car), (x.n, x.s, q, FlowMode::Car), (x.w, x.n, q * a.p_left, FlowMode::Car), (x.e, x.w, a.opp * a.lanes as f64, FlowMode::Car)];
    let mut r = Run::new(net, demand_m(&fl), Config { lane_changes: Some(lane_changes), ..cfg(1) }).with_ivs(&pin(x.c, 100.0)).watching(&[x.w_in]);
    r.advance(WARM + MEAS);
    let gc = r.green_frac(x.w_in, WARM, WARM + MEAS);
    (r.rate(&[x.w_in], WARM, WARM + MEAS) / a.lanes as f64, gc)
}

/// Right turns on red: (discharge of a one-lane approach whose cars all turn right, veh/h; G/C of its phase) with `cross_q` veh/h per lane of
/// cross-street traffic that the turn merges with, from the left. Cycle 100 s, saturated demand.
pub fn rtor_cap(cross_q: f64, no_rtor: bool, seed: u64) -> (f64, f64) {
    let (net, x) = cross(Control::Signal, RoadClass::Secondary, 1, RoadClass::Secondary, 1, false);
    let fl = [(x.w, x.s, 4000.0, FlowMode::Car), (x.n, x.s, cross_q, FlowMode::Car), (x.s, x.n, cross_q, FlowMode::Car), (x.e, x.w, 1.0, FlowMode::Car)];
    let mut r = Run::new(net, demand_m(&fl), Config { no_right_turn_on_red: no_rtor, signal_adapt_min: Some(0.0), ..cfg(seed) }).with_ivs(&pin(x.c, 100.0)).watching(&[x.w_in]);
    r.advance(WARM + MEAS);
    let gc = r.green_frac(x.w_in, WARM, WARM + MEAS);
    (r.rate(&[x.w_in], WARM, WARM + MEAS), gc)
}

// ---------------------------------------------------------------- (c) two signals

pub fn two_signals(d: f64, adaptive: bool, seed: u64) -> f64 {
    two_signals_served(d, adaptive, seed).0
}

/// `two_signals` with the coordination of closely spaced signals switched off (round 32 comparison).
pub fn two_signals_uncoordinated(d: f64, adaptive: bool, seed: u64) -> f64 {
    two_signals_with(d, adaptive, seed, Some(0.0)).0
}

/// (through flow past the second signal, all four approaches of the first signal, the two cross-street approaches of the first signal), veh/h.
pub fn two_signals_served(d: f64, adaptive: bool, seed: u64) -> (f64, f64, f64) {
    two_signals_with(d, adaptive, seed, None)
}

fn two_signals_with(d: f64, adaptive: bool, seed: u64, coord_max_m: Option<f64>) -> (f64, f64, f64) {
    let mut b = B::default();
    let w = b.node(-300.0, 0.0, Control::Uncontrolled, true);
    let s1 = b.node(0.0, 0.0, Control::Signal, false);
    let s2 = b.node(d, 0.0, Control::Signal, false);
    let e = b.node(d + 300.0, 0.0, Control::Uncontrolled, true);
    let n1 = b.node(0.0, 300.0, Control::Uncontrolled, true);
    let sg1 = b.node(0.0, -300.0, Control::Uncontrolled, true);
    let n2 = b.node(d, 300.0, Control::Uncontrolled, true);
    let sg2 = b.node(d, -300.0, Control::Uncontrolled, true);
    let (w1, _) = b.two_way(w, s1, RoadClass::Secondary, 2, V25);
    let (_, m21) = b.two_way(s1, s2, RoadClass::Secondary, 2, V25);
    let (m2e, _) = b.two_way(s2, e, RoadClass::Secondary, 2, V25);
    let mut cross = Vec::new();
    for (k, (a, c)) in [(n1, s1), (sg1, s1), (n2, s2), (sg2, s2)].into_iter().enumerate() {
        let (inbound, _) = b.two_way(a, c, RoadClass::Residential, 1, V25);
        if k < 2 {
            cross.push(inbound);
        }
    }
    let net = b.net();
    let fl = [(w, e, 4000.0), (e, w, 4000.0), (n1, sg1, 500.0), (sg1, n1, 500.0), (n2, sg2, 500.0), (sg2, n2, 500.0)];
    let c = Config { signal_adapt_min: if adaptive { None } else { Some(0.0) }, coord_max_m, ..cfg(seed) };
    let mut r = Run::new(net, demand(&fl), c).with_ivs(&format!(r#"[{{"type":"signal_timing","node":{s1},"cycle":90}},{{"type":"signal_timing","node":{s2},"cycle":90}}]"#));
    r.advance(WARM + MEAS);
    let cross_rate = r.rate(&cross, WARM, WARM + MEAS);
    (r.rate(&[m2e], WARM, WARM + MEAS), r.rate(&[w1, m21, cross[0], cross[1]], WARM, WARM + MEAS), cross_rate)
}

// ---------------------------------------------------------------- (d) all-way stop

pub fn awsc(seed: u64, extra: &[(u32, u32, f64, FlowMode)], marked: bool) -> (f64, f64) {
    let (mut net, x) = cross(Control::AllWayStop, RoadClass::Residential, 1, RoadClass::Residential, 1, false);
    net.nodes[x.c as usize].marked_crossing = marked;
    let q = 4000.0;
    let mut fl = Vec::new();
    for (o, th, l, rt) in [(x.w, x.e, x.n, x.s), (x.e, x.w, x.s, x.n), (x.s, x.n, x.w, x.e), (x.n, x.s, x.e, x.w)] {
        fl.push((o, th, q * 0.8, FlowMode::Car));
        fl.push((o, l, q * 0.1, FlowMode::Car));
        fl.push((o, rt, q * 0.1, FlowMode::Car));
    }
    fl.extend_from_slice(extra);
    let mut r = Run::new(net, demand_m(&fl), cfg(seed));
    r.advance(WARM + MEAS);
    let ins = [x.w_in, x.e_in, x.s_in, x.n_in];
    let tot = r.rate(&ins, WARM, WARM + MEAS);
    (tot / 4.0, 3600.0 / (tot / 4.0))
}

// ---------------------------------------------------------------- (e) two-way stop

/// Minor-street capacity of one movement (`kind` 0 right, 1 through, 2 left) against `q` veh/h on each major direction.
pub fn twsc(kind: u8, q: f64, seed: u64) -> f64 {
    let (net, x) = cross(Control::TwoWayStop, RoadClass::Secondary, 1, RoadClass::Residential, 1, true);
    let dest = match kind {
        0 => x.e,
        1 => x.n,
        _ => x.w,
    };
    let fl = [(x.w, x.e, q, FlowMode::Car), (x.e, x.w, q, FlowMode::Car), (x.s, dest, 3000.0, FlowMode::Car)];
    let mut r = Run::new(net, demand_m(&fl), cfg(seed));
    r.advance(WARM + 2400.0);
    r.rate(&[x.s_in], WARM, WARM + 2400.0)
}

/// HCM/Harders potential capacity c = vc exp(-vc tc/3600) / (1 - exp(-vc tf/3600)), veh/h.
pub fn gap_capacity(vc: f64, tc: f64, tf: f64) -> f64 {
    vc * (-vc * tc / 3600.0).exp() / (1.0 - (-vc * tf / 3600.0).exp())
}

// ---------------------------------------------------------------- (f) circle

/// Entry flow (veh/h) of the south approach (to the east exit) with `vc` veh/h circulating past it. With `shared_exit` the circulating
/// vehicles leave at the east exit too; otherwise they go on to the north exit, so the entry is measured against the circulating flow
/// alone, as the entry model has it [Rodegerdts2007], and not against two streams merging into one exit lane.
pub fn circle_entry(vc: f64, seed: u64, shared_exit: bool) -> f64 {
    let (net, x) = cross(Control::TrafficCircle, RoadClass::Residential, 1, RoadClass::Residential, 1, false);
    let fl = [(x.w, if shared_exit { x.e } else { x.n }, vc.max(1.0), FlowMode::Car), (x.s, x.e, 3000.0, FlowMode::Car)];
    let mut r = Run::new(net, demand_m(&fl), cfg(seed));
    r.advance(WARM + 2400.0);
    r.rate(&[x.s_in], WARM, WARM + 2400.0)
}

// ---------------------------------------------------------------- (g, h) link

/// (flow through the middle link, insertion rate at the gate), veh/h per lane, on a free three-link chain.
pub fn link_flow(limit: f64, lanes: u32, class: RoadClass, seed: u64) -> (f64, f64) {
    let mut b = B::default();
    let g0 = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let n1 = b.node(600.0, 0.0, Control::Uncontrolled, false);
    let n2 = b.node(1200.0, 0.0, Control::Uncontrolled, false);
    let g3 = b.node(1800.0, 0.0, Control::Uncontrolled, true);
    b.link(g0, n1, class, lanes, limit, false);
    let mid = b.link(n1, n2, class, lanes, limit, false);
    b.link(n2, g3, class, lanes, limit, false);
    let net = b.net();
    let mut r = Run::new(net, demand(&[(g0, g3, 9000.0 * lanes as f64)]), cfg(seed));
    r.advance(120.0);
    let s0 = r.sim.metrics().spawned;
    r.advance(600.0);
    let spawned = r.sim.metrics().spawned - s0;
    (r.rate(&[mid], 120.0, 720.0) / lanes as f64, spawned as f64 / 600.0 * 3600.0 / lanes as f64)
}

/// Flow (veh/h) on the exit link of an uncontrolled merge of two saturated single-lane approaches onto an exit of `exit_lanes` lanes.
pub fn merge_flow(exit_lanes: u32, seed: u64) -> f64 {
    let mut b = B::default();
    let c = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let w = b.node(-600.0, 0.0, Control::Uncontrolled, true);
    let s = b.node(0.0, -600.0, Control::Uncontrolled, true);
    let e = b.node(600.0, 0.0, Control::Uncontrolled, true);
    b.link(w, c, RoadClass::Secondary, 1, 15.65, false);
    b.link(s, c, RoadClass::Secondary, 1, 15.65, false);
    let out = b.link(c, e, RoadClass::Secondary, exit_lanes, 15.65, false);
    let net = b.net();
    let mut r = Run::new(net, demand(&[(w, e, 3000.0), (s, e, 3000.0)]), cfg(seed));
    r.advance(720.0);
    r.rate(&[out], 120.0, 720.0)
}

/// Flow (veh/h) past a lane drop: a saturated link of `lanes_in` lanes continues as a single-lane link of the same road (one movement at the node).
pub fn lane_drop_flow(lanes_in: u32, seed: u64) -> f64 {
    let mut b = B::default();
    let g0 = b.node(-600.0, 0.0, Control::Uncontrolled, true);
    let c = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let e = b.node(600.0, 0.0, Control::Uncontrolled, true);
    b.link(g0, c, RoadClass::Secondary, lanes_in, 15.65, false);
    let out = b.link(c, e, RoadClass::Secondary, 1, 15.65, false);
    let net = b.net();
    let mut r = Run::new(net, demand(&[(g0, e, 4000.0)]), cfg(seed));
    r.advance(720.0);
    r.rate(&[out], 120.0, 720.0)
}

/// A gate feeds a 3-lane link that forks at an uncontrolled node into two 2-lane exits. Exit A drops to one lane further on and, offered `qa`
/// veh/h above what that lane passes, queues back to the gate; exit B is offered `qb` veh/h and is free. Returns the flow
/// (veh/h) on exit B from 720 to 3,120 s: the gate stands for a multilane road, so trips bound for B must not wait behind trips bound for A.
pub fn gate_fork_flow(qa: f64, qb: f64, seed: u64) -> f64 {
    let mut b = B::default();
    let g0 = b.node(-300.0, 0.0, Control::Uncontrolled, true);
    let c = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let a1 = b.node(300.0, 120.0, Control::Uncontrolled, false);
    let ga = b.node(600.0, 120.0, Control::Uncontrolled, true);
    let gb = b.node(600.0, -120.0, Control::Uncontrolled, true);
    b.link(g0, c, RoadClass::Secondary, 3, 15.65, false);
    b.link(c, a1, RoadClass::Secondary, 2, 15.65, false);
    b.link(a1, ga, RoadClass::Secondary, 1, 15.65, false);
    let lb = b.link(c, gb, RoadClass::Secondary, 2, 15.65, false);
    let net = b.net();
    let mut r = Run::new(net, demand(&[(g0, ga, qa), (g0, gb, qb)]), cfg(seed));
    r.advance(3120.0);
    r.rate(&[lb], 720.0, 3120.0)
}

// ---------------------------------------------------------------- (l) lane changes along a link

/// A two-lane link 600 m long whose left lane is blocked 400 m in by a standing vehicle, with `q` veh/h offered: (veh/h past the
/// obstruction from 600 to 3,600 s, vehicles standing behind it at the end).
pub fn blocked_lane(q: f64, lane_changes: bool, seed: u64) -> (f64, usize) {
    let mut b = B::default();
    let g0 = b.node(-600.0, 0.0, Control::Uncontrolled, true);
    let c = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let e = b.node(600.0, 0.0, Control::Uncontrolled, true);
    let l = b.link(g0, c, RoadClass::Secondary, 2, 15.65, false);
    let out = b.link(c, e, RoadClass::Secondary, 2, 15.65, false);
    let net = b.net();
    let mut r = Run::new(net, demand(&[(g0, e, q)]), Config { lane_changes: Some(lane_changes), ..cfg(seed) });
    let bpos = 400.0f32;
    let buid = r.sim.place_obstacle(l, 0, bpos, out);
    r.advance(3600.0);
    let stuck = r.sim.link_occupants(l).iter().filter(|&&(u, p, v)| u != buid && p < bpos && v < 0.5).count();
    (r.rate(&[out], 600.0, 3600.0), stuck)
}

// ---------------------------------------------------------------- (i) off-ramp

/// Discharge (veh/h per lane) of a one-lane exit ramp that flares to two lanes at a signalized terminal, and G/C of the ramp phase.
pub fn off_ramp(seed: u64) -> (f64, f64) {
    let mut b = B::default();
    let m0 = b.node(-1000.0, 0.0, Control::Uncontrolled, true);
    let gore = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let m1 = b.node(1000.0, 0.0, Control::Uncontrolled, true);
    let flare = b.node(300.0, -400.0, Control::Uncontrolled, false);
    let t = b.node(300.0, -500.0, Control::Signal, false);
    let w = b.node(0.0, -500.0, Control::Uncontrolled, true);
    let e = b.node(600.0, -500.0, Control::Uncontrolled, true);
    b.link(m0, gore, RoadClass::Motorway, 2, 29.0, false);
    b.link(gore, m1, RoadClass::Motorway, 2, 29.0, false);
    b.link(gore, flare, RoadClass::Motorway, 1, 20.0, false);
    let term = b.link(flare, t, RoadClass::Secondary, 2, 15.0, false);
    b.two_way(w, t, RoadClass::Secondary, 2, V25);
    b.two_way(e, t, RoadClass::Secondary, 2, V25);
    let net = b.net();
    // The ramp competes with the cross street for green; the cross street is saturated too.
    let fl = [(m0, w, 1500.0, FlowMode::Car), (m0, e, 1500.0, FlowMode::Car), (w, e, 4000.0, FlowMode::Car), (e, w, 4000.0, FlowMode::Car), (m0, m1, 3000.0, FlowMode::Car)];
    let mut r = Run::new(net, demand_m(&fl), cfg(seed)).with_ivs(&pin(t, 100.0)).watching(&[term]);
    r.advance(WARM + MEAS);
    let gc = r.green_frac(term, WARM, WARM + MEAS);
    (r.rate(&[term], WARM, WARM + MEAS) / 2.0, gc)
}

// ---------------------------------------------------------------- (k) node traversal

/// Mean trip time over a path with one junction minus the same path as one link, s.
pub fn node_delay(kind: u8, seed: u64) -> f64 {
    let run = |through_node: bool| -> f64 {
        let mut b = B::default();
        let w = b.node(-300.0, 0.0, Control::Uncontrolled, true);
        let c = b.node(0.0, 0.0, Control::Uncontrolled, false);
        let (e, n, s) = (b.node(300.0, 0.0, Control::Uncontrolled, true), b.node(0.0, 300.0, Control::Uncontrolled, true), b.node(0.0, -300.0, Control::Uncontrolled, true));
        b.two_way(w, c, RoadClass::Secondary, 1, V25);
        b.two_way(c, e, RoadClass::Secondary, 1, V25);
        b.two_way(c, n, RoadClass::Secondary, 1, V25);
        b.two_way(c, s, RoadClass::Secondary, 1, V25);
        let dest = match kind {
            0 => e,
            1 => n,
            _ => s,
        };
        if !through_node {
            // Straight reference: gate to gate on a single link of the same length.
            let mut b2 = B::default();
            let a = b2.node(0.0, 0.0, Control::Uncontrolled, true);
            let z = b2.node(600.0, 0.0, Control::Uncontrolled, true);
            b2.link(a, z, RoadClass::Secondary, 1, V25, false);
            let mut r = Run::new(b2.net(), demand(&[(a, z, 200.0)]), cfg(seed));
            r.advance(2400.0);
            return r.sim.metrics().mean_trip_time;
        }
        let mut r = Run::new(b.net(), demand(&[(w, dest, 200.0)]), cfg(seed));
        r.advance(2400.0);
        r.sim.metrics().mean_trip_time
    };
    run(true) - run(false)
}

/// Permitted left-turn capacity (veh/h) of a lane with opposing flow `vo` veh/h at a signal of cycle `c` s whose phase shows green for `g` s
/// [Fambro1991]: left-turners use gaps only once the opposing queue (arrivals over the red, discharged at `s` veh/h) has cleared, then
/// turn at the gap-acceptance rate of Drew's model with critical gap `tc` and turning headway `h` (the HCM/Harders form of `gap_capacity`),
/// and `ns` sneakers clear in the change interval each cycle. The opposing flow is spread evenly over `lanes` lanes.
pub fn permitted_left_cap(vo: f64, lanes: f64, g: f64, c: f64, tc: f64, h: f64, ns: f64, s: f64) -> f64 {
    let (q, sv) = (vo / lanes / 3600.0, s / 3600.0);
    let gq = q * (c - g) / (sv - q).max(1e-6);
    let gu = (g - gq).max(0.0);
    3600.0 / c * (gu * gap_capacity(vo.max(1.0), tc, h) / 3600.0 + ns)
}

/// Expected per-lane capacity (veh/h) of a pocketed signal approach with permissive left turns: the smaller of the permitted-left capacity over
/// the left share and s x green share over the through share [Fambro1991] [FHWA-SIG2004]. The band takes the parameters of p1 to p3 (critical gap
/// 5.1 s, turning headway 2.57 s, 0.88 sneakers, s 1,500 for the low end; 4.5 s, 2.24 s, 2 sneakers, s 2,000 for the high end). ASSUMPTIONS:
/// the lower bound is 0.8 of the low end, and the class-rule 3-vehicle pocket does not hold the through lane enough to push capacity below the band.
/// The opposing flow is `opp_per_lane` on each of `lanes` lanes.
fn left_band(lanes: u32, p_left: f64, opp_per_lane: f64, gc: f64) -> (f64, f64) {
    let n = lanes as f64;
    let q = |tc: f64, h: f64, ns: f64, s: f64| {
        let lcap = permitted_left_cap(opp_per_lane * n, n, 100.0 * gc, 100.0, tc, h, ns, s);
        (lcap / p_left).min(s * gc * n / (1.0 - p_left)) / n
    };
    (0.8 * q(5.1, 2.57, 0.88, 1500.0), q(4.5, 2.24, 2.0, 2000.0))
}

/// Mean over seeds 1 to 10 of a case's capacity and green share, so that a seed-to-seed swing of about 5% does not decide the verdict.
fn ten_seed_mean(f: impl Fn(u64) -> (f64, f64)) -> (f64, f64) {
    let v: Vec<(f64, f64)> = (1..=10).map(f).collect();
    (v.iter().map(|x| x.0).sum::<f64>() / 10.0, v.iter().map(|x| x.1).sum::<f64>() / 10.0)
}

// ---------------------------------------------------------------- route choice

/// Perception seed of the `i`-th driver of a route-choice case.
fn driver_seed(i: u32) -> u32 {
    crate::rng::hash32(i, 0x00A1_1CE5) & 0x7FFF_FFFF
}

fn route_sim(b: B) -> Simulation {
    Simulation::from_parts(b.net(), demand(&[]), cfg(1)).expect("valid network")
}

/// Route-choice case (a): two routes of equal cost from O to D. Route A has `k` junctions, each with a one-way side link onto route B that
/// costs about `rung_s` more than staying; route B has none. Returns (share of drivers that drive A throughout under the perceived-cost model,
/// the same under the per-node rule used before round 31, cost of A, extra cost of leaving A at its first junction).
pub fn ladder(k: usize, len_m: f64, rung_s: f64, drivers: u32) -> (f64, f64, f64, f64) {
    let v = V25;
    let mut b = B::default();
    let (block, h) = (100.0, 0.5 * (rung_s - 10.0).max(1.0) * v);
    let span = block * (k as f64 + 1.0);
    let o = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let d = b.node(2.0 * len_m + span, 0.0, Control::Uncontrolled, true);
    let side = |b: &mut B, y: f64| (0..=k + 1).map(|i| b.node(len_m + i as f64 * block, y, Control::Uncontrolled, false)).collect::<Vec<u32>>();
    let (an, sn) = (side(&mut b, -h), side(&mut b, h));
    let mut a_links = vec![b.link(o, an[0], RoadClass::Secondary, 1, v, false)];
    let s0 = b.link(o, sn[0], RoadClass::Secondary, 1, v, false);
    for i in 0..=k {
        a_links.push(b.link(an[i], an[i + 1], RoadClass::Secondary, 1, v, false));
        b.link(sn[i], sn[i + 1], RoadClass::Secondary, 1, v, false);
    }
    let a_end = b.link(an[k + 1], d, RoadClass::Secondary, 1, v, false);
    let s_end = b.link(sn[k + 1], d, RoadClass::Secondary, 1, v, false);
    let rungs: Vec<u32> = (1..=k).map(|i| b.link(an[i], sn[i], RoadClass::Secondary, 1, v, false)).collect();
    let mut sim = route_sim(b);
    let mut a_route = a_links.clone();
    a_route.push(a_end);
    let mut via1 = a_links[..2].to_vec();
    via1.push(rungs[0]);
    let s_rest: Vec<u32> = sim.departure_route(sn[1], d, crate::route::NO_NOISE).unwrap_or_default();
    via1.extend(s_rest);
    let (ca, c1) = (sim.route_cost(&a_route) as f64, sim.route_cost(&via1) as f64);
    let _ = (s0, s_end);
    let pure_a = |r: &[u32]| r == a_route.as_slice();
    let (mut new_a, mut old_a) = (0u32, 0u32);
    for i in 0..drivers {
        let sd = driver_seed(i);
        new_a += sim.departure_route(o, d, sd).is_some_and(|r| pure_a(&r)) as u32;
        old_a += sim.departure_route_per_node(o, d, sd, 0.08).is_some_and(|r| pure_a(&r)) as u32;
    }
    (new_a as f64 / drivers as f64, old_a as f64 / drivers as f64, ca, c1 - ca)
}

/// Route-choice case (b): two routes with no link in common, B slower than A by `extra_s` on its second link. Returns (share of drivers on B
/// under the perceived-cost model, under the per-node rule used before round 31, cost of A, cost of B).
pub fn two_routes(len_m: f64, extra_s: f64, drivers: u32) -> (f64, f64, f64, f64) {
    let v = V25;
    let mut b = B::default();
    let o = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let d = b.node(len_m, 0.0, Control::Uncontrolled, true);
    let ma = b.node(0.5 * len_m, -0.05 * len_m, Control::Uncontrolled, false);
    let mb = b.node(0.5 * len_m, 0.05 * len_m, Control::Uncontrolled, false);
    let a1 = b.link(o, ma, RoadClass::Secondary, 1, v, false);
    let a2 = b.link(ma, d, RoadClass::Secondary, 1, v, false);
    let b1 = b.link(o, mb, RoadClass::Secondary, 1, v, false);
    let half = b.links[b1 as usize].length;
    let b2 = b.link(mb, d, RoadClass::Secondary, 1, half / (half / v + extra_s), false);
    let mut sim = route_sim(b);
    let (ca, cb) = (sim.route_cost(&[a1, a2]) as f64, sim.route_cost(&[b1, b2]) as f64);
    let (mut new_b, mut old_b) = (0u32, 0u32);
    for i in 0..drivers {
        let sd = driver_seed(i);
        new_b += sim.departure_route(o, d, sd).is_some_and(|r| r.first() == Some(&b1)) as u32;
        old_b += sim.departure_route_per_node(o, d, sd, 0.08).is_some_and(|r| r.first() == Some(&b1)) as u32;
    }
    (new_b as f64 / drivers as f64, old_b as f64 / drivers as f64, ca, cb)
}

/// Standard normal distribution function.
fn phi(x: f64) -> f64 {
    0.5 * libm::erfc(-x / std::f64::consts::SQRT_2)
}

pub fn route_choice_cases(out: &mut Vec<Case>) {
    let beta = crate::params::ROUTE_DISPERSION_S as f64;
    let n = 4000;
    // (a) The trip is long enough (about 2,000 x beta s before the side links) that leaving A costs 2.5 standard deviations of the probit
    // difference, so the perceived-cost model should keep about half the drivers on A however many side links A has, while a +/-8% factor on
    // the remaining cost still reaches past the extra cost at each junction.
    let len = 2000.0 * beta.max(0.5) * V25;
    let rung = 2.5 * (beta * 2.0 * 2000.0 * beta.max(0.5)).sqrt();
    for (id, k) in [("r1", 1usize), ("r2", 20)] {
        let (new_a, old_a, ca, extra) = ladder(k, len, rung, n);
        out.push(case(id, format!("Route choice: two routes of equal cost, one with {k} junction(s) offering a side link onto the other (+{extra:.0} s): share that stays on it"), "share", new_a, 0.45, 0.55, "Sheffi1985", format!("perceived arc costs N(t, beta t) drawn once per driver, beta {beta} s [DaganzoSheffi1977]; route variance beta x cost whatever the number of junctions (eq. 11.14b), so the share is about 0.5 less the drivers on a mixed route (Phi(-2.5) each, the band +/-0.05 is an ASSUMPTION); route cost {ca:.0} s; the per-node rule used before round 31 (+/-8% on the remaining cost at every node) keeps {old_a:.3}, {n} drivers")));
    }
    // (b) Two routes with no link in common: the probit share of the costlier route is Phi(-(cB - cA) / sqrt(beta (cA + cB))) [Sheffi1985] eq. 11.20.
    for (id, extra) in [("r3", 15.0), ("r4", 30.0), ("r5", 60.0), ("r6", 120.0)] {
        let (new_b, old_b, ca, cb) = two_routes(6700.0, extra, n);
        let p = phi(-(cb - ca) / (beta * (ca + cb)).sqrt());
        out.push(case(id, format!("Route choice: share on a route {:.0} s ({:.0}%) costlier than the other, no link in common", cb - ca, 100.0 * (cb - ca) / ca), "share", new_b, (p - 0.03).max(0.0), p + 0.03, "Sheffi1985", format!("probit prediction Phi(-(cB - cA) / sqrt(beta (cA + cB))) = {p:.3} (eq. 11.20, beta {beta} s, cA {ca:.0} s); band +/-0.03 for {n} drivers (ASSUMPTION); the per-node rule used before round 31 gives {old_b:.3}")));
    }
}

pub fn run_all() -> Vec<Case> {
    let mut out = Vec::new();
    let (h, l1, s, nb) = sat_flow(1, V25);
    out.push(case("a1", "Signal: saturation headway, 1 lane, standing queue, 55 s green, 25 mph", "s", h, 3600.0 / 2000.0, 3600.0 / 1500.0, "FHWA-SIG2004", format!("{nb} green bursts, vehicles 5 and later; observed saturation flow 1,500 to 2,000 (ideal 1,900 = 1.89 s)")));
    out.push(case("a2", "Signal: saturation flow per lane, 25 mph", "veh/h", s, 1500.0, 2000.0, "FHWA-SIG2004", "ideal 1,900; observed 1,500 to 2,000; ratio is to the range midpoint, 0.89 of the ideal 1,900"));
    let (_, _, s35, _) = sat_flow(1, 15.65);
    out.push(case("a4", "Signal: saturation flow per lane, 35 mph", "veh/h", s35, 1500.0, 2000.0, "FHWA-SIG2004", "same lane at a 35 mph limit"));
    out.push(case("a3", "Signal: start-up lost time", "s", l1, 1.0, 3.0, "FHWA-STM2008", "about 2 s; the sim has no response delay at the onset of green"));
    let base = Appr { lanes: 1, p_left: 0.0, p_right: 0.0, pocket: true, opp: 0.0 };
    // (id, name, approach, expected kind): through-limited cases scale s x green share, left-limited ones use `left_band`.
    for (id, nm, a, src) in [
        ("b1", "Signal capacity, 1 lane through", base, "FHWA-SIG2004"),
        ("b2", "Signal capacity, 2 lanes through", Appr { lanes: 2, ..base }, "FHWA-SIG2004"),
        ("b3", "1 lane, 10% left, pocket, opposing 500/lane", Appr { p_left: 0.1, opp: 500.0, ..base }, "Fambro1991"),
        ("b4", "1 lane, 20% left, pocket, opposing 500/lane", Appr { p_left: 0.2, opp: 500.0, ..base }, "Fambro1991"),
        ("b9", "2 lanes, 10% left, pocket, opposing 500/lane", Appr { lanes: 2, p_left: 0.1, opp: 500.0, ..base }, "Fambro1991"),
                ("b5", "1 lane, 10% left, no pocket, opposing 500/lane", Appr { p_left: 0.1, pocket: false, opp: 500.0, ..base }, "ASSUMPTION"),
        ("b6", "1 lane, 20% left, no pocket, opposing 500/lane", Appr { p_left: 0.2, pocket: false, opp: 500.0, ..base }, "ASSUMPTION"),
        ("b12", "1 lane, all left turns, no opposing traffic (a protected left)", Appr { p_left: 1.0, ..base }, "ASSUMPTION"),
        ("b7", "1 lane, 10% right", Appr { p_right: 0.1, ..base }, "ASSUMPTION"),
        ("b8", "1 lane, 20% right", Appr { p_right: 0.2, ..base }, "ASSUMPTION"),
    ] {
        let ten = id == "b4";
        let (cap, gc) = if ten { ten_seed_mean(|sd| approach_cap(a, sd, &[], |_, _| {})) } else { approach_cap(a, 1, &[], |_, _| {}) };
        // Per-lane capacity: s x green share, s from the observed range 1,500 to 2,000 [FHWA-SIG2004]; the ideal 1,900 is the upper reference.
        let (lo, hi, note) = if src == "Fambro1991" {
            let (l, h) = left_band(a.lanes, a.p_left, a.opp, gc);
            (l, h, "min(permitted-left capacity over the left share, s x green share over the through share) [Fambro1991] with the band of p1 to p3 (critical gap 5.1 to 4.5 s, turning headway 2.57 to 2.24 s, 0.88 to 2 sneakers a cycle, s 1,500 to 2,000); lower bound 0.8 of the low end (ASSUMPTION); the 3-vehicle class-rule pocket (ASSUMPTION) is taken not to push capacity below the band; the band is wide and would also have passed the left-turn rule before the queue-first model")
        } else if src == "ASSUMPTION" {
            let f = if a.pocket { (0.85, 1.0) } else if a.p_left > 0.15 { (0.40, 0.85) } else { (0.5, 0.9) };
            let f = if a.p_right > 0.0 || a.p_left >= 1.0 { (0.85, 1.0) } else { f };
            (1500.0 * gc * f.0, 2000.0 * gc * f.1, "no verified adjustment factor: lower bound 0.85 (right), 0.40 to 0.5 (left, shared lane) of s x green share")
        } else {
            (1500.0 * gc, 2000.0 * gc, "s x green share, s observed 1,500 to 2,000 (ideal 1,900)")
        };
        out.push(case(id, format!("{nm} (green share {gc:.2})"), "veh/h/lane", cap, lo, hi, src, format!("per lane, cycle 100 s, saturated{}; {note}", if ten { "; simulated value and green share are the mean of seeds 1 to 10 (seed 1 alone swings about 5% over 12 cycles)" } else { "" })));
    }
    // Permissive left at a signal, one left-only lane against one opposing lane [Fambro1991]: the band runs from the measured critical gap
    // (5.1 s), turning headway (2.57 s) and sneakers (0.88 a cycle) with s 1,500 to the recommended critical gap (4.5 s), the shortest measured
    // turning headway (2.24 s) and the HCM 1985 two sneakers a cycle with s 2,000 [FHWA-SIG2004].
    for (id, vo) in [("p1", 200.0), ("p2", 400.0), ("p3", 600.0)] {
        let (cap, gc) = approach_cap(Appr { p_left: 1.0, pocket: false, opp: vo, ..base }, 1, &[], |_, _| {});
        let (old, _) = approach_cap_cfg(Appr { p_left: 1.0, pocket: false, opp: vo, ..base }, Config { queue_first_left: Some(false), ..cfg(1) }, &[], |_, _| {});
        let (lo, hi) = (permitted_left_cap(vo, 1.0, 100.0 * gc, 100.0, 5.1, 2.57, 0.88, 1500.0), permitted_left_cap(vo, 1.0, 100.0 * gc, 100.0, 4.5, 2.24, 2.0, 2000.0));
        out.push(case(id, format!("Permissive left, left-only lane, opposing {vo:.0} veh/h (green share {gc:.2}): left turns"), "veh/h", cap, lo, hi, "Fambro1991", format!("cycle 100 s, saturated; left turns only after the opposing queue clears, Drew's gap model, then sneakers in the change interval: critical gap 5.1 to 4.5 s, turning headway 2.57 to 2.24 s, 0.88 to 2 sneakers a cycle, opposing discharge 1,500 to 2,000 veh/h; with the rule before the queue-first model (courtesy wait, 2 m/s arrival floor, critical gap 4.1 s; `queue_first_left` off) {old:.0}")));
    }
    // Protected left: the approach observed to run in a phase of its own (`own_phase`, phasing only, no timing sheet) meets no opposing flow,
    // so its left turns discharge at the saturation flow over its green [FHWA-SIG2004], whatever the opposing flow.
    {
        let a = Appr { p_left: 1.0, pocket: false, opp: 500.0, ..base };
        let protect = |net: &mut Network, x: &Cross| {
            net.nodes[x.c as usize].signal_timing = vec![SignalTiming { periods: vec!["p".into()], cycle_s: 0.0, greens: vec![ApproachGreen { links: vec![x.w_in], green_s: 0.0, own_phase: true, runs_with: Vec::new(), clearance_s: None }], source: "phasing only".into(), clearance_s: None }];
        };
        let (cap, gc) = ten_seed_mean(|sd| approach_cap(a, sd, &[], protect));
        let (perm, _) = approach_cap(a, 1, &[], |_, _| {});
        out.push(case("b13", format!("1 lane, all left turns, protected (a phase of its own, phasing observed without timing), opposing 500/lane (green share {gc:.2})"), "veh/h/lane", cap, 1500.0 * gc, 2000.0 * gc, "FHWA-SIG2004", format!("per lane, cycle 100 s, saturated; simulated value and green share are the mean of seeds 1 to 10; s x green share, s observed 1,500 to 2,000; the same approach with a permissive left carries {perm:.0} at seed 1")));
    }
    // Right turn on red (ASSUMPTION: permitted at every signal after a stop; the legal basis is California Vehicle Code 21453 [CVC21453], 2010 text only; gap-acceptance treatment of RTOR: [Virkler1998], [Stewart1995], abstracts only). Gap acceptance for the turn is the two-way-stop minor right (tc 6.2 s, tf 3.3 s [Brilon1999]); the stop costs the rest of the
    // follow-up headway, so the red-time discharge is at most 3600 / tf = 1,090 veh/h.
    let (off, _gc0) = rtor_cap(100.0, true, 1);
    let (on, gc1) = rtor_cap(100.0, false, 1);
    let (lo10, hi10) = (1.0 + 0.5 * (1.0 - gc1) * 1090.0 / (2000.0 * gc1), 1.0 + (1.0 - gc1) * 1090.0 / (1500.0 * gc1));
    out.push(case("b10", format!("Right turn on red, light cross traffic (100 veh/h/lane from the left): discharge over the no-turn-on-red discharge (green share {gc1:.2})"), "ratio", on / off, lo10, hi10, "ASSUMPTION", format!("{on:.0} against {off:.0} veh/h; bounds: red time (1 - G/C = {:.2}) at 0.5 to 1.0 of 1,090 veh/h on top of s x G/C with s 1,500 to 2,000 [FHWA-SIG2004]", 1.0 - gc1)));
    let (sat, gcs) = rtor_cap(4000.0, false, 1);
    let (sat_off, gcs0) = rtor_cap(4000.0, true, 1);
    out.push(case("b11", format!("Right turn on red, saturated cross street (4,000 veh/h/lane from the left): discharge over the no-turn-on-red discharge (green share {gcs:.2})"), "ratio", sat / sat_off, 0.95, 1.15, "ASSUMPTION", format!("{sat:.0} against {sat_off:.0} veh/h (green share {gcs0:.2} without); the cross street's green is the red of the approach, so no gap opens")));
    let iso = [false, true].map(|ad| two_signals_served(1000.0, ad, 1));
    out.push(case("c5", "Adaptive plan over fixed plan, saturated arterial (4,000 veh/h per direction) with a 500 veh/h cross street: vehicles served at the first signal", "ratio", iso[1].1 / iso[0].1, 0.9, 1.1, "ASSUMPTION", format!("{:.0} against {:.0} veh/h on all four approaches; the start-up plan sizes the arterial phase for the uncapped 4,000 veh/h (flow ratio 1.11) and gives the cross street 16 s of a 90 s cycle, so it serves {:.0} of the {:.0} veh/h the cross street offers; the adaptive plan gives it 30 s and serves {:.0}, and the arterial through flow past the second signal falls from {:.0} to {:.0} veh/h as a consequence (not a defect of the adaptive plan)", iso[1].1, iso[0].1, iso[0].2, 1000.0, iso[1].2, iso[0].0, iso[1].0)));
    out.push(case("c6", "Adaptive plan: share of the cross-street demand (2 x 500 veh/h) served at the first signal", "share", iso[1].2 / 1000.0, 0.9, 1.1, "ASSUMPTION", format!("{:.0} against {:.0} veh/h with the fixed start-up plan", iso[1].2, iso[0].2)));
    let iso = iso.map(|v| v.0);
    for d in [100.0, 200.0] {
        for (k, ad) in [false, true].into_iter().enumerate() {
            let t = two_signals(d, ad, 1);
            let id: &'static str = match (d as u32, ad) { (100, false) => "c1", (100, true) => "c2", (200, false) => "c3", _ => "c4" };
            let coord = d <= crate::params::COORD_MAX_M as f64;
            let note = if coord {
                format!("{t:.0} against {:.0} veh/h; closely spaced, so one cycle and the second green offset by the travel time [FHWA-STM2008] 6.6.4 ({:.2} with the offsets of uncoordinated signals); storage {:.0} veh per lane", iso[k], two_signals_uncoordinated(d, ad, 1) / iso[k], d / 7.0)
            } else {
                format!("{t:.0} against {:.0} veh/h; uncoordinated offsets, storage {:.0} veh per lane", iso[k], d / 7.0)
            };
            out.push(case(id, format!("Two signals {d:.0} m apart, {} plan: through flow over the same plan 1000 m apart", if ad { "adaptive" } else { "fixed" }), "ratio", t / iso[k], 0.75, 1.15, "ASSUMPTION", note));
        }
    }
    let (q4, h4) = awsc(1, &[], false);
    out.push(case("d1", "All-way stop: capacity per approach, balanced, 80/10/10 mix", "veh/h", q4, 400.0, 550.0, "ASSUMPTION", "range from the task brief (about 3600 / 9.6 s to 3600 / 6.5 s)"));
    out.push(case("d2", "All-way stop: departure headway per approach", "s", h4, 3.9, 9.6, "HCM7", "HCM 7 Exhibit 21-15 base saturation headways, geometry group 1: 3.9, 4.7, 5.8, 7.0, 9.6 s for cases 1 to 5 (read in NCHRP08-135 ch. 10); all four approaches saturated is case 4 to 5"));
    for (k, (nm, tc, tf)) in [("right", 6.2, 3.3), ("through", 6.5, 4.0), ("left", 7.1, 3.5)].into_iter().enumerate() {
        for (j, q) in [200.0, 600.0, 1000.0].into_iter().enumerate() {
            let vc = if k == 0 { q } else { 2.0 * q };
            let exp = gap_capacity(vc, tc, tf);
            let sim = twsc(k as u8, q, 1);
            let id: &'static str = ["e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9"][k * 3 + j];
            out.push(case(id, format!("Two-way stop, minor {nm}, major {q:.0}/direction (vc {vc:.0})"), "veh/h", sim, 0.75 * exp, 1.25 * exp, "Brilon1999", format!("gap formula {exp:.0}; tc {tc}, tf {tf}")));
        }
    }
    for (j, vc) in [200.0f64, 600.0, 1000.0].into_iter().enumerate() {
        let exp = 1130.0 * (-1.0e-3 * vc).exp();
        let id: &'static str = ["f1", "f2", "f3"][j];
        out.push(case(id, format!("Circle entry capacity, circulating {vc:.0} veh/h"), "veh/h", circle_entry(vc, 1, false), 0.8 * exp, 1.2 * exp, "Rodegerdts2007", format!("1130 exp(-0.001 vc) = {exp:.0}; circulating vehicles pass the entry and the entering vehicles' exit and leave at the next one; when they all leave at the entering vehicles' exit the entry passes {:.0}", circle_entry(vc, 1, true))));
    }
    for (id, nm, lim) in [("g1", "25 mph", V25), ("g2", "35 mph", 15.65)] {
        let (cap, kq) = crate::sim::equilibrium_capacity(lim, 400, 1);
        let (q, ins) = link_flow(lim, 1, RoadClass::Secondary, 1);
        out.push(case(id, format!("Single-lane link at {nm}: simulated flow, gate-fed"), "veh/h/lane", q, 0.85 * cap, 1.05 * cap, "Treiber2014", format!("mean equilibrium capacity of the driver population {cap:.0} at {kq:.0} veh/km; implied headway {:.2} s", 3600.0 / q)));
        let idh: &'static str = if id == "g1" { "h1" } else { "h2" };
        out.push(case(idh, format!("Gate insertion rate onto a free {nm} link"), "veh/h/lane", ins, 0.85 * cap, 3.0 * cap, "Treiber2014", "must not fall below the link capacity"));
    }
    let (mq, _) = link_flow(29.0, 2, RoadClass::Motorway, 1);
    out.push(case("i1", "Motorway mainline, 2 lanes, 65 mph: flow per lane", "veh/h/lane", mq, 0.9 * 2350.0, 1.05 * 2350.0, "TxDOT-TSAP", "HCM 7 basic freeway segment capacity at 65 mph free-flow speed: 2,350 pc/h/ln; range is -10% / +5%"));
    let (rmq, _) = link_flow(20.1, 1, RoadClass::Motorway, 1);
    out.push(case("i3", "Single-lane exit ramp, 45 mph: flow", "veh/h", rmq, 0.9 * 2100.0, 1.05 * 2100.0, "TxDOT-TSAP", "HCM 7 single-lane ramp capacity, free-flow speed above 40 to 50 mph: 2,100 pc/h; range is -10% / +5%"));
    let (lane_cap, _) = crate::sim::equilibrium_capacity(15.65, 400, 1);
    let mf = merge_flow(2, 1);
    out.push(case("i4", "Two single-lane approaches merging onto a 2-lane exit at an uncontrolled node, saturated: exit flow", "veh/h", mf, 0.75 * lane_cap, 2.1 * lane_cap, "ASSUMPTION", format!("the two streams take different exit lanes, so the exit should pass about one free lane's flow (case g2, {lane_cap:.0} veh/h/lane; lower bound 0.75 of it for the merge) and cannot pass more than two; the one-vehicle-at-a-time merge gave 0.60 of it, the same as a single-lane exit ({:.0} veh/h here)", merge_flow(1, 1))));
    let (one, two) = (lane_drop_flow(1, 1), lane_drop_flow(2, 1));
    out.push(case("i5", "Lane drop: a saturated 2-lane link continues as 1 lane at an uncontrolled node: flow over the same link with 1 lane throughout", "ratio", two / one, 0.75, 1.0, "ASSUMPTION", format!("{two:.0} against {one:.0} veh/h; vehicles from the two lanes take turns (zipper merge), so the drop should pass close to one lane's flow; lower bound 0.75 as for the merge in i4; the off-ramps from SR-24 to Martin Luther King Jr Way and 52nd St drop from 2 lanes to 1")));
    let (q3, ins3) = link_flow(15.65, 3, RoadClass::Secondary, 1);
    out.push(case("h3", "Gate insertion rate onto a free 3-lane 35 mph link", "veh/h/lane", ins3, 0.85 * lane_cap, 3.0 * lane_cap, "Treiber2014", format!("must not fall below the lane capacity of case g2 ({lane_cap:.0} veh/h/lane); flow through the middle link {q3:.0} veh/h/lane")));
    let qb = 900.0;
    let (fb, f0) = (gate_fork_flow(3000.0, qb, 1), gate_fork_flow(300.0, qb, 1));
    out.push(case("h4", "Gate onto a 3-lane link forking into two exits, one queued back to the gate: flow to the free exit", "ratio", fb / f0, 0.9, 1.1, "ASSUMPTION", format!("{fb:.0} veh/h against {f0:.0} with the other exit offered 300 veh/h (not queued), {qb:.0} offered; the other exit drops to one lane and is offered 3,000 veh/h, so its queue reaches the gate; a gate stands for a multilane road, so trips toward the free exit are not held behind it (round 38: the SR-24 mainline gate feeds the Martin Luther King Jr Way and 52nd St off-ramps this way); a waiting trip waits only behind trips for the same fork branch, and the scan limit counts no trip passed over behind a blocked branch (with the round-38 version of the rule, which counted them, 0.64)")));
    // Lane changes along a link [Kesting2007]: a through driver behind a stopped left-turner or an obstruction moves to the free adjacent lane.
    let lb = Appr { lanes: 2, p_left: 0.2, opp: 500.0, ..base };
    let (lcap, lgc) = ten_seed_mean(|sd| approach_cap(lb, sd, &[], |_, _| {}));
    let (lcap0, _) = approach_cap_lc(lb, false);
    let (lold, _) = approach_cap_cfg(lb, Config { queue_first_left: Some(false), ..cfg(1) }, &[], |_, _| {});
    let (llo, lhi) = left_band(2, 0.2, 500.0, lgc);
    out.push(case("l1", format!("2 lanes, 20% left, pocket overflowing, opposing 500/lane (green share {lgc:.2}): approach capacity"), "veh/h/lane", lcap, llo, lhi, "Fambro1991", format!("per lane, cycle 100 s, saturated; simulated value and green share are the mean of seeds 1 to 10; the left-turn queue overflows the 3-vehicle pocket every cycle and through drivers behind it move to the free lane; min(permitted-left capacity over the left share, s x green share over the through share) [Fambro1991] with the band of p1 to p3 (critical gap 5.1 to 4.5 s, turning headway 2.57 to 2.24 s, 0.88 to 2 sneakers a cycle, s 1,500 to 2,000); lower bound 0.8 of the low end (ASSUMPTION); the 3-vehicle class-rule pocket (ASSUMPTION) is taken not to push capacity below the band; the band is wide and would also have passed the left-turn rule before the queue-first model; without lane changes along the link {lcap0:.0}; with the rule before the queue-first model (`queue_first_left` off) {lold:.0}")));
    let bq = 1200.0;
    let (bf, bs) = blocked_lane(bq, true, 1);
    let (bf0, bs0) = blocked_lane(bq, false, 1);
    out.push(case("l2", format!("Two-lane link with its left lane blocked by a standing vehicle, {bq:.0} veh/h offered: flow past the obstruction over the offered flow"), "ratio", bf / bq, 0.9, 1.1, "Kesting2007", format!("{bf:.0} veh/h; one free lane carries about 1,900 veh/h at 35 mph (case g2), above the demand, so drivers behind the obstruction change lanes when the gap is safe (MOBIL) and all pass (band for arrival noise ASSUMPTION); {bs} vehicles left standing behind it at the end; without lane changes along the link {:.2} and {bs0} standing", bf0 / bq)));
    let (rq, gc) = off_ramp(1);
    out.push(case("i2", format!("Off-ramp, 1 lane flaring to 2 at a signal (green share {gc:.2}): per lane"), "veh/h/lane", rq, 1500.0 * gc, 2000.0 * gc, "FHWA-SIG2004", "s x green share, s observed 1,500 to 2,000"));
    for (j, (nm, kind, lo, hi)) in [("through", 0u8, -0.5, 1.0), ("left", 1, 2.5, 6.0), ("right", 2, 3.0, 7.0)].into_iter().enumerate() {
        let id: &'static str = ["k1", "k2", "k3"][j];
        out.push(case(id, format!("Junction traversal delay, {nm}, free flow"), "s", node_delay(kind, 1), lo, hi, "ASSUMPTION", "kinematic: slow to turn speed at 1.85 m/s^2, re-accelerate at 1.4"));
    }
    // (j) other modes
    let turn = Appr { p_left: 0.1, p_right: 0.15, opp: 500.0, ..base };
    let (b1, _) = approach_cap(turn, 1, &[], |_, _| {});
    for (i, ped) in [100.0, 300.0, 600.0].into_iter().enumerate() {
        let ids = ["j1", "j2", "j3"];
        let (c, _) = approach_cap_modes(turn, 1, ped, 0.0);
        out.push(case(ids[i], format!("Signal, 1 lane, 10% left 15% right: capacity with {ped:.0} pedestrians/h per crosswalk"), "capacity share", c / b1, 0.6, 1.0, "ASSUMPTION", format!("{c:.0} against {b1:.0} veh/h/lane; no verified HCM pedestrian factor, floor 0.6 is a guess")));
    }
    for (i, bike) in [50.0, 150.0, 300.0].into_iter().enumerate() {
        let ids = ["j4", "j5", "j6"];
        let (c, _) = approach_cap_modes(turn, 1, 0.0, bike);
        out.push(case(ids[i], format!("Signal, 1 lane, 10% left 15% right: capacity with {bike:.0} cyclists/h sharing the lane"), "capacity share", c / b1, 0.7, 1.0, "ASSUMPTION", format!("{c:.0} against {b1:.0} veh/h/lane; no verified HCM bicycle factor, floor 0.7 is a guess")));
    }
    let (a0, _) = awsc(1, &[], false);
    for (i, ped) in [100.0, 300.0, 600.0].into_iter().enumerate() {
        let ids = ["j7", "j8", "j9"];
        let (cr, _) = awsc_modes(ped, 0.0);
        out.push(case(ids[i], format!("All-way stop: capacity with {ped:.0} pedestrians/h on each crosswalk"), "capacity share", cr / a0, 0.6, 1.0, "ASSUMPTION", format!("{cr:.0} against {a0:.0} veh/h/approach")));
    }
    for (i, bike) in [50.0, 150.0, 300.0].into_iter().enumerate() {
        let ids = ["j10", "j11", "j12"];
        let (cr, _) = awsc_modes(0.0, bike);
        out.push(case(ids[i], format!("All-way stop: capacity with {bike:.0} cyclists/h per approach"), "capacity share", cr / a0, 0.7, 1.0, "ASSUMPTION", format!("{cr:.0} against {a0:.0} veh/h/approach")));
    }
    route_choice_cases(&mut out);
    out
}

fn mode_flows(x: &Cross, ped: f64, bike: f64, bike_from: &[(u32, u32)]) -> Vec<(u32, u32, f64, FlowMode)> {
    let mut v = Vec::new();
    if ped > 0.0 {
        for (a, b) in [(x.n, x.s), (x.s, x.n), (x.e, x.w), (x.w, x.e)] {
            v.push((a, b, ped, FlowMode::Pedestrian));
        }
    }
    if bike > 0.0 {
        for &(a, b) in bike_from {
            v.push((a, b, bike, FlowMode::Bicycle));
        }
    }
    v
}

/// Signalized approach capacity with pedestrians crossing at marked crosswalks and cyclists sharing the west approach lane.
pub fn approach_cap_modes(a: Appr, seed: u64, ped: f64, bike: f64) -> (f64, f64) {
    let class = if a.pocket { RoadClass::Secondary } else { RoadClass::Residential };
    let (_, x) = cross(Control::Signal, class, a.lanes, RoadClass::Secondary, a.lanes, false);
    approach_cap(a, seed, &mode_flows(&x, ped, bike, &[(x.w, x.e)]), |n, x| n.nodes[x.c as usize].marked_crossing = true)
}

pub fn awsc_modes(ped: f64, bike: f64) -> (f64, f64) {
    let (_, x) = cross(Control::AllWayStop, RoadClass::Residential, 1, RoadClass::Residential, 1, false);
    awsc(1, &mode_flows(&x, ped, bike, &[(x.w, x.e), (x.e, x.w), (x.s, x.n), (x.n, x.s)]), true)
}

