"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useUI } from "@/components/providers/lenis-provider";

/** Below this width the mobile layout takes over and the reticle is dropped.
    Matches Tailwind's `md` breakpoint. */
const MIN_WIDTH = 768;

/** Re-check eligibility whenever the viewport or the input device changes, so
    resizing a desktop window into the mobile layout drops the reticle too. */
function subscribeEligibility(onChange: () => void) {
  const queries = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(pointer: coarse)"),
  ];
  queries.forEach((q) => q.addEventListener("change", onChange));
  window.addEventListener("resize", onChange);
  return () => {
    queries.forEach((q) => q.removeEventListener("change", onChange));
    window.removeEventListener("resize", onChange);
  };
}

/** Lerp factor for the trailing reticle — lower = more lag/spring feel. */
const LERP = 0.2;
const RING = 30; // px — reticle ring diameter
const DOT = 6; // px — precise center dot

/** Elements the reticle should "lock onto" (grow) when hovered. */
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor]';

/** True only on fine-pointer, non-touch, motion-allowing, desktop-width devices. */
function supportsSignalCursor(): boolean {
  if (typeof window === "undefined") return false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const narrow = window.innerWidth < MIN_WIDTH;
  return !reduced && !coarse && !touch && !narrow;
}

/**
 * Custom "signal" cursor — replaces the native pointer with a reticle:
 * a precise signal-green dot that tracks instantly, plus a lerp-trailing
 * crosshair ring that locks on (grows) over interactive elements and
 * contracts on press.
 *
 * Renders nothing (native cursor stays) when toggled off via ⌘K, on
 * touch/coarse-pointer devices, on the mobile layout, or under
 * `prefers-reduced-motion`.
 */
export function SignalCursor() {
  const { cursorEnabled } = useUI();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const supported = useSyncExternalStore(
    subscribeEligibility,
    supportsSignalCursor,
    () => false,
  );

  const enabled = supported && cursorEnabled;

  useEffect(() => {
    if (!enabled) return;

    const html = document.documentElement;
    html.classList.add("signal-cursor-active");

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let visible = false;
    let hover = false;
    let pressed = false;
    let frame = 0;

    const setVisible = (v: boolean) => {
      visible = v;
      const o = v ? "1" : "0";
      if (dotRef.current) dotRef.current.style.opacity = o;
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      hover = !!(
        e.target instanceof Element && e.target.closest(INTERACTIVE)
      );
      if (!visible) {
        rx = tx;
        ry = ty;
        setVisible(true);
      }
      // Precise dot tracks the pointer with zero lag.
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${tx - DOT / 2}px, ${ty - DOT / 2}px, 0)`;
      }
    };

    const onLeave = () => setVisible(false);
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    const tick = () => {
      rx += (tx - rx) * LERP;
      ry += (ty - ry) * LERP;
      const ring = ringRef.current;
      if (ring) {
        const scale = (hover ? 1.7 : 1) * (pressed ? 0.82 : 1);
        ring.style.transform = `translate3d(${rx - RING / 2}px, ${ry - RING / 2}px, 0) scale(${scale})`;
        ring.style.opacity = visible ? (hover ? "1" : "0.65") : "0";
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      html.classList.remove("signal-cursor-active");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Trailing reticle ring + crosshair ticks */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] opacity-0"
        style={{
          width: RING,
          height: RING,
          willChange: "transform, opacity",
          transition: "opacity 150ms linear",
        }}
      >
        <span
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: "var(--signal)" }}
        />
        <span
          className="absolute left-1/2 top-[-3px] h-[3px] w-px -translate-x-1/2"
          style={{ backgroundColor: "var(--signal)" }}
        />
        <span
          className="absolute bottom-[-3px] left-1/2 h-[3px] w-px -translate-x-1/2"
          style={{ backgroundColor: "var(--signal)" }}
        />
        <span
          className="absolute left-[-3px] top-1/2 h-px w-[3px] -translate-y-1/2"
          style={{ backgroundColor: "var(--signal)" }}
        />
        <span
          className="absolute right-[-3px] top-1/2 h-px w-[3px] -translate-y-1/2"
          style={{ backgroundColor: "var(--signal)" }}
        />
      </div>

      {/* Precise center dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full opacity-0"
        style={{
          width: DOT,
          height: DOT,
          backgroundColor: "var(--signal)",
          willChange: "transform",
        }}
      />
    </>
  );
}
