/**
 * Palettes for the Ringed Terran planet type.
 *
 * A habitable world (terran-style terrain + cloud) wearing a Saturn-style ring.
 * Structurally it is Terran's two layers plus the `gas-ring` layer, rendered on
 * a 2× canvas so the ring has room to spread. The ring is what makes it read
 * differently from every other rocky/ocean world at a glance.
 *
 * Layer [0] terrain — 6 colors: 4 land (bright → shadow) + 2 water (shallow, deep)
 * Layer [1] cloud   — 4 colors: bright → shadow
 * Layer [2] ring    — 6 colors: 3 bright band + 3 dark band
 */
import type { PaletteDef } from "./types";
declare const palettes: PaletteDef[];
export default palettes;
