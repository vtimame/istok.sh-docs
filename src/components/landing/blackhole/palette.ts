// Colors for the black hole, per theme and tone.

export type Tone = "brand" | "mono";

export interface Palette {
  dark: boolean;
  ink: string;
  muted: string;
  card: string;
  border: string;
  line: (depth: number) => string;
  streak: (shade: number) => string;
  glow: string;
  disc: string;
  mark: string;
  // How strongly the logo rings show; the brand mark is the light source itself.
  markStrength: number;
  // A solid fill under the rings, so the mono mark reads as a hole.
  core: string | null;
}

// Emerald shades, from the logo's outer glow to its bright center.
const emeraldDark = ["#6ee7b7", "#34d399", "#10b981"];
const emeraldLight = ["#10b981", "#059669", "#047857"];

export function readPalette(element: HTMLElement, tone: Tone): Palette {
  const dark = document.documentElement.classList.contains("dark");
  const style = getComputedStyle(element);
  const ink = style.color;
  const muted = style.getPropertyValue("--muted-foreground").trim() || ink;
  const card = style.getPropertyValue("--card").trim() || "#fff";
  const border = style.getPropertyValue("--border").trim() || ink;

  if (tone === "mono") {
    return {
      dark,
      ink,
      muted,
      card,
      border,
      line: () => ink,
      streak: () => ink,
      glow: ink,
      disc: ink,
      mark: ink,
      markStrength: dark ? 0.35 : 0.25,
      core: dark ? "#000" : ink,
    };
  }

  const shades = dark ? emeraldDark : emeraldLight;
  const pick = (value: number) => shades[Math.min(shades.length - 1, Math.floor(value * shades.length))];

  return {
    dark,
    ink,
    muted,
    card,
    border,
    // Inner lines take the brighter shades, outer ones the deeper.
    line: (depth) => pick(depth),
    streak: (shade) => pick(shade),
    glow: dark ? "#34d399" : "#059669",
    disc: dark ? "#6ee7b7" : "#047857",
    mark: dark ? "#10b981" : "#059669",
    // A quieter mark, so the well does not outshine the headline.
    markStrength: dark ? 0.55 : 0.6,
    core: null,
  };
}
