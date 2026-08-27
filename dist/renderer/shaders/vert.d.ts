/**
 * Shared vertex shader for all planet draw calls.
 *
 * We render a full-screen unit quad (two triangles covering NDC [-1,1]²).
 * UV coordinates are flipped on Y so that UV=(0,0) is the top-left of the
 * canvas, matching the convention used by all fragment shaders below.
 */
export declare const VERT_SRC = "#version 300 es\nprecision mediump float;\n\nin vec2 a_pos; // NDC position [-1, 1]\nin vec2 a_uv;  // texcoord [0, 1], origin bottom-left from buffer\n\nout vec2 UV;   // passed to fragment shader, origin top-left\n\nvoid main() {\n  gl_Position = vec4(a_pos, 0.0, 1.0);\n  UV = vec2(a_uv.x, 1.0 - a_uv.y);\n}";
