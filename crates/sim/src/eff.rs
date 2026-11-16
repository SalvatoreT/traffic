//! Effective network state: baseline network + interventions. Rebuilt on `setInterventions`.

use crate::model::{Control, Intervention, Network, RoadClass};
use crate::params::*;
use crate::topo::*;

pub struct SigPlan {
    pub cycle: f32,
    /// Absolute time (s) at which a cycle of this plan starts.
    pub t0: f64,
    /// (start, green) per phase within the cycle.
    pub phases: Vec<(f32, f32)>,
    /// Approach links of each phase.
    pub links: Vec<Vec<u32>>,
    pub always_green: bool,
    /// Critical flow ratio sum used by the plan (Webster), for diagnostics.
    pub ysum: f32,
    /// Plan that replaces this one at its `t0` (set by `adapt_signals`).
    pub next: Option<Box<SigNext>>,
}

/// A signal plan whose durations do not add up: the phase greens and clearance intervals need `required` s and the cycle is `cycle` s.
#[derive(Clone, Debug, PartialEq)]
pub struct SignalIssue {
    pub node: u32,
    pub period: String,
    /// The cycle came from a `signal_timing` intervention (false: from an observed timing).
    pub requested: bool,
    pub cycle: f32,
    pub required: f32,
    /// Source of the observed timing, if any.
    pub source: String,
    pub reason: String,
}

impl std::fmt::Display for SignalIssue {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let what = if self.requested { "requested" } else { "observed" };
        write!(f, "signal at node {} ({}): the {what} cycle of {:.1} s {}", self.node, self.period, self.cycle, self.reason)?;
        if !self.source.is_empty() {
            write!(f, " [observed timing: {}]", self.source)?;
        }
        Ok(())
    }
}

pub struct SigNext {
    pub t0: f64,
    pub cycle: f32,
    pub phases: Vec<(f32, f32)>,
    pub ysum: f32,
}

impl SigPlan {
    /// Switch to the pending plan once its start time has come.
    pub fn roll(&mut self, t: f64) {
        if self.next.as_ref().map_or(false, |n| t >= n.t0) {
            let n = self.next.take().unwrap();
            self.t0 = n.t0;
            self.cycle = n.cycle;
            self.phases = n.phases;
            self.ysum = n.ysum;
        }
    }
}

pub struct Eff {
    pub closed: Vec<bool>,
    pub limit: Vec<f32>,
    pub humps: Vec<Vec<f32>>,
    pub ctrl: Vec<Control>,
    pub node_filter: Vec<bool>,
    /// Links that arrive at a node through a leg closed by a leg-level `modal_filter` (cars cannot enter the junction from them).
    pub leg_in_closed: Vec<bool>,
    /// Links that leave a node through a closed leg (cars cannot leave the junction onto them).
    pub leg_out_closed: Vec<bool>,
    pub mv_ok: Vec<bool>,
    pub mv_cost: Vec<f32>,
    /// `mv_cost` as derived from the network and interventions; the simulation adds each movement's measured time to `mv_cost` (route costs by turn).
    pub mv_static: Vec<f32>,
    pub mv_vturn: Vec<f32>,
    pub mv_ff: Vec<f32>,
    pub minor: Vec<bool>,
    pub must_stop: Vec<bool>,
    pub plevel: Vec<u8>,
    /// Circle node whose circulating roadway is made of links (ring of circle nodes) rather than the node itself.
    pub ring_node: Vec<bool>,
    pub ff: Vec<f32>,
    /// Perceived-cost weight per link in route choice (street-hierarchy preference; 1.0 on arterials).
    pub route_w: Vec<f32>,
    pub sig: Vec<Option<SigPlan>>,
    pub cycle_override: Vec<Option<f32>>,
    /// Links closed by a `one_way` intervention (everyone obeys); `closed` is the union with modal filters.
    pub oneway_closed: Vec<bool>,
    /// Movement banned by a `turn_ban` intervention.
    pub mv_banned: Vec<bool>,
    /// Bicycle view: no motorway links, one-way closures obeyed, modal filters and turn bans do not apply.
    pub bike_mv_ok: Vec<bool>,
    pub bike_link_ok: Vec<bool>,
    pub bike_mv_cost: Vec<f32>,
    pub bike_mv_vturn: Vec<f32>,
    pub bike_link_cost: Vec<f32>,
    pub bike_w: Vec<f32>,
    pub bike_closed: Vec<bool>,
    /// Interventions skipped as invalid (diagonal diverters that do not fit their node).
    pub invalid_ivs: u64,
    /// Signal plans rejected by `plan_signals` because their durations do not fit their cycle.
    pub issues: Vec<SignalIssue>,
    /// Demand period of the run: selects the observed signal timing of a node (`Node::signal_timing`).
    pub period: String,
    /// Longest link joining two coordinated signals (`COORD_MAX_M`, `Config::coord_max_m`); 0 turns coordination off.
    pub coord_max_m: f32,
}

impl Eff {
    pub fn derive(topo: &Topo, net: &Network, ivs: &[Intervention]) -> Eff {
        let nl = topo.n_links;
        let nn = topo.n_nodes;
        let mut closed = vec![false; nl];
        let mut limit: Vec<f32> = net.links.iter().map(|l| l.speed_limit.max(1.0) as f32).collect();
        let mut humps: Vec<Vec<f32>> = net
            .links
            .iter()
            .map(|l| l.humps.iter().map(|&h| (h as f32).clamp(0.0, topo.length[l.id as usize])).collect())
            .collect();
        let mut ctrl: Vec<Control> = net.nodes.iter().map(|n| n.control).collect();
        let mut node_filter = vec![false; nn];
        let mut leg_in_closed = vec![false; nl];
        let mut leg_out_closed = vec![false; nl];
        let mut oneway_closed = vec![false; nl];
        let mut banned: Vec<(u32, u32)> = Vec::new();
        let mut cycle_override: Vec<Option<f32>> = vec![None; nn];
        let mut invalid_ivs = 0u64;
        let valid_l = |l: Option<u32>| l.filter(|&x| (x as usize) < nl);
        let valid_n = |n: Option<u32>| n.filter(|&x| (x as usize) < nn);
        for iv in ivs {
            match iv.ty.as_str() {
                "modal_filter" => {
                    if let Some(l) = valid_l(iv.link) {
                        closed[l as usize] = true;
                        if let Some(r) = net.links[l as usize].reverse {
                            closed[r as usize] = true;
                        }
                    } else if let Some(n) = valid_n(iv.node) {
                        match &iv.legs {
                            None => node_filter[n as usize] = true,
                            Some(legs) => {
                                let mut hit = false;
                                for &l in legs.iter().filter(|&&l| (l as usize) < nl) {
                                    let k = &net.links[l as usize];
                                    if k.to == n {
                                        leg_in_closed[l as usize] = true;
                                        if let Some(r) = k.reverse {
                                            leg_out_closed[r as usize] = true;
                                        }
                                        hit = true;
                                    }
                                    if k.from == n {
                                        leg_out_closed[l as usize] = true;
                                        if let Some(r) = k.reverse {
                                            leg_in_closed[r as usize] = true;
                                        }
                                        hit = true;
                                    }
                                }
                                if !hit {
                                    invalid_ivs += 1;
                                }
                            }
                        }
                    }
                }
                "one_way" => {
                    if let Some(l) = valid_l(iv.link) {
                        if let Some(r) = net.links[l as usize].reverse {
                            closed[r as usize] = true;
                            oneway_closed[r as usize] = true;
                        }
                    }
                }
                "speed_limit" => {
                    if let (Some(l), Some(s)) = (valid_l(iv.link), iv.speed) {
                        if s > 0.5 {
                            limit[l as usize] = s as f32;
                            if let Some(r) = net.links[l as usize].reverse {
                                limit[r as usize] = s as f32;
                            }
                        }
                    }
                }
                "speed_hump" => {
                    if let (Some(l), Some(p)) = (valid_l(iv.link), iv.position) {
                        let len = topo.length[l as usize];
                        let p = (p as f32).clamp(0.0, len);
                        humps[l as usize].push(p);
                        // A physical hump slows both directions (design decision; reverse measured from its own start).
                        if let Some(r) = net.links[l as usize].reverse {
                            humps[r as usize].push(topo.length[r as usize] - p.min(topo.length[r as usize]));
                        }
                    }
                }
                "traffic_circle" => {
                    if let Some(n) = valid_n(iv.node) {
                        ctrl[n as usize] = Control::TrafficCircle;
                    }
                }
                "control" => {
                    if let (Some(n), Some(c)) = (valid_n(iv.node), iv.control) {
                        ctrl[n as usize] = c;
                    }
                }
                "signal_timing" => {
                    if let (Some(n), Some(c)) = (valid_n(iv.node), iv.cycle) {
                        cycle_override[n as usize] = Some(c as f32);
                    }
                }
                "turn_ban" => {
                    if let (Some(a), Some(b)) = (valid_l(iv.from_link), valid_l(iv.to_link)) {
                        banned.push((a, b));
                    }
                }
                "diagonal_diverter" => {
                    let res = match (valid_n(iv.node), iv.bearing) {
                        (Some(n), Some(b)) => crate::diverter::banned_movements(topo, net, n, b.rem_euclid(180.0)),
                        _ => Err(String::new()),
                    };
                    match res {
                        Ok(bans) => banned.extend(bans),
                        Err(_) => invalid_ivs += 1,
                    }
                }
                _ => {}
            }
        }
        for h in humps.iter_mut() {
            h.sort_by(|a, b| a.partial_cmp(b).unwrap());
            h.dedup_by(|a, b| (*a - *b).abs() < 1.0);
        }

        // Stop control classification.
        let mut minor = vec![false; nl];
        let mut must_stop = vec![false; nl];
        let mut plevel = vec![0u8; nl];
        let mut ring_node = vec![false; nn];
        for n in 0..nn {
            let ins = &topo.ins[n];
            match ctrl[n] {
                Control::AllWayStop => {
                    for &l in ins {
                        must_stop[l as usize] = true;
                    }
                }
                Control::TwoWayStop => {
                    let flagged: Vec<u32> =
                        ins.iter().copied().filter(|&l| net.links[l as usize].stop_at_end).collect();
                    if !flagged.is_empty() {
                        for l in flagged {
                            minor[l as usize] = true;
                        }
                        // An unflagged approach of a lower class than the best approach still yields (same rule as at an uncontrolled node).
                        let minr = ins.iter().map(|&l| topo.rank[l as usize]).min().unwrap();
                        for &l in ins {
                            if topo.rank[l as usize] > minr {
                                minor[l as usize] = true;
                            }
                        }
                    } else if !ins.is_empty() {
                        // ASSUMPTION: no stop sign flagged -> lowest-class approaches are the minor ones.
                        let maxr = ins.iter().map(|&l| topo.rank[l as usize]).max().unwrap();
                        let minr = ins.iter().map(|&l| topo.rank[l as usize]).min().unwrap();
                        if maxr > minr {
                            for &l in ins {
                                if topo.rank[l as usize] == maxr {
                                    minor[l as usize] = true;
                                }
                            }
                        }
                    }
                    for &l in ins {
                        must_stop[l as usize] = minor[l as usize];
                        plevel[l as usize] = if minor[l as usize] { 10 } else { 0 };
                    }
                }
                Control::Uncontrolled => {
                    for &l in ins {
                        plevel[l as usize] = topo.rank[l as usize];
                    }
                }
                Control::TrafficCircle => {
                    // Roundabouts imported as a ring of circle nodes: ring links (both ends are circle nodes)
                    // have priority over entering links. A single circle node has no ring links, so all
                    // approaches share priority and the circulating-arc rule alone applies.
                    for &l in ins {
                        let ring = ctrl[topo.link_from[l as usize] as usize] == Control::TrafficCircle;
                        ring_node[n] |= ring;
                        plevel[l as usize] = if ring { 0 } else { 10 };
                    }
                }
                _ => {}
            }
        }

        let ff: Vec<f32> = (0..nl)
            .map(|l| topo.length[l] / limit[l] + HUMP_FF_PENALTY * humps[l].len() as f32)
            .collect();

        let nm = topo.mvs.len();
        let dl = node_delays();
        let osm_bans: std::collections::HashSet<(u32, u32)> = net.turn_bans.iter().map(|b| (b.from, b.to)).collect();
        let mut mv_ok = vec![true; nm];
        let mut mv_cost = vec![0.0; nm];
        let mut mv_vturn = vec![0.0; nm];
        let mut mv_ff = vec![0.0; nm];
        let mut mv_banned = vec![false; nm];
        let mut bike_mv_ok = vec![true; nm];
        let mut bike_mv_cost = vec![0.0; nm];
        let mut bike_mv_vturn = vec![0.0; nm];
        let bike_link_ok: Vec<bool> = (0..nl).map(|l| net.links[l].class != RoadClass::Motorway && !oneway_closed[l]).collect();
        for (i, m) in topo.mvs.iter().enumerate() {
            let n = m.node as usize;
            let dead_end = topo.lm_cnt[m.a as usize] == 1;
            let banned_pair = banned.iter().any(|&(a, b)| a == m.a && b == m.b);
            mv_banned[i] = banned_pair;
            let osm_ban = osm_bans.contains(&(m.a, m.b));
            bike_mv_ok[i] = bike_link_ok[m.a as usize] && bike_link_ok[m.b as usize] && !(m.kind == K_UTURN && !dead_end);
            bike_mv_vturn[i] = if ctrl[n] == Control::TrafficCircle {
                V_BIKE_CIRCLE
            } else {
                match m.kind {
                    K_THROUGH => 1e3,
                    K_RIGHT => V_BIKE_RIGHT,
                    K_LEFT => V_BIKE_LEFT,
                    _ => V_BIKE_UTURN,
                }
            };
            mv_ok[i] = !(banned_pair
                || osm_ban
                || node_filter[n]
                || leg_in_closed[m.a as usize]
                || leg_out_closed[m.b as usize]
                || closed[m.b as usize]
                || (m.kind == K_UTURN && !dead_end));
            let vlim = limit[m.a as usize].min(limit[m.b as usize]);
            let vt = if ctrl[n] == Control::TrafficCircle {
                V_CIRCLE.min(vlim)
            } else {
                match m.kind {
                    K_THROUGH => vlim * 1.4, // no node cap beyond the max compliance factor
                    K_RIGHT => V_RIGHT.min(vlim),
                    K_LEFT => V_LEFT.min(vlim),
                    _ => V_UTURN.min(vlim),
                }
            };
            mv_vturn[i] = vt;
            let mut len = m.len;
            if ctrl[n] == Control::TrafficCircle {
                // Arc around the circle (counter-clockwise) from approach to exit.
                let a_in = (m.h_in + std::f64::consts::PI).rem_euclid(std::f64::consts::TAU);
                let a_out = m.h_out.rem_euclid(std::f64::consts::TAU);
                let arc = (a_out - a_in).rem_euclid(std::f64::consts::TAU);
                len = (R_CIRCLE * arc + 4.0).max(10.0) as f32;
            }
            mv_ff[i] = len / vt.min(vlim);
            let mut c = match m.kind {
                K_RIGHT => TURN_RIGHT_S,
                K_LEFT => TURN_LEFT_S,
                K_UTURN => TURN_U_S,
                _ => 0.0,
            };
            c += match ctrl[n] {
                Control::Signal => dl.signal,
                Control::AllWayStop => dl.all_way_stop,
                Control::TwoWayStop => {
                    if minor[m.a as usize] {
                        dl.minor_stop
                    } else {
                        0.0
                    }
                }
                Control::TrafficCircle => dl.circle,
                Control::Uncontrolled => 0.0,
            };
            mv_cost[i] = c + mv_ff[i];
            // Bicycle movement cost: same turn and control delays, ASSUMPTION: crossing time at bicycle turn speed.
            let bt = bike_mv_vturn[i].min(BIKE_COST_V).max(1.0);
            bike_mv_cost[i] = c + len / bt;
        }
        let bike_link_cost: Vec<f32> = (0..nl).map(|l| topo.length[l] / BIKE_COST_V).collect();
        let bike_w: Vec<f32> = net
            .links
            .iter()
            .map(|l| {
                if l.bike_lane {
                    BIKE_COST_LANE
                } else if l.bike_route {
                    BIKE_COST_ROUTE
                } else {
                    match l.class {
                        RoadClass::Primary => BIKE_COST_PRIMARY,
                        RoadClass::Secondary => BIKE_COST_SECONDARY,
                        RoadClass::Tertiary => BIKE_COST_TERTIARY,
                        _ => 1.0,
                    }
                }
            })
            .collect();
        let bike_closed: Vec<bool> = bike_link_ok.iter().map(|&ok| !ok).collect();
        Eff {
            closed,
            limit,
            humps,
            ctrl,
            node_filter,
            leg_in_closed,
            leg_out_closed,
            mv_ok,
            mv_static: mv_cost.clone(),
            mv_cost,
            mv_vturn,
            mv_ff,
            minor,
            must_stop,
            plevel,
            ring_node,
            ff,
            route_w: net.links.iter().map(|l| class_weight(l.class, LOCAL_COST_FACTOR)).collect(),
            sig: (0..nn).map(|_| None).collect(),
            cycle_override,
            oneway_closed,
            mv_banned,
            bike_mv_ok,
            bike_link_ok,
            bike_mv_cost,
            bike_mv_vturn,
            bike_link_cost,
            bike_w,
            bike_closed,
            invalid_ivs,
            issues: Vec::new(),
            period: String::new(),
            coord_max_m: COORD_MAX_M,
        }
    }

    fn plan_for(&self, net: &Network, n: usize, groups: &[Vec<u32>], ys: &[f32], pin: Option<f32>) -> Result<(f32, Vec<(f32, f32)>, f32), SignalIssue> {
        plan_with_observation(net, &self.period, n, groups, ys, pin)
    }

    /// Build the start-up signal plans. `est_flow[l]` is the estimated approach flow (veh/h); `adapt_signals` replaces the
    /// splits later from measured flows.
    pub fn plan_signals(&mut self, topo: &Topo, net: &Network, est_flow: &[f32]) {
        let nn = topo.n_nodes;
        for n in 0..nn {
            self.sig[n] = None;
        }
        self.issues.clear();
        for n in 0..nn {
            if self.ctrl[n] != Control::Signal {
                continue;
            }
            let ins: Vec<u32> = topo.ins[n].iter().copied().filter(|&l| !self.closed[l as usize]).collect();
            if ins.is_empty() {
                continue;
            }
            let groups = own_phases(net, &self.period, n, phase_groups(topo, net, &ins));
            if groups.len() < 2 {
                self.sig[n] = Some(SigPlan { cycle: 60.0, t0: 0.0, phases: vec![(0.0, 60.0)], links: groups, always_green: true, ysum: 0.0, next: None });
                continue;
            }
            let ys = group_flow_ratios(net, &groups, est_flow);
            let (cycle, phases, ysum) = match self.plan_for(net, n, &groups, &ys, self.cycle_override[n]) {
                Ok(p) => p,
                Err(e) => {
                    self.issues.push(e);
                    continue;
                }
            };
            let offset = ((n as f32 * 37.0) % 100.0) / 100.0 * cycle;
            self.sig[n] = Some(SigPlan { cycle, t0: -(offset as f64), phases, links: groups, always_green: false, ysum, next: None });
        }
        self.coordinate(topo, net, est_flow, None);
    }

    /// Recompute the splits (and the cycle unless pinned by an intervention) of every signal from measured approach flows
    /// (veh/h). The new plan starts when the current cycle ends, so no phase is cut short.
    pub fn adapt_signals(&mut self, topo: &Topo, net: &Network, flow: &[f32], t: f64) {
        for n in 0..self.sig.len() {
            let pin = self.cycle_override[n];
            let Some(p) = self.sig[n].as_mut() else { continue };
            if p.always_green {
                continue;
            }
            let ys = group_flow_ratios(net, &p.links, flow);
            // The durations that decide whether a plan fits do not depend on flows, so a plan accepted at the start stays valid.
            let Ok((cycle, phases, ysum)) = plan_with_observation(net, &self.period, n, &p.links, &ys, pin) else { continue };
            let k = ((t - p.t0) / p.cycle as f64).ceil().max(1.0);
            let start = p.t0 + k * p.cycle as f64;
            p.next = Some(Box::new(SigNext { t0: start, cycle, phases, ysum }));
        }
        self.coordinate(topo, net, flow, Some(t));
    }

    /// Closely spaced signals (round 32): two signals joined by a link of at most `COORD_MAX_M` (or by links that go straight on through
    /// uncontrolled nodes, `COORD_MAX_M` in all) run one cycle, the longest of their
    /// own (critical-intersection method, [FHWA-STM2008] 6.6.2, 6.7.7; one cycle for all members of a coordination plan, 6.3.1), and the
    /// downstream signal's green for that link starts when a platoon released at the start of the upstream green arrives (offset by the
    /// link's free-flow time, 6.6.4), in the direction of the larger approach flow. Groups chain along such links from the signal no
    /// coordinated link enters. `t` is None for the start-up plans (offsets set on them) and the adaptation time otherwise (offsets set on
    /// the pending plans, which start no earlier than the end of each signal's running cycle).
    fn coordinate(&mut self, topo: &Topo, net: &Network, flow: &[f32], t: Option<f64>) {
        if self.coord_max_m <= 0.0 {
            return;
        }
        let active = |e: &Eff, n: usize| e.ctrl[n] == Control::Signal && e.sig[n].as_ref().map_or(false, |p| !p.always_green);
        // Paths between two signals: a link, or links joined straight on through uncontrolled nodes, of at most `coord_max_m` in all.
        // The busier direction of each closely spaced pair is kept.
        let mut paths: Vec<(u32, u32, f64)> = Vec::new();
        let mut best: std::collections::BTreeMap<(u32, u32), (f32, usize)> = std::collections::BTreeMap::new();
        for l in 0..topo.n_links {
            let u = topo.link_from[l] as usize;
            if self.closed[l] || !active(self, u) {
                continue;
            }
            let (mut cur, mut len, mut tt) = (l, topo.length[l], self.ff[l] as f64);
            let d = loop {
                if len > self.coord_max_m {
                    break None;
                }
                let v = topo.link_to[cur] as usize;
                if active(self, v) {
                    break Some(v);
                }
                if self.ctrl[v] != Control::Uncontrolled {
                    break None;
                }
                let st = topo.lm_start[cur] as usize;
                let mut thr = (st..st + topo.lm_cnt[cur] as usize).filter(|&m| topo.mvs[m].kind == K_THROUGH && !self.closed[topo.mvs[m].b as usize]);
                let (Some(m), None) = (thr.next(), thr.next()) else { break None };
                cur = topo.mvs[m].b as usize;
                len += topo.length[cur];
                tt += self.ff[cur] as f64;
            };
            let Some(d) = d else { continue };
            if d == u {
                continue;
            }
            let key = (u.min(d) as u32, u.max(d) as u32);
            let f = flow.get(cur).copied().unwrap_or(0.0);
            if best.get(&key).map_or(true, |&(bf, _)| f > bf) {
                best.insert(key, (f, paths.len()));
            }
            paths.push((l as u32, cur as u32, tt));
        }
        if best.is_empty() {
            return;
        }
        // Union-find over the nodes of the pairs.
        let mut parent: std::collections::BTreeMap<u32, u32> = std::collections::BTreeMap::new();
        fn find(p: &mut std::collections::BTreeMap<u32, u32>, x: u32) -> u32 {
            let mut r = x;
            while let Some(&q) = p.get(&r) {
                if q == r {
                    break;
                }
                r = q;
            }
            p.insert(x, r);
            r
        }
        for &(a, b) in best.keys() {
            parent.entry(a).or_insert(a);
            parent.entry(b).or_insert(b);
            let (ra, rb) = (find(&mut parent, a), find(&mut parent, b));
            if ra != rb {
                parent.insert(ra.max(rb), ra.min(rb));
            }
        }
        let nodes: Vec<u32> = parent.keys().copied().collect();
        let mut groups: std::collections::BTreeMap<u32, Vec<u32>> = std::collections::BTreeMap::new();
        for n in nodes {
            let r = find(&mut parent, n);
            groups.entry(r).or_default().push(n);
        }
        let edges: Vec<(u32, u32, f64)> = best.values().map(|&(_, i)| paths[i]).collect();
        for members in groups.values() {
            // Common cycle: the longest member cycle (a pinned cycle of an intervention counts as the member's cycle).
            let cyc = |p: &SigPlan| p.next.as_ref().map_or(p.cycle, |n| n.cycle);
            let c = members.iter().map(|&n| cyc(self.sig[n as usize].as_ref().unwrap())).fold(0.0f32, f32::max);
            let mut ok = true;
            for &n in members {
                let n = n as usize;
                let p = self.sig[n].as_ref().unwrap();
                if (cyc(p) - c).abs() < 1e-3 {
                    continue;
                }
                let ys = group_flow_ratios(net, &p.links, flow);
                match plan_with_observation(net, &self.period, n, &p.links, &ys, Some(c)) {
                    Ok((cycle, phases, ysum)) => {
                        let p = self.sig[n].as_mut().unwrap();
                        match (t, p.next.as_mut()) {
                            (Some(_), Some(nx)) => {
                                nx.cycle = cycle;
                                nx.phases = phases;
                                nx.ysum = ysum;
                            }
                            (Some(_), None) => ok = false,
                            (None, _) => {
                                p.cycle = cycle;
                                p.phases = phases;
                                p.ysum = ysum;
                            }
                        }
                    }
                    Err(_) => ok = false,
                }
            }
            if !ok {
                continue;
            }
            let mem: std::collections::BTreeSet<u32> = members.iter().copied().collect();
            let ge: Vec<(u32, u32, f64)> = edges.iter().copied().filter(|&(f, _, _)| mem.contains(&(topo.link_from[f as usize] as u32))).collect();
            let has_in: std::collections::BTreeSet<u32> = ge.iter().map(|&(_, la, _)| topo.link_to[la as usize] as u32).collect();
            let mut done: std::collections::BTreeSet<u32> = members.iter().copied().filter(|n| !has_in.contains(n)).collect();
            let mut progress = true;
            while progress {
                progress = false;
                for &(s, last, tt) in &ge {
                    let (u, d) = (topo.link_from[s as usize] as usize, topo.link_to[last as usize] as usize);
                    if !done.contains(&(u as u32)) || done.contains(&(d as u32)) {
                        continue;
                    }
                    done.insert(d as u32);
                    progress = true;
                    // Upstream phase: the one holding the busiest approach that goes straight on into `s`.
                    let feed = topo.ins[u].iter().copied().filter(|&a| {
                        let st = topo.lm_start[a as usize];
                        (st..st + topo.lm_cnt[a as usize]).any(|m| topo.mvs[m as usize].b == s && topo.mvs[m as usize].kind == K_THROUGH)
                    });
                    let Some(a) = feed.max_by(|&x, &y| flow.get(x as usize).copied().unwrap_or(0.0).total_cmp(&flow.get(y as usize).copied().unwrap_or(0.0)).then(y.cmp(&x))) else { continue };
                    let (pu, pd) = (self.sig[u].as_ref().unwrap(), self.sig[d].as_ref().unwrap());
                    let (Some(iu), Some(id)) = (pu.links.iter().position(|g| g.contains(&a)), pd.links.iter().position(|g| g.contains(&last))) else { continue };
                    let (u_t0, u_start) = match (t, pu.next.as_ref()) {
                        (Some(_), Some(nx)) => (nx.t0, nx.phases[iu].0 as f64),
                        (Some(_), None) => continue,
                        (None, _) => (pu.t0, pu.phases[iu].0 as f64),
                    };
                    let c = c as f64;
                    let p = self.sig[d].as_mut().unwrap();
                    match (t, p.next.as_mut()) {
                        (Some(_), Some(nx)) => {
                            let base = u_t0 + u_start + tt - nx.phases[id].0 as f64;
                            let k = ((nx.t0 - base) / c).ceil();
                            nx.t0 = base + k * c;
                        }
                        (Some(_), None) => {}
                        (None, _) => {
                            p.t0 = u_t0 + u_start + tt - p.phases[id].0 as f64;
                        }
                    }
                }
            }
        }
    }
}

/// Group the approaches of a signalized node into phases by street. Approaches with the same street name and a similar axis
/// share a phase; approaches with different or missing names also share one when they lie on the same axis within
/// `PHASE_AXIS_DEG` (a through road that changes name, or a parallel lane group). Streets are then ordered by importance
/// (rank, link id).
pub fn phase_groups(topo: &Topo, net: &Network, ins: &[u32]) -> Vec<Vec<u32>> {
    let heading = |l: u32| -> f64 {
        if topo.lm_cnt[l as usize] > 0 {
            topo.mvs[topo.lm_start[l as usize] as usize].h_in
        } else {
            topo.link_point(l as usize, topo.length[l as usize] as f64, 0.0).1
        }
    };
    let axial = |a: f64, b: f64| -> f64 {
        let d = norm_angle(a - b).abs();
        (if d > std::f64::consts::FRAC_PI_2 { std::f64::consts::PI - d } else { d }).to_degrees()
    };
    let key = |l: u32| net.links[l as usize].name.trim().to_lowercase();
    let h: Vec<f64> = ins.iter().map(|&l| heading(l)).collect();
    // Complete-linkage clustering: approaches share a phase only when every pair in the group is on one axis within
    // `PHASE_AXIS_DEG`, so no two crossing movements get green together. Closest pairs merge first, and a same-name pair
    // wins a tie against a pair of different streets.
    let mut clusters: Vec<Vec<usize>> = (0..ins.len()).map(|i| vec![i]).collect();
    loop {
        let mut best: Option<(f64, usize, usize)> = None;
        for i in 0..clusters.len() {
            for j in i + 1..clusters.len() {
                let mut worst = 0.0f64;
                let mut named = true;
                for &x in &clusters[i] {
                    for &y in &clusters[j] {
                        worst = worst.max(axial(h[x], h[y]));
                        let (kx, ky) = (key(ins[x]), key(ins[y]));
                        named &= !kx.is_empty() && kx == ky;
                    }
                }
                if worst < PHASE_AXIS_DEG {
                    let d = if named { worst - PHASE_AXIS_DEG } else { worst };
                    if best.map_or(true, |b| d < b.0) {
                        best = Some((d, i, j));
                    }
                }
            }
        }
        let Some((_, i, j)) = best else { break };
        let moved = clusters.remove(j);
        clusters[i].extend(moved);
    }
    let order_key = |c: &Vec<usize>| c.iter().map(|&i| (topo.rank[ins[i] as usize], ins[i])).min().unwrap();
    clusters.sort_by_key(|c| order_key(c));
    let axis = |c: &Vec<usize>| h[*c.iter().min_by_key(|&&i| (topo.rank[ins[i] as usize], ins[i])).unwrap()];
    while clusters.len() > MAX_PHASES {
        let mut best = (f64::MAX, 0, 1);
        for i in 0..clusters.len() {
            for j in i + 1..clusters.len() {
                let d = axial(axis(&clusters[i]), axis(&clusters[j]));
                if d < best.0 {
                    best = (d, i, j);
                }
            }
        }
        let moved = clusters.remove(best.2);
        clusters[best.1].extend(moved);
    }
    clusters.into_iter().map(|c| c.into_iter().map(|i| ins[i]).collect()).collect()
}

/// Observed phasing (DATA, `Node::signal_timing`): an approach marked `own_phase` in the run's period leaves the phase of its street
/// and gets one of its own right after it, so all its movements run while the opposing approach waits. This is split phasing
/// [FHWA-STM2008] (section 4.3.4). An approach that also lists `runs_with` (a protected left that leads the opposing through) is in its own phase and in the phase of that
/// opposing approach as well, so it has its whole through green and the opposing approach keeps its own (ASSUMPTION: the lead-lag of a Synchro plan shown as two phases).
fn own_phases(net: &Network, period: &str, n: usize, groups: Vec<Vec<u32>>) -> Vec<Vec<u32>> {
    let Some(obs) = net.nodes[n].signal_timing.iter().find(|o| o.periods.iter().any(|p| p == period)) else { return groups };
    let mut out: Vec<Vec<u32>> = Vec::new();
    for g in groups {
        let mut rest = g.clone();
        let mut own: Vec<Vec<u32>> = Vec::new();
        for a in obs.greens.iter().filter(|a| a.own_phase) {
            let mine: Vec<u32> = rest.iter().copied().filter(|l| a.links.contains(l)).collect();
            if !mine.is_empty() && mine.len() < rest.len() {
                rest.retain(|l| !mine.contains(l));
                own.push(mine);
            }
        }
        out.extend(own);
        out.push(rest);
    }
    for a in obs.greens.iter().filter(|a| !a.runs_with.is_empty()) {
        let alone = out.iter().any(|g| g.iter().all(|l| a.links.contains(l)) && g.iter().any(|l| a.links.contains(l)));
        let Some(pi) = out.iter().position(|g| g.iter().any(|l| a.runs_with.contains(l)) && !g.iter().any(|l| a.links.contains(l))) else { continue };
        if !alone {
            continue;
        }
        let mine: Vec<u32> = a.links.iter().copied().filter(|l| out.iter().any(|g| g.contains(l))).collect();
        out[pi].extend(mine);
    }
    out
}

/// Critical flow ratio of each phase: the largest per-lane ratio of flow to saturation flow among its approaches.
fn group_flow_ratios(net: &Network, groups: &[Vec<u32>], flow: &[f32]) -> Vec<f32> {
    groups
        .iter()
        .map(|g| g.iter().map(|&l| flow[l as usize] / (SAT_FLOW * net.links[l as usize].lanes.max(1) as f32)).fold(0.0, f32::max))
        .collect()
}

/// Webster plan [Webster1958]: cycle C = (1.5 L + 5) / (1 - Y) clamped to CYCLE_MIN..CYCLE_MAX and rounded up to 5 s (or the
/// pinned cycle), green split proportional to the critical flow ratios with a minimum green. Returns (cycle, (start, green)
/// per phase, Y). A pinned cycle shorter than the clearance intervals and `GREEN_FLOOR_S` per phase is not stretched: the plan comes
/// out longer than the pin, which `plan_with_observation` reports as an issue.
pub fn webster(ys: &[f32], pinned: Option<f32>) -> (f32, Vec<(f32, f32)>, f32) {
    webster_with(ys, pinned, YELLOW + ALL_RED)
}

/// Shortest green of a phase a plan can hold (s). Below it a plan is rejected rather than stretched. ASSUMPTION: the floor the
/// allocators always used.
pub const GREEN_FLOOR_S: f32 = 5.0;

fn webster_with(ys: &[f32], pinned: Option<f32>, clearance: f32) -> (f32, Vec<(f32, f32)>, f32) {
    let np = ys.len() as f32;
    let lost = np * clearance; // L = sum of intergreens
    let ysum: f32 = ys.iter().sum();
    let cycle = if let Some(c) = pinned {
        c
    } else {
        let c = if ysum < 0.9 { (1.5 * lost + 5.0) / (1.0 - ysum) } else { CYCLE_MAX };
        // Unpinned, the model chooses the cycle, so it is long enough for the phases.
        ((c.clamp(CYCLE_MIN, CYCLE_MAX).max(lost + np * GREEN_FLOOR_S)) / 5.0).ceil() * 5.0
    };
    let avail = (cycle - lost).max(np * GREEN_FLOOR_S);
    let mut green: Vec<f32> = if ysum > 1e-6 { ys.iter().map(|&y| avail * y / ysum).collect() } else { vec![avail / np; ys.len()] };
    let minimum = MIN_GREEN.min(avail / np);
    for _ in 0..2 {
        let low = green.iter().filter(|&&g| g < minimum).count() as f32;
        if low == 0.0 {
            break;
        }
        let fixed = low * minimum;
        let rest: f32 = green.iter().filter(|&&g| g >= minimum).sum();
        for g in green.iter_mut() {
            *g = if *g < minimum { minimum } else if rest > 0.0 { *g * (avail - fixed) / rest } else { *g };
        }
    }
    let mut phases = Vec::new();
    let mut t = 0.0;
    for g in &green {
        phases.push((t, *g));
        t += g + clearance;
    }
    (t.max(1.0), phases, ysum)
}

/// Plan of a signal. An explicit cycle (`pin`, a `signal_timing` intervention) wins over an observed timing: the observed phase
/// structure (`groups`, from `own_phases`) stays, its green durations are released, and the requested cycle is split by flow
/// ratio [Webster1958]. Otherwise, when the node has an observed timing for the run's period, the observed cycle holds with the
/// observed approaches' greens fixed (the phase that holds their links) and the other phases sharing the rest of the cycle by flow
/// ratio, with the usual minimum green. Clearance after each phase is the observation's `clearance_s` when given, else
/// `YELLOW + ALL_RED`. An observation of the phasing alone (no green above 0) keeps the Webster cycle and splits. A plan whose greens and clearance intervals do not add up to its cycle is returned as an issue, never
/// stretched or shortened.
fn plan_with_observation(net: &Network, period: &str, n: usize, groups: &[Vec<u32>], ys: &[f32], pin: Option<f32>) -> Result<(f32, Vec<(f32, f32)>, f32), SignalIssue> {
    let obs = net.nodes[n].signal_timing.iter().find(|o| o.periods.iter().any(|p| p == period));
    let issue = |requested: bool, cycle: f32, required: f32, reason: String| SignalIssue {
        node: n as u32,
        period: period.to_string(),
        requested,
        cycle,
        required,
        source: obs.map_or(String::new(), |o| o.source.clone()),
        reason,
    };
    let clearance = match obs.and_then(|o| o.clearance_s) {
        Some(c) if c.is_finite() && c >= YELLOW && c <= 3.0 * (YELLOW + ALL_RED) => c,
        Some(c) => return Err(issue(false, obs.map_or(0.0, |o| o.cycle_s), 0.0, format!("has a clearance interval of {c} s, outside {YELLOW} to {} s", 3.0 * (YELLOW + ALL_RED)))),
        None => YELLOW + ALL_RED,
    };
    let np = ys.len() as f32;
    let lost = np * clearance;
    let check = |requested: bool, declared: f32, plan: (f32, Vec<(f32, f32)>, f32)| {
        if (plan.0 - declared).abs() > 1e-2 {
            return Err(issue(requested, declared, plan.0, format!("cannot hold its {} phases: their greens and clearance intervals need {:.1} s", ys.len(), plan.0)));
        }
        Ok(plan)
    };
    let in_range = |requested: bool, c: f32| {
        if !(c.is_finite() && (30.0..=180.0).contains(&c)) {
            return Err(issue(requested, c, 0.0, "is outside the supported 30 to 180 s".into()));
        }
        Ok(())
    };
    if let Some(c) = pin {
        in_range(true, c)?;
        if c + 1e-3 < lost + np * GREEN_FLOOR_S {
            return Err(issue(true, c, lost + np * GREEN_FLOOR_S, format!("cannot hold its {} phases: {GREEN_FLOOR_S} s of green and {clearance} s of clearance each need {:.1} s", ys.len(), lost + np * GREEN_FLOOR_S)));
        }
        return check(true, c, webster_with(ys, Some(c), clearance));
    }
    let Some(obs) = obs else { return Ok(webster_with(ys, None, clearance)) };
    let mut fixed: Vec<Option<f32>> = vec![None; groups.len()];
    for a in obs.greens.iter().filter(|a| a.green_s > 0.0) {
        let alone = !a.runs_with.is_empty();
        let gi = groups.iter().position(|g| g.iter().any(|l| a.links.contains(l)) && !(alone && g.iter().any(|l| a.runs_with.contains(l))));
        if let Some(gi) = gi {
            // An approach that also runs with its partner keeps its whole through green: what it has alone is that less the partner's green.
            let shared = if alone { obs.greens.iter().filter(|b| b.links.iter().any(|l| a.runs_with.contains(l))).map(|b| b.green_s).fold(0.0, f32::max) } else { 0.0 };
            fixed[gi] = Some(if alone { (a.green_s - shared).max(GREEN_FLOOR_S) } else { a.green_s });
        }
    }
    if fixed.iter().all(|f| f.is_none()) {
        return Ok(webster_with(ys, None, clearance));
    }
    let cycle = obs.cycle_s;
    in_range(false, cycle)?;
    let spent: f32 = fixed.iter().flatten().sum();
    let nfree = fixed.iter().filter(|f| f.is_none()).count() as f32;
    let required = lost + spent + nfree * GREEN_FLOOR_S;
    if cycle + 1e-3 < required {
        return Err(issue(false, cycle, required, format!("cannot hold its {} phases: the observed greens ({spent:.1} s), {clearance} s of clearance after each phase and {GREEN_FLOOR_S} s for each other phase need {required:.1} s", ys.len())));
    }
    let avail = cycle - lost - spent;
    let ysum_free: f32 = ys.iter().zip(&fixed).filter(|(_, f)| f.is_none()).map(|(y, _)| *y).sum();
    let minimum = MIN_GREEN.min(avail / nfree.max(1.0));
    let mut green: Vec<f32> = ys.iter().zip(&fixed).map(|(y, f)| f.unwrap_or(if ysum_free > 1e-6 { avail * y / ysum_free } else { avail / nfree.max(1.0) })).collect();
    for _ in 0..2 {
        let low = green.iter().zip(&fixed).filter(|(g, f)| f.is_none() && **g < minimum).count() as f32;
        if low == 0.0 {
            break;
        }
        let rest: f32 = green.iter().zip(&fixed).filter(|(g, f)| f.is_none() && **g >= minimum).map(|(g, _)| *g).sum();
        for (g, f) in green.iter_mut().zip(&fixed) {
            if f.is_none() {
                *g = if *g < minimum { minimum } else if rest > 0.0 { *g * (avail - low * minimum) / rest } else { *g };
            }
        }
    }
    let mut phases = Vec::new();
    let mut t = 0.0;
    for g in &green {
        phases.push((t, *g));
        t += g + clearance;
    }
    check(false, cycle, (t.max(1.0), phases, ys.iter().sum()))
}

/// Signal state code (1 green, 2 yellow, 3 red) of a phase at time `t`.
pub fn phase_state(p: &SigPlan, phase: usize, t: f64) -> u8 {
    if p.always_green {
        return 1;
    }
    let tc = (t - p.t0).rem_euclid(p.cycle as f64) as f32;
    let (start, g) = p.phases[phase];
    let rel = (tc - start).rem_euclid(p.cycle);
    if rel < g {
        1
    } else if rel < g + YELLOW {
        2
    } else {
        3
    }
}

/// Route-choice weight of a link class: residential and service streets are perceived as `local_factor` times
/// their travel time [ASSUMPTION], everything else as 1.
pub fn class_weight(class: crate::model::RoadClass, local_factor: f32) -> f32 {
    match class {
        crate::model::RoadClass::Residential | crate::model::RoadClass::Service => local_factor,
        _ => 1.0,
    }
}

impl Eff {
    /// Override the perceived-cost multiplier for residential/service links.
    pub fn set_local_factor(&mut self, net: &Network, f: f32) {
        self.route_w = net.links.iter().map(|l| class_weight(l.class, f)).collect();
    }
}

/// Seconds since the green of a phase ended (0 during green).
pub fn phase_since_green(p: &SigPlan, phase: usize, t: f64) -> f32 {
    if p.always_green {
        return 0.0;
    }
    let tc = (t - p.t0).rem_euclid(p.cycle as f64) as f32;
    let (start, g) = p.phases[phase];
    ((tc - start).rem_euclid(p.cycle) - g).max(0.0)
}
