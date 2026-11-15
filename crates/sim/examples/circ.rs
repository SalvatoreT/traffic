use traffic_sim::model::{Control, FlowMode, RoadClass};
use traffic_sim::validate::*;
fn run(vc: f64, to_n: bool, seed: u64) -> f64 {
    let (net, x) = cross(Control::TrafficCircle, RoadClass::Residential, 1, RoadClass::Residential, 1, false);
    let dest = if to_n { x.n } else { x.e };
    let fl = [(x.w, dest, vc.max(1.0), FlowMode::Car), (x.s, x.e, 3000.0, FlowMode::Car)];
    let mut r = Run::new(net, demand_m(&fl), cfg(seed));
    r.advance(300.0 + 2400.0);
    r.rate(&[x.s_in], 300.0, 2700.0)
}
fn main() {
    for vc in [1000.0] { let v = run(vc, true, 1); let d: Vec<u64> = traffic_sim::sim::DBG.iter().map(|x| x.load(std::sync::atomic::Ordering::Relaxed)).collect(); println!("vc {vc} -> {v:.0}; steps lane-none {} node-occ {} free {}", d[0], d[1], d[2]); }
    for vc in [200.0, 600.0, 1000.0] {
        let exp = 1130.0 * (-1.0e-3f64 * vc).exp();
        let a: f64 = (1..=3).map(|s| run(vc, false, s)).sum::<f64>() / 3.0;
        let b: f64 = (1..=3).map(|s| run(vc, true, s)).sum::<f64>() / 3.0;
        println!("vc {vc}: expected {exp:.0} [{:.0}-{:.0}]; shared exit {a:.0}; circulating to north {b:.0}", 0.8 * exp, 1.2 * exp);
    }
}
