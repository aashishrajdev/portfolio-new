"use client";

import {
  useCallback,
  useRef,
  useSyncExternalStore,
  type ElementType,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/** Concrete motion tags we allow, mirroring Reveal's render strategy. */
type MotionTag = "div" | "span" | "a" | "button" | "li";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /**
   * How strongly the element follows the cursor (fraction of the offset from
   * center). ~0.3 = subtle pull. Clamped implicitly by element size.
   */
  strength?: number;
  /** Motion element to render. Defaults to "div". */
  as?: ElementType;
}

const SPRING = { stiffness: 280, damping: 30, mass: 0.5 } as const;

function noopSubscribe() {
  return () => {};
}

/** True only for fine-pointer, non-touch, motion-allowing devices. */
function supportsMagnetic(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  return !coarse && !touch;
}

function isMotionTag(as?: ElementType): as is MotionTag {
  return (
    as === "div" ||
    as === "span" ||
    as === "a" ||
    as === "button" ||
    as === "li"
  );
}

/**
 * Wraps children and translates them toward the pointer while hovered, using a
 * motion spring, resetting to origin on leave.
 *
 * Renders a plain (non-magnetic) element under `prefers-reduced-motion`, on
 * touch / coarse-pointer devices, or before hydration — so there's never a
 * hydration mismatch and the effect is purely progressive enhancement.
 */
export function Magnetic({
  children,
  className,
  strength = 0.3,
  as,
}: MagneticProps) {
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // SSR snapshot is `false` (plain element), then re-checks on hydration —
  // matching the SignalCursor approach, so markup is stable across hydration.
  const pointerOk = useSyncExternalStore(
    noopSubscribe,
    supportsMagnetic,
    () => false,
  );

  const enabled = pointerOk && !shouldReduceMotion;

  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const handleMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      x.set(relX * strength);
      y.set(relY * strength);
    },
    [strength, x, y],
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const tag: MotionTag = isMotionTag(as) ? as : "div";

  // Plain pass-through when magnetism is disabled: still render the same tag so
  // styling/layout is identical, just without motion/handlers.
  if (!enabled) {
    const sharedClass = cn("inline-flex", className);
    switch (tag) {
      case "span":
        return <span className={sharedClass}>{children}</span>;
      case "a":
        return <a className={sharedClass}>{children}</a>;
      case "button":
        return <button className={sharedClass}>{children}</button>;
      case "li":
        return <li className={sharedClass}>{children}</li>;
      case "div":
      default:
        return <div className={sharedClass}>{children}</div>;
    }
  }

  const sharedProps = {
    ref: ref as never,
    className: cn("inline-flex", className),
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    style: { x, y },
  };

  switch (tag) {
    case "span":
      return <motion.span {...sharedProps}>{children}</motion.span>;
    case "a":
      return <motion.a {...sharedProps}>{children}</motion.a>;
    case "button":
      return <motion.button {...sharedProps}>{children}</motion.button>;
    case "li":
      return <motion.li {...sharedProps}>{children}</motion.li>;
    case "div":
    default:
      return <motion.div {...sharedProps}>{children}</motion.div>;
  }
}

export default Magnetic;
