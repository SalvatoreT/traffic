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
    /// Demand period of the run: selects the observed signal timing of a node (`Node::signal_timing`).
    pub period: String,
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
                                        hit = true;
                                    }
                                    if k.from == n {
                                        leg_out_closed[l as usize] = true;
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
                        cycle_override[n as usize] = Some((c as f32).clamp(30.0, 180.0));
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
            period: String::new(),
        }
    }

    fn plan_for(&self, net: &Network, n: usize, groups: &[Vec<u32>], ys: &[f32], pin: Option<f32>) -> (f32, Vec<(f32, f32)>, f32) {
        plan_with_observation(net, &self.period, n, groups, ys, pin)
    }

    /// Build the start-up signal plans. `est_flow[l]` is the estimated approach flow (veh/h); `adapt_signals` replaces the
    /// splits later from measured flows.
    pub fn plan_signals(&mut self, topo: &Topo, net: &Network, est_flow: &[f32]) {
        let nn = topo.n_nodes;
        for n in 0..nn {
            self.sig[n] = None;
        }
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
            let (cycle, phases, ysum) = self.plan_for(net, n, &groups, &ys, self.cycle_override[n]);
            let offset = ((n as f32 * 37.0) % 100.0) / 100.0 * cycle;
            self.sig[n] = Some(SigPlan { cycle, t0: -(offset as f64), phases, links: groups, always_green: false, ysum, next: None });
        }
    }

    /// Recompute the splits (and the cycle unless pinned by an intervention) of every signal from measured approach flows
    /// (veh/h). The new plan starts when the current cycle ends, so no phase is cut short.
    pub fn adapt_signals(&mut self, net: &Network, flow: &[f32], t: f64) {
        for n in 0..self.sig.len() {
            let pin = self.cycle_override[n];
            let Some(p) = self.sig[n].as_mut() else { continue };
            if p.always_green {
                continue;
            }
            let ys = group_flow_ratios(net, &p.links, flow);
            let (cycle, phases, ysum) = plan_with_observation(net, &self.period, n, &p.links, &ys, pin);
            let k = ((t - p.t0) / p.cycle as f64).ceil().max(1.0);
            let start = p.t0 + k * p.cycle as f64;
            p.next = Some(Box::new(SigNext { t0: start, cycle, phases, ysum }));
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
/// per phase, Y).
pub fn webster(ys: &[f32], pinned: Option<f32>) -> (f32, Vec<(f32, f32)>, f32) {
    let np = ys.len() as f32;
    let lost = np * (YELLOW + ALL_RED); // L = sum of intergreens
    let ysum: f32 = ys.iter().sum();
    let cycle = if let Some(c) = pinned {
        c
    } else {
        let c = if ysum < 0.9 { (1.5 * lost + 5.0) / (1.0 - ysum) } else { CYCLE_MAX };
        (c.clamp(CYCLE_MIN, CYCLE_MAX) / 5.0).ceil() * 5.0
    };
    let avail = (cycle - lost).max(np * 5.0);
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
        t += g + YELLOW + ALL_RED;
    }
    (t.max(1.0), phases, ysum)
}

/// Plan of a signal: Webster from the flow ratios, or, when the node has an observed timing for the run's period, the observed cycle with the observed approaches' green
/// fixed (the phase that holds their links) and the other phases sharing the rest of the cycle by flow ratio, with the usual minimum green.
fn plan_with_observation(net: &Network, period: &str, n: usize, groups: &[Vec<u32>], ys: &[f32], pin: Option<f32>) -> (f32, Vec<(f32, f32)>, f32) {
    let Some(obs) = net.nodes[n].signal_timing.iter().find(|o| o.periods.iter().any(|p| p == period)) else { return webster(ys, pin) };
    let mut fixed: Vec<Option<f32>> = vec![None; groups.len()];
    for a in &obs.greens {
        let alone = !a.runs_with.is_empty();
        let gi = groups.iter().position(|g| g.iter().any(|l| a.links.contains(l)) && !(alone && g.iter().any(|l| a.runs_with.contains(l))));
        if let Some(gi) = gi {
            // An approach that also runs with its partner keeps its whole through green: what it has alone is that less the partner's green.
            let shared = if alone { obs.greens.iter().filter(|b| b.links.iter().any(|l| a.runs_with.contains(l))).map(|b| b.green_s).fold(0.0, f32::max) } else { 0.0 };
            fixed[gi] = Some(if alone { (a.green_s - shared).max(5.0) } else { a.green_s });
        }
    }
    if fixed.iter().all(|f| f.is_none()) {
        return webster(ys, pin);
    }
    let np = ys.len() as f32;
    let lost = np * (YELLOW + ALL_RED);
    let cycle = obs.cycle_s.clamp(30.0, 180.0);
    let spent: f32 = fixed.iter().flatten().sum();
    let nfree = fixed.iter().filter(|f| f.is_none()).count() as f32;
    let avail = (cycle - lost - spent).max(nfree * 5.0);
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
        t += g + YELLOW + ALL_RED;
    }
    (t.max(1.0), phases, ys.iter().sum())
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
