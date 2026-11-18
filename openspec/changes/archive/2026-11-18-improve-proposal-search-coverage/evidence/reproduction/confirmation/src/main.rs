use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::path::{Path, PathBuf};
use std::time::Instant;
use traffic_sim::explore::{self, cands, paired::Paired, search, util, Params, RunOut, Study};
use traffic_sim::model::Intervention;

const PERIOD: &str = "pm_peak";
const MINUTES: f64 = 60.0;
const SEEDS: std::ops::RangeInclusive<u64> = 201..=210;

#[derive(Deserialize)]
struct Manifest {
    candidates: Vec<Candidate>,
}
#[derive(Deserialize)]
struct Candidate {
    id: String,
    label: String,
    iv: Intervention,
}
#[derive(Clone, Deserialize, Serialize)]
struct Selection {
    id: String,
    set: Vec<u16>,
}
#[derive(Deserialize)]
struct Selections {
    sets: Vec<SelectionEntry>,
}
#[derive(Deserialize)]
#[serde(untagged)]
enum SelectionEntry {
    Named(Selection),
    Indices(Vec<u16>),
}
#[derive(Serialize, Deserialize)]
struct StoredRun {
    ct_vph: f64,
    veh_km: f64,
    inside_n: u64,
    inside_tt_s: f64,
    unroutable: u64,
    gridlock_removed: u64,
    backlog: u64,
    spawned: u64,
    completed: u64,
    invalid: u64,
    ped_conflicts: u64,
    bike_conflicts: u64,
    flow: Vec<f32>,
    through: Vec<f32>,
    speed: Vec<f32>,
}
impl From<RunOut> for StoredRun {
    fn from(r: RunOut) -> Self {
        Self { ct_vph: r.ct_vph, veh_km: r.veh_km, inside_n: r.inside_n, inside_tt_s: r.inside_tt_s,
            unroutable: r.unroutable, gridlock_removed: r.gridlock_removed, backlog: r.backlog,
            spawned: r.spawned, completed: r.completed, invalid: r.invalid, ped_conflicts: r.ped_conflicts,
            bike_conflicts: r.bike_conflicts, flow: r.flow, through: r.through, speed: r.speed }
    }
}
impl From<StoredRun> for RunOut {
    fn from(r: StoredRun) -> Self {
        Self { ct_vph: r.ct_vph, veh_km: r.veh_km, inside_n: r.inside_n, inside_tt_s: r.inside_tt_s,
            unroutable: r.unroutable, gridlock_removed: r.gridlock_removed, backlog: r.backlog,
            spawned: r.spawned, completed: r.completed, invalid: r.invalid, ped_conflicts: r.ped_conflicts,
            bike_conflicts: r.bike_conflicts, flow: r.flow, through: r.through, speed: r.speed, records: Vec::new() }
    }
}
#[derive(Serialize, Deserialize)]
struct Checkpoint {
    identity: Value,
    elapsed_seconds: f64,
    run: StoredRun,
}

fn write_json(path: &Path, value: &impl Serialize) {
    let tmp = path.with_extension("tmp");
    std::fs::write(&tmp, serde_json::to_vec_pretty(value).unwrap()).expect("write checkpoint");
    std::fs::rename(tmp, path).expect("commit checkpoint");
}
fn arg(k: &str) -> String {
    let args: Vec<String> = std::env::args().collect();
    args.windows(2).find(|w| w[0] == k).map(|w| w[1].clone()).unwrap_or_else(|| panic!("missing {k}"))
}
fn effect(values: &[f64]) -> Value {
    let p = Paired::of(values);
    json!({"n": p.n, "mean": p.mean, "sample_sd": p.sd, "half_width": p.half,
        "interval": p.interval(), "status": p.status().as_str(), "differences": values})
}
fn metric(r: &RunOut) -> Value {
    json!({"through_cars_per_hour": r.ct_vph, "vehicle_km": r.veh_km,
        "completed_inside_trips": r.inside_n, "inside_trip_total_seconds": r.inside_tt_s,
        "inside_trip_mean_seconds": r.inside_mean_s(), "unroutable": r.unroutable,
        "gridlock_removed": r.gridlock_removed, "backlog": r.backlog, "spawned": r.spawned,
        "completed": r.completed, "invalid": r.invalid, "ped_conflicts": r.ped_conflicts,
        "bike_conflicts": r.bike_conflicts})
}
fn delta(a: &[&RunOut], b: &[&RunOut], f: impl Fn(&RunOut) -> f64) -> Value {
    effect(&a.iter().zip(b).map(|(x, y)| f(y) - f(x)).collect::<Vec<_>>())
}

fn main() {
    let root = PathBuf::from(arg("--root"));
    let manifest_path = PathBuf::from(arg("--manifest"));
    let sets_path = PathBuf::from(arg("--sets"));
    let out = PathBuf::from(arg("--out"));
    let jobs: usize = arg("--jobs").parse().expect("jobs must be positive integer");
    assert!(jobs > 0);
    let manifest_bytes = std::fs::read(&manifest_path).expect("candidate manifest");
    let sets_bytes = std::fs::read(&sets_path).expect("selection manifest");
    let manifest: Manifest = serde_json::from_slice(&manifest_bytes).expect("candidate manifest schema");
    let selected: Selections = serde_json::from_slice(&sets_bytes).expect("selection schema");
    assert!(!selected.sets.is_empty(), "no packages selected");
    let study = Study::load(&root, "rockridge").expect("load frozen data");
    let mut candidates = Vec::new();
    for (i, c) in manifest.candidates.iter().enumerate() {
        assert_eq!(cands::adopt(&study, &mut candidates, &c.iv) as usize, i, "duplicate candidates");
    }
    let mut selections = vec![Selection { id: "baseline".into(), set: Vec::new() }];
    for (si, entry) in selected.sets.into_iter().enumerate() {
        let mut s = match entry {
            SelectionEntry::Named(s) => s,
            SelectionEntry::Indices(set) => Selection { id: format!("package-{}", si + 1), set },
        };
        assert!(!s.id.is_empty() && s.id != "baseline" && !s.set.is_empty());
        s.set.sort_unstable();
        assert!(s.set.windows(2).all(|w| w[0] != w[1]), "duplicate candidate in package");
        assert!(s.set.iter().all(|&i| (i as usize) < candidates.len()), "candidate index outside manifest");
        assert!(!selections.iter().any(|p| p.id == s.id || p.set == s.set), "duplicate selection");
        for (i, &a) in s.set.iter().enumerate() {
            for &b in &s.set[i + 1..] {
                assert!(!cands::conflicts(&candidates[a as usize], &candidates[b as usize]), "conflicting package {}", s.id);
            }
        }
        let ivs: Vec<Intervention> = s.set.iter().map(|&i| candidates[i as usize].iv.clone()).collect();
        explore::check_access(&study, &ivs).unwrap_or_else(|e| panic!("{}: {e}", s.id));
        selections.push(s);
    }
    let revision = std::process::Command::new("git").args(["-C", "/workspace/traffic", "rev-parse", "HEAD"]).output().expect("git revision");
    assert!(revision.status.success());
    let source_revision = String::from_utf8(revision.stdout).unwrap().trim().to_string();
    let base_identity = json!({"schema": 1, "source_revision": source_revision,
        "simulator": traffic_sim::FINGERPRINT, "report_method": explore::paired::REPORT_METHOD,
        "network_sha256": util::sha256_hex(&std::fs::read(root.join("public/data/rockridge.network.json")).unwrap()),
        "demand_sha256": util::sha256_hex(&std::fs::read(root.join("public/data/rockridge.demand.json")).unwrap()),
        "candidate_manifest_sha256": util::sha256_hex(&manifest_bytes),
        "runner_sha256": util::sha256_hex(include_bytes!("main.rs")),
        "period": PERIOD, "minutes": MINUTES, "initial_load": true});
    let metadata = json!({"identity": base_identity, "seeds": SEEDS.collect::<Vec<_>>(), "selection_manifest_sha256": util::sha256_hex(&sets_bytes),
        "selection_manifest": serde_json::from_slice::<Value>(&sets_bytes).unwrap(), "calibration": study.calibration,
        "scope": "Frozen selected packages only, PM peak. Independent seed variability under one fixed model; not an exhaustive full-hour or multi-period optimum.",
        "interval_scope": "95% paired Student t intervals. Do not cover calibration, demand, model-form or real-day uncertainty. Block intervals are pointwise; selected worst-block intervals are not selection-adjusted.",
        "score_scope": "Production score and baseline noise band recomputed over confirmation seeds. No confidence interval is assigned to the nonlinear score or maximum block increase."});
    if let Some(parent) = out.parent() { std::fs::create_dir_all(parent).unwrap(); }
    let checkpoint_dir = out.with_extension("runs");
    std::fs::create_dir_all(&checkpoint_dir).unwrap();
    write_json(&out.with_extension("protocol.json"), &metadata);
    if std::env::args().any(|a| a == "--validate-only") {
        println!("Validated {} selected packages, {} nodes, {} links; {}.", selections.len() - 1, study.net.nodes.len(), study.net.links.len(), source_revision);
        return;
    }
    let tasks: Vec<(usize, u64)> = (0..selections.len()).flat_map(|p| SEEDS.map(move |s| (p, s))).collect();
    let runs: Vec<RunOut> = explore::parallel_map(jobs, &tasks, |&(pi, seed)| {
        let s = &selections[pi];
        let mut identity = base_identity.clone();
        identity["set"] = json!(s.set);
        identity["seed"] = json!(seed);
        let key = util::sha256_hex(&serde_json::to_vec(&identity).unwrap());
        let path = checkpoint_dir.join(format!("{key}.json"));
        if path.exists() {
            let saved: Checkpoint = serde_json::from_slice(&std::fs::read(&path).unwrap()).expect("checkpoint schema");
            assert_eq!(saved.identity, identity, "checkpoint identity mismatch");
            eprintln!("cached {} seed {}", s.id, seed);
            return saved.run.into();
        }
        let ivs: Vec<Intervention> = s.set.iter().map(|&i| candidates[i as usize].iv.clone()).collect();
        let timer = Instant::now();
        let run = explore::run(&study, &ivs, PERIOD, seed, MINUTES, &[]);
        let cp = Checkpoint { identity, elapsed_seconds: timer.elapsed().as_secs_f64(), run: run.into() };
        write_json(&path, &cp);
        eprintln!("done {} seed {}: through {:.1}, gridlock {}, backlog {}, {:.1}s", s.id, seed, cp.run.ct_vph, cp.run.gridlock_removed, cp.run.backlog, cp.elapsed_seconds);
        cp.run.into()
    });
    let ns = SEEDS.count();
    let series: Vec<Vec<&RunOut>> = (0..selections.len()).map(|p| runs[p * ns..(p + 1) * ns].iter().collect()).collect();
    let stats: Vec<_> = series.iter().map(|rs| search::period_stat(&study, rs)).collect();
    let mut p = Params::new("rockridge");
    p.harm_weight = 0.1;
    let block_description = |b: usize| {
        let index = study.harm_blocks[b];
        let block = &study.idx.blocks[index];
        json!({"harm_block": b, "block_index": index, "key": block.key, "label": block.label, "links": block.links})
    };
    let mut summaries = Vec::new();
    for (pi, s) in selections.iter().enumerate() {
        let stat = &stats[pi];
        let inc: Vec<f64> = stat.block_flow.iter().zip(&stats[0].block_flow).map(|(s, b)| s - b).collect();
        let harm = search::harm_calc(&inc, &stats[0].block_sigma);
        let mut reject = search::run_reject(stat.unroutable, stat.gridlock, stat.backlog, &stats[0].lite());
        if series[pi].iter().any(|r| r.invalid > 0) { reject = Some("invalid intervention".into()); }
        let blocks: Vec<Value> = (0..inc.len()).map(|b| {
            let ds: Vec<f64> = (0..ns).map(|k| stat.runs[k].block_flow[b] - stats[0].runs[k].block_flow[b]).collect();
            json!({"block": block_description(b), "baseline_all_cars_per_hour": stats[0].block_flow[b],
                "scenario_all_cars_per_hour": stat.block_flow[b], "change": effect(&ds),
                "baseline_through_cars_per_hour": stats[0].block_through[b], "scenario_through_cars_per_hour": stat.block_through[b]})
        }).collect();
        let reductions = search::reduction_pct(stats[0].ct_vph, stat.ct_vph);
        summaries.push(json!({"id": s.id, "set": s.set,
            "candidates": s.set.iter().map(|&i| json!({"index":i,"id":manifest.candidates[i as usize].id,"label":manifest.candidates[i as usize].label})).collect::<Vec<_>>(),
            "link": study.encode(&s.set.iter().map(|&i| candidates[i as usize].iv.clone()).collect::<Vec<_>>(), Some(PERIOD)),
            "reject": reject, "baseline_through_cars_per_hour": stats[0].ct_vph, "scenario_through_cars_per_hour": stat.ct_vph,
            "reduction_pct": reductions, "harm": harm.worst_adj, "score": search::score(&p, reductions, harm.worst_adj),
            "penalty_block": harm.adj_block.map(block_description), "raw_maximum_all_car_increase": harm.raw_increase,
            "raw_maximum_block": block_description(harm.raw_worst), "blocks_above_noise_band": harm.n_above,
            "through_change": delta(&series[0], &series[pi], |r| r.ct_vph),
            "inside_trip_time_change_seconds": delta(&series[0], &series[pi], |r| r.inside_mean_s()),
            "per_seed": SEEDS.enumerate().map(|(k,seed)| json!({"seed":seed,"metrics":metric(series[pi][k]),"block_flow":stat.runs[k].block_flow,"block_through":stat.runs[k].block_through})).collect::<Vec<_>>(),
            "blocks": blocks}));
    }
    let mut option_pairs = Vec::new();
    for a in 1..selections.len() {
        for b in a + 1..selections.len() {
            let blocks: Vec<Value> = (0..study.harm_blocks.len()).map(|h| {
                let ds: Vec<f64> = (0..ns).map(|k| stats[b].runs[k].block_flow[h] - stats[a].runs[k].block_flow[h]).collect();
                json!({"block": block_description(h), "all_car_change": effect(&ds)})
            }).collect();
            option_pairs.push(json!({"a":selections[a].id,"b":selections[b].id,"sign":"b minus a",
                "through_cars_per_hour":delta(&series[a],&series[b],|r|r.ct_vph),
                "inside_trip_time_seconds":delta(&series[a],&series[b],|r|r.inside_mean_s()),"blocks":blocks}));
        }
    }
    write_json(&out, &json!({"metadata":metadata,"packages":summaries,"option_pairs":option_pairs}));
    eprintln!("wrote {}", out.display());
}
