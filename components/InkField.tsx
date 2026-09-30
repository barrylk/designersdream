"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

// Three process inks folding into each other: domain-warped fbm, with a swirl around the cursor.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uFade;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float aspect = uRes.x / uRes.y;
  vec2 m = uMouse * vec2(aspect, 1.0);
  float t = uTime * 0.05;

  vec2 p = uv * 1.35 + vec2(0.0, t * 0.6);
  vec2 d = uv - m;
  float fall = exp(-dot(d, d) * 5.0);
  p += vec2(-d.y, d.x) * fall * 0.9;

  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + 1.3 * t),
                fbm(p + 3.2 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 2.6 * r);

  vec3 ink = vec3(0.051, 0.063, 0.188);
  vec3 cyan = vec3(0.224, 0.835, 0.941);
  vec3 mag = vec3(1.0, 0.247, 0.643);
  vec3 yel = vec3(1.0, 0.831, 0.231);

  vec3 col = ink;
  col = mix(col, cyan, smoothstep(0.42, 0.82, q.x) * 0.9);
  col = mix(col, mag, smoothstep(0.48, 0.86, r.y) * 0.85);
  col = mix(col, yel, smoothstep(0.66, 0.92, f * (0.8 + 0.4 * q.y)) * 0.75);

  // Let deep ink win in the folds so colour reads as pooled pigment, not a gradient.
  float body = smoothstep(0.32, 0.78, f + 0.18 * length(q) - 0.05);
  col = mix(ink, col, body);

  // Soft ink sheen along the folds
  col += 0.06 * smoothstep(0.55, 0.6, f) * (1.0 - smoothstep(0.6, 0.66, f));

  vec2 vu = gl_FragCoord.xy / uRes;
  col = mix(ink, col, 0.55 + 0.45 * smoothstep(0.05, 0.75, vu.y));
  col = mix(ink, col, uFade);
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function InkField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.style.background =
        "radial-gradient(60% 50% at 25% 30%, #39d5f0aa, transparent 70%), radial-gradient(50% 50% at 75% 40%, #ff3fa4aa, transparent 70%), radial-gradient(40% 40% at 55% 75%, #ffd43b88, transparent 70%), #0d1030";
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uFade = gl.getUniformLocation(prog, "uFade");

    // Render below native resolution: ink is soft, and this keeps phones cool.
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0.62, y: 0.55, tx: 0.62, ty: 0.55 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const start = performance.now();
    let raf = 0;
    const draw = (time: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uFade, Math.min(1, (performance.now() - start) / 1400));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      draw(12 + (performance.now() - start) / 1000);
      raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      gl.uniform1f(uFade, 1);
      draw(18);
    } else {
      raf = requestAnimationFrame(frame);
    }
    const onVis = () => {
      if (!document.hidden && !raf && !reduce) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
