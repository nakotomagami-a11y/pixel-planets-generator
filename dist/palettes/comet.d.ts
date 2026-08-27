/**
 * Palettes for the Comet planet type.
 *
 * A blazing meteor: a small molten cracked head trailing a long fiery tail.
 * The directional trail is the signature — nothing else in the set has one.
 * Rendered on a 2× canvas with a small disc so the tail has length.
 *
 * Layer [0] comet-tail  — 3 colors: hot core → orange mid → deep red outer wisp
 * Layer [1] rock        — 3 colors: charred head crust (light / mid / dark)
 * Layer [2] lava-rivers — 3 colors: glowing cracks on the head
 * Layer [3] embers      — 3 colors: hot core → dim outer spark
 */
import type { PaletteDef } from "./types";
declare const palettes: PaletteDef[];
export default palettes;
