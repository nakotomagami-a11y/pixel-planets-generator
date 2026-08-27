/**
 * Crater overlay shader.
 *
 * Draws craters on top of the rock layer. Each crater is built from two
 * circleNoise samples: one for the crater shape (c1) and a second offset
 * towards the light source (c2) for the shadow/highlight on the crater rim.
 *
 * The result is composited with alpha — pixels outside craters are
 * transparent so the rock layer below shows through.
 *
 * Port of Craters.gdshader.
 */
export declare const CRATERS_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2  light_origin;\nuniform float time_speed;\nuniform float light_border;\nuniform vec4  colors[2];\nuniform float size;\nuniform float seed;\nuniform float time;\nuniform float uv_offset;   // remap for oversized canvas (0 when canvasScale=1)\nuniform float uv_scale;    // = 1/(2*planetR) (1 when canvasScale=1)\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat rand(vec2 coord) {\n  coord = mod(coord, vec2(1.0) * round(size));\n  return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);\n}\nfloat circleNoise(vec2 uv) {\n  float uy = floor(uv.y); uv.x += uy * 0.31;\n  vec2 f = fract(uv);\n  float h = rand(vec2(floor(uv.x), floor(uy)));\n  float m = length(f - 0.25 - h * 0.5);\n  float r = h * 0.25;\n  return smoothstep(r - 0.1*r, r, m);\n}\nfloat crater(vec2 uv) {\n  float c = 1.0;\n  for (int i = 0; i < 2; i++)\n    c *= circleNoise((uv * size) + (float(i+1) + 10.0) + vec2(time * time_speed, 0.0));\n  return 1.0 - c;\n}\nvec2 spherify(vec2 uv) {\n  vec2 c = uv*2.0-1.0; float z = sqrt(1.0-dot(c,c)); return (c/(z+1.0))*0.5+0.5;\n}\nvec2 rotate(vec2 coord, float angle) {\n  coord -= 0.5;\n  coord *= mat2(vec2(cos(angle),-sin(angle)), vec2(sin(angle),cos(angle)));\n  return coord + 0.5;\n}\nvoid main() {\n  vec2 uv_raw = floor(UV * pixels) / pixels;\n  vec2 uv = (uv_raw - uv_offset) * uv_scale;\n  float d_circle = distance(uv, vec2(0.5));\n  float d_light  = distance(uv, light_origin);\n  float a = step(d_circle, 0.49999);\n  uv = rotate(uv, rotation);\n  uv = spherify(uv);\n  float c1 = crater(uv);\n  float c2 = crater(uv + (light_origin - 0.5) * 0.03);\n  vec4 col = colors[0];\n  a *= step(0.5, c1);\n  if (c2 < c1 - (0.5 - d_light) * 2.0) col = colors[1];\n  if (d_light > light_border) col = colors[1];\n  a *= step(d_circle, 0.5);\n  fragColor = vec4(col.rgb, a * col.a);\n}";
