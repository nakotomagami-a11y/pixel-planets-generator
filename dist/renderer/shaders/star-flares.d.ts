/**
 * Solar flares shader — outward spiky rays.
 *
 * Renders elongated spiky flares that radiate outward from the star disc.
 * Rendered on the full 2× canvas so flares can extend far outside the disc.
 *
 * Algorithm:
 *  1. Convert UV to polar coordinates (d = distance, angle = atan).
 *  2. fbm noise in polar space creates radially-varying turbulence.
 *  3. The jittered-grid `circle()` function in polar space creates blobs
 *     along rays — the 1/d factor concentrates them near the disc edge.
 *  4. A second fbm sample subtracts noise below a distance threshold,
 *     making the flares sparse near the center and fuller at the tips.
 *  5. Two color slots let the inner and outer parts of each flare differ.
 *
 * Port of StarFlares.gdshader.
 */
export declare const STAR_FLARES_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform float time_speed;\nuniform float rotation;\nuniform int   should_dither;\nuniform vec4  colors[2];   // inner flare / outer flare tint\nuniform float size;\nuniform int   OCTAVES;\nuniform float seed;\nuniform float time;\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat rand(vec2 co) {\n  co = mod(co, vec2(1.0) * round(size));\n  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);\n}\nfloat noise(vec2 coord) {\n  vec2 i=floor(coord), f=fract(coord);\n  float a=rand(i),b=rand(i+vec2(1,0)),c=rand(i+vec2(0,1)),d=rand(i+vec2(1,1));\n  vec2 u=f*f*(3.0-2.0*f);\n  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;\n}\nfloat fbm(vec2 coord) {\n  float v=0.0,s=0.5;\n  for(int i=0;i<OCTAVES;i++){v+=noise(coord)*s;coord*=2.0;s*=0.5;}\n  return v;\n}\nbool dither(vec2 uv1, vec2 uv2) {\n  return mod(uv1.x + uv2.y, 2.0/pixels) <= 1.0/pixels;\n}\nvec2 rotate(vec2 v, float angle) {\n  v -= 0.5;\n  v *= mat2(vec2(cos(angle),-sin(angle)), vec2(sin(angle),cos(angle)));\n  return v + 0.5;\n}\nfloat circle(vec2 uv) {\n  const float ca = 2.0, cs = 1.0;\n  float inv = 1.0 / ca;\n  if (mod(uv.y, inv*2.0) < inv) uv.x += inv * 0.5;\n  vec2 rc = floor(uv * ca) / ca;\n  uv = mod(uv, inv) * ca;\n  float r  = rand(rc);\n  r = clamp(r, inv, 1.0 - inv);\n  float ci = distance(uv, vec2(r));\n  return smoothstep(ci, ci + 0.5, inv * cs * rand(rc * 1.5));\n}\nvoid main() {\n  vec2 pix = floor(UV * pixels) / pixels;\n  bool dith = dither(UV, pix);\n  pix = rotate(pix, rotation);\n  float angle = atan(pix.x - 0.5, pix.y - 0.5) * 0.4; // compress angular freq\n  float d     = distance(pix, vec2(0.5));\n  vec2 cuv    = vec2(d, angle);\n  float n     = fbm(cuv * size - time * time_speed);\n  float nc    = circle(cuv - time * time_speed + n);\n  nc *= 1.5;\n  float n2 = fbm(cuv * size - time + vec2(100.0, 100.0));\n  nc -= n2 * 0.1;\n  float a = 0.0;\n  if (1.0 - d > nc) {\n    if (nc > 0.3 + d && (dith || should_dither == 0)) a = 1.0;\n    else if (nc > 0.3 + d) a = 1.0;\n  }\n  int idx = int(clamp(floor(n2 + nc), 0.0, 1.0));\n  vec4 col = colors[idx];\n  a *= step(n2 * 0.25, d); // suppress flares very close to disc center\n  fragColor = vec4(col.rgb, a * col.a);\n}";
