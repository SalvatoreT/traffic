// A turning count's directions are relative to its intersection. A gate's directions are relative to the model.
export type CountDirection = 'entering' | 'leaving';

const legBearing: Record<string, number> = { N: 0, E: 90, S: 180, W: 270 };

export function countDirectionForInflow(leg: string, inboundBearings: number[]): CountDirection | null {
  const axis = legBearing[leg];
  if (axis === undefined || !inboundBearings.length) return null;
  // A street continuing across the boundary must carry inflow consistently toward or away from the count.
  // Conflicting bearings, or travel perpendicular to the counted leg, do not identify a direction.
  const alignments = inboundBearings.map((b) => Math.cos((b - axis) * Math.PI / 180));
  if (alignments.every((x) => x > 1e-6)) return 'leaving';
  if (alignments.every((x) => x < -1e-6)) return 'entering';
  return null;
}

export const reverseCountDirection = (direction: CountDirection): CountDirection => direction === 'entering' ? 'leaving' : 'entering';
