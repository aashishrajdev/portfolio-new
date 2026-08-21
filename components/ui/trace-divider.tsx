"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TraceDividerProps {
  className?: string;
  /**
   * Number of trace "span" nodes drawn along the line (2 or 3 read best).
   * Clamped to 2–3.
   */
  nodes?: 2 | 3;
  /** Accessible label override; defaults to a generic decorative role. */
  "aria-label"?: string;
}

/**
 * TraceDivider — a thin full-width "distributed trace" divider.
 *
 * A horizontal hairline (the base track) with 2–3 small node circles spaced
 * along it. When scrolled into view, a `--signal` stroke draws along the path
 * via a stroke-dashoffset animation (framer `whileInView`, fires once). The
 * node rings light up in `--signal` in sequence as the trace "arrives".
 *
 * Under `prefers-reduced-motion`, no drawing happens: the signal path renders
 * statically at a low opacity (a faint complete line) and the nodes are shown
 * in their resting hairline state.
 *
 * Strictly monochrome + the single signal-green: the base line/nodes use
 * `currentColor` (foreground), the animated trace + active node rings use
 * `var(--signal)`. No fills, glow, or shadows.
 */
export function TraceDivider({
  className,
  nodes = 3,
  "aria-label": ariaLabel,
}: TraceDividerProps) {
  const shouldReduceMotion = useReducedMotion();

  // viewBox coordinate space: wide and short so it reads as lots of horizontal
  // space. The path itself is 1px tall, vertically centered.
  const VB_W = 1000;
  const VB_H = 24;
  const cy = VB_H / 2;
  const startX = 0;
  const endX = VB_W;
  const lineLength = endX - startX;

  const count = nodes === 2 ? 2 : 3;
  // Evenly distribute nodes between ~18% and ~82% of the width so they sit
  // inside the visible track rather than at the very edges.
  const nodeXs =
    count === 2
      ? [VB_W * 0.34, VB_W * 0.66]
      : [VB_W * 0.22, VB_W * 0.5, VB_W * 0.78];

  return (
    <div
      className={cn(
        "pointer-events-none w-full select-none text-foreground/20",
        className,
      )}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? "separator" : undefined}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height={VB_H}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base hairline track — faint foreground, always present. */}
        <line
          x1={startX}
          y1={cy}
          x2={endX}
          y2={cy}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />

        {/* Animated signal trace drawing along the track. */}
        <motion.line
          x1={startX}
          y1={cy}
          x2={endX}
          y2={cy}
          stroke="var(--signal)"
          strokeWidth={1}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: lineLength,
          }}
          initial={
            shouldReduceMotion
              ? { strokeDashoffset: 0, opacity: 0.35 }
              : { strokeDashoffset: lineLength, opacity: 1 }
          }
          whileInView={
            shouldReduceMotion
              ? { strokeDashoffset: 0, opacity: 0.35 }
              : { strokeDashoffset: 0, opacity: 1 }
          }
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: shouldReduceMotion ? 0 : 1.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* Trace span nodes. */}
        {nodeXs.map((x, i) => {
          // Stagger node ring activation roughly in time with the draw front
          // reaching each node (front travels left -> right).
          const arrive = shouldReduceMotion ? 0 : (x / VB_W) * 1.1;
          return (
            <g key={i}>
              {/* Resting ring — faint foreground hairline. */}
              <circle
                cx={x}
                cy={cy}
                r={3}
                stroke="currentColor"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
              {/* Signal ring — lights up as the trace arrives. */}
              <motion.circle
                cx={x}
                cy={cy}
                r={3}
                stroke="var(--signal)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                initial={
                  shouldReduceMotion ? { opacity: 0.5 } : { opacity: 0 }
                }
                whileInView={{ opacity: shouldReduceMotion ? 0.5 : 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: arrive,
                  ease: "easeOut",
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default TraceDivider;
