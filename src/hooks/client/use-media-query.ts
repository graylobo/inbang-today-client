"use client";
import { useState, useEffect } from "react";

export const breakpoints = {
  mobile: 360,
  tablet: 768,
  desktop: 960,
  largeDesktop: 1200,
};

type BreakpointKey = keyof typeof breakpoints;

export function useMediaQuery(breakpoint: BreakpointKey): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${breakpoints[breakpoint]}px)`
    );

    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };

    updateMatches();

    mediaQuery.addEventListener("change", updateMatches);

    return () => {
      mediaQuery.removeEventListener("change", updateMatches);
    };
  }, [breakpoint]);

  return matches;
}
