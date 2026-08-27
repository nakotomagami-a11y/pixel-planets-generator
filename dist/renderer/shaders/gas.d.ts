/**
 * Gas Giant cloud bands shader.
 *
 * Simulates the turbulent cloud layers of a gas planet (Jupiter-style).
 * Two instances of this shader are layered: a dark opaque base layer and a
 * lighter semi-transparent overlay layer (cloud_cover > 0 makes some pixels
 * transparent, revealing the layer beneath).
 *
 * Algorithm:
 *  1. Quantise UV to pixel grid.
 *  2. Spherify — maps the flat disc to a sphere surface (barrel distortion).
 *  3. Rotate the sphere to the configured angle.
 *  4. Stretch UV vertically to create horizontal band structure.
 *  5. Add a smooth horizontal wave (cloud_curve) to give bands a wavy edge.
 *  6. Accumulate fbm noise driven by time to animate the clouds scrolling.
 *  7. Compare the noise value against cloud_cover and two light borders to
 *     pick one of four colors (shadow → mid → highlight → bright).
 *
 * Port of GasPlanet.gdshader from the PixelPlanets Godot project.
 */
export declare const GAS_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform float cloud_cover;\nuniform vec2  light_origin;\nuniform float time_speed;\nuniform float stretch;\nuniform float cloud_curve;\nuniform float light_border_1;\nuniform float light_border_2;\nuniform float rotation;\nuniform vec4  colors[4];\nuniform float size;\nuniform int   OCTAVES;\nuniform float seed;\nuniform float time;\n// When the canvas is oversized (e.g. 3\u00D7 for gas-giant with ring), remap the\n// full-canvas UV into planet-disc UV [0,1] before any disc calculations.\n// For a 1\u00D7 canvas: uv_offset=0, uv_scale=1 \u2192 identity transform.\nuniform float uv_offset;   // = (canvasScale-1) / (2*canvasScale)\nuniform float uv_scale;    // = canvasScale\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat rand(vec2 coord) {\n  coord = mod(coord, vec2(1.0) * round(size));\n  return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);\n}\nfloat noise(vec2 coord) {\n  vec2 i = floor(coord), f = fract(coord);\n  float a = rand(i), b = rand(i + vec2(1,0)), c = rand(i + vec2(0,1)), d = rand(i + vec2(1,1));\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;\n}\nfloat fbm(vec2 coord) {\n  float v = 0.0, s = 0.5;\n  for (int i = 0; i < OCTAVES; i++) { v += noise(coord)*s; coord *= 2.0; s *= 0.5; }\n  return v;\n}\nfloat circleNoise(vec2 uv) {\n  float uy = floor(uv.y); uv.x += uy * 0.31;\n  vec2 f = fract(uv);\n  float h = rand(vec2(floor(uv.x), floor(uy)));\n  float m = length(f - 0.25 - h * 0.5);\n  return smoothstep(0.0, h * 0.25, m * 0.75);\n}\nfloat cloud_alpha(vec2 uv) {\n  float cn = 0.0;\n  for (int i = 0; i < 9; i++)\n    cn += circleNoise((uv * size * 0.3) + (float(i+1) + 10.0) + vec2(time * time_speed, 0.0));\n  return fbm(uv * size + cn + vec2(time * time_speed, 0.0));\n}\nvec2 spherify(vec2 uv) {\n  vec2 c = uv * 2.0 - 1.0;\n  float z = sqrt(1.0 - dot(c, c));\n  return (c / (z + 1.0)) * 0.5 + 0.5;\n}\nvec2 rotate(vec2 coord, float angle) {\n  coord -= 0.5;\n  coord *= mat2(vec2(cos(angle), -sin(angle)), vec2(sin(angle), cos(angle)));\n  return coord + 0.5;\n}\nvoid main() {\n  // Pixelate at full canvas resolution, then remap into disc UV [0,1].\n  // For a 1\u00D7 canvas uv_offset=0 / uv_scale=1 \u2192 identity; for a 3\u00D7 canvas\n  // the disc occupies the center third and is expanded back to [0,1].\n  vec2 uv_raw = floor(UV * pixels) / pixels;\n  vec2 uv = (uv_raw - uv_offset) * uv_scale;\n\n  float d_light  = distance(uv, light_origin);\n  float d_circle = distance(uv, vec2(0.5));\n  float a = step(d_circle, 0.49999);\n  uv = rotate(uv, rotation);\n  uv = spherify(uv);\n  uv.y += smoothstep(0.0, cloud_curve, abs(uv.x - 0.4));\n  float c = cloud_alpha(uv * vec2(1.0, stretch));\n  vec4 col = colors[0];\n  if (c < cloud_cover + 0.03)               col = colors[1];\n  if (d_light + c * 0.2 > light_border_1)   col = colors[2];\n  if (d_light + c * 0.2 > light_border_2)   col = colors[3];\n  fragColor = vec4(col.rgb, step(cloud_cover, c) * a * col.a);\n}";
