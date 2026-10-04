// Light circling the well: streaks on tilted orbits that turn faster near the
// center and slowly spiral in, fading as the mark takes them, then start
// again at the rim.

export interface Swirl {
  // Orbit radius in well radii and position on it in radians.
  orbit: number;
  angle: number;
  // Angular length of the streak's tail, in radians.
  length: number;
  alpha: number;
  // Picks the streak's color from the palette, 0..1.
  shade: number;
}

export const swirlCount = 150;

// The disc the streaks live in, in well radii.
export const innerOrbit = 1.08;
export const outerOrbit = 3.6;

// Radians per second at an orbit of 1; inner orbits are faster, as around a mass.
const angularSpeed = 1.6;
// Well radii per second that a streak drifts inwards.
const inflow = 0.05;

export function spawnSwirl(anywhere: boolean): Swirl {
  // New streaks start near the rim; the first ones fill the whole disc.
  const orbit = anywhere
    ? innerOrbit + Math.pow(Math.random(), 0.8) * (outerOrbit - innerOrbit)
    : outerOrbit - Math.random() * 0.4;

  return {
    orbit,
    angle: Math.random() * Math.PI * 2,
    length: 0.18 + Math.random() * 0.45,
    alpha: 0.35 + Math.random() * 0.65,
    shade: Math.random(),
  };
}

// advanceSwirl moves a streak along its orbit and inwards; it returns false
// once the mark has taken it.
export function advanceSwirl(swirl: Swirl, delta: number, boost: number) {
  swirl.angle += (angularSpeed * boost * delta) / Math.pow(swirl.orbit, 1.5);
  swirl.orbit -= inflow * boost * delta;

  return swirl.orbit > innerOrbit;
}

// How visible a streak is at its orbit: it fades in at the rim and out at the mark.
export function swirlFade(orbit: number) {
  const rim = Math.min(1, (outerOrbit - orbit) / 0.5);
  const center = Math.min(1, (orbit - innerOrbit) / 0.35);

  return Math.max(0, Math.min(rim, center));
}
