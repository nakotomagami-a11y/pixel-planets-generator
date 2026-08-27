/**
 * Palettes for the Black Hole type.
 *
 * Two layers:
 *   - dark sphere body with a thin glowing rim (3 colors: core / glow / bright edge)
 *   - accretion ring composited on top (5 colors: bright → dark, posterised by fbm)
 *
 * The renderer uses a 3× oversize canvas so the ring has room to extend
 * outside the sphere boundary. The body layer remaps its UV to occupy only
 * the center third of that larger canvas.
 * Original: BlackHole.tscn.
 */
import type { PaletteDef } from "./types";
declare const palettes: PaletteDef[];
export default palettes;
