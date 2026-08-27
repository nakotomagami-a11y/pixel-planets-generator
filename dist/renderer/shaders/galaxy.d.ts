/**
 * Spiral galaxy shader — freeform tilted disc.
 *
 * Simulates a pixelated top-down view of a spiral galaxy with:
 *  - `zoom`  (1.375) — scale the UV before tilt so the galaxy fills the canvas
 *  - `tilt`  (3.0)   — Y-axis scale that flattens the disc into an ellipse
 *  - `swirl` (-9.0)  — rotation amount that increases with distance from center,
 *                       creating spiral arm curvature
 *  - `n_colors` (6)  — number of discrete color bands (the 7th array slot is
 *                       the background; see palettes/galaxy.ts for why 7 colors)
 *
 * The shape boundary uses `step(f2 + d2, 0.7)` — pixels closer to the galaxy
 * center or with higher fbm values are visible; outer pixels are transparent.
 * Because nothing clips to a circle, the galaxy has a natural elliptical
 * silhouette that bleeds into transparency.
 *
 * Port of Galaxy.gdshader.
 */
export declare const GALAXY_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform float rotation;\nuniform float time_speed;\nuniform int   should_dither;\nuniform vec4  colors[7]; // 6 visible levels + 1 background (never visible but avoids OOB)\nuniform float size;\nuniform int   OCTAVES;\nuniform float seed;\nuniform float time;\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat rand(vec2 coord) {\n  return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);\n}\nfloat noise(vec2 coord) {\n  vec2 i=floor(coord), f=fract(coord);\n  float a=rand(i),b=rand(i+vec2(1,0)),c=rand(i+vec2(0,1)),d=rand(i+vec2(1,1));\n  vec2 u=f*f*(3.0-2.0*f);\n  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;\n}\nfloat fbm(vec2 coord) {\n  float v=0.0,s=0.5;\n  for(int i=0;i<OCTAVES;i++){v+=noise(coord)*s;coord*=2.0;s*=0.5;}\n  return v;\n}\nvec2 rotate(vec2 coord, float angle) {\n  coord-=0.5; coord*=mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle))); return coord+0.5;\n}\nbool dither(vec2 uv1, vec2 uv2) {\n  return mod(uv1.x + uv2.y, 2.0/pixels) <= 1.0/pixels;\n}\nvoid main() {\n  vec2 uv = floor(UV * pixels) / pixels;\n  bool dith = dither(uv, UV);\n  const float zoom  = 1.375;\n  const float tilt  = 3.0;\n  const float swirl = -9.0;\n  const int   n_colors = 6;\n  // Zoom in so the spiral fills the canvas, then apply user rotation\n  uv = uv * zoom - (zoom - 1.0) / 2.0;\n  uv = rotate(uv, rotation);\n  vec2 uv2 = uv;\n  // Tilt the disc into an ellipse\n  uv.y  = uv.y  * tilt - (tilt - 1.0) / 2.0;\n  // First fbm pass: coarse spiral structure\n  float d1   = distance(uv, vec2(0.5));\n  float rot1 = swirl * pow(max(d1, 0.0001), 0.4);\n  vec2 ruv   = rotate(uv, rot1 + time * time_speed);\n  float f1   = fbm(ruv * size);\n  f1 = floor(f1 * 4.0) / 4.0; // quantise for stepping disc height\n  // Second fbm pass: fine spiral detail with layer offset\n  uv2.y = uv2.y * tilt - (tilt - 1.0) / 2.0 + f1 * 0.4;\n  float d2   = distance(uv2, vec2(0.5));\n  float rot2 = swirl * pow(max(d2, 0.0001), 0.4);\n  vec2 ruv2  = rotate(uv2, rot2 + time * time_speed);\n  float f2   = fbm(ruv2 * size + vec2(f1) * 10.0);\n  float a    = step(f2 + d2, 0.7);\n  f2 *= 2.3;\n  if (should_dither == 1 && dith) f2 *= 0.94;\n  f2 = min(floor(f2 * float(n_colors)), float(n_colors));\n  fragColor = vec4(colors[int(f2)].rgb, a * colors[int(f2)].a);\n}";
