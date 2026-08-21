"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Shared UI context for the "Uptime" interaction core.
 *
 * - `scrollToId(id)` — smooth-scrolls to an element by id via Lenis, with a
 *   native `scrollIntoView` fallback (also used before Lenis mounts or under
 *   reduced motion).
 * - `cursorEnabled` / `setCursorEnabled` — toggle state for the signal cursor.
 */
type UIContextValue = {
  scrollToId: (id: string) => void;
  cursorEnabled: boolean;
  setCursorEnabled: (enabled: boolean) => void;
};

/** Section anchor offset (px) so headings clear the sticky navbar. */
const SCROLL_OFFSET = -80;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Native fallback used before mount / under reduced motion / on failure. */
function nativeScrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

const UIContext = createContext<UIContextValue | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [cursorEnabled, setCursorEnabled] = useState(true);

  useEffect(() => {
    // Honor reduced-motion: skip the Lenis instance entirely and let the
    // native fallback (auto behavior) handle anchor scrolling.
    if (prefersReducedMotion()) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToId = useCallback((id: string) => {
    const lenis = lenisRef.current;
    if (lenis) {
      try {
        lenis.scrollTo(`#${id}`, { offset: SCROLL_OFFSET });
        return;
      } catch {
        // fall through to native
      }
    }
    nativeScrollToId(id);
  }, []);

  return (
    <UIContext.Provider value={{ scrollToId, cursorEnabled, setCursorEnabled }}>
      {children}
    </UIContext.Provider>
  );
}

/**
 * Access the shared UI context. Safe to call before the provider mounts: it
 * returns a no-op `scrollToId` falling back to native scroll and a default
 * enabled cursor, so consumers never crash during the initial render.
 */
export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (ctx) return ctx;
  return {
    scrollToId: nativeScrollToId,
    cursorEnabled: true,
    setCursorEnabled: () => {},
  };
}
