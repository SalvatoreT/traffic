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
        self.nodes.push(Node { id, osm_id: id as i64, x, y, control, gate, in_study_area: true, marked_crossing: false });
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
        periods: vec![Period { id: "p".into(), label: "p".into(), flows: flows.iter().map(|&(o, d, v, m)| Flow { origin: o, destination: d, veh_per_hour: v, mode: m }).collect() }],
    }
}

pub fn cfg(seed: u64) -> Config {
    Config { seed, period: "p".into(), demand_scale: 1.0, ..Default::default() }
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
    let class = if a.pocket { RoadClass::Secondary } else { RoadClass::Residential };
    let (mut net, x) = cross(Control::Signal, class, a.lanes, RoadClass::Secondary, a.lanes, false);
    nodes_fn(&mut net, &x);
    let q = 4000.0 * a.lanes as f64;
    let mut fl = vec![
        (x.w, x.e, q * (1.0 - a.p_left - a.p_right), FlowMode::Car),
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
    let mut r = Run::new(net, demand_m(&fl), cfg(seed)).with_ivs(&pin(x.c, 100.0)).watching(&[x.w_in]);
    r.advance(WARM + MEAS);
    let gc = r.green_frac(x.w_in, WARM, WARM + MEAS);
    (r.rate(&[x.w_in], WARM, WARM + MEAS) / a.lanes as f64, gc)
}

// ---------------------------------------------------------------- (c) two signals

pub fn two_signals(d: f64, adaptive: bool, seed: u64) -> f64 {
    two_signals_served(d, adaptive, seed).0
}

/// (through flow past the second signal, all four approaches of the first signal, the two cross-street approaches of the first signal), veh/h.
pub fn two_signals_served(d: f64, adaptive: bool, seed: u64) -> (f64, f64, f64) {
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
    let (m12, m21) = b.two_way(s1, s2, RoadClass::Secondary, 2, V25);
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
    let c = Config { signal_adapt_min: if adaptive { None } else { Some(0.0) }, ..cfg(seed) };
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

pub fn circle_entry(vc: f64, seed: u64) -> f64 {
    let (net, x) = cross(Control::TrafficCircle, RoadClass::Residential, 1, RoadClass::Residential, 1, false);
    let fl = [(x.w, x.e, vc.max(1.0), FlowMode::Car), (x.s, x.e, 3000.0, FlowMode::Car)];
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

/// Sum of the left-turn and through limits of a pocketed approach per lane (veh/h): the left stream gets the permissive-left capacity
/// (HCM/Harders gap formula with tc 4.1 s and tf 2.2 s [HCM7] x green share, plus the sneakers) and the through lanes s x green share.
fn left_limited(lanes: u32, p_left: f64, opp_per_lane: f64, gc: f64) -> (f64, f64) {
    let lcap = gc * gap_capacity((opp_per_lane * lanes as f64).max(1.0), 4.1, 2.2) + 72.0;
    let thru = |s: f64| s * gc * lanes as f64 / (1.0 - p_left);
    let q = |s: f64| (lcap / p_left).min(thru(s)) / lanes as f64;
    (q(1800.0), q(1900.0))
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
    // (id, name, approach, expected kind): through-limited cases scale s x green share, left-limited ones use `left_limited`.
    for (id, nm, a, src) in [
        ("b1", "Signal capacity, 1 lane through", base, "FHWA-SIG2004"),
        ("b2", "Signal capacity, 2 lanes through", Appr { lanes: 2, ..base }, "FHWA-SIG2004"),
        ("b3", "1 lane, 10% left, pocket, opposing 500/lane", Appr { p_left: 0.1, opp: 500.0, ..base }, "Brilon1999"),
        ("b4", "1 lane, 20% left, pocket, opposing 500/lane", Appr { p_left: 0.2, opp: 500.0, ..base }, "Brilon1999"),
        ("b9", "2 lanes, 10% left, pocket, opposing 500/lane", Appr { lanes: 2, p_left: 0.1, opp: 500.0, ..base }, "Brilon1999"),
                ("b5", "1 lane, 10% left, no pocket, opposing 500/lane", Appr { p_left: 0.1, pocket: false, opp: 500.0, ..base }, "ASSUMPTION"),
        ("b6", "1 lane, 20% left, no pocket, opposing 500/lane", Appr { p_left: 0.2, pocket: false, opp: 500.0, ..base }, "ASSUMPTION"),
        ("b7", "1 lane, 10% right", Appr { p_right: 0.1, ..base }, "ASSUMPTION"),
        ("b8", "1 lane, 20% right", Appr { p_right: 0.2, ..base }, "ASSUMPTION"),
    ] {
        let (cap, gc) = approach_cap(a, 1, &[], |_, _| {});
        // Per-lane capacity: s x green share, s from the observed range 1,500 to 2,000 [FHWA-SIG2004]; the ideal 1,900 is the upper reference.
        let (lo, hi, note) = if src == "Brilon1999" {
            let (l, h) = left_limited(a.lanes, a.p_left, a.opp, gc);
            (0.8 * l, h, "min(permissive-left limit, through limit), s 1,800 to 1,900, lower bound 0.8 of it")
        } else if src == "ASSUMPTION" {
            let f = if a.pocket { (0.85, 1.0) } else if a.p_left > 0.15 { (0.40, 0.85) } else { (0.5, 0.9) };
            let f = if a.p_right > 0.0 { (0.85, 1.0) } else { f };
            (1500.0 * gc * f.0, 2000.0 * gc * f.1, "no verified adjustment factor: lower bound 0.85 (right), 0.40 to 0.5 (left, shared lane) of s x green share")
        } else {
            (1500.0 * gc, 2000.0 * gc, "s x green share, s observed 1,500 to 2,000 (ideal 1,900)")
        };
        out.push(case(id, format!("{nm} (green share {gc:.2})"), "veh/h/lane", cap, lo, hi, src, format!("per lane, cycle 100 s, saturated; {note}")));
    }
    let iso = [false, true].map(|ad| two_signals_served(1000.0, ad, 1));
    out.push(case("c5", "Adaptive plan over fixed plan, saturated arterial (4,000 veh/h per direction) with a 500 veh/h cross street: vehicles served at the first signal", "ratio", iso[1].1 / iso[0].1, 0.9, 1.1, "ASSUMPTION", format!("{:.0} against {:.0} veh/h on all four approaches; the start-up plan sizes the arterial phase for the uncapped 4,000 veh/h (flow ratio 1.11) and gives the cross street 16 s of a 90 s cycle, so it serves {:.0} of the {:.0} veh/h the cross street offers; the adaptive plan gives it 30 s and serves {:.0}, and the arterial through flow past the second signal falls from {:.0} to {:.0} veh/h as a consequence (not a defect of the adaptive plan)", iso[1].1, iso[0].1, iso[0].2, 1000.0, iso[1].2, iso[0].0, iso[1].0)));
    out.push(case("c6", "Adaptive plan: share of the cross-street demand (2 x 500 veh/h) served at the first signal", "share", iso[1].2 / 1000.0, 0.9, 1.1, "ASSUMPTION", format!("{:.0} against {:.0} veh/h with the fixed start-up plan", iso[1].2, iso[0].2)));
    let iso = iso.map(|v| v.0);
    for d in [100.0, 200.0] {
        for (k, ad) in [false, true].into_iter().enumerate() {
            let t = two_signals(d, ad, 1);
            let id: &'static str = match (d as u32, ad) { (100, false) => "c1", (100, true) => "c2", (200, false) => "c3", _ => "c4" };
            out.push(case(id, format!("Two signals {d:.0} m apart, {} plan: through flow over the same plan 1000 m apart", if ad { "adaptive" } else { "fixed" }), "ratio", t / iso[k], 0.75, 1.15, "ASSUMPTION", format!("{t:.0} against {:.0} veh/h; uncoordinated offsets, storage {:.0} veh per lane", iso[k], d / 7.0)));
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
        out.push(case(id, format!("Circle entry capacity, circulating {vc:.0} veh/h"), "veh/h", circle_entry(vc, 1), 0.8 * exp, 1.2 * exp, "Rodegerdts2007", format!("1130 exp(-0.001 vc) = {exp:.0}")));
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
        let fl = |_: &Cross| ();
        let _ = fl;
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
    let (net, x) = cross(Control::Signal, class, a.lanes, RoadClass::Secondary, a.lanes, false);
    let _ = net;
    approach_cap(a, seed, &mode_flows(&x, ped, bike, &[(x.w, x.e)]), |n, x| n.nodes[x.c as usize].marked_crossing = true)
}

pub fn awsc_modes(ped: f64, bike: f64) -> (f64, f64) {
    let (_, x) = cross(Control::AllWayStop, RoadClass::Residential, 1, RoadClass::Residential, 1, false);
    awsc(1, &mode_flows(&x, ped, bike, &[(x.w, x.e), (x.e, x.w), (x.s, x.n), (x.n, x.s)]), true)
}

