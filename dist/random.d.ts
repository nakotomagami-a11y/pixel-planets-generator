/**
 * Helpers for generating random planet configs.
 * These are thin wrappers around Math.random — not seeded, use for UI "randomize" actions.
 */
import type { PlanetType, PlanetConfig } from "./types";
/**
 * Generate a fully random planet config (random type, seed, and palette).
 * Suitable for seeding a new project's planet icon.
 */
export declare function randomPlanet(): PlanetConfig;
/**
 * Generate a random seed and palette for a given planet type.
 * Use this when the user clicks "randomize" in the editor — keeps the type
 * fixed while varying the appearance.
 */
export declare function randomPlanetOfType(type: PlanetType): PlanetConfig;
