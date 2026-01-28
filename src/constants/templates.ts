import { BiodataTemplate, TemplateId } from "@/types/biodata";

/**
 * Template configurations for biodata rendering
 */

export const TEMPLATES: Record<TemplateId, BiodataTemplate> = {
  classic: {
    id: "classic",
    name: "Classic Traditional",
    description: "A timeless design with traditional borders and elegant serif fonts",
    thumbnail: "/templates/classic-thumb.png",
    colors: {
      primary: "#8B1538", // Maroon
      secondary: "#D4A84B", // Gold
      accent: "#FF6B35", // Saffron
      background: "#FFF9F0", // Cream
      text: "#2D1810", // Dark brown
      border: "#D4A84B", // Gold
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Noto Sans, sans-serif",
      accent: "Noto Serif, serif",
    },
    layout: {
      photoPosition: "top-right",
      sectionStyle: "divider",
      headerStyle: "centered",
    },
  },
  
  modern: {
    id: "modern",
    name: "Modern Minimal",
    description: "Clean, contemporary design with subtle colors and clear typography",
    thumbnail: "/templates/modern-thumb.png",
    colors: {
      primary: "#1E3A8A", // Royal blue
      secondary: "#4B5563", // Gray
      accent: "#D4A84B", // Gold accent
      background: "#FFFFFF", // White
      text: "#1F2937", // Dark gray
      border: "#E5E7EB", // Light gray
    },
    fonts: {
      heading: "Noto Sans, sans-serif",
      body: "Noto Sans, sans-serif",
    },
    layout: {
      photoPosition: "top-left",
      sectionStyle: "card",
      headerStyle: "left",
    },
  },
  
  elegant: {
    id: "elegant",
    name: "Elegant Gold",
    description: "Luxurious design with gold accents and decorative elements",
    thumbnail: "/templates/elegant-thumb.png",
    colors: {
      primary: "#D4A84B", // Gold
      secondary: "#8B1538", // Maroon
      accent: "#E5C268", // Light gold
      background: "#FFFFF0", // Ivory
      text: "#2D1810", // Dark brown
      border: "#D4A84B", // Gold
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Noto Serif, serif",
      accent: "Playfair Display, serif",
    },
    layout: {
      photoPosition: "top-center",
      sectionStyle: "ornate",
      headerStyle: "centered",
    },
  },
  
  royal: {
    id: "royal",
    name: "Royal Heritage",
    description: "Rich, regal design inspired by royal Indian aesthetics",
    thumbnail: "/templates/royal-thumb.png",
    colors: {
      primary: "#6B0F2A", // Deep maroon
      secondary: "#D4A84B", // Gold
      accent: "#006B5A", // Peacock green
      background: "#FFF8E7", // Warm cream
      text: "#2D1810", // Dark brown
      border: "#6B0F2A", // Deep maroon
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Noto Sans, sans-serif",
      accent: "Noto Serif, serif",
    },
    layout: {
      photoPosition: "top-center",
      sectionStyle: "ornate",
      headerStyle: "centered",
    },
  },
};

/**
 * Template list for selection UI
 */
export const TEMPLATE_LIST = Object.values(TEMPLATES);

/**
 * Default template ID
 */
export const DEFAULT_TEMPLATE_ID: TemplateId = "classic";

/**
 * Get template by ID with fallback to default
 */
export function getTemplate(id: TemplateId): BiodataTemplate {
  return TEMPLATES[id] || TEMPLATES[DEFAULT_TEMPLATE_ID];
}
