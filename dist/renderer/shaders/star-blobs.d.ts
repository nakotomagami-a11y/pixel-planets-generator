/**
 * Star blob corona shader — loose halo of circular blobs.
 *
 * Creates an organic-looking corona of overlapping circular blobs that drift
 * outward from the star body. Rendered on the full 2× canvas so they can
 * extend well outside the star disc boundary.
 *
 * The `circle()` function places randomly-sized circles on a jittered grid
 * (offset by `mod(row, 2)` for hex packing). Accumulating 15 such circles
 * with different offsets produces a fuzzy blob field. Pixels are visible only
 * where the accumulated value — minus distance from center — exceeds 0.07.
 *
 * Port of StarBlobs.gdshader.
 */
export declare const STAR_BLOBS_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform float time_speed;\nuniform float rotation;\nuniform vec4  colors[1];  // single tint color for all blobs\nuniform float size;\nuniform int   OCTAVES;\nuniform float seed;\nuniform float time;\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat rand(vec2 co) {\n  co = mod(co, vec2(1.0) * round(size));\n  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);\n}\nfloat noise(vec2 coord) {\n  vec2 i=floor(coord), f=fract(coord);\n  float a=rand(i),b=rand(i+vec2(1,0)),c=rand(i+vec2(0,1)),d=rand(i+vec2(1,1));\n  vec2 u=f*f*(3.0-2.0*f);\n  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;\n}\nvec2 rotate(vec2 v, float angle) {\n  v -= 0.5;\n  v *= mat2(vec2(cos(angle),-sin(angle)), vec2(sin(angle),cos(angle)));\n  return v + 0.5;\n}\n// Jittered-grid circle field: for each cell, pick a random radius and\n// smoothstep into it. The hex offset (mod row) prevents grid aliasing.\nfloat circle(vec2 uv) {\n  const float ca = 2.0, cs = 1.0;\n  float inv = 1.0 / ca;\n  if (mod(uv.y, inv*2.0) < inv) uv.x += inv * 0.5; // hex row offset\n  vec2 rc = floor(uv * ca) / ca;\n  uv = mod(uv, inv) * ca;\n  float r  = rand(rc);\n  r = clamp(r, inv, 1.0 - inv);\n  float ci = distance(uv, vec2(r));\n  return smoothstep(ci, ci + 0.5, inv * cs * rand(rc * 1.5));\n}\nvoid main() {\n  vec2 pix = floor(UV * pixels) / pixels;\n  vec2 uv  = rotate(pix, rotation);\n  float angle = atan(uv.x - 0.5, uv.y - 0.5);\n  float d     = distance(pix, vec2(0.5));\n  float c = 0.0;\n  for (int i = 0; i < 15; i++) {\n    float r    = rand(vec2(float(i)));\n    vec2  cuv  = vec2(d, angle);\n    c += circle(cuv * size - time * time_speed - (1.0 / max(d, 0.001)) * 0.1 + r);\n  }\n  c *= 0.37 - d;\n  c  = step(0.07, c - d);\n  fragColor = vec4(colors[0].rgb, c * colors[0].a);\n}";
