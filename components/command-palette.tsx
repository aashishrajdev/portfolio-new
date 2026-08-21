"use client";

import { Command } from "cmdk";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  FiArrowRight,
  FiCopy,
  FiFileText,
  FiGithub,
  FiLinkedin,
  FiMonitor,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { toast } from "sonner";

import { useUI } from "@/components/providers/lenis-provider";

/* ---------------------------------------------------------------------------
   Tiny module store — lets ANY component (e.g. the navbar ⌘K button) open the
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
   Item — shared row layout (mono, hairline, signal accent on selection).
--------------------------------------------------------------------------- */
function PaletteItem({
  value,
  keywords,
  onSelect,
  icon,
  children,
  meta,
}: {
  value: string;
  keywords?: string[];
  onSelect: () => void;
  icon: ReactNode;
  children: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <Command.Item
      value={value}
      keywords={keywords}
      onSelect={onSelect}
      className={[
        "group flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5",
        "text-sm text-muted-foreground",
        "border border-transparent",
        "data-[selected=true]:border-border",
        "data-[selected=true]:bg-surface-2",
        "data-[selected=true]:text-foreground",
        "aria-disabled:pointer-events-none aria-disabled:opacity-40",
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
        <span className="font-mono text-[11px] tracking-wide text-muted-foreground/70">
          {meta}
        </span>
      ) : null}
      <FiArrowRight
        aria-hidden
        className="size-3.5 shrink-0 text-signal opacity-0 transition-opacity group-data-[selected=true]:opacity-100"
      />
    </Command.Item>
  );
}

/* ---------------------------------------------------------------------------
   CommandPalette
--------------------------------------------------------------------------- */
export function CommandPalette() {
  const open = useCommandPaletteOpen();
  const { scrollToId, cursorEnabled, setCursorEnabled } = useUI();
  const { resolvedTheme, setTheme } = useTheme();

  // Global ⌘K / Ctrl+K listener to toggle the palette.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = useCallback(() => setCommandPaletteOpen(false), []);

  const run = useCallback(
    (action: () => void) => {
      action();
      close();
    },
    [close]
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

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setCommandPaletteOpen}
      label="Command menu"
      loop
      overlayClassName="fixed inset-0 z-[100] bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0"
      contentClassName={[
        "panel fixed left-1/2 top-[18%] z-[101] w-[calc(100vw-2rem)] max-w-xl",
        "-translate-x-1/2 overflow-hidden bg-surface p-0",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
      ].join(" ")}
    >
      <Command
        className="flex flex-col"
        filter={(value, search, keywords) => {
          const haystack = `${value} ${(keywords ?? []).join(" ")}`.toLowerCase();
          return haystack.includes(search.toLowerCase()) ? 1 : 0;
        }}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <span
            aria-hidden
            className="font-mono text-xs text-signal"
            title="command menu"
          >
            &gt;_
          </span>
          <Command.Input
            autoFocus
            placeholder="type a command or search…"
            className="h-12 w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[50vh] overflow-y-auto overscroll-contain p-2">
          <Command.Empty className="px-3 py-8 text-center font-mono text-xs text-muted-foreground">
            no matching commands.
          </Command.Empty>

          <Command.Group
            heading="Navigation"
            className="px-1 pb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {NAV_TARGETS.map((t) => (
              <PaletteItem
                key={t.id}
                value={`go to ${t.label} ${t.id}`}
                keywords={[t.label, t.id, "jump", "section", "navigate"]}
                onSelect={() => run(() => scrollToId(t.id))}
                icon={
                  <span className="font-mono text-[11px] tabular-nums">
                    {t.index}
                  </span>
                }
                meta="jump"
              >
                {t.label}
              </PaletteItem>
            ))}
          </Command.Group>

          <Command.Separator className="my-2 h-px bg-border" />

          <Command.Group
            heading="Actions"
            className="px-1 pb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <PaletteItem
              value="copy email address"
              keywords={["email", "mail", "contact", "clipboard", EMAIL]}
              onSelect={() => run(copyEmail)}
              icon={<FiCopy className="size-4" />}
              meta={EMAIL}
            >
              Copy email
            </PaletteItem>

            <PaletteItem
              value="open github profile"
              keywords={["github", "code", "repos", "source", "aashishrajdev"]}
              onSelect={() => run(() => openExternal(GITHUB_URL))}
              icon={<FiGithub className="size-4" />}
              meta="↗"
            >
              Open GitHub
            </PaletteItem>

            <PaletteItem
              value="open linkedin profile"
              keywords={["linkedin", "work", "professional", "social"]}
              onSelect={() => run(() => openExternal(LINKEDIN_URL))}
              icon={<FiLinkedin className="size-4" />}
              meta="↗"
            >
              Open LinkedIn
            </PaletteItem>

            <PaletteItem
              value="download resume cv"
              keywords={["resume", "cv", "download", "pdf", "hire"]}
              onSelect={() => run(() => openExternal(RESUME_URL))}
              icon={<FiFileText className="size-4" />}
              meta="↗"
            >
              Download résumé
            </PaletteItem>

            <PaletteItem
              value="toggle theme dark light"
              keywords={["theme", "dark", "light", "mode", "appearance"]}
              onSelect={() => run(toggleTheme)}
              icon={
                resolvedTheme === "dark" ? (
                  <FiSun className="size-4" />
                ) : (
                  <FiMoon className="size-4" />
                )
              }
              meta={resolvedTheme === "dark" ? "→ light" : "→ dark"}
            >
              Toggle theme
            </PaletteItem>

            <PaletteItem
              value="toggle signal cursor"
              keywords={["cursor", "signal", "dot", "pointer", "motion"]}
              onSelect={() => run(() => setCursorEnabled(!cursorEnabled))}
              icon={<FiMonitor className="size-4" />}
              meta={cursorEnabled ? "on" : "off"}
            >
              Toggle signal cursor
            </PaletteItem>
          </Command.Group>
        </Command.List>

        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2.5 font-mono text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-signal" aria-hidden />
            uptime · command menu
          </span>
          <span className="hidden items-center gap-3 sm:flex">
            <span>
              <kbd className="rounded border border-border px-1 py-px">↑↓</kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="rounded border border-border px-1 py-px">↵</kbd>{" "}
              select
            </span>
          </span>
        </div>
      </Command>
    </Command.Dialog>
  );
}

export default CommandPalette;
