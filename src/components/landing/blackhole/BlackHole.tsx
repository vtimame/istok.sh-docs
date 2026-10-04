import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { dropDuration, hoveringAgents, nextDrop, type Drop } from "./agents";
import { buildStreamlines, flowSpeed, pointAt, spawn, streakCount, type Point, type Streak, type Streamline } from "./flow";
import { readPalette, type Palette, type Tone } from "./palette";

// The Istok mark as a black hole sitting on a bright disc line, with the
// lower half hidden below it. Lines of light bend over it and streaks race
// along them. On first sight it assembles itself: the mark grows from the
// center, its rings unfold, the light draws outwards and the streaks start
// fast and settle.

interface BlackHoleProps {
  // "brand" draws the mark and the light in Istok's emerald; "mono" in ink.
  tone?: Tone;
  // Coding agents hovering over the hole and dropping work into it.
  agents?: boolean;
  // Share of the canvas height above the disc line.
  baseline?: number;
  className?: string;
}

// The logo: concentric discs from the rim inwards.
const markRatios = [1, 0.8, 0.6, 0.4, 0.2];
const markOpacities = [0.1, 0.3, 0.5, 0.8, 1];

// Intro timing, in milliseconds after the canvas first comes into view.
const markDuration = 650;
const ringStart = 180;
const ringStagger = 120;
const ringDuration = 900;
const lightStart = 350;
const lightStagger = 22;
const lightDuration = 1100;
const streakStart = 800;
const settleDuration = 2600;
const agentStart = 1500;
const agentStagger = 160;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export function BlackHole({ tone = "brand", agents = true, baseline: baselineShare = 0.8, className }: BlackHoleProps) {
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
    let baseline = 0;
    let lines: Streamline[] = [];
    let streaks: Streak[] = [];
    let palette: Palette = readPalette(canvas, tone);

    // The intro starts the first time the canvas is seen; without motion it is skipped.
    let introAt: number | null = reducedMotion ? -Infinity : null;

    let drop: Drop = nextDrop(performance.now() + agentStart, null);
    let flashUntil = 0;

    // Geometry: the hole's size follows the width, the disc sits near the bottom.
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      baseline = height * baselineShare;
      radius = Math.min(width * 0.11, baseline * 0.45);
      lines = buildStreamlines(width + 40, radius, baseline * 1.05);
      streaks = Array.from({ length: streakCount }, () => {
        const streak = spawn(lines);
        streak.distance = Math.random() * lines[streak.line].lengths.at(-1)!;
        return streak;
      });
    };

    // Plane coordinates have y up from the disc and x from the hole's center.
    const toScreen = (point: Point): Point => ({ x: width / 2 + point.x, y: baseline - point.y });

    const drawLines = (elapsed: number) => {
      context.lineWidth = 1;

      lines.forEach((line, index) => {
        // Each line draws outwards from the middle, inner lines first.
        const reveal = easeOutCubic(clamp((elapsed - lightStart - index * lightStagger) / lightDuration));
        if (reveal <= 0) return;

        const reach = (reveal * (width + 40)) / 2;
        context.globalAlpha = (0.06 + 0.14 * (1 - index / lines.length)) * reveal;
        context.strokeStyle = palette.line(index / lines.length);
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

      // Streaks start fast and settle, like the old orbit spinning down.
      const settle = clamp((elapsed - streakStart) / settleDuration);
      const boost = 1 + 3 * Math.pow(1 - settle, 2);

      context.lineCap = "round";
      context.lineWidth = 1.4;

      streaks.forEach((streak, index) => {
        const line = lines[streak.line];
        const total = line.lengths.at(-1)!;

        const here = pointAt(line, Math.max(0, streak.distance));
        streak.distance += streak.speed * boost * flowSpeed(here, radius) * delta;

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

        context.globalAlpha = streak.alpha * shown;
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(tail.x, tail.y);
        context.quadraticCurveTo(middle.x, middle.y, head.x, head.y);
        context.stroke();
      });

      context.globalAlpha = 1;
    };

    // The arc: the disc's light bent over the hole, flickering slightly.
    const drawArc = (scale: number, now: number, strength: number) => {
      const centerX = width / 2;
      const size = radius * scale;
      const flash = now < flashUntil ? (flashUntil - now) / 600 : 0;
      const flicker = (0.92 + 0.08 * Math.sin(now / 260)) * strength * (1 + 0.6 * flash);

      const band = (outer: number, alpha: number) => {
        const gradient = context.createRadialGradient(centerX, baseline, size * 1.02, centerX, baseline, size * outer);
        gradient.addColorStop(0, palette.glow);
        gradient.addColorStop(1, "transparent");

        // Only the ring outside the mark glows, so the logo's rings stay crisp.
        context.globalAlpha = alpha * flicker;
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(centerX, baseline, size * outer, Math.PI, 0);
        context.arc(centerX, baseline, size * 1.02, 0, Math.PI, true);
        context.closePath();
        context.fill();
      };

      context.save();
      if (palette.dark) {
        context.globalCompositeOperation = "lighter";
        band(1.9, 0.3);
        band(1.28, 0.75);
      } else {
        // On paper a glow turns muddy, so the arc is a crisp line with a gap.
        band(1.7, 0.12);
        context.globalAlpha = 0.85 * flicker;
        context.strokeStyle = palette.glow;
        context.lineWidth = 2.2;
        context.beginPath();
        context.arc(centerX, baseline, size * 1.13, Math.PI, 0);
        context.stroke();
      }
      context.restore();
    };

    // The mark: the logo's concentric discs, cut in half by the disc line.
    const drawMark = (elapsed: number) => {
      const centerX = width / 2;
      const grow = easeOutCubic(clamp(elapsed / markDuration));
      const size = radius * (0.72 + 0.28 * grow);

      // A dark core keeps it reading as a hole in the mono tone.
      if (palette.core) {
        context.globalAlpha = grow;
        context.fillStyle = palette.core;
        context.beginPath();
        context.arc(centerX, baseline, size, Math.PI, 0);
        context.closePath();
        context.fill();
      }

      markRatios.forEach((ratio, index) => {
        const unfold = easeOutQuart(clamp((elapsed - ringStart - index * ringStagger) / ringDuration));
        if (unfold <= 0) return;

        context.globalAlpha = markOpacities[index] * unfold * palette.markStrength;
        context.fillStyle = palette.mark;
        context.beginPath();
        context.arc(centerX, baseline, size * ratio * (0.06 + 0.94 * unfold), Math.PI, 0);
        context.closePath();
        context.fill();
      });

      context.globalAlpha = 1;
      return grow;
    };

    const drawDisc = (elapsed: number) => {
      // The disc line stretches out from the hole as the scene appears.
      const reach = easeOutCubic(clamp(elapsed / (markDuration + 500)));
      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0.5 - 0.5 * reach, "transparent");
      gradient.addColorStop(0.5, palette.disc);
      gradient.addColorStop(0.5 + 0.5 * reach, "transparent");

      context.save();
      if (palette.dark) {
        context.shadowColor = palette.disc;
        context.shadowBlur = 14;
      }
      context.strokeStyle = gradient;
      context.globalAlpha = 0.9;
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(0, baseline);
      context.lineTo(width, baseline);
      context.stroke();
      context.restore();
    };

    // Agents hover in place with a slow bob; their labels hide on narrow screens.
    const agentPoint = (index: number, now: number): Point => {
      const agent = hoveringAgents[index];
      const bob = Math.sin(now / 1100 + agent.phase) * radius * 0.05;

      return toScreen({
        x: Math.cos(agent.angle) * agent.distance * radius,
        y: Math.sin(agent.angle) * agent.distance * radius * 0.62 + bob,
      });
    };

    const drawAgents = (elapsed: number, now: number) => {
      const labels = width >= 640;
      context.font = `11px "Geist Mono", ui-monospace, monospace`;
      context.textBaseline = "middle";

      hoveringAgents.forEach((agent, index) => {
        const reveal = easeOutCubic(clamp((elapsed - agentStart - index * agentStagger) / 700));
        if (reveal <= 0) return;

        const { x, y } = agentPoint(index, now);
        const color = agent.color === "ink" ? palette.ink : agent.color;

        const halo = context.createRadialGradient(x, y, 0, x, y, 14);
        halo.addColorStop(0, color);
        halo.addColorStop(1, "transparent");
        context.globalAlpha = 0.3 * reveal;
        context.fillStyle = halo;
        context.beginPath();
        context.arc(x, y, 14, 0, Math.PI * 2);
        context.fill();

        context.globalAlpha = reveal;
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, 3.5, 0, Math.PI * 2);
        context.fill();

        if (labels) {
          context.globalAlpha = 0.85 * reveal;
          context.fillStyle = palette.muted;
          context.fillText(agent.name, x + 10, y);
        }
      });

      // A dropped piece of work falls into the hole, speeding up as it goes.
      if (elapsed < agentStart + 1200 || now < drop.startedAt) {
        context.globalAlpha = 1;
        return;
      }

      const progress = (now - drop.startedAt) / dropDuration;
      if (progress >= 1) {
        flashUntil = now + 600;
        drop = nextDrop(now, drop);
        context.globalAlpha = 1;
        return;
      }

      const from = agentPoint(drop.agent, now);
      const to = toScreen({ x: 0, y: radius * 0.35 });
      const fall = progress * progress;
      const agent = hoveringAgents[drop.agent];
      const color = agent.color === "ink" ? palette.ink : agent.color;

      for (let trail = 0; trail < 10; trail++) {
        const point = Math.max(0, fall - trail * 0.02);
        context.globalAlpha = (1 - trail / 10) * 0.9;
        context.fillStyle = trail === 0 ? color : palette.glow;
        context.beginPath();
        context.arc(from.x + (to.x - from.x) * point, from.y + (to.y - from.y) * point, trail === 0 ? 2.6 : 1.5, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
    };

    const draw = (now: number, delta: number) => {
      const elapsed = introAt === null ? 0 : now - introAt;

      context.clearRect(0, 0, width, height);
      drawLines(elapsed);
      drawStreaks(elapsed, delta);

      const grow = easeOutCubic(clamp(elapsed / markDuration));
      if (grow > 0) drawArc(0.72 + 0.28 * grow, now, grow * grow);
      drawMark(elapsed);
      drawDisc(elapsed);
      if (agents) drawAgents(elapsed, now);
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
      palette = readPalette(canvas, tone);
      draw(performance.now(), 0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      stop();
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [tone, agents, baselineShare]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("block w-full text-foreground", className)}
      // The light fades in from above, so the field has no hard top edge.
      style={{ maskImage: "linear-gradient(to bottom, transparent, black 40%)" }}
    />
  );
}
