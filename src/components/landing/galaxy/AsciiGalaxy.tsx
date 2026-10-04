import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { agentAngle, agents, nextPulse, pulseDuration, type Pulse } from "./agents";
import { defaultShape, density, hash, ramp } from "./field";

interface AsciiGalaxyProps {
  // Font size of one character cell, in CSS pixels.
  fontSize?: number;
  // Radians the disc turns per second at its rim.
  speed?: number;
  showLabels?: boolean;
  className?: string;
}

interface Palette {
  ink: string;
  muted: string;
  core: string;
  coreBright: string;
}

// The canvas takes its colors from the site theme and redraws when it changes.
function readPalette(element: HTMLElement): Palette {
  const dark = document.documentElement.classList.contains("dark");
  const style = getComputedStyle(element);

  return {
    ink: style.color,
    muted: style.getPropertyValue("--muted-foreground").trim() || style.color,
    core: dark ? "#10b981" : "#059669",
    coreBright: dark ? "#6ee7b7" : "#047857",
  };
}

export function AsciiGalaxy({ fontSize = 11, speed = 0.06, showLabels = true, className }: AsciiGalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let palette = readPalette(canvas);
    let width = 0;
    let height = 0;
    let cellWidth = 0;
    let cellHeight = 0;

    let frame = 0;
    let running = false;
    let lastDraw = 0;
    let pulse: Pulse = nextPulse(performance.now(), null);
    let coreFlashUntil = 0;

    // Sizing: the canvas fills its box at the device pixel ratio.
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      context.font = `${fontSize}px "Geist Mono", ui-monospace, monospace`;
      cellWidth = context.measureText("M").width;
      cellHeight = fontSize * 1.2;
    };

    const draw = (now: number) => {
      const rotation = (now / 1000) * speed;
      const tilt = defaultShape.tilt;
      const radius = Math.min(width / 2, height / (2 * tilt)) * 0.78;
      const centerX = width / 2;
      const centerY = height / 2;

      context.clearRect(0, 0, width, height);
      context.font = `${fontSize}px "Geist Mono", ui-monospace, monospace`;
      context.textBaseline = "middle";
      context.textAlign = "center";

      // Cells are grouped by character so each group is drawn with one style.
      const columns = Math.ceil(width / cellWidth);
      const rows = Math.ceil(height / cellHeight);
      const levels: number[][] = ramp.split("").map(() => []);
      const coreCells: number[] = [];
      const sparkles: number[] = [];

      const flash = now < coreFlashUntil ? (coreFlashUntil - now) / 500 : 0;

      for (let row = 0; row < rows; row++) {
        const y = (row + 0.5) * cellHeight;
        const galaxyY = (y - centerY) / (radius * tilt);

        for (let column = 0; column < columns; column++) {
          const x = (column + 0.5) * cellWidth;
          const galaxyX = (x - centerX) / radius;

          const value = density(galaxyX, galaxyY, rotation, defaultShape);
          const noise = hash(column, row);

          // Grain keeps the disc from looking like a smooth gradient; below
          // the threshold only scattered dust remains, so the arms stand out.
          const grained = value * (0.8 + 0.4 * noise);
          const visible = grained > 0.09 || (grained > 0.03 && noise > 0.82);
          // The square root lifts mid densities, so arms read as solid strokes.
          const level = visible ? Math.min(ramp.length - 1, Math.max(1, Math.floor(Math.sqrt(grained) * (ramp.length - 1) + flash * 2))) : 0;

          if (Math.hypot(galaxyX, galaxyY) < 0.16 && level > 0) {
            coreCells.push(column, row, level);
            continue;
          }
          if (level > 0) {
            levels[level].push(column, row);
            continue;
          }

          // A few distant stars twinkle in the empty space.
          if (noise > 0.992) {
            sparkles.push(column, row, noise);
          }
        }
      }

      levels.forEach((cells, level) => {
        if (level === 0 || cells.length === 0) return;

        context.fillStyle = palette.ink;
        context.globalAlpha = 0.18 + (0.62 * level) / (ramp.length - 1);
        for (let index = 0; index < cells.length; index += 2) {
          context.fillText(ramp[level], (cells[index] + 0.5) * cellWidth, (cells[index + 1] + 0.5) * cellHeight);
        }
      });

      context.fillStyle = flash > 0 ? palette.coreBright : palette.core;
      for (let index = 0; index < coreCells.length; index += 3) {
        context.globalAlpha = 0.55 + 0.45 * (coreCells[index + 2] / (ramp.length - 1));
        context.fillText(ramp[coreCells[index + 2]], (coreCells[index] + 0.5) * cellWidth, (coreCells[index + 1] + 0.5) * cellHeight);
      }

      context.fillStyle = palette.ink;
      for (let index = 0; index < sparkles.length; index += 3) {
        const seed = sparkles[index + 2] * 1000;
        context.globalAlpha = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(now / 900 + seed));
        context.fillText("·", (sparkles[index] + 0.5) * cellWidth, (sparkles[index + 1] + 0.5) * cellHeight);
      }

      // Agents and the work they send to the core.
      const positions = agents.map((agent) => {
        const angle = agentAngle(agent, rotation);

        return {
          x: centerX + Math.cos(angle) * agent.radius * radius,
          y: centerY + Math.sin(angle) * agent.radius * radius * tilt,
        };
      });

      if (now >= pulse.startedAt) {
        const progress = (now - pulse.startedAt) / pulseDuration;

        if (progress >= 1) {
          coreFlashUntil = now + 500;
          pulse = nextPulse(now, pulse);
        } else {
          const from = positions[pulse.agent];
          const eased = progress * progress * (3 - 2 * progress);

          context.fillStyle = palette.core;
          for (let trail = 0; trail < 6; trail++) {
            const point = Math.max(0, eased - trail * 0.035);
            context.globalAlpha = 1 - trail / 6;
            context.fillText(trail === 0 ? "●" : "·", from.x + (centerX - from.x) * point, from.y + (centerY - from.y) * point);
          }
        }
      }

      context.textAlign = "left";
      agents.forEach((agent, index) => {
        const { x, y } = positions[index];

        // A clear patch under the dot and its label keeps them readable over the arms.
        const labelWidth = showLabels ? context.measureText(agent.name).width + cellWidth * 1.5 : 0;
        context.clearRect(x - cellWidth * 1.2, y - cellHeight * 0.6, cellWidth * 1.6 + labelWidth, cellHeight * 1.2);

        context.globalAlpha = 1;
        context.fillStyle = agent.color === "currentColor" ? palette.ink : agent.color;
        context.fillText("●", x - cellWidth / 2, y);

        if (showLabels) {
          context.globalAlpha = 0.85;
          context.fillStyle = palette.muted;
          context.fillText(agent.name, x + cellWidth, y);
        }
      });

      context.globalAlpha = 1;
    };

    // The loop runs only while the galaxy is on screen, at about 30 fps.
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
      palette = readPalette(canvas);
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
  }, [fontSize, speed, showLabels]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("block size-full text-foreground", className)} />;
}
