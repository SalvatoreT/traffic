// The calibration status rule of the assessment (design D16 to D18, round 26): what each period must show for `calibrated`. No I/O.
export interface PeriodVerdict {
  stable: boolean;
  /** Headline shares within tolerance (PM peak only; null elsewhere). */
  d5: boolean | null;
  /** Through-car check: true inside every observed range, false outside, null with no rows (no data). */
  through: boolean | null;
  /** Station rule on recent counts: true met, false not met or too few to judge, null when the period has no counts of its own (midday). */
  stations: boolean | null;
}

/**
 * `calibrated` needs every period stable, the PM headline shares (D5) and through cars right, and the station rule met in every period that has counts.
 * A missing through-car check (no rows) fails: it never passes by default. A period with no counts is judged on stability only.
 */
export function suggestStatus(periods: Record<string, PeriodVerdict>, pmPeriod = 'pm_peak'): { calibrated: boolean; experimental: string[]; reasons: string[] } {
  const reasons: string[] = [];
  const ids = Object.keys(periods);
  const experimental = ids.filter((p) => !periods[p].stable);
  if (experimental.length) reasons.push(`not stable: ${experimental.join(', ')}`);
  const pm = periods[pmPeriod];
  if (!pm) reasons.push('no PM peak run');
  else {
    if (pm.d5 !== true) reasons.push('headline shares (D5) not met');
    if (pm.through === null) reasons.push('no through-car rows: the check has no data');
    else if (!pm.through) reasons.push('through cars outside the observed range');
  }
  for (const p of ids) if (periods[p].stations === false) reasons.push(`station rule not met or not judgeable in ${p}`);
  return { calibrated: reasons.length === 0, experimental, reasons };
}
