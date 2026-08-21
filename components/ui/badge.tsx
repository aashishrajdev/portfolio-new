import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Mono pill for tech tags / register labels. Monochrome, hairline-bordered,
 * muted text. No fill so it reads as a UI chip, not a marketing tag.
 */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1",
        "font-mono text-xs tracking-tight text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
