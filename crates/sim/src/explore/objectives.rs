//! Objectives: the goals the published options are chosen for. One list, sorted by through cars removed, but each option says which
//! objective or objectives it is the best for. Every threshold here is an ASSUMPTION (no published value); the project lead asked for
//! different proposals that optimize for different things.

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
    /// The smallest added trip time for trips that start or end inside the study area, among packages that still remove at least half of
    /// the most removed.
    LeastDetour,
    /// The best package of at most `FEWEST_MAX_CHANGES` changes.
    FewestChanges,
}

pub const ALL: [Objective; 4] = [Objective::MostRemoved, Objective::NoClosures, Objective::LeastDetour, Objective::FewestChanges];

/// ASSUMPTION: "a simple first step" is at most two changes.
pub const FEWEST_MAX_CHANGES: usize = 2;
/// ASSUMPTION: the detour objective considers only packages that remove at least this share of the best reduction in its pool ("lowest
/// detour that still removes half", project lead, 2026-11-16).
pub const DETOUR_REDUCTION_FLOOR: f64 = 0.5;
/// ASSUMPTION: seconds per trip by which one package's mean detour must be lower than another's before the difference counts when the two
/// have no paired per-seed comparison (fewer than `MIN_PAIRS` seeds). With enough seeds the paired interval decides instead.
pub const DETOUR_TIE_S: f64 = 1.0;
/// Ranking offset that puts a package above the detour floor ahead of every package below it in a beam (reductions are percentages).
const ABOVE_FLOOR: f64 = 1000.0;

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
                "The smallest added trip time per trip for trips that start or end inside the study area, among packages that remove at least {:.0}% of the most removed (ASSUMPTION: the share). Ties and differences the paired comparison cannot resolve go to the larger reduction, then fewer changes.",
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

/// Screening value of a package for `obj` (`core` is the beam's ranking value: reduction minus the ranking-weighted harm). For the detour
/// objective, `floor_pct` is the reduction a package needs to count (`DETOUR_REDUCTION_FLOOR` of the best seen): above it a package ranks
/// by its detour, lowest first, ahead of every package below it, which rank by `core`.
pub fn screen_value(obj: Objective, core: f64, e: &Eval, floor_pct: f64) -> f64 {
    if obj == Objective::LeastDetour && e.reduction_pct >= floor_pct {
        ABOVE_FLOOR - e.detour_s.clamp(-ABOVE_FLOOR / 2.0, ABOVE_FLOOR / 2.0)
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
