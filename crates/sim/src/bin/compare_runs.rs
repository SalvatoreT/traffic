//! Before/after measurement of a behavior change: runs the baseline and the given scenarios on the same seeds and prints, per run, the
//! simulator fingerprint, the headline metrics and the cars that left each link in the measured window (all cars and through cars).
//!
//! cargo run --release -p traffic-sim --bin compare_runs -- NETWORK DEMAND PERIOD SECONDS SEEDS SCENARIO_JSON...
//! SEEDS is a list like 1,2,3 or a range 1-10; each SCENARIO_JSON is an interventions array (`[]` for the baseline).

use traffic_sim::Simulation;

fn main() {
    let a: Vec<String> = std::env::args().skip(1).collect();
    if a.len() < 6 {
        eprintln!("usage: compare_runs NETWORK DEMAND PERIOD SECONDS SEEDS SCENARIO_JSON...");
        std::process::exit(2);
    }
    let net = std::fs::read_to_string(&a[0]).expect("network");
    let dem = std::fs::read_to_string(&a[1]).expect("demand");
    let secs: f64 = a[3].parse().expect("seconds");
    let seeds: Vec<u64> = match a[4].split_once('-') {
        Some((x, y)) => (x.parse().expect("seed")..=y.parse().expect("seed")).collect(),
        None => a[4].split(',').map(|s| s.parse().expect("seed")).collect(),
    };
    let mut runs = Vec::new();
    for ivs in &a[5..] {
        for &seed in &seeds {
            let trace = std::env::var("TRACE").is_ok();
            let scale: f64 = std::env::var("DEMAND_SCALE").ok().and_then(|s| s.parse().ok()).unwrap_or(1.0);
            let cfg = format!("{{\"seed\":{seed},\"period\":\"{}\",\"interventions\":{ivs},\"trace\":{trace},\"demandScale\":{scale}}}", a[2]);
            let t0 = std::time::Instant::now();
            let mut sim = Simulation::new(&net, &dem, &cfg).expect("simulation");
            while sim.time() < secs - 1e-9 {
                sim.step(15.0f64.min(secs - sim.time()));
            }
            let wall = t0.elapsed().as_secs_f64();
            let m = sim.metrics();
            let st = sim.run_link_stats();
            let n = sim.n_links();
            let flows: Vec<f32> = (0..n).map(|l| st[l * 4]).collect();
            let ct: Vec<f32> = (0..n).map(|l| st[l * 4 + 2]).collect();
            runs.push(serde_json::json!({
                "scenario": serde_json::from_str::<serde_json::Value>(ivs).unwrap(),
                "seed": seed,
                "fingerprint": traffic_sim::FINGERPRINT,
                "metrics": serde_json::from_str::<serde_json::Value>(&sim.metrics_json()).unwrap(),
                "completed": m.completed_trips,
                "linkFlow": flows,
                "linkThrough": ct,
                "wallS": wall,
                "trace": trace.then(|| {
                    let t: serde_json::Value = serde_json::from_str(&sim.trace_summary()).unwrap();
                    let (r, e) = (sim.trace_requests().len(), sim.trace_events().len());
                    serde_json::json!({ "requests": t["requests"], "detail": t["detail"], "exportBytes": r * 8 + e * 4 })
                }),
            }));
        }
    }
    println!("{}", serde_json::Value::Array(runs));
}
