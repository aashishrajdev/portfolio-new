import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeadingProps {
  /**
   * Mono section index ("00"–"10"). Rendered before the eyebrow in --signal as
   * the section register tag.
   */
  index?: string;
  /** Small uppercase mono eyebrow above the heading. */
  eyebrow?: string;
  heading: ReactNode;
  /** Optional supporting paragraph below the heading. */
  description?: ReactNode;
  /** Center-align the block (default left). */
  centered?: boolean;
  className?: string;
}

/**
 * Standard section header: mono eyebrow (with optional signal-green index) +
 * serif heading + muted description, revealed in view.
 */
export function SectionHeading({
  index,
  eyebrow,
  heading,
  description,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
        className
      )}
    >
      {index || eyebrow ? (
        <span
          className={cn(
            "flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]",
            centered && "justify-center"
          )}
        >
          {index ? (
            <span className="text-signal tabular-nums">{index}</span>
          ) : null}
          {eyebrow ? (
            <span className="text-muted-foreground">{eyebrow}</span>
          ) : null}
        </span>
      ) : null}
      <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
        {heading}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
