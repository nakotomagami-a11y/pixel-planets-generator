import type { PlanetConfig } from "../types";
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
     * Disc diameter in CSS pixels. The wrapper div is always `size × size`.
     * The inner canvas may be larger for star/black-hole types (effects overflow).
     *
     * @default 32
     */
    size?: number;
    /**
     * Applied to the wrapper div. Use this to control:
     *   - Layout behaviour (`shrink-0`, `block`, …)
     *   - Clipping (`overflow-hidden rounded-full` for a circle icon)
     *   - Freeform bleed (omit `overflow-hidden` to let effects extend outside)
     */
    className?: string;
}
export declare const PlanetCanvas: import("react").NamedExoticComponent<PlanetCanvasProps>;
