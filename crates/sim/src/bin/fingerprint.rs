//! Prints the simulator fingerprint of this build (`traffic_sim::FINGERPRINT`), so a batch can check that every machine runs the same simulator.

fn main() {
    println!("{}", traffic_sim::FINGERPRINT);
}
