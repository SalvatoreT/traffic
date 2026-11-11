use traffic_sim::model::*;
use traffic_sim::sim::Simulation;
fn main() {
    let a: Vec<String> = std::env::args().collect();
    let scale: f64 = a[1].parse().unwrap();
    let mins: f64 = a[2].parse().unwrap();
    let minwait: f32 = a[3].parse().unwrap();
    let root = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
    let net_s = std::fs::read_to_string(root.join("public/data/rockridge.network.json")).unwrap();
    let dem_s = std::fs::read_to_string(root.join("public/data/rockridge.demand.json")).unwrap();
    let net: Network = serde_json::from_str(&net_s).unwrap();
    let mut sim = Simulation::new(&net_s, &dem_s, &format!("{{\"seed\":1,\"period\":\"pm_peak\",\"demandScale\":{scale}}}")).unwrap();
    sim.step(mins * 60.0);
    let st = sim.debug_stuck(minwait);
    println!("{} stuck heads", st.len());
    for s in st {
        // add street name
        let l: usize = s.split_whitespace().nth(1).unwrap().parse().unwrap();
        println!("{} | {}", s, net.links[l].name);
    }
}
