import { VEHICLE_STRIDE } from '../sim/protocol';

/** One sim step: the farthest an agent is extrapolated past its last frame. */
export const MAX_EXTRAPOLATION_S = 0.25;

/** Sim seconds to extrapolate: wall time since the frame, scaled by the sim rate, clamped to [0, max]. A rate of 0 means paused. */
export function elapsedSim(nowMs: number, frameWallMs: number, rate: number, max = MAX_EXTRAPOLATION_S): number {
  if (!(rate > 0)) return 0;
  const dt = ((nowMs - frameWallMs) / 1000) * rate;
  return dt <= 0 ? 0 : dt > max ? max : dt;
}

/** Dead reckoning: dst = src with x, y advanced along heading by speed * dt. Reuses `dst` (sized to `src`). */
export function advance(src: Float32Array, dst: Float32Array, dt: number): void {
  const S = VEHICLE_STRIDE;
  dst.set(src);
  if (dt <= 0) return;
  for (let i = 0; i + S - 1 < src.length; i += S) {
    const d = src[i + 3] * dt, h = src[i + 2];
    dst[i] = src[i] + d * Math.cos(h);
    dst[i + 1] = src[i + 1] + d * Math.sin(h);
  }
}
