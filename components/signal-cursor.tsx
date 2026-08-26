"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useUI } from "@/components/providers/lenis-provider";

/** Below this width the mobile layout takes over and the custom cursor is
    dropped. Matches Tailwind's `md` breakpoint. */
const MIN_WIDTH = 768;

/** Re-check eligibility whenever the viewport or the input device changes, so
    resizing a desktop window into the mobile layout restores the native arrow. */
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
 * Custom cursor — swaps the native pointer for a chunky rounded arrow, drawn
 * as an SVG data URI in globals.css. It uses the real CSS `cursor` property
 * rather than a JS-tracked element, so it is compositor-driven and can never
 * lag behind the pointer. Interactive elements get the same arrow in signal
 * green, which is the only hover state it carries.
 *
 * Renders nothing (native cursor stays) when toggled off via ⌘K, on
 * touch/coarse-pointer devices, on the mobile layout, or under
 * `prefers-reduced-motion`.
 */
export function SignalCursor() {
  const { cursorEnabled } = useUI();

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
    return () => {
      html.classList.remove("signal-cursor-active");
    };
  }, [enabled]);

  return null;
}
