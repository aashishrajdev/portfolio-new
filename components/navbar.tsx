"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Container } from "@/components/ui/container";
import { KeyCap } from "@/components/key-cap";
import { useUI } from "@/components/providers/lenis-provider";
import {
  SearchCommand,
  setCommandPaletteOpen,
} from "@/components/command-palette";
import { cn } from "@/lib/utils";

/**
 * Full section map for the mobile menu — lists every section so small screens
 * (where the left Rail is hidden) still reach GitHub / Open Source / Writing.
 * "home" scrolls to the top; the rest map to their section ids.
 */
const MOBILE_LINKS = [
  { label: "home", id: "hero" },
  { label: "experience", id: "experience" },
  { label: "projects", id: "projects" },
  { label: "open source", id: "open-source" },
  { label: "writing", id: "writing" },
  { label: "contact", id: "contact" },
] as const;

/**
 * Minimal sticky top bar for the "Uptime" portfolio.
 *
 * - Left: monochrome wordmark, magnetic, scrolls to top of page.
 * - Center (md+): mono anchor buttons → scrollToId via useUI().
 * - Right: theme toggle + a visible ⌘K keycap (magnetic) that opens the
 *   command palette via setCommandPaletteOpen (command-palette.tsx store).
 * - Mobile: hamburger toggles a hairline-bordered panel of the same anchors.
 *
 * Monochrome throughout; the only signal-green is the hover underline on the
 * center anchors and the ⌘K glyph hint (status/affordance signal).
 */
export function Navbar() {
  const { scrollToId } = useUI();
  const [open, setOpen] = useState(false);

  function go(id: string) {
    if (id === "hero") {
      goTop();
      return;
    }
    scrollToId(id);
    setOpen(false);
  }

  function goTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <Container>
        <nav className="relative flex h-16 items-center justify-between">
          {/* Wordmark — pinned left with a little breathing room */}
          <div className="ml-1">
            <button
              type="button"
              onClick={goTop}
              className="group flex items-baseline gap-2 rounded-sm px-1 py-0.5 text-foreground focus-visible:outline-none"
              aria-label="Aashish Raj, back to top"
            >
              {/* "Aa" inherits the foreground, so it flips with the theme;
                  the full name stays available to screen readers. */}
              <span className="font-serif text-xl leading-none tracking-tight">
                Aa
                <span className="text-dot" aria-hidden="true">
                  .
                </span>
              </span>
            </button>
          </div>

          {/* Centered search — expands into the command palette in place. */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
            <SearchCommand />
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/30 md:hidden"
            >
              {open ? (
                <FiX className="h-4 w-4" aria-hidden />
              ) : (
                <FiMenu className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile panel */}
      <div
        className={cn(
          "overflow-hidden border-border transition-[max-height] duration-300 md:hidden",
          open ? "max-h-128 border-t" : "max-h-0",
        )}
      >
        <Container>
          <ul className="flex flex-col gap-1 py-4">
            {MOBILE_LINKS.map((link, i) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => go(link.id)}
                  className="flex min-h-11 w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left font-mono text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  <span className="text-[10px] tabular-nums text-muted-foreground/60">
                    {String(i).padStart(2, "0")}
                  </span>
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  setCommandPaletteOpen(true);
                  setOpen(false);
                }}
                className="mt-1 flex min-h-11 w-full items-center justify-between gap-3 rounded-sm border border-border px-3 py-2.5 text-left font-mono text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                command palette
                <KeyCap className="text-signal">Ctrl/⌘ + K</KeyCap>
              </button>
            </li>
          </ul>
        </Container>
      </div>
    </header>
  );
}

export default Navbar;
