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
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { FIELD_TYPE_OPTIONS } from "@/constants/fields";
import { FieldType, BiodataField } from "@/types/biodata";
import { Plus, X } from "lucide-react";

interface AddFieldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddField: (field: Omit<BiodataField, "id" | "order">) => void;
  sectionName?: string;
}

interface FieldFormData {
  label: string;
  labelHindi: string;
  type: FieldType;
  placeholder: string;
  options: string[];
}

const initialFormData: FieldFormData = {
  label: "",
  labelHindi: "",
  type: "text",
  placeholder: "",
  options: [],
};

/**
 * AddFieldModal - Modal for creating custom fields
 */
export function AddFieldModal({
  open,
  onOpenChange,
  onAddField,
  sectionName,
}: AddFieldModalProps) {
  const [formData, setFormData] = useState<FieldFormData>(initialFormData);
  const [optionsText, setOptionsText] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FieldFormData, string>>>({});

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setOptionsText("");
    setErrors({});
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onOpenChange(false);
  }, [resetForm, onOpenChange]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FieldFormData, string>> = {};

    if (!formData.label.trim()) {
      newErrors.label = "Label is required";
    }

    if (formData.type === "select") {
      const options = optionsText
        .split("\n")
        .map((o) => o.trim())
        .filter(Boolean);
      if (options.length < 2) {
        newErrors.options = "Please provide at least 2 options";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, optionsText]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      // Parse options for select fields
      const options =
        formData.type === "select"
          ? optionsText
              .split("\n")
              .map((o) => o.trim())
              .filter(Boolean)
          : undefined;

      const newField: Omit<BiodataField, "id" | "order"> = {
        label: formData.label.trim(),
        labelHindi: formData.labelHindi.trim() || undefined,
        type: formData.type,
        value: "",
        placeholder: formData.placeholder.trim() || undefined,
        options,
        visible: true,
        editable: true,
      };

      onAddField(newField);
      handleClose();
    },
    [formData, optionsText, validateForm, onAddField, handleClose]
  );

  const updateField = <K extends keyof FieldFormData>(
    key: K,
    value: FieldFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when field is updated
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Field</DialogTitle>
          <DialogDescription>
            Add a new field to {sectionName ? `"${sectionName}"` : "the section"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field Label */}
          <Input
            label="Field Label"
            placeholder="e.g., Zodiac Sign"
            value={formData.label}
            onChange={(e) => updateField("label", e.target.value)}
            error={errors.label}
            required
          />

          {/* Hindi Label (Optional) */}
          <Input
            label="Hindi Label (Optional)"
            placeholder="e.g., राशि"
            value={formData.labelHindi}
            onChange={(e) => updateField("labelHindi", e.target.value)}
          />

          {/* Field Type */}
          <div className="flex flex-col gap-1.5">
            <Select
              value={formData.type}
              onValueChange={(value) => updateField("type", value as FieldType)}
            >
              <SelectTrigger label="Field Type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Options for Select Fields */}
          {formData.type === "select" && (
            <Textarea
              label="Options (one per line)"
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              value={optionsText}
              onChange={(e) => {
                setOptionsText(e.target.value);
                if (errors.options) {
                  setErrors((prev) => ({ ...prev, options: undefined }));
                }
              }}
              error={errors.options}
              rows={4}
              required
            />
          )}

          {/* Placeholder */}
          {formData.type !== "select" && (
            <Input
              label="Placeholder (Optional)"
              placeholder="Hint text for the field"
              value={formData.placeholder}
              onChange={(e) => updateField("placeholder", e.target.value)}
            />
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddFieldModal;
