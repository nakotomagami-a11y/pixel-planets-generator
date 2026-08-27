/**
 * Palettes for the Gas Giant planet type.
 *
 * A gas giant uses two stacked cloud layers (dark base + lighter overlay)
 * plus a Saturn-style ring layer. Each palette entry therefore has exactly
 * 3 inner arrays:
 *   [0] — dark base gas layer (4 colors)
 *   [1] — light cloud overlay layer (4 colors)
 *   [2] — ring layer (6 colors: first 3 = bright band, last 3 = dark band)
 */
import type { PaletteDef } from "./types";
declare const palettes: PaletteDef[];
export default palettes;
