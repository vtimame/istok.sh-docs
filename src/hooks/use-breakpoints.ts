import { useEffect, useState } from "react";

const breakpoints = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const;

type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(breakpoint: Breakpoint) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(width >= ${breakpoints[breakpoint]})`);

    const update = () => setMatches(media.matches);

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, [breakpoint]);

  return matches;
}
