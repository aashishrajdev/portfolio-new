"use client";

import * as React from "react";

/**
 * Preloader — a full-page cover that reveals the site in one move.
 *
 * Styled after the classic studio-site loader: a rolling odometer percentage
 * in the corner, a hairline progress bar across the middle, and — at 100% —
 * the whole cover wiping up off the page, which has finished its entrance
 * underneath and lands fully settled.
 *
 * The percentage is honest-ish: it eases toward ~92% on a clock while the
 * page's real readiness signals (fonts, the hero portrait, window load) are
 * pending, and only runs out to 100% when they have all resolved. Each signal
 * is individually capped, so a slow resource can delay the reveal but never
 * wedge it.
 */

/** The one asset the first view cannot appear without. */
const HERO_STILL = "/hero/boy-still-dark.png";

/** Hard ceiling on how long readiness may hold the cover, ms. */
const MAX_HOLD = 3200;
/** Minimum time on screen so a warm-cache load does not strobe, ms. */
const MIN_HOLD = 700;
/** Cover wipe duration, ms. Mirrored by the transition class below. */
const WIPE_MS = 750;

const withTimeout = (p: Promise<unknown>, ms: number) =>
  Promise.race([p.catch(() => {}), new Promise((r) => setTimeout(r, ms))]);

/** One rolling digit: a 0-9 column translated to the active digit. */
function Digit({ value, height }: { value: number; height: string }) {
  return (
    <span
      aria-hidden
      className="inline-block overflow-hidden align-top"
      style={{ height, lineHeight: height }}
    >
      <span
        className="block transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none"
        style={{ transform: `translateY(calc(-${value} * ${height}))` }}
      >
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d} className="block" style={{ height, lineHeight: height }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Preloader() {
  const [progress, setProgress] = React.useState(0);
  const [wiping, setWiping] = React.useState(false);
  const [gone, setGone] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    let ready = false;

    const fonts = "fonts" in document ? document.fonts.ready : Promise.resolve();
    const still = new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => void img.decode().catch(() => {}).finally(resolve);
      img.onerror = () => resolve();
      img.src = HERO_STILL;
    });
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true }),
          );

    const started = performance.now();
    void Promise.all([
      withTimeout(fonts, MAX_HOLD),
      withTimeout(still, MAX_HOLD),
      withTimeout(loaded, MAX_HOLD),
    ]).then(() => {
      ready = true;
    });

    // Progress engine: chase a ceiling that sits below 100 until readiness
    // lands, then release. The chase constant makes the tail ease naturally.
    let value = 0;
    let raf = 0;
    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - started;
      const ramp = Math.min(92, (elapsed / 1800) * 92);
      const target = ready && elapsed >= MIN_HOLD ? 100.4 : ramp;
      value += (target - value) * 0.085;
      const shown = Math.min(100, Math.floor(value));
      setProgress(shown);
      if (shown >= 100) {
        setWiping(true);
        window.setTimeout(() => {
          if (!cancelled) setGone(true);
        }, WIPE_MS + 80);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  if (gone) return null;

  const digits = [
    Math.floor(progress / 100) % 10,
    Math.floor(progress / 10) % 10,
    progress % 10,
  ];

  return (
    <div
      aria-hidden
      className={
        "fixed inset-0 z-[100] bg-background " +
        "transition-transform duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)] " +
        "motion-reduce:transition-opacity motion-reduce:duration-300 " +
        (wiping
          ? "-translate-y-full motion-reduce:translate-y-0 motion-reduce:opacity-0"
          : "translate-y-0")
      }
    >
      {/* Hairline progress bar across the middle of the cover. */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-foreground/15">
        <div
          className="h-full origin-left bg-foreground transition-transform duration-200 ease-out"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      {/* Rolling percentage, pinned to the lower left like a signature. */}
      <div className="absolute bottom-8 left-8 flex items-baseline font-serif text-foreground sm:bottom-12 sm:left-12">
        <span className="flex text-[clamp(3.5rem,9vw,7rem)] tabular-nums">
          <Digit value={digits[0]} height="1.05em" />
          <Digit value={digits[1]} height="1.05em" />
          <Digit value={digits[2]} height="1.05em" />
        </span>
        <span className="ml-2 font-mono text-lg text-muted-foreground sm:text-xl">
          %
        </span>
      </div>

      {/* Quiet label opposite the counter — matches the site's mono registers. */}
      <p className="absolute right-8 bottom-10 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:right-12 sm:bottom-14">
        loading
      </p>
    </div>
  );
}

export default Preloader;
