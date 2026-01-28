"use client";

import { useState, useCallback, useMemo } from "react";
import { useBiodata, useBiodataSection, useBiodataField } from "@/context/BiodataContext";
import { ValidationResult } from "@/types/biodata";
import { validateField, validateBiodata } from "@/lib/validators";
import { useDebounce } from "./useDebounce";

/**
 * Hook for managing form state and validation for the entire biodata
 * Provides validation, dirty tracking, and submission handling
 */
export function useBiodataForm() {
  const { biodata, isDirty, isSaving, lastSaved, reset, exportData } = useBiodata();
  
  const [hasValidated, setHasValidated] = useState(false);

  // Debounce biodata changes for validation
  const debouncedBiodata = useDebounce(biodata, 500);

  // Compute validation result using useMemo when hasValidated is true
  // This avoids setState in useEffect
  const validationResult = useMemo<ValidationResult>(() => {
    if (!hasValidated) {
      return { isValid: true, errors: [] };
    }
    return validateBiodata(debouncedBiodata);
  }, [debouncedBiodata, hasValidated]);

  // Validate entire form
  const validate = useCallback((): ValidationResult => {
    setHasValidated(true);
    // Return immediate validation result
    return validateBiodata(biodata);
  }, [biodata]);

  // Check if form is submittable
  const isSubmittable = useMemo(() => {
    if (!hasValidated) return true; // Allow submission attempt before validation
    return validationResult.isValid;
  }, [hasValidated, validationResult.isValid]);

  // Get error for a specific field
  const getFieldError = useCallback(
    (sectionId: string, fieldId: string): string | undefined => {
      return validationResult.errors.find(
        (e) => e.sectionId === sectionId && e.fieldId === fieldId
      )?.message;
    },
    [validationResult.errors]
  );

  // Check if a field has error
  const hasFieldError = useCallback(
    (sectionId: string, fieldId: string): boolean => {
      return validationResult.errors.some(
        (e) => e.sectionId === sectionId && e.fieldId === fieldId
      );
    },
    [validationResult.errors]
  );

  // Get all errors for a section
  const getSectionErrors = useCallback(
    (sectionId: string) => {
      return validationResult.errors.filter((e) => e.sectionId === sectionId);
    },
    [validationResult.errors]
  );

  // Check if a section has errors
  const hasSectionErrors = useCallback(
    (sectionId: string): boolean => {
      return validationResult.errors.some((e) => e.sectionId === sectionId);
    },
    [validationResult.errors]
  );

  // Clear validation state
  // Since validation is computed via useMemo, just reset hasValidated
  const clearValidation = useCallback(() => {
    setHasValidated(false);
  }, []);

  // Reset form and validation
  const resetForm = useCallback(() => {
    clearValidation();
    reset();
  }, [clearValidation, reset]);

  // Get completion percentage based on filled fields
  const completionPercentage = useMemo(() => {
    let totalFields = 0;
    let completedFields = 0;

    for (const section of biodata.sections) {
      if (!section.visible) continue;
      
      for (const field of section.fields) {
        if (!field.visible) continue;
        totalFields++;
        if (field.value.trim()) {
          completedFields++;
        }
      }
    }

    return totalFields > 0 
      ? Math.round((completedFields / totalFields) * 100) 
      : 100;
  }, [biodata.sections]);

  return {
    biodata,
    isDirty,
    isSaving,
    lastSaved,
    validate,
    validationResult,
    hasValidated,
    isSubmittable,
    getFieldError,
    hasFieldError,
    getSectionErrors,
    hasSectionErrors,
    clearValidation,
    resetForm,
    exportData,
    completionPercentage,
  };
}

/**
 * Hook for managing form state of a single section
 */
export function useSectionForm(sectionId: string) {
  const {
    section,
    updateSection,
    updateFieldInSection,
    addFieldToSection,
    removeFieldFromSection,
    reorderFieldsInSection,
  } = useBiodataSection(sectionId);

  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Validate all fields in section
  const validateSection = useCallback((): boolean => {
    if (!section) return false;

    const newErrors = new Map<string, string>();
    let isValid = true;

    for (const field of section.fields) {
      if (!field.visible) continue;
      
      const result = validateField(field);
      if (!result.isValid && result.message) {
        newErrors.set(field.id, result.message);
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [section]);

  // Validate a single field
  const validateFieldById = useCallback(
    (fieldId: string): boolean => {
      if (!section) return false;

      const field = section.fields.find((f) => f.id === fieldId);
      if (!field) return false;

      const result = validateField(field);
      
      setErrors((prev) => {
        const newErrors = new Map(prev);
        if (!result.isValid && result.message) {
          newErrors.set(fieldId, result.message);
        } else {
          newErrors.delete(fieldId);
        }
        return newErrors;
      });

      return result.isValid;
    },
    [section]
  );

  // Mark field as touched (for showing errors on blur)
  const touchField = useCallback((fieldId: string) => {
    setTouched((prev) => new Set(prev).add(fieldId));
  }, []);

  // Update field value with optional validation
  const updateFieldValue = useCallback(
    (fieldId: string, value: string, shouldValidate = true) => {
      updateFieldInSection(fieldId, value);
      
      if (shouldValidate && touched.has(fieldId)) {
        // Delay validation slightly to allow state to update
        setTimeout(() => validateFieldById(fieldId), 0);
      }
    },
    [updateFieldInSection, touched, validateFieldById]
  );

  // Handle field blur
  const handleFieldBlur = useCallback(
    (fieldId: string) => {
      touchField(fieldId);
      validateFieldById(fieldId);
    },
    [touchField, validateFieldById]
  );

  // Get error for field (only if touched)
  const getFieldError = useCallback(
    (fieldId: string): string | undefined => {
      if (!touched.has(fieldId)) return undefined;
      return errors.get(fieldId);
    },
    [errors, touched]
  );

  // Check if field has error
  const hasFieldError = useCallback(
    (fieldId: string): boolean => {
      return touched.has(fieldId) && errors.has(fieldId);
    },
    [errors, touched]
  );

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors(new Map());
    setTouched(new Set());
  }, []);

  // Get visible fields sorted by order
  const visibleFields = useMemo(() => {
    if (!section) return [];
    return section.fields
      .filter((f) => f.visible)
      .sort((a, b) => a.order - b.order);
  }, [section]);

  return {
    section,
    visibleFields,
    errors,
    touched,
    updateSection,
    updateFieldValue,
    addFieldToSection,
    removeFieldFromSection,
    reorderFieldsInSection,
    validateSection,
    validateFieldById,
    touchField,
    handleFieldBlur,
    getFieldError,
    hasFieldError,
    clearErrors,
  };
}

/**
 * Hook for managing form state of a single field
 */
export function useFieldForm(sectionId: string, fieldId: string) {
  const { field, updateValue, updateConfig } = useBiodataField(sectionId, fieldId);
  
  const [touched, setTouched] = useState(false);

  // Debounce the field value for validation
  const debouncedValue = useDebounce(field?.value || "", 300);

  // Compute validation result using useMemo instead of useEffect + setState
  const validationState = useMemo(() => {
    if (!touched || !field) {
      return { error: undefined, isValidating: false };
    }
    const result = validateField({ ...field, value: debouncedValue });
    return {
      error: result.isValid ? undefined : result.message,
      isValidating: false,
    };
  }, [touched, field, debouncedValue]);

  // Track if validation is "pending" (immediate value differs from debounced)
  const isValidating = touched && field?.value !== debouncedValue;

  // Validate field
  const validate = useCallback((): boolean => {
    if (!field) return false;
    setTouched(true);
    const result = validateField(field);
    return result.isValid;
  }, [field]);

  // Handle value change
  const handleChange = useCallback(
    (value: string) => {
      updateValue(value);
    },
    [updateValue]
  );

  // Handle blur
  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  // Handle focus
  const handleFocus = useCallback(() => {
    // Optionally clear error on focus
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setTouched(false);
  }, []);

  // Get display error (only when touched)
  const displayError = touched ? validationState.error : undefined;

  // Check if field is valid
  const isValid = !validationState.error;

  return {
    field,
    value: field?.value || "",
    error: displayError,
    touched,
    isValid,
    isValidating,
    handleChange,
    handleBlur,
    handleFocus,
    validate,
    clearError,
    updateConfig,
  };
}

/**
 * Hook for managing field visibility and editing state
 */
export function useFieldEditing(sectionId: string, fieldId: string) {
  const { field, updateConfig } = useBiodataField(sectionId, fieldId);
  const [isEditing, setIsEditing] = useState(false);

  const toggleVisibility = useCallback(() => {
    if (field) {
      updateConfig({ visible: !field.visible });
    }
  }, [field, updateConfig]);

  const toggleEditable = useCallback(() => {
    if (field) {
      updateConfig({ editable: !field.editable });
    }
  }, [field, updateConfig]);

  const setLabel = useCallback(
    (label: string) => {
      updateConfig({ label });
    },
    [updateConfig]
  );

  const setLabelHindi = useCallback(
    (labelHindi: string) => {
      updateConfig({ labelHindi });
    },
    [updateConfig]
  );

  const setPlaceholder = useCallback(
    (placeholder: string) => {
      updateConfig({ placeholder });
    },
    [updateConfig]
  );

  const setOptions = useCallback(
    (options: string[]) => {
      updateConfig({ options });
    },
    [updateConfig]
  );

  return {
    field,
    isEditing,
    setIsEditing,
    toggleVisibility,
    toggleEditable,
    setLabel,
    setLabelHindi,
    setPlaceholder,
    setOptions,
    updateConfig,
  };
}

export default useBiodataForm;
