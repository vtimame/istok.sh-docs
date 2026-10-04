import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { orbitingAgents, orbitSpeed } from "./agents";
import { buildSymmetricStreamlines, flowSpeed, pointAt, spawn, type Point, type Streak, type Streamline } from "./flow";
import { readPalette, type Palette } from "./palette";

// The hero visual: the Istok mark as a gravity well. Light streams past it
// from left to right and bends around it, and coding agents orbit it on tilted
// paths, passing behind the mark on the far side. On first sight the mark
// grows, its rings unfold, the light draws outwards and the agents swing into
// their orbits fast before settling.

interface GravityWellProps {
  className?: string;
}

const markRatios = [1, 0.8, 0.6, 0.4, 0.2];
const markOpacities = [0.1, 0.3, 0.5, 0.8, 1];

// Orbits are circles seen at an angle; the squash reads as tilt.
const tilt = 0.38;
const streakCount = 90;

// Intro timing, in milliseconds after the canvas first comes into view.
const markDuration = 650;
const ringStart = 180;
const ringStagger = 120;
const ringDuration = 900;
const lightStart = 350;
const lightStagger = 14;
const lightDuration = 1100;
const streakStart = 800;
const agentStart = 400;
const agentRevealDuration = 1400;
const spinDuration = 2600;
const extraSpin = 6;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

// Relative luminance of a #rrggbb color, to swap marks that vanish on the page.
function luminance(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

const icons = orbitingAgents.map((agent) => (agent.icon ? new Path2D(agent.icon) : null));

export function GravityWell({ className }: GravityWellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let radius = 0;
    let lines: Streamline[] = [];
    let streaks: Streak[] = [];
    let palette: Palette = readPalette(canvas, "brand");

    let introAt: number | null = reducedMotion ? -Infinity : null;
    const angles = orbitingAgents.map((agent) => agent.phase);

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      radius = Math.min(width, height) * 0.145;
      lines = buildSymmetricStreamlines(width + 40, radius, (height / 2) * 1.05);
      streaks = Array.from({ length: streakCount }, () => {
        const streak = spawn(lines);
        streak.distance = Math.random() * lines[streak.line].lengths.at(-1)!;
        return streak;
      });
    };

    // Plane coordinates have y up and the origin in the well's center.
    const toScreen = (point: Point): Point => ({ x: width / 2 + point.x, y: height / 2 - point.y });

    const agentColor = (index: number) => {
      const color = orbitingAgents[index].color;
      if (color === "ink") return palette.ink;

      const light = luminance(color);
      if ((palette.dark && light < 0.2) || (!palette.dark && light > 0.8)) return palette.ink;
      return color;
    };

    const drawLines = (elapsed: number) => {
      context.lineWidth = 1;

      lines.forEach((line, index) => {
        const reveal = easeOutCubic(clamp((elapsed - lightStart - index * lightStagger) / lightDuration));
        if (reveal <= 0) return;

        const depth = index / lines.length;
        const reach = (reveal * (width + 40)) / 2;
        context.globalAlpha = (0.04 + 0.1 * (1 - depth)) * reveal;
        context.strokeStyle = palette.line(depth);
        context.beginPath();

        let started = false;
        for (const point of line.points) {
          if (Math.abs(point.x) > reach) continue;
          const { x, y } = toScreen(point);
          if (!started) {
            context.moveTo(x, y);
            started = true;
          } else {
            context.lineTo(x, y);
          }
        }
        context.stroke();
      });
    };

    const drawStreaks = (elapsed: number, delta: number) => {
      const shown = clamp((elapsed - streakStart) / 400);
      if (shown <= 0) return;

      context.lineCap = "round";
      context.lineWidth = 1.3;

      streaks.forEach((streak, index) => {
        const line = lines[streak.line];
        const total = line.lengths.at(-1)!;

        const here = pointAt(line, Math.max(0, streak.distance));
        streak.distance += streak.speed * flowSpeed(here, radius) * delta;

        if (streak.distance - streak.length > total) {
          streaks[index] = spawn(lines);
          return;
        }

        const head = toScreen(pointAt(line, Math.min(total, Math.max(0, streak.distance))));
        const middle = toScreen(pointAt(line, Math.max(0, streak.distance - streak.length / 2)));
        const tail = toScreen(pointAt(line, Math.max(0, streak.distance - streak.length)));

        const gradient = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, palette.streak(streak.shade));

        context.globalAlpha = streak.alpha * shown * 0.85;
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(tail.x, tail.y);
        context.quadraticCurveTo(middle.x, middle.y, head.x, head.y);
        context.stroke();
      });

      context.globalAlpha = 1;
    };

    const drawOrbits = (elapsed: number) => {
      const reveal = easeOutCubic(clamp((elapsed - agentStart) / agentRevealDuration));
      const orbits = [...new Set(orbitingAgents.map((agent) => agent.orbit))];

      context.strokeStyle = palette.glow;
      context.lineWidth = 1;
      orbits.forEach((orbit) => {
        context.globalAlpha = 0.12 * reveal;
        context.beginPath();
        context.ellipse(width / 2, height / 2, orbit * radius, orbit * radius * tilt, 0, 0, Math.PI * 2);
        context.stroke();
      });
      context.globalAlpha = 1;
    };

    const drawMark = (elapsed: number, now: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const grow = easeOutCubic(clamp(elapsed / markDuration));
      const size = radius * (0.72 + 0.28 * grow);

      // A soft glow around the mark, breathing slightly.
      const breathe = 0.92 + 0.08 * Math.sin(now / 900);
      const glow = context.createRadialGradient(centerX, centerY, size, centerX, centerY, size * 1.9);
      glow.addColorStop(0, palette.glow);
      glow.addColorStop(1, "transparent");
      context.globalAlpha = (palette.dark ? 0.22 : 0.12) * grow * breathe;
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, size * 1.9, 0, Math.PI * 2);
      context.arc(centerX, centerY, size, 0, Math.PI * 2, true);
      context.fill();

      markRatios.forEach((ratio, index) => {
        const unfold = easeOutQuart(clamp((elapsed - ringStart - index * ringStagger) / ringDuration));
        if (unfold <= 0) return;

        context.globalAlpha = markOpacities[index] * unfold * palette.markStrength;
        context.fillStyle = palette.mark;
        context.beginPath();
        context.arc(centerX, centerY, size * ratio * (0.06 + 0.94 * unfold), 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
    };

    // Agents: a round badge with the agent's mark. Far ones are smaller and dimmer.
    const drawAgent = (index: number, reveal: number, angle: number) => {
      const agent = orbitingAgents[index];
      const depth = Math.sin(angle);
      const scale = 0.85 + 0.15 * depth;
      const x = width / 2 + Math.cos(angle) * agent.orbit * radius * reveal;
      const y = height / 2 + Math.sin(angle) * agent.orbit * radius * tilt * reveal;
      const badge = 17 * scale;

      context.save();
      context.globalAlpha = clamp(reveal * 1.4) * (depth < 0 ? 0.55 + 0.45 * (1 + depth) : 1);
      context.translate(x, y);

      context.fillStyle = palette.card;
      context.strokeStyle = palette.border;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(0, 0, badge, 0, Math.PI * 2);
      context.fill();
      context.stroke();

      const color = agentColor(index);
      const icon = icons[index];
      if (icon) {
        const iconSize = badge * 1.1;
        context.translate(-iconSize / 2, -iconSize / 2);
        context.scale(iconSize / 24, iconSize / 24);
        context.fillStyle = color;
        context.fill(icon);
      } else {
        context.fillStyle = color;
        context.font = `600 ${Math.round(10 * scale)}px "Geist Mono", ui-monospace, monospace`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(">_", 0, 0.5);
      }

      context.restore();
    };

    const draw = (now: number, delta: number) => {
      const elapsed = introAt === null ? 0 : now - introAt;

      // Agents swing in fast and settle into their orbits.
      const spin = 1 + extraSpin * Math.pow(1 - clamp(elapsed / spinDuration), 2);
      orbitingAgents.forEach((agent, index) => {
        angles[index] += orbitSpeed(agent.orbit) * spin * delta;
      });
      const reveal = easeOutQuart(clamp((elapsed - agentStart) / agentRevealDuration));

      context.clearRect(0, 0, width, height);
      drawLines(elapsed);
      drawStreaks(elapsed, delta);
      drawOrbits(elapsed);

      // The far half of every orbit passes behind the mark.
      const far = orbitingAgents.map((_, index) => index).filter((index) => Math.sin(angles[index]) < 0);
      const near = orbitingAgents.map((_, index) => index).filter((index) => Math.sin(angles[index]) >= 0);

      if (reveal > 0) far.forEach((index) => drawAgent(index, reveal, angles[index]));
      drawMark(elapsed, now);
      if (reveal > 0) near.forEach((index) => drawAgent(index, reveal, angles[index]));
    };

    // The loop runs only while the canvas is on screen.
    let frame = 0;
    let running = false;
    let previous = 0;

    const loop = (now: number) => {
      if (!running) return;

      const delta = previous ? Math.min(0.05, (now - previous) / 1000) : 0;
      previous = now;
      draw(now, delta);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (introAt === null) introAt = performance.now();
      if (running || reducedMotion) {
        draw(performance.now(), 0);
        return;
      }

      running = true;
      previous = 0;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();
    draw(performance.now(), 0);

    const sizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now(), 0);
    });
    sizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibilityObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      palette = readPalette(canvas, "brand");
      draw(performance.now(), 0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      stop();
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("block size-full text-foreground", className)}
      // The light fades out towards the edges, so the visual has no frame.
      style={{ maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 62%, transparent 100%)" }}
    />
  );
}
