/**
 * Gas planet Saturn-style ring shader.
 *
 * Renders a tilted elliptical ring around a gas giant on the full 3× canvas.
 * The ring appears in front of the planet's lower half and disappears behind
 * the upper half, creating the classic Saturn silhouette.
 *
 * Key effects:
 *  - `ring_perspective` (4.0) squishes the Y axis so the annulus looks tilted.
 *  - Two smoothstep calls carve out an annulus between inner/outer radius.
 *  - `uv.y < 0.5` mask removes the ring in the upper half (goes behind planet).
 *    Within the upper-half the planet disc area is also excluded via
 *    `scale_rel_to_planet` so only the outer ring lobes remain visible there.
 *  - An FBM noise field textures the ring material.
 *  - 6 colors: colors[0..2] = bright band, colors[3..5] = dark band.
 *    Posterised + light_d blending determines which band is sampled.
 *
 * Port of GasPlanetLayers/Ring.gdshader from the PixelPlanets Godot project.
 */
export declare const GAS_RING_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;               // = params.pixels * canvasScale\nuniform float rotation;\nuniform vec2  light_origin;\nuniform float time_speed;\nuniform float ring_width;           // annulus half-width  (default 0.1)\nuniform float ring_perspective;     // Y-squish (default 4.0)\nuniform float scale_rel_to_planet;  // 1/planet-disc-radius in canvas UV (6.0)\nuniform vec4  colors[6];            // [0..2] bright, [3..5] dark\nuniform float size;\nuniform int   OCTAVES;\nuniform float seed;\nuniform float time;\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat rand(vec2 coord) {\n  coord = mod(coord, vec2(2.0, 1.0) * round(size));\n  return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);\n}\nfloat noise(vec2 coord) {\n  vec2 i = floor(coord), f = fract(coord);\n  float a = rand(i), b = rand(i+vec2(1,0)), c = rand(i+vec2(0,1)), d = rand(i+vec2(1,1));\n  vec2 u = f*f*(3.0-2.0*f);\n  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;\n}\nfloat fbm(vec2 coord) {\n  float v = 0.0, s = 0.5;\n  for (int i = 0; i < OCTAVES; i++) { v += noise(coord)*s; coord *= 2.0; s *= 0.5; }\n  return v;\n}\nvec2 rotate(vec2 coord, float angle) {\n  coord -= 0.5;\n  coord *= mat2(vec2(cos(angle), -sin(angle)), vec2(sin(angle), cos(angle)));\n  return coord + 0.5;\n}\n\nvoid main() {\n  vec2 uv = floor(UV * pixels) / pixels;\n\n  float light_d = distance(uv, light_origin);\n  uv = rotate(uv, rotation);\n\n  // Shift origin so center of ring is at (0.5, 0)\n  vec2 uv_center = uv - vec2(0.0, 0.5);\n\n  // Squish Y to tilt the ring into perspective\n  uv_center *= vec2(1.0, ring_perspective);\n  float center_d = distance(uv_center, vec2(0.5, 0.0));\n\n  // Annulus: two smoothstep calls carve inner and outer edges\n  float ring = smoothstep(0.5 - ring_width*2.0, 0.5 - ring_width, center_d);\n  ring      *= smoothstep(center_d - ring_width, center_d, 0.4);\n\n  // Hide ring behind planet on the upper half.\n  // Also keep the outer lobes visible (distance > 1/scale_rel_to_planet from\n  // centre = outside the planet disc radius in canvas UV space).\n  if (uv.y < 0.5) {\n    ring *= step(1.0 / scale_rel_to_planet, distance(uv, vec2(0.5)));\n  }\n\n  if (ring <= 0.0) {\n    fragColor = vec4(0.0);\n    return;\n  }\n\n  // Rotate ring material over time for slow drift\n  uv_center = rotate(uv_center + vec2(0.0, 0.5), time * time_speed);\n  ring *= fbm(uv_center * size);\n\n  // Posterise into bright / dark bands using 4 levels\n  float posterized = floor((ring + pow(light_d, 2.0) * 2.0) * 4.0) / 4.0;\n  posterized = min(posterized, 2.0);\n\n  vec4 col;\n  int n = 3;\n  if (posterized <= 1.0) {\n    col = colors[int(posterized * float(n - 1))];\n  } else {\n    col = colors[int((posterized - 1.0) * float(n - 1)) + 3];\n  }\n\n  fragColor = vec4(col.rgb, step(0.28, ring) * col.a);\n}";
