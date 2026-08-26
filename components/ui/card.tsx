import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Element to render. Defaults to "div". */
  as?: ElementType;
}

/**
 * Marketing-grade bordered surface: rounded-2xl, hairline border, frosted
 * glass fill and a subtle hover border shift. Monochrome only, no shadow and
 * no glow.
 */
export function Card({ children, className, as }: CardProps) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        "frosted frosted-hover rounded-2xl border border-border p-6",
        "transition-colors duration-300 hover:border-foreground/20",
        className
      )}
    >
      {children}
    </Component>
  );
}
