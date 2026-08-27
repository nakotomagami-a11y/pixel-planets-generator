/**
 * Palettes for the Galaxy type.
 *
 * Single layer (galaxy shader, 7 colors). The shader uses 6 discrete color
 * "levels" (n_colors=6), but needs a 7-element array so the posterised fbm
 * value (0–6) can index `colors[int(f2)]` without an out-of-bounds access
 * at the maximum value. The 7th color is effectively the darkest background.
 *
 * The shader applies tilt (y-scale), swirl rotation, and zoom to produce a
 * spiral galaxy silhouette — no sphere clip, fully freeform.
 * Original: Galaxy.tscn.
 */
import type { PaletteDef } from "./types";
declare const palettes: PaletteDef[];
export default palettes;
