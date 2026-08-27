/**
 * Palettes for the Asteroid type.
 *
 * Single layer (asteroid shader, 3 colors: mid / dark / light).
 * The asteroid shader uses fbm noise + a distance threshold to create an
 * irregular rocky mass — no sphere clipping. Colors map to light, mid,
 * and shadow regions determined by a noise-offset lighting calculation.
 * Original: Asteroid.tscn.
 */
import type { PaletteDef } from "./types";
declare const palettes: PaletteDef[];
export default palettes;
