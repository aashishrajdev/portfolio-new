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
    let palette = readPalette();

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      const { color, base, peak } = palette;
      const reachSq = REACH * REACH;

      for (let y = PITCH / 2; y < height + PITCH; y += PITCH) {
        for (let x = PITCH / 2; x < width + PITCH; x += PITCH) {
          let alpha = base;
          let dx = 0;
          let dy = 0;
          let radius = BASE_RADIUS;

          if (energy > 0.001) {
            const vx = x - smoothX;
            const vy = y - smoothY;
            const distSq = vx * vx + vy * vy;

            if (distSq < reachSq) {
              const dist = Math.sqrt(distSq) || 0.0001;
              // Smoothstep falloff — flat at the rim, rounded at the peak.
              const linear = 1 - dist / REACH;
              const t = linear * linear * (3 - 2 * linear) * energy;

              radius = BASE_RADIUS * (1 + (MAX_SCALE - 1) * t);
              alpha = base + (peak - base) * t;
              // Up the y-axis, plus a nudge away from the cursor so the
              // displacement reads as height rather than a flat glow.
              dy = -LIFT * t + (vy / dist) * PUSH * t;
              dx = (vx / dist) * PUSH * t;
            }
          }

          ctx!.fillStyle = `rgb(${color} / ${alpha})`;
          ctx!.beginPath();
          ctx!.arc(x + dx, y + dy, radius, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    function tick() {
      smoothX += (pointerX - smoothX) * EASE;
      smoothY += (pointerY - smoothY) * EASE;
      energy += (targetEnergy - energy) * EASE;

      draw();

      const settled =
        targetEnergy === 0 &&
        energy < 0.002 &&
        Math.abs(pointerX - smoothX) < 0.5 &&
        Math.abs(pointerY - smoothY) < 0.5;

      if (settled) {
        energy = 0;
        running = false;
        draw();
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

    // The palette lives in CSS, so re-read it whenever the theme class flips.
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

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
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
