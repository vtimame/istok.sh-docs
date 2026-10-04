import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

// A divider between the hero and the page: a bright disc line across the
// page with the upper half of a black hole sitting on it. Lines of light run
// left to right and bend over the hole, and short streaks race along them,
// speeding up as they pass it.
//
// The bending follows potential flow around a cylinder: a line that starts at
// height h follows y · (1 − R² / (x² + y²)) = h, which hugs the hole for small
// h and flattens out far away. Flow speed along it is highest over the top.

interface BlackHoleDividerProps {
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

interface Streamline {
  points: Point[];
  // Cumulative arc length at every point.
  lengths: number[];
}

interface Streak {
  line: number;
  distance: number;
  speed: number;
  length: number;
  alpha: number;
}

const lineCount = 34;
const streakCount = 70;

// streamY solves the streamline equation for y at a given x with Newton steps from above.
function streamY(x: number, height: number, radius: number) {
  let y = Math.max(height, radius) + radius;

  for (let step = 0; step < 24; step++) {
    const r2 = x * x + y * y;
    const f = y * (1 - (radius * radius) / r2) - height;
    const df = 1 - (radius * radius * (x * x - y * y)) / (r2 * r2);
    y -= f / df;
  }

  return y;
}

// flowSpeed is the relative speed at a point: 1 far away and up to 2 over the hole.
function flowSpeed(point: Point, radius: number) {
  const r2 = point.x * point.x + point.y * point.y;
  const cos2 = (point.x * point.x - point.y * point.y) / r2;
  const value = 1 - (2 * radius * radius * cos2) / r2 + radius ** 4 / (r2 * r2);

  return Math.sqrt(Math.max(0, value));
}

function buildStreamlines(width: number, radius: number, top: number): Streamline[] {
  const lines: Streamline[] = [];

  for (let index = 0; index < lineCount; index++) {
    // Lines bunch up near the disc, where the bending is strongest.
    const height = top * Math.pow((index + 1) / lineCount, 1.7);

    const points: Point[] = [];
    const lengths: number[] = [];
    const samples = 160;

    for (let sample = 0; sample <= samples; sample++) {
      const x = -width / 2 + (sample / samples) * width;
      const point = { x, y: streamY(x, height, radius) };
      const previous = points[sample - 1];

      points.push(point);
      lengths.push(previous ? lengths[sample - 1] + Math.hypot(point.x - previous.x, point.y - previous.y) : 0);
    }

    lines.push({ points, lengths });
  }

  return lines;
}

// pointAt returns the point at a given arc length along a streamline.
function pointAt(line: Streamline, distance: number): Point {
  const { points, lengths } = line;
  let low = 0;
  let high = lengths.length - 1;

  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if (lengths[middle] < distance) low = middle;
    else high = middle;
  }

  const t = (distance - lengths[low]) / (lengths[high] - lengths[low] || 1);

  return {
    x: points[low].x + (points[high].x - points[low].x) * t,
    y: points[low].y + (points[high].y - points[low].y) * t,
  };
}

function spawn(lines: Streamline[]): Streak {
  // Streaks prefer the inner lines, where the light visibly bends.
  const line = Math.min(lines.length - 1, Math.floor(Math.pow(Math.random(), 1.6) * lines.length));

  return {
    line,
    distance: -Math.random() * 400,
    speed: 520 + Math.random() * 520,
    length: 40 + Math.random() * 120,
    alpha: 0.35 + Math.random() * 0.65,
  };
}

export function BlackHoleDivider({ className }: BlackHoleDividerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    let width = 0;
    let height = 0;
    let radius = 0;
    let baseline = 0;
    let lines: Streamline[] = [];
    let streaks: Streak[] = [];

    let ink = "#fff";
    let paper = "#000";
    let dark = true;

    const readTheme = () => {
      const style = getComputedStyle(canvas);
      dark = document.documentElement.classList.contains("dark");
      ink = style.color;
      paper = style.backgroundColor;
    };

    // Geometry: the disc sits near the bottom and the hole's size follows the width.
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      baseline = height * 0.78;
      radius = Math.min(width * 0.09, baseline * 0.42);
      lines = buildStreamlines(width + 40, radius, baseline * 1.05);
      streaks = Array.from({ length: streakCount }, () => {
        const streak = spawn(lines);
        streak.distance = Math.random() * lines[streak.line].lengths.at(-1)!;
        return streak;
      });
    };

    // Plane coordinates have y up from the disc and x from the hole's center.
    const toScreen = (point: Point): Point => ({ x: width / 2 + point.x, y: baseline - point.y });

    const drawLines = () => {
      context.lineWidth = 1;
      context.strokeStyle = ink;

      lines.forEach((line, index) => {
        context.globalAlpha = 0.05 + 0.1 * (1 - index / lines.length);
        context.beginPath();
        line.points.forEach((point, sample) => {
          const { x, y } = toScreen(point);
          if (sample === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.stroke();
      });
    };

    const drawStreaks = (delta: number) => {
      context.lineCap = "round";
      context.lineWidth = 1.4;

      streaks.forEach((streak, index) => {
        const line = lines[streak.line];
        const total = line.lengths.at(-1)!;

        // Light speeds up where the flow is fastest, over the hole.
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
        gradient.addColorStop(1, ink);

        context.globalAlpha = streak.alpha;
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(tail.x, tail.y);
        context.quadraticCurveTo(middle.x, middle.y, head.x, head.y);
        context.stroke();
      });

      context.globalAlpha = 1;
    };

    const drawHole = () => {
      const centerX = width / 2;

      // The upper half of the shadow; the lower half is hidden below the disc.
      context.globalAlpha = 1;
      context.fillStyle = dark ? "#000" : ink;
      context.beginPath();
      context.arc(centerX, baseline, radius, Math.PI, 0);
      context.closePath();
      context.fill();

      // The photon ring: a thin bright rim, glowing in the dark theme and cut
      // out of the ink in the light one.
      context.save();
      if (dark) {
        context.shadowColor = ink;
        context.shadowBlur = 18;
      }
      context.strokeStyle = dark ? ink : paper;
      context.lineWidth = dark ? 1.6 : 2;
      context.beginPath();
      context.arc(centerX, baseline, radius * 1.03, Math.PI, 0);
      context.stroke();
      context.restore();
    };

    const drawDisc = () => {
      // The disc line runs across the page, brightest at the hole.
      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, ink);
      gradient.addColorStop(1, "transparent");

      context.save();
      if (dark) {
        context.shadowColor = ink;
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

    const draw = (delta: number) => {
      context.clearRect(0, 0, width, height);
      drawLines();
      drawStreaks(delta);
      drawHole();
      drawDisc();
    };

    // The loop runs only while the divider is on screen.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let running = false;
    let previous = 0;

    const loop = (now: number) => {
      if (!running) return;

      const delta = previous ? Math.min(0.05, (now - previous) / 1000) : 0;
      previous = now;
      draw(delta);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      previous = 0;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    readTheme();
    resize();
    draw(0);

    const sizeObserver = new ResizeObserver(() => {
      resize();
      draw(0);
    });
    sizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibilityObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      readTheme();
      draw(0);
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
      className={cn("block h-[340px] w-full bg-background text-foreground", className)}
      // The light fades in from above, so the field has no hard top edge.
      style={{ maskImage: "linear-gradient(to bottom, transparent, black 45%)" }}
    />
  );
}
