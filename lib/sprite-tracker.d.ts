export interface SpriteTrackerOptions {
  /** Sprite sheet URL — one horizontal strip of equal-width cells. */
  src: string;
  /** Cell count in the strip. */
  frames: number;
  /** Cell width in px. */
  frameWidth: number;
  /** Cell height in px. */
  frameHeight: number;
  /** Cells per sheet row (default: frames, i.e. a single row). */
  columns?: number;
  /** Float index of the resting, front-facing pose. */
  neutralIndex?: number;
  /** Yaw spring constant while tracking. */
  stiffness?: number;
  /** Yaw spring damping while tracking. */
  damping?: number;
  /** Yaw spring constant while returning to rest. */
  returnStiffness?: number;
  /** Yaw spring damping while returning to rest. */
  returnDamping?: number;
  /** Transform spring constant. */
  leanStiffness?: number;
  /** Transform spring damping. */
  leanDamping?: number;
  /** Fraction of viewport width at which the turn saturates. */
  rangeScale?: number;
  /** Floor for the saturation distance, px. */
  minRange?: number;
  /** Distance that saturates the vertical lean, px. */
  verticalRange?: number;
  /** Max horizontal drift, px. */
  leanX?: number;
  /** Max vertical drift, px. */
  leanY?: number;
  /** Max body lean, degrees. */
  leanRotate?: number;
  /** Idle drift as a fraction of a full turn. Set 0 to disable. */
  idleAmplitude?: number;
  /** Idle drift period, seconds. */
  idlePeriod?: number;
  /** Quiet time before idle drift starts, ms. */
  idleDelay?: number;
  /** Honour prefers-reduced-motion by painting the resting pose only. */
  respectReducedMotion?: boolean;
  /** Called once the sheet is decoded, or with the error if it failed. */
  onReady?: (err?: unknown) => void;
}

export declare class SpriteTracker {
  constructor(canvas: HTMLCanvasElement, options: SpriteTrackerOptions);
  start(): Promise<void>;
  /** Swap in a different sheet, preserving the current pose and spring state. */
  setSource(src: string): Promise<void>;
  destroy(): void;
}

export default SpriteTracker;
