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
 * @property {number} [columns]           Cells per sheet row (default: frames, i.e. one row).
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
    this._invalidate = this._invalidate.bind(this);
    this.rect = null;
    this.rectDirty = true;
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
    window.addEventListener("resize", this._invalidate, { passive: true });
    window.addEventListener("scroll", this._invalidate, { passive: true, capture: true });
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
    window.removeEventListener("resize", this._invalidate);
    window.removeEventListener("scroll", this._invalidate, { capture: true });
    document.removeEventListener("visibilitychange", this._onVisibility);
    this.observer?.disconnect();
    this._release_sheet(this.sheet);
    this.sheet = null;
  }

  /**
   * Swap in a different sheet without disturbing the pose. Used to hand over
   * between the light- and dark-matted cutouts on a theme change: the spring
   * state is untouched, so the figure keeps looking wherever it was looking.
   * @param {string} src
   */
  async setSource(src) {
    if (this.opts.src === src) return;
    this.opts.src = src;
    let next;
    try {
      next = await this._load(src);
    } catch {
      return; // keep the sheet already on screen
    }
    if (this.destroyed) {
      this._release_sheet(next);
      return;
    }
    const previous = this.sheet;
    this.sheet = next;
    this._release_sheet(previous);
    this.drawnIndex = -1; // force a repaint from the new sheet
    this._draw(this._indexFor(this.pos));
  }

  /* ------------------------------------------------------------------ load */

  /**
   * Decode the strip and slice it into one bitmap per cell.
   *
   * The sheet is ~16k pixels wide, which is at or past the maximum texture size
   * on plenty of GPUs. Handing that straight to drawImage every frame drops the
   * canvas onto a software path — it costs frames, and sampling a sub-rect out
   * of an over-large texture also smears neighbouring cells into each other.
   * Uploading 44 small textures once avoids both.
   */
  async _load(src) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    await img.decode();

    const { frameWidth: fw, frameHeight: fh, frames } = this.opts;
    if (typeof createImageBitmap !== "function") return { sheet: img, cells: null };
    try {
      // Slice in small batches, yielding between them. Decoding a ~16k-wide
      // sheet and cutting every cell in one go lands as a single ~370ms task
      // and drops a frame on load; in chunks it stays off the critical path.
      const cols = this.opts.columns || frames;
      const cells = [];
      const BATCH = 6;
      for (let i = 0; i < frames; i += BATCH) {
        const slice = await Promise.all(
          Array.from({ length: Math.min(BATCH, frames - i) }, (_, k) => {
            const n = i + k;
            return createImageBitmap(img, (n % cols) * fw, Math.floor(n / cols) * fh, fw, fh);
          }),
        );
        cells.push(...slice);
        if (this.destroyed) {
          for (const c of cells) c.close?.();
          return { sheet: null, cells: null };
        }
        await new Promise((r) => setTimeout(r, 0));
      }
      return { sheet: null, cells };
    } catch {
      // Slicing is an optimisation; the whole-sheet path still renders.
      return { sheet: img, cells: null };
    }
  }

  /** Release decoded bitmaps. */
  _release_sheet(s) {
    if (!s) return;
    if (s.cells) for (const c of s.cells) c.close?.();
    else if (s.sheet && "close" in s.sheet) s.sheet.close();
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

  /**
   * Cached canvas geometry. getBoundingClientRect forces layout, and doing that
   * inside pointermove — which fires far more often than once a frame, on a
   * page that also runs smooth scroll and a pointer-reactive background — is
   * enough to stall the whole interaction. The box only moves on scroll or
   * resize, so measure it then instead.
   */
  _measure() {
    const r = this.canvas.getBoundingClientRect();
    if (r.width > 0) this.rect = { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  _invalidate() {
    this.rectDirty = true;
  }

  /** @param {PointerEvent} e */
  _onPointerMove(e) {
    // Coarse pointers have no hover, so a touch drag drives it and lifting the
    // finger falls through to the idle drift.
    if (this.rectDirty || !this.rect) {
      this._measure();
      this.rectDirty = false;
    }
    const rect = this.rect;
    if (!rect || rect.width === 0) return;

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
    if (Math.abs(idx - this.drawnIndex) < 0.0008) return;
    this.drawnIndex = idx;

    const i0 = Math.floor(idx);
    const i1 = Math.min(frames - 1, i0 + 1);
    const cells = this.sheet.cells;
    // Near-linear blend. Snapping toward the closer cell keeps each frame
    // crisper, but it also quantises the motion into visible steps; blending
    // across the whole gap makes the scrub continuous rather than frame-rate
    // bound. Adjacent cells are under two degrees of yaw apart, so the
    // mid-blend softening does not read as a double image.
    const blend = smoothstep(0.08, 0.92, idx - i0);

    const ctx = this.ctx;
    const cols = this.opts.columns || frames;
    const cell = (i) => {
      if (cells) ctx.drawImage(cells[i], 0, 0);
      else ctx.drawImage(this.sheet.sheet, (i % cols) * fw, Math.floor(i / cols) * fh, fw, fh, 0, 0, fw, fh);
    };

    ctx.clearRect(0, 0, fw, fh);

    // Below/above the threshold only one cell contributes, which also halves
    // the draw cost across most of the sweep.
    if (!cells && !this.sheet.sheet) return;
    if (i1 === i0 || blend <= 0.004) {
      ctx.globalAlpha = 1;
      cell(i0);
      return;
    }
    if (blend >= 0.996) {
      ctx.globalAlpha = 1;
      cell(i1);
      return;
    }

    // Cross-dissolve two cut-out sprites additively.
    //
    // Drawing the outgoing cell at full alpha and the incoming one over it does
    // NOT dissolve: wherever the outgoing head covers pixels the incoming one
    // leaves transparent, it survives at full strength and the two poses read as
    // one double-exposed face. "lighter" sums colour and alpha, and the two
    // weights total 1, so the result is exactly A*(1-t) + B*t with no clipping.
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 1 - blend;
    cell(i0);
    ctx.globalAlpha = blend;
    cell(i1);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
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
