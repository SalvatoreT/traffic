//! Objectives: the goals the published options are chosen for. One list, sorted by through cars removed, but each option says which
//! objective or objectives it is the best for. Every weight and threshold here is an ASSUMPTION (no published value); the project lead
//! asked for different proposals that optimize for different things, and for closures and resident detours to count only lightly.

use super::cands::Cand;
use super::report::Final;
use super::search::Eval;
use super::Params;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Objective {
    /// Today's rule: through cars removed, less the existing light penalty for the largest all-car rise on one block.
    MostRemoved,
    /// The best package made only of measures that close nothing to cars.
    NoClosures,
    /// Through cars removed, less a light weight times the added trip time of trips that start or end inside the study area.
    LeastDetour,
    /// The best package of at most `FEWEST_MAX_CHANGES` changes.
    FewestChanges,
}

pub const ALL: [Objective; 4] = [Objective::MostRemoved, Objective::NoClosures, Objective::LeastDetour, Objective::FewestChanges];

/// ASSUMPTION: "a simple first step" is at most two changes.
pub const FEWEST_MAX_CHANGES: usize = 2;
/// ASSUMPTION: points of through-car reduction (percent of the baseline) given up per second of added trip time for a resident trip. Light:
/// through-car removal still dominates; see `design.md` of `proposal-objectives` for how it was set.
pub const DETOUR_WEIGHT_PTS_PER_S: f64 = 0.5;
/// ASSUMPTION: the detour objective never lifts a package that removes less than this share of the best reduction in its pool.
pub const DETOUR_REDUCTION_FLOOR: f64 = 0.5;

impl Objective {
    pub fn id(self) -> &'static str {
        match self {
            Objective::MostRemoved => "most-removed",
            Objective::NoClosures => "no-closures",
            Objective::LeastDetour => "least-detour",
            Objective::FewestChanges => "fewest-changes",
        }
    }

    /// The phrase after "Best for: " on a card.
    pub fn label(self) -> &'static str {
        match self {
            Objective::MostRemoved => "most cut-through removed",
            Objective::NoClosures => "no street closures",
            Objective::LeastDetour => "least detour for residents",
            Objective::FewestChanges => "fewest changes",
        }
    }

    pub fn rule(self) -> String {
        match self {
            Objective::MostRemoved => "Through cars removed, minus the light penalty for the largest all-car rise on one block.".into(),
            Objective::NoClosures => "The same score, among packages made only of measures that close nothing to cars: Slow Streets, one-ways, all-way stops, traffic circles, speed humps and turn bans. No modal filters or diverters.".into(),
            Objective::LeastDetour => format!(
                "The same score minus {DETOUR_WEIGHT_PTS_PER_S} points per second of added trip time for trips that start or end inside the study area (ASSUMPTION: the weight), among packages that remove at least {:.0}% of the most removed.",
                DETOUR_REDUCTION_FLOOR * 100.0
            ),
            Objective::FewestChanges => format!("The same score, among packages of at most {FEWEST_MAX_CHANGES} changes."),
        }
    }

    pub fn from_id(id: &str) -> Option<Objective> {
        ALL.iter().copied().find(|o| o.id() == id)
    }
}

/// Measures that close nothing to cars (candidate kinds).
pub fn closes_nothing(c: &Cand) -> bool {
    matches!(c.kind, "slow_street" | "speed_limit" | "one_way" | "control" | "traffic_circle" | "speed_hump" | "turn_ban")
}

/// Which candidates a beam for `obj` may use.
pub fn allowed(obj: Objective, cands: &[Cand]) -> Vec<bool> {
    cands.iter().map(|c| obj != Objective::NoClosures || closes_nothing(c)).collect()
}

/// The deepest package a beam for `obj` grows.
pub fn depth(obj: Objective, p: &Params) -> usize {
    if obj == Objective::FewestChanges {
        p.depth.min(FEWEST_MAX_CHANGES)
    } else {
        p.depth
    }
}

/// Screening value of a package for `obj` (`core` is the beam's ranking value: reduction minus the ranking-weighted harm).
pub fn screen_value(obj: Objective, p: &Params, core: f64, e: &Eval) -> f64 {
    if obj == Objective::LeastDetour {
        core - p.detour_weight * e.detour_s.max(0.0)
    } else {
        core
    }
}

/// Whether a rechecked package can win `obj`.
pub fn eligible(obj: Objective, f: &Final) -> bool {
    match obj {
        Objective::MostRemoved | Objective::LeastDetour => true,
        Objective::NoClosures => !f.closes,
        Objective::FewestChanges => f.set.len() <= FEWEST_MAX_CHANGES,
    }
}

/// Published score of a rechecked package for `obj`.
pub fn final_score(obj: Objective, p: &Params, f: &Final) -> f64 {
    if obj == Objective::LeastDetour {
        f.score - p.detour_weight * f.detour_s.max(0.0)
    } else {
        f.score
    }
}
