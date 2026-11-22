import type { Metrics } from '../types';

export interface RecoverySummary {
  /** False when the run used the historical policy or admitted a vehicle past an occupied conflict point. */
  physicallyValid: boolean;
  /** One plain-language paragraph; it states its own verdict so color is never the only signal. */
  text: string;
}

const POLICY: Record<string, string> = {
  physical: 'physical',
  no_behavioral: 'no behavioral rules',
  historical: 'historical',
};

const perHour = (n: number, seconds: number): number => (seconds > 0 ? (n * 3600) / seconds : n);
const rate = (n: number, seconds: number): string => {
  const v = perHour(n, seconds);
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
};

/** Turns the junction recovery figures of one run into a plain-language validity summary (change expose-junction-fallback-validity). */
export function recoverySummary(m: Pick<Metrics, 'junctionRecovery' | 'time'>): RecoverySummary {
  const jr = m.junctionRecovery;
  if (!jr) {
    return { physicallyValid: true, text: 'Junction recovery: this result carries no figures, so how often the junction rules admitted vehicles the ordinary rule would refuse is not reported.' };
  }
  const t = m.time;
  const bypass = jr.conflictBypass.admissions;
  const label = POLICY[jr.policy] ?? jr.policy;
  const valid = jr.policy !== 'historical' && bypass === 0;
  const verdict = valid
    ? `Junction recovery, policy ${label}: an occupied conflict point blocked every vehicle however long it waited, and no vehicle went past one.`
    : `Junction recovery, policy ${label}: this run does not pass the physical junction check. ${rate(bypass, t)} vehicles an hour went past an occupied conflict point, so treat its results as qualified.`;
  const behavioral = jr.policy === 'no_behavioral'
    ? 'Courtesy and the yield fallback were switched off.'
    : `Courtesy admitted ${rate(jr.courtesy.admissions, t)} an hour and the yield fallback ${rate(jr.yieldFallback.admissions, t)} an hour that the ordinary priority rule would have refused, out of ${Math.round(jr.crossings).toLocaleString('en-US')} node entries (the waits that trigger them are assumptions, not measurements).`;
  const held = jr.heldRemovals > 0
    ? ` Cars cleared from gridlock while held in a junction: ${jr.heldRemovals}.`
    : '';
  const scope = ' A low removal count or few close-following conflicts do not by themselves show that junctions operated validly; these are model checks, not crash predictions.';
  return { physicallyValid: valid, text: `${verdict} ${behavioral}${held}${scope}` };
}
