import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/ui/status-dot";

interface PanelProps {
  children: ReactNode;
  className?: string;
  /** Element to render. Defaults to "div". */
  as?: ElementType;
  /**
   * Optional mono label shown in a hairline-separated title bar. Reads as a
   * terminal/dashboard module header.
   */
  title?: ReactNode;
  /**
   * Show a pulsing signal status dot in the title bar. Defaults to false.
   * Ignored when `title` is absent.
   */
  status?: boolean;
  /** Optional node rendered at the right edge of the title bar (e.g. a clock). */
  action?: ReactNode;
  /** Class applied to the body wrapper (padding lives here, not on the frame). */
  bodyClassName?: string;
}

/**
 * Dashboard/terminal module surface — the `.panel` look (rounded-md, hairline
 * border, surface fill) so it reads as UI rather than a marketing card.
 * Optional title bar carries a mono label, a live status dot and an action slot.
 */
export function Panel({
  children,
  className,
  as,
  title,
  status = false,
  action,
  bodyClassName,
}: PanelProps) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        "frosted overflow-hidden rounded-md border border-border",
        className
      )}
    >
      {title || action ? (
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            {status ? <StatusDot size="sm" label="operational" /> : null}
            {title ? (
              <span className="truncate font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {title}
              </span>
            ) : null}
          </div>
          {action ? (
            <div className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
              {action}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </Component>
  );
}
