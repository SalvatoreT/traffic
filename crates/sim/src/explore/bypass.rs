//! Legal bypasses of a candidate and the supplementary closure candidates on them (change improve-proposal-search-coverage, D2).
//!
//! The ranked candidate list comes from where through traffic runs in the baseline. A street that carries little through traffic today can
//! still be the legal way around a closure, and then the closure's effect depends on whether that street is treated too. For each candidate
//! that closes a movement, the witnesses of `redistribution::analyze` (the cheapest legal path around each closed movement, on free-flow
//! costs) name the blocks and junctions of its bypasses. Those locations get the closure interventions the generator would offer there.
//! Connectivity says drivers could go that way, not how many would; every supplementary candidate is still screened by simulation.

use super::cands::{generate_with, same_intervention, Cand, Hotspots, Loc};
use super::profile::Profile;
use super::Study;
use crate::model::Intervention;
use serde_json::{json, Value};
use std::collections::BTreeMap;

/// ASSUMPTION: a bypass counts when its free-flow cost exceeds the cheapest baseline path between the same points by at most this much.
pub const BYPASS_DETOUR_S: f64 = 90.0;
/// ASSUMPTION: supplementary locations taken from one candidate's bypasses.
pub const PER_CANDIDATE: usize = 6;
/// Candidate kinds that close something to cars, the only kinds the supplement adds (the existing Slow Street threshold is kept).
pub const CLOSURE_KINDS: [&str; 3] = ["modal_filter", "node_filter", "diagonal_diverter"];

#[derive(Clone, Debug, PartialEq)]
pub struct Bypass {
    /// The closed movement (in link, out link) and its junction.
    pub movement: (u32, u32),
    pub node: u32,
    pub links: Vec<u32>,
    pub cost_s: f64,
    pub base_cost_s: f64,
}

impl Bypass {
    pub fn to_json(&self) -> Value {
        json!({"movement": [self.movement.0, self.movement.1], "node": self.node, "links": self.links, "costS": self.cost_s, "baselineCostS": self.base_cost_s})
    }
    /// Junctions the path passes through (not its last link's end).
    pub fn nodes(&self, study: &Study) -> Vec<u32> {
        self.links[..self.links.len().saturating_sub(1)].iter().map(|&l| study.net.links[l as usize].to).collect()
    }
}

/// Legal bypasses of every movement `iv` closes in `period`, within `BYPASS_DETOUR_S`, cheapest extra cost first.
pub fn bypasses(study: &Study, period: &str, iv: &Intervention) -> Vec<Bypass> {
    let ivs = super::street::expand(&study.net, std::slice::from_ref(iv));
    let a = crate::redistribution::analyze(&study.net, period, "car", &[], &ivs);
    let mut out: Vec<Bypass> = Vec::new();
    for w in a["witnesses"].as_array().into_iter().flatten() {
        let mv = (w["movement"][0].as_u64().unwrap_or(0) as u32, w["movement"][1].as_u64().unwrap_or(0) as u32);
        let node = w["node"].as_u64().unwrap_or(0) as u32;
        for p in w["paths"].as_array().into_iter().flatten() {
            let (c, b) = (p["costS"].as_f64().unwrap_or(f64::INFINITY), p["baselineCostS"].as_f64().unwrap_or(0.0));
            if c - b > BYPASS_DETOUR_S {
                continue;
            }
            let links: Vec<u32> = p["links"].as_array().into_iter().flatten().filter_map(|x| x.as_u64().map(|v| v as u32)).collect();
            if !out.iter().any(|o| o.links == links) {
                out.push(Bypass { movement: mv, node, links, cost_s: c, base_cost_s: b });
            }
        }
    }
    out.sort_by(|x, y| (x.cost_s - x.base_cost_s).total_cmp(&(y.cost_s - y.base_cost_s)).then(x.links.cmp(&y.links)));
    out
}

/// Locations on a bypass where a closure could act: local blocks of its links and the in-study junctions it passes, in path order, leaving
/// out the places the candidate itself acts at.
pub fn bypass_locations(study: &Study, c: &Cand, b: &Bypass) -> Vec<Loc> {
    let mut out = Vec::new();
    for (k, &l) in b.links.iter().enumerate() {
        let lu = l as usize;
        if study.is_local[lu] {
            let blk = study.idx.block_of_link[lu];
            if Some(blk) != c.block && study.harm_blocks.contains(&blk) && !out.contains(&Loc::Block(blk)) {
                out.push(Loc::Block(blk));
            }
        }
        if k + 1 < b.links.len() {
            let n = study.net.links[lu].to;
            let node = &study.net.nodes[n as usize];
            if node.in_study_area && !node.gate && !c.nodes.contains(&n) && !out.contains(&Loc::Node(n)) {
                out.push(Loc::Node(n));
            }
        }
    }
    out
}

/// A supplementary candidate and the evidence behind it.
pub struct Supplement {
    pub cand: Cand,
    /// Index (in the base list) of the candidate whose bypass it lies on, and that bypass.
    pub from: usize,
    pub bypass: Bypass,
}

/// What the supplement did with each base candidate and location, for the coverage report.
pub struct SupplementReport {
    pub added: Vec<Supplement>,
    /// Supplementary candidates that are the same intervention as a base candidate: (base index, the base candidate whose bypass found it).
    pub already: Vec<(usize, usize)>,
    pub log: Vec<Value>,
}

/// Supplementary closure candidates on the legal bypasses of `base`'s candidates. A candidate's bypass locations are ranked by how many of
/// the movements it closes have a bypass through them, then by the smallest extra cost, then by location; locations where a base candidate
/// already acts are left out. At most `PER_CANDIDATE` per candidate and `max_locations` in all, taken in turn from the candidates in list
/// order. Deterministic for the same inputs.
pub fn supplement(study: &Study, period: &str, base: &[Cand], profile: &Profile, max_locations: usize) -> SupplementReport {
    let covered = |l: &Loc| match *l {
        Loc::Block(b) => base.iter().any(|c| c.block == Some(b)),
        Loc::Node(n) => base.iter().any(|c| c.block.is_none() && c.kind != "turn_ban" && c.kind != "slow_street" && c.nodes == vec![n]),
    };
    let mut per: Vec<(usize, Vec<(Loc, Bypass)>)> = Vec::new();
    let mut log = Vec::new();
    for (i, c) in base.iter().enumerate() {
        if !CLOSURE_KINDS.contains(&c.kind) && c.kind != "one_way" && c.kind != "turn_ban" {
            continue;
        }
        let bs = bypasses(study, period, &c.iv);
        // Per location: the closed movements whose bypasses pass it, the cheapest such bypass.
        let mut at: BTreeMap<Loc, (Vec<(u32, u32)>, Bypass)> = BTreeMap::new();
        for b in &bs {
            for l in bypass_locations(study, c, b).into_iter().filter(|l| !covered(l)) {
                let e = at.entry(l).or_insert_with(|| (Vec::new(), b.clone()));
                if !e.0.contains(&b.movement) {
                    e.0.push(b.movement);
                }
                if b.cost_s - b.base_cost_s < e.1.cost_s - e.1.base_cost_s {
                    e.1 = b.clone();
                }
            }
        }
        let mut locs: Vec<(Loc, usize, Bypass)> = at.into_iter().map(|(l, (m, b))| (l, m.len(), b)).collect();
        locs.sort_by(|x, y| y.1.cmp(&x.1).then((x.2.cost_s - x.2.base_cost_s).total_cmp(&(y.2.cost_s - y.2.base_cost_s))).then(x.0.cmp(&y.0)));
        locs.truncate(PER_CANDIDATE);
        log.push(json!({"candidate": i, "label": c.label, "bypasses": bs.len(), "locations": locs.iter().map(|(l, m, _)| json!({"location": format!("{l:?}"), "closedMovements": m})).collect::<Vec<_>>()}));
        if !locs.is_empty() {
            per.push((i, locs.into_iter().map(|(l, _, b)| (l, b)).collect()));
        }
    }
    let mut chosen: Vec<(Loc, usize, Bypass)> = Vec::new();
    let mut round = 0;
    while chosen.len() < max_locations && per.iter().any(|(_, l)| l.len() > round) {
        for (i, locs) in &per {
            if chosen.len() >= max_locations {
                break;
            }
            if let Some((l, b)) = locs.get(round) {
                if !chosen.iter().any(|x| x.0 == *l) {
                    chosen.push((*l, *i, b.clone()));
                }
            }
        }
        round += 1;
    }
    let mut hot = Hotspots { block_ct: vec![0.0; study.idx.blocks.len()], node_ct: vec![0.0; study.net.nodes.len()], mv_ct: BTreeMap::new() };
    for (k, (l, _, _)) in chosen.iter().enumerate() {
        let w = (chosen.len() - k) as f64;
        match *l {
            Loc::Block(b) => hot.block_ct[b] = w,
            Loc::Node(n) => hot.node_ct[n as usize] = w,
        }
    }
    let gen = generate_with(study, &hot, chosen.len(), profile);
    let (mut added, mut already) = (Vec::new(), Vec::new());
    for c in gen.into_iter().filter(|c| CLOSURE_KINDS.contains(&c.kind)) {
        let at = chosen.iter().find(|(l, _, _)| match *l {
            Loc::Block(b) => c.block == Some(b),
            Loc::Node(n) => c.block.is_none() && c.nodes == vec![n],
        });
        let Some((_, from, b)) = at else { continue };
        match base.iter().position(|x| same_intervention(study, &x.iv, &c.iv)) {
            Some(j) => already.push((j, *from)),
            None => added.push(Supplement { cand: Cand { loc_score: 0.0, ..c }, from: *from, bypass: b.clone() }),
        }
    }
    SupplementReport { added, already, log }
}

/// Pairs of candidates in `cands` where one lies on a legal bypass of the other (an intervention at a junction of the bypass, or on one of
/// its links), with the smallest extra bypass cost that links them. Sorted by that cost, then by index.
pub fn coordinated_pairs(study: &Study, period: &str, cands: &[Cand]) -> Vec<((u16, u16), f64)> {
    let mut best: BTreeMap<(u16, u16), f64> = BTreeMap::new();
    let links_of = |d: &Cand| -> Vec<u32> {
        if d.kind == "slow_street" {
            return d.iv.link.and_then(|l| super::street::street_run(&study.net, l)).map(|r| r.blocks.concat()).unwrap_or_default();
        }
        d.block.map(|b| study.idx.blocks[b].links.clone()).unwrap_or_default()
    };
    for (i, c) in cands.iter().enumerate() {
        for b in bypasses(study, period, &c.iv) {
            let nodes = b.nodes(study);
            for (j, d) in cands.iter().enumerate() {
                if i == j || super::cands::conflicts(c, d) {
                    continue;
                }
                let on_node = d.block.is_none() && d.kind != "slow_street" && d.nodes.iter().any(|n| nodes.contains(n));
                let on_link = links_of(d).iter().any(|l| b.links.contains(l));
                if on_node || on_link {
                    let key = (i.min(j) as u16, i.max(j) as u16);
                    let extra = b.cost_s - b.base_cost_s;
                    let e = best.entry(key).or_insert(extra);
                    *e = e.min(extra);
                }
            }
        }
    }
    let mut v: Vec<((u16, u16), f64)> = best.into_iter().collect();
    v.sort_by(|a, b| a.1.total_cmp(&b.1).then(a.0.cmp(&b.0)));
    v
}
