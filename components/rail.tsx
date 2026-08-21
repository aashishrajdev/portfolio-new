"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useUI } from "@/components/providers/lenis-provider";
import { cn } from "@/lib/utils";

/**
 * Rail — sticky left vertical gutter nav for the "Uptime" dashboard.
 *
 * Renders the mono section index `00`–`10` for every section, each with a
 * single-letter hotkey. A vertical hairline connects the indices. An
 * IntersectionObserver scroll-spy lights the ACTIVE index in `--signal`.
 *
 * Click an index — or press its single-letter hotkey anywhere on the page —
 * to `scrollToId(id)` (smooth via Lenis, native fallback under reduced motion).
 * Hidden below `lg`.
 */

type RailSection = {
  /** Section anchor id (without "#"). */
  id: string;
  /** Two-digit mono index, e.g. "00". */
  index: string;
  /** Single uppercase hotkey letter. */
  hotkey: string;
  /** Accessible label. */
  label: string;
};

/** Ordered section map — indices/hotkeys per the "Uptime" spec. */
const SECTIONS: readonly RailSection[] = [
  { id: "hero", index: "00", hotkey: "H", label: "Hero" },
  { id: "about", index: "01", hotkey: "A", label: "About" },
  { id: "experience", index: "02", hotkey: "E", label: "Experience" },
  { id: "projects", index: "03", hotkey: "P", label: "Projects" },
  { id: "open-source", index: "04", hotkey: "O", label: "Open Source" },
  { id: "writing", index: "05", hotkey: "W", label: "Writing" },
  { id: "contact", index: "06", hotkey: "C", label: "Contact" },
] as const;

/** Lowercased hotkey -> section id lookup for the global keydown handler. */
const HOTKEY_TO_ID = new Map(
  SECTIONS.map((s) => [s.hotkey.toLowerCase(), s.id] as const),
);

/** True when focus is in a field where single-key shortcuts should be ignored. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  // Ignore while inside an open ⌘K palette (cmdk dialog).
  if (target.closest("[cmdk-root]")) return true;
  return false;
}

export function Rail() {
  const { scrollToId } = useUI();
  const [activeId, setActiveId] = useState<string>(SECTIONS[0]?.id ?? "hero");

  // Scroll-spy: light the section whose top is nearest the upper viewport.
  const ratiosRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const ratios = ratiosRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        // Choose the most-visible section; preserve spec order on ties.
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const section of SECTIONS) {
          const ratio = ratios.get(section.id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = section.id;
          }
        }
        if (bestId) setActiveId(bestId);
      },
      {
        // Bias toward the section occupying the upper portion of the viewport.
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.01, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const go = useCallback(
    (id: string) => {
      setActiveId(id);
      scrollToId(id);
    },
    [scrollToId],
  );

  // Global single-letter hotkeys.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.defaultPrevented) return;
      if (isTypingTarget(event.target)) return;

      const id = HOTKEY_TO_ID.get(event.key.toLowerCase());
      if (!id) return;

      event.preventDefault();
      go(id);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  return (
    <div
      aria-hidden={false}
      className="pointer-events-none fixed inset-0 z-40 hidden lg:block"
    >
      {/* Mirrors the content Container so the rail sits in the left gutter,
          anchored to the column's left edge — never overlapping sections. */}
      <div className="relative mx-auto flex h-full max-w-5xl items-center px-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Section navigation"
          className="pointer-events-auto absolute right-full top-1/2 mr-10 flex w-40 -translate-y-1/2 flex-col"
        >
          <ol className="flex flex-col gap-1 border-l border-border pl-4">
        {SECTIONS.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => go(section.id)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`${section.label} — press ${section.hotkey}`}
                title={`${section.label} (${section.hotkey})`}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-md py-1 font-mono text-[11px] leading-none tracking-tight transition-colors",
                  "focus-visible:outline-none",
                  isActive
                    ? "text-signal"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="tabular-nums">{section.index}</span>
                <span>{section.label}</span>
              </button>
            </li>
          );
        })}
          </ol>
        </nav>
      </div>
    </div>
  );
}

export default Rail;
