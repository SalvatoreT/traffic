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
    // The redistribution diagnostic: a traced run of the same configuration and the effective-graph query (PARITY_IVS, default a
    // whole-node filter at node 0).
    let ivs = std::env::var("PARITY_IVS").unwrap_or_else(|_| r#"[{"type":"modal_filter","node":0}]"#.into());
    let tcfg = format!("{{\"seed\":{seed},\"period\":\"{}\",\"trace\":true}}", a[2]);
    let mut traced = Simulation::new(&net, &dem, &tcfg).expect("simulation");
    while traced.time() < secs - 1e-9 {
        traced.step(5.0f64.min(secs - traced.time()));
    }
    let digest = |s: String| format!("{:016x}", s.bytes().fold(0xcbf2_9ce4_8422_2325u64, |h, b| (h ^ b as u64).wrapping_mul(0x0100_0000_01b3)));
    let req: String = traced.trace_requests().iter().map(|x| format!("{:016x}", x.to_bits())).collect();
    let ev: String = traced.trace_events().iter().map(|x| format!("{x:08x}")).collect();
    let net_v: traffic_sim::Network = serde_json::from_str(&net).expect("network");
    let graph = traffic_sim::redistribution::analyze(&net_v, &a[2], "car", &[], &traffic_sim::explore::street::expand(&net_v, &serde_json::from_str::<Vec<traffic_sim::model::Intervention>>(&ivs).expect("PARITY_IVS")));
    let out = serde_json::json!({
        "metrics": sim.metrics_json(),
        "vehicles": bits(sim.vehicles()),
        "linkStats": bits(sim.run_link_stats()),
        "intentLinks": bits(sim.intent_links()),
        "tracedMetrics": traced.metrics_json() == sim.metrics_json(),
        "traceRequests": digest(req),
        "traceEvents": digest(ev),
        "traceSummary": traced.trace_summary(),
        "graph": graph.to_string(),
    });
    println!("{out}");
}
