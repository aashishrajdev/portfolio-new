import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

interface SectionProps {
  /** Anchor id used for rail / nav smooth-scroll (e.g. "about"). */
  id?: string;
  children: ReactNode;
  className?: string;
  /** Optional class applied to the inner Container. */
  containerClassName?: string;
  /**
   * Mono section index ("00"–"10"). Rendered as a small uppercase mono label
   * above the optional heading — the dashboard "register" tag for the section.
   */
  index?: string;
  /**
   * Optional serif display heading. Pairs with `index`; rendered as an
   * oversized Instrument-Serif title. Pass a string or richer node.
   */
  heading?: ReactNode;
  /** Render the Container wrapper. Defaults to true. */
  contained?: boolean;
}

/**
 * Semantic section with generous vertical rhythm and scroll offset for the
 * sticky navbar. Optionally renders a mono index + serif numeral heading slot.
 */
export function Section({
  id,
  children,
  className,
  containerClassName,
  index,
  heading,
  contained = true,
}: SectionProps) {
  const header =
    index || heading ? (
      <header className="mb-8 flex flex-col gap-3 md:mb-10">
        {index ? (
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
            {index}
          </span>
        ) : null}
        {heading ? (
          <h2 className="font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
            {heading}
          </h2>
        ) : null}
      </header>
    ) : null;

  const body = (
    <>
      {header}
      {children}
    </>
  );

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-14 md:py-20",
        // Rendering is skipped while the section is far off-screen; the
        // 700px estimate is only used before first render, then the real
        // measured size is remembered (the `auto` keyword).
        "[contain-intrinsic-size:auto_700px] [content-visibility:auto]",
        className,
      )}
    >
      {contained ? (
        <Container className={containerClassName}>{body}</Container>
      ) : (
        body
      )}
    </section>
  );
}
