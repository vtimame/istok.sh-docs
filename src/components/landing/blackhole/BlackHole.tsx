import { useRef } from "react";

import { cn } from "@/lib/utils";

import { useShaderCanvas, type ShaderMode } from "../space/use-shader-canvas";
import { fragmentSource } from "./shader";

interface BlackHoleProps {
  // "auto" glows in the dark theme and switches to ink dithering in the light one.
  mode?: ShaderMode;
  // Share of the device resolution to render at; the ray tracing is costly.
  quality?: number;
  zoom?: number;
  className?: string;
}

export function BlackHole({ mode = "auto", quality = 0.6, zoom = 1.25, className }: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interstellar-like warm disc light.
  useShaderCanvas(canvasRef, {
    fragmentSource,
    mode,
    quality,
    constants: { uDiscColor: [1.0, 0.58, 0.26], uZoom: zoom },
  });

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("block size-full text-foreground", className)} />;
}
