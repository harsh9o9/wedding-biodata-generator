/**
 * Design System Constants
 * 
 * IMPORTANT: This file contains ONLY values needed in JavaScript/TypeScript.
 * 
 * For visual styling (colors, spacing, fonts), use Tailwind classes which
 * reference CSS variables defined in globals.css. This ensures a single
 * source of truth.
 * 
 * Usage:
 * - Colors: Use Tailwind classes like `bg-primary`, `text-accent`, `border-secondary`
 * - Spacing: Use Tailwind's default scale: `p-4`, `m-6`, `gap-8` (4px base unit)
 * - Font sizes: Use Tailwind's scale: `text-sm`, `text-base`, `text-lg`, `text-xl`
 * - Radius: Use Tailwind's scale: `rounded-sm`, `rounded-md`, `rounded-lg`
 */

/**
 * A4 paper dimensions for PDF generation
 * These values are needed in JS for jsPDF + html2canvas
 */
export const A4 = {
  width: 210, // mm
  height: 297, // mm
  widthPx: 794, // pixels at 96 DPI
  heightPx: 1123, // pixels at 96 DPI
  aspectRatio: 210 / 297, // ~0.707
} as const;

/**
 * PDF margins in millimeters
 */
export const PDF_MARGINS = {
  small: { top: 10, right: 10, bottom: 10, left: 10 },
  medium: { top: 15, right: 15, bottom: 15, left: 15 },
  large: { top: 20, right: 20, bottom: 20, left: 20 },
} as const;

/**
 * Z-index layers for JS-based positioning (portals, etc.)
 * For CSS, use Tailwind: z-10, z-20, z-30, z-40, z-50
 */
export const Z_INDEX = {
  dropdown: 50,
  sticky: 100,
  modal: 200,
  tooltip: 300,
  toast: 400,
} as const;

/**
 * Animation durations in milliseconds for JS animations
 * For CSS animations, use Tailwind: duration-150, duration-300, duration-500
 */
export const ANIMATION_MS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Debounce/throttle delays
 */
export const DELAYS = {
  autosave: 1000, // ms - delay before auto-saving to localStorage
  preview: 300, // ms - delay before updating preview
  search: 300, // ms - delay for search input
} as const;

/**
 * File size limits
 */
export const FILE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB for photos
  json: 1024 * 1024, // 1MB for import files
} as const;

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  biodata: "biodata-draft",
  preferences: "biodata-preferences",
} as const;

/**
 * Default backgrounds available in the app
 * References colors from CSS variables
 */
export const DEFAULT_BACKGROUNDS = [
  {
    id: "cream",
    name: "Cream",
    type: "color" as const,
    value: "var(--cream)", // References CSS variable
    preview: "#FFF9F0",
  },
  {
    id: "ivory",
    name: "Ivory",
    type: "color" as const,
    value: "var(--ivory)",
    preview: "#FFFFF0",
  },
  {
    id: "white",
    name: "White",
    type: "color" as const,
    value: "#FFFFFF",
    preview: "#FFFFFF",
  },
  {
    id: "bg-1",
    name: "Traditional 1",
    type: "image" as const,
    value: "/backgrounds/Biodata bg 1.jpeg",
    preview: "/backgrounds/Biodata bg 1.jpeg",
  },
  {
    id: "bg-2",
    name: "Traditional 2",
    type: "image" as const,
    value: "/backgrounds/Biodata bg 2.jpeg",
    preview: "/backgrounds/Biodata bg 2.jpeg",
  },
] as const;

/**
 * Tailwind class mappings for common patterns
 * Use these for consistency across components
 */
export const STYLE_CLASSES = {
  // Card styles
  card: "bg-card text-card-foreground rounded-lg border border-border shadow-sm",
  cardHover: "hover:shadow-md transition-shadow",
  
  // Button base (use with CVA for variants)
  buttonBase: "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  
  // Input styles
  input: "flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  
  // Label styles
  label: "text-sm font-medium text-foreground",
  
  // Section heading
  sectionHeading: "text-lg font-semibold text-foreground",
  
  // Muted text
  mutedText: "text-sm text-muted-foreground",
} as const;

/**
 * Design system spacing scale reference (Tailwind defaults)
 * This is documentation only - use Tailwind classes directly
 * 
 * 0: 0px
 * 1: 4px   (0.25rem)
 * 2: 8px   (0.5rem)
 * 3: 12px  (0.75rem)
 * 4: 16px  (1rem)
 * 5: 20px  (1.25rem)
 * 6: 24px  (1.5rem)
 * 8: 32px  (2rem)
 * 10: 40px (2.5rem)
 * 12: 48px (3rem)
 * 16: 64px (4rem)
 * 20: 80px (5rem)
 * 24: 96px (6rem)
 */
