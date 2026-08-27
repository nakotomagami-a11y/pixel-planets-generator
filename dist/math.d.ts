/**
 * Low-level math utilities used by the palette and parameter systems.
 *
 * Kept separate from rendering so this module has zero browser dependencies
 * and can run in Node.js (e.g. server-side random planet generation).
 */
/** Normalised RGB triple — all components in [0, 1]. */
export type RGB = [number, number, number];
/**
 * Mulberry32 — a fast, high-quality 32-bit PRNG seeded with a single integer.
 *
 * Why mulberry32: it passes PractRand statistical tests, produces visually
 * uncorrelated outputs for adjacent seeds, and is only a handful of
 * integer operations. Perfect for deterministic planet generation where
 * "same seed → same planet" must hold across devices and restarts.
 *
 * Returns a closure so multiple independent streams can coexist without
 * sharing state.
 */
export declare function mulberry32(seed: number): () => number;
/**
 * Derive a stable 32-bit integer from a project-id string.
 *
 * Project IDs are UUIDs or slug strings, not integers. We need an integer
 * seed for mulberry32. XOR-folding the hex bytes gives a cheap, collision-
 * resistant mapping without pulling in a hash library.
 */
export declare function hashProjectId(id: string): number;
/**
 * Expand an array of RGB triples into a flat RGBA array suitable for
 * uploading to a GLSL `vec4[]` uniform. Alpha is always 1.0.
 */
export declare function toRGBA(colors: RGB[]): number[];
/** Darken an RGB color by a linear `amount` (0 = no change, 1 = black). */
export declare function darkened(rgb: RGB, amount: number): RGB;
/** Lighten an RGB color towards white by a linear `amount` (0 = no change, 1 = white). */
export declare function lightened(rgb: RGB, amount: number): RGB;
/** Rotate the hue of an RGB color by `delta` turns (0–1). */
export declare function shiftHue(rgb: RGB, delta: number): RGB;
/**
 * Generate `n` perceptually-pleasing colors using the cosine palette method.
 *
 * The idea: a cosine function in RGB space traces a smooth arc through
 * color space. Sampling it at evenly-spaced `t` values gives a harmonious
 * sequence of colors that look good together regardless of the random
 * parameters.
 *
 * Reference: https://iquilezles.org/articles/palettes/
 *
 * @param n          Number of colors to generate.
 * @param hueDiff    How wide the arc sweeps across hue (0 = monochrome, 1 = full spectrum).
 * @param saturation Overall vibrancy of the colors.
 * @param rng        A seeded mulberry32 RNG closure.
 */
export declare function cosineScheme(n: number, hueDiff: number, saturation: number, rng: () => number): RGB[];
