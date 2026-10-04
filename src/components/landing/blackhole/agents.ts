// Coding agents hover over the hole, untouched by the light racing past them.

export interface HoveringAgent {
  name: string;
  // "ink" follows the theme's text color, for agents with a monochrome mark.
  color: string;
  // Position above the hole: angle from the right in radians and distance in hole radii.
  angle: number;
  distance: number;
  // Phase of the slow bob, so the agents do not move in step.
  phase: number;
}

export const hoveringAgents: HoveringAgent[] = [
  { name: "Claude Code", color: "#D97757", angle: 2.55, distance: 2.0, phase: 0.0 },
  { name: "Codex", color: "ink", angle: 1.95, distance: 2.6, phase: 1.7 },
  { name: "Cursor", color: "#8B95A5", angle: 1.35, distance: 2.35, phase: 3.1 },
  { name: "Gemini CLI", color: "#4285F4", angle: 0.72, distance: 2.05, phase: 4.4 },
  { name: "OpenCode", color: "#009979", angle: 2.95, distance: 3.1, phase: 2.3 },
  { name: "Aider", color: "#E11D48", angle: 0.3, distance: 2.9, phase: 5.2 },
];
