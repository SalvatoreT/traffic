use serde_json::json;
use std::{env, fs, path::Path};
use traffic_sim::Simulation;

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    assert_eq!(
        args.len(),
        4,
        "usage: rockridge_hour DATA_DIR CONFIG SECONDS OUTPUT"
    );
    let data = Path::new(&args[0]);
    let network = fs::read_to_string(data.join("rockridge.network.json")).unwrap();
    let demand = fs::read_to_string(data.join("rockridge.demand.json")).unwrap();
    let config = fs::read_to_string(&args[1]).unwrap();
    let seconds: f64 = args[2].parse().unwrap();
    let mut sim = Simulation::new(&network, &demand, &config).unwrap();

    while sim.time() < seconds - 1e-9 {
        sim.step(5.0_f64.min(seconds - sim.time()));
    }

    let diagnostics = sim.diagnostics();
    let output = json!({
        "metrics": sim.metrics(),
        "runLinkStats": sim.run_link_stats(),
        "intentLinks": sim.intent_links(),
        "vehicles": sim.vehicles(),
        "cutThroughExits": sim.cut_through_exits(),
        "residentTime": sim.resident_time(),
        "nodeWait": diagnostics.node_wait_s,
        "stops": diagnostics.link_stopped_s,
        "delay": diagnostics.link_delay_s,
        "stopLine": diagnostics.stop_line_passages,
        "linkStart": diagnostics.link_start_passages,
        "exits": diagnostics.link_exits,
        "traceRequests": sim.trace_requests(),
        "traceEvents": sim.trace_events()
    });
    fs::write(&args[3], serde_json::to_vec(&output).unwrap()).unwrap();
}
