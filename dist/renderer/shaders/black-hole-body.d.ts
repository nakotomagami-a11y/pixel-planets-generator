/**
 * Black hole body shader — dark sphere with a thin glowing rim.
 *
 * The black hole is rendered on a 3× oversize canvas (canvasScale=3) so the
 * accretion ring has room to spread far outside the sphere. This shader
 * handles only the dark disc itself; the ring is a separate draw call.
 *
 * UV remapping: the body should occupy the center third of the 3× canvas.
 * The `uv_offset` and `uv_scale` uniforms map the full UV space into the
 * center sub-region before sampling:
 *   mapped = (UV - uv_offset) * uv_scale
 * where uv_offset = (canvasScale-1)/(2*canvasScale) and uv_scale = canvasScale.
 * Pixels outside [0,1] in mapped space are discarded (fully transparent).
 *
 * colors[0] = core (near-black)
 * colors[1] = inner glow ring
 * colors[2] = bright outer rim (hottest / most light-bent region)
 *
 * Port of BlackHole.gdshader.
 */
export declare const BH_BODY_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform vec4  colors[3];\nuniform float radius;       // disc radius in UV space (\u2248 0.247)\nuniform float light_width;  // width of the glowing rim band (\u2248 0.028)\nuniform float uv_offset;    // = (canvasScale-1) / (2*canvasScale)\nuniform float uv_scale;     // = canvasScale\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nvoid main() {\n  // Remap UV into the center 1/canvasScale region of the oversized canvas\n  vec2 mapped = (UV - uv_offset) * uv_scale;\n  if (any(lessThan(mapped, vec2(0.0))) || any(greaterThan(mapped, vec2(1.0)))) {\n    fragColor = vec4(0.0); return;\n  }\n  vec2 uv = floor(mapped * pixels) / pixels;\n  float d = distance(uv, vec2(0.5));\n  vec4 col = colors[0];\n  if (d > radius - light_width)         col = colors[1];\n  if (d > radius - light_width * 0.5)   col = colors[2];\n  fragColor = vec4(col.rgb, step(d, radius) * col.a);\n}";
