/**
 * Debris field shader.
 *
 * Scatters small shaded rock chunks in the space AROUND a planet — the
 * "shattered / damaged world" look: a cloud of broken fragments orbiting the
 * body, denser near the surface and thinning outward. Rendered in full-canvas
 * UV on an oversized canvas (canvasScale ≥ 2) so the field has room around the
 * (slightly shrunk) planet disc.
 *
 * Method: divide the canvas into a grid of cells; each cell may hold one chunk
 * at a hashed position with a hashed radius. Presence is weighted by a radial
 * falloff (more chunks hugging the planet) and biased toward the "blast" side
 * (+x). Each chunk is 2-3 tone shaded from `light_origin` so it reads as solid
 * rock rather than a flat dot. Chunks are static (position is seed/space based).
 *
 * colors[0] = lit face, colors[1] = mid, colors[2] = shadow / rim.
 */
export declare const DEBRIS_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform vec2  light_origin;\nuniform vec4  colors[3];\nuniform float planet_r;   // planet radius in canvas UV\nuniform float field_r;    // outer radius of the debris field\nuniform float density;    // number of grid cells across the canvas\nuniform float seed;\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat hash(vec2 p) {\n  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 15.5453 * (seed + 1.0));\n}\nvec2 hash2(vec2 p) {\n  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * (43758.5453 * (seed + 1.0)));\n}\n\nvoid main() {\n  vec2 uv = floor(UV * pixels) / pixels;\n  float d = distance(uv, vec2(0.5));\n\n  // Only in the annulus around the planet.\n  if (d < planet_r * 1.03 || d > field_r) { fragColor = vec4(0.0); return; }\n\n  // More chunks near the planet, thinning outward; more on the +x \"blast\" side.\n  float falloff  = 1.0 - smoothstep(planet_r, field_r, d);\n  float sideBias = smoothstep(-0.35, 0.55, uv.x - 0.5);\n  float threshold = (0.06 + falloff * 0.26) * (0.45 + sideBias * 0.9);\n\n  vec2 cell = floor(uv * density);\n  vec2 f    = fract(uv * density);\n  if (hash(cell) > threshold) { fragColor = vec4(0.0); return; }\n\n  vec2  center = 0.25 + hash2(cell + 3.17) * 0.5;   // chunk center inside cell\n  float radius = 0.14 + hash(cell + 7.31) * 0.20;   // chunk radius (cell units)\n  float cd     = distance(f, center);\n  if (cd > radius) { fragColor = vec4(0.0); return; }\n\n  // Fake lighting: lit on the side of the chunk facing light_origin.\n  vec2  lightDir = normalize(light_origin - vec2(0.5));\n  vec2  localN   = normalize(f - center + vec2(0.0001));\n  float ndl      = dot(localN, lightDir);\n\n  vec4 col = colors[1];\n  if (ndl >  0.25) col = colors[0];\n  if (ndl < -0.20) col = colors[2];\n  if (cd > radius * 0.82) col = colors[2];   // dark rim\n\n  fragColor = vec4(col.rgb, col.a);\n}";
