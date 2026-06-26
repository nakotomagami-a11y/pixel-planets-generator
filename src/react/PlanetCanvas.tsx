/**
 * React component wrapper for the pixel-planets WebGL renderer.
 *
 * Design decisions:
 *
 * Singleton renderer
 *   A module-level `PlanetRenderer` instance is shared by every `<PlanetCanvas>`
 *   on the page. This is intentional — WebGL contexts are expensive OS resources
 *   (browsers cap them at 8–16 per page). The singleton uses one context and
 *   renders all planets in a single rAF loop, copying each result to its
 *   display canvas with `drawImage`.
 *
 * No "use client" directive
 *   That directive is Next.js-specific. This component is framework-agnostic.
 *   If you're using Next.js (or another RSC framework), wrap this in your own
 *   thin client component:
 *
 *     "use client";
 *     export { PlanetCanvas } from "@agent-office/pixel-planets/react";
 *
 * Stable registration key
 *   The `key` string encodes every prop that affects the rendered output. When
 *   a prop changes, React re-runs the effect, we unregister the old key and
 *   register a new one. The renderer then re-computes params on the next frame.
 *   This is O(1) and avoids unnecessary re-renders.
 *
 * Canvas sizing for oversized types (star, black-hole)
 *   Star and black-hole render a WebGL canvas at `size × canvasScale` to give
 *   room for corona blobs, flares, and the accretion ring that extend outside
 *   the disc boundary. The canvas element is sized to `size × canvasScale` as
 *   well, so the disc appears at `size` pixels in the center and the surrounding
 *   effects fill the extra space — instead of being downscaled away.
 *
 *   Callers that need a fixed outer container (e.g. the editor preview) should
 *   pass `size / canvasScale` to keep the total canvas at their target size.
 */
import { memo, useEffect, useRef } from "react";
import type { PlanetConfig } from "../types";
import { getPlanetParams, CANVAS_SCALE } from "../params";
import { PlanetRenderer } from "../renderer/index";

// ---------------------------------------------------------------------------
// Module-level singleton — created lazily on first render
// ---------------------------------------------------------------------------

let globalRenderer: PlanetRenderer | null = null;

function getRenderer(): PlanetRenderer | null {
  if (typeof window === "undefined") return null;
  if (!globalRenderer) globalRenderer = new PlanetRenderer();
  return globalRenderer;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface PlanetCanvasProps {
  /**
   * Stable identifier for the owning entity (e.g. a project ID).
   * When `config` is absent, the renderer derives a deterministic random planet
   * from this ID so the planet looks the same on every render.
   */
  projectId: string;

  /**
   * Planet configuration. When omitted, a procedural planet is generated from
   * `projectId`. Changing any property triggers an immediate re-render.
   */
  config?: PlanetConfig;

  /**
   * Desired disc diameter in CSS pixels.
   *
   * The canvas element will be `size` for most types. For types with effects
   * that extend outside the disc (star, black-hole), the canvas is
   * `size × canvasScale` so the disc still appears at `size` px with blobs /
   * flares / ring visible around it.
   *
   * If you need the outer canvas to stay at exactly `size` (e.g. a fixed-size
   * preview container), pass `Math.round(targetPx / canvasScale)` as `size`.
   *
   * @default 32
   */
  size?: number;

  /** Forwarded to the `<canvas>` element. */
  className?: string;
}

export const PlanetCanvas = memo(function PlanetCanvas({
  projectId,
  config,
  size = 32,
  className,
}: PlanetCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // For star (2×) and black-hole (3×), display the full oversized canvas so
  // the disc is `size` px and the surrounding effects are visible.
  const canvasScale = config ? (CANVAS_SCALE[config.type] ?? 1) : 1;
  const displaySize = size * canvasScale;

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = getRenderer();
    if (!canvas || !renderer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const params = getPlanetParams(projectId, config);

    // Encode all appearance-affecting props into the key so changing any one
    // triggers unregister → register → fresh render.
    const key = config
      ? `${projectId}/${size}/${config.type}/${config.seed}/${config.paletteIdx}/${config.pixels ?? 0}/${config.rotation?.toFixed(3) ?? "r"}/${config.dither ?? 1}`
      : `${projectId}/${size}/auto`;

    renderer.register(key, { id: projectId, params, destCanvas: canvas, destCtx: ctx, size });
    return () => renderer.unregister(key);
  }, [projectId, config, size]);

  // imageRendering: pixelated prevents the browser from blurring the
  // pixel-art output when drawing to a canvas smaller than its CSS size.
  return (
    <canvas
      ref={canvasRef}
      width={displaySize}
      height={displaySize}
      className={className}
      style={{ imageRendering: "pixelated", display: "block" }}
    />
  );
});
