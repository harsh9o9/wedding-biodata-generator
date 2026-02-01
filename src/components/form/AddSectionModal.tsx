"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { SECTION_ICON_OPTIONS } from "@/constants/fields";
import { BiodataSection } from "@/types/biodata";
import { Plus, X } from "lucide-react";
import * as Icons from "lucide-react";

interface AddSectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSection: (section: Omit<BiodataSection, "id" | "order">) => void;
}

interface SectionFormData {
  title: string;
  titleHindi: string;
  icon: string;
}

const initialFormData: SectionFormData = {
  title: "",
  titleHindi: "",
  icon: "Info",
};

/**
 * AddSectionModal - Modal for creating custom sections
 */
export function AddSectionModal({
  open,
  onOpenChange,
  onAddSection,
}: AddSectionModalProps) {
  const [formData, setFormData] = useState<SectionFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof SectionFormData, string>>>({});

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onOpenChange(false);
  }, [resetForm, onOpenChange]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof SectionFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Section title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      const newSection: Omit<BiodataSection, "id" | "order"> = {
        title: formData.title.trim(),
        titleHindi: formData.titleHindi.trim() || undefined,
        icon: formData.icon,
        fields: [],
        visible: true,
        collapsible: true,
        collapsed: false,
      };

      onAddSection(newSection);
      handleClose();
    },
    [formData, validateForm, onAddSection, handleClose]
  );

  const updateField = <K extends keyof SectionFormData>(
    key: K,
    value: SectionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when field is updated
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  // Get icon component for preview
  const SelectedIcon = Icons[formData.icon as keyof typeof Icons] as React.ElementType;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
          <DialogDescription>
            Create a new section to organize your biodata fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section Title */}
          <Input
            label="Section Title"
            placeholder="e.g., Additional Information"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            error={errors.title}
            required
          />

          {/* Hindi Title (Optional) */}
          <Input
            label="Hindi Title (Optional)"
            placeholder="e.g., अतिरिक्त जानकारी"
            value={formData.titleHindi}
            onChange={(e) => updateField("titleHindi", e.target.value)}
          />

          {/* Section Icon */}
          <div className="flex flex-col gap-1.5">
            <Select
              value={formData.icon}
              onValueChange={(value) => updateField("icon", value)}
            >
              <SelectTrigger label="Section Icon">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {SelectedIcon && <SelectedIcon className="h-4 w-4 text-foreground" />}
                    <span>
                      {SECTION_ICON_OPTIONS.find((o) => o.value === formData.icon)
                        ?.label || formData.icon}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SECTION_ICON_OPTIONS.map((option) => {
                  const IconComp = Icons[option.value as keyof typeof Icons] as React.ElementType;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {IconComp && <IconComp className="h-4 w-4 text-foreground" />}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              Preview
            </p>
            <div className="flex items-center gap-2">
              {SelectedIcon && <SelectedIcon className="h-5 w-5 text-primary" />}
              <span className="font-semibold text-foreground">
                {formData.title || "Section Title"}
                {formData.titleHindi && (
                  <span className="ml-2 text-muted-foreground">
                    ({formData.titleHindi})
                  </span>
                )}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSectionModal;
