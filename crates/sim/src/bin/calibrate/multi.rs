//! Multi-seed mode of the calibrate binary: runs a fixed seed list as parallel child processes and reports every headline metric as
//! mean, standard deviation, min, max and a 95% interval of the mean, plus the stability verdict over the seeds.
//! Practice: at least ten runs, consecutive seeds, none chosen, the same list for every comparison [WebTAG-M3.1] C.9.1, C.3.14; [TfL-TMG4] 7.5.1.

use serde_json::{json, Value};
use std::collections::VecDeque;
use std::fmt::Write as _;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};

/// Parse "1-10", "1,2,5" or "1-4,9".
pub fn parse_seeds(s: &str) -> Option<Vec<u64>> {
    let mut out = Vec::new();
    for part in s.split(',') {
        if let Some((a, b)) = part.split_once('-') {
            let (a, b): (u64, u64) = (a.trim().parse().ok()?, b.trim().parse().ok()?);
            if b < a {
                return None;
            }
            out.extend(a..=b);
        } else {
            out.push(part.trim().parse().ok()?);
        }
    }
    if out.is_empty() { None } else { Some(out) }
}

/// Two-sided 97.5% quantile of Student's t for `df` degrees of freedom (table values; 1.96 beyond 120).
pub fn t975(df: usize) -> f64 {
    const T: [f64; 30] = [
        12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145, 2.131, 2.120, 2.110, 2.101, 2.093, 2.086, 2.080, 2.074,
        2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045, 2.042,
    ];
    match df {
        0 => f64::NAN,
        1..=30 => T[df - 1],
        31..=60 => 2.0,
        61..=120 => 1.98,
        _ => 1.96,
    }
}

#[derive(Clone, Debug)]
pub struct Stat {
    pub n: usize,
    pub mean: f64,
    pub sd: f64,
    pub min: f64,
    pub max: f64,
    pub lo: f64,
    pub hi: f64,
}

/// Mean, sample standard deviation, min, max and the 95% interval of the mean (t distribution).
pub fn stat(xs: &[f64]) -> Stat {
    let v: Vec<f64> = xs.iter().copied().filter(|x| x.is_finite()).collect();
    let n = v.len();
    if n == 0 {
        return Stat { n: 0, mean: f64::NAN, sd: f64::NAN, min: f64::NAN, max: f64::NAN, lo: f64::NAN, hi: f64::NAN };
    }
    let mean = v.iter().sum::<f64>() / n as f64;
    let sd = if n > 1 { (v.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / (n as f64 - 1.0)).sqrt() } else { 0.0 };
    let half = if n > 1 { t975(n - 1) * sd / (n as f64).sqrt() } else { 0.0 };
    Stat { n, mean, sd, min: v.iter().cloned().fold(f64::INFINITY, f64::min), max: v.iter().cloned().fold(f64::NEG_INFINITY, f64::max), lo: mean - half, hi: mean + half }
}

fn st_json(s: &Stat) -> Value {
    let r = |x: f64| if x.is_finite() { json!((x * 1000.0).round() / 1000.0) } else { Value::Null };
    json!({"n": s.n, "mean": r(s.mean), "sd": r(s.sd), "min": r(s.min), "max": r(s.max), "ci95Lo": r(s.lo), "ci95Hi": r(s.hi)})
}

/// Stability thresholds, read from `acceptance.stability` of the targets file (defaults are the values of design decision D16).
#[derive(Clone, Debug)]
pub struct Stability {
    /// Mean gridlock removals per hour must be below this.
    pub max_mean_removals_per_hour: f64,
    /// Entry backlog, share of spawned trips, under this in at least `min_seeds_share` of the seeds.
    pub backlog_pct: f64,
    pub min_seeds_share: f64,
    /// No seed may add more than this many points of spawned trips to the entry backlog in the second half of the run.
    pub max_second_half_growth_pct: f64,
    /// Arterial mean speed of the seed mean must exceed this (m/s).
    pub min_arterial_speed: f64,
}

impl Stability {
    pub fn from_targets(t: &Value) -> Self {
        let s = &t["acceptance"]["stability"];
        let g = |k: &str, d: f64| s[k].as_f64().unwrap_or(d);
        Stability {
            max_mean_removals_per_hour: g("maxMeanRemovalsPerHour", 1.0),
            backlog_pct: g("backlogPct", 2.0),
            min_seeds_share: g("minSeedsShare", 0.9),
            max_second_half_growth_pct: g("maxSecondHalfBacklogGrowthPct", 2.0),
            min_arterial_speed: g("minArterialSpeed", 4.0),
        }
    }
}

fn series_growth(run: &Value) -> f64 {
    // Backlog added between the sample nearest the half of the run and the last sample, in points of spawned trips.
    let minutes = run["minutes"].as_f64().unwrap_or(60.0);
    let spawned = run["health"]["spawned"].as_f64().unwrap_or(1.0).max(1.0);
    let s = run["series"].as_array().cloned().unwrap_or_default();
    if s.len() < 2 {
        return 0.0;
    }
    let at = |t: f64| s.iter().min_by(|a, b| (a["tMin"].as_f64().unwrap_or(0.0) - t).abs().partial_cmp(&(b["tMin"].as_f64().unwrap_or(0.0) - t).abs()).unwrap()).unwrap()["backlog"].as_f64().unwrap_or(0.0);
    let last = s.last().unwrap()["backlog"].as_f64().unwrap_or(0.0);
    100.0 * (last - at(minutes / 2.0)) / spawned
}

pub struct Multi<'a> {
    pub exe: PathBuf,
    /// The argument list of the parent without --seeds, --jobs, --keep-seeds, --seed, --out.
    pub base_args: Vec<String>,
    pub seeds: Vec<u64>,
    pub jobs: usize,
    pub out: PathBuf,
    pub keep: Option<PathBuf>,
    /// False for --no-write: print the summary and leave no report files (kept seeds stay).
    pub write: bool,
    pub stem_prefix: String,
    pub targets: &'a Value,
}

fn run_seeds(m: &Multi) -> Vec<(u64, Value)> {
    let dir: PathBuf = seeds_dir(m);
    std::fs::create_dir_all(&dir).expect("mkdir seeds dir");
    let queue = Arc::new(Mutex::new(m.seeds.iter().copied().collect::<VecDeque<u64>>()));
    let results = Arc::new(Mutex::new(Vec::<(u64, Value)>::new()));
    let mut hs = Vec::new();
    for _ in 0..m.jobs.max(1).min(m.seeds.len()) {
        let (q, r, exe, base, dir, prefix) = (queue.clone(), results.clone(), m.exe.clone(), m.base_args.clone(), dir.clone(), m.stem_prefix.clone());
        hs.push(std::thread::spawn(move || loop {
            let seed = match q.lock().unwrap().pop_front() {
                Some(s) => s,
                None => break,
            };
            let st = std::process::Command::new(&exe)
                .args(&base)
                .args(["--seed", &seed.to_string(), "--out"])
                .arg(&dir)
                .arg("--link-flows")
                .stdout(std::process::Stdio::null())
                .status();
            if !matches!(st, Ok(s) if s.success()) {
                eprintln!("seed {seed} failed");
                continue;
            }
            let p = dir.join(format!("{prefix}-seed{seed}.json"));
            match std::fs::read_to_string(&p).ok().and_then(|t| serde_json::from_str::<Value>(&t).ok()) {
                Some(v) => r.lock().unwrap().push((seed, v)),
                None => eprintln!("seed {seed}: cannot read {}", p.display()),
            }
        }));
    }
    for h in hs {
        h.join().ok();
    }
    let mut v = Arc::try_unwrap(results).unwrap().into_inner().unwrap();
    v.sort_by_key(|x| x.0);
    v
}

fn seeds_dir(m: &Multi) -> PathBuf {
    m.keep.clone().unwrap_or_else(|| scratch_dir(m.write, &m.out, std::process::id()))
}

/// Where per-seed reports go when they are not kept: beside the reports, or outside them for --no-write.
fn scratch_dir(write: bool, out: &Path, pid: u32) -> PathBuf {
    if write {
        out.join(".seeds-tmp")
    } else {
        std::env::temp_dir().join(format!("calibrate-seeds-{pid}"))
    }
}

fn num(v: &Value) -> f64 {
    v.as_f64().unwrap_or(f64::NAN)
}

struct Metric {
    group: &'static str,
    name: String,
    unit: &'static str,
    vals: Vec<f64>,
}

pub fn run(m: Multi) {
    let runs = run_seeds(&m);
    if runs.is_empty() {
        eprintln!("no seed finished");
        std::process::exit(1);
    }
    let stab = Stability::from_targets(m.targets);
    let first = &runs[0].1;
    let minutes = num(&first["minutes"]);
    let per_hour = 60.0 / minutes.max(1.0);
    let seeds: Vec<u64> = runs.iter().map(|r| r.0).collect();
    let col = |f: &dyn Fn(&Value) -> f64| -> Vec<f64> { runs.iter().map(|r| f(&r.1)).collect() };
    let mut metrics: Vec<Metric> = Vec::new();
    let mut push = |group: &'static str, name: String, unit: &'static str, vals: Vec<f64>| metrics.push(Metric { group, name, unit, vals });
    push("health", "gridlock removals".into(), "vehicles", col(&|r| num(&r["health"]["gridlockRemoved"])));
    push("health", "gridlock removals per hour".into(), "veh/h", col(&|r| num(&r["health"]["gridlockRemoved"]) * per_hour));
    push("health", "entry backlog".into(), "% of spawned", col(&|r| num(&r["health"]["backlogPct"])));
    push("health", "backlog growth in the second half of the run".into(), "points of spawned", col(&|r| series_growth(r)));
    push("health", "completed trips".into(), "trips", col(&|r| num(&r["health"]["completed"])));
    push("health", "arterial mean speed".into(), "m/s", col(&|r| num(&r["health"]["arterialMeanSpeed"])));
    push("health", "arterial mean speed, last 15 min".into(), "m/s", col(&|r| num(&r["health"]["arterialMeanSpeedLast15min"])));
    // Cut-through: local-street vehicle-miles of surface-gate to freeway-gate trips (reported pattern a), and the study-area miles in detours.
    if let Some(rows) = first["patternFreewayThrough"].as_array() {
        for (i, row) in rows.iter().enumerate() {
            let label = row["trips"].as_str().unwrap_or("freeway through").to_string();
            push("cut-through", format!("local vehicle-miles, {label}"), "veh-miles", col(&|r| num(&r["patternFreewayThrough"][i]["localMiles"])));
            push("cut-through", format!("share of local vehicle-miles, {label}"), "share", col(&|r| num(&r["patternFreewayThrough"][i]["shareOfLocalMiles"])));
        }
    }
    if let Some(rows) = first["patternBypass"].as_array() {
        for (i, row) in rows.iter().enumerate() {
            let label = format!("{} vs {} {}", row["bypass"].as_str().unwrap_or(""), row["arterial"].as_str().unwrap_or(""), row["dir"].as_str().unwrap_or(""));
            push("bypass", format!("corridor trips using the bypass, {label}"), "trips", col(&|r| num(&r["patternBypass"][i]["viaBypass"])));
            push("bypass", format!("corridor trips, {label}"), "trips", col(&|r| num(&r["patternBypass"][i]["corridorTrips"])));
        }
    }
    if let Some(rows) = first["shares"].as_array() {
        for (i, row) in rows.iter().enumerate() {
            let tag = if row["headline"].as_bool().unwrap_or(false) { "route share (headline)" } else { "route share" };
            push(if tag == "route share (headline)" { "headline share" } else { "share" }, format!("{} {} {}", row["block"].as_str().unwrap_or(""), row["side"].as_str().unwrap_or(""), row["via"].as_str().unwrap_or("")), "share", col(&|r| num(&r["shares"][i]["modelled"])));
        }
    }
    if let Some(rows) = first["rampShares"].as_array() {
        for (i, row) in rows.iter().enumerate() {
            push("ramp share", format!("{} via {}", row["direction"].as_str().unwrap_or(""), row["via"].as_str().unwrap_or("")), "share", col(&|r| num(&r["rampShares"][i]["modelledSide"])));
        }
    }
    if let Some(rows) = first["streetFlows"].as_array() {
        for (i, row) in rows.iter().enumerate() {
            push("corridor flow", format!("{} {} median link flow", row["street"].as_str().unwrap_or(""), row["dir"].as_str().unwrap_or("")), "veh/h", col(&|r| num(&r["streetFlows"][i]["medianVehPerHour"])));
        }
    }

    // Stability verdict over the seeds.
    let removals = stat(&metrics[1].vals);
    let backlog_ok = metrics[2].vals.iter().filter(|&&b| b < stab.backlog_pct).count();
    let n = runs.len();
    let growth_bad: Vec<u64> = seeds.iter().zip(&metrics[3].vals).filter(|(_, &g)| g > stab.max_second_half_growth_pct).map(|(s, _)| *s).collect();
    let speed = stat(&metrics[5].vals);
    let c1 = removals.mean < stab.max_mean_removals_per_hour;
    let c2 = (backlog_ok as f64) >= (stab.min_seeds_share * n as f64).ceil() - 1e-9;
    let c3 = growth_bad.is_empty();
    let c4 = speed.mean > stab.min_arterial_speed;
    let holds = c1 && c2 && c3 && c4;
    // Old rule (D4 as first written), per seed, for comparison.
    let old_pass: Vec<u64> = seeds
        .iter()
        .zip(runs.iter())
        .filter(|(_, r)| num(&r.1["health"]["gridlockRemoved"]) == 0.0 && num(&r.1["health"]["backlogPct"]) < 2.0 && num(&r.1["health"]["arterialMeanSpeed"]) > 4.0)
        .map(|(s, _)| *s)
        .collect();

    let (a, b) = (seeds[0], *seeds.last().unwrap());
    let stem = format!("{}-seeds{}-{}", m.stem_prefix, a, b);
    let mut md = String::new();
    let _ = writeln!(md, "# {} over {} seeds ({})\n", m.stem_prefix, n, seeds.iter().map(|s| s.to_string()).collect::<Vec<_>>().join(", "));
    let _ = writeln!(md, "Seeds are the fixed list above, none chosen; each run is {minutes:.0} minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.\n");
    let _ = writeln!(md, "## Stability rule (design decision D16)\n");
    let _ = writeln!(md, "| Check | Rule | Result | Pass |\n| --- | --- | --- | --- |");
    let _ = writeln!(md, "| Removals | mean per hour below {:.2} | {:.2} (min {:.2}, max {:.2}) | {} |", stab.max_mean_removals_per_hour, removals.mean, removals.min, removals.max, yn(c1));
    let _ = writeln!(md, "| Entry backlog | below {:.1}% in at least {:.0}% of seeds | {} of {} seeds | {} |", stab.backlog_pct, stab.min_seeds_share * 100.0, backlog_ok, n, yn(c2));
    let _ = writeln!(md, "| Runaway growth | no seed adds more than {:.1} points of backlog in the second half | {} | {} |", stab.max_second_half_growth_pct, if growth_bad.is_empty() { "none".to_string() } else { format!("seeds {}", growth_bad.iter().map(|s| s.to_string()).collect::<Vec<_>>().join(", ")) }, yn(c3));
    let _ = writeln!(md, "| Arterial speed | mean above {:.1} m/s | {:.2} m/s | {} |", stab.min_arterial_speed, speed.mean, yn(c4));
    let _ = writeln!(md, "\n**Verdict: {}.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): {} of {} seeds pass.\n", if holds { "stable" } else { "not stable" }, old_pass.len(), n);
    let _ = writeln!(md, "## Metrics over seeds\n");
    let _ = writeln!(md, "| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |\n| --- | --- | --- | --- | --- | --- | --- | --- |");
    for mt in &metrics {
        let s = stat(&mt.vals);
        let (dec, scale) = if mt.unit == "share" { (1usize, 100.0) } else { (2usize, 1.0) };
        let f = |x: f64| format!("{:.*}", dec, x);
        let unit = if mt.unit == "share" { "%" } else { mt.unit };
        let _ = writeln!(md, "| {} | {} | {} | {} | {} | {} | {} | {} to {} |", mt.group, mt.name, unit, f(s.mean * scale), f(s.sd * scale), f(s.min * scale), f(s.max * scale), f(s.lo * scale), f(s.hi * scale));
    }
    let _ = writeln!(md, "\nPer-seed detail: `{}-seed{}.md` (seed {} in full).", m.stem_prefix, a, a);
    let js = json!({
        "seeds": seeds, "minutes": minutes,
        "stability": {
            "rule": {"maxMeanRemovalsPerHour": stab.max_mean_removals_per_hour, "backlogPct": stab.backlog_pct, "minSeedsShare": stab.min_seeds_share, "maxSecondHalfBacklogGrowthPct": stab.max_second_half_growth_pct, "minArterialSpeed": stab.min_arterial_speed},
            "meanRemovalsPerHourOk": c1, "backlogSeedsOk": backlog_ok, "backlogOk": c2, "growthOk": c3, "growthSeeds": growth_bad, "speedOk": c4, "holds": holds, "oldRuleSeedsPassing": old_pass,
        },
        "metrics": metrics.iter().map(|mt| json!({"group": mt.group, "name": mt.name, "unit": mt.unit, "values": mt.vals.iter().map(|x| if x.is_finite() { json!((x * 1000.0).round() / 1000.0) } else { Value::Null }).collect::<Vec<_>>(), "stat": st_json(&stat(&mt.vals))})).collect::<Vec<_>>(),
    });
    let src_dir = seeds_dir(&m);
    if m.write {
        std::fs::create_dir_all(&m.out).ok();
        std::fs::write(m.out.join(format!("{stem}.md")), &md).expect("write summary md");
        std::fs::write(m.out.join(format!("{stem}.json")), serde_json::to_string_pretty(&js).unwrap()).expect("write summary json");
        // First seed in full, without the per-link arrays.
        let _ = copy_detail(&m, &src_dir, &m.stem_prefix, a, first);
    }
    if m.keep.is_none() {
        std::fs::remove_dir_all(&src_dir).ok();
    }
    print!("{md}");
}

fn yn(b: bool) -> &'static str {
    if b { "yes" } else { "NO" }
}

fn copy_detail(m: &Multi, src: &Path, prefix: &str, seed: u64, run: &Value) -> std::io::Result<()> {
    let mut v = run.clone();
    if let Some(o) = v.as_object_mut() {
        o.insert("linkFlowVehPerHour".into(), Value::Null);
        o.insert("linkMeanDelayS".into(), Value::Null);
    }
    std::fs::write(m.out.join(format!("{prefix}-seed{seed}.json")), serde_json::to_string_pretty(&v).unwrap())?;
    let p = src.join(format!("{prefix}-seed{seed}.md"));
    if p.exists() {
        std::fs::copy(p, m.out.join(format!("{prefix}-seed{seed}.md")))?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn no_write_keeps_seed_files_out_of_the_report_directory() {
        let out = Path::new("data/calibration/reports");
        assert!(scratch_dir(true, out, 7).starts_with(out));
        assert!(!scratch_dir(false, out, 7).starts_with(out));
    }

    #[test]
    fn seed_lists() {
        assert_eq!(parse_seeds("1-10").unwrap().len(), 10);
        assert_eq!(parse_seeds("1,2,5").unwrap(), vec![1, 2, 5]);
        assert_eq!(parse_seeds("1-3,9").unwrap(), vec![1, 2, 3, 9]);
        assert!(parse_seeds("5-1").is_none());
        assert!(parse_seeds("x").is_none());
    }

    #[test]
    fn statistics_of_ten_values() {
        let s = stat(&[1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0]);
        assert_eq!(s.n, 10);
        assert!((s.mean - 5.5).abs() < 1e-12);
        assert!((s.sd - 3.0277).abs() < 1e-3);
        assert_eq!((s.min, s.max), (1.0, 10.0));
        assert!((s.hi - s.mean - 2.262 * s.sd / 10f64.sqrt()).abs() < 1e-9);
        assert_eq!(stat(&[4.0]).sd, 0.0);
        assert!(stat(&[]).mean.is_nan());
    }

    #[test]
    fn growth_of_backlog_in_the_second_half() {
        let run = json!({"minutes": 60.0, "health": {"spawned": 1000.0}, "series": [
            {"tMin": 5.0, "backlog": 0.0}, {"tMin": 30.0, "backlog": 10.0}, {"tMin": 55.0, "backlog": 40.0}]});
        assert!((series_growth(&run) - 3.0).abs() < 1e-9);
    }
}
