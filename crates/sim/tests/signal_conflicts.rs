//! Invariant on the real network: approaches whose through movements cross never show green in the same step.
//! Skipped when the generated data files are missing. `SIG_VERBOSE=1` prints the per-junction report.

use std::collections::HashMap;
use std::path::PathBuf;
use traffic_sim::Simulation;

fn data(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../public/data").join(name)
}

/// Axis angle (degrees, 0..90) between two headings.
fn axial(a: f64, b: f64) -> f64 {
    let mut d = (a - b).rem_euclid(std::f64::consts::PI);
    if d > std::f64::consts::FRAC_PI_2 {
        d = std::f64::consts::PI - d;
    }
    d.to_degrees()
}

/// Two approaches conflict when their through movements cross: more than this many degrees apart in axis.
const CROSS_DEG: f64 = 30.0;

struct Appr {
    link: usize,
    name: String,
    heading: f64,
}

fn run_period(net_json: &str, dem_json: &str, net: &serde_json::Value, period: &str, minutes: usize) -> (usize, Vec<(u32, String, usize)>) {
    let cfg = format!("{{\"seed\":1,\"period\":\"{period}\"}}");
    let mut sim = Simulation::new(net_json, dem_json, &cfg).expect("load");
    let mut by_node: HashMap<u32, Vec<Appr>> = HashMap::new();
    for (i, l) in net["links"].as_array().unwrap().iter().enumerate() {
        let to = l["to"].as_u64().unwrap() as u32;
        if net["nodes"][to as usize]["control"] != "signal" {
            continue;
        }
        let heading = sim.approach_heading(i as u32);
        by_node.entry(to).or_default().push(Appr { link: i, name: l["name"].as_str().unwrap_or("").to_string(), heading });
    }
    let nodes: Vec<u32> = {
        let mut v: Vec<u32> = by_node.keys().copied().collect();
        v.sort();
        v
    };
    let mut bad: HashMap<(u32, usize, usize), usize> = HashMap::new();
    for _ in 0..minutes * 60 {
        sim.step(1.0);
        let s = sim.signals();
        for n in &nodes {
            let a = &by_node[n];
            for i in 0..a.len() {
                for j in 0..i {
                    if s[a[i].link] == 1 && s[a[j].link] == 1 && axial(a[i].heading, a[j].heading) > CROSS_DEG {
                        *bad.entry((*n, a[i].link, a[j].link)).or_default() += 1;
                    }
                }
            }
        }
    }
    let mut per_node: HashMap<u32, usize> = HashMap::new();
    let mut worst: HashMap<u32, (usize, String)> = HashMap::new();
    for (&(n, i, j), &c) in &bad {
        *per_node.entry(n).or_default() += 1;
        let a = &by_node[&n];
        let (ai, aj) = (a.iter().find(|x| x.link == i).unwrap(), a.iter().find(|x| x.link == j).unwrap());
        let e = worst.entry(n).or_insert((0, String::new()));
        if c > e.0 {
            *e = (c, format!("{} x {}", ai.name, aj.name));
        }
    }
    let mut list: Vec<(u32, String, usize)> = worst.into_iter().map(|(n, (c, s))| (n, s, c)).collect();
    list.sort_by_key(|x| std::cmp::Reverse(x.2));
    (per_node.len(), list)
}

#[test]
fn crossing_approaches_are_never_green_together() {
    let (np, dp) = (data("rockridge.network.json"), data("rockridge.demand.json"));
    if !np.exists() || !dp.exists() {
        eprintln!("skip: data files missing");
        return;
    }
    let net_json = std::fs::read_to_string(np).unwrap();
    let dem_json = std::fs::read_to_string(dp).unwrap();
    let net: serde_json::Value = serde_json::from_str(&net_json).unwrap();
    let minutes: usize = std::env::var("SIG_MINUTES").ok().and_then(|s| s.parse().ok()).unwrap_or(20);
    let mut failures = Vec::new();
    for period in ["am_peak", "midday", "pm_peak"] {
        let (n, list) = run_period(&net_json, &dem_json, &net, period, minutes);
        if std::env::var("SIG_VERBOSE").is_ok() {
            println!("{period}: {n} signals with simultaneous crossing greens");
            for (node, s, c) in list.iter().take(15) {
                println!("  node {node}: {s} ({c} s)");
            }
        }
        if n > 0 {
            failures.push(format!("{period}: {n} signals, e.g. node {} {}", list[0].0, list[0].1));
        }
    }
    assert!(failures.is_empty(), "{failures:?}");
}
