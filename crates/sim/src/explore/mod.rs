//! Intervention search: finds packages of interventions that cut cut-through traffic on the study area's local streets
//! without piling it onto one neighbor's street. See `openspec/changes/proposals/` (design D1 to D6) and `data/proposals/README.md`.
//! The `explore` binary is a thin wrapper; the logic lives here so tests can run it on small synthetic networks.

pub mod cands;
pub mod link;
pub mod naming;
pub mod profile;
pub mod refs;
pub mod report;
pub mod search;
pub mod util;

use crate::eff::Eff;
use crate::model::{Config, Demand, Intervention, Network, RoadClass};
use crate::sim::{SelectLinkRecord, Simulation};
use crate::topo::Topo;
use naming::NameIndex;
use std::collections::HashSet;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Mutex;

pub const MI_PER_KM: f64 = 0.621371;
pub const MPS_TO_MPH: f64 = 2.2369362920544;
/// Dead band for "traffic increased on a block": `max(NOISE_SIGMAS x per-block standard deviation of flow across seeds, NOISE_FLOOR_VEH_H)`.
pub const NOISE_SIGMAS: f64 = 2.0;
/// ASSUMPTION: smallest increase (veh/h, both directions of a block) treated as real when the seeds give no spread.
pub const NOISE_FLOOR_VEH_H: f64 = 10.0;
/// ASSUMPTION: smallest reduction in cut-through (percent of baseline) treated as real when comparing options.
pub const GOAL_NOISE_FLOOR_PCT: f64 = 1.0;
/// ASSUMPTION: a scenario is rejected when its gridlock removals exceed the baseline's by more than this share plus `GRIDLOCK_SLACK`
/// (removed vehicles vanish from the cut-through count, so they would read as a reduction).
pub const GRIDLOCK_SHARE: f64 = 0.2;
pub const GRIDLOCK_SLACK: f64 = 10.0;
/// ASSUMPTION: a scenario is rejected when its entry backlog exceeds the baseline's by more than this share of spawned trips.
pub const BACKLOG_SHARE: f64 = 0.05;

#[derive(Clone, Debug)]
pub struct Params {
    pub area: String,
    pub periods: Vec<String>,
    pub seeds: Vec<u64>,
    pub beam: usize,
    pub depth: usize,
    /// Number of ranked locations (blocks and intersections) that get candidate interventions.
    pub candidates: usize,
    pub screen_minutes: f64,
    /// Length of the recheck runs and of the baseline (design: the full hour).
    pub minutes: f64,
    pub budget_evals: Option<usize>,
    pub jobs: usize,
    /// Percentage points of cut-through reduction one veh/h of harm costs in the search score. ASSUMPTION.
    pub harm_weight: f64,
    /// Singles (by score) that every partial package may be extended with, besides the repair moves.
    pub expand: usize,
    pub finalists: usize,
    pub options: usize,
    /// Hand-written packages to evaluate and publish alongside the search results.
    pub references: Vec<refs::RefCfg>,
    /// Limits on which interventions the search may use; the default has none.
    pub profile: profile::Profile,
    pub out: Option<PathBuf>,
    pub report: Option<PathBuf>,
}

impl Params {
    pub fn new(area: &str) -> Params {
        Params {
            area: area.into(),
            periods: vec!["pm_peak".into()],
            seeds: vec![1],
            beam: 3,
            depth: 8,
            candidates: 40,
            screen_minutes: 30.0,
            minutes: 60.0,
            budget_evals: None,
            jobs: std::thread::available_parallelism().map(|n| n.get()).unwrap_or(1),
            harm_weight: 0.1,
            expand: 16,
            finalists: 12,
            options: 5,
            references: Vec::new(),
            profile: profile::Profile::unconstrained(),
            out: None,
            report: None,
        }
    }
}

pub struct Bounding {
    pub name: String,
    pub links: Vec<u32>,
}

pub struct Study {
    pub area: String,
    pub net: Network,
    pub demand: Demand,
    pub origin: (f64, f64),
    pub net_hash: String,
    pub demand_hash: String,
    pub calibration: String,
    pub topo: Topo,
    pub idx: NameIndex,
    /// Link is a residential or service street inside the study area (the cut-through domain).
    pub is_local: Vec<bool>,
    /// Blocks (indices into `idx.blocks`) made of local links: where harm is measured.
    pub harm_blocks: Vec<usize>,
    /// Arterial streets that run through the study area: their flows and speeds are reported for information.
    pub bounding: Vec<Bounding>,
    /// Per link: a non-local street inside the study area, that is, one of its bounding streets.
    pub is_boundary: Vec<bool>,
    /// Per node: an intersection with a bounding street.
    pub boundary_node: Vec<bool>,
    /// In-study nodes that already lack a way in or out by car in the baseline network.
    pub base_fail: HashSet<u32>,
}

impl Study {
    pub fn load(root: &Path, area: &str) -> Result<Study, String> {
        let read = |p: PathBuf| std::fs::read(&p).map_err(|e| format!("cannot read {}: {e}", p.display()));
        let net_bytes = read(root.join(format!("public/data/{area}.network.json")))?;
        let dem_bytes = read(root.join(format!("public/data/{area}.demand.json")))?;
        let net: Network = serde_json::from_slice(&net_bytes).map_err(|e| format!("network: {e}"))?;
        let demand: Demand = serde_json::from_slice(&dem_bytes).map_err(|e| format!("demand: {e}"))?;
        let raw: serde_json::Value = serde_json::from_slice(&net_bytes).map_err(|e| format!("network: {e}"))?;
        let origin = (raw["origin"]["lon"].as_f64().ok_or("network has no origin")?, raw["origin"]["lat"].as_f64().ok_or("network has no origin")?);
        let calibration = std::fs::read(root.join("public/data/areas.json"))
            .ok()
            .and_then(|b| serde_json::from_slice::<serde_json::Value>(&b).ok())
            .and_then(|v| v.as_array().and_then(|a| a.iter().find(|e| e["id"] == area).cloned()))
            .and_then(|e| e["calibration"]["status"].as_str().map(String::from))
            .unwrap_or_else(|| "uncalibrated".into());
        Ok(Study::from_parts(area, net, demand, origin, util::short_hash(&net_bytes), util::short_hash(&dem_bytes), calibration))
    }

    pub fn from_parts(area: &str, net: Network, demand: Demand, origin: (f64, f64), net_hash: String, demand_hash: String, calibration: String) -> Study {
        let topo = Topo::new(&net);
        let idx = NameIndex::new(&net);
        let is_local: Vec<bool> = net.links.iter().map(|l| l.in_study_area && matches!(l.class, RoadClass::Residential | RoadClass::Service)).collect();
        let harm_blocks: Vec<usize> = (0..idx.blocks.len()).filter(|&b| idx.blocks[b].links.iter().any(|&l| is_local[l as usize])).collect();
        let mut bounding: Vec<Bounding> = Vec::new();
        for l in &net.links {
            if !l.in_study_area || !matches!(l.class, RoadClass::Primary | RoadClass::Secondary | RoadClass::Tertiary) || l.name.trim().is_empty() {
                continue;
            }
            match bounding.iter_mut().find(|b| b.name == l.name.trim()) {
                Some(b) => b.links.push(l.id),
                None => bounding.push(Bounding { name: l.name.trim().to_string(), links: vec![l.id] }),
            }
        }
        bounding.sort_by(|a, b| b.links.len().cmp(&a.links.len()).then_with(|| a.name.cmp(&b.name)));
        let is_boundary: Vec<bool> = net.links.iter().map(|l| l.in_study_area && !matches!(l.class, RoadClass::Residential | RoadClass::Service)).collect();
        let mut boundary_node = vec![false; net.nodes.len()];
        for l in net.links.iter().filter(|l| is_boundary[l.id as usize]) {
            boundary_node[l.from as usize] = true;
            boundary_node[l.to as usize] = true;
        }
        let mut s = Study { area: area.into(), net, demand, origin, net_hash, demand_hash, calibration, topo, idx, is_local, harm_blocks, bounding, is_boundary, boundary_node, base_fail: HashSet::new() };
        let eff = Eff::derive(&s.topo, &s.net, &[]);
        s.base_fail = stranded_nodes(&s, &eff).into_iter().collect();
        s
    }

    pub fn encode(&self, ivs: &[Intervention], period: Option<&str>) -> String {
        link::encode_scenario(&self.net, self.origin, ivs, &self.area, period)
    }
}

/// In-study nodes that cannot be reached by car from some gate, or cannot reach a gate, in the effective network.
pub fn stranded_nodes(study: &Study, eff: &Eff) -> Vec<u32> {
    let (topo, net) = (&study.topo, &study.net);
    let nl = topo.n_links;
    let usable = |l: usize| !eff.closed[l];
    let mut fwd = vec![false; nl];
    let mut stack: Vec<usize> = Vec::new();
    let mut bwd = vec![false; nl];
    let mut preds: Vec<Vec<u32>> = vec![Vec::new(); nl];
    for (i, m) in topo.mvs.iter().enumerate() {
        if eff.mv_ok[i] && usable(m.a as usize) && usable(m.b as usize) {
            preds[m.b as usize].push(m.a);
        }
    }
    for n in &net.nodes {
        if !n.gate {
            continue;
        }
        for &l in &topo.outs[n.id as usize] {
            if usable(l as usize) && !fwd[l as usize] {
                fwd[l as usize] = true;
                stack.push(l as usize);
            }
        }
    }
    while let Some(a) = stack.pop() {
        for k in topo.lm_start[a]..topo.lm_start[a] + topo.lm_cnt[a] {
            let m = &topo.mvs[k as usize];
            if eff.mv_ok[k as usize] && usable(m.b as usize) && !fwd[m.b as usize] {
                fwd[m.b as usize] = true;
                stack.push(m.b as usize);
            }
        }
    }
    for n in &net.nodes {
        if !n.gate {
            continue;
        }
        for &l in &topo.ins[n.id as usize] {
            if usable(l as usize) && !bwd[l as usize] {
                bwd[l as usize] = true;
                stack.push(l as usize);
            }
        }
    }
    while let Some(b) = stack.pop() {
        for &a in &preds[b] {
            if !bwd[a as usize] {
                bwd[a as usize] = true;
                stack.push(a as usize);
            }
        }
    }
    let mut out = Vec::new();
    for n in &net.nodes {
        if !n.in_study_area {
            continue;
        }
        let nu = n.id as usize;
        let can_enter = n.gate || topo.ins[nu].iter().any(|&l| fwd[l as usize]);
        let can_leave = n.gate || topo.outs[nu].iter().any(|&l| usable(l as usize) && bwd[l as usize]);
        if !(can_enter && can_leave) {
            out.push(n.id);
        }
    }
    out
}

/// Check a package before simulating it: every intervention must be valid and no in-study node may be stranded that the baseline
/// did not already strand (design D2). `Err` holds the reason.
pub fn check_access(study: &Study, ivs: &[Intervention]) -> Result<(), String> {
    let eff = Eff::derive(&study.topo, &study.net, ivs);
    if eff.invalid_ivs > 0 {
        return Err("invalid intervention".into());
    }
    let bad: Vec<u32> = stranded_nodes(study, &eff).into_iter().filter(|n| !study.base_fail.contains(n)).collect();
    match bad.first() {
        Some(&n) => Err(format!("strands {} node(s), first at {}", bad.len(), study.idx.node_label(n))),
        None => Ok(()),
    }
}

/// Results of one headless run.
pub struct RunOut {
    pub ct_km: f64,
    pub veh_km: f64,
    pub inside_n: u64,
    pub inside_tt_s: f64,
    pub unroutable: u64,
    pub gridlock_removed: u64,
    pub backlog: u64,
    pub spawned: u64,
    pub completed: u64,
    pub invalid: u64,
    pub ped_conflicts: u64,
    pub bike_conflicts: u64,
    /// Veh/h per link over the window after warm-up (cars and trucks; every link).
    pub flow: Vec<f32>,
    /// Mean of the sim's rolling 5-minute mean speed per link (m/s), sampled every 5 minutes after warm-up.
    pub speed: Vec<f32>,
    pub records: Vec<SelectLinkRecord>,
}

impl RunOut {
    pub fn ct_mi(&self) -> f64 {
        self.ct_km * MI_PER_KM
    }
    pub fn inside_mean_s(&self) -> f64 {
        if self.inside_n > 0 {
            self.inside_tt_s / self.inside_n as f64
        } else {
            0.0
        }
    }
}

/// Run the simulation headless from an empty network (no initial loading: the search measures its own warm-up). The first `min(600 s, 25%)` of the run is warm-up for the flow and speed figures; cut-through
/// vehicle-miles cover the whole run, as `metrics().cutThrough` does.
pub fn run(study: &Study, ivs: &[Intervention], period: &str, seed: u64, minutes: f64, select_links: &[u32]) -> RunOut {
    let cfg = Config { seed, period: period.into(), select_links: select_links.to_vec(), interventions: ivs.to_vec(), initial_load: false, ..Default::default() };
    let mut sim = Simulation::from_parts(study.net.clone(), study.demand.clone(), cfg).expect("simulation");
    let nl = study.net.links.len();
    let total = minutes * 60.0;
    let warm = (0.25 * total).min(600.0);
    let mut exits0: Vec<u32> = vec![0; nl];
    let mut warmed = warm == 0.0;
    let mut speed_sum = vec![0.0f32; nl];
    let mut n_samples = 0u32;
    let mut next_sample = warm + 300.0;
    let mut t = 0.0;
    let sample = |sim: &Simulation, sum: &mut Vec<f32>| {
        let st = sim.link_stats();
        for l in 0..nl {
            sum[l] += st[l * 4 + 1];
        }
    };
    while t < total - 1e-9 {
        let dt = 5.0f64.min(total - t);
        sim.step(dt);
        t += dt;
        if !warmed && t >= warm - 1e-9 {
            exits0 = sim.diagnostics().link_exits.to_vec();
            warmed = true;
        }
        if warmed && t >= next_sample - 1e-9 {
            sample(&sim, &mut speed_sum);
            n_samples += 1;
            next_sample += 300.0;
        }
    }
    if n_samples == 0 {
        sample(&sim, &mut speed_sum);
        n_samples = 1;
    }
    let hours = ((total - warm).max(1.0)) / 3600.0;
    let exits = sim.diagnostics().link_exits.to_vec();
    let m = sim.metrics();
    let (inside_n, inside_tt_s) = sim.inside_trip_stats();
    RunOut {
        ct_km: m.cut_through.veh_km,
        veh_km: m.veh_km,
        inside_n,
        inside_tt_s,
        unroutable: m.unroutable_trips,
        gridlock_removed: m.gridlock_removed,
        backlog: m.backlog,
        spawned: m.spawned,
        completed: m.completed_trips,
        invalid: m.invalid_interventions,
        ped_conflicts: m.vulnerable.ped_conflicts,
        bike_conflicts: m.vulnerable.bike_conflicts,
        flow: (0..nl).map(|l| ((exits[l] - exits0[l]) as f64 / hours) as f32).collect(),
        speed: speed_sum.iter().map(|s| s / n_samples as f32).collect(),
        records: if select_links.is_empty() { Vec::new() } else { sim.select_link_records() },
    }
}

/// Map `f` over `items` on `jobs` threads. Results come back in item order, so output does not depend on `jobs`.
pub fn parallel_map<T: Sync, R: Send>(jobs: usize, items: &[T], f: impl Fn(&T) -> R + Sync) -> Vec<R> {
    let n = items.len();
    let next = AtomicUsize::new(0);
    let slots: Vec<Mutex<Option<R>>> = (0..n).map(|_| Mutex::new(None)).collect();
    std::thread::scope(|s| {
        for _ in 0..jobs.clamp(1, n.max(1)) {
            s.spawn(|| loop {
                let i = next.fetch_add(1, Ordering::SeqCst);
                if i >= n {
                    break;
                }
                let r = f(&items[i]);
                *slots[i].lock().unwrap() = Some(r);
            });
        }
    });
    slots.into_iter().map(|m| m.into_inner().unwrap().expect("job result")).collect()
}

pub fn mean(v: &[f64]) -> f64 {
    if v.is_empty() {
        0.0
    } else {
        v.iter().sum::<f64>() / v.len() as f64
    }
}

/// Sample standard deviation (0 for fewer than two values).
pub fn std_dev(v: &[f64]) -> f64 {
    if v.len() < 2 {
        return 0.0;
    }
    let m = mean(v);
    (v.iter().map(|x| (x - m).powi(2)).sum::<f64>() / (v.len() - 1) as f64).sqrt()
}
