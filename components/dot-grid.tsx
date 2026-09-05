"use client";

import * as React from "react";

/* ---------------------------------------------------------------------------
   Dot grid — the ambient background texture, drawn on canvas so each dot can
   be displaced independently.

   Resting state is the same flat 24px grid the CSS version drew. Near the
   pointer, dots read as if they are rising off the page: they scale up, gain
   opacity, shift up the y-axis and push outward from the cursor. The combined
   falloff reads as a dome bulging toward the viewer.

   Colour and alpha come from CSS custom properties, so the grid flips with the
   theme (white dots on black, dark dots on white) without a prop.
--------------------------------------------------------------------------- */

/** Grid spacing in CSS pixels. Matches the original background-size. */
const PITCH = 24;
/** Radius of pointer influence, in CSS pixels. */
const REACH = 115;
/** Peak upward travel at the centre of the dome. */
const LIFT = 7;
/** Peak outward push, away from the cursor. */
const PUSH = 2.5;
/** Dot radius multiplier at the centre of the dome. */
const MAX_SCALE = 1.9;
/** Base dot radius in CSS pixels. */
const BASE_RADIUS = 1;
/** How quickly the smoothed pointer chases the real one. */
const EASE = 0.16;
/** Below this width the mobile layout takes over and the lift is dropped.
    Matches Tailwind's `md` breakpoint. */
const MIN_WIDTH = 768;

type Palette = { color: string; base: number; peak: number };

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const color = styles.getPropertyValue("--dot-color").trim() || "255 255 255";
  const base = Number(styles.getPropertyValue("--dot-base")) || 0.05;
  const peak = Number(styles.getPropertyValue("--dot-peak")) || 0.5;
  return { color, base, peak };
}

export function DotGrid() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const palette = readPalette();

    // Real pointer, the smoothed pointer that trails it, and how much of the
    // effect is currently applied (0 while the pointer is away from the page).
    let pointerX = -9999;
    let pointerY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;
    let energy = 0;
    let targetEnergy = 0;
    let frame = 0;
    let running = false;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      // Backing store and CSS size must describe the same rectangle, or the
      // browser rescales the canvas and the 24px lattice picks up a moiré of
      // unevenly anti-aliased dots (fractional zoom levels made this visible).
      const pw = Math.round(width * dpr);
      const ph = Math.round(height * dpr);
      canvas!.width = pw;
      canvas!.height = ph;
      canvas!.style.width = `${pw / dpr}px`;
      canvas!.style.height = `${ph / dpr}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    /** Draw every grid dot whose centre falls inside [x0,x1]×[y0,y1]. */
    function drawRegion(x0: number, y0: number, x1: number, y1: number) {
      const { color, base, peak } = palette;
      const reachSq = REACH * REACH;

      // Snap the region to the dot lattice (dots sit at PITCH/2 + k·PITCH).
      const startY = Math.max(
        PITCH / 2,
        PITCH / 2 + Math.floor((y0 - PITCH / 2) / PITCH) * PITCH,
      );
      const startX = Math.max(
        PITCH / 2,
        PITCH / 2 + Math.floor((x0 - PITCH / 2) / PITCH) * PITCH,
      );

      // The overwhelming majority of dots are at rest and share one style, so
      // they accumulate into a single path and one fill() — thousands of
      // beginPath/fill round-trips per frame is what used to drop frames.
      // Dome dots have per-dot alpha and radius, so they still draw singly.
      const restPath = new Path2D();
      for (let y = startY; y <= y1 && y < height + PITCH; y += PITCH) {
        for (let x = startX; x <= x1 && x < width + PITCH; x += PITCH) {
          let inDome = false;

          if (energy > 0.001) {
            const vx = x - smoothX;
            const vy = y - smoothY;
            const distSq = vx * vx + vy * vy;

            if (distSq < reachSq) {
              inDome = true;
              const dist = Math.sqrt(distSq) || 0.0001;
              // Smoothstep falloff — flat at the rim, rounded at the peak.
              const linear = 1 - dist / REACH;
              const t = linear * linear * (3 - 2 * linear) * energy;

              const radius = BASE_RADIUS * (1 + (MAX_SCALE - 1) * t);
              const alpha = base + (peak - base) * t;
              // Up the y-axis, plus a nudge away from the cursor so the
              // displacement reads as height rather than a flat glow.
              const dy = -LIFT * t + (vy / dist) * PUSH * t;
              const dx = (vx / dist) * PUSH * t;
              ctx!.fillStyle = `rgb(${color} / ${alpha})`;
              ctx!.beginPath();
              ctx!.arc(x + dx, y + dy, radius, 0, Math.PI * 2);
              ctx!.fill();
            }
          }

          if (!inDome) {
            // Resting dots snap to device-pixel centres so every dot gets the
            // same anti-aliasing; at fractional zoom the unsnapped lattice
            // shimmers, with each dot blurred by a different subpixel phase.
            const cx = (Math.round(x * dpr - 0.5) + 0.5) / dpr;
            const cy = (Math.round(y * dpr - 0.5) + 0.5) / dpr;
            restPath.moveTo(cx + BASE_RADIUS, cy);
            restPath.arc(cx, cy, BASE_RADIUS, 0, Math.PI * 2);
          }
        }
      }
      ctx!.fillStyle = `rgb(${color} / ${base})`;
      ctx!.fill(restPath);
    }

    /** Full repaint. One pass is ~2k arcs — cheap enough to be the only
        drawing strategy. The previous incremental dirty-rect scheme saved a
        little work per frame but could leave a residue of dome-brightened
        dots along the pointer's trail, which read as an unstable grid. */
    function draw() {
      ctx!.clearRect(0, 0, width, height);
      drawRegion(0, 0, width, height);
    }

    function tick() {
      smoothX += (pointerX - smoothX) * EASE;
      smoothY += (pointerY - smoothY) * EASE;
      energy += (targetEnergy - energy) * EASE;
      if (energy < 0.002 && targetEnergy === 0) energy = 0;

      draw();

      // Sleep whenever nothing is moving: pointer parked (dome painted and
      // static) or pointer gone and the dome fully decayed. A pointermove
      // wakes the loop again.
      const still =
        Math.abs(pointerX - smoothX) < 0.5 &&
        Math.abs(pointerY - smoothY) < 0.5 &&
        Math.abs(targetEnergy - energy) < 0.002;
      if (still) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    }

    // The lift is decorative: skipped for reduced motion, for coarse pointers
    // that have no hover to drive it, and on the mobile layout. Checked per
    // event rather than once, so resizing into the mobile layout drops it.
    function interactive() {
      return (
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        window.matchMedia("(hover: hover)").matches &&
        window.innerWidth >= MIN_WIDTH
      );
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse" || !interactive()) return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      // Drop the smoothed point onto the cursor the first time it appears,
      // so the dome does not sweep in from the corner.
      if (energy === 0 && targetEnergy === 0) {
        smoothX = pointerX;
        smoothY = pointerY;
      }
      targetEnergy = 1;
      start();
    }

    function onPointerLeave() {
      targetEnergy = 0;
      start();
    }

    function onResize() {
      // Settle back to the flat grid if the resize crossed into mobile.
      if (!interactive()) targetEnergy = 0;
      resize();
    }

    resize();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
