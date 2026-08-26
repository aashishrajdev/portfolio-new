"use client";

import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ArrowRight, Copy, FileText, Moon, Search, Sun } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { toast } from "sonner";

import { useUI } from "@/components/providers/lenis-provider";

/* ---------------------------------------------------------------------------
   Tiny module store — lets ANY component (e.g. the hero's ⌘K hint) open the
   palette without prop-drilling or context. Backed by useSyncExternalStore so
   it is React-18/19 concurrent-safe and SSR-stable (snapshot is `false`).
--------------------------------------------------------------------------- */
let paletteOpen = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return paletteOpen;
}

function getServerSnapshot() {
  return false;
}

/** Imperatively set the palette open state from anywhere. */
export function setCommandPaletteOpen(open: boolean) {
  if (paletteOpen === open) return;
  // Rebuild the page index on the way open — this always runs inside a user
  // event (click / keydown), never during render, so DOM access is safe and
  // React state stays untouched.
  if (open) refreshSiteIndex();
  paletteOpen = open;
  emit();
}

/** Toggle the palette open/closed from anywhere. */
export function toggleCommandPalette() {
  setCommandPaletteOpen(!paletteOpen);
}

/** Subscribe to the shared palette open state (read-only). */
export function useCommandPaletteOpen(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ---------------------------------------------------------------------------
   Static data
--------------------------------------------------------------------------- */
type NavTarget = { id: string; index: string; label: string };

const NAV_TARGETS: NavTarget[] = [
  { id: "hero", index: "00", label: "Hero" },
  { id: "about", index: "01", label: "About" },
  { id: "experience", index: "02", label: "Experience" },
  { id: "projects", index: "03", label: "Projects" },
  { id: "open-source", index: "04", label: "Open Source" },
  { id: "writing", index: "05", label: "Writing" },
  { id: "contact", index: "06", label: "Contact" },
];

const EMAIL = "rajaashish.dev@gmail.com";
const GITHUB_URL = "https://github.com/aashishrajdev";
const LINKEDIN_URL = "https://www.linkedin.com/in/aashishraj-dev/";
const RESUME_URL = "https://github.com/aashishrajdev/Resume";

/* ---------------------------------------------------------------------------
   Site index — lets the palette find ANY text on the page, not just the
   predefined commands. Rebuilt each time the palette opens (a one-off ~1ms
   scan of the rendered sections), deduped, and capped. It lives at module
   level, outside React: matching reads a flat array, so typing never touches
   the DOM, and no component effect is needed to maintain it.
--------------------------------------------------------------------------- */
type SiteEntry = {
  key: string;
  sectionId: string;
  sectionLabel: string;
  text: string;
};

const INDEX_SELECTOR = "h1, h2, h3, p, li, dt, dd, blockquote";
const MAX_ENTRIES = 400;
const MAX_RESULTS = 12;

let siteEntries: SiteEntry[] = [];
const siteElements = new Map<string, Element>();

function refreshSiteIndex() {
  if (typeof document === "undefined") return;

  siteElements.clear();
  const labelById = new Map(NAV_TARGETS.map((t) => [t.id, t.label]));
  const entries: SiteEntry[] = [];
  const seen = new Set<string>();

  const sections = document.querySelectorAll<HTMLElement>("main section[id]");
  outer: for (const section of sections) {
    const sectionId = section.id;
    const sectionLabel = labelById.get(sectionId) ?? sectionId;

    for (const el of section.querySelectorAll(INDEX_SELECTOR)) {
      const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
      if (text.length < 3) continue;
      const dedupeKey = text.toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const key = `${sectionId}:${entries.length}`;
      siteElements.set(key, el);
      entries.push({ key, sectionId, sectionLabel, text });
      if (entries.length >= MAX_ENTRIES) break outer;
    }
  }
  siteEntries = entries;
}

/** Scroll a matched element into view and flash it so the eye lands on it. */
function revealElement(el: Element) {
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.animate(
    [
      { outline: "2px solid var(--signal)", outlineOffset: "6px" },
      { outline: "2px solid transparent", outlineOffset: "10px" },
    ],
    { duration: 1200, easing: "ease-out" },
  );
}

/* ---------------------------------------------------------------------------
   Item — one selectable row.
--------------------------------------------------------------------------- */
function PaletteItem({
  value,
  keywords,
  onSelect,
  icon,
  meta,
  children,
}: {
  value: string;
  keywords?: string[];
  onSelect: () => void;
  icon: ReactNode;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <Command.Item
      value={value}
      keywords={keywords}
      onSelect={onSelect}
      className={[
        "group relative flex cursor-default select-none items-center gap-2",
        "rounded-sm px-2 py-1.5 text-sm text-foreground outline-none",
        "data-[selected=true]:bg-foreground/10",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="flex size-4 shrink-0 items-center justify-center text-muted-foreground group-data-[selected=true]:text-signal"
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{children}</span>
      {meta ? (
        <span className="ml-auto font-mono text-[11px] tracking-widest text-muted-foreground/70">
          {meta}
        </span>
      ) : null}
      <ArrowRight
        aria-hidden
        className="size-3.5 shrink-0 text-signal opacity-0 transition-opacity group-data-[selected=true]:opacity-100"
      />
    </Command.Item>
  );
}

const GROUP_CLASS =
  "overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground";

/* ---------------------------------------------------------------------------
   PaletteSurface — the open panel. Mounted only while open, so the search
   query and cmdk's internal selection reset for free on close, with no state
   juggling in the parent.
--------------------------------------------------------------------------- */
function PaletteSurface() {
  const { scrollToId } = useUI();
  const { resolvedTheme, setTheme } = useTheme();
  const [search, setSearch] = useState("");

  const close = useCallback(() => setCommandPaletteOpen(false), []);

  const run = useCallback(
    (action: () => void) => {
      action();
      close();
    },
    [close],
  );

  const copyEmail = useCallback(() => {
    void navigator.clipboard
      ?.writeText(EMAIL)
      .then(() => toast.success("copied to clipboard", { description: EMAIL }))
      .catch(() => toast.error("couldn't copy to clipboard"));
  }, []);

  const openExternal = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // Deferred so a fast typist re-filters the site index at low priority while
  // the input itself stays perfectly responsive.
  const deferredSearch = useDeferredValue(search);
  const siteMatches = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: SiteEntry[] = [];
    for (const entry of siteEntries) {
      if (entry.text.toLowerCase().includes(q)) {
        out.push(entry);
        if (out.length >= MAX_RESULTS) break;
      }
    }
    return out;
  }, [deferredSearch]);

  return (
    <Command
      label="Command menu"
      loop
      className="frosted flex w-full flex-col overflow-hidden rounded-xl border border-border text-foreground"
      filter={(value, search, keywords) => {
        const haystack = `${value} ${(keywords ?? []).join(" ")}`.toLowerCase();
        return haystack.includes(search.toLowerCase()) ? 1 : 0;
      }}
    >
      <label className="relative flex w-full items-center border-b border-border">
        <span className="flex size-12 items-center justify-center">
          <Search className="size-4" aria-hidden />
        </span>
        <Command.Input
          autoFocus
          value={search}
          onValueChange={setSearch}
          placeholder="Find..."
          className="h-12 flex-1 bg-transparent text-sm text-foreground caret-signal outline-none placeholder:text-muted-foreground focus-visible:[box-shadow:none]"
        />
        <span className="flex size-12 items-center justify-center pr-1">
          <kbd className="flex items-center justify-center rounded-sm border border-border px-1 py-0.5 text-xs tracking-tighter">
            Esc
          </kbd>
        </span>
      </label>

      <Command.List
        data-lenis-prevent
        className="max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden overscroll-contain p-1"
      >
        <Command.Empty className="px-3 py-8 text-center text-xs text-muted-foreground">
          no matching commands.
        </Command.Empty>

        <Command.Group heading="Navigation" className={GROUP_CLASS}>
          {NAV_TARGETS.map((t) => (
            <PaletteItem
              key={t.id}
              value={`${t.label} ${t.index}`}
              keywords={[t.id, t.index]}
              onSelect={() => run(() => scrollToId(t.id))}
              icon={<ArrowRight className="size-4" />}
              meta={t.index}
            >
              {t.label}
            </PaletteItem>
          ))}
        </Command.Group>

        <Command.Separator className="-mx-1 my-1 h-px bg-border" />

        <Command.Group heading="Actions" className={GROUP_CLASS}>
          <PaletteItem
            value="copy email"
            keywords={["mail", "contact", EMAIL]}
            onSelect={() => run(copyEmail)}
            icon={<Copy className="size-4" />}
          >
            Copy email
          </PaletteItem>

          <PaletteItem
            value="github"
            keywords={["code", "repos", "source"]}
            onSelect={() => run(() => openExternal(GITHUB_URL))}
            icon={<FiGithub className="size-4" />}
          >
            Open GitHub
          </PaletteItem>

          <PaletteItem
            value="linkedin"
            keywords={["social", "work"]}
            onSelect={() => run(() => openExternal(LINKEDIN_URL))}
            icon={<FiLinkedin className="size-4" />}
          >
            Open LinkedIn
          </PaletteItem>

          <PaletteItem
            value="resume"
            keywords={["cv", "hire"]}
            onSelect={() => run(() => openExternal(RESUME_URL))}
            icon={<FileText className="size-4" />}
          >
            Open résumé
          </PaletteItem>

          <PaletteItem
            value="toggle theme"
            keywords={["dark", "light", "appearance"]}
            onSelect={() => run(toggleTheme)}
            icon={
              resolvedTheme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )
            }
            meta={resolvedTheme === "dark" ? "dark" : "light"}
          >
            Toggle theme
          </PaletteItem>
        </Command.Group>

        {siteMatches.length > 0 ? (
          <>
            <Command.Separator className="-mx-1 my-1 h-px bg-border" />
            <Command.Group heading="On this page" className={GROUP_CLASS}>
              {siteMatches.map((entry) => (
                <PaletteItem
                  key={entry.key}
                  value={`${entry.text} ${entry.key}`}
                  onSelect={() =>
                    run(() => {
                      const el = siteElements.get(entry.key);
                      if (el) revealElement(el);
                      else scrollToId(entry.sectionId);
                    })
                  }
                  icon={<Search className="size-3.5" />}
                  meta={entry.sectionLabel.toLowerCase()}
                >
                  {entry.text.length > 70
                    ? `${entry.text.slice(0, 70)}…`
                    : entry.text}
                </PaletteItem>
              ))}
            </Command.Group>
          </>
        ) : null}
      </Command.List>
    </Command>
  );
}

/* ---------------------------------------------------------------------------
   SearchCommand

   A collapsed search affordance that morphs into the command palette in place,
   rather than a separate dialog opening over the page. Closed, it is a 192px
   pill; open, a 384px panel anchored near the same origin, so the expansion
   reads as one element growing.

   Owns the global ⌘K / Ctrl+K listener and closes on Escape or outside click.
--------------------------------------------------------------------------- */
export function SearchCommand() {
  const open = useCommandPaletteOpen();
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Global ⌘K / Ctrl+K listener to toggle the palette.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close when the pointer lands outside the panel.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setCommandPaletteOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative z-[99]">
      {/* Collapsed trigger. Kept mounted so the navbar keeps its width. */}
      <button
        type="button"
        onClick={() => setCommandPaletteOpen(true)}
        aria-label="Open command palette"
        aria-expanded={open}
        className="group relative flex h-8 w-[192px] items-center transition-opacity duration-150"
        style={open ? { opacity: 0, pointerEvents: "none" } : undefined}
      >
        <span className="absolute inset-0 rounded-md border border-border transition-colors group-hover:border-foreground/20" />
        <span className="flex size-8 items-center justify-center">
          <Search className="size-4 opacity-50" aria-hidden />
        </span>
        <span className="flex flex-1 items-center opacity-40">
          <span className="text-left text-sm">Find...</span>
        </span>
        <span className="flex size-8 items-center justify-center">
          <kbd className="flex size-5 items-center justify-center rounded-sm border border-border text-[10px]">
            K
          </kbd>
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.9, y: -6, filter: "blur(6px)" }
            }
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.96,
                    y: -4,
                    filter: "blur(4px)",
                    transition: { duration: 0.14, ease: "easeIn" },
                  }
            }
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0.15, originY: 0 }}
            className="absolute -left-4 -top-2 w-96"
          >
            <PaletteSurface />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
