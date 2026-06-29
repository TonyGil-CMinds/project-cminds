"use client";

import { useEffect, useRef } from "react";

interface HexPatternProps {
  className?: string;
}

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec2  u_resolution;
uniform float u_time;

#define PI 3.14159265358979
#define HEX_SIZE 42.0
#define BORDER    1.2

vec2 hexCenter(vec2 p, float s) {
  float w = s * 2.0;
  float h = s * sqrt(3.0);
  vec2 grid = vec2(w * 0.75, h);
  vec2 offset = vec2(0.0, h * 0.5);
  vec2 q = mod(p, grid);
  vec2 r = mod(p + offset, grid);
  vec2 qc = q - vec2(w * 0.5, h * 0.5);
  vec2 rc = r - vec2(w * 0.5, h * 0.5);
  if (dot(qc, qc) < dot(rc, rc)) {
    return p - q + vec2(w * 0.5, h * 0.5);
  } else {
    return p - r + vec2(w * 0.5, h * 0.5);
  }
}

float hexDist(vec2 p, float s) {
  p = abs(p);
  float q = p.x + p.y * 0.57735;
  return max(q, p.x);
}

void main() {
  vec2 uv = gl_FragCoord.xy;
  /* slow drift */
  uv += vec2(sin(u_time * 0.07) * 18.0, cos(u_time * 0.05) * 14.0);

  vec2 center = hexCenter(uv, HEX_SIZE);
  vec2 local  = uv - center;
  float d = hexDist(local, HEX_SIZE);
  float edge = HEX_SIZE - BORDER;

  /* fade by distance from viewport center */
  vec2 norm = (gl_FragCoord.xy / u_resolution - 0.5) * 2.0;
  float radial = 1.0 - smoothstep(0.55, 1.05, length(norm));

  /* subtle per-hex pulse keyed on center position */
  float pulse = 0.5 + 0.5 * sin(u_time * 0.4 + center.x * 0.031 + center.y * 0.019);
  float alpha = smoothstep(edge, edge - 0.8, d) * (0.06 + 0.07 * pulse) * radial;

  /* green-ish tint matching the brand palette */
  vec3 col = vec3(0.55, 0.76, 0.18);
  gl_FragColor = vec4(col, alpha);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function HexPattern({ className }: HexPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const vert = compileShader(gl, gl.VERTEX_SHADER,   VERT);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, "a_position");
    const resLoc = gl.getUniformLocation(prog, "u_resolution");
    const timeLoc = gl.getUniformLocation(prog, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let rafId = 0;
    let start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      resize();
      const t = (performance.now() - start) / 1000;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, t);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      gl.deleteProgram(prog);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
