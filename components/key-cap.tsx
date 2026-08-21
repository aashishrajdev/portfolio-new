import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KeyCapProps {
  children: ReactNode;
  className?: string;
}

/**
 * Small monospace keycap — e.g. `⌘ K`. Hairline 1px border, surface fill,
 * tabular mono glyphs. Monochrome only (no signal accent here).
 */
export function KeyCap({ children, className }: KeyCapProps) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 select-none items-center justify-center gap-0.5 rounded-sm border border-border bg-surface-2 px-1.5",
        "font-mono text-[10px] font-medium leading-none tracking-wider text-muted-foreground",
        className
      )}
    >
      {children}
    </kbd>
  );
}
