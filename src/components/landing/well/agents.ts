// Coding agents orbiting the well, shown as named dots in a color of their
// own rather than by their logos, so the page uses no third-party marks.

export interface OrbitingAgent {
  name: string;
  // "ink" follows the theme's text color.
  color: string;
  // Orbit radius in well radii and starting angle in radians.
  orbit: number;
  phase: number;
}

export const orbitingAgents: OrbitingAgent[] = [
  { name: "Claude Code", color: "#D97757", orbit: 1.7, phase: 0.4 },
  { name: "Codex", color: "ink", orbit: 2.15, phase: 2.6 },
  { name: "Cursor", color: "#8B95A5", orbit: 2.6, phase: 4.6 },
  { name: "Gemini CLI", color: "#4285F4", orbit: 2.15, phase: 5.6 },
  { name: "GitHub Copilot", color: "#8957E5", orbit: 2.6, phase: 1.5 },
  { name: "Cline", color: "#E11D48", orbit: 1.7, phase: 3.5 },
  { name: "OpenCode", color: "#009979", orbit: 3.0, phase: 0.9 },
  { name: "Windsurf", color: "#0EA5A4", orbit: 3.0, phase: 3.9 },
  { name: "Amp", color: "#F59E0B", orbit: 3.0, phase: 5.2 },
];

// Inner orbits turn faster, as around a real mass.
export function orbitSpeed(orbit: number) {
  return 0.32 / Math.pow(orbit, 1.5);
}
