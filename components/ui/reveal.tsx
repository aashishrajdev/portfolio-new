"use client";

import type { ElementType, ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type MotionTag = "div" | "p" | "li" | "span" | "section" | "ul";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger / sequencing delay in seconds. */
  delay?: number;
  /** Motion element to render. Defaults to "div". */
  as?: ElementType;
}

function isMotionTag(as?: ElementType): as is MotionTag {
  return (
    as === "div" ||
    as === "p" ||
    as === "li" ||
    as === "span" ||
    as === "section" ||
    as === "ul"
  );
}

/**
 * In-view reveal: subtle fade + slide-up, fires once. Respects reduced motion
 * (falls back to a plain fade with no transform). Concrete motion elements are
 * rendered directly so no component is created during render.
 */
export function Reveal({ children, className, delay = 0, as }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
    },
  };

  const sharedProps = {
    className: cn(className),
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, margin: "-80px" },
    variants,
  };

  const tag: MotionTag = isMotionTag(as) ? as : "div";

  switch (tag) {
    case "p":
      return <motion.p {...sharedProps}>{children}</motion.p>;
    case "li":
      return <motion.li {...sharedProps}>{children}</motion.li>;
    case "span":
      return <motion.span {...sharedProps}>{children}</motion.span>;
    case "section":
      return <motion.section {...sharedProps}>{children}</motion.section>;
    case "ul":
      return <motion.ul {...sharedProps}>{children}</motion.ul>;
    case "div":
    default:
      return <motion.div {...sharedProps}>{children}</motion.div>;
  }
}
