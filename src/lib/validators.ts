import { Biodata, BiodataField, BiodataExport, ValidationResult } from "@/types/biodata";

/**
 * Form validation utilities for biodata fields
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  // Accepts: +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX
  const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/[\s-]/g, "");
  return phoneRegex.test(cleanPhone);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate date string (YYYY-MM-DD format)
 */
export function isValidDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validate a single field
 */
export function validateField(field: BiodataField): { isValid: boolean; message?: string } {
  const { type, value, validation } = field;

  // Skip validation if value is empty
  if (!value.trim()) {
    return { isValid: true };
  }

  // Type-specific validation
  switch (type) {
    case "email":
      if (!isValidEmail(value)) {
        return { isValid: false, message: "Please enter a valid email address" };
      }
      break;

    case "phone":
      if (!isValidPhone(value)) {
        return { isValid: false, message: "Please enter a valid phone number" };
      }
      break;

    case "url":
      if (!isValidUrl(value)) {
        return { isValid: false, message: "Please enter a valid URL" };
      }
      break;

    case "date":
      if (!isValidDate(value)) {
        return { isValid: false, message: "Please enter a valid date" };
      }
      break;
  }

  // Custom validation
  if (validation) {
    if (validation.minLength && value.length < validation.minLength) {
      return {
        isValid: false,
        message: validation.message || `Minimum ${validation.minLength} characters required`,
      };
    }

    if (validation.maxLength && value.length > validation.maxLength) {
      return {
        isValid: false,
        message: validation.message || `Maximum ${validation.maxLength} characters allowed`,
      };
    }

    if (validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        return {
          isValid: false,
          message: validation.message || "Invalid format",
        };
      }
    }
  }

  return { isValid: true };
}

/**
 * Validate entire biodata
 */
export function validateBiodata(biodata: Biodata): ValidationResult {
  const errors: ValidationResult["errors"] = [];

  for (const section of biodata.sections) {
    if (!section.visible) continue;

    for (const field of section.fields) {
      if (!field.visible) continue;

      const result = validateField(field);
      if (!result.isValid && result.message) {
        errors.push({
          fieldId: field.id,
          sectionId: section.id,
          message: result.message,
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate biodata export data structure
 */
export function validateBiodataExport(data: unknown): data is BiodataExport {
  if (!data || typeof data !== "object") return false;

  const exportData = data as Record<string, unknown>;

  // Check required properties
  if (typeof exportData.version !== "string") return false;
  if (typeof exportData.exportedAt !== "string") return false;
  if (!exportData.data || typeof exportData.data !== "object") return false;

  const biodata = exportData.data as Record<string, unknown>;

  // Check biodata structure
  if (typeof biodata.id !== "string") return false;
  if (typeof biodata.createdAt !== "string") return false;
  if (typeof biodata.updatedAt !== "string") return false;
  if (!Array.isArray(biodata.sections)) return false;
  if (typeof biodata.templateId !== "string") return false;

  return true;
}

/**
 * Current export version for compatibility checking
 */
export const CURRENT_EXPORT_VERSION = "1.0.0";

/**
 * Check if export version is compatible
 */
export function isCompatibleVersion(version: string): boolean {
  const [major] = version.split(".");
  const [currentMajor] = CURRENT_EXPORT_VERSION.split(".");
  return major === currentMajor;
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Check if file is a valid image
 */
export function isValidImageFile(file: File): { isValid: boolean; message?: string } {
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      message: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      message: "Image size must be less than 5MB",
    };
  }

  return { isValid: true };
}

/**
 * Validate JSON file for import
 */
export function validateJsonFile(file: File): { isValid: boolean; message?: string } {
  if (file.type !== "application/json" && !file.name.endsWith(".json")) {
    return {
      isValid: false,
      message: "Please upload a valid JSON file",
    };
  }

  const maxSize = 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      message: "JSON file size must be less than 1MB",
    };
  }

  return { isValid: true };
}
