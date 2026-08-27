/**
 * Atmospheric glow / corona shader.
 *
 * Renders a soft, wispy halo of gas hugging the planet's circular edge —
 * the "toxic atmosphere" look: a coloured glow that peaks at the silhouette,
 * bleeds a little inward as rim-light and fades outward into space. It is
 * brightest on the lit hemisphere (toward `light_origin`) and textured by an
 * fbm field so the rim churns rather than being a clean gradient.
 *
 * Unlike the surface shaders this one works directly in full-canvas UV (no
 * disc remap): `planet_r` is the planet's radius in canvas UV and the glow
 * lives in the annulus [planet_r - inner bleed, planet_r + glow_width]. It is
 * meant to be composited ON TOP of the surface layers, on an oversized canvas
 * (canvasScale ≥ 2) so the outer corona has room to spread.
 *
 * colors[0] = bright inner rim, colors[1] = mid, colors[2] = faint outer fade.
 */
export declare const ATMO_GLOW_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2  light_origin;\nuniform float time_speed;\nuniform vec4  colors[3];\nuniform float planet_r;     // planet radius in canvas UV\nuniform float glow_width;   // glow extent beyond planet_r\nuniform float glow_strength;// overall intensity multiplier (Glow slider)\nuniform float size;\nuniform int   OCTAVES;\nuniform float seed;\nuniform float time;\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat rand(vec2 coord) {\n  coord = mod(coord, vec2(1.0) * round(size));\n  return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);\n}\nfloat noise(vec2 coord) {\n  vec2 i = floor(coord), f = fract(coord);\n  float a = rand(i), b = rand(i+vec2(1,0)), c = rand(i+vec2(0,1)), d = rand(i+vec2(1,1));\n  vec2 u = f*f*(3.0-2.0*f);\n  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;\n}\nfloat fbm(vec2 coord) {\n  float v = 0.0, s = 0.5;\n  for (int i = 0; i < OCTAVES; i++) { v += noise(coord)*s; coord *= 2.0; s *= 0.5; }\n  return v;\n}\nvec2 rotate(vec2 coord, float angle) {\n  coord -= 0.5;\n  coord *= mat2(vec2(cos(angle), -sin(angle)), vec2(sin(angle), cos(angle)));\n  return coord + 0.5;\n}\n\nvoid main() {\n  vec2 uv = floor(UV * pixels) / pixels;\n  float d = distance(uv, vec2(0.5));\n  float outer = planet_r + glow_width;\n  if (d > outer) { fragColor = vec4(0.0); return; }\n\n  // Radial profile: peak at the planet edge, fade to 0 outward, soft inner bleed.\n  float outward = 1.0 - smoothstep(planet_r, outer, d);\n  float inward  = smoothstep(planet_r - glow_width * 0.7, planet_r, d);\n  float band    = outward * mix(0.20, 1.0, inward);\n\n  // Brightest on the lit hemisphere.\n  float lit = 1.0 - smoothstep(0.0, 1.5, distance(uv, light_origin));\n\n  // Wispy angular turbulence around the rim.\n  vec2 ruv = rotate(uv, rotation);\n  float n  = fbm(ruv * size + vec2(time * time_speed, 0.0));\n\n  float intensity = band * (0.30 + lit * 1.0) * (0.58 + n * 0.55) * glow_strength;\n  intensity = clamp(intensity, 0.0, 1.0);\n  if (intensity <= 0.02) { fragColor = vec4(0.0); return; }\n\n  vec4 col = colors[2];\n  if (intensity > 0.30) col = colors[1];\n  if (intensity > 0.65) col = colors[0];\n  fragColor = vec4(col.rgb, intensity * col.a);\n}";
