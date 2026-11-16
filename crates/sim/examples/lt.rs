use traffic_sim::validate::*;
fn main() {
    for c in run_all().iter().filter(|c| !c.pass() || ["b13","p1","p2","p3","l1","b4"].contains(&c.id.as_str())) { println!("{} {:.2} [{:.2},{:.2}] {} | {}", c.id, c.sim, c.lo, c.hi, if c.pass() {"pass"} else {"FAIL"}, if c.id.starts_with('p') || c.id=="l1" {c.note.as_str()} else {""}); }
}
