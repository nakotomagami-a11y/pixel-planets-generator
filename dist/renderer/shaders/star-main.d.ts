/**
 * Star surface shader — Voronoi cell noise mapped onto a sphere.
 *
 * Renders the visible star disc using Worley / Voronoi noise (nearest-point
 * distance), which naturally creates the granulated, convective-cell texture
 * seen on real stars. Two Cells() samples are multiplied together to break
 * the obvious hex-grid pattern.
 *
 * Like the black-hole body shader, this renders in the CENTER HALF of a 2×
 * canvas. UV remapping via `uv_offset` and `uv_scale` maps the full [0,1]
 * UV range to the center half before sphere-mapping:
 *   mapped = (UV - uv_offset) * uv_scale
 * where uv_offset = 0.25 and uv_scale = 2.0 for a 2× canvas.
 * Pixels outside the center region are discarded (transparent).
 *
 * Port of Star.gdshader.
 */
export declare const STAR_MAIN_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform float time_speed;\nuniform float rotation;\nuniform vec4  colors[4];   // bright core \u2192 mid \u2192 dim \u2192 dark limb\nuniform int   should_dither;\nuniform float size;\nuniform float seed;\nuniform float time;\nuniform float uv_offset;   // = (canvasScale-1) / (2*canvasScale)\nuniform float uv_scale;    // = canvasScale\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\n// Voronoi / Worley noise: returns distance to nearest random feature point.\n// Hash2 maps grid cells to 2D feature-point offsets in [0,1]\u00B2.\nvec2 Hash2(vec2 p) {\n  float r = 523.0 * sin(dot(p, vec2(53.3158, 43.6143)));\n  return vec2(fract(15.32354 * r), fract(17.25865 * r));\n}\nfloat Cells(vec2 p, float numCells) {\n  p *= numCells;\n  float d = 1.0e10;\n  for (int xo = -1; xo <= 1; xo++) {\n    for (int yo = -1; yo <= 1; yo++) {\n      vec2 tp = floor(p) + vec2(float(xo), float(yo));\n      tp = p - tp - Hash2(mod(tp, numCells));\n      d = min(d, dot(tp, tp));\n    }\n  }\n  return sqrt(d);\n}\nbool dither(vec2 uv1, vec2 uv2) {\n  return mod(uv1.x + uv2.y, 2.0/pixels) <= 1.0/pixels;\n}\nvec2 rotate(vec2 v, float angle) {\n  v -= 0.5;\n  v *= mat2(vec2(cos(angle),-sin(angle)), vec2(sin(angle),cos(angle)));\n  return v + 0.5;\n}\nvec2 spherify(vec2 uv) {\n  vec2 c = uv*2.0-1.0; float z2=1.0-dot(c,c);\n  if (z2 < 0.0) return uv;\n  return (c/(sqrt(z2)+1.0))*0.5+0.5;\n}\nvoid main() {\n  // Map UV into center sub-region of the oversized canvas\n  vec2 mapped = (UV - uv_offset) * uv_scale;\n  if (any(lessThan(mapped, vec2(0.0))) || any(greaterThan(mapped, vec2(1.0)))) {\n    fragColor = vec4(0.0); return;\n  }\n  vec2 pix  = floor(mapped * pixels) / pixels;\n  float a   = step(distance(pix, vec2(0.5)), 0.49999);\n  bool dith = dither(mapped, pix);\n  pix = rotate(pix, rotation);\n  pix = spherify(pix);\n  // Two Cells samples at different frequencies, multiplied to break hex symmetry\n  float n = Cells(pix - vec2(time * time_speed * 2.0, 0.0), 10.0);\n  n *= Cells(pix - vec2(time * time_speed * 1.0, 0.0), 20.0);\n  n *= 2.0;\n  n = clamp(n, 0.0, 1.0);\n  if (dith || should_dither == 0) n *= 1.3;\n  // Map noise to one of 4 color bands\n  float interp = floor(n * 3.0) / 3.0;\n  vec4 col = colors[int(clamp(interp * 3.0, 0.0, 3.0))];\n  fragColor = vec4(col.rgb, a * col.a);\n}";
