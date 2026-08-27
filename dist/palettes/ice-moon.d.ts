/**
 * Palettes for the Ice Moon planet type.
 *
 * A frozen, airless body: terrain (frozen "continents" + shallow/deep ice)
 * plus an impact-crater overlay and — unlike Ice World — NO cloud layer. The
 * missing atmosphere plus the cratering is what distinguishes it from Ice
 * World (soft, clouded) and from Rocky (grey, no ice tones).
 *
 * Layer [0] terrain — 6 colors: 4 surface (bright → shadow) + 2 ice basin (shallow, deep)
 * Layer [1] craters — 2 colors: rim highlight / crater shadow
 */
import type { PaletteDef } from "./types";
declare const palettes: PaletteDef[];
export default palettes;
