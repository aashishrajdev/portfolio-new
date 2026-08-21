import { cn } from "@/lib/utils";

type StatusDotSize = "sm" | "md" | "lg";

interface StatusDotProps {
  /** Dot diameter. Defaults to "md". */
  size?: StatusDotSize;
  /**
   * Emit the pulsing halo (operational signal). Defaults to true. The halo is
   * auto-suppressed under prefers-reduced-motion.
   */
  pulse?: boolean;
  className?: string;
  /** Accessible status label (e.g. "operational"). */
  label?: string;
}

const sizes: Record<StatusDotSize, string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};

/**
 * Pulsing signal-green operational dot — the one place a fill of --signal is
 * allowed, as a live status indicator. A solid core sits over an animated
 * `animate-ping` halo; the halo disappears under reduced motion.
 */
export function StatusDot({
  size = "md",
  pulse = true,
  className,
  label,
}: StatusDotProps) {
  const dim = sizes[size];
  return (
    <span
      className={cn("relative inline-flex shrink-0", dim, className)}
      role={label ? "status" : undefined}
      aria-label={label}
    >
      {pulse ? (
        <span
          className="absolute inset-0 inline-flex animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden"
          aria-hidden
        />
      ) : null}
      <span
        className={cn("relative inline-flex rounded-full bg-signal", dim)}
        aria-hidden
      />
    </span>
  );
}
