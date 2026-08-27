/**
 * Palettes for the Star type.
 *
 * Three layers (all rendered on a 2× canvas so they can extend outside the disc):
 *   - blob corona (star-blobs shader, 1 color — circular blobs form a loose halo)
 *   - star body   (star-main shader,  4 colors — Voronoi cells, sphere-mapped)
 *   - solar flares(star-flares shader, 2 colors — spiky outward rays)
 *
 * The star-main layer remaps UV to the center half of the 2× canvas.
 * The blobs and flares render in full 2× space so they can overhang.
 * Original: Star.tscn.
 */
import type { PaletteDef } from "./types";
declare const palettes: PaletteDef[];
export default palettes;
