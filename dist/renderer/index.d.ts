/**
 * WebGL2 planet renderer.
 *
 * Architecture — singleton offscreen canvas:
 *   One offscreen <canvas> holds a single WebGL2 context. All WebGL programs
 *   are compiled once at init. On every rAF tick, the renderer iterates over
 *   all registered display canvases, renders each planet to the offscreen
 *   canvas at the right size, then copies the result with drawImage().
 *
 * Why a singleton: WebGL contexts are expensive OS resources. Browsers cap
 *   the number per page (typically 8–16). With many planet canvases on screen,
 *   creating one context per canvas would hit that limit and silently fail.
 *   The singleton approach uses exactly one context no matter how many planets
 *   are displayed simultaneously.
 *
 * Why premultipliedAlpha: false:
 *   Our fragment shaders write non-premultiplied RGBA (alpha=0 where
 *   transparent, non-zero RGB). With premultipliedAlpha: true (the default),
 *   some browsers treat (rgb, alpha=0) as an invalid premultiplied value and
 *   composite it as opaque white. Setting premultipliedAlpha: false tells the
 *   browser to treat our outputs as straight-alpha, which correctly makes
 *   alpha=0 pixels transparent regardless of the RGB values.
 */
import type { PlanetParams } from "../types";
/** One display canvas that the renderer writes to each frame. */
interface Registration {
    id: string;
    params: PlanetParams;
    destCanvas: HTMLCanvasElement;
    destCtx: CanvasRenderingContext2D;
    size: number;
    /**
     * Cached silhouette-outline pixels. Computed once from the first rendered
     * frame (the outer silhouette is static — the base disc is always opaque),
     * then re-stamped over every animated frame. `undefined` = not yet computed.
     */
    outline?: OutlinePix[];
}
/** A single silhouette-edge pixel and whether it faces the top-left light. */
interface OutlinePix {
    x: number;
    y: number;
    lit: boolean;
}
/**
 * Singleton WebGL2 renderer.
 *
 * Usage:
 *   const renderer = new PlanetRenderer();
 *   renderer.register("my-key", { id, params, destCanvas, destCtx, size });
 *   // The renderer starts its own rAF loop automatically.
 *   // When the display element is removed:
 *   renderer.unregister("my-key");
 *
 * The renderer lazily creates its WebGL context on the first register() call
 * so it has no effect in server-side rendering environments.
 */
export declare class PlanetRenderer {
    private gl;
    private offscreen;
    private programs;
    private vao;
    private registrations;
    private rafId;
    private startTime;
    private initialized;
    private init;
    /**
     * Register a display canvas for continuous rendering.
     * Starts the rAF loop if not already running.
     */
    register(key: string, reg: Registration): void;
    /**
     * Unregister a display canvas. Stops the rAF loop when no canvases remain.
     */
    unregister(key: string): void;
    private startLoop;
    private renderAll;
}
export {};
