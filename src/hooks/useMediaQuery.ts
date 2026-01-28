"use client";

import { useSyncExternalStore, useCallback } from "react";
import { isClient } from "@/lib/utils";

/**
 * Hook that tracks if a media query matches
 * Uses useSyncExternalStore for React 18+ compatibility
 * SSR-safe - returns default value until component mounts
 * 
 * @param query - The media query string (e.g., "(min-width: 768px)")
 * @param defaultValue - Default value for SSR and initial render
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (!isClient()) return () => {};
      
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", callback);
      
      return () => {
        mediaQuery.removeEventListener("change", callback);
      };
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (!isClient()) return defaultValue;
    return window.matchMedia(query).matches;
  }, [query, defaultValue]);

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Common breakpoints matching Tailwind CSS defaults
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Hook that returns the current breakpoint
 */
export function useBreakpoint(): BreakpointKey | null {
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const is2Xl = useMediaQuery(`(min-width: ${BREAKPOINTS["2xl"]}px)`);

  if (is2Xl) return "2xl";
  if (isXl) return "xl";
  if (isLg) return "lg";
  if (isMd) return "md";
  if (isSm) return "sm";
  return null;
}

/**
 * Hook that returns true if viewport is at or above the specified breakpoint
 */
export function useIsAboveBreakpoint(breakpoint: BreakpointKey): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
}

/**
 * Hook that returns true if viewport is below the specified breakpoint
 */
export function useIsBelowBreakpoint(breakpoint: BreakpointKey): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`);
}

/**
 * Hook that returns true if viewport is between two breakpoints
 */
export function useIsBetweenBreakpoints(
  lower: BreakpointKey,
  upper: BreakpointKey
): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS[lower]}px) and (max-width: ${BREAKPOINTS[upper] - 1}px)`
  );
}

/**
 * Hook that returns true if viewport is mobile-sized (below md breakpoint)
 */
export function useIsMobile(): boolean {
  return useIsBelowBreakpoint("md");
}

/**
 * Hook that returns true if viewport is tablet-sized (between md and lg)
 */
export function useIsTablet(): boolean {
  return useIsBetweenBreakpoints("md", "lg");
}

/**
 * Hook that returns true if viewport is desktop-sized (at or above lg)
 */
export function useIsDesktop(): boolean {
  return useIsAboveBreakpoint("lg");
}

/**
 * Hook that tracks if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Hook that tracks the user's preferred color scheme
 */
export function usePrefersColorScheme(): "light" | "dark" | null {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const prefersLight = useMediaQuery("(prefers-color-scheme: light)");

  if (prefersDark) return "dark";
  if (prefersLight) return "light";
  return null;
}

/**
 * Hook that tracks window dimensions
 * SSR-safe - returns 0 dimensions until component mounts
 */
export function useWindowSize(): { width: number; height: number } {
  const getSnapshot = useCallback(() => {
    if (!isClient()) return { width: 0, height: 0 };
    return { width: window.innerWidth, height: window.innerHeight };
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    if (!isClient()) return () => {};
    
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, []);

  const getServerSnapshot = useCallback(() => ({ width: 0, height: 0 }), []);

  // We need to serialize the object to use useSyncExternalStore
  const serializedSize = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(getSnapshot()),
    () => JSON.stringify(getServerSnapshot())
  );

  return JSON.parse(serializedSize);
}

/**
 * Hook that tracks device orientation
 */
export function useOrientation(): "portrait" | "landscape" {
  const isPortrait = useMediaQuery("(orientation: portrait)");
  return isPortrait ? "portrait" : "landscape";
}

/**
 * Hook that detects touch-capable devices
 */
export function useIsTouchDevice(): boolean {
  return useMediaQuery("(hover: none) and (pointer: coarse)");
}

/**
 * Hook that returns different values based on breakpoint
 * Useful for responsive design in JS
 * 
 * @example
 * const columns = useResponsiveValue({ base: 1, sm: 2, md: 3, lg: 4 });
 */
export function useResponsiveValue<T>(
  values: Partial<Record<BreakpointKey | "base", T>>
): T | undefined {
  const is2Xl = useMediaQuery(`(min-width: ${BREAKPOINTS["2xl"]}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);

  if (is2Xl && values["2xl"] !== undefined) return values["2xl"];
  if (isXl && values.xl !== undefined) return values.xl;
  if (isLg && values.lg !== undefined) return values.lg;
  if (isMd && values.md !== undefined) return values.md;
  if (isSm && values.sm !== undefined) return values.sm;
  return values.base;
}

export default useMediaQuery;
