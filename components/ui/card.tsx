import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Element to render. Defaults to "div". */
  as?: ElementType;
}

/**
 * Marketing-grade bordered surface: rounded-2xl, hairline border, faint surface
 * fill and a subtle hover border shift. Monochrome only — no shadow, no glow.
 */
export function Card({ children, className, as }: CardProps) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        "rounded-2xl border border-border bg-surface/40 p-6",
        "transition-colors duration-300 hover:border-foreground/20",
        className
      )}
    >
      {children}
    </Component>
  );
}
