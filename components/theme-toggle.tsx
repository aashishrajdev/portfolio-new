"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Browsers expose `document.startViewTransition` only on recent Chromium/WebKit.
 * Narrow the global without polluting other modules with the DOM lib type.
 */
type StartViewTransition = (callback: () => void) => {
  ready: Promise<void>;
};

function getStartViewTransition(): StartViewTransition | null {
  if (typeof document === "undefined") return null;
  const fn = (
    document as Document & {
      startViewTransition?: StartViewTransition;
    }
  ).startViewTransition;
  return typeof fn === "function" ? fn.bind(document) : null;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Skiper UI's "circle" variant with blur on: a hard-edged clip-path circle
   expanding over 1s on the expo-out curve while the incoming view resolves
   from an 8px blur. */
const DURATION = 1000;
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)"; /* --expo-out */
const BLUR_RAMP = ["blur(8px)", "blur(4px)", "blur(0px)"];

/**
 * Monochrome dark/light toggle with Skiper UI's circle + blur reveal
 * (skiper26, variant "circle", blur on), driven by the View Transitions API
 * and the Web Animations API on `::view-transition-new(root)`: the incoming
 * theme expands as a clip-path circle while its blur ramps 8px → 4px → 0.
 *
 * Where skiper26 only anchors the circle to viewport corners/center, the
 * origin here is the toggle button's exact centre, read from its bounding box
 * at click time — so the reveal always starts under the cursor no matter
 * where the toggle sits in the layout.
 *
 * Falls back to an instant swap with no View Transitions support or under
 * `prefers-reduced-motion`.
 *
 * Adapted from Skiper UI's theme toggle, itself derived from
 * rudrodip/theme-toggle-effect.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Intentional mount guard (canonical next-themes pattern): the resolved theme
  // is unknown on the server, so icons render client-side only after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const toggle = useCallback(() => {
    const next = isDark ? "light" : "dark";
    const startViewTransition = getStartViewTransition();

    // Fallback: no View Transitions support or user prefers reduced motion.
    if (!startViewTransition || prefersReducedMotion()) {
      setTheme(next);
      return;
    }

    // Origin = centre of the toggle button; radius = farthest viewport corner.
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = startViewTransition(() => {
      setTheme(next);
    });

    transition.ready
      .then(() => {
        // skiper26 grows the circle to 150% so the wipe overshoots the far
        // corner instead of landing exactly on it.
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius * 1.5}px at ${x}px ${y}px)`,
            ],
            filter: BLUR_RAMP,
          },
          {
            duration: DURATION,
            easing: EASING,
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        // If the transition can't start, the theme already flipped — no-op.
      });
  }, [isDark, setTheme]);

  return (
    <Button
      ref={buttonRef}
      type="button"
      aria-label={
        mounted
          ? isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
          : "Toggle theme"
      }
      onClick={toggle}
      variant="outline"
      size="icon"
      className={cn("focus-visible:outline-none", className)}
    >
      {mounted ? (
        isDark ? (
          <FiSun className="h-4 w-4" aria-hidden />
        ) : (
          <FiMoon className="h-4 w-4" aria-hidden />
        )
      ) : (
        <span className="h-4 w-4" aria-hidden />
      )}
    </Button>
  );
}
