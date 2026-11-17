//! `explore --annotate`: add the per-link through-car and all-car arrays the proposal card draws to an existing proposals file, by re-simulating only
//! the published packages for one period with the search's seeds and run length. No search is repeated.

use super::decode::decode_scenario;
use super::provenance::{check, Evidence};
use super::report::{measured_links, picture_period, Picture};
use super::*;
use serde_json::Value;
use std::collections::HashMap;

/// What `annotate` did, for the line on stderr.
#[derive(Debug, PartialEq)]
pub struct Summary {
    pub groups: usize,
    pub packages: usize,
    pub runs: usize,
}

struct Task {
    ivs: Vec<Intervention>,
    period: String,
    seed: u64,
    minutes: f64,
}

/// Rewrite `file` so each package of each group carries a `picture` and a `pictureAll`. Every group must have been computed on the study's network and
/// demand, by this simulator and under this reporting method, and must record its run settings; otherwise nothing is changed and the
/// error names the group. A group without that provenance needs a full recomputation: its figures are never given pictures from
/// another engine. The numeric figures and their provenance are left as they are.
pub fn annotate(study: &Study, file: &mut Value, jobs: usize) -> Result<Summary, String> {
    let groups = file["groups"].as_array().ok_or("the file has no groups")?.clone();
    let mut tasks: Vec<Task> = Vec::new();
    let mut base_at: HashMap<(String, u64, u64), usize> = HashMap::new();
    // Per group, per package: the task index of each seed's scenario run; per group: the baseline task index of each seed.
    let mut plan: Vec<(String, Vec<usize>, Vec<Vec<usize>>)> = Vec::new();
    for g in &groups {
        let id = g["id"].as_str().unwrap_or_default();
        let c = &g["computed"];
        match check(c, &study.net_hash, &study.demand_hash, crate::FINGERPRINT) {
            Evidence::Current => {}
            Evidence::Unverified(missing) => return Err(format!("group {id} does not record {}, so its figures cannot be matched to this simulator; run the search again", missing.join(", "))),
            Evidence::Stale(why) => return Err(format!("group {id} was computed with other inputs or another method: {}; run the search again", why.join("; "))),
        }
        let periods: Vec<String> = c["periods"].as_array().ok_or_else(|| format!("group {id} has no periods"))?.iter().filter_map(|v| v.as_str().map(String::from)).collect();
        let seeds: Vec<u64> = c["seeds"].as_array().ok_or_else(|| format!("group {id} has no seeds"))?.iter().filter_map(|v| v.as_u64()).collect();
        if periods.is_empty() || seeds.is_empty() {
            return Err(format!("group {id} has no periods or seeds"));
        }
        let period = periods[picture_period(&periods)].clone();
        let minutes = c["minutes"].as_f64().ok_or_else(|| format!("group {id} has no run length"))?;
        let mut base_ids = Vec::new();
        for &s in &seeds {
            let key = (period.clone(), s, minutes.to_bits());
            let t = *base_at.entry(key).or_insert_with(|| {
                tasks.push(Task { ivs: Vec::new(), period: period.clone(), seed: s, minutes });
                tasks.len() - 1
            });
            base_ids.push(t);
        }
        let mut per_pkg = Vec::new();
        for pr in g["proposals"].as_array().into_iter().flatten() {
            let link = pr["link"].as_str().ok_or_else(|| format!("a package of group {id} has no link"))?;
            let ivs = decode_scenario(&study.net, &study.topo, study.origin, link).map_err(|e| format!("package {} of group {id}: {e}", pr["id"]))?;
            let mut ids = Vec::new();
            for &s in &seeds {
                tasks.push(Task { ivs: ivs.clone(), period: period.clone(), seed: s, minutes });
                ids.push(tasks.len() - 1);
            }
            per_pkg.push(ids);
        }
        plan.push((period, base_ids, per_pkg));
    }
    eprintln!("annotating {} group(s): {} simulation run(s) on {} job(s)", groups.len(), tasks.len(), jobs);
    let outs = parallel_map(jobs, &tasks, |t| run(study, &t.ivs, &t.period, t.seed, t.minutes, &[]));
    let nl = study.net.links.len();
    let mean_through = |ids: &[usize]| -> Vec<f64> { (0..nl).map(|l| ids.iter().map(|&i| outs[i].through[l] as f64).sum::<f64>() / ids.len().max(1) as f64).collect() };
    let mean_flow = |ids: &[usize]| -> Vec<f64> { (0..nl).map(|l| ids.iter().map(|&i| outs[i].flow[l] as f64).sum::<f64>() / ids.len().max(1) as f64).collect() };
    let measured = measured_links(study);
    let mut packages = 0;
    for (gi, (period, base_ids, per_pkg)) in plan.iter().enumerate() {
        let (base, base_all) = (mean_through(base_ids), mean_flow(base_ids));
        let props = file["groups"][gi]["proposals"].as_array_mut().expect("proposals");
        for (pr, ids) in props.iter_mut().zip(per_pkg) {
            pr["picture"] = Picture::new(period, &base, &mean_through(ids)).to_json();
            pr["pictureAll"] = Picture::scoped(period, &base_all, &mean_flow(ids), &measured).to_json();
            packages += 1;
        }
    }
    Ok(Summary { groups: groups.len(), packages, runs: tasks.len() })
}
