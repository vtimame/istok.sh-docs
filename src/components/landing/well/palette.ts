// Colors for the gravity well, per theme.

export interface Palette {
  dark: boolean;
  ink: string;
  muted: string;
  card: string;
  border: string;
  streak: (shade: number) => string;
  glow: string;
  mark: string;
  // How strongly the logo rings show; the brand mark is the light source itself.
  markStrength: number;
}

// Emerald shades, from the logo's outer glow to its bright center.
const emeraldDark = ["#6ee7b7", "#34d399", "#10b981"];
const emeraldLight = ["#10b981", "#059669", "#047857"];

export function readPalette(element: HTMLElement): Palette {
  const dark = document.documentElement.classList.contains("dark");
  const style = getComputedStyle(element);
  const ink = style.color;
  const muted = style.getPropertyValue("--muted-foreground").trim() || ink;
  const card = style.getPropertyValue("--card").trim() || "#fff";
  const border = style.getPropertyValue("--border").trim() || ink;

  const shades = dark ? emeraldDark : emeraldLight;
  const pick = (value: number) => shades[Math.min(shades.length - 1, Math.floor(value * shades.length))];

  return {
    dark,
    ink,
    muted,
    card,
    border,
    streak: (shade) => pick(shade),
    glow: dark ? "#34d399" : "#059669",
    mark: dark ? "#10b981" : "#059669",
    // A quieter mark, so the well does not outshine the headline.
    markStrength: dark ? 0.55 : 0.6,
  };
}
