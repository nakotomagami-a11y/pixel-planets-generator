/**
 * Parameter builder: converts a `PlanetConfig` into `PlanetParams`.
 *
 * `getPlanetParams` is the main entry point. It handles:
 *   - Picking the right layer templates for the planet type
 *   - Resolving palette colors into flat RGBA arrays
 *   - Generating a fallback procedural appearance when no config is supplied
 *   - Seeding all RNG from the config's integer seed for determinism
 */
import type { PlanetType, PlanetParams, ShaderName, PlanetParamDef } from "./types";
/**
 * Defines the shader and timing for each layer of a planet type.
 * This is the "shape" of the type — the palette fills in the actual colors.
 *
 * `timeScaleFactor` and `timeSpeed` are combined in makeTimeScale() to
 * produce the `timeScale` field on PlanetLayer. Separating them lets us
 * tune animation speed independently of the domain-size parameter.
 */
interface LayerTemplate {
    shader: ShaderName;
    cloudCover?: number;
    riverCutoff?: number;
    landCutoff?: number;
    glow?: number;
    /** Multiplied by `(size * 2 / timeSpeed)` to get the final time scale. */
    timeScaleFactor: number;
    /** Shader-internal time speed uniform (how fast the pattern scrolls). */
    timeSpeed: number;
}
/**
 * Hard ceiling for atmo-glow intensity. Glow is randomized 0..GLOW_MAX on
 * generation and the editor slider caps here — there is no way to exceed it.
 */
export declare const GLOW_MAX = 0.56;
export declare const LAYER_TEMPLATES: Record<PlanetType, LayerTemplate[]>;
/**
 * Adjustable per-type knobs, surfaced as sliders in the planet editor.
 *
 * Each entry maps to a `{ layer, field }` of that type's LAYER_TEMPLATES.
 * `default` mirrors the template value (in intuitive units — see PlanetParamDef)
 * so a fresh planet looks identical whether or not the user touches a slider.
 * Types absent from this map simply expose no knobs.
 */
export declare const PLANET_PARAM_DEFS: Partial<Record<PlanetType, PlanetParamDef[]>>;
/**
 * Types that render outside the circular clip boundary.
 * Includes black-hole (accretion ring) and gas-giant (Saturn ring).
 */
export declare const FREEFORM_TYPES: Set<PlanetType>;
/**
 * Oversize multipliers for types whose effects extend beyond the planet disc.
 *
 * The WebGL offscreen canvas is `discSize × canvasScale`. The display canvas
 * is also `discSize × canvasScale` so the disc appears at `discSize` pixels
 * and the surrounding effects (blobs, flares, ring) fill the extra space.
 */
export declare const CANVAS_SCALE: Partial<Record<PlanetType, number>>;
/**
 * Per-type disc shrink factor for oversized-canvas surface layers (see
 * PlanetParams.discShrink). Defaults to 0.7 (leaves room for a far Saturn ring);
 * toxic keeps the body near full size so its corona/ring hug the surface.
 */
export declare const DISC_SHRINK: Partial<Record<PlanetType, number>>;
/**
 * Convert a `PlanetConfig` into `PlanetParams` ready for the WebGL renderer.
 *
 * When called without a `config`, produces a stable random planet seeded from
 * `projectId` — useful for showing a planet before the user has configured one.
 *
 * @param projectId  Used to seed the RNG when no config is provided.
 * @param config     Optional explicit planet configuration.
 */
export declare function getPlanetParams(projectId: string, config?: PlanetConfig): PlanetParams;
import type { PlanetConfig } from "./types";
export {};
