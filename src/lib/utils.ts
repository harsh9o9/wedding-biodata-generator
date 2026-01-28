import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * Uses clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID for fields and sections
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string, locale = "en-IN"): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Format a date string for file naming
 */
export function formatDateForFilename(dateString?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toISOString().split("T")[0];
}

/**
 * Sanitize a string for use in filenames
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

/**
 * Generate a filename for biodata export
 */
export function generateBiodataFilename(name: string, extension: string): string {
  const sanitizedName = sanitizeFilename(name) || "biodata";
  const dateStr = formatDateForFilename();
  return `biodata_${sanitizedName}_${dateStr}.${extension}`;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function for rate limiting
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if running on client side
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Convert file to base64 data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compress an image file
 */
export async function compressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate storage size of a string (for localStorage quota management)
 */
export function getStringByteSize(str: string): number {
  return new Blob([str]).size;
}

/**
 * Format byte size for display
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Error types for localStorage operations
 */
export type StorageError = {
  type: "quota_exceeded" | "security_error" | "parse_error" | "unknown";
  message: string;
  originalError?: Error;
};

/**
 * Safe localStorage get with error handling
 * Returns null if item doesn't exist or on error
 */
export function safeLocalStorageGet<T>(key: string): { data: T | null; error: StorageError | null } {
  if (!isClient()) {
    return { data: null, error: null };
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return { data: null, error: null };
    }
    const parsed = JSON.parse(item) as T;
    return { data: parsed, error: null };
  } catch (error) {
    const err = error as Error;
    if (err.name === "SyntaxError") {
      return {
        data: null,
        error: {
          type: "parse_error",
          message: "Failed to parse stored data. The data may be corrupted.",
          originalError: err,
        },
      };
    }
    if (err.name === "SecurityError") {
      return {
        data: null,
        error: {
          type: "security_error",
          message: "Storage access denied. Please check your browser settings.",
          originalError: err,
        },
      };
    }
    return {
      data: null,
      error: {
        type: "unknown",
        message: "An unexpected error occurred while reading from storage.",
        originalError: err,
      },
    };
  }
}

/**
 * Safe localStorage set with error handling
 * Returns error if quota exceeded or other issues
 */
export function safeLocalStorageSet<T>(key: string, value: T): StorageError | null {
  if (!isClient()) {
    return null;
  }

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return null;
  } catch (error) {
    const err = error as Error;
    if (
      err.name === "QuotaExceededError" ||
      err.message.includes("quota") ||
      err.message.includes("QuotaExceeded")
    ) {
      return {
        type: "quota_exceeded",
        message: "Storage quota exceeded. Please export your data and clear some space.",
        originalError: err,
      };
    }
    if (err.name === "SecurityError") {
      return {
        type: "security_error",
        message: "Storage access denied. Please check your browser settings.",
        originalError: err,
      };
    }
    return {
      type: "unknown",
      message: "Failed to save data to storage.",
      originalError: err,
    };
  }
}

/**
 * Safe localStorage remove
 */
export function safeLocalStorageRemove(key: string): StorageError | null {
  if (!isClient()) {
    return null;
  }

  try {
    localStorage.removeItem(key);
    return null;
  } catch (error) {
    const err = error as Error;
    return {
      type: "unknown",
      message: "Failed to remove data from storage.",
      originalError: err,
    };
  }
}

/**
 * Get estimated localStorage usage
 * Returns bytes used and approximate quota
 */
export function getStorageUsage(): { used: number; usedFormatted: string; quota: number; percentage: number } {
  if (!isClient()) {
    return { used: 0, usedFormatted: "0 Bytes", quota: 5 * 1024 * 1024, percentage: 0 };
  }

  let totalSize = 0;
  try {
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        totalSize += localStorage.getItem(key)?.length || 0;
      }
    }
  } catch {
    // Ignore errors
  }

  // localStorage quota is typically 5MB (5 * 1024 * 1024 bytes)
  const quota = 5 * 1024 * 1024;
  const used = totalSize * 2; // UTF-16 encoding doubles the size
  
  return {
    used,
    usedFormatted: formatBytes(used),
    quota,
    percentage: Math.round((used / quota) * 100),
  };
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (!isClient()) {
    return false;
  }

  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
