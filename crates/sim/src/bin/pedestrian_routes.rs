//! Batch sidewalk routing for the demand builder. Input order is preserved in the JSON output.
use serde::Deserialize;
use std::{env, fs::File, io};
use traffic_sim::{sim::planned_pedestrian_crossings, Network};

#[derive(Deserialize)]
struct Request {
    station: Option<u32>,
    pairs: Vec<[u32; 2]>,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let path = env::args_os().nth(1).ok_or("expected a network JSON path")?;
    let net: Network = serde_json::from_reader(io::BufReader::new(File::open(path)?))?;
    let query: Request = serde_json::from_reader(io::stdin().lock())?;
    let crossings = planned_pedestrian_crossings(&net, query.station, &query.pairs)?;
    serde_json::to_writer(io::BufWriter::new(io::stdout().lock()), &crossings)?;
    Ok(())
}
