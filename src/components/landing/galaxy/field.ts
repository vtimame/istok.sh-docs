// The galaxy as a density field: a bright core, a faint disc and logarithmic
// spiral arms, seen at an angle. Every function works in galaxy-plane units,
// where the visible disc has radius 1.

export interface GalaxyShape {
  arms: number;
  // Radians the arm turns per unit of ln(radius); smaller winds tighter.
  pitch: number;
  // Angular width of an arm, in radians at radius 1.
  armWidth: number;
  // Vertical squash of the disc, which reads as its tilt towards the viewer.
  tilt: number;
}

export const defaultShape: GalaxyShape = {
  arms: 2,
  pitch: 0.32,
  armWidth: 0.34,
  tilt: 0.5,
};

// Characters from empty space to the densest core.
export const ramp = " ..·:-=+*#%@";

const tau = Math.PI * 2;

// A stable pseudo-random value per cell, so the star dust does not flicker.
export function hash(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function wrapAngle(angle: number) {
  return ((((angle + Math.PI) % tau) + tau) % tau) - Math.PI;
}

// density returns 0..1 for a point in the galaxy plane at time `rotation`.
export function density(x: number, y: number, rotation: number, shape: GalaxyShape) {
  const radius = Math.hypot(x, y);
  if (radius > 1.25) {
    return 0;
  }

  // Inner parts turn faster than the rim, as in a real disc.
  const angle = Math.atan2(y, x) - rotation / (0.35 + radius);

  const core = Math.exp(-((radius / 0.09) ** 2));
  const bulge = 0.45 * Math.exp(-((radius / 0.2) ** 2));
  const disc = 0.07 * Math.exp(-radius * 2.2);

  // Distance to the nearest arm along the circle at this radius.
  const spiral = Math.log(Math.max(radius, 0.04)) / shape.pitch;
  let arm = 0;
  for (let index = 0; index < shape.arms; index++) {
    const offset = (index / shape.arms) * tau;
    const distance = wrapAngle(angle - spiral - offset);
    const width = shape.armWidth * (0.35 + radius);

    arm = Math.max(arm, Math.exp(-((distance / width) ** 2)));
  }

  // Arms fade in after the bulge and out at the rim.
  const armReach = Math.min(1, radius / 0.18) * Math.exp(-((radius / 1.05) ** 4));

  return Math.min(1, core + bulge + disc + 0.9 * arm * armReach);
}
