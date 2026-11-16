use traffic_sim::validate::*;
fn main() {
    let base = Appr { lanes: 1, p_left: 0.0, p_right: 0.0, pocket: true, opp: 0.0 };
    for seed in [1u64,2,3] {
        let (c4, g4) = approach_cap(Appr { p_left: 0.2, opp: 500.0, ..base }, seed, &[], |_, _| {});
        let (c3, _) = approach_cap(Appr { p_left: 0.1, opp: 500.0, ..base }, seed, &[], |_, _| {});
        let (c9, _) = approach_cap(Appr { lanes: 2, p_left: 0.1, opp: 500.0, ..base }, seed, &[], |_, _| {});
        let (l1, _) = approach_cap(Appr { lanes: 2, p_left: 0.2, opp: 500.0, ..base }, seed, &[], |_, _| {});
        println!("seed {seed}: b3 {c3:.0} b4 {c4:.0} (gc {g4:.2}) b9 {c9:.0} l1 {l1:.0}");
    }
}
