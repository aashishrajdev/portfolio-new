import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Element to render. Defaults to "div". */
  as?: ElementType;
}

/**
 * Centered content column. Caps width at the 5xl reading measure with
 * responsive horizontal gutters.
 */
export function Container({ children, className, as }: ContainerProps) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </Component>
  );
}
