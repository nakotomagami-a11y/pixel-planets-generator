/**
 * Assembles per-type palette definitions into one `PLANET_TYPE_DEFS` map.
 *
 * Each planet type gets:
 *   - `label`    — human-readable name shown in editor UIs
 *   - `palettes` — ordered list of named color palettes
 *
 * To add a new type:
 *   1. Create `<type-name>.ts` in this directory following the pattern above.
 *   2. Import it here and add an entry to PLANET_TYPE_DEFS.
 *   3. Add the type string to PlanetType in `../types.ts`.
 *   4. Add a LAYER_TEMPLATES entry in `../params.ts`.
 *   5. Write (or port) the fragment shader in `../renderer/shaders/`.
 */
import type { PlanetType } from "../types";
import type { PlanetTypeDef } from "./types";
export declare const PLANET_TYPE_DEFS: Record<PlanetType, PlanetTypeDef>;
export type { PlanetTypeDef, PaletteDef } from "./types";
