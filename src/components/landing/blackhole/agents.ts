import { siAmp, siClaude, siCline, siCursor, siGithubcopilot, siGooglegemini, siOpencode, siWindsurf } from "simple-icons";

// Coding agents orbiting the well, shown by their marks from simple-icons.
// Codex has no mark there (OpenAI asked for theirs to be removed), so it gets
// a neutral terminal glyph instead.

export interface OrbitingAgent {
  name: string;
  // SVG path in a 24×24 box, or null for the terminal glyph.
  icon: string | null;
  // The brand color; dark marks fall back to the theme's ink.
  color: string;
  // Orbit radius in well radii and starting angle in radians.
  orbit: number;
  phase: number;
}

export const orbitingAgents: OrbitingAgent[] = [
  { name: "Claude Code", icon: siClaude.path, color: `#${siClaude.hex}`, orbit: 1.7, phase: 0.4 },
  { name: "Codex", icon: null, color: "ink", orbit: 2.15, phase: 2.6 },
  { name: "Cursor", icon: siCursor.path, color: `#${siCursor.hex}`, orbit: 2.6, phase: 4.6 },
  { name: "Gemini CLI", icon: siGooglegemini.path, color: `#${siGooglegemini.hex}`, orbit: 2.15, phase: 5.6 },
  { name: "GitHub Copilot", icon: siGithubcopilot.path, color: `#${siGithubcopilot.hex}`, orbit: 2.6, phase: 1.5 },
  { name: "Cline", icon: siCline.path, color: `#${siCline.hex}`, orbit: 1.7, phase: 3.5 },
  { name: "OpenCode", icon: siOpencode.path, color: `#${siOpencode.hex}`, orbit: 3.0, phase: 0.9 },
  { name: "Windsurf", icon: siWindsurf.path, color: `#${siWindsurf.hex}`, orbit: 3.0, phase: 3.9 },
  { name: "Amp", icon: siAmp.path, color: `#${siAmp.hex}`, orbit: 3.0, phase: 5.2 },
];

// Inner orbits turn faster, as around a real mass.
export function orbitSpeed(orbit: number) {
  return 0.32 / Math.pow(orbit, 1.5);
}
