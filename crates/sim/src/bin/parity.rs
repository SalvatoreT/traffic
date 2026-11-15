//! Prints the result of a short run as JSON, for comparing the native and WASM builds bit for bit (`scripts/check-wasm-parity.mjs`).
//!
//! cargo run --release -p traffic-sim --bin parity -- NETWORK DEMAND PERIOD SECONDS [SEED]

use traffic_sim::Simulation;

fn main() {
    let a: Vec<String> = std::env::args().skip(1).collect();
    if a.len() < 4 {
        eprintln!("usage: parity NETWORK DEMAND PERIOD SECONDS [SEED]");
        std::process::exit(2);
    }
    let net = std::fs::read_to_string(&a[0]).expect("network");
    let dem = std::fs::read_to_string(&a[1]).expect("demand");
    let secs: f64 = a[3].parse().expect("seconds");
    let seed: u64 = a.get(4).map_or(1, |s| s.parse().expect("seed"));
    let cfg = format!("{{\"seed\":{seed},\"period\":\"{}\"}}", a[2]);
    let mut sim = Simulation::new(&net, &dem, &cfg).expect("simulation");
    while sim.time() < secs - 1e-9 {
        sim.step(5.0f64.min(secs - sim.time()));
    }
    let bits = |v: Vec<f32>| v.iter().map(|x| format!("{:08x}", x.to_bits())).collect::<Vec<_>>().join("");
    let out = serde_json::json!({
        "metrics": sim.metrics_json(),
        "vehicles": bits(sim.vehicles()),
        "linkStats": bits(sim.run_link_stats()),
        "intentLinks": bits(sim.intent_links()),
    });
    println!("{out}");
}
