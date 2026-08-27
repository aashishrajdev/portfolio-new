/**
 * sprite-tracker — a dependency-free, frame-based sprite animation system.
 *
 * The sheet is one horizontal strip of equal-width cells extracted from a video
 * with ffmpeg. Cell 0 is the subject turned fully toward the viewer's left, the
 * last cell is fully toward the viewer's right, and `neutralIndex` is the
 * front-facing "ideal" pose the subject settles back into.
 *
 * Scrubbing is driven by a critically-damped spring rather than by mapping the
 * pointer straight onto a frame, so the head eases into position and eases back
 * out instead of snapping. A second spring drives a small CSS transform (lean +
 * lift) layered on top of the frame scrub, which is what sells the parallax.
 *
 * No framework, no dependencies — construct it with a <canvas> and call
 * `destroy()` when the host unmounts.
 */

/** @typedef {object} SpriteTrackerOptions
 * @property {string} src                 Sprite sheet URL.
 * @property {number} frames              Cell count in the strip.
 * @property {number} frameWidth          Cell width in px.
 * @property {number} frameHeight         Cell height in px.
 * @property {number} [neutralIndex]      Float index of the resting pose.
 * @property {number} [stiffness]         Yaw spring constant while tracking.
 * @property {number} [damping]           Yaw spring damping while tracking.
 * @property {number} [returnStiffness]   Yaw spring constant while returning to rest.
 * @property {number} [returnDamping]     Yaw spring damping while returning to rest.
 * @property {number} [leanStiffness]     Transform spring constant.
 * @property {number} [leanDamping]       Transform spring damping.
 * @property {number} [rangeScale]        Multiplier on the measured distance to the screen edge; <1 saturates sooner.
 * @property {number} [minRange]          Floor for the saturation distance, px.
 * @property {number} [verticalRange]     Distance that saturates the vertical lean, px.
 * @property {number} [leanX]             Max horizontal drift, px.
 * @property {number} [leanY]             Max vertical drift, px.
 * @property {number} [leanRotate]        Max body lean, degrees.
 * @property {number} [idleAmplitude]     Idle drift as a fraction of full turn.
 * @property {number} [idlePeriod]        Idle drift period, seconds.
 * @property {number} [idleDelay]         Quiet time before idle drift starts, ms.
 * @property {boolean} [respectReducedMotion]
 * @property {(err?: unknown) => void} [onReady]
 */

const DEFAULTS = {
  neutralIndex: 0,
  // Tracking is slightly underdamped so the head feels eager; the return is
  // overdamped (critical for k=44 is ~13.3) so it glides home without a bounce.
  stiffness: 92,
  damping: 17,
  returnStiffness: 44,
  returnDamping: 15.4,
  leanStiffness: 58,
  leanDamping: 14,
  rangeScale: 1,
  minRange: 340,
  verticalRange: 520,
  leanX: 10,
  leanY: 9,
  leanRotate: 1.6,
  idleAmplitude: 0.07,
  idlePeriod: 7.5,
  idleDelay: 3200,
  respectReducedMotion: true,
};

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/**
 * Ease the pointer offset into a turn amount. Small offsets near the subject
 * produce proportionally more rotation, and the extremes flatten out, so the
 * head never looks like it is snapping to a hard stop.
 */
function shapeTurn(t) {
  const s = t < 0 ? -1 : 1;
  const a = Math.abs(t);
  return s * (1 - Math.pow(1 - a, 1.7));
}

/** Hermite smoothstep, used to keep cross-fades near a crisp single frame. */
function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export class SpriteTracker {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {SpriteTrackerOptions} options
   */
  constructor(canvas, options) {
    /** @type {SpriteTrackerOptions & typeof DEFAULTS} */
    this.opts = { ...DEFAULTS, ...options };
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });

    canvas.width = this.opts.frameWidth;
    canvas.height = this.opts.frameHeight;

    /** Sprite sheet, once decoded. */
    this.sheet = null;
    this.destroyed = false;
    this.running = false;
    this.visible = true;
    this.rafId = 0;
    this.lastTime = 0;
    this.elapsed = 0;
    this.lastPointerAt = 0;
    this.hasPointer = false;

    // Spring state. `pos` is the yaw in [-1, 1]; -1 is the viewer's left.
    this.pos = 0;
    this.vel = 0;
    this.target = 0;
    this.leanPos = { x: 0, y: 0 };
    this.leanVel = { x: 0, y: 0 };
    this.leanTarget = { x: 0, y: 0 };

    this.drawnIndex = -1;

    this.reduced =
      this.opts.respectReducedMotion &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onBlur = () => this._release();
    this._onVisibility = this._onVisibility.bind(this);
    this._tick = this._tick.bind(this);
  }

  async start() {
    try {
      this.sheet = await this._load(this.opts.src);
    } catch (err) {
      // A failed sheet is not fatal — the host keeps showing the still image.
      this.opts.onReady?.(err);
      return;
    }
    if (this.destroyed) return;

    // Paint the resting pose immediately so there is no blank frame.
    this.pos = 0;
    this._draw(this.opts.neutralIndex);
    this.opts.onReady?.();

    if (this.reduced) return;

    window.addEventListener("pointermove", this._onPointerMove, { passive: true });
    window.addEventListener("pointerdown", this._onPointerMove, { passive: true });
    document.addEventListener("pointerleave", this._onPointerLeave);
    window.addEventListener("blur", this._onBlur);
    document.addEventListener("visibilitychange", this._onVisibility);

    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          this.visible = entries.some((e) => e.isIntersecting);
          if (this.visible) this._wake();
        },
        { rootMargin: "120px" },
      );
      this.observer.observe(this.canvas);
    }

    this._wake();
  }

  destroy() {
    this.destroyed = true;
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener("pointermove", this._onPointerMove);
    window.removeEventListener("pointerdown", this._onPointerMove);
    document.removeEventListener("pointerleave", this._onPointerLeave);
    window.removeEventListener("blur", this._onBlur);
    document.removeEventListener("visibilitychange", this._onVisibility);
    this.observer?.disconnect();
    if (this.sheet && "close" in this.sheet) this.sheet.close();
    this.sheet = null;
  }

  /* ------------------------------------------------------------------ load */

  async _load(src) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    await img.decode();
    // An ImageBitmap keeps drawImage off the decode path on every frame.
    if (typeof createImageBitmap === "function") {
      try {
        return await createImageBitmap(img);
      } catch {
        return img;
      }
    }
    return img;
  }

  /* --------------------------------------------------------------- events */

  _onVisibility() {
    if (document.hidden) {
      this.running = false;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    } else {
      this._wake();
    }
  }

  /** @param {PointerEvent} e */
  _onPointerMove(e) {
    // Coarse pointers have no hover, so a touch drag drives it and lifting the
    // finger falls through to the idle drift.
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0) return;

    const cx = rect.left + rect.width / 2;
    // Anchor on the head rather than the middle of the torso.
    const cy = rect.top + rect.height * 0.28;

    // Saturate against the real distance to each screen edge rather than a
    // fixed span: the figure is rarely centred, and a shared range would leave
    // the whole of its long side pinned at full turn.
    const dx = e.clientX - cx;
    const edge = dx < 0 ? cx : window.innerWidth - cx;
    const range = Math.max(this.opts.minRange, edge * this.opts.rangeScale);

    const nx = clamp(dx / range, -1, 1);
    const ny = clamp((e.clientY - cy) / this.opts.verticalRange, -1, 1);

    this.target = shapeTurn(nx);
    this.leanTarget.x = this.target;
    this.leanTarget.y = ny;
    this.hasPointer = true;
    this.lastPointerAt = this.elapsed;
    this._wake();
  }

  _onPointerLeave(e) {
    // `pointerleave` on document fires for real exits; guard the synthetic ones
    // that fire when the pointer moves onto a child element.
    if (e && e.relatedTarget) return;
    this._release();
  }

  /** Hand back to the resting pose — pointer gone, or the window lost focus. */
  _release() {
    this.hasPointer = false;
    this.target = 0;
    this.leanTarget.x = 0;
    this.leanTarget.y = 0;
    this._wake();
  }

  /* ------------------------------------------------------------------ loop */

  _wake() {
    if (this.destroyed || this.running || this.reduced || document.hidden || !this.visible) return;
    this.running = true;
    this.lastTime = 0;
    this.rafId = requestAnimationFrame(this._tick);
  }

  _tick(now) {
    if (this.destroyed) return;
    const dt = this.lastTime ? Math.min((now - this.lastTime) / 1000, 1 / 20) : 1 / 60;
    this.lastTime = now;
    this.elapsed += dt;

    // Idle drift: once the pointer has been quiet for a while, breathe a little
    // around wherever it left off so the pose never reads as a frozen frame.
    let target = this.target;
    // Gate on quiet time alone, not on the pointer being gone, so a departure
    // gets a clean settle onto the resting pose before the breathing starts.
    const quietFor = this.elapsed - this.lastPointerAt;
    const idleOn = quietFor * 1000 > this.opts.idleDelay;
    if (idleOn && this.opts.idleAmplitude > 0) {
      const phase = (this.elapsed / this.opts.idlePeriod) * Math.PI * 2;
      target += Math.sin(phase) * this.opts.idleAmplitude;
      target += Math.sin(phase * 0.37) * this.opts.idleAmplitude * 0.4;
      target = clamp(target, -1, 1);
    }

    // Yaw spring. Once the pointer is gone the softer pair takes over, which is
    // what makes the walk back to the resting pose read as a settle rather than
    // a snap.
    const k = this.hasPointer ? this.opts.stiffness : this.opts.returnStiffness;
    const c = this.hasPointer ? this.opts.damping : this.opts.returnDamping;
    const accel = -k * (this.pos - target) - c * this.vel;
    this.vel += accel * dt;
    this.pos += this.vel * dt;

    // Transform spring.
    for (const axis of /** @type {const} */ (["x", "y"])) {
      const a =
        -this.opts.leanStiffness * (this.leanPos[axis] - this.leanTarget[axis]) -
        this.opts.leanDamping * this.leanVel[axis];
      this.leanVel[axis] += a * dt;
      this.leanPos[axis] += this.leanVel[axis] * dt;
    }

    this._draw(this._indexFor(this.pos));
    this._applyTransform();

    // Sleep once everything has settled, unless idle drift is keeping it alive.
    const settled =
      Math.abs(this.pos - target) < 0.0006 &&
      Math.abs(this.vel) < 0.0025 &&
      Math.abs(this.leanPos.x - this.leanTarget.x) < 0.0008 &&
      Math.abs(this.leanPos.y - this.leanTarget.y) < 0.0008;

    if (settled && !idleOn) {
      this.running = false;
      this.rafId = 0;
      return;
    }
    this.rafId = requestAnimationFrame(this._tick);
  }

  /* ----------------------------------------------------------------- paint */

  /**
   * Map yaw in [-1, 1] onto the strip. The resting pose is rarely the middle
   * cell, so each side is scaled independently and 0 always lands on it.
   */
  _indexFor(pos) {
    const n = this.opts.neutralIndex;
    const last = this.opts.frames - 1;
    const p = clamp(pos, -1, 1);
    return p < 0 ? n + p * n : n + p * (last - n);
  }

  _draw(index) {
    if (!this.sheet || !this.ctx) return;
    const { frameWidth: fw, frameHeight: fh, frames } = this.opts;
    const idx = clamp(index, 0, frames - 1);
    if (Math.abs(idx - this.drawnIndex) < 0.002) return;
    this.drawnIndex = idx;

    const i0 = Math.floor(idx);
    const i1 = Math.min(frames - 1, i0 + 1);
    // Bias the blend toward whichever cell is closer, so most of the time a
    // single crisp frame is on screen and only the hand-off cross-fades.
    const blend = smoothstep(0.32, 0.68, idx - i0);

    const ctx = this.ctx;
    ctx.clearRect(0, 0, fw, fh);
    ctx.globalAlpha = 1;
    ctx.drawImage(this.sheet, (blend < 1 ? i0 : i1) * fw, 0, fw, fh, 0, 0, fw, fh);
    if (blend > 0 && blend < 1 && i1 !== i0) {
      ctx.globalAlpha = blend;
      ctx.drawImage(this.sheet, i1 * fw, 0, fw, fh, 0, 0, fw, fh);
      ctx.globalAlpha = 1;
    }
  }

  _applyTransform() {
    const { leanX, leanY, leanRotate } = this.opts;
    const x = (this.leanPos.x * leanX).toFixed(2);
    const y = (this.leanPos.y * leanY).toFixed(2);
    const r = (this.leanPos.x * leanRotate).toFixed(3);
    this.canvas.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`;
  }
}

export default SpriteTracker;
