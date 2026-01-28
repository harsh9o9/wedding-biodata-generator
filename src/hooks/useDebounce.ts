"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook that returns a debounced version of the provided value
 * Updates only after the specified delay has passed without changes
 * 
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook that returns a debounced callback function
 * The callback will only be invoked after the specified delay has passed
 * without the function being called again
 * 
 * @param callback - The function to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref on each render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

/**
 * Hook that provides both immediate and debounced values
 * Useful when you want to show immediate feedback but defer expensive operations
 * 
 * @param value - The value to track
 * @param delay - The debounce delay in milliseconds
 * @returns Object with immediate value, debounced value, and pending status
 */
export function useDebouncedState<T>(
  value: T,
  delay: number
): {
  immediateValue: T;
  debouncedValue: T;
  isPending: boolean;
} {
  const debouncedValue = useDebounce(value, delay);
  
  // Derive isPending from comparing immediate and debounced values
  // This avoids the need for additional state updates
  const isPending = value !== debouncedValue;

  return {
    immediateValue: value,
    debouncedValue,
    isPending,
  };
}

/**
 * Hook for debouncing with leading edge execution
 * Executes immediately on first call, then debounces subsequent calls
 * 
 * @param callback - The function to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced callback function
 */
export function useLeadingDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const hasCalledRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      // Execute immediately on first call
      if (!hasCalledRef.current) {
        hasCalledRef.current = true;
        callbackRef.current(...args);
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset the flag after delay
      timeoutRef.current = setTimeout(() => {
        hasCalledRef.current = false;
      }, delay);
    },
    [delay]
  );
}

/**
 * Hook that creates a debounced version of a setter function
 * Useful with useState to debounce state updates
 * 
 * @param setter - The setter function (e.g., from useState)
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced setter function
 */
export function useDebouncedSetter<T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  delay: number
): React.Dispatch<React.SetStateAction<T>> {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (value: React.SetStateAction<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setter(value);
      }, delay);
    },
    [setter, delay]
  );
}

export default useDebounce;
