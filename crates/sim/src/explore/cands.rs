//! Candidate interventions (design D2, D3): the blocks and intersections that carry the most cut-through in the baseline,
//! plus the movements by which that traffic enters from the bounding streets, each with the interventions the app offers there.
//! A package never adds a traffic signal: the only control change generated is an all-way stop.

use super::naming::describe;
use super::profile::Profile;
use super::{Study, MPS_TO_MPH};
use crate::diverter::{banned_movements, node_legs};
use crate::model::{Control, Intervention, RoadClass};
use crate::sim::SelectLinkRecord;
use std::collections::{BTreeMap, HashSet};

/// Cut-through volumes found by select-link analysis of the baseline (relative trips per hour).
pub struct Hotspots {
    /// Per block index.
    pub block_ct: Vec<f64>,
    /// Per node: cut-through movements at the node that involve a local street.
    pub node_ct: Vec<f64>,
    /// Per movement (in link, out link).
    pub mv_ct: BTreeMap<(u32, u32), f64>,
}

/// Count cut-through trips (neither end inside the study area) per block, node and movement from select-link records.
/// The records must have been recorded with every in-study non-motorway link nominated.
pub fn hotspots(study: &Study, records: &[SelectLinkRecord], hours: f64) -> Hotspots {
    let net = &study.net;
    let mut h = Hotspots { block_ct: vec![0.0; study.idx.blocks.len()], node_ct: vec![0.0; net.nodes.len()], mv_ct: BTreeMap::new() };
    for r in records {
        if net.nodes[r.origin as usize].in_study_area || net.nodes[r.dest as usize].in_study_area {
            continue;
        }
        let mut seen: HashSet<usize> = HashSet::new();
        for &(l, _) in &r.hits {
            if study.is_local[l as usize] && seen.insert(study.idx.block_of_link[l as usize]) {
                h.block_ct[study.idx.block_of_link[l as usize]] += 1.0;
            }
        }
        for w in r.hits.windows(2) {
            let (a, b) = (w[0].0, w[1].0);
            if net.links[a as usize].to != net.links[b as usize].from {
                continue;
            }
            *h.mv_ct.entry((a, b)).or_default() += 1.0;
            if study.is_local[a as usize] || study.is_local[b as usize] {
                h.node_ct[net.links[a as usize].to as usize] += 1.0;
            }
        }
    }
    let k = 1.0 / hours.max(1e-9);
    h.block_ct.iter_mut().for_each(|x| *x *= k);
    h.node_ct.iter_mut().for_each(|x| *x *= k);
    h.mv_ct.values_mut().for_each(|x| *x *= k);
    h
}

#[derive(Clone)]
pub struct Cand {
    pub iv: Intervention,
    /// Short code: modal_filter, node_filter, diagonal_diverter, one_way, turn_ban, speed_hump, traffic_circle, speed_limit, control, signal_timing.
    pub kind: &'static str,
    pub label: String,
    /// Canonical key: two candidates with the same key are the same intervention.
    pub key: String,
    /// Block the intervention sits on, if any.
    pub block: Option<usize>,
    /// Intersections the intervention touches (a block's two ends, or the node itself).
    pub nodes: Vec<u32>,
    /// Street names for titles.
    pub places: Vec<String>,
    pub loc_score: f64,
}

#[derive(Clone, Copy, PartialEq)]
enum Loc {
    Block(usize),
    Node(u32),
}

/// Speed limits offered, in mph (as in the app).
pub const SPEED_LIMITS_MPH: [f64; 2] = [15.0, 20.0];
pub const CYCLES_S: [f64; 2] = [60.0, 120.0];

/// The app's mph to m/s at two decimals, the precision a scenario link carries.
pub fn mph_to_mps(mph: f64) -> f64 {
    (mph / MPS_TO_MPH * 100.0).round() / 100.0
}

pub fn generate(study: &Study, hot: &Hotspots, n_loc: usize) -> Vec<Cand> {
    generate_with(study, hot, n_loc, &Profile::unconstrained())
}

/// Candidates under a profile. Boundary locations are dropped before the top `n_loc` are taken, so a constrained search still gets `n_loc` locations.
pub fn generate_with(study: &Study, hot: &Hotspots, n_loc: usize, profile: &Profile) -> Vec<Cand> {
    let (net, idx, topo) = (&study.net, &study.idx, &study.topo);
    let mut locs: Vec<(Loc, f64)> = Vec::new();
    for &b in &study.harm_blocks {
        if hot.block_ct[b] > 0.0 {
            locs.push((Loc::Block(b), hot.block_ct[b]));
        }
    }
    for n in &net.nodes {
        let touches_study = n.in_study_area || idx.incoming[n.id as usize].iter().chain(idx.outgoing[n.id as usize].iter()).any(|&l| net.links[l as usize].in_study_area);
        if !n.gate && touches_study && hot.node_ct[n.id as usize] > 0.0 {
            locs.push((Loc::Node(n.id), hot.node_ct[n.id as usize]));
        }
    }
    let rank = |l: &Loc| match l {
        Loc::Block(b) => (0, *b as u32),
        Loc::Node(n) => (1, *n),
    };
    let interior = |l: &Loc| match *l {
        Loc::Block(b) => idx.blocks[b].links.iter().all(|&k| !study.is_boundary[k as usize]) && !study.boundary_node[idx.blocks[b].a as usize] && !study.boundary_node[idx.blocks[b].b as usize],
        Loc::Node(n) => !study.boundary_node[n as usize],
    };
    locs.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal).then_with(|| rank(&a.0).cmp(&rank(&b.0))));
    if profile.exclude_boundary {
        locs.retain(|(l, _)| interior(l));
        locs.truncate(n_loc);
    } else {
        // A looser profile keeps every location a stricter one gets: the top `n_loc` overall plus the top `n_loc` that are not on the boundary,
        // so busy boundary locations cannot crowd out the interior ones a constrained search finds.
        let mut interior_seen = 0;
        let mut keep: Vec<bool> = vec![false; locs.len()];
        for (i, (l, _)) in locs.iter().enumerate() {
            if interior(l) {
                interior_seen += 1;
                keep[i] = interior_seen <= n_loc;
            }
            keep[i] |= i < n_loc;
        }
        let mut k = keep.into_iter();
        locs.retain(|_| k.next().unwrap_or(false));
    }

    let mut out: Vec<Cand> = Vec::new();
    let mut keys: HashSet<String> = HashSet::new();
    let mut add = |out: &mut Vec<Cand>, iv: Intervention, kind: &'static str, key: String, block: Option<usize>, nodes: Vec<u32>, places: Vec<String>, score: f64| {
        if !keys.insert(key.clone()) {
            return;
        }
        let label = describe(net, topo, idx, &iv);
        out.push(Cand { iv, kind, label, key, block, nodes, places, loc_score: score });
    };
    let local_class = |l: u32| matches!(net.links[l as usize].class, RoadClass::Residential | RoadClass::Service);
    for (loc, score) in &locs {
        match *loc {
            Loc::Block(b) => {
                let blk = &idx.blocks[b];
                let a = blk.links[0];
                let link = &net.links[a as usize];
                let places = vec![blk.name.clone()];
                let nodes = vec![blk.a, blk.b];
                let iv = |ty: &str| Intervention { ty: ty.into(), link: Some(a), ..Default::default() };
                add(&mut out, iv("modal_filter"), "modal_filter", format!("mf:b{b}"), Some(b), nodes.clone(), places.clone(), *score);
                if blk.links.len() == 2 {
                    for &l in &blk.links {
                        let v = Intervention { ty: "one_way".into(), link: Some(l), ..Default::default() };
                        add(&mut out, v, "one_way", format!("ow:l{l}"), Some(b), nodes.clone(), places.clone(), *score);
                    }
                }
                let hump_free = blk.links.iter().all(|&l| net.links[l as usize].humps.is_empty());
                if hump_free && link.length >= 30.0 {
                    let v = Intervention { ty: "speed_hump".into(), link: Some(a), position: Some((link.length / 2.0 * 10.0).round() / 10.0), ..Default::default() };
                    add(&mut out, v, "speed_hump", format!("sh:b{b}"), Some(b), nodes.clone(), places.clone(), *score);
                }
                for mph in SPEED_LIMITS_MPH {
                    let mps = mph_to_mps(mph);
                    if blk.links.iter().all(|&l| net.links[l as usize].speed_limit > mps + 0.1) {
                        let v = Intervention { ty: "speed_limit".into(), link: Some(a), speed: Some(mps), ..Default::default() };
                        add(&mut out, v, "speed_limit", format!("sl{mph}:b{b}"), Some(b), nodes.clone(), places.clone(), *score);
                    }
                }
            }
            Loc::Node(n) => {
                let nu = n as usize;
                let incident: Vec<u32> = idx.incoming[nu].iter().chain(idx.outgoing[nu].iter()).copied().collect();
                let all_local = !incident.is_empty() && incident.iter().all(|&l| local_class(l));
                let any_local = incident.iter().any(|&l| local_class(l));
                let arterial = incident.iter().any(|&l| matches!(net.links[l as usize].class, RoadClass::Primary | RoadClass::Secondary | RoadClass::Motorway));
                let legs = node_legs(topo, net, n).len();
                let mut places: Vec<String> = Vec::new();
                for &l in &incident {
                    if local_class(l) {
                        let s = idx.link_name[l as usize].clone();
                        if !places.contains(&s) {
                            places.push(s);
                        }
                    }
                }
                if places.is_empty() {
                    places = idx.node_streets[nu].clone();
                }
                let ctrl = net.nodes[nu].control;
                let nodes = vec![n];
                if all_local && legs >= 3 {
                    let v = Intervention { ty: "modal_filter".into(), node: Some(n), ..Default::default() };
                    add(&mut out, v, "node_filter", format!("mn:n{n}"), None, nodes.clone(), places.clone(), *score);
                    for (street, links) in street_filters(study, n) {
                        let key = format!("mn:n{n}:l{}", links.iter().map(|l| l.to_string()).collect::<Vec<_>>().join("."));
                        let v = Intervention { ty: "modal_filter".into(), node: Some(n), legs: Some(links), ..Default::default() };
                        add(&mut out, v, "node_filter", key, None, nodes.clone(), vec![street], *score);
                    }
                }
                if all_local && legs == 4 {
                    // Sweep the barrier bearing and keep one bearing per distinct set of banned movements (the two orientations).
                    let mut groups: Vec<(Vec<(u32, u32)>, Vec<u32>)> = Vec::new();
                    for deg in 0..180u32 {
                        if let Ok(banned) = banned_movements(topo, net, n, deg as f64) {
                            match groups.iter_mut().find(|g| g.0 == banned) {
                                Some(g) => g.1.push(deg),
                                None => groups.push((banned, vec![deg])),
                            }
                        }
                    }
                    for (_, degs) in groups {
                        let deg = degs[degs.len() / 2];
                        let v = Intervention { ty: "diagonal_diverter".into(), node: Some(n), bearing: Some(deg as f64), ..Default::default() };
                        add(&mut out, v, "diagonal_diverter", format!("dd:n{n}:{}", degs[0]), None, nodes.clone(), places.clone(), *score);
                    }
                }
                if all_local && legs == 4 && matches!(ctrl, Control::Uncontrolled | Control::TwoWayStop | Control::AllWayStop) {
                    let v = Intervention { ty: "traffic_circle".into(), node: Some(n), ..Default::default() };
                    add(&mut out, v, "traffic_circle", format!("tc:n{n}"), None, nodes.clone(), places.clone(), *score);
                }
                if any_local && !arterial && legs >= 3 && matches!(ctrl, Control::Uncontrolled | Control::TwoWayStop) {
                    let v = Intervention { ty: "control".into(), node: Some(n), control: Some(Control::AllWayStop), ..Default::default() };
                    add(&mut out, v, "control", format!("ct:n{n}:a"), None, nodes.clone(), places.clone(), *score);
                }
                if ctrl == Control::Signal {
                    for c in CYCLES_S {
                        let v = Intervention { ty: "signal_timing".into(), node: Some(n), cycle: Some(c), ..Default::default() };
                        add(&mut out, v, "signal_timing", format!("st{c}:n{n}"), None, nodes.clone(), places.clone(), *score);
                    }
                }
            }
        }
    }
    // Turn bans: the heaviest cut-through movements from an arterial onto a local street.
    let osm: HashSet<(u32, u32)> = net.turn_bans.iter().map(|b| (b.from, b.to)).collect();
    let mut mvs: Vec<((u32, u32), f64)> = hot
        .mv_ct
        .iter()
        .filter(|((a, b), _)| !study.is_local[*a as usize] && study.is_local[*b as usize] && matches!(net.links[*a as usize].class, RoadClass::Primary | RoadClass::Secondary | RoadClass::Tertiary) && !osm.contains(&(*a, *b)))
        .map(|(k, v)| (*k, *v))
        .collect();
    mvs.sort_by(|x, y| y.1.partial_cmp(&x.1).unwrap_or(std::cmp::Ordering::Equal).then_with(|| x.0.cmp(&y.0)));
    for ((a, b), v) in mvs.into_iter().take((n_loc / 4).max(4)) {
        let node = net.links[a as usize].to;
        let places = vec![idx.link_name[b as usize].clone()];
        let iv = Intervention { ty: "turn_ban".into(), from_link: Some(a), to_link: Some(b), ..Default::default() };
        let label = describe(net, topo, idx, &iv);
        if profile.exclude_boundary && study.boundary_node[node as usize] {
            continue;
        }
        if keys.insert(format!("tb:{a}-{b}")) {
            out.push(Cand { iv, kind: "turn_ban", label, key: format!("tb:{a}-{b}"), block: None, nodes: vec![node], places, loc_score: v });
        }
    }
    out.retain(|c| !profile.exclude_types.iter().any(|t| *t == c.iv.ty));
    out
}

/// The per-street filters a node offers: for each street, the links of all its legs, when closing them leaves at least two other legs connected
/// (otherwise the filter is the whole junction). Streets are in name order; a node on a single street offers none.
pub fn street_filters(study: &Study, node: u32) -> Vec<(String, Vec<u32>)> {
    let legs = node_legs(&study.topo, &study.net, node);
    let mut by: BTreeMap<String, Vec<u32>> = BTreeMap::new();
    let mut count: BTreeMap<String, usize> = BTreeMap::new();
    for leg in &legs {
        let first = leg.outs.first().or(leg.ins.first()).copied();
        let Some(first) = first else { continue };
        let name = study.idx.link_name[first as usize].clone();
        by.entry(name.clone()).or_default().extend(leg.ins.iter().chain(leg.outs.iter()).copied());
        *count.entry(name).or_default() += 1;
    }
    if by.len() < 2 {
        return Vec::new();
    }
    by.into_iter()
        .filter(|(name, _)| legs.len() - count[name] >= 2)
        .map(|(name, mut links)| {
            links.sort_unstable();
            (name, links)
        })
        .collect()
}

/// Two candidates may not appear in one package.
pub fn conflicts(a: &Cand, b: &Cand) -> bool {
    if a.key == b.key {
        return true;
    }
    if let (Some(x), Some(y)) = (a.block, b.block) {
        if x == y {
            return true;
        }
    }
    let node_kind = |c: &Cand| matches!(c.kind, "node_filter" | "diagonal_diverter" | "traffic_circle" | "control" | "signal_timing");
    let on_node = |c: &Cand| c.block.is_none() && c.kind != "turn_ban";
    if on_node(a) && on_node(b) && a.nodes == b.nodes {
        return true;
    }
    // A turn ban at a node that another intervention already reshapes is redundant.
    if (a.kind == "turn_ban" && node_kind(b) && a.nodes == b.nodes) || (b.kind == "turn_ban" && node_kind(a) && a.nodes == b.nodes) {
        return true;
    }
    false
}

/// Whether a profile permits an intervention: its type is not excluded and, when the profile keeps off the boundary, it touches no bounding street or its intersections.
pub fn profile_allows(study: &Study, profile: &Profile, iv: &Intervention) -> bool {
    if profile.exclude_types.iter().any(|t| *t == iv.ty) {
        return false;
    }
    if !profile.exclude_boundary {
        return true;
    }
    let (net, idx) = (&study.net, &study.idx);
    let link_ok = |l: u32| (l as usize) < net.links.len() && !study.is_boundary[l as usize] && !study.boundary_node[net.links[l as usize].from as usize] && !study.boundary_node[net.links[l as usize].to as usize];
    match (iv.link, iv.node, iv.from_link) {
        (Some(l), _, _) => idx.blocks.get(idx.block_of_link.get(l as usize).copied().unwrap_or(usize::MAX)).map_or(false, |b| b.links.iter().all(|&k| link_ok(k))),
        (_, Some(n), _) => (n as usize) < net.nodes.len() && !study.boundary_node[n as usize],
        (_, _, Some(a)) => link_ok(a) && iv.to_link.map_or(false, link_ok),
        _ => false,
    }
}

/// Do two interventions do the same thing in the network? Equal up to the direction a block filter or hump is placed from, and the barrier bearings of a diverter that ban the same movements.
pub fn same_intervention(study: &Study, a: &Intervention, b: &Intervention) -> bool {
    if a.ty != b.ty {
        return false;
    }
    let block = |l: Option<u32>| l.and_then(|l| study.idx.block_of_link.get(l as usize).copied());
    let legs = |iv: &Intervention| -> Option<Vec<u32>> {
        let all: Vec<u32> = node_legs(&study.topo, &study.net, iv.node?).iter().flat_map(|l| l.ins.iter().chain(l.outs.iter()).copied()).collect();
        let mut v = iv.legs.clone().unwrap_or(all.clone());
        v.sort_unstable();
        v.dedup();
        let mut all = all;
        all.sort_unstable();
        Some(if v == all { Vec::new() } else { v })
    };
    match a.ty.as_str() {
        "modal_filter" if a.link.is_some() || b.link.is_some() => block(a.link).is_some() && block(a.link) == block(b.link),
        "modal_filter" => a.node == b.node && legs(a) == legs(b),
        "speed_hump" => block(a.link).is_some() && block(a.link) == block(b.link),
        "speed_limit" => block(a.link).is_some() && block(a.link) == block(b.link) && (a.speed.unwrap_or(0.0) - b.speed.unwrap_or(0.0)).abs() < 0.02,
        "one_way" => a.link == b.link,
        "turn_ban" => a.from_link == b.from_link && a.to_link == b.to_link,
        "control" => a.node == b.node && a.control == b.control,
        "signal_timing" => a.node == b.node && a.cycle == b.cycle,
        "diagonal_diverter" => {
            a.node == b.node
                && match (a.node, a.bearing, b.bearing) {
                    (Some(n), Some(x), Some(y)) => banned_movements(&study.topo, &study.net, n, x).ok() == banned_movements(&study.topo, &study.net, n, y).ok(),
                    _ => false,
                }
        }
        _ => a.node == b.node,
    }
}

/// Index of the candidate that does what `iv` does, adding one (kind, conflict keys and label as for generated candidates) when there is none.
pub fn adopt(study: &Study, cands: &mut Vec<Cand>, iv: &Intervention) -> u16 {
    if let Some(i) = cands.iter().position(|c| same_intervention(study, &c.iv, &iv)) {
        return i as u16;
    }
    let (net, idx) = (&study.net, &study.idx);
    let blk = iv.link.and_then(|l| idx.block_of_link.get(l as usize).copied());
    let (kind, block, nodes, places): (&'static str, Option<usize>, Vec<u32>, Vec<String>) = match iv.ty.as_str() {
        "modal_filter" if iv.node.is_some() => ("node_filter", None, vec![iv.node.unwrap()], idx.node_streets[iv.node.unwrap() as usize].clone()),
        "modal_filter" => ("modal_filter", blk, blk.map(|b| vec![idx.blocks[b].a, idx.blocks[b].b]).unwrap_or_default(), blk.map(|b| vec![idx.blocks[b].name.clone()]).unwrap_or_default()),
        "one_way" => ("one_way", blk, blk.map(|b| vec![idx.blocks[b].a, idx.blocks[b].b]).unwrap_or_default(), blk.map(|b| vec![idx.blocks[b].name.clone()]).unwrap_or_default()),
        "speed_hump" => ("speed_hump", blk, blk.map(|b| vec![idx.blocks[b].a, idx.blocks[b].b]).unwrap_or_default(), blk.map(|b| vec![idx.blocks[b].name.clone()]).unwrap_or_default()),
        "speed_limit" => ("speed_limit", blk, blk.map(|b| vec![idx.blocks[b].a, idx.blocks[b].b]).unwrap_or_default(), blk.map(|b| vec![idx.blocks[b].name.clone()]).unwrap_or_default()),
        "turn_ban" => ("turn_ban", None, iv.from_link.map(|a| vec![net.links[a as usize].to]).unwrap_or_default(), iv.to_link.map(|b| vec![idx.link_name[b as usize].clone()]).unwrap_or_default()),
        "diagonal_diverter" => ("diagonal_diverter", None, vec![iv.node.unwrap_or(0)], idx.node_streets.get(iv.node.unwrap_or(0) as usize).cloned().unwrap_or_default()),
        "traffic_circle" => ("traffic_circle", None, vec![iv.node.unwrap_or(0)], idx.node_streets.get(iv.node.unwrap_or(0) as usize).cloned().unwrap_or_default()),
        "control" => ("control", None, vec![iv.node.unwrap_or(0)], idx.node_streets.get(iv.node.unwrap_or(0) as usize).cloned().unwrap_or_default()),
        _ => ("signal_timing", None, vec![iv.node.unwrap_or(0)], idx.node_streets.get(iv.node.unwrap_or(0) as usize).cloned().unwrap_or_default()),
    };
    let key = format!("seed:{}", serde_json::to_string(iv).unwrap_or_default());
    let label = describe(net, &study.topo, idx, iv);
    cands.push(Cand { iv: iv.clone(), kind, label, key, block, nodes, places, loc_score: 0.0 });
    (cands.len() - 1) as u16
}
