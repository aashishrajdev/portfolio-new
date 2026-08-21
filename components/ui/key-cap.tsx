import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KeyCapProps {
  /** Key glyph(s), e.g. "⌘", "K", "Esc". */
  children: ReactNode;
  className?: string;
}

/**
 * Small mono keycap pill — used for ⌘K hints, hotkey labels and the rail's
 * first-letter shortcuts. Hairline-bordered, surface-2 fill, mono text.
 */
export function KeyCap({ children, className }: KeyCapProps) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-border bg-surface-2 px-1.5",
        "font-mono text-[0.6875rem] leading-none text-muted-foreground tabular-nums",
        className
      )}
    >
      {children}
    </kbd>
  );
}
