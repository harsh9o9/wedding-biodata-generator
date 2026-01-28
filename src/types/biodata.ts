/**
 * Indian Wedding Biodata Type Definitions
 */

// Field types supported in biodata forms
export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "date"
  | "time"
  | "email"
  | "phone"
  | "number"
  | "url"
  | "image";

// A single field in a biodata section
export interface BiodataField {
  id: string;
  label: string;
  labelHindi?: string; // Optional Hindi label for bilingual biodatas
  type: FieldType;
  value: string;
  placeholder?: string;
  options?: string[]; // For select fields
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
  order: number;
  visible: boolean;
  editable: boolean;
}

// A section containing multiple fields
export interface BiodataSection {
  id: string;
  title: string;
  titleHindi?: string; // Optional Hindi title
  icon?: string; // Lucide icon name
  fields: BiodataField[];
  order: number;
  visible: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
}

// Photo configuration for biodata
export interface BiodataPhoto {
  url: string; // Base64 data URL or uploaded file URL
  position: "top-left" | "top-center" | "top-right" | "center";
  shape: "square" | "rounded" | "circle" | "oval";
  size: "small" | "medium" | "large";
  border?: {
    width: number;
    color: string;
    style: "solid" | "double" | "dashed" | "dotted";
  };
}

// Template identifiers
export type TemplateId = "classic" | "modern" | "elegant" | "royal";

// Template configuration
export interface BiodataTemplate {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string; // Path to thumbnail image
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent?: string;
  };
  layout: {
    photoPosition: BiodataPhoto["position"];
    sectionStyle: "card" | "divider" | "minimal" | "ornate";
    headerStyle: "centered" | "left" | "right";
  };
}

// Custom styling options that override template defaults
export interface CustomStyles {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  headingFont?: string;
  bodyFont?: string;
  fontSize?: "small" | "medium" | "large";
  lineHeight?: "tight" | "normal" | "relaxed";
  borderStyle?: "none" | "simple" | "double" | "ornate";
  borderWidth?: number;
  cornerDecoration?: "none" | "floral" | "paisley" | "geometric";
}

// Background configuration
export interface BiodataBackground {
  type: "color" | "gradient" | "image" | "pattern";
  value: string; // Color hex, gradient CSS, or image URL/base64
  opacity?: number; // 0-100
  blur?: number; // 0-20
  overlay?: {
    color: string;
    opacity: number;
  };
}

// Complete biodata data structure
export interface Biodata {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  version: string; // For compatibility checking
  
  // Meta information
  meta: {
    name: string; // Person's name for file naming
    language: "english" | "hindi" | "bilingual";
    religiousInvocation?: {
      preset: "hindu" | "muslim" | "christian" | "sikh" | "buddhist" | "jain" | "none" | "custom";
      customText?: string; // Used when preset is "custom"
    };
  };
  
  // Content
  sections: BiodataSection[];
  photo?: BiodataPhoto;
  
  // Appearance
  templateId: TemplateId;
  background: BiodataBackground;
  customStyles?: CustomStyles;
}

// Export format for saving/sharing biodatas
export interface BiodataExport {
  version: string; // Export format version for compatibility
  exportedAt: string; // ISO date string
  data: Biodata;
}

// Action types for reducer
export type BiodataAction =
  | { type: "UPDATE_FIELD"; sectionId: string; fieldId: string; value: string }
  | { type: "ADD_FIELD"; sectionId: string; field: Omit<BiodataField, "id" | "order"> }
  | { type: "REMOVE_FIELD"; sectionId: string; fieldId: string }
  | { type: "UPDATE_FIELD_CONFIG"; sectionId: string; fieldId: string; config: Partial<BiodataField> }
  | { type: "ADD_SECTION"; section: Omit<BiodataSection, "id" | "order"> }
  | { type: "REMOVE_SECTION"; sectionId: string }
  | { type: "UPDATE_SECTION"; sectionId: string; updates: Partial<BiodataSection> }
  | { type: "REORDER_SECTIONS"; sectionIds: string[] }
  | { type: "REORDER_FIELDS"; sectionId: string; fieldIds: string[] }
  | { type: "SET_TEMPLATE"; templateId: TemplateId }
  | { type: "SET_BACKGROUND"; background: BiodataBackground }
  | { type: "SET_PHOTO"; photo: BiodataPhoto | undefined }
  | { type: "SET_CUSTOM_STYLES"; styles: CustomStyles }
  | { type: "UPDATE_META"; meta: Partial<Biodata["meta"]> }
  | { type: "IMPORT_DATA"; data: Biodata }
  | { type: "RESET" };

// Context type for the biodata provider
export interface BiodataContextType {
  biodata: Biodata;
  dispatch: React.Dispatch<BiodataAction>;
  previewRef: React.RefObject<HTMLDivElement | null>;
  
  // Helper functions
  updateField: (sectionId: string, fieldId: string, value: string) => void;
  addField: (sectionId: string, field: Omit<BiodataField, "id" | "order">) => void;
  removeField: (sectionId: string, fieldId: string) => void;
  addSection: (section: Omit<BiodataSection, "id" | "order">) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (sectionIds: string[]) => void;
  setTemplate: (templateId: TemplateId) => void;
  setBackground: (background: BiodataBackground) => void;
  setPhoto: (photo: BiodataPhoto | undefined) => void;
  exportData: () => BiodataExport;
  importData: (data: BiodataExport) => boolean;
  reset: () => void;
  
  // State
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: string | null;
}

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: {
    fieldId: string;
    sectionId: string;
    message: string;
  }[];
}

// PDF generation options
export interface PDFOptions {
  format: "A4";
  orientation: "portrait";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  quality: "draft" | "standard" | "high";
}
