"use client";

import NumberFlow, { type Format } from "@number-flow/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CounterProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "prefix"> {
  /** The numeric value to render. */
  value: number;
  /** Static text rendered before the number. */
  prefix?: string;
  /** Static text rendered after the number (e.g. "yrs", "+"). */
  suffix?: string;
  /**
   * Pad the integer part to at least this many digits — used for clock
   * segments ("07", "09"). Maps to Intl `minimumIntegerDigits`.
   */
  padStart?: number;
  /** Locale(s) for number formatting. */
  locales?: Intl.LocalesArgument;
  /** Additional Intl.NumberFormat options merged over the defaults. */
  format?: Format;
  /**
   * Animation direction hint. Useful for clocks that should always roll
   * upward even when the value wraps (59 -> 0).
   */
  trend?: number | ((oldValue: number, value: number) => number);
  /** Class applied to the underlying NumberFlow element. */
  className?: string;
  /** Isolate animation timing from sibling NumberFlows. */
  isolate?: boolean;
  /** Hint `will-change` to the browser for smoother animation. */
  willChange?: boolean;
}

/**
 * Jitter-free animated number built on @number-flow/react.
 * Always tabular so digits never shift horizontally.
 */
export function Counter({
  value,
  prefix,
  suffix,
  padStart,
  locales,
  format,
  trend,
  className,
  isolate,
  willChange,
  ...rest
}: CounterProps) {
  const resolvedFormat = React.useMemo<Format>(() => {
    const base: Format = { useGrouping: false, ...format };
    if (padStart != null) {
      base.minimumIntegerDigits = padStart;
    }
    return base;
  }, [format, padStart]);

  return (
    <NumberFlow
      value={value}
      prefix={prefix}
      suffix={suffix}
      locales={locales}
      format={resolvedFormat}
      trend={trend}
      isolate={isolate}
      willChange={willChange}
      className={cn("tabular-nums", className)}
      {...rest}
    />
  );
}

function getISTParts(date: Date): { h: number; m: number; s: number } {
  // Intl gives us the wall-clock time in Asia/Kolkata regardless of the
  // host timezone, so the clock is correct everywhere.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes): number => {
    const raw = parts.find((p) => p.type === type)?.value ?? "0";
    const n = Number.parseInt(raw, 10);
    return Number.isNaN(n) ? 0 : n;
  };

  // "24" can appear at midnight in some environments — normalise to 0.
  const h = get("hour") % 24;
  return { h, m: get("minute"), s: get("second") };
}

export interface ClockProps {
  /** Class applied to the wrapper element. */
  className?: string;
  /** Class applied to the ":" separators. */
  separatorClassName?: string;
}

/**
 * Subscribe to a shared 1Hz tick. Returns the current epoch-second on the
 * client and `null` on the server / first client snapshot so hydration is
 * deterministic — no effect-setState, no mismatch.
 */
function useSecondTick(): number | null {
  const subscribe = React.useCallback((onChange: () => void) => {
    const id = window.setInterval(onChange, 1000);
    return () => window.clearInterval(id);
  }, []);

  const getSnapshot = React.useCallback(
    () => Math.floor(Date.now() / 1000),
    [],
  );
  const getServerSnapshot = React.useCallback(() => null, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Live IST (Asia/Kolkata) clock rendered as HH:MM:SS with NumberFlow
 * segments. Hydration-safe: renders a static placeholder on the server and
 * for the first client paint, then begins ticking after mount.
 */
export function Clock({ className, separatorClassName }: ClockProps) {
  const tick = useSecondTick();
  const mounted = tick !== null;
  const time = React.useMemo(
    () => getISTParts(new Date()),
    // Recompute once per second; `tick` is the cache key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],
  );

  const sep = (
    <span aria-hidden className={cn("opacity-60", separatorClassName)}>
      :
    </span>
  );

  // Roll segments upward, even across the 59 -> 0 wrap, so the motion always
  // reads as "advancing".
  const upward = () => 1;

  return (
    <span
      className={cn("font-mono tabular-nums inline-flex items-baseline", className)}
      aria-label="Current time in India Standard Time"
      suppressHydrationWarning
    >
      {mounted ? (
        <>
          <Counter value={time.h} padStart={2} trend={upward} isolate />
          {sep}
          <Counter value={time.m} padStart={2} trend={upward} isolate />
          {sep}
          <Counter value={time.s} padStart={2} trend={upward} isolate />
        </>
      ) : (
        <span className="tabular-nums">00:00:00</span>
      )}
    </span>
  );
}

export default Counter;
