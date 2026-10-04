import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { orbitingAgents, orbitSpeed } from "./agents";
import { readPalette, type Palette } from "./palette";
import { advanceSwirl, innerOrbit, outerOrbit, spawnSwirl, swirlCount, swirlFade, type Swirl } from "./swirl";

// The hero visual, seen from above: the Istok mark as a gravity well with
// concentric orbits. Light circles it and slowly spirals in, and coding agents
// orbit it on the rings. On first sight the mark grows, its rings unfold and
// the light and the agents swing in fast before settling.

interface GravityWellProps {
  className?: string;
}

const markRatios = [1, 0.8, 0.6, 0.4, 0.2];
const markOpacities = [0.1, 0.3, 0.5, 0.8, 1];


// Intro timing, in milliseconds after the canvas first comes into view.
const markDuration = 650;
const ringStart = 180;
const ringStagger = 120;
const ringDuration = 900;
const lightStart = 350;
const lightDuration = 900;
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
    let swirls: Swirl[] = Array.from({ length: swirlCount }, () => spawnSwirl(true));
    let palette: Palette = readPalette(canvas);

    let introAt: number | null = reducedMotion ? -Infinity : null;
    const angles = orbitingAgents.map((agent) => agent.phase);

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      radius = Math.min(width, height) * 0.115;
    };

    // A point on an orbit, in canvas pixels.
    const onOrbit = (orbit: number, angle: number) => ({
      x: width / 2 + Math.cos(angle) * orbit * radius,
      y: height / 2 + Math.sin(angle) * orbit * radius,
    });

    const agentColor = (index: number) => {
      const color = orbitingAgents[index].color;
      if (color === "ink") return palette.ink;

      const light = luminance(color);
      if ((palette.dark && light < 0.04) || (!palette.dark && light > 0.85)) return palette.ink;
      return color;
    };

    // Faint guides of the disc, so the swirl reads as a plane.
    const drawGuides = (reveal: number) => {
      context.strokeStyle = palette.glow;
      context.lineWidth = 1;

      for (let step = 0; step < 6; step++) {
        const orbit = innerOrbit + 0.25 + (step / 5) * (outerOrbit - innerOrbit - 0.25);
        context.globalAlpha = 0.05 * reveal;
        context.beginPath();
        context.arc(width / 2, height / 2, orbit * radius, 0, Math.PI * 2);
        context.stroke();
      }

      context.globalAlpha = 1;
    };

    const drawSwirls = (reveal: number) => {
      context.lineCap = "round";
      context.lineWidth = 1.3;

      for (const swirl of swirls) {
        const fade = swirlFade(swirl.orbit) * reveal * swirl.alpha;
        if (fade <= 0) continue;

        const head = onOrbit(swirl.orbit, swirl.angle);
        const middle = onOrbit(swirl.orbit, swirl.angle - swirl.length / 2);
        const tail = onOrbit(swirl.orbit, swirl.angle - swirl.length);

        const gradient = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, palette.streak(swirl.shade));

        context.globalAlpha = fade;
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(tail.x, tail.y);
        context.quadraticCurveTo(2 * middle.x - (head.x + tail.x) / 2, 2 * middle.y - (head.y + tail.y) / 2, head.x, head.y);
        context.stroke();
      }

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
        context.arc(width / 2, height / 2, orbit * radius, 0, Math.PI * 2);
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

    // Agents: a dot in the agent's color with its name, placed outwards from
    // the center so labels never cover the mark.
    const drawAgent = (index: number, position: { x: number; y: number }, reveal: number) => {
      const agent = orbitingAgents[index];
      const color = agentColor(index);
      const opacity = clamp(reveal * 1.4);

      const dx = position.x - width / 2;
      const dy = position.y - height / 2;
      const distance = Math.hypot(dx, dy) || 1;
      const nx = dx / distance;
      const ny = dy / distance;

      context.save();

      const halo = context.createRadialGradient(position.x, position.y, 0, position.x, position.y, 12);
      halo.addColorStop(0, color);
      halo.addColorStop(1, "transparent");
      context.globalAlpha = 0.3 * opacity;
      context.fillStyle = halo;
      context.beginPath();
      context.arc(position.x, position.y, 12, 0, Math.PI * 2);
      context.fill();

      context.globalAlpha = opacity;
      context.fillStyle = color;
      context.beginPath();
      context.arc(position.x, position.y, 4, 0, Math.PI * 2);
      context.fill();

      context.font = `11px "Geist Mono", ui-monospace, monospace`;
      context.textBaseline = "middle";
      context.textAlign = nx >= 0 ? "left" : "right";
      context.fillStyle = palette.muted;
      context.globalAlpha = 0.9 * opacity;
      context.fillText(agent.name, position.x + nx * 10 + (nx >= 0 ? 2 : -2), position.y + ny * 10);

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
      const light = easeOutCubic(clamp((elapsed - lightStart) / lightDuration));

      swirls = swirls.map((swirl) => (advanceSwirl(swirl, delta, spin) ? swirl : spawnSwirl(false)));

      context.clearRect(0, 0, width, height);
      drawGuides(light);
      drawOrbits(elapsed);
      drawSwirls(light);
      drawMark(elapsed, now);
      if (reveal > 0) {
        orbitingAgents.forEach((agent, index) => drawAgent(index, onOrbit(agent.orbit * reveal, angles[index]), reveal));
      }
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
      palette = readPalette(canvas);
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
      // The edges fade out, so the visual has no frame.
      style={{ maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 82%, transparent 100%)" }}
    />
  );
}
