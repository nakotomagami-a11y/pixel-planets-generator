/**
 * Aggregates all GLSL shader source strings into one map.
 * The renderer uses this to compile programs keyed by ShaderName.
 */
import type { ShaderName } from "../../types";
import { VERT_SRC } from "./vert";
export { VERT_SRC };
/** Map from ShaderName to compiled fragment shader source. */
export declare const FRAG_SHADERS: Record<ShaderName, string>;
