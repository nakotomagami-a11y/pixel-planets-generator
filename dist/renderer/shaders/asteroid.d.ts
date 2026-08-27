/**
 * Asteroid shader — freeform irregular rocky mass.
 *
 * Unlike the sphere-based shaders, this does not clip to a circle. Instead,
 * the fbm noise field itself defines the shape: a pixel is visible where
 *   step(0.2, fbm(uv * size) - distance(uv, center)) > 0
 * — i.e. where the noise value exceeds the distance-from-center threshold.
 * This creates organic, non-circular outlines that look like rocks.
 *
 * Lighting is computed by sampling a second offset fbm and comparing it to
 * the first — the difference drives color selection between three tones.
 * Craters are added on top using a circleNoise pattern.
 *
 * Port of Asteroids.gdshader.
 */
export declare const ASTEROID_FRAG_SRC = "#version 300 es\nprecision mediump float;\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2  light_origin;\nuniform int   should_dither;\nuniform float size;\nuniform int   OCTAVES;\nuniform float seed;\nuniform vec4  colors[3]; // mid / dark (shadow) / light (highlight)\nin  vec2 UV;\nlayout(location=0) out vec4 fragColor;\n\nfloat rand(vec2 coord) {\n  coord = mod(coord, vec2(1.0) * round(size));\n  return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 15.5453 * seed);\n}\nfloat noise(vec2 coord) {\n  vec2 i=floor(coord), f=fract(coord);\n  float a=rand(i),b=rand(i+vec2(1,0)),c=rand(i+vec2(0,1)),d=rand(i+vec2(1,1));\n  vec2 u=f*f*(3.0-2.0*f);\n  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;\n}\nfloat fbm(vec2 coord) {\n  float v=0.0,s=0.5;\n  for(int i=0;i<OCTAVES;i++){v+=noise(coord)*s;coord*=2.0;s*=0.5;}\n  return v;\n}\nfloat circleNoise(vec2 uv) {\n  float uy=floor(uv.y); uv.x+=uy*0.31;\n  vec2 f=fract(uv);\n  float h=rand(vec2(floor(uv.x),floor(uy)));\n  float m=length(f-0.25-h*0.5);\n  float r=h*0.25;\n  return smoothstep(r-0.1*r, r, m);\n}\nfloat crater(vec2 uv) {\n  float c=1.0;\n  for(int i=0;i<2;i++) c*=circleNoise((uv*size)+(float(i+1)+10.0));\n  return 1.0-c;\n}\nbool dither(vec2 uv1, vec2 uv2) {\n  return mod(uv1.x+uv2.y, 2.0/pixels) <= 1.0/pixels;\n}\nvec2 rotate(vec2 coord, float angle) {\n  coord-=0.5; coord*=mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle))); return coord+0.5;\n}\nvoid main() {\n  vec2 uv  = floor(UV * pixels) / pixels;\n  bool dith = dither(uv, UV);\n  float d  = distance(uv, vec2(0.5));\n  uv = rotate(uv, rotation);\n  // n: main noise field \u2014 thresholded against d to produce the outline shape\n  float n  = fbm(uv * size);\n  // n2: light-offset noise for directional shading\n  vec2 lo_rot = rotate(light_origin, rotation);\n  float n2 = fbm(uv * size + (lo_rot - 0.5) * 0.5);\n  float n_step  = step(0.2, n  - d);\n  float n2_step = step(0.2, n2 - d);\n  // noise_rel: positive = light side, negative = shadow side\n  float noise_rel = (n2_step + n2) - (n_step + n);\n  float c1 = crater(uv);\n  float c2 = crater(uv + (light_origin - 0.5) * 0.03);\n  vec4 col = colors[1];\n  if (noise_rel < -0.06 || (noise_rel < -0.04 && (dith || should_dither==0))) col = colors[0];\n  if (noise_rel >  0.05 || (noise_rel >  0.03 && (dith || should_dither==0))) col = colors[2];\n  if (c1 > 0.4) col = colors[1];\n  if (c2 < c1)  col = colors[2];\n  fragColor = vec4(col.rgb, n_step * col.a);\n}";
