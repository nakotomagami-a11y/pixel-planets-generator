/**
 * Palettes for the Toxic World planet type.
 *
 * What makes it distinct from Terran is the GAS AROUND IT: a darkish marbled
 * surface + cloud swirl, wrapped in a vivid glowing atmospheric corona and a
 * transparent, fbm-distorted haze ring. Surfaces are kept dark and rich so the
 * saturated glow/ring read strongly against them.
 *
 * Layer [0] terrain    — 6 colors: 4 land (bright → shadow) + 2 sea (shallow, deep)
 * Layer [1] cloud       — 4 colors: bright swirl → shadow
 * Layer [2] atmo-glow   — 3 colors: bright inner rim → faint outer fade
 * Layer [3] atmo-ring   — 3 colors: bright wisp → faint edge
 */
import type { PaletteDef } from "./types";
declare const palettes: PaletteDef[];
export default palettes;
