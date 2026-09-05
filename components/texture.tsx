import { DotGrid } from "@/components/dot-grid";

/**
 * Texture — fixed full-screen ambient background.
 *
 * Two layers, both fixed/inset-0/-z-10/pointer-events-none:
 *   1. DotGrid — canvas dot grid (1px dots, 24px pitch) that lifts toward the
 *      pointer. Colour flips with the theme.
 *   2. faint SVG fractalNoise grain (mix-blend-soft-light, ~3% opacity)
 *
 * Rendered once in the root layout.
 */
export function Texture() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Dotted grid */}
      <DotGrid />

      {/* Fractal-noise grain overlay */}
      <svg
        className="grain absolute inset-0 h-full w-full opacity-[0.03] mix-blend-soft-light"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="texture-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#texture-grain)" />
      </svg>
    </div>
  );
}
