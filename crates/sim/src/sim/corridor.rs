//! Optional car counts for observed directed corridors, recorded at the final stop line.

use super::Simulation;
use std::collections::{BTreeMap, HashMap, HashSet};

#[derive(Default)]
pub(super) struct Corridors {
    ends: HashMap<(u32, LinkDetector), Vec<usize>>,
    counters: Vec<Counter>,
    detectors: HashMap<(u32, LinkDetector), BTreeMap<(u32, u32), u32>>,
}

/// Location of a car count along a directed link.
#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq)]
pub enum LinkDetector {
    Start,
    Stop,
    /// A car left this block, including trips that parked at its curb.
    BlockUse,
}

impl Corridors {
    pub(super) fn reset(&mut self) {
        for c in &mut self.counters {
            c.seen.clear();
            c.trips.clear();
        }
        for trips in self.detectors.values_mut() {
            trips.clear();
        }
    }
}

/// The physical event a station observer counts.
#[derive(Clone, Debug, PartialEq)]
pub enum PathObservation {
    WholeStreet(Vec<u32>),
    Movement(u32, u32),
    /// Approach, interior connectors and departing link of a junction represented by several nodes.
    SplitJunction(Vec<u32>),
}

struct Counter {
    path: PathObservation,
    since: f64,
    seen: HashSet<u32>,
    trips: BTreeMap<(u32, u32), u32>,
}

impl Simulation {
    /// Record OD pairs for every passage of this detector after registration.
    pub fn observe_link_detector(&mut self, link: u32, detector: LinkDetector) {
        self.corridors.detectors.entry((link, detector)).or_default();
    }

    pub fn link_detector_trips(&self, link: u32, detector: LinkDetector) -> &BTreeMap<(u32, u32), u32> {
        &self.corridors.detectors[&(link, detector)]
    }

    pub(super) fn count_link_detector(&mut self, vid: u32, link: u32, detector: LinkDetector) {
        if let Some(trips) = self.corridors.detectors.get_mut(&(link, detector)) {
            let v = &self.vehs[vid as usize];
            *trips.entry((v.origin, v.dest)).or_default() += 1;
        }
    }

    /// Count a car once when it has driven every link of this corridor in order, from
    /// the first link's start to the last link's stop line. The final passage must
    /// fall at or after `since`, even when the car entered the corridor earlier.
    pub fn observe_corridor(&mut self, links: &[u32], since: f64) -> Result<usize, String> {
        self.observe_path(PathObservation::WholeStreet(links.to_vec()), since)
    }

    /// Register a station, counting each car once when it passes the station's final detector.
    pub fn observe_path(&mut self, path: PathObservation, since: f64) -> Result<usize, String> {
        let valid = |l: u32| (l as usize) < self.topo.n_links;
        let connects = |a: u32, b: u32| self.topo.link_to[a as usize] == self.topo.link_from[b as usize];
        let connected = |links: &[u32]| {
            !links.is_empty() && links.iter().all(|&l| valid(l)) && links.windows(2).all(|w| connects(w[0], w[1]))
        };
        let end = match &path {
            PathObservation::WholeStreet(links) if connected(links) => (*links.last().unwrap(), LinkDetector::Stop),
            PathObservation::Movement(a, b) if valid(*a) && valid(*b) && connects(*a, *b) => (*b, LinkDetector::Start),
            PathObservation::SplitJunction(links) if links.len() >= 2 && connected(links) => (*links.last().unwrap(), LinkDetector::Start),
            _ => return Err(format!("invalid directed observation path {path:?}")),
        };
        let counters = &mut self.corridors.counters;
        if let Some(i) = counters.iter().position(|c| c.path == path && c.since == since) {
            return Ok(i);
        }
        let i = counters.len();
        self.corridors.ends.entry(end).or_default().push(i);
        counters.push(Counter {
            path,
            since,
            seen: HashSet::new(),
            trips: BTreeMap::new(),
        });
        Ok(i)
    }

    /// Number of observed trips by origin and destination, including cars still traveling beyond the detector.
    pub fn corridor_trips(&self, i: usize) -> &BTreeMap<(u32, u32), u32> {
        &self.corridors.counters[i].trips
    }

    pub(super) fn count_paths(&mut self, vid: u32, link: u32, end: LinkDetector) {
        let Some(ids) = self.corridors.ends.get(&(link, end)) else { return };
        let v = &self.vehs[vid as usize];
        for &i in ids {
            let c = &mut self.corridors.counters[i];
            if self.t < c.since {
                continue;
            }
            let matched = match &c.path {
                PathObservation::WholeStreet(links) => {
                    // Insertion partway along the first block does not constitute driving the whole street.
                    v.trail.ends_with(links)
                        && (v.trail.len() > links.len() || (!v.preplaced && v.entry_pos <= self.topo.emerge_pos[links[0] as usize]))
                }
                PathObservation::Movement(a, b) => v.trail.ends_with(&[*a, *b]),
                PathObservation::SplitJunction(links) => v.trail.ends_with(links),
            };
            if !matched {
                continue;
            }
            if c.seen.insert(v.uid) {
                *c.trips.entry((v.origin, v.dest)).or_default() += 1;
            }
        }
    }
}
