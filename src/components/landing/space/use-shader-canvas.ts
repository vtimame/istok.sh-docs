import { useEffect, type RefObject } from "react";

// Shared plumbing for the full-canvas fragment shaders on the landing page:
// compiling, sizing, theme colors and a loop that only runs while visible.
//
// Every shader gets uResolution, uTime, uInk (1 for 1-bit ink dithering in the
// light theme) and uInkColor (the page's text color), plus its own constants.

export type ShaderMode = "auto" | "light" | "ink";

export interface ShaderOptions {
  fragmentSource: string;
  mode?: ShaderMode;
  // Share of the device resolution to render at.
  quality?: number;
  constants?: Record<string, number | number[]>;
  // Called after each frame, for overlays drawn in CSS pixels.
  onFrame?: (now: number) => void;
}

const vertexSource = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "shader compilation failed");
  }

  return shader;
}

// Computed colors may be oklch; a 1×1 canvas turns any CSS color into RGB.
export function cssColorToRgb(value: string): [number, number, number] {
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.fillStyle = value;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;

  return [r / 255, g / 255, b / 255];
}

export function isDarkTheme() {
  return document.documentElement.classList.contains("dark");
}

export function useShaderCanvas(canvasRef: RefObject<HTMLCanvasElement | null>, options: ShaderOptions) {
  const { fragmentSource, mode = "auto", quality = 0.6, constants = {}, onFrame } = options;
  const constantsKey = JSON.stringify(constants);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { premultipliedAlpha: false, alpha: true });
    if (!canvas || !gl) {
      return;
    }

    // Program: two triangles covering the canvas.
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

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const location = (name: string) => gl.getUniformLocation(program, name);

    for (const [name, value] of Object.entries(JSON.parse(constantsKey) as Record<string, number | number[]>)) {
      if (typeof value === "number") gl.uniform1f(location(name), value);
      else if (value.length === 2) gl.uniform2fv(location(name), value);
      else if (value.length === 3) gl.uniform3fv(location(name), value);
    }

    // Theme and size.
    const applyTheme = () => {
      const ink = mode === "ink" || (mode === "auto" && !isDarkTheme());

      gl.uniform1f(location("uInk"), ink ? 1 : 0);
      gl.uniform3fv(location("uInkColor"), cssColorToRgb(getComputedStyle(canvas).color));
    };

    const resize = () => {
      const scale = (window.devicePixelRatio || 1) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(location("uResolution"), canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      gl.uniform1f(location("uTime"), now / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      onFrame?.(now);
    };

    // Loop: about 30 fps, only while on screen and the tab is visible.
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
  }, [canvasRef, fragmentSource, mode, quality, constantsKey, onFrame]);
}
