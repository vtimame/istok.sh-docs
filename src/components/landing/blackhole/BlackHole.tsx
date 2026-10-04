import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { fragmentSource, vertexSource } from "./shader";

type Mode = "auto" | "light" | "ink";

interface BlackHoleProps {
  // "auto" glows in the dark theme and switches to ink dithering in the light one.
  mode?: Mode;
  // Share of the device resolution to render at; the ray tracing is costly.
  quality?: number;
  zoom?: number;
  className?: string;
}

// Interstellar-like warm disc light.
const discColor: [number, number, number] = [1.0, 0.58, 0.26];

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "shader compilation failed");
  }

  return shader;
}

function parseColor(value: string): [number, number, number] {
  // Computed colors come back as rgb()/rgba() or, for oklch tokens, need a canvas round trip.
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.fillStyle = value;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;

  return [r / 255, g / 255, b / 255];
}

export function BlackHole({ mode = "auto", quality = 0.6, zoom = 1.25, className }: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { premultipliedAlpha: false, alpha: true });
    if (!canvas || !gl) {
      return;
    }

    // Program setup: one triangle pair covering the canvas.
    const program = gl.createProgram()!;
    try {
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentSource));
    } catch (error) {
      console.error(error);
      return;
    }
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
      ink: gl.getUniformLocation(program, "uInk"),
      inkColor: gl.getUniformLocation(program, "uInkColor"),
      discColor: gl.getUniformLocation(program, "uDiscColor"),
      zoom: gl.getUniformLocation(program, "uZoom"),
    };

    gl.uniform3fv(uniforms.discColor, discColor);
    gl.uniform1f(uniforms.zoom, zoom);

    // Theme: ink mode uses the page's text color.
    const applyTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      const ink = mode === "ink" || (mode === "auto" && !dark);

      gl.uniform1f(uniforms.ink, ink ? 1 : 0);
      gl.uniform3fv(uniforms.inkColor, parseColor(getComputedStyle(canvas).color));
    };

    const resize = () => {
      const scale = (window.devicePixelRatio || 1) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      gl.uniform1f(uniforms.time, now / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // The loop runs only while the canvas is visible, at about 30 fps.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let running = false;
    let lastDraw = 0;

    const loop = (now: number) => {
      if (!running) return;

      if (now - lastDraw > 33) {
        draw(now);
        lastDraw = now;
      }
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    applyTheme();
    resize();
    draw(performance.now());

    const sizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    sizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibilityObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      applyTheme();
      draw(performance.now());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mode, quality, zoom]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("block size-full text-foreground", className)} />;
}
