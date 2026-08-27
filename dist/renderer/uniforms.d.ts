/**
 * Uniform upload helpers.
 *
 * WebGL requires a separate call for each uniform type. These small helpers
 * centralise the type dispatch and handle missing locations gracefully
 * (getUniformLocation returns null for inactive uniforms).
 */
/**
 * Set a float or vec2 uniform. vec4 arrays are uploaded via the flat path.
 * - number    → uniform1f
 * - [x, y]   → uniform2f
 * - number[]  → uniform4fv (for colors[] arrays)
 */
export declare function setUniform(gl: WebGL2RenderingContext, prog: WebGLProgram, name: string, value: number | number[]): void;
/** Set an integer uniform (used for OCTAVES, should_dither). */
export declare function setUniformInt(gl: WebGL2RenderingContext, prog: WebGLProgram, name: string, value: number): void;
