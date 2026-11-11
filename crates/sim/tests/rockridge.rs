//! Ignored-by-default smoke/perf test on the generated Rockridge study area.
//! Run: cargo test -p traffic-sim --release --test rockridge -- --ignored --nocapture

use std::path::PathBuf;
use traffic_sim::Simulation;

fn data(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../public/data").join(name)
}

#[test]
#[ignore]
fn rockridge_30_minutes() {
    let net_p = data("rockridge.network.json");
    if !net_p.exists() {
        eprintln!("skip: {} missing", net_p.display());
        return;
    }
    let net_json = std::fs::read_to_string(&net_p).unwrap();
    let dem_p = data("rockridge.demand.json");
    let period = std::env::var("PERIOD").unwrap_or_else(|_| "am_peak".into());
    let scale: f64 = std::env::var("SCALE").ok().and_then(|s| s.parse().ok()).unwrap_or(1.0);
    let dem_json = if dem_p.exists() {
        std::fs::read_to_string(&dem_p).unwrap()
    } else {
        // Synthesise gate-to-gate demand.
        let net: serde_json::Value = serde_json::from_str(&net_json).unwrap();
        let gates: Vec<u64> = net["nodes"]
            .as_array()
            .unwrap()
            .iter()
            .filter(|n| n["gate"].as_bool() == Some(true))
            .map(|n| n["id"].as_u64().unwrap())
            .collect();
        let mut flows = vec![];
        for (k, &o) in gates.iter().enumerate() {
            for m in 1..=4 {
                let d = gates[(k + m * 7) % gates.len()];
                if d != o {
                    flows.push(serde_json::json!({"origin": o, "destination": d, "vehPerHour": 30.0}));
                }
            }
        }
        serde_json::json!({"version":1,"area":"rockridge","periods":[{"id":period,"label":period,"flows":flows}],"provenance":[]}).to_string()
    };
    let cfg = format!("{{\"seed\":42,\"period\":\"{period}\",\"demandScale\":{scale}}}");
    let t0 = std::time::Instant::now();
    let mut sim = Simulation::new(&net_json, &dem_json, &cfg).expect("load");
    println!("load: {:.2}s, {} links", t0.elapsed().as_secs_f64(), sim.n_links());
    let t1 = std::time::Instant::now();
    let mut peak = 0usize;
    for i in 0..(30 * 60) {
        sim.step(1.0);
        peak = peak.max(sim.n_vehicles());
        if i % 60 == 0 {
            sim.check_invariants().unwrap();
        }
    }
    sim.check_invariants().unwrap();
    // Scenario smoke: apply interventions mid-run and keep going.
    let net: serde_json::Value = serde_json::from_str(&net_json).unwrap();
    let local = net["links"]
        .as_array()
        .unwrap()
        .iter()
        .filter(|l| l["class"] == "residential" && l["inStudyArea"] == true)
        .map(|l| l["id"].as_u64().unwrap())
        .collect::<Vec<_>>();
    let ivs = serde_json::json!([
        {"type": "modal_filter", "link": local[local.len() / 3]},
        {"type": "speed_hump", "link": local[local.len() / 2], "position": 20.0},
        {"type": "speed_limit", "link": local[local.len() / 4], "speed": 6.7}
    ]);
    sim.set_interventions(&ivs.to_string()).unwrap();
    for _ in 0..300 {
        sim.step(1.0);
    }
    sim.check_invariants().unwrap();
    sim.set_interventions("[]").unwrap();
    for _ in 0..60 {
        sim.step(1.0);
    }
    sim.check_invariants().unwrap();
    let wall = t1.elapsed().as_secs_f64();
    let m = sim.metrics();
    println!("wall {:.2}s for 1800 sim-s ({:.0}x), peak vehicles {}", wall, 1800.0 / wall, peak);
    println!("{}", serde_json::to_string_pretty(&m).unwrap());
    if std::env::var("STUCK").is_ok() {
        println!("GRIDLOCK {:?}", sim.debug_gridlock());
        for l in sim.debug_stuck(30.0) {
            println!("STUCK {l}");
        }
    }
    assert!(m.completed_trips > 0, "trips complete");
    assert!(m.spawned > 0);
    assert_eq!(sim.vehicles().len(), sim.n_vehicles() * 6);
    assert_eq!(sim.link_stats().len(), sim.n_links() * 4);
}
