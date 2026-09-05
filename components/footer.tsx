"use client";

import { useEffect, useState } from "react";
import NumberFlow, { type Format } from "@number-flow/react";
import { FiCode } from "react-icons/fi";
import { Button } from "@/components/ui/button";

/** Returns IST (UTC+5:30) hours/minutes/seconds, recomputed each tick. */
function getISTParts(): { h: number; m: number; s: number } {
  const now = new Date();
  // IST = UTC + 5h30m. Derive from UTC epoch to be timezone-agnostic.
  const istMs = now.getTime() + 5.5 * 60 * 60 * 1000;
  const ist = new Date(istMs);
  return {
    h: ist.getUTCHours(),
    m: ist.getUTCMinutes(),
    s: ist.getUTCSeconds(),
  };
}

/** Two-digit format spec consumed by NumberFlow. */
const PAD2: Format = { minimumIntegerDigits: 2 };

/**
 * Live IST timestamp rendered in mono with jitter-free tabular numerals via
 * NumberFlow. Renders nothing until mounted so SSR and client markup agree.
 */
function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [{ h, m, s }, setTime] = useState(() => getISTParts());

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
      setTime(getISTParts());
    });
    const id = setInterval(() => setTime(getISTParts()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  return (
    <span
      className="tabular-nums inline-flex items-center font-mono text-xs text-foreground"
      aria-label="Current time in IST"
    >
      {mounted ? (
        <>
          <NumberFlow value={h} format={PAD2} />
          <span aria-hidden>:</span>
          <NumberFlow value={m} format={PAD2} />
          <span aria-hidden>:</span>
          <NumberFlow value={s} format={PAD2} />
        </>
      ) : (
        <span>--:--:--</span>
      )}
      <span className="ml-1.5 text-muted-foreground">IST</span>
    </span>
  );
}

/** Subtle vertical hairline used to separate meta items on wide screens. */
function MetaSep() {
  return (
    <span aria-hidden className="hidden h-3 w-px bg-border sm:inline-block" />
  );
}

/**
 * Signature strip footer for the "Uptime" portfolio.
 *
 * Left: wordmark + copyright, a live IST timestamp, and the build credit.
 * Right: monochrome social links + a "view source" link.
 */
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:gap-4">
        {/* Left — signature + live signal */}
        <div className="flex flex-col gap-3 font-mono text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <span className="flex items-center gap-3">
            <span className="text-foreground">aashish raj</span>
            <span className="text-muted-foreground">© 2026</span>
          </span>
          <MetaSep />
          <LiveClock />
          <MetaSep />
          <span>built with next.js + tailwind</span>
        </div>

        {/* Right — view source */}
        <div className="flex items-center gap-2">
          <Button
            href="https://github.com/aashishrajdev/portfolio-new"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="xs"
            className="ml-1 gap-1.5 rounded-md font-mono font-normal text-muted-foreground hover:text-foreground"
          >
            <FiCode className="h-3.5 w-3.5" aria-hidden />
            view source
          </Button>
        </div>
      </div>
    </footer>
  );
}
