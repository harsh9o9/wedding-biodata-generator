// Template component exports
export { ClassicTemplate } from "./ClassicTemplate";
export { ModernTemplate } from "./ModernTemplate";
export { ElegantTemplate } from "./ElegantTemplate";
export { RoyalTemplate } from "./RoyalTemplate";

// Types and utilities
export {
  type TemplateProps,
  getVisibleSections,
  getVisibleFields,
  getPersonName,
  formatFieldValue,
} from "./types";

// Template component map for dynamic rendering
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { ElegantTemplate } from "./ElegantTemplate";
import { RoyalTemplate } from "./RoyalTemplate";
import { TemplateId } from "@/types/biodata";
import { TemplateProps } from "./types";

export const TEMPLATE_COMPONENTS: Record<
  TemplateId,
  React.ComponentType<TemplateProps>
> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  elegant: ElegantTemplate,
  royal: RoyalTemplate,
};

/**
 * Get the template component for a given template ID
 */
export function getTemplateComponent(
  templateId: TemplateId
): React.ComponentType<TemplateProps> {
  return TEMPLATE_COMPONENTS[templateId] || ClassicTemplate;
}
