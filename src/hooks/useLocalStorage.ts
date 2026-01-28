"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { isClient } from "@/lib/utils";

/**
 * A generic hook for interacting with localStorage
 * Uses useSyncExternalStore for React 18+ compatibility
 * Handles SSR safety and synchronization across tabs
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns [storedValue, setValue, removeValue] - Tuple of value, setter, and remover
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Parse value from localStorage
  const getStoredValue = useCallback((): T => {
    if (!isClient()) return initialValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // Subscribe to storage events
  const subscribe = useCallback(
    (callback: () => void) => {
      if (!isClient()) return () => {};
      
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key || event.key === null) {
          callback();
        }
      };
      
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    },
    [key]
  );

  // Get snapshot for useSyncExternalStore
  const getSnapshot = useCallback(() => {
    return JSON.stringify(getStoredValue());
  }, [getStoredValue]);

  // Server snapshot returns initial value
  const getServerSnapshot = useCallback(() => {
    return JSON.stringify(initialValue);
  }, [initialValue]);

  // Use useSyncExternalStore for external state sync
  const serializedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const storedValue = JSON.parse(serializedValue) as T;

  // Use state to trigger re-renders on local updates
  const [localVersion, setLocalVersion] = useState(0);

  // Set value in localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const currentValue = getStoredValue();
        const valueToStore = value instanceof Function ? value(currentValue) : value;

        if (isClient()) {
          localStorage.setItem(key, JSON.stringify(valueToStore));
          // Trigger re-render
          setLocalVersion((v) => v + 1);
          // Dispatch storage event for other hooks listening to this key
          window.dispatchEvent(new StorageEvent("storage", { key }));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, getStoredValue]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      if (isClient()) {
        localStorage.removeItem(key);
        setLocalVersion((v) => v + 1);
        window.dispatchEvent(new StorageEvent("storage", { key }));
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  // Include localVersion in dependencies to ensure re-renders
  void localVersion;

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for checking if localStorage is available
 * Useful for conditional rendering of features that require localStorage
 */
export function useLocalStorageAvailable(): boolean {
  const getSnapshot = useCallback(() => {
    if (!isClient()) return false;
    
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }, []);

  const subscribe = useCallback(() => {
    // localStorage availability doesn't change, so no subscription needed
    return () => {};
  }, []);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Hook to get the current localStorage usage
 * Returns an object with used and total bytes (estimated)
 */
export function useLocalStorageUsage(): {
  usedBytes: number;
  totalBytes: number;
  percentUsed: number;
} {
  const calculateUsage = useCallback(() => {
    if (!isClient()) {
      return { usedBytes: 0, totalBytes: 5 * 1024 * 1024, percentUsed: 0 };
    }
    
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          total += key.length + value.length;
        }
      }
    }
    // Convert to bytes (each character is 2 bytes in UTF-16)
    const usedBytes = total * 2;
    const totalBytes = 5 * 1024 * 1024;
    const percentUsed = (usedBytes / totalBytes) * 100;

    return { usedBytes, totalBytes, percentUsed };
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    if (!isClient()) return () => {};
    
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return JSON.stringify(calculateUsage());
  }, [calculateUsage]);

  const getServerSnapshot = useCallback(() => {
    return JSON.stringify({ usedBytes: 0, totalBytes: 5 * 1024 * 1024, percentUsed: 0 });
  }, []);

  const serializedUsage = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return JSON.parse(serializedUsage);
}

export default useLocalStorage;
