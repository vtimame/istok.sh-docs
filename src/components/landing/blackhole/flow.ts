// Light flowing around the hole. The bending follows potential flow around a
// cylinder: a line that starts at height h follows y · (1 − R² / (x² + y²)) = h,
// which hugs the hole for small h and flattens out far away. Flow speed along
// it is highest over the top, which is where the streaks race.

export interface Point {
  x: number;
  y: number;
}

export interface Streamline {
  points: Point[];
  // Cumulative arc length at every point.
  lengths: number[];
}

export interface Streak {
  line: number;
  distance: number;
  speed: number;
  length: number;
  alpha: number;
  // Picks the streak's color from the palette, 0..1.
  shade: number;
}

export const lineCount = 34;
export const streakCount = 70;

// streamY solves the streamline equation for y at a given x with Newton steps from above.
export function streamY(x: number, height: number, radius: number) {
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
export function flowSpeed(point: Point, radius: number) {
  const r2 = point.x * point.x + point.y * point.y;
  const cos2 = (point.x * point.x - point.y * point.y) / r2;
  const value = 1 - (2 * radius * radius * cos2) / r2 + radius ** 4 / (r2 * r2);

  return Math.sqrt(Math.max(0, value));
}

export function buildStreamlines(width: number, radius: number, top: number): Streamline[] {
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
export function pointAt(line: Streamline, distance: number): Point {
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

export function spawn(lines: Streamline[]): Streak {
  // Streaks prefer the inner lines, where the light visibly bends.
  const line = Math.min(lines.length - 1, Math.floor(Math.pow(Math.random(), 1.6) * lines.length));

  return {
    line,
    distance: -Math.random() * 400,
    speed: 520 + Math.random() * 520,
    length: 40 + Math.random() * 120,
    alpha: 0.35 + Math.random() * 0.65,
    shade: Math.random(),
  };
}

// buildSymmetricStreamlines mirrors the lines below the axis, for a well that
// the light passes on both sides. They are interleaved inner first, so spawn's
// preference for inner lines holds above and below.
export function buildSymmetricStreamlines(width: number, radius: number, top: number): Streamline[] {
  const above = buildStreamlines(width, radius, top);

  return above.flatMap((line) => [
    line,
    { points: line.points.map((point) => ({ x: point.x, y: -point.y })), lengths: line.lengths },
  ]);
}
