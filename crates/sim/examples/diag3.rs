use std::path::PathBuf;
use traffic_sim::model::{Config, Demand, Network};
use traffic_sim::sim::Simulation;
fn main() {
    let argv: Vec<String> = std::env::args().skip(1).collect();
    let t0: f64 = argv[0].parse().unwrap();
    let t1: f64 = argv[1].parse().unwrap();
    let links: Vec<usize> = argv[2].split(',').map(|x| x.parse().unwrap()).collect();
    let dir = PathBuf::from(std::env::var("DIR").unwrap());
    let net: Network = serde_json::from_str(&std::fs::read_to_string(dir.join("rockridge.network.json")).unwrap()).unwrap();
    let dem: Demand = serde_json::from_str(&std::fs::read_to_string(dir.join("rockridge.demand.json")).unwrap()).unwrap();
    let cfg = Config { seed: 1, period: "pm_peak".into(), ..Default::default() };
    let mut sim = Simulation::from_parts(net, dem, cfg).unwrap();
    sim.step(t0);
    let mut last: Vec<u32> = vec![0; links.len()];
    let mut t = t0;
    while t < t1 {
        sim.step(2.0); t += 2.0;
        let d = sim.diagnostics();
        let load = sim.debug_link_load();
        let sg = sim.signals();
        let mut s = String::new();
        for (i, &l) in links.iter().enumerate() {
            let ex = d.link_exits[l] as u32;
            s += &format!(" {}:{}n/{}st/s{}/+{}", l, load[l].0, load[l].2, sg[l], ex - last[i]);
            last[i] = ex;
        }
        println!("t={:.0}{}", t, s);
    }
}
