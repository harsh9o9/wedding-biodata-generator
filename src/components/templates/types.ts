import { Biodata, BiodataTemplate, BiodataSection, BiodataField } from "@/types/biodata";

/**
 * Props for template components
 */
export interface TemplateProps {
  biodata: Biodata;
  template: BiodataTemplate;
  scale?: number;
}

/**
 * Get visible sections sorted by order
 */
export function getVisibleSections(sections: BiodataSection[]): BiodataSection[] {
  return sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get visible fields with values sorted by order
 */
export function getVisibleFields(fields: BiodataField[]): BiodataField[] {
  return fields
    .filter((f) => f.visible && f.value)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get person's name from biodata
 */
export function getPersonName(biodata: Biodata): string {
  const personalSection = biodata.sections.find((s) => s.id === "personal");
  const nameField = personalSection?.fields.find((f) => f.id === "name");
  return nameField?.value || "Your Name";
}

/**
 * Format field value for display
 */
export function formatFieldValue(field: BiodataField): string {
  if (field.type === "date" && field.value) {
    try {
      return new Date(field.value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return field.value;
    }
  }
  return field.value;
}
