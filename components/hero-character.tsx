"use client";

import * as React from "react";

import { SpriteTracker } from "@/lib/sprite-tracker";
import { cn } from "@/lib/utils";

/**
 * Sheet geometry, mirrored from public/hero/boy-sprite.json. The sheet is a
 * 48x2 grid; cell 0 is the subject turned fully toward the viewer's left, the
 * last cell fully toward the viewer's right, and NEUTRAL_INDEX is the
 * front-facing pose the tracker settles back into when the pointer leaves.
 */
const SHEET = {
  frames: 96,
  columns: 48,
  frameWidth: 338,
  frameHeight: 408,
  neutralIndex: 60.049,
} as const;

const SHEET_SRC = "/hero/boy-sprite-dark.webp";
const STILL_SRC = "/hero/boy-still-dark.png";

interface HeroCharacterProps {
  className?: string;
  /** Soften the bottom edge so the chest crop dissolves into the page. */
  fadeBottom?: boolean;
  /** Subtle radial wash behind the figure. */
  glow?: boolean;
  /** Passed through to the tracker — see SpriteTrackerOptions. */
  idleAmplitude?: number;
}

/**
 * Cursor-tracking hero portrait. The figure is a transparent sprite grid
 * scrubbed by pointer position, so it drops onto any background and can be
 * placed anywhere in the layout — it only occupies the box it is given and
 * never intercepts pointer events.
 */
export function HeroCharacter({
  className,
  fadeBottom = true,
  glow = true,
  idleAmplitude,
}: HeroCharacterProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tracker = new SpriteTracker(canvas, {
      ...SHEET,
      src: SHEET_SRC,
      ...(idleAmplitude === undefined ? {} : { idleAmplitude }),
      onReady: (err) => {
        // On failure the still image simply stays put.
        if (!err) setReady(true);
      },
    });

    // Fetching and slicing the 1.5MB sheet is deliberately deferred to browser
    // idle: at mount the page is mid entrance animation, and the decode was
    // costing it frames. The still image holds the pose until the sheet lands.
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    let idleId: number;
    let timerId: number | undefined;
    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(() => void tracker.start(), { timeout: 2000 });
    } else {
      timerId = window.setTimeout(() => void tracker.start(), 900);
    }

    return () => {
      if (timerId !== undefined) window.clearTimeout(timerId);
      else w.cancelIdleCallback?.(idleId);
      tracker.destroy();
    };
  }, [idleAmplitude]);

  const maskStyle = fadeBottom
    ? {
        maskImage:
          "linear-gradient(to bottom, #000 74%, rgba(0,0,0,0.55) 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 74%, rgba(0,0,0,0.55) 90%, transparent 100%)",
      }
    : undefined;

  return (
    <div
      role="img"
      aria-label="Illustrated portrait of Aashish that follows your cursor"
      className={cn(
        "pointer-events-none relative select-none",
        // Matches the sprite cell so the box never letterboxes the figure.
        "aspect-[338/408] w-full",
        className,
      )}
      style={maskStyle}
    >
      {glow ? (
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(58% 46% at 50% 34%, color-mix(in oklab, var(--foreground) 8%, transparent), transparent 72%)",
          }}
        />
      ) : null}

      {/* Resting pose. Paints immediately, then hands over to the canvas. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={STILL_SRC}
        alt=""
        width={SHEET.frameWidth}
        height={SHEET.frameHeight}
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
        style={{ opacity: ready ? 0 : 1 }}
      />

      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500 will-change-transform"
        style={{ opacity: ready ? 1 : 0, transformOrigin: "50% 84%" }}
      />
    </div>
  );
}

export default HeroCharacter;
