/**
 * Palettes for the Eclipse planet type.
 *
 * A near-black planet silhouette backlit by a thin, bright "ring of fire"
 * corona hugging its edge, with scattered sparks drifting around it — the
 * total-eclipse / ring-of-fire look. Built entirely from reused shaders: a
 * dark rock body, a tight atmo-glow ring, and embers.
 *
 * Layer [0] rock      — 3 colors: near-black body (barely any surface texture)
 * Layer [1] atmo-glow — 3 colors: bright inner rim → hot mid → dark outer fade
 * Layer [2] embers    — 3 colors: hot core → dim outer spark
 */
import type { PaletteDef } from "./types";
declare const palettes: PaletteDef[];
export default palettes;
