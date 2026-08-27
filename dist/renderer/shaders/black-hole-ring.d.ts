/**
 * Black hole accretion ring shader.
 *
 * Renders the hot disc of plasma orbiting the black hole. The ring is drawn
 * on the full 3× oversized canvas (same as the body) and composited on top.
 *
 * Key effects:
 *  - `ring_perspective` (14.0) squishes the Y axis to make the disc look
 *    angled / tilted rather than perfectly circular.
 *  - The ring widens slightly on the upper and lower halves to simulate
 *    gravitational lensing bending the ring behind the disc.
 *  - An fbm noise field rotates with time, making the plasma look turbulent.
 *  - A `posterize` step with 4 levels gives the pixelated look.
 *
 * This shader is blended over the body, so the ring appears in front of (and
 * partially obscuring) the dark disc on the upper half.
 *
 * Port of BlackHoleRing.gdshader.
 */
export declare const BH_RING_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform float rotation;\nuniform float time_speed;\nuniform float disk_width;\nuniform float ring_perspective;\nuniform int   should_dither;\nuniform vec4  colors[5];       // posterised ring colors, bright \u2192 dark\nuniform float size;\nuniform int   OCTAVES;\nuniform float seed;\nuniform float time;\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat rand(vec2 coord) {\n  coord = mod(coord, vec2(2.0,1.0) * round(size));\n  return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);\n}\nfloat noise(vec2 coord) {\n  vec2 i=floor(coord), f=fract(coord);\n  float a=rand(i),b=rand(i+vec2(1,0)),c=rand(i+vec2(0,1)),d=rand(i+vec2(1,1));\n  vec2 u=f*f*(3.0-2.0*f);\n  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;\n}\nfloat fbm(vec2 coord) {\n  float v=0.0,s=0.5;\n  for(int i=0;i<OCTAVES;i++){v+=noise(coord)*s;coord*=2.0;s*=0.5;}\n  return v;\n}\nbool dither(vec2 pix, vec2 real) {\n  return mod(pix.x + real.y, 2.0/pixels) <= 1.0/pixels;\n}\nvec2 rotate(vec2 coord, float angle) {\n  coord-=0.5; coord*=mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle))); return coord+0.5;\n}\nvoid main() {\n  vec2 uv  = floor(UV * pixels) / pixels;\n  bool dith = dither(UV, uv);\n  uv = rotate(uv, rotation);\n  vec2 uv2 = uv;\n  // Widen slightly on X to reduce perfect-circle symmetry\n  uv.x -= 0.5; uv.x *= 1.3; uv.x += 0.5;\n  uv = rotate(uv, sin(time * time_speed * 2.0) * 0.01);\n  vec2 l_origin = vec2(0.5);\n  float d_width  = disk_width;\n  // Perspective warp: upper/lower half shifts y inward, increasing ring width\n  if (uv.y < 0.5) {\n    uv.y      += smoothstep(distance(vec2(0.5), uv), 0.5, 0.2);\n    d_width    += smoothstep(distance(vec2(0.5), uv), 0.5, 0.3);\n    l_origin.y -= smoothstep(distance(vec2(0.5), uv), 0.5, 0.2);\n  } else if (uv.y > 0.53) {\n    uv.y      -= smoothstep(distance(vec2(0.5), uv), 0.4, 0.17);\n    d_width    += smoothstep(distance(vec2(0.5), uv), 0.5, 0.2);\n    l_origin.y += smoothstep(distance(vec2(0.5), uv), 0.5, 0.2);\n  }\n  float light_d  = distance(uv2 * vec2(1.0, ring_perspective), l_origin * vec2(1.0, ring_perspective)) * 0.3;\n  vec2 uv_center = uv - vec2(0.0, 0.5);\n  uv_center     *= vec2(1.0, ring_perspective);\n  float center_d = distance(uv_center, vec2(0.5, 0.0));\n  float disk     = smoothstep(0.1 - d_width*2.0, 0.5 - d_width, center_d);\n  disk          *= smoothstep(center_d - d_width, center_d, 0.4);\n  // Rotate the fbm in the ring plane over time for plasma turbulence\n  uv_center = rotate(uv_center + vec2(0.0, 0.5), time * time_speed * 3.0);\n  disk *= pow(max(fbm(uv_center * size), 0.0001), 0.5);\n  if (dith || should_dither == 0) disk *= 1.2;\n  // Posterise into 4 discrete color bands\n  float n_post    = 4.0;\n  float posterized = min(floor((disk + light_d) * n_post), n_post);\n  vec4 col = colors[int(posterized)];\n  fragColor = vec4(col.rgb, step(0.15, disk) * col.a);\n}";
