// Coding agents orbit the core; now and then one sends its work inward.

export interface GalaxyAgent {
  name: string;
  color: string;
  // Orbit radius in galaxy-plane units and starting angle in radians.
  radius: number;
  angle: number;
}

export const agents: GalaxyAgent[] = [
  { name: "Claude Code", color: "#D97757", radius: 0.42, angle: 0.4 },
  { name: "Codex", color: "currentColor", radius: 0.58, angle: 2.3 },
  { name: "Gemini CLI", color: "#4285F4", radius: 0.74, angle: 4.1 },
  { name: "Cursor", color: "#8B95A5", radius: 0.86, angle: 5.4 },
  { name: "OpenCode", color: "#009979", radius: 0.66, angle: 1.3 },
  { name: "Cline", color: "#7C3AED", radius: 0.94, angle: 3.2 },
  { name: "Aider", color: "#E11D48", radius: 0.52, angle: 5.0 },
  { name: "Amp", color: "#F59E0B", radius: 1.02, angle: 0.9 },
];

// Agents move with the disc but a little slower than the stars around them,
// so they drift across the arms.
export function agentAngle(agent: GalaxyAgent, rotation: number) {
  return agent.angle + (0.7 * rotation) / (0.35 + agent.radius);
}

export interface Pulse {
  agent: number;
  startedAt: number;
}

// A pulse travels from an agent to the core in this many milliseconds.
export const pulseDuration = 1600;

// nextPulse picks the next agent to send work, a couple of seconds after the last.
export function nextPulse(now: number, previous: Pulse | null): Pulse {
  const agent = previous === null ? 0 : (previous.agent + 3) % agents.length;

  return { agent, startedAt: now + 900 + Math.random() * 1600 };
}
