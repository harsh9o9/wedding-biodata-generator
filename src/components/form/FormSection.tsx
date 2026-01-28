"use client";

import React, { useState, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { Plus, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import * as Icons from "lucide-react";
import { BiodataSection } from "@/types/biodata";
import { useSectionForm } from "@/hooks";
import { useBiodata } from "@/context/BiodataContext";
import { DynamicField } from "./DynamicField";
import { FieldActions } from "./FieldActions";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  section: BiodataSection;
  onAddField?: () => void;
  onRemoveSection?: () => void;
  onToggleVisibility?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  showHindiLabels?: boolean;
  defaultExpanded?: boolean;
}

/**
 * FormSection - A collapsible section wrapper containing form fields
 */
export function FormSection({
  section,
  onAddField,
  onRemoveSection,
  onToggleVisibility,
  dragHandleProps,
  isDragging,
  showHindiLabels = false,
  defaultExpanded = true,
}: FormSectionProps) {
  const { dispatch } = useBiodata();
  const {
    updateFieldValue,
    handleFieldBlur,
    getFieldError,
    removeFieldFromSection,
  } = useSectionForm(section.id);

  // Toggle field visibility
  const handleToggleFieldVisibility = useCallback(
    (fieldId: string) => {
      const field = section.fields.find((f) => f.id === fieldId);
      if (field) {
        dispatch({
          type: "UPDATE_FIELD_CONFIG",
          sectionId: section.id,
          fieldId,
          config: { visible: !field.visible },
        });
      }
    },
    [dispatch, section.id, section.fields]
  );

  const [expandedValue, setExpandedValue] = useState<string | undefined>(
    defaultExpanded ? section.id : undefined
  );

  // Get the icon component
  const IconComponent = section.icon
    ? (Icons[section.icon as keyof typeof Icons] as React.ElementType)
    : null;

  const handleFieldChange = useCallback(
    (fieldId: string, value: string) => {
      updateFieldValue(fieldId, value);
    },
    [updateFieldValue]
  );

  const handleFieldRemove = useCallback(
    (fieldId: string) => {
      removeFieldFromSection(fieldId);
    },
    [removeFieldFromSection]
  );

  const sectionTitle = showHindiLabels && section.titleHindi
    ? `${section.title} (${section.titleHindi})`
    : section.title;

  // Count visible and total fields
  const visibleCount = section.fields.filter((f) => f.visible).length;
  const totalCount = section.fields.length;

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "rounded-lg border border-border bg-card transition-shadow",
          isDragging && "shadow-lg ring-2 ring-primary/20",
          !section.visible && "opacity-60"
        )}
      >
        <Accordion
          type="single"
          collapsible
          value={expandedValue}
          onValueChange={setExpandedValue}
        >
          <AccordionItem value={section.id} className="border-none">
            {/* Section Header */}
            <div className="flex items-center gap-2 px-4 py-2">
              {/* Drag Handle */}
              {dragHandleProps && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      {...dragHandleProps}
                      className={cn(
                        "cursor-grab rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing",
                        isDragging && "cursor-grabbing"
                      )}
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Drag to reorder</TooltipContent>
                </Tooltip>
              )}

              {/* Section Icon */}
              {IconComponent && (
                <IconComponent className="h-5 w-5 text-primary" />
              )}

              {/* Section Title with Accordion Trigger */}
              <AccordionTrigger className="flex-1 py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {sectionTitle}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({visibleCount}/{totalCount} fields)
                  </span>
                </div>
              </AccordionTrigger>

              {/* Section Actions */}
              <div className="flex items-center gap-1">
                {/* Toggle Section Visibility */}
                {onToggleVisibility && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVisibility();
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {section.visible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4 opacity-50" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {section.visible ? "Hide section" : "Show section"}
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Add Field */}
                {onAddField && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddField();
                        }}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add field to section</TooltipContent>
                  </Tooltip>
                )}

                {/* Remove Section */}
                {onRemoveSection && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSection();
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove section</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Section Content - Fields */}
            <AccordionContent>
              <div className="space-y-4 px-4 pb-4">
                {section.fields
                  .sort((a, b) => a.order - b.order)
                  .map((field) => (
                    <div
                      key={field.id}
                      className={cn(
                        "group relative rounded-md border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/30",
                        !field.visible && "opacity-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Field Input */}
                        <div className="flex-1">
                          <DynamicField
                            field={field}
                            value={field.value}
                            error={getFieldError(field.id)}
                            onChange={(value) =>
                              handleFieldChange(field.id, value)
                            }
                            onBlur={() => handleFieldBlur(field.id)}
                            showHindiLabel={showHindiLabels}
                          />
                        </div>

                        {/* Field Actions - Show on hover */}
                        <div className="mt-6 opacity-0 transition-opacity group-hover:opacity-100">
                          <FieldActions
                            field={field}
                            onToggleVisibility={() =>
                              handleToggleFieldVisibility(field.id)
                            }
                            onRemove={() => handleFieldRemove(field.id)}
                            compact
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Empty State */}
                {section.fields.length === 0 && (
                  <div className="rounded-md border border-dashed border-border py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No fields in this section.
                    </p>
                    {onAddField && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onAddField}
                        className="mt-2"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Field
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </TooltipProvider>
  );
}

export default FormSection;
