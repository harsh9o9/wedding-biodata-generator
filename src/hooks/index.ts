/**
 * Export all custom hooks from a single entry point
 */

export {
  useLocalStorage,
  useLocalStorageAvailable,
  useLocalStorageUsage,
} from "./useLocalStorage";

export {
  useDebounce,
  useDebouncedCallback,
  useDebouncedState,
  useLeadingDebounce,
  useDebouncedSetter,
} from "./useDebounce";

export {
  useMediaQuery,
  useBreakpoint,
  useIsAboveBreakpoint,
  useIsBelowBreakpoint,
  useIsBetweenBreakpoints,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersReducedMotion,
  usePrefersColorScheme,
  useWindowSize,
  useOrientation,
  useIsTouchDevice,
  useResponsiveValue,
  BREAKPOINTS,
  type BreakpointKey,
} from "./useMediaQuery";

export {
  useBiodataForm,
  useSectionForm,
  useFieldForm,
  useFieldEditing,
} from "./useBiodataForm";

export { useToast, toast } from "./useToast";
