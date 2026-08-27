/**
 * Floating embers shader.
 *
 * Scatters small glowing spark particles in a band hugging the planet's edge
 * and drifting a little way out into space — the "sparks coming off a molten
 * world" look. Space is diced into a grid; each cell may hold one spark (gated
 * by `density`), placed at a hashed position and twinkling over time. Sparks
 * are densest right at the silhouette and thin out with distance, and brighter
 * on the lit hemisphere.
 *
 * Works in full-canvas UV (no disc remap); `planet_r` is the disc radius in
 * canvas UV. Meant to be composited last, on an oversized canvas so the outer
 * embers have room. colors[0] = hot core, [1] = mid, [2] = dim outer.
 */
export declare const EMBERS_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform vec2  light_origin;\nuniform float time_speed;\nuniform vec4  colors[3];\nuniform float planet_r;      // planet radius in canvas UV\nuniform float ember_reach;   // how far embers drift beyond the edge\nuniform float density;       // 0..1 fraction of cells holding a spark\nuniform float grid;          // cell count across the canvas\nuniform float seed;\nuniform float time;\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat hash21(vec2 p) {\n  p = fract(p * vec2(123.34, 456.21));\n  p += dot(p, p + 45.32);\n  return fract(p.x * p.y * seed);\n}\nvec2 hash22(vec2 p) {\n  float n = hash21(p);\n  return vec2(n, hash21(p + n));\n}\n\nvoid main() {\n  vec2 uv = floor(UV * pixels) / pixels;\n  float d = distance(uv, vec2(0.5));\n  float inner = planet_r - 0.03;\n  float outer = planet_r + ember_reach;\n  if (d < inner || d > outer) { fragColor = vec4(0.0); return; }\n\n  // Densest at the silhouette, fading outward.\n  float fall = clamp((1.0 - smoothstep(planet_r, outer, d)) + 0.15, 0.0, 1.0);\n\n  vec2 cell = floor(uv * grid);\n  float h = hash21(cell);\n  if (h > density) { fragColor = vec4(0.0); return; }\n\n  // Spark placed within its cell; distance measured in cell units.\n  vec2 pos = (cell + 0.15 + 0.7 * hash22(cell + 7.0)) / grid;\n  float pd = distance(uv, pos) * grid;\n  float spark = smoothstep(0.5, 0.0, pd);\n\n  float tw  = 0.45 + 0.55 * sin(time * time_speed + h * 6.2831);\n  float lit = 1.0 - smoothstep(0.0, 1.4, distance(uv, light_origin));\n\n  float intensity = spark * tw * fall * (0.4 + lit * 0.9);\n  intensity = clamp(intensity, 0.0, 1.0);\n  if (intensity <= 0.05) { fragColor = vec4(0.0); return; }\n\n  vec4 col = colors[2];\n  if (intensity > 0.35) col = colors[1];\n  if (intensity > 0.70) col = colors[0];\n  fragColor = vec4(col.rgb, intensity * col.a);\n}";
