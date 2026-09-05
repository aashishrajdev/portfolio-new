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

      {/* Fractal-noise grain. The same feTurbulence filter as before, but
          rasterized once as a tiled background-image instead of a live SVG
          filter element: a full-viewport feTurbulence blended with
          soft-light re-evaluates on the main thread continuously and was
          costing ~85s of blocking time in Lighthouse. As a background tile
          the browser rasterizes it once and just composites. */}
      <div
        className="grain absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'240'%20height%3D'240'%3E%3Cfilter%20id%3D'n'%3E%3CfeTurbulence%20type%3D'fractalNoise'%20baseFrequency%3D'0.8'%20numOctaves%3D'2'%20stitchTiles%3D'stitch'%2F%3E%3CfeColorMatrix%20type%3D'saturate'%20values%3D'0'%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D'100%25'%20height%3D'100%25'%20filter%3D'url(%23n)'%2F%3E%3C%2Fsvg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "240px 240px",
        }}
      />
    </div>
  );
}
