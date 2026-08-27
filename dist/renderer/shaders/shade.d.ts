/**
 * Spherical shading overlay.
 *
 * A generic depth pass composited LAST over solid-sphere planet types. It
 * reconstructs the sphere normal from screen UV, lights it from `light_origin`,
 * and paints a dark, posterized terminator crescent on the unlit hemisphere
 * plus limb darkening at the grazing edge. This is what makes a planet read as
 * a lit 3D ball instead of a flat textured disc — the surface shaders only
 * band the palette colours, which is often too subtle to sell the sphere.
 *
 * Output is a near-black straight-alpha overlay (RGB≈0, alpha ramps up in
 * shadow), so SRC_ALPHA blending simply darkens whatever surface is beneath —
 * palette-independent. Alpha is stepped into a few bands so the terminator has
 * the chunky pixel-art edge of the rest of the set rather than a smooth gradient.
 *
 * Disc-clipped and canvasScale-aware (uv_offset/uv_scale) so it lines up with
 * the shrunk body on 2× types (gas-giant, ringed-terran).
 */
export declare const SHADE_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform vec2  light_origin;\nuniform float shade_strength;\nuniform float uv_offset;   // disc remap (0 when canvasScale=1)\nuniform float uv_scale;    // = 1/(2*planetR)\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nvoid main() {\n  vec2 uv_raw = floor(UV * pixels) / pixels;\n  vec2 uv = (uv_raw - uv_offset) * uv_scale;\n\n  vec2 c = (uv - 0.5) * 2.0;    // -1..1 across the disc\n  float r2 = dot(c, c);\n  if (r2 > 1.0) { fragColor = vec4(0.0); return; }   // outside the sphere\n\n  // Reconstruct the sphere surface normal and light it.\n  float z = sqrt(1.0 - r2);\n  vec3 N = vec3(c, z);\n  vec2 l2 = (light_origin - 0.5) * 2.0;\n  vec3 L = normalize(vec3(l2, 0.7));                  // light from upper-left, toward viewer\n  float ndl = dot(normalize(N), L);\n\n  // Shadow rises smoothly across a wide terminator so the unlit hemisphere\n  // fades in as a soft crescent rather than a hard band.\n  float shadow = smoothstep(0.7, -0.75, ndl);\n  // Limb darkening is masked by the shadow so it only deepens the already-dark\n  // side \u2014 without the mask it wraps the whole disc and reads as a ring.\n  float limb   = smoothstep(0.55, 1.0, sqrt(r2)) * shadow * 0.3;\n  float a = shadow * shade_strength + limb;\n\n  // Fine posterization \u2014 enough steps to snap to the pixel grid while still\n  // reading as a smooth gradient instead of chunky concentric rings.\n  a = floor(clamp(a, 0.0, 0.62) * 8.0 + 0.5) / 8.0;\n  if (a <= 0.001) { fragColor = vec4(0.0); return; }\n\n  fragColor = vec4(0.01, 0.01, 0.03, a);   // near-black, faintly cool\n}";
