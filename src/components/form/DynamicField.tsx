"use client";

import React, { useCallback } from "react";
import {
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { BiodataField } from "@/types/biodata";
import { cn } from "@/lib/utils";

interface DynamicFieldProps {
  field: BiodataField;
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  showHindiLabel?: boolean;
  className?: string;
}

/**
 * DynamicField - Renders the appropriate input based on field type
 */
export function DynamicField({
  field,
  value,
  error,
  disabled,
  onChange,
  onBlur,
  onFocus,
  showHindiLabel = false,
  className,
}: DynamicFieldProps) {
  const label = showHindiLabel && field.labelHindi
    ? `${field.label} (${field.labelHindi})`
    : field.label;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleSelectChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange]
  );

  // Common props for text-based inputs
  const commonProps = {
    label,
    placeholder: field.placeholder,
    disabled: disabled || !field.editable,
    error,
    onBlur,
    onFocus,
    className: cn("w-full", className),
  };

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          {...commonProps}
          value={value}
          onChange={handleChange}
          rows={3}
        />
      );

    case "select":
      return (
        <div className="flex flex-col gap-1.5">
          <Select
            value={value}
            onValueChange={handleSelectChange}
            disabled={disabled || !field.editable}
          >
            <SelectTrigger label={label} error={error}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "date":
      return (
        <Input
          {...commonProps}
          type="date"
          value={value}
          onChange={handleChange}
        />
      );

    case "time":
      return (
        <Input
          {...commonProps}
          type="time"
          value={value}
          onChange={handleChange}
        />
      );

    case "email":
      return (
        <Input
          {...commonProps}
          type="email"
          value={value}
          onChange={handleChange}
        />
      );

    case "phone":
      return (
        <Input
          {...commonProps}
          type="tel"
          value={value}
          onChange={handleChange}
        />
      );

    case "number":
      return (
        <Input
          {...commonProps}
          type="number"
          value={value}
          onChange={handleChange}
        />
      );

    case "url":
      return (
        <Input
          {...commonProps}
          type="url"
          value={value}
          onChange={handleChange}
        />
      );

    case "image":
      // Image fields are handled separately in PhotoUploader
      return null;

    case "text":
    default:
      return (
        <Input
          {...commonProps}
          type="text"
          value={value}
          onChange={handleChange}
        />
      );
  }
}

export default DynamicField;
