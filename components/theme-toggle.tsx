"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";
import { cn } from "@/lib/utils";

/**
 * Browsers expose `document.startViewTransition` only on recent Chromium/WebKit.
 * Narrow the global without polluting other modules with the DOM lib type.
 */
type StartViewTransition = (callback: () => void) => {
  ready: Promise<void>;
};

function getStartViewTransition(): StartViewTransition | null {
  if (typeof document === "undefined") return null;
  const fn = (document as Document & {
    startViewTransition?: StartViewTransition;
  }).startViewTransition;
  return typeof fn === "function" ? fn.bind(document) : null;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Monochrome dark/light toggle with a circular-reveal wipe.
 *
 * On click it flips the next-themes value. When `document.startViewTransition`
 * is supported (and motion is allowed) the new theme is revealed via a
 * clip-path circle expanding from the button center using the Web Animations
 * API on the `::view-transition-new(root)` pseudo-element — so no global CSS is
 * required. Otherwise it falls back to an instant toggle.
 *
 * A mounted guard avoids a hydration mismatch since the resolved theme is
 * unknown on the server.
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

    // Origin = center of the toggle button; radius = farthest viewport corner.
    const button = buttonRef.current;
    const rect = button?.getBoundingClientRect();
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
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 480,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        // If the transition can't start, the theme already flipped — no-op.
      });
  }, [isDark, setTheme]);

  return (
    <button
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
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface-2",
        "focus-visible:outline-none",
        className,
      )}
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
    </button>
  );
}
